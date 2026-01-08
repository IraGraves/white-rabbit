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
        # Matches older/synthetic datasets where lat is just angle-to-center
        cos_lat = np.cos(lat)
        x = (rx + height) * cos_lat * np.cos(lon)
        y = (ry + height) * cos_lat * np.sin(lon)
        z = (rz + height) * np.sin(lat)
        return x, y, z

    # Rigorous Geodetic Formula
    a = rx # Semi-major (Equatorial)
    b = rz # Semi-minor (Polar)
    
    # Square of eccentricity
    # e2 = (a^2 - b^2) / a^2
    e2 = (a**2 - b**2) / (a**2)
    
    sin_lat = np.sin(lat)
    cos_lat = np.cos(lat)
    cos_lon = np.cos(lon)
    sin_lon = np.sin(lon)
    
    # Prime vertical radius of curvature
    # N = a / sqrt(1 - e^2 * sin^2(lat))
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


def read_raster_window(ds, min_lon, min_lat, max_lon, max_lat, out_w, out_h, alg=gdal.GRA_Cubic):
    """Reads a window from a raster dataset and resamples it."""
    gt = ds.GetGeoTransform()
    # Basic pixel calculation
    px_min = int((min_lon - gt[0]) / gt[1])
    px_max = int((max_lon - gt[0]) / gt[1])
    py_max = int((min_lat - gt[3]) / gt[5])
    py_min = int((max_lat - gt[3]) / gt[5])

    # --- WRAPPING FIX for 0..360 vs -180..180 mismatch ---
    width = ds.RasterXSize
    if px_min < 0 and gt[0] >= -0.0001:
        # Source likely 0..360 (starts at 0), but Request is West (negative).
        # Check if shifting +360 aligns with data.
        min_lon_shift = min_lon + 360.0
        px_min_shift = int((min_lon_shift - gt[0]) / gt[1])
        
        if 0 <= px_min_shift < width:
            # Valid wrap detected. Use shifted coordinates.
            px_min = px_min_shift
            max_lon_shift = max_lon + 360.0
            px_max = int((max_lon_shift - gt[0]) / gt[1])

    x_off = min(px_min, px_max)
    y_off = min(py_min, py_max)
    x_size_src = abs(px_max - px_min)
    y_size_src = abs(py_max - py_min)
    
    if x_off < 0: x_off = 0
    if y_off < 0: y_off = 0
    
    if x_size_src <= 0 or y_size_src <= 0:
        return np.zeros((out_h, out_w))
    
    try:
        data = ds.ReadAsArray(
            x_off, y_off, x_size_src, y_size_src, 
            buf_xsize=out_w, buf_ysize=out_h,
            resample_alg=alg
        )
        return data
    except Exception:
        return np.zeros((out_h, out_w))
