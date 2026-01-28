
from osgeo import gdal
import numpy as np
import math

def s2_st_to_uv(s):
    if s >= 0.5:
        return (1.0 / 3.0) * (4.0 * s * s - 1.0)
    else:
        return (1.0 / 3.0) * (1.0 - 4.0 * (1.0 - s) * (1.0 - s))

def uv_to_s2_st(uv):
    # Inverse of s2_st_to_uv
    if uv >= 0:
        return 0.5 * math.sqrt(3.0 * uv + 1.0)
    else:
        return 1.0 - 0.5 * math.sqrt(1.0 - 3.0 * uv)

def get_face_0_pixel_from_face_1_padding(u_face1, v_face1, face0_size, face0_padding):
    # Face 1 (Front/Right) Padding (u < 0) corresponds to Face 0 (Right)
    # 1. Project Face 1 (u,v) to XYZ
    su = s2_st_to_uv(u_face1)
    sv = s2_st_to_uv(v_face1)
    
    # Face 1: x = -su, y = 1, z = sv
    x = -su
    y = 1.0
    z = sv
    
    # 2. Project onto Face 0 Plane (x = 1)
    # Divide by x (which should be positive if we are near the edge)
    # Face 0: x=1, y=su', z=sv'
    
    # Wait, Face 1 Left Edge (u=0) is x=1, y=1?
    # Face 1 u=0 -> su=-1. x=1, y=1, z=sv.
    # Face 0 Right Edge (u=1) -> su=1. x=1, y=1, z=sv.
    # They match!
    
    # Now consider Padding: u_face1 = -0.01.
    # su = s2_st_to_uv(-0.01) (approx -1.0something)
    # x = -(-1.something) = 1.something.
    # y = 1.0.
    # z = sv.
    
    # Project to Face 0 (x=1 plane).
    # Scale by 1/x.
    # x' = 1.
    # y' = y / x = 1.0 / (1.something) = 0.9something.
    # z' = z / x.
    
    # Face 0 local coords: y' = su_0, z' = sv_0.
    su_0 = y / x
    sv_0 = z / x
    
    # Convert back to u_0, v_0
    u_0 = uv_to_s2_st(su_0)
    v_0 = uv_to_s2_st(sv_0)
    
    # Convert to Pixel Coordinates on Face 0
    # u = (col - padding) / res
    # col = u * res + padding
    res = face0_size - 2 * face0_padding
    
    col_0 = u_0 * res + face0_padding
    row_0 = (1.0 - v_0) * res + face0_padding
    
    return col_0, row_0

def verify_padding():
    # Configuration matches gdalinfo
    SIZE = 16640
    PADDING = 128
    RES = SIZE - 2 * PADDING
    
    print(f"Config: Size {SIZE}, Padding {PADDING}, Res {RES}")
    
    # Load Datasets
    ds1 = gdal.Open("input/moon/moon_terrain_face1.tif")
    band1 = ds1.GetRasterBand(1)
    
    ds0 = gdal.Open("input/moon/moon_terrain_face0.tif")
    band0 = ds0.GetRasterBand(1)
    
    # We will sample a vertical line in the middle of the Left Padding of Face 1
    # Column 64 (Middle of 0-128 padding)
    check_col_1 = 64
    u_1 = (check_col_1 - PADDING) / RES # Negative
    
    print(f"\nChecking Face 1 Column {check_col_1} (u={u_1:.6f})...")
    
    # Iterate rows
    diffs = []
    
    # Use a step to scan top to bottom
    for row_1 in range(0, SIZE, 1000):
        v_1 = 1.0 - (row_1 - PADDING) / RES
        
        # Calculate where this falls on Face 0
        col_0, row_0 = get_face_0_pixel_from_face_1_padding(u_1, v_1, SIZE, PADDING)
        
        # Read Value from Face 1
        val_1 = band1.ReadAsArray(check_col_1, row_1, 1, 1)[0][0]
        
        # Read Value from Face 0 (Nearest Neighbor for now, or Bilinear better?)
        # Let's read 2x2 and interpolate for accuracy
        c0 = int(col_0)
        r0 = int(row_0)
        
        # Boundary check
        if c0 < 0 or c0 >= SIZE-1 or r0 < 0 or r0 >= SIZE-1:
            print(f"Row {row_1}: Projected off Face 0 ({col_0}, {row_0})")
            continue
            
        # Bilinear Interpolation on Face 0
        data0 = band0.ReadAsArray(c0, r0, 2, 2)
        if data0 is None: continue
        
        dx = col_0 - c0
        dy = row_0 - r0
        
        val_0 = (data0[0][0] * (1-dx) * (1-dy) +
                 data0[0][1] * dx * (1-dy) +
                 data0[1][0] * (1-dx) * dy +
                 data0[1][1] * dx * dy)
                 
        diff = val_1 - val_0
        diffs.append(abs(diff))
        
        print(f"Row {row_1:5d} | Face1: {val_1:10.2f} | Face0[{col_0:7.2f}, {row_0:7.2f}]: {val_0:10.2f} | Diff: {diff:8.2f}")

    if diffs:
        avg_diff = sum(diffs) / len(diffs)
        print(f"\nAverage Difference: {avg_diff:.2f}")
        if avg_diff < 50: # Tolerance 50 meters (given -3000km range)
            print("SUCCESS: Padding matches Neighbor geometric projection.")
        else:
            print("FAILURE: Padding does not match Neighbor.")

if __name__ == "__main__":
    verify_padding()
