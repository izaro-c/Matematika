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
  "groups": [],
  "objects": [
    {
      "id": "pA",
      "label": "A",
      "color": "terracota",
      "layerId": "geometry",
      "order": 0,
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
        "x": -5.91,
        "y": -3.64
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
      "color": "terracota",
      "layerId": "geometry",
      "order": 1000,
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
        "x": -0.96,
        "y": -1.38
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
      "color": "terracota",
      "layerId": "geometry",
      "order": 2000,
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
        "x": -1.86,
        "y": 1.58
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
      "color": "terracota",
      "layerId": "geometry",
      "order": 3000,
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
        "x": 0.26284338143463315,
        "y": 4.017523694447297
      },
      "mobility": {
        "type": "on-support",
        "support": "rayCE"
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
      "order": 8000,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "ariaLabel": "Punto E",
        "role": "primary"
      },
      "target": true,
      "targetId": "paux",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 7.7806074282904145,
        "y": 14.005671796463204
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
      "color": "ocre",
      "layerId": "geometry",
      "order": 17000,
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
        "x": -9.287973740068153,
        "y": -0.383490321701247
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
      "id": "polygonABC",
      "label": "Polígono",
      "color": "salvia",
      "layerId": "geometry",
      "order": 4000,
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
      "label": "Segmento",
      "color": "carbon",
      "layerId": "geometry",
      "order": 5000,
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
      "label": "Segmento",
      "color": "carbon",
      "layerId": "geometry",
      "order": 6000,
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
      "label": "Segmento",
      "color": "carbon",
      "layerId": "geometry",
      "order": 7000,
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
      "id": "rayCE",
      "label": "Semirrecta",
      "color": "pavo",
      "layerId": "geometry",
      "order": 9000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Semirrecta",
        "role": "secondary"
      },
      "target": true,
      "targetId": "rayCE",
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
      "label": "Ángulo no reflejo (≤ 180°)",
      "color": "ocre",
      "layerId": "geometry",
      "order": 10000,
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
        "radius": 0.55,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "nonReflexAngleBAC",
      "label": "Ángulo no reflejo (≤ 180°)",
      "color": "ocre",
      "layerId": "geometry",
      "order": 11000,
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
        "radius": 0.55,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "nonReflexAngleBCA",
      "label": "Ángulo no reflejo (≤ 180°)",
      "color": "ocre",
      "layerId": "geometry",
      "order": 12000,
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
        "radius": 0.55,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "nonReflexAngleBCD",
      "label": "Ángulo no reflejo (≤ 180°)",
      "color": "ocre",
      "layerId": "geometry",
      "order": 13000,
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
        "radius": 0.55,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "midAC",
      "label": "E",
      "color": "terracota",
      "layerId": "geometry",
      "order": 14000,
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
      "label": "Segmento",
      "color": "carbon",
      "layerId": "geometry",
      "order": 15000,
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
      "label": "Semirrecta",
      "color": "pavo",
      "layerId": "geometry",
      "order": 16000,
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
      "label": "Segmento",
      "color": "carbon",
      "layerId": "geometry",
      "order": 18000,
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
      "label": "Segmento",
      "color": "carbon",
      "layerId": "geometry",
      "order": 19000,
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
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "polygonABmidAC",
      "label": "Polígono",
      "color": "salvia",
      "layerId": "geometry",
      "order": 20000,
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
      "label": "Polígono",
      "color": "salvia",
      "layerId": "geometry",
      "order": 21000,
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
      "label": "Ángulo no reflejo (≤ 180°)",
      "color": "ocre",
      "layerId": "geometry",
      "order": 22000,
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
        "radius": 0.55,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "nonReflexAngleCmidACF",
      "label": "Ángulo no reflejo (≤ 180°)",
      "color": "ocre",
      "layerId": "geometry",
      "order": 23000,
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
        "radius": 0.55,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "nonReflexAnglemidACCF",
      "label": "Ángulo no reflejo (≤ 180°)",
      "color": "ocre",
      "layerId": "geometry",
      "order": 24000,
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
        "radius": 0.55,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "rayCF",
      "label": "Semirrecta",
      "color": "pavo",
      "layerId": "geometry",
      "order": 25000,
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
      "label": "Ángulo no reflejo (≤ 180°)",
      "color": "ocre",
      "layerId": "geometry",
      "order": 26000,
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
        "radius": 0.55,
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
          "pA"
        ],
        [
          "paux",
          "pC"
        ]
      ]
    },
    {
      "id": "constraint3",
      "label": "Sobre un objeto",
      "enabled": true,
      "type": "on-support",
      "point": "pF",
      "support": "rayBmidAC"
    }
  ],
  "steps": [],
  "note": "Añada puntos y construcciones para reconstruir visualmente el diagrama."
}
);
/* @matematika-diagram-spec:end */

export const DemoAnguloExterno = () => <DiagramRenderer spec={DemoAnguloExternoSpec} />;
