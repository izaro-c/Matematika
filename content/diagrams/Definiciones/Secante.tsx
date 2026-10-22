import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const SecanteSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Rectas secantes y secante transversal",
  "componentId": "secante",
  "category": "Definiciones",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "viewport": {
    "bounds": [
      -5.5,
      4.5,
      5.5,
      -4.5
    ],
    "home": [
      -5.5,
      4.5,
      5.5,
      -4.5
    ],
    "minZoom": 0.5,
    "maxZoom": 5,
    "padding": 0.16
  },
  "layers": [
    {
      "id": "geometry",
      "label": "Geometría",
      "order": 0,
      "visible": true,
      "locked": false
    },
    {
      "id": "annotations",
      "label": "Anotaciones",
      "order": 1,
      "visible": true,
      "locked": false
    }
  ],
  "groups": [
    {
      "id": "gSecantes",
      "label": "Rectas secantes",
      "memberIds": [
        "lineL1",
        "lineL2"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Par de rectas secantes l1 y l2",
        "role": "primary"
      },
      "target": true,
      "targetId": "rectas-secantes",
      "color": "terracota"
    },
    {
      "id": "gTransversal",
      "label": "Secante transversal",
      "memberIds": [
        "lineT",
        "pP1",
        "pP2"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta transversal t con sus puntos de corte",
        "role": "primary"
      },
      "target": true,
      "targetId": "secante-transversal",
      "color": "musgo"
    }
  ],
  "objects": [
    {
      "id": "pA",
      "label": "A",
      "color": "terracota",
      "layerId": "geometry",
      "order": 10,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto A de la recta l1",
        "role": "primary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3.5,
        "y": -1
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 6,
        "labelVisible": false,
        "highlightSize": 9,
        "preserveColorOnHighlight": true
      },
      "interaction": {
        "snapToGrid": false
      }
    },
    {
      "id": "pB",
      "label": "B",
      "color": "terracota",
      "layerId": "geometry",
      "order": 11,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto B de la recta l1",
        "role": "primary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 3.5,
        "y": 1.5
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 6,
        "labelVisible": false,
        "highlightSize": 9,
        "preserveColorOnHighlight": true
      },
      "interaction": {
        "snapToGrid": false
      }
    },
    {
      "id": "pC",
      "label": "C",
      "color": "carbon",
      "layerId": "geometry",
      "order": 12,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto C de la recta l2",
        "role": "primary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3.5,
        "y": 2
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 6,
        "labelVisible": false,
        "highlightSize": 9,
        "preserveColorOnHighlight": true
      },
      "interaction": {
        "snapToGrid": false
      }
    },
    {
      "id": "pD",
      "label": "D",
      "color": "carbon",
      "layerId": "geometry",
      "order": 13,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto D de la recta l2",
        "role": "primary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 3.5,
        "y": -2
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 6,
        "labelVisible": false,
        "highlightSize": 9,
        "preserveColorOnHighlight": true
      },
      "interaction": {
        "snapToGrid": false
      }
    },
    {
      "id": "lineL1",
      "label": "l₁",
      "color": "terracota",
      "layerId": "geometry",
      "order": 20,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gSecantes"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta l1",
        "role": "primary"
      },
      "target": true,
      "targetId": "lineL1",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "through-points",
          "points": [
            "pA",
            "pB"
          ]
        }
      },
      "appearance": {
        "strokeWidth": 2.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "lineL2",
      "label": "l₂",
      "color": "carbon",
      "layerId": "geometry",
      "order": 21,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gSecantes"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta l2",
        "role": "primary"
      },
      "target": true,
      "targetId": "lineL2",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "through-points",
          "points": [
            "pC",
            "pD"
          ]
        }
      },
      "appearance": {
        "strokeWidth": 2.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pP",
      "label": "P",
      "color": "ocre",
      "layerId": "geometry",
      "order": 30,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto de intersección P entre l1 y l2",
        "role": "primary"
      },
      "target": true,
      "targetId": "pP",
      "objectType": "point",
      "definition": {
        "type": "intersection",
        "supports": [
          "lineL1",
          "lineL2"
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 8,
        "labelVisible": true,
        "highlightSize": 11,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pE",
      "label": "E",
      "color": "musgo",
      "layerId": "geometry",
      "order": 14,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto E de la recta transversal",
        "role": "primary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 1.2,
        "y": 3.2
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 6,
        "labelVisible": false,
        "highlightSize": 9,
        "preserveColorOnHighlight": true
      },
      "interaction": {
        "snapToGrid": false
      }
    },
    {
      "id": "pF",
      "label": "F",
      "color": "musgo",
      "layerId": "geometry",
      "order": 15,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto F de la recta transversal",
        "role": "primary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.2,
        "y": -3.2
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 6,
        "labelVisible": false,
        "highlightSize": 9,
        "preserveColorOnHighlight": true
      },
      "interaction": {
        "snapToGrid": false
      }
    },
    {
      "id": "lineT",
      "label": "t",
      "color": "musgo",
      "layerId": "geometry",
      "order": 25,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTransversal"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta transversal t",
        "role": "primary"
      },
      "target": true,
      "targetId": "lineT",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "through-points",
          "points": [
            "pE",
            "pF"
          ]
        }
      },
      "appearance": {
        "strokeWidth": 2.2,
        "dashed": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pP1",
      "label": "P₁",
      "color": "pavo",
      "layerId": "geometry",
      "order": 35,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTransversal"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Intersección P1 de t con l1",
        "role": "primary"
      },
      "target": true,
      "targetId": "pP1",
      "objectType": "point",
      "definition": {
        "type": "intersection",
        "supports": [
          "lineL1",
          "lineT"
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pP2",
      "label": "P₂",
      "color": "pavo",
      "layerId": "geometry",
      "order": 36,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTransversal"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Intersección P2 de t con l2",
        "role": "primary"
      },
      "target": true,
      "targetId": "pP2",
      "objectType": "point",
      "definition": {
        "type": "intersection",
        "supports": [
          "lineL2",
          "lineT"
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [],
  "steps": [],
  "note": "Arrastra los puntos de control para modificar la inclinación de las rectas secantes l₁ y l₂ o cambiar la posición de la secante transversal t.",
  "translations": {
    "eu": {
      "title": "Zuzen ebakitzaileak eta zeharrekoa",
      "note": "Arrastatu kontrol-puntuak l₁ eta l₂ zuzen ebakitzaileen inklinazioa aldatzeko edo t zeharreko zuzenaren posizioa aldatzeko.",
      "ariaLabels": {
        "pA": "Mugitu l1 zuzenaren A puntua",
        "pB": "Mugitu l1 zuzenaren B puntua",
        "pC": "Mugitu l2 zuzenaren C puntua",
        "pD": "Mugitu l2 zuzenaren D puntua",
        "pE": "Mugitu t zeharreko zuzenaren E puntua",
        "pF": "Mugitu t zeharreko zuzenaren F puntua",
        "lineL1": "l1 zuzena",
        "lineL2": "l2 zuzena",
        "lineT": "t zeharreko zuzena",
        "pP": "l1 eta l2 zuzenen P ebakidura-puntua",
        "pP1": "t eta l1 zuzenen P1 ebakidura-puntua",
        "pP2": "t eta l2 zuzenen P2 ebakidura-puntua",
        "gSecantes": "l1 eta l2 zuzen ebakitzaileen parea",
        "gTransversal": "t zeharreko zuzena bere ebakidura-puntuekin"
      }
    },
    "en": {
      "title": "Secant Lines and Transversal",
      "note": "Drag the control points to adjust the slope of secant lines l₁ and l₂ or shift the transversal line t.",
      "ariaLabels": {
        "pA": "Move point A of line l1",
        "pB": "Move point B of line l1",
        "pC": "Move point C of line l2",
        "pD": "Move point D of line l2",
        "pE": "Move point E of transversal line",
        "pF": "Move point F of transversal line",
        "lineL1": "Line l1",
        "lineL2": "Line l2",
        "lineT": "Transversal line t",
        "pP": "Intersection point P between l1 and l2",
        "pP1": "Intersection point P1 of t with l1",
        "pP2": "Intersection point P2 of t with l2",
        "gSecantes": "Pair of secant lines l1 and l2",
        "gTransversal": "Transversal line t with its intersection points"
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const Secante = () => <DiagramRenderer spec={SecanteSpec} />;
