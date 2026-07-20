import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const DemoCongruenciaALASpec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Demostración del criterio ALA",
  "componentId": "demo-congruencia-ala",
  "category": "Demostraciones",
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
      "id": "gTri1",
      "label": "Triángulo ABC",
      "memberIds": [
        "tri1",
        "AB",
        "AC",
        "angA",
        "angB"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo ABC",
        "role": "primary"
      },
      "target": true,
      "targetId": "triangle1",
      "color": "granada"
    },
    {
      "id": "gTri2",
      "label": "Triángulo A'B'C'",
      "memberIds": [
        "tri2",
        "A2B2",
        "angA2",
        "angB2"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo A'B'C'",
        "role": "primary"
      },
      "target": true,
      "targetId": "triangle2",
      "color": "granada"
    },
    {
      "id": "gSide",
      "label": "Lados AB y A′B′",
      "memberIds": [
        "AB",
        "A2B2"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Lados AB y A′B′",
        "role": "primary"
      },
      "target": true,
      "targetId": "sideAB",
      "color": "granada"
    },
    {
      "id": "gAngleA",
      "label": "Ángulos A y A′",
      "memberIds": [
        "angA",
        "angA2"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulos A y A′",
        "role": "primary"
      },
      "target": true,
      "targetId": "angleA",
      "color": "granada"
    },
    {
      "id": "gAngleB",
      "label": "Ángulos B y B′",
      "memberIds": [
        "angB",
        "angB2"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulos B y B′",
        "role": "primary"
      },
      "target": true,
      "targetId": "angleB",
      "color": "granada"
    }
  ],
  "points": [
    {
      "id": "A",
      "label": "A",
      "color": "granada",
      "layerId": "geometry",
      "order": 1820,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto fijo A",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -4,
      "y": -2.2,
      "showLabel": true,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "B",
      "label": "B",
      "color": "granada",
      "layerId": "geometry",
      "order": 1830,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto fijo B",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 0,
      "y": -2.2,
      "showLabel": true,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "C",
      "label": "C",
      "color": "granada",
      "layerId": "geometry",
      "order": 1840,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto C",
        "role": "primary"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -3.2,
      "y": 1.8,
      "showLabel": true,
      "fixed": false,
      "constraint": "free",
      "snapToGrid": true,
      "snapSize": 0.25
    },
    {
      "id": "A2",
      "label": "A'",
      "color": "granada",
      "layerId": "geometry",
      "order": 1850,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto fijo A'",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 0.8,
      "y": -2.2,
      "showLabel": true,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "B2",
      "label": "B'",
      "color": "granada",
      "layerId": "geometry",
      "order": 1860,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto construido B'",
        "role": "construction"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 4.8,
      "y": -2.2,
      "showLabel": true,
      "fixed": true,
      "constraint": "derived",
      "dependencies": [
        "A2",
        "A",
        "B"
      ],
      "xExpression": "A2.x + B.x - A.x",
      "yExpression": "A2.y + B.y - A.y"
    },
    {
      "id": "C2",
      "label": "C'",
      "color": "granada",
      "layerId": "geometry",
      "order": 1870,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto construido C'",
        "role": "construction"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 1.6,
      "y": 1.8,
      "showLabel": true,
      "fixed": true,
      "constraint": "derived",
      "dependencies": [
        "A2",
        "A",
        "C"
      ],
      "xExpression": "A2.x + C.x - A.x",
      "yExpression": "A2.y + C.y - A.y"
    },
    {
      "id": "Cstar",
      "label": "C*",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 1880,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto construido C*",
        "role": "construction"
      },
      "target": true,
      "targetId": "pointC",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 1.6,
      "y": 1.8,
      "showLabel": true,
      "fixed": true,
      "constraint": "derived",
      "dependencies": [
        "C2"
      ],
      "xExpression": "C2.x",
      "yExpression": "C2.y"
    }
  ],
  "elements": [
    {
      "id": "tri1",
      "label": "Triángulo ABC",
      "color": "granada",
      "layerId": "geometry",
      "order": 1890,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTri1"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo ABC",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 3,
        "fillOpacity": 0.1,
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
      "id": "tri2",
      "label": "Triángulo A'B'C'",
      "color": "granada",
      "layerId": "geometry",
      "order": 1900,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTri2"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo A'B'C'",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 3,
        "fillOpacity": 0.1,
        "highlightFillOpacity": 0.28,
        "preserveColorOnHighlight": true
      },
      "kind": "polygon",
      "refs": [
        "A2",
        "B2",
        "C2"
      ]
    },
    {
      "id": "triConstructed",
      "label": "Triángulo A'B'C*",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 1910,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo A'B'C*",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 3,
        "fillOpacity": 0.05,
        "highlightFillOpacity": 0.28,
        "preserveColorOnHighlight": true
      },
      "kind": "polygon",
      "refs": [
        "A2",
        "B2",
        "Cstar"
      ]
    },
    {
      "id": "AB",
      "label": "AB",
      "color": "granada",
      "layerId": "geometry",
      "order": 1920,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTri1",
        "gSide"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "AB",
        "role": "secondary"
      },
      "target": false,
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
      "id": "A2B2",
      "label": "A'B'",
      "color": "granada",
      "layerId": "geometry",
      "order": 1930,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTri2",
        "gSide"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "A'B'",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "A2",
        "B2"
      ]
    },
    {
      "id": "AC",
      "label": "AC",
      "color": "granada",
      "layerId": "geometry",
      "order": 1940,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTri1"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "AC",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "A",
        "C"
      ]
    },
    {
      "id": "A2Cstar",
      "label": "A'C*",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 1950,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "A'C*",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "A2",
        "Cstar"
      ]
    },
    {
      "id": "rayAC",
      "label": "Semirrecta A'C*",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 1960,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Semirrecta A'C*",
        "role": "secondary"
      },
      "target": true,
      "targetId": "rayAC",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "ray",
      "refs": [
        "A2",
        "Cstar"
      ],
      "dashed": true
    },
    {
      "id": "angA",
      "label": "Ángulo A",
      "color": "granada",
      "layerId": "geometry",
      "order": 1970,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTri1",
        "gAngleA"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo A",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "fillOpacity": 0.22,
        "angleRadius": 0.58,
        "preserveColorOnHighlight": true
      },
      "kind": "nonReflexAngle",
      "refs": [
        "B",
        "A",
        "C"
      ]
    },
    {
      "id": "angA2",
      "label": "Ángulo A'",
      "color": "granada",
      "layerId": "geometry",
      "order": 1980,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTri2",
        "gAngleA"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo A'",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "fillOpacity": 0.22,
        "angleRadius": 0.58,
        "preserveColorOnHighlight": true
      },
      "kind": "nonReflexAngle",
      "refs": [
        "B2",
        "A2",
        "Cstar"
      ]
    },
    {
      "id": "angB",
      "label": "Ángulo B",
      "color": "granada",
      "layerId": "geometry",
      "order": 1990,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTri1",
        "gAngleB"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo B",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "fillOpacity": 0.22,
        "angleRadius": 0.58,
        "preserveColorOnHighlight": true
      },
      "kind": "nonReflexAngle",
      "refs": [
        "C",
        "B",
        "A"
      ]
    },
    {
      "id": "angB2",
      "label": "Ángulo B'",
      "color": "granada",
      "layerId": "geometry",
      "order": 2000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTri2",
        "gAngleB"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo B'",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "fillOpacity": 0.22,
        "angleRadius": 0.58,
        "preserveColorOnHighlight": true
      },
      "kind": "nonReflexAngle",
      "refs": [
        "Cstar",
        "B2",
        "A2"
      ]
    },
    {
      "id": "alaProofInfo",
      "label": "Idea de la prueba",
      "color": "granada",
      "layerId": "annotations",
      "order": 2010,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Idea de la prueba",
        "role": "annotation"
      },
      "target": false,
      "style": {
        "preserveColorOnHighlight": true
      },
      "kind": "infoPanel",
      "refs": [],
      "text": "Transportar AC produce C*; la unicidad angular obliga a C* = C′.",
      "properties": {
        "title": "Idea de la prueba",
        "anchorMode": "viewport",
        "viewportPosition": [
          0.98,
          0.03
        ]
      }
    }
  ],
  "sliders": [],
  "steps": [
    {
      "id": "step1",
      "label": "Transporte",
      "description": "Se copia AC sobre la semirrecta de A′ para obtener C*.",
      "visibleTargets": [
        "tri1",
        "tri2",
        "AB",
        "A2B2",
        "AC",
        "A2Cstar",
        "rayAC",
        "angA",
        "angA2",
        "angB",
        "angB2",
        "alaProofInfo"
      ],
      "durationMs": 1800,
      "objectStates": {
        "tri1": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "tri2": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "AB": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "A2B2": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "AC": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "A2Cstar": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "rayAC": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "angA": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "angA2": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "angB": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "angB2": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "alaProofInfo": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        }
      }
    },
    {
      "id": "step2",
      "label": "Aplicación de LAL",
      "description": "Los triángulos ABC y A′B′C* satisfacen LAL.",
      "visibleTargets": [
        "tri1",
        "tri2",
        "triConstructed",
        "AB",
        "A2B2",
        "AC",
        "A2Cstar",
        "rayAC",
        "angA",
        "angA2",
        "angB",
        "angB2",
        "alaProofInfo"
      ],
      "durationMs": 1800,
      "objectStates": {
        "tri1": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "tri2": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "triConstructed": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "AB": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "A2B2": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "AC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "A2Cstar": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "rayAC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "angA": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "angA2": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "angB": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "angB2": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "alaProofInfo": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        }
      }
    },
    {
      "id": "step3",
      "label": "Unicidad",
      "description": "Los rayos desde B′ coinciden y por ello C* = C′.",
      "visibleTargets": [
        "tri1",
        "tri2",
        "triConstructed",
        "AB",
        "A2B2",
        "AC",
        "A2Cstar",
        "rayAC",
        "angA",
        "angA2",
        "angB",
        "angB2",
        "alaProofInfo"
      ],
      "durationMs": 1800,
      "objectStates": {
        "tri1": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "tri2": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "triConstructed": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "AB": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "A2B2": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "AC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "A2Cstar": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "rayAC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "angA": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "angA2": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "angB": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "angB2": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "alaProofInfo": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        }
      }
    }
  ],
  "dependencies": [
    {
      "sourceId": "A2",
      "targetId": "B2",
      "relation": "expression"
    },
    {
      "sourceId": "A",
      "targetId": "B2",
      "relation": "expression"
    },
    {
      "sourceId": "B",
      "targetId": "B2",
      "relation": "expression"
    },
    {
      "sourceId": "A2",
      "targetId": "C2",
      "relation": "expression"
    },
    {
      "sourceId": "A",
      "targetId": "C2",
      "relation": "expression"
    },
    {
      "sourceId": "C",
      "targetId": "C2",
      "relation": "expression"
    },
    {
      "sourceId": "C2",
      "targetId": "Cstar",
      "relation": "expression"
    }
  ],
  "note": "Avanza por los pasos y mueve C. La copia transportada se actualiza sin romper las correspondencias.",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const DemoCongruenciaALA = () => <DiagramRenderer spec={DemoCongruenciaALASpec} />;
