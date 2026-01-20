import os
import glob
import rasterio
import xml.etree.ElementTree as ET
from xml.dom import minidom

# --- KONFIGURATION ---
INPUT_DIR = "D:/Mars_Tianwen"
OUTPUT_VRT = "D:/Mars_Tianwen/Mars_Global.vrt"

def create_vrt(input_dir, output_vrt):
    print(f"Scanne {input_dir} nach TIFFs...")
    tif_files = glob.glob(os.path.join(input_dir, "*.tif"))
    
    if not tif_files:
        print("Keine TIFF-Dateien gefunden!")
        return

    # 1. Globale Ausmaße bestimmen
    min_x, max_y = float('inf'), float('-inf')
    max_x, min_y = float('-inf'), float('inf')
    
    # Wir nehmen an, dass alle Tiles die gleiche Auflösung haben (Pixelgröße)
    pixel_width = 0.0
    pixel_height = 0.0
    
    tiles = []

    print("Analysiere Kacheln...")
    for f in tif_files:
        with rasterio.open(f) as src:
            bounds = src.bounds
            transform = src.transform
            width = src.width
            height = src.height
            
            # Pixelgröße (positiv)
            pixel_width = transform[0]
            pixel_height = -transform[4] # transform[4] ist meist negativ
            
            min_x = min(min_x, bounds.left)
            max_y = max(max_y, bounds.top)
            max_x = max(max_x, bounds.right)
            min_y = min(min_y, bounds.bottom)
            
            tiles.append({
                'file': f,
                'x': bounds.left,
                'y': bounds.top, # VRT nutzt Top-Left als Referenz für Offsets
                'width': width,
                'height': height,
                'transform': transform,
                'bands': src.count,
                'dtype': src.dtypes[0] # Annahme: alle Kanäle gleich
            })

    # Gesamtdimension in Pixeln
    total_width_px = int(round((max_x - min_x) / pixel_width))
    total_height_px = int(round((max_y - min_y) / pixel_height))
    
    print(f"Gesamt-Ausmaße: {total_width_px} x {total_height_px}")
    print(f"Bounds: [{min_x}, {min_y}, {max_x}, {max_y}]")

    # 2. VRT XML bauen
    # Root
    vrt_dataset = ET.Element("VRTDataset", rasterXSize=str(total_width_px), rasterYSize=str(total_height_px))
    
    # GeoTransform
    # (top_left_x, w_resolution, 0, top_left_y, 0, -h_resolution)
    geo_transform = f"{min_x},{pixel_width},0,{max_y},0,{-pixel_height}"
    ET.SubElement(vrt_dataset, "GeoTransform").text = geo_transform
    
    # SRS (WGS84)
    srs = 'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AXIS["Latitude",NORTH],AXIS["Longitude",EAST],AUTHORITY["EPSG","4326"]]'
    ET.SubElement(vrt_dataset, "SRS", dataAxisToSRSAxisMapping="2,1").text = srs
    
    # Bands hinzufügen
    num_bands = tiles[0]['bands']
    dtype = tiles[0]['dtype']
    
    # Mapping numpy/rasterio dtype to GDAL Type
    gdal_type = "Byte"
    if "int16" in dtype: gdal_type = "Int16"
    elif "float32" in dtype: gdal_type = "Float32"
    # ... weitere bei Bedarf
    
    for b in range(1, num_bands + 1):
        band = ET.SubElement(vrt_dataset, "VRTRasterBand", dataType=gdal_type, band=str(b))
        ET.SubElement(band, "ColorInterp").text = "Red" if b==1 else "Green" if b==2 else "Blue" if b==3 else "Undefined"
        
        # Sources für dieses Band hinzufügen (SimpleSource)
        for tile in tiles:
            # Berechne Destination Offset im VRT
            # DestX = (TileX - MinX) / Res
            # DestY = (MaxY - TileY) / Res
            
            dst_x = int(round((tile['x'] - min_x) / pixel_width))
            dst_y = int(round((max_y - tile['y']) / pixel_height))
            
            src_xml = ET.SubElement(band, "SimpleSource")
            ET.SubElement(src_xml, "SourceFilename", relativeToVRT="0").text = tile['file']
            ET.SubElement(src_xml, "SourceBand").text = str(b)
            
            # Source und Dest Properties
            # SrcRect: xOff, yOff, xSize, ySize (innerhalb des Tiles) -> immer 0,0,w,h
            ET.SubElement(src_xml, "SrcRect", xOff="0", yOff="0", xSize=str(tile['width']), ySize=str(tile['height']))
            # DstRect: xOff, yOff, xSize, ySize (innerhalb des VRTs)
            ET.SubElement(src_xml, "DstRect", xOff=str(dst_x), yOff=str(dst_y), xSize=str(tile['width']), ySize=str(tile['height']))

    # Schreiben
    xml_str = minidom.parseString(ET.tostring(vrt_dataset)).toprettyxml(indent="  ")
    with open(output_vrt, "w") as f:
        f.write(xml_str)
        
    print(f"VRT erstellt: {output_vrt}")

if __name__ == "__main__":
    create_vrt(INPUT_DIR, OUTPUT_VRT)
