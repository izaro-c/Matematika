import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const PaschSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Axioma de Orden IV (de Pasch)",
  "componentId": "axioma-de-orden-iv-de-pasch",
  "category": "Axiomas",
  "mode": "simulation",
  "axis": false,
  "grid": false,
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
  "groups": [
    {
      "id": "groupQ",
      "label": "Punto Q",
      "memberIds": [
        "intQCA",
        "intQBC"
      ],
      "visible": true,
      "locked": true,
      "selection": {
        "selectable": true,
        "role": "primary"
      },
      "target": true,
      "targetId": "pQ",
      "color": "terracota"
    }
  ],
  "objects": [
    {
      "id": "pA",
      "label": "A",
      "color": "ocre",
      "layerId": "geometry",
      "order": 19001,
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
        "x": -0.56,
        "y": 4.25
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 7,
        "highlightSize": 10
      },
      "interaction": {}
    },
    {
      "id": "pB",
      "label": "B",
      "color": "ocre",
      "layerId": "geometry",
      "order": 20001,
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
        "x": -2.41,
        "y": -3.04
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 7,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pC",
      "label": "C",
      "color": "ocre",
      "layerId": "geometry",
      "order": 7001,
      "visible": true,
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
        "type": "coordinates",
        "x": 5.18,
        "y": -0.38
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 7,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pP",
      "label": "P",
      "color": "terracota",
      "layerId": "geometry",
      "order": 21001,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": false,
        "ariaLabel": "Punto D",
        "role": "primary"
      },
      "target": true,
      "targetId": "pP",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -1.3618042449077725,
        "y": 1.0904578673634262
      },
      "mobility": {
        "type": "on-support",
        "support": "segAB"
      },
      "appearance": {
        "size": 7,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pDir",
      "label": "dir",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 22001,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": false,
        "ariaLabel": "Punto D",
        "role": "primary"
      },
      "target": true,
      "targetId": "pDir",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -6.35,
        "y": 3.34
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 4,
        "highlightSize": 4,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "polyTriangulo",
      "label": "Triángulo",
      "color": "ocre",
      "layerId": "geometry",
      "order": 1000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": false,
        "ariaLabel": "Triángulo",
        "role": "secondary"
      },
      "target": true,
      "targetId": "triangle",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "pA",
          "pB",
          "pC"
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segAB",
      "label": "Lado AB",
      "color": "ocre",
      "layerId": "geometry",
      "order": 1000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado AB",
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
      "appearance": {}
    },
    {
      "id": "segBC",
      "label": "Lado BC",
      "color": "ocre",
      "layerId": "geometry",
      "order": 15001,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado BC",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segBC",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pB",
          "pC"
        ]
      },
      "appearance": {}
    },
    {
      "id": "segCA",
      "label": "Lado CA",
      "color": "ocre",
      "layerId": "geometry",
      "order": 1000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado CA",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segCA",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pC",
          "pA"
        ]
      },
      "appearance": {}
    },
    {
      "id": "lineDirP",
      "label": "Recta",
      "color": "pizarra",
      "layerId": "geometry",
      "order": -1000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta",
        "role": "secondary"
      },
      "target": true,
      "targetId": "lineL",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "through-points",
          "points": [
            "pDir",
            "pP"
          ]
        }
      },
      "appearance": {
        "strokeWidth": 2,
        "highlightStrokeWidth": 2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "intQCA",
      "label": "Q",
      "color": "terracota",
      "layerId": "geometry",
      "order": 17001,
      "visible": true,
      "locked": true,
      "groupIds": [
        "groupQ"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Intersección Q sobre el lado CA",
        "role": "primary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "intersection",
        "supports": [
          "lineDirP",
          "segCA"
        ],
        "restrictToSupports": true
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 7,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "intQBC",
      "label": "Q",
      "color": "terracota",
      "layerId": "geometry",
      "order": 23001,
      "visible": true,
      "locked": true,
      "groupIds": [
        "groupQ"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Intersección Q sobre el lado BC",
        "role": "primary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "intersection",
        "supports": [
          "lineDirP",
          "segBC"
        ],
        "restrictToSupports": true
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 7,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segAC",
      "label": "Segmento",
      "color": "ocre",
      "layerId": "geometry",
      "order": 14001,
      "visible": true,
      "visibleWhen": "and(gte(((pC.x-pDir.x)*(pP.y-pDir.y)-(pC.y-pDir.y)*(pP.x-pDir.x))/((pP.x-pDir.x)*(pA.y-pC.y)-(pP.y-pDir.y)*(pA.x-pC.x)),-0.001),lte(((pC.x-pDir.x)*(pP.y-pDir.y)-(pC.y-pDir.y)*(pP.x-pDir.x))/((pP.x-pDir.x)*(pA.y-pC.y)-(pP.y-pDir.y)*(pA.x-pC.x)),1.001))",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segAC",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pA",
          "pC"
        ]
      },
      "appearance": {
        "strokeWidth": 5,
        "highlightStrokeWidth": 5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segBC_2",
      "label": "Segmento",
      "color": "ocre",
      "layerId": "geometry",
      "order": 13001,
      "visible": true,
      "visibleWhen": "and(gte(((pB.x-pDir.x)*(pP.y-pDir.y)-(pB.y-pDir.y)*(pP.x-pDir.x))/((pP.x-pDir.x)*(pC.y-pB.y)-(pP.y-pDir.y)*(pC.x-pB.x)),-0.001),lte(((pB.x-pDir.x)*(pP.y-pDir.y)-(pB.y-pDir.y)*(pP.x-pDir.x))/((pP.x-pDir.x)*(pC.y-pB.y)-(pP.y-pDir.y)*(pC.x-pB.x)),1.001))",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segBC_2",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pB",
          "pC"
        ]
      },
      "appearance": {
        "strokeWidth": 5,
        "highlightStrokeWidth": 5,
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [],
  "steps": [],
  "note": "Arrastre los puntos para explorar la figura."
}
);
/* @matematika-diagram-spec:end */

export const Pasch = () => <DiagramRenderer spec={PaschSpec} />;
