import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const CongruenciaALASpec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Criterio de congruencia ALA",
  "componentId": "CongruenciaALA",
  "category": "Teoremas",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "viewport": {
    "bounds": [
      -4,
      8.5,
      9,
      -8.5
    ],
    "home": [
      -4,
      8.5,
      9,
      -8.5
    ],
    "minZoom": 0.7,
    "maxZoom": 4,
    "padding": 0.16
  },
  "layers": [
    {
      "id": "rellenos",
      "label": "Triángulos",
      "order": 0,
      "visible": true,
      "locked": false
    },
    {
      "id": "geometria",
      "label": "Lados y vértices",
      "order": 1,
      "visible": true,
      "locked": false
    },
    {
      "id": "angulos",
      "label": "Ángulos",
      "order": 2,
      "visible": true,
      "locked": false
    },
    {
      "id": "marcas",
      "label": "Marcas de igualdad",
      "order": 3,
      "visible": true,
      "locked": false
    },
    {
      "id": "cotas",
      "label": "Cotas y texto",
      "order": 4,
      "visible": true,
      "locked": false
    }
  ],
  "groups": [
    {
      "id": "globalGrupo",
      "label": "Triángulos globalmente congruentes",
      "memberIds": [
        "A1",
        "B1",
        "C1",
        "A2",
        "B2",
        "C2",
        "triangulo1",
        "triangulo2",
        "segAB1",
        "segAC1",
        "segBC1",
        "segAB2",
        "segAC2",
        "segBC2",
        "anguloA1",
        "anguloA2",
        "anguloB1",
        "anguloB2",
        "anguloC1",
        "anguloC2",
        "marcaAB1",
        "marcaAB2",
        "marcaAC1",
        "marcaAC2",
        "marcaBC1",
        "marcaBC2",
        "cotaAB1",
        "cotaAB2",
        "medidaA",
        "medidaB"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "primary"
      },
      "target": true,
      "targetId": "globalmente-congruentes",
      "color": "terracota"
    },
    {
      "id": "ladoABGrupo",
      "label": "Lados AB y A′B′",
      "memberIds": [
        "segAB1",
        "segAB2",
        "marcaAB1",
        "marcaAB2",
        "cotaAB1",
        "cotaAB2"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "primary"
      },
      "target": true,
      "targetId": "lado-ab",
      "color": "terracota"
    },
    {
      "id": "anguloAGrupo",
      "label": "Ángulos A y A′",
      "memberIds": [
        "anguloA1",
        "anguloA2",
        "medidaA"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "primary"
      },
      "target": true,
      "targetId": "angulo-a",
      "color": "ocre"
    },
    {
      "id": "anguloBGrupo",
      "label": "Ángulos B y B′",
      "memberIds": [
        "anguloB1",
        "anguloB2",
        "medidaB"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "primary"
      },
      "target": true,
      "targetId": "angulo-b",
      "color": "ocre"
    }
  ],
  "points": [
    {
      "id": "A1",
      "label": "A",
      "color": "carbon",
      "layerId": "geometria",
      "order": 1,
      "visible": true,
      "locked": false,
      "groupIds": [
        "globalGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "primary"
      },
      "target": false,
      "style": {
        "pointSize": 5,
        "highlightPointSize": 7,
        "preserveColorOnHighlight": true
      },
      "x": 0,
      "y": 0,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "B1",
      "label": "B",
      "color": "carbon",
      "layerId": "geometria",
      "order": 2,
      "visible": true,
      "locked": false,
      "groupIds": [
        "globalGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "primary"
      },
      "target": false,
      "style": {
        "pointSize": 5,
        "highlightPointSize": 7,
        "preserveColorOnHighlight": true
      },
      "x": 5,
      "y": 0,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "C1",
      "label": "C",
      "color": "carbon",
      "layerId": "geometria",
      "order": 3,
      "visible": true,
      "locked": false,
      "groupIds": [
        "globalGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "primary"
      },
      "target": false,
      "style": {
        "pointSize": 5,
        "highlightPointSize": 7,
        "preserveColorOnHighlight": true
      },
      "x": 1.5,
      "y": 4,
      "fixed": false,
      "constraint": "constrained",
      "constraintIds": [
        "mismoSemiplano"
      ]
    },
    {
      "id": "A2",
      "label": "A′",
      "color": "carbon",
      "layerId": "geometria",
      "order": 4,
      "visible": true,
      "locked": false,
      "groupIds": [
        "globalGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "primary"
      },
      "target": false,
      "style": {
        "pointSize": 5,
        "highlightPointSize": 7,
        "preserveColorOnHighlight": true
      },
      "x": 0,
      "y": -3,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "B2",
      "label": "B′",
      "color": "carbon",
      "layerId": "geometria",
      "order": 5,
      "visible": true,
      "locked": false,
      "groupIds": [
        "globalGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "primary"
      },
      "target": false,
      "style": {
        "pointSize": 5,
        "highlightPointSize": 7,
        "preserveColorOnHighlight": true
      },
      "x": 5,
      "y": -3,
      "fixed": true,
      "constraint": "derived",
      "dependencies": [
        "A1",
        "A2",
        "B1"
      ],
      "xExpression": "A2.x+B1.x-A1.x",
      "yExpression": "A2.y"
    },
    {
      "id": "C2",
      "label": "C′",
      "color": "carbon",
      "layerId": "geometria",
      "order": 6,
      "visible": true,
      "locked": false,
      "groupIds": [
        "globalGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "primary"
      },
      "target": false,
      "style": {
        "pointSize": 5,
        "highlightPointSize": 7,
        "preserveColorOnHighlight": true
      },
      "x": 1.5,
      "y": -7,
      "fixed": true,
      "constraint": "derived",
      "dependencies": [
        "A1",
        "A2",
        "C1"
      ],
      "xExpression": "A2.x+C1.x-A1.x",
      "yExpression": "A2.y-(C1.y-A1.y)"
    }
  ],
  "elements": [
    {
      "id": "triangulo1",
      "label": "triángulo ABC",
      "color": "salvia",
      "layerId": "rellenos",
      "order": 1,
      "visible": true,
      "locked": false,
      "groupIds": [
        "globalGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2,
        "fillOpacity": 0.07,
        "highlightFillOpacity": 0.22,
        "preserveColorOnHighlight": true
      },
      "kind": "polygon",
      "refs": [
        "A1",
        "B1",
        "C1"
      ]
    },
    {
      "id": "triangulo2",
      "label": "triángulo A′B′C′",
      "color": "pavo",
      "layerId": "rellenos",
      "order": 2,
      "visible": true,
      "locked": false,
      "groupIds": [
        "globalGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2,
        "fillOpacity": 0.07,
        "highlightFillOpacity": 0.22,
        "preserveColorOnHighlight": true
      },
      "kind": "polygon",
      "refs": [
        "A2",
        "B2",
        "C2"
      ]
    },
    {
      "id": "segAB1",
      "label": "lado AB",
      "color": "carbon",
      "layerId": "geometria",
      "order": 10,
      "visible": true,
      "locked": false,
      "groupIds": [
        "globalGrupo",
        "ladoABGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 3,
        "highlightStrokeWidth": 5,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "A1",
        "B1"
      ]
    },
    {
      "id": "segAC1",
      "label": "lado AC",
      "color": "carbon",
      "layerId": "geometria",
      "order": 11,
      "visible": true,
      "locked": false,
      "groupIds": [
        "globalGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.5,
        "highlightStrokeWidth": 4.5,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "A1",
        "C1"
      ]
    },
    {
      "id": "segBC1",
      "label": "lado BC",
      "color": "carbon",
      "layerId": "geometria",
      "order": 12,
      "visible": true,
      "locked": false,
      "groupIds": [
        "globalGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.5,
        "highlightStrokeWidth": 4.5,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "B1",
        "C1"
      ]
    },
    {
      "id": "segAB2",
      "label": "lado A′B′",
      "color": "carbon",
      "layerId": "geometria",
      "order": 13,
      "visible": true,
      "locked": false,
      "groupIds": [
        "globalGrupo",
        "ladoABGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 3,
        "highlightStrokeWidth": 5,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "A2",
        "B2"
      ]
    },
    {
      "id": "segAC2",
      "label": "lado A′C′",
      "color": "carbon",
      "layerId": "geometria",
      "order": 14,
      "visible": true,
      "locked": false,
      "groupIds": [
        "globalGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.5,
        "highlightStrokeWidth": 4.5,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "A2",
        "C2"
      ]
    },
    {
      "id": "segBC2",
      "label": "lado B′C′",
      "color": "carbon",
      "layerId": "geometria",
      "order": 15,
      "visible": true,
      "locked": false,
      "groupIds": [
        "globalGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.5,
        "highlightStrokeWidth": 4.5,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "B2",
        "C2"
      ]
    },
    {
      "id": "anguloA1",
      "label": "ángulo A",
      "color": "ocre",
      "layerId": "angulos",
      "order": 20,
      "visible": true,
      "locked": false,
      "groupIds": [
        "globalGrupo",
        "anguloAGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.5,
        "fillOpacity": 0.25,
        "angleRadius": 0.6,
        "highlightFillOpacity": 0.5,
        "preserveColorOnHighlight": true
      },
      "kind": "angle",
      "refs": [
        "B1",
        "A1",
        "C1"
      ]
    },
    {
      "id": "anguloA2",
      "label": "ángulo A′",
      "color": "ocre",
      "layerId": "angulos",
      "order": 21,
      "visible": true,
      "locked": false,
      "groupIds": [
        "globalGrupo",
        "anguloAGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.5,
        "fillOpacity": 0.25,
        "angleRadius": 0.6,
        "highlightFillOpacity": 0.5,
        "preserveColorOnHighlight": true
      },
      "kind": "angle",
      "refs": [
        "C2",
        "A2",
        "B2"
      ]
    },
    {
      "id": "anguloB1",
      "label": "ángulo B",
      "color": "ocre",
      "layerId": "angulos",
      "order": 22,
      "visible": true,
      "locked": false,
      "groupIds": [
        "globalGrupo",
        "anguloBGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.5,
        "fillOpacity": 0.25,
        "angleRadius": 0.6,
        "highlightFillOpacity": 0.5,
        "preserveColorOnHighlight": true
      },
      "kind": "angle",
      "refs": [
        "C1",
        "B1",
        "A1"
      ]
    },
    {
      "id": "anguloB2",
      "label": "ángulo B′",
      "color": "ocre",
      "layerId": "angulos",
      "order": 23,
      "visible": true,
      "locked": false,
      "groupIds": [
        "globalGrupo",
        "anguloBGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.5,
        "fillOpacity": 0.25,
        "angleRadius": 0.6,
        "highlightFillOpacity": 0.5,
        "preserveColorOnHighlight": true
      },
      "kind": "angle",
      "refs": [
        "A2",
        "B2",
        "C2"
      ]
    },
    {
      "id": "anguloC1",
      "label": "ángulo C",
      "color": "ocre",
      "layerId": "angulos",
      "order": 24,
      "visible": false,
      "locked": false,
      "groupIds": [
        "globalGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.5,
        "fillOpacity": 0.25,
        "angleRadius": 0.6,
        "highlightFillOpacity": 0.5,
        "highlightVisible": true,
        "preserveColorOnHighlight": true
      },
      "kind": "angle",
      "refs": [
        "A1",
        "C1",
        "B1"
      ]
    },
    {
      "id": "anguloC2",
      "label": "ángulo C′",
      "color": "ocre",
      "layerId": "angulos",
      "order": 25,
      "visible": false,
      "locked": false,
      "groupIds": [
        "globalGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.5,
        "fillOpacity": 0.25,
        "angleRadius": 0.6,
        "highlightFillOpacity": 0.5,
        "highlightVisible": true,
        "preserveColorOnHighlight": true
      },
      "kind": "angle",
      "refs": [
        "B2",
        "C2",
        "A2"
      ]
    },
    {
      "id": "marcaAB1",
      "label": "marca AB",
      "color": "terracota",
      "layerId": "marcas",
      "order": 30,
      "visible": true,
      "locked": false,
      "groupIds": [
        "globalGrupo",
        "ladoABGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.2,
        "highlightStrokeWidth": 4,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "A1",
        "B1"
      ],
      "properties": {
        "markCount": 1
      }
    },
    {
      "id": "marcaAB2",
      "label": "marca A′B′",
      "color": "terracota",
      "layerId": "marcas",
      "order": 31,
      "visible": true,
      "locked": false,
      "groupIds": [
        "globalGrupo",
        "ladoABGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.2,
        "highlightStrokeWidth": 4,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "A2",
        "B2"
      ],
      "properties": {
        "markCount": 1
      }
    },
    {
      "id": "marcaAC1",
      "label": "marcas AC",
      "color": "terracota",
      "layerId": "marcas",
      "order": 32,
      "visible": false,
      "locked": false,
      "groupIds": [
        "globalGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.2,
        "highlightStrokeWidth": 4,
        "highlightVisible": true,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "A1",
        "C1"
      ],
      "properties": {
        "markCount": 2
      }
    },
    {
      "id": "marcaAC2",
      "label": "marcas A′C′",
      "color": "terracota",
      "layerId": "marcas",
      "order": 33,
      "visible": false,
      "locked": false,
      "groupIds": [
        "globalGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.2,
        "highlightStrokeWidth": 4,
        "highlightVisible": true,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "A2",
        "C2"
      ],
      "properties": {
        "markCount": 2
      }
    },
    {
      "id": "marcaBC1",
      "label": "marcas BC",
      "color": "terracota",
      "layerId": "marcas",
      "order": 34,
      "visible": false,
      "locked": false,
      "groupIds": [
        "globalGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.2,
        "highlightStrokeWidth": 4,
        "highlightVisible": true,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "B1",
        "C1"
      ],
      "properties": {
        "markCount": 3
      }
    },
    {
      "id": "marcaBC2",
      "label": "marcas B′C′",
      "color": "terracota",
      "layerId": "marcas",
      "order": 35,
      "visible": false,
      "locked": false,
      "groupIds": [
        "globalGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.2,
        "highlightStrokeWidth": 4,
        "highlightVisible": true,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "B2",
        "C2"
      ],
      "properties": {
        "markCount": 3
      }
    },
    {
      "id": "cotaAB1",
      "label": "cota AB",
      "color": "pizarra",
      "layerId": "cotas",
      "order": 40,
      "visible": true,
      "locked": false,
      "groupIds": [
        "globalGrupo",
        "ladoABGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.5,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "dimensionLine",
      "refs": [
        "A1",
        "B1"
      ],
      "text": "AB = {value}",
      "properties": {
        "unit": "u",
        "precision": 1,
        "offset": -0.45
      }
    },
    {
      "id": "cotaAB2",
      "label": "cota A′B′",
      "color": "pizarra",
      "layerId": "cotas",
      "order": 41,
      "visible": true,
      "locked": false,
      "groupIds": [
        "globalGrupo",
        "ladoABGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.5,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "dimensionLine",
      "refs": [
        "A2",
        "B2"
      ],
      "text": "A′B′ = {value}",
      "properties": {
        "unit": "u",
        "precision": 1,
        "offset": 0.45
      }
    },
    {
      "id": "medidaA",
      "label": "medida angular A",
      "color": "ocre",
      "layerId": "cotas",
      "order": 42,
      "visible": true,
      "locked": false,
      "groupIds": [
        "globalGrupo",
        "anguloAGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "textOffset": [
          -2.4,
          7.5
        ],
        "preserveColorOnHighlight": true
      },
      "kind": "measurement",
      "refs": [
        "A1"
      ],
      "text": "∠A = {value}",
      "properties": {
        "expression": "abs(atan2(C1.y-A1.y,C1.x-A1.x)-atan2(B1.y-A1.y,B1.x-A1.x))*180/pi",
        "unit": "°",
        "precision": 0
      }
    },
    {
      "id": "medidaB",
      "label": "medida angular B",
      "color": "ocre",
      "layerId": "cotas",
      "order": 43,
      "visible": true,
      "locked": false,
      "groupIds": [
        "globalGrupo",
        "anguloBGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "textOffset": [
          -5.5,
          7.5
        ],
        "preserveColorOnHighlight": true
      },
      "kind": "measurement",
      "refs": [
        "B1"
      ],
      "text": "∠B = {value}",
      "properties": {
        "expression": "abs(atan2(C1.y-B1.y,C1.x-B1.x)-atan2(A1.y-B1.y,A1.x-B1.x))*180/pi",
        "unit": "°",
        "precision": 0
      }
    }
  ],
  "sliders": [],
  "steps": [],
  "constraints": [
    {
      "id": "mismoSemiplano",
      "label": "C conserva la orientación del triángulo",
      "kind": "sameSide",
      "refs": [
        "C1",
        "A1",
        "B1"
      ],
      "enabled": true
    }
  ],
  "dependencies": [
    {
      "sourceId": "A1",
      "targetId": "B2",
      "relation": "expression"
    },
    {
      "sourceId": "A2",
      "targetId": "B2",
      "relation": "expression"
    },
    {
      "sourceId": "B1",
      "targetId": "B2",
      "relation": "expression"
    },
    {
      "sourceId": "A1",
      "targetId": "C2",
      "relation": "expression"
    },
    {
      "sourceId": "A2",
      "targetId": "C2",
      "relation": "expression"
    },
    {
      "sourceId": "C1",
      "targetId": "C2",
      "relation": "expression"
    },
    {
      "sourceId": "A1",
      "targetId": "triangulo1",
      "relation": "construction"
    },
    {
      "sourceId": "B1",
      "targetId": "triangulo1",
      "relation": "construction"
    },
    {
      "sourceId": "C1",
      "targetId": "triangulo1",
      "relation": "construction"
    },
    {
      "sourceId": "A2",
      "targetId": "triangulo2",
      "relation": "construction"
    },
    {
      "sourceId": "B2",
      "targetId": "triangulo2",
      "relation": "construction"
    },
    {
      "sourceId": "C2",
      "targetId": "triangulo2",
      "relation": "construction"
    },
    {
      "sourceId": "A1",
      "targetId": "segAB1",
      "relation": "construction"
    },
    {
      "sourceId": "B1",
      "targetId": "segAB1",
      "relation": "construction"
    },
    {
      "sourceId": "A1",
      "targetId": "segAC1",
      "relation": "construction"
    },
    {
      "sourceId": "C1",
      "targetId": "segAC1",
      "relation": "construction"
    },
    {
      "sourceId": "B1",
      "targetId": "segBC1",
      "relation": "construction"
    },
    {
      "sourceId": "C1",
      "targetId": "segBC1",
      "relation": "construction"
    },
    {
      "sourceId": "A2",
      "targetId": "segAB2",
      "relation": "construction"
    },
    {
      "sourceId": "B2",
      "targetId": "segAB2",
      "relation": "construction"
    },
    {
      "sourceId": "A2",
      "targetId": "segAC2",
      "relation": "construction"
    },
    {
      "sourceId": "C2",
      "targetId": "segAC2",
      "relation": "construction"
    },
    {
      "sourceId": "B2",
      "targetId": "segBC2",
      "relation": "construction"
    },
    {
      "sourceId": "C2",
      "targetId": "segBC2",
      "relation": "construction"
    },
    {
      "sourceId": "B1",
      "targetId": "anguloA1",
      "relation": "construction"
    },
    {
      "sourceId": "A1",
      "targetId": "anguloA1",
      "relation": "construction"
    },
    {
      "sourceId": "C1",
      "targetId": "anguloA1",
      "relation": "construction"
    },
    {
      "sourceId": "C2",
      "targetId": "anguloA2",
      "relation": "construction"
    },
    {
      "sourceId": "A2",
      "targetId": "anguloA2",
      "relation": "construction"
    },
    {
      "sourceId": "B2",
      "targetId": "anguloA2",
      "relation": "construction"
    },
    {
      "sourceId": "C1",
      "targetId": "anguloB1",
      "relation": "construction"
    },
    {
      "sourceId": "B1",
      "targetId": "anguloB1",
      "relation": "construction"
    },
    {
      "sourceId": "A1",
      "targetId": "anguloB1",
      "relation": "construction"
    },
    {
      "sourceId": "A2",
      "targetId": "anguloB2",
      "relation": "construction"
    },
    {
      "sourceId": "B2",
      "targetId": "anguloB2",
      "relation": "construction"
    },
    {
      "sourceId": "C2",
      "targetId": "anguloB2",
      "relation": "construction"
    },
    {
      "sourceId": "A1",
      "targetId": "anguloC1",
      "relation": "construction"
    },
    {
      "sourceId": "C1",
      "targetId": "anguloC1",
      "relation": "construction"
    },
    {
      "sourceId": "B1",
      "targetId": "anguloC1",
      "relation": "construction"
    },
    {
      "sourceId": "B2",
      "targetId": "anguloC2",
      "relation": "construction"
    },
    {
      "sourceId": "C2",
      "targetId": "anguloC2",
      "relation": "construction"
    },
    {
      "sourceId": "A2",
      "targetId": "anguloC2",
      "relation": "construction"
    },
    {
      "sourceId": "A1",
      "targetId": "marcaAB1",
      "relation": "construction"
    },
    {
      "sourceId": "B1",
      "targetId": "marcaAB1",
      "relation": "construction"
    },
    {
      "sourceId": "A2",
      "targetId": "marcaAB2",
      "relation": "construction"
    },
    {
      "sourceId": "B2",
      "targetId": "marcaAB2",
      "relation": "construction"
    },
    {
      "sourceId": "A1",
      "targetId": "marcaAC1",
      "relation": "construction"
    },
    {
      "sourceId": "C1",
      "targetId": "marcaAC1",
      "relation": "construction"
    },
    {
      "sourceId": "A2",
      "targetId": "marcaAC2",
      "relation": "construction"
    },
    {
      "sourceId": "C2",
      "targetId": "marcaAC2",
      "relation": "construction"
    },
    {
      "sourceId": "B1",
      "targetId": "marcaBC1",
      "relation": "construction"
    },
    {
      "sourceId": "C1",
      "targetId": "marcaBC1",
      "relation": "construction"
    },
    {
      "sourceId": "B2",
      "targetId": "marcaBC2",
      "relation": "construction"
    },
    {
      "sourceId": "C2",
      "targetId": "marcaBC2",
      "relation": "construction"
    },
    {
      "sourceId": "A1",
      "targetId": "cotaAB1",
      "relation": "construction"
    },
    {
      "sourceId": "B1",
      "targetId": "cotaAB1",
      "relation": "construction"
    },
    {
      "sourceId": "A2",
      "targetId": "cotaAB2",
      "relation": "construction"
    },
    {
      "sourceId": "B2",
      "targetId": "cotaAB2",
      "relation": "construction"
    },
    {
      "sourceId": "A1",
      "targetId": "medidaA",
      "relation": "construction"
    },
    {
      "sourceId": "B1",
      "targetId": "medidaB",
      "relation": "construction"
    },
    {
      "sourceId": "A1",
      "targetId": "medidaA",
      "relation": "expression"
    },
    {
      "sourceId": "B1",
      "targetId": "medidaA",
      "relation": "expression"
    },
    {
      "sourceId": "C1",
      "targetId": "medidaA",
      "relation": "expression"
    },
    {
      "sourceId": "A1",
      "targetId": "medidaB",
      "relation": "expression"
    },
    {
      "sourceId": "B1",
      "targetId": "medidaB",
      "relation": "expression"
    },
    {
      "sourceId": "C1",
      "targetId": "medidaB",
      "relation": "expression"
    },
    {
      "sourceId": "A1",
      "targetId": "C1",
      "relation": "constraint",
      "constraintId": "mismoSemiplano"
    },
    {
      "sourceId": "B1",
      "targetId": "C1",
      "relation": "constraint",
      "constraintId": "mismoSemiplano"
    }
  ],
  "note": "Arrastre C: el segundo triángulo se recalcula como copia congruente. Las cotas, ángulos y marcas conservan la correspondencia ALA.",
  "extensions": {
    "acceptanceCase": "phase-5-congruence-ala"
  }
}
);
/* @matematika-diagram-spec:end */

export const CongruenciaALA = () => <DiagramRenderer spec={CongruenciaALASpec} />;
