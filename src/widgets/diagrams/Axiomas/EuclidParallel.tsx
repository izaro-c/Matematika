import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const EuclidParallelSpec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Axioma de las Paralelas de Euclides",
  "componentId": "axioma-de-las-paralelas-de-euclides",
  "category": "Teoremas",
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
  "points": [
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
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -0.18,
      "y": -1.76,
      "fixed": false,
      "constraint": "free"
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
      "x": -7.57,
      "y": 2.57,
      "fixed": false,
      "constraint": "free"
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
      "x": 7.95,
      "y": 1.79,
      "fixed": false,
      "constraint": "free"
    }
  ],
  "elements": [
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
      "style": {
        "preserveColorOnHighlight": true
      },
      "kind": "line",
      "refs": [
        "pB",
        "pC"
      ]
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
      "style": {
        "preserveColorOnHighlight": true
      },
      "kind": "parallel",
      "refs": [
        "pB",
        "pC",
        "pP"
      ]
    }
  ],
  "sliders": [],
  "steps": [],
  "constraints": [],
  "dependencies": [
    {
      "sourceId": "pB",
      "targetId": "lineBC",
      "relation": "construction"
    },
    {
      "sourceId": "pC",
      "targetId": "lineBC",
      "relation": "construction"
    },
    {
      "sourceId": "pB",
      "targetId": "parBCP",
      "relation": "construction"
    },
    {
      "sourceId": "pC",
      "targetId": "parBCP",
      "relation": "construction"
    },
    {
      "sourceId": "pP",
      "targetId": "parBCP",
      "relation": "construction"
    }
  ],
  "note": "Arrastra el punto P",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const EuclidParallel = () => <DiagramRenderer spec={EuclidParallelSpec} />;
