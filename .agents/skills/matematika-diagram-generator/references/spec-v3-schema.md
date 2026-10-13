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
    "type": "free" // "free" | "fixed" | "on-support" | "axis-x" | "axis-y" | "constrained"
  },
  "appearance": {
    "size": 6,
    "labelVisible": true
  }
}
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
    "strokeWidth": 2.5
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
    "ariaLabels": { "objId": "…" }
  }
}
```
- `labels`: `label` de puntos, trazados y controles (botones/deslizadores).
- `titles` / `texts`: `content.title` / `content.text` de anotaciones (`panel`, `label`, `measurement`); conserva `{value}` y el LaTeX tal cual.
- `ariaLabels`: `selection.ariaLabel` (lector de pantalla). Tradúcelas también.
- Las claves no declaradas en el esquema Zod (`schemaV3.ts`) se eliminan al parsear: si añades una nueva, declárala allí.
