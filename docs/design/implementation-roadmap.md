# Roadmap de Implementación Visual y Layout

Este documento detalla las fases para aplicar el refinamiento de la dirección visual "Arts & Crafts Editorial" sin alterar el contenido ni la lógica.

## Fases Recomendadas de Implementación

### Fase N1: Documentación (Actual)
- **Archivos:** `docs/design/current-visual-style.md`, `docs/design/implementation-roadmap.md`.
- **Prohibido:** Modificar código fuente `src/`.
- **Objetivo:** Establecer las reglas.

### Fase N2: Refinamiento de Base y Layout Global
- **Archivos:** `src/app/index.css`, `src/shared/design/` (solo para añadir alias/helpers).
- **Prohibido:** `src/pages/`, `src/widgets/`, `src/features/`, `src/entities/`, MDX.
- **Objetivo:** Mejorar tokens semánticos, espaciados y consistencia de utilidades (ej. `.ac-pill`).

### Fase N3: Navegación y Omnibar
- **Archivos:** `src/widgets/navigation/SearchOmnibar.tsx`, `src/widgets/navigation/TopBar.tsx`, y tests/boundaries si hace falta.
- **Prohibido:** Lógica funcional, indexado de búsqueda, rutas.
- **Objetivo:** Alinear visualmente la barra superior y la búsqueda con el estilo definido (botones, bordes, estados de hover, escaneabilidad de resultados).

### Fase N4: Superficies Compartidas
- **Archivos:** `src/shared/ui/` (tarjetas, badges, botones).
- **Prohibido:** Componentes de dominio o páginas completas.
- **Objetivo:** Unificar la presentación de tarjetas `.elegant-panel` y píldoras `.ac-pill` en los componentes base.

### Fase N5: Refinamiento de Página Representativa (Opcional)
- **Archivos:** Una familia de `src/pages/` (ej. página de teorema o definición).
- **Prohibido:** Editar todas las páginas o rediseñar masivamente. MDX o Grafo.
- **Objetivo:** Refinar composición y legibilidad matemática usando la base mejorada.

---

## Revisiones y QA Visual

### Validaciones Obligatorias por Fase
1. `npm run typecheck`
2. `npm run test` (dirigido si es posible).
3. `npm run depcruise` (no superar baseline).
4. `npm run ai:review` y `git diff --check`.
5. Ejecutar script verificador de rutas prohibidas antes de commit.

### Riesgos y Cómo Mitigarlos
- **Riesgo:** Romper tests E2E o de componentes al cambiar selectores.
  - *Mitigación:* Mantener la semántica HTML (uso de `data-testid`, no cambiar etiquetas de inputs/botones clave).
- **Riesgo:** Cambiar lógica involuntariamente.
  - *Mitigación:* Tocar solo clases Tailwind (e.g. `className="..."`) o imports visuales.
- **Riesgo:** Regresión en responsive.
  - *Mitigación:* QA Visual con emulación móvil de Antigravity.

### Cuándo Refrescar Artefactos AI
No modificar la carpeta `ai/` durante estas misiones a menos que sea en un informe de reporte (`nightly-visual-refinement-report.md`). La reindexación de AI (`ai:index`) se hará en un ciclo operativo separado.

### Cómo Revisar Layout y Navegación
- **Layout:** El contenido no debe pegarse a los bordes. Debe haber padding. Los `aside` no deben aplastar al contenido en tablets.
- **Navegación:** Los estados de interactividad (`hover`, `focus`) deben ser visibles. Los breadcrumbs o topbar no deben distraer del `h1` de la página.
- **Legibilidad Matemática:** Las tablas, ecuaciones de bloque e inline `a` (enlaces) deben destacar del texto sin ser ruidosos. Usar espaciado entre justificaciones en demostraciones.
