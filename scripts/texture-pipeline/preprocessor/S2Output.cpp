#include "S2Output.h"
#include "gdal_priv.h"
#include <iostream>
#include <fstream>
#include <iomanip>

void VerifyOutput(const std::string& out_path) {
    GDALDataset* poVerifyDS = (GDALDataset*)GDALOpen(out_path.c_str(), GA_ReadOnly);
    if (poVerifyDS) {
         int w = poVerifyDS->GetRasterXSize();
         int h = poVerifyDS->GetRasterYSize();
         int b = poVerifyDS->GetRasterCount();
         GDALRasterBand* band = poVerifyDS->GetRasterBand(1);
         GDALDataType dt = band->GetRasterDataType();
         const char* comp = poVerifyDS->GetMetadataItem("COMPRESSION", "IMAGE_STRUCTURE");
         const char* photo = poVerifyDS->GetMetadataItem("PHOTOMETRIC", "IMAGE_STRUCTURE");
         const char* pred = poVerifyDS->GetMetadataItem("PREDICTOR", "IMAGE_STRUCTURE");
         
         // Get File Size
         std::ifstream in(out_path, std::ifstream::ate | std::ifstream::binary);
         long long fileSize = in.tellg(); 
         double mb = (double)fileSize / (1024.0 * 1024.0);

         std::cout << "[INFO] Verified Output: " << out_path << std::endl;
         std::cout << "       Size: " << w << "x" << h << "x" << b << " Type: " << GDALGetDataTypeName(dt) << std::endl;
         std::cout << "       Compression: " << (comp ? comp : "None") << " Predictor: " << (pred ? pred : "None") << std::endl;
         std::cout << "       Photometric: " << (photo ? photo : "Unknown") << std::endl;
         std::cout << "       File On Disk: " << std::fixed << std::setprecision(2) << mb << " MB" << std::endl;
         
         GDALClose((GDALDatasetH)poVerifyDS);
    }
}
