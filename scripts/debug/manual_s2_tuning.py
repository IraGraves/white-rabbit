from PIL import Image, ImageDraw, ImageFont

FACE_SIZE = 512
PADDING = 64

# --- CONFIGURATION TABLE ---
# Faces: 0..5
# Edges: 0=N (Top), 1=E (Right), 2=S (Bottom), 3=W (Left)
# Entry: [NeighborFace, NeighborEdge, RotCCW, FlipH, FlipV]
# NeighborEdge: 0=N, 1=E, 2=S, 3=W

# V3 State: All User Confirmations Applied.
# F0: Confirmed (N=270, others=0).
# F2: N(180+FH), E(90+FV).
# F3: N(270+FH), S(180+FH).
# F4: S(270+FH).
# F5: W(270+FH), S(180+FH).
s2_table = [
    # Face 0 (+X) [CONFIRMED]
    [ 
        [2, 3, 270, False, False], # N <- F2 W
        [1, 3, 0,   False, False], # E <- F1 W
        [5, 0, 0,   False, False], # S <- F5 N
        [4, 1, 0,   False, False]  # W <- F4 E
    ],
    # Face 1 (+Y) [STANDARD]
    [
        [2, 2, 0,   False, False], # N <- F2 S
        [3, 3, 0,   False, False], # E <- F3 W
        [5, 1, 270, False, False], # S <- F5 E
        [0, 1, 0,   False, False]  # W <- F0 E
    ],
    # Face 2 (+Z, North Pole) [CONFIRMED]
    [
        [4, 0, 180, True,  False], # N <- F4 N (Rot 180 + Flip H)
        [3, 0, 90,  False, True],  # E <- F3 N (Rot 90 + Flip V)
        [1, 0, 0,   False, False], # S <- F1 N
        [0, 0, 90,  False, False]  # W <- F0 N
    ],
    # Face 3 (-X) [CONFIRMED]
    [
        [2, 1, 270, True,  False], # N <- F2 E (Rot 270 + Flip H) [User Confirmed]
        [4, 3, 0,   False, False], # E <- F4 W
        [5, 2, 180, True,  False], # S <- F5 S (Rot 180 + Flip H) [User Confirmed]
        [1, 1, 0,   False, False]  # W <- F1 E
    ],
    # Face 4 (-Y) [CONFIRMED PARTIAL]
    [
        [2, 0, 180, True,  False], # N <- F2 N (Symmetry with F2->N)
        [0, 3, 0,   False, False], # E <- F0 W
        [5, 3, 270, True,  False], # S <- F5 W (Rot 270 + Flip H) [User Confirmed]
        [3, 1, 0,   False, False]  # W <- F3 E
    ],
    # Face 5 (-Z, South Pole) [CONFIRMED PARTIAL]
    [
        [0, 2, 0,   False, False], # N <- F0 S
        [1, 2, 90,  False, False], # E <- F1 S
        [3, 2, 180, True,  False], # S <- F3 S (Rot 180 + Flip H) [User Confirmed]
        [4, 2, 270, True,  False]  # W <- F4 S (Rot 270 + Flip H) [User Confirmed]
    ]
]

def copy_rotated_cpp(src_img, rot, flip_h, flip_v):
    src_w, src_h = src_img.size
    src_pixels = src_img.load()
    
    dst_w, dst_h = src_w, src_h
    if rot == 90 or rot == 270:
        dst_w, dst_h = src_h, src_w
        
    dst_img = Image.new('RGB', (dst_w, dst_h))
    dst_pixels = dst_img.load()
    
    for dy in range(dst_h):
        for dx in range(dst_w):
            tsx, tsy = 0, 0
            if rot == 0:
                tsx = dx; tsy = dy
            elif rot == 90:
                tsx = dy; tsy = dst_w - 1 - dx
            elif rot == 180:
                tsx = dst_w - 1 - dx; tsy = dst_h - 1 - dy
            elif rot == 270:
                tsx = dst_h - 1 - dy; tsy = dx
                
            if flip_h: tsx = src_w - 1 - tsx
            if flip_v: tsy = src_h - 1 - tsy
            
            tsx = max(0, min(src_w - 1, tsx))
            tsy = max(0, min(src_h - 1, tsy))
            dst_pixels[dx, dy] = src_pixels[tsx, tsy]
            
    return dst_img

def generate_face(f):
    # Colors: Dark backgrounds to make barcodes pop
    bg = (10,10,10)
    img = Image.new('RGB', (FACE_SIZE, FACE_SIZE), bg)
    d = ImageDraw.Draw(img)
    
    # Draw Barcodes on all 4 edges
    # Standard Sequence: Red, Green, Blue, Yellow, Cyan, Magenta
    colors = [(255,0,0), (0,255,0), (0,0,255), (255,255,0), (0,255,255), (255,0,255)]
    bar_width = 32
    
    # Function to draw stripes perpendicular to an edge
    # edge_idx: 0=Top, 1=Right, 2=Bottom, 3=Left
    def draw_barcode(edge_idx):
        for i in range(0, FACE_SIZE, bar_width):
            c_idx = (i // bar_width) % 6
            c = colors[c_idx]
            
            if edge_idx == 0: # Top Edge (Vertical Stripes)
                d.rectangle([i, 0, i+bar_width, 64], fill=c)
            elif edge_idx == 1: # Right Edge (Horizontal Stripes)
                d.rectangle([FACE_SIZE-64, i, FACE_SIZE, i+bar_width], fill=c)
            elif edge_idx == 2: # Bottom Edge (Vertical Stripes)
                # Note: To match Top of neighbor, sequence might need careful ordering.
                # Let's just draw standard Left-to-Right.
                # If flipped, colors will be reversed.
                d.rectangle([i, FACE_SIZE-64, i+bar_width, FACE_SIZE], fill=c)
            elif edge_idx == 3: # Left Edge (Horizontal Stripes)
                d.rectangle([0, i, 64, i+bar_width], fill=c)

    # Draw on all 4 sides
    for e in range(4):
        draw_barcode(e)

    # Center Label
    font_size = 80
    d.text((FACE_SIZE//2-20, FACE_SIZE//2-20), f"F{f}", fill=(255,255,255))
    
    # Small Directional Arrows in Center
    cx, cy = FACE_SIZE//2, FACE_SIZE//2
    d.line([(cx, cy), (cx, cy-50)], fill=(255,0,0), width=4) # N
    d.line([(cx, cy), (cx+50, cy)], fill=(0,255,0), width=4) # E
    
    return img

# Generate Base Faces
faces = [generate_face(i) for i in range(6)]

# Generate Composites
for f in range(6):
    # Canvas with Padding space
    # Center: FACE_SIZE x FACE_SIZE
    # Total: FACE_SIZE + 2*PADDING
    full_size = FACE_SIZE + 2*PADDING
    comp = Image.new('RGB', (full_size, full_size), (20,20,20))
    
    # Paste Center
    comp.paste(faces[f], (PADDING, PADDING))
    
    # Process 4 Edges
    # 0=N, 1=E, 2=S, 3=W
    for edge in range(4):
        n_face, n_edge_idx, rot, fh, fv = s2_table[f][edge]
        
        # Get Source Strip from Neighbor
        n_img = faces[n_face]
        strip = None
        if n_edge_idx == 0: # N (Top)
            strip = n_img.crop((0, 0, FACE_SIZE, PADDING))
        elif n_edge_idx == 1: # E (Right)
            strip = n_img.crop((FACE_SIZE-PADDING, 0, FACE_SIZE, FACE_SIZE))
        elif n_edge_idx == 2: # S (Bottom)
            strip = n_img.crop((0, FACE_SIZE-PADDING, FACE_SIZE, FACE_SIZE))
        elif n_edge_idx == 3: # W (Left)
            strip = n_img.crop((0, 0, PADDING, FACE_SIZE))
            
        # Rotate/Flip Strip
        processed = copy_rotated_cpp(strip, rot, fh, fv)
        
        # Paste Location
        if edge == 0: # Top
            comp.paste(processed, (PADDING, 0))
        elif edge == 1: # Right
            comp.paste(processed, (FACE_SIZE+PADDING, PADDING))
        elif edge == 2: # Bottom
            comp.paste(processed, (PADDING, FACE_SIZE+PADDING))
        elif edge == 3: # Left
            comp.paste(processed, (0, PADDING))
            
    # Explicitly Mask Corners to Black (to fix "random" look)
    draw = ImageDraw.Draw(comp)
    # TL, TR, BL, BR
    draw.rectangle([0,0, PADDING, PADDING], fill=(0,0,0))
    draw.rectangle([FACE_SIZE+PADDING, 0, FACE_SIZE+2*PADDING, PADDING], fill=(0,0,0))
    draw.rectangle([0, FACE_SIZE+PADDING, PADDING, FACE_SIZE+2*PADDING], fill=(0,0,0))
    draw.rectangle([FACE_SIZE+PADDING, FACE_SIZE+PADDING, FACE_SIZE+2*PADDING, FACE_SIZE+2*PADDING], fill=(0,0,0))

    comp.save(f"manual_check_face_{f}_v6.png")
    print(f"Saved manual_check_face_{f}_v6.png")
