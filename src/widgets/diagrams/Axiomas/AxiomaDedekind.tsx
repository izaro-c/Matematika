import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const AxiomaDedekindSpec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Completitud: cortadura de Dedekind",
  "componentId": "axioma-dedekind",
  "category": "Axiomas",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "showLabels": true,
  "viewport": {
    "bounds": [
      -10,
      3.2,
      10,
      -3
    ],
    "home": [
      -6,
      3.2,
      6,
      -3
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
      "id": "classL",
      "label": "Clase izquierda L",
      "memberIds": [
        "rayL",
        "labelL"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Clase izquierda L completa",
        "role": "primary"
      },
      "target": true,
      "targetId": "claseL",
      "color": "carbon"
    },
    {
      "id": "classR",
      "label": "Clase derecha R",
      "memberIds": [
        "rayR",
        "labelR"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Clase derecha R completa",
        "role": "primary"
      },
      "target": true,
      "targetId": "claseR",
      "color": "salvia"
    }
  ],
  "points": [
    {
      "id": "pLeft",
      "label": "Dirección izquierda",
      "color": "carbon",
      "layerId": "supports",
      "order": 100,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": false,
        "ariaLabel": "Dirección izquierda de la recta",
        "role": "construction"
      },
      "target": false,
      "style": {
        "pointSize": 0,
        "highlightPointSize": 0
      },
      "x": -11,
      "y": 0,
      "showLabel": false,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "pRight",
      "label": "Dirección derecha",
      "color": "carbon",
      "layerId": "supports",
      "order": 200,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "highlightable": false,
        "ariaLabel": "Dirección derecha de la recta",
        "role": "construction"
      },
      "target": false,
      "style": {
        "pointSize": 0,
        "highlightPointSize": 0
      },
      "x": 11,
      "y": 0,
      "showLabel": false,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "pP",
      "label": "P",
      "color": "terracota",
      "layerId": "geometry",
      "order": 5000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto de corte móvil P",
        "role": "primary"
      },
      "target": true,
      "targetId": "pP",
      "style": {
        "pointSize": 8,
        "labelOffset": [
          0,
          18
        ],
        "labelSize": 19,
        "highlightPointSize": 11,
        "preserveColorOnHighlight": true
      },
      "x": 0,
      "y": 0,
      "showLabel": true,
      "fixed": false,
      "constraint": "glider",
      "gliderTarget": "realLine"
    }
  ],
  "elements": [
    {
      "id": "realLine",
      "label": "Recta completa",
      "color": "pizarra",
      "layerId": "supports",
      "order": 1000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta completa que se particiona",
        "role": "construction"
      },
      "target": true,
      "targetId": "recta",
      "style": {
        "strokeWidth": 1.5,
        "strokeOpacity": 0.65,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "line",
      "refs": [
        "pLeft",
        "pRight"
      ],
      "dashed": true
    },
    {
      "id": "rayL",
      "label": "Clase izquierda L",
      "color": "carbon",
      "layerId": "geometry",
      "order": 3000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "classL"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Clase L: puntos menores o iguales que P",
        "role": "primary"
      },
      "target": false,
      "style": {
        "strokeWidth": 7,
        "highlightStrokeWidth": 9,
        "preserveColorOnHighlight": true
      },
      "kind": "ray",
      "refs": [
        "pP",
        "pLeft"
      ]
    },
    {
      "id": "labelL",
      "label": "Etiqueta de L",
      "color": "carbon",
      "layerId": "annotations",
      "order": 7000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "classL"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Etiqueta de la clase L",
        "role": "annotation"
      },
      "target": false,
      "style": {
        "textOffset": [
          0,
          0.58
        ],
        "labelSize": 18,
        "preserveColorOnHighlight": true
      },
      "kind": "label",
      "refs": [
        "rayL"
      ],
      "text": "L: x ≤ P",
      "properties": {
        "anchorMode": "reference",
        "anchorParameter": 0.58
      }
    },
    {
      "id": "rayR",
      "label": "Clase derecha R",
      "color": "salvia",
      "layerId": "geometry",
      "order": 4000,
      "visible": true,
      "locked": false,
      "groupIds": [
        "classR"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Clase R: puntos mayores que P",
        "role": "primary"
      },
      "target": false,
      "style": {
        "strokeWidth": 7,
        "highlightStrokeWidth": 9,
        "preserveColorOnHighlight": true
      },
      "kind": "ray",
      "refs": [
        "pP",
        "pRight"
      ]
    },
    {
      "id": "labelR",
      "label": "Etiqueta de R",
      "color": "salvia",
      "layerId": "annotations",
      "order": 7100,
      "visible": true,
      "locked": false,
      "groupIds": [
        "classR"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Etiqueta de la clase R",
        "role": "annotation"
      },
      "target": false,
      "style": {
        "textOffset": [
          0,
          0.58
        ],
        "labelSize": 18,
        "preserveColorOnHighlight": true
      },
      "kind": "label",
      "refs": [
        "rayR"
      ],
      "text": "R: x > P",
      "properties": {
        "anchorMode": "reference",
        "anchorParameter": 0.42
      }
    },
    {
      "id": "readingP",
      "label": "Coordenada del punto de corte",
      "color": "terracota",
      "layerId": "annotations",
      "order": 10000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lectura dinámica de P",
        "role": "annotation"
      },
      "target": false,
      "kind": "infoPanel",
      "refs": [],
      "text": "P = {value}",
      "properties": {
        "expression": "pP.x",
        "precision": 2,
        "anchorMode": "viewport",
        "viewportPosition": [
          0.1,
          0.22
        ]
      }
    },
    {
      "id": "sampleL",
      "label": "Ejemplo de elemento de L",
      "color": "carbon",
      "layerId": "annotations",
      "order": 10100,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ejemplo dinámico de un elemento de L",
        "role": "annotation"
      },
      "target": false,
      "kind": "infoPanel",
      "refs": [],
      "text": "{value} ∈ L",
      "properties": {
        "expression": "pP.x-1",
        "precision": 2,
        "anchorMode": "viewport",
        "viewportPosition": [
          0.32,
          0.22
        ]
      }
    },
    {
      "id": "sampleR",
      "label": "Ejemplo de elemento de R",
      "color": "salvia",
      "layerId": "annotations",
      "order": 10200,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ejemplo dinámico de un elemento de R",
        "role": "annotation"
      },
      "target": false,
      "kind": "infoPanel",
      "refs": [],
      "text": "{value} ∈ R",
      "properties": {
        "expression": "pP.x+1",
        "precision": 2,
        "anchorMode": "viewport",
        "viewportPosition": [
          0.55,
          0.22
        ]
      }
    }
  ],
  "sliders": [],
  "steps": [],
  "constraints": [],
  "dependencies": [
    {
      "sourceId": "pLeft",
      "targetId": "realLine",
      "relation": "construction"
    },
    {
      "sourceId": "pRight",
      "targetId": "realLine",
      "relation": "construction"
    },
    {
      "sourceId": "realLine",
      "targetId": "pP",
      "relation": "constraint"
    },
    {
      "sourceId": "pP",
      "targetId": "rayL",
      "relation": "construction"
    },
    {
      "sourceId": "pLeft",
      "targetId": "rayL",
      "relation": "construction"
    },
    {
      "sourceId": "rayL",
      "targetId": "labelL",
      "relation": "construction"
    },
    {
      "sourceId": "pP",
      "targetId": "rayR",
      "relation": "construction"
    },
    {
      "sourceId": "pRight",
      "targetId": "rayR",
      "relation": "construction"
    },
    {
      "sourceId": "rayR",
      "targetId": "labelR",
      "relation": "construction"
    },
    {
      "sourceId": "pP",
      "targetId": "readingP",
      "relation": "expression"
    },
    {
      "sourceId": "pP",
      "targetId": "sampleL",
      "relation": "expression"
    },
    {
      "sourceId": "pP",
      "targetId": "sampleR",
      "relation": "expression"
    }
  ],
  "note": "Arrastra P sobre la recta: cambian L y R, pero la frontera sigue siendo única.",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const AxiomaDedekind = () => <DiagramRenderer spec={AxiomaDedekindSpec} />;
