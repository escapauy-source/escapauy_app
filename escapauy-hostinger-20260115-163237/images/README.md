# Carpeta de Imágenes

Esta carpeta debe contener todas las imágenes estáticas de la aplicación.

## Estructura requerida:

```
images/
├── favicon.png          - Icono del sitio (32x32 o 16x16)
├── logo-main.png        - Logo principal de EscapaUY
├── og-image.jpg         - Imagen para compartir en redes sociales (1200x630)
└── seals/
    ├── seal-bcu-security.png  - Sello de seguridad BCU
    └── seal-iva-zero.png      - Sello IVA 0%
```

## Instrucciones:

1. Coloca todas tus imágenes en esta carpeta
2. Asegúrate de que los nombres coincidan exactamente con los usados en el código
3. Los nombres de archivo son case-sensitive en Linux (favicon.png ≠ Favicon.PNG)
4. Vite copiará automáticamente todo el contenido de `public/` a `dist/` durante el build

## Rutas en el código:

Las imágenes se referencian en el código como:
- `/images/logo-main.png`
- `/images/favicon.png`
- `/images/seals/seal-iva-zero.png`

El prefijo `/` hace referencia a la raíz del sitio web.
