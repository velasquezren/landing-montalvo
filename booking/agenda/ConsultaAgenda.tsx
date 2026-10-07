"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/content/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { leerRespuesta } from "@/lib/agenda/contrato";
import type { DisponibilidadAgenda, EspecialidadAgenda, MedicoAgenda, PaginaAgenda, RecursoAgenda } from "@/lib/agenda/contrato";
import { consultaInicial, fechasConsulta, precioConsulta, reducirConsulta } from "./state";
import s from "./consulta.module.css";

type Remoto<T> = { estado: "cargando" } | { estado: "error" } | { estado: "listo"; datos: T };

/** El resultado anterior se oculta en el mismo render que cambia la consulta.
 * Abortar y comparar la clave evita mostrar horas de otro médico/fecha. */
function useLectura<T>(recurso: RecursoAgenda, parametros: string | null) {
  const [intento, reintentar] = useReducer(n => n + 1, 0);
  const clave = `${recurso}?${parametros}|${intento}`;
  const [resultado, setResultado] = useState<{ clave: string; lectura: Remoto<T> } | null>(null);
  useEffect(() => {
    if (parametros === null) return;
    const abort = new AbortController();
    let activa = true;
    const query = new URLSearchParams(parametros);
    fetch(`/api/agenda/${recurso}?${query}`, { cache: "no-store", signal: abort.signal })
      .then(async respuesta => {
        if (!respuesta.ok) throw new Error("Agenda no disponible");
        const crudo: unknown = await respuesta.json();
        if (recurso !== "disponibilidad") query.set("limite", "25");
        return leerRespuesta(recurso, crudo, query) as T;
      })
      .then(datos => { if (activa) setResultado({ clave, lectura: { estado: "listo", datos } }); })
      .catch(() => { if (activa) setResultado({ clave, lectura: { estado: "error" } }); });
    return () => { activa = false; abort.abort(); };
  }, [recurso, parametros, clave]);
  const lectura: Remoto<T> = resultado?.clave === clave ? resultado.lectura : { estado: "cargando" };
  return { lectura, reintentar };
}

function EstadoLectura({ estado, reintentar }: { estado: "cargando" | "error"; reintentar: () => void }) {
  return estado === "cargando" ? <div role="status" aria-live="polite">
    <p>Consultando la agenda de la clínica…</p><div className={s.skeleton} aria-hidden="true" /><div className={s.skeleton} aria-hidden="true" />
  </div> : <div role="alert" className={s.notice}>
    <p>No pudimos consultar la agenda. Esto no significa que no haya horarios.</p>
    <Button onClick={reintentar}><RefreshCw size={16} aria-hidden="true" />Reintentar</Button>
  </div>;
}
function Paginacion({ pagina, total, cambiar }: { pagina: number; total: number; cambiar: (n: number) => void }) {
  if (total <= 1) return null;
  return <nav className={s.pagination} aria-label="Páginas del catálogo">
    <Button disabled={pagina === 1} onClick={() => cambiar(pagina - 1)}>Anterior</Button>
    <span aria-live="polite">{pagina} de {total}</span>
    <Button disabled={pagina === total} onClick={() => cambiar(pagina + 1)}>Siguiente</Button>
  </nav>;
}
function Especialidades({ elegir }: { elegir: (e: EspecialidadAgenda) => void }) {
  const [pagina, setPagina] = useState(1);
  const { lectura, reintentar } = useLectura<PaginaAgenda<EspecialidadAgenda>>("especialidades", `pagina=${pagina}`);
  if (lectura.estado !== "listo") return <EstadoLectura estado={lectura.estado} reintentar={reintentar} />;
  return <>
    {lectura.datos.datos.length === 0 && <p>No hay especialidades disponibles para consulta en línea. Recepción puede orientarte.</p>}
    <div className={s.options} aria-label="Especialidades de la agenda">{lectura.datos.datos.map(e => <button className={s.option} key={e.id} onClick={() => elegir(e)}>
      <span>{e.nombre}</span><ArrowRight size={18} aria-hidden="true" />
    </button>)}</div>
    <Paginacion pagina={pagina} total={lectura.datos.totalPaginas} cambiar={setPagina} />
  </>;
}
function Medicos({ especialidad, elegir }: { especialidad: EspecialidadAgenda; elegir: (m: MedicoAgenda) => void }) {
  const [pagina, setPagina] = useState(1);
  const { lectura, reintentar } = useLectura<PaginaAgenda<MedicoAgenda>>("medicos", new URLSearchParams({ pagina: String(pagina), especialidadId: especialidad.id }).toString());
  if (lectura.estado !== "listo") return <EstadoLectura estado={lectura.estado} reintentar={reintentar} />;
  return <>
    {lectura.datos.datos.length === 0 && <p>No hay profesionales disponibles en línea para esta especialidad. Podés consultar con recepción.</p>}
    <div className={s.doctors}>{lectura.datos.datos.map(m => <article key={m.id} className={s.doctor}>
      <span className={s.avatar} aria-hidden="true">{m.nombre.split(" ").filter(Boolean).slice(0, 2).map(p => p[0]).join("")}</span>
      <h3>{m.nombre}</h3><p>{especialidad.nombre}</p>
      {m.horarioInformativo && <p className={s.schedule}>{m.horarioInformativo}<br /><small>Horario habitual; los cupos se consultan por fecha.</small></p>}
      <strong className={s.price}>{precioConsulta(m.precio)}</strong>
      <Button onClick={() => elegir(m)}>{m.modalidad === "ONLINE" ? "Consultar horarios" : "Consultar disponibilidad"}<ArrowRight size={16} aria-hidden="true" /></Button>
    </article>)}</div>
    <Paginacion pagina={pagina} total={lectura.datos.totalPaginas} cambiar={setPagina} />
  </>;
}

function Horarios({ datos, medico, reintentar }: { datos: DisponibilidadAgenda; medico: MedicoAgenda; reintentar: () => void }) {
  const [seleccion, setSeleccion] = useState<string | null>(null);
  const [vencida, setVencida] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setVencida(true), Math.max(0, 60_000 - (Date.now() - Date.parse(datos.consultadoEn))));
    return () => clearTimeout(timer);
  }, [datos.consultadoEn]);
  const hora = datos.horarios.find(h => h.id === seleccion)?.hora;
  if (vencida) return <div className={s.notice} role="status"><p>Los horarios pueden haber cambiado. Volvé a consultarlos antes de elegir.</p><Button onClick={reintentar}>Actualizar horarios</Button></div>;
  const fecha = new Intl.DateTimeFormat("es-BO", { weekday: "long", day: "numeric", month: "long", timeZone: "America/La_Paz" }).format(new Date(`${datos.fecha}T12:00:00-04:00`));
  const mensajes = {
    SIN_CUPOS: "No quedan horarios disponibles para esta fecha. Podés elegir otro día.",
    SIN_ATENCION: `${medico.nombre} no atiende este día. Elegí otra fecha.`,
    A_SOLICITUD: "La disponibilidad de este profesional se coordina con recepción.",
  };
  return <div aria-live="polite">
    {datos.estado !== "DISPONIBLE" ? <p className={s.notice}>{mensajes[datos.estado]}</p> : <>
      <p className={s.label}>Horarios consultados · hora de Bolivia</p>
      <div className={s.slots} aria-label="Horarios disponibles">{datos.horarios.map(h => <button key={h.id} className={s.slot} aria-pressed={seleccion === h.id} onClick={() => setSeleccion(h.id)}>{h.hora}{seleccion === h.id && <Check size={15} aria-hidden="true" />}</button>)}</div>
      <p className={s.hint}>Elegir una hora aquí no la bloquea ni crea una reserva.</p>
      {hora && <div className={s.selection}><strong>{medico.nombre}</strong><p>{fecha} · {hora}</p><p>{precioConsulta(medico.precio)}</p>
        <Button asChild><a href={buildWhatsAppUrl(`Hola, quisiera coordinar una consulta con ${medico.nombre} el ${datos.fecha} a las ${hora}. Vi ese horario en la web; ¿pueden confirmar si sigue disponible?`)} target="_blank" rel="noopener noreferrer">Consultar esta hora por WhatsApp<ArrowRight size={16} aria-hidden="true" /></a></Button>
      </div>}
    </>}
    <button className={s.textButton} onClick={reintentar}><RefreshCw size={15} aria-hidden="true" />Volver a consultar horarios</button>
  </div>;
}
function Disponibilidad({ medico, fecha, cambiar }: { medico: MedicoAgenda; fecha: string; cambiar: (f: string) => void }) {
  const { lectura, reintentar } = useLectura<DisponibilidadAgenda>("disponibilidad", fecha && medico.modalidad === "ONLINE" ? new URLSearchParams({ medicoId: medico.id, fecha }).toString() : null);
  const { hoy, ultimo } = fechasConsulta();
  if (medico.modalidad === "A_SOLICITUD") return <div className={s.notice}>
    <p>La disponibilidad de {medico.nombre} se coordina directamente con recepción.</p>
    <Button asChild><a href={buildWhatsAppUrl(`Hola, quisiera consultar disponibilidad con ${medico.nombre}.`)} target="_blank" rel="noopener noreferrer">Consultar disponibilidad</a></Button>
  </div>;
  return <>
    <label className={s.label} htmlFor="fecha-agenda">¿Qué día te viene bien?</label>
    <input className={s.date} id="fecha-agenda" type="date" value={fecha} min={hoy} max={ultimo} onChange={e => cambiar(e.target.value)} aria-describedby="fecha-ayuda" />
    <p id="fecha-ayuda" className={s.hint}>Consultá los próximos 30 días, incluido hoy. Los horarios se comprueban al elegir una fecha.</p>
    {fecha && (lectura.estado !== "listo" ? <EstadoLectura estado={lectura.estado} reintentar={reintentar} />
      : <Horarios key={`${medico.id}|${fecha}|${lectura.datos.consultadoEn}`} datos={lectura.datos} medico={medico} reintentar={reintentar} />)}
  </>;
}

export default function ConsultaAgenda({ volver }: { volver: () => void }) {
  const [consulta, dispatch] = useReducer(reducirConsulta, consultaInicial);
  const titulo = useRef<HTMLHeadingElement>(null);
  useEffect(() => { titulo.current?.focus({ preventScroll: true }); }, [consulta.paso]);
  const titulos = ["¿Qué atención necesitás?", "Elegí tu profesional", "Un horario que te quede bien"];
  return <section className={s.root} aria-label="Consulta de agenda">
    <button className={s.textButton} onClick={() => consulta.paso === 0 ? volver() : dispatch({ tipo: "volver" })}><ArrowLeft size={17} aria-hidden="true" />Volver</button>
    <p className={s.eyebrow}>Clínica Montalvo · Agenda</p>
    <h1 ref={titulo} tabIndex={-1}>{titulos[consulta.paso]}</h1>
    <p className={s.intro}>Consultá especialidades, profesionales y horarios. La reserva y el pago se completan en nuestra agenda de citas.</p>
    <ol className={s.progress} aria-label="Pasos de consulta">{["Especialidad", "Profesional", "Horarios"].map((t, i) => <li key={t} aria-current={i === consulta.paso ? "step" : undefined}>{i + 1}. {t}</li>)}</ol>
    <div className={s.layout}><div className={s.content}>
      {consulta.paso === 0 && <Especialidades elegir={especialidad => dispatch({ tipo: "especialidad", especialidad })} />}
      {consulta.paso === 1 && consulta.especialidad && <Medicos key={consulta.especialidad.id} especialidad={consulta.especialidad} elegir={medico => dispatch({ tipo: "medico", medico })} />}
      {consulta.paso === 2 && consulta.medico && <Disponibilidad key={consulta.medico.id} medico={consulta.medico} fecha={consulta.fecha} cambiar={fecha => dispatch({ tipo: "fecha", fecha })} />}
    </div><aside className={s.summary} aria-label="Tu consulta">
      <CalendarDays size={26} aria-hidden="true" /><h2>Tu consulta</h2>
      {consulta.especialidad && <p>{consulta.especialidad.nombre}</p>}
      {consulta.medico && <><strong>{consulta.medico.nombre}</strong><p>{precioConsulta(consulta.medico.precio)}</p></>}
      <p>Para reservar y pagar, continuá en la agenda de la clínica. Allí tendrás que elegir nuevamente el profesional y el horario; la clínica continuará el proceso de reserva y verificación.</p>
      <Button asChild variant="primary"><a href={siteConfig.appointmentUrl} referrerPolicy="no-referrer">Continuar en la agenda<ArrowRight size={16} aria-hidden="true" /></a></Button>
      <a className={s.contact} href={buildWhatsAppUrl("Hola, quisiera ayuda de recepción para reservar una cita.")} target="_blank" rel="noopener noreferrer">Prefiero coordinar por WhatsApp</a>
    </aside></div>
  </section>;
}
