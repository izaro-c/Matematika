import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const ModeloTresPuntosSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
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
  "objects": [
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2,
        "y": -1
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 6,
        "highlightSize": 9,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2,
        "y": -1
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 6,
        "highlightSize": 9,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0,
        "y": 2
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 6,
        "highlightSize": 9,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
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
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "A",
          "B",
          "C"
        ]
      },
      "appearance": {
        "strokeWidth": 0,
        "fillOpacity": 0.08,
        "highlightFillOpacity": 0.22,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "through-points",
          "points": [
            "A",
            "B"
          ]
        }
      },
      "appearance": {
        "strokeWidth": 2,
        "highlightStrokeWidth": 3.5,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "through-points",
          "points": [
            "B",
            "C"
          ]
        }
      },
      "appearance": {
        "strokeWidth": 2,
        "highlightStrokeWidth": 3.5,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "through-points",
          "points": [
            "C",
            "A"
          ]
        }
      },
      "appearance": {
        "strokeWidth": 2,
        "highlightStrokeWidth": 3.5,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "3 puntos · 3 rectas · 1 plano"
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0,
          0
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [],
  "steps": [],
  "note": "El modelo más pequeño que satisface los tres axiomas de incidencia: exactamente 3 puntos, 3 rectas y 1 plano."
}
);
/* @matematika-diagram-spec:end */

export const ModeloTresPuntos = () => <DiagramRenderer spec={ModeloTresPuntosSpec} />;
