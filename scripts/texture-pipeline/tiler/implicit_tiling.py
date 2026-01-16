"""
Implicit Tiling module for Planet Tiler.
Contains the BinarySubtreeEncoder class for generating 3D Tiles 1.1 subtree files.
"""

import json
import struct


class BinarySubtreeEncoder:
    """Encodes binary subtree files for 3D Tiles 1.1 Implicit Tiling."""
    
    def __init__(self):
        pass

    @staticmethod
    def morton_index(level, x, y):
        """Standard Morton code (Z-order curve)."""
        def part1by1(n):
            n &= 0x0000ffff
            n = (n | (n << 8)) & 0x00ff00ff
            n = (n | (n << 4)) & 0x0f0f0f0f
            n = (n | (n << 2)) & 0x33333333
            n = (n | (n << 1)) & 0x55555555
            return n
            
        return (part1by1(y) << 1) | part1by1(x)

    @staticmethod
    def pack_bits(bool_list):
        """Packs a list of booleans into a bytearray (little-endian)"""
        n = len(bool_list)
        n_bytes = (n + 7) // 8
        b = bytearray(n_bytes)
        for i, val in enumerate(bool_list):
            if val:
                b[i // 8] |= (1 << (i % 8))
        return b

    def generate_subtree(self, root_z, root_x, root_y, height, all_meta, has_child_subtrees=False, debug=False, bake_metadata=False):
        """
        Generates binary subtree file content.
        """
        avail_arr_size = (4**height - 1) // 3
        
        tile_bits = [0] * avail_arr_size
        content_bits = [0] * avail_arr_size
        
        # Metadata storage
        min_h_list = [0.0] * avail_arr_size
        max_h_list = [0.0] * avail_arr_size
        occ_p_list = [0.0, 0.0, 0.0] * avail_arr_size # Flattened for easier packing
        
        # Check if any tile in all_meta has metadata (if flag is set)
        has_meta = False
        if not bake_metadata:
            # Skip metadata logic entirely if flag is false
            pass
        else:
            # We will set has_meta to true if we find at least one tile with metadata during the loop
            pass
        
        for rel_z in range(height):
            curr_z = root_z + rel_z
            level_offset = (4**rel_z - 1) // 3
            origin_x, origin_y = root_x * (2 ** rel_z), root_y * (2 ** rel_z)
            side = 2 ** rel_z
            
            for ly in range(side):
                for lx in range(side):
                    gx, gy = origin_x + lx, origin_y + ly
                    m_idx = self.morton_index(rel_z, lx, ly)
                    idx = level_offset + m_idx
                    
                    key = f"{gx}_{gy}"
                    if curr_z in all_meta and key in all_meta[curr_z]:
                        tile_bits[idx] = 1
                        content_bits[idx] = 1
                        
                        if bake_metadata:
                            meta = all_meta[curr_z][key]
                            if "minHeight" in meta:
                                has_meta = True
                                min_h_list[idx] = meta["minHeight"]
                                max_h_list[idx] = meta["maxHeight"]
                                p = meta.get("occPoint", [0, 0, 0])
                                occ_p_list[idx*3] = p[0]
                                occ_p_list[idx*3+1] = p[1]
                                occ_p_list[idx*3+2] = p[2]
            
        tile_buffer = self.pack_bits(tile_bits)
        content_buffer = self.pack_bits(content_bits)
        
        pad8 = lambda b: b + b'\x00' * ((8 - len(b) % 8) % 8)
        
        tile_buffer_len = len(tile_buffer)
        content_buffer_len = len(content_buffer)
        tile_buffer_padded = pad8(tile_buffer)
        
        # Initial binary body: Availability bitstreams
        bin_body = tile_buffer_padded + pad8(content_buffer)
        
        # Buffer Views
        buffer_views = [
            { "buffer": 0, "byteOffset": 0, "byteLength": tile_buffer_len },
            { "buffer": 0, "byteOffset": len(tile_buffer_padded), "byteLength": content_buffer_len }
        ]
        
        # Optional Property Tables
        property_tables = []
        if has_meta:
            # Pack metadata
            min_h_bin = struct.pack(f'<{len(min_h_list)}f', *min_h_list)
            max_h_bin = struct.pack(f'<{len(max_h_list)}f', *max_h_list)
            occ_p_bin = struct.pack(f'<{len(occ_p_list)}f', *occ_p_list)
            
            # Offsets in bin_body
            off_min_h = len(bin_body)
            bin_body += pad8(min_h_bin)
            
            off_max_h = len(bin_body)
            bin_body += pad8(max_h_bin)
            
            off_occ_p = len(bin_body)
            bin_body += pad8(occ_p_bin)
            
            # Add to bufferViews
            v_idx_min = len(buffer_views)
            buffer_views.append({ "buffer": 0, "byteOffset": off_min_h, "byteLength": len(min_h_bin) })
            
            v_idx_max = len(buffer_views)
            buffer_views.append({ "buffer": 0, "byteOffset": off_max_h, "byteLength": len(max_h_bin) })
            
            v_idx_occ = len(buffer_views)
            buffer_views.append({ "buffer": 0, "byteOffset": off_occ_p, "byteLength": len(occ_p_bin) })
            
            property_tables.append({
                "class": "tileMetadata",
                "count": avail_arr_size,
                "properties": {
                    "minHeight": { "bufferView": v_idx_min },
                    "maxHeight": { "bufferView": v_idx_max },
                    "occPoint": { "bufferView": v_idx_occ }
                }
            })

        header = {
            "buffers": [ { "byteLength": len(bin_body) } ],
            "bufferViews": buffer_views,
            "tileAvailability": { "bitstream": 0, "availableCount": sum(tile_bits) },
            "contentAvailability": [ { "bitstream": 1, "availableCount": sum(content_bits) } ],
            "childSubtreeAvailability": { "constant": 1 if has_child_subtrees else 0 }
        }
        
        if has_meta:
            header["propertyTables"] = property_tables
            header["tileMetadata"] = {
                "class": "tileMetadata",
                "propertyTable": 0
            }
        
        json_str = json.dumps(header, separators=(',', ':'))
        json_bytes = json_str.encode('utf-8')
        
        # JSON padding to 8-byte boundary
        padding = (8 - (len(json_bytes) % 8)) % 8
        json_bytes += b' ' * padding
        
        magic = b'subt'
        version = 1
        json_len = len(json_bytes)
        bin_len = len(bin_body)
        
        header_bin = struct.pack('<4sIQQ', magic, version, json_len, bin_len)
        return header_bin + json_bytes + bin_body
