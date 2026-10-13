import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const PuntoMedioPerpendicularSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Mediatriz",
  "componentId": "perpendicular",
  "category": "Teoremas",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "showLabels": true,
  "viewport": {
    "bounds": [
      -5,
      5,
      5,
      -5
    ],
    "home": [
      -5,
      5,
      5,
      -5
    ],
    "minZoom": 0.2,
    "maxZoom": 12,
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
      "id": "controls",
      "label": "Controles",
      "order": 1,
      "visible": true,
      "locked": false
    }
  ],
  "groups": [],
  "objects": [
    {
      "id": "pA",
      "label": "A",
      "color": "terracota",
      "layerId": "geometry",
      "order": 9000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto A",
        "role": "primary"
      },
      "target": true,
      "targetId": "pA",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3.35,
        "y": -2.79
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pB",
      "label": "B",
      "color": "terracota",
      "layerId": "geometry",
      "order": 8000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto B",
        "role": "primary"
      },
      "target": true,
      "targetId": "pB",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 3.83,
        "y": -0.7
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pP",
      "label": "P",
      "color": "musgo",
      "layerId": "geometry",
      "order": 10000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto P",
        "role": "primary"
      },
      "target": true,
      "targetId": "pP",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -1.1933190511529765,
        "y": 3.1790338695111826
      },
      "mobility": {
        "type": "on-support",
        "support": "lineMediatriz"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "p4",
      "label": "4",
      "color": "ocre",
      "layerId": "geometry",
      "order": 2000,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto 4",
        "role": "primary"
      },
      "target": false,
      "targetId": "p4",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0.2802461930667155,
        "y": 0.5189181708510687
      },
      "mobility": {
        "type": "constrained",
        "relationIds": [
          "p4-coincident-midAB"
        ]
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pM",
      "label": "M",
      "color": "terracota",
      "layerId": "geometry",
      "order": 14000,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto C",
        "role": "primary"
      },
      "target": true,
      "targetId": "pC",
      "objectType": "point",
      "definition": {
        "type": "midpoint",
        "points": [
          "pA",
          "pB"
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 7,
        "labelVisible": false,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segAB",
      "label": "Segmento AB",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento AB",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segAB",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pA",
          "pB"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "midAB",
      "label": "M",
      "color": "musgo",
      "layerId": "geometry",
      "order": 7000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto medio de AB",
        "role": "secondary"
      },
      "target": true,
      "targetId": "midAB",
      "objectType": "point",
      "definition": {
        "type": "midpoint",
        "points": [
          "pA",
          "pB"
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "lineMediatriz",
      "label": "Mediatriz de AB",
      "color": "musgo",
      "layerId": "geometry",
      "order": 1000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mediatriz de AB",
        "role": "secondary"
      },
      "target": true,
      "targetId": "lineMediatriz",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "perpendicular",
          "linePoints": [
            "pA",
            "pB"
          ],
          "through": "midAB"
        }
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segPA",
      "label": "Distancia PA",
      "color": "canela",
      "layerId": "geometry",
      "order": 1000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Distancia PA",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segPA",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pP",
          "pA"
        ]
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segPB",
      "label": "Distancia PB",
      "color": "canela",
      "layerId": "geometry",
      "order": 1000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Distancia PB",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segPB",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pP",
          "pB"
        ]
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "congruenceMarkA4",
      "label": "Marca de congruencia",
      "color": "terracota",
      "layerId": "geometry",
      "order": 5000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia",
        "role": "secondary"
      },
      "target": true,
      "targetId": "congruenceMarkA4",
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "pA",
          "p4"
        ]
      },
      "count": 1,
      "height": 0.5,
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "congruenceMark4B",
      "label": "Marca de congruencia",
      "color": "terracota",
      "layerId": "geometry",
      "order": 6000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia",
        "role": "secondary"
      },
      "target": true,
      "targetId": "congruenceMark4B",
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "p4",
          "pB"
        ]
      },
      "count": 1,
      "height": 0.5,
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "congruenceMarkPB",
      "label": "Marca de congruencia",
      "color": "ocre",
      "layerId": "geometry",
      "order": 11000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia",
        "role": "secondary"
      },
      "target": true,
      "targetId": "congruenceMarkPB",
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "pP",
          "pB"
        ]
      },
      "count": 2,
      "height": 0.5,
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "congruenceMarkAP",
      "label": "Marca de congruencia",
      "color": "ocre",
      "layerId": "geometry",
      "order": 12000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia",
        "role": "secondary"
      },
      "target": true,
      "targetId": "congruenceMarkAP",
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "pA",
          "pP"
        ]
      },
      "count": 2,
      "height": 0.5,
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "measurementPB",
      "label": "Medición",
      "color": "mora",
      "layerId": "geometry",
      "order": 13000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Medición",
        "role": "annotation"
      },
      "target": true,
      "targetId": "measurementPB",
      "objectType": "annotation",
      "variant": "measurement",
      "content": {
        "text": "PA = PB = {value}",
        "expression": "segPB.length",
        "unit": "u",
        "precision": 2
      },
      "anchor": {
        "type": "object",
        "object": "pP"
      },
      "measurement": {
        "refs": [
          "pP",
          "pB"
        ],
        "mode": "distance"
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "perpendicularMarkBMP",
      "label": "Marca de perpendicularidad",
      "color": "ocre",
      "layerId": "geometry",
      "order": 15000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de perpendicularidad",
        "role": "secondary"
      },
      "target": true,
      "targetId": "perpendicularMarkBMP",
      "objectType": "angle",
      "points": [
        "pB",
        "pM",
        "pP"
      ],
      "sweep": "non-reflex",
      "marker": "square",
      "perpendicularRelationId": "perpendicularMarkBMP-perpendicular",
      "appearance": {
        "radius": 1,
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [
    {
      "id": "p4-coincident-midAB",
      "label": "4 coincide con M",
      "enabled": true,
      "type": "coincident",
      "points": [
        "p4",
        "midAB"
      ]
    },
    {
      "id": "perpendicularMarkBMP-perpendicular",
      "label": "Perpendicularidad de Marca de perpendicularidad",
      "enabled": true,
      "type": "perpendicular",
      "supports": [
        [
          "pM",
          "pB"
        ],
        [
          "pM",
          "pP"
        ]
      ]
    }
  ],
  "steps": [],
  "note": "Arrastra P sobre la mediatriz para comprobar que equidista de los extremos A y B.",
  "translations": {
    "eu": {
      "title": "Erdibitzailea",
      "note": "Arrastatu P erdibitzailean zehar A eta B muturretatik distantzia berera dagoela egiaztatzeko.",
      "ariaLabels": {
        "pA": "A puntua",
        "pB": "B puntua",
        "pP": "P puntua",
        "p4": "4. puntua",
        "pM": "C puntua",
        "segAB": "AB segmentua",
        "midAB": "AB-ren erdiko puntua",
        "lineMediatriz": "AB-ren erdibitzaile perpendikularra",
        "segPA": "PA distantzia",
        "segPB": "PB distantzia",
        "congruenceMarkA4": "Kongruentzia-marka",
        "congruenceMark4B": "Kongruentzia-marka",
        "congruenceMarkPB": "Kongruentzia-marka",
        "congruenceMarkAP": "Kongruentzia-marka",
        "measurementPB": "Neurketa",
        "perpendicularMarkBMP": "Perpendikulartasun-marka"
      }
    },
    "en": {
      "title": "Perpendicular Bisector",
      "note": "Drag P along the perpendicular bisector to verify it is equidistant from endpoints A and B.",
      "ariaLabels": {
        "pA": "Point A",
        "pB": "Point B",
        "pP": "Point P",
        "p4": "Point 4",
        "pM": "Point C",
        "segAB": "Segment AB",
        "midAB": "Midpoint of AB",
        "lineMediatriz": "Perpendicular bisector of AB",
        "segPA": "Distance PA",
        "segPB": "Distance PB",
        "congruenceMarkA4": "Congruence mark",
        "congruenceMark4B": "Congruence mark",
        "congruenceMarkPB": "Congruence mark",
        "congruenceMarkAP": "Congruence mark",
        "measurementPB": "Measurement",
        "perpendicularMarkBMP": "Perpendicularity mark"
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const PuntoMedioPerpendicular = () => <DiagramRenderer spec={PuntoMedioPerpendicularSpec} />;
