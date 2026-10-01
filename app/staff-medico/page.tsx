import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import PageHero from "@/components/sections/PageHero";
import PagePlaceholder from "@/components/sections/PagePlaceholder";

// En preparación: fuera del índice hasta que haya fichas (ver app/sitemap.ts).
export const metadata: Metadata = pageMetadata({
  title: "Staff médico",
  description: "Equipo de médicos especialistas y profesionales de Clínica Montalvo.",
  path: "/staff-medico",
  index: false,
});

export default function StaffMedicoPage() {
  return (
    <>
      <PageHero
        title="Staff médico"
        subtitle="El equipo de especialistas y profesionales que atiende en la clínica."
        breadcrumbCurrent="Staff médico"
      />
      <PagePlaceholder
        topic="las fichas del equipo médico"
      />
    </>
  );
}
