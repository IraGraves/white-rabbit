"""
JSON generators module for Planet Tiler.
Generates tileset.json files for explicit and implicit tiling modes.
"""

import os
import json
import math

from .utils import log
from .implicit_tiling import BinarySubtreeEncoder


def generate_explicit_json(args, all_meta, max_r, radii):
    """Generates a tileset.json with explicit tile hierarchy."""
    log("Writing explicit tileset.json...")
    
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
        if zoom < args.max_zoom:
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
            "geometricError": 500000.0,
            "refine": "ADD",
            "children": []
        }
    }
    
    # Start recursion for level 0 (parent_center_ecef=None)
    for x in range(2):
        node = build_tree(args.min_zoom, x, 0, parent_center_ecef=None)
        if node: root_json["root"]["children"].append(node)
        
    outfile = os.path.join(args.output, "tileset.json")
    print(f"Writing: {outfile}")
    with open(outfile, "w") as f:
        json.dump(root_json, f, indent=2)


def generate_implicit_json(args, all_meta, max_r, radii, total_h_min, total_h_max):
    """Generates a tileset.json with 3D Tiles 1.1 implicit tiling."""
    log("Writing implicit tileset.json (3D Tiles 1.1)...")
    
    subtree_dir = os.path.join(args.output, "subtrees")
    os.makedirs(subtree_dir, exist_ok=True)
    
    encoder = BinarySubtreeEncoder()
    # Total height across all levels
    total_height = (args.max_zoom - args.min_zoom) + 1
    
    # Subtree chunking: limit subtree to MAX_SUBTREE_LEVELS to prevent exponential memory growth
    MAX_SUBTREE_LEVELS = 5
    subtree_levels = min(total_height, MAX_SUBTREE_LEVELS)
    
    # Warning for deep zooms
    if total_height > 10:
        log(f"WARNING: Deep zoom detected ({total_height} levels). "
            f"Subtrees are chunked to {MAX_SUBTREE_LEVELS} levels each. "
            f"This may generate many subtree files.", "WARN")
    
    # Calculate geometric error using the same formula as tile generation
    root_error = 200000.0 / (2 ** args.min_zoom)
    
    # Define the 2 root nodes for the tileset
    # West Hemisphere: Lon -180 to 0 (-PI to 0)
    west_region = [-math.pi, -math.pi/2, 0, math.pi/2, total_h_min, total_h_max]
    west_root = {
        "boundingVolume": { "region": west_region }, 
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
    east_region = [0, -math.pi/2, math.pi, math.pi/2, total_h_min, total_h_max]
    east_root = {
        "boundingVolume": { "region": east_region }, 
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
        remaining_levels = (args.max_zoom - current_subtree_root_z) + 1
        this_subtree_height = min(remaining_levels, MAX_SUBTREE_LEVELS)
        
        # Check if there are child subtrees (levels beyond this subtree)
        has_child_subtrees = remaining_levels > MAX_SUBTREE_LEVELS
        
        # Generate this subtree
        st_data = encoder.generate_subtree(
            current_subtree_root_z, 
            cx, cy, 
            this_subtree_height, 
            all_meta,
            has_child_subtrees=has_child_subtrees
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
    generate_subtree_recursive("west", 0, args.min_zoom, args.min_zoom, 0, 0)
    
    # Generate East subtrees starting from root
    log("Generating East hemisphere subtrees...")
    generate_subtree_recursive("east", 1, args.min_zoom, args.min_zoom, 1 * (2 ** args.min_zoom), 0)

    # Simplified Tileset JSON
    root_json = {
        "asset": { "version": "1.1", "generator": "Planet Tiler Implicit" },
        "geometricError": root_error * 2.0,
        "root": {
            # Root covers entire planet
            "boundingVolume": { "region": [-math.pi, -math.pi/2, math.pi, math.pi/2, total_h_min, total_h_max] },
            "geometricError": root_error * 2.0,
            "refine": "ADD",
            "children": [
               west_root,
               east_root
            ]
        }
    }
    
    outfile = os.path.join(args.output, "tileset.json")
    print(f"Writing: {outfile}")
    with open(outfile, "w") as f:
        json.dump(root_json, f, indent=2)

