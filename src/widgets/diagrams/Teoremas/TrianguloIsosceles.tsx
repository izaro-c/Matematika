import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const TrianguloIsoscelesSpec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Ángulos de la base de un triángulo isósceles",
  "componentId": "triangulo-isosceles",
  "category": "Teoremas",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "viewport": {
    "bounds": [
      -5,
      5,
      5,
      -4.5
    ],
    "home": [
      -5,
      5,
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
      "label": "Lecturas y controles",
      "order": 1,
      "visible": true,
      "locked": false
    }
  ],
  "groups": [
    {
      "id": "gEqualSides",
      "label": "Lados iguales AC y BC",
      "memberIds": [
        "AC",
        "BC",
        "markAC",
        "markBC"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Lados iguales AC y BC",
        "role": "primary"
      },
      "target": true,
      "targetId": "lados-iguales",
      "color": "terracota"
    }
  ],
  "points": [
    {
      "id": "A",
      "label": "A",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1690,
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
      "y": -1.6,
      "showLabel": true,
      "fixed": false,
      "constraint": "free",
      "snapToGrid": true,
      "snapSize": 0.25
    },
    {
      "id": "B",
      "label": "B",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1700,
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
      "x": 3,
      "y": -1.6,
      "showLabel": true,
      "fixed": false,
      "constraint": "free",
      "snapToGrid": true,
      "snapSize": 0.25
    },
    {
      "id": "C",
      "label": "C",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1720,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto construido C",
        "role": "construction"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 0,
      "y": 1.6,
      "showLabel": true,
      "fixed": true,
      "constraint": "derived",
      "dependencies": [
        "A",
        "B",
        "height"
      ],
      "xExpression": "(A.x + B.x) / 2 - height * (B.y - A.y) / hypot(B.x - A.x, B.y - A.y)",
      "yExpression": "(A.y + B.y) / 2 + height * (B.x - A.x) / hypot(B.x - A.x, B.y - A.y)"
    }
  ],
  "elements": [
    {
      "id": "base",
      "label": "Base AB",
      "color": "carbon",
      "layerId": "geometry",
      "order": 1730,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Base AB",
        "role": "secondary"
      },
      "target": false,
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
      "id": "AC",
      "label": "Lado AC",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1740,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gEqualSides"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado AC",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "A",
        "C"
      ]
    },
    {
      "id": "BC",
      "label": "Lado BC",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1750,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gEqualSides"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado BC",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "B",
        "C"
      ]
    },
    {
      "id": "poly",
      "label": "Triángulo isósceles",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1760,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo isósceles",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.4,
        "fillOpacity": 0.1,
        "highlightFillOpacity": 0.28,
        "preserveColorOnHighlight": true
      },
      "kind": "polygon",
      "refs": [
        "A",
        "B",
        "C"
      ]
    },
    {
      "id": "markAC",
      "label": "Marca AC",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1770,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gEqualSides"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca AC",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "A",
        "C"
      ],
      "properties": {
        "markCount": 1
      }
    },
    {
      "id": "markBC",
      "label": "Marca BC",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1780,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gEqualSides"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca BC",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "preserveColorOnHighlight": true
      },
      "kind": "congruenceMark",
      "refs": [
        "B",
        "C"
      ],
      "properties": {
        "markCount": 1
      }
    },
    {
      "id": "angA",
      "label": "Ángulo de base A",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1790,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo de base A",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "fillOpacity": 0.22,
        "angleRadius": 0.58,
        "preserveColorOnHighlight": true
      },
      "kind": "nonReflexAngle",
      "refs": [
        "B",
        "A",
        "C"
      ]
    },
    {
      "id": "angB",
      "label": "Ángulo de base B",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1800,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo de base B",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "fillOpacity": 0.22,
        "angleRadius": 0.58,
        "preserveColorOnHighlight": true
      },
      "kind": "nonReflexAngle",
      "refs": [
        "C",
        "B",
        "A"
      ]
    },
    {
      "id": "isoInfo",
      "label": "Pons asinorum",
      "color": "terracota",
      "layerId": "annotations",
      "order": 1810,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Pons asinorum",
        "role": "annotation"
      },
      "target": false,
      "style": {
        "preserveColorOnHighlight": true
      },
      "kind": "infoPanel",
      "refs": [],
      "text": "AC = BC ⇒ ∠A = ∠B",
      "properties": {
        "title": "Pons asinorum",
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
      "id": "height",
      "label": "altura",
      "color": "terracota",
      "layerId": "annotations",
      "order": 1710,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ajustar altura",
        "role": "annotation"
      },
      "target": true,
      "targetId": "altura",
      "style": {
        "preserveColorOnHighlight": true
      },
      "x": -1.6,
      "y": -3.1,
      "min": 1,
      "max": 5,
      "value": 3.2,
      "step": 0.1
    }
  ],
  "steps": [],
  "dependencies": [
    {
      "sourceId": "A",
      "targetId": "C",
      "relation": "expression"
    },
    {
      "sourceId": "B",
      "targetId": "C",
      "relation": "expression"
    },
    {
      "sourceId": "height",
      "targetId": "C",
      "relation": "expression"
    }
  ],
  "note": "Mueve A o B y ajusta la altura. C permanece sobre la mediatriz de AB, de modo que AC = BC en toda configuración.",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const TrianguloIsosceles = () => <DiagramRenderer spec={TrianguloIsoscelesSpec} />;
