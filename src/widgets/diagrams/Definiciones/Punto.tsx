import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const PuntoSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
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
  "objects": [
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0,
        "y": 0
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
      "interaction": {
        "snapToGrid": true,
        "snapSize": 0.25
      }
    },
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
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "P determina una posición; la marca visible no representa tamaño matemático.",
        "title": "Concepto primitivo"
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.98,
          0.03
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [],
  "steps": [],
  "note": "Mueve P por el plano. La marca cambia de posición, pero un punto matemático sigue sin longitud, área ni volumen."
}
);
/* @matematika-diagram-spec:end */

export const Punto = () => <DiagramRenderer spec={PuntoSpec} />;
