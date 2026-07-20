import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const ParalelasSpec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Rectas paralelas por un punto exterior",
  "componentId": "paralelas",
  "category": "Definiciones",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "viewport": {
    "bounds": [
      -5.5,
      4.5,
      5.5,
      -4
    ],
    "home": [
      -5.5,
      4.5,
      5.5,
      -4
    ],
    "minZoom": 0.55,
    "maxZoom": 5,
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
      "id": "annotations",
      "label": "Lecturas y controles",
      "order": 1,
      "visible": true,
      "locked": false
    }
  ],
  "groups": [
    {
      "id": "gParallel",
      "label": "Par de rectas paralelas",
      "memberIds": [
        "base",
        "parallel"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Par de rectas paralelas",
        "role": "primary"
      },
      "target": true,
      "targetId": "paralelas",
      "color": "musgo"
    }
  ],
  "points": [
    {
      "id": "A",
      "label": "A",
      "color": "musgo",
      "layerId": "geometry",
      "order": 450,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto A",
        "role": "primary"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -3,
      "y": -1.6,
      "showLabel": true,
      "fixed": false,
      "constraint": "free",
      "snapToGrid": true,
      "snapSize": 0.25
    },
    {
      "id": "B",
      "label": "B",
      "color": "musgo",
      "layerId": "geometry",
      "order": 460,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto B",
        "role": "primary"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 2.5,
      "y": -0.5,
      "showLabel": true,
      "fixed": false,
      "constraint": "free",
      "snapToGrid": true,
      "snapSize": 0.25
    },
    {
      "id": "P",
      "label": "P",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 470,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto P",
        "role": "primary"
      },
      "target": true,
      "targetId": "punto-p",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -0.5,
      "y": 2.2,
      "showLabel": true,
      "fixed": false,
      "constraint": "free",
      "snapToGrid": true,
      "snapSize": 0.25
    }
  ],
  "elements": [
    {
      "id": "base",
      "label": "Recta l",
      "color": "musgo",
      "layerId": "geometry",
      "order": 480,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gParallel"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta l",
        "role": "secondary"
      },
      "target": true,
      "targetId": "recta-base",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "line",
      "refs": [
        "A",
        "B"
      ]
    },
    {
      "id": "parallel",
      "label": "Recta m paralela a l",
      "color": "musgo",
      "layerId": "geometry",
      "order": 490,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gParallel"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta m paralela a l",
        "role": "secondary"
      },
      "target": true,
      "targetId": "recta-paralela",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "parallel",
      "refs": [
        "A",
        "B",
        "P"
      ],
      "dashed": true
    },
    {
      "id": "parallelInfo",
      "label": "Invariante",
      "color": "musgo",
      "layerId": "annotations",
      "order": 500,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Invariante",
        "role": "annotation"
      },
      "target": false,
      "style": {
        "preserveColorOnHighlight": true
      },
      "kind": "infoPanel",
      "refs": [],
      "text": "l ∥ m: comparten dirección y no comparten puntos.",
      "properties": {
        "title": "Invariante",
        "anchorMode": "viewport",
        "viewportPosition": [
          0.98,
          0.03
        ]
      }
    }
  ],
  "sliders": [],
  "steps": [],
  "dependencies": [],
  "note": "Mueve A y B para cambiar la dirección común; mueve P para elegir por dónde pasa la paralela.",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const Paralelas = () => <DiagramRenderer spec={ParalelasSpec} />;
