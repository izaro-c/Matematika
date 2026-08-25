import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const DemoTalesSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Teorema de Tales",
  "componentId": "demo-tales",
  "category": "Demos",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "showLabels": true,
  "viewport": {
    "bounds": [-5, 5, 5, -5],
    "home": [-5, 5, 5, -5],
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
      "definition": { "type": "coordinates", "x": -3, "y": -2 },
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
      "definition": { "type": "coordinates", "x": 3, "y": -2 },
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
      "definition": { "type": "coordinates", "x": 4, "y": 3 },
      "mobility": { "type": "free" },
      "appearance": { "size": 6, "labelVisible": true, "preserveColorOnHighlight": true }
    },
    {
      "id": "segAB",
      "label": "Segmento AB",
      "color": "carbon",
      "layerId": "geometry",
      "order": 10,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Lado AB", "role": "secondary" },
      "target": true,
      "targetId": "segAB",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": ["pA", "pB"]
      },
      "appearance": { "strokeWidth": 2.5, "preserveColorOnHighlight": true }
    },
    {
      "id": "segBC",
      "label": "Segmento BC",
      "color": "carbon",
      "layerId": "geometry",
      "order": 11,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Lado BC", "role": "secondary" },
      "target": true,
      "targetId": "segBC",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": ["pB", "pC"]
      },
      "appearance": { "strokeWidth": 2.5, "preserveColorOnHighlight": true }
    },
    {
      "id": "segCA",
      "label": "Segmento CA",
      "color": "carbon",
      "layerId": "geometry",
      "order": 12,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Lado CA", "role": "secondary" },
      "target": true,
      "targetId": "segCA",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": ["pC", "pA"]
      },
      "appearance": { "strokeWidth": 2.5, "preserveColorOnHighlight": true }
    },
    {
      "id": "polyABC",
      "label": "Triángulo ABC",
      "color": "carbon",
      "layerId": "geometry",
      "order": 5,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Triángulo ABC", "role": "primary" },
      "target": true,
      "targetId": "polyABC",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": ["pA", "pB", "pC"]
      },
      "appearance": { "fillOpacity": 0.06, "strokeWidth": 1, "preserveColorOnHighlight": true }
    },
    {
      "id": "pD",
      "label": "D",
      "color": "terracota",
      "layerId": "geometry",
      "order": 33,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Punto D sobre AB", "role": "primary" },
      "target": true,
      "targetId": "pD",
      "objectType": "point",
      "definition": { "type": "coordinates", "x": -1, "y": -2 },
      "mobility": { "type": "on-support", "support": "segAB" },
      "appearance": { "size": 6, "labelVisible": true, "preserveColorOnHighlight": true }
    },
    {
      "id": "pE",
      "label": "E",
      "color": "terracota",
      "layerId": "geometry",
      "order": 34,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Punto E sobre CA", "role": "primary" },
      "target": true,
      "targetId": "pE",
      "objectType": "point",
      "definition": { "type": "coordinates", "x": -0.67, "y": -0.33 },
      "mobility": { "type": "on-support", "support": "segCA" },
      "appearance": { "size": 6, "labelVisible": true, "preserveColorOnHighlight": true }
    },
    {
      "id": "segDE",
      "label": "Segmento DE (Paralelo)",
      "color": "canela",
      "layerId": "geometry",
      "order": 15,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Segmento DE paralelo a BC", "role": "primary" },
      "target": true,
      "targetId": "segDE",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": ["pD", "pE"]
      },
      "appearance": { "dashed": true, "strokeWidth": 2.5, "preserveColorOnHighlight": true }
    },
    {
      "id": "polyADE",
      "label": "Triángulo ADE",
      "color": "ocre",
      "layerId": "geometry",
      "order": 6,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Triángulo ADE", "role": "secondary" },
      "target": true,
      "targetId": "polyADE",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": ["pA", "pD", "pE"]
      },
      "appearance": { "fillOpacity": 0.15, "strokeWidth": 1, "preserveColorOnHighlight": true }
    },
    {
      "id": "polyBDE",
      "label": "Triángulo BDE",
      "color": "ocre",
      "layerId": "geometry",
      "order": 7,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Triángulo BDE", "role": "secondary" },
      "target": true,
      "targetId": "polyBDE",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": ["pB", "pD", "pE"]
      },
      "appearance": { "fillOpacity": 0.15, "strokeWidth": 1, "preserveColorOnHighlight": true }
    },
    {
      "id": "polyCDE",
      "label": "Triángulo CDE",
      "color": "ocre",
      "layerId": "geometry",
      "order": 8,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Triángulo CDE", "role": "secondary" },
      "target": true,
      "targetId": "polyCDE",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": ["pC", "pD", "pE"]
      },
      "appearance": { "fillOpacity": 0.15, "strokeWidth": 1, "preserveColorOnHighlight": true }
    },
    {
      "id": "pH1",
      "label": "H1",
      "color": "ocre",
      "layerId": "geometry",
      "order": 35,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": { "selectable": false, "ariaLabel": "H1", "role": "construction" },
      "target": false,
      "objectType": "point",
      "definition": { "type": "coordinates", "x": -0.67, "y": -2 },
      "mobility": { "type": "fixed" }
    },
    {
      "id": "segH1",
      "label": "Altura h1",
      "color": "ocre",
      "layerId": "geometry",
      "order": 16,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Altura desde E a AB", "role": "secondary" },
      "target": true,
      "targetId": "segH1",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": ["pE", "pH1"]
      },
      "appearance": { "dashed": true, "strokeWidth": 2, "preserveColorOnHighlight": true }
    },
    {
      "id": "pH2",
      "label": "H2",
      "color": "ocre",
      "layerId": "geometry",
      "order": 36,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": { "selectable": false, "ariaLabel": "H2", "role": "construction" },
      "target": false,
      "objectType": "point",
      "definition": { "type": "coordinates", "x": -1.77, "y": -0.89 },
      "mobility": { "type": "fixed" }
    },
    {
      "id": "segH2",
      "label": "Altura h2",
      "color": "ocre",
      "layerId": "geometry",
      "order": 17,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Altura desde D a AC", "role": "secondary" },
      "target": true,
      "targetId": "segH2",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": ["pD", "pH2"]
      },
      "appearance": { "dashed": true, "strokeWidth": 2, "preserveColorOnHighlight": true }
    }
  ],
  "relations": [],
  "steps": [
    {
      "id": "step1",
      "label": "Triángulo ABC y paralela DE",
      "description": "Dada una recta DE paralela al lado BC que corta a los lados AB y AC.",
      "visibleTargets": ["polyABC", "segDE"],
      "durationMs": 1000
    },
    {
      "id": "step2",
      "label": "Triángulos sobre la base DE",
      "description": "Los triángulos BDE y CDE comparten la misma base DE y tienen la misma altura por estar entre rectas paralelas.",
      "visibleTargets": ["polyBDE", "polyCDE", "segDE"],
      "durationMs": 1000
    },
    {
      "id": "step3",
      "label": "Razón de áreas y proporcionalidad",
      "description": "Comparando las áreas de los triángulos ADE, BDE y CDE se obtiene la razón AD/DB = AE/EC.",
      "visibleTargets": ["polyADE", "segH1", "segH2"],
      "durationMs": 1000
    }
  ],
  "note": "Desliza el punto D a lo largo del lado AB para cambiar la posición de la recta paralela.",
  "translations": {
    "eu": {
      "title": "Talesen teorema",
      "note": "Irristatu D puntua AB aldean zehar zuzen paraleloaren posizioa aldatzeko.",
      "steps": {
        "step1": {
          "label": "ABC triangelua eta DE paraleloa",
          "description": "BC aldeari paraleloa zaion DE zuzenak AB eta AC aldeak ebakitzen ditu."
        },
        "step2": {
          "label": "DE oinarriaren gaineko triangeluak",
          "description": "BDE eta CDE triangeluek DE oinarri bera dute eta altuera bera dute zuzen paraleloen artean egoteagatik."
        },
        "step3": {
          "label": "Azaleren arrazoia eta proportzionaltasuna",
          "description": "ADE, BDE eta CDE triangeluen azalerak konparatuz AD/DB = AE/EC proportzioa lortzen da."
        }
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const DemoTales = () => <DiagramRenderer spec={DemoTalesSpec} />;
