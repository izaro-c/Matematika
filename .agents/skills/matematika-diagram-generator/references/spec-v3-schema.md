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
```

## 3. Pasos de Demostración (`steps`)
```json
{
  "id": "paso-1",
  "label": "Construcción auxiliar",
  "visibleTargets": ["pA", "pB", "pC", "segAB", "segBC", "segCA", "pAux", "lineAux"],
  "objectStates": {
    "pAux": { "emphasis": "primary" },
    "lineAux": { "emphasis": "primary" }
  }
}
```
**Regla pedagógica:** `visibleTargets` debe incluir siempre la figura base para no desorientar al alumno.
