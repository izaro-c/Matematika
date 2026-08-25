import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const DemoInvarianciaTriangulacionSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Invarianza de la triangulación",
  "componentId": "demo-invariancia-triangulacion",
  "category": "Demos",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "showLabels": true,
  "viewport": {
    "bounds": [-1, 5, 6, -1],
    "home": [-1, 5, 6, -1],
    "minZoom": 0.2,
    "maxZoom": 10,
    "padding": 0.16
  },
  "layers": [
    { "id": "geometry", "label": "Geometría", "order": 0, "visible": true, "locked": false },
    { "id": "annotations", "label": "Anotaciones", "order": 1, "visible": true, "locked": false }
  ],
  "groups": [],
  "objects": [
    {
      "id": "pA",
      "label": "A",
      "color": "carbon",
      "layerId": "geometry",
      "order": 30,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Punto A", "role": "primary" },
      "target": true,
      "targetId": "pA",
      "objectType": "point",
      "definition": { "type": "coordinates", "x": 0, "y": 0 },
      "mobility": { "type": "free" },
      "appearance": { "size": 6, "labelVisible": true, "preserveColorOnHighlight": true }
    },
    {
      "id": "pB",
      "label": "B",
      "color": "carbon",
      "layerId": "geometry",
      "order": 31,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Punto B", "role": "primary" },
      "target": true,
      "targetId": "pB",
      "objectType": "point",
      "definition": { "type": "coordinates", "x": 4, "y": 0 },
      "mobility": { "type": "free" },
      "appearance": { "size": 6, "labelVisible": true, "preserveColorOnHighlight": true }
    },
    {
      "id": "pC",
      "label": "C",
      "color": "carbon",
      "layerId": "geometry",
      "order": 32,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Punto C", "role": "primary" },
      "target": true,
      "targetId": "pC",
      "objectType": "point",
      "definition": { "type": "coordinates", "x": 5, "y": 3 },
      "mobility": { "type": "free" },
      "appearance": { "size": 6, "labelVisible": true, "preserveColorOnHighlight": true }
    },
    {
      "id": "pD",
      "label": "D",
      "color": "carbon",
      "layerId": "geometry",
      "order": 33,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Punto D", "role": "primary" },
      "target": true,
      "targetId": "pD",
      "objectType": "point",
      "definition": { "type": "coordinates", "x": 2, "y": 4 },
      "mobility": { "type": "free" },
      "appearance": { "size": 6, "labelVisible": true, "preserveColorOnHighlight": true }
    },
    {
      "id": "polyABCD",
      "label": "Polígono ABCD",
      "color": "carbon",
      "layerId": "geometry",
      "order": 5,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Polígono exterior ABCD", "role": "primary" },
      "target": true,
      "targetId": "polyABCD",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": ["pA", "pB", "pC", "pD"]
      },
      "appearance": { "fillOpacity": 0.08, "strokeWidth": 2.5, "preserveColorOnHighlight": true }
    },
    {
      "id": "segAC",
      "label": "Diagonal AC",
      "color": "terracota",
      "layerId": "geometry",
      "order": 10,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Diagonal AC (Triangulación T1)", "role": "secondary" },
      "target": true,
      "targetId": "segAC",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": ["pA", "pC"]
      },
      "appearance": { "dashed": true, "strokeWidth": 2, "preserveColorOnHighlight": true }
    },
    {
      "id": "segBD",
      "label": "Diagonal BD",
      "color": "canela",
      "layerId": "geometry",
      "order": 11,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Diagonal BD (Triangulación T2)", "role": "secondary" },
      "target": true,
      "targetId": "segBD",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": ["pB", "pD"]
      },
      "appearance": { "dashed": true, "strokeWidth": 2, "preserveColorOnHighlight": true }
    },
    {
      "id": "polyABC",
      "label": "Triángulo ABC",
      "color": "terracota",
      "layerId": "geometry",
      "order": 6,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Triángulo ABC", "role": "secondary" },
      "target": true,
      "targetId": "polyABC",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": ["pA", "pB", "pC"]
      },
      "appearance": { "fillOpacity": 0.1, "strokeWidth": 1, "preserveColorOnHighlight": true }
    },
    {
      "id": "polyACD",
      "label": "Triángulo ACD",
      "color": "terracota",
      "layerId": "geometry",
      "order": 7,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Triángulo ACD", "role": "secondary" },
      "target": true,
      "targetId": "polyACD",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": ["pA", "pC", "pD"]
      },
      "appearance": { "fillOpacity": 0.1, "strokeWidth": 1, "preserveColorOnHighlight": true }
    },
    {
      "id": "polyABD",
      "label": "Triángulo ABD",
      "color": "canela",
      "layerId": "geometry",
      "order": 8,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Triángulo ABD", "role": "secondary" },
      "target": true,
      "targetId": "polyABD",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": ["pA", "pB", "pD"]
      },
      "appearance": { "fillOpacity": 0.1, "strokeWidth": 1, "preserveColorOnHighlight": true }
    },
    {
      "id": "polyBCD",
      "label": "Triángulo BCD",
      "color": "canela",
      "layerId": "geometry",
      "order": 9,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Triángulo BCD", "role": "secondary" },
      "target": true,
      "targetId": "polyBCD",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": ["pB", "pC", "pD"]
      },
      "appearance": { "fillOpacity": 0.1, "strokeWidth": 1, "preserveColorOnHighlight": true }
    },
    {
      "id": "pInter",
      "label": "P*",
      "color": "mora",
      "layerId": "geometry",
      "order": 40,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Punto de intersección de las diagonales", "role": "primary" },
      "target": true,
      "targetId": "pInter",
      "objectType": "point",
      "definition": {
        "type": "intersection",
        "supports": ["segAC", "segBD"]
      },
      "mobility": { "type": "fixed" },
      "appearance": { "size": 6, "labelVisible": true, "preserveColorOnHighlight": true }
    }
  ],
  "relations": [],
  "steps": [
    {
      "id": "step1",
      "label": "Triangulación T1",
      "description": "Primera triangulación del polígono mediante la diagonal AC.",
      "visibleTargets": ["segAC", "polyABC", "polyACD", "polyABCD"],
      "durationMs": 1000,
      "objectStates": {
        "segAC": { "visible": true, "emphasis": "primary" },
        "segBD": { "visible": false },
        "polyABC": { "visible": true, "emphasis": "secondary" },
        "polyACD": { "visible": true, "emphasis": "secondary" },
        "polyABD": { "visible": false },
        "polyBCD": { "visible": false },
        "pInter": { "visible": false }
      }
    },
    {
      "id": "step2",
      "label": "Triangulación T2",
      "description": "Segunda triangulación alternativa mediante la diagonal BD.",
      "visibleTargets": ["segBD", "polyABD", "polyBCD", "polyABCD"],
      "durationMs": 1000,
      "objectStates": {
        "segAC": { "visible": false },
        "segBD": { "visible": true, "emphasis": "primary" },
        "polyABC": { "visible": false },
        "polyACD": { "visible": false },
        "polyABD": { "visible": true, "emphasis": "secondary" },
        "polyBCD": { "visible": true, "emphasis": "secondary" },
        "pInter": { "visible": false }
      }
    },
    {
      "id": "step3",
      "label": "Superposición (Refinamiento común T*)",
      "description": "La superposición de ambas triangulaciones produce un refinamiento común T* con el mismo valor total de área.",
      "visibleTargets": ["segAC", "segBD", "pInter", "polyABCD"],
      "durationMs": 1000,
      "objectStates": {
        "segAC": { "visible": true },
        "segBD": { "visible": true },
        "polyABC": { "visible": true },
        "polyACD": { "visible": true },
        "polyABD": { "visible": true },
        "polyBCD": { "visible": true },
        "pInter": { "visible": true, "emphasis": "primary" }
      }
    }
  ],
  "note": "Mueve los vértices A, B, C o D para modificar el polígono.",
  "translations": {
    "eu": {
      "title": "Triangelatzearen aldaezintasuna",
      "note": "Mugitu A, B, C edo D erpinak poligonoa aldatzeko.",
      "steps": {
        "step1": {
          "label": "T1 Triangelatzea",
          "description": "Poligonoaren lehen triangelatzea AC diagonalaren bidez."
        },
        "step2": {
          "label": "T2 Triangelatzea",
          "description": "Beste triangelatze bat BD diagonalaren bidez."
        },
        "step3": {
          "label": "Gainezartzea (T* birfindetze komuna)",
          "description": "Bi triangelatzeen superposizioak T* birfindetze komuna sortzen du, azalera bera babestuz."
        }
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const DemoInvarianciaTriangulacion = () => (
  <DiagramRenderer spec={DemoInvarianciaTriangulacionSpec} />
);
