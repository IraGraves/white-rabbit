import os
import sys
from osgeo import gdal
import numpy as np
from PIL import Image

def generate_preview(prefix, output_path="faces_preview.png"):
    """Generates a 3x2 grid preview of the 6 S2 faces, preferably from a VRT."""
    
    # Updated Logic: Check for individual VRTs first (New Pipeline), then TIFs (Old Pipeline)
    
    previews = []
    use_vrts = False
    
    # Check if Face 0 VRT exists
    if os.path.exists(f"{prefix}_face0.vrt"):
        use_vrts = True
        print(f"Detected Padded VRT pipeline. Generating previews from VRTs...")
    else:
        print(f"VRTs not found. Fallback to individual TIFFs...")

    for face in range(6):
        # Source File
        if use_vrts:
            path = f"{prefix}_face{face}.vrt"
        else:
            path = f"{prefix}_face{face}.tif"
            
        if not os.path.exists(path):
            print(f"Error: Face {face} source not found at {path}")
            return
            
        ds = gdal.Open(path)
        if not ds:
            print(f"Error: Could not open {path}")
            return
            
        # Read a low-res version (e.g., 512x512)
        w, h = ds.RasterXSize, ds.RasterYSize
        thumb_w, thumb_h = 512, 512
        
        # Determine strict S2 size if VRT (remove padding visually? or show it?)
        # User probably wants to see the padding to verify it works.
        # So we read the whole VRT.
        
        data = ds.ReadAsArray(0, 0, w, h, buf_xsize=thumb_w, buf_ysize=thumb_h, 
                             resample_alg=gdal.GRIORA_Bilinear)
        
        # Convert to HWC (Height, Width, Channels)
        if data.ndim == 3:
            data = data.transpose(1, 2, 0)
            
        # Handle Float data (common for DEMs)
        if data.dtype == np.float32 or data.dtype == np.float64:
            d_min = np.nanmin(data)
            d_max = np.nanmax(data)
            if d_max > d_min:
                data = 255 * (data - d_min) / (d_max - d_min)
            data = np.nan_to_num(data).astype(np.uint8)
        
        # Handle 1-channel (Grayscale) -> RGB for consistency if creating a grid
        if data.ndim == 2:
             data = np.stack((data,)*3, axis=-1)
        elif data.shape[2] == 1:
             data = np.concatenate((data,)*3, axis=2)
             
        previews.append(data)
        
        # Save individual preview
        face_img = Image.fromarray(data)
        face_preview_path = f"{prefix}_preview_face{face}.png"
        face_img.save(face_preview_path)
        print(f"Saved individual preview: {face_preview_path}")
        
        ds = None

    # Stack into 3x2 grid (Face 0,1,2 / 3,4,5)
    row1 = np.hstack(previews[0:3])
    row2 = np.hstack(previews[3:6])
    grid = np.vstack([row1, row2])
    
    img = Image.fromarray(grid)
    img.save(output_path)
    print(f"Success! Combined preview saved to {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python preview_faces.py <prefix> [output_path]")
    else:
        prefix = sys.argv[1]
        out_path = sys.argv[2] if len(sys.argv) > 2 else f"{prefix}_preview.png"
        generate_preview(prefix, out_path)
