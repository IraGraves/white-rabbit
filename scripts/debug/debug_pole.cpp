
#include <iostream>
#include <cmath>
#include <vector>
#include <algorithm>
#include <iomanip>

#ifndef M_PI
#define M_PI 3.14159265358979323846
#endif

// Copy of S2 Logic
inline double s2_st_to_uv(double s) {
    if (s >= 0.5) return (1.0 / 3.0) * (4.0 * s * s - 1.0);
    return (1.0 / 3.0) * (1.0 - 4.0 * (1.0 - s) * (1.0 - s));
}

struct Point3D { double x, y, z; };

Point3D face_uv_to_xyz(int face, double u, double v) {
    double su = s2_st_to_uv(u);
    double sv = s2_st_to_uv(v);
    double x, y, z;
    switch (face) {
        case 0: x =  1.0; y =   su; z =   sv; break; 
        case 1: x = -su;  y =  1.0; z =   sv; break; 
        case 2: x = -su;  y = -sv;  z =  1.0; break; 
        case 3: x = -1.0; y = -sv;  z = -su;  break; 
        case 4: x =  sv;  y = -1.0; z = -su;  break; 
        case 5: x =  sv;  y =   su; z = -1.0; break; 
        default: x = y = z = 0; break;
    }
    double r = std::sqrt(x * x + y * y + z * z);
    return { x / r, y / r, z / r };
}

void xyz_to_latlon(const Point3D& p, double& lat, double& lon) {
    lon = std::atan2(p.y, p.x) * 180.0 / M_PI;
    lat = std::asin(std::max(-1.0, std::min(1.0, p.z))) * 180.0 / M_PI;
}

int main() {
    int W = 1024;
    double offset = 0.5; // Pixel centered
    int center = W / 2;
    
    std::cout << "Debugging Face 2 Center (W=" << W << ")..." << std::endl;
    std::cout << "row | col | u | v | x | y | z | lat | lon" << std::endl;
    
    // Check 3x3 around center
    for (int r = center - 1; r <= center + 1; ++r) {
        for (int c = center - 1; c <= center + 1; ++c) {
            double u = (double)(c + offset) / (double)W;
            double v = 1.0 - (double)(r + offset) / (double)W;
            
            Point3D p = face_uv_to_xyz(2, u, v);
            double lat, lon;
            xyz_to_latlon(p, lat, lon);
            
            std::cout << r << " | " << c << " | " 
                      << std::fixed << std::setprecision(6) << u << " | " << v << " | "
                      << p.x << " | " << p.y << " | " << p.z << " | "
                      << lat << " | " << lon << std::endl;
        }
    }
    
    return 0;
}
