import os
import json
import struct
import traceback
import math
import sys
from pathlib import Path
from datetime import datetime

# --- KONFIGURATION ---
HARDCODED_PATH = r"C:\Users\Bernhard\.gemini\antigravity\scratch\white-rabbit\scripts\texture-pipeline\tiles_out\tileset.json"
LOG_FILENAME = "validation_report_content.txt"
ELLIPSOID_RADII = (6378137.0, 6378137.0, 6356752.0) # Earth Radii (Matches user's current run)
TOLERANCE_RAD = 0.5 # Higher tolerance for rough tests
class FileLogger:
    def __init__(self, log_path):
        self.log_path = log_path
        with open(self.log_path, "w", encoding="utf-8") as f:
            f.write(f"=== CONTENT VALIDATION REPORT ===\nTime: {datetime.now()}\n")
            f.write(f"Target: {HARDCODED_PATH}\n\n")
            
    def log(self, msg, status="INFO"):
        line = f"[{status}] {msg}"
        try:
            print(line, flush=True)
        except:
            pass 
        with open(self.log_path, "a", encoding="utf-8") as f:
            f.write(line + "\n")

class DeepContentValidator:
    def __init__(self, tileset_path, logger):
        self.path = Path(tileset_path)
        self.root_dir = self.path.parent
        self.logger = logger
        self.errors = []
        self.checked_tiles = 0
        self.mismatched_tiles = 0

    def validate(self):
        if not self.path.exists():
            self.logger.log("CRITICAL: tileset.json not found!", "FAIL"); return

        try:
            with open(self.path, "r", encoding="utf-8") as f:
                data = json.load(f)
        except Exception as e:
            self.logger.log(f"JSON Error: {e}", "FAIL"); return

        root = data.get("root", {})
        
        # Check if Explicit or Implicit
        implicit = root.get("implicitTiling")
        if implicit:
            # Handle Implicit Root
            self.validate_implicit_node(root)
        else:
            # Handle Explicit or Implicit Children
            children = root.get("children", [])
            has_implicit_children = any("implicitTiling" in c for c in children)
            
            if has_implicit_children:
                self.logger.log("Detected Implicit Tiling (via children)...")
                for i, child in enumerate(children):
                    if "implicitTiling" in child:
                        self.validate_implicit_node(child, f"Child {i}")
            else:
                self.logger.log("Detected Explicit Tiling Hierarchy...")
                # Start recursive validation with Identity transform
                identity = [
                    1.0, 0.0, 0.0, 0.0,
                    0.0, 1.0, 0.0, 0.0, 
                    0.0, 0.0, 1.0, 0.0,
                    0.0, 0.0, 0.0, 1.0
                ]
                self.validate_explicit_node(root, identity)

        self.logger.log("\n=== SUMMARY ===")
        self.logger.log(f"Tiles Checked: {self.checked_tiles}")
        self.logger.log(f"Geo-Mismatches: {self.mismatched_tiles}")
        
        if self.errors or self.mismatched_tiles > 0:
            self.logger.log("Result: FAIL", "FAIL")
            # Exit with Error Code 1 to signal failure to scripts
            sys.exit(1)
        else:
            self.logger.log("Result: PASS", "SUCCESS")

    def validate_implicit_node(self, node, label="Root"):
        implicit = node.get("implicitTiling")
        content = node.get("content", {})
        bv = node.get("boundingVolume", {}).get("region")
        
        if implicit and bv:
            self.logger.log(f"--> Analysing Implicit {label} (Region: {bv})")
            self.check_implicit_tree(implicit, content, bv)

    def validate_explicit_node(self, node, parent_transform):
        # 1. Update Transform
        # T_global = T_parent * T_local
        local_transform = node.get("transform", [
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0, 
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0
        ])
        
        global_transform = self.mat4_mul(parent_transform, local_transform)
        
        # 2. Check Content
        content = node.get("content")
        if content and "uri" in content:
            uri = content["uri"]
            # Resolve URI relative to tileset
            glb_path = self.root_dir / uri
            
            bv = node.get("boundingVolume", {})
            if "sphere" in bv:
                # Sphere: [x, y, z, r]
                sphere = bv["sphere"]
                # Sphere center is in Local Space (of this node)
                # But prior to this node's transform? Or same space?
                # Spec: Bounding Volume is in defined in the coordinate system of the parent.
                # BUT many implementations put it in Local.
                # planet_tiler.py Puts Transform (Translation) + Sphere (Local 0,0,0).
                # So Sphere Center needs to be transformed by Global Transform? 
                # NO. If Sphere is in Parent Space, we only apply Parent Transform.
                # IF Sphere is in Local Space, we apply Global Transform.
                # Assuming planet_tiler puts sphere at (0,0,0) local, and transform puts it in place.
                
                # Center in local tile space (usually 0,0,0 for planet_tiler explicit)
                local_center = (sphere[0], sphere[1], sphere[2])
                radius = sphere[3]
                
                # Transform Sphere Center to World Space
                world_center = self.mat4_apply(global_transform, local_center)
                
                # Check GLB
                self.inspect_explicit_glb(glb_path, world_center, radius, global_transform)
                
        # 3. Recurse
        children = node.get("children", [])
        for child in children:
            self.validate_explicit_node(child, global_transform)

    def mat4_mul(self, A, B):
        # Column-major multiplication (Standard GLTF/Cesium)
        # C = A * B
        C = [0]*16
        for i in range(4): # Col B
            for j in range(4): # Row A
                sum = 0
                for k in range(4):
                   sum += A[k*4 + j] * B[i*4 + k]
                C[i*4 + j] = sum
        return C

    def mat4_apply(self, M, v):
        # v is (x,y,z). M is 4x4 column major.
        x, y, z = v
        # x' = M00*x + M10*y + M20*z + M30
        ox = M[0]*x + M[4]*y + M[8]*z + M[12]
        oy = M[1]*x + M[5]*y + M[9]*z + M[13]
        oz = M[2]*x + M[6]*y + M[10]*z + M[14]
        return (ox, oy, oz)

    def inspect_explicit_glb(self, path, expected_center, radius, transform):
        self.checked_tiles += 1
        if not path.exists(): 
            return # self.logger.log(f"Missing file: {path}", "WARN")

        try:
            with open(path, "rb") as f:
                # Basic GLB Parsing
                magic = f.read(4)
                if magic != b'glTF': return
                version = struct.unpack('<I', f.read(4))[0]
                length = struct.unpack('<I', f.read(4))[0]
                chunk_len = struct.unpack('<I', f.read(4))[0]
                chunk_type = f.read(4)
                if chunk_type != b'JSON': return
                json_data = f.read(chunk_len)
                gltf = json.loads(json_data.decode('utf-8'))
                
                if not gltf.get("meshes"): return
                primitive = gltf["meshes"][0]["primitives"][0]
                pos_idx = primitive["attributes"].get("POSITION")
                if pos_idx is None: return
                
                accessor = gltf["accessors"][pos_idx]
                min_pos = accessor.get("min")
                max_pos = accessor.get("max")
                
                # Center of Geometry (Local to GLB)
                geom_center = [
                    (min_pos[0] + max_pos[0]) / 2.0,
                    (min_pos[1] + max_pos[1]) / 2.0,
                    (min_pos[2] + max_pos[2]) / 2.0
                ]
                
                # Handle CESIUM_RTC
                # If RTC is present, vertices are relative to RTC.
                # The Model Matrix (transform) applies ON TOP of RTC?
                # Usually: World = Transform * (RTC_Translation + Vertex)
                # So geometry center in world = Transform * (RTC + geom_center)
                
                rtc_offset = [0,0,0]
                if "CESIUM_RTC" in gltf.get("extensions", {}):
                    rtc_offset = gltf["extensions"]["CESIUM_RTC"]["center"]
                
                # Combine GLB Local -> Tile Local
                tile_local_center = (
                    rtc_offset[0] + geom_center[0],
                    rtc_offset[1] + geom_center[1],
                    rtc_offset[2] + geom_center[2]
                )
                
                # Transform to World
                
                # Get Node Translation (Critical for Implicit Tiling)
                node_translation = [0.0, 0.0, 0.0]
                if gltf.get("nodes"):
                    n0 = gltf["nodes"][0]
                    if "translation" in n0:
                        node_translation = n0["translation"]

                # Check ALL 8 Corners of the AABB
                corners = []
                for z in [min_pos[2], max_pos[2]]:
                    for y in [min_pos[1], max_pos[1]]:
                        for x in [min_pos[0], max_pos[0]]:
                            corners.append((x,y,z))

                # Unswizzle Node Translation and RTC Offset (both are in Swizzled GLB Space)
                unswiz_nt = (node_translation[0], -node_translation[2], node_translation[1])
                unswiz_rtc = (rtc_offset[0], -rtc_offset[2], rtc_offset[1])

                max_dist = 0
                for c in corners:
                    # 1. Unswizzle local corner (Y-Up -> Z-Up)
                    unswiz_c = (c[0], -c[2], c[1])

                    # 2. Add unswizzled offsets (All are now in Z-up ECEF)
                    c_ecef_local = (
                        unswiz_c[0] + unswiz_nt[0] + unswiz_rtc[0],
                        unswiz_c[1] + unswiz_nt[1] + unswiz_rtc[1],
                        unswiz_c[2] + unswiz_nt[2] + unswiz_rtc[2]
                    )
                    
                    # 3. Apply Transform (Explicit)
                    c_ecef_world = self.mat4_apply(transform, c_ecef_local)

                    # Dist
                    dx = c_ecef_world[0] - expected_center[0]
                    dy = c_ecef_world[1] - expected_center[1]
                    dz = c_ecef_world[2] - expected_center[2]
                    dist = math.sqrt(dx*dx + dy*dy + dz*dz)
                    if dist > max_dist: max_dist = dist

                # Tolerance: Radius + 500m buffer
                limit = radius + 500.0 
                
                if max_dist > limit:
                     self.mismatched_tiles += 1
                     self.logger.log(f"MISMATCH explicit tile: {path.name}", "FAIL")
                     self.logger.log(f"   Bounds Leak: Max Corner Dist {max_dist:.1f}m > Limit {limit:.1f}m", "FAIL")
                     self.logger.log(f"   -> INDICATES: Geometry is larger than declared Bounding Sphere.", "WARN")
                     self.logger.log(f"      Check if tile generation includes 'padding' not accounted for in metadata.", "WARN")
                     
        except Exception as e:
            pass

    def check_implicit_tree(self, implicit, content, root_region):
        subtrees_uri = implicit.get("subtrees", {}).get("uri", "")
        content_uri = content.get("uri", "")
        levels = implicit.get("subtreeLevels", 1)
        
        # 1. Load Root Subtree
        subtree_path = self.resolve_template(subtrees_uri, 0, 0, 0)
        avail = self.parse_subtree(subtree_path)
        if not avail: return

        # 2. Iterate Tiles
        content_bits = avail['content_bits']
        bit_index = 0
        
        # Root Region [West, South, East, North, minH, maxH]
        rw, rs, re, rn, _, _ = root_region
        
        for z in range(levels):
            side = 2 ** z
            width_rad = (re - rw) / side
            height_rad = (rn - rs) / side
            
            for y in range(side):
                for x in range(side):
                    has_content = self.get_bit(content_bits, bit_index)
                    if has_content:
                        glb_path = self.resolve_template(content_uri, z, x, y)
                        exp_w = rw + x * width_rad
                        exp_e = exp_w + width_rad
                        exp_s = rs + y * height_rad
                        exp_n = exp_s + height_rad
                        self.inspect_implicit_glb(glb_path, z, x, y, (exp_w, exp_s, exp_e, exp_n))
                    bit_index += 1

    def inspect_implicit_glb(self, path, z, x, y, expected_rect):
        self.checked_tiles += 1
        if not path.exists(): return
        
        try:
            with open(path, "rb") as f:
                magic = f.read(4)
                if magic != b'glTF': return
                version = struct.unpack('<I', f.read(4))[0]
                length = struct.unpack('<I', f.read(4))[0]
                chunk_len = struct.unpack('<I', f.read(4))[0]
                chunk_type = f.read(4)
                if chunk_type != b'JSON': return
                json_data = f.read(chunk_len)
                gltf = json.loads(json_data.decode('utf-8'))
                
                if not gltf.get("meshes"): return
                primitive = gltf["meshes"][0]["primitives"][0]
                pos_idx = primitive["attributes"].get("POSITION")
                
                accessor = gltf["accessors"][pos_idx]
                min_pos = accessor.get("min")
                max_pos = accessor.get("max")
                
                rtc_center = [0.0, 0.0, 0.0]
                if "CESIUM_RTC" in gltf.get("extensions", {}):
                    rtc_center = gltf["extensions"]["CESIUM_RTC"]["center"]
                
                # Get Node Translation
                node_translation = [0.0, 0.0, 0.0]
                if gltf.get("nodes"):
                    n0 = gltf["nodes"][0]
                    if "translation" in n0:
                        node_translation = n0["translation"]

                # Check ALL 8 corners
                corners = []
                for cx in [min_pos[0], max_pos[0]]:
                    for cy in [min_pos[1], max_pos[1]]:
                        for cz in [min_pos[2], max_pos[2]]:
                            corners.append((cx, cy, cz))
                
                ew, es, ee, en = expected_rect
                tol = 0.05 # Radians tolerance
                
                # Helper to check if a set of corners fits
                def check_fit(corner_list):
                    lat_fail = False
                    lon_fail = False
                    
                    # Expected Center/Width for wrapping check
                    exp_clon = (ew + ee) / 2.0
                    exp_wlon = (ee - ew)
                    
                    # Unswizzle Offsets
                    unswiz_nt = (node_translation[0], -node_translation[2], node_translation[1])
                    unswiz_rtc = (rtc_center[0], -rtc_center[2], rtc_center[1])

                    for c in corner_list:
                        # 1. Unswizzle corner
                        unswiz_c = (c[0], -c[2], c[1])

                        # 2. Combine unswizzled parts
                        v_ecef = (
                            unswiz_c[0] + unswiz_nt[0] + unswiz_rtc[0],
                            unswiz_c[1] + unswiz_nt[1] + unswiz_rtc[1],
                            unswiz_c[2] + unswiz_nt[2] + unswiz_rtc[2]
                        )
                        
                        lat, lon, h = self.ecef_to_lla(v_ecef[0], v_ecef[1], v_ecef[2])
                        
                        if not ((es - tol) <= lat <= (en + tol)): lat_fail = True
                        
                        # Dateline-safe Longitude Check
                        if abs(lat) > (math.pi/2 - 0.002):
                             d_lon = 0
                        else:
                            d_lon = lon - exp_clon
                            # Normalize to [-PI, PI]
                            while d_lon > math.pi: d_lon -= 2 * math.pi
                            while d_lon < -math.pi: d_lon += 2 * math.pi
                        
                        if abs(d_lon) > (exp_wlon / 2.0 + tol): lon_fail = True
                        
                    return lat_fail, lon_fail

                # Regular Check
                any_lat_fail, any_lon_fail = check_fit(corners)

                if any_lat_fail or any_lon_fail:
                    self.mismatched_tiles += 1
                    errs = []
                    if any_lat_fail: errs.append("Latitude")
                    if any_lon_fail: errs.append("Longitude")
                    self.logger.log(f"MISMATCH Tile {z}/{x}/{y}: Bounds Leak ({' + '.join(errs)})", "FAIL")
                    
                    # Detailed Check
                    # Check Directionality
                    lat_dirs = {}
                    lon_dirs = {}
                    R = 1738140.0 # Approx Moon Radius
                    
                    for c in corners:
                         # 1. Apply Node Translation
                        c_model = (c[0] + node_translation[0], c[1] + node_translation[1], c[2] + node_translation[2])
                        # 2. Apply RTC
                        abs_c = [rtc_center[0] + c_model[0], rtc_center[1] + c_model[1], rtc_center[2] + c_model[2]]
                        # 3. Unswizzle
                        v_ecef = (abs_c[0], -abs_c[2], abs_c[1])
                        
                        lat, lon, h = self.ecef_to_lla(v_ecef[0], v_ecef[1], v_ecef[2])
                        
                        if lat > (en + tol): 
                            diff = math.degrees(lat - en)
                            dist_km = (math.radians(diff) * R) / 1000.0
                            lat_dirs["North"] = max(lat_dirs.get("North", (0.0, 0.0)), (diff, dist_km), key=lambda x: x[0])
                        if lat < (es - tol): 
                            diff = math.degrees(es - lat)
                            dist_km = (math.radians(diff) * R) / 1000.0
                            lat_dirs["South"] = max(lat_dirs.get("South", (0.0, 0.0)), (diff, dist_km), key=lambda x: x[0])
                        
                        # Dateline-safe Longitude Check
                        # Skip Longitude check if at Pole (Singularity)
                        if abs(lat) > (math.pi/2 - 0.002): # Within ~0.1 degrees of pole
                             d_lon = 0
                        else:
                            exp_clon = (ew + ee) / 2.0
                            exp_wlon = (ee - ew)
                            d_lon = lon - exp_clon
                            while d_lon > math.pi: d_lon -= 2 * math.pi
                            while d_lon < -math.pi: d_lon += 2 * math.pi
                        
                        if abs(d_lon) > (exp_wlon / 2.0 + tol):
                            # Determine direction (West or East of expected box)
                            # If d_lon positive -> East of center.
                            diff = math.degrees(abs(d_lon) - (exp_wlon / 2.0))
                            dist_km = (math.radians(diff) * R * math.cos(lat)) / 1000.0 # Scale by cos(lat)
                            if d_lon > 0: 
                                lon_dirs["East"] = max(lon_dirs.get("East", (0.0, 0.0)), (diff, dist_km), key=lambda x: x[0])
                            else: 
                                lon_dirs["West"] = max(lon_dirs.get("West", (0.0, 0.0)), (diff, dist_km), key=lambda x: x[0])

                    if lat_dirs:
                        msgs = [f"{k} by {v[0]:.6f}° (~{v[1]:.2f} km)" for k,v in lat_dirs.items()]
                        self.logger.log(f"   -> Latitude extends: {', '.join(msgs)}", "WARN")
                    if lon_dirs:
                        msgs = [f"{k} by {v[0]:.6f}° (~{v[1]:.2f} km)" for k,v in lon_dirs.items()]
                        self.logger.log(f"   -> Longitude extends: {', '.join(msgs)}", "WARN")

                    # What-If Analysis (Independent)
                    z_flip_fixes_lat = False
                    
                    # Check if Z-Flip fixes LATITUDE (ignoring Lon)
                    if any_lat_fail:
                        lat_ok_if_flipped = True
                        for c in corners:
                            # ... Re-calc flipped ...
                            # Unswizzle
                            unswiz_nt = (node_translation[0], -node_translation[2], node_translation[1])
                            unswiz_rtc = (rtc_center[0], -rtc_center[2], rtc_center[1])

                            unswiz_c = (c[0], -c[2], c[1])
                            v_ecef = [
                                unswiz_c[0] + unswiz_nt[0] + unswiz_rtc[0],
                                unswiz_c[1] + unswiz_nt[1] + unswiz_rtc[1],
                                unswiz_c[2] + unswiz_nt[2] + unswiz_rtc[2]
                            ]
                            
                            v_ecef[2] = -v_ecef[2] # Flip Z (Old fix attempt)
                            
                            lat, lon, h = self.ecef_to_lla(v_ecef[0], v_ecef[1], v_ecef[2])
                            if not ((es - tol) <= lat <= (en + tol)): lat_ok_if_flipped = False
                        
                        if lat_ok_if_flipped:
                            self.logger.log(f"   [HINT] Flipping Z-Axis WOULD fix the Latitude Error.", "WARN")
                            self.logger.log(f"          (This confirms the Y-Axis Inversion issue).", "WARN")
                        else:
                            self.logger.log(f"   [HINT] Flipping Z-Axis would NOT fix Latitude.", "WARN")
                    
                    if any_lon_fail:
                        pass # Could check X-Flip but less likely.
                
        except Exception as e:
            pass

    def ecef_to_lla(self, x, y, z):
        # Bowring's formula (Closed-form, high precision for oblate planets)
        a = ELLIPSOID_RADII[0]
        b = ELLIPSOID_RADII[2]
        
        e2 = (a**2 - b**2) / (a**2) # First eccentricity squared
        ep2 = (a**2 - b**2) / (b**2) # Second eccentricity squared
        
        p = math.sqrt(x**2 + y**2)
        if p < 1e-9: # Pole case
             lat = math.pi/2 if z > 0 else -math.pi/2
             lon = 0
             h = abs(z) - b
             return lat, lon, h
             
        theta = math.atan2(z * a, p * b)
        
        lat = math.atan2(z + ep2 * b * (math.sin(theta)**3), 
                         p - e2 * a * (math.cos(theta)**3))
        lon = math.atan2(y, x)
        
        # Radius of curvature in the prime vertical
        N = a / math.sqrt(1 - e2 * (math.sin(lat)**2))
        h = (p / math.cos(lat)) - N
        
        return lat, lon, h

    def parse_subtree(self, path):
        try:
            with open(path, "rb") as f:
                header = f.read(24)
                if len(header) < 24: return None
                magic, version, json_len, bin_len = struct.unpack('<4sIQQ', header)
                f.seek(24)
                json_bytes = f.read(json_len)
                data = json.loads(json_bytes.decode('utf-8'))
                bin_body = f.read(bin_len)
                views = data.get("bufferViews", [])
                c_view = views[data["contentAvailability"][0]["bitstream"]]
                c_off = c_view["byteOffset"]
                return { 'content_bits': bin_body[c_off : c_off + c_view["byteLength"]] }
        except: return None

    def get_bit(self, buffer, index):
        byte_idx = index // 8
        bit_idx = index % 8
        if byte_idx >= len(buffer): return False
        return (buffer[byte_idx] & (1 << bit_idx)) != 0

    def resolve_template(self, template, level, x, y):
        s = template.replace("{level}", str(level)).replace("{x}", str(x)).replace("{y}", str(y)).replace("{z}", "0")
        return self.root_dir / s

if __name__ == "__main__":
    log_file = os.path.join(os.getcwd(), LOG_FILENAME)
    logger = FileLogger(log_file)
    
    if len(sys.argv) > 1:
        target = sys.argv[1]
    else:
        target = HARDCODED_PATH
        if not os.path.exists(target):
            target = os.path.join(os.getcwd(), "tiles_out", "tileset.json")
    
    try:
        DeepContentValidator(target, logger).validate()
    except Exception as e:
        logger.log(f"CRASH: {e}", "CRITICAL")
        logger.log(traceback.format_exc(), "TRACE")
    print(f"DONE. Log: {log_file}", flush=True)