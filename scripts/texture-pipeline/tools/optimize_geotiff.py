import argparse
import os
import shutil
import sys

# Flush stdout to ensure real-time logging in GUI
def log(msg, error=False):
    prefix = "[ERROR] " if error else "[INFO] "
    print(f"{prefix}{msg}", flush=True)

print("[SYSTEM] optimization script started...", flush=True)

try:
    from osgeo import gdal
except ImportError:
    log("GDAL (osgeo) module not found! Please check your python environment.", error=True)
    sys.exit(1)

# Custom progress callback for GUI
def progress_cb(complete, message, unknown):
    percent = int(complete * 100)
    # Only print every 5% or if 100% to avoid flooding
    # But wait, GUI handles progress updates efficiently usually.
    # Let's print integers to be safe.
    # We use a static variable to avoid re-printing the same percent
    if not hasattr(progress_cb, "last_percent"):
        progress_cb.last_percent = -1
    
    if percent != progress_cb.last_percent:
        print(f"[PROGRESS] Optimization: {percent}%", flush=True)
        progress_cb.last_percent = percent
    return 1

def optimize_geotiff(input_path, output_path=None, compress="LZW", replace=False):
    if not os.path.exists(input_path):
        log(f"Input file not found: {input_path}", error=True)
        return

    # Determine temp/output path
    if replace:
        # If replacing, we treat the 'output' as a temp file first
        base, ext = os.path.splitext(input_path)
        temp_path = f"{base}_optimized_tmp{ext}"
        target_path = input_path
    else:
        if not output_path:
            base, ext = os.path.splitext(input_path)
            output_path = f"{base}_optimized{ext}"
        temp_path = output_path
        target_path = output_path

    log(f"Optimizing: {input_path}")
    log(f"Target:     {target_path}")
    log(f"Compression: {compress}")

    try:
        ds = gdal.Open(input_path)
        if not ds:
            log(f"Could not open {input_path}", error=True)
            return

        # Smart Predictor Selection
        band = ds.GetRasterBand(1)
        dtype = band.DataType
        # Float32 (6) or Float64 (7) -> Predictor 3
        # Ints/Bytes -> Predictor 2
        predictor = "3" if dtype >= 6 else "2"
        
        # Creation Options for COG-like behavior
        creation_options = [
            "TILED=YES",
            f"COMPRESS={compress}",
            f"PREDICTOR={predictor}", 
            "BIGTIFF=IF_NEEDED",
            "BLOCKXSIZE=512",
            "BLOCKYSIZE=512"
        ]
        
        log(f"Starting conversion to {temp_path}... (this may take a while)")
        gdal.Translate(
            temp_path,
            ds,
            format="GTiff",
            creationOptions=creation_options,
            callback=progress_cb
        )
        
        ds = None # Close dataset

        if replace:
            log(f"Replacing original file: {input_path}")
            # Backup just in case? Maybe too complex for now. user asked for replace.
            try:
                # On Windows, need to handle file locks carefully.
                # If ds was not properly released, remove might fail.
                if os.path.exists(input_path):
                    os.remove(input_path)
                os.rename(temp_path, input_path)
                log(f"File optimized and replaced.")
            except Exception as e:
                log(f"Failed to replace original file: {e}", error=True)
                log(f"Optimized file remains at: {temp_path}")
        else:
            log(f"Optimization complete: {target_path}")
        
    except Exception as e:
        log(f"Optimization failed: {e}", error=True)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Optimize GeoTIFF (Tiled + Compressed)")
    parser.add_argument("file", help="Path to input GeoTIFF")
    parser.add_argument("--output", "-o", help="Path to output GeoTIFF (optional)")
    parser.add_argument("--compress", default="LZW", choices=["LZW", "DEFLATE", "NONE", "ZSTD"], help="Compression algorithm")
    parser.add_argument("--replace", action="store_true", help="Replace original file with optimized version")
    
    args = parser.parse_args()
    optimize_geotiff(args.file, args.output, args.compress, args.replace)
