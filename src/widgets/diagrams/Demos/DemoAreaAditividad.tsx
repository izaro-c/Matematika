import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const DemoAreaAditividadSpec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Aditividad del contenido",
  "componentId": "demo-area-aditividad",
  "category": "Demostraciones",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "viewport": {
    "bounds": [
      -5.5,
      4.2,
      5.5,
      -4
    ],
    "home": [
      -5.5,
      4.2,
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
      "id": "gP1",
      "label": "Polígono P₁",
      "memberIds": [
        "p1"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Polígono P₁",
        "role": "primary"
      },
      "target": true,
      "targetId": "poligono-p1",
      "color": "granada"
    },
    {
      "id": "gP2",
      "label": "Polígono P₂",
      "memberIds": [
        "p2"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Polígono P₂",
        "role": "primary"
      },
      "target": true,
      "targetId": "poligono-p2",
      "color": "pizarra"
    },
    {
      "id": "gTri1",
      "label": "Triangulación de P₁",
      "memberIds": [
        "t1a"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Triangulación de P₁",
        "role": "primary"
      },
      "target": true,
      "targetId": "triangulacion-p1",
      "color": "granada"
    },
    {
      "id": "gTri2",
      "label": "Triangulación de P₂",
      "memberIds": [
        "t2a"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Triangulación de P₂",
        "role": "primary"
      },
      "target": true,
      "targetId": "triangulacion-p2",
      "color": "pizarra"
    },
    {
      "id": "gUnion",
      "label": "Polígono total P",
      "memberIds": [
        "p1",
        "p2",
        "shared"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Polígono total P",
        "role": "primary"
      },
      "target": true,
      "targetId": "poligono-p",
      "color": "granada"
    }
  ],
  "points": [
    {
      "id": "A",
      "label": "A",
      "color": "granada",
      "layerId": "geometry",
      "order": 2320,
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
      "x": -4,
      "y": -2.2,
      "showLabel": true,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "B",
      "label": "B",
      "color": "granada",
      "layerId": "geometry",
      "order": 2330,
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
      "x": 0,
      "y": -2.2,
      "showLabel": true,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "C",
      "label": "C",
      "color": "granada",
      "layerId": "geometry",
      "order": 2340,
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
      "x": -3.2,
      "y": 1.6,
      "showLabel": true,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "D",
      "label": "D",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 2350,
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
      "x": 4,
      "y": -2.2,
      "showLabel": true,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "E",
      "label": "E",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 2360,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto fijo E",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 3.1,
      "y": 1.6,
      "showLabel": true,
      "fixed": true,
      "constraint": "fixed"
    }
  ],
  "elements": [
    {
      "id": "p1",
      "label": "Polígono P₁",
      "color": "granada",
      "layerId": "geometry",
      "order": 2370,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gP1",
        "gUnion"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Polígono P₁",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 3,
        "fillOpacity": 0.16,
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
      "id": "p2",
      "label": "Polígono P₂",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 2380,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gP2",
        "gUnion"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Polígono P₂",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 3,
        "fillOpacity": 0.13,
        "highlightFillOpacity": 0.28,
        "preserveColorOnHighlight": true
      },
      "kind": "polygon",
      "refs": [
        "B",
        "D",
        "E"
      ]
    },
    {
      "id": "shared",
      "label": "Frontera común",
      "color": "carbon",
      "layerId": "geometry",
      "order": 2390,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gUnion"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Frontera común",
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
        "E"
      ],
      "dashed": true
    },
    {
      "id": "t1a",
      "label": "Triángulo A₁",
      "color": "granada",
      "layerId": "geometry",
      "order": 2400,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTri1"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo A₁",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.6,
        "fillOpacity": 0.08,
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
      "id": "t2a",
      "label": "Triángulo B₁",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 2410,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTri2"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo B₁",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.6,
        "fillOpacity": 0.08,
        "highlightFillOpacity": 0.28,
        "preserveColorOnHighlight": true
      },
      "kind": "polygon",
      "refs": [
        "B",
        "D",
        "E"
      ]
    },
    {
      "id": "areaInfo",
      "label": "Aditividad",
      "color": "granada",
      "layerId": "annotations",
      "order": 2420,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Aditividad",
        "role": "annotation"
      },
      "target": false,
      "style": {
        "preserveColorOnHighlight": true
      },
      "kind": "infoPanel",
      "refs": [],
      "text": "Cont(P₁ ∪ P₂) = Cont(P₁) + Cont(P₂)",
      "properties": {
        "title": "Aditividad",
        "anchorMode": "viewport",
        "viewportPosition": [
          0.98,
          0.03
        ]
      }
    }
  ],
  "sliders": [],
  "steps": [
    {
      "id": "step1",
      "label": "Triangulaciones",
      "description": "Cada polígono se expresa como unión de triángulos de interiores disjuntos.",
      "visibleTargets": [
        "p1",
        "p2",
        "shared",
        "t1a",
        "t2a",
        "areaInfo"
      ],
      "durationMs": 1800,
      "objectStates": {
        "p1": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "p2": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "shared": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "t1a": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "t2a": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "areaInfo": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        }
      }
    },
    {
      "id": "step2",
      "label": "Unión",
      "description": "Ambas triangulaciones encajan a lo largo de la frontera común.",
      "visibleTargets": [
        "p1",
        "p2",
        "shared",
        "t1a",
        "t2a",
        "areaInfo"
      ],
      "durationMs": 1800,
      "objectStates": {
        "p1": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "p2": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "shared": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "t1a": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "t2a": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "areaInfo": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        }
      }
    },
    {
      "id": "step3",
      "label": "Contenido",
      "description": "La suma de los contenidos triangulares se separa en las dos familias.",
      "visibleTargets": [
        "p1",
        "p2",
        "shared",
        "t1a",
        "t2a",
        "areaInfo"
      ],
      "durationMs": 1800,
      "objectStates": {
        "p1": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "p2": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "shared": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "t1a": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "t2a": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "areaInfo": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        }
      }
    }
  ],
  "dependencies": [],
  "note": "Recorre los tres pasos. El borde común no aporta área y las dos familias de triángulos cubren exactamente P.",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const DemoAreaAditividad = () => <DiagramRenderer spec={DemoAreaAditividadSpec} />;
