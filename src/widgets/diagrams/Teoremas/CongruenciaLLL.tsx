import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const CongruenciaLLLSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Criterio de congruencia LLL",
  "componentId": "criterio-de-congruencia-lll",
  "category": "Teoremas",
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
    "minZoom": 0.2,
    "maxZoom": 12,
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
      "id": "controls",
      "label": "Controles",
      "order": 1,
      "visible": true,
      "locked": false
    }
  ],
  "groups": [
    {
      "id": "group1",
      "label": "Congruencia Total",
      "memberIds": [
        "pA1",
        "pB1",
        "pC1",
        "pA2",
        "pB2",
        "pC2",
        "segA1B1",
        "segB1C1",
        "segA1C1",
        "segA2B2",
        "segB2C2",
        "segA2C2",
        "congruenceMarkA1C1",
        "congruenceMarkB1C1",
        "congruenceMarkA1B1",
        "congruenceMarkA2B2",
        "congruenceMarkB2C2",
        "congruenceMarkA2C2",
        "nonReflexAngleB1A1C1",
        "nonReflexAngleC1B1A1",
        "nonReflexAngleA1C1B1",
        "nonReflexAngleA2B2C2",
        "nonReflexAngleB2C2A2",
        "nonReflexAngleC2A2B2"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": true,
      "targetId": "congruencia-total"
    },
    {
      "id": "group2",
      "label": "ladosAB",
      "memberIds": [
        "pA1",
        "pB1",
        "pA2",
        "pB2",
        "segA1B1",
        "segA2B2",
        "congruenceMarkA1B1",
        "congruenceMarkA2B2"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": true,
      "targetId": "lados-AB"
    },
    {
      "id": "group3",
      "label": "ladosAC",
      "memberIds": [
        "pA1",
        "pC1",
        "pA2",
        "pC2",
        "segA1C1",
        "segA2C2",
        "congruenceMarkA1C1",
        "congruenceMarkA2C2"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": true,
      "targetId": "lados-AC"
    },
    {
      "id": "group4",
      "label": "ladosBC",
      "memberIds": [
        "pB1",
        "pC1",
        "pB2",
        "pC2",
        "segB1C1",
        "segB2C2",
        "congruenceMarkB1C1"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": true,
      "targetId": "lados-BC"
    }
  ],
  "objects": [
    {
      "id": "pA1",
      "label": "A",
      "color": "terracota",
      "layerId": "geometry",
      "order": 31000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group2",
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto A",
        "role": "primary"
      },
      "target": true,
      "targetId": "pA1",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3.05,
        "y": 0.58
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
      "id": "pB1",
      "label": "B",
      "color": "terracota",
      "layerId": "geometry",
      "order": 30000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group2",
        "group4"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto B",
        "role": "primary"
      },
      "target": true,
      "targetId": "pB1",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.96,
        "y": 0.63
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
      "id": "pC1",
      "label": "C",
      "color": "terracota",
      "layerId": "geometry",
      "order": 29000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group3",
        "group4"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto C",
        "role": "primary"
      },
      "target": true,
      "targetId": "pC1",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -0.05,
        "y": 5
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
      "id": "pA2",
      "label": "A'",
      "color": "pavo",
      "layerId": "geometry",
      "order": 28000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group2",
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto D",
        "role": "primary"
      },
      "target": true,
      "targetId": "pA2",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3.1,
        "y": -1.09
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
      "id": "pB2",
      "label": "B'",
      "color": "pavo",
      "layerId": "geometry",
      "order": 27000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group2",
        "group4"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto A",
        "role": "primary"
      },
      "target": true,
      "targetId": "pB2",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.9101956648599523,
        "y": -1.077831594244687
      },
      "mobility": {
        "type": "constrained",
        "relationIds": [
          "equalLengthsegA2B2"
        ]
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
      "id": "pC2",
      "label": "C",
      "color": "pavo",
      "layerId": "geometry",
      "order": 26000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group3",
        "group4"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto A",
        "role": "primary"
      },
      "target": true,
      "targetId": "pC2",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -0.05443987111835247,
        "y": -5.478731422787957
      },
      "mobility": {
        "type": "constrained",
        "relationIds": [
          "equalLengthsegB2C2",
          "equalLengthsegA2C2"
        ]
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
      "id": "polygonA1B1C1",
      "label": "Polígono",
      "color": "terracota",
      "layerId": "geometry",
      "order": 6000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Polígono",
        "role": "secondary"
      },
      "target": false,
      "targetId": "polygonA1B1C1",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "pA1",
          "pB1",
          "pC1"
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "polygonA2B2C2",
      "label": "Polígono",
      "color": "pavo",
      "layerId": "geometry",
      "order": 7000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Polígono",
        "role": "secondary"
      },
      "target": false,
      "targetId": "polygonA2B2C2",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "pA2",
          "pB2",
          "pC2"
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segA1B1",
      "label": "Segmento",
      "color": "terracota",
      "layerId": "geometry",
      "order": 8000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group2"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segA1B1",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pA1",
          "pB1"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segB1C1",
      "label": "Segmento",
      "color": "terracota",
      "layerId": "geometry",
      "order": 9000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group4"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segB1C1",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pB1",
          "pC1"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segA1C1",
      "label": "Segmento",
      "color": "terracota",
      "layerId": "geometry",
      "order": 10000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segA1C1",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pA1",
          "pC1"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segA2B2",
      "label": "Segmento",
      "color": "pavo",
      "layerId": "geometry",
      "order": 11000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group2"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segA2B2",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pA2",
          "pB2"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segB2C2",
      "label": "Segmento",
      "color": "pavo",
      "layerId": "geometry",
      "order": 12000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group4"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segB2C2",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pB2",
          "pC2"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segA2C2",
      "label": "Segmento",
      "color": "pavo",
      "layerId": "geometry",
      "order": 13000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segA2C2",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pA2",
          "pC2"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "congruenceMarkA1C1",
      "label": "Marca de congruencia de Segmento",
      "color": "ocre",
      "layerId": "geometry",
      "order": 14000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia de Segmento",
        "role": "secondary"
      },
      "target": false,
      "targetId": "congruenceMarkA1C1",
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "pA1",
          "pC1"
        ]
      },
      "count": 2,
      "height": 0.6,
      "appearance": {
        "strokeWidth": 2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "congruenceMarkB1C1",
      "label": "Marca de congruencia de Segmento",
      "color": "ocre",
      "layerId": "geometry",
      "order": 15000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group4"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia de Segmento",
        "role": "secondary"
      },
      "target": false,
      "targetId": "congruenceMarkB1C1",
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "pB1",
          "pC1"
        ]
      },
      "count": 3,
      "height": 0.6,
      "appearance": {
        "strokeWidth": 2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "congruenceMarkA1B1",
      "label": "Marca de congruencia de Segmento",
      "color": "ocre",
      "layerId": "geometry",
      "order": 16000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group2"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia de Segmento",
        "role": "secondary"
      },
      "target": false,
      "targetId": "congruenceMarkA1B1",
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "pA1",
          "pB1"
        ]
      },
      "count": 1,
      "height": 0.6,
      "appearance": {
        "strokeWidth": 2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "congruenceMarkA2B2",
      "label": "Marca de congruencia de Segmento",
      "color": "ocre",
      "layerId": "geometry",
      "order": 17000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group2"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia de Segmento",
        "role": "secondary"
      },
      "target": false,
      "targetId": "congruenceMarkA2B2",
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "pA2",
          "pB2"
        ]
      },
      "count": 1,
      "height": 0.6,
      "appearance": {
        "strokeWidth": 2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "congruenceMarkB2C2",
      "label": "Marca de congruencia de Segmento",
      "color": "ocre",
      "layerId": "geometry",
      "order": 18000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia de Segmento",
        "role": "secondary"
      },
      "target": false,
      "targetId": "congruenceMarkB2C2",
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "pB2",
          "pC2"
        ]
      },
      "count": 3,
      "height": 0.6,
      "appearance": {
        "strokeWidth": 2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "congruenceMarkA2C2",
      "label": "Marca de congruencia de Segmento",
      "color": "ocre",
      "layerId": "geometry",
      "order": 19000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia de Segmento",
        "role": "secondary"
      },
      "target": false,
      "targetId": "congruenceMarkA2C2",
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "pA2",
          "pC2"
        ]
      },
      "count": 2,
      "height": 0.6,
      "appearance": {
        "strokeWidth": 2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "nonReflexAngleB1A1C1",
      "label": "Ángulo no reflejo (≤ 180°)",
      "color": "musgo",
      "layerId": "geometry",
      "order": 20000,
      "visible": false,
      "locked": false,
      "groupIds": [
        "group1"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": false,
      "targetId": "nonReflexAngleB1A1C1",
      "objectType": "angle",
      "points": [
        "pB1",
        "pA1",
        "pC1"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 1,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "nonReflexAngleC1B1A1",
      "label": "Ángulo no reflejo (≤ 180°)",
      "color": "musgo",
      "layerId": "geometry",
      "order": 21000,
      "visible": false,
      "locked": false,
      "groupIds": [
        "group1"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": false,
      "targetId": "nonReflexAngleC1B1A1",
      "objectType": "angle",
      "points": [
        "pC1",
        "pB1",
        "pA1"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 1,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "nonReflexAngleA1C1B1",
      "label": "Ángulo no reflejo (≤ 180°)",
      "color": "musgo",
      "layerId": "geometry",
      "order": 22000,
      "visible": false,
      "locked": false,
      "groupIds": [
        "group1"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": false,
      "targetId": "nonReflexAngleA1C1B1",
      "objectType": "angle",
      "points": [
        "pA1",
        "pC1",
        "pB1"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 1,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "nonReflexAngleA2B2C2",
      "label": "Ángulo no reflejo (≤ 180°)",
      "color": "musgo",
      "layerId": "geometry",
      "order": 23000,
      "visible": false,
      "locked": false,
      "groupIds": [
        "group1"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": false,
      "targetId": "nonReflexAngleA2B2C2",
      "objectType": "angle",
      "points": [
        "pA2",
        "pB2",
        "pC2"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 1,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "nonReflexAngleB2C2A2",
      "label": "Ángulo no reflejo (≤ 180°)",
      "color": "musgo",
      "layerId": "geometry",
      "order": 24000,
      "visible": false,
      "locked": false,
      "groupIds": [
        "group1"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": false,
      "targetId": "nonReflexAngleB2C2A2",
      "objectType": "angle",
      "points": [
        "pB2",
        "pC2",
        "pA2"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 1,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "nonReflexAngleC2A2B2",
      "label": "Ángulo no reflejo (≤ 180°)",
      "color": "musgo",
      "layerId": "geometry",
      "order": 25000,
      "visible": false,
      "locked": false,
      "groupIds": [
        "group1"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": false,
      "targetId": "nonReflexAngleC2A2B2",
      "objectType": "angle",
      "points": [
        "pC2",
        "pA2",
        "pB2"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 1,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [
    {
      "id": "equalLengthsegA2B2",
      "label": "Segmento tiene la misma longitud que Segmento",
      "enabled": true,
      "type": "equal-length",
      "segments": [
        "segA2B2",
        "segA1B1"
      ],
      "drivenPoint": "pB2"
    },
    {
      "id": "equalLengthsegB2C2",
      "label": "Segmento tiene la misma longitud que Segmento",
      "enabled": true,
      "type": "equal-length",
      "segments": [
        "segB2C2",
        "segB1C1"
      ],
      "drivenPoint": "pC2"
    },
    {
      "id": "equalLengthsegA2C2",
      "label": "Segmento tiene la misma longitud que Segmento",
      "enabled": true,
      "type": "equal-length",
      "segments": [
        "segA2C2",
        "segA1C1"
      ],
      "drivenPoint": "pC2"
    }
  ],
  "steps": [],
  "note": "Arrastra A, B y C"
}
);
/* @matematika-diagram-spec:end */

export const CongruenciaLLL = () => <DiagramRenderer spec={CongruenciaLLLSpec} />;
