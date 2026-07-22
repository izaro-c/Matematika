import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const Congruence1Spec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
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
  "objects": [
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3.64,
        "y": 3.04
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0.03,
        "y": 4.36
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 7,
        "highlightSize": 10
      },
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -1.2,
        "y": -1.26
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.582735168797865,
        "y": -0.31015019990538195
      },
      "mobility": {
        "type": "constrained",
        "relationIds": [
          "onpD",
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 5.61,
        "y": 0.45
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "highlightSize": 6,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
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
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pA",
          "pB"
        ]
      },
      "appearance": {
        "strokeWidth": 4,
        "highlightStrokeWidth": 6,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pC",
          "pD"
        ]
      },
      "appearance": {
        "strokeWidth": 4,
        "highlightStrokeWidth": 6,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "circle",
        "center": "pC",
        "point": "pD"
      },
      "appearance": {
        "dashed": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "ray",
        "points": [
          "pC",
          "pDir"
        ]
      },
      "appearance": {
        "dashed": true,
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [
    {
      "id": "onpD",
      "label": "D sobre rayCDir",
      "enabled": true,
      "type": "on-support",
      "point": "pD",
      "support": "rayCDir"
    },
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
    }
  ],
  "steps": [],
  "note": "Arrastra A y B"
}
);
/* @matematika-diagram-spec:end */

export const Congruence1 = () => <DiagramRenderer spec={Congruence1Spec} />;
