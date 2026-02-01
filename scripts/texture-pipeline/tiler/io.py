"""
IO Utilities.
Handles file reading, GDAL interactions, and logging.
"""

import os
import re
import json
import math
import time
import numpy as np
from osgeo import gdal, osr

# --- Suppress GDAL Warnings & Enable Errors ---
gdal.UseExceptions()
gdal.PushErrorHandler('CPLQuietErrorHandler')


def is_s2_face_path(path):
    """Detects if a path follows the S2 face naming convention or is a VRT descriptor."""
    if not path:
        return False
    # Support .vrt files as entry points
    if path.lower().endswith('.vrt'):
        return True
    # Matches patterns like _face0, .face1, face2, _face_0 etc. (case insensitive)
    return bool(re.search(r"[._]?face_?\d", os.path.basename(path), re.IGNORECASE))


def load_bodies():
    """Loads the celestial bodies database from bodies.json."""
    # Assuming bodies.json is in the parent of the parent of this file (repo root or similar?)
    # Original utils.py said: os.path.dirname(os.path.dirname(__file__)), "bodies.json"
    # This was tiler/utils.py -> parent is 'tiler' -> parent is 'texture-pipeline' (or whatever).
    # New file is tiler/io.py. Same directory depth.
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
        'padding': padding,
        'overviews': ov_count
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


def sample_s2_atlas(face_datasets, face, u0, v0, u1, v1, out_w, out_h, alg=gdal.GRA_NearestNeighbour):
    """
    Reads a UV window from a PADDED VRT Face Dataset.
    No adjacency logic required because the VRT contains the padding.
    """
    ref_ds = face_datasets[face]
    full_width = ref_ds.RasterXSize
    full_height = ref_ds.RasterYSize
    nbands = ref_ds.RasterCount
    
    # Calculate Padding P based on W = W_inner + 2*P and P = W_inner / 64
    inner_width = int(round(full_width * 32.0 / 33.0))
    padding = (full_width - inner_width) // 2
    
    # UV (0,0) -> Pixel (P, P). UV (1,1) -> Pixel (P+InnerW, P+InnerH)
    # Map requested UVs to VRT Pixel Coordinates
    px_u0 = padding + u0 * inner_width
    px_v0 = padding + (1.0 - v1) * inner_width # V grows Up (South to North). Raster Y grows Down.
    
    # Calculate source window size in source pixels
    src_w = (u1 - u0) * inner_width
    src_h = (v1 - v0) * inner_width 
    
    # Check for empty request
    if out_w <= 0 or out_h <= 0:
        if nbands >= 3: return np.zeros((out_h, out_w, nbands), dtype=np.float32), {}
        else: return np.zeros((out_h, out_w), dtype=np.float32), {}

    # Define high-precision window for GDAL
    ix = int(math.floor(px_u0))
    iy = int(math.floor(px_v0))
    # We want to cover from [px_u0, px_u0 + src_w]
    iw = int(math.ceil(px_u0 + src_w) - ix) 
    ih = int(math.ceil(px_v0 + src_h) - iy)
    
    # Clamp to VRT bounds (should not be needed if padding covers it, but safe)
    if ix < 0: 
        iw += ix
        ix = 0
    if iy < 0: 
        ih += iy
        iy = 0
    if ix + iw > full_width: iw = full_width - ix
    if iy + ih > full_height: ih = full_height - iy
    
    if iw <= 0 or ih <= 0:
        if nbands >= 3: return np.zeros((out_h, out_w, nbands), dtype=np.float32), {}
        else: return np.zeros((out_h, out_w), dtype=np.float32), {}

    data = ref_ds.ReadAsArray(ix, iy, iw, ih, buf_xsize=out_w, buf_ysize=out_h, resample_alg=alg)
    
    if data is None:
        if nbands >= 3: return np.zeros((out_h, out_w, nbands), dtype=np.float32), {}
        else: return np.zeros((out_h, out_w), dtype=np.float32), {}

    # De-normalize UINT16 if needed
    if data.dtype == np.uint16 and nbands == 1:
        psz_min = ref_ds.GetMetadataItem("DEM_MIN")
        psz_max = ref_ds.GetMetadataItem("DEM_MAX")
        if psz_min and psz_max:
            d_min = float(psz_min)
            d_max = float(psz_max)
            data = data.astype(np.float32)
            data = d_min + (data / 65535.0) * (d_max - d_min)

    # Transpose if CHW
    if data.ndim == 3 and data.shape[0] == nbands:
        data = np.transpose(data, (1, 2, 0))
        
    return data, {}
