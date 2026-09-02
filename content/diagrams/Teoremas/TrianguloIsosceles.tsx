import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const TrianguloIsoscelesSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Triángulo Isósceles",
  "componentId": "triangulo-isosceles",
  "category": "Teoremas",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "showLabels": true,
  "viewport": {
    "bounds": [
      -5,
      6,
      5,
      -4
    ],
    "home": [
      -5,
      6,
      5,
      -4
    ],
    "minZoom": 0.2,
    "maxZoom": 12,
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
      "id": "pB",
      "label": "B",
      "color": "terracota",
      "layerId": "geometry",
      "order": 8000,
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
        "x": -3,
        "y": -2
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
      "order": 8001,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértice C",
        "role": "primary"
      },
      "target": true,
      "targetId": "pC",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 3,
        "y": -2
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
      "id": "pA",
      "label": "A",
      "color": "terracota",
      "layerId": "geometry",
      "order": 9000,
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
        "x": 0,
        "y": 3.5
      },
      "mobility": {
        "type": "on-support",
        "support": "lineMediatriz"
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
      "id": "midBC",
      "label": "M",
      "color": "musgo",
      "layerId": "geometry",
      "order": 7000,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "ariaLabel": "Punto medio de BC",
        "role": "secondary"
      },
      "target": false,
      "targetId": "midBC",
      "objectType": "point",
      "definition": {
        "type": "midpoint",
        "points": [
          "pB",
          "pC"
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "lineMediatriz",
      "label": "Eje de simetría",
      "color": "musgo",
      "layerId": "geometry",
      "order": 1000,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "ariaLabel": "Mediatriz de BC",
        "role": "secondary"
      },
      "target": false,
      "targetId": "lineMediatriz",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "perpendicular",
          "linePoints": [
            "pB",
            "pC"
          ],
          "through": "midBC"
        }
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "polyABC",
      "label": "Triángulo ABC",
      "color": "canela",
      "layerId": "geometry",
      "order": 500,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo isósceles ABC",
        "role": "primary"
      },
      "target": true,
      "targetId": "polyABC",
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
        "strokeWidth": 1,
        "fillOpacity": 0.12,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segBC",
      "label": "Base BC",
      "color": "carbon",
      "layerId": "geometry",
      "order": 1000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Base BC",
        "role": "secondary"
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
        "strokeWidth": 2.5,
        "highlightStrokeWidth": 3.2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segAB",
      "label": "Lado AB",
      "color": "carbon",
      "layerId": "geometry",
      "order": 1001,
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
          "pA",
          "pB"
        ]
      },
      "appearance": {
        "strokeWidth": 2.5,
        "highlightStrokeWidth": 3.2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segAC",
      "label": "Lado AC",
      "color": "carbon",
      "layerId": "geometry",
      "order": 1002,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado AC",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segAC",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pA",
          "pC"
        ]
      },
      "appearance": {
        "strokeWidth": 2.5,
        "highlightStrokeWidth": 3.2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "congruenceMarkAB",
      "label": "Marca AB",
      "color": "ocre",
      "layerId": "geometry",
      "order": 11000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia en AB",
        "role": "secondary"
      },
      "target": true,
      "targetId": "congruenceMarkAB",
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "pA",
          "pB"
        ]
      },
      "count": 2,
      "height": 0.5,
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "congruenceMarkAC",
      "label": "Marca AC",
      "color": "ocre",
      "layerId": "geometry",
      "order": 11001,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia en AC",
        "role": "secondary"
      },
      "target": true,
      "targetId": "congruenceMarkAC",
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "pA",
          "pC"
        ]
      },
      "count": 2,
      "height": 0.5,
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "anguloB",
      "label": "Ángulo en B",
      "color": "mora",
      "layerId": "geometry",
      "order": 12000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo en el vértice B",
        "role": "secondary"
      },
      "target": true,
      "targetId": "anguloB",
      "objectType": "angle",
      "points": [
        "pC",
        "pB",
        "pA"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 0.9,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "anguloC",
      "label": "Ángulo en C",
      "color": "mora",
      "layerId": "geometry",
      "order": 12001,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo en el vértice C",
        "role": "secondary"
      },
      "target": true,
      "targetId": "anguloC",
      "objectType": "angle",
      "points": [
        "pA",
        "pC",
        "pB"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 0.9,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "measurementSides",
      "label": "Medición de lados",
      "color": "carbon",
      "layerId": "annotations",
      "order": 13000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Medición de lados",
        "role": "annotation"
      },
      "target": true,
      "targetId": "measurementSides",
      "objectType": "annotation",
      "variant": "measurement",
      "content": {
        "text": "AB = AC = {value}",
        "expression": "segAB.length",
        "unit": "u",
        "precision": 2
      },
      "anchor": {
        "type": "object",
        "object": "pA"
      },
      "measurement": {
        "refs": [
          "pA",
          "pB"
        ],
        "mode": "distance"
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [],
  "steps": [],
  "note": "Arrastra el vértice A a lo largo del eje para modificar la altura del triángulo manteniendo AB ≅ AC.",
  "translations": {
    "eu": {
      "title": "Triangelu Isoszelea",
      "note": "Arrastatu A erpina ardatzean zehar triangeluaren altuera aldatzeko, AB ≅ AC mantenduz."
    },
    "en": {
      "title": "Isosceles Triangle",
      "note": "Drag vertex A along the axis to change the height while maintaining AB ≅ AC."
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const TrianguloIsosceles = () => <DiagramRenderer spec={TrianguloIsoscelesSpec} />;
