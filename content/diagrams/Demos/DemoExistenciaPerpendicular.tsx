import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const DemoExistenciaPerpendicularSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Demostración: Existencia y unicidad de la perpendicular",
  "componentId": "demo-existencia-perpendicular",
  "category": "Demos",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "showLabels": true,
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
  "groups": [],
  "objects": [
    {
      "id": "pA",
      "label": "A",
      "color": "carbon",
      "layerId": "geometry",
      "order": 20,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto de referencia A",
        "role": "secondary"
      },
      "target": true,
      "targetId": "punto-a",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3.2,
        "y": 0
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
      "id": "pB",
      "label": "B",
      "color": "carbon",
      "layerId": "geometry",
      "order": 21,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto B en la recta",
        "role": "secondary"
      },
      "target": true,
      "targetId": "punto-b",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 3.2,
        "y": 0
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
      "id": "lineL",
      "label": "Recta l",
      "color": "carbon",
      "layerId": "geometry",
      "order": 10,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta l",
        "role": "primary"
      },
      "target": true,
      "targetId": "recta-l",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "through-points",
          "points": [
            "pA",
            "pB"
          ]
        }
      },
      "appearance": {
        "strokeWidth": 2.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pP",
      "label": "P",
      "color": "terracota",
      "layerId": "geometry",
      "order": 22,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto exterior P (arrastrable)",
        "role": "primary"
      },
      "target": true,
      "targetId": "punto-p",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -0.8,
        "y": 2.6
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
      "id": "pM",
      "label": "M",
      "color": "canela",
      "layerId": "construction",
      "order": 24,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Pie de la perpendicular M",
        "role": "primary"
      },
      "target": true,
      "targetId": "punto-m",
      "objectType": "point",
      "definition": {
        "type": "projection",
        "point": "pP",
        "support": "lineL"
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
      "color": "mora",
      "layerId": "construction",
      "order": 25,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto simétrico transportado C",
        "role": "construction"
      },
      "target": true,
      "targetId": "punto-c",
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "2 * pM.x - pP.x",
        "y": "2 * pM.y - pP.y",
        "fallback": [
          -0.8,
          -2.6
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
      "id": "segPC",
      "label": "Segmento PC",
      "color": "terracota",
      "layerId": "construction",
      "order": 14,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento PC",
        "role": "primary"
      },
      "target": true,
      "targetId": "segmento-pc",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pP",
          "pC"
        ]
      },
      "appearance": {
        "strokeWidth": 2.8,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "linePM",
      "label": "Recta perpendicular PM",
      "color": "terracota",
      "layerId": "construction",
      "order": 11,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta perpendicular PM",
        "role": "primary"
      },
      "target": true,
      "targetId": "recta-pm",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "through-points",
          "points": [
            "pP",
            "pM"
          ]
        }
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2.2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segAP",
      "label": "Segmento AP",
      "color": "canela",
      "layerId": "construction",
      "order": 12,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento AP",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segAP",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pA",
          "pP"
        ]
      },
      "appearance": {
        "strokeWidth": 2.2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segAC",
      "label": "Segmento AC",
      "color": "canela",
      "layerId": "construction",
      "order": 13,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento AC",
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
        "strokeWidth": 2.2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "polyPAM",
      "label": "Triángulo PAM",
      "color": "canela",
      "layerId": "construction",
      "order": 6,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo PAM",
        "role": "construction"
      },
      "target": true,
      "targetId": "triangulo-pam",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "pP",
          "pA",
          "pM"
        ]
      },
      "appearance": {
        "strokeWidth": 1,
        "fillOpacity": 0.14,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "polyCAM",
      "label": "Triángulo CAM",
      "color": "mora",
      "layerId": "construction",
      "order": 7,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo CAM",
        "role": "construction"
      },
      "target": true,
      "targetId": "triangulo-cam",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "pC",
          "pA",
          "pM"
        ]
      },
      "appearance": {
        "strokeWidth": 1,
        "fillOpacity": 0.14,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "angMAP",
      "label": "Ángulo MAP",
      "color": "ocre",
      "layerId": "construction",
      "order": 16,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo MAP",
        "role": "construction"
      },
      "target": true,
      "targetId": "angMAP",
      "objectType": "angle",
      "points": [
        "pP",
        "pA",
        "pM"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 0.75,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "angMAC",
      "label": "Ángulo MAC",
      "color": "ocre",
      "layerId": "construction",
      "order": 17,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo MAC",
        "role": "construction"
      },
      "target": true,
      "targetId": "angMAC",
      "objectType": "angle",
      "points": [
        "pM",
        "pA",
        "pC"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 0.75,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "angPMA",
      "label": "Ángulo PMA (recto)",
      "color": "terracota",
      "layerId": "construction",
      "order": 18,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo recto PMA",
        "role": "primary"
      },
      "target": true,
      "targetId": "angPMA",
      "objectType": "angle",
      "points": [
        "pP",
        "pM",
        "pA"
      ],
      "sweep": "non-reflex",
      "marker": "square",
      "perpendicularRelationId": "relPerpPMA",
      "appearance": {
        "radius": 0.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "angCMA",
      "label": "Ángulo CMA (recto)",
      "color": "mora",
      "layerId": "construction",
      "order": 19,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo recto CMA",
        "role": "primary"
      },
      "target": true,
      "targetId": "angCMA",
      "objectType": "angle",
      "points": [
        "pA",
        "pM",
        "pC"
      ],
      "sweep": "non-reflex",
      "marker": "square",
      "perpendicularRelationId": "relPerpCMA",
      "appearance": {
        "radius": 0.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "congruenceAP",
      "label": "Marca AP",
      "color": "canela",
      "layerId": "construction",
      "order": 28,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia en AP",
        "role": "secondary"
      },
      "target": true,
      "targetId": "congruence-ap",
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "pA",
          "pP"
        ]
      },
      "count": 2,
      "height": 0.4,
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "congruenceAC",
      "label": "Marca AC",
      "color": "canela",
      "layerId": "construction",
      "order": 29,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia en AC",
        "role": "secondary"
      },
      "target": true,
      "targetId": "congruence-ac",
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
      "height": 0.4,
      "appearance": {
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [
    {
      "id": "relPerpPMA",
      "label": "Perpendicularidad PMA",
      "enabled": true,
      "type": "perpendicular",
      "supports": [
        [
          "pM",
          "pA"
        ],
        [
          "pM",
          "pP"
        ]
      ]
    },
    {
      "id": "relPerpCMA",
      "label": "Perpendicularidad CMA",
      "enabled": true,
      "type": "perpendicular",
      "supports": [
        [
          "pM",
          "pA"
        ],
        [
          "pM",
          "pC"
        ]
      ]
    }
  ],
  "steps": [
    {
      "id": "step1",
      "label": "Recta base y punto exterior",
      "description": "Dada una recta l y un punto exterior P ∉ l, buscamos trazar la perpendicular por P a l.",
      "visibleTargets": [
        "lineL",
        "pA",
        "pB",
        "pP"
      ],
      "durationMs": 1000,
      "objectStates": {
        "lineL": {
          "emphasis": "primary"
        },
        "pP": {
          "emphasis": "primary"
        }
      }
    },
    {
      "id": "step2",
      "label": "Construcción del triángulo reflejado",
      "description": "En el semiplano opuesto transportamos el ángulo ∠BAP determinando la semirrecta con ∠BAC ≅ ∠BAP y AC ≅ AP.",
      "visibleTargets": [
        "lineL",
        "pA",
        "pB",
        "pP",
        "pC",
        "segAP",
        "segAC",
        "angMAP",
        "angMAC",
        "congruenceAP",
        "congruenceAC"
      ],
      "durationMs": 1000,
      "objectStates": {
        "pC": {
          "emphasis": "primary"
        },
        "segAP": {
          "emphasis": "primary"
        },
        "segAC": {
          "emphasis": "primary"
        },
        "angMAP": {
          "emphasis": "primary"
        },
        "angMAC": {
          "emphasis": "primary"
        }
      }
    },
    {
      "id": "step3",
      "label": "Intersección con la recta (Axioma de Pasch)",
      "description": "Como P y C yacen en semiplanos opuestos respecto a l, el segmento PC interseca a l en un punto M.",
      "visibleTargets": [
        "lineL",
        "pA",
        "pB",
        "pP",
        "pC",
        "pM",
        "segPC",
        "segAP",
        "segAC"
      ],
      "durationMs": 1000,
      "objectStates": {
        "pM": {
          "emphasis": "primary"
        },
        "segPC": {
          "emphasis": "primary"
        }
      }
    },
    {
      "id": "step4",
      "label": "Congruencia LAL de triángulos",
      "description": "En △PAM y △CAM: AP ≅ AC, AM es común y ∠PAM ≅ ∠CAM. Por LAL, △PAM ≅ △CAM.",
      "visibleTargets": [
        "lineL",
        "pA",
        "pB",
        "pP",
        "pC",
        "pM",
        "segPC",
        "segAP",
        "segAC",
        "polyPAM",
        "polyCAM"
      ],
      "durationMs": 1000,
      "objectStates": {
        "polyPAM": {
          "emphasis": "primary"
        },
        "polyCAM": {
          "emphasis": "primary"
        }
      }
    },
    {
      "id": "step5",
      "label": "Ángulos rectos adyacentes y perpendicularidad",
      "description": "Por congruencia, ∠AMP ≅ ∠AMC. Al ser adyacentes suplementarios, ambos son ángulos rectos, probando PM ⊥ l.",
      "visibleTargets": [
        "lineL",
        "pA",
        "pB",
        "pP",
        "pC",
        "pM",
        "segPC",
        "linePM",
        "angPMA",
        "angCMA"
      ],
      "durationMs": 1000,
      "objectStates": {
        "linePM": {
          "emphasis": "primary"
        },
        "angPMA": {
          "emphasis": "primary"
        },
        "angCMA": {
          "emphasis": "primary"
        }
      }
    },
    {
      "id": "step6",
      "label": "Unicidad por el teorema del ángulo exterior",
      "description": "Un segundo pie M' formaría △PMM' con dos ángulos rectos, contradiciendo el teorema del ángulo exterior.",
      "visibleTargets": [
        "lineL",
        "pA",
        "pB",
        "pP",
        "pM",
        "linePM",
        "angPMA"
      ],
      "durationMs": 1000,
      "objectStates": {
        "lineL": {
          "emphasis": "primary"
        },
        "linePM": {
          "emphasis": "primary"
        },
        "pM": {
          "emphasis": "primary"
        }
      }
    }
  ],
  "note": "Arrastra el punto exterior P para explorar cómo el pie M y el punto reflejado C se adaptan manteniendo la ortogonalidad.",
  "translations": {
    "eu": {
      "title": "Froga: Perpendikularraren existentzia eta bakartasuna",
      "note": "Arrastatu P kanpo-puntua M oina eta C islatutako puntua ortogonaltasuna mantenduz nola egokitzen diren aztertzeko.",
      "steps": {
        "step1": {
          "label": "Oinarrizko zuzena eta kanpo-puntua",
          "description": "l zuzena eta P ∉ l kanpo-puntu bat emanda, P-tik l-rekiko perpendikularra marraztu nahi dugu."
        },
        "step2": {
          "label": "Triangelu islatuaren eraikuntza",
          "description": "Kontrako erdi-planoan ∠BAP angelua garraiatzen dugu ∠BAC ≅ ∠BAP eta AC ≅ AP betetzen dituen C puntua finkatuz."
        },
        "step3": {
          "label": "Zuzenarekiko ebakidura (Pasch-en axioma)",
          "description": "P eta C erdi-plano desberdinetan daudenez, PC segmentuak l zuzena M puntu batean ebakitzen du."
        },
        "step4": {
          "label": "Triangeluen LAL kongruentzia",
          "description": "△PAM eta △CAM triangeluetan: AP ≅ AC, AM komuna da eta ∠PAM ≅ ∠CAM. LAL bidez, △PAM ≅ △CAM."
        },
        "step5": {
          "label": "Ondoan dauden angelu zuzenak eta perpendikulartasuna",
          "description": "Kongruentziagatik, ∠AMP ≅ ∠AMC. Osagarri eta ondoz-ondokoak direnez, angelu zuzenak dira, beraz PM ⊥ l."
        },
        "step6": {
          "label": "Bakartasuna kanpo-angeluaren teoremagatik",
          "description": "Bigarren M' oin batek bi angelu zuzen dituen △PMM' sortuko luke, kanpo-angeluaren teoremaren aurka."
        }
      }
    },
    "en": {
      "title": "Proof: Existence and Uniqueness of the Perpendicular",
      "note": "Drag exterior point P to explore how foot M and reflected point C adapt while preserving orthogonality.",
      "steps": {
        "step1": {
          "label": "Base line and exterior point",
          "description": "Given a line l and an exterior point P ∉ l, we construct the perpendicular to l passing through P."
        },
        "step2": {
          "label": "Construction of reflected triangle",
          "description": "In the opposite half-plane, transport angle ∠BAP to determine C such that ∠BAC ≅ ∠BAP and AC ≅ AP."
        },
        "step3": {
          "label": "Intersection with the line (Pasch's Axiom)",
          "description": "Since P and C lie in opposite half-planes, segment PC intersects line l at a point M."
        },
        "step4": {
          "label": "SAS triangle congruence",
          "description": "In △PAM and △CAM: AP ≅ AC, AM is shared, and ∠PAM ≅ ∠CAM. By SAS, △PAM ≅ △CAM."
        },
        "step5": {
          "label": "Adjacent right angles and perpendicularity",
          "description": "By congruence, ∠AMP ≅ ∠AMC. Being supplementary adjacent angles, both are right angles, hence PM ⊥ l."
        },
        "step6": {
          "label": "Uniqueness via exterior angle theorem",
          "description": "A second foot M' would yield △PMM' with two right angles, contradicting the exterior angle theorem."
        }
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const DemoExistenciaPerpendicular = () => <DiagramRenderer spec={DemoExistenciaPerpendicularSpec} />;

