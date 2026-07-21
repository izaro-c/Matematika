import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const DemoAngulosOpuestosSpec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Ángulos opuestos",
  "componentId": "demo-angulos-opuestos",
  "category": "Demostraciones",
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
      "id": "gAlpha",
      "label": "Ángulos α y α′",
      "memberIds": [
        "angle1",
        "angle3"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulos α y α′",
        "role": "primary"
      },
      "target": true,
      "targetId": "alpha",
      "color": "granada"
    },
    {
      "id": "gBeta",
      "label": "Ángulos β y β′",
      "memberIds": [
        "angle2",
        "angle4"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulos β y β′",
        "role": "primary"
      },
      "target": true,
      "targetId": "beta",
      "color": "pizarra"
    },
    {
      "id": "gSupp12",
      "label": "Primer par suplementario",
      "memberIds": [
        "angle1",
        "angle2"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Primer par suplementario",
        "role": "primary"
      },
      "target": true,
      "targetId": "supp12",
      "color": "granada"
    },
    {
      "id": "gSupp23",
      "label": "Segundo par suplementario",
      "memberIds": [
        "angle2",
        "angle3"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Segundo par suplementario",
        "role": "primary"
      },
      "target": true,
      "targetId": "supp23",
      "color": "pizarra"
    },
    {
      "id": "gCongruence13",
      "label": "Resta del ángulo común",
      "memberIds": [
        "angle1",
        "angle2",
        "angle3"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Resta del ángulo común",
        "role": "primary"
      },
      "target": true,
      "targetId": "congruence13",
      "color": "granada"
    }
  ],
  "points": [
    {
      "id": "O",
      "label": "O",
      "color": "carbon",
      "layerId": "geometry",
      "order": 1020,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto fijo O",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 0,
      "y": 0,
      "showLabel": true,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "A",
      "label": "A",
      "color": "granada",
      "layerId": "geometry",
      "order": 1030,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto A",
        "role": "primary"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 0.25,
      "y": 2.75,
      "showLabel": true,
      "fixed": false,
      "constraint": "free",
      "snapToGrid": true,
      "snapSize": 0.25
    },
    {
      "id": "B",
      "label": "B",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 1040,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto B",
        "role": "primary"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -4,
      "y": 1.25,
      "showLabel": true,
      "fixed": false,
      "constraint": "free",
      "snapToGrid": true,
      "snapSize": 0.25
    },
    {
      "id": "Ap",
      "label": "A'",
      "color": "granada",
      "layerId": "geometry",
      "order": 1050,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto construido A'",
        "role": "construction"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -3.2,
      "y": -1.4,
      "showLabel": true,
      "fixed": true,
      "constraint": "derived",
      "dependencies": [
        "A"
      ],
      "xExpression": "-A.x",
      "yExpression": "-A.y"
    },
    {
      "id": "Bp",
      "label": "B'",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 1060,
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
      "x": 1.7,
      "y": -2.8,
      "showLabel": true,
      "fixed": true,
      "constraint": "derived",
      "dependencies": [
        "B"
      ],
      "xExpression": "-B.x",
      "yExpression": "-B.y"
    }
  ],
  "elements": [
    {
      "id": "lineL",
      "label": "$l$",
      "color": "granada",
      "layerId": "geometry",
      "order": 1070,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta l",
        "role": "secondary"
      },
      "target": true,
      "targetId": "lineL",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "line",
      "refs": [
        "A",
        "Ap"
      ],
      "showLabel": true
    },
    {
      "id": "lineM",
      "label": "$m$",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 1080,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta m",
        "role": "secondary"
      },
      "target": true,
      "targetId": "lineM",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "line",
      "refs": [
        "B",
        "Bp"
      ],
      "showLabel": true
    },
    {
      "id": "angle1",
      "label": "α",
      "color": "pavo",
      "layerId": "geometry",
      "order": 1090,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gAlpha",
        "gSupp12",
        "gCongruence13"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "α",
        "role": "secondary"
      },
      "target": true,
      "targetId": "angle1",
      "style": {
        "fillOpacity": 0.28,
        "angleRadius": 1,
        "preserveColorOnHighlight": true
      },
      "kind": "nonReflexAngle",
      "refs": [
        "A",
        "O",
        "B"
      ]
    },
    {
      "id": "angle2",
      "label": "β",
      "color": "musgo",
      "layerId": "geometry",
      "order": 1100,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gBeta",
        "gSupp12",
        "gSupp23",
        "gCongruence13"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "β",
        "role": "secondary"
      },
      "target": true,
      "targetId": "angle2",
      "style": {
        "fillOpacity": 0.2,
        "angleRadius": 0.8,
        "preserveColorOnHighlight": true
      },
      "kind": "nonReflexAngle",
      "refs": [
        "B",
        "O",
        "Ap"
      ]
    },
    {
      "id": "angle3",
      "label": "α'",
      "color": "pavo",
      "layerId": "geometry",
      "order": 1110,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gAlpha",
        "gSupp23",
        "gCongruence13"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "α'",
        "role": "secondary"
      },
      "target": true,
      "targetId": "angle3",
      "style": {
        "fillOpacity": 0.28,
        "angleRadius": 1,
        "preserveColorOnHighlight": true
      },
      "kind": "nonReflexAngle",
      "refs": [
        "Ap",
        "O",
        "Bp"
      ]
    },
    {
      "id": "angle4",
      "label": "β'",
      "color": "musgo",
      "layerId": "geometry",
      "order": 1120,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gBeta"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "β'",
        "role": "secondary"
      },
      "target": true,
      "targetId": "angle4",
      "style": {
        "fillOpacity": 0.2,
        "angleRadius": 0.8,
        "preserveColorOnHighlight": true
      },
      "kind": "nonReflexAngle",
      "refs": [
        "Bp",
        "O",
        "A"
      ]
    }
  ],
  "sliders": [],
  "steps": [
    {
      "id": "step1",
      "label": "Suplementarios I",
      "description": "Los ángulos 1 y 2 forman un ángulo llano.",
      "visibleTargets": [
        "lineL",
        "lineM",
        "angle1",
        "angle2",
        "angle3",
        "angle4",
        "A",
        "B"
      ],
      "durationMs": 1800,
      "objectStates": {
        "lineL": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "lineM": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "angle1": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "angle2": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "angle3": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "angle4": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "A": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "B": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        }
      }
    },
    {
      "id": "step2",
      "label": "Suplementarios II",
      "description": "Los ángulos 2 y 3 forman otro ángulo llano.",
      "visibleTargets": [
        "lineL",
        "lineM",
        "angle1",
        "angle2",
        "angle3",
        "angle4",
        "A",
        "B"
      ],
      "durationMs": 1800,
      "objectStates": {
        "lineL": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "lineM": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "angle1": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "angle2": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "angle3": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "angle4": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "A": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "B": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        }
      }
    },
    {
      "id": "step3",
      "label": "Transitividad",
      "description": "Las dos sumas son congruentes por ser ángulos llanos.",
      "visibleTargets": [
        "lineL",
        "lineM",
        "angle1",
        "angle2",
        "angle3",
        "angle4",
        "A",
        "B"
      ],
      "durationMs": 1800,
      "objectStates": {
        "lineL": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "lineM": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "angle1": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "angle2": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "angle3": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "angle4": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "A": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "B": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        }
      }
    },
    {
      "id": "step4",
      "label": "Resta",
      "description": "Se resta el ángulo 2, común a ambas sumas.",
      "visibleTargets": [
        "lineL",
        "lineM",
        "angle1",
        "angle2",
        "angle3",
        "angle4",
        "A",
        "B"
      ],
      "durationMs": 1800,
      "objectStates": {
        "lineL": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "lineM": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "angle1": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "angle2": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "angle3": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "angle4": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "A": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "B": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        }
      }
    },
    {
      "id": "step5",
      "label": "Segundo par",
      "description": "El mismo argumento demuestra la congruencia del otro par.",
      "visibleTargets": [
        "lineL",
        "lineM",
        "angle1",
        "angle2",
        "angle3",
        "angle4",
        "A",
        "B"
      ],
      "durationMs": 1800,
      "objectStates": {
        "lineL": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "lineM": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "angle1": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "angle2": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "angle3": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "angle4": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "A": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "B": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        }
      }
    }
  ],
  "dependencies": [
    {
      "sourceId": "A",
      "targetId": "Ap",
      "relation": "expression"
    },
    {
      "sourceId": "B",
      "targetId": "Bp",
      "relation": "expression"
    }
  ],
  "note": "Mueve A y B",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const DemoAngulosOpuestos = () => <DiagramRenderer spec={DemoAngulosOpuestosSpec} />;
