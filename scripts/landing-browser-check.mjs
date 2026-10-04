/** Regresión local de navegación, primera visita, imágenes y movimiento.
 * Requiere la compilación en 127.0.0.1:3100 y Chromium con CDP en :9228.
 * No instala dependencias ni visita producción. */
import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const base = "http://127.0.0.1:3100";
const output = "/tmp/montalvo-landing-review";
await mkdir(output, { recursive: true });
const targets = await (await fetch("http://127.0.0.1:9228/json")).json();
const socket = new WebSocket(targets.find(target => target.type === "page").webSocketDebuggerUrl);
await new Promise(resolve => socket.addEventListener("open", resolve, { once: true }));
let sequence = 0;
const pending = new Map();
const errors = [];
const results = [];
socket.addEventListener("message", event => {
  const message = JSON.parse(event.data);
  if (message.id) {
    const callback = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) callback.reject(new Error(JSON.stringify(message.error)));
    else callback.resolve(message.result);
  }
  if (message.method === "Runtime.exceptionThrown") errors.push(message.params.exceptionDetails.text);
});
function cdp(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++sequence;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(expression) {
  const result = await cdp("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? "Evaluation failed");
  return result.result.value;
}
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function until(expression) {
  for (let attempt = 0; attempt < 250; attempt++) {
    if (await evaluate(`Boolean(${expression})`)) return;
    await sleep(60);
  }
  throw new Error(`Timeout: ${expression}`);
}
async function visit(path) {
  await cdp("Page.navigate", { url: base + path });
  await sleep(150);
  await until(`location.pathname===${JSON.stringify(path.split("#")[0])}&&document.readyState==='complete'&&document.querySelector('h1')`);
}
async function viewport(width, reduced = false) {
  await cdp("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width < 600 });
  await cdp("Emulation.setTouchEmulationEnabled", { enabled: width < 600 });
  await cdp("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: reduced ? "reduce" : "no-preference" }] });
}
async function tap(expression) {
  const point = await evaluate(`(()=>{const el=${expression};el.scrollIntoView({block:'center'});const r=el.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})()`);
  await cdp("Input.dispatchMouseEvent", { type: "mousePressed", button: "left", clickCount: 1, ...point });
  await cdp("Input.dispatchMouseEvent", { type: "mouseReleased", button: "left", clickCount: 1, ...point });
}
async function screenshot(name) {
  const result = await cdp("Page.captureScreenshot", { format: "png" });
  await writeFile(`${output}/${name}.png`, Buffer.from(result.data, "base64"));
}
const activeHero = "document.querySelector('[data-hero-rotation] [data-active] img')";
const activeTeam = "document.querySelector('[aria-roledescription=carrusel] [data-active] img')";
try {
  await cdp("Page.enable"); await cdp("Runtime.enable"); await cdp("Network.enable");
  await cdp("Network.setCacheDisabled", { cacheDisabled: true });
  await cdp("Page.addScriptToEvaluateOnNewDocument", { source: `window.metrics={lcp:0,cls:0};new PerformanceObserver(list=>{for(const e of list.getEntries())window.metrics.lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.metrics.cls+=e.value}).observe({type:'layout-shift',buffered:true});` });

  for (const width of [360, 390, 412, 820, 1440]) {
    await viewport(width);
    for (const path of ["/", "/servicios", "/especialidades", "/dr-montalvo", "/sobre-nosotros", "/atencion-al-paciente", "/staff-medico", "/blog", "/reservar"]) {
      await visit(path); await sleep(120);
      const result = await evaluate("({overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(img=>img.complete&&!img.naturalWidth).map(img=>img.src),...window.metrics})");
      assert.equal(result.overflow, false, `${path} a ${width}px`);
      assert.deepEqual(result.broken, [], `Fotos en ${path}`);
      results.push({ path, width, ...result });
      if (path === "/" && [390, 1440].includes(width)) {
        await sleep(950); await screenshot(`inicio-${width}`);
      }
    }
  }
  console.log("OK: 45 combinaciones de ruta/ancho sin overflow ni fotos rotas.");

  await viewport(390);
  await visit("/servicios#silver");
  await until("document.querySelector('#tab-silver[aria-selected=true]') && scrollY>0");
  assert.ok(await evaluate("document.getElementById('habitaciones').getBoundingClientRect().top>=50 && document.getElementById('habitaciones').getBoundingClientRect().top<300"));
  await screenshot("suite-enlace-directo-390");
  await evaluate("document.querySelector('#tab-silver').focus()");
  await cdp("Input.dispatchKeyEvent", { type: "keyDown", key: "ArrowRight", code: "ArrowRight", windowsVirtualKeyCode: 39 });
  await cdp("Input.dispatchKeyEvent", { type: "keyUp", key: "ArrowRight", code: "ArrowRight", windowsVirtualKeyCode: 39 });
  await until("document.querySelector('#tab-bronce[aria-selected=true]')");
  console.log("OK: enlace directo visible y pestañas por teclado.");

  await viewport(1440);
  await cdp("Network.setBlockedURLs", { urls: ["*equipo-completo-20261001*"] });
  await visit("/sobre-nosotros");
  await evaluate("document.querySelector('[aria-roledescription=carrusel]').scrollIntoView({block:'center'})");
  await until(`${activeTeam}?.complete && ${activeTeam}.naturalWidth>0 && !${activeTeam}.src.includes('equipo-completo')`);
  await screenshot("galeria-recuperada");
  await tap("document.querySelector('[aria-label=\"Fotografía anterior\"]')");
  await until(`${activeTeam}?.src.includes('equipo-cercano') && ${activeTeam}.naturalWidth>0`);
  await cdp("Network.setBlockedURLs", { urls: ["*equipo-completo-20261001*", "*equipo-entrada-20261001*", "*equipo-cercano-20261001*"] });
  await visit("/sobre-nosotros");
  await evaluate("document.querySelector('[aria-roledescription=carrusel]').scrollIntoView({block:'center'})");
  await until("document.body.innerText.includes('No pudimos cargar las fotografías')");
  assert.ok(await evaluate("document.querySelector('[aria-label=\"Fotografía anterior\"]').disabled && document.querySelector('[aria-label=\"Fotografía siguiente\"]').disabled"));
  console.log("OK: primera foto fallida, navegación omitiendo errores y galería completamente sin conexión.");

  await cdp("Network.setBlockedURLs", { urls: ["*silver%2Fprincipal-1*"] });
  await visit("/");
  await until(`${activeHero}?.naturalWidth>0 && ${activeHero}.src.includes('fachada')`);
  await cdp("Network.setBlockedURLs", { urls: [] });
  await viewport(390);
  await visit("/");
  await until(`${activeHero}?.naturalWidth>0`);
  await sleep(950);
  assert.ok(await evaluate("(()=>{const b=document.querySelector('.hero-motion-control');const r=b.getBoundingClientRect();return r.width>=44&&r.height>=44&&b.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))})()"));
  await tap("document.querySelector('.hero-motion-control')");
  await until("document.querySelector('.hero-motion-control').getAttribute('aria-pressed')==='true'");
  const pausedImage = await evaluate(`${activeHero}.src`);
  await sleep(8300);
  assert.equal(await evaluate(`${activeHero}.src`), pausedImage);
  await viewport(390, true);
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.hero-motion-control')).display"), "none");
  console.log("OK: recuperación de portada, pausa táctil durante un ciclo completo y movimiento reducido.");

  const manifest = JSON.parse(await readFile(".next/react-loadable-manifest.json", "utf8"));
  const files = manifest["components/sections/RoomGallery.tsx -> @/components/sections/RoomLightbox"].files.filter(file => file.endsWith(".js"));
  await viewport(1440);
  await cdp("Network.setBlockedURLs", { urls: files.map(file => `*${file}`) });
  await visit("/servicios#gold");
  const openGallery = "[...document.querySelectorAll('button')].find(button=>button.textContent.trim().startsWith('Ver las'))";
  await tap(openGallery);
  await until("document.body.innerText.includes('No pudimos abrir la galería')");
  await cdp("Network.setBlockedURLs", { urls: [] });
  await tap("[...document.querySelectorAll('button')].find(button=>button.textContent.trim()==='Reintentar')");
  await until("document.querySelector('[aria-label=\"Cerrar galería\"]')");
  await screenshot("visor-en-espanol");
  await tap("document.querySelector('[aria-label=\"Cerrar galería\"]')");
  await until("!document.querySelector('[aria-label=\"Cerrar galería\"]')");
  console.log("OK: descarga del visor fallida, reintento y controles en español.");

  assert.deepEqual(errors, []);
  await writeFile(`${output}/resultados.json`, JSON.stringify({ status: "passed", routes: results, errors }, null, 2));
  console.log(`Evidencia: ${output}`);
} finally { socket.close(); }
