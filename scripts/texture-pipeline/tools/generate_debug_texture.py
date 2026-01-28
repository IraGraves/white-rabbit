import numpy as np
import sys
import argparse
from PIL import Image, ImageDraw, ImageFont
# osgeo removed to avoid dependency conflict in standard python

# --- CONFIGURATION ---
TEXTURE_WIDTH = 16384        
OUTPUT_FILENAME = "s2_debug.tif"
DRAW_CHECKERBOARD = True    

# --- Rasterio Import ---
try:
    import rasterio
    from rasterio.transform import from_origin
except ImportError:
    print("[ERROR] Rasterio not found. Please install it or run in OSGeo4W Shell.")
    sys.exit(1)

# ... (rest of the file until save logic) ...

class AdjacencyProber:
    def __init__(self):
        self.sides = ["Top", "Right", "Bottom", "Left"] # 0, 1, 2, 3

    def get_xyz(self, face, u, v):
        # Maps face UV (-1..1) to unnormalized XYZ based on script conventions
        # F0 (+X): u=Y, v=Z
        if face == 0: return np.array([1, u, v])
        # F1 (+Y): u=-X, v=Z
        if face == 1: return np.array([-u, 1, v])
        # F2 (+Z): u=-X, v=-Y
        if face == 2: return np.array([-u, -v, 1])
        # F3 (-X): u=Z, v=Y
        if face == 3: return np.array([-1, v, u])
        # F4 (-Y): u=Z, v=-X
        if face == 4: return np.array([-v, -1, u])
        # F5 (-Z): u=-Y, v=-X
        if face == 5: return np.array([-v, -u, -1])
        return np.array([0,0,0])

    def xyz_to_face_uv(self, x, y, z):
        ax, ay, az = abs(x), abs(y), abs(z)
        max_val = max(ax, ay, az)
        
        face = -1
        u, v = 0.0, 0.0
        
        if ax == max_val:
            if x > 0: # F0
                face = 0; u = y/x; v = z/x
            else:     # F3
                face = 3; u = z/abs(x); v = y/abs(x)
        elif ay == max_val:
            if y > 0: # F1
                face = 1; u = -x/y; v = z/y
            else:     # F4
                face = 4; u = z/abs(y); v = -x/abs(y)
        else: # az == max_val
            if z > 0: # F2
                face = 2; u = -x/z; v = -y/z
            else:     # F5
                face = 5; u = -y/abs(z); v = -x/abs(z)
                
        return face, u, v

    def probe(self, face, side_idx):
        # side_idx: 0=Top(v=1), 1=Right(u=1), 2=Bottom(v=-1), 3=Left(u=-1)
        u, v = 0.0, 0.0
        step = 1.05 # Step just outside
        if side_idx == 0: v = step  # Top
        elif side_idx == 1: u = step # Right
        elif side_idx == 2: v = -step # Bottom
        elif side_idx == 3: u = -step # Left
        
        xyz = self.get_xyz(face, u, v)
        n_face, nu, nv = self.xyz_to_face_uv(xyz[0], xyz[1], xyz[2])
        
        # Determine which side we landed on
        # Tolerance usually needed but with 1.05 step we should be clear
        n_side = -1
        if nv > 0.9: n_side = 0
        elif nu > 0.9: n_side = 1
        elif nv < -0.9: n_side = 2
        elif nu < -0.9: n_side = 3
        
        return n_face, n_side

def stamp_rgba_3d(img_rgb, X, Y, Z, overlay_img, center_vec, up_vec, right_vec, scale):
    h, w = img_rgb.shape[:2]
    
    # --- 1. PREPARE OVERLAY ---
    overlay_arr = np.array(overlay_img)
    oh, ow = overlay_arr.shape[:2]
    
    # --- 2. FIND CROP WINDOW ---
    cx, cy, cz = center_vec
    inv_len = 1.0 / np.sqrt(cx*cx + cy*cy + cz*cz)
    cx, cy, cz = cx*inv_len, cy*inv_len, cz*inv_len
    
    vis_w = int(w * 0.2) # Initial guess
    
    # Lat/Lon calculation
    lat_rad = np.arcsin(cz)
    lon_rad = np.arctan2(cy, cx)
    px = int( ((lon_rad + np.pi) / (2 * np.pi)) * w ) % w
    py = int( ((np.pi/2 - lat_rad) / np.pi) * h )
    
    margin = int(w * 0.15)
    is_polar = abs(cz) > 0.90
    if is_polar: x1, x2 = 0, w
    else: x1, x2 = max(0, px - margin), min(w, px + margin)
    y1, y2 = max(0, py - margin), min(h, py + margin)
    
    if x2 <= x1 or y2 <= y1: return

    # --- 3. SLICE ARRAYS ---
    X_sub = X[y1:y2, x1:x2]
    Y_sub = Y[y1:y2, x1:x2]
    Z_sub = Z[y1:y2, x1:x2]
    img_sub = img_rgb[y1:y2, x1:x2]

    # --- 4. PROJECTION ---
    dX = X_sub - center_vec[0]
    dY = Y_sub - center_vec[1]
    dZ = Z_sub - center_vec[2]

    u_proj = (dX * right_vec[0] + dY * right_vec[1] + dZ * right_vec[2])
    v_proj = (dX * up_vec[0]    + dY * up_vec[1]    + dZ * up_vec[2])
    
    facing_dot = (X_sub * center_vec[0] + Y_sub * center_vec[1] + Z_sub * center_vec[2])
    mask_facing = facing_dot > 0 

    tex_x = (u_proj / scale) + (ow / 2)
    tex_y = (-v_proj / scale) + (oh / 2)
    
    mask_valid = (tex_x >= 0) & (tex_x < ow-1) & (tex_y >= 0) & (tex_y < oh-1) & mask_facing
    
    tex_x_int = tex_x[mask_valid].astype(int)
    tex_y_int = tex_y[mask_valid].astype(int)
    
    # sample overlay
    sampled = overlay_arr[tex_y_int, tex_x_int]
    
    # Blending
    target_pixels = img_sub[mask_valid]
    
    # Check if alpha exists
    if sampled.shape[1] == 4:
        alpha = sampled[:, 3] / 255.0
        rgb = sampled[:, :3]
        blended = (rgb * alpha[:, None] + target_pixels * (1 - alpha[:, None])).astype(np.uint8)
        img_sub[mask_valid] = blended
    else:
        img_sub[mask_valid] = sampled

    img_rgb[y1:y2, x1:x2] = img_sub


print("Script started...")

def stamp_text_3d(img_rgb, X, Y, Z, text, center_vec, up_vec, right_vec, font, scale):
    h, w = img_rgb.shape[:2]

    # --- 1. PREPARE LABEL IMAGE ---
    dummy_draw = ImageDraw.Draw(Image.new('L', (1, 1)))
    bbox = dummy_draw.textbbox((0, 0), text, font=font)
    
    # Dynamic Buffer Size: 20% width for label width, 10% for height
    lbl_w = int(w * 0.2)
    lbl_h = int(w * 0.1)

    lbl_img = Image.new('L', (lbl_w, lbl_h), 0)
    draw = ImageDraw.Draw(lbl_img)
    draw.text((lbl_w/2, lbl_h/2), text, font=font, fill=255, anchor="mm", align="center")
    lbl_arr = np.array(lbl_img)

    # --- 2. FIND CROP WINDOW (OPTIMIZATION) ---
    # Convert the 3D center_vec to (col, row) image coordinates
    # to avoid processing the entire 16k image for a small label.
    cx, cy, cz = center_vec
    # Normalize
    inv_len = 1.0 / np.sqrt(cx*cx + cy*cy + cz*cz)
    cx, cy, cz = cx*inv_len, cy*inv_len, cz*inv_len
    
    # Lat/Lon calculation
    lat_rad = np.arcsin(cz)
    lon_rad = np.arctan2(cy, cx)
    
    # Map lat/lon to pixel X/Y (Equirectangular)
    px = int( ((lon_rad + np.pi) / (2 * np.pi)) * w ) % w
    py = int( ((np.pi/2 - lat_rad) / np.pi) * h )
    
    # Dynamic Crop Margin: 15% width
    margin_x = int(w * 0.15)
    margin_y = int(w * 0.15)
    
    # FIX for Polar Regions:
    # If we are near a pole (abs(z) ~ 1), the "neighborhood" in 3D space
    # spans the entire width of the 2D map (all longitudes).
    # So we force the window to be the full width of the image.
    is_polar = abs(cz) > 0.95

    if is_polar:
        x1 = 0
        x2 = w
    else:
        x1 = max(0, px - margin_x); x2 = min(w, px + margin_x)

    y1 = max(0, py - margin_y); y2 = min(h, py + margin_y)
    
    if x2 <= x1 or y2 <= y1: return

    # --- 3. SLICE ARRAYS (Work on small copies) ---
    # We only read the geometry for the window we care about
    X_sub = X[y1:y2, x1:x2]
    Y_sub = Y[y1:y2, x1:x2]
    Z_sub = Z[y1:y2, x1:x2]
    img_sub = img_rgb[y1:y2, x1:x2]

    # --- 4. PROJECTION LOGIC (On the slice) ---
    dX = X_sub - center_vec[0]
    dY = Y_sub - center_vec[1]
    dZ = Z_sub - center_vec[2]

    u_proj = (dX * right_vec[0] + dY * right_vec[1] + dZ * right_vec[2])
    v_proj = (dX * up_vec[0]    + dY * up_vec[1]    + dZ * up_vec[2])
    
    facing_dot = (X_sub * center_vec[0] + Y_sub * center_vec[1] + Z_sub * center_vec[2])
    mask_facing = facing_dot > 0 

    tex_x = (u_proj / scale) + (lbl_w / 2)
    tex_y = (-v_proj / scale) + (lbl_h / 2)
    
    mask_valid = (tex_x >= 0) & (tex_x < lbl_w-1) & (tex_y >= 0) & (tex_y < lbl_h-1) & mask_facing
    
    tex_x_int = tex_x[mask_valid].astype(int)
    tex_y_int = tex_y[mask_valid].astype(int)
    sampled_vals = lbl_arr[tex_y_int, tex_x_int]
    
    # Apply to the sub-image
    text_pixels_mask = np.zeros_like(mask_valid)
    text_pixels_mask[mask_valid] = (sampled_vals > 100)
    
    img_sub[text_pixels_mask] = [255, 255, 255]
    
    # --- 5. PASTE BACK ---
    img_rgb[y1:y2, x1:x2] = img_sub

def generate_geotiff_debug(width, filename, rx=None, ry=None, rz=None):
    height = width // 2
    print(f"Generating {width}x{height} S2 debug texture...")
    if rx: print(f"Using Radii: X={rx}, Y={ry}, Z={rz}")

    # --- SETUP FONTS ---
    font = None
    font_small = None
    try: 
        font = ImageFont.truetype("arialbd.ttf", int(width / 50))
    except: 
        try: font = ImageFont.load_default()
        except: pass
        
    try: 
        font_small = ImageFont.truetype("arial.ttf", int(width / 180))
    except: 
        try: font_small = ImageFont.load_default()
        except: pass

    pixel_scale = (2.0 * np.pi) / width
    
    # --- 1. GEOMETRY ---
    # Add dtype=np.float32 to these lines:
    x_indices = np.linspace(-np.pi, np.pi, width, dtype=np.float32)
    y_indices = np.linspace(np.pi/2, -np.pi/2, height, dtype=np.float32)
    
    lon, lat = np.meshgrid(x_indices, y_indices)

    # The resulting X, Y, Z arrays will now inherit float32 automatically
    X = np.cos(lat) * np.cos(lon)
    Y = np.cos(lat) * np.sin(lon)
    Z = np.sin(lat)
    
    abs_X, abs_Y, abs_Z = np.abs(X), np.abs(Y), np.abs(Z)

    # --- 2. FACES & BASE COLORS ---
    face_map = np.full((height, width), -1, dtype=np.int8)
    max_val = np.maximum(np.maximum(abs_X, abs_Y), abs_Z)
    
    mask_x = (abs_X == max_val)
    face_map[mask_x & (X > 0)] = 0; face_map[mask_x & (X < 0)] = 3
    
    mask_y = (abs_Y == max_val)
    face_map[mask_y & (Y > 0)] = 1; face_map[mask_y & (Y < 0)] = 4
    
    mask_z = (abs_Z == max_val)
    face_map[mask_z & (Z > 0)] = 2; face_map[mask_z & (Z < 0)] = 5

    colors = np.array([
        [200, 50, 50], [50, 200, 50], [50, 50, 200],
        [200, 200, 50], [50, 200, 200], [200, 50, 200]
    ], dtype=np.uint8)
    
    img_rgb = colors[face_map]

    # --- PRE-CALCULATE ANGLES & MASKS ---
    centers = np.array([[1,0,0], [0,1,0], [0,0,1], [-1,0,0], [0,-1,0], [0,0,-1]])
    pixel_centers = centers[face_map]
    dot_prod = np.clip((X * pixel_centers[:,:,0] + Y * pixel_centers[:,:,1] + Z * pixel_centers[:,:,2]), -1.0, 1.0)
    angles = np.arccos(dot_prod)

    # Define the Ring Mask (Between Circle 2 @ 24deg and Circle 3 @ 36deg)
    mask_ring = (angles > np.deg2rad(24.5)) & (angles < np.deg2rad(35.5))

# --- 3. ROTATED CHECKERBOARD PATTERN ---
    if DRAW_CHECKERBOARD:
        print("   [Progress] Applying ROTATED checkerboard pattern...", flush=True)
        check_freq = 120.0 
        
        # Initialize local UV arrays
        # We map the relevant 3D coordinates to a 2D plane for each face
        # to ensure the grid is square and consistent on all faces (including poles).
        chk_u = np.zeros_like(X)
        chk_v = np.zeros_like(X)

        # Face 0 (+X): u=Y, v=Z
        m = (face_map == 0); chk_u[m] = Y[m]; chk_v[m] = Z[m]
        # Face 1 (+Y): u=-X, v=Z
        m = (face_map == 1); chk_u[m] = -X[m]; chk_v[m] = Z[m]
        # Face 2 (+Z): u=-X, v=-Y  <-- Fixes the North Pole distortion
        m = (face_map == 2); chk_u[m] = -X[m]; chk_v[m] = -Y[m]
        # Face 3 (-X): u=Z, v=Y
        m = (face_map == 3); chk_u[m] = Z[m]; chk_v[m] = Y[m]
        # Face 4 (-Y): u=Z, v=-X
        m = (face_map == 4); chk_u[m] = Z[m]; chk_v[m] = -X[m]
        # Face 5 (-Z): u=-Y, v=-X  <-- Fixes the South Pole distortion
        m = (face_map == 5); chk_u[m] = -Y[m]; chk_v[m] = -X[m]

        # 45 Degree Rotation
        rot_cos = 0.707
        rot_sin = 0.707
        
        # Apply rotation to the local face coordinates
        u_rot = chk_u * rot_cos - chk_v * rot_sin
        v_rot = chk_u * rot_sin + chk_v * rot_cos
        
        checker = (np.sin(u_rot * check_freq) * np.sin(v_rot * check_freq)) > 0
        
        # Apply only in the ring
        shadow_mask = checker & mask_ring
        img_rgb[shadow_mask] = (img_rgb[shadow_mask] * 0.6).astype(np.uint8)

    # --- 4. BORDERS & GRIDS ---
    print("   [Progress] Calculating borders and grid...", flush=True)
    
    min_val = np.minimum(np.minimum(abs_X, abs_Y), abs_Z)
    second_max = (abs_X + abs_Y + abs_Z) - max_val - min_val
    border_zone = (max_val - second_max) < 0.015
    freq = 60.0 
    
    xy_border = border_zone & (abs_Z < 0.5) 
    check_xy = np.sin(Z * freq * 3)
    mask_check_xy = xy_border & ((check_xy * (abs_X - abs_Y)) > 0)
    img_rgb[mask_check_xy] = [255, 255, 255]

    z_border = border_zone & (abs_Z >= 0.5)
    check_z = np.sin(np.arctan2(Y, X) * freq)
    max_xy = np.maximum(abs_X, abs_Y)
    mask_check_z = z_border & ((check_z * (max_xy - abs_Z)) > 0)
    img_rgb[mask_check_z] = [255, 255, 255]

    # Standard Black Grid
    l1_thickness = 0.004
    mask_l1 = (abs_X < l1_thickness) | (abs_Y < l1_thickness) | (abs_Z < l1_thickness)
    
    # *** FIX: Mask out the grid inside the Checkerboard Ring ***
    mask_l1 = mask_l1 & (~border_zone) & (~mask_ring)
    
    img_rgb[mask_l1] = [30, 30, 30] 

    # --- ZIPPER LOGIC (Face 3 Seam) ---
    is_back_seam = (abs_Y < l1_thickness) & (face_map == 3)
    
    # Mask out the zipper inside the Ring as well
    mask_zipper_zone = is_back_seam & (~mask_ring)
    
    zipper_pattern = np.sin(Z * freq * 2.0) > 0
    f3_col = [200, 200, 50]
    
    img_rgb[mask_zipper_zone & (lon < 0) & zipper_pattern] = f3_col
    img_rgb[mask_zipper_zone & (lon > 0) & (~zipper_pattern)] = f3_col

# --- 4a. GEOGRAPHIC GRID (15 Degree Intervals) ---
    grid_rad = np.deg2rad(15.0)
    grid_thick_geo = 0.03 # Radians
    
    # Use modulo to find grid lines
    # We divide by cos(lat) for longitude to keep line width consistent near poles
    lon_lines = np.abs(np.mod(lon + np.pi, grid_rad) - (grid_rad/2)) < (grid_thick_geo / (np.cos(lat) + 0.01))
    lat_lines = np.abs(np.mod(lat + (np.pi/2), grid_rad) - (grid_rad/2)) < grid_thick_geo
    
    # Draw faint white grid
    geo_mask = (lon_lines | lat_lines) & (~mask_ring) & (~border_zone)
    
    # Blend with existing color (50% opacity white)
    target_pixels = img_rgb[geo_mask]
    blended = (target_pixels.astype(np.float32) * 0.5 + np.array([255,255,255]) * 0.5).astype(np.uint8)
    img_rgb[geo_mask] = blended

# --- 4b. GREAT CIRCLE ALIGNMENT TEST ---
    print("   ...drawing great circle alignment lines (Internal only)")
    gc_thickness = 0.008
    gc_color = [255, 140, 0] # Bright Orange

    # Define planes for Great Circles: X=Y, Y=Z, Z=X
    mask_gc1 = np.abs(X - Y) < gc_thickness
    mask_gc2 = np.abs(Y - Z) < gc_thickness
    mask_gc3 = np.abs(Z - X) < gc_thickness
    
    # Inverse diagonals
    mask_gc4 = np.abs(X + Y) < gc_thickness
    mask_gc5 = np.abs(Y + Z) < gc_thickness
    mask_gc6 = np.abs(Z + X) < gc_thickness

    combined_gc = mask_gc1 | mask_gc2 | mask_gc3 | mask_gc4 | mask_gc5 | mask_gc6
    
    # Exclude the Ring AND the Border Zone so they don't touch the seams
    # Note: 'border_zone' must be defined before running this block
    final_gc_mask = combined_gc & (~mask_ring) & (~border_zone)
    
    img_rgb[final_gc_mask] = gc_color

# --- 4c. CUBE CORNER MARKERS (Transparent) ---
    # Corners exist where |X| approx |Y| approx |Z|
    dev_xy = np.abs(abs_X - abs_Y)
    dev_yz = np.abs(abs_Y - abs_Z)
    dev_zx = np.abs(abs_Z - abs_X)
    
    # Threshold for the corner dots
    mask_corners = (dev_xy < 0.05) & (dev_yz < 0.05) & (dev_zx < 0.05)
    
    # --- BLENDING LOGIC ---
    # Extract the existing pixels at the corner locations
    bg_pixels = img_rgb[mask_corners].astype(np.float32)
    cyan_color = np.array([0, 255, 255], dtype=np.float32)
    
    # Blend: 50% Original + 50% Cyan
    blended_corners = (bg_pixels * 0.5 + cyan_color * 0.5).astype(np.uint8)
    
    # Apply back to the image
    img_rgb[mask_corners] = blended_corners

# --- 4d. ADVANCED RESOLUTION MATRIX (Face 0) ---
    print("   ...generating advanced resolution matrix (Face 0)")
    
    # 1. Define the Master Region (Face 0, Lower Half)
    #    We split this area into 3 columns side-by-side
    mask_res_master = (face_map == 0) & (np.abs(Y) < 0.9) & (Z > -0.6) & (Z < -0.15)

    if np.any(mask_res_master):
        # Normalize coordinates within the master box
        # Y goes from -0.9 to +0.9 (Width)
        # Z goes from -0.6 to -0.15 (Height)
        
        # --- COLUMNS ---
        # Left:   Vertical Stripes   (Y < -0.3)
        # Center: Concentric Rings   (-0.3 < Y < 0.3)
        # Right:  Horizontal Stripes (Y > 0.3)
        
        # Frequencies (Pixel Widths)
        f_1px  = width / 2.0
        f_2px  = width / 4.0
        f_4px  = width / 8.0
        f_8px  = width / 16.0
        f_16px = width / 32.0

        # --- A. LEFT COLUMN: VERTICAL STRIPES (Tests Horizontal Res) ---
        mask_col1 = mask_res_master & (Y < -0.3)
        if np.any(mask_col1):
            z_norm = (Z[mask_col1] - (-0.6)) / 0.45  # 0..1 from bottom to top
            pat_v = np.zeros(z_norm.shape)
            
            # Use Longitude (lon) for exact horizontal pixel mapping
            l_vals = lon[mask_col1]

            pat_v[z_norm > 0.8] = np.cos(l_vals[z_norm > 0.8] * f_1px)
            pat_v[(z_norm > 0.6) & (z_norm <= 0.8)] = np.cos(l_vals[(z_norm > 0.6) & (z_norm <= 0.8)] * f_2px)
            pat_v[(z_norm > 0.4) & (z_norm <= 0.6)] = np.cos(l_vals[(z_norm > 0.4) & (z_norm <= 0.6)] * f_4px)
            pat_v[(z_norm > 0.2) & (z_norm <= 0.4)] = np.cos(l_vals[(z_norm > 0.2) & (z_norm <= 0.4)] * f_8px)
            pat_v[z_norm <= 0.2] = np.cos(l_vals[z_norm <= 0.2] * f_16px)

            img_rgb[mask_col1] = np.where(pat_v[:, None] > 0, [255,255,255], [0,0,0]).astype(np.uint8)

        # --- B. RIGHT COLUMN: HORIZONTAL STRIPES (Tests Vertical Res) ---
        mask_col3 = mask_res_master & (Y > 0.3)
        if np.any(mask_col3):
            # We map Y (width) to bands instead of Z (height)
            # So the bands run vertically, but the stripes inside run horizontally.
            y_norm = (Y[mask_col3] - 0.3) / 0.6 # 0..1 from left to right
            
            # To get exact pixel-height stripes, we need to map Z to image rows (latitude)
            # Since this is equirectangular, latitude maps non-linearly to pixel rows,
            # but for a small patch near the equator, sin(lat) ~ lat.
            # However, simpler approach: Map based on lat index
            # Frequency relative to Height (Width/2)
            h_f_1px  = (width/2) / 2.0
            h_f_2px  = (width/2) / 4.0
            h_f_4px  = (width/2) / 8.0
            h_f_8px  = (width/2) / 16.0
            
            lat_vals = lat[mask_col3]
            pat_h = np.zeros(y_norm.shape)
            
            # Arrange bands from Left (Fine) to Right (Coarse)
            pat_h[y_norm < 0.25] = np.cos(lat_vals[y_norm < 0.25] * h_f_1px)
            pat_h[(y_norm >= 0.25) & (y_norm < 0.50)] = np.cos(lat_vals[(y_norm >= 0.25) & (y_norm < 0.50)] * h_f_2px)
            pat_h[(y_norm >= 0.50) & (y_norm < 0.75)] = np.cos(lat_vals[(y_norm >= 0.50) & (y_norm < 0.75)] * h_f_4px)
            pat_h[y_norm >= 0.75] = np.cos(lat_vals[y_norm >= 0.75] * h_f_8px)
            
            img_rgb[mask_col3] = np.where(pat_h[:, None] > 0, [255,255,255], [0,0,0]).astype(np.uint8)

        # --- C. CENTER COLUMN: ZONE PLATE (Circular Resolution) ---
        mask_col2 = mask_res_master & (np.abs(Y) <= 0.3)
        if np.any(mask_col2):
            # Center coordinate of the circle
            c_y, c_z = 0.0, -0.375
            
            # Distance from center
            dy = Y[mask_col2] - c_y
            dz = Z[mask_col2] - c_z
            dist_sq = dy*dy + dz*dz
            
            # Chirp function: sin(k * r^2)
            # This creates rings that get finer as you move outward
            # Tuned so the outer edge is near Nyquist limit
            k = 30000.0 
            pat_c = np.cos(dist_sq * k)
            
            img_rgb[mask_col2] = np.where(pat_c[:, None] > 0, [255,255,255], [0,0,0]).astype(np.uint8)

        # --- D. VISIBILITY: BORDERS & LABELS ---
        # Yellow Outline for the whole master block
        outline_mask = mask_res_master & (
            (Z < -0.59) | (Z > -0.16) |          
            (np.abs(np.abs(Y) - 0.9) < 0.01)     
        )
        img_rgb[outline_mask] = [255, 255, 0]
        
        # Red Separators between columns
        sep_mask = mask_res_master & (
            (np.abs(Y - (-0.3)) < 0.005) | (np.abs(Y - 0.3) < 0.005)
        )
        img_rgb[sep_mask] = [255, 0, 0]

    # --- 5. CIRCLES & ARROWS ---
    thickness = np.deg2rad(0.5)
    
    mask_black = np.abs(angles - np.deg2rad(36.0)) < thickness
    img_rgb[mask_black] = [0, 0, 0] 
    mask_grey = np.abs(angles - np.deg2rad(24.0)) < thickness
    img_rgb[mask_grey] = [180, 180, 180] 
    mask_white = np.abs(angles - np.deg2rad(12.0)) < thickness
    img_rgb[mask_white] = [255, 255, 255] 

    mask_center = angles < np.deg2rad(8.0)
    arrow_width = 0.015
    u_val = np.zeros_like(X); v_val = np.zeros_like(X)
    
    m = (face_map == 0); u_val[m] = Y[m]; v_val[m] = Z[m]
    m = (face_map == 1); u_val[m] = -X[m]; v_val[m] = Z[m]
    m = (face_map == 2); u_val[m] = -X[m]; v_val[m] = -Y[m]
    m = (face_map == 3); u_val[m] = Z[m]; v_val[m] = Y[m]
    m = (face_map == 4); u_val[m] = Z[m]; v_val[m] = -X[m]
    m = (face_map == 5); u_val[m] = -Y[m]; v_val[m] = -X[m]

    mask_u_arrow = mask_center & (np.abs(v_val) < arrow_width) & (u_val > 0.02)
    img_rgb[mask_u_arrow] = [255, 0, 0]
    mask_v_arrow = mask_center & (np.abs(u_val) < arrow_width) & (v_val > 0.02)
    img_rgb[mask_v_arrow] = [0, 255, 0]
    
    # Add Explicit U/V Labels at center
    # U is Red (+u_dir), V is Green (+v_dir)
    # We can just stamp "U" and "V" at slight offset
    # But wait, we don't have explicit vectors here easily in the loop, we used mask.
    # We can rely on Face 0 logic for simplicity or loop again.
    # Actually, we can just use the stamp_text_3d function since we have geometry.
    # Where is (0,0)? it's the center.
    # We want "U" at (u=0.1, v=0) and "V" at (u=0, v=0.1).
    # We can iterate faces again or just do it inside the main drawing loop.
    # Let's add it to the main drawing block if possible, or just hack it here.
    # Stamping text requires u_dir, v_dir vectors.
    # Let's add a quick helper loop for center U/V labels.
    center_uv_labels = [
        (0, [0,1,0], [0,0,1]), (1, [-1,0,0], [0,0,1]), (2, [-1,0,0], [0,-1,0]),
        (3, [0,0,1], [0,1,0]), (4, [0,0,1], [-1,0,0]), (5, [0,-1,0], [-1,0,0])
    ]
    centers_xyz = [[1,0,0], [0,1,0], [0,0,1], [-1,0,0], [0,-1,0], [0,0,-1]]
    
    for f_idx, u_vec, v_vec in center_uv_labels:
        c_pos = np.array(centers_xyz[f_idx])
        u_stop = c_pos + np.array(u_vec) * 0.15
        v_stop = c_pos + np.array(v_vec) * 0.15
        
        stamp_text_3d(img_rgb, X, Y, Z, "U", u_stop, v_vec, u_vec, font, pixel_scale)
        stamp_text_3d(img_rgb, X, Y, Z, "V", v_stop, v_vec, u_vec, font, pixel_scale)

    # --- 6. LABELS ---
    print("   [Progress] Drawing Labels...", flush=True)
    # Fonts loaded at start

    pixel_scale = (2.0 * np.pi) / width
    def draw_outlined(d, x, y, t, f=font):
        for o in [-2, 2]:
            for p in [-2, 2]:
                d.text((x+o, y+p), t, font=f, fill=(0,0,0), anchor="mm")
        d.text((x, y), t, font=f, fill=(255,255,255), anchor="mm")

    img = Image.fromarray(img_rgb)
    draw = ImageDraw.Draw(img)
    labels_2d = [(0,"FACE 0 (+X)",0,0), (1,"FACE 1 (+Y)",90,0), (3,"FACE 3 (-X)",180,0), (4,"FACE 4 (-Y)",-90,0)]
    for _, txt, ln, lt in labels_2d:
        y = int((90 - lt) / 180 * height)
        if abs(ln) == 180:
            draw_outlined(draw, 0, y, txt)
            draw_outlined(draw, width, y, txt)
        else:
            x = int((ln + 180) / 360 * width) % width
            draw_outlined(draw, x, y, txt)
    img_rgb = np.array(img)

    stamp_text_3d(img_rgb, X, Y, Z, "FACE 2 (+Z)\nNorth Pole", [0,0,1], [0,1,0], [1,0,0], font, pixel_scale)
    stamp_text_3d(img_rgb, X, Y, Z, "FACE 5 (-Z)\nSouth Pole", [0,0,-1], [0,1,0], [-1,0,0], font, pixel_scale)
    
    # Old axis info labels removed as requested


    # --- 8. TOPOLOGY LABELS & STRIPS ---
    print("   [Progress] Drawing Topology Labels and Strips...", flush=True)
    prober = AdjacencyProber()
    
    # Helper to generate gradient strip
    def make_grad_strip(seed_val, w=200, h=40):
        # Deterministic random based on seed
        np.random.seed(seed_val)
        arr = np.zeros((h, w, 4), dtype=np.uint8)
        
        c1 = np.random.randint(0, 255, 3)
        c2 = np.random.randint(0, 255, 3)
        
        # Linear gradient
        for i in range(w):
            t = i / float(w)
            c = (c1 * (1-t) + c2 * t).astype(np.uint8)
            arr[:, i, :3] = c
            
        arr[:, :, 3] = 255 # Full opacity
        # Add a black diagonal line
        for i in range(min(w, h)):
            arr[i, i] = [0,0,0,255]
            arr[h-1-i, i] = [0,0,0,255]
            
        return Image.fromarray(arr)

    # Loop all faces and sides
    for face in range(6):
        for side in range(4):
            # 1. Probe Neighbor
            n_face, n_side = prober.probe(face, side)
            
            # 2. Edge Identification (Canonical ID)
            f1, f2 = min(face, n_face), max(face, n_face)
            edge_seed = f1 * 100 + f2
            
            # 3. Generate Strip (Rotated 30 deg to cross border)
            # expand=True changes size, which is good so we don't clip
            strip_img = make_grad_strip(edge_seed).rotate(30, expand=True)
            
            # 4. Calculate Position (Edge Center)
            uc, vc = 0.0, 0.0
            if side == 0: vc = 1.0  # Top
            if side == 1: uc = 1.0  # Right
            if side == 2: vc = -1.0 # Bottom
            if side == 3: uc = -1.0 # Left
            
            xyz_edge = prober.get_xyz(face, uc, vc)
            xyz_edge = xyz_edge / np.linalg.norm(xyz_edge)
            
            # 5. Orientation vectors for stamping
            p_center = prober.get_xyz(face, 0, 0)
            p_center = p_center / np.linalg.norm(p_center)
            
            vec_to_center = (p_center - xyz_edge)
            vec_to_center = vec_to_center - np.dot(vec_to_center, xyz_edge) * xyz_edge 
            vec_to_center = vec_to_center / np.linalg.norm(vec_to_center)
            
            lbl_up = vec_to_center
            lbl_right = np.cross(vec_to_center, xyz_edge) 
            
            # 6. Stamp Strip
            stamp_rgba_3d(img_rgb, X, Y, Z, strip_img, xyz_edge, lbl_up, lbl_right, pixel_scale * 1.5)
            
            # 7. Stamp Label
            # "Side(Face) -> NSide(NFace)"
            side_names = ["V+", "U+", "V-", "U-"]
            lbl_text = f"{side_names[side]}({face})->{side_names[n_side]}({n_face})"
            
            # Generate Label Image (Smaller Font)
            lbl_font = font_small
            dummy = ImageDraw.Draw(Image.new('RGB', (1,1)))
            bb = dummy.textbbox((0,0), lbl_text, font=lbl_font)
            lw, lh = bb[2]-bb[0], bb[3]-bb[1]
            txt_img = Image.new('RGBA', (lw+10, lh+10), (0,0,0,150)) 
            d = ImageDraw.Draw(txt_img)
            d.text((5,5), lbl_text, font=lbl_font, fill=(255,255,255))
            
            # Position: Shift INWARDS (0.12) to ensure it stays in face, and keep Right shift
            xyz_label = xyz_edge + vec_to_center * 0.12 + lbl_right * 0.5
            xyz_label = xyz_label / np.linalg.norm(xyz_label)
            
            stamp_rgba_3d(img_rgb, X, Y, Z, txt_img, xyz_label, lbl_up, lbl_right, pixel_scale * 0.5)

    # --- 7. SAVE ---
    print(f"   [Progress] Saving to {filename}...", flush=True)
    
    # Construct CRS with Radii if present (Manual WKT to avoid osgeo dep)
    custom_crs = 'EPSG:4326' # Default
    if rx and ry and rz:
        print(f"Constructing custom SRS with Radii: {rx}, {ry}, {rz}")
        
        # Determine flattening (f)
        # f = (a - b) / a
        # inv_f = 1 / f
        if abs(rx - rz) < 0.001:
            # Sphere
            inv_f_str = "0"
            spheroid_name = "Custom Sphere"
        else:
            # Ellipsoid
            inv_f = rx / (rx - rz)
            inv_f_str = f"{inv_f:.9f}"
            spheroid_name = "Custom Ellipsoid"

        # Construct WKT 1 string
        custom_crs = (
            f'GEOGCS["Custom Body",'
            f'  DATUM["Custom Datum",'
            f'    SPHEROID["{spheroid_name}",{rx},{inv_f_str}],'
            f'    TOWGS84[0,0,0,0,0,0,0]],'
            f'  PRIMEM["Greenwich",0,'
            f'    AUTHORITY["EPSG","8901"]],'
            f'  UNIT["degree",0.0174532925199433,'
            f'    AUTHORITY["EPSG","9122"]],'
            f'  AXIS["Latitude",NORTH],'
            f'  AXIS["Longitude",EAST]]'
        )

    with rasterio.open(filename, 'w', driver='GTiff', height=height, width=width, count=3, dtype=img_rgb.dtype,
                       crs=custom_crs, transform=from_origin(-180.0, 90.0, 360.0/width, 180.0/height), compress='lzw') as dst:
        dst.write(np.moveaxis(img_rgb, -1, 0))
    print(f"SUCCESS: Created {filename}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--rx", type=float, help="Radius X (Meters)")
    parser.add_argument("--ry", type=float, help="Radius Y (Meters)")
    parser.add_argument("--rz", type=float, help="Radius Z (Meters)")
    parser.add_argument("--width", type=int, default=TEXTURE_WIDTH, help="Texture Width (pixels)")
    args = parser.parse_args()
    
    generate_geotiff_debug(args.width, OUTPUT_FILENAME, args.rx, args.ry, args.rz)
