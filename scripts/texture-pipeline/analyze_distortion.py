
import math

def s2_st_to_uv(s):
    if s >= 0.5:
        return (1.0 / 3.0) * (4.0 * s * s - 1.0)
    else:
        return (1.0 / 3.0) * (1.0 - 4.0 * (1.0 - s) * (1.0 - s))

def face_uv_to_xyz(face, u, v):
    # Face 2: Top
    if face == 2:
        x = -u  # Use -u as per code
        y = -v
        z = 1.0
    # Normalize
    r = math.sqrt(x*x + y*y + z*z)
    return (x/r, y/r, z/r)

def xyz_to_latlon(x, y, z):
    # z is sin(lat)
    lat = math.asin(z) * 180.0 / math.pi
    lon = math.atan2(y, x) * 180.0 / math.pi
    return lat, lon

def analyze_full(src_w, src_h, face_size):
    print(f"Analyzing Face 2 FULL Distortion (Source {src_w}x{src_h}, Face Size={face_size})")
    print(f"{'S (Rad)':<10} | {'Lat (deg)':<10} | {'dLat/dS':<10} | {'dLon/dS':<10} | {'AR (Lon/Lat)':<15} | {'Physical Radius (km)':<20}")
    print("-" * 100)
    
    step = 0.05
    coord_step = 1.0 / (face_size / 2) # Step related to 1 pixel from center (0..1 range covers half face)
    
    # Analyze along a radial line (V=0, U varies 0 to 1)
    # This corresponds to Lon=180? (x=-u, y=0. x negative. y=0. Lon=180 or -180).
    v = 0 # Center line
    
    # Radius of Moon ~ 1738 km
    R = 1738.0
    
    for s in [0.5 + i * 0.05 for i in range(11)]:
        u = s2_st_to_uv(s)
        
        # Point A (Current)
        x, y, z = face_uv_to_xyz(2, u, v)
        lat, lon = xyz_to_latlon(x, y, z)
        
        # Point B (Radial step: dLat)
        # Move U slightly
        u_next = s2_st_to_uv(s + coord_step)
        x2, y2, z2 = face_uv_to_xyz(2, u_next, v)
        lat2, lon2 = xyz_to_latlon(x2, y2, z2)
        
        d_lat_deg = abs(lat2 - lat)
        
        # Point C (Tangential step: dLon)
        # Move V slightly (perp to radius)
        # In UV space, V corresponds to Y axis on face.
        # At Lat/Lon, this is changing Longitude.
        v_next = s2_st_to_uv(0.5 + coord_step) # Center is 0.5. Step away from center.
        # Wait. V=0 is center processing.
        # We need dV corresponding to 1 pixel width at this U.
        # s_v = 0.5. s_v_next = 0.5 + coord_step.
        v_diff = s2_st_to_uv(0.5 + coord_step) - s2_st_to_uv(0.5)
        # So we evaluate at (u, v_diff)
        x3, y3, z3 = face_uv_to_xyz(2, u, v_diff)
        lat3, lon3 = xyz_to_latlon(x3, y3, z3)
        
        d_lon_deg = abs(lon3 - lon)
        # Correct for Lat? Lon geometric distance = dLon * cos(Lat)
        d_lon_geo = d_lon_deg * math.cos(lat * math.pi / 180.0)
        
        # Aspect Ratio of Sampling on Sphere
        # d_lat_deg vs d_lon_geo (in degrees equivalent)
        # Or better: Source Pixels per Face Pixel in Lat vs Lon.
        
        # Source Resolution:
        src_px_lat = src_h / 180.0 # Pixels per degree Lat
        src_px_lon = src_w / 360.0 # Pixels per degree Lon (GRID only)
        # Physical src resolution varies.
        
        # Ratio Lat = d_lat_deg * src_px_lat
        ratio_lat = d_lat_deg * src_px_lat
        
        # Ratio Lon = d_lon_deg * src_px_lon * 1.0? 
        # Source grid is uniform in degrees.
        # So Face Pixel covers d_lon_deg of source grid.
        # It consumes d_lon_deg * src_px_lon pixels.
        ratio_lon = d_lon_deg * src_px_lon
        
        physical_radius_km = (90 - lat) * (math.pi/180) * R
        
        print(f"{s:<10.2f} | {lat:<10.2f} | {ratio_lat:<10.4f} | {ratio_lon:<10.4f} | {ratio_lon/ratio_lat:<15.4f} | {physical_radius_km:<20.2f}")

analyze_full(4096, 2048, 1024)
