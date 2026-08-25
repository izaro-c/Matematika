import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const DemoRectasCoincidentesSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Rectas coincidentes",
  "componentId": "demo-rectas-coincidentes",
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
      "definition": { "type": "coordinates", "x": -2, "y": 0 },
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
      "definition": { "type": "coordinates", "x": 2, "y": 0 },
      "mobility": { "type": "free" },
      "appearance": { "size": 6, "labelVisible": true, "preserveColorOnHighlight": true }
    },
    {
      "id": "rectaL",
      "label": "l",
      "color": "carbon",
      "layerId": "geometry",
      "order": 5,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Recta l", "role": "primary" },
      "target": true,
      "targetId": "rectaL",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "through-points",
          "points": ["pA", "pB"]
        }
      },
      "appearance": { "strokeWidth": 2.5, "preserveColorOnHighlight": true }
    },
    {
      "id": "pBrot",
      "label": "B'",
      "color": "terracota",
      "layerId": "geometry",
      "order": 32,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": { "selectable": false, "ariaLabel": "Punto B rotado", "role": "construction" },
      "target": false,
      "objectType": "point",
      "definition": { "type": "coordinates", "x": 2, "y": 0.8 },
      "mobility": { "type": "fixed" }
    },
    {
      "id": "rectaM",
      "label": "m",
      "color": "terracota",
      "layerId": "geometry",
      "order": 6,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Recta m", "role": "primary" },
      "target": true,
      "targetId": "rectaM",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "through-points",
          "points": ["pA", "pBrot"]
        }
      },
      "appearance": { "strokeWidth": 2.5, "preserveColorOnHighlight": true }
    }
  ],
  "relations": [],
  "steps": [
    {
      "id": "step1",
      "label": "Dos puntos distintos",
      "description": "Fijamos dos puntos distintos A y B en el plano.",
      "visibleTargets": ["pA", "pB"],
      "durationMs": 1000
    },
    {
      "id": "step2",
      "label": "Recta l por A y B",
      "description": "Existe al menos una recta l que pasa por A y B.",
      "visibleTargets": ["pA", "pB", "rectaL"],
      "durationMs": 1000
    },
    {
      "id": "step3",
      "label": "Otra recta m por A",
      "description": "Consideramos otra recta m que pasa por el punto A.",
      "visibleTargets": ["pA", "rectaM"],
      "durationMs": 1000
    },
    {
      "id": "step4",
      "label": "Rotación de m",
      "description": "Si la recta m pasa también por el punto B...",
      "visibleTargets": ["pA", "pB", "rectaL", "rectaM"],
      "durationMs": 1000
    },
    {
      "id": "step5",
      "label": "Coincidencia total",
      "description": "Por el Axioma I-1, existe una única recta que pasa por dos puntos dados, de modo que m = l.",
      "visibleTargets": ["pA", "pB", "rectaL", "rectaM"],
      "durationMs": 1000
    }
  ],
  "note": "Arrastrat o haz clic en los puntos A y B para ajustar la posición.",
  "translations": {
    "eu": {
      "title": "Zuzen kointzidenteak",
      "note": "Arrastatu edo egin klik A eta B puntuetan posizioa aldatzeko.",
      "steps": {
        "step1": {
          "label": "Bi puntu desberdin",
          "description": "A eta B bi puntu desberdin ezartzen ditugu planoan."
        },
        "step2": {
          "label": "l zuzena A eta B-tik",
          "description": "Gutxienez l zuzen bat existitzen da A eta B-tik igarotzen dena."
        },
        "step5": {
          "label": "Kointzidentzia osoa",
          "description": "I-1 Axiomaren arabera, zuzen bakar bat igarotzen da bi puntu emanik: m = l."
        }
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const DemoRectasCoincidentes = () => <DiagramRenderer spec={DemoRectasCoincidentesSpec} />;
