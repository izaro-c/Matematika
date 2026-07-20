import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const SumaAngulosSpec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Suma de los ángulos de un triángulo",
  "componentId": "suma-angulos",
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
      "label": "Triángulo ABC",
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
        "ariaLabel": "Triángulo ABC",
        "role": "primary"
      },
      "target": true,
      "targetId": "triangulo",
      "color": "terracota"
    },
    {
      "id": "gAngles",
      "label": "Ángulos interiores",
      "memberIds": [
        "angA",
        "angB",
        "angC"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulos interiores",
        "role": "primary"
      },
      "target": true,
      "targetId": "angulos",
      "color": "terracota"
    }
  ],
  "points": [
    {
      "id": "A",
      "label": "A",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1580,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto A",
        "role": "primary"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -3,
      "y": -2,
      "showLabel": true,
      "fixed": false,
      "constraint": "free",
      "snapToGrid": true,
      "snapSize": 0.25
    },
    {
      "id": "B",
      "label": "B",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1590,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto B",
        "role": "primary"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 3,
      "y": -1.5,
      "showLabel": true,
      "fixed": false,
      "constraint": "free",
      "snapToGrid": true,
      "snapSize": 0.25
    },
    {
      "id": "C",
      "label": "C",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1600,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto C",
        "role": "primary"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 0.5,
      "y": 2.7,
      "showLabel": true,
      "fixed": false,
      "constraint": "constrained",
      "constraintIds": [
        "sameC"
      ],
      "snapToGrid": true,
      "snapSize": 0.25
    }
  ],
  "elements": [
    {
      "id": "poly",
      "label": "Triángulo ABC",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1610,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTriangle"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo ABC",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 3,
        "fillOpacity": 0.1,
        "highlightFillOpacity": 0.28,
        "preserveColorOnHighlight": true
      },
      "kind": "polygon",
      "refs": [
        "A",
        "B",
        "C"
      ]
    },
    {
      "id": "AB",
      "label": "AB",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1620,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTriangle"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "AB",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "A",
        "B"
      ]
    },
    {
      "id": "BC",
      "label": "BC",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1630,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTriangle"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "BC",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "B",
        "C"
      ]
    },
    {
      "id": "CA",
      "label": "CA",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1640,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTriangle"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "CA",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "C",
        "A"
      ]
    },
    {
      "id": "angA",
      "label": "α",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1650,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gAngles"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "α",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "fillOpacity": 0.22,
        "angleRadius": 0.58,
        "preserveColorOnHighlight": true
      },
      "kind": "angle",
      "refs": [
        "B",
        "A",
        "C"
      ]
    },
    {
      "id": "angB",
      "label": "β",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1660,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gAngles"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "β",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "fillOpacity": 0.22,
        "angleRadius": 0.58,
        "preserveColorOnHighlight": true
      },
      "kind": "angle",
      "refs": [
        "C",
        "B",
        "A"
      ]
    },
    {
      "id": "angC",
      "label": "γ",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1670,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gAngles"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "γ",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "fillOpacity": 0.22,
        "angleRadius": 0.58,
        "preserveColorOnHighlight": true
      },
      "kind": "angle",
      "refs": [
        "A",
        "C",
        "B"
      ]
    },
    {
      "id": "sumInfo",
      "label": "Invariante euclidiano",
      "color": "terracota",
      "layerId": "annotations",
      "order": 1680,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Invariante euclidiano",
        "role": "annotation"
      },
      "target": false,
      "style": {
        "preserveColorOnHighlight": true
      },
      "kind": "infoPanel",
      "refs": [],
      "text": "α + β + γ = 180°",
      "properties": {
        "title": "Invariante euclidiano",
        "anchorMode": "viewport",
        "viewportPosition": [
          0.98,
          0.03
        ]
      }
    }
  ],
  "sliders": [],
  "steps": [],
  "constraints": [
    {
      "id": "sameC",
      "label": "C no cruza AB",
      "kind": "sameSide",
      "refs": [
        "C",
        "A",
        "B"
      ],
      "enabled": true
    }
  ],
  "dependencies": [],
  "note": "Mueve los vértices. La figura cambia, pero el panel recuerda el invariante cuya demostración usa una paralela por C.",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const SumaAngulos = () => <DiagramRenderer spec={SumaAngulosSpec} />;
