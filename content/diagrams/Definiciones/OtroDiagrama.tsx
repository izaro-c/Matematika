import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const OtroDiagramaSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "DiagramaPrueba",
  "componentId": "diagramaprueba",
  "category": "Teoremas",
  "mode": "simulation",
  "axis": true,
  "grid": true,
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
    },
    {
      "id": "annotations",
      "label": "Anotaciones & Texto",
      "order": 20,
      "visible": true,
      "locked": false
    }
  ],
  "groups": [],
  "objects": [
    {
      "id": "pP",
      "label": "P",
      "color": "terracota",
      "layerId": "geometry",
      "order": 0,
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
        "x": 3.5,
        "y": 3.53
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 7,
        "labelVisible": false,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "coordY",
      "label": "Coordenada y",
      "color": "salvia",
      "layerId": "geometry",
      "order": 1000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Coordenada y",
        "role": "annotation"
      },
      "target": true,
      "targetId": "coordY",
      "objectType": "annotation",
      "variant": "text",
      "content": {
        "text": "({= pP.x | precision: 2},{= pP.y | precision: 2})",
        "rules": [],
        "title": "({= pP.x | precision: 2},{= pP.y | precision: 2})"
      },
      "anchor": {
        "type": "object",
        "object": "pP",
        "offset": [
          0.25,
          0.3500000000000001
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "sliderT",
      "label": "Parámetro t",
      "color": "pavo",
      "layerId": "controls",
      "order": 2000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Parámetro t",
        "role": "annotation"
      },
      "target": true,
      "targetId": "sliderT",
      "objectType": "control",
      "variant": "slider",
      "position": [
        -4.2,
        -4.2
      ],
      "range": {
        "min": 0,
        "max": 10,
        "step": 0.1
      },
      "value": 6.5
    }
  ],
  "relations": [],
  "steps": [],
  "note": "Arrastre los puntos para explorar la figura."
}
);
/* @matematika-diagram-spec:end */

export const OtroDiagrama = () => <DiagramRenderer spec={OtroDiagramaSpec} />;
