import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const PerpendicularSpec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Perpendicular",
  "componentId": "perpendicular",
  "category": "Definiciones",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "showLabels": true,
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
    }
  ],
  "groups": [],
  "points": [
    {
      "id": "pA",
      "label": "A",
      "color": "terracota",
      "layerId": "geometry",
      "order": 0,
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
      "x": -3.05,
      "y": -1.11,
      "showLabel": true,
      "fixed": false,
      "constraint": "free"
    },
    {
      "id": "pB",
      "label": "B",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1000,
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
      "x": 3.25,
      "y": 1.14,
      "showLabel": true,
      "fixed": false,
      "constraint": "free"
    },
    {
      "id": "pP",
      "label": "P",
      "color": "musgo",
      "layerId": "geometry",
      "order": 3000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto 3",
        "role": "primary"
      },
      "target": true,
      "targetId": "p3",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 0.17000000000000037,
      "y": 0.040000000000000036,
      "showLabel": true,
      "fixed": false,
      "constraint": "glider",
      "gliderTarget": "lineAB"
    },
    {
      "id": "p4",
      "label": "4",
      "color": "ocre",
      "layerId": "geometry",
      "order": 5000,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto 4",
        "role": "primary"
      },
      "target": false,
      "targetId": "p4",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -31.625443586631,
      "y": -50,
      "showLabel": true,
      "fixed": false,
      "constraint": "glider",
      "gliderTarget": "perpABP"
    },
    {
      "id": "p5",
      "label": "5",
      "color": "ocre",
      "layerId": "geometry",
      "order": 6000,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto 5",
        "role": "primary"
      },
      "target": false,
      "targetId": "p5",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 0,
      "y": 50,
      "showLabel": true,
      "fixed": false,
      "constraint": "glider",
      "gliderTarget": "perpABP"
    },
    {
      "id": "p6",
      "label": "6",
      "color": "ocre",
      "layerId": "geometry",
      "order": 11000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto 6",
        "role": "primary"
      },
      "target": true,
      "targetId": "p6",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 30,
      "y": 0.08384592179283312,
      "showLabel": true,
      "fixed": false,
      "constraint": "glider",
      "gliderTarget": "lineAB"
    },
    {
      "id": "p7",
      "label": "7",
      "color": "ocre",
      "layerId": "geometry",
      "order": 12000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto 7",
        "role": "primary"
      },
      "target": true,
      "targetId": "p7",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -30,
      "y": 0.9323477112952232,
      "showLabel": true,
      "fixed": false,
      "constraint": "glider",
      "gliderTarget": "lineAB"
    }
  ],
  "elements": [
    {
      "id": "lineAB",
      "label": "Recta",
      "color": "terracota",
      "layerId": "geometry",
      "order": 2000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta",
        "role": "secondary"
      },
      "target": true,
      "targetId": "lineAB",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "line",
      "refs": [
        "pA",
        "pB"
      ]
    },
    {
      "id": "perpABP",
      "label": "Perpendicular",
      "color": "musgo",
      "layerId": "geometry",
      "order": 4000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Perpendicular",
        "role": "secondary"
      },
      "target": true,
      "targetId": "perpABP",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "perpendicular",
      "refs": [
        "pA",
        "pB",
        "pP"
      ]
    },
    {
      "id": "perpendicularMarkBP4",
      "label": "Marca de perpendicularidad",
      "color": "ocre",
      "layerId": "geometry",
      "order": 7000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de perpendicularidad",
        "role": "secondary"
      },
      "target": true,
      "targetId": "perpendicularMarkBP4",
      "style": {
        "angleRadius": 1,
        "preserveColorOnHighlight": true
      },
      "kind": "perpendicularMark",
      "refs": [
        "p6",
        "pP",
        "p4"
      ]
    },
    {
      "id": "perpendicularMarkBP5",
      "label": "Marca de perpendicularidad",
      "color": "ocre",
      "layerId": "geometry",
      "order": 8000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de perpendicularidad",
        "role": "secondary"
      },
      "target": true,
      "targetId": "perpendicularMarkBP5",
      "style": {
        "angleRadius": 1,
        "preserveColorOnHighlight": true
      },
      "kind": "perpendicularMark",
      "refs": [
        "p6",
        "pP",
        "p5"
      ]
    },
    {
      "id": "perpendicularMarkAP5",
      "label": "Marca de perpendicularidad",
      "color": "ocre",
      "layerId": "geometry",
      "order": 9000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de perpendicularidad",
        "role": "secondary"
      },
      "target": true,
      "targetId": "perpendicularMarkAP5",
      "style": {
        "angleRadius": 1,
        "preserveColorOnHighlight": true
      },
      "kind": "perpendicularMark",
      "refs": [
        "p7",
        "pP",
        "p5"
      ]
    },
    {
      "id": "perpendicularMarkAP4",
      "label": "Marca de perpendicularidad",
      "color": "ocre",
      "layerId": "geometry",
      "order": 10000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de perpendicularidad",
        "role": "secondary"
      },
      "target": true,
      "targetId": "perpendicularMarkAP4",
      "style": {
        "angleRadius": 1,
        "preserveColorOnHighlight": true
      },
      "kind": "perpendicularMark",
      "refs": [
        "p7",
        "pP",
        "p4"
      ]
    }
  ],
  "sliders": [],
  "steps": [],
  "constraints": [],
  "dependencies": [
    {
      "sourceId": "pA",
      "targetId": "lineAB",
      "relation": "construction"
    },
    {
      "sourceId": "pB",
      "targetId": "lineAB",
      "relation": "construction"
    },
    {
      "sourceId": "pA",
      "targetId": "perpABP",
      "relation": "construction"
    },
    {
      "sourceId": "pB",
      "targetId": "perpABP",
      "relation": "construction"
    },
    {
      "sourceId": "pP",
      "targetId": "perpABP",
      "relation": "construction"
    },
    {
      "sourceId": "p7",
      "targetId": "perpendicularMarkAP5",
      "relation": "construction"
    },
    {
      "sourceId": "pP",
      "targetId": "perpendicularMarkAP5",
      "relation": "construction"
    },
    {
      "sourceId": "p5",
      "targetId": "perpendicularMarkAP5",
      "relation": "construction"
    },
    {
      "sourceId": "p6",
      "targetId": "perpendicularMarkBP5",
      "relation": "construction"
    },
    {
      "sourceId": "pP",
      "targetId": "perpendicularMarkBP5",
      "relation": "construction"
    },
    {
      "sourceId": "p5",
      "targetId": "perpendicularMarkBP5",
      "relation": "construction"
    },
    {
      "sourceId": "p7",
      "targetId": "perpendicularMarkAP4",
      "relation": "construction"
    },
    {
      "sourceId": "pP",
      "targetId": "perpendicularMarkAP4",
      "relation": "construction"
    },
    {
      "sourceId": "p4",
      "targetId": "perpendicularMarkAP4",
      "relation": "construction"
    },
    {
      "sourceId": "p6",
      "targetId": "perpendicularMarkBP4",
      "relation": "construction"
    },
    {
      "sourceId": "pP",
      "targetId": "perpendicularMarkBP4",
      "relation": "construction"
    },
    {
      "sourceId": "p4",
      "targetId": "perpendicularMarkBP4",
      "relation": "construction"
    }
  ],
  "note": "Arrastra A, B y P",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const Perpendicular = () => <DiagramRenderer spec={PerpendicularSpec} />;
