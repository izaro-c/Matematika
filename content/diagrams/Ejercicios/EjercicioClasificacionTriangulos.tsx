import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const EjercicioClasificacionTriangulosSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Clasificación e Inspección de Triángulos",
  "componentId": "ejercicio-clasificacion-triangulos",
  "category": "Ejercicios",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "showLabels": true,
  "showHeader": false,
  "viewport": {
    "bounds": [
      -1,
      5.5,
      19,
      -2.5
    ],
    "home": [
      -1,
      5.5,
      19,
      -2.5
    ],
    "minZoom": 0.5,
    "maxZoom": 5,
    "padding": 0.05
  },
  "layers": [
    {
      "id": "geometry",
      "label": "Geometría",
      "order": 0,
      "visible": true,
      "locked": false
    },
    {
      "id": "annotations",
      "label": "Anotaciones",
      "order": 1,
      "visible": true,
      "locked": false
    }
  ],
  "groups": [],
  "objects": [
    {
      "id": "pR1",
      "label": "R₁",
      "color": "canela",
      "layerId": "geometry",
      "order": 1000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértice R1",
        "role": "primary"
      },
      "target": true,
      "targetId": "pR1",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0,
        "y": 0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true
      },
      "interaction": {}
    },
    {
      "id": "pR2",
      "label": "R₂",
      "color": "canela",
      "layerId": "geometry",
      "order": 1001,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértice R2",
        "role": "primary"
      },
      "target": true,
      "targetId": "pR2",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 4,
        "y": 0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true
      },
      "interaction": {}
    },
    {
      "id": "pR3",
      "label": "C₁ (Rectángulo 90°)",
      "color": "canela",
      "layerId": "geometry",
      "order": 1002,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértice C1 móvil",
        "role": "primary"
      },
      "target": true,
      "targetId": "pR3",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 1.8,
        "y": 2.5
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 9,
        "labelVisible": true,
        "highlightSize": 12,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pA1",
      "label": "A₁",
      "color": "pavo",
      "layerId": "geometry",
      "order": 1010,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértice A1",
        "role": "primary"
      },
      "target": true,
      "targetId": "pA1",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 6,
        "y": 0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true
      },
      "interaction": {}
    },
    {
      "id": "pA2",
      "label": "A₂",
      "color": "pavo",
      "layerId": "geometry",
      "order": 1011,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértice A2",
        "role": "primary"
      },
      "target": true,
      "targetId": "pA2",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 10,
        "y": 0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true
      },
      "interaction": {}
    },
    {
      "id": "pA3",
      "label": "C₂ (Acutángulo < 90°)",
      "color": "pavo",
      "layerId": "geometry",
      "order": 1012,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértice C2 móvil",
        "role": "primary"
      },
      "target": true,
      "targetId": "pA3",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 5.2,
        "y": 2
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 9,
        "labelVisible": true,
        "highlightSize": 12,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pO1",
      "label": "O₁",
      "color": "mora",
      "layerId": "geometry",
      "order": 1020,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértice O1",
        "role": "primary"
      },
      "target": true,
      "targetId": "pO1",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 13,
        "y": 0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true
      },
      "interaction": {}
    },
    {
      "id": "pO2",
      "label": "O₂",
      "color": "mora",
      "layerId": "geometry",
      "order": 1021,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértice O2",
        "role": "primary"
      },
      "target": true,
      "targetId": "pO2",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 17,
        "y": 0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true
      },
      "interaction": {}
    },
    {
      "id": "pO3",
      "label": "C₃ (Obtusángulo > 90°)",
      "color": "mora",
      "layerId": "geometry",
      "order": 1022,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértice C3 móvil",
        "role": "primary"
      },
      "target": true,
      "targetId": "pO3",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 15,
        "y": 3.4
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 9,
        "labelVisible": true,
        "highlightSize": 12,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pathR12",
      "label": "Base R",
      "color": "canela",
      "layerId": "geometry",
      "order": 2000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado R1R2",
        "role": "secondary"
      },
      "target": true,
      "targetId": "pathR12",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pR1",
          "pR2"
        ]
      },
      "appearance": {
        "strokeWidth": 2.5
      }
    },
    {
      "id": "pathR13",
      "label": "Lado R1C1",
      "color": "canela",
      "layerId": "geometry",
      "order": 2001,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado R1C1",
        "role": "secondary"
      },
      "target": true,
      "targetId": "pathR13",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pR1",
          "pR3"
        ]
      },
      "appearance": {
        "strokeWidth": 2.5
      }
    },
    {
      "id": "pathR23",
      "label": "Lado R2C1",
      "color": "canela",
      "layerId": "geometry",
      "order": 2002,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado R2C1",
        "role": "secondary"
      },
      "target": true,
      "targetId": "pathR23",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pR2",
          "pR3"
        ]
      },
      "appearance": {
        "strokeWidth": 2.5
      }
    },
    {
      "id": "angleR",
      "label": "$\\alpha_1$",
      "color": "canela",
      "layerId": "geometry",
      "order": 3000,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo R1",
        "role": "secondary"
      },
      "target": true,
      "targetId": "angleR",
      "objectType": "angle",
      "points": [
        "pR2",
        "pR1",
        "pR3"
      ],
      "sweep": "directed",
      "marker": "arc",
      "appearance": {
        "radius": 0.8
      }
    },
    {
      "id": "pathA12",
      "label": "Base A",
      "color": "pavo",
      "layerId": "geometry",
      "order": 2010,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado A1A2",
        "role": "secondary"
      },
      "target": true,
      "targetId": "pathA12",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pA1",
          "pA2"
        ]
      },
      "appearance": {
        "strokeWidth": 2.5
      }
    },
    {
      "id": "pathA13",
      "label": "Lado A1C2",
      "color": "pavo",
      "layerId": "geometry",
      "order": 2011,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado A1C2",
        "role": "secondary"
      },
      "target": true,
      "targetId": "pathA13",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pA1",
          "pA3"
        ]
      },
      "appearance": {
        "strokeWidth": 2.5
      }
    },
    {
      "id": "pathA23",
      "label": "Lado A2C2",
      "color": "pavo",
      "layerId": "geometry",
      "order": 2012,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado A2C2",
        "role": "secondary"
      },
      "target": true,
      "targetId": "pathA23",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pA2",
          "pA3"
        ]
      },
      "appearance": {
        "strokeWidth": 2.5
      }
    },
    {
      "id": "pathO12",
      "label": "Base O",
      "color": "mora",
      "layerId": "geometry",
      "order": 2020,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado O1O2",
        "role": "secondary"
      },
      "target": true,
      "targetId": "pathO12",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pO1",
          "pO2"
        ]
      },
      "appearance": {
        "strokeWidth": 2.5
      }
    },
    {
      "id": "pathO13",
      "label": "Lado O1C3",
      "color": "mora",
      "layerId": "geometry",
      "order": 2021,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado O1C3",
        "role": "secondary"
      },
      "target": true,
      "targetId": "pathO13",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pO1",
          "pO3"
        ]
      },
      "appearance": {
        "strokeWidth": 2.5
      }
    },
    {
      "id": "pathO23",
      "label": "Lado O2C3",
      "color": "mora",
      "layerId": "geometry",
      "order": 2022,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado O2C3",
        "role": "secondary"
      },
      "target": true,
      "targetId": "pathO23",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pO2",
          "pO3"
        ]
      },
      "appearance": {
        "strokeWidth": 2.5
      }
    }
  ],
  "relations": [],
  "steps": [],
  "note": "Construye los 3 triángulos ajustando los vértices móviles C1, C2 y C3."
}
);
/* @matematika-diagram-spec:end */

export const EjercicioClasificacionTriangulos = (props?: any) => <DiagramRenderer spec={EjercicioClasificacionTriangulosSpec} {...props} />;
