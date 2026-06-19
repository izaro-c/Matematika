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

## FASE 2 — Integración completa de modelos
*Integrar completamente el concepto de "Modelo" en toda la aplicación.*
- [ ] 1. SearchOmnibar: tipo 'modelo', loop db.models, icon/color/href
- [ ] 2. ContentStore: getBranchTaxonomy + getItemsByBranch incluyen modelos
- [ ] 3. BranchLibrary + BranchPage: caso 'model' en href/labels/estilos
- [ ] 4. DictionaryPage: modelos en glosario, categoría "Modelos"
- [ ] 5. graph.worker.ts: 'modelo' en VISIBLE_TYPES, edges desde axioms_verified + satisfies
- [ ] 6. AxiomaticTree: modelos como nodos de pleno derecho, toggle en "Tipos de Nodo", color en leyenda
- [ ] 7. GraphPage: click en modelo → /modelo/:id, entrada en leyenda
- [ ] 8. NewFileWizard: opción "Modelo" con campos satisfies + axioms_verified + hasDiagram
- [ ] 9. ModelPage: SimulationLayout opcional además de Diagram
- [ ] 10. TaxonomyGraph: caso 'model' en color + click
- [ ] 11. Revisión contenido: auditar modelo-tres-puntos.mdx — ¿es suficiente o necesita más modelos (Fano, cartesiano, Poincaré)? Evaluar si la verificación de axiomas es completa o superficial

---

## FASE 3 — Modularización + interconexión con ConceptLinks
*Mejorar la navegabilidad del contenido existente.*
- [ ] 1. Script Python: detectar menciones de conceptos sin ConceptLink en los 51 MDX
- [ ] 2. Corolarios: separar a archivos propios (type: "corolario", parentTheorem). Teorema padre los lista automáticamente
- [ ] 3. Lemas: verificar parentTheorem en todos
- [ ] 4. TheoremPage: listar lemas, corolarios, demos, ejemplos, ejercicios desde metadata automáticamente
- [ ] 5. Sistemas: cada axioma mencionado con ConceptLink en el cuerpo, no solo listado
- [ ] 6. Revisión contenido por archivo (eliminar/añadir/modificar/reorganizar):
  - [ ] Axiomas: ¿enunciado formal preciso? ¿discusión aporta contexto o repite? Eliminar redundancias entre "Discusión" y "Observaciones" si las hay. Añadir ejemplos concretos si faltan
  - [ ] Definiciones: ¿usa solo términos primitivos o definidos? ¿statement formal coincide con descripción? Reorganizar: intuición → enunciado → discusión
  - [ ] Teoremas: ¿hipótesis y tesis claramente separadas? Eliminar demostraciones embebidas (ya en demos). Añadir "Aplicaciones" si faltan
  - [ ] Sistemas: ¿lista de axiomas completa y ordenada? Añadir "Propiedades" (consistencia, independencia, completitud) si faltan
  - [ ] Matemáticos: ¿contribuciones enlazadas a sus teoremas? Eliminar adjectivación innecesaria

---

## FASE 4 — Demostraciones paso a paso con MedievalStep + diagramas
*Hacer las demostraciones visuales e interactivas.*
- [ ] 1. Convertir 6 demos a layout: "split"
- [ ] 2. Estructura: `<DemonstrationSection diagram={...}>` + `<MedievalStep number target title />` por cada paso lógico
- [ ] 3. Reglas por paso: justificado por axioma (ConceptLink), definición (ConceptLink), hipótesis, o resultado previo (ConceptLink al teorema/lema)
- [ ] 4. Diagrama reactivo: un diagrama único por demo que responde a useMathStore.highlight cambiado por MedievalStep. Cada paso highlights el elemento relevante
- [ ] 5. Crear diagramas por demo (6 diagramas nuevos o reutilizar existentes con highlights):
  - [ ] demo-dos-rectas-un-punto: diagrama con 2 rectas + 2 puntos shared → contradicción visual
  - [ ] demo-angulos-opuestos: diagrama existente AngulosOpuestos con highlights por step
  - [ ] demo-congruencia-ala: diagrama con transporte de segmento paso a paso
  - [ ] demo-congruencia-lll: diagrama con intersección de circunferencias
  - [ ] demo-punto-medio: diagrama con construcción del punto medio
  - [ ] demo-punto-medio-perpendicular: diagrama con mediatriz + LAL/LLL
- [ ] 6. Revisión contenido: cada demo debe tener hipótesis/tesis explícitas, pasos numerados, justificación por paso, conclusión con □. Eliminar pasos innecesarios, añadir pasos faltantes si hay saltos lógicos

---

## FASE 5 — Métodos de prueba + contenido nuevo
*Añadir nuevas demostraciones y lecciones.*
- [ ] 1. Métodos de prueba (lecciones con diagramas):
  - [ ] leccion-metodo-directo — qué es, cuándo usar, ejemplo (dos-rectas-un-punto)
  - [ ] leccion-metodo-contradiccion — qué es, cuándo usar, ejemplo (dos-rectas-un-punto)
  - [ ] leccion-metodo-contraposicion — qué es, ejemplo
  - [ ] leccion-metodo-induccion — qué es, ejemplo
  - [ ] leccion-metodo-exhaustivo — qué es, ejemplo
  - [ ] Cada una con diagrama interactivo si aporta (ej: contradicción muestra suposición → contradicción visual)
- [ ] 2. Contenido nuevo:
  - [ ] Teoremas: Pitágoras, suma de ángulos del triángulo, desigualdad triangular, criterio LLA (con condiciones), teorema del ángulo exterior
  - [ ] Definiciones: triángulo, circunferencia, perpendicular, paralelas, bisectriz, mediana, altura
  - [ ] Ejercicios: 3-5 por teorema clave (interactivos con `<Hueco>`, `<Pregunta>`)
  - [ ] Ejemplos: 2-3 por teorema clave (resueltos paso a paso)
  - [ ] Casos de uso: arquitectura (rigidez triangular via LLL), navegación (Pitágoras), diseño (ángulos opuestos)
  - [ ] Plan de estudio: "Fundamentos de Geometría" — secuencia axiomática
- [ ] 3. Revisión contenido: cada nuevo archivo debe pasar el criterio de calidad (riguroso, completo, comprensible, visual). No añadir por añadir — solo si aporta valor pedagógico

---

## FASE 6 — Matemáticos + estilo liana
*Mejorar las biografías.*
- [ ] 1. Alinear schema: BiographyLayout usa birth/death/era/fullName (strings) pero MathematicianSchema tiene birthYear/deathYear (números). Unificar
- [ ] 2. Mejorar schema: añadir field (campo), knownFor (array IDs), portrait (image path)
- [ ] 3. Estilo liana: panel izquierdo con timeline vertical (nodos diamond por año clave: nacimiento, publicación principal, fallecimiento). Clickable → teorema o contexto
- [ ] 4. Contenido MDX (7 archivos): secciones Vida, Contribuciones (con ConceptLinks), Contexto histórico, Legado. Lenguaje natural y riguroso
- [ ] 5. Conexión: db.getTheoremsByAuthor ya existe. Añadir getAxiomsByAuthor, getSystemsByMathematician
- [ ] 6. Revisión contenido: eliminar adjetivación teatral ("célebre", "genio", "revolucionario"). Mantener hechos verificables. Añadir contexto matemático real (qué problema resolvió, qué cambió)

---

## FASE 7 — Fórmulas clicables + glosario automático
*Mejorar la comprensión matemática básica.*
- [ ] 1. Formula component: click handler → popover con explicación de símbolos. Extraer variables de la fórmula (parse KaTeX) y mapear a glosario
- [ ] 2. Glosario automático: GlossaryStore.init() itera db.getAllDefinitions() → añade cada definición como término (title → término, description → definición)
- [ ] 3. Tooltip: al clicar fórmula $a^2+b^2=c^2$ → popover "a, b: catetos; c: hipotenusa" con links a definiciones
- [ ] 4. DictionaryPage: ya muestra definiciones. Verificar que se sincroniza con GlossaryStore
- [ ] 5. Revisión contenido: auditar fórmulas en MDX — ¿usan símbolos definidos? Si una fórmula usa $\angle$ sin que "ángulo" esté en el glosario, añadirlo

---

## FASE 8 — Modo oscuro + UI (solapamientos)
*Pulido final de la interfaz.*
- [ ] 1. Persistencia tema: ThemeToggle → localStorage + prefers-color-scheme
- [ ] 2. Reemplazar hardcoded: buscar bg-zinc-900, bg-white, text-white, bg-black/30 → semánticos (bg-carbon, bg-lienzo, text-lienzo). Especialmente BiographyLayout.tsx
- [ ] 3. Monaco: theme dinámico (vs-light/vs-dark)
- [ ] 4. Solapamientos: revisar AxiomaticTree (panel izq + búsqueda + panel der + leyenda en pantallas medianas), GraphPage (leyenda + búsqueda), BranchPage (grafo + listas). Añadir responsive breakpoints
- [ ] 5. JSXGraph en oscuro: verificar .JXGtext stroke se ajusta
- [ ] 6. Revisión contenido: auditar etiquetas UI teatrales ("Códice", "Papiro") → nombres neutros manteniendo estilo visual Arts & Crafts

---

## FASE 9 — Mejora del editor
*Mejorar la experiencia de creación.*
- [ ] 1. Deduplicar: usar componentes extraídos (EditorToolbar, LinkModal, NewFileWizard) en vez de inline en EditorPage.tsx. Eliminar código muerto
- [ ] 2. Links externos: LinkModal → toggle Interno/Externo. Externo: URL libre. Interno: dropdown (actual)
- [ ] 3. ConceptLink inserter: botón en toolbar → modal con dropdown de todos los IDs → inserta `<ConceptLink targetId="...">`
- [ ] 4. Wizard modelos: ya cubierto en Fase 2
- [ ] 5. UX: agrupar botones (Texto | Matemática | Bloques | Referencias), tooltips español, iconos claros
- [ ] 6. Revisión contenido: auditar plantillas MDX que genera el wizard — ¿includen todos los componentes necesarios? ¿El metadata scaffolding es correcto?

---

## FASE 10 — Revisión de lenguaje (natural y técnico)
*Validar calidad final.*
- [ ] 1. Script Python: buscar lenguaje teatral en MDX ("célebre", "elegante", "Nótese", "He aquí", "❦", epígrafes ornamentales excesivos)
- [ ] 2. Reemplazar por natural y técnico: "célebre" → eliminar, "elegante" → eliminar o justificar, "Nótese que" → "Obsérvese que" o directo
- [ ] 3. Mantener rigurosidad: definiciones formales y demostraciones precisas. Solo cambiar tono expositivo
- [ ] 4. Componentes UI: renombrar "Códice Nocturno" → "Modo oscuro", "Papiro" → "Modo claro", "Biblioteca" → "Inicio" o mantener si conviene
- [ ] 5. Revisión final por archivo: cada página pasa el criterio (riguroso, completo, comprensible, visual). Eliminar lo redundante, reorganizar lo desordenado

---

## FASE 11 — INTERNACIONALIZACIÓN (i18n)

*Una vez que la base es consistente, se puede bifurcar por idiomas sin riesgo.*

### 11.0 Principio del ID Invariante
- [ ] Documentar y aplicar: `metadata.id`, `targetId`, `links`, MSC2020 nunca se traducen
- [ ] Verificar que ningún componente usa cadenas traducibles como clave
- [ ] Asegurar que `validate-logical-graph.ts` ignora locale

### 11.1 Bifurcación del sistema de archivos MDX
- [ ] Reestructurar `src/content/` → `src/content/es/`, `src/content/en/`, `src/content/eu/`
- [ ] Migrar MDX existentes a `src/content/es/`
- [ ] Adaptar `import.meta.glob` para cargar desde el locale activo
- [ ] Traducir title, description y cuerpo a inglés y euskera
- [ ] Decidir si `taxonomyData.ts` se traduce

### 11.2 Grafos paralelos
- [ ] Evaluar Opción A (monolítico) vs **Opción B** (grafos paralelos por idioma)
- [ ] Implementar en `validate-logical-graph.ts`
- [ ] Adaptar GraphWorker para cargar grafo del locale activo
- [ ] Verificar topología idéntica entre idiomas

### 11.3 Gestión de estado global
- [ ] Instalar e integrar `i18next` + `react-i18next`
- [ ] Crear archivos `locales/{es,en,eu}/common.json`
- [ ] Añadir `locale` a Zustand store
- [ ] Conectar cambio de idioma: i18next → ContentStore → GraphWorker
- [ ] Selector de idioma en la interfaz

### 11.4 LaTeX y geometría
- [ ] Documentar guía de traducción matemática (LAL→SAS, ALA→ASA, \text{sen}→\sin)
- [ ] Aplicar guía a MDX traducidos
- [ ] Nota aclaratoria en glosario si se mantiene notación de Hilbert

---

## FASE 12 — POLISH VISUAL Y CALIDAD

*Pulir la interfaz para que esté lista para usuarios reales.*

### 12.1 Mejoras de UI
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

### 12.2 Diseño responsive y móvil
- [ ] **Grafo:** nodos reducidos, panel lateral → modal, selector de modelos → bottom sheet
- [ ] **Editor:** modo lectura forzado o editor texto plano en móvil, preview fullscreen
- [ ] **Páginas:** SimulationLayout apilado, BiographyLayout colapsable — **cambiado a `flex-col lg:flex-row` + padding responsive**, MarginaliaPanel → modal, SearchOmnibar usable en teclado móvil
- [ ] **Tablas y fórmulas LaTeX:** scroll horizontal — **`overflow-x: auto` en `.katex-display, .katex`**

### 12.3 Accesibilidad (a11y)
- [ ] **Contenido matemático:** `aria-label` en fórmulas KaTeX, explorar MathML, `alt` text en diagramas
- [ ] **Teclado:** grafo navegable con Tab/Enter/Escape, focus trap en modales, skip-to-content link
- [ ] **ARIA:** roles navigation/main, aria-expanded en paneles, aria-live en zonas dinámicas, aria-label en ThemeToggle
- [ ] **Contraste:** verificar WCAG AA con paleta Arts & Crafts, dificultad no solo por color, modo alto contraste opcional

### 12.4 Exportación e impresión
- [ ] `@media print` en CSS (ocultar navegación, MarginaliaPanel, etc.)
- [ ] Forzar modo claro en impresión
- [ ] Botón "Imprimir / Exportar PDF" en páginas de contenido
- [ ] PDF server-side con puppeteer (opcional)

---

## FASE 13 — LANZAMIENTO

*Poner el proyecto en producción.*

- [x] Decidir plataforma de hosting (GitHub Pages — `homepage` en `package.json`)
- [ ] Configurar dominio personalizado
- [x] SPA redirects (`cp dist/index.html dist/404.html` en build)
- [x] Build optimizado (`tsc -b && vite build`)
- [ ] CI/CD con GitHub Actions (build automático en push a main)
- [ ] Script de prebuild: solo `validate-logical-graph.ts`, falta `validate-cross-references.ts`
- [ ] Verificar assets estáticos en build
- [ ] Probar build en producción localmente

