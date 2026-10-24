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
      "id": "lineAC",
      "label": "Recta ℓ",
      "color": "carbon",
      "layerId": "geometry",
      "order": 10,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta soporte ℓ",
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
    }
  ],
  "relations": [],
  "steps": [
    {
      "id": "step-orden",
      "label": "Intermediación $A * B * C$",
      "description": "El punto $B$ está entre $A$ y $C$; los tres son puntos distintos de la recta $\\ell$.",
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
        }
      }
    }
  ],
  "note": "Arrastra A y C para mover la recta; desliza B entre ellos.",
  "translations": {
    "eu": {
      "title": "Artean egotea (bitartekotasuna)",
      "note": "Arrastatu A eta C zuzena mugitzeko; irristatu B haien artean.",
      "steps": {
        "step-orden": {
          "label": "Bitartekotasuna $A * B * C$",
          "description": "$B$ puntua $A$ eta $C$ puntuen artean dago; hirurak $\\ell$ zuzeneko puntu desberdinak dira."
        }
      },
      "ariaLabels": {
        "pA": "A puntua",
        "pC": "C puntua",
        "pB": "B bitarteko puntua",
        "lineAC": "ℓ zuzen euskarria",
        "segAB": "AB zuzenkia",
        "segBC": "BC zuzenkia",
        "segAC": "AC zuzenki osoa"
      }
    },
    "en": {
      "title": "Betweenness (Intermediacy)",
      "note": "Drag A and C to move the line; slide B between them.",
      "steps": {
        "step-orden": {
          "label": "Betweenness $A * B * C$",
          "description": "Point $B$ lies between $A$ and $C$; the three are distinct points of line $\\ell$."
        }
      },
      "ariaLabels": {
        "pA": "Point A",
        "pC": "Point C",
        "pB": "Intermediate point B",
        "lineAC": "Supporting line ℓ",
        "segAB": "Segment AB",
        "segBC": "Segment BC",
        "segAC": "Whole segment AC"
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const EstarEntre = () => <DiagramRenderer spec={EstarEntreSpec} />;
