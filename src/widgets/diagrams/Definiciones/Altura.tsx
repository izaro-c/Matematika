import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const AlturaSpec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Altura",
  "componentId": "altura",
  "category": "Definiciones",
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
  "points": [
    {
      "id": "pA",
      "label": "A",
      "color": "terracota",
      "layerId": "geometry",
      "order": 0,
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
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -3.6,
      "y": -2.44,
      "showLabel": true,
      "fixed": false,
      "constraint": "free"
    },
    {
      "id": "pB",
      "label": "B",
      "color": "terracota",
      "layerId": "geometry",
      "order": 6000,
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
      "x": 3.06,
      "y": -1.5,
      "showLabel": true,
      "fixed": false,
      "constraint": "free"
    },
    {
      "id": "pC",
      "label": "C",
      "color": "terracota",
      "layerId": "geometry",
      "order": 2000,
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
      "x": -1.1,
      "y": 3.64,
      "showLabel": true,
      "fixed": false,
      "constraint": "free"
    }
  ],
  "elements": [
    {
      "id": "polygonABC",
      "label": "Polígono",
      "color": "musgo",
      "layerId": "geometry",
      "order": 3000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Polígono",
        "role": "secondary"
      },
      "target": true,
      "targetId": "polygonABC",
      "style": {
        "strokeWidth": 3,
        "highlightStrokeWidth": 5,
        "preserveColorOnHighlight": true
      },
      "kind": "polygon",
      "refs": [
        "pA",
        "pB",
        "pC"
      ]
    },
    {
      "id": "footCAB",
      "label": "$H_c$",
      "color": "ocre",
      "layerId": "geometry",
      "order": 4000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Pie de altura CAB",
        "role": "secondary"
      },
      "target": true,
      "targetId": "footCAB",
      "style": {
        "preserveColorOnHighlight": true
      },
      "kind": "perpendicularFoot",
      "refs": [
        "pA",
        "pB",
        "pC"
      ]
    },
    {
      "id": "extAlturaCAB",
      "label": "Extensión de base AB",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 1000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Extensión de base AB",
        "role": "secondary"
      },
      "target": true,
      "targetId": "extAlturaCAB",
      "style": {
        "preserveColorOnHighlight": true
      },
      "kind": "baseExtension",
      "refs": [
        "pA",
        "pB",
        "footCAB"
      ],
      "dashed": true
    },
    {
      "id": "segAlturaCAB",
      "label": "Altura desde C a AB",
      "color": "ocre",
      "layerId": "geometry",
      "order": 5000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Altura desde C a AB",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segAlturaCAB",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "pC",
        "footCAB"
      ],
      "dashed": true
    },
    {
      "id": "rightAngleAlturaCAB",
      "label": "Ángulo recto de la altura",
      "color": "ocre",
      "layerId": "geometry",
      "order": 1000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo recto de la altura",
        "role": "secondary"
      },
      "target": true,
      "targetId": "rightAngleAlturaCAB",
      "style": {
        "angleRadius": 0.45,
        "preserveColorOnHighlight": true
      },
      "kind": "rightAngle",
      "refs": [
        "pA",
        "footCAB",
        "pC"
      ]
    }
  ],
  "sliders": [],
  "steps": [],
  "constraints": [],
  "dependencies": [
    {
      "sourceId": "pA",
      "targetId": "polygonABC",
      "relation": "construction"
    },
    {
      "sourceId": "pB",
      "targetId": "polygonABC",
      "relation": "construction"
    },
    {
      "sourceId": "pC",
      "targetId": "polygonABC",
      "relation": "construction"
    }
  ],
  "note": "Arrastra A, B y C",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const Altura = () => <DiagramRenderer spec={AlturaSpec} />;
