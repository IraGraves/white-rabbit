import sys
from osgeo import gdal

gdal.UseExceptions()

def check_vrt(path):
    try:
        ds = gdal.Open(path)
        w = ds.RasterXSize
        h = ds.RasterYSize
        
        # User says padding is 1/64 of texture size (presumably inner size, or full size?)
        # Tiler Utils says: inner = w * 32/33
        
        inner_w_calc = w * 32.0 / 33.0
        inner_w_int = int(round(inner_w_calc))
        
        is_clean = abs(inner_w_calc - inner_w_int) < 1e-5
        
        padding = (w - inner_w_int) / 2.0
        
        print(f"File: {path}")
        print(f"Size: {w} x {h}")
        print(f"Calc Inner: {inner_w_calc:.4f}")
        print(f"Round Inner: {inner_w_int}")
        print(f"Clean Integer? {is_clean}")
        print(f"Padding (One Side): {padding}")
        print(f"Ratio 64 Check: Padding / Inner = {padding / inner_w_int if inner_w_int else 0:.6f} (Expected 1/64 = 0.015625)")
        print("-" * 20)
        
    except Exception as e:
        print(f"Error opening {path}: {e}")

if __name__ == "__main__":
    import os
    SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
    INPUT_DIR = os.path.join(SCRIPT_DIR, "..", "texture-pipeline", "input")
    files = [
        os.path.join(INPUT_DIR, "moon", "moon_terrain_face0.vrt"),
        os.path.join(INPUT_DIR, "moon", "moon_color_face0.vrt"),
        os.path.join(INPUT_DIR, "s2_debug_face0.vrt")
    ]
    
    for f in files:
        check_vrt(f)
