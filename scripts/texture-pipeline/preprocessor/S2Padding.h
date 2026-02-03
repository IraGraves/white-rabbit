#ifndef S2_PADDING_H
#define S2_PADDING_H

#include "gdal_priv.h"
#include <vector>
#include <string>

// Helper functions 
void read_strip(GDALDataset* ds, int edge, int P, int W, int H, std::vector<float>& buffer);
void copy_rotated(const std::vector<float>& src, int srcW, int srcH, 
                  std::vector<float>& dst, int dstW, int dstH, 
                  int bands, int rotation_ccw_deg, bool flip_h, bool flip_v);

// Main padding generation function
void generate_padding_strips(const std::string& prefix, const std::vector<int>& faceWidths, int bands);

#endif
