"""
Utility functions for Planet Tiler.
Core helpers for coordinate conversion, raster reading, and logging.
"""

import os
import json
import math
import time
import numpy as np
from osgeo import gdal, osr

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


def inspect_file(path, label):
    """Analyzes a GeoTIFF file and prints important info (incl. Scale/Offset)."""
    ds = gdal.Open(path)
    if not ds:
        log(f"Could not open {label}: {path}", "ERR")
        return False
        
    width = ds.RasterXSize
    height = ds.RasterYSize
    bands = ds.RasterCount
    band = ds.GetRasterBand(1)
    
    # Read Metadata
    nodata = band.GetNoDataValue()
    scale = band.GetScale()
    offset = band.GetOffset()
    
    # Geotransform & Bounds
    gt = ds.GetGeoTransform()
    min_x = gt[0]
    max_y = gt[3]
    max_x = min_x + (gt[1] * width)
    min_y = max_y + (gt[5] * height)
    
    print(f"--- Analysis: {label} ---")
    print(f"  File:        {os.path.basename(path)}")
    print(f"  Dimensions:  {width} x {height} Pixels")
    print(f"  Bounds:      X[{min_x:.2f}..{max_x:.2f}], Y[{min_y:.2f}..{max_y:.2f}]")
    
    # Output Metadata
    print(f"  NoData Value: {nodata}")
    print(f"  Internal Scale: {scale} (If not None/1.0, GDAL often applies this automatically)")
    print(f"  Internal Offset: {offset}")
    print("--------------------------")
    
    ds = None
    return (width, height)


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

    res_h, res_w = data.shape[:2]
    meta = {
        'min_lon': fetch_min_lon,
        'max_lat': fetch_max_lat,
        'scale_x': (gt[1] * (px_end - px_start)) / res_w if res_w > 0 else gt[1],
        'scale_y': (abs(gt[5]) * (py_end - py_start)) / res_h if res_h > 0 else abs(gt[5])
    }
    return data, meta
