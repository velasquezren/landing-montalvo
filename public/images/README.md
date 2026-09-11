# Fotografías del sitio

Configure las fotografías en `content/images.ts`. Los bloques ya reservan su espacio y usan Next Image con tamaños adaptados a móvil y escritorio. No es necesario cambiar componentes ni instalar dependencias.

| Clave | Ubicación | Entrega sugerida | Encuadre |
| --- | --- | --- | --- |
| inicio | Mitad derecha de portada; debajo del texto en móvil | WebP, 1600 × 1400 | Atención cercana; sujeto centrado, sin texto incrustado |
| servicios | Cabecera de Servicios | WebP, 1920 × 900 | Escena de atención; sujeto hacia la derecha, espacio tranquilo a la izquierda |
| habitaciones | Bloque de internación en Inicio | WebP, 1200 × 900 | Vista amplia de una suite; mantener verticales rectas |
| especialidades | Cabecera de Especialidades | WebP, 1920 × 900 | Consulta médica; sujeto a la derecha |
| nosotros | Cabecera de Sobre nosotros | WebP, 1920 × 900 | Equipo o instalaciones; espacio libre a la izquierda |
| pacientes | Cabecera de Atención al paciente | WebP, 1920 × 900 | Recepción o bienvenida; sujeto a la derecha |
| doctor | Cabecera del Dr. Montalvo | WebP, 1920 × 900 | Retrato ambiental a la derecha; evitar primer plano vertical en este formato |

1. Coloque la fotografía real y autorizada en `public/images/<seccion>/`.
2. Actualice `src` con `/images/<seccion>/<archivo>.webp` y `alt` con una descripción breve de lo visible.
3. Ajuste `position` (por ejemplo, `65% center`) para preservar el sujeto en móvil.
4. Revise a 390 y 1440 px. Conserve el mismo tratamiento de luz y temperatura entre fotos y, como objetivo, archivos de 150–350 KB sin sacrificar legibilidad.

Las claves con `src: null` muestran una cabecera de marca terminada y no realizan solicitudes de imágenes. Los archivos WebP existentes son maquetas con notas de producción, no fotografías; se conservan como referencias pero no se publican. Todas las claves editoriales comienzan en `null`.

Las galerías se administran en `content/rooms.ts`: añada a `images` objetos `{ src: "/images/habitaciones/gold/principal-1.webp", alt: "Descripción de la fotografía real", role: "principal" }` después de reemplazar el archivo por la foto. Use `galeria` o `detalle` para las siguientes tomas. El estado vacío muestra un panel de marca sin botones de zoom; con fotos se activa automáticamente la galería. Principal: 1600 × 1200, detalles: 1000 × 1000; comprobar el recorte cuadrado de las miniaturas.

No publique nombres, retratos ni escenas que atribuyan profesionales o instalaciones a la clínica sin confirmar su procedencia.
