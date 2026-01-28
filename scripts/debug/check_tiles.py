import json
import os
import math

# --- Matrix-Mathe (Notwendig) ---
def lese_matrix(node):
    return node.get('transform', [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1])

def mat_mul(A, B):
    C = [0]*16
    for i in range(4):
        for j in range(4):
            s = sum(A[k*4+i] * B[j*4+k] for k in range(4))
            C[j*4+i] = s
    return C

def hole_pos(m): return m[12], m[13], m[14]

def parse_uri(uri):
    try:
        clean = uri.split('.')[0] # .glb weg
        parts = clean.split('/')
        if len(parts) < 2: return None
        lvl = int(parts[0])
        xy = parts[1].split('_')
        return lvl, int(xy[0]), int(xy[1])
    except: return None

# --- Hauptlogik ---
def check_compact(path):
    print(f"Prüfe: {path}\n")
    try:
        with open(path, 'r') as f: data = json.load(f)
    except: print("Dateifehler"); return

    tiles_by_level = {}

    def traverse(node, p_mat):
        c_mat = lese_matrix(node)
        g_mat = mat_mul(p_mat, c_mat)
        
        if 'content' in node:
            uri = node['content']['uri']
            inf = parse_uri(uri)
            if inf:
                l, x, y = inf
                if l not in tiles_by_level: tiles_by_level[l] = []
                tiles_by_level[l].append({'x':x, 'y':y, 'pos':hole_pos(g_mat), 'uri':uri})
        
        for c in node.get('children', []): traverse(c, g_mat)

    traverse(data['root'], [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1])

    # --- Ausgabe Tabelle ---
    for l in sorted(tiles_by_level.keys()):
        ts = tiles_by_level[l]
        if len(ts) < 2: continue
        ts.sort(key=lambda t: (t['y'], t['x']))
        
        ref = ts[0]
        print(f"=== EBENE {l} (Ref: {ref['uri']}) ===")
        print(f"{'Tile':<10} | {'dGrid (X,Y)':<12} | {'dWelt X':>15} | {'dWelt Y':>15} | {'dWelt Z':>15}")
        print("-" * 75)

        for t in ts:
            if t == ref: continue
            dgx = t['x'] - ref['x']
            dgy = t['y'] - ref['y']
            dw = (t['pos'][0]-ref['pos'][0], t['pos'][1]-ref['pos'][1], t['pos'][2]-ref['pos'][2])
            
            # Formatierung: Werte unter 1.0 als 0 anzeigen für Klarheit
            def fmt(v): return f"{v:15.2f}" if abs(v) > 1.0 else f"{0.0:15.2f}"
            
            print(f"{t['uri']:<10} | {dgx:+d}, {dgy:+d}       | {fmt(dw[0])} | {fmt(dw[1])} | {fmt(dw[2])}")
        print("")

if __name__ == "__main__":
    p = os.path.join("tiles_out", "tileset.json")
    if os.path.exists(p): check_compact(p)
    else: print(f"Nicht gefunden: {p}")