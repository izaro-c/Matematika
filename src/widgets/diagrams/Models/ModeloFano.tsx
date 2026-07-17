import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const ModeloFanoSpec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Plano de Fano",
  "componentId": "ModeloFano",
  "category": "Models",
  "mode": "diagram",
  "axis": false,
  "grid": false,
  "viewport": {
    "bounds": [
      -3.2,
      3.2,
      3.2,
      -3.2
    ],
    "home": [
      -3.2,
      3.2,
      3.2,
      -3.2
    ],
    "minZoom": 0.5,
    "maxZoom": 8,
    "padding": 0.12
  },
  "layers": [
    {
      "id": "rectas",
      "label": "Rectas",
      "order": 0,
      "visible": true,
      "locked": false
    },
    {
      "id": "puntos",
      "label": "Puntos",
      "order": 1,
      "visible": true,
      "locked": false
    },
    {
      "id": "anotaciones",
      "label": "Anotaciones",
      "order": 2,
      "visible": true,
      "locked": false
    }
  ],
  "groups": [],
  "points": [
    {
      "id": "p1",
      "label": "1",
      "color": "terracota",
      "layerId": "puntos",
      "order": 10,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Punto 1",
        "role": "primary"
      },
      "target": true,
      "targetId": "p1",
      "style": {
        "pointSize": 5,
        "highlightPointSize": 9,
        "preserveColorOnHighlight": true
      },
      "x": 0,
      "y": 2,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "p2",
      "label": "2",
      "color": "terracota",
      "layerId": "puntos",
      "order": 11,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Punto 2",
        "role": "primary"
      },
      "target": true,
      "targetId": "p2",
      "style": {
        "pointSize": 5,
        "highlightPointSize": 9,
        "preserveColorOnHighlight": true
      },
      "x": -1.732,
      "y": -1,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "p3",
      "label": "3",
      "color": "terracota",
      "layerId": "puntos",
      "order": 12,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Punto 3",
        "role": "primary"
      },
      "target": true,
      "targetId": "p3",
      "style": {
        "pointSize": 5,
        "highlightPointSize": 9,
        "preserveColorOnHighlight": true
      },
      "x": 1.732,
      "y": -1,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "p4",
      "label": "4",
      "color": "terracota",
      "layerId": "puntos",
      "order": 13,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Punto 4",
        "role": "primary"
      },
      "target": true,
      "targetId": "p4",
      "style": {
        "pointSize": 5,
        "highlightPointSize": 9,
        "preserveColorOnHighlight": true
      },
      "x": 0,
      "y": -1,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "p5",
      "label": "5",
      "color": "terracota",
      "layerId": "puntos",
      "order": 14,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Punto 5",
        "role": "primary"
      },
      "target": true,
      "targetId": "p5",
      "style": {
        "pointSize": 5,
        "highlightPointSize": 9,
        "preserveColorOnHighlight": true
      },
      "x": 0.866,
      "y": 0.5,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "p6",
      "label": "6",
      "color": "terracota",
      "layerId": "puntos",
      "order": 15,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Punto 6",
        "role": "primary"
      },
      "target": true,
      "targetId": "p6",
      "style": {
        "pointSize": 5,
        "highlightPointSize": 9,
        "preserveColorOnHighlight": true
      },
      "x": -0.866,
      "y": 0.5,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "p7",
      "label": "7",
      "color": "musgo",
      "layerId": "puntos",
      "order": 16,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Punto 7 (centro)",
        "role": "primary"
      },
      "target": true,
      "targetId": "p7",
      "style": {
        "pointSize": 5,
        "highlightPointSize": 9,
        "preserveColorOnHighlight": true
      },
      "x": 0,
      "y": 0,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "pCircR",
      "label": "radio l₇",
      "color": "musgo",
      "layerId": "rectas",
      "order": 1,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "x": 0,
      "y": -1,
      "fixed": true,
      "constraint": "fixed"
    }
  ],
  "elements": [
    {
      "id": "l1",
      "label": "l₁",
      "color": "carbon",
      "layerId": "rectas",
      "order": 10,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Recta l₁ (1–2)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "l1",
      "style": {
        "strokeWidth": 2,
        "highlightStrokeWidth": 4,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "p1",
        "p2"
      ]
    },
    {
      "id": "l2",
      "label": "l₂",
      "color": "carbon",
      "layerId": "rectas",
      "order": 11,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Recta l₂ (2–3)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "l2",
      "style": {
        "strokeWidth": 2,
        "highlightStrokeWidth": 4,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "p2",
        "p3"
      ]
    },
    {
      "id": "l3",
      "label": "l₃",
      "color": "carbon",
      "layerId": "rectas",
      "order": 12,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Recta l₃ (3–1)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "l3",
      "style": {
        "strokeWidth": 2,
        "highlightStrokeWidth": 4,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "p3",
        "p1"
      ]
    },
    {
      "id": "l4",
      "label": "l₄",
      "color": "carbon",
      "layerId": "rectas",
      "order": 13,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Recta l₄ (1–4)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "l4",
      "style": {
        "strokeWidth": 2,
        "highlightStrokeWidth": 4,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "p1",
        "p4"
      ]
    },
    {
      "id": "l5",
      "label": "l₅",
      "color": "carbon",
      "layerId": "rectas",
      "order": 14,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Recta l₅ (2–5)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "l5",
      "style": {
        "strokeWidth": 2,
        "highlightStrokeWidth": 4,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "p2",
        "p5"
      ]
    },
    {
      "id": "l6",
      "label": "l₆",
      "color": "carbon",
      "layerId": "rectas",
      "order": 15,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Recta l₆ (3–6)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "l6",
      "style": {
        "strokeWidth": 2,
        "highlightStrokeWidth": 4,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "p3",
        "p6"
      ]
    },
    {
      "id": "l7",
      "label": "l₇",
      "color": "musgo",
      "layerId": "rectas",
      "order": 16,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Recta l₇ (círculo interior: 4–5–6)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "l7",
      "style": {
        "strokeWidth": 1.5,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "circle",
      "refs": [
        "p7",
        "pCircR"
      ],
      "dashed": true
    },
    {
      "id": "info",
      "label": "7 puntos · 7 rectas",
      "color": "pavo",
      "layerId": "anotaciones",
      "order": 20,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "annotation"
      },
      "target": false,
      "style": {
        "strokeWidth": 0,
        "preserveColorOnHighlight": true
      },
      "kind": "infoPanel",
      "refs": [],
      "text": "7 puntos · 7 rectas · cada punto en 3 rectas · cada recta con 3 puntos",
      "properties": {
        "title": "PG(2,2)",
        "anchorMode": "viewport",
        "viewportPosition": [
          0,
          0
        ]
      }
    }
  ],
  "sliders": [],
  "steps": [],
  "constraints": [],
  "dependencies": [
    {
      "sourceId": "p1",
      "targetId": "l1",
      "relation": "construction"
    },
    {
      "sourceId": "p2",
      "targetId": "l1",
      "relation": "construction"
    },
    {
      "sourceId": "p2",
      "targetId": "l2",
      "relation": "construction"
    },
    {
      "sourceId": "p3",
      "targetId": "l2",
      "relation": "construction"
    },
    {
      "sourceId": "p3",
      "targetId": "l3",
      "relation": "construction"
    },
    {
      "sourceId": "p1",
      "targetId": "l3",
      "relation": "construction"
    },
    {
      "sourceId": "p1",
      "targetId": "l4",
      "relation": "construction"
    },
    {
      "sourceId": "p4",
      "targetId": "l4",
      "relation": "construction"
    },
    {
      "sourceId": "p2",
      "targetId": "l5",
      "relation": "construction"
    },
    {
      "sourceId": "p5",
      "targetId": "l5",
      "relation": "construction"
    },
    {
      "sourceId": "p3",
      "targetId": "l6",
      "relation": "construction"
    },
    {
      "sourceId": "p6",
      "targetId": "l6",
      "relation": "construction"
    },
    {
      "sourceId": "p7",
      "targetId": "l7",
      "relation": "construction"
    },
    {
      "sourceId": "pCircR",
      "targetId": "l7",
      "relation": "construction"
    }
  ],
  "note": "El plano proyectivo de orden 2 (PG(2,2)): el plano finito más pequeño. Cada punto pertenece a exactamente 3 rectas y cada recta contiene exactamente 3 puntos.",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const ModeloFano = () => <DiagramRenderer spec={ModeloFanoSpec} />;
