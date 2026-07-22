import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const SumaAngulosSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Suma de los ángulos de un triángulo",
  "componentId": "suma-angulos",
  "category": "Teoremas",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "viewport": {
    "bounds": [
      -5,
      5,
      5,
      -4.5
    ],
    "home": [
      -5,
      5,
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
  "groups": [
    {
      "id": "gTriangle",
      "label": "Triángulo ABC",
      "memberIds": [
        "poly",
        "AB",
        "BC",
        "CA"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo ABC",
        "role": "primary"
      },
      "target": true,
      "targetId": "triangulo",
      "color": "terracota"
    },
    {
      "id": "gAngles",
      "label": "Ángulos interiores",
      "memberIds": [],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulos interiores",
        "role": "primary"
      },
      "target": true,
      "targetId": "angulos",
      "color": "terracota"
    }
  ],
  "objects": [
    {
      "id": "A",
      "label": "A",
      "color": "terracota",
      "layerId": "geometry",
      "order": 12640,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto A",
        "role": "primary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3.5,
        "y": 0
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
      "interaction": {
        "snapToGrid": true,
        "snapSize": 0.25
      }
    },
    {
      "id": "B",
      "label": "B",
      "color": "terracota",
      "layerId": "geometry",
      "order": 11640,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto B",
        "role": "primary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 4.25,
        "y": 0.25
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
      "interaction": {
        "snapToGrid": true,
        "snapSize": 0.25
      }
    },
    {
      "id": "C",
      "label": "C",
      "color": "terracota",
      "layerId": "geometry",
      "order": 9640,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto C",
        "role": "primary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0.25,
        "y": 4.75
      },
      "mobility": {
        "type": "constrained",
        "relationIds": [
          "sameC"
        ]
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {
        "snapToGrid": true,
        "snapSize": 0.25
      }
    },
    {
      "id": "poly",
      "label": "Triángulo ABC",
      "color": "terracota",
      "layerId": "geometry",
      "order": 10640,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTriangle"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo ABC",
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
        "strokeWidth": 3,
        "fillOpacity": 0.1,
        "highlightFillOpacity": 0.28,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "AB",
      "label": "AB",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1620,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTriangle"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "AB",
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
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "BC",
      "label": "BC",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1630,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTriangle"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "BC",
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
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "CA",
      "label": "CA",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1640,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTriangle"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "CA",
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
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "nonReflexAngleBAC",
      "label": "a",
      "color": "musgo",
      "layerId": "geometry",
      "order": 2640,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "nonReflexAngleBAC",
      "objectType": "angle",
      "points": [
        "B",
        "A",
        "C"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 1,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "nonReflexAngleABC",
      "label": "b",
      "color": "musgo",
      "layerId": "geometry",
      "order": 3640,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "nonReflexAngleABC",
      "objectType": "angle",
      "points": [
        "A",
        "B",
        "C"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 1,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "nonReflexAngleACB",
      "label": "c",
      "color": "musgo",
      "layerId": "geometry",
      "order": 4640,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "nonReflexAngleACB",
      "objectType": "angle",
      "points": [
        "A",
        "C",
        "B"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 1,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "label-nonReflexAngleACB",
      "label": "Etiqueta de c",
      "color": "musgo",
      "layerId": "geometry",
      "order": 5640,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Etiqueta de c",
        "role": "annotation"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "label",
      "content": {
        "text": "{nonReflexAngleACB.degrees}º",
        "rules": []
      },
      "anchor": {
        "type": "object",
        "object": "nonReflexAngleACB",
        "parameter": 0.99,
        "offset": [
          -0.5,
          -0.25
        ]
      },
      "appearance": {
        "fontSize": 17,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "label-nonReflexAngleBAC",
      "label": "Etiqueta de a",
      "color": "musgo",
      "layerId": "geometry",
      "order": 6640,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Etiqueta de a",
        "role": "annotation"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "label",
      "content": {
        "text": "{nonReflexAngleBAC.degrees}º"
      },
      "anchor": {
        "type": "object",
        "object": "nonReflexAngleBAC",
        "parameter": 0.08,
        "offset": [
          0,
          0
        ]
      },
      "appearance": {
        "fontSize": 17,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "label-nonReflexAngleABC",
      "label": "Etiqueta de b",
      "color": "musgo",
      "layerId": "geometry",
      "order": 7640,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": true,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Etiqueta de b",
        "role": "annotation"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "label",
      "content": {
        "text": "{nonReflexAngleABC.degrees}º"
      },
      "anchor": {
        "type": "object",
        "object": "nonReflexAngleABC",
        "parameter": 0.5,
        "offset": [
          -0.95,
          -0.15
        ]
      },
      "appearance": {
        "fontSize": 17,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "infoPanel11",
      "label": "Panel informativo",
      "color": "terracota",
      "layerId": "geometry",
      "order": 8640,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Panel informativo",
        "role": "secondary"
      },
      "target": true,
      "targetId": "infoPanel11",
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "",
        "blocks": [
          {
            "id": "bloque-1",
            "text": "${nonReflexAngleBAC.degrees}º + {nonReflexAngleABC.degrees}º + {nonReflexAngleACB.degrees}º = {value}º$",
            "expression": "nonReflexAngleBAC.degrees + nonReflexAngleABC.degrees + nonReflexAngleACB.degrees",
            "rules": []
          }
        ],
        "layout": "stack"
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
      "id": "sameC",
      "label": "C no cruza AB",
      "enabled": true,
      "type": "same-half-plane",
      "points": [
        "C",
        "A"
      ],
      "boundary": "B"
    }
  ],
  "steps": [],
  "note": "Mueve A, B y C"
}
);
/* @matematika-diagram-spec:end */

export const SumaAngulos = () => <DiagramRenderer spec={SumaAngulosSpec} />;
