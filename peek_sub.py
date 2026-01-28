
import struct
import json

def peek(path):
    with open(path, "rb") as f:
        data = f.read()
    
    magic = data[0:4].decode('ascii')
    version = struct.unpack('<I', data[4:8])[0]
    json_len = struct.unpack('<Q', data[8:16])[0]
    bin_len = struct.unpack('<Q', data[16:24])[0]
    
    print(f"File: {path}")
    print(f"Magic: {magic}, Version: {version}, JSON Len: {json_len}, Bin Len: {bin_len}")
    
    json_bytes = data[24:24+json_len]
    try:
        header = json.loads(json_bytes.decode('utf-8'))
        print("Header JSON keys:", list(header.keys()))
        if "propertyTables" in header:
            print("Property Tables found!")
            # Get buffer views for properties
            table = header["propertyTables"][0]
            props = table["properties"]
            views = header["bufferViews"]
            
            def get_data(prop_name):
                view_idx = props[prop_name]["values"]
                view = views[view_idx]
                off = view["byteOffset"]
                length = view["byteLength"]
                # Binary begins after JSON header (24 + json_len)
                bin_start = 24 + json_len
                raw = data[bin_start + off : bin_start + off + length]
                return struct.unpack(f'<{len(raw)//4}f', raw)

            min_h = get_data("minHeight")
            max_h = get_data("maxHeight")
            occ_p = get_data("occPoint")
            
            print(f"First 5 Min Heights: {min_h[:5]}")
            print(f"First 5 Max Heights: {max_h[:5]}")
            print(f"First 5 Occ Points: {occ_p[:6]} (2 tiles)")
            
            # Check for non-zero entries
            non_zero_min = [h for h in min_h if h != 0]
            print(f"Non-zero MinHeights found: {len(non_zero_min)} / {len(min_h)}")
        else:
            print("Property Tables MISSING!")
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Error: {e}")

peek("C:/output/tiles_out2/subtrees/face0_0_0_0.subtree")
