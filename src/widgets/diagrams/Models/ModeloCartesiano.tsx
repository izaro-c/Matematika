import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const ModeloCartesianoSpec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Modelo cartesiano ℝ²",
  "componentId": "ModeloCartesiano",
  "category": "Models",
  "mode": "simulation",
  "axis": true,
  "grid": true,
  "viewport": {
    "bounds": [
      -6,
      6,
      6,
      -6
    ],
    "home": [
      -6,
      6,
      6,
      -6
    ],
    "minZoom": 0.3,
    "maxZoom": 8,
    "padding": 0.1
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
      "id": "medidas",
      "label": "Medidas",
      "order": 2,
      "visible": true,
      "locked": false
    }
  ],
  "groups": [],
  "points": [
    {
      "id": "A",
      "label": "A",
      "color": "terracota",
      "layerId": "puntos",
      "order": 10,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Punto A",
        "role": "primary"
      },
      "target": true,
      "targetId": "A",
      "style": {
        "pointSize": 5,
        "highlightPointSize": 8,
        "preserveColorOnHighlight": true
      },
      "x": 1,
      "y": 2,
      "fixed": false,
      "constraint": "free"
    },
    {
      "id": "B",
      "label": "B",
      "color": "terracota",
      "layerId": "puntos",
      "order": 11,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Punto B",
        "role": "primary"
      },
      "target": true,
      "targetId": "B",
      "style": {
        "pointSize": 5,
        "highlightPointSize": 8,
        "preserveColorOnHighlight": true
      },
      "x": -3,
      "y": -1,
      "fixed": false,
      "constraint": "free"
    },
    {
      "id": "P",
      "label": "P",
      "color": "ocre",
      "layerId": "puntos",
      "order": 12,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Punto P",
        "role": "primary"
      },
      "target": true,
      "targetId": "P",
      "style": {
        "pointSize": 5,
        "highlightPointSize": 8,
        "preserveColorOnHighlight": true
      },
      "x": 3,
      "y": -2,
      "fixed": false,
      "constraint": "free"
    }
  ],
  "elements": [
    {
      "id": "lineAB",
      "label": "l",
      "color": "musgo",
      "layerId": "rectas",
      "order": 10,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Recta l por A y B",
        "role": "secondary"
      },
      "target": true,
      "targetId": "lineAB",
      "style": {
        "strokeWidth": 2.5,
        "highlightStrokeWidth": 4,
        "preserveColorOnHighlight": true
      },
      "kind": "line",
      "refs": [
        "A",
        "B"
      ]
    },
    {
      "id": "parallelP",
      "label": "l′",
      "color": "salvia",
      "layerId": "rectas",
      "order": 11,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Recta l′ paralela a l por P",
        "role": "secondary"
      },
      "target": true,
      "targetId": "parallelP",
      "style": {
        "strokeWidth": 2,
        "highlightStrokeWidth": 3.5,
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
      "id": "distAB",
      "label": "d(A,B)",
      "color": "pizarra",
      "layerId": "medidas",
      "order": 20,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "annotation"
      },
      "target": false,
      "style": {
        "textOffset": [
          -1.5,
          1.5
        ],
        "preserveColorOnHighlight": true
      },
      "kind": "measurement",
      "refs": [
        "A",
        "B"
      ],
      "text": "d(A, B) = {value}",
      "properties": {
        "precision": 2
      }
    },
    {
      "id": "infoCarte",
      "label": "ℝ²",
      "color": "pavo",
      "layerId": "medidas",
      "order": 30,
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
      "text": "puntos → $(x, y)\\\\$ rectas → $ax + by + c = 0\\\\$$l' ∥ l$ por $P$",
      "properties": {
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
      "sourceId": "A",
      "targetId": "lineAB",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "lineAB",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "parallelP",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "parallelP",
      "relation": "construction"
    },
    {
      "sourceId": "P",
      "targetId": "parallelP",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "distAB",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "distAB",
      "relation": "construction"
    }
  ],
  "note": "Arrastra A, B y P. La recta l′ permanece paralela a l.",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const ModeloCartesiano = () => <DiagramRenderer spec={ModeloCartesianoSpec} />;
