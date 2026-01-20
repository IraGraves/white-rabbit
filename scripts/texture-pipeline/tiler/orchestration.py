import os
import time
import json
import math
import traceback
import shutil
import concurrent.futures
from osgeo import gdal
from .utils import log, inspect_file
from .mesh import create_glb_s2
from .json_generators import generate_s2_json
import numpy as np

# Global variables for worker processes
proc_ds_dem = None
proc_ds_col = None
proc_ds_dem_faces = None
proc_ds_col_faces = None

# S2 Face Adjacency and Coordinate Transition
# Structure: FACE -> EDGE_IDX -> (NEXT_FACE, NEXT_EDGE_IDX, SWAP_XY, FLIP_AXIS)
# Edge Indices: 0:North, 1:East, 2:South, 3:West
# Result tells us which edge of the neighbor we are entering.
# Example: 0(N) -> 2(W). We exit Face 0 North, enter Face 2 West.

# EDGE CONSTANTS
E_N = 0
E_E = 1
E_S = 2
E_W = 3

# Transition Table (Verified via check_s2_edges_debug.py with CORRECTED Edge Definitions v=0 South, v=1 North)
# Transition Table (Verified via generate_transitions_v2.py)
# Structure: FACE -> EDGE_IDX -> (NEXT_FACE, NEXT_EDGE_IDX, SWAP_XY, FLIP_AXIS)
# E_N=0, E_E=1, E_S=2, E_W=3
# Orientation: North (v=1), East (u=1), South (v=0), West (u=0)
S2_TRANSITIONS = {
    0: {
        E_N: (2, 3, True, True),   # -> 2 E_W
        E_E: (1, 3, False, False), # -> 1 E_W
        E_S: (5, 0, False, False), # -> 5 E_N (FIXED: Was 5,1,True,True)
        E_W: (4, 0, True, True),   # -> 4 E_N (Corrected from 4,1)
    },
    1: {
        E_N: (2, 2, False, False), # -> 2 E_S
        E_E: (3, 3, False, False), # -> 3 E_W
        E_S: (5, 0, False, False), # -> 5 E_N
        E_W: (0, 1, False, False), # -> 0 E_E
    },
    2: {
        E_N: (4, 3, True, True),   # -> 4 E_W
        E_E: (3, 0, True, True),   # -> 3 E_N (Previously 3,3? Let's check logic)
        E_S: (1, 0, False, False), # -> 1 E_N
        E_W: (0, 0, True, True),   # -> 0 E_N
    },
    3: {
        E_N: (4, 2, False, False), # -> 4 E_S
        E_E: (5, 2, True, True),   # -> 5 E_S
        E_S: (1, 1, True, True),   # -> 1 E_E
        E_W: (2, 1, False, False), # -> 2 E_E
    },
    4: {
        E_N: (0, 3, True, True),   # -> 0 E_W (Matches 0->4N)
        E_E: (5, 3, False, False), # -> 5 E_W
        E_S: (3, 0, False, False), # -> 3 E_N
        E_W: (2, 0, True, True),   # -> 2 E_N
    },
    5: {
        E_N: (0, 2, False, False), # -> 0 E_S (Matches 0->5E? No. 0->5E is South. 5N -> 0S.)
                                   # 0 South -> 5 East?
                                   # Let's derive 0 South vs 5.
                                   # 0 S (v=0) -> (1, su, -1).
                                   # 5 N (v=1) -> (1, su, -1). MATCH!
                                   # So 0 South <-> 5 North.
                                   # My table for 0: E_S: (5, 1). 1=East. WRONG.
                                   # Should be (5, 0).
        E_E: (1, 2, True, True),   # -> 1 E_S
        E_S: (3, 1, True, True),   # -> 3 E_E
        E_W: (4, 1, False, False), # -> 4 E_E
    },
}

def get_s2_neighbor(face, x, y, zoom, side):
    """
    Returns (n_face, nx, ny) for a given tile neighbor.
    Handles Face transitions and coordinate transformations.
    """
    max_idx = (2 ** zoom) - 1
    
    # Check bounds first (Same Face)
    nx, ny = x, y
    # S2 Coordinate Logic: Y increases from South to North (v=0 to v=1)
    if side == 'north': ny += 1
    elif side == 'south': ny -= 1
    elif side == 'east': nx += 1
    elif side == 'west': nx -= 1
    
    if 0 <= nx <= max_idx and 0 <= ny <= max_idx:
        # Same face, straightforward opposites
        opp_side = {
            'north': 'south',
            'south': 'north',
            'east': 'west',
            'west': 'east'
        }[side]
        return face, nx, ny, opp_side
        
    # We crossed a boundary. Use Transition Table.
    dirs = ['north', 'east', 'south', 'west']
    edge_idx = dirs.index(side)
    
    next_face, target_edge, swap_xy, flip_axis = S2_TRANSITIONS[face][edge_idx]
    
    # Transform Coordinate (The one running along the edge)
    # If N/S (Indices 0, 2), primary axis is X.
    # If E/W (Indices 1, 3), primary axis is Y.
    
    # Extract relative position along edge (0.0 to 1.0 logic)
    # But here we use integer indices.
    # If Edge is N/S, pos = x.
    # If Edge is E/W, pos = y.
    
    val = x if (edge_idx == 0 or edge_idx == 2) else y
    
    if flip_axis:
        val = max_idx - val
        
    # Map to Target Geometry
    # If Target is N (0) or S (2), we map to X.
    # If Target is E (1) or W (3), we map to Y.
    
    # Determine new coordinates based on Target Edge entry
    if target_edge == 0: # Entering via North (y=max? No, North edge is y=max usually. Entering via North means y=max)
                         # Wait. "Target Edge" means "The edge of the neighbor that we touch".
                         # If we touch Neighbor's North Edge, and Neighbor is below us?
                         # Standard: We exit South, we touch Neighbor North.
                         # Neighbor coord is y=0? No, N is y=max?
                         # Let's standardize: North=Top(y=0 or y=max?). 
                         # IN UTILS: v=1 is Top. In Tiler Loop, ty increases.
                         # If ty 0 -> v 0 (Bottom). ty max -> v 1 (Top).
                         # So North Edge is Y=Max. South Edge is Y=0.
                         # West Edge is X=0. East Edge is X=Max.
        t_y = max_idx
        t_x = val
    elif target_edge == 1: # East Edge (x=max)
        t_x = max_idx
        t_y = val
    elif target_edge == 2: # South Edge (y=0)
        t_y = 0
        t_x = val
    elif target_edge == 3: # West Edge (x=0)
        t_x = 0
        t_y = val
        
    # Handle Swap XY if needed (already implicitly handled by assigning to t_x/t_y?)
    # The Transition Table 'swap_xy' was conceptual.
    # The logic "If Source was N/S (X-axis) and Target is E/W (Y-axis)" implies swap.
    # My logic above:
    # `val` is Source Axis coordinate.
    # `t_x` or `t_y` gets `val`.
    # If Source=N(0) and Target=W(3): Source Axis=X. Target Axis=Y.
    # `val` (X) -> `t_y`. This IS a swap.
    # So the logic holds without checking `swap_xy` explicitly, just based on Edge IDs.
    
    # Translate edge index to name so caller knows which border to check
    edge_names = ['north', 'east', 'south', 'west']
    n_edge_name = edge_names[target_edge]
    
    return next_face, t_x, t_y, n_edge_name


def init_worker(dem_path, color_path, shm_info=None, dem_prefix=None, col_prefix=None):
    """Initializes the worker process by opening datasets once."""
    global proc_ds_dem, proc_ds_col, proc_ds_dem_faces, proc_ds_col_faces
    gdal.UseExceptions()

    # --- DEM Initialization ---
    proc_ds_dem_faces = []
    # Try 0 to 5
    for f in range(6):
        d_path = f"{dem_prefix}_face{f}.tif"
        if not os.path.exists(d_path):
             # Try alternate naming? No, enforced strictly now. Only regex flexibility.
             pass
        
        ds = gdal.Open(d_path, gdal.GA_ReadOnly)
        if not ds: print(f"[ERR] Worker failed to open optimized DEM face {f}: {d_path}")
        proc_ds_dem_faces.append(ds)

    # --- Color Initialization ---
    proc_ds_col_faces = []
    for f in range(6):
        c_path = f"{col_prefix}_face{f}.tif"
        ds = gdal.Open(c_path, gdal.GA_ReadOnly)
        if not ds: print(f"[ERR] Worker failed to open optimized Color face {f}: {c_path}")
        proc_ds_col_faces.append(ds)

def worker_task(x, y, zoom, dem_path, color_path, out_path, radii, tile_size, texture_size, height_scale, roughness, metallic, do_compress, enrichment=None, is_geodetic=True, face=None, debug=False, supersample=1, draco_level=7, ktx2_quality=128, ktx2_compression=1, draco_quant_pos=12, multithreaded=True, skirts=False, working_dir=None, is_optimized=False, ktx2_mode="etc1s", ktx2_uastc_quality=2, ktx2_zstd=0, check_borders=False):
    """Worker function for parallel tile generation."""
    global proc_ds_dem, proc_ds_col
    local_open = False
    
    # S2-Only Logic: Pass Full Face Lists to enable Neighbor Sampling
    if proc_ds_dem_faces is not None and proc_ds_col_faces is not None:
        ds_dem_list = proc_ds_dem_faces
        ds_col_list = proc_ds_col_faces
    else:
        return None
    
    actual_out_path = out_path
    temp_mode = False
    if working_dir:
        f_face = face if face is not None else "eq"
        temp_filename = f"tile_{zoom}_{f_face}_{x}_{y}_{int(time.time()*1000)}.glb"
        actual_out_path = os.path.join(working_dir, temp_filename)
        os.makedirs(working_dir, exist_ok=True)
        temp_mode = True

    try:
        if not ds_dem_list or not ds_col_list: return None
        
        meta = create_glb_s2(
            face, x, y, zoom, ds_dem_list, ds_col_list, actual_out_path, radii, tile_size, texture_size, 
            height_scale, roughness, metallic, enrichment, is_geodetic, debug=debug, 
            supersample=supersample, skirts=skirts, is_optimized=True,
            check_borders=check_borders
        )
        
        # Cleanup not needed for shared lists
        
        if meta: 
            meta["file_size_original"] = meta["file_size"]
            meta["compression_failed"] = False
            meta["compression_error"] = ""
            if do_compress:
                t0_comp = time.perf_counter()
                from tiler.compression import compress_tile
                success, error_msg = compress_tile(
                    actual_out_path, 
                    draco_level=draco_level, 
                    ktx2_quality=ktx2_quality, 
                    ktx2_compression=ktx2_compression, 
                    draco_quant_pos=draco_quant_pos,
                    ktx2_mode=ktx2_mode,
                    ktx2_uastc_quality=ktx2_uastc_quality,
                    ktx2_zstd=ktx2_zstd
                )
                if success and os.path.exists(actual_out_path):
                    meta["file_size"] = os.path.getsize(actual_out_path)
                else:
                    meta["compression_failed"] = True
                    meta["compression_error"] = error_msg
                if "perf" in meta:
                    meta["perf"]["Comp"] = (time.perf_counter() - t0_comp) * 1000.0
            
            if temp_mode:
                try:
                    target_dir = os.path.dirname(out_path)
                    os.makedirs(target_dir, exist_ok=True)
                    shutil.move(actual_out_path, out_path)
                except Exception as e:
                    print(f"[ERR] Failed to move tile from working-dir: {e}")
            
            return {'x': x, 'y': y, 'face': face, 'meta': meta}
    except Exception as e:
        print(f"\n[CRASH] Tile {zoom}/{x}/{y}: {e}")
        traceback.print_exc() 
    return None


class TilerOrchestrator:
    def __init__(self, args, radii):
        self.args = args
        self.radii = radii
        self.all_meta = {}
        self.total_h_min = float('inf')
        self.total_h_max = float('-inf')
        self.total_orig_bytes = 0
        self.total_comp_bytes = 0
        self.total_tiles_processed = 0
        self.total_border_checked = 0
        self.total_border_issues = 0
        self.total_border_max_err = 0.0
        self.global_start_time = time.time()
        
        # Determine optimized prefixes
        # Input validation already enforced in planet_tiler.py, so we can safely assume regex matches.
        import re
        self.dem_prefix = re.sub(r'[._]?face_?\d+(\.tif)?$', '', args.dem_file, flags=re.IGNORECASE)
        log(f"DEM Face Prefix: {self.dem_prefix}")
        
        self.col_prefix = re.sub(r'[._]?face_?\d+(\.tif)?$', '', args.color_file, flags=re.IGNORECASE)
        log(f"Color Face Prefix: {self.col_prefix}")

    def run(self, enrichment=None, shm_info=None):
        args = self.args
        worker_init_args = (args.dem_file, args.color_file, shm_info, self.dem_prefix, self.col_prefix)
        
        with concurrent.futures.ProcessPoolExecutor(max_workers=args.threads, initializer=init_worker, initargs=worker_init_args) as executor:
            for z in range(args.min_zoom, args.max_zoom + 1):
                level_start_time = time.time()
                num_tiles_x = 2 * (2 ** z)
                num_tiles_y = 1 * (2 ** z)
                
                # Dynamic Super-sampling logic (using col_w if available)
                effective_ss = args.supersample
                # Note: We'd normally pass col_w here. For simplicity in refactor, we'll assume it's calculated before.
                
                self.all_meta[z] = {}
                tasks = []
                
                if True: # Force S2 Block
                    tiles_per_edge = 2 ** z
                    for face in range(6):
                        if args.test and face > 0: continue
                        face_dir = os.path.join(args.output, "content", str(face))
                        os.makedirs(face_dir, exist_ok=True)
                        
                        s2_range = range(tiles_per_edge)
                        if args.test and args.test_size > 0:
                             mid = tiles_per_edge // 2
                             h = args.test_size // 2
                             s2_range = range(max(0, mid - h), min(tiles_per_edge, mid + h))
                        
                        for y in s2_range:
                            for x in s2_range:
                                out_path = os.path.join(face_dir, f"{z}_{x}_{y}.glb")
                                tasks.append(executor.submit(
                                    worker_task, x, y, z, args.dem_file, args.color_file, out_path, 
                                    self.radii, args.tile_size, args.texture_size, args.height_scale,
                                    0.9, 0.0, args.compress, enrichment, not args.planetocentric,
                                    face, args.debug, effective_ss,
                                    args.draco_compression_level, args.ktx2_quality, args.ktx2_compression,
                                    args.draco_quant_pos, True, args.skirts, args.working_dir,
                                    is_optimized=True,
                                    ktx2_mode=args.ktx2_mode, ktx2_uastc_quality=args.ktx2_uastc_quality,
                                    ktx2_zstd=args.ktx2_zstd,
                                    check_borders=args.check_borders
                                ))

                # Process results and show progress
                self._process_level_futures(tasks, z, level_start_time)
        
        return self.all_meta, (self.total_h_min, self.total_h_max)

    def _process_level_futures(self, tasks, zoom, level_start_time):
        total = len(tasks)
        done_count = 0
        level_stats = {'IO': [], 'Mesh': [], 'Encode': [], 'Comp': []}
        level_stats = {'IO': [], 'Mesh': [], 'Encode': [], 'Comp': []}
        results = {}
        
        # Border Check Stats
        b_issues = 0
        b_checked = 0
        b_max_err = 0.0
        b_sum_err = 0.0
        
        def check_edge(border_a, border_b):
            """
            Robust geometric comparison of two borders.
            Uses 'Point-to-Set' distance (Hausdorff-like) to ignore index order, reversal, or rotation.
            Returns: (max_error, avg_error) in meters.
            """
            if not border_a or not border_b:
                return 999999.0, 999999.0

            a = np.array(border_a)
            b = np.array(border_b)

            # Simple Euclidean Distance Matrix (N x M)
            # Using broadcasting: (N, 1, 3) - (1, M, 3)
            dists = np.linalg.norm(a[:, None, :] - b[None, :, :], axis=2)

            # For every point in A, find closest in B
            min_dists_a = np.min(dists, axis=1)
            
            # For every point in B, find closest in A
            min_dists_b = np.min(dists, axis=0)
            
            # Overall Error
            max_err = max(np.max(min_dists_a), np.max(min_dists_b))
            avg_err = (np.mean(min_dists_a) + np.mean(min_dists_b)) / 2.0
            
            return max_err, avg_err
        
        for future in concurrent.futures.as_completed(tasks):
            done_count += 1
            self.total_tiles_processed += 1
            try:
                res = future.result()
                if res:
                    m = res['meta']
                    if 'perf' in m:
                        p = m['perf']
                        for key in ['IO', 'Mesh', 'Encode', 'Comp']:
                            val = p.get(key, 0)
                            if key == 'IO': val += p.get('IO_Tex', 0)
                            if key == 'Mesh': val += p.get('Mesh_Gen', 0) + p.get('Skirts', 0)
                            if val > 0: level_stats[key].append(val)
                    
                    f = res.get('face', 0)
                    if f not in results: results[f] = {}
                    results[f][f"{res['x']}_{res['y']}"] = m
                        
                    if 'minHeight' in m:
                        self.total_h_min = min(self.total_h_min, m['minHeight'])
                        self.total_h_max = max(self.total_h_max, m['maxHeight'])
                    
                    self.total_orig_bytes += m.get("file_size_original", 0)
                    self.total_comp_bytes += m.get("file_size", 0)

                    # BORDER CHECK
                    if self.args.check_borders and 'borders' in m:
                        cx, cy = res['x'], res['y']
                        cf = res.get('face', 0)
                        
                        # Look for neighbors in 'results'
                        # Neighbors: (dx, dy, my_edge, their_edge)
                        # Top (y-1), Left (x-1), Bottom (y+1), Right (x+1)
                        # We only check if neighbor exists. If it comes later, it will check back with us.
                        # Note: S2 wrapping not implemented for cross-face. Restricted to same face.
                        # Define directions to check
                        # (my_side, their_side)
                        directions = [
                            ('north', 'south'),
                            ('west', 'east'),
                            ('south', 'north'),
                            ('east', 'west')
                        ]

                        for my_side, their_side in directions:
                            neighbor = None
                            target_edge_name = their_side # Default for Equirectangular
                            
                            # S2 Neighbor Lookup
                            nf, nx, ny, n_edge_name = get_s2_neighbor(cf, cx, cy, zoom, my_side)
                            target_edge_name = n_edge_name
                            
                            # Access neighbor from results
                            if nf in results and f"{nx}_{ny}" in results[nf]:
                                neighbor = results[nf][f"{nx}_{ny}"]
                            
                            if neighbor and 'borders' in neighbor:
                                my_border = m['borders'][my_side]
                                their_border = neighbor['borders'][target_edge_name]
                                
                                # Verify orientation match?
                                # Horizontal edges (North/South) should preserve order Left->Right?
                                # Vertical edges (West/East) should preserve order Top->Bottom?
                                # Usually they are generated in scanline order loops.
                                # But Tiler mesh generation produces:
                                # North: 0..N (Left to Right)
                                # South: 0..N (Left to Right)
                                # West: 0..N (Top to Bottom)
                                # East: 0..N (Top to Bottom)
                                
                                # If I am (0,0) and Neighbor is (0,-1) [North]
                                # Neighbor is adjacent to my North.
                                # Neighbor's South is adjacent to my North.
                                # Neighbor South is Left->Right. My North is Left->Right.
                                # So indices should match 1:1.
                                
                                max_e, avg_e = check_edge(my_border, their_border)
                                b_checked += len(my_border)
                                if max_e > 0.001: # 1mm tolerance
                                    b_issues += 1
                                    b_max_err = max(b_max_err, max_e)
                                    b_sum_err += avg_e * len(my_border)
                                    if max_e > 1.0:
                                        print(f"\n[WARN] Border Check: Tile {zoom}/{cx}/{cy} {my_side} mismatch: Max {max_e:.3f}m")
                                        # DEBUG DUMP
                                        if b_issues < 2: # Only print first one details
                                            # Find max error index
                                            a = np.array(my_border)
                                            b = np.array(their_border)
                                            dists = np.linalg.norm(a - b, axis=1)
                                            idx = np.argmax(dists)
                                            print(f"   [DEBUG] Index {idx}")
                                            print(f"   [DEBUG] My Vert:    {my_border[idx]}")
                                            print(f"   [DEBUG] Their Vert: {their_border[idx]}")
                                            print(f"   [DEBUG] Diff:       {a[idx] - b[idx]}")

                                # FORCE DEBUG FOR LARGE ERRORS (CROSS FACE)
                                if max_e > 100.0:
                                    with open("debug_cf.txt", "a") as f:
                                        f.write(f"\n[FORCE DEBUG] LARGE ERROR > 100m\n")
                                        f.write(f"   Tile: Face {cf} {zoom}/{cx}/{cy} Side: {my_side}\n")
                                        if neighbor:
                                            f.write(f"   Neighbor: {nf}/{nx}/{ny} Side: {target_edge_name}\n")
                                        f.write(f"   My Border [0-3]:\n{np.array(my_border)[:4]}\n")
                                        f.write(f"   Their Border [0-3]:\n{np.array(their_border)[:4]}\n")
                                        # Also dump full border to see if it's offset
                                        f.write(f"   My Border Full:\n{np.array(my_border)}\n")
                                        f.write(f"   Their Border Full:\n{np.array(their_border)}\n")
                                        max_e, avg_e = check_edge(my_border, their_border)
                                        f.write(f"   Calculated Max Error: {max_e}\n")
                                            


                
                self._print_progress(zoom, done_count, total, level_stats, level_start_time)
            except Exception as e:
                print(f"\n[ERR] Futures error: {e}")
        
        print("") # Close progress line
        
        if self.args.check_borders and b_checked > 0:
            print(f"[BORDER SUMMARY] Level {zoom}: Checked {b_checked} verts. Issues: {b_issues}. Max Err: {b_max_err:.4f}m")
            self.total_border_checked += b_checked
            self.total_border_issues += b_issues
            self.total_border_max_err = max(self.total_border_max_err, b_max_err)

        self.all_meta[zoom] = results

    def _print_progress(self, zoom, done, total, stats, level_start):
        elapsed = time.time() - self.global_start_time
        avg = elapsed / max(1, self.total_tiles_processed)
        eta_sec = avg * (total - done)
        m, s = divmod(int(eta_sec), 60); h, m = divmod(m, 60)
        eta_str = f"{h:02d}:{m:02d}:{s:02d}"
        
        def get_avg(k): return f"{sum(stats[k])/len(stats[k]):.1f}ms" if stats[k] else "-"
        perf = f"[IO:{get_avg('IO')} Mesh:{get_avg('Mesh')} Enc:{get_avg('Encode')}"
        if self.args.compress: perf += f" Comp:{get_avg('Comp')}"
        perf += "]"
        
        pct = int((done / total) * 100)
        if done == total:
            dur = time.time() - level_start
            lm, ls = divmod(int(dur), 60); lh, lm = divmod(lm, 60)
            print(f"[PROGRESS] Level {zoom}: {done}/{total} (100%) - Time: {lh:02d}:{lm:02d}:{ls:02d} {perf}")
        else:
            print(f"[PROGRESS] Level {zoom}: {done}/{total} ({pct}%) - ETA: {eta_str} {perf}       ", end="\r", flush=True)
