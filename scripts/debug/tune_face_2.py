from PIL import Image, ImageDraw, ImageFont

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
    # F0=Red, F1=Green, F2=Blue, F3=Yellow, F4=Cyan, F5=Magenta
    bg = (0,0,0)
    if f==2: bg=(0,0,60) # Blue
    if f==3: bg=(60,60,0) # Yellow
    if f==4: bg=(0,60,60) # Cyan
    
    img = Image.new('RGB', (FACE_SIZE, FACE_SIZE), bg)
    d = ImageDraw.Draw(img)
    
    # Grid
    step = 64
    for i in range(0, FACE_SIZE, step):
        d.line([(i,0), (i,FACE_SIZE)], fill=(128,128,128), width=2)
        d.line([(0,i), (FACE_SIZE,i)], fill=(128,128,128), width=2)
        
    # Borders
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
f4 = generate_face(4) # Top Neighbor
f3 = generate_face(3) # Right Neighbor

# TOP Edge Tuning (F2 Top <- F4 ?)
# F2 Top connects to F4 Top (Edge 0) in Standard S2.
# F4 Top is Wx1.
strip_src_top = f4.crop((0, 0, FACE_SIZE, PADDING))

top_variations = [
    ("T_Rot180", 180, False, False), # Current Guess
    ("T_Rot0", 0, False, False),
    ("T_Rot180_FlipH", 180, True, False),
    ("T_Rot0_FlipH", 0, True, False),
]

for name, rot, fh, fv in top_variations:
    padded = copy_rotated_cpp(strip_src_top, rot, fh, fv)
    comp = Image.new('RGB', (FACE_SIZE, FACE_SIZE + PADDING))
    comp.paste(f2, (0, PADDING))
    comp.paste(padded, (0, 0))
    comp.save(f"tune_f2_{name}.png")
    print(f"Saved tune_f2_{name}.png")
    
# RIGHT Edge Tuning (F2 Right <- F3 ?)
# F2 Right connects to F3 Top (Edge 0) in Standard S2.
# F3 Top is Wx1.
strip_src_right = f3.crop((0, 0, FACE_SIZE, PADDING))

# Destination is Vertical (PxH). Source is Horizontal (WxP).
# Need 90 or 270.
right_variations = [
    ("R_Rot270", 270, False, False), # Current Guess
    ("R_Rot90", 90, False, False),
    ("R_Rot270_FlipV", 270, False, True),
    ("R_Rot90_FlipV", 90, False, True),
]

for name, rot, fh, fv in right_variations:
    padded = copy_rotated_cpp(strip_src_right, rot, fh, fv)
    comp = Image.new('RGB', (FACE_SIZE + PADDING, FACE_SIZE))
    comp.paste(f2, (0, 0))
    comp.paste(padded, (FACE_SIZE, 0))
    comp.save(f"tune_f2_{name}.png")
    print(f"Saved tune_f2_{name}.png")
