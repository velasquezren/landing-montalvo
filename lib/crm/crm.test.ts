import { test } from "node:test";
import assert from "node:assert/strict";
import { especialidadDe, fichaDe, medicoDe, paginaDe, promocionDe, urlDeImagen } from "./normalizar.ts";

const API = "https://crm.ejemplo.test";

test("una imagen solo se acepta si la sirve el propio CRM", () => {
  assert.equal(urlDeImagen("/publico/directorio/fotos/abc", API), `${API}/publico/directorio/fotos/abc`);
  assert.equal(urlDeImagen(`${API}/publico/promociones/imagenes/1`, API), `${API}/publico/promociones/imagenes/1`);
  assert.equal(urlDeImagen("https://otro.test/foto.jpg", API), null);
  assert.equal(urlDeImagen("http://crm.ejemplo.test/foto.jpg", API), null, "otro protocolo, otro origen");
  assert.equal(urlDeImagen("javascript:alert(1)", API), null);
  assert.equal(urlDeImagen(null, API), null);
});

test("un médico sin slug o sin nombre se descarta; lo opcional malformado queda ausente", () => {
  assert.equal(medicoDe({ nombre: "Dra. Ana" }, API), null);
  assert.equal(medicoDe({ slug: "../admin", nombre: "Dra. Ana" }, API), null);
  const m = medicoDe(
    {
      slug: "ana-rojas",
      nombre: "  Dra. Ana Rojas ",
      precioConsulta: "250",
      fotoUrl: "https://otro.test/x.jpg",
      especialidades: [{ slug: "ginecologia", nombre: "Ginecología" }, { nombre: "sin slug" }],
      horario: [
        { diaSemana: 3, desde: "15:00", hasta: "18:00", lugar: "" },
        { diaSemana: 1, desde: "08:00", hasta: "12:00" },
        { diaSemana: 8, desde: "08:00", hasta: "12:00" },
        { diaSemana: 2, desde: "12:00", hasta: "08:00" },
      ],
      resumenHorario: "",
    },
    API,
  );
  assert.ok(m);
  assert.equal(m.nombre, "Dra. Ana Rojas");
  assert.equal(m.precioConsulta, 250);
  assert.equal(m.fotoUrl, null);
  assert.deepEqual(m.especialidades, [{ slug: "ginecologia", nombre: "Ginecología" }]);
  assert.deepEqual(
    m.horario.map((b) => `${b.diaSemana} ${b.desde}`),
    ["1 08:00", "3 15:00"],
    "ordenado y sin bloques imposibles",
  );
  assert.equal(m.resumenHorario, "Con cita a solicitud");
  assert.deepEqual(m.ausencias, []);
});

test("la ficha toma las ausencias con el nombre de campo de la ficha", () => {
  const f = fichaDe(
    {
      slug: "ana",
      nombre: "Dra. Ana",
      biografia: "Ginecóloga.",
      ausencias: [{ desde: "2026-10-20", hasta: "2026-10-25", motivoPublico: "Vacaciones" }],
    },
    API,
  );
  assert.deepEqual(f?.ausencias, [{ desde: "2026-10-20", hasta: "2026-10-25", motivo: "Vacaciones" }]);
  assert.equal(f?.biografia, "Ginecóloga.");
  assert.equal(f?.matricula, null);
});

test("una promoción: banners del CRM, y nunca un «descuento» que no lo es", () => {
  const p = promocionDe(
    {
      slug: "control-prenatal",
      codigo: "PRM-7K3QX",
      titulo: "Control prenatal",
      resumen: "Ecografía y consulta.",
      precioRegular: 400,
      precioPromocional: 450,
      vigenteDesde: "2026-10-01",
      vigenteHasta: "2026-10-31",
      destacada: true,
      banners: {
        CUADRADO: { url: "/publico/promociones/imagenes/1", ancho: 1080, alto: 1080, alt: "Banner" },
        HORIZONTAL: { url: "https://otro.test/b.jpg", ancho: 1200, alto: 628, alt: "x" },
        VERTICAL: { url: "/publico/promociones/imagenes/2", ancho: 0, alto: 1350, alt: "x" },
      },
      mensajeWhatsapp: "Hola, quisiera la promoción PRM-7K3QX",
    },
    API,
  );
  assert.ok(p);
  assert.equal(p.precioPromocional, null);
  assert.deepEqual(Object.keys(p.banners), ["CUADRADO"]);
  assert.equal(p.banners.CUADRADO?.url, `${API}/publico/promociones/imagenes/1`);
  assert.equal(p.destacada, true);
  assert.equal(promocionDe({ slug: "x", titulo: "Sin código", vigenteDesde: "2026-10-01" }, API), null);
});

test("especialidades y páginas: lo que no tiene forma se rechaza", () => {
  assert.deepEqual(especialidadDe({ slug: "pediatria", nombre: "Pediatría", medicos: 3, id: "interno" }), {
    slug: "pediatria",
    nombre: "Pediatría",
    descripcion: null,
    medicos: 3,
  });
  assert.equal(paginaDe({ error: "x" }), null);
  assert.deepEqual(paginaDe({ datos: [], totalPaginas: 0 }), { datos: [], totalPaginas: 1 });
});

test("un precio vacío no se convierte en una consulta gratuita", () => {
  for (const precioConsulta of ["", "  ", null, undefined, false]) {
    assert.equal(medicoDe({ slug: "ana", nombre: "Dra. Ana", precioConsulta }, API)?.precioConsulta, null);
  }
  assert.equal(medicoDe({ slug: "ana", nombre: "Dra. Ana", precioConsulta: 0 }, API)?.precioConsulta, 0);
});

test("las fechas imposibles no llegan a las fichas ni bloquean días del calendario", () => {
  const m = medicoDe({ slug: "ana", nombre: "Dra. Ana", ausencias: [
    { desde: "2026-02-30", hasta: "2026-03-02" },
    { desde: "2026-13-01", hasta: "2026-13-02" },
    { desde: "2028-02-29", hasta: "2028-02-29" },
  ] }, API);
  assert.deepEqual(m?.ausencias, [{ desde: "2028-02-29", hasta: "2028-02-29", motivo: null }]);
  assert.equal(promocionDe({ slug: "promo", codigo: "PRM-TEST", titulo: "Ejemplo", vigenteDesde: "2026-13-01" }, API), null);
});

test("las imágenes respetan también la ruta pública y los parámetros permitidos por Next", () => {
  for (const ruta of ["/privado/foto", "/publico/../privado/foto", "/publico/foto?token=ejemplo", "/publico/foto#fragmento", "https://usuario:ejemplo@crm.ejemplo.test/publico/foto"]) {
    assert.equal(urlDeImagen(ruta, API), null, ruta);
  }
});
