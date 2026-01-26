import os
import sys
import json
import struct
import base64
import math

def inspect_tile(tiles_out, face, z, x, y):
    # 1. Locate File
    # Try multiple naming conventions if needed, but standard is content/{face}/{z}_{x}_{y}.glb
    path = os.path.join(tiles_out, "content", str(face), f"{z}_{x}_{y}.glb")
    
    result = {
        "success": False,
        "path": path,
        "exists": False,
        "meta": {},
        "images": []
    }

    if not os.path.exists(path):
        result["error"] = "File not found"
        return result
    
    result["exists"] = True
    result["size"] = os.path.getsize(path)

    try:
        with open(path, "rb") as f:
            # GLB Header
            magic = f.read(4)
            if magic != b'glTF':
                result["error"] = "Not a valid GLB file (Magic mismatch)"
                return result
            
            version = struct.unpack('<I', f.read(4))[0]
            length = struct.unpack('<I', f.read(4))[0]
            
            result["meta"]["glTF Version"] = version
            result["meta"]["Total Size"] = length

            # Chunk 0: JSON
            chunk_len = struct.unpack('<I', f.read(4))[0]
            chunk_type = f.read(4)
            if chunk_type != b'JSON':
                result["error"] = "First chunk is not JSON"
                return result
            
            json_data = f.read(chunk_len)
            gltf = json.loads(json_data.decode('utf-8'))
            
            # Helper to get buffer data
            # We assume usually 1 binary chunk (BIN) follows
            bin_start = 12 + 8 + chunk_len
            f.seek(bin_start)
            
            # Check for BIN chunk
            has_bin = False
            bin_data = b""
            
            # There might be padding or multiple chunks, but standard GLB has 1 BIN.
            # We need to be careful not to read past EOF if file is truncated
            if bin_start < length:
                chunk1_len = struct.unpack('<I', f.read(4))[0]
                chunk1_type = f.read(4)
                if chunk1_type == b'BIN\x00':
                    has_bin = True
                    bin_data = f.read(chunk1_len)

            # Metadata Extraction
            if "asset" in gltf:
                result["meta"]["generator"] = gltf["asset"].get("generator", "Unknown")
            
            # Extensions
            if "extensionsUsed" in gltf:
                result["meta"]["extensions"] = gltf["extensionsUsed"]
            
            # Meshes
            if "meshes" in gltf:
                result["meta"]["mesh_count"] = len(gltf["meshes"])
                total_verts = 0
                for m in gltf["meshes"]:
                    for p in m["primitives"]:
                         # Just a rough heuristic if we don't parse accessors fully
                         if "attributes" in p and "POSITION" in p["attributes"]:
                             acc_idx = p["attributes"]["POSITION"]
                             if "accessors" in gltf and acc_idx < len(gltf["accessors"]):
                                 total_verts += gltf["accessors"][acc_idx].get("count", 0)
                result["meta"]["total_vertices"] = total_verts

            # Textures & Images
            if "images" in gltf:
                result["meta"]["image_count"] = len(gltf["images"])
                
                for idx, img in enumerate(gltf["images"]):
                    img_info = {
                        "index": idx,
                        "name": img.get("name", f"Image {idx}"),
                        "mimeType": img.get("mimeType", "image/png"),
                        "bufferView": img.get("bufferView"),
                        "uri": img.get("uri") # If not embedded
                    }

                    # KTX2 Handling
                    if "extensions" in img and "KHR_texture_basisu" in img["extensions"]:
                         ktx = img["extensions"]["KHR_texture_basisu"]
                         img_info["mimeType"] = "image/ktx2"
                         img_info["bufferView"] = ktx.get("source", img.get("bufferView"))

                    # Extract Data
                    if has_bin and img_info["bufferView"] is not None:
                        bv_idx = img_info["bufferView"]
                        if bv_idx < len(gltf["bufferViews"]):
                            bv = gltf["bufferViews"][bv_idx]
                            byte_offset = bv.get("byteOffset", 0)
                            byte_length = bv.get("byteLength", 0)
                            
                            # Extract bytes from BIN chunk
                            # Note: bin_data starts at byte 0 of the BIN chunk content
                            # bufferView byteOffset is relative to the buffer (which is usually the BIN chunk)
                            img_bytes = bin_data[byte_offset : byte_offset + byte_length]
                            
                            # Encode Base64
                            b64 = base64.b64encode(img_bytes).decode('ascii')
                            img_info["data"] = b64
                            img_info["size"] = len(img_bytes)
                    
                    result["images"].append(img_info)

            # Property Tables (Metadata)
            if "extensions" in gltf and "EXT_structural_metadata" in gltf["extensions"]:
                 meta_ext = gltf["extensions"]["EXT_structural_metadata"]
                 if "propertyTables" in meta_ext:
                     result["meta"]["property_tables"] = len(meta_ext["propertyTables"])
                     # Could extract min/max height here if we want to parse binary property tables
                     # But that requires decoding the binary columns (float32/uint16).
                     # For now just acknowledging existence is good.

    except Exception as e:
        result["error"] = f"Exception during parsing: {str(e)}"
        import traceback
        traceback.print_exc()

    result["success"] = True
    return result

if __name__ == "__main__":
    if len(sys.argv) < 6:
        print(json.dumps({"error": "Usage: inspect_tile.py <tiles_out> <face> <z> <x> <y>"}))
    else:
        # Args: tiles_out face z x y
        res = inspect_tile(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5])
        print(json.dumps(res, indent=2))
