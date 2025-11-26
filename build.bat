@echo off
REM Build frontend
cd frontend
call npm install
call npm run build

REM Copy build to backend static resources
if not exist "..\backend\src\main\resources\static" mkdir "..\backend\src\main\resources\static"
xcopy /E /Y build\* ..\backend\src\main\resources\static\

REM Build backend
cd ..\backend
call mvn clean package -DskipTests

echo Build complete!