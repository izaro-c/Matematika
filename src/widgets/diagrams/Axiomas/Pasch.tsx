import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const PaschSpec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
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
  "points": [
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
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10
      },
      "x": -0.56,
      "y": 4.25,
      "fixed": false,
      "constraint": "free"
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
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -2.41,
      "y": -3.04,
      "fixed": false,
      "constraint": "free"
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
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 5.18,
      "y": -0.38,
      "fixed": false,
      "constraint": "free"
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
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -1.3618042449077725,
      "y": 1.0904578673634262,
      "fixed": false,
      "constraint": "glider",
      "gliderTarget": "segAB"
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
      "style": {
        "pointSize": 4,
        "highlightPointSize": 4,
        "preserveColorOnHighlight": true
      },
      "x": -6.35,
      "y": 3.34,
      "fixed": false,
      "constraint": "free"
    }
  ],
  "elements": [
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
      "style": {
        "preserveColorOnHighlight": true
      },
      "kind": "polygon",
      "refs": [
        "pA",
        "pB",
        "pC"
      ],
      "properties": {}
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
      "kind": "segment",
      "refs": [
        "pA",
        "pB"
      ]
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
      "kind": "segment",
      "refs": [
        "pB",
        "pC"
      ]
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
      "kind": "segment",
      "refs": [
        "pC",
        "pA"
      ]
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
      "style": {
        "strokeWidth": 2,
        "highlightStrokeWidth": 2,
        "preserveColorOnHighlight": true
      },
      "kind": "line",
      "refs": [
        "pDir",
        "pP"
      ]
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
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "kind": "intersection",
      "refs": [
        "lineDirP",
        "segCA"
      ],
      "properties": {
        "restrictToSupports": true
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
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "kind": "intersection",
      "refs": [
        "lineDirP",
        "segBC"
      ],
      "properties": {
        "restrictToSupports": true
      }
    },
    {
      "id": "segAC",
      "label": "Segmento",
      "color": "ocre",
      "layerId": "geometry",
      "order": 14001,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segAC",
      "style": {
        "strokeWidth": 5,
        "highlightStrokeWidth": 5,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "pA",
        "pC"
      ],
      "properties": {
        "visibleWhen": "and(gte(((pC.x-pDir.x)*(pP.y-pDir.y)-(pC.y-pDir.y)*(pP.x-pDir.x))/((pP.x-pDir.x)*(pA.y-pC.y)-(pP.y-pDir.y)*(pA.x-pC.x)),-0.001),lte(((pC.x-pDir.x)*(pP.y-pDir.y)-(pC.y-pDir.y)*(pP.x-pDir.x))/((pP.x-pDir.x)*(pA.y-pC.y)-(pP.y-pDir.y)*(pA.x-pC.x)),1.001))"
      }
    },
    {
      "id": "segBC_2",
      "label": "Segmento",
      "color": "ocre",
      "layerId": "geometry",
      "order": 13001,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segBC_2",
      "style": {
        "strokeWidth": 5,
        "highlightStrokeWidth": 5,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "pB",
        "pC"
      ],
      "properties": {
        "visibleWhen": "and(gte(((pB.x-pDir.x)*(pP.y-pDir.y)-(pB.y-pDir.y)*(pP.x-pDir.x))/((pP.x-pDir.x)*(pC.y-pB.y)-(pP.y-pDir.y)*(pC.x-pB.x)),-0.001),lte(((pB.x-pDir.x)*(pP.y-pDir.y)-(pB.y-pDir.y)*(pP.x-pDir.x))/((pP.x-pDir.x)*(pC.y-pB.y)-(pP.y-pDir.y)*(pC.x-pB.x)),1.001))"
      }
    }
  ],
  "sliders": [],
  "steps": [],
  "constraints": [],
  "dependencies": [
    {
      "sourceId": "pDir",
      "targetId": "lineDirP",
      "relation": "construction"
    },
    {
      "sourceId": "pP",
      "targetId": "lineDirP",
      "relation": "construction"
    },
    {
      "sourceId": "lineDirP",
      "targetId": "intQCA",
      "relation": "construction"
    },
    {
      "sourceId": "segCA",
      "targetId": "intQCA",
      "relation": "construction"
    },
    {
      "sourceId": "lineDirP",
      "targetId": "intQBC",
      "relation": "construction"
    },
    {
      "sourceId": "segBC",
      "targetId": "intQBC",
      "relation": "construction"
    },
    {
      "sourceId": "pA",
      "targetId": "segAC",
      "relation": "construction"
    },
    {
      "sourceId": "pC",
      "targetId": "segAC",
      "relation": "construction"
    },
    {
      "sourceId": "pC",
      "targetId": "segAC",
      "relation": "expression"
    },
    {
      "sourceId": "pDir",
      "targetId": "segAC",
      "relation": "expression"
    },
    {
      "sourceId": "pP",
      "targetId": "segAC",
      "relation": "expression"
    },
    {
      "sourceId": "pA",
      "targetId": "segAC",
      "relation": "expression"
    },
    {
      "sourceId": "pB",
      "targetId": "segBC_2",
      "relation": "construction"
    },
    {
      "sourceId": "pC",
      "targetId": "segBC_2",
      "relation": "construction"
    },
    {
      "sourceId": "pB",
      "targetId": "segBC_2",
      "relation": "expression"
    },
    {
      "sourceId": "pDir",
      "targetId": "segBC_2",
      "relation": "expression"
    },
    {
      "sourceId": "pP",
      "targetId": "segBC_2",
      "relation": "expression"
    },
    {
      "sourceId": "pC",
      "targetId": "segBC_2",
      "relation": "expression"
    }
  ],
  "note": "Arrastre los puntos para explorar la figura.",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const Pasch = () => <DiagramRenderer spec={PaschSpec} />;
