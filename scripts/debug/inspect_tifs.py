
import numpy as np
from osgeo import gdal
import os

def inspect_face(path):
    if not os.path.exists(path):
        print(f"File not found: {path}")
        return
    
    ds = gdal.Open(path)
    band = ds.GetRasterBand(1)
    data = band.ReadAsArray()
    
    # Check for constant regions
    # Middle row is at height // 2
    h, w = data.shape
    mid_row = data[h//2, :]
    mid_col = data[:, w//2]
    
    print(f"--- File: {os.path.basename(path)} ---")
    print(f"  Size: {w}x{h}")
    print(f"  Min/Max: {np.min(data):.1f} / {np.max(data):.1f}")
    print(f"  Mean: {np.mean(data):.1f}")
    
    # Check if half is constant (e.g. 0.0 or NoData)
    half_w = w // 2
    left_side = data[:, :half_w]
    right_side = data[:, half_w:]
    
    print(f"  Left Half Min/Max:  [{np.min(left_side):.1f}, {np.max(left_side):.1f}]")
    print(f"  Right Half Min/Max: [{np.min(right_side):.1f}, {np.max(right_side):.1f}]")
    
    # Check for vertical halves as well
    half_h = h // 2
    top_half = data[:half_h, :]
    bot_half = data[half_h:, :]
    print(f"  Top Half Min/Max:   [{np.min(top_half):.1f}, {np.max(top_half):.1f}]")
    print(f"  Bot Half Min/Max:   [{np.min(bot_half):.1f}, {np.max(bot_half):.1f}]")

def main():
    # Use relative path from script location
    SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
    prefix = os.path.join(SCRIPT_DIR, "..", "texture-pipeline", "input", "moon", "moon_terrain")
    for f in range(6):
        inspect_face(f"{prefix}_face{f}.tif")

if __name__ == "__main__":
    main()
