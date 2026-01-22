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

enum Resample { BILINEAR, BICUBIC, LANCZOS };

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

struct Point3D {
    double x, y, z;
};

// S2 Neighbor Transition Table removed (Replaced by Geometric Logic)

// S2 Quadratic Projection (ST -> UV)
inline double s2_st_to_uv(double s) {
    if (s >= 0.5) return (1.0 / 3.0) * (4.0 * s * s - 1.0);
    return (1.0 / 3.0) * (1.0 - 4.0 * (1.0 - s) * (1.0 - s));
}

// Face UV -> Unit Sphere XYZ
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
    double offset = isPixelCentered ? 0.5 : 0.0;
    
    std::cout << "[DEBUG] Starting s2_preprocessor..." << std::endl;
    std::cout << "[DEBUG] Args: Input=" << input_path << ", Output=" << out_prefix << ", Zoom=" << max_zoom << std::endl;
    std::cout << "[DEBUG] Cache Config: " << cacheMax << std::endl;
    if (skipFaces > 0) std::cout << "[INFO] Skipping first " << skipFaces << " faces." << std::endl;
    
    std::cout << "[INFO] Processing Mode: " << (isPixelCentered ? "Pixel Centered" : "Vertex Centered") << " (Offset: " << offset << ")" << std::endl;
    std::cout << "[INFO] Coordinate Mode: " << (isGeodetic ? "Geodetic (Ellipsoid)" : "Planetocentric (Sphere)") << std::endl;
    std::cout << "[INFO] Output Format: " << (isOut16 ? "UInt16 (Normalized)" : "Float32 (Absolute)") << std::endl;
    
    Resample resampling = BILINEAR;
    if (resCmd == "BICUBIC") resampling = BICUBIC;
    else if (resCmd == "LANCZOS") resampling = LANCZOS;

    GDALAllRegister();
    CPLSetConfigOption("GDAL_CACHEMAX", cacheMax.c_str());
    CPLSetConfigOption("GDAL_DISABLE_READDIR_ON_OPEN", "YES");
    CPLSetConfigOption("VSI_CACHE", "YES");
    CPLSetConfigOption("VSI_CACHE_SIZE", "10000000"); // 10MB VSI cache
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
    
    std::cout << "Target: " << finalWidth << "x" << finalWidth << " (Strict S2, " << bands << " bands)" << std::endl;

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
                        }
                    }
                }
                
                // Write block
                if (finalOutType == GDT_UInt16) {
                    // Normalize Float32 outBuffer to UInt16 outBuffer16
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

                    std::cout << "Face " << face << ": " << (int)(progress * 100) << "% (" << eta_buf << ")    \r" << std::flush;
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
        std::cout << "Face " << face << ": 100% (Took " << dur_buf << ")           " << std::endl;

        std::cout << "Building Overviews for Face " << face << "..." << std::endl;
        std::vector<int> overviews;
        for (int z = 1; z <= max_zoom; ++z) overviews.push_back(1 << z);
        if (poDstDS) {
            poDstDS->BuildOverviews("LANCZOS", (int)overviews.size(), overviews.data(), 0, nullptr, nullptr, nullptr);
            GDALClose(poDstDS);
        }
    }
    GDALClose(poSrcDS);
    
    // VRT Generation
    create_vrt(out_prefix, (int)finalWidth, (int)finalWidth, bands, dataType);

    auto end_time = std::chrono::high_resolution_clock::now();
    std::chrono::duration<double> elapsed = end_time - start_time;
    
    std::cout << "\n========================================" << std::endl;
    std::cout << "S2 Preprocessing Complete!" << std::endl;
    std::cout << "Total Time: " << (int)(elapsed.count() / 60) << "m " << (int)(elapsed.count()) % 60 << "s" << std::endl;
    std::cout << "========================================\n" << std::endl;

    return 0;
}
