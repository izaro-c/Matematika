import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const MedianaSpec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
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
  "points": [
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
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -3,
      "y": -2,
      "showLabel": true,
      "fixed": false,
      "constraint": "free",
      "snapToGrid": true,
      "snapSize": 0.25
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
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 3,
      "y": -1.4,
      "showLabel": true,
      "fixed": false,
      "constraint": "free",
      "snapToGrid": true,
      "snapSize": 0.25
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
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 0.8,
      "y": 3,
      "showLabel": true,
      "fixed": false,
      "constraint": "constrained",
      "constraintIds": [
        "sameSideC"
      ],
      "snapToGrid": true,
      "snapSize": 0.25
    }
  ],
  "elements": [
    {
      "id": "triangle",
      "label": "Triángulo ABC",
      "color": "carbon",
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
      "style": {
        "strokeWidth": 2.4,
        "fillOpacity": 0.08,
        "highlightFillOpacity": 0.28,
        "preserveColorOnHighlight": true
      },
      "kind": "polygon",
      "refs": [
        "A",
        "B",
        "C"
      ]
    },
    {
      "id": "Ma",
      "label": "$M_{bc}$",
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
      "style": {
        "preserveColorOnHighlight": true
      },
      "kind": "midpoint",
      "refs": [
        "B",
        "C"
      ]
    },
    {
      "id": "Mb",
      "label": "$M_{ac}$",
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
      "style": {
        "preserveColorOnHighlight": true
      },
      "kind": "midpoint",
      "refs": [
        "C",
        "A"
      ]
    },
    {
      "id": "Mc",
      "label": "$M_{ab}$",
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
      "style": {
        "preserveColorOnHighlight": true
      },
      "kind": "midpoint",
      "refs": [
        "A",
        "B"
      ]
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
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 4.5,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "A",
        "Ma"
      ]
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
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 4.5,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "B",
        "Mb"
      ]
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
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 4.5,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "C",
        "Mc"
      ]
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
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "kind": "intersection",
      "refs": [
        "medA",
        "medB"
      ]
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
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "A",
        "G"
      ]
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
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "G",
        "Ma"
      ]
    }
  ],
  "sliders": [],
  "steps": [],
  "constraints": [
    {
      "id": "sameSideC",
      "label": "C no cruza la base AB",
      "kind": "sameSide",
      "refs": [
        "C",
        "A",
        "B"
      ],
      "enabled": true
    }
  ],
  "dependencies": [],
  "note": "Mueve A, B o C. Los puntos medios, las tres medianas y su intersección G se reconstruyen automáticamente.",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const Mediana = () => <DiagramRenderer spec={MedianaSpec} />;
