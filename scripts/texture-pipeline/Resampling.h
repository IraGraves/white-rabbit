#ifndef RESAMPLING_H
#define RESAMPLING_H

#include <vector>
#include <string>
#include "gdal_priv.h"

enum Resample { BILINEAR, BICUBIC, LANCZOS, AVERAGE, NEAREST, MITCHELL };

float cubicHermite(float A, float B, float C, float D, float t);
float lanczos(float x);
float mitchell_netravali(float x);

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

    static float ComputeMitchellMath(float x);
    static std::vector<FilterEntry> PrecomputeWeights(int srcSize, int dstSize);
    
    // Process float buffer (supports multi-channel interleaved)
    static void Resize(int srcW, int srcH, const std::vector<float>& input,
                       int dstW, int dstH, std::vector<float>& output, int channels = 1);
};

void GenerateMitchellOverviews(GDALDataset* poDS, const std::vector<int>& levels, int face);

#endif // RESAMPLING_H
