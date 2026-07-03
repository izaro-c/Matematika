# Roadmap de Implementación Visual y Layout (Fases 16 a 28)

Este documento detalla las fases para aplicar la Épica de Refinamiento Visual y de Layout de Matematika.

## Plan por Fases Operativas

### Fase 16 — Current visual style lock
- **Objetivo**: Documentar y fijar la dirección actual de forma estructurada. *(Completado con la generación de este plan)*.
- **Herramienta**: LLMs solo en modo documentación (`docs/design/`).

### Fase 17 — Global visual/layout foundation
- **Objetivo**: Refinar y pulir base global, configuración de superficies principales, espaciado y tokens semánticos (Arts & Crafts).
- **Herramienta Recomendada**: Codex (tareas deterministas TS/CSS).
- **Archivos Permitidos**: `src/app/index.css`, `src/shared/design/`.
- **Riesgos**: Posible regresión generalizada de UI. Debe aislarse cuidadosamente.
- **Validación**: Build en cero fallos, `npm run depcruise`.

### Fase 18 — Navigation + Omnibar product audit
- **Objetivo**: Auditar a fondo funcionalidad, enrutación, comportamientos vacíos y de fallback de la Omnibar antes de rediseñar layouts.
- **Herramienta Recomendada**: Codex/Antigravity.
- **Archivos**: Principalmente tests bajo `tests/features/search` y `tests/boundary`.
- **Validación**: Comprobación estricta de tests en verde.

### Fase 19 — Navigation + Omnibar product refinement
- **Objetivo**: Refinar e implementar las mejoras funcionales, navegación (teclado), responsive, textos largos y UI visual de la barra superior y Omnibar.
- **Herramienta Recomendada**: Codex.
- **Output esperado**: Una Omnibar de calidad de producto fina. Screenshots.

### Fase 20 — Shared content surfaces
- **Objetivo**: Consolidar y refinar las tarjetas, paneles decorativos, `.elegant-panel`, `.ac-pill` de toda la aplicación.
- **Herramienta Recomendada**: Codex.
- **Archivos Permitidos**: `src/shared/ui/`.

### Fase 21 — Representative content page layout
- **Objetivo**: Escoger una "familia representativa" de MDX (Teorema o Definición) y refinar exhaustivamente su layout (paddings, márgenes, grilla de metadatos, área de texto matemático).
- **Herramienta Recomendada**: Antigravity/Codex.
- **Decisión del usuario antes de proceder**: Approval visual de este componente base.

### Fase 22 — Content page system rollout
- **Objetivo**: Masificar y aplicar el patrón exacto aprobado en Fase 21 al resto de wrappers/páginas de contenido.
- **Herramienta Recomendada**: Codex (alta repetición mecánica estructurada).

### Fase 23 — Graph visual alignment
- **Objetivo**: Alinear visualmente la herramienta del grafo (filtros, barra lateral, canvas).
- **Criterio Estricto**: *Sin cambiar lógicas de Worker o recálculo asíncrono.*
- **Herramienta Recomendada**: Codex.

### Fase 24 — Editor visual alignment
- **Objetivo**: Refinar layout, padding superficial del editor sin entrar en profundidad de lógica de contratos ni generación (solo visual skin).
- **Herramienta Recomendada**: Codex.

### Fase 25 — Diagram visual alignment
- **Objetivo**: Alinear unificadamente contenedores y estilización interna básica de diagramas generados.
- **Herramienta Recomendada**: Antigravity (para verificación de Canvas real).

### Fase 26 — Hardcoded colors cleanup
- **Objetivo**: Migrar y erradicar, en lotes pequeños, los colores hardcodeados a los nuevos tokens probados.
- **Herramienta Recomendada**: Codex.

### Fase 27 — Visual QA and responsive pass
- **Objetivo**: Barrido final de regresión de QA visual en desktop/laptop/tablet (según Decision Gate).
- **Herramienta Recomendada**: Antigravity o manual del usuario.

### Fase 28 — Refresh AI artifacts
- **Objetivo**: Reflejar en la base de datos de los agentes el nuevo estado.
- **Comandos**: `npm run ai:index`, `npm run ai:debt`.

---

## Estrategia de Commits
Se requiere granularidad. La regla de oro es: **no mezclar funcionalidad base/lógica (Omnibar) con estilo si se puede separar, y jamás mezclar auditoría y código activo.**
Ejemplos sugeridos:
- `docs: plan current visual epic` *(Fase 16)*
- `docs: audit omnibar product experience` *(Fase 16/18)*
- `refactor: refine global visual layout primitives` *(Fase 17)*
- `test: verify omnibar keyboard navigation constraints` *(Fase 18)*
- `refactor: refine omnibar result layout and truncated texts` *(Fase 19)*
- `refactor: align shared content surfaces` *(Fase 20)*
- `refactor: refine theorem page baseline layout` *(Fase 21)*
- `chore: refresh ai artifacts after visual epic` *(Fase 28)*

## Estrategia de Validación y Comandos
- **Docs-only (Fase 16)**: `git diff --check`, `npm run ai:review`.
- **UI / Design Tokens / CSS (Fase 17, 20, 26)**: `npm run typecheck`, `npm run test`, `npm run depcruise`, linting en TS/TSX.
- **Navegación / Omnibar (Fase 18, 19)**: `npm run typecheck`, `npm run test -- tests/features/search`, `npm run test -- tests/boundary/routes.test.tsx`, `depcruise`.
- **Grafo / Editor (Fase 23, 24)**: `npm run test -- tests/features/graph` y `tests/features/editor`, más strict `typecheck`.
- **Cierre (Fase 28)**: `npm run ai:index`, `npm run ai:debt`.

## QA Visual

**Pantallas mínimas obligatorias a auditar (Visual check):**
1. Shell global y TopBar.
2. Omnibar abierta con estado vacío, inválido, filtros aplicados, e items de títulos extremos.
3. Página representativa (Teorema, Definición, Modelo).
4. Herramientas laterales (Glosario, Grafo, Editor básico).

**Viewports Mínimos:**
- Desktop Extendido (paddings excesivos).
- Laptop (flujo estándar).
- Tablet (colapso estructural).
- *Mobile (sólo si es autorizado en Decision Gates)*.

**Criterios de Rollback/Aprobación:**
Si los cambios empeoran la velocidad de lectura, saturan visualmente, o rompen las dependencias de TS o warnings FSD en `.dependency-cruiser.js`, la fase no se acepta.
