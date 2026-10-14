import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const VerticeSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Vértice",
  "componentId": "vertice",
  "category": "Definiciones",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "viewport": {
    "bounds": [
      -5,
      4.5,
      5,
      -4.5
    ],
    "home": [
      -5,
      4.5,
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
  "groups": [],
  "objects": [
    {
      "id": "verticeA",
      "label": "A",
      "color": "terracota",
      "layerId": "geometry",
      "order": 30,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el vértice A",
        "role": "primary"
      },
      "target": true,
      "targetId": "verticeA",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2.5,
        "y": -1.5
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 8,
        "labelVisible": true,
        "highlightSize": 11,
        "preserveColorOnHighlight": true
      },
      "interaction": {
        "snapToGrid": false
      }
    },
    {
      "id": "verticeB",
      "label": "B",
      "color": "pavo",
      "layerId": "geometry",
      "order": 31,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el vértice B",
        "role": "primary"
      },
      "target": true,
      "targetId": "verticeB",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.5,
        "y": -1.5
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 8,
        "labelVisible": true,
        "highlightSize": 11,
        "preserveColorOnHighlight": true
      },
      "interaction": {
        "snapToGrid": false
      }
    },
    {
      "id": "verticeC",
      "label": "C",
      "color": "granada",
      "layerId": "geometry",
      "order": 32,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el vértice C",
        "role": "primary"
      },
      "target": true,
      "targetId": "verticeC",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0,
        "y": 2.5
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 8,
        "labelVisible": true,
        "highlightSize": 11,
        "preserveColorOnHighlight": true
      },
      "interaction": {
        "snapToGrid": false
      }
    },
    {
      "id": "segAB",
      "label": "Lado AB",
      "color": "carbon",
      "layerId": "geometry",
      "order": 10,
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
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "verticeA",
          "verticeB"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3.4,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segBC",
      "label": "Lado BC",
      "color": "carbon",
      "layerId": "geometry",
      "order": 11,
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
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "verticeB",
          "verticeC"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3.4,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segCA",
      "label": "Lado CA",
      "color": "carbon",
      "layerId": "geometry",
      "order": 12,
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
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "verticeC",
          "verticeA"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3.4,
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [],
  "steps": [],
  "note": "Arrastra los vértices A, B o C para observar cómo estos puntos discretos determinan la concurrencia de los lados.",
  "translations": {
    "eu": {
      "title": "Erpina",
      "note": "Arrastatu A, B edo C erpinak puntu diskretu horiek aldeen elkargunea nola zehazten duten ikusteko.",
      "ariaLabels": {
        "verticeA": "Mugitu A erpina",
        "verticeB": "Mugitu B erpina",
        "verticeC": "Mugitu C erpina",
        "segAB": "AB zuzenkia",
        "segBC": "BC zuzenkia",
        "segCA": "CA zuzenkia"
      }
    },
    "en": {
      "title": "Vertex",
      "note": "Drag vertices A, B, or C to observe how these discrete points determine the concurrence of the sides.",
      "ariaLabels": {
        "verticeA": "Move vertex A",
        "verticeB": "Move vertex B",
        "verticeC": "Move vertex C",
        "segAB": "Segment AB",
        "segBC": "Segment BC",
        "segCA": "Segment CA"
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const Vertice = () => <DiagramRenderer spec={VerticeSpec} />;
