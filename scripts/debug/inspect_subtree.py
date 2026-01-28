
import struct
import json
import sys

def parse_subtree(path):
    with open(path, 'rb') as f:
        # Header
        magic = f.read(4)
        if magic != b'subt':
            print(f"Invalid Magic: {magic}")
            return

        version = struct.unpack('<I', f.read(4))[0]
        length = struct.unpack('<Q', f.read(8))[0] # 64-bit length? Specs say:
        # Version 1.0: header 24 bytes
        # magic (4), version (4), jsonByteLength (8), binaryByteLength (8) -> creating 24 bytes
        
        # Wait, standard 3D Tiles 1.1 Implicit Tiling Subtree format:
        # Magic: 'subt' (4 bytes)
        # Version: 1 (4 bytes)
        # JSON Byte Length: (8 bytes, uint64)
        # Binary Byte Length: (8 bytes, uint64)
        
        print(f"Magic: {magic}")
        print(f"Version: {version}")
        print(f"Total File Length (stat): {f.tell()}") # Just reset
        
        f.seek(8)
        json_byte_len = struct.unpack('<Q', f.read(8))[0]
        binary_byte_len = struct.unpack('<Q', f.read(8))[0]
        
        print(f"JSON Length: {json_byte_len}")
        print(f"Binary Length: {binary_byte_len}")
        
        # Read JSON
        json_bytes = f.read(json_byte_len)
        try:
            header = json.loads(json_bytes)
            print(json.dumps(header, indent=2))
        except Exception as e:
            print(f"JSON Parse Error: {e}")
            print(json_bytes)
            return

        # Buffers
        bin_start = 24 + json_byte_len
        # Read a bit of binary
        if binary_byte_len > 0:
            f.seek(bin_start)
            data = f.read(binary_byte_len)
            print(f"Binary Data ({len(data)} bytes): {data.hex()}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        parse_subtree(sys.argv[1])
    else:
        print("Usage: python inspect_subtree.py <file>")
