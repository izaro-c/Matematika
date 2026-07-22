import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const CuadrilateroSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
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
  "objects": [
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3,
        "y": -2
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "labelOffset": [
          -17,
          9
        ],
        "labelSize": 19,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2,
        "y": -2
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "labelOffset": [
          10,
          9
        ],
        "labelSize": 19,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.75,
        "y": 1.35
      },
      "mobility": {
        "type": "constrained",
        "relationIds": [
          "CEncimaAB",
          "CNoCruzaBD"
        ]
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "labelOffset": [
          10,
          -18
        ],
        "labelSize": 19,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {
        "snapToGrid": true,
        "snapSize": 0.25,
        "attractorIds": [
          "guiaRectoB",
          "guiaIgualBC"
        ],
        "attractorDistance": 0.42,
        "snatchDistance": 0.6
      }
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -1.6,
        "y": 2.45
      },
      "mobility": {
        "type": "constrained",
        "relationIds": [
          "DEncimaAB",
          "DNoCruzaAC"
        ]
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "labelOffset": [
          -18,
          -18
        ],
        "labelSize": 19,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {
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
    },
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
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "perpendicular",
          "linePoints": [
            "A",
            "B"
          ],
          "through": "B"
        }
      },
      "appearance": {
        "strokeWidth": 1.2,
        "strokeOpacity": 0.2,
        "highlightStrokeWidth": 4.2,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "circle",
        "center": "B",
        "point": "A"
      },
      "appearance": {
        "strokeWidth": 1.2,
        "strokeOpacity": 0.2,
        "highlightStrokeWidth": 4.2,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "parallel",
          "linePoints": [
            "A",
            "B"
          ],
          "through": "C"
        }
      },
      "appearance": {
        "strokeWidth": 1.2,
        "strokeOpacity": 0.2,
        "highlightStrokeWidth": 4.2,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "parallel",
          "linePoints": [
            "B",
            "C"
          ],
          "through": "A"
        }
      },
      "appearance": {
        "strokeWidth": 1.2,
        "strokeOpacity": 0.2,
        "highlightStrokeWidth": 4.2,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "perpendicular",
          "linePoints": [
            "A",
            "B"
          ],
          "through": "A"
        }
      },
      "appearance": {
        "strokeWidth": 1.2,
        "strokeOpacity": 0.2,
        "highlightStrokeWidth": 4.2,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "circle",
        "center": "A",
        "point": "B"
      },
      "appearance": {
        "strokeWidth": 1.2,
        "strokeOpacity": 0.2,
        "highlightStrokeWidth": 4.2,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "circle",
        "center": "C",
        "point": "B"
      },
      "appearance": {
        "strokeWidth": 1.2,
        "strokeOpacity": 0.2,
        "highlightStrokeWidth": 4.2,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "A",
          "B",
          "C",
          "D"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "fillOpacity": 0.12,
        "highlightStrokeWidth": 4.2,
        "highlightFillOpacity": 0.26,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "A",
          "B"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 4.2,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "B",
          "C"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 4.2,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "C",
          "D"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 4.2,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "D",
          "A"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 4.2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "parAB",
      "label": "Una flecha en AB",
      "color": "terracota",
      "layerId": "properties",
      "order": 300,
      "visible": true,
      "visibleWhen": "and(lt(abs((B.x-A.x)*(D.y-C.y)-(B.y-A.y)*(D.x-C.x))/(AB.length*CD.length),0.035),not(and(lt(abs((B.x-A.x)*(D.x-A.x)+(B.y-A.y)*(D.y-A.y))/(AB.length*DA.length),0.035),lt(abs((A.x-B.x)*(C.x-B.x)+(A.y-B.y)*(C.y-B.y))/(AB.length*BC.length),0.035),lt(abs((B.x-A.x)*(D.y-C.y)-(B.y-A.y)*(D.x-C.x))/(AB.length*CD.length),0.035))),not(and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs(AB.length-CD.length)/max(AB.length,CD.length),0.04),lt(abs(AB.length-DA.length)/max(AB.length,DA.length),0.04))))",
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
      "objectType": "mark",
      "variant": "parallel",
      "anchor": {
        "type": "between-points",
        "points": [
          "A",
          "B"
        ]
      },
      "count": 1,
      "height": 0.42,
      "appearance": {
        "strokeWidth": 2.2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "parCD",
      "label": "Una flecha en CD",
      "color": "terracota",
      "layerId": "properties",
      "order": 310,
      "visible": true,
      "visibleWhen": "and(lt(abs((B.x-A.x)*(D.y-C.y)-(B.y-A.y)*(D.x-C.x))/(AB.length*CD.length),0.035),not(and(lt(abs((B.x-A.x)*(D.x-A.x)+(B.y-A.y)*(D.y-A.y))/(AB.length*DA.length),0.035),lt(abs((A.x-B.x)*(C.x-B.x)+(A.y-B.y)*(C.y-B.y))/(AB.length*BC.length),0.035),lt(abs((B.x-A.x)*(D.y-C.y)-(B.y-A.y)*(D.x-C.x))/(AB.length*CD.length),0.035))),not(and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs(AB.length-CD.length)/max(AB.length,CD.length),0.04),lt(abs(AB.length-DA.length)/max(AB.length,DA.length),0.04))))",
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
      "objectType": "mark",
      "variant": "parallel",
      "anchor": {
        "type": "between-points",
        "points": [
          "D",
          "C"
        ]
      },
      "count": 1,
      "height": 0.42,
      "appearance": {
        "strokeWidth": 2.2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "parBC",
      "label": "Dos flechas en BC",
      "color": "pavo",
      "layerId": "properties",
      "order": 320,
      "visible": true,
      "visibleWhen": "and(lt(abs((C.x-B.x)*(A.y-D.y)-(C.y-B.y)*(A.x-D.x))/(BC.length*DA.length),0.035),not(and(lt(abs((B.x-A.x)*(D.x-A.x)+(B.y-A.y)*(D.y-A.y))/(AB.length*DA.length),0.035),lt(abs((A.x-B.x)*(C.x-B.x)+(A.y-B.y)*(C.y-B.y))/(AB.length*BC.length),0.035),lt(abs((B.x-A.x)*(D.y-C.y)-(B.y-A.y)*(D.x-C.x))/(AB.length*CD.length),0.035))),not(and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs(AB.length-CD.length)/max(AB.length,CD.length),0.04),lt(abs(AB.length-DA.length)/max(AB.length,DA.length),0.04))))",
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
      "objectType": "mark",
      "variant": "parallel",
      "anchor": {
        "type": "between-points",
        "points": [
          "B",
          "C"
        ]
      },
      "count": 2,
      "height": 0.42,
      "appearance": {
        "strokeWidth": 2.2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "parDA",
      "label": "Dos flechas en DA",
      "color": "pavo",
      "layerId": "properties",
      "order": 330,
      "visible": true,
      "visibleWhen": "and(lt(abs((C.x-B.x)*(A.y-D.y)-(C.y-B.y)*(A.x-D.x))/(BC.length*DA.length),0.035),not(and(lt(abs((B.x-A.x)*(D.x-A.x)+(B.y-A.y)*(D.y-A.y))/(AB.length*DA.length),0.035),lt(abs((A.x-B.x)*(C.x-B.x)+(A.y-B.y)*(C.y-B.y))/(AB.length*BC.length),0.035),lt(abs((B.x-A.x)*(D.y-C.y)-(B.y-A.y)*(D.x-C.x))/(AB.length*CD.length),0.035))),not(and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs(AB.length-CD.length)/max(AB.length,CD.length),0.04),lt(abs(AB.length-DA.length)/max(AB.length,DA.length),0.04))))",
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
      "objectType": "mark",
      "variant": "parallel",
      "anchor": {
        "type": "between-points",
        "points": [
          "A",
          "D"
        ]
      },
      "count": 2,
      "height": 0.42,
      "appearance": {
        "strokeWidth": 2.2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "igualTodoAB",
      "label": "Igualdad total en AB",
      "color": "ocre",
      "layerId": "properties",
      "order": 400,
      "visible": true,
      "visibleWhen": "and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs(AB.length-CD.length)/max(AB.length,CD.length),0.04),lt(abs(AB.length-DA.length)/max(AB.length,DA.length),0.04))",
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
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "A",
          "B"
        ]
      },
      "count": 1,
      "height": 0.34,
      "appearance": {
        "strokeWidth": 2.2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "igualTodoBC",
      "label": "Igualdad total en BC",
      "color": "ocre",
      "layerId": "properties",
      "order": 410,
      "visible": true,
      "visibleWhen": "and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs(AB.length-CD.length)/max(AB.length,CD.length),0.04),lt(abs(AB.length-DA.length)/max(AB.length,DA.length),0.04))",
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
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "B",
          "C"
        ]
      },
      "count": 1,
      "height": 0.34,
      "appearance": {
        "strokeWidth": 2.2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "igualTodoCD",
      "label": "Igualdad total en CD",
      "color": "ocre",
      "layerId": "properties",
      "order": 420,
      "visible": true,
      "visibleWhen": "and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs(AB.length-CD.length)/max(AB.length,CD.length),0.04),lt(abs(AB.length-DA.length)/max(AB.length,DA.length),0.04))",
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
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "C",
          "D"
        ]
      },
      "count": 1,
      "height": 0.34,
      "appearance": {
        "strokeWidth": 2.2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "igualTodoDA",
      "label": "Igualdad total en DA",
      "color": "ocre",
      "layerId": "properties",
      "order": 430,
      "visible": true,
      "visibleWhen": "and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs(AB.length-CD.length)/max(AB.length,CD.length),0.04),lt(abs(AB.length-DA.length)/max(AB.length,DA.length),0.04))",
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
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "D",
          "A"
        ]
      },
      "count": 1,
      "height": 0.34,
      "appearance": {
        "strokeWidth": 2.2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "cometaACAB",
      "label": "Primer par del cometa en AB",
      "color": "ocre",
      "layerId": "properties",
      "order": 450,
      "visible": true,
      "visibleWhen": "and(lt(abs(AB.length-DA.length)/max(AB.length,DA.length),0.04),lt(abs(BC.length-CD.length)/max(BC.length,CD.length),0.04),not(and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs(AB.length-CD.length)/max(AB.length,CD.length),0.04),lt(abs(AB.length-DA.length)/max(AB.length,DA.length),0.04))))",
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
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "A",
          "B"
        ]
      },
      "count": 1,
      "height": 0.34,
      "appearance": {
        "strokeWidth": 2.2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "cometaACDA",
      "label": "Primer par del cometa en DA",
      "color": "ocre",
      "layerId": "properties",
      "order": 460,
      "visible": true,
      "visibleWhen": "and(lt(abs(AB.length-DA.length)/max(AB.length,DA.length),0.04),lt(abs(BC.length-CD.length)/max(BC.length,CD.length),0.04),not(and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs(AB.length-CD.length)/max(AB.length,CD.length),0.04),lt(abs(AB.length-DA.length)/max(AB.length,DA.length),0.04))))",
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
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "D",
          "A"
        ]
      },
      "count": 1,
      "height": 0.34,
      "appearance": {
        "strokeWidth": 2.2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "cometaACBC",
      "label": "Segundo par del cometa en BC",
      "color": "ocre",
      "layerId": "properties",
      "order": 470,
      "visible": true,
      "visibleWhen": "and(lt(abs(AB.length-DA.length)/max(AB.length,DA.length),0.04),lt(abs(BC.length-CD.length)/max(BC.length,CD.length),0.04),not(and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs(AB.length-CD.length)/max(AB.length,CD.length),0.04),lt(abs(AB.length-DA.length)/max(AB.length,DA.length),0.04))))",
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
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "B",
          "C"
        ]
      },
      "count": 2,
      "height": 0.34,
      "appearance": {
        "strokeWidth": 2.2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "cometaACCD",
      "label": "Segundo par del cometa en CD",
      "color": "ocre",
      "layerId": "properties",
      "order": 480,
      "visible": true,
      "visibleWhen": "and(lt(abs(AB.length-DA.length)/max(AB.length,DA.length),0.04),lt(abs(BC.length-CD.length)/max(BC.length,CD.length),0.04),not(and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs(AB.length-CD.length)/max(AB.length,CD.length),0.04),lt(abs(AB.length-DA.length)/max(AB.length,DA.length),0.04))))",
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
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "C",
          "D"
        ]
      },
      "count": 2,
      "height": 0.34,
      "appearance": {
        "strokeWidth": 2.2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "cometaBDAB",
      "label": "Primer par del cometa en AB",
      "color": "ocre",
      "layerId": "properties",
      "order": 500,
      "visible": true,
      "visibleWhen": "and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs(CD.length-DA.length)/max(CD.length,DA.length),0.04),not(and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs(AB.length-CD.length)/max(AB.length,CD.length),0.04),lt(abs(AB.length-DA.length)/max(AB.length,DA.length),0.04))))",
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
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "A",
          "B"
        ]
      },
      "count": 1,
      "height": 0.34,
      "appearance": {
        "strokeWidth": 2.2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "cometaBDBC",
      "label": "Primer par del cometa en BC",
      "color": "ocre",
      "layerId": "properties",
      "order": 510,
      "visible": true,
      "visibleWhen": "and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs(CD.length-DA.length)/max(CD.length,DA.length),0.04),not(and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs(AB.length-CD.length)/max(AB.length,CD.length),0.04),lt(abs(AB.length-DA.length)/max(AB.length,DA.length),0.04))))",
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
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "B",
          "C"
        ]
      },
      "count": 1,
      "height": 0.34,
      "appearance": {
        "strokeWidth": 2.2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "cometaBDCD",
      "label": "Segundo par del cometa en CD",
      "color": "ocre",
      "layerId": "properties",
      "order": 520,
      "visible": true,
      "visibleWhen": "and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs(CD.length-DA.length)/max(CD.length,DA.length),0.04),not(and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs(AB.length-CD.length)/max(AB.length,CD.length),0.04),lt(abs(AB.length-DA.length)/max(AB.length,DA.length),0.04))))",
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
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "C",
          "D"
        ]
      },
      "count": 2,
      "height": 0.34,
      "appearance": {
        "strokeWidth": 2.2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "cometaBDDA",
      "label": "Segundo par del cometa en DA",
      "color": "ocre",
      "layerId": "properties",
      "order": 530,
      "visible": true,
      "visibleWhen": "and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs(CD.length-DA.length)/max(CD.length,DA.length),0.04),not(and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs(AB.length-CD.length)/max(AB.length,CD.length),0.04),lt(abs(AB.length-DA.length)/max(AB.length,DA.length),0.04))))",
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
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "D",
          "A"
        ]
      },
      "count": 2,
      "height": 0.34,
      "appearance": {
        "strokeWidth": 2.2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "rectoA",
      "label": "Ángulo recto en A",
      "color": "ocre",
      "layerId": "properties",
      "order": 560,
      "visible": true,
      "visibleWhen": "and(lt(abs((B.x-A.x)*(D.x-A.x)+(B.y-A.y)*(D.y-A.y))/(AB.length*DA.length),0.035),lt(abs((A.x-B.x)*(C.x-B.x)+(A.y-B.y)*(C.y-B.y))/(AB.length*BC.length),0.035),lt(abs((B.x-A.x)*(D.y-C.y)-(B.y-A.y)*(D.x-C.x))/(AB.length*CD.length),0.035))",
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
      "objectType": "angle",
      "points": [
        "B",
        "A",
        "D"
      ],
      "sweep": "non-reflex",
      "marker": "square",
      "perpendicularRelationId": "rectoA-perpendicular",
      "appearance": {
        "radius": 0.42,
        "strokeWidth": 1.7,
        "fillOpacity": 0.16,
        "highlightStrokeWidth": 4.2,
        "highlightFillOpacity": 0.3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "rectoB",
      "label": "Ángulo recto en B",
      "color": "ocre",
      "layerId": "properties",
      "order": 570,
      "visible": true,
      "visibleWhen": "and(lt(abs((B.x-A.x)*(D.x-A.x)+(B.y-A.y)*(D.y-A.y))/(AB.length*DA.length),0.035),lt(abs((A.x-B.x)*(C.x-B.x)+(A.y-B.y)*(C.y-B.y))/(AB.length*BC.length),0.035),lt(abs((B.x-A.x)*(D.y-C.y)-(B.y-A.y)*(D.x-C.x))/(AB.length*CD.length),0.035))",
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
      "objectType": "angle",
      "points": [
        "C",
        "B",
        "A"
      ],
      "sweep": "non-reflex",
      "marker": "square",
      "perpendicularRelationId": "rectoB-perpendicular",
      "appearance": {
        "radius": 0.42,
        "strokeWidth": 1.7,
        "fillOpacity": 0.16,
        "highlightStrokeWidth": 4.2,
        "highlightFillOpacity": 0.3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "rectoC",
      "label": "Ángulo recto en C",
      "color": "ocre",
      "layerId": "properties",
      "order": 580,
      "visible": true,
      "visibleWhen": "and(lt(abs((B.x-A.x)*(D.x-A.x)+(B.y-A.y)*(D.y-A.y))/(AB.length*DA.length),0.035),lt(abs((A.x-B.x)*(C.x-B.x)+(A.y-B.y)*(C.y-B.y))/(AB.length*BC.length),0.035),lt(abs((B.x-A.x)*(D.y-C.y)-(B.y-A.y)*(D.x-C.x))/(AB.length*CD.length),0.035))",
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
      "objectType": "angle",
      "points": [
        "D",
        "C",
        "B"
      ],
      "sweep": "non-reflex",
      "marker": "square",
      "perpendicularRelationId": "rectoC-perpendicular",
      "appearance": {
        "radius": 0.42,
        "strokeWidth": 1.7,
        "fillOpacity": 0.16,
        "highlightStrokeWidth": 4.2,
        "highlightFillOpacity": 0.3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "rectoD",
      "label": "Ángulo recto en D",
      "color": "ocre",
      "layerId": "properties",
      "order": 590,
      "visible": true,
      "visibleWhen": "and(lt(abs((B.x-A.x)*(D.x-A.x)+(B.y-A.y)*(D.y-A.y))/(AB.length*DA.length),0.035),lt(abs((A.x-B.x)*(C.x-B.x)+(A.y-B.y)*(C.y-B.y))/(AB.length*BC.length),0.035),lt(abs((B.x-A.x)*(D.y-C.y)-(B.y-A.y)*(D.x-C.x))/(AB.length*CD.length),0.035))",
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
      "objectType": "angle",
      "points": [
        "A",
        "D",
        "C"
      ],
      "sweep": "non-reflex",
      "marker": "square",
      "perpendicularRelationId": "rectoD-perpendicular",
      "appearance": {
        "radius": 0.42,
        "strokeWidth": 1.7,
        "fillOpacity": 0.16,
        "highlightStrokeWidth": 4.2,
        "highlightFillOpacity": 0.3,
        "preserveColorOnHighlight": true
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
      "objectType": "angle",
      "points": [
        "B",
        "A",
        "D"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 0.58,
        "strokeWidth": 1.5,
        "fillOpacity": 0.18,
        "highlightStrokeWidth": 4.2,
        "highlightFillOpacity": 0.3,
        "highlightVisible": true,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "angle",
      "points": [
        "C",
        "B",
        "A"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 0.58,
        "strokeWidth": 1.5,
        "fillOpacity": 0.18,
        "highlightStrokeWidth": 4.2,
        "highlightFillOpacity": 0.3,
        "highlightVisible": true,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "angle",
      "points": [
        "D",
        "C",
        "B"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 0.58,
        "strokeWidth": 1.5,
        "fillOpacity": 0.18,
        "highlightStrokeWidth": 4.2,
        "highlightFillOpacity": 0.3,
        "highlightVisible": true,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "angle",
      "points": [
        "A",
        "D",
        "C"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 0.58,
        "strokeWidth": 1.5,
        "fillOpacity": 0.18,
        "highlightStrokeWidth": 4.2,
        "highlightFillOpacity": 0.3,
        "highlightVisible": true,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "A",
          "C"
        ]
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 1.8,
        "strokeOpacity": 0.8,
        "highlightStrokeWidth": 4.2,
        "highlightVisible": true,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "B",
          "D"
        ]
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 1.8,
        "strokeOpacity": 0.8,
        "highlightStrokeWidth": 4.2,
        "highlightVisible": true,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "",
        "rules": [
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
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0,
          0
        ]
      },
      "appearance": {
        "fontSize": 16,
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [
    {
      "id": "CEncimaAB",
      "label": "C permanece sobre AB",
      "enabled": true,
      "type": "same-half-plane",
      "points": [
        "C",
        "A"
      ],
      "boundary": "B"
    },
    {
      "id": "CNoCruzaBD",
      "label": "C no cruza la diagonal BD",
      "enabled": true,
      "type": "same-half-plane",
      "points": [
        "C",
        "B"
      ],
      "boundary": "D"
    },
    {
      "id": "DEncimaAB",
      "label": "D permanece sobre AB",
      "enabled": true,
      "type": "same-half-plane",
      "points": [
        "D",
        "A"
      ],
      "boundary": "B"
    },
    {
      "id": "DNoCruzaAC",
      "label": "D no cruza la diagonal AC",
      "enabled": true,
      "type": "same-half-plane",
      "points": [
        "D",
        "A"
      ],
      "boundary": "C"
    },
    {
      "id": "rectoA-perpendicular",
      "label": "Perpendicularidad de Ángulo recto en A",
      "enabled": true,
      "type": "perpendicular",
      "supports": [
        [
          "A",
          "B"
        ],
        [
          "A",
          "D"
        ]
      ]
    },
    {
      "id": "rectoB-perpendicular",
      "label": "Perpendicularidad de Ángulo recto en B",
      "enabled": true,
      "type": "perpendicular",
      "supports": [
        [
          "B",
          "C"
        ],
        [
          "B",
          "A"
        ]
      ]
    },
    {
      "id": "rectoC-perpendicular",
      "label": "Perpendicularidad de Ángulo recto en C",
      "enabled": true,
      "type": "perpendicular",
      "supports": [
        [
          "C",
          "D"
        ],
        [
          "C",
          "B"
        ]
      ]
    },
    {
      "id": "rectoD-perpendicular",
      "label": "Perpendicularidad de Ángulo recto en D",
      "enabled": true,
      "type": "perpendicular",
      "supports": [
        [
          "D",
          "A"
        ],
        [
          "D",
          "C"
        ]
      ]
    }
  ],
  "steps": [],
  "note": "Mueve C y D para descubrir los diferentes tipos de cuadriláteros"
}
);
/* @matematika-diagram-spec:end */

export const Cuadrilatero = () => <DiagramRenderer spec={CuadrilateroSpec} />;
