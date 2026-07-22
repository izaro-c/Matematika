import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const MedianaSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Medianas y baricentro",
  "componentId": "mediana",
  "category": "Definiciones",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "viewport": {
    "bounds": [
      -5,
      5,
      5,
      -4.5
    ],
    "home": [
      -5,
      5,
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
      "label": "Lecturas y controles",
      "order": 1,
      "visible": true,
      "locked": false
    }
  ],
  "groups": [
    {
      "id": "gMedian",
      "label": "Tres medianas",
      "memberIds": [
        "medA",
        "medB",
        "medC"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Tres medianas",
        "role": "primary"
      },
      "target": true,
      "targetId": "mediana",
      "color": "musgo"
    },
    {
      "id": "gVertex",
      "label": "Vértices",
      "memberIds": [
        "A",
        "B",
        "C"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértices",
        "role": "primary"
      },
      "target": true,
      "targetId": "vertice",
      "color": "musgo"
    },
    {
      "id": "gMidpoints",
      "label": "Puntos medios",
      "memberIds": [
        "Ma",
        "Mb",
        "Mc"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Puntos medios",
        "role": "primary"
      },
      "target": true,
      "targetId": "punto-medio",
      "color": "pizarra"
    }
  ],
  "objects": [
    {
      "id": "A",
      "label": "A",
      "color": "musgo",
      "layerId": "geometry",
      "order": 310,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gVertex"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto A",
        "role": "primary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3,
        "y": -2
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
        "snapToGrid": true,
        "snapSize": 0.25
      }
    },
    {
      "id": "B",
      "label": "B",
      "color": "musgo",
      "layerId": "geometry",
      "order": 320,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gVertex"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto B",
        "role": "primary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 3,
        "y": -1.4
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
        "snapToGrid": true,
        "snapSize": 0.25
      }
    },
    {
      "id": "C",
      "label": "C",
      "color": "musgo",
      "layerId": "geometry",
      "order": 330,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gVertex"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto C",
        "role": "primary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0.8,
        "y": 3
      },
      "mobility": {
        "type": "constrained",
        "relationIds": [
          "sameSideC"
        ]
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {
        "snapToGrid": true,
        "snapSize": 0.25
      }
    },
    {
      "id": "triangle",
      "label": "Triángulo ABC",
      "color": "musgo",
      "layerId": "geometry",
      "order": 340,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo ABC",
        "role": "secondary"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "A",
          "B",
          "C"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "fillOpacity": 0.08,
        "highlightFillOpacity": 0.28,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "Ma",
      "label": "Punto medio de BC",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 350,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gMidpoints"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto medio de BC",
        "role": "secondary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "midpoint",
        "points": [
          "B",
          "C"
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "Mb",
      "label": "Punto medio de CA",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 360,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gMidpoints"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto medio de CA",
        "role": "secondary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "midpoint",
        "points": [
          "C",
          "A"
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "Mc",
      "label": "Punto medio de AB",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 370,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gMidpoints"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto medio de AB",
        "role": "secondary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "midpoint",
        "points": [
          "A",
          "B"
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "medA",
      "label": "Mediana desde A",
      "color": "musgo",
      "layerId": "geometry",
      "order": 380,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gMedian"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mediana desde A",
        "role": "secondary"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "A",
          "Ma"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "medB",
      "label": "Mediana desde B",
      "color": "musgo",
      "layerId": "geometry",
      "order": 390,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gMedian"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mediana desde B",
        "role": "secondary"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "B",
          "Mb"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "medC",
      "label": "Mediana desde C",
      "color": "musgo",
      "layerId": "geometry",
      "order": 400,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gMedian"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mediana desde C",
        "role": "secondary"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "C",
          "Mc"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "G",
      "label": "G",
      "color": "ocre",
      "layerId": "geometry",
      "order": 410,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "G",
        "role": "secondary"
      },
      "target": true,
      "targetId": "baricentro",
      "objectType": "point",
      "definition": {
        "type": "intersection",
        "supports": [
          "medA",
          "medB"
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 7,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "AG",
      "label": "AG",
      "color": "musgo",
      "layerId": "geometry",
      "order": 420,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "AG",
        "role": "secondary"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "A",
          "G"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "GMa",
      "label": "GMₐ",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 430,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "GMₐ",
        "role": "secondary"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "G",
          "Ma"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "ratio",
      "label": "Propiedad del baricentro",
      "color": "musgo",
      "layerId": "annotations",
      "order": 440,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Propiedad del baricentro",
        "role": "annotation"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "En cada mediana, vértice–G : G–punto medio = 2 : 1.",
        "title": "Propiedad del baricentro"
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.98,
          0.03
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [
    {
      "id": "sameSideC",
      "label": "C no cruza la base AB",
      "enabled": true,
      "type": "same-half-plane",
      "points": [
        "C",
        "A"
      ],
      "boundary": "B"
    }
  ],
  "steps": [],
  "note": "Mueve A, B o C. Los puntos medios, las tres medianas y su intersección G se reconstruyen automáticamente."
}
);
/* @matematika-diagram-spec:end */

export const Mediana = () => <DiagramRenderer spec={MedianaSpec} />;
