from osgeo import gdal
import argparse
import os
import sys

# Silence GDAL FutureWarning
gdal.UseExceptions()

# Allow reprojection between celestial bodies (Moon -> Earth-based EPSG:4326)
os.environ['PROJ_IGNORE_CELESTIAL_BODY'] = 'YES'

# Force unbuffered output for GUI real-time logging
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(line_buffering=True)
else:
    # Fallback for older Python
    sys.stdout = os.fdopen(sys.stdout.fileno(), 'w', buffering=1)

import time

# Progress callback with ETA
def progress_cb(complete, message, data):
    percent = int(complete * 100)
    
    if not hasattr(progress_cb, 'start_time'):
        progress_cb.start_time = time.time()
        progress_cb.last_percent = 0
    
    # Update every 5% or at 100%
    if percent >= progress_cb.last_percent + 5 or percent == 100:
        elapsed = time.time() - progress_cb.start_time
        if percent > 0:
            total_estimated = elapsed / (percent / 100.0)
            remaining = total_estimated - elapsed
            eta_str = time.strftime("%H:%M:%S", time.gmtime(remaining))
        else:
            eta_str = "??"

        # Use [PROGRESS] tag for GUI extraction
        print(f"[PROGRESS] {percent}% (ETA: {eta_str})")
        sys.stdout.flush()
        progress_cb.last_percent = percent
    return 1

def fix_projection(input_path, output_path):
    print(f"Processing: {input_path}")
    
    # Open source to check status
    src_ds = gdal.Open(input_path)
    if not src_ds:
        print("Error: Could not open input file.")
        return

    # Inspect Source SRS to preserve planetary body dimensions (avoid Earth-flattening distortion)
    srs = src_ds.GetSpatialRef()
    dst_srs_str = "EPSG:4326" # Default backup
    
    if srs:
        # Extract ellipsoid parameters
        semi_major = srs.GetSemiMajor()
        semi_minor = srs.GetSemiMinor()
        
        # If valid radii found, construct a custom Lat/Lon CRS on that body
        if semi_major and semi_minor:
            print(f"Detected Body Dimensions: R_eq={semi_major:.1f}, R_pol={semi_minor:.1f}")
            dst_srs_str = f"+proj=longlat +a={semi_major} +b={semi_minor} +no_defs"
    
    print(f"Target CRS: {dst_srs_str}")

    # Step 1: Create an intermediate VRT that explicitly REMOVES any NoData metadata
    # This prevents GDAL from thinking 0 is NoData and shifting it to 1.
    print("Pre-processing: Stripping NoData metadata...")
    clean_vrt = gdal.Translate(
        "/vsimem/temp_clean.vrt", 
        src_ds, 
        format="VRT", 
        noData="none", # This tells GDAL to unset/ignore nodata
        callback=progress_cb
    )

    if not clean_vrt:
        print("Error: Failed to create intermediate clean VRT.")
        return

    # Step 2: Warp the CLEAN dataset
    print("Reprojecting to Lat/Lon...")
    options = gdal.WarpOptions(
        dstSRS=dst_srs_str,
        srcNodata=None, # Source is now clean, so this is redundant but safe
        dstNodata=None, # Ensure output definitely has no nodata
        resampleAlg="lanczos",
        multithread=True, # Enable multi-threading
        warpOptions=["NUM_THREADS=ALL_CPUS"], # Use all available cores
        creationOptions=["COMPRESS=LZW", "BIGTIFF=YES", "TILED=YES"],
        callback=progress_cb
    )
    
    gdal.Warp(output_path, clean_vrt, options=options)
    
    # Clean up memory VRT
    try:
        clean_vrt = None
        gdal.Unlink("/vsimem/temp_clean.vrt")
    except Exception as e:
        print(f"Warning: Cleanup failed ({e}), but this is harmless.")
    
    print(f"Success! Created: {output_path}")
    
    # Report Stats
    def get_info(path):
        size = os.path.getsize(path) / (1024 * 1024) # MB
        ds = gdal.Open(path)
        comp = None
        if ds:
            # Check IMAGE_STRUCTURE for compression
            comp = ds.GetMetadata("IMAGE_STRUCTURE").get("COMPRESSION", None)
            # If not there, try per-band (sometimes different)
            if comp is None and ds.RasterCount > 0:
                 comp = ds.GetRasterBand(1).GetMetadata("IMAGE_STRUCTURE").get("COMPRESSION", None)
        
        # If missing, it's typically uncompressed (raw)
        if comp is None:
            comp = "None"
            
        return size, comp

    in_size, in_comp = get_info(input_path)
    out_size, out_comp = get_info(output_path)
    
    print("-" * 40)
    print(f"Input:  {in_size:.2f} MB ({in_comp})")
    print(f"Output: {out_size:.2f} MB ({out_comp})")
    print("-" * 40)

    print(f"Output: {out_size:.2f} MB ({out_comp})")
    print("-" * 40)
    
    if hasattr(progress_cb, 'start_time'):
        total_time = time.time() - progress_cb.start_time
        print(f"[INFO] Total Time: {time.strftime('%H:%M:%S', time.gmtime(total_time))}")

    print("You can now use this file with the Preprocessor (it will skip auto-reprojection).")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Fix Projection and NoData for Preprocessor")
    parser.add_argument("input", help="Input file path")
    parser.add_argument("output", help="Output file path (referencing cleaned file)")
    args = parser.parse_args()
    
    fix_projection(args.input, args.output)
