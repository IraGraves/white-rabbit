@echo off
call "%USERPROFILE%\AppData\Local\Programs\OSGeo4W\bin\o4w_env.bat"
cl /O2 /std:c++17 /EHsc /openmp s2_preprocessor.cpp S2Math.cpp Resampling.cpp /Fe:s2_preprocessor.exe /I"%OSGEO4W_ROOT%\include" /link /LIBPATH:"%OSGEO4W_ROOT%\lib" gdal_i.lib > debug_errors.txt 2>&1
