import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const DirectoSimulationSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Método directo: flujo deductivo e inferencia",
  "componentId": "directo-simulation",
  "category": "Metodos",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "showLabels": true,
  "viewport": {
    "bounds": [
      -5.5,
      3.2,
      5.5,
      -3.2
    ],
    "home": [
      -5.5,
      3.2,
      5.5,
      -3.2
    ],
    "minZoom": 0.5,
    "maxZoom": 4,
    "padding": 0.1
  },
  "layers": [
    {
      "id": "funnel",
      "label": "Espacio de estados lógicos",
      "order": 0,
      "visible": true,
      "locked": false
    },
    {
      "id": "supports",
      "label": "Eje deductivo",
      "order": 1,
      "visible": true,
      "locked": false
    },
    {
      "id": "geometry",
      "label": "Proposiciones e inferencias",
      "order": 2,
      "visible": true,
      "locked": false
    },
    {
      "id": "annotations",
      "label": "Anotaciones y justificaciones",
      "order": 3,
      "visible": true,
      "locked": false
    }
  ],
  "groups": [],
  "objects": [
    {
      "id": "pEjeL",
      "label": "Eje L",
      "color": "carbon",
      "layerId": "supports",
      "order": 10,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -5,
        "y": 0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "pEjeR",
      "label": "Eje R",
      "color": "carbon",
      "layerId": "supports",
      "order": 20,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 5,
        "y": 0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "segEje",
      "label": "Eje deductivo",
      "color": "carbon",
      "layerId": "supports",
      "order": 30,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pEjeL",
          "pEjeR"
        ]
      },
      "appearance": {
        "strokeWidth": 1.5,
        "strokeOpacity": 0.25,
        "dashed": true
      }
    },
    {
      "id": "pEmbudoT1",
      "label": "Embudo Sup 1",
      "color": "carbon",
      "layerId": "funnel",
      "order": 35,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -4.6,
        "y": 1.8
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "pEmbudoT2",
      "label": "Embudo Sup 2",
      "color": "carbon",
      "layerId": "funnel",
      "order": 36,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 4.5,
        "y": 0.6
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "pEmbudoB2",
      "label": "Embudo Inf 2",
      "color": "carbon",
      "layerId": "funnel",
      "order": 37,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 4.5,
        "y": -0.6
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "pEmbudoB1",
      "label": "Embudo Inf 1",
      "color": "carbon",
      "layerId": "funnel",
      "order": 38,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -4.6,
        "y": -1.8
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false
      }
    },
    {
      "id": "poligonoEmbudo",
      "label": "Espacio de posibilidad deductiva",
      "color": "carbon",
      "layerId": "funnel",
      "order": 39,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "pEmbudoT1",
          "pEmbudoT2",
          "pEmbudoB2",
          "pEmbudoB1"
        ]
      },
      "appearance": {
        "strokeWidth": 1.2,
        "strokeOpacity": 0.2,
        "fillOpacity": 0.04,
        "dashed": true
      }
    },
    {
      "id": "pP",
      "label": "Hipótesis P",
      "color": "terracota",
      "layerId": "geometry",
      "order": 100,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Hipótesis P (punto de partida de la deducción)",
        "role": "primary"
      },
      "target": true,
      "targetId": "pP",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3.8,
        "y": 0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 9,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pP1",
      "label": "Proposición P₁",
      "color": "carbon",
      "layerId": "geometry",
      "order": 110,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Proposición intermedia P₁",
        "role": "secondary"
      },
      "target": true,
      "targetId": "pP1",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -1.3,
        "y": 0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 8,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pP2",
      "label": "Proposición P₂",
      "color": "carbon",
      "layerId": "geometry",
      "order": 120,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Proposición intermedia P₂",
        "role": "secondary"
      },
      "target": true,
      "targetId": "pP2",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 1.2,
        "y": 0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 8,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pQ",
      "label": "Tesis Q",
      "color": "canela",
      "layerId": "geometry",
      "order": 130,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Tesis Q (objetivo demostrado)",
        "role": "primary"
      },
      "target": true,
      "targetId": "pQ",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 3.7,
        "y": 0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 9,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segPP1",
      "label": "Inferencia P ⇒ P₁",
      "color": "mora",
      "layerId": "geometry",
      "order": 200,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Paso de inferencia P ⇒ P₁",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segPP1",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pP",
          "pP1"
        ]
      },
      "appearance": {
        "strokeWidth": 4,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segP1P2",
      "label": "Inferencia P₁ ⇒ P₂",
      "color": "mora",
      "layerId": "geometry",
      "order": 210,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Paso de inferencia P₁ ⇒ P₂",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segP1P2",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pP1",
          "pP2"
        ]
      },
      "appearance": {
        "strokeWidth": 4,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segP2Q",
      "label": "Inferencia P₂ ⇒ Q",
      "color": "canela",
      "layerId": "geometry",
      "order": 220,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Paso final de inferencia P₂ ⇒ Q",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segP2Q",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pP2",
          "pQ"
        ]
      },
      "appearance": {
        "strokeWidth": 4,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "lblP",
      "label": "Etiqueta P",
      "color": "terracota",
      "layerId": "annotations",
      "order": 300,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "annotation"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "label",
      "content": {
        "text": "P (Hipótesis)"
      },
      "anchor": {
        "type": "object",
        "object": "pP",
        "offset": [
          -0.7,
          0.45
        ]
      },
      "appearance": {
        "fontSize": 15,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "lblP1",
      "label": "Etiqueta P₁",
      "color": "carbon",
      "layerId": "annotations",
      "order": 310,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "annotation"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "label",
      "content": {
        "text": "P₁"
      },
      "anchor": {
        "type": "object",
        "object": "pP1",
        "offset": [
          -0.2,
          0.45
        ]
      },
      "appearance": {
        "fontSize": 15,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "lblP2",
      "label": "Etiqueta P₂",
      "color": "carbon",
      "layerId": "annotations",
      "order": 320,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "annotation"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "label",
      "content": {
        "text": "P₂"
      },
      "anchor": {
        "type": "object",
        "object": "pP2",
        "offset": [
          -0.2,
          0.45
        ]
      },
      "appearance": {
        "fontSize": 15,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "lblQ",
      "label": "Etiqueta Q",
      "color": "canela",
      "layerId": "annotations",
      "order": 330,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "annotation"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "label",
      "content": {
        "text": "Q (Tesis)"
      },
      "anchor": {
        "type": "object",
        "object": "pQ",
        "offset": [
          -0.5,
          0.45
        ]
      },
      "appearance": {
        "fontSize": 15,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "lblJust1",
      "label": "Justificación 1",
      "color": "mora",
      "layerId": "annotations",
      "order": 340,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "annotation"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "label",
      "content": {
        "text": "1. Modus Ponens"
      },
      "anchor": {
        "type": "object",
        "object": "pP1",
        "offset": [
          -1.6,
          -0.55
        ]
      },
      "appearance": {
        "fontSize": 12,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "lblJust2",
      "label": "Justificación 2",
      "color": "mora",
      "layerId": "annotations",
      "order": 350,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "annotation"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "label",
      "content": {
        "text": "2. Axioma / Teorema"
      },
      "anchor": {
        "type": "object",
        "object": "pP2",
        "offset": [
          -1.5,
          -0.55
        ]
      },
      "appearance": {
        "fontSize": 12,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "lblJust3",
      "label": "Justificación 3",
      "color": "canela",
      "layerId": "annotations",
      "order": 360,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "annotation"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "label",
      "content": {
        "text": "3. Conclusión válida"
      },
      "anchor": {
        "type": "object",
        "object": "pQ",
        "offset": [
          -1.6,
          -0.55
        ]
      },
      "appearance": {
        "fontSize": 12,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "lblTituloEmbudo",
      "label": "Tag Espacio Deductivo",
      "color": "carbon",
      "layerId": "annotations",
      "order": 370,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "annotation"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "label",
      "content": {
        "text": "Canalización deductiva: P ⇒ P₁ ⇒ P₂ ⇒ Q"
      },
      "anchor": {
        "type": "object",
        "object": "pEmbudoT1",
        "offset": [
          0.3,
          0.3
        ]
      },
      "appearance": {
        "fontSize": 13,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [],
  "steps": [
    {
      "id": "paso-hipotesis",
      "label": "1. Planteamiento de la hipótesis P",
      "description": "Se establece la hipótesis P como punto de partida indiscutible y premisa inicial del razonamiento.",
      "durationMs": 800,
      "visibleTargets": [
        "pP",
        "pP1",
        "pP2",
        "pQ",
        "segPP1",
        "segP1P2",
        "segP2Q",
        "lblP",
        "lblTituloEmbudo"
      ],
      "objectStates": {
        "pP": {
          "visible": true,
          "emphasis": "primary"
        },
        "segPP1": {
          "visible": true,
          "emphasis": "none"
        },
        "pP1": {
          "visible": true,
          "emphasis": "none"
        },
        "segP1P2": {
          "visible": true,
          "emphasis": "none"
        },
        "pP2": {
          "visible": true,
          "emphasis": "none"
        },
        "segP2Q": {
          "visible": true,
          "emphasis": "none"
        },
        "pQ": {
          "visible": true,
          "emphasis": "none"
        }
      }
    },
    {
      "id": "paso-primera-inferencia",
      "label": "2. Primera deducción: P ⇒ P₁",
      "description": "Aplicando un axioma o definición mediante modus ponens, de P se deduce válidamente la proposición intermedia P₁.",
      "durationMs": 800,
      "visibleTargets": [
        "pP",
        "pP1",
        "pP2",
        "pQ",
        "segPP1",
        "segP1P2",
        "segP2Q",
        "lblP",
        "lblP1",
        "lblJust1",
        "lblTituloEmbudo"
      ],
      "objectStates": {
        "pP": {
          "visible": true,
          "emphasis": "secondary"
        },
        "segPP1": {
          "visible": true,
          "emphasis": "primary"
        },
        "pP1": {
          "visible": true,
          "emphasis": "primary"
        }
      }
    },
    {
      "id": "paso-segunda-inferencia",
      "label": "3. Encadenamiento: P₁ ⇒ P₂",
      "description": "Mediante definiciones y teoremas demostrados previamente, se deduce P₂ a partir de P₁.",
      "durationMs": 800,
      "visibleTargets": [
        "pP",
        "pP1",
        "pP2",
        "pQ",
        "segPP1",
        "segP1P2",
        "segP2Q",
        "lblP",
        "lblP1",
        "lblP2",
        "lblJust1",
        "lblJust2",
        "lblTituloEmbudo"
      ],
      "objectStates": {
        "pP1": {
          "visible": true,
          "emphasis": "secondary"
        },
        "segP1P2": {
          "visible": true,
          "emphasis": "primary"
        },
        "pP2": {
          "visible": true,
          "emphasis": "primary"
        }
      }
    },
    {
      "id": "paso-conclusion",
      "label": "4. Conclusión final: P₂ ⇒ Q",
      "description": "El encadenamiento completo alcanza la tesis Q, completando la demostración directa de P ⇒ Q.",
      "durationMs": 800,
      "visibleTargets": [
        "pP",
        "pP1",
        "pP2",
        "pQ",
        "segPP1",
        "segP1P2",
        "segP2Q",
        "lblP",
        "lblP1",
        "lblP2",
        "lblQ",
        "lblJust1",
        "lblJust2",
        "lblJust3",
        "lblTituloEmbudo"
      ],
      "objectStates": {
        "pP": {
          "visible": true,
          "emphasis": "secondary"
        },
        "segPP1": {
          "visible": true,
          "emphasis": "secondary"
        },
        "segP1P2": {
          "visible": true,
          "emphasis": "secondary"
        },
        "segP2Q": {
          "visible": true,
          "emphasis": "primary"
        },
        "pQ": {
          "visible": true,
          "emphasis": "primary"
        }
      }
    }
  ],
  "note": "El método directo construye una sucesión de implicaciones válidas desde la hipótesis P hasta la tesis Q.",
  "translations": {
    "eu": {
      "title": "Metodo zuzena: dedukzio-katea eta inferentzia",
      "note": "Metodo zuzenak inplikazio baliagarrien segida bat eraikitzen du P hipotesitik Q tesira iritsi arte.",
      "steps": {
        "paso-hipotesis": {
          "label": "1. P hipotesia planteatzea",
          "description": "Hasierako P hipotesia onartzen da dedukzioaren abiapuntu ukaezin gisa."
        },
        "paso-primera-inferencia": {
          "label": "2. Lehen dedukzioa: P ⇒ P₁",
          "description": "Modus ponens araua aplikatuz P₁ tarteko lema baliagarriki ondorioztatzen da."
        },
        "paso-segunda-inferencia": {
          "label": "3. Kateatzea: P₁ ⇒ P₂",
          "description": "Definizioen eta aldez aurretik frogatutako teoremen bidez, P₂ ondorioztatzen da P₁-tik abiatuta."
        },
        "paso-conclusion": {
          "label": "4. Azken ondorioa: P₂ ⇒ Q",
          "description": "Kateamendu osoak Q tesia lortzen du, P ⇒ Q-ren froga zuzena osatuz."
        }
      },
      "texts": {
        "lblP": "P (Hipotesia)",
        "lblQ": "Q (Tesia)",
        "lblJust1": "1. Modus Ponens",
        "lblJust2": "2. Axioma / Teorema",
        "lblJust3": "3. Ondorio baliozkoa",
        "lblTituloEmbudo": "Bideratze deduktiboa: P ⇒ P₁ ⇒ P₂ ⇒ Q"
      },
      "ariaLabels": {
        "pP": "P hipotesia (dedukzioaren abiapuntua)",
        "pP1": "P₁ tarteko proposizioa",
        "pP2": "P₂ tarteko proposizioa",
        "pQ": "Q tesia (frogatutako helburua)",
        "segPP1": "Inferentzia-urratsa P ⇒ P₁",
        "segP1P2": "Inferentzia-urratsa P₁ ⇒ P₂",
        "segP2Q": "Azken inferentzia-urratsa P₂ ⇒ Q"
      }
    },
    "en": {
      "title": "Direct Method: Deductive Chain and Inference",
      "note": "The direct method establishes a finite sequence of valid implications from hypothesis P to conclusion Q.",
      "steps": {
        "paso-hipotesis": {
          "label": "1. Stating Hypothesis P",
          "description": "The initial hypothesis P is assumed as the indisputable starting point of the deduction."
        },
        "paso-primera-inferencia": {
          "label": "2. First Deduction: P ⇒ P₁",
          "description": "Applying the rule of modus ponens deductively establishes the intermediate lemma P₁."
        },
        "paso-segunda-inferencia": {
          "label": "3. Chaining Steps: P₁ ⇒ P₂",
          "description": "Using axioms, definitions, and prior theorems, P₂ is inferred from P₁."
        },
        "paso-conclusion": {
          "label": "4. Final Conclusion: P₂ ⇒ Q",
          "description": "The chain terminates at conclusion Q, completing the direct proof of P ⇒ Q."
        }
      },
      "texts": {
        "lblP": "P (Hypothesis)",
        "lblQ": "Q (Thesis)",
        "lblJust1": "1. Modus Ponens",
        "lblJust2": "2. Axiom / Theorem",
        "lblJust3": "3. Valid conclusion",
        "lblTituloEmbudo": "Deductive channel: P ⇒ P₁ ⇒ P₂ ⇒ Q"
      },
      "ariaLabels": {
        "pP": "Hypothesis P (starting point of the deduction)",
        "pP1": "Intermediate proposition P₁",
        "pP2": "Intermediate proposition P₂",
        "pQ": "Thesis Q (proven goal)",
        "segPP1": "Inference step P ⇒ P₁",
        "segP1P2": "Inference step P₁ ⇒ P₂",
        "segP2Q": "Final inference step P₂ ⇒ Q"
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const DirectoSimulation = () => <DiagramRenderer spec={DirectoSimulationSpec} />;
