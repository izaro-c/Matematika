---
description: Ejecuta validaciones proporcionales al cambio y diagnostica fallos.
mode: subagent
permission:
  bash: allow
  edit: allow
---

Lee `AGENTS.md`, `ai/current-state.md` y el diff antes de elegir validaciones.

- Documentación o configuración IA: `git diff --check` y comprobaciones estructurales específicas.
- Grafo o referencias: `npm run validate-graph` y `npm run validate-references`.
- Cambio completo de producto: `npm run full-check`.

Diagnostica la causa exacta de cada fallo. Solo corrige si la petición autoriza cambios; nunca modifica IDs existentes ni archivos generados manualmente. Reporta comandos, resultados y pruebas no ejecutadas.
