import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const EjercicioPitagorasCatetoSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Despeje del cateto en el Teorema de Pitágoras",
  "componentId": "ejercicio-pitagoras-cateto",
  "category": "Ejercicios",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "showLabels": true,
  "viewport": {
    "bounds": [-9, 19, 21, -14],
    "home": [-9, 19, 21, -14],
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
      "id": "pC",
      "label": "C",
      "color": "carbon",
      "layerId": "geometry",
      "order": 30,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Vértice C (Ángulo recto)", "role": "primary" },
      "target": true,
      "targetId": "pC",
      "objectType": "point",
      "definition": { "type": "coordinates", "x": 0, "y": 0 },
      "mobility": { "type": "fixed" },
      "appearance": { "size": 6, "labelVisible": true, "preserveColorOnHighlight": true }
    },
    {
      "id": "pA",
      "label": "A",
      "color": "carbon",
      "layerId": "geometry",
      "order": 31,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Vértice A", "role": "primary" },
      "target": true,
      "targetId": "pA",
      "objectType": "point",
      "definition": { "type": "coordinates", "x": 0, "y": 6 },
      "mobility": { "type": "fixed" },
      "appearance": { "size": 6, "labelVisible": true, "preserveColorOnHighlight": true }
    },
    {
      "id": "pB",
      "label": "B",
      "color": "carbon",
      "layerId": "geometry",
      "order": 32,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Vértice B", "role": "primary" },
      "target": true,
      "targetId": "pB",
      "objectType": "point",
      "definition": { "type": "coordinates", "x": 8, "y": 0 },
      "mobility": { "type": "fixed" },
      "appearance": { "size": 6, "labelVisible": true, "preserveColorOnHighlight": true }
    },
    {
      "id": "segCA",
      "label": "Cateto a = ?",
      "color": "canela",
      "layerId": "geometry",
      "order": 10,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Cateto a (incógnita a despejar)", "role": "primary" },
      "target": true,
      "targetId": "segCA",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": ["pC", "pA"]
      },
      "appearance": { "strokeWidth": 3, "preserveColorOnHighlight": true }
    },
    {
      "id": "segBC",
      "label": "Cateto b = 8",
      "color": "terracota",
      "layerId": "geometry",
      "order": 11,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Cateto conocido b = 8", "role": "primary" },
      "target": true,
      "targetId": "segBC",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": ["pB", "pC"]
      },
      "appearance": { "strokeWidth": 3, "preserveColorOnHighlight": true }
    },
    {
      "id": "segAB",
      "label": "Hipotenusa c = 10",
      "color": "mora",
      "layerId": "geometry",
      "order": 12,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Hipotenusa conocida c = 10", "role": "primary" },
      "target": true,
      "targetId": "segAB",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": ["pA", "pB"]
      },
      "appearance": { "strokeWidth": 3, "preserveColorOnHighlight": true }
    },
    {
      "id": "polyABC",
      "label": "Triángulo (6, 8, 10)",
      "color": "carbon",
      "layerId": "geometry",
      "order": 5,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Triángulo rectángulo 6-8-10", "role": "primary" },
      "target": true,
      "targetId": "polyABC",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": ["pA", "pB", "pC"]
      },
      "appearance": { "fillOpacity": 0.08, "strokeWidth": 1, "preserveColorOnHighlight": true }
    },
    {
      "id": "rightAng",
      "label": "Ángulo recto",
      "color": "carbon",
      "layerId": "geometry",
      "order": 15,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Ángulo recto en C", "role": "secondary" },
      "target": true,
      "targetId": "rightAng",
      "objectType": "angle",
      "points": ["pB", "pC", "pA"],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": { "radius": 0.6, "preserveColorOnHighlight": true }
    },
    {
      "id": "pA_sq",
      "label": "A1",
      "color": "canela",
      "layerId": "geometry",
      "order": 40,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": { "selectable": false, "ariaLabel": "Vértice auxiliar del cuadrado a²", "role": "construction" },
      "target": false,
      "objectType": "point",
      "definition": { "type": "coordinates", "x": -6, "y": 6 },
      "mobility": { "type": "fixed" }
    },
    {
      "id": "pC_sq",
      "label": "C1",
      "color": "canela",
      "layerId": "geometry",
      "order": 41,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": { "selectable": false, "ariaLabel": "Vértice auxiliar del cuadrado a²", "role": "construction" },
      "target": false,
      "objectType": "point",
      "definition": { "type": "coordinates", "x": -6, "y": 0 },
      "mobility": { "type": "fixed" }
    },
    {
      "id": "sqCA",
      "label": "Cuadrado a² = 36",
      "color": "canela",
      "layerId": "geometry",
      "order": 6,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Cuadrado de área a² = 36", "role": "secondary" },
      "target": true,
      "targetId": "sqCA",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": ["pC", "pA", "pA_sq", "pC_sq"]
      },
      "appearance": { "fillOpacity": 0.15, "strokeWidth": 1.5, "preserveColorOnHighlight": true }
    },
    {
      "id": "pC_sq2",
      "label": "C2",
      "color": "terracota",
      "layerId": "geometry",
      "order": 42,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": { "selectable": false, "ariaLabel": "Vértice auxiliar del cuadrado b²", "role": "construction" },
      "target": false,
      "objectType": "point",
      "definition": { "type": "coordinates", "x": 0, "y": -8 },
      "mobility": { "type": "fixed" }
    },
    {
      "id": "pB_sq2",
      "label": "B2",
      "color": "terracota",
      "layerId": "geometry",
      "order": 43,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": { "selectable": false, "ariaLabel": "Vértice auxiliar del cuadrado b²", "role": "construction" },
      "target": false,
      "objectType": "point",
      "definition": { "type": "coordinates", "x": 8, "y": -8 },
      "mobility": { "type": "fixed" }
    },
    {
      "id": "sqBC",
      "label": "Cuadrado b² = 64",
      "color": "terracota",
      "layerId": "geometry",
      "order": 7,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Cuadrado de área b² = 64", "role": "secondary" },
      "target": true,
      "targetId": "sqBC",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": ["pB", "pC", "pC_sq2", "pB_sq2"]
      },
      "appearance": { "fillOpacity": 0.15, "strokeWidth": 1.5, "preserveColorOnHighlight": true }
    },
    {
      "id": "pB_sq3",
      "label": "B3",
      "color": "mora",
      "layerId": "geometry",
      "order": 44,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": { "selectable": false, "ariaLabel": "Vértice auxiliar del cuadrado c²", "role": "construction" },
      "target": false,
      "objectType": "point",
      "definition": { "type": "coordinates", "x": 14, "y": 8 },
      "mobility": { "type": "fixed" }
    },
    {
      "id": "pA_sq3",
      "label": "A3",
      "color": "mora",
      "layerId": "geometry",
      "order": 45,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": { "selectable": false, "ariaLabel": "Vértice auxiliar del cuadrado c²", "role": "construction" },
      "target": false,
      "objectType": "point",
      "definition": { "type": "coordinates", "x": 6, "y": 14 },
      "mobility": { "type": "fixed" }
    },
    {
      "id": "sqAB",
      "label": "Cuadrado c² = 100",
      "color": "mora",
      "layerId": "geometry",
      "order": 8,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Cuadrado de área c² = 100", "role": "secondary" },
      "target": true,
      "targetId": "sqAB",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": ["pA", "pB", "pB_sq3", "pA_sq3"]
      },
      "appearance": { "fillOpacity": 0.15, "strokeWidth": 1.5, "preserveColorOnHighlight": true }
    }
  ],
  "relations": [],
  "steps": [
    {
      "id": "p1",
      "label": "Paso 1: Planteamiento (c = 10, b = 8)",
      "description": "Conocemos la hipotenusa c = 10 y el cateto b = 8. Se requiere despejar el cateto a.",
      "visibleTargets": ["segBC", "segAB", "segCA"],
      "durationMs": 1000
    },
    {
      "id": "p2",
      "label": "Paso 2: Despeje del área (a² = c² - b²)",
      "description": "Restamos las áreas: a² = 100 - 64 = 36.",
      "visibleTargets": ["sqAB", "sqBC", "sqCA"],
      "durationMs": 1000
    },
    {
      "id": "p3",
      "label": "Paso 3: Extracción de la raíz (a = √36)",
      "description": "Para obtener la longitud a, calculamos a = √36 = 6.",
      "visibleTargets": ["sqCA", "segCA"],
      "durationMs": 1000
    },
    {
      "id": "p4",
      "label": "Paso 4: Solución completa (a = 6)",
      "description": "La terna resulta en (6, 8, 10), satisfaciendo 6² + 8² = 10².",
      "visibleTargets": ["polyABC", "sqCA", "sqBC", "sqAB"],
      "durationMs": 1000
    }
  ],
  "note": "Resuelve los pasos del ejercicio para desvelar los valores despejados.",
  "translations": {
    "eu": {
      "title": "Katetoaren bakantzea Pitagorasen teoreman",
      "note": "Ebatzi ariketaren urratsak bakandutako balioak agertzeko.",
      "steps": {
        "p1": {
          "label": "1. urratsa: Enuntziatua (c = 10, b = 8)",
          "description": "c = 10 hipotenusa eta b = 8 kateto ezagunak dira. a katetoa bakandu nahi da."
        },
        "p2": {
          "label": "2. urratsa: Azaleraren bakantzea (a² = c² - b²)",
          "description": "Azalerak kentzen ditugu: a² = 100 - 64 = 36."
        },
        "p3": {
          "label": "3. urratsa: Erroaren kalkulua (a = √36)",
          "description": "a luzera lortzeko, a = √36 = 6 kalkulatzen dugu."
        }
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const EjercicioPitagorasCateto = () => (
  <DiagramRenderer spec={EjercicioPitagorasCatetoSpec} />
);
