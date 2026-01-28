
import sys
import os
import numpy as np

# Add path to tiler utils (relative to script location)
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
TILER_PATH = os.path.join(SCRIPT_DIR, "..", "texture-pipeline", "tiler")
sys.path.append(TILER_PATH)
# Mock osgeo
import sys
from unittest.mock import MagicMock
sys.modules['osgeo'] = MagicMock()
sys.modules['osgeo.gdal'] = MagicMock()
sys.modules['osgeo.osr'] = MagicMock()

try:
    import utils
except ImportError:
    # Try local import if running from dir
    sys.path.append(os.getcwd())
    import utils

def check_edges():
    size = 256
    zoom = 0 # Face level
    
    # 0..1 normalization logic in Tiler
    # In 'create_glb_s2':
    #   u = (x + (0.5 if not is_optimized else 0)) / size * 2 - 1 ? No.
    #   Let's see what utils.s2_face_uv_to_xyz expects.
    #   It expects u,v in [-1, 1]? No, docstring says [0, 1].
    #   Wait. utils.py line 263: "u, v in range [0, 1]"
    #   But line 271: s2_st_to_uv(u). 's' usually [0,1].
    #   Let's iterate edges in [0, 1] ST space.
    
    # Edges in ST space (0..1)
    # North: v=0? or v=1? 
    # Usually Origin (0,0) is Bottom-Left in Math, Top-Left in Image.
    # GDAL/Raster: (0,0) is Top-Left.
    # So y=0 is North. y=1 is South.
    # Let's assumes Top (y=0) is North. Bottom (y=1) is South.
    
    edges = {
        'North': (0.5, 0.0), # X mid, Y top (0)
        'South': (0.5, 1.0), # X mid, Y bottom (1)
        'West':  (0.0, 0.5), # X left, Y mid
        'East':  (1.0, 0.5), # X right, Y mid
    }
    
    print("S2_TRANSITIONS = {")
    
    # Define vectors for orientation check
    # Edge is a line of points.
    # North: (u goes 0..1, v=0)
    # South: (u goes 0..1, v=1)
    # West: (u=0, v goes 0..1)
    # East: (u=1, v goes 0..1)
    
    edge_defs = {
        'north': {'fixed': 'v', 'val': 1.0, 'vary': 'u', 'idx': 0}, # v=1.0 is North (Z+)
        'east':  {'fixed': 'u', 'val': 1.0, 'vary': 'v', 'idx': 1}, # u=1.0 is East (Y+)
        'south': {'fixed': 'v', 'val': 0.0, 'vary': 'u', 'idx': 2}, # v=0.0 is South (Z-)
        'west':  {'fixed': 'u', 'val': 0.0, 'vary': 'v', 'idx': 3}, # u=0.0 is West (Y-)
    }
    
    dirs = ['north', 'east', 'south', 'west']
    
    for f1 in range(6):
        print(f"    {f1}: {{")
        for e1 in dirs:
            def1 = edge_defs[e1]
            
            # Generate 2 points to determine direction
            # P0: vary = 0.0
            # P1: vary = 1.0
            p1_start = get_xyz(f1, def1, 0.0)
            p1_end   = get_xyz(f1, def1, 1.0)
            p1_mid   = get_xyz(f1, def1, 0.5)
            
            best_f2 = -1
            best_e2 = ""
            best_swap = False
            best_flip = False
            min_dist = 999.0
            
            # Find match (check mids first)
            for f2 in range(6):
                if f1 == f2: continue
                for e2 in dirs:
                    def2 = edge_defs[e2]
                    p2_mid = get_xyz(f2, def2, 0.5)
                    
                    if np.linalg.norm(p1_mid - p2_mid) < 0.001:
                        # Candidate found. Check orientation.
                        p2_start = get_xyz(f2, def2, 0.0)
                        p2_end   = get_xyz(f2, def2, 1.0)
                        
                        # Check Standard (Start->Start, End->End)
                        d_std = np.linalg.norm(p1_start - p2_start) + np.linalg.norm(p1_end - p2_end)
                        # Check Flipped (Start->End, End->Start)
                        d_flip = np.linalg.norm(p1_start - p2_end) + np.linalg.norm(p1_end - p2_start)
                        
                        is_flipped = d_flip < d_std
                        
                        # Check Swap
                        # If my varying axis is U (Horizontal), their varying axis is U -> No Swap.
                        # If my varying axis is U, their varying axis is V -> Swap.
                        is_swap = (def1['vary'] != def2['vary'])
                        
                        best_f2 = f2
                        best_e2 = e2
                        best_swap = is_swap
                        best_flip = is_flipped
                        min_dist = 0.0
            
            if best_f2 != -1:
                target_idx = edge_defs[best_e2]['idx']
                # E_N: (Face, TargetEdgeIdx, Swap, Flip)
                # Map e1 to variable name
                var_name = f"E_{e1[0].upper()}"
                print(f"        {var_name}: ({best_f2}, {target_idx}, {best_swap}, {best_flip}), # -> {best_f2} E_{best_e2[0].upper()}")
            else:
                print(f"        E_{e1[0].upper()}: None, # NO MATCH")
                
        print("    },")
    print("}")

def get_xyz(face, edge_def, vary_val):
    u, v = 0.0, 0.0
    if edge_def['fixed'] == 'u':
        u = edge_def['val']
        v = vary_val
    else:
        v = edge_def['val']
        u = vary_val
    x, y, z = utils.s2_face_uv_to_xyz(face, u, v)
    return np.array([x, y, z])

if __name__ == "__main__":
    check_edges()
