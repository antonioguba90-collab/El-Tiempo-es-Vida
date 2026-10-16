# TiempoEsVida

Aplicación web modular preparada para publicarse con GitHub Pages.

## Estructura

- `index.html`: estructura de pantallas y formularios.
- `css/styles.css`: estilos y diseño adaptable.
- `js/app.js`: cálculos, configuración, validación y eventos.
- `manifest.webmanifest`: configuración de instalación y modo de visualización.
- `sw.js`: caché de recursos para uso sin conexión después de la primera carga.
- `icon.svg`: icono de la aplicación.

## Publicar en GitHub Pages

1. Sube todos estos archivos y carpetas a la raíz del repositorio, conservando la estructura.
2. En GitHub, abre **Settings → Pages**.
3. En **Build and deployment**, selecciona **Deploy from a branch**, la rama principal y la carpeta `/ (root)`.
4. Guarda y espera a que GitHub Pages publique la web.
5. Abre la URL HTTPS en Chrome para Android y usa el menú del navegador → **Añadir a pantalla de inicio** o **Instalar aplicación**.
6. Abre TiempoEsVida desde el icono instalado. El manifiesto solicita modo `fullscreen`; si el navegador no admite ese modo, puede usar la presentación independiente disponible.

## Notas

- El service worker y la instalación PWA requieren un origen seguro, como GitHub Pages por HTTPS (o `localhost` para pruebas).
- La configuración personal se guarda en `localStorage` del origen publicado. La configuración guardada al abrir el HTML como archivo local no se transfiere automáticamente a la web publicada.
- Restablecer configuración solo elimina salario, tipo de salario, horas/día y días/semana; no elimina el código ni los recursos de la aplicación.
- No se usa ninguna CDN ni biblioteca externa.
