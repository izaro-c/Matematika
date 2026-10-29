import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const RelacionSimetricaSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Relación simétrica: cada flecha con su recíproca",
  "componentId": "relacion-simetrica",
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
      "id": "reciprocas",
      "label": "Pares recíprocos",
      "memberIds": [
        "flechaIba",
        "flechaIcb"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": true,
      "targetId": "reciprocas"
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
      "id": "flechaIabIni",
      "label": "flechaIabIni",
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
        "x": -2.194,
        "y": 0.236
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
        "x": -3.045,
        "y": -0.939
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
      "order": 12,
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
      "id": "flechaIbaIni",
      "label": "flechaIbaIni",
      "color": "carbon",
      "layerId": "construction",
      "order": 13,
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
        "x": -3.256,
        "y": -0.786
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
      "id": "flechaIbaFin",
      "label": "flechaIbaFin",
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
        "x": -2.405,
        "y": 0.389
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
      "id": "flechaIba",
      "label": "flechaIba",
      "color": "mora",
      "layerId": "relation",
      "order": 15,
      "visible": true,
      "locked": true,
      "groupIds": [
        "reciprocas"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary",
        "ariaLabel": "Par (b, a)"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "flechaIbaIni",
          "flechaIbaFin"
        ]
      },
      "appearance": {
        "strokeWidth": 2,
        "arrow": "end"
      }
    },
    {
      "id": "flechaIbcIni",
      "label": "flechaIbcIni",
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
        "x": -3.08,
        "y": -0.87
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
      "id": "flechaIbcFin",
      "label": "flechaIbcFin",
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
        "x": -1.32,
        "y": -0.87
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
      "id": "flechaIbc",
      "label": "flechaIbc",
      "color": "carbon",
      "layerId": "relation",
      "order": 18,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "secondary",
        "ariaLabel": "Par (b, c)"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "flechaIbcIni",
          "flechaIbcFin"
        ]
      },
      "appearance": {
        "strokeWidth": 2,
        "arrow": "end"
      }
    },
    {
      "id": "flechaIcbIni",
      "label": "flechaIcbIni",
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
        "x": -1.32,
        "y": -1.13
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
      "id": "flechaIcbFin",
      "label": "flechaIcbFin",
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
        "x": -3.08,
        "y": -1.13
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
      "id": "flechaIcb",
      "label": "flechaIcb",
      "color": "mora",
      "layerId": "relation",
      "order": 21,
      "visible": true,
      "locked": true,
      "groupIds": [
        "reciprocas"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary",
        "ariaLabel": "Par (c, b)"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "flechaIcbIni",
          "flechaIcbFin"
        ]
      },
      "appearance": {
        "strokeWidth": 2,
        "arrow": "end"
      }
    },
    {
      "id": "flechaDabIni",
      "label": "flechaDabIni",
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
        "x": 2.206,
        "y": 0.236
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
        "x": 1.355,
        "y": -0.939
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
      "id": "flechaDbaIni",
      "label": "flechaDbaIni",
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
        "x": 1.144,
        "y": -0.786
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
      "id": "flechaDbaFin",
      "label": "flechaDbaFin",
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
        "x": 1.995,
        "y": 0.389
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
      "id": "flechaDba",
      "label": "flechaDba",
      "color": "mora",
      "layerId": "relation",
      "order": 27,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "secondary",
        "ariaLabel": "Par (b, a)"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "flechaDbaIni",
          "flechaDbaFin"
        ]
      },
      "appearance": {
        "strokeWidth": 2,
        "arrow": "end"
      }
    },
    {
      "id": "flechaDbcIni",
      "label": "flechaDbcIni",
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
        "x": 1.32,
        "y": -0.87
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
      "id": "flechaDbcFin",
      "label": "flechaDbcFin",
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
        "x": 3.08,
        "y": -0.87
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
      "id": "flechaDbc",
      "label": "flechaDbc",
      "color": "carbon",
      "layerId": "relation",
      "order": 30,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "secondary",
        "ariaLabel": "Par (b, c)"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "flechaDbcIni",
          "flechaDbcFin"
        ]
      },
      "appearance": {
        "strokeWidth": 2,
        "arrow": "end"
      }
    },
    {
      "id": "flechaDcbIni",
      "label": "flechaDcbIni",
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
        "x": 3.08,
        "y": -1.13
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
      "id": "flechaDcbFin",
      "label": "flechaDcbFin",
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
        "x": 1.32,
        "y": -1.13
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
      "id": "flechaDcb",
      "label": "flechaDcb",
      "color": "granada",
      "layerId": "relation",
      "order": 33,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "secondary",
        "ariaLabel": "Falta el par (c, b)"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "flechaDcbIni",
          "flechaDcbFin"
        ]
      },
      "appearance": {
        "strokeWidth": 2,
        "arrow": "end",
        "dashed": true
      }
    },
    {
      "id": "rotuloSi",
      "label": "Simétrica",
      "color": "musgo",
      "layerId": "annotations",
      "order": 34,
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
      "label": "No simétrica: falta (c, b)",
      "color": "granada",
      "layerId": "annotations",
      "order": 35,
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
  "note": "Cada flecha va de x a y si x R y. A la derecha, b R c no tiene su recíproca c R b.",
  "translations": {
    "eu": {
      "title": "Erlazio simetrikoa: gezi bakoitza bere alderantzizkoarekin",
      "note": "Gezi bat x-tik y-ra doa x R y bada. Eskuinean, b R c-k ez du bere alderantzizkoa, c R b.",
      "labels": {
        "reciprocas": "Alderantzizko bikoteak",
        "rotuloSi": "Simetrikoa",
        "rotuloNo": "Ez simetrikoa: (c, b) falta da"
      },
      "ariaLabels": {
        "ia": "a elementua",
        "ib": "b elementua",
        "ic": "c elementua",
        "da": "a elementua",
        "db": "b elementua",
        "dc": "c elementua",
        "flechaIab": "(a, b) bikotea",
        "flechaIba": "(b, a) bikotea",
        "flechaIbc": "(b, c) bikotea",
        "flechaIcb": "(c, b) bikotea",
        "flechaDab": "(a, b) bikotea",
        "flechaDba": "(b, a) bikotea",
        "flechaDbc": "(b, c) bikotea",
        "flechaDcb": "(c, b) bikotea falta da"
      }
    },
    "en": {
      "title": "Symmetric relation: every arrow with its reverse",
      "note": "An arrow goes from x to y when x R y. On the right, b R c has no reverse c R b.",
      "labels": {
        "reciprocas": "Reverse pairs",
        "rotuloSi": "Symmetric",
        "rotuloNo": "Not symmetric: (c, b) missing"
      },
      "ariaLabels": {
        "ia": "Element a",
        "ib": "Element b",
        "ic": "Element c",
        "da": "Element a",
        "db": "Element b",
        "dc": "Element c",
        "flechaIab": "Pair (a, b)",
        "flechaIba": "Pair (b, a)",
        "flechaIbc": "Pair (b, c)",
        "flechaIcb": "Pair (c, b)",
        "flechaDab": "Pair (a, b)",
        "flechaDba": "Pair (b, a)",
        "flechaDbc": "Pair (b, c)",
        "flechaDcb": "Missing pair (c, b)"
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const RelacionSimetrica = () => <DiagramRenderer spec={RelacionSimetricaSpec} />;
