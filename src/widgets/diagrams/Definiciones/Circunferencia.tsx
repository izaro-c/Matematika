import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const CircunferenciaSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Circunferencia y sus elementos notables",
  "componentId": "circunferencia",
  "category": "Definiciones",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "viewport": {
    "bounds": [
      -5,
      4.5,
      5,
      -4.5
    ],
    "home": [
      -5,
      4.5,
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
  "groups": [
    {
      "id": "grupoDiametro",
      "label": "Diámetro y extremo opuesto",
      "memberIds": [
        "D",
        "diametroDP"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Mostrar el diámetro y su extremo opuesto",
        "role": "secondary"
      },
      "target": true,
      "targetId": "diametro",
      "color": "salvia"
    },
    {
      "id": "grupoCuerda",
      "label": "Cuerda y extremos",
      "memberIds": [
        "Q",
        "R",
        "cuerdaQR"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Mostrar la cuerda QR y sus extremos",
        "role": "secondary"
      },
      "target": true,
      "targetId": "cuerda",
      "color": "pavo"
    },
    {
      "id": "grupoArco",
      "label": "Arco y extremos",
      "memberIds": [
        "Q",
        "R",
        "arcoQR"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Mostrar el arco QR y sus extremos",
        "role": "secondary"
      },
      "target": true,
      "targetId": "arco",
      "color": "pavo"
    },
    {
      "id": "grupoTangente",
      "label": "Tangente y punto de tangencia",
      "memberIds": [
        "T",
        "tangenteT"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Mostrar la tangente y el punto T",
        "role": "secondary"
      },
      "target": true,
      "targetId": "tangente",
      "color": "ocre"
    }
  ],
  "objects": [
    {
      "id": "O",
      "label": "O",
      "color": "carbon",
      "layerId": "geometry",
      "order": 100,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Centro O; se puede mover",
        "role": "primary"
      },
      "target": true,
      "targetId": "centro",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -0.5,
        "y": -0.25
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "labelOffset": [
          -14,
          -18
        ],
        "labelSize": 19,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {
        "snapToGrid": true,
        "snapSize": 0.25
      }
    },
    {
      "id": "P",
      "label": "P",
      "color": "terracota",
      "layerId": "geometry",
      "order": 110,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto P que determina el radio; se puede mover",
        "role": "primary"
      },
      "target": true,
      "targetId": "punto-p",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.5,
        "y": 0.25
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "labelOffset": [
          10,
          -18
        ],
        "labelSize": 19,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {
        "snapToGrid": true,
        "snapSize": 0.25
      }
    },
    {
      "id": "D",
      "label": "D",
      "color": "salvia",
      "layerId": "geometry",
      "order": 120,
      "visible": false,
      "locked": true,
      "groupIds": [
        "grupoDiametro"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Extremo D del diámetro, opuesto a P",
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "2 * O.x - P.x",
        "y": "2 * O.y - P.y",
        "fallback": [
          -3.5,
          -0.75
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "labelOffset": [
          -18,
          -18
        ],
        "labelSize": 19,
        "highlightSize": 10,
        "preserveColorOnHighlight": true,
        "highlightVisible": true
      },
      "interaction": {}
    },
    {
      "id": "Q",
      "label": "Q",
      "color": "pavo",
      "layerId": "geometry",
      "order": 130,
      "visible": false,
      "locked": false,
      "groupIds": [
        "grupoCuerda",
        "grupoArco"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Extremo Q de la cuerda; se desliza sobre la circunferencia",
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0.5,
        "y": 2.62
      },
      "mobility": {
        "type": "on-support",
        "support": "circunferenciaBase"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "labelOffset": [
          10,
          12
        ],
        "labelSize": 19,
        "highlightSize": 10,
        "preserveColorOnHighlight": true,
        "highlightVisible": true
      },
      "interaction": {}
    },
    {
      "id": "R",
      "label": "R",
      "color": "pavo",
      "layerId": "geometry",
      "order": 140,
      "visible": false,
      "locked": false,
      "groupIds": [
        "grupoCuerda",
        "grupoArco"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Extremo R de la cuerda; se desliza sobre la circunferencia",
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2.7,
        "y": 1.85
      },
      "mobility": {
        "type": "on-support",
        "support": "circunferenciaBase"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "labelOffset": [
          -20,
          8
        ],
        "labelSize": 19,
        "highlightSize": 10,
        "preserveColorOnHighlight": true,
        "highlightVisible": true
      },
      "interaction": {}
    },
    {
      "id": "T",
      "label": "T",
      "color": "ocre",
      "layerId": "geometry",
      "order": 150,
      "visible": false,
      "locked": false,
      "groupIds": [
        "grupoTangente"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto de tangencia T; se desliza sobre la circunferencia",
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 1.9,
        "y": -2.12
      },
      "mobility": {
        "type": "on-support",
        "support": "circunferenciaBase"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "labelOffset": [
          10,
          -18
        ],
        "labelSize": 19,
        "highlightSize": 10,
        "preserveColorOnHighlight": true,
        "highlightVisible": true
      },
      "interaction": {}
    },
    {
      "id": "discoInterior",
      "label": "Círculo interior",
      "color": "salvia",
      "layerId": "geometry",
      "order": 10,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Círculo: región interior de la circunferencia",
        "role": "secondary"
      },
      "target": true,
      "targetId": "circulo",
      "objectType": "path",
      "geometry": {
        "type": "circle",
        "center": "O",
        "point": "P"
      },
      "appearance": {
        "strokeWidth": 0,
        "fillOpacity": 0.08,
        "highlightStrokeWidth": 0,
        "highlightFillOpacity": 0.28,
        "highlightVisible": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "circunferenciaBase",
      "label": "Circunferencia C(O,r)",
      "color": "terracota",
      "layerId": "geometry",
      "order": 20,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Circunferencia de centro O y radio OP",
        "role": "primary"
      },
      "target": true,
      "targetId": "circunferencia",
      "objectType": "path",
      "geometry": {
        "type": "circle",
        "center": "O",
        "point": "P"
      },
      "appearance": {
        "strokeWidth": 3,
        "fillOpacity": 0,
        "highlightStrokeWidth": 4.5,
        "highlightFillOpacity": 0,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "diametroDP",
      "label": "Diámetro DP",
      "color": "salvia",
      "layerId": "geometry",
      "order": 30,
      "visible": false,
      "locked": false,
      "groupIds": [
        "grupoDiametro"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Diámetro DP que pasa por el centro O",
        "role": "secondary"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "D",
          "P"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 4.2,
        "highlightVisible": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "radioOP",
      "label": "Radio OP",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 40,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Radio OP",
        "role": "secondary"
      },
      "target": true,
      "targetId": "radio",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "O",
          "P"
        ]
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 4.2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "cuerdaQR",
      "label": "Cuerda QR",
      "color": "pavo",
      "layerId": "geometry",
      "order": 50,
      "visible": false,
      "locked": false,
      "groupIds": [
        "grupoCuerda"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Cuerda QR",
        "role": "secondary"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "Q",
          "R"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 4.2,
        "highlightVisible": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "arcoQR",
      "label": "Arco QR",
      "color": "pavo",
      "layerId": "geometry",
      "order": 60,
      "visible": false,
      "locked": false,
      "groupIds": [
        "grupoArco"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Arco menor QR",
        "role": "secondary"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "arc",
        "points": [
          "O",
          "Q",
          "R"
        ],
        "direction": "counterclockwise"
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 4.2,
        "highlightVisible": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "tangenteT",
      "label": "Tangente en T",
      "color": "ocre",
      "layerId": "geometry",
      "order": 70,
      "visible": false,
      "locked": false,
      "groupIds": [
        "grupoTangente"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta tangente en T, perpendicular al radio OT",
        "role": "secondary"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "perpendicular",
          "linePoints": [
            "O",
            "T"
          ],
          "through": "T"
        }
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 4.2,
        "highlightVisible": true,
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [],
  "steps": [],
  "note": "Mueve O y P. Enfoca los enlaces del texto para revelar cada elemento notable sin recargar la figura."
}
);
/* @matematika-diagram-spec:end */

export const Circunferencia = () => <DiagramRenderer spec={CircunferenciaSpec} />;
