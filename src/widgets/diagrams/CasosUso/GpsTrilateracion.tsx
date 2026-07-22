import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const GpsTrilateracionSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Trilateración en el plano",
  "componentId": "gps-trilateracion",
  "category": "Casos de uso",
  "mode": "simulation",
  "axis": true,
  "grid": false,
  "viewport": {
    "bounds": [
      -6,
      5,
      6,
      -5
    ],
    "home": [
      -6,
      5,
      6,
      -5
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
      "id": "S1",
      "label": "S₁",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 2720,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto fijo S₁",
        "role": "secondary"
      },
      "target": true,
      "targetId": "s1",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3.5,
        "y": 2.7
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
      "id": "S2",
      "label": "S₂",
      "color": "ocre",
      "layerId": "geometry",
      "order": 2730,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto fijo S₂",
        "role": "secondary"
      },
      "target": true,
      "targetId": "s2",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 3.4,
        "y": 2.4
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
      "id": "S3",
      "label": "S₃",
      "color": "pavo",
      "layerId": "geometry",
      "order": 2740,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto fijo S₃",
        "role": "secondary"
      },
      "target": true,
      "targetId": "s3",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.8,
        "y": -2.8
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
      "id": "R",
      "label": "R",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 2750,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto R",
        "role": "primary"
      },
      "target": true,
      "targetId": "R",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0.2,
        "y": -0.2
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
      "id": "H1",
      "label": "H₁",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 2760,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto construido H₁",
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "R.x",
        "y": "S1.y",
        "fallback": [
          0.2,
          2.7
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
      "id": "circ1",
      "label": "Circunferencia de señal S₁",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 2770,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Circunferencia de señal S₁",
        "role": "secondary"
      },
      "target": true,
      "targetId": "circ1",
      "objectType": "path",
      "geometry": {
        "type": "circle",
        "center": "S1",
        "point": "R"
      },
      "appearance": {
        "strokeWidth": 2.4,
        "fillOpacity": 0.02,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "circ2",
      "label": "Circunferencia de señal S₂",
      "color": "ocre",
      "layerId": "geometry",
      "order": 2780,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Circunferencia de señal S₂",
        "role": "secondary"
      },
      "target": true,
      "targetId": "circ2",
      "objectType": "path",
      "geometry": {
        "type": "circle",
        "center": "S2",
        "point": "R"
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2.4,
        "fillOpacity": 0,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "circ3",
      "label": "Circunferencia de señal S₃",
      "color": "pavo",
      "layerId": "geometry",
      "order": 2790,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Circunferencia de señal S₃",
        "role": "secondary"
      },
      "target": true,
      "targetId": "circ3",
      "objectType": "path",
      "geometry": {
        "type": "circle",
        "center": "S3",
        "point": "R"
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2.4,
        "fillOpacity": 0,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "rad1",
      "label": "d₁",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 2800,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "d₁",
        "role": "secondary"
      },
      "target": true,
      "targetId": "rad1",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "S1",
          "R"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "rad2",
      "label": "d₂",
      "color": "ocre",
      "layerId": "geometry",
      "order": 2810,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "d₂",
        "role": "secondary"
      },
      "target": true,
      "targetId": "rad2",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "S2",
          "R"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "rad3",
      "label": "d₃",
      "color": "pavo",
      "layerId": "geometry",
      "order": 2820,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "d₃",
        "role": "secondary"
      },
      "target": true,
      "targetId": "rad3",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "S3",
          "R"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "catH1",
      "label": "Δx",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 2830,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Δx",
        "role": "secondary"
      },
      "target": true,
      "targetId": "catH1",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "S1",
          "H1"
        ]
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "catV1",
      "label": "Δy",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 2840,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Δy",
        "role": "secondary"
      },
      "target": true,
      "targetId": "catV1",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "H1",
          "R"
        ]
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "right1",
      "label": "Ángulo recto",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 2850,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo recto",
        "role": "secondary"
      },
      "target": false,
      "objectType": "angle",
      "points": [
        "S1",
        "H1",
        "R"
      ],
      "sweep": "non-reflex",
      "marker": "square",
      "perpendicularRelationId": "right1-perpendicular",
      "appearance": {
        "radius": 0.45,
        "fillOpacity": 0.22,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "d1",
      "label": "d₁",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 2860,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "d₁",
        "role": "secondary"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "dimension",
        "points": [
          "S1",
          "R"
        ],
        "offset": 0.25
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "d2",
      "label": "d₂",
      "color": "ocre",
      "layerId": "geometry",
      "order": 2870,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "d₂",
        "role": "secondary"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "dimension",
        "points": [
          "S2",
          "R"
        ],
        "offset": 0.25
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "d3",
      "label": "d₃",
      "color": "pavo",
      "layerId": "geometry",
      "order": 2880,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "d₃",
        "role": "secondary"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "dimension",
        "points": [
          "S3",
          "R"
        ],
        "offset": 0.25
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [
    {
      "id": "right1-perpendicular",
      "label": "Perpendicularidad de Ángulo recto",
      "enabled": true,
      "type": "perpendicular",
      "supports": [
        [
          "H1",
          "S1"
        ],
        [
          "H1",
          "R"
        ]
      ]
    }
  ],
  "steps": [],
  "note": "Mueve R. Cada distancia define una circunferencia de posiciones posibles; las tres restricciones coinciden en el receptor."
}
);
/* @matematika-diagram-spec:end */

export const GpsTrilateracion = () => <DiagramRenderer spec={GpsTrilateracionSpec} />;
