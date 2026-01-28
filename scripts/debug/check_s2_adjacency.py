
import math

def s2_face_uv_to_xyz(face, u, v):
    u = 2.0 * u - 1.0
    v = 2.0 * v - 1.0
    if face == 0:   return (1.0, u, v)
    elif face == 1: return (-u, 1.0, v)
    elif face == 2: return (-u, -v, 1.0)
    elif face == 3: return (-1.0, -v, -u)
    elif face == 4: return (v, -1.0, -u)
    elif face == 5: return (v, u, -1.0)
    return (0,0,0)

def s2_xyz_to_face_uv(x, y, z):
    ax, ay, az = abs(x), abs(y), abs(z)
    if ax >= ay and ax >= az:
        face = 0 if x > 0 else 3
    elif ay >= ax and ay >= az:
        face = 1 if y > 0 else 4
    else:
        face = 2 if z > 0 else 5
    
    # Projection to face
    if face == 0:   u, v = y / x, z / x
    elif face == 1: u, v = -x / y, z / y
    elif face == 2: u, v = -x / z, -y / z
    elif face == 3: u, v = y / x, z / x
    elif face == 4: u, v = -z / y, -x / y
    elif face == 5: u, v = -y / z, -x / z
    
    return face, 0.5 * (u + 1.0), 0.5 * (v + 1.0)

E_NORTH = 0
E_EAST = 1
E_SOUTH = 2
E_WEST = 3
E_NAMES = ["NORTH", "EAST", "SOUTH", "WEST"]

def get_edge_name(u, v):
    if v > 0.999: return E_NORTH
    if v < 0.001: return E_SOUTH
    if u > 0.999: return E_EAST
    if u < 0.001: return E_WEST
    return -1

print("S2_TRANSITIONS = {")
for f in range(6):
    print(f"    {f}: {{")
    for side_idx in range(4):
        # Sample point on edge
        if side_idx == E_NORTH: u, v = 0.51, 1.0
        elif side_idx == E_SOUTH: u, v = 0.51, 0.0
        elif side_idx == E_EAST: u, v = 1.0, 0.51
        elif side_idx == E_WEST: u, v = 0.0, 0.51
        
        xyz = s2_face_uv_to_xyz(f, u, v)
        # Shift slightly away from face into neighbor
        sx, sy, sz = xyz
        if f == 0: sx *= 1.001
        elif f == 3: sx *= 1.001
        elif f == 1: sy *= 1.001
        elif f == 4: sy *= 1.001
        elif f == 2: sz *= 1.001
        elif f == 5: sz *= 1.001
        
        nf, nu, nv = s2_xyz_to_face_uv(sx, sy, sz)
        ne_idx = get_edge_name(nu, nv)
        
        # Orientation check
        if side_idx in [E_NORTH, E_SOUTH]: u_off, v_off = 0.52, v
        else: u_off, v_off = u, 0.52
        
        xyz2 = s2_face_uv_to_xyz(f, u_off, v_off)
        # Shift slightly...
        sx2, sy2, sz2 = xyz2
        if f == 0: sx2 *= 1.001
        elif f == 3: sx2 *= 1.001
        elif f == 1: sy2 *= 1.001
        elif f == 4: sy2 *= 1.001
        elif f == 2: sz2 *= 1.001
        elif f == 5: sz2 *= 1.001

        nf2, nu2, nv2 = s2_xyz_to_face_uv(sx2, sy2, sz2)
        
        swap_xy = False
        flip_axis = False
        
        if side_idx in [E_NORTH, E_SOUTH]:
             if abs(nu2 - nu) < 0.001:
                 swap_xy = True
                 if nv2 < nv: flip_axis = True
             else:
                 if nu2 < nu: flip_axis = True
        else:
             if abs(nv2 - nv) < 0.001:
                 swap_xy = True
                 if nu2 < nu: flip_axis = True
             else:
                 if nv2 < nv: flip_axis = True

        line = f"        E_{E_NAMES[side_idx]}: ({nf}, E_{E_NAMES[ne_idx]}, {swap_xy}, {flip_axis}),"
        print(line)
    print("    },")
print("}")
