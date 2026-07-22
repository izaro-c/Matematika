import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const TalesSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Teorema de Tales",
  "componentId": "teorema-de-tales",
  "category": "Teoremas",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "showLabels": true,
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
  "groups": [],
  "objects": [
    {
      "id": "pA",
      "label": "A",
      "color": "terracota",
      "layerId": "geometry",
      "order": 27000,
      "visible": true,
      "locked": false,
      "groupIds": [],
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
        "x": -3.19,
        "y": 0.56
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
      "interaction": {}
    },
    {
      "id": "pB",
      "label": "B",
      "color": "terracota",
      "layerId": "geometry",
      "order": 28000,
      "visible": true,
      "locked": false,
      "groupIds": [],
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
        "x": 3.98,
        "y": 0.35
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
      "interaction": {}
    },
    {
      "id": "pC",
      "label": "C",
      "color": "terracota",
      "layerId": "geometry",
      "order": 29000,
      "visible": true,
      "locked": false,
      "groupIds": [],
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
        "x": 2.26,
        "y": 4.29
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
      "interaction": {}
    },
    {
      "id": "pD",
      "label": "D",
      "color": "musgo",
      "layerId": "geometry",
      "order": 30000,
      "visible": true,
      "locked": false,
      "groupIds": [],
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
        "x": 1.520059996501662,
        "y": 0.42204845198530694
      },
      "mobility": {
        "type": "on-support",
        "support": "segAB"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "polygonABC",
      "label": "Polígono",
      "color": "salvia",
      "layerId": "geometry",
      "order": 3000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Polígono",
        "role": "secondary"
      },
      "target": true,
      "targetId": "polygonABC",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "pA",
          "pB",
          "pC"
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segAB",
      "label": "Segmento",
      "color": "terracota",
      "layerId": "geometry",
      "order": 4000,
      "visible": true,
      "locked": false,
      "groupIds": [],
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
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segBC",
      "label": "Segmento",
      "color": "terracota",
      "layerId": "geometry",
      "order": -3000,
      "visible": true,
      "locked": false,
      "groupIds": [],
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
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segAC",
      "label": "Segmento",
      "color": "terracota",
      "layerId": "geometry",
      "order": 6000,
      "visible": true,
      "locked": false,
      "groupIds": [],
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
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "lineBC",
      "label": "Recta",
      "color": "pavo",
      "layerId": "geometry",
      "order": -4000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta",
        "role": "secondary"
      },
      "target": true,
      "targetId": "lineBC",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "through-points",
          "points": [
            "pB",
            "pC"
          ]
        }
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 1,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "parCBD",
      "label": "Paralela",
      "color": "pavo",
      "layerId": "geometry",
      "order": -5000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Paralela",
        "role": "secondary"
      },
      "target": true,
      "targetId": "parCBD",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "parallel",
          "linePoints": [
            "pC",
            "pB"
          ],
          "through": "pD"
        }
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 1,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "intE",
      "label": "E",
      "color": "musgo",
      "layerId": "geometry",
      "order": 31000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Intersección",
        "role": "secondary"
      },
      "target": true,
      "targetId": "intarCBDsegAC",
      "objectType": "point",
      "definition": {
        "type": "intersection",
        "supports": [
          "parCBD",
          "segAC"
        ],
        "restrictToSupports": true
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 7,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segDE",
      "label": "Segmento",
      "color": "musgo",
      "layerId": "geometry",
      "order": 12000,
      "visible": true,
      "locked": false,
      "groupIds": [],
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
          "intE"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segAD",
      "label": "Segmento",
      "color": "terracota",
      "layerId": "geometry",
      "order": -6000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segAD",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pA",
          "pD"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segAE",
      "label": "Segmento",
      "color": "terracota",
      "layerId": "geometry",
      "order": -7000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segAE",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pA",
          "intE"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segEC",
      "label": "Segmento",
      "color": "terracota",
      "layerId": "geometry",
      "order": -8000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segEC",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "intE",
          "pC"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segDB",
      "label": "Segmento",
      "color": "terracota",
      "layerId": "geometry",
      "order": -9000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segDB",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pD",
          "pB"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "label-segDB",
      "label": "Etiqueta de Segmento",
      "color": "carbon",
      "layerId": "geometry",
      "order": 17000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Etiqueta de Segmento",
        "role": "annotation"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "label",
      "content": {
        "text": "${segDB.length}$"
      },
      "anchor": {
        "type": "object",
        "object": "segDB",
        "parameter": 0.5,
        "offset": [
          -0.25,
          -0.3
        ]
      },
      "appearance": {
        "fontSize": 14,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "label-segAD",
      "label": "Etiqueta de Segmento",
      "color": "carbon",
      "layerId": "geometry",
      "order": 18000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Etiqueta de Segmento",
        "role": "annotation"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "label",
      "content": {
        "text": "${segAD.length}$"
      },
      "anchor": {
        "type": "object",
        "object": "segAD",
        "parameter": 0.5,
        "offset": [
          -0.25,
          -0.3
        ]
      },
      "appearance": {
        "fontSize": 14,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "label-segAE",
      "label": "Etiqueta de Segmento",
      "color": "carbon",
      "layerId": "geometry",
      "order": 19000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Etiqueta de Segmento",
        "role": "annotation"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "label",
      "content": {
        "text": "${segAE.length}$"
      },
      "anchor": {
        "type": "object",
        "object": "segAE",
        "parameter": 0.5,
        "offset": [
          -0.25,
          0.5
        ]
      },
      "appearance": {
        "fontSize": 14,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "label-segEC",
      "label": "Etiqueta de Segmento",
      "color": "carbon",
      "layerId": "geometry",
      "order": 20000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Etiqueta de Segmento",
        "role": "annotation"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "label",
      "content": {
        "text": "${segEC.length}$"
      },
      "anchor": {
        "type": "object",
        "object": "segEC",
        "parameter": 0.5,
        "offset": [
          -0.25,
          0.5
        ]
      },
      "appearance": {
        "fontSize": 14,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "infoPanel17",
      "label": "Panel informativo",
      "color": "terracota",
      "layerId": "geometry",
      "order": 21000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Panel informativo",
        "role": "secondary"
      },
      "target": true,
      "targetId": "infoPanel17",
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "",
        "blocks": [
          {
            "id": "bloque-1",
            "text": "$\\frac{AD}{DB}= {segAD.length / segDB.length}$",
            "unit": "u",
            "rules": []
          },
          {
            "id": "bloque-2",
            "text": "$\\frac{AE}{EC} = {segAE.length / segEC.length}$",
            "unit": "u",
            "rules": []
          }
        ],
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

export const Tales = () => <DiagramRenderer spec={TalesSpec} />;
