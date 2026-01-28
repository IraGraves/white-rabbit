
import math

def s2_st_to_uv(s):
    if s >= 0.5:
        return (1.0 / 3.0) * (4.0 * s * s - 1.0)
    else:
        return (1.0 / 3.0) * (1.0 - 4.0 * (1.0 - s) * (1.0 - s))

def face_uv_to_xyz_geometric(face, u, v):
    # Replicate C++ Logic
    su = s2_st_to_uv(u)
    sv = s2_st_to_uv(v)
    
    x, y, z = 0, 0, 0
    if face == 0: x=1; y=su; z=sv
    elif face == 1: x=-su; y=1; z=sv
    elif face == 2: x=-su; y=-sv; z=1
    elif face == 3: x=-1; y=-sv; z=-su
    elif face == 4: x=sv; y=-1; z=-su
    elif face == 5: x=sv; y=su; z=-1
    
    # Determine True Face
    ax, ay, az = abs(x), abs(y), abs(z)
    true_face = face
    
    if ax >= ay and ax >= az:
        true_face = 0 if x > 0 else 3
    elif ay >= ax and ay >= az:
        true_face = 1 if y > 0 else 4
    else:
        true_face = 2 if z > 0 else 5
        
    # Re-project if drifted
    if true_face != face:
        print(f"  -> Drifted from {face} to {true_face}")
        max_val = ax if (true_face==0 or true_face==3) else (ay if (true_face==1 or true_face==4) else az)
        x /= max_val
        y /= max_val
        z /= max_val
        
    # Normalize
    r = math.sqrt(x*x + y*y + z*z)
    return x/r, y/r, z/r

def test_transition():
    print("Testing Face 0 West Edge (u goes negative)...")
    
    # Point exactly on edge (u=0)
    p_edge = face_uv_to_xyz_geometric(0, 0.0, 0.5)
    print(f"Edge (u=0): {p_edge}")
    
    # Point slightly West (u=-0.1) -> Should be on Face 4
    print("\nTesting Extrapolation u=-0.1:")
    p_extra = face_uv_to_xyz_geometric(0, -0.1, 0.5)
    print(f"Extrapolated (u=-0.1): {p_extra}")
    
    # Verify it is on Face 4
    # Face 4: y = -1. So y component should be dominant negative.
    print(f"Is Point on Face 4? (y dominant negative): {p_extra[1] < -abs(p_extra[0]) and p_extra[1] < -abs(p_extra[2])}")
    
    # Verify continuity
    # Let's find the equivalent point on Face 4 logic directly?
    # No, the geometric logic implicitly found it.
    
    # Let's check Face 0 North Edge (v > 1)
    print("\nTesting Face 0 North Edge (v=1.1):")
    p_north = face_uv_to_xyz_geometric(0, 0.5, 1.1)
    print(f"North (v=1.1): {p_north}")
    
    # Should be Face 2 (z=1) or Face... ?
    # Face 0: z=sv. v=1 -> sv=1. v=1.1 -> sv > 1.
    # z > x (1.something > 1).
    # So True Face should be 2.
    print(f"Is Point on Face 2? (z dominant positive): {p_north[2] > abs(p_north[0]) and p_north[2] > abs(p_north[1])}")

if __name__ == "__main__":
    test_transition()
