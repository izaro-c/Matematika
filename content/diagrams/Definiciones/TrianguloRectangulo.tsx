import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const TrianguloRectanguloSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Triángulo rectángulo",
  "componentId": "triangulo-rectangulo",
  "category": "Definiciones",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "showLabels": true,
  "viewport": {
    "bounds": [
      -5,
      5,
      5,
      -4
    ],
    "home": [
      -5,
      5,
      5,
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
      "id": "gCatetos",
      "label": "Catetos perpendiculares",
      "memberIds": [
        "segCA",
        "segCB"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Catetos CA y CB",
        "role": "primary"
      },
      "target": true,
      "targetId": "catetos",
      "color": "terracota"
    }
  ],
  "objects": [
    {
      "id": "pC",
      "label": "C",
      "color": "carbon",
      "layerId": "geometry",
      "order": 10,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértice C con ángulo recto",
        "role": "primary"
      },
      "target": true,
      "targetId": "pC",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2,
        "y": -1.5
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
      "color": "carbon",
      "layerId": "geometry",
      "order": 20,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértice A",
        "role": "primary"
      },
      "target": true,
      "targetId": "pA",
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
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "linePerpCB",
      "label": "Soporte perpendicular CB",
      "color": "carbon",
      "layerId": "geometry",
      "order": 1,
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
            "pC",
            "pA"
          ],
          "through": "pC"
        }
      },
      "appearance": {
        "strokeWidth": 1
      }
    },
    {
      "id": "pB",
      "label": "B",
      "color": "carbon",
      "layerId": "geometry",
      "order": 30,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértice B sobre la perpendicular",
        "role": "primary"
      },
      "target": true,
      "targetId": "pB",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2,
        "y": 2
      },
      "mobility": {
        "type": "on-support",
        "support": "linePerpCB"
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
      "id": "lineCA",
      "label": "Recta soporte CA",
      "color": "carbon",
      "layerId": "geometry",
      "order": 2,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta soporte CA",
        "role": "secondary"
      },
      "target": true,
      "targetId": "recta-CA",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "through-points",
          "points": [
            "pC",
            "pA"
          ]
        }
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 1.5,
        "strokeOpacity": 0.4,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "lineCB",
      "label": "Recta soporte CB",
      "color": "carbon",
      "layerId": "geometry",
      "order": 3,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta soporte CB",
        "role": "secondary"
      },
      "target": true,
      "targetId": "recta-CB",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "through-points",
          "points": [
            "pC",
            "pB"
          ]
        }
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 1.5,
        "strokeOpacity": 0.4,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "polyABC",
      "label": "△ABC",
      "color": "musgo",
      "layerId": "geometry",
      "order": 5,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo rectángulo ABC",
        "role": "primary"
      },
      "target": true,
      "targetId": "triangulo",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "pA",
          "pB",
          "pC"
        ]
      },
      "appearance": {
        "fillOpacity": 0.12,
        "strokeWidth": 0,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segCA",
      "label": "CA",
      "color": "terracota",
      "layerId": "geometry",
      "order": 40,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gCatetos"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Cateto CA",
        "role": "primary"
      },
      "target": true,
      "targetId": "segCA",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pC",
          "pA"
        ]
      },
      "appearance": {
        "strokeWidth": 2.8,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segCB",
      "label": "CB",
      "color": "terracota",
      "layerId": "geometry",
      "order": 45,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gCatetos"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Cateto CB",
        "role": "primary"
      },
      "target": true,
      "targetId": "segCB",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pC",
          "pB"
        ]
      },
      "appearance": {
        "strokeWidth": 2.8,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segAB",
      "label": "AB",
      "color": "pavo",
      "layerId": "geometry",
      "order": 50,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Hipotenusa AB",
        "role": "primary"
      },
      "target": true,
      "targetId": "segAB",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pA",
          "pB"
        ]
      },
      "appearance": {
        "strokeWidth": 3.2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "angC",
      "label": "∠BCA",
      "color": "ocre",
      "layerId": "geometry",
      "order": 60,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo recto en C",
        "role": "primary"
      },
      "target": true,
      "targetId": "angBCA",
      "objectType": "angle",
      "points": [
        "pA",
        "pC",
        "pB"
      ],
      "sweep": "non-reflex",
      "marker": "square",
      "perpendicularRelationId": "perpC",
      "appearance": {
        "radius": 0.55,
        "strokeWidth": 2,
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [
    {
      "id": "perpC",
      "label": "Perpendicularidad en C",
      "enabled": true,
      "type": "perpendicular",
      "supports": [
        [
          "pC",
          "pA"
        ],
        [
          "pC",
          "pB"
        ]
      ]
    }
  ],
  "steps": [],
  "note": "Arrastra C para mover el triángulo, A para rotar y cambiar la base, y B a lo largo de la perpendicular para variar la altura conservando el ángulo recto.",
  "translations": {
    "eu": {
      "title": "Triangelu angeluzuzena",
      "note": "Mugitu C triangelua lekualdatzeko, A oinarria biratu eta aldatzeko, eta B perpendikularrean zehar altuera aldatzeko angelu zuzena mantenduz."
    },
    "en": {
      "title": "Right Triangle",
      "note": "Drag C to move the triangle, A to rotate and stretch the base, and B along the perpendicular to change height while preserving the right angle."
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const TrianguloRectangulo = () => <DiagramRenderer spec={TrianguloRectanguloSpec} />;
