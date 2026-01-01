# Example prompt for Moon: python convert_global_map.py --input lroc_color_16bit_srgb_4k.tif --output moon_global_color_4k.ktx2

import os
import sys
import argparse
import subprocess
import shutil
from PIL import Image

# Remove limit for huge images
Image.MAX_IMAGE_PIXELS = None

def convert_global_map(input_path, output_path):
    # 1. Pre-checks
    if not os.path.exists(input_path):
        print(f"[ERROR] Input file not found: {input_path}")
        return

    if not shutil.which("toktx"):
        print("[ERROR] 'toktx' not found.")
        print("Please install the KTX-Software.")
        return

    output_dir = os.path.dirname(os.path.abspath(output_path))
    temp_file = os.path.join(output_dir, "temp_conversion_8bit.png")

    print(f"--- Universal Global Map Converter (High Compression) ---")
    print(f"Input:  {input_path}")
    print(f"Output: {output_path}")

    try:
        # Step 2: Preparation
        print("1. Converting image data to 8-Bit RGB (stripping metadata)...")
        with Image.open(input_path) as img:
            img_8bit = img.convert('RGB')
            # Remove ICC profile to avoid toktx errors
            img_8bit.info = {} 
            img_8bit.save(temp_file)

        # Step 3: Create KTX2 (ETC1S Mode)
        print("2. Generating KTX2 (ETC1S/BasisLZ) with Mipmaps...")
        
        # --- NEW COMMAND FOR SMALLER FILE SIZE ---
        cmd = [
            "toktx",
            "--t2",
            
            # Switch to ETC1S (BasisLZ). Much smaller than UASTC.
            "--encode", "etc1s", 
            
            # Compression Level (0-5). 5 = Slowest processing but smallest file.
            "--clevel", "5", 
            
            # Quality Level (1-255). 255 = Best visual quality for ETC1S.
            "--qlevel", "255",
            
            "--genmipmap", 
            "--assign_oetf", "srgb", 
            output_path,
            temp_file
        ]

        subprocess.run(cmd, check=True)
        
        # Check new file size
        size_mb = os.path.getsize(output_path) / (1024 * 1024)
        print(f"\n[SUCCESS] File created: {output_path}")
        print(f"New File Size: {size_mb:.2f} MB")

    except subprocess.CalledProcessError as e:
        print(f"\n[ERROR] 'toktx' failed execution.")
    except Exception as e:
        print(f"\n[ERROR] A general error occurred: {e}")
    
    finally:
        # Step 4: Cleanup
        if os.path.exists(temp_file):
            try:
                os.remove(temp_file)
            except:
                pass

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Converts global textures to small KTX2 files.")
    parser.add_argument("--input", required=True, help="Path to source file")
    parser.add_argument("--output", required=True, help="Path to destination file")
    
    args = parser.parse_args()
    convert_global_map(args.input, args.output)