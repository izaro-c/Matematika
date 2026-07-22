import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const PitagorasSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Teorema de Pitágoras",
  "componentId": "Pitagoras",
  "category": "Teoremas",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "viewport": {
    "bounds": [
      -8,
      8,
      8,
      -8
    ],
    "home": [
      -8,
      8,
      8,
      -8
    ],
    "minZoom": 0.65,
    "maxZoom": 4,
    "padding": 0.18
  },
  "layers": [
    {
      "id": "construccion",
      "label": "Construcción",
      "order": 0,
      "visible": true,
      "locked": false
    },
    {
      "id": "geometria",
      "label": "Triángulo",
      "order": 3,
      "visible": true,
      "locked": false
    },
    {
      "id": "areas",
      "label": "Cuadrados",
      "order": 1,
      "visible": true,
      "locked": false
    },
    {
      "id": "anotaciones",
      "label": "Medidas",
      "order": 2,
      "visible": true,
      "locked": false
    }
  ],
  "groups": [
    {
      "id": "trianguloGrupo",
      "label": "Triángulo rectángulo",
      "memberIds": [
        "A",
        "B",
        "C",
        "triangulo",
        "segBC",
        "segCA",
        "segAB",
        "anguloRecto"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "primary"
      },
      "target": true,
      "targetId": "triangulo",
      "color": "carbon"
    },
    {
      "id": "cuadradoAGrupo",
      "label": "Cuadrado del cateto a",
      "memberIds": [
        "segBC",
        "cuadradoA"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "primary"
      },
      "target": true,
      "targetId": "cuadrado-a",
      "color": "pavo"
    },
    {
      "id": "cuadradoBGrupo",
      "label": "Cuadrado del cateto b",
      "memberIds": [
        "segCA",
        "cuadradoB"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "primary"
      },
      "target": true,
      "targetId": "cuadrado-b",
      "color": "terracota"
    },
    {
      "id": "cuadradoCGrupo",
      "label": "Cuadrado de la hipotenusa",
      "memberIds": [
        "segAB",
        "cuadradoC"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "primary"
      },
      "target": true,
      "targetId": "cuadrado-c",
      "color": "ocre"
    }
  ],
  "objects": [
    {
      "id": "C",
      "label": "C",
      "color": "carbon",
      "layerId": "geometria",
      "order": 3,
      "visible": true,
      "locked": false,
      "groupIds": [
        "trianguloGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "primary"
      },
      "target": false,
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
        "size": 7,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "ejeX",
      "label": "eje X",
      "color": "carbon",
      "layerId": "construccion",
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
        "x": 1,
        "y": 0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
    },
    {
      "id": "ejeY",
      "label": "eje Y",
      "color": "carbon",
      "layerId": "construccion",
      "order": 2,
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
        "y": 1
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
    },
    {
      "id": "A",
      "label": "A",
      "color": "carbon",
      "layerId": "geometria",
      "order": 1,
      "visible": true,
      "locked": false,
      "groupIds": [
        "trianguloGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "primary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0,
        "y": 4
      },
      "mobility": {
        "type": "on-support",
        "support": "rayoY"
      },
      "appearance": {
        "size": 7,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "B",
      "label": "B",
      "color": "carbon",
      "layerId": "geometria",
      "order": 2,
      "visible": true,
      "locked": false,
      "groupIds": [
        "trianguloGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "primary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 3,
        "y": 0
      },
      "mobility": {
        "type": "on-support",
        "support": "rayoX"
      },
      "appearance": {
        "size": 7,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "sqA3",
      "label": "sqA3",
      "color": "carbon",
      "layerId": "construccion",
      "order": 20,
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
        "type": "expression",
        "x": "C.x",
        "y": "C.y-B.x",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
    },
    {
      "id": "cuadrado-a",
      "label": "sqA4",
      "color": "carbon",
      "layerId": "construccion",
      "order": 21,
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
        "type": "expression",
        "x": "B.x",
        "y": "B.y-B.x",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
    },
    {
      "id": "cuadrado-b",
      "label": "sqB3",
      "color": "carbon",
      "layerId": "construccion",
      "order": 22,
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
        "type": "expression",
        "x": "A.x-A.y",
        "y": "A.y",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
    },
    {
      "id": "sqB4",
      "label": "sqB4",
      "color": "carbon",
      "layerId": "construccion",
      "order": 23,
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
        "type": "expression",
        "x": "C.x-A.y",
        "y": "C.y",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
    },
    {
      "id": "cuadrado-c",
      "label": "sqC3",
      "color": "carbon",
      "layerId": "construccion",
      "order": 24,
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
        "type": "expression",
        "x": "B.x+A.y",
        "y": "B.y+B.x",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
    },
    {
      "id": "sqC4",
      "label": "sqC4",
      "color": "carbon",
      "layerId": "construccion",
      "order": 25,
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
        "type": "expression",
        "x": "A.x+A.y",
        "y": "A.y+B.x",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
    },
    {
      "id": "rayoX",
      "label": "semirrecta horizontal",
      "color": "carbon",
      "layerId": "construccion",
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
        "type": "ray",
        "points": [
          "C",
          "ejeX"
        ]
      },
      "appearance": {}
    },
    {
      "id": "rayoY",
      "label": "semirrecta vertical",
      "color": "carbon",
      "layerId": "construccion",
      "order": 2,
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
        "type": "ray",
        "points": [
          "C",
          "ejeY"
        ]
      },
      "appearance": {}
    },
    {
      "id": "triangulo",
      "label": "triángulo ABC",
      "color": "carbon",
      "layerId": "geometria",
      "order": 10,
      "visible": true,
      "locked": false,
      "groupIds": [
        "trianguloGrupo"
      ],
      "selection": {
        "selectable": true,
        "highlightable": false,
        "role": "secondary"
      },
      "target": false,
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
        "strokeWidth": 2.4,
        "fillOpacity": 0.06,
        "highlightFillOpacity": 0.22,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segBC",
      "label": "cateto a",
      "color": "pavo",
      "layerId": "geometria",
      "order": 11,
      "visible": true,
      "locked": false,
      "groupIds": [
        "trianguloGrupo",
        "cuadradoAGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "B",
          "C"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 4,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segCA",
      "label": "cateto b",
      "color": "terracota",
      "layerId": "geometria",
      "order": 12,
      "visible": true,
      "locked": false,
      "groupIds": [
        "trianguloGrupo",
        "cuadradoBGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "C",
          "A"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 4,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segAB",
      "label": "hipotenusa c",
      "color": "ocre",
      "layerId": "geometria",
      "order": 13,
      "visible": true,
      "locked": false,
      "groupIds": [
        "trianguloGrupo",
        "cuadradoCGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "A",
          "B"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 4.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "anguloRecto",
      "label": "ángulo recto en C",
      "color": "pizarra",
      "layerId": "geometria",
      "order": 14,
      "visible": true,
      "locked": false,
      "groupIds": [
        "trianguloGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "objectType": "angle",
      "points": [
        "B",
        "C",
        "A"
      ],
      "sweep": "non-reflex",
      "marker": "square",
      "perpendicularRelationId": "anguloRecto-perpendicular",
      "appearance": {
        "radius": 0.6,
        "strokeWidth": 1.5,
        "fillOpacity": 0.4,
        "highlightFillOpacity": 0.55,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "cuadradoA",
      "label": "cuadrado sobre a",
      "color": "pavo",
      "layerId": "areas",
      "order": 20,
      "visible": true,
      "locked": false,
      "groupIds": [
        "cuadradoAGrupo"
      ],
      "selection": {
        "selectable": false,
        "highlightable": false,
        "role": "secondary"
      },
      "target": false,
      "objectType": "region",
      "geometry": {
        "type": "area-decomposition",
        "points": [
          "B",
          "C",
          "sqA3",
          "cuadrado-a"
        ],
        "rows": 3,
        "columns": 3
      },
      "appearance": {
        "strokeWidth": 2.4,
        "strokeOpacity": 0.45,
        "fillOpacity": 0.1,
        "highlightFillOpacity": 0.3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "cuadradoB",
      "label": "cuadrado sobre b",
      "color": "terracota",
      "layerId": "areas",
      "order": 21,
      "visible": true,
      "locked": false,
      "groupIds": [
        "cuadradoBGrupo"
      ],
      "selection": {
        "selectable": false,
        "highlightable": false,
        "role": "secondary"
      },
      "target": false,
      "objectType": "region",
      "geometry": {
        "type": "area-decomposition",
        "points": [
          "C",
          "A",
          "cuadrado-b",
          "sqB4"
        ],
        "rows": 4,
        "columns": 4
      },
      "appearance": {
        "strokeWidth": 2.4,
        "strokeOpacity": 0.45,
        "fillOpacity": 0.1,
        "highlightFillOpacity": 0.3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "cuadradoC",
      "label": "cuadrado sobre c",
      "color": "ocre",
      "layerId": "areas",
      "order": 22,
      "visible": true,
      "locked": false,
      "groupIds": [
        "cuadradoCGrupo"
      ],
      "selection": {
        "selectable": false,
        "highlightable": false,
        "role": "secondary"
      },
      "target": false,
      "objectType": "region",
      "geometry": {
        "type": "area-decomposition",
        "points": [
          "A",
          "B",
          "cuadrado-c",
          "sqC4"
        ],
        "rows": 5,
        "columns": 5
      },
      "appearance": {
        "strokeWidth": 2.4,
        "strokeOpacity": 0.5,
        "fillOpacity": 0.12,
        "highlightFillOpacity": 0.35,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "identidad",
      "label": "Panel identidad",
      "color": "terracota",
      "layerId": "geometria",
      "order": 1000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Panel informativo",
        "role": "secondary"
      },
      "target": true,
      "targetId": "infoPanel14",
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "$a^2 + b^2 = c^2 \\implies {B.x^2} + {A.y^2} = {B.x^2 + A.y^2}$",
        "unit": "u²"
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
  "relations": [
    {
      "id": "anguloRecto-perpendicular",
      "label": "Perpendicularidad de ángulo recto en C",
      "enabled": true,
      "type": "perpendicular",
      "supports": [
        [
          "C",
          "B"
        ],
        [
          "C",
          "A"
        ]
      ]
    }
  ],
  "steps": [],
  "note": "Arrastre A y B sobre las semirrectas: las áreas y la igualdad se actualizan sin perder el ángulo recto."
}
);
/* @matematika-diagram-spec:end */

export const Pitagoras = () => <DiagramRenderer spec={PitagorasSpec} />;
