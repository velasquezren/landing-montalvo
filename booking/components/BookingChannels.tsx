"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, CalendarDays, Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/content/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { BookingChannel } from "../channels";
import type { CatalogoReserva, SolicitudDraft } from "../types";
import BookingFlow from "./BookingFlow";
import s from "../channels.module.css";

// El prototipo y sus mocks no se cargan al elegir WhatsApp.
const WebBookingDemo = dynamic(() => import("../web-demo/components/BookingFlow"), {
  loading: () => <p className={s.loading} role="status">Preparando la vista de reserva web…</p>,
});
const ConsultaAgenda = dynamic(() => import("../agenda/ConsultaAgenda"), {
  loading: () => <p className={s.loading} role="status">Abriendo la consulta de agenda…</p>,
});

export default function BookingChannels({
  catalogo,
  demoEnabled,
  initial = "choose",
  preselection,
  agendaEnabled = false,
}: {
  catalogo: CatalogoReserva;
  demoEnabled: boolean;
  initial?: BookingChannel;
  preselection?: { draft: SolicitudDraft; paso: number };
  agendaEnabled?: boolean;
}) {
  const canPrepare = catalogo.especialidades.length > 0;
  const [requestedChannel, setChannel] = useState<BookingChannel>(initial);
  const channel = requestedChannel === "web-demo" && !demoEnabled || requestedChannel === "whatsapp" && !canPrepare || requestedChannel === "agenda" && !agendaEnabled
    ? "choose" : requestedChannel;
  const [demoVisited, setDemoVisited] = useState(demoEnabled && initial === "web-demo");
  const root = useRef<HTMLDivElement>(null);

  function choose(next: BookingChannel) {
    if (next === "web-demo" && !demoEnabled || next === "agenda" && !agendaEnabled) return;
    if (next === "web-demo") setDemoVisited(true);
    setChannel(next);
    requestAnimationFrame(() => {
      root.current?.querySelector<HTMLElement>('[data-active="true"]')?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "instant" });
    });
  }

  return (
    <div ref={root}>
      <section
        hidden={channel !== "choose"}
        data-active={channel === "choose"}
        tabIndex={-1}
        className={s.entry}
        aria-labelledby="booking-channels-title"
      >
        <nav className={s.breadcrumb} aria-label="Ruta de navegación">
          <Link href="/">Inicio</Link><span aria-hidden="true">/</span> Consultas
        </nav>
        <p className={s.eyebrow}>Clínica Montalvo · A tu ritmo</p>
        <h1 id="booking-channels-title">Tu consulta,<br />a tu manera.</h1>
        <p className={s.lead}>Reservá en nuestra agenda web o coordiná tu cita por WhatsApp. Vos elegís.</p>
        <div className={s.cards}>
          <article className={s.card}>
            <span className={s.icon}><CalendarDays size={28} strokeWidth={1.5} aria-hidden="true" /></span>
            <p className={s.badge}>Agenda de la clínica</p>
            <h2>Reservar en la web</h2>
            <p>Continuá en nuestra agenda de citas. Elegí la especialidad, el profesional y el horario de tu consulta.</p>
            <ul>
              <li><Check size={17} aria-hidden="true" />Reserva desde el navegador</li>
              <li><Check size={17} aria-hidden="true" />Médicos y horarios de la agenda</li>
              <li><Check size={17} aria-hidden="true" />Sin necesidad de pasar por WhatsApp</li>
            </ul>
            <p className={s.notice}>El siguiente paso se realiza en la página de nuestra agenda de citas.</p>
            {agendaEnabled && <Button onClick={() => choose("agenda")} size="lg">Consultar médicos y horarios<ArrowRight size={17} aria-hidden="true" /></Button>}
            <Button asChild variant="primary" size="lg">
              <a href={siteConfig.appointmentUrl} referrerPolicy="no-referrer">
                Abrir agenda y reservar<ArrowRight size={17} aria-hidden="true" />
              </a>
            </Button>
          </article>
          <article className={s.card}>
            <span className={s.icon}><MessageCircle size={28} strokeWidth={1.5} aria-hidden="true" /></span>
            <p className={s.badge}>Atención por chat</p>
            <h2>Reservar por WhatsApp</h2>
            <p>Escribinos directamente para coordinar tu cita. No hace falta completar un formulario antes.</p>
            <ul>
              <li><Check size={17} aria-hidden="true" />Consultá por el profesional que buscás</li>
              <li><Check size={17} aria-hidden="true" />Coordiná día y hora con recepción</li>
              <li><Check size={17} aria-hidden="true" />Pedí orientación si la necesitás</li>
            </ul>
            <p className={s.notice}>La cita queda reservada cuando la clínica te confirma el horario en el chat.</p>
            <Button asChild size="lg">
              <a href={buildWhatsAppUrl("Hola, Clínica Montalvo. Quisiera reservar una cita.")} target="_blank" rel="noopener noreferrer">
                Reservar por WhatsApp<ArrowRight size={17} aria-hidden="true" />
              </a>
            </Button>
          </article>
        </div>
        {canPrepare && (
          <div className={s.prepare}>
            <div>
              <h2>¿Preferís preparar la solicitud?</h2>
              <p>Elegí profesional y día antes de escribir. Es opcional; recepción confirmará el horario.</p>
            </div>
            <Button onClick={() => choose("whatsapp")}>Preparar mi solicitud<ArrowRight size={17} aria-hidden="true" /></Button>
          </div>
        )}
        {demoEnabled && (
          <details className={s.demo}>
            <summary>Vista previa de la futura reserva web</summary>
            <p>El diseño nuevo se conserva para mejorar la agenda más adelante. Esta demostración usa datos ficticios, no crea citas ni admite pagos.</p>
            <Button onClick={() => choose("web-demo")}>Probar reserva web<ArrowRight size={17} aria-hidden="true" /></Button>
          </details>
        )}
      </section>
      {agendaEnabled && channel === "agenda" && <div data-active="true" tabIndex={-1}><ConsultaAgenda volver={() => choose("choose")} /></div>}
      {/* Cada borrador permanece en memoria al cambiar de canal. Los datos
          ficticios nunca se copian al mensaje real de WhatsApp. */}
      {canPrepare && <div hidden={channel !== "whatsapp"} data-active={channel === "whatsapp"} tabIndex={-1} aria-label="Solicitud por WhatsApp">
        <BookingFlow catalogo={catalogo} inicial={preselection} onChangeChannel={() => choose("choose")} />
      </div>}
      {demoEnabled && demoVisited && (
        <div hidden={channel !== "web-demo"} data-active={channel === "web-demo"} tabIndex={-1} aria-label="Reserva web de demostración">
          <WebBookingDemo onChangeChannel={() => choose("choose")} />
        </div>
      )}
    </div>
  );
}
