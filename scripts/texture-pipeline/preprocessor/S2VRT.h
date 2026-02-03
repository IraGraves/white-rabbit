#ifndef S2_VRT_H
#define S2_VRT_H

#include "gdal_priv.h"
#include "cpl_conv.h" // For CPL_STDCALL
#include <string>
#include <chrono>

// Creates the main VRT combining 6 faces
void create_vrt(const std::string& prefix, int w, int h, int bands, GDALDataType type);

// Creates a padded VRT for a single face using helper strips
void create_padded_face_vrt(const std::string& prefix, int face, int w, int h, int bands, GDALDataType type, int padding, int atlasPadding);

// Creates an overview VRT (downsampled view)
void create_overview_vrt(const std::string& prefix, int face, int ovr_level, int baseW, int baseH, int bands, GDALDataType type);

// Background / Helper for progress
struct OverviewProgressCtx {
    int face;
    int lastPct;
    std::chrono::high_resolution_clock::time_point startTime;
};

// Progress callback for overview building
int CPL_STDCALL OverviewProgressFunc(double dfComplete, const char *pszMessage, void *pProgressArg);

#endif
