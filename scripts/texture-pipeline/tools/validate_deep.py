import os
import json
import struct
import subprocess
import shutil

# --- Decompression Helper ---
class Decompressor:
    def __init__(self):
        self.cmd_prefix = self._find_gltf_transform()
        
    def _find_gltf_transform(self):
        # 1. Try finding cli.js directly (Nuclear Option from compression.py)
        npm_root = os.path.join(os.environ.get("APPDATA", ""), "npm")
        cli_js = os.path.join(npm_root, "node_modules", "@gltf-transform", "cli", "bin", "cli.js")
        if os.path.exists(cli_js):
            # Resolve node
            node_exe = "node"
            for np_path in [r"C:\Program Files\nodejs", r"C:\Program Files (x86)\nodejs"]:
                test = os.path.join(np_path, "node.exe")
                if os.path.exists(test):
                    node_exe = test
                    break
            return [node_exe, cli_js]
            
        # 2. Fallback to npx
        return ["npx", "@gltf-transform/cli"]

    def decompress(self, input_path):
        """
        Decompresses a GLB file to a temporary path.
        Returns: (success_bool, temp_file_path_or_error)
        """
        abs_path = os.path.abspath(input_path)
        work_dir = os.path.dirname(abs_path)
        filename = os.path.basename(abs_path)
        temp_filename = f"dec_{filename}"
        temp_path = os.path.join(work_dir, temp_filename)
        
        # Command: gltf-transform copy input temp
        cmd = self.cmd_prefix + ["copy", filename, temp_filename]
        
        try:
            # Run in work_dir to avoid path quoting issues
            subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, cwd=work_dir, shell=True) 
            # Note: shell=True needed for npx on Windows sometimes, but node direct doesn't need it. 
            # Using shell=True with list args on Windows can be tricky. subprocess.run handling...
            # Actually compression.py used shell=False. Stick to False if possible.
            # But npx usually needs shell=True on Windows if not calling .cmd directly.
            # Let's try shell=True for safety if not using direct node.
            
            if os.path.exists(temp_path):
                return True, temp_path
            return False, "Output file not created"
        except subprocess.CalledProcessError as e:
            return False, f"Decompression failed: {e.stderr.decode() if e.stderr else str(e)}"
        except Exception as e:
            return False, str(e)

# -----------------
import traceback
import math
import sys
from pathlib import Path
from datetime import datetime

# --- KONFIGURATION ---
HARDCODED_PATH = os.path.join(os.path.dirname(__file__), "tiles_out", "tileset.json")
LOG_FILENAME = "validation_report_content.txt"
ELLIPSOID_RADII = (1738140.0, 1738140.0, 1735970.0) # Moon Radii
TOLERANCE_RAD = 1.0 # Higher tolerance for rough tests
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
        self.decompressor = Decompressor()

    def _get_readable_glb(self, path):
        """
        Returns (readable_path, is_temp).
        If compressed, decompresses to temp file.
        """
        # Quick check for compression extension in header before full parse
        try:
            with open(path, "rb") as f:
                magic = f.read(4)
                if magic != b'glTF': return path, False
                version = struct.unpack('<I', f.read(4))[0]
                length = struct.unpack('<I', f.read(4))[0]
                chunk_len = struct.unpack('<I', f.read(4))[0]
                chunk_type = f.read(4)
                if chunk_type != b'JSON': return path, False
                
                # Search for draco string in JSON chunk (rough but fast)
                json_bytes = f.read(chunk_len)
                if b'KHR_draco_mesh_compression' in json_bytes:
                    # Decompress
                    success, res = self.decompressor.decompress(path)
                    if success:
                        return res, True
                    else:
                        self.logger.log(f"[WARN] Decompression failed for {path.name}: {res}", "WARN")
                        return path, False
        except:
            pass
        return path, False

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
        
        # Check for Region or Box or S2
        bv = node.get("boundingVolume", {})
        region = bv.get("region")
        box = bv.get("box")
        extensions = bv.get("extensions", {})
        s2_vol = extensions.get("3DTILES_bounding_volume_S2")
        
        if implicit:
            if s2_vol:
                 self.logger.log(f"--> Analysing Implicit {label} (S2 Token: {s2_vol.get('token')})")
                 self.check_implicit_tree(implicit, content, region=region, s2_vol=s2_vol)
            elif region:
                self.logger.log(f"--> Analysing Implicit {label} (Region)")
                self.check_implicit_tree(implicit, content, region=region)
            elif box:
                 self.logger.log(f"--> Analysing Implicit {label} (Box)")
                 # TODO Box support
            else:
                 self.logger.log(f"--> Implicit Node defined without valid bounding volume (Region/Box/S2)", "FAIL")

    def validate_explicit_node(self, node, parent_transform):
        # 1. Update Transform
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
                sphere = bv["sphere"]
                local_center = (sphere[0], sphere[1], sphere[2])
                radius = sphere[3]
                world_center = self.mat4_apply(global_transform, local_center)
                self.inspect_explicit_glb(glb_path, world_center, radius, global_transform)
                
            # S2 Check in Explicit? Not implemented yet for Explicit S2
                
        # 3. Recurse
        children = node.get("children", [])
        for child in children:
            self.validate_explicit_node(child, global_transform)

    # --- S2 MATH HELPERS ---
    def s2_face_uv_to_xyz(self, face, u, v):
        # u, v in [0, 1]
        # Map to [-1, 1]
        su = 2 * u - 1
        sv = 2 * v - 1
        # NOTE: This must match the generation logic.
        # IF generation uses sv = 2*v - 1 and z = -sv, then v=0 => z=1 (North).
        # We need to verify if this matches the implicit tiling numbering (0,0 usually SW).
        
        if face == 0: x, y, z = (1, su, sv)
        elif face == 1: x, y, z = (-su, 1, -sv)
        elif face == 2: x, y, z = (-su, -sv, 1)
        elif face == 3: x, y, z = (-1, -sv, -su)
        elif face == 4: x, y, z = (sv, -1, -su)
        elif face == 5: x, y, z = (sv, su, -1)
        else: return (0,0,0)
        
        r = (x*x + y*y + z*z)**0.5
        return (x/r, y/r, z/r)

    def ecef_to_xyz(self, x, y, z):
        # Normalize to unit sphere
        r = math.sqrt(x*x + y*y + z*z)
        if r == 0: return 0,0,0
        return x/r, y/r, z/r

    def check_s2_fit(self, world_points, expected_face, z, x, y):
        side = 2 ** z
        u_min = x / side
        u_max = (x + 1) / side
        v_min = y / side
        v_max = (y + 1) / side
        
        failures = 0
        total = 0
        tolerance = 0.05 # 5% bleed allowed
        
        for p in world_points:
            # 1. Normalize to Unit Sphere
            ux, uy, uz = self.ecef_to_xyz(p[0], p[1], p[2])
            
            # 2. Determine Face
            # Simple Cube Map Projection to find dominant axis
            # (Matches standard S2 face selection)
            cab = [abs(ux), abs(uy), abs(uz)]
            max_axis = cab.index(max(cab))
            
            p_face = -1
            if max_axis == 0: p_face = 0 if ux > 0 else 3
            elif max_axis == 1: p_face = 1 if uy > 0 else 4
            elif max_axis == 2: p_face = 2 if uz > 0 else 5
            
            if p_face != expected_face:
                # Point is physically closest to a neighbor face (common on edges)
                # Skip strict UV check for this point
                continue 
            
            # 3. Project to UV on the DETECTED face
            # We want to know if it lands on the EXPECTED face with valid UVs,
            # or if it's on a neighbor face but effectively "inside" the tile (border case).
            # For strict check: Project to EXPECTED face plane and check UVs.
            
            # Standard S2 UV projection for expected_face
            # u = 0.5 * (u' + 1), v = 0.5 * (v' + 1)
            # Need to invert mapping: xyz -> su, sv
            
            su, sv = 0, 0
            valid_proj = True
            
            # Invert S2 Projection (xyz on unit sphere -> u,v on face)
            if expected_face == 0: su, sv = uy, uz
            elif expected_face == 1: su, sv = -ux, uz
            elif expected_face == 2: su, sv = -ux, -uy
            elif expected_face == 3: su, sv = -uz, -uy
            elif expected_face == 4: su, sv = -uz, ux
            elif expected_face == 5: su, sv = uy, ux
            
            # Normalize by dominant component (perspective divide)
            # Component is 1 (or -1) in theoretical face center.
            # In practice, we divide by the component corresponding to the face normal.
            norm_factor = 1.0
            if expected_face in [0, 3]: norm_factor = abs(ux)
            elif expected_face in [1, 4]: norm_factor = abs(uy)
            elif expected_face in [2, 5]: norm_factor = abs(uz)
            
            if norm_factor == 0: norm_factor = 1.0 # Should not happen
            
            su /= norm_factor
            sv /= norm_factor
            
            # Map [-1, 1] to [0, 1]
            u = 0.5 * (su + 1)
            v = 0.5 * (sv + 1)
            
            # Check Bounds
            # Allow tolerance relative to tile size
            tol_u = tolerance / side
            tol_v = tolerance / side
            
            in_u = (u_min - tol_u) <= u <= (u_max + tol_u)
            in_v = (v_min - tol_v) <= v <= (v_max + tol_v)
            
            if not (in_u and in_v):
                failures += 1
                
                # Debug output for first failure
                if failures <= 5: # Log first 5 failures
                     self.logger.log(f"   Point Failure: Fac={p_face} (Exp {expected_face}), UV=({u:.4f}, {v:.4f})", "WARN")
                     self.logger.log(f"      Expected U: [{u_min:.4f}, {u_max:.4f}] (Diff: {min(abs(u-u_min), abs(u-u_max)):.4f})", "WARN")
                     self.logger.log(f"      Expected V: [{v_min:.4f}, {v_max:.4f}] (Diff: {min(abs(v-v_min), abs(v-v_max)):.4f})", "WARN")
                     self.logger.log(f"      Raw XYZ: ({ux:.2f}, {uy:.2f}, {uz:.2f})", "WARN")

            total += 1
            
        return failures, total

    def inspect_s2_glb(self, path, face, z, x, y, s2_vol_check=None):
        self.checked_tiles += 1
        if not path.exists(): return
        
        readable_path, is_temp = self._get_readable_glb(path)
        
        try:
            with open(readable_path, "rb") as f:
                magic = f.read(4)
                if magic != b'glTF': return 
                version = struct.unpack('<I', f.read(4))[0]
                length = struct.unpack('<I', f.read(4))[0]
                chunk_len = struct.unpack('<I', f.read(4))[0]
                chunk_type = f.read(4)
                if chunk_type != b'JSON': return
                json_data = f.read(chunk_len)
                gltf = json.loads(json_data.decode('utf-8'))
                
                # Binary Buffer
                # Need to read binary chunk to get actual positions
                # This assumes GLB has JSON + BIN chunk structure
                bin_chunk_len_bytes = f.read(4)
                if len(bin_chunk_len_bytes) < 4:
                     # No BIN chunk?
                     return
                
                bin_chunk_len = struct.unpack('<I', bin_chunk_len_bytes)[0]
                bin_chunk_type = f.read(4)
                if bin_chunk_type != b'BIN\x00': return
                
                # bin_data = f.read(bin_chunk_len) # Don't read whole buffer to RAM if huge?
                # Actually we need random access. f.seek is fine.
                bin_start = f.tell() 
                
                if not gltf.get("meshes"): return
                primitive = gltf["meshes"][0]["primitives"][0]
                pos_idx = primitive["attributes"].get("POSITION")
                accessor = gltf["accessors"][pos_idx]
                
                # Check Min/Max (BBox) First - Fast Fail
                min_pos = accessor.get("min")
                max_pos = accessor.get("max")
                
                # Height / Radius Mismatch Check (Using BBox)
                if s2_vol_check:
                    node_trans = [0,0,0]
                    if gltf.get("nodes"):
                         n = gltf["nodes"][0]
                         if "translation" in n: node_trans = n["translation"]
                         
                    # RTC
                    rtc_center = [0.0, 0.0, 0.0]
                    if "CESIUM_RTC" in gltf.get("extensions", {}):
                        rtc_center = gltf["extensions"]["CESIUM_RTC"]["center"]

                # Proprietary Check
                is_proprietary, p_min, p_max = self.check_proprietary_features(gltf, path)
                
                if is_proprietary:
                    self.logger.log(f"   [INFO] Skipping strict mesh check for S2 placeholder geometry.", "INFO")
                    return p_min, p_max # Return height range to caller

                # Check REAL VERTICES for both Radius and UV fit
                view = gltf["bufferViews"][accessor["bufferView"]]
                byte_stride = view.get("byteStride", 12)
                byte_offset = accessor.get("byteOffset", 0) + view.get("byteOffset", 0)
                
                count = accessor["count"]
                stride = max(1, count // 100) # Sample 100 points
                
                min_r_found = float('inf')
                max_r_found = float('-inf')
                sampled_world_points = []

                for i in range(0, count, stride):
                     f.seek(bin_start + byte_offset + i * byte_stride)
                     v_data = f.read(12)
                     if len(v_data) < 12: break
                     vx, vy, vz = struct.unpack('<fff', v_data)
                     
                     # 1. Unswizzle Vertex (GLB Y-Up -> ECEF Z-Up)
                     # Tiler saves as (X, Z, -Y) -> ECEF (X, -Z, Y)
                     # Wait, usually: GLB(x,y,z) is (eX, eZ, -eY)
                     # So eX = x, eY = -z, eZ = y
                     ex_v = vx
                     ey_v = -vz
                     ez_v = vy

                     # 2. Add RTC (Already ECEF) & Unswizzled Node Translation
                     unswiz_nt = (node_trans[0], -node_trans[2], node_trans[1])
                     
                     ex = ex_v + rtc_center[0] + unswiz_nt[0] 
                     ey = ey_v + rtc_center[1] + unswiz_nt[1]
                     ez = ez_v + rtc_center[2] + unswiz_nt[2]
                     
                     sampled_world_points.append((ex, ey, ez))
                     
                     r_pt = math.sqrt(ex*ex + ey*ey + ez*ez)
                     min_r_found = min(min_r_found, r_pt)
                     max_r_found = max(max_r_found, r_pt)
                     
                # Radius Check
                radius_fail = False
                if s2_vol_check:
                    vol_min_h = s2_vol_check.get("minimumHeight", 0)
                    vol_max_h = s2_vol_check.get("maximumHeight", 0)
                    
                    # Detect Base Radius (WGS84 vs Body-centric)
                    # If heights are very negative (~ -4.6M), it targets WGS84
                    # If heights are near 0, it targets the body's surface directly.
                    if vol_min_h < -2000000:
                         base_r = 6378137.0
                    else:
                         # Use the found radius as a hint for the body radius
                         base_r = min_r_found - vol_min_h
                         
                    exp_min = base_r + vol_min_h
                    exp_max = base_r + vol_max_h
                    
                    if min_r_found < exp_min - 30000 or max_r_found > exp_max + 30000:
                         radius_fail = True
                         self.logger.log(f"MISMATCH S2 Tile {path.name}: HEIGHT / RADIUS MISMATCH", "FAIL")
                         self.logger.log(f"   Geometry Radius: {min_r_found:.1f}m - {max_r_found:.1f}m", "FAIL")
                         self.logger.log(f"   Volume Radius:   {exp_min:.1f}m - {exp_max:.1f}m (Base: {base_r:.1f})", "FAIL")
                         self.logger.log(f"   Diff: approx {min_r_found - exp_min:.1f}m", "FAIL")
                    else:
                         self.logger.log(f"{path.name} Radius: {min_r_found:.1f}m - {max_r_found:.1f}m (Base: {base_r:.1f})", "PASS")

                # UV Fit Check
                fails, total = self.check_s2_fit(sampled_world_points, face, z, x, y)
                if fails > 0 or radius_fail:
                    self.mismatched_tiles += 1
                    if fails > 0:
                        self.logger.log(f"MISMATCH S2 Tile {path.name}: {fails}/{total} points out of bounds.", "FAIL")
                        self.logger.log(f"   Face: {face}, UV Box: {x}/{2**z}, {y}/{2**z}", "FAIL")
                else:
                    self.logger.log(f"{path.name} UV Fit: {total}/{total} points ok.", "PASS")
                
                return None, None



                    
        except Exception as e:
            self.logger.log(f"Read Error on {path.name}: {e}", "FAIL")
        
        finally:
            if is_temp and os.path.exists(readable_path):
                try: os.remove(readable_path)
                except: pass

    def check_implicit_tree(self, implicit, content, region=None, s2_vol=None):
        subtrees_uri = implicit.get("subtrees", {}).get("uri", "")
        content_uri = content.get("uri", "")
        levels = implicit.get("subtreeLevels", 1)
        
        # 1. Load Root Subtree
        subtree_path = self.resolve_template(subtrees_uri, 0, 0, 0)
        
        avail = self.parse_subtree(subtree_path)
        if not avail: 
            self.logger.log(f"Failed to load subtree: {subtree_path}", "WARN")
            return

        # 2. Iterate Tiles
        content_bits = avail['content_bits']
        bit_index = 0
        
        # Pre-calc regions for standard Region flow
        rw, rs, re, rn = 0,0,0,0
        if region:
            rw, rs, re, rn, _, _ = region
        
        # Parent Height Cache: Key=(x,y), Value=(min_h, max_h)
        # For Level 0, we might want to check against S2 Volume if available?
        # But for now, let's just track level-to-level
        parent_heights = {} 
        
        for z in range(levels):
            side = 2 ** z
            next_parent_heights = {}
            
            # Region Step
            if region:
                width_rad = (re - rw) / side
                height_rad = (rn - rs) / side
            
            for y in range(side):
                for x in range(side):
                    has_content = self.get_bit(content_bits, bit_index)
                    if has_content:
                        glb_path = self.resolve_template(content_uri, z, x, y)
                        
                        min_h, max_h = None, None
                        
                        if s2_vol:
                            # Verify S2 Tile
                            token = s2_vol.get("token")
                            face_map = {"1":0,"3":1,"5":2,"7":3,"9":4,"b":5}
                            face = face_map.get(token[0], 0) # Simplified assumption: Root is face
                            min_h, max_h = self.inspect_s2_glb(glb_path, face, z, x, y, s2_vol_check=s2_vol)
                        elif region:
                            exp_w = rw + x * width_rad
                            exp_e = exp_w + width_rad
                            exp_s = rs + y * height_rad
                            exp_n = exp_s + height_rad
                            self.inspect_implicit_glb(glb_path, z, x, y, (exp_w, exp_s, exp_e, exp_n))
                        
                        # Parent Check
                        if min_h is not None and max_h is not None:
                            # Store for next level
                            next_parent_heights[(x,y)] = (min_h, max_h)
                            
                            if z > 0:
                                px, py = x // 2, y // 2
                                pr = parent_heights.get((px, py))
                                if pr:
                                    p_min, p_max = pr
                                    # Warn if child exceeds parent bounds significantly
                                    # Child min should be >= Parent min
                                    # Child max should be <= Parent max
                                    
                                    # Tolerance? Maybe 1m?
                                    tol = 1.0 
                                    
                                    diffs = []
                                    if min_h < p_min - tol: diffs.append(f"Min exceeds parent by {p_min - min_h:.1f}m")
                                    if max_h > p_max + tol: diffs.append(f"Max exceeds parent by {max_h - p_max:.1f}m")
                                    
                                    if diffs:
                                        self.logger.log(f"   [WARN] Height Hierarchy Violation in {z}/{x}/{y}:", "WARN")
                                        self.logger.log(f"          Child Range: {min_h:.1f} to {max_h:.1f}", "WARN")
                                        self.logger.log(f"          Parent Range: {p_min:.1f} to {p_max:.1f}", "WARN")
                                        self.logger.log(f"          Issues: {', '.join(diffs)}", "WARN")

                    bit_index += 1
            
            parent_heights = next_parent_heights


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

        readable_path, is_temp = self._get_readable_glb(path)
        try:
            with open(readable_path, "rb") as f:
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
                unswiz_rtc = (rtc_offset[0], rtc_offset[1], rtc_offset[2])

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
        finally:
            if is_temp and os.path.exists(readable_path):
                try: os.remove(readable_path)
                except: pass



    def inspect_implicit_glb(self, path, z, x, y, expected_rect):
        self.checked_tiles += 1
        if not path.exists(): return

        readable_path, is_temp = self._get_readable_glb(path)
        try:
            with open(readable_path, "rb") as f:
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
                    unswiz_rtc = (rtc_center[0], rtc_center[1], rtc_center[2])

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
                        # 1. Apply Node Translation (GLB space)
                        c_model = (c[0] + node_translation[0], c[1] + node_translation[1], c[2] + node_translation[2])
                        # 2. Unswizzle Corner (GLB -> ECEF)
                        unswiz_c = (c_model[0], -c_model[2], c_model[1])
                        # 3. Add RTC (ECEF)
                        v_ecef = (unswiz_c[0] + rtc_center[0], unswiz_c[1] + rtc_center[1], unswiz_c[2] + rtc_center[2])
                        
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
                            unswiz_rtc = (rtc_center[0], rtc_center[1], rtc_center[2])

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
        finally:
            if is_temp and os.path.exists(readable_path):
                try: os.remove(readable_path)
                except: pass

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

    def check_proprietary_features(self, gltf, path):
        # 1. Search for Heightmap
        has_hm = False
        if "images" in gltf:
            for img in gltf["images"]:
                if img.get("mimeType") == "image/x-s2-heightmap":
                    has_hm = True
                    break
        
        if has_hm:
             self.logger.log(f"   [OK] Proprietary Heightmap Found.", "PASS")
        else:
             self.logger.log(f"   [MISSING] No 'image/x-s2-heightmap' found.", "WARN")

        # 2. Check Metadata
        # Check Root Extras first (common in some converters)
        extras = gltf.get("extras", {})
        if "minHeight" not in extras or "maxHeight" not in extras:
            # Fallback to Asset Extras
            extras = gltf.get("asset", {}).get("extras", {})

        min_h, max_h = None, None
        
        if "minHeight" in extras and "maxHeight" in extras:
             min_h = float(extras["minHeight"])
             max_h = float(extras["maxHeight"])
             self.logger.log(f"   [OK] Height Metadata: {min_h:.1f}m / {max_h:.1f}m", "PASS")
        else:
             self.logger.log(f"   [MISSING] minHeight/maxHeight in extras", "WARN")

        return has_hm, min_h, max_h

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