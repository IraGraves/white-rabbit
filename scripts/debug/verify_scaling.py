
import numpy as np
import math

# --- UTILS SIMULATION (Mirroring utils.py) ---
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
    return np.degrees(lat), np.degrees(lon) # Returns DEGREES

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

# --- VERIFICATION ---
def verify():
    face = 0
    tx, ty = 0, 0
    zoom = 0
    tile_size = 256
    radii = (3396190.0, 3396190.0, 3376200.0) 
    
    tile_uv_size = 1.0 / (2**zoom)
    u0 = tx * tile_uv_size
    v0 = ty * tile_uv_size
    
    eps = tile_uv_size / tile_size
    v_count_exp = tile_size + 3
    
    r_idx_exp = np.linspace(tile_uv_size + eps, -eps, v_count_exp)
    c_idx_exp = np.linspace(-eps, tile_uv_size + eps, v_count_exp)
    ug_exp, vg_exp = np.meshgrid(u0 + c_idx_exp, v0 + r_idx_exp)
    
    ux, uy, uz = s2_face_uv_to_xyz_vec(face, ug_exp, vg_exp)
    lat_deg, lon_deg = s2_xyz_to_latlon_vec(ux, uy, uz)
    
    # CASE 1: FIXED (np.radians)
    xx, yy, zz = latlon_to_ecef_vec(np.radians(lat_deg), np.radians(lon_deg), 0, radii, geodetic=True)
    cx, cy, cz = float(np.mean(xx)), float(np.mean(yy)), float(np.mean(zz))
    mag = np.sqrt(cx**2 + cy**2 + cz**2)
    print(f"CASE FIXED: Center Mag = {mag:.1f}")
    
    # CASE 2: BUGGY (np.radians twice)
    lat_rad_bug = np.radians(lat_deg) * (np.pi / 180.0)
    lon_rad_bug = np.radians(lon_deg) * (np.pi / 180.0)
    xx_b, yy_b, zz_b = latlon_to_ecef_vec(lat_rad_bug, lon_rad_bug, 0, radii, geodetic=True)
    cx_b, cy_b, cz_b = float(np.mean(xx_b)), float(np.mean(yy_b)), float(np.mean(zz_b))
    mag_b = np.sqrt(cx_b**2 + cy_b**2 + cz_b**2)
    print(f"CASE BUGGY: Center Mag = {mag_b:.1f}")
    
    # Match to real check_log.txt?
    # Log: T = [452502.3, 178208.39, -95473.6]
    # Magnitude of T = 503,000.
    print(f"Logged magnitude in check_log: 503000.0")

if __name__ == "__main__":
    verify()
