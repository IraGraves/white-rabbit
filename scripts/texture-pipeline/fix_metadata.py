import argparse
import sys
import os
from osgeo import gdal, osr

# Enable exceptions (fixes FutureWarning)
gdal.UseExceptions()

def fix_metadata(file_path, rx, ry, rz):
    print(f"Opening file: {file_path}")
    print(f"Applying Radii: X={rx}, Y={ry}, Z={rz}")

    if not os.path.exists(file_path):
        print(f"[ERROR] File not found: {file_path}")
        sys.exit(1)

    # Open in Update mode
    ds = gdal.Open(file_path, gdal.GA_Update)
    if not ds:
        print(f"[ERROR] Could not open file: {file_path}")
        sys.exit(1)

    try:
        # Construct Custom CRS
        srs = osr.SpatialReference()
        srs.ImportFromEPSG(4326) # Start with WGS84 base
        
        # Calculate inverse flattening
        # Note: GDAL/WKT1 typically supports SemiMajor (A) and SemiMinor (B)
        # We map Rx -> A, Rz -> B
        inv_f = 0
        if abs(rx - rz) > 0.001:
            inv_f = rx / (rx - rz)
            srs.SetGeogCS("Custom Body", "Custom Datum", "Custom Ellipsoid", rx, inv_f)
        else:
             # Sphere
             srs.SetGeogCS("Custom Body", "Custom Datum", "Custom Ellipsoid", rx, 0)

        wkt = srs.ExportToWkt()
        print(f"Generated WKT with A={rx}, B={rz}")
        
        # Apply
        ds.SetProjection(wkt)
        print("[SUCCESS] Metadata updated successfully.")
        
    except Exception as e:
        print(f"[ERROR] Failed to update metadata: {e}")
    finally:
        ds = None # Save and close

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--file", required=True, help="Path to the file to update")
    parser.add_argument("--rx", type=float, required=True, help="Radius X")
    parser.add_argument("--ry", type=float, required=True, help="Radius Y")
    parser.add_argument("--rz", type=float, required=True, help="Radius Z")
    args = parser.parse_args()

    fix_metadata(args.file, args.rx, args.ry, args.rz)
