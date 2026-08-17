import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const SegmentoSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Segmento",
  "componentId": "segmento",
  "category": "Definiciones",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "header": {
    "readingsMode": "custom",
    "readings": [
      {
        "id": "header-reading-1",
        "sourceIds": [
          "length"
        ],
        "presentation": "label-value"
      }
    ]
  },
  "viewport": {
    "bounds": [
      -5,
      4,
      5,
      -4
    ],
    "home": [
      -5,
      4,
      5,
      -4
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
  "groups": [],
  "objects": [
    {
      "id": "A",
      "label": "A",
      "color": "musgo",
      "layerId": "geometry",
      "order": 4,
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
        "snapToGrid": false,
        "snapSize": 0.25
      }
    },
    {
      "id": "B",
      "label": "B",
      "color": "musgo",
      "layerId": "geometry",
      "order": 3,
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
        "x": 2.03,
        "y": 1.12
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
        "snapToGrid": false,
        "snapSize": 0.25
      }
    },
    {
      "id": "carrier",
      "label": "Recta soporte l",
      "color": "carbon",
      "layerId": "geometry",
      "order": 0,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta soporte l",
        "role": "secondary"
      },
      "target": true,
      "targetId": "lineL",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "through-points",
          "points": [
            "A",
            "B"
          ]
        }
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2.4,
        "strokeOpacity": 0.45,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segment",
      "label": "Segmento AB",
      "color": "musgo",
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
      "targetId": "segmentAB",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "A",
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
      "id": "length",
      "label": "Longitud de AB",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 2,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Longitud AB",
        "role": "secondary"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "dimension",
        "points": [
          "A",
          "B"
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
  "note": "Mueve A o B"
}
);
/* @matematika-diagram-spec:end */

export const Segmento = () => <DiagramRenderer spec={SegmentoSpec} />;
