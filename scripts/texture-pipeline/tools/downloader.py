import os
import time
import argparse
import requests
import json
import concurrent.futures
import numpy as np
from io import BytesIO
from tqdm import tqdm
from urllib3.util.retry import Retry
from requests.adapters import HTTPAdapter

# Robust Import for GeoTIFF
HAS_RASTERIO = False
HAS_GDAL = False

# try:
#     import rasterio
#     from rasterio.transform import from_origin
#     HAS_RASTERIO = True
# except ImportError:
try:
    from osgeo import gdal, osr
    HAS_GDAL = True
except ImportError:
    pass

try:
    from astropy.io import fits
    HAS_FITS = True
except ImportError:
    HAS_FITS = False
    print("Warning: astropy not found, FITS support disabled.")

# --- HELPERS ---

def get_session(retries=5, backoff_factor=1):
    session = requests.Session()
    retry = Retry(
        total=retries,
        read=retries,
        connect=retries,
        backoff_factor=backoff_factor,
        status_forcelist=[500, 502, 503, 504],
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount("http://", adapter)
    session.mount("https://", adapter)
    return session

def ensure_dir(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)

def save_geotiff(filename, data, h, w, count, lon_start, lat_top, res_x, res_y):
    """Saves GeoTIFF using Rasterio or GDAL."""
    gis_lon_start = lon_start if lon_start <= 180 else lon_start - 360

    if HAS_RASTERIO:
        try:
            transform = from_origin(gis_lon_start, lat_top, res_x, res_y)
            with rasterio.open(
                filename, 'w', driver='GTiff',
                height=h, width=w, count=count, dtype=data.dtype,
                crs='+proj=longlat +datum=WGS84 +no_defs',
                transform=transform, compress='lzw'
            ) as dst:
                dst.write(data)
            return
        except Exception as e:
            # Fallback
            pass
            
    if HAS_GDAL:
        try:
            driver = gdal.GetDriverByName("GTiff")
            gdal_type = gdal.GDT_Byte
            if data.dtype == np.uint16: gdal_type = gdal.GDT_UInt16
            elif data.dtype == np.int16: gdal_type = gdal.GDT_Int16
            elif data.dtype == np.float32: gdal_type = gdal.GDT_Float32
            
            dst_ds = driver.Create(filename, w, h, count, gdal_type, options=["COMPRESS=LZW"])
            dst_ds.SetGeoTransform([gis_lon_start, res_x, 0, lat_top, 0, -res_y])
            
            srs = osr.SpatialReference()
            srs.ImportFromEPSG(4326)
            dst_ds.SetProjection(srs.ExportToWkt())
            
            for i in range(count):
                dst_ds.GetRasterBand(i+1).WriteArray(data[i])
            dst_ds = None 
            return
        except Exception as e:
            raise RuntimeError(f"GDAL Fallback failed: {e}")
    raise ImportError("Neither Rasterio nor GDAL could be loaded.")

def is_valid_geotiff(filename):
    """Checks if a GeoTIFF is valid and can be opened."""
    if not os.path.exists(filename):
        return False
        
    if os.path.getsize(filename) < 1024:
        return False

    if HAS_RASTERIO:
        try:
            with rasterio.open(filename) as src:
                # Try reading a small chunk or metadata
                _ = src.bounds
                _ = src.count
            return True
        except Exception:
            return False
            
    if HAS_GDAL:
        try:
            ds = gdal.Open(filename)
            if ds is None:
                return False
            ds = None # Close
            return True
        except Exception:
            return False

    # Fallback if no libs (unlikely since we need them to write)
    return True

# --- MODES ---

def run_hips_mode(args):
    print(f"Starting HiPS Download...")
    print(f"Service: {args.hips_url}")
    print(f"ID: {args.hips_id}")
    print(f"Grid: {args.tiles_x}x{args.tiles_y} tiles")
    print(f"Grid: {args.tiles_x}x{args.tiles_y} tiles")
    
    if args.full_width and args.full_height:
        approx_w = args.full_width // args.tiles_x
        approx_h = args.full_height // args.tiles_y
        print(f"Resolution per tile (Dynamic): ~{approx_w}x{approx_h} px")
    else:
        print(f"Resolution per tile: {args.width}x{args.height}")

    if not HAS_FITS:
        print("Error: Astropy is required for HiPS FITS parsing. Please install it.")
        return

    ensure_dir(args.output)
    
    session = get_session(retries=args.retries, backoff_factor=args.backoff)
    
    # Calculate global geometry
    full_width_deg = 360.0
    full_height_deg = 180.0
    
    tasks = []
    
    for y in range(args.tiles_y):
        for x in range(args.tiles_x):
            filename = os.path.join(args.output, f"{args.prefix}_X{x}_Y{y}.tif")
            if is_valid_geotiff(filename):
                continue
            elif os.path.exists(filename):
                print(f"File {filename} exists but is invalid. Re-downloading...")
                
            tasks.append((x, y))
            
    skipped_count = (args.tiles_x * args.tiles_y) - len(tasks)
    if skipped_count > 0:
        print(f"Resuming: {skipped_count} tiles already exist and are valid.")

    if not tasks:
        print("All tiles verified. Nothing to download.")
        return

    print(f"Starting download for {len(tasks)} remaining tiles with {args.workers} workers...")
    
    def process_tile(coord):
        x, y = coord
        try:
            # Geometry Calculation
            step_x = full_width_deg / args.tiles_x
            step_y = full_height_deg / args.tiles_y
            
            lon_start = x * step_x
            lat_top = 90.0 - (y * step_y)
            
            # Dynamic Size Calculation (Legacy Mode)
            if args.full_width and args.full_height:
                tile_w_px = args.full_width // args.tiles_x
                tile_h_px = args.full_height // args.tiles_y
                
                # Handle remainder for last column/row
                if x == args.tiles_x - 1:
                    tile_w_px = args.full_width - (tile_w_px * x)
                if y == args.tiles_y - 1:
                    tile_h_px = args.full_height - (tile_h_px * y)
            else:
                tile_w_px = args.width
                tile_h_px = args.height # Fixed size request
            
            fov = step_x # Approx
            
            lon_center = lon_start + (step_x / 2.0)
            lat_center = lat_top - (step_y / 2.0)
            
            params = {
                'hips': args.hips_id, 'width': tile_w_px, 'height': tile_h_px, 
                'projection': 'CAR', 'fov': fov, 'ra': lon_center, 'dec': lat_center, 
                'format': 'fits'
            }
            
            tqdm.write(f"[{x},{y}] Requesting... (Wait for server)")
            # print(f"[{x},{y}] Downloading...")
            response = session.get(args.hips_url, params=params, timeout=args.timeout)
            response.raise_for_status()
            
            with fits.open(BytesIO(response.content)) as hdul:
                data = hdul[0].data
            
            # Normalize shape
            if len(data.shape) == 2:
                data = data.reshape(1, data.shape[0], data.shape[1])
                
            # Geometry for GeoTIFF
            res_x = step_x / tile_w_px
            res_y = step_y / tile_h_px
            
            filename = os.path.join(args.output, f"{args.prefix}_X{x}_Y{y}.tif")
            save_geotiff(filename, data, tile_h_px, tile_w_px, data.shape[0], lon_start, lat_top, res_x, res_y)
            return None
            
        except Exception as e:
            return f"Error X{x}Y{y}: {e}"

    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as executor:
        futures = {executor.submit(process_tile, task): task for task in tasks}
        
        # Use tqdm for progress bar
        for future in tqdm(concurrent.futures.as_completed(futures), total=len(tasks), unit="tile"):
            result = future.result()
            if result:
                 # If error, print above the bar
                tqdm.write(result)

    print("HiPS Download Complete.")


def run_batch_mode(args):
    print(f"Starting Batch Download...")
    print(f"List File: {args.file_list}")
    
    ensure_dir(args.output)
    session = get_session(retries=args.retries, backoff_factor=args.backoff)
    
    with open(args.file_list, 'r') as f:
        lines = [l.strip() for l in f if l.strip()]
        
    print(f"Found {len(lines)} URLs.")
    
    def download_url(url):
        try:
            filename = url.split('/')[-1].split('?')[0]
            if not filename:
                filename = f"file_{hash(url)}"
            
            out_path = os.path.join(args.output, filename)
            
            if os.path.exists(out_path):
                return f"Skipped: {filename}"
                
            # print(f"Downloading {filename}...")
            resp = session.get(url, stream=True, timeout=args.timeout)
            resp.raise_for_status()
            
            with open(out_path, 'wb') as f:
                for chunk in resp.iter_content(chunk_size=8192):
                    f.write(chunk)
            return None
        except Exception as e:
            return f"Error {url}: {e}"
            
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as executor:
        futures = {executor.submit(download_url, url): url for url in lines}
        
        for i, future in enumerate(concurrent.futures.as_completed(futures)):
            result = future.result()
            if result:
                 # verbose only
                 pass # print(result)
            
            if i % 5 == 0:
                print(f"Progress: {i+1}/{len(lines)}", flush=True)

    print("Batch Download Complete.")

# --- MAIN ---

def main():
    parser = argparse.ArgumentParser(description="Universal Downloader Tool")
    subparsers = parser.add_subparsers(dest="mode", required=True)
    
    # HiPS Parser
    hips_parser = subparsers.add_parser("hips")
    hips_parser.add_argument("--hips-url", required=True)
    hips_parser.add_argument("--hips-id", required=True)
    hips_parser.add_argument("--tiles-x", type=int, default=10)
    hips_parser.add_argument("--tiles-y", type=int, default=5)
    hips_parser.add_argument("--width", type=int, default=512)
    hips_parser.add_argument("--height", type=int, default=512)
    hips_parser.add_argument("--full-width", type=int, help="Total width in px for dynamic tiling")
    hips_parser.add_argument("--full-height", type=int, help="Total height in px for dynamic tiling")
    hips_parser.add_argument("--output", required=True)
    hips_parser.add_argument("--workers", type=int, default=4)
    hips_parser.add_argument("--retries", type=int, default=5)
    hips_parser.add_argument("--backoff", type=float, default=1.0)
    hips_parser.add_argument("--timeout", type=int, default=60)
    hips_parser.add_argument("--prefix", default="Tile", help="Filename prefix (default: Tile)")
    
    # Batch Parser
    batch_parser = subparsers.add_parser("batch")
    batch_parser.add_argument("--file-list", required=True)
    batch_parser.add_argument("--output", required=True)
    batch_parser.add_argument("--workers", type=int, default=4)
    batch_parser.add_argument("--retries", type=int, default=5)
    batch_parser.add_argument("--backoff", type=float, default=1.0)
    batch_parser.add_argument("--timeout", type=int, default=60)
    
    args = parser.parse_args()
    
    if args.mode == "hips":
        run_hips_mode(args)
    elif args.mode == "batch":
        run_batch_mode(args)

if __name__ == "__main__":
    main()
