# 🌴 EscapaUY - Plataforma de Turismo

Plataforma de intermediación turística en Uruguay. Conectamos turistas con experiencias auténticas en Colonia.

---

## 🚀 Despliegue en Hostinger (HTML/PHP)

### ⚡ Inicio Rápido

1. **Verificar configuración:**
   ```powershell
   .\pre-build-check.ps1
   ```

2. **Generar build:**
   ```powershell
   .\build-hostinger.ps1
   ```

3. **Subir a Hostinger:**
   - Ve a tu panel de Hostinger
   - Administrador de archivos > public_html
   - Sube el archivo ZIP generado
   - Extrae el contenido
   - ¡Listo!

### 📚 Documentación Completa

- **[GUIA-HOSTINGER.md](./GUIA-HOSTINGER.md)** - Guía detallada paso a paso
- **[COMANDOS-RAPIDOS.md](./COMANDOS-RAPIDOS.md)** - Referencia rápida de comandos

---

## 🛠️ Desarrollo Local

### Requisitos
- Node.js 18+ 
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone <tu-repo>

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.production .env.local

# Iniciar servidor de desarrollo
npm run dev
```

### Scripts Disponibles

- `npm run dev` - Servidor de desarrollo (puerto 5173)
- `npm run build` - Build de producción
- `npm run preview` - Previsualizar build localmente
- `npm run lint` - Ejecutar linter

---

## 📁 Estructura del Proyecto

```
escapauy/
├── public/               # Archivos estáticos
│   ├── images/          # Imágenes del sitio
│   └── .htaccess        # Configuración Apache
├── src/
│   ├── components/      # Componentes React
│   ├── contexts/        # Contextos (Auth, Language, Currency)
│   ├── pages/           # Páginas de la aplicación
│   ├── lib/             # Configuración (Supabase)
│   ├── services/        # Servicios (Email)
│   └── utils/           # Utilidades
├── dist/                # Build de producción (generado)
└── vite.config.ts       # Configuración Vite
```

---

## 🔧 Tecnologías

- **Frontend:** React 19 + TypeScript
- **Routing:** React Router v7
- **Estilos:** Tailwind CSS v4
- **Build:** Vite
- **Backend:** Supabase
- **Autenticación:** Supabase Auth
- **Emails:** EmailJS
- **Hosting:** Hostinger

---

## 🌐 Variables de Entorno

Crea un archivo `.env.production` con:

```env
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_key
VITE_EMAILJS_SERVICE_ID=tu_service_id
VITE_EMAILJS_TEMPLATE_ID=tu_template_id
VITE_EMAILJS_PUBLIC_KEY=tu_public_key
```

---

## 📦 Build y Despliegue

### Para Hostinger:

```powershell
# Opción 1: Automático (Recomendado)
.\build-hostinger.ps1

# Opción 2: Manual
npm run build
# Luego comprime la carpeta 'dist' y sube a Hostinger
```

### Estructura en Hostinger:

```
public_html/
├── index.html
├── .htaccess
├── assets/
└── images/
```

**⚠️ IMPORTANTE:** Los archivos deben estar directamente en `public_html`, NO en una subcarpeta.

---

## 🐛 Solución de Problemas

### Página en blanco
- Limpia caché del navegador (Ctrl + Shift + R)
- Verifica que los archivos estén en public_html (no en subcarpeta)
- Revisa la consola del navegador (F12)

### Error 404 en rutas
- Verifica que `.htaccess` esté en public_html
- Asegúrate que mod_rewrite esté activo en Apache

### Imágenes no cargan
- Verifica que `public_html/images/` exista
- Nombres de archivo son case-sensitive en Linux

### CSS no se aplica
- Limpia caché del navegador
- Verifica que existan archivos CSS en assets/

---

## 📞 Soporte

- **Documentación:** Ver [GUIA-HOSTINGER.md](./GUIA-HOSTINGER.md)
- **Hostinger Support:** Chat 24/7 en hpanel
- **Issues:** Crear issue en el repositorio

---

## 📄 Licencia

Todos los derechos reservados © 2026 EscapaUY

---

## 🎯 Roadmap

- [x] Sistema de autenticación
- [x] Dashboard de turistas
- [x] Dashboard de socios
- [x] Sistema de reservas
- [x] Integración con Supabase
- [x] Despliegue en Hostinger
- [ ] Pagos con Mercado Pago
- [ ] Sistema de reviews
- [ ] App móvil

---

**Última actualización:** Enero 2026
