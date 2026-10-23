import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const DemoCompletitudRealesSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Demostración: Completitud métrica de los números reales",
  "componentId": "demo-completitud-reales",
  "category": "Demos",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "showLabels": true,
  "viewport": {
    "bounds": [
      -2.0,
      4.7,
      12.6,
      -5.5
    ],
    "home": [
      -2.0,
      4.7,
      12.6,
      -5.5
    ],
    "minZoom": 0.35,
    "maxZoom": 6,
    "padding": 0.1
  },
  "layers": [
    {
      "id": "supports",
      "label": "Soportes",
      "order": 0,
      "visible": true,
      "locked": false
    },
    {
      "id": "constructions",
      "label": "Construcciones",
      "order": 1,
      "visible": true,
      "locked": false
    },
    {
      "id": "geometry",
      "label": "Geometría",
      "order": 2,
      "visible": true,
      "locked": false
    },
    {
      "id": "annotations",
      "label": "Anotaciones",
      "order": 3,
      "visible": true,
      "locked": false
    }
  ],
  "groups": [
    {
      "id": "sucesionCauchy",
      "label": "Términos de la sucesión de Cauchy",
      "memberIds": [
        "pX1",
        "pX2",
        "pX3",
        "pX4",
        "pX5",
        "pX6",
        "pX7",
        "pX8",
        "pX9",
        "pX10",
        "pX11"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Conjunto de términos de la sucesión de Cauchy",
        "role": "primary"
      },
      "target": true,
      "targetId": "sucesionCauchy",
      "color": "carbon"
    }
  ],
  "objects": [
    {
      "id": "pAxisBot",
      "label": "pAxisBot",
      "color": "carbon",
      "layerId": "supports",
      "order": 12,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto auxiliar",
        "role": "construction",
        "highlightable": false
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0,
        "y": -4.3
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pAxisTop",
      "label": "pAxisTop",
      "color": "carbon",
      "layerId": "supports",
      "order": 14,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto auxiliar",
        "role": "construction",
        "highlightable": false
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0,
        "y": 4.3
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "realLine",
      "label": "Recta real",
      "color": "carbon",
      "layerId": "supports",
      "order": 16,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta real (eje vertical)",
        "role": "primary"
      },
      "target": true,
      "targetId": "rectaReal",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "through-points",
          "points": [
            "pAxisBot",
            "pAxisTop"
          ]
        }
      },
      "appearance": {
        "strokeWidth": 2,
        "strokeOpacity": 0.8,
        "highlightStrokeWidth": 4,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pMMin",
      "label": "$m$",
      "color": "ocre",
      "layerId": "geometry",
      "order": 18,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "cota inferior global m",
        "role": "primary"
      },
      "target": true,
      "targetId": "cotaMMin",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0,
        "y": -3.5
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "labelOffset": [
          16,
          0
        ],
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pMMinEnd",
      "label": "pMMinEnd",
      "color": "ocre",
      "layerId": "supports",
      "order": 20,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto auxiliar",
        "role": "construction",
        "highlightable": false
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 11.8,
        "y": -3.5
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "guideMMin",
      "label": "Nivel $m$",
      "color": "ocre",
      "layerId": "constructions",
      "order": 22,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Nivel de cota inferior global m",
        "role": "construction",
        "highlightable": false
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pMMin",
          "pMMinEnd"
        ]
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 1.5,
        "strokeOpacity": 0.7,
        "highlightStrokeWidth": 3.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pMMax",
      "label": "$M$",
      "color": "ocre",
      "layerId": "geometry",
      "order": 24,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "cota superior global M",
        "role": "primary"
      },
      "target": true,
      "targetId": "cotaMMax",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0,
        "y": 3.6
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "labelOffset": [
          16,
          0
        ],
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pMMaxEnd",
      "label": "pMMaxEnd",
      "color": "ocre",
      "layerId": "supports",
      "order": 26,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto auxiliar",
        "role": "construction",
        "highlightable": false
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 11.8,
        "y": 3.6
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "guideMMax",
      "label": "Nivel $M$",
      "color": "ocre",
      "layerId": "constructions",
      "order": 28,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Nivel de cota superior global M",
        "role": "construction",
        "highlightable": false
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pMMax",
          "pMMaxEnd"
        ]
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 1.5,
        "strokeOpacity": 0.7,
        "highlightStrokeWidth": 3.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pIntBot",
      "label": "pIntBot",
      "color": "ocre",
      "layerId": "supports",
      "order": 30,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto auxiliar",
        "role": "construction",
        "highlightable": false
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -0.35,
        "y": -3.5
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pIntTop",
      "label": "pIntTop",
      "color": "ocre",
      "layerId": "supports",
      "order": 32,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto auxiliar",
        "role": "construction",
        "highlightable": false
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -0.35,
        "y": 3.6
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "segAcotacion",
      "label": "Intervalo [m, M]",
      "color": "ocre",
      "layerId": "constructions",
      "order": 34,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Intervalo cerrado [m, M]",
        "role": "primary"
      },
      "target": true,
      "targetId": "intervaloAcotacion",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pIntBot",
          "pIntTop"
        ]
      },
      "appearance": {
        "strokeWidth": 5,
        "strokeOpacity": 0.45,
        "highlightStrokeWidth": 7,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pL",
      "label": "$L$",
      "color": "terracota",
      "layerId": "geometry",
      "order": 36,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "supremo L, límite de la sucesión",
        "role": "primary"
      },
      "target": true,
      "targetId": "supremoL",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0,
        "y": 1.0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 8,
        "labelVisible": true,
        "labelOffset": [
          16,
          0
        ],
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pLEnd",
      "label": "pLEnd",
      "color": "terracota",
      "layerId": "supports",
      "order": 38,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto auxiliar",
        "role": "construction",
        "highlightable": false
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 11.8,
        "y": 1.0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "guideL",
      "label": "Nivel $L$",
      "color": "terracota",
      "layerId": "constructions",
      "order": 40,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Nivel de supremo L, límite de la sucesión",
        "role": "construction",
        "highlightable": false
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pL",
          "pLEnd"
        ]
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 1.5,
        "strokeOpacity": 0.7,
        "highlightStrokeWidth": 3.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pSBot",
      "label": "pSBot",
      "color": "canela",
      "layerId": "supports",
      "order": 42,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto auxiliar",
        "role": "construction",
        "highlightable": false
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -0.7,
        "y": -4.3
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pSTop",
      "label": "pSTop",
      "color": "canela",
      "layerId": "supports",
      "order": 44,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto auxiliar",
        "role": "construction",
        "highlightable": false
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -0.7,
        "y": 1.0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "segS",
      "label": "$S$",
      "color": "canela",
      "layerId": "constructions",
      "order": 46,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Conjunto S de cotas inferiores eventuales (hasta L)",
        "role": "primary"
      },
      "target": true,
      "targetId": "conjuntoS",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pSBot",
          "pSTop"
        ]
      },
      "appearance": {
        "strokeWidth": 5,
        "strokeOpacity": 0.55,
        "highlightStrokeWidth": 7,
        "labelVisible": true,
        "labelOffset": [
          -14,
          0
        ],
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pEpsMinus",
      "label": "$L-\\varepsilon$",
      "color": "mora",
      "layerId": "geometry",
      "order": 48,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "extremo inferior L − ε del entorno",
        "role": "primary"
      },
      "target": true,
      "targetId": "pEpsMinus",
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "0",
        "y": "pL.y-eps",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "labelOffset": [
          30,
          -13
        ],
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pEpsMinusEnd",
      "label": "pEpsMinusEnd",
      "color": "mora",
      "layerId": "supports",
      "order": 50,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto auxiliar",
        "role": "construction",
        "highlightable": false
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "11.8",
        "y": "pL.y-eps",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "guideEpsMinus",
      "label": "Nivel $L-\\varepsilon$",
      "color": "mora",
      "layerId": "constructions",
      "order": 52,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Nivel de extremo inferior L − ε del entorno",
        "role": "construction",
        "highlightable": false
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pEpsMinus",
          "pEpsMinusEnd"
        ]
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 1.5,
        "strokeOpacity": 0.7,
        "highlightStrokeWidth": 3.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pEpsPlus",
      "label": "$L+\\varepsilon$",
      "color": "mora",
      "layerId": "geometry",
      "order": 54,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "extremo superior L + ε del entorno",
        "role": "primary"
      },
      "target": true,
      "targetId": "pEpsPlus",
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "0",
        "y": "pL.y+eps",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "labelOffset": [
          30,
          13
        ],
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pEpsPlusEnd",
      "label": "pEpsPlusEnd",
      "color": "mora",
      "layerId": "supports",
      "order": 56,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto auxiliar",
        "role": "construction",
        "highlightable": false
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "11.8",
        "y": "pL.y+eps",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "guideEpsPlus",
      "label": "Nivel $L+\\varepsilon$",
      "color": "mora",
      "layerId": "constructions",
      "order": 58,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Nivel de extremo superior L + ε del entorno",
        "role": "construction",
        "highlightable": false
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pEpsPlus",
          "pEpsPlusEnd"
        ]
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 1.5,
        "strokeOpacity": 0.7,
        "highlightStrokeWidth": 3.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pEpsBot",
      "label": "pEpsBot",
      "color": "mora",
      "layerId": "supports",
      "order": 60,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto auxiliar",
        "role": "construction",
        "highlightable": false
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-1.05",
        "y": "pL.y-eps",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pEpsTop",
      "label": "pEpsTop",
      "color": "mora",
      "layerId": "supports",
      "order": 62,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto auxiliar",
        "role": "construction",
        "highlightable": false
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-1.05",
        "y": "pL.y+eps",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "segEpsilon",
      "label": "Entorno (L − ε, L + ε)",
      "color": "mora",
      "layerId": "constructions",
      "order": 64,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Entorno (L − ε, L + ε) del límite",
        "role": "primary"
      },
      "target": true,
      "targetId": "entornoEpsilon",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pEpsBot",
          "pEpsTop"
        ]
      },
      "appearance": {
        "strokeWidth": 5,
        "strokeOpacity": 0.55,
        "highlightStrokeWidth": 7,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pNBot",
      "label": "pNBot",
      "color": "pavo",
      "layerId": "supports",
      "order": 66,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto auxiliar",
        "role": "construction",
        "highlightable": false
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "pNidx.x",
        "y": "-4.3",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pNTop",
      "label": "pNTop",
      "color": "pavo",
      "layerId": "supports",
      "order": 68,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto auxiliar",
        "role": "construction",
        "highlightable": false
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "pNidx.x",
        "y": "4.3",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "lineN",
      "label": "Índice N",
      "color": "pavo",
      "layerId": "constructions",
      "order": 70,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Índice N a partir del cual se cumple la condición de Cauchy",
        "role": "construction",
        "highlightable": false
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pNBot",
          "pNTop"
        ]
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 1.2,
        "strokeOpacity": 0.55,
        "highlightStrokeWidth": 3.2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pHalfMinus",
      "label": "$x_N-\\varepsilon/2$",
      "color": "pavo",
      "layerId": "geometry",
      "order": 72,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "extremo inferior x_N − ε/2",
        "role": "primary"
      },
      "target": true,
      "targetId": "pHalfMinus",
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "pNidx.x",
        "y": "pXNval.y-eps/2",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 3,
        "labelVisible": true,
        "labelOffset": [
          -72,
          -18
        ],
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pHalfPlus",
      "label": "$x_N+\\varepsilon/2$",
      "color": "pavo",
      "layerId": "geometry",
      "order": 74,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "extremo superior x_N + ε/2",
        "role": "primary"
      },
      "target": true,
      "targetId": "pHalfPlus",
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "pNidx.x",
        "y": "pXNval.y+eps/2",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 3,
        "labelVisible": true,
        "labelOffset": [
          -72,
          18
        ],
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "segHalf",
      "label": "Banda x_N ± ε/2",
      "color": "pavo",
      "layerId": "constructions",
      "order": 76,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Banda de semianchura ε/2 en torno a x_N",
        "role": "primary"
      },
      "target": true,
      "targetId": "bandaMitad",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pHalfMinus",
          "pHalfPlus"
        ]
      },
      "appearance": {
        "strokeWidth": 6,
        "strokeOpacity": 0.6,
        "highlightStrokeWidth": 8,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pN",
      "label": "$N$",
      "color": "pavo",
      "layerId": "supports",
      "order": 78,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Índice N",
        "role": "construction",
        "highlightable": false
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "pNidx.x",
        "y": "-4.3",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": true,
        "labelOffset": [
          0,
          14
        ],
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pX1",
      "label": "x₁",
      "color": "carbon",
      "layerId": "geometry",
      "order": 80,
      "visible": true,
      "locked": false,
      "groupIds": [
        "sucesionCauchy"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Término x1 de la sucesión",
        "role": "primary"
      },
      "target": true,
      "targetId": "pX1",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 1,
        "y": -3.5
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 3,
        "labelVisible": true,
        "labelOffset": [
          0,
          16
        ],
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pX2",
      "label": "x₂",
      "color": "carbon",
      "layerId": "geometry",
      "order": 82,
      "visible": true,
      "locked": false,
      "groupIds": [
        "sucesionCauchy"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Término x2 de la sucesión",
        "role": "primary"
      },
      "target": true,
      "targetId": "pX2",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2,
        "y": 3.6
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 3,
        "labelVisible": true,
        "labelOffset": [
          0,
          -16
        ],
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pX3",
      "label": "x₃",
      "color": "carbon",
      "layerId": "geometry",
      "order": 84,
      "visible": true,
      "locked": false,
      "groupIds": [
        "sucesionCauchy"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Término x3 de la sucesión",
        "role": "primary"
      },
      "target": true,
      "targetId": "pX3",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 3,
        "y": -1.2
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 3,
        "labelVisible": true,
        "labelOffset": [
          0,
          16
        ],
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pX4",
      "label": "x₄",
      "color": "carbon",
      "layerId": "geometry",
      "order": 86,
      "visible": true,
      "locked": false,
      "groupIds": [
        "sucesionCauchy"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Término x4 de la sucesión",
        "role": "primary"
      },
      "target": true,
      "targetId": "pX4",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 4,
        "y": 2.9
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 3,
        "labelVisible": true,
        "labelOffset": [
          0,
          -16
        ],
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pX5",
      "label": "x₅",
      "color": "carbon",
      "layerId": "geometry",
      "order": 88,
      "visible": true,
      "locked": false,
      "groupIds": [
        "sucesionCauchy"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Término x5 de la sucesión",
        "role": "primary"
      },
      "target": true,
      "targetId": "pX5",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 5,
        "y": 0.7
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 3,
        "labelVisible": false,
        "labelOffset": [
          24,
          -16
        ],
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pX6",
      "label": "x₆",
      "color": "carbon",
      "layerId": "geometry",
      "order": 90,
      "visible": true,
      "locked": false,
      "groupIds": [
        "sucesionCauchy"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Término x6 de la sucesión",
        "role": "primary"
      },
      "target": true,
      "targetId": "pX6",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 6,
        "y": 1.1
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 3,
        "labelVisible": false,
        "labelOffset": [
          0,
          16
        ],
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pX7",
      "label": "x₇",
      "color": "carbon",
      "layerId": "geometry",
      "order": 92,
      "visible": true,
      "locked": false,
      "groupIds": [
        "sucesionCauchy"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Término x7 de la sucesión",
        "role": "primary"
      },
      "target": true,
      "targetId": "pX7",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 7,
        "y": 0.6
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 3,
        "labelVisible": false,
        "labelOffset": [
          0,
          16
        ],
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pX8",
      "label": "x₈",
      "color": "carbon",
      "layerId": "geometry",
      "order": 94,
      "visible": true,
      "locked": false,
      "groupIds": [
        "sucesionCauchy"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Término x8 de la sucesión",
        "role": "primary"
      },
      "target": true,
      "targetId": "pX8",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 8,
        "y": 1.05
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 3,
        "labelVisible": false,
        "labelOffset": [
          0,
          16
        ],
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pX9",
      "label": "x₉",
      "color": "carbon",
      "layerId": "geometry",
      "order": 96,
      "visible": true,
      "locked": false,
      "groupIds": [
        "sucesionCauchy"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Término x9 de la sucesión",
        "role": "primary"
      },
      "target": true,
      "targetId": "pX9",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 9,
        "y": 0.9
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 3,
        "labelVisible": false,
        "labelOffset": [
          0,
          16
        ],
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pX10",
      "label": "x₁₀",
      "color": "carbon",
      "layerId": "geometry",
      "order": 98,
      "visible": true,
      "locked": false,
      "groupIds": [
        "sucesionCauchy"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Término x10 de la sucesión",
        "role": "primary"
      },
      "target": true,
      "targetId": "pX10",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 10,
        "y": 1.02
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 3,
        "labelVisible": false,
        "labelOffset": [
          0,
          16
        ],
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pX11",
      "label": "x₁₁",
      "color": "carbon",
      "layerId": "geometry",
      "order": 100,
      "visible": true,
      "locked": false,
      "groupIds": [
        "sucesionCauchy"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Término x11 de la sucesión",
        "role": "primary"
      },
      "target": true,
      "targetId": "pX11",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 11,
        "y": 0.98
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 3,
        "labelVisible": false,
        "labelOffset": [
          0,
          16
        ],
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "eps",
      "label": "$\\varepsilon$",
      "color": "mora",
      "layerId": "annotations",
      "order": 102,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Deslizador de ε",
        "role": "primary"
      },
      "target": false,
      "objectType": "control",
      "variant": "slider",
      "position": [
        4.6,
        -4.95
      ],
      "range": {
        "min": 0.3,
        "max": 3.0,
        "step": 0.05
      },
      "value": 1.2,
      "width": 4.4
    },
    {
      "id": "pSp1",
      "label": "pSp1",
      "color": "pavo",
      "layerId": "supports",
      "order": 104,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto auxiliar",
        "role": "construction",
        "highlightable": false
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "(max(pX1.y,pX2.y,pX3.y,pX4.y,pX5.y,pX6.y,pX7.y,pX8.y,pX9.y,pX10.y,pX11.y)-min(pX1.y,pX2.y,pX3.y,pX4.y,pX5.y,pX6.y,pX7.y,pX8.y,pX9.y,pX10.y,pX11.y))",
        "y": "0",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pSp2",
      "label": "pSp2",
      "color": "pavo",
      "layerId": "supports",
      "order": 106,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto auxiliar",
        "role": "construction",
        "highlightable": false
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "(max(pX2.y,pX3.y,pX4.y,pX5.y,pX6.y,pX7.y,pX8.y,pX9.y,pX10.y,pX11.y)-min(pX2.y,pX3.y,pX4.y,pX5.y,pX6.y,pX7.y,pX8.y,pX9.y,pX10.y,pX11.y))",
        "y": "0",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pSp3",
      "label": "pSp3",
      "color": "pavo",
      "layerId": "supports",
      "order": 108,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto auxiliar",
        "role": "construction",
        "highlightable": false
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "(max(pX3.y,pX4.y,pX5.y,pX6.y,pX7.y,pX8.y,pX9.y,pX10.y,pX11.y)-min(pX3.y,pX4.y,pX5.y,pX6.y,pX7.y,pX8.y,pX9.y,pX10.y,pX11.y))",
        "y": "0",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pSp4",
      "label": "pSp4",
      "color": "pavo",
      "layerId": "supports",
      "order": 110,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto auxiliar",
        "role": "construction",
        "highlightable": false
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "(max(pX4.y,pX5.y,pX6.y,pX7.y,pX8.y,pX9.y,pX10.y,pX11.y)-min(pX4.y,pX5.y,pX6.y,pX7.y,pX8.y,pX9.y,pX10.y,pX11.y))",
        "y": "0",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pSp5",
      "label": "pSp5",
      "color": "pavo",
      "layerId": "supports",
      "order": 112,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto auxiliar",
        "role": "construction",
        "highlightable": false
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "(max(pX5.y,pX6.y,pX7.y,pX8.y,pX9.y,pX10.y,pX11.y)-min(pX5.y,pX6.y,pX7.y,pX8.y,pX9.y,pX10.y,pX11.y))",
        "y": "0",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pSp6",
      "label": "pSp6",
      "color": "pavo",
      "layerId": "supports",
      "order": 114,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto auxiliar",
        "role": "construction",
        "highlightable": false
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "(max(pX6.y,pX7.y,pX8.y,pX9.y,pX10.y,pX11.y)-min(pX6.y,pX7.y,pX8.y,pX9.y,pX10.y,pX11.y))",
        "y": "0",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pSp7",
      "label": "pSp7",
      "color": "pavo",
      "layerId": "supports",
      "order": 116,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto auxiliar",
        "role": "construction",
        "highlightable": false
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "(max(pX7.y,pX8.y,pX9.y,pX10.y,pX11.y)-min(pX7.y,pX8.y,pX9.y,pX10.y,pX11.y))",
        "y": "0",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pSp8",
      "label": "pSp8",
      "color": "pavo",
      "layerId": "supports",
      "order": 118,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto auxiliar",
        "role": "construction",
        "highlightable": false
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "(max(pX8.y,pX9.y,pX10.y,pX11.y)-min(pX8.y,pX9.y,pX10.y,pX11.y))",
        "y": "0",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pSp9",
      "label": "pSp9",
      "color": "pavo",
      "layerId": "supports",
      "order": 120,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto auxiliar",
        "role": "construction",
        "highlightable": false
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "(max(pX9.y,pX10.y,pX11.y)-min(pX9.y,pX10.y,pX11.y))",
        "y": "0",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pSp10",
      "label": "pSp10",
      "color": "pavo",
      "layerId": "supports",
      "order": 122,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto auxiliar",
        "role": "construction",
        "highlightable": false
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "(max(pX10.y,pX11.y)-min(pX10.y,pX11.y))",
        "y": "0",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pSp11",
      "label": "pSp11",
      "color": "pavo",
      "layerId": "supports",
      "order": 124,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto auxiliar",
        "role": "construction",
        "highlightable": false
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "(max(pX11.y)-min(pX11.y))",
        "y": "0",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pNidx",
      "label": "pNidx",
      "color": "pavo",
      "layerId": "supports",
      "order": 126,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto auxiliar",
        "role": "construction",
        "highlightable": false
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "1+gte(pSp1.x,eps/2)+gte(pSp2.x,eps/2)+gte(pSp3.x,eps/2)+gte(pSp4.x,eps/2)+gte(pSp5.x,eps/2)+gte(pSp6.x,eps/2)+gte(pSp7.x,eps/2)+gte(pSp8.x,eps/2)+gte(pSp9.x,eps/2)+gte(pSp10.x,eps/2)+gte(pSp11.x,eps/2)",
        "y": "0",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pXNval",
      "label": "pXNval",
      "color": "pavo",
      "layerId": "supports",
      "order": 128,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto auxiliar",
        "role": "construction",
        "highlightable": false
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "pNidx.x",
        "y": "eq(pNidx.x,1)*pX1.y+eq(pNidx.x,2)*pX2.y+eq(pNidx.x,3)*pX3.y+eq(pNidx.x,4)*pX4.y+eq(pNidx.x,5)*pX5.y+eq(pNidx.x,6)*pX6.y+eq(pNidx.x,7)*pX7.y+eq(pNidx.x,8)*pX8.y+eq(pNidx.x,9)*pX9.y+eq(pNidx.x,10)*pX10.y+eq(pNidx.x,11)*pX11.y",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pXN",
      "label": "$x_N$",
      "color": "pavo",
      "layerId": "geometry",
      "order": 130,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Término x_N",
        "role": "construction",
        "highlightable": false
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "pNidx.x",
        "y": "pXNval.y",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": true,
        "labelOffset": [
          24,
          -16
        ],
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    }
  ],
  "relations": [],
  "steps": [
    {
      "id": "step-sucesion-cauchy",
      "label": "Términos de la sucesión de Cauchy",
      "description": "Los términos x₁, x₂, … de una sucesión de Cauchy en ℝ, dibujados como puntos (n, xₙ) sobre el eje real vertical: a partir de cierto índice oscilan en una franja cada vez más estrecha.",
      "durationMs": 1200,
      "visibleTargets": [
        "realLine",
        "pX1",
        "pX2",
        "pX3",
        "pX4",
        "pX5",
        "pX6",
        "pX7",
        "pX8",
        "pX9",
        "pX10",
        "pX11"
      ],
      "objectStates": {
        "pX1": {
          "emphasis": "primary"
        },
        "pX2": {
          "emphasis": "primary"
        },
        "pX3": {
          "emphasis": "primary"
        },
        "pX4": {
          "emphasis": "primary"
        },
        "pX5": {
          "emphasis": "primary"
        },
        "pX6": {
          "emphasis": "primary"
        },
        "pX7": {
          "emphasis": "primary"
        },
        "pX8": {
          "emphasis": "primary"
        },
        "pX9": {
          "emphasis": "primary"
        },
        "pX10": {
          "emphasis": "primary"
        },
        "pX11": {
          "emphasis": "primary"
        },
        "realLine": {
          "emphasis": "secondary"
        }
      }
    },
    {
      "id": "step-acotacion",
      "label": "Acotación en el intervalo [m, M]",
      "description": "Con ε = 1, los términos con n ≥ N₀ distan menos de 1 de x_N₀; junto con los finitos términos anteriores, todos quedan entre los niveles m y M, el mínimo y el máximo de esa lista.",
      "durationMs": 1200,
      "visibleTargets": [
        "realLine",
        "pX1",
        "pX2",
        "pX3",
        "pX4",
        "pX5",
        "pX6",
        "pX7",
        "pX8",
        "pX9",
        "pX10",
        "pX11",
        "pMMin",
        "pMMax",
        "guideMMin",
        "guideMMax",
        "segAcotacion"
      ],
      "objectStates": {
        "segAcotacion": {
          "emphasis": "primary"
        },
        "pMMin": {
          "emphasis": "primary"
        },
        "pMMax": {
          "emphasis": "primary"
        },
        "realLine": {
          "emphasis": "none"
        }
      }
    },
    {
      "id": "step-conjunto-supremo",
      "label": "Conjunto S y existencia del supremo L",
      "description": "S, el conjunto de cotas inferiores eventuales, contiene a m y está acotado superiormente por M; contiene además todo punto a la izquierda de m. Por el axioma del supremo existe L = sup(S) en ℝ.",
      "durationMs": 1200,
      "visibleTargets": [
        "realLine",
        "pX1",
        "pX2",
        "pX3",
        "pX4",
        "pX5",
        "pX6",
        "pX7",
        "pX8",
        "pX9",
        "pX10",
        "pX11",
        "pMMin",
        "pMMax",
        "guideMMin",
        "guideMMax",
        "segAcotacion",
        "pL",
        "guideL",
        "segS"
      ],
      "objectStates": {
        "segS": {
          "emphasis": "primary"
        },
        "pL": {
          "emphasis": "primary"
        },
        "pMMin": {
          "emphasis": "secondary"
        },
        "segAcotacion": {
          "emphasis": "none"
        }
      }
    },
    {
      "id": "step-convergencia",
      "label": "Convergencia al límite L",
      "description": "Dado ε > 0 (arrástralo), el índice N se recalcula con los términos dibujados: todos los términos con n ≥ N caen en la banda x_N ± ε/2. Entonces x_N − ε/2 ∈ S, de modo que x_N − ε/2 ≤ L, y x_N + ε/2 es cota superior de S, de modo que L ≤ x_N + ε/2. Por tanto |x_N − L| ≤ ε/2 y los términos con n ≥ N están en (L − ε, L + ε).",
      "durationMs": 1200,
      "visibleTargets": [
        "realLine",
        "pX1",
        "pX2",
        "pX3",
        "pX4",
        "pX5",
        "pX6",
        "pX7",
        "pX8",
        "pX9",
        "pX10",
        "pX11",
        "pMMin",
        "pMMax",
        "guideMMin",
        "guideMMax",
        "segAcotacion",
        "pL",
        "guideL",
        "segS",
        "pEpsMinus",
        "pEpsPlus",
        "guideEpsMinus",
        "guideEpsPlus",
        "segEpsilon",
        "lineN",
        "pN",
        "pHalfMinus",
        "pHalfPlus",
        "segHalf",
        "pXN",
        "eps"
      ],
      "objectStates": {
        "segEpsilon": {
          "emphasis": "primary"
        },
        "pEpsMinus": {
          "emphasis": "primary"
        },
        "pEpsPlus": {
          "emphasis": "primary"
        },
        "pL": {
          "emphasis": "primary"
        },
        "segHalf": {
          "emphasis": "primary"
        },
        "pHalfMinus": {
          "emphasis": "primary"
        },
        "pHalfPlus": {
          "emphasis": "primary"
        },
        "pXN": {
          "emphasis": "primary"
        },
        "eps": {
          "value": 1.2
        }
      }
    }
  ],
  "note": "Avanza por los pasos de la demostración para ver cómo se añaden los niveles m y M, el supremo L y la banda x_N ± ε/2. En el último paso puedes arrastrar ε; la figura ilustra con 11 términos, la prueba no depende de ellos.",
  "translations": {
    "eu": {
      "title": "Frogapena: Zenbaki errealen osotasun metrikoa",
      "note": "Egin aurrera frogapenaren urratsetan m eta M mailak, L gorena eta x_N ± ε/2 banda nola gehitzen diren ikusteko. Azken urratsean ε arrastatu dezakezu; irudiak 11 gai erakusten ditu, frogak ez du haietan oinarritzen.",
      "steps": {
        "step-sucesion-cauchy": {
          "label": "Cauchyren segidaren gaiak",
          "description": "Cauchyren segida baten x₁, x₂, … gaiak, (n, xₙ) puntu gisa marraztuta ardatz erreal bertikalean: indize jakin batetik aurrera, gero eta zerrenda estuago batean dabiltza."
        },
        "step-acotacion": {
          "label": "Bornapena [m, M] tartean",
          "description": "ε = 1 hartuta, n ≥ N₀ duten gaiak x_N₀-tik 1 baino gutxiagora daude; aurreko gai finituekin batera, guztiak m eta M mailen artean daude, zerrenda horren minimoa eta maximoa izanik."
        },
        "step-conjunto-supremo": {
          "label": "S multzoa eta L gorenaren existentzia",
          "description": "Balizko behe-borneen S multzoak m barne hartzen du eta M-k goitik bornatzen du; gainera, m-ren ezkerreko puntu oro dauka. Gorenenaren axiomagatik, badago L = sup(S) ℝ-n."
        },
        "step-convergencia": {
          "label": "L mugarekiko konbergentzia",
          "description": "Edozein ε > 0 emanda (arrastatu), N indizea marraztutako gaiekin birkalkulatzen da: n ≥ N duten gai guztiak x_N ± ε/2 bandan daude. Beraz x_N − ε/2 ∈ S, eta x_N − ε/2 ≤ L; x_N + ε/2 S-ren goiko borne bat da, eta L ≤ x_N + ε/2. Hortaz |x_N − L| ≤ ε/2 eta n ≥ N duten gaiak (L − ε, L + ε) ingurunean daude."
        }
      },
      "ariaLabels": {
        "realLine": "Ardatz erreala (bertikala)",
        "pMMin": "m behe-borne orokorra",
        "pMMax": "M goiko borne orokorra",
        "segAcotacion": "[m, M] bornapen-tarte itxia",
        "pL": "L muga eta gorena",
        "segS": "Balizko behe-borneen S multzoa",
        "pEpsMinus": "Epsilon ingurunearen beheko muturra",
        "pEpsPlus": "Epsilon ingurunearen goiko muturra",
        "segEpsilon": "L mugaren (L − ε, L + ε) ingurunea",
        "pX1": "Segidaren x₁ gaia",
        "pX2": "Segidaren x₂ gaia",
        "pX3": "Segidaren x₃ gaia",
        "pX4": "Segidaren x₄ gaia",
        "pX5": "Segidaren x₅ gaia",
        "pX6": "Segidaren x₆ gaia",
        "pX7": "Segidaren x₇ gaia",
        "guideMMin": "m mailaren lerroa",
        "guideMMax": "M mailaren lerroa",
        "guideL": "L mailaren lerroa",
        "guideEpsMinus": "L − ε mailaren lerroa",
        "guideEpsPlus": "L + ε mailaren lerroa",
        "lineN": "N indizea, handik aurrera Cauchyren baldintza betetzen da",
        "pN": "N indizea",
        "eps": "ε labaina",
        "pX8": "Segidaren x8 gaia",
        "pX9": "Segidaren x9 gaia",
        "pX10": "Segidaren x10 gaia",
        "pX11": "Segidaren x11 gaia",
        "sucesionCauchy": "Cauchyren segidaren gaien multzoa"
      }
    },
    "en": {
      "title": "Proof: Metric Completeness of the Real Numbers",
      "note": "Advance through the proof steps to see how the levels m and M, the supremum L and the band x_N ± ε/2 are added in turn. In the last step you can drag ε; the figure illustrates 11 terms, the proof does not depend on them.",
      "steps": {
        "step-sucesion-cauchy": {
          "label": "Terms of the Cauchy sequence",
          "description": "The terms x₁, x₂, … of a Cauchy sequence in ℝ, drawn as points (n, xₙ) next to the vertical real axis: from some index on they oscillate within an ever narrower strip."
        },
        "step-acotacion": {
          "label": "Boundedness within [m, M]",
          "description": "With ε = 1, the terms with n ≥ N₀ lie within distance 1 of x_N₀; together with the finitely many earlier terms, all lie between the levels m and M, the minimum and maximum of that list."
        },
        "step-conjunto-supremo": {
          "label": "Set S and existence of the supremum L",
          "description": "The set S of eventual lower bounds contains m and is bounded above by M; it also contains every point to the left of m. By the axiom of the supremum, L = sup(S) exists in ℝ."
        },
        "step-convergencia": {
          "label": "Convergence to the limit L",
          "description": "Given ε > 0 (drag it), the index N is recomputed from the plotted terms: all terms with n ≥ N lie in the band x_N ± ε/2. Hence x_N − ε/2 ∈ S, so x_N − ε/2 ≤ L, and x_N + ε/2 is an upper bound of S, so L ≤ x_N + ε/2. Thus |x_N − L| ≤ ε/2 and the terms with n ≥ N lie in (L − ε, L + ε)."
        }
      },
      "ariaLabels": {
        "realLine": "Real axis (vertical)",
        "pMMin": "Global lower bound m",
        "pMMax": "Global upper bound M",
        "segAcotacion": "Closed bounding interval [m, M]",
        "pL": "Limit and supremum L",
        "segS": "Set S of eventual lower bounds",
        "pEpsMinus": "Lower end of the epsilon neighborhood",
        "pEpsPlus": "Upper end of the epsilon neighborhood",
        "segEpsilon": "Neighborhood (L − ε, L + ε) of the limit L",
        "pX1": "Term x₁ of the sequence",
        "pX2": "Term x₂ of the sequence",
        "pX3": "Term x₃ of the sequence",
        "pX4": "Term x₄ of the sequence",
        "pX5": "Term x₅ of the sequence",
        "pX6": "Term x₆ of the sequence",
        "pX7": "Term x₇ of the sequence",
        "guideMMin": "Level line of m",
        "guideMMax": "Level line of M",
        "guideL": "Level line of L",
        "guideEpsMinus": "Level line of L − ε",
        "guideEpsPlus": "Level line of L + ε",
        "lineN": "Index N, from which the Cauchy condition holds",
        "pN": "Index N",
        "eps": "Slider for ε",
        "pX8": "Term x8 of the sequence",
        "pX9": "Term x9 of the sequence",
        "pX10": "Term x10 of the sequence",
        "pX11": "Term x11 of the sequence",
        "sucesionCauchy": "Set of terms of the Cauchy sequence"
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const DemoCompletitudReales = () => <DiagramRenderer spec={DemoCompletitudRealesSpec} />;
