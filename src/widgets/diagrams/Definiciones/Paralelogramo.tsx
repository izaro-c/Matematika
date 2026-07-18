import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const ParalelogramoSpec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Paralelogramo",
  "componentId": "paralelogramo",
  "category": "Definiciones",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "viewport": {
    "bounds": [
      -5.2,
      4.3,
      5.2,
      -4.1
    ],
    "home": [
      -5.2,
      4.3,
      5.2,
      -4.1
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
      "label": "Paralelogramo",
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
      "label": "Propiedades bajo demanda",
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
      "label": "Paralelogramo ABCD",
      "memberIds": [
        "poligono"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Paralelogramo ABCD",
        "role": "primary"
      },
      "target": true,
      "targetId": "poligono",
      "color": "salvia"
    },
    {
      "id": "grupoParalelismo",
      "label": "Dos pares de lados opuestos paralelos",
      "memberIds": [
        "AB",
        "BC",
        "CD",
        "DA",
        "parAB",
        "parBC",
        "parCD",
        "parDA"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Dos pares de lados opuestos paralelos",
        "role": "primary"
      },
      "target": true,
      "targetId": "lados-opuestos",
      "color": "pavo"
    },
    {
      "id": "grupoIgualdad",
      "label": "Cuatro lados congruentes",
      "memberIds": [
        "igualAB",
        "igualBC",
        "igualCD",
        "igualDA"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Cuatro lados congruentes",
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
      "id": "grupoAngulosOpuestos",
      "label": "Ángulos opuestos congruentes",
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
        "ariaLabel": "Ángulos opuestos congruentes",
        "role": "primary"
      },
      "target": true,
      "targetId": "angulos-opuestos",
      "color": "terracota"
    },
    {
      "id": "grupoDiagonales",
      "label": "Diagonales y punto medio común",
      "memberIds": [
        "AC",
        "BD",
        "M"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Diagonales que se bisecan",
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
      "order": 100,
      "visible": true,
      "locked": true,
      "groupIds": [],
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
          -16,
          10
        ],
        "labelSize": 19,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -3,
      "y": -1.5,
      "showLabel": true,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "B",
      "label": "B",
      "color": "carbon",
      "layerId": "geometry",
      "order": 110,
      "visible": true,
      "locked": true,
      "groupIds": [],
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
          10
        ],
        "labelSize": 19,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 1.5,
      "y": -1.5,
      "showLabel": true,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "D",
      "label": "D",
      "color": "terracota",
      "layerId": "geometry",
      "order": 120,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Mueve D para clasificar el paralelogramo",
        "role": "primary"
      },
      "target": true,
      "targetId": "vertice-movil",
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
      "x": -1.5,
      "y": 2,
      "showLabel": true,
      "fixed": false,
      "constraint": "constrained",
      "constraintIds": [
        "mantenerConvexo"
      ],
      "snapToGrid": true,
      "snapSize": 0.25,
      "attractorIds": [
        "guiaRectangulo",
        "guiaLadosIguales"
      ],
      "attractorDistance": 0.45,
      "snatchDistance": 0.62
    },
    {
      "id": "C",
      "label": "C",
      "color": "carbon",
      "layerId": "geometry",
      "order": 130,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Vértice C construido por traslación",
        "role": "construction"
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
      "x": 3,
      "y": 2,
      "showLabel": true,
      "fixed": true,
      "constraint": "derived",
      "dependencies": [
        "A",
        "B",
        "D"
      ],
      "xExpression": "B.x+D.x-A.x",
      "yExpression": "B.y+D.y-A.y"
    }
  ],
  "elements": [
    {
      "id": "guiaRectangulo",
      "label": "Guía perpendicular para rectángulos",
      "color": "pizarra",
      "layerId": "guides",
      "order": 10,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Guía magnética de ángulo recto",
        "role": "construction"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.2,
        "strokeOpacity": 0.25,
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
      "id": "guiaLadosIguales",
      "label": "Guía circular para lados iguales",
      "color": "pizarra",
      "layerId": "guides",
      "order": 20,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Guía magnética de lados iguales",
        "role": "construction"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.2,
        "strokeOpacity": 0.25,
        "fillOpacity": 0,
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
      "id": "poligono",
      "label": "Paralelogramo ABCD",
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
        "ariaLabel": "Paralelogramo ABCD",
        "role": "primary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.4,
        "fillOpacity": 0.12,
        "highlightStrokeWidth": 4.2,
        "highlightFillOpacity": 0.28,
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
      "color": "terracota",
      "layerId": "geometry",
      "order": 210,
      "visible": true,
      "locked": false,
      "groupIds": [
        "grupoParalelismo"
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
      "color": "pavo",
      "layerId": "geometry",
      "order": 220,
      "visible": true,
      "locked": false,
      "groupIds": [
        "grupoParalelismo"
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
      "color": "terracota",
      "layerId": "geometry",
      "order": 230,
      "visible": true,
      "locked": false,
      "groupIds": [
        "grupoParalelismo"
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
      "color": "pavo",
      "layerId": "geometry",
      "order": 240,
      "visible": true,
      "locked": false,
      "groupIds": [
        "grupoParalelismo"
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
      "label": "Una flecha: AB paralelo a CD",
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
        "ariaLabel": "Una flecha: AB paralelo a CD",
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
        "markCount": 1
      }
    },
    {
      "id": "parCD",
      "label": "Una flecha: CD paralelo a AB",
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
        "ariaLabel": "Una flecha: CD paralelo a AB",
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
        "markCount": 1
      }
    },
    {
      "id": "parBC",
      "label": "Dos flechas: BC paralelo a DA",
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
        "ariaLabel": "Dos flechas: BC paralelo a DA",
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
        "markCount": 2
      }
    },
    {
      "id": "parDA",
      "label": "Dos flechas: DA paralelo a BC",
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
        "ariaLabel": "Dos flechas: DA paralelo a BC",
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
        "markCount": 2
      }
    },
    {
      "id": "igualAB",
      "label": "Marca de igualdad en AB",
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
        "ariaLabel": "Marca de igualdad en AB",
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
        "visibleWhen": "lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04)"
      }
    },
    {
      "id": "igualBC",
      "label": "Marca de igualdad en BC",
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
        "ariaLabel": "Marca de igualdad en BC",
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
        "visibleWhen": "lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04)"
      }
    },
    {
      "id": "igualCD",
      "label": "Marca de igualdad en CD",
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
        "ariaLabel": "Marca de igualdad en CD",
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
        "visibleWhen": "lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04)"
      }
    },
    {
      "id": "igualDA",
      "label": "Marca de igualdad en DA",
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
        "ariaLabel": "Marca de igualdad en DA",
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
        "visibleWhen": "lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04)"
      }
    },
    {
      "id": "rectoA",
      "label": "Ángulo recto en A",
      "color": "ocre",
      "layerId": "properties",
      "order": 500,
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
        "visibleWhen": "lt(abs((B.x-A.x)*(D.x-A.x)+(B.y-A.y)*(D.y-A.y))/(AB.length*DA.length),0.035)"
      }
    },
    {
      "id": "rectoB",
      "label": "Ángulo recto en B",
      "color": "ocre",
      "layerId": "properties",
      "order": 510,
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
        "visibleWhen": "lt(abs((B.x-A.x)*(D.x-A.x)+(B.y-A.y)*(D.y-A.y))/(AB.length*DA.length),0.035)"
      }
    },
    {
      "id": "rectoC",
      "label": "Ángulo recto en C",
      "color": "ocre",
      "layerId": "properties",
      "order": 520,
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
        "visibleWhen": "lt(abs((B.x-A.x)*(D.x-A.x)+(B.y-A.y)*(D.y-A.y))/(AB.length*DA.length),0.035)"
      }
    },
    {
      "id": "rectoD",
      "label": "Ángulo recto en D",
      "color": "ocre",
      "layerId": "properties",
      "order": 530,
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
        "visibleWhen": "lt(abs((B.x-A.x)*(D.x-A.x)+(B.y-A.y)*(D.y-A.y))/(AB.length*DA.length),0.035)"
      }
    },
    {
      "id": "anguloA",
      "label": "Ángulo A",
      "color": "terracota",
      "layerId": "details",
      "order": 600,
      "visible": false,
      "locked": false,
      "groupIds": [
        "grupoAngulosOpuestos"
      ],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Ángulo A",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.5,
        "fillOpacity": 0.18,
        "angleRadius": 0.62,
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
      "label": "Ángulo B",
      "color": "pavo",
      "layerId": "details",
      "order": 610,
      "visible": false,
      "locked": false,
      "groupIds": [
        "grupoAngulosOpuestos"
      ],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Ángulo B",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.5,
        "fillOpacity": 0.18,
        "angleRadius": 0.62,
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
      "label": "Ángulo C",
      "color": "terracota",
      "layerId": "details",
      "order": 620,
      "visible": false,
      "locked": false,
      "groupIds": [
        "grupoAngulosOpuestos"
      ],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Ángulo C",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.5,
        "fillOpacity": 0.18,
        "angleRadius": 0.62,
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
      "label": "Ángulo D",
      "color": "pavo",
      "layerId": "details",
      "order": 630,
      "visible": false,
      "locked": false,
      "groupIds": [
        "grupoAngulosOpuestos"
      ],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Ángulo D",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.5,
        "fillOpacity": 0.18,
        "angleRadius": 0.62,
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
      "order": 700,
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
        "strokeWidth": 1.6,
        "highlightStrokeWidth": 3.4,
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
      "order": 710,
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
        "strokeWidth": 1.6,
        "highlightStrokeWidth": 3.4,
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
      "id": "M",
      "label": "Punto medio común M",
      "color": "pizarra",
      "layerId": "details",
      "order": 720,
      "visible": false,
      "locked": false,
      "groupIds": [
        "grupoDiagonales"
      ],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Punto medio común M",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.4,
        "pointSize": 5,
        "highlightStrokeWidth": 4.2,
        "highlightPointSize": 8,
        "highlightVisible": true,
        "preserveColorOnHighlight": true
      },
      "kind": "intersection",
      "refs": [
        "AC",
        "BD"
      ]
    },
    {
      "id": "clasificacion",
      "label": "Clasificación dinámica",
      "color": "musgo",
      "layerId": "annotations",
      "order": 800,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Clasificación dinámica del paralelogramo",
        "role": "annotation"
      },
      "target": true,
      "targetId": "clasificacion",
      "style": {
        "strokeWidth": 2.4,
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
            "when": "and(lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04),lt(abs((B.x-A.x)*(D.x-A.x)+(B.y-A.y)*(D.y-A.y))/(AB.length*DA.length),0.035))",
            "text": "Cuadrado $\\\\$ 4 lados iguales · 4 ángulos rectos"
          },
          {
            "when": "lt(abs((B.x-A.x)*(D.x-A.x)+(B.y-A.y)*(D.y-A.y))/(AB.length*DA.length),0.035)",
            "text": "Rectángulo $\\\\$ 4 ángulos rectos"
          },
          {
            "when": "lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04)",
            "text": "Rombo $\\\\$ 4 lados iguales"
          },
          {
            "when": "1",
            "text": "Paralelogramo $\\\\$ 2 pares de lados opuestos paralelos"
          }
        ]
      }
    }
  ],
  "sliders": [],
  "steps": [],
  "constraints": [
    {
      "id": "mantenerConvexo",
      "label": "D permanece en el semiplano superior de AB",
      "kind": "sameSide",
      "refs": [
        "D",
        "A",
        "B"
      ],
      "enabled": true
    }
  ],
  "dependencies": [
    {
      "sourceId": "A",
      "targetId": "guiaRectangulo",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "guiaRectangulo",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "guiaLadosIguales",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "guiaLadosIguales",
      "relation": "construction"
    },
    {
      "sourceId": "guiaRectangulo",
      "targetId": "D",
      "relation": "constraint"
    },
    {
      "sourceId": "guiaLadosIguales",
      "targetId": "D",
      "relation": "constraint"
    },
    {
      "sourceId": "A",
      "targetId": "D",
      "relation": "constraint",
      "constraintId": "mantenerConvexo"
    },
    {
      "sourceId": "B",
      "targetId": "D",
      "relation": "constraint",
      "constraintId": "mantenerConvexo"
    },
    {
      "sourceId": "A",
      "targetId": "C",
      "relation": "expression"
    },
    {
      "sourceId": "B",
      "targetId": "C",
      "relation": "expression"
    },
    {
      "sourceId": "D",
      "targetId": "C",
      "relation": "expression"
    },
    {
      "sourceId": "AB",
      "targetId": "igualAB",
      "relation": "expression"
    },
    {
      "sourceId": "BC",
      "targetId": "igualAB",
      "relation": "expression"
    },
    {
      "sourceId": "AB",
      "targetId": "igualBC",
      "relation": "expression"
    },
    {
      "sourceId": "BC",
      "targetId": "igualBC",
      "relation": "expression"
    },
    {
      "sourceId": "AB",
      "targetId": "igualCD",
      "relation": "expression"
    },
    {
      "sourceId": "BC",
      "targetId": "igualCD",
      "relation": "expression"
    },
    {
      "sourceId": "AB",
      "targetId": "igualDA",
      "relation": "expression"
    },
    {
      "sourceId": "BC",
      "targetId": "igualDA",
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
      "sourceId": "DA",
      "targetId": "rectoD",
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
      "sourceId": "B",
      "targetId": "clasificacion",
      "relation": "expression"
    },
    {
      "sourceId": "A",
      "targetId": "clasificacion",
      "relation": "expression"
    },
    {
      "sourceId": "D",
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
  "note": "Mueve D para descubrir los diferentes tipos de paralelogramo",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const Paralelogramo = () => <DiagramRenderer spec={ParalelogramoSpec} />;
