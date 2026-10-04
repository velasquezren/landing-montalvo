# Revisión de la landing: primera visita, navegación y fotografías

Se conserva la composición existente, la tipografía, los colores, las rutas y
el contenido. No se añadieron dependencias ni integraciones. Reservas continúa
siendo una demostración frontend.

## Hallazgos reproducidos y correcciones

| Hallazgo | Evidencia anterior | Corrección |
|---|---|---|
| Un enlace directo a Silver seleccionaba la suite sin mostrarla | `/servicios#silver`: pestaña Silver activa, `scrollY: 0`, pestañas a 2580 px del borde superior en móvil | Al leer un hash de suite, se muestra la sección de habitaciones respetando el espacio de la cabecera |
| La galería del equipo quedaba vacía al fallar la primera fotografía | Bloqueando `equipo-completo-20261001`, el carrusel quedaba sin diapositivas montadas | Recuperación con la siguiente fotografía; anterior/siguiente omiten las que fallaron; mensaje y controles desactivados si fallan todas |
| La portada tampoco manejaba errores de fotografías | Su precarga dependía de que terminara `decode()` de la imagen activa y no manejaba `onError` | Se omiten fotografías fallidas y se mantiene disponible el contenido de portada |
| No se podía pausar cómodamente la portada desde una pantalla táctil | El control medía 1 × 1 px fuera del foco por teclado | Un control discreto de 44 × 44 px, con etiqueta accesible, estado y pausa/reanudación. Se oculta con movimiento reducido |
| El visor no recuperaba una descarga fallida de su módulo | Import dinámico sin manejo de rechazo y marca de solicitado bloqueada | Feedback al abrir, error controlado y reintento sin recargar la página |
| El visor conservaba etiquetas en inglés y el enlace para abrirlo era pequeño | Configuración de etiquetas por defecto; enlace sin altura táctil mínima | Controles en español y enlace de al menos 44 px |

El asentamiento inicial de la fotografía pasa de 1,8 a 0,9 segundos y de escala
1,05 a 1,025. El texto y las acciones siguen disponibles desde el primer
renderizado; se conserva el fundido entre fotos y el movimiento reducido.

## Verificación

- Nueve rutas: Inicio, Servicios, Especialidades, Dr. Montalvo, Nosotros,
  Atención al paciente, Staff, Blog y Reservar.
- 360, 390, 412, 820 y 1440 px: 45 combinaciones sin overflow horizontal ni
  imágenes rotas observadas en condiciones normales.
- Enlaces de suite y cambio de pestaña por teclado.
- Fallo de primera foto, fallo de todas las fotos y navegación omitiendo errores.
- Fallo de descarga del visor y recuperación con Reintentar; cierre en español.
- Pausa táctil durante un ciclo completo y preferencia de movimiento reducido.
- ESLint, TypeScript, build de producción con webpack y 13 tests de reservas.
- El cambio de imagen de portada se observó durante una primera visita sin
  interacción: no añadió otro candidato LCP en esa comprobación local. Esto no
  constituye una medición de velocidad de la publicación en internet.

Prueba de regresión adicional, sin dependencias:

```sh
npm run build -- --webpack
npm run start -- --hostname 127.0.0.1 --port 3100
# En otro terminal, Chromium con CDP en :9228:
node scripts/landing-browser-check.mjs
node scripts/booking-browser-check.mjs
```

El primer script guarda `resultados.json` y capturas en
`/tmp/montalvo-landing-review`. La prueba de reservas guarda su evidencia en
`/tmp/montalvo-booking-qa`. Los fallos se simulan bloqueando recursos únicamente
en el navegador local; no se modifican servidores externos.

Verificado con Chromium. No se probaron dispositivos físicos, Safari ni
Firefox. Staff y Blog siguen siendo las páginas informativas pendientes que
ya existían; no se inventó contenido para completarlas.
