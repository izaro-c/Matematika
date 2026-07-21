import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const DesigualdadTriangularSpec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Desigualdad triangular",
  "componentId": "desigualdad-triangular",
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
      "label": "Triángulo",
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
        "ariaLabel": "Triángulo",
        "role": "primary"
      },
      "target": true,
      "targetId": "triangulo",
      "color": "terracota"
    },
    {
      "id": "gSides",
      "label": "Lados",
      "memberIds": [
        "AB",
        "BC",
        "CA"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Lados",
        "role": "primary"
      },
      "target": true,
      "targetId": "lados",
      "color": "terracota"
    },
    {
      "id": "gA",
      "label": "Lado a",
      "memberIds": [
        "BC",
        "dBC"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado a",
        "role": "primary"
      },
      "target": true,
      "targetId": "lado-a",
      "color": "terracota"
    },
    {
      "id": "gB",
      "label": "Lado b",
      "memberIds": [
        "CA",
        "dCA"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado b",
        "role": "primary"
      },
      "target": true,
      "targetId": "lado-b",
      "color": "terracota"
    },
    {
      "id": "gC",
      "label": "Lado c",
      "memberIds": [
        "AB",
        "dAB"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado c",
        "role": "primary"
      },
      "target": true,
      "targetId": "lado-c",
      "color": "terracota"
    },
    {
      "id": "gIneq",
      "label": "Desigualdad triangular",
      "memberIds": [
        "poly",
        "AB",
        "BC",
        "CA",
        "slack"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Desigualdad triangular",
        "role": "primary"
      },
      "target": true,
      "targetId": "desigualdad",
      "color": "terracota"
    }
  ],
  "points": [
    {
      "id": "A",
      "label": "A",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1310,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto A",
        "role": "primary"
      },
      "target": true,
      "targetId": "A",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -3,
      "y": -2,
      "showLabel": true,
      "fixed": false,
      "constraint": "constrained",
      "constraintIds": [
        "sameA"
      ],
      "snapToGrid": true,
      "snapSize": 0.25
    },
    {
      "id": "B",
      "label": "B",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1320,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto B",
        "role": "primary"
      },
      "target": true,
      "targetId": "B",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 3,
      "y": -1.7,
      "showLabel": true,
      "fixed": false,
      "constraint": "constrained",
      "constraintIds": [
        "sameB"
      ],
      "snapToGrid": true,
      "snapSize": 0.25
    },
    {
      "id": "C",
      "label": "C",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1330,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto C",
        "role": "primary"
      },
      "target": true,
      "targetId": "C",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 0.3,
      "y": 2.6,
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
      "order": 1340,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTriangle",
        "gIneq"
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
      "label": "c = AB",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1350,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTriangle",
        "gSides",
        "gC",
        "gIneq"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "c = AB",
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
      "label": "a = BC",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1360,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTriangle",
        "gSides",
        "gA",
        "gIneq"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "a = BC",
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
      "label": "b = CA",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1370,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTriangle",
        "gSides",
        "gB",
        "gIneq"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "b = CA",
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
      "id": "dAB",
      "label": "c",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1380,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gC"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "c",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.4,
        "labelSize": 20,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "dimensionLine",
      "refs": [
        "A",
        "B"
      ],
      "text": "c = {value}",
      "properties": {
        "unit": "u",
        "precision": 2,
        "offset": 0
      }
    },
    {
      "id": "dBC",
      "label": "a",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1390,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gA"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "a",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.4,
        "labelSize": 20,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "dimensionLine",
      "refs": [
        "B",
        "C"
      ],
      "text": "a = {value}",
      "properties": {
        "unit": "u",
        "precision": 2,
        "offset": 0
      }
    },
    {
      "id": "dCA",
      "label": "b",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1400,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gB"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "b",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.4,
        "labelSize": 20,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "dimensionLine",
      "refs": [
        "C",
        "A"
      ],
      "text": "b = {value}",
      "properties": {
        "unit": "u",
        "precision": 2,
        "offset": 0
      }
    },
    {
      "id": "slack",
      "label": "Margen de la desigualdad",
      "color": "terracota",
      "layerId": "annotations",
      "order": 1410,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gIneq"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Margen de la desigualdad",
        "role": "annotation"
      },
      "target": false,
      "style": {
        "preserveColorOnHighlight": true
      },
      "kind": "infoPanel",
      "refs": [],
      "text": "",
      "properties": {
        "precision": 2,
        "anchorMode": "viewport",
        "viewportPosition": [
          0,
          0
        ],
        "infoPanelBlocks": [
          {
            "id": "bloque-1",
            "text": "$a + b = {value}$",
            "expression": "BC.length + CA.length",
            "unit": "u",
            "rules": []
          },
          {
            "id": "bloque-2",
            "text": "$c = {value}$",
            "expression": "AB.length",
            "unit": "u",
            "rules": []
          },
          {
            "id": "bloque-3",
            "text": "$a+b>c$",
            "rules": []
          }
        ],
        "infoPanelLayout": "columns"
      }
    }
  ],
  "sliders": [],
  "steps": [],
  "constraints": [
    {
      "id": "sameA",
      "label": "A no cruza BC",
      "kind": "sameSide",
      "refs": [
        "A",
        "B",
        "C"
      ],
      "enabled": true
    },
    {
      "id": "sameB",
      "label": "B no cruza CA",
      "kind": "sameSide",
      "refs": [
        "B",
        "C",
        "A"
      ],
      "enabled": true
    },
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
      "sourceId": "BC",
      "targetId": "slack",
      "relation": "expression"
    },
    {
      "sourceId": "CA",
      "targetId": "slack",
      "relation": "expression"
    },
    {
      "sourceId": "AB",
      "targetId": "slack",
      "relation": "expression"
    }
  ],
  "note": "Mueve A, B y C",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const DesigualdadTriangular = () => <DiagramRenderer spec={DesigualdadTriangularSpec} />;
