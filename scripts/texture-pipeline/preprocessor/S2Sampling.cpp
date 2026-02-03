#include "S2Sampling.h"
#include <cmath>
#include <algorithm>
#include <iostream>
#include <omp.h>

void GetPixelValue(double samp_px, double samp_py, 
                   GDALDataset* targetDS, 
                   const BufferState& primary, 
                   const BufferState& secondary,
                   int bands, 
                   std::vector<float>& result,
                   double pixel_scale,
                   int face, double lat, double lon)
{
    const BufferState* pActiveBuf = nullptr;
    double localX = 0, localY = 0;

    auto TryBuffer = [&](const BufferState& st) -> bool {
        if (st.IsEmpty() || st.sourceDS != targetDS) return false;
        
        double lx = samp_px - (double)st.x0;
        double ly = samp_py - (double)st.y0;
        
        // Wrap check (Standard Equator logic)
        int dsW = st.sourceDS->GetRasterXSize();
        if (lx < 0) lx += (double)dsW;
        if (lx >= dsW) lx -= (double)dsW;

        if (lx >= 0 && lx <= st.width - 1.0 && 
            ly >= 0 && ly <= st.height - 1.0) {
            localX = lx;
            localY = ly;
            pActiveBuf = &st;
            return true;
        }
        return false;
    };

    if (TryBuffer(primary) || TryBuffer(secondary)) {
        // Bilinear Interpolation
        int x0 = (int)localX; int y0 = (int)localY;
        int x1 = std::min(x0 + 1, pActiveBuf->width - 1);
        int y1 = std::min(y0 + 1, pActiveBuf->height - 1);
        
        // Wrap edge case within buffer? 
        // Our buffering logic assumes buffer is contiguous or handles wrap at global logical level
        // For simplicity, we clamp to buffer edge here as standard bilinear
        
        float dx = (float)(localX - x0);
        float dy = (float)(localY - y0);
        
        const std::vector<float>& buf = pActiveBuf->buffer;
        int w = pActiveBuf->width;

        for (int b = 0; b < bands; ++b) {
            float v00 = buf[(y0 * w + x0) * bands + b];
            float v10 = buf[(y0 * w + x1) * bands + b];
            float v01 = buf[(y1 * w + x0) * bands + b];
            float v11 = buf[(y1 * w + x1) * bands + b];
            float val = v00 * (1.f - dx) * (1.f - dy) + v10 * dx * (1.f - dy) + v01 * (1.f - dx) * dy + v11 * dx * dy;
            result[b] = val;
        }
    } else {
        // Fallback: Direct IO
        int px = (int)samp_px; int py = (int)samp_py;
        int dsW = targetDS->GetRasterXSize();
        int dsH = targetDS->GetRasterYSize();

        if (px >= 0 && px < dsW && py >= 0 && py < dsH) {
            #pragma omp critical(gdal_direct_io)
            {
                for (int b = 0; b < bands; ++b) {
                    float val;
                    targetDS->GetRasterBand(b+1)->RasterIO(GF_Read, px, py, 1, 1, &val, 1, 1, GDT_Float32, 0, 0);
                    result[b] = val;
                }
            }
        } else {
            #pragma omp critical(debug_print)
            {
                std::cerr << "\n[FATAL ERROR] Pixel request out of range!" << std::endl;
                std::cerr << "              Face: " << face << " Pixel: (" << px << ", " << py << ")" << std::endl;
                std::cerr << "              Lat/Lon: " << lat << ", " << lon << std::endl;
                exit(1);
            }
        }
    }

    if (pixel_scale != 1.0) {
        for(int b=0; b<bands; ++b) result[b] *= (float)pixel_scale;
    }
}
