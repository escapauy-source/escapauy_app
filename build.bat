@echo off
echo ============================================
echo Build para Hostinger - EscapaUY
echo ============================================
echo.

echo Limpiando build anterior...
if exist dist (
    rmdir /s /q dist
    echo OK - Carpeta dist eliminada
)
echo.

echo Ejecutando npm run build...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: El build fallo. Revisa los errores arriba.
    pause
    exit /b 1
)

echo.
echo ============================================
echo BUILD COMPLETADO EXITOSAMENTE!
echo ============================================
echo.
echo La carpeta 'dist' contiene tu aplicacion lista para Hostinger
echo.
echo PROXIMOS PASOS:
echo 1. Comprime la carpeta 'dist' en un archivo ZIP
echo 2. Ve a Hostinger - Administrador de archivos
echo 3. Navega a public_html y ELIMINA todo el contenido
echo 4. Sube el ZIP y extraelo
echo 5. Verifica que los archivos esten directamente en public_html
echo.
pause
