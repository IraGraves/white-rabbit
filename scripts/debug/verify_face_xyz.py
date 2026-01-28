
import numpy as np
import math
from osgeo import gdal

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
    a = rx
    b = rz
    e2 = (a**2 - b**2) / (a**2)
    sin_lat = math.sin(lat)
    N = a / math.sqrt(1 - e2 * (sin_lat**2))
    x = (N + height) * math.cos(lat) * math.cos(lon)
    y = (N + height) * math.cos(lat) * math.sin(lon)
    z = (N * (1 - e2) + height) * sin_lat
    return x, y, z

def main():
    # Use relative path from script location
    SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
    prefix = os.path.join(SCRIPT_DIR, "..", "texture-pipeline", "input", "moon", "moon_terrain")
    print(f"PROBING FACES: {prefix}")
    
    # Radii for Moon
    radii = (1738140.0, 1738140.0, 1735970.0)
    rx, ry, rz = radii
    
    for f in range(6):
        path = f"{prefix}_face{f}.tif"
        if not os.path.exists(path):
            print(f"Face {f}: MISSING ({path})")
            continue
            
        ds = gdal.Open(path)
        w, h = ds.RasterXSize, ds.RasterYSize
        
        # Probe center pixel
        cx, cy = w // 2, h // 2
        band = ds.GetRasterBand(1)
        val = band.ReadAsArray(cx, cy, 1, 1)[0,0]
        
        # Calculate UV (Vertex Mode mapping u = x/w)
        u = cx / w
        v = 1.0 - (cy / h) # V grows up in S2, Y grows down in GDAL
        
        # Unit XYZ
        sx, sy, sz = s2_face_uv_to_xyz(f, u, v)
        
        # ECEF (Planetocentric for distance check)
        ex = (rx + val) * sx
        ey = (ry + val) * sy
        ez = (rz + val) * sz
        dist = math.sqrt(ex**2 + ey**2 + ez**2)
        
        print(f"Face {f}: CenterVal={val:.1f} Dist={dist:.1f}")
        
        # Check coordinates at West Edge (u=0, v=0.5)
        ux, uy, uz = s2_face_uv_to_xyz(f, 0.0, 0.5)
        # Unit sphere distance check
        print(f"  West (u=0, v=0.5) Unit: [{ux:.3f}, {uy:.3f}, {uz:.3f}]")


if __name__ == "__main__":
    import os
    main()
