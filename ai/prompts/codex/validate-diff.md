# Codex: validar diff

Lee `AGENTS.md`, `ai/current-state.md`, el objetivo relacionado y [`validation-review`](../../context-packs/validation-review.md).

Revisa el diff actual en solo lectura.

Antes de ejecutar, declara alcance, archivos permitidos, prohibición de escritura, validaciones y resultado esperado.

Ejecuta `npm run ai:review`, `git diff --check` y las validaciones proporcionales recomendadas. Prioriza defectos funcionales, matemáticos, de integridad, arquitectura y accesibilidad. Entrega hallazgos con severidad, archivo/línea, evidencia e impacto; indica comandos no ejecutados y riesgos residuales.
