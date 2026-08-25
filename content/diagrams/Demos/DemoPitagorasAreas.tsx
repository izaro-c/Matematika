import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const DemoPitagorasAreasSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Demostración visual de Pitágoras (Áreas)",
  "componentId": "demo-pitagoras-areas",
  "category": "Demos",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "showLabels": true,
  "viewport": {
    "bounds": [-1, 9, 8, -1.5],
    "home": [-1, 9, 8, -1.5],
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
      "id": "pE1",
      "label": "E1",
      "color": "carbon",
      "layerId": "geometry",
      "order": 1,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": { "selectable": false, "ariaLabel": "E1", "role": "construction" },
      "target": false,
      "objectType": "point",
      "definition": { "type": "coordinates", "x": 0, "y": 0 },
      "mobility": { "type": "fixed" }
    },
    {
      "id": "pE2",
      "label": "E2",
      "color": "carbon",
      "layerId": "geometry",
      "order": 2,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": { "selectable": false, "ariaLabel": "E2", "role": "construction" },
      "target": false,
      "objectType": "point",
      "definition": { "type": "coordinates", "x": 7, "y": 0 },
      "mobility": { "type": "fixed" }
    },
    {
      "id": "pE3",
      "label": "E3",
      "color": "carbon",
      "layerId": "geometry",
      "order": 3,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": { "selectable": false, "ariaLabel": "E3", "role": "construction" },
      "target": false,
      "objectType": "point",
      "definition": { "type": "coordinates", "x": 7, "y": 7 },
      "mobility": { "type": "fixed" }
    },
    {
      "id": "pE4",
      "label": "E4",
      "color": "carbon",
      "layerId": "geometry",
      "order": 4,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": { "selectable": false, "ariaLabel": "E4", "role": "construction" },
      "target": false,
      "objectType": "point",
      "definition": { "type": "coordinates", "x": 0, "y": 7 },
      "mobility": { "type": "fixed" }
    },
    {
      "id": "outerSquare",
      "label": "Cuadrado Exterior",
      "color": "carbon",
      "layerId": "geometry",
      "order": 5,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Cuadrado exterior de lado a+b", "role": "primary" },
      "target": true,
      "targetId": "outerSquare",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": ["pE1", "pE2", "pE3", "pE4"]
      },
      "appearance": { "fillOpacity": 0, "strokeWidth": 2.5, "preserveColorOnHighlight": true }
    },
    {
      "id": "c1",
      "label": "C1",
      "color": "mora",
      "layerId": "geometry",
      "order": 10,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": { "selectable": false, "ariaLabel": "C1", "role": "construction" },
      "target": false,
      "objectType": "point",
      "definition": { "type": "coordinates", "x": 3, "y": 0 },
      "mobility": { "type": "fixed" }
    },
    {
      "id": "c2",
      "label": "C2",
      "color": "mora",
      "layerId": "geometry",
      "order": 11,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": { "selectable": false, "ariaLabel": "C2", "role": "construction" },
      "target": false,
      "objectType": "point",
      "definition": { "type": "coordinates", "x": 7, "y": 3 },
      "mobility": { "type": "fixed" }
    },
    {
      "id": "c3",
      "label": "C3",
      "color": "mora",
      "layerId": "geometry",
      "order": 12,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": { "selectable": false, "ariaLabel": "C3", "role": "construction" },
      "target": false,
      "objectType": "point",
      "definition": { "type": "coordinates", "x": 4, "y": 7 },
      "mobility": { "type": "fixed" }
    },
    {
      "id": "c4",
      "label": "C4",
      "color": "mora",
      "layerId": "geometry",
      "order": 13,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": { "selectable": false, "ariaLabel": "C4", "role": "construction" },
      "target": false,
      "objectType": "point",
      "definition": { "type": "coordinates", "x": 0, "y": 4 },
      "mobility": { "type": "fixed" }
    },
    {
      "id": "emptyC",
      "label": "Área c²",
      "color": "mora",
      "layerId": "geometry",
      "order": 15,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Cuadrado interior de área c²", "role": "primary" },
      "target": true,
      "targetId": "emptyC",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": ["c1", "c2", "c3", "c4"]
      },
      "appearance": { "fillOpacity": 0.35, "strokeWidth": 2, "preserveColorOnHighlight": true }
    },
    {
      "id": "a1",
      "label": "A1",
      "color": "terracota",
      "layerId": "geometry",
      "order": 20,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": { "selectable": false, "ariaLabel": "A1", "role": "construction" },
      "target": false,
      "objectType": "point",
      "definition": { "type": "coordinates", "x": 0, "y": 4 },
      "mobility": { "type": "fixed" }
    },
    {
      "id": "a2",
      "label": "A2",
      "color": "terracota",
      "layerId": "geometry",
      "order": 21,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": { "selectable": false, "ariaLabel": "A2", "role": "construction" },
      "target": false,
      "objectType": "point",
      "definition": { "type": "coordinates", "x": 3, "y": 4 },
      "mobility": { "type": "fixed" }
    },
    {
      "id": "a3",
      "label": "A3",
      "color": "terracota",
      "layerId": "geometry",
      "order": 22,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": { "selectable": false, "ariaLabel": "A3", "role": "construction" },
      "target": false,
      "objectType": "point",
      "definition": { "type": "coordinates", "x": 3, "y": 7 },
      "mobility": { "type": "fixed" }
    },
    {
      "id": "a4",
      "label": "A4",
      "color": "terracota",
      "layerId": "geometry",
      "order": 23,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": { "selectable": false, "ariaLabel": "A4", "role": "construction" },
      "target": false,
      "objectType": "point",
      "definition": { "type": "coordinates", "x": 0, "y": 7 },
      "mobility": { "type": "fixed" }
    },
    {
      "id": "emptyA",
      "label": "Área a²",
      "color": "terracota",
      "layerId": "geometry",
      "order": 25,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Cuadrado de área a²", "role": "secondary" },
      "target": true,
      "targetId": "emptyA",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": ["a1", "a2", "a3", "a4"]
      },
      "appearance": { "fillOpacity": 0.35, "strokeWidth": 2, "preserveColorOnHighlight": true }
    },
    {
      "id": "b1",
      "label": "B1",
      "color": "terracota",
      "layerId": "geometry",
      "order": 30,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": { "selectable": false, "ariaLabel": "B1", "role": "construction" },
      "target": false,
      "objectType": "point",
      "definition": { "type": "coordinates", "x": 3, "y": 0 },
      "mobility": { "type": "fixed" }
    },
    {
      "id": "b2",
      "label": "B2",
      "color": "terracota",
      "layerId": "geometry",
      "order": 31,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": { "selectable": false, "ariaLabel": "B2", "role": "construction" },
      "target": false,
      "objectType": "point",
      "definition": { "type": "coordinates", "x": 7, "y": 0 },
      "mobility": { "type": "fixed" }
    },
    {
      "id": "b3",
      "label": "B3",
      "color": "terracota",
      "layerId": "geometry",
      "order": 32,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": { "selectable": false, "ariaLabel": "B3", "role": "construction" },
      "target": false,
      "objectType": "point",
      "definition": { "type": "coordinates", "x": 7, "y": 4 },
      "mobility": { "type": "fixed" }
    },
    {
      "id": "b4",
      "label": "B4",
      "color": "terracota",
      "layerId": "geometry",
      "order": 33,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": { "selectable": false, "ariaLabel": "B4", "role": "construction" },
      "target": false,
      "objectType": "point",
      "definition": { "type": "coordinates", "x": 3, "y": 4 },
      "mobility": { "type": "fixed" }
    },
    {
      "id": "emptyB",
      "label": "Área b²",
      "color": "terracota",
      "layerId": "geometry",
      "order": 35,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Cuadrado de área b²", "role": "secondary" },
      "target": true,
      "targetId": "emptyB",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": ["b1", "b2", "b3", "b4"]
      },
      "appearance": { "fillOpacity": 0.35, "strokeWidth": 2, "preserveColorOnHighlight": true }
    },
    {
      "id": "t1",
      "label": "Triángulo 1",
      "color": "canela",
      "layerId": "geometry",
      "order": 40,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Triángulo rectángulo 1", "role": "secondary" },
      "target": true,
      "targetId": "t1",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": ["pE1", "c1", "c4"]
      },
      "appearance": { "fillOpacity": 0.3, "strokeWidth": 2, "preserveColorOnHighlight": true }
    },
    {
      "id": "t2",
      "label": "Triángulo 2",
      "color": "canela",
      "layerId": "geometry",
      "order": 41,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Triángulo rectángulo 2", "role": "secondary" },
      "target": true,
      "targetId": "t2",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": ["pE2", "c2", "c1"]
      },
      "appearance": { "fillOpacity": 0.3, "strokeWidth": 2, "preserveColorOnHighlight": true }
    },
    {
      "id": "t3",
      "label": "Triángulo 3",
      "color": "canela",
      "layerId": "geometry",
      "order": 42,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Triángulo rectángulo 3", "role": "secondary" },
      "target": true,
      "targetId": "t3",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": ["pE3", "c3", "c2"]
      },
      "appearance": { "fillOpacity": 0.3, "strokeWidth": 2, "preserveColorOnHighlight": true }
    },
    {
      "id": "t4",
      "label": "Triángulo 4",
      "color": "canela",
      "layerId": "geometry",
      "order": 43,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Triángulo rectángulo 4", "role": "secondary" },
      "target": true,
      "targetId": "t4",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": ["pE4", "c4", "c3"]
      },
      "appearance": { "fillOpacity": 0.3, "strokeWidth": 2, "preserveColorOnHighlight": true }
    }
  ],
  "relations": [],
  "steps": [
    {
      "id": "step-inicial",
      "label": "Configuración de área c²",
      "description": "Cuatro triángulos rectángulos idénticos dentro de un cuadrado exterior delimitan un cuadrado interior de área c².",
      "visibleTargets": ["outerSquare", "t1", "t2", "t3", "t4", "emptyC"],
      "durationMs": 1000,
      "objectStates": {
        "emptyC": { "visible": true, "emphasis": "primary" },
        "emptyA": { "visible": false },
        "emptyB": { "visible": false }
      }
    },
    {
      "id": "step-reordenamiento",
      "label": "Reorganización de áreas",
      "description": "Al desplazar los cuatro triángulos, la misma superficie sobrante se divide en los dos cuadrados de áreas a² y b².",
      "visibleTargets": ["outerSquare", "t1", "t2", "t3", "t4", "emptyA", "emptyB"],
      "durationMs": 1000,
      "objectStates": {
        "emptyC": { "visible": false },
        "emptyA": { "visible": true, "emphasis": "primary" },
        "emptyB": { "visible": true, "emphasis": "primary" }
      }
    }
  ],
  "note": "Destaca los elementos para analizar la conservación del área total.",
  "translations": {
    "eu": {
      "title": "Pitagorasen frogapen bisuala (Azalerak)",
      "note": "Nabarmendu elementuak azalera osoaren kontserbazioa aztertzeko.",
      "steps": {
        "step-inicial": {
          "label": "c² azaleraren konfigurazioa",
          "description": "Lau triangelu angeluzuzenek c² azalera duen barne-karratua mugatzen dute."
        },
        "step-reordenamiento": {
          "label": "Azalerak berrantolatzea",
          "description": "Triangeluak berriro antolatzean, barne-azalera bera a² eta b² bi karratuetan banatzen da."
        }
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const DemoPitagorasAreas = () => <DiagramRenderer spec={DemoPitagorasAreasSpec} />;
