# Política de contexto y créditos

## Paquete mínimo

Toda sesión recibe:

1. `AGENTS.md`;
2. `ai/current-state.md`;
3. un objetivo de `ai/goals/`;
4. la petición y los archivos directamente afectados;
5. una skill solo cuando su descripción coincide.

No se adjuntan `docs/ai/`, todas las skills, árboles completos, logs largos ni informes previos salvo necesidad demostrada.

## Escalado

- Usar una sola herramienta para trabajo rutinario y verificable.
- Añadir una revisión independiente solo ante alto riesgo, incertidumbre matemática, seguridad, migraciones o fallos repetidos.
- Reservar modelos de mayor razonamiento para decisiones irreversibles o ambiguas; usar herramientas ligeras para inventarios, formato y comprobaciones mecánicas.
- Reutilizar rutas, comandos y resultados; no volver a narrar el repositorio.

## Prompts y relevos

Un prompt operativo contiene objetivo, alcance permitido/prohibido, criterios de éxito y validación. El relevo contiene decisiones, diff, resultados, deuda y siguiente acción.

Se recortan salidas de herramientas, se citan líneas o archivos y se resume lo ya comprobado. Si el estado cambia, se actualiza `current-state.md` en lugar de añadir contexto acumulativo a cada prompt.
