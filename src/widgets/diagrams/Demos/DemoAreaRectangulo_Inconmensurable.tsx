import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const DemoAreaRectanguloInconmensurableSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
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
  "objects": [
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2.7,
        "y": -1.5
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 7,
        "labelVisible": false,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.7,
        "y": -1.5
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 7,
        "labelVisible": false,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.7,
        "y": 2
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 7,
        "labelVisible": false,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2.7,
        "y": 2
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 7,
        "labelVisible": false,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "A.x + epsilon",
        "y": "A.y + epsilon",
        "fallback": [
          -2.3,
          -1.1
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "B.x - epsilon",
        "y": "B.y + epsilon",
        "fallback": [
          2.3,
          -1.1
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "C.x - epsilon",
        "y": "C.y - epsilon",
        "fallback": [
          2.3,
          1.6
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "D.x + epsilon",
        "y": "D.y - epsilon",
        "fallback": [
          -2.3,
          1.6
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "A.x - epsilon",
        "y": "A.y - epsilon",
        "fallback": [
          -3.1,
          -1.9
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "B.x + epsilon",
        "y": "B.y - epsilon",
        "fallback": [
          3.1,
          -1.9
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "C.x + epsilon",
        "y": "C.y + epsilon",
        "fallback": [
          3.1,
          2.4
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "D.x - epsilon",
        "y": "D.y + epsilon",
        "fallback": [
          -3.1,
          2.4
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
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
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "Ao",
          "Bo",
          "Co",
          "Do"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "fillOpacity": 0.05,
        "highlightFillOpacity": 0.28,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "A",
          "B",
          "C",
          "D"
        ]
      },
      "appearance": {
        "strokeWidth": 3,
        "fillOpacity": 0.12,
        "highlightFillOpacity": 0.28,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "Ai",
          "Bi",
          "Ci",
          "Di"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "fillOpacity": 0.14,
        "highlightFillOpacity": 0.28,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "Rₖ⁻ ⊂ R ⊂ Rₖ⁺; al reducir ε, ambas áreas acotan la de R.",
        "title": "Encaje arquimediano"
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
    },
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
      "objectType": "control",
      "variant": "slider",
      "position": [
        -1.5,
        -3.1
      ],
      "range": {
        "min": 0.1,
        "max": 0.8,
        "step": 0.05
      },
      "value": 0.4
    }
  ],
  "relations": [],
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
  "note": "Ajusta ε. Los rectángulos racionales interior y exterior se aproximan simultáneamente a R."
}
);
/* @matematika-diagram-spec:end */

export const DemoAreaRectanguloInconmensurable = () => <DiagramRenderer spec={DemoAreaRectanguloInconmensurableSpec} />;
