import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const AngulosOpuestosSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Ángulos opuestos por el vértice",
  "componentId": "angulos-opuestos",
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
      "color": "terracota"
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
      "color": "terracota"
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
      "color": "terracota"
    }
  ],
  "objects": [
    {
      "id": "O",
      "label": "O",
      "color": "carbon",
      "layerId": "geometry",
      "order": 6000,
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
      "color": "terracota",
      "layerId": "geometry",
      "order": 2000,
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
      "id": "B",
      "label": "B",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 4000,
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
      "id": "Ap",
      "label": "A'",
      "color": "terracota",
      "layerId": "geometry",
      "order": 3000,
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
      "order": 5000,
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
      "id": "lineL",
      "label": "Recta l",
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
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "lineM",
      "label": "Recta m",
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
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "angle1",
      "label": "α",
      "color": "terracota",
      "layerId": "geometry",
      "order": 970,
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
        "radius": 0.75,
        "fillOpacity": 0.28,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "angle2",
      "label": "β",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 980,
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
        "radius": 0.58,
        "fillOpacity": 0.2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "angle3",
      "label": "α'",
      "color": "terracota",
      "layerId": "geometry",
      "order": 990,
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
        "radius": 0.75,
        "fillOpacity": 0.28,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "angle4",
      "label": "β'",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 1000,
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
        "radius": 0.58,
        "fillOpacity": 0.2,
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [],
  "steps": [],
  "note": "Mueve A o B para girar las rectas"
}
);
/* @matematika-diagram-spec:end */

export const AngulosOpuestos = () => <DiagramRenderer spec={AngulosOpuestosSpec} />;
