
import sys
import os
import numpy as np
import struct
from unittest.mock import MagicMock, Mock

# --- MOCK OSGEO ---
mock_gdal = MagicMock()
mock_gdal.GRA_Bilinear = 1
mock_gdal.GRA_Lanczos = 1
mock_gdal.GRA_NearestNeighbour = 0
mock_gdal.GDT_Byte = 1
mock_gdal.GDT_UInt16 = 2
mock_gdal.GDT_Float32 = 6
mock_gdal.GF_Read = 0
mock_gdal.GF_Write = 1
mock_gdal.UseExceptions = Mock()
mock_gdal.PushErrorHandler = Mock()
mock_osr = MagicMock()

# Mock sys.modules for osgeo
module_mock = MagicMock()
module_mock.gdal = mock_gdal
module_mock.osr = mock_osr
sys.modules['osgeo'] = module_mock

# --- MOCK PYGLTFLIB ---
mock_pygltflib = MagicMock()

# We need to capture the blob
CAPTURED_BLOB = None

class MockGLTF2:
    def __init__(self, **kwargs):
        pass
    def set_binary_blob(self, blob):
        global CAPTURED_BLOB
        CAPTURED_BLOB = blob
    def save(self, path):
        pass # Do nothing
        
mock_pygltflib.GLTF2 = MockGLTF2
# Other classes
mock_pygltflib.Scene = MagicMock()
mock_pygltflib.Node = MagicMock()
mock_pygltflib.Mesh = MagicMock()
mock_pygltflib.Primitive = MagicMock()
mock_pygltflib.Buffer = MagicMock()
mock_pygltflib.BufferView = MagicMock()
mock_pygltflib.Accessor = MagicMock()
mock_pygltflib.Material = MagicMock()
mock_pygltflib.PbrMetallicRoughness = MagicMock()
mock_pygltflib.Texture = MagicMock()
mock_pygltflib.TextureInfo = MagicMock()
mock_pygltflib.Image = MagicMock()
mock_pygltflib.Sampler = MagicMock()

sys.modules['pygltflib'] = mock_pygltflib

# Add pipeline to path
sys.path.append(os.path.join(os.path.dirname(__file__), '../../scripts/texture-pipeline'))

# Now import tiler
from tiler.mesh import create_glb_s2, Timer

# Mock Dataset Class
class MockDataset:
    def __init__(self, w, h, bands, val=128):
        self.RasterXSize = w
        self.RasterYSize = h
        self.RasterCount = bands
        self.val = val
    
    def GetGeoTransform(self):
        return [0, 1, 0, 0, 0, -1]
        
    def GetRasterBand(self, b):
        band = MagicMock()
        band.GetNoDataValue.return_value = None
        return band
        
    def ReadAsArray(self, x, y, w, h, buf_xsize=None, buf_ysize=None, resample_alg=None):
        target_w = buf_xsize if buf_xsize else w
        target_h = buf_ysize if buf_ysize else h
        if self.RasterCount == 1:
            return np.full((target_h, target_w), self.val, dtype=np.uint8)
        else:
            return np.full((self.RasterCount, target_h, target_w), self.val, dtype=np.uint8)

def reproduce_flip():
    print("Running reproduction script (MOSKED GDAL+PYGLTFLIB) for Vertical UV Flip...")
    
    # Mock Faces
    dem_faces = [MockDataset(256, 256, 1, 100) for _ in range(6)]
    color_faces = [MockDataset(256, 256, 3, 200) for _ in range(6)]
    
    out_path = "test_flip.glb"
    radii = (1000, 1000, 1000)
    
    try:
        create_glb_s2(
            face=0, tx=0, ty=0, zoom=0,
            dem_faces=dem_faces, color_faces=color_faces,
            path=out_path, radii=radii,
            tile_size=16, texture_size=16,
            height_scale=1.0, roughness=1.0, metallic=0.0,
            is_geodetic=False
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"FAILED: create_glb_s2 raised exception: {e}")
        return False
    
    if CAPTURED_BLOB is None:
        print("FAILED: No binary blob captured.")
        return False
        
    print(f"Blob captured ({len(CAPTURED_BLOB)} bytes). Inspecting UVs...")
    
    # Structure match:
    # full_buffer = points_bin + normals_bin + uvs_bin + indices_bin + png_bytes
    
    v_count = 17 # 16+1
    num_verts = v_count * v_count
    
    # Calculate exact offsets (padded)
    len_pos = num_verts * 3 * 4
    len_norm = num_verts * 3 * 4
    len_uv = num_verts * 2 * 4
    
    def get_padded_len(l):
        return l + (4 - l % 4) % 4 if l % 4 else l
        
    pts_pad = get_padded_len(len_pos)
    nrm_pad = get_padded_len(len_norm)
    
    uv_start = pts_pad + nrm_pad
    uv_data = CAPTURED_BLOB[uv_start : uv_start + len_uv]
    
    uvs = np.frombuffer(uv_data, dtype=np.float32).reshape((num_verts, 2))
    
    print(f"Total UVs: {len(uvs)}")
    print("First Row (Top Vertices, North):")
    print(uvs[:5])
    
    v_top = uvs[0][1]
    
    print(f"\nTop-Left Vertex V: {v_top:.4f}")
    
    if v_top > 0.9:
        print("\n[CONFIRMED] Top Vertex has V ~ 1.0. Vertices are flipped vs texture.")
        return True
    elif v_top < 0.1:
        print("\n[PASS] Top Vertex has V ~ 0.0. Correct orientation.")
        return False
    else:
        print("\n[UNCLEAR] UVs are weird.")
        return False

if __name__ == "__main__":
    reproduce_flip()
