"use client";
import { useCallback, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Baby,
  CalendarDays,
  Check,
  Clock3,
  HeartPulse,
  Search,
  Stethoscope,
  UserRound,
  Waves,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { agendaData } from "../agenda-data";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { dateLabel, money } from "../state";
import { useResource } from "../use-resource";
import type { BookingAction } from "../state";
import type { BookingDraft, Doctor, Specialty } from "../types";
import s from "../booking.module.css";

export function LoadingCards() {
  return (
    <div role="status" aria-label="Cargando opciones" className={s.skeletons}>
      {[0, 1, 2].map((n) => (
        <div key={n} className={s.skeleton} />
      ))}
      <span className="sr-only">Cargando opciones…</span>
    </div>
  );
}
export function Notice({
  title,
  children,
  retry,
}: {
  title: string;
  children?: React.ReactNode;
  retry?: () => void;
}) {
  return (
    <div className={s.notice} role={retry ? "alert" : "status"}>
      <CalendarDays aria-hidden="true" size={26} />
      <p className={s.noticeTitle}>{title}</p>
      {children}
      {retry && <Button onClick={retry}>Reintentar</Button>}
    </div>
  );
}
const icons: Record<string, typeof Stethoscope> = {
  ginecologia: Stethoscope,
  cardiologia: HeartPulse,
  pediatria: Baby,
  ecografia: Waves,
};
const searchText = (value: string) =>
  value
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
export function SpecialtyStep({
  selected,
  onSelect,
}: {
  selected: Specialty | null;
  onSelect: (item: Specialty) => void;
}) {
  const [query, setQuery] = useState("");
  const load = useCallback(() => agendaData.getSpecialties(), []);
  const resource = useResource("specialties", load);
  const filtered =
    resource.data?.filter((item) =>
      searchText(item.name).includes(searchText(query)),
    ) ?? [];
  return (
    <>
      <label className={s.search}>
        <Search aria-hidden="true" size={20} />
        <span className="sr-only">Buscar especialidad</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar especialidad"
          type="search"
        />
      </label>
      {resource.loading ? (
        <LoadingCards />
      ) : resource.error ? (
        <Notice
          title="No pudimos consultar las especialidades."
          retry={resource.retry}
        />
      ) : !filtered.length ? (
        <Notice
          title={
            query
              ? "No encontramos esa especialidad."
              : "No hay especialidades disponibles por ahora."
          }
        >
          <p>
            {query
              ? "Prueba con otro nombre."
              : "Puedes volver a consultar en un momento."}
          </p>
          <Button
            onClick={() => {
              setQuery("");
              resource.retry();
            }}
          >
            Ver especialidades
          </Button>
        </Notice>
      ) : (
        <div className={s.specialties} aria-label="Especialidades">
          {filtered.map((item) => {
            const Icon = icons[item.id] ?? Stethoscope;
            return (
              <button
                key={item.id}
                type="button"
                className={s.specialty}
                aria-pressed={selected?.id === item.id}
                onClick={() => onSelect(item)}
              >
                <span className={s.iconTile}>
                  <Icon aria-hidden="true" size={25} strokeWidth={1.5} />
                </span>
                <strong>{item.name}</strong>
                <span>{item.description}</span>
                <span className={s.choose}>
                  Elegir especialidad{" "}
                  <ArrowRight size={17} aria-hidden="true" />
                </span>
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}
export function DoctorStep({
  specialty,
  selected,
  onSelect,
}: {
  specialty: Specialty;
  selected: Doctor | null;
  onSelect: (item: Doctor) => void;
}) {
  const load = useCallback(() => agendaData.getDoctors(specialty.id), [specialty.id]);
  const resource = useResource(`doctors-${specialty.id}`, load);
  return (
    <>
      {resource.loading ? (
        <LoadingCards />
      ) : resource.error ? (
        <Notice
          title="No pudimos consultar los profesionales."
          retry={resource.retry}
        />
      ) : !resource.data?.length ? (
        <Notice
          title="No hay profesionales para reservar online en esta especialidad."
          retry={resource.retry}
        />
      ) : (
        <div className={s.doctors}>
          {resource.data.map((doctor) => (
            <article
              key={doctor.id}
              className={s.doctor}
              data-selected={selected?.id === doctor.id}
            >
              <div className={s.avatar}>
                {doctor.photo ? (
                  // El nombre ya está al lado: la foto no lo repite al lector de pantalla.
                  <Image src={doctor.photo} alt="" width={88} height={104} sizes="88px" />
                ) : (
                  <UserRound size={38} strokeWidth={1} aria-hidden="true" />
                )}
              </div>
              <div className={s.doctorInfo}>
                <h3>{doctor.name}</h3>
                <p className={s.specialtyName}>{specialty.name}</p>
                {doctor.weeklySchedule && (
                  <p className={s.schedule}>
                    <Clock3 size={15} aria-hidden="true" />
                    {doctor.weeklySchedule}
                  </p>
                )}
                <p className={s.price}>
                  {doctor.price !== null ? (
                    <>
                      {money(doctor.price)} <span>· consulta</span>
                    </>
                  ) : (
                    <span>Precio de la consulta a confirmar</span>
                  )}
                </p>
              </div>
              <div className={s.doctorAction}>
                {doctor.availability === "online" ? (
                  <Button
                    aria-pressed={selected?.id === doctor.id}
                    onClick={() => onSelect(doctor)}
                  >
                    {selected?.id === doctor.id ? (
                      <Check size={16} aria-hidden="true" />
                    ) : null}
                    Elegir profesional
                    <ArrowRight size={16} aria-hidden="true" />
                  </Button>
                ) : (
                  <>
                    <span className={s.requestBadge}>
                      Disponibilidad a solicitud
                    </span>
                    <Button asChild>
                      <a
                        href={buildWhatsAppUrl(`Hola, quisiera consultar disponibilidad con ${doctor.name}.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Consultar disponibilidad
                      </a>
                    </Button>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
export function DateTimeStep({
  draft,
  dispatch,
  onNext,
}: {
  draft: BookingDraft;
  dispatch: (action: BookingAction) => void;
  onNext: () => void;
}) {
  const [chosenPage, setPage] = useState<number | null>(null);
  const doctorId = draft.doctor?.id ?? "";
  // Solo los días con horas libres: un día sin cupo no se ofrece.
  const daysLoader = useCallback(() => agendaData.getDays(doctorId), [doctorId]);
  const days = useResource(`days-${doctorId}`, daysLoader);
  const PAGE = 7;
  const pages = Math.max(1, Math.ceil((days.data?.length ?? 0) / PAGE));
  const page =
    chosenPage ??
    Math.max(0, Math.floor((days.data?.findIndex((day) => day.date === draft.date) ?? 0) / PAGE));
  const visibleDays = days.data?.slice(page * PAGE, page * PAGE + PAGE) ?? [];
  const calendarLabel = visibleDays.length
    ? new Intl.DateTimeFormat("es-BO", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      }).formatRange(
        new Date(`${visibleDays[0].date}T12:00:00Z`),
        new Date(`${visibleDays.at(-1)!.date}T12:00:00Z`),
      )
    : "";
  const availabilityLoader = useCallback(
    () =>
      draft.date && draft.doctor
        ? agendaData.getAvailability(draft.doctor.id, draft.date)
        : Promise.resolve(null),
    [draft.date, draft.doctor],
  );
  const availability = useResource(
    `${draft.doctor?.id}-${draft.date}`,
    availabilityLoader,
  );
  const selectedValid =
    availability.data?.status === "available" &&
    availability.data.slots.some((slot) => slot.id === draft.slot?.id);
  return (
    <>
      <p className={s.contextLine}>
        <UserRound size={17} aria-hidden="true" />
        {draft.doctor?.name}
        <span>{draft.doctor?.price != null ? money(draft.doctor.price) : "Precio a confirmar"}</span>
      </p>
      {days.loading ? (
        <LoadingCards />
      ) : days.error ? (
        <Notice title="No pudimos mostrar las fechas." retry={days.retry} />
      ) : !days.data?.length ? (
        <Notice title={`${draft.doctor?.name ?? "Este profesional"} no tiene horas libres en los próximos 30 días.`}>
          <p>Puedes elegir otro profesional o coordinar por WhatsApp.</p>
          <Button asChild>
            <a
              href={buildWhatsAppUrl(`Hola, quisiera una cita con ${draft.doctor?.name ?? "un profesional"}. En la web no encontré horarios libres.`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Consultar por WhatsApp
            </a>
          </Button>
        </Notice>
      ) : (
        <>
          <div className={s.dateHeader}>
            <p>
              Elige una fecha <span>· hora de Bolivia</span>
            </p>
            <div>
              <button
                type="button"
                aria-label="Fechas anteriores"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Fechas siguientes"
                disabled={page >= pages - 1}
                onClick={() => setPage(page + 1)}
              >
                →
              </button>
            </div>
          </div>
          <p className={s.dateRange} aria-live="polite">
            {calendarLabel}
          </p>
          <div className={s.days} aria-label="Fechas disponibles">
            {visibleDays.map((day) => (
              <button
                type="button"
                key={day.date}
                data-date={day.date}
                aria-label={dateLabel(day.date)}
                aria-pressed={draft.date === day.date}
                onClick={() => dispatch({ type: "date", value: day.date })}
              >
                <span>{day.label}</span>
                <strong>{day.day}</strong>
              </button>
            ))}
          </div>
          <div
            className={s.hours}
            aria-live="polite"
            aria-busy={Boolean(draft.date && availability.loading)}
          >
            {!draft.date ? (
              <Notice title="¿Qué día te viene bien?">
                <p>Elige una fecha para ver sus horarios.</p>
              </Notice>
            ) : availability.loading ? (
              <LoadingCards />
            ) : availability.error ? (
              <Notice
                title="No pudimos consultar los horarios."
                retry={availability.retry}
              >
                <p>
                  Tu selección se conserva. Vuelve a intentarlo o elige otra
                  fecha.
                </p>
              </Notice>
            ) : availability.data?.status === "not-working" ? (
              <Notice title={`${draft.doctor?.name} no atiende este día.`}>
                <p>Elige otra fecha en el calendario.</p>
              </Notice>
            ) : availability.data?.status === "full" ||
              !availability.data?.slots.length ? (
              <Notice title="No quedan horarios disponibles para esta fecha.">
                <p>Puedes consultar otro día u otro profesional.</p>
              </Notice>
            ) : (
              <>
                <p className={s.dateCaption}>{dateLabel(draft.date)}</p>
                <div className={s.slots} aria-label="Horas disponibles">
                  {availability.data.slots.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      aria-pressed={draft.slot?.id === slot.id}
                      onClick={() => dispatch({ type: "slot", value: slot })}
                    >
                      {slot.time}
                      {draft.slot?.id === slot.id && (
                        <Check size={15} aria-hidden="true" />
                      )}
                    </button>
                  ))}
                </div>
                <p className={s.hint}>
                  Seleccioná la hora que prefieras. No se elige ninguna
                  automáticamente.
                </p>
              </>
            )}
          </div>
        </>
      )}
      <div className={s.nextRow}>
        <Button
          variant="primary"
          size="lg"
          disabled={!selectedValid}
          onClick={onNext}
        >
          Continuar
          <ArrowRight size={17} aria-hidden="true" />
        </Button>
      </div>
    </>
  );
}
