import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

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
      -5.5,
      5,
      5.5,
      -5
    ],
    "home": [
      -5.5,
      5,
      5.5,
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
      "id": "annotations",
      "label": "Anotaciones",
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
      "order": 1000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Arrastrar punto A",
        "role": "primary"
      },
      "target": true,
      "targetId": "pA",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -1,
        "y": 2.6
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
      "id": "pC1",
      "label": "C",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1010,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Arrastrar punto C",
        "role": "primary"
      },
      "target": true,
      "targetId": "pC1",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2.4,
        "y": -3.2
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
      "id": "segA1C1",
      "label": "Soporte AC",
      "color": "carbon",
      "layerId": "geometry",
      "order": 1020,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "ariaLabel": "Soporte AC",
        "role": "secondary"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pA",
          "pC1"
        ]
      },
      "appearance": {
        "strokeWidth": 1,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pB1",
      "label": "B",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1030,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Arrastrar punto B en el segmento AC",
        "role": "primary"
      },
      "target": true,
      "targetId": "pB1",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -1.72,
        "y": 0.3
      },
      "mobility": {
        "type": "on-support",
        "support": "segA1C1"
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
      "id": "pA1p",
      "label": "A'",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1040,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Arrastrar punto A'",
        "role": "primary"
      },
      "target": true,
      "targetId": "pA1p",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 1.6,
        "y": 2.6
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
      "id": "lineT",
      "label": "$t$",
      "color": "carbon",
      "layerId": "geometry",
      "order": 1050,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Transversal t",
        "role": "secondary"
      },
      "target": true,
      "targetId": "lineT",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "through-points",
          "points": [
            "pA",
            "pC1"
          ]
        }
      },
      "appearance": {
        "strokeWidth": 2,
        "labelVisible": true,
        "highlightStrokeWidth": 3.2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "lineL1",
      "label": "$\\ell_1$",
      "color": "ocre",
      "layerId": "geometry",
      "order": 1060,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta paralela l1",
        "role": "secondary"
      },
      "target": true,
      "targetId": "lineL1",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "through-points",
          "points": [
            "pA",
            "pA1p"
          ]
        }
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 1.8,
        "labelVisible": true,
        "labelOffset": [
          0,
          26
        ],
        "labelPosition": 0.5,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "lineL2",
      "label": "$\\ell_2$",
      "color": "ocre",
      "layerId": "geometry",
      "order": 1070,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta paralela l2",
        "role": "secondary"
      },
      "target": true,
      "targetId": "lineL2",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "parallel",
          "linePoints": [
            "pA",
            "pA1p"
          ],
          "through": "pB1"
        }
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 1.8,
        "labelVisible": true,
        "labelOffset": [
          0,
          26
        ],
        "labelPosition": 0.5,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "lineL3",
      "label": "$\\ell_3$",
      "color": "ocre",
      "layerId": "geometry",
      "order": 1080,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta paralela l3",
        "role": "secondary"
      },
      "target": true,
      "targetId": "lineL3",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "parallel",
          "linePoints": [
            "pA",
            "pA1p"
          ],
          "through": "pC1"
        }
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 1.8,
        "labelVisible": true,
        "labelOffset": [
          0,
          26
        ],
        "labelPosition": 0.5,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pC1p",
      "label": "C'",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1090,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Arrastrar punto C' sobre l3",
        "role": "primary"
      },
      "target": true,
      "targetId": "pC1p",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.8,
        "y": -3.2
      },
      "mobility": {
        "type": "on-support",
        "support": "lineL3"
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
      "id": "lineTPrime",
      "label": "$t'$",
      "color": "carbon",
      "layerId": "geometry",
      "order": 1100,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Transversal t'",
        "role": "secondary"
      },
      "target": true,
      "targetId": "lineTPrime",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "through-points",
          "points": [
            "pA1p",
            "pC1p"
          ]
        }
      },
      "appearance": {
        "strokeWidth": 2,
        "labelVisible": true,
        "highlightStrokeWidth": 3.2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pB1p",
      "label": "B'",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1110,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto dependiente B'",
        "role": "secondary"
      },
      "target": true,
      "targetId": "pB1p",
      "objectType": "point",
      "definition": {
        "type": "intersection",
        "supports": [
          "lineL2",
          "lineTPrime"
        ],
        "restrictToSupports": false
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true,
        "highlightSize": 9,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "segA1B1",
      "label": "AB",
      "color": "carbon",
      "layerId": "geometry",
      "order": 1120,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento AB",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segA1B1",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pA",
          "pB1"
        ]
      },
      "appearance": {
        "strokeWidth": 3.2,
        "highlightStrokeWidth": 4.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segB1C1",
      "label": "BC",
      "color": "carbon",
      "layerId": "geometry",
      "order": 1130,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento BC",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segB1C1",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pB1",
          "pC1"
        ]
      },
      "appearance": {
        "strokeWidth": 3.2,
        "highlightStrokeWidth": 4.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segA1pB1p",
      "label": "A'B'",
      "color": "carbon",
      "layerId": "geometry",
      "order": 1140,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento A'B'",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segA1pB1p",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pA1p",
          "pB1p"
        ]
      },
      "appearance": {
        "strokeWidth": 3.2,
        "highlightStrokeWidth": 4.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segB1pC1p",
      "label": "B'C'",
      "color": "carbon",
      "layerId": "geometry",
      "order": 1150,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento B'C'",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segB1pC1p",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pB1p",
          "pC1p"
        ]
      },
      "appearance": {
        "strokeWidth": 3.2,
        "highlightStrokeWidth": 4.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "infoPanelTales1",
      "label": "Proporciones entre paralelas",
      "color": "terracota",
      "layerId": "annotations",
      "order": 1160,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Proporciones entre paralelas",
        "role": "secondary"
      },
      "target": true,
      "targetId": "infoPanelTales1",
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "",
        "blocks": [
          {
            "id": "block-tales-1",
            "text": "$\\frac{AB}{BC} = {segA1B1.length / segB1C1.length}$",
            "unit": "u",
            "rules": []
          },
          {
            "id": "block-tales-2",
            "text": "$\\frac{A'B'}{B'C'} = {segA1pB1p.length / segB1pC1p.length}$",
            "unit": "u",
            "rules": []
          }
        ],
        "layout": "stack"
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.02,
          0.04
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pB",
      "label": "B",
      "color": "terracota",
      "layerId": "geometry",
      "order": 2010,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Arrastrar vértice B",
        "role": "primary"
      },
      "target": true,
      "targetId": "pB",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2.8,
        "y": -3.2
      },
      "mobility": {
        "type": "on-support",
        "support": "lineL3"
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
      "order": 2020,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Arrastrar vértice C",
        "role": "primary"
      },
      "target": true,
      "targetId": "pC",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.5,
        "y": -3.2
      },
      "mobility": {
        "type": "on-support",
        "support": "lineL3"
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
      "label": "Triángulo ABC",
      "color": "canela",
      "layerId": "geometry",
      "order": 2030,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo ABC",
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
        "fillOpacity": 0.12,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segAB",
      "label": "AB",
      "color": "carbon",
      "layerId": "geometry",
      "order": 2040,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado AB",
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
        "strokeWidth": 2,
        "highlightStrokeWidth": 3.2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segBC",
      "label": "BC",
      "color": "carbon",
      "layerId": "geometry",
      "order": 2050,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado BC",
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
        "strokeWidth": 2,
        "highlightStrokeWidth": 3.2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segAC",
      "label": "AC",
      "color": "carbon",
      "layerId": "geometry",
      "order": 2060,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado AC",
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
        "strokeWidth": 2,
        "highlightStrokeWidth": 3.2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "lineAB",
      "label": "$t$",
      "color": "carbon",
      "layerId": "geometry",
      "order": 2074,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Transversal t (lado AB)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "lineAB",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "through-points",
          "points": [
            "pA",
            "pB"
          ]
        }
      },
      "appearance": {
        "strokeWidth": 1.5,
        "labelVisible": true,
        "labelOffset": [
          -15,
          15
        ],
        "highlightStrokeWidth": 2.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "lineAC",
      "label": "$t'$",
      "color": "carbon",
      "layerId": "geometry",
      "order": 2076,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Transversal t' (lado AC)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "lineAC",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "through-points",
          "points": [
            "pA",
            "pC"
          ]
        }
      },
      "appearance": {
        "strokeWidth": 1.5,
        "labelVisible": true,
        "labelOffset": [
          15,
          15
        ],
        "highlightStrokeWidth": 2.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pD",
      "label": "D",
      "color": "terracota",
      "layerId": "geometry",
      "order": 2080,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Arrastrar punto D en el lado AB",
        "role": "primary"
      },
      "target": true,
      "targetId": "pD",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -1.71,
        "y": 0.3
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
      "id": "parCBD",
      "label": "$\\ell$",
      "color": "ocre",
      "layerId": "geometry",
      "order": 2090,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta paralela l",
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
            "pB",
            "pC"
          ],
          "through": "pD"
        }
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 1.8,
        "labelVisible": true,
        "labelPosition": 0.5,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "intE",
      "label": "E",
      "color": "terracota",
      "layerId": "geometry",
      "order": 2100,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto dependiente E",
        "role": "secondary"
      },
      "target": true,
      "targetId": "intE",
      "objectType": "point",
      "definition": {
        "type": "intersection",
        "supports": [
          "parCBD",
          "segAC"
        ],
        "restrictToSupports": false
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true,
        "highlightSize": 9,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "segDE",
      "label": "DE",
      "color": "ocre",
      "layerId": "geometry",
      "order": 2110,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento DE",
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
        "strokeWidth": 2.8,
        "labelVisible": false,
        "highlightStrokeWidth": 4,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segAD",
      "label": "AD",
      "color": "carbon",
      "layerId": "geometry",
      "order": 2120,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento AD",
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
        "strokeWidth": 3.2,
        "highlightStrokeWidth": 4.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segDB",
      "label": "DB",
      "color": "carbon",
      "layerId": "geometry",
      "order": 2130,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento DB",
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
        "strokeWidth": 3.2,
        "highlightStrokeWidth": 4.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segAE",
      "label": "AE",
      "color": "carbon",
      "layerId": "geometry",
      "order": 2140,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento AE",
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
        "strokeWidth": 3.2,
        "highlightStrokeWidth": 4.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segEC",
      "label": "EC",
      "color": "carbon",
      "layerId": "geometry",
      "order": 2150,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento EC",
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
        "strokeWidth": 3.2,
        "highlightStrokeWidth": 4.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "infoPanel17",
      "label": "Proporciones en el triángulo",
      "color": "terracota",
      "layerId": "annotations",
      "order": 2160,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Proporciones en el triángulo",
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
            "text": "$\\frac{AD}{DB} = {segAD.length / segDB.length}$",
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
          0.02,
          0.04
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [],
  "steps": [
    {
      "id": "step-general",
      "label": "Tres rectas paralelas",
      "description": "Puntos arrastrables: A, B y C (en la secante t), A' y C' (deslizante en l₃ para orientar t'). El punto B' se obtiene por la paralela l₂.",
      "visibleTargets": [
        "lineL1",
        "lineL2",
        "lineL3",
        "lineT",
        "lineTPrime",
        "pA",
        "pB1",
        "pC1",
        "pA1p",
        "pB1p",
        "pC1p",
        "segA1B1",
        "segB1C1",
        "segA1pB1p",
        "segB1pC1p",
        "infoPanelTales1"
      ],
      "durationMs": 1000
    },
    {
      "id": "step-triangulo",
      "label": "Corolario del triángulo",
      "description": "Puntos arrastrables: el vértice A (idéntico al paso 1), los vértices B, C en l₃ y el punto D (en el lado AB). Las paralelas l₁ y l₃ permanecen fijas, mientras l se desplaza con D.",
      "visibleTargets": [
        "polygonABC",
        "pA",
        "pB",
        "pC",
        "pD",
        "intE",
        "lineL1",
        "lineL3",
        "parCBD",
        "lineAB",
        "lineAC",
        "segAB",
        "segBC",
        "segAC",
        "segDE",
        "segAD",
        "segDB",
        "segAE",
        "segEC",
        "infoPanel17"
      ],
      "durationMs": 1000
    }
  ],
  "note": "El vértice A y las rectas paralelas (l₁ y l₃) son idénticos en ambos pasos. Arrastra los puntos para explorar cómo el corolario del triángulo surge cuando las secantes convergen en A.",
  "translations": {
    "eu": {
      "title": "Talesen teorema",
      "note": "A erpina eta zuzen paraleloak (l₁ eta l₃) berdinak dira bi urratsetan. Arrastatu puntuak triangeluaren korolarioa ebakitzaileak A-n batzen direnean nola sortzen den arakatzeko.",
      "steps": {
        "step-general": {
          "label": "Hiru zuzen paralelo",
          "description": "Puntu arrastagarriak: A, B eta C (t ebakitzailean), A' eta C' (l₃-n irristakorra t' orientatzeko). B' puntua l₂ paraleloaren bidez lortzen da."
        },
        "step-triangulo": {
          "label": "Triangeluaren korolarioa",
          "description": "Puntu arrastagarriak: A erpina (1. urratseko bera), B, C erpinak l₃-n eta D puntua (AB aldean). l₁ eta l₃ paraleloak finko mantentzen dira, eta l D-rekin mugitzen da."
        }
      },
      "ariaLabels": {
        "pA": "Arrastatu A puntua",
        "pB1": "Arrastatu B puntua AC zuzenkian",
        "pC1": "Arrastatu C puntua",
        "pA1p": "Arrastatu A' puntua",
        "pB1p": "B' menpeko puntua",
        "pC1p": "Arrastatu C' puntua l3 zuzenean",
        "segA1C1": "AC euskarria",
        "lineT": "t zuzen ebakitzailea",
        "lineTPrime": "t' zuzen ebakitzailea",
        "lineL1": "l1 zuzen paraleloa",
        "lineL2": "l2 zuzen paraleloa",
        "lineL3": "l3 zuzen paraleloa (oinarria)",
        "segA1B1": "AB zuzenkia",
        "segB1C1": "BC zuzenkia",
        "segA1pB1p": "A'B' zuzenkia",
        "segB1pC1p": "B'C' zuzenkia",
        "infoPanelTales1": "Paraleloen arteko proportzioak",
        "pB": "Arrastatu B erpina l3-n",
        "pC": "Arrastatu C erpina l3-n",
        "pD": "Arrastatu D puntua AB aldean",
        "intE": "E menpeko puntua",
        "polygonABC": "ABC triangelua",
        "segAB": "AB aldea",
        "segBC": "BC aldea",
        "segAC": "AC aldea",
        "lineAB": "t zuzen ebakitzailea (AB aldea)",
        "lineAC": "t' zuzen ebakitzailea (AC aldea)",
        "parCBD": "l zuzen paraleloa",
        "segDE": "DE zuzenkia",
        "segAD": "AD zuzenkia",
        "segDB": "DB zuzenkia",
        "segAE": "AE zuzenkia",
        "segEC": "EC zuzenkia",
        "infoPanel17": "Triangeluaren proportzioak"
      }
    },
    "en": {
      "title": "Thales's Theorem",
      "note": "Vertex A and the parallel lines (l₁ and l₃) are identical across both steps. Drag the points to explore how the triangle corollary emerges when the secants converge at A.",
      "steps": {
        "step-general": {
          "label": "Three Parallel Lines",
          "description": "Draggable points: A, B, and C (on secant t), A' and C' (glider on l₃ to orient t'). Point B' is determined by parallel l₂."
        },
        "step-triangulo": {
          "label": "Triangle Corollary",
          "description": "Draggable points: vertex A (identical to step 1), vertices B, C on l₃, and point D (on side AB). Parallels l₁ and l₃ remain fixed, while l moves with D."
        }
      },
      "ariaLabels": {
        "pA": "Drag point A",
        "pB1": "Drag point B along segment AC",
        "pC1": "Drag point C",
        "pA1p": "Drag point A'",
        "pB1p": "Dependent point B'",
        "pC1p": "Drag point C' along line l3",
        "segA1C1": "AC support",
        "lineT": "Transversal line t",
        "lineTPrime": "Transversal line t'",
        "lineL1": "Parallel line l1",
        "lineL2": "Parallel line l2",
        "lineL3": "Parallel line l3 (base line)",
        "segA1B1": "Segment AB",
        "segB1C1": "Segment BC",
        "segA1pB1p": "Segment A'B'",
        "segB1pC1p": "Segment B'C'",
        "infoPanelTales1": "Proportions between parallels",
        "pB": "Drag vertex B along l3",
        "pC": "Drag vertex C along l3",
        "pD": "Drag point D along side AB",
        "intE": "Dependent point E",
        "polygonABC": "Triangle ABC",
        "segAB": "Side AB",
        "segBC": "Side BC",
        "segAC": "Side AC",
        "lineAB": "Transversal line t (side AB)",
        "lineAC": "Transversal line t' (side AC)",
        "parCBD": "Parallel line l",
        "segDE": "Segment DE",
        "segAD": "Segment AD",
        "segDB": "Segment DB",
        "segAE": "Segment AE",
        "segEC": "Segment EC",
        "infoPanel17": "Proportions in triangle"
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const Tales = () => <DiagramRenderer spec={TalesSpec} />;
