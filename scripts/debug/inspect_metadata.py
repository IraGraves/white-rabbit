import os
from osgeo import gdal
import sys

def inspect(path):
    ds = gdal.Open(path)
    if not ds:
        print(f"Failed to open {path}")
        return

    print(f"--- Metadata for {os.path.basename(path)} ---")
    meta = ds.GetMetadata()
    for k, v in meta.items():
        print(f"{k}: {v}")

    print("\n--- Image Structure ---")
    struct = ds.GetMetadata("IMAGE_STRUCTURE")
    if struct:
        for k, v in struct.items():
            print(f"{k}: {v}")

    padding = ds.GetMetadataItem("S2_PADDING")
    print(f"\nDirect GetMetadataItem('S2_PADDING'): {padding}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python inspect_metadata.py <tif_path>")
    else:
        inspect(sys.argv[1])
