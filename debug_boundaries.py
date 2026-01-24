import numpy as np
import struct
import json
import os

def load_glb(path):
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
    verts = np.frombuffer(raw_bytes, dtype=np.float32).reshape(count, 3).copy()
    
    translation = gltf['nodes'][0].get('translation', [0, 0, 0])
    
    # Correct Reconstruction to ECEF
    # G_X = dx = xx - cx
    # G_Y = dz = zz - cz
    # G_Z = -dy = cy - yy
    # T = [cx, cz, -cy]
    
    gx = verts[:,0] + translation[0]
    gy = verts[:,1] + translation[1]
    gz = verts[:,2] + translation[2]
    
    ecef = np.zeros_like(verts)
    ecef[:, 0] = gx
    ecef[:, 1] = -gz # - (-yy) = yy
    ecef[:, 2] = gy # zz
    
    dim = int(np.sqrt(count))
    return ecef, dim

t_south = r"tiles_out/content/0/1_0_0.glb"
t_north = r"tiles_out/content/0/1_0_1.glb"

if os.path.exists(t_south) and os.path.exists(t_north):
    v_s, d_s = load_glb(t_south)
    v_n, d_n = load_glb(t_north)
    
    # South tile NORTH edge (r=0)
    edge_s = v_s[0:d_s]
    # North tile SOUTH edge (r=d-1)
    edge_n = v_n[(d_n-1)*d_n : d_n*d_n]
    
    print(f"South NW: {edge_s[0]}")
    print(f"North SW: {edge_n[0]}")
    
    diff = edge_s[0] - edge_n[0]
    print(f"Point 0 Diff: {diff} (Dist: {np.linalg.norm(diff):.3f}m)")
    
    # Try alternate mapping: South tile SOUTH edge (r=d-1) vs North tile NORTH edge (r=0)
    e_s_alt = v_s[(d_s-1)*d_s : d_s*d_s]
    e_n_alt = v_n[0:d_n]
    diff_alt = e_s_alt[0] - e_n_alt[0]
    print(f"Alternate (S vs N) Diff: {diff_alt} (Dist: {np.linalg.norm(diff_alt):.3f}m)")
    
    # Try Column mapping: West edge (c=0) vs East edge (c=d-1)
    e_s_col = v_s[0::d_s]
    e_n_col = v_n[d_s-1::d_s]
    diff_col = e_s_col[0] - e_n_col[0]
    print(f"Column (West vs East) Diff: {diff_col} (Dist: {np.linalg.norm(diff_col):.3f}m)")
else:
    print("Files not found.")
