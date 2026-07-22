import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const EuclidParallelSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Axioma de las Paralelas de Euclides",
  "componentId": "axioma-de-las-paralelas-de-euclides",
  "category": "Axiomas",
  "mode": "simulation",
  "axis": false,
  "grid": false,
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
      "id": "pP",
      "label": "P",
      "color": "ocre",
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
        "x": -0.18,
        "y": -1.76
      },
      "mobility": {
        "type": "free"
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
      "color": "terracota",
      "layerId": "geometry",
      "order": 1000,
      "visible": false,
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
        "x": -7.57,
        "y": 2.57
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {},
      "interaction": {}
    },
    {
      "id": "pC",
      "label": "C",
      "color": "terracota",
      "layerId": "geometry",
      "order": 2000,
      "visible": false,
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
        "x": 7.95,
        "y": 1.79
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {},
      "interaction": {}
    },
    {
      "id": "lineBC",
      "label": "Recta",
      "color": "carbon",
      "layerId": "geometry",
      "order": 3000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta",
        "role": "secondary"
      },
      "target": true,
      "targetId": "lineBC",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "through-points",
          "points": [
            "pB",
            "pC"
          ]
        }
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "parBCP",
      "label": "Paralela",
      "color": "ocre",
      "layerId": "geometry",
      "order": 4000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Paralela",
        "role": "secondary"
      },
      "target": true,
      "targetId": "parBCP",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "parallel",
          "linePoints": [
            "pB",
            "pC"
          ],
          "through": "pP"
        }
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [],
  "steps": [],
  "note": "Arrastra el punto P"
}
);
/* @matematika-diagram-spec:end */

export const EuclidParallel = () => <DiagramRenderer spec={EuclidParallelSpec} />;
