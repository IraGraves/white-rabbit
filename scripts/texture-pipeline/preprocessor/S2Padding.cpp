#include "S2Padding.h"
#include "S2Topology.h"
#include "Resampling.h"
#include <iostream>
#include <algorithm>
#include <omp.h>
#include <cmath>

extern bool debug_mode;

void read_strip(GDALDataset* ds, int edge, int P, int W, int H, std::vector<float>& buffer) {
    int bands = ds->GetRasterCount();
    buffer.resize(W * P * bands); 
    GSpacing sz = sizeof(float);
    GSpacing nPixelSpace = bands * sz;
    GSpacing nBandSpace = sz;

    if (edge == E_N) {
        GSpacing nLineSpace = W * bands * sz;
        ds->RasterIO(GF_Read, 0, 0, W, P, buffer.data(), W, P, GDT_Float32, bands, nullptr, nPixelSpace, nLineSpace, nBandSpace);
    } else if (edge == E_S) {
        GSpacing nLineSpace = W * bands * sz;
        ds->RasterIO(GF_Read, 0, H - P, W, P, buffer.data(), W, P, GDT_Float32, bands, nullptr, nPixelSpace, nLineSpace, nBandSpace);
    } else if (edge == E_W) {
        GSpacing nLineSpace = P * bands * sz;
        ds->RasterIO(GF_Read, 0, 0, P, H, buffer.data(), P, H, GDT_Float32, bands, nullptr, nPixelSpace, nLineSpace, nBandSpace);
    } else if (edge == E_E) {
        GSpacing nLineSpace = P * bands * sz;
        ds->RasterIO(GF_Read, W - P, 0, P, H, buffer.data(), P, H, GDT_Float32, bands, nullptr, nPixelSpace, nLineSpace, nBandSpace);
    }
}

void copy_rotated(const std::vector<float>& src, int srcW, int srcH, 
                 std::vector<float>& dst, int dstW, int dstH, 
                 int bands, int rotation_ccw_deg, bool flip_h, bool flip_v) {
    
    // Safety check size
    if (src.size() != dst.size()) {
        // Warning?
    }

    #pragma omp parallel for
    for (int dy = 0; dy < dstH; ++dy) {
        for (int dx = 0; dx < dstW; ++dx) {
            int tsx = dx;
            int tsy = dy;

            // Reverse Rotation (Dst -> Src)
            if (rotation_ccw_deg == 90) { 
                tsx = dy;
                tsy = dstW - 1 - dx; 
            } else if (rotation_ccw_deg == 180) {
                tsx = dstW - 1 - dx;
                tsy = dstH - 1 - dy;
            } else if (rotation_ccw_deg == 270) {
                 tsx = dstH - 1 - dy;
                 tsy = dx;
            }

            // Apply Flips (relative to src coords)
            if (flip_h) tsx = srcW - 1 - tsx;
            if (flip_v) tsy = srcH - 1 - tsy;

            // Clamp
            if (tsx < 0) tsx = 0; if (tsx >= srcW) tsx = srcW-1;
            if (tsy < 0) tsy = 0; if (tsy >= srcH) tsy = srcH-1;

            for (int b = 0; b < bands; ++b) {
                dst[(dy * dstW + dx) * bands + b] = src[(tsy * srcW + tsx) * bands + b];
            }
        }
    }
}

static void blend_corner(int P, int bands, 
                  const std::vector<float>& src_H, 
                  const std::vector<float>& src_V, 
                  std::vector<float>& dst) {
    
    if (src_H.empty() || src_V.empty()) return;

    #pragma omp parallel for
    for(int y=0; y<P; ++y) {
        for(int x=0; x<P; ++x) {
            float dist = (float)(x - y); 
            float w_h = 0.5f + dist * 0.5f; 
            w_h = std::clamp(w_h, 0.0f, 1.0f);
            float w_v = 1.0f - w_h;
            
            for(int b=0; b<bands; ++b) {
               float val = src_H[(y*P + x)*bands + b] * w_h + src_V[(y*P + x)*bands + b] * w_v;
               dst[(y*P + x)*bands + b] = val;
            }
        }
    }
}

static void read_corner(GDALDataset* ds, int corner, int P, int W, int H, std::vector<float>& buffer) {
    int bands = ds->GetRasterCount();
    buffer.resize(P * P * bands);
    int xOff = (corner == 1 || corner == 2) ? (W - P) : 0;
    int yOff = (corner == 2 || corner == 3) ? (H - P) : 0;
    
    GSpacing sz = sizeof(float);
    GSpacing nPixelSpace = bands * sz;
    GSpacing nLineSpace = P * bands * sz;
    GSpacing nBandSpace = sz;
    
    ds->RasterIO(GF_Read, xOff, yOff, P, P, buffer.data(), P, P, GDT_Float32, bands, nullptr, nPixelSpace, nLineSpace, nBandSpace);
}

void generate_padding_strips(const std::string& prefix, const std::vector<int>& faceWidths, int bands) {
    std::string h_path = prefix + "_horizontal_strips.tif";
    std::string v_path = prefix + "_vertical_strips.tif";
    
    // Open all faces
    GDALDataset* faces[6];
    int maxW = 0;
    for(int f=0; f<6; ++f) {
        if (faceWidths[f] > maxW) maxW = faceWidths[f];
        std::string path = prefix + "_face" + std::to_string(f) + ".tif";
        faces[f] = (GDALDataset*)GDALOpen(path.c_str(), GA_ReadOnly);
        if(!faces[f]) {
            std::cerr << "[ERR] Missing face " << f << " for padding!" << std::endl;
            return;
        }
    }
    
    int maxP = maxW / 64; 
    if (maxP < 2) maxP = 2; // Min padding (Atlas Stride)

    GDALDriver* poDriver = GetGDALDriverManager()->GetDriverByName("GTiff");
    if (!faces[0]) return; // Safety
    GDALDataType type = faces[0]->GetRasterBand(1)->GetRasterDataType();
    const char* options[] = { "TILED=NO", "COMPRESS=LZW", "BIGTIFF=IF_NEEDED", "PROFILE=BASELINE", nullptr };

    int atlasW = maxW + 2 * maxP;
    GDALDataset* h_ds = poDriver->Create(h_path.c_str(), atlasW, 12 * maxP, bands, type, (char**)options);
    
    GDALDataset* v_ds = poDriver->Create(v_path.c_str(), 12 * maxP, maxW, bands, type, (char**)options);

    if (!h_ds || !v_ds) {
        std::cerr << "[ERR] Failed to create strip files." << std::endl;
        return;
    }

    std::cout << "[INFO] Generating Scaled Strips (MaxW=" << maxW << ", MaxP=" << maxP << ")..." << std::endl;
    
    auto fetch_scaled_strip = [&](int nFace, int nEdge, int targetW, int targetH) -> std::vector<float> {
        int nW = faceWidths[nFace]; 
        int nP = nW / 64; if (nP < 2) nP = 2;
        std::vector<float> raw;
        read_strip(faces[nFace], nEdge, nP, nW, nW, raw);
        int rawW = (nEdge == 0 || nEdge == 2) ? nW : nP;
        int rawH = (nEdge == 0 || nEdge == 2) ? nP : nW;
        if (rawW == targetW && rawH == targetH) return raw;
        std::vector<float> scaled;
        FastMitchell::Resize(rawW, rawH, raw, targetW, targetH, scaled, bands);
        return scaled;
    };

    auto fetch_scaled_corner = [&](int nFace, int corner, int targetDim) -> std::vector<float> {
         int nW = faceWidths[nFace];
         int nP = nW / 64; if (nP < 2) nP = 2;
         std::vector<float> raw;
         read_corner(faces[nFace], corner, nP, nW, nW, raw);
         if (nP == targetDim) return raw;
         std::vector<float> scaled;
         FastMitchell::Resize(nP, nP, raw, targetDim, targetDim, scaled, bands);
         return scaled;
    };

    for (int f = 0; f < 6; ++f) {
        int W = faceWidths[f];
        int P = W / 64; if (P < 2) P = 2;
        
        std::cout << "[PROGRESS] Generating Padding Strips: Face " << (f+1) << "/6 (W=" << W << ")" << std::endl; 
        
        if (debug_mode) std::cout << "[DEBUG] Processing Face " << (f+1) << " Strip N..." << std::endl;
        {
            int n_face = s2_transitions[f][E_N].next_face;
            int n_edge = s2_transitions[f][E_N].next_edge;
            bool flip = s2_transitions[f][E_N].flip_axis;
            int rot = s2_transitions[f][E_N].rotation;

            int preRotW = (rot == 0 || rot == 180) ? W : P;
            int preRotH = (rot == 0 || rot == 180) ? P : W;

            std::vector<float> main_strip = fetch_scaled_strip(n_face, n_edge, preRotW, preRotH);
            std::vector<float> rotated_main(W * P * bands);
            copy_rotated(main_strip, preRotW, preRotH, rotated_main, W, P, bands, rot, false, flip);

            int c_start = -1, c_end = -1;
            if (n_edge == 0) { c_start = 0; c_end = 1; }
            if (n_edge == 1) { c_start = 1; c_end = 2; }
            if (n_edge == 2) { c_start = 3; c_end = 2; }
            if (n_edge == 3) { c_start = 0; c_end = 3; }
            
            int corner_H_id_L = flip ? c_end : c_start;
            int corner_H_id_R = flip ? c_start : c_end;
            
            std::vector<float> h_corner_L = fetch_scaled_corner(n_face, corner_H_id_L, P);
            std::vector<float> h_corner_R = fetch_scaled_corner(n_face, corner_H_id_R, P);
            
            std::vector<float> h_corner_L_rot(P*P*bands), h_corner_R_rot(P*P*bands);
            copy_rotated(h_corner_L, P, P, h_corner_L_rot, P, P, bands, rot, false, flip);
            copy_rotated(h_corner_R, P, P, h_corner_R_rot, P, P, bands, rot, false, flip);
            
            int l_face = s2_transitions[f][E_W].next_face;
            int l_edge = s2_transitions[f][E_W].next_edge;
            bool l_flip = s2_transitions[f][E_W].flip_axis;
            int l_rot = s2_transitions[f][E_W].rotation;
            
            int lc_start = -1, lc_end = -1;
            if (l_edge == 0) { lc_start = 0; lc_end = 1; }
            if (l_edge == 1) { lc_start = 1; lc_end = 2; }
            if (l_edge == 2) { lc_start = 3; lc_end = 2; }
            if (l_edge == 3) { lc_start = 0; lc_end = 3; }
            int corner_V_id_L = l_flip ? lc_end : lc_start; 
            
            std::vector<float> v_corner_L = fetch_scaled_corner(l_face, corner_V_id_L, P);
            std::vector<float> v_corner_L_rot(P*P*bands);
            copy_rotated(v_corner_L, P, P, v_corner_L_rot, P, P, bands, l_rot, false, l_flip);

            int r_face = s2_transitions[f][E_E].next_face;
            int r_edge = s2_transitions[f][E_E].next_edge;
            bool r_flip = s2_transitions[f][E_E].flip_axis;
            int r_rot = s2_transitions[f][E_E].rotation;
            
            int rc_start = -1, rc_end = -1;
            if (r_edge == 0) { rc_start = 0; rc_end = 1; }
            if (r_edge == 1) { rc_start = 1; rc_end = 2; }
            if (r_edge == 2) { rc_start = 3; rc_end = 2; }
            if (r_edge == 3) { rc_start = 0; rc_end = 3; }
            int corner_V_id_R = r_flip ? rc_end : rc_start; 
            
            std::vector<float> v_corner_R = fetch_scaled_corner(r_face, corner_V_id_R, P);
            std::vector<float> v_corner_R_rot(P*P*bands);
            copy_rotated(v_corner_R, P, P, v_corner_R_rot, P, P, bands, r_rot, false, r_flip);

            std::vector<float> final_L(P*P*bands), final_R(P*P*bands);
            blend_corner(P, bands, h_corner_L_rot, v_corner_L_rot, final_L);
            blend_corner(P, bands, h_corner_R_rot, v_corner_R_rot, final_R);

            int buf_yOff = 2*f*maxP;
            GSpacing sz = sizeof(float);  GSpacing nBandS = sz; GSpacing nPixelS = bands * sz; GSpacing nLineS_P = P * bands * sz;
            h_ds->RasterIO(GF_Write, 0, buf_yOff, P, P, final_L.data(), P, P, GDT_Float32, bands, nullptr, nPixelS, nLineS_P, nBandS);
            GSpacing nLineS_Main = W * bands * sz;
            h_ds->RasterIO(GF_Write, P, buf_yOff, W, P, rotated_main.data(), W, P, GDT_Float32, bands, nullptr, nPixelS, nLineS_Main, nBandS);
            h_ds->RasterIO(GF_Write, P+W, buf_yOff, P, P, final_R.data(), P, P, GDT_Float32, bands, nullptr, nPixelS, nLineS_P, nBandS);
        }

        if (debug_mode) std::cout << "[DEBUG] Processing Face " << (f+1) << " Strip S..." << std::endl;
        {
            int n_face = s2_transitions[f][E_S].next_face;
            int n_edge = s2_transitions[f][E_S].next_edge;
            bool flip = s2_transitions[f][E_S].flip_axis;
            int rot = s2_transitions[f][E_S].rotation;
            
            int preRotW = (rot == 0 || rot == 180) ? W : P;
            int preRotH = (rot == 0 || rot == 180) ? P : W;
            std::vector<float> main_strip = fetch_scaled_strip(n_face, n_edge, preRotW, preRotH);
            std::vector<float> rotated_main(W * P * bands);
            copy_rotated(main_strip, preRotW, preRotH, rotated_main, W, P, bands, rot, false, flip);
            
            int c_start = -1, c_end = -1;
            if (n_edge == 0) { c_start = 0; c_end = 1; }
            if (n_edge == 1) { c_start = 1; c_end = 2; }
            if (n_edge == 2) { c_start = 3; c_end = 2; }
            if (n_edge == 3) { c_start = 0; c_end = 3; }
            int corner_H_id_L = flip ? c_end : c_start;
            int corner_H_id_R = flip ? c_start : c_end;
            
            std::vector<float> h_corner_L = fetch_scaled_corner(n_face, corner_H_id_L, P);
            std::vector<float> h_corner_R = fetch_scaled_corner(n_face, corner_H_id_R, P);
            std::vector<float> h_corner_L_rot(P*P*bands), h_corner_R_rot(P*P*bands);
            copy_rotated(h_corner_L, P, P, h_corner_L_rot, P, P, bands, rot, false, flip);
            copy_rotated(h_corner_R, P, P, h_corner_R_rot, P, P, bands, rot, false, flip);
            
            int l_face = s2_transitions[f][E_W].next_face;
            int l_edge = s2_transitions[f][E_W].next_edge;
            bool l_flip = s2_transitions[f][E_W].flip_axis;
            int l_rot = s2_transitions[f][E_W].rotation;
            int lc_start = -1, lc_end = -1;
            if (l_edge == 0) { lc_start = 0; lc_end = 1; }
            if (l_edge == 1) { lc_start = 1; lc_end = 2; }
            if (l_edge == 2) { lc_start = 3; lc_end = 2; }
            if (l_edge == 3) { lc_start = 0; lc_end = 3; }
            int corner_V_id_L = l_flip ? lc_start : lc_end; 
            
            std::vector<float> v_corner_L = fetch_scaled_corner(l_face, corner_V_id_L, P);
            std::vector<float> v_corner_L_rot(P*P*bands);
            copy_rotated(v_corner_L, P, P, v_corner_L_rot, P, P, bands, l_rot, false, l_flip);

            int r_face = s2_transitions[f][E_E].next_face;
            int r_edge = s2_transitions[f][E_E].next_edge;
            bool r_flip = s2_transitions[f][E_E].flip_axis;
            int r_rot = s2_transitions[f][E_E].rotation;
            int rc_start = -1, rc_end = -1;
            if (r_edge == 0) { rc_start = 0; rc_end = 1; }
            if (r_edge == 1) { rc_start = 1; rc_end = 2; }
            if (r_edge == 2) { rc_start = 3; rc_end = 2; }
            if (r_edge == 3) { rc_start = 0; rc_end = 3; }
            int corner_V_id_R = r_flip ? rc_start : rc_end;
            
            std::vector<float> v_corner_R = fetch_scaled_corner(r_face, corner_V_id_R, P);
            std::vector<float> v_corner_R_rot(P*P*bands);
            copy_rotated(v_corner_R, P, P, v_corner_R_rot, P, P, bands, r_rot, false, r_flip);

            std::vector<float> final_L(P*P*bands), final_R(P*P*bands);
            blend_corner(P, bands, h_corner_L_rot, v_corner_L_rot, final_L);
            blend_corner(P, bands, h_corner_R_rot, v_corner_R_rot, final_R);

            int buf_yOff = (2*f+1)*maxP;
            GSpacing sz = sizeof(float); GSpacing nBandS = sz; GSpacing nPixelS = bands * sz; GSpacing nLineS_P = P * bands * sz; GSpacing nLineS_Main = W * bands * sz;
            h_ds->RasterIO(GF_Write, 0, buf_yOff, P, P, final_L.data(), P, P, GDT_Float32, bands, nullptr, nPixelS, nLineS_P, nBandS);
            h_ds->RasterIO(GF_Write, P, buf_yOff, W, P, rotated_main.data(), W, P, GDT_Float32, bands, nullptr, nPixelS, nLineS_Main, nBandS);
            h_ds->RasterIO(GF_Write, P+W, buf_yOff, P, P, final_R.data(), P, P, GDT_Float32, bands, nullptr, nPixelS, nLineS_P, nBandS);
        }

        if (debug_mode) std::cout << "[DEBUG] Processing Face " << (f+1) << " Strip W..." << std::endl;
        {
             int n_face = s2_transitions[f][E_W].next_face;
             int n_edge = s2_transitions[f][E_W].next_edge;
             bool flip = s2_transitions[f][E_W].flip_axis;
             int rot = s2_transitions[f][E_W].rotation;
             
             int preRotW = (rot == 0 || rot == 180) ? P : W;
             int preRotH = (rot == 0 || rot == 180) ? W : P;
             std::vector<float> dst_strip = fetch_scaled_strip(n_face, n_edge, preRotW, preRotH);
             std::vector<float> final_strip(P * W * bands);
             copy_rotated(dst_strip, preRotW, preRotH, final_strip, P, W, bands, rot, false, flip);
             GSpacing sz = sizeof(float); GSpacing nBandS = sz; GSpacing nPixelS = bands * sz; GSpacing nLineS = P * bands * sz;
             int buf_xOff = 2*f*maxP;
             v_ds->RasterIO(GF_Write, buf_xOff, 0, P, W, final_strip.data(), P, W, GDT_Float32, bands, nullptr, nPixelS, nLineS, nBandS);
        }

        if (debug_mode) std::cout << "[DEBUG] Processing Face " << (f+1) << " Strip E..." << std::endl;
        {
             int n_face = s2_transitions[f][E_E].next_face;
             int n_edge = s2_transitions[f][E_E].next_edge;
             bool flip = s2_transitions[f][E_E].flip_axis;
             int rot = s2_transitions[f][E_E].rotation;
             int preRotW = (rot == 0 || rot == 180) ? P : W;
             int preRotH = (rot == 0 || rot == 180) ? W : P;
             std::vector<float> dst_strip = fetch_scaled_strip(n_face, n_edge, preRotW, preRotH);
             std::vector<float> final_strip(P * W * bands);
             copy_rotated(dst_strip, preRotW, preRotH, final_strip, P, W, bands, rot, false, flip);
             GSpacing sz = sizeof(float); GSpacing nBandS = sz; GSpacing nPixelS = bands * sz; GSpacing nLineS = P * bands * sz;
             int buf_xOff = (2*f+1)*maxP;
             v_ds->RasterIO(GF_Write, buf_xOff, 0, P, W, final_strip.data(), P, W, GDT_Float32, bands, nullptr, nPixelS, nLineS, nBandS);
        }
    }
    
    if (debug_mode) std::cout << "[DEBUG] Closing datasets..." << std::endl;
    if(h_ds) GDALClose(h_ds);
    if(v_ds) GDALClose(v_ds);
    for(int f=0; f<6; ++f) {
        if(faces[f]) GDALClose(faces[f]);
    }
    std::cout << "[SUCCESS] Helper strips created." << std::endl;
}
