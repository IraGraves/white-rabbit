import os
import sys
import json
import struct
import base64
import math

def get_image_dims(data, mime_type):
    try:
        if mime_type == "image/png":
            w, h = struct.unpack(">II", data[16:24])
            return w, h
        elif mime_type == "image/jpeg":
            # Scan for SOF0 (0xC0), SOF1 (0xC1), SOF2 (0xC2)
            i = 0
            while i < len(data):
                if data[i] == 0xFF:
                    i += 1
                    if i >= len(data): break
                    marker = data[i]
                    i += 1
                    if marker in [0xC0, 0xC1, 0xC2]:
                        h, w = struct.unpack(">HH", data[i+3:i+7])
                        return w, h
                    else:
                        # Skip segment
                        if i+2 > len(data): break
                        length = struct.unpack(">H", data[i:i+2])[0]
                        i += length
                else:
                    i += 1
        elif mime_type == "image/ktx2":
            # KTX2 Header: 
            # Identifier: 12 bytes
            # vkFormat: 4 bytes
            # typeSize: 4 bytes
            # pixelWidth: 4 bytes
            # pixelHeight: 4 bytes
            if len(data) > 32 and data[0:12] == b'\xABKTX 20\xBB\r\n\x1A\n':
                w = struct.unpack("<I", data[20:24])[0]
                h = struct.unpack("<I", data[24:28])[0]
                return w, h
    except Exception:
        pass
    return None, None

def inspect_tile(path):
    result = {
        "success": False,
        "path": path,
        "exists": False,
        "meta": {},
        "images": []
    }

    if not os.path.exists(path):
        result["error"] = f"File not found: {path}"
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
                for m_idx, m in enumerate(gltf["meshes"]):
                    for p_idx, p in enumerate(m["primitives"]):
                         # Extract Extras from Primitive (often contains target error, errors, etc.)
                         if "extras" in p:
                             for pk, pv in p["extras"].items():
                                 result["meta"][f"Mesh{m_idx}_Prim{p_idx}_{pk}"] = pv

                         # Geometry Bounds (POSITION Min/Max)
                         if "attributes" in p and "POSITION" in p["attributes"]:
                             acc_idx = p["attributes"]["POSITION"]
                             if "accessors" in gltf and acc_idx < len(gltf["accessors"]):
                                 acc = gltf["accessors"][acc_idx]
                                 total_verts += acc.get("count", 0)
                                 
                                 if "min" in acc:
                                     result["meta"][f"Mesh{m_idx}_Pos_Min"] = str(acc["min"])
                                 if "max" in acc:
                                     result["meta"][f"Mesh{m_idx}_Pos_Max"] = str(acc["max"])
                                     
                                 # Calculate Geometric Height Range
                                 if "min" in acc and "max" in acc and len(acc["max"]) >= 3:
                                     min_bg = acc["min"][1] # Y is up in GLTF usually, but could be Z? standard is Y-up.
                                     # Actually, let's just dump the raw vectors
                                     pass
                result["meta"]["total_vertices"] = total_verts

            # Textures (Actual mappings)
            if "textures" in gltf:
                result["meta"]["texture_count"] = len(gltf["textures"])
                result["textures"] = []
                for idx, tex in enumerate(gltf["textures"]):
                    tex_info = {
                        "index": idx,
                        "raw": tex, # Dump everything
                        "name": tex.get("name", f"Texture {idx}"),
                        "source": tex.get("source"),
                        "sampler": tex.get("sampler")
                    }
                    if "extensions" in tex:
                         tex_info["extensions"] = list(tex["extensions"].keys())
                         if "KHR_texture_basisu" in tex["extensions"]:
                             tex_info["basisu_source"] = tex["extensions"]["KHR_texture_basisu"].get("source")
                    
                    result["textures"].append(tex_info)

            # Images (Raw Data)
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
                            
                            # Get Dimensions
                            w, h = get_image_dims(img_bytes, img_info["mimeType"])
                            if w is not None:
                                img_info["width"] = w
                                img_info["height"] = h
                            
                            # Encode Base64
                            b64 = base64.b64encode(img_bytes).decode('ascii')
                            img_info["data"] = b64
                            img_info["size"] = len(img_bytes)
                    
                    result["images"].append(img_info)

            # Extras (Metadata)
            if "extras" in gltf:
                extras = gltf["extras"]
                for k, v in extras.items():
                     # Copy simple types
                     if isinstance(v, (str, int, float, bool)):
                         result["meta"][k] = v

            # Deep Inspector for Heightmap (Image Based or Orphaned Buffer)
            hm_image_idx = None
            hm_buffer_view_idx = None
            
            # 1. Try Standard Image Method
            if "images" in gltf:
                for idx, img in enumerate(gltf["images"]):
                    if img.get("mimeType") == "image/x-s2-heightmap":
                        hm_image_idx = idx
                        result["meta"]["HM Method"] = f"Image #{idx} (x-s2-heightmap)"
                        break
            
            # 2. Try Heuristic Buffer Search (if no image found)
            if hm_image_idx is None and "bufferViews" in gltf:
                # Expected size for 256 tile + 2px padding (259x259) * 2 bytes = 134162 bytes
                # Or 257x257 * 2 = 132098 bytes
                # Or 256x256 * 2 = 131072 bytes
                candidates = [134162, 132098, 131072]
                
                for i, bv in enumerate(gltf["bufferViews"]):
                    length = bv.get("byteLength", 0)
                    if length in candidates:
                         hm_buffer_view_idx = i
                         result["meta"]["HM Method"] = f"Heuristic (Buffer #{i}, Size={length})"
                         break
                    # Also check for exact match with 'minHeight' extras if present to validate?
                    # For now, size match is strong indicator in this specific pipeline.

            # Decode if found
            target_bv_idx = None
            if hm_image_idx is not None:
                target_bv_idx = gltf["images"][hm_image_idx].get("bufferView")
            elif hm_buffer_view_idx is not None:
                target_bv_idx = hm_buffer_view_idx
                
            if target_bv_idx is not None and target_bv_idx < len(gltf["bufferViews"]):
                 bv = gltf["bufferViews"][target_bv_idx]
                 byte_offset = bv.get("byteOffset", 0)
                 byte_length = bv.get("byteLength", 0)
                 
                 if has_bin and byte_offset + byte_length <= len(bin_data):
                      hf_bytes = bin_data[byte_offset : byte_offset + byte_length]
                      pixel_count = byte_length // 2
                      
                      if pixel_count > 0:
                         try:
                             values = struct.unpack(f'<{pixel_count}H', hf_bytes)
                             result["meta"]["HM Count"] = pixel_count
                             dim = int(math.sqrt(pixel_count))
                             result["meta"]["HM Size"] = f"{dim} x {dim}"
                             result["meta"]["HM Min"] = min(values)
                             result["meta"]["HM Max"] = max(values)
                             # Calculate theoretical height range if we have minHeight/maxHeight in extras
                             if "minHeight" in result["meta"] and "maxHeight" in result["meta"]:
                                 h0 = result["meta"]["minHeight"]
                                 h1 = result["meta"]["maxHeight"]
                                 result["meta"]["HM Range (m)"] = f"{h0:.2f} to {h1:.2f}"
                             
                             result["meta"]["HM Unique"] = len(set(values[:2000])) # Sample for speed
                         except Exception as e:
                             result["meta"]["HM Error"] = f"Decode Failed: {e}"
                 else:
                     result["meta"]["HM Error"] = "Buffer Read Error (Size/Bin)"
            else:
                 # Legacy Check
                 if "extras" in gltf and "height_buffer_view" in extras:
                      result["meta"]["HM Method"] = "Legacy (Extras)"
                      # ... logic omitted ... -> Actually, let's just leave this fallback logic for really old tiles 
                      # but usually the heuristic above catches it.
                      pass

            # Debug: List ALL Buffer Views to help diagnose index mismatch
            if "bufferViews" in gltf:
                views_info = []
                for i, bv in enumerate(gltf["bufferViews"]):
                    info = f"#{i}: len={bv.get('byteLength')}"
                    if "name" in bv:
                        info += f", name='{bv['name']}'"
                    views_info.append(info)
                result["meta"]["Debug_AllViews"] = "; ".join(views_info)

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
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: inspect_tile.py <path_to_tile.glb>"}))
    else:
        # Args: path_to_tile
        res = inspect_tile(sys.argv[1])
        print(json.dumps(res, indent=2))
