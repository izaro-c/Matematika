import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const Congruence2Spec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Axioma de Congruencia II",
  "componentId": "axioma-de-congruencia-ii",
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
  "groups": [
    {
      "id": "group1",
      "label": "ABCD",
      "memberIds": [
        "pA",
        "pB",
        "pC",
        "segAB",
        "segCD",
        "tickssegCD",
        "tickssegAB",
        "pD"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": true,
      "targetId": "ABCD"
    },
    {
      "id": "group2",
      "label": "ABEF",
      "memberIds": [
        "pA",
        "pB",
        "pE",
        "pF",
        "segAB",
        "segEF",
        "tickssegEF",
        "tickssegAB"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": true,
      "targetId": "ABEF"
    },
    {
      "id": "group3",
      "label": "CDEF",
      "memberIds": [
        "pC",
        "pE",
        "segCD",
        "segEF",
        "tickssegCD",
        "tickssegEF",
        "pD",
        "pF"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": true,
      "targetId": "CDEF"
    }
  ],
  "points": [
    {
      "id": "pA",
      "label": "A",
      "color": "ocre",
      "layerId": "geometry",
      "order": 14000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group2"
      ],
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
      "x": -2,
      "y": 2,
      "fixed": false,
      "constraint": "free"
    },
    {
      "id": "pB",
      "label": "B",
      "color": "ocre",
      "layerId": "geometry",
      "order": 15000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group2"
      ],
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
      "x": 2,
      "y": 2,
      "fixed": false,
      "constraint": "free"
    },
    {
      "id": "pC",
      "label": "C",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 13000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group3"
      ],
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
      "x": -2,
      "y": 0,
      "fixed": false,
      "constraint": "free"
    },
    {
      "id": "pD",
      "label": "D",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 16000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group3"
      ],
      "selection": {
        "selectable": true,
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
      "x": 2,
      "y": 0,
      "fixed": false,
      "constraint": "constrained",
      "constraintIds": [
        "equalLengthsegCD"
      ]
    },
    {
      "id": "pE",
      "label": "E",
      "color": "terracota",
      "layerId": "geometry",
      "order": 17000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group2",
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
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -2,
      "y": -2,
      "fixed": false,
      "constraint": "free"
    },
    {
      "id": "pF",
      "label": "F",
      "color": "terracota",
      "layerId": "geometry",
      "order": 18000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group2",
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto F",
        "role": "primary"
      },
      "target": true,
      "targetId": "pF",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 2,
      "y": -2,
      "fixed": false,
      "constraint": "constrained",
      "constraintIds": [
        "equalLengthsegEF"
      ]
    }
  ],
  "elements": [
    {
      "id": "segAB",
      "label": "Segmento",
      "color": "ocre",
      "layerId": "geometry",
      "order": 6000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group2"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segAB",
      "style": {
        "strokeWidth": 3,
        "highlightStrokeWidth": 5,
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
      "color": "pizarra",
      "layerId": "geometry",
      "order": 7000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segCD",
      "style": {
        "strokeWidth": 3,
        "highlightStrokeWidth": 5,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "pC",
        "pD"
      ]
    },
    {
      "id": "segEF",
      "label": "Segmento",
      "color": "terracota",
      "layerId": "geometry",
      "order": 8000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group2",
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segEF",
      "style": {
        "strokeWidth": 3,
        "highlightStrokeWidth": 5,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "pE",
        "pF"
      ]
    },
    {
      "id": "tickssegCD",
      "label": "Marcas de medida de Segmento",
      "color": "carbon",
      "layerId": "geometry",
      "order": -4000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group3"
      ],
      "selection": {
        "selectable": false,
        "ariaLabel": "Marcas de medida de Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "tickssegCD",
      "style": {
        "strokeWidth": 2,
        "markHeight": 15,
        "highlightStrokeWidth": 2.5,
        "preserveColorOnHighlight": true
      },
      "kind": "measureTicks",
      "refs": [
        "segCD"
      ],
      "properties": {
        "tickDistance": 1
      }
    },
    {
      "id": "tickssegEF",
      "label": "Marcas de medida de Segmento",
      "color": "carbon",
      "layerId": "geometry",
      "order": -3000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group2",
        "group3"
      ],
      "selection": {
        "selectable": false,
        "ariaLabel": "Marcas de medida de Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "tickssegEF",
      "style": {
        "strokeWidth": 2,
        "markHeight": 15,
        "highlightStrokeWidth": 2.5,
        "preserveColorOnHighlight": true
      },
      "kind": "measureTicks",
      "refs": [
        "segEF"
      ],
      "dashed": false,
      "properties": {
        "tickDistance": 1
      }
    },
    {
      "id": "tickssegAB",
      "label": "Marcas de medida de Segmento",
      "color": "carbon",
      "layerId": "geometry",
      "order": -2000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group2"
      ],
      "selection": {
        "selectable": false,
        "ariaLabel": "Marcas de medida de Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "tickssegAB",
      "style": {
        "strokeWidth": 2,
        "markHeight": 15,
        "highlightStrokeWidth": 2.5,
        "preserveColorOnHighlight": true
      },
      "kind": "measureTicks",
      "refs": [
        "segAB"
      ],
      "properties": {
        "tickDistance": 1
      }
    }
  ],
  "sliders": [],
  "steps": [],
  "constraints": [
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
    },
    {
      "id": "equalLengthsegEF",
      "label": "Segmento tiene la misma longitud que Segmento",
      "kind": "equalLength",
      "refs": [
        "pF",
        "pE",
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
      "sourceId": "pE",
      "targetId": "segEF",
      "relation": "construction"
    },
    {
      "sourceId": "pF",
      "targetId": "segEF",
      "relation": "construction"
    },
    {
      "sourceId": "segCD",
      "targetId": "tickssegCD",
      "relation": "construction"
    },
    {
      "sourceId": "segEF",
      "targetId": "tickssegEF",
      "relation": "construction"
    },
    {
      "sourceId": "segAB",
      "targetId": "tickssegAB",
      "relation": "construction"
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
    },
    {
      "sourceId": "pE",
      "targetId": "pF",
      "relation": "constraint",
      "constraintId": "equalLengthsegEF"
    },
    {
      "sourceId": "segAB",
      "targetId": "pF",
      "relation": "constraint",
      "constraintId": "equalLengthsegEF"
    }
  ],
  "note": "Arrastra A, B, C, D, E y F",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const Congruence2 = () => <DiagramRenderer spec={Congruence2Spec} />;
