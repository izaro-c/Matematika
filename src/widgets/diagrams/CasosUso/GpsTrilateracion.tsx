import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const GpsTrilateracionSpec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Trilateración en el plano",
  "componentId": "gps-trilateracion",
  "category": "Casos de uso",
  "mode": "simulation",
  "axis": true,
  "grid": false,
  "viewport": {
    "bounds": [
      -10,
      12,
      10,
      -5
    ],
    "home": [
      -6,
      5,
      6,
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
      "id": "group1",
      "label": "triangulo recto",
      "memberIds": [
        "S1",
        "H1",
        "catH1",
        "catV1",
        "rad1"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": true,
      "targetId": "trianguloRecto"
    }
  ],
  "points": [
    {
      "id": "S1",
      "label": "S₁",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 2720,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto fijo S₁",
        "role": "secondary"
      },
      "target": true,
      "targetId": "s1",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 2,
      "y": 8,
      "showLabel": true,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "S2",
      "label": "S₂",
      "color": "ocre",
      "layerId": "geometry",
      "order": 2730,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto fijo S₂",
        "role": "secondary"
      },
      "target": true,
      "targetId": "s2",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -4,
      "y": 2,
      "showLabel": true,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "S3",
      "label": "S₃",
      "color": "pavo",
      "layerId": "geometry",
      "order": 2740,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto fijo S₃",
        "role": "secondary"
      },
      "target": true,
      "targetId": "s3",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 6,
      "y": -2,
      "showLabel": true,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "R",
      "label": "R",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 2750,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto R",
        "role": "primary"
      },
      "target": true,
      "targetId": "R",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 0.2,
      "y": -0.2,
      "showLabel": true,
      "fixed": false,
      "constraint": "free",
      "snapToGrid": true,
      "snapSize": 0.25
    },
    {
      "id": "H1",
      "label": "H₁",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 2760,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto construido H₁",
        "role": "construction"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 0.2,
      "y": 2.7,
      "showLabel": true,
      "fixed": true,
      "constraint": "derived",
      "dependencies": [
        "R",
        "S1"
      ],
      "xExpression": "R.x",
      "yExpression": "S1.y"
    }
  ],
  "elements": [
    {
      "id": "circ1",
      "label": "Circunferencia de señal S₁",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 2770,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Circunferencia de señal S₁",
        "role": "secondary"
      },
      "target": true,
      "targetId": "circ1",
      "style": {
        "strokeWidth": 2.4,
        "fillOpacity": 0.02,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "circle",
      "refs": [
        "S1",
        "R"
      ]
    },
    {
      "id": "circ2",
      "label": "Circunferencia de señal S₂",
      "color": "ocre",
      "layerId": "geometry",
      "order": 2780,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Circunferencia de señal S₂",
        "role": "secondary"
      },
      "target": true,
      "targetId": "circ2",
      "style": {
        "strokeWidth": 2.4,
        "fillOpacity": 0,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "circle",
      "refs": [
        "S2",
        "R"
      ],
      "dashed": true
    },
    {
      "id": "circ3",
      "label": "Circunferencia de señal S₃",
      "color": "pavo",
      "layerId": "geometry",
      "order": 2790,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Circunferencia de señal S₃",
        "role": "secondary"
      },
      "target": true,
      "targetId": "circ3",
      "style": {
        "strokeWidth": 2.4,
        "fillOpacity": 0,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "circle",
      "refs": [
        "S3",
        "R"
      ],
      "dashed": true
    },
    {
      "id": "rad1",
      "label": "d₁",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 2800,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "d₁",
        "role": "secondary"
      },
      "target": true,
      "targetId": "rad1",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 4,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "S1",
        "R"
      ]
    },
    {
      "id": "rad2",
      "label": "d₂",
      "color": "ocre",
      "layerId": "geometry",
      "order": 2810,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "d₂",
        "role": "secondary"
      },
      "target": true,
      "targetId": "rad2",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "S2",
        "R"
      ]
    },
    {
      "id": "rad3",
      "label": "d₃",
      "color": "pavo",
      "layerId": "geometry",
      "order": 2820,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "d₃",
        "role": "secondary"
      },
      "target": true,
      "targetId": "rad3",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "S3",
        "R"
      ]
    },
    {
      "id": "catH1",
      "label": "Δx",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 2830,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Δx",
        "role": "secondary"
      },
      "target": true,
      "targetId": "catH1",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "S1",
        "H1"
      ],
      "dashed": true
    },
    {
      "id": "catV1",
      "label": "Δy",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 2840,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Δy",
        "role": "secondary"
      },
      "target": true,
      "targetId": "catV1",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "H1",
        "R"
      ],
      "dashed": true
    },
    {
      "id": "right1",
      "label": "Ángulo recto",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 2850,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo recto",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "fillOpacity": 0.22,
        "angleRadius": 0.45,
        "preserveColorOnHighlight": true
      },
      "kind": "rightAngle",
      "refs": [
        "S1",
        "H1",
        "R"
      ]
    }
  ],
  "sliders": [],
  "steps": [],
  "dependencies": [
    {
      "sourceId": "R",
      "targetId": "H1",
      "relation": "expression"
    },
    {
      "sourceId": "S1",
      "targetId": "H1",
      "relation": "expression"
    }
  ],
  "note": "Mueve R. Cada distancia define una circunferencia de posiciones posibles; las tres restricciones coinciden en el receptor.",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const GpsTrilateracion = () => <DiagramRenderer spec={GpsTrilateracionSpec} />;
