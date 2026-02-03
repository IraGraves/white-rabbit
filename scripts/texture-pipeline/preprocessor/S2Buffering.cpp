#include "S2Buffering.h"
#include "ogr_spatialref.h"
#include "cpl_string.h"
#include <cmath>
#include <algorithm>
#include <iostream>
#include <iomanip>

BufferManager::BufferManager(GDALDataset* dsEq, GDALDataset* dsN, GDALDataset* dsS, 
                             double* gtEq, double* gtN, double* gtS, bool isProjected, 
                             int w, int h)
    : poSrcDS(dsEq), poSrcNorthDS(dsN), poSrcSouthDS(dsS),
      adfGT(gtEq), adfGTNorth(gtN), adfGTSouth(gtS),
      bIsProjected(isProjected), srcW(w), srcH(h)
{
}

void BufferManager::LoadBuffersForChunk(int face, int cOff, int rOff, int w, int h, int finalWidth,
                                        double chunkMinLat, double chunkMaxLat, 
                                        double chunkMinLon, double chunkMaxLon,
                                        double semiMajor, double semiMinor, bool isGeodetic,
                                        int bands, bool debug_mode)
{
    // Clear previous state
    primary.Clear();
    secondary.Clear();

    // "Overlap" logic: If a chunk's latitude range suggests it might need polar data
    bool overlapsNorth = (chunkMaxLat > 60) && poSrcNorthDS;
    bool overlapsSouth = (chunkMinLat < -60) && poSrcSouthDS;
    
    // Default to Primary = Equator
    GDALDataset* pBufDS = poSrcDS;
    double* pBufGT = adfGT;
    const char* primName = "Primary";
    
    GDALDataset* pBufDS2 = nullptr;
    double* pBufGT2 = nullptr;

    // If strictly polar, switch primary
    // If overlapping, we might need both. 
    // For simplicity in this "Pre-Alpha" fix:
    // If it touches the pole region, try to use the Pole dataset as primary.
    // Use Equator as secondary if needed.
    
    if (overlapsNorth) {
        pBufDS = poSrcNorthDS;
        pBufGT = adfGTNorth;
        // If it also goes below 60 (overlap zone), overlap with equator?
        // Usually polar maps cover down to 60 or 50.
        // Let's assume if it's > 60, we rely on North. 
        // If it dips below 60, we might need Equator.
        if (chunkMinLat < 60) {
             pBufDS2 = poSrcDS;
             pBufGT2 = adfGT;
        }
    } else if (overlapsSouth) {
        pBufDS = poSrcSouthDS;
        pBufGT = adfGTSouth;
        if (chunkMaxLat > -60) {
             pBufDS2 = poSrcDS;
             pBufGT2 = adfGT;
        }
    } else {
        // purely equatorial
        pBufDS = poSrcDS;
        pBufGT = adfGT;
    }

    // Load Primary
    LoadSingleBuffer(pBufDS, pBufGT, primary, face, cOff, rOff, w, h, finalWidth,
                     chunkMinLon, chunkMaxLon, chunkMinLat, chunkMaxLat,
                     semiMajor, semiMinor, isGeodetic, bands, debug_mode, primName);

    // Load Secondary (if active)
    if (pBufDS2) {
         LoadSingleBuffer(pBufDS2, pBufGT2, secondary, face, cOff, rOff, w, h, finalWidth,
                          chunkMinLon, chunkMaxLon, chunkMinLat, chunkMaxLat,
                          semiMajor, semiMinor, isGeodetic, bands, debug_mode, "Secondary");
    }
}

void BufferManager::LoadSingleBuffer(GDALDataset* ds, double* gt, BufferState& state, 
                                     int face, int cOff, int rOff, int w, int h, int finalWidth,
                                     double chunkMinLon, double chunkMaxLon,
                                     double chunkMinLat, double chunkMaxLat,
                                     double semiMajor, double semiMinor, bool isGeodetic,
                                     int bands, bool debug_mode, const char* name)
{
    state.sourceDS = ds; 

    OGRSpatialReference oLatLon;
    oLatLon.SetWellKnownGeogCS("WGS84"); 

    std::unique_ptr<OGRCoordinateTransformation> poCT(nullptr);
    // needCT if dataset is NOT the main equator one OR main equator is projected
    bool needCT = (ds != poSrcDS) || bIsProjected; 
    
    if (needCT && ds->GetSpatialRef()) {
        poCT.reset(OGRCreateCoordinateTransformation(&oLatLon, ds->GetSpatialRef()));
    }

    double min_px = 1e15, max_px = -1e15;
    double min_py = 1e15, max_py = -1e15;
    int dsW = ds->GetRasterXSize();
    int dsH = ds->GetRasterYSize();

    if (poCT) {
        // Projected (Polar or other): Dense sampling to find bounds
        // User Fix: Use dense sampling instead of just corners
        int steps = 10; 
        for (int i = 0; i <= steps; ++i) {
            for (int j = 0; j <= steps; ++j) {
                double u = (double)(cOff + (w * i / steps)) / (double)finalWidth;
                double v = 1.0 - (double)(rOff + (h * j / steps)) / (double)finalWidth;
                
                Point3D p = face_uv_to_xyz(face, u, v);
                double lat, lon; xyz_to_latlon(p, semiMajor, semiMinor, lat, lon, isGeodetic);
                
                double tx = lon, ty = lat;
                if (poCT->Transform(1, &tx, &ty)) {
                    double px = (tx - gt[0]) / gt[1];
                    double py = (ty - gt[3]) / gt[5];
                    if (px < min_px) min_px = px;
                    if (px > max_px) max_px = px;
                    if (py < min_py) min_py = py;
                    if (py > max_py) max_py = py;
                }
            }
        }
    } else {
        // Equirectangular (Simple Lat/Lon) - Bounds are usually reliable from chunk extents
        // But let's be safe and use limits
        std::vector<double> sample_lons = {chunkMinLon, chunkMaxLon};
        std::vector<double> sample_lats = {chunkMinLat, chunkMaxLat};
        
        // Handle wrapping for global map
        if (chunkMaxLon - chunkMinLon > 180) {
             // wide chunk potentially crossing dateline (logic handled in caller usually)
        }

        for (double lon_s : sample_lons) {
            for (double lat_s : sample_lats) {
                double py = (lat_s - gt[3]) / gt[5];
                min_py = std::min(min_py, py); max_py = std::max(max_py, py);
                
                double sx = (lon_s - gt[0]) / gt[1];
                // normalize x
                while (sx < 0) sx += dsW;
                while (sx >= dsW) sx -= dsW;
                
                min_px = std::min(min_px, sx); max_px = std::max(max_px, sx);
            }
        }
        
        // If wrapping occurred in X (min > max), we might have issues.
        // For this buffer implementation, we assume a single contiguous read. 
        // If it wraps, we might need a wider buffer or 2-pass. 
        // Simple fix: if it wraps, load the whole width? Or just let the cache handle it.
        // For now, assume standard bounds.
    }

    if (max_px < min_px) { 
        // Should not happen unless logic above failed (e.g. wrap)
        // Reset
        min_px = 0; max_px = dsW - 1; 
    }

    if (min_px < 1e14) {
        int pad = 4; // Padding for interpolation
        int x0 = (int)std::floor(min_px) - pad;
        int x1 = (int)std::ceil(max_px) + pad;
        int y0 = (int)std::floor(min_py) - pad;
        int y1 = (int)std::ceil(max_py) + pad;

        // Clamp
        x0 = std::max(0, x0); x1 = std::min(dsW - 1, x1);
        y0 = std::max(0, y0); y1 = std::min(dsH - 1, y1);

        int rW = x1 - x0 + 1;
        int rH = y1 - y0 + 1;
        
        // Size Check (Don't allocate crazy RAM)
        // If > 2GB, maybe fail or clamp? 
        // Assume sensible chunks.

        if (rW > 0 && rH > 0) {
            try {
                 // Re-allocate only if needed? For now, simple resize.
                state.buffer.resize((size_t)rW * rH * bands);
                
                if (debug_mode && (face==2 || face==5) && rH > 100) {
                     // Only log big buffers
                     std::cout << "[DEBUG] Buffering " << name << " (" << rW << "x" << rH << ") @ " << x0 << "," << y0 << std::endl;
                }

                bool ok = true;
                for (int b = 0; b < bands; ++b) {
                   if(ds->GetRasterBand(b+1)->RasterIO(GF_Read, x0, y0, rW, rH, 
                                                    state.buffer.data() + b, rW, rH, 
                                                    GDT_Float32, 
                                                    (GSpacing)bands * sizeof(float), 
                                                    (GSpacing)rW * bands * sizeof(float)) != CE_None)
                   {
                       ok = false;
                   }
                }
                
                if (ok) {
                    state.width = rW;
                    state.height = rH;
                    state.x0 = x0;
                    state.y0 = y0;
                } else {
                    state.Clear();
                    if(debug_mode) std::cerr << "[WARN] Buffered Read Failed!" << std::endl;
                }
            } catch (const std::exception& e) { 
                if(debug_mode) std::cerr << "[ERR] Buffer Alloc Failed: " << e.what() << std::endl;
                state.Clear(); 
            }
        }
    }
}
