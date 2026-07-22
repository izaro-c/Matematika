import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const Congruence3Spec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
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
  "objects": [
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2,
        "y": 0.6
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0,
        "y": 0.44789957374051603
      },
      "mobility": {
        "type": "on-support",
        "support": "segAC"
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2,
        "y": -2.03
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0.00015774136631785396,
        "y": -1.879988169397526
      },
      "mobility": {
        "type": "constrained",
        "relationIds": [
          "onpE",
          "equalLengthsegDE"
        ]
      },
      "appearance": {
        "size": 7,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2,
        "y": -1.73
      },
      "mobility": {
        "type": "constrained",
        "relationIds": [
          "equalLengthsegDF"
        ]
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.1,
        "y": 0.4
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
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pA",
          "pC"
        ]
      },
      "appearance": {
        "strokeWidth": 0,
        "highlightStrokeWidth": 5,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pD",
          "pF"
        ]
      },
      "appearance": {
        "strokeWidth": 0,
        "highlightStrokeWidth": 5,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pA",
          "pB"
        ]
      },
      "appearance": {
        "strokeWidth": 3,
        "highlightStrokeWidth": 5,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
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
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pD",
          "pE"
        ]
      },
      "appearance": {
        "strokeWidth": 3,
        "highlightStrokeWidth": 5,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pE",
          "pF"
        ]
      },
      "appearance": {
        "strokeWidth": 3,
        "highlightStrokeWidth": 5,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "pA",
          "pB"
        ]
      },
      "count": 1,
      "height": 0.5,
      "appearance": {
        "strokeWidth": 2,
        "preserveColorOnHighlight": true
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
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "pD",
          "pE"
        ]
      },
      "count": 1,
      "height": 0.5,
      "appearance": {
        "strokeWidth": 2,
        "preserveColorOnHighlight": true
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
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "pB",
          "pC"
        ]
      },
      "count": 2,
      "height": 0.5,
      "appearance": {
        "strokeWidth": 2,
        "preserveColorOnHighlight": true
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
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "pE",
          "pF"
        ]
      },
      "count": 2,
      "height": 0.5,
      "appearance": {
        "strokeWidth": 2,
        "preserveColorOnHighlight": true
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
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "pA",
          "pC"
        ]
      },
      "count": 3,
      "height": 0.6,
      "appearance": {
        "strokeWidth": 0,
        "preserveColorOnHighlight": true
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
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "pD",
          "pF"
        ]
      },
      "count": 3,
      "height": 0.6,
      "appearance": {
        "strokeWidth": 0,
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [
    {
      "id": "onpE",
      "label": "E sobre segDF",
      "enabled": true,
      "type": "on-support",
      "point": "pE",
      "support": "segDF"
    },
    {
      "id": "equalLengthsegDE",
      "label": "Segmento tiene la misma longitud que Segmento",
      "enabled": true,
      "type": "equal-length",
      "segments": [
        "segDE",
        "segAB"
      ],
      "drivenPoint": "pE"
    },
    {
      "id": "equalLengthsegDF",
      "label": "Segmento tiene la misma longitud que Segmento",
      "enabled": true,
      "type": "equal-length",
      "segments": [
        "segDF",
        "segAC"
      ],
      "drivenPoint": "pF"
    }
  ],
  "steps": [],
  "note": "Añada puntos y construcciones para reconstruir visualmente el diagrama."
}
);
/* @matematika-diagram-spec:end */

export const Congruence3 = () => <DiagramRenderer spec={Congruence3Spec} />;
