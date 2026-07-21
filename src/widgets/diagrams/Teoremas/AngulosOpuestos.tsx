import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const AngulosOpuestosSpec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Ángulos opuestos por el vértice",
  "componentId": "angulos-opuestos",
  "category": "Teoremas",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "viewport": {
    "bounds": [
      -5,
      5,
      5,
      -5
    ],
    "home": [
      -5,
      5,
      5,
      -5
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
      "id": "gAlpha",
      "label": "Ángulos α y α′",
      "memberIds": [
        "angle1",
        "angle3"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulos α y α′",
        "role": "primary"
      },
      "target": true,
      "targetId": "alpha",
      "color": "terracota"
    },
    {
      "id": "gBeta",
      "label": "Ángulos β y β′",
      "memberIds": [
        "angle2",
        "angle4"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulos β y β′",
        "role": "primary"
      },
      "target": true,
      "targetId": "beta",
      "color": "pizarra"
    },
    {
      "id": "gSupp12",
      "label": "Primer par suplementario",
      "memberIds": [
        "angle1",
        "angle2"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Primer par suplementario",
        "role": "primary"
      },
      "target": true,
      "targetId": "supp12",
      "color": "terracota"
    },
    {
      "id": "gSupp23",
      "label": "Segundo par suplementario",
      "memberIds": [
        "angle2",
        "angle3"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Segundo par suplementario",
        "role": "primary"
      },
      "target": true,
      "targetId": "supp23",
      "color": "pizarra"
    },
    {
      "id": "gCongruence13",
      "label": "Resta del ángulo común",
      "memberIds": [
        "angle1",
        "angle2",
        "angle3"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Resta del ángulo común",
        "role": "primary"
      },
      "target": true,
      "targetId": "congruence13",
      "color": "terracota"
    }
  ],
  "points": [
    {
      "id": "O",
      "label": "O",
      "color": "carbon",
      "layerId": "geometry",
      "order": 6000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto fijo O",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 0,
      "y": 0,
      "showLabel": true,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "A",
      "label": "A",
      "color": "terracota",
      "layerId": "geometry",
      "order": 2000,
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
      "x": 3.2,
      "y": 1.4,
      "showLabel": true,
      "fixed": false,
      "constraint": "free",
      "snapToGrid": true,
      "snapSize": 0.25
    },
    {
      "id": "B",
      "label": "B",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 4000,
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
      "x": -1.7,
      "y": 2.8,
      "showLabel": true,
      "fixed": false,
      "constraint": "free",
      "snapToGrid": true,
      "snapSize": 0.25
    },
    {
      "id": "Ap",
      "label": "A'",
      "color": "terracota",
      "layerId": "geometry",
      "order": 3000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto construido A'",
        "role": "construction"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -3.2,
      "y": -1.4,
      "showLabel": true,
      "fixed": true,
      "constraint": "derived",
      "dependencies": [
        "A"
      ],
      "xExpression": "-A.x",
      "yExpression": "-A.y"
    },
    {
      "id": "Bp",
      "label": "B'",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 5000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto construido B'",
        "role": "construction"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 1.7,
      "y": -2.8,
      "showLabel": true,
      "fixed": true,
      "constraint": "derived",
      "dependencies": [
        "B"
      ],
      "xExpression": "-B.x",
      "yExpression": "-B.y"
    }
  ],
  "elements": [
    {
      "id": "lineL",
      "label": "Recta l",
      "color": "carbon",
      "layerId": "geometry",
      "order": 950,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta l",
        "role": "secondary"
      },
      "target": true,
      "targetId": "lineL",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "line",
      "refs": [
        "A",
        "Ap"
      ]
    },
    {
      "id": "lineM",
      "label": "Recta m",
      "color": "carbon",
      "layerId": "geometry",
      "order": 960,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta m",
        "role": "secondary"
      },
      "target": true,
      "targetId": "lineM",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "line",
      "refs": [
        "B",
        "Bp"
      ]
    },
    {
      "id": "angle1",
      "label": "α",
      "color": "terracota",
      "layerId": "geometry",
      "order": 970,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gAlpha",
        "gSupp12",
        "gCongruence13"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "α",
        "role": "secondary"
      },
      "target": true,
      "targetId": "angle1",
      "style": {
        "fillOpacity": 0.28,
        "angleRadius": 0.75,
        "preserveColorOnHighlight": true
      },
      "kind": "nonReflexAngle",
      "refs": [
        "A",
        "O",
        "B"
      ]
    },
    {
      "id": "angle2",
      "label": "β",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 980,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gBeta",
        "gSupp12",
        "gSupp23",
        "gCongruence13"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "β",
        "role": "secondary"
      },
      "target": true,
      "targetId": "angle2",
      "style": {
        "fillOpacity": 0.2,
        "angleRadius": 0.58,
        "preserveColorOnHighlight": true
      },
      "kind": "nonReflexAngle",
      "refs": [
        "B",
        "O",
        "Ap"
      ]
    },
    {
      "id": "angle3",
      "label": "α'",
      "color": "terracota",
      "layerId": "geometry",
      "order": 990,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gAlpha",
        "gSupp23",
        "gCongruence13"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "α'",
        "role": "secondary"
      },
      "target": true,
      "targetId": "angle3",
      "style": {
        "fillOpacity": 0.28,
        "angleRadius": 0.75,
        "preserveColorOnHighlight": true
      },
      "kind": "nonReflexAngle",
      "refs": [
        "Ap",
        "O",
        "Bp"
      ]
    },
    {
      "id": "angle4",
      "label": "β'",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 1000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gBeta"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "β'",
        "role": "secondary"
      },
      "target": true,
      "targetId": "angle4",
      "style": {
        "fillOpacity": 0.2,
        "angleRadius": 0.58,
        "preserveColorOnHighlight": true
      },
      "kind": "nonReflexAngle",
      "refs": [
        "Bp",
        "O",
        "A"
      ]
    }
  ],
  "sliders": [],
  "steps": [],
  "dependencies": [
    {
      "sourceId": "A",
      "targetId": "Ap",
      "relation": "expression"
    },
    {
      "sourceId": "B",
      "targetId": "Bp",
      "relation": "expression"
    }
  ],
  "note": "Mueve A o B para girar las rectas",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const AngulosOpuestos = () => <DiagramRenderer spec={AngulosOpuestosSpec} />;
