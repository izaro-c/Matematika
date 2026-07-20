import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const TrianguloSpec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Triángulo",
  "componentId": "triangulo",
  "category": "Definiciones",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "viewport": {
    "bounds": [
      -5,
      5,
      5,
      -4.5
    ],
    "home": [
      -5,
      5,
      5,
      -4.5
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
  "groups": [],
  "points": [
    {
      "id": "A",
      "label": "A",
      "color": "musgo",
      "layerId": "geometry",
      "order": 790,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto A",
        "role": "primary"
      },
      "target": true,
      "targetId": "vertice-a",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -3,
      "y": -2,
      "showLabel": true,
      "fixed": false,
      "constraint": "free",
      "snapSize": 0.25,
      "attractorIds": [
        "equilateralAPlus",
        "equilateralAMinus",
        "thalesBC",
        "lineMediatrizBC",
        "perpCBB",
        "perpBCC"
      ],
      "attractorDistance": 0.31,
      "snatchDistance": 0.51
    },
    {
      "id": "B",
      "label": "B",
      "color": "musgo",
      "layerId": "geometry",
      "order": 800,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto B",
        "role": "primary"
      },
      "target": true,
      "targetId": "vertice-b",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 3.27,
      "y": -1.43,
      "showLabel": true,
      "fixed": false,
      "constraint": "free",
      "snapSize": 0.25,
      "attractorIds": [
        "equilateralBPlus",
        "equilateralBMinus",
        "thalesAC",
        "lineMediatrizAC",
        "perpCAC",
        "perpCAA"
      ],
      "attractorDistance": 0.31,
      "snatchDistance": 0.51
    },
    {
      "id": "C",
      "label": "C",
      "color": "musgo",
      "layerId": "geometry",
      "order": 810,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto C",
        "role": "primary"
      },
      "target": true,
      "targetId": "vertice-c",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -1.99,
      "y": 3.94,
      "showLabel": true,
      "fixed": false,
      "constraint": "free",
      "snapSize": 0.25,
      "attractorIds": [
        "equilateralCPlus",
        "equilateralCMinus",
        "thalesAB",
        "lineMediatrizAB",
        "perpBAA",
        "perpABB"
      ],
      "attractorDistance": 0.31,
      "snatchDistance": 0.51
    },
    {
      "id": "pA",
      "label": "A",
      "color": "terracota",
      "layerId": "geometry",
      "order": 2000,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto A",
        "role": "primary"
      },
      "target": false,
      "targetId": "pA",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -3,
      "y": -2,
      "showLabel": true,
      "fixed": false,
      "constraint": "constrained",
      "constraintIds": [
        "constraint6"
      ]
    },
    {
      "id": "pB",
      "label": "B",
      "color": "terracota",
      "layerId": "geometry",
      "order": 3000,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto B",
        "role": "primary"
      },
      "target": false,
      "targetId": "pB",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 3.27,
      "y": -1.43,
      "showLabel": true,
      "fixed": false,
      "constraint": "constrained",
      "constraintIds": [
        "constraint5"
      ]
    },
    {
      "id": "pC",
      "label": "C",
      "color": "terracota",
      "layerId": "geometry",
      "order": 4000,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto C",
        "role": "primary"
      },
      "target": false,
      "targetId": "pC",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -1.99,
      "y": 3.94,
      "showLabel": true,
      "fixed": false,
      "constraint": "constrained",
      "constraintIds": [
        "constraint4"
      ]
    },
    {
      "id": "equilateralAPlus",
      "label": "Posición equilátera de A (superior)",
      "color": "ocre",
      "layerId": "geometry",
      "order": 4100,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Imán equilátero superior para A",
        "role": "construction"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -2.118,
      "y": -2.522,
      "showLabel": false,
      "fixed": true,
      "constraint": "derived",
      "dependencies": [
        "B",
        "C"
      ],
      "xExpression": "(B.x+C.x)/2-sqrt(3)*(C.y-B.y)/2",
      "yExpression": "(B.y+C.y)/2+sqrt(3)*(C.x-B.x)/2"
    },
    {
      "id": "equilateralAMinus",
      "label": "Posición equilátera de A (inferior)",
      "color": "ocre",
      "layerId": "geometry",
      "order": 4200,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Imán equilátero inferior para A",
        "role": "construction"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 5.018,
      "y": 3.782,
      "showLabel": false,
      "fixed": true,
      "constraint": "derived",
      "dependencies": [
        "B",
        "C"
      ],
      "xExpression": "(B.x+C.x)/2+sqrt(3)*(C.y-B.y)/2",
      "yExpression": "(B.y+C.y)/2-sqrt(3)*(C.x-B.x)/2"
    },
    {
      "id": "equilateralBPlus",
      "label": "Posición equilátera de B (superior)",
      "color": "ocre",
      "layerId": "geometry",
      "order": 4300,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Imán equilátero superior para B",
        "role": "construction"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -5.746,
      "y": 2.623,
      "showLabel": false,
      "fixed": true,
      "constraint": "derived",
      "dependencies": [
        "A",
        "C"
      ],
      "xExpression": "(A.x+C.x)/2-sqrt(3)*(C.y-A.y)/2",
      "yExpression": "(A.y+C.y)/2+sqrt(3)*(C.x-A.x)/2"
    },
    {
      "id": "equilateralBMinus",
      "label": "Posición equilátera de B (inferior)",
      "color": "ocre",
      "layerId": "geometry",
      "order": 4400,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Imán equilátero inferior para B",
        "role": "construction"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 2.376,
      "y": -1.933,
      "showLabel": false,
      "fixed": true,
      "constraint": "derived",
      "dependencies": [
        "A",
        "C"
      ],
      "xExpression": "(A.x+C.x)/2+sqrt(3)*(C.y-A.y)/2",
      "yExpression": "(A.y+C.y)/2-sqrt(3)*(C.x-A.x)/2"
    },
    {
      "id": "equilateralCPlus",
      "label": "Posición equilátera de C (superior)",
      "color": "ocre",
      "layerId": "geometry",
      "order": 4500,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Imán equilátero superior para C",
        "role": "construction"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -0.359,
      "y": 3.715,
      "showLabel": false,
      "fixed": true,
      "constraint": "derived",
      "dependencies": [
        "A",
        "B"
      ],
      "xExpression": "(A.x+B.x)/2-sqrt(3)*(B.y-A.y)/2",
      "yExpression": "(A.y+B.y)/2+sqrt(3)*(B.x-A.x)/2"
    },
    {
      "id": "equilateralCMinus",
      "label": "Posición equilátera de C (inferior)",
      "color": "ocre",
      "layerId": "geometry",
      "order": 4600,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Imán equilátero inferior para C",
        "role": "construction"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 0.629,
      "y": -7.145,
      "showLabel": false,
      "fixed": true,
      "constraint": "derived",
      "dependencies": [
        "A",
        "B"
      ],
      "xExpression": "(A.x+B.x)/2+sqrt(3)*(B.y-A.y)/2",
      "yExpression": "(A.y+B.y)/2-sqrt(3)*(B.x-A.x)/2"
    }
  ],
  "elements": [
    {
      "id": "poly",
      "label": "Triángulo ABC",
      "color": "musgo",
      "layerId": "geometry",
      "order": 820,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo ABC",
        "role": "secondary"
      },
      "target": true,
      "targetId": "triangulo",
      "style": {
        "strokeWidth": 3,
        "fillOpacity": 0.14,
        "highlightFillOpacity": 0.28,
        "preserveColorOnHighlight": true
      },
      "kind": "polygon",
      "refs": [
        "A",
        "B",
        "C"
      ]
    },
    {
      "id": "AB",
      "label": "Lado AB",
      "color": "musgo",
      "layerId": "geometry",
      "order": 830,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado AB",
        "role": "secondary"
      },
      "target": true,
      "targetId": "lado-ab",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "A",
        "B"
      ]
    },
    {
      "id": "BC",
      "label": "Lado BC",
      "color": "musgo",
      "layerId": "geometry",
      "order": 840,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado BC",
        "role": "secondary"
      },
      "target": true,
      "targetId": "lado-bc",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "B",
        "C"
      ]
    },
    {
      "id": "CA",
      "label": "Lado CA",
      "color": "musgo",
      "layerId": "geometry",
      "order": 850,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado CA",
        "role": "secondary"
      },
      "target": true,
      "targetId": "lado-ca",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "C",
        "A"
      ]
    },
    {
      "id": "midAB",
      "label": "Punto medio de AB",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1000,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto medio de AB",
        "role": "secondary"
      },
      "target": false,
      "targetId": "midAB",
      "style": {
        "preserveColorOnHighlight": true
      },
      "kind": "midpoint",
      "refs": [
        "A",
        "B"
      ]
    },
    {
      "id": "lineMediatrizAB",
      "label": "Mediatriz de AB",
      "color": "pavo",
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
      "target": false,
      "targetId": "lineMediatrizAB",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "perpendicular",
      "refs": [
        "A",
        "B",
        "midAB"
      ],
      "dashed": true
    },
    {
      "id": "thalesAB",
      "label": "Circunferencia de Tales de AB",
      "color": "pavo",
      "layerId": "geometry",
      "order": 1010,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Imán de ángulo recto sobre AB",
        "role": "construction"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "circle",
      "refs": [
        "midAB",
        "A"
      ],
      "dashed": true
    },
    {
      "id": "midAC",
      "label": "Punto medio de AC",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1000,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto medio de AC",
        "role": "secondary"
      },
      "target": false,
      "targetId": "midAC",
      "style": {
        "preserveColorOnHighlight": true
      },
      "kind": "midpoint",
      "refs": [
        "A",
        "C"
      ]
    },
    {
      "id": "lineMediatrizAC",
      "label": "Mediatriz de AC",
      "color": "pavo",
      "layerId": "geometry",
      "order": 1000,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mediatriz de AC",
        "role": "secondary"
      },
      "target": false,
      "targetId": "lineMediatrizAC",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "perpendicular",
      "refs": [
        "A",
        "C",
        "midAC"
      ],
      "dashed": true
    },
    {
      "id": "thalesAC",
      "label": "Circunferencia de Tales de AC",
      "color": "pavo",
      "layerId": "geometry",
      "order": 1020,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Imán de ángulo recto sobre AC",
        "role": "construction"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "circle",
      "refs": [
        "midAC",
        "A"
      ],
      "dashed": true
    },
    {
      "id": "midBC",
      "label": "Punto medio de BC",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1000,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto medio de BC",
        "role": "secondary"
      },
      "target": false,
      "targetId": "midBC",
      "style": {
        "preserveColorOnHighlight": true
      },
      "kind": "midpoint",
      "refs": [
        "B",
        "C"
      ]
    },
    {
      "id": "lineMediatrizBC",
      "label": "Mediatriz de BC",
      "color": "pavo",
      "layerId": "geometry",
      "order": 1000,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mediatriz de BC",
        "role": "secondary"
      },
      "target": false,
      "targetId": "lineMediatrizBC",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "perpendicular",
      "refs": [
        "B",
        "C",
        "midBC"
      ],
      "dashed": true
    },
    {
      "id": "thalesBC",
      "label": "Circunferencia de Tales de BC",
      "color": "pavo",
      "layerId": "geometry",
      "order": 1030,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Imán de ángulo recto sobre BC",
        "role": "construction"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "circle",
      "refs": [
        "midBC",
        "B"
      ],
      "dashed": true
    },
    {
      "id": "perpBAA",
      "label": "Perpendicular",
      "color": "pavo",
      "layerId": "geometry",
      "order": 5000,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Perpendicular",
        "role": "secondary"
      },
      "target": true,
      "targetId": "perpBAA",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "perpendicular",
      "refs": [
        "pB",
        "pA",
        "A"
      ]
    },
    {
      "id": "perpABB",
      "label": "Perpendicular",
      "color": "pavo",
      "layerId": "geometry",
      "order": 6000,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Perpendicular",
        "role": "secondary"
      },
      "target": false,
      "targetId": "perpABB",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "perpendicular",
      "refs": [
        "pA",
        "pB",
        "B"
      ]
    },
    {
      "id": "perpCBB",
      "label": "Perpendicular",
      "color": "pavo",
      "layerId": "geometry",
      "order": 7000,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Perpendicular",
        "role": "secondary"
      },
      "target": false,
      "targetId": "perpCBB",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "perpendicular",
      "refs": [
        "pC",
        "pB",
        "B"
      ]
    },
    {
      "id": "perpBCC",
      "label": "Perpendicular",
      "color": "pavo",
      "layerId": "geometry",
      "order": 8000,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Perpendicular",
        "role": "secondary"
      },
      "target": false,
      "targetId": "perpBCC",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "perpendicular",
      "refs": [
        "pB",
        "pC",
        "C"
      ]
    },
    {
      "id": "perpCAC",
      "label": "Perpendicular",
      "color": "pavo",
      "layerId": "geometry",
      "order": 9000,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Perpendicular",
        "role": "secondary"
      },
      "target": false,
      "targetId": "perpCAC",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "perpendicular",
      "refs": [
        "pC",
        "pA",
        "C"
      ]
    },
    {
      "id": "perpCAA",
      "label": "Perpendicular",
      "color": "pavo",
      "layerId": "geometry",
      "order": 10000,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Perpendicular",
        "role": "secondary"
      },
      "target": true,
      "targetId": "perpCAA",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": false
      },
      "kind": "perpendicular",
      "refs": [
        "pC",
        "pA",
        "A"
      ]
    },
    {
      "id": "nonReflexAngleABC",
      "label": "Ángulo no reflejo (≤ 180°)",
      "color": "ocre",
      "layerId": "geometry",
      "order": 11000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "nonReflexAngleABC",
      "style": {
        "angleRadius": 1,
        "preserveColorOnHighlight": true
      },
      "kind": "nonReflexAngle",
      "refs": [
        "A",
        "B",
        "C"
      ],
      "properties": {
        "visibleWhen": "gte(nonReflexAngleABC.degrees,89.999999)"
      },
      "showLabel": false
    },
    {
      "id": "nonReflexAngleACB",
      "label": "Ángulo no reflejo (≤ 180°)",
      "color": "ocre",
      "layerId": "geometry",
      "order": 12000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "nonReflexAngleACB",
      "style": {
        "angleRadius": 1,
        "preserveColorOnHighlight": true
      },
      "kind": "nonReflexAngle",
      "refs": [
        "A",
        "C",
        "B"
      ],
      "properties": {
        "visibleWhen": "gte(nonReflexAngleACB.degrees,89.999999)"
      },
      "showLabel": false
    },
    {
      "id": "nonReflexAngleBAC",
      "label": "Ángulo no reflejo (≤ 180°)",
      "color": "ocre",
      "layerId": "geometry",
      "order": 13000,
      "visible": true,
      "locked": false,
      "groupIds": [],
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
        "B",
        "A",
        "C"
      ],
      "properties": {
        "visibleWhen": "gte(nonReflexAngleBAC.degrees,89.999999)"
      },
      "showLabel": false
    },
    {
      "id": "congruenceMarkBC",
      "label": "Marca de congruencia de Lado BC",
      "color": "terracota",
      "layerId": "geometry",
      "order": 14000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia de Lado BC",
        "role": "secondary"
      },
      "target": true,
      "targetId": "congruenceMarkBC",
      "style": {
        "strokeWidth": 2,
        "markHeight": 0.6,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "B",
        "C"
      ],
      "properties": {
        "markCount": 2,
        "visibleWhen": "or(approx(BC.length,AB.length,max(0.00000001,max(AB.length,BC.length,CA.length)*0.00000001)),approx(BC.length,CA.length,max(0.00000001,max(AB.length,BC.length,CA.length)*0.00000001)))"
      }
    },
    {
      "id": "congruenceMarkAB",
      "label": "Marca de congruencia de Lado AB",
      "color": "terracota",
      "layerId": "geometry",
      "order": 15000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia de Lado AB",
        "role": "secondary"
      },
      "target": true,
      "targetId": "congruenceMarkAB",
      "style": {
        "strokeWidth": 2,
        "markHeight": 0.6,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "A",
        "B"
      ],
      "properties": {
        "markCount": 2,
        "visibleWhen": "or(approx(AB.length,BC.length,max(0.00000001,max(AB.length,BC.length,CA.length)*0.00000001)),approx(AB.length,CA.length,max(0.00000001,max(AB.length,BC.length,CA.length)*0.00000001)))"
      }
    },
    {
      "id": "congruenceMarkCA",
      "label": "Marca de congruencia de Lado CA",
      "color": "terracota",
      "layerId": "geometry",
      "order": 16000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia de Lado CA",
        "role": "secondary"
      },
      "target": true,
      "targetId": "congruenceMarkCA",
      "style": {
        "strokeWidth": 2,
        "markHeight": 0.6,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "C",
        "A"
      ],
      "properties": {
        "markCount": 2,
        "visibleWhen": "or(approx(CA.length,AB.length,max(0.00000001,max(AB.length,BC.length,CA.length)*0.00000001)),approx(CA.length,BC.length,max(0.00000001,max(AB.length,BC.length,CA.length)*0.00000001)))"
      }
    },
    {
      "id": "infoPanel26",
      "label": "Panel informativo",
      "color": "musgo",
      "layerId": "geometry",
      "order": 17000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Panel informativo",
        "role": "secondary"
      },
      "target": true,
      "targetId": "infoPanel26",
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
        "infoPanelBlocks": [
          {
            "id": "por-lados",
            "text": "**Escaleno**",
            "rules": [
              {
                "when": "lte(abs((B.x-A.x)*(C.y-A.y)-(B.y-A.y)*(C.x-A.x)),max(0.0000000001,max(AB.length,BC.length,CA.length)^2*0.0000000001))",
                "text": "No definido: los vértices no forman un triángulo no degenerado",
                "color": "musgo"
              },
              {
                "when": "and(approx(AB.length,BC.length,max(0.00000001,max(AB.length,BC.length,CA.length)*0.00000001)),approx(BC.length,CA.length,max(0.00000001,max(AB.length,BC.length,CA.length)*0.00000001)))",
                "text": "**Equilátero**"
              },
              {
                "when": "or(approx(AB.length,BC.length,max(0.00000001,max(AB.length,BC.length,CA.length)*0.00000001)),approx(AB.length,CA.length,max(0.00000001,max(AB.length,BC.length,CA.length)*0.00000001)),approx(BC.length,CA.length,max(0.00000001,max(AB.length,BC.length,CA.length)*0.00000001)))",
                "text": "**Isósceles**"
              }
            ]
          },
          {
            "id": "por-angulos",
            "text": "*Acutángulo*",
            "rules": [
              {
                "when": "lte(abs((B.x-A.x)*(C.y-A.y)-(B.y-A.y)*(C.x-A.x)),max(0.0000000001,max(AB.length,BC.length,CA.length)^2*0.0000000001))",
                "text": "No definido: los vértices no forman un triángulo no degenerado"
              },
              {
                "when": "or(approx(nonReflexAngleABC.degrees,90,0.000001),approx(nonReflexAngleBAC.degrees,90,0.000001),approx(nonReflexAngleACB.degrees,90,0.000001))",
                "text": "*Rectángulo*"
              },
              {
                "when": "or(gt(nonReflexAngleABC.degrees,90.000001),gt(nonReflexAngleBAC.degrees,90.000001),gt(nonReflexAngleACB.degrees,90.000001))",
                "text": "*Obtusángulo*"
              }
            ]
          }
        ],
        "infoPanelLayout": "stack"
      },
      "showLabel": false
    }
  ],
  "sliders": [],
  "steps": [],
  "constraints": [
    {
      "id": "constraint4",
      "label": "Coincidir con un punto",
      "kind": "coincident",
      "refs": [
        "pC",
        "C"
      ],
      "enabled": true
    },
    {
      "id": "constraint5",
      "label": "Coincidir con un punto",
      "kind": "coincident",
      "refs": [
        "pB",
        "B"
      ],
      "enabled": true
    },
    {
      "id": "constraint6",
      "label": "Coincidir con un punto",
      "kind": "coincident",
      "refs": [
        "pA",
        "A"
      ],
      "enabled": true
    }
  ],
  "dependencies": [
    {
      "sourceId": "C",
      "targetId": "pC",
      "relation": "constraint",
      "constraintId": "constraint4"
    },
    {
      "sourceId": "B",
      "targetId": "pB",
      "relation": "constraint",
      "constraintId": "constraint5"
    },
    {
      "sourceId": "A",
      "targetId": "pA",
      "relation": "constraint",
      "constraintId": "constraint6"
    },
    {
      "sourceId": "B",
      "targetId": "equilateralAPlus",
      "relation": "expression"
    },
    {
      "sourceId": "C",
      "targetId": "equilateralAPlus",
      "relation": "expression"
    },
    {
      "sourceId": "B",
      "targetId": "equilateralAMinus",
      "relation": "expression"
    },
    {
      "sourceId": "C",
      "targetId": "equilateralAMinus",
      "relation": "expression"
    },
    {
      "sourceId": "A",
      "targetId": "equilateralBPlus",
      "relation": "expression"
    },
    {
      "sourceId": "C",
      "targetId": "equilateralBPlus",
      "relation": "expression"
    },
    {
      "sourceId": "A",
      "targetId": "equilateralBMinus",
      "relation": "expression"
    },
    {
      "sourceId": "C",
      "targetId": "equilateralBMinus",
      "relation": "expression"
    },
    {
      "sourceId": "A",
      "targetId": "equilateralCPlus",
      "relation": "expression"
    },
    {
      "sourceId": "B",
      "targetId": "equilateralCPlus",
      "relation": "expression"
    },
    {
      "sourceId": "A",
      "targetId": "equilateralCMinus",
      "relation": "expression"
    },
    {
      "sourceId": "B",
      "targetId": "equilateralCMinus",
      "relation": "expression"
    },
    {
      "sourceId": "midAB",
      "targetId": "thalesAB",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "thalesAB",
      "relation": "construction"
    },
    {
      "sourceId": "midAC",
      "targetId": "thalesAC",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "thalesAC",
      "relation": "construction"
    },
    {
      "sourceId": "midBC",
      "targetId": "thalesBC",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "thalesBC",
      "relation": "construction"
    },
    {
      "sourceId": "pB",
      "targetId": "perpBAA",
      "relation": "construction"
    },
    {
      "sourceId": "pA",
      "targetId": "perpBAA",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "perpBAA",
      "relation": "construction"
    },
    {
      "sourceId": "pA",
      "targetId": "perpABB",
      "relation": "construction"
    },
    {
      "sourceId": "pB",
      "targetId": "perpABB",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "perpABB",
      "relation": "construction"
    },
    {
      "sourceId": "pC",
      "targetId": "perpCBB",
      "relation": "construction"
    },
    {
      "sourceId": "pB",
      "targetId": "perpCBB",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "perpCBB",
      "relation": "construction"
    },
    {
      "sourceId": "pB",
      "targetId": "perpBCC",
      "relation": "construction"
    },
    {
      "sourceId": "pC",
      "targetId": "perpBCC",
      "relation": "construction"
    },
    {
      "sourceId": "C",
      "targetId": "perpBCC",
      "relation": "construction"
    },
    {
      "sourceId": "pC",
      "targetId": "perpCAC",
      "relation": "construction"
    },
    {
      "sourceId": "pA",
      "targetId": "perpCAC",
      "relation": "construction"
    },
    {
      "sourceId": "C",
      "targetId": "perpCAC",
      "relation": "construction"
    },
    {
      "sourceId": "pC",
      "targetId": "perpCAA",
      "relation": "construction"
    },
    {
      "sourceId": "pA",
      "targetId": "perpCAA",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "perpCAA",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "nonReflexAngleABC",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "nonReflexAngleABC",
      "relation": "construction"
    },
    {
      "sourceId": "C",
      "targetId": "nonReflexAngleABC",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "nonReflexAngleACB",
      "relation": "construction"
    },
    {
      "sourceId": "C",
      "targetId": "nonReflexAngleACB",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "nonReflexAngleACB",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "nonReflexAngleBAC",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "nonReflexAngleBAC",
      "relation": "construction"
    },
    {
      "sourceId": "C",
      "targetId": "nonReflexAngleBAC",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "congruenceMarkBC",
      "relation": "construction"
    },
    {
      "sourceId": "C",
      "targetId": "congruenceMarkBC",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "congruenceMarkAB",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "congruenceMarkAB",
      "relation": "construction"
    },
    {
      "sourceId": "C",
      "targetId": "congruenceMarkCA",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "congruenceMarkCA",
      "relation": "construction"
    },
    {
      "sourceId": "equilateralAPlus",
      "targetId": "A",
      "relation": "constraint"
    },
    {
      "sourceId": "equilateralAMinus",
      "targetId": "A",
      "relation": "constraint"
    },
    {
      "sourceId": "thalesBC",
      "targetId": "A",
      "relation": "constraint"
    },
    {
      "sourceId": "lineMediatrizBC",
      "targetId": "A",
      "relation": "constraint"
    },
    {
      "sourceId": "perpCBB",
      "targetId": "A",
      "relation": "constraint"
    },
    {
      "sourceId": "perpBCC",
      "targetId": "A",
      "relation": "constraint"
    },
    {
      "sourceId": "equilateralBPlus",
      "targetId": "B",
      "relation": "constraint"
    },
    {
      "sourceId": "equilateralBMinus",
      "targetId": "B",
      "relation": "constraint"
    },
    {
      "sourceId": "thalesAC",
      "targetId": "B",
      "relation": "constraint"
    },
    {
      "sourceId": "lineMediatrizAC",
      "targetId": "B",
      "relation": "constraint"
    },
    {
      "sourceId": "perpCAC",
      "targetId": "B",
      "relation": "constraint"
    },
    {
      "sourceId": "perpCAA",
      "targetId": "B",
      "relation": "constraint"
    },
    {
      "sourceId": "equilateralCPlus",
      "targetId": "C",
      "relation": "constraint"
    },
    {
      "sourceId": "equilateralCMinus",
      "targetId": "C",
      "relation": "constraint"
    },
    {
      "sourceId": "thalesAB",
      "targetId": "C",
      "relation": "constraint"
    },
    {
      "sourceId": "lineMediatrizAB",
      "targetId": "C",
      "relation": "constraint"
    },
    {
      "sourceId": "perpBAA",
      "targetId": "C",
      "relation": "constraint"
    },
    {
      "sourceId": "perpABB",
      "targetId": "C",
      "relation": "constraint"
    },
    {
      "sourceId": "CA",
      "targetId": "congruenceMarkCA",
      "relation": "expression"
    },
    {
      "sourceId": "AB",
      "targetId": "congruenceMarkCA",
      "relation": "expression"
    },
    {
      "sourceId": "BC",
      "targetId": "congruenceMarkCA",
      "relation": "expression"
    },
    {
      "sourceId": "CA",
      "targetId": "congruenceMarkAB",
      "relation": "expression"
    },
    {
      "sourceId": "AB",
      "targetId": "congruenceMarkAB",
      "relation": "expression"
    },
    {
      "sourceId": "BC",
      "targetId": "congruenceMarkAB",
      "relation": "expression"
    },
    {
      "sourceId": "CA",
      "targetId": "congruenceMarkBC",
      "relation": "expression"
    },
    {
      "sourceId": "AB",
      "targetId": "congruenceMarkBC",
      "relation": "expression"
    },
    {
      "sourceId": "BC",
      "targetId": "congruenceMarkBC",
      "relation": "expression"
    },
    {
      "sourceId": "nonReflexAngleABC",
      "targetId": "nonReflexAngleABC",
      "relation": "expression"
    },
    {
      "sourceId": "nonReflexAngleACB",
      "targetId": "nonReflexAngleACB",
      "relation": "expression"
    },
    {
      "sourceId": "nonReflexAngleBAC",
      "targetId": "nonReflexAngleBAC",
      "relation": "expression"
    },
    {
      "sourceId": "B",
      "targetId": "infoPanel26",
      "relation": "expression"
    },
    {
      "sourceId": "A",
      "targetId": "infoPanel26",
      "relation": "expression"
    },
    {
      "sourceId": "C",
      "targetId": "infoPanel26",
      "relation": "expression"
    },
    {
      "sourceId": "AB",
      "targetId": "infoPanel26",
      "relation": "expression"
    },
    {
      "sourceId": "BC",
      "targetId": "infoPanel26",
      "relation": "expression"
    },
    {
      "sourceId": "CA",
      "targetId": "infoPanel26",
      "relation": "expression"
    },
    {
      "sourceId": "nonReflexAngleABC",
      "targetId": "infoPanel26",
      "relation": "expression"
    },
    {
      "sourceId": "nonReflexAngleBAC",
      "targetId": "infoPanel26",
      "relation": "expression"
    },
    {
      "sourceId": "nonReflexAngleACB",
      "targetId": "infoPanel26",
      "relation": "expression"
    }
  ],
  "note": "Mueve A, B o C. El vértice arrastrado se ajusta temporalmente a posiciones equiláteras, isósceles y rectángulas, y vuelve a quedar libre al soltarlo.",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const Triangulo = () => <DiagramRenderer spec={TrianguloSpec} />;
