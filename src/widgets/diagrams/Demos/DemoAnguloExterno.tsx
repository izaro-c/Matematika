import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const DemoAnguloExternoSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Teorema del ángulo externo",
  "componentId": "teorema-del-angulo-externo",
  "category": "Demos",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "showLabels": true,
  "viewport": {
    "bounds": [
      -5.5,
      5.5,
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
  "groups": [],
  "objects": [
    {
      "id": "pA",
      "label": "A",
      "color": "granada",
      "layerId": "geometry",
      "order": 34,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto A",
        "role": "primary"
      },
      "target": true,
      "targetId": "pA",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -4.04,
        "y": -2.69
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
      "id": "pB",
      "label": "B",
      "color": "granada",
      "layerId": "geometry",
      "order": 33,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto B",
        "role": "primary"
      },
      "target": true,
      "targetId": "pB",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.9,
        "y": -2.6
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
      "id": "pC",
      "label": "C",
      "color": "granada",
      "layerId": "geometry",
      "order": 32,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto C",
        "role": "primary"
      },
      "target": true,
      "targetId": "pC",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -0.38,
        "y": 2.77
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
      "id": "pD",
      "label": "D",
      "color": "pavo",
      "layerId": "geometry",
      "order": 31,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto D",
        "role": "primary"
      },
      "target": true,
      "targetId": "pD",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -1.7524114088159028,
        "y": 5.808910976663785
      },
      "mobility": {
        "type": "on-support",
        "support": "rayBC"
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
      "id": "paux",
      "label": "Aux",
      "color": "terracota",
      "layerId": "geometry",
      "order": 2,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "highlightable": false,
        "ariaLabel": "Punto E",
        "role": "primary"
      },
      "target": true,
      "targetId": "paux",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -44.68272619644714,
        "y": 75.30220721796377
      },
      "mobility": {
        "type": "constrained",
        "relationIds": [
          "constraint1"
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
      "id": "pF",
      "label": "F",
      "color": "salvia",
      "layerId": "geometry",
      "order": 29,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto 6",
        "role": "primary"
      },
      "target": true,
      "targetId": "pF",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -7.32,
        "y": 2.68
      },
      "mobility": {
        "type": "constrained",
        "relationIds": [
          "constraint3"
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
      "id": "pH",
      "label": "H",
      "color": "terracota",
      "layerId": "geometry",
      "order": 36,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto E",
        "role": "primary"
      },
      "target": true,
      "targetId": "pH",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 6.5600000000000005,
        "y": 2.86
      },
      "mobility": {
        "type": "constrained",
        "relationIds": [
          "constraint4"
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
      "id": "polygonABC",
      "label": "Triángulo ABC",
      "color": "granada",
      "layerId": "geometry",
      "order": 4,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Polígono",
        "role": "secondary"
      },
      "target": true,
      "targetId": "polygonABC",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "pA",
          "pB",
          "pC"
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segAB",
      "label": "Segmento AB",
      "color": "granada",
      "layerId": "geometry",
      "order": 5,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segAB",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pA",
          "pB"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segBC",
      "label": "Segmento BC",
      "color": "granada",
      "layerId": "geometry",
      "order": 6,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segBC",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pB",
          "pC"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segAC",
      "label": "Segmento AC",
      "color": "granada",
      "layerId": "geometry",
      "order": 7,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segAC",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pA",
          "pC"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "rayBC",
      "label": "Semirrecta BC",
      "color": "pavo",
      "layerId": "geometry",
      "order": 8,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Semirrecta",
        "role": "secondary"
      },
      "target": true,
      "targetId": "rayBC",
      "objectType": "path",
      "geometry": {
        "type": "ray",
        "points": [
          "pC",
          "paux"
        ]
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "nonReflexAngleABC",
      "label": "Ángulo ABC",
      "color": "musgo",
      "layerId": "geometry",
      "order": 10,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "nonReflexAngleABC",
      "objectType": "angle",
      "points": [
        "pA",
        "pB",
        "pC"
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
      "id": "nonReflexAngleBAC",
      "label": "Ángulo BAC",
      "color": "pavo",
      "layerId": "geometry",
      "order": 24,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "nonReflexAngleBAC",
      "objectType": "angle",
      "points": [
        "pB",
        "pA",
        "pC"
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
      "id": "nonReflexAngleBCA",
      "label": "Ángulo BCA",
      "color": "musgo",
      "layerId": "geometry",
      "order": 11,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "nonReflexAngleBCA",
      "objectType": "angle",
      "points": [
        "pB",
        "pC",
        "pA"
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
      "id": "nonReflexAngleBCD",
      "label": "Ángulo BCD",
      "color": "granada",
      "layerId": "geometry",
      "order": 12,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "nonReflexAngleBCD",
      "objectType": "angle",
      "points": [
        "pB",
        "pC",
        "pD"
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
      "id": "midAC",
      "label": "E",
      "color": "salvia",
      "layerId": "geometry",
      "order": 30,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto medio",
        "role": "secondary"
      },
      "target": true,
      "targetId": "midAC",
      "objectType": "point",
      "definition": {
        "type": "midpoint",
        "points": [
          "pA",
          "pC"
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segBmidAC",
      "label": "Segmento EB",
      "color": "salvia",
      "layerId": "geometry",
      "order": 13,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segBmidAC",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pB",
          "midAC"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "rayBmidAC",
      "label": "Semirrecta BE",
      "color": "pavo",
      "layerId": "geometry",
      "order": 3,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Semirrecta",
        "role": "secondary"
      },
      "target": true,
      "targetId": "rayBmidAC",
      "objectType": "path",
      "geometry": {
        "type": "ray",
        "points": [
          "pB",
          "midAC"
        ]
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segmidACF",
      "label": "Segmento EF",
      "color": "salvia",
      "layerId": "geometry",
      "order": 14,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segmidACF",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "midAC",
          "pF"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segCF",
      "label": "Segmento CF",
      "color": "salvia",
      "layerId": "geometry",
      "order": 15,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segCF",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pC",
          "pF"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "polygonABmidAC",
      "label": "Polígono ABE",
      "color": "salvia",
      "layerId": "geometry",
      "order": 16,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Polígono",
        "role": "secondary"
      },
      "target": true,
      "targetId": "polygonABmidAC",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "pA",
          "pB",
          "midAC"
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "polygonCFmidAC",
      "label": "Polígono CEF",
      "color": "salvia",
      "layerId": "geometry",
      "order": 17,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Polígono",
        "role": "secondary"
      },
      "target": true,
      "targetId": "polygonCFmidAC",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "pC",
          "pF",
          "midAC"
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "nonReflexAngleAmidACB",
      "label": "Ángulo AEB",
      "color": "terracota",
      "layerId": "geometry",
      "order": 18,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "nonReflexAngleAmidACB",
      "objectType": "angle",
      "points": [
        "pA",
        "midAC",
        "pB"
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
      "id": "nonReflexAngleCmidACF",
      "label": "Ángulo CEF",
      "color": "terracota",
      "layerId": "geometry",
      "order": 19,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "nonReflexAngleCmidACF",
      "objectType": "angle",
      "points": [
        "pC",
        "midAC",
        "pF"
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
      "id": "nonReflexAnglemidACCF",
      "label": "Ángulo ECF",
      "color": "pavo",
      "layerId": "geometry",
      "order": 26,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "nonReflexAnglemidACCF",
      "objectType": "angle",
      "points": [
        "midAC",
        "pC",
        "pF"
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
      "id": "rayCF",
      "label": "Semirrecta CF",
      "color": "pavo",
      "layerId": "geometry",
      "order": 20,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Semirrecta",
        "role": "secondary"
      },
      "target": true,
      "targetId": "rayCF",
      "objectType": "path",
      "geometry": {
        "type": "ray",
        "points": [
          "pC",
          "pF"
        ]
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "nonReflexAngleACD",
      "label": "Ángulo ACD",
      "color": "ocre",
      "layerId": "geometry",
      "order": 9,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "nonReflexAngleACD",
      "objectType": "angle",
      "points": [
        "pD",
        "pC",
        "pA"
      ],
      "sweep": "directed",
      "marker": "arc",
      "appearance": {
        "radius": 1,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segAmidAC",
      "label": "Segmento AE",
      "color": "terracota",
      "layerId": "geometry",
      "order": 21,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segAmidAC",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pA",
          "midAC"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segmidACC",
      "label": "Segmento EC",
      "color": "terracota",
      "layerId": "geometry",
      "order": 22,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segmidACC",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "midAC",
          "pC"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "congruenceMarkAmidAC",
      "label": "Marca de congruencia AE",
      "color": "terracota",
      "layerId": "geometry",
      "order": 23,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia de Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "congruenceMarkAmidAC",
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "pA",
          "midAC"
        ]
      },
      "count": 2,
      "height": 0.5,
      "appearance": {
        "strokeWidth": 2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "congruenceMarkmidACC",
      "label": "Marca de congruencia EC",
      "color": "terracota",
      "layerId": "geometry",
      "order": 25,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia de Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "congruenceMarkmidACC",
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "midAC",
          "pC"
        ]
      },
      "count": 2,
      "height": 0.5,
      "appearance": {
        "strokeWidth": 2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "congruenceMarkBmidAC",
      "label": "Marca de congruencia de Segmento EB",
      "color": "ocre",
      "layerId": "geometry",
      "order": 27,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia de Segmento EB",
        "role": "secondary"
      },
      "target": true,
      "targetId": "congruenceMarkBmidAC",
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "pB",
          "midAC"
        ]
      },
      "count": 3,
      "height": 0.5,
      "appearance": {
        "strokeWidth": 2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "congruenceMarkmidACF",
      "label": "Marca de congruencia de Segmento EF",
      "color": "ocre",
      "layerId": "geometry",
      "order": 28,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia de Segmento EF",
        "role": "secondary"
      },
      "target": true,
      "targetId": "congruenceMarkmidACF",
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "midAC",
          "pF"
        ]
      },
      "count": 3,
      "height": 0.5,
      "appearance": {
        "strokeWidth": 2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "rayCF_2",
      "label": "Semirrecta",
      "color": "pavo",
      "layerId": "geometry",
      "order": 1,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Semirrecta",
        "role": "secondary"
      },
      "target": true,
      "targetId": "rayCF_2",
      "objectType": "path",
      "geometry": {
        "type": "ray",
        "points": [
          "pC",
          "pF"
        ]
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "midG",
      "label": "G",
      "color": "terracota",
      "layerId": "geometry",
      "order": 35,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto medio",
        "role": "secondary"
      },
      "target": true,
      "targetId": "midG",
      "objectType": "point",
      "definition": {
        "type": "midpoint",
        "points": [
          "pB",
          "pC"
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segAG",
      "label": "Segmento",
      "color": "carbon",
      "layerId": "geometry",
      "order": 37,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segAG",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pA",
          "pH"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "congruenceMarkmidBCG",
      "label": "Marca de congruencia",
      "color": "ocre",
      "layerId": "geometry",
      "order": 38,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia",
        "role": "secondary"
      },
      "target": true,
      "targetId": "congruenceMarkmidBCG",
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "midG",
          "pH"
        ]
      },
      "count": 1,
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "congruenceMarkAmidBC",
      "label": "Marca de congruencia",
      "color": "ocre",
      "layerId": "geometry",
      "order": 39,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia",
        "role": "secondary"
      },
      "target": true,
      "targetId": "congruenceMarkAmidBC",
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "pA",
          "midG"
        ]
      },
      "count": 1,
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segBmidAC_2",
      "label": "Segmento BE",
      "color": "ocre",
      "layerId": "geometry",
      "order": 0,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segBmidAC_2",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pB",
          "midAC"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [
    {
      "id": "constraint1",
      "label": "Sobre una paralela",
      "enabled": true,
      "type": "parallel",
      "supports": [
        [
          "paux",
          "pB"
        ],
        [
          "paux",
          "pC"
        ]
      ]
    },
    {
      "id": "constraint3",
      "label": "Reflejo simétrico",
      "enabled": true,
      "type": "reflection",
      "refs": [
        "pF",
        "midAC",
        "pB"
      ]
    },
    {
      "id": "constraint4",
      "label": "Reflejo simétrico",
      "enabled": true,
      "type": "reflection",
      "refs": [
        "pH",
        "midG",
        "pA"
      ]
    }
  ],
  "steps": [
    {
      "id": "initial",
      "label": "Hipótesis",
      "description": "",
      "visibleTargets": [
        "segAB",
        "segBC",
        "segAC",
        "rayBC",
        "nonReflexAngleACD",
        "polygonABC",
        "nonReflexAngleBAC",
        "nonReflexAngleABC",
        "pA",
        "pB",
        "pC"
      ],
      "durationMs": 1800,
      "objectStates": {
        "pA": {
          "visible": true,
          "emphasis": "none",
          "overlay": {
            "visible": false,
            "title": "A",
            "content": "{value}",
            "position": "bottom-right"
          },
          "interactive": true
        },
        "pB": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "pC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "pD": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "pF": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "polygonABC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "segAB": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "segBC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "segAC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "rayBC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAngleABC": {
          "visible": true,
          "emphasis": "secondary",
          "interactive": true
        },
        "nonReflexAngleBAC": {
          "visible": true,
          "emphasis": "secondary",
          "interactive": true
        },
        "nonReflexAngleBCA": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAngleBCD": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "midAC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "segBmidAC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "rayBmidAC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "segmidACF": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "segCF": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "polygonABmidAC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "polygonCFmidAC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAngleAmidACB": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAngleCmidACF": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAnglemidACCF": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "rayCF": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAngleACD": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "segAmidAC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "segmidACC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "congruenceMarkAmidAC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "congruenceMarkmidACC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "congruenceMarkBmidAC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "congruenceMarkmidACF": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "rayCF_2": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "midG": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "segAG": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "congruenceMarkmidBCG": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "congruenceMarkAmidBC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "pH": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "segBmidAC_2": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        }
      }
    },
    {
      "id": "step1",
      "label": "Construcción inicial",
      "description": "Se añade punto E",
      "visibleTargets": [
        "pA",
        "pB",
        "pC",
        "pD",
        "polygonABC",
        "segAB",
        "segBC",
        "segAC",
        "rayBC",
        "segAmidAC",
        "segmidACC",
        "congruenceMarkAmidAC",
        "congruenceMarkmidACC",
        "midAC",
        "segBmidAC_2"
      ],
      "durationMs": 1800,
      "objectStates": {
        "pA": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "pB": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "pC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "pD": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "pF": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "polygonABC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "segAB": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "segBC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "segAC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "rayBC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAngleABC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAngleBAC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAngleBCA": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAngleBCD": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "midAC": {
          "visible": true,
          "emphasis": "secondary",
          "interactive": true
        },
        "segBmidAC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "rayBmidAC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "segmidACF": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "segCF": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "polygonABmidAC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "polygonCFmidAC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAngleAmidACB": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAngleCmidACF": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAnglemidACCF": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "rayCF": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAngleACD": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "congruenceMarkBmidAC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "congruenceMarkmidACF": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "congruenceMarkAmidAC": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "congruenceMarkmidACC": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "rayCF_2": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "midG": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "segAG": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "congruenceMarkmidBCG": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "congruenceMarkAmidBC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "pH": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "segBmidAC_2": {
          "visible": true,
          "emphasis": "secondary",
          "interactive": true
        }
      }
    },
    {
      "id": "step2",
      "label": "Prolongación de BE",
      "description": "Se añade punto E",
      "visibleTargets": [
        "pA",
        "pB",
        "pC",
        "pD",
        "polygonABC",
        "segAB",
        "segBC",
        "segAC",
        "rayBC",
        "segAmidAC",
        "segmidACC",
        "segBmidAC_2",
        "rayBmidAC",
        "midAC",
        "congruenceMarkAmidAC",
        "congruenceMarkmidACC"
      ],
      "durationMs": 1800,
      "objectStates": {
        "pA": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "pB": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "pC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "pD": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "pF": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "polygonABC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "segAB": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "segBC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "segAC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "rayBC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAngleABC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAngleBAC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAngleBCA": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAngleBCD": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "midAC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "segBmidAC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "rayBmidAC": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "segmidACF": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "segCF": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "polygonABmidAC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "polygonCFmidAC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAngleAmidACB": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAngleCmidACF": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAnglemidACCF": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "rayCF": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAngleACD": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "congruenceMarkBmidAC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "congruenceMarkmidACF": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "congruenceMarkAmidAC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "congruenceMarkmidACC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "rayCF_2": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "midG": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "segAG": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "congruenceMarkmidBCG": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "congruenceMarkAmidBC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "pH": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "segBmidAC_2": {
          "visible": true,
          "emphasis": "secondary",
          "interactive": true
        }
      }
    },
    {
      "id": "step3",
      "label": "Duplicación de la mediana",
      "description": "Describa qué cambia y por qué.",
      "visibleTargets": [
        "pA",
        "pB",
        "pC",
        "pD",
        "pF",
        "polygonABC",
        "segAB",
        "segBC",
        "segAC",
        "rayBC",
        "midAC",
        "segBmidAC",
        "rayBmidAC",
        "segmidACF",
        "segAmidAC",
        "segmidACC",
        "congruenceMarkAmidAC",
        "congruenceMarkmidACC",
        "segCF",
        "congruenceMarkBmidAC",
        "congruenceMarkmidACF",
        "segBmidAC_2"
      ],
      "durationMs": 1800,
      "objectStates": {
        "pA": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "pB": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "pC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "pD": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "pF": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "polygonABC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "segAB": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "segBC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "segAC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "rayBC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAngleABC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAngleBAC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAngleBCA": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAngleBCD": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "midAC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "segBmidAC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "rayBmidAC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "segmidACF": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "segCF": {
          "visible": true,
          "emphasis": "secondary",
          "interactive": true
        },
        "polygonABmidAC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "polygonCFmidAC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAngleAmidACB": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAngleCmidACF": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAnglemidACCF": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "rayCF": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAngleACD": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "segAmidAC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "segmidACC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "congruenceMarkAmidAC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "congruenceMarkmidACC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "congruenceMarkBmidAC": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "congruenceMarkmidACF": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "rayCF_2": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "midG": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "segAG": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "congruenceMarkmidBCG": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "congruenceMarkAmidBC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "pH": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "segBmidAC_2": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        }
      }
    },
    {
      "id": "step4",
      "label": "Congruencia LAL",
      "description": "Describa qué cambia y por qué.",
      "visibleTargets": [
        "pA",
        "pB",
        "pC",
        "pD",
        "pF",
        "polygonABC",
        "segAB",
        "segBC",
        "segAC",
        "rayBC",
        "midAC",
        "segBmidAC",
        "rayBmidAC",
        "segmidACF",
        "segAmidAC",
        "segmidACC",
        "congruenceMarkAmidAC",
        "congruenceMarkmidACC",
        "congruenceMarkBmidAC",
        "congruenceMarkmidACF",
        "segCF",
        "polygonABmidAC",
        "polygonCFmidAC",
        "nonReflexAngleAmidACB",
        "nonReflexAngleCmidACF",
        "nonReflexAnglemidACCF",
        "nonReflexAngleBAC",
        "segBmidAC_2"
      ],
      "durationMs": 1800,
      "objectStates": {
        "pA": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "pB": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "pC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "pD": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "pF": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "polygonABC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "segAB": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "segBC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "segAC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "rayBC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAngleABC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAngleBAC": {
          "visible": true,
          "emphasis": "secondary",
          "interactive": true
        },
        "nonReflexAngleBCA": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAngleBCD": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "midAC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "segBmidAC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "rayBmidAC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "segmidACF": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "segCF": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "polygonABmidAC": {
          "visible": true,
          "emphasis": "secondary",
          "interactive": true
        },
        "polygonCFmidAC": {
          "visible": true,
          "emphasis": "secondary",
          "interactive": true
        },
        "nonReflexAngleAmidACB": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "nonReflexAngleCmidACF": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "nonReflexAnglemidACCF": {
          "visible": true,
          "emphasis": "secondary",
          "interactive": true
        },
        "rayCF": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAngleACD": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "segAmidAC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "segmidACC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "congruenceMarkAmidAC": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "congruenceMarkmidACC": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "congruenceMarkBmidAC": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "congruenceMarkmidACF": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "rayCF_2": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "midG": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "segAG": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "congruenceMarkmidBCG": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "congruenceMarkAmidBC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "pH": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "segBmidAC_2": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        }
      }
    },
    {
      "id": "step5",
      "label": "Contenencia angular",
      "description": "Describa qué cambia y por qué.",
      "visibleTargets": [
        "pA",
        "pB",
        "pC",
        "pD",
        "pF",
        "polygonABC",
        "segAB",
        "segBC",
        "segAC",
        "rayBC",
        "midAC",
        "segBmidAC",
        "segmidACF",
        "segAmidAC",
        "segmidACC",
        "segCF",
        "nonReflexAnglemidACCF",
        "nonReflexAngleBAC",
        "rayCF_2",
        "nonReflexAngleACD"
      ],
      "durationMs": 1800,
      "objectStates": {
        "pA": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "pB": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "pC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "pD": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "pF": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "polygonABC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "segAB": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "segBC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "segAC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "rayBC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAngleABC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAngleBAC": {
          "visible": true,
          "emphasis": "secondary",
          "interactive": true
        },
        "nonReflexAngleBCA": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAngleBCD": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "midAC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "segBmidAC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "rayBmidAC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "segmidACF": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "segCF": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "polygonABmidAC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "polygonCFmidAC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAngleAmidACB": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAngleCmidACF": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAnglemidACCF": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "rayCF": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAngleACD": {
          "visible": true,
          "emphasis": "secondary",
          "interactive": true
        },
        "segAmidAC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "segmidACC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "congruenceMarkAmidAC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "congruenceMarkmidACC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "congruenceMarkBmidAC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "congruenceMarkmidACF": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "rayCF_2": {
          "visible": true,
          "emphasis": "secondary",
          "interactive": true
        },
        "midG": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "segAG": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "congruenceMarkmidBCG": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "congruenceMarkAmidBC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "pH": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "segBmidAC_2": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        }
      }
    },
    {
      "id": "step6",
      "label": "Conclusión para el ángulo A",
      "description": "Describa qué cambia y por qué.",
      "visibleTargets": [
        "pA",
        "pB",
        "pC",
        "pD",
        "polygonABC",
        "segAB",
        "segBC",
        "segAC",
        "rayBC",
        "nonReflexAngleBAC",
        "nonReflexAngleACD",
        "nonReflexAnglemidACCF"
      ],
      "durationMs": 1800,
      "objectStates": {
        "pA": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "pB": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "pC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "pD": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "pF": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "polygonABC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "segAB": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "segBC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "segAC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "rayBC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAngleABC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAngleBAC": {
          "visible": true,
          "emphasis": "secondary",
          "interactive": true
        },
        "nonReflexAngleBCA": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAngleBCD": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "midAC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "segBmidAC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "rayBmidAC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "segmidACF": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "segCF": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "polygonABmidAC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "polygonCFmidAC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAngleAmidACB": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAngleCmidACF": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAnglemidACCF": {
          "visible": true,
          "emphasis": "secondary",
          "interactive": true
        },
        "rayCF": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "nonReflexAngleACD": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "segAmidAC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "segmidACC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "congruenceMarkAmidAC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "congruenceMarkmidACC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "congruenceMarkBmidAC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "congruenceMarkmidACF": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "rayCF_2": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "midG": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "segAG": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "congruenceMarkmidBCG": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "congruenceMarkAmidBC": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "pH": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        },
        "segBmidAC_2": {
          "visible": false,
          "emphasis": "none",
          "interactive": true
        }
      }
    }
  ],
  "note": "Arrastra A, B y C"
}
);
/* @matematika-diagram-spec:end */

export const DemoAnguloExterno = () => <DiagramRenderer spec={DemoAnguloExternoSpec} />;
