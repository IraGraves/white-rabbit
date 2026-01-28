import subprocess
import os
import sys

# Configuration - use relative paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
INPUT_FILE = os.path.join(SCRIPT_DIR, "..", "texture-pipeline", "input", "moon", "moon_wac_global_500m.tif")
OUTPUT_PREFIX = "debug_output"
# Find the actual input file from user context or guess
# User's index.html default: C:/path/to/large_map.tif

# Let's try to find a TIF file in the workspace to test with
# Or just run the preprocessor with help to see if it runs

def run_debug():
    print("Running s2_preprocessor debug...")
    
    # Check if executable exists
    exe_path = r"scripts\texture-pipeline\s2_preprocessor.exe"
    if not os.path.exists(exe_path):
        print(f"ERROR: {exe_path} not found. Did compilation succeed?")
        return

    # Run with minimal args
    # Usage: s2_preprocessor <input.tif> <output_prefix> <max_zoom> [tile_size] ...
    
    # We need a dummy input file if we don't have one.
    # Create a dummy TIF?
    
    print("Checking for input file...")
    # I'll just ask the user to run this with their file, or I can try to run it on a dummy.
    
    cmd = [exe_path]
    print(f"Executing: {' '.join(cmd)}")
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True)
        print("STDOUT:", result.stdout)
        print("STDERR:", result.stderr)
        print("Return Code:", result.returncode)
    except Exception as e:
        print(f"Execution failed: {e}")

if __name__ == "__main__":
    run_debug()
