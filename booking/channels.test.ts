import { test } from "node:test";
import assert from "node:assert/strict";
import { initialChannel } from "./channels.ts";
import { appointmentUrl, CURRENT_AGENDA_URL } from "../lib/appointments.ts";

test("la URL no puede habilitar la reserva de demostración si el servidor la desactiva", () => {
  for (const channel of [null, "web-demo", "otro"]) {
    assert.equal(initialChannel(false, channel), "choose");
  }
  assert.equal(initialChannel(false, "whatsapp"), "whatsapp");
  assert.equal(initialChannel(false, null, true), "whatsapp");
});

test("la reserva web conserva el destino público existente y descarta URLs inválidas", () => {
  for (const value of [undefined, "", "[COMPLETAR: URL]", "javascript:alert(1)", "https://user:password@example.test/"]) {
    assert.equal(appointmentUrl(value), CURRENT_AGENDA_URL);
  }
  assert.equal(appointmentUrl("https://agenda.ejemplo.test/reservar"), "https://agenda.ejemplo.test/reservar");
});

test("ambos recorridos tienen entrada y los enlaces del directorio conservan su destino real", () => {
  assert.equal(initialChannel(true), "choose");
  assert.equal(initialChannel(true, "web-demo"), "web-demo");
  assert.equal(initialChannel(true, "whatsapp"), "whatsapp");
  assert.equal(initialChannel(true, null, true), "whatsapp");
  assert.equal(initialChannel(true, "desconocido"), "choose");
});
