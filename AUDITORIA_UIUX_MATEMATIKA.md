# Auditoría UI/UX y Accesibilidad Web (WCAG 2.1 AA)

**Proyecto:** Matematika (`Matematika_Drafts`)  
**Rol:** Diseñador Lead de UI/UX & Especialista en Accesibilidad Web  
**Fecha:** 2 de agosto de 2026  
**Método:** Inspección en vivo (`http://127.0.0.1:5173/Matematika/`) + DOM/CDP + revisión de código fuente (sin modificar código de producto)  
**Viewports:** Escritorio 1440×900 · Tablet 768×1024 · Móvil 375×812  
**Páginas muestreadas:** Home `/`, Teorema `/teorema/teorema-angulo-externo`, Demo `/demo/demo-angulo-externo`  
**Capturas:** `audit-home-1440.png`, `audit-teorema-1440.png`, `audit-teorema-768.png`, `audit-teorema-375.png`, `audit-home-375.png` (almacenadas en el entorno de inspección)

---

## Resumen Ejecutivo

### Puntuación general estimada: **71 / 100**

| Área | Nota | Lectura |
| :--- | :---: | :--- |
| Cohesión y sistema de diseño (UI) | **74** | Identidad Arts & Crafts fuerte y tokens canónicos en `theme.css`; deuda sistemática en opacidades/`color-mix` de labels y acentos CTA. |
| Experiencia de usuario y navegación (UX) | **73** | Jerarquía editorial clara en contenido; home densa; panel de marginalia vacío ruidoso; chips MSC ilegibles/tocables. |
| Accesibilidad y rendimiento (a11y) | **66** | KaTeX bien hecho (MathML + `aria-hidden`); fallos WCAG 1.4.3 por contraste; H1 de marca roto; touch targets < 44×44. |

### Top 3 problemas críticos

1. **Contraste insuficiente (WCAG 1.4.3)** — Labels MSC con `opacity-60`, eyebrows CTA sobre terracota/musgo, breadcrumbs y sistema `.ac-eyebrow` / `.ac-label` basados en `color-mix(... 30–50%, transparent)`. Ratios medidos **2.25:1–4.09:1** (mínimo 4.5:1 para texto normal).
2. **Marca / H1 inaccesible** — En home, el `<h1>` literal es `atematika` (la «M» vive solo en un SVG decorativo). Lectores de pantalla y SEO reciben el nombre incompleto.
3. **Controles táctiles bajo mínimo (WCAG 2.5.5 / UX móvil)** — Chips MSC (~28–31×19 px), controles de diagrama (acercar/alejar 36×24, secuencia 32×32) y botones del panel de glosario (29×40) no alcanzan 44×44 CSS px.

**Nota positiva (corrige mitos previos):** en las páginas muestreadas **no** hubo `overflow-x` a nivel de documento en 375/768/1440. `<Formula />` usa `overflow-x: auto` (`.formula-scrollbar`) y contiene fórmulas anchas (p. ej. 452 px de scrollWidth dentro de ~342 px de cliente). KaTeX expone MathML + `.katex-html[aria-hidden="true"]` de forma consistente (12/12 en teorema, 106/106 en demo).

---

## Auditoría Detallada por Categorías

### 1. Cohesión y sistema de diseño (UI)

#### [Crítico] Opacidades y `color-mix` como “muted” rompen el contraste por diseño
- **Ubicación:** `src/app/styles/design-system.css` (`.ac-eyebrow`, `.ac-label--*`, `.ac-meta`); chips home `opacity-60`; CTA `ac-cta-card__eyebrow` / `__action`.
- **Evidencia (CDP, home 1440/375):** 36 muestras < 4.5:1. Peores: badges MSC ocre/terracota/pizarra con `opacity-60` → **2.25–2.79:1**; CTAs lienzo-sobre-terracota/musgo → **3.79–4.09:1**.
- **Snippet:**
```9:22:src/app/styles/design-system.css
.ac-eyebrow {
  /* ... */
  color: var(--ac-eyebrow-color, color-mix(in srgb, var(--theme-carbon) 50%, transparent));
}
.ac-eyebrow--muted { --ac-eyebrow-color: color-mix(in srgb, var(--theme-carbon) 40%, transparent); }
.ac-eyebrow--faint { --ac-eyebrow-color: color-mix(in srgb, var(--theme-carbon) 30%, transparent); }
```
- **Solución:** Sustituir “muted por transparencia” por tokens opacos `--ink-muted`, `--ink-subtle` calibrados a ≥4.5:1 (o ≥3:1 solo si son large text ≥18px/14px bold). Revisar CTAs: o subir luminancia del texto, o oscurecer el fondo de card.

#### [Medio] Tagline del hero con contraste límite
- **Ubicación:** `src/fixed-pages/home/components/HeroSection.tsx` — `text-carbon/60`.
- **Evidencia:** `carbon/60` sobre `#F3EFE7` ≈ **3.9:1** (cálculo) / falla AA para cuerpo.
- **Solución:** `text-carbon/80` o token `--ink-text-body` ya definido en `theme.css` (sin slash-opacity).

#### [Medio] Inconsistencia tipográfica UI vs editorial
- **Ubicación:** Cuerpo serif (`EB Garamond` / Fondamento) vs UI sans sistema (`--font-sans-family: system-ui`); Logo importa **otra** fuente (`UnifrakturMaguntia`) vía `@import` interno en SVG.
- **Impacto:** Tres familias + Google Fonts en cascada; riesgo de FOUT/CLS en marca.
- **Solución:** Centralizar cargas en `theme.css` / `@font-face` local; una sola display para marca; sans UI con una familia concreta (no stack anónimo) si se busca cohesión.

#### [Bajo] Sombras y radios
- **Ubicación:** `--border-radius-base: 6px` + CTAs con sombra `--ac-cta-shadow`; paneles `elegant-panel` / `shadow-elegant` / `shadow-parchment`.
- **Hallazgo:** Coherente en espíritu Arts & Crafts; hay mezcla de paneles con borde doble vs cards con sombra suave. No es defecto grave.
- **Solución:** Documentar 2 elevaciones máximo (`--elev-1`, `--elev-2`) y un radio.

#### [Bajo] Jerarquía KaTeX vs prosa
- **Ubicación:** Teorema/demo; `.formula-scrollbar` en `MDXBlocks.tsx`.
- **Hallazgo:** Display math en bloque bordeado (`border-carbon/20`, `bg-carbon/[0.02]`) se distingue bien del cuerpo. Inline KaTeX integrado en prosa sin romper ritmo vertical de forma grave.
- **Solución:** Mantener; unificar padding vertical de bloques fórmula (`my-10` es generoso en móvil: valorar `my-6` bajo `sm`).

---

### 2. Experiencia de usuario y navegación (UX)

#### [Crítico] H1 de marca incompleto (`atematika`)
- **Ubicación:** `HeroSection.tsx` L71–73 + `Logo.tsx`.
- **Evidencia DOM:** `document.querySelector('h1').textContent === "atematika"` en 1440 y 375.
- **Snippet:**
```69:73:src/fixed-pages/home/components/HeroSection.tsx
          <Logo className="w-16 h-16 ..." />
          <h1 className={`...`}>
            atematika
          </h1>
```
- **Solución:** `<h1><span class="sr-only">M</span>atematika</h1>` o incluir la M en el texto y marcar el SVG `aria-hidden="true"`. Preferible un solo H1 textual «Matematika».

#### [Medio] Orientación espacial / estado activo débil
- **Ubicación:** Home sin `aria-current`; breadcrumbs en contenido (`.ac-breadcrumbs`) con truncado en tablet.
- **Evidencia:** `activeNav: []` en auditoría DOM; breadcrumbs ~12px, color ~`rgb(133,129,124)` → **~3.37:1**.
- **Solución:** `aria-current="page"` en breadcrumbs y entradas de biblioteca; subir contraste; en 768 evitar ellipsis opacos (menú “ruta” colapsable).

#### [Medio] Densidad cognitiva en Biblioteca MSC2020
- **Ubicación:** Home, sección biblioteca (chips numéricos + slugs largos + badges de tipo).
- **Impacto 1440:** Escaneable pero ruidoso. **375:** CTAs apilan bien (1 col); chips siguen siendo micro-objetivos.
- **Solución:** Agrupar chips en “códigos MSC” con tamaño mínimo 44px de alto; ocultar slugs crudos detrás de tooltip/`title` ya presente; limitar tags visibles + “ver más”.

#### [Medio] Panel de marginalia / glosario vacío siempre en árbol a11y
- **Ubicación:** `MarginaliaPanel.tsx` (botones «Cambiar modo de visualización», «Cerrar panel»).
- **Evidencia:** En home y teorema, el snapshot incluye siempre el mensaje *«No se han encontrado símbolos reconocidos en esta expresión.»* y controles 29×40.
- **Solución:** No montar controles interactivos hasta `isActive`; `hidden`/`inert` cuando inactivo; toast/panel solo tras selección de término.

#### [Medio] Enlaces «página en construcción»
- **Ubicación:** ConceptLinks sin destino (títulos `"… — página en construcción"`).
- **UX:** Rompe confianza en el grafo semántico.
- **Solución:** Estilo “disabled” no-enlace, o omitir hasta existir página; no subrayar como link activo.

#### [Bajo] Overflow horizontal de fórmulas
- **Estado medido:** Documento sin overflow en 375/768/1440. Scrollers internos: p. ej. `scrollWidth 452` / `clientWidth 342` en demo.
- **Riesgo residual:** Indicadores ornamentales `❧`/`☙` con `animate-pulse` pueden distraer; no hay affordance clara de “desliza” para quien no vea el gradient.
- **Solución:** Mantener contención; añadir hint textual sr-only «Desplaza horizontalmente para ver la fórmula completa» cuando `canScrollRight`.

#### [Bajo] Estado de carga editorial
- **Ubicación:** Pantallas «Consultando el archivo…» con marca en watermark muy tenue.
- **Impacto:** Contraste pobre; sensación de página vacía 1–3 s.
- **Solución:** Skeleton con tipografía/estructura del layout final (reduce CLS percibido) y texto de estado ≥4.5:1.

---

### 3. Accesibilidad y rendimiento (a11y)

#### [Crítico] Contraste en modo oscuro (acentos de enlace)
- **Ubicación:** `.page-accent-link` / pills en demo con `.dark` forzado en DOM.
- **Evidencia:** Varios enlaces midieron `rgb(138, 58, 82)` (#8A3A52, granada clara) sobre fondo `#161514` → **2.44:1**. Con el token oscuro correcto (`#D9738E`) el ratio sería ~5.9:1.
- **Solución:** Verificar en runtime que `--page-accent` resuelve a `var(--theme-*)` bajo `.dark` (no hex congelado); test visual automatizado light/dark por tipo de página.

#### [Crítico] Touch targets
- **Ubicación:** Home chips MSC; `DiagramRenderer` / `StepNavigator` (demo); Marginalia chrome.
- **Evidencia demo 375:** Acercar/Alejar 36×24; pasos 32×32; puntos SVG 16×16 (mitigado por `role=button` + `aria-label`, pero hit area insuficiente).
- **Solución:** `min-h-11 min-w-11` (44px) en toolbar; `hitSlop`/padding invisible en nodos del diagrama.

#### [Medio] ThemeToggle / Search sin `aria-label` / `aria-pressed`
- **Ubicación:** `ThemeToggle.tsx`, `TopBar.tsx`.
- **Evidencia:** Nombre accesible llega vía `title` (funciona en snapshot), pero **no** hay `aria-pressed` para el estado de tema; `title` es frágil en táctil.
- **Solución:**
```tsx
aria-label={isDark ? "Activar modo Papiro" : "Activar Códice Nocturno"}
aria-pressed={isDark}
```
y `aria-label="Buscar (Control K)"` en el botón de búsqueda.

#### [Medio] KaTeX — estado actual bueno, con matiz
- **Evidencia:** `katex.mathml === katex.count`, `katex-html[aria-hidden=true]` presente.
- **Matiz:** `MarginaliaPanel.renderMathString` usa `katex.renderToString` vía `dangerouslySetInnerHTML` sin el mismo empaquetado MDX; auditar ese camino por separado.
- **Solución:** Reutilizar el mismo pipeline rehype/KaTeX del contenido MDX.

#### [Medio] CLS / fuentes
- **Evidencia:** `PerformanceObserver` layout-shift acumulado ≈ 0 en demo *después* de carga (medición tardía; no descarta CLS de primera pintura).
- **Riesgo:** `@import` Google Fonts en `theme.css` + otro `@import` dentro de `Logo.tsx`; texturas de fondo; montaje diferido MDX («Consultando el archivo…» → contenido).
- **Solución:** Precargar fuentes críticas; `font-display: swap` ya presente; reservar `min-height` del layout de lectura; unificar imports de fuentes.

#### [Bajo] Landmarks
- **Evidencia:** Home tiene `header` / `main` / `footer`. Contenido usa `role="main"` en `.content-reading` y `nav` breadcrumbs. Falta skip-link visible.
- **Solución:** Enlace «Saltar al contenido» como primer focusable.

#### [Bajo] Focus visible
- **Ubicación:** `editorial-content.css` define `a:focus-visible, button:focus-visible`; varios módulos usan outline terracota/pavo.
- **Hallazgo:** TopBar/ThemeToggle no declaran ring explícito en el componente (dependen de CSS global). Verificar contraste del anillo sobre pergamino.

---

### Hallazgos por viewport (síntesis)

| Viewport | UI | UX | Overflow doc | Notas |
| :---: | :--- | :--- | :---: | :--- |
| **1440** | Hero 4 CTAs en fila; biblioteca 2 columnas; sidebar metadatos visible en teorema | Orientación clara vía sidebar + breadcrumbs | No | Densidad MSC alta |
| **768** | Sidebar → FAB índice; breadcrumbs truncados | Lectura centrada correcta | No | FAB parcialmente al borde: vigilar safe-area |
| **375** | CTAs en 1 columna; lectura ~343 px útiles | Controles diagrama pequeños; fórmulas con scroll interno | No | `Formula` scroller OK; chips home fallan touch+contraste |

---

## Propuesta de Tokens de Diseño

Unificar en `:root` / `.dark` (extender `src/app/theme.css`), **sin** muted por alpha sobre texto de UI:

```css
:root {
  /* Superficies */
  --surface-0: #F3EFE7;          /* lienzo */
  --surface-1: #F7F4EE;          /* panel */
  --surface-2: #EFEBE3;          /* aside / metadata */

  /* Tinta (opaca, WCAG AA sobre --surface-0) */
  --ink-primary: #35312E;        /* ≥11:1 */
  --ink-body: #3F3A36;           /* objetivo ≥7:1 */
  --ink-muted: #5C564F;          /* objetivo ≥4.5:1 — sustituye carbon/50–60 */
  --ink-subtle: #6E675F;         /* solo large text / UI ≥3:1 */

  /* Acentos semánticos (modo claro) — ya existentes, fijar uso */
  --accent-theorem: #A04F3D;
  --accent-axiom: #8B6914;
  --accent-proof: #8A3A52;
  --accent-def: #406E45;
  --accent-model: #2A4B7C;
  --accent-example: #63457A;
  --accent-bio: #406E45;

  /* Sobre acento (texto en CTAs) */
  --on-accent: #F3EFE7;
  --on-accent-safe: #FFF8F0;     /* si on-accent < 4.5:1, aclarar texto o oscurecer fondo */

  /* Espaciado (ritmo 4/8) */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;

  /* Tipo */
  --font-display: "Fondamento", ui-serif, Georgia, serif;
  --font-body: "EB Garamond", ui-serif, Georgia, serif;
  --font-ui: "Source Sans 3", ui-sans-serif, system-ui, sans-serif; /* o similar, una sola */
  --font-math: "Cormorant Garamond", "EB Garamond", serif;
  --fs-h1: clamp(2.25rem, 4vw, 3rem);
  --fs-h2: 1.875rem;
  --fs-h3: 1.375rem;
  --fs-body: 1.125rem;
  --fs-ui: 0.875rem;
  --fs-label: 0.75rem;           /* mínimo UI; evitar 10px para texto esencial */
  --lh-body: 1.85;

  /* Forma / elevación */
  --radius-sm: 4px;
  --radius-md: 6px;
  --elev-1: var(--theme-shadow-classic);
  --elev-2: var(--theme-shadow-elegant);

  /* Interacción */
  --target-min: 44px;
  --focus-ring: 2px solid var(--accent-theorem);
  --motion-fast: 150ms;
  --motion-base: 200ms;
}

.dark {
  --surface-0: #161514;
  --surface-1: #1C1A18;
  --surface-2: #221F1C;
  --ink-primary: #DFD9CF;
  --ink-body: #D2CBC0;
  --ink-muted: #B7AFA3;          /* calibrar ≥4.5:1 sobre --surface-0 */
  --ink-subtle: #9E968A;
  --accent-theorem: #E68571;
  --accent-axiom: #E5C355;
  --accent-proof: #D9738E;
  --accent-def: #88BE8D;
  --accent-model: #7DA2DA;
  --accent-example: #B392CD;
  --on-accent: #161514;
}
```

### Reglas de aplicación (para cerrar la auditoría)

1. **Prohibido** `text-carbon/30|40|50|60` y `opacity-60` en texto semántico (labels, breadcrumbs, CTAs). Usar `--ink-muted`.
2. **Todo control** interactivo: `min-height/min-width: var(--target-min)` (excepto targets SVG del diagrama, que deben ampliar hit-area).
3. **`--page-accent`** siempre `var(--theme-*)` / `var(--accent-*)`, nunca hex resuelto en JS.
4. **H1 home** = cadena completa «Matematika»; logo SVG `aria-hidden="true"`.
5. **Fórmulas:** conservar `overflow-x: auto` local; no `min-w-max` sin contenedor scrolleable (ya correcto en `Formula`).

---

## Priorización sugerida (sin implementar aún)

| Prioridad | Ítem | Esfuerzo |
| :---: | :--- | :---: |
| P0 | Tokens de tinta opaca + sustituir opacidades de labels/CTAs | M |
| P0 | Corregir H1 `atematika` | S |
| P0 | Touch targets diagrama + chips MSC | M |
| P1 | `aria-label` / `aria-pressed` TopBar; inert marginalia inactiva | S |
| P1 | Verificar acentos en `.dark` (regresión 2.44:1 observada) | S |
| P2 | Unificar fuentes; skeleton de carga; skip-link | M |
| P2 | Reducir densidad MSC / enlaces “en construcción” | M |

---

*Auditoría de solo lectura. Ningún archivo de código de producto fue modificado para corregir hallazgos; el único artefacto de esta tarea es este informe.*
