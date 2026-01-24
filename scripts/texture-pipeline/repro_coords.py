
import numpy as np
import math

# --- UTILS IMPORTS SIMULATION ---
def s2_st_to_uv_vec(s):
    res = np.zeros_like(s)
    mask_ge = s >= 0.5
    mask_lt = ~mask_ge
    s_ge = s[mask_ge]
    res[mask_ge] = (1.0/3.0) * (4.0 * s_ge*s_ge - 1.0)
    s_lt = s[mask_lt]
    res[mask_lt] = (1.0/3.0) * (1.0 - 4.0 * (1.0 - s_lt)**2)
    return res

def s2_face_uv_to_xyz_vec(face, u, v):
    su = s2_st_to_uv_vec(u)
    sv = s2_st_to_uv_vec(v)
    zeros = np.zeros_like(u)
    ones = np.ones_like(u)
    if face == 0:   x, y, z = ( ones,   su,   sv) # +X
    elif face == 1: x, y, z = (-su,   ones,   sv) # +Y
    elif face == 2: x, y, z = (-su,  -sv,   ones) # +Z (North Pole)
    elif face == 3: x, y, z = (-ones, -sv,  -su) # -X
    elif face == 4: x, y, z = ( sv,  -ones,  -su) # -Y
    elif face == 5: x, y, z = ( sv,   su,  -ones) # -Z (South Pole)
    else: return zeros, zeros, zeros
    r = np.sqrt(x*x + y*y + z*z)
    return x/r, y/r, z/r

def s2_xyz_to_latlon_vec(x, y, z):
    r = np.sqrt(x*x + y*y + z*z)
    mask = r > 0
    lat = np.zeros_like(r)
    lon = np.zeros_like(r)
    lat[mask] = np.arcsin(np.clip(z[mask] / r[mask], -1.0, 1.0))
    lon[mask] = np.arctan2(y[mask], x[mask])
    return lat, lon # Radians

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

# --- SIMULATION ---
def simulate_face0(zoom=0):
    face = 0
    tile_size = 256
    # 2 root tiles for Face 0 in GLOBAL GEODETIC? 
    # NO. S2 Tiling is 1 tile per face at zoom 0 usually.
    # planet_tiler logic: "s2_range = range(tiles_per_edge)". 2^0 = 1.
    # So 1 tile per face.
    
    # Grid generation (from mesh.py likely)
    u_vals = np.linspace(0, 1, tile_size)
    v_vals = np.linspace(0, 1, tile_size)
    ug, vg = np.meshgrid(u_vals, v_vals) 
    # meshgrid: x varies in cols, y in rows.
    # u is x-like. v is y-like.
    
    # Calculate Lat/Lon
    # x, y, z unit
    ux, uy, uz = s2_face_uv_to_xyz_vec(face, ug, vg)
    
    # Lat/Lon
    lat, lon = s2_xyz_to_latlon_vec(ux, uy, uz)
    
    # SIMULATE BUG: Convert to radians TWICE
    # mesh.py: latlon_to_ecef_vec(np.radians(lat_grid_exp), ...)
    # But lat_grid_exp was already in radians from s2_xyz_to_latlon_vec
    lat_bug = np.radians(np.degrees(lat)) * (np.pi / 180.0) # Effectively rad / 57
    lon_bug = np.radians(np.degrees(lon)) * (np.pi / 180.0)
    
    # ECEF
    radii = (3396190.0, 3396190.0, 3376200.0) 
    x, y, z = latlon_to_ecef_vec(lat_bug, lon_bug, 0, radii, geodetic=True)
    
    # Calculate Center
    cx = np.mean(x)
    cy = np.mean(y)
    cz = np.mean(z)
    
    print(f"Face {face} Buggy Center: ({cx:.2f}, {cy:.2f}, {cz:.2f})")
    
    # Relativize (RTC)
    dx = x - cx
    dy = y - cy
    dz = z - cz
    
    # GLTF Permutation (dx, dz, -dy)
    v0 = dx[0,0]; v1 = dz[0,0]; v2 = -dy[0,0]
    print(f"Buggy NW Raw (GLTF axes): [{v0:.2f}, {v1:.2f}, {v2:.2f}]")
    
    # Compare to check_log.txt: [-256004.12, 256004.12, 258509.31]
    expected = np.array([-256004.12, 256004.12, 258509.31])
    actual = np.array([v0, v1, v2])
    print(f"Difference from Log: {np.linalg.norm(actual - expected):.2f}m")

if __name__ == "__main__":
    print("--- Simulating Mars Radii ---")
    simulate_face0()
