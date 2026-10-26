# Paleta y estilo visual de los diagramas

El *chrome* de los diagramas (botones, paneles, anotaciones) debe parecer **impreso en un libro
antiguo**: papel, tinta, versalitas, cursiva y manículas. Nada de UI moderna (tarjetas, sombras,
píldoras, puntos de estado, mayúsculas con tracking).

## 1. Dónde vive cada estilo

| Pieza | Fuente de verdad |
|---|---|
| Pigmentos `--theme-*`, `--ink-text*`, fuentes | `src/app/theme.css` |
| Tela o macizo (cuándo rellenar con el pigmento) | «Color de acento» en `src/app/styles/README.md` |
| Panel en el lienzo (`annotation` · `panel`) | `.matematika-info-panel*` en `src/app/styles/mdx-prose.css`; HTML en `annotationTextHtml` (`src/diagrams/render/diagramRuntimeUtils.ts`) |
| Panel de paso (overlay) | `DiagramInfoPanel` (`src/components/ui/DiagramOverlay.tsx`) + `StepOverlayPanels` (`src/diagrams/render/DiagramKatexOverlay.tsx`) |
| Botón de control en el lienzo | `.diagram-control-button` en `mdx-prose.css`; `render/elements/diagramButton.ts` solo fija `--diagram-button-accent` |
| Papel de folio compartido | `--diagram-folio-bg` (`:root` en `mdx-prose.css`) |
| Lámina, pie de figura y barra de controles | `DiagramRenderer` (`<figure>` · `[data-diagram-plate]` · `figcaption`) y `.diagram-figure-caption` / `.diagram-rubric*` en `mdx-prose.css`; filete y radio por defecto en `MathBoard` |

## 2. Paneles informativos: «folio»

- Fondo `--diagram-folio-bg`: lienzo tostado con un 7 % de `canela`, al 93 %. **Sin bordes, sin
  filete lateral, sin sombra, sin capitular**; esquinas rectas (1px).
- Jerarquía solo tipográfica:
  - **Título**: versalitas (`font-variant-caps: small-caps`), semibold, `--ink-text`, 1.12em.
  - **Subtítulo**: cursiva, `--ink-text-muted`.
  - **Cuerpo**: redonda, `--ink-text-body`.
  - **Título de bloque**: versalitas, `--ink-text-muted`. Los bloques con color solo tiñen el texto.
- Un panel de paso usa la misma piel: título = etiqueta del paso (versalitas) y `overlay.title` como subtítulo en cursiva.
- Etiquetas, pasos (`label`, `description`) y paneles admiten KaTeX `$…$`: escribir `$P(k)$`, nunca `P(k)` plano.
- **Excepción: `note`** (y `translations.*.note`) es texto plano. `ExplorationCue` colorea en ella las etiquetas de los puntos móviles buscándolas como palabras sueltas: escribir `Arrastra A y C`, nunca `$A$`. `verify-diagram.ts` lo comprueba. Como busca palabras sueltas, una etiqueta que es también una palabra corriente se colorea donde no toca (la «a» de «a la vez», la «y» de «X y B», la «e» en euskera): usa etiquetas que no sean palabras en ningún idioma (números, mayúsculas, subíndices).

## 3. Botones de control: «rótulo impreso»

- Rectángulo recto con **un solo filete** `carbon` al 30 % (al 55 % en hover) sobre `--diagram-folio-bg`.
- Texto `font-diagram` en versalitas, semibold, `--ink-text`.
- Manícula **☞** en el color del control antes del texto. Activo: filete en el color del control,
  lavado del 7 % y la manícula se vuelve **☜**.
- Foco `outline 2px pavo`; deshabilitado `opacity .35`. Sin `transform`, sombras ni puntos.

- **Casilla (`behavior: "cycle"`)**: solo la cifra, en cifras de estilo antiguo, sin filete, sin manícula y sin fondo. Al pasar el ratón, un lavado del 10 % del color del control. Estilo en `.diagram-control-button--cycle`. Las líneas de la tabla son segmentos del diagrama, a la manera de un libro: filetes de cabecera `carbon` de 1,4 y rejilla interior fina al 40 %.

## 3 bis. Lámina

- Tablero con filete de 2 px en `--page-accent` y radio `--radius-sm` (4 px), el mismo de los números de paso.
- Debajo, fuera del dibujo: pie «Fig. N · título» (número en versalitas, título en cursiva) y barra de rúbricas en versalitas sin bordes; ☞ delante de «Reproducir».
- Lámina pequeña (ancho < 480 px o figura < 400 px de alto, p. ej. móvil): las rúbricas vuelven dentro del tablero como raíles laterales de solo glifos (zoom a la izquierda, pasos a la derecha) para no robar altura al dibujo; el pie sigue debajo.
- La nota de exploración (`note`) y las lecturas quedan dentro, arriba. El título ya no va dentro del tablero salvo en el lienzo del editor y en miniaturas.

## 3 ter. Flechas

- Punta de grabado: muesca (tipo 2 de JSXGraph), del mismo color y grosor que el trazo. Se pide con `appearance.arrow` en un `segment`; no se dibujan triángulos con polígonos.
- Una flecha sin destino (elemento sin imagen) es un muñón discontinuo con punta, no una flecha borrada. El alumno tiene que ver que falta algo y poder agarrarla.

## 4. Preferir objetos editables

Los textos explicativos deben ser **anotaciones `panel`** (título, subtítulo, texto, bloques y reglas
editables en el editor visual), no `objectStates[*].overlay` de los pasos, que el editor no permite editar.
Para que el panel siga lo que hace el alumno, usar `visibleWhen` sobre los controles
(ej. `and(gte(empuje, 0.01), not(gte(acercar, 1.4)))`) e incluir los paneles en `visibleTargets` de cada paso.

Traducciones de paneles: `titles`, `subtitles` y `annotations` (texto), por id. `labels` también sirve de título cuando falta `titles`: no lo uses para un panel sin título.
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
