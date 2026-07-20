import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const Incidence2Spec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Axioma de Incidencia II",
  "componentId": "axioma-de-incidencia-ii",
  "category": "Axiomas",
  "mode": "diagram",
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
    },
    {
      "id": "layer3",
      "label": "Oculto",
      "order": 2,
      "visible": false,
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
      "order": 4000,
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
      "x": -3.88,
      "y": 0,
      "fixed": false,
      "constraint": "glider",
      "gliderTarget": "lineCD"
    },
    {
      "id": "pB",
      "label": "B",
      "color": "terracota",
      "layerId": "geometry",
      "order": 5000,
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
      "x": 4.68,
      "y": 0,
      "fixed": false,
      "constraint": "glider",
      "gliderTarget": "lineCD"
    },
    {
      "id": "pC",
      "label": "l",
      "color": "carbon",
      "layerId": "geometry",
      "order": 1000,
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
        "pointSize": 0,
        "highlightPointSize": 0,
        "preserveColorOnHighlight": true
      },
      "x": 0,
      "y": 0,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "pD",
      "label": "D",
      "color": "terracota",
      "layerId": "layer3",
      "order": 2000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto D",
        "role": "primary"
      },
      "target": true,
      "targetId": "pD",
      "x": 2,
      "y": 0,
      "fixed": true,
      "constraint": "fixed"
    }
  ],
  "elements": [
    {
      "id": "lineCD",
      "label": "Recta",
      "color": "carbon",
      "layerId": "geometry",
      "order": 3000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta",
        "role": "secondary"
      },
      "target": true,
      "targetId": "lineCD",
      "style": {
        "highlightStrokeWidth": 2.4,
        "preserveColorOnHighlight": true
      },
      "kind": "line",
      "refs": [
        "pC",
        "pD"
      ]
    }
  ],
  "sliders": [],
  "steps": [],
  "constraints": [],
  "dependencies": [
    {
      "sourceId": "pC",
      "targetId": "lineCD",
      "relation": "construction"
    },
    {
      "sourceId": "pD",
      "targetId": "lineCD",
      "relation": "construction"
    }
  ],
  "note": "Toda recta contiene al menos dos puntos",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const Incidence2 = () => <DiagramRenderer spec={Incidence2Spec} />;
