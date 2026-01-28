
import os
import sys
import numpy as np
from osgeo import gdal

# Use utils from local folder
sys.path.append(os.path.dirname(__file__))
from tiler.utils import read_raster_window, get_tile_bounds, inspect_file, latlon_to_ecef

def debug_tile():
    dem_path = "moon_terrain.tif" # Assume standard name
    if not os.path.exists(dem_path):
        print(f"DEM not found: {dem_path}")
        return

    print(f"--- Debugging {dem_path} ---")
    ds = gdal.Open(dem_path)
    gt = ds.GetGeoTransform()
    width = ds.RasterXSize
    height = ds.RasterYSize
    print(f"GT: {gt}")
    print(f"Size: {width} x {height}")
    print(f"Origin: ({gt[0]}, {gt[3]})")
    print(f"Pixel Size: ({gt[1]}, {gt[5]})")
    
    # Simulate Tile 1/0/0 (Global x=0, y=0, z=1)
    # West Root (0..2), Level 1.
    # Global Zoom 1: 4x2 tiles.
    # Tx range 0..4. Ty range 0..2.
    # Tx=0 -> -180 .. -90.
    # Ty=0 -> -90 .. 0.
    
    tx = 0
    ty = 0
    zoom = 1
    
    print(f"\n--- Simulating Tile z={zoom} x={tx} y={ty} ---")
    min_lon, min_lat, max_lon, max_lat = get_tile_bounds(tx, ty, zoom)
    print(f"Expected Bounds: Lon [{min_lon} .. {max_lon}], Lat [{min_lat} .. {max_lat}]")
    
    # Read Raster
    print("Reading Raster Window...")
    data = read_raster_window(ds, min_lon, min_lat, max_lon, max_lat, 64, 64)
    print(f"Data Shape: {data.shape}")
    print(f"Data Min/Max: {np.min(data)} / {np.max(data)}")
    
    # Check Pixel Calculation Manually
    px_min = int((min_lon - gt[0]) / gt[1])
    px_max = int((max_lon - gt[0]) / gt[1])
    print(f"Pixel X Range (Computed): {px_min} to {px_max}")
    
    if px_min < 0:
        print("WARNING: px_min is negative! Clamping/Wrapping logic triggered.")
    
    # Simulate Mesh Generation (Corner Points)
    print("\n--- Generating Corners ---")
    corners_ecef = []
    
    # 0,0 (Bottom Left of Tile Mesh) -> Lat=Min, Lon=Min
    # 1,1 (Top Right of Tile Mesh) -> Lat=Max, Lon=Max
    
    # Corner 0 (SW)
    c0 = latlon_to_ecef(np.radians(min_lat), np.radians(min_lon), 0, (1737400,1737400,1737400))
    print(f"Corner SW (Lat {min_lat}, Lon {min_lon}) -> ECEF {c0}")

    # Corner 1 (NE)
    c1 = latlon_to_ecef(np.radians(max_lat), np.radians(max_lon), 0, (1737400,1737400,1737400))
    print(f"Corner NE (Lat {max_lat}, Lon {max_lon}) -> ECEF {c1}")
    
    # Calculate Center
    mid_lat = (min_lat + max_lat) / 2
    mid_lon = (min_lon + max_lon) / 2
    center = latlon_to_ecef(np.radians(mid_lat), np.radians(mid_lon), 0, (1737400,1737400,1737400))
    print(f"Center (Lat {mid_lat}, Lon {mid_lon}) -> ECEF {center}")
    
    # Relative
    rel_sw = (c0[0]-center[0], c0[1]-center[1], c0[2]-center[2])
    print(f"Relative SW: {rel_sw}")
    
    # Convert back to check
    # Unswizzle Validator Logic?
    # Validator: v_ecef = (abs_c[0], -abs_c[2], abs_c[1])
    # But planet_tiler produces GLB Y=Z, Z=-Y.
    # So Validator Unswizzle REVERSES this.
    # v_ecef should match c0.
    
    print("\n--- Done ---")

if __name__ == "__main__":
    debug_tile()
