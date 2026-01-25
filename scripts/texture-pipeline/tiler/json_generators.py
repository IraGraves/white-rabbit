"""
JSON generators module for Planet Tiler.
Generates tileset.json files for explicit and implicit tiling modes.
"""

import os
import json
import math

from .utils import log
from .implicit_tiling import BinarySubtreeEncoder








def generate_s2_json(all_meta, output_dir, radii, h_min, h_max, root_error, max_zoom, max_zoom_pole=None, debug=False, bake_metadata=True, heightmap_mode=False):
    """Generates a tileset.json for S2 Tiling (6 Roots, Implicit)."""
    log("Writing S2 tileset.json (3D Tiles 1.1 + S2 Extension)...")
    max_r = max(radii)
    
    subtree_dir = os.path.join(output_dir, "subtrees")
    os.makedirs(subtree_dir, exist_ok=True)
    
    encoder = BinarySubtreeEncoder()
    # Dynamic height based on actual reported metadata
    MAX_SUBTREE_LEVELS = 5
    
    # Root Geometric Error for S2 Face (90 degree arc)
    # The actual geometric error of a flat face approximating a sphere is huge (approx 30% of radius).
    # We set it to 25% of radius to ensure Cesium refines it immediately when getting even remotely close.
    root_error = max_r * 0.25
    
    children = []
    
    # 6 Cube Faces
    # S2 Tokens for faces 0-5 (0 => 1, 1 => 3, 2 => 5, 3 => 7, 4 => 9, 5 => b)
    s2_tokens = [
        "1000000000000000", 
        "3000000000000000", 
        "5000000000000000", 
        "7000000000000000", 
        "9000000000000000", 
        "b000000000000000"
    ]
    
    # Calculate Height Offset
    # We now use h_offset=0 to target the primary ellipsoid of the body.
    # Add 1000m safety buffer to prevent culling due to floating point precision
    safe_h_min = h_min - 1000.0
    safe_h_max = h_max + 1000.0
    h_offset = 0.0

    # Precise Lat/Lon Regions for S2 Faces (in Radians)
    L_BULGE = math.pi / 4.0   # 45 deg
    L_CORNER = 0.61547971     # 35.264 deg
    PI = math.pi
    
    s2_face_regions = [
        [-PI/4.0, -L_BULGE,  PI/4.0,  L_BULGE],   # Face 0
        [ PI/4.0, -L_BULGE,  3*PI/4.0, L_BULGE],  # Face 1 (45 to 135 deg)
        [-PI,      L_CORNER, PI,       PI/2.0],   # Face 2 (North)
        [ 3*PI/4.0,-L_BULGE, -3*PI/4.0, L_BULGE], # Face 3 (Wraps, 135 to -135)
        [-3*PI/4.0,-L_BULGE, -PI/4.0,  L_BULGE],  # Face 4 (-135 to -45 deg)
        [-PI,     -PI/2.0,   PI,      -L_CORNER]  # Face 5 (South)
    ]

    
    for face in range(6):
        # Determine Per-Face Zoom Limit
        face_max_z = max_zoom
        if (face == 2 or face == 5) and max_zoom_pole is not None:
            face_max_z = max_zoom_pole
            
        total_height = face_max_z + 1
        subtree_levels = min(total_height, MAX_SUBTREE_LEVELS)

        # S2 Bounding Volume Extension
        s2_volume = {
            "token": s2_tokens[face],
            "minimumHeight": safe_h_min + h_offset,
            "maximumHeight": safe_h_max + h_offset
        }
        # Bounding Region (Fallback)
        face_reg = s2_face_regions[face]
        region_bv = [
            face_reg[0], face_reg[1], face_reg[2], face_reg[3],
            safe_h_min + h_offset, safe_h_max + h_offset
        ]

        # Calculate OccPoint (Occlusion Point for S2 Face)
        face_normals = [
             [1, 0, 0], [0, 1, 0], [0, 0, 1],
             [-1, 0, 0], [0, -1, 0], [0, 0, -1]
        ]
        occ_dist = (max_r + safe_h_max) * math.sqrt(3.0)
        fn = face_normals[face]
        occ_point = [fn[0] * occ_dist, fn[1] * occ_dist, fn[2] * occ_dist]
        
        root_node = {
            "extras": { "occPoint": occ_point },
            "boundingVolume": { 
                "region": [
                    region_bv[0], region_bv[1], region_bv[2], region_bv[3],
                    region_bv[4], region_bv[5]
                ],
                "extensions": {
                    "3DTILES_bounding_volume_S2": s2_volume
                }
            },
            "geometricError": root_error,
            "refine": "REPLACE",
            "content": { "uri": f"content/{face}/{{level}}_{{x}}_{{y}}.glb" },
            "implicitTiling": {
                "subdivisionScheme": "QUADTREE",
                "subtreeLevels": subtree_levels,
                "availableLevels": total_height,
                "subtrees": { "uri": f"subtrees/face{face}_{{level}}_{{x}}_{{y}}.subtree" }
            }
        }
        children.append(root_node)
        
        # Generate Subtrees for this Face
        def generate_subtree_recursive(face_idx, root_level, current_subtree_root_z, cx, cy, face_max_zoom):
            remaining_levels = (face_max_zoom - current_subtree_root_z) + 1
            this_subtree_height = min(remaining_levels, MAX_SUBTREE_LEVELS)
            has_child_subtrees = remaining_levels > MAX_SUBTREE_LEVELS
            
            # Construct subset meta for this face
            face_meta_subset = {}
            for z in range(current_subtree_root_z, current_subtree_root_z + this_subtree_height):
                if z in all_meta and face_idx in all_meta[z]:
                    face_meta_subset[z] = all_meta[z][face_idx]
                else:
                    face_meta_subset[z] = {}
            
            st_data = encoder.generate_subtree(
                current_subtree_root_z, 
                cx, cy, 
                this_subtree_height, 
                face_meta_subset,
                has_child_subtrees=has_child_subtrees,
                debug=debug,
                bake_metadata=bake_metadata
            )
            
            rel_level = current_subtree_root_z - root_level
            local_x = cx 
            local_y = cy
            
            filename = f"face{face_idx}_{rel_level}_{local_x}_{local_y}.subtree"
            with open(os.path.join(subtree_dir, filename), "wb") as f:
                f.write(st_data)
            
            if has_child_subtrees:
                child_z = current_subtree_root_z + this_subtree_height
                child_scale = 2 ** this_subtree_height
                for dy in range(child_scale):
                    for dx in range(child_scale):
                        child_cx = cx * child_scale + dx
                        child_cy = cy * child_scale + dy
                        
                        if child_z in all_meta and face_idx in all_meta[child_z] and f"{child_cx}_{child_cy}" in all_meta[child_z][face_idx]:
                             generate_subtree_recursive(face_idx, root_level, child_z, child_cx, child_cy, face_max_zoom)

        print(f"[PROGRESS] Generating subtrees for Face {face}/5...          ", end="\r", flush=True)
        generate_subtree_recursive(face, 0, 0, 0, 0, face_max_z)

    # Use a Region for the root
    global_region = [-math.pi, -math.pi/2.0, math.pi, math.pi/2.0, safe_h_min + h_offset, safe_h_max + h_offset]

    # Root Geometric Error
    root_json = {
        "asset": { 
            "version": "1.1", 
            "extras": {
                "ellipsoidRadii": [radii[0], radii[1], radii[2]],
                "tileFormat": "proprietary_heightmap" if heightmap_mode else "standard_3d_tiles"
            }
        },
        "schema": {
            "classes": {
                "tileMetadata": {
                    "properties": {
                        "minHeight": { "type": "SCALAR", "componentType": "FLOAT32" },
                        "maxHeight": { "type": "SCALAR", "componentType": "FLOAT32" },
                        "occPoint": { "type": "VEC3", "componentType": "FLOAT32" }
                    }
                }
            }
        },
        "geometricError": max_r * 10.0,
        "extensionsUsed": ["3DTILES_bounding_volume_S2", "3DTILES_implicit_tiling"],
        "extensionsRequired": ["3DTILES_bounding_volume_S2"],
        "root": {
            "boundingVolume": { "region": global_region },
            "geometricError": max_r * 10.0,
            "refine": "REPLACE",
            "children": children
        }
    }
    
    outfile = os.path.join(output_dir, "tileset.json")
    print(f"Writing: {outfile}")
    with open(outfile, "w") as f:
        json.dump(root_json, f, indent=2)


