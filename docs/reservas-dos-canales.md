# Reservar desde la web o desde WhatsApp

## Objetivo confirmado por el propietario

Conservar el recorrido completo de reserva web que se había preparado, además
de permitir reservar desde WhatsApp y, en el futuro, completar el pago en la
landing aunque la reserva haya empezado en el chat. La web podrá sustituir la
interfaz pública actual del VPS cuando exista una integración validada de agenda.

Esta entrega recupera y prepara el frontend, y preserva el acceso a la agenda
actual mediante su enlace público. No integra su API, no cambia ScriptCase,
no activa Flows ni procesa pagos reales.

## Disponible localmente

| Recorrido | Qué utiliza | Qué termina haciendo |
| --- | --- | --- |
| Agenda web actual | Enlace público del VPS | Abre el sistema existente, donde continúa la reserva |
| WhatsApp directo | Enlace al número existente de la clínica | Abre el chat sin obligar a completar un formulario |
| Preparar mi solicitud, opcional | Catálogo público del CRM | Prepara un mensaje con preferencias; recepción confirma la cita |
| Reserva web de demostración | Datos sintéticos en memoria | Hora exacta de ejemplo, datos, resumen, QR ilustrativo, comprobante local y confirmación simulada |

El selector de los dos canales reales aparece también en producción. Si el CRM
no tiene especialidades publicadas, no aparece el formulario de preparación:
ambas entradas reales permanecen disponibles. Si falla la lectura del catálogo,
la página mantiene los accesos y omite esa ayuda opcional.

### Enlace verificado de la agenda existente

La web institucional [clinicamontalvo.net](https://www.clinicamontalvo.net/) enlaza
su botón «RESERVA TU CITA MÉDICA» a `http://23.95.128.187/clinicaw/medicos/`.
La consulta pública de lectura respondió HTTP 200 y mostró especialidades.
`/clinicaw/control/` es otro enlace del sitio; no es el destino del botón de reserva.

Se conserva el destino existente en `lib/appointments.ts`; puede configurarse
con `NEXT_PUBLIC_APPOINTMENT_URL`. URLs inválidas, esquemas ejecutables y URLs
con credenciales se descartan. La landing no añade datos de paciente a la URL.

La agenda se abre en la misma pestaña. No se inserta en un iframe: su respuesta
declara `X-Frame-Options: SAMEORIGIN` y su URL actual es HTTP, mientras la landing
es HTTPS. No se relajaron cabeceras, creó proxy ni modificó configuración remota.

Verificado únicamente el acceso y la pantalla inicial. No se recorrió una
confirmación de cita ni un pago real; no se afirma una validación transaccional
del sistema existente.

En la vista de ambos canales se puede cambiar de recorrido sin perder el paso
ni los datos de cada uno durante esa visita. El archivo de comprobante también
se conserva solo en memoria. No hay almacenamiento persistente ni subida.
Los datos ficticios de la web **nunca se trasladan al mensaje real de WhatsApp**.
No se mezcla el catálogo real con cupos o precios inventados.

### Cómo abrirlo

- `/reservar` muestra siempre agenda web y WhatsApp directo. `npm run dev`
  añade una sección plegable para probar el diseño futuro.
- En una compilación local/preview, definir `RESERVA_WEB_DEMO=on` tanto al
  compilar como al servir. Para aislar también las lecturas del catálogo real,
  definir `CRM_API_URL` con un servidor de fixtures local.
- `/reservar?canal=web-demo` entra directamente al prototipo, solo si el servidor
  habilitó la demostración.
- `/reservar?canal=whatsapp` entra a la preparación opcional si hay catálogo;
  si no lo hay, muestra las dos entradas reales.
- Los enlaces existentes con `?medico=` o `?especialidad=` conservan su
  preselección y entran al recorrido del catálogo real.
- Producción, sin la bandera, muestra las entradas reales; un parámetro de URL
  no habilita la demostración. La reserva web existente no depende de esa bandera.

La bandera es configuración de despliegue, no autorización para cobrar ni para
crear citas. No debe activarse en la web pública como si fuera disponibilidad real.

## Código reutilizado

`booking/web-demo/` recupera el prototipo del commit `40de66d`, incluida la
mejora móvil sin contenedor exterior. Conserva sus pruebas, datos, adaptador de
lectura `BookingData`, estados de carga/error/vacío y selección explícita de hora.

`BookingChannels` aporta los enlaces de los canales reales, la preparación
opcional y la carga diferida del prototipo. `channels.ts` verifica el acceso a la vista demo según la
configuración del servidor. El flujo WhatsApp y la normalización del catálogo
conservan las correcciones de la revisión anterior.

El módulo de demostración es una referencia funcional temporal, no una segunda
agenda. Sus estilos están aislados para recuperar fielmente la versión aprobada
sin cambiar la solicitud actual.

## Recorrido objetivo cuando se integre la agenda

```text
Web:      Especialidad → Médico → Cupos reales → Datos → Reserva
WhatsApp: Flow         → Médico → Cupos reales → Datos → Reserva
                                                          │
                        Una misma referencia de reserva ───┤
                                                          ├─ Pago en la web
                                                          └─ QR/comprobante por chat
                                                                   ↓
                                                        Verificación del pago
```

Es un objetivo pendiente, no el comportamiento actual. Meta documenta Flows
con un endpoint que obtiene horarios disponibles y registra citas:
[tutorial oficial de Meta Developers](https://www.youtube.com/watch?v=QO_ngN8H5GU).
El Flow estático que hoy recoge preferencias en el CRM no basta para confirmar
un cupo: necesita integración dinámica con la agenda y confirmación del servidor.

### Continuar desde WhatsApp en la web

El enlace futuro debe abrir **el pago de la reserva existente**, con el mismo
profesional, fecha, hora e importe. No debe obligar a repetir el formulario ni
crear otra cita. Requiere una referencia protegida, autorización y caducidad;
no se deben poner carnet, teléfono o información clínica en la URL.

No se implementó ese enlace: hoy no hay una reserva real que recuperar. Tampoco
se inventó una ruta pública que exponga datos de pacientes usando un ID.

### Reserva y pago son estados distintos

- La agenda debe aceptar y registrar el cupo antes de mostrar una cita confirmada.
  Si alguien tomó el horario mientras la persona avanzaba, se debe pedir otra
  elección antes de cobrar.
- Enviar un comprobante solo permite indicar recepción o verificación pendiente;
  no prueba que se pagó. El importe debe provenir del servidor.
- Los reintentos o cambios entre web/chat no deben producir otra reserva ni otro
  cobro. La misma referencia debe conservar su estado en ambos canales.
- Pago por QR significa transferencia bancaria y verificación; no se presupone
  disponibilidad de pagos nativos de WhatsApp para esta clínica.
- El cobro de promociones que existe en el CRM no equivale a pago de una cita:
  no se reutilizó automáticamente ni se alteró su operación.

## Pendiente antes de funcionar con pacientes

1. Comprobar el contrato y la fuente real de cupos de la agenda existente.
2. Integrar consulta y registro de citas con control de concurrencia e idempotencia.
3. Conectar el Flow a esas mismas operaciones con correlación/autorización y
   protección del intercambio de datos; aprobar cualquier cambio remoto por separado.
4. Definir QR/proveedor, plazo del cupo pendiente de pago y quién verifica los
   comprobantes. Preparar continuación web desde la reserva existente.
5. Probar todo con datos sintéticos antes de habilitar líneas o pacientes reales.

No se creó backend, endpoint, migración, nueva base de datos ni automatización.
No hubo push, despliegue, acceso administrativo al VPS ni mensajes reales.
Solo se leyeron páginas públicas ya enlazadas por la clínica.

## Comprobaciones locales

- 38 pruebas: recorridos existentes, prototipo recuperado, selección de canal y
  destino público de la agenda.
- Lint, TypeScript y build con catálogo sintético local.
- Navegador en 360, 390, 412 y 1440 px: selección explícita de hora, sin cupos,
  error/reintento, formulario, pago, comprobante seleccionado localmente,
  confirmación simulada y conservación/aislamiento al cambiar de canal.
- Sin overflow, excepciones JS, solicitudes externas, escrituras de red ni
  almacenamiento local/de sesión durante el recorrido.
- Capturas/resultados: `/tmp/montalvo-channels-evidence/`.
- Compilación con `RESERVA_WEB_DEMO=off`: `?canal=web-demo` mantiene las dos
  entradas reales y no muestra el prototipo, sus profesionales ni el pago.
- Prueba de acceso con catálogo sintético publicado y con catálogo vacío:
  evidencias locales en `/tmp/montalvo-access-evidence/`. Sin navegar a los
  enlaces externos durante las pruebas ni enviar datos.
