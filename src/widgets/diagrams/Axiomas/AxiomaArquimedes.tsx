import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const AxiomaArquimedesSpec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Axioma de Arquímedes",
  "componentId": "axioma-arquimedes",
  "category": "Axiomas",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "showLabels": true,
  "viewport": {
    "bounds": [
      -4.7,
      3.35,
      7,
      -3.25
    ],
    "home": [
      -4.7,
      3.35,
      7,
      -3.25
    ],
    "minZoom": 0.35,
    "maxZoom": 8,
    "padding": 0.16
  },
  "layers": [
    {
      "id": "supports",
      "label": "Soportes",
      "order": 0,
      "visible": true,
      "locked": false
    },
    {
      "id": "geometry",
      "label": "Geometría",
      "order": 1,
      "visible": true,
      "locked": false
    },
    {
      "id": "constructions",
      "label": "Construcciones",
      "order": 2,
      "visible": true,
      "locked": false
    },
    {
      "id": "controls",
      "label": "Controles",
      "order": 3,
      "visible": true,
      "locked": false
    },
    {
      "id": "annotations",
      "label": "Anotaciones",
      "order": 4,
      "visible": true,
      "locked": false
    }
  ],
  "groups": [
    {
      "id": "copies",
      "label": "n copias consecutivas de AB",
      "memberIds": [
        "pAccumulated",
        "accumulatedCarrier",
        "accumulatedBefore",
        "accumulatedAfter",
        "copyTicks"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Longitud formada por n copias consecutivas de AB",
        "role": "primary"
      },
      "target": true,
      "targetId": "copiasAB",
      "color": "salvia"
    },
    {
      "id": "group2",
      "label": "Dos segmentos",
      "memberIds": [
        "pA",
        "pB",
        "pC",
        "pD",
        "segAB",
        "segCD"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": true,
      "targetId": "dosSegmentos"
    }
  ],
  "points": [
    {
      "id": "pA",
      "label": "A",
      "color": "salvia",
      "layerId": "geometry",
      "order": 1000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group2"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Extremo A del segmento menor",
        "role": "primary"
      },
      "target": true,
      "targetId": "pA",
      "style": {
        "pointSize": 6,
        "labelOffset": [
          -20,
          16
        ],
        "highlightPointSize": 9,
        "preserveColorOnHighlight": true
      },
      "x": -3.5,
      "y": 0,
      "showLabel": true,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "pBMin",
      "label": "B mínimo",
      "color": "carbon",
      "layerId": "supports",
      "order": 100,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": false,
        "ariaLabel": "Límite mínimo de B",
        "role": "construction"
      },
      "target": false,
      "style": {
        "pointSize": 0,
        "highlightPointSize": 0
      },
      "x": -3.4,
      "y": 0,
      "showLabel": false,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "pBMax",
      "label": "B máximo",
      "color": "carbon",
      "layerId": "supports",
      "order": 200,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": false,
        "ariaLabel": "Límite máximo de B",
        "role": "construction"
      },
      "target": false,
      "style": {
        "pointSize": 0,
        "highlightPointSize": 0
      },
      "x": 1,
      "y": 0,
      "showLabel": false,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "pB",
      "label": "B",
      "color": "salvia",
      "layerId": "geometry",
      "order": 3000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group2"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Extremo móvil B; ajusta la longitud de AB",
        "role": "primary"
      },
      "target": true,
      "targetId": "pB",
      "style": {
        "pointSize": 7,
        "labelOffset": [
          10,
          16
        ],
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -2.5,
      "y": 0,
      "showLabel": true,
      "fixed": false,
      "constraint": "glider",
      "gliderTarget": "supportAB"
    },
    {
      "id": "pC",
      "label": "C",
      "color": "carbon",
      "layerId": "geometry",
      "order": 4000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group2"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Extremo C del segmento de referencia",
        "role": "primary"
      },
      "target": true,
      "targetId": "pC",
      "style": {
        "pointSize": 6,
        "highlightPointSize": 9,
        "preserveColorOnHighlight": true
      },
      "x": -3.5,
      "y": 1.35,
      "showLabel": true,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "pD",
      "label": "D",
      "color": "carbon",
      "layerId": "geometry",
      "order": 5000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group2"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Extremo D del segmento de referencia",
        "role": "primary"
      },
      "target": true,
      "targetId": "pD",
      "style": {
        "pointSize": 6,
        "highlightPointSize": 9,
        "preserveColorOnHighlight": true
      },
      "x": 2.5,
      "y": 1.35,
      "showLabel": true,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "pBase",
      "label": "Origen de las copias",
      "color": "carbon",
      "layerId": "supports",
      "order": 300,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": false,
        "ariaLabel": "Origen de la yuxtaposición",
        "role": "construction"
      },
      "target": false,
      "style": {
        "pointSize": 0,
        "highlightPointSize": 0
      },
      "x": -3.5,
      "y": -1.25,
      "showLabel": false,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "pThreshold",
      "label": "Umbral de CD",
      "color": "carbon",
      "layerId": "supports",
      "order": 500,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": false,
        "ariaLabel": "Proyección del extremo D",
        "role": "construction"
      },
      "target": false,
      "style": {
        "pointSize": 0,
        "highlightPointSize": 0
      },
      "x": 2.5,
      "y": -1.25,
      "showLabel": false,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "pAccumulated",
      "label": "Extremo de n copias",
      "color": "ocre",
      "layerId": "constructions",
      "order": 8000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "copies"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Extremo de la longitud acumulada n por AB",
        "role": "primary"
      },
      "target": true,
      "targetId": "acumulado",
      "style": {
        "pointSize": 5,
        "highlightPointSize": 8,
        "preserveColorOnHighlight": true
      },
      "x": 0.5,
      "y": -1.15,
      "showLabel": false,
      "fixed": true,
      "constraint": "derived",
      "dependencies": [
        "pBase",
        "n",
        "pA",
        "pB"
      ],
      "xExpression": "pBase.x+n*abs(pB.x-pA.x)",
      "yExpression": "pBase.y"
    }
  ],
  "elements": [
    {
      "id": "supportAB",
      "label": "Recorrido permitido de B",
      "color": "carbon",
      "layerId": "supports",
      "order": 1000,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": false,
        "ariaLabel": "Recorrido permitido de B",
        "role": "construction"
      },
      "target": false,
      "style": {
        "strokeWidth": 1,
        "strokeOpacity": 0
      },
      "kind": "segment",
      "refs": [
        "pBMin",
        "pBMax"
      ]
    },
    {
      "id": "segAB",
      "label": "Segmento menor AB",
      "color": "salvia",
      "layerId": "geometry",
      "order": 6000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group2"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento menor AB",
        "role": "primary"
      },
      "target": true,
      "targetId": "segAB",
      "style": {
        "strokeWidth": 5,
        "highlightStrokeWidth": 7,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "pA",
        "pB"
      ]
    },
    {
      "id": "segCD",
      "label": "Segmento de referencia CD",
      "color": "carbon",
      "layerId": "geometry",
      "order": 7000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "group2"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento de referencia CD",
        "role": "primary"
      },
      "target": true,
      "targetId": "segCD",
      "style": {
        "strokeWidth": 5,
        "highlightStrokeWidth": 7,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "pC",
        "pD"
      ]
    },
    {
      "id": "readingAB",
      "label": "Longitud de AB",
      "color": "salvia",
      "layerId": "annotations",
      "order": 20000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lectura dinámica de la longitud AB",
        "role": "annotation"
      },
      "target": false,
      "kind": "infoPanel",
      "refs": [],
      "text": "AB = {value}",
      "properties": {
        "expression": "segAB.length",
        "precision": 2,
        "anchorMode": "viewport",
        "viewportPosition": [
          0.06,
          0.22
        ]
      }
    },
    {
      "id": "readingN",
      "label": "Número de copias",
      "color": "pavo",
      "layerId": "annotations",
      "order": 20100,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lectura dinámica del número de copias",
        "role": "annotation"
      },
      "target": false,
      "kind": "infoPanel",
      "refs": [],
      "text": "n = {value}",
      "properties": {
        "expression": "n",
        "precision": 0,
        "anchorMode": "viewport",
        "viewportPosition": [
          0.25,
          0.22
        ]
      }
    },
    {
      "id": "readingProduct",
      "label": "Longitud acumulada",
      "color": "terracota",
      "layerId": "annotations",
      "order": 20200,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lectura dinámica de n por AB",
        "role": "annotation"
      },
      "target": false,
      "kind": "infoPanel",
      "refs": [],
      "text": "n · AB = {value}",
      "properties": {
        "expression": "n*segAB.length",
        "precision": 2,
        "anchorMode": "viewport",
        "viewportPosition": [
          0.43,
          0.22
        ]
      }
    },
    {
      "id": "readingCD",
      "label": "Longitud de CD",
      "color": "carbon",
      "layerId": "annotations",
      "order": 20300,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lectura dinámica de la longitud CD",
        "role": "annotation"
      },
      "target": false,
      "kind": "infoPanel",
      "refs": [],
      "text": "CD = {value}",
      "properties": {
        "expression": "segCD.length",
        "precision": 2,
        "anchorMode": "viewport",
        "viewportPosition": [
          0.66,
          0.22
        ]
      }
    },
    {
      "id": "accumulatedCarrier",
      "label": "Soporte de la longitud acumulada",
      "color": "pizarra",
      "layerId": "supports",
      "order": 3000,
      "visible": false,
      "locked": false,
      "groupIds": [
        "copies"
      ],
      "selection": {
        "selectable": true,
        "highlightable": false,
        "ariaLabel": "Soporte auxiliar de n copias de AB",
        "role": "construction"
      },
      "target": false,
      "style": {
        "strokeWidth": 1,
        "strokeOpacity": 0
      },
      "kind": "segment",
      "refs": [
        "pBase",
        "pAccumulated"
      ]
    },
    {
      "id": "accumulatedBefore",
      "label": "n copias antes de superar CD",
      "color": "salvia",
      "layerId": "constructions",
      "order": 9000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "copies"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Longitud acumulada que todavía no supera CD",
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 8,
        "highlightStrokeWidth": 10,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "pBase",
        "pAccumulated"
      ],
      "properties": {
        "visibleWhen": "lte(n*segAB.length,segCD.length+0.000000001)"
      }
    },
    {
      "id": "accumulatedAfter",
      "label": "n copias después de superar CD",
      "color": "musgo",
      "layerId": "constructions",
      "order": 9100,
      "visible": true,
      "locked": false,
      "groupIds": [
        "copies"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Longitud acumulada que supera CD",
        "role": "primary"
      },
      "target": true,
      "targetId": "copiasSuperanCD",
      "style": {
        "strokeWidth": 8,
        "highlightStrokeWidth": 10,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "pBase",
        "pAccumulated"
      ],
      "properties": {
        "visibleWhen": "gt(n*segAB.length,segCD.length+0.000000001)"
      }
    },
    {
      "id": "copyTicks",
      "label": "Separaciones entre copias de AB",
      "color": "carbon",
      "layerId": "constructions",
      "order": 9200,
      "visible": true,
      "locked": false,
      "groupIds": [
        "copies"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Marcas que separan las copias consecutivas de AB",
        "role": "construction"
      },
      "target": false,
      "style": {
        "strokeWidth": 2,
        "markHeight": 14,
        "highlightStrokeWidth": 4,
        "preserveColorOnHighlight": true
      },
      "kind": "measureTicks",
      "refs": [
        "accumulatedCarrier"
      ],
      "properties": {
        "tickDistance": 1,
        "tickDistanceExpression": "abs(pB.x-pA.x)",
        "minorTickCount": 0
      }
    },
    {
      "id": "readingRequired",
      "label": "Primer natural suficiente",
      "color": "pavo",
      "layerId": "annotations",
      "order": 20150,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Primer número natural que supera CD",
        "role": "annotation"
      },
      "target": true,
      "targetId": "nMinimo",
      "kind": "infoPanel",
      "refs": [],
      "text": "n mínimo = {value}",
      "properties": {
        "expression": "floor(segCD.length/segAB.length+0.000000001)+1",
        "precision": 0,
        "anchorMode": "viewport",
        "viewportPosition": [
          0.38,
          0.22
        ]
      }
    },
    {
      "id": "lineDThreshold",
      "label": "Recta de referencia CD",
      "color": "ocre",
      "layerId": "geometry",
      "order": 8000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta",
        "role": "secondary"
      },
      "target": true,
      "targetId": "lineDThreshold",
      "style": {
        "preserveColorOnHighlight": true
      },
      "kind": "line",
      "refs": [
        "pD",
        "pThreshold"
      ],
      "dashed": true
    }
  ],
  "sliders": [
    {
      "id": "n",
      "label": "$n$",
      "color": "pavo",
      "layerId": "controls",
      "order": 18000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Número natural de copias n",
        "role": "primary"
      },
      "target": true,
      "targetId": "n",
      "style": {
        "preserveColorOnHighlight": true
      },
      "x": -1.2,
      "y": -2.35,
      "min": 1,
      "max": 7,
      "maxExpression": "floor(segCD.length/segAB.length+0.000000001)+1",
      "value": 4,
      "step": 1
    }
  ],
  "steps": [],
  "constraints": [],
  "dependencies": [
    {
      "sourceId": "pBMin",
      "targetId": "supportAB",
      "relation": "construction"
    },
    {
      "sourceId": "pBMax",
      "targetId": "supportAB",
      "relation": "construction"
    },
    {
      "sourceId": "supportAB",
      "targetId": "pB",
      "relation": "constraint"
    },
    {
      "sourceId": "pA",
      "targetId": "segAB",
      "relation": "construction"
    },
    {
      "sourceId": "pB",
      "targetId": "segAB",
      "relation": "construction"
    },
    {
      "sourceId": "pC",
      "targetId": "segCD",
      "relation": "construction"
    },
    {
      "sourceId": "pD",
      "targetId": "segCD",
      "relation": "construction"
    },
    {
      "sourceId": "segAB",
      "targetId": "n",
      "relation": "expression"
    },
    {
      "sourceId": "segCD",
      "targetId": "n",
      "relation": "expression"
    },
    {
      "sourceId": "pBase",
      "targetId": "pAccumulated",
      "relation": "expression"
    },
    {
      "sourceId": "n",
      "targetId": "pAccumulated",
      "relation": "expression"
    },
    {
      "sourceId": "pA",
      "targetId": "pAccumulated",
      "relation": "expression"
    },
    {
      "sourceId": "pB",
      "targetId": "pAccumulated",
      "relation": "expression"
    },
    {
      "sourceId": "pBase",
      "targetId": "accumulatedCarrier",
      "relation": "construction"
    },
    {
      "sourceId": "pAccumulated",
      "targetId": "accumulatedCarrier",
      "relation": "construction"
    },
    {
      "sourceId": "pBase",
      "targetId": "accumulatedBefore",
      "relation": "construction"
    },
    {
      "sourceId": "pAccumulated",
      "targetId": "accumulatedBefore",
      "relation": "construction"
    },
    {
      "sourceId": "n",
      "targetId": "accumulatedBefore",
      "relation": "expression"
    },
    {
      "sourceId": "segAB",
      "targetId": "accumulatedBefore",
      "relation": "expression"
    },
    {
      "sourceId": "segCD",
      "targetId": "accumulatedBefore",
      "relation": "expression"
    },
    {
      "sourceId": "pBase",
      "targetId": "accumulatedAfter",
      "relation": "construction"
    },
    {
      "sourceId": "pAccumulated",
      "targetId": "accumulatedAfter",
      "relation": "construction"
    },
    {
      "sourceId": "n",
      "targetId": "accumulatedAfter",
      "relation": "expression"
    },
    {
      "sourceId": "segAB",
      "targetId": "accumulatedAfter",
      "relation": "expression"
    },
    {
      "sourceId": "segCD",
      "targetId": "accumulatedAfter",
      "relation": "expression"
    },
    {
      "sourceId": "accumulatedCarrier",
      "targetId": "copyTicks",
      "relation": "construction"
    },
    {
      "sourceId": "pA",
      "targetId": "copyTicks",
      "relation": "expression"
    },
    {
      "sourceId": "pB",
      "targetId": "copyTicks",
      "relation": "expression"
    },
    {
      "sourceId": "segAB",
      "targetId": "readingAB",
      "relation": "expression"
    },
    {
      "sourceId": "n",
      "targetId": "readingN",
      "relation": "expression"
    },
    {
      "sourceId": "n",
      "targetId": "readingProduct",
      "relation": "expression"
    },
    {
      "sourceId": "segAB",
      "targetId": "readingProduct",
      "relation": "expression"
    },
    {
      "sourceId": "segCD",
      "targetId": "readingCD",
      "relation": "expression"
    },
    {
      "sourceId": "segAB",
      "targetId": "readingRequired",
      "relation": "expression"
    },
    {
      "sourceId": "segCD",
      "targetId": "readingRequired",
      "relation": "expression"
    },
    {
      "sourceId": "pD",
      "targetId": "lineDThreshold",
      "relation": "construction"
    },
    {
      "sourceId": "pThreshold",
      "targetId": "lineDThreshold",
      "relation": "construction"
    }
  ],
  "note": "Arrastra B para hacer AB tan pequeño como se desee; el máximo de n se recalcula y siempre permite rebasar CD.",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const AxiomaArquimedes = () => <DiagramRenderer spec={AxiomaArquimedesSpec} />;
