@echo off
REM Wrapper to run Python with OSGeo4W environment
REM Assumes OSGeo4W is installed at C:\OSGeo4W

if exist "%USERPROFILE%\AppData\Local\Programs\OSGeo4W\bin\o4w_env.bat" (
    call "%USERPROFILE%\AppData\Local\Programs\OSGeo4W\bin\o4w_env.bat"
) else (
    echo [ERROR] o4w_env.bat not found.
    echo Please edit this file to point to your OSGeo4W installation.
    exit /b 1
)

REM If the first argument is a Python script, use the python interpreter.
REM Otherwise, execute the command directly (for .exe or other tools).
set "FIRST_ARG=%~1"
set "EXT=%~x1"

if /I "%EXT%"==".py" (
    python -u %*
) else (
    %*
)
