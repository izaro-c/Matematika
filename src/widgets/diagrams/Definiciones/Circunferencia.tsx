import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const CircunferenciaSpec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
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
  "points": [
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
      "style": {
        "pointSize": 7,
        "labelOffset": [
          -14,
          -18
        ],
        "labelSize": 19,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -0.5,
      "y": -0.25,
      "showLabel": true,
      "fixed": false,
      "constraint": "free",
      "snapToGrid": true,
      "snapSize": 0.25
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
      "style": {
        "pointSize": 7,
        "labelOffset": [
          10,
          -18
        ],
        "labelSize": 19,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 2.5,
      "y": 0.25,
      "showLabel": true,
      "fixed": false,
      "constraint": "free",
      "snapToGrid": true,
      "snapSize": 0.25
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
      "style": {
        "pointSize": 7,
        "labelOffset": [
          -18,
          -18
        ],
        "labelSize": 19,
        "highlightPointSize": 10,
        "highlightVisible": true,
        "preserveColorOnHighlight": true
      },
      "x": -3.5,
      "y": -0.75,
      "showLabel": true,
      "fixed": true,
      "constraint": "derived",
      "dependencies": [
        "O",
        "P"
      ],
      "xExpression": "2 * O.x - P.x",
      "yExpression": "2 * O.y - P.y"
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
      "style": {
        "pointSize": 7,
        "labelOffset": [
          10,
          12
        ],
        "labelSize": 19,
        "highlightPointSize": 10,
        "highlightVisible": true,
        "preserveColorOnHighlight": true
      },
      "x": 0.5,
      "y": 2.62,
      "showLabel": true,
      "fixed": false,
      "constraint": "glider",
      "gliderTarget": "circunferenciaBase"
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
      "style": {
        "pointSize": 7,
        "labelOffset": [
          -20,
          8
        ],
        "labelSize": 19,
        "highlightPointSize": 10,
        "highlightVisible": true,
        "preserveColorOnHighlight": true
      },
      "x": -2.7,
      "y": 1.85,
      "showLabel": true,
      "fixed": false,
      "constraint": "glider",
      "gliderTarget": "circunferenciaBase"
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
      "style": {
        "pointSize": 7,
        "labelOffset": [
          10,
          -18
        ],
        "labelSize": 19,
        "highlightPointSize": 10,
        "highlightVisible": true,
        "preserveColorOnHighlight": true
      },
      "x": 1.9,
      "y": -2.12,
      "showLabel": true,
      "fixed": false,
      "constraint": "glider",
      "gliderTarget": "circunferenciaBase"
    }
  ],
  "elements": [
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
      "style": {
        "strokeWidth": 0,
        "fillOpacity": 0.08,
        "highlightStrokeWidth": 0,
        "highlightFillOpacity": 0.28,
        "highlightVisible": true,
        "preserveColorOnHighlight": true
      },
      "kind": "circle",
      "refs": [
        "O",
        "P"
      ]
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
      "style": {
        "strokeWidth": 3,
        "fillOpacity": 0,
        "highlightStrokeWidth": 4.5,
        "highlightFillOpacity": 0,
        "preserveColorOnHighlight": true
      },
      "kind": "circle",
      "refs": [
        "O",
        "P"
      ]
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
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 4.2,
        "highlightVisible": true,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "D",
        "P"
      ]
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
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 4.2,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "O",
        "P"
      ],
      "dashed": true
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
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 4.2,
        "highlightVisible": true,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "Q",
        "R"
      ]
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
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 4.2,
        "highlightVisible": true,
        "preserveColorOnHighlight": true
      },
      "kind": "arc",
      "refs": [
        "O",
        "Q",
        "R"
      ]
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
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 4.2,
        "highlightVisible": true,
        "preserveColorOnHighlight": true
      },
      "kind": "perpendicular",
      "refs": [
        "O",
        "T",
        "T"
      ]
    }
  ],
  "sliders": [],
  "steps": [],
  "constraints": [],
  "dependencies": [
    {
      "sourceId": "O",
      "targetId": "D",
      "relation": "expression"
    },
    {
      "sourceId": "P",
      "targetId": "D",
      "relation": "expression"
    },
    {
      "sourceId": "O",
      "targetId": "discoInterior",
      "relation": "construction"
    },
    {
      "sourceId": "P",
      "targetId": "discoInterior",
      "relation": "construction"
    },
    {
      "sourceId": "O",
      "targetId": "circunferenciaBase",
      "relation": "construction"
    },
    {
      "sourceId": "P",
      "targetId": "circunferenciaBase",
      "relation": "construction"
    },
    {
      "sourceId": "D",
      "targetId": "diametroDP",
      "relation": "construction"
    },
    {
      "sourceId": "P",
      "targetId": "diametroDP",
      "relation": "construction"
    },
    {
      "sourceId": "O",
      "targetId": "radioOP",
      "relation": "construction"
    },
    {
      "sourceId": "P",
      "targetId": "radioOP",
      "relation": "construction"
    },
    {
      "sourceId": "Q",
      "targetId": "cuerdaQR",
      "relation": "construction"
    },
    {
      "sourceId": "R",
      "targetId": "cuerdaQR",
      "relation": "construction"
    },
    {
      "sourceId": "O",
      "targetId": "arcoQR",
      "relation": "construction"
    },
    {
      "sourceId": "Q",
      "targetId": "arcoQR",
      "relation": "construction"
    },
    {
      "sourceId": "R",
      "targetId": "arcoQR",
      "relation": "construction"
    },
    {
      "sourceId": "O",
      "targetId": "tangenteT",
      "relation": "construction"
    },
    {
      "sourceId": "T",
      "targetId": "tangenteT",
      "relation": "construction"
    }
  ],
  "note": "Mueve O y P. Enfoca los enlaces del texto para revelar cada elemento notable sin recargar la figura.",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const Circunferencia = () => <DiagramRenderer spec={CircunferenciaSpec} />;
