import argparse
import os
import sys
import numpy as np
from osgeo import gdal

def print_bar(label, value, max_val, length=30):
    """Zeichnet einen einfachen ASCII-Balken für das Terminal."""
    if max_val == 0:
        bar_len = 0
    else:
        bar_len = int((value / max_val) * length)
    bar = '#' * bar_len
    print(f"{label:12} | {bar:<{length}} ({value})")

def analyze_dem(path):
    if not os.path.exists(path):
        print(f"FEHLER: Datei nicht gefunden: {path}")
        return

    print(f"\n--- ANALYSE DER VERTEILUNG: {os.path.basename(path)} ---")
    
    gdal.UseExceptions()
    try:
        ds = gdal.Open(path)
        band = ds.GetRasterBand(1)
        
        # 1. Metadaten (NoData Wert)
        nodata = band.GetNoDataValue()
        print(f"NoData-Wert im Header: {nodata}")

        # --- NEU: Skalierung & Offset prüfen ---
        scale = band.GetScale()
        offset = band.GetOffset()
        
        print("\n--- Metadaten-Check (Skalierung) ---")
        if scale is not None and scale != 1.0:
            print(f"[!] Skalierungsfaktor gefunden: {scale}")
            print("    Das bedeutet: Echter Wert = Pixelwert * {scale}")
        else:
            print("Kein Skalierungsfaktor definiert (Standard: 1.0).")
            # Wir setzen es auf 1.0 für die Berechnungen
            scale = 1.0

        if offset is not None and offset != 0.0:
            print(f"[!] Offset gefunden: {offset}")
            print("    Das bedeutet: Echter Wert = Pixelwert + {offset}")
        else:
            print("Kein Offset definiert (Standard: 0.0).")
            offset = 0.0
        # ----------------------------------------

        # 2. Statistik (Min/Max der ROHTATEN)
        print("\nBerechne exaktes Min/Max der Rohdaten (bitte warten)...")
        min_val, max_val = band.ComputeRasterMinMax(True)
        print(f"Rohdaten Minimum: {min_val:.2f}")
        print(f"Rohdaten Maximum: {max_val:.2f}")

        # Falls Scale/Offset existieren, zeigen wir auch die korrigierten Werte
        if scale != 1.0 or offset != 0.0:
            real_min = min_val * scale + offset
            real_max = max_val * scale + offset
            print(f"-> KORRIGIERT (mit Scale/Offset): {real_min:.2f} bis {real_max:.2f}")

        # 3. Verteilung analysieren
        w = ds.RasterXSize
        h = ds.RasterYSize
        downsample_factor = max(1, max(w, h) // 2048)
        
        print(f"\nLese Daten für Statistik (Downsampling Faktor: {downsample_factor})...")
        data = band.ReadAsArray(0, 0, w, h, buf_xsize=w//downsample_factor, buf_ysize=h//downsample_factor)
        data = data.flatten()
        
        # NoData und NaN filtern
        if nodata is not None:
            data = data[data != nodata]
        data = data[~np.isnan(data)]

        if len(data) == 0:
            print("Warnung: Keine gültigen Datenpunkte gefunden.")
            return

        # 4. Perzentile (Auf Rohdaten basierend)
        print("\n--- Perzentile (Basierend auf Rohdaten) ---")
        p_vals = [0.1, 1, 5, 25, 50, 75, 95, 99, 99.9]
        percentiles = np.percentile(data, p_vals)
        
        for p, val in zip(p_vals, percentiles):
            print(f" {p:5}% der Daten sind kleiner als: {val:10.2f}")

        # 5. Diagnose & Empfehlung
        print("\n--- DIAGNOSE & EMPFEHLUNG ---")
        
        # Wir prüfen die Größenordnung der Rohdaten
        abs_max = max(abs(min_val), abs(max_val))
        
        if abs_max > 2000000: # Werte im Millionenbereich
            print(f"[!] HINWEIS: Die Werte sind extrem groß (Millionenbereich).")
            
            if scale == 1.0:
                print("    Da kein Scale-Faktor in der Datei steht, sind dies vermutlich Millimeter.")
                print("    -> EMPFEHLUNG: Nutze im Tiler den Faktor 0.001.")
            else:
                print(f"    Es ist ein Scale-Faktor ({scale}) definiert.")
                print("    Prüfe, ob GDAL diesen beim Lesen automatisch anwendet oder nicht.")

        elif abs_max > 100000: # Werte im Hunderttausender-Bereich
             print("[!] HINWEIS: Werte sind sehr groß (Hunderttausende).")
             print("    Könnten dies Zentimeter sein? (Faktor 0.01 nötig?)")
             
        elif abs_max < 30000:
            print("[OK] Die Werte sehen nach plausiblen Metern aus.")
            
    except Exception as e:
        print(f"Ein Fehler ist aufgetreten: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Analysiert Verteilung, Ausreißer und Metadaten in GeoTIFFs.")
    parser.add_argument("datei", help="Pfad zur TIF-Datei")
    args = parser.parse_args()
    
    analyze_dem(args.datei)