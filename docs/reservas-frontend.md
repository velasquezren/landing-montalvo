# Reserva pública: demostración frontend

Ruta: `/reservar`. Integrada en App Router y en el layout existente (cabecera,
pie, Montserrat, tokens de marca, Button y Lucide). Sin dependencias nuevas.
La página está marcada `noindex` y no se añade al sitemap mientras sea demo.

## Recorrido

Especialidad → Médico → Fecha/hora → Datos → Resumen → Pago → Vista previa.

- Elegir una especialidad o un médico avanza directamente; el horario exige
  selección explícita y Continuar. No existe paso de servicio.
- Precio visible en médico, resumen y pago. Todos los profesionales y precios
  son ficticios. La foto es opcional: sin foto se utiliza un avatar identificado
  como ejemplo, sin atribuir precios u horarios a personas reales.
- Resumen lateral en escritorio y desplegable en móvil. Editar conserva los
  datos personales; cambios de especialidad, médico y fecha invalidan sus
  selecciones dependientes. Cambiar la cita limpia el comprobante anterior.
- Datos: nombre, celular de Bolivia, carnet y observaciones opcionales.
  Validaciones frontend orientativas; no representan reglas del backend actual.
- No se guarda nada al recargar o salir. Ningún dato personal se coloca en URL,
  cookies, localStorage o sessionStorage.
- Los enlaces de reserva existentes usan `/reservar`. Contactar sigue siendo
  independiente. El botón flotante de WhatsApp se oculta solo en esta ruta para
  no interferir con las acciones. No se envía ningún mensaje.

## Archivos

- `app/reservar/page.tsx`: entrada y metadatos.
- `booking/types.ts`: modelos mínimos de presentación y contrato de lectura.
- `booking/mock-data.ts`: cuatro especialidades, seis profesionales ficticios
  y catorce fechas civiles calculadas en America/La_Paz.
- `booking/booking-data.ts`: única implementación de lectura en memoria.
  La UI llama getSpecialties/getDoctors/getDays/getAvailability. Sustituir esta
  implementación será una tarea posterior; no se diseñan APIs en esta fase.
- `booking/state.ts`: invalidaciones, validación de paciente y comprobante,
  formato de precio y fecha.
- `booking/use-resource.ts`: carga asíncrona, reintento por selección e
  ignorado de respuestas anteriores al cambiar de opción o desmontar.
- `booking/components/`: flujo, catálogos/agenda, paciente y pago.
- `booking/booking.module.css`: estilos aislados, basados en los tokens existentes.

## Escenarios mock

- Catálogos: desplegable «Probar otros estados de esta demostración» para vacío
  y error; Reintentar recupera datos. Búsqueda insensible a mayúsculas y tildes.
- Agenda: segunda fecha simula sin cupos; tercera, sin atención; cuarta, error
  recuperable. El patrón se repite en la siguiente semana. Los fines de semana
  y los días fuera del horario semanal tienen prioridad como días sin atención
  (salvo la simulación de error, que se muestra antes de resolver el día).
- La Dra. Lucía Méndez solo tiene mañanas de lunes, miércoles y viernes.
- La Dra. Elena Rojas tiene disponibilidad a solicitud; el botón explica el
  caso dentro de la demo y no contacta un servicio externo.
- Estados de carga para especialidades, médicos, fechas y horas. Los días sin
  horas nunca ofrecen un slot seleccionable ni permiten continuar.
- Cambiar rápido de fecha ignora las respuestas de la consulta anterior.

## Pago de ejemplo

QR: icono no pagable, banco ficticio sin cuenta. NIT/razón social opcionales
para demostrar el formulario. El comprobante se mantiene como `File` en estado
React; no se lee su contenido ni se envía. Se valida JPG/PNG/PDF, máximo 5 MB,
no vacío. Se puede quitar o sustituir.

`PENDIENTE_PAGO` → `COMPROBANTE_ENVIADO` solo al pulsar «Simular envío» →
`EN_VERIFICACION` mediante un botón explícito de ejemplo. `PAGO_CONFIRMADO`
está tipado y tiene etiqueta, pero el flujo no lo asigna ni afirma haber cobrado.
También se puede ver la confirmación pendiente sin elegir comprobante.

La pantalla final dice «Vista previa de confirmación» y «No existe una cita
reservada». Calendario queda deshabilitado y explicado. Contacto enlaza a la
página existente de Atención al paciente. `AntiBotPlaceholder` devuelve null:
no se muestra un CAPTCHA falso ni se integra proveedor alguno.

## Validación reproducible

Node 22.23.2. No existía un script de tests en esta landing.

```sh
npm run lint
npm run typecheck
npm test
npm run build -- --webpack
npm run start -- --hostname 127.0.0.1 --port 3100
```

En otro terminal, con Chromium/Chrome instalado:

```sh
google-chrome --headless --remote-debugging-port=9228 --user-data-dir=/tmp/montalvo-booking-browser --no-first-run --no-default-browser-check about:blank
node scripts/booking-browser-check.mjs
```

La prueba de navegador congela únicamente el Date de la pestaña al 4 de octubre
de 2026 para repetir los casos de agenda. Recorre el flujo a 1440/360/390/412 px,
valida errores, reintentos, foco, datos conservados, selección local de archivo,
ausencia de scroll horizontal, targets de 44 px, solicitudes y almacenamiento.
Guarda capturas y `results.json` en `/tmp/montalvo-booking-qa`.
La comprobación visual y funcional corresponde a Chromium; no es una
certificación con lectores de pantalla ni una prueba en dispositivos físicos.

Resultado local: ESLint, TypeScript y build correctos; 13 pruebas unitarias
aprobadas. Recorrido completo aprobado en los cuatro anchos; ocho rutas previas
revisadas a 390/1440 px. Sin excepciones de JavaScript, requests externos o POST,
ni datos en localStorage/sessionStorage durante la prueba.

## Fuera de alcance

Backend pendiente. Disponibilidad real pendiente. Persistencia pendiente.
Pago real pendiente. Integración ScriptCase pendiente. API nueva pendiente.
Tampoco se implementan PAC, login, cancelaciones, reprogramación, paneles,
promociones sobre citas, integraciones externas, upload o despliegue.
