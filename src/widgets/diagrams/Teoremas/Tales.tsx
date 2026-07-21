import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const TalesSpec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
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
  "points": [
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
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -3.19,
      "y": 0.56,
      "showLabel": true,
      "fixed": false,
      "constraint": "free"
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
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 3.98,
      "y": 0.35,
      "showLabel": true,
      "fixed": false,
      "constraint": "free"
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
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 2.26,
      "y": 4.29,
      "showLabel": true,
      "fixed": false,
      "constraint": "free"
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
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 1.520059996501662,
      "y": 0.42204845198530694,
      "showLabel": true,
      "fixed": false,
      "constraint": "glider",
      "gliderTarget": "segAB"
    }
  ],
  "elements": [
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
      "style": {
        "preserveColorOnHighlight": true
      },
      "kind": "polygon",
      "refs": [
        "pA",
        "pB",
        "pC"
      ]
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
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "pA",
        "pB"
      ]
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
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "pB",
        "pC"
      ]
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
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "pA",
        "pC"
      ]
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
      "style": {
        "strokeWidth": 1,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "line",
      "refs": [
        "pB",
        "pC"
      ],
      "dashed": true
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
      "style": {
        "strokeWidth": 1,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "parallel",
      "refs": [
        "pC",
        "pB",
        "pD"
      ],
      "dashed": true
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
      "style": {
        "pointSize": 7,
        "preserveColorOnHighlight": true
      },
      "kind": "intersection",
      "refs": [
        "parCBD",
        "segAC"
      ],
      "properties": {
        "restrictToSupports": true
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
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "pD",
        "intE"
      ]
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
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "pA",
        "pD"
      ]
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
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "pA",
        "intE"
      ]
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
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "intE",
        "pC"
      ]
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
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "pD",
        "pB"
      ]
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
      "style": {
        "textOffset": [
          -0.25,
          -0.3
        ],
        "labelSize": 14,
        "preserveColorOnHighlight": true
      },
      "kind": "label",
      "refs": [
        "segDB"
      ],
      "text": "${segDB.length}$",
      "properties": {
        "anchorMode": "reference",
        "anchorParameter": 0.5
      },
      "showLabel": true
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
      "style": {
        "textOffset": [
          -0.25,
          -0.3
        ],
        "labelSize": 14,
        "preserveColorOnHighlight": true
      },
      "kind": "label",
      "refs": [
        "segAD"
      ],
      "text": "${segAD.length}$",
      "properties": {
        "anchorMode": "reference",
        "anchorParameter": 0.5
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
      "style": {
        "textOffset": [
          -0.25,
          0.5
        ],
        "labelSize": 14,
        "preserveColorOnHighlight": true
      },
      "kind": "label",
      "refs": [
        "segAE"
      ],
      "text": "${segAE.length}$",
      "properties": {
        "anchorMode": "reference",
        "anchorParameter": 0.5
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
      "style": {
        "textOffset": [
          -0.25,
          0.5
        ],
        "labelSize": 14,
        "preserveColorOnHighlight": true
      },
      "kind": "label",
      "refs": [
        "segEC"
      ],
      "text": "${segEC.length}$",
      "properties": {
        "anchorMode": "reference",
        "anchorParameter": 0.5
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
      "style": {
        "preserveColorOnHighlight": true
      },
      "kind": "infoPanel",
      "refs": [],
      "properties": {
        "anchorMode": "viewport",
        "viewportPosition": [
          0,
          0
        ],
        "infoPanelBlocks": [
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
        "infoPanelLayout": "stack"
      }
    }
  ],
  "sliders": [],
  "steps": [],
  "constraints": [],
  "dependencies": [
    {
      "sourceId": "pA",
      "targetId": "polygonABC",
      "relation": "construction"
    },
    {
      "sourceId": "pB",
      "targetId": "polygonABC",
      "relation": "construction"
    },
    {
      "sourceId": "pC",
      "targetId": "polygonABC",
      "relation": "construction"
    },
    {
      "sourceId": "pA",
      "targetId": "segAB",
      "relation": "construction"
    },
    {
      "sourceId": "pB",
      "targetId": "segAB",
      "relation": "construction"
    },
    {
      "sourceId": "pB",
      "targetId": "segBC",
      "relation": "construction"
    },
    {
      "sourceId": "pC",
      "targetId": "segBC",
      "relation": "construction"
    },
    {
      "sourceId": "pA",
      "targetId": "segAC",
      "relation": "construction"
    },
    {
      "sourceId": "pC",
      "targetId": "segAC",
      "relation": "construction"
    },
    {
      "sourceId": "pB",
      "targetId": "lineBC",
      "relation": "construction"
    },
    {
      "sourceId": "pC",
      "targetId": "lineBC",
      "relation": "construction"
    },
    {
      "sourceId": "pC",
      "targetId": "parCBD",
      "relation": "construction"
    },
    {
      "sourceId": "pB",
      "targetId": "parCBD",
      "relation": "construction"
    },
    {
      "sourceId": "pD",
      "targetId": "parCBD",
      "relation": "construction"
    },
    {
      "sourceId": "parCBD",
      "targetId": "intE",
      "relation": "construction"
    },
    {
      "sourceId": "segAC",
      "targetId": "intE",
      "relation": "construction"
    },
    {
      "sourceId": "pA",
      "targetId": "segAD",
      "relation": "construction"
    },
    {
      "sourceId": "pD",
      "targetId": "segAD",
      "relation": "construction"
    },
    {
      "sourceId": "pD",
      "targetId": "segDB",
      "relation": "construction"
    },
    {
      "sourceId": "pB",
      "targetId": "segDB",
      "relation": "construction"
    },
    {
      "sourceId": "segDB",
      "targetId": "label-segDB",
      "relation": "construction"
    },
    {
      "sourceId": "segAD",
      "targetId": "label-segAD",
      "relation": "construction"
    },
    {
      "sourceId": "segAE",
      "targetId": "label-segAE",
      "relation": "construction"
    },
    {
      "sourceId": "segEC",
      "targetId": "label-segEC",
      "relation": "construction"
    },
    {
      "sourceId": "pD",
      "targetId": "segDE",
      "relation": "construction"
    },
    {
      "sourceId": "intE",
      "targetId": "segDE",
      "relation": "construction"
    },
    {
      "sourceId": "pA",
      "targetId": "segAE",
      "relation": "construction"
    },
    {
      "sourceId": "intE",
      "targetId": "segAE",
      "relation": "construction"
    },
    {
      "sourceId": "intE",
      "targetId": "segEC",
      "relation": "construction"
    },
    {
      "sourceId": "pC",
      "targetId": "segEC",
      "relation": "construction"
    }
  ],
  "note": "Mueve A, B, C y D",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const Tales = () => <DiagramRenderer spec={TalesSpec} />;
