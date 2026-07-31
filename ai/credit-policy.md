# Política de contexto, créditos y rutas

## Paquete mínimo

1. `AGENTS.md`
2. `ai/current-state.md`
3. Una fila de [`goals.md`](goals.md)
4. La petición y los archivos directamente afectados
5. Una skill solo si su descripción coincide

No adjuntar `docs/ai/` completo, todas las skills, árboles, logs ni informes previos salvo necesidad demostrada.

## Ruta por tipo de trabajo

| Trabajo | Goal | Skill / foco | Validación mínima |
|---|---|---|---|
| Refactor / bugfix | `code-quality` | code-graph si aplica; índices `project`/`component`/`debt` | `typecheck` → test dirigido → `depcruise` → `ai:review` |
| UI / tokens | `ui-product` | índices `design-token`/`component` | `typecheck` → lint → test dirigido → `ai:review` |
| Contenido MDX | `pedagogy` | `page-creator` (+ `diagrama` / `lean-formalizer` si toca) | refs → grafo → Lean si aplica |
| Revisión pedagógica | `pedagogy` | solo lectura; hallazgos con evidencia | sin escritura hasta alcance explícito |
| Grafo / navegación | `ui-product` o `code-quality` | índices `graph`/`content`; no editar JSON generado | validadores oficiales |
| Lean | `pedagogy` | `lean-formalizer`; sin Mathlib | compile → regenerate → validate-lean |
| Tooling | `automation` | scripts existentes; idempotente | caso ok + caso fallo; `ai:review` |
| Antes de commit | el del diff | — | `ai:review` → comandos que recomiende |

Declarar al empezar: objetivo, alcance, permitidos, prohibidos, validaciones, resultado esperado. Si cambia el alcance, parar y redeclarar.

## Escalado

- Una herramienta para lo rutinario.
- Revisión independiente solo ante alto riesgo, duda matemática, seguridad, migraciones o fallos repetidos.
- Segunda herramienta solo con hipótesis concreta.

## Relevo

Objetivo, decisiones, archivos, resultados, deuda, siguiente acción. Actualizar `current-state.md` si el estado cambió.
