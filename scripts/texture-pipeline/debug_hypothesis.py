from PIL import Image, ImageDraw, ImageFont
import math
import os

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

# Generate Synthetic Face 2 (North Pole)
# Face 2: Blue Border.
# Grid Lines: Concentric Circles (Lat) or Grid?
# Let's assume the user has a Grid.
# Logic: F2 is Top. F0 is Front.
# F2 S should match F0 N.
def generate_face(f):
    img = Image.new('RGB', (FACE_SIZE, FACE_SIZE), (0,0,0))
    d = ImageDraw.Draw(img)
    
    # Background
    c = (0,0,0)
    if f==0: c = (50,0,0) # Dark Red
    if f==2: c = (0,0,50) # Dark Blue
    d.rectangle([0,0,FACE_SIZE,FACE_SIZE], fill=c)
    
    # Grid Lines (Grey)
    step = 64
    for i in range(0, FACE_SIZE, step):
        d.line([(i,0), (i,FACE_SIZE)], fill=(128,128,128), width=2)
        d.line([(0,i), (FACE_SIZE,i)], fill=(128,128,128), width=2)
        
    # Borders
    w, h = FACE_SIZE, FACE_SIZE
    # N(Top)=Red, E(Right)=Green, S(Bot)=Blue, W(Left)=Yellow
    # Gradient Logic
    for x in range(w):
        val = int((x/w)*255)
        # Top (Red)
        img.putpixel((x,0), (val,0,0))
        img.putpixel((x,1), (val,0,0))
        img.putpixel((x,2), (val,0,0))
        img.putpixel((x,3), (val,0,0)) # 4px
        
        # Bottom (Blue)
        img.putpixel((x,h-1), (0,0,val))
        img.putpixel((x,h-2), (0,0,val))
        img.putpixel((x,h-3), (0,0,val))
        img.putpixel((x,h-4), (0,0,val))
        
    for y in range(h):
        val = int((y/h)*255)
        # Right (Green)
        img.putpixel((w-1,y), (0,val,0))
        img.putpixel((w-2,y), (0,val,0))
        img.putpixel((w-3,y), (0,val,0))
        img.putpixel((w-4,y), (0,val,0))
        
        # Left (Yellow)
        img.putpixel((0,y), (val,val,0))
        img.putpixel((1,y), (val,val,0))
        img.putpixel((2,y), (val,val,0))
        img.putpixel((3,y), (val,val,0))
    
    # Face Label
    d.text((FACE_SIZE//2, FACE_SIZE//2), f"F{f}", fill=(255,255,255))
    
    return img

f0 = generate_face(0)
f2 = generate_face(2)

# Create Variations for F0 Top Padding (from F2)
# We want to fill the Top 64px of F0 Padded.
var_configs = [
    # (Name, F2_Edge, Rot, FlipV)
    ("A_Standard", "S", 0, False), # F2 South (Bottom) -> F0 North (Top)
    ("B_S2_Default", "W", 270, False), # F2 West (Left) -> F0 North
    ("C_S2_Flip", "W", 270, True),  # F2 West + Flip
    ("D_Rot90", "E", 90, False)     # F2 East -> F0 North
]

for name, edge, rot, flip_v in var_configs:
    # Extract Strip from F2
    strip = None
    if edge == "S": # Bottom P rows
        strip = f2.crop((0, FACE_SIZE-PADDING, FACE_SIZE, FACE_SIZE))
    elif edge == "W": # Left P cols
        strip = f2.crop((0, 0, PADDING, FACE_SIZE))
    elif edge == "E": # Right P cols
        strip = f2.crop((FACE_SIZE-PADDING, 0, FACE_SIZE, FACE_SIZE))
    elif edge == "N": 
        strip = f2.crop((0, 0, FACE_SIZE, PADDING))
        
    # Rotate
    processed = copy_rotated_cpp(strip, rot, False, flip_v)
    
    # Create Composite
    comp = Image.new('RGB', (FACE_SIZE, FACE_SIZE + PADDING))
    # Paste F0
    comp.paste(f0, (0, PADDING))
    # Paste Strip at Top
    comp.paste(processed, (0, 0))
    
    comp.save(f"debug_variant_{name}.png")
    print(f"Saved debug_variant_{name}.png")
