import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const DemoAreaRectanguloConmensurableSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Área del rectángulo: caso conmensurable",
  "componentId": "demo-area-rectangulo-conmensurable",
  "category": "Demostraciones",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "viewport": {
    "bounds": [
      -4.5,
      4,
      4.5,
      -3
    ],
    "home": [
      -4.5,
      4,
      4.5,
      -3
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
      "order": 2430,
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
        "x": -3,
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
      "order": 2440,
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
        "x": 3,
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
      "order": 2450,
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
        "x": 3,
        "y": 2.5
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
      "order": 2460,
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
        "x": -3,
        "y": 2.5
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
      "id": "U1",
      "label": "U₁",
      "color": "ocre",
      "layerId": "geometry",
      "order": 2470,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto fijo U₁",
        "role": "secondary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3,
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
      "id": "U2",
      "label": "U₂",
      "color": "ocre",
      "layerId": "geometry",
      "order": 2480,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto fijo U₂",
        "role": "secondary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2,
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
      "id": "U3",
      "label": "U₃",
      "color": "ocre",
      "layerId": "geometry",
      "order": 2490,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto fijo U₃",
        "role": "secondary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2,
        "y": -0.5
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
      "id": "U4",
      "label": "U₄",
      "color": "ocre",
      "layerId": "geometry",
      "order": 2500,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto fijo U₄",
        "role": "secondary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3,
        "y": -0.5
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
      "id": "rect",
      "label": "Rectángulo R",
      "color": "granada",
      "layerId": "geometry",
      "order": 2510,
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
        "fillOpacity": 0.08,
        "highlightFillOpacity": 0.28,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "grid",
      "label": "Cuadrícula unitaria",
      "color": "granada",
      "layerId": "geometry",
      "order": 2520,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Cuadrícula unitaria",
        "role": "secondary"
      },
      "target": false,
      "objectType": "region",
      "geometry": {
        "type": "grid-region",
        "points": [
          "A",
          "B",
          "C",
          "D"
        ],
        "rows": 4,
        "columns": 6
      },
      "appearance": {
        "strokeWidth": 1.2,
        "strokeOpacity": 0.45,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "unit",
      "label": "Cuadrado unidad",
      "color": "ocre",
      "layerId": "geometry",
      "order": 2530,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Cuadrado unidad",
        "role": "secondary"
      },
      "target": true,
      "targetId": "cuadrado-unidad",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "U1",
          "U2",
          "U3",
          "U4"
        ]
      },
      "appearance": {
        "strokeWidth": 3,
        "fillOpacity": 0.3,
        "highlightFillOpacity": 0.28,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "gridInfo",
      "label": "Conteo de unidades",
      "color": "granada",
      "layerId": "annotations",
      "order": 2540,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Conteo de unidades",
        "role": "annotation"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "6 × 4 cuadrados unidad ⇒ Cont(R) = b · h",
        "title": "Conteo de unidades"
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
    }
  ],
  "relations": [],
  "steps": [
    {
      "id": "step1",
      "label": "Caso conmensurable",
      "description": "La cuadrícula cuenta m · n copias del cuadrado unidad.",
      "visibleTargets": [
        "rect",
        "grid",
        "unit",
        "gridInfo"
      ],
      "durationMs": 1800,
      "objectStates": {
        "rect": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "grid": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "unit": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "gridInfo": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        }
      }
    }
  ],
  "note": "La cuadrícula interna traduce el producto b · h en un conteo de cuadrados unidad."
}
);
/* @matematika-diagram-spec:end */

export const DemoAreaRectanguloConmensurable = () => <DiagramRenderer spec={DemoAreaRectanguloConmensurableSpec} />;
