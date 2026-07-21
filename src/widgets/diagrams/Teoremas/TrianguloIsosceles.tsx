import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const TrianguloIsoscelesSpec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Triangulo Isósceles",
  "componentId": "triangulo-isosceles",
  "category": "Teoremas",
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
      "order": 9000,
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
      "x": -3.35,
      "y": -2.79,
      "showLabel": true,
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
      "x": 3.83,
      "y": -0.7,
      "showLabel": true,
      "fixed": false,
      "constraint": "free"
    },
    {
      "id": "pP",
      "label": "P",
      "color": "musgo",
      "layerId": "geometry",
      "order": 10000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto P",
        "role": "primary"
      },
      "target": true,
      "targetId": "pP",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -1.1933190511529765,
      "y": 3.1790338695111826,
      "showLabel": true,
      "fixed": false,
      "constraint": "glider",
      "gliderTarget": "lineMediatriz"
    },
    {
      "id": "p4",
      "label": "4",
      "color": "ocre",
      "layerId": "geometry",
      "order": 2000,
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
      "x": 0.2802461930667155,
      "y": 0.5189181708510687,
      "showLabel": true,
      "fixed": false,
      "constraint": "glider",
      "gliderTarget": "midAB"
    }
  ],
  "elements": [
    {
      "id": "segAB",
      "label": "Segmento AB",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento AB",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segAB",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "pA",
        "pB"
      ]
    },
    {
      "id": "midAB",
      "label": "M",
      "color": "musgo",
      "layerId": "geometry",
      "order": 7000,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto medio de AB",
        "role": "secondary"
      },
      "target": true,
      "targetId": "midAB",
      "style": {
        "preserveColorOnHighlight": true
      },
      "kind": "midpoint",
      "refs": [
        "pA",
        "pB"
      ]
    },
    {
      "id": "lineMediatriz",
      "label": "Mediatriz de AB",
      "color": "musgo",
      "layerId": "geometry",
      "order": 1000,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mediatriz de AB",
        "role": "secondary"
      },
      "target": true,
      "targetId": "lineMediatriz",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "perpendicular",
      "refs": [
        "pA",
        "pB",
        "midAB"
      ],
      "dashed": true
    },
    {
      "id": "segPA",
      "label": "Distancia PA",
      "color": "salvia",
      "layerId": "geometry",
      "order": 1000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Distancia PA",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segPA",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "pP",
        "pA"
      ],
      "dashed": false
    },
    {
      "id": "segPB",
      "label": "Distancia PB",
      "color": "salvia",
      "layerId": "geometry",
      "order": 1000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Distancia PB",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segPB",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "pP",
        "pB"
      ],
      "dashed": false
    },
    {
      "id": "congruenceMarkPB",
      "label": "Marca de congruencia",
      "color": "ocre",
      "layerId": "geometry",
      "order": 11000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia",
        "role": "secondary"
      },
      "target": true,
      "targetId": "congruenceMarkPB",
      "style": {
        "markHeight": 0.5,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "pP",
        "pB"
      ],
      "properties": {
        "markCount": 2
      }
    },
    {
      "id": "congruenceMarkAP",
      "label": "Marca de congruencia",
      "color": "ocre",
      "layerId": "geometry",
      "order": 12000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia",
        "role": "secondary"
      },
      "target": true,
      "targetId": "congruenceMarkAP",
      "style": {
        "markHeight": 0.5,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "pA",
        "pP"
      ],
      "properties": {
        "markCount": 2
      }
    },
    {
      "id": "measurementPB",
      "label": "Medición",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 13000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Medición",
        "role": "annotation"
      },
      "target": true,
      "targetId": "measurementPB",
      "style": {
        "preserveColorOnHighlight": true
      },
      "kind": "measurement",
      "refs": [
        "pP",
        "pB"
      ],
      "text": "PA = PB = {value}",
      "properties": {
        "expression": "segPB.length",
        "unit": "u",
        "precision": 2
      }
    }
  ],
  "sliders": [],
  "steps": [],
  "constraints": [],
  "dependencies": [
    {
      "sourceId": "pP",
      "targetId": "congruenceMarkPB",
      "relation": "construction"
    },
    {
      "sourceId": "pB",
      "targetId": "congruenceMarkPB",
      "relation": "construction"
    },
    {
      "sourceId": "pA",
      "targetId": "congruenceMarkAP",
      "relation": "construction"
    },
    {
      "sourceId": "pP",
      "targetId": "congruenceMarkAP",
      "relation": "construction"
    },
    {
      "sourceId": "pP",
      "targetId": "measurementPB",
      "relation": "construction"
    },
    {
      "sourceId": "pB",
      "targetId": "measurementPB",
      "relation": "construction"
    },
    {
      "sourceId": "segPB",
      "targetId": "measurementPB",
      "relation": "expression"
    }
  ],
  "note": "Arrastra P sobre la mediatriz",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const TrianguloIsosceles = () => <DiagramRenderer spec={TrianguloIsoscelesSpec} />;
