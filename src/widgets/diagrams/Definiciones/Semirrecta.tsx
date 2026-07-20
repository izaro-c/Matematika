import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const SemirrectaSpec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Semirrecta",
  "componentId": "semirrecta",
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
      "order": 4000,
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
      "x": 1.16,
      "y": 2.07,
      "showLabel": true,
      "fixed": false,
      "constraint": "free"
    },
    {
      "id": "pO",
      "label": "O",
      "color": "carbon",
      "layerId": "geometry",
      "order": 5000,
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
      "x": -2,
      "y": 0,
      "showLabel": true,
      "fixed": false,
      "constraint": "free"
    }
  ],
  "elements": [
    {
      "id": "lineOA",
      "label": "Recta",
      "color": "pizarra",
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
      "targetId": "lineOA",
      "style": {
        "strokeWidth": 1,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "line",
      "refs": [
        "pO",
        "pA"
      ],
      "dashed": true
    },
    {
      "id": "rayOA",
      "label": "Semirrecta",
      "color": "musgo",
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
    }
  ],
  "sliders": [],
  "steps": [],
  "constraints": [],
  "dependencies": [
    {
      "sourceId": "pO",
      "targetId": "lineOA",
      "relation": "construction"
    },
    {
      "sourceId": "pA",
      "targetId": "lineOA",
      "relation": "construction"
    },
    {
      "sourceId": "pO",
      "targetId": "rayOA",
      "relation": "construction"
    },
    {
      "sourceId": "pA",
      "targetId": "rayOA",
      "relation": "construction"
    }
  ],
  "note": "Arrastra el origen (O) o la dirección (A)",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const Semirrecta = () => <DiagramRenderer spec={SemirrectaSpec} />;
