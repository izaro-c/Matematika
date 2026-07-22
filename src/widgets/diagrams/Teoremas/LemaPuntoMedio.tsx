import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const LemaPuntoMedioSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Punto medio",
  "componentId": "lema-punto-medio",
  "category": "Lemas",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "viewport": {
    "bounds": [
      -5.053339646140849,
      7.214733335572514,
      4.9356899909801175,
      -8.3237572110601
    ],
    "home": [
      -5,
      3.5,
      5,
      -3.5
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
      "id": "gSegment",
      "label": "Segmento AB",
      "memberIds": [
        "AB"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento AB",
        "role": "primary"
      },
      "target": true,
      "targetId": "segmento",
      "color": "granada"
    },
    {
      "id": "gCongruence",
      "label": "Subsegmentos congruentes",
      "memberIds": [
        "AM",
        "MB",
        "dAM",
        "dMB"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Subsegmentos congruentes",
        "role": "primary"
      },
      "target": true,
      "targetId": "congruencia",
      "color": "granada"
    }
  ],
  "objects": [
    {
      "id": "A",
      "label": "A",
      "color": "granada",
      "layerId": "geometry",
      "order": 1500,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto A",
        "role": "primary"
      },
      "target": true,
      "targetId": "A",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3,
        "y": 0
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
      "color": "granada",
      "layerId": "geometry",
      "order": 1510,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto B",
        "role": "primary"
      },
      "target": true,
      "targetId": "B",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 3,
        "y": 1
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
      "id": "AB",
      "label": "Segmento AB",
      "color": "granada",
      "layerId": "geometry",
      "order": 1520,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gSegment"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento AB",
        "role": "secondary"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "A",
          "B"
        ]
      },
      "appearance": {
        "strokeWidth": 3,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "M",
      "label": "M",
      "color": "granada",
      "layerId": "geometry",
      "order": 1530,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "M",
        "role": "secondary"
      },
      "target": true,
      "targetId": "punto-medio",
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
        "size": 7,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "AM",
      "label": "AM",
      "color": "granada",
      "layerId": "geometry",
      "order": 1540,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gCongruence"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "AM",
        "role": "secondary"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "A",
          "M"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "MB",
      "label": "MB",
      "color": "granada",
      "layerId": "geometry",
      "order": 1550,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gCongruence"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "MB",
        "role": "secondary"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "M",
          "B"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "dAM",
      "label": "AM",
      "color": "pizarra",
      "layerId": "geometry",
      "order": -2000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gCongruence"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "AM",
        "role": "secondary"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "dimension",
        "points": [
          "A",
          "M"
        ],
        "offset": 0
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "dMB",
      "label": "MB",
      "color": "pizarra",
      "layerId": "geometry",
      "order": -1000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gCongruence"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "MB",
        "role": "secondary"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "dimension",
        "points": [
          "M",
          "B"
        ],
        "offset": 0
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [],
  "steps": [],
  "note": "Mueve A o B"
}
);
/* @matematika-diagram-spec:end */

export const LemaPuntoMedio = () => <DiagramRenderer spec={LemaPuntoMedioSpec} />;
