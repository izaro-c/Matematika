# Esquema Técnico DiagramSpec V3

Referencia del esquema Zod implementado en `src/diagrams/model/schema/schemaV3.ts`.

## 1. Colores Oficiales
```ts
color: 'carbon' | 'terracota' | 'canela' | 'mora' | 'ocre' | 'pavo' | 'granada' | 'musgo'
```

## 2. Tipos de Objetos (`objectType`)

### `point`
```json
{
  "id": "pA",
  "label": "A",
  "color": "carbon",
  "layerId": "geometry",
  "order": 10,
  "visible": true,
  "locked": false,
  "groupIds": [],
  "selection": { "selectable": true, "role": "primary", "ariaLabel": "Punto A" },
  "target": true,
  "targetId": "pA",
  "objectType": "point",
  "definition": {
    "type": "coordinates", // "coordinates" | "expression" | "intersection" | "midpoint" | "projection"
    "x": 0,
    "y": 0
  },
  "mobility": {
    "type": "free" // "free" | "fixed" | "on-support" | "on-points" | "axis-x" | "axis-y" | "constrained"
  },
  "appearance": {
    "size": 6,
    "labelVisible": true
  }
}
```
- `appearance.opacity` (0–1) atenúa relleno y trazo del punto. Con `0` el punto es un asa invisible que sigue siendo arrastrable y vuelve a verse al pasar el ratón (las puntas de flecha de `FuncionSagital.tsx`). Fuera del editor, los puntos arrastrables muestran el cursor de mano.

#### Movilidad `on-points` (posiciones discretas)
```json
"mobility": { "type": "on-points", "points": ["llegaB1", "llegaB2", "reposo"] }
```
El punto solo ocupa la posición de uno de esos puntos (entre 1 y 16, distintos de él mismo). Al arrastrarlo salta al más cercano al cursor. Con el teclado, cada flecha salta al candidato más cercano en esa dirección, primero dentro de un cono de 45° y, si no hay ninguno, en todo el semiplano. Su posición inicial (`definition`) debe coincidir con la de un candidato. En el editor visual aparece como «Solo en puntos dados», con una casilla por candidato. Como la posición queda fija en un candidato, una condición puede compararla exactamente: `approx(h.y, 0.8, 0.01)`.

```json
```

### `path`
```json
{
  "id": "segAB",
  "label": "AB",
  "color": "terracota",
  "layerId": "geometry",
  "order": 20,
  "visible": true,
  "locked": false,
  "groupIds": [],
  "selection": { "selectable": true, "role": "primary" },
  "target": true,
  "targetId": "segAB",
  "objectType": "path",
  "geometry": {
    "type": "segment", // "segment" | "line" | "ray" | "polygon" | "circle" | "arc" | "function"
    "points": ["pA", "pB"]
  },
  "appearance": {
    "strokeWidth": 2.5,
    "arrow": "end" // opcional, solo en `segment`: "start" | "end" | "both"
  }
}
```

### `angle`
```json
{
  "id": "angABC",
  "label": "α",
  "color": "ocre",
  "layerId": "geometry",
  "order": 15,
  "visible": true,
  "locked": false,
  "groupIds": [],
  "selection": { "selectable": true, "role": "secondary" },
  "target": true,
  "targetId": "angABC",
  "objectType": "angle",
  "points": ["pA", "pB", "pC"],
  "sweep": "non-reflex",
  "marker": "arc" // "arc" | "square"
}
```

### `area`
Regiones rellenas. Dos geometrías:
```json
{ "id": "areaH1", "objectType": "area", "geometry": { "type": "half-plane", "boundary": ["pC", "pA"], "side": "pB" },
  "appearance": { "strokeWidth": 0, "fillOpacity": 0.12 } }
{ "id": "areaAB", "objectType": "area", "geometry": { "type": "intersection", "areas": ["discoA", "discoB"] },
  "appearance": { "strokeWidth": 0, "fillOpacity": 0.3 } }
```
- `half-plane`: semiplano abierto de borde la recta `boundary` que contiene a `side`.
- `intersection`: corte de dos o más regiones (admite `appearance.highlightVisible` para mostrarse al resaltarla desde el texto aunque `visibleWhen` la oculte). Cada operando es un `area`, un `region` o un `path` `circle` o `polygon`. Para conjuntos como regiones (diagrama de Venn), los operandos son dos círculos con `fillOpacity`.
- La intersección sigue a sus puntos al arrastrar y se recorta al tablero visible. Si queda vacía (regiones disjuntas), desaparece y vuelve a aparecer cuando las regiones se cortan: el caso $A \cap B = \emptyset$ se puede enseñar arrastrando.
- Un disco que se arrastra entero: centro libre y punto del borde `expression` oculto (`"x": "cA.x + 2"`, `"y": "cA.y"`). Con el borde libre, mover el centro cambia el radio.
- Para que un panel o un halo reaccione a qué puntos caen dentro, escribe la condición en un punto `expression` oculto (`lt(hypot(e1.x - cA.x, e1.y - cA.y), 2)`, o el signo de un producto vectorial para un semiplano) y léela desde `visibleWhen`. Referencia: `Interseccion.tsx`, que codifica en binario qué elementos están en $A \cap B$ y muestra un panel por combinación.

### `control` (ej. deslizador / slider de animación)
```json
{
  "id": "animT",
  "label": "t",
  "color": "terracota",
  "layerId": "annotations",
  "order": 0,
  "visible": true,
  "locked": false,
  "groupIds": [],
  "selection": { "selectable": true, "role": "primary" },
  "target": false,
  "objectType": "control",
  "variant": "slider",
  "position": [1.2, -1.7],
  "range": { "min": 0, "max": 1, "step": 0.01 },
  "value": 0,
  "width": 1.8 // Opcional: longitud visual en unidades de coordenadas (por defecto 2.6). Permite deslizadores compactos.
}
```
*Los deslizadores emiten cambios en tiempo real tanto en arrastre continuo (`drag`) como al soltar (`up`), garantizando interactividad fluida y reactiva en simulaciones cinemáticas y didácticas.*

### `control` con `variant: "button"` (botón animado)
Un botón es un control numérico que, al pulsarlo, anima su valor de `range.min` a `action.to` durante `action.durationMs`. Las expresiones que lo leen se recalculan en cada fotograma, igual que con un deslizador; los pasos (`objectStates[id].value`) lo animan con su propia duración y curva.
```json
{
  "id": "acercar", "label": "Paso inductivo: acercar las fichas", "color": "mora",
  "objectType": "control", "variant": "button", "position": [-5.2, 2.05],
  "range": { "min": 0, "max": 6.4, "step": 0.01 }, "value": 0,
  "action": { "to": 6.4, "durationMs": 6400, "returnDurationMs": 2000, "easing": "linear", "behavior": "toggle" }
}
```
- `easing`: `linear` (úsalo cuando el valor es un **tiempo** y la física va en las expresiones), `ease-in`, `ease-out`, `ease-in-out`.
- `returnDurationMs` (opcional): duración del viaje de vuelta a `min` al desactivar; por defecto `durationMs`.
- `behavior`: `toggle` (la segunda pulsación vuelve a `min`) o `restart` (cada pulsación reinicia en `min` y vuelve a correr; nunca se rebobina).
- `effects` (opcional): `on` = `press` | `release` (solo `toggle`) | `complete`; `do` = `reset` (vuelve al valor inicial) | `play` (anima otro botón desde la expresión `from`); `when` = condición opcional. Las expresiones de `effects` no crean dependencias de construcción.
- **Física natural**: para caídas o choques, usa un botón `linear` como reloj `t` (en segundos) y escribe el movimiento en puntos `expression` auxiliares ocultos (p. ej. `θ = min(θmax, a·t² + v·t)`); un punto puede leer otro con `id.x` / `id.y`. Referencia: `content/diagrams/Metodos/InduccionSimulation.tsx`.
- **Botones independientes en cualquier orden**: prefiere que cada botón sea solo un reloj propio y combina los relojes en una expresión (p. ej. el instante en que ocurren dos sucesos es `min(t₁ − retardo, t₂)`), en vez de usar `effects`. Así el estado es función pura de los controles: funciona en cualquier orden, con los pasos y en el editor.

### Expresiones
`visibleWhen`, las coordenadas `expression` y las reglas admiten como máximo **512 caracteres**. Para condiciones largas, guarda resultados intermedios en puntos `expression` ocultos (`"visible": false`) y léelos con `id.x` / `id.y` (p. ej. un punto `llegadas12` cuyo `x` cuenta las flechas que llegan a $b_1$).

## 3. Pasos de Demostración (`steps`)
```json
{
  "id": "paso-1",
  "label": "Construcción auxiliar",
  "description": "Texto explicativo pedagógico del paso",
  "durationMs": 1200,
  "visibleTargets": ["pA", "pB", "pC", "segAB", "segBC", "segCA", "pAux", "lineAux", "animT"],
  "objectStates": {
    "animT": { "value": 1 },
    "pAux": { "emphasis": "primary" },
    "lineAux": { "emphasis": "primary" }
  }
}
```
- **`durationMs`**: Duración de la animación/transición del paso (milisegundos, por defecto `1800` si se omite).
- **`objectStates[id].value`**: Asigna el valor del deslizador temporal en este paso; la transición lo interpola suavemente provocando el movimiento de geometrías dependientes con `expression`.
- **Regla pedagógica:** `visibleTargets` debe incluir siempre la figura base para no desorientar al alumno.

## 4. Traducciones (`translations`)
Todo texto visible debe existir en `eu` y `en`. Claves por idioma (todas opcionales):
```json
"translations": {
  "eu": {
    "title": "…", "note": "…",
    "steps": { "paso-1": { "label": "…", "description": "…", "overlays": { "objId": { "title": "…", "content": "…" } } } },
    "labels": { "objId": "…" },
    "titles": { "panelId": "…" },
    "texts": { "annotationId": "…" },
    "descriptions": { "objId": "…" },
    "ariaLabels": { "objId": "…" },
    "rules": { "panelId": ["…", "", "…"] },
    "blocks": { "panelId": { "blockId": { "title": "…", "text": "…", "rules": ["…"] } } }
  }
}
```
- `labels`: `label` de puntos, trazados y controles (botones/deslizadores). **No pongas en `labels` los paneles sin título**: si falta `titles`, `labels` se usa como título del panel y en `eu`/`en` aparece un título que en castellano no existe.
- `titles` / `texts`: `content.title` / `content.text` de anotaciones (`panel`, `label`, `measurement`); conserva `{value}` y el LaTeX tal cual.
- `ariaLabels`: `selection.ariaLabel` (lector de pantalla). Tradúcelas también.
- `rules`: textos de las variantes condicionales `content.rules`, **alineados por índice**; `""` hereda el texto en castellano.
- `blocks`: bloques `content.blocks` de paneles, por id de bloque (`title`, `text` y `rules` alineadas por índice). Las fórmulas puras no necesitan traducción.
- En el editor visual, al elegir EU/EN, el inspector muestra y edita estos textos directamente: se guardan en `translations` sin tocar el castellano.
- Las claves no declaradas en el esquema Zod (`schemaV3.ts`) se eliminan al parsear: si añades una nueva, declárala allí.
