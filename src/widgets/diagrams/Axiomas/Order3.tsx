import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const Order3Spec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Axioma de Orden III",
  "componentId": "axioma-de-orden-iii",
  "category": "Axiomas",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "viewport": {
    "bounds": [
      -2.048,
      2.048,
      2.048,
      -2.048
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
    },
    {
      "id": "layer3",
      "label": "Oculto",
      "order": 2,
      "visible": false,
      "locked": false
    }
  ],
  "groups": [],
  "objects": [
    {
      "id": "pA",
      "label": "A",
      "color": "ocre",
      "layerId": "geometry",
      "order": 6000,
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
        "x": -1.5,
        "y": 0
      },
      "mobility": {
        "type": "on-support",
        "support": "lineDE"
      },
      "appearance": {
        "size": 7,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pB",
      "label": "B",
      "color": "ocre",
      "layerId": "geometry",
      "order": 7000,
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
        "x": 0.57,
        "y": 0
      },
      "mobility": {
        "type": "on-support",
        "support": "lineDE"
      },
      "appearance": {
        "size": 7,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pC",
      "label": "C",
      "color": "ocre",
      "layerId": "geometry",
      "order": 8000,
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
        "x": 2.5,
        "y": 0
      },
      "mobility": {
        "type": "on-support",
        "support": "lineDE"
      },
      "appearance": {
        "size": 7,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pD",
      "label": "l",
      "color": "carbon",
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
        "x": 0,
        "y": 0
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 0,
        "highlightSize": 0,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pE",
      "label": "E",
      "color": "terracota",
      "layerId": "layer3",
      "order": 4000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto E",
        "role": "primary"
      },
      "target": true,
      "targetId": "pE",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 1.5,
        "y": 0
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {},
      "interaction": {}
    },
    {
      "id": "lineDE",
      "label": "Recta",
      "color": "carbon",
      "layerId": "geometry",
      "order": 5000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta",
        "role": "secondary"
      },
      "target": true,
      "targetId": "lineDE",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "through-points",
          "points": [
            "pD",
            "pE"
          ]
        }
      },
      "appearance": {
        "strokeWidth": 2,
        "highlightStrokeWidth": 2,
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [],
  "steps": [],
  "note": "Arrastra A, B y C"
}
);
/* @matematika-diagram-spec:end */

export const Order3 = () => <DiagramRenderer spec={Order3Spec} />;
