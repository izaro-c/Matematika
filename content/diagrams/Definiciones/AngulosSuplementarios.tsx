import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const AngulosSuplementariosSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Ángulos suplementarios",
  "componentId": "angulos-suplementarios",
  "category": "Definiciones",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "showLabels": true,
  "viewport": {
    "bounds": [
      -5.5,
      4.5,
      5.5,
      -4
    ],
    "home": [
      -5.5,
      4.5,
      5.5,
      -4
    ],
    "minZoom": 0.2,
    "maxZoom": 8,
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
  "groups": [
    {
      "id": "gAngulosSuplementarios",
      "label": "Ángulos adyacentes suplementarios",
      "memberIds": [
        "angAOC",
        "angBOC"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulos adyacentes suplementarios",
        "role": "primary"
      },
      "target": true,
      "targetId": "angulos-suplementarios",
      "color": "canela"
    }
  ],
  "objects": [
    {
      "id": "pO",
      "label": "O",
      "color": "carbon",
      "layerId": "geometry",
      "order": 10,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértice común O",
        "role": "primary"
      },
      "target": true,
      "targetId": "pO",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0,
        "y": -0.5
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
      "interaction": {}
    },
    {
      "id": "pA",
      "label": "A",
      "color": "canela",
      "layerId": "geometry",
      "order": 20,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto A sobre la semirrecta h",
        "role": "primary"
      },
      "target": true,
      "targetId": "pA",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3.2,
        "y": -0.5
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
      "interaction": {}
    },
    {
      "id": "pB",
      "label": "B",
      "color": "pavo",
      "layerId": "geometry",
      "order": 25,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto B sobre la semirrecta opuesta h'",
        "role": "secondary"
      },
      "target": true,
      "targetId": "pB",
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "2*pO.x-pA.x",
        "y": "2*pO.y-pA.y",
        "fallback": [
          3.2,
          -0.5
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pC",
      "label": "C",
      "color": "terracota",
      "layerId": "geometry",
      "order": 30,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto C sobre el lado común k",
        "role": "primary"
      },
      "target": true,
      "targetId": "pC",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0.8,
        "y": 2.8
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
      "interaction": {}
    },
    {
      "id": "lineL",
      "label": "ℓ",
      "color": "carbon",
      "layerId": "geometry",
      "order": 5,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta soporte ℓ",
        "role": "secondary"
      },
      "target": true,
      "targetId": "recta-l",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "through-points",
          "points": [
            "pO",
            "pA"
          ]
        }
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 1.5,
        "strokeOpacity": 0.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "rayOA",
      "label": "h",
      "color": "canela",
      "layerId": "geometry",
      "order": 40,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Semirrecta h = OA",
        "role": "primary"
      },
      "target": true,
      "targetId": "semirrecta-h",
      "objectType": "path",
      "geometry": {
        "type": "ray",
        "points": [
          "pO",
          "pA"
        ]
      },
      "appearance": {
        "strokeWidth": 2.6,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "rayOB",
      "label": "h'",
      "color": "pavo",
      "layerId": "geometry",
      "order": 45,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Semirrecta opuesta h' = OB",
        "role": "primary"
      },
      "target": true,
      "targetId": "semirrecta-hp",
      "objectType": "path",
      "geometry": {
        "type": "ray",
        "points": [
          "pO",
          "pB"
        ]
      },
      "appearance": {
        "strokeWidth": 2.6,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "rayOC",
      "label": "k",
      "color": "terracota",
      "layerId": "geometry",
      "order": 50,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado común k = OC",
        "role": "primary"
      },
      "target": true,
      "targetId": "semirrecta-k",
      "objectType": "path",
      "geometry": {
        "type": "ray",
        "points": [
          "pO",
          "pC"
        ]
      },
      "appearance": {
        "strokeWidth": 2.8,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "angAOC",
      "label": "∠AOC",
      "color": "canela",
      "layerId": "geometry",
      "order": 60,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gAngulosSuplementarios"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo AOC",
        "role": "primary"
      },
      "target": true,
      "targetId": "angAOC",
      "objectType": "angle",
      "points": [
        "pA",
        "pO",
        "pC"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 1,
        "strokeWidth": 2,
        "fillOpacity": 0.18,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "angBOC",
      "label": "∠BOC",
      "color": "pavo",
      "layerId": "geometry",
      "order": 65,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gAngulosSuplementarios"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo BOC",
        "role": "primary"
      },
      "target": true,
      "targetId": "angBOC",
      "objectType": "angle",
      "points": [
        "pC",
        "pO",
        "pB"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 1.3,
        "strokeWidth": 2,
        "fillOpacity": 0.18,
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [],
  "steps": [],
  "note": "Arrastra los puntos O, A y C para explorar cómo los ángulos adyacentes forman una recta continua.",
  "translations": {
    "eu": {
      "title": "Angelu betegarriak",
      "note": "Mugitu O, A eta C puntuak angelu auzokideek zuzen jarraitu bat nola osatzen duten aztertzeko.",
      "ariaLabels": {
        "pO": "O erpin komuna",
        "pA": "A puntua h zuzenerdian",
        "pB": "B puntua h' zuzenerdi aurkakoan",
        "pC": "C puntua k alde komunean",
        "lineL": "ℓ euskarri-zuzena",
        "rayOA": "h = OA zuzenerdia",
        "rayOB": "h' = OB zuzenerdi aurkakoa",
        "rayOC": "k = OC alde komuna",
        "angAOC": "AOC angelua",
        "angBOC": "BOC angelua"
      }
    },
    "en": {
      "title": "Supplementary Angles",
      "note": "Drag points O, A, and C to observe how the adjacent angles form a continuous straight line.",
      "ariaLabels": {
        "pO": "Common vertex O",
        "pA": "Point A on ray h",
        "pB": "Point B on the opposite ray h'",
        "pC": "Point C on the common side k",
        "lineL": "Supporting line ℓ",
        "rayOA": "Ray h = OA",
        "rayOB": "Opposite ray h' = OB",
        "rayOC": "Common side k = OC",
        "angAOC": "Angle AOC",
        "angBOC": "Angle BOC"
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const AngulosSuplementarios = () => <DiagramRenderer spec={AngulosSuplementariosSpec} />;
