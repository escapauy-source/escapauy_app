# Script para mover imágenes de /images a /public/images

$sourceDir = "C:\Users\susan\Desktop\escapauy\images"
$destDir = "C:\Users\susan\Desktop\escapauy\public\images"

# Crear directorios si no existen
if (-not (Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir -Force
}
if (-not (Test-Path "$destDir\seals")) {
    New-Item -ItemType Directory -Path "$destDir\seals" -Force
}

# Mover archivos de imágenes principales
Get-ChildItem -Path $sourceDir -File | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination $destDir -Force
    Write-Host "Copiado: $($_.Name)"
}

# Mover archivos de seals
Get-ChildItem -Path "$sourceDir\seals" -File | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination "$destDir\seals" -Force
    Write-Host "Copiado seal: $($_.Name)"
}

Write-Host ""
Write-Host "✅ ¡Imágenes copiadas exitosamente!" -ForegroundColor Green
Write-Host "Ahora puedes eliminar la carpeta /images de la raíz si lo deseas."
