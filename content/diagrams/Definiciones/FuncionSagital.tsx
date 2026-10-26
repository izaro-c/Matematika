import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const FuncionSagitalSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Función: flechas entre dos conjuntos",
  "componentId": "funcion-sagital",
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
      "label": "Flechas de la relación",
      "memberIds": [
        "flechaf1",
        "flechaf2",
        "flechaf3",
        "flechag1"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Resaltar las flechas: los pares de la relación",
        "role": "secondary"
      },
      "target": true,
      "targetId": "flechas",
      "color": "terracota"
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
        "role": "secondary",
        "ariaLabel": "Conjunto A, dominio"
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
        "preserveColorOnHighlight": true,
        "highlightFillOpacity": 0.14
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
        "x": 4.3,
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
        "role": "secondary",
        "ariaLabel": "Conjunto B, codominio"
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
        "preserveColorOnHighlight": true,
        "highlightFillOpacity": 0.14
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
        "labelSize": 16,
        "preserveColorOnHighlight": true,
        "labelPosition": "ulft"
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
        "x": 1.376,
        "y": 1.224
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": true,
        "labelSize": 16,
        "preserveColorOnHighlight": true,
        "labelPosition": "ulft"
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
        "role": "secondary",
        "ariaLabel": "Elemento a₁ de A"
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
        "labelSize": 16,
        "preserveColorOnHighlight": true,
        "labelPosition": "lft"
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
        "role": "secondary",
        "ariaLabel": "Elemento a₂ de A"
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
        "size": 5,
        "labelVisible": true,
        "labelSize": 16,
        "preserveColorOnHighlight": true,
        "labelPosition": "lft"
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
        "role": "secondary",
        "ariaLabel": "Elemento a₃ de A"
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
        "labelSize": 16,
        "preserveColorOnHighlight": true,
        "labelPosition": "lft"
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
        "role": "secondary",
        "ariaLabel": "Elemento b₁ de B"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.6,
        "y": 1.2
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 5,
        "labelVisible": true,
        "labelSize": 16,
        "preserveColorOnHighlight": true,
        "labelPosition": "rt"
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
        "role": "secondary",
        "ariaLabel": "Elemento b₂ de B"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.6,
        "y": 0.4
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 5,
        "labelVisible": true,
        "labelSize": 16,
        "preserveColorOnHighlight": true,
        "labelPosition": "rt"
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
        "role": "secondary",
        "ariaLabel": "Elemento b₃ de B"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.6,
        "y": -0.4
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 5,
        "labelVisible": true,
        "labelSize": 16,
        "preserveColorOnHighlight": true,
        "labelPosition": "rt"
      }
    },
    {
      "id": "b4",
      "label": "$b_4$",
      "color": "carbon",
      "layerId": "elements",
      "order": 113,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "secondary",
        "ariaLabel": "Elemento b₄ de B"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.6,
        "y": -1.2
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 5,
        "labelVisible": true,
        "labelSize": 16,
        "preserveColorOnHighlight": true,
        "labelPosition": "rt"
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
        "x": 2.3607,
        "y": 1.1816
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
        "x": 2.3607,
        "y": 0.4184
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
        "x": 2.3661,
        "y": -0.346
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
      "id": "f1Llega4",
      "label": "f1Llega4",
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
        "x": 2.376,
        "y": -1.1138
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
          -2.3607,
          0.8184
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
        "strokeWidth": 2.2,
        "arrow": "end",
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
        "strokeWidth": 1.8,
        "arrow": "end",
        "labelVisible": false,
        "preserveColorOnHighlight": true,
        "dashed": true
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
        "ariaLabel": "Punta de la flecha de a₁: elige su imagen en B o devuélvela junto a a₁"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.3607,
        "y": 1.1816
      },
      "mobility": {
        "type": "on-points",
        "points": [
          "f1Llega1",
          "f1Llega2",
          "f1Llega3",
          "f1Llega4",
          "f1Reposo"
        ]
      },
      "appearance": {
        "size": 10,
        "opacity": 0,
        "labelVisible": false,
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
        "x": 2.3661,
        "y": 1.146
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
        "x": 2.3607,
        "y": 0.3816
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
        "x": 2.3607,
        "y": -0.3816
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
      "id": "f2Llega4",
      "label": "f2Llega4",
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
        "x": 2.3661,
        "y": -1.146
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
          -2.3661,
          0.054
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
        "strokeWidth": 2.2,
        "arrow": "end",
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
        "strokeWidth": 1.8,
        "arrow": "end",
        "labelVisible": false,
        "preserveColorOnHighlight": true,
        "dashed": true
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
        "role": "primary",
        "ariaLabel": "Punta de la flecha de a₂: elige su imagen en B o devuélvela junto a a₂"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.3661,
        "y": 1.146
      },
      "mobility": {
        "type": "on-points",
        "points": [
          "f2Llega1",
          "f2Llega2",
          "f2Llega3",
          "f2Llega4",
          "f2Reposo"
        ]
      },
      "appearance": {
        "size": 10,
        "opacity": 0,
        "labelVisible": false,
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
        "x": 2.376,
        "y": 1.1138
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
        "x": 2.3661,
        "y": 0.346
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
        "x": 2.3607,
        "y": -0.4184
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
      "id": "f3Llega4",
      "label": "f3Llega4",
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
        "x": 2.3607,
        "y": -1.1816
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
          -2.3607,
          -0.7816
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
        "strokeWidth": 2.2,
        "arrow": "end",
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
        "strokeWidth": 1.8,
        "arrow": "end",
        "labelVisible": false,
        "preserveColorOnHighlight": true,
        "dashed": true
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
        "role": "primary",
        "ariaLabel": "Punta de la flecha de a₃: elige su imagen en B o devuélvela junto a a₃"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.3607,
        "y": -0.4184
      },
      "mobility": {
        "type": "on-points",
        "points": [
          "f3Llega1",
          "f3Llega2",
          "f3Llega3",
          "f3Llega4",
          "f3Reposo"
        ]
      },
      "appearance": {
        "size": 10,
        "opacity": 0,
        "labelVisible": false,
        "highlightSize": 5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "g1Llega1",
      "label": "g1Llega1",
      "color": "carbon",
      "layerId": "arrows",
      "order": 240,
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
        "x": 2.3607,
        "y": 1.1816
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
      "id": "g1Llega2",
      "label": "g1Llega2",
      "color": "carbon",
      "layerId": "arrows",
      "order": 240,
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
        "x": 2.3607,
        "y": 0.4184
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
      "id": "g1Llega3",
      "label": "g1Llega3",
      "color": "carbon",
      "layerId": "arrows",
      "order": 240,
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
        "x": 2.3661,
        "y": -0.346
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
      "id": "g1Llega4",
      "label": "g1Llega4",
      "color": "carbon",
      "layerId": "arrows",
      "order": 240,
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
        "x": 2.376,
        "y": -1.1138
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
      "id": "g1Reposo",
      "label": "g1Reposo",
      "color": "carbon",
      "layerId": "arrows",
      "order": 240,
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
      "id": "g1Inicio",
      "label": "g1Inicio",
      "color": "carbon",
      "layerId": "arrows",
      "order": 241,
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
        "x": "a1.x + 0.24 * (hg1.x - a1.x) / max(hypot((hg1.x - a1.x), (hg1.y - a1.y)), 0.001)",
        "y": "a1.y + 0.24 * (hg1.y - a1.y) / max(hypot((hg1.x - a1.x), (hg1.y - a1.y)), 0.001)",
        "fallback": [
          -2.3661,
          0.746
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
      "id": "flechag1",
      "label": "Segunda flecha de $a_1$",
      "color": "mora",
      "layerId": "arrows",
      "order": 340,
      "visible": true,
      "visibleWhen": "and(gte(segunda, 0.5), gt(hg1.x, 0))",
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
          "g1Inicio",
          "hg1"
        ]
      },
      "appearance": {
        "strokeWidth": 2.2,
        "arrow": "end",
        "labelVisible": false,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "reposog1",
      "label": "Sin imagen: Segunda flecha de $a_1$",
      "color": "mora",
      "layerId": "arrows",
      "order": 360,
      "visible": true,
      "visibleWhen": "and(gte(segunda, 0.5), lt(hg1.x, 0))",
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
          "g1Inicio",
          "hg1"
        ]
      },
      "appearance": {
        "strokeWidth": 1.8,
        "arrow": "end",
        "labelVisible": false,
        "preserveColorOnHighlight": true,
        "dashed": true
      }
    },
    {
      "id": "hg1",
      "label": "hg1",
      "color": "mora",
      "layerId": "handles",
      "order": 440,
      "visible": true,
      "visibleWhen": "gte(segunda, 0.5)",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "primary",
        "ariaLabel": "Punta de la segunda flecha de a₁"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.3661,
        "y": -0.346
      },
      "mobility": {
        "type": "on-points",
        "points": [
          "g1Llega1",
          "g1Llega2",
          "g1Llega3",
          "g1Llega4",
          "g1Reposo"
        ]
      },
      "appearance": {
        "size": 10,
        "opacity": 0,
        "labelVisible": false,
        "highlightSize": 5,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segunda",
      "label": "Dar a $a_1$ una segunda flecha",
      "color": "mora",
      "layerId": "annotations",
      "order": 500,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "primary",
        "ariaLabel": "Dar a a₁ una segunda flecha"
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
        "durationMs": 450,
        "easing": "ease-in-out",
        "behavior": "toggle"
      }
    },
    {
      "id": "mismaImagen",
      "label": "mismaImagen",
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
        "x": "or(and(and(gt(hf1.x, 0), approx(hf1.y, 1.1816, 0.01)), and(gt(hg1.x, 0), approx(hg1.y, 1.1816, 0.01))), and(and(gt(hf1.x, 0), approx(hf1.y, 0.4184, 0.01)), and(gt(hg1.x, 0), approx(hg1.y, 0.4184, 0.01))))",
        "y": "or(and(and(gt(hf1.x, 0), approx(hf1.y, -0.346, 0.01)), and(gt(hg1.x, 0), approx(hg1.y, -0.346, 0.01))), and(and(gt(hf1.x, 0), approx(hf1.y, -1.1138, 0.01)), and(gt(hg1.x, 0), approx(hg1.y, -1.1138, 0.01))))",
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
      "id": "condiciones",
      "label": "condiciones",
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
        "x": "and(or(gt(hf1.x, 0), and(gte(segunda, 0.5), gt(hg1.x, 0))), gt(hf2.x, 0), gt(hf3.x, 0))",
        "y": "and(gt(hf1.x, 0), and(gte(segunda, 0.5), gt(hg1.x, 0)), not(or(mismaImagen.x, mismaImagen.y)))",
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
      "visibleWhen": "or(not(or(gt(hf1.x, 0), and(gte(segunda, 0.5), gt(hg1.x, 0)))), gt(condiciones.y, 0.5))",
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
      "id": "estadoFuncion",
      "label": "Estado: es función",
      "color": "carbon",
      "layerId": "annotations",
      "order": 700,
      "visible": true,
      "visibleWhen": "and(gt(condiciones.x, 0.5), not(gt(condiciones.y, 0.5)))",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "annotation",
        "ariaLabel": "Estado: es función"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "",
        "blocks": [
          {
            "id": "estado",
            "text": "Es una función de $A$ en $B$.",
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
      "id": "estadoTotalidad",
      "label": "Estado: falla la totalidad",
      "color": "carbon",
      "layerId": "annotations",
      "order": 701,
      "visible": true,
      "visibleWhen": "and(not(gt(condiciones.x, 0.5)), not(gt(condiciones.y, 0.5)))",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "annotation",
        "ariaLabel": "Estado: falla la totalidad"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "",
        "blocks": [
          {
            "id": "estado",
            "text": "Falla la totalidad: un $a_i$ sin imagen.",
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
      "id": "estadoUnicidad",
      "label": "Estado: falla la unicidad",
      "color": "carbon",
      "layerId": "annotations",
      "order": 702,
      "visible": true,
      "visibleWhen": "and(gt(condiciones.x, 0.5), gt(condiciones.y, 0.5))",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "annotation",
        "ariaLabel": "Estado: falla la unicidad"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "",
        "blocks": [
          {
            "id": "estado",
            "text": "Falla la unicidad: dos imágenes de $a_1$.",
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
      "id": "estadoAmbas",
      "label": "Estado: fallan las dos condiciones",
      "color": "carbon",
      "layerId": "annotations",
      "order": 703,
      "visible": true,
      "visibleWhen": "and(not(gt(condiciones.x, 0.5)), gt(condiciones.y, 0.5))",
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "annotation",
        "ariaLabel": "Estado: fallan las dos condiciones"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "",
        "blocks": [
          {
            "id": "estado",
            "text": "Fallan la totalidad y la unicidad.",
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
      "title": "Funtzioa: geziak bi multzoren artean",
      "note": "Arrastatu gezi-punta bakoitza B-ra, edo itzuli A-ra.",
      "labels": {
        "conjuntoA": "$A$",
        "conjuntoB": "$B$",
        "segunda": "Eman $a_1$-i bigarren gezi bat",
        "flechaf1": "$a_1$-en gezia",
        "flechaf2": "$a_2$-ren gezia",
        "flechaf3": "$a_3$-ren gezia",
        "flechag1": "$a_1$-en bigarren gezia"
      },
      "blocks": {
        "estadoFuncion": {
          "estado": {
            "text": "$A$-tik $B$-rako funtzioa da."
          }
        },
        "estadoTotalidad": {
          "estado": {
            "text": "Osotasunik ez: $a_i$ bat irudirik gabe."
          }
        },
        "estadoUnicidad": {
          "estado": {
            "text": "Bakartasunik ez: $a_1$-ek bi irudi ditu."
          }
        },
        "estadoAmbas": {
          "estado": {
            "text": "Ez dago ez osotasunik ez bakartasunik."
          }
        }
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
        "b4": "B-ko b₄ elementua",
        "hf1": "a₁-en geziaren punta: aukeratu bere irudia B-n edo itzuli a₁-en ondora",
        "hf2": "a₂-ren geziaren punta: aukeratu bere irudia B-n edo itzuli a₂-ren ondora",
        "hf3": "a₃-ren geziaren punta: aukeratu bere irudia B-n edo itzuli a₃-ren ondora",
        "hg1": "a₁-en bigarren geziaren punta",
        "segunda": "Eman a₁-i bigarren gezi bat",
        "grupoFlechas": "Nabarmendu geziak: erlazioaren bikoteak"
      }
    },
    "en": {
      "title": "Function: arrows between two sets",
      "note": "Drag each arrowhead into B, or back into A.",
      "labels": {
        "conjuntoA": "$A$",
        "conjuntoB": "$B$",
        "segunda": "Give $a_1$ a second arrow",
        "flechaf1": "Arrow from $a_1$",
        "flechaf2": "Arrow from $a_2$",
        "flechaf3": "Arrow from $a_3$",
        "flechag1": "Second arrow from $a_1$"
      },
      "blocks": {
        "estadoFuncion": {
          "estado": {
            "text": "A function from $A$ to $B$."
          }
        },
        "estadoTotalidad": {
          "estado": {
            "text": "Totality fails: an $a_i$ has no image."
          }
        },
        "estadoUnicidad": {
          "estado": {
            "text": "Uniqueness fails: $a_1$ has two images."
          }
        },
        "estadoAmbas": {
          "estado": {
            "text": "Both totality and uniqueness fail."
          }
        }
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
        "b4": "Element b₄ of B",
        "hf1": "Tip of the arrow from a₁: choose its image in B or bring it back next to a₁",
        "hf2": "Tip of the arrow from a₂: choose its image in B or bring it back next to a₂",
        "hf3": "Tip of the arrow from a₃: choose its image in B or bring it back next to a₃",
        "hg1": "Tip of the second arrow from a₁",
        "segunda": "Give a₁ a second arrow",
        "grupoFlechas": "Highlight the arrows: the pairs of the relation"
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const FuncionSagital = () => <DiagramRenderer spec={FuncionSagitalSpec} />;
