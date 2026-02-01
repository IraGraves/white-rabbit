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
proc_ds_dem_faces = None
proc_ds_dem_overviews = None

# New Texture Globals (List of Texture Objects)
# Each entry: { "faces": [ds..], "overviews": {ovr: [ds..]}, "meta": {name, size} }
proc_textures_data = None 

proc_max_zoom = 10 
proc_debug = False 


# S2 Adjacency Logic Removed: Now handled by VRT Padding.
# get_s2_neighbor is deprecated and replaced by direct sampling into padded area in utils.py.



def init_worker(dem_path, texture_defs, shm_info=None, dem_prefix=None, max_zoom=10, debug=False):
    """Initializes the worker process by opening datasets once."""
    global proc_ds_dem_faces, proc_ds_dem_overviews, proc_textures_data
    global proc_max_zoom, proc_debug
    gdal.UseExceptions()
    
    proc_max_zoom = max_zoom
    proc_debug = debug
    proc_textures_data = []

    # --- DEM Initialization (Base Level) ---
    proc_ds_dem_faces = []
    # Try 0 to 5
    for f in range(6):
        d_path = f"{dem_prefix}_face{f}.vrt"
        if not os.path.exists(d_path):
             # Fallback to TIF if VRT not found (legacy support)
             d_path = f"{dem_prefix}_face{f}.tif"
        
        ds = gdal.Open(d_path, gdal.GA_ReadOnly)
        if not ds: print(f"[ERR] Worker failed to open optimized DEM face {f}: {d_path}")
        proc_ds_dem_faces.append(ds)

    # --- DEM Overviews ---
    proc_ds_dem_overviews = {}
    for ovr in range(1, max_zoom + 1):
        proc_ds_dem_overviews[ovr] = []
        for f in range(6):
            d_ovr_path = f"{dem_prefix}_face{f}_ovr{ovr}.vrt"
            if os.path.exists(d_ovr_path):
                ds = gdal.Open(d_ovr_path, gdal.GA_ReadOnly)
                proc_ds_dem_overviews[ovr].append(ds)
            else:
                proc_ds_dem_overviews[ovr].append(None)

    # --- Textures Initialization ---
    for tex_def in texture_defs:
        # Pre-calculated prefix in main thread?
        # We need the prefix. Let's assume tex_def has 'prefix' added by Orchestrator.
        tex_prefix = tex_def['prefix']
        
        t_data = {
            "meta": tex_def,
            "faces": [],
            "overviews": {}
        }
        
        # Base Faces
        for f in range(6):
            c_path = f"{tex_prefix}_face{f}.vrt"
            if not os.path.exists(c_path):
                 c_path = f"{tex_prefix}_face{f}.tif"
            ds = gdal.Open(c_path, gdal.GA_ReadOnly)
            if not ds: print(f"[ERR] Worker failed to open texture {tex_def['name']} face {f}: {c_path}")
            t_data["faces"].append(ds)
            
        # Overviews
        for ovr in range(1, max_zoom + 1):
            t_data["overviews"][ovr] = []
            for f in range(6):
                c_ovr_path = f"{tex_prefix}_face{f}_ovr{ovr}.vrt"
                if os.path.exists(c_ovr_path):
                    ds = gdal.Open(c_ovr_path, gdal.GA_ReadOnly)
                    t_data["overviews"][ovr].append(ds)
                else:
                    t_data["overviews"][ovr].append(None)
        
        proc_textures_data.append(t_data)


def worker_task(x, y, zoom, dem_path, out_path, radii, tile_size, height_scale, roughness, metallic, do_compress, enrichment=None, is_geodetic=True, face=None, debug=False, supersample=1, draco_level=7, ktx2_quality=128, ktx2_compression=1, draco_quant_pos=12, multithreaded=True, skirts=False, working_dir=None, is_optimized=False, ktx2_mode="etc1s", ktx2_uastc_quality=2, ktx2_zstd=0, heightmap_mode=False):
    """Worker function for parallel tile generation."""
    global proc_ds_dem_faces, proc_ds_dem_overviews, proc_textures_data
    
    # 1. Resolve DEM Datasets
    ds_dem_list = proc_ds_dem_faces
    ovr_level = proc_max_zoom - zoom if zoom < proc_max_zoom else 0
    
    if ovr_level > 0 and proc_ds_dem_overviews and ovr_level in proc_ds_dem_overviews:
        dem_ovr_list = proc_ds_dem_overviews.get(ovr_level)
        if dem_ovr_list and all(ds is not None for ds in dem_ovr_list):
            ds_dem_list = dem_ovr_list

    # 2. Resolve Texture Datasets (List of Lists)
    resolved_texture_datasets = []     # List of [Face0..Face5] lists
    resolved_texture_meta = []         # List of {name, size}
    
    for t_data in proc_textures_data:
        t_ds_list = t_data["faces"]
        
        # Check overviews
        if ovr_level > 0 and ovr_level in t_data["overviews"]:
            t_ovr_list = t_data["overviews"][ovr_level]
            if t_ovr_list and all(ds is not None for ds in t_ovr_list):
                 t_ds_list = t_ovr_list
        
        resolved_texture_datasets.append(t_ds_list)
        resolved_texture_meta.append(t_data["meta"])

    
    actual_out_path = out_path
    temp_mode = False
    if working_dir:
        f_face = face if face is not None else "eq"
        temp_filename = f"tile_{zoom}_{f_face}_{x}_{y}_{int(time.time()*1000)}.glb"
        actual_out_path = os.path.join(working_dir, temp_filename)
        os.makedirs(working_dir, exist_ok=True)
        temp_mode = True
    try:
        meta = create_glb_s2(
            face, x, y, zoom, 
            ds_dem_list, 
            resolved_texture_datasets, resolved_texture_meta,  # New Args
            actual_out_path, radii, tile_size, 
            height_scale, roughness, metallic, enrichment, is_geodetic, debug=debug, 
            is_optimized=True, heightmap_mode=heightmap_mode
        )
        
        if meta: 
            meta["file_size_original"] = meta["file_size"]
            meta["compression_failed"] = False
            meta["compression_error"] = ""
            if do_compress:
                t0_comp = time.perf_counter()
                from tiler.compression import compress_tile
                success, error_msg = compress_tile(
                    actual_out_path, 
                    draco_level=-1 if heightmap_mode else draco_level, 
                    ktx2_quality=ktx2_quality, 
                    ktx2_compression=ktx2_compression, 
                    draco_quant_pos=draco_quant_pos,
                    ktx2_mode=ktx2_mode,
                    ktx2_uastc_quality=ktx2_uastc_quality,
                    ktx2_zstd=ktx2_zstd
                )
                if success and os.path.exists(actual_out_path):
                    meta["file_size"] = os.path.getsize(actual_out_path)
                    comp_dt = (time.perf_counter() - t0_comp) * 1000.0
                    meta["compression_time"] = comp_dt / 1000.0
                    if "perf" in meta:
                        meta["perf"]["Comp"] = comp_dt
                    
                    # Print Summary of what happened (Debug Only)
                    if error_msg and debug: 
                         print(f"\n[OPT] Tile {zoom}/{x}/{y}: {error_msg}")
                else:
                    meta["compression_failed"] = True
                    meta["compression_error"] = error_msg
                    print(f"\n[WARN] Compression FAILED for tile {zoom}/{x}/{y}: {error_msg}")
                    print(f"\n[WARN] Compression failed for tile {zoom}/{x}/{y}: {error_msg}")
            
            # If we used a temporary directory, move to final destination
            if temp_mode and os.path.exists(actual_out_path):
                os.makedirs(os.path.dirname(out_path), exist_ok=True)
                import shutil
                shutil.move(actual_out_path, out_path)
            
            return {'x': x, 'y': y, 'face': face, 'meta': meta}
    except Exception as e:
        print(f"\n[CRASH] Tile {zoom}/{x}/{y}: {e}")
        traceback.print_exc() 
    return None


class TilerOrchestrator:
    def __init__(self, args, radii, texture_definitions):
        self.args = args
        self.radii = radii
        self.texture_definitions = texture_definitions
        self.all_meta = {}
        self.total_h_min = float('inf')
        self.total_h_max = float('-inf')
        self.total_orig_bytes = 0
        self.total_comp_bytes = 0
        self.total_tiles_processed = 0

        self.global_start_time = time.time()
        
        import re
        strip_pattern = r'([._]?face_?\d+)?(\.tif|\.vrt)$'
        
        self.dem_prefix = re.sub(strip_pattern, '', args.dem_file, flags=re.IGNORECASE)
        log(f"DEM Face Prefix: {self.dem_prefix}")
        
        # Prepare Textures with Prefixes
        for tex in self.texture_definitions:
             tex['prefix'] = re.sub(strip_pattern, '', tex['path'], flags=re.IGNORECASE)
             log(f"Texture '{tex['name']}' Prefix: {tex['prefix']}")

    def run(self, enrichment=None, shm_info=None):
        args = self.args
        
        # Determine global max zoom (highest of equator vs pole)
        effective_max_zoom = args.max_zoom
        if args.max_zoom_pole is not None and args.max_zoom_pole > effective_max_zoom:
            effective_max_zoom = args.max_zoom_pole
        
        # Args: dem_path, texture_defs, shm_info, dem_prefix, max_zoom, debug
        worker_init_args = (args.dem_file, self.texture_definitions, shm_info, self.dem_prefix, effective_max_zoom, args.debug)
            
        with concurrent.futures.ProcessPoolExecutor(max_workers=args.threads, initializer=init_worker, initargs=worker_init_args) as executor:
            for z in range(args.min_zoom, effective_max_zoom + 1):
                level_start_time = time.time()
                num_tiles_x = 2 * (2 ** z)
                num_tiles_y = 1 * (2 ** z)
                
                # Resolution Analysis for Logging
                dem_width = 4224 # Hardcoded fallback if not passed, but we should try to get it.
                # Actually, we don't have direct access to dem info here easily without opening it or passing it.
                # But we know the DEM file path.
                # Let's rely on the simple logic for now or calculate "tiles per side" vs 360 mapping if possible.
                
                # Better approach: We have 'ovr_level' which is the default 'simple' calc.
                # But user wants per-texture info.
                
                log(f"--- Level {z} Generation Details ---")
                
                # Global Resolution
                tiles_x = 2 * (2**z)
                out_res = 360.0 / (tiles_x * 256.0)
                log(f"  Target Res: {out_res:.6f} deg/px")
                
                # DEM Info (Simplified as we might not have width handy without re-opening)
                # However, we can track the selected overview from the list logic.
                ovr_level = effective_max_zoom - z if z < effective_max_zoom else 0
                dem_status = "Base (Full)"
                if ovr_level > 0:
                     if proc_ds_dem_overviews and ovr_level in proc_ds_dem_overviews:
                         ds_list = proc_ds_dem_overviews[ovr_level]
                         # Check if valid
                         if ds_list and any(d is not None for d in ds_list):
                             dem_status = f"Overview {ovr_level} (2^{ovr_level}x)"
                         else:
                             dem_status = f"Base (Full) [Overview {ovr_level} missing]"
                log(f"  DEM: {dem_status}")

                # Texture Info
                for tex in self.texture_definitions:
                    # Calculate ideal overview
                    t_info = tex.get("info", {})
                    t_width = t_info.get("width", 0)
                    t_name = tex.get("name", "unknown")
                    
                    if t_width > 0:
                        t_res = 360.0 / t_width
                        mag = out_res / t_res
                        
                        note = "Original"
                        if mag < 1.0:
                             note = f"Upscale (x{1/mag:.1f})"
                        elif mag < 1.01:
                             note = "Original"
                        else:
                            # Calculate ideal index
                            ideal_ov = math.log2(mag) - 1
                            idx = int(round(ideal_ov))
                            idx = max(0, idx)
                            
                            # Check available
                            t_ov = t_info.get("overviews", 0)
                            if idx < t_ov:
                                note = f"Ov {idx} (/{mag:.1f})"
                            elif t_ov > 0:
                                note = f"Ov {t_ov-1} (Max) (/{mag:.1f}) *"
                            else:
                                note = f"Downscale (/{mag:.1f})"
                        
                        log(f"  Texture '{t_name}': {note}")
                    else:
                        log(f"  Texture '{t_name}': Info unavailable")
                
                effective_ss = args.supersample
                self.all_meta[z] = {}
                tasks = []
                
                if True: # Force S2 Block
                    tiles_per_edge = 2 ** z
                    for face in range(6):
                        # Dual Zoom Logic: Skip faces that don't go this deep
                        face_limit = args.max_zoom
                        if (face == 2 or face == 5) and args.max_zoom_pole is not None:
                            face_limit = args.max_zoom_pole
                        
                        if z > face_limit: continue
                        
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
                                    worker_task, x, y, z, args.dem_file, out_path, 
                                    self.radii, args.tile_size, args.height_scale,
                                    0.9, 0.0, args.compress, enrichment, not args.planetocentric,
                                    face, args.debug, effective_ss,
                                    args.draco_compression_level, args.ktx2_quality, args.ktx2_compression,
                                    args.draco_quant_pos, True, args.skirts, args.working_dir,
                                    is_optimized=True,
                                    ktx2_mode=args.ktx2_mode, ktx2_uastc_quality=args.ktx2_uastc_quality,
                                    ktx2_zstd=args.ktx2_zstd, heightmap_mode=args.heightmap_mode
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
                            if key == 'IO': 
                                val += p.get('IO_Tex', 0) + p.get('IO_DEM', 0) + p.get('IO_Col', 0)
                            if key == 'Mesh': 
                                val += p.get('Mesh_Gen', 0) + p.get('Skirts', 0)
                            
                            # Only append if we have data (even if 0, technically, but usually we want >0)
                            # However, if IO is 0.0 it might just be very fast or cached. 
                            # Let's trust val > 0 for avoiding noise, or just append.
                            level_stats[key].append(val)
                    
                    f = res.get('face', 0)
                    if f not in results: results[f] = {}
                    results[f][f"{res['x']}_{res['y']}"] = m
                        
                    if 'minHeight' in m:
                        self.total_h_min = min(self.total_h_min, m['minHeight'])
                        self.total_h_max = max(self.total_h_max, m['maxHeight'])
                    
                    self.total_orig_bytes += m.get("file_size_original", 0)
                    self.total_comp_bytes += m.get("file_size", 0)


                                            


                
                self._print_progress(zoom, done_count, total, level_stats, level_start_time)
            except Exception as e:
                print(f"\n[ERR] Futures error: {e}")
        
        print("") # Close progress line
        


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
