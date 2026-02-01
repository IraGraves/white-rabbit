import os
import argparse
from osgeo import gdal

# Diese Zeile verhindert die Erstellung der .xml (aux.xml) Dateien
gdal.SetConfigOption('GDAL_PAM_ENABLED', 'NO')

# Fehler lautstark melden, nicht schlucken
gdal.UseExceptions()

# --- Configuration ---
TILE_SIZE = 512
MAX_ZOOM = 5

def generate_tiles(input_path, output_root, layer_type, format_ext):
    print(f"\n--- Universal Planet Tiler (Robust) ---")
    print(f"Input:  {input_path}")
    print(f"Output: {output_root}")
    
    # 1. VORBEREITUNG: Wir erstellen eine virtuelle "Zwischen-Datei" (VRT) im RAM.
    # Warum? Ihre TIF hat wahrscheinlich keine Geo-Koordinaten.
    # Wir zwingen GDAL, das Bild als "Die ganze Welt" (-180 bis 180 Grad) zu behandeln.
    print("Pre-processing: Applying EPSG:4326 coordinates to raw image...")
    
    try:
        # Öffnen der Datei
        src_ds = gdal.Open(input_path)
        if src_ds is None:
            raise FileNotFoundError("Could not open input file.")

        # VRT Optionen: Zwinge Projektion und Bounds (-180, 90, 180, -90)
        vrt_options = gdal.TranslateOptions(
            format="VRT",
            outputSRS="EPSG:4326",
            outputBounds=[-180, 90, 180, -90]
        )
        # Erstelle das VRT im Speicher ("")
        ds = gdal.Translate("", src_ds, options=vrt_options)
        
    except Exception as e:
        print(f"\n[FATAL ERROR] Konnte Input-Bild nicht vorbereiten: {e}")
        return

    # Wähle Resampling Algorithmus
    if layer_type == 'color':
        resample_alg = gdal.GRA_Lanczos
    else:
        resample_alg = gdal.GRA_Cubic

    # 2. TILE LOOP
    for z in range(MAX_ZOOM + 1):
        num_cols = 2 * (2 ** z)
        num_rows = 1 * (2 ** z)
        
        print(f"Processing Zoom {z}: {num_cols}x{num_rows} tiles...")

        deg_per_tile_x = 360.0 / num_cols
        deg_per_tile_y = 180.0 / num_rows

        for y in range(num_rows):
            for x in range(num_cols):
                # Berechne Fenster
                ulx = -180.0 + (x * deg_per_tile_x)
                uly = 90.0 - (y * deg_per_tile_y)
                lrx = ulx + deg_per_tile_x
                lry = uly - deg_per_tile_y

                # Output Pfad
                dir_path = os.path.join(output_root, str(z), str(x))
                os.makedirs(dir_path, exist_ok=True)
                output_filename = os.path.join(dir_path, f"{y}.{format_ext}")

                # 3. CONVERSION OPTIONS
                # WICHTIG: Wenn Input 16-Bit ist und Output JPG, müssen wir skalieren!
                # Wir skalieren den gesamten 16-Bit Range (0-65535) auf Byte (0-255).
                scale_params = None
                output_type = gdal.GDT_Unknown
                
                if format_ext == 'jpg':
                    output_type = gdal.GDT_Byte # Zwinge 8-Bit für JPG
                    # scaleParams=[[src_min, src_max, dst_min, dst_max]]
                    scale_params = [[0, 65535, 0, 255]]

                options = gdal.TranslateOptions(
                    projWin=[ulx, uly, lrx, lry],
                    width=TILE_SIZE,
                    height=TILE_SIZE,
                    format='JPEG' if format_ext == 'jpg' else 'PNG',
                    resampleAlg=resample_alg,
                    outputType=output_type,
                    scaleParams=scale_params,
                    creationOptions=['QUALITY=90'] if format_ext == 'jpg' else ['COMPRESSION=DEFLATE']
                )

                try:
                    gdal.Translate(output_filename, ds, options=options)
                except Exception as e:
                    print(f"[ERROR] Z{z}-X{x}-Y{y} failed: {e}")

    print("\n[SUCCESS] Pipeline finished.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--type", default='color')
    parser.add_argument("--format", default='jpg')
    args = parser.parse_args()
    generate_tiles(args.input, args.output, args.type, args.format)