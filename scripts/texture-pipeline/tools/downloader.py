import os
import sys
import time
import hashlib
import argparse
import concurrent.futures
import requests
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
        with tqdm(concurrent.futures.as_completed(futures), total=len(tasks), unit="tile", file=sys.stdout, desc="[PROGRESS:tiles] Initializing tiles...") as pbar:
            for future in pbar:
                result = future.result()
                if result:
                     # If error, print above the bar
                    tqdm.write(result)
                # Prefix tqdm output for GUI
                pbar.set_description(f"[PROGRESS:tiles] Downloading tiles")

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
            
            headers = {}
            downloaded = 0
            total_size = 0
            if os.path.exists(out_path):
                downloaded = os.path.getsize(out_path)
                # Check remote size first to see if we're already done
                try:
                    head_resp = session.head(url, timeout=args.timeout, allow_redirects=True)
                    if head_resp.status_code == 200:
                        total_size = int(head_resp.headers.get('content-length', 0))
                        
                        if downloaded > total_size and total_size > 0:
                            # Local file is bigger than remote? Corrupt or server file changed.
                            # Restart from scratch.
                            headers = {}
                            downloaded = 0
                        elif downloaded >= total_size and total_size > 0:
                            print(f"[PROGRESS:{filename}] Already fully downloaded: {filename}", flush=True)
                            return f"Skipped: {filename}"
                        elif downloaded > 0:
                            headers['Range'] = f'bytes={downloaded}-'
                except Exception:
                    # If HEAD fails (e.g. timeout), don't reset to 0. 
                    # We'll try the GET with the range we have.
                    if downloaded > 0:
                        headers['Range'] = f'bytes={downloaded}-'

            try:
                resp = session.get(url, stream=True, timeout=args.timeout, headers=headers)
                resp.raise_for_status()
            except Exception as e:
                # If GET fails with Range, try starting from scratch as a fallback
                if 'Range' in headers:
                    print(f"[PROGRESS:{filename}] Resume failed, restarting: {filename}", flush=True)
                    resp = session.get(url, stream=True, timeout=args.timeout)
                    resp.raise_for_status()
                    downloaded = 0
                else:
                    raise e
            
            # If server doesn't support ranges (status 200 instead of 206)
            if resp.status_code == 200:
                downloaded = 0
                mode = 'wb'
                total_size = int(resp.headers.get('content-length', 0))
            else:
                # 206 Partial Content
                mode = 'ab'
                # Content-Range format is "bytes <start>-<end>/<total>"
                content_range = resp.headers.get('Content-Range')
                if content_range:
                    total_size = int(content_range.split('/')[-1])
                else:
                    # Fallback if somehow Content-Range is missing but it's 206?
                    total_size = int(resp.headers.get('content-length', 0)) + downloaded

            last_report = downloaded
            start_time = time.time()
            # Calculate speed based on NEWLY downloaded data to be accurate
            session_downloaded = 0
            
            with open(out_path, mode) as f:
                for chunk in resp.iter_content(chunk_size=1024 * 1024): # 1MB chunks
                    f.write(chunk)
                    chunk_len = len(chunk)
                    downloaded += chunk_len
                    session_downloaded += chunk_len
                    
                    if total_size > 0:
                        # Report every 5MB or if finished
                        if downloaded - last_report > 5 * 1024 * 1024 or downloaded == total_size:
                            last_report = downloaded
                            elapsed = time.time() - start_time
                            # Speed is based on what we downloaded THIS session
                            speed = session_downloaded / elapsed if elapsed > 0 else 0
                            eta_seconds = (total_size - downloaded) / speed if speed > 0 else 0
                            
                            # Format speed and ETA
                            speed_mb = speed / (1024 * 1024)
                            eta_str = time.strftime("%H:%M:%S", time.gmtime(eta_seconds))
                            percent = (downloaded / total_size) * 100
                            
                            # Use Progress Tag with ID
                            print(f"[PROGRESS:{filename}] {filename}: {percent:.1f}% ({downloaded // (1024*1024)}MB / {total_size // (1024*1024)}MB) - {speed_mb:.1f}MB/s, ETA: {eta_str}", flush=True)
            
            # Final Integrity Check: Verified Size
            final_size = os.path.getsize(out_path)
            if total_size > 0 and final_size != total_size:
                return f"Error {filename}: Size mismatch. Expected {total_size}, got {final_size}"
            
            # Checksum Verification (Optional, if .md5 file exists on server)
            try:
                md5_url = url + ".md5"
                md5_resp = session.get(md5_url, timeout=5)
                if md5_resp.status_code == 200:
                    expected_md5 = md5_resp.text.strip().split()[0].lower()
                    print(f"[PROGRESS:{filename}] Verifying checksum...", flush=True)
                    
                    hasher = hashlib.md5()
                    with open(out_path, 'rb') as f:
                        for chunk in iter(lambda: f.read(4096 * 1024), b""):
                            hasher.update(chunk)
                    
                    actual_md5 = hasher.hexdigest().lower()
                    if actual_md5 != expected_md5:
                        return f"Error {filename}: Checksum mismatch! Expected {expected_md5}, got {actual_md5}"
                    else:
                        print(f"[PROGRESS:{filename}] {filename}: Checksum Verified Success", flush=True)
            except Exception as e:
                # If checksum check fails due to network, just log warning
                print(f"[PROGRESS:{filename}] {filename}: Checksum check skipped ({str(e)})", flush=True)
                
            return None
        except Exception as e:
            return f"Error {url}: {e}"
            
    print(f"Starting download for {len(lines)} files with {args.workers} workers...")
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as executor:
        futures = {executor.submit(download_url, url): url for url in lines}
        
        with tqdm(concurrent.futures.as_completed(futures), total=len(lines), unit="file", file=sys.stdout, desc="[PROGRESS:batch] Initializing batch...") as pbar:
            for future in pbar:
                result = future.result()
                if result:
                     # verbose only
                     # pass # print(result)
                     if "Error" in result:
                         tqdm.write(result)
                
                pbar.set_description(f"[PROGRESS:batch] Downloading batch")

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
