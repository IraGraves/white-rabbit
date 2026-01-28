#include "Resampling.h"
#include <cmath>
#include <algorithm>
#include <iostream>
#include <omp.h>
#include "S2Math.h" // For M_PI

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

float FastMitchell::ComputeMitchellMath(float x) {
    return mitchell_netravali(x);
}

std::vector<FastMitchell::FilterEntry> FastMitchell::PrecomputeWeights(int srcSize, int dstSize) {
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

void FastMitchell::Resize(int srcW, int srcH, const std::vector<float>& input,
                   int dstW, int dstH, std::vector<float>& output, int channels) {
    
    auto xFilters = PrecomputeWeights(srcW, dstW);
    auto yFilters = PrecomputeWeights(srcH, dstH);

    std::vector<float> tempBuffer(dstW * srcH * channels);

    // Pass 1: Horizontal Resizing (SrcW -> DstW)
    // Processes Input(SrcW, SrcH) -> Temp(DstW, SrcH)
    #pragma omp parallel for
    for (int y = 0; y < srcH; ++y) {
        for (int x = 0; x < dstW; ++x) {
            const auto& entry = xFilters[x];
            
            // For each channel
            for (int c = 0; c < channels; ++c) {
                float val = 0.0f;
                for (const auto& contrib : entry.contributors) {
                    val += input[(y * srcW + contrib.sourceIndex) * channels + c] * contrib.weight;
                }
                tempBuffer[(y * dstW + x) * channels + c] = val * entry.normalizeFactor;
            }
        }
    }

    // Pass 2: Vertical Resizing (SrcH -> DstH)
    // Processes Temp(DstW, SrcH) -> Output(DstW, DstH)
    output.resize(dstW * dstH * channels);
    #pragma omp parallel for
    for (int x = 0; x < dstW; ++x) {
        for (int y = 0; y < dstH; ++y) {
            const auto& entry = yFilters[y];
            
            for (int c = 0; c < channels; ++c) {
                float val = 0.0f;
                for (const auto& contrib : entry.contributors) {
                    // Temp is width DstW
                    val += tempBuffer[(contrib.sourceIndex * dstW + x) * channels + c] * contrib.weight;
                }
                output[(y * dstW + x) * channels + c] = val * entry.normalizeFactor;
            }
        }
    }
}

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
            
            // Generate Mitchell from CURRENT Source (Daisy chain)
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
