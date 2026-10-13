# Paleta y estilo visual de los diagramas

El *chrome* de los diagramas (botones, paneles, anotaciones) debe parecer **impreso en un libro
antiguo**: papel, tinta, versalitas, cursiva y manículas. Nada de UI moderna (tarjetas, sombras,
píldoras, puntos de estado, mayúsculas con tracking).

## 1. Dónde vive cada estilo

| Pieza | Fuente de verdad |
|---|---|
| Pigmentos `--theme-*`, `--ink-text*`, fuentes | `src/app/theme.css` |
| Panel en el lienzo (`annotation` · `panel`) | `.matematika-info-panel*` en `src/app/styles/mdx-prose.css`; HTML en `annotationTextHtml` (`src/diagrams/render/diagramRuntimeUtils.ts`) |
| Panel de paso (overlay) | `DiagramInfoPanel` (`src/components/ui/DiagramOverlay.tsx`) + `StepOverlayPanels` (`src/diagrams/render/DiagramKatexOverlay.tsx`) |
| Botón de control en el lienzo | `.diagram-control-button` en `mdx-prose.css`; `render/elements/diagramButton.ts` solo fija `--diagram-button-accent` |
| Papel de folio compartido | `--diagram-folio-bg` (`:root` en `mdx-prose.css`) |

## 2. Paneles informativos: «folio»

- Fondo `--diagram-folio-bg`: lienzo tostado con un 7 % de `canela`, al 93 %. **Sin bordes, sin
  filete lateral, sin sombra, sin capitular**; esquinas rectas (1px).
- Jerarquía solo tipográfica:
  - **Título**: versalitas (`font-variant-caps: small-caps`), semibold, `--ink-text`, 1.12em.
  - **Subtítulo**: cursiva, `--ink-text-muted`.
  - **Cuerpo**: redonda, `--ink-text-body`.
  - **Título de bloque**: versalitas, `--ink-text-muted`. Los bloques con color solo tiñen el texto.
- Un panel de paso usa la misma piel: título = etiqueta del paso (versalitas) y `overlay.title` como subtítulo en cursiva.
- Todo texto admite KaTeX `$…$`: escribir `$P(k)$`, nunca `P(k)` plano.

## 3. Botones de control: «rótulo impreso»

- Rectángulo recto con **un solo filete** `carbon` al 30 % (al 55 % en hover) sobre `--diagram-folio-bg`.
- Texto `font-diagram` en versalitas, semibold, `--ink-text`.
- Manícula **☞** en el color del control antes del texto. Activo: filete en el color del control,
  lavado del 7 % y la manícula se vuelve **☜**.
- Foco `outline 2px pavo`; deshabilitado `opacity .35`. Sin `transform`, sombras ni puntos.

## 4. Preferir objetos editables

Los textos explicativos deben ser **anotaciones `panel`** (título, subtítulo, texto, bloques y reglas
editables en el editor visual), no `objectStates[*].overlay` de los pasos, que el editor no permite editar.
Para que el panel siga lo que hace el alumno, usar `visibleWhen` sobre los controles
(ej. `and(gte(empuje, 0.01), not(gte(acercar, 1.4)))`) e incluir los paneles en `visibleTargets` de cada paso.

Traducciones de paneles: `labels` (nombre en el editor), `titles`, `subtitles` y `annotations` (texto), por id.
Overlays de paso, si se usan: `steps.<stepId>.overlays.<objectId>.{title,content}`.

## 5. Paleta de objetos

Solo tokens: `carbon`, `terracota`, `canela`, `mora`, `ocre`, `pavo`, `granada`, `musgo` (nunca hex).

| Uso habitual | Token |
|---|---|
| Figura base, construcción | `carbon` |
| Objeto principal / caso base | `terracota` |
| Hipótesis, segundo protagonista | `mora`, `pavo` |
| Elemento genérico (`k`, variable) | `ocre` |
| Conclusión, éxito | `musgo` |
| Contradicción, error | `granada` |

## 6. Descartado por la autora (no repetir)

- Tarjetas con `rounded-md`, sombra y barra de acento de color.
- Antetítulos en MAYÚSCULAS con tracking amplio.
- Botones píldora, rellenos con el color del objeto, con punto de estado o sombra al hover.
- Filete lateral ocre en los paneles (estilo anterior).
- Doble filete en botones y capitulares en paneles: demasiado recargado.
