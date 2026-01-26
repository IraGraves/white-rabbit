#include "S2Math.h"
#include <cmath>
#include <algorithm>

Point3D face_uv_to_xyz(int face, double u, double v) {
    // GEOMETRIC WRAPPING IMPLEMENTATION
    // 1. Calculate linear plane coordinates (su, sv) from quadratic UVs
    double su = s2_st_to_uv(u);
    double sv = s2_st_to_uv(v);
    
    // 2. Project onto the current face's cube plane
    double x, y, z;
    switch (face) {
        case 0: x =  1.0; y =   su; z =   sv; break; // +X
        case 1: x = -su;  y =  1.0; z =   sv; break; // +Y
        case 2: x = -su;  y = -sv;  z =  1.0; break; // +Z (North)
        case 3: x = -1.0; y = -sv;  z = -su;  break; // -X
        case 4: x =  sv;  y = -1.0; z = -su;  break; // -Y
        case 5: x =  sv;  y =   su; z = -1.0; break; // -Z (South)
        default: x = y = z = 0; break;
    }
    
    // 3. Find the dominant axis to identify the True Face
    //    (Handling cases where extrapolation moved us to a neighbor face)
    double ax = std::abs(x);
    double ay = std::abs(y);
    double az = std::abs(z);
    
    int true_face = face;
    if (ax >= ay && ax >= az) {
        true_face = (x > 0) ? 0 : 3;
    } else if (ay >= ax && ay >= az) {
        true_face = (y > 0) ? 1 : 4;
    } else {
        true_face = (z > 0) ? 2 : 5;
    }
    
    // 4. If we drifted, re-project onto the True Face's plane
    //    This ensures exact alignment with the neighbor's coordinate system
    if (true_face != face) {
        double max_val = (true_face == 0 || true_face == 3) ? ax :
                         (true_face == 1 || true_face == 4) ? ay : az;
        
        // Project back to the cube surface (divide by max component)
        x /= max_val;
        y /= max_val;
        z /= max_val;
    }
    
    // 5. Normalize to sphere (Unit Vector)
    double r = std::sqrt(x * x + y * y + z * z);
    return { x / r, y / r, z / r };
}

void xyz_to_latlon(const Point3D& p, double a, double b, double& lat, double& lon, bool geodetic) {
    lon = std::atan2(p.y, p.x) * 180.0 / M_PI;
    
    if (!geodetic || std::abs(a - b) < 0.1) { // Planetocentric or Spherical case
        lat = std::asin(std::max(-1.0, std::min(1.0, p.z))) * 180.0 / M_PI;
    } else {
        // Rigorous Geodetic Latitude for ellipsoids
        double e2 = (a * a - b * b) / (a * a);
        double rho = std::sqrt(p.x * p.x + p.y * p.y);
        // tan(phi) = z / ((1-e2) * rho)
        lat = std::atan2(p.z, (1.0 - e2) * rho) * 180.0 / M_PI;
    }
    
    // Clamp to valid range to prevent precision issues at poles
    if (lat > 90.0) lat = 90.0;
    if (lat < -90.0) lat = -90.0;
}
