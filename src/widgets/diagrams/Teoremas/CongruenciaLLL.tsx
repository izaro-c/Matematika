import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const CongruenciaLLLSpec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Criterio de congruencia LLL",
  "componentId": "criterio-de-congruencia-lll",
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
  "groups": [
    {
      "id": "group1",
      "label": "Congruencia Total",
      "memberIds": [
        "pA1",
        "pB1",
        "pC1",
        "pA2",
        "pB2",
        "pC2",
        "segA1B1",
        "segB1C1",
        "segA1C1",
        "segA2B2",
        "segB2C2",
        "segA2C2",
        "congruenceMarkA1C1",
        "congruenceMarkB1C1",
        "congruenceMarkA1B1",
        "congruenceMarkA2B2",
        "congruenceMarkB2C2",
        "congruenceMarkA2C2",
        "nonReflexAngleB1A1C1",
        "nonReflexAngleC1B1A1",
        "nonReflexAngleA1C1B1",
        "nonReflexAngleA2B2C2",
        "nonReflexAngleB2C2A2",
        "nonReflexAngleC2A2B2"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": true,
      "targetId": "congruencia-total"
    },
    {
      "id": "group2",
      "label": "ladosAB",
      "memberIds": [
        "pA1",
        "pB1",
        "pA2",
        "pB2",
        "segA1B1",
        "segA2B2",
        "congruenceMarkA1B1",
        "congruenceMarkA2B2"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": true,
      "targetId": "lados-AB"
    },
    {
      "id": "group3",
      "label": "ladosAC",
      "memberIds": [
        "pA1",
        "pC1",
        "pA2",
        "pC2",
        "segA1C1",
        "segA2C2",
        "congruenceMarkA1C1",
        "congruenceMarkA2C2"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": true,
      "targetId": "lados-AC"
    },
    {
      "id": "group4",
      "label": "ladosBC",
      "memberIds": [
        "pB1",
        "pC1",
        "pB2",
        "pC2",
        "segB1C1",
        "segB2C2",
        "congruenceMarkB1C1"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": true,
      "targetId": "lados-BC"
    }
  ],
  "points": [
    {
      "id": "pA1",
      "label": "A",
      "color": "terracota",
      "layerId": "geometry",
      "order": 31000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group2",
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto A",
        "role": "primary"
      },
      "target": true,
      "targetId": "pA1",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -3.05,
      "y": 0.58,
      "showLabel": true,
      "fixed": false,
      "constraint": "free"
    },
    {
      "id": "pB1",
      "label": "B",
      "color": "terracota",
      "layerId": "geometry",
      "order": 30000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group2",
        "group4"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto B",
        "role": "primary"
      },
      "target": true,
      "targetId": "pB1",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 2.96,
      "y": 0.63,
      "showLabel": true,
      "fixed": false,
      "constraint": "free"
    },
    {
      "id": "pC1",
      "label": "C",
      "color": "terracota",
      "layerId": "geometry",
      "order": 29000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group3",
        "group4"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto C",
        "role": "primary"
      },
      "target": true,
      "targetId": "pC1",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -0.05,
      "y": 5,
      "showLabel": true,
      "fixed": false,
      "constraint": "free"
    },
    {
      "id": "pA2",
      "label": "A'",
      "color": "pavo",
      "layerId": "geometry",
      "order": 28000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group2",
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto D",
        "role": "primary"
      },
      "target": true,
      "targetId": "pA2",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -3.1,
      "y": -1.09,
      "showLabel": true,
      "fixed": false,
      "constraint": "free"
    },
    {
      "id": "pB2",
      "label": "B'",
      "color": "pavo",
      "layerId": "geometry",
      "order": 27000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group2",
        "group4"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto A",
        "role": "primary"
      },
      "target": true,
      "targetId": "pB2",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 2.9101956648599523,
      "y": -1.077831594244687,
      "showLabel": true,
      "fixed": false,
      "constraint": "constrained",
      "constraintIds": [
        "equalLengthsegA2B2"
      ]
    },
    {
      "id": "pC2",
      "label": "C",
      "color": "pavo",
      "layerId": "geometry",
      "order": 26000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group3",
        "group4"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto A",
        "role": "primary"
      },
      "target": true,
      "targetId": "pC2",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -0.05443987111835247,
      "y": -5.478731422787957,
      "showLabel": true,
      "fixed": false,
      "constraint": "constrained",
      "constraintIds": [
        "equalLengthsegB2C2",
        "equalLengthsegA2C2"
      ]
    }
  ],
  "elements": [
    {
      "id": "polygonA1B1C1",
      "label": "Polígono",
      "color": "terracota",
      "layerId": "geometry",
      "order": 6000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Polígono",
        "role": "secondary"
      },
      "target": false,
      "targetId": "polygonA1B1C1",
      "style": {
        "preserveColorOnHighlight": true
      },
      "kind": "polygon",
      "refs": [
        "pA1",
        "pB1",
        "pC1"
      ]
    },
    {
      "id": "polygonA2B2C2",
      "label": "Polígono",
      "color": "pavo",
      "layerId": "geometry",
      "order": 7000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Polígono",
        "role": "secondary"
      },
      "target": false,
      "targetId": "polygonA2B2C2",
      "style": {
        "preserveColorOnHighlight": true
      },
      "kind": "polygon",
      "refs": [
        "pA2",
        "pB2",
        "pC2"
      ]
    },
    {
      "id": "segA1B1",
      "label": "Segmento",
      "color": "terracota",
      "layerId": "geometry",
      "order": 8000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group2"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segA1B1",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "pA1",
        "pB1"
      ]
    },
    {
      "id": "segB1C1",
      "label": "Segmento",
      "color": "terracota",
      "layerId": "geometry",
      "order": 9000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group4"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segB1C1",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "pB1",
        "pC1"
      ]
    },
    {
      "id": "segA1C1",
      "label": "Segmento",
      "color": "terracota",
      "layerId": "geometry",
      "order": 10000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segA1C1",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "pA1",
        "pC1"
      ]
    },
    {
      "id": "segA2B2",
      "label": "Segmento",
      "color": "pavo",
      "layerId": "geometry",
      "order": 11000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group2"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segA2B2",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "pA2",
        "pB2"
      ]
    },
    {
      "id": "segB2C2",
      "label": "Segmento",
      "color": "pavo",
      "layerId": "geometry",
      "order": 12000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group4"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segB2C2",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "pB2",
        "pC2"
      ]
    },
    {
      "id": "segA2C2",
      "label": "Segmento",
      "color": "pavo",
      "layerId": "geometry",
      "order": 13000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segA2C2",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "pA2",
        "pC2"
      ]
    },
    {
      "id": "congruenceMarkA1C1",
      "label": "Marca de congruencia de Segmento",
      "color": "ocre",
      "layerId": "geometry",
      "order": 14000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia de Segmento",
        "role": "secondary"
      },
      "target": false,
      "targetId": "congruenceMarkA1C1",
      "style": {
        "strokeWidth": 2,
        "markHeight": 0.6,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "pA1",
        "pC1"
      ],
      "properties": {
        "markCount": 2
      }
    },
    {
      "id": "congruenceMarkB1C1",
      "label": "Marca de congruencia de Segmento",
      "color": "ocre",
      "layerId": "geometry",
      "order": 15000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group4"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia de Segmento",
        "role": "secondary"
      },
      "target": false,
      "targetId": "congruenceMarkB1C1",
      "style": {
        "strokeWidth": 2,
        "markHeight": 0.6,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "pB1",
        "pC1"
      ],
      "properties": {
        "markCount": 3
      }
    },
    {
      "id": "congruenceMarkA1B1",
      "label": "Marca de congruencia de Segmento",
      "color": "ocre",
      "layerId": "geometry",
      "order": 16000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group2"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia de Segmento",
        "role": "secondary"
      },
      "target": false,
      "targetId": "congruenceMarkA1B1",
      "style": {
        "strokeWidth": 2,
        "markHeight": 0.6,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "pA1",
        "pB1"
      ],
      "properties": {
        "markCount": 1
      }
    },
    {
      "id": "congruenceMarkA2B2",
      "label": "Marca de congruencia de Segmento",
      "color": "ocre",
      "layerId": "geometry",
      "order": 17000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group2"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia de Segmento",
        "role": "secondary"
      },
      "target": false,
      "targetId": "congruenceMarkA2B2",
      "style": {
        "strokeWidth": 2,
        "markHeight": 0.6,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "pA2",
        "pB2"
      ],
      "properties": {
        "markCount": 1
      }
    },
    {
      "id": "congruenceMarkB2C2",
      "label": "Marca de congruencia de Segmento",
      "color": "ocre",
      "layerId": "geometry",
      "order": 18000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia de Segmento",
        "role": "secondary"
      },
      "target": false,
      "targetId": "congruenceMarkB2C2",
      "style": {
        "strokeWidth": 2,
        "markHeight": 0.6,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "pB2",
        "pC2"
      ],
      "properties": {
        "markCount": 3
      }
    },
    {
      "id": "congruenceMarkA2C2",
      "label": "Marca de congruencia de Segmento",
      "color": "ocre",
      "layerId": "geometry",
      "order": 19000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia de Segmento",
        "role": "secondary"
      },
      "target": false,
      "targetId": "congruenceMarkA2C2",
      "style": {
        "strokeWidth": 2,
        "markHeight": 0.6,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "pA2",
        "pC2"
      ],
      "properties": {
        "markCount": 2
      }
    },
    {
      "id": "nonReflexAngleB1A1C1",
      "label": "Ángulo no reflejo (≤ 180°)",
      "color": "musgo",
      "layerId": "geometry",
      "order": 20000,
      "visible": false,
      "locked": false,
      "groupIds": [
        "group1"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": false,
      "targetId": "nonReflexAngleB1A1C1",
      "style": {
        "angleRadius": 1,
        "preserveColorOnHighlight": true
      },
      "kind": "nonReflexAngle",
      "refs": [
        "pB1",
        "pA1",
        "pC1"
      ],
      "showLabel": false
    },
    {
      "id": "nonReflexAngleC1B1A1",
      "label": "Ángulo no reflejo (≤ 180°)",
      "color": "musgo",
      "layerId": "geometry",
      "order": 21000,
      "visible": false,
      "locked": false,
      "groupIds": [
        "group1"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": false,
      "targetId": "nonReflexAngleC1B1A1",
      "style": {
        "angleRadius": 1,
        "preserveColorOnHighlight": true
      },
      "kind": "nonReflexAngle",
      "refs": [
        "pC1",
        "pB1",
        "pA1"
      ],
      "showLabel": false
    },
    {
      "id": "nonReflexAngleA1C1B1",
      "label": "Ángulo no reflejo (≤ 180°)",
      "color": "musgo",
      "layerId": "geometry",
      "order": 22000,
      "visible": false,
      "locked": false,
      "groupIds": [
        "group1"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": false,
      "targetId": "nonReflexAngleA1C1B1",
      "style": {
        "angleRadius": 1,
        "preserveColorOnHighlight": true
      },
      "kind": "nonReflexAngle",
      "refs": [
        "pA1",
        "pC1",
        "pB1"
      ],
      "showLabel": false
    },
    {
      "id": "nonReflexAngleA2B2C2",
      "label": "Ángulo no reflejo (≤ 180°)",
      "color": "musgo",
      "layerId": "geometry",
      "order": 23000,
      "visible": false,
      "locked": false,
      "groupIds": [
        "group1"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": false,
      "targetId": "nonReflexAngleA2B2C2",
      "style": {
        "angleRadius": 1,
        "preserveColorOnHighlight": true
      },
      "kind": "nonReflexAngle",
      "refs": [
        "pA2",
        "pB2",
        "pC2"
      ],
      "showLabel": false
    },
    {
      "id": "nonReflexAngleB2C2A2",
      "label": "Ángulo no reflejo (≤ 180°)",
      "color": "musgo",
      "layerId": "geometry",
      "order": 24000,
      "visible": false,
      "locked": false,
      "groupIds": [
        "group1"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": false,
      "targetId": "nonReflexAngleB2C2A2",
      "style": {
        "angleRadius": 1,
        "preserveColorOnHighlight": true
      },
      "kind": "nonReflexAngle",
      "refs": [
        "pB2",
        "pC2",
        "pA2"
      ],
      "showLabel": false
    },
    {
      "id": "nonReflexAngleC2A2B2",
      "label": "Ángulo no reflejo (≤ 180°)",
      "color": "musgo",
      "layerId": "geometry",
      "order": 25000,
      "visible": false,
      "locked": false,
      "groupIds": [
        "group1"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": false,
      "targetId": "nonReflexAngleC2A2B2",
      "style": {
        "angleRadius": 1,
        "preserveColorOnHighlight": true
      },
      "kind": "nonReflexAngle",
      "refs": [
        "pC2",
        "pA2",
        "pB2"
      ],
      "showLabel": false
    }
  ],
  "sliders": [],
  "steps": [],
  "constraints": [
    {
      "id": "equalLengthsegA2B2",
      "label": "Segmento tiene la misma longitud que Segmento",
      "kind": "equalLength",
      "refs": [
        "pB2",
        "pA2",
        "segA1B1"
      ],
      "enabled": true
    },
    {
      "id": "equalLengthsegB2C2",
      "label": "Segmento tiene la misma longitud que Segmento",
      "kind": "equalLength",
      "refs": [
        "pC2",
        "pB2",
        "segB1C1"
      ],
      "enabled": true
    },
    {
      "id": "equalLengthsegA2C2",
      "label": "Segmento tiene la misma longitud que Segmento",
      "kind": "equalLength",
      "refs": [
        "pC2",
        "pA2",
        "segA1C1"
      ],
      "enabled": true
    }
  ],
  "dependencies": [
    {
      "sourceId": "pA1",
      "targetId": "polygonA1B1C1",
      "relation": "construction"
    },
    {
      "sourceId": "pB1",
      "targetId": "polygonA1B1C1",
      "relation": "construction"
    },
    {
      "sourceId": "pC1",
      "targetId": "polygonA1B1C1",
      "relation": "construction"
    },
    {
      "sourceId": "pA2",
      "targetId": "polygonA2B2C2",
      "relation": "construction"
    },
    {
      "sourceId": "pB2",
      "targetId": "polygonA2B2C2",
      "relation": "construction"
    },
    {
      "sourceId": "pC2",
      "targetId": "polygonA2B2C2",
      "relation": "construction"
    },
    {
      "sourceId": "pA1",
      "targetId": "segA1B1",
      "relation": "construction"
    },
    {
      "sourceId": "pB1",
      "targetId": "segA1B1",
      "relation": "construction"
    },
    {
      "sourceId": "pB1",
      "targetId": "segB1C1",
      "relation": "construction"
    },
    {
      "sourceId": "pC1",
      "targetId": "segB1C1",
      "relation": "construction"
    },
    {
      "sourceId": "pA1",
      "targetId": "segA1C1",
      "relation": "construction"
    },
    {
      "sourceId": "pC1",
      "targetId": "segA1C1",
      "relation": "construction"
    },
    {
      "sourceId": "pA2",
      "targetId": "segA2B2",
      "relation": "construction"
    },
    {
      "sourceId": "pB2",
      "targetId": "segA2B2",
      "relation": "construction"
    },
    {
      "sourceId": "pB2",
      "targetId": "segB2C2",
      "relation": "construction"
    },
    {
      "sourceId": "pC2",
      "targetId": "segB2C2",
      "relation": "construction"
    },
    {
      "sourceId": "pA2",
      "targetId": "segA2C2",
      "relation": "construction"
    },
    {
      "sourceId": "pC2",
      "targetId": "segA2C2",
      "relation": "construction"
    },
    {
      "sourceId": "pA1",
      "targetId": "congruenceMarkA1C1",
      "relation": "construction"
    },
    {
      "sourceId": "pC1",
      "targetId": "congruenceMarkA1C1",
      "relation": "construction"
    },
    {
      "sourceId": "pB1",
      "targetId": "congruenceMarkB1C1",
      "relation": "construction"
    },
    {
      "sourceId": "pC1",
      "targetId": "congruenceMarkB1C1",
      "relation": "construction"
    },
    {
      "sourceId": "pA1",
      "targetId": "congruenceMarkA1B1",
      "relation": "construction"
    },
    {
      "sourceId": "pB1",
      "targetId": "congruenceMarkA1B1",
      "relation": "construction"
    },
    {
      "sourceId": "pA2",
      "targetId": "congruenceMarkA2B2",
      "relation": "construction"
    },
    {
      "sourceId": "pB2",
      "targetId": "congruenceMarkA2B2",
      "relation": "construction"
    },
    {
      "sourceId": "pA2",
      "targetId": "pB2",
      "relation": "constraint",
      "constraintId": "equalLengthsegA2B2"
    },
    {
      "sourceId": "segA1B1",
      "targetId": "pB2",
      "relation": "constraint",
      "constraintId": "equalLengthsegA2B2"
    },
    {
      "sourceId": "pB2",
      "targetId": "congruenceMarkB2C2",
      "relation": "construction"
    },
    {
      "sourceId": "pC2",
      "targetId": "congruenceMarkB2C2",
      "relation": "construction"
    },
    {
      "sourceId": "pB2",
      "targetId": "pC2",
      "relation": "constraint",
      "constraintId": "equalLengthsegB2C2"
    },
    {
      "sourceId": "segB1C1",
      "targetId": "pC2",
      "relation": "constraint",
      "constraintId": "equalLengthsegB2C2"
    },
    {
      "sourceId": "pA2",
      "targetId": "congruenceMarkA2C2",
      "relation": "construction"
    },
    {
      "sourceId": "pC2",
      "targetId": "congruenceMarkA2C2",
      "relation": "construction"
    },
    {
      "sourceId": "pA2",
      "targetId": "pC2",
      "relation": "constraint",
      "constraintId": "equalLengthsegA2C2"
    },
    {
      "sourceId": "segA1C1",
      "targetId": "pC2",
      "relation": "constraint",
      "constraintId": "equalLengthsegA2C2"
    },
    {
      "sourceId": "pB1",
      "targetId": "nonReflexAngleB1A1C1",
      "relation": "construction"
    },
    {
      "sourceId": "pA1",
      "targetId": "nonReflexAngleB1A1C1",
      "relation": "construction"
    },
    {
      "sourceId": "pC1",
      "targetId": "nonReflexAngleB1A1C1",
      "relation": "construction"
    },
    {
      "sourceId": "pC1",
      "targetId": "nonReflexAngleC1B1A1",
      "relation": "construction"
    },
    {
      "sourceId": "pB1",
      "targetId": "nonReflexAngleC1B1A1",
      "relation": "construction"
    },
    {
      "sourceId": "pA1",
      "targetId": "nonReflexAngleC1B1A1",
      "relation": "construction"
    },
    {
      "sourceId": "pA1",
      "targetId": "nonReflexAngleA1C1B1",
      "relation": "construction"
    },
    {
      "sourceId": "pC1",
      "targetId": "nonReflexAngleA1C1B1",
      "relation": "construction"
    },
    {
      "sourceId": "pB1",
      "targetId": "nonReflexAngleA1C1B1",
      "relation": "construction"
    },
    {
      "sourceId": "pA2",
      "targetId": "nonReflexAngleA2B2C2",
      "relation": "construction"
    },
    {
      "sourceId": "pB2",
      "targetId": "nonReflexAngleA2B2C2",
      "relation": "construction"
    },
    {
      "sourceId": "pC2",
      "targetId": "nonReflexAngleA2B2C2",
      "relation": "construction"
    },
    {
      "sourceId": "pB2",
      "targetId": "nonReflexAngleB2C2A2",
      "relation": "construction"
    },
    {
      "sourceId": "pC2",
      "targetId": "nonReflexAngleB2C2A2",
      "relation": "construction"
    },
    {
      "sourceId": "pA2",
      "targetId": "nonReflexAngleB2C2A2",
      "relation": "construction"
    },
    {
      "sourceId": "pC2",
      "targetId": "nonReflexAngleC2A2B2",
      "relation": "construction"
    },
    {
      "sourceId": "pA2",
      "targetId": "nonReflexAngleC2A2B2",
      "relation": "construction"
    },
    {
      "sourceId": "pB2",
      "targetId": "nonReflexAngleC2A2B2",
      "relation": "construction"
    }
  ],
  "note": "Arrastra A, B y C",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const CongruenciaLLL = () => <DiagramRenderer spec={CongruenciaLLLSpec} />;
