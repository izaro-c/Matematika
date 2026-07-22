import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const ModeloPoincareSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
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
  "objects": [
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0,
        "y": 0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 1,
        "y": 0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0.866,
        "y": 0.5
      },
      "mobility": {
        "type": "on-support",
        "support": "frontera"
      },
      "appearance": {
        "size": 5,
        "highlightSize": 7,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -0.866,
        "y": 0.5
      },
      "mobility": {
        "type": "on-support",
        "support": "frontera"
      },
      "appearance": {
        "size": 5,
        "highlightSize": 7,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
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
      "target": true,
      "targetId": "P",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0.4,
        "y": -0.25
      },
      "mobility": {
        "type": "constrained",
        "relationIds": [
          "pDentro"
        ]
      },
      "appearance": {
        "size": 6,
        "highlightSize": 8,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "cos(atan2(((L1.x*((P.x^2+P.y^2+1)/2)-P.x)/(max(abs(L1.x*P.y-L1.y*P.x),0.000001)*sign(L1.x*P.y-L1.y*P.x+0.0000001))),((P.y-L1.y*((P.x^2+P.y^2+1)/2))/(max(abs(L1.x*P.y-L1.y*P.x),0.000001)*sign(L1.x*P.y-L1.y*P.x+0.0000001))))*2-atan2(L1.y,L1.x))",
        "y": "sin(atan2(((L1.x*((P.x^2+P.y^2+1)/2)-P.x)/(max(abs(L1.x*P.y-L1.y*P.x),0.000001)*sign(L1.x*P.y-L1.y*P.x+0.0000001))),((P.y-L1.y*((P.x^2+P.y^2+1)/2))/(max(abs(L1.x*P.y-L1.y*P.x),0.000001)*sign(L1.x*P.y-L1.y*P.x+0.0000001))))*2-atan2(L1.y,L1.x))",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "cos(atan2(((L2.x*((P.x^2+P.y^2+1)/2)-P.x)/(max(abs(L2.x*P.y-L2.y*P.x),0.000001)*sign(L2.x*P.y-L2.y*P.x+0.0000001))),((P.y-L2.y*((P.x^2+P.y^2+1)/2))/(max(abs(L2.x*P.y-L2.y*P.x),0.000001)*sign(L2.x*P.y-L2.y*P.x+0.0000001))))*2-atan2(L2.y,L2.x))",
        "y": "sin(atan2(((L2.x*((P.x^2+P.y^2+1)/2)-P.x)/(max(abs(L2.x*P.y-L2.y*P.x),0.000001)*sign(L2.x*P.y-L2.y*P.x+0.0000001))),((P.y-L2.y*((P.x^2+P.y^2+1)/2))/(max(abs(L2.x*P.y-L2.y*P.x),0.000001)*sign(L2.x*P.y-L2.y*P.x+0.0000001))))*2-atan2(L2.y,L2.x))",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
    },
    {
      "id": "DA",
      "label": "delta angular",
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
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "atan2(sin(atan2(E2.y,E2.x)-atan2(L1.y,L1.x)),cos(atan2(E2.y,E2.x)-atan2(L1.y,L1.x)))",
        "y": "atan2(sin(atan2(L2.y,L2.x)-atan2(L1.y,L1.x)),cos(atan2(L2.y,L2.x)-atan2(L1.y,L1.x)))",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
    },
    {
      "id": "DS",
      "label": "delta segura",
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
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "DA.x-2*atan2(0,-1)*sign(DA.x)*max(sign(DA.x*DA.y),0)*max(sign(abs(DA.x)-abs(DA.y)),0)",
        "y": "0",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "cos(atan2(L1.y,L1.x)+0.2*DS.x)",
        "y": "sin(atan2(L1.y,L1.x)+0.2*DS.x)",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "cos(atan2(((U1.x*((P.x^2+P.y^2+1)/2)-P.x)/(max(abs(U1.x*P.y-U1.y*P.x),0.000001)*sign(U1.x*P.y-U1.y*P.x+0.0000001))),((P.y-U1.y*((P.x^2+P.y^2+1)/2))/(max(abs(U1.x*P.y-U1.y*P.x),0.000001)*sign(U1.x*P.y-U1.y*P.x+0.0000001))))*2-atan2(U1.y,U1.x))",
        "y": "sin(atan2(((U1.x*((P.x^2+P.y^2+1)/2)-P.x)/(max(abs(U1.x*P.y-U1.y*P.x),0.000001)*sign(U1.x*P.y-U1.y*P.x+0.0000001))),((P.y-U1.y*((P.x^2+P.y^2+1)/2))/(max(abs(U1.x*P.y-U1.y*P.x),0.000001)*sign(U1.x*P.y-U1.y*P.x+0.0000001))))*2-atan2(U1.y,U1.x))",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "cos(atan2(L1.y,L1.x)+0.4*DS.x)",
        "y": "sin(atan2(L1.y,L1.x)+0.4*DS.x)",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "cos(atan2(((U2.x*((P.x^2+P.y^2+1)/2)-P.x)/(max(abs(U2.x*P.y-U2.y*P.x),0.000001)*sign(U2.x*P.y-U2.y*P.x+0.0000001))),((P.y-U2.y*((P.x^2+P.y^2+1)/2))/(max(abs(U2.x*P.y-U2.y*P.x),0.000001)*sign(U2.x*P.y-U2.y*P.x+0.0000001))))*2-atan2(U2.y,U2.x))",
        "y": "sin(atan2(((U2.x*((P.x^2+P.y^2+1)/2)-P.x)/(max(abs(U2.x*P.y-U2.y*P.x),0.000001)*sign(U2.x*P.y-U2.y*P.x+0.0000001))),((P.y-U2.y*((P.x^2+P.y^2+1)/2))/(max(abs(U2.x*P.y-U2.y*P.x),0.000001)*sign(U2.x*P.y-U2.y*P.x+0.0000001))))*2-atan2(U2.y,U2.x))",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "cos(atan2(L1.y,L1.x)+0.6*DS.x)",
        "y": "sin(atan2(L1.y,L1.x)+0.6*DS.x)",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "cos(atan2(((U3.x*((P.x^2+P.y^2+1)/2)-P.x)/(max(abs(U3.x*P.y-U3.y*P.x),0.000001)*sign(U3.x*P.y-U3.y*P.x+0.0000001))),((P.y-U3.y*((P.x^2+P.y^2+1)/2))/(max(abs(U3.x*P.y-U3.y*P.x),0.000001)*sign(U3.x*P.y-U3.y*P.x+0.0000001))))*2-atan2(U3.y,U3.x))",
        "y": "sin(atan2(((U3.x*((P.x^2+P.y^2+1)/2)-P.x)/(max(abs(U3.x*P.y-U3.y*P.x),0.000001)*sign(U3.x*P.y-U3.y*P.x+0.0000001))),((P.y-U3.y*((P.x^2+P.y^2+1)/2))/(max(abs(U3.x*P.y-U3.y*P.x),0.000001)*sign(U3.x*P.y-U3.y*P.x+0.0000001))))*2-atan2(U3.y,U3.x))",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "cos(atan2(L1.y,L1.x)+0.8*DS.x)",
        "y": "sin(atan2(L1.y,L1.x)+0.8*DS.x)",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
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
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "cos(atan2(((U4.x*((P.x^2+P.y^2+1)/2)-P.x)/(max(abs(U4.x*P.y-U4.y*P.x),0.000001)*sign(U4.x*P.y-U4.y*P.x+0.0000001))),((P.y-U4.y*((P.x^2+P.y^2+1)/2))/(max(abs(U4.x*P.y-U4.y*P.x),0.000001)*sign(U4.x*P.y-U4.y*P.x+0.0000001))))*2-atan2(U4.y,U4.x))",
        "y": "sin(atan2(((U4.x*((P.x^2+P.y^2+1)/2)-P.x)/(max(abs(U4.x*P.y-U4.y*P.x),0.000001)*sign(U4.x*P.y-U4.y*P.x+0.0000001))),((P.y-U4.y*((P.x^2+P.y^2+1)/2))/(max(abs(U4.x*P.y-U4.y*P.x),0.000001)*sign(U4.x*P.y-U4.y*P.x+0.0000001))))*2-atan2(U4.y,U4.x))",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
    },
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
      "target": true,
      "targetId": "frontera",
      "objectType": "path",
      "geometry": {
        "type": "circle",
        "center": "O",
        "point": "R"
      },
      "appearance": {
        "strokeWidth": 2.5,
        "fillOpacity": 0.04,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "poincare-geodesic",
        "refs": [
          "O",
          "R",
          "L1",
          "L2"
        ]
      },
      "appearance": {
        "strokeWidth": 3,
        "highlightStrokeWidth": 5,
        "preserveColorOnHighlight": true
      }
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
      "target": true,
      "targetId": "limite1",
      "objectType": "path",
      "geometry": {
        "type": "poincare-geodesic",
        "refs": [
          "O",
          "R",
          "L1",
          "P"
        ]
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2.5,
        "highlightStrokeWidth": 4,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "poincare-geodesic",
        "refs": [
          "O",
          "R",
          "L2",
          "P"
        ]
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2.5,
        "highlightStrokeWidth": 4,
        "preserveColorOnHighlight": true
      }
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
      "target": true,
      "targetId": "ultra1",
      "objectType": "path",
      "geometry": {
        "type": "poincare-geodesic",
        "refs": [
          "O",
          "R",
          "U1",
          "V1"
        ]
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2,
        "strokeOpacity": 0.9,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "poincare-geodesic",
        "refs": [
          "O",
          "R",
          "U2",
          "V2"
        ]
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2,
        "strokeOpacity": 0.9,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "poincare-geodesic",
        "refs": [
          "O",
          "R",
          "U3",
          "V3"
        ]
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2,
        "strokeOpacity": 0.9,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "path",
      "geometry": {
        "type": "poincare-geodesic",
        "refs": [
          "O",
          "R",
          "U4",
          "V4"
        ]
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2,
        "strokeOpacity": 0.9,
        "preserveColorOnHighlight": true
      }
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
      "objectType": "annotation",
      "variant": "measurement",
      "content": {
        "text": "|P| = {value}",
        "expression": "hypot(P.x,P.y)",
        "precision": 2
      },
      "anchor": {
        "type": "object",
        "object": "P",
        "offset": [
          -1.25,
          1.25
        ]
      },
      "measurement": {
        "refs": [
          "P"
        ],
        "mode": "value"
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [
    {
      "id": "pDentro",
      "label": "P permanece dentro del disco abierto",
      "enabled": true,
      "type": "inside-disk",
      "point": "P",
      "disk": {
        "center": "O",
        "boundary": "R"
      }
    }
  ],
  "steps": [],
  "note": "Arrastre L₁ y L₂ sobre la frontera y P dentro del disco"
}
);
/* @matematika-diagram-spec:end */

export const ModeloPoincare = () => <DiagramRenderer spec={ModeloPoincareSpec} />;
