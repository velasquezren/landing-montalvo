# Reservar desde la web o desde WhatsApp

## Estado (7 de octubre de 2026)

`/reservar` ofrece dos caminos:

| Recorrido | Qué usa | Qué hace |
| --- | --- | --- |
| **Reservar en línea** (`booking/web/`) | La agenda real de ScriptCase, a través del CRM | Especialidad → médico → hora libre real → datos → **confirmar (la cita queda registrada)** → pago por QR y comprobante → confirmación con número de reserva |
| WhatsApp directo | El número de la clínica | Abre el chat; recepción coordina |
| Preparar la solicitud (opcional) | El directorio del CRM, si tiene especialidades | Arma un mensaje con preferencias para WhatsApp |

La agenda anterior (`http://23.95.128.187/clinicaw/medicos/`) queda como enlace
secundario. `?canal=web` abre directo la reserva en línea; los enlaces antiguos
`?canal=web-demo` y `?canal=agenda` llevan al mismo sitio.

## Cómo reserva

El navegador llama al CRM (`/publico/agenda/*`, CORS solo para la landing y sin
cookies). El CRM registra la cita en `para_agendar` **exactamente como el
formulario público de ScriptCase**: estado PENDIENTE, precio y banco del médico,
mismo aviso de Telegram. El comprobante deja la reserva en PAGADO, que significa
«a verificar por caja», igual que en ScriptCase. FileMaker y caja la reciben como
cualquier otra. Detalle y pruebas: `backend-crm-montalvo/docs/ESTADO_ACTUAL.md`.

- **Horas**: las de `vista_horas_libres` (30 días; la web muestra 14), sin las
  que ya tienen una reserva web PENDIENTE/PAGADO. Al confirmar se vuelve a
  comprobar; si alguien la tomó, la paciente vuelve al horario con un aviso y
  sus datos intactos.
- **Una vez registrada** no se puede editar ni duplicar desde la web.
- **Precio**: el de la agenda; si el médico no tiene tarifa, «a confirmar» (no
  gratis) y se salta el pago: la clínica confirma el monto.
- **Pago**: QR del banco del médico (`pagos_qr`), servido por HTTPS; comprobante
  JPG/PNG/WebP de hasta 5 MB. «Pagar más tarde» deja la cita PENDIENTE.
- **Errores**: sin red o con la agenda caída, se dice así y se ofrece reintentar
  o WhatsApp; nunca se muestra como «no hay horarios».

## Archivos

- `booking/web/agenda-data.ts`: cliente de la agenda (lectura, reserva, pago) con
  cada respuesta validada. Probado en `agenda-data.test.ts`.
- `booking/web/components/`: el recorrido de 7 pasos (antes demostración).
- `booking/web/mock-booking-data.ts`: datos en memoria solo para las pruebas.
- `booking/components/BookingChannels.tsx`: el selector de caminos.

Retirado: la consulta simple de horarios (`booking/agenda`), el proxy
`/api/agenda` y las banderas `AGENDA_VPS_LECTURA` / `RESERVA_WEB_DEMO` en Vercel.
El interruptor está en el CRM: `AGENDA_VPS_RESERVAS`.

## Pendiente

- Continuar en la web una reserva empezada por WhatsApp (Flow con cupos reales).
- Saber cómo pasa la reserva a FileMaker y caja, para poder ofrecer cancelación
  o cambio de hora desde la web.
