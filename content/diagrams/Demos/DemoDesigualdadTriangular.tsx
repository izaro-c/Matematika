import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const DemoDesigualdadTriangularSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Demostración: Desigualdad triangular",
  "componentId": "demo-desigualdad-triangular",
  "category": "Demos",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "showLabels": true,
  "viewport": {
    "bounds": [
      -4.5,
      4.5,
      4.5,
      -3
    ],
    "home": [
      -4.5,
      4.5,
      4.5,
      -3
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
        "ariaLabel": "Vértice A",
        "role": "secondary"
      },
      "target": true,
      "targetId": "pA",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3,
        "y": -1.8
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
        "ariaLabel": "Vértice B",
        "role": "secondary"
      },
      "target": true,
      "targetId": "pB",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 1.8,
        "y": -1.8
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
      "color": "terracota",
      "layerId": "geometry",
      "order": 22,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértice C (arrastrable)",
        "role": "primary"
      },
      "target": true,
      "targetId": "pC",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0.2,
        "y": 0.8
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
      "color": "carbon",
      "layerId": "construction",
      "order": 23,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto extendido D",
        "role": "construction"
      },
      "target": true,
      "targetId": "punto-d",
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "pC.x + (hypot(pB.x - pC.x, pB.y - pC.y) / hypot(pC.x - pA.x, pC.y - pA.y)) * (pC.x - pA.x)",
        "y": "pC.y + (hypot(pB.x - pC.x, pB.y - pC.y) / hypot(pC.x - pA.x, pC.y - pA.y)) * (pC.y - pA.y)",
        "fallback": [
          2.03,
          2.31
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
      "label": "Lado c (AB)",
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
        "strokeWidth": 2.6,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segBC",
      "label": "Lado a (BC)",
      "color": "carbon",
      "layerId": "geometry",
      "order": 11,
      "visible": true,
      "locked": false,
      "groupIds": [],
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
        "strokeWidth": 2.6,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segAC",
      "label": "Lado b (AC)",
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
        "strokeWidth": 2.6,
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
      "targetId": "triangulo",
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
      "id": "segCD",
      "label": "Extensión CD (≅ a)",
      "color": "mora",
      "layerId": "construction",
      "order": 13,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Extensión CD",
        "role": "construction"
      },
      "target": true,
      "targetId": "lado-cd",
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
      "id": "segBD",
      "label": "Segmento BD",
      "color": "canela",
      "layerId": "construction",
      "order": 14,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento BD",
        "role": "construction"
      },
      "target": true,
      "targetId": "lado-bd",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pB",
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
      "id": "polyBCD",
      "label": "Triángulo isósceles BCD",
      "color": "canela",
      "layerId": "construction",
      "order": 6,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo isósceles BCD",
        "role": "construction"
      },
      "target": true,
      "targetId": "triangulo-isosceles",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "pC",
          "pB",
          "pD"
        ]
      },
      "appearance": {
        "strokeWidth": 1,
        "fillOpacity": 0.16,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "polyABD",
      "label": "Triángulo extendido ABD",
      "color": "pavo",
      "layerId": "construction",
      "order": 4,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo ABD",
        "role": "construction"
      },
      "target": true,
      "targetId": "triangulo-abd",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "pA",
          "pB",
          "pD"
        ]
      },
      "appearance": {
        "strokeWidth": 1,
        "fillOpacity": 0.08,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "congruenceBC",
      "label": "Marca BC",
      "color": "terracota",
      "layerId": "geometry",
      "order": 28,
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
      "id": "congruenceCD",
      "label": "Marca CD",
      "color": "terracota",
      "layerId": "construction",
      "order": 29,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marca de congruencia en CD",
        "role": "secondary"
      },
      "target": true,
      "targetId": "congruence-cd",
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": [
          "pC",
          "pD"
        ]
      },
      "count": 1,
      "height": 0.4,
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "angCBD",
      "label": "Ángulo CBD",
      "color": "terracota",
      "layerId": "construction",
      "order": 17,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo CBD",
        "role": "construction"
      },
      "target": true,
      "targetId": "angulo-cbd",
      "objectType": "angle",
      "points": [
        "pD",
        "pB",
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
      "id": "angCDB",
      "label": "Ángulo CDB",
      "color": "canela",
      "layerId": "construction",
      "order": 18,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo CDB",
        "role": "construction"
      },
      "target": true,
      "targetId": "angulo-cdb",
      "objectType": "angle",
      "points": [
        "pC",
        "pD",
        "pB"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 0.75,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "angABD",
      "label": "Ángulo ABD",
      "color": "carbon",
      "layerId": "construction",
      "order": 19,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo ABD",
        "role": "construction"
      },
      "target": true,
      "targetId": "angulo-abd",
      "objectType": "angle",
      "points": [
        "pD",
        "pB",
        "pA"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 1.05,
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [],
  "steps": [
    {
      "id": "step1",
      "label": "El triángulo base",
      "description": "Consideramos el triángulo △ABC con lados a = BC, b = CA y c = AB. Demostraremos que b + a > c.",
      "visibleTargets": [
        "pA",
        "pB",
        "pC",
        "segAB",
        "segBC",
        "segAC",
        "polyABC"
      ],
      "durationMs": 1000,
      "objectStates": {
        "polyABC": {
          "emphasis": "primary"
        },
        "segAC": {
          "emphasis": "primary"
        },
        "segBC": {
          "emphasis": "primary"
        },
        "segAB": {
          "emphasis": "secondary"
        }
      }
    },
    {
      "id": "step2",
      "label": "Extensión del lado AC",
      "description": "Prolongamos AC más allá de C construyendo CD ≅ BC = a. La longitud total de AD es b + a.",
      "visibleTargets": [
        "pA",
        "pB",
        "pC",
        "pD",
        "segAB",
        "segBC",
        "segAC",
        "segCD",
        "polyABC",
        "congruenceBC",
        "congruenceCD"
      ],
      "durationMs": 1000,
      "objectStates": {
        "pD": {
          "emphasis": "primary"
        },
        "segCD": {
          "emphasis": "primary"
        },
        "congruenceBC": {
          "emphasis": "primary"
        },
        "congruenceCD": {
          "emphasis": "primary"
        }
      }
    },
    {
      "id": "step3",
      "label": "Triángulo isósceles auxiliar BCD",
      "description": "Trazamos BD. Como CD ≅ BC, △BCD es isósceles y sus ángulos base son congruentes: ∠CBD ≅ ∠CDB.",
      "visibleTargets": [
        "pA",
        "pB",
        "pC",
        "pD",
        "segAB",
        "segBC",
        "segAC",
        "segCD",
        "segBD",
        "polyABC",
        "polyBCD",
        "angCBD",
        "angCDB"
      ],
      "durationMs": 1000,
      "objectStates": {
        "polyBCD": {
          "emphasis": "primary"
        },
        "segBD": {
          "emphasis": "primary"
        },
        "angCBD": {
          "emphasis": "primary"
        },
        "angCDB": {
          "emphasis": "primary"
        }
      }
    },
    {
      "id": "step4",
      "label": "Desigualdad angular en B",
      "description": "∠ABD = ∠ABC + ∠CBD > ∠CBD ≅ ∠CDB = ∠ADB. Por tanto, ∠ABD > ∠ADB.",
      "visibleTargets": [
        "pA",
        "pB",
        "pC",
        "pD",
        "segAB",
        "segBC",
        "segAC",
        "segCD",
        "segBD",
        "polyABC",
        "polyBCD",
        "polyABD",
        "angCBD",
        "angCDB",
        "angABD"
      ],
      "durationMs": 1000,
      "objectStates": {
        "angABD": {
          "emphasis": "primary"
        },
        "angCDB": {
          "emphasis": "secondary"
        },
        "polyABD": {
          "emphasis": "secondary"
        }
      }
    },
    {
      "id": "step5",
      "label": "De ángulo mayor a lado mayor",
      "description": "En △ABD, como ∠ABD > ∠ADB, el lado opuesto AD debe ser mayor que AB: AD > AB ⟹ b + a > c.",
      "visibleTargets": [
        "pA",
        "pB",
        "pC",
        "pD",
        "segAB",
        "segBC",
        "segAC",
        "segCD",
        "segBD",
        "polyABC",
        "polyABD",
        "angABD",
        "angCDB"
      ],
      "durationMs": 1000,
      "objectStates": {
        "segAB": {
          "emphasis": "primary"
        },
        "segAC": {
          "emphasis": "primary"
        },
        "segCD": {
          "emphasis": "primary"
        },
        "polyABD": {
          "emphasis": "primary"
        }
      }
    }
  ],
  "note": "Arrastra el vértice C para modificar la forma del triángulo y observar cómo se recalcula la extensión D.",
  "translations": {
    "eu": {
      "title": "Froga: Triangelu-desberdintza",
      "note": "Arrastatu C erpina triangeluaren forma aldatzeko eta D luzapena nola birkalkulatzen den ikusteko.",
      "steps": {
        "step1": {
          "label": "Oinarrizko triangelua",
          "description": "△ABC triangelua hartzen dugu a = BC, b = CA eta c = AB aldeekin. b + a > c dela frogatuko dugu."
        },
        "step2": {
          "label": "AC aldearen luzapena",
          "description": "AC luzatzen dugu C-tik harantzago CD ≅ BC = a eraikiz. AD-ren luzera osoa b + a da."
        },
        "step3": {
          "label": "BCD triangelu isoszele laguntzailea",
          "description": "BD marrazten dugu. CD ≅ BC denez, △BCD isoszelea da eta bere oinarriko angeluak kongruenteak dira: ∠CBD ≅ ∠CDB."
        },
        "step4": {
          "label": "Angelu-desberdintza B erpinean",
          "description": "∠ABD = ∠ABC + ∠CBD > ∠CBD ≅ ∠CDB = ∠ADB. Beraz, ∠ABD > ∠ADB."
        },
        "step5": {
          "label": "Angelu handiagotik alde handiagora",
          "description": "△ABD-n, ∠ABD > ∠ADB denez, aurkako AD aldea AB baino handiagoa izan behar da: AD > AB ⟹ b + a > c."
        }
      },
      "ariaLabels": {
        "pA": "A erpina",
        "pB": "B erpina",
        "pC": "C erpina (arrastagarria)",
        "pD": "D puntu luzatua",
        "segAB": "AB aldea",
        "segBC": "BC aldea",
        "segAC": "AC aldea",
        "polyABC": "ABC triangelua",
        "segCD": "CD luzapena",
        "segBD": "BD segmentua",
        "polyBCD": "BCD triangelu isoszelea",
        "polyABD": "ABD triangelua",
        "congruenceBC": "Kongruentzia-marka BC-n",
        "congruenceCD": "Kongruentzia-marka CD-n",
        "angCBD": "CBD angelua",
        "angCDB": "CDB angelua",
        "angABD": "ABD angelua"
      }
    },
    "en": {
      "title": "Proof: Triangle Inequality",
      "note": "Drag vertex C to adjust the triangle shape and observe how extension D updates dynamically.",
      "steps": {
        "step1": {
          "label": "Base triangle",
          "description": "Consider triangle △ABC with sides a = BC, b = CA, and c = AB. We will prove that b + a > c."
        },
        "step2": {
          "label": "Extension of side AC",
          "description": "Extend AC past C by constructing CD ≅ BC = a. The total length of AD is b + a."
        },
        "step3": {
          "label": "Auxiliary isosceles triangle BCD",
          "description": "Draw BD. Since CD ≅ BC, △BCD is isosceles and its base angles are congruent: ∠CBD ≅ ∠CDB."
        },
        "step4": {
          "label": "Angle inequality at B",
          "description": "∠ABD = ∠ABC + ∠CBD > ∠CBD ≅ ∠CDB = ∠ADB. Therefore, ∠ABD > ∠ADB."
        },
        "step5": {
          "label": "From larger angle to larger side",
          "description": "In △ABD, since ∠ABD > ∠ADB, the opposite side AD must exceed AB: AD > AB ⟹ b + a > c."
        }
      },
      "ariaLabels": {
        "pA": "Vertex A",
        "pB": "Vertex B",
        "pC": "Vertex C (draggable)",
        "pD": "Extended point D",
        "segAB": "Side AB",
        "segBC": "Side BC",
        "segAC": "Side AC",
        "polyABC": "Triangle ABC",
        "segCD": "Extension CD",
        "segBD": "Segment BD",
        "polyBCD": "Isosceles triangle BCD",
        "polyABD": "Triangle ABD",
        "congruenceBC": "Congruence mark on BC",
        "congruenceCD": "Congruence mark on CD",
        "angCBD": "Angle CBD",
        "angCDB": "Angle CDB",
        "angABD": "Angle ABD"
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const DemoDesigualdadTriangular = () => <DiagramRenderer spec={DemoDesigualdadTriangularSpec} />;

