import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const AnguloSpec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Ángulo",
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
      "x": 1.23,
      "y": 1.8,
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
      "id": "angleBOA",
      "label": "$\\alpha$",
      "color": "musgo",
      "layerId": "geometry",
      "order": 5000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo orientado",
        "role": "secondary"
      },
      "target": true,
      "targetId": "angleBOA",
      "style": {
        "angleRadius": 1,
        "preserveColorOnHighlight": true
      },
      "kind": "angle",
      "refs": [
        "pB",
        "pO",
        "pA"
      ]
    },
    {
      "id": "infoPanel4",
      "label": "Tipo de ángulo",
      "color": "musgo",
      "layerId": "geometry",
      "order": 6000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Panel informativo",
        "role": "secondary"
      },
      "target": true,
      "targetId": "infoPanel4",
      "style": {
        "preserveColorOnHighlight": true
      },
      "kind": "infoPanel",
      "refs": [],
      "text": "",
      "properties": {
        "anchorMode": "viewport",
        "viewportPosition": [
          0,
          0
        ],
        "textRules": [
          {
            "when": "and(gt(angleBOA.value, 0.05), lt(angleBOA.value, pi/2 - 0.05))",
            "text": "$\\text{Agudo }(0<\\alpha<\\pi/2)$"
          },
          {
            "when": "approx(angleBOA.value, pi/2, 0.05)",
            "text": "$\\text{Recto }(\\alpha=\\pi/2)$"
          },
          {
            "when": "and(gt(angleBOA.value, pi/2 + 0.05), lt(angleBOA.value, pi - 0.05))",
            "text": "$\\text{Obtuso }(\\pi / 2<\\alpha<\\pi)$"
          },
          {
            "when": "approx(angleBOA.value, pi, 0.05)",
            "text": "$\\text{Llano }(\\alpha=\\pi)$"
          },
          {
            "when": "and(gt(angleBOA.value, pi + 0.05), lt(angleBOA.value, 2*pi - 0.05))",
            "text": "$\\text{Cóncavo }(\\pi <\\alpha<2\\pi)$"
          }
        ]
      }
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
      "targetId": "angleBOA",
      "relation": "construction"
    },
    {
      "sourceId": "pO",
      "targetId": "angleBOA",
      "relation": "construction"
    },
    {
      "sourceId": "pA",
      "targetId": "angleBOA",
      "relation": "construction"
    },
    {
      "sourceId": "angleBOA",
      "targetId": "infoPanel4",
      "relation": "expression"
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
    }
  ],
  "note": "Mueve A y B",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const Angulo = () => <DiagramRenderer spec={AnguloSpec} />;
