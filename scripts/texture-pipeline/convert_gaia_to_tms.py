import os
import argparse
import shutil
import re

def convert_gaia_structure(input_folder, output_folder):
    print(f"--- Gaia Sky to TMS Converter ---")
    print(f"Input (Gaia): {input_folder}")
    print(f"Output (TMS): {output_folder}")

    # Regex um Gaia Dateinamen zu parsen: tx_ROW_COL.jpg
    # Beispiel: tx_2_5.jpg -> Row=2 (y), Col=5 (x)
    pattern = re.compile(r"tx_(\d+)_(\d+)\.(jpg|png|jpeg)")

    files_processed = 0

    # Durchlaufe alle Unterordner (level0, level1, etc.)
    for root, dirs, files in os.walk(input_folder):
        for file in files:
            match = pattern.match(file)
            if match:
                row_str, col_str, ext = match.groups()
                row = int(row_str) # Das ist Y
                col = int(col_str) # Das ist X
                
                # Bestimme Zoom Level anhand des Ordnernamens
                # Gaia nutzt meist "level0", "level1" etc.
                folder_name = os.path.basename(root)
                if "level" in folder_name:
                    try:
                        zoom = int(folder_name.replace("level", ""))
                    except ValueError:
                        continue # Ordner passt nicht zum Schema
                else:
                    # Fallback: Wenn Dateien flach liegen, muss der User aufpassen
                    print(f"[WARN] Datei {file} in Ordner ohne 'level' im Namen gefunden. Überspringe.")
                    continue

                # Mapping Logic
                # Gaia: tx_row_col -> TMS: z/x/y
                z = zoom
                x = col
                y = row 

                # Zielpfad bauen
                target_dir = os.path.join(output_folder, str(z), str(x))
                os.makedirs(target_dir, exist_ok=True)
                
                src_path = os.path.join(root, file)
                dst_path = os.path.join(target_dir, f"{y}.jpg")

                # Kopieren
                shutil.copy2(src_path, dst_path)
                
                files_processed += 1
                if files_processed % 100 == 0:
                    print(f"  Processed: {files_processed} tiles...", end='\r')

    print(f"\n\nFERTIG! {files_processed} Höhen-Kacheln nach '{output_folder}' kopiert.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Organize Gaia Sky Tiles into TMS structure")
    parser.add_argument("--input", required=True, help="Pfad zum entpackten Gaia 'tex' Ordner")
    parser.add_argument("--output", required=True, help="Output Ordner (z.B. public/assets/textures/elevation)")
    
    args = parser.parse_args()
    convert_gaia_structure(args.input, args.output)