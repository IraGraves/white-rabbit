"""
Planet Tiler - Main Entry Point
Generates 3D Tiles for planetary bodies from DEM and imagery data.
"""

import os
import time
import math
import shutil
import traceback
from osgeo import gdal

# Import from tiler package
from tiler import (
    log,
    inspect_file,
    is_s2_face_path,
    resolve_config,
    get_body_radii,
    TilerOrchestrator,
    generate_s2_json
)

def format_size(size_bytes):
    if size_bytes > 1e9: return f"{size_bytes / 1e9:.2f} GB"
    if size_bytes > 1e6: return f"{size_bytes / 1e6:.2f} MB"
    if size_bytes > 1e3: return f"{size_bytes / 1e3:.2f} KB"
    return f"{size_bytes} B"

def main():
    start_time = time.time()
    
    # 1. Resolve Configuration (Merges JSON + CLI)
    args = resolve_config()
    if not args: return

    # 1b. Enforce S2 Optimized Faces
    if not is_s2_face_path(args.dem_file):
        log(f"Error: DEM file must follow S2 face naming convention (e.g. name_face0.tif).", "ERR")
        return
    if not is_s2_face_path(args.color_file):
        log(f"Error: Color file must follow S2 face naming convention (e.g. name_face0.tif).", "ERR")
        return

    # 2. Determine Body Radii
    final_radii = get_body_radii(
        args.dem_file, 
        body_name=args.body, 
        radius_override=args.radius,
        rx_override=args.radius_x,
        ry_override=args.radius_y,
        rz_override=args.radius_z,
        force_sphere=args.force_sphere
    )
    
    # 3. Analyze Input Files
    log(f"Analyzing input files...")
    dem_info = inspect_file(
        args.dem_file, "DEM", 
        srs_hint="S2"
    )
    col_info = inspect_file(
        args.color_file, "Color", 
        srs_hint="S2"
    )
    
    if not dem_info or not col_info:
        log("Failed to analyze input files.", "ERR")
        return
    
    # Target Zoom & Analysis Printouts
    max_r = max(final_radii)
    root_error = (max_r * math.pi) / (2.0 * 512.0)
    
    def calc_max_zoom(source_width, tile_px_width):
        # Full width is useful resolution
        effective_width = source_width
        for z in range(25):
            # S2: 1 tile across (per face) x 2^z
            tiles_across = (2**z)
            if (tiles_across * tile_px_width) >= effective_width: return z
        return 10
    
    rec_z_dem = calc_max_zoom(dem_info['width'], args.tile_size)
    rec_z_col = calc_max_zoom(col_info['width'], args.texture_size)
    
    # Enforce S2 Projection internally
    args.projection = "s2"
    
    log("--- Tiling Summary ---")
    log(f"  Target Projection: {args.projection.upper()}")
    log(f"  Recommended max zoom: DEM={rec_z_dem}, Color={rec_z_col}")
    log(f"  Selected zoom range: {args.min_zoom} to {args.max_zoom}")
    
    if args.analysis:
        log("Analysis complete. Exiting.")
        return
    
    # 4. Preparation (Output Dir)
    if not args.keep and os.path.exists(args.output):
        log(f"Cleaning output directory: {args.output}...")
        shutil.rmtree(args.output, ignore_errors=True)
    os.makedirs(args.output, exist_ok=True)
    
    # Enrichment Config
    enrichment = None
    if args.enrichment_enabled and args.enrichment_texture:
        enrichment = {
            'enabled': True, 'texture': args.enrichment_texture, 'blend_mode': args.enrichment_blend_mode,
            'repeat': args.enrichment_repeat, 'min_level': args.enrichment_min_level, 
            'max_level': args.enrichment_max_level, 'alpha_start': args.enrichment_alpha_start, 
            'alpha_end': args.enrichment_alpha_end
        }
    
    # 5. IO Acceleration (Shared Memory)
    shm_info = None
    shm_blocks = []
    if args.use_shm:
        from multiprocessing import shared_memory
        log("IO Acceleration: Loading datasets into Shared Memory...")
        shm_info = {}
        try:
            for key, path in [('dem', args.dem_file), ('color', args.color_file)]:
                size = os.path.getsize(path)
                shm = shared_memory.SharedMemory(create=True, size=size)
                shm_blocks.append(shm)
                with open(path, 'rb') as f: f.readinto(shm.buf)
                shm_info[key] = {'name': shm.name, 'size': size}
        except Exception as e:
            log(f"Shared Memory setup failed: {e}. Falling back to disk IO.", "WARN")
            shm_info = None

    # 6. Run Tiler Orchestrator
    orchestrator = TilerOrchestrator(args, final_radii)
    try:
        all_meta, (h_min, h_max) = orchestrator.run(enrichment=enrichment, shm_info=shm_info)
        
        # 7. Finalize (Generate Tileset JSON)
        if not all_meta:
            log("No tiles generated.", "ERR")
            return
            
        log("Finalizing tileset structure...")
        if (h_max - h_min) < 100.0:
            mid = (h_max + h_min) / 2.0; h_min = mid - 5000.0; h_max = mid + 5000.0

        if (h_max - h_min) < 100.0:
            mid = (h_max + h_min) / 2.0; h_min = mid - 5000.0; h_max = mid + 5000.0

        generate_s2_json(all_meta, args.output, final_radii, h_min, h_max, root_error, args.max_zoom, debug=args.debug, bake_metadata=args.bake_metadata)
            
        # Summary Stats
        log("==========================================")
        log(f"PLANETARY ELEVATION STATS")
        log(f"Highest Mountain: {h_max:.1f} m")
        log(f"Deepest Valley:   {h_min:.1f} m")
        log("==========================================")
        
        if orchestrator.total_orig_bytes > 0:
            ratio = (orchestrator.total_comp_bytes / orchestrator.total_orig_bytes) * 100.0
            log(f"COMPRESSION SUMMARY")
            log(f"Original Size:   {format_size(orchestrator.total_orig_bytes)}")
            if args.compress:
                 log(f"Compressed Size: {format_size(orchestrator.total_comp_bytes)}")
                 log(f"Ratio:           {ratio:.1f}% of original")
            else:
                 log(f"Output Size:     {format_size(orchestrator.total_comp_bytes)}")
            log("==========================================")
        
        if args.check_borders:
            log(f"BORDER CHECK SUMMARY")
            log(f"Total Vertices Checked: {orchestrator.total_border_checked}")
            log(f"Total Issues Found:     {orchestrator.total_border_issues}")
            log(f"Max Error Detected:     {orchestrator.total_border_max_err:.4f} m")
            log("==========================================")

        total_time = time.time() - start_time
        hours, rem = divmod(total_time, 3600)
        minutes, seconds = divmod(rem, 60)
        log(f"Total Execution Time: {int(hours):02}:{int(minutes):02}:{int(seconds):02}")
        
    except Exception as e:
        log(f"Critical error during tiling: {e}", "ERR")
        traceback.print_exc()
    finally:
        for shm in shm_blocks:
            try: shm.close(); shm.unlink()
            except: pass

if __name__ == "__main__":
    main()