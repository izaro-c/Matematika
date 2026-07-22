import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const AlturaSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Altura",
  "componentId": "altura",
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
        "x": -3.6,
        "y": -2.44
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
      "order": 6000,
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
        "x": 3.06,
        "y": -1.5
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
        "x": -1.1,
        "y": 3.64
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
      "id": "polygonABC",
      "label": "Polígono",
      "color": "musgo",
      "layerId": "geometry",
      "order": 3000,
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
        "strokeWidth": 3,
        "highlightStrokeWidth": 5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "footCAB",
      "label": "$H_c$",
      "color": "ocre",
      "layerId": "geometry",
      "order": 4000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Pie de altura CAB",
        "role": "secondary"
      },
      "target": true,
      "targetId": "footCAB",
      "objectType": "point",
      "definition": {
        "type": "projection",
        "point": "pC",
        "support": {
          "points": [
            "pA",
            "pB"
          ]
        }
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "extAlturaCAB",
      "label": "Extensión de base AB",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 1000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Extensión de base AB",
        "role": "secondary"
      },
      "target": true,
      "targetId": "extAlturaCAB",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pA",
          "pB"
        ],
        "construction": {
          "type": "base-extension",
          "foot": "footCAB"
        }
      },
      "appearance": {
        "dashed": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segAlturaCAB",
      "label": "Altura desde C a AB",
      "color": "ocre",
      "layerId": "geometry",
      "order": 5000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Altura desde C a AB",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segAlturaCAB",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pC",
          "footCAB"
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
      "id": "rightAngleAlturaCAB",
      "label": "Ángulo recto de la altura",
      "color": "ocre",
      "layerId": "geometry",
      "order": 1000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo recto de la altura",
        "role": "secondary"
      },
      "target": true,
      "targetId": "rightAngleAlturaCAB",
      "objectType": "angle",
      "points": [
        "pA",
        "footCAB",
        "pC"
      ],
      "sweep": "non-reflex",
      "marker": "square",
      "perpendicularRelationId": "rightAngleAlturaCAB-perpendicular",
      "appearance": {
        "radius": 0.45,
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [
    {
      "id": "rightAngleAlturaCAB-perpendicular",
      "label": "Perpendicularidad de Ángulo recto de la altura",
      "enabled": true,
      "type": "perpendicular",
      "supports": [
        [
          "footCAB",
          "pA"
        ],
        [
          "footCAB",
          "pC"
        ]
      ]
    }
  ],
  "steps": [],
  "note": "Arrastra A, B y C"
}
);
/* @matematika-diagram-spec:end */

export const Altura = () => <DiagramRenderer spec={AlturaSpec} />;
