import sys
import os
from pygltflib import GLTF2

def fix_names(glb_path):
    print(f"[FIX] Processing {glb_path}...")
    try:
        gltf = GLTF2.load(glb_path)
        
        if not gltf.textures:
            print("  No textures found.")
            return

        # Map Images to names (Source of Truth)
        image_names = {}
        for i, img in enumerate(gltf.images or []):
            if img.name:
                image_names[i] = img.name
                print(f"  Image {i} name: '{img.name}'")
            else:
                print(f"  Image {i} has no name.")

        # Apply names to Textures based on source image relationship
        for i, tex in enumerate(gltf.textures):
            new_name = None
            
            # 1. Check primary source
            source_idx = tex.source
            if source_idx is not None and source_idx in image_names:
                new_name = image_names[source_idx]
            
            # 2. Check BasisU extension source (overrides or fills null)
            if tex.extensions and "KHR_texture_basisu" in tex.extensions:
                ext = tex.extensions["KHR_texture_basisu"]
                # Extension might be a dict or an object depending on version
                b_source = ext.get("source") if isinstance(ext, dict) else getattr(ext, "source", None)
                if b_source is not None and b_source in image_names:
                    new_name = image_names[b_source]

            # 3. Check for our fallback extra tag if names were lost but extras survived
            if not new_name and tex.extras and "s2_name" in tex.extras:
                new_name = tex.extras["s2_name"]

            # Final assignment
            if new_name:
                # We force sync if it's one of our core identifiers
                current_lower = (tex.name or "").lower()
                is_generic = not tex.name or current_lower.startswith("texture")
                is_core = new_name.lower() in ["color", "albedo", "heightmap"]
                
                if is_generic or is_core:
                    print(f"  Texture {i}: '{tex.name}' -> '{new_name}'")
                    tex.name = new_name
            else:
                print(f"  Texture {i}: Could not determine name (no source/extra match).")

        gltf.save(glb_path)
        print("[FIX] Done.")
    except Exception as e:
        print(f"[FIX] Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python fix_texture_names.py <path_to_glb>")
        sys.exit(1)
    fix_names(sys.argv[1])
