import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const CongruenciaALASpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
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
        "marcaAB1",
        "marcaAB2",
        "marcaAC1",
        "marcaAC2",
        "marcaBC1",
        "marcaBC2",
        "cotaAB1",
        "cotaAB2",
        "medidaA",
        "medidaB",
        "anguloC1",
        "anguloC2",
        "anguloA2",
        "anguloB2",
        "anguloB1",
        "anguloA1"
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
        "medidaA",
        "anguloA2",
        "anguloA1"
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
        "medidaB",
        "anguloB1",
        "anguloB2"
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
  "objects": [
    {
      "id": "A1",
      "label": "A",
      "color": "salvia",
      "layerId": "geometria",
      "order": 7015,
      "visible": true,
      "locked": false,
      "groupIds": [
        "globalGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "primary"
      },
      "target": true,
      "targetId": "A1",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0,
        "y": 0
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 7,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "B1",
      "label": "B",
      "color": "salvia",
      "layerId": "geometria",
      "order": 1015,
      "visible": true,
      "locked": false,
      "groupIds": [
        "globalGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "primary"
      },
      "target": true,
      "targetId": "B1",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 5,
        "y": 0
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 7,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "C1",
      "label": "C",
      "color": "salvia",
      "layerId": "geometria",
      "order": 3015,
      "visible": true,
      "locked": false,
      "groupIds": [
        "globalGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "primary"
      },
      "target": true,
      "targetId": "C1",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.5,
        "y": 4.3
      },
      "mobility": {
        "type": "constrained",
        "relationIds": [
          "mismoSemiplano"
        ]
      },
      "appearance": {
        "size": 7,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "A2",
      "label": "A′",
      "color": "pavo",
      "layerId": "geometria",
      "order": 8015,
      "visible": true,
      "locked": false,
      "groupIds": [
        "globalGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "primary"
      },
      "target": true,
      "targetId": "A2",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0,
        "y": -3
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 7,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "B2",
      "label": "B′",
      "color": "pavo",
      "layerId": "geometria",
      "order": 9015,
      "visible": true,
      "locked": false,
      "groupIds": [
        "globalGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "primary"
      },
      "target": true,
      "targetId": "B2",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 5,
        "y": -3
      },
      "mobility": {
        "type": "constrained",
        "relationIds": [
          "equalLengthsegAB2"
        ]
      },
      "appearance": {
        "size": 7,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "C2",
      "label": "C′",
      "color": "pavo",
      "layerId": "geometria",
      "order": 6015,
      "visible": true,
      "locked": false,
      "groupIds": [
        "globalGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "primary"
      },
      "target": true,
      "targetId": "C2",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 1.5,
        "y": -7
      },
      "mobility": {
        "type": "constrained",
        "relationIds": [
          "equalAngleanguloA2",
          "equalAngleanguloB2"
        ]
      },
      "appearance": {
        "size": 7,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
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
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "A1",
          "B1",
          "C1"
        ]
      },
      "appearance": {
        "strokeWidth": 3,
        "fillOpacity": 0.07,
        "highlightFillOpacity": 0.22,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "A2",
          "B2",
          "C2"
        ]
      },
      "appearance": {
        "strokeWidth": 3,
        "fillOpacity": 0.07,
        "highlightStrokeWidth": 5,
        "highlightFillOpacity": 0.22,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segAB1",
      "label": "lado AB",
      "color": "salvia",
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
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "A1",
          "B1"
        ]
      },
      "appearance": {
        "strokeWidth": 3,
        "highlightStrokeWidth": 5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segAC1",
      "label": "lado AC",
      "color": "salvia",
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
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "A1",
          "C1"
        ]
      },
      "appearance": {
        "strokeWidth": 2.5,
        "highlightStrokeWidth": 4.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segBC1",
      "label": "lado BC",
      "color": "salvia",
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
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "B1",
          "C1"
        ]
      },
      "appearance": {
        "strokeWidth": 2.5,
        "highlightStrokeWidth": 4.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segAB2",
      "label": "lado A′B′",
      "color": "pavo",
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
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "A2",
          "B2"
        ]
      },
      "appearance": {
        "strokeWidth": 3,
        "highlightStrokeWidth": 5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segAC2",
      "label": "lado A′C′",
      "color": "pavo",
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
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "A2",
          "C2"
        ]
      },
      "appearance": {
        "strokeWidth": 2.5,
        "highlightStrokeWidth": 4.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segBC2",
      "label": "lado B′C′",
      "color": "pavo",
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
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "B2",
          "C2"
        ]
      },
      "appearance": {
        "strokeWidth": 2.5,
        "highlightStrokeWidth": 4.5,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "A1",
          "B1"
        ]
      },
      "count": 1,
      "height": 0.6,
      "appearance": {
        "strokeWidth": 2.2,
        "preserveColorOnHighlight": true
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
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "A2",
          "B2"
        ]
      },
      "count": 1,
      "height": 0.6,
      "appearance": {
        "strokeWidth": 2.2,
        "preserveColorOnHighlight": true
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
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "A1",
          "C1"
        ]
      },
      "count": 2,
      "height": 0.6,
      "appearance": {
        "strokeWidth": 2.2,
        "preserveColorOnHighlight": true
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
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "A2",
          "C2"
        ]
      },
      "count": 2,
      "height": 0.6,
      "appearance": {
        "strokeWidth": 2.2,
        "preserveColorOnHighlight": true
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
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "B1",
          "C1"
        ]
      },
      "count": 3,
      "height": 0.6,
      "appearance": {
        "strokeWidth": 2.2,
        "preserveColorOnHighlight": true
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
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "B2",
          "C2"
        ]
      },
      "count": 3,
      "height": 0.6,
      "appearance": {
        "strokeWidth": 2.2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "cotaAB1",
      "label": "cota AB",
      "color": "salvia",
      "layerId": "cotas",
      "order": -3000,
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
      "objectType": "path",
      "geometry": {
        "type": "dimension",
        "points": [
          "A1",
          "B1"
        ],
        "offset": 0
      },
      "appearance": {
        "strokeWidth": 1.5,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "cotaAB2",
      "label": "cota A′B′",
      "color": "pavo",
      "layerId": "cotas",
      "order": -4000,
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
      "objectType": "path",
      "geometry": {
        "type": "dimension",
        "points": [
          "A2",
          "B2"
        ],
        "offset": 0
      },
      "appearance": {
        "strokeWidth": 1.5,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
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
      "objectType": "annotation",
      "variant": "measurement",
      "content": {
        "text": "∠A = {value}",
        "expression": "abs(atan2(C1.y-A1.y,C1.x-A1.x)-atan2(B1.y-A1.y,B1.x-A1.x))*180/pi",
        "unit": "°",
        "precision": 0
      },
      "anchor": {
        "type": "object",
        "object": "A1",
        "offset": [
          -2.4,
          7.5
        ]
      },
      "measurement": {
        "refs": [
          "A1"
        ],
        "mode": "value"
      },
      "appearance": {
        "preserveColorOnHighlight": true
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
      "objectType": "annotation",
      "variant": "measurement",
      "content": {
        "text": "∠B = {value}",
        "expression": "abs(atan2(C1.y-B1.y,C1.x-B1.x)-atan2(A1.y-B1.y,A1.x-B1.x))*180/pi",
        "unit": "°",
        "precision": 0
      },
      "anchor": {
        "type": "object",
        "object": "B1",
        "offset": [
          -5.5,
          7.5
        ]
      },
      "measurement": {
        "refs": [
          "B1"
        ],
        "mode": "value"
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "anguloA1",
      "label": "Ángulo no reflejo (≤ 180°)",
      "color": "terracota",
      "layerId": "angulos",
      "order": 2000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "globalGrupo",
        "anguloAGrupo"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "anguloA1",
      "objectType": "angle",
      "points": [
        "B1",
        "A1",
        "C1"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 1,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "anguloB1",
      "label": "Ángulo no reflejo (≤ 180°)",
      "color": "musgo",
      "layerId": "angulos",
      "order": 3000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "anguloBGrupo",
        "globalGrupo"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "anguloB1",
      "objectType": "angle",
      "points": [
        "C1",
        "B1",
        "A1"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 1,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "anguloC1",
      "label": "Ángulo no reflejo (≤ 180°)",
      "color": "ocre",
      "layerId": "angulos",
      "order": 4000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "globalGrupo"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "anguloC1",
      "objectType": "angle",
      "points": [
        "B1",
        "C1",
        "A1"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 1,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "anguloB2",
      "label": "Ángulo no reflejo (≤ 180°)",
      "color": "musgo",
      "layerId": "angulos",
      "order": 5000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "globalGrupo",
        "anguloBGrupo"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "anguloB2",
      "objectType": "angle",
      "points": [
        "A2",
        "B2",
        "C2"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 1,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "anguloA2",
      "label": "Ángulo no reflejo (≤ 180°)",
      "color": "terracota",
      "layerId": "angulos",
      "order": 6000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "globalGrupo",
        "anguloAGrupo"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "anguloA2",
      "objectType": "angle",
      "points": [
        "B2",
        "A2",
        "C2"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 1,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "anguloC2",
      "label": "Ángulo no reflejo (≤ 180°)",
      "color": "ocre",
      "layerId": "angulos",
      "order": 7000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "globalGrupo"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "anguloC2",
      "objectType": "angle",
      "points": [
        "A2",
        "C2",
        "B2"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 1,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [
    {
      "id": "mismoSemiplano",
      "label": "C conserva la orientación del triángulo",
      "enabled": true,
      "type": "same-half-plane",
      "points": [
        "C1",
        "A1"
      ],
      "boundary": "B1"
    },
    {
      "id": "equalLengthsegAB2",
      "label": "lado A′B′ tiene la misma longitud que lado AB",
      "enabled": true,
      "type": "equal-length",
      "segments": [
        "segAB2",
        "segAB1"
      ],
      "drivenPoint": "B2"
    },
    {
      "id": "equalAngleanguloA2",
      "label": "Ángulo no reflejo (≤ 180°) tiene la misma amplitud que Ángulo no reflejo (≤ 180°)",
      "enabled": true,
      "type": "equal-angle",
      "angles": [
        "anguloA2",
        "anguloA1"
      ],
      "drivenPoint": "C2"
    },
    {
      "id": "equalAngleanguloB2",
      "label": "Ángulo no reflejo (≤ 180°) tiene la misma amplitud que Ángulo no reflejo (≤ 180°)",
      "enabled": true,
      "type": "equal-angle",
      "angles": [
        "anguloB2",
        "anguloB1"
      ],
      "drivenPoint": "C2"
    }
  ],
  "steps": [],
  "note": "Arrastra A, B y C"
}
);
/* @matematika-diagram-spec:end */

export const CongruenciaALA = () => <DiagramRenderer spec={CongruenciaALASpec} />;
