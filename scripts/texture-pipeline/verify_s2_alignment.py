
import math

def s2_st_to_uv(s):
    if s >= 0.5: return (1.0/3.0) * (4.0 * s*s - 1.0)
    else: return (1.0/3.0) * (1.0 - 4.0 * (1.0-s)**2)

def s2_face_uv_to_xyz(face, u, v):
    su = s2_st_to_uv(u)
    sv = s2_st_to_uv(v)
    if face == 0:   x, y, z = ( 1.0,   su,   sv)
    elif face == 1: x, y, z = (-su,   1.0,   sv)
    elif face == 2: x, y, z = (-su,  -sv,   1.0)
    elif face == 3: x, y, z = (-1.0, -sv,  -su)
    elif face == 4: x, y, z = ( sv,  -1.0,  -su)
    elif face == 5: x, y, z = ( sv,   su,  -1.0)
    else: return 0,0,0
    return (x,y,z)

E_N, E_E, E_S, E_W = 0, 1, 2, 3
E_NAMES = ["NORTH", "EAST", "SOUTH", "WEST"]

def get_uv_on_edge(edge, p):
    if edge == E_N: return (p, 1.0)
    if edge == E_S: return (p, 0.0)
    if edge == E_E: return (1.0, p)
    if edge == E_W: return (0.0, p)

def compare_points(p1, p2):
    return all(abs(p1[i] - p2[i]) < 1e-9 for i in range(3))

print("CORRECT_S2_TRANSITIONS = {")
for f1 in range(6):
    print(f"    {f1}: {{")
    for side in range(4):
        # We search all possible neighbors, edges, and flips
        found = False
        for nf in range(6):
            if nf == f1: continue
            for ne in range(4):
                for flip in [False, True]:
                    match = True
                    # Check 5 points along the edge for robustness
                    for p in [0.0, 0.25, 0.5, 0.75, 1.0]:
                        u1, v1 = get_uv_on_edge(side, p)
                        xyz1 = s2_face_uv_to_xyz(f1, u1, v1)
                        
                        tp = (1.0 - p) if flip else p
                        u2, v2 = get_uv_on_edge(ne, tp)
                        xyz2 = s2_face_uv_to_xyz(nf, u2, v2)
                        
                        if not compare_points(xyz1, xyz2):
                            match = False
                            break
                    if match:
                        # Success!
                        # We also output swap_xy. 
                        # In S2, swap_xy is True if target edge is Different Orientation?
                        # N/S (0,2) vs E/W (1,3)
                        is_source_vertical = side in [E_E, E_W]
                        is_target_vertical = ne in [E_E, E_W]
                        swap = is_source_vertical != is_target_vertical
                        
                        print(f"        E_{E_NAMES[side]}: ({nf}, E_{E_NAMES[ne]}, {swap}, {flip}),")
                        found = True
                        break
                if found: break
            if found: break
    print("    },")
print("}")
