import struct
import json
import os
import sys

def parse_subtree(filepath):
    print(f"Parsing {filepath}...")
    with open(filepath, "rb") as f:
        data = f.read()
    
    # Header: magic(4s), version(I), json_len(Q), bin_len(Q)
    magic, version, json_len, bin_len = struct.unpack('<4sIQQ', data[:24])
    print(f"  Magic: {magic.decode()}")
    print(f"  Version: {version}")
    print(f"  JSON Len: {json_len}")
    print(f"  Bin Len: {bin_len}")
    
    json_bytes = data[24:24+json_len]
    header = json.loads(json_bytes.decode('utf-8'))
    print("  Header:", json.dumps(header, indent=4))
    
    # Binary body
    bin_offset = 24 + json_len
    # Pad to 8 bytes if needed (though usually already included in offsets)
    
    # Check Tile Availability
    tile_avail = header.get("tileAvailability", {})
    if "bitstream" in tile_avail:
        bv_idx = tile_avail["bitstream"]
        bv = header["bufferViews"][bv_idx]
        start = bin_offset + bv["byteOffset"]
        end = start + bv["byteLength"]
        bits = data[start:end]
        
        print(f"  Tile Availability Bits (hex): {bits.hex()}")
        
        # Interpret bits
        # Index 0: Root
        # Index 1-4: Children
        avail_count = 0
        for i in range(8): # Check first 8 nodes
            byte_idx = i // 8
            bit_idx = i % 8
            if byte_idx < len(bits):
                is_avail = (bits[byte_idx] >> bit_idx) & 1
                if is_avail: avail_count += 1
                print(f"    Node {i}: {'Available' if is_avail else 'Unavailable'}")
    elif "constant" in tile_avail:
         print(f"  Tile Availability: Constant {tile_avail['constant']}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        parse_subtree(sys.argv[1])
    else:
        # Try to find a subtree in tiles_out/subtrees/
        path = "scripts/texture-pipeline/tiles_out/subtrees"
        if os.path.exists(path):
            files = [f for f in os.listdir(path) if f.endswith(".subtree")]
            if files:
                parse_subtree(os.path.join(path, files[0]))
            else:
                print("No subtree files found.")
        else:
            print(f"Path not found: {path}")
