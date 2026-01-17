@echo off
call "%USERPROFILE%\AppData\Local\Programs\OSGeo4W\bin\o4w_env.bat"
python inspect_metadata.py %*
