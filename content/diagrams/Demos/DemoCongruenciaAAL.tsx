import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const DemoCongruenciaAALSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Demostración: Criterio de congruencia AAL",
  "componentId": "demo-congruencia-aal",
  "category": "Demos",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "showLabels": true,
  "viewport": {
    "bounds": [
      -6,
      4.5,
      6,
      -3.5
    ],
    "home": [
      -6,
      4.5,
      6,
      -3.5
    ],
    "minZoom": 0.3,
    "maxZoom": 5,
    "padding": 0.15
  },
  "layers": [
    {
      "id": "geometry",
      "label": "Geometría base",
      "order": 0,
      "visible": true,
      "locked": false
    },
    {
      "id": "construction",
      "label": "Construcción auxiliar",
      "order": 1,
      "visible": true,
      "locked": false
    }
  ],
  "groups": [
    {
      "id": "gTri1",
      "label": "Triángulo ABC",
      "memberIds": [
        "polyABC",
        "segAB",
        "segBC",
        "segAC",
        "pA",
        "pB",
        "pC",
        "angA",
        "angB"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo ABC",
        "role": "primary"
      },
      "target": true,
      "targetId": "triangulo-abc",
      "color": "carbon"
    },
    {
      "id": "gTri2",
      "label": "Triángulo A'B'C'",
      "memberIds": [
        "polyA2B2C2",
        "segA2B2",
        "segB2C2",
        "segA2C2",
        "pA2",
        "pB2",
        "pC2",
        "angA2",
        "angB2"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo A'B'C'",
        "role": "primary"
      },
      "target": true,
      "targetId": "triangulo-apbpcp",
      "color": "carbon"
    }
  ],
  "objects": [
    {
      "id": "pB",
      "label": "B",
      "color": "carbon",
      "layerId": "geometry",
      "order": 20,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTri1"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértice B",
        "role": "secondary"
      },
      "target": true,
      "targetId": "pB",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -4.5,
        "y": -2
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pC",
      "label": "C",
      "color": "carbon",
      "layerId": "geometry",
      "order": 21,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTri1"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértice C",
        "role": "secondary"
      },
      "target": true,
      "targetId": "pC",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -1.5,
        "y": -2
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pA",
      "label": "A",
      "color": "terracota",
      "layerId": "geometry",
      "order": 22,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTri1"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértice A (arrastrable)",
        "role": "primary"
      },
      "target": true,
      "targetId": "pA",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3.5,
        "y": 1.8
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pB2",
      "label": "B'",
      "color": "carbon",
      "layerId": "geometry",
      "order": 23,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTri2"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértice B'",
        "role": "secondary"
      },
      "target": true,
      "targetId": "pB2",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 1.5,
        "y": -2
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pC2",
      "label": "C'",
      "color": "carbon",
      "layerId": "geometry",
      "order": 24,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTri2"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértice C'",
        "role": "secondary"
      },
      "target": true,
      "targetId": "pC2",
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "pB2.x + pC.x - pB.x",
        "y": "pB2.y",
        "fallback": [
          4.5,
          -2
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pA2",
      "label": "A'",
      "color": "carbon",
      "layerId": "geometry",
      "order": 25,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTri2"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértice A'",
        "role": "secondary"
      },
      "target": true,
      "targetId": "pA2",
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "pB2.x + pA.x - pB.x",
        "y": "pB2.y + pA.y - pB.y",
        "fallback": [
          2.5,
          1.8
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pD",
      "label": "D",
      "color": "terracota",
      "layerId": "construction",
      "order": 26,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto auxiliar D",
        "role": "construction"
      },
      "target": true,
      "targetId": "punto-d",
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "pB.x + 0.55 * (pA.x - pB.x)",
        "y": "pB.y + 0.55 * (pA.y - pB.y)",
        "fallback": [
          -3.95,
          0.09
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segAB",
      "label": "Lado AB",
      "color": "carbon",
      "layerId": "geometry",
      "order": 10,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTri1"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado AB",
        "role": "primary"
      },
      "target": true,
      "targetId": "lado-ab",
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
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segBC",
      "label": "Lado BC",
      "color": "carbon",
      "layerId": "geometry",
      "order": 11,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTri1"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado BC",
        "role": "primary"
      },
      "target": true,
      "targetId": "lado-bc",
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
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segAC",
      "label": "Lado AC",
      "color": "carbon",
      "layerId": "geometry",
      "order": 12,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTri1"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado AC",
        "role": "primary"
      },
      "target": true,
      "targetId": "lado-ac",
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
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "polyABC",
      "label": "Triángulo ABC",
      "color": "canela",
      "layerId": "geometry",
      "order": 5,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTri1"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo ABC",
        "role": "secondary"
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
        "fillOpacity": 0.1,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segA2B2",
      "label": "Lado A'B'",
      "color": "carbon",
      "layerId": "geometry",
      "order": 13,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTri2"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado A'B'",
        "role": "primary"
      },
      "target": true,
      "targetId": "lado-apbp",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pA2",
          "pB2"
        ]
      },
      "appearance": {
        "strokeWidth": 2.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segB2C2",
      "label": "Lado B'C'",
      "color": "carbon",
      "layerId": "geometry",
      "order": 14,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTri2"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado B'C'",
        "role": "primary"
      },
      "target": true,
      "targetId": "lado-bpcp",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pB2",
          "pC2"
        ]
      },
      "appearance": {
        "strokeWidth": 2.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segA2C2",
      "label": "Lado A'C'",
      "color": "carbon",
      "layerId": "geometry",
      "order": 15,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTri2"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado A'C'",
        "role": "primary"
      },
      "target": true,
      "targetId": "lado-apcp",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pA2",
          "pC2"
        ]
      },
      "appearance": {
        "strokeWidth": 2.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "polyA2B2C2",
      "label": "Triángulo A'B'C'",
      "color": "canela",
      "layerId": "geometry",
      "order": 6,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTri2"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo A'B'C'",
        "role": "secondary"
      },
      "target": true,
      "targetId": "polyA2B2C2",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "pA2",
          "pB2",
          "pC2"
        ]
      },
      "appearance": {
        "strokeWidth": 1,
        "fillOpacity": 0.1,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "angA",
      "label": "Ángulo A",
      "color": "ocre",
      "layerId": "geometry",
      "order": 16,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTri1"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo A",
        "role": "secondary"
      },
      "target": true,
      "targetId": "angulo-a",
      "objectType": "angle",
      "points": [
        "pB",
        "pA",
        "pC"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 0.7,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "angB",
      "label": "Ángulo B",
      "color": "mora",
      "layerId": "geometry",
      "order": 17,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTri1"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo B",
        "role": "secondary"
      },
      "target": true,
      "targetId": "angulo-b",
      "objectType": "angle",
      "points": [
        "pC",
        "pB",
        "pA"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 0.8,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "angA2",
      "label": "Ángulo A'",
      "color": "ocre",
      "layerId": "geometry",
      "order": 18,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTri2"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo A'",
        "role": "secondary"
      },
      "target": true,
      "targetId": "angulo-ap",
      "objectType": "angle",
      "points": [
        "pB2",
        "pA2",
        "pC2"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 0.7,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "angB2",
      "label": "Ángulo B'",
      "color": "mora",
      "layerId": "geometry",
      "order": 19,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gTri2"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo B'",
        "role": "secondary"
      },
      "target": true,
      "targetId": "angulo-bp",
      "objectType": "angle",
      "points": [
        "pC2",
        "pB2",
        "pA2"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 0.8,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "congruenceBC",
      "label": "Marca BC",
      "color": "terracota",
      "layerId": "geometry",
      "order": 30,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia en BC",
        "role": "secondary"
      },
      "target": true,
      "targetId": "congruence-bc",
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "pB",
          "pC"
        ]
      },
      "count": 1,
      "height": 0.4,
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "congruenceB2C2",
      "label": "Marca B'C'",
      "color": "terracota",
      "layerId": "geometry",
      "order": 31,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia en B'C'",
        "role": "secondary"
      },
      "target": true,
      "targetId": "congruence-bpcp",
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "pB2",
          "pC2"
        ]
      },
      "count": 1,
      "height": 0.4,
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segBD",
      "label": "Segmento BD",
      "color": "terracota",
      "layerId": "construction",
      "order": 32,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento transportado BD",
        "role": "construction"
      },
      "target": true,
      "targetId": "segmento-bd",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pB",
          "pD"
        ]
      },
      "appearance": {
        "strokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segCD",
      "label": "Segmento CD",
      "color": "terracota",
      "layerId": "construction",
      "order": 33,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento auxiliar CD",
        "role": "construction"
      },
      "target": true,
      "targetId": "segmento-cd",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pC",
          "pD"
        ]
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2.2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "polyDBC",
      "label": "Triángulo auxiliar DBC",
      "color": "terracota",
      "layerId": "construction",
      "order": 7,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo auxiliar DBC",
        "role": "construction"
      },
      "target": true,
      "targetId": "triangulo-dbc",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "pD",
          "pB",
          "pC"
        ]
      },
      "appearance": {
        "strokeWidth": 1.5,
        "fillOpacity": 0.16,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "polyADC",
      "label": "Triángulo ADC",
      "color": "mora",
      "layerId": "construction",
      "order": 8,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo ADC",
        "role": "construction"
      },
      "target": true,
      "targetId": "triangulo-adc",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "pA",
          "pD",
          "pC"
        ]
      },
      "appearance": {
        "strokeWidth": 1,
        "fillOpacity": 0.1,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "angBDC",
      "label": "Ángulo BDC",
      "color": "terracota",
      "layerId": "construction",
      "order": 34,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo BDC",
        "role": "construction"
      },
      "target": true,
      "targetId": "angulo-bdc",
      "objectType": "angle",
      "points": [
        "pB",
        "pD",
        "pC"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 0.65,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "angExtD",
      "label": "Ángulo externo en D",
      "color": "granada",
      "layerId": "construction",
      "order": 35,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo externo en D",
        "role": "construction"
      },
      "target": true,
      "targetId": "angulo-externo",
      "objectType": "angle",
      "points": [
        "pC",
        "pD",
        "pA"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 0.75,
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [],
  "steps": [
    {
      "id": "step1",
      "label": "Hipótesis inicial (AAL)",
      "description": "Se dan dos triángulos △ABC y △A'B'C' con ∠A ≅ ∠A', ∠B ≅ ∠B' y BC ≅ B'C'.",
      "visibleTargets": [
        "pA",
        "pB",
        "pC",
        "pA2",
        "pB2",
        "pC2",
        "segAB",
        "segBC",
        "segAC",
        "segA2B2",
        "segB2C2",
        "segA2C2",
        "polyABC",
        "polyA2B2C2",
        "angA",
        "angB",
        "angA2",
        "angB2",
        "congruenceBC",
        "congruenceB2C2"
      ],
      "durationMs": 1000,
      "objectStates": {
        "angA": {
          "emphasis": "primary"
        },
        "angA2": {
          "emphasis": "primary"
        },
        "angB": {
          "emphasis": "primary"
        },
        "angB2": {
          "emphasis": "primary"
        },
        "segBC": {
          "emphasis": "primary"
        },
        "segB2C2": {
          "emphasis": "primary"
        },
        "congruenceBC": {
          "emphasis": "primary"
        },
        "congruenceB2C2": {
          "emphasis": "primary"
        }
      }
    },
    {
      "id": "step2",
      "label": "Suposición de reducción al absurdo",
      "description": "Si AB ≠ A'B', supongamos AB > A'B'. Se transporta B'A' sobre AB determinando D tal que BD ≅ B'A'.",
      "visibleTargets": [
        "pA",
        "pB",
        "pC",
        "pA2",
        "pB2",
        "pC2",
        "pD",
        "segAB",
        "segBC",
        "segAC",
        "segA2B2",
        "segB2C2",
        "segA2C2",
        "segBD",
        "polyABC",
        "polyA2B2C2"
      ],
      "durationMs": 1000,
      "objectStates": {
        "pD": {
          "emphasis": "primary"
        },
        "segBD": {
          "emphasis": "primary"
        },
        "segA2B2": {
          "emphasis": "secondary"
        }
      }
    },
    {
      "id": "step3",
      "label": "Congruencia LAL del triángulo auxiliar",
      "description": "En △DBC y △A'B'C': BD ≅ B'A', ∠B ≅ ∠B' y BC ≅ B'C'. Por LAL, △DBC ≅ △A'B'C', luego ∠BDC ≅ ∠A'.",
      "visibleTargets": [
        "pA",
        "pB",
        "pC",
        "pA2",
        "pB2",
        "pC2",
        "pD",
        "segAB",
        "segBC",
        "segAC",
        "segA2B2",
        "segB2C2",
        "segA2C2",
        "segBD",
        "segCD",
        "polyABC",
        "polyA2B2C2",
        "polyDBC",
        "angBDC",
        "angA2"
      ],
      "durationMs": 1000,
      "objectStates": {
        "polyDBC": {
          "emphasis": "primary"
        },
        "polyA2B2C2": {
          "emphasis": "primary"
        },
        "angBDC": {
          "emphasis": "primary"
        },
        "angA2": {
          "emphasis": "primary"
        }
      }
    },
    {
      "id": "step4",
      "label": "Ángulo externo en △ADC",
      "description": "En △ADC, ∠BDC es el ángulo externo en D respecto a la prolongación de AD. Por el teorema del ángulo externo: ∠BDC > ∠A.",
      "visibleTargets": [
        "pA",
        "pB",
        "pC",
        "pA2",
        "pB2",
        "pC2",
        "pD",
        "segAB",
        "segBC",
        "segAC",
        "segA2B2",
        "segB2C2",
        "segA2C2",
        "segBD",
        "segCD",
        "polyABC",
        "polyA2B2C2",
        "polyADC",
        "angBDC",
        "angA"
      ],
      "durationMs": 1000,
      "objectStates": {
        "polyADC": {
          "emphasis": "primary"
        },
        "angBDC": {
          "emphasis": "primary"
        },
        "angA": {
          "emphasis": "primary"
        }
      }
    },
    {
      "id": "step5",
      "label": "Contradicción",
      "description": "Por el paso 3, ∠BDC ≅ ∠A' ≅ ∠A. Pero por el paso 4, ∠BDC > ∠A. Un ángulo no puede ser a la vez congruente y estrictamente mayor.",
      "visibleTargets": [
        "pA",
        "pB",
        "pC",
        "pA2",
        "pB2",
        "pC2",
        "pD",
        "segAB",
        "segBC",
        "segAC",
        "segA2B2",
        "segB2C2",
        "segA2C2",
        "segBD",
        "segCD",
        "polyABC",
        "polyA2B2C2",
        "angBDC",
        "angA"
      ],
      "durationMs": 1000,
      "objectStates": {
        "angBDC": {
          "emphasis": "primary"
        },
        "angA": {
          "emphasis": "primary"
        }
      }
    },
    {
      "id": "step6",
      "label": "Conclusión por LAL",
      "description": "Por reducción al absurdo, AB ≅ A'B'. Con AB ≅ A'B', ∠B ≅ ∠B' y BC ≅ B'C', por LAL concluimos △ABC ≅ △A'B'C'.",
      "visibleTargets": [
        "pA",
        "pB",
        "pC",
        "pA2",
        "pB2",
        "pC2",
        "segAB",
        "segBC",
        "segAC",
        "segA2B2",
        "segB2C2",
        "segA2C2",
        "polyABC",
        "polyA2B2C2",
        "angA",
        "angB",
        "angA2",
        "angB2"
      ],
      "durationMs": 1000,
      "objectStates": {
        "polyABC": {
          "emphasis": "primary"
        },
        "polyA2B2C2": {
          "emphasis": "primary"
        },
        "segAB": {
          "emphasis": "primary"
        },
        "segA2B2": {
          "emphasis": "primary"
        }
      }
    }
  ],
  "note": "Arrastra el vértice A para explorar cómo se conserva la correspondencia entre ambos triángulos.",
  "translations": {
    "eu": {
      "title": "Froga: AAL kongruentzia-irizpidea",
      "note": "Arrastatu A erpina bi triangeluen arteko korrespondentzia nola mantentzen den aztertzeko.",
      "steps": {
        "step1": {
          "label": "Hasierako hipotesia (AAL)",
          "description": "Bi triangelu ematen dira △ABC eta △A'B'C', non ∠A ≅ ∠A', ∠B ≅ ∠B' eta BC ≅ B'C' diren."
        },
        "step2": {
          "label": "Absurdora eramanezko suposizioa",
          "description": "AB ≠ A'B' bada, suposa dezagun AB > A'B'. B'A' garraiatzen da AB gainean D zehaztuz BD ≅ B'A' izan dadin."
        },
        "step3": {
          "label": "Triangelu laguntzailearen LAL kongruentzia",
          "description": "△DBC eta △A'B'C'-n: BD ≅ B'A', ∠B ≅ ∠B' eta BC ≅ B'C'. LAL bidez, △DBC ≅ △A'B'C', beraz ∠BDC ≅ ∠A'."
        },
        "step4": {
          "label": "Kanpo-angelua △ADC-n",
          "description": "△ADC-n, ∠BDC kanpo-angelua da D erpinean. Kanpo-angeluaren teoremaren arabera: ∠BDC > ∠A."
        },
        "step5": {
          "label": "Ezespena (kontraesana)",
          "description": "3. urratsez, ∠BDC ≅ ∠A' ≅ ∠A. Baina 4. urratsez, ∠BDC > ∠A. Angelu bat ezin da aldi berean kongruentea eta hertsiki handiagoa izan."
        },
        "step6": {
          "label": "Ondorioa LAL bidez",
          "description": "Absurdora eramanez, AB ≅ A'B'. LAL bidez ondorioztatzen dugu △ABC ≅ △A'B'C'."
        }
      },
      "ariaLabels": {
        "pB": "B erpina",
        "pC": "C erpina",
        "pA": "A erpina (arrastagarria)",
        "pB2": "B' erpina",
        "pC2": "C' erpina",
        "pA2": "A' erpina",
        "pD": "D puntu laguntzailea",
        "segAB": "AB aldea",
        "segBC": "BC aldea",
        "segAC": "AC aldea",
        "polyABC": "ABC triangelua",
        "segA2B2": "A'B' aldea",
        "segB2C2": "B'C' aldea",
        "segA2C2": "A'C' aldea",
        "polyA2B2C2": "A'B'C' triangelua",
        "angA": "A angelua",
        "angB": "B angelua",
        "angA2": "A' angelua",
        "angB2": "B' angelua",
        "congruenceBC": "Kongruentzia-marka BC-n",
        "congruenceB2C2": "Kongruentzia-marka B'C'-n",
        "segBD": "BD segmentu garraiatua",
        "segCD": "CD segmentu laguntzailea",
        "polyDBC": "DBC triangelu laguntzailea",
        "polyADC": "ADC triangelua",
        "angBDC": "BDC angelua",
        "angExtD": "D-ko kanpo-angelua"
      }
    },
    "en": {
      "title": "Proof: AAS Congruence Criterion",
      "note": "Drag vertex A to explore how correspondence is preserved between both triangles.",
      "steps": {
        "step1": {
          "label": "Initial hypothesis (AAS)",
          "description": "Given triangles △ABC and △A'B'C' with ∠A ≅ ∠A', ∠B ≅ ∠B', and BC ≅ B'C'."
        },
        "step2": {
          "label": "Proof by contradiction assumption",
          "description": "If AB ≠ A'B', assume AB > A'B'. Transport B'A' onto AB to place D such that BD ≅ B'A'."
        },
        "step3": {
          "label": "SAS congruence of auxiliary triangle",
          "description": "In △DBC and △A'B'C': BD ≅ B'A', ∠B ≅ ∠B', and BC ≅ B'C'. By SAS, △DBC ≅ △A'B'C', so ∠BDC ≅ ∠A'."
        },
        "step4": {
          "label": "Exterior angle in △ADC",
          "description": "In △ADC, ∠BDC is the exterior angle at D. By the exterior angle theorem: ∠BDC > ∠A."
        },
        "step5": {
          "label": "Contradiction",
          "description": "From step 3, ∠BDC ≅ ∠A' ≅ ∠A. But from step 4, ∠BDC > ∠A. An angle cannot be simultaneously congruent and strictly greater."
        },
        "step6": {
          "label": "Conclusion via SAS",
          "description": "By contradiction, AB ≅ A'B'. Therefore, by SAS we conclude △ABC ≅ △A'B'C'."
        }
      },
      "ariaLabels": {
        "pB": "Vertex B",
        "pC": "Vertex C",
        "pA": "Vertex A (draggable)",
        "pB2": "Vertex B'",
        "pC2": "Vertex C'",
        "pA2": "Vertex A'",
        "pD": "Auxiliary point D",
        "segAB": "Side AB",
        "segBC": "Side BC",
        "segAC": "Side AC",
        "polyABC": "Triangle ABC",
        "segA2B2": "Side A'B'",
        "segB2C2": "Side B'C'",
        "segA2C2": "Side A'C'",
        "polyA2B2C2": "Triangle A'B'C'",
        "angA": "Angle A",
        "angB": "Angle B",
        "angA2": "Angle A'",
        "angB2": "Angle B'",
        "congruenceBC": "Congruence mark on BC",
        "congruenceB2C2": "Congruence mark on B'C'",
        "segBD": "Transported segment BD",
        "segCD": "Auxiliary segment CD",
        "polyDBC": "Auxiliary triangle DBC",
        "polyADC": "Triangle ADC",
        "angBDC": "Angle BDC",
        "angExtD": "Exterior angle at D"
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const DemoCongruenciaAAL = () => <DiagramRenderer spec={DemoCongruenciaAALSpec} />;

