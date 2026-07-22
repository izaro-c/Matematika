import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const AxiomaDedekindSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
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
  "objects": [
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -11,
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 11,
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0,
        "y": 0
      },
      "mobility": {
        "type": "on-support",
        "support": "realLine"
      },
      "appearance": {
        "size": 8,
        "labelVisible": true,
        "labelOffset": [
          0,
          18
        ],
        "labelSize": 19,
        "highlightSize": 11,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
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
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "through-points",
          "points": [
            "pLeft",
            "pRight"
          ]
        }
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 1.5,
        "strokeOpacity": 0.65,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "ray",
        "points": [
          "pP",
          "pLeft"
        ]
      },
      "appearance": {
        "strokeWidth": 7,
        "highlightStrokeWidth": 9,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "annotation",
      "variant": "label",
      "content": {
        "text": "L: x ≤ P"
      },
      "anchor": {
        "type": "object",
        "object": "rayL",
        "parameter": 0.58,
        "offset": [
          0,
          0.58
        ]
      },
      "appearance": {
        "fontSize": 18,
        "preserveColorOnHighlight": true
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
      "objectType": "path",
      "geometry": {
        "type": "ray",
        "points": [
          "pP",
          "pRight"
        ]
      },
      "appearance": {
        "strokeWidth": 7,
        "highlightStrokeWidth": 9,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "annotation",
      "variant": "label",
      "content": {
        "text": "R: x > P"
      },
      "anchor": {
        "type": "object",
        "object": "rayR",
        "parameter": 0.42,
        "offset": [
          0,
          0.58
        ]
      },
      "appearance": {
        "fontSize": 18,
        "preserveColorOnHighlight": true
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
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "P = {value}",
        "expression": "pP.x",
        "precision": 2
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.1,
          0.22
        ]
      },
      "appearance": {}
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
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "{value} ∈ L",
        "expression": "pP.x-1",
        "precision": 2
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.32,
          0.22
        ]
      },
      "appearance": {}
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
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "{value} ∈ R",
        "expression": "pP.x+1",
        "precision": 2
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.55,
          0.22
        ]
      },
      "appearance": {}
    }
  ],
  "relations": [],
  "steps": [],
  "note": "Arrastra P sobre la recta: cambian L y R, pero la frontera sigue siendo única."
}
);
/* @matematika-diagram-spec:end */

export const AxiomaDedekind = () => <DiagramRenderer spec={AxiomaDedekindSpec} />;
