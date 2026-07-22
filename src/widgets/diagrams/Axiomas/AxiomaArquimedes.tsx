import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const AxiomaArquimedesSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
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
  "objects": [
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3.5,
        "y": 0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true,
        "labelOffset": [
          -20,
          16
        ],
        "highlightSize": 9,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3.4,
        "y": 0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "highlightSize": 0
      },
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 1,
        "y": 0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "highlightSize": 0
      },
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2.5,
        "y": 0
      },
      "mobility": {
        "type": "on-support",
        "support": "supportAB"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "labelOffset": [
          10,
          16
        ],
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3.5,
        "y": 1.35
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true,
        "highlightSize": 9,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.5,
        "y": 1.35
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true,
        "highlightSize": 9,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3.5,
        "y": -1.25
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "highlightSize": 0
      },
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.5,
        "y": -1.25
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 0,
        "labelVisible": false,
        "highlightSize": 0
      },
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "pBase.x+n*abs(pB.x-pA.x)",
        "y": "pBase.y",
        "fallback": [
          0.5,
          -1.15
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 5,
        "labelVisible": false,
        "highlightSize": 8,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
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
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pBMin",
          "pBMax"
        ]
      },
      "appearance": {
        "strokeWidth": 1,
        "strokeOpacity": 0
      }
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
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pA",
          "pB"
        ]
      },
      "appearance": {
        "strokeWidth": 5,
        "highlightStrokeWidth": 7,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pC",
          "pD"
        ]
      },
      "appearance": {
        "strokeWidth": 5,
        "highlightStrokeWidth": 7,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "AB = {value}",
        "expression": "segAB.length",
        "precision": 2
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.06,
          0.22
        ]
      },
      "appearance": {}
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
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "n = {value}",
        "expression": "n",
        "precision": 0
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.25,
          0.22
        ]
      },
      "appearance": {}
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
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "n · AB = {value}",
        "expression": "n*segAB.length",
        "precision": 2
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.43,
          0.22
        ]
      },
      "appearance": {}
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
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "CD = {value}",
        "expression": "segCD.length",
        "precision": 2
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.66,
          0.22
        ]
      },
      "appearance": {}
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
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pBase",
          "pAccumulated"
        ]
      },
      "appearance": {
        "strokeWidth": 1,
        "strokeOpacity": 0
      }
    },
    {
      "id": "accumulatedBefore",
      "label": "n copias antes de superar CD",
      "color": "salvia",
      "layerId": "constructions",
      "order": 9000,
      "visible": true,
      "visibleWhen": "lte(n*segAB.length,segCD.length+0.000000001)",
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
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pBase",
          "pAccumulated"
        ]
      },
      "appearance": {
        "strokeWidth": 8,
        "highlightStrokeWidth": 10,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "accumulatedAfter",
      "label": "n copias después de superar CD",
      "color": "musgo",
      "layerId": "constructions",
      "order": 9100,
      "visible": true,
      "visibleWhen": "gt(n*segAB.length,segCD.length+0.000000001)",
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
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pBase",
          "pAccumulated"
        ]
      },
      "appearance": {
        "strokeWidth": 8,
        "highlightStrokeWidth": 10,
        "preserveColorOnHighlight": true
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
      "objectType": "mark",
      "variant": "graduation",
      "anchor": {
        "type": "path",
        "path": "accumulatedCarrier"
      },
      "count": 1,
      "height": 14,
      "spacing": 1,
      "spacingExpression": "abs(pB.x-pA.x)",
      "subdivisions": 0,
      "appearance": {
        "strokeWidth": 2,
        "preserveColorOnHighlight": true
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
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "n mínimo = {value}",
        "expression": "floor(segCD.length/segAB.length+0.000000001)+1",
        "precision": 0
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.38,
          0.22
        ]
      },
      "appearance": {}
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
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "through-points",
          "points": [
            "pD",
            "pThreshold"
          ]
        }
      },
      "appearance": {
        "dashed": true,
        "preserveColorOnHighlight": true
      }
    },
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
      "objectType": "control",
      "variant": "slider",
      "position": [
        -1.2,
        -2.35
      ],
      "range": {
        "min": 1,
        "max": 7,
        "maxExpression": "floor(segCD.length/segAB.length+0.000000001)+1",
        "step": 1
      },
      "value": 4
    }
  ],
  "relations": [],
  "steps": [],
  "note": "Arrastra B para hacer AB tan pequeño como se desee; el máximo de n se recalcula y siempre permite rebasar CD."
}
);
/* @matematika-diagram-spec:end */

export const AxiomaArquimedes = () => <DiagramRenderer spec={AxiomaArquimedesSpec} />;
