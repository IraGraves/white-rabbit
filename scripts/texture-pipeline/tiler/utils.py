"""
Utility functions for Planet Tiler.
Core helpers for coordinate conversion, raster reading, and logging.
"""

import os
import re
import json
import math
import time
import numpy as np
from osgeo import gdal, osr


def is_s2_face_path(path):
    """Detects if a path follows the S2 face naming convention or is a VRT descriptor."""
    if not path:
        return False
    # Support .vrt files as entry points
    if path.lower().endswith('.vrt'):
        return True
    # Matches patterns like _face0, .face1, face2, _face_0 etc. (case insensitive)
    return bool(re.search(r"[._]?face_?\d", os.path.basename(path), re.IGNORECASE))

# --- Suppress GDAL Warnings & Enable Errors ---
gdal.UseExceptions()
gdal.PushErrorHandler('CPLQuietErrorHandler')


def load_bodies():
    """Loads the celestial bodies database from bodies.json."""
    json_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "bodies.json")
    if not os.path.exists(json_path):
        return {}
    try:
        with open(json_path, "r") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading bodies.json: {e}")
        return {}


def log(msg, type="INFO", end="\n"):
    """Logs a message with timestamp."""
    ts = time.strftime('%H:%M:%S')
    full_msg = f"[{ts}] [{type}] {msg}"
    print(full_msg, end=end, flush=True)
    return full_msg


def inspect_file(path, label, srs_hint=None):
    """Analyzes a GeoTIFF file and prints important info (incl. Scale/Offset). Returns dict of properties."""
    ds = gdal.Open(path)
    if not ds:
        log(f"Could not open {label}: {path}", "ERR")
        return None
        
    width = ds.RasterXSize
    height = ds.RasterYSize
    bands = ds.RasterCount
    band = ds.GetRasterBand(1)
    
    # Read Metadata
    nodata = band.GetNoDataValue()
    scale = band.GetScale()
    offset = band.GetOffset()
    
    # SRS / Projection
    srs_wkt = ds.GetProjection()
    srs_desc = "Unknown"
    if srs_wkt:
        srs = osr.SpatialReference()
        srs.ImportFromWkt(srs_wkt)
        
        # Get Authority/Code (e.g. EPSG:4326)
        auth_name = srs.GetAuthorityName(None)
        auth_code = srs.GetAuthorityCode(None)
        
        proj_name = srs.GetAttrValue('PROJCS') or srs.GetAttrValue('GEOGCS') or "Unknown"
        srs_desc = proj_name
        if auth_name and auth_code:
            srs_desc += f" ({auth_name}:{auth_code})"
    
    if srs_desc == "Unknown" and srs_hint:
        srs_desc += f" (assuming {srs_hint})"

    # Geotransform & Bounds
    gt = ds.GetGeoTransform()
    min_x = gt[0]
    max_y = gt[3]
    max_x = min_x + (gt[1] * width)
    min_y = max_y + (gt[5] * height)
    
    # Detect Padding - Gone.
    padding = 0
    
    print(f"--- Analysis: {label} ---")
    print(f"  File:        {os.path.basename(path)}")
    print(f"  Dimensions:  {width} x {height} Pixels")
    print(f"  Projection:  {srs_desc}")
    print(f"  Bounds:      X[{min_x:.2f}..{max_x:.2f}], Y[{min_y:.2f}..{max_y:.2f}]")
    
    # Output Metadata
    print(f"  NoData Value: {nodata}")
    print(f"  Internal Scale: {scale}")
    print(f"  Internal Offset: {offset}")
    
    # Check Tiling/Compression (IMAGE_STRUCTURE)
    img_struct = ds.GetMetadata('IMAGE_STRUCTURE') or {}
    compression = img_struct.get('COMPRESSION', 'Unknown')
    
    # Robust Block Size Check
    block_size = band.GetBlockSize() # Returns (x, y)
    # If block width is significantly smaller than image width, it is tiled.
    # Standard strip-organized files usually have block_width == image_width
    is_tiled_meta = img_struct.get('TILED', 'NO')
    
    is_tiled = "NO"
    if is_tiled_meta == "YES" or (block_size[0] < width and block_size[0] > 0):
        is_tiled = "YES"

    layout = img_struct.get('LAYOUT', 'Unknown')
    
    print(f"  Compression: {compression}")
    print(f"  Is Tiled:    {is_tiled} (BlockSize: {block_size[0]}x{block_size[1]})")
    if layout != 'Unknown':
        print(f"  Layout:      {layout}")
        
    # Check Overviews
    ov_count = band.GetOverviewCount()
    if ov_count > 0:
        print(f"  Overviews:   {ov_count}")
        
    if is_tiled == 'YES' and (layout == 'COG' or ov_count > 0):
        print(f"  [INFO] Cloud Optimized GeoTIFF (COG) or efficient Tiled format detected. Good!")
    elif is_tiled == 'YES':
        print(f"  [INFO] Tiled format detected. Good.")
    else:
        print(f"  [WARN] Not tiled. 'IO' performance might be slow. Recommend converting to COG.")

    # Check for Radius from Projection
    wkt = ds.GetProjection()
    semi_major = 0
    if wkt:
        srs = osr.SpatialReference()
        srs.ImportFromWkt(wkt)
        semi_major = srs.GetSemiMajor()
        semi_minor = srs.GetSemiMinor()
        
        # Only print if valid (non-zero)
        if semi_major > 0:
            print(f"  Projection Radius (A): {semi_major:.1f}m")
        if semi_minor > 0 and abs(semi_minor - semi_major) > 0.001:
             print(f"  Projection Radius (B): {semi_minor:.1f}m")
             
    print("--------------------------")
    
    ds = None
    return {
        'width': width,
        'height': height,
        'srs': srs_desc,
        'compression': compression,
        'is_tiled': is_tiled == 'YES',
        'padding': padding
    }


def get_radius_from_file(dem_path):
    """Extracts the semi-major axis (radius) from a GeoTIFF's projection."""
    try:
        ds = gdal.Open(dem_path)
        if not ds: return None
        wkt = ds.GetProjection()
        srs = osr.SpatialReference()
        srs.ImportFromWkt(wkt)
        radius = srs.GetSemiMajor()
        ds = None 
        if radius and radius > 1000: return radius
    except Exception:
        return None
    return None


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


def read_raster_window(ds, min_lon, min_lat, max_lon, max_lat, out_w=0, out_h=0, alg=gdal.GRA_Cubic):
    """
    Reads a window from a raster dataset and returns (data, meta).
    Supports optional GDAL resampling if out_w/out_h > 0.
    """
    gt = ds.GetGeoTransform()
    width, height = ds.RasterXSize, ds.RasterYSize
    
    def lon_to_px(lon): return (lon - gt[0]) / gt[1]
    def lat_to_py(lat): return (lat - gt[3]) / gt[5]
    
    px_start = int(math.floor(lon_to_px(min_lon)))
    px_end = int(math.ceil(lon_to_px(max_lon)))
    py_start = int(math.floor(lat_to_py(max_lat))) 
    py_end = int(math.ceil(lat_to_py(min_lat)))   

    fetch_min_lon = gt[0] + px_start * gt[1]
    fetch_max_lat = gt[3] + py_start * gt[5]
    
    y0, y1 = max(0, py_start), min(height, py_end)
    if y1 <= y0:
        return np.zeros((out_h, out_w, 3) if ds.RasterCount >= 3 else (out_h, out_w)), {}

    def fetch_op(x_off, x_size, target_w, target_h):
        if x_size <= 0: return None
        x_off_wrapped = x_off % width
        
        args = {}
        if target_w > 0 and target_h > 0:
            args = {'buf_xsize': target_w, 'buf_ysize': target_h, 'resample_alg': alg}

        if x_off_wrapped + x_size <= width:
            data = ds.ReadAsArray(x_off_wrapped, y0, x_size, y1 - y0, **args)
            if data is None: return None
            if len(data.shape) == 3: data = np.transpose(data, (1, 2, 0))
            return data
        else:
            w1 = width - x_off_wrapped
            w2 = x_size - w1
            if target_w > 0:
                tw1 = int(round(target_w * (w1 / x_size)))
                tw2 = target_w - tw1
                p1 = fetch_op(x_off_wrapped, w1, tw1, target_h)
                p2 = fetch_op(0, w2, tw2, target_h)
            else:
                p1 = fetch_op(x_off_wrapped, w1, 0, 0)
                p2 = fetch_op(0, w2, 0, 0)
            if p1 is None or p2 is None: return None
            return np.concatenate([p1, p2], axis=1)

    data = fetch_op(px_start, px_end - px_start, out_w, out_h)
    if data is None:
        return np.zeros((out_h, out_w, 3) if ds.RasterCount >= 3 else (out_h, out_w)), {}

    # Handle NoData
    band = ds.GetRasterBand(1)
    nodata = band.GetNoDataValue()
    if nodata is not None:
        # Create a mask for NoData values
        # Be careful with float comparisons
        if np.issubdtype(data.dtype, np.floating):
            data[np.isclose(data, nodata)] = np.nan
        else:
            data[data == nodata] = 0 # Replace integer NoData with 0 directly? Or standard NAN behavior if converted to float later.
            # S2 tiler converts to float. Let's assume 0 for now as 'sea level' base.
            # actually better to use NAN if we want to fill it, but for height 0 is safe.
            # For Color it might be black.
            pass
            
        # Also explicitly handle NaN if it was already there
        if np.issubdtype(data.dtype, np.floating):
             pass # NaNs are handled by caller (nan_to_num)

    res_h, res_w = data.shape[:2]
    meta = {
        'min_lon': fetch_min_lon,
        'max_lat': fetch_max_lat,
        'scale_x': (gt[1] * (px_end - px_start)) / res_w if res_w > 0 else gt[1],
        'scale_y': (abs(gt[5]) * (py_end - py_start)) / res_h if res_h > 0 else abs(gt[5]),
        'nodata': nodata
    }
    return data, meta


    meta = {
        'width': width,
        'height': height
    }
    return out_buf, meta


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

# ================= S2 TRANSITION LOGIC =================

# Edge Indices
E_N = 0
E_E = 1
E_S = 2
E_W = 3

# Transition Table (FACE -> EDGE -> (NEXT_FACE, NEXT_EDGE, SWAP_XY, FLIP_AXIS))
S2_TRANSITIONS = {
    0: {
        E_N: (2, 3, True, True),        
        E_E: (1, 3, False, False),       
        E_S: (5, 0, False, False),     
        E_W: (4, 0, True, True),        
    },
    1: {
        E_N: (2, 2, False, False),     
        E_E: (3, 2, True, True),        
        E_S: (5, 1, True, True),        
        E_W: (0, 1, False, False),       
    },
    2: {
        E_N: (4, 3, True, True),        
        E_E: (3, 3, False, False),       
        E_S: (1, 0, False, False),     
        E_W: (0, 0, True, True),        
    },
    3: {
        E_N: (4, 2, False, False),     
        E_E: (5, 2, True, True),        
        E_S: (1, 1, True, True),        
        E_W: (2, 1, False, False),       
    },
    4: {
        E_N: (0, 3, True, True),        
        E_E: (5, 3, False, False),       
        E_S: (3, 0, False, False),     
        E_W: (2, 0, True, True),        
    },
    5: {
        E_N: (0, 2, False, False),     
        E_E: (1, 2, True, True),        
        E_S: (3, 1, True, True),        
        E_W: (4, 1, False, False),       
    },
}

def s2_uv_transition(face, u, v):
    """
    Transitions UV coordinates across Face Boundaries.
    Returns (new_face, new_u, new_v).
    Handles single-step transitions. For corners (2 steps), caller must recurse.
    """
    # Check bounds
    if 0.0 <= u <= 1.0 and 0.0 <= v <= 1.0:
        return face, u, v
        
    # Detect Edge
    # S2 Grid Normalization:
    # u, v in [0, 1]. 
    # Because our TIFFs are samples [0..N-1] mapping to u = i/N.
    # The sample for u=1.0 is MISSING from the current face and must be read from the neighbor.
    # Likewise for v=0.0 (Bottom).
    
    side = None
    if v > 1.0: side = E_N
    elif v < 0.0: side = E_S
    elif u > 1.0: side = E_E
    elif u < 0.0: side = E_W
    
    if side is None: return face, u, v 
    
    # Logic
    next_face, target_edge, swap_xy, flip_axis = S2_TRANSITIONS[face][side]
    
    # 1. Identify 'p' (along-edge coord) and 'depth' (overshoot)
    if side in [E_N, E_S]: # N/S Crossing. Along-edge is U. Overshoot is V.
        p = u
        dist = (v - 1.0) if side == E_N else (0.0 - v) # Positive distance into neighbor
    else: # E/W Crossing. Along-edge is V. Overshoot is U.
        p = v
        dist = (u - 1.0) if side == E_E else (0.0 - u)

    # 2. Transform 'p' (Flip Axis)
    if flip_axis:
        p = 1.0 - p
        
    # 3. Map to Neighbor UV
    # Target Edge: Where we enter the neighbor.
    # N(0): v=1. S(2): v=0. E(1): u=1. W(3): u=0.
    
    nu, nv = 0.0, 0.0
    
    if target_edge == E_N: # Enter via North (v=1)
        nv = 1.0 - dist
        nu = p
    elif target_edge == E_S: # Enter via South (v=0)
        nv = 0.0 + dist
        nu = p
    elif target_edge == E_E: # Enter via East (u=1)
        nu = 1.0 - dist
        nv = p
    elif target_edge == E_W: # Enter via West (u=0)
        nu = 0.0 + dist
        nv = p
        
    return next_face, nu, nv

def sample_s2_atlas(face_datasets, face, u0, v0, u1, v1, out_w, out_h, alg=gdal.GRA_NearestNeighbour):
    """
    Reads a UV window (potentially spanning faces) from a list of 6 S2 Face Datasets.
    Returns (buffer, meta).
    Logic: Mosaic construction by resolving face transitions for requested regions.
    """
    # Assuming all faces have same resolution
    ref_ds = face_datasets[face]
    width, height = ref_ds.RasterXSize, ref_ds.RasterYSize
    nbands = ref_ds.RasterCount
    
    # Output Buffer
    if nbands >= 3:
        out_buf = np.zeros((out_h, out_w, nbands), dtype=np.float32)
    else:
        out_buf = np.zeros((out_h, out_w), dtype=np.float32)
        
    # Coordinate Mapping:
    # We iterate over the Output Grid (out_w x out_h).
    # Doing this per-pixel in Python is slow.
    # We will use the "9-patch" approach: Center, Sides, Corners.
    
    # Define the Requested UV Box
    # We map regions of the UV box to Source Faces.
    
    u_step = (u1 - u0) / out_w
    v_step = (v1 - v0) / out_h
    
    # 1. Center Region (Overlap with [0,1])
    # Intersection of [u0, u1] with [0, 1]
    c_u0, c_u1 = max(0.0, u0), min(1.0, u1)
    c_v0, c_v1 = max(0.0, v0), min(1.0, v1)
    
    def copy_region(target_u0, target_v0, target_u1, target_v1, src_ds, s_u0, s_v0, s_u1, s_v1, swap=False, flip_u=False, flip_v=False):
        # Convert Target UVs to Output Pixels
        px0 = int(round((target_u0 - u0) / u_step))
        px1 = int(round((target_u1 - u0) / u_step))
        py1 = int(round(out_h - (target_v0 - v0) / v_step)) # V grows up, Y grows down
        py0 = int(round(out_h - (target_v1 - v0) / v_step))
        
        # Clip to bounds
        px0, px1 = max(0, px0), min(out_w, px1)
        py0, py1 = max(0, py0), min(out_h, py1)
        
        if px1 <= px0 or py1 <= py0: return

        # convert Source UVs to Source Pixels
        sw, sh = src_ds.RasterXSize, src_ds.RasterYSize
        
        # Calculate native source dimensions
        if not swap:
            sx0 = int(round(s_u0 * sw))
            sx1 = int(round(s_u1 * sw))
            sy1 = int(round((1.0 - s_v0) * sh))
            sy0 = int(round((1.0 - s_v1) * sh))
        else:
            # If swapped, s_u on target corresponds to s_v/s_u in source?
            # s2_uv_transition already mapped u/v to nu/nv.
            # We just need to read the nu/nv bounding box and then TRANSPOSE the data.
            sx0 = int(round(s_u0 * sw))
            sx1 = int(round(s_u1 * sw))
            sy1 = int(round((1.0 - s_v0) * sh))
            sy0 = int(round((1.0 - s_v1) * sh))

        sx_min, sx_max = min(sx0, sx1), max(sx0, sx1)
        sy_min, sy_max = min(sy0, sy1), max(sy0, sy1)
        
        src_w_px = sx_max - sx_min
        src_h_px = sy_max - sy_min
        dst_w_px = px1 - px0
        dst_h_px = py1 - py0
        
        if src_w_px <= 0 or src_h_px <= 0: return
        
        # Read at native source aspect ratio to avoid squishing before transpose
        # Read size: if swapped, we read (dst_h x dst_w) and transpose to (dst_w x dst_h)
        read_w, read_h = (dst_h_px, dst_w_px) if swap else (dst_w_px, dst_h_px)
        
        # 1. Read Data
        data = src_ds.ReadAsArray(sx_min, sy_min, src_w_px, src_h_px, buf_xsize=read_w, buf_ysize=read_h, resample_alg=alg)
        if data is None: return
        
        # 2. De-normalize if this is a 16-bit DEM with matching metadata
        if data.dtype == np.uint16 and src_ds.RasterCount == 1:
            psz_min = src_ds.GetMetadataItem("DEM_MIN")
            psz_max = src_ds.GetMetadataItem("DEM_MAX")
            if psz_min and psz_max:
                d_min = float(psz_min)
                d_max = float(psz_max)
                # Convert to Float32 for math
                data = data.astype(np.float32)
                data = d_min + (data / 65535.0) * (d_max - d_min)

        # 3. Adjust dimensions if necessary (CHW -> HWC)
        if data.ndim == 3 and data.shape[0] == nbands:
             data = np.transpose(data, (1, 2, 0))
             
        # APPLY TRANSFORMATIONS
        if swap:
            # Transpose H and W
            if data.ndim == 3: data = np.transpose(data, (1, 0, 2))
            else: data = data.T
            
        if flip_u:
            data = np.flip(data, axis=1)
        if flip_v:
            data = np.flip(data, axis=0) # Note: Y-axis flip in image space

        # Final Paste
        if data.ndim == 2:
             out_buf[py0:py1, px0:px1] = data
        else:
             out_buf[py0:py1, px0:px1, :] = data

    # 1. Render Center (Current Face)
    if c_u1 > c_u0 and c_v1 > c_v0:
        copy_region(c_u0, c_v0, c_u1, c_v1, ref_ds, c_u0, c_v0, c_u1, c_v1)
        
    # 2. Render Sides (One transition)
    # Recursively render regions relative to center?
    
    # Helper for Side Processing
    def process_side(region_u0, region_v0, region_u1, region_v1):
        if region_u1 <= region_u0 or region_v1 <= region_v0: return
        
        # Pick sample point to determine Neighbor
        mid_u = (region_u0 + region_u1) * 0.5
        mid_v = (region_v0 + region_v1) * 0.5
        
        n_face, n_u_mid, n_v_mid = s2_uv_transition(face, mid_u, mid_v)
        
        if n_face == face: return
        
        # Detect Adjacency Transform
        # Order: N=0, E=1, S=2, W=3
        side_idx = -1
        if mid_v >= 1.0: side_idx = 0
        elif mid_v <= 0.0: side_idx = 2
        elif mid_u >= 1.0: side_idx = 1
        elif mid_u <= 0.0: side_idx = 3
        
        _, target_edge, swap, flip = S2_TRANSITIONS[face][side_idx]
        
        # Transform the Corners of the region to Neighbor UV space
        corners = [(region_u0, region_v0), (region_u1, region_v0), (region_u1, region_v1), (region_u0, region_v1)]
        trans_corners = [s2_uv_transition(face, u, v)[1:] for u, v in corners]
        
        tu_vals = [c[0] for c in trans_corners]
        tv_vals = [c[1] for c in trans_corners]
        
        min_tu, max_tu = min(tu_vals), max(tu_vals)
        min_tv, max_tv = min(tv_vals), max(tv_vals)
        
        # Clamp to [0,1]
        min_tu, max_tu = max(0.0, min_tu), min(1.0, max_tu)
        min_tv, max_tv = max(0.0, min_tv), min(1.0, max_tv)
        
        # Handle Flips. 
        # For simplicity, we flip if the corner order is reversed.
        f_u = False
        f_v = False
        
        # S2 Transitions logic:
        # If flip=True, it flips the coordinate *along* the edge.
        # If target is N/S (horizontal), along-edge is U. So flip_u.
        # If target is E/W (vertical), along-edge is V. So flip_v.
        if flip:
            if target_edge in [0, 2]: f_u = True
            else: f_v = True
            
        # Additionally, if we are reading from South(2) or East(1) transition, 
        # the 'overshoot' direction might be reversed?
        # S2_uv_transition handles this by 'dist' logic.
        
        copy_region(region_u0, region_v0, region_u1, region_v1, face_datasets[n_face], min_tu, min_tv, max_tu, max_tv, swap=swap, flip_u=f_u, flip_v=f_v)

    # Define Side Regions (clipped against center)
    # West: [u0, 0] x [c_v0, c_v1]
    if u0 < 0: process_side(u0, c_v0, 0.0, c_v1)
    
    # East: [1, u1] x [c_v0, c_v1]
    if u1 > 1: process_side(1.0, c_v0, u1, c_v1)
    
    # South: [c_u0, c_u1] x [v0, 0]
    if v0 < 0: process_side(c_u0, v0, c_u1, 0.0)
    
    # North: [c_u0, c_u1] x [1, v1]
    if v1 > 1: process_side(c_u0, 1.0, c_u1, v1)
    
    # 3. Render Corners (Double Transition) - Approximation: Diagonal Transition?
    # Actually, process_side logic works if s2_uv_transition handles corners?
    # s2_uv_transition returns face, u, v.
    # If we pass (-0.1, -0.1), s2_uv_transition might detect "South" first (check order), transition South.
    # Then new U might be outside South?
    # If so, we need 'double hop'.
    # For now, let's implement explicit corner handling if needed, or rely on Clamp for corners (safest fallback).
    # Given requirements (remove padding, rely on neighbor), exact corners are better.
    # Let's try to map corners by:
    # 1. Map center of corner region -> Face X.
    # 2. Map corners -> Face X UVs.
    
    # TL: [u0, 0] x [1, v1]
    if u0 < 0 and v1 > 1: process_side(u0, 1.0, 0.0, v1)
    # TR: [1, u1] x [1, v1]
    if u1 > 1 and v1 > 1: process_side(1.0, 1.0, u1, v1)
    # BL: [u0, 0] x [v0, 0]
    if u0 < 0 and v0 < 0: process_side(u0, v0, 0.0, 0.0)
    # BR: [1, u1] x [v0, 0]
    if u1 > 1 and v0 < 0: process_side(1.0, v0, u1, 0.0)
    
    return out_buf, {'width': width, 'height': height}
