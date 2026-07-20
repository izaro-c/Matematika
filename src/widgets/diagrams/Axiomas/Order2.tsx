import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const Order2Spec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Axioma de Orden II",
  "componentId": "axioma-de-orden-ii",
  "category": "Axiomas",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "viewport": {
    "bounds": [
      -5,
      5,
      5,
      -5
    ],
    "home": [
      -5,
      5,
      5,
      -5
    ],
    "minZoom": 0.2,
    "maxZoom": 12,
    "padding": 0.16
  },
  "layers": [
    {
      "id": "geometry",
      "label": "Geometría",
      "order": 0,
      "visible": true,
      "locked": false
    },
    {
      "id": "controls",
      "label": "Controles",
      "order": 1,
      "visible": true,
      "locked": false
    },
    {
      "id": "layer3",
      "label": "Oculto",
      "order": 2,
      "visible": false,
      "locked": false
    }
  ],
  "groups": [],
  "points": [
    {
      "id": "pA",
      "label": "A",
      "color": "ocre",
      "layerId": "geometry",
      "order": 5000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto A",
        "role": "primary"
      },
      "target": true,
      "targetId": "pA",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -2.5,
      "y": 0,
      "fixed": false,
      "constraint": "glider",
      "gliderTarget": "lineDC"
    },
    {
      "id": "pC",
      "label": "C",
      "color": "ocre",
      "layerId": "geometry",
      "order": 6000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto B",
        "role": "primary"
      },
      "target": true,
      "targetId": "pB",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 4.5,
      "y": 0,
      "fixed": false,
      "constraint": "glider",
      "gliderTarget": "lineDC"
    },
    {
      "id": "pL",
      "label": "l",
      "color": "carbon",
      "layerId": "geometry",
      "order": 2000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto C",
        "role": "primary"
      },
      "target": true,
      "targetId": "pC",
      "style": {
        "pointSize": 0,
        "highlightPointSize": 0,
        "preserveColorOnHighlight": true
      },
      "x": 0,
      "y": 0,
      "fixed": false,
      "constraint": "free"
    },
    {
      "id": "pD",
      "label": "D",
      "color": "terracota",
      "layerId": "layer3",
      "order": 3000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto D",
        "role": "primary"
      },
      "target": true,
      "targetId": "pD",
      "x": 1,
      "y": 0,
      "fixed": false,
      "constraint": "free"
    },
    {
      "id": "pB",
      "label": "B",
      "color": "terracota",
      "layerId": "geometry",
      "order": 8000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto E",
        "role": "primary"
      },
      "target": true,
      "targetId": "pE",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 1,
      "y": 0,
      "fixed": false,
      "constraint": "glider",
      "gliderTarget": "segAB"
    }
  ],
  "elements": [
    {
      "id": "lineDC",
      "label": "Recta",
      "color": "carbon",
      "layerId": "geometry",
      "order": 4000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta",
        "role": "secondary"
      },
      "target": true,
      "targetId": "lineDC",
      "style": {
        "strokeWidth": 2,
        "highlightStrokeWidth": 2,
        "preserveColorOnHighlight": true
      },
      "kind": "line",
      "refs": [
        "pD",
        "pL"
      ]
    },
    {
      "id": "segAB",
      "label": "Segmento",
      "color": "carbon",
      "layerId": "layer3",
      "order": 7000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segAB",
      "kind": "segment",
      "refs": [
        "pA",
        "pC"
      ]
    }
  ],
  "sliders": [],
  "steps": [],
  "constraints": [],
  "dependencies": [
    {
      "sourceId": "pD",
      "targetId": "lineDC",
      "relation": "construction"
    },
    {
      "sourceId": "pL",
      "targetId": "lineDC",
      "relation": "construction"
    },
    {
      "sourceId": "pA",
      "targetId": "segAB",
      "relation": "construction"
    },
    {
      "sourceId": "pC",
      "targetId": "segAB",
      "relation": "construction"
    }
  ],
  "note": "Arrastra A, B y C",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const Order2 = () => <DiagramRenderer spec={Order2Spec} />;
