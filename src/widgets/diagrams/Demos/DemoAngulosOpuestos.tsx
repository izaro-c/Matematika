import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const DemoAngulosOpuestosSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
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
        "ariaLabel": "Punto fijo O",
        "role": "secondary"
      },
      "target": false,
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -0.5,
        "y": 4
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
        "snapSize": 0.25
      }
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -6.2,
        "y": 0.91
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
        "snapSize": 0.25
      }
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
      "id": "O_copy",
      "label": "O (copia)",
      "color": "carbon",
      "layerId": "geometry",
      "order": 1021,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto fijo O",
        "role": "secondary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 4,
        "y": 2
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
        "snapSize": 0.25
      }
    },
    {
      "id": "A_copy",
      "label": "A (copia)",
      "color": "granada",
      "layerId": "geometry",
      "order": 1031,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto A",
        "role": "primary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 7.25,
        "y": 2
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
        "snapSize": 0.25
      }
    },
    {
      "id": "B_copy",
      "label": "B (copia)",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 1041,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto B",
        "role": "primary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 5.041953149103954,
        "y": 5.763553325658126
      },
      "mobility": {
        "type": "constrained",
        "relationIds": [
          "equalAngleangle1_copy"
        ]
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {
        "snapSize": 0.25
      }
    },
    {
      "id": "Ap_copy",
      "label": "A' (copia)",
      "color": "granada",
      "layerId": "geometry",
      "order": 1051,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto construido A'",
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "O_copy.x-(A_copy.x-O_copy.x)",
        "y": "O_copy.y-(A_copy.y-O_copy.y)",
        "fallback": [
          -2.7,
          -1.9
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
      "id": "O_copy_2",
      "label": "O (copia)",
      "color": "carbon",
      "layerId": "geometry",
      "order": 1021,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto fijo O",
        "role": "secondary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 8,
        "y": 2
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
      "interaction": {}
    },
    {
      "id": "A_copy_2",
      "label": "A (copia)",
      "color": "granada",
      "layerId": "geometry",
      "order": 1031,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto A",
        "role": "primary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 6.803707927150703,
        "y": 6.321028266100319
      },
      "mobility": {
        "type": "constrained",
        "relationIds": [
          "equalAngleangle2_copy_2"
        ]
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {
        "snapSize": 0.25
      }
    },
    {
      "id": "B_copy_2",
      "label": "B (copia)",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 1041,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto B",
        "role": "primary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 12.77,
        "y": 2
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
        "snapSize": 0.25
      }
    },
    {
      "id": "Ap_copy_2",
      "label": "A' (copia)",
      "color": "granada",
      "layerId": "geometry",
      "order": 1051,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto construido A'",
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "O_copy_2.x-(A_copy_2.x-O_copy_2.x)",
        "y": "O_copy_2.y-(A_copy_2.y-O_copy_2.y)",
        "fallback": [
          -2.7,
          -1.9
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
      "id": "Bp_copy",
      "label": "B' (copia)",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 1061,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto construido B'",
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "O_copy_2.x-(B_copy_2.x-O_copy_2.x)",
        "y": "O_copy_2.y-(B_copy_2.y-O_copy_2.y)",
        "fallback": [
          2.2,
          -3.3
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
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
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
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "angle",
      "points": [
        "A",
        "O",
        "B"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 1,
        "fillOpacity": 0.28,
        "labelOffset": [
          0,
          0
        ],
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
      "objectType": "angle",
      "points": [
        "B",
        "O",
        "Ap"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 0.8,
        "fillOpacity": 0.2,
        "labelOffset": [
          0,
          0
        ],
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
      "objectType": "angle",
      "points": [
        "Ap",
        "O",
        "Bp"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 1,
        "fillOpacity": 0.28,
        "labelOffset": [
          0,
          0
        ],
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
      "objectType": "angle",
      "points": [
        "Bp",
        "O",
        "A"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 0.8,
        "fillOpacity": 0.2,
        "labelOffset": [
          0,
          0
        ],
        "labelSize": 16,
        "highlightStrokeWidth": 4.5,
        "highlightFillOpacity": 0.6,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "angle1_copy",
      "label": "α",
      "color": "pavo",
      "layerId": "geometry",
      "order": 1091,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "α",
        "role": "secondary"
      },
      "target": true,
      "targetId": "angle1_copy",
      "objectType": "angle",
      "points": [
        "A_copy",
        "O_copy",
        "B_copy"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 1,
        "fillOpacity": 0.28,
        "labelOffset": [
          0,
          0
        ],
        "labelSize": 16,
        "highlightStrokeWidth": 4.5,
        "highlightFillOpacity": 0.6,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "angle2_copy",
      "label": "β ",
      "color": "musgo",
      "layerId": "geometry",
      "order": 1101,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "β",
        "role": "secondary"
      },
      "target": true,
      "targetId": "angle2_copy",
      "objectType": "angle",
      "points": [
        "B_copy",
        "O_copy",
        "Ap_copy"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 0.8,
        "fillOpacity": 0.2,
        "labelOffset": [
          0,
          0
        ],
        "labelSize": 15,
        "highlightStrokeWidth": 4.5,
        "highlightFillOpacity": 0.6,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "angle2_copy_2",
      "label": "β ",
      "color": "musgo",
      "layerId": "geometry",
      "order": 1101,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "β",
        "role": "secondary"
      },
      "target": true,
      "targetId": "angle2_copy_2",
      "objectType": "angle",
      "points": [
        "B_copy_2",
        "O_copy_2",
        "A_copy_2"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 0.8,
        "fillOpacity": 0.2,
        "labelOffset": [
          0,
          0
        ],
        "labelSize": 16,
        "highlightStrokeWidth": 4.5,
        "highlightFillOpacity": 0.6,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "angle3_copy",
      "label": "α' ",
      "color": "pavo",
      "layerId": "geometry",
      "order": 1111,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "α'",
        "role": "secondary"
      },
      "target": true,
      "targetId": "angle3_copy",
      "objectType": "angle",
      "points": [
        "A_copy_2",
        "O_copy_2",
        "Bp_copy"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 1,
        "fillOpacity": 0.28,
        "labelOffset": [
          0,
          0
        ],
        "labelSize": 16,
        "highlightStrokeWidth": 4.5,
        "highlightFillOpacity": 0.6,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "textO_copy_2",
      "label": "igualdad",
      "color": "carbon",
      "layerId": "geometry",
      "order": 2120,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Etiqueta",
        "role": "annotation"
      },
      "target": true,
      "targetId": "textO_copy_2",
      "objectType": "annotation",
      "variant": "text",
      "content": {
        "text": "**=**"
      },
      "anchor": {
        "type": "object",
        "object": "O_copy_2",
        "offset": [
          -2.1899999999999995,
          0.48
        ]
      },
      "appearance": {
        "fontSize": 42,
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [
    {
      "id": "equalAngleangle1_copy",
      "label": "α (copia) tiene la misma amplitud que α",
      "enabled": true,
      "type": "equal-angle",
      "angles": [
        "angle1_copy",
        "angle1"
      ],
      "drivenPoint": "B_copy"
    },
    {
      "id": "equalAngleangle2_copy_2",
      "label": "β  tiene la misma amplitud que β",
      "enabled": true,
      "type": "equal-angle",
      "angles": [
        "angle2_copy_2",
        "angle2"
      ],
      "drivenPoint": "A_copy_2"
    }
  ],
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
        "B",
        "angle1_copy",
        "angle2_copy",
        "A"
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
        },
        "angle1_copy": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "angle2_copy": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "A_copy": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "B_copy": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "angle2_copy_2": {
          "visible": false,
          "emphasis": "primary",
          "interactive": true
        },
        "angle3_copy": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "A_copy_2": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "B_copy_2": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "textO_copy_2": {
          "visible": false,
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
        "B",
        "angle2_copy_2",
        "angle3_copy",
        "angle1_copy",
        "angle2_copy"
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
        },
        "angle1_copy": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "angle2_copy": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "A_copy": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "B_copy": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "angle2_copy_2": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "angle3_copy": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "A_copy_2": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "B_copy_2": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "textO_copy_2": {
          "visible": false,
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
        "B",
        "angle1_copy",
        "angle2_copy",
        "angle2_copy_2",
        "angle3_copy",
        "textO_copy_2"
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
        },
        "angle1_copy": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "angle2_copy": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "A_copy": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "B_copy": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "angle2_copy_2": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "angle3_copy": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "A_copy_2": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "B_copy_2": {
          "visible": false,
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
        "B",
        "angle1_copy",
        "angle3_copy",
        "textO_copy_2"
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
        },
        "angle1_copy": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "angle2_copy": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "A_copy": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "B_copy": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "angle2_copy_2": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "angle3_copy": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "A_copy_2": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "B_copy_2": {
          "visible": false,
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
        },
        "angle1_copy": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "angle2_copy": {
          "visible": false,
          "emphasis": "primary",
          "interactive": true
        },
        "A_copy": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "B_copy": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "angle2_copy_2": {
          "visible": false,
          "emphasis": "primary",
          "interactive": true
        },
        "angle3_copy": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "A_copy_2": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "B_copy_2": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "textO_copy_2": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        }
      }
    }
  ],
  "note": "Mueve A y B"
}
);
/* @matematika-diagram-spec:end */

export const DemoAngulosOpuestos = () => <DiagramRenderer spec={DemoAngulosOpuestosSpec} />;
