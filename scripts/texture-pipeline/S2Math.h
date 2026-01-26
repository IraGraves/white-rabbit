#ifndef S2_MATH_H
#define S2_MATH_H

#include <cmath>
#include <algorithm>
#include <vector>

#ifndef M_PI
#define M_PI 3.14159265358979323846
#endif

struct Point3D {
    double x, y, z;
};

// S2 Quadratic Projection (ST -> UV)
inline double s2_st_to_uv(double s) {
    if (s >= 0.5) return (1.0 / 3.0) * (4.0 * s * s - 1.0);
    return (1.0 / 3.0) * (1.0 - 4.0 * (1.0 - s) * (1.0 - s));
}

// Inverse S2 Quadratic (UV -> ST)
inline double s2_uv_to_st(double u) {
    if (u >= 0) return 0.5 * std::sqrt(3.0 * u + 1.0);
    return 1.0 - 0.5 * std::sqrt(1.0 - 3.0 * u);
}

// Face UV -> Unit Sphere XYZ
Point3D face_uv_to_xyz(int face, double u, double v);

// Unit Sphere XYZ -> Lat/Lon (Degrees)
void xyz_to_latlon(const Point3D& p, double a, double b, double& lat, double& lon, bool geodetic);

#endif // S2_MATH_H
