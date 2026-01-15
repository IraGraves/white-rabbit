import struct
import json
import sys

def inspect_data(path):
    with open(path, 'rb') as f:
        # 1. Read Header
        magic = f.read(4)
        version = struct.unpack('<I', f.read(4))[0]
        length = struct.unpack('<I', f.read(4))[0]
        
        chunk_len = struct.unpack('<I', f.read(4))[0]
        chunk_type = f.read(4)
        json_bytes = f.read(chunk_len)
        header = json.loads(json_bytes)
        
        # 2. Find Position Accessor
        pos_acc_idx = header['meshes'][0]['primitives'][0]['attributes']['POSITION']
        pos_acc = header['accessors'][pos_acc_idx]
        bv_idx = pos_acc['bufferView']
        bv = header['bufferViews'][bv_idx]
        
        offset = bv.get('byteOffset', 0)
        length = bv['byteLength']
        
        print(f"Position Accessor: {pos_acc}")
        print(f"BufferView: {bv}")
        
        # 3. Read Binary Chunk
        # File offset = 12 (header) + 8 (json chunk header) + json_len + 8 (bin chunk header)
        bin_start = 12 + 8 + chunk_len + 8
        
        f.seek(bin_start + offset)
        
        # Read first 5 vertices (3 floats each = 12 bytes)
        print("\n--- First 5 Vertices (Floats) ---")
        for i in range(5):
            data = f.read(12)
            if len(data) < 12: break
            x, y, z = struct.unpack('<fff', data)
            print(f"v{i}: {x:.4f}, {y:.4f}, {z:.4f}")
            
        print("\n--- Min/Max from Header ---")
        print("Min:", pos_acc.get('min'))
        print("Max:", pos_acc.get('max'))

if __name__ == "__main__":
    try:
        inspect_data(sys.argv[1])
    except Exception as e:
        print(e)
