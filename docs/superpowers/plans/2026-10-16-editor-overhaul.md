# Plan: reforma del editor (MDX + diagramas)

> **Cómo usar este plan (ahorro de créditos)**
> - **Una fase (o subfase) por sesión.** Empieza con `/clear` y escribe: *"Implementa la fase N de docs/superpowers/plans/2026-10-16-editor-overhaul.md"*. El plan sirve de memoria: no hace falta volver a explorar.
> - Lee **solo** los archivos listados en «Archivos». Para el resto, `codebase-memory` (`search_graph`, `get_code_snippet`), nunca lecturas completas de archivos de más de 1000 líneas.
> - Fases mecánicas (marcadas 🔧) → modelo barato (`/model sonnet`). Fases de diseño (marcadas 🧠) → Opus.
> - Verificación: `npm run typecheck` + `npx vitest run tests/features/editor/<área>` + `npm run editor:safety:check`. Nunca la suite completa.
> - Al terminar: marca las casillas, añade una línea en «Registro» y haz un commit por fase.

## Diagnóstico (2026-10-16)

| Problema | Evidencia |
|---|---|
| La URL no guarda estado | Las rutas son solo `/:lang/editor` y `/editor` (`src/app/routes/AppRouter.tsx:340`). El archivo abierto, el modo y la superficie de diagrama viven en `useState` (`ui/page/useEditorNavigationFlow.ts`), así que al recargar se vuelve al inicio. |
| i18n de la interfaz casi inexistente | Solo 11 de 110 `.tsx` del editor usan traducciones; hay unas 420 cadenas en castellano escritas a mano, incluidos los mensajes del motor (`session/useEditorCore.ts`). |
| Se confunden el idioma de la interfaz y el del contenido | `EditorLanguageBadges` mezcla los modos «global», «document» y «diagram»; las traducciones de un documento no están enlazadas como versiones de un mismo concepto. |
| La interfaz no es uniforme | Cada componente lleva sus propias cadenas largas de Tailwind (por ejemplo, `EditorLanguageBadges.tsx`), sin primitivas compartidas. |
| Archivos gigantes | `MdxWorkbench.tsx` (1112 líneas), `DiagramWorkbench.tsx` (1096), `GroupsAndLayersManager.tsx` (1028), `VisualEditorPanel.tsx` (716) y `useEditorCore.ts` (646) son caros de leer y de modificar. |
| Funciones pendientes | Están en `docs/TODO.md`: bloques MDX y páginas, edición de ReferenceID en diagramas y URLs legibles. |

## Orden y razón

1 → 2 → 3 son la base: la URL y la i18n afectan a todos los componentes, y conviene arreglarlas **antes** de rediseñar la interfaz para no tocar cada archivo dos veces. Las fases 5 y 6 (funciones) llegan después, sobre primitivas ya limpias.

---

## Fase 1 — La URL como fuente de verdad 🧠 (1 sesión)

Objetivo: `/:lang/editor/:tipo/:slug?vista=visual|codigo|dividida&bloque=<id>`, y para diagramas `/:lang/editor/diagrama/:id?paso=N&volver=<ruta>`. Recargar, atrás/adelante y copiar el enlace deben llevar al mismo sitio.

- [x] 1.1 Añadir rutas hijas en `AppRouter.tsx` (con `/editor` sin idioma → redirección a `/:lang/editor`).
- [x] 1.2 `editorNavigationModel.ts`: funciones puras `editorUrlFromState(state)` y `editorStateFromUrl(location, files)`, con pruebas unitarias.
- [x] 1.3 `useEditorNavigationFlow.ts`: sustituir `currentFile`, `diagramSurfaceOpen` y `diagramReturnContext` por la lectura y escritura de la URL (`useNavigate` / `useSearchParams`). `openFileSafely` hace `navigate`.
- [x] 1.4 Avisar de cambios sin guardar también al usar atrás/adelante (`useUnsavedChangesGuard.ts` + `useBlocker`, o un equivalente).
- [x] 1.5 Ruta inexistente → estado vacío con un mensaje, no la portada.

Decisiones tomadas al implementarla:
- El idioma del documento va **en la ruta**: `/:lang/editor/:docLang/:tipo/:slug` (`:tipo` = carpeta, p. ej. `definitions`). Como `setLang` conserva la ruta pero descarta los parámetros, un `?idioma=` se perdería al cambiar el idioma de la interfaz y abriría otro archivo.
- `vista=visual|codigo|previa` (no hay vista dividida; `previa` es la vista previa publicada). `editar=diagrama` abre la superficie de diagrama sobre la página, y `bloque` indica el bloque.
- wouter no tiene `useBlocker`: el aviso con atrás/adelante escucha `popstate` en captura, restaura la URL anterior y pide confirmación (`editorDocumentKey` ignora vista, bloque y paso).
- Cambiar de versión de idioma ya no cambia el idioma de la interfaz (anticipa la fase 3).
- `paso` se sincroniza con el paso del diagrama en la página; el paso interno de `DiagramWorkbench` queda para la 6.3.
- El mensaje de «no encontrado» está escrito a mano en castellano: lo migra la fase 2.

Archivos: `src/app/routes/AppRouter.tsx`, `ui/page/useEditorNavigationFlow.ts`, `session/editorNavigationModel.ts`, `ui/page/useUnsavedChangesGuard.ts`, `ui/page/EditorPage.tsx`. Pruebas: `tests/features/editor/navigation/`.

## Fase 2 — i18n de la interfaz del editor (3–4 sesiones cortas)

- [x] 2.1 🧠 Convención: espacio de nombres `editor.*` en `src/i18n/types.ts`, dividido por áreas (`editor.nav`, `editor.mdx`, `editor.diagram`, `editor.save`, `editor.errors`). El motor (`session/`, `save/`, `document/`) devuelve **códigos** (`{ code: 'save.noChanges', params }`) en lugar de frases, y la interfaz los traduce.
- [x] 2.2 🔧 Script de protección `scripts/editor/check-hardcoded-strings.ts` (o una regla de `editor:safety:check`) que falle con literales visibles en JSX bajo `src/fixed-pages/editor/ui/**`. Al principio admite una lista de excepciones y la lista va encogiendo.
- [x] 2.3 🔧 Migración por lotes, una carpeta por sesión: (a ✅) `ui/page`, `ui/landing` y `ui/workbench`; (b ✅) `ui/panels`, `ui/toolbar`, `ui/blocks` y `ui/components`; (c ✅) `diagrams/ui/**`; (d ✅) los mensajes de `useEditorCore.ts`.
- [ ] 2.4 🔧 Revisión del euskera de las claves nuevas (memoria *basque-i18n-care*: `-ko` delante del sustantivo y sin sufijos pegados a numerales en las plantillas).

Decisiones tomadas en 2.1:
- Las claves planas que ya había en `editor.*` se han agrupado en áreas: `common`, `nav`, `landing`, `create`, `mdx`, `diagram` y `save`. Las llamadas usan una sola cadena con puntos (`t('editor.save.saving')`), lo que facilita el script de 2.2. El área `errors` se crea cuando llegue su primera clave (2.3d).
- Contrato en `types/editorMessage.ts`: `EditorMessage { code, params? }`, con `code` tipado a partir del diccionario (`EditorMessageCode`, relativo a `editor.`); `EditorText = EditorMessage | string` (la cadena suelta es la forma heredada, sin traducir) y `translateEditorText(t, text)` en la interfaz.
- Plurales y variantes documento/diagrama: se elige el código (`…One`/`…Other`, `document…`/`diagram…`), nunca se concatenan palabras.
- Implementación de referencia: `save/saveCapability.ts` (resumen, botón de guardar y confirmación de avisos), con sus consumidores (`MdxWorkbenchHeader`, `WorkbenchHeader`, `MdxWorkbench` y `DiagramWorkbench`). `useEditorCore` se migró en la 2.3(d): `message`, `filesError`, `SaveAttemptResult.reason` y `persistenceLabel` devuelven `EditorMessage`.
- Se ha añadido la clave que faltaba, `editor.mdx.toolbar` (la usaba `MdxFormatBar`). La convención está resumida en `src/fixed-pages/editor/README.md`.

Decisiones tomadas en 2.2:
- Análisis con el AST de TypeScript (no regex): texto JSX y atributos `title`, `placeholder`, `aria-label`, `alt`, `label`, `description`, `tooltip`, además de literales como hijos (`{cond ? 'a b' : 'c d'}`). Cubre `ui/**` y `diagrams/ui/**`.
- Lista de excepciones = `scripts/editor/hardcoded-strings-baseline.json` (archivo → nº de literales; ahora 84 archivos y 1335 literales, más que el cálculo inicial porque cuenta también `diagrams/ui` y los atributos con condicionales o plantillas). Solo puede bajar (`--update` rechaza subirlo salvo `--allow-growth`); tras cada lote de 2.3 ejecutar `npm run editor:i18n:baseline`.
- Integrado en `npm run editor:safety:check`.

Decisiones tomadas en 2.3(a):
- Quedaban 5 archivos con literales (`EditorNavigation`, `EditorShell`, `EditorLanguageBadges`, `EditorWorkbenchHeader`, `MdxWorkbenchHeader`); `ui/landing` ya estaba limpia. Baseline: 1289 literales en 80 archivos.
- Área nueva `editor.language` (versiones, idioma activo, cambiar, crear traducción…), pensada para los componentes de la fase 3.2; claves nuevas en `nav` y `common` (errores/avisos con parámetros). `landing.needsFixing` conserva el texto «Requiere corrección».
- Pendiente de 2.3(b)/(d): `title` de `ResourceButton` (`file.capabilityLabel` y `file.reason`, vienen del modelo) y los textos de `editorPageModel`/`useEditorNavigationFlow`, que no son JSX y el script no los ve.
- Las claves en euskera están sin revisar: las revisa la 2.4.

Archivos: `src/i18n/types.ts`, `src/i18n/languages/{es,eu,en}.ts` y la carpeta del lote. ⚠️ Esos archivos tienen ahora cambios sin confirmar (barra lateral axiomática): haz el commit antes de empezar.

## Fase 3 — Contenido multilingüe 🧠 (2 sesiones)

Distinguir siempre el **idioma de la interfaz** (`:lang` de la URL) del **idioma del documento** (`lang` del frontmatter o de la carpeta).

- [x] 3.1 Modelo `conceptVersions(id) → { es?: path, eu?: path, en?: path }` construido a partir de la lista de archivos (un mismo `id` en `content/mdx/{es,eu,en}`).
- [x] 3.2 Dividir `EditorLanguageBadges` en dos componentes: `UiLanguageSwitch` (cambia `:lang` sin cerrar el documento) y `DocumentVersions` (salta a otra versión, crea una traducción y muestra el estado: existe / falta / desfasada).
- [x] 3.3 Vista de traducción en paralelo: original a la izquierda (solo lectura) y destino a la derecha, alineados por bloque, con un aviso cuando hay bloques sin traducir.
- [x] 3.4 Diagramas: el selector de variante de idioma de las etiquetas usa el mismo componente `DocumentVersions`.

Decisiones tomadas en la fase 3:
- Modelo en `session/conceptVersions.ts`: `buildConceptIndex(files)` (clave `tipo:id`), `conceptVersions(files, id, type?)`, `documentVersionStatuses` y `translationOriginLang`. Sustituye las tres copias que había (`EditorNavigation`, `MdxWorkbench` y `useEditorLanding`). El idioma de referencia es `es`.
- «Desfasada» = el esquema de bloques (`FileNode.outline`, de `documentOutline` en `save/catalogNode.ts`) no coincide con el del castellano. El esquema cuenta títulos y las etiquetas de bloque de las líneas que empiezan en la columna 0 por un bloque (todas las de la línea, salvo las que van dentro de llaves); `ConceptLink`, `VisualBind` y `Capitular` son de línea y no cuentan (en euskera cambian de posición). En el corpus actual: 240 pares y ninguno desfasado. No hay fechas en el catálogo y las de git no son fiables.
- `EditorLanguageBadges` eliminado: `UiLanguageSwitch` usa `setLang(code, { keepSearch: true })` (opción nueva de `I18nContext`) para conservar la vista y el bloque, y está en la portada y en la cabecera MDX (`xl`). `DocumentVersions` recibe `DocumentVersion[]` y marca las desfasadas con un punto ocre.
- Vista de traducción: `vista=traduccion&desde=<idioma>` (pestaña «Traducir», visible si existe otra versión). `session/translationAlignment.ts` empareja los bloques por su forma (tipo, componente y nivel) con la subsecuencia común más larga. Estados: traducido, sin traducir (texto idéntico, como al crear la traducción), sin texto (fórmulas), falta y sobra. El original se lee con `useDocumentVersionBlocks`, al margen de la sesión de edición. A la derecha, la prosa (párrafo, título, lista, nota y cita) se edita en un `textarea` que confirma al perder el foco; el resto de bloques se abre en la vista visual.
- Diagramas: `diagramVersionStatuses` (`diagrams/model/scene/translationStatus.ts`) aplica el mismo contrato (el castellano siempre existe y otro idioma existe si `translations[lang]` tiene texto). Un idioma que falta se ofrece como «+EU», y al pulsarlo se empieza a traducir en ese idioma.
- `mapProjectedBlocks` se ha movido a `session/blockView.ts`.

## Fase 4 — Interfaz uniforme 🧠 + 🔧 (2–3 sesiones)

- [x] 4.1 🧠 Primitivas en `src/fixed-pages/editor/ui/primitives/` (`Button`, `IconButton`, `SegmentedControl`, `Panel`, `PanelHeader`, `Field`, `Tabs`, `Modal` y `Toast`), con el estilo de libro antiguo de `paleta-y-estilos.md` (memorias *ui-panel-style* y *diagram-style-coherence*; nada de *eyebrows* ni de una pista bajo cada título). Unificar con `diagrams/ui/primitives`.
- [x] 4.2 🧠 Esquema único de la página: barra superior (ruta del documento, versiones, estado de guardado y acciones), barra lateral izquierda (archivos), centro (lienzo), inspector a la derecha y panel inferior de diagnósticos. Igual para MDX y para diagramas.
- [x] 4.3 🔧 Migrar componentes a las primitivas y, de paso, **partir** los archivos de más de 700 líneas (`MdxWorkbench`, `DiagramWorkbench`, `GroupsAndLayersManager` y `VisualEditorPanel`) en subcomponentes y hooks.

Decisiones tomadas en 4.1:
- Elegido por la autora: botones de «rótulo impreso» (un filete, versalitas en Garamond, ☞ solo en el primario) y el activo de `SegmentedControl` como «índice con manícula» (`☞ Visual · Código · Previa`, subrayado fino); `Tabs` = rúbricas sobre un filete con la activa subrayada.
- La piel vive en `src/app/styles/editor-primitives.css` (clases `.ed-*`, capa `components`), no en cadenas de Tailwind; así las utilidades de Tailwind siguen pudiendo sobrescribirla. Altura de control 2.25rem (1.75rem en `sm`), que sube a `--target-min` con `pointer: coarse`.
- `Button` (`primary|secondary|danger|quiet`, `aria-pressed` vuelve la manícula ☜), `IconButton` (exige `label`, que es nombre accesible y título), `SegmentedControl` (grupo de radio con flechas), `Tabs` (`tabs` con flechas y `aria-selected`; `nav` con `aria-current`), `Panel`/`PanelHeader` (rúbrica + aparte en cursiva con cifras elzevirianas + acciones; plegable con `<details>`; un filete entre paneles seguidos), `Field` (enlaza etiqueta, ayuda y error con `aria-describedby`/`aria-invalid`), `Modal` (portal + `useModalFocus`, `dismissible`) y `Toast`/`ToastRegion` (el tono solo tiñe el filete y el título; `error` → `role="alert"`). Sin claves i18n nuevas: «Cerrar» = `editor.common.close`.
- `diagrams/ui/primitives` son ahora envoltorios finos con la API antigua (`DiagramButton` → `success`/`warning` pasan a `primary`, `ghost` a `quiet`; `DiagramPanel.badge` → `meta`; `diagramControlClassName` = `controlClassName`). `DiagramFormField` usa `ed-control` y `ed-field__label`. Corregido de paso: el `defaultOpen` de `DiagramPanel` no tenía efecto (React no lo admite en `<details>`).
- Comprobado con capturas de Puppeteer (claro y oscuro) sobre una muestra provisional; la vista real del editor cambia sobre todo en la 4.3, al migrar los componentes.

Decisiones tomadas en 4.2:
- `ui/page/EditorShell.tsx` es el único esquema y lo usan `MdxWorkbench` y `DiagramWorkbench` (este ya no repite separadores ni `<main>`/`<aside>`). Las ranuras son `header`, `toolbar` (formato MDX o herramientas de diagrama), `navigation`, `children` (lienzo), `inspector` y `diagnostics`; `mainLabel` da nombre al lienzo. Se quitan `subToolbar` y `safetySummary`, y `persistPanelSizes` pasa a ser opcional porque las preferencias ya se guardan al cambiar.
- El panel de avisos va **bajo el lienzo** y no a todo el ancho, para que el explorador y el inspector conserven toda la altura. Ya no es una pestaña del inspector (desaparecen `avisos` en MDX y `diagnostics` en diagramas): el botón «Avisos» de la cabecera lo abre y lo cierra (`aria-expanded`). Su altura se guarda en `workspace.diagnosticsHeight`, también en la superficie de diagrama. Al pulsar un aviso de diagrama se abre el inspector en «Propiedades».
- `ui/workbench/DiagnosticsDock.tsx` pone la rúbrica común (`PanelHeader`: «Avisos» + recuento + cerrar). `EditorDiagnosticsPanel embedded` ya no lleva título propio. `WorkbenchDiagnosticsPanel` conserva su tarjeta de introducción hasta la 4.3.
- Ruta del documento: `documentPathCrumbs(path)` (en `editorNavigationModel.ts`) muestra solo las carpetas, sin `content/mdx` ni el idioma, que ya aparece en las versiones; el nombre se omite porque el campo del título va justo después (si no, el lector de pantalla lo leería dos veces). Se ve en cursiva delante del título (`EditorWorkbenchHeader.pathCrumbs`, a partir de `md`). Los diagramas en línea o nuevos no tienen ruta.
- Barra lateral izquierda en diagramas: sigue siendo `DiagramDataPanel` (o `leftPanel`), no el árbol de archivos. Mientras se edita un diagrama de una página, salir a otro archivo rompería el retorno.
- Claves nuevas: `editor.nav.documentPath`, `warnings` y `hideWarnings`. Se eliminan las que quedaron sin uso: `mdx.warningsTab`, `diagramWorkbench.{tabWarnings,resizeExplorer,resizeInspector,detailsPanel}` y `diagnostics.{embeddedTitle,noProblems,problemsOne,problemsOther}`.
- Comprobado con Puppeteer en una página MDX y en la superficie de diagrama, con el panel de avisos abierto.

Decisiones tomadas en 4.3:
- Se parten los cuatro archivos, sin cambiar su comportamiento: `MdxWorkbench` 1199 → 675 líneas, `DiagramWorkbench` 1088 → 685, `GroupsAndLayersManager` 1030 → 94 y `VisualEditorPanel` 718 → 518.
- `MdxWorkbench`: hooks en `ui/workbench/mdx/` (`useDocumentVersionsFlow`, `useDocumentSave`, `useDiagramStepState`, `useBlockSelection`, `useSemanticLinker`, `useDiagramEditorSession`), el módulo puro `issueBlockTarget.ts` y el componente `MdxWorkbenchDialogs`.
- `DiagramWorkbench`: `useDiagramAuthoringActions`, `useDiagramSaveFlow`, `useDiagramDeletion`, y los componentes `DiagramInspectorTabs` y `DiagramWorkbenchDialogs`.
- `GroupsAndLayersManager`: queda la cabecera y el selector; cada pestaña es `LayersTab` o `GroupsTab` (con su estado y sus acciones) y `sceneStack.ts` guarda las funciones puras.
- `VisualEditorPanel`: `VisualEditorHeader`, `VisualEditorStates` (esqueleto y página vacía), `StepAssignmentBar` y `BlockCommandPalette`.
- Migración a primitivas **parcial**: solo se usó `Button` en los componentes nuevos (página vacía, asignación de pasos, paleta). El resto de los botones y paneles de esos archivos conserva sus cadenas de Tailwind y queda para una pasada posterior.
- Sin claves i18n nuevas. Pruebas de `tests/features/editor` en verde (866), `typecheck` y `editor:safety:check` sin avisos.

## Fase 5 — Editor MDX: funciones y UX (por priorizar, 1 sesión cada una)

- [x] 5.1 Paleta para insertar bloques (`/` o un botón «+» entre bloques) con todos los tipos (definición, teorema, demostración, ejercicio, `Simulation`, `VisualBind`…).
- [x] 5.2 Arrastrar para reordenar bloques y mover secciones.

Decisiones tomadas en 5.1:
- Catálogo único en `ui/panels/blockCatalog.ts` (sustituye a `GENERAL_BLOCK_PRESETS`/`PAGE_PROFILE_PRESETS`): grupos «Propios de esta página», «Texto», «Matemáticas», «Ejercicios», «Diagrama» y «Dentro del texto». Cada entrada lleva su etiqueta como código i18n (área nueva `editor.palette`), la sintaxis MDX que escribe y palabras clave en los tres idiomas; la búsqueda ignora tildes y pone primero las etiquetas que empiezan por la consulta.
- Acciones: `block` (inserta con `addBlock`), `diagram` (abre el constructor de diagramas en el hueco: la `Simulation` de la página o una figura) e `inline` (`VisualBind`, fórmula en línea: van al cursor de la prosa activa, que se guarda al abrir la paleta; sin prosa activa, en un párrafo nuevo). Nuevos tipos: apartado (`####`), lista numerada, enunciado (`<Definicion title="Enunciado">`), `StepSection`, `Pregunta`, `Apoyo` y `ErrorComun`.
- Tres maneras de abrirla: `Ctrl+/` (junto a la selección), `/` sobre un bloque enfocado o en una prosa vacía (tras ese bloque) y el ＋ del filete entre bloques y al principio (`BlockInsertGap`). El botón «Insertar bloque» de `MdxFormatBar` abre la misma paleta; desaparecen su desplegable y `BlockInsertMenu`.
- La paleta usa `Modal` y el patrón combobox (`aria-activedescendant`, flechas, Enter); la opción activa lleva la manícula ☞ (`.ed-palette__*` en `editor-primitives.css`).
- `VisualBind` es ahora una ficha en la prosa (`parseInlineNodes` → `interactiveElement` con `tag: 'VisualBind'`), sin pérdidas gracias a `raw`; al editarla, `SemanticLinker` la reescribe como `VisualBind`. Pendiente para la 5.4: el resaltado nuevo (`buildInteractiveReference` y el enlace «gráfico» del selector) sigue escribiendo `<InteractiveElement target>`, que no usa ningún MDX del corpus.
- El texto inicial de los bloques sigue en castellano, aunque el documento esté en otro idioma.

Decisiones tomadas en 5.2:
- Motor: `document/relocationOperations.ts`. Un traslado corta el código y lo pega byte a byte (dos `SourceEdit` de una sola operación); solo cambian los huecos de al lado. `BlockContainer` guarda ahora `range` y `parentId`, así que un `StepSection` se mueve como una unidad y un bloque puede entrar o salir de él. Se rechaza vaciar un contenedor JSX y soltar un bloque dentro de sí mismo.
- Sección = un título y lo que le sigue hasta el siguiente título del mismo nivel o superior (subapartados y `StepSection` incluidos): `sectionBlockIds`, `planSectionRelocation` y `planSectionStep` (intercambia la sección con la vecina).
- Interfaz: un asa en el margen de cada bloque (⠿; § en los títulos, que arrastran su sección entera), un filete canela de destino (mitad superior = antes, inferior = después) y los bloques que se mueven atenuados. Los grupos de demostración son destinos, pero sus pasos se siguen moviendo con sus controles. Teclado: `Alt+↑/↓` mueve el bloque (como antes) y `Alt+Mayús+↑/↓` mueve la sección de un título.
- `useEditorCore` expone `relocateBlock`, `relocateSection`, `stepSection` y `sectionBlocks`; aviso nuevo `notices.sectionMoved`.
- No se ha probado a mano en el navegador.

- [ ] 5.3 LaTeX en línea con vista previa en directo y errores de KaTeX señalados.
- [ ] 5.4 Selector de enlaces y referencias (`SemanticLinker`): búsqueda por título en los tres idiomas y aviso de IDs inexistentes (TODO: «link ez ebatziak»).
- [ ] 5.5 Panel de validación: clic en un error → salta al bloque o a la línea.
- [ ] 5.6 Recuperación de borradores tras recargar, que ya funcionará con la fase 1.
- [ ] 5.7 Atajos de teclado y una hoja de ayuda (`?`).

## Fase 6 — Editor de diagramas: funciones y UX (por priorizar)

- [ ] 6.1 Editar ReferenceID desde el inspector (TODO), con un aviso de los MDX que lo usan.
- [ ] 6.2 Herramientas: modo activo visible, ajuste a la cuadrícula y a los puntos, y `Esc` para cancelar.
- [ ] 6.3 Editor de pasos: línea de tiempo, previsualización del paso y vínculo con `VisualBind`.
- [ ] 6.4 Deshacer/rehacer unificado entre el lienzo y el inspector.
- [ ] 6.5 Estado vacío y plantillas (triángulo, circunferencia, rectas paralelas).

## Fase 7 — Cierre

- [ ] 7.1 Revisión de accesibilidad (`design:accessibility-review`): foco, teclado y contraste.
- [ ] 7.2 Prueba E2E mínima: abrir un documento → editar → recargar → seguir en el mismo sitio → guardar.
- [ ] 7.3 Actualizar `docs/architecture/editor-engine.md` y `docs/TODO.md`.

## Registro

| Fecha | Fase | Commit | Notas |
|---|---|---|---|
| 2026-10-16 | 1 | (este commit) | URL como fuente de verdad; pruebas en `tests/features/editor/navigation/editorUrlModel.test.ts`. Falta probarla a mano en el navegador. |
| 2026-10-16 | 2.1 | (este commit) | Claves `editor.*` agrupadas por áreas; `EditorMessage` y `translateEditorText`; `saveCapability` migrado. Pruebas en `tests/features/editor/i18n/`. |
| 2026-10-16 | 2.2 | (este commit) | `scripts/editor/check-hardcoded-strings.ts` + baseline; integrado en `editor:safety:check`. Pruebas en `tests/features/editor/i18n/`. |
| 2026-10-16 | 2.3(a) | (este commit) | `ui/page` y `ui/workbench` migrados; área `editor.language`. |
| 2026-10-16 | 2.3(b) | (este commit) | `ui/panels`, `ui/toolbar`, `ui/blocks` y `ui/components` migrados; áreas `blocks`, `stepLink`, `linker`, `metadata`, `source`, `diagnostics`, `preview`, `exercise`, `registered`, `visual`, `format`, `diagramPanel`. Baseline 1289 → 1027. Pendiente: `visualEditorPresets.ts` y etiquetas de `metadataFields`. |
| 2026-10-16 | 2.3(c) | (este commit) | `diagrams/ui/**` migrado (baseline 1027 → 71; `diagrams/ui` a 0); áreas `diagramEditors`, `diagramCanvas`, `diagramConstraints`, `diagramInspector`, `diagramModals`, `diagramPanels`, `diagramScene`, `diagramToolbar`, `diagramWorkbench`, `diagramOptions`. Helpers `renderRichText` y `diagramLabels`. Fuera de alcance: etiquetas de historial deshacer/rehacer (no se muestran), valores por defecto guardados en el diagrama, y etiquetas del modelo (`COLOR_OPTIONS`, `toolReference*`, `constraintPresentation`, `useDiagramUsages`) para 2.3(d)/posterior. |
| 2026-10-16 | 2.3(d) | (este commit) | Mensajes de `useEditorCore` como códigos; áreas `errors`, `notices` (éxitos), `status` (estado de persistencia) y `usages`. `failureMessage`, `EditorMessageError` y `saveBlockedByValidation` compartidos; `translateText` obligatorio en `safetyPresentation`. Pruebas en `tests/features/editor/i18n/engineMessages.test.ts`. Pendiente: catálogo del servidor (`capabilityLabel`/`reason` en castellano), textos de `safetyPresentation`, `validation.issues` y `compatibilityReasons`, y `core.message` que ninguna interfaz muestra todavía. |
| 2026-10-19 | 3 | b148b8a0 | Contenido multilingüe: `conceptVersions`, `UiLanguageSwitch` + `DocumentVersions`, vista `traduccion` alineada por bloques y versiones de diagrama. Pruebas en `tests/features/editor/language/`. Falta probarla a mano en el navegador. |
| 2026-10-19 | 4.1 | 6e792010 | Primitivas en `ui/primitives/` + `editor-primitives.css`; `diagrams/ui/primitives` como envoltorios. Pruebas en `tests/features/editor/ui/primitives/`. |
| 2026-10-19 | 4.2 | 795ed6e3 | Esquema único `EditorShell` para MDX y diagramas; avisos en panel inferior (`DiagnosticsDock`); ruta del documento en la cabecera. Pruebas en `tests/features/editor/navigation/` (`EditorWorkspacePanels`, `editorUrlModel`), `workbench/EditorWorkbenchHeader` y `diagrams/workbench/DiagramWorkbench`. |
| 2026-10-19 | 4.3 | e310e5a3 | Partidos `MdxWorkbench`, `DiagramWorkbench`, `GroupsAndLayersManager` y `VisualEditorPanel` en hooks y subcomponentes; `Button` en los nuevos. |
| 2026-10-19 | 5.1 + 5.2 | (este commit) | Paleta de bloques sobre `blockCatalog` (`/`, `Ctrl+/` y ＋ entre bloques), `VisualBind` como ficha en la prosa; arrastre de bloques y secciones con `relocationOperations`. Pruebas en `tests/features/editor/document/relocationOperations.test.ts`, `ui/blockCatalog.test.ts` y `navigation/visualAuthoring.test.tsx`. |
