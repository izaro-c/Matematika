import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const PitagorasSpec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Teorema de Pitágoras",
  "componentId": "Pitagoras",
  "category": "Teoremas",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "viewport": {
    "bounds": [
      -8,
      8,
      8,
      -8
    ],
    "home": [
      -8,
      8,
      8,
      -8
    ],
    "minZoom": 0.65,
    "maxZoom": 4,
    "padding": 0.18
  },
  "layers": [
    {
      "id": "construccion",
      "label": "Construcción",
      "order": 0,
      "visible": true,
      "locked": false
    },
    {
      "id": "geometria",
      "label": "Triángulo",
      "order": 3,
      "visible": true,
      "locked": false
    },
    {
      "id": "areas",
      "label": "Cuadrados",
      "order": 1,
      "visible": true,
      "locked": false
    },
    {
      "id": "anotaciones",
      "label": "Medidas",
      "order": 2,
      "visible": true,
      "locked": false
    }
  ],
  "groups": [
    {
      "id": "trianguloGrupo",
      "label": "Triángulo rectángulo",
      "memberIds": [
        "A",
        "B",
        "C",
        "triangulo",
        "segBC",
        "segCA",
        "segAB",
        "anguloRecto"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "primary"
      },
      "target": true,
      "targetId": "triangulo",
      "color": "carbon"
    },
    {
      "id": "cuadradoAGrupo",
      "label": "Cuadrado del cateto a",
      "memberIds": [
        "segBC",
        "cuadradoA",
        "areaA"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "primary"
      },
      "target": true,
      "targetId": "cuadrado-a",
      "color": "salvia"
    },
    {
      "id": "cuadradoBGrupo",
      "label": "Cuadrado del cateto b",
      "memberIds": [
        "segCA",
        "cuadradoB",
        "areaB"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "primary"
      },
      "target": true,
      "targetId": "cuadrado-b",
      "color": "terracota"
    },
    {
      "id": "cuadradoCGrupo",
      "label": "Cuadrado de la hipotenusa",
      "memberIds": [
        "segAB",
        "cuadradoC",
        "areaC"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "role": "primary"
      },
      "target": true,
      "targetId": "cuadrado-c",
      "color": "ocre"
    }
  ],
  "points": [
    {
      "id": "C",
      "label": "C",
      "color": "carbon",
      "layerId": "geometria",
      "order": 3,
      "visible": true,
      "locked": false,
      "groupIds": [
        "trianguloGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "primary"
      },
      "target": false,
      "style": {
        "pointSize": 5,
        "highlightPointSize": 7,
        "preserveColorOnHighlight": true
      },
      "x": 0,
      "y": 0,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "ejeX",
      "label": "eje X",
      "color": "carbon",
      "layerId": "construccion",
      "order": 1,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "x": 1,
      "y": 0,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "ejeY",
      "label": "eje Y",
      "color": "carbon",
      "layerId": "construccion",
      "order": 2,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "x": 0,
      "y": 1,
      "fixed": true,
      "constraint": "fixed"
    },
    {
      "id": "A",
      "label": "A",
      "color": "carbon",
      "layerId": "geometria",
      "order": 1,
      "visible": true,
      "locked": false,
      "groupIds": [
        "trianguloGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "primary"
      },
      "target": false,
      "style": {
        "pointSize": 5,
        "highlightPointSize": 7,
        "preserveColorOnHighlight": true
      },
      "x": 0,
      "y": 4,
      "fixed": false,
      "constraint": "glider",
      "gliderTarget": "rayoY"
    },
    {
      "id": "B",
      "label": "B",
      "color": "carbon",
      "layerId": "geometria",
      "order": 2,
      "visible": true,
      "locked": false,
      "groupIds": [
        "trianguloGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "primary"
      },
      "target": false,
      "style": {
        "pointSize": 5,
        "highlightPointSize": 7,
        "preserveColorOnHighlight": true
      },
      "x": 3,
      "y": 0,
      "fixed": false,
      "constraint": "glider",
      "gliderTarget": "rayoX"
    },
    {
      "id": "sqA3",
      "label": "sqA3",
      "color": "carbon",
      "layerId": "construccion",
      "order": 20,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "x": 0,
      "y": 0,
      "fixed": true,
      "constraint": "derived",
      "dependencies": [
        "B",
        "C"
      ],
      "xExpression": "C.x",
      "yExpression": "C.y-B.x"
    },
    {
      "id": "cuadrado-a",
      "label": "sqA4",
      "color": "carbon",
      "layerId": "construccion",
      "order": 21,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "x": 0,
      "y": 0,
      "fixed": true,
      "constraint": "derived",
      "dependencies": [
        "B"
      ],
      "xExpression": "B.x",
      "yExpression": "B.y-B.x"
    },
    {
      "id": "cuadrado-b",
      "label": "sqB3",
      "color": "carbon",
      "layerId": "construccion",
      "order": 22,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "x": 0,
      "y": 0,
      "fixed": true,
      "constraint": "derived",
      "dependencies": [
        "A"
      ],
      "xExpression": "A.x-A.y",
      "yExpression": "A.y"
    },
    {
      "id": "sqB4",
      "label": "sqB4",
      "color": "carbon",
      "layerId": "construccion",
      "order": 23,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "x": 0,
      "y": 0,
      "fixed": true,
      "constraint": "derived",
      "dependencies": [
        "A",
        "C"
      ],
      "xExpression": "C.x-A.y",
      "yExpression": "C.y"
    },
    {
      "id": "cuadrado-c",
      "label": "sqC3",
      "color": "carbon",
      "layerId": "construccion",
      "order": 24,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "x": 0,
      "y": 0,
      "fixed": true,
      "constraint": "derived",
      "dependencies": [
        "A",
        "B"
      ],
      "xExpression": "B.x+A.y",
      "yExpression": "B.y+B.x"
    },
    {
      "id": "sqC4",
      "label": "sqC4",
      "color": "carbon",
      "layerId": "construccion",
      "order": 25,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "x": 0,
      "y": 0,
      "fixed": true,
      "constraint": "derived",
      "dependencies": [
        "A",
        "B"
      ],
      "xExpression": "A.x+A.y",
      "yExpression": "A.y+B.x"
    }
  ],
  "elements": [
    {
      "id": "rayoX",
      "label": "semirrecta horizontal",
      "color": "carbon",
      "layerId": "construccion",
      "order": 1,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "kind": "ray",
      "refs": [
        "C",
        "ejeX"
      ]
    },
    {
      "id": "rayoY",
      "label": "semirrecta vertical",
      "color": "carbon",
      "layerId": "construccion",
      "order": 2,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "kind": "ray",
      "refs": [
        "C",
        "ejeY"
      ]
    },
    {
      "id": "triangulo",
      "label": "triángulo ABC",
      "color": "carbon",
      "layerId": "geometria",
      "order": 10,
      "visible": true,
      "locked": false,
      "groupIds": [
        "trianguloGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2,
        "fillOpacity": 0.06,
        "highlightFillOpacity": 0.22,
        "preserveColorOnHighlight": true
      },
      "kind": "polygon",
      "refs": [
        "A",
        "B",
        "C"
      ]
    },
    {
      "id": "segBC",
      "label": "cateto a",
      "color": "salvia",
      "layerId": "geometria",
      "order": 11,
      "visible": true,
      "locked": false,
      "groupIds": [
        "trianguloGrupo",
        "cuadradoAGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2,
        "highlightStrokeWidth": 4,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "B",
        "C"
      ]
    },
    {
      "id": "segCA",
      "label": "cateto b",
      "color": "terracota",
      "layerId": "geometria",
      "order": 12,
      "visible": true,
      "locked": false,
      "groupIds": [
        "trianguloGrupo",
        "cuadradoBGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2,
        "highlightStrokeWidth": 4,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "C",
        "A"
      ]
    },
    {
      "id": "segAB",
      "label": "hipotenusa c",
      "color": "ocre",
      "layerId": "geometria",
      "order": 13,
      "visible": true,
      "locked": false,
      "groupIds": [
        "trianguloGrupo",
        "cuadradoCGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.5,
        "highlightStrokeWidth": 4.5,
        "preserveColorOnHighlight": true
      },
      "kind": "segment",
      "refs": [
        "A",
        "B"
      ]
    },
    {
      "id": "anguloRecto",
      "label": "ángulo recto en C",
      "color": "pavo",
      "layerId": "geometria",
      "order": 14,
      "visible": true,
      "locked": false,
      "groupIds": [
        "trianguloGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 1.5,
        "fillOpacity": 0.4,
        "angleRadius": 0.6,
        "highlightFillOpacity": 0.55,
        "preserveColorOnHighlight": true
      },
      "kind": "rightAngle",
      "refs": [
        "B",
        "C",
        "A"
      ]
    },
    {
      "id": "cuadradoA",
      "label": "cuadrado sobre a",
      "color": "salvia",
      "layerId": "areas",
      "order": 20,
      "visible": true,
      "locked": false,
      "groupIds": [
        "cuadradoAGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2,
        "strokeOpacity": 0.45,
        "fillOpacity": 0.1,
        "highlightFillOpacity": 0.3,
        "preserveColorOnHighlight": true
      },
      "kind": "areaDecomposition",
      "refs": [
        "B",
        "C",
        "sqA3",
        "cuadrado-a"
      ],
      "properties": {
        "rows": 3,
        "columns": 3
      }
    },
    {
      "id": "cuadradoB",
      "label": "cuadrado sobre b",
      "color": "terracota",
      "layerId": "areas",
      "order": 21,
      "visible": true,
      "locked": false,
      "groupIds": [
        "cuadradoBGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2,
        "strokeOpacity": 0.45,
        "fillOpacity": 0.1,
        "highlightFillOpacity": 0.3,
        "preserveColorOnHighlight": true
      },
      "kind": "areaDecomposition",
      "refs": [
        "C",
        "A",
        "cuadrado-b",
        "sqB4"
      ],
      "properties": {
        "rows": 4,
        "columns": 4
      }
    },
    {
      "id": "cuadradoC",
      "label": "cuadrado sobre c",
      "color": "ocre",
      "layerId": "areas",
      "order": 22,
      "visible": true,
      "locked": false,
      "groupIds": [
        "cuadradoCGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.5,
        "strokeOpacity": 0.5,
        "fillOpacity": 0.12,
        "highlightFillOpacity": 0.35,
        "preserveColorOnHighlight": true
      },
      "kind": "areaDecomposition",
      "refs": [
        "A",
        "B",
        "cuadrado-c",
        "sqC4"
      ],
      "properties": {
        "rows": 5,
        "columns": 5
      }
    },
    {
      "id": "areaA",
      "label": "área a²",
      "color": "salvia",
      "layerId": "anotaciones",
      "order": 30,
      "visible": true,
      "locked": false,
      "groupIds": [
        "cuadradoAGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "textOffset": [
          0.25,
          -0.35
        ],
        "preserveColorOnHighlight": true
      },
      "kind": "measurement",
      "refs": [
        "sqA3"
      ],
      "text": "a² = {value}",
      "properties": {
        "expression": "segBC.length^2",
        "unit": "u²",
        "precision": 1
      }
    },
    {
      "id": "areaB",
      "label": "área b²",
      "color": "terracota",
      "layerId": "anotaciones",
      "order": 31,
      "visible": true,
      "locked": false,
      "groupIds": [
        "cuadradoBGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "textOffset": [
          0.25,
          0.35
        ],
        "preserveColorOnHighlight": true
      },
      "kind": "measurement",
      "refs": [
        "cuadrado-b"
      ],
      "text": "b² = {value}",
      "properties": {
        "expression": "segCA.length^2",
        "unit": "u²",
        "precision": 1
      }
    },
    {
      "id": "areaC",
      "label": "área c²",
      "color": "ocre",
      "layerId": "anotaciones",
      "order": 32,
      "visible": true,
      "locked": false,
      "groupIds": [
        "cuadradoCGrupo"
      ],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "textOffset": [
          -1.75,
          0.35
        ],
        "preserveColorOnHighlight": true
      },
      "kind": "measurement",
      "refs": [
        "cuadrado-c"
      ],
      "text": "c² = {value}",
      "properties": {
        "expression": "segAB.length^2",
        "unit": "u²",
        "precision": 1
      }
    },
    {
      "id": "identidad",
      "label": "identidad de áreas",
      "color": "pizarra",
      "layerId": "anotaciones",
      "order": 33,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "textOffset": [
          -7.4,
          7.2
        ],
        "preserveColorOnHighlight": true
      },
      "kind": "infoPanel",
      "refs": [
        "C"
      ],
      "text": "a² + b² − c² = {value}",
      "properties": {
        "expression": "segBC.length^2+segCA.length^2-segAB.length^2",
        "unit": "u²",
        "precision": 2,
        "title": "Comprobación dinámica"
      }
    }
  ],
  "sliders": [],
  "steps": [
    {
      "id": "step1",
      "label": "Triángulo rectángulo",
      "description": "Se fijan los catetos y el ángulo recto.",
      "visibleTargets": [
        "A",
        "B",
        "C",
        "triangulo",
        "segBC",
        "segCA",
        "segAB",
        "anguloRecto"
      ],
      "durationMs": 900,
      "objectStates": {
        "triangulo": {
          "emphasis": "primary"
        },
        "anguloRecto": {
          "emphasis": "secondary"
        }
      }
    },
    {
      "id": "step2",
      "label": "Cuadrados y cuadrículas",
      "description": "Se construye un cuadrado cuadriculado sobre cada lado.",
      "visibleTargets": [
        "A",
        "B",
        "C",
        "triangulo",
        "segBC",
        "segCA",
        "segAB",
        "anguloRecto",
        "cuadradoA",
        "cuadradoB",
        "cuadradoC",
        "areaA",
        "areaB",
        "areaC"
      ],
      "durationMs": 1200,
      "objectStates": {
        "cuadradoA": {
          "emphasis": "secondary"
        },
        "cuadradoB": {
          "emphasis": "secondary"
        },
        "cuadradoC": {
          "emphasis": "primary"
        }
      }
    },
    {
      "id": "step3",
      "label": "Igualdad de áreas",
      "description": "Las áreas de los catetos suman el área de la hipotenusa.",
      "visibleTargets": [
        "A",
        "B",
        "C",
        "triangulo",
        "segBC",
        "segCA",
        "segAB",
        "anguloRecto",
        "cuadradoA",
        "cuadradoB",
        "cuadradoC",
        "areaA",
        "areaB",
        "areaC",
        "identidad"
      ],
      "durationMs": 1400,
      "objectStates": {
        "identidad": {
          "emphasis": "primary",
          "overlay": {
            "visible": true,
            "title": "Identidad pitagórica",
            "content": "a² + b² − c² = {value}",
            "expression": "segBC.length^2+segCA.length^2-segAB.length^2",
            "unit": "u²",
            "precision": 2,
            "position": "top-left"
          }
        }
      }
    }
  ],
  "constraints": [],
  "dependencies": [
    {
      "sourceId": "B",
      "targetId": "sqA3",
      "relation": "expression"
    },
    {
      "sourceId": "C",
      "targetId": "sqA3",
      "relation": "expression"
    },
    {
      "sourceId": "B",
      "targetId": "cuadrado-a",
      "relation": "expression"
    },
    {
      "sourceId": "A",
      "targetId": "cuadrado-b",
      "relation": "expression"
    },
    {
      "sourceId": "A",
      "targetId": "sqB4",
      "relation": "expression"
    },
    {
      "sourceId": "C",
      "targetId": "sqB4",
      "relation": "expression"
    },
    {
      "sourceId": "A",
      "targetId": "cuadrado-c",
      "relation": "expression"
    },
    {
      "sourceId": "B",
      "targetId": "cuadrado-c",
      "relation": "expression"
    },
    {
      "sourceId": "A",
      "targetId": "sqC4",
      "relation": "expression"
    },
    {
      "sourceId": "B",
      "targetId": "sqC4",
      "relation": "expression"
    },
    {
      "sourceId": "C",
      "targetId": "rayoX",
      "relation": "construction"
    },
    {
      "sourceId": "ejeX",
      "targetId": "rayoX",
      "relation": "construction"
    },
    {
      "sourceId": "C",
      "targetId": "rayoY",
      "relation": "construction"
    },
    {
      "sourceId": "ejeY",
      "targetId": "rayoY",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "triangulo",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "triangulo",
      "relation": "construction"
    },
    {
      "sourceId": "C",
      "targetId": "triangulo",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "segBC",
      "relation": "construction"
    },
    {
      "sourceId": "C",
      "targetId": "segBC",
      "relation": "construction"
    },
    {
      "sourceId": "C",
      "targetId": "segCA",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "segCA",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "segAB",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "segAB",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "anguloRecto",
      "relation": "construction"
    },
    {
      "sourceId": "C",
      "targetId": "anguloRecto",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "anguloRecto",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "cuadradoA",
      "relation": "construction"
    },
    {
      "sourceId": "C",
      "targetId": "cuadradoA",
      "relation": "construction"
    },
    {
      "sourceId": "sqA3",
      "targetId": "cuadradoA",
      "relation": "construction"
    },
    {
      "sourceId": "cuadrado-a",
      "targetId": "cuadradoA",
      "relation": "construction"
    },
    {
      "sourceId": "C",
      "targetId": "cuadradoB",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "cuadradoB",
      "relation": "construction"
    },
    {
      "sourceId": "cuadrado-b",
      "targetId": "cuadradoB",
      "relation": "construction"
    },
    {
      "sourceId": "sqB4",
      "targetId": "cuadradoB",
      "relation": "construction"
    },
    {
      "sourceId": "A",
      "targetId": "cuadradoC",
      "relation": "construction"
    },
    {
      "sourceId": "B",
      "targetId": "cuadradoC",
      "relation": "construction"
    },
    {
      "sourceId": "cuadrado-c",
      "targetId": "cuadradoC",
      "relation": "construction"
    },
    {
      "sourceId": "sqC4",
      "targetId": "cuadradoC",
      "relation": "construction"
    },
    {
      "sourceId": "sqA3",
      "targetId": "areaA",
      "relation": "construction"
    },
    {
      "sourceId": "cuadrado-b",
      "targetId": "areaB",
      "relation": "construction"
    },
    {
      "sourceId": "cuadrado-c",
      "targetId": "areaC",
      "relation": "construction"
    },
    {
      "sourceId": "C",
      "targetId": "identidad",
      "relation": "construction"
    },
    {
      "sourceId": "segBC",
      "targetId": "areaA",
      "relation": "expression"
    },
    {
      "sourceId": "segCA",
      "targetId": "areaB",
      "relation": "expression"
    },
    {
      "sourceId": "segAB",
      "targetId": "areaC",
      "relation": "expression"
    },
    {
      "sourceId": "segBC",
      "targetId": "identidad",
      "relation": "expression"
    },
    {
      "sourceId": "segCA",
      "targetId": "identidad",
      "relation": "expression"
    },
    {
      "sourceId": "segAB",
      "targetId": "identidad",
      "relation": "expression"
    }
  ],
  "note": "Arrastre A y B sobre las semirrectas: las áreas y la igualdad se actualizan sin perder el ángulo recto.",
  "extensions": {
    "acceptanceCase": "phase-5-pythagoras"
  }
}
);
/* @matematika-diagram-spec:end */

export const Pitagoras = () => <DiagramRenderer spec={PitagorasSpec} />;
