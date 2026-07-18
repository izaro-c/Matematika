import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const CuadrilateroSpec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Cuadrilátero",
  "componentId": "cuadrilatero",
  "category": "Definiciones",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "viewport": {
    "bounds": [
      -5.4,
      4.5,
      5.4,
      -4.2
    ],
    "home": [
      -5.4,
      4.5,
      5.4,
      -4.2
    ],
    "minZoom": 0.55,
    "maxZoom": 5,
    "padding": 0.16
  },
  "layers": [
    {
      "id": "guides",
      "label": "Guías magnéticas",
      "order": 0,
      "visible": true,
      "locked": false
    },
    {
      "id": "geometry",
      "label": "Cuadrilátero",
      "order": 1,
      "visible": true,
      "locked": false
    },
    {
      "id": "properties",
      "label": "Marcas de clasificación",
      "order": 2,
      "visible": true,
      "locked": false
    },
    {
      "id": "details",
      "label": "Elementos bajo demanda",
      "order": 3,
      "visible": true,
      "locked": false
    },
    {
      "id": "annotations",
      "label": "Clasificación",
      "order": 4,
      "visible": true,
      "locked": false
    }
  ],
  "groups": [
    {
      "id": "grupoPoligono",
      "label": "Cuadrilátero ABCD",
      "memberIds": [
        "poligono"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Cuadrilátero ABCD",
        "role": "primary"
      },
      "target": true,
      "targetId": "poligono",
      "color": "salvia"
    },
    {
      "id": "grupoLados",
      "label": "Cuatro lados",
      "memberIds": [
        "AB",
        "BC",
        "CD",
        "DA"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Cuatro lados",
        "role": "primary"
      },
      "target": true,
      "targetId": "lados",
      "color": "carbon"
    },
    {
      "id": "grupoVertices",
      "label": "Cuatro vértices",
      "memberIds": [
        "A",
        "B",
        "C",
        "D"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Cuatro vértices",
        "role": "primary"
      },
      "target": true,
      "targetId": "vertices",
      "color": "terracota"
    },
    {
      "id": "grupoMoviles",
      "label": "Vértices móviles C y D",
      "memberIds": [
        "C",
        "D"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Vértices móviles C y D",
        "role": "primary"
      },
      "target": true,
      "targetId": "vertices-moviles",
      "color": "terracota"
    },
    {
      "id": "grupoParalelismo",
      "label": "Lados opuestos paralelos",
      "memberIds": [
        "parAB",
        "parCD",
        "parBC",
        "parDA"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Marcas de lados opuestos paralelos",
        "role": "primary"
      },
      "target": true,
      "targetId": "paralelismo",
      "color": "pavo"
    },
    {
      "id": "grupoIgualdad",
      "label": "Lados congruentes",
      "memberIds": [
        "igualTodoAB",
        "igualTodoBC",
        "igualTodoCD",
        "igualTodoDA",
        "cometaACAB",
        "cometaACDA",
        "cometaACBC",
        "cometaACCD",
        "cometaBDAB",
        "cometaBDBC",
        "cometaBDCD",
        "cometaBDDA"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Marcas de lados congruentes",
        "role": "primary"
      },
      "target": true,
      "targetId": "lados-iguales",
      "color": "ocre"
    },
    {
      "id": "grupoRectos",
      "label": "Cuatro ángulos rectos",
      "memberIds": [
        "rectoA",
        "rectoB",
        "rectoC",
        "rectoD"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Cuatro ángulos rectos",
        "role": "primary"
      },
      "target": true,
      "targetId": "angulos-rectos",
      "color": "ocre"
    },
    {
      "id": "grupoAngulos",
      "label": "Cuatro ángulos interiores",
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
        "dimOthersOnHighlight": false,
        "ariaLabel": "Cuatro ángulos interiores",
        "role": "primary"
      },
      "target": true,
      "targetId": "angulos",
      "color": "ocre"
    },
    {
      "id": "grupoDiagonales",
      "label": "Dos diagonales",
      "memberIds": [
        "AC",
        "BD"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Dos diagonales",
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
      "layerId": "geometry",
      "order": 1250,
      "visible": true,
      "locked": true,
      "groupIds": [
        "grupoVertices"
      ],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Vértice fijo A",
        "role": "primary"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "labelOffset": [
          -17,
          9
        ],
        "labelSize": 19,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -3,
      "y": -2,
      "showLabel": true,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "B",
      "label": "B",
      "color": "carbon",
      "layerId": "geometry",
      "order": 2250,
      "visible": true,
      "locked": true,
      "groupIds": [
        "grupoVertices"
      ],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Vértice fijo B",
        "role": "primary"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "labelOffset": [
          10,
          9
        ],
        "labelSize": 19,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 2,
      "y": -2,
      "showLabel": true,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "C",
      "label": "C",
      "color": "terracota",
      "layerId": "geometry",
      "order": 3250,
      "visible": true,
      "locked": false,
      "groupIds": [
        "grupoVertices",
        "grupoMoviles"
      ],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Mueve C para cambiar el cuadrilátero",
        "role": "primary"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "labelOffset": [
          10,
          -18
        ],
        "labelSize": 19,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 2.75,
      "y": 1.35,
      "showLabel": true,
      "fixed": false,
      "constraint": "constrained",
      "constraintIds": [
        "CEncimaAB",
        "CNoCruzaBD"
      ],
      "snapToGrid": true,
      "snapSize": 0.25,
      "attractorIds": [
        "guiaRectoB",
        "guiaIgualBC"
      ],
      "attractorDistance": 0.42,
      "snatchDistance": 0.6
    },
    {
      "id": "D",
      "label": "D",
      "color": "terracota",
      "layerId": "geometry",
      "order": 4250,
      "visible": true,
      "locked": false,
      "groupIds": [
        "grupoVertices",
        "grupoMoviles"
      ],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Mueve D para clasificar el cuadrilátero",
        "role": "primary"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "labelOffset": [
          -18,
          -18
        ],
        "labelSize": 19,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -1.6,
      "y": 2.45,
      "showLabel": true,
      "fixed": false,
      "constraint": "constrained",
      "constraintIds": [
        "DEncimaAB",
        "DNoCruzaAC"
      ],
      "snapToGrid": true,
      "snapSize": 0.25,
      "attractorIds": [
        "guiaParalelaCD",
        "guiaParalelaDA",
        "guiaRectoA",
        "guiaIgualDA",
        "guiaIgualCD"
      ],
      "attractorDistance": 0.42,
      "snatchDistance": 0.6
    }
  ],
  "elements": [
    {
      "id": "guiaRectoB",
      "label": "Guía perpendicular en B",
      "color": "pizarra",
      "layerId": "guides",
      "order": 10,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Guía magnética de ángulo recto en B",
        "role": "construction"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.2,
        "strokeOpacity": 0.2,
        "highlightStrokeWidth": 4.2,
        "preserveColorOnHighlight": true
      },
      "kind": "perpendicular",
      "refs": [
        "A",
        "B",
        "B"
      ]
    },
    {
      "id": "guiaIgualBC",
      "label": "Guía circular BC igual a AB",
      "color": "pizarra",
      "layerId": "guides",
      "order": 20,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Guía magnética para BC igual a AB",
        "role": "construction"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.2,
        "strokeOpacity": 0.2,
        "highlightStrokeWidth": 4.2,
        "preserveColorOnHighlight": true
      },
      "kind": "circle",
      "refs": [
        "B",
        "A"
      ]
    },
    {
      "id": "guiaParalelaCD",
      "label": "Guía CD paralela a AB",
      "color": "pizarra",
      "layerId": "guides",
      "order": 30,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Guía magnética para CD paralela a AB",
        "role": "construction"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.2,
        "strokeOpacity": 0.2,
        "highlightStrokeWidth": 4.2,
        "preserveColorOnHighlight": true
      },
      "kind": "parallel",
      "refs": [
        "A",
        "B",
        "C"
      ]
    },
    {
      "id": "guiaParalelaDA",
      "label": "Guía DA paralela a BC",
      "color": "pizarra",
      "layerId": "guides",
      "order": 40,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Guía magnética para DA paralela a BC",
        "role": "construction"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.2,
        "strokeOpacity": 0.2,
        "highlightStrokeWidth": 4.2,
        "preserveColorOnHighlight": true
      },
      "kind": "parallel",
      "refs": [
        "B",
        "C",
        "A"
      ]
    },
    {
      "id": "guiaRectoA",
      "label": "Guía perpendicular en A",
      "color": "pizarra",
      "layerId": "guides",
      "order": 50,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Guía magnética de ángulo recto en A",
        "role": "construction"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.2,
        "strokeOpacity": 0.2,
        "highlightStrokeWidth": 4.2,
        "preserveColorOnHighlight": true
      },
      "kind": "perpendicular",
      "refs": [
        "A",
        "B",
        "A"
      ]
    },
    {
      "id": "guiaIgualDA",
      "label": "Guía circular DA igual a AB",
      "color": "pizarra",
      "layerId": "guides",
      "order": 60,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Guía magnética para DA igual a AB",
        "role": "construction"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.2,
        "strokeOpacity": 0.2,
        "highlightStrokeWidth": 4.2,
        "preserveColorOnHighlight": true
      },
      "kind": "circle",
      "refs": [
        "A",
        "B"
      ]
    },
    {
      "id": "guiaIgualCD",
      "label": "Guía circular CD igual a CB",
      "color": "pizarra",
      "layerId": "guides",
      "order": 70,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Guía magnética para CD igual a CB",
        "role": "construction"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.2,
        "strokeOpacity": 0.2,
        "highlightStrokeWidth": 4.2,
        "preserveColorOnHighlight": true
      },
      "kind": "circle",
      "refs": [
        "C",
        "B"
      ]
    },
    {
      "id": "poligono",
      "label": "Cuadrilátero ABCD",
      "color": "salvia",
      "layerId": "geometry",
      "order": 200,
      "visible": true,
      "locked": false,
      "groupIds": [
        "grupoPoligono"
      ],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Cuadrilátero ABCD",
        "role": "primary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.4,
        "fillOpacity": 0.12,
        "highlightStrokeWidth": 4.2,
        "highlightFillOpacity": 0.26,
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
      "id": "AB",
      "label": "Lado AB",
      "color": "carbon",
      "layerId": "geometry",
      "order": 220,
      "visible": true,
      "locked": false,
      "groupIds": [
        "grupoLados"
      ],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Lado AB",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 4.2,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "A",
        "B"
      ]
    },
    {
      "id": "BC",
      "label": "Lado BC",
      "color": "carbon",
      "layerId": "geometry",
      "order": 230,
      "visible": true,
      "locked": false,
      "groupIds": [
        "grupoLados"
      ],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Lado BC",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 4.2,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "B",
        "C"
      ]
    },
    {
      "id": "CD",
      "label": "Lado CD",
      "color": "carbon",
      "layerId": "geometry",
      "order": 240,
      "visible": true,
      "locked": false,
      "groupIds": [
        "grupoLados"
      ],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Lado CD",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 4.2,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "C",
        "D"
      ]
    },
    {
      "id": "DA",
      "label": "Lado DA",
      "color": "carbon",
      "layerId": "geometry",
      "order": 250,
      "visible": true,
      "locked": false,
      "groupIds": [
        "grupoLados"
      ],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Lado DA",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 4.2,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "D",
        "A"
      ]
    },
    {
      "id": "parAB",
      "label": "Una flecha en AB",
      "color": "terracota",
      "layerId": "properties",
      "order": 300,
      "visible": true,
      "locked": false,
      "groupIds": [
        "grupoParalelismo"
      ],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Una flecha en AB",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.2,
        "markHeight": 0.42,
        "highlightStrokeWidth": 4.2,
        "preserveColorOnHighlight": true
      },
      "kind": "parallelMark",
      "refs": [
        "A",
        "B"
      ],
      "properties": {
        "markCount": 1,
        "visibleWhen": "and(lt(abs((B.x-A.x)*(D.y-C.y)-(B.y-A.y)*(D.x-C.x))/(AB.length*CD.length),0.035),not(and(lt(abs((B.x-A.x)*(D.x-A.x)+(B.y-A.y)*(D.y-A.y))/(AB.length*DA.length),0.035),lt(abs((A.x-B.x)*(C.x-B.x)+(A.y-B.y)*(C.y-B.y))/(AB.length*BC.length),0.035),lt(abs((B.x-A.x)*(D.y-C.y)-(B.y-A.y)*(D.x-C.x))/(AB.length*CD.length),0.035))),not(and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs(AB.length-CD.length)/max(AB.length,CD.length),0.04),lt(abs(AB.length-DA.length)/max(AB.length,DA.length),0.04))))"
      }
    },
    {
      "id": "parCD",
      "label": "Una flecha en CD",
      "color": "terracota",
      "layerId": "properties",
      "order": 310,
      "visible": true,
      "locked": false,
      "groupIds": [
        "grupoParalelismo"
      ],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Una flecha en CD",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.2,
        "markHeight": 0.42,
        "highlightStrokeWidth": 4.2,
        "preserveColorOnHighlight": true
      },
      "kind": "parallelMark",
      "refs": [
        "D",
        "C"
      ],
      "properties": {
        "markCount": 1,
        "visibleWhen": "and(lt(abs((B.x-A.x)*(D.y-C.y)-(B.y-A.y)*(D.x-C.x))/(AB.length*CD.length),0.035),not(and(lt(abs((B.x-A.x)*(D.x-A.x)+(B.y-A.y)*(D.y-A.y))/(AB.length*DA.length),0.035),lt(abs((A.x-B.x)*(C.x-B.x)+(A.y-B.y)*(C.y-B.y))/(AB.length*BC.length),0.035),lt(abs((B.x-A.x)*(D.y-C.y)-(B.y-A.y)*(D.x-C.x))/(AB.length*CD.length),0.035))),not(and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs(AB.length-CD.length)/max(AB.length,CD.length),0.04),lt(abs(AB.length-DA.length)/max(AB.length,DA.length),0.04))))"
      }
    },
    {
      "id": "parBC",
      "label": "Dos flechas en BC",
      "color": "pavo",
      "layerId": "properties",
      "order": 320,
      "visible": true,
      "locked": false,
      "groupIds": [
        "grupoParalelismo"
      ],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Dos flechas en BC",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.2,
        "markHeight": 0.42,
        "highlightStrokeWidth": 4.2,
        "preserveColorOnHighlight": true
      },
      "kind": "parallelMark",
      "refs": [
        "B",
        "C"
      ],
      "properties": {
        "markCount": 2,
        "visibleWhen": "and(lt(abs((C.x-B.x)*(A.y-D.y)-(C.y-B.y)*(A.x-D.x))/(BC.length*DA.length),0.035),not(and(lt(abs((B.x-A.x)*(D.x-A.x)+(B.y-A.y)*(D.y-A.y))/(AB.length*DA.length),0.035),lt(abs((A.x-B.x)*(C.x-B.x)+(A.y-B.y)*(C.y-B.y))/(AB.length*BC.length),0.035),lt(abs((B.x-A.x)*(D.y-C.y)-(B.y-A.y)*(D.x-C.x))/(AB.length*CD.length),0.035))),not(and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs(AB.length-CD.length)/max(AB.length,CD.length),0.04),lt(abs(AB.length-DA.length)/max(AB.length,DA.length),0.04))))"
      }
    },
    {
      "id": "parDA",
      "label": "Dos flechas en DA",
      "color": "pavo",
      "layerId": "properties",
      "order": 330,
      "visible": true,
      "locked": false,
      "groupIds": [
        "grupoParalelismo"
      ],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Dos flechas en DA",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.2,
        "markHeight": 0.42,
        "highlightStrokeWidth": 4.2,
        "preserveColorOnHighlight": true
      },
      "kind": "parallelMark",
      "refs": [
        "A",
        "D"
      ],
      "properties": {
        "markCount": 2,
        "visibleWhen": "and(lt(abs((C.x-B.x)*(A.y-D.y)-(C.y-B.y)*(A.x-D.x))/(BC.length*DA.length),0.035),not(and(lt(abs((B.x-A.x)*(D.x-A.x)+(B.y-A.y)*(D.y-A.y))/(AB.length*DA.length),0.035),lt(abs((A.x-B.x)*(C.x-B.x)+(A.y-B.y)*(C.y-B.y))/(AB.length*BC.length),0.035),lt(abs((B.x-A.x)*(D.y-C.y)-(B.y-A.y)*(D.x-C.x))/(AB.length*CD.length),0.035))),not(and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs(AB.length-CD.length)/max(AB.length,CD.length),0.04),lt(abs(AB.length-DA.length)/max(AB.length,DA.length),0.04))))"
      }
    },
    {
      "id": "igualTodoAB",
      "label": "Igualdad total en AB",
      "color": "ocre",
      "layerId": "properties",
      "order": 400,
      "visible": true,
      "locked": false,
      "groupIds": [
        "grupoIgualdad"
      ],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Igualdad total en AB",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.2,
        "markHeight": 0.34,
        "highlightStrokeWidth": 4.2,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "A",
        "B"
      ],
      "properties": {
        "markCount": 1,
        "visibleWhen": "and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs(AB.length-CD.length)/max(AB.length,CD.length),0.04),lt(abs(AB.length-DA.length)/max(AB.length,DA.length),0.04))"
      }
    },
    {
      "id": "igualTodoBC",
      "label": "Igualdad total en BC",
      "color": "ocre",
      "layerId": "properties",
      "order": 410,
      "visible": true,
      "locked": false,
      "groupIds": [
        "grupoIgualdad"
      ],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Igualdad total en BC",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.2,
        "markHeight": 0.34,
        "highlightStrokeWidth": 4.2,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "B",
        "C"
      ],
      "properties": {
        "markCount": 1,
        "visibleWhen": "and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs(AB.length-CD.length)/max(AB.length,CD.length),0.04),lt(abs(AB.length-DA.length)/max(AB.length,DA.length),0.04))"
      }
    },
    {
      "id": "igualTodoCD",
      "label": "Igualdad total en CD",
      "color": "ocre",
      "layerId": "properties",
      "order": 420,
      "visible": true,
      "locked": false,
      "groupIds": [
        "grupoIgualdad"
      ],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Igualdad total en CD",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.2,
        "markHeight": 0.34,
        "highlightStrokeWidth": 4.2,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "C",
        "D"
      ],
      "properties": {
        "markCount": 1,
        "visibleWhen": "and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs(AB.length-CD.length)/max(AB.length,CD.length),0.04),lt(abs(AB.length-DA.length)/max(AB.length,DA.length),0.04))"
      }
    },
    {
      "id": "igualTodoDA",
      "label": "Igualdad total en DA",
      "color": "ocre",
      "layerId": "properties",
      "order": 430,
      "visible": true,
      "locked": false,
      "groupIds": [
        "grupoIgualdad"
      ],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Igualdad total en DA",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.2,
        "markHeight": 0.34,
        "highlightStrokeWidth": 4.2,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "D",
        "A"
      ],
      "properties": {
        "markCount": 1,
        "visibleWhen": "and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs(AB.length-CD.length)/max(AB.length,CD.length),0.04),lt(abs(AB.length-DA.length)/max(AB.length,DA.length),0.04))"
      }
    },
    {
      "id": "cometaACAB",
      "label": "Primer par del cometa en AB",
      "color": "ocre",
      "layerId": "properties",
      "order": 450,
      "visible": true,
      "locked": false,
      "groupIds": [
        "grupoIgualdad"
      ],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Primer par del cometa en AB",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.2,
        "markHeight": 0.34,
        "highlightStrokeWidth": 4.2,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "A",
        "B"
      ],
      "properties": {
        "markCount": 1,
        "visibleWhen": "and(lt(abs(AB.length-DA.length)/max(AB.length,DA.length),0.04),lt(abs(BC.length-CD.length)/max(BC.length,CD.length),0.04),not(and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs(AB.length-CD.length)/max(AB.length,CD.length),0.04),lt(abs(AB.length-DA.length)/max(AB.length,DA.length),0.04))))"
      }
    },
    {
      "id": "cometaACDA",
      "label": "Primer par del cometa en DA",
      "color": "ocre",
      "layerId": "properties",
      "order": 460,
      "visible": true,
      "locked": false,
      "groupIds": [
        "grupoIgualdad"
      ],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Primer par del cometa en DA",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.2,
        "markHeight": 0.34,
        "highlightStrokeWidth": 4.2,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "D",
        "A"
      ],
      "properties": {
        "markCount": 1,
        "visibleWhen": "and(lt(abs(AB.length-DA.length)/max(AB.length,DA.length),0.04),lt(abs(BC.length-CD.length)/max(BC.length,CD.length),0.04),not(and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs(AB.length-CD.length)/max(AB.length,CD.length),0.04),lt(abs(AB.length-DA.length)/max(AB.length,DA.length),0.04))))"
      }
    },
    {
      "id": "cometaACBC",
      "label": "Segundo par del cometa en BC",
      "color": "ocre",
      "layerId": "properties",
      "order": 470,
      "visible": true,
      "locked": false,
      "groupIds": [
        "grupoIgualdad"
      ],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Segundo par del cometa en BC",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.2,
        "markHeight": 0.34,
        "highlightStrokeWidth": 4.2,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "B",
        "C"
      ],
      "properties": {
        "markCount": 2,
        "visibleWhen": "and(lt(abs(AB.length-DA.length)/max(AB.length,DA.length),0.04),lt(abs(BC.length-CD.length)/max(BC.length,CD.length),0.04),not(and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs(AB.length-CD.length)/max(AB.length,CD.length),0.04),lt(abs(AB.length-DA.length)/max(AB.length,DA.length),0.04))))"
      }
    },
    {
      "id": "cometaACCD",
      "label": "Segundo par del cometa en CD",
      "color": "ocre",
      "layerId": "properties",
      "order": 480,
      "visible": true,
      "locked": false,
      "groupIds": [
        "grupoIgualdad"
      ],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Segundo par del cometa en CD",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.2,
        "markHeight": 0.34,
        "highlightStrokeWidth": 4.2,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "C",
        "D"
      ],
      "properties": {
        "markCount": 2,
        "visibleWhen": "and(lt(abs(AB.length-DA.length)/max(AB.length,DA.length),0.04),lt(abs(BC.length-CD.length)/max(BC.length,CD.length),0.04),not(and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs(AB.length-CD.length)/max(AB.length,CD.length),0.04),lt(abs(AB.length-DA.length)/max(AB.length,DA.length),0.04))))"
      }
    },
    {
      "id": "cometaBDAB",
      "label": "Primer par del cometa en AB",
      "color": "ocre",
      "layerId": "properties",
      "order": 500,
      "visible": true,
      "locked": false,
      "groupIds": [
        "grupoIgualdad"
      ],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Primer par del cometa en AB",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.2,
        "markHeight": 0.34,
        "highlightStrokeWidth": 4.2,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "A",
        "B"
      ],
      "properties": {
        "markCount": 1,
        "visibleWhen": "and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs(CD.length-DA.length)/max(CD.length,DA.length),0.04),not(and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs(AB.length-CD.length)/max(AB.length,CD.length),0.04),lt(abs(AB.length-DA.length)/max(AB.length,DA.length),0.04))))"
      }
    },
    {
      "id": "cometaBDBC",
      "label": "Primer par del cometa en BC",
      "color": "ocre",
      "layerId": "properties",
      "order": 510,
      "visible": true,
      "locked": false,
      "groupIds": [
        "grupoIgualdad"
      ],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Primer par del cometa en BC",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.2,
        "markHeight": 0.34,
        "highlightStrokeWidth": 4.2,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "B",
        "C"
      ],
      "properties": {
        "markCount": 1,
        "visibleWhen": "and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs(CD.length-DA.length)/max(CD.length,DA.length),0.04),not(and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs(AB.length-CD.length)/max(AB.length,CD.length),0.04),lt(abs(AB.length-DA.length)/max(AB.length,DA.length),0.04))))"
      }
    },
    {
      "id": "cometaBDCD",
      "label": "Segundo par del cometa en CD",
      "color": "ocre",
      "layerId": "properties",
      "order": 520,
      "visible": true,
      "locked": false,
      "groupIds": [
        "grupoIgualdad"
      ],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Segundo par del cometa en CD",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.2,
        "markHeight": 0.34,
        "highlightStrokeWidth": 4.2,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "C",
        "D"
      ],
      "properties": {
        "markCount": 2,
        "visibleWhen": "and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs(CD.length-DA.length)/max(CD.length,DA.length),0.04),not(and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs(AB.length-CD.length)/max(AB.length,CD.length),0.04),lt(abs(AB.length-DA.length)/max(AB.length,DA.length),0.04))))"
      }
    },
    {
      "id": "cometaBDDA",
      "label": "Segundo par del cometa en DA",
      "color": "ocre",
      "layerId": "properties",
      "order": 530,
      "visible": true,
      "locked": false,
      "groupIds": [
        "grupoIgualdad"
      ],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Segundo par del cometa en DA",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.2,
        "markHeight": 0.34,
        "highlightStrokeWidth": 4.2,
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "D",
        "A"
      ],
      "properties": {
        "markCount": 2,
        "visibleWhen": "and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs(CD.length-DA.length)/max(CD.length,DA.length),0.04),not(and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs(AB.length-CD.length)/max(AB.length,CD.length),0.04),lt(abs(AB.length-DA.length)/max(AB.length,DA.length),0.04))))"
      }
    },
    {
      "id": "rectoA",
      "label": "Ángulo recto en A",
      "color": "ocre",
      "layerId": "properties",
      "order": 560,
      "visible": true,
      "locked": false,
      "groupIds": [
        "grupoRectos"
      ],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Ángulo recto en A",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.7,
        "fillOpacity": 0.16,
        "angleRadius": 0.42,
        "highlightStrokeWidth": 4.2,
        "highlightFillOpacity": 0.3,
        "preserveColorOnHighlight": true
      },
      "kind": "rightAngle",
      "refs": [
        "B",
        "A",
        "D"
      ],
      "properties": {
        "visibleWhen": "and(lt(abs((B.x-A.x)*(D.x-A.x)+(B.y-A.y)*(D.y-A.y))/(AB.length*DA.length),0.035),lt(abs((A.x-B.x)*(C.x-B.x)+(A.y-B.y)*(C.y-B.y))/(AB.length*BC.length),0.035),lt(abs((B.x-A.x)*(D.y-C.y)-(B.y-A.y)*(D.x-C.x))/(AB.length*CD.length),0.035))"
      }
    },
    {
      "id": "rectoB",
      "label": "Ángulo recto en B",
      "color": "ocre",
      "layerId": "properties",
      "order": 570,
      "visible": true,
      "locked": false,
      "groupIds": [
        "grupoRectos"
      ],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Ángulo recto en B",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.7,
        "fillOpacity": 0.16,
        "angleRadius": 0.42,
        "highlightStrokeWidth": 4.2,
        "highlightFillOpacity": 0.3,
        "preserveColorOnHighlight": true
      },
      "kind": "rightAngle",
      "refs": [
        "C",
        "B",
        "A"
      ],
      "properties": {
        "visibleWhen": "and(lt(abs((B.x-A.x)*(D.x-A.x)+(B.y-A.y)*(D.y-A.y))/(AB.length*DA.length),0.035),lt(abs((A.x-B.x)*(C.x-B.x)+(A.y-B.y)*(C.y-B.y))/(AB.length*BC.length),0.035),lt(abs((B.x-A.x)*(D.y-C.y)-(B.y-A.y)*(D.x-C.x))/(AB.length*CD.length),0.035))"
      }
    },
    {
      "id": "rectoC",
      "label": "Ángulo recto en C",
      "color": "ocre",
      "layerId": "properties",
      "order": 580,
      "visible": true,
      "locked": false,
      "groupIds": [
        "grupoRectos"
      ],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Ángulo recto en C",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.7,
        "fillOpacity": 0.16,
        "angleRadius": 0.42,
        "highlightStrokeWidth": 4.2,
        "highlightFillOpacity": 0.3,
        "preserveColorOnHighlight": true
      },
      "kind": "rightAngle",
      "refs": [
        "D",
        "C",
        "B"
      ],
      "properties": {
        "visibleWhen": "and(lt(abs((B.x-A.x)*(D.x-A.x)+(B.y-A.y)*(D.y-A.y))/(AB.length*DA.length),0.035),lt(abs((A.x-B.x)*(C.x-B.x)+(A.y-B.y)*(C.y-B.y))/(AB.length*BC.length),0.035),lt(abs((B.x-A.x)*(D.y-C.y)-(B.y-A.y)*(D.x-C.x))/(AB.length*CD.length),0.035))"
      }
    },
    {
      "id": "rectoD",
      "label": "Ángulo recto en D",
      "color": "ocre",
      "layerId": "properties",
      "order": 590,
      "visible": true,
      "locked": false,
      "groupIds": [
        "grupoRectos"
      ],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Ángulo recto en D",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.7,
        "fillOpacity": 0.16,
        "angleRadius": 0.42,
        "highlightStrokeWidth": 4.2,
        "highlightFillOpacity": 0.3,
        "preserveColorOnHighlight": true
      },
      "kind": "rightAngle",
      "refs": [
        "A",
        "D",
        "C"
      ],
      "properties": {
        "visibleWhen": "and(lt(abs((B.x-A.x)*(D.x-A.x)+(B.y-A.y)*(D.y-A.y))/(AB.length*DA.length),0.035),lt(abs((A.x-B.x)*(C.x-B.x)+(A.y-B.y)*(C.y-B.y))/(AB.length*BC.length),0.035),lt(abs((B.x-A.x)*(D.y-C.y)-(B.y-A.y)*(D.x-C.x))/(AB.length*CD.length),0.035))"
      }
    },
    {
      "id": "anguloA",
      "label": "Ángulo interior A",
      "color": "ocre",
      "layerId": "details",
      "order": 620,
      "visible": false,
      "locked": false,
      "groupIds": [
        "grupoAngulos"
      ],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Ángulo interior A",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.5,
        "fillOpacity": 0.18,
        "angleRadius": 0.58,
        "highlightStrokeWidth": 4.2,
        "highlightFillOpacity": 0.3,
        "highlightVisible": true,
        "preserveColorOnHighlight": true
      },
      "kind": "nonReflexAngle",
      "refs": [
        "B",
        "A",
        "D"
      ]
    },
    {
      "id": "anguloB",
      "label": "Ángulo interior B",
      "color": "ocre",
      "layerId": "details",
      "order": 630,
      "visible": false,
      "locked": false,
      "groupIds": [
        "grupoAngulos"
      ],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Ángulo interior B",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.5,
        "fillOpacity": 0.18,
        "angleRadius": 0.58,
        "highlightStrokeWidth": 4.2,
        "highlightFillOpacity": 0.3,
        "highlightVisible": true,
        "preserveColorOnHighlight": true
      },
      "kind": "nonReflexAngle",
      "refs": [
        "C",
        "B",
        "A"
      ]
    },
    {
      "id": "anguloC",
      "label": "Ángulo interior C",
      "color": "ocre",
      "layerId": "details",
      "order": 640,
      "visible": false,
      "locked": false,
      "groupIds": [
        "grupoAngulos"
      ],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Ángulo interior C",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.5,
        "fillOpacity": 0.18,
        "angleRadius": 0.58,
        "highlightStrokeWidth": 4.2,
        "highlightFillOpacity": 0.3,
        "highlightVisible": true,
        "preserveColorOnHighlight": true
      },
      "kind": "nonReflexAngle",
      "refs": [
        "D",
        "C",
        "B"
      ]
    },
    {
      "id": "anguloD",
      "label": "Ángulo interior D",
      "color": "ocre",
      "layerId": "details",
      "order": 650,
      "visible": false,
      "locked": false,
      "groupIds": [
        "grupoAngulos"
      ],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Ángulo interior D",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.5,
        "fillOpacity": 0.18,
        "angleRadius": 0.58,
        "highlightStrokeWidth": 4.2,
        "highlightFillOpacity": 0.3,
        "highlightVisible": true,
        "preserveColorOnHighlight": true
      },
      "kind": "nonReflexAngle",
      "refs": [
        "A",
        "D",
        "C"
      ]
    },
    {
      "id": "AC",
      "label": "Diagonal AC",
      "color": "pizarra",
      "layerId": "details",
      "order": 680,
      "visible": false,
      "locked": false,
      "groupIds": [
        "grupoDiagonales"
      ],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Diagonal AC",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.8,
        "strokeOpacity": 0.8,
        "highlightStrokeWidth": 4.2,
        "highlightVisible": true,
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
      "id": "BD",
      "label": "Diagonal BD",
      "color": "pizarra",
      "layerId": "details",
      "order": 690,
      "visible": false,
      "locked": false,
      "groupIds": [
        "grupoDiagonales"
      ],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Diagonal BD",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.8,
        "strokeOpacity": 0.8,
        "highlightStrokeWidth": 4.2,
        "highlightVisible": true,
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
      "id": "clasificacion",
      "label": "Clasificación",
      "color": "musgo",
      "layerId": "annotations",
      "order": 800,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Clasificación dinámica del cuadrilátero",
        "role": "annotation"
      },
      "target": true,
      "targetId": "clasificacion",
      "style": {
        "strokeWidth": 2.4,
        "labelSize": 16,
        "highlightStrokeWidth": 4.2,
        "preserveColorOnHighlight": true
      },
      "kind": "infoPanel",
      "refs": [],
      "text": "",
      "properties": {
        "anchorMode": "viewport",
        "viewportPosition": [
          0,
          0
        ],
        "textRules": [
          {
            "when": "and(and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs(AB.length-CD.length)/max(AB.length,CD.length),0.04),lt(abs(AB.length-DA.length)/max(AB.length,DA.length),0.04)),and(lt(abs((B.x-A.x)*(D.x-A.x)+(B.y-A.y)*(D.y-A.y))/(AB.length*DA.length),0.035),lt(abs((A.x-B.x)*(C.x-B.x)+(A.y-B.y)*(C.y-B.y))/(AB.length*BC.length),0.035),lt(abs((B.x-A.x)*(D.y-C.y)-(B.y-A.y)*(D.x-C.x))/(AB.length*CD.length),0.035)))",
            "text": "Cuadrado · 4 lados iguales · 4 ángulos rectos"
          },
          {
            "when": "and(lt(abs((B.x-A.x)*(D.x-A.x)+(B.y-A.y)*(D.y-A.y))/(AB.length*DA.length),0.035),lt(abs((A.x-B.x)*(C.x-B.x)+(A.y-B.y)*(C.y-B.y))/(AB.length*BC.length),0.035),lt(abs((B.x-A.x)*(D.y-C.y)-(B.y-A.y)*(D.x-C.x))/(AB.length*CD.length),0.035))",
            "text": "Rectángulo · 4 ángulos rectos"
          },
          {
            "when": "and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs(AB.length-CD.length)/max(AB.length,CD.length),0.04),lt(abs(AB.length-DA.length)/max(AB.length,DA.length),0.04))",
            "text": "Rombo · 4 lados iguales"
          },
          {
            "when": "and(lt(abs((B.x-A.x)*(D.y-C.y)-(B.y-A.y)*(D.x-C.x))/(AB.length*CD.length),0.035),lt(abs((C.x-B.x)*(A.y-D.y)-(C.y-B.y)*(A.x-D.x))/(BC.length*DA.length),0.035))",
            "text": "Paralelogramo · 2 pares de lados opuestos paralelos"
          },
          {
            "when": "or(and(lt(abs(AB.length-DA.length)/max(AB.length,DA.length),0.04),lt(abs(BC.length-CD.length)/max(BC.length,CD.length),0.04)),and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs(CD.length-DA.length)/max(CD.length,DA.length),0.04)))",
            "text": "Cometa · 2 pares de lados consecutivos iguales"
          },
          {
            "when": "or(lt(abs((B.x-A.x)*(D.y-C.y)-(B.y-A.y)*(D.x-C.x))/(AB.length*CD.length),0.035),lt(abs((C.x-B.x)*(A.y-D.y)-(C.y-B.y)*(A.x-D.x))/(BC.length*DA.length),0.035))",
            "text": "Trapecio · 1 par de lados opuestos paralelos"
          },
          {
            "when": "1",
            "text": "Trapezoide · ningún par de lados opuestos paralelos"
          }
        ]
      }
    }
  ],
  "sliders": [],
  "steps": [],
  "constraints": [
    {
      "id": "CEncimaAB",
      "label": "C permanece sobre AB",
      "kind": "sameSide",
      "refs": [
        "C",
        "A",
        "B"
      ],
      "enabled": true
    },
    {
      "id": "CNoCruzaBD",
      "label": "C no cruza la diagonal BD",
      "kind": "sameSide",
      "refs": [
        "C",
        "B",
        "D"
      ],
      "enabled": true
    },
    {
      "id": "DEncimaAB",
      "label": "D permanece sobre AB",
      "kind": "sameSide",
      "refs": [
        "D",
        "A",
        "B"
      ],
      "enabled": true
    },
    {
      "id": "DNoCruzaAC",
      "label": "D no cruza la diagonal AC",
      "kind": "sameSide",
      "refs": [
        "D",
        "A",
        "C"
      ],
      "enabled": true
    }
  ],
  "dependencies": [
    {
      "sourceId": "A",
      "targetId": "guiaRectoB",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "guiaRectoB",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "guiaIgualBC",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "guiaIgualBC",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "guiaParalelaCD",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "guiaParalelaCD",
      "relation": "construction"
    },
    {
      "sourceId": "C",
      "targetId": "guiaParalelaCD",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "guiaParalelaDA",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "guiaParalelaDA",
      "relation": "construction"
    },
    {
      "sourceId": "C",
      "targetId": "guiaParalelaDA",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "guiaRectoA",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "guiaRectoA",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "guiaIgualDA",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "guiaIgualDA",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "guiaIgualCD",
      "relation": "construction"
    },
    {
      "sourceId": "C",
      "targetId": "guiaIgualCD",
      "relation": "construction"
    },
    {
      "sourceId": "guiaRectoB",
      "targetId": "C",
      "relation": "constraint"
    },
    {
      "sourceId": "guiaIgualBC",
      "targetId": "C",
      "relation": "constraint"
    },
    {
      "sourceId": "guiaParalelaCD",
      "targetId": "D",
      "relation": "constraint"
    },
    {
      "sourceId": "guiaParalelaDA",
      "targetId": "D",
      "relation": "constraint"
    },
    {
      "sourceId": "guiaRectoA",
      "targetId": "D",
      "relation": "constraint"
    },
    {
      "sourceId": "guiaIgualDA",
      "targetId": "D",
      "relation": "constraint"
    },
    {
      "sourceId": "guiaIgualCD",
      "targetId": "D",
      "relation": "constraint"
    },
    {
      "sourceId": "A",
      "targetId": "C",
      "relation": "constraint",
      "constraintId": "CEncimaAB"
    },
    {
      "sourceId": "B",
      "targetId": "C",
      "relation": "constraint",
      "constraintId": "CEncimaAB"
    },
    {
      "sourceId": "B",
      "targetId": "C",
      "relation": "constraint",
      "constraintId": "CNoCruzaBD"
    },
    {
      "sourceId": "A",
      "targetId": "D",
      "relation": "constraint",
      "constraintId": "DEncimaAB"
    },
    {
      "sourceId": "B",
      "targetId": "D",
      "relation": "constraint",
      "constraintId": "DEncimaAB"
    },
    {
      "sourceId": "A",
      "targetId": "D",
      "relation": "constraint",
      "constraintId": "DNoCruzaAC"
    },
    {
      "sourceId": "C",
      "targetId": "D",
      "relation": "constraint",
      "constraintId": "DNoCruzaAC"
    },
    {
      "sourceId": "A",
      "targetId": "parAB",
      "relation": "expression"
    },
    {
      "sourceId": "B",
      "targetId": "parAB",
      "relation": "expression"
    },
    {
      "sourceId": "C",
      "targetId": "parAB",
      "relation": "expression"
    },
    {
      "sourceId": "D",
      "targetId": "parAB",
      "relation": "expression"
    },
    {
      "sourceId": "AB",
      "targetId": "parAB",
      "relation": "expression"
    },
    {
      "sourceId": "BC",
      "targetId": "parAB",
      "relation": "expression"
    },
    {
      "sourceId": "CD",
      "targetId": "parAB",
      "relation": "expression"
    },
    {
      "sourceId": "DA",
      "targetId": "parAB",
      "relation": "expression"
    },
    {
      "sourceId": "A",
      "targetId": "parCD",
      "relation": "expression"
    },
    {
      "sourceId": "B",
      "targetId": "parCD",
      "relation": "expression"
    },
    {
      "sourceId": "C",
      "targetId": "parCD",
      "relation": "expression"
    },
    {
      "sourceId": "D",
      "targetId": "parCD",
      "relation": "expression"
    },
    {
      "sourceId": "AB",
      "targetId": "parCD",
      "relation": "expression"
    },
    {
      "sourceId": "BC",
      "targetId": "parCD",
      "relation": "expression"
    },
    {
      "sourceId": "CD",
      "targetId": "parCD",
      "relation": "expression"
    },
    {
      "sourceId": "DA",
      "targetId": "parCD",
      "relation": "expression"
    },
    {
      "sourceId": "A",
      "targetId": "parBC",
      "relation": "expression"
    },
    {
      "sourceId": "B",
      "targetId": "parBC",
      "relation": "expression"
    },
    {
      "sourceId": "C",
      "targetId": "parBC",
      "relation": "expression"
    },
    {
      "sourceId": "D",
      "targetId": "parBC",
      "relation": "expression"
    },
    {
      "sourceId": "AB",
      "targetId": "parBC",
      "relation": "expression"
    },
    {
      "sourceId": "BC",
      "targetId": "parBC",
      "relation": "expression"
    },
    {
      "sourceId": "CD",
      "targetId": "parBC",
      "relation": "expression"
    },
    {
      "sourceId": "DA",
      "targetId": "parBC",
      "relation": "expression"
    },
    {
      "sourceId": "A",
      "targetId": "parDA",
      "relation": "expression"
    },
    {
      "sourceId": "B",
      "targetId": "parDA",
      "relation": "expression"
    },
    {
      "sourceId": "C",
      "targetId": "parDA",
      "relation": "expression"
    },
    {
      "sourceId": "D",
      "targetId": "parDA",
      "relation": "expression"
    },
    {
      "sourceId": "AB",
      "targetId": "parDA",
      "relation": "expression"
    },
    {
      "sourceId": "BC",
      "targetId": "parDA",
      "relation": "expression"
    },
    {
      "sourceId": "CD",
      "targetId": "parDA",
      "relation": "expression"
    },
    {
      "sourceId": "DA",
      "targetId": "parDA",
      "relation": "expression"
    },
    {
      "sourceId": "A",
      "targetId": "igualTodoAB",
      "relation": "expression"
    },
    {
      "sourceId": "B",
      "targetId": "igualTodoAB",
      "relation": "expression"
    },
    {
      "sourceId": "C",
      "targetId": "igualTodoAB",
      "relation": "expression"
    },
    {
      "sourceId": "D",
      "targetId": "igualTodoAB",
      "relation": "expression"
    },
    {
      "sourceId": "AB",
      "targetId": "igualTodoAB",
      "relation": "expression"
    },
    {
      "sourceId": "BC",
      "targetId": "igualTodoAB",
      "relation": "expression"
    },
    {
      "sourceId": "CD",
      "targetId": "igualTodoAB",
      "relation": "expression"
    },
    {
      "sourceId": "DA",
      "targetId": "igualTodoAB",
      "relation": "expression"
    },
    {
      "sourceId": "A",
      "targetId": "igualTodoBC",
      "relation": "expression"
    },
    {
      "sourceId": "B",
      "targetId": "igualTodoBC",
      "relation": "expression"
    },
    {
      "sourceId": "C",
      "targetId": "igualTodoBC",
      "relation": "expression"
    },
    {
      "sourceId": "D",
      "targetId": "igualTodoBC",
      "relation": "expression"
    },
    {
      "sourceId": "AB",
      "targetId": "igualTodoBC",
      "relation": "expression"
    },
    {
      "sourceId": "BC",
      "targetId": "igualTodoBC",
      "relation": "expression"
    },
    {
      "sourceId": "CD",
      "targetId": "igualTodoBC",
      "relation": "expression"
    },
    {
      "sourceId": "DA",
      "targetId": "igualTodoBC",
      "relation": "expression"
    },
    {
      "sourceId": "A",
      "targetId": "igualTodoCD",
      "relation": "expression"
    },
    {
      "sourceId": "B",
      "targetId": "igualTodoCD",
      "relation": "expression"
    },
    {
      "sourceId": "C",
      "targetId": "igualTodoCD",
      "relation": "expression"
    },
    {
      "sourceId": "D",
      "targetId": "igualTodoCD",
      "relation": "expression"
    },
    {
      "sourceId": "AB",
      "targetId": "igualTodoCD",
      "relation": "expression"
    },
    {
      "sourceId": "BC",
      "targetId": "igualTodoCD",
      "relation": "expression"
    },
    {
      "sourceId": "CD",
      "targetId": "igualTodoCD",
      "relation": "expression"
    },
    {
      "sourceId": "DA",
      "targetId": "igualTodoCD",
      "relation": "expression"
    },
    {
      "sourceId": "A",
      "targetId": "igualTodoDA",
      "relation": "expression"
    },
    {
      "sourceId": "B",
      "targetId": "igualTodoDA",
      "relation": "expression"
    },
    {
      "sourceId": "C",
      "targetId": "igualTodoDA",
      "relation": "expression"
    },
    {
      "sourceId": "D",
      "targetId": "igualTodoDA",
      "relation": "expression"
    },
    {
      "sourceId": "AB",
      "targetId": "igualTodoDA",
      "relation": "expression"
    },
    {
      "sourceId": "BC",
      "targetId": "igualTodoDA",
      "relation": "expression"
    },
    {
      "sourceId": "CD",
      "targetId": "igualTodoDA",
      "relation": "expression"
    },
    {
      "sourceId": "DA",
      "targetId": "igualTodoDA",
      "relation": "expression"
    },
    {
      "sourceId": "A",
      "targetId": "cometaACAB",
      "relation": "expression"
    },
    {
      "sourceId": "B",
      "targetId": "cometaACAB",
      "relation": "expression"
    },
    {
      "sourceId": "C",
      "targetId": "cometaACAB",
      "relation": "expression"
    },
    {
      "sourceId": "D",
      "targetId": "cometaACAB",
      "relation": "expression"
    },
    {
      "sourceId": "AB",
      "targetId": "cometaACAB",
      "relation": "expression"
    },
    {
      "sourceId": "BC",
      "targetId": "cometaACAB",
      "relation": "expression"
    },
    {
      "sourceId": "CD",
      "targetId": "cometaACAB",
      "relation": "expression"
    },
    {
      "sourceId": "DA",
      "targetId": "cometaACAB",
      "relation": "expression"
    },
    {
      "sourceId": "A",
      "targetId": "cometaACDA",
      "relation": "expression"
    },
    {
      "sourceId": "B",
      "targetId": "cometaACDA",
      "relation": "expression"
    },
    {
      "sourceId": "C",
      "targetId": "cometaACDA",
      "relation": "expression"
    },
    {
      "sourceId": "D",
      "targetId": "cometaACDA",
      "relation": "expression"
    },
    {
      "sourceId": "AB",
      "targetId": "cometaACDA",
      "relation": "expression"
    },
    {
      "sourceId": "BC",
      "targetId": "cometaACDA",
      "relation": "expression"
    },
    {
      "sourceId": "CD",
      "targetId": "cometaACDA",
      "relation": "expression"
    },
    {
      "sourceId": "DA",
      "targetId": "cometaACDA",
      "relation": "expression"
    },
    {
      "sourceId": "A",
      "targetId": "cometaACBC",
      "relation": "expression"
    },
    {
      "sourceId": "B",
      "targetId": "cometaACBC",
      "relation": "expression"
    },
    {
      "sourceId": "C",
      "targetId": "cometaACBC",
      "relation": "expression"
    },
    {
      "sourceId": "D",
      "targetId": "cometaACBC",
      "relation": "expression"
    },
    {
      "sourceId": "AB",
      "targetId": "cometaACBC",
      "relation": "expression"
    },
    {
      "sourceId": "BC",
      "targetId": "cometaACBC",
      "relation": "expression"
    },
    {
      "sourceId": "CD",
      "targetId": "cometaACBC",
      "relation": "expression"
    },
    {
      "sourceId": "DA",
      "targetId": "cometaACBC",
      "relation": "expression"
    },
    {
      "sourceId": "A",
      "targetId": "cometaACCD",
      "relation": "expression"
    },
    {
      "sourceId": "B",
      "targetId": "cometaACCD",
      "relation": "expression"
    },
    {
      "sourceId": "C",
      "targetId": "cometaACCD",
      "relation": "expression"
    },
    {
      "sourceId": "D",
      "targetId": "cometaACCD",
      "relation": "expression"
    },
    {
      "sourceId": "AB",
      "targetId": "cometaACCD",
      "relation": "expression"
    },
    {
      "sourceId": "BC",
      "targetId": "cometaACCD",
      "relation": "expression"
    },
    {
      "sourceId": "CD",
      "targetId": "cometaACCD",
      "relation": "expression"
    },
    {
      "sourceId": "DA",
      "targetId": "cometaACCD",
      "relation": "expression"
    },
    {
      "sourceId": "A",
      "targetId": "cometaBDAB",
      "relation": "expression"
    },
    {
      "sourceId": "B",
      "targetId": "cometaBDAB",
      "relation": "expression"
    },
    {
      "sourceId": "C",
      "targetId": "cometaBDAB",
      "relation": "expression"
    },
    {
      "sourceId": "D",
      "targetId": "cometaBDAB",
      "relation": "expression"
    },
    {
      "sourceId": "AB",
      "targetId": "cometaBDAB",
      "relation": "expression"
    },
    {
      "sourceId": "BC",
      "targetId": "cometaBDAB",
      "relation": "expression"
    },
    {
      "sourceId": "CD",
      "targetId": "cometaBDAB",
      "relation": "expression"
    },
    {
      "sourceId": "DA",
      "targetId": "cometaBDAB",
      "relation": "expression"
    },
    {
      "sourceId": "A",
      "targetId": "cometaBDBC",
      "relation": "expression"
    },
    {
      "sourceId": "B",
      "targetId": "cometaBDBC",
      "relation": "expression"
    },
    {
      "sourceId": "C",
      "targetId": "cometaBDBC",
      "relation": "expression"
    },
    {
      "sourceId": "D",
      "targetId": "cometaBDBC",
      "relation": "expression"
    },
    {
      "sourceId": "AB",
      "targetId": "cometaBDBC",
      "relation": "expression"
    },
    {
      "sourceId": "BC",
      "targetId": "cometaBDBC",
      "relation": "expression"
    },
    {
      "sourceId": "CD",
      "targetId": "cometaBDBC",
      "relation": "expression"
    },
    {
      "sourceId": "DA",
      "targetId": "cometaBDBC",
      "relation": "expression"
    },
    {
      "sourceId": "A",
      "targetId": "cometaBDCD",
      "relation": "expression"
    },
    {
      "sourceId": "B",
      "targetId": "cometaBDCD",
      "relation": "expression"
    },
    {
      "sourceId": "C",
      "targetId": "cometaBDCD",
      "relation": "expression"
    },
    {
      "sourceId": "D",
      "targetId": "cometaBDCD",
      "relation": "expression"
    },
    {
      "sourceId": "AB",
      "targetId": "cometaBDCD",
      "relation": "expression"
    },
    {
      "sourceId": "BC",
      "targetId": "cometaBDCD",
      "relation": "expression"
    },
    {
      "sourceId": "CD",
      "targetId": "cometaBDCD",
      "relation": "expression"
    },
    {
      "sourceId": "DA",
      "targetId": "cometaBDCD",
      "relation": "expression"
    },
    {
      "sourceId": "A",
      "targetId": "cometaBDDA",
      "relation": "expression"
    },
    {
      "sourceId": "B",
      "targetId": "cometaBDDA",
      "relation": "expression"
    },
    {
      "sourceId": "C",
      "targetId": "cometaBDDA",
      "relation": "expression"
    },
    {
      "sourceId": "D",
      "targetId": "cometaBDDA",
      "relation": "expression"
    },
    {
      "sourceId": "AB",
      "targetId": "cometaBDDA",
      "relation": "expression"
    },
    {
      "sourceId": "BC",
      "targetId": "cometaBDDA",
      "relation": "expression"
    },
    {
      "sourceId": "CD",
      "targetId": "cometaBDDA",
      "relation": "expression"
    },
    {
      "sourceId": "DA",
      "targetId": "cometaBDDA",
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
      "sourceId": "C",
      "targetId": "rectoA",
      "relation": "expression"
    },
    {
      "sourceId": "D",
      "targetId": "rectoA",
      "relation": "expression"
    },
    {
      "sourceId": "AB",
      "targetId": "rectoA",
      "relation": "expression"
    },
    {
      "sourceId": "BC",
      "targetId": "rectoA",
      "relation": "expression"
    },
    {
      "sourceId": "CD",
      "targetId": "rectoA",
      "relation": "expression"
    },
    {
      "sourceId": "DA",
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
      "sourceId": "D",
      "targetId": "rectoB",
      "relation": "expression"
    },
    {
      "sourceId": "AB",
      "targetId": "rectoB",
      "relation": "expression"
    },
    {
      "sourceId": "BC",
      "targetId": "rectoB",
      "relation": "expression"
    },
    {
      "sourceId": "CD",
      "targetId": "rectoB",
      "relation": "expression"
    },
    {
      "sourceId": "DA",
      "targetId": "rectoB",
      "relation": "expression"
    },
    {
      "sourceId": "A",
      "targetId": "rectoC",
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
      "sourceId": "AB",
      "targetId": "rectoC",
      "relation": "expression"
    },
    {
      "sourceId": "BC",
      "targetId": "rectoC",
      "relation": "expression"
    },
    {
      "sourceId": "CD",
      "targetId": "rectoC",
      "relation": "expression"
    },
    {
      "sourceId": "DA",
      "targetId": "rectoC",
      "relation": "expression"
    },
    {
      "sourceId": "A",
      "targetId": "rectoD",
      "relation": "expression"
    },
    {
      "sourceId": "B",
      "targetId": "rectoD",
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
      "sourceId": "AB",
      "targetId": "rectoD",
      "relation": "expression"
    },
    {
      "sourceId": "BC",
      "targetId": "rectoD",
      "relation": "expression"
    },
    {
      "sourceId": "CD",
      "targetId": "rectoD",
      "relation": "expression"
    },
    {
      "sourceId": "DA",
      "targetId": "rectoD",
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
    },
    {
      "sourceId": "D",
      "targetId": "clasificacion",
      "relation": "expression"
    },
    {
      "sourceId": "AB",
      "targetId": "clasificacion",
      "relation": "expression"
    },
    {
      "sourceId": "BC",
      "targetId": "clasificacion",
      "relation": "expression"
    },
    {
      "sourceId": "CD",
      "targetId": "clasificacion",
      "relation": "expression"
    },
    {
      "sourceId": "DA",
      "targetId": "clasificacion",
      "relation": "expression"
    },
    {
      "sourceId": "D",
      "targetId": "parCD",
      "relation": "construction"
    },
    {
      "sourceId": "C",
      "targetId": "parCD",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "parDA",
      "relation": "construction"
    },
    {
      "sourceId": "D",
      "targetId": "parDA",
      "relation": "construction"
    }
  ],
  "note": "Mueve C y D para descubrir los diferentes tipos de cuadriláteros",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const Cuadrilatero = () => <DiagramRenderer spec={CuadrilateroSpec} />;
