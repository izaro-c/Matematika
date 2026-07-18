import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const ParalelasSpec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Recta paralela por un punto exterior",
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
  "points": [
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
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -3,
      "y": -1.5,
      "showLabel": true,
      "fixed": false,
      "constraint": "free",
      "snapToGrid": true,
      "snapSize": 0.25
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
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 2.5,
      "y": -0.5,
      "showLabel": true,
      "fixed": false,
      "constraint": "free",
      "snapToGrid": true,
      "snapSize": 0.25
    },
    {
      "id": "P",
      "label": "P",
      "color": "pizarra",
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
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -3.25,
      "y": 2,
      "showLabel": true,
      "fixed": false,
      "constraint": "free",
      "snapToGrid": true,
      "snapSize": 0.25
    },
    {
      "id": "pA",
      "label": "A",
      "color": "terracota",
      "layerId": "geometry",
      "order": 2490,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto A",
        "role": "primary"
      },
      "target": false,
      "targetId": "pA",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 2.1044117109764917,
      "y": 3.6063235132929483,
      "showLabel": true,
      "fixed": false,
      "constraint": "constrained",
      "constraintIds": [
        "constraint1",
        "constraint2"
      ]
    }
  ],
  "elements": [
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
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "line",
      "refs": [
        "A",
        "B"
      ]
    },
    {
      "id": "parallel",
      "label": "Recta m paralela a l",
      "color": "pizarra",
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
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "parallel",
      "refs": [
        "A",
        "B",
        "P"
      ],
      "dashed": true
    },
    {
      "id": "parallelMarkAB",
      "label": "Marca de paralelismo",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1490,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de paralelismo",
        "role": "secondary"
      },
      "target": false,
      "targetId": "parallelMarkAB",
      "style": {
        "strokeWidth": 2,
        "markHeight": 0.42,
        "highlightStrokeWidth": 3,
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
      "id": "segAB",
      "label": "Segmento",
      "color": "carbon",
      "layerId": "geometry",
      "order": 3490,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": false,
      "targetId": "segAB",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "A",
        "B"
      ]
    },
    {
      "id": "segPA",
      "label": "Segmento",
      "color": "carbon",
      "layerId": "geometry",
      "order": 4490,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": false,
      "targetId": "segPA",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "P",
        "pA"
      ]
    },
    {
      "id": "parallelMarkPA",
      "label": "Marca de paralelismo",
      "color": "terracota",
      "layerId": "geometry",
      "order": 5490,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de paralelismo",
        "role": "secondary"
      },
      "target": false,
      "targetId": "parallelMarkPA",
      "style": {
        "strokeWidth": 2,
        "markHeight": 0.42,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "parallelMark",
      "refs": [
        "P",
        "pA"
      ],
      "properties": {
        "markCount": 1
      }
    }
  ],
  "sliders": [],
  "steps": [],
  "constraints": [
    {
      "id": "constraint1",
      "label": "Misma longitud que otro segmento",
      "kind": "equalLength",
      "refs": [
        "pA",
        "P",
        "segAB"
      ],
      "enabled": true
    },
    {
      "id": "constraint2",
      "label": "Sobre un objeto",
      "kind": "on",
      "refs": [
        "pA",
        "parallel"
      ],
      "enabled": true
    }
  ],
  "dependencies": [
    {
      "sourceId": "A",
      "targetId": "parallelMarkAB",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "parallelMarkAB",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "segAB",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "segAB",
      "relation": "construction"
    },
    {
      "sourceId": "P",
      "targetId": "segPA",
      "relation": "construction"
    },
    {
      "sourceId": "pA",
      "targetId": "segPA",
      "relation": "construction"
    },
    {
      "sourceId": "P",
      "targetId": "pA",
      "relation": "constraint",
      "constraintId": "constraint1"
    },
    {
      "sourceId": "segAB",
      "targetId": "pA",
      "relation": "constraint",
      "constraintId": "constraint1"
    },
    {
      "sourceId": "P",
      "targetId": "parallelMarkPA",
      "relation": "construction"
    },
    {
      "sourceId": "pA",
      "targetId": "parallelMarkPA",
      "relation": "construction"
    },
    {
      "sourceId": "parallel",
      "targetId": "pA",
      "relation": "constraint",
      "constraintId": "constraint2"
    }
  ],
  "note": "Mueve A y B para cambiar la dirección; mueve P para elegir por dónde pasa la paralela",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const Paralelas = () => <DiagramRenderer spec={ParalelasSpec} />;
