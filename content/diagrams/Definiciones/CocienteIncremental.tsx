import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const CocienteIncrementalSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Cociente incremental y recta secante",
  "componentId": "cociente-incremental",
  "category": "Definiciones",
  "mode": "simulation",
  "axis": true,
  "grid": false,
  "viewport": {
    "bounds": [-5.5, 3, 5.5, -2.5],
    "home": [-5.5, 3, 5.5, -2.5],
    "minZoom": 0.5,
    "maxZoom": 4,
    "padding": 0.1
  },
  "layers": [
    { "id": "geometry", "label": "Geometría", "order": 0, "visible": true, "locked": false },
    { "id": "construction", "label": "Construcción", "order": 1, "visible": true, "locked": false },
    { "id": "annotations", "label": "Anotaciones", "order": 2, "visible": true, "locked": false }
  ],
  "groups": [],
  "objects": [
    {
      "id": "grafica",
      "label": "gráfica de f",
      "color": "carbon",
      "layerId": "geometry",
      "order": 5,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "role": "secondary", "ariaLabel": "Gráfica de la función f" },
      "target": true,
      "targetId": "grafica",
      "objectType": "path",
      "geometry": {
        "type": "function",
        "expression": "0.05*x^3 - 0.6*x + 0.3",
        "variable": "x",
        "domain": [-5.4, 5.4],
        "samples": 128,
        "areaFill": "none"
      },
      "appearance": { "strokeWidth": 2.2, "preserveColorOnHighlight": true }
    },
    {
      "id": "pX",
      "label": "x",
      "color": "carbon",
      "layerId": "geometry",
      "order": 40,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "role": "primary", "ariaLabel": "Mover el punto base x sobre el eje" },
      "target": true,
      "targetId": "pX",
      "objectType": "point",
      "definition": { "type": "coordinates", "x": -2.6, "y": 0 },
      "mobility": { "type": "axis-x", "coordinate": 0 },
      "appearance": { "size": 6, "labelVisible": true, "labelOffset": [-4, -14], "highlightSize": 9, "preserveColorOnHighlight": true },
      "interaction": { "snapToGrid": false }
    },
    {
      "id": "pXh",
      "label": "x + h",
      "color": "terracota",
      "layerId": "geometry",
      "order": 41,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "role": "primary", "ariaLabel": "Mover el punto x + h sobre el eje" },
      "target": true,
      "targetId": "pXh",
      "objectType": "point",
      "definition": { "type": "coordinates", "x": 1.6, "y": 0 },
      "mobility": { "type": "axis-x", "coordinate": 0 },
      "appearance": { "size": 6, "labelVisible": true, "labelOffset": [-4, -14], "highlightSize": 9, "preserveColorOnHighlight": true },
      "interaction": { "snapToGrid": false }
    },
    {
      "id": "pP",
      "label": "P",
      "color": "carbon",
      "layerId": "geometry",
      "order": 42,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "role": "primary", "ariaLabel": "Punto P = (x, f(x)) de la gráfica" },
      "target": true,
      "targetId": "pP",
      "objectType": "point",
      "definition": { "type": "expression", "x": "pX.x", "y": "0.05*pX.x^3 - 0.6*pX.x + 0.3", "fallback": [-2.6, 0.98] },
      "mobility": { "type": "fixed" },
      "appearance": { "size": 7, "labelVisible": true, "highlightSize": 10, "preserveColorOnHighlight": true }
    },
    {
      "id": "pQ",
      "label": "Q",
      "color": "terracota",
      "layerId": "geometry",
      "order": 43,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "role": "primary", "ariaLabel": "Punto Q = (x + h, f(x + h)) de la gráfica" },
      "target": true,
      "targetId": "pQ",
      "objectType": "point",
      "definition": { "type": "expression", "x": "pXh.x", "y": "0.05*pXh.x^3 - 0.6*pXh.x + 0.3", "fallback": [1.6, -0.46] },
      "mobility": { "type": "fixed" },
      "appearance": { "size": 7, "labelVisible": true, "highlightSize": 10, "preserveColorOnHighlight": true }
    },
    {
      "id": "pR",
      "label": "R",
      "color": "carbon",
      "layerId": "construction",
      "order": 44,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": false, "role": "construction" },
      "target": false,
      "objectType": "point",
      "definition": { "type": "expression", "x": "pXh.x", "y": "pP.y", "fallback": [1.6, 0.98] },
      "mobility": { "type": "fixed" },
      "appearance": { "size": 3, "labelVisible": false }
    },
    {
      "id": "pT",
      "label": "T",
      "color": "musgo",
      "layerId": "construction",
      "order": 45,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": false, "role": "construction" },
      "target": false,
      "objectType": "point",
      "definition": { "type": "expression", "x": "pX.x + 1", "y": "pP.y + 0.15*pX.x^2 - 0.6", "fallback": [-1.6, 1.4] },
      "mobility": { "type": "fixed" },
      "appearance": { "size": 3, "labelVisible": false }
    },
    {
      "id": "guiaX",
      "label": "vertical por x",
      "color": "carbon",
      "layerId": "construction",
      "order": 10,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": false, "role": "construction" },
      "target": false,
      "objectType": "path",
      "geometry": { "type": "segment", "points": ["pX", "pP"] },
      "appearance": { "strokeWidth": 1, "dashed": true }
    },
    {
      "id": "guiaXh",
      "label": "vertical por x + h",
      "color": "terracota",
      "layerId": "construction",
      "order": 11,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": false, "role": "construction" },
      "target": false,
      "objectType": "path",
      "geometry": { "type": "segment", "points": ["pXh", "pQ"] },
      "appearance": { "strokeWidth": 1, "dashed": true }
    },
    {
      "id": "tangente",
      "label": "tangente en P",
      "color": "musgo",
      "layerId": "geometry",
      "order": 15,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "role": "secondary", "ariaLabel": "Recta tangente a la gráfica en P" },
      "target": true,
      "targetId": "tangente",
      "objectType": "path",
      "geometry": { "type": "line", "construction": { "type": "through-points", "points": ["pP", "pT"] } },
      "appearance": { "strokeWidth": 1.8, "dashed": true, "preserveColorOnHighlight": true }
    },
    {
      "id": "secante",
      "label": "secante PQ",
      "color": "terracota",
      "layerId": "geometry",
      "order": 20,
      "visible": true,
      "visibleWhen": "gt(abs(pXh.x - pX.x), 0.05)",
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "role": "primary", "ariaLabel": "Recta secante por P y Q" },
      "target": true,
      "targetId": "secante",
      "objectType": "path",
      "geometry": { "type": "line", "construction": { "type": "through-points", "points": ["pP", "pQ"] } },
      "appearance": { "strokeWidth": 2.4, "preserveColorOnHighlight": true }
    },
    {
      "id": "segDx",
      "label": "Δx",
      "color": "ocre",
      "layerId": "geometry",
      "order": 25,
      "visible": true,
      "visibleWhen": "gt(abs(pXh.x - pX.x), 0.05)",
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "role": "primary", "ariaLabel": "Incremento Δx = h" },
      "target": true,
      "targetId": "segDx",
      "objectType": "path",
      "geometry": { "type": "segment", "points": ["pP", "pR"] },
      "appearance": { "strokeWidth": 2.6, "preserveColorOnHighlight": true }
    },
    {
      "id": "segDy",
      "label": "Δy",
      "color": "pavo",
      "layerId": "geometry",
      "order": 26,
      "visible": true,
      "visibleWhen": "gt(abs(pXh.x - pX.x), 0.05)",
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "role": "primary", "ariaLabel": "Variación Δy = f(x + h) − f(x)" },
      "target": true,
      "targetId": "segDy",
      "objectType": "path",
      "geometry": { "type": "segment", "points": ["pR", "pQ"] },
      "appearance": { "strokeWidth": 2.6, "preserveColorOnHighlight": true }
    },
    {
      "id": "panelCociente",
      "label": "Valor del cociente incremental",
      "color": "terracota",
      "layerId": "annotations",
      "order": 100,
      "visible": true,
      "visibleWhen": "gt(abs(pXh.x - pX.x), 0.05)",
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "role": "secondary", "ariaLabel": "Valor del cociente incremental y de la pendiente de la tangente" },
      "target": false,
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "",
        "blocks": [
          { "id": "bloque-h", "text": "$h = {pXh.x - pX.x}$", "precision": 2, "rules": [] },
          { "id": "bloque-cociente", "text": "$\\frac{\\Delta y}{\\Delta x} = {(pQ.y - pP.y) / (pXh.x - pX.x)}$", "precision": 2, "color": "terracota", "rules": [] },
          { "id": "bloque-tangente", "text": "$f'(x) = {0.15*pX.x^2 - 0.6}$", "precision": 2, "color": "musgo", "rules": [] }
        ],
        "layout": "stack"
      },
      "anchor": { "type": "viewport", "position": [0.02, 0.04] },
      "appearance": { "preserveColorOnHighlight": true }
    },
    {
      "id": "panelIndefinido",
      "label": "Cociente no definido",
      "color": "granada",
      "layerId": "annotations",
      "order": 101,
      "visible": true,
      "visibleWhen": "lte(abs(pXh.x - pX.x), 0.05)",
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "role": "secondary", "ariaLabel": "Con h = 0 el cociente no está definido" },
      "target": false,
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "",
        "blocks": [
          { "id": "bloque-indefinido", "text": "h = 0: el cociente no está definido", "color": "granada", "rules": [] }
        ],
        "layout": "stack"
      },
      "anchor": { "type": "viewport", "position": [0.02, 0.04] },
      "appearance": { "preserveColorOnHighlight": true }
    }
  ],
  "relations": [],
  "steps": [],
  "note": "Arrastra x y x + h por el eje: al acercar x + h a x, la secante tiende a la tangente.",
  "translations": {
    "eu": {
      "title": "Gehikuntza-zatidura eta zuzen ebakitzailea",
      "note": "Arrastatu x eta x + h ardatzean: x + h x-ra hurbiltzean, ebakitzailea ukitzailerantz doa.",
      "labels": {
        "grafica": "f-ren grafikoa",
        "tangente": "P-ko ukitzailea",
        "secante": "PQ ebakitzailea"
      },
      "ariaLabels": {
        "grafica": "f funtzioaren grafikoa",
        "pX": "Mugitu x oinarri-puntua ardatzean",
        "pXh": "Mugitu x + h puntua ardatzean",
        "pP": "Grafikoko P = (x, f(x)) puntua",
        "pQ": "Grafikoko Q = (x + h, f(x + h)) puntua",
        "tangente": "Grafikoaren zuzen ukitzailea P puntuan",
        "secante": "P eta Q puntuetatik doan zuzen ebakitzailea",
        "segDx": "Δx = h gehikuntza",
        "segDy": "Δy = f(x + h) − f(x) aldakuntza",
        "panelCociente": "Gehikuntza-zatiduraren eta ukitzailearen maldaren balioa",
        "panelIndefinido": "h = 0 denean zatidura ez dago definituta"
      },
      "blocks": {
        "panelIndefinido": { "bloque-indefinido": { "text": "h = 0: zatidura ez dago definituta" } }
      }
    },
    "en": {
      "title": "Difference quotient and secant line",
      "note": "Drag x and x + h along the axis: as x + h nears x, the secant tends to the tangent.",
      "labels": {
        "grafica": "graph of f",
        "tangente": "tangent at P",
        "secante": "secant PQ"
      },
      "ariaLabels": {
        "grafica": "Graph of the function f",
        "pX": "Move the base point x along the axis",
        "pXh": "Move the point x + h along the axis",
        "pP": "Point P = (x, f(x)) of the graph",
        "pQ": "Point Q = (x + h, f(x + h)) of the graph",
        "tangente": "Tangent line to the graph at P",
        "secante": "Secant line through P and Q",
        "segDx": "Increment Δx = h",
        "segDy": "Change Δy = f(x + h) − f(x)",
        "panelCociente": "Value of the difference quotient and of the tangent slope",
        "panelIndefinido": "With h = 0 the quotient is undefined"
      },
      "blocks": {
        "panelIndefinido": { "bloque-indefinido": { "text": "h = 0: the quotient is undefined" } }
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const CocienteIncremental = () => <DiagramRenderer spec={CocienteIncrementalSpec} />;
