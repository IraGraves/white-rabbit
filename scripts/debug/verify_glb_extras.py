import sys
import json
from pygltflib import GLTF2

def inspect_extras(glb_path):
    gltf = GLTF2.load(glb_path)
    print(f"--- Extras for {glb_path} ---")
    print("Root Extras:", json.dumps(gltf.extras, indent=2))
    for i, material in enumerate(gltf.materials):
        print(f"Material {i} Extras:", json.dumps(material.extras, indent=2))
    
    # Check image count and size
    print(f"Number of images: {len(gltf.images)}")
    for i, img in enumerate(gltf.images):
        bv = gltf.bufferViews[img.bufferView]
        print(f"Image {i} size: {bv.byteLength} bytes")

if __name__ == "__main__":
    inspect_extras(sys.argv[1])
