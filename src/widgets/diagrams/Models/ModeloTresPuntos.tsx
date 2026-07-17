import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const ModeloTresPuntosSpec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Modelo de tres puntos",
  "componentId": "ModeloTresPuntos",
  "category": "Models",
  "mode": "diagram",
  "axis": false,
  "grid": false,
  "viewport": {
    "bounds": [
      -3.2,
      3.2,
      3.2,
      -3.2
    ],
    "home": [
      -3.2,
      3.2,
      3.2,
      -3.2
    ],
    "minZoom": 0.5,
    "maxZoom": 8,
    "padding": 0.12
  },
  "layers": [
    {
      "id": "fondo",
      "label": "Región",
      "order": 0,
      "visible": true,
      "locked": false
    },
    {
      "id": "rectas",
      "label": "Rectas",
      "order": 1,
      "visible": true,
      "locked": false
    },
    {
      "id": "puntos",
      "label": "Puntos",
      "order": 2,
      "visible": true,
      "locked": false
    },
    {
      "id": "anotaciones",
      "label": "Anotaciones",
      "order": 3,
      "visible": true,
      "locked": false
    }
  ],
  "groups": [],
  "points": [
    {
      "id": "A",
      "label": "A",
      "color": "terracota",
      "layerId": "puntos",
      "order": 10,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Punto A",
        "role": "primary"
      },
      "target": true,
      "targetId": "A",
      "style": {
        "pointSize": 6,
        "highlightPointSize": 9,
        "preserveColorOnHighlight": true
      },
      "x": -2,
      "y": -1,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "B",
      "label": "B",
      "color": "terracota",
      "layerId": "puntos",
      "order": 11,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Punto B",
        "role": "primary"
      },
      "target": true,
      "targetId": "B",
      "style": {
        "pointSize": 6,
        "highlightPointSize": 9,
        "preserveColorOnHighlight": true
      },
      "x": 2,
      "y": -1,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "C",
      "label": "C",
      "color": "terracota",
      "layerId": "puntos",
      "order": 12,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Punto C",
        "role": "primary"
      },
      "target": true,
      "targetId": "C",
      "style": {
        "pointSize": 6,
        "highlightPointSize": 9,
        "preserveColorOnHighlight": true
      },
      "x": 0,
      "y": 2,
      "fixed": true,
      "constraint": "fixed"
    }
  ],
  "elements": [
    {
      "id": "plano",
      "label": "plano",
      "color": "musgo",
      "layerId": "fondo",
      "order": 1,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Plano (región triangular)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "plano",
      "style": {
        "strokeWidth": 0,
        "fillOpacity": 0.08,
        "highlightFillOpacity": 0.22,
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
      "id": "rAB",
      "label": "r_{AB}",
      "color": "carbon",
      "layerId": "rectas",
      "order": 10,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Recta AB",
        "role": "secondary"
      },
      "target": true,
      "targetId": "rAB",
      "style": {
        "strokeWidth": 2,
        "highlightStrokeWidth": 3.5,
        "preserveColorOnHighlight": true
      },
      "kind": "line",
      "refs": [
        "A",
        "B"
      ]
    },
    {
      "id": "rBC",
      "label": "r_{BC}",
      "color": "carbon",
      "layerId": "rectas",
      "order": 11,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Recta BC",
        "role": "secondary"
      },
      "target": true,
      "targetId": "rBC",
      "style": {
        "strokeWidth": 2,
        "highlightStrokeWidth": 3.5,
        "preserveColorOnHighlight": true
      },
      "kind": "line",
      "refs": [
        "B",
        "C"
      ]
    },
    {
      "id": "rCA",
      "label": "r_{CA}",
      "color": "carbon",
      "layerId": "rectas",
      "order": 12,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Recta CA",
        "role": "secondary"
      },
      "target": true,
      "targetId": "rCA",
      "style": {
        "strokeWidth": 2,
        "highlightStrokeWidth": 3.5,
        "preserveColorOnHighlight": true
      },
      "kind": "line",
      "refs": [
        "C",
        "A"
      ]
    },
    {
      "id": "info",
      "label": "3 puntos · 3 rectas · 1 plano",
      "color": "pavo",
      "layerId": "anotaciones",
      "order": 20,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "annotation"
      },
      "target": false,
      "style": {
        "strokeWidth": 0,
        "preserveColorOnHighlight": true
      },
      "kind": "infoPanel",
      "refs": [],
      "text": "3 puntos · 3 rectas · 1 plano",
      "properties": {
        "anchorMode": "viewport",
        "viewportPosition": [
          0,
          0
        ]
      }
    }
  ],
  "sliders": [],
  "steps": [],
  "constraints": [],
  "dependencies": [
    {
      "sourceId": "A",
      "targetId": "rAB",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "rAB",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "rBC",
      "relation": "construction"
    },
    {
      "sourceId": "C",
      "targetId": "rBC",
      "relation": "construction"
    },
    {
      "sourceId": "C",
      "targetId": "rCA",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "rCA",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "plano",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "plano",
      "relation": "construction"
    },
    {
      "sourceId": "C",
      "targetId": "plano",
      "relation": "construction"
    }
  ],
  "note": "El modelo más pequeño que satisface los tres axiomas de incidencia: exactamente 3 puntos, 3 rectas y 1 plano.",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const ModeloTresPuntos = () => <DiagramRenderer spec={ModeloTresPuntosSpec} />;
