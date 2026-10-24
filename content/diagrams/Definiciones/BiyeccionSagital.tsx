import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const BiyeccionSagitalSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Biyección: flechas entre dos conjuntos",
  "componentId": "biyeccion-sagital",
  "category": "Definiciones",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "showLabels": true,
  "viewport": {
    "bounds": [
      -5,
      2.15,
      5,
      -3.3
    ],
    "home": [
      -5,
      2.15,
      5,
      -3.3
    ],
    "minZoom": 0.6,
    "maxZoom": 3,
    "padding": 0.06
  },
  "layers": [
    {
      "id": "sets",
      "label": "Conjuntos",
      "order": 0,
      "visible": true,
      "locked": false
    },
    {
      "id": "arrows",
      "label": "Flechas",
      "order": 1,
      "visible": true,
      "locked": false
    },
    {
      "id": "elements",
      "label": "Elementos",
      "order": 2,
      "visible": true,
      "locked": false
    },
    {
      "id": "handles",
      "label": "Puntas arrastrables",
      "order": 3,
      "visible": true,
      "locked": false
    },
    {
      "id": "annotations",
      "label": "Estado y controles",
      "order": 4,
      "visible": true,
      "locked": false
    }
  ],
  "groups": [
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
        "dimOthersOnHighlight": false,
        "ariaLabel": "Resaltar las flechas de f",
        "role": "secondary"
      },
      "target": true,
      "targetId": "flechas",
      "color": "terracota"
    },
    {
      "id": "grupoInversa",
      "label": "Flechas invertidas",
      "memberIds": [
        "inversaf1",
        "inversaf2",
        "inversaf3"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "dimOthersOnHighlight": false,
        "ariaLabel": "Resaltar las flechas invertidas",
        "role": "secondary"
      },
      "target": true,
      "targetId": "flechas-inversas",
      "color": "mora"
    }
  ],
  "objects": [
    {
      "id": "centroA",
      "label": "centroA",
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
        "y": 0
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
      "id": "centroB",
      "label": "centroB",
      "color": "carbon",
      "layerId": "sets",
      "order": 2,
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
        "y": 0
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
      "id": "conjuntoARadio",
      "label": "conjuntoARadio",
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
        "x": -1.25,
        "y": 0
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
      "id": "conjuntoA",
      "label": "$A$",
      "color": "carbon",
      "layerId": "sets",
      "order": 4,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Conjunto A, dominio",
        "role": "secondary"
      },
      "target": true,
      "objectType": "path",
      "geometry": {
        "type": "circle",
        "center": "centroA",
        "point": "conjuntoARadio"
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
      "id": "conjuntoBRadio",
      "label": "conjuntoBRadio",
      "color": "carbon",
      "layerId": "sets",
      "order": 5,
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
        "x": 3.95,
        "y": 0
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
      "id": "conjuntoB",
      "label": "$B$",
      "color": "carbon",
      "layerId": "sets",
      "order": 6,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Conjunto B, codominio",
        "role": "secondary"
      },
      "target": true,
      "objectType": "path",
      "geometry": {
        "type": "circle",
        "center": "centroB",
        "point": "conjuntoBRadio"
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
      "id": "nombreA",
      "label": "$A$",
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
        "x": -3.572,
        "y": 0.972
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
      "id": "nombreB",
      "label": "$B$",
      "color": "carbon",
      "layerId": "sets",
      "order": 8,
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
        "x": 1.628,
        "y": 0.972
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
      "id": "a1",
      "label": "$a_1$",
      "color": "carbon",
      "layerId": "elements",
      "order": 100,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Elemento a₁ de A",
        "role": "secondary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2.6,
        "y": 0.8
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
      "order": 101,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Elemento a₂ de A",
        "role": "secondary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2.6,
        "y": 0
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
      "order": 102,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Elemento a₃ de A",
        "role": "secondary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2.6,
        "y": -0.8
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
      "order": 110,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Elemento b₁ de B",
        "role": "secondary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.6,
        "y": 0.8
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
      "order": 111,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Elemento b₂ de B",
        "role": "secondary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.6,
        "y": 0
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
      "order": 112,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Elemento b₃ de B",
        "role": "secondary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.6,
        "y": -0.8
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
        "x": 2.36,
        "y": 0.8
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
        "x": 2.3628,
        "y": 0.0365
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
        "x": 2.3706,
        "y": -0.7294
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
        "x": -1.85,
        "y": 0.8
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
          -2.3628,
          0.7635
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
      "label": "Flecha de $a_1$",
      "color": "terracota",
      "layerId": "arrows",
      "order": 300,
      "visible": true,
      "visibleWhen": "and(gt(hf1.x, 0), not(gte(invertir, 0.5)))",
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
      "id": "inversaf1",
      "label": "Flecha invertida: Flecha de $a_1$",
      "color": "mora",
      "layerId": "arrows",
      "order": 310,
      "visible": true,
      "visibleWhen": "and(gt(hf1.x, 0), gte(invertir, 0.5))",
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
        "arrow": "start",
        "strokeWidth": 2.2,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "reposof1",
      "label": "Sin imagen: Flecha de $a_1$",
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
        "ariaLabel": "Punta de la flecha de a₁: elige su imagen en B o devuélvela junto a a₁",
        "role": "primary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.3628,
        "y": 0.0365
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
      "order": 210,
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
        "x": 2.3628,
        "y": 0.7635
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
      "order": 210,
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
        "y": 0
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
      "order": 210,
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
        "x": 2.3628,
        "y": -0.7635
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
      "order": 210,
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
        "x": -1.85,
        "y": 0
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
      "order": 211,
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
          -2.36,
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
      "id": "flechaf2",
      "label": "Flecha de $a_2$",
      "color": "terracota",
      "layerId": "arrows",
      "order": 310,
      "visible": true,
      "visibleWhen": "and(gt(hf2.x, 0), not(gte(invertir, 0.5)))",
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
      "id": "inversaf2",
      "label": "Flecha invertida: Flecha de $a_2$",
      "color": "mora",
      "layerId": "arrows",
      "order": 320,
      "visible": true,
      "visibleWhen": "and(gt(hf2.x, 0), gte(invertir, 0.5))",
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
        "arrow": "start",
        "strokeWidth": 2.2,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "reposof2",
      "label": "Sin imagen: Flecha de $a_2$",
      "color": "terracota",
      "layerId": "arrows",
      "order": 330,
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
      "order": 410,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punta de la flecha de a₂: elige su imagen en B o devuélvela junto a a₂",
        "role": "primary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.36,
        "y": 0
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
      "order": 220,
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
        "x": 2.3706,
        "y": 0.7294
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
      "order": 220,
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
        "x": 2.3628,
        "y": -0.0365
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
      "order": 220,
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
        "y": -0.8
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
      "order": 220,
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
        "x": -1.85,
        "y": -0.8
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
      "order": 221,
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
          -2.36,
          -0.8
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
      "label": "Flecha de $a_3$",
      "color": "terracota",
      "layerId": "arrows",
      "order": 320,
      "visible": true,
      "visibleWhen": "and(gt(hf3.x, 0), not(gte(invertir, 0.5)))",
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
      "id": "inversaf3",
      "label": "Flecha invertida: Flecha de $a_3$",
      "color": "mora",
      "layerId": "arrows",
      "order": 330,
      "visible": true,
      "visibleWhen": "and(gt(hf3.x, 0), gte(invertir, 0.5))",
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
        "arrow": "start",
        "strokeWidth": 2.2,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "reposof3",
      "label": "Sin imagen: Flecha de $a_3$",
      "color": "terracota",
      "layerId": "arrows",
      "order": 340,
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
      "order": 420,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punta de la flecha de a₃: elige su imagen en B o devuélvela junto a a₃",
        "role": "primary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.36,
        "y": -0.8
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
      "id": "invertir",
      "label": "Invertir las flechas",
      "color": "mora",
      "layerId": "annotations",
      "order": 500,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Invertir el sentido de todas las flechas",
        "role": "primary"
      },
      "target": false,
      "objectType": "control",
      "variant": "button",
      "position": [
        -4.85,
        -2.6
      ],
      "range": {
        "min": 0,
        "max": 1,
        "step": 0.01
      },
      "value": 0,
      "action": {
        "to": 1,
        "durationMs": 0,
        "easing": "ease-in-out",
        "behavior": "toggle"
      }
    },
    {
      "id": "llegadas12",
      "label": "llegadas12",
      "color": "carbon",
      "layerId": "arrows",
      "order": 50,
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
        "x": "and(gt(hf1.x, 0), approx(hf1.y, 0.8, 0.01)) + and(gt(hf2.x, 0), approx(hf2.y, 0.7635, 0.01)) + and(gt(hf3.x, 0), approx(hf3.y, 0.7294, 0.01))",
        "y": "and(gt(hf1.x, 0), approx(hf1.y, 0.0365, 0.01)) + and(gt(hf2.x, 0), approx(hf2.y, 0.0, 0.01)) + and(gt(hf3.x, 0), approx(hf3.y, -0.0365, 0.01))",
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
      "id": "llegadas3",
      "label": "llegadas3",
      "color": "carbon",
      "layerId": "arrows",
      "order": 50,
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
        "x": "and(gt(hf1.x, 0), approx(hf1.y, -0.7294, 0.01)) + and(gt(hf2.x, 0), approx(hf2.y, -0.7635, 0.01)) + and(gt(hf3.x, 0), approx(hf3.y, -0.8, 0.01))",
        "y": "and(gt(hf1.x, 0), gt(hf2.x, 0), gt(hf3.x, 0))",
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
        "x": -2.34,
        "y": 0.8
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
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "avisoA2Radio",
      "label": "avisoA2Radio",
      "color": "carbon",
      "layerId": "elements",
      "order": 602,
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
        "x": -2.34,
        "y": 0
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
      "order": 603,
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
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "avisoA3Radio",
      "label": "avisoA3Radio",
      "color": "carbon",
      "layerId": "elements",
      "order": 604,
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
        "x": -2.34,
        "y": -0.8
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
      "order": 605,
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
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "avisoDoble1Radio",
      "label": "avisoDoble1Radio",
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
        "x": 2.86,
        "y": 0.8
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
      "id": "avisoDoble1",
      "label": "Aviso en b1",
      "color": "granada",
      "layerId": "elements",
      "order": 611,
      "visible": true,
      "visibleWhen": "gte(llegadas12.x, 2)",
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
        "point": "avisoDoble1Radio"
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
      "id": "avisoVacio1Radio",
      "label": "avisoVacio1Radio",
      "color": "carbon",
      "layerId": "elements",
      "order": 620,
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
        "x": 2.86,
        "y": 0.8
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
      "id": "avisoVacio1",
      "label": "Aviso en b1",
      "color": "granada",
      "layerId": "elements",
      "order": 621,
      "visible": true,
      "visibleWhen": "lt(llegadas12.x, 1)",
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
        "point": "avisoVacio1Radio"
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2,
        "strokeOpacity": 0.75,
        "fillOpacity": 0,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "avisoDoble2Radio",
      "label": "avisoDoble2Radio",
      "color": "carbon",
      "layerId": "elements",
      "order": 612,
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
        "x": 2.86,
        "y": 0
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
      "id": "avisoDoble2",
      "label": "Aviso en b2",
      "color": "granada",
      "layerId": "elements",
      "order": 613,
      "visible": true,
      "visibleWhen": "gte(llegadas12.y, 2)",
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
        "point": "avisoDoble2Radio"
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
      "id": "avisoVacio2Radio",
      "label": "avisoVacio2Radio",
      "color": "carbon",
      "layerId": "elements",
      "order": 622,
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
        "x": 2.86,
        "y": 0
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
      "id": "avisoVacio2",
      "label": "Aviso en b2",
      "color": "granada",
      "layerId": "elements",
      "order": 623,
      "visible": true,
      "visibleWhen": "lt(llegadas12.y, 1)",
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
        "point": "avisoVacio2Radio"
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2,
        "strokeOpacity": 0.75,
        "fillOpacity": 0,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "avisoDoble3Radio",
      "label": "avisoDoble3Radio",
      "color": "carbon",
      "layerId": "elements",
      "order": 614,
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
        "x": 2.86,
        "y": -0.8
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
      "id": "avisoDoble3",
      "label": "Aviso en b3",
      "color": "granada",
      "layerId": "elements",
      "order": 615,
      "visible": true,
      "visibleWhen": "gte(llegadas3.x, 2)",
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
        "point": "avisoDoble3Radio"
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
      "id": "avisoVacio3Radio",
      "label": "avisoVacio3Radio",
      "color": "carbon",
      "layerId": "elements",
      "order": 624,
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
        "x": 2.86,
        "y": -0.8
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
      "id": "avisoVacio3",
      "label": "Aviso en b3",
      "color": "granada",
      "layerId": "elements",
      "order": 625,
      "visible": true,
      "visibleWhen": "lt(llegadas3.x, 1)",
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
        "point": "avisoVacio3Radio"
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2,
        "strokeOpacity": 0.75,
        "fillOpacity": 0,
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "estadoNoFuncion",
      "label": "Estado: no es función",
      "color": "carbon",
      "layerId": "annotations",
      "order": 700,
      "visible": true,
      "visibleWhen": "not(gt(llegadas3.y, 0.5))",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Estado: no es función",
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
            "text": "No es función: un $a_i$ sin imagen.",
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
      "id": "estadoBiyeccion",
      "label": "Estado: biyección",
      "color": "carbon",
      "layerId": "annotations",
      "order": 701,
      "visible": true,
      "visibleWhen": "and(not(gte(invertir, 0.5)), and(gt(llegadas3.y, 0.5), and(lte(llegadas12.x, 1), lte(llegadas12.y, 1), lte(llegadas3.x, 1)), and(gte(llegadas12.x, 1), gte(llegadas12.y, 1), gte(llegadas3.x, 1))))",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Estado: biyección",
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
            "text": "Biyección: una sola flecha en cada $b$.",
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
      "id": "estadoNinguna",
      "label": "Estado: ni inyectiva ni sobreyectiva",
      "color": "carbon",
      "layerId": "annotations",
      "order": 702,
      "visible": true,
      "visibleWhen": "and(not(gte(invertir, 0.5)), gt(llegadas3.y, 0.5), not(and(lte(llegadas12.x, 1), lte(llegadas12.y, 1), lte(llegadas3.x, 1))), not(and(gte(llegadas12.x, 1), gte(llegadas12.y, 1), gte(llegadas3.x, 1))))",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Estado: ni inyectiva ni sobreyectiva",
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
            "text": "Ni inyectiva ni sobreyectiva.",
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
      "id": "estadoNoInyectiva",
      "label": "Estado: no inyectiva",
      "color": "carbon",
      "layerId": "annotations",
      "order": 703,
      "visible": true,
      "visibleWhen": "and(not(gte(invertir, 0.5)), gt(llegadas3.y, 0.5), not(and(lte(llegadas12.x, 1), lte(llegadas12.y, 1), lte(llegadas3.x, 1))), and(gte(llegadas12.x, 1), gte(llegadas12.y, 1), gte(llegadas3.x, 1)))",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Estado: no inyectiva",
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
            "text": "No es inyectiva: dos flechas a un $b$.",
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
      "id": "estadoNoSobreyectiva",
      "label": "Estado: no sobreyectiva",
      "color": "carbon",
      "layerId": "annotations",
      "order": 704,
      "visible": true,
      "visibleWhen": "and(not(gte(invertir, 0.5)), gt(llegadas3.y, 0.5), and(lte(llegadas12.x, 1), lte(llegadas12.y, 1), lte(llegadas3.x, 1)), not(and(gte(llegadas12.x, 1), gte(llegadas12.y, 1), gte(llegadas3.x, 1))))",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Estado: no sobreyectiva",
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
            "text": "No es sobreyectiva: un $b$ sin flecha.",
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
      "id": "estadoInversa",
      "label": "Estado: inversa",
      "color": "carbon",
      "layerId": "annotations",
      "order": 705,
      "visible": true,
      "visibleWhen": "and(gte(invertir, 0.5), and(gt(llegadas3.y, 0.5), and(lte(llegadas12.x, 1), lte(llegadas12.y, 1), lte(llegadas3.x, 1)), and(gte(llegadas12.x, 1), gte(llegadas12.y, 1), gte(llegadas3.x, 1))))",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Estado: inversa",
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
            "text": "Invertidas: $f^{-1}\\colon B \\to A$.",
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
      "id": "estadoSinInversa",
      "label": "Estado: sin inversa",
      "color": "carbon",
      "layerId": "annotations",
      "order": 706,
      "visible": true,
      "visibleWhen": "and(gte(invertir, 0.5), gt(llegadas3.y, 0.5), not(and(gt(llegadas3.y, 0.5), and(lte(llegadas12.x, 1), lte(llegadas12.y, 1), lte(llegadas3.x, 1)), and(gte(llegadas12.x, 1), gte(llegadas12.y, 1), gte(llegadas3.x, 1)))))",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Estado: sin inversa",
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
            "text": "Invertidas, no son función de $B$ en $A$.",
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
  "note": "Arrastra cada punta de flecha a B, o de vuelta a A.",
  "translations": {
    "eu": {
      "title": "Bijekzioa: geziak bi multzoren artean",
      "note": "Arrastatu gezi-punta bakoitza B-ra, edo itzuli A-ra.",
      "labels": {
        "conjuntoA": "$A$",
        "conjuntoB": "$B$",
        "invertir": "Alderantzikatu geziak",
        "flechaf1": "$a_1$-en gezia",
        "flechaf2": "$a_2$-ren gezia",
        "flechaf3": "$a_3$-ren gezia",
        "inversaf1": "$a_1$-erako gezi alderantzikatua",
        "inversaf2": "$a_2$-rako gezi alderantzikatua",
        "inversaf3": "$a_3$-rako gezi alderantzikatua"
      },
      "ariaLabels": {
        "conjuntoA": "A multzoa, domeinua",
        "conjuntoB": "B multzoa, kodomeinua",
        "a1": "A-ko a₁ elementua",
        "a2": "A-ko a₂ elementua",
        "a3": "A-ko a₃ elementua",
        "b1": "B-ko b₁ elementua",
        "b2": "B-ko b₂ elementua",
        "b3": "B-ko b₃ elementua",
        "hf1": "a₁-en geziaren punta: aukeratu bere irudia B-n edo itzuli a₁-en ondora",
        "hf2": "a₂-ren geziaren punta: aukeratu bere irudia B-n edo itzuli a₂-ren ondora",
        "hf3": "a₃-ren geziaren punta: aukeratu bere irudia B-n edo itzuli a₃-ren ondora",
        "invertir": "Alderantzikatu gezi guztien noranzkoa",
        "grupoFlechas": "Nabarmendu f-ren geziak",
        "grupoInversa": "Nabarmendu gezi alderantzikatuak"
      },
      "blocks": {
        "estadoNoFuncion": {
          "estado": {
            "text": "Ez da funtzioa: $a_i$ bat irudirik gabe."
          }
        },
        "estadoBiyeccion": {
          "estado": {
            "text": "Bijekzioa: gezi bakarra $b$ bakoitzean."
          }
        },
        "estadoNinguna": {
          "estado": {
            "text": "Ez da injektiboa, ezta sobrejektiboa ere."
          }
        },
        "estadoNoInyectiva": {
          "estado": {
            "text": "Ez da injektiboa: bi gezi $b$ berean."
          }
        },
        "estadoNoSobreyectiva": {
          "estado": {
            "text": "Ez da sobrejektiboa: $b$ bat geziarik gabe."
          }
        },
        "estadoInversa": {
          "estado": {
            "text": "Alderantzikatuta: $f^{-1}\\colon B \\to A$."
          }
        },
        "estadoSinInversa": {
          "estado": {
            "text": "Alderantzikatuta ez da funtzioa."
          }
        }
      }
    },
    "en": {
      "title": "Bijection: arrows between two sets",
      "note": "Drag each arrowhead into B, or back into A.",
      "labels": {
        "conjuntoA": "$A$",
        "conjuntoB": "$B$",
        "invertir": "Reverse the arrows",
        "flechaf1": "Arrow from $a_1$",
        "flechaf2": "Arrow from $a_2$",
        "flechaf3": "Arrow from $a_3$",
        "inversaf1": "Reversed arrow to $a_1$",
        "inversaf2": "Reversed arrow to $a_2$",
        "inversaf3": "Reversed arrow to $a_3$"
      },
      "ariaLabels": {
        "conjuntoA": "Set A, the domain",
        "conjuntoB": "Set B, the codomain",
        "a1": "Element a₁ of A",
        "a2": "Element a₂ of A",
        "a3": "Element a₃ of A",
        "b1": "Element b₁ of B",
        "b2": "Element b₂ of B",
        "b3": "Element b₃ of B",
        "hf1": "Tip of the arrow from a₁: choose its image in B or bring it back next to a₁",
        "hf2": "Tip of the arrow from a₂: choose its image in B or bring it back next to a₂",
        "hf3": "Tip of the arrow from a₃: choose its image in B or bring it back next to a₃",
        "invertir": "Reverse the direction of every arrow",
        "grupoFlechas": "Highlight the arrows of f",
        "grupoInversa": "Highlight the reversed arrows"
      },
      "blocks": {
        "estadoNoFuncion": {
          "estado": {
            "text": "Not a function: an $a_i$ has no image."
          }
        },
        "estadoBiyeccion": {
          "estado": {
            "text": "A bijection: one arrow into each $b$."
          }
        },
        "estadoNinguna": {
          "estado": {
            "text": "Neither injective nor surjective."
          }
        },
        "estadoNoInyectiva": {
          "estado": {
            "text": "Not injective: two arrows into one $b$."
          }
        },
        "estadoNoSobreyectiva": {
          "estado": {
            "text": "Not surjective: a $b$ gets no arrow."
          }
        },
        "estadoInversa": {
          "estado": {
            "text": "Reversed: $f^{-1}\\colon B \\to A$."
          }
        },
        "estadoSinInversa": {
          "estado": {
            "text": "Reversed, not a function from $B$ to $A$."
          }
        }
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const BiyeccionSagital = () => <DiagramRenderer spec={BiyeccionSagitalSpec} />;
