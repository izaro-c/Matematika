import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const RelacionReflexivaSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Relación reflexiva: todos los lazos",
  "componentId": "relacion-reflexiva",
  "category": "Definiciones",
  "mode": "diagram",
  "axis": false,
  "grid": false,
  "showLabels": true,
  "viewport": {
    "bounds": [
      -4.4,
      1.75,
      4.4,
      -2.05
    ],
    "home": [
      -4.4,
      1.75,
      4.4,
      -2.05
    ],
    "minZoom": 0.6,
    "maxZoom": 3,
    "padding": 0.06
  },
  "layers": [
    {
      "id": "construction",
      "label": "Construcción",
      "order": 0,
      "visible": true,
      "locked": true
    },
    {
      "id": "relation",
      "label": "Pares de la relación",
      "order": 1,
      "visible": true,
      "locked": false
    },
    {
      "id": "elements",
      "label": "Elementos",
      "order": 2,
      "visible": true,
      "locked": false
    },
    {
      "id": "annotations",
      "label": "Rótulos",
      "order": 3,
      "visible": true,
      "locked": false
    }
  ],
  "groups": [
    {
      "id": "diagonal",
      "label": "Diagonal Δ_A",
      "memberIds": [
        "lazoIa",
        "lazoIb",
        "lazoIc"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": true,
      "targetId": "diagonal"
    }
  ],
  "objects": [
    {
      "id": "divisorArriba",
      "label": "divisorArriba",
      "color": "carbon",
      "layerId": "construction",
      "order": 1,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0,
        "y": 1.45
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "divisorAbajo",
      "label": "divisorAbajo",
      "color": "carbon",
      "layerId": "construction",
      "order": 2,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0,
        "y": -1.85
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "divisor",
      "label": "divisor",
      "color": "canela",
      "layerId": "annotations",
      "order": 3,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "divisorArriba",
          "divisorAbajo"
        ]
      },
      "appearance": {
        "strokeWidth": 1,
        "strokeOpacity": 0.6,
        "dashed": true
      }
    },
    {
      "id": "ia",
      "label": "a",
      "color": "carbon",
      "layerId": "elements",
      "order": 4,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "primary",
        "ariaLabel": "Elemento a"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2.2,
        "y": 0.45
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 4,
        "labelVisible": true,
        "labelSize": 16,
        "labelPosition": "rt"
      }
    },
    {
      "id": "ib",
      "label": "b",
      "color": "carbon",
      "layerId": "elements",
      "order": 5,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "primary",
        "ariaLabel": "Elemento b"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3.25,
        "y": -1
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 4,
        "labelVisible": true,
        "labelSize": 16,
        "labelPosition": "bot"
      }
    },
    {
      "id": "ic",
      "label": "c",
      "color": "carbon",
      "layerId": "elements",
      "order": 6,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "primary",
        "ariaLabel": "Elemento c"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -1.15,
        "y": -1
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 4,
        "labelVisible": true,
        "labelSize": 16,
        "labelPosition": "bot"
      }
    },
    {
      "id": "da",
      "label": "a",
      "color": "carbon",
      "layerId": "elements",
      "order": 7,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "primary",
        "ariaLabel": "Elemento a"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.2,
        "y": 0.45
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 4,
        "labelVisible": true,
        "labelSize": 16,
        "labelPosition": "rt"
      }
    },
    {
      "id": "db",
      "label": "b",
      "color": "carbon",
      "layerId": "elements",
      "order": 8,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "primary",
        "ariaLabel": "Elemento b"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 1.15,
        "y": -1
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 4,
        "labelVisible": true,
        "labelSize": 16,
        "labelPosition": "bot"
      }
    },
    {
      "id": "dc",
      "label": "c",
      "color": "carbon",
      "layerId": "elements",
      "order": 9,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "primary",
        "ariaLabel": "Elemento c"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 3.25,
        "y": -1
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 4,
        "labelVisible": true,
        "labelSize": 16,
        "labelPosition": "bot"
      }
    },
    {
      "id": "lazoIaCentro",
      "label": "lazoIaCentro",
      "color": "carbon",
      "layerId": "construction",
      "order": 10,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2.2,
        "y": 0.75
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "lazoIaIni",
      "label": "lazoIaIni",
      "color": "carbon",
      "layerId": "construction",
      "order": 11,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2.041,
        "y": 0.496
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "lazoIaFin",
      "label": "lazoIaFin",
      "color": "carbon",
      "layerId": "construction",
      "order": 12,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2.359,
        "y": 0.496
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "lazoIa",
      "label": "lazoIa",
      "color": "mora",
      "layerId": "relation",
      "order": 13,
      "visible": true,
      "locked": true,
      "groupIds": [
        "diagonal"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary",
        "ariaLabel": "Par (a, a)"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "arc",
        "points": [
          "lazoIaCentro",
          "lazoIaIni",
          "lazoIaFin"
        ],
        "direction": "counterclockwise"
      },
      "appearance": {
        "strokeWidth": 2,
        "arrow": "end"
      }
    },
    {
      "id": "lazoIbCentro",
      "label": "lazoIbCentro",
      "color": "carbon",
      "layerId": "construction",
      "order": 14,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3.55,
        "y": -1
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "lazoIbIni",
      "label": "lazoIbIni",
      "color": "carbon",
      "layerId": "construction",
      "order": 15,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3.296,
        "y": -0.841
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "lazoIbFin",
      "label": "lazoIbFin",
      "color": "carbon",
      "layerId": "construction",
      "order": 16,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3.296,
        "y": -1.159
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "lazoIb",
      "label": "lazoIb",
      "color": "mora",
      "layerId": "relation",
      "order": 17,
      "visible": true,
      "locked": true,
      "groupIds": [
        "diagonal"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary",
        "ariaLabel": "Par (b, b)"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "arc",
        "points": [
          "lazoIbCentro",
          "lazoIbIni",
          "lazoIbFin"
        ],
        "direction": "counterclockwise"
      },
      "appearance": {
        "strokeWidth": 2,
        "arrow": "end"
      }
    },
    {
      "id": "lazoIcCentro",
      "label": "lazoIcCentro",
      "color": "carbon",
      "layerId": "construction",
      "order": 18,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -0.85,
        "y": -1
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "lazoIcIni",
      "label": "lazoIcIni",
      "color": "carbon",
      "layerId": "construction",
      "order": 19,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -1.104,
        "y": -1.159
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "lazoIcFin",
      "label": "lazoIcFin",
      "color": "carbon",
      "layerId": "construction",
      "order": 20,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -1.104,
        "y": -0.841
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "lazoIc",
      "label": "lazoIc",
      "color": "mora",
      "layerId": "relation",
      "order": 21,
      "visible": true,
      "locked": true,
      "groupIds": [
        "diagonal"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary",
        "ariaLabel": "Par (c, c)"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "arc",
        "points": [
          "lazoIcCentro",
          "lazoIcIni",
          "lazoIcFin"
        ],
        "direction": "counterclockwise"
      },
      "appearance": {
        "strokeWidth": 2,
        "arrow": "end"
      }
    },
    {
      "id": "flechaIabIni",
      "label": "flechaIabIni",
      "color": "carbon",
      "layerId": "construction",
      "order": 22,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2.3,
        "y": 0.312
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "flechaIabFin",
      "label": "flechaIabFin",
      "color": "carbon",
      "layerId": "construction",
      "order": 23,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3.15,
        "y": -0.862
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "flechaIab",
      "label": "flechaIab",
      "color": "carbon",
      "layerId": "relation",
      "order": 24,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "secondary",
        "ariaLabel": "Par (a, b)"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "flechaIabIni",
          "flechaIabFin"
        ]
      },
      "appearance": {
        "strokeWidth": 2,
        "arrow": "end"
      }
    },
    {
      "id": "lazoDaCentro",
      "label": "lazoDaCentro",
      "color": "carbon",
      "layerId": "construction",
      "order": 25,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.2,
        "y": 0.75
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "lazoDaIni",
      "label": "lazoDaIni",
      "color": "carbon",
      "layerId": "construction",
      "order": 26,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.359,
        "y": 0.496
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "lazoDaFin",
      "label": "lazoDaFin",
      "color": "carbon",
      "layerId": "construction",
      "order": 27,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.041,
        "y": 0.496
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "lazoDa",
      "label": "lazoDa",
      "color": "mora",
      "layerId": "relation",
      "order": 28,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "secondary",
        "ariaLabel": "Par (a, a)"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "arc",
        "points": [
          "lazoDaCentro",
          "lazoDaIni",
          "lazoDaFin"
        ],
        "direction": "counterclockwise"
      },
      "appearance": {
        "strokeWidth": 2,
        "arrow": "end"
      }
    },
    {
      "id": "lazoDbCentro",
      "label": "lazoDbCentro",
      "color": "carbon",
      "layerId": "construction",
      "order": 29,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0.85,
        "y": -1
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "lazoDbIni",
      "label": "lazoDbIni",
      "color": "carbon",
      "layerId": "construction",
      "order": 30,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 1.104,
        "y": -0.841
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "lazoDbFin",
      "label": "lazoDbFin",
      "color": "carbon",
      "layerId": "construction",
      "order": 31,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 1.104,
        "y": -1.159
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "lazoDb",
      "label": "lazoDb",
      "color": "mora",
      "layerId": "relation",
      "order": 32,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "secondary",
        "ariaLabel": "Par (b, b)"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "arc",
        "points": [
          "lazoDbCentro",
          "lazoDbIni",
          "lazoDbFin"
        ],
        "direction": "counterclockwise"
      },
      "appearance": {
        "strokeWidth": 2,
        "arrow": "end"
      }
    },
    {
      "id": "lazoDcCentro",
      "label": "lazoDcCentro",
      "color": "carbon",
      "layerId": "construction",
      "order": 33,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 3.55,
        "y": -1
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "lazoDcIni",
      "label": "lazoDcIni",
      "color": "carbon",
      "layerId": "construction",
      "order": 34,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 3.296,
        "y": -1.159
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "lazoDcFin",
      "label": "lazoDcFin",
      "color": "carbon",
      "layerId": "construction",
      "order": 35,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 3.296,
        "y": -0.841
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "lazoDc",
      "label": "lazoDc",
      "color": "granada",
      "layerId": "relation",
      "order": 36,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "secondary",
        "ariaLabel": "Falta el par (c, c)"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "arc",
        "points": [
          "lazoDcCentro",
          "lazoDcIni",
          "lazoDcFin"
        ],
        "direction": "counterclockwise"
      },
      "appearance": {
        "strokeWidth": 2,
        "arrow": "end",
        "dashed": true
      }
    },
    {
      "id": "flechaDabIni",
      "label": "flechaDabIni",
      "color": "carbon",
      "layerId": "construction",
      "order": 37,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.1,
        "y": 0.312
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "flechaDabFin",
      "label": "flechaDabFin",
      "color": "carbon",
      "layerId": "construction",
      "order": 38,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 1.25,
        "y": -0.862
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "flechaDab",
      "label": "flechaDab",
      "color": "carbon",
      "layerId": "relation",
      "order": 39,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "secondary",
        "ariaLabel": "Par (a, b)"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "flechaDabIni",
          "flechaDabFin"
        ]
      },
      "appearance": {
        "strokeWidth": 2,
        "arrow": "end"
      }
    },
    {
      "id": "rotuloSi",
      "label": "Reflexiva",
      "color": "musgo",
      "layerId": "annotations",
      "order": 40,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2.2,
        "y": 1.5
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": true,
        "labelSize": 15,
        "labelPosition": "top",
        "labelOffset": [
          0,
          -11
        ]
      }
    },
    {
      "id": "rotuloNo",
      "label": "No reflexiva: falta (c, c)",
      "color": "granada",
      "layerId": "annotations",
      "order": 41,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.2,
        "y": 1.5
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": true,
        "labelSize": 15,
        "labelPosition": "top",
        "labelOffset": [
          0,
          -11
        ]
      }
    }
  ],
  "relations": [],
  "steps": [],
  "note": "Cada lazo es un par (x, x). A la derecha falta el de c, así que la relación no es reflexiva.",
  "translations": {
    "eu": {
      "title": "Erlazio erreflexiboa: begizta guztiak",
      "note": "Begizta bakoitza (x, x) bikote bat da. Eskuinean c-rena falta da; beraz, erlazioa ez da erreflexiboa.",
      "labels": {
        "diagonal": "Δ_A diagonala",
        "rotuloSi": "Erreflexiboa",
        "rotuloNo": "Ez erreflexiboa: (c, c) falta da"
      },
      "ariaLabels": {
        "ia": "a elementua",
        "ib": "b elementua",
        "ic": "c elementua",
        "da": "a elementua",
        "db": "b elementua",
        "dc": "c elementua",
        "lazoIa": "(a, a) bikotea",
        "lazoIb": "(b, b) bikotea",
        "lazoIc": "(c, c) bikotea",
        "flechaIab": "(a, b) bikotea",
        "lazoDa": "(a, a) bikotea",
        "lazoDb": "(b, b) bikotea",
        "lazoDc": "(c, c) bikotea falta da",
        "flechaDab": "(a, b) bikotea"
      }
    },
    "en": {
      "title": "Reflexive relation: every loop",
      "note": "Each loop is a pair (x, x). On the right the loop at c is missing, so the relation is not reflexive.",
      "labels": {
        "diagonal": "Diagonal Δ_A",
        "rotuloSi": "Reflexive",
        "rotuloNo": "Not reflexive: (c, c) missing"
      },
      "ariaLabels": {
        "ia": "Element a",
        "ib": "Element b",
        "ic": "Element c",
        "da": "Element a",
        "db": "Element b",
        "dc": "Element c",
        "lazoIa": "Pair (a, a)",
        "lazoIb": "Pair (b, b)",
        "lazoIc": "Pair (c, c)",
        "flechaIab": "Pair (a, b)",
        "lazoDa": "Pair (a, a)",
        "lazoDb": "Pair (b, b)",
        "lazoDc": "Missing pair (c, c)",
        "flechaDab": "Pair (a, b)"
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const RelacionReflexiva = () => <DiagramRenderer spec={RelacionReflexivaSpec} />;
