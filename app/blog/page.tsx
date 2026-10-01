import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import PageHero from "@/components/sections/PageHero";
import PagePlaceholder from "@/components/sections/PagePlaceholder";

// En preparación: fuera del índice hasta que haya artículos (ver app/sitemap.ts).
export const metadata: Metadata = pageMetadata({
  title: "Blog",
  description: "Artículos de salud, recomendaciones médicas y noticias de Clínica Montalvo.",
  path: "/blog",
  index: false,
});

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
