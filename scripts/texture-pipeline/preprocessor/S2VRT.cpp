#include "S2VRT.h"
#include <iostream>
#include <fstream>
#include <vector>
#include <iomanip>
#include <chrono>

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

void create_padded_face_vrt(const std::string& prefix, int face, int w, int h, int bands, GDALDataType type, int padding, int atlasPadding) {
    std::string vrt_path = prefix + "_face" + std::to_string(face) + ".vrt";
    std::ofstream vrt(vrt_path);
    if (!vrt.is_open()) return;

    // Dimensions: W + 2P
    int fullW = w + 2 * padding;
    int fullH = h + 2 * padding;
    
    std::string face_tif = prefix + "_face" + std::to_string(face) + ".tif";
    size_t last_slash = face_tif.find_last_of("/\\");
    std::string face_rel = (last_slash == std::string::npos) ? face_tif : face_tif.substr(last_slash + 1);
    
    std::string h_tif = prefix + "_horizontal_strips.tif";
    std::string h_rel = (last_slash == std::string::npos) ? h_tif : h_tif.substr(last_slash + 1);
    
    std::string v_tif = prefix + "_vertical_strips.tif";
    std::string v_rel = (last_slash == std::string::npos) ? v_tif : v_tif.substr(last_slash + 1);

    vrt << "<VRTDataset rasterXSize=\"" << fullW << "\" rasterYSize=\"" << fullH << "\">\n";
    const char* type_name = GDALGetDataTypeName(type);
    
    for (int b = 1; b <= bands; ++b) {
        vrt << "  <VRTRasterBand dataType=\"" << type_name << "\" band=\"" << b << "\">\n";
        
        // 1. Center (The Face Itself)
        vrt << "    <SimpleSource>\n";
        vrt << "      <SourceFilename relativeToVRT=\"1\">" << face_rel << "</SourceFilename>\n";
        vrt << "      <SourceBand>" << b << "</SourceBand>\n";
        vrt << "      <SrcRect xOff=\"0\" yOff=\"0\" xSize=\"" << w << "\" ySize=\"" << h << "\"/>\n";
        vrt << "      <DstRect xOff=\"" << padding << "\" yOff=\"" << padding << "\" xSize=\"" << w << "\" ySize=\"" << h << "\"/>\n";
        vrt << "    </SimpleSource>\n";
        
        // 2. Top (Horizontal Strip 2*face)
        vrt << "    <SimpleSource>\n";
        vrt << "      <SourceFilename relativeToVRT=\"1\">" << h_rel << "</SourceFilename>\n";
        vrt << "      <SourceBand>" << b << "</SourceBand>\n";
        vrt << "      <SrcRect xOff=\"0\" yOff=\"" << (2*face)*atlasPadding << "\" xSize=\"" << fullW << "\" ySize=\"" << padding << "\"/>\n";
        vrt << "      <DstRect xOff=\"0\" yOff=\"0\" xSize=\"" << fullW << "\" ySize=\"" << padding << "\"/>\n";
        vrt << "    </SimpleSource>\n";

        // 3. Bottom (Horizontal Strip 2*face + 1)
        vrt << "    <SimpleSource>\n";
        vrt << "      <SourceFilename relativeToVRT=\"1\">" << h_rel << "</SourceFilename>\n";
        vrt << "      <SourceBand>" << b << "</SourceBand>\n";
        vrt << "      <SrcRect xOff=\"0\" yOff=\"" << (2*face + 1)*atlasPadding << "\" xSize=\"" << fullW << "\" ySize=\"" << padding << "\"/>\n";
        vrt << "      <DstRect xOff=\"0\" yOff=\"" << h + padding << "\" xSize=\"" << fullW << "\" ySize=\"" << padding << "\"/>\n";
        vrt << "    </SimpleSource>\n";

        // 4. Left (Vertical Strip 2*face)
        vrt << "    <SimpleSource>\n";
        vrt << "      <SourceFilename relativeToVRT=\"1\">" << v_rel << "</SourceFilename>\n";
        vrt << "      <SourceBand>" << b << "</SourceBand>\n";
        vrt << "      <SrcRect xOff=\"" << (2*face)*atlasPadding << "\" yOff=\"0\" xSize=\"" << padding << "\" ySize=\"" << h << "\"/>\n";
        vrt << "      <DstRect xOff=\"0\" yOff=\"" << padding << "\" xSize=\"" << padding << "\" ySize=\"" << h << "\"/>\n";
        vrt << "    </SimpleSource>\n";

        // 5. Right (Vertical Strip 2*face + 1)
        vrt << "    <SimpleSource>\n";
        vrt << "      <SourceFilename relativeToVRT=\"1\">" << v_rel << "</SourceFilename>\n";
        vrt << "      <SourceBand>" << b << "</SourceBand>\n";
        vrt << "      <SrcRect xOff=\"" << (2*face + 1)*atlasPadding << "\" yOff=\"0\" xSize=\"" << padding << "\" ySize=\"" << h << "\"/>\n";
        vrt << "      <DstRect xOff=\"" << w + padding << "\" yOff=\"" << padding << "\" xSize=\"" << padding << "\" ySize=\"" << h << "\"/>\n";
        vrt << "    </SimpleSource>\n";
        
        vrt << "  </VRTRasterBand>\n";
    }
    vrt << "</VRTDataset>\n";
    vrt.close();
}

void create_overview_vrt(const std::string& prefix, int face, int ovr_level, 
                         int baseW, int baseH, int bands, GDALDataType type) {
    int ovrFactor = 1 << ovr_level;
    int ovrW = baseW / ovrFactor;
    int ovrH = baseH / ovrFactor;
    
    std::string vrt_path = prefix + "_face" + std::to_string(face) 
                         + "_ovr" + std::to_string(ovr_level) + ".vrt";
    
    std::string parent_vrt = prefix + "_face" + std::to_string(face) + ".vrt";
    size_t last_slash = parent_vrt.find_last_of("/\\");
    std::string parent_rel = (last_slash == std::string::npos) ? parent_vrt : parent_vrt.substr(last_slash + 1);
    
    std::ofstream vrt(vrt_path);
    if (!vrt.is_open()) {
        std::cerr << "[ERROR] Could not create overview VRT: " << vrt_path << std::endl;
        return;
    }
    
    const char* type_name = GDALGetDataTypeName(type);
    
    vrt << "<VRTDataset rasterXSize=\"" << ovrW << "\" rasterYSize=\"" << ovrH << "\">\n";
    
    for (int b = 1; b <= bands; ++b) {
        vrt << "  <VRTRasterBand dataType=\"" << type_name << "\" band=\"" << b << "\">\n";
        vrt << "    <SimpleSource>\n";
        vrt << "      <SourceFilename relativeToVRT=\"1\">" << parent_rel << "</SourceFilename>\n";
        vrt << "      <SourceBand>" << b << "</SourceBand>\n";
        vrt << "      <SrcRect xOff=\"0\" yOff=\"0\" xSize=\"" << baseW << "\" ySize=\"" << baseH << "\"/>\n";
        vrt << "      <DstRect xOff=\"0\" yOff=\"0\" xSize=\"" << ovrW << "\" ySize=\"" << ovrH << "\"/>\n";
        vrt << "    </SimpleSource>\n";
        vrt << "  </VRTRasterBand>\n";
    }
    
    vrt << "</VRTDataset>\n";
    vrt.close();
    
    std::cout << "[INFO] Created Overview VRT: " << vrt_path << " (Level " << ovr_level << ", " << ovrW << "x" << ovrH << ")" << std::endl;
}

// CPL_STDCALL is required for GDAL callbacks
int CPL_STDCALL OverviewProgressFunc(double dfComplete, const char *pszMessage, void *pProgressArg) {
    OverviewProgressCtx* ctx = (OverviewProgressCtx*)pProgressArg;
    // Implementation can be simpler but copying provided logic
    int pct = (int)(dfComplete * 100.0);
    
    if (pct >= ctx->lastPct + 5 || (pct == 100 && ctx->lastPct != 100)) {
        ctx->lastPct = pct;
        
        auto now = std::chrono::high_resolution_clock::now();
        std::chrono::duration<double> elapsed = now - ctx->startTime;
        double elapsedSec = elapsed.count();
        
        if (pct >= 100) {
             int total_s = (int)elapsedSec;
             int h = total_s / 3600;
             int m = (total_s % 3600) / 60;
             int s = total_s % 60;
             char dur_buf[32];
             snprintf(dur_buf, sizeof(dur_buf), "%02d:%02d:%02d", h, m, s);
             std::cout << "[PROGRESS:Face" << ctx->face << "_OV] Building Overviews Face " << ctx->face << ": 100% (Took " << dur_buf << ")" << std::endl;
        } else if (pct > 0) {
            double rate = elapsedSec / pct; // seconds per percent
            double remaining = rate * (100.0 - pct);
            int remSec = (int)remaining;
            
            int h = remSec / 3600;
            int m = (remSec % 3600) / 60;
            int s = remSec % 60;
            // Simplified logging
            if (pct % 10 == 0) std::cout << "[PROGRESS:Face" << ctx->face << "_OV] Face " << ctx->face << " Overviews: " << pct << "% / ETA " << h << ":" << m << ":" << s << std::endl;
        }
    }
    
    return 1; // Continue
}
