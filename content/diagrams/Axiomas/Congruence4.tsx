import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const Congruence4Spec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Axioma de Congruencia IV",
  "componentId": "axioma-de-congruencia-iv",
  "category": "Axiomas",
  "mode": "simulation",
  "axis": false,
  "grid": false,
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
      "id": "controls",
      "label": "Controles",
      "order": 1,
      "visible": true,
      "locked": false
    }
  ],
  "groups": [
    {
      "id": "group1",
      "label": "Ángulo AOB",
      "memberIds": [
        "pO",
        "pA",
        "pB",
        "rayOA",
        "rayOB",
        "nonReflexAngleAOB"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": true,
      "targetId": "angleAOB"
    },
    {
      "id": "group2",
      "label": "Ángulo A'O'B'",
      "memberIds": [
        "pOO",
        "pAA",
        "pBB",
        "rayOOAA",
        "rayOOBB",
        "nonReflexAngleAAOOBB"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": true,
      "targetId": "angleAOBPrime"
    },
    {
      "id": "group3",
      "label": "Ángulos Congruentes",
      "memberIds": [
        "nonReflexAngleAOB",
        "nonReflexAngleAAOOBB"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": true,
      "targetId": "angles"
    }
  ],
  "objects": [
    {
      "id": "pA",
      "label": "A",
      "color": "ocre",
      "layerId": "geometry",
      "order": 9,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto A",
        "role": "primary"
      },
      "target": true,
      "targetId": "pA",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 1,
        "y": 1
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 7,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pB",
      "label": "B",
      "color": "ocre",
      "layerId": "geometry",
      "order": 8,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto B",
        "role": "primary"
      },
      "target": true,
      "targetId": "pB",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0.19,
        "y": 3.48
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 7,
        "highlightSize": 11,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pO",
      "label": "O",
      "color": "terracota",
      "layerId": "geometry",
      "order": 10,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto C",
        "role": "primary"
      },
      "target": true,
      "targetId": "pO",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3,
        "y": 1
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 7,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pAA",
      "label": "A'",
      "color": "ocre",
      "layerId": "geometry",
      "order": 11,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto C",
        "role": "primary"
      },
      "target": true,
      "targetId": "pAA",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 3.1,
        "y": -2.43
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 7,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pBB",
      "label": "B'",
      "color": "pavo",
      "layerId": "geometry",
      "order": 12,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto C",
        "role": "primary"
      },
      "target": true,
      "targetId": "pBB",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 1.451980406249219,
        "y": -0.042567554581359524
      },
      "mobility": {
        "type": "constrained",
        "relationIds": [
          "equalAnglenonReflexAngleAAOOBB"
        ]
      },
      "appearance": {
        "size": 7,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pOO",
      "label": "O'",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto C",
        "role": "primary"
      },
      "target": true,
      "targetId": "pOO",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -1.62,
        "y": -2.41
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 7,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "rayOB",
      "label": "Semirrecta",
      "color": "ocre",
      "layerId": "geometry",
      "order": 2,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "highlightable": true,
        "ariaLabel": "Semirrecta",
        "role": "secondary"
      },
      "target": true,
      "targetId": "rayOB",
      "objectType": "path",
      "geometry": {
        "type": "ray",
        "points": [
          "pO",
          "pB"
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "rayOA",
      "label": "Semirrecta",
      "color": "ocre",
      "layerId": "geometry",
      "order": 3,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "highlightable": true,
        "ariaLabel": "Semirrecta",
        "role": "secondary"
      },
      "target": true,
      "targetId": "rayOA",
      "objectType": "path",
      "geometry": {
        "type": "ray",
        "points": [
          "pO",
          "pA"
        ]
      },
      "appearance": {}
    },
    {
      "id": "rayOOBB",
      "label": "Semirrecta",
      "color": "pavo",
      "layerId": "geometry",
      "order": 4,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "highlightable": true,
        "ariaLabel": "Semirrecta",
        "role": "secondary"
      },
      "target": true,
      "targetId": "rayOOBB",
      "objectType": "path",
      "geometry": {
        "type": "ray",
        "points": [
          "pOO",
          "pBB"
        ]
      },
      "appearance": {
        "dashed": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "rayOOAA",
      "label": "Semirrecta",
      "color": "ocre",
      "layerId": "geometry",
      "order": 5,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "highlightable": true,
        "ariaLabel": "Semirrecta",
        "role": "secondary"
      },
      "target": true,
      "targetId": "rayOOAA",
      "objectType": "path",
      "geometry": {
        "type": "ray",
        "points": [
          "pOO",
          "pAA"
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "nonReflexAngleAOB",
      "label": "$\\alpha$",
      "color": "terracota",
      "layerId": "geometry",
      "order": 6,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "nonReflexAngleAOB",
      "objectType": "angle",
      "points": [
        "pA",
        "pO",
        "pB"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 1,
        "fillOpacity": 0.2,
        "highlightFillOpacity": 0.4,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "nonReflexAngleAAOOBB",
      "label": "$\\alpha '$",
      "color": "terracota",
      "layerId": "geometry",
      "order": 7,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "nonReflexAngleAAOOBB",
      "objectType": "angle",
      "points": [
        "pAA",
        "pOO",
        "pBB"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 1,
        "fillOpacity": 0.2,
        "highlightFillOpacity": 0.4,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "Semiplano",
      "label": "Semiplano",
      "color": "mora",
      "layerId": "geometry",
      "order": 13,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": false,
        "ariaLabel": "Semiplano",
        "role": "secondary"
      },
      "target": true,
      "targetId": "Semiplano",
      "objectType": "area",
      "geometry": {
        "type": "half-plane",
        "boundary": [
          "pAA",
          "pOO"
        ],
        "side": "pBB"
      },
      "appearance": {
        "strokeWidth": 0,
        "fillOpacity": 0,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "r",
      "label": "$r'$",
      "color": "carbon",
      "layerId": "geometry",
      "order": 0,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta",
        "role": "secondary"
      },
      "target": true,
      "targetId": "r",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "through-points",
          "points": [
            "pOO",
            "pAA"
          ]
        }
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2.4,
        "labelVisible": true,
        "labelOffset": [
          0,
          12
        ],
        "labelPosition": 0.31,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [
    {
      "id": "equalAnglenonReflexAngleAAOOBB",
      "label": "$\\alpha '$ tiene la misma amplitud que $\\alpha$",
      "enabled": true,
      "type": "equal-angle",
      "angles": [
        "nonReflexAngleAAOOBB",
        "nonReflexAngleAOB"
      ],
      "drivenPoint": "pBB"
    }
  ],
  "steps": [],
  "note": "Arrastra A, B, O, A' y O'"
}
);
/* @matematika-diagram-spec:end */

export const Congruence4 = () => <DiagramRenderer spec={Congruence4Spec} />;
