import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const InterseccionSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Intersección de configuraciones geométricas",
  "componentId": "interseccion",
  "category": "Definiciones",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "viewport": {
    "bounds": [
      -5,
      4.5,
      5,
      -4.5
    ],
    "home": [
      -5,
      4.5,
      5,
      -4.5
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
      "label": "Anotaciones",
      "order": 1,
      "visible": true,
      "locked": false
    }
  ],
  "groups": [
    {
      "id": "gL1",
      "label": "Recta ℓ₁",
      "memberIds": [
        "pA1",
        "pA2",
        "lineL1"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Conjunto de puntos de la recta ℓ₁",
        "role": "primary"
      },
      "target": true,
      "targetId": "recta-l1",
      "color": "terracota"
    },
    {
      "id": "gL2",
      "label": "Recta ℓ₂",
      "memberIds": [
        "pB1",
        "pB2",
        "lineL2"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Conjunto de puntos de la recta ℓ₂",
        "role": "primary"
      },
      "target": true,
      "targetId": "recta-l2",
      "color": "pavo"
    }
  ],
  "objects": [
    {
      "id": "pA1",
      "label": "A₁",
      "color": "terracota",
      "layerId": "geometry",
      "order": 10,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gL1"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto A₁ de la recta ℓ₁",
        "role": "primary"
      },
      "target": true,
      "targetId": "pA1",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3,
        "y": -1.8
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true,
        "highlightSize": 9,
        "preserveColorOnHighlight": true
      },
      "interaction": {
        "snapToGrid": false
      }
    },
    {
      "id": "pA2",
      "label": "A₂",
      "color": "terracota",
      "layerId": "geometry",
      "order": 11,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gL1"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto A₂ de la recta ℓ₁",
        "role": "primary"
      },
      "target": true,
      "targetId": "pA2",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 3,
        "y": 1.8
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true,
        "highlightSize": 9,
        "preserveColorOnHighlight": true
      },
      "interaction": {
        "snapToGrid": false
      }
    },
    {
      "id": "lineL1",
      "label": "ℓ₁",
      "color": "terracota",
      "layerId": "geometry",
      "order": 20,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gL1"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta ℓ₁",
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
            "pA1",
            "pA2"
          ]
        }
      },
      "appearance": {
        "strokeWidth": 2.5,
        "highlightStrokeWidth": 3.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pB1",
      "label": "B₁",
      "color": "pavo",
      "layerId": "geometry",
      "order": 12,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gL2"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto B₁ de la recta ℓ₂",
        "role": "primary"
      },
      "target": true,
      "targetId": "pB1",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2,
        "y": 2.2
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true,
        "highlightSize": 9,
        "preserveColorOnHighlight": true
      },
      "interaction": {
        "snapToGrid": false
      }
    },
    {
      "id": "pB2",
      "label": "B₂",
      "color": "pavo",
      "layerId": "geometry",
      "order": 13,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gL2"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto B₂ de la recta ℓ₂",
        "role": "primary"
      },
      "target": true,
      "targetId": "pB2",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2,
        "y": -2.2
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true,
        "highlightSize": 9,
        "preserveColorOnHighlight": true
      },
      "interaction": {
        "snapToGrid": false
      }
    },
    {
      "id": "lineL2",
      "label": "ℓ₂",
      "color": "pavo",
      "layerId": "geometry",
      "order": 21,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gL2"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta ℓ₂",
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
            "pB1",
            "pB2"
          ]
        }
      },
      "appearance": {
        "strokeWidth": 2.5,
        "highlightStrokeWidth": 3.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pP",
      "label": "P",
      "color": "mora",
      "layerId": "geometry",
      "order": 30,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto común de intersección P = ℓ₁ ∩ ℓ₂",
        "role": "primary"
      },
      "target": true,
      "targetId": "pInter",
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
      },
      "interaction": {
        "snapToGrid": false
      }
    }
  ],
  "relations": [],
  "steps": [],
  "note": "Mueve los puntos generadores para modificar las rectas y observar cómo el punto común P = ℓ₁ ∩ ℓ₂ satisface la pertenencia simultánea a ambos conjuntos.",
  "translations": {
    "eu": {
      "title": "Konfigurazio geometrikoen ebakidura",
      "note": "Mugitu puntu sortzaileak zuzenak aldatzeko eta P = ℓ₁ ∩ ℓ₂ puntu komuna bi multzoetakoa aldi berean dela ikusteko.",
      "ariaLabels": {
        "pA1": "Mugitu ℓ₁ zuzeneko A₁ puntua",
        "pA2": "Mugitu ℓ₁ zuzeneko A₂ puntua",
        "lineL1": "ℓ₁ zuzena",
        "pB1": "Mugitu ℓ₂ zuzeneko B₁ puntua",
        "pB2": "Mugitu ℓ₂ zuzeneko B₂ puntua",
        "lineL2": "ℓ₂ zuzena",
        "pP": "P = ℓ₁ ∩ ℓ₂ ebakidura-puntu komuna",
        "gL1": "ℓ₁ zuzeneko puntuen multzoa",
        "gL2": "ℓ₂ zuzeneko puntuen multzoa"
      }
    },
    "en": {
      "title": "Intersection of geometric configurations",
      "note": "Move the generator points to modify the lines and observe how the intersection point P = ℓ₁ ∩ ℓ₂ simultaneously belongs to both sets.",
      "ariaLabels": {
        "pA1": "Move point A₁ on line ℓ₁",
        "pA2": "Move point A₂ on line ℓ₁",
        "lineL1": "Line ℓ₁",
        "pB1": "Move point B₁ on line ℓ₂",
        "pB2": "Move point B₂ on line ℓ₂",
        "lineL2": "Line ℓ₂",
        "pP": "Common intersection point P = ℓ₁ ∩ ℓ₂",
        "gL1": "Set of points on line ℓ₁",
        "gL2": "Set of points on line ℓ₂"
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const Interseccion = () => <DiagramRenderer spec={InterseccionSpec} />;
