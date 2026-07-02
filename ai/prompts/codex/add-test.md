# Codex: añadir test

Lee `AGENTS.md`, `ai/current-state.md`, `ai/goals/code-quality.md` y el código probado.

Añade cobertura para `[comportamiento/riesgo]` en `[ruta de test permitida]` sin cambiar producción salvo autorización explícita.

Antes de escribir, declara alcance, archivos permitidos, archivos prohibidos, validaciones y resultado esperado.

Reproduce primero el riesgo cuando sea posible. Prefiere aserciones de comportamiento a detalles de implementación y reutiliza el patrón de tests más cercano. Ejecuta el test dirigido y `npm run typecheck`; entrega resultado, límites de cobertura y cualquier fallo previo.
