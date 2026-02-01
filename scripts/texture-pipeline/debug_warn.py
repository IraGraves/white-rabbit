from osgeo import gdal, osr
import numpy as np
import os

def test_repro():
    # 1. Create a dummy source file (Projected, NoData=0)
    src_filename = "debug_src.tif"
    driver = gdal.GetDriverByName("GTiff")
    ds = driver.Create(src_filename, 512, 512, 1, gdal.GDT_Byte)
    
    # Set Projected SRS (e.g., Pseudo Mercator) to force AutoWarp
    srs = osr.SpatialReference()
    srs.ImportFromEPSG(3857) 
    ds.SetProjection(srs.ExportToWkt())
    ds.SetGeoTransform([0, 10, 0, 0, 0, -10])
    
    # Set NoData = 0
    band = ds.GetRasterBand(1)
    band.SetNoDataValue(0)
    
    # Fill with some data (0=black background, 100=content)
    data = np.zeros((512, 512), dtype=np.uint8)
    data[100:400, 100:400] = 100
    band.WriteArray(data)
    ds.FlushCache()
    ds = None # Close to save

    print("--- Created Source File: Projected, NoData=0 ---")

    # 2. Open and Attempt AutoReprojection mimicking C++
    # 2. Open and Attempt AutoReprojection mimicking C++ (ReadOnly is default/likely used)
    src_ds = gdal.Open(src_filename, gdal.GA_ReadOnly) # Changed to ReadOnly
    
    print("Trying Fix: DeleteNoDataValue on Source BEFORE Warp...")
    # TEST: Uncomment checking if this actually works in memory
    src_ds.GetRasterBand(1).DeleteNoDataValue() 
    
    val = src_ds.GetRasterBand(1).GetNoDataValue()
    print(f"Source NoData after Delete check: {val}")

    # AutoCreateWarpedVRT
    print("Creating AutoWarpedVRT...")
    vrt_ds = gdal.AutoCreateWarpedVRT(src_ds, None, None, gdal.GRA_NearestNeighbour)
    
    if vrt_ds:
        print("VRT Created.")
        nd = vrt_ds.GetRasterBand(1).GetNoDataValue()
        print(f"VRT Inherited NoData Value: {nd}")
        
        if nd is not None:
             print("FAILURE: VRT still inherited NoData!")
        else:
             print("SUCCESS: VRT has no NoData.")

        # Simulate Reading/Copying
        out_filename = "debug_out.tif"
        # gdal.Translate(out_filename, vrt_ds, noData=None) 
        
    else:
        print("Failed to create VRT")

    # Cleanup
    vrt_ds = None
    src_ds = None
    # os.remove(src_filename)
    # os.remove(out_filename)

if __name__ == "__main__":
    test_repro()
