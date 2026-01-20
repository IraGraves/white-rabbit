
import numpy as np
from osgeo import gdal

# S2 Math Ports
def face_uv_to_xyz(face, u, v):
    # u, v in [0, 1]
    # Map u,v to s,t in [-1, 1]
    s = 2 * u - 1
    t = 2 * v - 1
    
    # Face mapping
    if face == 0: return np.array([1, -s, -t])  # 0: Front? Usually +X
    if face == 1: return np.array([s, 1, -t])   # 1: Right? +Y
    if face == 2: return np.array([-s, -t, 1])  # 2: Top? +Z
    if face == 3: return np.array([-1, -t, -s]) # 3: Back? -X (Note: S/T swaps vary)
    if face == 4: return np.array([-t, -1, -s]) # 4: Left? -Y
    if face == 5: return np.array([-t, s, -1])  # 5: Bottom? -Z
    
    # NOTE: The above mapping is a guess. We need to match utils.py exactly.
    # Let's import utils.py instead of guessing.
    pass

import sys
import os

# Create a temporary utils importer if needed, or just copy the function
# Inspecting utils.py content from previous turns:
# s2_face_uv_to_xyz_vec is there.

def get_xyz(face, u, v):
    # Face 0: (1, -u', -v') where u' = 2*u-1
    # Check utils.py via read? No, let's implement standard S2.
    # Face 0 (0,0) -> (1, 1, 1)? No.
    # Standard S2 (Cube to Sphere):
    #  0: YZ plane x=1. u->y? v->z?
    #  Wait, Face 0 East (u=1) -> Face 1 West (u=0).
    #  Face 0 (1, ?) -> Face 1 (-1, ?)?
    
    # Let's rely on the assumption that Face 0 East touches Face 1 West.
    return

def audit():
    # Load Files
    f0_path = "input/moon/moon_terrain_face0.tif"
    f1_path = "input/moon/moon_terrain_face1.tif"
    
    ds0 = gdal.Open(f0_path)
    ds1 = gdal.Open(f1_path)
    
    # Overview 5 (260x260)
    ov0 = ds0.GetRasterBand(1).GetOverview(5)
    ov1 = ds1.GetRasterBand(1).GetOverview(5)
    
    w0 = ov0.XSize
    h0 = ov0.YSize
    w1 = ov1.XSize
    h1 = ov1.YSize
    
    print(f"Overview Size: {w0}x{h0}")
    
    # Row 210
    row = 210
    
    # Read Row Values
    # Face 0 Right Edge: Last 10 pixels
    # Indices 250..259
    row0 = ov0.ReadAsArray(0, row, w0, 1)[0]
    # Face 1 Left Edge: First 10 pixels
    # Indices 0..9
    row1 = ov1.ReadAsArray(0, row, w1, 1)[0]
    
    print(f"\n--- Row {row} Value Analysis ---")
    print(f"Face 0 (Right Edge, Pix {w0-5}..{w0-1}):")
    print(row0[-5:])
    print(f"Face 1 (Left Edge, Pix 0..4):")
    print(row1[:5])
    
    # Check correlation
    # Face 0: ... -3.3M, -1.9M, -0.6M, -0.5M (Edge)
    # Face 1: -3.8M, -2.2M, -0.5M, ...
    
    # It looks like Face 1 Col 2 (-0.5M) aligns with Face 0 Col 259 (-0.5M).
    val_f0_edge = row0[-1] # Pixel 259
    val_f1_col2 = row1[2]  # Pixel 2
    
    print(f"\nPotential Match:")
    print(f"F0[-1] ({val_f0_edge}) vs F1[2] ({val_f1_col2})")
    print(f"Diff: {abs(val_f0_edge - val_f1_col2)}")
    
    # If F1 Col 2 is the start of valid data (matching F0 Edge),
    # Then F1 Col 0 corresponds to F0 Col 257?
    val_f0_257 = row0[-3] # Pixel 257
    val_f1_0   = row1[0]  # Pixel 0
    
    print(f"Padding Check (2px shift):")
    print(f"F0[-3] ({val_f0_257}) vs F1[0] ({val_f1_0})")
    print(f"Diff: {abs(val_f0_257 - val_f1_0)}")
    
    # Shift check
    # Try to find best offset for Face 1 array in Face 0 array
    # Search F0[-10:] vs F1[0:5]
    
    print("\nPattern Match Search:")
    f0_segment = row0[-10:] # Last 10
    f1_segment = row1[:5]   # First 5
    
    for offset in range(-5, 5):
        # Shift F1 by offset relative to F0 Edge
        # If offset = 0, F1[0] aligns with F0 Edge+1 (Phantom)
        # If offset = -2, F1[2] aligns with F0 Edge (F0[-1])
        pass 

if __name__ == "__main__":
    audit()
