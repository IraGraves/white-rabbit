#ifndef S2_SAMPLING_H
#define S2_SAMPLING_H

#include "gdal_priv.h"
#include "S2Buffering.h"
#include <vector>

// Reads pixel value from buffer OR disk
// Calculates bilinear interpolation if buffering is used.
// Falls back to thread-safe RasterIO if not buffered.
void GetPixelValue(double samp_px, double samp_py, 
                   GDALDataset* targetDS, // The dataset we want to read from
                   const BufferState& primary, 
                   const BufferState& secondary,
                   int bands, 
                   std::vector<float>& result,
                   double pixel_scale,
                   int face, double lat, double lon); // For error reporting

#endif // S2_SAMPLING_H
