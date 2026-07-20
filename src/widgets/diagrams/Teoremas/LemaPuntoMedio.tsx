import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const LemaPuntoMedioSpec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Existencia y unicidad del punto medio",
  "componentId": "lema-punto-medio",
  "category": "Lemas",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "viewport": {
    "bounds": [
      -5,
      3.5,
      5,
      -3.5
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
  "points": [
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
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -3,
      "y": 0,
      "showLabel": true,
      "fixed": false,
      "constraint": "free",
      "snapToGrid": true,
      "snapSize": 0.25
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
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 3,
      "y": 1,
      "showLabel": true,
      "fixed": false,
      "constraint": "free",
      "snapToGrid": true,
      "snapSize": 0.25
    }
  ],
  "elements": [
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
      "style": {
        "strokeWidth": 3,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "A",
        "B"
      ]
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
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "kind": "midpoint",
      "refs": [
        "A",
        "B"
      ]
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
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "A",
        "M"
      ]
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
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "M",
        "B"
      ]
    },
    {
      "id": "dAM",
      "label": "AM",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 1560,
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
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "dimensionLine",
      "refs": [
        "A",
        "M"
      ],
      "text": "AM = {value}",
      "properties": {
        "precision": 2,
        "offset": 0.45
      }
    },
    {
      "id": "dMB",
      "label": "MB",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 1570,
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
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "dimensionLine",
      "refs": [
        "M",
        "B"
      ],
      "text": "MB = {value}",
      "properties": {
        "precision": 2,
        "offset": -0.45
      }
    }
  ],
  "sliders": [],
  "steps": [],
  "dependencies": [],
  "note": "Mueve A o B. M se recalcula como (A + B)/2 y las lecturas confirman AM = MB.",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const LemaPuntoMedio = () => <DiagramRenderer spec={LemaPuntoMedioSpec} />;
