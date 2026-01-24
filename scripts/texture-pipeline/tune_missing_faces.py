from PIL import Image, ImageDraw

FACE_SIZE = 512
PADDING = 64

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
    # Colors
    bg = (0,0,0)
    if f==2: bg=(0,0,60) # Blue (North)
    if f==3: bg=(60,60,0) # Yellow
    if f==4: bg=(0,60,60) # Cyan
    if f==5: bg=(60,0,60) # Magenta (South)
    
    img = Image.new('RGB', (FACE_SIZE, FACE_SIZE), bg)
    d = ImageDraw.Draw(img)
    
    # Grid
    step = 64
    for i in range(0, FACE_SIZE, step):
        d.line([(i,0), (i,FACE_SIZE)], fill=(128,128,128), width=2)
        d.line([(0,i), (FACE_SIZE,i)], fill=(128,128,128), width=2)
        
    # Borders (4px)
    w, h = FACE_SIZE, FACE_SIZE
    for x in range(w):
        val = int((x/w)*255)
        # Top (Red)
        d.rectangle([x,0, x+1, 4], fill=(val,0,0))
        # Bot (Blue)
        d.rectangle([x,h-4, x+1, h], fill=(0,0,val))
    for y in range(h):
        val = int((y/h)*255)
        # Right (Green)
        d.rectangle([w-4,y, w, y+1], fill=(0,val,0))
        # Left (Yellow)
        d.rectangle([0,y, 4, y+1], fill=(val,val,0))
        
    d.text((FACE_SIZE//2-10, FACE_SIZE//2-10), f"F{f}", fill=(255,255,255))
    return img

f2 = generate_face(2)
f3 = generate_face(3)
f4 = generate_face(4)
f5 = generate_face(5)

# --- F3 TOP Tuning (vs F2 East/Right) ---
# F2 Right is Green Edge.
strip_src_f2e = f2.crop((FACE_SIZE-PADDING, 0, FACE_SIZE, FACE_SIZE))

# Variations (Full Set)
f3t_vars = [
    ("F3T_Rot90", 90, False, False),
    ("F3T_Rot90_FH", 90, True, False),
    ("F3T_Rot270", 270, False, False),
    ("F3T_Rot270_FH", 270, True, False)
]
for name, rot, fh, fv in f3t_vars:
    p = copy_rotated_cpp(strip_src_f2e, rot, fh, fv)
    c = Image.new('RGB', (FACE_SIZE, FACE_SIZE+PADDING))
    c.paste(f3, (0, PADDING)); c.paste(p, (0,0))
    c.save(f"tune_miss_{name}.png")

# --- F4 BOTTOM Tuning (vs F5 West/Left) ---
# F5 Left is Yellow Edge.
strip_src_f5w = f5.crop((0, 0, PADDING, FACE_SIZE))

f4b_vars = [
    ("F4B_Rot90", 90, False, False),
    ("F4B_Rot90_FH", 90, True, False),
    ("F4B_Rot270", 270, False, False),
    ("F4B_Rot270_FH", 270, True, False)
]
for name, rot, fh, fv in f4b_vars:
    p = copy_rotated_cpp(strip_src_f5w, rot, fh, fv)
    c = Image.new('RGB', (FACE_SIZE, FACE_SIZE+PADDING))
    c.paste(f4, (0, 0)); c.paste(p, (0,FACE_SIZE))
    c.save(f"tune_miss_{name}.png")
