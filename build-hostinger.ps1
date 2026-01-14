# ============================================
# Script de Build para Hostinger - EscapaUY
# ============================================

Write-Host "🚀 Iniciando build para producción..." -ForegroundColor Cyan
Write-Host ""

# 1. Limpiar build anterior
Write-Host "🧹 Limpiando build anterior..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-Host "✅ Carpeta dist eliminada" -ForegroundColor Green
}

# 2. Ejecutar build
Write-Host ""
Write-Host "📦 Ejecutando npm run build..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error en el build. Revisa los errores arriba." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build completado exitosamente" -ForegroundColor Green

# 3. Crear ZIP para Hostinger
Write-Host ""
Write-Host "📦 Creando archivo ZIP para Hostinger..." -ForegroundColor Yellow

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$zipName = "escapauy-hostinger-$timestamp.zip"

# Comprimir carpeta dist
Compress-Archive -Path "dist\*" -DestinationPath $zipName -Force

Write-Host "✅ Archivo creado: $zipName" -ForegroundColor Green

# 4. Mostrar resumen
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "✨ BUILD COMPLETADO EXITOSAMENTE" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📁 Carpeta de build: dist/" -ForegroundColor White
Write-Host "📦 Archivo para subir: $zipName" -ForegroundColor White
Write-Host ""
Write-Host "📋 PRÓXIMOS PASOS PARA HOSTINGER:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Ve a tu panel de Hostinger (hpanel)" -ForegroundColor White
Write-Host "2. Ve a 'Sitios Web' > Selecciona tu dominio" -ForegroundColor White
Write-Host "3. Haz clic en 'Administrador de archivos'" -ForegroundColor White
Write-Host "4. Ve a la carpeta 'public_html'" -ForegroundColor White
Write-Host "5. ELIMINA todo el contenido actual de public_html" -ForegroundColor Red
Write-Host "6. Sube y DESCOMPRIME el archivo: $zipName" -ForegroundColor White
Write-Host "7. Asegúrate que los archivos estén en public_html (no en una subcarpeta)" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  IMPORTANTE:" -ForegroundColor Yellow
Write-Host "   - El archivo .htaccess DEBE estar en public_html" -ForegroundColor White
Write-Host "   - El archivo index.html DEBE estar en public_html" -ForegroundColor White
Write-Host "   - La carpeta assets/ DEBE estar en public_html" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Tu sitio estará disponible en tu dominio principal" -ForegroundColor Green
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
