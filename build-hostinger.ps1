# ============================================
# Script de Build para Hostinger - EscapaUY
# ============================================

Write-Host "Iniciando build para produccion..." -ForegroundColor Cyan
Write-Host ""

# 0. Verificar que existan imagenes en public/images
Write-Host "Verificando estructura de archivos..." -ForegroundColor Yellow
if (-not (Test-Path "public/images")) {
    Write-Host "ADVERTENCIA: La carpeta public/images no existe" -ForegroundColor Red
    Write-Host "Por favor, crea la carpeta y anade tus imagenes antes de continuar" -ForegroundColor Yellow
    Write-Host ""
}
if (-not (Test-Path "public/.htaccess")) {
    Write-Host "ADVERTENCIA: El archivo public/.htaccess no existe" -ForegroundColor Red
    Write-Host "Este archivo es necesario para que las rutas funcionen en Hostinger" -ForegroundColor Yellow
    Write-Host ""
}
Write-Host "Verificacion completada" -ForegroundColor Green
Write-Host ""

# 1. Limpiar build anterior
Write-Host "Limpiando build anterior..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-Host "Carpeta dist eliminada" -ForegroundColor Green
}

# 2. Ejecutar build
Write-Host ""
Write-Host "Ejecutando npm run build..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error en el build. Revisa los errores arriba." -ForegroundColor Red
    exit 1
}

Write-Host "Build completado exitosamente" -ForegroundColor Green

# 3. Crear ZIP para Hostinger
Write-Host ""
Write-Host "Creando archivo ZIP para Hostinger..." -ForegroundColor Yellow

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$zipName = "escapauy-hostinger-$timestamp.zip"

# Comprimir contenido de dist manteniendo estructura de carpetas
# Cambiar al directorio dist temporalmente
Push-Location dist
Compress-Archive -Path * -DestinationPath "..\$zipName" -Force
Pop-Location

Write-Host "Archivo creado: $zipName" -ForegroundColor Green

# 4. Mostrar resumen
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "BUILD COMPLETADO EXITOSAMENTE" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Carpeta de build: dist/" -ForegroundColor White
Write-Host "Archivo para subir: $zipName" -ForegroundColor White
Write-Host ""
Write-Host "PROXIMOS PASOS PARA HOSTINGER:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Ve a tu panel de Hostinger (hpanel)" -ForegroundColor White
Write-Host "2. Ve a Sitios Web > Selecciona tu dominio" -ForegroundColor White
Write-Host "3. Haz clic en Administrador de archivos" -ForegroundColor White
Write-Host "4. Ve a la carpeta public_html/app_escapauy" -ForegroundColor White
Write-Host "5. ELIMINA todo el contenido actual" -ForegroundColor Red
Write-Host "6. Sube y DESCOMPRIME el archivo: $zipName" -ForegroundColor White
Write-Host "7. Asegurate que los archivos esten directamente en app_escapauy" -ForegroundColor White
Write-Host ""
Write-Host "IMPORTANTE:" -ForegroundColor Yellow
Write-Host "- El archivo .htaccess DEBE estar en app_escapauy" -ForegroundColor White
Write-Host "- El archivo index.html DEBE estar en app_escapauy" -ForegroundColor White
Write-Host "- La carpeta assets/ DEBE estar en app_escapauy" -ForegroundColor White
Write-Host "- La carpeta images/ DEBE estar en app_escapauy" -ForegroundColor White
Write-Host ""
Write-Host "Tu sitio estara disponible en tu subdominio" -ForegroundColor Green
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
