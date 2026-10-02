# Navegación y fotografías — 1 de octubre de 2026

> Corrección posterior: Inicio recupera la composición anterior a esta revisión,
> con la suite Silver como primera fotografía a todo el ancho detrás del texto.
> Únicamente el fondo rota automáticamente cada ocho segundos, con fundido de
> 1,4 s. Se retiran de Inicio la tarjeta de galería, flechas y temporizador
> visible. La descripción del carrusel con controles de abajo sigue aplicando
> a Sobre nosotros. Véase PROJECT_CONTEXT §29.

## Corrección de la navegación

La reproducción se hizo en Chromium, sobre una compilación de producción:
Servicios, scroll profundo, enlace Nosotros de la cabecera. La grabación de la
capa de composición mostró que el contenido saliente tapaba la cabecera.

`ViewTransition` recibía un fragmento con varias secciones. React les asignaba
nombres independientes, mientras el CSS animaba `root`, que React desactiva.
El resultado eran diez animaciones independientes de 250 ms en esa navegación.

Ahora la plantilla tiene un único contenedor, con clases explícitas de entrada
y salida. La salida permanece opaca y la entrada se funde durante 160 ms.
La cabecera tiene una capa propia, quieta y por encima del contenido. Se elimina
también la animación residual del `root` y la transición del subrayado activo,
que podía dejar dos enlaces subrayados en la captura. Sin soporte de View
Transitions o con movimiento reducido, la navegación sigue funcionando.

Next conserva el control del scroll, de las anclas y del historial. No se
interceptan clics ni se añaden temporizadores para retrasar el cambio de ruta.
La precarga de rutas sigue siendo la de Next; al señalar o enfocar un enlace se
adelanta únicamente su foto principal, usando la misma variante de `next/image`.
Esta anticipación se omite con ahorro de datos o conexión 2G. Un indicador en el
enlace solo aparece cuando la navegación demora más de 120 ms.

El menú móvil abre en 280 ms y cierra en 180 ms. Recupera explícitamente el foco
en su botón, sin desplazar el documento.

## Fotografías

Los siete originales de `Imagenes/` se conservan intactos. Las copias públicas
tienen nombres descriptivos y fecha para no reutilizar URLs con caché anual.
Next genera las variantes adaptativas AVIF/WebP.

| Original, sufijo de hora | Copia en `public/images/clinica/` | Ubicación |
| --- | --- | --- |
| 21.08.45 | fachada-20261001.jpg | Primera fotografía de Inicio |
| 21.08.45 (1) | acceso-vertical-20261001.jpg | Cabecera de Atención al paciente |
| 21.08.46 | exterior-20261001.jpg | Recorrido de Inicio y cabecera institucional |
| 21.08.46 (1) | emergencias-20261001.jpg | Junto a Admisión |
| 21.08.46 (2) | equipo-entrada-20261001.jpg | Galería del equipo |
| 21.08.46 (3) | equipo-cercano-20261001.jpg | Galería del equipo |
| 21.08.46 (4) | equipo-completo-20261001.jpg | Primera fotografía del equipo |

El retrato y la página del doctor conservan su presentación. Las fotos de grupo
se presentan como equipo de la institución, sin asignar especialidades ni
identidades a las personas fotografiadas.

Inicio y Sobre nosotros usan `PhotoSlideshow`: tres fotografías, fundido de
600 ms, barra de progreso de siete segundos, anterior, siguiente, selección
directa y pausa. El texto principal y las acciones no cambian con las fotos.
La primera imagen se renderiza en el servidor; solo la de Inicio tiene
prioridad alta. La siguiente se adelanta cuando el carrusel entra en pantalla
y la actual está decodificada. Los cambios manuales esperan la decodificación
de la imagen solicitada, conservando la actual durante la espera.

La animación CSS de la barra actúa como reloj: no hay intervalos ni renders por
fotograma. Se pausa al salir de pantalla, ocultar la pestaña, pasar el puntero
o usar el teclado. La intervención manual detiene el avance hasta que se pulse
Reanudar. Con movimiento reducido, las fotografías cambian solo a petición.

## Referencias técnicas

- Guía de la versión instalada: `node_modules/next/dist/docs/01-app/02-guides/view-transitions.md`.
- [React: ViewTransition y clases para las capturas](https://react.dev/reference/react/ViewTransition).
- [Next: navegación, precarga y scroll](https://nextjs.org/docs/app/api-reference/components/link).
- [W3C: comportamiento de carruseles y controles de rotación](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/).

## Verificación

Los registros y capturas de esta sesión se guardan en `/tmp/montalvo-qa/`.
La comprobación incluye navegación desde scroll profundo, anclas, historial,
menú móvil, teclado, cambio automático, pausa y movimiento reducido, además
de las ocho rutas a 320, 390, 820 y 1440 px.

Resultado: las ocho comprobaciones funcionales pasan, sin errores de
JavaScript, imágenes rotas ni desbordes en las 32 combinaciones de ruta/ancho.
El navegador conserva 1600 px al volver atrás y 1100 px al avanzar en la prueba
de historial. La grabación final registra dos animaciones de contenido de
160 ms, frente a las diez de 250 ms del caso original. ESLint, TypeScript y la
compilación de producción con webpack pasan. La inspección se hizo en Chromium;
no se ha ejecutado esta sesión en Safari ni Firefox.

Para medir el historial se utiliza un clic por coordenadas sobre el enlace
visible: `locator.click()` de Playwright desplazaba previamente el documento
para alinear el elemento sticky, falseando la posición esperada de retorno.
