import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const ModeloFanoSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Plano de Fano",
  "componentId": "ModeloFano",
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
      "id": "anotaciones",
      "label": "Anotaciones",
      "order": 2,
      "visible": true,
      "locked": false
    }
  ],
  "groups": [],
  "objects": [
    {
      "id": "p1",
      "label": "1",
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
        "ariaLabel": "Punto 1",
        "role": "primary"
      },
      "target": true,
      "targetId": "p1",
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
        "size": 5,
        "highlightSize": 9,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "p2",
      "label": "2",
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
        "ariaLabel": "Punto 2",
        "role": "primary"
      },
      "target": true,
      "targetId": "p2",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -1.732,
        "y": -1
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 5,
        "highlightSize": 9,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "p3",
      "label": "3",
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
        "ariaLabel": "Punto 3",
        "role": "primary"
      },
      "target": true,
      "targetId": "p3",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 1.732,
        "y": -1
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 5,
        "highlightSize": 9,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "p4",
      "label": "4",
      "color": "terracota",
      "layerId": "puntos",
      "order": 13,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Punto 4",
        "role": "primary"
      },
      "target": true,
      "targetId": "p4",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0,
        "y": -1
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 5,
        "highlightSize": 9,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "p5",
      "label": "5",
      "color": "terracota",
      "layerId": "puntos",
      "order": 14,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Punto 5",
        "role": "primary"
      },
      "target": true,
      "targetId": "p5",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0.866,
        "y": 0.5
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 5,
        "highlightSize": 9,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "p6",
      "label": "6",
      "color": "terracota",
      "layerId": "puntos",
      "order": 15,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Punto 6",
        "role": "primary"
      },
      "target": true,
      "targetId": "p6",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -0.866,
        "y": 0.5
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 5,
        "highlightSize": 9,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "p7",
      "label": "7",
      "color": "musgo",
      "layerId": "puntos",
      "order": 16,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Punto 7 (centro)",
        "role": "primary"
      },
      "target": true,
      "targetId": "p7",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0,
        "y": 0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 5,
        "highlightSize": 9,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pCircR",
      "label": "radio l₇",
      "color": "musgo",
      "layerId": "rectas",
      "order": 1,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0,
        "y": -1
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
    },
    {
      "id": "l1",
      "label": "l₁",
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
        "ariaLabel": "Recta l₁ (1–2)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "l1",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "p1",
          "p2"
        ]
      },
      "appearance": {
        "strokeWidth": 2,
        "highlightStrokeWidth": 4,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "l2",
      "label": "l₂",
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
        "ariaLabel": "Recta l₂ (2–3)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "l2",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "p2",
          "p3"
        ]
      },
      "appearance": {
        "strokeWidth": 2,
        "highlightStrokeWidth": 4,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "l3",
      "label": "l₃",
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
        "ariaLabel": "Recta l₃ (3–1)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "l3",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "p3",
          "p1"
        ]
      },
      "appearance": {
        "strokeWidth": 2,
        "highlightStrokeWidth": 4,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "l4",
      "label": "l₄",
      "color": "carbon",
      "layerId": "rectas",
      "order": 13,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Recta l₄ (1–4)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "l4",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "p1",
          "p4"
        ]
      },
      "appearance": {
        "strokeWidth": 2,
        "highlightStrokeWidth": 4,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "l5",
      "label": "l₅",
      "color": "carbon",
      "layerId": "rectas",
      "order": 14,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Recta l₅ (2–5)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "l5",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "p2",
          "p5"
        ]
      },
      "appearance": {
        "strokeWidth": 2,
        "highlightStrokeWidth": 4,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "l6",
      "label": "l₆",
      "color": "carbon",
      "layerId": "rectas",
      "order": 15,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Recta l₆ (3–6)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "l6",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "p3",
          "p6"
        ]
      },
      "appearance": {
        "strokeWidth": 2,
        "highlightStrokeWidth": 4,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "l7",
      "label": "l₇",
      "color": "musgo",
      "layerId": "rectas",
      "order": 16,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": true,
        "ariaLabel": "Recta l₇ (círculo interior: 4–5–6)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "l7",
      "objectType": "path",
      "geometry": {
        "type": "circle",
        "center": "p7",
        "point": "pCircR"
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 1.5,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "info",
      "label": "7 puntos · 7 rectas",
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
        "text": "7 puntos · 7 rectas · cada punto en 3 rectas · cada recta con 3 puntos",
        "title": "PG(2,2)"
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
  "note": "El plano proyectivo de orden 2 (PG(2,2)): el plano finito más pequeño. Cada punto pertenece a exactamente 3 rectas y cada recta contiene exactamente 3 puntos.",
  "translations": {
    "eu": {
      "title": "Fanoren planoa",
      "note": "2 ordenako plano proiektiboa (PG(2,2)): plano finitu txikiena. Puntu bakoitza zehazki 3 zuzenetan dago, eta zuzen bakoitzak zehazki 3 puntu ditu.",
      "texts": {
        "info": "7 puntu · 7 zuzen · puntu bakoitza 3 zuzenetan · zuzen bakoitzak 3 puntu"
      },
      "ariaLabels": {
        "p1": "1. puntua",
        "p2": "2. puntua",
        "p3": "3. puntua",
        "p4": "4. puntua",
        "p5": "5. puntua",
        "p6": "6. puntua",
        "p7": "7. puntua (zentroa)",
        "l1": "l₁ zuzena (1–2)",
        "l2": "l₂ zuzena (2–3)",
        "l3": "l₃ zuzena (3–1)",
        "l4": "l₄ zuzena (1–4)",
        "l5": "l₅ zuzena (2–5)",
        "l6": "l₆ zuzena (3–6)",
        "l7": "l₇ zuzena (barne-zirkulua: 4–5–6)"
      }
    },
    "en": {
      "title": "Fano plane",
      "note": "The projective plane of order 2 (PG(2,2)): the smallest finite plane. Each point lies on exactly 3 lines and each line contains exactly 3 points.",
      "texts": {
        "info": "7 points · 7 lines · each point on 3 lines · each line with 3 points"
      },
      "ariaLabels": {
        "p1": "Point 1",
        "p2": "Point 2",
        "p3": "Point 3",
        "p4": "Point 4",
        "p5": "Point 5",
        "p6": "Point 6",
        "p7": "Point 7 (centre)",
        "l1": "Line l₁ (1–2)",
        "l2": "Line l₂ (2–3)",
        "l3": "Line l₃ (3–1)",
        "l4": "Line l₄ (1–4)",
        "l5": "Line l₅ (2–5)",
        "l6": "Line l₆ (3–6)",
        "l7": "Line l₇ (inner circle: 4–5–6)"
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const ModeloFano = () => <DiagramRenderer spec={ModeloFanoSpec} />;
