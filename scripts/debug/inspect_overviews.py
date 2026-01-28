
import sys
import os
import numpy as np
from osgeo import gdal

def inspect_overviews(path):
    print(f"Inspecting: {path}")
    ds = gdal.Open(path)
    if not ds:
        print("Failed to open file")
        return

    band = ds.GetRasterBand(1)
    ov_count = band.GetOverviewCount()
    print(f"Overview Count: {ov_count}")
    
    # 1. Find Global Min/Max in Base Layer (approximated efficiently or just scan a known area)
    # For speed, we'll just read the statistics or a center chunk if stats are missing
    stats = band.GetStatistics(True, True)
    print(f"Base Level Stats: Min={stats[0]:.2f}, Max={stats[1]:.2f}")
    
    # 2. Check Overviews
    for i in range(ov_count):
        ov_band = band.GetOverview(i)
        ov_stats = ov_band.GetStatistics(True, True)
        print(f"Overview {i}: Min={ov_stats[0]:.2f}, Max={ov_stats[1]:.2f}")
        
        # Check for Flattening
        min_diff = ov_stats[0] - stats[0]
        max_diff = stats[1] - ov_stats[1]
        
        if min_diff > 100 or max_diff > 100:
            print(f"   [WARN] Overview {i} is flattened by {-min_diff:.1f}m / {-max_diff:.1f}m compared to Base.")
            
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python inspect_overviews.py <vrt_path>")
    else:
        inspect_overviews(sys.argv[1])
