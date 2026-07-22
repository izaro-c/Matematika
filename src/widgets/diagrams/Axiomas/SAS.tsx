import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const SASSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Axioma de Congruencia V",
  "componentId": "axioma-de-congruencia-v",
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
      "label": "Aldeak",
      "memberIds": [
        "pA",
        "pB",
        "pC",
        "pAA",
        "pBB",
        "pCC",
        "segAB",
        "segAC",
        "segAABB",
        "segAACC",
        "congruenceMarkAB",
        "congruenceMarkAC",
        "congruenceMarkAABB",
        "congruenceMarkAACC"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": true,
      "targetId": "sides"
    },
    {
      "id": "group2",
      "label": "Angeluak",
      "memberIds": [
        "nonReflexAngleBAC",
        "nonReflexAngleBBAACC"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": true,
      "targetId": "angles"
    },
    {
      "id": "group3",
      "label": "Guztia",
      "memberIds": [
        "pA",
        "pB",
        "pC",
        "pBB",
        "pCC",
        "pAA",
        "segAB",
        "segAC",
        "segBC",
        "nonReflexAngleBAC",
        "segAABB",
        "segAACC",
        "segBBCC",
        "nonReflexAngleBBAACC",
        "congruenceMarkAB",
        "congruenceMarkAC",
        "congruenceMarkAABB",
        "congruenceMarkAACC",
        "nonReflexAngleCBA",
        "nonReflexAngleACB",
        "nonReflexAngleBBCCAA",
        "nonReflexAngleAABBCC",
        "congruenceMarkBC",
        "congruenceMarkBBCC"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": true,
      "targetId": "all"
    }
  ],
  "objects": [
    {
      "id": "pA",
      "label": "A",
      "color": "ocre",
      "layerId": "geometry",
      "order": 7000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group3"
      ],
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
        "x": -4.21,
        "y": 2.47
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
      "order": 8000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group3"
      ],
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
        "x": -6,
        "y": -2.4
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
      "id": "pC",
      "label": "C",
      "color": "ocre",
      "layerId": "geometry",
      "order": 9000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto C",
        "role": "primary"
      },
      "target": true,
      "targetId": "pC",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -1.53,
        "y": -2
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
      "color": "pizarra",
      "layerId": "geometry",
      "order": 20000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto D",
        "role": "primary"
      },
      "target": true,
      "targetId": "pAA",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 3.07,
        "y": 2.76
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
      "color": "pizarra",
      "layerId": "geometry",
      "order": 22000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto D",
        "role": "primary"
      },
      "target": true,
      "targetId": "pBB",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 1.7598904992544793,
        "y": -2.2604196135439043
      },
      "mobility": {
        "type": "constrained",
        "relationIds": [
          "equalLengthsegAABB"
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
      "id": "pCC",
      "label": "C'",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 21000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group3",
        "group1"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto D",
        "role": "primary"
      },
      "target": true,
      "targetId": "pCC",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 6.17016740344622,
        "y": -1.42954198816643
      },
      "mobility": {
        "type": "constrained",
        "relationIds": [
          "equalLengthsegAACC",
          "equalAnglenonReflexAngleBBAACC"
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
      "id": "segAB",
      "label": "Segmento",
      "color": "ocre",
      "layerId": "geometry",
      "order": 3000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
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
        "strokeWidth": 3.5,
        "highlightStrokeWidth": 5.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segAC",
      "label": "Segmento",
      "color": "pavo",
      "layerId": "geometry",
      "order": 4000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
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
        "strokeWidth": 3.5,
        "highlightStrokeWidth": 5.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segBC",
      "label": "Segmento",
      "color": "carbon",
      "layerId": "geometry",
      "order": 5000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group3"
      ],
      "selection": {
        "selectable": true,
        "highlightable": false,
        "ariaLabel": "Segmento",
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
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "nonReflexAngleBAC",
      "label": "$\\alpha$",
      "color": "terracota",
      "layerId": "geometry",
      "order": -2000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group2",
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "nonReflexAngleBAC",
      "objectType": "angle",
      "points": [
        "pB",
        "pA",
        "pC"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 1,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segAABB",
      "label": "Segmento",
      "color": "ocre",
      "layerId": "geometry",
      "order": 13000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segAABB",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pAA",
          "pBB"
        ]
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 3.5,
        "highlightStrokeWidth": 5.5
      }
    },
    {
      "id": "segAACC",
      "label": "Segmento",
      "color": "pavo",
      "layerId": "geometry",
      "order": 14000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segAACC",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pAA",
          "pCC"
        ]
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 3.5,
        "highlightStrokeWidth": 5.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segBBCC",
      "label": "Segmento",
      "color": "carbon",
      "layerId": "geometry",
      "order": 15000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segBBCC",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pBB",
          "pCC"
        ]
      },
      "appearance": {
        "dashed": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "nonReflexAngleBBAACC",
      "label": "$\\alpha'$",
      "color": "terracota",
      "layerId": "geometry",
      "order": -1000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group2",
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "nonReflexAngleBBAACC",
      "objectType": "angle",
      "points": [
        "pBB",
        "pAA",
        "pCC"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 1,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "congruenceMarkAB",
      "label": "Marca de congruencia de Segmento",
      "color": "ocre",
      "layerId": "geometry",
      "order": 16000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia de Segmento",
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
      "count": 1,
      "height": 0.75,
      "appearance": {
        "strokeWidth": 2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "congruenceMarkAC",
      "label": "Marca de congruencia de Segmento",
      "color": "pavo",
      "layerId": "geometry",
      "order": 17000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia de Segmento",
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
      "height": 0.75,
      "appearance": {
        "strokeWidth": 2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "congruenceMarkAABB",
      "label": "Marca de congruencia de Segmento",
      "color": "ocre",
      "layerId": "geometry",
      "order": 18000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia de Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "congruenceMarkAABB",
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "pAA",
          "pBB"
        ]
      },
      "count": 1,
      "height": 0.75,
      "appearance": {
        "strokeWidth": 2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "congruenceMarkAACC",
      "label": "Marca de congruencia de Segmento",
      "color": "pavo",
      "layerId": "geometry",
      "order": 19000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group1",
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia de Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "congruenceMarkAACC",
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "pAA",
          "pCC"
        ]
      },
      "count": 2,
      "height": 0.75,
      "appearance": {
        "strokeWidth": 2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "nonReflexAngleCBA",
      "label": "$\\space$",
      "color": "ocre",
      "layerId": "geometry",
      "order": 23000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "nonReflexAngleCBA",
      "objectType": "angle",
      "points": [
        "pC",
        "pB",
        "pA"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 1,
        "strokeWidth": 0,
        "fillOpacity": 0,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "nonReflexAngleACB",
      "label": "$\\space$",
      "color": "pavo",
      "layerId": "geometry",
      "order": 24000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "nonReflexAngleACB",
      "objectType": "angle",
      "points": [
        "pA",
        "pC",
        "pB"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 1,
        "strokeWidth": 0,
        "fillOpacity": 0,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "nonReflexAngleBBCCAA",
      "label": "$\\space$",
      "color": "pavo",
      "layerId": "geometry",
      "order": 25000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "nonReflexAngleBBCCAA",
      "objectType": "angle",
      "points": [
        "pBB",
        "pCC",
        "pAA"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 1,
        "strokeWidth": 0,
        "fillOpacity": 0,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "nonReflexAngleAABBCC",
      "label": "$\\space$",
      "color": "ocre",
      "layerId": "geometry",
      "order": 26000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo no reflejo (≤ 180°)",
        "role": "secondary"
      },
      "target": true,
      "targetId": "nonReflexAngleAABBCC",
      "objectType": "angle",
      "points": [
        "pAA",
        "pBB",
        "pCC"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 1,
        "strokeWidth": 0,
        "fillOpacity": 0,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "congruenceMarkBC",
      "label": "Marca de congruencia de Segmento",
      "color": "carbon",
      "layerId": "geometry",
      "order": 27000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia de Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "congruenceMarkBC",
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "pB",
          "pC"
        ]
      },
      "count": 3,
      "height": 1,
      "appearance": {
        "strokeWidth": 0,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "congruenceMarkBBCC",
      "label": "Marca de congruencia de Segmento",
      "color": "carbon",
      "layerId": "geometry",
      "order": 28000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group3"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia de Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "congruenceMarkBBCC",
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "pBB",
          "pCC"
        ]
      },
      "count": 3,
      "height": 1,
      "appearance": {
        "strokeWidth": 0,
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [
    {
      "id": "equalLengthsegAABB",
      "label": "Segmento tiene la misma longitud que Segmento",
      "enabled": true,
      "type": "equal-length",
      "segments": [
        "segAABB",
        "segAB"
      ],
      "drivenPoint": "pBB"
    },
    {
      "id": "equalLengthsegAACC",
      "label": "Segmento tiene la misma longitud que Segmento",
      "enabled": true,
      "type": "equal-length",
      "segments": [
        "segAACC",
        "segAC"
      ],
      "drivenPoint": "pCC"
    },
    {
      "id": "equalAnglenonReflexAngleBBAACC",
      "label": "$\\alpha'$ tiene la misma amplitud que $\\alpha$",
      "enabled": true,
      "type": "equal-angle",
      "angles": [
        "nonReflexAngleBBAACC",
        "nonReflexAngleBAC"
      ],
      "drivenPoint": "pCC"
    }
  ],
  "steps": [],
  "note": "Arrastra A, B y C"
}
);
/* @matematika-diagram-spec:end */

export const SAS = () => <DiagramRenderer spec={SASSpec} />;
