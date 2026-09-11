import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import PagePlaceholder from "@/components/sections/PagePlaceholder";

export const metadata: Metadata = {
  title: "Staff Médico",
  description: "Equipo de médicos especialistas y profesionales de Clínica Montalvo.",
};

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
