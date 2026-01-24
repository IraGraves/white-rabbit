import numpy as np
from PIL import Image, ImageDraw
import math

# ==========================================
# 1. S2 Geometry Implementation (Ground Truth)
# ==========================================

def s2_st_to_uv(s):
    if s >= 0.5: return (1.0 / 3.0) * (4.0 * s * s - 1.0)
    return (1.0 / 3.0) * (1.0 - 4.0 * (1.0 - s) * (1.0 - s))

def face_uv_to_xyz(face, u, v):
    # u, v are ST coordinates (0..1) here for this function sig? 
    # The C++ code calls s2_st_to_uv internally. 
    # Let's match C++: input u,v are ST.
    
    su = s2_st_to_uv(u)
    sv = s2_st_to_uv(v)
    
    x, y, z = 0, 0, 0
    if face == 0: x=1; y=su; z=sv      # +X
    elif face == 1: x=-su; y=1; z=sv   # +Y
    elif face == 2: x=-su; y=-sv; z=1  # +Z (North)
    elif face == 3: x=-1; y=-sv; z=-su # -X
    elif face == 4: x=sv; y=-1; z=-su  # -Y
    elif face == 5: x=sv; y=su; z=-1   # -Z (South)
    
    # Normalize
    r = math.sqrt(x*x + y*y + z*z)
    return (x/r, y/r, z/r)

def xyz_to_latlon(p):
    x, y, z = p
    lon = math.atan2(y, x) * 180.0 / math.pi
    lat = math.asin(max(-1, min(1, z))) * 180.0 / math.pi
    return lat, lon

# ==========================================
# 2. Source Image Generator
# ==========================================
# Create a global map with a GRID and ARROWS to show orientation clearly.
W, H = 2048, 1024
src_img = Image.new('RGB', (W, H), (0,0,0))
draw = ImageDraw.Draw(src_img)

# Draw Grid
for x in range(0, W, 128):
    draw.line([(x,0), (x,H)], fill=(50,50,50))
for y in range(0, H, 128):
    draw.line([(0,y), (W,y)], fill=(50,50,50))
    
# Draw Large text/colors for Faces Regions (Approx)
# Face 0 is at Lon 0, Lat 0.
# Face 1 is at Lon 90.
# Face 2 is North Pole.
# Face 3 is Lon 180.
# Face 4 is Lon -90.
# Face 5 is South Pole.

# We will sample the S2 faces from this map.

# ==========================================
# 3. Generate 6 Faces
# ==========================================
FACE_SIZE = 256
faces = []

src_pixels = src_img.load()

print("Generating 6 Faces...")
for f in range(6):
    face_img = Image.new('RGB', (FACE_SIZE, FACE_SIZE))
    pixels = face_img.load()
    
    # Fill with checking pattern relative to face logic
    # Also sample from global map for continuity check
    for y in range(FACE_SIZE):
        for x in range(FACE_SIZE):
            u = (x + 0.5) / FACE_SIZE
            v = (y + 0.5) / FACE_SIZE
            # Note: C++ uses v=1- ... for RasterIO (Top-Down).
            # Let's assume standard image coords: (0,0) is Top-Left.
            # Does `face_uv_to_xyz` expect (0,0) at Top-Left?
            # Usually OpenGL/Math expects (0,0) Bottom-Left.
            # But C++ Raster loop does: v = (rOff + v_rel) / Res.
            # And `v = 1.0 - ...`. So C++ loop treats Raster Y=0 as v=1.0 (Top).
            # Raster Y=H as v=0.0 (Bottom).
            
            # So here:
            v_math = 1.0 - v
            
            p = face_uv_to_xyz(f, u, v_math)
            lat, lon = xyz_to_latlon(p)
            
            # Sample Global Map
            sx = int((lon + 180) / 360 * W) % W
            sy = int((90 - lat) / 180 * H) % H # Lat 90 -> sy 0.
            
            # Write Global Color
            pixels[x,y] = src_pixels[sx, sy]
            
            # Overlay Local Face Dir Info
            # Draw distinct borders for Edge Identification
            # N (Top): Red Gradient (Dark->Bright Left->Right)
            # E (Right): Green Gradient (Dark->Bright Top->Bottom)
            # S (Bottom): Blue Gradient (Dark->Bright Left->Right)
            # W (Left): Yellow Gradient (Dark->Bright Top->Bottom)
            
            w, h = FACE_SIZE, FACE_SIZE
            if y < 10: # Top (N)
                val = int((x / w) * 255)
                pixels[x,y] = (val, 0, 0)
            elif x > w-10: # Right (E)
                val = int((y / h) * 255)
                pixels[x,y] = (0, val, 0)
            elif y > h-10: # Bottom (S)
                val = int((x / w) * 255)
                pixels[x,y] = (0, 0, val)
            elif x < 10: # Left (W)
                val = int((y / h) * 255)
                pixels[x,y] = (val, val, 0) # Yellow
                
            # Draw diagonals to detect flip
            if abs(x - y) < 2: pixels[x,y] = (255, 255, 255) # Main diag \

                
    # Draw Face ID
    d = ImageDraw.Draw(face_img)
    d.text((100, 100), f"FACE {f}", fill=(255,255,255))
    # Draw Arrow Pointing UP (Negative Y in image)
    d.line([(128, 128), (128, 50)], fill=(255,255,255), width=3)
    d.shape 
    faces.append(face_img)

# ==========================================
# 4. Simulate Padding Logic
# ==========================================

PADDING = 64
# The Table from output
# The Table from output (Correct Topology: Top=South, Bottom=North)
# F0 Top -> F5. F0 Bottom -> F2.
s2_transitions = [
    # Face 0 (+X)
    # N(Top, S) -> F5: Bottom Edge (x=1). Match F0(u) to F5(su). Direct match?
    #   F0 Top (y=u). F5 Bottom (y=su). u corresponds to su.
    #   Left->Right.
    #   F0 N <- F5 S. Rot 0?
    # E(Right, +Y) -> F1: West Edge.
    #   F0 E (u=1, su=1). x=1? No. F0 E is u=1 -> su=1 -> y=1.
    #   F1 W (u=0, su=-1). x=1. Matches.
    #   F0 E <- F1 W. Rot 0.
    # S(Bottom, N) -> F2: West Edge (x=1). 
    #   F0 S (z=1). y=u.
    #   F2 W (z=1). x=1. y=-sv.
    #   u (-1..1) matches -sv (1..-1). Reversed.
    #   F0 S <- F2 W. We need Rot to map Vert->Horiz.
    #   F2 W Top (y=1) -> F0 Right (y=1).
    #   F2 W Bottom (y=-1) -> F0 Left (y=-1).
    #   Strip: Top->Bottom (y=1 -> -1). Dest: Right->Left (y=1 -> -1).
    #   We want F2W(0,0)[Top] -> F0S(W,0)[Right].
    #   Rot 90 (CCW): (0,0) -> (0,W). (Bottom Left).
    #   Rot 270 (CCW): (0,0) -> (H,0). (Top Right). YES.
    #   Flip V: (H,0) -> (0,0). No.
    #   Rot 270 alone: Top->Right?
    #   Let's try Rot 270.
    # W(Left, -Y) -> F4: East Edge.
    #   F0 W (y=-1). 
    #   F4 E (y=-1). Matches.
    #   F0 W <- F4 E. Rot 0.
    [ [5, 2, False, False, 0], [1, 3, False, False, 0], [2, 3, False, False, 270], [4, 1, False, False, 0] ],
    
    # Face 1 (+Y)
    # N(Top, S) -> F5: Right Edge (y=1).
    #   F1 N (z=-1). x=-su.
    #   F5 R (y=1). x=sv.
    #   -su (-1..1) -> 1..-1.
    #   sv (1..-1) -> 1..-1.
    #   Match: -su = sv.
    #   su(-1) [Left] -> sv(1) [Top].
    #   su(1) [Right] -> sv(-1) [Bottom].
    #   Need F5R(Top) -> F1N(Left).
    #   F5R (Vert) -> F1N (Horiz).
    #   Top -> Left. Bottom -> Right.
    #   Rot 270 (Top -> Right). Swap?
    #   Rot 90 (Top -> Left? No, Top -> Bottom).
    #   Let's try Rot 270 + Flip.
    #   Actually, let's guess Rot 270 first.
    # E -> F3 W? (Face 1 Right is +X?? No, Face 1 is +Y).
    #   F1 Right (x=-1). Face 3 (-X).
    #   F3 Left (y=-1). x=1?? No.
    #   F3 (x=-1). Left (u=0, su=-1) -> y=1.
    #   F1 Right (su=1 -> x=-1). Matches.
    #   F1 E <- F3 W. Rot 0. (Wait, F1 Right is u=1. F3 Left is u=0).
    #   Orientation?
    #   F1 E (z goes Top(-1) -> Bot(1)).
    #   F3 W (z goes Top(-1) -> Bot(1)).
    #   Aligned. Rot 0.
    # S(Bottom, N) -> F2: Top Edge (y=1).
    [ [2, 2, False, False, 0], [3, 3, False, False, 0], [5, 1, False, False, 270], [0, 1, False, False, 0] ],
    # Face 2 (+Z, North Pole)
    [ [4, 0, False, False, 180], [3, 0, False, False, 270], [1, 0, False, False, 0], [0, 0, False, False, 90] ],
    # Face 3 (-X)
    [ [2, 1, False, False, 90], [4, 3, False, False, 0], [5, 2, False, False, 180], [1, 1, False, False, 0] ],
    # Face 4 (-Y)
    [ [2, 0, False, False, 180], [0, 3, False, False, 0], [5, 3, False, False, 90], [3, 1, False, False, 0] ],
    # Face 5 (-Z, South Pole)
    [ [0, 2, False, False, 0], [1, 2, False, False, 90], [3, 2, False, False, 180], [4, 2, False, False, 270] ]
]

def copy_rotated_cpp(src_img, rot, flip_h, flip_v):
    # Match C++ logic exactly
    # Src: W x H (P x H or W x P usually)
    # Dst: Should be derived. 
    # But here we return a new image.
    src_w, src_h = src_img.size
    src_pixels = src_img.load()
    
    # Determine Dst Size
    dst_w, dst_h = src_w, src_h
    if rot == 90 or rot == 270:
        dst_w, dst_h = src_h, src_w
        
    dst_img = Image.new('RGB', (dst_w, dst_h))
    dst_pixels = dst_img.load()
    
    # Logic from s2_preprocessor.cpp
    for dy in range(dst_h):
        for dx in range(dst_w):
            tsx, tsy = 0, 0
            
            # Reverse Rotation
            if rot == 0:
                tsx = dx
                tsy = dy
            elif rot == 90:
                # C++: tsx = dy; tsy = dstW - 1 - dx;
                tsx = dy
                tsy = dst_w - 1 - dx
            elif rot == 180:
                # C++: tsx = dstW - 1 - dx; tsy = dstH - 1 - dy;
                tsx = dst_w - 1 - dx
                tsy = dst_h - 1 - dy
            elif rot == 270:
                # C++: tsx = dstH - 1 - dy; tsy = dx;
                tsx = dst_h - 1 - dy
                tsy = dx
                
            # Apply Flips (Source Space)
            if flip_h: tsx = src_w - 1 - tsx
            if flip_v: tsy = src_h - 1 - tsy
            
            # Clamp
            tsx = max(0, min(src_w - 1, tsx))
            tsy = max(0, min(src_h - 1, tsy))
            
            dst_pixels[dx, dy] = src_pixels[tsx, tsy]
            
    return dst_img

def rotate_strip(strip_img, rot):
    # Redirect to C++ logic (flip_h/v currently False in table)
    # Note: s2_transitions table has flip field.
    # The caller needs to pass it.
    # For now, assume table says False.
    return copy_rotated_cpp(strip_img, rot, False, False)

# Generate Padded Views
for f in range(6):
    # Canvas: (FS + 2P, FS + 2P)
    padded = Image.new('RGB', (FACE_SIZE + 2*PADDING, FACE_SIZE + 2*PADDING), (50,50,50))
    
    # Paste Center
    padded.paste(faces[f], (PADDING, PADDING))
    
    trans = s2_transitions[f]
    
    # N Edge (Index 0) -> Placed at Top (x=P, y=0)
    # Strip Size: W x P
    neighbor = trans[0][0]
    n_edge = trans[0][1]
    rot = trans[0][4]
    
    # Extract Strip from Neighbor
    # N Edge of N: Top P rows.
    # E Edge of N: Right P cols.
    # S Edge of N: Bottom P rows.
    # W Edge of N: Left P cols.
    
    n_img = faces[neighbor]
    strip = None
    if n_edge == 0: strip = n_img.crop((0, 0, FACE_SIZE, PADDING))
    elif n_edge == 1: strip = n_img.crop((FACE_SIZE-PADDING, 0, FACE_SIZE, FACE_SIZE))
    elif n_edge == 2: strip = n_img.crop((0, FACE_SIZE-PADDING, FACE_SIZE, FACE_SIZE))
    elif n_edge == 3: strip = n_img.crop((0, 0, PADDING, FACE_SIZE))
    
    # Rotate
    strip_rot = rotate_strip(strip, rot)
    
    # Paste Top
    padded.paste(strip_rot, (PADDING, 0))
    
    # S Edge (Index 2) -> Placed Bottom
    neighbor = trans[2][0]
    n_edge = trans[2][1]
    rot = trans[2][4]
    n_img = faces[neighbor]
    if n_edge == 0: strip = n_img.crop((0, 0, FACE_SIZE, PADDING))
    elif n_edge == 1: strip = n_img.crop((FACE_SIZE-PADDING, 0, FACE_SIZE, FACE_SIZE))
    elif n_edge == 2: strip = n_img.crop((0, FACE_SIZE-PADDING, FACE_SIZE, FACE_SIZE))
    elif n_edge == 3: strip = n_img.crop((0, 0, PADDING, FACE_SIZE))
    strip_rot = rotate_strip(strip, rot)
    padded.paste(strip_rot, (PADDING, FACE_SIZE+PADDING))
    
    # W Edge (Index 3) -> Placed Left
    neighbor = trans[3][0]
    n_edge = trans[3][1]
    rot = trans[3][4]
    n_img = faces[neighbor]
    if n_edge == 0: strip = n_img.crop((0, 0, FACE_SIZE, PADDING))
    elif n_edge == 1: strip = n_img.crop((FACE_SIZE-PADDING, 0, FACE_SIZE, FACE_SIZE))
    elif n_edge == 2: strip = n_img.crop((0, FACE_SIZE-PADDING, FACE_SIZE, FACE_SIZE))
    elif n_edge == 3: strip = n_img.crop((0, 0, PADDING, FACE_SIZE))
    strip_rot = rotate_strip(strip, rot)
    padded.paste(strip_rot, (0, PADDING))

    # E Edge (Index 1) -> Placed Right
    neighbor = trans[1][0]
    n_edge = trans[1][1]
    rot = trans[1][4]
    n_img = faces[neighbor]
    if n_edge == 0: strip = n_img.crop((0, 0, FACE_SIZE, PADDING))
    elif n_edge == 1: strip = n_img.crop((FACE_SIZE-PADDING, 0, FACE_SIZE, FACE_SIZE))
    elif n_edge == 2: strip = n_img.crop((0, FACE_SIZE-PADDING, FACE_SIZE, FACE_SIZE))
    elif n_edge == 3: strip = n_img.crop((0, 0, PADDING, FACE_SIZE))
    strip_rot = rotate_strip(strip, rot)
    padded.paste(strip_rot, (FACE_SIZE+PADDING, PADDING))

    out_name = f"debug_face_{f}_step_by_step.png"
    padded.save(out_name)
    print(f"Saved {out_name}")
