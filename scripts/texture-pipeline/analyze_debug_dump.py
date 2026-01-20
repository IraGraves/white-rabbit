
import numpy as np
import re

def parse_border(lines):
    # Parse numpy array output from text
    # expected format: [[ x y z] ...]
    # We'll just extract all floats and reshape
    text = "".join(lines)
    # Remove brackets
    text = text.replace('[', '').replace(']', '')
    # Split by whitespace
    values = [float(x) for x in text.split()]
    return np.array(values).reshape(-1, 3)

def check_edge(a, b):
    # Hausdorff-like from orchestration.py
    dists = np.linalg.norm(a[:, None, :] - b[None, :, :], axis=2)
    min_dists_a = np.min(dists, axis=1)
    min_dists_b = np.min(dists, axis=0)
    
    idx_a = np.argmax(min_dists_a)
    max_a = np.max(min_dists_a)
    
    idx_b = np.argmax(min_dists_b)
    max_b = np.max(min_dists_b)
    
    return max_a, idx_a, max_b, idx_b

def analyze():
    with open("debug_cf.txt", "r") as f:
        content = f.read()
        
    blocks = content.split("[FORCE DEBUG]")
    for block in blocks:
        if "My Border Full:" not in block: continue
        
        lines = block.splitlines()
        
        # Extract My Border Full
        my_start = -1
        their_start = -1
        
        for i, line in enumerate(lines):
            if "My Border Full:" in line: my_start = i + 1
            if "Their Border Full:" in line: their_start = i + 1
            
        if my_start == -1 or their_start == -1: continue
        
        # Extract until next label or end
        my_lines = []
        for line in lines[my_start:]:
            if "Their Border Full:" in line: break
            my_lines.append(line)
            
        their_lines = []
        for line in lines[their_start:]:
            if "Calculated Max Error:" in line: break
            their_lines.append(line)
            
        my_border = parse_border(my_lines)
        their_border = parse_border(their_lines)
        
        print(f"--- Block Analysis ---")
        print(f"My Border Shape: {my_border.shape}")
        print(f"Their Border Shape: {their_border.shape}")
        
        max_a, idx_a, max_b, idx_b = check_edge(my_border, their_border)
        
        print(f"Max Error My->Their: {max_a:.4f}m at index {idx_a}")
        print(f"   Point: {my_border[idx_a]}")
        print(f"   Closest Their: {their_border[np.argmin(np.linalg.norm(their_border - my_border[idx_a], axis=1))]}")
        
        print(f"Max Error Their->My: {max_b:.4f}m at index {idx_b}")
        print(f"   Point: {their_border[idx_b]}")

if __name__ == "__main__":
    analyze()
