import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const Incidence4Spec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Axioma de Incidencia IV",
  "componentId": "incidence4",
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
      "id": "pA",
      "label": "A",
      "color": "ocre",
      "layerId": "geometry",
      "order": 2000,
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
      "x": -0.73,
      "y": 4.05,
      "fixed": false,
      "constraint": "free"
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
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 2.27,
      "y": 0.04,
      "fixed": false,
      "constraint": "free"
    },
    {
      "id": "pC",
      "label": "C",
      "color": "ocre",
      "layerId": "geometry",
      "order": 4000,
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
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -4.13,
      "y": -1.4,
      "fixed": false,
      "constraint": "free"
    }
  ],
  "elements": [
    {
      "id": "polyTriangulo",
      "label": "Triángulo",
      "color": "salvia",
      "layerId": "geometry",
      "order": 1000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo",
        "role": "secondary"
      },
      "target": true,
      "targetId": "polyTriangulo",
      "kind": "polygon",
      "refs": [
        "pA",
        "pB",
        "pC"
      ]
    },
    {
      "id": "segAB",
      "label": "Lado AB",
      "color": "carbon",
      "layerId": "geometry",
      "order": 1000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado AB",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segAB",
      "kind": "segment",
      "refs": [
        "pA",
        "pB"
      ]
    },
    {
      "id": "segBC",
      "label": "Lado BC",
      "color": "carbon",
      "layerId": "geometry",
      "order": 1000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado BC",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segBC",
      "kind": "segment",
      "refs": [
        "pB",
        "pC"
      ]
    },
    {
      "id": "segCA",
      "label": "Lado CA",
      "color": "carbon",
      "layerId": "geometry",
      "order": 1000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado CA",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segCA",
      "kind": "segment",
      "refs": [
        "pC",
        "pA"
      ]
    },
    {
      "id": "lineAB",
      "label": "Recta",
      "color": "carbon",
      "layerId": "geometry",
      "order": -1000,
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
      "style": {
        "highlightStrokeWidth": 2.4,
        "preserveColorOnHighlight": true
      },
      "kind": "line",
      "refs": [
        "pA",
        "pB"
      ],
      "dashed": true
    },
    {
      "id": "lineAC",
      "label": "Recta",
      "color": "carbon",
      "layerId": "geometry",
      "order": -2000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta",
        "role": "secondary"
      },
      "target": true,
      "targetId": "lineAC",
      "style": {
        "highlightStrokeWidth": 2.4,
        "preserveColorOnHighlight": true
      },
      "kind": "line",
      "refs": [
        "pA",
        "pC"
      ],
      "dashed": true
    },
    {
      "id": "lineCB",
      "label": "Recta",
      "color": "carbon",
      "layerId": "geometry",
      "order": -3000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta",
        "role": "secondary"
      },
      "target": true,
      "targetId": "lineCB",
      "style": {
        "highlightStrokeWidth": 2.4,
        "preserveColorOnHighlight": true
      },
      "kind": "line",
      "refs": [
        "pC",
        "pB"
      ],
      "dashed": true
    }
  ],
  "sliders": [],
  "steps": [],
  "constraints": [],
  "dependencies": [
    {
      "sourceId": "pA",
      "targetId": "lineAB",
      "relation": "construction"
    },
    {
      "sourceId": "pB",
      "targetId": "lineAB",
      "relation": "construction"
    },
    {
      "sourceId": "pA",
      "targetId": "lineAC",
      "relation": "construction"
    },
    {
      "sourceId": "pC",
      "targetId": "lineAC",
      "relation": "construction"
    },
    {
      "sourceId": "pC",
      "targetId": "lineCB",
      "relation": "construction"
    },
    {
      "sourceId": "pB",
      "targetId": "lineCB",
      "relation": "construction"
    }
  ],
  "note": "Arrastra A, B y C",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const Incidence4 = () => <DiagramRenderer spec={Incidence4Spec} />;
