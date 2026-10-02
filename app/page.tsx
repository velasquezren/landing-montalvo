import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Stethoscope, BedDouble, ClipboardList } from "lucide-react";
import EditorialPhoto from "@/components/sections/EditorialPhoto";
import PhotoSlideshow from "@/components/sections/PhotoSlideshow";
import CtaBand from "@/components/sections/CtaBand";
import { Button } from "@/components/ui/button";
import { editorialImages, homeSlides } from "@/content/images";
import { siteConfig } from "@/content/site";
import { getAppointmentLink } from "@/lib/links";

export const metadata: Metadata = pageMetadata({
  title: "Clínica Montalvo | Atención médica integral en Santa Cruz",
  description: siteConfig.description,
  path: "/",
  absoluteTitle: true,
});

const pathways = [
  { title: "Buscar una especialidad", body: "Conozca nuestras áreas de atención y consulte por el profesional que necesita.", href: "/especialidades", Icon: Stethoscope },
  { title: "Conocer las habitaciones", body: "Explore las suites, sus comodidades y las opciones para su estancia.", href: "/servicios#habitaciones", Icon: BedDouble },
  { title: "Preparar mi visita", body: "Encuentre información sobre citas, horarios, maternidad y seguros.", href: "/atencion-al-paciente", Icon: ClipboardList },
];

export default function HomePage() {
  const appointment = getAppointmentLink();
  return (
    <>
      <section aria-labelledby="inicio-heading" className="border-b border-border bg-wash">
        <div className="mx-auto grid max-w-7xl items-center gap-9 px-5 pt-10 pb-8 sm:gap-12 sm:px-8 sm:pt-14 lg:min-h-[38rem] lg:grid-cols-[0.85fr_1.15fr] lg:gap-12 lg:py-16">
          <div className="max-w-xl">
            <p className="label leading-relaxed text-primary">Clínica Montalvo · Santa Cruz de la Sierra</p>
            <h1 id="inicio-heading" className="display mt-6">Su salud, <span className="text-primary">con atención cercana.</span></h1>
            <p className="lead mt-6 max-w-lg">Especialidades médicas, maternidad e internación. Encuentre la atención que necesita y dé el siguiente paso con nosotros.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="primary" size="lg">
                <a href={appointment.href} target={appointment.external ? "_blank" : undefined} rel={appointment.external ? "noopener noreferrer" : undefined}>Reservar una cita <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></a>
              </Button>
              <Button asChild size="lg" className="bg-background"><Link href="/servicios">Explorar servicios</Link></Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">Pioneros en reproducción asistida en Bolivia.</p>
          </div>
          <PhotoSlideshow slides={homeSlides} label="Conozca nuestra clínica" priority className="rounded-xl bg-background p-3 shadow-sm sm:p-4" />
        </div>
        <div className="border-t border-border">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-2 px-5 py-4 text-xs sm:px-8 sm:text-sm">
            <span className="inline-flex items-center gap-2.5 font-semibold text-primary"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" />{siteConfig.emergencies}</span>
            <span className="text-muted-foreground">{siteConfig.schedule}</span>
            <a href={siteConfig.phoneTel} className="inline-flex min-h-11 items-center font-medium text-primary hover:underline sm:ml-auto">{siteConfig.phone} <ArrowUpRight aria-hidden="true" className="ml-2 h-3.5 w-3.5" /></a>
          </div>
        </div>
      </section>

      <section aria-labelledby="orientacion-heading" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="orientacion-heading" className="h2">¿Cómo podemos ayudarle?</h2>
          <p className="text-sm text-muted-foreground">Un buen lugar para empezar.</p>
        </div>
        <ul className="mt-8 grid border-l border-t border-border md:grid-cols-3">
          {pathways.map(({ title, body, href, Icon }) => (
            <li key={href} className="border-b border-r border-border">
              <Link href={href} className="group flex h-full flex-col p-6 transition-colors hover:bg-wash sm:p-8">
                <Icon aria-hidden="true" className="h-6 w-6 text-primary" strokeWidth={1.5} />
                <h3 className="h3 mt-6 flex items-start justify-between gap-4">{title}<ArrowUpRight aria-hidden="true" className="h-5 w-5 shrink-0 text-primary" /></h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="estancia-heading" className="bg-wash">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-20">
          <EditorialPhoto image={editorialImages.habitaciones} sizes="(min-width: 1280px) 576px, (min-width: 1024px) 50vw, 100vw" className="aspect-[4/3]" />
          <div>
            <p className="label text-primary">Internación y maternidad</p>
            <h2 id="estancia-heading" className="h2 mt-5 max-w-md">Un espacio para recuperarse. Y estar en familia.</h2>
            <p className="lead mt-5 max-w-lg">Conozca nuestras suites Gold, Silver y Bronce. Compare sus comodidades y encuentre la opción adecuada para su estancia.</p>
            <Link href="/servicios#habitaciones" className="mt-7 inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-primary hover:underline">Explorar las habitaciones <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>
      <CtaBand title="Le ayudamos a dar el siguiente paso" body="Consulte por una especialidad, una cita o su próxima estancia. Nuestro equipo le orientará." />
    </>
  );
}
