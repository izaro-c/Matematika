import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

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
        "x": -3.05,
        "y": -1.11
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
        "x": 3.25,
        "y": 1.14
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
        "ariaLabel": "Punto 3",
        "role": "primary"
      },
      "target": true,
      "targetId": "p3",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0.17000000000000037,
        "y": 0.040000000000000036
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
      "id": "p4",
      "label": "4",
      "color": "ocre",
      "layerId": "geometry",
      "order": 5000,
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
        "x": -31.625443586631,
        "y": -50
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
      "id": "p5",
      "label": "5",
      "color": "ocre",
      "layerId": "geometry",
      "order": 6000,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto 5",
        "role": "primary"
      },
      "target": false,
      "targetId": "p5",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0,
        "y": 50
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
      "id": "p6",
      "label": "6",
      "color": "ocre",
      "layerId": "geometry",
      "order": 11000,
      "visible": true,
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
        "x": 30,
        "y": 0.08384592179283312
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
      "id": "p7",
      "label": "7",
      "color": "ocre",
      "layerId": "geometry",
      "order": 12000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto 7",
        "role": "primary"
      },
      "target": true,
      "targetId": "p7",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -30,
        "y": 0.9323477112952232
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
      "id": "lineAB",
      "label": "Recta",
      "color": "terracota",
      "layerId": "geometry",
      "order": 2000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta",
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
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "perpABP",
      "label": "Perpendicular",
      "color": "musgo",
      "layerId": "geometry",
      "order": 4000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Perpendicular",
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
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "perpendicularMarkBP4",
      "label": "Marca de perpendicularidad",
      "color": "ocre",
      "layerId": "geometry",
      "order": 7000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de perpendicularidad",
        "role": "secondary"
      },
      "target": true,
      "targetId": "perpendicularMarkBP4",
      "objectType": "angle",
      "points": [
        "p6",
        "pP",
        "p4"
      ],
      "sweep": "non-reflex",
      "marker": "square",
      "perpendicularRelationId": "perpendicularMarkBP4-perpendicular",
      "appearance": {
        "radius": 1,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "perpendicularMarkBP5",
      "label": "Marca de perpendicularidad",
      "color": "ocre",
      "layerId": "geometry",
      "order": 8000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de perpendicularidad",
        "role": "secondary"
      },
      "target": true,
      "targetId": "perpendicularMarkBP5",
      "objectType": "angle",
      "points": [
        "p6",
        "pP",
        "p5"
      ],
      "sweep": "non-reflex",
      "marker": "square",
      "perpendicularRelationId": "perpendicularMarkBP5-perpendicular",
      "appearance": {
        "radius": 1,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "perpendicularMarkAP5",
      "label": "Marca de perpendicularidad",
      "color": "ocre",
      "layerId": "geometry",
      "order": 9000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de perpendicularidad",
        "role": "secondary"
      },
      "target": true,
      "targetId": "perpendicularMarkAP5",
      "objectType": "angle",
      "points": [
        "p7",
        "pP",
        "p5"
      ],
      "sweep": "non-reflex",
      "marker": "square",
      "perpendicularRelationId": "perpendicularMarkAP5-perpendicular",
      "appearance": {
        "radius": 1,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "perpendicularMarkAP4",
      "label": "Marca de perpendicularidad",
      "color": "ocre",
      "layerId": "geometry",
      "order": 10000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de perpendicularidad",
        "role": "secondary"
      },
      "target": true,
      "targetId": "perpendicularMarkAP4",
      "objectType": "angle",
      "points": [
        "p7",
        "pP",
        "p4"
      ],
      "sweep": "non-reflex",
      "marker": "square",
      "perpendicularRelationId": "perpendicularMarkAP4-perpendicular",
      "appearance": {
        "radius": 1,
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [
    {
      "id": "perpendicularMarkBP4-perpendicular",
      "label": "Perpendicularidad de Marca de perpendicularidad",
      "enabled": true,
      "type": "perpendicular",
      "supports": [
        [
          "pP",
          "p6"
        ],
        [
          "pP",
          "p4"
        ]
      ]
    },
    {
      "id": "perpendicularMarkBP5-perpendicular",
      "label": "Perpendicularidad de Marca de perpendicularidad",
      "enabled": true,
      "type": "perpendicular",
      "supports": [
        [
          "pP",
          "p6"
        ],
        [
          "pP",
          "p5"
        ]
      ]
    },
    {
      "id": "perpendicularMarkAP5-perpendicular",
      "label": "Perpendicularidad de Marca de perpendicularidad",
      "enabled": true,
      "type": "perpendicular",
      "supports": [
        [
          "pP",
          "p7"
        ],
        [
          "pP",
          "p5"
        ]
      ]
    },
    {
      "id": "perpendicularMarkAP4-perpendicular",
      "label": "Perpendicularidad de Marca de perpendicularidad",
      "enabled": true,
      "type": "perpendicular",
      "supports": [
        [
          "pP",
          "p7"
        ],
        [
          "pP",
          "p4"
        ]
      ]
    }
  ],
  "steps": [],
  "note": "Arrastra A, B y P"
}
);
/* @matematika-diagram-spec:end */

export const Perpendicular = () => <DiagramRenderer spec={PerpendicularSpec} />;
