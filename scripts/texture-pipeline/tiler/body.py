from .utils import load_bodies, get_radius_from_file, log

def get_body_radii(dem_path, body_name="moon", radius_override=None, rx_override=None, ry_override=None, rz_override=None, force_sphere=False):
    """
    Consolidates radius determination logic based on multiple priority levels.
    1. Explicit overrides (rx, ry, rz)
    2. Uniform radius override
    3. Body database lookup
    4. Metadata from DEM file
    5. Default (Moon radius)
    """
    bodies = load_bodies()
    file_radius = get_radius_from_file(dem_path)
    
    default_radius = 1737400.0  # Moon
    rx = ry = rz = default_radius
    
    # 1. Start with metadata if available
    if file_radius:
        rx = ry = rz = file_radius

    # 2. Override with body database
    body_key = body_name.lower() if body_name else "moon"
    ss_bodies = bodies.get("solar_system_bodies", {})
    if body_key in ss_bodies:
        body_data = ss_bodies[body_key]
        if "radii" in body_data:
            r_dict = body_data["radii"]
            rx = r_dict.get("x", rx)
            ry = r_dict.get("y", ry)
            rz = r_dict.get("z", rz)
        if "radius" in body_data:
            rx = ry = rz = body_data["radius"]
        if "radius_x" in body_data:
            rx = body_data["radius_x"]
        if "radius_y" in body_data:
            ry = body_data["radius_y"]
        if "radius_z" in body_data:
            rz = body_data["radius_z"]
    
    # 3. Override with explicit --radius
    if radius_override:
        rx = ry = rz = radius_override
    
    # 4. Override with specific radii if provided
    if rx_override: rx = rx_override
    if ry_override: ry = ry_override
    if rz_override: rz = rz_override
    
    # 5. Force sphere if requested
    if force_sphere:
        ry = rz = rx
        
    log(f"Using Radii: X={rx:.1f}m, Y={ry:.1f}m, Z={rz:.1f}m")
    return (rx, ry, rz)
