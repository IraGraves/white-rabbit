
import sys
import os
import struct
import json

# Add tiler path
sys.path.append(os.path.abspath('scripts/texture-pipeline/tiler'))

from implicit_tiling import BinarySubtreeEncoder

def test():
    encoder = BinarySubtreeEncoder()
    
    # Mock data: Level 0 root tile with metadata
    all_meta = {
        0: { "0_0": { "minHeight": 10.0, "maxHeight": 100.0, "occPoint": [1, 2, 3] } }
    }
    
    # Generate subtree (height 4)
    data = encoder.generate_subtree(0, 0, 0, 4, all_meta, bake_metadata=True, debug=True)
    
    print(f"Generated data size: {len(data)} bytes")
    
    # Check Magic
    magic = data[0:4]
    print(f"Magic: {magic}")
    
    # Check Header
    version, json_len, bin_len = struct.unpack('<IQQ', data[4:24])
    print(f"Version: {version}, JSON Len: {json_len}, Bin Len: {bin_len}")
    
    # Check JSON
    json_bytes = data[24:24+json_len]
    header = json.loads(json_bytes.decode('utf-8'))
    print("Header JSON keys:", header.keys())
    if "propertyTables" in header:
        print("Property Tables found!")
    else:
        print("Property Tables MISSING!")

if __name__ == "__main__":
    test()
