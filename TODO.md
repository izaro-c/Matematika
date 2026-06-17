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
- [ ] **Breadcrumbs**: extraer a `src/components/ui/Breadcrumbs.tsx` — se repite 7+ veces (TheoremPage, DefinitionPage, ExercisePage, UseCasePage, DemoPage, AxiomPage, BranchPage)
- [ ] **ContentHeader**: crear componente único para la cabecera (badge de tipo + título + descripción + autores) — eliminar repetición en TheoremPage, DefinitionPage, AxiomPage, ExamplePage, etc.
- [ ] **NotFoundState**: crear componente de estado "no encontrado" — actualmente cada página tiene su propio HTML inline
- [ ] **SuspenseFallback**: crear componente reutilizable para los fallbacks de carga de MDX
- [ ] **RelatedExamples / RelatedExercises / RelatedUseCases**: extraer el patrón "Material Práctico" y "Aplicaciones en el Mundo Real" a componentes — se repite idéntico en TheoremPage y DefinitionPage
- [ ] **ContentCard**: unificar estilos de cards de listado (ejemplos, ejercicios, casos de uso, corolarios, demostraciones)
- [ ] **SectionTitle**: extraer los títulos de sección ("Material Práctico", "Demostraciones Disponibles", etc.) a componente
- [ ] **ContentTypeBadge**: unificar badges de tipo de contenido (varían en estilo entre páginas)
- [ ] **`InteractiveElement`**: mover la definición duplicada en cada MDX a `MDXComponents` en `MDXBlocks.tsx`
- [ ] **Unificar naming de metadatos**: decidir `authors` vs `mathematicians`, `demos` vs `demostraciones`; actualizar Zod y migrar todos los MDX
- [ ] **Linting de contenido MDX**: script que verifique `<Capitular>` inicial, `<Separador>` entre secciones, etc. según STYLEGUIDE
- [ ] **Constantes compartidas** (`src/config/constants.ts`):
  - [ ] Unificar `DIFF_COLORS` (ExercisePage, UseCasePage)
  - [ ] Unificar `DOMAIN_ICONS` y `DOMAIN_COLORS` (UseCasePage) o leerlos de metadatos
  - [ ] Unificar `typeLabels` / `typeStyles` en un mapa `contentTypeConfig` global (label singular/plural, ruta, color, icono)
  - [ ] Unificar colores de nodos entre `AxiomaticTree` y `GraphPage`

### 0.3 Validación de referencias cruzadas
*Garantizar la integridad del grafo de contenido antes de escalar.*
- [ ] Crear `scripts/validate-cross-references.ts` que verifique:
  - [ ] Todos los `links` en metadatos → IDs existentes
  - [ ] Todos los `targetId` de `<ConceptLink>`, `<InteractiveElement>`, `<GlossaryLink>` → IDs existentes
  - [ ] Todos los `parentTheorem`, `relatedTheorem`, `concept` → contenido real
  - [ ] Todos los `authors`/`mathematicians` → biografías existentes en `mathematicians/`
  - [ ] Todos los `demos`/`demostraciones` → demostraciones existentes en `demonstrations/`
  - [ ] Todos los `corollaries`, `examples`, `exercises`, `requires` → IDs existentes
  - [ ] Todos los `axiomas` en modelos → axiomas reales
- [ ] Añadir script al prebuild o CI para que falle en referencias huérfanas

### 0.4 Tests automatizados
*Sin tests no se puede refactorizar con confianza.*
- [ ] Instalar Vitest + React Testing Library + configurar `vitest.config.ts`
- [ ] Añadir scripts `test` y `test:coverage` en `package.json`
- [ ] Tests de esquemas Zod (cada schema, casos válidos e inválidos)
- [ ] Tests de ContentStore (getTheorem, getDefinition, getExamplesByTheorem, etc.)
- [ ] Tests de carga: todos los MDX existentes cumplen su schema Zod
- [ ] Tests de `validate-logical-graph.ts` (IDs huérfanos, ciclos, consistencia topológica)
- [ ] Tests de stores Zustand (graphStore, UserProgressStore, NavigationStore, GlossaryStore)
- [ ] Tests de integración: cada ruta de AppRouter renderiza sin error

### 0.5 Estandarización del manejo de errores
- [ ] Definir tipo `Result<T>` para ContentStore (`getTheorem(id): Result<Theorem>` en lugar de `Theorem | null`)
- [ ] Crear hook `useContent` que unifique loading / error / not-found en todas las páginas
- [ ] Mejorar `ErrorBoundary`: mostrar error real, botones "Reintentar" y "Volver al inicio"
- [ ] Página 404 global con diseño consistente
- [ ] Sistema de notificaciones toast (reemplazar banners inline como "Ejercicio completado")
- [ ] Registrar errores en consola con contexto (tipo, ID, acción)

---

## FASE 1 — REFACTOR (Deuda técnica)

*Optimizar la arquitectura antes de añadir funcionalidades.*

### 1.1 Code splitting y lazy loading
- [ ] Evaluar impacto de `import.meta.glob({ eager: true })` en bundle inicial
- [ ] Migrar a `{ eager: false }` con carga bajo demanda (o por tipo de contenido)
- [ ] Lazy loading de páginas pesadas: EditorPage, GraphPage, AxiomGraphPage (`React.lazy`)
- [ ] Lazy loading de diagramas JSXGraph (no cargar todos hasta que se necesiten)
- [ ] Code splitting del ContentStore por tipo de contenido
- [ ] Analizar bundle con `rollup-plugin-visualizer`

### 1.2 Refactorización del editor
- [ ] Extraer el estado monolítico de `EditorPage.tsx` (~1100 líneas) a hooks y componentes
- [ ] Extraer componentes: barra lateral, panel de metadatos, modal de enlaces, galería

### 1.3 Unificación de stores y configuración
- [ ] Unificar stores relacionadas (graphStore + useGraphSandboxStore si hay duplicación)
- [ ] Centralizar `contentTypeConfig` para todos los tipos de contenido

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
  - [ ] Panel dinámico que lea modelos desde `src/content/models/`
  - [ ] Resaltar axiomas activos al seleccionar modelo
  - [ ] Atenuar/ocultar axiomas excluidos
  - [ ] Permitir múltiples modelos simultáneos (intersección)
  - [ ] Persistir selección en localStorage
- **Visibilidad:**
  - [ ] Layout sin solapamientos
  - [ ] Agrupar nodos por tipo con fondos semitransparentes
  - [ ] Estilos de arista: directa (sólida), lema intermedio (discontinua), definicional (punteada)
  - [ ] Zoom inicial (fitView), minimap, controles de zoom
  - [ ] Filtros por tipo de nodo (checkboxes)
  - [ ] Búsqueda de nodo por nombre
- **Panel lateral:**
  - [ ] Mostrar: tipo (badge), título, descripción, cadena de dependencias
  - [ ] Botón "Ver página completa" → `/teorema/:id`, `/definicion/:id`, `/axioma/:id`
  - [ ] Enlaces a predecesores y sucesores
  - [ ] Si es axioma con modelos activos, mostrar en qué modelos está
  - [ ] Diseño responsive (modal en móvil)

### 3.2 Navegabilidad
- **Logo:**
  - [ ] Revisar solapamientos con ThemeToggle, SearchOmnibar, MarginaliaPanel
  - [ ] Agrupar controles flotantes en barra superior (móvil: hamburguesa)
  - [ ] Asegurar z-index correcto
- **ConceptLinks:**
  - [ ] Auditar `ConceptLink.tsx` — ¿abre MarginaliaPanel correctamente?
  - [ ] Feedback visual si targetId no existe
  - [ ] Considerar unificar ConceptLink, GlossaryLink, HighlightLink, VisualBind

### 3.3 Onboarding / Tour interactivo
- [ ] Evaluar driver.js (más ligero) vs shepherd.js vs intro.js
- [ ] Tour de primera visita al grafo (5 pasos: qué son los nodos, selector de modelos, filtros, panel de detalle, búsqueda)
- [ ] Botón "Reiniciar tour"
- [ ] Tour breve para HomePage (tarjetas de acceso rápido, filosofía)
- [ ] Tour contextual para el editor (sidebar, metadatos, preview)

### 3.4 Atajos de teclado
- [ ] `g` + `h` → Home · `g` + `t` → Teorema · `g` + `d` → Definición
- [ ] `g` + `g` → Grafo · `g` + `a` → Axiomas · `g` + `e` → Editor
- [ ] `g` + `s` → SearchOmnibar · `?` → paleta de comandos
- [ ] `Escape` → cerrar paneles y modales
- [ ] Evitar interferencias con Monaco Editor

### 3.5 Búsqueda a texto completo
- [ ] Auditar SearchOmnibar: ¿busca solo metadatos o cuerpo MDX?
- [ ] Integrar Fuse.js o MiniSearch para indexar cuerpo completo de MDX
- [ ] Indexar también taxonomy MSC2020, biografías, glosario
- [ ] Filtros por tipo de contenido en resultados
- [ ] Snippets con término resaltado
- [ ] Persistir índice en IndexedDB (opcional, búsqueda offline)

---

## FASE 4 — POLISH VISUAL Y CALIDAD

*Pulir la interfaz para que esté lista para usuarios reales.*

### 4.1 Mejoras de UI
- **Sistema de diseño:**
  - [ ] Breadcrumbs reutilizable y responsivo (truncar ramas largas)
  - [ ] ContentCard con variantes por tipo
  - [ ] Animaciones: hover scale, fade-in al montar (extender el estándar de HomePage)
  - [ ] EmptyState visible (no ocultar secciones sin contenido)
- **Homepage:**
  - [ ] Evaluar layout de 4 cards en HeroSection
  - [ ] Añadir "Explorar por rama" o "Contenido reciente" debajo del hero
  - [ ] Extraer lema hardcodeado a constante/metadata
- **Tipografía y espaciado:**
  - [ ] Unificar `max-w-3xl` vs `max-w-4xl` entre páginas
  - [ ] SectionTitle, ContentTypeBadge como componentes
- **Consistencia cromática:**
  - [ ] Eliminar hex hardcodeados (#2a6a2a, #A42A04, etc.) → tokens Tailwind Arts & Crafts
  - [ ] Todas las páginas usan `bg-lienzo`, `text-carbon`, `border-carbon/10`
  - [ ] Paleta semántica del STYLEGUIDE reflejada en UI (no solo en diagramas)
- **Simulación:**
  - [ ] SimulationLayout: colapsar a ancho completo si no hay simulación
  - [ ] Botón "Pantalla completa" en simulaciones JSXGraph
  - [ ] Sincronizar color de elementos interactivos con tokens semánticos

### 4.2 Diseño responsive y móvil
- **Grafo:** nodos reducidos, panel lateral → modal, selector de modelos → bottom sheet
- **Editor:** modo lectura forzado o editor texto plano en móvil, preview fullscreen
- **Páginas:** SimulationLayout apilado, BiographyLayout colapsable, MarginaliaPanel → modal, SearchOmnibar usable en teclado móvil
- Tablas y fórmulas LaTeX: scroll horizontal

### 4.3 Accesibilidad (a11y)
- **Contenido matemático:** `aria-label` en fórmulas KaTeX, explorar MathML, `alt` text en diagramas
- **Teclado:** grafo navegable con Tab/Enter/Escape, focus trap en modales, skip-to-content link
- **ARIA:** roles navigation/main, aria-expanded en paneles, aria-live en zonas dinámicas, aria-label en ThemeToggle
- **Contraste:** verificar WCAG AA con paleta Arts & Crafts, dificultad no solo por color, modo alto contraste opcional

### 4.4 Exportación e impresión
- [ ] `@media print` en CSS (ocultar navegación, MarginaliaPanel, etc.)
- [ ] Forzar modo claro en impresión
- [ ] Botón "Imprimir / Exportar PDF" en páginas de contenido
- [ ] PDF server-side con puppeteer (opcional)

---

## FASE 5 — NUEVAS FUNCIONALIDADES

*Contenido y herramientas que expanden el proyecto.*

### 5.1 Editor — Sidebar y tipos faltantes
- [ ] Eliminar `diagrams` y `components` del sidebar
- [ ] Añadir: exercises, examples, usecases, axioms, models, plans
- [ ] Crear templates MDX para tipos faltantes
- [ ] Panel de metadatos: mostrar **todos** los campos del schema Zod (no solo los presentes)
- [ ] Validación en tiempo real contra Zod
- [ ] Modal de enlaces: incluir todos los tipos de contenido en el `<select>`
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

- [ ] Decidir plataforma de hosting (Vercel, Netlify, GitHub Pages, servidor propio)
- [ ] Configurar dominio personalizado
- [ ] SPA redirects (fallback a index.html para rutas dinámicas)
- [ ] Build optimizado (`vite build`)
- [ ] CI/CD con GitHub Actions (build automático en push a main)
- [ ] Script de prebuild: `validate-logical-graph.ts` + `validate-cross-references.ts`
- [ ] Verificar assets estáticos en build
- [ ] Probar build en producción localmente
