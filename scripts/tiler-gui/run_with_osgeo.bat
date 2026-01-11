@echo off
REM Wrapper to run Python with OSGeo4W environment
REM Assumes OSGeo4W is installed at C:\OSGeo4W

if exist "C:\Users\Bernhard\AppData\Local\Programs\OSGeo4W\bin\o4w_env.bat" (
    call "C:\Users\Bernhard\AppData\Local\Programs\OSGeo4W\bin\o4w_env.bat"
) else (
    echo [ERROR] o4w_env.bat not found.
    echo Please edit this file to point to your OSGeo4W installation.
    exit /b 1
)

python %*
