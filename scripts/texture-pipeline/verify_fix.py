import sys
import os
from unittest.mock import MagicMock

# Add script dir to path
sys.path.append(r"c:\Users\Bernhard\.gemini\antigravity\scratch\white-rabbit\scripts\texture-pipeline")

from tiler.orchestration import TilerOrchestrator

# Mock args
args = MagicMock()
args.dem_file = "my_image_face0.vrt"
args.color_file = "my_color_face2.tif" # Test mixed behavior just in case

# Mock radii
radii = (1000, 1000, 1000)

print("--- Testing TilerOrchestrator Prefix Logic ---")
try:
    orch = TilerOrchestrator(args, radii)
    print(f"DEM Input: {args.dem_file}")
    print(f"DEM Prefix: '{orch.dem_prefix}'")
    
    expected_dem = "my_image"
    if orch.dem_prefix == expected_dem:
        print("PASS: DEM Prefix matches expectation.")
    else:
        print(f"FAIL: Expected '{expected_dem}', got '{orch.dem_prefix}'")

    print(f"Color Input: {args.color_file}")
    print(f"Color Prefix: '{orch.col_prefix}'")
    
    expected_col = "my_color"
    if orch.col_prefix == expected_col:
        print("PASS: Color Prefix matches expectation.")
    else:
        print(f"FAIL: Expected '{expected_col}', got '{orch.col_prefix}'")

except Exception as e:
    print(f"CRASH: {e}")
