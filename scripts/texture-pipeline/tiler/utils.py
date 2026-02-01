"""
Utility functions for Planet Tiler.
Core helpers for coordinate conversion, raster reading, and logging.

Refactored: Now re-exports from math_s2 and io.
"""

from .math_s2 import (
    latlon_to_ecef,
    latlon_to_ecef_vec,
    get_tile_bounds,
    s2_face_uv_to_xyz,
    s2_face_uv_to_xyz_vec,
    s2_xyz_to_latlon_vec,
    s2_xyz_to_latlon,
    get_s2_tile_bounds,
    sample_bilinear_vec
)

from .io import (
    is_s2_face_path,
    load_bodies,
    log,
    inspect_file,
    get_radius_from_file,
    read_raster_window,
    sample_s2_atlas
)
