"""
JSON generators module for Planet Tiler.
Generates tileset.json files for explicit and implicit tiling modes.
"""

import os
import json
import math

from .utils import log
from .implicit_tiling import BinarySubtreeEncoder


def generate_explicit_json(all_meta, output_dir, radii, h_min, h_max, root_error, min_zoom, max_zoom):
    """Generates a tileset.json with explicit tile hierarchy."""
    log("Writing explicit tileset.json...")
    max_r = max(radii)
    
    def build_tree(zoom, x, y, parent_center_ecef=None):
        key = f"{x}_{y}"
        if zoom not in all_meta or key not in all_meta[zoom]: return None
        meta = all_meta[zoom][key]
        
        # Absolute World Position (ECEF)
        cx, cy, cz = meta['center']
        
        # Calculate Bounding Box
        mx, my, mz = meta['min']
        Mx, My, Mz = meta['max']
        local_mid_x = (mx + Mx) / 2
        local_mid_y = (my + My) / 2
        local_mid_z = (mz + Mz) / 2
        half_diag = math.sqrt((Mx-mx)**2 + (My-my)**2 + (Mz-mz)**2) / 2
        
        if parent_center_ecef is None:
            # === ROOT NODE ===
            transform_matrix = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                cx, cy, cz, 1
            ]
        else:
            # === CHILD NODE ===
            p_cx, p_cy, p_cz = parent_center_ecef
            dx = cx - p_cx
            dy = cy - p_cy
            dz = cz - p_cz
            
            transform_matrix = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                dx, dy, dz, 1
            ]

        node = {
            "boundingVolume": { 
                "sphere": [local_mid_x, local_mid_y, local_mid_z, half_diag] 
            },
            "geometricError": meta['geometricError'],
            "transform": transform_matrix, 
            "refine": "REPLACE",
            "content": { "uri": f"{zoom}/{x}_{y}.glb" }
        }
        
        children = []
        if zoom < max_zoom:
            for dx in [0, 1]:
                for dy in [0, 1]:
                    child = build_tree(zoom+1, x*2 + dx, y*2 + dy, parent_center_ecef=(cx, cy, cz))
                    if child: children.append(child)
        
        if children:
            node["children"] = children
            
        return node
    
    root_json = {
        "asset": { "version": "1.1", "generator": "Planet Tiler Final" },
        "geometricError": 1000000.0,
        "root": {
            "boundingVolume": { "sphere": [0,0,0, max_r * 1.5] },
            "geometricError": 1000000.0,
            "refine": "ADD",
            "children": []
        }
    }
    
    # Start recursion for level 0 (parent_center_ecef=None)
    for x in range(2):
        node = build_tree(min_zoom, x, 0, parent_center_ecef=None)
        if node: root_json["root"]["children"].append(node)
        
    outfile = os.path.join(output_dir, "tileset.json")
    print(f"Writing: {outfile}")
    with open(outfile, "w") as f:
        json.dump(root_json, f, indent=2)


def generate_implicit_json(all_meta, output_dir, radii, h_min, h_max, root_error, min_zoom, max_zoom, debug=False):
    """Generates a tileset.json with 3D Tiles 1.1 implicit tiling."""
    log("Writing implicit tileset.json (3D Tiles 1.1)...")
    max_r = max(radii)
    
    subtree_dir = os.path.join(output_dir, "subtrees")
    os.makedirs(subtree_dir, exist_ok=True)
    
    encoder = BinarySubtreeEncoder()
    # Total height limited to what was actually generated in metadata
    total_height = max_zoom + 1
    
    # Subtree chunking: limit subtree to MAX_SUBTREE_LEVELS
    MAX_SUBTREE_LEVELS = 5
    subtree_levels = min(total_height, MAX_SUBTREE_LEVELS)
    
    # Warning for deep zooms
    if total_height > 10:
        log(f"WARNING: Deep zoom detected ({total_height} levels). "
            f"Subtrees are chunked to {MAX_SUBTREE_LEVELS} levels each. "
            f"This may generate many subtree files.", "WARN")
    
    # Calculate geometric error at Zoom 0 using industry standard ratio
    # Approx side_length / 512 (assuming 512px tiles)
    # Side length at L0 = Circumference / 4
    root_error = (max_r * math.pi) / (2.0 * 512.0)
    
    # Define the 2 root nodes for the tileset
    # West Hemisphere: Lon -180 to 0 (-PI to 0)
    west_region = [-math.pi, -math.pi/2, 0, math.pi/2, h_min, h_max]
    west_root = {
        "boundingVolume": { 
            "region": [
                west_region[0], west_region[1], west_region[2], west_region[3],
                "tileMetadata.minHeight", "tileMetadata.maxHeight"
            ]
        }, 
        "geometricError": root_error,
        "refine": "REPLACE",
        # Content uses URI template for implicit tiling
        "content": { "uri": "west/{level}/{x}_{y}.glb" },
        "implicitTiling": {
            "subdivisionScheme": "QUADTREE",
            "subtreeLevels": subtree_levels, 
            "availableLevels": total_height,
            "subtrees": { "uri": "subtrees/west_{level}_{x}_{y}.subtree" }
        }
    }
    
    # East Hemisphere: Lon 0 to 180 (0 to PI)
    east_region = [0, -math.pi/2, math.pi, math.pi/2, h_min, h_max]
    east_root = {
        "boundingVolume": { 
            "region": [
                east_region[0], east_region[1], east_region[2], east_region[3],
                "tileMetadata.minHeight", "tileMetadata.maxHeight"
            ]
        }, 
        "geometricError": root_error,
        "refine": "REPLACE",
        # Content uses URI template for implicit tiling
        "content": { "uri": "east/{level}/{x}_{y}.glb" },
        "implicitTiling": {
            "subdivisionScheme": "QUADTREE",
            "subtreeLevels": subtree_levels, 
            "availableLevels": total_height,
            "subtrees": { "uri": "subtrees/east_{level}_{x}_{y}.subtree" }
        }
    }
    
    # Generate Subtrees with chunking
    # For now, generate root subtrees. For deeper levels, viewers will request
    # additional subtrees based on the URI template (e.g., west_{level}_{x}_{y}.subtree)
    def generate_subtree_recursive(side_name, global_x_offset, root_level, current_subtree_root_z, cx, cy):
        """
        Generates subtree files recursively in chunks of MAX_SUBTREE_LEVELS.
        
        Args:
            side_name: "west" or "east"
            global_x_offset: 0 for west, 1 for east (at min_zoom)
            root_level: The min_zoom level
            current_subtree_root_z: The current subtree root level
            cx, cy: The current subtree root x, y (relative to this subtree's level)
        """
        # Calculate how many levels this subtree covers
        remaining_levels = (max_zoom - current_subtree_root_z) + 1
        this_subtree_height = min(remaining_levels, MAX_SUBTREE_LEVELS)
        
        # Check if there are child subtrees (levels beyond this subtree)
        has_child_subtrees = remaining_levels > MAX_SUBTREE_LEVELS
        
        # Generate this subtree
        st_data = encoder.generate_subtree(
            current_subtree_root_z, 
            cx, cy, 
            this_subtree_height, 
            all_meta,
            has_child_subtrees=has_child_subtrees,
            debug=debug,
            bake_metadata=False
        )
        
        # Determine filename based on relative level within the implicit tree
        rel_level = current_subtree_root_z - root_level
        # Calculate position within the local implicit quadtree
        # Each root starts its own coordinate space at (0,0)
        local_x = cx - (global_x_offset * (2 ** current_subtree_root_z))
        local_y = cy
        
        filename = f"{side_name}_{rel_level}_{local_x}_{local_y}.subtree"
        with open(os.path.join(subtree_dir, filename), "wb") as f:
            f.write(st_data)
        
        # Recursively generate child subtrees if needed
        if has_child_subtrees:
            child_z = current_subtree_root_z + this_subtree_height
            # At the bottom of this subtree, there are 2^(this_subtree_height-1) x 2^(this_subtree_height-1) potential children
            # Each child subtree covers the next chunk of levels
            child_scale = 2 ** this_subtree_height
            for dy in range(2 ** this_subtree_height):
                for dx in range(2 ** this_subtree_height):
                    child_cx = cx * child_scale + dx
                    child_cy = cy * child_scale + dy
                    # Only generate if there's data in this region
                    # Check if any tiles exist at the child level
                    if child_z in all_meta:
                        key = f"{child_cx}_{child_cy}"
                        if key in all_meta[child_z]:
                            generate_subtree_recursive(
                                side_name, global_x_offset, root_level,
                                child_z, child_cx, child_cy
                            )
    
    # Generate West subtrees starting from root
    log("Generating West hemisphere subtrees...")
    generate_subtree_recursive("west", 0, 0, 0, 0, 0)
    
    # Generate East subtrees starting from root
    log("Generating East hemisphere subtrees...")
    generate_subtree_recursive("east", 1, 0, 0, 1, 0)

    # Simplified Tileset JSON
    # Large GE for root (which has no content) to force refinement to hemispheres
    root_json = {
        "asset": { "version": "1.1", "generator": "Planet Tiler Implicit" },
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
        "geometricError": 1000000.0,
        "root": {
            "boundingVolume": { "region": [-math.pi, -math.pi/2, math.pi, math.pi/2, h_min, h_max] },
            "geometricError": 1000000.0,
            "refine": "REPLACE",
            "children": [
               west_root,
               east_root
            ]
        }
    }
    
    outfile = os.path.join(output_dir, "tileset.json")
    print(f"Writing: {outfile}")
    with open(outfile, "w") as f:
        json.dump(root_json, f, indent=2)


def generate_s2_json(all_meta, output_dir, radii, h_min, h_max, root_error, max_zoom, debug=False):
    """Generates a tileset.json for S2 Tiling (6 Roots, Implicit)."""
    log("Writing S2 tileset.json (3D Tiles 1.1 + S2 Extension)...")
    max_r = max(radii)
    
    subtree_dir = os.path.join(output_dir, "subtrees")
    os.makedirs(subtree_dir, exist_ok=True)
    
    encoder = BinarySubtreeEncoder()
    # Dynamic height based on actual reported metadata
    total_height = max_zoom + 1
    MAX_SUBTREE_LEVELS = 5
    subtree_levels = min(total_height, MAX_SUBTREE_LEVELS)
    
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
    # The S2 face boundaries are NOT constant Lat/Lon lines.
    # Corners are at +/- atan(1/sqrt(2)) = +/- 0.6154797 rad (~35.26 deg).
    # Edge midpoints are at +/- atan(1) = +/- PI/4 rad (45 deg).
    # To be perfectly correct and efficient, we use the 45 deg limit for equatorial faces
    # and the 35.26 deg limit for the pole caps.
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
        # S2 Bounding Volume Extension
        s2_volume = {
            "token": s2_tokens[face],
            "minimumHeight": safe_h_min + h_offset,
            "maximumHeight": safe_h_max + h_offset
        }
        # Bounding Region (Fallback) - Much better for culling than a planet-sized sphere
        face_reg = s2_face_regions[face]
        region_bv = [
            face_reg[0], face_reg[1], face_reg[2], face_reg[3],
            safe_h_min + h_offset, safe_h_max + h_offset
        ]
        
        root_node = {
            "boundingVolume": { 
                "region": [
                    region_bv[0], region_bv[1], region_bv[2], region_bv[3],
                    "tileMetadata.minHeight", "tileMetadata.maxHeight"
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
        def generate_subtree_recursive(face_idx, root_level, current_subtree_root_z, cx, cy):
            remaining_levels = (max_zoom - current_subtree_root_z) + 1
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
                bake_metadata=False
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
                             generate_subtree_recursive(face_idx, root_level, child_z, child_cx, child_cy)

        print(f"[PROGRESS] Generating subtrees for Face {face}/5...          ", end="\r", flush=True)
        generate_subtree_recursive(face, 0, 0, 0, 0)

    # Use a Region for the root to improve horizon culling and selection accuracy
    global_region = [-math.pi, -math.pi/2.0, math.pi, math.pi/2.0, safe_h_min + h_offset, safe_h_max + h_offset]

    # Root Geometric Error (Professional Default: ~10x radius for global context)
    root_json = {
        "asset": { 
            "version": "1.1", 
            "generator": "Planet Tiler S2",
            "extras": {
                "ellipsoidRadii": [radii[0], radii[1], radii[2]] 
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

def generate_s2_explicit_json(all_meta, output_dir, radii, h_min, h_max, root_error, min_zoom, max_zoom):
    """Generates a tileset.json for S2 Tiling with Explicit hierarchy (non-implicit)."""
    log("Writing explicit S2 tileset.json...")
    max_r = max(radii)
    
    # Root Geometric Error for S2 Face
    root_error = max_r * 0.25
    safe_h_max = total_h_max + 1000.0

    s2_face_regions = [
        [-math.pi/4.0, -math.pi/4.0,  math.pi/4.0,  math.pi/4.0],   # Face 0
        [ math.pi/4.0, -math.pi/4.0,  3*math.pi/4.0, math.pi/4.0],  # Face 1
        [-math.pi,      0.61547971, math.pi,       math.pi/2.0],  # Face 2
        [ 3*math.pi/4.0,-math.pi/4.0, -3*math.pi/4.0, math.pi/4.0], # Face 3
        [-3*math.pi/4.0,-math.pi/4.0, -math.pi/4.0,  math.pi/4.0],  # Face 4
        [-math.pi,     -math.pi/2.0,   math.pi,      -0.61547971]  # Face 5
    ]

    def build_s2_branch(face, zoom, x, y):
        key = f"{x}_{y}"
        if zoom not in all_meta or face not in all_meta[zoom] or key not in all_meta[zoom][face]:
            return None
        
        meta = all_meta[zoom][face][key]
        
        node = {
            "boundingVolume": { 
                "region": [
                    -math.pi, -math.pi/2, math.pi, math.pi/2, # Broad fallback
                    safe_h_min, safe_h_max
                ]
            },
            "geometricError": meta.get('geometricError', root_error / (2**zoom)),
            "content": { "uri": f"content/{face}/{zoom}_{x}_{y}.glb" },
            "refine": "REPLACE"
        }

        if zoom < args.max_zoom:
            children = []
            for dx in [0, 1]:
                for dy in [0, 1]:
                    child = build_s2_branch(face, zoom + 1, x * 2 + dx, y * 2 + dy)
                    if child: children.append(child)
            if children:
                node["children"] = children
        
        return node

    roots = []
    for face in range(6):
        node = build_s2_branch(face, 0, 0, 0)
        if node:
             # Add root face region for better culling
             node["boundingVolume"]["region"] = [
                 s2_face_regions[face][0], s2_face_regions[face][1],
                 s2_face_regions[face][2], s2_face_regions[face][3],
                 safe_h_min, safe_h_max
             ]
             roots.append(node)

    root_json = {
        "asset": { 
            "version": "1.1", 
            "generator": "Planet Tiler S2 Explicit",
            "extras": { "ellipsoidRadii": [radii[0], radii[1], radii[2]] }
        },
        "geometricError": max_r * 10.0,
        "root": {
            "boundingVolume": { "region": [-math.pi, -math.pi/2, math.pi, math.pi/2, safe_h_min, safe_h_max] },
            "geometricError": max_r * 10.0,
            "refine": "REPLACE",
            "children": roots
        }
    }

    outfile = os.path.join(args.output, "tileset.json")
    print(f"Writing: {outfile}")
    with open(outfile, "w") as f:
        json.dump(root_json, f, indent=2)
