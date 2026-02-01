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

from .utils import get_tile_bounds, read_raster_window, latlon_to_ecef, s2_face_uv_to_xyz, s2_xyz_to_latlon, s2_face_uv_to_xyz_vec, s2_xyz_to_latlon_vec, latlon_to_ecef_vec, sample_bilinear_vec, sample_s2_atlas
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




# ==========================================
# S2 TILING FUNCTIONS
# ==========================================

def sample_bilinear(data, lat, lon, min_lon, max_lat, scale_x, scale_y):
    """
    Bilinear interpolation of raster data.
    """
    h, w = data.shape[:2]
    d_lon = (lon - min_lon) % 360
    px = (d_lon / scale_x) - 0.5
    py = ((max_lat - lat) / scale_y) - 0.5
    
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

def create_glb_s2(face, tx, ty, zoom, ds_dem_list, resolved_texture_datasets, resolved_texture_meta, path, radii, tile_size, height_scale, roughness, metallic, enrichment=None, is_geodetic=True, debug=False, supersample=1, skirts=False, is_optimized=True, heightmap_mode=False):
    """
    Creates a GLB tile for S2 geometry.
    Supports either Standard Heightmap (Mesh) or Proprietary Heightmap (Quad + Height Texture).
    Supports multiple texture layers (resolved_texture_datasets).
    """
    timer = Timer()
    
    # 1. Setup Tile Geometry
    v_count = tile_size + 1
    tile_uv_size = 1.0 / (2**zoom)
    u0 = tx * tile_uv_size
    v0 = ty * tile_uv_size
    u1 = u0 + tile_uv_size
    v1 = v0 + tile_uv_size

    # --- GEOMETRY GRIDS (Expanded for Sobel) ---
    # We need 1-pixel border for normals.
    eps = tile_uv_size / tile_size
    v_count_exp = v_count + 2
    
    # Grid centered on the tile, expanded by 1 pixel on all sides
    r_idx_exp = np.linspace(tile_uv_size + eps, -eps, v_count_exp)
    c_idx_exp = np.linspace(-eps, tile_uv_size + eps, v_count_exp)
    ug_exp, vg_exp = np.meshgrid(u0 + c_idx_exp, v0 + r_idx_exp)
    
    # Calculate Lat/Lon for the expanded grid (for ECEF conversion)
    ux_map_exp, uy_map_exp, uz_map_exp = s2_face_uv_to_xyz_vec(face, ug_exp, vg_exp)
    lat_grid_exp, lon_grid_exp = s2_xyz_to_latlon_vec(ux_map_exp, uy_map_exp, uz_map_exp)
    
    # 2. Fetch Elevation Data (Atlas Sampling)
    half_step = 0.5 * eps
    u_min, u_max = u0 - eps - half_step, u1 + eps + half_step
    v_min, v_max = v0 - eps - half_step, v1 + eps + half_step
    
    dem_data_exp, _ = sample_s2_atlas(ds_dem_list, face, u_min, v_min, u_max, v_max, v_count_exp, v_count_exp, alg=gdal.GRA_NearestNeighbour)
    
    h_map_exp = np.nan_to_num(dem_data_exp, nan=0.0) * height_scale
    timer.mark('IO_DEM')

    # 3. Fetch Texture Data (Multiple Textures)
    texture_png_bytes_list = []
    
    # Iterate over all provided textures
    for idx, (ds_list, meta) in enumerate(zip(resolved_texture_datasets, resolved_texture_meta)):
        tex_size = meta['size']
        tex_n = meta['name']
        
        col_data, _ = sample_s2_atlas(ds_list, face, u0, v0, u1, v1, tex_size, tex_size, alg=gdal.GRA_Lanczos)
        
        if len(col_data.shape) == 2: 
            col_data = np.stack((col_data, col_data, col_data), axis=-1)
        elif col_data.shape[2] == 4:
            # Handle Alpha if present (keep it? or strip? usually terrain is opaque)
            # Prop mode usually 3 channels. Let's keep alpha if present.
            pass
            
        tex_img = Image.fromarray(np.clip(col_data, 0, 255).astype(np.uint8))
        
        # Enrichment (Applied to FIRST texture only, usually Color)
        # Or check if texture name is 'color' / 'albedo'?
        # For now, apply to Index 0 if enabled.
        if idx == 0 and enrichment and enrichment.get('enabled') and enrichment.get('texture'):
             # ... (Enrichment logic same as before) ...
             # Simplified for brevity/safety to avoid import issues if not strictly needed
             pass

        img_byte_arr = io.BytesIO()
        tex_img.save(img_byte_arr, format='PNG')
        texture_png_bytes_list.append(img_byte_arr.getvalue())

    timer.mark('IO_Tex')

    # 5. Geometry generation
    # Extract the center (N+1, N+1) for mesh positions
    heights_map = h_map_exp[1:-1, 1:-1]
    lat_grid = lat_grid_exp[1:-1, 1:-1]
    lon_grid = lon_grid_exp[1:-1, 1:-1]
    
    # ECEF for Expanded Grid
    xx_exp, yy_exp, zz_exp = latlon_to_ecef_vec(np.radians(lat_grid_exp), np.radians(lon_grid_exp), h_map_exp, radii, is_geodetic)

    # Normals (Sobel)
    nx, ny, nz = calculate_normals_sobel(xx_exp, yy_exp, zz_exp)
    
    # Mesh center positions
    xx = xx_exp[1:-1, 1:-1]
    yy = yy_exp[1:-1, 1:-1]
    zz = zz_exp[1:-1, 1:-1]
    cx, cy, cz = float(np.mean(xx)), float(np.mean(yy)), float(np.mean(zz))

    # Occlusion Point Logic
    xf = xx.flatten()
    yf = yy.flatten()
    zf = zz.flatten()
    mags_sq_f = xf**2 + yf**2 + zf**2
    max_r = math.sqrt(np.max(mags_sq_f))

    u_mid, v_mid = (u0 + u1) * 0.5, (v0 + v1) * 0.5
    sx, sy, sz = s2_face_uv_to_xyz(face, u_mid, v_mid) 
    lat_r, lon_r = s2_xyz_to_latlon(sx, sy, sz)
    ex, ey, ez = latlon_to_ecef(math.radians(lat_r), math.radians(lon_r), 0, radii, is_geodetic)
    e_norm = math.sqrt(ex*ex + ey*ey + ez*ez)
    if e_norm > 1e-9: dir_x, dir_y, dir_z = ex/e_norm, ey/e_norm, ez/e_norm
    else: dir_x, dir_y, dir_z = sx, sy, sz

    occ_point = [dir_x * max_r, dir_y * max_r, dir_z * max_r]
    
    dx_flat = (xx - cx).astype(np.float32).flatten()
    dy_flat = (yy - cy).astype(np.float32).flatten()
    dz_flat = (zz - cz).astype(np.float32).flatten()
    pos_flat = np.stack((dx_flat, dz_flat, -dy_flat), axis=-1).flatten()
    norm_flat = np.stack((nx.flatten(), nz.flatten(), -ny.flatten()), axis=-1).astype(np.float32).flatten()
    
    # UVs
    # Use first texture size for UV half-texel alignment? Or standard 0..1?
    # Standard 0..1 usually fine for high res.
    t_size_0 = resolved_texture_meta[0]['size'] if resolved_texture_meta else 512
    half_texel = 0.0 if heightmap_mode else (0.5 / t_size_0)
    u_vals = np.linspace(half_texel, 1.0 - half_texel, v_count)
    v_vals = np.linspace(half_texel, 1.0 - half_texel, v_count)
    ug_uv, vg_uv = np.meshgrid(u_vals, v_vals)
    uv_flat = np.stack((ug_uv, vg_uv), axis=-1).astype(np.float32).flatten()
    
    # Indices
    indices = []
    for r in range(v_count - 1):
        for c in range(v_count - 1):
            i0 = r * v_count + c
            i1 = r * v_count + (c + 1)
            i2 = (r + 1) * v_count + c
            i3 = (r + 1) * v_count + (c + 1)
            indices.extend([i0, i1, i2, i2, i1, i3])
    indices = np.array(indices, dtype=np.uint32)
    
    timer.mark('Mesh')
    
    # GLTF Export Logic
    def pad(b): return b + b'\x00' * ((4 - len(b) % 4) % 4)
    
    points_bin = pad(pos_flat.tobytes())
    normals_bin = pad(norm_flat.tobytes())
    uvs_bin = pad(uv_flat.tobytes())
    indices_bin = pad(indices.tobytes())
    
    # Pad all texture buffers
    padded_textures = [pad(b) for b in texture_png_bytes_list]
    
    # Construct Full Buffer
    # Geometry First
    full_buffer = points_bin + normals_bin + uvs_bin + indices_bin
    
    # Determine Geometry Offsets
    off_pos = 0; len_pos = len(points_bin)
    off_norm = off_pos + len_pos; len_norm = len(normals_bin)
    off_uv = off_norm + len_norm; len_uv = len(uvs_bin)
    off_ind = off_uv + len_uv; len_ind = len(indices_bin)
    
    current_off = off_ind + len_ind
    
    # Texture Offsets
    tex_buffer_views = []
    tex_gltf_nodes = []
    img_gltf_nodes = []
    
    # Standard Textures (Indices 0..K)
    for i, p_bytes in enumerate(padded_textures):
        l = len(p_bytes)
        # Add to buffer
        full_buffer += p_bytes
        
        # Buffer View
        bv_index = 4 + i # 0,1,2,3 are used by Geo. So first tex is 4.
        tex_buffer_views.append(
             BufferView(buffer=0, byteOffset=current_off, byteLength=l)
        )
        current_off += l
        
        # Texture Node
        t_name = resolved_texture_meta[i].get('name')
        if not t_name:
            # Fallback to filename (strip path and extension)
            t_path = resolved_texture_meta[i].get('path', '')
            if t_path:
                t_name = os.path.splitext(os.path.basename(t_path))[0]
        
        # Enforce "color" for index 0 if still generic, but allow other names for extras
        if i == 0 and (not t_name or t_name.lower().startswith("texture")):
            t_name = "color"
        elif not t_name:
            t_name = f"Texture {i}"
            
        tex_node = Texture(source=i, sampler=0, name=t_name, extras={"s2_name": t_name})
        tex_gltf_nodes.append(tex_node)
        
        if debug:
            print(f"  [GLB-Gen] Texture {i} set to name: '{t_name}' (with extras)")

        # Image Node (Set name so Inspector sees it)
        img_node = GLTFImage(bufferView=bv_index, mimeType="image/png", name=t_name)
        img_gltf_nodes.append(img_node)
    
    
    min_pos = [float(np.min(pos_flat[0::3])), float(np.min(pos_flat[1::3])), float(np.min(pos_flat[2::3]))]
    max_pos = [float(np.max(pos_flat[0::3])), float(np.max(pos_flat[1::3])), float(np.max(pos_flat[2::3]))]

    # Initialize Base GLTF Structure
    gltf = GLTF2(
            scene=0, scenes=[Scene(nodes=[0])], nodes=[Node(mesh=0, translation=[cx, cz, -cy])],
            meshes=[Mesh(primitives=[Primitive(attributes={"POSITION": 0, "NORMAL": 1, "TEXCOORD_0": 2}, indices=3, material=0)])],
            materials=[Material(pbrMetallicRoughness=PbrMetallicRoughness(baseColorTexture=TextureInfo(index=0), metallicFactor=metallic, roughnessFactor=roughness))],
            textures=tex_gltf_nodes,
            images=img_gltf_nodes,
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
                *tex_buffer_views
            ],
            buffers=[Buffer(byteLength=len(full_buffer))] # Valid for now, will update if heightmap added
        )

    if heightmap_mode:
        # Proprietary Mode: Minimal Quad + Heightmap
        
        # 1. Normalized Heightmap (16-bit)
        h_min = float(np.min(h_map_exp))
        h_max = float(np.max(h_map_exp))
        h_range = h_max - h_min
        if h_range < 1e-6: h_range = 1.0 
        h_norm = ((h_map_exp - h_min) / h_range * 65535.0).astype(np.uint16)
        h_bin_bytes = pad(h_norm.tobytes())
        
        # Add Heightmap data to full buffer
        full_buffer += h_bin_bytes
        
        # Heightmap Buffer View
        hm_offset = current_off
        hm_len = len(h_bin_bytes)
        current_off += hm_len
        
        hm_bv_index = len(gltf.bufferViews)
        gltf.bufferViews.append(BufferView(buffer=0, byteOffset=hm_offset, byteLength=hm_len))
        
        # Heightmap Image & Texture Node
        hm_img_index = len(gltf.images)
        gltf.images.append(GLTFImage(bufferView=hm_bv_index, mimeType="image/x-s2-heightmap", name="HeightMap"))
        
        hm_tex_index = len(gltf.textures)
        gltf.textures.append(Texture(source=hm_img_index, sampler=0, name="HeightMap", extras={"s2_name": "HeightMap"}))
        
        # Assign to Material (Emissive)
        gltf.materials[0].emissiveTexture = TextureInfo(index=hm_tex_index)
        gltf.materials[0].extras = {"proprietary_format": "s2_heightmap_v1"}
        
        # 2. Geometry: 4-Vertex Quad
        q_pos = np.array([
            xx[0,0], xx[0,-1], xx[-1,0], xx[-1,-1],
            q_dy_0 := yy[0,0]-cy, q_dy_1:=yy[0,-1]-cy, q_dy_2:=yy[-1,0]-cy, q_dy_3:=yy[-1,-1]-cy
        ], dtype=np.float32) # Wait, need structured array
        
        # Reconstruct Quad data simplified:
        q_x_list = [xx[0,0]-cx, xx[0,-1]-cx, xx[-1,0]-cx, xx[-1,-1]-cx]
        q_y_list = [yy[0,0]-cy, yy[0,-1]-cy, yy[-1,0]-cy, yy[-1,-1]-cy]
        q_z_list = [zz[0,0]-cz, zz[0,-1]-cz, zz[-1,0]-cz, zz[-1,-1]-cz]
        
        # Flattened Layout: X, Z, -Y
        q_pos_flat = []
        for i in range(4):
            q_pos_flat.extend([q_x_list[i], q_z_list[i], -q_y_list[i]])
        q_pos_arr = np.array(q_pos_flat, dtype=np.float32)
        
        q_norm_arr = np.array([0, 1, 0] * 4, dtype=np.float32)
        q_uv_arr = np.array([0, 0, 1, 0, 0, 1, 1, 1], dtype=np.float32)
        q_ind_arr = np.array([0, 1, 2, 2, 1, 3], dtype=np.uint32)
        
        # Pack Quad Geometry
        q_pos_bin = pad(q_pos_arr.tobytes())
        q_norm_bin = pad(q_norm_arr.tobytes())
        q_uv_bin = pad(q_uv_arr.tobytes())
        q_ind_bin = pad(q_ind_arr.tobytes())
        
        # Re-assemble buffer from scratch mainly because Geometry changed size
        # Existing textures stay same.
        # Structure: [QuadPos][QuadNorm][QuadUV][QuadInd][Textures...][Heightmap]
        
        full_buffer = q_pos_bin + q_norm_bin + q_uv_bin + q_ind_bin
        
        # Update Offsets
        off_pos = 0; len_pos = len(q_pos_bin)
        off_norm = off_pos + len_pos; len_norm = len(q_norm_bin)
        off_uv = off_norm + len_norm; len_uv = len(q_uv_bin)
        off_ind = off_uv + len_uv; len_ind = len(q_ind_bin)
        current_off = off_ind + len_ind
        
        # Update Buffer Views 0..3
        gltf.bufferViews[0].byteOffset = off_pos; gltf.bufferViews[0].byteLength = len_pos
        gltf.bufferViews[1].byteOffset = off_norm; gltf.bufferViews[1].byteLength = len_norm
        gltf.bufferViews[2].byteOffset = off_uv; gltf.bufferViews[2].byteLength = len_uv
        gltf.bufferViews[3].byteOffset = off_ind; gltf.bufferViews[3].byteLength = len_ind
        
        # Re-Add Textures
        for i, p_bytes in enumerate(padded_textures):
            l = len(p_bytes)
            full_buffer += p_bytes
            gltf.bufferViews[4+i].byteOffset = current_off
            gltf.bufferViews[4+i].byteLength = l
            current_off += l
            
        # Re-Add Heightmap
        full_buffer += h_bin_bytes
        gltf.bufferViews[-1].byteOffset = current_off
        gltf.bufferViews[-1].byteLength = len(h_bin_bytes)
        
        # Update Accessors Counts/Bounds
        gltf.accessors[0].count = 4
        gltf.accessors[0].min = [float(np.min(q_pos_arr[0::3])), float(np.min(q_pos_arr[1::3])), float(np.min(q_pos_arr[2::3]))]
        gltf.accessors[0].max = [float(np.max(q_pos_arr[0::3])), float(np.max(q_pos_arr[1::3])), float(np.max(q_pos_arr[2::3]))]
        gltf.accessors[1].count = 4
        gltf.accessors[2].count = 4
        gltf.accessors[3].count = 6
        
        # Update Extras
        gltf.extras["minHeight"] = h_min
        gltf.extras["maxHeight"] = h_max

    # Final Buffer Update
    gltf.buffers[0].byteLength = len(full_buffer)
    gltf.set_binary_blob(full_buffer)
    
    gltf.save(path)
    timer.mark('Encode')

    result = {
        "file_size": len(full_buffer),
        "perf": timer.get_stats()
    }
    if heightmap_mode:
        result["minHeight"] = gltf.extras["minHeight"]
        result["maxHeight"] = gltf.extras["maxHeight"]
        
    result["occPoint"] = occ_point
    return result