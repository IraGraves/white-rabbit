from PIL import Image, ImageDraw, ImageFont
import math

FACE_SIZE = 512
PADDING = 64

# C++ Rotation Emulation
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

# Face 0 Generator (Red Base)
# Focus: Top Edge (y=0).
# We draw Vertical Lines (x=constant) that hit the top edge.
# We label them "1", "2", "3" from Left to Right.
def generate_f0():
    img = Image.new('RGB', (FACE_SIZE, FACE_SIZE), (40, 0, 0)) # Dark Red
    d = ImageDraw.Draw(img)
    
    # Draw Vertical Lines
    # x = 100: Green
    # x = 200: Blue
    # x = 300: Yellow
    # x = 400: Cyan
    colors = [(0,255,0), (0,0,255), (255,255,0), (0,255,255)]
    positions = [100, 200, 300, 400]
    
    for x, c in zip(positions, colors):
        d.line([(x, 0), (x, FACE_SIZE)], fill=c, width=5)
        d.text((x+5, 20), f"F0_X{x}", fill=c)
        
    d.text((10,10), "F0 TOP Edge", fill=(255,255,255))
    return img

# Face 2 Generator (Blue Base)
# Focus: West Edge (x=0).
# If correct, F0 Vertical Lines should continue into F2.
# But F2 is rotated. 
# If F0 Top connects to F2 West:
#   F0 Verticals (x) -> F2 Horizontals? Or F2 Verticals?
#   Let's draw BOTH on F2 to see which ones align.
#   Horizontal Lines (y=100, 200...): Dashed or distinct color.
#   Vertical Lines (x=100, 200...): Solid.
def generate_f2():
    img = Image.new('RGB', (FACE_SIZE, FACE_SIZE), (0, 0, 40)) # Dark Blue
    d = ImageDraw.Draw(img)
    
    # Draw Horizontal Lines (y=constant)
    # These would hit the West Edge (x=0).
    # y = 100: Green
    # y = 200: Blue
    positions = [100, 200, 300, 400]
    colors = [(0,255,0), (0,0,255), (255,255,0), (0,255,255)]
    
    for y, c in zip(positions, colors):
        d.line([(0, y), (FACE_SIZE, y)], fill=c, width=5)
        d.text((10, y+5), f"F2_Y{y}", fill=c)

    d.text((10,10), "F2 West Edge (Left)", fill=(255,255,255))
    return img

f0 = generate_f0()
f2 = generate_f2()

# Generate Variations of F0 Top Padding (sourced from F2 West)
# West Edge is (0,0) to (PADDING, FACE_SIZE)
strip_src = f2.crop((0, 0, PADDING, FACE_SIZE)) # P x H

variations = [
    ("1_Rot270", 270, False, False),       # Standard Hypothesis
    ("2_Rot270_FlipV", 270, False, True),  # Flip V Hypothesis
    ("3_Rot270_FlipH", 270, True, False),  # Flip H (Maybe?)
    ("4_Rot90", 90, False, False),         # Opposite Rotation
    ("5_Rot90_FlipV", 90, False, True),
]

for name, rot, fh, fv in variations:
    padded_strip = copy_rotated_cpp(strip_src, rot, fh, fv)
    
    # Composite: F0 with Padded Strip on Top
    comp = Image.new('RGB', (FACE_SIZE, FACE_SIZE + PADDING))
    comp.paste(f0, (0, PADDING))
    comp.paste(padded_strip, (0, 0))
    
    comp.save(f"debug_detailed_{name}.png")
    print(f"Saved debug_detailed_{name}.png")
