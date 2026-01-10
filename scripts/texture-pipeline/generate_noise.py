import numpy as np
from noise import pnoise2
from PIL import Image

def generate_sharp_perlin_detail(size=1024, scale=10.0, octaves=8, persistence=0.5, lacunarity=2.0):
    """
    Generiert eine scharfe, nahtlose Perlin-Noise-Textur für Detail-Maps.
    
    Parameter:
    - size: Größe des Bildes in Pixeln (quadratisch).
    - scale: Steuert die "Größe" des Rauschens. KLEINER = SCHÄRFER/FEINER.
    - octaves: Anzahl der Detail-Ebenen. MEHR = FEINER.
    - persistence: Wie stark jede nachfolgende Oktave beiträgt (0.0 - 1.0).
    - lacunarity: Wie stark die Frequenz jeder Oktave zunimmt.
    """
    
    # Leeres Array für die Rauschwerte erstellen
    noise_data = np.zeros((size, size))
    
    # Perlin Noise Loop
    # Wir iterieren über jedes Pixel und berechnen den Rauschwert.
    for i in range(size):
        for j in range(size):
            # pnoise2 generiert fractal noise basierend auf den Parametern.
            # repeatx=size und repeaty=size sorgen für die Nahtlosigkeit (Kachelbarkeit).
            val = pnoise2(i / scale, 
                          j / scale, 
                          octaves=octaves, 
                          persistence=persistence, 
                          lacunarity=lacunarity, 
                          repeatx=size, 
                          repeaty=size, 
                          base=0)
            
            noise_data[i][j] = val
            
    # Normalisieren auf 0-255 für das Bild
    # Die Rohwerte von pnoise2 liegen etwa zwischen -1.0 und 1.0.
    # Wir verschieben den Bereich und skalieren ihn.
    
    # 1. Min/Max Werte finden für eine robuste Normalisierung
    min_val = noise_data.min()
    max_val = noise_data.max()
    
    # 2. Werte auf den Bereich 0.0 - 1.0 strecken
    normalized_data = (noise_data - min_val) / (max_val - min_val)
    
    # 3. Auf 0 - 255 skalieren und in uint8 umwandeln
    final_data = (normalized_data * 255).astype(np.uint8)
            
    # Bild aus dem Array erstellen (Modus 'L' für Graustufen)
    img = Image.fromarray(final_data, mode='L')
    
    # Speichern
    output_filename = "detail_perlin_sharp.jpg"
    # Speichern als JPEG mit hoher Qualität
    img.save(output_filename, quality=95)
    print(f"Scharfe, nahtlose Perlin-Textur gespeichert als: {output_filename}")

# Skript ausführen
if __name__ == "__main__":
    # Wir verwenden die neuen, für Schärfe optimierten Standardwerte
    generate_sharp_perlin_detail()