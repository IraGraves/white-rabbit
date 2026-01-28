import struct
import json
import os

path = r"tiles_out/content/0/1_0_0.glb"
with open(path, 'rb') as f:
    f.read(12)
    c0_len, _ = struct.unpack('<II', f.read(8))
    json_data = f.read(c0_len).decode('utf-8')
    with open('dump_gltf.json', 'w') as out:
        out.write(json_data)
print("Dumped to dump_gltf.json")
