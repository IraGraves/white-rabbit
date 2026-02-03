#ifndef S2_BUFFERING_H
#define S2_BUFFERING_H

#include "gdal_priv.h"
#include "S2Math.h"
#include <vector>
#include <memory>
#include <iostream>

struct BufferState {
    std::vector<float> buffer;
    int width = 0;
    int height = 0;
    int x0 = 0;
    int y0 = 0;
    GDALDataset* sourceDS = nullptr; // Reference to source for checking which DS this came from
    
    bool IsEmpty() const { return buffer.empty(); }
    void Clear() { buffer.clear(); width=0; height=0; x0=0; y0=0; sourceDS=nullptr; }
};

class BufferManager {
public:
    BufferManager(GDALDataset* dsEq, GDALDataset* dsN, GDALDataset* dsS, 
                  double* gtEq, double* gtN, double* gtS, bool isProjected, 
                  int srcW, int srcH); // srcW/H needed for wrapping check

    // Determines active datasets and loads buffers for a chunk
    void LoadBuffersForChunk(int face, int cOff, int rOff, int w, int h, int finalWidth,
                             double chunkMinLat, double chunkMaxLat, 
                             double chunkMinLon, double chunkMaxLon, // For Equator Fallback
                             double semiMajor, double semiMinor, bool isGeodetic,
                             int bands, bool debug_mode);

    // Returns primary and (optional) secondary buffer
    const BufferState& GetPrimary() const { return primary; }
    const BufferState& GetSecondary() const { return secondary; }

private:
    GDALDataset* poSrcDS;
    GDALDataset* poSrcNorthDS;
    GDALDataset* poSrcSouthDS;
    double *adfGT, *adfGTNorth, *adfGTSouth;
    bool bIsProjected;
    int srcW, srcH;
    
    BufferState primary;
    BufferState secondary;

    // Helper to load a single buffer
    void LoadSingleBuffer(GDALDataset* ds, double* gt, BufferState& state, 
                          int face, int cOff, int rOff, int w, int h, int finalWidth,
                          double chunkMinLon, double chunkMaxLon,
                          double chunkMinLat, double chunkMaxLat,
                          double semiMajor, double semiMinor, bool isGeodetic,
                          int bands, bool debug_mode, const char* name);
};

#endif // S2_BUFFERING_H
