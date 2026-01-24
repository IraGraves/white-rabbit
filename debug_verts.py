import numpy as np
import struct
import json
import os

def read_glb_verts(path):
    with open(path, 'rb') as f:
        data = f.read()
    magic, ver, length = struct.unpack('<III', data[:12])
    c0_len, _ = struct.unpack('<II', data[12:20])
    gltf = json.loads(data[20:20+c0_len].decode('utf-8'))
    
    acc_pos = gltf['accessors'][0]
    count = acc_pos['count']
    bv = gltf['bufferViews'][acc_pos['bufferView']]
    offset = bv.get('byteOffset', 0)
    stride = bv.get('byteStride', 12)
    
    pos = 20 + c0_len
    while pos % 4 != 0: pos += 1
    bin_start = pos + 8
    
    raw_bytes = data[bin_start + offset : bin_start + offset + count * stride]
    # Handle stride manually if needed, but assume 12 for now
    verts = np.frombuffer(raw_bytes, dtype=np.float32).reshape(count, 3).copy()
    
    translation = [0,0,0]
    if 'nodes' in gltf and 'translation' in gltf['nodes'][0]:
        translation = gltf['nodes'][0]['translation']
    
    return verts, translation, count

# Tile 0/1/0/0 and 0/1/0/1
p1 = r"tiles_out/content/0/1_0_0.glb"
p2 = r"tiles_out/content/0/1_0_1.glb"

for p in [p1, p2]:
    if not os.path.exists(p):
        print(f"NOT FOUND: {p}")
        continue
    v, t, c = read_glb_verts(p)
    print(f"FILE: {p}")
    print(f"  Count: {c}")
    print(f"  Translation (GLTF): {t}")
    # Unswizzle to ECEF as in check_borders.py
    # G_X = ECEF_X - cx
    # G_Y = ECEF_Z - cz
    # G_Z = cy - ECEF_Y
    # Node Translation = [cx, cz, -cy]
    
    # Global = Local + Translation
    gx = v[:,0] + t[0]
    gy = v[:,1] + t[1]
    gz = v[:,2] + t[2]
    
    # Unswizzle back to ECEF
    ecef_x = gx
    ecef_y = -gz # -( -ECEF_Y ) = ECEF_Y
    ecef_z = gy
    
    mags = np.linalg.norm(np.stack((ecef_x, ecef_y, ecef_z), axis=-1), axis=1)
    print(f"  Mag range: {np.min(mags):.1f} - {np.max(mags):.1f}")
    print(f"  Sample ECEF[0]: {ecef_x[0]:.1f}, {ecef_y[0]:.1f}, {ecef_z[0]:.1f}")
    
    # Local Mags
    loc_mags = np.linalg.norm(v, axis=1)
    print(f"  Local Mag range: {np.min(loc_mags):.1f} - {np.max(loc_mags):.1f}")
