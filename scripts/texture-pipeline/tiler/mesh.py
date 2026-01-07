"""
Mesh generation module for Planet Tiler.
Contains functions for creating GLB terrain tiles.
"""

import math
import numpy as np
from osgeo import gdal
from PIL import Image
import io
from pygltflib import (
    GLTF2, Scene, Node, Mesh, Primitive, Buffer, BufferView, Accessor,
    Material, PbrMetallicRoughness, Texture, TextureInfo, Image as GLTFImage, Sampler
)

from .utils import get_tile_bounds, read_raster_window, latlon_to_ecef


# ============== TEXTURE ENRICHMENT FUNCTIONS ==============

def calc_enrichment_alpha(zoom, min_level, max_level, alpha_start, alpha_end):
    """
    Industry-standard linear interpolation of alpha across LOD levels.
    Used by CryEngine (detail layer view distance ratio) and Unreal (distance-based Lerp).
    """
    if zoom < min_level:
        return 0.0
    if zoom >= max_level:
        return alpha_end
    t = (zoom - min_level) / max(1, max_level - min_level)
    return alpha_start + t * (alpha_end - alpha_start)


def blend_overlay(base, detail):
    """
    Overlay blend mode: combines Multiply and Screen.
    For each channel: if base < 0.5: 2*base*detail, else: 1 - 2*(1-base)*(1-detail)
    Industry standard for terrain detail textures (preserves base lighting).
    """
    base_arr = np.array(base, dtype=np.float32) / 255.0
    detail_arr = np.array(detail, dtype=np.float32) / 255.0
    
    mask = base_arr < 0.5
    result = np.where(mask, 
                      2 * base_arr * detail_arr,
                      1 - 2 * (1 - base_arr) * (1 - detail_arr))
    return Image.fromarray((np.clip(result, 0, 1) * 255).astype(np.uint8))


def blend_multiply(base, detail):
    """Multiply blend: darkens base (good for shadows, dirt, cracks)."""
    base_arr = np.array(base, dtype=np.float32) / 255.0
    detail_arr = np.array(detail, dtype=np.float32) / 255.0
    result = base_arr * detail_arr
    return Image.fromarray((result * 255).astype(np.uint8))


def blend_soft_light(base, detail):
    """
    Soft Light blend: subtle version of Overlay.
    Uses Pegtop formula: (1-2*detail)*base^2 + 2*detail*base
    """
    base_arr = np.array(base, dtype=np.float32) / 255.0
    detail_arr = np.array(detail, dtype=np.float32) / 255.0
    result = (1 - 2*detail_arr) * (base_arr**2) + 2*detail_arr*base_arr
    return Image.fromarray((np.clip(result, 0, 1) * 255).astype(np.uint8))


def apply_enrichment(base_img, detail_path, blend_mode, repeat, alpha):
    """
    Apply detail texture enrichment with specified blend mode.
    Returns enriched image and luminance array for optional normal perturbation.
    """
    if not detail_path or alpha <= 0:
        return base_img, None
    
    try:
        detail = Image.open(detail_path).convert('RGB')
    except Exception as e:
        print(f"[WARN] Could not load enrichment texture: {e}")
        return base_img, None
    
    size = base_img.size[0]
    
    # Tile the detail texture
    tile_size = max(1, size // repeat)
    detail_resized = detail.resize((tile_size, tile_size), Image.LANCZOS)
    detail_tiled = Image.new('RGB', (size, size))
    for x in range(repeat):
        for y in range(repeat):
            detail_tiled.paste(detail_resized, (x * tile_size, y * tile_size))
    
    # Calculate luminance for normal perturbation (before blending)
    detail_arr = np.array(detail_tiled, dtype=np.float32)
    luminance = (0.299 * detail_arr[:,:,0] + 0.587 * detail_arr[:,:,1] + 0.114 * detail_arr[:,:,2]) / 255.0
    
    # Apply blend mode
    if blend_mode == 'overlay':
        blended = blend_overlay(base_img, detail_tiled)
    elif blend_mode == 'multiply':
        blended = blend_multiply(base_img, detail_tiled)
    elif blend_mode == 'soft_light':
        blended = blend_soft_light(base_img, detail_tiled)
    else:  # 'alpha' - simple replacement
        blended = detail_tiled
    
    # Final alpha blend with original: lerp(base, blended, alpha)
    result = Image.blend(base_img, blended, alpha)
    return result, luminance


def perturb_normals_from_detail(nx, ny, nz, detail_luminance, alpha, tile_size):
    """
    Perturb mesh normals based on detail texture luminance.
    Uses Partial Derivative Blending (UDN method) - industry standard from Unreal/Unity.
    The luminance acts as a pseudo-heightmap for micro-slope calculation.
    """
    if detail_luminance is None or alpha <= 0:
        return nx, ny, nz
    
    # Resize luminance to match mesh resolution
    lum_img = Image.fromarray((detail_luminance * 255).astype(np.uint8))
    lum_resized = np.array(lum_img.resize((tile_size, tile_size), Image.BILINEAR)) / 255.0
    
    # Calculate gradients (pseudo-slopes from luminance)
    dy, dx = np.gradient(lum_resized)
    
    # Scale perturbation by alpha (subtle effect)
    perturbation_strength = alpha * 0.5
    dx_pert = dx.flatten() * perturbation_strength
    dy_pert = dy.flatten() * perturbation_strength
    
    # Perturb normals (simplified tangent-space perturbation in world space)
    # This adds micro-detail to the existing normals
    nx_new = nx - dx_pert
    ny_new = ny - dy_pert
    
    # Re-normalize
    length = np.sqrt(nx_new**2 + ny_new**2 + nz**2)
    length[length < 0.001] = 1.0  # Avoid division by zero
    
    return nx_new / length, ny_new / length, nz / length

# ============== END ENRICHMENT FUNCTIONS ==============


def calculate_normals_ecef(heights_flip, lons_grid, lats_grid, radii, height_scale, tile_size):
    """
    Calculates normals for an ellipsoid.
    radii: (rx, ry, rz)
    """
    rx, ry, rz = radii
    
    # 1. Gradients (Slope in Grid)
    dy, dx = np.gradient(heights_flip)
    
    # 2. Local Scaling (Metric)
    cos_lat = np.cos(lats_grid)
    
    # Mean Radius at this latitude for scaling estimation
    r_mean = (rx + ry + rz) / 3.0 
    
    d_lat_rad = abs(lats_grid[-1,0] - lats_grid[0,0]) / (tile_size - 1) if tile_size > 1 else 1.0
    scale_y = r_mean * d_lat_rad # Meters per Pixel Lat
    
    d_lon_rad = abs(lons_grid[0,-1] - lons_grid[0,0]) / (tile_size - 1) if tile_size > 1 else 1.0
    scale_x = r_mean * cos_lat * d_lon_rad # Meters per Pixel Lon
    
    scale_x[scale_x < 0.1] = 0.1
    
    # 3. Tangent Space Slope (in Metern)
    dx_met = dx * (height_scale / scale_x)
    dy_met = dy * (height_scale / scale_y)
    
    # Tangent Vectors (Local Frame)
    sin_lon = np.sin(lons_grid)
    cos_lon = np.cos(lons_grid)
    sin_lat = np.sin(lats_grid)
    
    east_x = -sin_lon
    east_y = cos_lon
    east_z = np.zeros_like(lats_grid)
    
    north_x = -sin_lat * cos_lon
    north_y = -sin_lat * sin_lon
    north_z = cos_lat 
    
    # Base Normal (Ellipsoid)
    nx_base = cos_lat * cos_lon / rx
    ny_base = cos_lat * sin_lon / ry
    nz_base = sin_lat / rz
    
    # Normalize Base
    len_base = np.sqrt(nx_base**2 + ny_base**2 + nz_base**2)
    nx_base /= len_base
    ny_base /= len_base
    nz_base /= len_base
    
    # Final Normal by tilting Base along East (-dx) and North (-dy)
    nx = nx_base - dx_met * east_x - dy_met * north_x
    ny = ny_base - dx_met * east_y - dy_met * north_y
    nz = nz_base - dx_met * east_z - dy_met * north_z
    
    # Re-Normalize
    norm = np.sqrt(nx*nx + ny*ny + nz*nz)
    return nx/norm, ny/norm, nz/norm


def create_glb(tx, ty, zoom, dem_ds, color_ds, path, radii, tile_size, texture_size, height_scale, roughness, metallic, is_explicit_tiling=True, enrichment=None):
    """
    Creates a GLB terrain tile from DEM and color rasters.
    
    radii: Tuple (rx, ry, rz)
    is_explicit_tiling: If True, tileset.json handles positioning. If False, GLTF node translation is set.
    enrichment: Optional dict with keys: enabled, texture, blend_mode, repeat, min_level, max_level, 
                alpha_start, alpha_end, affect_normals
    """
    min_lon, min_lat, max_lon, max_lat = get_tile_bounds(tx, ty, zoom)
    
    # 1. Elevation Data (Cubic for smooth terrain)
    heights = read_raster_window(dem_ds, min_lon, min_lat, max_lon, max_lat, tile_size, tile_size, alg=gdal.GRA_Cubic)
    if heights is None: heights = np.zeros((tile_size, tile_size))

    # a) NaN to 0
    heights = np.nan_to_num(heights, nan=0.0)
    
    # b) Apply manual scaling factor
    if height_scale != 1.0:
        heights = heights * height_scale

    # c) Statistics
    h_min = float(np.min(heights))
    h_max = float(np.max(heights))

    # 2. Texture (Lanczos for sharp details)
    r_window = read_raster_window(color_ds, min_lon, min_lat, max_lon, max_lat, texture_size, texture_size, alg=gdal.GRA_Lanczos)
    
    if len(r_window.shape) == 3:
        img_array = np.transpose(r_window, (1, 2, 0))
    else:
        img_array = r_window
        
    img_pil = Image.fromarray(img_array.astype('uint8'))
    
    # 2b. Apply Texture Enrichment (if enabled)
    detail_luminance = None
    if enrichment and enrichment.get('enabled') and enrichment.get('texture'):
        enrich_alpha = calc_enrichment_alpha(
            zoom,
            enrichment.get('min_level', 5),
            enrichment.get('max_level', 7),
            enrichment.get('alpha_start', 0.0),
            enrichment.get('alpha_end', 0.35)
        )
        if enrich_alpha > 0:
            img_pil, detail_luminance = apply_enrichment(
                img_pil,
                enrichment['texture'],
                enrichment.get('blend_mode', 'overlay'),
                enrichment.get('repeat', 4),
                enrich_alpha
            )
    
    img_byte_arr = io.BytesIO()
    img_pil.save(img_byte_arr, format='PNG')
    png_bytes = img_byte_arr.getvalue()

    # 3. Mesh Generation
    lons = np.linspace(math.radians(min_lon), math.radians(max_lon), tile_size)
    lats = np.linspace(math.radians(min_lat), math.radians(max_lat), tile_size)
    lon_grid, lat_grid = np.meshgrid(lons, lats) 
    
    h_flip = np.flipud(heights)
    h_flat = h_flip.flatten()
    
    # Calculate Center (RTC) - ALWAYS used for vertex precision
    center_lon = (min_lon + max_lon) / 2.0
    center_lat = (min_lat + max_lat) / 2.0
    
    # Center in ECEF (absolute world position)
    cx, cy, cz = latlon_to_ecef(math.radians(center_lat), math.radians(center_lon), 0, radii)
    
    # Calculate Vertices (Ellipsoid)
    xx, yy, zz = latlon_to_ecef(lat_grid, lon_grid, h_flat.reshape(tile_size, tile_size), radii)
    
    # --- ALWAYS use RTC for precision ---
    # Vertices are relative to tile center
    dx = (xx - cx).astype(np.float32).flatten()
    dy = (yy - cy).astype(np.float32).flatten()
    dz = (zz - cz).astype(np.float32).flatten()

    # GLTF Positions (swapped for Y-Up)
    # GLTF X = ECEF X
    # GLTF Y = ECEF Z
    # GLTF Z = -ECEF Y
    positions = np.stack((dx, dz, -dy), axis=-1).flatten()
    
    # Node translation for Implicit Tiling (Y-Up conversion: X, Z, -Y)
    # For explicit tiling, tileset.json provides the transform, so no node translation needed
    node_translation = None if is_explicit_tiling else [cx, cz, -cy]
    
    # --- NORMALS (Ellipsoid Awareness) ---
    nx, ny, nz = calculate_normals_ecef(h_flip, lon_grid, lat_grid, radii, 1.0, tile_size)
    nx = nx.flatten().astype(np.float32)
    ny = ny.flatten().astype(np.float32)
    nz = nz.flatten().astype(np.float32)
    
    # Apply normal perturbation from detail texture (if enabled)
    if enrichment and enrichment.get('affect_normals') and detail_luminance is not None:
        enrich_alpha = calc_enrichment_alpha(
            zoom,
            enrichment.get('min_level', 5),
            enrichment.get('max_level', 7),
            enrichment.get('alpha_start', 0.0),
            enrichment.get('alpha_end', 0.35)
        )
        if enrich_alpha > 0:
            nx, ny, nz = perturb_normals_from_detail(nx, ny, nz, detail_luminance, enrich_alpha, tile_size)
    
    # Swap Normals matching Positions (Y-Up)
    normals = np.stack((nx, nz, -ny), axis=-1).flatten()
    
    # UVs
    u = np.linspace(0, 1, tile_size)
    v = np.linspace(1, 0, tile_size)
    ug, vg = np.meshgrid(u, v)
    uvs = np.stack((ug, vg), axis=-1).astype(np.float32).flatten()
    
    # Indices
    indices = []
    for r in range(tile_size - 1):
        for c in range(tile_size - 1):
            i0 = r * tile_size + c
            i1 = r * tile_size + (c + 1)
            i2 = (r + 1) * tile_size + c
            i3 = (r + 1) * tile_size + (c + 1)
            # CCW Winding for Outward Normals
            indices.extend([i0, i1, i2, i2, i1, i3])
    
    indices = np.array(indices, dtype=np.uint32)
    
    # --- SKIRT GENERATION ---
    skirt_height = (200000.0 / (2**zoom)) * 2.0
    
    new_pos = []
    new_norm = []
    new_uv = []
    new_ind = []
    
    current_vert_count = len(positions) // 3
    
    def get_skirt_pos_gl(idx):
        px = positions[idx*3 + 0]
        py = positions[idx*3 + 1]
        pz = positions[idx*3 + 2]
        
        ex = px
        ey = -pz
        ez = py
        
        ax = ex + cx
        ay = ey + cy
        az = ez + cz
        
        curr_rad = math.sqrt(ax*ax + ay*ay + az*az)
        target_rad = curr_rad - skirt_height
        ratio = target_rad / curr_rad
        
        sx_abs = ax * ratio
        sy_abs = ay * ratio
        sz_abs = az * ratio
        
        sx_rel = sx_abs - cx
        sy_rel = sy_abs - cy
        sz_rel = sz_abs - cz
        
        return [sx_rel, sz_rel, -sy_rel]

    def add_skirt_strip(row_indices):
        nonlocal current_vert_count
        for i in range(len(row_indices) - 1):
            curr_idx = row_indices[i]
            next_idx = row_indices[i+1]
            
            p1 = get_skirt_pos_gl(curr_idx)
            p2 = get_skirt_pos_gl(next_idx)
            
            n1 = [normals[curr_idx*3], normals[curr_idx*3+1], normals[curr_idx*3+2]]
            n2 = [normals[next_idx*3], normals[next_idx*3+1], normals[next_idx*3+2]]
            
            uv1 = [uvs[curr_idx*2], uvs[curr_idx*2+1]]
            uv2 = [uvs[next_idx*2], uvs[next_idx*2+1]]
            
            new_pos.extend(p1)
            new_norm.extend(n1)
            new_uv.extend(uv1)
            skirt_idx_1 = current_vert_count
            current_vert_count += 1
            
            new_pos.extend(p2)
            new_norm.extend(n2)
            new_uv.extend(uv2)
            skirt_idx_2 = current_vert_count
            current_vert_count += 1
            
            new_ind.extend([curr_idx, skirt_idx_1, next_idx])
            new_ind.extend([next_idx, skirt_idx_1, skirt_idx_2])

    # Add skirts to all edges
    edge_north = [c for c in range(tile_size)]
    add_skirt_strip(edge_north)
    
    offset = (tile_size - 1) * tile_size
    edge_south = [offset + c for c in range(tile_size)]
    add_skirt_strip(edge_south)
    
    edge_west = [r * tile_size for r in range(tile_size)]
    add_skirt_strip(edge_west)
    
    edge_east = [(r + 1) * tile_size - 1 for r in range(tile_size)]
    add_skirt_strip(edge_east)
    
    # Merge arrays
    if new_pos:
        positions = np.concatenate((positions, np.array(new_pos, dtype=np.float32)))
        normals = np.concatenate((normals, np.array(new_norm, dtype=np.float32)))
        uvs = np.concatenate((uvs, np.array(new_uv, dtype=np.float32)))
        indices = np.concatenate((indices, np.array(new_ind, dtype=np.uint32)))

    # Min/Max for GLTF Header
    min_pos = [float(np.min(positions[0::3])), float(np.min(positions[1::3])), float(np.min(positions[2::3]))]
    max_pos = [float(np.max(positions[0::3])), float(np.max(positions[1::3])), float(np.max(positions[2::3]))]
    
    # ECEF Min/Max for JSON Bounding Volume
    min_ecef = [min_pos[0], -max_pos[2], min_pos[1]]
    max_ecef = [max_pos[0], -min_pos[2], max_pos[1]]
    
    # 4. GLTF Export
    points_bin = positions.tobytes()
    normals_bin = normals.tobytes()
    uvs_bin = uvs.tobytes()
    indices_bin = indices.tobytes()
    
    def pad(b): return b + b'\x00' * ((4 - len(b) % 4) % 4)
    
    points_bin = pad(points_bin)
    normals_bin = pad(normals_bin)
    uvs_bin = pad(uvs_bin)
    indices_bin = pad(indices_bin)
    png_bytes = pad(png_bytes)
    
    full_buffer = points_bin + normals_bin + uvs_bin + indices_bin + png_bytes
    
    off_pos = 0
    len_pos = len(points_bin)
    off_norm = off_pos + len_pos
    len_norm = len(normals_bin)
    off_uv = off_norm + len_norm
    len_uv = len(uvs_bin)
    off_ind = off_uv + len_uv
    len_ind = len(indices_bin)
    off_img = off_ind + len_ind
    len_img = len(png_bytes)

    # Create Node with optional translation for implicit tiling
    if node_translation:
        root_node = Node(mesh=0, translation=node_translation)
    else:
        root_node = Node(mesh=0)
    
    gltf = GLTF2(
        scene=0, scenes=[Scene(nodes=[0])], nodes=[root_node],
        meshes=[Mesh(primitives=[Primitive(
            attributes={"POSITION": 0, "NORMAL": 1, "TEXCOORD_0": 2}, 
            indices=3, 
            material=0
        )])],
        materials=[Material(pbrMetallicRoughness=PbrMetallicRoughness(
            baseColorTexture=TextureInfo(index=0), 
            metallicFactor=metallic, 
            roughnessFactor=roughness
        ))],
        textures=[Texture(source=0, sampler=0)],
        images=[GLTFImage(bufferView=4, mimeType="image/png")],
        samplers=[Sampler(magFilter=9729, minFilter=9729, wrapS=33071, wrapT=33071)],
        accessors=[
            Accessor(bufferView=0, componentType=5126, count=len(positions)//3, type="VEC3", min=min_pos, max=max_pos),
            Accessor(bufferView=1, componentType=5126, count=len(normals)//3, type="VEC3"),
            Accessor(bufferView=2, componentType=5126, count=len(uvs)//2, type="VEC2"),
            Accessor(bufferView=3, componentType=5125, count=len(indices), type="SCALAR"),
        ],
        bufferViews=[
            BufferView(buffer=0, byteOffset=off_pos, byteLength=len_pos, target=34962),
            BufferView(buffer=0, byteOffset=off_norm, byteLength=len_norm, target=34962),
            BufferView(buffer=0, byteOffset=off_uv, byteLength=len_uv, target=34962),
            BufferView(buffer=0, byteOffset=off_ind, byteLength=len_ind, target=34963),
            BufferView(buffer=0, byteOffset=off_img, byteLength=len_img),
        ],
        buffers=[Buffer(byteLength=len(full_buffer))]
    )
    
    gltf.set_binary_blob(full_buffer)
    gltf.save(path)
    
    return {
        "center": [cx, cy, cz],
        "min": min_ecef,
        "max": max_ecef,
        "geometricError": (200000.0 / (2**zoom)),
        "h_stats": [h_min, h_max],
        "file_size": len(full_buffer)
    }
