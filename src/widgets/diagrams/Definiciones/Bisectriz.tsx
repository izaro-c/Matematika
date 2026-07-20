import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const BisectrizSpec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Bisectriz",
  "componentId": "angulo",
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
      "order": 7000,
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
      "x": 0.61,
      "y": 2.04,
      "showLabel": true,
      "fixed": false,
      "constraint": "free",
      "attractorIds": [
        "lineBO",
        "perpB4O"
      ]
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
      "x": 2,
      "y": 0,
      "showLabel": true,
      "fixed": false,
      "constraint": "free"
    },
    {
      "id": "pO",
      "label": "O",
      "color": "carbon",
      "layerId": "geometry",
      "order": 9000,
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
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 0,
      "y": 0,
      "showLabel": true,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "p4",
      "label": "4",
      "color": "ocre",
      "layerId": "geometry",
      "order": -1000,
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
        "pointSize": 0,
        "highlightPointSize": 0,
        "preserveColorOnHighlight": true
      },
      "x": 0,
      "y": 0,
      "showLabel": false,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "p4_copy",
      "label": "4 (copia)",
      "color": "ocre",
      "layerId": "geometry",
      "order": -999,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto 4",
        "role": "primary"
      },
      "target": false,
      "style": {
        "pointSize": 0,
        "highlightPointSize": 0,
        "preserveColorOnHighlight": true
      },
      "x": 0.5,
      "y": -0.5,
      "showLabel": false,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "p6",
      "label": "6",
      "color": "ocre",
      "layerId": "geometry",
      "order": 13000,
      "visible": false,
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
      "x": 1.9792905393397042,
      "y": 1.470954637714144,
      "showLabel": true,
      "fixed": false,
      "constraint": "glider",
      "gliderTarget": "bisAOB"
    }
  ],
  "elements": [
    {
      "id": "rayOA",
      "label": "Semirrecta",
      "color": "pavo",
      "layerId": "geometry",
      "order": 3000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Semirrecta",
        "role": "secondary"
      },
      "target": true,
      "targetId": "rayOA",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "ray",
      "refs": [
        "pO",
        "pA"
      ]
    },
    {
      "id": "rayOB",
      "label": "Semirrecta",
      "color": "pavo",
      "layerId": "geometry",
      "order": 4000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Semirrecta",
        "role": "secondary"
      },
      "target": true,
      "targetId": "rayOB",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "ray",
      "refs": [
        "pO",
        "pB"
      ]
    },
    {
      "id": "lineBO",
      "label": "Recta",
      "color": "pavo",
      "layerId": "geometry",
      "order": 10000,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta",
        "role": "secondary"
      },
      "target": false,
      "targetId": "lineBO",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "line",
      "refs": [
        "pB",
        "pO"
      ]
    },
    {
      "id": "perpB4O",
      "label": "Perpendicular",
      "color": "pavo",
      "layerId": "geometry",
      "order": 12000,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Perpendicular",
        "role": "secondary"
      },
      "target": true,
      "targetId": "perpB4O",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "perpendicular",
      "refs": [
        "pB",
        "p4",
        "pO"
      ]
    },
    {
      "id": "bisAOB",
      "label": "Bisectriz de AOB",
      "color": "pavo",
      "layerId": "geometry",
      "order": 1000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Bisectriz de AOB",
        "role": "secondary"
      },
      "target": true,
      "targetId": "bisAOB",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "angleBisector",
      "refs": [
        "pA",
        "pO",
        "pB"
      ],
      "dashed": true
    },
    {
      "id": "nonReflexAngleBO6",
      "label": "$\\alpha$",
      "color": "musgo",
      "layerId": "geometry",
      "order": 14000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "nonReflexAngleBO6",
      "style": {
        "angleRadius": 1,
        "preserveColorOnHighlight": true
      },
      "kind": "nonReflexAngle",
      "refs": [
        "pB",
        "pO",
        "p6"
      ]
    },
    {
      "id": "nonReflexAngle6OA",
      "label": "$\\alpha$",
      "color": "musgo",
      "layerId": "geometry",
      "order": 15000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "nonReflexAngle6OA",
      "style": {
        "angleRadius": 1,
        "preserveColorOnHighlight": true
      },
      "kind": "nonReflexAngle",
      "refs": [
        "p6",
        "pO",
        "pA"
      ]
    }
  ],
  "sliders": [],
  "steps": [],
  "constraints": [],
  "dependencies": [
    {
      "sourceId": "pO",
      "targetId": "rayOA",
      "relation": "construction"
    },
    {
      "sourceId": "pA",
      "targetId": "rayOA",
      "relation": "construction"
    },
    {
      "sourceId": "pO",
      "targetId": "rayOB",
      "relation": "construction"
    },
    {
      "sourceId": "pB",
      "targetId": "rayOB",
      "relation": "construction"
    },
    {
      "sourceId": "pB",
      "targetId": "lineBO",
      "relation": "construction"
    },
    {
      "sourceId": "pO",
      "targetId": "lineBO",
      "relation": "construction"
    },
    {
      "sourceId": "pB",
      "targetId": "perpB4O",
      "relation": "construction"
    },
    {
      "sourceId": "p4",
      "targetId": "perpB4O",
      "relation": "construction"
    },
    {
      "sourceId": "pO",
      "targetId": "perpB4O",
      "relation": "construction"
    },
    {
      "sourceId": "lineBO",
      "targetId": "pA",
      "relation": "constraint"
    },
    {
      "sourceId": "perpB4O",
      "targetId": "pA",
      "relation": "constraint"
    },
    {
      "sourceId": "pB",
      "targetId": "nonReflexAngleBO6",
      "relation": "construction"
    },
    {
      "sourceId": "pO",
      "targetId": "nonReflexAngleBO6",
      "relation": "construction"
    },
    {
      "sourceId": "p6",
      "targetId": "nonReflexAngleBO6",
      "relation": "construction"
    },
    {
      "sourceId": "p6",
      "targetId": "nonReflexAngle6OA",
      "relation": "construction"
    },
    {
      "sourceId": "pO",
      "targetId": "nonReflexAngle6OA",
      "relation": "construction"
    },
    {
      "sourceId": "pA",
      "targetId": "nonReflexAngle6OA",
      "relation": "construction"
    }
  ],
  "note": "Mueve A y B",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const Bisectriz = () => <DiagramRenderer spec={BisectrizSpec} />;
