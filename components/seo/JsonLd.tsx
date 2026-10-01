/**
 * Datos estructurados (schema.org) para buscadores.
 *
 * El JSON va dentro de un `<script>`, así que un `<` en cualquier texto podría
 * cerrar la etiqueta antes de tiempo. Se escapa como `<`, que sigue
 * siendo el mismo carácter para quien lea el JSON. Es la forma que recomienda
 * la guía de JSON-LD de Next.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
