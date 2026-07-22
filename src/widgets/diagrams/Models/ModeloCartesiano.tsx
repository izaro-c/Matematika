import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const ModeloCartesianoSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Modelo cartesiano ℝ²",
  "componentId": "ModeloCartesiano",
  "category": "Models",
  "mode": "simulation",
  "axis": true,
  "grid": true,
  "viewport": {
    "bounds": [
      -6,
      6,
      6,
      -6
    ],
    "home": [
      -6,
      6,
      6,
      -6
    ],
    "minZoom": 0.3,
    "maxZoom": 8,
    "padding": 0.1
  },
  "layers": [
    {
      "id": "rectas",
      "label": "Rectas",
      "order": 0,
      "visible": true,
      "locked": false
    },
    {
      "id": "puntos",
      "label": "Puntos",
      "order": 1,
      "visible": true,
      "locked": false
    },
    {
      "id": "medidas",
      "label": "Medidas",
      "order": 2,
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
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Punto A",
        "role": "primary"
      },
      "target": true,
      "targetId": "A",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 1,
        "y": 2
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 5,
        "highlightSize": 8,
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
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Punto B",
        "role": "primary"
      },
      "target": true,
      "targetId": "B",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3,
        "y": -1
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 5,
        "highlightSize": 8,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "P",
      "label": "P",
      "color": "ocre",
      "layerId": "puntos",
      "order": 12,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Punto P",
        "role": "primary"
      },
      "target": true,
      "targetId": "P",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 3,
        "y": -2
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 5,
        "highlightSize": 8,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "lineAB",
      "label": "l",
      "color": "musgo",
      "layerId": "rectas",
      "order": 10,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Recta l por A y B",
        "role": "secondary"
      },
      "target": true,
      "targetId": "lineAB",
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
        "strokeWidth": 2.5,
        "highlightStrokeWidth": 4,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "parallelP",
      "label": "l′",
      "color": "salvia",
      "layerId": "rectas",
      "order": 11,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Recta l′ paralela a l por P",
        "role": "secondary"
      },
      "target": true,
      "targetId": "parallelP",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "parallel",
          "linePoints": [
            "A",
            "B"
          ],
          "through": "P"
        }
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2,
        "highlightStrokeWidth": 3.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "distAB",
      "label": "d(A,B)",
      "color": "pizarra",
      "layerId": "medidas",
      "order": 20,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "annotation"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "measurement",
      "content": {
        "text": "d(A, B) = {value}",
        "precision": 2
      },
      "anchor": {
        "type": "object",
        "object": "A",
        "offset": [
          -1.5,
          1.5
        ]
      },
      "measurement": {
        "refs": [
          "A",
          "B"
        ],
        "mode": "distance"
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "infoCarte",
      "label": "ℝ²",
      "color": "pavo",
      "layerId": "medidas",
      "order": 30,
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
        "text": "puntos → $(x, y)\\\\$ rectas → $ax + by + c = 0\\\\$$l' ∥ l$ por $P$"
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
  "note": "Arrastra A, B y P. La recta l′ permanece paralela a l."
}
);
/* @matematika-diagram-spec:end */

export const ModeloCartesiano = () => <DiagramRenderer spec={ModeloCartesianoSpec} />;
