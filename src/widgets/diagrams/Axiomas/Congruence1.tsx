import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const Congruence1Spec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Axioma de Congruencia I",
  "componentId": "axioma-de-congruencia-i",
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
      "order": 9000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": false,
        "ariaLabel": "Punto A",
        "role": "primary"
      },
      "target": true,
      "targetId": "pA",
      "style": {
        "pointSize": 7
      },
      "x": -4.71,
      "y": 4.85,
      "fixed": false,
      "constraint": "free"
    },
    {
      "id": "pB",
      "label": "B",
      "color": "ocre",
      "layerId": "geometry",
      "order": 10000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": false,
        "ariaLabel": "Punto B",
        "role": "primary"
      },
      "target": true,
      "targetId": "pB",
      "style": {
        "pointSize": 7
      },
      "x": -0.74,
      "y": 4.27,
      "fixed": false,
      "constraint": "free"
    },
    {
      "id": "pC",
      "label": "C",
      "color": "terracota",
      "layerId": "geometry",
      "order": 11000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": false,
        "ariaLabel": "Punto C",
        "role": "primary"
      },
      "target": true,
      "targetId": "pC",
      "style": {
        "pointSize": 7
      },
      "x": -1.43,
      "y": -0.66,
      "fixed": false,
      "constraint": "free"
    },
    {
      "id": "pD",
      "label": "D",
      "color": "terracota",
      "layerId": "geometry",
      "order": 4000,
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
      "x": 2.143596509479922,
      "y": 1.1639265301631294,
      "fixed": false,
      "constraint": "constrained",
      "constraintIds": [
        "onpD",
        "equalLengthsegCD"
      ]
    },
    {
      "id": "pDir",
      "label": "dir",
      "color": "terracota",
      "layerId": "geometry",
      "order": 7000,
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
      "x": 6.27,
      "y": 3.27,
      "fixed": false,
      "constraint": "free"
    }
  ],
  "elements": [
    {
      "id": "segAB",
      "label": "Segmento",
      "color": "ocre",
      "layerId": "geometry",
      "order": 2000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": false,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segAB",
      "style": {
        "strokeWidth": 4
      },
      "kind": "segment",
      "refs": [
        "pA",
        "pB"
      ]
    },
    {
      "id": "segCD",
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
      "targetId": "segCD",
      "kind": "segment",
      "refs": [
        "pC",
        "pD"
      ]
    },
    {
      "id": "circleCD",
      "label": "Circunferencia",
      "color": "carbon",
      "layerId": "geometry",
      "order": 6000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Circunferencia",
        "role": "secondary"
      },
      "target": true,
      "targetId": "circleCD",
      "kind": "circle",
      "refs": [
        "pC",
        "pD"
      ],
      "dashed": true
    },
    {
      "id": "rayCDir",
      "label": "Semirrecta",
      "color": "pavo",
      "layerId": "geometry",
      "order": 8000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Semirrecta",
        "role": "secondary"
      },
      "target": true,
      "targetId": "rayCDir",
      "kind": "ray",
      "refs": [
        "pC",
        "pDir"
      ],
      "dashed": true
    }
  ],
  "sliders": [],
  "steps": [],
  "constraints": [
    {
      "id": "onpD",
      "label": "D sobre rayCDir",
      "kind": "on",
      "refs": [
        "pD",
        "rayCDir"
      ],
      "enabled": true
    },
    {
      "id": "equalLengthsegCD",
      "label": "Segmento tiene la misma longitud que Segmento",
      "kind": "equalLength",
      "refs": [
        "pD",
        "pC",
        "segAB"
      ],
      "enabled": true
    }
  ],
  "dependencies": [
    {
      "sourceId": "pA",
      "targetId": "segAB",
      "relation": "construction"
    },
    {
      "sourceId": "pB",
      "targetId": "segAB",
      "relation": "construction"
    },
    {
      "sourceId": "pC",
      "targetId": "segCD",
      "relation": "construction"
    },
    {
      "sourceId": "pD",
      "targetId": "segCD",
      "relation": "construction"
    },
    {
      "sourceId": "pC",
      "targetId": "circleCD",
      "relation": "construction"
    },
    {
      "sourceId": "pD",
      "targetId": "circleCD",
      "relation": "construction"
    },
    {
      "sourceId": "pC",
      "targetId": "rayCDir",
      "relation": "construction"
    },
    {
      "sourceId": "pDir",
      "targetId": "rayCDir",
      "relation": "construction"
    },
    {
      "sourceId": "rayCDir",
      "targetId": "pD",
      "relation": "constraint",
      "constraintId": "onpD"
    },
    {
      "sourceId": "pC",
      "targetId": "pD",
      "relation": "constraint",
      "constraintId": "equalLengthsegCD"
    },
    {
      "sourceId": "segAB",
      "targetId": "pD",
      "relation": "constraint",
      "constraintId": "equalLengthsegCD"
    }
  ],
  "note": "Arrastra A y B",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const Congruence1 = () => <DiagramRenderer spec={Congruence1Spec} />;
