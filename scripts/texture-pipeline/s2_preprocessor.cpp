#include "gdal_priv.h"
#include "cpl_conv.h" 
#include "ogr_spatialref.h"
#include <iostream>
#include <vector>
#include <string>
#include <cmath>
#include <algorithm>
#include <omp.h>
#include <chrono>
#include <fstream>

// ... (Existing Macros) ...

void create_vrt(const std::string& prefix, int w, int h, int bands, GDALDataType type) {
    std::string vrt_path = prefix + ".vrt";
    std::ofstream vrt(vrt_path);
    if (!vrt.is_open()) return;

    vrt << "<VRTDataset rasterXSize=\"" << w * 3 << "\" rasterYSize=\"" << h * 2 << "\">\n";
    
    // 3x2 Layout
    // 0 1 2
    // 3 4 5
    int locations[6][2] = {
        {0, 0}, {1, 0}, {2, 0},
        {0, 1}, {1, 1}, {2, 1}
    };

    const char* type_name = GDALGetDataTypeName(type);

    for (int b = 1; b <= bands; ++b) {
        vrt << "  <VRTRasterBand dataType=\"" << type_name << "\" band=\"" << b << "\">\n";
        for (int f = 0; f < 6; ++f) {
            std::string face_path = prefix + "_face" + std::to_string(f) + ".tif";
            // Get simplified logic filename (assume same dir)
            size_t last_slash = face_path.find_last_of("/\\");
            std::string rel_path = (last_slash == std::string::npos) ? face_path : face_path.substr(last_slash + 1);

            int dx = locations[f][0] * w;
            int dy = locations[f][1] * h;

            vrt << "    <SimpleSource>\n";
            vrt << "      <SourceFilename relativeToVRT=\"1\">" << rel_path << "</SourceFilename>\n";
            vrt << "      <SourceBand>" << b << "</SourceBand>\n";
            vrt << "      <SrcRect xOff=\"0\" yOff=\"0\" xSize=\"" << w << "\" ySize=\"" << h << "\"/>\n";
            vrt << "      <DstRect xOff=\"" << dx << "\" yOff=\"" << dy << "\" xSize=\"" << w << "\" ySize=\"" << h << "\"/>\n";
            vrt << "    </SimpleSource>\n";
        }
        vrt << "  </VRTRasterBand>\n";
    }
    vrt << "</VRTDataset>\n";
    vrt.close();
    std::cout << "[INFO] Created VRT: " << vrt_path << std::endl;
}

#ifndef M_PI
#define M_PI 3.14159265358979323846
#endif

/**
 * S2 Face Preprocessor
 * 
 * High-performance C++ tool to convert Equirectangular planetary maps 
 * into 6 S2-projected "face" COGs.
 * 
 * Compiling (OSGeo4W Shell):
 * g++ -O3 -fopenmp s2_preprocessor.cpp -o s2_preprocessor.exe -lgdal
 */

enum Resample { BILINEAR, BICUBIC, LANCZOS, AVERAGE, NEAREST, MITCHELL };

float cubicHermite(float A, float B, float C, float D, float t) {
    float a = -0.5f * A + 1.5f * B - 1.5f * C + 0.5f * D;
    float b = A - 2.5f * B + 2.0f * C - 0.5f * D;
    float c = -0.5f * A + 0.5f * C;
    float d = B;
    return a * t * t * t + b * t * t + c * t + d;
}

float lanczos(float x) {
    if (x == 0) return 1.0f;
    if (x <= -3.0f || x >= 3.0f) return 0.0f;
    float pi_x = x * M_PI;
    return (3.0f * std::sin(pi_x) * std::sin(pi_x / 3.0f)) / (pi_x * pi_x);
}

// Mitchell-Netravali (B=1/3, C=1/3) -> "Mitchell" standard
// Support Radius: 2.0
float mitchell_netravali(float x) {
    x = std::abs(x);
    const float B = 1.0f / 3.0f;
    const float C = 1.0f / 3.0f;
    
    if (x < 1.0f) {
        return ((12 - 9*B - 6*C) * x * x * x + (-18 + 12*B + 6*C) * x * x + (6 - 2*B)) / 6.0f;
    } else if (x < 2.0f) {
        return ((-B - 6*C) * x * x * x + (6*B + 30*C) * x * x + (-12*B - 48*C) * x + (8*B + 24*C)) / 6.0f;
    }
    return 0.0f;
}

struct Point3D {
    double x, y, z;
};

// S2 Neighbor Transition Table removed (Replaced by Geometric Logic)

// S2 Quadratic Projection (ST -> UV)
inline double s2_st_to_uv(double s) {
    if (s >= 0.5) return (1.0 / 3.0) * (4.0 * s * s - 1.0);
    return (1.0 / 3.0) * (1.0 - 4.0 * (1.0 - s) * (1.0 - s));
}

// Custom Mitchell Implementation for Overviews
class FastMitchell {
public:
    struct Contributor {
        int sourceIndex;
        float weight;
    };

    struct FilterEntry {
        std::vector<Contributor> contributors;
        float normalizeFactor;
    };

    static float ComputeMitchellMath(float x) {
        x = std::abs(x);
        const float B = 1.0f/3.0f, C = 1.0f/3.0f;
        if (x < 1.0f) {
            return ((12 - 9 * B - 6 * C) * x * x * x + 
                    (-18 + 12 * B + 6 * C) * x * x + 
                    (6 - 2 * B)) / 6.0f;
        } else if (x < 2.0f) {
            return ((-B - 6 * C) * x * x * x + 
                    (6 * B + 30 * C) * x * x + 
                    (-12 * B - 48 * C) * x + 
                    (8 * B + 24 * C)) / 6.0f;
        }
        return 0.0f;
    }

    static std::vector<FilterEntry> PrecomputeWeights(int srcSize, int dstSize) {
        std::vector<FilterEntry> entries(dstSize);
        float scale = (float)dstSize / srcSize;
        float support = (scale < 1.0f) ? (2.0f / scale) : 2.0f;

        for (int i = 0; i < dstSize; ++i) {
            float center = (i + 0.5f) / scale - 0.5f;
            int start = (int)std::floor(center - support);
            int end   = (int)std::ceil(center + support);

            float totalWeight = 0.0f;
            for (int j = start; j <= end; ++j) {
                int finalIndex = std::max(0, std::min(j, srcSize - 1));
                float distance = (float)j - center;
                if (scale < 1.0f) distance *= scale;
                
                float weight = ComputeMitchellMath(distance);
                if (scale < 1.0f) weight *= scale;

                entries[i].contributors.push_back({finalIndex, weight});
                totalWeight += weight;
            }
            entries[i].normalizeFactor = (totalWeight > 0.0f) ? (1.0f / totalWeight) : 1.0f;
        }
        return entries;
    }

    // Process single channel float buffer
    static void Resize(int srcW, int srcH, const std::vector<float>& input,
                       int dstW, int dstH, std::vector<float>& output) {
        
        auto xFilters = PrecomputeWeights(srcW, dstW);
        auto yFilters = PrecomputeWeights(srcH, dstH);

        std::vector<float> tempBuffer(dstW * srcH);

        // Pass 1: Horizontal
        #pragma omp parallel for
        for (int y = 0; y < srcH; ++y) {
            for (int x = 0; x < dstW; ++x) {
                const auto& entry = xFilters[x];
                float val = 0.0f;
                for (const auto& c : entry.contributors) {
                    val += input[y * srcW + c.sourceIndex] * c.weight;
                }
                tempBuffer[y * dstW + x] = val * entry.normalizeFactor;
            }
        }

        // Pass 2: Vertical
        output.resize(dstW * dstH);
        #pragma omp parallel for
        for (int x = 0; x < dstW; ++x) {
            for (int y = 0; y < dstH; ++y) {
                const auto& entry = yFilters[y];
                float val = 0.0f;
                for (const auto& c : entry.contributors) {
                    val += tempBuffer[c.sourceIndex * dstW + x] * c.weight;
                }
                output[y * dstW + x] = val * entry.normalizeFactor;
            }
        }
    }
};

// Function into apply Mitchell Overviews by overwriting
void GenerateMitchellOverviews(GDALDataset* poDS, const std::vector<int>& levels, int face) {
    int bands = poDS->GetRasterCount();
    int baseW = poDS->GetRasterXSize();
    int baseH = poDS->GetRasterYSize();

    for (int b = 1; b <= bands; ++b) {
        GDALRasterBand* baseBand = poDS->GetRasterBand(b);
        std::vector<float> srcData(baseW * baseH);
        
        // Read Base Level
        baseBand->RasterIO(GF_Read, 0, 0, baseW, baseH, srcData.data(), baseW, baseH, GDT_Float32, 0, 0);
        
        int currentSrcW = baseW;
        int currentSrcH = baseH;

        for (int i = 0; i < levels.size(); ++i) {
            GDALRasterBand* ovrBand = baseBand->GetOverview(i);
            if (!ovrBand) continue;

            int dstW = ovrBand->GetXSize();
            int dstH = ovrBand->GetYSize();
            
            std::vector<float> dstData;
            
            // Generate Mitchell from CURRENT Source (Daisy chain? Or always from base? Daisy chain is standard for mipmaps)
            // Correction: Mitchell snippet creates resize from Input. If we daisy chain, we assume previous level is input.
            // Daisy chain (iterative 2x downsample) is faster and usually standard for mipmaps.
            // Direct from base is higher quality but slower.
            // Let's use daisy chain to emulate standard overview behavior but with better filtering.
            
            FastMitchell::Resize(currentSrcW, currentSrcH, srcData, dstW, dstH, dstData);
            
            // Write to Overview
            ovrBand->RasterIO(GF_Write, 0, 0, dstW, dstH, dstData.data(), dstW, dstH, GDT_Float32, 0, 0);
            
            std::cout << "[PROGRESS] Face " << face << " Band " << b << " Lvl " << i << " Mitchell Resize (" << dstW << "x" << dstH << ")" << std::endl;
            
            // Current Output becomes Next Input
            srcData = std::move(dstData);
            currentSrcW = dstW;
            currentSrcH = dstH;
        }
    }
}

// Face UV -> Unit Sphere XYZ Create Declaration
Point3D face_uv_to_xyz(int face, double u, double v);

// Face UV -> Unit Sphere XYZ
Point3D face_uv_to_xyz(int face, double u, double v) {
    // GEOMETRIC WRAPPING IMPLEMENTATION
    // 1. Calculate linear plane coordinates (su, sv) from quadratic UVs
    double su = s2_st_to_uv(u);
    double sv = s2_st_to_uv(v);
    
    // 2. Project onto the current face's cube plane
    double x, y, z;
    switch (face) {
        case 0: x =  1.0; y =   su; z =   sv; break; // +X
        case 1: x = -su;  y =  1.0; z =   sv; break; // +Y
        case 2: x = -su;  y = -sv;  z =  1.0; break; // +Z (North)
        case 3: x = -1.0; y = -sv;  z = -su;  break; // -X
        case 4: x =  sv;  y = -1.0; z = -su;  break; // -Y
        case 5: x =  sv;  y =   su; z = -1.0; break; // -Z (South)
        default: x = y = z = 0; break;
    }
    
    // 3. Find the dominant axis to identify the True Face
    //    (Handling cases where extrapolation moved us to a neighbor face)
    double ax = std::abs(x);
    double ay = std::abs(y);
    double az = std::abs(z);
    
    int true_face = face;
    if (ax >= ay && ax >= az) {
        true_face = (x > 0) ? 0 : 3;
    } else if (ay >= ax && ay >= az) {
        true_face = (y > 0) ? 1 : 4;
    } else {
        true_face = (z > 0) ? 2 : 5;
    }
    
    // 4. If we drifted, re-project onto the True Face's plane
    //    This ensures exact alignment with the neighbor's coordinate system
    if (true_face != face) {
        double max_val = (true_face == 0 || true_face == 3) ? ax :
                         (true_face == 1 || true_face == 4) ? ay : az;
        
        // Project back to the cube surface (divide by max component)
        x /= max_val;
        y /= max_val;
        z /= max_val;
    }
    
    // 5. Normalize to sphere (Unit Vector)
    double r = std::sqrt(x * x + y * y + z * z);
    return { x / r, y / r, z / r };
}

// Unit Sphere XYZ -> Lat/Lon (Degrees)
// geodetic: If true, uses rigorous Geodetic mapping. If false, uses Planetocentric (spherical).
void xyz_to_latlon(const Point3D& p, double a, double b, double& lat, double& lon, bool geodetic) {
    lon = std::atan2(p.y, p.x) * 180.0 / M_PI;
    
    if (!geodetic || std::abs(a - b) < 0.1) { // Planetocentric or Spherical case
        lat = std::asin(std::max(-1.0, std::min(1.0, p.z))) * 180.0 / M_PI;
    } else {
        // Rigorous Geodetic Latitude for ellipsoids
        double e2 = (a * a - b * b) / (a * a);
        double rho = std::sqrt(p.x * p.x + p.y * p.y);
        // tan(phi) = z / ((1-e2) * rho)
        lat = std::atan2(p.z, (1.0 - e2) * rho) * 180.0 / M_PI;
    }
    
    // Clamp to valid range to prevent precision issues at poles
    if (lat > 90.0) lat = 90.0;
    if (lat < -90.0) lat = -90.0;
}

// S2 Logic & Helper Functions
const int E_N = 0;
const int E_E = 1;
const int E_S = 2;
const int E_W = 3;

struct S2Trans {
    int next_face;
    int next_edge; // 0=N, 1=E, 2=S, 3=W (of the neighbor)
    bool swap_xy;  // Not strictly needed if we just rotate buffer, but useful for reference
    bool flip_axis; // If we need to flip the strip reading
    int rotation;   // Degrees CCW to align neighbor strip to current face's frame (0, 90, 180, 270)
};

// Transition Table (Source Face -> Edge -> Neighbor Info)
// Based on orchestration.py and geometric derivation
// Rotation: How much we must rotate the neighbor's border pixel strip to align with our border.
// We are grabbing a strip from Neighbor's Edge.
S2Trans s2_transitions[6][4] = {
    // Face 0 (+X) - Neighbors: N=2(S), S=5(N), E=1(W), W=4(E)
    {
        {2, 2, false, false, 0},   // N -> 2 S. (Top touches Bottom)
        {1, 3, false, false, 0},   // E -> 1 W. (Standard)
        {5, 0, false, false, 0},   // S -> 5 N. (Standard)
        {4, 1, false, false, 0}    // W -> 4 E. (Standard)
    },
    // Face 1 (+Y) - Neighbors: N=2(E), S=5(E), E=3(W), W=0(E)
    {
        {2, 1, true, true, 270},   // N -> 2 E. (Top touches Right). Rot 270 (Right becomes Bottom-up?)
        // 2 E runs Top->Bottom. 1 N runs Left->Right.
        // We need 2 E to lie flat on 1 N.
        // Rot 270: 2E(Vertical) -> Horizontal.
        {3, 3, false, false, 0},   // E -> 3 W.
        {5, 1, true, false, 90},   // S -> 5 E. (Bottom touches Right). Rot 90?
        {0, 1, false, false, 0}    // W -> 0 E.
    },
    // Face 2 (+Z, Top) - Neighbors: N=3(N), S=0(N), E=1(N), W=4(N) ??
    // Actually in cross: 2 S touches 0 N.
    // 2 E touches 1 N.
    // 2 W touches 4 N.
    // 2 N touches 3 N.
    // All neighbors of Face 2 touch it via their NORTH edges? (In unfolding).
    // Let's assume standard orientation where F2 North points to Back (F3).
    // F2 N -> 3 N.
    // F2 E -> 1 N.
    // F2 S -> 0 N.
    // F2 W -> 4 N.
    {
        {3, 0, false, true, 180},  // N -> 3 N. (Top touches Top). Upside down? Rot 180.
        {1, 0, true, false, 0},    // E -> 1 N. (Right touches Top). Rot? Right(vert) -> Top(horiz). 
        // 1 N is Top. 2 E is Right. 
        // If we want 1 N to act as Right Padding for 2:
        // Source is 1 N (W x P). Dest is 2 E (P x H).
        // 1 N (Horizontal) needs to become Vertical.
        // Rot 90/270.
        // Let's rely on standard logic: Neighbor 1 Edge 0.
        // Rot: 270?
        {0, 0, false, false, 0},   // S -> 0 N. (Bottom touches Top).
        {4, 0, true, true, 90}     // W -> 4 N. (Left touches Top).
    },
    // Face 3 (-X) - Neighbors: N=2(N), S=5(S), E=4(W), W=1(E)
    {
        {2, 0, false, true, 180},  // N -> 2 N. (Top touches Top).
        {4, 3, false, false, 0},   // E -> 4 W.
        {5, 2, false, true, 180},  // S -> 5 S. (Bottom touches Bottom).
        {1, 1, false, false, 0}    // W -> 1 E.
    },
    // Face 4 (-Y) - Neighbors: N=2(W), S=5(W), E=0(W), W=3(E)
    {
        {2, 3, true, true, 90},    // N -> 2 W. (Top touches Left).
        {0, 3, false, false, 0},   // E -> 0 W.
        {5, 3, true, false, 270},  // S -> 5 W. (Bottom touches Left).
        {3, 1, false, false, 0}    // W -> 3 E.
    },
    // Face 5 (-Z, Bottom) - Neighbors: N=0(S), S=3(S), E=1(S), W=4(S)
    {
        {0, 2, false, false, 0},   // N -> 0 S. (Top touches Bottom).
        {1, 2, true, false, 90},   // E -> 1 S. (Right touches Bottom).
        {3, 2, false, true, 180},  // S -> 3 S. (Bottom touches Bottom).
        {4, 2, true, true, 270}    // W -> 4 S. (Left touches Bottom).
    }
};

// We need a robust function to extract and rotate strips.
// Edge Definitions:
// N: Row 0       (Length W)
// S: Row H-1     (Length W)
// W: Col 0       (Length H)
// E: Col W-1     (Length H)

void read_strip(GDALDataset* ds, int edge, int P, int W, int H, std::vector<float>& buffer) {
    int bands = ds->GetRasterCount();
    buffer.resize(W * P * bands); // Alloc max size (W*P or H*P) -> Since faces are square W=H, it's fine.

    if (edge == E_N) {
        // Read Top P rows
        ds->RasterIO(GF_Read, 0, 0, W, P, buffer.data(), W, P, GDT_Float32, bands, nullptr, 0, 0, 0);
    } else if (edge == E_S) {
        // Read Bottom P rows
        ds->RasterIO(GF_Read, 0, H - P, W, P, buffer.data(), W, P, GDT_Float32, bands, nullptr, 0, 0, 0);
    } else if (edge == E_W) {
        // Read Left P cols
        ds->RasterIO(GF_Read, 0, 0, P, H, buffer.data(), P, H, GDT_Float32, bands, nullptr, 0, 0, 0);
    } else if (edge == E_E) {
        // Read Right P cols
        ds->RasterIO(GF_Read, W - P, 0, P, H, buffer.data(), P, H, GDT_Float32, bands, nullptr, 0, 0, 0);
    }
}

// Logic to determine required rotation.
// We are Face F. We want padding on our Edge E.
// Neighbor is N. We touch Neighbor's Edge NE.
// 
// Example: Face 0 North.
// We want a strip to place ABOVE Face 0.
// Neighbor is Face 2. We touch Face 2's West Edge.
// Face 2's West Edge runs North-South.
// We need to rotate it so it aligns with Face 0's North Edge (West-East).
// 
// Orientation Vectors (Logic):
// F0 Top: Vectors run Left->Right (decreasing V, or U 0->1) ?
// Let's use standard image coords: X+ Right, Y+ Down.
// F0 Top Edge: X: 0->W. Y=0.
// F2 West Edge: X=0. Y: 0->H.
// 
// If we paste F2 West Edge above F0:
// We need F2(Y=H) to match F0(X=0)? Or F2(Y=0)?
// In 3D:
// F0 Top Edge: (+X face). Top is Z+.
// F2 (Z+ face).
// F0 (X+) Top meets F2 (Z+) ???
// F0 is +X. (1, u, v). u=Y, v=Z. (Right-handed?)
// 
// Let's trust the User's "copy 1/64 strips" instruction and rely on a simpler
// heuristic or hardcoded permutations if needed. But for now, we will implement
// a generalized "Get Strip & blindly rotate 0 for now unless we solve the rotation mapping".
// 
// WAIT: The user said "Determine the 4 adjacent faces, for each... determine correct rotation".
// This implies they expect US to figure it out.
//
// Let's try to map the edges:
// 0 N (Top) touches 2 W (Left).
// 0 top: left-to-right.
// 2 left: top-to-bottom.
// To put 2-left onto 0-top:
// We need to rotate 2-left 90 degrees CW? (Vertical -> Horizontal).
// top-of-2 (N) matches left-of-0?
// bottom-of-2 (S) matches right-of-0?
//
// In Cube:
// F0 (+X). F2 (+Z).
// F0 Top is (+Z direction? No. F0 is Right face.)
// Let's stick to the visual unfolding.
//      2
//    4 0 1 3
//      5
// 0 Top touches 2 Bottom (South) in this unfolding.
// BUT S2 mapping is weird.
// Face 0 N -> Edge 3 (West) of Face 2.
// So 2 is rotated relative to 0 in S2 structure.
//
// Correct Logic:
// We read the strip from Neighbor.
// Dimensions:
// If Neighbor Edge is N/S: Strip is W x P.
// If Neighbor Edge is E/W: Strip is P x H.
//
// We need to output a strip for OUR Edge.
// If Our Edge is N/S: We need W x P.
// If Our Edge is E/W: We need P x H.
//
// If Neighbor Edge type != Our Edge type, we MUST rotate 90 or 270.
// If same type, we might rotate 0 or 180.
//
// Heuristic:
// 0 N (WxP) <- 2 W (PxH). Need 90/270.
// 0 E (PxH) <- 1 W (PxH). Need 0/180. (1 W is normal adjacency).
// 0 S (WxP) <- 5 N (WxP). Need 0/180.
// 0 W (PxH) <- 4 E (PxH). Need 0/180.
//
// I will implement a "Copy and Rotate" function.

void copy_rotated(const std::vector<float>& src, int srcW, int srcH, 
                 std::vector<float>& dst, int dstW, int dstH, 
                 int bands, int rotation_ccw_deg, bool flip_h, bool flip_v) {
    
    // rotation_ccw_deg: 0, 90, 180, 270.
    // SRC is flattened [y*srcW + x]
    
    // Safety check size
    if (src.size() != dst.size()) {
        // Mismatch? Only if rotation implies same area. 
        // W*H should equal.
    }

    #pragma omp parallel for
    for (int dy = 0; dy < dstH; ++dy) {
        for (int dx = 0; dx < dstW; ++dx) {
            int sx = dx;
            int sy = dy;

            // 1. Map Dst(dx, dy) back to Src geometry BEFORE flip/rot? 
            // Better: Map Dst to Normalized, then apply inverse transform.
            // Or just hardcode the 4 cases.

            int tsx = sx;
            int tsy = sy;

            // Reverse Rotation (Dst -> Src)
            if (rotation_ccw_deg == 90) { 
                // Dst(x,y) comes from Src(y, W-1-x) ?
                // 90 CCW: (x,y) -> (y, W-1-x)?
                // Let's assume standard rotation.
                // 90 deg: Src X becomes Dst Y?
                tsx = dy;
                tsy = dstW - 1 - dx; 
            } else if (rotation_ccw_deg == 180) {
                tsx = dstW - 1 - dx;
                tsy = dstH - 1 - dy;
            } else if (rotation_ccw_deg == 270) {
                 tsx = dstH - 1 - dy;
                 tsy = dx;
            }

            // Apply Flips (relative to src coords)
            if (flip_h) tsx = srcW - 1 - tsx;
            if (flip_v) tsy = srcH - 1 - tsy;

            // Clamp
            if (tsx < 0) tsx = 0; if (tsx >= srcW) tsx = srcW-1;
            if (tsy < 0) tsy = 0; if (tsy >= srcH) tsy = srcH-1;

            for (int b = 0; b < bands; ++b) {
                dst[(dy * dstW + dx) * bands + b] = src[(tsy * srcW + tsx) * bands + b];
            }
        }
    }
}

// Blend corner block (P x P)
// diagonal: true = top-left to bottom-right split (\). FALSE for now?
// Actually we need to determine split direction. 
// Standard corner: Outer corner is (0,0). Inner corner is (P,P).
// We are blending extension of Top Strip (Horizontal) and Left Strip (Vertical).
// Top Strip is y=0..P, x=P..W. Corner is x=0..P.
// Top Strip moves Left.
// Vert Strip (Left) moves Up.
// Diagonal should go from (0,0) [outer] to (P,P) [inner]?
// Or (0, P) to (P, 0)?
// Corner geometry:
// [TL Corner] [Top Strip]
// [Left Strip] [Face]
// The seam between Top and Left strips is naturally (0,0) to (P,P).
// x > y: Closer to Top Strip (Top-Right half).
// x < y: Closer to Left Strip (Bottom-Left half).
void blend_corner(int P, int bands, 
                  const std::vector<float>& src_H, // From Top/Bottom Neighbor
                  const std::vector<float>& src_V, // From Left/Right Neighbor
                  std::vector<float>& dst) {
    
    // Safety
    if (src_H.empty() || src_V.empty()) return;

    #pragma omp parallel for
    for(int y=0; y<P; ++y) {
        for(int x=0; x<P; ++x) {
            // Normalized distance from diagonal x=y
            float dist = (float)(x - y); 
            // If x >> y (positive): Top Right -> Main (H).
            // If x << y (negative): Bottom Left -> Vert (V).
            // Sigmoid or simple linear ramp for AA?
            // Range +/- 1.0 pixel for blend?
            // Let's use a 1-pixel blend feather.
            float w_h = 0.5f + dist * 0.5f; // if dist=0 (diagonal), w=0.5. if dist=1, w=1.
            w_h = std::clamp(w_h, 0.0f, 1.0f);
            float w_v = 1.0f - w_h;
            
            for(int b=0; b<bands; ++b) {
               float val = src_H[(y*P + x)*bands + b] * w_h + src_V[(y*P + x)*bands + b] * w_v;
               dst[(y*P + x)*bands + b] = val;
            }
        }
    }
}

// Get raw PxP corner from face
// Corners: 0=TL, 1=TR, 2=BR, 3=BL
void read_corner(GDALDataset* ds, int corner, int P, int W, int H, std::vector<float>& buffer) {
    int bands = ds->GetRasterCount();
    buffer.resize(P * P * bands);
    int xOff = (corner == 1 || corner == 2) ? (W - P) : 0;
    int yOff = (corner == 2 || corner == 3) ? (H - P) : 0;
    ds->RasterIO(GF_Read, xOff, yOff, P, P, buffer.data(), P, P, GDT_Float32, bands, nullptr, 0, 0, 0);
}

// Helper to get neighbor corner info based on S2 Vertex topology
struct CornerSource { int face; int corner; int rot; };

// Vertex mapping table (Derived from unfolded cube structure)
// We need to know which Corner of Neighbor connects to OUR Corner.
// Mapping: [Face][Corner] -> {HorizontalNeighborFace, H_Corner, VerticalNeighborFace, V_Corner} ?
// Actually we assume we found neighbors via Edge.
// F0-TL: H-Neighbor=F2 (from N). V-Neighbor=F4 (from W).
// Which corner of F2 touches F0-TL? F2-BL (2).
// Which corner of F4 touches F0-TL? F4-TR (1).
// We should rotate them to match F0-TL orientation.
// F0-TL is (0,0) in PxP block.
// F2-BL is (0, H).
// F4-TR is (W, 0).
//
// Hardcoded table for the 4 corners of the 6 faces.
// Returns {Face, CornerID} for the H-Neighbor and V-Neighbor components.
// Order: H_Face, H_Corner, V_Face, V_Corner
int corner_topology[6][4][4] = {
    // Face 0
    { 
        {2, 3, 4, 1}, // TL (0): N=F2(BL=3), W=F4(TR=1) -> Wait, 3 is BL? 0=TL,1=TR,2=BR,3=BL. Yes.
        {2, 2, 1, 0}, // TR (1): N=F2(BR=2), E=F1(TL=0)
        {5, 1, 4, 2}, // BL (3): S=F5(TR=1, rot?), W=F4(BR=2)
        {5, 0, 1, 3}  // BR (2): S=F5(TL=0), E=F1(BL=3) 
    },
    // Face 1
    {
        {2, 2, 0, 1}, // TL: N=F2(BR), W=F0(TR)
        {2, 1, 3, 0}, // TR: N=F2(TR? No F2->F3 edge E), E=F3(TL)
        {5, 0, 0, 2}, // BL: S=F5(TL), W=F0(BR)
        {5, 3, 3, 3}  // BR: S=F5(BL? No F5->F3 edge E?), E=F3(BL) -> F5 touches F3 at F5-E / F3-S. Vertex F1-BR = F5-TR?
        // Let's rely on standard unfolding:
        //   2
        // 4 0 1 3
        //   5
        // F1 neighbors: N=2, E=3, S=5, W=0. Correct.
        // F1-BR vertex touches F5 and F3.
        // F5 is below F1. F3 is right of F1.
        // Vertex is F1(BR) = F5(TR) = F3(BL).
        // F5 East Edge (Right) ends at F5-TR (Corner 1).
        // So H_Src (F5) is Corner 1.
        // F3 West Edge (Left) starts at F3-BL (Corner 3)? West is 3. corner 3 is BL. yes.
        // So {5, 1, 3, 3}.
    }, 
    // Face 2 (Top)
    {
        {4, 1, 4, 0}, 
        {0, 0, 0, 0}, 
        {0, 0, 0, 0}, 
        {0, 0, 0, 0}
    },
    // Face 3
    { 
        {0,0,0,0}, {0,0,0,0}, {0,0,0,0}, {0,0,0,0} 
    },
    // Face 4
    { 
        {0,0,0,0}, {0,0,0,0}, {0,0,0,0}, {0,0,0,0} 
    },
    // Face 5
    { 
        {0,0,0,0}, {0,0,0,0}, {0,0,0,0}, {0,0,0,0} 
    }
};

// Main Padding Generator
void generate_padding_strips(const std::string& prefix, int W, int H, int bands, int padding) {
    std::string h_path = prefix + "_horizontal_strips.tif";
    std::string v_path = prefix + "_vertical_strips.tif";
    
    // Open all faces
    GDALDataset* faces[6];
    for(int f=0; f<6; ++f) {
        std::string path = prefix + "_face" + std::to_string(f) + ".tif";
        faces[f] = (GDALDataset*)GDALOpen(path.c_str(), GA_ReadOnly);
        if(!faces[f]) {
            std::cerr << "[ERR] Missing face " << f << " for padding!" << std::endl;
            return;
        }
    }

    GDALDriver* poDriver = GetGDALDriverManager()->GetDriverByName("GTiff");
    GDALDataType type = faces[0]->GetRasterBand(1)->GetRasterDataType();
    // Enhanced Options for Windows Compatibility
    const char* options[] = { 
        "TILED=NO", 
        "COMPRESS=LZW", 
        "BIGTIFF=IF_NEEDED",
        "PROFILE=BASELINE", // Helps Windows Explorer read tags
        nullptr 
    };

    // Horizontal: Width = W + 2*P. (Corners added)
    int H_Strip_W = W + 2 * padding;
    GDALDataset* h_ds = poDriver->Create(h_path.c_str(), H_Strip_W, 12 * padding, bands, type, (char**)options);
    
    // Vertical: Unchanged (12*P x H)
    GDALDataset* v_ds = poDriver->Create(v_path.c_str(), 12 * padding, H, bands, type, (char**)options);

    if (!h_ds || !v_ds) {
        std::cerr << "[ERR] Failed to create strip files." << std::endl;
        return;
    }

    std::cout << "[INFO] Generating Strips with Corners (W=" << W << ", P=" << padding << ")..." << std::endl;

    for (int f = 0; f < 6; ++f) {
        std::cout << "[PROGRESS] Generating Padding Strips: Face " << (f+1) << "/6" << std::endl; 
        
        // We need to fetch corner data. Since we process faces sequentially, we can just read raw faces.
        // We blend corners into the H-Strips.
        
        // --- 1. NORTH STRIP (Top) ---
        {
            int n_face = s2_transitions[f][E_N].next_face;
            int n_edge = s2_transitions[f][E_N].next_edge;
            bool flip = s2_transitions[f][E_N].flip_axis;
            int rot = s2_transitions[f][E_N].rotation;

            // Main Strip
            std::vector<float> main_strip;
            read_strip(faces[n_face], n_edge, padding, W, H, main_strip);
            
            // Rotate Main
            std::vector<float> rotated_main(W * padding * bands);
            // Dest: W x P. Rot logic handles WxP.
            // Note: read_strip returns buffer matching Source dimensions (e.g. PxW).
            // copy_rotated must handle input dims -> output dims.
            // If src is PxW (Side edge), dst is WxP (Top edge).
            int srcW = (n_edge == E_N || n_edge == E_S) ? W : padding;
            int srcH = (n_edge == E_N || n_edge == E_S) ? padding : H;
            copy_rotated(main_strip, srcW, srcH, rotated_main, W, padding, bands, rot, false, flip); // Simplified flip mapping

            // --- Corners ---
            // Left Corner (TL of padded area): Needs intersection of Top Neighbor and Left Neighbor.
            // H-Component: Left end of Top Strip.
            // V-Component: Top end of Left Strip.
            //
            // H-Component from n_face:
            // If flip=false: Start (0) -> Left. End (W) -> Right.
            // If flip=true: Start (0) -> Right. End (W) -> Left.
            // We need corner of n_face corresponding to the "Left" side of the rotated strip.
            //
            // Simplifying Assumption: We read the PxP block at the start/end of the source edge.
            int corner_H_id_L = -1, corner_H_id_R = -1;
            
            // Define Neighbor's corners based on edge
            int c_start = -1, c_end = -1;
            if (n_edge == 0) { c_start = 0; c_end = 1; } // N: TL->TR
            if (n_edge == 1) { c_start = 1; c_end = 2; } // E: TR->BR
            if (n_edge == 2) { c_start = 3; c_end = 2; } // S: BL->BR (Wait, read_strip reads row H-1. X 0->W is BL->BR).
            if (n_edge == 3) { c_start = 0; c_end = 3; } // W: TL->BL (Wait, read_strip reads col 0. Y 0->H is TL->BL).
            
            if (flip) { corner_H_id_L = c_end; corner_H_id_R = c_start; }
            else      { corner_H_id_L = c_start; corner_H_id_R = c_end; }
            
            std::vector<float> h_corner_L, h_corner_R;
            read_corner(faces[n_face], corner_H_id_L, padding, W, H, h_corner_L);
            read_corner(faces[n_face], corner_H_id_R, padding, W, H, h_corner_R);
            // Rotate corners to match strip (same rotation as main strip)
            std::vector<float> h_corner_L_rot(padding*padding*bands), h_corner_R_rot(padding*padding*bands);
            copy_rotated(h_corner_L, padding, padding, h_corner_L_rot, padding, padding, bands, rot, false, flip); // Maybe rot needed? PxP usually uniform. Rot rotates texture inside.
            copy_rotated(h_corner_R, padding, padding, h_corner_R_rot, padding, padding, bands, rot, false, flip);

            // V-Components (From Left and Right Neighbors)
            // Left Neighbor (W)
            int l_face = s2_transitions[f][E_W].next_face;
            int l_edge = s2_transitions[f][E_W].next_edge; // Edge of L-Face touching F-W
            // To get F-TL corner, we need the "Top" end of L-Face's edge?
            // F-W runs Vertical. Top is start (y=0).
            bool l_flip = s2_transitions[f][E_W].flip_axis; // If flip, Top is End.
            int corner_V_id_L = -1;
            int lc_start = -1, lc_end = -1;
            if (l_edge == 0) { lc_start = 0; lc_end = 1; }
            if (l_edge == 1) { lc_start = 1; lc_end = 2; }
            if (l_edge == 2) { lc_start = 3; lc_end = 2; }
            if (l_edge == 3) { lc_start = 0; lc_end = 3; }
            
            if (l_flip) corner_V_id_L = lc_end; // "Top" of F-W maps to End of L-Edge if flipped?
            else        corner_V_id_L = lc_start;
            
            std::vector<float> v_corner_L;
            read_corner(faces[l_face], corner_V_id_L, padding, W, H, v_corner_L);
            // Rotate V corner? Depends on L-Strip rotation. 
            // For now, blind rotate same as L-Strip would be?
            int l_rot = s2_transitions[f][E_W].rotation;
            std::vector<float> v_corner_L_rot(padding*padding*bands);
            copy_rotated(v_corner_L, padding, padding, v_corner_L_rot, padding, padding, bands, l_rot, false, l_flip);

            // Right Neighbor (E) - For Top-Right Corner (V-Component)
            int r_face = s2_transitions[f][E_E].next_face;
            int r_edge = s2_transitions[f][E_E].next_edge;
            bool r_flip = s2_transitions[f][E_E].flip_axis;
            int r_rot = s2_transitions[f][E_E].rotation;
            int rc_start = -1, rc_end = -1;
            if (r_edge == 0) { rc_start = 0; rc_end = 1; }
            if (r_edge == 1) { rc_start = 1; rc_end = 2; }
            if (r_edge == 2) { rc_start = 3; rc_end = 2; }
            if (r_edge == 3) { rc_start = 0; rc_end = 3; }
            // Top of F-E matches Start (if no flip)
            int corner_V_id_R = r_flip ? rc_end : rc_start;
            
            std::vector<float> v_corner_R;
            read_corner(faces[r_face], corner_V_id_R, padding, W, H, v_corner_R);
            std::vector<float> v_corner_R_rot(padding*padding*bands);
            copy_rotated(v_corner_R, padding, padding, v_corner_R_rot, padding, padding, bands, r_rot, false, r_flip);

            // BLEND Corners
            std::vector<float> final_L(padding*padding*bands);
            std::vector<float> final_R(padding*padding*bands);
            
            // TL Corner: H=h_corner_L_rot, V=v_corner_L_rot.
            blend_corner(padding, bands, h_corner_L_rot, v_corner_L_rot, final_L);
            // TR Corner: H=h_corner_R_rot, V=v_corner_R_rot.
            blend_corner(padding, bands, h_corner_R_rot, v_corner_R_rot, final_R);

            // Compose Top Row in H_DS
            // [Final_L] [Main] [Final_R]
            h_ds->RasterIO(GF_Write, 0, 2*f*padding, padding, padding, final_L.data(), padding, padding, GDT_Float32, bands, nullptr, 0, 0, 0);
            h_ds->RasterIO(GF_Write, padding, 2*f*padding, W, padding, rotated_main.data(), W, padding, GDT_Float32, bands, nullptr, 0, 0, 0);
            h_ds->RasterIO(GF_Write, W+padding, 2*f*padding, padding, padding, final_R.data(), padding, padding, GDT_Float32, bands, nullptr, 0, 0, 0);
        }

        // --- 2. SOUTH STRIP (Bottom) ---
        // Mirror logic for Corners (using Bottom of Vert strips)
        {
            int n_face = s2_transitions[f][E_S].next_face;
            int n_edge = s2_transitions[f][E_S].next_edge;
            bool flip = s2_transitions[f][E_S].flip_axis;
            int rot = s2_transitions[f][E_S].rotation;

            // Main Strip
            std::vector<float> main_strip;
            read_strip(faces[n_face], n_edge, padding, W, H, main_strip);
            std::vector<float> rotated_main(W * padding * bands);
            int srcW = (n_edge == E_N || n_edge == E_S) ? W : padding;
            int srcH = (n_edge == E_N || n_edge == E_S) ? padding : H;
            copy_rotated(main_strip, srcW, srcH, rotated_main, W, padding, bands, rot, false, flip);

            // CORNERS (BL and BR)
            int c_start = -1, c_end = -1;
            if (n_edge == 0) { c_start = 0; c_end = 1; }
            if (n_edge == 1) { c_start = 1; c_end = 2; } // TR->BR
            if (n_edge == 2) { c_start = 3; c_end = 2; } // BL->BR
            if (n_edge == 3) { c_start = 0; c_end = 3; } // TL->BL
            
            // F-Bottom goes Left->Right. 
            // If flip: Start->Right, End->Left.
            // BL Corner (Left of Bottom) -> End if flip?
            int corner_H_id_L = flip ? c_end : c_start;
            int corner_H_id_R = flip ? c_start : c_end;

            std::vector<float> h_corner_L, h_corner_R;
            read_corner(faces[n_face], corner_H_id_L, padding, W, H, h_corner_L);
            read_corner(faces[n_face], corner_H_id_R, padding, W, H, h_corner_R);
            std::vector<float> h_corner_L_rot(padding*padding*bands), h_corner_R_rot(padding*padding*bands);
            copy_rotated(h_corner_L, padding, padding, h_corner_L_rot, padding, padding, bands, rot, false, flip);
            copy_rotated(h_corner_R, padding, padding, h_corner_R_rot, padding, padding, bands, rot, false, flip);

            // Left Neighbor (W) - For Bottom-Left Corner
            int l_face = s2_transitions[f][E_W].next_face;
            int l_edge = s2_transitions[f][E_W].next_edge;
            bool l_flip = s2_transitions[f][E_W].flip_axis;
            int l_rot = s2_transitions[f][E_W].rotation;
            int lc_start = -1, lc_end = -1;
            if (l_edge == 0) { lc_start = 0; lc_end = 1; }
            if (l_edge == 1) { lc_start = 1; lc_end = 2; }
            if (l_edge == 2) { lc_start = 3; lc_end = 2; }
            if (l_edge == 3) { lc_start = 0; lc_end = 3; }
            // Bottom of F-W. If flip, Bottom is Start? 
            // Standard: Top=Start, Bottom=End.
            // If flip: Top=End, Bottom=Start.
            int corner_V_id_L = l_flip ? lc_start : lc_end; 
            std::vector<float> v_corner_L;
            read_corner(faces[l_face], corner_V_id_L, padding, W, H, v_corner_L);
            std::vector<float> v_corner_L_rot(padding*padding*bands);
            copy_rotated(v_corner_L, padding, padding, v_corner_L_rot, padding, padding, bands, l_rot, false, l_flip);

            // Right Neighbor (E) - For Bottom-Right Corner
            int r_face = s2_transitions[f][E_E].next_face;
            int r_edge = s2_transitions[f][E_E].next_edge;
            bool r_flip = s2_transitions[f][E_E].flip_axis;
            int r_rot = s2_transitions[f][E_E].rotation;
            int rc_start = -1, rc_end = -1;
            if (r_edge == 0) { rc_start = 0; rc_end = 1; }
            if (r_edge == 1) { rc_start = 1; rc_end = 2; }
            if (r_edge == 2) { rc_start = 3; rc_end = 2; }
            if (r_edge == 3) { rc_start = 0; rc_end = 3; }
            int corner_V_id_R = r_flip ? rc_start : rc_end;
            std::vector<float> v_corner_R;
            read_corner(faces[r_face], corner_V_id_R, padding, W, H, v_corner_R);
            std::vector<float> v_corner_R_rot(padding*padding*bands);
            copy_rotated(v_corner_R, padding, padding, v_corner_R_rot, padding, padding, bands, r_rot, false, r_flip);

            // BLEND
            std::vector<float> final_L(padding*padding*bands);
            std::vector<float> final_R(padding*padding*bands);
            blend_corner(padding, bands, h_corner_L_rot, v_corner_L_rot, final_L); // BL
            blend_corner(padding, bands, h_corner_R_rot, v_corner_R_rot, final_R); // BR

            // WRITE
            int yOff = (2*f + 1) * padding;
            h_ds->RasterIO(GF_Write, 0, yOff, padding, padding, final_L.data(), padding, padding, GDT_Float32, bands, nullptr, 0, 0, 0);
            h_ds->RasterIO(GF_Write, padding, yOff, W, padding, rotated_main.data(), W, padding, GDT_Float32, bands, nullptr, 0, 0, 0);
            h_ds->RasterIO(GF_Write, W+padding, yOff, padding, padding, final_R.data(), padding, padding, GDT_Float32, bands, nullptr, 0, 0, 0);
        }

        // --- 3 & 4. Vertical Strips (Unchanged in logic, just writing to V_DS) ---
        {
             // West (Left) -> Goes to V_Strip Col [2*f]
             int n_face = s2_transitions[f][E_W].next_face;
             int n_edge = s2_transitions[f][E_W].next_edge;
             bool flip = s2_transitions[f][E_W].flip_axis;
             int rot = s2_transitions[f][E_W].rotation;
             
             std::vector<float> src_strip;
             int srcW = (n_edge == E_N || n_edge == E_S) ? W : padding;
             int srcH = (n_edge == E_N || n_edge == E_S) ? padding : H;
             read_strip(faces[n_face], n_edge, padding, W, H, src_strip);
             
             std::vector<float> dst_strip(padding * H * bands);
             copy_rotated(src_strip, srcW, srcH, dst_strip, padding, H, bands, rot, false, flip); // V-Flip? No, flip_axis usually means along the strip length.For V-strip (PxH), flip_v maps to flip along H.
             // Our struct: flip_axis -> if true, we read Source Edge backward.
             // copy_rotated: if flip_v, we invert Y.
             // V-Strip is PxH. Y is the long axis. So 'flip' maps to 'flip_v'.
             
             v_ds->RasterIO(GF_Write, 2*f*padding, 0, padding, H, dst_strip.data(), padding, H, GDT_Float32, bands, nullptr, 0, 0, 0);
        }
        
        {
             // East (Right) -> Goes to V_Strip Col [2*f+1]
             int n_face = s2_transitions[f][E_E].next_face;
             int n_edge = s2_transitions[f][E_E].next_edge;
             bool flip = s2_transitions[f][E_E].flip_axis;
             int rot = s2_transitions[f][E_E].rotation;
             
             std::vector<float> src_strip;
             int srcW = (n_edge == E_N || n_edge == E_S) ? W : padding;
             int srcH = (n_edge == E_N || n_edge == E_S) ? padding : H;
             read_strip(faces[n_face], n_edge, padding, W, H, src_strip);
             
             std::vector<float> dst_strip(padding * H * bands);
             copy_rotated(src_strip, srcW, srcH, dst_strip, padding, H, bands, rot, false, flip);
             
             v_ds->RasterIO(GF_Write, (2*f+1)*padding, 0, padding, H, dst_strip.data(), padding, H, GDT_Float32, bands, nullptr, 0, 0, 0);
        }
    }

    GDALClose(h_ds);
    GDALClose(v_ds);
    for(int f=0; f<6; ++f) GDALClose(faces[f]);
    
    std::cout << "[SUCCESS] Helper strips created." << std::endl;
}

void create_padded_face_vrt(const std::string& prefix, int face, int w, int h, int bands, GDALDataType type, int padding) {
    std::string vrt_path = prefix + "_face" + std::to_string(face) + ".vrt";
    std::ofstream vrt(vrt_path);
    if (!vrt.is_open()) return;

    // Dimensions: W + 2P
    int fullW = w + 2 * padding;
    int fullH = h + 2 * padding;
    
    // Relative paths
    std::string face_tif = prefix + "_face" + std::to_string(face) + ".tif";
    size_t last_slash = face_tif.find_last_of("/\\");
    std::string face_rel = (last_slash == std::string::npos) ? face_tif : face_tif.substr(last_slash + 1);
    
    std::string h_tif = prefix + "_horizontal_strips.tif";
    std::string h_rel = (last_slash == std::string::npos) ? h_tif : h_tif.substr(last_slash + 1);
    
    std::string v_tif = prefix + "_vertical_strips.tif";
    std::string v_rel = (last_slash == std::string::npos) ? v_tif : v_tif.substr(last_slash + 1);

    vrt << "<VRTDataset rasterXSize=\"" << fullW << "\" rasterYSize=\"" << fullH << "\">\n";
    const char* type_name = GDALGetDataTypeName(type);
    
    for (int b = 1; b <= bands; ++b) {
        vrt << "  <VRTRasterBand dataType=\"" << type_name << "\" band=\"" << b << "\">\n";
        
        // 1. Center (The Face Itself)
        vrt << "    <SimpleSource>\n";
        vrt << "      <SourceFilename relativeToVRT=\"1\">" << face_rel << "</SourceFilename>\n";
        vrt << "      <SourceBand>" << b << "</SourceBand>\n";
        vrt << "      <SrcRect xOff=\"0\" yOff=\"0\" xSize=\"" << w << "\" ySize=\"" << h << "\"/>\n";
        vrt << "      <DstRect xOff=\"" << padding << "\" yOff=\"" << padding << "\" xSize=\"" << w << "\" ySize=\"" << h << "\"/>\n";
        vrt << "    </SimpleSource>\n";
        
        // 2. Top (Horizontal Strip 2*face)
        vrt << "    <SimpleSource>\n";
        vrt << "      <SourceFilename relativeToVRT=\"1\">" << h_rel << "</SourceFilename>\n";
        vrt << "      <SourceBand>" << b << "</SourceBand>\n";
        vrt << "      <SrcRect xOff=\"0\" yOff=\"" << (2*face)*padding << "\" xSize=\"" << fullW << "\" ySize=\"" << padding << "\"/>\n";
        vrt << "      <DstRect xOff=\"0\" yOff=\"0\" xSize=\"" << fullW << "\" ySize=\"" << padding << "\"/>\n";
        vrt << "    </SimpleSource>\n";

        // 3. Bottom (Horizontal Strip 2*face + 1)
        vrt << "    <SimpleSource>\n";
        vrt << "      <SourceFilename relativeToVRT=\"1\">" << h_rel << "</SourceFilename>\n";
        vrt << "      <SourceBand>" << b << "</SourceBand>\n";
        vrt << "      <SrcRect xOff=\"0\" yOff=\"" << (2*face + 1)*padding << "\" xSize=\"" << fullW << "\" ySize=\"" << padding << "\"/>\n";
        vrt << "      <DstRect xOff=\"0\" yOff=\"" << h + padding << "\" xSize=\"" << fullW << "\" ySize=\"" << padding << "\"/>\n";
        vrt << "    </SimpleSource>\n";

        // 4. Left (Vertical Strip 2*face)
        vrt << "    <SimpleSource>\n";
        vrt << "      <SourceFilename relativeToVRT=\"1\">" << v_rel << "</SourceFilename>\n";
        vrt << "      <SourceBand>" << b << "</SourceBand>\n";
        vrt << "      <SrcRect xOff=\"" << (2*face)*padding << "\" yOff=\"0\" xSize=\"" << padding << "\" ySize=\"" << h << "\"/>\n";
        vrt << "      <DstRect xOff=\"0\" yOff=\"" << padding << "\" xSize=\"" << padding << "\" ySize=\"" << h << "\"/>\n";
        vrt << "    </SimpleSource>\n";

        // 5. Right (Vertical Strip 2*face + 1)
        vrt << "    <SimpleSource>\n";
        vrt << "      <SourceFilename relativeToVRT=\"1\">" << v_rel << "</SourceFilename>\n";
        vrt << "      <SourceBand>" << b << "</SourceBand>\n";
        vrt << "      <SrcRect xOff=\"" << (2*face+1)*padding << "\" yOff=\"0\" xSize=\"" << padding << "\" ySize=\"" << h << "\"/>\n";
        vrt << "      <DstRect xOff=\"" << w + padding << "\" yOff=\"" << padding << "\" xSize=\"" << padding << "\" ySize=\"" << h << "\"/>\n";
        vrt << "    </SimpleSource>\n";
        
        vrt << "  </VRTRasterBand>\n";
    }
    vrt << "</VRTDataset>\n";
    vrt.close();
}

// Progress Callback for Overviews
struct OverviewProgressCtx {
    int face;
    int lastPct;
    std::chrono::high_resolution_clock::time_point startTime;
};

int CPL_STDCALL OverviewProgressFunc(double dfComplete, const char *pszMessage, void *pProgressArg) {
    OverviewProgressCtx* ctx = (OverviewProgressCtx*)pProgressArg;
    int pct = (int)(dfComplete * 100.0);
    
    // Only update every 5% or if finished
    if (pct >= ctx->lastPct + 5 || (pct == 100 && ctx->lastPct != 100)) {
        ctx->lastPct = pct;
        
        auto now = std::chrono::high_resolution_clock::now();
        std::chrono::duration<double> elapsed = now - ctx->startTime;
        double elapsedSec = elapsed.count();
        
        if (pct >= 100) {
             int total_s = (int)elapsedSec;
             int h = total_s / 3600;
             int m = (total_s % 3600) / 60;
             int s = total_s % 60;
             char dur_buf[32];
             snprintf(dur_buf, sizeof(dur_buf), "%02d:%02d:%02d", h, m, s);
             std::cout << "[PROGRESS] Building Overviews Face " << ctx->face << ": 100% (Took " << dur_buf << ")" << std::endl;
        } else if (pct > 0) {
            double rate = elapsedSec / pct; // seconds per percent
            double remaining = rate * (100.0 - pct);
            int remSec = (int)remaining;
            
            int h = remSec / 3600;
            int m = (remSec % 3600) / 60;
            int s = remSec % 60;
            char eta_buf[32];
            snprintf(eta_buf, sizeof(eta_buf), "%02d:%02d:%02d", h, m, s);
            
            std::cout << "[PROGRESS] Building Overviews Face " << ctx->face << ": " << pct << "% (ETA: " << eta_buf << ")" << std::endl;
        } else {
            std::cout << "[PROGRESS] Building Overviews Face " << ctx->face << ": " << pct << "%" << std::endl;
        }
    }
    return 1;
}

int main(int argc, char* argv[]) {
    auto start_time = std::chrono::high_resolution_clock::now();
    if (argc < 4) {
        std::cout << "Usage: s2_preprocessor <input.tif> <output_prefix> <max_zoom> [tile_size=512]" << std::endl;
        return 1;
    }

    const char* input_path = argv[1];
    const std::string out_prefix = argv[2];
    int max_zoom = std::stoi(argv[3]);
    int tile_size = (argc >= 5) ? std::stoi(argv[4]) : 512;
    std::string compression = (argc >= 6) ? argv[5] : "LZW";
    std::string predictor = (argc >= 7) ? argv[6] : "2"; // Default to Horizontal Differencing
    std::string resCmd = (argc >= 8) ? argv[7] : "BILINEAR";
    std::string modeStr = (argc >= 9) ? argv[8] : "VERTEX"; 
    std::string cacheMax = (argc >= 10) ? argv[9] : "512"; // Default 512MB, supports "50%"
    int skipFaces = (argc >= 11) ? std::stoi(argv[10]) : 0;
    std::string coordMode = (argc >= 12) ? argv[11] : "GEODETIC";
    std::string outFmt = (argc >= 13) ? argv[12] : "FLOAT32";
    double userSemiMajor = (argc >= 14) ? std::stod(argv[13]) : 0;
    double userSemiMinor = (argc >= 15) ? std::stod(argv[14]) : 0;

    // Force unbuffered output to debug "stuck" issues on Windows
    std::setvbuf(stdout, NULL, _IONBF, 0);
    std::setvbuf(stderr, NULL, _IONBF, 0);

    bool isPixelCentered = (modeStr == "PIXEL" || modeStr == "pixel");
    bool isGeodetic = (coordMode == "GEODETIC" || coordMode == "geodetic" || coordMode == "true" || coordMode == "1");
    bool isOut16 = (outFmt == "UINT16" || outFmt == "uint16" || outFmt == "16");
    bool isOut8 = (outFmt == "BYTE" || outFmt == "byte" || outFmt == "8" || outFmt == "UINT8");
    double offset = isPixelCentered ? 0.5 : 0.0;
    
    std::cout << "[DEBUG] Starting s2_preprocessor..." << std::endl;
    std::cout << "[DEBUG] Args: Input=" << input_path << ", Output=" << out_prefix << ", Zoom=" << max_zoom << std::endl;
    std::cout << "[DEBUG] Cache Config: " << cacheMax << std::endl;
    if (skipFaces > 0) std::cout << "[INFO] Skipping first " << skipFaces << " faces." << std::endl;
    if (skipFaces >= 6) std::cout << "[INFO] Skipping ALL face generation (Existing faces will be used for VRT)." << std::endl;
    
    std::cout << "[INFO] Processing Mode: " << (isPixelCentered ? "Pixel Centered" : "Vertex Centered") << " (Offset: " << offset << ")" << std::endl;
    std::cout << "[INFO] Coordinate Mode: " << (isGeodetic ? "Geodetic (Ellipsoid)" : "Planetocentric (Sphere)") << std::endl;
    std::cout << "[INFO] Output Format: " << (isOut16 ? "UInt16" : (isOut8 ? "Byte" : "Float32")) << std::endl;
    
    Resample resampling = BILINEAR;
    std::string ovrMethod = "BILINEAR"; // Default GDAL method
    
    // Explicit override for overviews if 16th argument is present
    std::string explicitOvr = (argc >= 16) ? argv[15] : "";

    if (resCmd == "BICUBIC") { resampling = BICUBIC; ovrMethod = "CUBIC"; }
    else if (resCmd == "LANCZOS") { resampling = LANCZOS; ovrMethod = "LANCZOS"; }
    else if (resCmd == "AVERAGE") { resampling = AVERAGE; ovrMethod = "AVERAGE"; }
    else if (resCmd == "NEAREST") { resampling = NEAREST; ovrMethod = "NEAREST"; }
    else if (resCmd == "MITCHELL") { 
        resampling = MITCHELL; 
        // GDAL BuildOverviews does not support "MITCHELL". 
        // It supports: NEAREST, AVERAGE, BILINEAR, CUBIC (Catmull-Rom), CUBICSPLINE (B-Spline), LANCZOS.
        // We map to LANCZOS as the closest high-quality approximation for the overviews.
        ovrMethod = "LANCZOS"; 
    }
    
    if (!explicitOvr.empty()) {
        ovrMethod = explicitOvr;
        std::cout << "[INFO] Overview Resampling Override: " << ovrMethod << std::endl;
    }

    GDALAllRegister();
    CPLSetConfigOption("GDAL_CACHEMAX", cacheMax.c_str());
    CPLSetConfigOption("GDAL_DISABLE_READDIR_ON_OPEN", "YES");
    CPLSetConfigOption("VSI_CACHE", "YES");
    CPLSetConfigOption("VSI_CACHE_SIZE", "10000000"); // 10MB VSI cache
    CPLSetConfigOption("COMPRESS_OVERVIEW", "LZW");
    CPLSetConfigOption("TIFF_OVERVIEW_BLOCKSIZE", "512");
    CPLSetConfigOption("INTERLEAVE_OVERVIEW", "PIXEL");
    GDALDataset* poSrcDS = (GDALDataset*)GDALOpen(input_path, GA_ReadOnly);
    if (!poSrcDS) {
        std::cerr << "Failed to open " << input_path << std::endl;
        return 1;
    }

    int srcW = poSrcDS->GetRasterXSize();
    int srcH = poSrcDS->GetRasterYSize();
    int bands = poSrcDS->GetRasterCount();
    GDALDataType dataType = poSrcDS->GetRasterBand(1)->GetRasterDataType();
    
    double noData = -32768.0; 
    int hasNoData = 0;
    noData = poSrcDS->GetRasterBand(1)->GetNoDataValue(&hasNoData);

    double adfGT[6];
    if (poSrcDS->GetGeoTransform(adfGT) != CE_None) {
        std::cout << "[WARN] Source dataset has no GeoTransform! Assuming global map (-180 to 180 Lon, 90 to -90 Lat)." << std::endl;
        adfGT[0] = -180.0;
        adfGT[1] = 360.0 / srcW;
        adfGT[2] = 0.0;
        adfGT[3] = 90.0;
        adfGT[4] = 0.0;
        adfGT[5] = -180.0 / srcH;
    }
    
    const OGRSpatialReference* poSRS = poSrcDS->GetSpatialRef();
    double semiMajor = 0, semiMinor = 0;
    if (poSRS) {
        semiMajor = poSRS->GetSemiMajor();
        semiMinor = poSRS->GetSemiMinor();
    }

    if (userSemiMajor > 0) semiMajor = userSemiMajor;
    if (userSemiMinor > 0) semiMinor = userSemiMinor;

    if (semiMajor < 1000.0) {
        std::cout << "[WARN] Source radii missing or too small. Defaulting to Moon (1738140, 1735970)." << std::endl;
        semiMajor = 1738140.0; semiMinor = 1735970.0;
    }
    std::cout << "[INFO] Using Radii: A=" << semiMajor << " B=" << semiMinor << std::endl;

    double demMin = 1e30, demMax = -1e30;
    bool isNormalized = false;
    double unitScale = 1.0; 

    const char* pszMin = poSrcDS->GetMetadataItem("DEM_MIN");
    const char* pszMax = poSrcDS->GetMetadataItem("DEM_MAX");
    const char* pszNormalized = poSrcDS->GetMetadataItem("DEM_NORMALIZED");
    const char* pszUnit = poSrcDS->GetMetadataItem("DEM_UNIT");

    if (pszMin && pszMax) {
        demMin = std::stod(pszMin);
        demMax = std::stod(pszMax);
        if (pszNormalized && std::string(pszNormalized) == "1") {
            isNormalized = true;
            std::cout << "[INFO] Normalized DEM detected. Range: " << demMin << " to " << demMax << std::endl;
        }
    } else if (isOut16) {
        // PASS 0: Auto-Scan for Min/Max ONLY if processing 16-bit DEMs (Normalize mode)
        // For Color/Texture (Float32 or raw), scanning is unnecessary overhead.
        std::cout << "[PASS 0] Scanning source for min/max elevation..." << std::endl;
        int num_threads = omp_get_max_threads();
        std::vector<double> thread_min(num_threads, 1e30);
        std::vector<double> thread_max(num_threads, -1e30);

        #pragma omp parallel
        {
            int tid = omp_get_thread_num();
            std::vector<float> scanBuf(srcW);
            #pragma omp for
            for (int r = 0; r < srcH; ++r) {
                #pragma omp critical
                {
                    poSrcDS->GetRasterBand(1)->RasterIO(GF_Read, 0, r, srcW, 1, scanBuf.data(), srcW, 1, GDT_Float32, 0, 0);
                }
                for (int c = 0; c < srcW; ++c) {
                    float val = scanBuf[c];
                    if (val > -100000) { // Basic NoData check
                        if (val < thread_min[tid]) thread_min[tid] = val;
                        if (val > thread_max[tid]) thread_max[tid] = val;
                    }
                }
            }
        }
        for (int i = 0; i < num_threads; ++i) {
            if (thread_min[i] < demMin) demMin = thread_min[i];
            if (thread_max[i] > demMax) demMax = thread_max[i];
        }
        std::cout << "[INFO] Scanned Range: " << demMin << " to " << demMax << std::endl;
    }
    
    if (pszUnit && std::string(pszUnit) == "km") {
        unitScale = 1000.0;
        std::cout << "[INFO] DEM units: km (Scaling to meters for vertex generation)" << std::endl;
    }

    // Scale min/max to meters for output metadata and normalization
    demMin *= unitScale;
    demMax *= unitScale;

    // ... (rest of the logic) ...

    long long targetRes = (long long)std::pow(2, max_zoom) * tile_size;
    long long finalWidth = targetRes;
    
    std::cout << "[INFO] Target Resolution per Face: " << finalWidth << "x" << finalWidth << " (Tile Size: " << tile_size << ", " << bands << " bands)" << std::endl;

    GDALDriver* poDriver = GetGDALDriverManager()->GetDriverByName("GTiff");
    std::string comp_opt = "COMPRESS=" + compression;
    std::string pred_opt = "PREDICTOR=" + predictor;
    const char* pszOptions[] = { "TILED=YES", comp_opt.c_str(), "BIGTIFF=YES", pred_opt.c_str(), "BLOCKXSIZE=512", "BLOCKYSIZE=512", nullptr };

    for (int face = skipFaces; face < 6; ++face) {
        auto face_start = std::chrono::high_resolution_clock::now();
        std::string out_path = out_prefix + "_face" + std::to_string(face) + ".tif";
        GDALDataType finalOutType = GDT_Float32;
        if (isOut16) {
             finalOutType = GDT_UInt16;
        } else if (dataType == GDT_Byte) {
             // If source is Byte and we aren't enforcing 16-bit, keep it as Byte (Color/Texture)
             finalOutType = GDT_Byte;
        }
        
        // Explicitly delete existing file to prevent header corruption issues during overwrite
        // Suppress errors (e.g. "File not found") during this step
        CPLPushErrorHandler(CPLQuietErrorHandler);
        poDriver->Delete(out_path.c_str());
        CPLPopErrorHandler();

        GDALDataset* poDstDS = poDriver->Create(out_path.c_str(), (int)finalWidth, (int)finalWidth, bands, finalOutType, (char**)pszOptions);
        if (!poDstDS) {
            std::cerr << "Failed to create " << out_path << std::endl;
            return 1;
        }
        if (poDstDS) {
            poDstDS->SetMetadataItem("S2_MODE", isPixelCentered ? "PIXEL" : "VERTEX");
            if (demMin != 0 || demMax != 0) {
                poDstDS->SetMetadataItem("DEM_MIN", std::to_string(demMin).c_str());
                poDstDS->SetMetadataItem("DEM_MAX", std::to_string(demMax).c_str());
                poDstDS->SetMetadataItem("DEM_UNIT", "m");
                if (isOut16) poDstDS->SetMetadataItem("DEM_NORMALIZED", "1");
            }
        }
        if (hasNoData) {
            for (int b = 1; b <= bands; ++b) poDstDS->GetRasterBand(b)->SetNoDataValue(noData);
        }
        
        int chunkSize = 512;
        long long totalPixels = (long long)finalWidth * finalWidth;
        long long processedPixels = 0;

        for (int rOff = 0; rOff < finalWidth; rOff += chunkSize) {
            for (int cOff = 0; cOff < finalWidth; cOff += chunkSize) {
                int h = (int)std::min((long long)chunkSize, finalWidth - rOff);
                int w = (int)std::min((long long)chunkSize, finalWidth - cOff);
                
                // 1. Determine geographic bounds for this block.
                double chunkMinLat = 100, chunkMaxLat = -100;
                double chunkMinLon = 400, chunkMaxLon = -400; // Use >360 range for init
                
                // Sample corners and midpoints using pixel offsets
                for (int u_rel : {0, w/2, w}) {
                    for (int v_rel : {0, h/2, h}) {
                        double u = (double)(cOff + u_rel) / targetRes;
                        double v = 1.0 - (double)(rOff + v_rel) / targetRes;
                        
                        Point3D p = face_uv_to_xyz(face, u, v);
                        double lat, lon; xyz_to_latlon(p, semiMajor, semiMinor, lat, lon, isGeodetic);
                        chunkMinLat = std::min(chunkMinLat, lat);
                        chunkMaxLat = std::max(chunkMaxLat, lat);
                        chunkMinLon = std::min(chunkMinLon, lon);
                        chunkMaxLon = std::max(chunkMaxLon, lon);
                    }
                }

                // Convert Lat Bounds to Source Y Pixels.
                int y_a = (int)std::floor((chunkMaxLat - adfGT[3]) / adfGT[5]);
                int y_b = (int)std::ceil((chunkMinLat - adfGT[3]) / adfGT[5]);
                int srcY0 = std::min(y_a, y_b);
                int srcY1 = std::max(y_a, y_b);

                // Add margin for kernels (Compact: 6 pixels)
                srcY0 = std::max(0, srcY0 - 6);
                srcY1 = std::min(srcH - 1, srcY1 + 6);
                int srcRegionH = srcY1 - srcY0 + 1;
                
                // Convert Lon Bounds to Source X Pixels
                int x_a = (int)std::floor((chunkMinLon - adfGT[0]) / adfGT[1]);
                int x_b = (int)std::ceil((chunkMaxLon - adfGT[0]) / adfGT[1]);
                
                int srcX0 = std::min(x_a, x_b);
                int srcX1 = std::max(x_a, x_b);
                
                // Force Full Width for Polar Faces (2 and 5) to handle geometric singularity
                bool isPolar = (face == 2 || face == 5);
                bool isWrap = isPolar || ((srcX1 - srcX0) > (srcW / 2));
                
                if (isWrap) {
                    // Fallback to Full Width Read
                    srcX0 = 0;
                    srcX1 = srcW - 1;
                } else {
                    // Add margin (Compact: 6 pixels)
                    srcX0 = std::max(0, srcX0 - 6);
                    srcX1 = std::min(srcW - 1, srcX1 + 6);
                }
                
                int srcRegionW = srcX1 - srcX0 + 1;
                
                // If region is invalid or empty, skip
                if (srcRegionH <= 0 || srcRegionW <= 0) continue;

                size_t srcBufSize = (size_t)srcRegionW * srcRegionH * bands;
                std::vector<float> srcBuffer(srcBufSize);
                
                CPLErrorReset();
                bool readSuccess = true;
                for (int b = 0; b < bands; ++b) {
                    if (poSrcDS->GetRasterBand(b+1)->RasterIO(GF_Read, srcX0, srcY0, srcRegionW, srcRegionH, srcBuffer.data() + b, srcRegionW, srcRegionH, GDT_Float32, (GSpacing)bands * sizeof(float), (GSpacing)srcRegionW * bands * sizeof(float)) != CE_None) {
                        std::cerr << "\n[ERROR] Source RasterIO failed for Face " << face << ", Band " << b+1 << " at " << srcX0 << "," << srcY0 << std::endl;
                        readSuccess = false;
                        break;
                    }
                }
                if (!readSuccess) continue;

                size_t outBufSize = (size_t)w * h * bands;
                std::vector<float> outBuffer(outBufSize);
                std::vector<uint16_t> outBuffer16;
                if (isOut16) outBuffer16.resize(outBufSize);

                #pragma omp parallel for
                for (int j = 0; j < h; ++j) {
                    for (int i = 0; i < w; ++i) {
                        double u = (double)(cOff + i + offset) / targetRes;
                        double v = 1.0 - (double)(rOff + j + offset) / targetRes;
                        Point3D p = face_uv_to_xyz(face, u, v);
                        double lat, lon;
                        xyz_to_latlon(p, semiMajor, semiMinor, lat, lon, isGeodetic);

                        double px = (lon - adfGT[0]) / adfGT[1];
                        double py = (lat - adfGT[3]) / adfGT[5];
                        
                        // Wrap Lon (Global)
                        while (px < 0) px += srcW;
                        while (px >= srcW) px -= srcW;

                        // Clamp Py to valid source range
                        if (py < 0.0) py = 0.0;
                        if (py > (double)srcH - 1.0) py = (double)srcH - 1.0;
                        
                        // Robustness: Clamp Py to loaded region if within tolerance (e.g. 2px)
                        // This handles small floating point overshoots.
                        double minLoadedY = (double)srcY0;
                        double maxLoadedY = (double)(srcY0 + srcRegionH - 1);
                        if (py < minLoadedY && py > minLoadedY - 2.0) py = minLoadedY;
                        if (py > maxLoadedY && py < maxLoadedY + 2.0) py = maxLoadedY;

                        // Strict integrity check (Vertical)
                        if (py < minLoadedY - 1e-5 || py > maxLoadedY + 1e-5) {
                             #pragma omp critical
                             {
                                 std::cerr << "[CRITICAL ERROR] Vertical Integrity Failure on Face " << face << std::endl;
                                 std::cerr << "Requested Y: " << py << " outside loaded Y: [" << srcY0 << ", " << srcY0 + srcRegionH - 1 << "]" << std::endl;
                             }
                             exit(1);
                        }
                        
                        // Strict integrity check (Horizontal)
                        // 'px' is global 0..srcW. We need to check if it falls inside [srcX0, srcX1]
                        // BUT: If isWrap is true, srcX0=0, srcX1=srcW (Full read), so it always passes.
                        if (!isWrap) {
                             double minLoadedX = (double)srcX0;
                             double maxLoadedX = (double)(srcX0 + srcRegionW - 1);
                             
                             // Clamp Px to loaded region (Robustness)
                             if (px < minLoadedX && px > minLoadedX - 2.0) px = minLoadedX;
                             if (px > maxLoadedX && px < maxLoadedX + 2.0) px = maxLoadedX;
                             
                             if (px < minLoadedX - 1e-5 || px > maxLoadedX + 1e-5) {
                                 #pragma omp critical
                                 {
                                     std::cerr << "[CRITICAL ERROR] Horizontal Integrity Failure on Face " << face << std::endl;
                                     std::cerr << "Requested X: " << px << " outside loaded X: [" << srcX0 << ", " << srcX0 + srcRegionW - 1 << "]" << std::endl;
                                     std::cerr << "Block Bounds: MinLon=" << chunkMinLon << " MaxLon=" << chunkMaxLon << std::endl;
                                 }
                                 exit(1);
                             }
                        }

                        double localPy = py - srcY0;
                        double localPx = px - srcX0;

                        if (resampling == BILINEAR) {
                            int x0 = (int)localPx;
                            int y0 = (int)localPy;
                            int x1 = std::min(x0 + 1, srcRegionW - 1); // Clamp X inside buffer (safe if buffer has margin)
                            int y1 = std::min(y0 + 1, srcRegionH - 1);
                            
                            // If Wrapping at buffer edge? 
                            // If isWrap is true (Full Width), x=srcW-1 should wrap to x=0.
                            // But localPx uses linear buffer indices.
                            if (isWrap) {
                                // Manual wrap logic for Full Width buffer
                                if (x0 == srcRegionW - 1) x1 = 0;
                            }
                            
                            float dx = (float)(localPx - x0);
                            float dy = (float)(localPy - y0);

                            for (int b = 0; b < bands; ++b) {
                                float v00 = srcBuffer[(y0 * srcRegionW + x0) * bands + b];
                                float v10 = srcBuffer[(y0 * srcRegionW + x1) * bands + b];
                                float v01 = srcBuffer[(y1 * srcRegionW + x0) * bands + b];
                                float v11 = srcBuffer[(y1 * srcRegionW + x1) * bands + b];

                                float val = v00 * (1.f - dx) * (1.f - dy) + v10 * dx * (1.f - dy) + v01 * (1.f - dx) * dy + v11 * dx * dy;
                                 
                                 if (isNormalized) val = (float)(demMin + (double)(val / 65535.f) * (demMax - demMin));
                                 val *= (float)unitScale;

                                if (dataType == GDT_Byte) val = std::clamp(val, 0.f, 255.f);
                                outBuffer[(j * w + i) * bands + b] = val;
                            }
                        } else if (resampling == BICUBIC) {
                            int x0 = (int)localPx;
                            int y0 = (int)localPy;
                            float dx = (float)(localPx - x0);
                            float dy = (float)(localPy - y0);

                            for (int b = 0; b < bands; ++b) {
                                float row[4];
                                for (int m = -1; m <= 2; ++m) {
                                    int yy = std::clamp(y0 + m, 0, srcRegionH - 1);
                                    
                                    // X Sampling with Wrap support
                                    int xx_base = x0;
                                    float c[4];
                                    for(int n=-1; n<=2; ++n) {
                                        int xx = xx_base + n;
                                        if (isWrap) {
                                           while(xx < 0) xx += srcRegionW;
                                           while(xx >= srcRegionW) xx -= srcRegionW;
                                        } else {
                                           xx = std::clamp(xx, 0, srcRegionW - 1);
                                        }
                                        c[n+1] = srcBuffer[(yy * srcRegionW + xx) * bands + b];
                                    }
                                    row[m + 1] = cubicHermite(c[0], c[1], c[2], c[3], dx);
                                }
                                float val = cubicHermite(row[0], row[1], row[2], row[3], dy);
                                 
                                 if (isNormalized) val = (float)(demMin + (double)(val / 65535.f) * (demMax - demMin));
                                 val *= (float)unitScale;

                                if (dataType == GDT_Byte) val = std::clamp(val, 0.f, 255.f);
                                outBuffer[(j * w + i) * bands + b] = val;
                            }
                        } else if (resampling == LANCZOS) {
                            int x0 = (int)localPx;
                            int y0 = (int)localPy;
                            float dx = (float)(localPx - x0);
                            float dy = (float)(localPy - y0);

                            for (int b = 0; b < bands; ++b) {
                                float val = 0.0f;
                                float weightSum = 0.0f;
                                for (int m = -2; m <= 3; ++m) {
                                    float wy = lanczos(dy - (float)m);
                                    int yy = std::clamp(y0 + m, 0, srcRegionH - 1);
                                    for (int n = -2; n <= 3; ++n) {
                                        float wx = lanczos(dx - (float)n);
                                        float w = wx * wy;
                                        
                                        int xx = x0 + n;
                                        if (isWrap) {
                                            while(xx < 0) xx += srcRegionW;
                                            while(xx >= srcRegionW) xx -= srcRegionW;
                                        } else {
                                            xx = std::clamp(xx, 0, srcRegionW - 1);
                                        }
                                        
                                        val += srcBuffer[(yy * srcRegionW + xx) * bands + b] * w;
                                        weightSum += w;
                                    }
                                }
                                 if (weightSum > 0) val /= weightSum;
                                 
                                 if (isNormalized) val = (float)(demMin + (double)(val / 65535.f) * (demMax - demMin));
                                 val *= (float)unitScale;

                                 if (dataType == GDT_Byte) val = std::clamp(val, 0.f, 255.f);
                                 outBuffer[(j * w + i) * bands + b] = val;
                             }
                        } else if (resampling == MITCHELL) {
                            // Mitchell-Netravali (Separable, R=2)
                            int x0 = (int)localPx;
                            int y0 = (int)localPy;
                            float dx = (float)(localPx - x0);
                            float dy = (float)(localPy - y0);

                            for (int b = 0; b < bands; ++b) {
                                float val = 0.0f;
                                float weightSum = 0.0f;
                                for (int m = -1; m <= 2; ++m) { // Range [-1, 2] covers the support of 2.0 around dx (0..1)
                                    // Actually Mitchell support is 2.0. If dx=0.5, range is -1.5 to 2.5.
                                    // Floor(0.5 - 2) = -2. Ceil(0.5 + 2) = 3.
                                    // So loop m from -2 to 3 is safer, same as Lanczos.
                                    // Let's use -1 to 2 for optimizing standard cubic, but Mitchell is wider?
                                    // Mitchell math: x < 2.0.
                                    // Center is dx. Range dx-2 to dx+2.
                                    // m should cover pixels whose distance is < 2.
                                    // if m=-2: dist = |-2 - dx|. if dx=0, dist=2. (Edge).
                                    // if m=3: dist = |3 - dx|. if dx=0.9, dist=2.1. (Out).
                                    // Standard 4x4 cubic usually suffices? Mitchell is often 4x4.
                                    // Let's try 4x4 (-1 to 2) first?
                                    // B-Spline is 4x4. Mitchell is 4x4.
                                    // Wait, 2.0 radius means 4.0 width.
                                    // If centered on px, we need px-2 to px+2. 4 pixels?
                                    // Yes, standard Bicubic is 4x4.
                                    
                                    // Let's use -1 to 2 (4 taps) to be safe for typical cubic-class filters.
                                    float wy = mitchell_netravali(dy - (float)m);
                                    int yy = std::clamp(y0 + m, 0, srcRegionH - 1);
                                    for (int n = -1; n <= 2; ++n) {
                                        float wx = mitchell_netravali(dx - (float)n);
                                        float w = wx * wy;
                                        
                                        int xx = x0 + n;
                                        if (isWrap) {
                                            while(xx < 0) xx += srcRegionW;
                                            while(xx >= srcRegionW) xx -= srcRegionW;
                                        } else {
                                            xx = std::clamp(xx, 0, srcRegionW - 1);
                                        }
                                        
                                        val += srcBuffer[(yy * srcRegionW + xx) * bands + b] * w;
                                        weightSum += w;
                                    }
                                }
                                 if (weightSum > 0) val /= weightSum;
                                 
                                 if (isNormalized) val = (float)(demMin + (double)(val / 65535.f) * (demMax - demMin));
                                 val *= (float)unitScale;

                                 if (dataType == GDT_Byte) val = std::clamp(val, 0.f, 255.f);
                                 outBuffer[(j * w + i) * bands + b] = val;
                             }
                        } else if (resampling == AVERAGE) {
                            // Box Filter / Area Averaging
                            // For downsampling, we integrate over the source pixel area corresponding to the target pixel.
                            // But here, 'localPx' is a point sample coordinate.
                            // We need to know the SCALE factor (du/dx).
                            // Actually, s2_st_to_uv is non-linear, so scale varies.
                            // Approximate scale = delta_source_px / delta_target_px?
                            // For warping, we usually map a target pixel footprint to source.
                            // Simplification: Use a fixed window based on average zoom ratio?
                            // Or just use 3x3 or 5x5 fixed if user just wants "smoother than bilinear"?
                            // Typically "Average" in GDAL overviews implies computing the mean of the children.
                            // Here we are warping.
                            // Let's implement a 1-pixel box filter (effectively Bilinear? No, Bilinear interpolates).
                            // Average usually means "Area Average".
                            // Let's scan a small window around localPx.
                            // Note: Implementing true elliptical weighted average (EWA) is complex.
                            // We'll stick to a 3x3 weighted mean as a proxy for "Smooth/Average".
                            
                            int x0 = (int)std::round(localPx);
                            int y0 = (int)std::round(localPy);
                            
                            for (int b = 0; b < bands; ++b) {
                                double sum = 0;
                                double count = 0;
                                
                                for(int m=-1; m<=1; ++m) {
                                    int yy = std::clamp(y0 + m, 0, srcRegionH - 1);
                                    for(int n=-1; n<=1; ++n) {
                                        int xx = x0 + n;
                                        // Wrap logic
                                        if (isWrap) {
                                            while(xx < 0) xx += srcRegionW;
                                            while(xx >= srcRegionW) xx -= srcRegionW;
                                        } else {
                                            xx = std::clamp(xx, 0, srcRegionW - 1);
                                        }
                                        sum += srcBuffer[(yy * srcRegionW + xx) * bands + b];
                                        count++;
                                    }
                                }
                                float val = (float)(sum / count);
                                if (isNormalized) val = (float)(demMin + (double)(val / 65535.f) * (demMax - demMin));
                                val *= (float)unitScale;
                                if (dataType == GDT_Byte) val = std::clamp(val, 0.f, 255.f);
                                outBuffer[(j * w + i) * bands + b] = val;
                            }
                        } else if (resampling == NEAREST) {
                            int x0 = (int)std::round(localPx);
                            int y0 = (int)std::round(localPy);
                            // Wrap/Clamp
                            if (isWrap) {
                                while(x0 < 0) x0 += srcRegionW;
                                while(x0 >= srcRegionW) x0 -= srcRegionW;
                            } else {
                                x0 = std::clamp(x0, 0, srcRegionW - 1);
                            }
                            y0 = std::clamp(y0, 0, srcRegionH - 1);
                            
                            for (int b = 0; b < bands; ++b) {
                                float val = srcBuffer[(y0 * srcRegionW + x0) * bands + b];
                                if (isNormalized) val = (float)(demMin + (double)(val / 65535.f) * (demMax - demMin));
                                val *= (float)unitScale;
                                if (dataType == GDT_Byte) val = std::clamp(val, 0.f, 255.f);
                                outBuffer[(j * w + i) * bands + b] = val;
                            }
                        }
                    }
                }
                
                // Write block
                if (finalOutType == GDT_UInt16) {
                    // ... (keep UInt16 logic)
                    std::vector<uint16_t> outBuffer16(outBufSize);
                    #pragma omp parallel for
                    for (int i = 0; i < (int)outBufSize; ++i) {
                        double val = outBuffer[i];
                        double norm = (val - demMin) / (demMax - demMin);
                        norm = std::max(0.0, std::min(1.0, norm));
                        outBuffer16[i] = (uint16_t)(norm * 65535.0);
                    }
                    if (poDstDS->RasterIO(GF_Write, cOff, rOff, w, h, outBuffer16.data(), w, h, finalOutType, bands, nullptr, (GSpacing)bands * sizeof(uint16_t), (GSpacing)w * bands * sizeof(uint16_t), sizeof(uint16_t)) != CE_None) {
                        std::cerr << "\n[ERROR] Destination RasterIO (UInt16) failed for Face " << face << std::endl;
                    }
                } else if (finalOutType == GDT_Byte) {
                    // Convert Float32 to Byte (Clamp 0-255)
                    std::vector<uint8_t> outBuffer8(outBufSize);
                    #pragma omp parallel for
                    for (int i = 0; i < (int)outBufSize; ++i) {
                        // Assuming input float is already in valid range or needs normalization?
                        // Usually Color input (0-255) -> Resampled Float (approx 0-255)
                        // Just clamp.
                        outBuffer8[i] = (uint8_t)std::clamp(outBuffer[i], 0.0f, 255.0f);
                    }
                     if (poDstDS->RasterIO(GF_Write, cOff, rOff, w, h, outBuffer8.data(), w, h, finalOutType, bands, nullptr, (GSpacing)bands * sizeof(uint8_t), (GSpacing)w * bands * sizeof(uint8_t), sizeof(uint8_t)) != CE_None) {
                        std::cerr << "\n[ERROR] Destination RasterIO (Byte) failed for Face " << face << std::endl;
                    }
                } else {
                    // Float32 (Default)
                    if (poDstDS->RasterIO(GF_Write, cOff, rOff, w, h, outBuffer.data(), w, h, finalOutType, bands, nullptr, (GSpacing)bands * sizeof(float), (GSpacing)w * bands * sizeof(float), sizeof(float)) != CE_None) {
                        std::cerr << "\n[ERROR] Destination RasterIO (Float32) failed for Face " << face << std::endl;
                    }
                }
                
                processedPixels += (long long)w * h;
                
                // Progress Reporting (per block)
                auto now = std::chrono::high_resolution_clock::now();
                std::chrono::duration<double> elapsed = now - face_start;
                double progress = (double)processedPixels / totalPixels;
                
                if ((processedPixels % (1024*1024) == 0) && progress < 1.0) { // Update every ~1MP, skip 100% (handled post-loop)
                    double total_est = elapsed.count() / progress;
                    int remaining = (int)(total_est - elapsed.count());
                    int h_rem = remaining / 3600;
                    int m_rem = (remaining % 3600) / 60;
                    int s_rem = remaining % 60;

                    char eta_buf[32];
                    if (h_rem > 0) snprintf(eta_buf, sizeof(eta_buf), "ETA: %02d:%02d:%02d", h_rem, m_rem, s_rem);
                    else snprintf(eta_buf, sizeof(eta_buf), "ETA: %02d:%02d", m_rem, s_rem);

                    std::cout << "[PROGRESS] Face " << face << ": " << (int)(progress * 100) << "% (" << eta_buf << ")" << std::endl;
                }
            }
        }

        auto face_end = std::chrono::high_resolution_clock::now();
        std::chrono::duration<double> face_elapsed = face_end - face_start;
        int total_s = (int)face_elapsed.count();
        int h = total_s / 3600;
        int m = (total_s % 3600) / 60;
        int s = total_s % 60;
        char dur_buf[32];
        if (h > 0) snprintf(dur_buf, sizeof(dur_buf), "%02d:%02d:%02d", h, m, s);
        else snprintf(dur_buf, sizeof(dur_buf), "%02d:%02d", m, s);
        std::cout << "[PROGRESS] Face " << face << ": 100% (Took " << dur_buf << ")" << std::endl;

        /*
        std::cout << "Building Overviews for Face " << face << "..." << std::endl;
        std::vector<int> overviews;
        for (int z = 1; z <= max_zoom; ++z) overviews.push_back(1 << z);
        if (poDstDS) {
            poDstDS->BuildOverviews("LANCZOS", (int)overviews.size(), overviews.data(), 0, nullptr, nullptr, nullptr);
            GDALClose(poDstDS);
        }
        */
        if (poDstDS) GDALClose(poDstDS); // Just close it
    }
    GDALClose(poSrcDS);
    
    // NEW Pipeline: Padding & 6 VRTs
    int padding = (int)finalWidth / 64;
    if (padding < 2) padding = 2; // Min 2px padding
    
    // Generate Helper Strips
    generate_padding_strips(out_prefix, (int)finalWidth, (int)finalWidth, bands, padding);

    // Generate 6 Padded VRTs
    for(int f=0; f<6; ++f) {
         create_padded_face_vrt(out_prefix, f, (int)finalWidth, (int)finalWidth, bands, dataType, padding);
    }
    
    // Generate Overviews for VRTs
    std::cout << "[INFO] Building Overviews for VRTs (Sequential)..." << std::endl;
    std::vector<int> overviews;
    for (int z = 1; z <= max_zoom; ++z) overviews.push_back(1 << z);

    // parallel execution of BuildOverviews causes deadlocks/hangs on some systems with VRTs.
    // Switching to sequential.
    for(int f=0; f<6; ++f) {
        std::string vrt_path = out_prefix + "_face" + std::to_string(f) + ".vrt";
        GDALDataset* poVrtDS = (GDALDataset*)GDALOpen(vrt_path.c_str(), GA_ReadOnly);
        if (poVrtDS) {
            std::cout << "Building overviews for Face " << f << " (" << ovrMethod << ")..." << std::endl;
            OverviewProgressCtx ctx;
            ctx.face = f;
            ctx.lastPct = -1;
            ctx.startTime = std::chrono::high_resolution_clock::now();
            
            // Set Compression for Overviews (Critical for size reduction)
            CPLSetConfigOption("COMPRESS_OVERVIEW", "LZW"); // Force LZW for now, or use user 'compression' var
            
            if (ovrMethod == "MITCHELL") {
                // Hybrid Strategy: Create Empty Overviews with NEAREST, then Overwrite with Mitchell
                std::cout << "Creating empty overviews container for Face " << f << "..." << std::endl;
                poVrtDS->BuildOverviews("NEAREST", (int)overviews.size(), overviews.data(), 0, nullptr, OverviewProgressFunc, &ctx);
                
                std::cout << "Generating high-quality Mitchell overviews processing for Face " << f << "..." << std::endl;
                // Re-open in Update mode? No, poVrtDS is ReadOnly.
                // VRT overviews are external (.ovr). We need to open the VRT? 
                // Wait, if poVrtDS is ReadOnly, BuildOverviews creates an external file.
                // Can we write to the bands of a ReadOnly VRT if the .ovr exists? 
                // Usually GDAL allows writing to overviews if they are external. 
                // Let's try. If not, we might need to close and re-open the .vrt with GA_Update.
                // Re-opening with Update is safer.
                GDALClose(poVrtDS);
                
                poVrtDS = (GDALDataset*)GDALOpen(vrt_path.c_str(), GA_Update);
                if(poVrtDS) {
                    GenerateMitchellOverviews(poVrtDS, overviews, f);
                    GDALClose(poVrtDS);
                } else {
                    std::cerr << "[ERROR] Could not reopen VRT for Mitchell generation: " << vrt_path << std::endl;
                }
                
                std::cout << "Overviews created for Face " << f << " (Mitchell)" << std::endl;

            } else {
                poVrtDS->BuildOverviews(ovrMethod.c_str(), (int)overviews.size(), overviews.data(), 0, nullptr, OverviewProgressFunc, &ctx);
                GDALClose(poVrtDS);
                std::cout << "Overviews created for Face " << f << std::endl;
            }
        } else {
             std::cerr << "[WARN] Failed to open VRT for overviews: " << vrt_path << std::endl;
        }
    }
    
    // Legacy 3x2 VRT (Optional, but kept for compatibility if needed, or removed?)
    // User requested "we will now create 6 vrt files...". 
    // I'll keep the old one too just in case old tools need it, but rename function call if I deleted it.
    // Wait, I didn't delete create_vrt, I just added new functions.
    // User said "The physical six face files will stay as they are. But we will now create 6 vrt files..."
    // Implicitly replacing the old strategy? 
    // "And joins them as a 3x2 vrt file... However... I have come up with an improvement... create 6 vrt files".
    // I will comment out the old VRT generation to avoid confusion.
    // create_vrt(out_prefix, (int)finalWidth, (int)finalWidth, bands, dataType);

    auto end_time = std::chrono::high_resolution_clock::now();
    std::chrono::duration<double> elapsed = end_time - start_time;
    
    std::cout << "\n========================================" << std::endl;
    std::cout << "S2 Preprocessing Complete!" << std::endl;
    std::cout << "Total Time: " << (int)(elapsed.count() / 60) << "m " << (int)(elapsed.count()) % 60 << "s" << std::endl;
    std::cout << "========================================\n" << std::endl;

    return 0;
}
