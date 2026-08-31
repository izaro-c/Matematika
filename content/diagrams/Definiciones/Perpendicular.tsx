import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const PerpendicularSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Perpendicular",
  "componentId": "perpendicular",
  "category": "Definiciones",
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
        "x": -3,
        "y": -1
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
        "x": 3,
        "y": 1
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
      "id": "pP",
      "label": "P",
      "color": "musgo",
      "layerId": "geometry",
      "order": 3000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto P",
        "role": "primary"
      },
      "target": true,
      "targetId": "pP",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0,
        "y": 0
      },
      "mobility": {
        "type": "on-support",
        "support": "lineAB"
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
      "color": "musgo",
      "layerId": "geometry",
      "order": 5000,
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
        "x": -1,
        "y": 3
      },
      "mobility": {
        "type": "on-support",
        "support": "perpABP"
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
      "color": "musgo",
      "layerId": "geometry",
      "order": 6000,
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
        "x": 1,
        "y": -3
      },
      "mobility": {
        "type": "on-support",
        "support": "perpABP"
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
      "id": "lineAB",
      "label": "Recta ℓ₁",
      "color": "terracota",
      "layerId": "geometry",
      "order": 2000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta l1",
        "role": "secondary"
      },
      "target": true,
      "targetId": "lineAB",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "through-points",
          "points": [
            "pA",
            "pB"
          ]
        }
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 1.6,
        "highlightStrokeWidth": 2.4,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "perpABP",
      "label": "Recta ℓ₂",
      "color": "musgo",
      "layerId": "geometry",
      "order": 4000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta perpendicular l2",
        "role": "secondary"
      },
      "target": true,
      "targetId": "perpABP",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "perpendicular",
          "linePoints": [
            "pA",
            "pB"
          ],
          "through": "pP"
        }
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 1.6,
        "highlightStrokeWidth": 2.4,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "rayPA",
      "label": "Semirrecta h₁",
      "color": "terracota",
      "layerId": "geometry",
      "order": 6100,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Semirrecta h1 (PA)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "rayPA",
      "objectType": "path",
      "geometry": {
        "type": "ray",
        "points": [
          "pP",
          "pA"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "rayPB",
      "label": "Semirrecta h₁'",
      "color": "terracota",
      "layerId": "geometry",
      "order": 6200,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Semirrecta h1' (PB)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "rayPB",
      "objectType": "path",
      "geometry": {
        "type": "ray",
        "points": [
          "pP",
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
      "id": "rayPC",
      "label": "Semirrecta h₂",
      "color": "musgo",
      "layerId": "geometry",
      "order": 6300,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Semirrecta h2 (PC)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "rayPC",
      "objectType": "path",
      "geometry": {
        "type": "ray",
        "points": [
          "pP",
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
      "id": "rayPD",
      "label": "Semirrecta h₂'",
      "color": "musgo",
      "layerId": "geometry",
      "order": 6400,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Semirrecta h2' (PD)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "rayPD",
      "objectType": "path",
      "geometry": {
        "type": "ray",
        "points": [
          "pP",
          "pD"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "angleAPC",
      "label": "Ángulo recto APC",
      "color": "ocre",
      "layerId": "geometry",
      "order": 7000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo recto APC",
        "role": "secondary"
      },
      "target": true,
      "targetId": "angleAPC",
      "objectType": "angle",
      "points": [
        "pA",
        "pP",
        "pC"
      ],
      "sweep": "non-reflex",
      "marker": "square",
      "perpendicularRelationId": "angleAPC-perpendicular",
      "appearance": {
        "radius": 0.8,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "angleBPC",
      "label": "Ángulo recto BPC",
      "color": "ocre",
      "layerId": "geometry",
      "order": 8000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo recto BPC",
        "role": "secondary"
      },
      "target": true,
      "targetId": "angleBPC",
      "objectType": "angle",
      "points": [
        "pB",
        "pP",
        "pC"
      ],
      "sweep": "non-reflex",
      "marker": "square",
      "perpendicularRelationId": "angleBPC-perpendicular",
      "appearance": {
        "radius": 0.8,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "angleBPD",
      "label": "Ángulo recto BPD",
      "color": "ocre",
      "layerId": "geometry",
      "order": 9000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo recto BPD",
        "role": "secondary"
      },
      "target": true,
      "targetId": "angleBPD",
      "objectType": "angle",
      "points": [
        "pB",
        "pP",
        "pD"
      ],
      "sweep": "non-reflex",
      "marker": "square",
      "perpendicularRelationId": "angleBPD-perpendicular",
      "appearance": {
        "radius": 0.8,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "angleAPD",
      "label": "Ángulo recto APD",
      "color": "ocre",
      "layerId": "geometry",
      "order": 10000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo recto APD",
        "role": "secondary"
      },
      "target": true,
      "targetId": "angleAPD",
      "objectType": "angle",
      "points": [
        "pA",
        "pP",
        "pD"
      ],
      "sweep": "non-reflex",
      "marker": "square",
      "perpendicularRelationId": "angleAPD-perpendicular",
      "appearance": {
        "radius": 0.8,
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [
    {
      "id": "angleAPC-perpendicular",
      "label": "Perpendicularidad de Ángulo recto APC",
      "enabled": true,
      "type": "perpendicular",
      "supports": [
        [
          "pP",
          "pA"
        ],
        [
          "pP",
          "pC"
        ]
      ]
    },
    {
      "id": "angleBPC-perpendicular",
      "label": "Perpendicularidad de Ángulo recto BPC",
      "enabled": true,
      "type": "perpendicular",
      "supports": [
        [
          "pP",
          "pB"
        ],
        [
          "pP",
          "pC"
        ]
      ]
    },
    {
      "id": "angleBPD-perpendicular",
      "label": "Perpendicularidad de Ángulo recto BPD",
      "enabled": true,
      "type": "perpendicular",
      "supports": [
        [
          "pP",
          "pB"
        ],
        [
          "pP",
          "pD"
        ]
      ]
    },
    {
      "id": "angleAPD-perpendicular",
      "label": "Perpendicularidad de Ángulo recto APD",
      "enabled": true,
      "type": "perpendicular",
      "supports": [
        [
          "pP",
          "pA"
        ],
        [
          "pP",
          "pD"
        ]
      ]
    }
  ],
  "steps": [],
  "note": "Arrastra A, B, C, D o P"
}
);
/* @matematika-diagram-spec:end */

export const Perpendicular = () => <DiagramRenderer spec={PerpendicularSpec} />;
