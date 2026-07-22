import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const DesigualdadTriangularSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
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
  "objects": [
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3,
        "y": -2
      },
      "mobility": {
        "type": "constrained",
        "relationIds": [
          "sameA"
        ]
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {
        "snapToGrid": true,
        "snapSize": 0.25
      }
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 3,
        "y": -1.7
      },
      "mobility": {
        "type": "constrained",
        "relationIds": [
          "sameB"
        ]
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {
        "snapToGrid": true,
        "snapSize": 0.25
      }
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0.3,
        "y": 2.6
      },
      "mobility": {
        "type": "constrained",
        "relationIds": [
          "sameC"
        ]
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {
        "snapToGrid": true,
        "snapSize": 0.25
      }
    },
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
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "A",
          "B",
          "C"
        ]
      },
      "appearance": {
        "strokeWidth": 3,
        "fillOpacity": 0.1,
        "highlightFillOpacity": 0.28,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "A",
          "B"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "B",
          "C"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "C",
          "A"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "dimension",
        "points": [
          "A",
          "B"
        ],
        "offset": 0
      },
      "appearance": {
        "strokeWidth": 2.4,
        "labelSize": 20,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
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
      "objectType": "path",
      "geometry": {
        "type": "dimension",
        "points": [
          "B",
          "C"
        ],
        "offset": 0
      },
      "appearance": {
        "strokeWidth": 2.4,
        "labelSize": 20,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
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
      "objectType": "path",
      "geometry": {
        "type": "dimension",
        "points": [
          "C",
          "A"
        ],
        "offset": 0
      },
      "appearance": {
        "strokeWidth": 2.4,
        "labelSize": 20,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
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
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "",
        "precision": 2,
        "blocks": [
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
        "layout": "columns"
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0,
          0
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [
    {
      "id": "sameA",
      "label": "A no cruza BC",
      "enabled": true,
      "type": "same-half-plane",
      "points": [
        "A",
        "B"
      ],
      "boundary": "C"
    },
    {
      "id": "sameB",
      "label": "B no cruza CA",
      "enabled": true,
      "type": "same-half-plane",
      "points": [
        "B",
        "C"
      ],
      "boundary": "A"
    },
    {
      "id": "sameC",
      "label": "C no cruza AB",
      "enabled": true,
      "type": "same-half-plane",
      "points": [
        "C",
        "A"
      ],
      "boundary": "B"
    }
  ],
  "steps": [],
  "note": "Mueve A, B y C"
}
);
/* @matematika-diagram-spec:end */

export const DesigualdadTriangular = () => <DiagramRenderer spec={DesigualdadTriangularSpec} />;
