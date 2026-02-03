#include "S2Analysis.h"
#include "gdal_priv.h" // For GDALDataset
#include "cpl_string.h"
#include "S2Math.h" // For face_uv_to_xyz
#include <iostream>
#include <iomanip>
#include <cmath>
#include <algorithm>
#include <sstream>

// Helper to get formatted range string
std::string FormatRange(double minV, double maxV) {
    std::stringstream ss;
    ss << std::fixed << std::setprecision(2);
    if (std::abs(maxV - minV) < 0.01) {
        ss << minV;
    } else {
        ss << minV << "-" << maxV;
    }
    return ss.str();
}

static void PrintDatasetInfo(const char* label, GDALDataset* ds) {
    if (!ds) {
        std::cout << "[ANALYSIS] " << label << ": <Not Provided>" << std::endl;
        return;
    }
    
    int w = ds->GetRasterXSize();
    int h = ds->GetRasterYSize();
    int bands = ds->GetRasterCount();
    
    std::cout << "[ANALYSIS] " << label << ":" << std::endl;
    std::cout << "  - Path: " << ds->GetDescription() << std::endl;
    std::cout << "  - Size: " << w << " x " << h << " (" << bands << " bands)" << std::endl;
    std::cout << "  - Driver: " << ds->GetDriver()->GetDescription() << std::endl;
    
    const char* proj = ds->GetProjectionRef();
    if (proj && strlen(proj) > 0) {
        OGRSpatialReference srs(proj);
        
        const char* projName = srs.GetAttrValue("PROJCS");
        if (projName) {
            std::cout << "  - Projection: " << projName << " (Projected)" << std::endl;
        } else {
             const char* geogName = srs.GetAttrValue("GEOGCS");
             std::string finalName = (geogName && strlen(geogName) > 0 && std::string(geogName) != "unknown") ? geogName : "Unknown";
             
             // Inference
             if (finalName == "Unknown") {
                 double gt[6];
                 if (ds->GetGeoTransform(gt) == CE_None) {
                     if (std::abs(std::abs(gt[1]) - std::abs(gt[5])) < 1e-9) {
                         finalName = "Equirectangular / Plate Carrée (Inferred)";
                     }
                 }
             }
             std::cout << "  - Projection: " << finalName << " (Geographic)" << std::endl;
        }

        const char* srsName = srs.GetAttrValue("AUTHORITY", 0);
        const char* srsCode = srs.GetAttrValue("AUTHORITY", 1);
        if (srsName && srsCode) {
             std::cout << "  - Authority: " << srsName << ":" << srsCode << std::endl;
        }
    } else {
        std::cout << "  - Projection: <None/Unknown>" << std::endl;
    }
    
    double adfGT[6];
    if (ds->GetGeoTransform(adfGT) == CE_None) {
        std::cout << "  - GeoTransform: Origin=(" << adfGT[0] << "," << adfGT[3] << ") Pixel=(" << adfGT[1] << "," << adfGT[5] << ")" << std::endl;
        
        double x1 = adfGT[0];
        double x2 = adfGT[0] + w * adfGT[1] + h * adfGT[2];
        double y1 = adfGT[3];
        double y2 = adfGT[3] + w * adfGT[4] + h * adfGT[5];
        
        double minX = std::min(x1, x2);
        double maxX = std::max(x1, x2);
        double minY = std::min(y1, y2);
        double maxY = std::max(y1, y2);
        
        const char* unitName = nullptr;
        if (ds->GetProjectionRef() && strlen(ds->GetProjectionRef()) > 0) {
            OGRSpatialReference srs(ds->GetProjectionRef());
            if (srs.IsProjected()) {
                srs.GetLinearUnits(&unitName);
            } else {
                srs.GetAngularUnits(&unitName);
            }
        }
        std::string unitStr = (unitName) ? unitName : "Unknown Units";
        
        std::cout << "  - Coverage: X[" << minX << " to " << maxX << "] Y[" << minY << " to " << maxY << "] (" << unitStr << ")" << std::endl;
    }
    
    // Quick Min/Max check (Metadata only)
    const char* minVal = ds->GetMetadataItem("DEM_MIN");
    const char* maxVal = ds->GetMetadataItem("DEM_MAX");
    if (minVal && maxVal) {
        std::cout << "  - Metadata Range: " << minVal << " to " << maxVal << std::endl;
    }
}

static void PrintResolutionTable(const char* label, GDALDataset* ds, int maxZoom, int tileSize) {
    if (!ds) return;
    double adfGT[6];
    if (ds->GetGeoTransform(adfGT) != CE_None) return;

    std::cout << "\n[ANALYSIS] Resolution Analysis (" << label << "):" << std::endl;
    std::cout << std::left << std::setw(6) << "Level" 
              << std::setw(12) << "Target" 
              // << std::setw(12) << "Src H"  // Can't show simple Src pixels if scale varies
              // << std::setw(12) << "Src V" 
              << std::setw(20) << "Scale H (Range)" 
              << std::setw(20) << "Scale V (Range)" << std::endl;
    std::cout << std::string(60, '-') << std::endl;
    
    // Using Face 0 (Equatorial) as representative
    for (int z = 0; z <= maxZoom; ++z) {
        long long targetFaceW = (long long)std::pow(2, z) * tileSize;
        
        double minSx = 1e9, maxSx = -1e9;
        double minSy = 1e9, maxSy = -1e9;
        
        // Sample points on Face 0
        int steps = 5;
        for (int i = 0; i <= steps; ++i) {
            for (int j = 0; j <= steps; ++j) {
                double u = (double)i / steps;
                double v = (double)j / steps;
                
                // Finite difference for derivative
                double eps = 1e-4; // Small step in UV space
                
                Point3D p0 = face_uv_to_xyz(0, u, v);
                Point3D pX = face_uv_to_xyz(0, u + eps, v);
                Point3D pY = face_uv_to_xyz(0, u, v + eps);
                
                double lat0, lon0; xyz_to_latlon(p0, 0, 0, lat0, lon0, false); // unit sphere
                double latX, lonX; xyz_to_latlon(pX, 0, 0, latX, lonX, false);
                double latY, lonY; xyz_to_latlon(pY, 0, 0, latY, lonY, false);
                
                // Convert to Source Pixels
                // X (Lon)
                double sx0 = (lon0 - adfGT[0]) / adfGT[1];
                double sxX = (lonX - adfGT[0]) / adfGT[1];
                double dx_src = std::abs(sxX - sx0);
                // Wrap handling? If dLon huge. But eps is small.
                
                // Y (Lat)
                double sy0 = (lat0 - adfGT[3]) / adfGT[5];
                double syY = (latY - adfGT[3]) / adfGT[5];
                double dy_src = std::abs(syY - sy0);
                
                // Target Pixels delta
                double d_tgt = eps * targetFaceW;
                
                double sX = dx_src / d_tgt;
                double sY = dy_src / d_tgt;
                
                if (sX < minSx) minSx = sX;
                if (sX > maxSx) maxSx = sX;
                if (sY < minSy) minSy = sY;
                if (sY > maxSy) maxSy = sY;
            }
        }
        
        std::cout << std::left << std::setw(6) << z 
                  << std::setw(12) << targetFaceW
                  << std::setw(20) << FormatRange(minSx, maxSx)
                  << std::setw(20) << FormatRange(minSy, maxSy) << std::endl;
    }
}

// ... AnalyzeInput remains similar but calls new functions ...
// I need to only replace up to PrintResolutionTable and leave AnalyzeInput's polar part for next chunk or assume I can't overwrite it all.
// The previous replace was large.
// I will rewrite the whole file content to be safe and clean, reusing the Polar logic (maybe updating it too).
// Actually, Polar logic is simple, let's keep it simple for now or update it to use same scaling?
// User complained about Equatorial. I'll focus on that.

void AnalyzeInput(const std::string& inputPath, 
                  const std::string& northPath, 
                  const std::string& southPath,
                  int maxZoom, int maxZoomPole, int tileSize) 
{
    GDALAllRegister();
    
    std::cout << "\n=== S2 Preprocessor Analysis Report ===\n" << std::endl;
    
    GDALDataset* dsMain = (GDALDataset*)GDALOpen(inputPath.c_str(), GA_ReadOnly);
    GDALDataset* dsNorth = nullptr; 
    if(!northPath.empty()) dsNorth = (GDALDataset*)GDALOpen(northPath.c_str(), GA_ReadOnly);
    GDALDataset* dsSouth = nullptr;
    if(!southPath.empty()) dsSouth = (GDALDataset*)GDALOpen(southPath.c_str(), GA_ReadOnly);
    
    PrintDatasetInfo("Equatorial Input", dsMain);
    if(dsNorth) PrintDatasetInfo("North Polar Input", dsNorth);
    if(dsSouth) PrintDatasetInfo("South Polar Input", dsSouth);
    
    if (dsMain) {
        PrintResolutionTable("Equatorial Faces", dsMain, maxZoom, tileSize);
    }
    
    if (dsNorth) {
        // ... Polar logic ...
        // Re-implementing the polar loop to match style if possible, or keeping it basic.
        // Let's keep the basic one but formatted nicer.
        double gt[6];
        if (dsNorth->GetGeoTransform(gt) == CE_None) {
            double metersPerPxX = std::abs(gt[1]);
            double metersPerPxY = std::abs(gt[5]);
            double srcPixelsX = 2728000.0 / metersPerPxX;
            double srcPixelsY = 2728000.0 / metersPerPxY;
            
             std::cout << "\n[ANALYSIS] Resolution Analysis (North Polar Face - Approx):" << std::endl;
             std::cout << std::left << std::setw(6) << "Level" 
              << std::setw(12) << "Target" 
              << std::setw(20) << "Scale H (Avg)" 
              << std::setw(20) << "Scale V (Avg)" << std::endl;
            std::cout << std::string(60, '-') << std::endl;

            for (int z = 0; z <= maxZoomPole; ++z) {
                long long targetFaceW = (long long)std::pow(2, z) * tileSize;
                double scaleX = srcPixelsX / (double)targetFaceW;
                double scaleY = srcPixelsY / (double)targetFaceW;
                
                std::cout << std::left << std::setw(6) << z 
                          << std::setw(12) << targetFaceW
                          << std::setw(20) << std::fixed << std::setprecision(2) << scaleX
                          << std::setw(20) << std::fixed << std::setprecision(2) << scaleY << std::endl;
            }
        }
    }
    
    if (dsMain) GDALClose(dsMain);
    if (dsNorth) GDALClose(dsNorth);
    if (dsSouth) GDALClose(dsSouth);
    
    std::cout << "\n=== End of Report ===" << std::endl;
}
