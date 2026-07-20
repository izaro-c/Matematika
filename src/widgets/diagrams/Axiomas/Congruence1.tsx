import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const Congruence1Spec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Axioma de Congruencia I",
  "componentId": "axioma-de-congruencia-i",
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
  "groups": [
    {
      "id": "group1",
      "label": "AB",
      "memberIds": [
        "pA",
        "pB",
        "segAB"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "highlightable": true,
        "role": "secondary"
      },
      "target": true,
      "targetId": "AB"
    },
    {
      "id": "group2",
      "label": "CD",
      "memberIds": [
        "pC",
        "pD",
        "segCD"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": true,
      "targetId": "CD"
    },
    {
      "id": "group3",
      "label": "r",
      "memberIds": [
        "pC",
        "pDir",
        "rayCDir"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": true,
      "targetId": "r"
    }
  ],
  "points": [
    {
      "id": "pA",
      "label": "A",
      "color": "ocre",
      "layerId": "geometry",
      "order": 9000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1"
      ],
      "selection": {
        "selectable": true,
        "highlightable": true,
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
      "x": -3.64,
      "y": 3.04,
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
      "groupIds": [
        "group1"
      ],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "ariaLabel": "Punto B",
        "role": "primary"
      },
      "target": true,
      "targetId": "pB",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10
      },
      "x": 0.03,
      "y": 4.36,
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
      "groupIds": [
        "group2",
        "group3"
      ],
      "selection": {
        "selectable": true,
        "highlightable": true,
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
      "x": -1.2,
      "y": -1.26,
      "fixed": false,
      "constraint": "free"
    },
    {
      "id": "pD",
      "label": "D",
      "color": "terracota",
      "layerId": "geometry",
      "order": 12000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group2"
      ],
      "selection": {
        "selectable": true,
        "highlightable": false,
        "ariaLabel": "Punto D",
        "role": "primary"
      },
      "target": true,
      "targetId": "pD",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 2.582735168797865,
      "y": -0.31015019990538195,
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
      "color": "pavo",
      "layerId": "geometry",
      "order": 7000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto E",
        "role": "primary"
      },
      "target": true,
      "targetId": "pE",
      "style": {
        "highlightPointSize": 6,
        "preserveColorOnHighlight": true
      },
      "x": 5.61,
      "y": 0.45,
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
      "groupIds": [
        "group1"
      ],
      "selection": {
        "selectable": true,
        "highlightable": false,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segAB",
      "style": {
        "strokeWidth": 4,
        "highlightStrokeWidth": 6,
        "preserveColorOnHighlight": true
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
      "color": "terracota",
      "layerId": "geometry",
      "order": 5000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group2"
      ],
      "selection": {
        "selectable": true,
        "highlightable": false,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segCD",
      "style": {
        "strokeWidth": 4,
        "highlightStrokeWidth": 6,
        "preserveColorOnHighlight": true
      },
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
        "selectable": false,
        "highlightable": false,
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
      "order": -1000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group3"
      ],
      "selection": {
        "selectable": false,
        "highlightable": false,
        "ariaLabel": "Semirrecta",
        "role": "secondary"
      },
      "target": true,
      "targetId": "rayCDir",
      "style": {
        "preserveColorOnHighlight": true
      },
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
