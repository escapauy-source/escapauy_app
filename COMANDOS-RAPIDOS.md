# 🚀 COMANDOS RÁPIDOS - EscapaUY

## Para Windows PowerShell

### 1️⃣ Verificar que todo esté listo
```powershell
.\pre-build-check.ps1
```

### 2️⃣ Generar el build para Hostinger
```powershell
.\build-hostinger.ps1
```

### 3️⃣ Build manual (si prefieres)
```powershell
npm run build
```

### 4️⃣ Ver el build localmente antes de subir
```powershell
npm run preview
```

### 5️⃣ Limpiar todo y empezar de nuevo
```powershell
Remove-Item -Recurse -Force dist, node_modules
npm install
npm run build
```

---

## Para Git Bash / Linux / Mac

### 1️⃣ Build de producción
```bash
npm run build
```

### 2️⃣ Crear ZIP manualmente
```bash
cd dist
zip -r ../escapauy-hostinger.zip .
cd ..
```

### 3️⃣ Ver el build localmente
```bash
npm run preview
```

---

## 📝 Notas Importantes

- El archivo ZIP debe contener **solo el contenido de la carpeta dist**, no la carpeta dist en sí
- Los archivos deben quedar directamente en `public_html`, no en una subcarpeta
- El `.htaccess` es crítico para que las rutas funcionen
- Si cambias `.env.production`, debes hacer un nuevo build

---

## 🔗 Enlaces Útiles

- Panel Hostinger: https://hpanel.hostinger.com
- Supabase Dashboard: https://supabase.com/dashboard
- Guía completa: Ver archivo `GUIA-HOSTINGER.md`

---

## ⚡ Orden de Ejecución Recomendado

1. `.\pre-build-check.ps1` - Verificar configuración
2. `.\build-hostinger.ps1` - Generar build y ZIP
3. Subir ZIP a Hostinger
4. Extraer en public_html
5. ¡Listo! 🎉
