import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const DemoAngulosOpuestosSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Demostración: Ángulos opuestos por el vértice",
  "componentId": "demo-angulos-opuestos",
  "category": "Demostraciones",
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
      "label": "Anotaciones",
      "order": 1,
      "visible": true,
      "locked": false
    }
  ],
  "groups": [
    {
      "id": "gAlpha",
      "label": "Ángulos opuestos α y α′",
      "memberIds": [
        "angle1",
        "angle3"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulos opuestos α y α′",
        "role": "primary"
      },
      "target": true,
      "targetId": "alpha",
      "color": "pavo"
    },
    {
      "id": "gBeta",
      "label": "Ángulos opuestos β y β′",
      "memberIds": [
        "angle2",
        "angle4"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulos opuestos β y β′",
        "role": "primary"
      },
      "target": true,
      "targetId": "beta",
      "color": "musgo"
    },
    {
      "id": "gSupp12",
      "label": "Primer par adyacente suplementario (α y β)",
      "memberIds": [
        "angle1",
        "angle2"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Primer par adyacente suplementario",
        "role": "primary"
      },
      "target": true,
      "targetId": "supp12",
      "color": "pavo"
    },
    {
      "id": "gSupp23",
      "label": "Segundo par adyacente suplementario (β y α′)",
      "memberIds": [
        "angle2",
        "angle3"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Segundo par adyacente suplementario",
        "role": "primary"
      },
      "target": true,
      "targetId": "supp23",
      "color": "musgo"
    }
  ],
  "objects": [
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
        "ariaLabel": "Punto de corte O",
        "role": "secondary"
      },
      "target": true,
      "targetId": "O",
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
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "A",
      "label": "A",
      "color": "carbon",
      "layerId": "geometry",
      "order": 1030,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto A sobre la recta l",
        "role": "primary"
      },
      "target": true,
      "targetId": "A",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 3.2,
        "y": 1.4
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
        "snapToGrid": true,
        "snapSize": 0.25
      }
    },
    {
      "id": "Ap",
      "label": "A'",
      "color": "carbon",
      "layerId": "geometry",
      "order": 1050,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto opuesto A' sobre la recta l",
        "role": "construction"
      },
      "target": true,
      "targetId": "Ap",
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-A.x",
        "y": "-A.y",
        "fallback": [
          -3.2,
          -1.4
        ]
      },
      "mobility": {
        "type": "fixed"
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
      "id": "B",
      "label": "B",
      "color": "carbon",
      "layerId": "geometry",
      "order": 1040,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto B sobre la recta m",
        "role": "primary"
      },
      "target": true,
      "targetId": "B",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -1.7,
        "y": 2.8
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
        "snapToGrid": true,
        "snapSize": 0.25
      }
    },
    {
      "id": "Bp",
      "label": "B'",
      "color": "carbon",
      "layerId": "geometry",
      "order": 1060,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto opuesto B' sobre la recta m",
        "role": "construction"
      },
      "target": true,
      "targetId": "Bp",
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-B.x",
        "y": "-B.y",
        "fallback": [
          1.7,
          -2.8
        ]
      },
      "mobility": {
        "type": "fixed"
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
      "id": "lineL",
      "label": "$l$",
      "color": "carbon",
      "layerId": "geometry",
      "order": 950,
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
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "through-points",
          "points": [
            "A",
            "Ap"
          ]
        }
      },
      "appearance": {
        "strokeWidth": 2.4,
        "labelVisible": true,
        "highlightStrokeWidth": 3.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "lineM",
      "label": "$m$",
      "color": "carbon",
      "layerId": "geometry",
      "order": 960,
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
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "through-points",
          "points": [
            "B",
            "Bp"
          ]
        }
      },
      "appearance": {
        "strokeWidth": 2.4,
        "labelVisible": true,
        "highlightStrokeWidth": 3.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "angle1",
      "label": "α",
      "color": "pavo",
      "layerId": "geometry",
      "order": 970,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gAlpha",
        "gSupp12"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo α",
        "role": "secondary"
      },
      "target": true,
      "targetId": "angle1",
      "objectType": "angle",
      "points": [
        "A",
        "O",
        "B"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 0.85,
        "fillOpacity": 0.28,
        "labelSize": 16,
        "highlightStrokeWidth": 4.5,
        "highlightFillOpacity": 0.6,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "angle2",
      "label": "β",
      "color": "musgo",
      "layerId": "geometry",
      "order": 980,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gBeta",
        "gSupp12",
        "gSupp23"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo β",
        "role": "secondary"
      },
      "target": true,
      "targetId": "angle2",
      "objectType": "angle",
      "points": [
        "B",
        "O",
        "Ap"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 0.65,
        "fillOpacity": 0.22,
        "labelSize": 16,
        "highlightStrokeWidth": 4.5,
        "highlightFillOpacity": 0.6,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "angle3",
      "label": "α'",
      "color": "pavo",
      "layerId": "geometry",
      "order": 990,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gAlpha",
        "gSupp23"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo α'",
        "role": "secondary"
      },
      "target": true,
      "targetId": "angle3",
      "objectType": "angle",
      "points": [
        "Ap",
        "O",
        "Bp"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 0.85,
        "fillOpacity": 0.28,
        "labelSize": 16,
        "highlightStrokeWidth": 4.5,
        "highlightFillOpacity": 0.6,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "angle4",
      "label": "β'",
      "color": "musgo",
      "layerId": "geometry",
      "order": 1000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gBeta"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo β'",
        "role": "secondary"
      },
      "target": true,
      "targetId": "angle4",
      "objectType": "angle",
      "points": [
        "Bp",
        "O",
        "A"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 0.65,
        "fillOpacity": 0.22,
        "labelSize": 16,
        "highlightStrokeWidth": 4.5,
        "highlightFillOpacity": 0.6,
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [],
  "steps": [
    {
      "id": "step1",
      "label": "Suplementarios en l",
      "description": "Los ángulos α y β forman un par adyacente sobre la recta l.",
      "visibleTargets": [
        "lineL",
        "lineM",
        "O",
        "A",
        "Ap",
        "B",
        "Bp",
        "angle1",
        "angle2",
        "angle3",
        "angle4"
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
        "O": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "A": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "Ap": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "B": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "Bp": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        }
      }
    },
    {
      "id": "step2",
      "label": "Suplementarios en m",
      "description": "Los ángulos β y α' forman un par adyacente sobre la recta m.",
      "visibleTargets": [
        "lineL",
        "lineM",
        "O",
        "A",
        "Ap",
        "B",
        "Bp",
        "angle1",
        "angle2",
        "angle3",
        "angle4"
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
        "O": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "A": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "Ap": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "B": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "Bp": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        }
      }
    },
    {
      "id": "step3",
      "label": "Reflexividad del ángulo común",
      "description": "El ángulo adyacente común β satisface β ≅ β.",
      "visibleTargets": [
        "lineL",
        "lineM",
        "O",
        "A",
        "Ap",
        "B",
        "Bp",
        "angle1",
        "angle2",
        "angle3",
        "angle4"
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
          "emphasis": "none",
          "interactive": true
        },
        "O": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "A": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "Ap": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "B": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "Bp": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        }
      }
    },
    {
      "id": "step4",
      "label": "Congruencia α ≅ α'",
      "description": "Al ser suplementarios del mismo ángulo β, se deduce α ≅ α'.",
      "visibleTargets": [
        "lineL",
        "lineM",
        "O",
        "A",
        "Ap",
        "B",
        "Bp",
        "angle1",
        "angle2",
        "angle3",
        "angle4"
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
        "O": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "A": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "Ap": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "B": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "Bp": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        }
      }
    },
    {
      "id": "step5",
      "label": "Segundo par opuesto β ≅ β'",
      "description": "Un razonamiento idéntico concluye la congruencia del segundo par opuesto.",
      "visibleTargets": [
        "lineL",
        "lineM",
        "O",
        "A",
        "Ap",
        "B",
        "Bp",
        "angle1",
        "angle2",
        "angle3",
        "angle4"
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
        "O": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "A": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "Ap": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "B": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "Bp": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        }
      }
    }
  ],
  "note": "Arrastra los puntos A o B para cambiar la orientación de las rectas secantes"
}
);
/* @matematika-diagram-spec:end */

export const DemoAngulosOpuestos = () => <DiagramRenderer spec={DemoAngulosOpuestosSpec} />;
