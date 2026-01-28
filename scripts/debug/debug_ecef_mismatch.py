
import numpy as np
import math

def s2_st_to_uv(s):
    if s >= 0.5: return (1.0/3.0) * (4.0 * s*s - 1.0)
    else: return (1.0/3.0) * (1.0 - 4.0 * (1.0-s)**2)

def s2_face_uv_to_xyz(face, u, v):
    su = s2_st_to_uv(u)
    sv = s2_st_to_uv(v)
    if face == 0:   x, y, z = ( 1.0,   su,   sv)
    elif face == 1: x, y, z = (-su,   1.0,   sv)
    elif face == 2: x, y, z = (-su,  -sv,   1.0)
    elif face == 3: x, y, z = (-1.0, -sv,  -su)
    elif face == 4: x, y, z = ( sv,  -1.0,  -su)
    elif face == 5: x, y, z = ( sv,   su,  -1.0)
    else: return 0,0,0
    r = math.sqrt(x*x + y*y + z*z)
    return x/r, y/r, z/r

def latlon_to_ecef_vec(lat, lon, height, radii, geodetic=True):
    rx, ry, rz = radii
    sin_lat = np.sin(lat)
    cos_lat = np.cos(lat)
    cos_lon = np.cos(lon)
    sin_lon = np.sin(lon)
    if not geodetic:
        x = (rx + height) * cos_lat * cos_lon
        y = (ry + height) * cos_lat * sin_lon
        z = (rz + height) * sin_lat
        return x, y, z
    a = rx
    b = rz
    e2 = (a**2 - b**2) / (a**2)
    N = a / np.sqrt(1 - e2 * (sin_lat**2))
    x = (N + height) * cos_lat * cos_lon
    y = (N + height) * cos_lat * sin_lon
    z = (N * (1 - e2) + height) * sin_lat
    return x, y, z

def s2_xyz_to_latlon(x, y, z):
    r = math.sqrt(x*x + y*y + z*z)
    lat = math.asin(z / r)
    lon = math.atan2(y, x)
    return lat, lon

def main():
    radii = (1738140.0, 1738140.0, 1735970.0)
    print(f"Radii: {radii}")
    
    # Analyze the 0/0/0 West border of Face 0
    # West border is u=0. v runs from 0 to 1.
    for v in [0.0, 0.5, 1.0]:
        ux, uy, uz = s2_face_uv_to_xyz(0, 0.0, v)
        lat, lon = s2_xyz_to_latlon(ux, uy, uz)
        
        ex, ey, ez = latlon_to_ecef_vec(lat, lon, 0, radii, geodetic=True)
        dist = math.sqrt(ex**2 + ey**2 + ez**2)
        
        print(f"Face 0 West (u=0, v={v}):")
        print(f"  Unit XYZ: [{ux:.6f}, {uy:.6f}, {uz:.6f}]")
        print(f"  Lat/Lon:  [{math.degrees(lat):.6f}, {math.degrees(lon):.6f}]")
        print(f"  ECEF:     [{ex:.1f}, {ey:.1f}, {ez:.1f}] Dist={dist:.1f}")

    # Analyze the $X=Y$ point from the log
    # The log said: My Vert: [1148436, 1148436, 616811]
    # This point has lat = asin(616811/2538183) = 14.0 degrees.
    # lon = 45 degrees.
    print("\nPROBING X=Y Log Point (14 deg Lat, 45 deg Lon):")
    ex, ey, ez = latlon_to_ecef_vec(math.radians(14.0), math.radians(45.0), 0, radii, geodetic=True)
    dist = math.sqrt(ex**2 + ey**2 + ez**2)
    print(f"  ECEF: [{ex:.1f}, {ey:.1f}, {ez:.1f}] Dist={dist:.1f} (Expected Dist ~1738km)")

if __name__ == "__main__":
    main()
