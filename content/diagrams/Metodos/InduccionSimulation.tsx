import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const InduccionSimulationSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Inducción matemática: efecto dominó",
  "componentId": "induccion-simulation",
  "category": "Metodos",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "showLabels": true,
  "viewport": {
    "bounds": [
      -5.5,
      3.4,
      5.5,
      -3.2
    ],
    "home": [
      -5.5,
      3.4,
      5.5,
      -3.2
    ],
    "minZoom": 0.5,
    "maxZoom": 4,
    "padding": 0.1
  },
  "layers": [
    {
      "id": "supports",
      "label": "Suelo y construcción",
      "order": 0,
      "visible": true,
      "locked": false
    },
    {
      "id": "geometry",
      "label": "Fichas de dominó",
      "order": 1,
      "visible": true,
      "locked": false
    },
    {
      "id": "controls",
      "label": "Caso base y paso inductivo",
      "order": 2,
      "visible": true,
      "locked": false
    },
    {
      "id": "annotations",
      "label": "Paneles informativos",
      "order": 3,
      "visible": true,
      "locked": false
    }
  ],
  "groups": [],
  "objects": [
    {
      "id": "pSueloL",
      "label": "Suelo L",
      "color": "carbon",
      "layerId": "supports",
      "order": 10,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -5.5,
        "y": -0.9
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "pSueloR",
      "label": "Suelo R",
      "color": "carbon",
      "layerId": "supports",
      "order": 20,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 5.5,
        "y": -0.9
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "segSuelo",
      "label": "Suelo",
      "color": "carbon",
      "layerId": "supports",
      "order": 25,
      "visible": true,
      "locked": true,
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
          "pSueloL",
          "pSueloR"
        ]
      },
      "appearance": {
        "strokeWidth": 2,
        "strokeOpacity": 0.35
      }
    },
    {
      "id": "empuje",
      "label": "Caso base: empujar P(1)",
      "color": "terracota",
      "layerId": "controls",
      "order": 30,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "primary",
        "ariaLabel": "Caso base: empujar la primera ficha P(1)"
      },
      "target": false,
      "objectType": "control",
      "variant": "button",
      "position": [
        -5.2,
        2.75
      ],
      "range": {
        "min": 0,
        "max": 5.5,
        "step": 0.01
      },
      "value": 0,
      "action": {
        "to": 5.5,
        "durationMs": 5500,
        "returnDurationMs": 900,
        "easing": "linear",
        "behavior": "toggle"
      }
    },
    {
      "id": "acercar",
      "label": "Paso inductivo: acercar las fichas",
      "color": "mora",
      "layerId": "controls",
      "order": 40,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "primary",
        "ariaLabel": "Paso inductivo: acercar las fichas para que cada una alcance a la siguiente"
      },
      "target": false,
      "objectType": "control",
      "variant": "button",
      "position": [
        -5.2,
        2.05
      ],
      "range": {
        "min": 0,
        "max": 6.4,
        "step": 0.01
      },
      "value": 0,
      "action": {
        "to": 6.4,
        "durationMs": 6400,
        "returnDurationMs": 2000,
        "easing": "linear",
        "behavior": "toggle"
      }
    },
    {
      "id": "pAprox",
      "label": "Progreso del acercamiento",
      "color": "carbon",
      "layerId": "supports",
      "order": 45,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "min(1, acercar / 1.4)^2 * (3 - 2 * min(1, acercar / 1.4))",
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
        "labelVisible": false
      }
    },
    {
      "id": "pRitmo",
      "label": "Separación y retardo de contacto",
      "color": "carbon",
      "layerId": "supports",
      "order": 50,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "1.9 - 0.9 * pAprox.x",
        "y": "(sqrt(0.25 + 8 * asin(min(1, (1.68 - 0.9 * pAprox.x) / 1.4))) - 0.5) / 4",
        "fallback": [
          1.9,
          0.77
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "pReloj",
      "label": "Tiempo de propagación",
      "color": "carbon",
      "layerId": "supports",
      "order": 55,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "min(empuje - pRitmo.y, max(0, acercar - 1.4))",
        "y": "0",
        "fallback": [
          -0.77,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "angD12",
      "label": "Inclinación ficha 12",
      "color": "carbon",
      "layerId": "supports",
      "order": 61,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "min(1.5708, 2 * max(0, pReloj.x - 10 * pRitmo.y)^2 + 0.5 * max(0, pReloj.x - 10 * pRitmo.y))",
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
        "labelVisible": false
      }
    },
    {
      "id": "angD11",
      "label": "Inclinación ficha 11",
      "color": "carbon",
      "layerId": "supports",
      "order": 62,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "min(1.5708, 2 * max(0, pReloj.x - 9 * pRitmo.y)^2 + 0.5 * max(0, pReloj.x - 9 * pRitmo.y), angD12.x + asin(max(-1, min(1, (pRitmo.x * cos(angD12.x) - 0.22) / 1.4))))",
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
        "labelVisible": false
      }
    },
    {
      "id": "angD10",
      "label": "Inclinación ficha 10",
      "color": "carbon",
      "layerId": "supports",
      "order": 63,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "min(1.5708, 2 * max(0, pReloj.x - 8 * pRitmo.y)^2 + 0.5 * max(0, pReloj.x - 8 * pRitmo.y), angD11.x + asin(max(-1, min(1, (pRitmo.x * cos(angD11.x) - 0.22) / 1.4))))",
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
        "labelVisible": false
      }
    },
    {
      "id": "angD9",
      "label": "Inclinación ficha 9",
      "color": "carbon",
      "layerId": "supports",
      "order": 64,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "min(1.5708, 2 * max(0, pReloj.x - 7 * pRitmo.y)^2 + 0.5 * max(0, pReloj.x - 7 * pRitmo.y), angD10.x + asin(max(-1, min(1, (pRitmo.x * cos(angD10.x) - 0.22) / 1.4))))",
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
        "labelVisible": false
      }
    },
    {
      "id": "angD8",
      "label": "Inclinación ficha 8",
      "color": "carbon",
      "layerId": "supports",
      "order": 65,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "min(1.5708, 2 * max(0, pReloj.x - 6 * pRitmo.y)^2 + 0.5 * max(0, pReloj.x - 6 * pRitmo.y), angD9.x + asin(max(-1, min(1, (pRitmo.x * cos(angD9.x) - 0.22) / 1.4))))",
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
        "labelVisible": false
      }
    },
    {
      "id": "angD7",
      "label": "Inclinación ficha 7",
      "color": "carbon",
      "layerId": "supports",
      "order": 66,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "min(1.5708, 2 * max(0, pReloj.x - 5 * pRitmo.y)^2 + 0.5 * max(0, pReloj.x - 5 * pRitmo.y), angD8.x + asin(max(-1, min(1, (pRitmo.x * cos(angD8.x) - 0.22) / 1.4))))",
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
        "labelVisible": false
      }
    },
    {
      "id": "angD6",
      "label": "Inclinación ficha 6",
      "color": "carbon",
      "layerId": "supports",
      "order": 67,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "min(1.5708, 2 * max(0, pReloj.x - 4 * pRitmo.y)^2 + 0.5 * max(0, pReloj.x - 4 * pRitmo.y), angD7.x + asin(max(-1, min(1, (pRitmo.x * cos(angD7.x) - 0.22) / 1.4))))",
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
        "labelVisible": false
      }
    },
    {
      "id": "angD5",
      "label": "Inclinación ficha 5",
      "color": "carbon",
      "layerId": "supports",
      "order": 68,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "min(1.5708, 2 * max(0, pReloj.x - 3 * pRitmo.y)^2 + 0.5 * max(0, pReloj.x - 3 * pRitmo.y), angD6.x + asin(max(-1, min(1, (pRitmo.x * cos(angD6.x) - 0.22) / 1.4))))",
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
        "labelVisible": false
      }
    },
    {
      "id": "angD4",
      "label": "Inclinación ficha 4",
      "color": "carbon",
      "layerId": "supports",
      "order": 69,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "min(1.5708, 2 * max(0, pReloj.x - 2 * pRitmo.y)^2 + 0.5 * max(0, pReloj.x - 2 * pRitmo.y), angD5.x + asin(max(-1, min(1, (pRitmo.x * cos(angD5.x) - 0.22) / 1.4))))",
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
        "labelVisible": false
      }
    },
    {
      "id": "angD3",
      "label": "Inclinación ficha 3",
      "color": "carbon",
      "layerId": "supports",
      "order": 70,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "min(1.5708, 2 * max(0, pReloj.x - 1 * pRitmo.y)^2 + 0.5 * max(0, pReloj.x - 1 * pRitmo.y), angD4.x + asin(max(-1, min(1, (pRitmo.x * cos(angD4.x) - 0.22) / 1.4))))",
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
        "labelVisible": false
      }
    },
    {
      "id": "angD2",
      "label": "Inclinación ficha 2",
      "color": "carbon",
      "layerId": "supports",
      "order": 71,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "min(1.5708, 2 * max(0, pReloj.x - 0 * pRitmo.y)^2 + 0.5 * max(0, pReloj.x - 0 * pRitmo.y), angD3.x + asin(max(-1, min(1, (pRitmo.x * cos(angD3.x) - 0.22) / 1.4))))",
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
        "labelVisible": false
      }
    },
    {
      "id": "angD1",
      "label": "Inclinación ficha 1",
      "color": "carbon",
      "layerId": "supports",
      "order": 72,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "min(1.5708, 2 * max(0, empuje)^2 + 0.5 * max(0, empuje), angD2.x + asin(max(-1, min(1, (pRitmo.x * cos(angD2.x) - 0.22) / 1.4))))",
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
        "labelVisible": false
      }
    },
    {
      "id": "pBL1",
      "label": "Base izq P(1)",
      "color": "carbon",
      "layerId": "supports",
      "order": 100,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 0 * pRitmo.x - 0.22 * cos(angD1.x)",
        "y": "-0.9 + 0.22 * sin(angD1.x)",
        "fallback": [
          -5,
          -0.9
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "pBR1",
      "label": "Pivote P(1)",
      "color": "carbon",
      "layerId": "supports",
      "order": 101,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 0 * pRitmo.x",
        "y": "-0.9",
        "fallback": [
          -4.78,
          -0.9
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "pTR1",
      "label": "Techo der P(1)",
      "color": "carbon",
      "layerId": "supports",
      "order": 102,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 0 * pRitmo.x + 1.4 * sin(angD1.x)",
        "y": "-0.9 + 1.4 * cos(angD1.x)",
        "fallback": [
          -4.78,
          0.5
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "pTL1",
      "label": "Techo izq P(1)",
      "color": "carbon",
      "layerId": "supports",
      "order": 103,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 0 * pRitmo.x - 0.22 * cos(angD1.x) + 1.4 * sin(angD1.x)",
        "y": "-0.9 + 0.22 * sin(angD1.x) + 1.4 * cos(angD1.x)",
        "fallback": [
          -5,
          0.5
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "domino1",
      "label": "P(1)",
      "color": "terracota",
      "layerId": "geometry",
      "order": 200,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "primary",
        "ariaLabel": "Ficha de dominó P(1)"
      },
      "target": true,
      "targetId": "domino1",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "pBL1",
          "pBR1",
          "pTR1",
          "pTL1"
        ]
      },
      "appearance": {
        "strokeWidth": 2,
        "fillOpacity": 0.85,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pBL2",
      "label": "Base izq P(2)",
      "color": "carbon",
      "layerId": "supports",
      "order": 110,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 1 * pRitmo.x - 0.22 * cos(angD2.x)",
        "y": "-0.9 + 0.22 * sin(angD2.x)",
        "fallback": [
          -3.1,
          -0.9
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "pBR2",
      "label": "Pivote P(2)",
      "color": "carbon",
      "layerId": "supports",
      "order": 111,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 1 * pRitmo.x",
        "y": "-0.9",
        "fallback": [
          -2.88,
          -0.9
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "pTR2",
      "label": "Techo der P(2)",
      "color": "carbon",
      "layerId": "supports",
      "order": 112,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 1 * pRitmo.x + 1.4 * sin(angD2.x)",
        "y": "-0.9 + 1.4 * cos(angD2.x)",
        "fallback": [
          -2.88,
          0.5
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "pTL2",
      "label": "Techo izq P(2)",
      "color": "carbon",
      "layerId": "supports",
      "order": 113,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 1 * pRitmo.x - 0.22 * cos(angD2.x) + 1.4 * sin(angD2.x)",
        "y": "-0.9 + 0.22 * sin(angD2.x) + 1.4 * cos(angD2.x)",
        "fallback": [
          -3.1,
          0.5
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "domino2",
      "label": "P(2)",
      "color": "carbon",
      "layerId": "geometry",
      "order": 210,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "secondary",
        "ariaLabel": "Ficha de dominó P(2)"
      },
      "target": true,
      "targetId": "domino2",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "pBL2",
          "pBR2",
          "pTR2",
          "pTL2"
        ]
      },
      "appearance": {
        "strokeWidth": 2,
        "fillOpacity": 0.85,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pBL3",
      "label": "Base izq P(3)",
      "color": "carbon",
      "layerId": "supports",
      "order": 120,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 2 * pRitmo.x - 0.22 * cos(angD3.x)",
        "y": "-0.9 + 0.22 * sin(angD3.x)",
        "fallback": [
          -1.2,
          -0.9
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "pBR3",
      "label": "Pivote P(3)",
      "color": "carbon",
      "layerId": "supports",
      "order": 121,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 2 * pRitmo.x",
        "y": "-0.9",
        "fallback": [
          -0.98,
          -0.9
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "pTR3",
      "label": "Techo der P(3)",
      "color": "carbon",
      "layerId": "supports",
      "order": 122,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 2 * pRitmo.x + 1.4 * sin(angD3.x)",
        "y": "-0.9 + 1.4 * cos(angD3.x)",
        "fallback": [
          -0.98,
          0.5
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "pTL3",
      "label": "Techo izq P(3)",
      "color": "carbon",
      "layerId": "supports",
      "order": 123,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 2 * pRitmo.x - 0.22 * cos(angD3.x) + 1.4 * sin(angD3.x)",
        "y": "-0.9 + 0.22 * sin(angD3.x) + 1.4 * cos(angD3.x)",
        "fallback": [
          -1.2,
          0.5
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "domino3",
      "label": "P(3)",
      "color": "carbon",
      "layerId": "geometry",
      "order": 220,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "secondary",
        "ariaLabel": "Ficha de dominó P(3)"
      },
      "target": true,
      "targetId": "domino3",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "pBL3",
          "pBR3",
          "pTR3",
          "pTL3"
        ]
      },
      "appearance": {
        "strokeWidth": 2,
        "fillOpacity": 0.85,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pBL4",
      "label": "Base izq P(4)",
      "color": "carbon",
      "layerId": "supports",
      "order": 130,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 3 * pRitmo.x - 0.22 * cos(angD4.x)",
        "y": "-0.9 + 0.22 * sin(angD4.x)",
        "fallback": [
          0.7,
          -0.9
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "pBR4",
      "label": "Pivote P(4)",
      "color": "carbon",
      "layerId": "supports",
      "order": 131,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 3 * pRitmo.x",
        "y": "-0.9",
        "fallback": [
          0.92,
          -0.9
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "pTR4",
      "label": "Techo der P(4)",
      "color": "carbon",
      "layerId": "supports",
      "order": 132,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 3 * pRitmo.x + 1.4 * sin(angD4.x)",
        "y": "-0.9 + 1.4 * cos(angD4.x)",
        "fallback": [
          0.92,
          0.5
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "pTL4",
      "label": "Techo izq P(4)",
      "color": "carbon",
      "layerId": "supports",
      "order": 133,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 3 * pRitmo.x - 0.22 * cos(angD4.x) + 1.4 * sin(angD4.x)",
        "y": "-0.9 + 0.22 * sin(angD4.x) + 1.4 * cos(angD4.x)",
        "fallback": [
          0.7,
          0.5
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "domino4",
      "label": "P(4)",
      "color": "carbon",
      "layerId": "geometry",
      "order": 230,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "secondary",
        "ariaLabel": "Ficha de dominó P(4)"
      },
      "target": true,
      "targetId": "domino4",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "pBL4",
          "pBR4",
          "pTR4",
          "pTL4"
        ]
      },
      "appearance": {
        "strokeWidth": 2,
        "fillOpacity": 0.85,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pBL5",
      "label": "Base izq ⋯",
      "color": "carbon",
      "layerId": "supports",
      "order": 140,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 4 * pRitmo.x - 0.22 * cos(angD5.x)",
        "y": "-0.9 + 0.22 * sin(angD5.x)",
        "fallback": [
          2.6,
          -0.9
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "pBR5",
      "label": "Pivote ⋯",
      "color": "carbon",
      "layerId": "supports",
      "order": 141,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 4 * pRitmo.x",
        "y": "-0.9",
        "fallback": [
          2.82,
          -0.9
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "pTR5",
      "label": "Techo der ⋯",
      "color": "carbon",
      "layerId": "supports",
      "order": 142,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 4 * pRitmo.x + 1.4 * sin(angD5.x)",
        "y": "-0.9 + 1.4 * cos(angD5.x)",
        "fallback": [
          2.82,
          0.5
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "pTL5",
      "label": "Techo izq ⋯",
      "color": "carbon",
      "layerId": "supports",
      "order": 143,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 4 * pRitmo.x - 0.22 * cos(angD5.x) + 1.4 * sin(angD5.x)",
        "y": "-0.9 + 0.22 * sin(angD5.x) + 1.4 * cos(angD5.x)",
        "fallback": [
          2.6,
          0.5
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "dominoPuntosA",
      "label": "⋯",
      "color": "carbon",
      "layerId": "geometry",
      "order": 240,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "construction",
        "ariaLabel": "Ficha de dominó ⋯"
      },
      "target": true,
      "targetId": "dominoPuntosA",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "pBL5",
          "pBR5",
          "pTR5",
          "pTL5"
        ]
      },
      "appearance": {
        "strokeWidth": 2,
        "fillOpacity": 0.35,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pBL6",
      "label": "Base izq P(k)",
      "color": "carbon",
      "layerId": "supports",
      "order": 150,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 5 * pRitmo.x - 0.22 * cos(angD6.x)",
        "y": "-0.9 + 0.22 * sin(angD6.x)",
        "fallback": [
          4.5,
          -0.9
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "pBR6",
      "label": "Pivote P(k)",
      "color": "carbon",
      "layerId": "supports",
      "order": 151,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 5 * pRitmo.x",
        "y": "-0.9",
        "fallback": [
          4.72,
          -0.9
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "pTR6",
      "label": "Techo der P(k)",
      "color": "carbon",
      "layerId": "supports",
      "order": 152,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 5 * pRitmo.x + 1.4 * sin(angD6.x)",
        "y": "-0.9 + 1.4 * cos(angD6.x)",
        "fallback": [
          4.72,
          0.5
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "pTL6",
      "label": "Techo izq P(k)",
      "color": "carbon",
      "layerId": "supports",
      "order": 153,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 5 * pRitmo.x - 0.22 * cos(angD6.x) + 1.4 * sin(angD6.x)",
        "y": "-0.9 + 0.22 * sin(angD6.x) + 1.4 * cos(angD6.x)",
        "fallback": [
          4.5,
          0.5
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "dominok",
      "label": "P(k)",
      "color": "ocre",
      "layerId": "geometry",
      "order": 250,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "secondary",
        "ariaLabel": "Ficha de dominó P(k)"
      },
      "target": true,
      "targetId": "dominok",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "pBL6",
          "pBR6",
          "pTR6",
          "pTL6"
        ]
      },
      "appearance": {
        "strokeWidth": 2,
        "fillOpacity": 0.85,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pBL7",
      "label": "Base izq P(k+1)",
      "color": "carbon",
      "layerId": "supports",
      "order": 160,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 6 * pRitmo.x - 0.22 * cos(angD7.x)",
        "y": "-0.9 + 0.22 * sin(angD7.x)",
        "fallback": [
          6.4,
          -0.9
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "pBR7",
      "label": "Pivote P(k+1)",
      "color": "carbon",
      "layerId": "supports",
      "order": 161,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 6 * pRitmo.x",
        "y": "-0.9",
        "fallback": [
          6.62,
          -0.9
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "pTR7",
      "label": "Techo der P(k+1)",
      "color": "carbon",
      "layerId": "supports",
      "order": 162,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 6 * pRitmo.x + 1.4 * sin(angD7.x)",
        "y": "-0.9 + 1.4 * cos(angD7.x)",
        "fallback": [
          6.62,
          0.5
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "pTL7",
      "label": "Techo izq P(k+1)",
      "color": "carbon",
      "layerId": "supports",
      "order": 163,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 6 * pRitmo.x - 0.22 * cos(angD7.x) + 1.4 * sin(angD7.x)",
        "y": "-0.9 + 0.22 * sin(angD7.x) + 1.4 * cos(angD7.x)",
        "fallback": [
          6.4,
          0.5
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "dominok1",
      "label": "P(k+1)",
      "color": "mora",
      "layerId": "geometry",
      "order": 260,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "secondary",
        "ariaLabel": "Ficha de dominó P(k+1)"
      },
      "target": true,
      "targetId": "dominok1",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "pBL7",
          "pBR7",
          "pTR7",
          "pTL7"
        ]
      },
      "appearance": {
        "strokeWidth": 2,
        "fillOpacity": 0.85,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pBL8",
      "label": "Base izq P(k+2)",
      "color": "carbon",
      "layerId": "supports",
      "order": 170,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 7 * pRitmo.x - 0.22 * cos(angD8.x)",
        "y": "-0.9 + 0.22 * sin(angD8.x)",
        "fallback": [
          8.3,
          -0.9
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "pBR8",
      "label": "Pivote P(k+2)",
      "color": "carbon",
      "layerId": "supports",
      "order": 171,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 7 * pRitmo.x",
        "y": "-0.9",
        "fallback": [
          8.52,
          -0.9
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "pTR8",
      "label": "Techo der P(k+2)",
      "color": "carbon",
      "layerId": "supports",
      "order": 172,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 7 * pRitmo.x + 1.4 * sin(angD8.x)",
        "y": "-0.9 + 1.4 * cos(angD8.x)",
        "fallback": [
          8.52,
          0.5
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "pTL8",
      "label": "Techo izq P(k+2)",
      "color": "carbon",
      "layerId": "supports",
      "order": 173,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 7 * pRitmo.x - 0.22 * cos(angD8.x) + 1.4 * sin(angD8.x)",
        "y": "-0.9 + 0.22 * sin(angD8.x) + 1.4 * cos(angD8.x)",
        "fallback": [
          8.3,
          0.5
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "dominok2",
      "label": "P(k+2)",
      "color": "carbon",
      "layerId": "geometry",
      "order": 270,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "secondary",
        "ariaLabel": "Ficha de dominó P(k+2)"
      },
      "target": true,
      "targetId": "dominok2",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "pBL8",
          "pBR8",
          "pTR8",
          "pTL8"
        ]
      },
      "appearance": {
        "strokeWidth": 2,
        "fillOpacity": 0.85,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pBL9",
      "label": "Base izq P(k+3)",
      "color": "carbon",
      "layerId": "supports",
      "order": 180,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 8 * pRitmo.x - 0.22 * cos(angD9.x)",
        "y": "-0.9 + 0.22 * sin(angD9.x)",
        "fallback": [
          10.2,
          -0.9
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "pBR9",
      "label": "Pivote P(k+3)",
      "color": "carbon",
      "layerId": "supports",
      "order": 181,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 8 * pRitmo.x",
        "y": "-0.9",
        "fallback": [
          10.42,
          -0.9
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "pTR9",
      "label": "Techo der P(k+3)",
      "color": "carbon",
      "layerId": "supports",
      "order": 182,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 8 * pRitmo.x + 1.4 * sin(angD9.x)",
        "y": "-0.9 + 1.4 * cos(angD9.x)",
        "fallback": [
          10.42,
          0.5
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "pTL9",
      "label": "Techo izq P(k+3)",
      "color": "carbon",
      "layerId": "supports",
      "order": 183,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 8 * pRitmo.x - 0.22 * cos(angD9.x) + 1.4 * sin(angD9.x)",
        "y": "-0.9 + 0.22 * sin(angD9.x) + 1.4 * cos(angD9.x)",
        "fallback": [
          10.2,
          0.5
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "dominok3",
      "label": "P(k+3)",
      "color": "carbon",
      "layerId": "geometry",
      "order": 280,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "secondary",
        "ariaLabel": "Ficha de dominó P(k+3)"
      },
      "target": true,
      "targetId": "dominok3",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "pBL9",
          "pBR9",
          "pTR9",
          "pTL9"
        ]
      },
      "appearance": {
        "strokeWidth": 2,
        "fillOpacity": 0.85,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pBL10",
      "label": "Base izq ⋯",
      "color": "carbon",
      "layerId": "supports",
      "order": 190,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 9 * pRitmo.x - 0.22 * cos(angD10.x)",
        "y": "-0.9 + 0.22 * sin(angD10.x)",
        "fallback": [
          12.1,
          -0.9
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "pBR10",
      "label": "Pivote ⋯",
      "color": "carbon",
      "layerId": "supports",
      "order": 191,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 9 * pRitmo.x",
        "y": "-0.9",
        "fallback": [
          12.32,
          -0.9
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "pTR10",
      "label": "Techo der ⋯",
      "color": "carbon",
      "layerId": "supports",
      "order": 192,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 9 * pRitmo.x + 1.4 * sin(angD10.x)",
        "y": "-0.9 + 1.4 * cos(angD10.x)",
        "fallback": [
          12.32,
          0.5
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "pTL10",
      "label": "Techo izq ⋯",
      "color": "carbon",
      "layerId": "supports",
      "order": 193,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 9 * pRitmo.x - 0.22 * cos(angD10.x) + 1.4 * sin(angD10.x)",
        "y": "-0.9 + 0.22 * sin(angD10.x) + 1.4 * cos(angD10.x)",
        "fallback": [
          12.1,
          0.5
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "dominoPuntosB",
      "label": "⋯",
      "color": "carbon",
      "layerId": "geometry",
      "order": 290,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "construction",
        "ariaLabel": "Ficha de dominó ⋯"
      },
      "target": true,
      "targetId": "dominoPuntosB",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "pBL10",
          "pBR10",
          "pTR10",
          "pTL10"
        ]
      },
      "appearance": {
        "strokeWidth": 2,
        "fillOpacity": 0.35,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pBL11",
      "label": "Base izq ⋯",
      "color": "carbon",
      "layerId": "supports",
      "order": 200,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 10 * pRitmo.x - 0.22 * cos(angD11.x)",
        "y": "-0.9 + 0.22 * sin(angD11.x)",
        "fallback": [
          14,
          -0.9
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "pBR11",
      "label": "Pivote ⋯",
      "color": "carbon",
      "layerId": "supports",
      "order": 201,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 10 * pRitmo.x",
        "y": "-0.9",
        "fallback": [
          14.22,
          -0.9
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "pTR11",
      "label": "Techo der ⋯",
      "color": "carbon",
      "layerId": "supports",
      "order": 202,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 10 * pRitmo.x + 1.4 * sin(angD11.x)",
        "y": "-0.9 + 1.4 * cos(angD11.x)",
        "fallback": [
          14.22,
          0.5
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "pTL11",
      "label": "Techo izq ⋯",
      "color": "carbon",
      "layerId": "supports",
      "order": 203,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 10 * pRitmo.x - 0.22 * cos(angD11.x) + 1.4 * sin(angD11.x)",
        "y": "-0.9 + 0.22 * sin(angD11.x) + 1.4 * cos(angD11.x)",
        "fallback": [
          14,
          0.5
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "dominoPuntosC",
      "label": "⋯",
      "color": "carbon",
      "layerId": "geometry",
      "order": 300,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "construction",
        "ariaLabel": "Ficha de dominó ⋯"
      },
      "target": true,
      "targetId": "dominoPuntosC",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "pBL11",
          "pBR11",
          "pTR11",
          "pTL11"
        ]
      },
      "appearance": {
        "strokeWidth": 2,
        "fillOpacity": 0.35,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pBL12",
      "label": "Base izq ⋯",
      "color": "carbon",
      "layerId": "supports",
      "order": 210,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 11 * pRitmo.x - 0.22 * cos(angD12.x)",
        "y": "-0.9 + 0.22 * sin(angD12.x)",
        "fallback": [
          15.9,
          -0.9
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "pBR12",
      "label": "Pivote ⋯",
      "color": "carbon",
      "layerId": "supports",
      "order": 211,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 11 * pRitmo.x",
        "y": "-0.9",
        "fallback": [
          16.12,
          -0.9
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "pTR12",
      "label": "Techo der ⋯",
      "color": "carbon",
      "layerId": "supports",
      "order": 212,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 11 * pRitmo.x + 1.4 * sin(angD12.x)",
        "y": "-0.9 + 1.4 * cos(angD12.x)",
        "fallback": [
          16.12,
          0.5
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "pTL12",
      "label": "Techo izq ⋯",
      "color": "carbon",
      "layerId": "supports",
      "order": 213,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-4.78 + 11 * pRitmo.x - 0.22 * cos(angD12.x) + 1.4 * sin(angD12.x)",
        "y": "-0.9 + 0.22 * sin(angD12.x) + 1.4 * cos(angD12.x)",
        "fallback": [
          15.9,
          0.5
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "dominoPuntosD",
      "label": "⋯",
      "color": "carbon",
      "layerId": "geometry",
      "order": 310,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "construction",
        "ariaLabel": "Ficha de dominó ⋯"
      },
      "target": true,
      "targetId": "dominoPuntosD",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "pBL12",
          "pBR12",
          "pTR12",
          "pTL12"
        ]
      },
      "appearance": {
        "strokeWidth": 2,
        "fillOpacity": 0.35,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "panelReposo",
      "label": "Panel: fichas en reposo",
      "color": "carbon",
      "layerId": "annotations",
      "order": 300,
      "visible": true,
      "visibleWhen": "and(not(gte(empuje, 0.01)), not(gte(acercar, 1.4)))",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "annotation",
        "ariaLabel": "Panel: fichas en reposo"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "Cada ficha es una afirmación $P(n)$; que caiga significa que queda demostrada. Están separadas más que su altura ($d > h$): ninguna caída alcanzaría a la siguiente.",
        "title": "Proposiciones en pie",
        "subtitle": "Ni caso base ni paso inductivo"
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.5,
          0.96
        ]
      },
      "appearance": {}
    },
    {
      "id": "panelCasoBase",
      "label": "Panel: solo caso base",
      "color": "terracota",
      "layerId": "annotations",
      "order": 310,
      "visible": true,
      "visibleWhen": "and(gte(empuje, 0.01), not(gte(acercar, 1.4)))",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "annotation",
        "ariaLabel": "Panel: solo caso base"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "La primera ficha cae, pero como $d > h$ no alcanza a $P(2)$: el caso base, por sí solo, no demuestra nada más.",
        "title": "Caso base",
        "subtitle": "$P(1)$ es verdadera"
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.5,
          0.96
        ]
      },
      "appearance": {}
    },
    {
      "id": "panelPaso",
      "label": "Panel: solo paso inductivo",
      "color": "mora",
      "layerId": "annotations",
      "order": 320,
      "visible": true,
      "visibleWhen": "and(not(gte(empuje, 0.01)), gte(acercar, 1.4))",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "annotation",
        "ariaLabel": "Panel: solo paso inductivo"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "Ahora $d < h$: **si** cae una ficha cualquiera $P(k)$, derriba a $P(k+1)$. Es una implicación, no un hecho: todavía no ha caído ninguna.",
        "title": "Paso inductivo",
        "subtitle": "$P(k) \\Rightarrow P(k+1)$"
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.5,
          0.96
        ]
      },
      "appearance": {}
    },
    {
      "id": "panelInduccion",
      "label": "Panel: principio de inducción",
      "color": "musgo",
      "layerId": "annotations",
      "order": 330,
      "visible": true,
      "visibleWhen": "and(gte(empuje, 0.01), gte(acercar, 1.4))",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "annotation",
        "ariaLabel": "Panel: principio de inducción"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "$P(1)$ cae y el paso inductivo, aplicado con $k = 1, 2, 3, \\dots$, derriba cada ficha siguiente: ninguna queda en pie.",
        "title": "Principio de inducción",
        "subtitle": "$\\forall n \\in \\mathbb{N},\\ P(n)$"
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.5,
          0.96
        ]
      },
      "appearance": {}
    }
  ],
  "relations": [],
  "steps": [
    {
      "id": "paso-reposo",
      "label": "1. Fichas en reposo",
      "description": "Cada ficha representa una proposición P(n). Al principio están todas en pie y demasiado separadas: la caída de una no alcanzaría a la siguiente.",
      "visibleTargets": [
        "empuje",
        "acercar",
        "segSuelo",
        "domino1",
        "domino2",
        "domino3",
        "domino4",
        "dominoPuntosA",
        "dominok",
        "dominok1",
        "dominok2",
        "dominok3",
        "dominoPuntosB",
        "dominoPuntosC",
        "dominoPuntosD",
        "panelReposo",
        "panelCasoBase",
        "panelPaso",
        "panelInduccion"
      ],
      "durationMs": 800,
      "objectStates": {
        "empuje": {
          "value": 0
        },
        "acercar": {
          "value": 0
        },
        "domino1": {
          "visible": true,
          "emphasis": "none"
        }
      }
    },
    {
      "id": "paso-caso-base",
      "label": "2. Caso base P(1)",
      "description": "Se demuestra P(1): la primera ficha cae. Pero, sin paso inductivo, la distancia a P(2) es mayor que la altura de la ficha y la cadena se detiene.",
      "visibleTargets": [
        "empuje",
        "acercar",
        "segSuelo",
        "domino1",
        "domino2",
        "domino3",
        "domino4",
        "dominoPuntosA",
        "dominok",
        "dominok1",
        "dominok2",
        "dominok3",
        "dominoPuntosB",
        "dominoPuntosC",
        "dominoPuntosD",
        "panelReposo",
        "panelCasoBase",
        "panelPaso",
        "panelInduccion"
      ],
      "durationMs": 1200,
      "objectStates": {
        "empuje": {
          "value": 5.5
        },
        "acercar": {
          "value": 0
        },
        "domino1": {
          "visible": true,
          "emphasis": "primary"
        }
      }
    },
    {
      "id": "paso-hipotesis-induccion",
      "label": "3. Paso inductivo P(k) ⇒ P(k+1)",
      "description": "Se supone P(k) para un k arbitrario y se prueba P(k+1). Geométricamente: acercamos las fichas hasta que la caída de cualquier P(k) alcanza a P(k+1).",
      "visibleTargets": [
        "empuje",
        "acercar",
        "segSuelo",
        "domino1",
        "domino2",
        "domino3",
        "domino4",
        "dominoPuntosA",
        "dominok",
        "dominok1",
        "dominok2",
        "dominok3",
        "dominoPuntosB",
        "dominoPuntosC",
        "dominoPuntosD",
        "panelReposo",
        "panelCasoBase",
        "panelPaso",
        "panelInduccion"
      ],
      "durationMs": 1400,
      "objectStates": {
        "empuje": {
          "value": 0
        },
        "acercar": {
          "value": 6.4
        },
        "dominok": {
          "visible": true,
          "emphasis": "primary"
        },
        "dominok1": {
          "visible": true,
          "emphasis": "secondary"
        }
      }
    },
    {
      "id": "paso-inductivo",
      "label": "4. Caso base y paso inductivo juntos",
      "description": "Con las fichas ya próximas, empujamos P(1). Cada ficha que cae golpea a su sucesora, que a su vez cae y golpea a la siguiente.",
      "visibleTargets": [
        "empuje",
        "acercar",
        "segSuelo",
        "domino1",
        "domino2",
        "domino3",
        "domino4",
        "dominoPuntosA",
        "dominok",
        "dominok1",
        "dominok2",
        "dominok3",
        "dominoPuntosB",
        "dominoPuntosC",
        "dominoPuntosD",
        "panelReposo",
        "panelCasoBase",
        "panelPaso",
        "panelInduccion"
      ],
      "durationMs": 1200,
      "objectStates": {
        "empuje": {
          "value": 5.5
        },
        "acercar": {
          "value": 6.4
        },
        "domino1": {
          "visible": true,
          "emphasis": "primary"
        },
        "dominok": {
          "visible": true,
          "emphasis": "secondary"
        },
        "dominok1": {
          "visible": true,
          "emphasis": "secondary"
        }
      }
    },
    {
      "id": "paso-conclusion-universal",
      "label": "5. Conclusión: ∀n ∈ ℕ, P(n)",
      "description": "Como P(1) es cierta y cada P(k) implica P(k+1), ninguna ficha queda en pie: P(n) es cierta para todo n natural.",
      "visibleTargets": [
        "empuje",
        "acercar",
        "segSuelo",
        "domino1",
        "domino2",
        "domino3",
        "domino4",
        "dominoPuntosA",
        "dominok",
        "dominok1",
        "dominok2",
        "dominok3",
        "dominoPuntosB",
        "dominoPuntosC",
        "dominoPuntosD",
        "panelReposo",
        "panelCasoBase",
        "panelPaso",
        "panelInduccion"
      ],
      "durationMs": 1200,
      "objectStates": {
        "empuje": {
          "value": 5.5
        },
        "acercar": {
          "value": 6.4
        },
        "domino1": {
          "visible": true,
          "emphasis": "primary"
        },
        "dominok": {
          "visible": true,
          "emphasis": "primary"
        },
        "dominok1": {
          "visible": true,
          "emphasis": "primary"
        }
      }
    }
  ],
  "note": "Activa o desactiva «Caso base» (empujar P(1)) y «Paso inductivo» (acercar las fichas) en el orden que quieras. Solo con ambos cae toda la fila.",
  "translations": {
    "eu": {
      "title": "Indukzio matematikoa: domino-efektua",
      "note": "Aktibatu edo desaktibatu «Oinarrizko kasua» (P(1) bultzatu) eta «Urrats induktiboa» (fitxak hurbildu) nahi duzun ordenan. Biekin bakarrik erortzen da ilara osoa.",
      "steps": {
        "paso-reposo": {
          "label": "1. Fitxak geldi",
          "description": "Fitxa bakoitzak P(n) proposizio bat irudikatzen du. Hasieran denak zutik daude eta urrunegi: bat erortzean ez luke hurrengoa ukituko."
        },
        "paso-caso-base": {
          "label": "2. Oinarrizko kasua P(1)",
          "description": "P(1) frogatzen da: lehen fitxa erortzen da. Baina urrats induktiborik gabe, P(2)-rainoko distantzia fitxaren altuera baino handiagoa da eta katea gelditu egiten da."
        },
        "paso-hipotesis-induccion": {
          "label": "3. Urrats induktiboa P(k) ⇒ P(k+1)",
          "description": "P(k) onartzen da k hautazko baterako eta P(k+1) frogatzen da. Geometrikoki: fitxak hurbiltzen ditugu edozein P(k)-ren erorketak P(k+1) ukitu arte."
        },
        "paso-inductivo": {
          "label": "4. Oinarrizko kasua eta urrats induktiboa batera",
          "description": "Fitxak hurbil daudela, P(1) bultzatzen dugu. Erortzen den fitxa bakoitzak hurrengoa jotzen du, eta horrek hurrengoa."
        },
        "paso-conclusion-universal": {
          "label": "5. Ondorioa: ∀n ∈ ℕ, P(n)",
          "description": "P(1) egia denez eta P(k)-k P(k+1) inplikatzen duenez, ez da fitxarik zutik geratzen: P(n) egia da n arrunt guztietarako."
        }
      },
      "labels": {
        "empuje": "Oinarrizko kasua: P(1) bultzatu",
        "acercar": "Urrats induktiboa: fitxak hurbildu",
        "panelReposo": "Panela: fitxak geldi",
        "panelCasoBase": "Panela: oinarrizko kasua soilik",
        "panelPaso": "Panela: urrats induktiboa soilik",
        "panelInduccion": "Panela: indukzio-printzipioa"
      },
      "titles": {
        "panelReposo": "Zutik dauden proposizioak",
        "panelCasoBase": "Oinarrizko kasua",
        "panelPaso": "Urrats induktiboa",
        "panelInduccion": "Indukzio-printzipioa"
      },
      "subtitles": {
        "panelReposo": "Ez oinarrizko kasurik ez urrats induktiborik",
        "panelCasoBase": "$P(1)$ egia da",
        "panelPaso": "$P(k) \\Rightarrow P(k+1)$",
        "panelInduccion": "$\\forall n \\in \\mathbb{N},\\ P(n)$"
      },
      "annotations": {
        "panelReposo": "Fitxa bakoitza $P(n)$ baieztapen bat da; erortzeak frogatuta geratzen dela esan nahi du. Beren altuera baino urrunago daude ($d > h$): ezein erorketak ez luke hurrengoa ukituko.",
        "panelCasoBase": "Lehen fitxa erortzen da, baina $d > h$ denez ez da $P(2)$-raino iristen: oinarrizko kasuak, berez, ez du ezer gehiago frogatzen.",
        "panelPaso": "Orain $d < h$: edozein $P(k)$ fitxa erortzen **bada**, $P(k+1)$ botatzen du. Inplikazio bat da, ez gertaera bat: oraindik ez da fitxarik erori.",
        "panelInduccion": "$P(1)$ erortzen da eta urrats induktiboak, $k = 1, 2, 3, \\dots$ balioekin aplikatuta, hurrengo fitxa bakoitza botatzen du: ez da bat ere zutik geratzen."
      },
      "ariaLabels": {
        "empuje": "Oinarrizko kasua: lehen fitxa P(1) bultzatu",
        "acercar": "Urrats induktiboa: fitxak hurbildu bakoitzak hurrengoa jo dezan",
        "domino1": "P(1) domino-fitxa",
        "domino2": "P(2) domino-fitxa",
        "domino3": "P(3) domino-fitxa",
        "domino4": "P(4) domino-fitxa",
        "dominoPuntosA": "⋯ domino-fitxa",
        "dominok": "P(k) domino-fitxa",
        "dominok1": "P(k+1) domino-fitxa",
        "dominok2": "P(k+2) domino-fitxa",
        "dominok3": "P(k+3) domino-fitxa",
        "dominoPuntosB": "⋯ domino-fitxa",
        "dominoPuntosC": "⋯ domino-fitxa",
        "dominoPuntosD": "⋯ domino-fitxa",
        "panelReposo": "Panela: fitxak geldirik",
        "panelCasoBase": "Panela: oinarrizko kasua soilik",
        "panelPaso": "Panela: urrats induktiboa soilik",
        "panelInduccion": "Panela: indukzio-printzipioa"
      }
    },
    "en": {
      "title": "Mathematical Induction: the Domino Effect",
      "note": "Toggle “Base case” (push P(1)) and “Inductive step” (bring the dominoes closer) in any order. Only with both does the whole row fall.",
      "steps": {
        "paso-reposo": {
          "label": "1. Dominoes at rest",
          "description": "Each domino stands for a proposition P(n). At first they are all upright and too far apart: if one fell it would not reach the next."
        },
        "paso-caso-base": {
          "label": "2. Base case P(1)",
          "description": "P(1) is proved: the first domino falls. Without the inductive step, though, the gap to P(2) is larger than the domino's height and the chain stops."
        },
        "paso-hipotesis-induccion": {
          "label": "3. Inductive step P(k) ⇒ P(k+1)",
          "description": "Assume P(k) for an arbitrary k and prove P(k+1). Geometrically: we bring the dominoes closer until the fall of any P(k) reaches P(k+1)."
        },
        "paso-inductivo": {
          "label": "4. Base case and inductive step together",
          "description": "With the dominoes close, we push P(1). Each falling domino strikes its successor, which falls and strikes the next one."
        },
        "paso-conclusion-universal": {
          "label": "5. Conclusion: ∀n ∈ ℕ, P(n)",
          "description": "Since P(1) holds and each P(k) implies P(k+1), no domino is left standing: P(n) holds for every natural n."
        }
      },
      "labels": {
        "empuje": "Base case: push P(1)",
        "acercar": "Inductive step: bring the dominoes closer",
        "panelReposo": "Panel: dominoes at rest",
        "panelCasoBase": "Panel: base case only",
        "panelPaso": "Panel: inductive step only",
        "panelInduccion": "Panel: principle of induction"
      },
      "titles": {
        "panelReposo": "Propositions standing",
        "panelCasoBase": "Base case",
        "panelPaso": "Inductive step",
        "panelInduccion": "Principle of induction"
      },
      "subtitles": {
        "panelReposo": "Neither base case nor inductive step",
        "panelCasoBase": "$P(1)$ holds",
        "panelPaso": "$P(k) \\Rightarrow P(k+1)$",
        "panelInduccion": "$\\forall n \\in \\mathbb{N},\\ P(n)$"
      },
      "annotations": {
        "panelReposo": "Each domino is a statement $P(n)$; falling means being proved. They stand farther apart than their height ($d > h$): no fall would reach the next one.",
        "panelCasoBase": "The first domino falls, but since $d > h$ it does not reach $P(2)$: the base case alone proves nothing more.",
        "panelPaso": "Now $d < h$: **if** any domino $P(k)$ falls, it knocks down $P(k+1)$. It is an implication, not a fact: no domino has fallen yet.",
        "panelInduccion": "$P(1)$ falls and the inductive step, applied with $k = 1, 2, 3, \\dots$, knocks down every next domino: none is left standing."
      },
      "ariaLabels": {
        "empuje": "Base case: push the first tile P(1)",
        "acercar": "Inductive step: bring the tiles closer so each one reaches the next",
        "domino1": "Domino tile P(1)",
        "domino2": "Domino tile P(2)",
        "domino3": "Domino tile P(3)",
        "domino4": "Domino tile P(4)",
        "dominoPuntosA": "Domino tile ⋯",
        "dominok": "Domino tile P(k)",
        "dominok1": "Domino tile P(k+1)",
        "dominok2": "Domino tile P(k+2)",
        "dominok3": "Domino tile P(k+3)",
        "dominoPuntosB": "Domino tile ⋯",
        "dominoPuntosC": "Domino tile ⋯",
        "dominoPuntosD": "Domino tile ⋯",
        "panelReposo": "Panel: tiles at rest",
        "panelCasoBase": "Panel: base case only",
        "panelPaso": "Panel: inductive step only",
        "panelInduccion": "Panel: principle of induction"
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const InduccionSimulation = () => <DiagramRenderer spec={InduccionSimulationSpec} />;
