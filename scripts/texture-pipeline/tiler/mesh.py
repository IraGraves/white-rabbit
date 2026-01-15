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

from .utils import get_tile_bounds, read_raster_window, latlon_to_ecef, s2_face_uv_to_xyz, s2_xyz_to_latlon, s2_face_uv_to_xyz_vec, s2_xyz_to_latlon_vec, latlon_to_ecef_vec, sample_bilinear_vec
import time

class Timer:
    def __init__(self):
        self.stats = {}
        self.last_time = time.perf_counter()
    
    def mark(self, label):
        now = time.perf_counter()
        dt = (now - self.last_time) * 1000.0 # ms
        self.stats[label] = dt
        self.last_time = now
        return dt

# ... (Previous Code) ...

def create_glb_s2(face, tx, ty, zoom, dem_ds, color_ds, path, radii, tile_size, texture_size, height_scale, roughness, metallic, enrichment=None, is_geodetic=True, debug=False, supersample=1, skirts=False):
    """
    Creates a GLB terrain tile for S2 projection (Cube Face).
    supersample: 1 = No supersampling (Fast), 2 = 4x samples, 4 = 16x samples (High Quality).
    """
    timer = Timer()
    # 1. Bounds & Fetching
    min_lon, min_lat, max_lon, max_lat = get_s2_tile_bounds_robust(face, tx, ty, zoom)
    pad_lon = (max_lon - min_lon) * 0.1
    pad_lat = (max_lat - min_lat) * 0.1
    
    if (face == 2 or face == 5) or (max_lon - min_lon >= 350):
        fetch_min_lon, fetch_max_lon = -180.0, 180.0
        fetch_min_lat = max(-90, min_lat - pad_lat)
        fetch_max_lat = min(90, max_lat + pad_lat)
    else:
        fetch_min_lon, fetch_max_lon = min_lon - pad_lon, max_lon + pad_lon
        fetch_min_lat, fetch_max_lat = max(-90, min_lat - pad_lat), min(90, max_lat + pad_lat)
    
    # --- BUFFER RESOLUTION ---
    # We fetch 2x texture size by default for safety, or more if supersampling is high.
    fetch_scale = max(2.0, float(supersample))
    src_w = int(texture_size * fetch_scale)
    src_h = int(texture_size * fetch_scale)
    
    dem_data, dem_meta = read_raster_window(dem_ds, fetch_min_lon, fetch_min_lat, fetch_max_lon, fetch_max_lat, src_w, src_h, gdal.GRA_Bilinear)
    
    # Handle NoData (converted to NaN by read_raster_window)
    dem_data = dem_data.astype(np.float32) # Ensure floats
    dem_data = np.nan_to_num(dem_data, nan=0.0) # Replace NaN with 0 height
    
    dem_data = dem_data * height_scale

    col_data, col_meta = read_raster_window(color_ds, fetch_min_lon, fetch_min_lat, fetch_max_lon, fetch_max_lat, src_w, src_h, gdal.GRA_Lanczos)
    if len(col_data.shape) == 2: col_data = np.stack((col_data, col_data, col_data), axis=-1)

    d_min_lon, d_max_lat = dem_meta.get('min_lon', 0), dem_meta.get('max_lat', 0)
    d_scale_x, d_scale_y = dem_meta.get('scale_x', 1), dem_meta.get('scale_y', 1)
    c_min_lon, c_max_lat = col_meta.get('min_lon', 0), col_meta.get('max_lat', 0)
    c_scale_x, c_scale_y = col_meta.get('scale_x', 1), col_meta.get('scale_y', 1)
    
    timer.mark('IO')

    tile_uv_size = 1.0 / (2**zoom)
    u0 = tx * tile_uv_size
    v0 = ty * tile_uv_size
    
    # Vertices (Vectorized)
    rows, cols = tile_size, tile_size
    r_idx = np.linspace(0, 1, rows)
    c_idx = np.linspace(0, 1, cols)
    
    # Meshgrid for UVs
    # Note: v varies along rows (Y), u varies along cols (X)
    ug, vg = np.meshgrid(u0 + c_idx * tile_uv_size, v0 + r_idx * tile_uv_size)
    
    # S2 -> XYZ -> LatLon -> Heights
    ux_map, uy_map, uz_map = s2_face_uv_to_xyz_vec(face, ug, vg)
    lat_grid, lon_grid = s2_xyz_to_latlon_vec(ux_map, uy_map, uz_map)
    
    heights_map = sample_bilinear_vec(dem_data, lat_grid, lon_grid, d_min_lon, d_max_lat, d_scale_x, d_scale_y)
    
    # Texture (Vectorized)
    img_h, img_w = texture_size, texture_size
    
    if supersample <= 1:
        # Standard Single Sample (Center)
        sub_offsets = [(0.5, 0.5)] # Use 0.5 center offset logic to match pixel center
    else:
        # Generate N x N grid of offsets
        # e.g. for N=2: 0.25, 0.75
        step = 1.0 / supersample
        offset_vals = [step/2.0 + i*step for i in range(supersample)]
        sub_offsets = [(ox, oy) for oy in offset_vals for ox in offset_vals]
    
    sample_weight = 1.0 / len(sub_offsets)
    accum_color = np.zeros((img_h, img_w, 3), dtype=np.float32)
    
    # Base grid for texture pixels 0..N-1
    t_r = np.arange(img_h)
    t_c = np.arange(img_w)
    # Note: Meshgrid order for image processing usually Y, X indexing (row, col)
    # v varies with r (Y), u varies with c (X)
    
    # Since we need pixel centers + offsets, let's setup the base coordinate grid
    # Pixel x=0 covers u range [0, 1/w], center is 0.5/w
    t_xg, t_yg = np.meshgrid(t_c, t_r) 
    
    for ox, oy in sub_offsets:
        # u_rel = (x + ox) / img_w (assuming ox is 0.5-centered relative to pixel)
        # S2 mapping
        u_rel_grid = (t_xg + ox) / img_w
        v_rel_grid = 1.0 - ((t_yg + oy) / img_h) # Flip V
        
        u_s2 = u0 + u_rel_grid * tile_uv_size
        v_s2 = v0 + v_rel_grid * tile_uv_size
        
        ux_t, uy_t, uz_t = s2_face_uv_to_xyz_vec(face, u_s2, v_s2)
        lat_t, lon_t = s2_xyz_to_latlon_vec(ux_t, uy_t, uz_t)
        
        sample = sample_bilinear_vec(col_data, lat_t, lon_t, c_min_lon, c_max_lat, c_scale_x, c_scale_y)
        accum_color += sample
        
    avg_color = accum_color * sample_weight
    # Convert to PIL Image
    tex_img = Image.fromarray(np.clip(avg_color, 0, 255).astype(np.uint8))



# ============== ROBUST BOUNDS CALCULATION ==============

def get_s2_tile_bounds_robust(face, tx, ty, zoom):
    """
    Calculates Lat/Lon bounds for an S2 tile by checking corners AND edge midpoints.
    This fixes the 'cut off borders' issue on equatorial faces where edges arch higher than corners.
    """
    tile_size_uv = 1.0 / (2 ** zoom)
    u0, v0 = tx * tile_size_uv, ty * tile_size_uv
    u1, v1 = u0 + tile_size_uv, v0 + tile_size_uv
    
    # Hardcoded overrides for Polar Faces to ensure full cap coverage
    if face == 2: return -180.0, 35.0, 180.0, 90.0
    if face == 5: return -180.0, -90.0, 180.0, -35.0

    # Sample points: Corners + Edge Midpoints + Center
    # This catches the 'bulge' of the S2 projection edges (e.g. Lat 45 vs Lat 35)
    u_mid = (u0 + u1) / 2.0
    v_mid = (v0 + v1) / 2.0
    
    sample_uvs = [
        (u0, v0), (u1, v0), (u1, v1), (u0, v1), # Corners
        (u_mid, v0), (u_mid, v1), (u0, v_mid), (u1, v_mid), # Edge Midpoints
        (u_mid, v_mid) # Center
    ]
    
    ref_lon = None
    min_lat, max_lat = 90.0, -90.0
    min_lon, max_lon = 0.0, 0.0

    for (u, v) in sample_uvs:
        x, y, z = s2_face_uv_to_xyz(face, u, v)
        lat, lon = s2_xyz_to_latlon(x, y, z)
        
        min_lat = min(min_lat, lat)
        max_lat = max(max_lat, lat)
        
        if ref_lon is None:
            ref_lon = lon
            min_lon = max_lon = lon
        else:
            # Handle longitude wrapping
            while lon - ref_lon > 180: lon -= 360
            while lon - ref_lon < -180: lon += 360
            min_lon = min(min_lon, lon)
            max_lon = max(max_lon, lon)
            
    return min_lon, min_lat, max_lon, max_lat


# ============== TEXTURE ENRICHMENT FUNCTIONS ==============

def calc_enrichment_alpha(zoom, min_level, max_level, alpha_start, alpha_end):
    """
    Industry-standard linear interpolation of alpha across LOD levels.
    """
    if zoom < min_level:
        return 0.0
    if zoom >= max_level:
        return alpha_end
    t = (zoom - min_level) / max(1, max_level - min_level)
    return alpha_start + t * (alpha_end - alpha_start)


def apply_enrichment(base_img, detail_path, blend_mode, repeat, alpha):
    """Apply detail texture enrichment."""
    if not detail_path or alpha <= 0:
        return base_img, None
    
    try:
        detail = Image.open(detail_path).convert('RGB')
    except Exception as e:
        print(f"[WARN] Could not load enrichment texture: {e}")
        return base_img, None
    
    size = base_img.size[0]
    tile_size = max(1, size // repeat)
    detail_resized = detail.resize((tile_size, tile_size), Image.LANCZOS)
    detail_tiled = Image.new('RGB', (size, size))
    for x in range(repeat):
        for y in range(repeat):
            detail_tiled.paste(detail_resized, (x * tile_size, y * tile_size))
    
    detail_arr = np.array(detail_tiled, dtype=np.float32)
    luminance = (0.299 * detail_arr[:,:,0] + 0.587 * detail_arr[:,:,1] + 0.114 * detail_arr[:,:,2]) / 255.0
    
    # Simple blend implementation for compactness
    base_arr = np.array(base_img, dtype=np.float32) / 255.0
    if blend_mode == 'overlay':
        mask = base_arr < 0.5
        blended = np.where(mask, 2 * base_arr * (detail_arr/255.0), 1 - 2 * (1 - base_arr) * (1 - detail_arr/255.0))
    elif blend_mode == 'multiply':
        blended = base_arr * (detail_arr/255.0)
    elif blend_mode == 'soft_light':
        blended = (1 - 2*(detail_arr/255.0)) * (base_arr**2) + 2*(detail_arr/255.0)*base_arr
    elif blend_mode == 'signed_add':
        blended = base_arr + ((detail_arr/255.0) - 0.5)
    else:
        blended = detail_arr/255.0
        
    blended_img = Image.fromarray((np.clip(blended, 0, 1) * 255).astype(np.uint8))
    result = Image.blend(base_img, blended_img, alpha)
    return result, luminance


def perturb_normals_from_detail(nx, ny, nz, detail_luminance, alpha, tile_size):
    """Perturb mesh normals based on detail texture."""
    if detail_luminance is None or alpha <= 0:
        return nx, ny, nz
    
    lum_img = Image.fromarray((detail_luminance * 255).astype(np.uint8))
    lum_resized = np.array(lum_img.resize((tile_size, tile_size), Image.BILINEAR)) / 255.0
    
    dy, dx = np.gradient(lum_resized)
    perturbation_strength = alpha * 0.5
    dx_pert = dx.flatten() * perturbation_strength
    dy_pert = dy.flatten() * perturbation_strength
    
    nx_new = nx - dx_pert
    ny_new = ny - dy_pert
    
    length = np.sqrt(nx_new**2 + ny_new**2 + nz**2)
    length[length < 0.001] = 1.0
    
    return nx_new / length, ny_new / length, nz / length


def calculate_normals_ecef(heights_flip, lons_grid, lats_grid, radii, height_scale, tile_size):
    """Calculates normals for an ellipsoid."""
    rx, ry, rz = radii
    dy, dx = np.gradient(heights_flip)
    cos_lat = np.cos(lats_grid)
    r_mean = (rx + ry + rz) / 3.0 
    
    d_lat_rad = abs(lats_grid[-1,0] - lats_grid[0,0]) / (tile_size - 1) if tile_size > 1 else 1.0
    scale_y = r_mean * d_lat_rad 
    
    d_lon_rad = abs(lons_grid[0,-1] - lons_grid[0,0]) / (tile_size - 1) if tile_size > 1 else 1.0
    scale_x = r_mean * cos_lat * d_lon_rad 
    scale_x[scale_x < 0.1] = 0.1
    
    dx_met = dx * (height_scale / scale_x)
    dy_met = dy * (height_scale / scale_y)
    
    sin_lon = np.sin(lons_grid)
    cos_lon = np.cos(lons_grid)
    sin_lat = np.sin(lats_grid)
    
    east_x = -sin_lon
    east_y = cos_lon
    east_z = np.zeros_like(lats_grid)
    
    north_x = -sin_lat * cos_lon
    north_y = -sin_lat * sin_lon
    north_z = cos_lat 
    
    nx_base = cos_lat * cos_lon / rx
    ny_base = cos_lat * sin_lon / ry
    nz_base = sin_lat / rz
    
    len_base = np.sqrt(nx_base**2 + ny_base**2 + nz_base**2)
    nx_base /= len_base
    ny_base /= len_base
    nz_base /= len_base
    
    nx = nx_base - dx_met * east_x - dy_met * north_x
    ny = ny_base - dx_met * east_y - dy_met * north_y
    nz = nz_base - dx_met * east_z - dy_met * north_z
    
    norm = np.sqrt(nx*nx + ny*ny + nz*nz)
    return nx/norm, ny/norm, nz/norm


# ============== GLB CREATION ==============

def create_glb(tx, ty, zoom, dem_ds, color_ds, path, radii, tile_size, texture_size, height_scale, roughness, metallic, is_explicit_tiling=True, enrichment=None, is_geodetic=True, debug=False, supersample=1):
    """Creates a GLB terrain tile for Equirectangular projection."""
    timer = Timer()

    min_lon, min_lat, max_lon, max_lat = get_tile_bounds(tx, ty, zoom)
    
    # 1. Elevation
    heights, dem_meta = read_raster_window(dem_ds, min_lon, min_lat, max_lon, max_lat, tile_size, tile_size, alg=gdal.GRA_Cubic)
    if heights is None: heights = np.zeros((tile_size, tile_size))
    heights = np.nan_to_num(heights, nan=0.0)
    if height_scale != 1.0: heights = heights * height_scale
    h_min = float(np.min(heights))
    h_max = float(np.max(heights))

    # 2. Texture
    # Optional: Supersampling by fetching larger source and resizing down
    fetch_texture_size = texture_size * supersample
    img_array, col_meta = read_raster_window(color_ds, min_lon, min_lat, max_lon, max_lat, fetch_texture_size, fetch_texture_size, alg=gdal.GRA_Lanczos)
    img_pil = Image.fromarray(img_array.astype('uint8'))
    if supersample > 1:
        img_pil = img_pil.resize((texture_size, texture_size), Image.LANCZOS)
    
    detail_luminance = None
    if enrichment and enrichment.get('enabled') and enrichment.get('texture'):
        enrich_alpha = calc_enrichment_alpha(zoom, enrichment.get('min_level', 5), enrichment.get('max_level', 7), enrichment.get('alpha_start', 0.0), enrichment.get('alpha_end', 0.35))
        if enrich_alpha > 0:
            img_pil, detail_luminance = apply_enrichment(img_pil, enrichment['texture'], enrichment.get('blend_mode', 'overlay'), enrichment.get('repeat', 4), enrich_alpha)
    
    img_byte_arr = io.BytesIO()
    img_pil.save(img_byte_arr, format='PNG')
    png_bytes = img_byte_arr.getvalue()
    timer.mark('IO_Tex')

    # 3. Mesh
    lons = np.linspace(math.radians(min_lon), math.radians(max_lon), tile_size)
    lats = np.linspace(math.radians(min_lat), math.radians(max_lat), tile_size)
    lon_grid, lat_grid = np.meshgrid(lons, lats) 
    
    h_flip = np.flipud(heights)
    h_flat = h_flip.flatten()
    
    center_lon = (min_lon + max_lon) / 2.0
    center_lat = (min_lat + max_lat) / 2.0
    cx, cy, cz = latlon_to_ecef(math.radians(center_lat), math.radians(center_lon), 0, radii, is_geodetic)
    
    xx, yy, zz = latlon_to_ecef(lat_grid, lon_grid, h_flat.reshape(tile_size, tile_size), radii, is_geodetic)
    dx = (xx - cx).astype(np.float32).flatten()
    dy = (yy - cy).astype(np.float32).flatten()
    dz = (zz - cz).astype(np.float32).flatten()
    positions = np.stack((dx, dz, -dy), axis=-1).flatten()
    
    node_translation = None if is_explicit_tiling else [cx, cz, -cy]
    
    nx, ny, nz = calculate_normals_ecef(h_flip, lon_grid, lat_grid, radii, 1.0, tile_size)
    nx, ny, nz = nx.flatten().astype(np.float32), ny.flatten().astype(np.float32), nz.flatten().astype(np.float32)
    
    if enrichment and enrichment.get('affect_normals') and detail_luminance is not None:
        enrich_alpha = calc_enrichment_alpha(zoom, enrichment.get('min_level', 5), enrichment.get('max_level', 7), enrichment.get('alpha_start', 0.0), enrichment.get('alpha_end', 0.35))
        if enrich_alpha > 0:
            nx, ny, nz = perturb_normals_from_detail(nx, ny, nz, detail_luminance, enrich_alpha, tile_size)
    
    normals = np.stack((nx, nz, -ny), axis=-1).flatten()
    
    u = np.linspace(0, 1, tile_size)
    v = np.linspace(1, 0, tile_size)
    ug, vg = np.meshgrid(u, v)
    uvs = np.stack((ug, vg), axis=-1).astype(np.float32).flatten()
    
    indices = []
    for r in range(tile_size - 1):
        for c in range(tile_size - 1):
            i0 = r * tile_size + c
            i1 = r * tile_size + (c + 1)
            i2 = (r + 1) * tile_size + c
            i3 = (r + 1) * tile_size + (c + 1)
            indices.extend([i0, i1, i2, i2, i1, i3])
    indices = np.array(indices, dtype=np.uint32)
    timer.mark('Mesh_Gen')
    
    # Skirt Generation
    skirt_height = (200000.0 / (2**zoom)) * 2.0
    new_pos, new_norm, new_uv, new_ind = [], [], [], []
    current_vert_count = len(positions) // 3
    
    def get_skirt_pos_gl(idx):
        ex, ey, ez = positions[idx*3], -positions[idx*3+2], positions[idx*3+1]
        ax, ay, az = ex + cx, ey + cy, ez + cz
        curr_rad = math.sqrt(ax*ax + ay*ay + az*az)
        ratio = (curr_rad - skirt_height) / curr_rad
        sx, sy, sz = ax * ratio - cx, ay * ratio - cy, az * ratio - cz
        return [sx, sz, -sy]

    def add_skirt_strip(row_indices):
        nonlocal current_vert_count
        for i in range(len(row_indices) - 1):
            c_idx, n_idx = row_indices[i], row_indices[i+1]
            p1, p2 = get_skirt_pos_gl(c_idx), get_skirt_pos_gl(n_idx)
            n1 = [normals[c_idx*3], normals[c_idx*3+1], normals[c_idx*3+2]]
            n2 = [normals[n_idx*3], normals[n_idx*3+1], normals[n_idx*3+2]]
            uv1, uv2 = [uvs[c_idx*2], uvs[c_idx*2+1]], [uvs[n_idx*2], uvs[n_idx*2+1]]
            
            new_pos.extend(p1 + p2)
            new_norm.extend(n1 + n2)
            new_uv.extend(uv1 + uv2)
            s1, s2 = current_vert_count, current_vert_count + 1
            current_vert_count += 2
            new_ind.extend([c_idx, s1, n_idx, n_idx, s1, s2])

    add_skirt_strip([c for c in range(tile_size)]) # North
    add_skirt_strip([(tile_size - 1) * tile_size + c for c in range(tile_size)]) # South
    add_skirt_strip([r * tile_size for r in range(tile_size)]) # West
    add_skirt_strip([(r + 1) * tile_size - 1 for r in range(tile_size)]) # East
    
    if new_pos:
        positions = np.concatenate((positions, np.array(new_pos, dtype=np.float32)))
        normals = np.concatenate((normals, np.array(new_norm, dtype=np.float32)))
        uvs = np.concatenate((uvs, np.array(new_uv, dtype=np.float32)))
        indices = np.concatenate((indices, np.array(new_ind, dtype=np.uint32)))

    timer.mark('Skirts')

    min_pos = [float(np.min(positions[0::3])), float(np.min(positions[1::3])), float(np.min(positions[2::3]))]
    max_pos = [float(np.max(positions[0::3])), float(np.max(positions[1::3])), float(np.max(positions[2::3]))]
    
    # GLTF Export
    def pad(b): return b + b'\x00' * ((4 - len(b) % 4) % 4)
    points_bin = pad(positions.tobytes())
    normals_bin = pad(normals.tobytes())
    uvs_bin = pad(uvs.tobytes())
    indices_bin = pad(indices.tobytes())
    png_bytes = pad(png_bytes)
    
    full_buffer = points_bin + normals_bin + uvs_bin + indices_bin + png_bytes
    
    root_node = Node(mesh=0, translation=node_translation if node_translation else None)
    
    gltf = GLTF2(
        scene=0, scenes=[Scene(nodes=[0])], nodes=[root_node],
        meshes=[Mesh(primitives=[Primitive(attributes={"POSITION": 0, "NORMAL": 1, "TEXCOORD_0": 2}, indices=3, material=0)])],
        materials=[Material(pbrMetallicRoughness=PbrMetallicRoughness(baseColorTexture=TextureInfo(index=0), metallicFactor=metallic, roughnessFactor=roughness))],
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
            BufferView(buffer=0, byteOffset=0, byteLength=len(points_bin), target=34962),
            BufferView(buffer=0, byteOffset=len(points_bin), byteLength=len(normals_bin), target=34962),
            BufferView(buffer=0, byteOffset=len(points_bin)+len(normals_bin), byteLength=len(uvs_bin), target=34962),
            BufferView(buffer=0, byteOffset=len(points_bin)+len(normals_bin)+len(uvs_bin), byteLength=len(indices_bin), target=34963),
            BufferView(buffer=0, byteOffset=len(points_bin)+len(normals_bin)+len(uvs_bin)+len(indices_bin), byteLength=len(png_bytes)),
        ],
        buffers=[Buffer(byteLength=len(full_buffer))]
    )
    gltf.set_binary_blob(full_buffer)
    gltf.save(path)
    
    timer.mark('Encode')
    
    return {
        "center": [cx, cy, cz],
        "min": [min_pos[0], -max_pos[2], min_pos[1]], "max": [max_pos[0], -min_pos[2], max_pos[1]],
        "geometricError": (200000.0 / (2**zoom)),
        "h_stats": [h_min, h_max],
        "file_size": len(full_buffer),
        "perf": timer.stats
    }


# ==========================================
# S2 TILING FUNCTIONS
# ==========================================

def sample_bilinear(data, lat, lon, min_lon, max_lat, scale_x, scale_y):
    """
    Bilinear interpolation of raster data.
    """
    h, w = data.shape[:2]
    d_lon = (lon - min_lon) % 360
    px = d_lon / scale_x
    py = (max_lat - lat) / scale_y
    
    py = np.clip(py, 0, h - 1.0001)
    px = np.clip(px, 0, w - 0.0001) if w < 350 / scale_x else px % w
    
    x0 = int(math.floor(px))
    y0 = int(math.floor(py))
    x1 = (x0 + 1) % w
    y1 = min(y0 + 1, h - 1)
    
    dx = px - x0
    dy = py - y0
    
    v00 = data[y0, x0]
    v10 = data[y0, x1]
    v01 = data[y1, x0]
    v11 = data[y1, x1]
    
    top = v00 * (1 - dx) + v10 * dx
    bottom = v01 * (1 - dx) + v11 * dx
    val = top * (1 - dy) + bottom * dy
    return val

def create_glb_s2(face, tx, ty, zoom, dem_ds, color_ds, path, radii, tile_size, texture_size, height_scale, roughness, metallic, enrichment=None, is_geodetic=True, debug=False, supersample=1, skirts=False):
    """
    Creates a GLB terrain tile for S2 projection (Cube Face).
    supersample: 1 = No supersampling (Fast), 2 = 4x samples, 4 = 16x samples (High Quality).
    """
    timer = Timer()
    # 1. Bounds & Fetching
    min_lon, min_lat, max_lon, max_lat = get_s2_tile_bounds_robust(face, tx, ty, zoom)
    pad_lon = (max_lon - min_lon) * 0.1
    pad_lat = (max_lat - min_lat) * 0.1
    
    if (face == 2 or face == 5) or (max_lon - min_lon >= 350):
        fetch_min_lon, fetch_max_lon = -180.0, 180.0
        fetch_min_lat = max(-90, min_lat - pad_lat)
        fetch_max_lat = min(90, max_lat + pad_lat)
    else:
        fetch_min_lon, fetch_max_lon = min_lon - pad_lon, max_lon + pad_lon
        fetch_min_lat, fetch_max_lat = max(-90, min_lat - pad_lat), min(90, max_lat + pad_lat)
    
    # --- BUFFER RESOLUTION ---
    # We fetch 2x texture size by default for safety, or more if supersampling is high.
    fetch_scale = max(2.0, float(supersample))
    src_w = int(texture_size * fetch_scale)
    src_h = int(texture_size * fetch_scale)
    
    dem_data, dem_meta = read_raster_window(dem_ds, fetch_min_lon, fetch_min_lat, fetch_max_lon, fetch_max_lat, src_w, src_h, gdal.GRA_Bilinear)
    
    # Handle NoData (converted to NaN by read_raster_window)
    dem_data = dem_data.astype(np.float32) # Ensure floats
    dem_data = np.nan_to_num(dem_data, nan=0.0) # Replace NaN with 0 height
    
    dem_data = dem_data * height_scale

    col_data, col_meta = read_raster_window(color_ds, fetch_min_lon, fetch_min_lat, fetch_max_lon, fetch_max_lat, src_w, src_h, gdal.GRA_Lanczos)
    if len(col_data.shape) == 2: col_data = np.stack((col_data, col_data, col_data), axis=-1)

    d_min_lon, d_max_lat = dem_meta.get('min_lon', 0), dem_meta.get('max_lat', 0)
    d_scale_x, d_scale_y = dem_meta.get('scale_x', 1), dem_meta.get('scale_y', 1)
    c_min_lon, c_max_lat = col_meta.get('min_lon', 0), col_meta.get('max_lat', 0)
    c_scale_x, c_scale_y = col_meta.get('scale_x', 1), col_meta.get('scale_y', 1)
    
    timer.mark('IO')

    tile_uv_size = 1.0 / (2**zoom)
    u0 = tx * tile_uv_size
    v0 = ty * tile_uv_size
    
    # Vertices (Vectorized)
    rows, cols = tile_size, tile_size
    r_idx = np.linspace(0, 1, rows)
    c_idx = np.linspace(0, 1, cols)
    
    # Meshgrid for UVs
    # Note: v varies along rows (Y), u varies along cols (X)
    ug, vg = np.meshgrid(u0 + c_idx * tile_uv_size, v0 + r_idx * tile_uv_size)
    
    # S2 -> XYZ -> LatLon -> Heights
    ux_map, uy_map, uz_map = s2_face_uv_to_xyz_vec(face, ug, vg)
    lat_grid, lon_grid = s2_xyz_to_latlon_vec(ux_map, uy_map, uz_map)
    
    heights_map = sample_bilinear_vec(dem_data, lat_grid, lon_grid, d_min_lon, d_max_lat, d_scale_x, d_scale_y)
    
    # Texture (Vectorized)
    img_h, img_w = texture_size, texture_size
    
    if supersample <= 1:
        # Standard Single Sample (Center)
        # Use 0.5 center offset logic to match pixel center
        sub_offsets = [(0.5, 0.5)] 
    else:
        # Generate N x N grid of offsets
        # e.g. for N=2: 0.25, 0.75
        step = 1.0 / supersample
        offset_vals = [step/2.0 + i*step for i in range(supersample)]
        sub_offsets = [(ox, oy) for oy in offset_vals for ox in offset_vals]
    
    sample_weight = 1.0 / len(sub_offsets)
    accum_color = np.zeros((img_h, img_w, 3), dtype=np.float32)
    
    # Base grid for texture pixels 0..N-1
    t_r = np.arange(img_h)
    t_c = np.arange(img_w)
    # Note: Meshgrid order for image processing usually Y, X indexing (row, col)
    # v varies with r (Y), u varies with c (X)
    
    # Since we need pixel centers + offsets, let's setup the base coordinate grid
    # Pixel x=0 covers u range [0, 1/w], center is 0.5/w
    t_xg, t_yg = np.meshgrid(t_c, t_r) 
    
    for ox, oy in sub_offsets:
        # u_rel = (x + ox) / img_w (assuming ox is 0.5-centered relative to pixel)
        # S2 mapping
        u_rel_grid = (t_xg + ox) / img_w
        v_rel_grid = 1.0 - ((t_yg + oy) / img_h) # Flip V
        
        u_s2 = u0 + u_rel_grid * tile_uv_size
        v_s2 = v0 + v_rel_grid * tile_uv_size
        
        ux_t, uy_t, uz_t = s2_face_uv_to_xyz_vec(face, u_s2, v_s2)
        lat_t, lon_t = s2_xyz_to_latlon_vec(ux_t, uy_t, uz_t)
        
        sample = sample_bilinear_vec(col_data, lat_t, lon_t, c_min_lon, c_max_lat, c_scale_x, c_scale_y)
        accum_color += sample
        
    avg_color = accum_color * sample_weight
    # Convert to PIL Image
    tex_img = Image.fromarray(np.clip(avg_color, 0, 255).astype(np.uint8))

    # Calculate ECEF Positions
    # Calculate ECEF Positions (Vectorized)
    # lat_grid/lon_grid computed above are in degrees
    xx, yy, zz = latlon_to_ecef_vec(np.radians(lat_grid), np.radians(lon_grid), heights_map, radii, geodetic=is_geodetic)
    
    # Center (RTC)
    cx = np.mean(xx)
    cy = np.mean(yy)
    cz = np.mean(zz)
    
    dx = (xx - cx).astype(np.float32).flatten()
    dy = (yy - cy).astype(np.float32).flatten()
    dz = (zz - cz).astype(np.float32).flatten()
    
    pos_flat = np.stack((dx, dz, -dy), axis=-1).flatten()
    
    # Normals
    dx_dr, dx_dc = np.gradient(xx)
    dy_dr, dy_dc = np.gradient(yy)
    dz_dr, dz_dc = np.gradient(zz)
    
    nx_map = dy_dc * dz_dr - dz_dc * dy_dr
    ny_map = dz_dc * dx_dr - dx_dc * dz_dr
    nz_map = dx_dc * dy_dr - dy_dc * dx_dr
    
    len_map = np.sqrt(nx_map**2 + ny_map**2 + nz_map**2)
    len_map[len_map == 0] = 1.0
    nx_map /= len_map; ny_map /= len_map; nz_map /= len_map
    
    dot = nx_map * xx + ny_map * yy + nz_map * zz
    mask = dot < 0
    nx_map[mask] *= -1; ny_map[mask] *= -1; nz_map[mask] *= -1
    
    nx_f = nx_map.flatten(); ny_f = ny_map.flatten(); nz_f = nz_map.flatten()
    norm_flat = np.stack((nx_f, nz_f, -ny_f), axis=-1).flatten().astype(np.float32)
    
    # Indices
    indices = []
    for r in range(rows - 1):
        for c in range(cols - 1):
            i0 = r * cols + c
            i1 = r * cols + (c + 1)
            i2 = (r + 1) * cols + c
            i3 = (r + 1) * cols + (c + 1)
            indices.extend([i0, i1, i2, i2, i1, i3])
    indices = np.array(indices, dtype=np.uint32)
    
    # UVs
    u_vals = np.linspace(0, 1, cols)
    v_vals = np.linspace(1, 0, rows)
    ug, vg = np.meshgrid(u_vals, v_vals) 
    uv_flat = np.stack((ug, vg), axis=-1).astype(np.float32).flatten()
    
    # Skirt Generation
    if skirts:
        # Skirt Height = 1.5x Geometric Error roughly, or 2x
        skirt_height = (200000.0 / (2**zoom)) * 2.0
        new_pos, new_norm, new_uv, new_ind = [], [], [], []
        
        # Helper to get skirt vertex position
        def get_skirt_pos_gl(idx):
            ex = pos_flat[idx*3]
            ez = pos_flat[idx*3+1]
            ey = -pos_flat[idx*3+2] # Recover y from -y
            ax, ay, az = ex + cx, ey + cy, ez + cz
            curr_rad = math.sqrt(ax*ax + ay*ay + az*az)
            if curr_rad == 0: return [0,0,0]
            ratio = (curr_rad - skirt_height) / curr_rad
            sx, sy, sz = ax * ratio - cx, ay * ratio - cy, az * ratio - cz
            return [sx, sz, -sy]

        current_vert_count = len(pos_flat) // 3
        
        def add_skirt_strip(row_indices):
            nonlocal current_vert_count
            for i in range(len(row_indices) - 1):
                c_idx = row_indices[i]
                n_idx = row_indices[i+1]
                p1, p2 = get_skirt_pos_gl(c_idx), get_skirt_pos_gl(n_idx)
                n1 = [norm_flat[c_idx*3], norm_flat[c_idx*3+1], norm_flat[c_idx*3+2]]
                n2 = [norm_flat[n_idx*3], norm_flat[n_idx*3+1], norm_flat[n_idx*3+2]]
                uv1 = [uv_flat[c_idx*2], uv_flat[c_idx*2+1]]
                uv2 = [uv_flat[n_idx*2], uv_flat[n_idx*2+1]]
                
                new_pos.extend(p1 + p2)
                new_norm.extend(n1 + n2)
                new_uv.extend(uv1 + uv2)
                s1, s2 = current_vert_count, current_vert_count + 1
                current_vert_count += 2
                new_ind.extend([c_idx, s1, n_idx, n_idx, s1, s2])

        add_skirt_strip([c for c in range(cols)]) # North
        add_skirt_strip([(rows - 1) * cols + c for c in range(cols)]) # South
        add_skirt_strip([r * cols for r in range(rows)]) # West
        add_skirt_strip([(r + 1) * cols - 1 for r in range(rows)]) # East

        if new_pos:
            pos_flat = np.concatenate((pos_flat, np.array(new_pos, dtype=np.float32)))
            norm_flat = np.concatenate((norm_flat, np.array(new_norm, dtype=np.float32)))
            uv_flat = np.concatenate((uv_flat, np.array(new_uv, dtype=np.float32)))
            indices = np.concatenate((indices, np.array(new_ind, dtype=np.uint32)))
    
    timer.mark('Mesh') # Capture Mesh (+Skirts) time

    # Save Image
    img_byte_arr = io.BytesIO()
    tex_img.save(img_byte_arr, format='PNG')
    png_bytes = img_byte_arr.getvalue()
    
    # GLTF Export
    def pad(b): return b + b'\x00' * ((4 - len(b) % 4) % 4)
    points_bin = pad(pos_flat.tobytes())
    normals_bin = pad(norm_flat.tobytes())
    uvs_bin = pad(uv_flat.tobytes())
    indices_bin = pad(indices.tobytes())
    png_bytes = pad(png_bytes)
    
    full_buffer = points_bin + normals_bin + uvs_bin + indices_bin + png_bytes
    
    off_pos = 0; len_pos = len(points_bin)
    off_norm = off_pos + len_pos; len_norm = len(normals_bin)
    off_uv = off_norm + len_norm; len_uv = len(uvs_bin)
    off_ind = off_uv + len_uv; len_ind = len(indices_bin)
    off_img = off_ind + len_ind; len_img = len(png_bytes)
    
    min_pos = [float(np.min(pos_flat[0::3])), float(np.min(pos_flat[1::3])), float(np.min(pos_flat[2::3]))]
    max_pos = [float(np.max(pos_flat[0::3])), float(np.max(pos_flat[1::3])), float(np.max(pos_flat[2::3]))]
    
    root_node = Node(mesh=0, translation=[cx, cz, -cy])
    
    gltf = GLTF2(
        scene=0, scenes=[Scene(nodes=[0])], nodes=[root_node],
        meshes=[Mesh(primitives=[Primitive(attributes={"POSITION": 0, "NORMAL": 1, "TEXCOORD_0": 2}, indices=3, material=0)])],
        materials=[Material(pbrMetallicRoughness=PbrMetallicRoughness(baseColorTexture=TextureInfo(index=0), metallicFactor=metallic, roughnessFactor=roughness))],
        textures=[Texture(source=0, sampler=0)],
        images=[GLTFImage(bufferView=4, mimeType="image/png")],
        samplers=[Sampler(magFilter=9729, minFilter=9729, wrapS=33071, wrapT=33071)],
        accessors=[
            Accessor(bufferView=0, componentType=5126, count=len(pos_flat)//3, type="VEC3", min=min_pos, max=max_pos),
            Accessor(bufferView=1, componentType=5126, count=len(norm_flat)//3, type="VEC3"),
            Accessor(bufferView=2, componentType=5126, count=len(uv_flat)//2, type="VEC2"),
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
    
    timer.mark('Encode')

    return {
        "center": [cx, cy, cz],
        "min": [np.min(xx), np.min(yy), np.min(zz)],
        "max": [np.max(xx), np.max(yy), np.max(zz)],
        "geometricError": (200000.0 / (2**zoom)),
        "h_stats": [np.min(heights_map), np.max(heights_map)],
        "file_size": len(full_buffer),
        "perf": timer.stats
    }