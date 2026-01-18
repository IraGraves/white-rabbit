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
        
        chunk_len = struct.unpack('<I', f.read(4))[0]
        chunk_type = f.read(4) # JSON
        json_bytes = f.read(chunk_len)
        header = json.loads(json_bytes)
        
        # Binary Buffer
        bin_len = struct.unpack('<I', f.read(4))[0]
        bin_type = f.read(4) # BIN
        bin_data = f.read(bin_len)
        
        return header, bin_data

def analyze_uvs(path):
    header, bin_data = parse_glb(path)
    
    # Locate TEXCOORD_0 accessor
    mesh = header['meshes'][0]
    prim = mesh['primitives'][0]
    uv_acc_idx = prim['attributes']['TEXCOORD_0']
    
    accessor = header['accessors'][uv_acc_idx]
    buffer_view = header['bufferViews'][accessor['bufferView']]
    
    offset = buffer_view.get('byteOffset', 0) + accessor.get('byteOffset', 0)
    count = accessor['count']
    
    # Assuming float32 vec2
    uvs = []
    print(f"Reading {count} UVs from offset {offset}")
    
    for i in range(count):
        start = offset + i * 8
        u, v = struct.unpack('<ff', bin_data[start:start+8])
        uvs.append((u, v))
        
    # Check bounds
    min_u = min(u for u, v in uvs)
    max_u = max(u for u, v in uvs)
    min_v = min(v for u, v in uvs)
    max_v = max(v for u, v in uvs)
    
    print(f"U range: {min_u} - {max_u}")
    print(f"V range: {min_v} - {max_v}")
    
    # Check if we have vertices exactly on 0 and 1
    on_u0 = sum(1 for u, v in uvs if abs(u) < 0.0001)
    on_u1 = sum(1 for u, v in uvs if abs(u - 1.0) < 0.0001)
    on_v0 = sum(1 for u, v in uvs if abs(v) < 0.0001)
    on_v1 = sum(1 for u, v in uvs if abs(v - 1.0) < 0.0001)
    
    print(f"Vertices on U=0: {on_u0}")
    print(f"Vertices on U=1: {on_u1}")
    print(f"Vertices on V=0: {on_v0}")
    print(f"Vertices on V=1: {on_v1}")
    
    # Print first few UVs
    print("First 10 UVs:", uvs[:10])

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python inspect_uvs.py <path>")
    else:
        analyze_uvs(sys.argv[1])
