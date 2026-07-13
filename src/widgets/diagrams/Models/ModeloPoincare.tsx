import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const ModeloPoincareSpec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Disco de Poincaré",
  "componentId": "ModeloPoincare",
  "category": "Models",
  "mode": "diagram",
  "axis": false,
  "grid": false,
  "viewport": {
    "bounds": [
      -1.18,
      1.18,
      1.18,
      -1.18
    ],
    "home": [
      -1.18,
      1.18,
      1.18,
      -1.18
    ],
    "minZoom": 0.85,
    "maxZoom": 6,
    "padding": 0.08
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
      "id": "disco",
      "label": "Disco",
      "order": 1,
      "visible": true,
      "locked": false
    },
    {
      "id": "geodesicas",
      "label": "Geodésicas",
      "order": 2,
      "visible": true,
      "locked": false
    },
    {
      "id": "puntos",
      "label": "Puntos móviles",
      "order": 3,
      "visible": true,
      "locked": false
    },
    {
      "id": "anotaciones",
      "label": "Medidas",
      "order": 4,
      "visible": true,
      "locked": false
    }
  ],
  "groups": [],
  "points": [
    {
      "id": "O",
      "label": "centro",
      "color": "carbon",
      "layerId": "disco",
      "order": 1,
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
      "constraint": "fixed"
    },
    {
      "id": "R",
      "label": "frontera",
      "color": "carbon",
      "layerId": "disco",
      "order": 2,
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
      "id": "L1",
      "label": "L₁",
      "color": "terracota",
      "layerId": "puntos",
      "order": 10,
      "visible": true,
      "locked": false,
      "groupIds": [],
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
      "x": 0.866,
      "y": 0.5,
      "fixed": false,
      "constraint": "glider",
      "gliderTarget": "frontera"
    },
    {
      "id": "L2",
      "label": "L₂",
      "color": "terracota",
      "layerId": "puntos",
      "order": 11,
      "visible": true,
      "locked": false,
      "groupIds": [],
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
      "x": -0.866,
      "y": 0.5,
      "fixed": false,
      "constraint": "glider",
      "gliderTarget": "frontera"
    },
    {
      "id": "P",
      "label": "P",
      "color": "terracota",
      "layerId": "puntos",
      "order": 12,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "primary"
      },
      "target": false,
      "style": {
        "pointSize": 6,
        "highlightPointSize": 8,
        "preserveColorOnHighlight": true
      },
      "x": 0.4,
      "y": -0.25,
      "fixed": false,
      "constraint": "constrained",
      "constraintIds": [
        "pDentro"
      ]
    },
    {
      "id": "E1",
      "label": "E1",
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
        "L1",
        "P"
      ],
      "xExpression": "cos(atan2(((L1.x*((P.x^2+P.y^2+1)/2)-P.x)/(max(abs(L1.x*P.y-L1.y*P.x),0.000001)*sign(L1.x*P.y-L1.y*P.x+0.0000001))),((P.y-L1.y*((P.x^2+P.y^2+1)/2))/(max(abs(L1.x*P.y-L1.y*P.x),0.000001)*sign(L1.x*P.y-L1.y*P.x+0.0000001))))*2-atan2(L1.y,L1.x))",
      "yExpression": "sin(atan2(((L1.x*((P.x^2+P.y^2+1)/2)-P.x)/(max(abs(L1.x*P.y-L1.y*P.x),0.000001)*sign(L1.x*P.y-L1.y*P.x+0.0000001))),((P.y-L1.y*((P.x^2+P.y^2+1)/2))/(max(abs(L1.x*P.y-L1.y*P.x),0.000001)*sign(L1.x*P.y-L1.y*P.x+0.0000001))))*2-atan2(L1.y,L1.x))"
    },
    {
      "id": "E2",
      "label": "E2",
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
        "L2",
        "P"
      ],
      "xExpression": "cos(atan2(((L2.x*((P.x^2+P.y^2+1)/2)-P.x)/(max(abs(L2.x*P.y-L2.y*P.x),0.000001)*sign(L2.x*P.y-L2.y*P.x+0.0000001))),((P.y-L2.y*((P.x^2+P.y^2+1)/2))/(max(abs(L2.x*P.y-L2.y*P.x),0.000001)*sign(L2.x*P.y-L2.y*P.x+0.0000001))))*2-atan2(L2.y,L2.x))",
      "yExpression": "sin(atan2(((L2.x*((P.x^2+P.y^2+1)/2)-P.x)/(max(abs(L2.x*P.y-L2.y*P.x),0.000001)*sign(L2.x*P.y-L2.y*P.x+0.0000001))),((P.y-L2.y*((P.x^2+P.y^2+1)/2))/(max(abs(L2.x*P.y-L2.y*P.x),0.000001)*sign(L2.x*P.y-L2.y*P.x+0.0000001))))*2-atan2(L2.y,L2.x))"
    },
    {
      "id": "U1",
      "label": "U1",
      "color": "carbon",
      "layerId": "construccion",
      "order": 31,
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
        "L1",
        "E1"
      ],
      "xExpression": "cos((atan2(L1.y,L1.x)+0.2*atan2(sin(atan2(E1.y,E1.x)-atan2(L1.y,L1.x)),cos(atan2(E1.y,E1.x)-atan2(L1.y,L1.x)))))",
      "yExpression": "sin((atan2(L1.y,L1.x)+0.2*atan2(sin(atan2(E1.y,E1.x)-atan2(L1.y,L1.x)),cos(atan2(E1.y,E1.x)-atan2(L1.y,L1.x)))))"
    },
    {
      "id": "V1",
      "label": "V1",
      "color": "carbon",
      "layerId": "construccion",
      "order": 41,
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
        "U1",
        "P"
      ],
      "xExpression": "cos(atan2(((U1.x*((P.x^2+P.y^2+1)/2)-P.x)/(max(abs(U1.x*P.y-U1.y*P.x),0.000001)*sign(U1.x*P.y-U1.y*P.x+0.0000001))),((P.y-U1.y*((P.x^2+P.y^2+1)/2))/(max(abs(U1.x*P.y-U1.y*P.x),0.000001)*sign(U1.x*P.y-U1.y*P.x+0.0000001))))*2-atan2(U1.y,U1.x))",
      "yExpression": "sin(atan2(((U1.x*((P.x^2+P.y^2+1)/2)-P.x)/(max(abs(U1.x*P.y-U1.y*P.x),0.000001)*sign(U1.x*P.y-U1.y*P.x+0.0000001))),((P.y-U1.y*((P.x^2+P.y^2+1)/2))/(max(abs(U1.x*P.y-U1.y*P.x),0.000001)*sign(U1.x*P.y-U1.y*P.x+0.0000001))))*2-atan2(U1.y,U1.x))"
    },
    {
      "id": "U2",
      "label": "U2",
      "color": "carbon",
      "layerId": "construccion",
      "order": 32,
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
        "L1",
        "E1"
      ],
      "xExpression": "cos((atan2(L1.y,L1.x)+0.4*atan2(sin(atan2(E1.y,E1.x)-atan2(L1.y,L1.x)),cos(atan2(E1.y,E1.x)-atan2(L1.y,L1.x)))))",
      "yExpression": "sin((atan2(L1.y,L1.x)+0.4*atan2(sin(atan2(E1.y,E1.x)-atan2(L1.y,L1.x)),cos(atan2(E1.y,E1.x)-atan2(L1.y,L1.x)))))"
    },
    {
      "id": "V2",
      "label": "V2",
      "color": "carbon",
      "layerId": "construccion",
      "order": 42,
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
        "U2",
        "P"
      ],
      "xExpression": "cos(atan2(((U2.x*((P.x^2+P.y^2+1)/2)-P.x)/(max(abs(U2.x*P.y-U2.y*P.x),0.000001)*sign(U2.x*P.y-U2.y*P.x+0.0000001))),((P.y-U2.y*((P.x^2+P.y^2+1)/2))/(max(abs(U2.x*P.y-U2.y*P.x),0.000001)*sign(U2.x*P.y-U2.y*P.x+0.0000001))))*2-atan2(U2.y,U2.x))",
      "yExpression": "sin(atan2(((U2.x*((P.x^2+P.y^2+1)/2)-P.x)/(max(abs(U2.x*P.y-U2.y*P.x),0.000001)*sign(U2.x*P.y-U2.y*P.x+0.0000001))),((P.y-U2.y*((P.x^2+P.y^2+1)/2))/(max(abs(U2.x*P.y-U2.y*P.x),0.000001)*sign(U2.x*P.y-U2.y*P.x+0.0000001))))*2-atan2(U2.y,U2.x))"
    },
    {
      "id": "U3",
      "label": "U3",
      "color": "carbon",
      "layerId": "construccion",
      "order": 33,
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
        "L1",
        "E1"
      ],
      "xExpression": "cos((atan2(L1.y,L1.x)+0.6*atan2(sin(atan2(E1.y,E1.x)-atan2(L1.y,L1.x)),cos(atan2(E1.y,E1.x)-atan2(L1.y,L1.x)))))",
      "yExpression": "sin((atan2(L1.y,L1.x)+0.6*atan2(sin(atan2(E1.y,E1.x)-atan2(L1.y,L1.x)),cos(atan2(E1.y,E1.x)-atan2(L1.y,L1.x)))))"
    },
    {
      "id": "V3",
      "label": "V3",
      "color": "carbon",
      "layerId": "construccion",
      "order": 43,
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
        "U3",
        "P"
      ],
      "xExpression": "cos(atan2(((U3.x*((P.x^2+P.y^2+1)/2)-P.x)/(max(abs(U3.x*P.y-U3.y*P.x),0.000001)*sign(U3.x*P.y-U3.y*P.x+0.0000001))),((P.y-U3.y*((P.x^2+P.y^2+1)/2))/(max(abs(U3.x*P.y-U3.y*P.x),0.000001)*sign(U3.x*P.y-U3.y*P.x+0.0000001))))*2-atan2(U3.y,U3.x))",
      "yExpression": "sin(atan2(((U3.x*((P.x^2+P.y^2+1)/2)-P.x)/(max(abs(U3.x*P.y-U3.y*P.x),0.000001)*sign(U3.x*P.y-U3.y*P.x+0.0000001))),((P.y-U3.y*((P.x^2+P.y^2+1)/2))/(max(abs(U3.x*P.y-U3.y*P.x),0.000001)*sign(U3.x*P.y-U3.y*P.x+0.0000001))))*2-atan2(U3.y,U3.x))"
    },
    {
      "id": "U4",
      "label": "U4",
      "color": "carbon",
      "layerId": "construccion",
      "order": 34,
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
        "L1",
        "E1"
      ],
      "xExpression": "cos((atan2(L1.y,L1.x)+0.8*atan2(sin(atan2(E1.y,E1.x)-atan2(L1.y,L1.x)),cos(atan2(E1.y,E1.x)-atan2(L1.y,L1.x)))))",
      "yExpression": "sin((atan2(L1.y,L1.x)+0.8*atan2(sin(atan2(E1.y,E1.x)-atan2(L1.y,L1.x)),cos(atan2(E1.y,E1.x)-atan2(L1.y,L1.x)))))"
    },
    {
      "id": "V4",
      "label": "V4",
      "color": "carbon",
      "layerId": "construccion",
      "order": 44,
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
        "U4",
        "P"
      ],
      "xExpression": "cos(atan2(((U4.x*((P.x^2+P.y^2+1)/2)-P.x)/(max(abs(U4.x*P.y-U4.y*P.x),0.000001)*sign(U4.x*P.y-U4.y*P.x+0.0000001))),((P.y-U4.y*((P.x^2+P.y^2+1)/2))/(max(abs(U4.x*P.y-U4.y*P.x),0.000001)*sign(U4.x*P.y-U4.y*P.x+0.0000001))))*2-atan2(U4.y,U4.x))",
      "yExpression": "sin(atan2(((U4.x*((P.x^2+P.y^2+1)/2)-P.x)/(max(abs(U4.x*P.y-U4.y*P.x),0.000001)*sign(U4.x*P.y-U4.y*P.x+0.0000001))),((P.y-U4.y*((P.x^2+P.y^2+1)/2))/(max(abs(U4.x*P.y-U4.y*P.x),0.000001)*sign(U4.x*P.y-U4.y*P.x+0.0000001))))*2-atan2(U4.y,U4.x))"
    }
  ],
  "elements": [
    {
      "id": "frontera",
      "label": "horizonte absoluto",
      "color": "carbon",
      "layerId": "disco",
      "order": 1,
      "visible": true,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.5,
        "fillOpacity": 0.04,
        "preserveColorOnHighlight": true
      },
      "kind": "circle",
      "refs": [
        "O",
        "R"
      ]
    },
    {
      "id": "geodesicaL",
      "label": "recta hiperbólica l",
      "color": "terracota",
      "layerId": "geodesicas",
      "order": 10,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": true,
      "targetId": "geodesica-principal",
      "style": {
        "strokeWidth": 3,
        "highlightStrokeWidth": 5,
        "preserveColorOnHighlight": true
      },
      "kind": "poincareGeodesic",
      "refs": [
        "O",
        "R",
        "L1",
        "L2"
      ]
    },
    {
      "id": "limite1",
      "label": "paralela límite por L₁",
      "color": "ocre",
      "layerId": "geodesicas",
      "order": 11,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.5,
        "highlightStrokeWidth": 4,
        "preserveColorOnHighlight": true
      },
      "kind": "poincareGeodesic",
      "refs": [
        "O",
        "R",
        "L1",
        "P"
      ],
      "dashed": true
    },
    {
      "id": "limite2",
      "label": "paralela límite por L₂",
      "color": "ocre",
      "layerId": "geodesicas",
      "order": 12,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2.5,
        "highlightStrokeWidth": 4,
        "preserveColorOnHighlight": true
      },
      "kind": "poincareGeodesic",
      "refs": [
        "O",
        "R",
        "L2",
        "P"
      ],
      "dashed": true
    },
    {
      "id": "ultra1",
      "label": "ultraparalela 1",
      "color": "salvia",
      "layerId": "geodesicas",
      "order": 21,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2,
        "strokeOpacity": 0.9,
        "preserveColorOnHighlight": true
      },
      "kind": "poincareGeodesic",
      "refs": [
        "O",
        "R",
        "U1",
        "V1"
      ],
      "dashed": true
    },
    {
      "id": "ultra2",
      "label": "ultraparalela 2",
      "color": "salvia",
      "layerId": "geodesicas",
      "order": 22,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2,
        "strokeOpacity": 0.9,
        "preserveColorOnHighlight": true
      },
      "kind": "poincareGeodesic",
      "refs": [
        "O",
        "R",
        "U2",
        "V2"
      ],
      "dashed": true
    },
    {
      "id": "ultra3",
      "label": "ultraparalela 3",
      "color": "salvia",
      "layerId": "geodesicas",
      "order": 23,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2,
        "strokeOpacity": 0.9,
        "preserveColorOnHighlight": true
      },
      "kind": "poincareGeodesic",
      "refs": [
        "O",
        "R",
        "U3",
        "V3"
      ],
      "dashed": true
    },
    {
      "id": "ultra4",
      "label": "ultraparalela 4",
      "color": "salvia",
      "layerId": "geodesicas",
      "order": 24,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "role": "secondary"
      },
      "target": false,
      "style": {
        "strokeWidth": 2,
        "strokeOpacity": 0.9,
        "preserveColorOnHighlight": true
      },
      "kind": "poincareGeodesic",
      "refs": [
        "O",
        "R",
        "U4",
        "V4"
      ],
      "dashed": true
    },
    {
      "id": "radioP",
      "label": "distancia euclídea de P al centro",
      "color": "pizarra",
      "layerId": "anotaciones",
      "order": 30,
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
          -1.25,
          1.25
        ],
        "preserveColorOnHighlight": true
      },
      "kind": "measurement",
      "refs": [
        "P"
      ],
      "text": "|P| = {value}",
      "properties": {
        "expression": "hypot(P.x,P.y)",
        "precision": 2
      }
    }
  ],
  "sliders": [],
  "steps": [],
  "constraints": [
    {
      "id": "pDentro",
      "label": "P permanece dentro del disco abierto",
      "kind": "insideDisk",
      "refs": [
        "P",
        "O",
        "R"
      ],
      "enabled": true
    }
  ],
  "dependencies": [
    {
      "sourceId": "L1",
      "targetId": "E1",
      "relation": "expression"
    },
    {
      "sourceId": "P",
      "targetId": "E1",
      "relation": "expression"
    },
    {
      "sourceId": "L2",
      "targetId": "E2",
      "relation": "expression"
    },
    {
      "sourceId": "P",
      "targetId": "E2",
      "relation": "expression"
    },
    {
      "sourceId": "L1",
      "targetId": "U1",
      "relation": "expression"
    },
    {
      "sourceId": "E1",
      "targetId": "U1",
      "relation": "expression"
    },
    {
      "sourceId": "U1",
      "targetId": "V1",
      "relation": "expression"
    },
    {
      "sourceId": "P",
      "targetId": "V1",
      "relation": "expression"
    },
    {
      "sourceId": "L1",
      "targetId": "U2",
      "relation": "expression"
    },
    {
      "sourceId": "E1",
      "targetId": "U2",
      "relation": "expression"
    },
    {
      "sourceId": "U2",
      "targetId": "V2",
      "relation": "expression"
    },
    {
      "sourceId": "P",
      "targetId": "V2",
      "relation": "expression"
    },
    {
      "sourceId": "L1",
      "targetId": "U3",
      "relation": "expression"
    },
    {
      "sourceId": "E1",
      "targetId": "U3",
      "relation": "expression"
    },
    {
      "sourceId": "U3",
      "targetId": "V3",
      "relation": "expression"
    },
    {
      "sourceId": "P",
      "targetId": "V3",
      "relation": "expression"
    },
    {
      "sourceId": "L1",
      "targetId": "U4",
      "relation": "expression"
    },
    {
      "sourceId": "E1",
      "targetId": "U4",
      "relation": "expression"
    },
    {
      "sourceId": "U4",
      "targetId": "V4",
      "relation": "expression"
    },
    {
      "sourceId": "P",
      "targetId": "V4",
      "relation": "expression"
    },
    {
      "sourceId": "O",
      "targetId": "frontera",
      "relation": "construction"
    },
    {
      "sourceId": "R",
      "targetId": "frontera",
      "relation": "construction"
    },
    {
      "sourceId": "O",
      "targetId": "geodesicaL",
      "relation": "construction"
    },
    {
      "sourceId": "R",
      "targetId": "geodesicaL",
      "relation": "construction"
    },
    {
      "sourceId": "L1",
      "targetId": "geodesicaL",
      "relation": "construction"
    },
    {
      "sourceId": "L2",
      "targetId": "geodesicaL",
      "relation": "construction"
    },
    {
      "sourceId": "O",
      "targetId": "limite1",
      "relation": "construction"
    },
    {
      "sourceId": "R",
      "targetId": "limite1",
      "relation": "construction"
    },
    {
      "sourceId": "L1",
      "targetId": "limite1",
      "relation": "construction"
    },
    {
      "sourceId": "P",
      "targetId": "limite1",
      "relation": "construction"
    },
    {
      "sourceId": "O",
      "targetId": "limite2",
      "relation": "construction"
    },
    {
      "sourceId": "R",
      "targetId": "limite2",
      "relation": "construction"
    },
    {
      "sourceId": "L2",
      "targetId": "limite2",
      "relation": "construction"
    },
    {
      "sourceId": "P",
      "targetId": "limite2",
      "relation": "construction"
    },
    {
      "sourceId": "O",
      "targetId": "ultra1",
      "relation": "construction"
    },
    {
      "sourceId": "R",
      "targetId": "ultra1",
      "relation": "construction"
    },
    {
      "sourceId": "U1",
      "targetId": "ultra1",
      "relation": "construction"
    },
    {
      "sourceId": "V1",
      "targetId": "ultra1",
      "relation": "construction"
    },
    {
      "sourceId": "O",
      "targetId": "ultra2",
      "relation": "construction"
    },
    {
      "sourceId": "R",
      "targetId": "ultra2",
      "relation": "construction"
    },
    {
      "sourceId": "U2",
      "targetId": "ultra2",
      "relation": "construction"
    },
    {
      "sourceId": "V2",
      "targetId": "ultra2",
      "relation": "construction"
    },
    {
      "sourceId": "O",
      "targetId": "ultra3",
      "relation": "construction"
    },
    {
      "sourceId": "R",
      "targetId": "ultra3",
      "relation": "construction"
    },
    {
      "sourceId": "U3",
      "targetId": "ultra3",
      "relation": "construction"
    },
    {
      "sourceId": "V3",
      "targetId": "ultra3",
      "relation": "construction"
    },
    {
      "sourceId": "O",
      "targetId": "ultra4",
      "relation": "construction"
    },
    {
      "sourceId": "R",
      "targetId": "ultra4",
      "relation": "construction"
    },
    {
      "sourceId": "U4",
      "targetId": "ultra4",
      "relation": "construction"
    },
    {
      "sourceId": "V4",
      "targetId": "ultra4",
      "relation": "construction"
    },
    {
      "sourceId": "P",
      "targetId": "radioP",
      "relation": "construction"
    },
    {
      "sourceId": "P",
      "targetId": "radioP",
      "relation": "expression"
    },
    {
      "sourceId": "O",
      "targetId": "P",
      "relation": "constraint",
      "constraintId": "pDentro"
    },
    {
      "sourceId": "R",
      "targetId": "P",
      "relation": "constraint",
      "constraintId": "pDentro"
    }
  ],
  "note": "Arrastre L₁ y L₂ sobre la frontera y P dentro del disco. Terracota: recta l; ocre: paralelas límite; salvia: ultraparalelas.",
  "extensions": {
    "acceptanceCase": "phase-5-poincare",
    "mathematicalInvariant": "Las geodésicas son diámetros o arcos ortogonales a la frontera."
  }
}
);
/* @matematika-diagram-spec:end */

export const ModeloPoincare = () => <DiagramRenderer spec={ModeloPoincareSpec} />;
