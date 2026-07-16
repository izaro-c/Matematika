import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const Congruence3Spec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Axioma de Congruencia III",
  "componentId": "axioma-de-congruencia-iii",
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
        "pD",
        "pE",
        "segAB",
        "segDE",
        "congruenceMarkAB",
        "congruenceMarkDE"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": true,
      "targetId": "AB"
    },
    {
      "id": "group2",
      "label": "BC",
      "memberIds": [
        "pB",
        "pE",
        "pF",
        "pC",
        "segBC",
        "segEF",
        "congruenceMarkBC",
        "congruenceMarkEF"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": true,
      "targetId": "BC"
    },
    {
      "id": "group3",
      "label": "AC",
      "memberIds": [
        "pA",
        "pD",
        "pF",
        "pC",
        "segAC",
        "segDF",
        "congruenceMarkAC",
        "congruenceMarkDF"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": true,
      "targetId": "AC"
    }
  ],
  "points": [
    {
      "id": "pA",
      "label": "A",
      "color": "ocre",
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
        "ariaLabel": "Punto A",
        "role": "primary"
      },
      "target": false,
      "targetId": "pA",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -2,
      "y": 0.6,
      "fixed": false,
      "constraint": "free"
    },
    {
      "id": "pB",
      "label": "B",
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
      "x": 0,
      "y": 0.44789957374051603,
      "fixed": false,
      "constraint": "glider",
      "gliderTarget": "segAC"
    },
    {
      "id": "pD",
      "label": "A'",
      "color": "ocre",
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
      "x": -2,
      "y": -2.03,
      "fixed": false,
      "constraint": "free"
    },
    {
      "id": "pE",
      "label": "B'",
      "color": "ocre",
      "layerId": "geometry",
      "order": 17000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group2"
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
      "x": 0.00015774136631785396,
      "y": -1.879988169397526,
      "fixed": false,
      "constraint": "constrained",
      "constraintIds": [
        "onpE",
        "equalLengthsegDE"
      ]
    },
    {
      "id": "pF",
      "label": "C'",
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
      "y": -1.73,
      "fixed": false,
      "constraint": "constrained",
      "constraintIds": [
        "equalLengthsegDF"
      ]
    },
    {
      "id": "pC",
      "label": "C",
      "color": "terracota",
      "layerId": "geometry",
      "order": 15000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group2",
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
      "x": 2.1,
      "y": 0.4,
      "fixed": false,
      "constraint": "free"
    }
  ],
  "elements": [
    {
      "id": "segAC",
      "label": "Segmento",
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
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segAC",
      "style": {
        "strokeWidth": 0,
        "highlightStrokeWidth": 5,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "pA",
        "pC"
      ]
    },
    {
      "id": "segDF",
      "label": "Segmento",
      "color": "pavo",
      "layerId": "geometry",
      "order": 8000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segDF",
      "style": {
        "strokeWidth": 0,
        "highlightStrokeWidth": 5,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "pD",
        "pF"
      ]
    },
    {
      "id": "segAB",
      "label": "Segmento",
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
      "id": "segBC",
      "label": "Segmento",
      "color": "terracota",
      "layerId": "geometry",
      "order": 10000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group2"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segBC",
      "style": {
        "strokeWidth": 3,
        "highlightStrokeWidth": 5,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "pB",
        "pC"
      ]
    },
    {
      "id": "segDE",
      "label": "Segmento",
      "color": "ocre",
      "layerId": "geometry",
      "order": 11000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segDE",
      "style": {
        "strokeWidth": 3,
        "highlightStrokeWidth": 5,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "pD",
        "pE"
      ]
    },
    {
      "id": "segEF",
      "label": "Segmento",
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
      "id": "congruenceMarkAB",
      "label": "Marca de congruencia de Segmento",
      "color": "ocre",
      "layerId": "geometry",
      "order": 19000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia de Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "congruenceMarkAB",
      "style": {
        "strokeWidth": 2,
        "markHeight": 0.5,
        "highlightStrokeWidth": 2.5,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "pA",
        "pB"
      ],
      "properties": {
        "markCount": 1
      }
    },
    {
      "id": "congruenceMarkDE",
      "label": "Marca de congruencia de Segmento",
      "color": "ocre",
      "layerId": "geometry",
      "order": 20000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia de Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "congruenceMarkDE",
      "style": {
        "strokeWidth": 2,
        "markHeight": 0.5,
        "highlightStrokeWidth": 2.5,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "pD",
        "pE"
      ],
      "properties": {
        "markCount": 1
      }
    },
    {
      "id": "congruenceMarkBC",
      "label": "Marca de congruencia de Segmento",
      "color": "terracota",
      "layerId": "geometry",
      "order": 21000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group2"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia de Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "congruenceMarkBC",
      "style": {
        "strokeWidth": 2,
        "markHeight": 0.5,
        "highlightStrokeWidth": 2.5,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "pB",
        "pC"
      ],
      "properties": {
        "markCount": 2
      }
    },
    {
      "id": "congruenceMarkEF",
      "label": "Marca de congruencia de Segmento",
      "color": "terracota",
      "layerId": "geometry",
      "order": 22000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group2"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia de Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "congruenceMarkEF",
      "style": {
        "strokeWidth": 2,
        "markHeight": 0.5,
        "highlightStrokeWidth": 2.5,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "pE",
        "pF"
      ],
      "properties": {
        "markCount": 2
      }
    },
    {
      "id": "congruenceMarkAC",
      "label": "Marca de congruencia de Segmento",
      "color": "pavo",
      "layerId": "geometry",
      "order": -1000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia de Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "congruenceMarkAC",
      "style": {
        "strokeWidth": 0,
        "fillOpacity": 0,
        "markHeight": 0.6,
        "highlightStrokeWidth": 2.5,
        "highlightFillOpacity": 0,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "pA",
        "pC"
      ],
      "properties": {
        "markCount": 3
      }
    },
    {
      "id": "congruenceMarkDF",
      "label": "Marca de congruencia de Segmento",
      "color": "pavo",
      "layerId": "geometry",
      "order": -2000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia de Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "congruenceMarkDF",
      "style": {
        "strokeWidth": 0,
        "markHeight": 0.6,
        "highlightStrokeWidth": 2.5,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "pD",
        "pF"
      ],
      "properties": {
        "markCount": 3
      }
    }
  ],
  "sliders": [],
  "steps": [],
  "constraints": [
    {
      "id": "onpE",
      "label": "E sobre segDF",
      "kind": "on",
      "refs": [
        "pE",
        "segDF"
      ],
      "enabled": true
    },
    {
      "id": "equalLengthsegDE",
      "label": "Segmento tiene la misma longitud que Segmento",
      "kind": "equalLength",
      "refs": [
        "pE",
        "pD",
        "segAB"
      ],
      "enabled": true
    },
    {
      "id": "equalLengthsegDF",
      "label": "Segmento tiene la misma longitud que Segmento",
      "kind": "equalLength",
      "refs": [
        "pF",
        "pD",
        "segAC"
      ],
      "enabled": true
    }
  ],
  "dependencies": [
    {
      "sourceId": "pA",
      "targetId": "segAC",
      "relation": "construction"
    },
    {
      "sourceId": "pC",
      "targetId": "segAC",
      "relation": "construction"
    },
    {
      "sourceId": "pD",
      "targetId": "segDF",
      "relation": "construction"
    },
    {
      "sourceId": "pF",
      "targetId": "segDF",
      "relation": "construction"
    },
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
      "sourceId": "pB",
      "targetId": "segBC",
      "relation": "construction"
    },
    {
      "sourceId": "pC",
      "targetId": "segBC",
      "relation": "construction"
    },
    {
      "sourceId": "pD",
      "targetId": "segDE",
      "relation": "construction"
    },
    {
      "sourceId": "pE",
      "targetId": "segDE",
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
      "sourceId": "segDF",
      "targetId": "pE",
      "relation": "constraint",
      "constraintId": "onpE"
    },
    {
      "sourceId": "pD",
      "targetId": "pE",
      "relation": "constraint",
      "constraintId": "equalLengthsegDE"
    },
    {
      "sourceId": "segAB",
      "targetId": "pE",
      "relation": "constraint",
      "constraintId": "equalLengthsegDE"
    },
    {
      "sourceId": "pA",
      "targetId": "congruenceMarkAB",
      "relation": "construction"
    },
    {
      "sourceId": "pB",
      "targetId": "congruenceMarkAB",
      "relation": "construction"
    },
    {
      "sourceId": "pD",
      "targetId": "congruenceMarkDE",
      "relation": "construction"
    },
    {
      "sourceId": "pE",
      "targetId": "congruenceMarkDE",
      "relation": "construction"
    },
    {
      "sourceId": "pB",
      "targetId": "congruenceMarkBC",
      "relation": "construction"
    },
    {
      "sourceId": "pC",
      "targetId": "congruenceMarkBC",
      "relation": "construction"
    },
    {
      "sourceId": "pE",
      "targetId": "congruenceMarkEF",
      "relation": "construction"
    },
    {
      "sourceId": "pF",
      "targetId": "congruenceMarkEF",
      "relation": "construction"
    },
    {
      "sourceId": "pA",
      "targetId": "congruenceMarkAC",
      "relation": "construction"
    },
    {
      "sourceId": "pC",
      "targetId": "congruenceMarkAC",
      "relation": "construction"
    },
    {
      "sourceId": "pD",
      "targetId": "congruenceMarkDF",
      "relation": "construction"
    },
    {
      "sourceId": "pF",
      "targetId": "congruenceMarkDF",
      "relation": "construction"
    },
    {
      "sourceId": "pD",
      "targetId": "pF",
      "relation": "constraint",
      "constraintId": "equalLengthsegDF"
    },
    {
      "sourceId": "segAC",
      "targetId": "pF",
      "relation": "constraint",
      "constraintId": "equalLengthsegDF"
    }
  ],
  "note": "Añada puntos y construcciones para reconstruir visualmente el diagrama.",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const Congruence3 = () => <DiagramRenderer spec={Congruence3Spec} />;
