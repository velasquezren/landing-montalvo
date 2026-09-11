import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import PagePlaceholder from "@/components/sections/PagePlaceholder";

export const metadata: Metadata = {
  title: "Blog",
  description: "Artículos de salud, recomendaciones médicas y noticias de Clínica Montalvo.",
};

export default function BlogPage() {
  return (
    <>
      <PageHero
        title="Blog"
        subtitle="Artículos de salud, recomendaciones y novedades de la clínica."
        breadcrumbCurrent="Blog"
      />
      <PagePlaceholder
        topic="los primeros artículos"
      />
    </>
  );
}
