import os
import argparse
from PIL import Image

# Limit für riesige Bilder aufheben (für Ihre 23k Datei)
Image.MAX_IMAGE_PIXELS = None

# Konfiguration
TILE_SIZE = 512
MAX_ZOOM = 5

def generate_color_tiles(input_path, output_folder):
    print(f"--- Color Tile Generator (EPSG:4326) ---")
    print(f"Input:  {input_path}")
    print(f"Output: {output_folder}")

    # Bild laden
    with Image.open(input_path) as img:
        # Konvertieren zu RGB (falls CMYK oder Alpha vorhanden)
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        src_w, src_h = img.size
        print(f"Source Dimensions: {src_w}x{src_h}")

        for z in range(MAX_ZOOM + 1):
            # EPSG:4326 Grid Definition:
            # Level 0: 2 Spalten, 1 Zeile
            # Level 1: 4 Spalten, 2 Zeilen
            # Level z: 2 * 2^z Spalten, 1 * 2^z Zeilen
            
            num_cols = 2 * (2 ** z)
            num_rows = 1 * (2 ** z)
            
            print(f"\nProcessing Zoom Level {z} ({num_cols}x{num_rows} tiles)...")

            # Breite und Höhe einer Kachel im Quellbild (Fliesskommazahlen wichtig!)
            tile_src_w = src_w / num_cols
            tile_src_h = src_h / num_rows

            count = 0
            total = num_cols * num_rows

            for y in range(num_rows):
                for x in range(num_cols):
                    # 1. Berechne die Bounding Box im Quellbild
                    left = x * tile_src_w
                    upper = y * tile_src_h
                    right = (x + 1) * tile_src_w
                    lower = (y + 1) * tile_src_h

                    # 2. Ausschneiden (Crop)
                    # Wir runden hier auf Integer für Pixel-Koordinaten
                    box = (int(left), int(upper), int(right), int(lower))
                    chunk = img.crop(box)

                    # 3. Resample auf 512x512
                    # LANCZOS ist entscheidend für Qualität beim Hochskalieren (Zoom 5)
                    tile = chunk.resize((TILE_SIZE, TILE_SIZE), resample=Image.Resampling.LANCZOS)

                    # 4. Speichern (z/x/y.jpg)
                    # iTowns Struktur: output/z/x/y.jpg
                    dir_path = os.path.join(output_folder, str(z), str(x))
                    os.makedirs(dir_path, exist_ok=True)
                    
                    output_path = os.path.join(dir_path, f"{y}.jpg")
                    
                    # JPEG mit hoher Qualität (90) ist effizienter als PNG für Fotos
                    tile.save(output_path, "JPEG", quality=90)

                    count += 1
                    if count % 50 == 0:
                        print(f"  Progress: {count}/{total}", end='\r')

    print(f"\n\nFERTIG! Color Tiles liegen in '{output_folder}'")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate Standard EPSG:4326 Color Tiles")
    parser.add_argument("--input", required=True, help="Pfad zum großen Mond-Bild (23k)")
    parser.add_argument("--output", required=True, help="Output Ordner (z.B. public/assets/textures/color)")
    
    args = parser.parse_args()
    generate_color_tiles(args.input, args.output)