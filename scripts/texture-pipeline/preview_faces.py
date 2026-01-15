import os
import sys
from osgeo import gdal
import numpy as np
from PIL import Image

def generate_preview(prefix, output_path="faces_preview.png"):
    """Generates a 2x3 grid preview of the 6 S2 faces."""
    previews = []
    
    print(f"Generating preview for prefix: {prefix}")
    
    for face in range(6):
        path = f"{prefix}_face{face}.tif"
        if not os.path.exists(path):
            print(f"Error: Face {face} not found at {path}")
            return
            
        ds = gdal.Open(path)
        if not ds:
            print(f"Error: Could not open {path}")
            return
            
        # Read a low-res version (e.g., 512x512)
        w, h = ds.RasterXSize, ds.RasterYSize
        thumb_w, thumb_h = 512, 512
        
        data = ds.ReadAsArray(0, 0, w, h, buf_xsize=thumb_w, buf_ysize=thumb_h, 
                             resample_alg=gdal.GRIORA_Bilinear)
        
        # Convert to HWC (Height, Width, Channels)
        if data.ndim == 3:
            data = data.transpose(1, 2, 0)
            
        previews.append(data)
        ds = None

    # Stack into 2x3 grid
    # [Face 0, Face 1, Face 2]
    # [Face 3, Face 4, Face 5]
    row1 = np.hstack(previews[0:3])
    row2 = np.hstack(previews[3:6])
    grid = np.vstack([row1, row2])
    
    img = Image.fromarray(grid)
    img.save(output_path)
    print(f"Success! Preview saved to {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python preview_faces.py <prefix> [output_path]")
    else:
        prefix = sys.argv[1]
        out_path = sys.argv[2] if len(sys.argv) > 2 else f"{prefix}_preview.png"
        generate_preview(prefix, out_path)
