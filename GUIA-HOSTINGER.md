# 🚀 Guía de Despliegue en Hostinger - EscapaUY

## 📋 Requisitos Previos

✅ Node.js instalado
✅ Proyecto funcionando localmente
✅ Cuenta de Hostinger con acceso al panel
✅ Dominio configurado

---

## 🔧 Paso 1: Preparar el Build Local

### Opción A: Usar el Script Automático (Recomendado)

1. Abre PowerShell en la carpeta del proyecto:
   ```powershell
   cd C:\Users\susan\Desktop\escapauy
   ```

2. Ejecuta el script de build:
   ```powershell
   .\build-hostinger.ps1
   ```

3. Espera a que se complete. El script:
   - ✅ Limpiará la carpeta `dist` anterior
   - ✅ Ejecutará `npm run build`
   - ✅ Creará un ZIP con el nombre `escapauy-hostinger-[fecha].zip`
   - ✅ Te mostrará los próximos pasos

### Opción B: Build Manual

Si prefieres hacerlo manualmente:

1. Abre terminal/PowerShell:
   ```bash
   cd C:\Users\susan\Desktop\escapauy
   npm run build
   ```

2. Esto creará una carpeta `dist` con todos los archivos estáticos

3. Comprime manualmente la carpeta `dist` en un ZIP

---

## 🌐 Paso 2: Configurar Hostinger

### 2.1 Acceder al Panel de Hostinger

1. Ve a [https://hpanel.hostinger.com](https://hpanel.hostinger.com)
2. Inicia sesión con tu cuenta
3. En el menú lateral, haz clic en **"Sitios Web"**

### 2.2 Seleccionar tu Sitio

1. Localiza tu dominio (ejemplo: `escapauy.com`)
2. Haz clic en **"Administrar"**

### 2.3 Método Recomendado: Usar Administrador de Archivos

**Paso a paso:**

1. En el panel del sitio, busca **"Administrador de archivos"**
2. Haz clic para abrir el File Manager

3. **⚠️ MUY IMPORTANTE - Limpiar public_html:**
   - Navega a la carpeta `public_html`
   - **ELIMINA TODO** el contenido actual (selecciona todo y borra)
   - Esta carpeta debe quedar VACÍA antes de continuar

4. **Subir el ZIP:**
   - En `public_html`, haz clic en el botón **"Subir archivos"** (Upload)
   - Selecciona el archivo `escapauy-hostinger-[fecha].zip`
   - Espera a que se complete la carga

5. **Descomprimir:**
   - Haz clic derecho sobre el archivo ZIP
   - Selecciona **"Extraer"** o **"Extract"**
   - Asegúrate de extraer en la misma carpeta (`public_html`)
   - **ELIMINA el archivo ZIP** después de extraer

6. **Verificar la estructura:**
   
   Tu `public_html` debe verse así:
   ```
   public_html/
   ├── index.html
   ├── .htaccess
   ├── assets/
   │   ├── index-[hash].js
   │   ├── index-[hash].css
   │   └── ...
   └── images/
       ├── logo-main.png
       ├── favicon.png
       └── ...
   ```

   **⚠️ SI VES ESTO, ESTÁ MAL:**
   ```
   public_html/
   └── dist/          ❌ NO DEBE HABER UNA SUBCARPETA
       ├── index.html
       └── ...
   ```

7. **Si la estructura está mal:**
   - Mueve TODO el contenido de la subcarpeta `dist` a `public_html`
   - Elimina la carpeta `dist` vacía

---

## 🔍 Paso 3: Verificar el Despliegue

### 3.1 Verificar archivos críticos

En el Administrador de archivos de Hostinger, verifica que existan:

- ✅ `public_html/index.html`
- ✅ `public_html/.htaccess` (archivo oculto, puede que necesites activar "mostrar archivos ocultos")
- ✅ `public_html/assets/` (con archivos JS y CSS)
- ✅ `public_html/images/` (con tus imágenes)

### 3.2 Probar el sitio

1. Abre tu navegador
2. Ve a tu dominio: `https://tudominio.com`
3. Deberías ver la página de login de EscapaUY

### 3.3 Probar las rutas

Prueba estas URLs para verificar que React Router funcione:

- `https://tudominio.com/login` ✅
- `https://tudominio.com/dashboard` ✅
- `https://tudominio.com/terms` ✅

Si aparece un error 404, verifica que el archivo `.htaccess` esté en `public_html`

---

## 🐛 Solución de Problemas

### Problema 1: Página en blanco

**Síntomas:** El sitio carga pero solo ves una página en blanco

**Soluciones:**
1. Abre las DevTools del navegador (F12) y revisa la consola
2. Verifica que los archivos JS y CSS se estén cargando (pestaña Network)
3. Si ves errores 404, puede ser un problema de rutas
4. Verifica que `base: "/"` esté en el `vite.config.ts`

### Problema 2: Error 404 en las rutas

**Síntomas:** `/login` funciona pero `/dashboard` da error 404

**Solución:**
1. Verifica que el archivo `.htaccess` exista en `public_html`
2. Contenido del `.htaccess` debe ser:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

### Problema 3: Imágenes no cargan

**Síntomas:** El sitio funciona pero las imágenes no se ven

**Solución:**
1. Verifica que la carpeta `public_html/images/` exista
2. Verifica que las imágenes tengan los nombres correctos (case-sensitive en Linux)
3. Prueba acceder directamente: `https://tudominio.com/images/logo-main.png`

### Problema 4: CSS no se aplica

**Síntomas:** El sitio carga pero sin estilos

**Solución:**
1. Limpia la caché del navegador (Ctrl + Shift + R)
2. Verifica que la carpeta `assets` tenga archivos CSS
3. Revisa la consola del navegador por errores de CORS

### Problema 5: Variables de entorno no funcionan

**Síntomas:** Errores de conexión a Supabase o EmailJS

**Solución:**
1. Las variables de entorno están embebidas en el build
2. Si cambias `.env.production`, debes hacer un nuevo build
3. Verifica que las variables empiecen con `VITE_`

---

## 🔄 Actualizar el Sitio

Cuando hagas cambios y necesites actualizar:

1. Ejecuta nuevamente el script:
   ```powershell
   .\build-hostinger.ps1
   ```

2. Sube el nuevo ZIP a Hostinger

3. Extrae y reemplaza los archivos

**💡 Tip:** Puedes mantener un backup del ZIP anterior por si algo sale mal

---

## 📊 Monitoreo y Mantenimiento

### Logs de Errores

En Hostinger puedes ver los logs de errores:
1. Panel > Tu sitio > Avanzado > Error Log
2. Revisa regularmente por errores de PHP/Apache

### Performance

Para mejorar la velocidad:
1. Hostinger incluye caché automático
2. Habilita compresión GZIP (ya incluido en .htaccess)
3. Considera usar un CDN para las imágenes

---

## ✅ Checklist Final

Antes de dar por terminado el despliegue:

- [ ] El sitio carga en `https://tudominio.com`
- [ ] Puedes iniciar sesión
- [ ] Las rutas funcionan sin errores 404
- [ ] Las imágenes se ven correctamente
- [ ] Los estilos se aplican
- [ ] El favicon aparece
- [ ] Funciona en móvil
- [ ] Funciona en diferentes navegadores
- [ ] Supabase se conecta correctamente
- [ ] Los emails se envían (si aplica)

---

## 📞 Soporte

Si tienes problemas:

1. **Hostinger Support:** Chat 24/7 en hpanel.hostinger.com
2. **Documentación Hostinger:** https://support.hostinger.com
3. **Logs del proyecto:** Revisa la carpeta `dist` localmente

---

## 🎉 ¡Éxito!

Si completaste todos los pasos, tu aplicación EscapaUY debería estar funcionando perfectamente en Hostinger.

**URL de tu sitio:** https://tudominio.com

---

*Última actualización: Enero 2026*
