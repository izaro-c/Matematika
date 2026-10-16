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
- [ ] 2.3 🔧 Migración por lotes, una carpeta por sesión: (a) `ui/page`, `ui/landing` y `ui/workbench`; (b) `ui/panels`, `ui/toolbar`, `ui/blocks` y `ui/components`; (c) `diagrams/ui/**`; (d) los mensajes de `useEditorCore.ts`.
- [ ] 2.4 🔧 Revisión del euskera de las claves nuevas (memoria *basque-i18n-care*: `-ko` delante del sustantivo y sin sufijos pegados a numerales en las plantillas).

Decisiones tomadas en 2.1:
- Las claves planas que ya había en `editor.*` se han agrupado en áreas: `common`, `nav`, `landing`, `create`, `mdx`, `diagram` y `save`. Las llamadas usan una sola cadena con puntos (`t('editor.save.saving')`), lo que facilita el script de 2.2. El área `errors` se crea cuando llegue su primera clave (2.3d).
- Contrato en `types/editorMessage.ts`: `EditorMessage { code, params? }`, con `code` tipado a partir del diccionario (`EditorMessageCode`, relativo a `editor.`); `EditorText = EditorMessage | string` (la cadena suelta es la forma heredada, sin traducir) y `translateEditorText(t, text)` en la interfaz.
- Plurales y variantes documento/diagrama: se elige el código (`…One`/`…Other`, `document…`/`diagram…`), nunca se concatenan palabras.
- Implementación de referencia: `save/saveCapability.ts` (resumen, botón de guardar y confirmación de avisos), con sus consumidores (`MdxWorkbenchHeader`, `WorkbenchHeader`, `MdxWorkbench` y `DiagramWorkbench`). `useEditorCore` (`message` y `SaveAttemptResult.reason`) sigue con cadenas: lo migra la 2.3(d).
- Se ha añadido la clave que faltaba, `editor.mdx.toolbar` (la usaba `MdxFormatBar`). La convención está resumida en `src/fixed-pages/editor/README.md`.

Decisiones tomadas en 2.2:
- Análisis con el AST de TypeScript (no regex): texto JSX y atributos `title`, `placeholder`, `aria-label`, `alt`, `label`, `description`, `tooltip`, además de literales como hijos (`{cond ? 'a b' : 'c d'}`). Cubre `ui/**` y `diagrams/ui/**`.
- Lista de excepciones = `scripts/editor/hardcoded-strings-baseline.json` (archivo → nº de literales; ahora 84 archivos y 1335 literales, más que el cálculo inicial porque cuenta también `diagrams/ui` y los atributos con condicionales o plantillas). Solo puede bajar (`--update` rechaza subirlo salvo `--allow-growth`); tras cada lote de 2.3 ejecutar `npm run editor:i18n:baseline`.
- Integrado en `npm run editor:safety:check`.

Archivos: `src/i18n/types.ts`, `src/i18n/languages/{es,eu,en}.ts` y la carpeta del lote. ⚠️ Esos archivos tienen ahora cambios sin confirmar (barra lateral axiomática): haz el commit antes de empezar.

## Fase 3 — Contenido multilingüe 🧠 (2 sesiones)

Distinguir siempre el **idioma de la interfaz** (`:lang` de la URL) del **idioma del documento** (`lang` del frontmatter o de la carpeta).

- [ ] 3.1 Modelo `conceptVersions(id) → { es?: path, eu?: path, en?: path }` construido a partir de la lista de archivos (un mismo `id` en `content/mdx/{es,eu,en}`).
- [ ] 3.2 Dividir `EditorLanguageBadges` en dos componentes: `UiLanguageSwitch` (cambia `:lang` sin cerrar el documento) y `DocumentVersions` (salta a otra versión, crea una traducción y muestra el estado: existe / falta / desfasada).
- [ ] 3.3 Vista de traducción en paralelo: original a la izquierda (solo lectura) y destino a la derecha, alineados por bloque, con un aviso cuando hay bloques sin traducir.
- [ ] 3.4 Diagramas: el selector de variante de idioma de las etiquetas usa el mismo componente `DocumentVersions`.

## Fase 4 — Interfaz uniforme 🧠 + 🔧 (2–3 sesiones)

- [ ] 4.1 🧠 Primitivas en `src/fixed-pages/editor/ui/primitives/` (`Button`, `IconButton`, `SegmentedControl`, `Panel`, `PanelHeader`, `Field`, `Tabs`, `Modal` y `Toast`), con el estilo de libro antiguo de `paleta-y-estilos.md` (memorias *ui-panel-style* y *diagram-style-coherence*; nada de *eyebrows* ni de una pista bajo cada título). Unificar con `diagrams/ui/primitives`.
- [ ] 4.2 🧠 Esquema único de la página: barra superior (ruta del documento, versiones, estado de guardado y acciones), barra lateral izquierda (archivos), centro (lienzo), inspector a la derecha y panel inferior de diagnósticos. Igual para MDX y para diagramas.
- [ ] 4.3 🔧 Migrar componentes a las primitivas y, de paso, **partir** los archivos de más de 700 líneas (`MdxWorkbench`, `DiagramWorkbench`, `GroupsAndLayersManager` y `VisualEditorPanel`) en subcomponentes y hooks.

## Fase 5 — Editor MDX: funciones y UX (por priorizar, 1 sesión cada una)

- [ ] 5.1 Paleta para insertar bloques (`/` o un botón «+» entre bloques) con todos los tipos (definición, teorema, demostración, ejercicio, `Simulation`, `VisualBind`…).
- [ ] 5.2 Arrastrar para reordenar bloques y mover secciones.
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
