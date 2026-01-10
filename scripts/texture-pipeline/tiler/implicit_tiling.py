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

    def generate_subtree(self, root_z, root_x, root_y, height, all_meta, has_child_subtrees=False, debug=False):
        """
        Generates binary subtree file content.
        root_z, root_x, root_y: Global coordinates of the subtree root
        height: Number of levels in this subtree (e.g. 5)
        has_child_subtrees: If True, leaf nodes may have child subtrees at the next level
        """
        # Calculate buffer sizes
        # Sum of 4^i for i=0 to height-1
        avail_arr_size = (4**height - 1) // 3
        
        tile_bits = [0] * avail_arr_size
        content_bits = [0] * avail_arr_size
        
        if debug:
            print(f"[DEBUG] Generating subtree for root ({root_z},{root_x},{root_y}), height={height}, total_slots={avail_arr_size}")
        
        for rel_z in range(height):
            curr_z = root_z + rel_z
            level_offset = (4**rel_z - 1) // 3
            
            # Origin of this level relative to the subtree root
            origin_x = root_x * (2 ** rel_z)
            origin_y = root_y * (2 ** rel_z)
            
            side = 2 ** rel_z
            level_found = 0
            for ly in range(side):
                for lx in range(side):
                    gx, gy = origin_x + lx, origin_y + ly
                    
                    # Morton index is based on LOCAL coordinates within the level
                    m_idx = self.morton_index(rel_z, lx, ly)
                    idx = level_offset + m_idx
                    
                    key = f"{gx}_{gy}"
                    if curr_z in all_meta and key in all_meta[curr_z]:
                        tile_bits[idx] = 1
                        content_bits[idx] = 1
                        level_found += 1
            
            if debug:
                print(f"[DEBUG]   Level {rel_z} (global z={curr_z}): origin=({origin_x},{origin_y}), side={side}, found={level_found}/{side*side} tiles")
                        
        tile_buffer = self.pack_bits(tile_bits)
        content_buffer = self.pack_bits(content_bits)
        
        # 8-byte alignment padding (required by 3D Tiles Implicit Tiling spec)
        pad8 = lambda b: b + b'\x00' * ((8 - len(b) % 8) % 8)
        
        # Store original lengths for JSON (byteLength is unpadded)
        tile_buffer_len = len(tile_buffer)
        content_buffer_len = len(content_buffer)
        
        # Pad tile_buffer to 8-byte boundary before appending content_buffer
        tile_buffer_padded = pad8(tile_buffer)
        
        # The binary body: padded tile_buffer + padded content_buffer
        bin_body = tile_buffer_padded + pad8(content_buffer)
        
        # Buffer views with correct offsets (offset uses padded length, byteLength uses original)
        header = {
            "buffers": [ { "byteLength": len(bin_body) } ],
            "bufferViews": [
                { "buffer": 0, "byteOffset": 0, "byteLength": tile_buffer_len },
                { "buffer": 0, "byteOffset": len(tile_buffer_padded), "byteLength": content_buffer_len }
            ],
            "tileAvailability": { "bitstream": 0, "availableCount": sum(tile_bits) },
            "contentAvailability": [ { "bitstream": 1, "availableCount": sum(content_bits) } ],
            # childSubtreeAvailability: 1 if there are levels beyond this subtree, 0 otherwise
            "childSubtreeAvailability": { "constant": 1 if has_child_subtrees else 0 }
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
