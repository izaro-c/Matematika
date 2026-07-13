import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const ParalelogramoSpec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Paralelogramo",
  "componentId": "Paralelogramo",
  "category": "Definiciones",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "viewport": {
    "bounds": [
      -6,
      6,
      6,
      -5
    ],
    "home": [
      -6,
      6,
      6,
      -5
    ],
    "minZoom": 0.7,
    "maxZoom": 4,
    "padding": 0.18
  },
  "layers": [
    {
      "id": "construccion",
      "label": "Construcción",
      "order": 0,
      "visible": true,
      "locked": false
    },
    {
      "id": "relleno",
      "label": "Área",
      "order": 1,
      "visible": true,
      "locked": false
    },
    {
      "id": "lados",
      "label": "Lados",
      "order": 2,
      "visible": true,
      "locked": false
    },
    {
      "id": "vertices",
      "label": "Vértices derivados",
      "order": 3,
      "visible": true,
      "locked": false
    },
    {
      "id": "propiedades",
      "label": "Marcas y ángulos",
      "order": 4,
      "visible": true,
      "locked": false
    },
    {
      "id": "diagonales",
      "label": "Diagonales",
      "order": 5,
      "visible": true,
      "locked": false
    },
    {
      "id": "anotaciones",
      "label": "Clasificación y cotas",
      "order": 6,
      "visible": true,
      "locked": false
    }
  ],
  "groups": [
    {
      "id": "paralelogramoGrupo",
      "label": "Paralelogramo",
      "memberIds": [
        "A",
        "B",
        "C",
        "D",
        "poligono",
        "segAB",
        "segBC",
        "segCD",
        "segDA",
        "marcaAB",
        "marcaCD",
        "marcaBC",
        "marcaDA",
        "anguloA",
        "anguloB",
        "anguloC",
        "anguloD",
        "rectoA",
        "rectoB",
        "rectoC",
        "rectoD",
        "diagAC",
        "diagBD",
        "M",
        "cotaAM",
        "cotaMC",
        "clasificacion"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "primary"
      },
      "target": true,
      "targetId": "paralelogramo",
      "color": "pavo"
    },
    {
      "id": "ladosGrupo",
      "label": "Lados opuestos",
      "memberIds": [
        "segAB",
        "segBC",
        "segCD",
        "segDA",
        "marcaAB",
        "marcaCD",
        "marcaBC",
        "marcaDA"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "primary"
      },
      "target": true,
      "targetId": "lados-opuestos",
      "color": "terracota"
    },
    {
      "id": "angulosGrupo",
      "label": "Ángulos opuestos",
      "memberIds": [
        "anguloA",
        "anguloB",
        "anguloC",
        "anguloD"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "primary"
      },
      "target": true,
      "targetId": "angulos-opuestos",
      "color": "salvia"
    },
    {
      "id": "diagonalesGrupo",
      "label": "Diagonales y punto medio",
      "memberIds": [
        "diagAC",
        "diagBD",
        "M",
        "cotaAM",
        "cotaMC"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "primary"
      },
      "target": true,
      "targetId": "diagonales",
      "color": "pizarra"
    }
  ],
  "points": [
    {
      "id": "A",
      "label": "A",
      "color": "carbon",
      "layerId": "vertices",
      "order": 1,
      "visible": true,
      "locked": false,
      "groupIds": [
        "paralelogramoGrupo"
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
      "x": -3,
      "y": -2,
      "fixed": false,
      "constraint": "free"
    },
    {
      "id": "B",
      "label": "B",
      "color": "carbon",
      "layerId": "vertices",
      "order": 2,
      "visible": true,
      "locked": false,
      "groupIds": [
        "paralelogramoGrupo"
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
      "x": 2,
      "y": -2,
      "fixed": false,
      "constraint": "free"
    },
    {
      "id": "C",
      "label": "C",
      "color": "carbon",
      "layerId": "vertices",
      "order": 3,
      "visible": true,
      "locked": false,
      "groupIds": [
        "paralelogramoGrupo"
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
      "x": 4,
      "y": 2,
      "fixed": false,
      "constraint": "constrained",
      "constraintIds": [
        "ladoC"
      ]
    },
    {
      "id": "D",
      "label": "D",
      "color": "carbon",
      "layerId": "vertices",
      "order": 4,
      "visible": true,
      "locked": false,
      "groupIds": [
        "paralelogramoGrupo"
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
      "x": -1,
      "y": 2,
      "fixed": true,
      "constraint": "derived",
      "dependencies": [
        "A",
        "B",
        "C"
      ],
      "xExpression": "A.x+C.x-B.x",
      "yExpression": "A.y+C.y-B.y"
    }
  ],
  "elements": [
    {
      "id": "paralelaAB",
      "label": "paralela a AB por C",
      "color": "salvia",
      "layerId": "construccion",
      "order": 1,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2,
        "strokeOpacity": 0.75,
        "preserveColorOnHighlight": true
      },
      "kind": "parallel",
      "refs": [
        "A",
        "B",
        "C"
      ],
      "dashed": true
    },
    {
      "id": "paralelaBC",
      "label": "paralela a BC por A",
      "color": "salvia",
      "layerId": "construccion",
      "order": 2,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2,
        "strokeOpacity": 0.75,
        "preserveColorOnHighlight": true
      },
      "kind": "parallel",
      "refs": [
        "B",
        "C",
        "A"
      ],
      "dashed": true
    },
    {
      "id": "poligono",
      "label": "paralelogramo ABCD",
      "color": "pavo",
      "layerId": "relleno",
      "order": 1,
      "visible": true,
      "locked": false,
      "groupIds": [
        "paralelogramoGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.5,
        "fillOpacity": 0.08,
        "highlightFillOpacity": 0.25,
        "preserveColorOnHighlight": true
      },
      "kind": "polygon",
      "refs": [
        "A",
        "B",
        "C",
        "D"
      ]
    },
    {
      "id": "segAB",
      "label": "lado AB",
      "color": "terracota",
      "layerId": "lados",
      "order": 10,
      "visible": true,
      "locked": false,
      "groupIds": [
        "paralelogramoGrupo",
        "ladosGrupo"
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
        "A",
        "B"
      ]
    },
    {
      "id": "segBC",
      "label": "lado BC",
      "color": "pavo",
      "layerId": "lados",
      "order": 11,
      "visible": true,
      "locked": false,
      "groupIds": [
        "paralelogramoGrupo",
        "ladosGrupo"
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
        "B",
        "C"
      ]
    },
    {
      "id": "segCD",
      "label": "lado CD",
      "color": "terracota",
      "layerId": "lados",
      "order": 12,
      "visible": true,
      "locked": false,
      "groupIds": [
        "paralelogramoGrupo",
        "ladosGrupo"
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
        "C",
        "D"
      ]
    },
    {
      "id": "segDA",
      "label": "lado DA",
      "color": "pavo",
      "layerId": "lados",
      "order": 13,
      "visible": true,
      "locked": false,
      "groupIds": [
        "paralelogramoGrupo",
        "ladosGrupo"
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
        "D",
        "A"
      ]
    },
    {
      "id": "marcaAB",
      "label": "marca AB",
      "color": "carbon",
      "layerId": "propiedades",
      "order": 20,
      "visible": true,
      "locked": false,
      "groupIds": [
        "paralelogramoGrupo",
        "ladosGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 4,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "A",
        "B"
      ],
      "properties": {
        "markCount": 1
      }
    },
    {
      "id": "marcaCD",
      "label": "marca CD",
      "color": "carbon",
      "layerId": "propiedades",
      "order": 21,
      "visible": true,
      "locked": false,
      "groupIds": [
        "paralelogramoGrupo",
        "ladosGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 4,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "C",
        "D"
      ],
      "properties": {
        "markCount": 1
      }
    },
    {
      "id": "marcaBC",
      "label": "marcas BC",
      "color": "carbon",
      "layerId": "propiedades",
      "order": 22,
      "visible": true,
      "locked": false,
      "groupIds": [
        "paralelogramoGrupo",
        "ladosGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 4,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "B",
        "C"
      ],
      "properties": {
        "markCount": 2
      }
    },
    {
      "id": "marcaDA",
      "label": "marcas DA",
      "color": "carbon",
      "layerId": "propiedades",
      "order": 23,
      "visible": true,
      "locked": false,
      "groupIds": [
        "paralelogramoGrupo",
        "ladosGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 4,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "D",
        "A"
      ],
      "properties": {
        "markCount": 2
      }
    },
    {
      "id": "anguloA",
      "label": "ángulo A",
      "color": "salvia",
      "layerId": "propiedades",
      "order": 30,
      "visible": true,
      "locked": false,
      "groupIds": [
        "paralelogramoGrupo",
        "angulosGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.5,
        "fillOpacity": 0.22,
        "angleRadius": 0.85,
        "highlightFillOpacity": 0.45,
        "highlightVisible": true,
        "preserveColorOnHighlight": true
      },
      "kind": "angle",
      "refs": [
        "B",
        "A",
        "D"
      ],
      "properties": {
        "visibleWhen": "not(and(approx(abs(atan2(D.y-A.y,D.x-A.x)-atan2(B.y-A.y,B.x-A.x)),pi/2,0.1),approx(abs(atan2(A.y-B.y,A.x-B.x)-atan2(C.y-B.y,C.x-B.x)),pi/2,0.1),approx(abs(atan2(B.y-C.y,B.x-C.x)-atan2(D.y-C.y,D.x-C.x)),pi/2,0.1),approx(abs(atan2(C.y-D.y,C.x-D.x)-atan2(A.y-D.y,A.x-D.x)),pi/2,0.1)))"
      }
    },
    {
      "id": "anguloB",
      "label": "ángulo B",
      "color": "salvia",
      "layerId": "propiedades",
      "order": 31,
      "visible": true,
      "locked": false,
      "groupIds": [
        "paralelogramoGrupo",
        "angulosGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.5,
        "fillOpacity": 0.22,
        "angleRadius": 0.85,
        "highlightFillOpacity": 0.45,
        "highlightVisible": true,
        "preserveColorOnHighlight": true
      },
      "kind": "angle",
      "refs": [
        "C",
        "B",
        "A"
      ],
      "properties": {
        "visibleWhen": "not(and(approx(abs(atan2(D.y-A.y,D.x-A.x)-atan2(B.y-A.y,B.x-A.x)),pi/2,0.1),approx(abs(atan2(A.y-B.y,A.x-B.x)-atan2(C.y-B.y,C.x-B.x)),pi/2,0.1),approx(abs(atan2(B.y-C.y,B.x-C.x)-atan2(D.y-C.y,D.x-C.x)),pi/2,0.1),approx(abs(atan2(C.y-D.y,C.x-D.x)-atan2(A.y-D.y,A.x-D.x)),pi/2,0.1)))"
      }
    },
    {
      "id": "anguloC",
      "label": "ángulo C",
      "color": "salvia",
      "layerId": "propiedades",
      "order": 32,
      "visible": true,
      "locked": false,
      "groupIds": [
        "paralelogramoGrupo",
        "angulosGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.5,
        "fillOpacity": 0.22,
        "angleRadius": 0.85,
        "highlightFillOpacity": 0.45,
        "highlightVisible": true,
        "preserveColorOnHighlight": true
      },
      "kind": "angle",
      "refs": [
        "D",
        "C",
        "B"
      ],
      "properties": {
        "visibleWhen": "not(and(approx(abs(atan2(D.y-A.y,D.x-A.x)-atan2(B.y-A.y,B.x-A.x)),pi/2,0.1),approx(abs(atan2(A.y-B.y,A.x-B.x)-atan2(C.y-B.y,C.x-B.x)),pi/2,0.1),approx(abs(atan2(B.y-C.y,B.x-C.x)-atan2(D.y-C.y,D.x-C.x)),pi/2,0.1),approx(abs(atan2(C.y-D.y,C.x-D.x)-atan2(A.y-D.y,A.x-D.x)),pi/2,0.1)))"
      }
    },
    {
      "id": "anguloD",
      "label": "ángulo D",
      "color": "salvia",
      "layerId": "propiedades",
      "order": 33,
      "visible": true,
      "locked": false,
      "groupIds": [
        "paralelogramoGrupo",
        "angulosGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.5,
        "fillOpacity": 0.22,
        "angleRadius": 0.85,
        "highlightFillOpacity": 0.45,
        "highlightVisible": true,
        "preserveColorOnHighlight": true
      },
      "kind": "angle",
      "refs": [
        "A",
        "D",
        "C"
      ],
      "properties": {
        "visibleWhen": "not(and(approx(abs(atan2(D.y-A.y,D.x-A.x)-atan2(B.y-A.y,B.x-A.x)),pi/2,0.1),approx(abs(atan2(A.y-B.y,A.x-B.x)-atan2(C.y-B.y,C.x-B.x)),pi/2,0.1),approx(abs(atan2(B.y-C.y,B.x-C.x)-atan2(D.y-C.y,D.x-C.x)),pi/2,0.1),approx(abs(atan2(C.y-D.y,C.x-D.x)-atan2(A.y-D.y,A.x-D.x)),pi/2,0.1)))"
      }
    },
    {
      "id": "rectoA",
      "label": "ángulo recto A",
      "color": "ocre",
      "layerId": "propiedades",
      "order": 34,
      "visible": true,
      "locked": false,
      "groupIds": [
        "paralelogramoGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.5,
        "fillOpacity": 0.4,
        "angleRadius": 0.55,
        "preserveColorOnHighlight": true
      },
      "kind": "rightAngle",
      "refs": [
        "B",
        "A",
        "D"
      ],
      "properties": {
        "visibleWhen": "approx(abs(atan2(D.y-A.y,D.x-A.x)-atan2(B.y-A.y,B.x-A.x)),pi/2,0.1)"
      }
    },
    {
      "id": "rectoB",
      "label": "ángulo recto B",
      "color": "ocre",
      "layerId": "propiedades",
      "order": 35,
      "visible": true,
      "locked": false,
      "groupIds": [
        "paralelogramoGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.5,
        "fillOpacity": 0.4,
        "angleRadius": 0.55,
        "preserveColorOnHighlight": true
      },
      "kind": "rightAngle",
      "refs": [
        "C",
        "B",
        "A"
      ],
      "properties": {
        "visibleWhen": "approx(abs(atan2(A.y-B.y,A.x-B.x)-atan2(C.y-B.y,C.x-B.x)),pi/2,0.1)"
      }
    },
    {
      "id": "rectoC",
      "label": "ángulo recto C",
      "color": "ocre",
      "layerId": "propiedades",
      "order": 36,
      "visible": true,
      "locked": false,
      "groupIds": [
        "paralelogramoGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.5,
        "fillOpacity": 0.4,
        "angleRadius": 0.55,
        "preserveColorOnHighlight": true
      },
      "kind": "rightAngle",
      "refs": [
        "D",
        "C",
        "B"
      ],
      "properties": {
        "visibleWhen": "approx(abs(atan2(B.y-C.y,B.x-C.x)-atan2(D.y-C.y,D.x-C.x)),pi/2,0.1)"
      }
    },
    {
      "id": "rectoD",
      "label": "ángulo recto D",
      "color": "ocre",
      "layerId": "propiedades",
      "order": 37,
      "visible": true,
      "locked": false,
      "groupIds": [
        "paralelogramoGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.5,
        "fillOpacity": 0.4,
        "angleRadius": 0.55,
        "preserveColorOnHighlight": true
      },
      "kind": "rightAngle",
      "refs": [
        "A",
        "D",
        "C"
      ],
      "properties": {
        "visibleWhen": "approx(abs(atan2(C.y-D.y,C.x-D.x)-atan2(A.y-D.y,A.x-D.x)),pi/2,0.1)"
      }
    },
    {
      "id": "diagAC",
      "label": "diagonal AC",
      "color": "pizarra",
      "layerId": "diagonales",
      "order": 40,
      "visible": true,
      "locked": false,
      "groupIds": [
        "paralelogramoGrupo",
        "diagonalesGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.5,
        "highlightStrokeWidth": 4,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "A",
        "C"
      ],
      "dashed": true
    },
    {
      "id": "diagBD",
      "label": "diagonal BD",
      "color": "pizarra",
      "layerId": "diagonales",
      "order": 41,
      "visible": true,
      "locked": false,
      "groupIds": [
        "paralelogramoGrupo",
        "diagonalesGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.5,
        "highlightStrokeWidth": 4,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "B",
        "D"
      ],
      "dashed": true
    },
    {
      "id": "M",
      "label": "punto medio común M",
      "color": "carbon",
      "layerId": "diagonales",
      "order": 42,
      "visible": true,
      "locked": false,
      "groupIds": [
        "paralelogramoGrupo",
        "diagonalesGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "pointSize": 3,
        "highlightPointSize": 7,
        "preserveColorOnHighlight": true
      },
      "kind": "midpoint",
      "refs": [
        "A",
        "C"
      ]
    },
    {
      "id": "cotaAM",
      "label": "cota AM",
      "color": "pizarra",
      "layerId": "anotaciones",
      "order": 50,
      "visible": true,
      "locked": false,
      "groupIds": [
        "paralelogramoGrupo",
        "diagonalesGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.2,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "dimensionLine",
      "refs": [
        "A",
        "M"
      ],
      "text": "AM = {value}",
      "properties": {
        "unit": "u",
        "precision": 2,
        "offset": 0.3
      }
    },
    {
      "id": "cotaMC",
      "label": "cota MC",
      "color": "pizarra",
      "layerId": "anotaciones",
      "order": 51,
      "visible": true,
      "locked": false,
      "groupIds": [
        "paralelogramoGrupo",
        "diagonalesGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.2,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "dimensionLine",
      "refs": [
        "M",
        "C"
      ],
      "text": "MC = {value}",
      "properties": {
        "unit": "u",
        "precision": 2,
        "offset": 0.3
      }
    },
    {
      "id": "clasificacion",
      "label": "clasificación dinámica",
      "color": "carbon",
      "layerId": "anotaciones",
      "order": 52,
      "visible": true,
      "locked": false,
      "groupIds": [
        "paralelogramoGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "textOffset": [
          -2.5,
          7.5
        ],
        "preserveColorOnHighlight": true
      },
      "kind": "infoPanel",
      "refs": [
        "A"
      ],
      "text": "<strong>Paralelogramo</strong><br/><small>2 pares ∥ · lados y ángulos opuestos ≡ · diagonales se bisecan</small>",
      "properties": {
        "title": "Clasificación",
        "textRules": [
          {
            "when": "and(and(approx(segAB.length,segBC.length,0.15),approx(segBC.length,segCD.length,0.15),approx(segCD.length,segDA.length,0.15)),and(approx((D.x-A.x)*(B.x-A.x)+(D.y-A.y)*(B.y-A.y),0,0.15),approx((A.x-B.x)*(C.x-B.x)+(A.y-B.y)*(C.y-B.y),0,0.15),approx((B.x-C.x)*(D.x-C.x)+(B.y-C.y)*(D.y-C.y),0,0.15),approx((C.x-D.x)*(A.x-D.x)+(C.y-D.y)*(A.y-D.y),0,0.15)))",
            "text": "<strong>Cuadrado</strong><br/><small>4 lados ≡ · 4 ángulos rectos · diagonales ⟂ y ≡</small>"
          },
          {
            "when": "and(approx((D.x-A.x)*(B.x-A.x)+(D.y-A.y)*(B.y-A.y),0,0.15),approx((A.x-B.x)*(C.x-B.x)+(A.y-B.y)*(C.y-B.y),0,0.15),approx((B.x-C.x)*(D.x-C.x)+(B.y-C.y)*(D.y-C.y),0,0.15),approx((C.x-D.x)*(A.x-D.x)+(C.y-D.y)*(A.y-D.y),0,0.15))",
            "text": "<strong>Rectángulo</strong><br/><small>4 ángulos rectos · diagonales ≡</small>"
          },
          {
            "when": "and(approx(segAB.length,segBC.length,0.15),approx(segBC.length,segCD.length,0.15),approx(segCD.length,segDA.length,0.15))",
            "text": "<strong>Rombo</strong><br/><small>4 lados ≡ · diagonales ⟂</small>"
          },
          {
            "when": "1",
            "text": "<strong>Paralelogramo</strong><br/><small>2 pares ∥ · lados y ángulos opuestos ≡ · diagonales se bisecan</small>"
          }
        ]
      }
    }
  ],
  "sliders": [],
  "steps": [
    {
      "id": "step1",
      "label": "Construcción por paralelas",
      "description": "D queda determinado por las paralelas trazadas por A y C.",
      "visibleTargets": [
        "A",
        "B",
        "C",
        "D",
        "paralelaAB",
        "paralelaBC"
      ],
      "durationMs": 1000,
      "objectStates": {
        "paralelaAB": {
          "visible": true,
          "emphasis": "secondary"
        },
        "paralelaBC": {
          "visible": true,
          "emphasis": "secondary"
        },
        "D": {
          "emphasis": "primary"
        }
      }
    },
    {
      "id": "step2",
      "label": "Lados y ángulos opuestos",
      "description": "Se muestran las igualdades heredadas del paralelismo.",
      "visibleTargets": [
        "A",
        "B",
        "C",
        "D",
        "poligono",
        "segAB",
        "segBC",
        "segCD",
        "segDA",
        "marcaAB",
        "marcaCD",
        "marcaBC",
        "marcaDA",
        "anguloA",
        "anguloB",
        "anguloC",
        "anguloD",
        "rectoA",
        "rectoB",
        "rectoC",
        "rectoD",
        "clasificacion"
      ],
      "durationMs": 1200,
      "objectStates": {
        "poligono": {
          "emphasis": "primary"
        },
        "marcaAB": {
          "emphasis": "secondary"
        },
        "marcaCD": {
          "emphasis": "secondary"
        }
      }
    },
    {
      "id": "step3",
      "label": "Bisección de diagonales",
      "description": "Las diagonales se cortan en su punto medio común M.",
      "visibleTargets": [
        "A",
        "B",
        "C",
        "D",
        "poligono",
        "segAB",
        "segBC",
        "segCD",
        "segDA",
        "marcaAB",
        "marcaCD",
        "marcaBC",
        "marcaDA",
        "anguloA",
        "anguloB",
        "anguloC",
        "anguloD",
        "rectoA",
        "rectoB",
        "rectoC",
        "rectoD",
        "clasificacion",
        "diagAC",
        "diagBD",
        "M",
        "cotaAM",
        "cotaMC"
      ],
      "durationMs": 1200,
      "objectStates": {
        "diagAC": {
          "emphasis": "primary"
        },
        "diagBD": {
          "emphasis": "primary"
        },
        "M": {
          "emphasis": "primary"
        },
        "cotaAM": {
          "overlay": {
            "visible": true,
            "title": "Bisección de AC",
            "content": "AM = {value}",
            "expression": "cotaAM.length",
            "unit": "u",
            "precision": 2,
            "position": "bottom-right"
          }
        }
      }
    }
  ],
  "constraints": [
    {
      "id": "ladoC",
      "label": "C conserva la orientación respecto de AB",
      "kind": "sameSide",
      "refs": [
        "C",
        "A",
        "B"
      ],
      "enabled": true
    }
  ],
  "dependencies": [
    {
      "sourceId": "A",
      "targetId": "D",
      "relation": "expression"
    },
    {
      "sourceId": "B",
      "targetId": "D",
      "relation": "expression"
    },
    {
      "sourceId": "C",
      "targetId": "D",
      "relation": "expression"
    },
    {
      "sourceId": "A",
      "targetId": "paralelaAB",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "paralelaAB",
      "relation": "construction"
    },
    {
      "sourceId": "C",
      "targetId": "paralelaAB",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "paralelaBC",
      "relation": "construction"
    },
    {
      "sourceId": "C",
      "targetId": "paralelaBC",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "paralelaBC",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "poligono",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "poligono",
      "relation": "construction"
    },
    {
      "sourceId": "C",
      "targetId": "poligono",
      "relation": "construction"
    },
    {
      "sourceId": "D",
      "targetId": "poligono",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "segAB",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "segAB",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "segBC",
      "relation": "construction"
    },
    {
      "sourceId": "C",
      "targetId": "segBC",
      "relation": "construction"
    },
    {
      "sourceId": "C",
      "targetId": "segCD",
      "relation": "construction"
    },
    {
      "sourceId": "D",
      "targetId": "segCD",
      "relation": "construction"
    },
    {
      "sourceId": "D",
      "targetId": "segDA",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "segDA",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "marcaAB",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "marcaAB",
      "relation": "construction"
    },
    {
      "sourceId": "C",
      "targetId": "marcaCD",
      "relation": "construction"
    },
    {
      "sourceId": "D",
      "targetId": "marcaCD",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "marcaBC",
      "relation": "construction"
    },
    {
      "sourceId": "C",
      "targetId": "marcaBC",
      "relation": "construction"
    },
    {
      "sourceId": "D",
      "targetId": "marcaDA",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "marcaDA",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "anguloA",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "anguloA",
      "relation": "construction"
    },
    {
      "sourceId": "D",
      "targetId": "anguloA",
      "relation": "construction"
    },
    {
      "sourceId": "C",
      "targetId": "anguloB",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "anguloB",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "anguloB",
      "relation": "construction"
    },
    {
      "sourceId": "D",
      "targetId": "anguloC",
      "relation": "construction"
    },
    {
      "sourceId": "C",
      "targetId": "anguloC",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "anguloC",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "anguloD",
      "relation": "construction"
    },
    {
      "sourceId": "D",
      "targetId": "anguloD",
      "relation": "construction"
    },
    {
      "sourceId": "C",
      "targetId": "anguloD",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "rectoA",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "rectoA",
      "relation": "construction"
    },
    {
      "sourceId": "D",
      "targetId": "rectoA",
      "relation": "construction"
    },
    {
      "sourceId": "C",
      "targetId": "rectoB",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "rectoB",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "rectoB",
      "relation": "construction"
    },
    {
      "sourceId": "D",
      "targetId": "rectoC",
      "relation": "construction"
    },
    {
      "sourceId": "C",
      "targetId": "rectoC",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "rectoC",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "rectoD",
      "relation": "construction"
    },
    {
      "sourceId": "D",
      "targetId": "rectoD",
      "relation": "construction"
    },
    {
      "sourceId": "C",
      "targetId": "rectoD",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "diagAC",
      "relation": "construction"
    },
    {
      "sourceId": "C",
      "targetId": "diagAC",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "diagBD",
      "relation": "construction"
    },
    {
      "sourceId": "D",
      "targetId": "diagBD",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "M",
      "relation": "construction"
    },
    {
      "sourceId": "C",
      "targetId": "M",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "cotaAM",
      "relation": "construction"
    },
    {
      "sourceId": "M",
      "targetId": "cotaAM",
      "relation": "construction"
    },
    {
      "sourceId": "M",
      "targetId": "cotaMC",
      "relation": "construction"
    },
    {
      "sourceId": "C",
      "targetId": "cotaMC",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "clasificacion",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "C",
      "relation": "constraint",
      "constraintId": "ladoC"
    },
    {
      "sourceId": "B",
      "targetId": "C",
      "relation": "constraint",
      "constraintId": "ladoC"
    },
    {
      "sourceId": "D",
      "targetId": "anguloA",
      "relation": "expression"
    },
    {
      "sourceId": "A",
      "targetId": "anguloA",
      "relation": "expression"
    },
    {
      "sourceId": "B",
      "targetId": "anguloA",
      "relation": "expression"
    },
    {
      "sourceId": "C",
      "targetId": "anguloA",
      "relation": "expression"
    },
    {
      "sourceId": "D",
      "targetId": "anguloB",
      "relation": "expression"
    },
    {
      "sourceId": "A",
      "targetId": "anguloB",
      "relation": "expression"
    },
    {
      "sourceId": "B",
      "targetId": "anguloB",
      "relation": "expression"
    },
    {
      "sourceId": "C",
      "targetId": "anguloB",
      "relation": "expression"
    },
    {
      "sourceId": "D",
      "targetId": "anguloC",
      "relation": "expression"
    },
    {
      "sourceId": "A",
      "targetId": "anguloC",
      "relation": "expression"
    },
    {
      "sourceId": "B",
      "targetId": "anguloC",
      "relation": "expression"
    },
    {
      "sourceId": "C",
      "targetId": "anguloC",
      "relation": "expression"
    },
    {
      "sourceId": "D",
      "targetId": "anguloD",
      "relation": "expression"
    },
    {
      "sourceId": "A",
      "targetId": "anguloD",
      "relation": "expression"
    },
    {
      "sourceId": "B",
      "targetId": "anguloD",
      "relation": "expression"
    },
    {
      "sourceId": "C",
      "targetId": "anguloD",
      "relation": "expression"
    },
    {
      "sourceId": "D",
      "targetId": "rectoA",
      "relation": "expression"
    },
    {
      "sourceId": "A",
      "targetId": "rectoA",
      "relation": "expression"
    },
    {
      "sourceId": "B",
      "targetId": "rectoA",
      "relation": "expression"
    },
    {
      "sourceId": "A",
      "targetId": "rectoB",
      "relation": "expression"
    },
    {
      "sourceId": "B",
      "targetId": "rectoB",
      "relation": "expression"
    },
    {
      "sourceId": "C",
      "targetId": "rectoB",
      "relation": "expression"
    },
    {
      "sourceId": "B",
      "targetId": "rectoC",
      "relation": "expression"
    },
    {
      "sourceId": "C",
      "targetId": "rectoC",
      "relation": "expression"
    },
    {
      "sourceId": "D",
      "targetId": "rectoC",
      "relation": "expression"
    },
    {
      "sourceId": "C",
      "targetId": "rectoD",
      "relation": "expression"
    },
    {
      "sourceId": "D",
      "targetId": "rectoD",
      "relation": "expression"
    },
    {
      "sourceId": "A",
      "targetId": "rectoD",
      "relation": "expression"
    },
    {
      "sourceId": "segAB",
      "targetId": "clasificacion",
      "relation": "expression"
    },
    {
      "sourceId": "segBC",
      "targetId": "clasificacion",
      "relation": "expression"
    },
    {
      "sourceId": "segCD",
      "targetId": "clasificacion",
      "relation": "expression"
    },
    {
      "sourceId": "segDA",
      "targetId": "clasificacion",
      "relation": "expression"
    },
    {
      "sourceId": "D",
      "targetId": "clasificacion",
      "relation": "expression"
    },
    {
      "sourceId": "A",
      "targetId": "clasificacion",
      "relation": "expression"
    },
    {
      "sourceId": "B",
      "targetId": "clasificacion",
      "relation": "expression"
    },
    {
      "sourceId": "C",
      "targetId": "clasificacion",
      "relation": "expression"
    }
  ],
  "note": "Arrastre A, B o C. D y M son derivados; las restricciones conservan un paralelogramo no degenerado.",
  "extensions": {
    "acceptanceCase": "phase-5-complex-quadrilateral"
  }
}
);
/* @matematika-diagram-spec:end */

export const Paralelogramo = () => <DiagramRenderer spec={ParalelogramoSpec} />;
