
import numpy as np
from osgeo import gdal, osr
import os

def create_face(path, val):
    size = 256
    driver = gdal.GetDriverByName('GTiff')
    ds = driver.Create(path, size, size, 1, gdal.GDT_Float32)
    band = ds.GetRasterBand(1)
    arr = np.full((size, size), val, dtype=np.float32)
    band.WriteArray(arr)
    
    # Add Moon SRS
    srs = osr.SpatialReference()
    srs.ImportFromProj4("+proj=longlat +a=1738140 +b=1735970 +no_defs")
    ds.SetProjection(srs.ExportToWkt())
    
    # S2 Faces are usually pixel-space in VRT, so GeoTransform is dummy
    ds.SetGeoTransform([0, 1, 0, 0, 0, -1])
    ds = None

def main():
    out_dir = "synthetic_moon"
    if not os.path.exists(out_dir): os.makedirs(out_dir)
    
    for f in range(6):
        create_face(f"{out_dir}/flat_face{f}.tif", 0.0)
        create_face(f"{out_dir}/color_face{f}.tif", 128.0) # Grey
        
    print(f"Created synthetic faces in {out_dir}")

if __name__ == "__main__":
    main()
