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

// La reserva web solo se descarga al elegirla.
const WebBooking = dynamic(() => import("../web/components/BookingFlow"), {
  loading: () => <p className={s.loading} role="status">Abriendo la agenda de la clínica…</p>,
});

export default function BookingChannels({
  catalogo,
  initial = "choose",
  preselection,
  profesional,
}: {
  catalogo: CatalogoReserva;
  initial?: BookingChannel;
  preselection?: { draft: SolicitudDraft; paso: number };
  /** Número de agenda de un médico: la reserva en línea abre con él elegido. */
  profesional?: string | null;
}) {
  const canPrepare = catalogo.especialidades.length > 0;
  const [requestedChannel, setChannel] = useState<BookingChannel>(initial);
  const channel = requestedChannel === "whatsapp" && !canPrepare ? "choose" : requestedChannel;
  // Una vez abierta, la reserva web queda montada: volver al selector no pierde lo elegido.
  const [webVisited, setWebVisited] = useState(initial === "web");
  const root = useRef<HTMLDivElement>(null);

  function choose(next: BookingChannel) {
    if (next === "web") setWebVisited(true);
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
        <p className={s.lead}>Reserva en línea con los horarios reales de la agenda o coordina tu cita por WhatsApp. Tú eliges.</p>
        <div className={s.cards}>
          <article className={s.card}>
            <span className={s.icon}><CalendarDays size={28} strokeWidth={1.5} aria-hidden="true" /></span>
            <p className={s.badge}>Agenda de la clínica</p>
            <h2>Reservar en la web</h2>
            <p>Elige la especialidad, el profesional y una hora libre de la agenda. Confirmas y la cita queda registrada.</p>
            <ul>
              <li><Check size={17} aria-hidden="true" />Horarios reales, al momento</li>
              <li><Check size={17} aria-hidden="true" />Pago por QR y comprobante en línea</li>
              <li><Check size={17} aria-hidden="true" />Sin necesidad de pasar por WhatsApp</li>
            </ul>
            <p className={s.notice}>Caja verifica el pago y la clínica te confirma por WhatsApp.</p>
            <Button onClick={() => choose("web")} variant="primary" size="lg">
              Reservar en línea<ArrowRight size={17} aria-hidden="true" />
            </Button>
            <a className={s.secondaryLink} href={siteConfig.appointmentUrl} referrerPolicy="no-referrer">
              o usar la agenda anterior
            </a>
          </article>
          <article className={s.card}>
            <span className={s.icon}><MessageCircle size={28} strokeWidth={1.5} aria-hidden="true" /></span>
            <p className={s.badge}>Atención por chat</p>
            <h2>Reservar por WhatsApp</h2>
            <p>Escríbenos directamente para coordinar tu cita. No hace falta completar un formulario antes.</p>
            <ul>
              <li><Check size={17} aria-hidden="true" />Consultá por el profesional que buscás</li>
              <li><Check size={17} aria-hidden="true" />Coordiná día y hora con recepción</li>
              <li><Check size={17} aria-hidden="true" />Pide orientación si la necesitas</li>
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
              <p>Elige profesional y día antes de escribir. Es opcional; recepción confirmará el horario.</p>
            </div>
            <Button onClick={() => choose("whatsapp")}>Preparar mi solicitud<ArrowRight size={17} aria-hidden="true" /></Button>
          </div>
        )}
      </section>
      {/* Cada borrador permanece en memoria al cambiar de canal. Los datos
          de un recorrido nunca se copian al otro. */}
      {canPrepare && <div hidden={channel !== "whatsapp"} data-active={channel === "whatsapp"} tabIndex={-1} aria-label="Solicitud por WhatsApp">
        <BookingFlow catalogo={catalogo} inicial={preselection} onChangeChannel={() => choose("choose")} />
      </div>}
      {webVisited && (
        <div hidden={channel !== "web"} data-active={channel === "web"} tabIndex={-1} aria-label="Reserva en línea">
          <WebBooking onChangeChannel={() => choose("choose")} profesional={profesional} />
        </div>
      )}
    </div>
  );
}
