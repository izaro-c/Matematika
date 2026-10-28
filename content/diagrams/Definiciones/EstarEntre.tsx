import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const EstarEntreSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Estar entre",
  "componentId": "estar-entre",
  "category": "Definiciones",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "showLabels": true,
  "viewport": {
    "bounds": [
      -5.5,
      2.9,
      5.5,
      -2.6
    ],
    "home": [
      -5.5,
      2.9,
      5.5,
      -2.6
    ],
    "minZoom": 0.5,
    "maxZoom": 4,
    "padding": 0.06
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
        "y": -0.9
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
        "y": 0.9
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
        "ariaLabel": "Punto B",
        "role": "primary"
      },
      "target": true,
      "targetId": "pB",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -0.7,
        "y": -0.18
      },
      "mobility": {
        "type": "on-support",
        "support": "lineAC"
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
      "id": "tB",
      "label": "Posición de B en la recta",
      "color": "carbon",
      "layerId": "annotations",
      "order": 40,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "ariaLabel": "Posición de B en la recta",
        "role": "secondary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "((pB.x - pA.x) * (pC.x - pA.x) + (pB.y - pA.y) * (pC.y - pA.y)) / max(0.0001, (pC.x - pA.x) * (pC.x - pA.x) + (pC.y - pA.y) * (pC.y - pA.y))",
        "y": "hypot(pC.x - pA.x, pC.y - pA.y)",
        "fallback": [
          0.5,
          7
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 2,
        "labelVisible": false
      }
    },
    {
      "id": "haloB",
      "label": "Marca: B no está entre A y C",
      "color": "granada",
      "layerId": "geometry",
      "order": 29,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "visibleWhen": "not(and(gt(tB.x, 0), lt(tB.x, 1), gt(hypot(pB.x - pA.x, pB.y - pA.y), 0.15), gt(hypot(pC.x - pB.x, pC.y - pB.y), 0.15), gt(tB.y, 0.3)))",
      "selection": {
        "selectable": false,
        "ariaLabel": "B no está entre A y C",
        "role": "secondary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "pB.x",
        "y": "pB.y",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 13,
        "labelVisible": false,
        "opacity": 0.4
      }
    },
    {
      "id": "estadoSi",
      "label": "Estado: B está entre A y C",
      "color": "carbon",
      "layerId": "annotations",
      "order": 700,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "visibleWhen": "and(gt(tB.x, 0), lt(tB.x, 1), gt(hypot(pB.x - pA.x, pB.y - pA.y), 0.15), gt(hypot(pC.x - pB.x, pC.y - pB.y), 0.15), gt(tB.y, 0.3))",
      "selection": {
        "selectable": true,
        "role": "annotation",
        "ariaLabel": "Estado de A * B * C"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "",
        "blocks": [
          {
            "id": "estado",
            "text": "$A * B * C$: sí",
            "color": "musgo"
          }
        ]
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.5,
          0
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "estadoNo",
      "label": "Estado: B no está entre A y C",
      "color": "carbon",
      "layerId": "annotations",
      "order": 701,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "visibleWhen": "not(and(gt(tB.x, 0), lt(tB.x, 1), gt(hypot(pB.x - pA.x, pB.y - pA.y), 0.15), gt(hypot(pC.x - pB.x, pC.y - pB.y), 0.15), gt(tB.y, 0.3)))",
      "selection": {
        "selectable": true,
        "role": "annotation",
        "ariaLabel": "Estado de A * B * C"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "",
        "blocks": [
          {
            "id": "estado",
            "text": "$A * B * C$: no",
            "color": "granada"
          }
        ]
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.5,
          0
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [],
  "steps": [],
  "note": "Arrastra A y C para mover la recta; desliza B por ella.",
  "translations": {
    "eu": {
      "title": "Artean egotea",
      "note": "Arrastatu A eta C zuzena mugitzeko; irristatu B zuzenean zehar.",
      "labels": {
        "tB": "B-ren posizioa zuzenean",
        "haloB": "Marka: B ez dago A eta C puntuen artean"
      },
      "blocks": {
        "estadoSi": {
          "estado": {
            "text": "$A * B * C$: bai"
          }
        },
        "estadoNo": {
          "estado": {
            "text": "$A * B * C$: ez"
          }
        }
      },
      "ariaLabels": {
        "pA": "A puntua",
        "pC": "C puntua",
        "pB": "B puntua",
        "lineAC": "ℓ zuzen euskarria",
        "tB": "B-ren posizioa zuzenean",
        "haloB": "B ez dago A eta C puntuen artean",
        "estadoSi": "A * B * C egoera",
        "estadoNo": "A * B * C egoera"
      }
    },
    "en": {
      "title": "Betweenness",
      "note": "Drag A and C to move the line; slide B along it.",
      "labels": {
        "tB": "Position of B on the line",
        "haloB": "Mark: B does not lie between A and C"
      },
      "blocks": {
        "estadoSi": {
          "estado": {
            "text": "$A * B * C$: yes"
          }
        },
        "estadoNo": {
          "estado": {
            "text": "$A * B * C$: no"
          }
        }
      },
      "ariaLabels": {
        "pA": "Point A",
        "pC": "Point C",
        "pB": "Point B",
        "lineAC": "Supporting line ℓ",
        "tB": "Position of B on the line",
        "haloB": "B does not lie between A and C",
        "estadoSi": "State of A * B * C",
        "estadoNo": "State of A * B * C"
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const EstarEntre = () => <DiagramRenderer spec={EstarEntreSpec} />;
