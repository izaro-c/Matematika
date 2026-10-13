import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const DemoTriangulacionPoligonoSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Triangulación de un polígono",
  "componentId": "demo-triangulacion-poligono",
  "category": "Demos",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "showLabels": true,
  "viewport": {
    "bounds": [
      -1,
      6,
      7,
      -1
    ],
    "home": [
      -1,
      6,
      7,
      -1
    ],
    "minZoom": 0.2,
    "maxZoom": 10,
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
      "label": "Anotaciones",
      "order": 1,
      "visible": true,
      "locked": false
    }
  ],
  "groups": [],
  "objects": [
    {
      "id": "p1",
      "label": "P1",
      "color": "carbon",
      "layerId": "geometry",
      "order": 30,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértice P1",
        "role": "primary"
      },
      "target": true,
      "targetId": "p1",
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
        "size": 6,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "p2",
      "label": "P2",
      "color": "carbon",
      "layerId": "geometry",
      "order": 31,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértice P2",
        "role": "primary"
      },
      "target": true,
      "targetId": "p2",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 4,
        "y": 0
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "p3",
      "label": "P3",
      "color": "carbon",
      "layerId": "geometry",
      "order": 32,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértice P3",
        "role": "primary"
      },
      "target": true,
      "targetId": "p3",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 6,
        "y": 3
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "p4",
      "label": "P4",
      "color": "canela",
      "layerId": "geometry",
      "order": 33,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértice P4 (Oreja)",
        "role": "primary"
      },
      "target": true,
      "targetId": "p4",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 3,
        "y": 2
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "p5",
      "label": "P5",
      "color": "carbon",
      "layerId": "geometry",
      "order": 34,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértice P5",
        "role": "primary"
      },
      "target": true,
      "targetId": "p5",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 1,
        "y": 5
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "poly",
      "label": "Polígono P",
      "color": "carbon",
      "layerId": "geometry",
      "order": 5,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Polígono completo de 5 vértices",
        "role": "primary"
      },
      "target": true,
      "targetId": "poly",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "p1",
          "p2",
          "p3",
          "p4",
          "p5"
        ]
      },
      "appearance": {
        "strokeWidth": 2.5,
        "fillOpacity": 0.1,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "diag",
      "label": "Diagonal P3-P5",
      "color": "terracota",
      "layerId": "geometry",
      "order": 10,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Diagonal interior P3-P5",
        "role": "secondary"
      },
      "target": true,
      "targetId": "diag",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "p3",
          "p5"
        ]
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "oreja",
      "label": "Oreja (Triángulo P3-P4-P5)",
      "color": "canela",
      "layerId": "geometry",
      "order": 6,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo oreja P3-P4-P5",
        "role": "primary"
      },
      "target": true,
      "targetId": "oreja",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "p3",
          "p4",
          "p5"
        ]
      },
      "appearance": {
        "strokeWidth": 1.5,
        "fillOpacity": 0.3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "resto",
      "label": "Subpolígono restante",
      "color": "mora",
      "layerId": "geometry",
      "order": 7,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Subpolígono restante P1-P2-P3-P5",
        "role": "secondary"
      },
      "target": true,
      "targetId": "resto",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "p1",
          "p2",
          "p3",
          "p5"
        ]
      },
      "appearance": {
        "strokeWidth": 1.5,
        "fillOpacity": 0.2,
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [],
  "steps": [
    {
      "id": "step1",
      "label": "Identificación de una oreja",
      "description": "Todo polígono simple de al menos 4 vértices posee una oreja (triángulo formado por tres vértices consecutivos con diagonal interior).",
      "visibleTargets": [
        "oreja",
        "diag"
      ],
      "durationMs": 1000,
      "objectStates": {
        "oreja": {
          "visible": true,
          "emphasis": "primary"
        },
        "resto": {
          "visible": false
        },
        "diag": {
          "visible": true,
          "emphasis": "primary"
        }
      }
    },
    {
      "id": "step2",
      "label": "Paso inductivo",
      "description": "Al retirar la oreja se reduce el número de vértices a n-1, permitiendo la triangulación completa por inducción.",
      "visibleTargets": [
        "resto",
        "diag"
      ],
      "durationMs": 1000,
      "objectStates": {
        "oreja": {
          "visible": false
        },
        "resto": {
          "visible": true,
          "emphasis": "primary"
        },
        "diag": {
          "visible": true,
          "emphasis": "primary"
        }
      }
    }
  ],
  "note": "Mueve los vértices para explorar polígonos convexos o cóncavos.",
  "translations": {
    "eu": {
      "title": "Poligono baten triangelatzea",
      "note": "Mugitu erpinak poligono ganbilak edo ezkurrak aztertzeko.",
      "steps": {
        "step1": {
          "label": "Belarri baten identifikazioa",
          "description": "Gutxienez 4 erpin dituen poligono bakun orok belarri bat du (barne-diagonala duen triangelua)."
        },
        "step2": {
          "label": "Urrats induktiboa",
          "description": "Belarria kenduz gero erpin kopurua n-1era murrizten da, indukzio bidez triangelatzea ahalbidetuz."
        }
      },
      "ariaLabels": {
        "p1": "P1 erpina",
        "p2": "P2 erpina",
        "p3": "P3 erpina",
        "p4": "P4 erpina (belarria)",
        "p5": "P5 erpina",
        "poly": "5 erpineko poligono osoa",
        "diag": "P3-P5 barne-diagonala",
        "oreja": "P3-P4-P5 belarri-triangelua",
        "resto": "Gainerako P1-P2-P3-P5 azpipoligonoa"
      }
    },
    "en": {
      "title": "Triangulation of a polygon",
      "note": "Move the vertices to explore convex or concave polygons.",
      "steps": {
        "step1": {
          "label": "Finding an ear",
          "description": "Every simple polygon with at least 4 vertices has an ear (a triangle formed by three consecutive vertices with an interior diagonal)."
        },
        "step2": {
          "label": "Inductive step",
          "description": "Removing the ear reduces the number of vertices to n-1, allowing the full triangulation by induction."
        }
      },
      "ariaLabels": {
        "p1": "Vertex P1",
        "p2": "Vertex P2",
        "p3": "Vertex P3",
        "p4": "Vertex P4 (ear)",
        "p5": "Vertex P5",
        "poly": "Full 5-vertex polygon",
        "diag": "Interior diagonal P3-P5",
        "oreja": "Ear triangle P3-P4-P5",
        "resto": "Remaining subpolygon P1-P2-P3-P5"
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const DemoTriangulacionPoligono = () => <DiagramRenderer spec={DemoTriangulacionPoligonoSpec} />;
