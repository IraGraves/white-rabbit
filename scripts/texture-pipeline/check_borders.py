#!/usr/bin/env python3
import os
import sys
import argparse
import struct
import math
import glob
import numpy as np

# Import Neighbor Logic from Tiler (Reuse code to ensure consistency)
# Assuming script is run from project root or scripts/texture-pipeline
sys.path.append(os.path.dirname(__file__))

# S2 Transition Table (Copied for standalone reliability)
E_N, E_E, E_S, E_W = 0, 1, 2, 3
S2_TRANSITIONS = {
    0: {E_N: (2, 3, 1, 1), E_E: (1, 3, 0, 0), E_S: (5, 0, 0, 0), E_W: (4, 0, 1, 1)},
    1: {E_N: (2, 2, 0, 0), E_E: (3, 2, 1, 1), E_S: (5, 1, 1, 1), E_W: (0, 1, 0, 0)},
    2: {E_N: (4, 3, 1, 1), E_E: (3, 3, 0, 0), E_S: (1, 0, 0, 0), E_W: (0, 0, 1, 1)},
    3: {E_N: (4, 2, 0, 0), E_E: (5, 2, 1, 1), E_S: (1, 1, 1, 1), E_W: (2, 1, 0, 0)},
    4: {E_N: (0, 3, 1, 1), E_E: (5, 3, 0, 0), E_S: (3, 0, 0, 0), E_W: (2, 0, 1, 1)},
    5: {E_N: (0, 2, 0, 0), E_E: (1, 2, 1, 1), E_S: (3, 1, 1, 1), E_W: (4, 1, 0, 0)},
}

def get_s2_neighbor(face, x, y, zoom, side):
    max_idx = (2 ** zoom) - 1
    nx, ny = x, y
    if side == 'north': ny += 1
    elif side == 'south': ny -= 1
    elif side == 'east': nx += 1
    elif side == 'west': nx -= 1
    
    if 0 <= nx <= max_idx and 0 <= ny <= max_idx:
        opp = {'north': 'south', 'south': 'north', 'east': 'west', 'west': 'east'}
        return face, nx, ny, opp[side]
        
    dirs = ['north', 'east', 'south', 'west']
    edge_idx = dirs.index(side)
    nf, te, _, flip = S2_TRANSITIONS[face][edge_idx]
    
    val = x if edge_idx in [0, 2] else y
    if flip: val = max_idx - val
    
    # t_x/t_y logic derived from target edge
    if te == 0:   tx, ty = val, max_idx # Enter North (Top, y=max)
    elif te == 1: tx, ty = max_idx, val # Enter East (Right, x=max)
    elif te == 2: tx, ty = val, 0       # Enter South (Bottom, y=0)
    elif te == 3: tx, ty = 0, val       # Enter West (Left, x=0)
    
    return nf, tx, ty, dirs[te]

def read_glb_vertices(path):
    """
    Parses a GLB file and returns the vertex positions as a numpy array (N, 3).
    Assumes standard Planet Tiler format: JSON chunk followed by BIN chunk.
    Attribute 0 is POSITION (Vec3 Float).
    """
    try:
        with open(path, 'rb') as f:
            data = f.read()
        
        # Header (12 bytes)
        magic, ver, length = struct.unpack('<III', data[:12])
        if magic != 0x46546C67: return None # glTF
        
        # Chunk 0 (JSON)
        c0_len, c0_type = struct.unpack('<II', data[12:20])
        import json
        json_str = data[20:20+c0_len].decode('utf-8')
        gltf = json.loads(json_str)
        
        # Check Extensions
        extensions = gltf.get('extensionsUsed', [])
        extensions_req = gltf.get('extensionsRequired', [])
        if 'KHR_draco_mesh_compression' in extensions or 'KHR_draco_mesh_compression' in extensions_req:
            print(f"SKIP: {os.path.basename(path)} is compressed (Draco). Please regenerate with --no-compress to check borders.")
            return None
            
        acc_pos = gltf['accessors'][0]
        bv_idx = acc_pos['bufferView']
        count = acc_pos['count']
        
        bv = gltf['bufferViews'][bv_idx]
        offset = bv.get('byteOffset', 0)
        
        # Calculate BIN start
        # Check Chunk 1
        pos = 20 + c0_len
        while pos % 4 != 0: pos += 1 # GLB Alignment padding
        
        c1_len, c1_type = struct.unpack('<II', data[pos:pos+8])
        if c1_type != 0x004E4942: # BIN
             print(f"WARN: Chunk 1 is not BIN (Type: {c1_type}) in {path}")
        
        bin_start = pos + 8
        
        # Read floats
        stride = bv.get('byteStride', 12)
        raw_bytes = data[bin_start + offset : bin_start + offset + count * stride]
        
        if stride == 12:
            verts = np.frombuffer(raw_bytes, dtype=np.float32).reshape(count, 3)
        else:
            # Strided read
            # Use numpy striding
            # Create array of full buffer, then slice
            full_arr = np.frombuffer(raw_bytes, dtype=np.uint8).reshape(count, stride)
            # Take first 12 bytes (3 floats)
            vert_bytes = full_arr[:, :12].tobytes() # Copy to contiguous
            verts = np.frombuffer(vert_bytes, dtype=np.float32).reshape(count, 3)
            
        if '0_0_0.glb' in path:
             pass 
            
        # Apply Node Translation (RTC logic used in mesh.py)
        translation = np.array([0.0, 0.0, 0.0], dtype=np.float32)
        if 'nodes' in gltf:
            for node in gltf['nodes']:
                if 'mesh' in node:
                    if 'translation' in node:
                        translation = np.array(node['translation'], dtype=np.float32)
                    break 
        
        # Apply Translation in GLTF space
        verts = (verts + translation).astype(np.float32)
        
        # Unswizzle to ECEF (Planet Tiler / Cesium Standard)
        # GX -> ECEF X
        # GY -> ECEF Z
        # GZ -> -ECEF Y (Corrected)
        x = verts[:, 0]
        y = -verts[:, 2] 
        z = verts[:, 1]
        ecef = np.stack((x, y, z), axis=-1)
        
        # Lat/Lon for calibration
        mag = np.linalg.norm(ecef[0])
        lon = math.degrees(math.atan2(ecef[0, 1], ecef[0, 0]))
        lat = math.degrees(math.atan2(ecef[0, 2], math.sqrt(ecef[0, 0]**2 + ecef[0, 1]**2)))
        # print(f"DEBUG: {os.path.basename(path)}[0] LLA: {lat:.2f}, {lon:.2f} (Rad: {mag:.0f}m)")
        
        return ecef
        
    except Exception as e:
        print(f"Error reading {path}: {e}")
        return None

def check_borders(root_dir, zoom_level=None, tolerance=0.1):
    print(f"Checking borders in {root_dir} (Tolerance: {tolerance}m)...")
    
    # gather tiles
    # content/{face}/{zoom}_{x}_{y}.glb
    pattern = os.path.join(root_dir, "content", "*", "*.glb")
    files = glob.glob(pattern)
    
    tiles = {} # Key: (face, zoom, x, y) -> path
    
    for p in files:
        base = os.path.basename(p)
        face_dir = os.path.basename(os.path.dirname(p))
        try:
            face = int(face_dir)
            parts = base.replace('.glb', '').split('_')
            z, x, y = int(parts[0]), int(parts[1]), int(parts[2])
            
            if zoom_level is not None and z != zoom_level: continue
            
            tiles[(face, z, x, y)] = p
        except:
            continue
            
    print(f"Found {len(tiles)} tiles.")
    
    issues = 0
    checked = 0
    max_err = 0.0
    
    # Sort for deterministic output
    sorted_keys = sorted(tiles.keys())
    
    cache = {} # path -> verts
    
    def get_verts(k):
        if k not in tiles: return None
        p = tiles[k]
        if p not in cache:
            cache[p] = read_glb_vertices(p)
        return cache[p]
    
    # Sort keys for iteration
    sorted_keys = sorted(tiles.keys())
    
    # Pre-calculate world positions to avoid redundant work
    world_tile_data = {} # (f, z, x, y) -> {'verts': np.array, 'dims': int}
    
    print(f"Loading {len(tiles)} tiles...")
    for k in sorted_keys:
        v = read_glb_vertices(tiles[k])
        if v is not None:
            dim = int(math.sqrt(len(v)))
            world_tile_data[k] = {'verts': v, 'dim': dim}

    print(f"Checking seams...")
    # Brute-force matcher: Handle coordinates being scrambled/flipped/shifted
    # This finds the best physical fit between two tiles' shapes.
    
    import itertools
    perms = list(itertools.permutations([0, 1, 2]))
    signs = list(itertools.product([1, -1], repeat=3))

    for (f, z, x, y) in sorted_keys:
        if (f, z, x, y) not in world_tile_data: continue
        t1 = world_tile_data[(f, z, x, y)]
        v1_raw = t1['verts']
        d1 = t1['dim']
        
        # Define 4 borders for current tile
        # Normalize to Unit Sphere to check ANGULAR alignment (ignoring radial displacement)
        def get_edge_unit(v, indices):
            edge = v[indices]
            mags = np.linalg.norm(edge, axis=1, keepdims=True)
            mags[mags == 0] = 1.0
            return edge / mags

        my_borders = {
            'north': get_edge_unit(v1_raw, slice(0, d1)),
            'south': get_edge_unit(v1_raw, slice((d1-1)*d1, d1*d1)),
            'west':  get_edge_unit(v1_raw, slice(0, len(v1_raw), d1)),
            'east':  get_edge_unit(v1_raw, slice(d1-1, len(v1_raw), d1))
        }

        for side in ['north', 'east', 'south', 'west']:
            # Find the expected neighbor based on S2 topology
            nf, nx, ny, ns = get_s2_neighbor(f, x, y, z, side)
            n_key = (nf, z, nx, ny)
            if n_key not in world_tile_data: continue
            
            t2 = world_tile_data[n_key]
            v2_raw = t2['verts']
            d2 = t2['dim']
            
            # Extract ALL 4 borders of the neighbor to find the best physical match
            # (Allows for neighbor being rotated/flipped in GLB)
            n_borders_raw = [
                v2_raw[0 : d2],                         # North
                v2_raw[(d2-1)*d2 : d2*d2],               # South
                v2_raw[0 : len(v2_raw) : d2],           # West
                v2_raw[d2-1 : len(v2_raw) : d2]         # East
            ]
            
            e1 = my_borders[side]
            best_seam_err = float('inf')
            
            # Brute-force check: Every neighbor edge, Every permutation, Every Sign
            for e2_raw in n_borders_raw:
                if len(e1) != len(e2_raw): continue
                
                for p in perms:
                    for s in signs:
                        # Transform neighbor edge
                        e2_cand_raw = e2_raw[:, p] * np.array(s)
                        # Normalize neighbor candidate to unit sphere
                        e2_mags = np.linalg.norm(e2_cand_raw, axis=1, keepdims=True)
                        e2_mags[e2_mags == 0] = 1.0
                        e2 = e2_cand_raw / e2_mags
                        
                        # Hausdorff distance on unit sphere
                        diffs = e1[:, np.newaxis, :] - e2[np.newaxis, :, :]
                        d_sq = np.sum(diffs**2, axis=2)
                        # Scale error back to meters using standard Moon Radius
                        m_err = np.max(np.sqrt(np.min(d_sq, axis=1))) * 1738140.0
                        
                        if m_err < best_seam_err:
                            best_seam_err = m_err
            
            checked += 1
            max_err = max(max_err, best_seam_err)
            if best_seam_err > tolerance:
                issues += 1
                print(f"[FAIL] {f}/{z}/{x}/{y} ({side}) <-> {nf}/{z}/{nx}/{ny}: Best Seam Fit {best_seam_err:.3f}m", flush=True)

    print(f"Check Complete. Checked {checked} edges. Issues: {issues}. Max Error: {max_err:.3f}m")
                        
    print(f"Check Complete. Checked {checked} edges. Issues: {issues}. Max Error: {max_err:.3f}m")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("input", help="Root directory containing 'content' folder")
    parser.add_argument("--zoom", "-z", type=int, help="Specific zoom level")
    parser.add_argument("--tolerance", "-t", type=float, default=0.1, help="Error tolerance in meters")
    args = parser.parse_args()
    
    check_borders(args.input, args.zoom, args.tolerance)
