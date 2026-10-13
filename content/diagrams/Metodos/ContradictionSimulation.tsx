import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const ContradictionSimulationSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Demostración por contradicción y contraposición",
  "componentId": "contradiction-simulation",
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
      "id": "regions",
      "label": "Regiones lógicas P y Q",
      "order": 0,
      "visible": true,
      "locked": false
    },
    {
      "id": "supports",
      "label": "Ejes y soportes",
      "order": 1,
      "visible": true,
      "locked": false
    },
    {
      "id": "geometry",
      "label": "Ramas de inferencia y colisión",
      "order": 2,
      "visible": true,
      "locked": false
    },
    {
      "id": "annotations",
      "label": "Anotaciones formales",
      "order": 3,
      "visible": true,
      "locked": false
    }
  ],
  "groups": [],
  "objects": [
    {
      "id": "pCentroQ",
      "label": "Centro Q",
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
        "x": 0,
        "y": 0.2
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
      "id": "pRadioQ",
      "label": "Radio Q",
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
        "x": 2.8,
        "y": 0.2
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
      "id": "circuloQ",
      "label": "Región de la tesis Q",
      "color": "canela",
      "layerId": "regions",
      "order": 30,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Región donde se satisface la tesis Q",
        "role": "secondary"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "circle",
        "center": "pCentroQ",
        "point": "pRadioQ"
      },
      "appearance": {
        "strokeWidth": 2.5,
        "fillOpacity": 0.12,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pCentroP",
      "label": "Centro P",
      "color": "carbon",
      "layerId": "supports",
      "order": 40,
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
        "x": -0.8,
        "y": 0.2
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
      "id": "pRadioP",
      "label": "Radio P",
      "color": "carbon",
      "layerId": "supports",
      "order": 50,
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
        "x": 0.4,
        "y": 0.2
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
      "id": "circuloP",
      "label": "Subregión de la hipótesis P (P ⊆ Q)",
      "color": "terracota",
      "layerId": "regions",
      "order": 60,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Región donde se satisface la hipótesis P contenida en Q",
        "role": "primary"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "circle",
        "center": "pCentroP",
        "point": "pRadioP"
      },
      "appearance": {
        "strokeWidth": 2.5,
        "fillOpacity": 0.22,
        "preserveColorOnHighlight": true
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
        "ariaLabel": "Hipótesis P conocida (dentro de P)",
        "role": "primary"
      },
      "target": true,
      "targetId": "pP",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -1.2,
        "y": 0.2
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 8,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pNotQ",
      "label": "Supuesto ¬Q",
      "color": "canela",
      "layerId": "geometry",
      "order": 150,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Supuesto provisional ¬Q (punto exterior a Q)",
        "role": "primary"
      },
      "target": true,
      "targetId": "pNotQ",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 3.6,
        "y": 1.2
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 8,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pR",
      "label": "Consecuencia R",
      "color": "terracota",
      "layerId": "geometry",
      "order": 200,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Consecuencia lógica R derivada de P",
        "role": "secondary"
      },
      "target": true,
      "targetId": "pR",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -0.4,
        "y": -1.3
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 7,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pNotR",
      "label": "Consecuencia ¬R",
      "color": "canela",
      "layerId": "geometry",
      "order": 210,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Consecuencia ¬R derivada del supuesto ¬Q",
        "role": "secondary"
      },
      "target": true,
      "targetId": "pNotR",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0.4,
        "y": -1.3
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 7,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segPR",
      "label": "Derivación P ⇒ R",
      "color": "terracota",
      "layerId": "geometry",
      "order": 220,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Deducción de R a partir de P",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segPR",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pP",
          "pR"
        ]
      },
      "appearance": {
        "strokeWidth": 3.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segNotQNotR",
      "label": "Derivación ¬Q ⇒ ¬R",
      "color": "canela",
      "layerId": "geometry",
      "order": 230,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Deducción de ¬R a partir de ¬Q",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segNotQNotR",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pNotQ",
          "pNotR"
        ]
      },
      "appearance": {
        "strokeWidth": 3.5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pAbsurdo",
      "label": "Contradicción ⊥",
      "color": "granada",
      "layerId": "geometry",
      "order": 300,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto de colisión lógica: contradicción ⊥",
        "role": "primary"
      },
      "target": true,
      "targetId": "pAbsurdo",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0,
        "y": -2.2
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 10,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segRColision",
      "label": "Conflicto desde R",
      "color": "granada",
      "layerId": "geometry",
      "order": 310,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Vínculo de contradicción desde R",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segRColision",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pR",
          "pAbsurdo"
        ]
      },
      "appearance": {
        "strokeWidth": 3,
        "dashed": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segNotRColision",
      "label": "Conflicto desde ¬R",
      "color": "granada",
      "layerId": "geometry",
      "order": 320,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Vínculo de contradicción desde ¬R",
        "role": "secondary"
      },
      "target": true,
      "targetId": "segNotRColision",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pNotR",
          "pAbsurdo"
        ]
      },
      "appearance": {
        "strokeWidth": 3,
        "dashed": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "lblP",
      "label": "Etiqueta P",
      "color": "terracota",
      "layerId": "annotations",
      "order": 400,
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
        "text": "[Hipótesis P: x ∈ P]"
      },
      "anchor": {
        "type": "object",
        "object": "pP",
        "offset": [
          -0.8,
          0.35
        ]
      },
      "appearance": {
        "fontSize": 14,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "lblNotQ",
      "label": "Etiqueta ¬Q",
      "color": "canela",
      "layerId": "annotations",
      "order": 410,
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
        "text": "[Supuesto ¬Q: x ∉ Q]"
      },
      "anchor": {
        "type": "object",
        "object": "pNotQ",
        "offset": [
          -0.9,
          0.35
        ]
      },
      "appearance": {
        "fontSize": 14,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "lblRegionP",
      "label": "Tag Región P",
      "color": "terracota",
      "layerId": "annotations",
      "order": 412,
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
        "text": "Conjunto P"
      },
      "anchor": {
        "type": "object",
        "object": "pCentroP",
        "offset": [
          -0.5,
          -0.75
        ]
      },
      "appearance": {
        "fontSize": 14,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "lblRegionQ",
      "label": "Tag Región Q",
      "color": "canela",
      "layerId": "annotations",
      "order": 415,
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
        "text": "Conjunto Q (Tesis: P ⊆ Q)"
      },
      "anchor": {
        "type": "object",
        "object": "pRadioQ",
        "offset": [
          -1.6,
          1.7
        ]
      },
      "appearance": {
        "fontSize": 15,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "lblTagExterior",
      "label": "Tag Región Exterior",
      "color": "carbon",
      "layerId": "annotations",
      "order": 418,
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
        "text": "Zona Exterior: ¬Q ⊆ ¬P"
      },
      "anchor": {
        "type": "object",
        "object": "pRadioQ",
        "offset": [
          0.4,
          1.7
        ]
      },
      "appearance": {
        "fontSize": 14,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "lblR",
      "label": "Etiqueta R",
      "color": "terracota",
      "layerId": "annotations",
      "order": 420,
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
        "text": "R"
      },
      "anchor": {
        "type": "object",
        "object": "pR",
        "offset": [
          -0.3,
          0.3
        ]
      },
      "appearance": {
        "fontSize": 14,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "lblNotR",
      "label": "Etiqueta ¬R",
      "color": "canela",
      "layerId": "annotations",
      "order": 430,
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
        "text": "¬R"
      },
      "anchor": {
        "type": "object",
        "object": "pNotR",
        "offset": [
          0.1,
          0.3
        ]
      },
      "appearance": {
        "fontSize": 14,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "lblAbsurdo",
      "label": "Etiqueta Absurdo ⊥",
      "color": "granada",
      "layerId": "annotations",
      "order": 440,
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
        "text": "⊥ (R ∧ ¬R Incompatible)"
      },
      "anchor": {
        "type": "object",
        "object": "pAbsurdo",
        "offset": [
          -1.2,
          -0.45
        ]
      },
      "appearance": {
        "fontSize": 15,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [],
  "steps": [
    {
      "id": "paso-supuesto",
      "label": "1. Planteamiento del supuesto provisional ¬Q",
      "description": "Se asume provisionalmente que la conclusión no se cumple (¬Q, fuera de la región Q), junto a la hipótesis P.",
      "durationMs": 800,
      "visibleTargets": [
        "pP",
        "pNotQ",
        "circuloP",
        "circuloQ",
        "lblP",
        "lblNotQ",
        "lblRegionP",
        "lblRegionQ",
        "lblTagExterior"
      ],
      "objectStates": {
        "pP": {
          "visible": true,
          "emphasis": "primary"
        },
        "pNotQ": {
          "visible": true,
          "emphasis": "primary"
        },
        "pR": {
          "visible": false,
          "emphasis": "none"
        },
        "pNotR": {
          "visible": false,
          "emphasis": "none"
        },
        "segPR": {
          "visible": false,
          "emphasis": "none"
        },
        "segNotQNotR": {
          "visible": false,
          "emphasis": "none"
        },
        "pAbsurdo": {
          "visible": false,
          "emphasis": "none"
        },
        "segRColision": {
          "visible": false,
          "emphasis": "none"
        },
        "segNotRColision": {
          "visible": false,
          "emphasis": "none"
        }
      }
    },
    {
      "id": "paso-deduccion-dual",
      "label": "2. Deducción de consecuencias incompatibles",
      "description": "De P se deduce la consecuencia R; en paralelo, del supuesto provisional ¬Q se deduce deductivamente ¬R.",
      "durationMs": 800,
      "visibleTargets": [
        "pP",
        "pR",
        "segPR",
        "pNotQ",
        "pNotR",
        "segNotQNotR",
        "lblP",
        "lblNotQ",
        "lblR",
        "lblNotR",
        "lblRegionP",
        "lblRegionQ"
      ],
      "objectStates": {
        "pP": {
          "visible": true,
          "emphasis": "none"
        },
        "pNotQ": {
          "visible": true,
          "emphasis": "none"
        },
        "pR": {
          "visible": true,
          "emphasis": "primary"
        },
        "pNotR": {
          "visible": true,
          "emphasis": "primary"
        },
        "segPR": {
          "visible": true,
          "emphasis": "primary"
        },
        "segNotQNotR": {
          "visible": true,
          "emphasis": "primary"
        },
        "pAbsurdo": {
          "visible": false,
          "emphasis": "none"
        }
      }
    },
    {
      "id": "paso-colision-absurdo",
      "label": "3. Incompatibilidad lógica y absurdo (⊥)",
      "description": "R y ¬R no pueden coexistir en el sistema formal: colisionan generando una contradicción formal ⊥.",
      "durationMs": 800,
      "visibleTargets": [
        "pP",
        "pR",
        "segPR",
        "pNotQ",
        "pNotR",
        "segNotQNotR",
        "pAbsurdo",
        "segRColision",
        "segNotRColision",
        "lblP",
        "lblNotQ",
        "lblR",
        "lblNotR",
        "lblAbsurdo"
      ],
      "objectStates": {
        "pR": {
          "visible": true,
          "emphasis": "secondary"
        },
        "pNotR": {
          "visible": true,
          "emphasis": "secondary"
        },
        "segRColision": {
          "visible": true,
          "emphasis": "primary"
        },
        "segNotRColision": {
          "visible": true,
          "emphasis": "primary"
        },
        "pAbsurdo": {
          "visible": true,
          "emphasis": "primary"
        }
      }
    },
    {
      "id": "paso-conclusion-verdad",
      "label": "4. Rechazo del supuesto y conclusión de Q",
      "description": "Dado que el supuesto ¬Q conduce al absurdo (o bien ¬Q implica ¬P), se rechaza ¬Q y queda formalmente demostrado que P implica Q.",
      "durationMs": 800,
      "visibleTargets": [
        "pP",
        "pR",
        "segPR",
        "pNotQ",
        "pNotR",
        "segNotQNotR",
        "pAbsurdo",
        "segRColision",
        "segNotRColision",
        "circuloP",
        "circuloQ",
        "lblP",
        "lblRegionP",
        "lblRegionQ",
        "lblTagExterior",
        "lblAbsurdo"
      ],
      "objectStates": {
        "pP": {
          "visible": true,
          "emphasis": "primary"
        },
        "circuloP": {
          "visible": true,
          "emphasis": "primary"
        },
        "circuloQ": {
          "visible": true,
          "emphasis": "primary"
        },
        "pNotQ": {
          "visible": true,
          "emphasis": "secondary"
        },
        "pAbsurdo": {
          "visible": true,
          "emphasis": "secondary"
        }
      }
    }
  ],
  "note": "Observa cómo la inclusión lógica P ⊆ Q explica a la vez por qué ¬Q ⇒ ¬P y por qué pretender P ∧ ¬Q desencadena una contradicción ⊥.",
  "translations": {
    "eu": {
      "title": "Kontraesanezko eta kontrajarriaren bidezko froga",
      "note": "Ikusi nola P ⊆ Q inklusio logikoak aldi berean azaltzen duen zergatik ¬Q ⇒ ¬P eta zergatik P ∧ ¬Q onartzeak ⊥ kontraesana sortzen duen.",
      "steps": {
        "paso-supuesto": {
          "label": "1. ¬Q behin-behineko hipotesia planteatzea",
          "description": "Tesia betetzen ez dela onartzen da behin-behinean (¬Q, Q eskualdetik kanpo), P hipotesiarekin batera."
        },
        "paso-deduccion-dual": {
          "label": "2. Ondorio kontraesankorrak deduzitzea",
          "description": "P-tik R deduzitzen da; aldi berean, ¬Q hipotesitik ¬R ondorioztatzen da."
        },
        "paso-colision-absurdo": {
          "label": "3. Bateraezintasun logikoa eta absurdoa (⊥)",
          "description": "R eta ¬R ezin dira aldi berean existitu: talka egin eta ⊥ kontraesana sortzen dute."
        },
        "paso-conclusion-verdad": {
          "label": "4. Hipotesia baztertzea eta Q ondorioztatzea",
          "description": "¬Q hipotesiak absurdo batera eramaten duenez (edo ¬Q-k ¬P dakarrenez), ¬Q baztertzen da eta P ⇒ Q frogatuta geratzen da."
        }
      },
      "texts": {
        "lblP": "[P hipotesia: x ∈ P]",
        "lblNotQ": "[¬Q suposizioa: x ∉ Q]",
        "lblRegionP": "P multzoa",
        "lblRegionQ": "Q multzoa (Tesia: P ⊆ Q)",
        "lblTagExterior": "Kanpoko eremua: ¬Q ⊆ ¬P",
        "lblAbsurdo": "⊥ (R ∧ ¬R bateraezina)"
      },
      "ariaLabels": {
        "circuloQ": "Q tesia betetzen den eskualdea",
        "circuloP": "P hipotesia betetzen den eskualdea, Q-ren barruan",
        "pP": "P hipotesi ezaguna (P-ren barruan)",
        "pNotQ": "¬Q behin-behineko suposizioa (Q-tik kanpoko puntua)",
        "pR": "P-tik eratorritako R ondorio logikoa",
        "pNotR": "¬Q suposiziotik eratorritako ¬R ondorioa",
        "segPR": "R-ren dedukzioa P-tik",
        "segNotQNotR": "¬R-ren dedukzioa ¬Q-tik",
        "pAbsurdo": "Talka logikoaren puntua: kontraesana ⊥",
        "segRColision": "R-tiko kontraesan-lotura",
        "segNotRColision": "¬R-tiko kontraesan-lotura"
      }
    },
    "en": {
      "title": "Proof by Contradiction and Contraposition",
      "note": "Observe how logical inclusion P ⊆ Q explains why ¬Q ⇒ ¬P and why assuming P ∧ ¬Q inevitably leads to a formal contradiction ⊥.",
      "steps": {
        "paso-supuesto": {
          "label": "1. Stating Provisional Hypothesis ¬Q",
          "description": "Provisionally assuming the conclusion is false (¬Q, outside region Q) together with hypothesis P."
        },
        "paso-deduccion-dual": {
          "label": "2. Deriving Contradictory Consequences",
          "description": "P deductively leads to consequence R; in parallel, provisional assumption ¬Q leads to ¬R."
        },
        "paso-colision-absurdo": {
          "label": "3. Logical Inconsistency and Absurdity (⊥)",
          "description": "R and ¬R cannot coexist in the deductive framework, colliding into formal contradiction ⊥."
        },
        "paso-conclusion-verdad": {
          "label": "4. Rejecting the Assumption to Establish Q",
          "description": "Because ¬Q forces an untenable contradiction (or proves ¬Q implies ¬P), ¬Q is rejected and P implies Q is established."
        }
      },
      "texts": {
        "lblP": "[Hypothesis P: x ∈ P]",
        "lblNotQ": "[Assumption ¬Q: x ∉ Q]",
        "lblRegionP": "Set P",
        "lblRegionQ": "Set Q (Thesis: P ⊆ Q)",
        "lblTagExterior": "Exterior region: ¬Q ⊆ ¬P",
        "lblAbsurdo": "⊥ (R ∧ ¬R incompatible)"
      },
      "ariaLabels": {
        "circuloQ": "Region where thesis Q holds",
        "circuloP": "Region where hypothesis P holds, contained in Q",
        "pP": "Known hypothesis P (inside P)",
        "pNotQ": "Provisional assumption ¬Q (point outside Q)",
        "pR": "Logical consequence R derived from P",
        "pNotR": "Consequence ¬R derived from the assumption ¬Q",
        "segPR": "Deduction of R from P",
        "segNotQNotR": "Deduction of ¬R from ¬Q",
        "pAbsurdo": "Logical collision point: contradiction ⊥",
        "segRColision": "Contradiction link from R",
        "segNotRColision": "Contradiction link from ¬R"
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const ContradictionSimulation = () => <DiagramRenderer spec={ContradictionSimulationSpec} />;
