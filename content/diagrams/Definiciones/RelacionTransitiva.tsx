import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const RelacionTransitivaSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Relación transitiva: el atajo de cada camino",
  "componentId": "relacion-transitiva",
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
      "id": "compuesta",
      "label": "Composición R ∘ R",
      "memberIds": [
        "flechaIac"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": true,
      "targetId": "compuesta"
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
      "id": "flechaIbcIni",
      "label": "flechaIbcIni",
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
        "x": -3.08,
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
      "id": "flechaIbcFin",
      "label": "flechaIbcFin",
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
        "x": -1.32,
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
      "id": "flechaIbc",
      "label": "flechaIbc",
      "color": "carbon",
      "layerId": "relation",
      "order": 15,
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
      "id": "flechaIacIni",
      "label": "flechaIacIni",
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
        "x": -2.1,
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
      "id": "flechaIacFin",
      "label": "flechaIacFin",
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
        "x": -1.25,
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
      "id": "flechaIac",
      "label": "flechaIac",
      "color": "mora",
      "layerId": "relation",
      "order": 18,
      "visible": true,
      "locked": true,
      "groupIds": [
        "compuesta"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary",
        "ariaLabel": "Par (a, c)"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "flechaIacIni",
          "flechaIacFin"
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
      "order": 21,
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
      "id": "flechaDbcIni",
      "label": "flechaDbcIni",
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
        "x": 1.32,
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
      "id": "flechaDbcFin",
      "label": "flechaDbcFin",
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
        "x": 3.08,
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
      "id": "flechaDbc",
      "label": "flechaDbc",
      "color": "carbon",
      "layerId": "relation",
      "order": 24,
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
      "id": "flechaDacIni",
      "label": "flechaDacIni",
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
        "x": 2.3,
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
      "id": "flechaDacFin",
      "label": "flechaDacFin",
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
        "x": 3.15,
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
      "id": "flechaDac",
      "label": "flechaDac",
      "color": "granada",
      "layerId": "relation",
      "order": 27,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "secondary",
        "ariaLabel": "Falta el par (a, c)"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "flechaDacIni",
          "flechaDacFin"
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
      "label": "Transitiva",
      "color": "musgo",
      "layerId": "annotations",
      "order": 28,
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
      "label": "No transitiva: falta (a, c)",
      "color": "granada",
      "layerId": "annotations",
      "order": 29,
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
  "note": "El camino a → b → c exige el atajo a → c. A la derecha falta, así que la relación no es transitiva.",
  "translations": {
    "eu": {
      "title": "Erlazio iragankorra: bide bakoitzaren lasterbidea",
      "note": "a → b → c bideak a → c lasterbidea eskatzen du. Eskuinean falta da; beraz, erlazioa ez da iragankorra.",
      "labels": {
        "compuesta": "R ∘ R konposizioa",
        "rotuloSi": "Iragankorra",
        "rotuloNo": "Ez iragankorra: (a, c) falta da"
      },
      "ariaLabels": {
        "ia": "a elementua",
        "ib": "b elementua",
        "ic": "c elementua",
        "da": "a elementua",
        "db": "b elementua",
        "dc": "c elementua",
        "flechaIab": "(a, b) bikotea",
        "flechaIbc": "(b, c) bikotea",
        "flechaIac": "(a, c) bikotea",
        "flechaDab": "(a, b) bikotea",
        "flechaDbc": "(b, c) bikotea",
        "flechaDac": "(a, c) bikotea falta da"
      }
    },
    "en": {
      "title": "Transitive relation: the shortcut of every path",
      "note": "The path a → b → c requires the shortcut a → c. It is missing on the right, so the relation is not transitive.",
      "labels": {
        "compuesta": "Composition R ∘ R",
        "rotuloSi": "Transitive",
        "rotuloNo": "Not transitive: (a, c) missing"
      },
      "ariaLabels": {
        "ia": "Element a",
        "ib": "Element b",
        "ic": "Element c",
        "da": "Element a",
        "db": "Element b",
        "dc": "Element c",
        "flechaIab": "Pair (a, b)",
        "flechaIbc": "Pair (b, c)",
        "flechaIac": "Pair (a, c)",
        "flechaDab": "Pair (a, b)",
        "flechaDbc": "Pair (b, c)",
        "flechaDac": "Missing pair (a, c)"
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const RelacionTransitiva = () => <DiagramRenderer spec={RelacionTransitivaSpec} />;
