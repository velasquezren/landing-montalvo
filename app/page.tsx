import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Stethoscope, BedDouble, ClipboardList } from "lucide-react";
import EditorialPhoto from "@/components/sections/EditorialPhoto";
import HeroMedia from "@/components/sections/HeroMedia";
import CtaBand from "@/components/sections/CtaBand";
import { Button } from "@/components/ui/button";
import { editorialImages, homeSlides } from "@/content/images";
import { siteConfig } from "@/content/site";
import { getAppointmentLink } from "@/lib/links";
import PromocionCard from "@/components/crm/PromocionCard";
import { obtenerPromociones } from "@/lib/crm/api";
import { hoyEnBolivia } from "@/lib/formato";

/** Las promociones del CRM: `REVALIDAR_SEGUNDOS` de lib/crm/api.ts (Next exige un literal). */
export const revalidate = 300;

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

export default async function HomePage() {
  const appointment = getAppointmentLink();
  // Las destacadas llegan primero (orden del CRM): la portada muestra tres.
  const promociones = (await obtenerPromociones()).slice(0, 3);
  const hoy = hoyEnBolivia();
  return (
    <>
      <section aria-labelledby="inicio-heading" className="relative overflow-hidden border-b border-border bg-wash lg:flex lg:min-h-[clamp(34rem,calc(100svh_-_var(--header-h)),46rem)] lg:items-center">
        <HeroMedia slides={homeSlides} image={editorialImages.inicio} lcp sizes="100vw" className="h-[clamp(17rem,78vw,28rem)]" />

        {/* En móvil el texto sube sobre la parte de la foto que ya se ha fundido
            con el fondo; en escritorio la foto es el fondo entero. */}
        <div className="relative mx-auto -mt-16 w-full max-w-7xl px-5 pb-12 sm:-mt-24 sm:px-8 sm:pb-14 lg:mt-0 lg:py-20">
          <div className="max-w-2xl">
            <p className="label leading-relaxed text-primary">Clínica Montalvo · Santa Cruz de la Sierra</p>
            <h1 id="inicio-heading" className="display mt-6">Su salud, <span className="text-primary">con atención cercana.</span></h1>
            <p className="lead mt-6 max-w-lg">Especialidades médicas, maternidad e internación. Encuentre la atención que necesita y dé el siguiente paso con nosotros.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="primary" size="lg">
                <Link href={appointment.href} target={appointment.external ? "_blank" : undefined} rel={appointment.external ? "noopener noreferrer" : undefined}>Pedir una cita <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" className="bg-background"><Link href="/servicios">Explorar servicios</Link></Button>
            </div>
            {/* En escritorio este dato va en la tarjeta de la foto. */}
            <p className="mt-6 text-sm text-muted-foreground lg:hidden">Pioneros en reproducción asistida en Bolivia.</p>
          </div>
        </div>

        {/* Dato práctico sobre la foto, como hacen las cabeceras de los
            hospitales de referencia: lo primero que busca quien llega con prisa.
            Solo datos de siteConfig; no se atribuye ningún teléfono a
            emergencias porque la clínica no lo ha confirmado. */}
        <div className="absolute inset-x-0 bottom-0 hidden lg:block">
          <div className="mx-auto flex max-w-7xl justify-end px-8 pb-8">
            <div className="inline-flex items-center gap-4 bg-background px-5 py-4 shadow-lg">
              <span aria-hidden="true" className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="pulse-ring absolute inset-0 rounded-full bg-accent" />
                <span className="relative h-2.5 w-2.5 rounded-full bg-primary" />
              </span>
              <span>
                <span className="block text-sm font-semibold">{siteConfig.emergencies}</span>
                <span className="mt-0.5 block text-sm text-muted-foreground">{siteConfig.schedule}</span>
              </span>
              <span aria-hidden="true" className="mx-1 h-8 w-px bg-border" />
              <span className="max-w-[13rem] text-sm leading-snug text-muted-foreground">Pioneros en reproducción asistida en Bolivia.</span>
            </div>
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

      {promociones.length > 0 && (
        <section aria-labelledby="promociones-heading" className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:pb-20">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2 id="promociones-heading" className="h2">Promociones vigentes</h2>
            <Link href="/promociones" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary hover:underline">Ver todas las promociones <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
          </div>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {promociones.map((promocion) => (
              <li key={promocion.slug}>
                <PromocionCard promocion={promocion} hoy={hoy} sizes="(min-width: 1280px) 400px, (min-width: 1024px) 31vw, (min-width: 640px) 46vw, 100vw" />
              </li>
            ))}
          </ul>
        </section>
      )}

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
