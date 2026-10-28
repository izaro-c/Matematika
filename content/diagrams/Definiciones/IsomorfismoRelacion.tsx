import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const IsomorfismoRelacionSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Isomorfismo: una biyección que conserva una relación",
  "componentId": "isomorfismo-relacion",
  "category": "Definiciones",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "showLabels": true,
  "viewport": {
    "bounds": [
      -5,
      2.4,
      5,
      -2.75
    ],
    "home": [
      -5,
      2.4,
      5,
      -2.75
    ],
    "minZoom": 0.6,
    "maxZoom": 3,
    "padding": 0.06
  },
  "layers": [
    {
      "id": "sets",
      "label": "Dominios",
      "order": 0,
      "visible": true,
      "locked": false
    },
    {
      "id": "relation",
      "label": "Relación R",
      "order": 1,
      "visible": true,
      "locked": false
    },
    {
      "id": "arrows",
      "label": "Flechas de f",
      "order": 2,
      "visible": true,
      "locked": false
    },
    {
      "id": "elements",
      "label": "Elementos",
      "order": 3,
      "visible": true,
      "locked": false
    },
    {
      "id": "handles",
      "label": "Puntas arrastrables",
      "order": 4,
      "visible": true,
      "locked": false
    },
    {
      "id": "annotations",
      "label": "Estado",
      "order": 5,
      "visible": true,
      "locked": false
    }
  ],
  "groups": [
    {
      "id": "grupoEstructuraM",
      "label": "Estructura 𝓜",
      "memberIds": [
        "conjuntoM",
        "relM1",
        "relM2"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Resaltar la estructura 𝓜",
        "role": "secondary"
      },
      "target": true,
      "targetId": "estructura-m",
      "color": "carbon"
    },
    {
      "id": "grupoEstructuraN",
      "label": "Estructura 𝓝",
      "memberIds": [
        "conjuntoN",
        "relN1",
        "relN2"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Resaltar la estructura 𝓝",
        "role": "secondary"
      },
      "target": true,
      "targetId": "estructura-n",
      "color": "carbon"
    },
    {
      "id": "grupoRelacionM",
      "label": "Relación R en 𝓜",
      "memberIds": [
        "relM1",
        "relM2"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Resaltar R en 𝓜",
        "role": "secondary"
      },
      "target": true,
      "targetId": "relacion-m",
      "color": "mora"
    },
    {
      "id": "grupoRelacionN",
      "label": "Relación R en 𝓝",
      "memberIds": [
        "relN1",
        "relN2"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Resaltar R en 𝓝",
        "role": "secondary"
      },
      "target": true,
      "targetId": "relacion-n",
      "color": "mora"
    },
    {
      "id": "grupoFlechas",
      "label": "Flechas de f",
      "memberIds": [
        "flechaf1",
        "flechaf2",
        "flechaf3"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Resaltar las flechas de f",
        "role": "secondary"
      },
      "target": true,
      "targetId": "biyeccion-f",
      "color": "terracota"
    }
  ],
  "objects": [
    {
      "id": "centroM",
      "label": "centroM",
      "color": "carbon",
      "layerId": "sets",
      "order": 1,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2.6,
        "y": 0.0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "labelSize": 16,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "radioM",
      "label": "radioM",
      "color": "carbon",
      "layerId": "sets",
      "order": 3,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -1.15,
        "y": 0.0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "labelSize": 16,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "conjuntoM",
      "label": "$M$",
      "color": "carbon",
      "layerId": "sets",
      "order": 4,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Dominio M de la estructura 𝓜",
        "role": "secondary"
      },
      "target": true,
      "targetId": "dominio-m",
      "objectType": "path",
      "geometry": {
        "type": "circle",
        "center": "centroM",
        "point": "radioM"
      },
      "appearance": {
        "strokeWidth": 1.6,
        "strokeOpacity": 0.75,
        "fillOpacity": 0.05,
        "labelVisible": false,
        "highlightFillOpacity": 0.14,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "nombreM",
      "label": "$\\mathcal{M}$",
      "color": "carbon",
      "layerId": "sets",
      "order": 7,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3.6253,
        "y": 1.0253
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": true,
        "labelPosition": "ulft",
        "labelSize": 16,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "centroN",
      "label": "centroN",
      "color": "carbon",
      "layerId": "sets",
      "order": 1,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.6,
        "y": 0.0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "labelSize": 16,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "radioN",
      "label": "radioN",
      "color": "carbon",
      "layerId": "sets",
      "order": 3,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 4.05,
        "y": 0.0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "labelSize": 16,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "conjuntoN",
      "label": "$N$",
      "color": "carbon",
      "layerId": "sets",
      "order": 4,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Dominio N de la estructura 𝓝",
        "role": "secondary"
      },
      "target": true,
      "targetId": "dominio-n",
      "objectType": "path",
      "geometry": {
        "type": "circle",
        "center": "centroN",
        "point": "radioN"
      },
      "appearance": {
        "strokeWidth": 1.6,
        "strokeOpacity": 0.75,
        "fillOpacity": 0.05,
        "labelVisible": false,
        "highlightFillOpacity": 0.14,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "nombreN",
      "label": "$\\mathcal{N}$",
      "color": "carbon",
      "layerId": "sets",
      "order": 7,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 3.6253,
        "y": 1.0253
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": true,
        "labelPosition": "urt",
        "labelSize": 16,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "a1",
      "label": "$a_1$",
      "color": "carbon",
      "layerId": "elements",
      "order": 101,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Elemento a₁ de M",
        "role": "secondary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2.95,
        "y": 0.85
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 5,
        "labelVisible": true,
        "labelPosition": "lft",
        "labelSize": 16,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "a2",
      "label": "$a_2$",
      "color": "carbon",
      "layerId": "elements",
      "order": 102,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Elemento a₂ de M",
        "role": "secondary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2.1,
        "y": 0.0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 5,
        "labelVisible": true,
        "labelPosition": "lft",
        "labelSize": 16,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "a3",
      "label": "$a_3$",
      "color": "carbon",
      "layerId": "elements",
      "order": 103,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Elemento a₃ de M",
        "role": "secondary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2.95,
        "y": -0.85
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 5,
        "labelVisible": true,
        "labelPosition": "lft",
        "labelSize": 16,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "b1",
      "label": "$b_1$",
      "color": "carbon",
      "layerId": "elements",
      "order": 111,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Elemento b₁ de N",
        "role": "secondary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.95,
        "y": 0.85
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 5,
        "labelVisible": true,
        "labelPosition": "rt",
        "labelSize": 16,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "b2",
      "label": "$b_2$",
      "color": "carbon",
      "layerId": "elements",
      "order": 112,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Elemento b₂ de N",
        "role": "secondary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.1,
        "y": 0.0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 5,
        "labelVisible": true,
        "labelPosition": "rt",
        "labelSize": 16,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "b3",
      "label": "$b_3$",
      "color": "carbon",
      "layerId": "elements",
      "order": 113,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Elemento b₃ de N",
        "role": "secondary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.95,
        "y": -0.85
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 5,
        "labelVisible": true,
        "labelPosition": "rt",
        "labelSize": 16,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "rM1Inicio",
      "label": "rM1Inicio",
      "color": "carbon",
      "layerId": "relation",
      "order": 150,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2.8086,
        "y": 0.7086
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "labelSize": 16,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "rM1Fin",
      "label": "rM1Fin",
      "color": "carbon",
      "layerId": "relation",
      "order": 150,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2.2414,
        "y": 0.1414
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "labelSize": 16,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "relM1",
      "label": "$(a_1, a_2) \\in R^{\\mathcal{M}}$",
      "color": "mora",
      "layerId": "relation",
      "order": 151,
      "visible": true,
      "locked": false,
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
          "rM1Inicio",
          "rM1Fin"
        ]
      },
      "appearance": {
        "arrow": "end",
        "strokeWidth": 2,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "fallaM1",
      "label": "Falla en (a1, a2)",
      "color": "granada",
      "layerId": "relation",
      "order": 152,
      "visible": true,
      "visibleWhen": "and(gt(estado.x, 0.5), not(gt(conservaM.x, 0.5)))",
      "locked": false,
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
          "rM1Inicio",
          "rM1Fin"
        ]
      },
      "appearance": {
        "arrow": "end",
        "strokeWidth": 2.6,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "rM2Inicio",
      "label": "rM2Inicio",
      "color": "carbon",
      "layerId": "relation",
      "order": 150,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2.2414,
        "y": -0.1414
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "labelSize": 16,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "rM2Fin",
      "label": "rM2Fin",
      "color": "carbon",
      "layerId": "relation",
      "order": 150,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "-2.2414 - 0.5672 * (1 - quitarRM2)",
        "y": "-0.1414 - 0.5672 * (1 - quitarRM2)",
        "fallback": [
          -2.8086,
          -0.7086
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "labelSize": 16,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "relM2",
      "label": "$(a_2, a_3) \\in R^{\\mathcal{M}}$",
      "color": "mora",
      "layerId": "relation",
      "order": 151,
      "visible": true,
      "locked": false,
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
          "rM2Inicio",
          "rM2Fin"
        ]
      },
      "appearance": {
        "arrow": "end",
        "strokeWidth": 2,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      },
      "visibleWhen": "lt(quitarRM2, 0.97)"
    },
    {
      "id": "fallaM2",
      "label": "Falla en (a2, a3)",
      "color": "granada",
      "layerId": "relation",
      "order": 152,
      "visible": true,
      "visibleWhen": "and(gt(estado.x, 0.5), not(gt(conservaM.y, 0.5)))",
      "locked": false,
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
          "rM2Inicio",
          "rM2Fin"
        ]
      },
      "appearance": {
        "arrow": "end",
        "strokeWidth": 2.6,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "rN1Inicio",
      "label": "rN1Inicio",
      "color": "carbon",
      "layerId": "relation",
      "order": 160,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.2414,
        "y": 0.1414
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "labelSize": 16,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "rN1Fin",
      "label": "rN1Fin",
      "color": "carbon",
      "layerId": "relation",
      "order": 160,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.8086,
        "y": 0.7086
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "labelSize": 16,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "relN1",
      "label": "$(b_2, b_1) \\in R^{\\mathcal{N}}$",
      "color": "mora",
      "layerId": "relation",
      "order": 161,
      "visible": true,
      "locked": false,
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
          "rN1Inicio",
          "rN1Fin"
        ]
      },
      "appearance": {
        "arrow": "end",
        "strokeWidth": 2,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "fallaN1",
      "label": "Falla en (b2, b1)",
      "color": "granada",
      "layerId": "relation",
      "order": 162,
      "visible": true,
      "visibleWhen": "and(gt(estado.x, 0.5), not(gt(reflejaN.x, 0.5)))",
      "locked": false,
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
          "rN1Inicio",
          "rN1Fin"
        ]
      },
      "appearance": {
        "arrow": "end",
        "strokeWidth": 2.6,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "rN2Inicio",
      "label": "rN2Inicio",
      "color": "carbon",
      "layerId": "relation",
      "order": 160,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.95,
        "y": 0.65
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "labelSize": 16,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "rN2Fin",
      "label": "rN2Fin",
      "color": "carbon",
      "layerId": "relation",
      "order": 160,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.95,
        "y": -0.65
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "labelSize": 16,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "relN2",
      "label": "$(b_1, b_3) \\in R^{\\mathcal{N}}$",
      "color": "mora",
      "layerId": "relation",
      "order": 161,
      "visible": true,
      "locked": false,
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
          "rN2Inicio",
          "rN2Fin"
        ]
      },
      "appearance": {
        "arrow": "end",
        "strokeWidth": 2,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "fallaN2",
      "label": "Falla en (b1, b3)",
      "color": "granada",
      "layerId": "relation",
      "order": 162,
      "visible": true,
      "visibleWhen": "and(gt(estado.x, 0.5), not(gt(reflejaN.y, 0.5)))",
      "locked": false,
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
          "rN2Inicio",
          "rN2Fin"
        ]
      },
      "appearance": {
        "arrow": "end",
        "strokeWidth": 2.6,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "f1Llega1",
      "label": "f1Llega1",
      "color": "carbon",
      "layerId": "arrows",
      "order": 200,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.71,
        "y": 0.85
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "labelSize": 16,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "f1Llega2",
      "label": "f1Llega2",
      "color": "carbon",
      "layerId": "arrows",
      "order": 200,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 1.8633,
        "y": 0.0398
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "labelSize": 16,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "f1Llega3",
      "label": "f1Llega3",
      "color": "carbon",
      "layerId": "arrows",
      "order": 200,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.7194,
        "y": -0.7836
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "labelSize": 16,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "f1Reposo",
      "label": "f1Reposo",
      "color": "carbon",
      "layerId": "arrows",
      "order": 200,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2.2,
        "y": 0.85
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "labelSize": 16,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "f1Inicio",
      "label": "f1Inicio",
      "color": "carbon",
      "layerId": "arrows",
      "order": 201,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "a1.x + 0.24 * (hf1.x - a1.x) / max(hypot((hf1.x - a1.x), (hf1.y - a1.y)), 0.001)",
        "y": "a1.y + 0.24 * (hf1.y - a1.y) / max(hypot((hf1.x - a1.x), (hf1.y - a1.y)), 0.001)",
        "fallback": [
          -2.71,
          0.85
        ]
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
      "id": "flechaf1",
      "label": "$f(a_1)$",
      "color": "terracota",
      "layerId": "arrows",
      "order": 300,
      "visible": true,
      "visibleWhen": "gt(hf1.x, 0)",
      "locked": false,
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
          "f1Inicio",
          "hf1"
        ]
      },
      "appearance": {
        "arrow": "end",
        "strokeWidth": 2.2,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "reposof1",
      "label": "Sin imagen: $a_1$",
      "color": "terracota",
      "layerId": "arrows",
      "order": 320,
      "visible": true,
      "visibleWhen": "lt(hf1.x, 0)",
      "locked": false,
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
          "f1Inicio",
          "hf1"
        ]
      },
      "appearance": {
        "dashed": true,
        "arrow": "end",
        "strokeWidth": 1.8,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "hf1",
      "label": "hf1",
      "color": "terracota",
      "layerId": "handles",
      "order": 400,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "primary",
        "ariaLabel": "Punta de la flecha de a₁: elige su imagen en N o devuélvela junto a a₁"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.71,
        "y": 0.85
      },
      "mobility": {
        "type": "on-points",
        "points": [
          "f1Llega1",
          "f1Llega2",
          "f1Llega3",
          "f1Reposo"
        ]
      },
      "appearance": {
        "size": 10,
        "labelVisible": false,
        "opacity": 0,
        "highlightSize": 5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "f2Llega1",
      "label": "f2Llega1",
      "color": "carbon",
      "layerId": "arrows",
      "order": 200,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.7133,
        "y": 0.8102
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "labelSize": 16,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "f2Llega2",
      "label": "f2Llega2",
      "color": "carbon",
      "layerId": "arrows",
      "order": 200,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 1.86,
        "y": 0.0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "labelSize": 16,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "f2Llega3",
      "label": "f2Llega3",
      "color": "carbon",
      "layerId": "arrows",
      "order": 200,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.7133,
        "y": -0.8102
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "labelSize": 16,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "f2Reposo",
      "label": "f2Reposo",
      "color": "carbon",
      "layerId": "arrows",
      "order": 200,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -1.45,
        "y": 0.0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "labelSize": 16,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "f2Inicio",
      "label": "f2Inicio",
      "color": "carbon",
      "layerId": "arrows",
      "order": 201,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "a2.x + 0.24 * (hf2.x - a2.x) / max(hypot((hf2.x - a2.x), (hf2.y - a2.y)), 0.001)",
        "y": "a2.y + 0.24 * (hf2.y - a2.y) / max(hypot((hf2.x - a2.x), (hf2.y - a2.y)), 0.001)",
        "fallback": [
          -1.86,
          0.0
        ]
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
      "id": "flechaf2",
      "label": "$f(a_2)$",
      "color": "terracota",
      "layerId": "arrows",
      "order": 300,
      "visible": true,
      "visibleWhen": "gt(hf2.x, 0)",
      "locked": false,
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
          "f2Inicio",
          "hf2"
        ]
      },
      "appearance": {
        "arrow": "end",
        "strokeWidth": 2.2,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "reposof2",
      "label": "Sin imagen: $a_2$",
      "color": "terracota",
      "layerId": "arrows",
      "order": 320,
      "visible": true,
      "visibleWhen": "lt(hf2.x, 0)",
      "locked": false,
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
          "f2Inicio",
          "hf2"
        ]
      },
      "appearance": {
        "dashed": true,
        "arrow": "end",
        "strokeWidth": 1.8,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "hf2",
      "label": "hf2",
      "color": "terracota",
      "layerId": "handles",
      "order": 400,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "primary",
        "ariaLabel": "Punta de la flecha de a₂: elige su imagen en N o devuélvela junto a a₂"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 1.86,
        "y": 0.0
      },
      "mobility": {
        "type": "on-points",
        "points": [
          "f2Llega1",
          "f2Llega2",
          "f2Llega3",
          "f2Reposo"
        ]
      },
      "appearance": {
        "size": 10,
        "labelVisible": false,
        "opacity": 0,
        "highlightSize": 5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "f3Llega1",
      "label": "f3Llega1",
      "color": "carbon",
      "layerId": "arrows",
      "order": 200,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.7194,
        "y": 0.7836
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "labelSize": 16,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "f3Llega2",
      "label": "f3Llega2",
      "color": "carbon",
      "layerId": "arrows",
      "order": 200,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 1.8633,
        "y": -0.0398
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "labelSize": 16,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "f3Llega3",
      "label": "f3Llega3",
      "color": "carbon",
      "layerId": "arrows",
      "order": 200,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.71,
        "y": -0.85
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "labelSize": 16,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "f3Reposo",
      "label": "f3Reposo",
      "color": "carbon",
      "layerId": "arrows",
      "order": 200,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2.2,
        "y": -0.85
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "labelSize": 16,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "f3Inicio",
      "label": "f3Inicio",
      "color": "carbon",
      "layerId": "arrows",
      "order": 201,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "a3.x + 0.24 * (hf3.x - a3.x) / max(hypot((hf3.x - a3.x), (hf3.y - a3.y)), 0.001)",
        "y": "a3.y + 0.24 * (hf3.y - a3.y) / max(hypot((hf3.x - a3.x), (hf3.y - a3.y)), 0.001)",
        "fallback": [
          -2.71,
          -0.85
        ]
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
      "id": "flechaf3",
      "label": "$f(a_3)$",
      "color": "terracota",
      "layerId": "arrows",
      "order": 300,
      "visible": true,
      "visibleWhen": "gt(hf3.x, 0)",
      "locked": false,
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
          "f3Inicio",
          "hf3"
        ]
      },
      "appearance": {
        "arrow": "end",
        "strokeWidth": 2.2,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "reposof3",
      "label": "Sin imagen: $a_3$",
      "color": "terracota",
      "layerId": "arrows",
      "order": 320,
      "visible": true,
      "visibleWhen": "lt(hf3.x, 0)",
      "locked": false,
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
          "f3Inicio",
          "hf3"
        ]
      },
      "appearance": {
        "dashed": true,
        "arrow": "end",
        "strokeWidth": 1.8,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "hf3",
      "label": "hf3",
      "color": "terracota",
      "layerId": "handles",
      "order": 400,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "primary",
        "ariaLabel": "Punta de la flecha de a₃: elige su imagen en N o devuélvela junto a a₃"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.71,
        "y": -0.85
      },
      "mobility": {
        "type": "on-points",
        "points": [
          "f3Llega1",
          "f3Llega2",
          "f3Llega3",
          "f3Reposo"
        ]
      },
      "appearance": {
        "size": 10,
        "labelVisible": false,
        "opacity": 0,
        "highlightSize": 5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "imagenes12",
      "label": "imagenes12",
      "color": "carbon",
      "layerId": "arrows",
      "order": 40,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "gt(hf1.x, 0) * (1 * lt(hypot(hf1.x - b1.x, hf1.y - b1.y), 0.3) + 2 * lt(hypot(hf1.x - b2.x, hf1.y - b2.y), 0.3) + 3 * lt(hypot(hf1.x - b3.x, hf1.y - b3.y), 0.3))",
        "y": "gt(hf2.x, 0) * (1 * lt(hypot(hf2.x - b1.x, hf2.y - b1.y), 0.3) + 2 * lt(hypot(hf2.x - b2.x, hf2.y - b2.y), 0.3) + 3 * lt(hypot(hf2.x - b3.x, hf2.y - b3.y), 0.3))",
        "fallback": [
          0,
          0
        ]
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
      "id": "imagenes3",
      "label": "imagenes3",
      "color": "carbon",
      "layerId": "arrows",
      "order": 40,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "gt(hf3.x, 0) * (1 * lt(hypot(hf3.x - b1.x, hf3.y - b1.y), 0.3) + 2 * lt(hypot(hf3.x - b2.x, hf3.y - b2.y), 0.3) + 3 * lt(hypot(hf3.x - b3.x, hf3.y - b3.y), 0.3))",
        "y": "0",
        "fallback": [
          0,
          0
        ]
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
      "id": "estado",
      "label": "estado",
      "color": "carbon",
      "layerId": "arrows",
      "order": 41,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "and(and(gt(imagenes12.x, 0), gt(imagenes12.y, 0), gt(imagenes3.x, 0)), not(eq(imagenes12.x, imagenes12.y)), not(eq(imagenes12.x, imagenes3.x)), not(eq(imagenes12.y, imagenes3.x)))",
        "y": "and(gt(imagenes12.x, 0), gt(imagenes12.y, 0), gt(imagenes3.x, 0))",
        "fallback": [
          0,
          0
        ]
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
      "id": "conservaM",
      "label": "conservaM",
      "color": "carbon",
      "layerId": "arrows",
      "order": 42,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "or(and(eq(imagenes12.x, 2), eq(imagenes12.y, 1)), and(eq(imagenes12.x, 1), eq(imagenes12.y, 3)))",
        "y": "or(gt(quitarRM2, 0.5), or(and(eq(imagenes12.y, 2), eq(imagenes3.x, 1)), and(eq(imagenes12.y, 1), eq(imagenes3.x, 3))))",
        "fallback": [
          0,
          0
        ]
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
      "id": "reflejaN",
      "label": "reflejaN",
      "color": "carbon",
      "layerId": "arrows",
      "order": 42,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "or(and(eq(imagenes12.x, 2), eq(imagenes12.y, 1)), and(not(gt(quitarRM2, 0.5)), eq(imagenes12.y, 2), eq(imagenes3.x, 1)))",
        "y": "or(and(eq(imagenes12.x, 1), eq(imagenes12.y, 3)), and(not(gt(quitarRM2, 0.5)), eq(imagenes12.y, 1), eq(imagenes3.x, 3)))",
        "fallback": [
          0,
          0
        ]
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
      "id": "avisoA1Radio",
      "label": "avisoA1Radio",
      "color": "carbon",
      "layerId": "elements",
      "order": 600,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2.69,
        "y": 0.85
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "labelSize": 16,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "avisoA1",
      "label": "Aviso en a1",
      "color": "granada",
      "layerId": "elements",
      "order": 601,
      "visible": true,
      "visibleWhen": "lt(hf1.x, 0)",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "circle",
        "center": "a1",
        "point": "avisoA1Radio"
      },
      "appearance": {
        "strokeWidth": 2,
        "strokeOpacity": 0.75,
        "fillOpacity": 0,
        "dashed": true,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "avisoA2Radio",
      "label": "avisoA2Radio",
      "color": "carbon",
      "layerId": "elements",
      "order": 600,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -1.84,
        "y": 0.0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "labelSize": 16,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "avisoA2",
      "label": "Aviso en a2",
      "color": "granada",
      "layerId": "elements",
      "order": 601,
      "visible": true,
      "visibleWhen": "lt(hf2.x, 0)",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "circle",
        "center": "a2",
        "point": "avisoA2Radio"
      },
      "appearance": {
        "strokeWidth": 2,
        "strokeOpacity": 0.75,
        "fillOpacity": 0,
        "dashed": true,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "avisoA3Radio",
      "label": "avisoA3Radio",
      "color": "carbon",
      "layerId": "elements",
      "order": 600,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2.69,
        "y": -0.85
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "labelSize": 16,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "avisoA3",
      "label": "Aviso en a3",
      "color": "granada",
      "layerId": "elements",
      "order": 601,
      "visible": true,
      "visibleWhen": "lt(hf3.x, 0)",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "circle",
        "center": "a3",
        "point": "avisoA3Radio"
      },
      "appearance": {
        "strokeWidth": 2,
        "strokeOpacity": 0.75,
        "fillOpacity": 0,
        "dashed": true,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "avisoB1Radio",
      "label": "avisoB1Radio",
      "color": "carbon",
      "layerId": "elements",
      "order": 610,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 3.21,
        "y": 0.85
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "labelSize": 16,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "avisoB1",
      "label": "Aviso en b1",
      "color": "granada",
      "layerId": "elements",
      "order": 611,
      "visible": true,
      "visibleWhen": "gte(eq(imagenes12.x, 1) + eq(imagenes12.y, 1) + eq(imagenes3.x, 1), 2)",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "circle",
        "center": "b1",
        "point": "avisoB1Radio"
      },
      "appearance": {
        "strokeWidth": 2,
        "strokeOpacity": 0.75,
        "fillOpacity": 0,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "avisoB2Radio",
      "label": "avisoB2Radio",
      "color": "carbon",
      "layerId": "elements",
      "order": 610,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.36,
        "y": 0.0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "labelSize": 16,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "avisoB2",
      "label": "Aviso en b2",
      "color": "granada",
      "layerId": "elements",
      "order": 611,
      "visible": true,
      "visibleWhen": "gte(eq(imagenes12.x, 2) + eq(imagenes12.y, 2) + eq(imagenes3.x, 2), 2)",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "circle",
        "center": "b2",
        "point": "avisoB2Radio"
      },
      "appearance": {
        "strokeWidth": 2,
        "strokeOpacity": 0.75,
        "fillOpacity": 0,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "avisoB3Radio",
      "label": "avisoB3Radio",
      "color": "carbon",
      "layerId": "elements",
      "order": 610,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 3.21,
        "y": -0.85
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "labelSize": 16,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "avisoB3",
      "label": "Aviso en b3",
      "color": "granada",
      "layerId": "elements",
      "order": 611,
      "visible": true,
      "visibleWhen": "gte(eq(imagenes12.x, 3) + eq(imagenes12.y, 3) + eq(imagenes3.x, 3), 2)",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "circle",
        "center": "b3",
        "point": "avisoB3Radio"
      },
      "appearance": {
        "strokeWidth": 2,
        "strokeOpacity": 0.75,
        "fillOpacity": 0,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "quitarRM2",
      "label": "Quitar $(a_2, a_3)$ de $R^{\\mathcal{M}}$",
      "color": "mora",
      "layerId": "annotations",
      "order": 500,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "primary",
        "ariaLabel": "Quitar el par (a₂, a₃) de R en 𝓜, o devolverlo"
      },
      "target": false,
      "objectType": "control",
      "variant": "button",
      "position": [
        -4.85,
        -2.2
      ],
      "range": {
        "min": 0,
        "max": 1,
        "step": 0.01
      },
      "value": 0,
      "action": {
        "to": 1,
        "durationMs": 600,
        "easing": "ease-in-out",
        "behavior": "toggle"
      }
    },
    {
      "id": "estadoSinImagen",
      "label": "Estado: algún elemento sin imagen",
      "color": "carbon",
      "layerId": "annotations",
      "order": 700,
      "visible": true,
      "visibleWhen": "not(gt(estado.y, 0.5))",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Estado: algún elemento sin imagen",
        "role": "annotation"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "",
        "blocks": [
          {
            "id": "estado",
            "text": "Falta la imagen de algún $a_i$.",
            "color": "granada"
          }
        ]
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.5,
          0
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "estadoNoBiyeccion",
      "label": "Estado: no es biyección",
      "color": "carbon",
      "layerId": "annotations",
      "order": 701,
      "visible": true,
      "visibleWhen": "and(gt(estado.y, 0.5), not(gt(estado.x, 0.5)))",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Estado: no es biyección",
        "role": "annotation"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "",
        "blocks": [
          {
            "id": "estado",
            "text": "No es biyección: dos flechas a un $b_j$.",
            "color": "granada"
          }
        ]
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.5,
          0
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "estadoNoConserva",
      "label": "Estado: biyección que no conserva R",
      "color": "carbon",
      "layerId": "annotations",
      "order": 702,
      "visible": true,
      "visibleWhen": "and(gt(estado.x, 0.5), not(and(gt(conservaM.x, 0.5), gt(conservaM.y, 0.5))))",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Estado: biyección que no conserva R",
        "role": "annotation"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "",
        "blocks": [
          {
            "id": "estado",
            "text": "Biyección, pero no conserva $R$.",
            "color": "granada"
          }
        ]
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.5,
          0
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "estadoIsomorfismo",
      "label": "Estado: isomorfismo",
      "color": "carbon",
      "layerId": "annotations",
      "order": 703,
      "visible": true,
      "visibleWhen": "and(gt(estado.x, 0.5), and(gt(conservaM.x, 0.5), gt(conservaM.y, 0.5), gt(reflejaN.x, 0.5), gt(reflejaN.y, 0.5)))",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Estado: isomorfismo",
        "role": "annotation"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "",
        "blocks": [
          {
            "id": "estado",
            "text": "Isomorfismo: $R$ se conserva.",
            "color": "musgo"
          }
        ]
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.5,
          0
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "estadoSoloIda",
      "label": "Estado: se cumple ⇒ pero no ⇐",
      "color": "carbon",
      "layerId": "annotations",
      "order": 704,
      "visible": true,
      "visibleWhen": "and(gt(estado.x, 0.5), gt(conservaM.x, 0.5), gt(conservaM.y, 0.5), not(and(gt(reflejaN.x, 0.5), gt(reflejaN.y, 0.5))))",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Estado: se cumple ⇒ pero no ⇐",
        "role": "annotation"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "",
        "blocks": [
          {
            "id": "estado",
            "text": "Cumple $\\Rightarrow$, no $\\Leftarrow$: no es isomorfismo.",
            "color": "granada"
          }
        ]
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.5,
          0
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [],
  "steps": [],
  "note": "Arrastra las puntas de f hasta conservar R.",
  "translations": {
    "eu": {
      "title": "Isomorfismoa: erlazioa kontserbatzen duen bijekzioa",
      "note": "Arrastatu f-ren puntak R kontserbatu arte.",
      "labels": {
        "reposof1": "Irudirik gabe: $a_1$",
        "reposof2": "Irudirik gabe: $a_2$",
        "reposof3": "Irudirik gabe: $a_3$",
        "quitarRM2": "Kendu $(a_2, a_3)$ $R^{\\mathcal{M}}$-tik"
      },
      "ariaLabels": {
        "conjuntoM": "𝓜 egituraren M domeinua",
        "conjuntoN": "𝓝 egituraren N domeinua",
        "a1": "M-ko a₁ elementua",
        "hf1": "a₁-ren geziaren punta: aukeratu bere irudia N-n edo itzuli a₁-ren ondora",
        "a2": "M-ko a₂ elementua",
        "hf2": "a₂-ren geziaren punta: aukeratu bere irudia N-n edo itzuli a₂-ren ondora",
        "a3": "M-ko a₃ elementua",
        "hf3": "a₃-ren geziaren punta: aukeratu bere irudia N-n edo itzuli a₃-ren ondora",
        "b1": "N-ko b₁ elementua",
        "b2": "N-ko b₂ elementua",
        "b3": "N-ko b₃ elementua",
        "grupoEstructuraM": "Nabarmendu 𝓜 egitura",
        "grupoEstructuraN": "Nabarmendu 𝓝 egitura",
        "grupoRelacionM": "Nabarmendu R 𝓜-n",
        "grupoRelacionN": "Nabarmendu R 𝓝-n",
        "grupoFlechas": "Nabarmendu f-ren geziak",
        "estadoSinImagen": "Egoera: elementuren bat irudirik gabe",
        "estadoNoBiyeccion": "Egoera: ez da bijekzioa",
        "estadoNoConserva": "Egoera: R kontserbatzen ez duen bijekzioa",
        "estadoIsomorfismo": "Egoera: isomorfismoa",
        "quitarRM2": "Kendu (a₂, a₃) bikotea 𝓜-ko R-tik, edo itzuli",
        "estadoSoloIda": "Egoera: ⇒ betetzen da, baina ⇐ ez"
      },
      "blocks": {
        "estadoSinImagen": {
          "estado": {
            "text": "$a_i$ batek ez du irudirik."
          }
        },
        "estadoNoBiyeccion": {
          "estado": {
            "text": "Ez da bijekzioa: bi gezi $b_j$ berean."
          }
        },
        "estadoNoConserva": {
          "estado": {
            "text": "Bijekzioa, baina ez du $R$ kontserbatzen."
          }
        },
        "estadoIsomorfismo": {
          "estado": {
            "text": "Isomorfismoa: $R$ kontserbatzen da."
          }
        },
        "estadoSoloIda": {
          "estado": {
            "text": "$\\Rightarrow$ bai, baina $\\Leftarrow$ ez: ez da isomorfismoa."
          }
        }
      }
    },
    "en": {
      "title": "Isomorphism: a bijection that preserves a relation",
      "note": "Drag the tips of f until R is preserved.",
      "labels": {
        "reposof1": "No image: $a_1$",
        "reposof2": "No image: $a_2$",
        "reposof3": "No image: $a_3$",
        "quitarRM2": "Remove $(a_2, a_3)$ from $R^{\\mathcal{M}}$"
      },
      "ariaLabels": {
        "conjuntoM": "Domain M of the structure 𝓜",
        "conjuntoN": "Domain N of the structure 𝓝",
        "a1": "Element a₁ of M",
        "hf1": "Tip of the arrow from a₁: choose its image in N or bring it back next to a₁",
        "a2": "Element a₂ of M",
        "hf2": "Tip of the arrow from a₂: choose its image in N or bring it back next to a₂",
        "a3": "Element a₃ of M",
        "hf3": "Tip of the arrow from a₃: choose its image in N or bring it back next to a₃",
        "b1": "Element b₁ of N",
        "b2": "Element b₂ of N",
        "b3": "Element b₃ of N",
        "grupoEstructuraM": "Highlight the structure 𝓜",
        "grupoEstructuraN": "Highlight the structure 𝓝",
        "grupoRelacionM": "Highlight R in 𝓜",
        "grupoRelacionN": "Highlight R in 𝓝",
        "grupoFlechas": "Highlight the arrows of f",
        "estadoSinImagen": "Status: some element has no image",
        "estadoNoBiyeccion": "Status: not a bijection",
        "estadoNoConserva": "Status: bijection that does not preserve R",
        "estadoIsomorfismo": "Status: isomorphism",
        "quitarRM2": "Remove the pair (a₂, a₃) from R in 𝓜, or put it back",
        "estadoSoloIda": "Status: ⇒ holds but ⇐ fails"
      },
      "blocks": {
        "estadoSinImagen": {
          "estado": {
            "text": "Some $a_i$ has no image."
          }
        },
        "estadoNoBiyeccion": {
          "estado": {
            "text": "Not a bijection: two arrows hit a $b_j$."
          }
        },
        "estadoNoConserva": {
          "estado": {
            "text": "A bijection, but $R$ is not preserved."
          }
        },
        "estadoIsomorfismo": {
          "estado": {
            "text": "Isomorphism: $R$ is preserved."
          }
        },
        "estadoSoloIda": {
          "estado": {
            "text": "$\\Rightarrow$ holds, $\\Leftarrow$ fails: not an isomorphism."
          }
        }
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const IsomorfismoRelacion = () => <DiagramRenderer spec={IsomorfismoRelacionSpec} />;
