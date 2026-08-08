import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const AlturaSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Altura",
  "componentId": "altura",
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
    },
    {
      "id": "background",
      "label": "Fondo",
      "order": 0,
      "visible": true,
      "locked": false
    },
    {
      "id": "annotations",
      "label": "Anotaciones & Texto",
      "order": 20,
      "visible": true,
      "locked": false
    }
  ],
  "groups": [
    {
      "id": "prolongaciones",
      "label": "Prolongaciones",
      "memberIds": [
        "segAintsegAlturaABCsegAlturaCAB",
        "segCintsegAlturaABCsegAlturaCAB",
        "segBintsegAlturaABCsegAlturaCAB",
        "segAlturaBAC",
        "segAlturaABC",
        "segAlturaCAB"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "primary"
      },
      "target": true,
      "targetId": "prolongaciones"
    }
  ],
  "objects": [
    {
      "id": "pA",
      "label": "A",
      "color": "terracota",
      "layerId": "geometry",
      "order": 6,
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
        "x": -3.63,
        "y": -2.31
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
        "snapToGrid": false,
        "attractorIds": []
      }
    },
    {
      "id": "pB",
      "label": "B",
      "color": "terracota",
      "layerId": "geometry",
      "order": 5,
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
        "x": 3.73,
        "y": -1.53
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
      "color": "terracota",
      "layerId": "geometry",
      "order": 7,
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
        "x": -1.33,
        "y": 3.56
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
      "id": "polygonABC",
      "label": "Polígono",
      "color": "musgo",
      "layerId": "geometry",
      "order": 2,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "highlightable": false,
        "ariaLabel": "Polígono",
        "role": "secondary"
      },
      "target": true,
      "targetId": "polygonABC",
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
        "dashed": false,
        "strokeWidth": 3,
        "highlightStrokeWidth": 5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "footCAB",
      "label": "$H_c$",
      "color": "ocre",
      "layerId": "geometry",
      "order": 3,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Pie de altura CAB",
        "role": "secondary"
      },
      "target": true,
      "targetId": "footCAB",
      "objectType": "point",
      "definition": {
        "type": "projection",
        "point": "pC",
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
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "extAlturaCAB",
      "label": "Extensión de base AB",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 0,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Extensión de base AB",
        "role": "secondary"
      },
      "target": true,
      "targetId": "extAlturaCAB",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pA",
          "pB"
        ],
        "construction": {
          "type": "base-extension",
          "foot": "footCAB"
        }
      },
      "appearance": {
        "dashed": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segAlturaCAB",
      "label": "Altura desde C a AB",
      "color": "ocre",
      "layerId": "geometry",
      "order": 4,
      "visible": true,
      "locked": false,
      "groupIds": [
        "prolongaciones"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Altura desde C a AB",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segAlturaCAB",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pC",
          "footCAB"
        ]
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2.4,
        "labelVisible": false,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "rightAngleAlturaCAB",
      "label": "Ángulo recto de la altura",
      "color": "ocre",
      "layerId": "geometry",
      "order": 1,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo recto de la altura",
        "role": "secondary"
      },
      "target": true,
      "targetId": "rightAngleAlturaCAB",
      "objectType": "angle",
      "points": [
        "pA",
        "footCAB",
        "pC"
      ],
      "sweep": "non-reflex",
      "marker": "square",
      "perpendicularRelationId": "rightAngleAlturaCAB-perpendicular",
      "appearance": {
        "radius": 0.45,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "footABC",
      "label": "$H_{a}$",
      "color": "ocre",
      "layerId": "geometry",
      "order": 1000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Pie de altura ABC",
        "role": "secondary"
      },
      "target": true,
      "targetId": "footABC",
      "objectType": "point",
      "definition": {
        "type": "projection",
        "point": "pA",
        "support": {
          "points": [
            "pB",
            "pC"
          ]
        }
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "extAlturaABC",
      "label": "Extensión de base BC",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 1000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Extensión de base BC",
        "role": "secondary"
      },
      "target": true,
      "targetId": "extAlturaABC",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pB",
          "pC"
        ],
        "construction": {
          "type": "base-extension",
          "foot": "footABC"
        }
      },
      "appearance": {
        "dashed": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segAlturaABC",
      "label": "Altura desde A a BC",
      "color": "ocre",
      "layerId": "geometry",
      "order": 1000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "prolongaciones"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Altura desde A a BC",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segAlturaABC",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pA",
          "footABC"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "rightAngleAlturaABC",
      "label": "Ángulo recto de la altura",
      "color": "ocre",
      "layerId": "geometry",
      "order": 1000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo recto de la altura",
        "role": "secondary"
      },
      "target": true,
      "targetId": "rightAngleAlturaABC",
      "objectType": "angle",
      "points": [
        "pB",
        "footABC",
        "pA"
      ],
      "sweep": "non-reflex",
      "marker": "square",
      "perpendicularRelationId": "rightAngleAlturaABC-perpendicular",
      "appearance": {
        "radius": 0.45,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "footBAC",
      "label": "$H_{b}$",
      "color": "ocre",
      "layerId": "geometry",
      "order": 1000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Pie de altura BAC",
        "role": "secondary"
      },
      "target": true,
      "targetId": "footBAC",
      "objectType": "point",
      "definition": {
        "type": "projection",
        "point": "pB",
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
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "extAlturaBAC",
      "label": "Extensión de base AC",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 1000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Extensión de base AC",
        "role": "secondary"
      },
      "target": true,
      "targetId": "extAlturaBAC",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pA",
          "pC"
        ],
        "construction": {
          "type": "base-extension",
          "foot": "footBAC"
        }
      },
      "appearance": {
        "dashed": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segAlturaBAC",
      "label": "Altura desde B a AC",
      "color": "ocre",
      "layerId": "geometry",
      "order": 1000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "prolongaciones"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Altura desde B a AC",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segAlturaBAC",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pB",
          "footBAC"
        ]
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "rightAngleAlturaBAC",
      "label": "Ángulo recto de la altura",
      "color": "ocre",
      "layerId": "geometry",
      "order": 1000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo recto de la altura",
        "role": "secondary"
      },
      "target": true,
      "targetId": "rightAngleAlturaBAC",
      "objectType": "angle",
      "points": [
        "pA",
        "footBAC",
        "pB"
      ],
      "sweep": "non-reflex",
      "marker": "square",
      "perpendicularRelationId": "rightAngleAlturaBAC-perpendicular",
      "appearance": {
        "radius": 0.45,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "intsegAlturaABCsegAlturaCAB",
      "label": "$O$",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1001,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Intersección",
        "role": "secondary"
      },
      "target": true,
      "targetId": "intsegAlturaABCsegAlturaCAB",
      "objectType": "point",
      "definition": {
        "type": "intersection",
        "supports": [
          "lineAfootABC",
          "linefootBACB"
        ],
        "restrictToSupports": true
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "lineAfootABC",
      "label": "Recta",
      "color": "pavo",
      "layerId": "geometry",
      "order": 1002,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta",
        "role": "secondary"
      },
      "target": true,
      "targetId": "lineAfootABC",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "through-points",
          "points": [
            "pA",
            "footABC"
          ]
        }
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "linefootBACB",
      "label": "Recta",
      "color": "pavo",
      "layerId": "geometry",
      "order": 1003,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta",
        "role": "secondary"
      },
      "target": true,
      "targetId": "linefootBACB",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "through-points",
          "points": [
            "footBAC",
            "pB"
          ]
        }
      },
      "appearance": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segBintsegAlturaABCsegAlturaCAB",
      "label": "Prolongación C",
      "color": "ocre",
      "layerId": "background",
      "order": 1004,
      "visible": true,
      "locked": false,
      "groupIds": [
        "prolongaciones"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segBintsegAlturaABCsegAlturaCAB",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pB",
          "intsegAlturaABCsegAlturaCAB"
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
      "id": "segCintsegAlturaABCsegAlturaCAB",
      "label": "Prolongación C",
      "color": "ocre",
      "layerId": "background",
      "order": 1005,
      "visible": true,
      "locked": false,
      "groupIds": [
        "prolongaciones"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segCintsegAlturaABCsegAlturaCAB",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pC",
          "intsegAlturaABCsegAlturaCAB"
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
      "id": "segAintsegAlturaABCsegAlturaCAB",
      "label": "Prolongación A",
      "color": "ocre",
      "layerId": "background",
      "order": 1006,
      "visible": true,
      "locked": false,
      "groupIds": [
        "prolongaciones"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segAintsegAlturaABCsegAlturaCAB",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pA",
          "intsegAlturaABCsegAlturaCAB"
        ]
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [
    {
      "id": "rightAngleAlturaCAB-perpendicular",
      "label": "Perpendicularidad de Ángulo recto de la altura",
      "enabled": true,
      "type": "perpendicular",
      "supports": [
        [
          "footCAB",
          "pA"
        ],
        [
          "footCAB",
          "pC"
        ]
      ]
    },
    {
      "id": "rightAngleAlturaABC-perpendicular",
      "label": "Perpendicularidad de Ángulo recto de la altura",
      "enabled": true,
      "type": "perpendicular",
      "supports": [
        [
          "footABC",
          "pB"
        ],
        [
          "footABC",
          "pA"
        ]
      ]
    },
    {
      "id": "rightAngleAlturaBAC-perpendicular",
      "label": "Perpendicularidad de Ángulo recto de la altura",
      "enabled": true,
      "type": "perpendicular",
      "supports": [
        [
          "footBAC",
          "pA"
        ],
        [
          "footBAC",
          "pB"
        ]
      ]
    }
  ],
  "steps": [
    {
      "id": "step1",
      "label": "Paso 1",
      "description": "Descripción del nuevo paso de la demostración.",
      "visibleTargets": [
        "pA",
        "pB",
        "pC",
        "polygonABC",
        "footCAB",
        "extAlturaCAB",
        "segAlturaCAB",
        "rightAngleAlturaCAB"
      ],
      "objectStates": {
        "segAlturaCAB": {
          "emphasis": "primary"
        },
        "polygonABC": {
          "emphasis": "none"
        },
        "intsegAlturaABCsegAlturaCAB": {
          "visible": false
        },
        "rightAngleAlturaBAC": {
          "visible": false
        },
        "segAlturaBAC": {
          "visible": false
        },
        "extAlturaBAC": {
          "visible": false
        },
        "footBAC": {
          "visible": false
        },
        "rightAngleAlturaABC": {
          "visible": false
        },
        "segAlturaABC": {
          "visible": false
        },
        "extAlturaABC": {
          "visible": false
        },
        "footABC": {
          "visible": false
        },
        "lineAfootABC": {
          "visible": false
        },
        "linefootBACB": {
          "visible": false
        },
        "segBintsegAlturaABCsegAlturaCAB": {
          "visible": false
        },
        "segAintsegAlturaABCsegAlturaCAB": {
          "visible": false
        },
        "segCintsegAlturaABCsegAlturaCAB": {
          "visible": false
        }
      }
    },
    {
      "id": "step2",
      "label": "Ortocentro",
      "description": "Descripción del nuevo paso de la demostración.",
      "visibleTargets": [
        "pA",
        "pB",
        "pC",
        "polygonABC",
        "footCAB",
        "extAlturaCAB",
        "segAlturaCAB",
        "rightAngleAlturaCAB",
        "footABC",
        "extAlturaABC",
        "segAlturaABC",
        "rightAngleAlturaABC",
        "footBAC",
        "extAlturaBAC",
        "segAlturaBAC",
        "rightAngleAlturaBAC",
        "intsegAlturaABCsegAlturaCAB",
        "segBintsegAlturaABCsegAlturaCAB",
        "segCintsegAlturaABCsegAlturaCAB",
        "segAintsegAlturaABCsegAlturaCAB"
      ],
      "objectStates": {
        "segAlturaCAB": {
          "showLabel": false,
          "dashed": false
        },
        "intsegAlturaABCsegAlturaCAB": {
          "emphasis": "primary"
        },
        "linefootBACB": {
          "visible": false
        },
        "lineAfootABC": {
          "visible": false
        },
        "segAintsegAlturaABCsegAlturaCAB": {
          "visible": true
        },
        "segCintsegAlturaABCsegAlturaCAB": {
          "visible": true
        },
        "segBintsegAlturaABCsegAlturaCAB": {
          "visible": true
        }
      }
    }
  ],
  "note": "Arrastra A, B y C"
}
);
/* @matematika-diagram-spec:end */

export const Altura = () => <DiagramRenderer spec={AlturaSpec} />;
