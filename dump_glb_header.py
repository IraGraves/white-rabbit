import struct
import json
import sys

def parse_glb(path):
    with open(path, 'rb') as f:
        magic = f.read(4)
        if magic != b'glTF':
            print("Not a GLB file")
            return
        
        version = struct.unpack('<I', f.read(4))[0]
        length = struct.unpack('<I', f.read(4))[0]
        
        print(f"GLB Version: {version}, Length: {length}")
        
        chunk_len = struct.unpack('<I', f.read(4))[0]
        chunk_type = f.read(4)
        
        if chunk_type != b'JSON':
            print(f"First chunk is not JSON: {chunk_type}")
            return
            
        json_bytes = f.read(chunk_len)
        try:
            header = json.loads(json_bytes)
            print(json.dumps(header, indent=2))
        except Exception as e:
            print(f"Failed to parse JSON: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        parse_glb(sys.argv[1])
    else:
        print("Usage: python dump_glb_header.py <file>")
