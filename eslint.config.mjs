import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Material fotográfico en bruto entregado por el cliente: fotos y páginas
    // guardadas con su JavaScript. No es código del proyecto y llenaba el
    // informe de avisos sobre archivos minificados de terceros.
    "FOTOS*/**",
  ]),
]);

export default eslintConfig;
