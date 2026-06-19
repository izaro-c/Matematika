# Plan de Acción — Euclides Digital

> **Leyenda:** [ ] pendiente · [x] completado

---

## FASE 0 — CIMIENTOS (Fundación estructural)

*Antes de añadir nada nuevo, hay que asegurar que la base es sólida, consistente y está documentada. Todo lo demás depende de esto.*

### 0.1 Skills de IA para generación asistida
*Documentar las reglas del proyecto en skills para que la IA genere código consistente desde el primer momento.*

**antigravity** — Generación de contenido matemático (MDX, metadatos, grafos):
- [x] Crear `.opencode/skills/antigravity/SKILL.md` (407 líneas, 14 secciones) con:
  - [x] Filosofía, ID Invariante, esquemas Zod, estructura MDX
  - [x] Regla de `links` solo para conexiones formales explícitas
  - [x] Demostraciones siempre en páginas separadas (nunca inline)
  - [x] Enlazado semántico, paleta Arts & Crafts, naming, universalidad
  - [x] Guía de traducción matemática (LAL→SAS, etc.)
  - [x] Integridad de referencias y checklist de calidad
- [x] Registrar skill en `opencode.json` (`skills.paths`)
- [x] Probar generando `teorema_coseno.mdx` + `demo_coseno_euclides.mdx` (build OK)

**diagrama** — Generación de diagramas interactivos (JSXGraph, SVG, Canvas):
- [x] Crear `.opencode/skills/diagrama/SKILL.md` (387 líneas, 12 secciones) con:
  - [x] Guía de selección de tecnología (JSXGraph vs SVG vs Canvas vs HTML)
  - [x] Patrón bidireccional MathStore/InteractiveElement y LessonStore/VisualBind
  - [x] Paleta de colores con equivalencias JSXGraph/SVG
  - [x] Convención de naming de elementos para matching texto↔diagrama
  - [x] Mejores prácticas por tecnología (board config, cleanup, responsive, touch)
  - [x] Conexión a MDX (import/export Simulation, hasSimulation)
  - [x] Diagramas multi-paso para demostraciones (DemonstrationSection + MedievalStep)
  - [x] Quality checklist con 12 puntos

### 0.2 Estandarización de páginas MDX y page components
*Eliminar todo el código duplicado y hardcodeado antes de traducir o escalar. Si no, cada idioma multiplicará la deuda técnica.*
- [x] **Breadcrumbs**: extraer a `src/components/ui/Breadcrumbs.tsx` — se repite 7+ veces (TheoremPage, DefinitionPage, ExercisePage, UseCasePage, DemoPage, AxiomPage, BranchPage)
- [x] **ContentHeader**: crear componente único para la cabecera (badge de tipo + título + descripción + autores) — eliminar repetición en TheoremPage, DefinitionPage, AxiomPage, ExamplePage, etc.
- [x] **NotFoundState**: crear componente de estado "no encontrado" — actualmente cada página tiene su propio HTML inline
- [x] **SuspenseFallback**: crear componente reutilizable para los fallbacks de carga de MDX
- [x] **RelatedExamples / RelatedExercises / RelatedUseCases**: extraer el patrón "Material Práctico" y "Aplicaciones en el Mundo Real" a componentes `MaterialPracticoSection` y `AplicacionesSection`
- [x] **ContentCard**: unificar estilos de cards de listado (ejemplos, ejercicios, casos de uso, corolarios, demostraciones)
- [x] **SectionTitle**: extraer los títulos de sección ("Material Práctico", "Demostraciones Disponibles", etc.) a componente
- [x] **ContentTypeBadge**: unificar badges de tipo de contenido (varían en estilo entre páginas)
- [x] **`InteractiveElement`**: mover la definición duplicada en cada MDX a `MDXComponents` en `MDXBlocks.tsx`
- [x] **Unificar naming de metadatos**: decidir `authors` vs `mathematicians`, `demos` vs `demostraciones`; actualizar Zod y migrar todos los MDX — Schema cambiado: `mathematicians` → `authors`, eliminado `demostraciones` (muerto)
- [x] **Linting de contenido MDX**: script que verifique `<Capitular>` inicial, `<Separador>` entre secciones, etc. según STYLEGUIDE
- [x] **Constantes compartidas** (`src/config/constants.ts`):
  - [x] Unificar `DIFF_COLORS` (ExercisePage, UseCasePage)
  - [x] Unificar `DOMAIN_ICONS` y `DOMAIN_COLORS` (UseCasePage) o leerlos de metadatos
  - [x] Unificar `typeLabels` / `typeStyles` en un mapa `contentTypeConfig` global (label singular/plural, ruta, color, icono)
  - [x] Unificar colores de nodos entre `AxiomaticTree` y `GraphPage` — `GRAPH_NODE_COLORS` como fuente única, `CustomNode` importa `TYPE_STYLES` de constants

### 0.3 Validación de referencias cruzadas
*Garantizar la integridad del grafo de contenido antes de escalar.*
- [x] Crear `scripts/validate-cross-references.ts` que verifique:
  - [x] Todos los `links` en metadatos → IDs existentes
  - [x] Todos los `targetId` de `<ConceptLink>`, `<InteractiveElement>`, `<GlossaryLink>` → IDs existentes
  - [x] Todos los `parentTheorem`, `relatedTheorem`, `concept` → contenido real
  - [x] Todos los `authors`/`mathematicians` → biografías existentes en `mathematicians/`
  - [x] Todos los `demos`/`demostraciones` → demostraciones existentes en `demonstrations/`
  - [x] Todos los `corollaries`, `examples`, `exercises`, `requires` → IDs existentes
  - [x] Todos los `axiomas` en modelos → axiomas reales
- [x] Añadir script al prebuild o CI para que falle en referencias huérfanas — añadido `validate-references` a `dev` y `prebuild`

### 0.4 Tests automatizados
*Sin tests no se puede refactorizar con confianza.*
- [x] Instalar Vitest + configurar `vitest.config.ts`
- [x] Añadir scripts `test`, `test:watch` y `test:coverage` en `package.json`
- [x] Tests de esquemas Zod (cada schema, casos válidos e inválidos) — `tests/schemas.test.ts`
- [x] Tests de ContentStore (getTheorem, getDefinition, getExamplesByTheorem, etc.) — `tests/content-store.test.ts`
- [x] Tests de carga: todos los MDX existentes cumplen su schema Zod — `tests/mdx-schemas.test.ts`
- [x] Tests de `validate-logical-graph.ts` (IDs huérfanos, ciclos, consistencia topológica) — `tests/validate-graph-structure.test.ts`
- [x] Tests de stores Zustand (UserProgressStore, NavigationStore, GlossaryStore) — `tests/stores/`
- [x] Tests de integración: cada ruta de AppRouter renderiza sin error — `tests/routes.test.tsx`

### 0.5 Estandarización del manejo de errores
- [x] Definir tipo `Result<T>` para ContentStore (`src/types/result.ts`)
- [x] Crear hook `useContent` que unifique loading / error / not-found en todas las páginas (`src/hooks/useContent.ts`, aunque devuelve `undefined` no `Result<T>`)
- [x] Mejorar `ErrorBoundary`: botones "Reintentar" y "Volver al inicio" añadidos
- [x] Página 404 global con diseño consistente — `NotFoundPage.tsx` con `NotFoundState`
- [x] Sistema de notificaciones toast (reemplazar banners inline como "Ejercicio completado") — `ToastStore.ts` + `ToastContainer.tsx`
- [x] Registrar errores en consola con contexto (tipo, ID, acción) — `logger.ts` + `useContent`

---

## FASE 1 — REFACTOR (Deuda técnica)

*Optimizar la arquitectura antes de añadir funcionalidades.*

### 1.1 Code splitting y lazy loading
- [x] Evaluar impacto de `import.meta.glob({ eager: true })` en bundle inicial — **causaba 4.5 MB en bundle principal por procesar todo MDX aunque solo se usara metadata**
- [x] Migrar a `{ eager: false }` — **reemplazado por `scripts/generate-content-index.ts` que extrae metadata a JSON (176 KB), eliminando el procesamiento MDX eager**
- [x] Lazy loading de páginas pesadas: EditorPage, GraphPage, AxiomGraphPage (`React.lazy`)
- [x] Lazy loading de diagramas JSXGraph — **ya lazy por estar dentro de MDX con `React.lazy()`**
- [x] Code splitting del ContentStore — **taxonomía MSC2020 extraída a `msc2020.ts` (438 líneas → módulo separado)**
- [x] Analizar bundle con `rollup-plugin-visualizer` — **instalado y configurado, genera `dist/stats.html`**

**Resultados:** Bundle principal reducido de **4,587 kB → 1,050 kB** (77% menos, 613 kB → 290 kB gzip). Cada MDX es ahora un chunk independiente. Sin warnings `INEFFECTIVE_DYNAMIC_IMPORT`.

### 1.2 Refactorización del editor
- [x] Extraer componentes: barra lateral (`EditorSidebar`), panel de metadatos (`MetadataPanel`), modal de enlaces (`LinkModal`), galería (`ComponentGallery`, `BlocksGallery`), wizard (`NewFileWizard`), toolbar (`EditorToolbar`), preview (`PreviewPane`), imports (`ImportsPanel`), refs (`RefModal`)
- [x] Extraer el estado monolítico de `EditorPage.tsx` (~1270 líneas) a hooks — **`useEditorState` (198 líneas) + `useEditorActions` (382 líneas). `EditorPage.tsx` reducido de 1270→592 líneas, solo JSX + lógica de integración**

### 1.3 Unificación de stores y configuración
- [x] Crear `src/store/graphTypes.ts` con tipos compartidos (`GraphNodeProof`, `GraphNodeMeta`, `GraphStructure`, `ModelInfo`, `GraphEdge`)
- [x] `graphUtils.ts`: eliminar interfaces duplicadas, importar desde `graphTypes.ts`
- [x] `useGraphSandboxStore.ts`: eliminar `evaluateActiveGraph` duplicado (usar el de `graphUtils.ts`), eliminar interfaces inline (importar desde `graphTypes.ts`)
- [x] `graphStore.ts`: eliminar `ModelInfo` inline, importar desde `graphTypes.ts`; usar `computeDisabledAxiomsFromModels` de `graphUtils.ts`
- [x] Centralizar `contentTypeConfig` para todos los tipos de contenido — `CONTENT_TYPE_CONFIG` en `constants.ts`

### 1.4 Links
- [x] Añadir campo `seeAlso: z.array(z.string()).optional()` a todos los Zod schemas (contenido no-grafo)
- [x] Añadir `seeAlso?: string[]` a los TypeScript interfaces en `types.ts`
- [x] Validar `seeAlso` en `scripts/validate-cross-references.ts` (mismos IDs existentes que `links`)
- [x] `validate-logical-graph.ts` NO incluye `seeAlso` en dependencias del grafo — **es el comportamiento deseado** (referencia sin dependencia formal)

---

## FASE 2 — INTERNACIONALIZACIÓN (i18n)

*Una vez que la base es consistente, se puede bifurcar por idiomas sin riesgo.*

### 2.0 Principio del ID Invariante
- [ ] Documentar y aplicar: `metadata.id`, `targetId`, `links`, MSC2020 nunca se traducen
- [ ] Verificar que ningún componente usa cadenas traducibles como clave
- [ ] Asegurar que `validate-logical-graph.ts` ignora locale

### 2.1 Bifurcación del sistema de archivos MDX
- [ ] Reestructurar `src/content/` → `src/content/es/`, `src/content/en/`, `src/content/eu/`
- [ ] Migrar MDX existentes a `src/content/es/`
- [ ] Adaptar `import.meta.glob` para cargar desde el locale activo
- [ ] Traducir title, description y cuerpo a inglés y euskera
- [ ] Decidir si `taxonomyData.ts` se traduce

### 2.2 Grafos paralelos
- [ ] Evaluar Opción A (monolítico) vs **Opción B** (grafos paralelos por idioma)
- [ ] Implementar en `validate-logical-graph.ts`
- [ ] Adaptar GraphWorker para cargar grafo del locale activo
- [ ] Verificar topología idéntica entre idiomas

### 2.3 Gestión de estado global
- [ ] Instalar e integrar `i18next` + `react-i18next`
- [ ] Crear archivos `locales/{es,en,eu}/common.json`
- [ ] Añadir `locale` a Zustand store
- [ ] Conectar cambio de idioma: i18next → ContentStore → GraphWorker
- [ ] Selector de idioma en la interfaz

### 2.4 LaTeX y geometría
- [ ] Documentar guía de traducción matemática (LAL→SAS, ALA→ASA, \text{sen}→\sin)
- [ ] Aplicar guía a MDX traducidos
- [ ] Nota aclaratoria en glosario si se mantiene notación de Hilbert

---

## FASE 3 — GRAFO Y EXPERIENCIA DE NAVEGACIÓN

*Mejoras que el usuario nota inmediatamente.*

### 3.1 Grafo axiómatico
- **Modelos matemáticos:**
  - [x] Panel dinámico que lea modelos desde `src/content/models/`
  - [x] Resaltar axiomas activos al seleccionar modelo
  - [x] Atenuar/ocultar axiomas excluidos
  - [x] Permitir múltiples modelos simultáneos (intersección)
  - [x] Persistir selección en localStorage
- **Visibilidad:**
  - [x] Layout sin solapamientos (dagre layout)
  - [x] Agrupar nodos por tipo con fondos semitransparentes → **anillos de color por grupo axiomático en CustomNode** (Incidencia/Orden/Congruencia/Paralelas/Lobachevski)
  - [x] Estilos de arista: directa (sólida), lema intermedio (discontinua), definicional (punteada)
  - [x] Zoom inicial (fitView), controles de zoom, minimap
  - [x] Filtros por tipo de nodo (checkboxes)
  - [x] Búsqueda de nodo por nombre
- **Panel lateral:**
  - [x] Mostrar: tipo (badge), título, descripción, cadena de dependencias
  - [x] Botón "Ver página completa" → `/teorema/:id`, `/definicion/:id`, `/axioma/:id`
  - [x] Enlaces a predecesores y sucesores
  - [ ] Si es axioma con modelos activos, mostrar en qué modelos está
  - [x] Diseño responsive (modal en móvil)

### 3.2 Navegabilidad
- **Logo:**
  - [x] Revisar solapamientos con ThemeToggle, SearchOmnibar, MarginaliaPanel — **creado TopBar.tsx, z-index reorganizado (TopBar z-[60], MarginaliaPanel z-50, SearchOmnibar z-[100])**
  - [x] Agrupar controles flotantes en barra superior — **TopBar component con pointer-events-none + pointer-events-auto en hijos**
  - [x] Asegurar z-index correcto — **TopBar z-[60] sobre MarginaliaPanel (z-50), bajo SearchOmnibar (z-[100])**
- **ConceptLinks:**
  - [x] Auditar ConceptLink.tsx — MarginaliaPanel exists in App.tsx, ConceptLink in MDXBlocks
  - [x] Feedback visual si targetId no existe — **ya implementado en ConceptLink.tsx:38-47 (borde granada discontinuo)**
  - [ ] Considerar unificar ConceptLink, GlossaryLink, HighlightLink, VisualBind — **evaluado: propósitos distintos (navegación, tooltip, simulación), no unificar**

### 3.3 Onboarding / Tour interactivo
- [ ] Evaluar driver.js (más ligero) vs shepherd.js vs intro.js
- [ ] Tour de primera visita al grafo (5 pasos: qué son los nodos, selector de modelos, filtros, panel de detalle, búsqueda)
- [ ] Botón "Reiniciar tour"
- [ ] Tour breve para HomePage (tarjetas de acceso rápido, filosofía)
- [ ] Tour contextual para el editor (sidebar, metadatos, preview)

### 3.4 Atajos de teclado
- [x] `g` + `h` → Home · `g` + `t` → Teorema · `g` + `d` → Definición
- [x] `g` + `g` → Grafo · `g` + `a` → Axiomas · `g` + `e` → Editor
- [x] `g` + `s` → Diccionario · `?` → SearchOmnibar
- [x] `Escape` → cerrar SearchOmnibar y MarginaliaPanel
- [x] Evitar interferencias con Monaco Editor — **`isEditing()` check en `useKeyboardShortcuts.ts:12-17`**

### 3.5 Búsqueda a texto completo
- [x] Auditar SearchOmnibar: busca solo metadatos (title + description) — **no incluye cuerpo MDX, requeriría cargar raw .mdx como texto**
- [x] Integrar Fuse.js — **fuzzy search con threshold 0.35, pesos title:2 / subtitle:1**
- [x] Indexar taxonomy MSC2020 — **códigos + nombres en results como tipo `msc2020`**
- [x] Indexar biografías y glosario — **ya estaban: matemáticos + glosario**
- [x] Filtros por tipo de contenido — **sidebar izquierda con checkboxes de tipo**
- [x] Snippets con término resaltado — **highlightText() que usa `includeMatches` de Fuse.js**
- [ ] Persistir índice en IndexedDB (opcional, búsqueda offline)

---

## FASE 4 — POLISH VISUAL Y CALIDAD

*Pulir la interfaz para que esté lista para usuarios reales.*

### 4.1 Mejoras de UI
- **Sistema de diseño:**
  - [x] Breadcrumbs reutilizable y responsivo (truncar ramas largas + title tooltips)
  - [x] ContentCard con variantes por tipo — **añadido prop `type` que auto-asigna badge/accent/actionLabel desde CONTENT_TYPE_CONFIG; usado en TheoremPage y ExamplePage**
  - [x] Animaciones: hover scale, fade-in al montar — **extendido FadeIn a AxiomPage, DemoPage, ExamplePage, UseCasePage**
  - [x] EmptyState visible — **añadido EmptyState a Demostraciones, Corolarios, Axiomas del modelo en lugar de ocultar secciones**
- **Homepage:**
  - [ ] Evaluar layout de 4 cards en HeroSection
  - [ ] Añadir "Explorar por rama" o "Contenido reciente" debajo del hero
  - [ ] Extraer lema hardcodeado a constante/metadata
- **Tipografía y espaciado:**
  - [ ] Unificar `max-w-3xl` vs `max-w-4xl` entre páginas
  - [x] SectionTitle, ContentTypeBadge como componentes
- **Consistencia cromática:**
  - [ ] Eliminar hex hardcodeados (#2a6a2a, #A42A04, etc.) → tokens Tailwind Arts & Crafts (aún hay hardcoded en GraphPage y constants.ts)
  - [x] Todas las páginas usan `bg-lienzo`, `text-carbon`, `border-carbon/10` (mayoritariamente)
  - [ ] Paleta semántica del STYLEGUIDE reflejada en UI (no solo en diagramas)
- **Simulación:**
  - [x] SimulationLayout: colapsar a ancho completo si no hay simulación
  - [ ] Botón "Pantalla completa" en simulaciones JSXGraph
  - [ ] Sincronizar color de elementos interactivos con tokens semánticos
  - [x] Permitir que páginas de axiomas tengan simulaciones — **añadido `Simulation` a `Axiom` interface + ContentStore + SimulationLayout en AxiomPage**

### 4.2 Diseño responsive y móvil
- [] **Grafo:** nodos reducidos, panel lateral → modal, selector de modelos → bottom sheet
- [] **Editor:** modo lectura forzado o editor texto plano en móvil, preview fullscreen
- [] **Páginas:** SimulationLayout apilado, BiographyLayout colapsable — **cambiado a `flex-col lg:flex-row` + padding responsive**, MarginaliaPanel → modal, SearchOmnibar usable en teclado móvil
- [] **Tablas y fórmulas LaTeX:** scroll horizontal — **`overflow-x: auto` en `.katex-display, .katex`**

### 4.3 Accesibilidad (a11y)
- [] **Contenido matemático:** `aria-label` en fórmulas KaTeX, explorar MathML, `alt` text en diagramas
- [] **Teclado:** grafo navegable con Tab/Enter/Escape, focus trap en modales, skip-to-content link
- [] **ARIA:** roles navigation/main, aria-expanded en paneles, aria-live en zonas dinámicas, aria-label en ThemeToggle
- [] **Contraste:** verificar WCAG AA con paleta Arts & Crafts, dificultad no solo por color, modo alto contraste opcional

### 4.4 Exportación e impresión
- [ ] `@media print` en CSS (ocultar navegación, MarginaliaPanel, etc.)
- [ ] Forzar modo claro en impresión
- [ ] Botón "Imprimir / Exportar PDF" en páginas de contenido
- [ ] PDF server-side con puppeteer (opcional)

---

## FASE 5 — NUEVAS FUNCIONALIDADES

*Contenido y herramientas que expanden el proyecto.*

### 5.1 Editor — Sidebar y tipos faltantes
- [ ] Eliminar `diagrams` y `components` del sidebar (aún presentes en `EditorSidebar.tsx`)
- [ ] Añadir: exercises, examples, usecases, axioms, models, plans (no están en sidebar)
- [ ] Crear templates MDX para tipos faltantes
- [ ] Panel de metadatos: mostrar **todos** los campos del schema Zod (no solo los presentes)
- [ ] Validación en tiempo real contra Zod
- [x] Modal de enlaces: incluye select con opciones de contenido
- [ ] Actualizar `GET /api/list-content` si es necesario

### 5.2 Proposiciones
- [ ] Evaluar si es tipo distinto o subtipo de teorema
- [ ] Crear `PropositionSchema`, directorio `propositions/`, métodos en ContentStore
- [ ] Ruta `/proposicion/:id`, tipo en grafo con color propio, tipo en editor

### 5.3 Equivalencias
- [ ] Definir alcance: ¿entre teoremas? ¿entre sistemas axiomáticos?
- [ ] Crear `EquivalenceSchema` con `statements: string[]` y `proof: string`
- [ ] Directorio `equivalences/`, métodos en ContentStore, ruta `/equivalencia/:id`
- [ ] Aristas bidireccionales en el grafo con estilo especial

---

## FASE 6 — LANZAMIENTO

*Poner el proyecto en producción.*

- [x] Decidir plataforma de hosting (GitHub Pages — `homepage` en `package.json`)
- [ ] Configurar dominio personalizado
- [x] SPA redirects (`cp dist/index.html dist/404.html` en build)
- [x] Build optimizado (`tsc -b && vite build`)
- [ ] CI/CD con GitHub Actions (build automático en push a main)
- [ ] Script de prebuild: solo `validate-logical-graph.ts`, falta `validate-cross-references.ts`
- [ ] Verificar assets estáticos en build
- [ ] Probar build en producción localmente
