import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const RelacionEquivalenciaSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Relación de equivalencia: clases que parten el conjunto",
  "componentId": "relacion-equivalencia",
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
      "id": "regions",
      "label": "Clases",
      "order": 1,
      "visible": true,
      "locked": false
    },
    {
      "id": "relation",
      "label": "Pares de la relación",
      "order": 2,
      "visible": true,
      "locked": false
    },
    {
      "id": "elements",
      "label": "Elementos",
      "order": 3,
      "visible": true,
      "locked": false
    },
    {
      "id": "annotations",
      "label": "Rótulos",
      "order": 4,
      "visible": true,
      "locked": false
    }
  ],
  "groups": [
    {
      "id": "cociente",
      "label": "Conjunto cociente A/∼",
      "memberIds": [
        "clase1",
        "clase2",
        "clase3"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": true,
      "targetId": "cociente"
    }
  ],
  "objects": [
    {
      "id": "clase1Centro",
      "label": "clase1Centro",
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
        "x": -2.35,
        "y": -0.45
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
      "id": "clase1Borde",
      "label": "clase1Borde",
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
        "x": -0.85,
        "y": -0.45
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
      "id": "clase1",
      "label": "clase1",
      "color": "terracota",
      "layerId": "regions",
      "order": 3,
      "visible": true,
      "locked": true,
      "groupIds": [
        "cociente"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary",
        "ariaLabel": "Clase [a]"
      },
      "target": true,
      "objectType": "path",
      "geometry": {
        "type": "circle",
        "center": "clase1Centro",
        "point": "clase1Borde"
      },
      "appearance": {
        "strokeWidth": 1.4,
        "strokeOpacity": 0.55,
        "fillOpacity": 0.1
      }
    },
    {
      "id": "clase2Centro",
      "label": "clase2Centro",
      "color": "carbon",
      "layerId": "construction",
      "order": 4,
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
        "x": 0.75,
        "y": -0.45
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
      "id": "clase2Borde",
      "label": "clase2Borde",
      "color": "carbon",
      "layerId": "construction",
      "order": 5,
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
        "x": 1.8,
        "y": -0.45
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
      "id": "clase2",
      "label": "clase2",
      "color": "pavo",
      "layerId": "regions",
      "order": 6,
      "visible": true,
      "locked": true,
      "groupIds": [
        "cociente"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary",
        "ariaLabel": "Clase [d]"
      },
      "target": true,
      "objectType": "path",
      "geometry": {
        "type": "circle",
        "center": "clase2Centro",
        "point": "clase2Borde"
      },
      "appearance": {
        "strokeWidth": 1.4,
        "strokeOpacity": 0.55,
        "fillOpacity": 0.1
      }
    },
    {
      "id": "clase3Centro",
      "label": "clase3Centro",
      "color": "carbon",
      "layerId": "construction",
      "order": 7,
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
        "x": 2.95,
        "y": -0.45
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
      "id": "clase3Borde",
      "label": "clase3Borde",
      "color": "carbon",
      "layerId": "construction",
      "order": 8,
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
        "x": 3.75,
        "y": -0.45
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
      "id": "clase3",
      "label": "clase3",
      "color": "ocre",
      "layerId": "regions",
      "order": 9,
      "visible": true,
      "locked": true,
      "groupIds": [
        "cociente"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary",
        "ariaLabel": "Clase [f]"
      },
      "target": true,
      "objectType": "path",
      "geometry": {
        "type": "circle",
        "center": "clase3Centro",
        "point": "clase3Borde"
      },
      "appearance": {
        "strokeWidth": 1.4,
        "strokeOpacity": 0.55,
        "fillOpacity": 0.1
      }
    },
    {
      "id": "a",
      "label": "a",
      "color": "carbon",
      "layerId": "elements",
      "order": 10,
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
        "x": -2.35,
        "y": 0.2
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
      "id": "b",
      "label": "b",
      "color": "carbon",
      "layerId": "elements",
      "order": 11,
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
        "x": -2.95,
        "y": -0.8
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
      "id": "c",
      "label": "c",
      "color": "carbon",
      "layerId": "elements",
      "order": 12,
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
        "x": -1.75,
        "y": -0.8
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
      "id": "d",
      "label": "d",
      "color": "carbon",
      "layerId": "elements",
      "order": 13,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "primary",
        "ariaLabel": "Elemento d"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0.35,
        "y": -0.4
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
      "id": "e",
      "label": "e",
      "color": "carbon",
      "layerId": "elements",
      "order": 14,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "primary",
        "ariaLabel": "Elemento e"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 1.15,
        "y": -0.4
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
      "id": "f",
      "label": "f",
      "color": "carbon",
      "layerId": "elements",
      "order": 15,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "primary",
        "ariaLabel": "Elemento f"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.95,
        "y": -0.4
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
      "id": "lazoaCentro",
      "label": "lazoaCentro",
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
        "x": -2.35,
        "y": 0.5
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
      "id": "lazoaIni",
      "label": "lazoaIni",
      "color": "carbon",
      "layerId": "construction",
      "order": 17,
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
        "x": -2.191,
        "y": 0.246
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
      "id": "lazoaFin",
      "label": "lazoaFin",
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
        "x": -2.509,
        "y": 0.246
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
      "id": "lazoa",
      "label": "lazoa",
      "color": "carbon",
      "layerId": "relation",
      "order": 19,
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
          "lazoaCentro",
          "lazoaIni",
          "lazoaFin"
        ],
        "direction": "counterclockwise"
      },
      "appearance": {
        "strokeWidth": 2,
        "arrow": "end"
      }
    },
    {
      "id": "lazobCentro",
      "label": "lazobCentro",
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
        "x": -3.25,
        "y": -0.8
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
      "id": "lazobIni",
      "label": "lazobIni",
      "color": "carbon",
      "layerId": "construction",
      "order": 21,
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
        "x": -2.996,
        "y": -0.641
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
      "id": "lazobFin",
      "label": "lazobFin",
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
        "x": -2.996,
        "y": -0.959
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
      "id": "lazob",
      "label": "lazob",
      "color": "carbon",
      "layerId": "relation",
      "order": 23,
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
          "lazobCentro",
          "lazobIni",
          "lazobFin"
        ],
        "direction": "counterclockwise"
      },
      "appearance": {
        "strokeWidth": 2,
        "arrow": "end"
      }
    },
    {
      "id": "lazocCentro",
      "label": "lazocCentro",
      "color": "carbon",
      "layerId": "construction",
      "order": 24,
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
        "x": -1.45,
        "y": -0.8
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
      "id": "lazocIni",
      "label": "lazocIni",
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
        "x": -1.704,
        "y": -0.959
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
      "id": "lazocFin",
      "label": "lazocFin",
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
        "x": -1.704,
        "y": -0.641
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
      "id": "lazoc",
      "label": "lazoc",
      "color": "carbon",
      "layerId": "relation",
      "order": 27,
      "visible": true,
      "locked": true,
      "groupIds": [],
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
          "lazocCentro",
          "lazocIni",
          "lazocFin"
        ],
        "direction": "counterclockwise"
      },
      "appearance": {
        "strokeWidth": 2,
        "arrow": "end"
      }
    },
    {
      "id": "lazodCentro",
      "label": "lazodCentro",
      "color": "carbon",
      "layerId": "construction",
      "order": 28,
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
        "x": 0.05,
        "y": -0.4
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
      "id": "lazodIni",
      "label": "lazodIni",
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
        "x": 0.304,
        "y": -0.241
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
      "id": "lazodFin",
      "label": "lazodFin",
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
        "x": 0.304,
        "y": -0.559
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
      "id": "lazod",
      "label": "lazod",
      "color": "carbon",
      "layerId": "relation",
      "order": 31,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "secondary",
        "ariaLabel": "Par (d, d)"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "arc",
        "points": [
          "lazodCentro",
          "lazodIni",
          "lazodFin"
        ],
        "direction": "counterclockwise"
      },
      "appearance": {
        "strokeWidth": 2,
        "arrow": "end"
      }
    },
    {
      "id": "lazoeCentro",
      "label": "lazoeCentro",
      "color": "carbon",
      "layerId": "construction",
      "order": 32,
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
        "x": 1.45,
        "y": -0.4
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
      "id": "lazoeIni",
      "label": "lazoeIni",
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
        "x": 1.196,
        "y": -0.559
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
      "id": "lazoeFin",
      "label": "lazoeFin",
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
        "x": 1.196,
        "y": -0.241
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
      "id": "lazoe",
      "label": "lazoe",
      "color": "carbon",
      "layerId": "relation",
      "order": 35,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "secondary",
        "ariaLabel": "Par (e, e)"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "arc",
        "points": [
          "lazoeCentro",
          "lazoeIni",
          "lazoeFin"
        ],
        "direction": "counterclockwise"
      },
      "appearance": {
        "strokeWidth": 2,
        "arrow": "end"
      }
    },
    {
      "id": "lazofCentro",
      "label": "lazofCentro",
      "color": "carbon",
      "layerId": "construction",
      "order": 36,
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
        "x": 2.95,
        "y": -0.1
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
      "id": "lazofIni",
      "label": "lazofIni",
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
        "x": 3.109,
        "y": -0.354
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
      "id": "lazofFin",
      "label": "lazofFin",
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
        "x": 2.791,
        "y": -0.354
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
      "id": "lazof",
      "label": "lazof",
      "color": "carbon",
      "layerId": "relation",
      "order": 39,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "secondary",
        "ariaLabel": "Par (f, f)"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "arc",
        "points": [
          "lazofCentro",
          "lazofIni",
          "lazofFin"
        ],
        "direction": "counterclockwise"
      },
      "appearance": {
        "strokeWidth": 2,
        "arrow": "end"
      }
    },
    {
      "id": "flechaABIni",
      "label": "flechaABIni",
      "color": "carbon",
      "layerId": "construction",
      "order": 40,
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
        "x": -2.437,
        "y": 0.054
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
      "id": "flechaABFin",
      "label": "flechaABFin",
      "color": "carbon",
      "layerId": "construction",
      "order": 41,
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
        "x": -2.863,
        "y": -0.654
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
      "id": "flechaAB",
      "label": "flechaAB",
      "color": "carbon",
      "layerId": "relation",
      "order": 42,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "secondary",
        "ariaLabel": "Pares (a, b) y (b, a)"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "flechaABIni",
          "flechaABFin"
        ]
      },
      "appearance": {
        "strokeWidth": 2,
        "arrow": "both"
      }
    },
    {
      "id": "flechaACIni",
      "label": "flechaACIni",
      "color": "carbon",
      "layerId": "construction",
      "order": 43,
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
        "x": -2.263,
        "y": 0.054
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
      "id": "flechaACFin",
      "label": "flechaACFin",
      "color": "carbon",
      "layerId": "construction",
      "order": 44,
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
        "x": -1.837,
        "y": -0.654
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
      "id": "flechaAC",
      "label": "flechaAC",
      "color": "carbon",
      "layerId": "relation",
      "order": 45,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "secondary",
        "ariaLabel": "Pares (a, c) y (c, a)"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "flechaACIni",
          "flechaACFin"
        ]
      },
      "appearance": {
        "strokeWidth": 2,
        "arrow": "both"
      }
    },
    {
      "id": "flechaBCIni",
      "label": "flechaBCIni",
      "color": "carbon",
      "layerId": "construction",
      "order": 46,
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
        "x": -2.78,
        "y": -0.8
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
      "id": "flechaBCFin",
      "label": "flechaBCFin",
      "color": "carbon",
      "layerId": "construction",
      "order": 47,
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
        "x": -1.92,
        "y": -0.8
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
      "id": "flechaBC",
      "label": "flechaBC",
      "color": "carbon",
      "layerId": "relation",
      "order": 48,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "secondary",
        "ariaLabel": "Pares (b, c) y (c, b)"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "flechaBCIni",
          "flechaBCFin"
        ]
      },
      "appearance": {
        "strokeWidth": 2,
        "arrow": "both"
      }
    },
    {
      "id": "flechaDEIni",
      "label": "flechaDEIni",
      "color": "carbon",
      "layerId": "construction",
      "order": 49,
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
        "x": 0.52,
        "y": -0.4
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
      "id": "flechaDEFin",
      "label": "flechaDEFin",
      "color": "carbon",
      "layerId": "construction",
      "order": 50,
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
        "x": 0.98,
        "y": -0.4
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
      "id": "flechaDE",
      "label": "flechaDE",
      "color": "carbon",
      "layerId": "relation",
      "order": 51,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "secondary",
        "ariaLabel": "Pares (d, e) y (e, d)"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "flechaDEIni",
          "flechaDEFin"
        ]
      },
      "appearance": {
        "strokeWidth": 2,
        "arrow": "both"
      }
    },
    {
      "id": "rotulo1",
      "label": "[a] = {a, b, c}",
      "color": "terracota",
      "layerId": "annotations",
      "order": 52,
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
        "x": -2.35,
        "y": 1.3
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
      "id": "rotulo2",
      "label": "[d] = {d, e}",
      "color": "pavo",
      "layerId": "annotations",
      "order": 53,
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
        "x": 0.75,
        "y": 0.85
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
      "id": "rotulo3",
      "label": "[f] = {f}",
      "color": "ocre",
      "layerId": "annotations",
      "order": 54,
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
        "x": 2.95,
        "y": 0.6
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
  "note": "Cada elemento tiene su lazo y cada flecha va en los dos sentidos; ninguna sale de su clase.",
  "translations": {
    "eu": {
      "title": "Baliokidetasun-erlazioa: multzoa zatitzen duten klaseak",
      "note": "Elementu bakoitzak bere begizta du eta gezi bakoitzak bi noranzkoak; bat ere ez da bere klasetik ateratzen.",
      "labels": {
        "rotulo1": "[a] = {a, b, c}",
        "rotulo2": "[d] = {d, e}",
        "rotulo3": "[f] = {f}",
        "cociente": "A/∼ multzo zatidura"
      },
      "ariaLabels": {
        "clase1": "[a] klasea",
        "clase2": "[d] klasea",
        "clase3": "[f] klasea",
        "a": "a elementua",
        "b": "b elementua",
        "c": "c elementua",
        "d": "d elementua",
        "e": "e elementua",
        "f": "f elementua",
        "lazoa": "(a, a) bikotea",
        "lazob": "(b, b) bikotea",
        "lazoc": "(c, c) bikotea",
        "lazod": "(d, d) bikotea",
        "lazoe": "(e, e) bikotea",
        "lazof": "(f, f) bikotea",
        "flechaAB": "(a, b) eta (b, a) bikoteak",
        "flechaAC": "(a, c) eta (c, a) bikoteak",
        "flechaBC": "(b, c) eta (c, b) bikoteak",
        "flechaDE": "(d, e) eta (e, d) bikoteak"
      }
    },
    "en": {
      "title": "Equivalence relation: classes that partition the set",
      "note": "Every element has its loop and every arrow runs both ways; none leaves its class.",
      "labels": {
        "rotulo1": "[a] = {a, b, c}",
        "rotulo2": "[d] = {d, e}",
        "rotulo3": "[f] = {f}",
        "cociente": "Quotient set A/∼"
      },
      "ariaLabels": {
        "clase1": "Class [a]",
        "clase2": "Class [d]",
        "clase3": "Class [f]",
        "a": "Element a",
        "b": "Element b",
        "c": "Element c",
        "d": "Element d",
        "e": "Element e",
        "f": "Element f",
        "lazoa": "Pair (a, a)",
        "lazob": "Pair (b, b)",
        "lazoc": "Pair (c, c)",
        "lazod": "Pair (d, d)",
        "lazoe": "Pair (e, e)",
        "lazof": "Pair (f, f)",
        "flechaAB": "Pairs (a, b) and (b, a)",
        "flechaAC": "Pairs (a, c) and (c, a)",
        "flechaBC": "Pairs (b, c) and (c, b)",
        "flechaDE": "Pairs (d, e) and (e, d)"
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const RelacionEquivalencia = () => <DiagramRenderer spec={RelacionEquivalenciaSpec} />;
