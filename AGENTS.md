# Matematika — Agent Instructions

> **Matematika** es un Jardín Digital enciclopédico interactivo para explorar conocimiento matemático.
> Cada concepto es un nodo en una red semántica navegable. El diseño sirve a las matemáticas, no compite con ellas.

---

## Filosofía del Proyecto

Toda contribución debe respetar estos principios. Si hay duda, consulta la skill `project-philosophy`.

1. **Jardín Digital, no PDF interactivo.** Cada concepto es navegable. La lectura puede ser lineal o exploratoria.
2. **Universalidad absoluta.** El contenido matemático no tiene país, currículo ni sistema educativo. Es atemporal.
3. **Interactividad como norma.** Si un concepto puede visualizarse, se visualiza. Si un ejercicio puede ser interactivo, lo es.
4. **Elegante y limpio.** El diseño sirve a las matemáticas, no compite con ellas.
5. **Rigor sobre accesibilidad.** Todo enunciado está justificado. Toda definición es precisa. Toda demostración es completa y obedece estrictamente a la axiomática de Greenberg/Hilbert (Regla de las 6 Justificaciones Lógicas).
6. **Orden topológico.** El contenido se construye de abajo arriba, desde los axiomas. Un concepto no puede referenciar algo que depende lógicamente de él.
7. **Educativo, fácil de comprender, matemáticamente riguroso.** Claridad expositiva sin sacrificar precisión. Tercera persona impersonal. Nunca argumentos topológicos basados en apariencia visual.

---

## Arquitectura — Feature-Sliced Design (FSD)

```
src/
  app/          Entry point, providers, router
  pages/        Route-level pages (TheoremPage, DemoPage, etc.)
  widgets/      Composite blocks (TopBar, MarginaliaPanel, layouts...)
  features/     Feature modules with Zustand stores + UI
    graph/        GraphStore, GraphSandboxStore, worker, AxiomaticTree
    search/       NavigationStore
    glossary/     GlossaryStore, ConceptLink, RefLink, Concept, Term
    progress/     UserProgressStore, ReadingButton, StudyTask
    lessons/      LessonStore, HighlightLink
    exercises/    ExerciseContext, all exercise types
    toast/        ToastStore, ToastContainer
    editor/       EditorPage + components + hooks
    dynamic-vars/ DynamicVarStore
  entities/
    content/      Zod schemas, ContentStore, types, msc2020, loaders
    graph/        Grafo, Nodo, graphTypes, graph_structure.json
  shared/
    ui/           ContentCard, Logo, Badge, MDXBlocks, JXGBoard...
    lib/          logger, mdxParser, MathStore, constants, glossaryDictionary
    hooks/        useContent, useKeyboardShortcuts
    templates/    MDX templates
    diagrams/     All interactive diagrams (Axiomas, Definiciones, Teoremas, Demos, Models)
  database/
    content/      MDX content files (~130 concepts)
```

**Reglas de dependencia** (enforced by `depcruise`):
- `shared/` no importa de capas superiores (warn)
- `entities/` no importa de features/widgets/pages
- `features/` no importa de pages/app (warn)
- `widgets/` no importa de features (warn)

---

## Comandos Esenciales

```bash
npm run dev              # Genera índices + valida + inicia Vite
npm run build            # tsc + vite build + copia 404.html
npm run lint             # ESLint
npm run test             # Vitest (265 tests)
npm run test:coverage    # Vitest con coverage
npm run depcruise        # Verifica arquitectura FSD
npm run validate-graph   # Valida DAG lógico
npm run validate-references  # Valida referencias cruzadas
npm run generate-index   # Genera contentIndex.json
npm run validate-lean     # Compila Lean, regenera grafo Lean y valida diff Lean-MDX
npm run bridge:audit      # Verifica cobertura Lean y deuda explícita de declaraciones bridge
npm run bridge:closed     # Puerta final: falla mientras quede cualquier declaración bridge
```

**Orden de verificación al hacer cambios:**
1. `npm run lint` — estilo
2. `npx tsc -b` — tipos
3. `npm run test` — tests
4. `npm run depcruise` — arquitectura
5. `npm run validate-lean` — puente Lean-MDX
6. `npm run content:coverage && npm run bridge:audit` — cobertura y deuda bridge

---

## Convenciones Críticas

### IDs — kebab-case ESTRICTO

**NUNCA snake_case. NUNCA CamelCase. Solo kebab-case.**

```
✅ teorema-pitagoras, axioma-incidencia-1, demo-pons-asinorum
❌ teorema_pitagoras, teoremaPitagoras, Teorema-Pitagoras
```

Los IDs son invariantes: nunca se traducen, nunca se modifican. Aplica a:
- `metadata.id` en cada archivo MDX
- `targetId` en `<ConceptLink>` y `<RefLink>`
- `requires`, `demos`, `lemmas`, `corollaries`, `parentTheorem`, `authors`
- Nombres de archivo

### Metadatos — Zod Schemas

Fuente de verdad: `src/entities/content/schemas.ts`. Todo metadata DEBE validarse contra su schema correspondiente. Tipos de contenido: `teorema`, `lema`, `corolario`, `definicion`, `axioma`, `demostracion`, `ejemplo`, `ejercicio`, `modelo`, `sistema-axiomatico`, `matematico`, `leccion`, `caso-de-uso`, `plan-de-estudio`.

### Estructura MDX

Todo archivo MDX debe tener:
1. `<Capitular letra="X">` al inicio
2. `<Separador>` entre secciones
3. `<ConceptLink targetId="..." />` para navegación (nunca `<a href>`)
4. `<Formula>`, `<Definicion>`, `<Demostracion>`, `<Nota>`, `<Cita>`, `<Corolario>` para bloques semánticos

Las demostraciones SIEMPRE en página separada (tipo `demostracion`), nunca inline en el teorema.

### Paleta Arts & Crafts

Usar exclusivamente tokens Tailwind: `lienzo`, `carbon`, `salvia`, `terracota`, `pizarra`, `ocre`, `pavo`, `granada`, `musgo`.
**Cero hex arbitrarios.** En diagramas JSXGraph, usar `getCSSVar('--theme-*')`.

### Escritura Matemática

- Tercera persona impersonal
- Greenberg's Rule of 6 Logical Justifications
- Zero argumentos topológicos desde apariencia visual
- Definiciones precisas con casos límite explícitos
- Notación LaTeX con KaTeX (`$...$` para inline, `$$...$$` para display)

---

## Skills del Proyecto

Las skills son la fuente de verdad para la generación de contenido. Deben mantenerse actualizadas.
Viven en `.agents/skills/`, compatible con **OpenCode** y **Antigravity (Google)**.

| Skill | Ubicación | Propósito |
|---|---|---|
| `project-philosophy` | `.agents/skills/project-philosophy/SKILL.md` | Filosofía, principios, y reglas no negociables |
| `page-creator` | `.agents/skills/page-creator/SKILL.md` | Generación de páginas MDX con metadatos Zod |
| `diagrama` | `.agents/skills/diagrama/SKILL.md` | Generación de diagramas interactivos (JSXGraph, SVG) |

**Regla de actualización de skills:** Cuando la estructura del proyecto cambie (nuevos tipos de contenido, cambios en schemas, nuevas convenciones), el agente DEBE proponer actualizar la skill correspondiente. Si el usuario aprueba, se actualiza la skill y se verifica que el contenido existente siga cumpliéndola.

---

## Flujo de Trabajo con Agentes

1. **Crear contenido nuevo:** Usar `@content-writer`. Carga la skill `page-creator`, valida metadatos con Zod schemas, verifica IDs kebab-case, escribe MDX con estructura correcta.
2. **Crear diagrama nuevo:** Usar `@diagram-creator`. Carga la skill `diagrama`, selecciona tecnología (JSXGraph/SVG/Canvas), usa paleta Arts & Crafts, conecta con MathStore/LessonStore.
3. **Validar cambios:** Usar `/validate` o `@validator`. Ejecuta validate-graph + validate-references, corrige errores.
4. **Revisar código:** Usar `@reviewer`. Solo lectura. Verifica BCED/FSD, estilo matemático, integridad referencial.
5. **Check completo:** Usar `/full-check`. Ejecuta lint + test + depcruise + validate-graph + validate-references + validate-lean + content:coverage + bridge:audit.
