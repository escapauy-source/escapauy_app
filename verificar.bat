@echo off
echo ============================================
echo Verificacion Manual - EscapaUY
echo ============================================
echo.

echo Verificando Node.js...
node --version
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js no esta instalado
    pause
    exit /b 1
)
echo OK - Node.js instalado
echo.

echo Verificando npm...
npm --version
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm no esta instalado
    pause
    exit /b 1
)
echo OK - npm instalado
echo.

echo Verificando archivos del proyecto...
if exist package.json (
    echo OK - package.json encontrado
) else (
    echo ERROR - package.json NO encontrado
    pause
    exit /b 1
)

if exist node_modules (
    echo OK - node_modules encontrado
) else (
    echo ADVERTENCIA - node_modules NO encontrado
    echo Ejecuta: npm install
)

if exist .env.production (
    echo OK - .env.production encontrado
) else (
    echo ERROR - .env.production NO encontrado
    pause
    exit /b 1
)

if exist public\images (
    echo OK - public\images encontrado
) else (
    echo ERROR - public\images NO encontrado
    pause
    exit /b 1
)

if exist public\.htaccess (
    echo OK - .htaccess encontrado
) else (
    echo ADVERTENCIA - .htaccess NO encontrado
)

echo.
echo ============================================
echo TODO LISTO PARA EL BUILD!
echo ============================================
echo.
echo Ahora ejecuta: npm run build
echo.
pause
