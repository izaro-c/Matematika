import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const Congruence4Spec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Axioma de Congruencia IV",
  "componentId": "axioma-de-congruencia-iv",
  "category": "Axiomas",
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
    "minZoom": 0.2,
    "maxZoom": 12,
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
      "id": "controls",
      "label": "Controles",
      "order": 1,
      "visible": true,
      "locked": false
    }
  ],
  "groups": [],
  "points": [
    {
      "id": "pA",
      "label": "A",
      "color": "ocre",
      "layerId": "geometry",
      "order": 13000,
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
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 1,
      "y": 1,
      "fixed": false,
      "constraint": "free"
    },
    {
      "id": "pB",
      "label": "B",
      "color": "ocre",
      "layerId": "geometry",
      "order": 12000,
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
      "style": {
        "pointSize": 7,
        "highlightPointSize": 11,
        "preserveColorOnHighlight": true
      },
      "x": 0.19,
      "y": 3.48,
      "fixed": false,
      "constraint": "free"
    },
    {
      "id": "pO",
      "label": "O",
      "color": "terracota",
      "layerId": "geometry",
      "order": 14000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto C",
        "role": "primary"
      },
      "target": true,
      "targetId": "pO",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -3,
      "y": 1,
      "fixed": false,
      "constraint": "free"
    },
    {
      "id": "pAA",
      "label": "A'",
      "color": "ocre",
      "layerId": "geometry",
      "order": 15000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto C",
        "role": "primary"
      },
      "target": true,
      "targetId": "pAA",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 3.1,
      "y": -2.43,
      "fixed": false,
      "constraint": "free"
    },
    {
      "id": "pBB",
      "label": "B'",
      "color": "pavo",
      "layerId": "geometry",
      "order": 16000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto C",
        "role": "primary"
      },
      "target": true,
      "targetId": "pBB",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 0.8024285065547914,
      "y": -0.5431469981193691,
      "fixed": false,
      "constraint": "constrained",
      "constraintIds": [
        "equalAnglenonReflexAngleAAOOBB"
      ]
    },
    {
      "id": "pOO",
      "label": "O'",
      "color": "terracota",
      "layerId": "geometry",
      "order": 5000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto C",
        "role": "primary"
      },
      "target": true,
      "targetId": "pOO",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -1.62,
      "y": -2.41,
      "fixed": false,
      "constraint": "free"
    }
  ],
  "elements": [
    {
      "id": "rayOB",
      "label": "Semirrecta",
      "color": "ocre",
      "layerId": "geometry",
      "order": 6000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "highlightable": false,
        "ariaLabel": "Semirrecta",
        "role": "secondary"
      },
      "target": true,
      "targetId": "rayOB",
      "style": {
        "preserveColorOnHighlight": true
      },
      "kind": "ray",
      "refs": [
        "pO",
        "pB"
      ]
    },
    {
      "id": "rayOA",
      "label": "Semirrecta",
      "color": "ocre",
      "layerId": "geometry",
      "order": 7000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "highlightable": false,
        "ariaLabel": "Semirrecta",
        "role": "secondary"
      },
      "target": true,
      "targetId": "rayOA",
      "kind": "ray",
      "refs": [
        "pO",
        "pA"
      ]
    },
    {
      "id": "rayOOBB",
      "label": "Semirrecta",
      "color": "pavo",
      "layerId": "geometry",
      "order": 8000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "highlightable": false,
        "ariaLabel": "Semirrecta",
        "role": "secondary"
      },
      "target": true,
      "targetId": "rayOOBB",
      "style": {
        "preserveColorOnHighlight": true
      },
      "kind": "ray",
      "refs": [
        "pOO",
        "pBB"
      ],
      "dashed": true
    },
    {
      "id": "rayOOAA",
      "label": "Semirrecta",
      "color": "ocre",
      "layerId": "geometry",
      "order": 9000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "highlightable": false,
        "ariaLabel": "Semirrecta",
        "role": "secondary"
      },
      "target": true,
      "targetId": "rayOOAA",
      "style": {
        "preserveColorOnHighlight": true
      },
      "kind": "ray",
      "refs": [
        "pOO",
        "pAA"
      ]
    },
    {
      "id": "nonReflexAngleAOB",
      "label": "$\\alpha$",
      "color": "terracota",
      "layerId": "geometry",
      "order": 10000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "nonReflexAngleAOB",
      "style": {
        "fillOpacity": 0.2,
        "angleRadius": 1,
        "highlightFillOpacity": 0.4,
        "preserveColorOnHighlight": true
      },
      "kind": "nonReflexAngle",
      "refs": [
        "pA",
        "pO",
        "pB"
      ]
    },
    {
      "id": "nonReflexAngleAAOOBB",
      "label": "$\\alpha '$",
      "color": "terracota",
      "layerId": "geometry",
      "order": 11000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "nonReflexAngleAAOOBB",
      "style": {
        "fillOpacity": 0.2,
        "angleRadius": 1,
        "highlightFillOpacity": 0.4,
        "preserveColorOnHighlight": true
      },
      "kind": "nonReflexAngle",
      "refs": [
        "pAA",
        "pOO",
        "pBB"
      ]
    }
  ],
  "sliders": [],
  "steps": [],
  "constraints": [
    {
      "id": "equalAnglenonReflexAngleAAOOBB",
      "label": "$\\alpha '$ tiene la misma amplitud que $\\alpha$",
      "kind": "equalAngle",
      "refs": [
        "pBB",
        "pOO",
        "pAA",
        "nonReflexAngleAOB",
        "nonReflexAngleAAOOBB"
      ],
      "enabled": true
    }
  ],
  "dependencies": [
    {
      "sourceId": "pO",
      "targetId": "rayOB",
      "relation": "construction"
    },
    {
      "sourceId": "pB",
      "targetId": "rayOB",
      "relation": "construction"
    },
    {
      "sourceId": "pO",
      "targetId": "rayOA",
      "relation": "construction"
    },
    {
      "sourceId": "pA",
      "targetId": "rayOA",
      "relation": "construction"
    },
    {
      "sourceId": "pOO",
      "targetId": "rayOOBB",
      "relation": "construction"
    },
    {
      "sourceId": "pBB",
      "targetId": "rayOOBB",
      "relation": "construction"
    },
    {
      "sourceId": "pOO",
      "targetId": "rayOOAA",
      "relation": "construction"
    },
    {
      "sourceId": "pAA",
      "targetId": "rayOOAA",
      "relation": "construction"
    },
    {
      "sourceId": "pA",
      "targetId": "nonReflexAngleAOB",
      "relation": "construction"
    },
    {
      "sourceId": "pO",
      "targetId": "nonReflexAngleAOB",
      "relation": "construction"
    },
    {
      "sourceId": "pB",
      "targetId": "nonReflexAngleAOB",
      "relation": "construction"
    },
    {
      "sourceId": "pAA",
      "targetId": "nonReflexAngleAAOOBB",
      "relation": "construction"
    },
    {
      "sourceId": "pOO",
      "targetId": "nonReflexAngleAAOOBB",
      "relation": "construction"
    },
    {
      "sourceId": "pBB",
      "targetId": "nonReflexAngleAAOOBB",
      "relation": "construction"
    },
    {
      "sourceId": "pOO",
      "targetId": "pBB",
      "relation": "constraint",
      "constraintId": "equalAnglenonReflexAngleAAOOBB"
    },
    {
      "sourceId": "pAA",
      "targetId": "pBB",
      "relation": "constraint",
      "constraintId": "equalAnglenonReflexAngleAAOOBB"
    },
    {
      "sourceId": "nonReflexAngleAOB",
      "targetId": "pBB",
      "relation": "constraint",
      "constraintId": "equalAnglenonReflexAngleAAOOBB"
    }
  ],
  "note": "Arrastra A, B, O, A' y O'",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const Congruence4 = () => <DiagramRenderer spec={Congruence4Spec} />;
