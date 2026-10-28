import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const OperacionBinariaTablaSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Operación binaria: la tabla como función",
  "componentId": "operacion-binaria-tabla",
  "category": "Definiciones",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "showLabels": true,
  "viewport": {
    "bounds": [
      -5,
      2.15,
      5,
      -3.3
    ],
    "home": [
      -5,
      2.15,
      5,
      -3.3
    ],
    "minZoom": 0.6,
    "maxZoom": 3,
    "padding": 0.06
  },
  "layers": [
    {
      "id": "helpers",
      "label": "Construcción",
      "order": 0,
      "visible": true,
      "locked": false
    },
    {
      "id": "table",
      "label": "Tabla",
      "order": 1,
      "visible": true,
      "locked": false
    },
    {
      "id": "cells",
      "label": "Casillas resaltadas",
      "order": 2,
      "visible": true,
      "locked": false
    },
    {
      "id": "set",
      "label": "Conjunto S",
      "order": 3,
      "visible": true,
      "locked": false
    },
    {
      "id": "arrows",
      "label": "Flecha",
      "order": 4,
      "visible": true,
      "locked": false
    },
    {
      "id": "handles",
      "label": "Elección del par",
      "order": 5,
      "visible": true,
      "locked": false
    },
    {
      "id": "controls",
      "label": "Valores de la tabla",
      "order": 6,
      "visible": true,
      "locked": false
    },
    {
      "id": "annotations",
      "label": "Lectura y estado",
      "order": 7,
      "visible": true,
      "locked": false
    }
  ],
  "groups": [
    {
      "id": "grupoFlecha",
      "label": "Flecha del par elegido",
      "memberIds": [
        "flecha",
        "flechaFuera"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Resaltar la flecha del par elegido",
        "role": "secondary"
      },
      "target": true,
      "targetId": "flechaPar",
      "color": "terracota"
    },
    {
      "id": "grupoValores",
      "label": "Valores de la tabla",
      "memberIds": [
        "c00",
        "c01",
        "c02",
        "c10",
        "c11",
        "c12",
        "c20",
        "c21",
        "c22"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Resaltar los valores de la tabla",
        "role": "secondary"
      },
      "target": false
    }
  ],
  "objects": [
    {
      "id": "fileteSuperiorA",
      "label": "fileteSuperiorA",
      "color": "carbon",
      "layerId": "helpers",
      "order": 1,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -4.35,
        "y": 1.3
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
      "id": "fileteSuperiorB",
      "label": "fileteSuperiorB",
      "color": "carbon",
      "layerId": "helpers",
      "order": 2,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -0.35,
        "y": 1.3
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
      "id": "fileteSuperior",
      "label": "fileteSuperior",
      "color": "carbon",
      "layerId": "table",
      "order": 3,
      "visible": true,
      "locked": false,
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
          "fileteSuperiorA",
          "fileteSuperiorB"
        ]
      },
      "appearance": {
        "strokeWidth": 1.4,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "fileteCabeceraA",
      "label": "fileteCabeceraA",
      "color": "carbon",
      "layerId": "helpers",
      "order": 4,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -4.35,
        "y": 0.3
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
      "id": "fileteCabeceraB",
      "label": "fileteCabeceraB",
      "color": "carbon",
      "layerId": "helpers",
      "order": 5,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -0.35,
        "y": 0.3
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
      "id": "fileteCabecera",
      "label": "fileteCabecera",
      "color": "carbon",
      "layerId": "table",
      "order": 6,
      "visible": true,
      "locked": false,
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
          "fileteCabeceraA",
          "fileteCabeceraB"
        ]
      },
      "appearance": {
        "strokeWidth": 1.4,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "fileteInferiorA",
      "label": "fileteInferiorA",
      "color": "carbon",
      "layerId": "helpers",
      "order": 7,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -4.35,
        "y": -2.7
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
      "id": "fileteInferiorB",
      "label": "fileteInferiorB",
      "color": "carbon",
      "layerId": "helpers",
      "order": 8,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -0.35,
        "y": -2.7
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
      "id": "fileteInferior",
      "label": "fileteInferior",
      "color": "carbon",
      "layerId": "table",
      "order": 9,
      "visible": true,
      "locked": false,
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
          "fileteInferiorA",
          "fileteInferiorB"
        ]
      },
      "appearance": {
        "strokeWidth": 1.4,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "fileteVerticalA",
      "label": "fileteVerticalA",
      "color": "carbon",
      "layerId": "helpers",
      "order": 10,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3.35,
        "y": 1.3
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
      "id": "fileteVerticalB",
      "label": "fileteVerticalB",
      "color": "carbon",
      "layerId": "helpers",
      "order": 11,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3.35,
        "y": -2.7
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
      "id": "fileteVertical",
      "label": "fileteVertical",
      "color": "carbon",
      "layerId": "table",
      "order": 12,
      "visible": true,
      "locked": false,
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
          "fileteVerticalA",
          "fileteVerticalB"
        ]
      },
      "appearance": {
        "strokeWidth": 1.4,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "filaInterior1A",
      "label": "filaInterior1A",
      "color": "carbon",
      "layerId": "helpers",
      "order": 13,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3.35,
        "y": -0.7
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
      "id": "filaInterior1B",
      "label": "filaInterior1B",
      "color": "carbon",
      "layerId": "helpers",
      "order": 14,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -0.35,
        "y": -0.7
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
      "id": "filaInterior1",
      "label": "filaInterior1",
      "color": "carbon",
      "layerId": "table",
      "order": 15,
      "visible": true,
      "locked": false,
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
          "filaInterior1A",
          "filaInterior1B"
        ]
      },
      "appearance": {
        "strokeWidth": 0.8,
        "labelVisible": false,
        "preserveColorOnHighlight": true,
        "strokeOpacity": 0.4
      }
    },
    {
      "id": "columnaInterior1A",
      "label": "columnaInterior1A",
      "color": "carbon",
      "layerId": "helpers",
      "order": 16,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2.35,
        "y": 0.3
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
      "id": "columnaInterior1B",
      "label": "columnaInterior1B",
      "color": "carbon",
      "layerId": "helpers",
      "order": 17,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2.35,
        "y": -2.7
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
      "id": "columnaInterior1",
      "label": "columnaInterior1",
      "color": "carbon",
      "layerId": "table",
      "order": 18,
      "visible": true,
      "locked": false,
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
          "columnaInterior1A",
          "columnaInterior1B"
        ]
      },
      "appearance": {
        "strokeWidth": 0.8,
        "labelVisible": false,
        "preserveColorOnHighlight": true,
        "strokeOpacity": 0.4
      }
    },
    {
      "id": "filaInterior2A",
      "label": "filaInterior2A",
      "color": "carbon",
      "layerId": "helpers",
      "order": 19,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3.35,
        "y": -1.7
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
      "id": "filaInterior2B",
      "label": "filaInterior2B",
      "color": "carbon",
      "layerId": "helpers",
      "order": 20,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -0.35,
        "y": -1.7
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
      "id": "filaInterior2",
      "label": "filaInterior2",
      "color": "carbon",
      "layerId": "table",
      "order": 21,
      "visible": true,
      "locked": false,
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
          "filaInterior2A",
          "filaInterior2B"
        ]
      },
      "appearance": {
        "strokeWidth": 0.8,
        "labelVisible": false,
        "preserveColorOnHighlight": true,
        "strokeOpacity": 0.4
      }
    },
    {
      "id": "columnaInterior2A",
      "label": "columnaInterior2A",
      "color": "carbon",
      "layerId": "helpers",
      "order": 22,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -1.35,
        "y": 0.3
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
      "id": "columnaInterior2B",
      "label": "columnaInterior2B",
      "color": "carbon",
      "layerId": "helpers",
      "order": 23,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -1.35,
        "y": -2.7
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
      "id": "columnaInterior2",
      "label": "columnaInterior2",
      "color": "carbon",
      "layerId": "table",
      "order": 24,
      "visible": true,
      "locked": false,
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
          "columnaInterior2A",
          "columnaInterior2B"
        ]
      },
      "appearance": {
        "strokeWidth": 0.8,
        "labelVisible": false,
        "preserveColorOnHighlight": true,
        "strokeOpacity": 0.4
      }
    },
    {
      "id": "g00",
      "label": "g00",
      "color": "carbon",
      "layerId": "helpers",
      "order": 25,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3.35,
        "y": 0.3
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
      "id": "g01",
      "label": "g01",
      "color": "carbon",
      "layerId": "helpers",
      "order": 26,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2.35,
        "y": 0.3
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
      "id": "g02",
      "label": "g02",
      "color": "carbon",
      "layerId": "helpers",
      "order": 27,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -1.35,
        "y": 0.3
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
      "id": "g03",
      "label": "g03",
      "color": "carbon",
      "layerId": "helpers",
      "order": 28,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -0.35,
        "y": 0.3
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
      "id": "g10",
      "label": "g10",
      "color": "carbon",
      "layerId": "helpers",
      "order": 29,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3.35,
        "y": -0.7
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
      "id": "g11",
      "label": "g11",
      "color": "carbon",
      "layerId": "helpers",
      "order": 30,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2.35,
        "y": -0.7
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
      "id": "g12",
      "label": "g12",
      "color": "carbon",
      "layerId": "helpers",
      "order": 31,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -1.35,
        "y": -0.7
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
      "id": "g13",
      "label": "g13",
      "color": "carbon",
      "layerId": "helpers",
      "order": 32,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -0.35,
        "y": -0.7
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
      "id": "g20",
      "label": "g20",
      "color": "carbon",
      "layerId": "helpers",
      "order": 33,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3.35,
        "y": -1.7
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
      "id": "g21",
      "label": "g21",
      "color": "carbon",
      "layerId": "helpers",
      "order": 34,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2.35,
        "y": -1.7
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
      "id": "g22",
      "label": "g22",
      "color": "carbon",
      "layerId": "helpers",
      "order": 35,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -1.35,
        "y": -1.7
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
      "id": "g23",
      "label": "g23",
      "color": "carbon",
      "layerId": "helpers",
      "order": 36,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -0.35,
        "y": -1.7
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
      "id": "g30",
      "label": "g30",
      "color": "carbon",
      "layerId": "helpers",
      "order": 37,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3.35,
        "y": -2.7
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
      "id": "g31",
      "label": "g31",
      "color": "carbon",
      "layerId": "helpers",
      "order": 38,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2.35,
        "y": -2.7
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
      "id": "g32",
      "label": "g32",
      "color": "carbon",
      "layerId": "helpers",
      "order": 39,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -1.35,
        "y": -2.7
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
      "id": "g33",
      "label": "g33",
      "color": "carbon",
      "layerId": "helpers",
      "order": 40,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -0.35,
        "y": -2.7
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
      "id": "productoCartesiano",
      "label": "$S \\times S$",
      "color": "canela",
      "layerId": "table",
      "order": 41,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "secondary",
        "ariaLabel": "Casillas de la tabla: los pares de S × S"
      },
      "target": true,
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "g00",
          "g03",
          "g33",
          "g30"
        ]
      },
      "appearance": {
        "strokeWidth": 0,
        "fillOpacity": 0.05,
        "labelVisible": false,
        "preserveColorOnHighlight": true,
        "highlightFillOpacity": 0.18
      }
    },
    {
      "id": "fuera00",
      "label": "Casilla 0 * 0 fuera de S",
      "color": "granada",
      "layerId": "cells",
      "order": 42,
      "visible": true,
      "visibleWhen": "eq(c00, 3)",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "g00",
          "g01",
          "g11",
          "g10"
        ]
      },
      "appearance": {
        "strokeWidth": 0,
        "fillOpacity": 0.16,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "fuera01",
      "label": "Casilla 0 * 1 fuera de S",
      "color": "granada",
      "layerId": "cells",
      "order": 43,
      "visible": true,
      "visibleWhen": "eq(c01, 3)",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "g01",
          "g02",
          "g12",
          "g11"
        ]
      },
      "appearance": {
        "strokeWidth": 0,
        "fillOpacity": 0.16,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "fuera02",
      "label": "Casilla 0 * 2 fuera de S",
      "color": "granada",
      "layerId": "cells",
      "order": 44,
      "visible": true,
      "visibleWhen": "eq(c02, 3)",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "g02",
          "g03",
          "g13",
          "g12"
        ]
      },
      "appearance": {
        "strokeWidth": 0,
        "fillOpacity": 0.16,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "fuera10",
      "label": "Casilla 1 * 0 fuera de S",
      "color": "granada",
      "layerId": "cells",
      "order": 45,
      "visible": true,
      "visibleWhen": "eq(c10, 3)",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "g10",
          "g11",
          "g21",
          "g20"
        ]
      },
      "appearance": {
        "strokeWidth": 0,
        "fillOpacity": 0.16,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "fuera11",
      "label": "Casilla 1 * 1 fuera de S",
      "color": "granada",
      "layerId": "cells",
      "order": 46,
      "visible": true,
      "visibleWhen": "eq(c11, 3)",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "g11",
          "g12",
          "g22",
          "g21"
        ]
      },
      "appearance": {
        "strokeWidth": 0,
        "fillOpacity": 0.16,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "fuera12",
      "label": "Casilla 1 * 2 fuera de S",
      "color": "granada",
      "layerId": "cells",
      "order": 47,
      "visible": true,
      "visibleWhen": "eq(c12, 3)",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "g12",
          "g13",
          "g23",
          "g22"
        ]
      },
      "appearance": {
        "strokeWidth": 0,
        "fillOpacity": 0.16,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "fuera20",
      "label": "Casilla 2 * 0 fuera de S",
      "color": "granada",
      "layerId": "cells",
      "order": 48,
      "visible": true,
      "visibleWhen": "eq(c20, 3)",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "g20",
          "g21",
          "g31",
          "g30"
        ]
      },
      "appearance": {
        "strokeWidth": 0,
        "fillOpacity": 0.16,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "fuera21",
      "label": "Casilla 2 * 1 fuera de S",
      "color": "granada",
      "layerId": "cells",
      "order": 49,
      "visible": true,
      "visibleWhen": "eq(c21, 3)",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "g21",
          "g22",
          "g32",
          "g31"
        ]
      },
      "appearance": {
        "strokeWidth": 0,
        "fillOpacity": 0.16,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "fuera22",
      "label": "Casilla 2 * 2 fuera de S",
      "color": "granada",
      "layerId": "cells",
      "order": 50,
      "visible": true,
      "visibleWhen": "eq(c22, 3)",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "g22",
          "g23",
          "g33",
          "g32"
        ]
      },
      "appearance": {
        "strokeWidth": 0,
        "fillOpacity": 0.16,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "esquina",
      "label": "$*$",
      "color": "carbon",
      "layerId": "table",
      "order": 51,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction",
        "ariaLabel": "Símbolo de la operación"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3.85,
        "y": 0.8
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": true,
        "labelSize": 18,
        "labelPosition": "top",
        "labelOffset": [
          0,
          -11
        ],
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "cabeceraFila0",
      "label": "$0$",
      "color": "carbon",
      "layerId": "table",
      "order": 52,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction",
        "ariaLabel": "Primer operando 0"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3.85,
        "y": -0.2
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": true,
        "labelSize": 18,
        "labelPosition": "top",
        "labelOffset": [
          0,
          -11
        ],
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "cabeceraColumna0",
      "label": "$0$",
      "color": "carbon",
      "layerId": "table",
      "order": 53,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction",
        "ariaLabel": "Segundo operando 0"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2.85,
        "y": 0.8
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": true,
        "labelSize": 18,
        "labelPosition": "top",
        "labelOffset": [
          0,
          -11
        ],
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "cabeceraFila1",
      "label": "$1$",
      "color": "carbon",
      "layerId": "table",
      "order": 54,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction",
        "ariaLabel": "Primer operando 1"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3.85,
        "y": -1.2
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": true,
        "labelSize": 18,
        "labelPosition": "top",
        "labelOffset": [
          0,
          -11
        ],
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "cabeceraColumna1",
      "label": "$1$",
      "color": "carbon",
      "layerId": "table",
      "order": 55,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction",
        "ariaLabel": "Segundo operando 1"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -1.85,
        "y": 0.8
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": true,
        "labelSize": 18,
        "labelPosition": "top",
        "labelOffset": [
          0,
          -11
        ],
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "cabeceraFila2",
      "label": "$2$",
      "color": "carbon",
      "layerId": "table",
      "order": 56,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction",
        "ariaLabel": "Primer operando 2"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3.85,
        "y": -2.2
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": true,
        "labelSize": 18,
        "labelPosition": "top",
        "labelOffset": [
          0,
          -11
        ],
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "cabeceraColumna2",
      "label": "$2$",
      "color": "carbon",
      "layerId": "table",
      "order": 57,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction",
        "ariaLabel": "Segundo operando 2"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -0.85,
        "y": 0.8
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": true,
        "labelSize": 18,
        "labelPosition": "top",
        "labelOffset": [
          0,
          -11
        ],
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "centroS",
      "label": "centroS",
      "color": "carbon",
      "layerId": "set",
      "order": 58,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.35,
        "y": -1.2
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
      "id": "radioS",
      "label": "radioS",
      "color": "carbon",
      "layerId": "set",
      "order": 59,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 3.75,
        "y": -1.2
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
      "id": "conjuntoS",
      "label": "$S$",
      "color": "carbon",
      "layerId": "set",
      "order": 60,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "secondary",
        "ariaLabel": "Conjunto S = {0, 1, 2}"
      },
      "target": true,
      "objectType": "path",
      "geometry": {
        "type": "circle",
        "center": "centroS",
        "point": "radioS"
      },
      "appearance": {
        "strokeWidth": 1.6,
        "strokeOpacity": 0.75,
        "fillOpacity": 0.05,
        "labelVisible": false,
        "preserveColorOnHighlight": true,
        "highlightFillOpacity": 0.14
      }
    },
    {
      "id": "etiquetaS",
      "label": "$S$",
      "color": "carbon",
      "layerId": "table",
      "order": 61,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction",
        "ariaLabel": "Nombre del conjunto S"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 1.05,
        "y": -0.15
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": true,
        "labelSize": 18,
        "labelPosition": "top",
        "labelOffset": [
          0,
          -11
        ],
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "s0",
      "label": "$0$",
      "color": "carbon",
      "layerId": "set",
      "order": 62,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction",
        "ariaLabel": "Elemento 0 de S"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.35,
        "y": -0.3
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 5,
        "labelVisible": true,
        "labelSize": 16,
        "labelPosition": "rt",
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "s1",
      "label": "$1$",
      "color": "carbon",
      "layerId": "set",
      "order": 63,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction",
        "ariaLabel": "Elemento 1 de S"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.35,
        "y": -1.2
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 5,
        "labelVisible": true,
        "labelSize": 16,
        "labelPosition": "rt",
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "s2",
      "label": "$2$",
      "color": "carbon",
      "layerId": "set",
      "order": 64,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction",
        "ariaLabel": "Elemento 2 de S"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.35,
        "y": -2.1
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 5,
        "labelVisible": true,
        "labelSize": 16,
        "labelPosition": "rt",
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "elementoFuera",
      "label": "$3$",
      "color": "granada",
      "layerId": "set",
      "order": 65,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "secondary",
        "ariaLabel": "Elemento 3, que no está en S"
      },
      "target": true,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0.85,
        "y": 0.6
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 5,
        "labelVisible": true,
        "labelSize": 16,
        "labelPosition": "rt",
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "filaCandidata0",
      "label": "filaCandidata0",
      "color": "carbon",
      "layerId": "handles",
      "order": 66,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -4.73,
        "y": -0.2
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
      "id": "columnaCandidata0",
      "label": "columnaCandidata0",
      "color": "carbon",
      "layerId": "handles",
      "order": 67,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2.85,
        "y": -3.0
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
      "id": "filaCandidata1",
      "label": "filaCandidata1",
      "color": "carbon",
      "layerId": "handles",
      "order": 68,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -4.73,
        "y": -1.2
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
      "id": "columnaCandidata1",
      "label": "columnaCandidata1",
      "color": "carbon",
      "layerId": "handles",
      "order": 69,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -1.85,
        "y": -3.0
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
      "id": "filaCandidata2",
      "label": "filaCandidata2",
      "color": "carbon",
      "layerId": "handles",
      "order": 70,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -4.73,
        "y": -2.2
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
      "id": "columnaCandidata2",
      "label": "columnaCandidata2",
      "color": "carbon",
      "layerId": "handles",
      "order": 71,
      "visible": false,
      "locked": false,
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
        "y": -3.0
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
      "id": "par",
      "label": "par",
      "color": "carbon",
      "layerId": "helpers",
      "order": 72,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "round((-0.2 - elegirA.y) / 1.0)",
        "y": "round((elegirB.x - -2.85) / 1.0)",
        "fallback": [
          1,
          2
        ]
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
      "id": "valor",
      "label": "valor",
      "color": "carbon",
      "layerId": "helpers",
      "order": 73,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "eq(par.x,0)*eq(par.y,0)*c00+eq(par.x,0)*eq(par.y,1)*c01+eq(par.x,0)*eq(par.y,2)*c02+eq(par.x,1)*eq(par.y,0)*c10+eq(par.x,1)*eq(par.y,1)*c11+eq(par.x,1)*eq(par.y,2)*c12+eq(par.x,2)*eq(par.y,0)*c20+eq(par.x,2)*eq(par.y,1)*c21+eq(par.x,2)*eq(par.y,2)*c22",
        "y": "0",
        "fallback": [
          2,
          0
        ]
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
      "id": "cuentaFuera",
      "label": "cuentaFuera",
      "color": "carbon",
      "layerId": "helpers",
      "order": 74,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "eq(c00,3)+eq(c01,3)+eq(c02,3)+eq(c10,3)+eq(c11,3)+eq(c12,3)+eq(c20,3)+eq(c21,3)+eq(c22,3)",
        "y": "0",
        "fallback": [
          0,
          0
        ]
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
      "id": "origen",
      "label": "origen",
      "color": "carbon",
      "layerId": "helpers",
      "order": 75,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "(-2.85 + 1.0 * par.y) + 0.28",
        "y": "(-0.2 - 1.0 * par.x)",
        "fallback": [
          0,
          0
        ]
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
      "id": "destino",
      "label": "destino",
      "color": "carbon",
      "layerId": "helpers",
      "order": 76,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "2.35 + (-1.5) * eq(valor.x, 3)",
        "y": "(-0.3 - 0.9 * valor.x) * (1 - eq(valor.x, 3)) + 0.6 * eq(valor.x, 3)",
        "fallback": [
          0,
          0
        ]
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
      "id": "punta",
      "label": "punta",
      "color": "carbon",
      "layerId": "helpers",
      "order": 77,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "destino.x - 0.24 * (destino.x - origen.x) / hypot(destino.x - origen.x, destino.y - origen.y)",
        "y": "destino.y - 0.24 * (destino.y - origen.y) / hypot(destino.x - origen.x, destino.y - origen.y)",
        "fallback": [
          0,
          0
        ]
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
      "id": "elegidaNO",
      "label": "elegidaNO",
      "color": "carbon",
      "layerId": "helpers",
      "order": 78,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "(-2.85 + 1.0 * par.y) + -0.5",
        "y": "(-0.2 - 1.0 * par.x) + 0.5",
        "fallback": [
          0,
          0
        ]
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
      "id": "filaElegidaNO",
      "label": "filaElegidaNO",
      "color": "carbon",
      "layerId": "helpers",
      "order": 79,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-3.85 + -0.5",
        "y": "elegirA.y + 0.5",
        "fallback": [
          0,
          0
        ]
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
      "id": "columnaElegidaNO",
      "label": "columnaElegidaNO",
      "color": "carbon",
      "layerId": "helpers",
      "order": 80,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "elegirB.x + -0.5",
        "y": "0.8 + 0.5",
        "fallback": [
          0,
          0
        ]
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
      "id": "elegidaNE",
      "label": "elegidaNE",
      "color": "carbon",
      "layerId": "helpers",
      "order": 81,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "(-2.85 + 1.0 * par.y) + 0.5",
        "y": "(-0.2 - 1.0 * par.x) + 0.5",
        "fallback": [
          0,
          0
        ]
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
      "id": "filaElegidaNE",
      "label": "filaElegidaNE",
      "color": "carbon",
      "layerId": "helpers",
      "order": 82,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-3.85 + 0.5",
        "y": "elegirA.y + 0.5",
        "fallback": [
          0,
          0
        ]
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
      "id": "columnaElegidaNE",
      "label": "columnaElegidaNE",
      "color": "carbon",
      "layerId": "helpers",
      "order": 83,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "elegirB.x + 0.5",
        "y": "0.8 + 0.5",
        "fallback": [
          0,
          0
        ]
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
      "id": "elegidaSE",
      "label": "elegidaSE",
      "color": "carbon",
      "layerId": "helpers",
      "order": 84,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "(-2.85 + 1.0 * par.y) + 0.5",
        "y": "(-0.2 - 1.0 * par.x) + -0.5",
        "fallback": [
          0,
          0
        ]
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
      "id": "filaElegidaSE",
      "label": "filaElegidaSE",
      "color": "carbon",
      "layerId": "helpers",
      "order": 85,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-3.85 + 0.5",
        "y": "elegirA.y + -0.5",
        "fallback": [
          0,
          0
        ]
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
      "id": "columnaElegidaSE",
      "label": "columnaElegidaSE",
      "color": "carbon",
      "layerId": "helpers",
      "order": 86,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "elegirB.x + 0.5",
        "y": "0.8 + -0.5",
        "fallback": [
          0,
          0
        ]
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
      "id": "elegidaSO",
      "label": "elegidaSO",
      "color": "carbon",
      "layerId": "helpers",
      "order": 87,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "(-2.85 + 1.0 * par.y) + -0.5",
        "y": "(-0.2 - 1.0 * par.x) + -0.5",
        "fallback": [
          0,
          0
        ]
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
      "id": "filaElegidaSO",
      "label": "filaElegidaSO",
      "color": "carbon",
      "layerId": "helpers",
      "order": 88,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-3.85 + -0.5",
        "y": "elegirA.y + -0.5",
        "fallback": [
          0,
          0
        ]
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
      "id": "columnaElegidaSO",
      "label": "columnaElegidaSO",
      "color": "carbon",
      "layerId": "helpers",
      "order": 89,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "elegirB.x + -0.5",
        "y": "0.8 + -0.5",
        "fallback": [
          0,
          0
        ]
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
      "id": "cabeceraFilaElegida",
      "label": "Primer operando elegido",
      "color": "ocre",
      "layerId": "cells",
      "order": 90,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "filaElegidaNO",
          "filaElegidaNE",
          "filaElegidaSE",
          "filaElegidaSO"
        ]
      },
      "appearance": {
        "strokeWidth": 0,
        "fillOpacity": 0.18,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "cabeceraColumnaElegida",
      "label": "Segundo operando elegido",
      "color": "ocre",
      "layerId": "cells",
      "order": 91,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "columnaElegidaNO",
          "columnaElegidaNE",
          "columnaElegidaSE",
          "columnaElegidaSO"
        ]
      },
      "appearance": {
        "strokeWidth": 0,
        "fillOpacity": 0.18,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "casillaElegida",
      "label": "Casilla del par elegido",
      "color": "terracota",
      "layerId": "cells",
      "order": 92,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "secondary",
        "ariaLabel": "Casilla del par elegido"
      },
      "target": true,
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "elegidaNO",
          "elegidaNE",
          "elegidaSE",
          "elegidaSO"
        ]
      },
      "appearance": {
        "strokeWidth": 2,
        "fillOpacity": 0.06,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "flecha",
      "label": "Flecha del par elegido",
      "color": "terracota",
      "layerId": "arrows",
      "order": 93,
      "visible": true,
      "visibleWhen": "lt(valor.x, 2.5)",
      "locked": false,
      "groupIds": [
        "grupoFlecha"
      ],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "origen",
          "punta"
        ]
      },
      "appearance": {
        "strokeWidth": 2.2,
        "labelVisible": false,
        "preserveColorOnHighlight": true,
        "arrow": "end"
      }
    },
    {
      "id": "flechaFuera",
      "label": "Flecha del par elegido, fuera de S",
      "color": "granada",
      "layerId": "arrows",
      "order": 94,
      "visible": true,
      "visibleWhen": "gt(valor.x, 2.5)",
      "locked": false,
      "groupIds": [
        "grupoFlecha"
      ],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "origen",
          "punta"
        ]
      },
      "appearance": {
        "strokeWidth": 2.2,
        "labelVisible": false,
        "preserveColorOnHighlight": true,
        "arrow": "end"
      }
    },
    {
      "id": "elegirA",
      "label": "$a$",
      "color": "ocre",
      "layerId": "handles",
      "order": 95,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "primary",
        "ariaLabel": "Primer operando a: elige la fila"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -4.73,
        "y": -1.2
      },
      "mobility": {
        "type": "on-points",
        "points": [
          "filaCandidata0",
          "filaCandidata1",
          "filaCandidata2"
        ]
      },
      "appearance": {
        "size": 6,
        "labelVisible": true,
        "labelSize": 16,
        "labelPosition": "top",
        "highlightSize": 8,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "elegirB",
      "label": "$b$",
      "color": "ocre",
      "layerId": "handles",
      "order": 96,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "primary",
        "ariaLabel": "Segundo operando b: elige la columna"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -0.85,
        "y": -3.0
      },
      "mobility": {
        "type": "on-points",
        "points": [
          "columnaCandidata0",
          "columnaCandidata1",
          "columnaCandidata2"
        ]
      },
      "appearance": {
        "size": 6,
        "labelVisible": true,
        "labelSize": 16,
        "labelPosition": "rt",
        "highlightSize": 8,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "c00",
      "label": "Casilla $0 * 0$",
      "color": "terracota",
      "layerId": "controls",
      "order": 97,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "primary",
        "ariaLabel": "Casilla 0 ∗ 0: pulsa para cambiar su valor"
      },
      "target": false,
      "objectType": "control",
      "variant": "button",
      "position": [
        -2.85,
        -0.2
      ],
      "range": {
        "min": 0,
        "max": 3,
        "step": 1
      },
      "value": 0,
      "width": 0.92,
      "action": {
        "to": 3,
        "durationMs": 0,
        "easing": "linear",
        "behavior": "cycle",
        "valueLabels": [
          "$0$",
          "$1$",
          "$2$",
          "$3$"
        ]
      }
    },
    {
      "id": "c01",
      "label": "Casilla $0 * 1$",
      "color": "terracota",
      "layerId": "controls",
      "order": 98,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "primary",
        "ariaLabel": "Casilla 0 ∗ 1: pulsa para cambiar su valor"
      },
      "target": false,
      "objectType": "control",
      "variant": "button",
      "position": [
        -1.85,
        -0.2
      ],
      "range": {
        "min": 0,
        "max": 3,
        "step": 1
      },
      "value": 1,
      "width": 0.92,
      "action": {
        "to": 3,
        "durationMs": 0,
        "easing": "linear",
        "behavior": "cycle",
        "valueLabels": [
          "$0$",
          "$1$",
          "$2$",
          "$3$"
        ]
      }
    },
    {
      "id": "c02",
      "label": "Casilla $0 * 2$",
      "color": "terracota",
      "layerId": "controls",
      "order": 99,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "primary",
        "ariaLabel": "Casilla 0 ∗ 2: pulsa para cambiar su valor"
      },
      "target": false,
      "objectType": "control",
      "variant": "button",
      "position": [
        -0.85,
        -0.2
      ],
      "range": {
        "min": 0,
        "max": 3,
        "step": 1
      },
      "value": 2,
      "width": 0.92,
      "action": {
        "to": 3,
        "durationMs": 0,
        "easing": "linear",
        "behavior": "cycle",
        "valueLabels": [
          "$0$",
          "$1$",
          "$2$",
          "$3$"
        ]
      }
    },
    {
      "id": "c10",
      "label": "Casilla $1 * 0$",
      "color": "terracota",
      "layerId": "controls",
      "order": 100,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "primary",
        "ariaLabel": "Casilla 1 ∗ 0: pulsa para cambiar su valor"
      },
      "target": false,
      "objectType": "control",
      "variant": "button",
      "position": [
        -2.85,
        -1.2
      ],
      "range": {
        "min": 0,
        "max": 3,
        "step": 1
      },
      "value": 1,
      "width": 0.92,
      "action": {
        "to": 3,
        "durationMs": 0,
        "easing": "linear",
        "behavior": "cycle",
        "valueLabels": [
          "$0$",
          "$1$",
          "$2$",
          "$3$"
        ]
      }
    },
    {
      "id": "c11",
      "label": "Casilla $1 * 1$",
      "color": "terracota",
      "layerId": "controls",
      "order": 101,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "primary",
        "ariaLabel": "Casilla 1 ∗ 1: pulsa para cambiar su valor"
      },
      "target": false,
      "objectType": "control",
      "variant": "button",
      "position": [
        -1.85,
        -1.2
      ],
      "range": {
        "min": 0,
        "max": 3,
        "step": 1
      },
      "value": 1,
      "width": 0.92,
      "action": {
        "to": 3,
        "durationMs": 0,
        "easing": "linear",
        "behavior": "cycle",
        "valueLabels": [
          "$0$",
          "$1$",
          "$2$",
          "$3$"
        ]
      }
    },
    {
      "id": "c12",
      "label": "Casilla $1 * 2$",
      "color": "terracota",
      "layerId": "controls",
      "order": 102,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "primary",
        "ariaLabel": "Casilla 1 ∗ 2: pulsa para cambiar su valor"
      },
      "target": false,
      "objectType": "control",
      "variant": "button",
      "position": [
        -0.85,
        -1.2
      ],
      "range": {
        "min": 0,
        "max": 3,
        "step": 1
      },
      "value": 2,
      "width": 0.92,
      "action": {
        "to": 3,
        "durationMs": 0,
        "easing": "linear",
        "behavior": "cycle",
        "valueLabels": [
          "$0$",
          "$1$",
          "$2$",
          "$3$"
        ]
      }
    },
    {
      "id": "c20",
      "label": "Casilla $2 * 0$",
      "color": "terracota",
      "layerId": "controls",
      "order": 103,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "primary",
        "ariaLabel": "Casilla 2 ∗ 0: pulsa para cambiar su valor"
      },
      "target": false,
      "objectType": "control",
      "variant": "button",
      "position": [
        -2.85,
        -2.2
      ],
      "range": {
        "min": 0,
        "max": 3,
        "step": 1
      },
      "value": 2,
      "width": 0.92,
      "action": {
        "to": 3,
        "durationMs": 0,
        "easing": "linear",
        "behavior": "cycle",
        "valueLabels": [
          "$0$",
          "$1$",
          "$2$",
          "$3$"
        ]
      }
    },
    {
      "id": "c21",
      "label": "Casilla $2 * 1$",
      "color": "terracota",
      "layerId": "controls",
      "order": 104,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "primary",
        "ariaLabel": "Casilla 2 ∗ 1: pulsa para cambiar su valor"
      },
      "target": false,
      "objectType": "control",
      "variant": "button",
      "position": [
        -1.85,
        -2.2
      ],
      "range": {
        "min": 0,
        "max": 3,
        "step": 1
      },
      "value": 2,
      "width": 0.92,
      "action": {
        "to": 3,
        "durationMs": 0,
        "easing": "linear",
        "behavior": "cycle",
        "valueLabels": [
          "$0$",
          "$1$",
          "$2$",
          "$3$"
        ]
      }
    },
    {
      "id": "c22",
      "label": "Casilla $2 * 2$",
      "color": "terracota",
      "layerId": "controls",
      "order": 105,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "primary",
        "ariaLabel": "Casilla 2 ∗ 2: pulsa para cambiar su valor"
      },
      "target": false,
      "objectType": "control",
      "variant": "button",
      "position": [
        -0.85,
        -2.2
      ],
      "range": {
        "min": 0,
        "max": 3,
        "step": 1
      },
      "value": 2,
      "width": 0.92,
      "action": {
        "to": 3,
        "durationMs": 0,
        "easing": "linear",
        "behavior": "cycle",
        "valueLabels": [
          "$0$",
          "$1$",
          "$2$",
          "$3$"
        ]
      }
    },
    {
      "id": "anclaLectura",
      "label": "anclaLectura",
      "color": "carbon",
      "layerId": "annotations",
      "order": 106,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 1.6,
        "y": -3.22
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
      "id": "lectura",
      "label": "Lectura del par elegido",
      "color": "terracota",
      "layerId": "annotations",
      "order": 107,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction",
        "ariaLabel": "Par elegido y su imagen"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "label",
      "content": {
        "text": "({=par.x|precision:0}, {=par.y|precision:0}) ↦ {=valor.x|precision:0}"
      },
      "anchor": {
        "type": "object",
        "object": "anclaLectura",
        "offset": [
          0,
          0
        ]
      },
      "appearance": {
        "fontSize": 17,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "estadoOperacion",
      "label": "Estado: es operación sobre S",
      "color": "carbon",
      "layerId": "annotations",
      "order": 108,
      "visible": true,
      "visibleWhen": "lt(cuentaFuera.x, 0.5)",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "annotation",
        "ariaLabel": "Estado: es operación sobre S"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "",
        "blocks": [
          {
            "id": "estado",
            "text": "$*$ es una operación binaria sobre $S$.",
            "color": "musgo"
          }
        ]
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.5,
          0
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "estadoFuera",
      "label": "Estado: un resultado fuera de S",
      "color": "carbon",
      "layerId": "annotations",
      "order": 109,
      "visible": true,
      "visibleWhen": "gt(cuentaFuera.x, 0.5)",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "annotation",
        "ariaLabel": "Estado: un resultado fuera de S"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "",
        "blocks": [
          {
            "id": "estado",
            "text": "Algún $a * b$ no está en $S$.",
            "color": "granada"
          }
        ]
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.5,
          0
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [],
  "steps": [],
  "note": "Pulsa una casilla para cambiar su valor; arrastra a y b.",
  "translations": {
    "eu": {
      "title": "Eragiketa bitarra: taula funtzio gisa",
      "note": "Sakatu lauki bat balioa aldatzeko; arrastatu a eta b.",
      "labels": {
        "productoCartesiano": "$S \\times S$",
        "conjuntoS": "$S$",
        "flecha": "Aukeratutako bikotearen gezia",
        "flechaFuera": "Aukeratutako bikotearen gezia, $S$-tik kanpo",
        "c00": "$0 * 0$ laukia",
        "c01": "$0 * 1$ laukia",
        "c02": "$0 * 2$ laukia",
        "c10": "$1 * 0$ laukia",
        "c11": "$1 * 1$ laukia",
        "c12": "$1 * 2$ laukia",
        "c20": "$2 * 0$ laukia",
        "c21": "$2 * 1$ laukia",
        "c22": "$2 * 2$ laukia"
      },
      "blocks": {
        "estadoOperacion": {
          "estado": {
            "text": "$*$ $S$-ren gaineko eragiketa bitarra da."
          }
        },
        "estadoFuera": {
          "estado": {
            "text": "$a * b$ emaitzaren bat ez dago $S$ multzoan."
          }
        }
      },
      "ariaLabels": {
        "productoCartesiano": "Taularen laukiak: S × S multzoko bikoteak",
        "esquina": "Eragiketaren ikurra",
        "cabeceraFila0": "0 lehen eragigaia",
        "cabeceraFila1": "1 lehen eragigaia",
        "cabeceraFila2": "2 lehen eragigaia",
        "cabeceraColumna0": "0 bigarren eragigaia",
        "cabeceraColumna1": "1 bigarren eragigaia",
        "cabeceraColumna2": "2 bigarren eragigaia",
        "conjuntoS": "S = {0, 1, 2} multzoa",
        "etiquetaS": "S multzoaren izena",
        "s0": "S-ko 0 elementua",
        "s1": "S-ko 1 elementua",
        "s2": "S-ko 2 elementua",
        "elementoFuera": "3 elementua, S-n ez dagoena",
        "casillaElegida": "Aukeratutako bikotearen laukia",
        "elegirA": "a lehen eragigaia: aukeratu errenkada",
        "elegirB": "b bigarren eragigaia: aukeratu zutabea",
        "c00": "0 ∗ 0 laukia: sakatu balioa aldatzeko",
        "c01": "0 ∗ 1 laukia: sakatu balioa aldatzeko",
        "c02": "0 ∗ 2 laukia: sakatu balioa aldatzeko",
        "c10": "1 ∗ 0 laukia: sakatu balioa aldatzeko",
        "c11": "1 ∗ 1 laukia: sakatu balioa aldatzeko",
        "c12": "1 ∗ 2 laukia: sakatu balioa aldatzeko",
        "c20": "2 ∗ 0 laukia: sakatu balioa aldatzeko",
        "c21": "2 ∗ 1 laukia: sakatu balioa aldatzeko",
        "c22": "2 ∗ 2 laukia: sakatu balioa aldatzeko",
        "lectura": "Aukeratutako bikotea eta bere irudia",
        "estadoOperacion": "Egoera: S-ren gaineko eragiketa da",
        "estadoFuera": "Egoera: emaitza bat S-tik kanpo",
        "grupoFlecha": "Nabarmendu aukeratutako bikotearen gezia",
        "grupoValores": "Nabarmendu taularen balioak"
      }
    },
    "en": {
      "title": "Binary operation: the table as a function",
      "note": "Click any cell to change its value; drag a and b.",
      "labels": {
        "productoCartesiano": "$S \\times S$",
        "conjuntoS": "$S$",
        "flecha": "Arrow of the chosen pair",
        "flechaFuera": "Arrow of the chosen pair, outside $S$",
        "c00": "Cell $0 * 0$",
        "c01": "Cell $0 * 1$",
        "c02": "Cell $0 * 2$",
        "c10": "Cell $1 * 0$",
        "c11": "Cell $1 * 1$",
        "c12": "Cell $1 * 2$",
        "c20": "Cell $2 * 0$",
        "c21": "Cell $2 * 1$",
        "c22": "Cell $2 * 2$"
      },
      "blocks": {
        "estadoOperacion": {
          "estado": {
            "text": "$*$ is a binary operation on $S$."
          }
        },
        "estadoFuera": {
          "estado": {
            "text": "Some $a * b$ is not in $S$."
          }
        }
      },
      "ariaLabels": {
        "productoCartesiano": "Table cells: the pairs of S × S",
        "esquina": "Operation symbol",
        "cabeceraFila0": "First operand 0",
        "cabeceraFila1": "First operand 1",
        "cabeceraFila2": "First operand 2",
        "cabeceraColumna0": "Second operand 0",
        "cabeceraColumna1": "Second operand 1",
        "cabeceraColumna2": "Second operand 2",
        "conjuntoS": "Set S = {0, 1, 2}",
        "etiquetaS": "Name of the set S",
        "s0": "Element 0 of S",
        "s1": "Element 1 of S",
        "s2": "Element 2 of S",
        "elementoFuera": "Element 3, which is not in S",
        "casillaElegida": "Cell of the chosen pair",
        "elegirA": "First operand a: choose the row",
        "elegirB": "Second operand b: choose the column",
        "c00": "Cell 0 ∗ 0: press to change its value",
        "c01": "Cell 0 ∗ 1: press to change its value",
        "c02": "Cell 0 ∗ 2: press to change its value",
        "c10": "Cell 1 ∗ 0: press to change its value",
        "c11": "Cell 1 ∗ 1: press to change its value",
        "c12": "Cell 1 ∗ 2: press to change its value",
        "c20": "Cell 2 ∗ 0: press to change its value",
        "c21": "Cell 2 ∗ 1: press to change its value",
        "c22": "Cell 2 ∗ 2: press to change its value",
        "lectura": "Chosen pair and its image",
        "estadoOperacion": "Status: it is an operation on S",
        "estadoFuera": "Status: a result outside S",
        "grupoFlecha": "Highlight the arrow of the chosen pair",
        "grupoValores": "Highlight the table values"
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const OperacionBinariaTabla = () => <DiagramRenderer spec={OperacionBinariaTablaSpec} />;
