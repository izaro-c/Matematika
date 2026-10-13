import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const EstarEntreSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Estar entre (intermediación)",
  "componentId": "estar-entre",
  "category": "Fundamentos",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "showLabels": true,
  "viewport": {
    "bounds": [
      -6,
      3.5,
      6,
      -3.5
    ],
    "home": [
      -6,
      3.5,
      6,
      -3.5
    ],
    "minZoom": 0.2,
    "maxZoom": 10,
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
  "groups": [],
  "objects": [
    {
      "id": "pA",
      "label": "A",
      "color": "musgo",
      "layerId": "geometry",
      "order": 30,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto A",
        "role": "primary"
      },
      "target": true,
      "targetId": "pA",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3.5,
        "y": -0.8
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {
        "snapToGrid": false
      }
    },
    {
      "id": "pC",
      "label": "C",
      "color": "musgo",
      "layerId": "geometry",
      "order": 31,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto C",
        "role": "primary"
      },
      "target": true,
      "targetId": "pC",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 3.5,
        "y": 0.89
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {
        "snapToGrid": false
      }
    },
    {
      "id": "pB",
      "label": "B",
      "color": "ocre",
      "layerId": "geometry",
      "order": 32,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto intermedio B",
        "role": "primary"
      },
      "target": true,
      "targetId": "pB",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0,
        "y": 0.013721423405848698
      },
      "mobility": {
        "type": "on-support",
        "support": "segAC"
      },
      "appearance": {
        "size": 8,
        "labelVisible": true,
        "highlightSize": 11,
        "preserveColorOnHighlight": true
      },
      "interaction": {
        "snapToGrid": false
      }
    },
    {
      "id": "pD",
      "label": "D",
      "color": "pavo",
      "layerId": "geometry",
      "order": 33,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto exterior D",
        "role": "primary"
      },
      "target": true,
      "targetId": "pD",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 5.2,
        "y": 0
      },
      "mobility": {
        "type": "on-support",
        "support": "lineAC"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {
        "snapToGrid": false
      }
    },
    {
      "id": "lineAC",
      "label": "Recta r",
      "color": "carbon",
      "layerId": "geometry",
      "order": 10,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta soporte r",
        "role": "construction"
      },
      "target": true,
      "targetId": "lineAC",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "through-points",
          "points": [
            "pA",
            "pC"
          ]
        }
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 1.8,
        "strokeOpacity": 0.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segAB",
      "label": "Segmento AB",
      "color": "pavo",
      "layerId": "geometry",
      "order": 20,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento AB",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segAB",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pA",
          "pB"
        ]
      },
      "appearance": {
        "strokeWidth": 3.2,
        "highlightStrokeWidth": 4.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segBC",
      "label": "Segmento BC",
      "color": "terracota",
      "layerId": "geometry",
      "order": 21,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento BC",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segBC",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pB",
          "pC"
        ]
      },
      "appearance": {
        "strokeWidth": 3.2,
        "highlightStrokeWidth": 4.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segAC",
      "label": "Segmento AC",
      "color": "musgo",
      "layerId": "geometry",
      "order": 19,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento total AC",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segAC",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pA",
          "pC"
        ]
      },
      "appearance": {
        "strokeWidth": 2.6,
        "highlightStrokeWidth": 4,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segCD",
      "label": "Segmento CD",
      "color": "pavo",
      "layerId": "geometry",
      "order": 22,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento extendido CD",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segCD",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pC",
          "pD"
        ]
      },
      "appearance": {
        "strokeWidth": 3.2,
        "highlightStrokeWidth": 4.5,
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [],
  "steps": [
    {
      "id": "step-orden",
      "label": "Intermediación A * B * C",
      "description": "El punto B se sitúa en el interior del segmento delimitado por A y C.",
      "visibleTargets": [
        "pA",
        "pB",
        "pC",
        "lineAC",
        "segAB",
        "segBC",
        "segAC"
      ],
      "durationMs": 1200,
      "objectStates": {
        "pA": {
          "visible": true,
          "emphasis": "none"
        },
        "pB": {
          "visible": true,
          "emphasis": "none"
        },
        "pC": {
          "visible": true,
          "emphasis": "none"
        },
        "pD": {
          "visible": false
        },
        "lineAC": {
          "visible": true
        },
        "segAB": {
          "visible": true,
          "emphasis": "none"
        },
        "segBC": {
          "visible": true,
          "emphasis": "none"
        },
        "segAC": {
          "visible": true
        },
        "segCD": {
          "visible": false
        }
      }
    }
  ],
  "note": "Arrastra los puntos A y C para mover la recta, o desliza B a lo largo de ella.",
  "translations": {
    "eu": {
      "title": "Tartean egon (bitartekotasuna)",
      "note": "Arrastatu A eta C puntuak zuzena mugitzeko, edo irristatu B zuzenaren gainean.",
      "steps": {
        "step-orden": {
          "label": "Bitartekotasuna A * B * C",
          "description": "B puntua A eta C-k mugatutako segmentuaren barnean kokatzen da."
        }
      },
      "ariaLabels": {
        "pA": "A puntua",
        "pC": "C puntua",
        "pB": "B tarteko puntua",
        "pD": "D kanpo-puntua",
        "lineAC": "r euskarri-zuzena",
        "segAB": "AB segmentua",
        "segBC": "BC segmentua",
        "segAC": "AC segmentu osoa",
        "segCD": "CD segmentu luzatua"
      }
    },
    "en": {
      "title": "Betweenness (Intermediacy)",
      "note": "Drag points A and C to move the line, or slide B along it.",
      "steps": {
        "step-orden": {
          "label": "Betweenness A * B * C",
          "description": "Point B lies strictly within the segment bounded by A and C."
        }
      },
      "ariaLabels": {
        "pA": "Point A",
        "pC": "Point C",
        "pB": "Intermediate point B",
        "pD": "Exterior point D",
        "lineAC": "Supporting line r",
        "segAB": "Segment AB",
        "segBC": "Segment BC",
        "segAC": "Whole segment AC",
        "segCD": "Extended segment CD"
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const EstarEntre = () => <DiagramRenderer spec={EstarEntreSpec} />;
