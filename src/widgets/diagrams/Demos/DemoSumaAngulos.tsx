import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const DemoSumaAngulosSpec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Demostración de la suma angular",
  "componentId": "demo-suma-angulos",
  "category": "Demostraciones",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "viewport": {
    "bounds": [
      -6,
      4.5,
      6,
      -4.5
    ],
    "home": [
      -6,
      4.5,
      6,
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
  "groups": [
    {
      "id": "gTriangle",
      "label": "Triángulo",
      "memberIds": [
        "poly",
        "AB",
        "AC",
        "BC"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo",
        "role": "primary"
      },
      "target": true,
      "targetId": "triangulo",
      "color": "granada"
    },
    {
      "id": "gAngles",
      "label": "Ángulos",
      "memberIds": [
        "angA",
        "angB",
        "angC"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulos",
        "role": "primary"
      },
      "target": true,
      "targetId": "angulos",
      "color": "granada"
    },
    {
      "id": "gStraight",
      "label": "Ángulo llano",
      "memberIds": [
        "parallel",
        "altA",
        "angC",
        "altB"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo llano",
        "role": "primary"
      },
      "target": true,
      "targetId": "angulo-llano",
      "color": "granada"
    }
  ],
  "points": [
    {
      "id": "A",
      "label": "A",
      "color": "granada",
      "layerId": "geometry",
      "order": 2160,
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
      "x": -3.2,
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
      "order": 2170,
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
      "x": 3.2,
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
      "order": 2180,
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
      "x": 0.7,
      "y": 1.7,
      "showLabel": true,
      "fixed": false,
      "constraint": "constrained",
      "constraintIds": [
        "sameC"
      ],
      "snapToGrid": true,
      "snapSize": 0.25
    },
    {
      "id": "L",
      "label": "L",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 2190,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto construido L",
        "role": "construction"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -5.7,
      "y": 1.7,
      "showLabel": true,
      "fixed": true,
      "constraint": "derived",
      "dependencies": [
        "A",
        "B",
        "C"
      ],
      "xExpression": "C.x - (B.x - A.x)",
      "yExpression": "C.y - (B.y - A.y)"
    },
    {
      "id": "R",
      "label": "R",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 2200,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto construido R",
        "role": "construction"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 7.1,
      "y": 1.7,
      "showLabel": true,
      "fixed": true,
      "constraint": "derived",
      "dependencies": [
        "A",
        "B",
        "C"
      ],
      "xExpression": "C.x + (B.x - A.x)",
      "yExpression": "C.y + (B.y - A.y)"
    }
  ],
  "elements": [
    {
      "id": "poly",
      "label": "Triángulo ABC",
      "color": "granada",
      "layerId": "geometry",
      "order": 2210,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTriangle"
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
      "id": "AB",
      "label": "Base AB",
      "color": "granada",
      "layerId": "geometry",
      "order": 2220,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTriangle"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Base AB",
        "role": "secondary"
      },
      "target": true,
      "targetId": "base-ab",
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
      "id": "AC",
      "label": "Transversal AC",
      "color": "granada",
      "layerId": "geometry",
      "order": 2230,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTriangle"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Transversal AC",
        "role": "secondary"
      },
      "target": true,
      "targetId": "transversal-ac",
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
      "id": "BC",
      "label": "Transversal BC",
      "color": "granada",
      "layerId": "geometry",
      "order": 2240,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTriangle"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Transversal BC",
        "role": "secondary"
      },
      "target": true,
      "targetId": "transversal-bc",
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
      "id": "parallel",
      "label": "Paralela por C",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 2250,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gStraight"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Paralela por C",
        "role": "secondary"
      },
      "target": true,
      "targetId": "paralela",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "line",
      "refs": [
        "L",
        "R"
      ],
      "dashed": true
    },
    {
      "id": "angA",
      "label": "α",
      "color": "granada",
      "layerId": "geometry",
      "order": 2260,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gAngles"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "α",
        "role": "secondary"
      },
      "target": true,
      "targetId": "angulo-a",
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
      "id": "angB",
      "label": "β",
      "color": "granada",
      "layerId": "geometry",
      "order": 2270,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gAngles"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "β",
        "role": "secondary"
      },
      "target": true,
      "targetId": "angulo-b",
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
      "id": "angC",
      "label": "γ",
      "color": "granada",
      "layerId": "geometry",
      "order": 2280,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gAngles",
        "gStraight"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "γ",
        "role": "secondary"
      },
      "target": true,
      "targetId": "angulo-c",
      "style": {
        "fillOpacity": 0.22,
        "angleRadius": 0.58,
        "preserveColorOnHighlight": true
      },
      "kind": "nonReflexAngle",
      "refs": [
        "A",
        "C",
        "B"
      ]
    },
    {
      "id": "altA",
      "label": "α'",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 2290,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gStraight"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "α'",
        "role": "secondary"
      },
      "target": true,
      "targetId": "alterno-a",
      "style": {
        "fillOpacity": 0.22,
        "angleRadius": 0.58,
        "preserveColorOnHighlight": true
      },
      "kind": "nonReflexAngle",
      "refs": [
        "L",
        "C",
        "A"
      ]
    },
    {
      "id": "altB",
      "label": "β'",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 2300,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gStraight"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "β'",
        "role": "secondary"
      },
      "target": true,
      "targetId": "alterno-b",
      "style": {
        "fillOpacity": 0.22,
        "angleRadius": 0.58,
        "preserveColorOnHighlight": true
      },
      "kind": "nonReflexAngle",
      "refs": [
        "B",
        "C",
        "R"
      ]
    },
    {
      "id": "sumProofInfo",
      "label": "Ángulo llano en C",
      "color": "granada",
      "layerId": "annotations",
      "order": 2310,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo llano en C",
        "role": "annotation"
      },
      "target": false,
      "style": {
        "preserveColorOnHighlight": true
      },
      "kind": "infoPanel",
      "refs": [],
      "text": "α' + γ + β' = 180°",
      "properties": {
        "title": "Ángulo llano en C",
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
      "label": "Triángulo base",
      "description": "Se fijan los tres ángulos interiores.",
      "visibleTargets": [
        "poly",
        "AB",
        "AC",
        "BC",
        "angA",
        "angB",
        "angC",
        "sumProofInfo"
      ],
      "durationMs": 1800,
      "objectStates": {
        "poly": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "AB": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "AC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "BC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "angA": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "angB": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "angC": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "sumProofInfo": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        }
      }
    },
    {
      "id": "step2",
      "label": "Paralela por C",
      "description": "Se construye la única paralela a AB que pasa por C.",
      "visibleTargets": [
        "poly",
        "AB",
        "AC",
        "BC",
        "parallel",
        "angA",
        "angB",
        "angC",
        "sumProofInfo"
      ],
      "durationMs": 1800,
      "objectStates": {
        "poly": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "AB": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "AC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "BC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "parallel": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "angA": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "angB": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "angC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "sumProofInfo": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        }
      }
    },
    {
      "id": "step3",
      "label": "Alternos internos I",
      "description": "AC transporta α al vértice C.",
      "visibleTargets": [
        "poly",
        "AB",
        "AC",
        "BC",
        "parallel",
        "angA",
        "angB",
        "angC",
        "altA",
        "sumProofInfo"
      ],
      "durationMs": 1800,
      "objectStates": {
        "poly": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "AB": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "AC": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "BC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "parallel": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "angA": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "angB": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "angC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "altA": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "sumProofInfo": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        }
      }
    },
    {
      "id": "step4",
      "label": "Alternos internos II",
      "description": "BC transporta β al vértice C.",
      "visibleTargets": [
        "poly",
        "AB",
        "AC",
        "BC",
        "parallel",
        "angA",
        "angB",
        "angC",
        "altA",
        "altB",
        "sumProofInfo"
      ],
      "durationMs": 1800,
      "objectStates": {
        "poly": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "AB": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "AC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "BC": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "parallel": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "angA": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "angB": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "angC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "altA": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "altB": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "sumProofInfo": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        }
      }
    },
    {
      "id": "step5",
      "label": "Ángulo llano",
      "description": "Los tres sectores consecutivos completan 180°.",
      "visibleTargets": [
        "poly",
        "AB",
        "AC",
        "BC",
        "parallel",
        "angA",
        "angB",
        "angC",
        "altA",
        "altB",
        "sumProofInfo"
      ],
      "durationMs": 1800,
      "objectStates": {
        "poly": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "AB": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "AC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "BC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "parallel": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "angA": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "angB": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "angC": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "altA": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "altB": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "sumProofInfo": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        }
      }
    }
  ],
  "constraints": [
    {
      "id": "sameC",
      "label": "C no cruza AB",
      "kind": "sameSide",
      "refs": [
        "C",
        "A",
        "B"
      ],
      "enabled": true
    }
  ],
  "dependencies": [
    {
      "sourceId": "A",
      "targetId": "L",
      "relation": "expression"
    },
    {
      "sourceId": "B",
      "targetId": "L",
      "relation": "expression"
    },
    {
      "sourceId": "C",
      "targetId": "L",
      "relation": "expression"
    },
    {
      "sourceId": "A",
      "targetId": "R",
      "relation": "expression"
    },
    {
      "sourceId": "B",
      "targetId": "R",
      "relation": "expression"
    },
    {
      "sourceId": "C",
      "targetId": "R",
      "relation": "expression"
    }
  ],
  "note": "Recorre los cinco pasos y mueve C. La paralela se reconstruye y los ángulos alternos siguen completando un ángulo llano.",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const DemoSumaAngulos = () => <DiagramRenderer spec={DemoSumaAngulosSpec} />;
