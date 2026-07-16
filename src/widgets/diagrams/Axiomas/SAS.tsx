import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const SASSpec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Axioma de Congruencia V",
  "componentId": "axioma-de-congruencia-v",
  "category": "Teoremas",
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
    }
  ],
  "groups": [
    {
      "id": "group1",
      "label": "Aldeak",
      "memberIds": [
        "pA",
        "pB",
        "pC",
        "pAA",
        "pBB",
        "pCC",
        "segAB",
        "segAC",
        "segAABB",
        "segAACC",
        "congruenceMarkAB",
        "congruenceMarkAC",
        "congruenceMarkAABB",
        "congruenceMarkAACC"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": true,
      "targetId": "sides"
    },
    {
      "id": "group2",
      "label": "Angeluak",
      "memberIds": [
        "nonReflexAngleBAC",
        "nonReflexAngleBBAACC"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": true,
      "targetId": "angles"
    },
    {
      "id": "group3",
      "label": "Guztia",
      "memberIds": [
        "pA",
        "pB",
        "pC",
        "pBB",
        "pCC",
        "pAA",
        "segAB",
        "segAC",
        "segBC",
        "nonReflexAngleBAC",
        "segAABB",
        "segAACC",
        "segBBCC",
        "nonReflexAngleBBAACC",
        "congruenceMarkAB",
        "congruenceMarkAC",
        "congruenceMarkAABB",
        "congruenceMarkAACC",
        "nonReflexAngleCBA",
        "nonReflexAngleACB",
        "nonReflexAngleBBCCAA",
        "nonReflexAngleAABBCC",
        "congruenceMarkBC",
        "congruenceMarkBBCC"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": true,
      "targetId": "all"
    }
  ],
  "points": [
    {
      "id": "pA",
      "label": "A",
      "color": "ocre",
      "layerId": "geometry",
      "order": 7000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group3"
      ],
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
      "x": -4.21,
      "y": 2.47,
      "fixed": false,
      "constraint": "free"
    },
    {
      "id": "pB",
      "label": "B",
      "color": "ocre",
      "layerId": "geometry",
      "order": 8000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group3"
      ],
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
      "x": -6,
      "y": -2.4,
      "fixed": false,
      "constraint": "free"
    },
    {
      "id": "pC",
      "label": "C",
      "color": "ocre",
      "layerId": "geometry",
      "order": 9000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group3"
      ],
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
      "x": -1.53,
      "y": -2,
      "fixed": false,
      "constraint": "free"
    },
    {
      "id": "pAA",
      "label": "A'",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 20000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto D",
        "role": "primary"
      },
      "target": true,
      "targetId": "pAA",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 3.07,
      "y": 2.76,
      "fixed": false,
      "constraint": "free"
    },
    {
      "id": "pBB",
      "label": "B'",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 22000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto D",
        "role": "primary"
      },
      "target": true,
      "targetId": "pBB",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 1.7598904992544793,
      "y": -2.2604196135439043,
      "fixed": false,
      "constraint": "constrained",
      "constraintIds": [
        "equalLengthsegAABB"
      ]
    },
    {
      "id": "pCC",
      "label": "C'",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 21000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group3",
        "group1"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto D",
        "role": "primary"
      },
      "target": true,
      "targetId": "pCC",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 6.17016740344622,
      "y": -1.42954198816643,
      "fixed": false,
      "constraint": "constrained",
      "constraintIds": [
        "equalLengthsegAACC",
        "equalAnglenonReflexAngleBBAACC"
      ]
    }
  ],
  "elements": [
    {
      "id": "segAB",
      "label": "Segmento",
      "color": "ocre",
      "layerId": "geometry",
      "order": 3000,
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
      "targetId": "segAB",
      "style": {
        "strokeWidth": 3.5,
        "highlightStrokeWidth": 5.5,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "pA",
        "pB"
      ]
    },
    {
      "id": "segAC",
      "label": "Segmento",
      "color": "pavo",
      "layerId": "geometry",
      "order": 4000,
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
      "targetId": "segAC",
      "style": {
        "strokeWidth": 3.5,
        "highlightStrokeWidth": 5.5,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "pA",
        "pC"
      ]
    },
    {
      "id": "segBC",
      "label": "Segmento",
      "color": "carbon",
      "layerId": "geometry",
      "order": 5000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group3"
      ],
      "selection": {
        "selectable": true,
        "highlightable": false,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segBC",
      "style": {
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "pB",
        "pC"
      ]
    },
    {
      "id": "nonReflexAngleBAC",
      "label": "$\\alpha$",
      "color": "terracota",
      "layerId": "geometry",
      "order": -2000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group2",
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "nonReflexAngleBAC",
      "style": {
        "angleRadius": 1,
        "preserveColorOnHighlight": true
      },
      "kind": "nonReflexAngle",
      "refs": [
        "pB",
        "pA",
        "pC"
      ]
    },
    {
      "id": "segAABB",
      "label": "Segmento",
      "color": "ocre",
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
      "targetId": "segAABB",
      "style": {
        "strokeWidth": 3.5,
        "highlightStrokeWidth": 5.5
      },
      "kind": "segment",
      "refs": [
        "pAA",
        "pBB"
      ],
      "dashed": true
    },
    {
      "id": "segAACC",
      "label": "Segmento",
      "color": "pavo",
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
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segAACC",
      "style": {
        "strokeWidth": 3.5,
        "highlightStrokeWidth": 5.5,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "pAA",
        "pCC"
      ],
      "dashed": true
    },
    {
      "id": "segBBCC",
      "label": "Segmento",
      "color": "carbon",
      "layerId": "geometry",
      "order": 15000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segBBCC",
      "style": {
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "pBB",
        "pCC"
      ],
      "dashed": true
    },
    {
      "id": "nonReflexAngleBBAACC",
      "label": "$\\alpha'$",
      "color": "terracota",
      "layerId": "geometry",
      "order": -1000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group2",
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "nonReflexAngleBBAACC",
      "style": {
        "angleRadius": 1,
        "preserveColorOnHighlight": true
      },
      "kind": "nonReflexAngle",
      "refs": [
        "pBB",
        "pAA",
        "pCC"
      ]
    },
    {
      "id": "congruenceMarkAB",
      "label": "Marca de congruencia de Segmento",
      "color": "ocre",
      "layerId": "geometry",
      "order": 16000,
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
      "target": true,
      "targetId": "congruenceMarkAB",
      "style": {
        "strokeWidth": 2,
        "markHeight": 0.75,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "pA",
        "pB"
      ],
      "properties": {
        "markCount": 1
      }
    },
    {
      "id": "congruenceMarkAC",
      "label": "Marca de congruencia de Segmento",
      "color": "pavo",
      "layerId": "geometry",
      "order": 17000,
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
      "target": true,
      "targetId": "congruenceMarkAC",
      "style": {
        "strokeWidth": 2,
        "fillOpacity": 0.11,
        "markHeight": 0.75,
        "highlightStrokeWidth": 4.8,
        "highlightFillOpacity": 0.26,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "pA",
        "pC"
      ],
      "properties": {
        "markCount": 2
      }
    },
    {
      "id": "congruenceMarkAABB",
      "label": "Marca de congruencia de Segmento",
      "color": "ocre",
      "layerId": "geometry",
      "order": 18000,
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
      "target": true,
      "targetId": "congruenceMarkAABB",
      "style": {
        "strokeWidth": 2,
        "markHeight": 0.75,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "pAA",
        "pBB"
      ],
      "properties": {
        "markCount": 1
      }
    },
    {
      "id": "congruenceMarkAACC",
      "label": "Marca de congruencia de Segmento",
      "color": "pavo",
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
      "target": true,
      "targetId": "congruenceMarkAACC",
      "style": {
        "strokeWidth": 2,
        "markHeight": 0.75,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "pAA",
        "pCC"
      ],
      "properties": {
        "markCount": 2
      }
    },
    {
      "id": "nonReflexAngleCBA",
      "label": "$\\space$",
      "color": "ocre",
      "layerId": "geometry",
      "order": 23000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "nonReflexAngleCBA",
      "style": {
        "strokeWidth": 0,
        "fillOpacity": 0,
        "angleRadius": 1,
        "preserveColorOnHighlight": true
      },
      "kind": "nonReflexAngle",
      "refs": [
        "pC",
        "pB",
        "pA"
      ]
    },
    {
      "id": "nonReflexAngleACB",
      "label": "$\\space$",
      "color": "pavo",
      "layerId": "geometry",
      "order": 24000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "nonReflexAngleACB",
      "style": {
        "strokeWidth": 0,
        "fillOpacity": 0,
        "angleRadius": 1,
        "preserveColorOnHighlight": true
      },
      "kind": "nonReflexAngle",
      "refs": [
        "pA",
        "pC",
        "pB"
      ]
    },
    {
      "id": "nonReflexAngleBBCCAA",
      "label": "$\\space$",
      "color": "pavo",
      "layerId": "geometry",
      "order": 25000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "nonReflexAngleBBCCAA",
      "style": {
        "strokeWidth": 0,
        "fillOpacity": 0,
        "angleRadius": 1,
        "preserveColorOnHighlight": true
      },
      "kind": "nonReflexAngle",
      "refs": [
        "pBB",
        "pCC",
        "pAA"
      ]
    },
    {
      "id": "nonReflexAngleAABBCC",
      "label": "$\\space$",
      "color": "ocre",
      "layerId": "geometry",
      "order": 26000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "nonReflexAngleAABBCC",
      "style": {
        "strokeWidth": 0,
        "fillOpacity": 0,
        "angleRadius": 1,
        "preserveColorOnHighlight": true
      },
      "kind": "nonReflexAngle",
      "refs": [
        "pAA",
        "pBB",
        "pCC"
      ]
    },
    {
      "id": "congruenceMarkBC",
      "label": "Marca de congruencia de Segmento",
      "color": "carbon",
      "layerId": "geometry",
      "order": 27000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia de Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "congruenceMarkBC",
      "style": {
        "strokeWidth": 0,
        "markHeight": 1,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "pB",
        "pC"
      ],
      "properties": {
        "markCount": 3
      }
    },
    {
      "id": "congruenceMarkBBCC",
      "label": "Marca de congruencia de Segmento",
      "color": "carbon",
      "layerId": "geometry",
      "order": 28000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia de Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "congruenceMarkBBCC",
      "style": {
        "strokeWidth": 0,
        "markHeight": 1,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "pBB",
        "pCC"
      ],
      "properties": {
        "markCount": 3
      }
    }
  ],
  "sliders": [],
  "steps": [],
  "constraints": [
    {
      "id": "equalLengthsegAABB",
      "label": "Segmento tiene la misma longitud que Segmento",
      "kind": "equalLength",
      "refs": [
        "pBB",
        "pAA",
        "segAB"
      ],
      "enabled": true
    },
    {
      "id": "equalLengthsegAACC",
      "label": "Segmento tiene la misma longitud que Segmento",
      "kind": "equalLength",
      "refs": [
        "pCC",
        "pAA",
        "segAC"
      ],
      "enabled": true
    },
    {
      "id": "equalAnglenonReflexAngleBBAACC",
      "label": "$\\alpha'$ tiene la misma amplitud que $\\alpha$",
      "kind": "equalAngle",
      "refs": [
        "pCC",
        "pAA",
        "pBB",
        "nonReflexAngleBAC",
        "nonReflexAngleBBAACC"
      ],
      "enabled": true
    }
  ],
  "dependencies": [
    {
      "sourceId": "pA",
      "targetId": "segAB",
      "relation": "construction"
    },
    {
      "sourceId": "pB",
      "targetId": "segAB",
      "relation": "construction"
    },
    {
      "sourceId": "pA",
      "targetId": "segAC",
      "relation": "construction"
    },
    {
      "sourceId": "pC",
      "targetId": "segAC",
      "relation": "construction"
    },
    {
      "sourceId": "pB",
      "targetId": "segBC",
      "relation": "construction"
    },
    {
      "sourceId": "pC",
      "targetId": "segBC",
      "relation": "construction"
    },
    {
      "sourceId": "pB",
      "targetId": "nonReflexAngleBAC",
      "relation": "construction"
    },
    {
      "sourceId": "pA",
      "targetId": "nonReflexAngleBAC",
      "relation": "construction"
    },
    {
      "sourceId": "pC",
      "targetId": "nonReflexAngleBAC",
      "relation": "construction"
    },
    {
      "sourceId": "pAA",
      "targetId": "segAABB",
      "relation": "construction"
    },
    {
      "sourceId": "pBB",
      "targetId": "segAABB",
      "relation": "construction"
    },
    {
      "sourceId": "pAA",
      "targetId": "segAACC",
      "relation": "construction"
    },
    {
      "sourceId": "pCC",
      "targetId": "segAACC",
      "relation": "construction"
    },
    {
      "sourceId": "pBB",
      "targetId": "segBBCC",
      "relation": "construction"
    },
    {
      "sourceId": "pCC",
      "targetId": "segBBCC",
      "relation": "construction"
    },
    {
      "sourceId": "pBB",
      "targetId": "nonReflexAngleBBAACC",
      "relation": "construction"
    },
    {
      "sourceId": "pAA",
      "targetId": "nonReflexAngleBBAACC",
      "relation": "construction"
    },
    {
      "sourceId": "pCC",
      "targetId": "nonReflexAngleBBAACC",
      "relation": "construction"
    },
    {
      "sourceId": "pA",
      "targetId": "congruenceMarkAB",
      "relation": "construction"
    },
    {
      "sourceId": "pB",
      "targetId": "congruenceMarkAB",
      "relation": "construction"
    },
    {
      "sourceId": "pA",
      "targetId": "congruenceMarkAC",
      "relation": "construction"
    },
    {
      "sourceId": "pC",
      "targetId": "congruenceMarkAC",
      "relation": "construction"
    },
    {
      "sourceId": "pAA",
      "targetId": "congruenceMarkAABB",
      "relation": "construction"
    },
    {
      "sourceId": "pBB",
      "targetId": "congruenceMarkAABB",
      "relation": "construction"
    },
    {
      "sourceId": "pAA",
      "targetId": "congruenceMarkAACC",
      "relation": "construction"
    },
    {
      "sourceId": "pCC",
      "targetId": "congruenceMarkAACC",
      "relation": "construction"
    },
    {
      "sourceId": "pAA",
      "targetId": "pBB",
      "relation": "constraint",
      "constraintId": "equalLengthsegAABB"
    },
    {
      "sourceId": "segAB",
      "targetId": "pBB",
      "relation": "constraint",
      "constraintId": "equalLengthsegAABB"
    },
    {
      "sourceId": "pAA",
      "targetId": "pCC",
      "relation": "constraint",
      "constraintId": "equalLengthsegAACC"
    },
    {
      "sourceId": "segAC",
      "targetId": "pCC",
      "relation": "constraint",
      "constraintId": "equalLengthsegAACC"
    },
    {
      "sourceId": "pAA",
      "targetId": "pCC",
      "relation": "constraint",
      "constraintId": "equalAnglenonReflexAngleBBAACC"
    },
    {
      "sourceId": "pBB",
      "targetId": "pCC",
      "relation": "constraint",
      "constraintId": "equalAnglenonReflexAngleBBAACC"
    },
    {
      "sourceId": "nonReflexAngleBAC",
      "targetId": "pCC",
      "relation": "constraint",
      "constraintId": "equalAnglenonReflexAngleBBAACC"
    },
    {
      "sourceId": "pC",
      "targetId": "nonReflexAngleCBA",
      "relation": "construction"
    },
    {
      "sourceId": "pB",
      "targetId": "nonReflexAngleCBA",
      "relation": "construction"
    },
    {
      "sourceId": "pA",
      "targetId": "nonReflexAngleCBA",
      "relation": "construction"
    },
    {
      "sourceId": "pA",
      "targetId": "nonReflexAngleACB",
      "relation": "construction"
    },
    {
      "sourceId": "pC",
      "targetId": "nonReflexAngleACB",
      "relation": "construction"
    },
    {
      "sourceId": "pB",
      "targetId": "nonReflexAngleACB",
      "relation": "construction"
    },
    {
      "sourceId": "pBB",
      "targetId": "nonReflexAngleBBCCAA",
      "relation": "construction"
    },
    {
      "sourceId": "pCC",
      "targetId": "nonReflexAngleBBCCAA",
      "relation": "construction"
    },
    {
      "sourceId": "pAA",
      "targetId": "nonReflexAngleBBCCAA",
      "relation": "construction"
    },
    {
      "sourceId": "pAA",
      "targetId": "nonReflexAngleAABBCC",
      "relation": "construction"
    },
    {
      "sourceId": "pBB",
      "targetId": "nonReflexAngleAABBCC",
      "relation": "construction"
    },
    {
      "sourceId": "pCC",
      "targetId": "nonReflexAngleAABBCC",
      "relation": "construction"
    },
    {
      "sourceId": "pB",
      "targetId": "congruenceMarkBC",
      "relation": "construction"
    },
    {
      "sourceId": "pC",
      "targetId": "congruenceMarkBC",
      "relation": "construction"
    },
    {
      "sourceId": "pBB",
      "targetId": "congruenceMarkBBCC",
      "relation": "construction"
    },
    {
      "sourceId": "pCC",
      "targetId": "congruenceMarkBBCC",
      "relation": "construction"
    }
  ],
  "note": "Arrastra A, B y C",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const SAS = () => <DiagramRenderer spec={SASSpec} />;
