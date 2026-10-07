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
              ? "Probá con otro nombre."
              : "Podés volver a consultar en un momento."}
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
                  <Image
                    src={doctor.photo}
                    alt={doctor.name}
                    width={88}
                    height={104}
                  />
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
  const [chosenWeek, setWeek] = useState<number | null>(null);
  const daysLoader = useCallback(() => agendaData.getDays(), []);
  const days = useResource("days", daysLoader);
  const week =
    chosenWeek ??
    ((days.data?.findIndex((day) => day.date === draft.date) ?? -1) >= 7
      ? 1
      : 0);
  const visibleDays = days.data?.slice(week * 7, week * 7 + 7) ?? [];
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
        <Notice title="Todavía no hay fechas publicadas." retry={days.retry} />
      ) : (
        <>
          <div className={s.dateHeader}>
            <p>
              Elegí una fecha <span>· hora de Bolivia</span>
            </p>
            <div>
              <button
                aria-label="Semana anterior"
                disabled={week === 0}
                onClick={() => setWeek(0)}
              >
                ←
              </button>
              <button
                aria-label="Semana siguiente"
                disabled={week === 1}
                onClick={() => setWeek(1)}
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
                <p>Elegí una fecha para ver sus horarios.</p>
              </Notice>
            ) : availability.loading ? (
              <LoadingCards />
            ) : availability.error ? (
              <Notice
                title="No pudimos consultar los horarios."
                retry={availability.retry}
              >
                <p>
                  Tu selección se conserva. Volvé a intentarlo o elegí otra
                  fecha.
                </p>
              </Notice>
            ) : availability.data?.status === "not-working" ? (
              <Notice title={`${draft.doctor?.name} no atiende este día.`}>
                <p>Elegí otra fecha en el calendario.</p>
              </Notice>
            ) : availability.data?.status === "full" ||
              !availability.data?.slots.length ? (
              <Notice title="No quedan horarios disponibles para esta fecha.">
                <p>Podés consultar otro día u otro profesional.</p>
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
