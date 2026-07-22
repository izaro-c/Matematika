import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const DosRectasUnPuntoSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Dos rectas distintas comparten a lo sumo un punto",
  "componentId": "dos-rectas-un-punto",
  "category": "Teoremas",
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
      "id": "gLines",
      "label": "Dos rectas",
      "memberIds": [
        "line1",
        "line2"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Dos rectas",
        "role": "primary"
      },
      "target": true,
      "targetId": "rectas",
      "color": "terracota"
    },
    {
      "id": "gPoint",
      "label": "Punto de intersección",
      "memberIds": [
        "P"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto de intersección",
        "role": "primary"
      },
      "target": true,
      "targetId": "punto",
      "color": "terracota"
    }
  ],
  "objects": [
    {
      "id": "A",
      "label": "A",
      "color": "musgo",
      "layerId": "geometry",
      "order": 1420,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto A",
        "role": "primary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2.75,
        "y": -2.25
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
      "order": 1430,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto B",
        "role": "primary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.75,
        "y": 1.5
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
      "color": "pavo",
      "layerId": "geometry",
      "order": 1440,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto C",
        "role": "primary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3.25,
        "y": 2.25
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
      "id": "D",
      "label": "D",
      "color": "pavo",
      "layerId": "geometry",
      "order": 1450,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto D",
        "role": "primary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 3,
        "y": -2.25
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
      "id": "line1",
      "label": "$l$",
      "color": "musgo",
      "layerId": "geometry",
      "order": 1460,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gLines"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta l",
        "role": "secondary"
      },
      "target": true,
      "targetId": "line1",
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
        "strokeWidth": 2.4,
        "labelVisible": true,
        "labelOffset": [
          10,
          20
        ],
        "labelPosition": 0.02,
        "labelSize": 16,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "line2",
      "label": "$m$",
      "color": "pavo",
      "layerId": "geometry",
      "order": 1470,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gLines"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta m",
        "role": "secondary"
      },
      "target": true,
      "targetId": "line2",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "through-points",
          "points": [
            "C",
            "D"
          ]
        }
      },
      "appearance": {
        "strokeWidth": 2.4,
        "labelVisible": true,
        "labelOffset": [
          10,
          10
        ],
        "labelPosition": 0.02,
        "labelSize": 16,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "P",
      "label": "P",
      "color": "terracota",
      "layerId": "geometry",
      "order": 2480,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gPoint"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "P",
        "role": "secondary"
      },
      "target": true,
      "targetId": "P_interseccion",
      "objectType": "point",
      "definition": {
        "type": "intersection",
        "supports": [
          "line1",
          "line2"
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
      "id": "infoPanel4",
      "label": "Panel informativo",
      "color": "salvia",
      "layerId": "geometry",
      "order": 3480,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Panel informativo",
        "role": "secondary"
      },
      "target": true,
      "targetId": "infoPanel4",
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "$P\\in l \\cap m$",
        "layout": "stack"
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0,
          0
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [],
  "steps": [],
  "note": "Mueve A, B, C y D"
}
);
/* @matematika-diagram-spec:end */

export const DosRectasUnPunto = () => <DiagramRenderer spec={DosRectasUnPuntoSpec} />;
