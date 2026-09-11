import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://clinicamontalvo.net";
  const routes = [
    "/",
    "/servicios",
    "/especialidades",
    "/dr-montalvo",
    "/staff-medico",
    "/blog",
    "/sobre-nosotros",
    "/atencion-al-paciente",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/servicios" ? "weekly" : "monthly",
    priority: route === "/" ? 1.0 : 0.8,
  }));
}
