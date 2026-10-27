import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const AsociatividadArbolSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Asociatividad: mover el paréntesis",
  "componentId": "asociatividad-arbol",
  "category": "Definiciones",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "showLabels": true,
  "viewport": {
    "bounds": [
      -3.75,
      1.45,
      4.45,
      -2.5
    ],
    "home": [
      -3.75,
      1.45,
      4.45,
      -2.5
    ],
    "minZoom": 0.6,
    "maxZoom": 3,
    "padding": 0.06
  },
  "layers": [
    {
      "id": "helpers",
      "label": "Construcción",
      "order": 0,
      "visible": true,
      "locked": false
    },
    {
      "id": "tree",
      "label": "Árbol y paréntesis",
      "order": 1,
      "visible": true,
      "locked": false
    },
    {
      "id": "controls",
      "label": "Operandos y operación",
      "order": 2,
      "visible": true,
      "locked": false
    },
    {
      "id": "annotations",
      "label": "Valores y estado",
      "order": 3,
      "visible": true,
      "locked": false
    }
  ],
  "groups": [
    {
      "id": "grupoParentesis",
      "label": "Paréntesis",
      "memberIds": [
        "parenAbre",
        "parenCierra"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Resaltar el paréntesis",
        "role": "secondary"
      },
      "target": true,
      "targetId": "parentesis",
      "color": "ocre"
    },
    {
      "id": "grupoIzquierda",
      "label": "Agrupación (a * b) * c",
      "memberIds": [
        "anilloNudoIzq",
        "anilloRaizIzq",
        "valorNudoIzq",
        "valorRaizIzq"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Resaltar la agrupación (a ∗ b) ∗ c",
        "role": "secondary"
      },
      "target": true,
      "targetId": "agrupacionIzquierda",
      "color": "mora"
    },
    {
      "id": "grupoDerecha",
      "label": "Agrupación a * (b * c)",
      "memberIds": [
        "anilloNudoDer",
        "anilloRaizDer",
        "valorNudoDer",
        "valorRaizDer"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Resaltar la agrupación a ∗ (b ∗ c)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "agrupacionDerecha",
      "color": "pavo"
    }
  ],
  "objects": [
    {
      "id": "raiz",
      "label": "raiz",
      "color": "carbon",
      "layerId": "helpers",
      "order": 0,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -0.6,
        "y": 0.95
      },
      "mobility": {
        "type": "fixed"
      }
    },
    {
      "id": "topeA",
      "label": "topeA",
      "color": "carbon",
      "layerId": "helpers",
      "order": 1,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3,
        "y": -0.53
      },
      "mobility": {
        "type": "fixed"
      }
    },
    {
      "id": "topeB",
      "label": "topeB",
      "color": "carbon",
      "layerId": "helpers",
      "order": 2,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -0.6,
        "y": -0.53
      },
      "mobility": {
        "type": "fixed"
      }
    },
    {
      "id": "topeC",
      "label": "topeC",
      "color": "carbon",
      "layerId": "helpers",
      "order": 3,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 1.8,
        "y": -0.53
      },
      "mobility": {
        "type": "fixed"
      }
    },
    {
      "id": "nudo",
      "label": "nudo",
      "color": "carbon",
      "layerId": "helpers",
      "order": 4,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-1.8 + 2.4*mover",
        "y": "0.05",
        "fallback": [
          -1.8,
          0.05
        ]
      },
      "mobility": {
        "type": "fixed"
      }
    },
    {
      "id": "ab",
      "label": "ab",
      "color": "carbon",
      "layerId": "helpers",
      "order": 5,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "eq(operacion,0)*((hojaA)+(hojaB))+eq(operacion,1)*(hojaA)*(hojaB)+eq(operacion,2)*((hojaA)-(hojaB))",
        "y": "eq(operacion,0)*((hojaB)+(hojaC))+eq(operacion,1)*(hojaB)*(hojaC)+eq(operacion,2)*((hojaB)-(hojaC))",
        "fallback": [
          12,
          6
        ]
      },
      "mobility": {
        "type": "fixed"
      }
    },
    {
      "id": "resultado",
      "label": "resultado",
      "color": "carbon",
      "layerId": "helpers",
      "order": 6,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "eq(operacion,0)*((ab.x)+(hojaC))+eq(operacion,1)*(ab.x)*(hojaC)+eq(operacion,2)*((ab.x)-(hojaC))",
        "y": "eq(operacion,0)*((hojaA)+(ab.y))+eq(operacion,1)*(hojaA)*(ab.y)+eq(operacion,2)*((hojaA)-(ab.y))",
        "fallback": [
          2,
          6
        ]
      },
      "mobility": {
        "type": "fixed"
      }
    },
    {
      "id": "enganchaA",
      "label": "enganchaA",
      "color": "carbon",
      "layerId": "helpers",
      "order": 7,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "nudo.x + (-0.6 - nudo.x)*mover",
        "y": "nudo.y + (0.95 - nudo.y)*mover",
        "fallback": [
          -1.8,
          0.05
        ]
      },
      "mobility": {
        "type": "fixed"
      }
    },
    {
      "id": "enganchaC",
      "label": "enganchaC",
      "color": "carbon",
      "layerId": "helpers",
      "order": 8,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-0.6 + (nudo.x - -0.6)*mover",
        "y": "0.95 + (nudo.y - 0.95)*mover",
        "fallback": [
          -0.6,
          0.95
        ]
      },
      "mobility": {
        "type": "fixed"
      }
    },
    {
      "id": "aristaAP",
      "label": "aristaAP",
      "color": "carbon",
      "layerId": "helpers",
      "order": 9,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "topeA.x + 0*(enganchaA.x - topeA.x)/max(0.001, hypot((enganchaA.x - topeA.x), (enganchaA.y - topeA.y)))",
        "y": "topeA.y + 0*(enganchaA.y - topeA.y)/max(0.001, hypot((enganchaA.x - topeA.x), (enganchaA.y - topeA.y)))",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      }
    },
    {
      "id": "aristaAQ",
      "label": "aristaAQ",
      "color": "carbon",
      "layerId": "helpers",
      "order": 10,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "enganchaA.x - 0.18*max(lt(mover,0.001),gt(mover,0.999))*(enganchaA.x - topeA.x)/max(0.001, hypot((enganchaA.x - topeA.x), (enganchaA.y - topeA.y)))",
        "y": "enganchaA.y - 0.18*max(lt(mover,0.001),gt(mover,0.999))*(enganchaA.y - topeA.y)/max(0.001, hypot((enganchaA.x - topeA.x), (enganchaA.y - topeA.y)))",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      }
    },
    {
      "id": "aristaA",
      "label": "Arista de a",
      "color": "carbon",
      "layerId": "tree",
      "order": 11,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "aristaAP",
          "aristaAQ"
        ]
      },
      "appearance": {
        "labelVisible": false,
        "preserveColorOnHighlight": true,
        "strokeWidth": 1.6,
        "strokeOpacity": 0.85
      }
    },
    {
      "id": "aristaBP",
      "label": "aristaBP",
      "color": "carbon",
      "layerId": "helpers",
      "order": 12,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "topeB.x + 0*(nudo.x - topeB.x)/max(0.001, hypot((nudo.x - topeB.x), (nudo.y - topeB.y)))",
        "y": "topeB.y + 0*(nudo.y - topeB.y)/max(0.001, hypot((nudo.x - topeB.x), (nudo.y - topeB.y)))",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      }
    },
    {
      "id": "aristaBQ",
      "label": "aristaBQ",
      "color": "carbon",
      "layerId": "helpers",
      "order": 13,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "nudo.x - 0.18*(nudo.x - topeB.x)/max(0.001, hypot((nudo.x - topeB.x), (nudo.y - topeB.y)))",
        "y": "nudo.y - 0.18*(nudo.y - topeB.y)/max(0.001, hypot((nudo.x - topeB.x), (nudo.y - topeB.y)))",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      }
    },
    {
      "id": "aristaB",
      "label": "Arista de b",
      "color": "carbon",
      "layerId": "tree",
      "order": 14,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "aristaBP",
          "aristaBQ"
        ]
      },
      "appearance": {
        "labelVisible": false,
        "preserveColorOnHighlight": true,
        "strokeWidth": 1.6,
        "strokeOpacity": 0.85
      }
    },
    {
      "id": "aristaCP",
      "label": "aristaCP",
      "color": "carbon",
      "layerId": "helpers",
      "order": 15,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "topeC.x + 0*(enganchaC.x - topeC.x)/max(0.001, hypot((enganchaC.x - topeC.x), (enganchaC.y - topeC.y)))",
        "y": "topeC.y + 0*(enganchaC.y - topeC.y)/max(0.001, hypot((enganchaC.x - topeC.x), (enganchaC.y - topeC.y)))",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      }
    },
    {
      "id": "aristaCQ",
      "label": "aristaCQ",
      "color": "carbon",
      "layerId": "helpers",
      "order": 16,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "enganchaC.x - 0.18*max(lt(mover,0.001),gt(mover,0.999))*(enganchaC.x - topeC.x)/max(0.001, hypot((enganchaC.x - topeC.x), (enganchaC.y - topeC.y)))",
        "y": "enganchaC.y - 0.18*max(lt(mover,0.001),gt(mover,0.999))*(enganchaC.y - topeC.y)/max(0.001, hypot((enganchaC.x - topeC.x), (enganchaC.y - topeC.y)))",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      }
    },
    {
      "id": "aristaC",
      "label": "Arista de c",
      "color": "carbon",
      "layerId": "tree",
      "order": 17,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "aristaCP",
          "aristaCQ"
        ]
      },
      "appearance": {
        "labelVisible": false,
        "preserveColorOnHighlight": true,
        "strokeWidth": 1.6,
        "strokeOpacity": 0.85
      }
    },
    {
      "id": "aristaNudoP",
      "label": "aristaNudoP",
      "color": "carbon",
      "layerId": "helpers",
      "order": 18,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "nudo.x + 0.18*(raiz.x - nudo.x)/max(0.001, hypot((raiz.x - nudo.x), (raiz.y - nudo.y)))",
        "y": "nudo.y + 0.18*(raiz.y - nudo.y)/max(0.001, hypot((raiz.x - nudo.x), (raiz.y - nudo.y)))",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      }
    },
    {
      "id": "aristaNudoQ",
      "label": "aristaNudoQ",
      "color": "carbon",
      "layerId": "helpers",
      "order": 19,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "raiz.x - 0.18*(raiz.x - nudo.x)/max(0.001, hypot((raiz.x - nudo.x), (raiz.y - nudo.y)))",
        "y": "raiz.y - 0.18*(raiz.y - nudo.y)/max(0.001, hypot((raiz.x - nudo.x), (raiz.y - nudo.y)))",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      }
    },
    {
      "id": "aristaNudo",
      "label": "Arista del nudo a la raíz",
      "color": "carbon",
      "layerId": "tree",
      "order": 20,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "aristaNudoP",
          "aristaNudoQ"
        ]
      },
      "appearance": {
        "labelVisible": false,
        "preserveColorOnHighlight": true,
        "strokeWidth": 1.6,
        "strokeOpacity": 0.85
      }
    },
    {
      "id": "bordeNudo",
      "label": "bordeNudo",
      "color": "carbon",
      "layerId": "helpers",
      "order": 21,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "nudo.x + 0.18",
        "y": "nudo.y",
        "fallback": [
          -1.62,
          0.05
        ]
      },
      "mobility": {
        "type": "fixed"
      }
    },
    {
      "id": "bordeRaiz",
      "label": "bordeRaiz",
      "color": "carbon",
      "layerId": "helpers",
      "order": 22,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -0.42,
        "y": 0.95
      },
      "mobility": {
        "type": "fixed"
      }
    },
    {
      "id": "anilloNudoIzq",
      "label": "Nudo a * b",
      "color": "mora",
      "layerId": "tree",
      "order": 23,
      "visible": true,
      "locked": false,
      "groupIds": [
        "grupoIzquierda"
      ],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "visibleWhen": "lt(mover, 0.5)",
      "objectType": "path",
      "geometry": {
        "type": "circle",
        "center": "nudo",
        "point": "bordeNudo"
      },
      "appearance": {
        "strokeWidth": 1.8,
        "fillOpacity": 0.35,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "anilloNudoDer",
      "label": "Nudo b * c",
      "color": "pavo",
      "layerId": "tree",
      "order": 24,
      "visible": true,
      "locked": false,
      "groupIds": [
        "grupoDerecha"
      ],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "visibleWhen": "gte(mover, 0.5)",
      "objectType": "path",
      "geometry": {
        "type": "circle",
        "center": "nudo",
        "point": "bordeNudo"
      },
      "appearance": {
        "strokeWidth": 1.8,
        "fillOpacity": 0.35,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "anilloRaizIzq",
      "label": "Raíz (a * b) * c",
      "color": "mora",
      "layerId": "tree",
      "order": 25,
      "visible": true,
      "locked": false,
      "groupIds": [
        "grupoIzquierda"
      ],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "visibleWhen": "lt(mover, 0.5)",
      "objectType": "path",
      "geometry": {
        "type": "circle",
        "center": "raiz",
        "point": "bordeRaiz"
      },
      "appearance": {
        "strokeWidth": 1.8,
        "fillOpacity": 0.35,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "anilloRaizDer",
      "label": "Raíz a * (b * c)",
      "color": "pavo",
      "layerId": "tree",
      "order": 26,
      "visible": true,
      "locked": false,
      "groupIds": [
        "grupoDerecha"
      ],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "visibleWhen": "gte(mover, 0.5)",
      "objectType": "path",
      "geometry": {
        "type": "circle",
        "center": "raiz",
        "point": "bordeRaiz"
      },
      "appearance": {
        "strokeWidth": 1.8,
        "fillOpacity": 0.35,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "valorNudoIzq",
      "label": "Valor de a * b",
      "color": "mora",
      "layerId": "annotations",
      "order": 27,
      "visible": true,
      "locked": false,
      "groupIds": [
        "grupoIzquierda"
      ],
      "selection": {
        "selectable": false,
        "role": "construction",
        "ariaLabel": "Valor de a ∗ b"
      },
      "target": false,
      "visibleWhen": "lt(mover, 0.02)",
      "objectType": "annotation",
      "variant": "label",
      "content": {
        "text": "${=ab.x|precision:0}$"
      },
      "anchor": {
        "type": "object",
        "object": "nudo",
        "offset": [
          0.27,
          0.02
        ]
      },
      "appearance": {
        "fontSize": 22,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "valorNudoDer",
      "label": "Valor de b * c",
      "color": "pavo",
      "layerId": "annotations",
      "order": 28,
      "visible": true,
      "locked": false,
      "groupIds": [
        "grupoDerecha"
      ],
      "selection": {
        "selectable": false,
        "role": "construction",
        "ariaLabel": "Valor de b ∗ c"
      },
      "target": false,
      "visibleWhen": "gt(mover, 0.98)",
      "objectType": "annotation",
      "variant": "label",
      "content": {
        "text": "${=ab.y|precision:0}$"
      },
      "anchor": {
        "type": "object",
        "object": "nudo",
        "offset": [
          0.27,
          0.02
        ]
      },
      "appearance": {
        "fontSize": 22,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "valorRaizIzq",
      "label": "Valor de (a * b) * c",
      "color": "mora",
      "layerId": "annotations",
      "order": 29,
      "visible": true,
      "locked": false,
      "groupIds": [
        "grupoIzquierda"
      ],
      "selection": {
        "selectable": false,
        "role": "construction",
        "ariaLabel": "Valor de (a ∗ b) ∗ c"
      },
      "target": false,
      "visibleWhen": "lt(mover, 0.02)",
      "objectType": "annotation",
      "variant": "label",
      "content": {
        "text": "${=resultado.x|precision:0}$"
      },
      "anchor": {
        "type": "object",
        "object": "raiz",
        "offset": [
          0.27,
          0.02
        ]
      },
      "appearance": {
        "fontSize": 22,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "valorRaizDer",
      "label": "Valor de a * (b * c)",
      "color": "pavo",
      "layerId": "annotations",
      "order": 30,
      "visible": true,
      "locked": false,
      "groupIds": [
        "grupoDerecha"
      ],
      "selection": {
        "selectable": false,
        "role": "construction",
        "ariaLabel": "Valor de a ∗ (b ∗ c)"
      },
      "target": false,
      "visibleWhen": "gt(mover, 0.98)",
      "objectType": "annotation",
      "variant": "label",
      "content": {
        "text": "${=resultado.y|precision:0}$"
      },
      "anchor": {
        "type": "object",
        "object": "raiz",
        "offset": [
          0.27,
          0.02
        ]
      },
      "appearance": {
        "fontSize": 22,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "hojaA",
      "label": "Operando $a$",
      "color": "terracota",
      "layerId": "controls",
      "order": 31,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "primary",
        "ariaLabel": "Operando a: pulsa para cambiar su valor"
      },
      "target": false,
      "objectType": "control",
      "variant": "button",
      "position": [
        -3,
        -0.9
      ],
      "range": {
        "min": 1,
        "max": 9,
        "step": 1
      },
      "value": 8,
      "width": 0.66,
      "action": {
        "to": 9,
        "durationMs": 0,
        "easing": "linear",
        "behavior": "cycle",
        "valueLabels": [
          "$1$",
          "$2$",
          "$3$",
          "$4$",
          "$5$",
          "$6$",
          "$7$",
          "$8$",
          "$9$"
        ]
      }
    },
    {
      "id": "hojaB",
      "label": "Operando $b$",
      "color": "terracota",
      "layerId": "controls",
      "order": 32,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "primary",
        "ariaLabel": "Operando b: pulsa para cambiar su valor"
      },
      "target": false,
      "objectType": "control",
      "variant": "button",
      "position": [
        -0.6,
        -0.9
      ],
      "range": {
        "min": 1,
        "max": 9,
        "step": 1
      },
      "value": 4,
      "width": 0.66,
      "action": {
        "to": 9,
        "durationMs": 0,
        "easing": "linear",
        "behavior": "cycle",
        "valueLabels": [
          "$1$",
          "$2$",
          "$3$",
          "$4$",
          "$5$",
          "$6$",
          "$7$",
          "$8$",
          "$9$"
        ]
      }
    },
    {
      "id": "hojaC",
      "label": "Operando $c$",
      "color": "terracota",
      "layerId": "controls",
      "order": 33,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "primary",
        "ariaLabel": "Operando c: pulsa para cambiar su valor"
      },
      "target": false,
      "objectType": "control",
      "variant": "button",
      "position": [
        1.8,
        -0.9
      ],
      "range": {
        "min": 1,
        "max": 9,
        "step": 1
      },
      "value": 2,
      "width": 0.66,
      "action": {
        "to": 9,
        "durationMs": 0,
        "easing": "linear",
        "behavior": "cycle",
        "valueLabels": [
          "$1$",
          "$2$",
          "$3$",
          "$4$",
          "$5$",
          "$6$",
          "$7$",
          "$8$",
          "$9$"
        ]
      }
    },
    {
      "id": "anclasignoIzq",
      "label": "anclasignoIzq",
      "color": "carbon",
      "layerId": "helpers",
      "order": 34,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -1.96,
        "y": -0.9
      },
      "mobility": {
        "type": "fixed"
      }
    },
    {
      "id": "signoIzq",
      "label": "Signo de la operación",
      "color": "carbon",
      "layerId": "annotations",
      "order": 35,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction",
        "ariaLabel": "Signo de la operación"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "label",
      "content": {
        "text": "$*$",
        "rules": [
          {
            "when": "eq(operacion, 0)",
            "text": "$+$"
          },
          {
            "when": "eq(operacion, 1)",
            "text": "$\\times$"
          },
          {
            "when": "eq(operacion, 2)",
            "text": "$-$"
          }
        ]
      },
      "anchor": {
        "type": "object",
        "object": "anclasignoIzq",
        "offset": [
          0,
          0
        ]
      },
      "appearance": {
        "fontSize": 24,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "anclasignoDer",
      "label": "anclasignoDer",
      "color": "carbon",
      "layerId": "helpers",
      "order": 36,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0.44000000000000006,
        "y": -0.9
      },
      "mobility": {
        "type": "fixed"
      }
    },
    {
      "id": "signoDer",
      "label": "Signo de la operación",
      "color": "carbon",
      "layerId": "annotations",
      "order": 37,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction",
        "ariaLabel": "Signo de la operación"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "label",
      "content": {
        "text": "$*$",
        "rules": [
          {
            "when": "eq(operacion, 0)",
            "text": "$+$"
          },
          {
            "when": "eq(operacion, 1)",
            "text": "$\\times$"
          },
          {
            "when": "eq(operacion, 2)",
            "text": "$-$"
          }
        ]
      },
      "anchor": {
        "type": "object",
        "object": "anclasignoDer",
        "offset": [
          0,
          0
        ]
      },
      "appearance": {
        "fontSize": 24,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "parenAbre",
      "label": "Paréntesis que abre",
      "color": "ocre",
      "layerId": "tree",
      "order": 38,
      "visible": true,
      "locked": false,
      "groupIds": [
        "grupoParentesis"
      ],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "parametric",
        "parameter": "t",
        "domain": [
          -1,
          1
        ],
        "samples": 24,
        "x": "-3.52 + 2.4*mover + 0.13*t*t",
        "y": "-0.9 + 0.46*t"
      },
      "appearance": {
        "strokeWidth": 2.4,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "parenCierra",
      "label": "Paréntesis que cierra",
      "color": "ocre",
      "layerId": "tree",
      "order": 39,
      "visible": true,
      "locked": false,
      "groupIds": [
        "grupoParentesis"
      ],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "parametric",
        "parameter": "t",
        "domain": [
          -1,
          1
        ],
        "samples": 24,
        "x": "-0.07999999999999996 + 2.4*mover - 0.13*t*t",
        "y": "-0.9 + 0.46*t"
      },
      "appearance": {
        "strokeWidth": 2.4,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "mover",
      "label": "Mover el paréntesis",
      "color": "ocre",
      "layerId": "controls",
      "order": 40,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "primary",
        "ariaLabel": "Mover el paréntesis de a y b a b y c, o devolverlo"
      },
      "target": false,
      "objectType": "control",
      "variant": "button",
      "position": [
        -1.9,
        -1.95
      ],
      "range": {
        "min": 0,
        "max": 1,
        "step": 0.01
      },
      "value": 0,
      "action": {
        "to": 1,
        "durationMs": 1100,
        "easing": "ease-in-out",
        "behavior": "toggle"
      }
    },
    {
      "id": "anclaOperacion",
      "label": "anclaOperacion",
      "color": "carbon",
      "layerId": "helpers",
      "order": 41,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.45,
        "y": 0.95
      },
      "mobility": {
        "type": "fixed"
      }
    },
    {
      "id": "rotuloOperacion",
      "label": "Operación",
      "color": "carbon",
      "layerId": "annotations",
      "order": 42,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction",
        "ariaLabel": "Operación"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "label",
      "content": {
        "text": "$* =$"
      },
      "anchor": {
        "type": "object",
        "object": "anclaOperacion",
        "offset": [
          0,
          0
        ]
      },
      "appearance": {
        "fontSize": 22,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "operacion",
      "label": "Operación",
      "color": "terracota",
      "layerId": "controls",
      "order": 43,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "primary",
        "ariaLabel": "Operación: pulsa para pasar de la suma al producto y a la resta"
      },
      "target": false,
      "objectType": "control",
      "variant": "button",
      "position": [
        3.95,
        0.95
      ],
      "range": {
        "min": 0,
        "max": 2,
        "step": 1
      },
      "value": 2,
      "width": 0.66,
      "action": {
        "to": 2,
        "durationMs": 0,
        "easing": "linear",
        "behavior": "cycle",
        "valueLabels": [
          "$+$",
          "$\\times$",
          "$-$"
        ]
      }
    },
    {
      "id": "estadoIguales",
      "label": "Estado: las dos agrupaciones coinciden",
      "color": "carbon",
      "layerId": "annotations",
      "order": 44,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "annotation",
        "ariaLabel": "Estado: las dos agrupaciones coinciden"
      },
      "target": false,
      "visibleWhen": "approx(resultado.x, resultado.y, 0.01)",
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "",
        "blocks": [
          {
            "id": "estado",
            "text": "Las dos agrupaciones dan ${=resultado.x|precision:0}$.",
            "color": "musgo"
          }
        ]
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.5,
          0
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "estadoDistintos",
      "label": "Estado: las dos agrupaciones difieren",
      "color": "carbon",
      "layerId": "annotations",
      "order": 45,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "annotation",
        "ariaLabel": "Estado: las dos agrupaciones difieren"
      },
      "target": false,
      "visibleWhen": "not(approx(resultado.x, resultado.y, 0.01))",
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "",
        "blocks": [
          {
            "id": "estado",
            "text": "${=resultado.x|precision:0} \\neq {=resultado.y|precision:0}$: esta operación no es asociativa.",
            "color": "granada"
          }
        ]
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.5,
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
  "note": "Pulsa «Mover el paréntesis»; toca las cifras o la operación para cambiarlas.",
  "translations": {
    "eu": {
      "title": "Elkartze-propietatea: parentesia mugitu",
      "note": "Sakatu «Parentesia mugitu»; ukitu zifrak edo eragiketa aldatzeko.",
      "labels": {
        "mover": "Parentesia mugitu",
        "hojaA": "$a$ eragigaia",
        "hojaB": "$b$ eragigaia",
        "hojaC": "$c$ eragigaia",
        "operacion": "Eragiketa",
        "aristaA": "a-ren ertza",
        "aristaB": "b-ren ertza",
        "aristaC": "c-ren ertza",
        "aristaNudo": "Korapilotik errora",
        "anilloNudoIzq": "a * b korapiloa",
        "anilloNudoDer": "b * c korapiloa",
        "anilloRaizIzq": "(a * b) * c erroa",
        "anilloRaizDer": "a * (b * c) erroa",
        "valorNudoIzq": "a * b-ren balioa",
        "valorNudoDer": "b * c-ren balioa",
        "valorRaizIzq": "(a * b) * c-ren balioa",
        "valorRaizDer": "a * (b * c)-ren balioa",
        "signoIzq": "Eragiketaren ikurra",
        "signoDer": "Eragiketaren ikurra",
        "parenAbre": "Parentesi irekia",
        "parenCierra": "Parentesi itxia"
      },
      "blocks": {
        "estadoIguales": {
          "estado": {
            "text": "Bi elkarketek ${=resultado.x|precision:0}$ ematen dute."
          }
        },
        "estadoDistintos": {
          "estado": {
            "text": "${=resultado.x|precision:0} \\neq {=resultado.y|precision:0}$: eragiketa hau ez da elkarkorra."
          }
        }
      },
      "ariaLabels": {
        "mover": "Parentesia a eta b-tik b eta c-ra mugitu, edo itzuli",
        "hojaA": "a eragigaia: sakatu balioa aldatzeko",
        "hojaB": "b eragigaia: sakatu balioa aldatzeko",
        "hojaC": "c eragigaia: sakatu balioa aldatzeko",
        "operacion": "Eragiketa: sakatu batuketatik biderketara eta kenketara pasatzeko",
        "rotuloOperacion": "Eragiketa",
        "signoIzq": "Eragiketaren ikurra",
        "signoDer": "Eragiketaren ikurra",
        "valorNudoIzq": "a ∗ b-ren balioa",
        "valorNudoDer": "b ∗ c-ren balioa",
        "valorRaizIzq": "(a ∗ b) ∗ c-ren balioa",
        "valorRaizDer": "a ∗ (b ∗ c)-ren balioa",
        "estadoIguales": "Egoera: bi elkarketak bat datoz",
        "estadoDistintos": "Egoera: bi elkarketak desberdinak dira",
        "grupoParentesis": "Parentesia nabarmendu",
        "grupoIzquierda": "(a ∗ b) ∗ c elkarketa nabarmendu",
        "grupoDerecha": "a ∗ (b ∗ c) elkarketa nabarmendu"
      }
    },
    "en": {
      "title": "Associativity: moving the parentheses",
      "note": "Press «Move the parentheses»; tap the digits or the operation to change them.",
      "labels": {
        "mover": "Move the parentheses",
        "hojaA": "Operand $a$",
        "hojaB": "Operand $b$",
        "hojaC": "Operand $c$",
        "operacion": "Operation",
        "aristaA": "Edge of a",
        "aristaB": "Edge of b",
        "aristaC": "Edge of c",
        "aristaNudo": "Edge from the node to the root",
        "anilloNudoIzq": "Node a * b",
        "anilloNudoDer": "Node b * c",
        "anilloRaizIzq": "Root (a * b) * c",
        "anilloRaizDer": "Root a * (b * c)",
        "valorNudoIzq": "Value of a * b",
        "valorNudoDer": "Value of b * c",
        "valorRaizIzq": "Value of (a * b) * c",
        "valorRaizDer": "Value of a * (b * c)",
        "signoIzq": "Sign of the operation",
        "signoDer": "Sign of the operation",
        "parenAbre": "Opening parenthesis",
        "parenCierra": "Closing parenthesis"
      },
      "blocks": {
        "estadoIguales": {
          "estado": {
            "text": "Both groupings give ${=resultado.x|precision:0}$."
          }
        },
        "estadoDistintos": {
          "estado": {
            "text": "${=resultado.x|precision:0} \\neq {=resultado.y|precision:0}$: this operation is not associative."
          }
        }
      },
      "ariaLabels": {
        "mover": "Move the parentheses from a and b to b and c, or back",
        "hojaA": "Operand a: press to change its value",
        "hojaB": "Operand b: press to change its value",
        "hojaC": "Operand c: press to change its value",
        "operacion": "Operation: press to switch between addition, multiplication and subtraction",
        "rotuloOperacion": "Operation",
        "signoIzq": "Sign of the operation",
        "signoDer": "Sign of the operation",
        "valorNudoIzq": "Value of a ∗ b",
        "valorNudoDer": "Value of b ∗ c",
        "valorRaizIzq": "Value of (a ∗ b) ∗ c",
        "valorRaizDer": "Value of a ∗ (b ∗ c)",
        "estadoIguales": "Status: both groupings agree",
        "estadoDistintos": "Status: the groupings differ",
        "grupoParentesis": "Highlight the parentheses",
        "grupoIzquierda": "Highlight the grouping (a ∗ b) ∗ c",
        "grupoDerecha": "Highlight the grouping a ∗ (b ∗ c)"
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const AsociatividadArbol = () => <DiagramRenderer spec={AsociatividadArbolSpec} />;
