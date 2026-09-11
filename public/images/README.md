# Fotografías del sitio — pedido para Marketing

> Documento para encargar y entregar las fotografías de **clinicamontalvo.net**.
> Las medidas no son estimaciones: están tomadas del sitio ya construido, a
> 1920, 1440 y 412 px de ancho.

**Son 13 fotografías + 3 galerías.** Sin ellas la web funciona y se ve
terminada —los huecos muestran una cabecera de marca—, pero es el material que
falta para que deje de parecer una maqueta.

---

## 1. Cómo entregar

| | |
| :--- | :--- |
| **Formato** | JPG o PNG **originales, sin comprimir**. El sitio genera solo las versiones AVIF y WebP en todos los tamaños. **No envíe WebP ya comprimido**: recomprimir pierde calidad dos veces. |
| **Perfil de color** | sRGB. Un perfil Adobe RGB se ve desaturado en el navegador. |
| **Resolución** | La de la tabla, como **mínimo**. Más grande es bienvenido: el sitio reduce, nunca amplía. |
| **Nombre de archivo** | Exactamente el de la tabla. En minúsculas, sin espacios, sin acentos, sin eñes. |
| **Sin texto incrustado** | Ni rótulos, ni logotipo, ni marcas de agua. El sitio pone su propia tipografía encima. |
| **Sin marco ni bordes** | Ni esquinas redondeadas, ni sombras, ni bordes blancos. El sitio los aplica. |
| **Derechos** | Cada persona reconocible necesita autorización de uso de imagen firmada. |

### Tratamiento visual

Todas las fotos van a convivir en la misma página, así que deben parecer de la
misma sesión: **luz natural, temperatura neutra o ligeramente cálida,
exposición alta y contraste suave**. Nada de filtros de moda, viñeteados ni
azules fríos. El sitio es blanco, verde `#006156` y líneas finas; una fotografía
saturada o muy contrastada rompe el conjunto.

---

## 2. Las 5 cabeceras de página

Son las fotos **más difíciles y más importantes**: ocupan todo el ancho, llevan
el título encima y cambian mucho de forma entre escritorio y móvil.

| Archivo | Página | Qué debe mostrar |
| :--- | :--- | :--- |
| `cabeceras/servicios.jpg` | Servicios | Escena de atención médica real: consulta, sala de espera, pasillo clínico |
| `cabeceras/especialidades.jpg` | Especialidades | Consulta médica; profesional atendiendo |
| `cabeceras/sobre-nosotros.jpg` | Sobre nosotros | Equipo o fachada e instalaciones |
| `cabeceras/atencion-al-paciente.jpg` | Atención al paciente | Recepción, admisión o bienvenida |
| `cabeceras/dr-montalvo.jpg` | Dr. Montalvo | Retrato **ambiental** del Dr. Montalvo, no primer plano |

**Entrega: 2560 × 1200 px mínimo.**

### El encuadre es lo crítico aquí

La cabecera se recorta **muy distinto** según la pantalla:

```
  ESCRITORIO 1920 px              MÓVIL 412 px
  ┌──────────────────────────┐    ┌──────────┐
  │  TEXTO      │            │    │  TEXTO   │   La misma foto se ve
  │  encima     │   libre    │    │  encima  │   panorámica en un
  └──────────────────────────┘    │          │   ordenador y casi
   1920 × 395 px  ← muy ancha     │          │   cuadrada en un móvil
                                  └──────────┘
                                   412 × 392 px
```

Por eso:

1. **El sujeto va a la derecha.** El titular y las migas de navegación se pintan
   sobre la mitad izquierda. Deje ese lado tranquilo: pared, fondo desenfocado,
   suelo. Nada importante a la izquierda.
2. **Aire arriba y abajo.** En escritorio solo se ve una franja central de un
   20 % de la altura. Todo lo que esté en los bordes superior e inferior se
   pierde. Componga holgado.
3. **El sujeto debe sobrevivir a un recorte cuadrado**, porque eso es lo que
   pasa en el móvil.
4. **La foto lleva un velo verde oscuro encima** para que el texto blanco se
   lea. Una foto ya oscura quedará muy oscura: entregue **clara**.

---

## 3. Las 2 fotografías de portada

| Archivo | Dónde | Entrega mínima | Encuadre |
| :--- | :--- | :--- | :--- |
| `portada/principal.jpg` | Mitad derecha de la portada | **1600 × 1600** | **Casi cuadrada en escritorio (640×630) y apaisada en móvil (412×258).** Sujeto centrado y con mucho margen. Es la primera foto que ve el visitante: atención cercana, trato humano, una persona atendida |
| `portada/internacion.jpg` | Bloque «Un espacio para recuperarse» | **1600 × 1200** (4:3) | Vista amplia de una suite, vacía y ordenada. Verticales rectas, sin distorsión de gran angular |

`portada/principal.jpg` es la única que cambia de proporción de forma extrema
(1:1 ↔ 16:10). **No recorte ajustado**: deje aire por los cuatro lados.

---

## 4. Las 3 galerías de habitaciones

Las suites son el argumento comercial del sitio, y hoy es el hueco más grande.

| Carpeta | Suite |
| :--- | :--- |
| `habitaciones/gold/` | Gold Deluxe Suite — la más espaciosa, con sala jardín |
| `habitaciones/silver/` | Silver Suite — sala de estar amplia, balcón con ventanales |
| `habitaciones/bronce/` | Suite Bronce — individual, luminosa, baño independiente |

**De 5 a 8 fotografías por suite.** Nombres exactos:

```
principal-1.jpg    la mejor vista general      2000 × 1500 (4:3)  ← obligatoria
principal-2.jpg    segunda vista general       2000 × 1500 (4:3)
galeria-1.jpg      baño                        1600 × 1200
galeria-2.jpg      zona de estar o balcón      1600 × 1200
galeria-3.jpg      detalle: frigobar, TV…      1600 × 1200
galeria-4.jpg      sala jardín (solo Gold)     1600 × 1200
```

`principal-1.jpg` manda: es la que se ve grande en escritorio (≈605 × 480 px) y
la primera del carrusel en móvil. Las demás salen pequeñas (≈288 × 236 px) y a
pantalla completa al ampliarlas.

**Cómo fotografiar una habitación:**

- Cama hecha, luces encendidas, persianas abiertas, **sin personal ni pacientes**
- Sin objetos personales, carros de limpieza, cables ni papeleras a la vista
- Cámara a la altura del pecho, **verticales rectas** (nada de inclinar)
- Gran angular moderado: un 16 mm deforma la habitación y se nota
- Mismo día y misma luz para las tres suites, o parecerán de tres hoteles

---

## 5. Estructura de carpetas

Entregue **exactamente** esta estructura. Si un archivo no coincide en nombre o
ubicación, no aparece en la web.

```
public/images/
├── cabeceras/
│   ├── servicios.jpg
│   ├── especialidades.jpg
│   ├── sobre-nosotros.jpg
│   ├── atencion-al-paciente.jpg
│   └── dr-montalvo.jpg
├── portada/
│   ├── principal.jpg
│   └── internacion.jpg
└── habitaciones/
    ├── gold/
    │   ├── principal-1.jpg
    │   ├── principal-2.jpg
    │   └── galeria-1.jpg … galeria-4.jpg
    ├── silver/
    │   └── (igual)
    └── bronce/
        └── (igual)
```

Junto a las fotos, un **`creditos.txt`** con: fotógrafo, fecha, y si hay
personas reconocibles y su autorización está firmada.

---

## 6. Lo que NO sirve

- **Banco de imágenes genérico.** Un médico sonriente de stock se reconoce al
  instante y resta credibilidad a una clínica real.
- **Fotos de teléfono con flash.** El flash directo aplana la escena y amarillea.
- **Capturas de Instagram o de WhatsApp.** Llegan recomprimidas y a 1080 px.
- **Fotos con texto, logotipo o marca de agua.**
- **Collages o fotos ya montadas** en marcos o mockups.
- **Personas sin autorización firmada**, incluido personal de la clínica.
- **Fotos oscuras o de noche** para las cabeceras: llevan un velo verde encima.

---

## 7. Prioridad, si hay que ir por partes

1. **Las 3 galerías de habitaciones** — es el hueco más grande y lo que vende
2. **`portada/principal.jpg`** — la primera imagen del sitio
3. **`cabeceras/servicios.jpg`** — la página más visitada después de la portada
4. **`portada/internacion.jpg`**
5. **`cabeceras/dr-montalvo.jpg`**
6. El resto de cabeceras

---

## 8. Cómo activo cada foto (nota interna)

Las fotos no aparecen solas: hay que declararlas. Los huecos ya están
reservados, así que **no se descoloca nada** al rellenarlos.

**Cabeceras y portada** — en `content/images.ts`, cambiar `src: null` por la
ruta y escribir el `alt`:

```ts
servicios: {
  src: "/images/cabeceras/servicios.jpg",
  alt: "Sala de espera de Clínica Montalvo con luz natural",
  position: "center 38%",   // sube o baja el encuadre si el sujeto se corta
},
```

**Habitaciones** — en `content/rooms.ts`, rellenar el array `images: []`:

```ts
images: [
  { src: "/images/habitaciones/gold/principal-1.jpg",
    alt: "Suite Gold Deluxe con cama matrimonial y sala de estar",
    role: "principal" },
  { src: "/images/habitaciones/gold/galeria-1.jpg",
    alt: "Baño privado de la suite Gold",
    role: "galeria" },
],
```

Con el array vacío se muestra un panel de marca; en cuanto hay fotos, la galería
y el visor a pantalla completa se activan solos.

El `alt` **no es opcional**: lo lee quien navega con lector de pantalla y lo usa
Google. Describa lo que se ve, sin repetir «foto de».

Después de cargarlas, revise a **412 px y a 1440 px** que ningún sujeto quede
cortado, y ajuste `position` si hace falta.

---

## 9. Nota sobre los archivos actuales

Los 18 `.webp` que hay ahora en `habitaciones/` y `servicios/` **son maquetas
con notas de producción, no fotografías**. Por eso el sitio no los publica.
Pueden borrarse en cuanto lleguen las fotos reales.
