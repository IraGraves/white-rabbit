import struct
import json
import math
import os
import sys

def inspect(path):
    print(f"Inspecting: {path}")
    if not os.path.exists(path):
        print("File not found.")
        return

    with open(path, "rb") as f:
        magic = f.read(4)
        if magic != b'glTF':
            print("Not a GLTF.")
            return
        version = struct.unpack('<I', f.read(4))[0]
        length = struct.unpack('<I', f.read(4))[0]
        json_len = struct.unpack('<I', f.read(4))[0]
        json_type = f.read(4)
        json_data = f.read(json_len)
        gltf = json.loads(json_data.decode('utf-8'))

        print(f"GLTF Version: {version}")
        
        # Check Nodes for Translation
        translation = [0,0,0]
        if "nodes" in gltf:
            n = gltf["nodes"][0]
            if "translation" in n:
                translation = n["translation"]
                print(f"Node Translation (GLTF): {translation}")
            else:
                print("No Node Translation found.")
        
        rtc = [0,0,0]
        if "extensions" in gltf and "CESIUM_RTC" in gltf["extensions"]:
             rtc = gltf["extensions"]["CESIUM_RTC"]["center"]
             print(f"RTC Center Found: {rtc}")
             # Apply RTC to translation for global bounds check
             translation = [translation[0]+rtc[0], translation[1]+rtc[1], translation[2]+rtc[2]]
        
        if not gltf.get("meshes"):
            print("No meshes found.")
            return

        primitive = gltf["meshes"][0]["primitives"][0]
        pos_idx = primitive["attributes"].get("POSITION")
        if pos_idx is None:
            print("No POSITION attribute found.")
            return
            
        print(f"POSITION Accessor Index: {pos_idx}")
        acc = gltf["accessors"][pos_idx]
        print(f"Accessor Keys: {list(acc.keys())}")
        
        if "min" not in acc:
            print("Accessor missing min/max.")
            return

        min_pos = acc["min"]
        max_pos = acc["max"]
        print(f"Mesh Min (Local): {min_pos}")
        print(f"Mesh Max (Local): {max_pos}")
        
        # Reconstruct Global Bounds
        g_min = [min_pos[0]+translation[0], min_pos[1]+translation[1], min_pos[2]+translation[2]]
        g_max = [max_pos[0]+translation[0], max_pos[1]+translation[1], max_pos[2]+translation[2]]
        
        print(f"Global Min (GLTF): {g_min}")
        print(f"Global Max (GLTF): {g_max}")
        
        # Unswizzle to ECEF
        # ECEF X = G_X
        # ECEF Z = G_Y
        # ECEF Y = -G_Z
        
        ecef_min = [g_min[0], -g_max[2], g_min[1]]
        ecef_max = [g_max[0], -g_min[2], g_max[1]]
        
        print(f"ECEF Bound Min: {ecef_min}")
        print(f"ECEF Bound Max: {ecef_max}")
        
        # Calculate Lat/Lon of Center
        cx = (ecef_min[0] + ecef_max[0]) / 2
        cy = (ecef_min[1] + ecef_max[1]) / 2
        cz = (ecef_min[2] + ecef_max[2]) / 2
        
        lon = math.atan2(cy, cx)
        lat = math.atan2(cz, math.sqrt(cx*cx + cy*cy))
        
        print(f"Center LLA: Lat {math.degrees(lat):.4f}, Lon {math.degrees(lon):.4f}")

if __name__ == "__main__":
    # Example usage:
    # inspect(r"tiles_out\west\1\0_0.glb")
    if len(sys.argv) > 1:
        inspect(sys.argv[1])
    else:
        print("Usage: python inspect_glb.py <path_to_glb>")
