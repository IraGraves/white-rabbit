
import math

def s2_st_to_uv(s):
    if s >= 0.5:
        return (1.0 / 3.0) * (4.0 * s * s - 1.0)
    else:
        return (1.0 / 3.0) * (1.0 - 4.0 * (1.0 - s) * (1.0 - s))

def face_uv_to_xyz(face, u, v):
    su = s2_st_to_uv(u)
    sv = s2_st_to_uv(v)
    
    if face == 2:
        x = -su
        y = -sv
        z = 1.0
    elif face == 5:
        x = sv
        y = su
        z = -1.0
    else:
        return 0,0,0

    r = math.sqrt(x*x + y*y + z*z)
    return (x/r, y/r, z/r)

def xyz_to_latlon(x, y, z):
    # z is sin(lat) if spherical
    # clamp z
    z = max(-1.0, min(1.0, z))
    lat = math.asin(z) * 180.0 / math.pi
    lon = math.atan2(y, x) * 180.0 / math.pi
    return lat, lon

def main():
    W = 1024
    offset = 0.5
    center = W // 2
    
    print(f"Debugging Face 2 Center (W={W})...")
    print(f"{'row':<5} | {'col':<5} | {'u':<10} | {'v':<10} | {'x':<10} | {'y':<10} | {'z':<10} | {'lat':<10} | {'lon':<10}")
    
    for r in range(center - 2, center + 3):
        for c in range(center - 2, center + 3):
            u = (c + offset) / W
            v = 1.0 - (r + offset) / W
            
            x, y, z = face_uv_to_xyz(2, u, v)
            lat, lon = xyz_to_latlon(x, y, z)
            
            print(f"{r:<5} | {c:<5} | {u:<10.6f} | {v:<10.6f} | {x:<10.6f} | {y:<10.6f} | {z:<10.6f} | {lat:<10.4f} | {lon:<10.4f}")

if __name__ == "__main__":
    main()
