@echo off
SETLOCAL EnableDelayedExpansion

REM --- Configuration ---
SET "O4W_ENV=%USERPROFILE%\AppData\Local\Programs\OSGeo4W\bin\o4w_env.bat"

if not exist "%O4W_ENV%" (
    echo [ERROR] OSGeo4W environment not found at %O4W_ENV%
    exit /b 1
)

echo [INFO] Setting up OSGeo4W environment...
SET "PRE_O4W_PATH=%PATH%"
call "%O4W_ENV%"
REM o4w_env.bat often resets the path to a 'clean' version, which can lose the C++ compiler. 
REM We append the previous path back to ensure cl.exe/g++ stay available.
SET "PATH=%PATH%;%PRE_O4W_PATH%"

echo [INFO] Compiling s2_preprocessor.cpp...

REM Try g++ first
g++ --version >nul 2>&1
if !errorlevel! equ 0 goto USE_GPP

REM Try MSVC
cl >nul 2>&1
if !errorlevel! neq 9009 goto USE_MSVC

echo [ERROR] No C++ compiler found (g++ or cl.exe). 
exit /b 1

:USE_GPP
echo [INFO] Using g++...
g++ -O3 -std=c++17 -fopenmp s2_preprocessor.cpp -o s2_preprocessor.exe -lgdal
if !errorlevel! neq 0 (
    echo [ERROR] s2_preprocessor compilation failed.
    exit /b 1
)
echo [SUCCESS] All tools created.
exit /b 0

:USE_MSVC
echo [INFO] Using MSVC (cl.exe)...
cl /O2 /std:c++17 /EHsc /openmp s2_preprocessor.cpp /Fe:s2_preprocessor.exe /I"%OSGEO4W_ROOT%\include" /link /LIBPATH:"%OSGEO4W_ROOT%\lib" gdal_i.lib
if !errorlevel! neq 0 (
    echo [ERROR] s2_preprocessor compilation failed.
    exit /b 1
)
echo [SUCCESS] All tools created.
exit /b 0
