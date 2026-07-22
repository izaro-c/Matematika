import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const Congruence2Spec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Axioma de Congruencia II",
  "componentId": "axioma-de-congruencia-ii",
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
  "objects": [
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2,
        "y": 2
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2,
        "y": 2
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2,
        "y": 0
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2,
        "y": 0
      },
      "mobility": {
        "type": "constrained",
        "relationIds": [
          "equalLengthsegCD"
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2,
        "y": -2
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2,
        "y": -2
      },
      "mobility": {
        "type": "constrained",
        "relationIds": [
          "equalLengthsegEF"
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
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pC",
          "pD"
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
      "objectType": "mark",
      "variant": "graduation",
      "anchor": {
        "type": "path",
        "path": "segCD"
      },
      "count": 1,
      "height": 15,
      "spacing": 1,
      "appearance": {
        "strokeWidth": 2,
        "preserveColorOnHighlight": true
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
      "objectType": "mark",
      "variant": "graduation",
      "anchor": {
        "type": "path",
        "path": "segEF"
      },
      "count": 1,
      "height": 15,
      "spacing": 1,
      "appearance": {
        "strokeWidth": 2,
        "preserveColorOnHighlight": true
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
      "objectType": "mark",
      "variant": "graduation",
      "anchor": {
        "type": "path",
        "path": "segAB"
      },
      "count": 1,
      "height": 15,
      "spacing": 1,
      "appearance": {
        "strokeWidth": 2,
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [
    {
      "id": "equalLengthsegCD",
      "label": "Segmento tiene la misma longitud que Segmento",
      "enabled": true,
      "type": "equal-length",
      "segments": [
        "segCD",
        "segAB"
      ],
      "drivenPoint": "pD"
    },
    {
      "id": "equalLengthsegEF",
      "label": "Segmento tiene la misma longitud que Segmento",
      "enabled": true,
      "type": "equal-length",
      "segments": [
        "segEF",
        "segAB"
      ],
      "drivenPoint": "pF"
    }
  ],
  "steps": [],
  "note": "Arrastra A, B, C, D, E y F"
}
);
/* @matematika-diagram-spec:end */

export const Congruence2 = () => <DiagramRenderer spec={Congruence2Spec} />;
