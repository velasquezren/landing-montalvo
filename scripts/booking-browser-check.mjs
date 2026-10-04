/**
 * Prueba opcional sobre una compilación local; Node 22 y Chromium con CDP.
 * Servir en 127.0.0.1:3100 y abrir Chromium con --remote-debugging-port=9228.
 * No instala dependencias, no visita producción. Evidencia en /tmp/montalvo-booking-qa.
 */
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

const base = "http://127.0.0.1:3100";
const directory = "/tmp/montalvo-booking-qa";
await mkdir(directory, { recursive: true });
const targets = await (await fetch("http://127.0.0.1:9228/json")).json();
const target = targets.find((item) => item.type === "page");
assert.ok(target, "Chromium debe tener una pestaña abierta");
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve) =>
  socket.addEventListener("open", resolve, { once: true }),
);
const pending = new Map();
const errors = [];
const requests = [];
let sequence = 0;
socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id) {
    const entry = pending.get(message.id);
    if (!entry) return;
    pending.delete(message.id);
    if (message.error) entry.reject(new Error(JSON.stringify(message.error)));
    else entry.resolve(message.result);
  }
  if (message.method === "Runtime.exceptionThrown")
    errors.push(message.params.exceptionDetails.text);
  if (
    message.method === "Runtime.consoleAPICalled" &&
    message.params.type === "error"
  )
    errors.push(
      message.params.args
        .map((argument) => argument.value ?? argument.description)
        .join(" "),
    );
  if (message.method === "Network.requestWillBeSent")
    requests.push(message.params.request);
});
function cdp(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++sequence;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(expression) {
  const result = await cdp("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails)
    throw new Error(
      result.exceptionDetails.exception?.description ?? "Evaluation failed",
    );
  return result.result.value;
}
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function until(expression, label = expression) {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (await evaluate(`Boolean(${expression})`)) return;
    await sleep(60);
  }
  throw new Error(`Timeout: ${label}`);
}
async function tap(expression) {
  const box = await evaluate(
    `(() => { const el = ${expression}; if (!el) throw new Error('Missing target'); el.scrollIntoView({block:'center'}); const r=el.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; })()`,
  );
  await cdp("Input.dispatchMouseEvent", {
    type: "mousePressed",
    button: "left",
    clickCount: 1,
    ...box,
  });
  await cdp("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    button: "left",
    clickCount: 1,
    ...box,
  });
  await sleep(40);
}
const button = (text) =>
  `[...document.querySelectorAll('main button')].find(el => el.textContent.trim() === ${JSON.stringify(text)})`;
const click = (text) => tap(button(text));
const selector = (value) => `document.querySelector(${JSON.stringify(value)})`;
const contains = (value) =>
  `document.querySelector('main').innerText.includes(${JSON.stringify(value)})`;
async function input(id, value) {
  await evaluate(
    `(() => {const el=document.getElementById(${JSON.stringify(id)}); const proto=el.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype; Object.getOwnPropertyDescriptor(proto,'value').set.call(el,${JSON.stringify(value)}); el.dispatchEvent(new Event('input',{bubbles:true}));})()`,
  );
}
async function screenshot(name) {
  await evaluate("window.scrollTo(0,0)");
  await sleep(200);
  const metrics = await evaluate(
    "({width:innerWidth,height:Math.ceil(document.querySelector('section[aria-label=\"Reserva de consulta\"]').getBoundingClientRect().bottom)})",
  );
  const result = await cdp("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
    clip: {
      x: 0,
      y: 0,
      width: metrics.width,
      height: metrics.height,
      scale: 1,
    },
  });
  await writeFile(
    `${directory}/${name}.png`,
    Buffer.from(result.data, "base64"),
  );
}
async function viewport(width, mobile = false) {
  await cdp("Emulation.setDeviceMetricsOverride", {
    width,
    height: 900,
    deviceScaleFactor: 1,
    mobile,
  });
  await cdp("Emulation.setTouchEmulationEnabled", { enabled: mobile });
  await cdp("Emulation.setEmulatedMedia", {
    features: [
      { name: "prefers-reduced-motion", value: "reduce" },
      { name: "hover", value: mobile ? "none" : "hover" },
    ],
  });
}
async function noOverflow(label) {
  const dimensions = await evaluate(
    "({viewport:innerWidth,document:document.documentElement.scrollWidth})",
  );
  assert.ok(
    dimensions.document <= dimensions.viewport,
    `${label}: ${JSON.stringify(dimensions)}`,
  );
}
async function start(width = 1440, mobile = false) {
  await viewport(width, mobile);
  await cdp("Page.navigate", { url: `${base}/reservar` });
  await until(
    "document.querySelectorAll('[aria-label=\"Especialidades\"] button').length===4",
  );
}
async function chooseDoctor() {
  await tap("document.querySelector('[aria-label=\"Especialidades\"] button')");
  await until(contains("Dra. Ana Rivera"));
  await click("Elegir profesional");
  await until("document.querySelectorAll('[data-date]').length===7");
}
async function chooseTime(index = 0) {
  await tap(`document.querySelectorAll('[data-date]')[${index}]`);
  await until(
    "document.querySelector('[aria-label=\"Horas disponibles\"] button')",
  );
  assert.equal(
    await evaluate(
      "document.querySelector('[aria-label=\"Horas disponibles\"] [aria-pressed=true]')!==null",
    ),
    false,
  );
  assert.equal(await evaluate(`${button("Continuar")}.disabled`), true);
  await click("09:00");
  assert.equal(await evaluate(`${button("Continuar")}.disabled`), false);
}
async function fillPatient() {
  await input("patient-name", "Paciente de ejemplo");
  await input("patient-phone", "70000000");
  await input("patient-identity", "1234567 SC");
  await input("patient-observations", "Demostración local");
}
try {
  await cdp("Page.enable");
  await cdp("Runtime.enable");
  await cdp("Network.enable");
  // Agenda determinista en esta prueba, sin modificar el reloj ni el código de la app.
  await cdp("Page.addScriptToEvaluateOnNewDocument", {
    source:
      "const NativeDate=Date; window.Date=class extends NativeDate {constructor(...args){super(...(args.length?args:['2026-10-04T16:00:00Z']));}};",
  });
  await start();
  await evaluate(`(() => {
    const search = document.querySelector('main input[type="search"]');
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(search, 'CARDIOLOGIA');
    search.dispatchEvent(new Event('input', {bubbles:true}));
  })()`);
  await until(
    "document.querySelectorAll('[aria-label=\"Especialidades\"] button').length===1",
  );
  assert.ok(
    await evaluate(
      "Boolean(document.querySelector('[aria-label=\"Especialidades\"] .lucide-heart-pulse'))",
    ),
  );
  await evaluate(`(() => {
    const search = document.querySelector('main input[type="search"]');
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(search, '');
    search.dispatchEvent(new Event('input', {bubbles:true}));
  })()`);
  await until(
    "document.querySelectorAll('[aria-label=\"Especialidades\"] button').length===4",
  );
  await screenshot("01-especialidades-desktop");
  await tap(selector("main details summary"));
  await click("Simular error");
  await until(contains("No pudimos consultar las especialidades."));
  await click("Reintentar");
  await until(
    "document.querySelectorAll('[aria-label=\"Especialidades\"] button').length===4",
  );
  await click("Sin resultados");
  await until(contains("No hay especialidades disponibles"));
  await click("Ver especialidades");
  await until(
    "document.querySelectorAll('[aria-label=\"Especialidades\"] button').length===4",
  );
  await tap("document.querySelector('[aria-label=\"Especialidades\"] button')");
  await until(contains("Dra. Ana Rivera"));
  assert.ok(
    await evaluate(contains("Bs 400")),
    "Precio visible antes de confirmar",
  );
  await screenshot("02-medicos-desktop");
  await click("Consultar disponibilidad");
  await until(contains("En esta demostración no se envían consultas"));
  await click("Elegir profesional");
  await until("document.querySelectorAll('[data-date]').length===7");
  await chooseTime();
  await tap("document.querySelectorAll('[data-date]')[1]");
  await until(contains("No quedan horarios disponibles"));
  assert.equal(await evaluate(`${button("Continuar")}.disabled`), true);
  await tap("document.querySelectorAll('[data-date]')[2]");
  await until(contains("no atiende este día"));
  await tap("document.querySelectorAll('[data-date]')[3]");
  await until(contains("No pudimos consultar los horarios"));
  await screenshot("03-horario-error");
  await click("Reintentar");
  await until(
    "document.querySelector('[aria-label=\"Horas disponibles\"] button')",
  );
  assert.equal(await evaluate(`${button("Continuar")}.disabled`), true);
  await chooseTime();
  await screenshot("04-horario-desktop");
  await click("Continuar");
  await until("document.getElementById('patient-name')");
  await click("Revisar mi selección");
  assert.equal(
    await evaluate(
      "document.querySelectorAll('input[aria-invalid=true]').length",
    ),
    3,
  );
  assert.equal(await evaluate("document.activeElement.id"), "patient-name");
  await fillPatient();
  await screenshot("05-datos-desktop");
  await click("Volver");
  await until(
    "document.querySelector('[aria-label=\"Horas disponibles\"] button')",
  );
  assert.equal(
    await evaluate(
      "document.querySelector('[aria-label=\"Horas disponibles\"] [aria-pressed=true]').textContent",
    ),
    "09:00",
  );
  await click("Continuar");
  await until("document.getElementById('patient-name')");
  assert.equal(
    await evaluate("document.getElementById('patient-name').value"),
    "Paciente de ejemplo",
  );
  await click("Revisar mi selección");
  await until(contains("Revisá los detalles"));
  await screenshot("06-resumen-desktop");
  await tap(selector('[aria-label="Cambiar médico"]'));
  await until(contains("Dra. Lucía Méndez"));
  await tap(
    "[...document.querySelectorAll('article')].find(el=>el.textContent.includes('Dra. Lucía Méndez')).querySelector('button')",
  );
  await until("document.querySelectorAll('[data-date]').length===7");
  assert.equal(
    await evaluate(
      "document.querySelector('[data-date][aria-pressed=true]')!==null",
    ),
    false,
  );
  await chooseTime();
  await click("Continuar");
  await until("document.getElementById('patient-name')");
  assert.equal(
    await evaluate("document.getElementById('patient-name').value"),
    "Paciente de ejemplo",
  );
  await click("Revisar mi selección");
  await until(contains("Revisá los detalles"));
  await click("Continuar al pago de ejemplo");
  await until("document.getElementById('payment-receipt')");
  assert.ok(await evaluate(contains("Bs 350")));
  const fixture = `${directory}/comprobante-demo.pdf`;
  await writeFile(
    fixture,
    "%PDF-1.4\n% Archivo ficticio para la prueba de selección local.\n%%EOF\n",
  );
  let root = await cdp("DOM.getDocument");
  let fileNode = await cdp("DOM.querySelector", {
    nodeId: root.root.nodeId,
    selector: "#payment-receipt",
  });
  await cdp("DOM.setFileInputFiles", {
    nodeId: fileNode.nodeId,
    files: [fixture],
  });
  await until(contains("Seleccionado localmente"));
  await tap(selector('[aria-label="Quitar archivo"]'));
  assert.equal(
    await evaluate(`${button("Simular envío y continuar")}.disabled`),
    true,
  );
  await cdp("DOM.setFileInputFiles", {
    nodeId: fileNode.nodeId,
    files: [fixture],
  });
  await until(contains("Seleccionado localmente"));
  await screenshot("07-pago-desktop");
  await click("Simular envío y continuar");
  await until(contains("Vista previa de confirmación"));
  assert.ok(await evaluate(contains("Comprobante enviado · simulado")));
  await click("Ver ejemplo de verificación");
  await until(contains("En verificación · simulado"));
  assert.ok(await evaluate(contains("No existe una cita reservada.")));
  await screenshot("08-confirmacion-desktop");
  console.log(
    "OK: flujo desktop, precios, validaciones, conservación de datos, invalidaciones, vacío, error/reintento y comprobante local.",
  );

  for (const width of [360, 390, 412]) {
    await start(width, true);
    await noOverflow(`especialidades ${width}`);
    if (width === 390) await screenshot("09-especialidades-movil-390");
    await chooseDoctor();
    await noOverflow(`horario ${width}`);
    await chooseTime();
    const touch = await evaluate(
      "[...document.querySelectorAll('[data-date], [aria-label=\"Horas disponibles\"] button')].every(el=>{const r=el.getBoundingClientRect(); return r.width>=44 && r.height>=44;})",
    );
    assert.ok(touch, `Targets táctiles de al menos 44px en ${width}`);
    if (width === 390) await screenshot("10-horario-movil-390");
    await click("Continuar");
    await until("document.getElementById('patient-name')");
    await fillPatient();
    await noOverflow(`datos ${width}`);
    await click("Revisar mi selección");
    await until(contains("Revisá los detalles"));
    await noOverflow(`resumen ${width}`);
    await click("Continuar al pago de ejemplo");
    await until("document.getElementById('payment-receipt')");
    await noOverflow(`pago ${width}`);
    if (width === 390) await screenshot("11-pago-movil-390");
    await click("Ver confirmación sin comprobante");
    await until(contains("Vista previa de confirmación"));
    await noOverflow(`confirmación ${width}`);
  }
  console.log(
    "OK: recorrido completo a 360, 390 y 412 px sin overflow; controles táctiles y sin dependencia de hover.",
  );

  await start();
  await evaluate(
    "document.querySelector('[aria-label=\"Especialidades\"] button').focus()",
  );
  await cdp("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: "Enter",
    code: "Enter",
    windowsVirtualKeyCode: 13,
    text: "\r",
  });
  await cdp("Input.dispatchKeyEvent", {
    type: "keyUp",
    key: "Enter",
    code: "Enter",
    windowsVirtualKeyCode: 13,
  });
  await until(contains("Dra. Ana Rivera"));
  assert.equal(await evaluate("document.activeElement.tagName"), "H2");
  for (const width of [390, 1440]) {
    await viewport(width, width === 390);
    for (const path of [
      "/",
      "/servicios",
      "/especialidades",
      "/dr-montalvo",
      "/sobre-nosotros",
      "/atencion-al-paciente",
      "/staff-medico",
      "/blog",
    ]) {
      await cdp("Page.navigate", { url: `${base}${path}` });
      await sleep(180);
      await until(
        `location.pathname===${JSON.stringify(path)} && document.readyState==='complete' && document.querySelector('h1')`,
      );
      await noOverflow(`landing ${path} ${width}`);
      assert.equal(
        await evaluate(
          "[...document.images].some(img=>img.complete && img.naturalWidth===0)",
        ),
        false,
        `Imágenes en ${path}`,
      );
      assert.equal(
        await evaluate(
          "document.querySelector('[data-site-header] a[href=\"/reservar\"]')?.target",
        ),
        "",
      );
    }
  }
  await start(390, true);
  await tap(selector('[aria-label="Abrir menú"]'));
  await until("document.querySelector('[role=dialog] a[href=\"/reservar\"]')");
  await tap(selector('[role="dialog"] a[href="/reservar"]'));
  await until("!document.querySelector('[role=dialog]')");
  console.log(
    "OK: ocho páginas existentes en móvil/desktop, imágenes y CTAs; menú móvil cierra al reservar.",
  );
  const storage = await evaluate(
    "({local:Object.keys(localStorage),session:Object.keys(sessionStorage)})",
  );
  assert.deepEqual(storage, { local: [], session: [] });
  assert.ok(!requests.some((request) => request.method !== "GET"));
  assert.ok(
    requests.every(
      (request) =>
        request.url.startsWith(base) || request.url.startsWith("data:"),
    ),
  );
  assert.deepEqual(errors, []);
  console.log(
    "OK: teclado, foco al avanzar, sin errores JS, sin solicitudes externas/POST y sin localStorage/sessionStorage.",
  );
  await writeFile(
    `${directory}/results.json`,
    JSON.stringify(
      {
        status: "passed",
        widths: [360, 390, 412, 1440],
        exceptions: errors,
        requests: requests.length,
        externalRequests: 0,
        mutations: 0,
        storage,
      },
      null,
      2,
    ),
  );
  console.log(`Evidencia: ${directory}`);
} finally {
  socket.close();
}
