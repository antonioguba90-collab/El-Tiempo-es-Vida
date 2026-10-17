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
6. Abre TiempoEsVida desde el icono instalado. El manifiesto solicita modo `fullscreen`.
7. Como alternativa, pulsa el botón **⛶ Pantalla completa** dentro de la aplicación. En navegadores compatibles solicita ocultar la interfaz del navegador; Android puede seguir mostrando algunos controles del sistema según el dispositivo.

## Notas

- El service worker y la instalación PWA requieren un origen seguro, como GitHub Pages por HTTPS (o `localhost` para pruebas).
- El modo de pantalla completa solicitado por **COMENZAR** requiere que el navegador lo permita y una acción directa del usuario. Abrir un HTML local no garantiza pantalla completa.
- La configuración personal se guarda en `localStorage` del origen publicado. La configuración guardada al abrir el HTML como archivo local no se transfiere automáticamente a la web publicada.
- Restablecer configuración solo elimina salario, tipo de salario, horas/día y días/semana; no elimina el código ni los recursos de la aplicación.
- No se usa ninguna CDN ni biblioteca externa.


## Reglas de cálculo

- Para salario mensual, se estima el salario horario dividiendo 12 mensualidades entre las horas anuales configuradas (`horas por jornada × días por semana × 52 semanas`).
- El precio se convierte una sola vez a minutos de trabajo. Total de horas y jornadas se muestran a partir de esa misma duración.
- El tiempo real estimado convierte las jornadas a días naturales mediante la proporción `7 / días trabajados por semana`. Los descansos no se vuelven a sumar por separado.
- Para mostrar periodos largos se utilizan meses de 30 días y años de 360 días; son unidades de presentación, no un calendario con fechas exactas.
- El botón **Mi jornada** abre la configuración directamente bajo la cabecera, sin el gran espacio vertical de la pantalla principal.
