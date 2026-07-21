import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const SumaAngulosSpec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Suma de los ángulos de un triángulo",
  "componentId": "suma-angulos",
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
      "id": "gTriangle",
      "label": "Triángulo ABC",
      "memberIds": [
        "poly",
        "AB",
        "BC",
        "CA"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo ABC",
        "role": "primary"
      },
      "target": true,
      "targetId": "triangulo",
      "color": "terracota"
    },
    {
      "id": "gAngles",
      "label": "Ángulos interiores",
      "memberIds": [],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulos interiores",
        "role": "primary"
      },
      "target": true,
      "targetId": "angulos",
      "color": "terracota"
    }
  ],
  "points": [
    {
      "id": "A",
      "label": "A",
      "color": "terracota",
      "layerId": "geometry",
      "order": 12640,
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
      "x": -3.5,
      "y": 0,
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
      "order": 11640,
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
      "x": 4.25,
      "y": 0.25,
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
      "order": 9640,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto C",
        "role": "primary"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 0.25,
      "y": 4.75,
      "showLabel": true,
      "fixed": false,
      "constraint": "constrained",
      "constraintIds": [
        "sameC"
      ],
      "snapToGrid": true,
      "snapSize": 0.25
    }
  ],
  "elements": [
    {
      "id": "poly",
      "label": "Triángulo ABC",
      "color": "terracota",
      "layerId": "geometry",
      "order": 10640,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTriangle"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo ABC",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 3,
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
      "id": "AB",
      "label": "AB",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1620,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTriangle"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "AB",
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
      "id": "BC",
      "label": "BC",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1630,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTriangle"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "BC",
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
      "id": "CA",
      "label": "CA",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1640,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTriangle"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "CA",
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
        "C",
        "A"
      ]
    },
    {
      "id": "nonReflexAngleBAC",
      "label": "a",
      "color": "musgo",
      "layerId": "geometry",
      "order": 2640,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "nonReflexAngleBAC",
      "style": {
        "angleRadius": 1,
        "preserveColorOnHighlight": true
      },
      "kind": "nonReflexAngle",
      "refs": [
        "B",
        "A",
        "C"
      ],
      "showLabel": false
    },
    {
      "id": "nonReflexAngleABC",
      "label": "b",
      "color": "musgo",
      "layerId": "geometry",
      "order": 3640,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "nonReflexAngleABC",
      "style": {
        "angleRadius": 1,
        "preserveColorOnHighlight": true
      },
      "kind": "nonReflexAngle",
      "refs": [
        "A",
        "B",
        "C"
      ],
      "showLabel": false
    },
    {
      "id": "nonReflexAngleACB",
      "label": "c",
      "color": "musgo",
      "layerId": "geometry",
      "order": 4640,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "nonReflexAngleACB",
      "style": {
        "angleRadius": 1,
        "preserveColorOnHighlight": true
      },
      "kind": "nonReflexAngle",
      "refs": [
        "A",
        "C",
        "B"
      ],
      "showLabel": false
    },
    {
      "id": "label-nonReflexAngleACB",
      "label": "Etiqueta de c",
      "color": "musgo",
      "layerId": "geometry",
      "order": 5640,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Etiqueta de c",
        "role": "annotation"
      },
      "target": false,
      "style": {
        "textOffset": [
          -0.5,
          -0.25
        ],
        "labelSize": 17,
        "preserveColorOnHighlight": true
      },
      "kind": "label",
      "refs": [
        "nonReflexAngleACB"
      ],
      "text": "{nonReflexAngleACB.degrees}º",
      "properties": {
        "anchorMode": "reference",
        "anchorParameter": 0.99,
        "textRules": []
      }
    },
    {
      "id": "label-nonReflexAngleBAC",
      "label": "Etiqueta de a",
      "color": "musgo",
      "layerId": "geometry",
      "order": 6640,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Etiqueta de a",
        "role": "annotation"
      },
      "target": false,
      "style": {
        "textOffset": [
          0,
          0
        ],
        "labelSize": 17,
        "preserveColorOnHighlight": true
      },
      "kind": "label",
      "refs": [
        "nonReflexAngleBAC"
      ],
      "text": "{nonReflexAngleBAC.degrees}º",
      "properties": {
        "anchorMode": "reference",
        "anchorParameter": 0.08
      },
      "showLabel": false
    },
    {
      "id": "label-nonReflexAngleABC",
      "label": "Etiqueta de b",
      "color": "musgo",
      "layerId": "geometry",
      "order": 7640,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Etiqueta de b",
        "role": "annotation"
      },
      "target": false,
      "style": {
        "textOffset": [
          -0.95,
          -0.15
        ],
        "labelSize": 17,
        "preserveColorOnHighlight": true
      },
      "kind": "label",
      "refs": [
        "nonReflexAngleABC"
      ],
      "text": "{nonReflexAngleABC.degrees}º",
      "properties": {
        "anchorMode": "reference",
        "anchorParameter": 0.5
      }
    },
    {
      "id": "infoPanel11",
      "label": "Panel informativo",
      "color": "terracota",
      "layerId": "geometry",
      "order": 8640,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Panel informativo",
        "role": "secondary"
      },
      "target": true,
      "targetId": "infoPanel11",
      "style": {
        "preserveColorOnHighlight": true
      },
      "kind": "infoPanel",
      "refs": [],
      "text": "",
      "properties": {
        "anchorMode": "viewport",
        "viewportPosition": [
          0,
          0
        ],
        "infoPanelBlocks": [
          {
            "id": "bloque-1",
            "text": "${nonReflexAngleBAC.degrees}º + {nonReflexAngleABC.degrees}º + {nonReflexAngleACB.degrees}º = {value}º$",
            "expression": "nonReflexAngleBAC.degrees + nonReflexAngleABC.degrees + nonReflexAngleACB.degrees",
            "rules": []
          }
        ],
        "infoPanelLayout": "stack"
      }
    }
  ],
  "sliders": [],
  "steps": [],
  "constraints": [
    {
      "id": "sameC",
      "label": "C no cruza AB",
      "kind": "sameSide",
      "refs": [
        "C",
        "A",
        "B"
      ],
      "enabled": true
    }
  ],
  "dependencies": [
    {
      "sourceId": "B",
      "targetId": "nonReflexAngleBAC",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "nonReflexAngleBAC",
      "relation": "construction"
    },
    {
      "sourceId": "C",
      "targetId": "nonReflexAngleBAC",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "nonReflexAngleABC",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "nonReflexAngleABC",
      "relation": "construction"
    },
    {
      "sourceId": "C",
      "targetId": "nonReflexAngleABC",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "nonReflexAngleACB",
      "relation": "construction"
    },
    {
      "sourceId": "C",
      "targetId": "nonReflexAngleACB",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "nonReflexAngleACB",
      "relation": "construction"
    },
    {
      "sourceId": "nonReflexAngleACB",
      "targetId": "label-nonReflexAngleACB",
      "relation": "construction"
    },
    {
      "sourceId": "nonReflexAngleBAC",
      "targetId": "label-nonReflexAngleBAC",
      "relation": "construction"
    },
    {
      "sourceId": "nonReflexAngleABC",
      "targetId": "label-nonReflexAngleABC",
      "relation": "construction"
    },
    {
      "sourceId": "nonReflexAngleBAC",
      "targetId": "infoPanel11",
      "relation": "expression"
    },
    {
      "sourceId": "nonReflexAngleABC",
      "targetId": "infoPanel11",
      "relation": "expression"
    },
    {
      "sourceId": "nonReflexAngleACB",
      "targetId": "infoPanel11",
      "relation": "expression"
    }
  ],
  "note": "Mueve A, B y C",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const SumaAngulos = () => <DiagramRenderer spec={SumaAngulosSpec} />;
