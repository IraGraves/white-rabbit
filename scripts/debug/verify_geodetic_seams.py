
import numpy as np
import math

def s2_st_to_uv(s):
    if s >= 0.5: return (1.0/3.0) * (4.0 * s*s - 1.0)
    else: return (1.0/3.0) * (1.0 - 4.0 * (1.0-s)**2)

def s2_face_uv_to_xyz(face, u, v):
    su = s2_st_to_uv(u)
    sv = s2_st_to_uv(v)
    if face == 0:   x, y, z = ( 1.0,   su,   sv) # +X
    elif face == 1: x, y, z = (-su,   1.0,   sv) # +Y
    elif face == 2: x, y, z = (-su,  -sv,   1.0) # +Z (North Pole)
    elif face == 3: x, y, z = (-1.0, -sv,  -su) # -X
    elif face == 4: x, y, z = ( sv,  -1.0,  -su) # -Y
    elif face == 5: x, y, z = ( sv,   su,  -1.0) # -Z (South Pole)
    else: return (0.0, 0.0, 0.0)
    r = math.sqrt(x*x + y*y + z*z)
    return (x/r, y/r, z/r)

def s2_xyz_to_latlon(x, y, z):
    r = math.sqrt(x*x + y*y + z*z)
    lat = math.asin(z / r)
    lon = math.atan2(y, x)
    return lat, lon

def latlon_to_ecef(lat, lon, height, radii, geodetic=True):
    rx, ry, rz = radii
    if not geodetic:
        cos_lat = math.cos(lat)
        x = (rx + height) * cos_lat * math.cos(lon)
        y = (ry + height) * cos_lat * math.sin(lon)
        z = (rz + height) * math.sin(lat)
        return x, y, z
    a = rx # Semi-major
    b = rz # Semi-minor
    e2 = (a**2 - b**2) / (a**2)
    sin_lat = math.sin(lat)
    N = a / math.sqrt(1 - e2 * (sin_lat**2))
    x = (N + height) * math.cos(lat) * math.cos(lon)
    y = (N + height) * math.cos(lat) * math.sin(lon)
    z = (N * (1 - e2) + height) * sin_lat
    return x, y, z

def check_seam(title, f0, u0, v0, f1, u1, v1, radii):
    print(f"\n--- {title} ---")
    xyz0 = s2_face_uv_to_xyz(f0, u0, v0)
    lat0, lon0 = s2_xyz_to_latlon(*xyz0)
    ecef_g0 = latlon_to_ecef(lat0, lon0, 0, radii, geodetic=True)
    ecef_p0 = latlon_to_ecef(lat0, lon0, 0, radii, geodetic=False)

    xyz1 = s2_face_uv_to_xyz(f1, u1, v1)
    lat1, lon1 = s2_xyz_to_latlon(*xyz1)
    ecef_g1 = latlon_to_ecef(lat1, lon1, 0, radii, geodetic=True)
    ecef_p1 = latlon_to_ecef(lat1, lon1, 0, radii, geodetic=False)

    print(f"Face {f0} ({u0:.1f}, {v0:.1f}) -> UnitXYZ: [{xyz0[0]:.4f}, {xyz0[1]:.4f}, {xyz0[2]:.4f}]")
    print(f"Face {f1} ({u1:.1f}, {v1:.1f}) -> UnitXYZ: [{xyz1[0]:.4f}, {xyz1[1]:.4f}, {xyz1[2]:.4f}]")
    
    diff_g = math.sqrt(sum((ecef_g0[i] - ecef_g1[i])**2 for i in range(3)))
    diff_p = math.sqrt(sum((ecef_p0[i] - ecef_p1[i])**2 for i in range(3)))
    
    print(f"Geodetic Seam Error:      {diff_g:.6f} m")
    print(f"Planetocentric Seam Error: {diff_p:.6f} m")

def main():
    radii = (1738140.0, 1738140.0, 1735970.0) # Moon
    
    # 1. Face 0 East (u=1) connects to Face 1 West (u=0)
    check_seam("FACE 0 EAST - FACE 1 WEST", 0, 1.0, 0.5, 1, 0.0, 0.5, radii)
    
    # 2. Face 0 North (v=1) connects to Face 2 West (u=0)
    check_seam("FACE 0 NORTH - FACE 2 WEST", 0, 0.5, 1.0, 2, 0.0, 0.5, radii)

    # 3. Face 1 North (v=1) connects to Face 2 South (v=0)? No.
    # Check transition table logic for Face 1 North
    # S2_TRANSITIONS[1][E_N] = (2, 2, False, False) -> Face 2 South (Edge 2)
    check_seam("FACE 1 NORTH - FACE 2 SOUTH", 1, 0.5, 1.0, 2, 0.5, 0.0, radii)

if __name__ == "__main__":
    main()
