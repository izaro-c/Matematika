import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const ParalelasSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Rectas paralelas por un punto exterior",
  "componentId": "paralelas",
  "category": "Definiciones",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "viewport": {
    "bounds": [
      -5.5,
      4.5,
      5.5,
      -4
    ],
    "home": [
      -5.5,
      4.5,
      5.5,
      -4
    ],
    "minZoom": 0.55,
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
      "label": "Lecturas y controles",
      "order": 1,
      "visible": true,
      "locked": false
    }
  ],
  "groups": [
    {
      "id": "gParallel",
      "label": "Par de rectas paralelas",
      "memberIds": [
        "base",
        "parallel"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Par de rectas paralelas",
        "role": "primary"
      },
      "target": true,
      "targetId": "paralelas",
      "color": "musgo"
    }
  ],
  "objects": [
    {
      "id": "A",
      "label": "A",
      "color": "musgo",
      "layerId": "geometry",
      "order": 450,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto A",
        "role": "primary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3,
        "y": -1.6
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
        "snapToGrid": true,
        "snapSize": 0.25
      }
    },
    {
      "id": "B",
      "label": "B",
      "color": "musgo",
      "layerId": "geometry",
      "order": 460,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto B",
        "role": "primary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.5,
        "y": -0.5
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
        "snapToGrid": true,
        "snapSize": 0.25
      }
    },
    {
      "id": "P",
      "label": "P",
      "color": "mora",
      "layerId": "geometry",
      "order": 470,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto P",
        "role": "primary"
      },
      "target": true,
      "targetId": "punto-p",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -0.5,
        "y": 2.2
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
        "snapToGrid": true,
        "snapSize": 0.25
      }
    },
    {
      "id": "base",
      "label": "Recta l",
      "color": "musgo",
      "layerId": "geometry",
      "order": 480,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gParallel"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta l",
        "role": "secondary"
      },
      "target": true,
      "targetId": "recta-base",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "through-points",
          "points": [
            "A",
            "B"
          ]
        }
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "parallel",
      "label": "Recta m paralela a l",
      "color": "musgo",
      "layerId": "geometry",
      "order": 490,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gParallel"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta m paralela a l",
        "role": "secondary"
      },
      "target": true,
      "targetId": "recta-paralela",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "parallel",
          "linePoints": [
            "A",
            "B"
          ],
          "through": "P"
        }
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "parallelInfo",
      "label": "Invariante",
      "color": "musgo",
      "layerId": "annotations",
      "order": 500,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Invariante",
        "role": "annotation"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "l ∥ m: comparten dirección y no comparten puntos.",
        "title": "Invariante"
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.98,
          0.03
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [],
  "steps": [],
  "note": "Mueve A y B para cambiar la dirección común; mueve P para elegir por dónde pasa la paralela.",
  "translations": {
    "eu": {
      "title": "Zuzen paraleloak kanpoko puntu batetik",
      "note": "Mugitu A eta B norabide komuna aldatzeko; mugitu P paraleloa nondik pasatzen den aukeratzeko.",
      "titles": {
        "parallelInfo": "Aldaezina"
      },
      "texts": {
        "parallelInfo": "l ∥ m: norabide bera dute eta ez dute punturik partekatzen."
      },
      "ariaLabels": {
        "A": "Mugitu A puntua",
        "B": "Mugitu B puntua",
        "P": "Mugitu P puntua",
        "base": "l zuzena",
        "parallel": "l-ren paraleloa den m zuzena",
        "parallelInfo": "Aldaezina"
      }
    },
    "en": {
      "title": "Parallel Lines Through an External Point",
      "note": "Move A and B to change the shared direction; move P to choose where the parallel passes.",
      "titles": {
        "parallelInfo": "Invariant"
      },
      "texts": {
        "parallelInfo": "l ∥ m: they share a direction and share no points."
      },
      "ariaLabels": {
        "A": "Move point A",
        "B": "Move point B",
        "P": "Move point P",
        "base": "Line l",
        "parallel": "Line m parallel to l",
        "parallelInfo": "Invariant"
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const Paralelas = () => <DiagramRenderer spec={ParalelasSpec} />;
