import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const DemoTalesSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Teorema de Tales",
  "componentId": "demo-tales",
  "category": "Demos",
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
    "maxZoom": 10,
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
      "id": "pA",
      "label": "A",
      "color": "carbon",
      "layerId": "geometry",
      "order": 30,
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
        "x": -3,
        "y": -2
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pB",
      "label": "B",
      "color": "carbon",
      "layerId": "geometry",
      "order": 31,
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
        "x": 3,
        "y": -2
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pC",
      "label": "C",
      "color": "carbon",
      "layerId": "geometry",
      "order": 32,
      "visible": true,
      "locked": false,
      "groupIds": [],
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
        "x": 4,
        "y": 3
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pD",
      "label": "D",
      "color": "terracota",
      "layerId": "geometry",
      "order": 33,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto D sobre AB",
        "role": "primary"
      },
      "target": true,
      "targetId": "pD",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -1,
        "y": -2
      },
      "mobility": {
        "type": "on-support",
        "support": "segAB"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "segAB",
      "label": "Segmento AB",
      "color": "carbon",
      "layerId": "geometry",
      "order": 10,
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
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segBC",
      "label": "Segmento BC",
      "color": "carbon",
      "layerId": "geometry",
      "order": 11,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado BC",
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
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segCA",
      "label": "Segmento CA",
      "color": "carbon",
      "layerId": "geometry",
      "order": 12,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado CA",
        "role": "secondary"
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
        "strokeWidth": 2.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "polyABC",
      "label": "Triángulo ABC",
      "color": "carbon",
      "layerId": "geometry",
      "order": 5,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo ABC",
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
        "fillOpacity": 0.06,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "parDBC",
      "label": "Paralela a BC por D",
      "color": "canela",
      "layerId": "geometry",
      "order": 4,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta paralela a BC por D",
        "role": "secondary"
      },
      "target": true,
      "targetId": "parDBC",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "parallel",
          "linePoints": [
            "pC",
            "pB"
          ],
          "through": "pD"
        }
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 1,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pE",
      "label": "E",
      "color": "terracota",
      "layerId": "geometry",
      "order": 34,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto E: intersección de la paralela con CA",
        "role": "primary"
      },
      "target": true,
      "targetId": "pE",
      "objectType": "point",
      "definition": {
        "type": "intersection",
        "supports": [
          "parDBC",
          "segCA"
        ],
        "restrictToSupports": true
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
      "id": "segDE",
      "label": "Segmento DE (Paralelo)",
      "color": "canela",
      "layerId": "geometry",
      "order": 15,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento DE paralelo a BC",
        "role": "primary"
      },
      "target": true,
      "targetId": "segDE",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pD",
          "pE"
        ]
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "polyADE",
      "label": "Triángulo ADE",
      "color": "ocre",
      "layerId": "geometry",
      "order": 6,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo ADE",
        "role": "secondary"
      },
      "target": true,
      "targetId": "polyADE",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "pA",
          "pD",
          "pE"
        ]
      },
      "appearance": {
        "strokeWidth": 1,
        "fillOpacity": 0.15,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "polyBDE",
      "label": "Triángulo BDE",
      "color": "ocre",
      "layerId": "geometry",
      "order": 7,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo BDE",
        "role": "secondary"
      },
      "target": true,
      "targetId": "polyBDE",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "pB",
          "pD",
          "pE"
        ]
      },
      "appearance": {
        "strokeWidth": 1,
        "fillOpacity": 0.15,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "polyCDE",
      "label": "Triángulo CDE",
      "color": "ocre",
      "layerId": "geometry",
      "order": 8,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo CDE",
        "role": "secondary"
      },
      "target": true,
      "targetId": "polyCDE",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "pC",
          "pD",
          "pE"
        ]
      },
      "appearance": {
        "strokeWidth": 1,
        "fillOpacity": 0.15,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pH1",
      "label": "H1",
      "color": "ocre",
      "layerId": "geometry",
      "order": 35,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "ariaLabel": "H1",
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "projection",
        "point": "pE",
        "support": {
          "points": [
            "pA",
            "pB"
          ]
        }
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {}
    },
    {
      "id": "segH1",
      "label": "Altura h1",
      "color": "ocre",
      "layerId": "geometry",
      "order": 16,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Altura desde E a AB",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segH1",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pE",
          "pH1"
        ]
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pH2",
      "label": "H2",
      "color": "ocre",
      "layerId": "geometry",
      "order": 36,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "ariaLabel": "H2",
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "projection",
        "point": "pD",
        "support": {
          "points": [
            "pA",
            "pC"
          ]
        }
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {}
    },
    {
      "id": "segH2",
      "label": "Altura h2",
      "color": "ocre",
      "layerId": "geometry",
      "order": 17,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Altura desde D a AC",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segH2",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pD",
          "pH2"
        ]
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2,
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [],
  "steps": [
    {
      "id": "step1",
      "label": "Triángulo ABC y paralela por D",
      "description": "La recta paralela a BC por D corta al lado CA en E.",
      "visibleTargets": [
        "polyABC",
        "segAB",
        "segBC",
        "segCA",
        "pA",
        "pB",
        "pC",
        "pD",
        "pE",
        "segDE",
        "parDBC"
      ],
      "durationMs": 1000,
      "objectStates": {
        "segDE": {
          "visible": true,
          "emphasis": "primary"
        },
        "parDBC": {
          "visible": true,
          "emphasis": "primary"
        },
        "pD": {
          "visible": true,
          "emphasis": "primary"
        },
        "pE": {
          "visible": true,
          "emphasis": "primary"
        }
      }
    },
    {
      "id": "step2",
      "label": "Triángulos BDE y CDE",
      "description": "Comparten la base DE y sus vértices B y C están en una paralela a DE: tienen la misma altura y la misma área.",
      "visibleTargets": [
        "polyABC",
        "segAB",
        "segBC",
        "segCA",
        "pA",
        "pB",
        "pC",
        "pD",
        "pE",
        "segDE",
        "parDBC",
        "polyBDE",
        "polyCDE"
      ],
      "durationMs": 1000,
      "objectStates": {
        "polyBDE": {
          "visible": true,
          "emphasis": "primary"
        },
        "polyCDE": {
          "visible": true,
          "emphasis": "primary"
        },
        "segDE": {
          "visible": true,
          "emphasis": "primary"
        }
      }
    },
    {
      "id": "step3",
      "label": "Triángulos ADE y BDE",
      "description": "Tienen la misma altura EH1 respecto a la recta AB: sus áreas son proporcionales a AD y DB.",
      "visibleTargets": [
        "polyABC",
        "segAB",
        "segBC",
        "segCA",
        "pA",
        "pB",
        "pC",
        "pD",
        "pE",
        "segDE",
        "parDBC",
        "polyADE",
        "polyBDE",
        "segH1"
      ],
      "durationMs": 1000,
      "objectStates": {
        "polyADE": {
          "visible": true,
          "emphasis": "primary"
        },
        "polyBDE": {
          "visible": true,
          "emphasis": "primary"
        },
        "segH1": {
          "visible": true,
          "emphasis": "primary"
        }
      }
    },
    {
      "id": "step4",
      "label": "Triángulos ADE y CDE",
      "description": "Tienen la misma altura DH2 respecto a la recta AC: sus áreas son proporcionales a AE y EC.",
      "visibleTargets": [
        "polyABC",
        "segAB",
        "segBC",
        "segCA",
        "pA",
        "pB",
        "pC",
        "pD",
        "pE",
        "segDE",
        "parDBC",
        "polyADE",
        "polyCDE",
        "segH2"
      ],
      "durationMs": 1000,
      "objectStates": {
        "polyADE": {
          "visible": true,
          "emphasis": "primary"
        },
        "polyCDE": {
          "visible": true,
          "emphasis": "primary"
        },
        "segH2": {
          "visible": true,
          "emphasis": "primary"
        }
      }
    },
    {
      "id": "step5",
      "label": "Conclusión en el triángulo",
      "description": "De la igualdad de áreas se obtiene AD/DB = AE/EC.",
      "visibleTargets": [
        "polyABC",
        "segAB",
        "segBC",
        "segCA",
        "pA",
        "pB",
        "pC",
        "pD",
        "pE",
        "segDE",
        "parDBC"
      ],
      "durationMs": 1000,
      "objectStates": {
        "segAB": {
          "visible": true,
          "emphasis": "primary"
        },
        "segCA": {
          "visible": true,
          "emphasis": "primary"
        },
        "pD": {
          "visible": true,
          "emphasis": "primary"
        },
        "pE": {
          "visible": true,
          "emphasis": "primary"
        }
      }
    },
    {
      "id": "step6",
      "label": "Caso general",
      "description": "Con tres paralelas y dos transversales, una paralela auxiliar por A y dos paralelogramos reducen el teorema al caso del triángulo.",
      "visibleTargets": [
        "polyABC",
        "segAB",
        "segBC",
        "segCA",
        "pA",
        "pB",
        "pC",
        "pD",
        "pE",
        "segDE",
        "parDBC"
      ],
      "durationMs": 1000,
      "objectStates": {}
    }
  ],
  "note": "Desliza el punto D a lo largo del lado AB: E es siempre la intersección de la paralela a BC con el lado CA.",
  "translations": {
    "eu": {
      "title": "Talesen teorema",
      "note": "Irristatu D puntua AB aldean zehar: E puntua BC aldearen paraleloak CA aldearekin duen ebakidura da.",
      "steps": {
        "step1": {
          "label": "ABC triangelua eta D puntutik paraleloa",
          "description": "D puntutik BC zuzenaren paraleloak CA aldea E puntuan ebakitzen du."
        },
        "step2": {
          "label": "BDE eta CDE triangeluak",
          "description": "DE oinarria partekatzen dute, eta B eta C erpinak DE zuzenaren paralelo batean daude: altuera bera eta azalera bera dituzte."
        },
        "step3": {
          "label": "ADE eta BDE triangeluak",
          "description": "AB zuzenarekiko EH1 altuera bera dute: haien azalerak AD eta DB zuzenkien proportzionalak dira."
        },
        "step4": {
          "label": "ADE eta CDE triangeluak",
          "description": "AC zuzenarekiko DH2 altuera bera dute: haien azalerak AE eta EC zuzenkien proportzionalak dira."
        },
        "step5": {
          "label": "Ondorioa triangeluan",
          "description": "Azaleren berdintasunetik AD/DB = AE/EC lortzen da."
        },
        "step6": {
          "label": "Kasu orokorra",
          "description": "Hiru paralelo eta bi zuzen ebakitzailerekin, A puntutik marraztutako paralelo laguntzaile batek eta bi paralelogramok teorema triangeluaren kasura laburtzen dute."
        }
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const DemoTales = () => <DiagramRenderer spec={DemoTalesSpec} />;
