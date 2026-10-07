import { test } from "node:test";
import assert from "node:assert/strict";
import { initialChannel } from "./channels.ts";
import { appointmentUrl, CURRENT_AGENDA_URL } from "../lib/appointments.ts";

test("la reserva web se abre con ?canal=web y con los enlaces antiguos", () => {
  for (const canal of ["web", "web-demo", "agenda"]) assert.equal(initialChannel(canal), "web");
  assert.equal(initialChannel(null), "choose");
  assert.equal(initialChannel("otro"), "choose");
});

test("la reserva web conserva el destino público existente y descarta URLs inválidas", () => {
  for (const value of [undefined, "", "[COMPLETAR: URL]", "javascript:alert(1)", "https://user:password@example.test/"]) {
    assert.equal(appointmentUrl(value), CURRENT_AGENDA_URL);
  }
  assert.equal(appointmentUrl("https://agenda.ejemplo.test/reservar"), "https://agenda.ejemplo.test/reservar");
});

test("los enlaces del directorio abren la solicitud con su preelección", () => {
  assert.equal(initialChannel("whatsapp"), "whatsapp");
  assert.equal(initialChannel(null, true), "whatsapp");
  assert.equal(initialChannel("web", true), "web");
});
