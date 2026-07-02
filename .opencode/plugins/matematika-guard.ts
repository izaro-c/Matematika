/**
 * Matematika Guard Plugin
 *
 * Hooks para enforcement automático de convenciones del proyecto:
 * 1. Pre-write: verifica kebab-case IDs en MDX y paleta Arts & Crafts
 * 2. Compaction: inyecta contexto del proyecto para preservar convenciones
 */

import type { Plugin } from "@opencode-ai/plugin";

const VALID_CONTENT_TYPES = [
  "teorema", "lema", "corolario", "definicion", "axioma",
  "demostracion", "ejemplo", "ejercicio", "modelo",
  "sistema-axiomatico", "matematico", "leccion",
  "caso-de-uso", "plan-de-estudio",
];

const SNAKE_PATTERN = /_/;
const HEX_PATTERN = /#[0-9a-fA-F]{3,8}/g;

function validateMdx(filePath: string, content: string, log: (msg: string) => void) {
  const idMatch = content.match(/id:\s*["']([^"']+)["']/);
  if (idMatch) {
    if (SNAKE_PATTERN.test(idMatch[1])) {
      log(`Snake case en metadata.id: "${idMatch[1]}". Usa kebab-case.`);
    }
  }

  const typeMatch = content.match(/type:\s*["']([^"']+)["']/);
  if (typeMatch && !VALID_CONTENT_TYPES.includes(typeMatch[1])) {
    log(`Tipo de contenido desconocido: "${typeMatch[1]}"`);
  }
}

function validateTsx(filePath: string, content: string, log: (msg: string) => void) {
  if (filePath.includes("diagrams/")) {
    const hexMatches = content.match(HEX_PATTERN);
    if (hexMatches) {
      const nonTheme = hexMatches.filter((h: string) =>
        !h.toLowerCase().startsWith("#818cf") && !h.toLowerCase().startsWith("#333")
      );
      if (nonTheme.length > 0) {
        log(`Hex colors en ${filePath}: ${nonTheme.join(", ")}. Usa getCSSVar().`);
      }
    }
  }

  if (filePath.startsWith("src/shared/")) {
    const upperImports = content.match(/from\s+["']@\/(pages|widgets|features|app)\//g);
    if (upperImports) {
      log(`shared/ importa de capa superior: ${upperImports.join(", ")}.`);
    }
  }
}

export const MatematikaGuard: Plugin = async ({ client }) => {
  const logWarn = async (msg: string) => {
    await client.app.log({ body: { service: "matematika-guard", level: "warn", message: msg } });
  };

  return {
    "tool.execute.before": async (input, output) => {
      if (input.tool !== "write" && input.tool !== "edit") return;

      const filePath: string = output.args?.filePath || output.args?.path || "";
      const content: string = output.args?.content || output.args?.newString || "";

      if (filePath.endsWith(".mdx")) validateMdx(filePath, content, logWarn);
      if (filePath.endsWith(".tsx") || filePath.endsWith(".ts")) {
        validateTsx(filePath, content, logWarn);
      }
    },

    "experimental.session.compacting": async (_input, output) => {
      output.context.push(`## Matematika Project Context
Relee AGENTS.md y ai/current-state.md. Carga un único objetivo de ai/goals/ y las skills aplicables bajo demanda. .auxiliary/ nunca es fuente de verdad. Conserva alcance, decisiones, validaciones y deuda de esta sesión.`);
    },
  };
};
