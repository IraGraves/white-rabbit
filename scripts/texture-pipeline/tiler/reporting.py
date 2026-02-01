"""
Reporting Utilities.
Handles analysis reports and summary output.
"""

import math
from .io import log

def report_texture_analysis(texture_definitions, dem_info, min_zoom, max_zoom):
    """Prints a detailed analysis of texture usage and LOD sampling."""
    
    log("\n=== Texture Usage Analysis ===")
    for tex in texture_definitions:
        info = tex.get("info", {})
        ov = info.get("overviews", 0)
        w = info.get("width", "?")
        h = info.get("height", "?")
        log(f"Texture: {tex['name']:<15} | Input: {w}x{h} | Target Tile Size: {tex['size']} | Overviews: {ov}")

    log("\n=== LOD Sampling Table (Global Geodetic) ===")
    # Header
    header = f"{'Lvl':<4} | {'Deg/Px':<10} | {'DEM Source':<20}"
    for tex in texture_definitions:
        header += f" | {tex['name']:<20}"
    log(header)
    log("-" * len(header))

    # Table Rows
    dem_width = dem_info.get('width', 0)
    if dem_width == 0:
        log("Error: DEM width is 0 or missing.")
        return

    base_dem_res = 360.0 / dem_width
    dem_ov = dem_info.get('overviews', 0)
    
    for z in range(min_zoom, max_zoom + 1):
        # Tile Resolution (assuming 256px standard tiles for calculation reference)
        # Global Geodetic: 2 root tiles => width is 2 * 2^z tiles.
        tiles_x = 2 * (2**z)
        out_res = 360.0 / (tiles_x * 256.0)
        
        # DEM Analysis
        dem_mag = out_res / base_dem_res
        
        if dem_mag < 1.0:
            dem_src = f"Upscale (x{1/dem_mag:.1f})"
        elif dem_mag < 1.01:
            dem_src = "Original"
        else:
             # Downscaling / Overview Logic for DEM
            ideal_ov = math.log2(dem_mag) - 1
            idx = int(round(ideal_ov))
            idx = max(0, idx)
            
            if idx < dem_ov:
                dem_src = f"Ov {idx} (/{dem_mag:.1f})"
            elif dem_ov > 0:
                dem_src = f"Ov {dem_ov-1} (Max) (/{dem_mag:.1f}) *"
            else:
                dem_src = f"Downscale (/{dem_mag:.1f})"
        
        row = f"{z:<4} | {out_res:<10.6f} | {dem_src:<20}"
        
        # Texture Analysis
        for tex in texture_definitions:
            t_info = tex.get("info")
            if not t_info: 
                row += f" | {'Error':<20}"
                continue
                
            t_width = t_info.get('width', 0)
            t_ov = t_info.get('overviews', 0)
            
            if t_width == 0:
                row += f" | {'Invalid W':<20}"
                continue

            # Source Resolution
            t_res = 360.0 / t_width
            
            # Downsample Factor = OutRes / InRes
            mag = out_res / t_res
            
            if mag < 1.0:
                note = f"Upscale (x{1/mag:.1f})"
            elif mag < 1.01:
                 note = "Original"
            else:
                ideal_ov = math.log2(mag) - 1
                idx = int(round(ideal_ov))
                idx = max(0, idx)
                
                if idx < t_ov:
                    note = f"Ov {idx} (/{mag:.1f})"
                elif t_ov > 0:
                    note = f"Ov {t_ov-1} (Max) (/{mag:.1f}) *"
                else:
                    note = f"Downscale (/{mag:.1f})"
                        
            row += f" | {note:<20}"
        log(row)

    log("\nAnalysis complete. Exiting.")
