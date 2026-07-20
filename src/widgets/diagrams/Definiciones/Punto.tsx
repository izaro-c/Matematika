import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const PuntoSpec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Punto: una posición sin dimensión",
  "componentId": "punto",
  "category": "Definiciones",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "viewport": {
    "bounds": [
      -4,
      4,
      4,
      -4
    ],
    "home": [
      -4,
      4,
      4,
      -4
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
  "groups": [],
  "points": [
    {
      "id": "P",
      "label": "P",
      "color": "musgo",
      "layerId": "geometry",
      "order": 680,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto P",
        "role": "primary"
      },
      "target": true,
      "targetId": "pPoint",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 0,
      "y": 0,
      "showLabel": true,
      "fixed": false,
      "constraint": "free",
      "snapToGrid": true,
      "snapSize": 0.25
    }
  ],
  "elements": [
    {
      "id": "pointInfo",
      "label": "Concepto primitivo",
      "color": "musgo",
      "layerId": "annotations",
      "order": 690,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Concepto primitivo",
        "role": "annotation"
      },
      "target": false,
      "style": {
        "preserveColorOnHighlight": true
      },
      "kind": "infoPanel",
      "refs": [],
      "text": "P determina una posición; la marca visible no representa tamaño matemático.",
      "properties": {
        "title": "Concepto primitivo",
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
  "dependencies": [],
  "note": "Mueve P por el plano. La marca cambia de posición, pero un punto matemático sigue sin longitud, área ni volumen.",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const Punto = () => <DiagramRenderer spec={PuntoSpec} />;
