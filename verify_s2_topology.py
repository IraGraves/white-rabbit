
import math

def s2_face_uv_to_xyz(face, u, v):
    # Official S2 ST to UV
    def s2_st_to_uv(s):
        if s >= 0.5: return (1.0/3.0) * (4.0 * s*s - 1.0)
        else: return (1.0/3.0) * (1.0 - 4.0 * (1.0-s)**2)

    su = s2_st_to_uv(u)
    sv = s2_st_to_uv(v)
    
    if face == 0:   x, y, z = ( 1.0,   su,   sv) # +X
    elif face == 1: x, y, z = (-su,   1.0,   sv) # +Y
    elif face == 2: x, y, z = (-su,  -sv,   1.0) # +Z
    elif face == 3: x, y, z = (-1.0, -sv,  -su) # -X
    elif face == 4: x, y, z = ( sv,  -1.0,  -su) # -Y
    elif face == 5: x, y, z = ( sv,   su,  -1.0) # -Z
    else: return (0,0,0)

    # Normalize
    r = math.sqrt(x*x + y*y + z*z)
    return (x/r, y/r, z/r)

def dist(p1, p2):
    return math.sqrt((p1[0]-p2[0])**2 + (p1[1]-p2[1])**2 + (p1[2]-p2[2])**2)

def get_edge_points(face, edge_idx, steps=10):
    # Edge Indices: 0:North(v=1), 1:East(u=1), 2:South(v=0), 3:West(u=0)
    points = []
    
    # We want to trace the edge "Left to Right" or "Bottom to Top" (increasing index)
    # N (v=1): u increases 0..1
    # E (u=1): v increases 0..1
    # S (v=0): u increases 0..1
    # W (u=0): v increases 0..1
    
    for i in range(steps):
        t = i / (steps - 1)
        if edge_idx == 0: u, v = t, 1.0
        elif edge_idx == 1: u, v = 1.0, t
        elif edge_idx == 2: u, v = t, 0.0
        elif edge_idx == 3: u, v = 0.0, t
        
        points.append(s2_face_uv_to_xyz(face, u, v))
        
    return points

FACES = range(6)
EDGES = range(4) # N, E, S, W

TRANSITIONS = {}

print("S2_TRANSITIONS = {")

for f in FACES:
    TRANSITIONS[f] = {}
    print(f"    {f}: {{")
    for e in EDGES:
        pts = get_edge_points(f, e)
        
        found = None
        
        # Search all other faces/edges
        for nf in FACES:
            if nf == f: continue
            for ne in EDGES:
                npts = get_edge_points(nf, ne)
                
                # Check Direct Alignment (Start->Start)
                d_direct = sum(dist(pts[i], npts[i]) for i in range(len(pts)))
                
                # Check Flipped Alignment (Start->End)
                d_flipped = sum(dist(pts[i], npts[len(pts)-1-i]) for i in range(len(pts)))
                
                if d_direct < 0.1: # Threshold
                    found = (nf, ne, False)
                    break
                if d_flipped < 0.1:
                    found = (nf, ne, True)
                    break
            if found: break
            
        if found:
            nf, ne, flip = found
            # Determine Swap (Legacy thought process, but helpful for human verification)
            # Source N/S (0/2) -> Target E/W (1/3) implies swap.
            # Source E/W (1/3) -> Target N/S (0/2) implies swap.
            is_ns_src = (e == 0 or e == 2)
            is_ns_dst = (ne == 0 or ne == 2)
            swap = (is_ns_src != is_ns_dst)
            
            # Formatted Output
            # E_N: (NF, NE, Swap, Flip)
            e_name = ["E_N", "E_E", "E_S", "E_W"][e]
            ne_name = ["E_N", "E_E", "E_S", "E_W"][ne]
            
            print(f"        {e_name}: ({nf}, {ne}, {swap}, {flip}), # -> {nf} {ne_name}")
        else:
            print(f"        ERROR: No match for Face {f} Edge {e}")
            
    print("    },")

print("}")
