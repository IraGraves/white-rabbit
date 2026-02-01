import os
import glob
import argparse
import sys
from osgeo import gdal
import xml.etree.ElementTree as ET
from xml.dom import minidom
from concurrent.futures import ThreadPoolExecutor, as_completed

def create_vrt(input_dir, output_vrt, pattern="*.tif", relative=False):
    # Ensure output has .vrt extension
    if not output_vrt.lower().endswith('.vrt'):
        output_vrt += '.vrt'

    print(f"[INFO] Scanning {input_dir} for {pattern}...")
    files = glob.glob(os.path.join(input_dir, pattern))
    
    if not files:
        print("[WARN] No files found!")
        return

    print(f"[INFO] Found {len(files)} files. Analyzing metadata...")

    # 1. Analyze Extents
    min_x, max_y = float('inf'), float('-inf')
    max_x, min_y = float('-inf'), float('inf')
    
    tiles = []
    
    # Enable exceptions for cleaner error handling
    gdal.UseExceptions()

    # Use first file to determine pixel size and CRS
    try:
        ds = gdal.Open(files[0])
        gt = ds.GetGeoTransform()
        # GT: [0] = x_min, [1] = pixel_w, [2] = rot, [3] = y_max, [4] = rot, [5] = pixel_h (negative)
        
        real_pixel_w = gt[1]
        real_pixel_h = gt[5] # negative usually
        
        crs_wkt = ds.GetProjection()
        num_bands = ds.RasterCount
        # Map GDAL Type to String
        first_band = ds.GetRasterBand(1)
        dtype_code = first_band.DataType
        dtype = gdal.GetDataTypeName(dtype_code)
        ds = None
    except Exception as e:
        print(f"[ERROR] Reading first file {files[0]}: {e}")
        return

    def analyze_file(f):
        try:
            ds = gdal.Open(f)
            if not ds: return None
            gt = ds.GetGeoTransform()
            w = ds.RasterXSize
            h = ds.RasterYSize
            
            # Bounds
            left = gt[0]
            top = gt[3]
            
            return {
                'file': f,
                'x': left,
                'y': top,
                'width': w,
                'height': h,
                'gt': gt # Keep full transform
            }
        except Exception as e:
            print(f"[ERROR] Reading {f}: {e}")
            return None

    # Parallel analysis with custom progress reporting
    results = []
    total = len(files)
    completed = 0
    
    print(f"[PROGRESS] Analysis 0%")
    
    with ThreadPoolExecutor() as executor:
        futures = {executor.submit(analyze_file, f): f for f in files}
        
        for future in as_completed(futures):
            res = future.result()
            if res:
                results.append(res)
            
            completed += 1
            if completed % 10 == 0 or completed == total:
                 pct = int(completed / total * 100)
                 print(f"[PROGRESS] Analysis {pct}% ({completed}/{total})")
                 sys.stdout.flush()
        
    tiles = [t for t in results if t]
    skipped_count = len(files) - len(tiles)

    if not tiles:
        print("No valid tiles found after scanning. Exiting.")
        return

    print(f"Analysis Complete: {len(tiles)} valid tiles. {skipped_count} files skipped due to errors.")

    for t in tiles:
        min_x = min(min_x, t['x'])
        max_y = max(max_y, t['y'])
        
        # Calculate right/bottom based on local transform
        right = t['x'] + t['width'] * t['gt'][1]
        bottom = t['y'] + t['height'] * t['gt'][5]
        
        max_x = max(max_x, right)
        min_y = min(min_y, bottom)

    # Overall Dimensions
    # width = (max_x - min_x) / pixel_width
    total_width_px = int(round((max_x - min_x) / real_pixel_w))
    total_height_px = int(round((min_y - max_y) / real_pixel_h)) # (min_y - max_y) is negative, pixel_h is negative -> positive
    # Safety Check for zero dimension
    if total_width_px <= 0: total_width_px = 1
    if total_height_px <= 0: total_height_px = 1

    print(f"Total Extents: {total_width_px} x {total_height_px}")
    print(f"Bounds: [{min_x}, {min_y}, {max_x}, {max_y}]")

    # 2. Build XML
    vrt_dataset = ET.Element("VRTDataset", rasterXSize=str(total_width_px), rasterYSize=str(total_height_px))
    
    # GeoTransform: top_left_x, w_res, 0, top_left_y, 0, -h_res
    geo_transform = f"{min_x},{real_pixel_w},0,{max_y},0,{real_pixel_h}"
    ET.SubElement(vrt_dataset, "GeoTransform").text = geo_transform
    
    if crs_wkt:
        ET.SubElement(vrt_dataset, "SRS", dataAxisToSRSAxisMapping="2,1").text = crs_wkt

    for b in range(1, num_bands + 1):
        band = ET.SubElement(vrt_dataset, "VRTRasterBand", dataType=dtype, band=str(b))
        
        # Color Interp attempt
        color_interp = "Undefined"
        if num_bands == 1: color_interp = "Gray"
        elif b == 1: color_interp = "Red"
        elif b == 2: color_interp = "Green"
        elif b == 3: color_interp = "Blue"
        elif b == 4: color_interp = "Alpha"
        
        ET.SubElement(band, "ColorInterp").text = color_interp
        
        for tile in tiles:
            # Calculate dst offsets
            # dst_x = (src_x - origin_x) / pixel_w
            dst_x = int(round((tile['x'] - min_x) / real_pixel_w))
            dst_y = int(round((tile['y'] - max_y) / real_pixel_h)) # (y - max_y) is neg, pixel_h is neg -> pos
            
            src_xml = ET.SubElement(band, "SimpleSource")
            
            filepath = tile['file']
            rel_attr = "0"
            if relative:
                try:
                    filepath = os.path.relpath(filepath, os.path.dirname(output_vrt))
                    rel_attr = "1"
                except ValueError:
                    pass # Keep absolute if on different drive

            ET.SubElement(src_xml, "SourceFilename", relativeToVRT=rel_attr).text = filepath
            ET.SubElement(src_xml, "SourceBand").text = str(b)
            
            # SrcRect (Full Source)
            ET.SubElement(src_xml, "SrcRect", xOff="0", yOff="0", xSize=str(tile['width']), ySize=str(tile['height']))
            # DstRect (Offset in VRT)
            ET.SubElement(src_xml, "DstRect", xOff=str(dst_x), yOff=str(dst_y), xSize=str(tile['width']), ySize=str(tile['height']))

    # Write
    print(f"Writing {output_vrt}...")
    xml_str = minidom.parseString(ET.tostring(vrt_dataset)).toprettyxml(indent="  ")
    with open(output_vrt, "w") as f:
        f.write(xml_str)
    
    print("Done!")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Build VRT from raster tiles")
    parser.add_argument("--input-dir", required=True, help="Input directory")
    parser.add_argument("--output", required=True, help="Output VRT path")
    parser.add_argument("--pattern", default="*.tif", help="Glob pattern for files")
    parser.add_argument("--relative", action="store_true", help="Store relative paths")
    
    args = parser.parse_args()
    
    create_vrt(args.input_dir, args.output, args.pattern, args.relative)
