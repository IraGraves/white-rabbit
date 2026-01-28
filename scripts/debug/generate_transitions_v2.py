
import sys
import os
import numpy as np

# Mock osgeo
from unittest.mock import MagicMock
sys.modules['osgeo'] = MagicMock()
sys.modules['osgeo.gdal'] = MagicMock()
sys.modules['osgeo.osr'] = MagicMock()

# Add path to tiler utils
sys.path.append(r"c:\Users\Bernhard\.gemini\antigravity\scratch\white-rabbit\scripts\texture-pipeline\tiler")
try:
    import utils
except ImportError:
    # Try local import if running from dir
    sys.path.append(os.getcwd())
    import utils

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

def generate_table():
    print("Generating S2 Transitions...")
    # CORRECT Definitions from mesh.py analysis
    edge_defs = {
        'north': {'fixed': 'v', 'val': 1.0, 'vary': 'u', 'idx': 0}, 
        'east':  {'fixed': 'u', 'val': 1.0, 'vary': 'v', 'idx': 1},
        'south': {'fixed': 'v', 'val': 0.0, 'vary': 'u', 'idx': 2},
        'west':  {'fixed': 'u', 'val': 0.0, 'vary': 'v', 'idx': 3},
    }
    
    dirs = ['north', 'east', 'south', 'west']
    
    print("S2_TRANSITIONS = {")
    
    for f1 in range(6):
        print(f"    {f1}: {{")
        for e1 in dirs:
            def1 = edge_defs[e1]
            p1_start = get_xyz(f1, def1, 0.0)
            p1_mid   = get_xyz(f1, def1, 0.5)
            p1_end   = get_xyz(f1, def1, 1.0)
            
            best_match = None
            min_mid_dist = 999.0
            
            for f2 in range(6):
                if f1 == f2: continue
                for e2 in dirs:
                    def2 = edge_defs[e2]
                    p2_mid = get_xyz(f2, def2, 0.5)
                    
                    dist = np.linalg.norm(p1_mid - p2_mid)
                    if dist < min_mid_dist:
                        min_mid_dist = dist
                        best_match = (f2, e2)
            
            if min_mid_dist > 0.1:
                print(f"        # ERROR: No match found for {e1} (min dist {min_mid_dist:.4f})")
                continue
                
            f2, e2 = best_match
            def2 = edge_defs[e2]
            
            p2_start = get_xyz(f2, def2, 0.0)
            p2_end   = get_xyz(f2, def2, 1.0)
            
            # Check orientation
            dist_std = np.linalg.norm(p1_start - p2_start) + np.linalg.norm(p1_end - p2_end)
            dist_flip = np.linalg.norm(p1_start - p2_end) + np.linalg.norm(p1_end - p2_start)
            
            is_flipped = dist_flip < dist_std
            
            # Check Swap
            # Swap = My Varying Axis != Their Varying Axis
            is_swap = (def1['vary'] != def2['vary'])
            
            # Formatting
            e1_key = f"E_{e1[0].upper()}"
            e2_comments = f"E_{e2[0].upper()}"
            
            print(f"        {e1_key}: ({f2}, {def2['idx']}, {is_swap}, {is_flipped}), # -> {f2} {e2_comments}")
            
        print("    },")
    print("}")

    # Explicit Debug for F0-West vs F4-?
    print("\nDebug F0-West vs F4 Candidates:")
    p0w = get_xyz(0, edge_defs['west'], 0.5)
    for e in dirs:
        p4 = get_xyz(4, edge_defs[e], 0.5)
        d = np.linalg.norm(p0w - p4)
        print(f"F4 {e}: Dist {d:.4f} XYZ {p4}")
    print(f"F0 West: XYZ {p0w}")

if __name__ == "__main__":
    generate_table()
