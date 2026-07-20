import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const DemoAreaRectanguloInconmensurableSpec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Área del rectángulo: caso inconmensurable",
  "componentId": "demo-area-rectangulo-inconmensurable",
  "category": "Demostraciones",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "viewport": {
    "bounds": [
      -4.5,
      4,
      4.5,
      -3.5
    ],
    "home": [
      -4.5,
      4,
      4.5,
      -3.5
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
  "groups": [],
  "points": [
    {
      "id": "A",
      "label": "A",
      "color": "granada",
      "layerId": "geometry",
      "order": 2560,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto fijo A",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -2.7,
      "y": -1.5,
      "showLabel": false,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "B",
      "label": "B",
      "color": "granada",
      "layerId": "geometry",
      "order": 2570,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto fijo B",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 2.7,
      "y": -1.5,
      "showLabel": false,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "C",
      "label": "C",
      "color": "granada",
      "layerId": "geometry",
      "order": 2580,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto fijo C",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 2.7,
      "y": 2,
      "showLabel": false,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "D",
      "label": "D",
      "color": "granada",
      "layerId": "geometry",
      "order": 2590,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto fijo D",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -2.7,
      "y": 2,
      "showLabel": false,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "Ai",
      "label": "Ai",
      "color": "musgo",
      "layerId": "geometry",
      "order": 2600,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto construido Ai",
        "role": "construction"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -2.3,
      "y": -1.1,
      "showLabel": true,
      "fixed": true,
      "constraint": "derived",
      "dependencies": [
        "A",
        "epsilon"
      ],
      "xExpression": "A.x + epsilon",
      "yExpression": "A.y + epsilon"
    },
    {
      "id": "Bi",
      "label": "Bi",
      "color": "musgo",
      "layerId": "geometry",
      "order": 2610,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto construido Bi",
        "role": "construction"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 2.3,
      "y": -1.1,
      "showLabel": true,
      "fixed": true,
      "constraint": "derived",
      "dependencies": [
        "B",
        "epsilon"
      ],
      "xExpression": "B.x - epsilon",
      "yExpression": "B.y + epsilon"
    },
    {
      "id": "Ci",
      "label": "Ci",
      "color": "musgo",
      "layerId": "geometry",
      "order": 2620,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto construido Ci",
        "role": "construction"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 2.3,
      "y": 1.6,
      "showLabel": true,
      "fixed": true,
      "constraint": "derived",
      "dependencies": [
        "C",
        "epsilon"
      ],
      "xExpression": "C.x - epsilon",
      "yExpression": "C.y - epsilon"
    },
    {
      "id": "Di",
      "label": "Di",
      "color": "musgo",
      "layerId": "geometry",
      "order": 2630,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto construido Di",
        "role": "construction"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -2.3,
      "y": 1.6,
      "showLabel": true,
      "fixed": true,
      "constraint": "derived",
      "dependencies": [
        "D",
        "epsilon"
      ],
      "xExpression": "D.x + epsilon",
      "yExpression": "D.y - epsilon"
    },
    {
      "id": "Ao",
      "label": "Ao",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 2640,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto construido Ao",
        "role": "construction"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -3.1,
      "y": -1.9,
      "showLabel": true,
      "fixed": true,
      "constraint": "derived",
      "dependencies": [
        "A",
        "epsilon"
      ],
      "xExpression": "A.x - epsilon",
      "yExpression": "A.y - epsilon"
    },
    {
      "id": "Bo",
      "label": "Bo",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 2650,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto construido Bo",
        "role": "construction"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 3.1,
      "y": -1.9,
      "showLabel": true,
      "fixed": true,
      "constraint": "derived",
      "dependencies": [
        "B",
        "epsilon"
      ],
      "xExpression": "B.x + epsilon",
      "yExpression": "B.y - epsilon"
    },
    {
      "id": "Co",
      "label": "Co",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 2660,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto construido Co",
        "role": "construction"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 3.1,
      "y": 2.4,
      "showLabel": true,
      "fixed": true,
      "constraint": "derived",
      "dependencies": [
        "C",
        "epsilon"
      ],
      "xExpression": "C.x + epsilon",
      "yExpression": "C.y + epsilon"
    },
    {
      "id": "Do",
      "label": "Do",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 2670,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto construido Do",
        "role": "construction"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -3.1,
      "y": 2.4,
      "showLabel": true,
      "fixed": true,
      "constraint": "derived",
      "dependencies": [
        "D",
        "epsilon"
      ],
      "xExpression": "D.x - epsilon",
      "yExpression": "D.y + epsilon"
    }
  ],
  "elements": [
    {
      "id": "outer",
      "label": "Rectángulo exterior Rₖ⁺",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 2680,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Rectángulo exterior Rₖ⁺",
        "role": "secondary"
      },
      "target": true,
      "targetId": "rectangulo-k-max",
      "style": {
        "strokeWidth": 2.4,
        "fillOpacity": 0.05,
        "highlightFillOpacity": 0.28,
        "preserveColorOnHighlight": true
      },
      "kind": "polygon",
      "refs": [
        "Ao",
        "Bo",
        "Co",
        "Do"
      ]
    },
    {
      "id": "rect",
      "label": "Rectángulo R",
      "color": "granada",
      "layerId": "geometry",
      "order": 2690,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Rectángulo R",
        "role": "secondary"
      },
      "target": true,
      "targetId": "rectangulo-r",
      "style": {
        "strokeWidth": 3,
        "fillOpacity": 0.12,
        "highlightFillOpacity": 0.28,
        "preserveColorOnHighlight": true
      },
      "kind": "polygon",
      "refs": [
        "A",
        "B",
        "C",
        "D"
      ]
    },
    {
      "id": "inner",
      "label": "Rectángulo interior Rₖ⁻",
      "color": "musgo",
      "layerId": "geometry",
      "order": 2700,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Rectángulo interior Rₖ⁻",
        "role": "secondary"
      },
      "target": true,
      "targetId": "rectangulo-k-min",
      "style": {
        "strokeWidth": 2.4,
        "fillOpacity": 0.14,
        "highlightFillOpacity": 0.28,
        "preserveColorOnHighlight": true
      },
      "kind": "polygon",
      "refs": [
        "Ai",
        "Bi",
        "Ci",
        "Di"
      ]
    },
    {
      "id": "squeezeInfo",
      "label": "Encaje arquimediano",
      "color": "granada",
      "layerId": "annotations",
      "order": 2710,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Encaje arquimediano",
        "role": "annotation"
      },
      "target": false,
      "style": {
        "preserveColorOnHighlight": true
      },
      "kind": "infoPanel",
      "refs": [],
      "text": "Rₖ⁻ ⊂ R ⊂ Rₖ⁺; al reducir ε, ambas áreas acotan la de R.",
      "properties": {
        "title": "Encaje arquimediano",
        "anchorMode": "viewport",
        "viewportPosition": [
          0.98,
          0.03
        ]
      }
    }
  ],
  "sliders": [
    {
      "id": "epsilon",
      "label": "ε",
      "color": "granada",
      "layerId": "annotations",
      "order": 2550,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ajustar ε",
        "role": "annotation"
      },
      "target": true,
      "targetId": "epsilon",
      "style": {
        "preserveColorOnHighlight": true
      },
      "x": -1.5,
      "y": -3.1,
      "min": 0.1,
      "max": 0.8,
      "value": 0.4,
      "step": 0.05
    }
  ],
  "steps": [
    {
      "id": "step2",
      "label": "Caso inconmensurable",
      "description": "Los rectángulos racionales interior y exterior encajan a R.",
      "visibleTargets": [
        "outer",
        "rect",
        "inner",
        "squeezeInfo"
      ],
      "durationMs": 1800,
      "objectStates": {
        "outer": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "rect": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "inner": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "squeezeInfo": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        }
      }
    }
  ],
  "dependencies": [
    {
      "sourceId": "A",
      "targetId": "Ai",
      "relation": "expression"
    },
    {
      "sourceId": "epsilon",
      "targetId": "Ai",
      "relation": "expression"
    },
    {
      "sourceId": "B",
      "targetId": "Bi",
      "relation": "expression"
    },
    {
      "sourceId": "epsilon",
      "targetId": "Bi",
      "relation": "expression"
    },
    {
      "sourceId": "C",
      "targetId": "Ci",
      "relation": "expression"
    },
    {
      "sourceId": "epsilon",
      "targetId": "Ci",
      "relation": "expression"
    },
    {
      "sourceId": "D",
      "targetId": "Di",
      "relation": "expression"
    },
    {
      "sourceId": "epsilon",
      "targetId": "Di",
      "relation": "expression"
    },
    {
      "sourceId": "A",
      "targetId": "Ao",
      "relation": "expression"
    },
    {
      "sourceId": "epsilon",
      "targetId": "Ao",
      "relation": "expression"
    },
    {
      "sourceId": "B",
      "targetId": "Bo",
      "relation": "expression"
    },
    {
      "sourceId": "epsilon",
      "targetId": "Bo",
      "relation": "expression"
    },
    {
      "sourceId": "C",
      "targetId": "Co",
      "relation": "expression"
    },
    {
      "sourceId": "epsilon",
      "targetId": "Co",
      "relation": "expression"
    },
    {
      "sourceId": "D",
      "targetId": "Do",
      "relation": "expression"
    },
    {
      "sourceId": "epsilon",
      "targetId": "Do",
      "relation": "expression"
    }
  ],
  "note": "Ajusta ε. Los rectángulos racionales interior y exterior se aproximan simultáneamente a R.",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const DemoAreaRectanguloInconmensurable = () => <DiagramRenderer spec={DemoAreaRectanguloInconmensurableSpec} />;
