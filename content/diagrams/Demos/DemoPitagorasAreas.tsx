import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const DemoPitagorasAreasSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Demostración visual de Pitágoras (Áreas)",
  "componentId": "demo-pitagoras-areas",
  "category": "Demos",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "showLabels": true,
  "header": {
    "readingsMode": "custom",
    "readings": []
  },
  "viewport": {
    "bounds": [
      -1.4,
      8.6,
      8.6,
      -2.4
    ],
    "home": [
      -1.4,
      8.6,
      8.6,
      -2.4
    ],
    "minZoom": 0.2,
    "maxZoom": 10,
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
      "label": "Anotaciones",
      "order": 1,
      "visible": true,
      "locked": false
    }
  ],
  "groups": [],
  "objects": [
    {
      "id": "pE1",
      "label": "E1",
      "color": "carbon",
      "layerId": "geometry",
      "order": 1,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "ariaLabel": "Vértice E1",
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0,
        "y": 0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
    },
    {
      "id": "pE2",
      "label": "E2",
      "color": "carbon",
      "layerId": "geometry",
      "order": 2,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "ariaLabel": "Vértice E2",
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 7,
        "y": 0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
    },
    {
      "id": "pE3",
      "label": "E3",
      "color": "carbon",
      "layerId": "geometry",
      "order": 3,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "ariaLabel": "Vértice E3",
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 7,
        "y": 7
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
    },
    {
      "id": "pE4",
      "label": "E4",
      "color": "carbon",
      "layerId": "geometry",
      "order": 4,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "ariaLabel": "Vértice E4",
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0,
        "y": 7
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
    },
    {
      "id": "c1",
      "label": "C1",
      "color": "ocre",
      "layerId": "geometry",
      "order": 10,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "ariaLabel": "Punto de división inferior C1",
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 3,
        "y": 0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
    },
    {
      "id": "c2",
      "label": "C2",
      "color": "ocre",
      "layerId": "geometry",
      "order": 11,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "ariaLabel": "Punto de división derecho C2",
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 7,
        "y": 3
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
    },
    {
      "id": "c3",
      "label": "C3",
      "color": "ocre",
      "layerId": "geometry",
      "order": 12,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "ariaLabel": "Punto de división superior C3",
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 4,
        "y": 7
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
    },
    {
      "id": "c4",
      "label": "C4",
      "color": "ocre",
      "layerId": "geometry",
      "order": 13,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "ariaLabel": "Punto de división izquierdo C4",
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0,
        "y": 4
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
    },
    {
      "id": "pMid",
      "label": "M",
      "color": "carbon",
      "layerId": "geometry",
      "order": 14,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "ariaLabel": "Punto interior de corte",
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 3,
        "y": 4
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
    },
    {
      "id": "pTopDiv",
      "label": "TD",
      "color": "carbon",
      "layerId": "geometry",
      "order": 15,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "ariaLabel": "Punto de división superior TD",
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 3,
        "y": 7
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
    },
    {
      "id": "pRightDiv",
      "label": "RD",
      "color": "carbon",
      "layerId": "geometry",
      "order": 16,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "ariaLabel": "Punto de división derecho RD",
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 7,
        "y": 4
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
    },
    {
      "id": "pT2_A",
      "label": "T2_A",
      "color": "carbon",
      "layerId": "geometry",
      "order": 17,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "ariaLabel": "Vértice móvil A del triángulo 2",
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "7",
        "y": "4 * animT",
        "fallback": [
          7,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
    },
    {
      "id": "pT2_B",
      "label": "T2_B",
      "color": "carbon",
      "layerId": "geometry",
      "order": 18,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "ariaLabel": "Vértice móvil B del triángulo 2",
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "7",
        "y": "3 + 4 * animT",
        "fallback": [
          7,
          3
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
    },
    {
      "id": "pT2_C",
      "label": "T2_C",
      "color": "carbon",
      "layerId": "geometry",
      "order": 19,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "ariaLabel": "Vértice móvil C del triángulo 2",
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "3",
        "y": "4 * animT",
        "fallback": [
          3,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
    },
    {
      "id": "pT3_A",
      "label": "T3_A",
      "color": "carbon",
      "layerId": "geometry",
      "order": 20,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "ariaLabel": "Vértice móvil A del triángulo 3",
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "7 - 4 * animT",
        "y": "7 - 3 * animT",
        "fallback": [
          7,
          7
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
    },
    {
      "id": "pT3_B",
      "label": "T3_B",
      "color": "carbon",
      "layerId": "geometry",
      "order": 21,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "ariaLabel": "Vértice móvil B del triángulo 3",
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "4 - 4 * animT",
        "y": "7 - 3 * animT",
        "fallback": [
          4,
          7
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
    },
    {
      "id": "pT3_C",
      "label": "T3_C",
      "color": "carbon",
      "layerId": "geometry",
      "order": 22,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "ariaLabel": "Vértice móvil C del triángulo 3",
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "7 - 4 * animT",
        "y": "3 - 3 * animT",
        "fallback": [
          7,
          3
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
    },
    {
      "id": "pT4_A",
      "label": "T4_A",
      "color": "carbon",
      "layerId": "geometry",
      "order": 23,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "ariaLabel": "Vértice móvil A del triángulo 4",
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "3 * animT",
        "y": "7",
        "fallback": [
          0,
          7
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
    },
    {
      "id": "pT4_B",
      "label": "T4_B",
      "color": "carbon",
      "layerId": "geometry",
      "order": 24,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "ariaLabel": "Vértice móvil B del triángulo 4",
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "3 * animT",
        "y": "4",
        "fallback": [
          0,
          4
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
    },
    {
      "id": "pT4_C",
      "label": "T4_C",
      "color": "carbon",
      "layerId": "geometry",
      "order": 25,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "ariaLabel": "Vértice móvil C del triángulo 4",
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "4 + 3 * animT",
        "y": "7",
        "fallback": [
          4,
          7
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
    },
    {
      "id": "outerSquare",
      "label": "Cuadrado exterior",
      "color": "carbon",
      "layerId": "geometry",
      "order": 5,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Cuadrado exterior de lado (a+b)",
        "role": "primary"
      },
      "target": true,
      "targetId": "outerSquare",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "pE1",
          "pE2",
          "pE3",
          "pE4"
        ]
      },
      "appearance": {
        "strokeWidth": 2.5,
        "fillOpacity": 0.04,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "t1",
      "label": "Triángulo T1",
      "color": "canela",
      "layerId": "geometry",
      "order": 26,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo rectángulo 1",
        "role": "secondary"
      },
      "target": true,
      "targetId": "t1",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "pE1",
          "c1",
          "c4"
        ]
      },
      "appearance": {
        "strokeWidth": 2,
        "fillOpacity": 0.35,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "t2",
      "label": "Triángulo T2",
      "color": "canela",
      "layerId": "geometry",
      "order": 27,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo rectángulo 2",
        "role": "secondary"
      },
      "target": true,
      "targetId": "t2",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "pT2_A",
          "pT2_B",
          "pT2_C"
        ]
      },
      "appearance": {
        "strokeWidth": 2,
        "fillOpacity": 0.35,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "t3",
      "label": "Triángulo T3",
      "color": "canela",
      "layerId": "geometry",
      "order": 28,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo rectángulo 3",
        "role": "secondary"
      },
      "target": true,
      "targetId": "t3",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "pT3_A",
          "pT3_B",
          "pT3_C"
        ]
      },
      "appearance": {
        "strokeWidth": 2,
        "fillOpacity": 0.35,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "t4",
      "label": "Triángulo T4",
      "color": "canela",
      "layerId": "geometry",
      "order": 29,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo rectángulo 4",
        "role": "secondary"
      },
      "target": true,
      "targetId": "t4",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "pT4_A",
          "pT4_B",
          "pT4_C"
        ]
      },
      "appearance": {
        "strokeWidth": 2,
        "fillOpacity": 0.35,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "emptyC",
      "label": "Cuadrado interior Qc (c²)",
      "color": "ocre",
      "layerId": "geometry",
      "order": 30,
      "visible": true,
      "visibleWhen": "lt(animT,0.02)",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Cuadrado interior central de área c²",
        "role": "primary"
      },
      "target": true,
      "targetId": "emptyC",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "c1",
          "c2",
          "c3",
          "c4"
        ]
      },
      "appearance": {
        "strokeWidth": 2.5,
        "fillOpacity": 0.45,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "emptyA",
      "label": "Cuadrado Qa (a²)",
      "color": "terracota",
      "layerId": "geometry",
      "order": 34,
      "visible": false,
      "visibleWhen": "gt(animT,0.98)",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Cuadrado interior Qa de área a²",
        "role": "primary"
      },
      "target": true,
      "targetId": "emptyA",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "c4",
          "pMid",
          "pTopDiv",
          "pE4"
        ]
      },
      "appearance": {
        "strokeWidth": 2.5,
        "fillOpacity": 0.45,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "emptyB",
      "label": "Cuadrado Qb (b²)",
      "color": "pavo",
      "layerId": "geometry",
      "order": 35,
      "visible": false,
      "visibleWhen": "gt(animT,0.98)",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Cuadrado interior Qb de área b²",
        "role": "primary"
      },
      "target": true,
      "targetId": "emptyB",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "c1",
          "pE2",
          "pRightDiv",
          "pMid"
        ]
      },
      "appearance": {
        "strokeWidth": 2.5,
        "fillOpacity": 0.45,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "dimB_left",
      "label": "b",
      "color": "carbon",
      "layerId": "annotations",
      "order": 52,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Cateto b vertical",
        "role": "secondary"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "dimension",
        "points": [
          "c4",
          "pE1"
        ],
        "offset": -0.33,
        "text": "b"
      },
      "appearance": {
        "strokeWidth": 1.5,
        "textOffset": [
          -0.5,
          0
        ],
        "labelSize": 25,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "dimA_left",
      "label": "a",
      "color": "carbon",
      "layerId": "annotations",
      "order": 53,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Cateto a vertical",
        "role": "secondary"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "dimension",
        "points": [
          "pE4",
          "c4"
        ],
        "offset": -0.43,
        "text": "a",
        "precision": 2
      },
      "appearance": {
        "strokeWidth": 1.5,
        "textOffset": [
          -0.45,
          0
        ],
        "labelSize": 25,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "dimSide_bottom",
      "label": "a + b",
      "color": "carbon",
      "layerId": "annotations",
      "order": 54,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado total del cuadrado exterior",
        "role": "primary"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "dimension",
        "points": [
          "pE1",
          "pE2"
        ],
        "offset": -0.35,
        "text": "a + b"
      },
      "appearance": {
        "strokeWidth": 1.5,
        "textOffset": [
          -0.35,
          -0.6
        ],
        "labelSize": 25,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "dimC",
      "label": "c",
      "color": "ocre",
      "layerId": "annotations",
      "order": 55,
      "visible": true,
      "visibleWhen": "lt(animT,0.02)",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Hipotenusa c",
        "role": "primary"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "dimension",
        "points": [
          "c4",
          "c1"
        ],
        "offset": -0.3,
        "text": "c"
      },
      "appearance": {
        "strokeWidth": 1.8,
        "textOffset": [
          -0.45,
          -0.45
        ],
        "labelSize": 25,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "dimQa_side",
      "label": "a",
      "color": "terracota",
      "layerId": "annotations",
      "order": 56,
      "visible": false,
      "visibleWhen": "gt(animT,0.98)",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado a del cuadrado Qa",
        "role": "secondary"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "dimension",
        "points": [
          "pE4",
          "pTopDiv"
        ],
        "offset": 0.35,
        "text": "a"
      },
      "appearance": {
        "strokeWidth": 1.5,
        "textOffset": [
          0,
          0.2
        ],
        "labelSize": 25,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "dimQb_side",
      "label": "b",
      "color": "pavo",
      "layerId": "annotations",
      "order": 57,
      "visible": false,
      "visibleWhen": "gt(animT,0.98)",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado b del cuadrado Qb",
        "role": "secondary"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "dimension",
        "points": [
          "pE2",
          "pRightDiv"
        ],
        "offset": -0.35,
        "text": "b"
      },
      "appearance": {
        "strokeWidth": 1.5,
        "textOffset": [
          0.3,
          0
        ],
        "labelSize": 25,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "animT",
      "label": "t",
      "color": "terracota",
      "layerId": "annotations",
      "order": 0,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Deslizamiento continuo de las piezas",
        "role": "primary"
      },
      "target": false,
      "objectType": "control",
      "variant": "slider",
      "position": [
        1.2,
        -1.7
      ],
      "range": {
        "min": 0,
        "max": 1,
        "step": 0.01
      },
      "value": 0
    }
  ],
  "relations": [],
  "steps": [
    {
      "id": "step1",
      "label": "Construcción del cuadrado exterior",
      "description": "Se construye un cuadrado envolvente de lado a + b cuya área total es (a + b)² = a² + 2ab + b².",
      "visibleTargets": [
        "outerSquare"
      ],
      "durationMs": 1000,
      "objectStates": {
        "animT": {
          "value": 0
        },
        "outerSquare": {
          "visible": true,
          "emphasis": "primary"
        },
        "t1": {
          "visible": false
        },
        "t2": {
          "visible": false
        },
        "t3": {
          "visible": false
        },
        "t4": {
          "visible": false
        },
        "emptyC": {
          "visible": false
        },
        "emptyA": {
          "visible": false
        },
        "emptyB": {
          "visible": false
        },
        "dimB_left": {
          "visible": true,
          "emphasis": "secondary"
        },
        "dimA_left": {
          "visible": true,
          "emphasis": "secondary"
        },
        "dimSide_bottom": {
          "visible": true,
          "emphasis": "primary"
        },
        "dimC": {
          "visible": false
        },
        "dimQa_side": {
          "visible": false
        },
        "dimQb_side": {
          "visible": false
        }
      }
    },
    {
      "id": "step2",
      "label": "Disposición de los cuatro triángulos rectángulos",
      "description": "Se disponen cuatro triángulos rectángulos congruentes T₁, T₂, T₃, T₄ de catetos a y b en las cuatro esquinas, sumando un área combinada de 2ab.",
      "visibleTargets": [
        "t1",
        "t2",
        "t3",
        "t4"
      ],
      "durationMs": 1000,
      "objectStates": {
        "animT": {
          "value": 0
        },
        "outerSquare": {
          "visible": false,
          "emphasis": "none"
        },
        "t1": {
          "visible": true,
          "emphasis": "primary"
        },
        "t2": {
          "visible": true,
          "emphasis": "primary"
        },
        "t3": {
          "visible": true,
          "emphasis": "primary"
        },
        "t4": {
          "visible": true,
          "emphasis": "primary"
        },
        "emptyC": {
          "visible": false
        },
        "emptyA": {
          "visible": false
        },
        "emptyB": {
          "visible": false
        },
        "dimB_left": {
          "visible": true,
          "emphasis": "primary"
        },
        "dimA_left": {
          "visible": true,
          "emphasis": "primary"
        },
        "dimSide_bottom": {
          "visible": false
        },
        "dimC": {
          "visible": false
        },
        "dimQa_side": {
          "visible": false
        },
        "dimQb_side": {
          "visible": false
        }
      }
    },
    {
      "id": "step3",
      "label": "Caracterización del cuadrado interior",
      "description": "Las cuatro hipotenusas delimitan un cuadrado interior central Qc de lados de longitud c y ángulos rectos, cuya área es c².",
      "visibleTargets": [
        "t1",
        "t2",
        "t3",
        "t4",
        "emptyC"
      ],
      "durationMs": 1000,
      "objectStates": {
        "animT": {
          "value": 0
        },
        "outerSquare": {
          "visible": false,
          "emphasis": "none"
        },
        "t1": {
          "visible": true,
          "emphasis": "secondary"
        },
        "t2": {
          "visible": true,
          "emphasis": "secondary"
        },
        "t3": {
          "visible": true,
          "emphasis": "secondary"
        },
        "t4": {
          "visible": true,
          "emphasis": "secondary"
        },
        "emptyC": {
          "visible": true,
          "emphasis": "primary"
        },
        "emptyA": {
          "visible": false
        },
        "emptyB": {
          "visible": false
        },
        "dimB_left": {
          "visible": true,
          "emphasis": "secondary"
        },
        "dimA_left": {
          "visible": true,
          "emphasis": "secondary"
        },
        "dimSide_bottom": {
          "visible": false
        },
        "dimC": {
          "visible": true,
          "emphasis": "primary"
        },
        "dimQa_side": {
          "visible": false
        },
        "dimQb_side": {
          "visible": false
        }
      }
    },
    {
      "id": "step4",
      "label": "Aditividad del área",
      "description": "Por el teorema de aditividad, el área del cuadrado exterior equivale al área del cuadrado central más los cuatro triángulos: (a + b)² = c² + 2ab.",
      "visibleTargets": [
        "t1",
        "t2",
        "t3",
        "t4",
        "emptyC"
      ],
      "durationMs": 1000,
      "objectStates": {
        "animT": {
          "value": 0
        },
        "outerSquare": {
          "visible": false,
          "emphasis": "secondary"
        },
        "t1": {
          "visible": true,
          "emphasis": "secondary"
        },
        "t2": {
          "visible": true,
          "emphasis": "secondary"
        },
        "t3": {
          "visible": true,
          "emphasis": "secondary"
        },
        "t4": {
          "visible": true,
          "emphasis": "secondary"
        },
        "emptyC": {
          "visible": true,
          "emphasis": "primary"
        },
        "emptyA": {
          "visible": false
        },
        "emptyB": {
          "visible": false
        },
        "dimB_left": {
          "visible": true,
          "emphasis": "secondary"
        },
        "dimA_left": {
          "visible": true,
          "emphasis": "secondary"
        },
        "dimSide_bottom": {
          "visible": false
        },
        "dimC": {
          "visible": true,
          "emphasis": "secondary"
        },
        "dimQa_side": {
          "visible": false
        },
        "dimQb_side": {
          "visible": false
        }
      }
    },
    {
      "id": "step5",
      "label": "Deslizamiento, simplificación y conclusión",
      "description": "Al deslizar y reagrupar los cuatro triángulos en dos rectángulos a×b, las piezas revelan dos cuadrados interiores Qa (área a²) y Qb (área b²), concluyendo a² + b² = c².",
      "visibleTargets": [
        "outerSquare",
        "t1",
        "t2",
        "t3",
        "t4",
        "emptyA",
        "emptyB"
      ],
      "durationMs": 1200,
      "objectStates": {
        "animT": {
          "value": 1
        },
        "outerSquare": {
          "visible": true,
          "emphasis": "none"
        },
        "t1": {
          "visible": true,
          "emphasis": "secondary"
        },
        "t2": {
          "visible": true,
          "emphasis": "secondary"
        },
        "t3": {
          "visible": true,
          "emphasis": "secondary"
        },
        "t4": {
          "visible": true,
          "emphasis": "secondary"
        },
        "emptyC": {
          "visible": false
        },
        "emptyA": {
          "visible": true,
          "emphasis": "primary"
        },
        "emptyB": {
          "visible": true,
          "emphasis": "primary"
        },
        "dimB_left": {
          "visible": true,
          "emphasis": "secondary"
        },
        "dimA_left": {
          "visible": true,
          "emphasis": "secondary"
        },
        "dimSide_bottom": {
          "visible": false
        },
        "dimC": {
          "visible": false
        },
        "dimQa_side": {
          "visible": true,
          "emphasis": "primary"
        },
        "dimQb_side": {
          "visible": true,
          "emphasis": "primary"
        }
      }
    }
  ],
  "note": "Avanza por los pasos o arrastra el deslizador t para observar cómo las piezas se deslizan continuamente desde la configuración c² hasta revelar a² y b².",
  "translations": {
    "eu": {
      "title": "Pitagorasen frogapen bisuala (Azalerak)",
      "note": "Aurreikusi urratsak edo arrastatu t kontrola ikusteko nola piezak etengabe irristatzen diren c² konfiguraziotik a² eta b² agerian utzi arte.",
      "steps": {
        "step1": {
          "label": "Kanpoko karratuaren eraikuntza",
          "description": "a + b aldeko karratu biltzailea eraikitzen da; bere azalera osoa (a + b)² = a² + 2ab + b² da."
        },
        "step2": {
          "label": "Lau triangelu angeluzuzenen kokapena",
          "description": "Lau ertzetan a eta b katetoko lau triangelu kongruente ezartzen dira, haien azalera bateratua 2ab izanik."
        },
        "step3": {
          "label": "Barne-karratuaren ezaugarritzea",
          "description": "Lau hipotenusek c aldeko Qc barne-karratua mugatzen dute, bere azalera c² izanik."
        },
        "step4": {
          "label": "Azaleraren aditibitatea",
          "description": "Aditibitate-teoremagatik, kanpoko karratuaren azalera barne-karratuaren eta lau triangeluen batura da: (a + b)² = c² + 2ab."
        },
        "step5": {
          "label": "Irristatzea, sinplifikazioa eta ondorioa",
          "description": "Lau triangeluak a×b bi angeluzuzenetan irristatuz eta berrantolatuz, agerian gelditzen dira Qa (a²) eta Qb (b²) barne-karratuak: a² + b² = c²."
        }
      },
      "ariaLabels": {
        "pE1": "E1 erpina",
        "pE2": "E2 erpina",
        "pE3": "E3 erpina",
        "pE4": "E4 erpina",
        "c1": "Beheko zatiketa-puntua C1",
        "c2": "Eskuineko zatiketa-puntua C2",
        "c3": "Goiko zatiketa-puntua C3",
        "c4": "Ezkerreko zatiketa-puntua C4",
        "pMid": "Barneko ebaki-puntua",
        "pTopDiv": "Goiko zatiketa-puntua TD",
        "pRightDiv": "Eskuineko zatiketa-puntua RD",
        "pT2_A": "2. triangeluaren A erpin mugikorra",
        "pT2_B": "2. triangeluaren B erpin mugikorra",
        "pT2_C": "2. triangeluaren C erpin mugikorra",
        "pT3_A": "3. triangeluaren A erpin mugikorra",
        "pT3_B": "3. triangeluaren B erpin mugikorra",
        "pT3_C": "3. triangeluaren C erpin mugikorra",
        "pT4_A": "4. triangeluaren A erpin mugikorra",
        "pT4_B": "4. triangeluaren B erpin mugikorra",
        "pT4_C": "4. triangeluaren C erpin mugikorra",
        "outerSquare": "(a+b) aldeko kanpo-karratua",
        "t1": "1. triangelu zuzena",
        "t2": "2. triangelu zuzena",
        "t3": "3. triangelu zuzena",
        "t4": "4. triangelu zuzena",
        "emptyC": "c² azalerako erdiko barne-karratua",
        "emptyA": "a² azalerako Qa barne-karratua",
        "emptyB": "b² azalerako Qb barne-karratua",
        "dimB_left": "b kateto bertikala",
        "dimA_left": "a kateto bertikala",
        "dimSide_bottom": "Kanpo-karratuaren alde osoa",
        "dimC": "c hipotenusa",
        "dimQa_side": "Qa karratuaren a aldea",
        "dimQb_side": "Qb karratuaren b aldea",
        "animT": "Piezen lerratze jarraitua"
      }
    },
    "en": {
      "title": "Visual Proof of the Pythagorean Theorem (Areas)",
      "note": "Step through the proof or drag slider t to see the pieces slide continuously from the c² configuration to reveal a² and b².",
      "steps": {
        "step1": {
          "label": "Construction of the outer square",
          "description": "An enclosing outer square of side a + b is constructed; its total area is (a + b)² = a² + 2ab + b²."
        },
        "step2": {
          "label": "Placement of the four right triangles",
          "description": "Four congruent right triangles of legs a and b are placed in the four corners, giving a combined area of 2ab."
        },
        "step3": {
          "label": "Characterization of the interior square",
          "description": "The four hypotenuses enclose a central interior square Qc with sides of length c and area c²."
        },
        "step4": {
          "label": "Area additivity",
          "description": "By the area additivity theorem, the outer square equals the interior square plus the four triangles: (a + b)² = c² + 2ab."
        },
        "step5": {
          "label": "Sliding, simplification, and conclusion",
          "description": "Sliding and rearranging the four triangles into two a×b rectangles exposes interior squares Qa (area a²) and Qb (area b²), proving a² + b² = c²."
        }
      },
      "ariaLabels": {
        "pE1": "Vertex E1",
        "pE2": "Vertex E2",
        "pE3": "Vertex E3",
        "pE4": "Vertex E4",
        "c1": "Lower division point C1",
        "c2": "Right division point C2",
        "c3": "Upper division point C3",
        "c4": "Left division point C4",
        "pMid": "Interior cut point",
        "pTopDiv": "Upper division point TD",
        "pRightDiv": "Right division point RD",
        "pT2_A": "Movable vertex A of triangle 2",
        "pT2_B": "Movable vertex B of triangle 2",
        "pT2_C": "Movable vertex C of triangle 2",
        "pT3_A": "Movable vertex A of triangle 3",
        "pT3_B": "Movable vertex B of triangle 3",
        "pT3_C": "Movable vertex C of triangle 3",
        "pT4_A": "Movable vertex A of triangle 4",
        "pT4_B": "Movable vertex B of triangle 4",
        "pT4_C": "Movable vertex C of triangle 4",
        "outerSquare": "Outer square of side (a+b)",
        "t1": "Right triangle 1",
        "t2": "Right triangle 2",
        "t3": "Right triangle 3",
        "t4": "Right triangle 4",
        "emptyC": "Central inner square of area c²",
        "emptyA": "Inner square Qa of area a²",
        "emptyB": "Inner square Qb of area b²",
        "dimB_left": "Vertical leg b",
        "dimA_left": "Vertical leg a",
        "dimSide_bottom": "Full side of the outer square",
        "dimC": "Hypotenuse c",
        "dimQa_side": "Side a of the square Qa",
        "dimQb_side": "Side b of the square Qb",
        "animT": "Continuous sliding of the pieces"
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const DemoPitagorasAreas = () => <DiagramRenderer spec={DemoPitagorasAreasSpec} />;
