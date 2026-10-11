import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const CuadradoSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Cuadrado",
  "componentId": "cuadrado",
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
      -5
    ],
    "home": [
      -5,
      5,
      5,
      -5
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
      "id": "gLados",
      "label": "Cuatro lados congruentes",
      "memberIds": [
        "segAB",
        "segBC",
        "segCD",
        "segDA"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Cuatro lados congruentes",
        "role": "primary"
      },
      "target": true,
      "targetId": "lados",
      "color": "terracota"
    },
    {
      "id": "gAngulosRectos",
      "label": "Cuatro ángulos rectos",
      "memberIds": [
        "angA",
        "angB",
        "angC",
        "angD"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Cuatro ángulos rectos",
        "role": "primary"
      },
      "target": true,
      "targetId": "angulos-rectos",
      "color": "ocre"
    },
    {
      "id": "gDiagonales",
      "label": "Diagonales perpendiculares",
      "memberIds": [
        "diagAC",
        "diagBD"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Diagonales perpendiculares",
        "role": "secondary"
      },
      "target": true,
      "targetId": "diagonales",
      "color": "mora"
    }
  ],
  "objects": [
    {
      "id": "pA",
      "label": "A",
      "color": "carbon",
      "layerId": "geometry",
      "order": 10,
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
        "x": -2,
        "y": -2
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
      "color": "carbon",
      "layerId": "geometry",
      "order": 20,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértice B",
        "role": "primary"
      },
      "target": true,
      "targetId": "pB",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2,
        "y": -2
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
      "id": "pC",
      "label": "C",
      "color": "carbon",
      "layerId": "geometry",
      "order": 30,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértice C",
        "role": "secondary"
      },
      "target": true,
      "targetId": "pC",
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "pB.x+pA.y-pB.y",
        "y": "pB.y-pA.x+pB.x",
        "fallback": [
          2,
          2
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
      "id": "pD",
      "label": "D",
      "color": "carbon",
      "layerId": "geometry",
      "order": 40,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértice D",
        "role": "secondary"
      },
      "target": true,
      "targetId": "pD",
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "pA.x+pA.y-pB.y",
        "y": "pA.y-pA.x+pB.x",
        "fallback": [
          -2,
          2
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
      "id": "polyABCD",
      "label": "ABCD",
      "color": "canela",
      "layerId": "geometry",
      "order": 5,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Cuadrado ABCD",
        "role": "primary"
      },
      "target": true,
      "targetId": "cuadrilatero",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "pA",
          "pB",
          "pC",
          "pD"
        ]
      },
      "appearance": {
        "fillOpacity": 0.12,
        "strokeWidth": 0,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segAB",
      "label": "AB",
      "color": "terracota",
      "layerId": "geometry",
      "order": 50,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gLados"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado AB",
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
        "strokeWidth": 2.8,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segBC",
      "label": "BC",
      "color": "terracota",
      "layerId": "geometry",
      "order": 55,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gLados"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado BC",
        "role": "primary"
      },
      "target": true,
      "targetId": "segBC",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pB",
          "pC"
        ]
      },
      "appearance": {
        "strokeWidth": 2.8,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segCD",
      "label": "CD",
      "color": "terracota",
      "layerId": "geometry",
      "order": 60,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gLados"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado CD",
        "role": "primary"
      },
      "target": true,
      "targetId": "segCD",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pC",
          "pD"
        ]
      },
      "appearance": {
        "strokeWidth": 2.8,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segDA",
      "label": "DA",
      "color": "terracota",
      "layerId": "geometry",
      "order": 65,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gLados"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado DA",
        "role": "primary"
      },
      "target": true,
      "targetId": "segDA",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pD",
          "pA"
        ]
      },
      "appearance": {
        "strokeWidth": 2.8,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "diagAC",
      "label": "AC",
      "color": "mora",
      "layerId": "geometry",
      "order": 45,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gDiagonales"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Diagonal AC",
        "role": "secondary"
      },
      "target": true,
      "targetId": "diagAC",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pA",
          "pC"
        ]
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 1.8,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "diagBD",
      "label": "BD",
      "color": "mora",
      "layerId": "geometry",
      "order": 46,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gDiagonales"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Diagonal BD",
        "role": "secondary"
      },
      "target": true,
      "targetId": "diagBD",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pB",
          "pD"
        ]
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 1.8,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "angA",
      "label": "∠DAB",
      "color": "ocre",
      "layerId": "geometry",
      "order": 70,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gAngulosRectos"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo recto en A",
        "role": "primary"
      },
      "target": true,
      "targetId": "angDAB",
      "objectType": "angle",
      "points": [
        "pD",
        "pA",
        "pB"
      ],
      "sweep": "non-reflex",
      "marker": "square",
      "perpendicularRelationId": "perpA",
      "appearance": {
        "radius": 0.5,
        "strokeWidth": 2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "angB",
      "label": "∠ABC",
      "color": "ocre",
      "layerId": "geometry",
      "order": 75,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gAngulosRectos"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo recto en B",
        "role": "primary"
      },
      "target": true,
      "targetId": "angABC",
      "objectType": "angle",
      "points": [
        "pA",
        "pB",
        "pC"
      ],
      "sweep": "non-reflex",
      "marker": "square",
      "perpendicularRelationId": "perpB",
      "appearance": {
        "radius": 0.5,
        "strokeWidth": 2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "angC",
      "label": "∠BCD",
      "color": "ocre",
      "layerId": "geometry",
      "order": 80,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gAngulosRectos"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo recto en C",
        "role": "primary"
      },
      "target": true,
      "targetId": "angBCD",
      "objectType": "angle",
      "points": [
        "pB",
        "pC",
        "pD"
      ],
      "sweep": "non-reflex",
      "marker": "square",
      "perpendicularRelationId": "perpC",
      "appearance": {
        "radius": 0.5,
        "strokeWidth": 2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "angD",
      "label": "∠CDA",
      "color": "ocre",
      "layerId": "geometry",
      "order": 85,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gAngulosRectos"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo recto en D",
        "role": "primary"
      },
      "target": true,
      "targetId": "angCDA",
      "objectType": "angle",
      "points": [
        "pC",
        "pD",
        "pA"
      ],
      "sweep": "non-reflex",
      "marker": "square",
      "perpendicularRelationId": "perpD",
      "appearance": {
        "radius": 0.5,
        "strokeWidth": 2,
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [
    {
      "id": "perpA",
      "label": "Perpendicularidad en A",
      "enabled": true,
      "type": "perpendicular",
      "supports": [
        [
          "pA",
          "pD"
        ],
        [
          "pA",
          "pB"
        ]
      ]
    },
    {
      "id": "perpB",
      "label": "Perpendicularidad en B",
      "enabled": true,
      "type": "perpendicular",
      "supports": [
        [
          "pB",
          "pA"
        ],
        [
          "pB",
          "pC"
        ]
      ]
    },
    {
      "id": "perpC",
      "label": "Perpendicularidad en C",
      "enabled": true,
      "type": "perpendicular",
      "supports": [
        [
          "pC",
          "pB"
        ],
        [
          "pC",
          "pD"
        ]
      ]
    },
    {
      "id": "perpD",
      "label": "Perpendicularidad en D",
      "enabled": true,
      "type": "perpendicular",
      "supports": [
        [
          "pD",
          "pC"
        ],
        [
          "pD",
          "pA"
        ]
      ]
    }
  ],
  "steps": [],
  "note": "Arrastra los vértices A y B para rotar, trasladar o escalar el cuadrado manteniendo sus cuatro lados iguales y sus cuatro ángulos rectos.",
  "translations": {
    "eu": {
      "title": "Karratua",
      "note": "Mugitu A eta B erpinak karratua biratzeko, lekualdatzeko edo eskalatzeko, lau aldeak berdin eta lau angeluak zuzen mantenduz."
    },
    "en": {
      "title": "Square",
      "note": "Drag vertices A and B to rotate, translate, or scale the square while preserving its four equal sides and four right angles."
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const Cuadrado = () => <DiagramRenderer spec={CuadradoSpec} />;
