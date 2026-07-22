import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const ParalelogramoSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
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
  "objects": [
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3,
        "y": -1.5
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "labelOffset": [
          -16,
          10
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 1.5,
        "y": -1.5
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "labelOffset": [
          10,
          10
        ],
        "labelSize": 19,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -1.5,
        "y": 2
      },
      "mobility": {
        "type": "constrained",
        "relationIds": [
          "mantenerConvexo"
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
          "guiaRectangulo",
          "guiaLadosIguales"
        ],
        "attractorDistance": 0.45,
        "snatchDistance": 0.62
      }
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
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "B.x+D.x-A.x",
        "y": "B.y+D.y-A.y",
        "fallback": [
          3,
          2
        ]
      },
      "mobility": {
        "type": "fixed"
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
      "interaction": {}
    },
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
        "strokeOpacity": 0.25,
        "highlightStrokeWidth": 4.2,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "circle",
        "center": "A",
        "point": "B"
      },
      "appearance": {
        "strokeWidth": 1.2,
        "strokeOpacity": 0.25,
        "fillOpacity": 0,
        "highlightStrokeWidth": 4.2,
        "preserveColorOnHighlight": true
      }
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
        "highlightFillOpacity": 0.28,
        "preserveColorOnHighlight": true
      }
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
      "id": "igualAB",
      "label": "Marca de igualdad en AB",
      "color": "ocre",
      "layerId": "properties",
      "order": 400,
      "visible": true,
      "visibleWhen": "lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04)",
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
      "id": "igualBC",
      "label": "Marca de igualdad en BC",
      "color": "ocre",
      "layerId": "properties",
      "order": 410,
      "visible": true,
      "visibleWhen": "lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04)",
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
      "id": "igualCD",
      "label": "Marca de igualdad en CD",
      "color": "ocre",
      "layerId": "properties",
      "order": 420,
      "visible": true,
      "visibleWhen": "lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04)",
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
      "id": "igualDA",
      "label": "Marca de igualdad en DA",
      "color": "ocre",
      "layerId": "properties",
      "order": 430,
      "visible": true,
      "visibleWhen": "lt(abs(AB.length-BC.length)/max(AB.length,BC.length),0.04)",
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
      "id": "rectoA",
      "label": "Ángulo recto en A",
      "color": "ocre",
      "layerId": "properties",
      "order": 500,
      "visible": true,
      "visibleWhen": "lt(abs((B.x-A.x)*(D.x-A.x)+(B.y-A.y)*(D.y-A.y))/(AB.length*DA.length),0.035)",
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
      "order": 510,
      "visible": true,
      "visibleWhen": "lt(abs((B.x-A.x)*(D.x-A.x)+(B.y-A.y)*(D.y-A.y))/(AB.length*DA.length),0.035)",
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
      "order": 520,
      "visible": true,
      "visibleWhen": "lt(abs((B.x-A.x)*(D.x-A.x)+(B.y-A.y)*(D.y-A.y))/(AB.length*DA.length),0.035)",
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
      "order": 530,
      "visible": true,
      "visibleWhen": "lt(abs((B.x-A.x)*(D.x-A.x)+(B.y-A.y)*(D.y-A.y))/(AB.length*DA.length),0.035)",
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
      "objectType": "angle",
      "points": [
        "B",
        "A",
        "D"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 0.62,
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
      "objectType": "angle",
      "points": [
        "C",
        "B",
        "A"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 0.62,
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
      "objectType": "angle",
      "points": [
        "D",
        "C",
        "B"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 0.62,
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
      "objectType": "angle",
      "points": [
        "A",
        "D",
        "C"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 0.62,
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
        "strokeWidth": 1.6,
        "highlightStrokeWidth": 3.4,
        "highlightVisible": true,
        "preserveColorOnHighlight": true
      }
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
        "strokeWidth": 1.6,
        "highlightStrokeWidth": 3.4,
        "highlightVisible": true,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "point",
      "definition": {
        "type": "intersection",
        "supports": [
          "AC",
          "BD"
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 5,
        "highlightSize": 8,
        "preserveColorOnHighlight": true,
        "highlightVisible": true
      }
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
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "",
        "rules": [
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
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0,
          0
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [
    {
      "id": "mantenerConvexo",
      "label": "D permanece en el semiplano superior de AB",
      "enabled": true,
      "type": "same-half-plane",
      "points": [
        "D",
        "A"
      ],
      "boundary": "B"
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
  "note": "Mueve D para descubrir los diferentes tipos de paralelogramo"
}
);
/* @matematika-diagram-spec:end */

export const Paralelogramo = () => <DiagramRenderer spec={ParalelogramoSpec} />;
