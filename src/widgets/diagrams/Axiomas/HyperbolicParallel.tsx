import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const HyperbolicParallelSpec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Paralelas de Lobachevski",
  "componentId": "HyperbolicParallel",
  "category": "Axiomas",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "showLabels": true,
  "viewport": {
    "bounds": [
      -1.18,
      1.18,
      1.18,
      -1.18
    ],
    "home": [
      -1.18,
      1.18,
      1.18,
      -1.18
    ],
    "minZoom": 0.85,
    "maxZoom": 5,
    "padding": 0.08
  },
  "layers": [
    {
      "id": "construccion",
      "label": "Construcción",
      "order": 3,
      "visible": true,
      "locked": false
    },
    {
      "id": "disco",
      "label": "Disco de Poincaré",
      "order": 0,
      "visible": true,
      "locked": false
    },
    {
      "id": "geodesicas",
      "label": "Rectas hiperbólicas",
      "order": 1,
      "visible": true,
      "locked": false
    },
    {
      "id": "puntos",
      "label": "Puntos",
      "order": 2,
      "visible": true,
      "locked": false
    },
    {
      "id": "anotaciones",
      "label": "Anotaciones",
      "order": 4,
      "visible": true,
      "locked": false
    }
  ],
  "groups": [],
  "points": [
    {
      "id": "O",
      "label": "centro del disco",
      "color": "pizarra",
      "layerId": "construccion",
      "order": 1,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "ariaLabel": "Centro del disco de Poincaré",
        "role": "construction"
      },
      "target": false,
      "x": 0,
      "y": 0,
      "showLabel": false,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "R",
      "label": "radio del disco",
      "color": "pizarra",
      "layerId": "construccion",
      "order": 2,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "ariaLabel": "Punto que determina el radio del disco",
        "role": "construction"
      },
      "target": false,
      "x": 1,
      "y": 0,
      "showLabel": false,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "L1",
      "label": "extremo ideal izquierdo de l",
      "color": "pavo",
      "layerId": "construccion",
      "order": 1004,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Extremo ideal izquierdo de la recta l",
        "role": "construction"
      },
      "target": false,
      "style": {
        "preserveColorOnHighlight": true
      },
      "x": -1,
      "y": 0,
      "showLabel": false,
      "fixed": false,
      "constraint": "glider",
      "gliderTarget": "frontera"
    },
    {
      "id": "L2",
      "label": "extremo ideal derecho de l",
      "color": "pavo",
      "layerId": "construccion",
      "order": 2004,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Extremo ideal derecho de la recta l",
        "role": "construction"
      },
      "target": false,
      "style": {
        "preserveColorOnHighlight": true
      },
      "x": 1,
      "y": 0,
      "showLabel": false,
      "fixed": false,
      "constraint": "glider",
      "gliderTarget": "frontera"
    },
    {
      "id": "pP",
      "label": "P",
      "color": "terracota",
      "layerId": "puntos",
      "order": 20,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Punto exterior P, arrastrable dentro del semidisco superior",
        "role": "primary"
      },
      "target": true,
      "targetId": "pP",
      "style": {
        "pointSize": 6,
        "labelSize": 18,
        "highlightPointSize": 9,
        "preserveColorOnHighlight": true
      },
      "x": 0,
      "y": 0.48,
      "showLabel": true,
      "fixed": false,
      "constraint": "constrained",
      "constraintIds": [
        "pMismoSemiplano",
        "pDentroDisco"
      ]
    }
  ],
  "elements": [
    {
      "id": "frontera",
      "label": "borde ideal del disco",
      "color": "pizarra",
      "layerId": "disco",
      "order": 1,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Borde ideal, excluido del plano hiperbólico",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.2,
        "strokeOpacity": 0.72,
        "fillOpacity": 0.04,
        "preserveColorOnHighlight": true
      },
      "kind": "circle",
      "refs": [
        "O",
        "R"
      ],
      "dashed": true
    },
    {
      "id": "lineL",
      "label": "recta hiperbólica l",
      "color": "pavo",
      "layerId": "geodesicas",
      "order": 10,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Recta hiperbólica l",
        "role": "primary"
      },
      "target": false,
      "style": {
        "strokeWidth": 3.2,
        "highlightStrokeWidth": 5,
        "preserveColorOnHighlight": true
      },
      "kind": "poincareGeodesic",
      "refs": [
        "O",
        "R",
        "L1",
        "L2"
      ]
    },
    {
      "id": "lineM",
      "label": "paralela límite m por P",
      "color": "terracota",
      "layerId": "geodesicas",
      "order": 11,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Primera paralela límite m que pasa por P",
        "role": "primary"
      },
      "target": true,
      "targetId": "lineM",
      "style": {
        "strokeWidth": 2.8,
        "highlightStrokeWidth": 4.8,
        "preserveColorOnHighlight": true
      },
      "kind": "poincareGeodesic",
      "refs": [
        "O",
        "R",
        "L1",
        "pP"
      ]
    },
    {
      "id": "lineN",
      "label": "paralela límite n por P",
      "color": "carbon",
      "layerId": "geodesicas",
      "order": 12,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Segunda paralela límite n que pasa por P",
        "role": "primary"
      },
      "target": true,
      "targetId": "lineN",
      "style": {
        "strokeWidth": 2.8,
        "highlightStrokeWidth": 4.8,
        "preserveColorOnHighlight": true
      },
      "kind": "poincareGeodesic",
      "refs": [
        "O",
        "R",
        "L2",
        "pP"
      ]
    },
    {
      "id": "labelL",
      "label": "etiqueta l",
      "color": "pavo",
      "layerId": "anotaciones",
      "order": 30,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": false,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Etiqueta l",
        "role": "annotation"
      },
      "target": false,
      "style": {
        "textOffset": [
          0.02,
          -0.1
        ],
        "labelSize": 16,
        "preserveColorOnHighlight": true
      },
      "kind": "label",
      "refs": [
        "lineL"
      ],
      "text": "$l$",
      "properties": {
        "anchorMode": "reference",
        "anchorParameter": 0.4
      }
    },
    {
      "id": "labelM",
      "label": "etiqueta m",
      "color": "terracota",
      "layerId": "anotaciones",
      "order": 31,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": false,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Etiqueta m",
        "role": "annotation"
      },
      "target": false,
      "style": {
        "textOffset": [
          -0.1,
          0.05
        ],
        "labelSize": 16,
        "preserveColorOnHighlight": true
      },
      "kind": "label",
      "refs": [
        "lineM"
      ],
      "text": "$m$",
      "properties": {
        "anchorMode": "reference",
        "anchorParameter": 0.58
      }
    },
    {
      "id": "labelN",
      "label": "etiqueta n",
      "color": "carbon",
      "layerId": "anotaciones",
      "order": 32,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": false,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Etiqueta n",
        "role": "annotation"
      },
      "target": false,
      "style": {
        "textOffset": [
          0.1,
          0.05
        ],
        "labelSize": 16,
        "preserveColorOnHighlight": true
      },
      "kind": "label",
      "refs": [
        "lineN"
      ],
      "text": "$n$",
      "properties": {
        "anchorMode": "reference",
        "anchorParameter": 0.42
      }
    }
  ],
  "sliders": [],
  "steps": [],
  "constraints": [
    {
      "id": "pMismoSemiplano",
      "label": "P permanece exterior a l",
      "kind": "sameSide",
      "refs": [
        "pP",
        "L1",
        "L2"
      ],
      "enabled": true
    },
    {
      "id": "pDentroDisco",
      "label": "P permanece dentro del disco abierto",
      "kind": "insideDisk",
      "refs": [
        "pP",
        "O",
        "R"
      ],
      "enabled": true
    }
  ],
  "dependencies": [
    {
      "sourceId": "L1",
      "targetId": "pP",
      "relation": "constraint",
      "constraintId": "pMismoSemiplano"
    },
    {
      "sourceId": "L2",
      "targetId": "pP",
      "relation": "constraint",
      "constraintId": "pMismoSemiplano"
    },
    {
      "sourceId": "O",
      "targetId": "pP",
      "relation": "constraint",
      "constraintId": "pDentroDisco"
    },
    {
      "sourceId": "R",
      "targetId": "pP",
      "relation": "constraint",
      "constraintId": "pDentroDisco"
    },
    {
      "sourceId": "O",
      "targetId": "frontera",
      "relation": "construction"
    },
    {
      "sourceId": "R",
      "targetId": "frontera",
      "relation": "construction"
    },
    {
      "sourceId": "O",
      "targetId": "lineL",
      "relation": "construction"
    },
    {
      "sourceId": "R",
      "targetId": "lineL",
      "relation": "construction"
    },
    {
      "sourceId": "L1",
      "targetId": "lineL",
      "relation": "construction"
    },
    {
      "sourceId": "L2",
      "targetId": "lineL",
      "relation": "construction"
    },
    {
      "sourceId": "O",
      "targetId": "lineM",
      "relation": "construction"
    },
    {
      "sourceId": "R",
      "targetId": "lineM",
      "relation": "construction"
    },
    {
      "sourceId": "L1",
      "targetId": "lineM",
      "relation": "construction"
    },
    {
      "sourceId": "pP",
      "targetId": "lineM",
      "relation": "construction"
    },
    {
      "sourceId": "O",
      "targetId": "lineN",
      "relation": "construction"
    },
    {
      "sourceId": "R",
      "targetId": "lineN",
      "relation": "construction"
    },
    {
      "sourceId": "L2",
      "targetId": "lineN",
      "relation": "construction"
    },
    {
      "sourceId": "pP",
      "targetId": "lineN",
      "relation": "construction"
    },
    {
      "sourceId": "lineL",
      "targetId": "labelL",
      "relation": "construction"
    },
    {
      "sourceId": "lineM",
      "targetId": "labelM",
      "relation": "construction"
    },
    {
      "sourceId": "lineN",
      "targetId": "labelN",
      "relation": "construction"
    }
  ],
  "note": "Arrastre P: en cada posición exterior a l, las rectas m y n pasan por P sin cortar a l dentro del disco. El borde representa puntos ideales y no pertenece al plano.",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const HyperbolicParallel = () => <DiagramRenderer spec={HyperbolicParallelSpec} />;
