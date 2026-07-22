import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const BisectrizSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Bisectriz",
  "componentId": "angulo",
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
      "order": 7000,
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
        "x": 0.61,
        "y": 2.04
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
        "attractorIds": [
          "lineBO",
          "perpB4O"
        ]
      }
    },
    {
      "id": "pB",
      "label": "B",
      "color": "terracota",
      "layerId": "geometry",
      "order": 8000,
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
        "x": 2,
        "y": 0
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
      "id": "pO",
      "label": "O",
      "color": "carbon",
      "layerId": "geometry",
      "order": 9000,
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
      "id": "p4",
      "label": "4",
      "color": "ocre",
      "layerId": "geometry",
      "order": -1000,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto 4",
        "role": "primary"
      },
      "target": false,
      "targetId": "p4",
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
        "size": 0,
        "labelVisible": false,
        "highlightSize": 0,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "p4_copy",
      "label": "4 (copia)",
      "color": "ocre",
      "layerId": "geometry",
      "order": -999,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto 4",
        "role": "primary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0.5,
        "y": -0.5
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "highlightSize": 0,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "p6",
      "label": "6",
      "color": "ocre",
      "layerId": "geometry",
      "order": 13000,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto 6",
        "role": "primary"
      },
      "target": true,
      "targetId": "p6",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 1.9792905393397042,
        "y": 1.470954637714144
      },
      "mobility": {
        "type": "on-support",
        "support": "bisAOB"
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
      "id": "rayOA",
      "label": "Semirrecta",
      "color": "pavo",
      "layerId": "geometry",
      "order": 3000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Semirrecta",
        "role": "secondary"
      },
      "target": true,
      "targetId": "rayOA",
      "objectType": "path",
      "geometry": {
        "type": "ray",
        "points": [
          "pO",
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
      "id": "rayOB",
      "label": "Semirrecta",
      "color": "pavo",
      "layerId": "geometry",
      "order": 4000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Semirrecta",
        "role": "secondary"
      },
      "target": true,
      "targetId": "rayOB",
      "objectType": "path",
      "geometry": {
        "type": "ray",
        "points": [
          "pO",
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
      "id": "lineBO",
      "label": "Recta",
      "color": "pavo",
      "layerId": "geometry",
      "order": 10000,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta",
        "role": "secondary"
      },
      "target": false,
      "targetId": "lineBO",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "through-points",
          "points": [
            "pB",
            "pO"
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
      "id": "perpB4O",
      "label": "Perpendicular",
      "color": "pavo",
      "layerId": "geometry",
      "order": 12000,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Perpendicular",
        "role": "secondary"
      },
      "target": true,
      "targetId": "perpB4O",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "perpendicular",
          "linePoints": [
            "pB",
            "p4"
          ],
          "through": "pO"
        }
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "bisAOB",
      "label": "Bisectriz de AOB",
      "color": "pavo",
      "layerId": "geometry",
      "order": 1000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Bisectriz de AOB",
        "role": "secondary"
      },
      "target": true,
      "targetId": "bisAOB",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "angle-bisector",
          "points": [
            "pA",
            "pO",
            "pB"
          ]
        }
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "nonReflexAngleBO6",
      "label": "$\\alpha$",
      "color": "musgo",
      "layerId": "geometry",
      "order": 14000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "nonReflexAngleBO6",
      "objectType": "angle",
      "points": [
        "pB",
        "pO",
        "p6"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 1,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "nonReflexAngle6OA",
      "label": "$\\alpha$",
      "color": "musgo",
      "layerId": "geometry",
      "order": 15000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "nonReflexAngle6OA",
      "objectType": "angle",
      "points": [
        "p6",
        "pO",
        "pA"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 1,
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [],
  "steps": [],
  "note": "Mueve A y B"
}
);
/* @matematika-diagram-spec:end */

export const Bisectriz = () => <DiagramRenderer spec={BisectrizSpec} />;
