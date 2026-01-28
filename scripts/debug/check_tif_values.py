
from osgeo import gdal
import numpy as np

def check_tif(path):
    print(f"Opening {path}...")
    ds = gdal.Open(path)
    if not ds:
        print("Failed to open file")
        return

    width = ds.RasterXSize
    height = ds.RasterYSize
    print(f"Size: {width} x {height}")
    
    band = ds.GetRasterBand(1)
    print(f"DataType: {gdal.GetDataTypeName(band.DataType)}")
    print(f"NoData: {band.GetNoDataValue()}")
    print(f"Scale: {band.GetScale()}")
    print(f"Offset: {band.GetOffset()}")
    print(f"Min/Max: {band.ComputeRasterMinMax(True)}")
    
    overviews = band.GetOverviewCount()
    print(f"Overviews: {overviews}")
    
    # We want a low resolution overview (Zoom 1 equivalent)
    # Original is 16k. Zoom 1 is small (~512 or 256).
    # Overview 0 is usually /2, 1 is /4...
    # Overview 5 (if 6 total) should be very small.
    
    tgt_ov = overviews - 1
    ov_band = ds.GetRasterBand(1).GetOverview(tgt_ov)
    
    ov_w = ov_band.XSize
    ov_h = ov_band.YSize
    print(f"Overview {tgt_ov} Size: {ov_w} x {ov_h}")
    
    # Read Left Edge (Padding check)
    # Target Row 210 (Calculated from v=0.19)
    mid_y = 210
    
    print(f"Reading row {mid_y} (Calculated Target)...")
    data = ov_band.ReadAsArray(0, mid_y, 10, 1)
    print("Indices 0-9:")
    for i in range(10):
        print(f"  Pixel {i}: {data[0][i]}")
    
    ds = None

def check_neighbor_face0(mid_y):
    path = "input/moon/moon_terrain_face0.tif"
    print(f"\nOpening Neighbor {path}...")
    ds = gdal.Open(path)
    overviews = ds.GetRasterBand(1).GetOverviewCount()
    tgt_ov = overviews - 1
    ov_band = ds.GetRasterBand(1).GetOverview(tgt_ov)
    ov_w = ov_band.XSize
    
    print(f"Reading row {mid_y} (Right Edge)...")
    # Read last 5 pixels
    data = ov_band.ReadAsArray(ov_w - 5, mid_y, 5, 1)
    
    print("Indices (W-5 to W-1):")
    for i in range(5):
        print(f"  Pixel {ov_w - 5 + i}: {data[0][i]}")
        
    ds = None

if __name__ == "__main__":
    # Check Face 1 (Left Edge)
    path = "input/moon/moon_terrain_face1.tif"
    check_tif(path)
    
    # Check Face 0 (Right Edge, Neighbor)
    # Using row 210 from previous check
    check_neighbor_face0(210)
