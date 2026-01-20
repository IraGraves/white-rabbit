import os
import json
import argparse
import sys
from .utils import log

def get_parser():
    """Creates and returns the argument parser for Planet Tiler."""
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
    parser.add_argument("--planetocentric", action="store_true", help="Use simplified Planetocentric coordinates (spherical scaling) instead of Geodetic.")
    parser.add_argument("--projection", default="s2", help="Projection/Tiling Scheme (Deprecated/Ignored: Always uses s2).")
    # parser.add_argument("--explicit-tiling", action="store_true", help="Use explicit (recursive) tileset structure instead of Implicit Tiling 1.1.")
    parser.add_argument("--supersample", type=int, default=1, help="Texture super-sampling factor (1=Off, 2=4x, 4=16x).")
    parser.add_argument("--draco-compression-level", type=int, default=7, help="Draco effort/compression level (0-10, default: 7). Higher is smaller/slower.")
    parser.add_argument("--draco-quant-pos", type=int, default=12, help="Draco quantization bits for position (1-16, default: 12). Higher is better quality.")
    parser.add_argument("--ktx2-quality", type=int, default=128, help="KTX2 etc1s quality (1-255, default: 128). Higher is better quality.")
    parser.add_argument("--ktx2-compression", type=int, default=1, help="KTX2 etc1s effort/compression level (0-5, default: 1). Higher is smaller/slower.")
    parser.add_argument("--ktx2-mode", default="etc1s", choices=["etc1s", "uastc"], help="KTX2 encoding mode (default: etc1s).")
    parser.add_argument("--ktx2-uastc-quality", type=int, default=2, help="KTX2 uastc quality (0-4, default: 2).")
    parser.add_argument("--ktx2-zstd", type=int, default=0, help="KTX2 ZStandard supercompression level (0-22, default: 0=Disabled).")
    parser.add_argument("--debug", action="store_true", help="Enable verbose debug output.")
    parser.add_argument("--skirts", action="store_true", help="Enable skirt generation for S2 tiles to hide gaps.")
    parser.add_argument("--use-shm", action="store_true", help="Enables input file caching in Shared Memory for maximum speed.")
    parser.add_argument("--use-optimized-dem", action="store_true", help="Uses pre-projected S2 DEM face COGs.")
    parser.add_argument("--use-optimized-color", action="store_true", help="Uses pre-projected S2 Color face COGs.")
    parser.add_argument("--working-dir", help="Path for temporary processing files (e.g. R:\\ for RAM disk). Default: output directory.")
    parser.add_argument("--bake-metadata", action="store_true", help="Bake tile metadata (minHeight, maxHeight, occPoint) into subtrees.")
    parser.add_argument("--dem-padding", type=int, default=0, help="Padding pixels in optimized S2 DEM faces (Default: 0).")
    parser.add_argument("--color-padding", type=int, default=0, help="Padding pixels in optimized S2 Color faces (Default: 0).")
    parser.add_argument("--dem-padding-mode", default="metadata", choices=["none", "metadata", "resolution", "manual"], help="S2 DEM padding detection mode.")
    parser.add_argument("--color-padding-mode", default="metadata", choices=["none", "metadata", "resolution", "manual"], help="S2 Color padding detection mode.")
    
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
    
    # Border Check
    parser.add_argument("--check-borders", action="store_true", help="Check borders of adjacent tiles for mismatching vertices before compression.")
    return parser

def resolve_config():
    """Parses CLI arguments and merges them with an optional JSON config file."""
    parser = get_parser()
    
    # 1. Pre-Check for Config File
    temp_args, _ = parser.parse_known_args()
    
    if temp_args.config:
        config_path = temp_args.config
        if os.path.exists(config_path):
            with open(config_path, "r") as f:
                cfg = json.load(f)
            
            # Translate Config Keys (JSON) to Argparse Arguments
            config_args = []
            positionals = []
            
            # Get valid argument names from parser (strip -- prefix and internal underscore mapping)
            valid_actions = {a.dest for a in parser._actions if not isinstance(a, argparse._HelpAction)}
            
            for key, value in cfg.items():
                if value is None or value == "":
                    continue
                
                # Normalize boolean strings
                if isinstance(value, str):
                    if value.lower() == "true": value = True
                    elif value.lower() == "false": value = False
                
                # Handle Positional Files
                if key == "dem_file":
                    positionals.insert(0, value)
                    continue
                if key == "color_file":
                    positionals.append(value)
                    continue

                # IMPORTANT: Skip keys that are not valid CLI arguments (e.g. GUI-only state)
                # Key in JSON is usually like 'use_shm', action.dest is also 'use_shm'.
                if key not in valid_actions:
                    log(f"Ignoring unrecognized config key: '{key}'", "WARN")
                    continue

                # Handle Flags and Options
                arg_key = key.replace("_", "-")
                if isinstance(value, bool):
                    if value: config_args.append(f"--{arg_key}")
                else:
                    config_args.extend([f"--{arg_key}", str(value)])
            
            # Re-parse with new config values FIRST, then normal args (CLI overrides config)
            new_argv = positionals + config_args + sys.argv[1:]
            args = parser.parse_args(new_argv)
        else:
            log(f"Config file not found: {config_path}", "ERR")
            return None
    else:
        args = parser.parse_args()

    if not args.dem_file or not args.color_file:
        parser.print_help()
        print("\nError: 'dem_file' and 'color_file' are required.")
        return None

    # Sanitize paths
    if args.working_dir:
        args.working_dir = args.working_dir.strip().rstrip('\\/')
        if not args.working_dir:
            args.working_dir = None
            
    return args
