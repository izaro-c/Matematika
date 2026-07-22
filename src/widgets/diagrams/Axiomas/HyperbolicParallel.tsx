import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const HyperbolicParallelSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
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
  "objects": [
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0,
        "y": 0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "labelVisible": false
      },
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 1,
        "y": 0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "labelVisible": false
      },
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -1,
        "y": 0
      },
      "mobility": {
        "type": "on-support",
        "support": "frontera"
      },
      "appearance": {
        "labelVisible": false,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 1,
        "y": 0
      },
      "mobility": {
        "type": "on-support",
        "support": "frontera"
      },
      "appearance": {
        "labelVisible": false,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0,
        "y": 0.48
      },
      "mobility": {
        "type": "constrained",
        "relationIds": [
          "pMismoSemiplano",
          "pDentroDisco"
        ]
      },
      "appearance": {
        "size": 6,
        "labelVisible": true,
        "labelSize": 18,
        "highlightSize": 9,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
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
      "objectType": "path",
      "geometry": {
        "type": "circle",
        "center": "O",
        "point": "R"
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2.2,
        "strokeOpacity": 0.72,
        "fillOpacity": 0.04,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "poincare-geodesic",
        "refs": [
          "O",
          "R",
          "L1",
          "L2"
        ]
      },
      "appearance": {
        "strokeWidth": 3.2,
        "highlightStrokeWidth": 5,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "poincare-geodesic",
        "refs": [
          "O",
          "R",
          "L1",
          "pP"
        ]
      },
      "appearance": {
        "strokeWidth": 2.8,
        "highlightStrokeWidth": 4.8,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "poincare-geodesic",
        "refs": [
          "O",
          "R",
          "L2",
          "pP"
        ]
      },
      "appearance": {
        "strokeWidth": 2.8,
        "highlightStrokeWidth": 4.8,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "annotation",
      "variant": "label",
      "content": {
        "text": "$l$"
      },
      "anchor": {
        "type": "object",
        "object": "lineL",
        "parameter": 0.4,
        "offset": [
          0.02,
          -0.1
        ]
      },
      "appearance": {
        "fontSize": 16,
        "preserveColorOnHighlight": true
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
      "objectType": "annotation",
      "variant": "label",
      "content": {
        "text": "$m$"
      },
      "anchor": {
        "type": "object",
        "object": "lineM",
        "parameter": 0.58,
        "offset": [
          -0.1,
          0.05
        ]
      },
      "appearance": {
        "fontSize": 16,
        "preserveColorOnHighlight": true
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
      "objectType": "annotation",
      "variant": "label",
      "content": {
        "text": "$n$"
      },
      "anchor": {
        "type": "object",
        "object": "lineN",
        "parameter": 0.42,
        "offset": [
          0.1,
          0.05
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
      "id": "pMismoSemiplano",
      "label": "P permanece exterior a l",
      "enabled": true,
      "type": "same-half-plane",
      "points": [
        "pP",
        "L1"
      ],
      "boundary": "L2"
    },
    {
      "id": "pDentroDisco",
      "label": "P permanece dentro del disco abierto",
      "enabled": true,
      "type": "inside-disk",
      "point": "pP",
      "disk": {
        "center": "O",
        "boundary": "R"
      }
    }
  ],
  "steps": [],
  "note": "Arrastre P: en cada posición exterior a l, las rectas m y n pasan por P sin cortar a l dentro del disco. El borde representa puntos ideales y no pertenece al plano."
}
);
/* @matematika-diagram-spec:end */

export const HyperbolicParallel = () => <DiagramRenderer spec={HyperbolicParallelSpec} />;
