import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const DistanciaSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Distancia métrica y desigualdad triangular",
  "componentId": "distancia",
  "category": "Definiciones",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "header": {
    "readingsMode": "custom",
    "readings": [
      {
        "id": "header-reading-ab",
        "sourceIds": [
          "dAB"
        ],
        "presentation": "label-value"
      },
      {
        "id": "header-reading-bc",
        "sourceIds": [
          "dBC"
        ],
        "presentation": "label-value"
      },
      {
        "id": "header-reading-ac",
        "sourceIds": [
          "dAC"
        ],
        "presentation": "label-value"
      }
    ]
  },
  "viewport": {
    "bounds": [
      -5,
      4.5,
      5,
      -4.5
    ],
    "home": [
      -5,
      4.5,
      5,
      -4.5
    ],
    "minZoom": 0.55,
    "maxZoom": 5,
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
      "id": "annotations",
      "label": "Lecturas",
      "order": 1,
      "visible": true,
      "locked": false
    }
  ],
  "groups": [],
  "objects": [
    {
      "id": "pA",
      "label": "A",
      "color": "terracota",
      "layerId": "geometry",
      "order": 10,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto A",
        "role": "primary"
      },
      "target": true,
      "targetId": "pA",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2.5,
        "y": -1
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {
        "snapToGrid": false
      }
    },
    {
      "id": "pB",
      "label": "B",
      "color": "terracota",
      "layerId": "geometry",
      "order": 11,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto B",
        "role": "primary"
      },
      "target": true,
      "targetId": "pB",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2,
        "y": -1
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {
        "snapToGrid": false
      }
    },
    {
      "id": "pC",
      "label": "C",
      "color": "canela",
      "layerId": "geometry",
      "order": 12,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto C",
        "role": "primary"
      },
      "target": true,
      "targetId": "pC",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0.5,
        "y": 2
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {
        "snapToGrid": false
      }
    },
    {
      "id": "segAB",
      "label": "AB",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento AB",
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
        "strokeWidth": 2.5,
        "highlightStrokeWidth": 3.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segBC",
      "label": "BC",
      "color": "canela",
      "layerId": "geometry",
      "order": 2,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento BC",
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
        "strokeWidth": 2.5,
        "highlightStrokeWidth": 3.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segAC",
      "label": "AC",
      "color": "musgo",
      "layerId": "geometry",
      "order": 3,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento AC",
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
        "strokeWidth": 2.5,
        "highlightStrokeWidth": 3.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "dAB",
      "label": "d(A, B)",
      "color": "terracota",
      "layerId": "annotations",
      "order": 4,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Distancia d(A, B)",
        "role": "annotation"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "dimension",
        "points": [
          "pA",
          "pB"
        ],
        "offset": 0,
        "unit": "u"
      },
      "appearance": {
        "strokeWidth": 0,
        "labelVisible": false,
        "highlightStrokeWidth": 0,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "dBC",
      "label": "d(B, C)",
      "color": "canela",
      "layerId": "annotations",
      "order": 5,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Distancia d(B, C)",
        "role": "annotation"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "dimension",
        "points": [
          "pB",
          "pC"
        ],
        "offset": 0,
        "unit": "u"
      },
      "appearance": {
        "strokeWidth": 0,
        "labelVisible": false,
        "highlightStrokeWidth": 0,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "dAC",
      "label": "d(A, C)",
      "color": "musgo",
      "layerId": "annotations",
      "order": 6,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Distancia d(A, C)",
        "role": "annotation"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "dimension",
        "points": [
          "pA",
          "pC"
        ],
        "offset": 0,
        "unit": "u"
      },
      "appearance": {
        "strokeWidth": 0,
        "labelVisible": false,
        "highlightStrokeWidth": 0,
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [],
  "steps": [],
  "note": "Arrastra los puntos A, B o C para explorar las distancias y comprobar la desigualdad triangular d(A, C) <= d(A, B) + d(B, C).",
  "translations": {
    "eu": {
      "title": "Distantzia metrikoa eta triangelu-desberdintza",
      "note": "Arrastatu A, B edo C puntuak distantziak arakatzeko eta d(A, C) <= d(A, B) + d(B, C) triangelu-desberdintza egiaztatzeko.",
      "ariaLabels": {
        "pA": "Mugitu A puntua",
        "pB": "Mugitu B puntua",
        "pC": "Mugitu C puntua",
        "segAB": "AB segmentua",
        "segBC": "BC segmentua",
        "segAC": "AC segmentua",
        "dAB": "d(A, B) distantzia",
        "dBC": "d(B, C) distantzia",
        "dAC": "d(A, C) distantzia"
      }
    },
    "en": {
      "title": "Metric distance and triangle inequality",
      "note": "Drag points A, B, or C to explore distances and verify the triangle inequality d(A, C) <= d(A, B) + d(B, C).",
      "ariaLabels": {
        "pA": "Move point A",
        "pB": "Move point B",
        "pC": "Move point C",
        "segAB": "Segment AB",
        "segBC": "Segment BC",
        "segAC": "Segment AC",
        "dAB": "Distance d(A, B)",
        "dBC": "Distance d(B, C)",
        "dAC": "Distance d(A, C)"
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const Distancia = () => <DiagramRenderer spec={DistanciaSpec} />;
