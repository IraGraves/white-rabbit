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
    bg_color = (0,0,0)
    if f==0: bg_color=(50,0,0) # Red
    if f==4: bg_color=(0,50,50) # Cyan/Teal
    if f==5: bg_color=(50,0,50) # Magenta/Purple
    
    img = Image.new('RGB', (FACE_SIZE, FACE_SIZE), bg_color)
    d = ImageDraw.Draw(img)
    
    # Draw Grid
    step = 64
    for i in range(0, FACE_SIZE, step):
        d.line([(i,0), (i,FACE_SIZE)], fill=(128,128,128), width=2)
        d.line([(0,i), (FACE_SIZE,i)], fill=(128,128,128), width=2)

    # Draw Colored Borders
    w, h = FACE_SIZE, FACE_SIZE
    # N(Top)=Red, E(Right)=Green, S(Bot)=Blue, W(Left)=Yellow
    for x in range(w):
        val = int((x/w)*255)
        # Top (Red)
        d.point((x,0), fill=(val,0,0))
        d.point((x,1), fill=(val,0,0))
        d.point((x,2), fill=(val,0,0))
        d.point((x,3), fill=(val,0,0))
        # Bot (Blue)
        d.point((x,h-1), fill=(0,0,val))
        d.point((x,h-2), fill=(0,0,val))
        d.point((x,h-3), fill=(0,0,val))
        d.point((x,h-4), fill=(0,0,val))
        
    for y in range(h):
        val = int((y/h)*255)
        # Right (Green)
        d.point((w-1,y), fill=(0,val,0))
        d.point((w-2,y), fill=(0,val,0))
        d.point((w-3,y), fill=(0,val,0))
        d.point((w-4,y), fill=(0,val,0))
        # Left (Yellow)
        d.point((0,y), fill=(val,val,0))
        d.point((1,y), fill=(val,val,0))
        d.point((2,y), fill=(val,val,0))
        d.point((3,y), fill=(val,val,0))
        
    # Fiducials: "F{f}" at Center
    d.text((FACE_SIZE//2-20, FACE_SIZE//2-10), f"F{f}", fill=(255,255,255))
    
    # Fiducials: Arrow Pointing Up (North)
    d.line([(FACE_SIZE//2, FACE_SIZE//2), (FACE_SIZE//2, 50)], fill=(255,255,255), width=2)
    d.polygon([(FACE_SIZE//2, 50), (FACE_SIZE//2-10, 70), (FACE_SIZE//2+10, 70)], fill=(255,255,255))
    
    return img

f0 = generate_face(0)
f4 = generate_face(4) # Neighbor to West
f5 = generate_face(5) # Neighbor to South

# SOUTH TUNING (F0 Bot <- F5 North)
# F0 Bot is WxP. F5 North is WxP (strip).
# Variations: Rot 0, 180 (maintain Aspect Ratio WxP). 
# Rot 90/270 would fit PxH (Wrong shape for Bot Edge).
# So for Bot Edge, we only care about Rot 0 vs 180, and Flip H/V.
# Actually, Rot 0 and 180 + Flips cover all 4 orientations.
south_variations = [
    ("S_Rot0", 0, False, False),
    ("S_Rot180", 180, False, False),
    ("S_Rot0_FlipH", 0, True, False),
    ("S_Rot0_FlipV", 0, False, True),
]

strip_src_south = f5.crop((0, 0, FACE_SIZE, PADDING)) # Top of F5

for name, rot, fh, fv in south_variations:
    padded = copy_rotated_cpp(strip_src_south, rot, fh, fv)
    # Paste to Bottom of F0 canvas (expanding canvas)
    comp = Image.new('RGB', (FACE_SIZE, FACE_SIZE + PADDING))
    comp.paste(f0, (0, 0)) # F0 at top
    # Padded at bottom
    comp.paste(padded, (0, FACE_SIZE)) 
    comp.save(f"tune_f0_{name}.png")
    print(f"Saved tune_f0_{name}.png")

# WEST TUNING (F0 Left <- F4 East)
# F0 Left is PxH. F4 East is PxH (strip).
# Variations: Rot 0, 180.
west_variations = [
    ("W_Rot0", 0, False, False),
    ("W_Rot180", 180, False, False),
    ("W_Rot0_FlipH", 0, True, False),
    ("W_Rot0_FlipV", 0, False, True),
]

strip_src_west = f4.crop((FACE_SIZE-PADDING, 0, FACE_SIZE, FACE_SIZE)) # Right of F4

for name, rot, fh, fv in west_variations:
    padded = copy_rotated_cpp(strip_src_west, rot, fh, fv)
    # Paste to Left of F0 canvas
    comp = Image.new('RGB', (FACE_SIZE + PADDING, FACE_SIZE))
    comp.paste(f0, (PADDING, 0))
    # Padded at left
    comp.paste(padded, (0, 0))
    comp.save(f"tune_f0_{name}.png")
    print(f"Saved tune_f0_{name}.png")
