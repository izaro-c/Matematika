import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const DemoAngulosAlternosInternosSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Teorema de los ángulos alternos internos",
  "componentId": "demo-angulos-alternos-internos",
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
    }
  ],
  "groups": [
    {
      "id": "gConfig",
      "label": "Configuración",
      "memberIds": [
        "t",
        "l1",
        "l2",
        "alpha",
        "beta"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Configuración",
        "role": "primary"
      },
      "target": true,
      "targetId": "config",
      "color": "granada"
    },
    {
      "id": "gTriX",
      "label": "Triángulo ABX",
      "memberIds": [
        "AB",
        "AX",
        "BX"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo ABX",
        "role": "primary"
      },
      "target": true,
      "targetId": "trianguloABX",
      "color": "mora"
    },
    {
      "id": "gTriY",
      "label": "Triángulo ABY",
      "memberIds": [
        "AB",
        "AY",
        "BY"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo ABY",
        "role": "primary"
      },
      "target": true,
      "targetId": "trianguloABY",
      "color": "mora"
    }
  ],
  "objects": [
    {
      "id": "A",
      "label": "A",
      "color": "granada",
      "layerId": "geometry",
      "order": 2010,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "A",
        "role": "secondary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -1.2,
        "y": -1.5
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true,
        "highlightSize": 9,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "B",
      "label": "B",
      "color": "granada",
      "layerId": "geometry",
      "order": 2020,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "B",
        "role": "secondary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 1.2,
        "y": 1.5
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true,
        "highlightSize": 9,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "P1",
      "label": "P₁",
      "color": "granada",
      "layerId": "geometry",
      "order": 2030,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "P₁",
        "role": "secondary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -4.2,
        "y": -1.5
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true,
        "highlightSize": 9,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "P2",
      "label": "P₂",
      "color": "granada",
      "layerId": "geometry",
      "order": 2040,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "P₂",
        "role": "secondary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 4.2,
        "y": 1.5
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true,
        "highlightSize": 9,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "X",
      "label": "X",
      "color": "mora",
      "layerId": "geometry",
      "order": 2050,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "X",
        "role": "secondary"
      },
      "target": true,
      "targetId": "pointX",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 3.6,
        "y": -1.5
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true,
        "highlightSize": 9,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "Y",
      "label": "Y",
      "color": "mora",
      "layerId": "geometry",
      "order": 2060,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Y",
        "role": "secondary"
      },
      "target": true,
      "targetId": "pointY",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3.6,
        "y": 1.5
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true,
        "highlightSize": 9,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "t",
      "label": "Secante t",
      "color": "carbon",
      "layerId": "geometry",
      "order": 2070,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gConfig"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Secante t",
        "role": "secondary"
      },
      "target": true,
      "targetId": "lineT",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "through-points",
          "points": [
            "A",
            "B"
          ]
        }
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3.2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "l1",
      "label": "Recta ℓ₁",
      "color": "carbon",
      "layerId": "geometry",
      "order": 2080,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gConfig"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta ℓ₁",
        "role": "secondary"
      },
      "target": true,
      "targetId": "lineL1",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "through-points",
          "points": [
            "P1",
            "A"
          ]
        }
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3.2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "l2",
      "label": "Recta ℓ₂",
      "color": "carbon",
      "layerId": "geometry",
      "order": 2090,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gConfig"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta ℓ₂",
        "role": "secondary"
      },
      "target": true,
      "targetId": "lineL2",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "through-points",
          "points": [
            "B",
            "P2"
          ]
        }
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3.2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "h1",
      "label": "ℓ₂ supuesta secante (caso X)",
      "color": "mora",
      "layerId": "geometry",
      "order": 2100,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "ℓ₂ supuesta secante (caso X)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "lineHX",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "through-points",
          "points": [
            "B",
            "X"
          ]
        }
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3.2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "h2",
      "label": "ℓ₁ supuesta secante (caso Y)",
      "color": "mora",
      "layerId": "geometry",
      "order": 2110,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "ℓ₁ supuesta secante (caso Y)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "lineHY",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "through-points",
          "points": [
            "A",
            "Y"
          ]
        }
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3.2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "AX",
      "label": "Lado AX",
      "color": "mora",
      "layerId": "geometry",
      "order": 2120,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTriX"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado AX",
        "role": "secondary"
      },
      "target": true,
      "targetId": "sideAX",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "A",
          "X"
        ]
      },
      "appearance": {
        "strokeWidth": 2.6,
        "highlightStrokeWidth": 3.4,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "BX",
      "label": "Lado BX",
      "color": "mora",
      "layerId": "geometry",
      "order": 2130,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTriX"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado BX",
        "role": "secondary"
      },
      "target": true,
      "targetId": "sideBX",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "B",
          "X"
        ]
      },
      "appearance": {
        "strokeWidth": 2.6,
        "highlightStrokeWidth": 3.4,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "AY",
      "label": "Lado AY",
      "color": "mora",
      "layerId": "geometry",
      "order": 2140,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTriY"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado AY",
        "role": "secondary"
      },
      "target": true,
      "targetId": "sideAY",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "A",
          "Y"
        ]
      },
      "appearance": {
        "strokeWidth": 2.6,
        "highlightStrokeWidth": 3.4,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "BY",
      "label": "Lado BY",
      "color": "mora",
      "layerId": "geometry",
      "order": 2150,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTriY"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado BY",
        "role": "secondary"
      },
      "target": true,
      "targetId": "sideBY",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "B",
          "Y"
        ]
      },
      "appearance": {
        "strokeWidth": 2.6,
        "highlightStrokeWidth": 3.4,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "AB",
      "label": "Lado AB",
      "color": "carbon",
      "layerId": "geometry",
      "order": 2160,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTriX",
        "gTriY"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado AB",
        "role": "secondary"
      },
      "target": true,
      "targetId": "sideAB",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "A",
          "B"
        ]
      },
      "appearance": {
        "strokeWidth": 2.6,
        "highlightStrokeWidth": 3.4,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "alpha",
      "label": "α",
      "color": "terracota",
      "layerId": "geometry",
      "order": 2170,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gConfig"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "α",
        "role": "secondary"
      },
      "target": true,
      "targetId": "angleAlpha",
      "objectType": "angle",
      "points": [
        "B",
        "A",
        "P1"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 0.55,
        "fillOpacity": 0.22,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "beta",
      "label": "β",
      "color": "pavo",
      "layerId": "geometry",
      "order": 2180,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gConfig"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "β",
        "role": "secondary"
      },
      "target": true,
      "targetId": "angleBeta",
      "objectType": "angle",
      "points": [
        "A",
        "B",
        "P2"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 0.55,
        "fillOpacity": 0.22,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "angABX",
      "label": "∠ABX",
      "color": "ocre",
      "layerId": "geometry",
      "order": 2190,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "∠ABX",
        "role": "secondary"
      },
      "target": true,
      "targetId": "angleABX",
      "objectType": "angle",
      "points": [
        "X",
        "B",
        "A"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 0.8,
        "fillOpacity": 0.22,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "angBAY",
      "label": "∠BAY",
      "color": "ocre",
      "layerId": "geometry",
      "order": 2200,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "∠BAY",
        "role": "secondary"
      },
      "target": true,
      "targetId": "angleBAY",
      "objectType": "angle",
      "points": [
        "Y",
        "A",
        "B"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 0.8,
        "fillOpacity": 0.22,
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [],
  "steps": [
    {
      "id": "step1",
      "label": "Configuración",
      "description": "Dos rectas cortadas por t en A y B; α y β alternos internos.",
      "visibleTargets": [
        "A",
        "B",
        "P1",
        "P2",
        "t",
        "l1",
        "l2",
        "alpha",
        "beta"
      ],
      "durationMs": 1800,
      "objectStates": {
        "A": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "B": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "P1": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "P2": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "t": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "l1": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "l2": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "alpha": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "beta": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        }
      }
    },
    {
      "id": "step2",
      "label": "Caso X",
      "description": "Se supone que ℓ₁ y ℓ₂ se cortan en X, en el semiplano de P₂.",
      "visibleTargets": [
        "A",
        "B",
        "P1",
        "P2",
        "t",
        "l1",
        "l2",
        "alpha",
        "beta",
        "X",
        "h1",
        "AB",
        "AX",
        "BX"
      ],
      "durationMs": 1800,
      "objectStates": {
        "A": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "B": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "P1": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "P2": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "t": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "l1": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "l2": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "alpha": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "beta": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "X": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "h1": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "AB": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "AX": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "BX": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        }
      }
    },
    {
      "id": "step3",
      "label": "Ángulo exterior en A",
      "description": "α es exterior en A al triángulo ABX y ∠ABX es interior no adyacente.",
      "visibleTargets": [
        "A",
        "B",
        "P1",
        "P2",
        "t",
        "l1",
        "l2",
        "alpha",
        "beta",
        "X",
        "h1",
        "AB",
        "AX",
        "BX",
        "angABX"
      ],
      "durationMs": 1800,
      "objectStates": {
        "A": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "B": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "P1": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "P2": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "t": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "l1": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "l2": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "alpha": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "beta": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "X": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "h1": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "AB": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "AX": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "BX": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "angABX": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        }
      }
    },
    {
      "id": "step4",
      "label": "Caso Y",
      "description": "Corte en Y, en el semiplano de P₁: β es exterior en B al triángulo ABY.",
      "visibleTargets": [
        "A",
        "B",
        "P1",
        "P2",
        "t",
        "l1",
        "l2",
        "alpha",
        "beta",
        "Y",
        "h2",
        "AB",
        "AY",
        "BY",
        "angBAY"
      ],
      "durationMs": 1800,
      "objectStates": {
        "A": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "B": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "P1": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "P2": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "t": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "l1": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "l2": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "alpha": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "beta": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "Y": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "h2": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "AB": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "AY": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "BY": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "angBAY": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        }
      }
    },
    {
      "id": "step5",
      "label": "Dirección directa",
      "description": "Con ℓ₁ ∥ ℓ₂, la recta que forma en B un ángulo congruente con α coincide con ℓ₂.",
      "visibleTargets": [
        "A",
        "B",
        "P1",
        "P2",
        "t",
        "l1",
        "l2",
        "alpha",
        "beta"
      ],
      "durationMs": 1800,
      "objectStates": {
        "A": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "B": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "P1": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "P2": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "t": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "l1": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "l2": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "alpha": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "beta": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        }
      }
    }
  ],
  "note": "Recorre los pasos: los dos casos de la reducción al absurdo (corte en X o en Y) y la dirección directa."
}
);
/* @matematika-diagram-spec:end */

export const DemoAngulosAlternosInternos = () => <DiagramRenderer spec={DemoAngulosAlternosInternosSpec} />;
