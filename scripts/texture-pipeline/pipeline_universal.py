import os
import sys
import argparse
import numpy as np
import subprocess
import shutil
from PIL import Image

# Aufruf Beispiel: python pipeline_universal.py --height ldem_64_uint.tif --color lroc_color_16bit_srgb.tif --output final_tiles_ktx2

# Limit für riesige Bilder aufheben
Image.MAX_IMAGE_PIXELS = None

# Default Einstellungen
DEFAULT_ROUGHNESS_MIN = 0.4
DEFAULT_ROUGHNESS_MAX = 0.9
TILE_SIZE = 512
MAX_ZOOM = 5

def save_tile(height_chunk, color_chunk, zoom, x, y, output_folder, r_min, r_max):
    # Ordnerstruktur anlegen
    dir_path = os.path.join(output_folder, str(zoom), str(x))
    os.makedirs(dir_path, exist_ok=True)
    
    # Wir speichern vorerst als PNG (Zwischenschritt)
    path = os.path.join(dir_path, f"{y}.png")

    # --- 1. Roughness ---
    dy, dx = np.gradient(height_chunk)
    slope = np.sqrt(dx**2 + dy**2)
    slope_norm = np.clip(slope * 2.0, 0, 1)
    roughness = r_min + (1.0 - slope_norm) * (r_max - r_min)
    channel_a = (roughness * 255).astype(np.uint8) 

    # --- 2. Height (16-bit Split) ---
    h_u16 = height_chunk.astype(np.uint16)
    channel_g = (h_u16 >> 8).astype(np.uint8)
    channel_b = (h_u16 & 0xFF).astype(np.uint8)

    # --- 3. Albedo ---
    img_color = Image.fromarray(color_chunk)
    if img_color.mode != 'L': img_color = img_color.convert('L')
    
    if img_color.size != (height_chunk.shape[1], height_chunk.shape[0]):
        img_color = img_color.resize((height_chunk.shape[1], height_chunk.shape[0]), Image.BICUBIC)
        
    channel_r = np.array(img_color)

    # Packing
    packed = np.dstack((channel_r, channel_g, channel_b, channel_a))
    Image.fromarray(packed, 'RGBA').save(path, optimize=True)

def batch_convert_ktx2(folder):
    """
    Sucht rekursiv nach PNG-Dateien und konvertiert sie mit 'toktx' zu KTX2.
    Löscht danach die PNG-Datei.
    """
    print(f"\n--- Starte KTX2 Konvertierung ---")
    
    # Prüfen, ob toktx installiert ist
    if not shutil.which("toktx"):
        print("[FEHLER] 'toktx' wurde nicht gefunden!")
        print("Bitte installieren Sie die KTX-Software und fügen Sie sie zum PATH hinzu.")
        print("Die PNG-Dateien wurden NICHT konvertiert.")
        return

    png_files = []
    # Alle PNGs sammeln
    for root, dirs, files in os.walk(folder):
        for file in files:
            if file.endswith(".png"):
                png_files.append(os.path.join(root, file))

    total = len(png_files)
    print(f"Gefunden: {total} PNG-Dateien. Konvertierung läuft...")

    for i, png_path in enumerate(png_files):
        ktx2_path = png_path.replace(".png", ".ktx2")
        
        # Der Befehl für toktx
        # --t2: KTX2 Format
        # --encode uastc: Hohe Qualität
        # --zcmp 9: Zstandard Kompression für kleinere Dateien
        cmd = [
            "toktx",
            "--t2",
            "--encode", "uastc",
            "--zcmp", "9",
            ktx2_path,
            png_path
        ]
        
        try:
            # Befehl ausführen (unterdrückt Output, außer bei Fehler)
            subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
            
            # Bei Erfolg: PNG löschen
            os.remove(png_path)
            
        except subprocess.CalledProcessError as e:
            print(f"\n[FEHLER] Konvertierung gescheitert für: {png_path}")
            print(e.stderr.decode())
        
        if i % 10 == 0:
            print(f"  Fortschritt: {i+1}/{total}", end='\r')

    print(f"\n\nFERTIG! Alle Dateien im Ordner '{folder}' sind jetzt .ktx2")

def process_body(file_height, file_color, output_folder, r_min, r_max):
    print(f"--- Universal Pipeline ---")
    print(f"Input Height: {file_height}")
    print(f"Input Color:  {file_color}")
    print(f"Output:       {output_folder}")

    # Laden
    print("Lade Bilder...")
    with Image.open(file_height) as img_h:
        data_h = np.array(img_h)
    
    with Image.open(file_color) as img_c:
        data_c = np.array(img_c.convert('L'))

    # Processing Loop
    for z in range(MAX_ZOOM + 1):
        print(f"\nGeneriere Zoom Level {z}...")
        factor = 2 ** (MAX_ZOOM - z)
        
        if factor > 1: current_h = data_h[::factor, ::factor]
        else: current_h = data_h
            
        h_h, h_w = current_h.shape
        cols = (h_w + TILE_SIZE - 1) // TILE_SIZE
        rows = (h_h + TILE_SIZE - 1) // TILE_SIZE
        
        count = 0
        total = cols * rows

        for y in range(rows):
            for x in range(cols):
                # Koordinaten
                x1, y1 = x * TILE_SIZE, y * TILE_SIZE
                x2, y2 = min(x1 + TILE_SIZE, h_w), min(y1 + TILE_SIZE, h_h)
                
                chunk_h = current_h[y1:y2, x1:x2]

                # Color Mapping
                u1 = (x * TILE_SIZE * factor) / data_h.shape[1]
                v1 = (y * TILE_SIZE * factor) / data_h.shape[0]
                x_next = min((x+1)*TILE_SIZE*factor, data_h.shape[1])
                y_next = min((y+1)*TILE_SIZE*factor, data_h.shape[0])
                u2 = x_next / data_h.shape[1]
                v2 = y_next / data_h.shape[0]
                
                cx1, cy1 = int(u1 * data_c.shape[1]), int(v1 * data_c.shape[0])
                cx2, cy2 = int(u2 * data_c.shape[1]), int(v2 * data_c.shape[0])
                
                if cx2 <= cx1: cx2 = cx1 + 1
                if cy2 <= cy1: cy2 = cy1 + 1
                
                chunk_c = data_c[cy1:cy2, cx1:cx2]

                if chunk_h.shape[0] < TILE_SIZE or chunk_h.shape[1] < TILE_SIZE:
                    padded = np.zeros((TILE_SIZE, TILE_SIZE), dtype=chunk_h.dtype)
                    padded[:chunk_h.shape[0], :chunk_h.shape[1]] = chunk_h
                    chunk_h = padded

                save_tile(chunk_h, chunk_c, z, x, y, output_folder, r_min, r_max)
                
                count += 1
                if count % 100 == 0: print(f"  Tiles: {count}/{total}", end='\r')
    
    # --- AUTOMATISCHE KTX2 UMWANDLUNG ---
    batch_convert_ktx2(output_folder)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate Planet Tiles & Convert to KTX2")
    parser.add_argument("--height", required=True, help="Pfad zur Height Map (TIF)")
    parser.add_argument("--color", required=True, help="Pfad zur Color Map (TIF)")
    parser.add_argument("--output", required=True, help="Output Ordner")
    parser.add_argument("--rmin", type=float, default=DEFAULT_ROUGHNESS_MIN, help="Min Roughness")
    parser.add_argument("--rmax", type=float, default=DEFAULT_ROUGHNESS_MAX, help="Max Roughness")
    
    args = parser.parse_args()
    
    process_body(args.height, args.color, args.output, args.rmin, args.rmax)