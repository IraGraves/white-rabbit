"""
S2 and Geodetic Math Utilities.
Contains pure math functions for coordinate conversions and projections.
"""

import math
import numpy as np

def latlon_to_ecef(lat, lon, height, radii, geodetic=True):
    """
    Converts Lat/Lon/Height to ECEF coordinates.
    geodetic: If True, uses rigorous WGS84-style ellipsoidal formula.
              If False, uses simplified "Planetocentric" scaling (spherical behavior).
    radii: (rx, ry, rz) Tuple (Equatorial, Equatorial, Polar)
    """
    rx, ry, rz = radii
    
    if not geodetic:
        # Simplified "Planetocentric" Mapping (Scaling)
        cos_lat = np.cos(lat)
        x = (rx + height) * cos_lat * np.cos(lon)
        y = (ry + height) * cos_lat * np.sin(lon)
        z = (rz + height) * np.sin(lat)
        return x, y, z

    # Rigorous Geodetic Formula
    a = rx # Semi-major (Equatorial)
    b = rz # Semi-minor (Polar)
    e2 = (a**2 - b**2) / (a**2)
    
    sin_lat = np.sin(lat)
    cos_lat = np.cos(lat)
    cos_lon = np.cos(lon)
    sin_lon = np.sin(lon)
    
    N = a / np.sqrt(1 - e2 * (sin_lat**2))
    
    x = (N + height) * cos_lat * cos_lon
    y = (N + height) * cos_lat * sin_lon
    z = (N * (1 - e2) + height) * sin_lat
    
    return x, y, z


def latlon_to_ecef_vec(lat, lon, height, radii, geodetic=True):
    """Vectorized LatLon (radians) to ECEF."""
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


def get_tile_bounds(tx, ty, zoom):
    """Returns tile bounds in degrees (Global Geodetic with 2 Root Tiles)."""
    num_tiles_x = 2 * (2 ** zoom)
    num_tiles_y = 1 * (2 ** zoom)
    deg_per_tile_x = 360.0 / num_tiles_x
    deg_per_tile_y = 180.0 / num_tiles_y
    min_lon = -180.0 + (tx * deg_per_tile_x)
    max_lon = min_lon + deg_per_tile_x
    min_lat = -90.0 + (ty * deg_per_tile_y)
    max_lat = min_lat + deg_per_tile_y
    return min_lon, min_lat, max_lon, max_lat


def s2_face_uv_to_xyz(face, u, v):
    """
    Converts S2 face coordinates (u, v in range [0, 1]) to Unit Sphere (x, y, z).
    Using the official S2 quadratic projection.
    """
    # Official S2 Quadratic Projection (ST to UV)
    def s2_st_to_uv(s):
        if s >= 0.5: return (1.0/3.0) * (4.0 * s*s - 1.0)
        else: return (1.0/3.0) * (1.0 - 4.0 * (1.0-s)**2)

    su = s2_st_to_uv(u)
    sv = s2_st_to_uv(v)
    
    # Official S2 Coordinate System (Used by Cesium/Google)
    if face == 0:   x, y, z = ( 1.0,   su,   sv) # +X
    elif face == 1: x, y, z = (-su,   1.0,   sv) # +Y
    elif face == 2: x, y, z = (-su,  -sv,   1.0) # +Z (North Pole)
    elif face == 3: x, y, z = (-1.0, -sv,  -su) # -X
    elif face == 4: x, y, z = ( sv,  -1.0,  -su) # -Y
    elif face == 5: x, y, z = ( sv,   su,  -1.0) # -Z (South Pole)
    else: return (0.0, 0.0, 0.0)

    # Normalize to Unit Sphere
    r = math.sqrt(x*x + y*y + z*z)
    return (x/r, y/r, z/r)


def s2_face_uv_to_xyz_vec(face, u, v):
    """
    Vectorized version of s2_face_uv_to_xyz using NumPy.
    u, v: NumPy arrays of shape (N, M)
    """
    # Official S2 Quadratic Projection (ST to UV)
    # s >= 0.5: (1/3) * (4*s*s - 1)
    # s < 0.5:  (1/3) * (1 - 4*(1-s)^2)
    def s2_st_to_uv_vec(s):
        # Result array
        res = np.zeros_like(s)
        mask_ge = s >= 0.5
        mask_lt = ~mask_ge
        
        # Calculate for s >= 0.5
        s_ge = s[mask_ge]
        res[mask_ge] = (1.0/3.0) * (4.0 * s_ge*s_ge - 1.0)
        
        # Calculate for s < 0.5
        s_lt = s[mask_lt]
        res[mask_lt] = (1.0/3.0) * (1.0 - 4.0 * (1.0 - s_lt)**2)
        return res

    su = s2_st_to_uv_vec(u)
    sv = s2_st_to_uv_vec(v)
    
    # Initialize output generic shapes
    # We rely on face being a scalar integer for this function
    zeros = np.zeros_like(u)
    ones = np.ones_like(u)
    
    if face == 0:   x, y, z = ( ones,   su,   sv) # +X
    elif face == 1: x, y, z = (-su,   ones,   sv) # +Y
    elif face == 2: x, y, z = (-su,  -sv,   ones) # +Z (North Pole)
    elif face == 3: x, y, z = (-ones, -sv,  -su) # -X
    elif face == 4: x, y, z = ( sv,  -ones,  -su) # -Y
    elif face == 5: x, y, z = ( sv,   su,  -ones) # -Z (South Pole)
    else: return zeros, zeros, zeros

    # Normalize
    r = np.sqrt(x*x + y*y + z*z)
    # Avoid zero division
    r[r == 0] = 1.0
    return x/r, y/r, z/r


def s2_xyz_to_latlon_vec(x, y, z):
    """Vectorized XYZ to LatLon."""
    r = np.sqrt(x*x + y*y + z*z)
    # mask zeros
    mask = r > 0
    lat = np.zeros_like(r)
    lon = np.zeros_like(r)
    
    # Safe calc
    lat[mask] = np.arcsin(np.clip(z[mask] / r[mask], -1.0, 1.0))
    lon[mask] = np.arctan2(y[mask], x[mask])
    
    return np.degrees(lat), np.degrees(lon)


def s2_xyz_to_latlon(x, y, z):
    """Converts unit vector to Lat/Lon (degrees)."""
    r = math.sqrt(x*x + y*y + z*z)
    if r == 0: return 0.0, 0.0
    lat = math.asin(z / r)
    lon = math.atan2(y, x)
    return math.degrees(lat), math.degrees(lon)


def get_s2_tile_bounds(face, tx, ty, zoom):
    """Approximate Lat/Lon bounds for an S2 tile."""
    tile_size_uv = 1.0 / (2 ** zoom)
    u0, v0 = tx * tile_size_uv, ty * tile_size_uv
    u1, v1 = u0 + tile_size_uv, v0 + tile_size_uv
    
    if face == 2: return -180.0, 35.0, 180.0, 90.0
    if face == 5: return -180.0, -90.0, 180.0, -35.0

    corners = [
        s2_face_uv_to_xyz(face, u0, v0),
        s2_face_uv_to_xyz(face, u1, v0),
        s2_face_uv_to_xyz(face, u1, v1),
        s2_face_uv_to_xyz(face, u0, v1),
        s2_face_uv_to_xyz(face, (u0+u1)/2, (v0+v1)/2)
    ]
    ref_lon = None
    min_lat, max_lat = 90.0, -90.0
    min_lon, max_lon = 0.0, 0.0

    for (x, y, z) in corners:
        lat, lon = s2_xyz_to_latlon(x, y, z)
        min_lat, max_lat = min(min_lat, lat), max(max_lat, lat)
        if ref_lon is None:
            ref_lon = lon
            min_lon = max_lon = lon
        else:
            while lon - ref_lon > 180: lon -= 360
            while lon - ref_lon < -180: lon += 360
            min_lon, max_lon = min(min_lon, lon), max(max_lon, lon)
            
    return min_lon, min_lat, max_lon, max_lat


def sample_bilinear_vec(data, lat, lon, min_lon, max_lat, scale_x, scale_y):
    """
    Vectorized Bilinear Interpolation.
    lat, lon: NumPy arrays
    """
    h, w = data.shape[:2]
    
    d_lon = (lon - min_lon) % 360
    px = (d_lon / scale_x) - 0.5
    py = ((max_lat - lat) / scale_y) - 0.5
    
    # Clip/Wrap Logic
    # We can probably assume reasonable bounds or use np.clip
    py = np.clip(py, 0, h - 1.0001)
    
    # Wrap X if needed (assuming global coverage)
    # If partial coverage, we might want clamping, but % w handles wrapping.
    # To be safe for partial rasters:
    if w < 350 / scale_x:
         px = np.clip(px, 0, w - 0.0001)
    else:
         px = px % w
         
    x0 = np.floor(px).astype(np.int32)
    y0 = np.floor(py).astype(np.int32)
    x1 = (x0 + 1) % w
    y1 = np.minimum(y0 + 1, h - 1)
    
    dx = px - x0
    dy = py - y0
    
    # Expand dims for broadcasting if data has channels (Color)
    # data can be (H, W) or (H, W, 3)
    # dx, dy are (H_grid, W_grid)
    if len(data.shape) == 3:
        dx = dx[..., np.newaxis]
        dy = dy[..., np.newaxis]
        
    v00 = data[y0, x0]
    v10 = data[y0, x1]
    v01 = data[y1, x0]
    v11 = data[y1, x1]
    
    top = v00 * (1.0 - dx) + v10 * dx
    bottom = v01 * (1.0 - dx) + v11 * dx
    val = top * (1.0 - dy) + bottom * dy
    
    return val
