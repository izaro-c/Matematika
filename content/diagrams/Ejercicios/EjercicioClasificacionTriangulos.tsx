import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const EjercicioClasificacionTriangulosSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Clasificación e Inspección de Triángulos",
  "componentId": "ejercicio-clasificacion-triangulos",
  "category": "Ejercicios",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "showLabels": true,
  "showHeader": false,
  "viewport": {
    "bounds": [
      -1,
      5.5,
      19,
      -2.5
    ],
    "home": [
      -1,
      5.5,
      19,
      -2.5
    ],
    "minZoom": 0.5,
    "maxZoom": 5,
    "padding": 0.05
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
      "label": "Anotaciones",
      "order": 1,
      "visible": true,
      "locked": false
    }
  ],
  "groups": [],
  "objects": [
    {
      "id": "pR1",
      "label": "R₁",
      "color": "canela",
      "layerId": "geometry",
      "order": 1000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértice R1",
        "role": "primary"
      },
      "target": true,
      "targetId": "pR1",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0,
        "y": 0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pR2",
      "label": "R₂",
      "color": "canela",
      "layerId": "geometry",
      "order": 1001,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértice R2",
        "role": "primary"
      },
      "target": true,
      "targetId": "pR2",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 4,
        "y": 0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pR3",
      "label": "C₁ ",
      "color": "canela",
      "layerId": "geometry",
      "order": 1002,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértice C1 móvil",
        "role": "primary"
      },
      "target": true,
      "targetId": "pR3",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2,
        "y": 3.4
      },
      "mobility": {
        "type": "constrained",
        "relationIds": [
          "constraint1"
        ]
      },
      "appearance": {
        "size": 9,
        "labelVisible": true,
        "highlightSize": 12,
        "preserveColorOnHighlight": true
      },
      "interaction": {
        "attractorIds": [
          "perpR2A1R1",
          "perpR1A1R2"
        ]
      }
    },
    {
      "id": "pA1",
      "label": "A₁",
      "color": "pavo",
      "layerId": "geometry",
      "order": 1010,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértice A1",
        "role": "primary"
      },
      "target": true,
      "targetId": "pA1",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 6,
        "y": 0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pA2",
      "label": "A₂",
      "color": "pavo",
      "layerId": "geometry",
      "order": 1011,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértice A2",
        "role": "primary"
      },
      "target": true,
      "targetId": "pA2",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 10,
        "y": 0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pA3",
      "label": "C₂ ",
      "color": "pavo",
      "layerId": "geometry",
      "order": 1012,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértice C2 móvil",
        "role": "primary"
      },
      "target": true,
      "targetId": "pA3",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 8,
        "y": 3.4
      },
      "mobility": {
        "type": "constrained",
        "relationIds": [
          "constraint2"
        ]
      },
      "appearance": {
        "size": 9,
        "labelVisible": true,
        "highlightSize": 12,
        "preserveColorOnHighlight": true
      },
      "interaction": {
        "attractorIds": [
          "perpR2A2A1",
          "perpA1O1A2"
        ]
      }
    },
    {
      "id": "pO1",
      "label": "O₁",
      "color": "mora",
      "layerId": "geometry",
      "order": 1020,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértice O1",
        "role": "primary"
      },
      "target": true,
      "targetId": "pO1",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 13,
        "y": 0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pO2",
      "label": "O₂",
      "color": "mora",
      "layerId": "geometry",
      "order": 1021,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértice O2",
        "role": "primary"
      },
      "target": true,
      "targetId": "pO2",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 17,
        "y": 0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pO3",
      "label": "C₃ ",
      "color": "mora",
      "layerId": "geometry",
      "order": 1022,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértice C3 móvil",
        "role": "primary"
      },
      "target": true,
      "targetId": "pO3",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 15,
        "y": 3.4
      },
      "mobility": {
        "type": "constrained",
        "relationIds": [
          "constraint3"
        ]
      },
      "appearance": {
        "size": 9,
        "labelVisible": true,
        "highlightSize": 12,
        "preserveColorOnHighlight": true
      },
      "interaction": {
        "attractorIds": [
          "perpA1O2O1",
          "perpA2O1O2"
        ]
      }
    },
    {
      "id": "pathR12",
      "label": "Rectángulo",
      "color": "canela",
      "layerId": "geometry",
      "order": 2000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado R1R2",
        "role": "secondary"
      },
      "target": true,
      "targetId": "pathR12",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pR1",
          "pR2"
        ]
      },
      "appearance": {
        "strokeWidth": 2.5,
        "labelVisible": true,
        "labelOffset": [
          0,
          -20
        ],
        "labelPosition": 0.25,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pathR13",
      "label": "Lado R1C1",
      "color": "canela",
      "layerId": "geometry",
      "order": 2001,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado R1C1",
        "role": "secondary"
      },
      "target": true,
      "targetId": "pathR13",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pR1",
          "pR3"
        ]
      },
      "appearance": {
        "strokeWidth": 2.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pathR23",
      "label": "Lado R2C1",
      "color": "canela",
      "layerId": "geometry",
      "order": 2002,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado R2C1",
        "role": "secondary"
      },
      "target": true,
      "targetId": "pathR23",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pR2",
          "pR3"
        ]
      },
      "appearance": {
        "strokeWidth": 2.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "angleR",
      "label": "$\\alpha_1$",
      "color": "canela",
      "layerId": "geometry",
      "order": 3000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo R1",
        "role": "secondary"
      },
      "target": true,
      "targetId": "angleR",
      "objectType": "angle",
      "points": [
        "pR2",
        "pR1",
        "pR3"
      ],
      "sweep": "directed",
      "marker": "arc",
      "appearance": {
        "radius": 0.8,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pathA12",
      "label": "Acutángulo",
      "color": "pavo",
      "layerId": "geometry",
      "order": 2010,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado A1A2",
        "role": "secondary"
      },
      "target": true,
      "targetId": "pathA12",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pA1",
          "pA2"
        ]
      },
      "appearance": {
        "strokeWidth": 2.5,
        "labelVisible": true,
        "labelOffset": [
          0,
          -20
        ],
        "labelPosition": 0.25,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pathA13",
      "label": "Lado A1C2",
      "color": "pavo",
      "layerId": "geometry",
      "order": 2011,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado A1C2",
        "role": "secondary"
      },
      "target": true,
      "targetId": "pathA13",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pA1",
          "pA3"
        ]
      },
      "appearance": {
        "strokeWidth": 2.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pathA23",
      "label": "Lado A2C2",
      "color": "pavo",
      "layerId": "geometry",
      "order": 2012,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado A2C2",
        "role": "secondary"
      },
      "target": true,
      "targetId": "pathA23",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pA2",
          "pA3"
        ]
      },
      "appearance": {
        "strokeWidth": 2.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pathO12",
      "label": "Obtusángulo",
      "color": "mora",
      "layerId": "geometry",
      "order": 2020,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado O1O2",
        "role": "secondary"
      },
      "target": true,
      "targetId": "pathO12",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pO1",
          "pO2"
        ]
      },
      "appearance": {
        "strokeWidth": 2.5,
        "labelVisible": true,
        "labelOffset": [
          0,
          -20
        ],
        "labelPosition": 0.24,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pathO13",
      "label": "Lado O1C3",
      "color": "mora",
      "layerId": "geometry",
      "order": 2021,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado O1C3",
        "role": "secondary"
      },
      "target": true,
      "targetId": "pathO13",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pO1",
          "pO3"
        ]
      },
      "appearance": {
        "strokeWidth": 2.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pathO23",
      "label": "Lado O2C3",
      "color": "mora",
      "layerId": "geometry",
      "order": 2022,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado O2C3",
        "role": "secondary"
      },
      "target": true,
      "targetId": "pathO23",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pO2",
          "pO3"
        ]
      },
      "appearance": {
        "strokeWidth": 2.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "nonReflexAngleA2A1A3",
      "label": "Ángulo no reflejo (≤ 180°)",
      "color": "pavo",
      "layerId": "geometry",
      "order": 3001,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "nonReflexAngleA2A1A3",
      "objectType": "angle",
      "points": [
        "pA2",
        "pA1",
        "pA3"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 0.8,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "nonReflexAngleO2O1O3",
      "label": "Ángulo no reflejo (≤ 180°)",
      "color": "mora",
      "layerId": "geometry",
      "order": 3002,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "nonReflexAngleO2O1O3",
      "objectType": "angle",
      "points": [
        "pO2",
        "pO1",
        "pO3"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 0.8,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "perpR2A1R1",
      "label": "Perpendicular",
      "color": "pavo",
      "layerId": "geometry",
      "order": 3003,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Perpendicular",
        "role": "secondary"
      },
      "target": true,
      "targetId": "perpR2A1R1",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "perpendicular",
          "linePoints": [
            "pR2",
            "pA1"
          ],
          "through": "pR1"
        }
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "perpR1A1R2",
      "label": "Perpendicular",
      "color": "pavo",
      "layerId": "geometry",
      "order": 3004,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Perpendicular",
        "role": "secondary"
      },
      "target": true,
      "targetId": "perpR1A1R2",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "perpendicular",
          "linePoints": [
            "pR1",
            "pA1"
          ],
          "through": "pR2"
        }
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "perpR2A2A1",
      "label": "Perpendicular",
      "color": "pavo",
      "layerId": "geometry",
      "order": 3005,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Perpendicular",
        "role": "secondary"
      },
      "target": true,
      "targetId": "perpR2A2A1",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "perpendicular",
          "linePoints": [
            "pR2",
            "pA2"
          ],
          "through": "pA1"
        }
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "perpA1O1A2",
      "label": "Perpendicular",
      "color": "pavo",
      "layerId": "geometry",
      "order": 3006,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Perpendicular",
        "role": "secondary"
      },
      "target": true,
      "targetId": "perpA1O1A2",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "perpendicular",
          "linePoints": [
            "pA1",
            "pO1"
          ],
          "through": "pA2"
        }
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "perpA1O2O1",
      "label": "Perpendicular",
      "color": "pavo",
      "layerId": "geometry",
      "order": 3007,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Perpendicular",
        "role": "secondary"
      },
      "target": true,
      "targetId": "perpA1O2O1",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "perpendicular",
          "linePoints": [
            "pA1",
            "pO2"
          ],
          "through": "pO1"
        }
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "perpA2O1O2",
      "label": "Perpendicular",
      "color": "pavo",
      "layerId": "geometry",
      "order": 3008,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Perpendicular",
        "role": "secondary"
      },
      "target": true,
      "targetId": "perpA2O1O2",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "perpendicular",
          "linePoints": [
            "pA2",
            "pO1"
          ],
          "through": "pO2"
        }
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [
    {
      "id": "constraint1",
      "label": "En el mismo semiplano",
      "enabled": true,
      "type": "same-half-plane",
      "points": [
        "pR3",
        "pR1"
      ],
      "boundary": "pR2",
      "side": 1
    },
    {
      "id": "constraint2",
      "label": "En el mismo semiplano",
      "enabled": true,
      "type": "same-half-plane",
      "points": [
        "pA3",
        "pA1"
      ],
      "boundary": "pA2",
      "side": 1
    },
    {
      "id": "constraint3",
      "label": "En el mismo semiplano",
      "enabled": true,
      "type": "same-half-plane",
      "points": [
        "pO3",
        "pO1"
      ],
      "boundary": "pO2",
      "side": 1
    }
  ],
  "steps": [],
  "note": "Construye los 3 triángulos ajustando los vértices móviles C1, C2 y C3.",
  "translations": {
    "eu": {
      "title": "Triangeluen sailkapena eta azterketa",
      "note": "Eraiki 3 triangeluak C1, C2 eta C3 erpin mugikorrak doituz.",
      "labels": {
        "pathR12": "Zuzena",
        "pathA12": "Angeluzorrotza",
        "pathO12": "Angelukamutsa"
      },
      "ariaLabels": {
        "pR1": "R1 erpina",
        "pR2": "R2 erpina",
        "pR3": "C1 erpin mugikorra",
        "pA1": "A1 erpina",
        "pA2": "A2 erpina",
        "pA3": "C2 erpin mugikorra",
        "pO1": "O1 erpina",
        "pO2": "O2 erpina",
        "pO3": "C3 erpin mugikorra",
        "pathR12": "R1R2 aldea",
        "pathR13": "R1C1 aldea",
        "pathR23": "R2C1 aldea",
        "angleR": "R1 angelua",
        "pathA12": "A1A2 aldea",
        "pathA13": "A1C2 aldea",
        "pathA23": "A2C2 aldea",
        "pathO12": "O1O2 aldea",
        "pathO13": "O1C3 aldea",
        "pathO23": "O2C3 aldea",
        "nonReflexAngleA2A1A3": "Angelu ez-erreflexua (≤ 180°)",
        "nonReflexAngleO2O1O3": "Angelu ez-erreflexua (≤ 180°)",
        "perpR2A1R1": "Perpendikularra",
        "perpR1A1R2": "Perpendikularra",
        "perpR2A2A1": "Perpendikularra",
        "perpA1O1A2": "Perpendikularra",
        "perpA1O2O1": "Perpendikularra",
        "perpA2O1O2": "Perpendikularra"
      }
    },
    "en": {
      "title": "Classifying and inspecting triangles",
      "note": "Build the 3 triangles by adjusting the movable vertices C1, C2 and C3.",
      "labels": {
        "pathR12": "Right",
        "pathA12": "Acute",
        "pathO12": "Obtuse"
      },
      "ariaLabels": {
        "pR1": "Vertex R1",
        "pR2": "Vertex R2",
        "pR3": "Movable vertex C1",
        "pA1": "Vertex A1",
        "pA2": "Vertex A2",
        "pA3": "Movable vertex C2",
        "pO1": "Vertex O1",
        "pO2": "Vertex O2",
        "pO3": "Movable vertex C3",
        "pathR12": "Side R1R2",
        "pathR13": "Side R1C1",
        "pathR23": "Side R2C1",
        "angleR": "Angle R1",
        "pathA12": "Side A1A2",
        "pathA13": "Side A1C2",
        "pathA23": "Side A2C2",
        "pathO12": "Side O1O2",
        "pathO13": "Side O1C3",
        "pathO23": "Side O2C3",
        "nonReflexAngleA2A1A3": "Non-reflex angle (≤ 180°)",
        "nonReflexAngleO2O1O3": "Non-reflex angle (≤ 180°)"
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const EjercicioClasificacionTriangulos = () => <DiagramRenderer spec={EjercicioClasificacionTriangulosSpec} />;
