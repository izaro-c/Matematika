import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const AnguloRectoSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Ángulo recto",
  "componentId": "angulo-recto",
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
      "id": "gAngulosRectos",
      "label": "Ángulos rectos adyacentes suplementarios congruentes",
      "memberIds": [
        "angAOC",
        "angBOC"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulos rectos congruentes",
        "role": "primary"
      },
      "target": true,
      "targetId": "angulos-rectos",
      "color": "ocre"
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
      "id": "linePerp",
      "label": "Soporte perpendicular",
      "color": "carbon",
      "layerId": "geometry",
      "order": 6,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "perpendicular",
          "linePoints": [
            "pO",
            "pA"
          ],
          "through": "pO"
        }
      },
      "appearance": {
        "strokeWidth": 1
      }
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
        "ariaLabel": "Punto C sobre la semirrecta k",
        "role": "primary"
      },
      "target": true,
      "targetId": "pC",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0,
        "y": 2.7
      },
      "mobility": {
        "type": "on-support",
        "support": "linePerp"
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
        "ariaLabel": "Semirrecta perpendicular k = OC",
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
      "label": "∠(h, k)",
      "color": "ocre",
      "layerId": "geometry",
      "order": 60,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gAngulosRectos"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo recto ∠(h, k)",
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
      "marker": "square",
      "perpendicularRelationId": "perpO",
      "appearance": {
        "radius": 0.7,
        "strokeWidth": 2,
        "fillOpacity": 0.18,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "angBOC",
      "label": "∠(h', k)",
      "color": "musgo",
      "layerId": "geometry",
      "order": 65,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gAngulosRectos"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo recto suplementario ∠(h', k)",
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
      "marker": "square",
      "perpendicularRelationId": "perpO",
      "appearance": {
        "radius": 0.7,
        "strokeWidth": 2,
        "fillOpacity": 0.18,
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [
    {
      "id": "perpO",
      "label": "Perpendicularidad en O",
      "enabled": true,
      "type": "perpendicular",
      "supports": [
        [
          "pO",
          "pA"
        ],
        [
          "pO",
          "pC"
        ]
      ]
    }
  ],
  "steps": [],
  "note": "Arrastra los puntos O y A para rotar y trasladar la recta base; arrastra C a lo largo de la perpendicular para variar la longitud de la semirrecta k conservando el ángulo recto.",
  "translations": {
    "eu": {
      "title": "Angelu zuzena",
      "note": "Mugitu O eta A puntuak oinarrizko zuzena biratu eta lekualdatzeko; mugitu C perpendikularrean zehar k zuzenerdia aldatzeko angelu zuzena mantenduz.",
      "ariaLabels": {
        "pO": "O erpin komuna",
        "pA": "A puntua h zuzenerdian",
        "pB": "B puntua h' zuzenerdi aurkakoan",
        "pC": "C puntua k zuzenerdi perpendikularrean",
        "lineL": "ℓ euskarri-zuzena",
        "rayOA": "h = OA zuzenerdia",
        "rayOB": "h' = OB zuzenerdi aurkakoa",
        "rayOC": "k = OC zuzenerdi perpendikularra",
        "angAOC": "∠(h, k) angelu zuzena",
        "angBOC": "∠(h', k) angelu zuzen betegarria",
        "gAngulosRectos": "Angelu zuzen kongruenteak"
      }
    },
    "en": {
      "title": "Right Angle",
      "note": "Drag points O and A to rotate and translate the base line; drag point C along the perpendicular to change ray k while preserving the right angle.",
      "ariaLabels": {
        "pO": "Common vertex O",
        "pA": "Point A on ray h",
        "pB": "Point B on the opposite ray h'",
        "pC": "Point C on the perpendicular ray k",
        "lineL": "Supporting line ℓ",
        "rayOA": "Ray h = OA",
        "rayOB": "Opposite ray h' = OB",
        "rayOC": "Perpendicular ray k = OC",
        "angAOC": "Right angle ∠(h, k)",
        "angBOC": "Supplementary right angle ∠(h', k)",
        "gAngulosRectos": "Congruent right angles"
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const AnguloRecto = () => <DiagramRenderer spec={AnguloRectoSpec} />;
