import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const DemoReciprocoTrianguloIsoscelesSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Demostración: Teorema recíproco del triángulo isósceles",
  "componentId": "demo-reciproco-triangulo-isosceles",
  "category": "Demos",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "showLabels": true,
  "viewport": {
    "bounds": [
      -5,
      5.5,
      5,
      -3.5
    ],
    "home": [
      -5,
      5.5,
      5,
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
  "groups": [],
  "objects": [
    {
      "id": "pB",
      "label": "B",
      "color": "carbon",
      "layerId": "geometry",
      "order": 20,
      "visible": true,
      "locked": false,
      "groupIds": [],
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
        "x": -3.2,
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
      "groupIds": [],
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
        "x": 3.2,
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
      "groupIds": [],
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
        "x": 0,
        "y": 3.8
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
      "id": "pD",
      "label": "D",
      "color": "terracota",
      "layerId": "construction",
      "order": 23,
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
        "x": "pA.x + 0.45 * (pB.x - pA.x)",
        "y": "pA.y + 0.45 * (pB.y - pA.y)",
        "fallback": [
          -1.44,
          1.19
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
      "groupIds": [],
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
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado BC (Base)",
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
      "groupIds": [],
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
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo ABC",
        "role": "secondary"
      },
      "target": true,
      "targetId": "triangulo-abc",
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
      "id": "segAD",
      "label": "Segmento AD (≅ AC)",
      "color": "terracota",
      "layerId": "construction",
      "order": 13,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento transportado AD",
        "role": "construction"
      },
      "target": true,
      "targetId": "segmento-ad",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pA",
          "pD"
        ]
      },
      "appearance": {
        "strokeWidth": 3.2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segCD",
      "label": "Segmento auxiliar CD",
      "color": "canela",
      "layerId": "construction",
      "order": 14,
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
        "strokeWidth": 2.4,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "polyADC",
      "label": "Triángulo isósceles auxiliar ADC",
      "color": "canela",
      "layerId": "construction",
      "order": 6,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo isósceles auxiliar ADC",
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
        "fillOpacity": 0.16,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "polyBDC",
      "label": "Triángulo BDC",
      "color": "pavo",
      "layerId": "construction",
      "order": 7,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo BDC",
        "role": "construction"
      },
      "target": true,
      "targetId": "triangulo-bdc",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "pB",
          "pD",
          "pC"
        ]
      },
      "appearance": {
        "strokeWidth": 1,
        "fillOpacity": 0.08,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "angB",
      "label": "Ángulo B",
      "color": "mora",
      "layerId": "geometry",
      "order": 16,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo en el vértice B",
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
        "radius": 0.9,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "angC",
      "label": "Ángulo C",
      "color": "mora",
      "layerId": "geometry",
      "order": 17,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo en el vértice C",
        "role": "secondary"
      },
      "target": true,
      "targetId": "angulo-c",
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
      "id": "angADC",
      "label": "Ángulo ADC",
      "color": "canela",
      "layerId": "construction",
      "order": 18,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo ADC",
        "role": "construction"
      },
      "target": true,
      "targetId": "angulo-adc",
      "objectType": "angle",
      "points": [
        "pA",
        "pD",
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
      "id": "angACD",
      "label": "Ángulo ACD",
      "color": "canela",
      "layerId": "construction",
      "order": 19,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo ACD",
        "role": "construction"
      },
      "target": true,
      "targetId": "angulo-acd",
      "objectType": "angle",
      "points": [
        "pA",
        "pC",
        "pD"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 0.6,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "angExtD",
      "label": "Ángulo externo BDC",
      "color": "granada",
      "layerId": "construction",
      "order": 24,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo externo en D",
        "role": "construction"
      },
      "target": true,
      "targetId": "angulo-externo-d",
      "objectType": "angle",
      "points": [
        "pB",
        "pD",
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
      "id": "congruenceAD",
      "label": "Marca AD",
      "color": "terracota",
      "layerId": "construction",
      "order": 28,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia en AD",
        "role": "secondary"
      },
      "target": true,
      "targetId": "congruence-ad",
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "pA",
          "pD"
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
      "color": "terracota",
      "layerId": "geometry",
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
  "relations": [],
  "steps": [
    {
      "id": "step1",
      "label": "Hipótesis y suposición de desigualdad",
      "description": "Por hipótesis ∠B ≅ ∠C. Supongamos por reducción al absurdo que AB ≠ AC, con AB > AC.",
      "visibleTargets": [
        "pA",
        "pB",
        "pC",
        "segAB",
        "segBC",
        "segAC",
        "polyABC",
        "angB",
        "angC"
      ],
      "durationMs": 1000,
      "objectStates": {
        "polyABC": {
          "emphasis": "primary"
        },
        "angB": {
          "emphasis": "primary"
        },
        "angC": {
          "emphasis": "primary"
        },
        "segAB": {
          "emphasis": "secondary"
        },
        "segAC": {
          "emphasis": "secondary"
        }
      }
    },
    {
      "id": "step2",
      "label": "Construcción del punto auxiliar D",
      "description": "Por transporte de segmentos, determinamos D en AB tal que AD ≅ AC. Como AB > AC, D yace entre A y B.",
      "visibleTargets": [
        "pA",
        "pB",
        "pC",
        "pD",
        "segAB",
        "segBC",
        "segAC",
        "segAD",
        "polyABC",
        "angB",
        "angC",
        "congruenceAD",
        "congruenceAC"
      ],
      "durationMs": 1000,
      "objectStates": {
        "pD": {
          "emphasis": "primary"
        },
        "segAD": {
          "emphasis": "primary"
        },
        "segAC": {
          "emphasis": "primary"
        },
        "congruenceAD": {
          "emphasis": "primary"
        },
        "congruenceAC": {
          "emphasis": "primary"
        }
      }
    },
    {
      "id": "step3",
      "label": "Triángulo isósceles auxiliar ADC",
      "description": "Trazamos CD. Como AD ≅ AC, △ADC es isósceles. Por el Pons Asinorum: ∠ADC ≅ ∠ACD.",
      "visibleTargets": [
        "pA",
        "pB",
        "pC",
        "pD",
        "segAB",
        "segBC",
        "segAC",
        "segAD",
        "segCD",
        "polyABC",
        "polyADC",
        "angADC",
        "angACD"
      ],
      "durationMs": 1000,
      "objectStates": {
        "polyADC": {
          "emphasis": "primary"
        },
        "segCD": {
          "emphasis": "primary"
        },
        "angADC": {
          "emphasis": "primary"
        },
        "angACD": {
          "emphasis": "primary"
        }
      }
    },
    {
      "id": "step4",
      "label": "Ángulo externo en △BDC",
      "description": "En △BDC, ∠ADC es el ángulo externo en D respecto a la prolongación de BD. Por tanto: ∠ADC > ∠B ≅ ∠C.",
      "visibleTargets": [
        "pA",
        "pB",
        "pC",
        "pD",
        "segAB",
        "segBC",
        "segAC",
        "segAD",
        "segCD",
        "polyABC",
        "polyBDC",
        "angB",
        "angC",
        "angADC"
      ],
      "durationMs": 1000,
      "objectStates": {
        "polyBDC": {
          "emphasis": "primary"
        },
        "angADC": {
          "emphasis": "primary"
        },
        "angB": {
          "emphasis": "secondary"
        },
        "angC": {
          "emphasis": "secondary"
        }
      }
    },
    {
      "id": "step5",
      "label": "Contradicción angular",
      "description": "La semirrecta CD es interior a ∠C, luego ∠C > ∠ACD. Encadenando: ∠ADC > ∠C > ∠ACD ⟹ ∠ADC > ∠ACD. Contradice ∠ADC ≅ ∠ACD.",
      "visibleTargets": [
        "pA",
        "pB",
        "pC",
        "pD",
        "segAB",
        "segBC",
        "segAC",
        "segAD",
        "segCD",
        "polyABC",
        "angC",
        "angADC",
        "angACD"
      ],
      "durationMs": 1000,
      "objectStates": {
        "angADC": {
          "emphasis": "primary"
        },
        "angACD": {
          "emphasis": "primary"
        },
        "angC": {
          "emphasis": "secondary"
        }
      }
    },
    {
      "id": "step6",
      "label": "Conclusión: AB ≅ AC",
      "description": "Descartada la desigualdad por reducción al absurdo, concluimos AB ≅ AC: el triángulo es isósceles.",
      "visibleTargets": [
        "pA",
        "pB",
        "pC",
        "segAB",
        "segBC",
        "segAC",
        "polyABC",
        "angB",
        "angC"
      ],
      "durationMs": 1000,
      "objectStates": {
        "polyABC": {
          "emphasis": "primary"
        },
        "segAB": {
          "emphasis": "primary"
        },
        "segAC": {
          "emphasis": "primary"
        },
        "angB": {
          "emphasis": "secondary"
        },
        "angC": {
          "emphasis": "secondary"
        }
      }
    }
  ],
  "note": "Arrastra el vértice A para observar la simetría del triángulo isósceles y la construcción auxiliar D.",
  "translations": {
    "eu": {
      "title": "Froga: Triangelu isoszelearen alderantzizko teorema",
      "note": "Arrastatu A erpina triangelu isoszelearen simetria eta D eraikuntza laguntzailea aztertzeko.",
      "steps": {
        "step1": {
          "label": "Hipotesia eta desberdintzaren suposizioa",
          "description": "Hipotesiz ∠B ≅ ∠C. Suposa dezagun absurdora eramanez AB ≠ AC, AB > AC izanik."
        },
        "step2": {
          "label": "D puntu laguntzailearen eraikuntza",
          "description": "Segmentu-garraio bidez, AB gainean D finkatzen dugu AD ≅ AC izan dadin. AB > AC denez, D A eta B artean dago."
        },
        "step3": {
          "label": "ADC triangelu isoszele laguntzailea",
          "description": "CD marrazten dugu. AD ≅ AC denez, △ADC isoszelea da. Pons Asinorum bidez: ∠ADC ≅ ∠ACD."
        },
        "step4": {
          "label": "Kanpo-angelua △BDC-n",
          "description": "△BDC-n, ∠ADC kanpo-angelua da D erpinean BD luzapenarekiko. Beraz: ∠ADC > ∠B ≅ ∠C."
        },
        "step5": {
          "label": "Angelu-kontraesana",
          "description": "CD semirrecta ∠C-ren barnekoa da, beraz ∠C > ∠ACD. Kateatuz: ∠ADC > ∠ACD. Hau eta ∠ADC ≅ ∠ACD ezin dira aldi berean bete."
        },
        "step6": {
          "label": "Ondorioa: AB ≅ AC",
          "description": "Desberdintza absurdora eramanez baztertuta, AB ≅ AC ondorioztatzen dugu: triangelua isoszelea da."
        }
      }
    },
    "en": {
      "title": "Proof: Converse of the Isosceles Triangle Theorem",
      "note": "Drag vertex A to explore the symmetry of the isosceles triangle and the auxiliary construction D.",
      "steps": {
        "step1": {
          "label": "Hypothesis and inequality assumption",
          "description": "By hypothesis ∠B ≅ ∠C. Assume for contradiction that AB ≠ AC, with AB > AC."
        },
        "step2": {
          "label": "Construction of auxiliary point D",
          "description": "By segment transport, locate D on AB such that AD ≅ AC. Since AB > AC, D lies between A and B."
        },
        "step3": {
          "label": "Auxiliary isosceles triangle ADC",
          "description": "Draw CD. Since AD ≅ AC, △ADC is isosceles. By the Pons Asinorum: ∠ADC ≅ ∠ACD."
        },
        "step4": {
          "label": "Exterior angle in △BDC",
          "description": "In △BDC, ∠ADC is the exterior angle at D. Thus: ∠ADC > ∠B ≅ ∠C."
        },
        "step5": {
          "label": "Angle contradiction",
          "description": "Ray CD is interior to ∠C, so ∠C > ∠ACD. Chaining yields ∠ADC > ∠ACD, contradicting ∠ADC ≅ ∠ACD."
        },
        "step6": {
          "label": "Conclusion: AB ≅ AC",
          "description": "Having ruled out inequality by contradiction, we conclude AB ≅ AC: the triangle is isosceles."
        }
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const DemoReciprocoTrianguloIsosceles = () => <DiagramRenderer spec={DemoReciprocoTrianguloIsoscelesSpec} />;

