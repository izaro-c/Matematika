# Auditoría de UI y sistema de diseño (oct. 2026)

> Plan consolidado, decisiones y estado: [plan-ui-2026-10.md](plan-ui-2026-10.md).

Alcance: tokens (`src/app/theme.css`, `src/design/`), CSS de composición (`src/app/styles/`), componentes compartidos (`src/components/ui`), primitivas del editor (`src/fixed-pages/editor/ui/primitives`) y capturas reales (Puppeteer, claro/oscuro 1366 px y claro 390 px) de: home, glosario, historia, métodos, axiomas, grafo, teorema, demostración, definición, ejercicio, biografía, 404 y landing del editor.

Límites: no se ha probado navegación por teclado ni lector de pantalla en vivo, ni los paneles internos del editor (solo su landing). Las cifras salen de `grep` sobre `src/**/*.tsx|css` y de métricas DOM en las capturas; son órdenes de magnitud, no un linter.

**Puntuación: 72/100.** La identidad visual (libro antiguo, pigmentos, tipografía) es sólida y coherente en las páginas de contenido. Lo que resta puntos es que hay **dos sistemas de UI paralelos** (público `ac-*` y editor `ed-*`), una escala tipográfica que se ha disuelto en valores sueltos, y varios defectos concretos de maquetación y accesibilidad.

---

## 1. Lo que funciona (conservar)

- **Tokens de color únicos**: 7 pigmentos + `lienzo`/`carbon` con variantes claro/oscuro en `theme.css`; solo 1 `#hex` en TSX y 9 `rgb()` (todos en `Clasificador.tsx`). Casi cero paleta Tailwind cruda (1 `border-white`).
- **Tinta semántica con contraste documentado** (`--ink-text-muted` ≈ 6,3:1, `--ink-text-subtle` ≈ 5,1:1) y utilidades `.text-ink-*` que evitan opacidad alfa en texto.
- **Accesibilidad de base**: skip link, `--target-min: 44px`, `--focus-ring`, 131 usos de `focus-visible`, 0 botones sin nombre accesible en las 20 capturas, 0 scroll horizontal de página, un `h1` por página (salvo grafo).
- **Cabecera pública consistente** (logo, idioma, tema, búsqueda) y misma jerarquía en teorema/definición/ejercicio/biografía: miga, insignia de tipo, título en Fondamento, lead en cursiva, capitular.
- **Paridad i18n**: `es.ts`, `eu.ts`, `en.ts` tienen exactamente 2311 líneas.
- **Tema oscuro** bien resuelto: pigmentos reajustados por luminancia, no una simple inversión.

## 2. Hallazgos por prioridad

### P1 — Defectos visibles o de accesibilidad

| # | Hallazgo | Evidencia | Recomendación |
|---|---|---|---|
| 1 | **La cabecera global se superpone al diagrama** en páginas con diagrama a la derecha (demostración/teorema, ≥1024 px): idioma/tema/búsqueda tapan el subtítulo y el título del panel del diagrama. | `demo-dark-d.png`: el subtítulo "Recorre los pasos…" queda bajo el selector ES. | Reservar la franja de cabecera sobre la columna del diagrama (padding-top = alto de cabecera) o hacer la cabecera no flotante en `ContentLayout`. |
| 2 | **La barra de controles del diagrama recorta contenido**: "Inic…" (Inicio) y "Recuperar" cortados y casi ilegibles; se pierde en anchos medios. | `demo-dark-d.png`. | Permitir `flex-wrap` o plegar acciones secundarias en un menú; no usar `overflow: hidden` en la barra. |
| 3 | **Texto por debajo de 12 px en abundancia**: `text-[10px]` ×214, `text-[11px]` ×110, `text-[9px]` ×59, `text-[8px]` ×12 (≈395 usos). Elementos hoja <12 px: 369 en el editor, 80 en demostraciones, 45 en teoremas, 41 en el glosario, 31 en historia. | Métrica DOM de las capturas. | Mínimo 12 px (0,75 rem) para texto de lectura y de control; 11 px solo para numerales/metadatos no críticos. Ver P2-1. |
| 4 | **Objetivos táctiles pequeños**: 59 enlaces/botones <32 px en la home, 128 en el editor, 40 en el glosario, 57 en demostraciones; `--target-min` existe pero `.ac-hit-target` solo se aplica en algunos sitios. | Métrica DOM. | Aplicar `ac-hit-target` (o área de clic ampliada con `::after`) a iconos, chips y enlaces de índice; revisar primero móvil. |
| 5 | **Editor en móvil roto**: el logo flotante tapa "Documentos MDX", el selector EN queda fuera de pantalla, las pestañas de tipo se cortan sin indicio de scroll. Además la pestaña "Mdx authorin…" se trunca incluso en escritorio. | `editor-light-m.png`, `editor-light-d.png`. | Cabecera del editor con menú colapsable en <640 px; pestañas con degradado de borde o `scroll-snap` visible; truncar con `title`. |
| 6 | **El grafo no tiene `h1`** y la leyenda flotante tapa nodos; etiquetas de nodos solapadas ("Teoría de la medida" sobre "Teorema del área…"). | `grafo-dark-d.png`; métrica `h1: 0`. | `h1` visualmente oculto; leyenda plegable o anclada fuera del lienzo; colisión de etiquetas por prioridad/zoom. |
| 7 | **Cadenas de UI en español fijo** en componentes: `aria-label`/`title`/`placeholder` literales en `DiagramRenderer` ("Recuperar objetos fuera del viewport", "Restablecer vista inicial"), `AxiomaticTree` ("Abrir controles del grafo"), `SelectionLinkBubble`, `SaveErrorModal`, `CreateDiagramDialog`, `AddDiagramDialog`. En euskera e inglés esos controles se anuncian en español. | `grep` de atributos literales. | Pasarlas a `t()` en los tres idiomas (comprobar el euskera contra el español, ver [[basque-i18n-care]]). Los `placeholder` de id (`triangulo-pasos`) pueden quedarse. |

### P2 — Inconsistencias del sistema

| # | Hallazgo | Evidencia | Recomendación |
|---|---|---|---|
| 1 | **No hay escala tipográfica real**: tokens `--font-size-h1…h4` y utilidades `ac-label--2xs/xs/sm/md`, pero los componentes usan `text-[10px]`, `text-[11px]`, `text-[13px]`, `text-[15px]` junto a `text-xs/sm/base`. | 237 `text-xs`, 108 `text-sm` frente a ≈410 tamaños arbitrarios. | Definir en `@theme` `--text-2xs: 0.6875rem` y `--text-3xs` si se quiere conservar, y migrar los arbitrarios; prohibir `text-[Npx]` con una regla de lint. |
| 2 | **Dos sistemas de componentes**: público (`.ac-btn`, `.ac-label`, `UI.*`) y editor (`ed-button`, `ed-*`, `Button/Card/Modal/Panel/Tabs/Chip` en `editor/ui/primitives`). Mismos conceptos (botón, panel, chip, etiqueta), nombres y API distintos; `UI.btn*` solo aparece 15 veces mientras hay 82 `<button` crudos fuera de las primitivas (QuestionFeedback, ExerciseCard, StepNavigator, SearchOmnibar, DiagramRenderer…). | Recuentos de clases `ed-` (99) vs `ac-` (375). | Promover las primitivas a `src/components/ui/` (o `src/design/components`) y que el editor y el sitio las compartan; `ac-btn` pasa a ser su variante pública. Tarea grande: hacerlo por familias (Button → Chip → Panel). |
| 3 | **Chrome distinto entre editor y resto**: el editor tiene su propia cabecera (logo a la izquierda, navegación central, idiomas ES·EU·EN como texto) frente a la cabecera pública (idioma desplegable ES⌄, icono tema, icono búsqueda). El conmutador de idioma tiene dos presentaciones. | Capturas. | Unificar `LanguageToggle` (una variante compacta) y compartir `ThemeToggle`; o documentar que el editor es una "herramienta" con chrome propio y mantener solo una. |
| 4 | **Eyebrows y subtítulos bajo cada título** pese a la guía de estilo de paneles: 61 usos de `ac-eyebrow`/`UI.eyebrow*` (HistoryTimeline 5, MDXBlocks 4, ContentCard 3, Solucion 3, MethodsPage 3…), y las tarjetas de la home siguen el patrón "etiqueta / título / acción" (`Plan de estudio · Camino a Pitágoras · Acceder al plan`), "Sección I" sobre cada título de rama. | [[ui-panel-style]] pide evitarlos. | Revisar uno a uno: conservar solo los que añaden información (tipo de contenido, nº de sección con función de navegación). `ac-eyebrow` no debería ser la clase estándar. |
| 5 | **Formas que contradicen "libro antiguo"**: píldoras redondas (`rounded-full` ×47: controles del diagrama, `StepNavigator`, chips del editor, insignias de estado), 176 `rounded` por defecto, `rounded-xl/2xl` ×17; `shadow-xl/lg/md` ×29 junto a los tokens `--shadow-*`. Los controles de diagrama en píldora chocan con la regla "botón rectangular de una línea". | [[diagram-style-coherence]]; capturas de la demostración. | Elegir un radio (el token `--border-radius-base: 6px` existe pero casi no se usa: 26 `border-radius` en CSS) y retirar `rounded-full` de controles; sombras solo vía `--shadow-elegant/classic/parchment`. |
| 6 | **Título en versales/Title Case** en español: "Documentos Disponibles", "Nuevo Documento", "En Construcción", "Solución Detallada", "Justificaciones del Paso", "Período Clásico". El español usa mayúscula solo inicial; en el editor se mezcla con versalitas CSS. | `es.ts` 96, 142–161, 347–350. | Normalizar a mayúscula inicial en `es.ts` y dejar las versalitas al CSS. `resolutionExplained` y `explainedResolution` son claves duplicadas con el mismo texto: unificar. |
| 7 | **Controles nativos sin estilo** en el editor: `<select>` "Nombre" con esquinas redondeadas y flecha del sistema, discordante con el resto. | `editor-light-d.png`. | `Select` en las primitivas con el mismo trazo de una línea que `Field`. |
| 8 | **Duplicados de marca**: logo flotante arriba a la izquierda y logo grande centrado en la misma pantalla (glosario). Breadcrumb y enlace "← Teorema de…" duplican la navegación hacia atrás en la demostración y el ejercicio. | `diccionario-light-d.png`, `demo-*`. | Un solo mecanismo de retorno; quitar el logo centrado o el flotante según página. |
| 9 | **Búsqueda con tres estilos**: omnibar (icono), campo subrayado del glosario, campo con borde del editor/grafo. Placeholder del glosario con muy poco contraste. | Capturas. | Un `SearchField` con una variante en línea (subrayado) y otra con borde; placeholder a `--ink-text-subtle`. |

### P3 — Pulido y deuda

- **Valores sueltos de z-index**: `z-[60]`, `z-[70]`, `z-[80]`, `z-[100]` más `--ink-grain-z: 98` y `z-30/40/50`. Definir una escala (`--z-header`, `--z-popover`, `--z-modal`, `--z-toast`) y colocar el grano de papel bajo el contenido interactivo.
- **Duraciones**: `duration-150/200/300/500/700/1000` y `transition-*` en CSS, frente a `--transition-fast/normal/slow`. Usar los tokens; 8 reglas `prefers-reduced-motion` para ≈100 transiciones: comprobar que cubren el sello (`stamp-impact`), `FadeIn` y el diagrama.
- **CSS hexadecimal fuera de tokens**: `jsxgraph.css` (13 hex) y `ac-classes.css` (3). Aceptable en el tema de JSXGraph si se documenta; mover los de `ac-classes.css` a variables.
- **Estilos en línea** (`style={{…}}`): ExerciseCard 8, BranchLibrary 7, CustomNode 7, CodexLayout 7, HistoryTimeline 6, EditorLandingCard 6. Los dinámicos (posición, acento) están bien; revisar los que fijan tamaños o colores fijos.
- **`outline: none`/`focus:outline-none`** en `GraphSearch`, `AxiomaticSearch`, `DictionaryPage`, `Hueco`, `MatrizInteractiva`, `RichProseSurface`: comprobar que cada uno sustituye el foco por otro indicador visible.
- **Nomenclatura**: `UI.labelcanela` y `UI.labelmora` (minúscula) frente a `labelPavo`, `labelOcre`, `labelTerracota` en `uiClasses.ts`. `.ac-eyebrow--faint`, `.ac-label--granada` y `.ac-eyebrow--granada` existen en CSS sin entrada en `UI`. `--color-dictionary` apunta a terracota (alias de rol dentro de la paleta de pigmentos).
- **Documentación desactualizada**: `src/app/styles/README.md` cita `content-layout-index.css`, que no existe.
- **Móvil de ejercicio/demostración**: el diagrama ocupa ~35 % de la altura de pantalla con controles verticales que lo comprimen; el contador "0 / Correctas: 4 de 4" es ambiguo. Valorar diagrama colapsado por defecto con vista previa, y copia "0 de 4 correctas".
- **Grafo/axiomas**: el árbol arranca arriba a la izquierda dejando media pantalla vacía; encuadrar al cargar (`fit`). Los nodos del árbol muestran rayas en lugar de etiqueta a zoom inicial.
- **Página `/es/plan` sin id devuelve 404** (comprobar si es intencionado; `StudyPlanPage` existe).

## 3. Cobertura de componentes (compartidos, `src/components/ui`)

| Componente | Estados | Variantes | Doc | Nota |
|---|---|---|---|---|
| Botón público (`.ac-btn`) | ✅ hover, foco | ✅ primary/ghost/accent | ⚠️ solo comentario CSS | Sin estado `disabled` ni `loading` en CSS; `ac-btn-ghost` usa alfa 60 % (contraste) |
| Botón editor (`Button`) | ✅ `aria-pressed` | ✅ 4 + 2 tamaños | ✅ JSDoc | Duplica concepto; ver P2-2 |
| Badge/Pill (`ac-pill`, `ContentTypeBadge`, `DifficultyBadge`, `ed-chip`) | ⚠️ | ✅ | ❌ | Cuatro implementaciones de "etiqueta" |
| Tarjeta (`ContentCard`, `ac-cta-card`, `Card`, `EditorLandingCard`) | ✅ | ✅ | ❌ | Cuatro familias |
| Campo/Select (`Field`, inputs crudos) | ✅ | ⚠️ | ❌ | `select` nativo sin estilo |
| Modal (`Modal`, `SearchOmnibar`, `MarginaliaPanel`) | ✅ `aria-modal` | — | ❌ | Tres implementaciones; comprobar trampa de foco en las dos públicas |
| Breadcrumbs, Skeletons, EmptyState, NotFound | ✅ | ⚠️ | ❌ | Estables |
| Toggle de idioma/tema | ✅ | ⚠️ | ❌ | Dos presentaciones del idioma |

## 4. Crítica visual

**¿Es coherente?** Sí en el núcleo: Fondamento para títulos, EB Garamond para el cuerpo, un pigmento por tipo de contenido que tiñe título, insignia y diagrama, pergamino con grano, marcos de doble filete en la cabecera. Una página de teorema, de definición o de biografía se reconoce como del mismo libro. La coherencia se rompe en los bordes (ver más abajo).

**¿Es atractivo?** La home y las páginas de lectura lo son: la inicial gótica "M", el título que toma el color del tipo, la capitular y el lead en cursiva dan identidad propia, rara en una enciclopedia matemática. El panel lateral de `/axiomas` (índice impreso con puntos guía, versalitas) es el mejor ejemplo del lenguaje y debe ser la referencia. Las pantallas menos atractivas son las de herramienta: grafo, editor y controles del diagrama.

### Incoherencias visuales

| # | Observación | Dónde | Propuesta |
|---|---|---|---|
| V1 | **Decisión: versalitas EB Garamond.** **Dos voces tipográficas para el "chrome"**: sans (Source Sans) en miga de pan, etiquetas, botones públicos y eyebrows frente a versalitas Garamond en `/axiomas` y el editor. La sans es lo único moderno de la página de lectura. | Miga de pan, `ac-label`, `ac-btn`, "Sección I", insignias | Una sola voz: versalitas Garamond (`ac-rubric`) para rúbricas y botones; la sans queda solo para texto funcional diminuto o se retira. |
| V2 | **Bloques de color plano y saturado** en la home (4 tarjetas rojo/verde/azul/negro con sombra suave). Son lo único del sitio con relleno pleno; el resto es tinta sobre papel. Parecen botones de app, no lomos de libro ni láminas. | Home | Tarjetas de papel con filete del color del tipo y rúbrica, o lomos verticales de libro. Mantener el color como tinta, no como relleno. |
| V3 | **Diagrama como pieza ajena**: marco redondeado de color, controles en píldora, iconos sueltos. En un libro un diagrama es una lámina: filete fino, pie de figura. | Demostración, ejercicio | Marco rectangular de filete simple, pie "Fig. 1 · título" en cursiva, controles como barra de rúbricas (☞ Inicio · Pasos). |
| V4 | **Contadores en monoespaciada del sistema** ("4 términos", "123 elementos") y chips grises genéricos ("Leídos: 0 · Ejercicios: 0"): suenan a panel de control. | Glosario, editor, home | Cifras elzevirianas en Garamond y texto corrido ("cuatro términos"), sin caja gris. |
| V5 | **Fondo del 404 gris azulado** frente al pergamino cálido del resto; el estado vacío más desangelado del sitio. | `/es/xxx/yyy` | Mismo pergamino, un fleuron o la "M" sin marco y una frase con voz del libro. |
| V6 | **Grafo**: damasco de fondo con mucho contraste (sobre todo en oscuro) compite con los datos; nodos brillantes y glifos de color puro. Es la pantalla que menos parece un libro. | Grafo | Fondo más tenue o liso en el área de datos; nodos como tinta plana con borde; etiquetas en Garamond con halo del color del lienzo. |
| V7 | **Cuatro iconos de cabecera con el mismo peso** y flotantes: desordenan sobre contenido (solapamiento P1-1) y compiten con el título. | Todas | Reducir a una regla fina con rúbricas (ES · ☾ · ⌕) discretas, o integrarlas en la cabecera de la página y no sobre ella. |
| V8 | **Adornos mínimos**: casi todo el ornamento es la capitular y un ✦ entre filetes. | Lectura | Con moderación (la preferencia es "simple y bien diseñado"): un fleuron como separador de sección, llamadas marginales con filete, y "■" de fin de demostración. |
| V9 | ~~Franja oscura en el borde derecho~~ **Retirado**: es la barra de desplazamiento de Chrome sin cabeza en las capturas (`scrollbar-width: thin`), no un elemento del diseño. | — | Ninguna. |

## 5. Microinteracciones propuestas

### Principio rector: nada aparece, todo se escribe

Libro mágico: ningún elemento surge de la nada ni con un fundido genérico; se **traza** o se **escribe**. Tres primitivas, que sustituyen a las microinteracciones sueltas:

| Primitiva | Qué hace | Se aplica a | Técnica |
|---|---|---|---|
| `ink-write` | El texto se escribe de izquierda a derecha con borde de máscara suave; al terminar, el color "se seca" de pigmento a tinta (≈600 ms). | Títulos, lead, párrafos, etiquetas, justificaciones de pasos, tooltips | `mask-image` con gradiente animado (el texto sigue en el DOM: se puede seleccionar, buscar y lo lee el lector de pantalla) |
| `ink-draw` | Las líneas se trazan desde un extremo: filetes, subrayados, marcos, separadores, aristas del grafo, objetos del diagrama. Un doble filete traza el primero y luego el segundo. | Subrayado de enlaces (al hover se traza; al salir se retira por la derecha), `ac-breadcrumbs`, tarjetas, marcos de diagrama, ✦ de los separadores | `transform: scaleX` con `transform-origin: left`, o `stroke-dashoffset` en SVG; los subrayados pasan de `text-decoration` a `background-size` |
| `ink-frame` | Un contenedor se enmarca primero (los cuatro lados trazados en secuencia) y después se escribe su contenido. | Modales, omnibar, marginalia, menús, tarjetas de la home | Combinación de las dos anteriores con retraso encadenado |

Secuencia en una página: título → filete → lead → primer párrafo; el resto se escribe al entrar en el viewport.

Reglas para que no estorbe a la lectura:
- **Presupuesto**: ≤ 700 ms por pantalla; la velocidad se mide en palabras por segundo (≈25), con tope por bloque, nunca una duración fija larga.
- **Una vez por elemento y visita**; atrás/adelante y recargas restauran el estado final al instante.
- **Sin JS o sin hidratar el contenido es visible** (SEO y prerender intactos): el estado "pendiente" solo se añade desde el cliente.
- `prefers-reduced-motion`, impresión y un ajuste "escritura instantánea" muestran el estado final.
- Solo `transform`, `opacity` y máscara; observar con un único `IntersectionObserver` compartido y no animar bloques fuera del viewport.
- Tokens nuevos: `--ink-write-speed`, `--ink-draw-duration` (250–400 ms), `--ink-ease`; una hoja `ink-motion.css` y un hook `useInkReveal`, con atributo `data-ink="write|draw|frame"` aplicable también desde MDX.

Hoy existe poco movimiento: `page-enter`, `stamp-impact` (sello), `bookmark-bounce`, esqueletos de tinta, `shake`; `FadeIn` es a propósito un contenedor sin animación. Hay margen, con una regla: **todo debe parecer tinta, papel o encuadernación**, no UI de app. Nada de rebotes (salvo el sello) ni escalas.

| Prioridad | Interacción | Descripción | Coste |
|---|---|---|---|
| 1 | **Enlace conceptual con vista previa** | Al pasar sobre un `ConceptLink` (o foco 400 ms), el subrayado punteado se vuelve trazo continuo (como un trazo de pluma, 180 ms) y aparece una nota marginal con la definición. Es una enciclopedia hipervinculada: es la interacción de más valor. | Medio |
| 2 | **Manícula que se desplaza** | En botones con ☞, la manícula avanza 2–3 px al hover y se asienta al clic. Une botones públicos, editor y diagrama. | Bajo |
| 3 | **Trazo de las construcciones** | Al cambiar de paso en un diagrama, los objetos nuevos se dibujan con `stroke-dashoffset` (300–500 ms), y el texto de la justificación se escribe con una máscara de izquierda a derecha. Los puntos arrastrables muestran un halo del pigmento. | Medio |
| 4 | **Fin de demostración** | Al llegar al último paso, la "■" se estampa con `stamp-impact`. Reutiliza lo que ya hay. | Bajo |
| 5 | **Marcar como leído** | El sello vintage se estampa en el margen y el marcapáginas de la biblioteca se mueve al lugar. Progreso con significado, no una barra. | Bajo |
| 6 | **Cambio de tema con revelado radial** | Con View Transitions, el modo claro/oscuro se extiende en círculo desde el botón (350 ms), como una vela encendiéndose. Hoy es un fundido de 0,6 s. | Bajo-medio |
| 7 | **Transición entre páginas** | Fundido corto con el título que se mantiene (View Transitions, 200–250 ms); pasar de una entrada a otra se siente como pasar la hoja. | Medio |
| 8 | **Grafo vivo** | Hover: el vecindario se resalta y el resto se vela con color de lienzo; las aristas se dibujan al aparecer; cámara con inercia al saltar a un nodo. | Medio |
| 9 | **Ejercicios** | Acierto: una marca de tinta se dibuja (SVG) junto a la respuesta; fallo: subrayado ondulado del color granada en lugar de `shake`; final: sello. | Bajo |
| 10 | **Cursor y foco** | Selección de texto ya tiene color propio; añadir `::marker` y foco de teclado como filete doble coherente con los marcos. | Bajo |

Reglas: duraciones solo de tokens (`--transition-fast 150 ms`, `normal 250 ms`, `slow 400 ms`), una sola curva (`--ease-panels`), todo bajo `prefers-reduced-motion` (hoy solo hay 8 reglas para ≈100 transiciones) y sin animar propiedades de layout.

## 6. Plan de acción propuesto (revisado)

El orden anterior era demasiado técnico. Propongo empezar por las decisiones visuales, que condicionan la refactorización de componentes.

**Fase A — Decisiones de dirección visual (antes de escribir código)**
Con 2–4 opciones y vistas previas ASCII por cada una, como en las anteriores iteraciones:
1. Voz tipográfica del chrome (V1, V4).
2. Home: sustituir las tarjetas de color plano (V2).
3. Lámina de diagrama y barra de controles (V3, P2-5).
4. Cabecera flotante (V7, P1-1).
5. Grafo: fondo y nodos (V6).

**Fase B — Arreglos puntuales** (1–2 días): P1-1, P1-2, P1-5, P1-6, P1-7, 404 (V5), README de estilos.

**Fase C — Cimientos** (2–3 días): escala `--text-*` y `--z-*`, lint contra `text-[Npx]`, objetivos táctiles, `prefers-reduced-motion` completo.

**Fase D — Primitivas compartidas** (1–2 semanas): Button → Chip → Card/Panel → Modal → SearchField, aplicando las decisiones de la fase A.

**Fase E — Microinteracciones** (1 semana, sobre D): prioridades 1–5 primero; después 6–9.

**Fase F — Accesibilidad con herramienta**: axe/Lighthouse y prueba manual con teclado y lector de pantalla; después `/design:accessibility-review`.

## 7. Cómo reproducir las mediciones

```bash
npx vite --port 5199 &                # base /Matematika/
# capturas y métricas: Puppeteer, tema forzado con localStorage.theme
grep -rEoh "text-\[[0-9.]+px\]" src --include=*.tsx | sort | uniq -c | sort -rn
grep -rEoh "\brounded(-[a-z0-9]+)?\b" src --include=*.tsx | sort | uniq -c | sort -rn
grep -rEo "ac-eyebrow|UI\.eyebrow\w*" src --include=*.tsx | wc -l
```
