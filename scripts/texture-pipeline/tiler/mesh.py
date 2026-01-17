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
        
    def get_stats(self):
        return self.stats

# ... (Previous Code) ...
# S2 Tiling functions and robust bounds calculation below



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



def calculate_normals_cross(xx, yy, zz):
    """
    Calculates vertex normals for a grid of 3D points using cross products of adjacent edges.
    xx, yy, zz: 2D arrays of shape (v_count, v_count).
    This is numerically stable at poles and works for any projection.
    """
    # Create position vectors
    pos = np.stack((xx, yy, zz), axis=-1)
    
    # Compute horizontal tangent (East-ish)
    # v_east = pos[:, j+1] - pos[:, j-1]
    v_east = np.zeros_like(pos)
    v_east[:, 1:-1] = pos[:, 2:] - pos[:, :-2]
    v_east[:, 0] = pos[:, 1] - pos[:, 0]
    v_east[:, -1] = pos[:, -1] - pos[:, -2]
    
    # Compute vertical tangent (North-ish) 
    # v_north = pos[i+1, :] - pos[i-1, :]
    v_north = np.zeros_like(pos)
    v_north[1:-1, :] = pos[2:, :] - pos[:-2, :]
    v_north[0, :] = pos[1, :] - pos[0, :]
    v_north[-1, :] = pos[-1, :] - pos[-2, :]
    
    # Normal = East x North (Outward for right-handed ECEF)
    norm = np.cross(v_east, v_north)
    
    # Normalize
    mag = np.linalg.norm(norm, axis=-1, keepdims=True)
    mag[mag < 1e-12] = 1.0
    norm /= mag
    
    return norm[:,:,0], norm[:,:,1], norm[:,:,2]


def calculate_normals_ecef(heights_flip, lons_grid, lats_grid, radii, height_scale, tile_size):
    """Calculates normals for an ellipsoid."""
    rx, ry, rz = radii
    dy, dx = np.gradient(heights_flip)
    cos_lat = np.cos(lats_grid)
    r_mean = (rx + ry + rz) / 3.0 
    
    # Robustly estimate the average distance between row/column samples in radians
    # We use the mean absolute difference to avoid issues with zero-delta columns/rows (e.g. S2 Poles)
    lat_diffs = np.abs(np.diff(lats_grid, axis=0))
    d_lat_rad = np.mean(lat_diffs) if lat_diffs.size > 0 else 0.0
    if d_lat_rad < 1e-9: # Fallback for extremely small spans or polar artifacts
        d_lat_rad = (np.max(lats_grid) - np.min(lats_grid)) / max(1, tile_size - 1)
    
    scale_y = r_mean * d_lat_rad
    if scale_y < 0.1: scale_y = 0.1 # Absolute safety
    
    lon_diffs = np.abs(np.diff(lons_grid, axis=1))
    # Handle wrap-around for lon_diffs
    lon_diffs[lon_diffs > np.pi] = 2*np.pi - lon_diffs[lon_diffs > np.pi]
    d_lon_rad = np.mean(lon_diffs) if lon_diffs.size > 0 else 0.0
    if d_lon_rad < 1e-9:
        d_lon_rad = (np.max(lons_grid) - np.min(lons_grid)) / max(1, tile_size - 1)

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
    norm[norm < 1e-8] = 1.0 # Prevent division by zero or NaN
    return nx/norm, ny/norm, nz/norm


def calculate_normals_sobel(xx, yy, zz):
    """
    Calculates high-quality vertex normals using a 3x3 Sobel Operator.
    Requires input grids of shape (N+3, N+3) to produce (N+1, N+1) normals.
    xx, yy, zz: ECEF coordinate grids (padded).
    """
    # Grid: (N+3, N+3)
    pos = np.stack((xx, yy, zz), axis=-1)
    
    # 3x3 Neighborhoods for (N+1, N+1) interior points
    # Index 0, 1, 2 for point 1. Index 1, 2, 3 for point 2.
    # So pos[0:-2, 0:-2] is North-West of pos[1:-1, 1:-1]
    
    nw = pos[0:-2, 0:-2]
    w  = pos[1:-1, 0:-2]
    sw = pos[2:,   0:-2]
    
    n  = pos[0:-2, 1:-1]
    s  = pos[2:,   1:-1]
    
    ne = pos[0:-2, 2:]
    e  = pos[1:-1, 2:]
    se = pos[2:,   2:]
    
    # Sobel Gradient estimators (Tangent Vectors)
    # X-Tangent (cols): (NE + 2E + SE) - (NW + 2W + SW)
    tan_x = (ne + 2*e + se) - (nw + 2*w + sw)
    
    # Y-Tangent (rows): (SW + 2S + SE) - (NW + 2N + NE)
    tan_y = (sw + 2*s + se) - (nw + 2*n + ne)
    
    # Normal = TangentX cross TangentY
    # ECEF: (Longitude-ish) x (Latitude-ish) = Outward
    norm = np.cross(tan_x, tan_y)
    
    # Normalize
    mag = np.linalg.norm(norm, axis=-1, keepdims=True)
    mag[mag < 1e-12] = 1.0
    norm /= mag
    
    return norm[:,:,0], norm[:,:,1], norm[:,:,2]


# ============== GLB CREATION ==============

def create_glb(tx, ty, zoom, dem_ds, color_ds, path, radii, tile_size, texture_size, height_scale, roughness, metallic, is_explicit_tiling=True, enrichment=None, is_geodetic=True, debug=False, supersample=1):
    """Creates a GLB terrain tile for Equirectangular projection."""
    timer = Timer()

    min_lon, min_lat, max_lon, max_lat = get_tile_bounds(tx, ty, zoom)
    
    v_count = tile_size + 1
    # 1. Elevation
    heights, dem_meta = read_raster_window(dem_ds, min_lon, min_lat, max_lon, max_lat, v_count, v_count, alg=gdal.GRA_Cubic)
    if heights is None: heights = np.zeros((v_count, v_count))
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
    lons = np.linspace(math.radians(min_lon), math.radians(max_lon), v_count)
    lats = np.linspace(math.radians(min_lat), math.radians(max_lat), v_count)
    lon_grid, lat_grid = np.meshgrid(lons, lats) 
    
    h_flip = np.flipud(heights)
    h_flat = h_flip.flatten()
    
    center_lon = (min_lon + max_lon) / 2.0
    center_lat = (min_lat + max_lat) / 2.0
    cx, cy, cz = latlon_to_ecef(math.radians(center_lat), math.radians(center_lon), 0, radii, is_geodetic)
    
    xx, yy, zz = latlon_to_ecef(lat_grid, lon_grid, h_flat.reshape(v_count, v_count), radii, is_geodetic)
    dx = (xx - cx).astype(np.float32).flatten()
    dy = (yy - cy).astype(np.float32).flatten()
    dz = (zz - cz).astype(np.float32).flatten()
    positions = np.stack((dx, dz, -dy), axis=-1).flatten()
    
    node_translation = None if is_explicit_tiling else [cx, cz, -cy]
    
    # Calculate Normals using robust cross-product method
    nx, ny, nz = calculate_normals_cross(xx, yy, zz)
    
    if enrichment and enrichment.get('affect_normals') and detail_luminance is not None:
        enrich_alpha = calc_enrichment_alpha(zoom, enrichment.get('min_level', 5), enrichment.get('max_level', 7), enrichment.get('alpha_start', 0.0), enrichment.get('alpha_end', 0.35))
        if enrich_alpha > 0:
            nx, ny, nz = perturb_normals_from_detail(nx.flatten(), ny.flatten(), nz.flatten(), detail_luminance, enrich_alpha, tile_size)
    
    normals = np.stack((nx.flatten(), nz.flatten(), -ny.flatten()), axis=-1).astype(np.float32).flatten()
    
    # Generate UVs with half-texel inset for perfect edge alignment
    half_texel = 0.5 / texture_size
    u = np.linspace(half_texel, 1.0 - half_texel, v_count)
    v = np.linspace(1.0 - half_texel, half_texel, v_count)
    ug, vg = np.meshgrid(u, v)
    uvs = np.stack((ug, vg), axis=-1).astype(np.float32).flatten()
    
    indices = []
    for r in range(v_count - 1):
        for c in range(v_count - 1):
            i0 = r * v_count + c
            i1 = r * v_count + (c + 1)
            i2 = (r + 1) * v_count + c
            i3 = (r + 1) * v_count + (c + 1)
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

    max_pos = [float(np.max(positions[0::3])), float(np.max(positions[1::3])), float(np.max(positions[2::3]))]
    max_r = max(radii)

    h_min = float(np.min(heights))
    h_max = float(np.max(heights))
    
    # Robust Horizon Occlusion Point
    r_max = max(radii)
    c_len = math.sqrt(cx*cx + cy*cy + cz*cz)
    occ_x, occ_y, occ_z = 0, 0, 0
    if c_len > 0:
        center_dir = np.array([cx, cy, cz]) / c_len
        p_lens = np.sqrt(xx**2 + yy**2 + zz**2).flatten()
        px, py, pz = xx.flatten() / p_lens, yy.flatten() / p_lens, zz.flatten() / p_lens
        cos_thetas = np.clip(px * center_dir[0] + py * center_dir[1] + pz * center_dir[2], -1.0, 1.0)
        thetas = np.arccos(cos_thetas)
        alphas = np.arccos(np.clip(r_max / p_lens, 0.0, 1.0))
        denoms = np.cos(thetas + alphas)
        valid = denoms > 1e-6
        if np.any(valid):
            ds = r_max / denoms[valid]
            max_d = float(np.max(ds))
        else:
            max_d = float(r_max * 10.0)
        occ_x, occ_y, occ_z = center_dir * max_d
    
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
        "min": min_pos,
        "max": max_pos,
        "center": [cx, cy, cz],
        "minHeight": h_min,
        "maxHeight": h_max,
        "occPoint": [occ_x, occ_y, occ_z],
        "geometricError": (max_r * math.pi) / (2.0 * (2**zoom) * 512.0),
        "file_size": len(full_buffer),
        "perf": timer.get_stats()
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

def create_glb_s2(face, tx, ty, zoom, dem_ds, color_ds, path, radii, tile_size, texture_size, height_scale, roughness, metallic, enrichment=None, is_geodetic=True, debug=False, supersample=1, skirts=False, is_optimized=False, dem_padding=0, color_padding=0, dem_padding_mode="metadata", color_padding_mode="metadata"):
    """
    Creates a GLB terrain tile for S2 projection (Cube Face).
    supersample: 1 = No supersampling (Fast), 2 = 4x samples, 4 = 16x samples (High Quality).
    is_optimized: If True, assumes dem_ds and color_ds are already S2-projected face COGs.
    """
    timer = Timer()
    
    v_count = tile_size + 1
    tile_uv_size = 1.0 / (2**zoom)
    u0 = tx * tile_uv_size
    v0 = ty * tile_uv_size
    u1 = u0 + tile_uv_size
    v1 = v0 + tile_uv_size

    # --- SHARED GEOMETRY GRIDS ---
    # To support Sobel (Window Expansion), we need a 1-pixel border.
    # Total samples: (tile_size + 1) vertices + 2 borders = tile_size + 3.
    eps = tile_uv_size / tile_size
    v_count_exp = v_count + 2
    
    # Grid centered on the tile, expanded by 1 pixel on all sides
    r_idx_exp = np.linspace(-eps, tile_uv_size + eps, v_count_exp)
    c_idx_exp = np.linspace(-eps, tile_uv_size + eps, v_count_exp)
    ug_exp, vg_exp = np.meshgrid(u0 + c_idx_exp, v0 + r_idx_exp)
    
    ux_map_exp, uy_map_exp, uz_map_exp = s2_face_uv_to_xyz_vec(face, ug_exp, vg_exp)
    lat_grid_exp, lon_grid_exp = s2_xyz_to_latlon_vec(ux_map_exp, uy_map_exp, uz_map_exp)

    from .utils import detect_padding
    actual_dem_padding = detect_padding(dem_ds, dem_padding_mode, dem_padding)
    actual_col_padding = detect_padding(color_ds, color_padding_mode, color_padding)

    detail_luminance = None
    if is_optimized:
        # --- FAST PATH: Direct Cropping with Expansion ---
        from .utils import read_optimized_window
        # Read the expanded window
        dem_data_exp, _ = read_optimized_window(dem_ds, u0 - eps, v0 - eps, u1 + eps, v1 + eps, v_count_exp, v_count_exp, gdal.GRA_Bilinear, padding=actual_dem_padding)
        # Flip and scale
        h_map_exp = np.flipud(np.nan_to_num(dem_data_exp.astype(np.float32), nan=0.0)) * height_scale
        
        # Color doesn't need expansion for Sobel, but we read it as before
        col_data, _ = read_optimized_window(color_ds, u0, v0, u1, v1, texture_size, texture_size, gdal.GRA_Lanczos, padding=actual_col_padding)
        if len(col_data.shape) == 2: col_data = np.stack((col_data, col_data, col_data), axis=-1)
        tex_img = Image.fromarray(np.clip(col_data, 0, 255).astype(np.uint8))
        
        if enrichment and enrichment.get('enabled') and enrichment.get('texture'):
            enrich_alpha = calc_enrichment_alpha(zoom, enrichment.get('min_level', 5), enrichment.get('max_level', 7), enrichment.get('alpha_start', 0.0), enrichment.get('alpha_end', 0.35))
            if enrich_alpha > 0:
                tex_img, detail_luminance = apply_enrichment(tex_img, enrichment['texture'], enrichment.get('blend_mode', 'overlay'), enrichment.get('repeat', 4), enrich_alpha)
        
        timer.mark('IO')
    else:
        # --- SLOW PATH: S2 Projection Sampling ---
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
        
        fetch_scale = max(2.0, float(supersample))
        src_w = int(texture_size * fetch_scale)
        src_h = int(texture_size * fetch_scale)
        
        dem_data, dem_meta = read_raster_window(dem_ds, fetch_min_lon, fetch_min_lat, fetch_max_lon, fetch_max_lat, src_w, src_h, gdal.GRA_Bilinear)
        dem_data = np.nan_to_num(dem_data.astype(np.float32), nan=0.0) * height_scale
        
        col_data, col_meta = read_raster_window(color_ds, fetch_min_lon, fetch_min_lat, fetch_max_lon, fetch_max_lat, src_w, src_h, gdal.GRA_Lanczos)
        if len(col_data.shape) == 2: col_data = np.stack((col_data, col_data, col_data), axis=-1)

        d_min_lon, d_max_lat = dem_meta.get('min_lon', 0), dem_meta.get('max_lat', 0)
        d_scale_x, d_scale_y = dem_meta.get('scale_x', 1), dem_meta.get('scale_y', 1)
        c_min_lon, c_max_lat = col_meta.get('min_lon', 0), col_meta.get('max_lat', 0)
        c_scale_x, c_scale_y = col_meta.get('scale_x', 1), col_meta.get('scale_y', 1)
        timer.mark('IO')

        # Use the shared grids for sampling (Expanded)
        h_map_exp = sample_bilinear_vec(dem_data, lat_grid_exp, lon_grid_exp, d_min_lon, d_max_lat, d_scale_x, d_scale_y)
        
        img_h, img_w = texture_size, texture_size
        if supersample <= 1:
            sub_offsets = [(0.5, 0.5)] 
        else:
            step = 1.0 / supersample
            offset_vals = [step/2.0 + i*step for i in range(supersample)]
            sub_offsets = [(ox, oy) for oy in offset_vals for ox in offset_vals]
        
        sample_weight = 1.0 / len(sub_offsets)
        accum_color = np.zeros((img_h, img_w, 3), dtype=np.float32)
        t_xg, t_yg = np.meshgrid(np.arange(img_w), np.arange(img_h)) 
        
        for ox, oy in sub_offsets:
            u_rel_grid = (t_xg + ox) / img_w
            v_rel_grid = 1.0 - ((t_yg + oy) / img_h)
            u_s2 = u0 + u_rel_grid * tile_uv_size
            v_s2 = v0 + v_rel_grid * tile_uv_size
            ux_t, uy_t, uz_t = s2_face_uv_to_xyz_vec(face, u_s2, v_s2)
            lat_t, lon_t = s2_xyz_to_latlon_vec(ux_t, uy_t, uz_t)
            sample = sample_bilinear_vec(col_data, lat_t, lon_t, c_min_lon, c_max_lat, c_scale_x, c_scale_y)
            accum_color += sample
        tex_img = Image.fromarray(np.clip(accum_color * sample_weight, 0, 255).astype(np.uint8))

        if enrichment and enrichment.get('enabled') and enrichment.get('texture'):
            enrich_alpha = calc_enrichment_alpha(zoom, enrichment.get('min_level', 5), enrichment.get('max_level', 7), enrichment.get('alpha_start', 0.0), enrichment.get('alpha_end', 0.35))
            if enrich_alpha > 0:
                tex_img, detail_luminance = apply_enrichment(tex_img, enrichment['texture'], enrichment.get('blend_mode', 'overlay'), enrichment.get('repeat', 4), enrich_alpha)

    # --- SHARED: Geometry & GLTF ---
    # Extract the center (N+1, N+1) for mesh positions
    heights_map = h_map_exp[1:-1, 1:-1]
    lat_grid = lat_grid_exp[1:-1, 1:-1]
    lon_grid = lon_grid_exp[1:-1, 1:-1]
    
    # Calculate ECEF for the EXPANDED grid to use in Sobel
    xx_exp, yy_exp, zz_exp = latlon_to_ecef_vec(np.radians(lat_grid_exp), np.radians(lon_grid_exp), h_map_exp, radii, is_geodetic)

    # Calculate Normals using Sobel on the expanded grid
    nx, ny, nz = calculate_normals_sobel(xx_exp, yy_exp, zz_exp)
    
    # Mesh center from direct XYZ average (avoids antimeridian wrap-around bug)
    # Using ECEF coords directly instead of lat/lon averaging
    xx = xx_exp[1:-1, 1:-1]
    yy = yy_exp[1:-1, 1:-1]
    zz = zz_exp[1:-1, 1:-1]
    cx, cy, cz = float(np.mean(xx)), float(np.mean(yy)), float(np.mean(zz))
    
    dx = (xx - cx).astype(np.float32).flatten()
    dy = (yy - cy).astype(np.float32).flatten()
    dz = (zz - cz).astype(np.float32).flatten()
    pos_flat = np.stack((dx, dz, -dy), axis=-1).flatten()
    
    if enrichment and enrichment.get('affect_normals') and detail_luminance is not None:
        enrich_alpha = calc_enrichment_alpha(zoom, enrichment.get('min_level', 5), enrichment.get('max_level', 7), enrichment.get('alpha_start', 0.0), enrichment.get('alpha_end', 0.35))
        if enrich_alpha > 0:
            nx, ny, nz = perturb_normals_from_detail(nx.flatten(), ny.flatten(), nz.flatten(), detail_luminance, enrich_alpha, tile_size)
    
    norm_flat = np.stack((nx.flatten(), nz.flatten(), -ny.flatten()), axis=-1).astype(np.float32).flatten()
    
    # Generate UVs with half-texel inset for perfect edge alignment
    # This ensures bilinear filtering samples texel centers, not edges,
    # preventing color bleeding across tile boundaries.
    half_texel = 0.5 / texture_size
    u_vals = np.linspace(half_texel, 1.0 - half_texel, v_count)
    v_vals = np.linspace(1.0 - half_texel, half_texel, v_count)
    ug_uv, vg_uv = np.meshgrid(u_vals, v_vals)
    uv_flat = np.stack((ug_uv, vg_uv), axis=-1).astype(np.float32).flatten()
    
    # Generate Indices
    indices = []
    for r in range(v_count - 1):
        for c in range(v_count - 1):
            i0 = r * v_count + c
            i1 = r * v_count + (c + 1)
            i2 = (r + 1) * v_count + c
            i3 = (r + 1) * v_count + (c + 1)
            indices.extend([i0, i1, i2, i2, i1, i3])
    indices = np.array(indices, dtype=np.uint32)
    
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

        add_skirt_strip([c for c in range(v_count)]) # North
        add_skirt_strip([(v_count - 1) * v_count + c for c in range(v_count)]) # South
        add_skirt_strip([r * v_count for r in range(v_count)]) # West
        add_skirt_strip([(r + 1) * v_count - 1 for r in range(v_count)]) # East

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
    max_r = max(radii)

    min_h = float(np.min(heights_map))
    max_h = float(np.max(heights_map))
    
    # Robust Horizon Occlusion Point (occPoint)
    r_max = max(radii)
    c_len = math.sqrt(cx*cx + cy*cy + cz*cz)
    occ_x, occ_y, occ_z = 0, 0, 0
    if c_len > 0:
        center_dir = np.array([cx, cy, cz]) / c_len
        p_lens = np.sqrt(xx**2 + yy**2 + zz**2).flatten()
        px, py, pz = xx.flatten() / p_lens, yy.flatten() / p_lens, zz.flatten() / p_lens
        cos_thetas = np.clip(px * center_dir[0] + py * center_dir[1] + pz * center_dir[2], -1.0, 1.0)
        thetas = np.arccos(cos_thetas)
        alphas = np.arccos(np.clip(r_max / p_lens, 0.0, 1.0))
        denoms = np.cos(thetas + alphas)
        valid = denoms > 1e-6
        if np.any(valid):
            ds = r_max / denoms[valid]
            max_d = float(np.max(ds))
        else:
            max_d = float(r_max * 10.0)
        occ_x, occ_y, occ_z = center_dir * max_d
    
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
        "min": min_pos,
        "max": max_pos,
        "center": [cx, cy, cz],
        "minHeight": min_h,
        "maxHeight": max_h,
        "occPoint": [occ_x, occ_y, occ_z],
        "geometricError": (max_r * math.pi) / (2.0 * (2**zoom) * 512.0),
        "file_size": len(full_buffer),
        "perf": timer.get_stats()
    }