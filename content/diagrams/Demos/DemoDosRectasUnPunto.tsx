import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const DemoDosRectasUnPuntoSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Dos rectas y un punto",
  "componentId": "demo-dos-rectas-un-punto",
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
      "id": "pP",
      "label": "P",
      "color": "carbon",
      "layerId": "geometry",
      "order": 30,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Punto P", "role": "primary" },
      "target": true,
      "targetId": "pP",
      "objectType": "point",
      "definition": { "type": "coordinates", "x": 0, "y": 0 },
      "mobility": { "type": "free" },
      "appearance": { "size": 6, "labelVisible": true, "preserveColorOnHighlight": true }
    },
    {
      "id": "pA",
      "label": "A",
      "color": "musgo",
      "layerId": "geometry",
      "order": 10,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": { "selectable": false, "ariaLabel": "Punto A", "role": "construction" },
      "target": false,
      "objectType": "point",
      "definition": { "type": "coordinates", "x": -3, "y": -1 },
      "mobility": { "type": "fixed" }
    },
    {
      "id": "pB",
      "label": "B",
      "color": "terracota",
      "layerId": "geometry",
      "order": 11,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": { "selectable": false, "ariaLabel": "Punto B", "role": "construction" },
      "target": false,
      "objectType": "point",
      "definition": { "type": "coordinates", "x": 3, "y": -1 },
      "mobility": { "type": "fixed" }
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
          "points": ["pP", "pA"]
        }
      },
      "appearance": { "strokeWidth": 2.5, "preserveColorOnHighlight": true }
    },
    {
      "id": "pQ",
      "label": "Q",
      "color": "terracota",
      "layerId": "geometry",
      "order": 31,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Punto Q", "role": "primary" },
      "target": true,
      "targetId": "pQ",
      "objectType": "point",
      "definition": { "type": "coordinates", "x": 3, "y": 1 },
      "mobility": { "type": "on-support", "support": "rectaL" },
      "appearance": { "size": 6, "labelVisible": true, "preserveColorOnHighlight": true }
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
          "points": ["pP", "pB"]
        }
      },
      "appearance": { "strokeWidth": 2.5, "preserveColorOnHighlight": true }
    }
  ],
  "relations": [],
  "steps": [
    {
      "id": "step1",
      "label": "Intersección en P",
      "description": "Dos rectas distintas l y m se cortan exactamente en un único punto P.",
      "visibleTargets": ["pP", "rectaL", "rectaM"],
      "durationMs": 1000,
      "objectStates": {
        "pP": { "visible": true, "emphasis": "primary" },
        "rectaL": { "visible": true },
        "rectaM": { "visible": true },
        "pQ": { "visible": true }
      }
    },
    {
      "id": "step2",
      "label": "Punto Q en l",
      "description": "Tomamos un segundo punto Q perteneniente a la recta l.",
      "visibleTargets": ["pP", "pQ", "rectaL", "rectaM"],
      "durationMs": 1000,
      "objectStates": {
        "pP": { "visible": true },
        "pQ": { "visible": true, "emphasis": "primary" },
        "rectaL": { "visible": true },
        "rectaM": { "visible": true }
      }
    },
    {
      "id": "step3",
      "label": "Giro de la recta m",
      "description": "Si la recta m gira hasta contener también a Q...",
      "visibleTargets": ["pP", "pQ", "rectaL", "rectaM"],
      "durationMs": 1000
    },
    {
      "id": "step4",
      "label": "Coincidencia de rectas",
      "description": "Si dos rectas tienen dos puntos distintos en común (P y Q), ambas rectas deben coincidir.",
      "visibleTargets": ["pP", "pQ", "rectaL", "rectaM"],
      "durationMs": 1000
    }
  ],
  "note": "Haz clic en las rectas o los puntos para destacarlos.",
  "translations": {
    "eu": {
      "title": "Bi zuzen eta puntu bat",
      "note": "Egin klik zuzenetan edo puntuetan nabarmentzeko.",
      "steps": {
        "step1": {
          "label": "Ebakidura P-n",
          "description": "Bi l eta m zuzen desberdinek puntu bakarrean ebakitzen dute elkar: P puntuan."
        },
        "step2": {
          "label": "Q puntua l zuzenean",
          "description": "l zuzeneko Q bigarren puntu bat hartzen dugu."
        },
        "step3": {
          "label": "m zuzenaren biraketa",
          "description": "m zuzenak Q puntua ere baduelakoan biratzen badu..."
        },
        "step4": {
          "label": "Zuzenen kointzidentzia",
          "description": "Bi zuzenek bi puntu desberdin komunean badituzte (P eta Q), bi zuzenek bat egin behar dute."
        }
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const DemoDosRectasUnPunto = () => <DiagramRenderer spec={DemoDosRectasUnPuntoSpec} />;
