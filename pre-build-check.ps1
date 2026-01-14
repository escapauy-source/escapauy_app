# ============================================
# Pre-Build Checklist - EscapaUY
# ============================================

Write-Host "🔍 Verificando configuración antes del build..." -ForegroundColor Cyan
Write-Host ""

$errors = 0
$warnings = 0

# Verificar Node.js
Write-Host "Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js no está instalado o no está en PATH" -ForegroundColor Red
    $errors++
}

# Verificar npm
Write-Host "Verificando npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✅ npm: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm no está instalado" -ForegroundColor Red
    $errors++
}

# Verificar package.json
Write-Host "Verificando package.json..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    Write-Host "✅ package.json encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ package.json NO encontrado" -ForegroundColor Red
    $errors++
}

# Verificar node_modules
Write-Host "Verificando dependencias..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✅ node_modules encontrado" -ForegroundColor Green
} else {
    Write-Host "⚠️  node_modules NO encontrado. Ejecuta: npm install" -ForegroundColor Yellow
    $warnings++
}

# Verificar .env.production
Write-Host "Verificando variables de entorno..." -ForegroundColor Yellow
if (Test-Path ".env.production") {
    Write-Host "✅ .env.production encontrado" -ForegroundColor Green
    
    $envContent = Get-Content ".env.production" -Raw
    
    # Verificar variables críticas
    if ($envContent -match "VITE_SUPABASE_URL") {
        Write-Host "  ✅ VITE_SUPABASE_URL configurado" -ForegroundColor Green
    } else {
        Write-Host "  ❌ VITE_SUPABASE_URL NO configurado" -ForegroundColor Red
        $errors++
    }
    
    if ($envContent -match "VITE_SUPABASE_ANON_KEY") {
        Write-Host "  ✅ VITE_SUPABASE_ANON_KEY configurado" -ForegroundColor Green
    } else {
        Write-Host "  ❌ VITE_SUPABASE_ANON_KEY NO configurado" -ForegroundColor Red
        $errors++
    }
} else {
    Write-Host "❌ .env.production NO encontrado" -ForegroundColor Red
    $errors++
}

# Verificar public/images
Write-Host "Verificando carpeta de imágenes..." -ForegroundColor Yellow
if (Test-Path "public/images") {
    $imageCount = (Get-ChildItem "public/images" -File).Count
    Write-Host "✅ public/images encontrado ($imageCount imágenes)" -ForegroundColor Green
    
    # Verificar imágenes críticas
    $criticalImages = @("logo-main.png", "favicon.png")
    foreach ($img in $criticalImages) {
        if (Test-Path "public/images/$img") {
            Write-Host "  ✅ $img encontrado" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️  $img NO encontrado" -ForegroundColor Yellow
            $warnings++
        }
    }
} else {
    Write-Host "❌ public/images NO encontrado" -ForegroundColor Red
    $errors++
}

# Verificar .htaccess
Write-Host "Verificando .htaccess..." -ForegroundColor Yellow
if (Test-Path "public/.htaccess") {
    Write-Host "✅ .htaccess encontrado en public/" -ForegroundColor Green
} else {
    Write-Host "⚠️  .htaccess NO encontrado en public/" -ForegroundColor Yellow
    Write-Host "   Se creará automáticamente durante el build" -ForegroundColor Gray
    $warnings++
}

# Verificar vite.config.ts
Write-Host "Verificando vite.config.ts..." -ForegroundColor Yellow
if (Test-Path "vite.config.ts") {
    $viteConfig = Get-Content "vite.config.ts" -Raw
    if ($viteConfig -match 'base:\s*["\']\/["\']') {
        Write-Host "✅ vite.config.ts configurado correctamente (base: '/')" -ForegroundColor Green
    } else {
        Write-Host "⚠️  vite.config.ts: base debería ser '/' para Hostinger" -ForegroundColor Yellow
        $warnings++
    }
} else {
    Write-Host "❌ vite.config.ts NO encontrado" -ForegroundColor Red
    $errors++
}

# Resumen
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "RESUMEN DE VERIFICACIÓN" -ForegroundColor White
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

if ($errors -eq 0 -and $warnings -eq 0) {
    Write-Host "✨ TODO LISTO PARA EL BUILD ✨" -ForegroundColor Green
    Write-Host ""
    Write-Host "Puedes ejecutar:" -ForegroundColor White
    Write-Host "  .\build-hostinger.ps1" -ForegroundColor Cyan
    Write-Host ""
} elseif ($errors -eq 0) {
    Write-Host "⚠️  $warnings advertencia(s) encontrada(s)" -ForegroundColor Yellow
    Write-Host "Puedes continuar, pero revisa las advertencias arriba" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "❌ $errors error(es) crítico(s) encontrado(s)" -ForegroundColor Red
    Write-Host "Debes corregir los errores antes de hacer el build" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "================================================" -ForegroundColor Cyan
