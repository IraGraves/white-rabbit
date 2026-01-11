"""
Planet Tiler - Main Entry Point
Generates 3D Tiles for planetary bodies from DEM and imagery data.
"""

import os
import json
import time
import math
import concurrent.futures
import argparse
import traceback
from osgeo import gdal

# Import from tiler package
from tiler import (
    load_bodies,
    log,
    inspect_file,
    get_radius_from_file,
    create_glb,
    create_glb_s2,
    compress_tile,
    BinarySubtreeEncoder,
    generate_explicit_json,
    generate_implicit_json,
    generate_s2_json
)


def worker_task(x, y, zoom, dem_path, color_path, out_path, radii, tile_size, texture_size, height_scale, roughness, metallic, do_compress, is_explicit_tiling=True, enrichment=None, is_geodetic=True, projection="equirectangular", face=None, debug=False, supersample=1, draco_level=7, ktx2_quality=128, ktx2_compression=1, draco_quant_pos=14):
    """Worker function for parallel tile generation."""
    # Enable GDAL exceptions in this process (not inherited from parent)
    gdal.UseExceptions()
    
    try:
        ds_dem = gdal.Open(dem_path)
        ds_col = gdal.Open(color_path)
        if not ds_dem or not ds_col: return None
        
        if x == 0 and y == 0 and zoom == 1:
            # Debug output controlled by global flag (set from main)
            pass  # Debug info moved to mesh.py with debug flag
            
        if projection == "s2":
            if debug and x == 0 and y == 0:
                 print(f"DEBUG S2 WORKER: radii={radii} zoom={zoom} x={x} y={y} face={face} ss={supersample}", flush=True)
            meta = create_glb_s2(face, x, y, zoom, ds_dem, ds_col, out_path, radii, tile_size, texture_size, height_scale, roughness, metallic, enrichment, is_geodetic, debug=debug, supersample=supersample)
        else:
            meta = create_glb(x, y, zoom, ds_dem, ds_col, out_path, radii, tile_size, texture_size, height_scale, roughness, metallic, is_explicit_tiling, enrichment, is_geodetic, debug=debug, supersample=supersample)
        
        ds_dem = None
        ds_col = None
        
        if meta: 
            # Store original size
            meta["file_size_original"] = meta["file_size"]
            
            # Optional: Compression
            meta["compression_failed"] = False
            meta["compression_error"] = ""
            if do_compress:
                success, error_msg = compress_tile(out_path, draco_level, ktx2_quality, ktx2_compression, draco_quant_pos)
                if success and os.path.exists(out_path):
                    new_size = os.path.getsize(out_path)
                    meta["file_size"] = new_size # Update to compressed size
                else:
                    meta["compression_failed"] = True
                    meta["compression_error"] = error_msg
            
            
            return {'x': x, 'y': y, 'face': face, 'meta': meta}
    except Exception as e:
        print(f"\n[CRASH] Tile {zoom}/{x}/{y}: {e}")
        traceback.print_exc() 
        return None
    return None


def get_parser():
    """Creates and returns the argument parser."""
    parser = argparse.ArgumentParser(description="Generates 3D Tiles for planetary bodies.")
    parser.add_argument("--config", "-c", help="Path to JSON config file.")
    parser.add_argument("dem_file", nargs='?', help="Path to DEM TIF file (Elevation)")
    parser.add_argument("color_file", nargs='?', help="Path to Color TIF file (Texture)")
    parser.add_argument("--output", "-o", default="tiles_out", help="Output directory")
    parser.add_argument("--min-zoom", type=int, default=0, help="Minimum Zoom-Level (Default: 0).")
    parser.add_argument("--max-zoom", type=int, default=4, help="Maximum Zoom-Level (Default: 4).")
    parser.add_argument("--tile-size", type=int, default=128, help="Size of tiles in pixels (Default: 128).")
    parser.add_argument("--texture-size", type=int, default=512, help="Size of texture per tile in pixels (Default: 512).")
    parser.add_argument("--height-scale", type=float, default=1.0, help="Scaling factor for height (Default: 1.0).")

    parser.add_argument("--radius", type=float, help="Radius of the celestial body in meters (Uniform override).")
    parser.add_argument("--radius-x", type=float, help="Radius X in meters.")
    parser.add_argument("--radius-y", type=float, help="Radius Y in meters.")
    parser.add_argument("--radius-z", type=float, help="Radius Z in meters.")
    parser.add_argument("--body", default="moon", help="Name of the celestial body (e.g. 'moon', 'earth').")
    parser.add_argument("--threads", type=int, default=os.cpu_count(), help="Number of threads for parallel processing (Default: CPU count).")
    parser.add_argument("--force-sphere", action="store_true", help="Forces a spherical shape (uses only X-Radius) even with Ellipsoid data.")
    parser.add_argument("--compress", action="store_true", help="Enables Draco (Mesh) and KTX2 (Texture) compression (requires @gltf-transform/cli).")
    parser.add_argument("--test", action="store_true", help="Test-Mode: Generates only one octant (1/8) of the tiles up to full depth.")
    parser.add_argument("--test-size", type=int, default=0, help="If set and --test is active, limits the number of tiles per level to a NxN patch.")
    parser.add_argument("--keep", action="store_true", help="Keeps existing output directory (Default: Directory is deleted!)")
    parser.add_argument("--analysis", action="store_true", help="Perform analysis only (do not generate tiles)")
    parser.add_argument("--explicit-tiling", action="store_true", help="Use explicit (recursive) tileset structure instead of Implicit Tiling 1.1.")
    parser.add_argument("--planetocentric", action="store_true", help="Use simplified Planetocentric coordinates (spherical scaling) instead of Geodetic.")
    parser.add_argument("--projection", default="equirectangular", choices=["equirectangular", "s2"], help="Projection/Tiling Scheme (Default: equirectangular).")
    parser.add_argument("--supersample", type=int, default=1, help="Texture super-sampling factor (1=Off, 2=4x, 4=16x).")
    parser.add_argument("--draco-compression-level", type=int, default=7, help="Draco effort/compression level (0-10, default: 7). Higher is smaller/slower.")
    parser.add_argument("--draco-quant-pos", type=int, default=14, help="Draco quantization bits for position (1-16, default: 14). Higher is better quality.")
    parser.add_argument("--ktx2-quality", type=int, default=128, help="KTX2 etc1s quality (1-128, default: 128). Higher is better quality.")
    parser.add_argument("--ktx2-compression", type=int, default=1, help="KTX2 etc1s effort/compression level (0-5, default: 1). Higher is smaller/slower.")
    parser.add_argument("--debug", action="store_true", help="Enable verbose debug output.")
    
    # Texture Enrichment Arguments
    parser.add_argument("--enrichment-enabled", action="store_true", help="Enable detail texture enrichment for high LOD.")
    parser.add_argument("--enrichment-texture", default="", help="Path to detail texture file (PNG/JPG).")
    parser.add_argument("--enrichment-blend-mode", default="overlay", choices=["overlay", "alpha", "multiply", "soft_light", "signed_add"], help="Blend mode for detail texture.")
    parser.add_argument("--enrichment-repeat", type=int, default=4, help="Repeat factor for detail texture.")
    parser.add_argument("--enrichment-min-level", type=int, default=5, help="Start level for enrichment.")
    parser.add_argument("--enrichment-max-level", type=int, default=7, help="End level for enrichment.")
    parser.add_argument("--enrichment-alpha-start", type=float, default=0.0, help="Alpha at start level.")
    parser.add_argument("--enrichment-alpha-end", type=float, default=0.35, help="Alpha at end level.")
    parser.add_argument("--enrichment-affect-normals", action="store_true", help="Perturb normals based on detail texture.")
    return parser


def list_parameters():
    """Lists available parameters (Help function)."""
    parser = get_parser()
    parser.print_help()


def main():
    parser = get_parser()
    
    # 1. Pre-Check for Config File
    temp_args, _ = parser.parse_known_args()
    
    if temp_args.config:
        config_path = temp_args.config
        if os.path.exists(config_path):
            with open(config_path, "r") as f:
                cfg = json.load(f)
            
            # Translate Config Keys (JSON) to Argparse Arguments
            # Map keys like "dem_file" to positional args, others to --key format
            config_args = []
            positionals = []
            for key, value in cfg.items():
                if value is None or value == "":
                    continue
                # 1. Normalize boolean strings (from GUI dropdowns)
                if isinstance(value, str):
                    if value.lower() == "true": value = True
                    elif value.lower() == "false": value = False
                
                # 2. Handle Positional Files (Must not have -- prefix)
                if key == "dem_file":
                    positionals.insert(0, value)
                    continue
                if key == "color_file":
                    positionals.append(value)
                    continue

                # 3. Handle Flags and Options
                arg_key = key.replace("_", "-")
                if isinstance(value, bool):
                    if value: config_args.append(f"--{arg_key}")
                else:
                    config_args.extend([f"--{arg_key}", str(value)])
            
            # Re-parse with new config values FIRST, then normal args (CLI overrides config)
            import sys
            new_argv = positionals + config_args + sys.argv[1:]
            args = parser.parse_args(new_argv)
        else:
            log(f"Config file not found: {config_path}", "ERR")
            return
    else:
        args = parser.parse_args()

    if not args.dem_file or not args.color_file:
        parser.print_help()
        print("\nError: 'dem_file' and 'color_file' are required.")
        return

    # 2. Load Bodies
    bodies = load_bodies()
    
    # 3. Determine Radius
    file_radius = get_radius_from_file(args.dem_file)
    
    # Priority:
    # 1. Explicit --radius-x/y/z from command line
    # 2. Single --radius argument
    # 3. Body from bodies.json
    # 4. Radius from file metadata
    # 5. Default: Moon radius
    
    default_radius = 1737400.0  # Moon
    rx = ry = rz = default_radius
    
    # 1. Start with metadata if available
    if file_radius:
        rx = ry = rz = file_radius
        log(f"DEBUG: File Radius found: {file_radius}")
        
    # 2. Override with body database
    body_key = args.body.lower() if args.body else "moon"
    ss_bodies = bodies.get("solar_system_bodies", {})
    if body_key in ss_bodies:
        body_data = ss_bodies[body_key]
        if "radii" in body_data:
            r_dict = body_data["radii"]
            rx = r_dict.get("x", rx)
            ry = r_dict.get("y", ry)
            rz = r_dict.get("z", rz)
        if "radius" in body_data:
            rx = ry = rz = body_data["radius"]
        if "radius_x" in body_data:
            rx = body_data["radius_x"]
        if "radius_y" in body_data:
            ry = body_data["radius_y"]
        if "radius_z" in body_data:
            rz = body_data["radius_z"]
    
    # Override with explicit --radius
    if args.radius:
        rx = ry = rz = args.radius
    
    # Override with specific radii if provided
    if args.radius_x:
        rx = args.radius_x
    if args.radius_y:
        ry = args.radius_y
    if args.radius_z:
        rz = args.radius_z
    
    # Force sphere if requested
    if args.force_sphere:
        ry = rz = rx
        
    final_radii = (rx, ry, rz)
    
    log(f"Using Radii: X={rx:.1f}m, Y={ry:.1f}m, Z={rz:.1f}m")
    
    # Get max radius for bounding calculations
    max_r = max(final_radii)
    
    # Default material properties
    final_roughness = 0.9
    final_metallic = 0.0
    
    # 4. Analysis
    log(f"Analyzing input files...")
    dem_info = inspect_file(args.dem_file, "DEM")
    col_info = inspect_file(args.color_file, "Color")
    
    if not dem_info or not col_info:
        log("Failed to analyze input files.", "ERR")
        return
    
    # Calculate geometric error at Zoom 0 using industry standard ratio
    # Approx side_length / 512 (assuming 512px tiles)
    # Side length at L0 = Circumference / 4
    root_error = (max_r * math.pi) / (2.0 * 512.0)
    
    def calc_max_zoom(source_width, tile_px_width):
        """Calculates zoom level and scaling factor (how much source is stretched)."""
        for z in range(20):
            tiles_x = 2 * (2 ** z)
            total_pixels = tiles_x * tile_px_width
            if total_pixels >= source_width:
                return z, total_pixels / source_width
        return 10, 1.0
    
    dem_w, dem_h = dem_info
    col_w, col_h = col_info
    
    rec_z_dem, scale_dem = calc_max_zoom(dem_w, args.tile_size)
    rec_z_col, scale_col = calc_max_zoom(col_w, args.texture_size)
    
    log(f"Recommended max zoom (DEM): {rec_z_dem} (stretch factor: {scale_dem:.2f}x)")
    log(f"Recommended max zoom (Color): {rec_z_col} (stretch factor: {scale_col:.2f}x)")
    log(f"Selected zoom range: {args.min_zoom} to {args.max_zoom}")
    
    if args.analysis:
        log("Analysis complete. Exiting (--analysis flag set).")
        return
    
    # 5. Output Directory
    if not args.keep and os.path.exists(args.output):
        import shutil
        log(f"Deleting existing output directory: {args.output}")
        
        def on_rm_error(func, path, exc_info):
            import stat
            try:
                os.chmod(path, stat.S_IWRITE)
                func(path)
            except Exception:
                pass

        import time
        for i in range(5):
            try:
                shutil.rmtree(args.output, onerror=on_rm_error)
                break
            except Exception as e:
                log(f"Deletion failed ({e}). Retrying in 1s...", "WARN")
                time.sleep(1.0)
    os.makedirs(args.output, exist_ok=True)
    
    # 6. Generate Tiles
    log(f"Starting tile generation...")
    log(f"Threads: {args.threads}, Compress: {args.compress}")
    
    # Build enrichment config dict from args
    enrichment = None
    if args.enrichment_enabled and args.enrichment_texture:
        enrichment = {
            'enabled': True,
            'texture': args.enrichment_texture,
            'blend_mode': args.enrichment_blend_mode,
            'repeat': args.enrichment_repeat,
            'min_level': args.enrichment_min_level,
            'max_level': args.enrichment_max_level,
            'alpha_start': args.enrichment_alpha_start,
            'alpha_end': args.enrichment_alpha_end
        }
        log(f"Texture Enrichment: ON (L{args.enrichment_min_level}-L{args.enrichment_max_level}, {args.enrichment_blend_mode}, α={args.enrichment_alpha_start:.2f}-{args.enrichment_alpha_end:.2f})")
    
    all_meta = {}
    total_h_min = float('inf')
    total_h_max = float('-inf')

    # Statistics tracking
    total_orig_bytes = 0
    total_comp_bytes = 0
    
    for z in range(args.min_zoom, args.max_zoom + 1):
        num_tiles_x = 2 * (2 ** z)
        num_tiles_y = 1 * (2 ** z)
        
        # Determine tile ranges
        if args.test:
            if args.test_size > 0:
                # Center of the first octant (West Hemisphere, North-ish)
                cx = num_tiles_x // 4
                cy = num_tiles_y // 4
                h = args.test_size // 2
                
                x_start = max(0, cx - h)
                y_start = max(0, cy - h)
                
                tiles_x_range = range(x_start, min(num_tiles_x, x_start + args.test_size))
                tiles_y_range = range(y_start, min(num_tiles_y, y_start + args.test_size))
            else:
                tiles_x_range = range(max(1, num_tiles_x // 2))
                tiles_y_range = range(max(1, num_tiles_y // 2))
        else:
            tiles_x_range = range(num_tiles_x)
            tiles_y_range = range(num_tiles_y)
            
        # --- DYNAMIC SUPER-SAMPLING OPTIMIZATION ---
        # If the current level's total pixels already exceed source resolution, 
        # super-sampling provides no benefit.
        current_lod_res = num_tiles_x * args.texture_size
        effective_ss = args.supersample
        if effective_ss > 1:
            # We cap it so that total sampled pixels don't massively exceed col_w 
            # (unless they already do at ss=1)
            if current_lod_res >= col_w:
                effective_ss = 1
            else:
                # Cap so current_lod_res * effective_ss <= col_w
                effective_ss = min(effective_ss, max(1, col_w // current_lod_res))
        
        if effective_ss != args.supersample:
            log(f"Level {z}: Super-sampling optimized {args.supersample}x -> {effective_ss}x (Target {current_lod_res}px vs Source {col_w}px)")
        elif args.supersample > 1:
            log(f"Level {z}: Using {effective_ss}x super-sampling")

        rel_z = z - args.min_zoom
        zoom_dir = os.path.join(args.output, str(z))
        if args.explicit_tiling:
            os.makedirs(zoom_dir, exist_ok=True)
        
        all_meta[z] = {}
        results = {}
        
        with concurrent.futures.ProcessPoolExecutor(max_workers=args.threads) as executor:
            tasks = []
            if args.projection == "s2":
                # === S2 TILING LOOP ===
                tiles_per_edge = 2 ** z
                
                # For S2, we always use the implicit/content folder structure:
                # content/{face}/{level}_{x}_{y}.glb
                # We treat 'explicit_tiling' flag as ignored or just force implicit structure for S2.
                # S2 works best with implicit tiling 1.1 structure.
                
                for face in range(6):
                    face_dir = os.path.join(args.output, "content", str(face))
                    os.makedirs(face_dir, exist_ok=True)
                    
                    # Test Mode handling for S2 (Generate only Face 0 or center of Face 0?)
                    # If test is on, let's only generate Face 0
                    if args.test and face > 0:
                        continue
                        
                    s2_range = range(tiles_per_edge)
                    if args.test and args.test_size > 0:
                         mid = tiles_per_edge // 2
                         h = args.test_size // 2
                         s2_range = range(max(0, mid - h), min(tiles_per_edge, mid + h))
    
                    for y in s2_range:
                        for x in s2_range:
                            # File path: content/{face}/{z}_{x}_{y}.glb
                            # We use absolute zoom (z) because S2 implicit tiling
                            # will start at level 0 (the face) in tileset.json.
                            fname = f"{z}_{x}_{y}.glb"
                            out_path = os.path.join(face_dir, fname)
                            
                            tasks.append(executor.submit(
                                worker_task, x, y, z, args.dem_file, args.color_file, out_path, 
                                final_radii, args.tile_size, args.texture_size, args.height_scale,
                                final_roughness, final_metallic, args.compress, 
                                False, # explicit_tiling flag
                                enrichment, not args.planetocentric,
                                "s2", face, args.debug, effective_ss,
                                args.draco_compression_level, args.ktx2_quality, args.ktx2_compression,
                                args.draco_quant_pos
                            ))
            else:
                # === EQUIRECTANGULAR / MERCATOR LOOP (Original) ===
                mid_x = num_tiles_x // 2
                
                # WIR ITERIEREN ÜBER DEN IMPLICIT INDEX (0 = SÜDEN, ZIEL)
                for y_implicit in tiles_y_range:
                    
                    # Direct mapping: Implicit Y (0=South) -> Worker Y (0=South)
                    # The previous inversion was based on a faulty validator diagnosis.
                    worker_y = y_implicit
                    
                    for x in tiles_x_range:
                        if args.explicit_tiling:
                            # Explicit Tiling ist meist TMS (Nord=0)
                            # Hier speichern wir Nord-Daten (worker=0) in 0.glb.
                            # Also nutzen wir worker_y für BEIDES.
                            out_path = os.path.join(zoom_dir, f"{x}_{worker_y}.glb")
                            task_y = worker_y
                        else:
                            # Implicit Tiling: 
                            # Dateiname basiert auf y_implicit (0, 1, 2...)
                            # Inhalt basiert auf worker_y (Max, Max-1, ...)
                            
                            if x < mid_x: # West
                                side_dir = os.path.join(args.output, "west", str(z))
                                os.makedirs(side_dir, exist_ok=True)
                                out_path = os.path.join(side_dir, f"{x}_{y_implicit}.glb")
                            else: # East
                                side_dir = os.path.join(args.output, "east", str(z))
                                os.makedirs(side_dir, exist_ok=True)
                                # x relative to East side
                                out_path = os.path.join(side_dir, f"{x - mid_x}_{y_implicit}.glb")
                            
                            # WICHTIG: Worker holt die Daten von 'worker_y' (unten im Bild)
                            # und wir speichern sie in 'y_implicit' (unten im Implicit Grid)
                            task_y = worker_y
    
                        tasks.append(executor.submit(
                            worker_task, x, task_y, z, args.dem_file, args.color_file, out_path, 
                            final_radii, args.tile_size, args.texture_size, args.height_scale,
                            final_roughness, final_metallic, args.compress, args.explicit_tiling,
                            enrichment, not args.planetocentric, "equirectangular", None, args.debug, effective_ss,
                            args.draco_compression_level, args.ktx2_quality, args.ktx2_compression,
                            args.draco_quant_pos
                        ))
                
            total = len(tasks)
            done_count = 0
            for future in concurrent.futures.as_completed(tasks):
                done_count += 1
                if done_count % 10 == 0:
                    print(f"[PROGRESS] Level {z}: {done_count}/{total}", end="\r", flush=True)
                
                try:
                    res = future.result()
                    if res: 
                        # S2 Tiling
                        if args.projection == "s2":
                            face_r = res.get('face', 0)
                            if face_r not in results: results[face_r] = {}
                            results[face_r][f"{res['x']}_{res['y']}"] = res['meta']
                        
                        # Explicit / Implicit Tiling (Equirectangular)
                        else:
                            if args.explicit_tiling:
                                    key = f"{res['x']}_{res['y']}"
                            else:
                                    # Implicit: worker y is mapped to implicit y
                                    y_impl_restored = res['y']
                                    key = f"{res['x']}_{y_impl_restored}"
                            
                            results[key] = res['meta']
                        
                        # Accumulate Stats
                        if 'h_stats' in res['meta']:
                            total_h_min = min(total_h_min, res['meta']['h_stats'][0])
                            total_h_max = max(total_h_max, res['meta']['h_stats'][1])
                        
                        # Track Compression
                        total_orig_bytes += res['meta'].get("file_size_original", 0)
                        total_comp_bytes += res['meta'].get("file_size", 0)
    
                except Exception as e:
                    print(f"\n[ERR] Tile generation failed: {e}")
                    traceback.print_exc()
        
        all_meta[z] = results
        
        # Calculate count
        if args.projection == "s2":
            count = sum(len(face_tiles) for face_tiles in results.values())
        else:
            count = len(results)
            
        print(f"\nLevel {z} complete: {count} tiles")
    
    # Handle flat terrain / No Tiles
    if total_h_min == float('inf'): total_h_min = 0.0
    # Total height limited to what was actually generated
    max_z = max(all_meta.keys()) if all_meta else 0
    total_height = max_z + 1
    
    # Subtree chunking: limit subtree to MAX_SUBTREE_LEVELS
    MAX_SUBTREE_LEVELS = 5
    subtree_levels = min(total_height, MAX_SUBTREE_LEVELS)
    if (total_h_max - total_h_min) < 100.0:
        log("Expanding bounding volume height to prevent culling issues.")
        mid = (total_h_max + total_h_min) / 2.0
        total_h_min = mid - 5000.0 
        total_h_max = mid + 5000.0
    
    # 7. Generate Tileset JSON
    if args.projection == "s2":
        # We need to collect metadata properly first!
        # The loop above didn't store S2 metadata well because of missing keys.
        # We need to fix the worker return to include 'face'.
        # Assuming we fixed worker_task return below...
        generate_s2_json(args, all_meta, max_r, final_radii, total_h_min, total_h_max)
    elif args.explicit_tiling:
        generate_explicit_json(args, all_meta, max_r, final_radii)
    else:
        generate_implicit_json(args, all_meta, max_r, final_radii, total_h_min, total_h_max)
    
    log("Tile generation complete!")

    # Summary Stats
    def format_size(size_bytes):
        if size_bytes > 1e9: return f"{size_bytes / 1e9:.2f} GB"
        if size_bytes > 1e6: return f"{size_bytes / 1e6:.2f} MB"
        return f"{size_bytes / 1e3:.2f} KB"

    if total_orig_bytes > 0:
        ratio = (total_comp_bytes / total_orig_bytes) * 100.0
        log("==========================================")
        log(f"COMPRESSION SUMMARY")
        log(f"Original Size:   {format_size(total_orig_bytes)}")
        if args.compress:
             log(f"Compressed Size: {format_size(total_comp_bytes)}")
             log(f"Ratio:           {ratio:.1f}% of original")
        else:
             log(f"Output Size:     {format_size(total_comp_bytes)}")
        log("==========================================")


if __name__ == '__main__':
    main()