import math

# S2 Operations
def s2_st_to_uv(s):
    if s >= 0.5: return (1.0 / 3.0) * (4.0 * s * s - 1.0)
    return (1.0 / 3.0) * (1.0 - 4.0 * (1.0 - s) * (1.0 - s))

def face_uv_to_xyz(face, u, v):
    # GEOMETRIC WRAPPING IMPLEMENTATION matches C++
    su = s2_st_to_uv(u)
    sv = s2_st_to_uv(v)
    
    x, y, z = 0, 0, 0
    if face == 0: x=1; y=su; z=sv      # +X
    elif face == 1: x=-su; y=1; z=sv   # +Y
    elif face == 2: x=-su; y=-sv; z=1  # +Z (North)
    elif face == 3: x=-1; y=-sv; z=-su # -X
    elif face == 4: x=sv; y=-1; z=-su  # -Y
    elif face == 5: x=sv; y=su; z=-1   # -Z (South)
    
    # 3. Find dominant axis (True Face)
    ax, ay, az = abs(x), abs(y), abs(z)
    
    true_face = face
    if ax >= ay and ax >= az:
        true_face = 0 if x > 0 else 3
    elif ay >= ax and ay >= az:
        true_face = 1 if y > 0 else 4
    else:
        true_face = 2 if z > 0 else 5
        
    # 4. Re-project
    if true_face != face:
        max_val = ax
        if true_face in [1,4]: max_val = ay
        if true_face in [2,5]: max_val = az
        if max_val > 0:
            x /= max_val
            y /= max_val
            z /= max_val
            
    # 5. Normalize
    r = math.sqrt(x*x + y*y + z*z)
    return (x/r, y/r, z/r)

def xyz_to_face_uv_raw(p):
    x, y, z = p
    ax, ay, az = abs(x), abs(y), abs(z)
    face = 0
    if ax >= ay and ax >= az: face = 0 if x > 0 else 3
    elif ay >= ax and ay >= az: face = 1 if y > 0 else 4
    else: face = 2 if z > 0 else 5
    
    u, v = 0, 0
    # Invert the mapping:
    if face == 0: u=y/x; v=z/x
    elif face == 1: u=-x/y; v=z/y
    elif face == 2: u=-x/z; v=-y/z
    elif face == 3: u=z/x; v=y/x 
    elif face == 4: u=z/y; v=-x/y
    elif face == 5: u=-y/z; v=-x/z
    
    return face, u, v

def get_best_edge_from_uv(u, v):
    # Find which edge is closest.
    # Distances to -1 and 1
    d_N = abs(v - (-1.0))
    d_E = abs(u - 1.0)
    d_S = abs(v - 1.0)
    d_W = abs(u - (-1.0))
    
    min_d = min(d_N, d_E, d_S, d_W)
    if min_d == d_N: return 0
    if min_d == d_E: return 1
    if min_d == d_S: return 2
    return 3

# Edge Constants
E_N, E_E, E_S, E_W = 0, 1, 2, 3
EdgeNames = ["N", "E", "S", "W"]

def generate_table():
    print("S2Trans s2_transitions[6][4] = {")
    
    for f in range(6):
        print(f"    // Face {f}")
        print("    {")
        
        edges_out = []
        for edge in range(4):
            # 1. Probe just outside
            st_u, st_v = 0.5, 0.5
            EPS_OUT = -0.01 # Slightly outside (in ST space, 0..1)
            # Actually st=0 is -1 (Left/Top). st=1 is +1 (Right/Bottom)
            # N (v=-1): st_v < 0
            
            # Probe logic corrected for C++ (Top=v1, Bottom=v0)
            # N (Top): v > 1.0
            # S (Bottom): v < 0.0
            # E (Right): u > 1.0
            # W (Left): u < 0.0
            
            if edge == E_N: st_u=0.5; st_v=1.01
            elif edge == E_E: st_u=1.01; st_v=0.5
            elif edge == E_S: st_u=0.5; st_v=-0.01
            elif edge == E_W: st_u=-0.01; st_v=0.5
            
            p = face_uv_to_xyz(f, st_u, st_v)
            n_face, nu, nv = xyz_to_face_uv_raw(p)
            n_edge = get_best_edge_from_uv(nu, nv)
            
            # 2. Determine Orientation
            # Trace vector along OUR edge
            # Our Edge definition in ST space:
            # N: Right (u+)
            # E: Down (v+)
            # S: Right (u+) -- Standardization: Always Left->Right in ST?
            #    N Edge: (0,0)->(1,0). u increases.
            #    S Edge: (0,1)->(1,1). u increases.
            #    W Edge: (0,0)->(0,1). v increases.
            #    E Edge: (1,0)->(1,1). v increases.
            
            st_u1, st_v1, st_u2, st_v2 = 0,0,0,0
            # Sample points JUST INSIDE our edge
            # Sample points JUST INSIDE our edge
            INNER = 0.05
            if edge == E_N: # Top Edge (v=1). Inner is 1-INNER. u+
                st_u1 = 0.4; st_u2=0.6; st_v1=1.0-INNER; st_v2=1.0-INNER
            elif edge == E_E: # Right Edge (u=1). Inner is 1-INNER. v down? C++ usually V decreases?
                # C++ Loop: v = 1.0 - (row/H).
                # Row 0 -> v=1 (Top). Row H -> v=0 (Bottom).
                # So "Down" means v decreases (-1).
                # If E edge runs Top->Bottom in standard strip logic, it runs v- ?
                # "Standard Strip Order":
                # N: Left->Right (u+)
                # S: Left->Right (u+)
                # W: Top->Bottom (v-)
                # E: Top->Bottom (v-)
                
                # Let's verify our Vectors.
                # N: u1=0.4, u2=0.6. (u+). Correct.
                # S: u1=0.4, u2=0.6. (u+). Correct.
                
                # E: v decreases. v1=0.6, v2=0.4? (0.6 is higher up/more North).
                # If we scan row 0 to row H, v goes 1 -> 0.
                # So "Forward" along the strip is v decreasing.
                st_u1=1.0-INNER; st_u2=1.0-INNER; st_v1=0.6; st_v2=0.4 
                
            elif edge == E_S: # Bottom Edge (v=0). Inner is INNER. u+
                st_u1=0.4; st_u2=0.6; st_v1=INNER; st_v2=INNER
                
            elif edge == E_W: # Left Edge (u=0). Inner is INNER. v-
                st_u1=INNER; st_u2=INNER; st_v1=0.6; st_v2=0.4
                
            p1 = face_uv_to_xyz(f, st_u1, st_v1)
            p2 = face_uv_to_xyz(f, st_u2, st_v2)
            
            nf1, nu1, nv1 = xyz_to_face_uv_raw(p1)
            nf2, nu2, nv2 = xyz_to_face_uv_raw(p2)
            
            du = nu2 - nu1
            dv = nv2 - nv1
            
            # Analyze Neighbor Delta
            moved_horiz = abs(du) > abs(dv)
            positive = (du > 0) if moved_horiz else (dv > 0)
            
            # Our Vector is conceptually (1,0) (for N/S) or (0,1) (for E/W) in our local strip space?
            # Wait, Preprocessor logic for 'rotation':
            # "Rotation: How much we must rotate the neighbor's border pixel strip to align with our border."
            # Neighbor Strip:
            # If N/S: Width=W, Height=P. Main dir is u+.
            # If E/W: Width=P, Height=H. Main dir is v+.
            
            # If we are N (u+): We want Neighbor Strip to run u+.
            #   If Neighbor is N/S (u+), and delta matches u+: Rot 0.
            #   If Neighbor is N/S (u+), and delta matches u-: Rot 180.
            #   If Neighbor is E/W (v+), and delta matches v+: Rot 270 (v->u is -90/270).
            #   If Neighbor is E/W (v+), and delta matches v-: Rot 90 ( -v -> u).
            
            # Let's map Source Vector to Target Vector (1,0)
            src_vec = (0,0)
            # Determine Neighbor Strip Orientation
            n_strip_horiz = (n_edge == E_N or n_edge == E_S) # Is neighbor strip u+ dominant?
            
            # If Neighbor is Horiz, its native scan is u+ (1,0).
            # If Neighbor is Vert, its native scan is v+ (0,1).
            
            # We computed (du, dv) in Neighbor UV space.
            # Does (du, dv) align with Neighbor's Native Strip Axis?
            # If N is Horiz: Native is (1,0). Delta is (du, dv).
            #   If du > 0: Aligned.
            #   If du < 0: Reversed.
            # If N is Vert: Native is (0,1).
            #   If dv > 0: Aligned.
            #   If dv < 0: Reversed.
            

            
            # Target is ALWAYS Forward along scan.
            # For H-Strip (N/S): Forward is u+ (1,0).
            # For V-Strip (E/W): Forward is v- (-1 at geometry, but in BUFFER index it is +1).
            # Wait.
            # RasterIO reads into a buffer [0..P*W].
            # Index 0 is Top/Left. Index Max is Bottom/Right.
            # So "Forward in Buffer" always corresponds to the read direction.
            # If we read E/W Edge (from top to bottom), the buffer fills 0..MAX.
            # So Vector in Buffer Space is (0,1) if we treat buffer as 2D Image?
            # V-Strip is PxH.
            # Traversing scanlines (Top->Bottom) is (0,1).
            
            # So Target Buffer Vector is always (1,0) [if H] or (0,1) [if V].
            # BUT my "geometry vector" definition for Vertical was v- (Top->Bottom).
            # So if neighbor gave us a vector (0, -0.01) [Down], does that map to Buffer (0,1)?
            # Yes. Geometrically Down (v decreases) = Buffer Index Increases (Row increases).
            # So:
            #   Geometry (1,0) [u+] -> Buffer (1,0).
            #   Geometry (-1,0) [u-] -> Buffer (-1,0).
            #   Geometry (0,-1) [v-] -> Buffer (0,1).  <-- Key mapping
            #   Geometry (0,1) [v+] -> Buffer (0,-1).
            
            # Re-evaluate 'aligned' logic from Geometry Vector (du,dv):
            # n_aligned checks if du>0 (for H) or dv>0 (for V).
            # If N is V-Strip: Native is Top->Bottom (v-).
            # So if dv < 0 (Down), it is "Aligned" with scan order.
            
            n_aligned = False
            our_is_horiz = (edge == E_N or edge == E_S)
            
            if n_strip_horiz: n_aligned = (du > 0)
            else: n_aligned = (dv < 0) # Aligned if moving Down (v decreases)
            
            # Map Source Geometry Vector to Source Buffer Vector
            if n_strip_horiz: src_buf_vec = (1,0) if n_aligned else (-1,0)
            else: src_buf_vec = (0,1) if n_aligned else (0,-1)
            
            target_buf_vec = (1,0) if our_is_horiz else (0,1)
            
            # Now rotation is purely Buffer->Buffer
            sb = src_buf_vec
            tb = target_buf_vec
            
            if sb == tb: rot = 0
            elif sb == (-tb[0], -tb[1]): rot = 180
            else:
                if tb == (1,0):
                    if sb == (0,1): rot = 270 # (0,1)->(1,0): 270 (-90)
                    else: rot = 90
                else: # tb == (0,1)
                    if sb == (1,0): rot = 90 # (1,0)->(0,1): 90
                    else: rot = 270
            
            # Flip Logic? s2_preprocessor logic assumes flip_axis handles reading backwards?
            # Our rotation logic assumes we rotate the *result*.
            # If we just rotate, do we need flip?
            # Rot 180 is effectively Flip H+V.
            # The 'flip_axis' param in C++ seems to toggle "Read Source Backwards".
            # If we use 0/90/180/270 full rotation, we shouldn't need flip?
            # Let's set flip to false and rely on simple rotation.
            
            flip = "false"
            
            if f == 0 and edge == E_N:
                print(f"DEBUG: F0->N. P1_xyz={p1} P2_xyz={p2}")
                print(f"DEBUG: Neighbor Face{n_face} UV1=({nu1},{nv1}) UV2=({nu2},{nv2})")
                print(f"DEBUG: dUV=({du},{dv}) Horiz={n_strip_horiz} Aligned={n_aligned}")
                print(f"DEBUG: SB={sb} TB={tb} ROT={rot}")

            com = f"// {EdgeNames[edge]} -> {n_face} {EdgeNames[n_edge]}"
            edges_out.append(f"{{ {n_face}, {n_edge}, false, {flip}, {rot} }}, {com}")
            
        print("        " + "\n        ".join(edges_out))
        print("    },")
    print("};")

if __name__ == "__main__":
    generate_table()
