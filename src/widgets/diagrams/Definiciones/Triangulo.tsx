import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const TrianguloSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
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
  "objects": [
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3,
        "y": -2
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {
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
      }
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 3.27,
        "y": -1.43
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {
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
      }
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -1.99,
        "y": 3.94
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {
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
      }
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3,
        "y": -2
      },
      "mobility": {
        "type": "constrained",
        "relationIds": [
          "constraint6"
        ]
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 3.27,
        "y": -1.43
      },
      "mobility": {
        "type": "constrained",
        "relationIds": [
          "constraint5"
        ]
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -1.99,
        "y": 3.94
      },
      "mobility": {
        "type": "constrained",
        "relationIds": [
          "constraint4"
        ]
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "(B.x+C.x)/2-sqrt(3)*(C.y-B.y)/2",
        "y": "(B.y+C.y)/2+sqrt(3)*(C.x-B.x)/2",
        "fallback": [
          -2.118,
          -2.522
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 7,
        "labelVisible": false,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "(B.x+C.x)/2+sqrt(3)*(C.y-B.y)/2",
        "y": "(B.y+C.y)/2-sqrt(3)*(C.x-B.x)/2",
        "fallback": [
          5.018,
          3.782
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 7,
        "labelVisible": false,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "(A.x+C.x)/2-sqrt(3)*(C.y-A.y)/2",
        "y": "(A.y+C.y)/2+sqrt(3)*(C.x-A.x)/2",
        "fallback": [
          -5.746,
          2.623
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 7,
        "labelVisible": false,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "(A.x+C.x)/2+sqrt(3)*(C.y-A.y)/2",
        "y": "(A.y+C.y)/2-sqrt(3)*(C.x-A.x)/2",
        "fallback": [
          2.376,
          -1.933
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 7,
        "labelVisible": false,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "(A.x+B.x)/2-sqrt(3)*(B.y-A.y)/2",
        "y": "(A.y+B.y)/2+sqrt(3)*(B.x-A.x)/2",
        "fallback": [
          -0.359,
          3.715
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 7,
        "labelVisible": false,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "(A.x+B.x)/2+sqrt(3)*(B.y-A.y)/2",
        "y": "(A.y+B.y)/2-sqrt(3)*(B.x-A.x)/2",
        "fallback": [
          0.629,
          -7.145
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 7,
        "labelVisible": false,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
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
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "A",
          "B",
          "C"
        ]
      },
      "appearance": {
        "strokeWidth": 3,
        "fillOpacity": 0.14,
        "highlightFillOpacity": 0.28,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "A",
          "B"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "B",
          "C"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "C",
          "A"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "point",
      "definition": {
        "type": "midpoint",
        "points": [
          "A",
          "B"
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "perpendicular",
          "linePoints": [
            "A",
            "B"
          ],
          "through": "midAB"
        }
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "circle",
        "center": "midAB",
        "point": "A"
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "point",
      "definition": {
        "type": "midpoint",
        "points": [
          "A",
          "C"
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "perpendicular",
          "linePoints": [
            "A",
            "C"
          ],
          "through": "midAC"
        }
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "circle",
        "center": "midAC",
        "point": "A"
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "point",
      "definition": {
        "type": "midpoint",
        "points": [
          "B",
          "C"
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "perpendicular",
          "linePoints": [
            "B",
            "C"
          ],
          "through": "midBC"
        }
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "circle",
        "center": "midBC",
        "point": "B"
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "perpendicular",
          "linePoints": [
            "pB",
            "pA"
          ],
          "through": "A"
        }
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "perpendicular",
          "linePoints": [
            "pA",
            "pB"
          ],
          "through": "B"
        }
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "perpendicular",
          "linePoints": [
            "pC",
            "pB"
          ],
          "through": "B"
        }
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "perpendicular",
          "linePoints": [
            "pB",
            "pC"
          ],
          "through": "C"
        }
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "perpendicular",
          "linePoints": [
            "pC",
            "pA"
          ],
          "through": "C"
        }
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "perpendicular",
          "linePoints": [
            "pC",
            "pA"
          ],
          "through": "A"
        }
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": false
      }
    },
    {
      "id": "nonReflexAngleABC",
      "label": "Ángulo no reflejo (≤ 180°)",
      "color": "ocre",
      "layerId": "geometry",
      "order": 11000,
      "visible": true,
      "visibleWhen": "gte(nonReflexAngleABC.degrees,89.999999)",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "nonReflexAngleABC",
      "objectType": "angle",
      "points": [
        "A",
        "B",
        "C"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 1,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "nonReflexAngleACB",
      "label": "Ángulo no reflejo (≤ 180°)",
      "color": "ocre",
      "layerId": "geometry",
      "order": 12000,
      "visible": true,
      "visibleWhen": "gte(nonReflexAngleACB.degrees,89.999999)",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "nonReflexAngleACB",
      "objectType": "angle",
      "points": [
        "A",
        "C",
        "B"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 1,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "nonReflexAngleBAC",
      "label": "Ángulo no reflejo (≤ 180°)",
      "color": "ocre",
      "layerId": "geometry",
      "order": 13000,
      "visible": true,
      "visibleWhen": "gte(nonReflexAngleBAC.degrees,89.999999)",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "nonReflexAngleBAC",
      "objectType": "angle",
      "points": [
        "B",
        "A",
        "C"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 1,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "congruenceMarkBC",
      "label": "Marca de congruencia de Lado BC",
      "color": "terracota",
      "layerId": "geometry",
      "order": 14000,
      "visible": true,
      "visibleWhen": "or(approx(BC.length,AB.length,max(0.00000001,max(AB.length,BC.length,CA.length)*0.00000001)),approx(BC.length,CA.length,max(0.00000001,max(AB.length,BC.length,CA.length)*0.00000001)))",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia de Lado BC",
        "role": "secondary"
      },
      "target": true,
      "targetId": "congruenceMarkBC",
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "B",
          "C"
        ]
      },
      "count": 2,
      "height": 0.6,
      "appearance": {
        "strokeWidth": 2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "congruenceMarkAB",
      "label": "Marca de congruencia de Lado AB",
      "color": "terracota",
      "layerId": "geometry",
      "order": 15000,
      "visible": true,
      "visibleWhen": "or(approx(AB.length,BC.length,max(0.00000001,max(AB.length,BC.length,CA.length)*0.00000001)),approx(AB.length,CA.length,max(0.00000001,max(AB.length,BC.length,CA.length)*0.00000001)))",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia de Lado AB",
        "role": "secondary"
      },
      "target": true,
      "targetId": "congruenceMarkAB",
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "A",
          "B"
        ]
      },
      "count": 2,
      "height": 0.6,
      "appearance": {
        "strokeWidth": 2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "congruenceMarkCA",
      "label": "Marca de congruencia de Lado CA",
      "color": "terracota",
      "layerId": "geometry",
      "order": 16000,
      "visible": true,
      "visibleWhen": "or(approx(CA.length,AB.length,max(0.00000001,max(AB.length,BC.length,CA.length)*0.00000001)),approx(CA.length,BC.length,max(0.00000001,max(AB.length,BC.length,CA.length)*0.00000001)))",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia de Lado CA",
        "role": "secondary"
      },
      "target": true,
      "targetId": "congruenceMarkCA",
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "C",
          "A"
        ]
      },
      "count": 2,
      "height": 0.6,
      "appearance": {
        "strokeWidth": 2,
        "preserveColorOnHighlight": true
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
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "",
        "blocks": [
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
        "layout": "stack"
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0,
          0
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [
    {
      "id": "constraint4",
      "label": "Coincidir con un punto",
      "enabled": true,
      "type": "coincident",
      "points": [
        "pC",
        "C"
      ]
    },
    {
      "id": "constraint5",
      "label": "Coincidir con un punto",
      "enabled": true,
      "type": "coincident",
      "points": [
        "pB",
        "B"
      ]
    },
    {
      "id": "constraint6",
      "label": "Coincidir con un punto",
      "enabled": true,
      "type": "coincident",
      "points": [
        "pA",
        "A"
      ]
    }
  ],
  "steps": [],
  "note": "Mueve A, B o C. El vértice arrastrado se ajusta temporalmente a posiciones equiláteras, isósceles y rectángulas, y vuelve a quedar libre al soltarlo."
}
);
/* @matematika-diagram-spec:end */

export const Triangulo = () => <DiagramRenderer spec={TrianguloSpec} />;
