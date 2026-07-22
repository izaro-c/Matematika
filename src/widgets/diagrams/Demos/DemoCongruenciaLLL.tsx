import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const DemoCongruenciaLLLSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Demostración del criterio LLL",
  "componentId": "demo-congruencia-lll",
  "category": "Demostraciones",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "viewport": {
    "bounds": [
      -5,
      4.5,
      5,
      -4.5
    ],
    "home": [
      -5,
      4.5,
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
      "id": "gPrime",
      "label": "Triángulo con C'",
      "memberIds": [
        "triPrime",
        "AB",
        "AC",
        "BC"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo con C'",
        "role": "primary"
      },
      "target": true,
      "targetId": "triangleCPrime",
      "color": "granada"
    },
    {
      "id": "gStar",
      "label": "Triángulo con C*",
      "memberIds": [
        "triStar",
        "AB",
        "ACstar",
        "BCstar"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo con C*",
        "role": "primary"
      },
      "target": true,
      "targetId": "triangleCStar",
      "color": "pizarra"
    },
    {
      "id": "gAB",
      "label": "Lado AB correspondiente",
      "memberIds": [
        "AB"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado AB correspondiente",
        "role": "primary"
      },
      "target": true,
      "targetId": "sideAB",
      "color": "granada"
    },
    {
      "id": "gBC",
      "label": "Lados BC correspondientes",
      "memberIds": [
        "BC",
        "BCstar"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Lados BC correspondientes",
        "role": "primary"
      },
      "target": true,
      "targetId": "sideBC",
      "color": "granada"
    },
    {
      "id": "gAC",
      "label": "Lados AC correspondientes",
      "memberIds": [
        "AC",
        "ACstar"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Lados AC correspondientes",
        "role": "primary"
      },
      "target": true,
      "targetId": "sideAC",
      "color": "granada"
    },
    {
      "id": "gACstar",
      "label": "Segmento A′C*",
      "memberIds": [
        "ACstar"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento A′C*",
        "role": "primary"
      },
      "target": true,
      "targetId": "sideACStar",
      "color": "pizarra"
    },
    {
      "id": "gBCstar",
      "label": "Segmento B′C*",
      "memberIds": [
        "BCstar"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento B′C*",
        "role": "primary"
      },
      "target": true,
      "targetId": "sideBCStar",
      "color": "pizarra"
    },
    {
      "id": "gIsoLeft",
      "label": "Isósceles con vértice A′",
      "memberIds": [
        "AC",
        "ACstar",
        "CCstar"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Isósceles con vértice A′",
        "role": "primary"
      },
      "target": true,
      "targetId": "isoLeft",
      "color": "granada"
    },
    {
      "id": "gIsoRight",
      "label": "Isósceles con vértice B′",
      "memberIds": [
        "BC",
        "BCstar",
        "CCstar"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Isósceles con vértice B′",
        "role": "primary"
      },
      "target": true,
      "targetId": "isoRight",
      "color": "pizarra"
    }
  ],
  "objects": [
    {
      "id": "A",
      "label": "A'",
      "color": "granada",
      "layerId": "geometry",
      "order": 2020,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto fijo A'",
        "role": "secondary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2.4,
        "y": 0
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
      "id": "B",
      "label": "B'",
      "color": "granada",
      "layerId": "geometry",
      "order": 2030,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto fijo B'",
        "role": "secondary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.4,
        "y": 0
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
      "id": "C",
      "label": "C'",
      "color": "granada",
      "layerId": "geometry",
      "order": 2040,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto C'",
        "role": "primary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -0.7,
        "y": 2.6
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
      "id": "Cstar",
      "label": "C*",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 2050,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto construido C*",
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "C.x",
        "y": "2 * A.y - C.y",
        "fallback": [
          -0.7,
          -2.6
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
      "id": "triPrime",
      "label": "Triángulo A'B'C'",
      "color": "granada",
      "layerId": "geometry",
      "order": 2060,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gPrime"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo A'B'C'",
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
      "id": "triStar",
      "label": "Triángulo A'B'C*",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 2070,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gStar"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo A'B'C*",
        "role": "secondary"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "A",
          "B",
          "Cstar"
        ]
      },
      "appearance": {
        "strokeWidth": 3,
        "fillOpacity": 0.08,
        "highlightFillOpacity": 0.28,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "AB",
      "label": "A'B'",
      "color": "granada",
      "layerId": "geometry",
      "order": 2080,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gPrime",
        "gStar",
        "gAB"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "A'B'",
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
      "id": "AC",
      "label": "A'C'",
      "color": "granada",
      "layerId": "geometry",
      "order": 2090,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gPrime",
        "gAC",
        "gIsoLeft"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "A'C'",
        "role": "secondary"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "A",
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
      "id": "BC",
      "label": "B'C'",
      "color": "granada",
      "layerId": "geometry",
      "order": 2100,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gPrime",
        "gBC",
        "gIsoRight"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "B'C'",
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
      "id": "ACstar",
      "label": "A'C*",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 2110,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gStar",
        "gAC",
        "gACstar",
        "gIsoLeft"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "A'C*",
        "role": "secondary"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "A",
          "Cstar"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "BCstar",
      "label": "B'C*",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 2120,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gStar",
        "gBC",
        "gBCstar",
        "gIsoRight"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "B'C*",
        "role": "secondary"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "B",
          "Cstar"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "CCstar",
      "label": "C'C*",
      "color": "salvia",
      "layerId": "geometry",
      "order": 2130,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gIsoLeft",
        "gIsoRight"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "C'C*",
        "role": "secondary"
      },
      "target": true,
      "targetId": "lineCC",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "C",
          "Cstar"
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
      "id": "angC",
      "label": "Ángulo en C'",
      "color": "granada",
      "layerId": "geometry",
      "order": 2140,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo en C'",
        "role": "secondary"
      },
      "target": true,
      "targetId": "angleC",
      "objectType": "angle",
      "points": [
        "A",
        "C",
        "B"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 0.58,
        "fillOpacity": 0.22,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "lllProofInfo",
      "label": "Construcción espejo",
      "color": "granada",
      "layerId": "annotations",
      "order": 2150,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Construcción espejo",
        "role": "annotation"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "C′ y C* son las dos intersecciones de círculos con centros A′ y B′.",
        "title": "Construcción espejo"
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.98,
          0.03
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [],
  "steps": [
    {
      "id": "step1",
      "label": "Transporte",
      "description": "Se construye C* reflejando el ángulo y copiando A′C′.",
      "visibleTargets": [
        "triPrime",
        "triStar",
        "AB",
        "AC",
        "BC",
        "ACstar",
        "BCstar",
        "lllProofInfo"
      ],
      "durationMs": 1800,
      "objectStates": {
        "triPrime": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "triStar": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "AB": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "AC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "BC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "ACstar": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "BCstar": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "lllProofInfo": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        }
      }
    },
    {
      "id": "step2",
      "label": "LAL",
      "description": "El triángulo transportado es congruente al original de referencia.",
      "visibleTargets": [
        "triPrime",
        "triStar",
        "AB",
        "AC",
        "BC",
        "ACstar",
        "BCstar",
        "angC",
        "lllProofInfo"
      ],
      "durationMs": 1800,
      "objectStates": {
        "triPrime": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "triStar": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "AB": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "AC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "BC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "ACstar": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "BCstar": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "angC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "lllProofInfo": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        }
      }
    },
    {
      "id": "step3",
      "label": "Isósceles auxiliares",
      "description": "El segmento C′C* forma dos triángulos isósceles.",
      "visibleTargets": [
        "triPrime",
        "triStar",
        "AB",
        "AC",
        "BC",
        "ACstar",
        "BCstar",
        "CCstar",
        "angC",
        "lllProofInfo"
      ],
      "durationMs": 1800,
      "objectStates": {
        "triPrime": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "triStar": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "AB": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "AC": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "BC": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "ACstar": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "BCstar": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "CCstar": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "angC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "lllProofInfo": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        }
      }
    },
    {
      "id": "step4",
      "label": "Conclusión",
      "description": "Las igualdades angulares permiten aplicar LAL a los triángulos finales.",
      "visibleTargets": [
        "triPrime",
        "triStar",
        "AB",
        "AC",
        "BC",
        "ACstar",
        "BCstar",
        "CCstar",
        "angC",
        "lllProofInfo"
      ],
      "durationMs": 1800,
      "objectStates": {
        "triPrime": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "triStar": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "AB": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "AC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "BC": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "ACstar": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "BCstar": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "CCstar": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        },
        "angC": {
          "visible": true,
          "emphasis": "primary",
          "interactive": true
        },
        "lllProofInfo": {
          "visible": true,
          "emphasis": "none",
          "interactive": true
        }
      }
    }
  ],
  "note": "Mueve C′ y recorre los pasos. C* se mantiene como su reflejo respecto de A′B′, haciendo visibles los dos triángulos isósceles auxiliares."
}
);
/* @matematika-diagram-spec:end */

export const DemoCongruenciaLLL = () => <DiagramRenderer spec={DemoCongruenciaLLLSpec} />;
