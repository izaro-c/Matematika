import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const DemoPitagorasEuclidesSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Teorema de Pitágoras: Demostración de Euclides",
  "componentId": "demo-pitagoras-euclides",
  "category": "Demos",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "showLabels": true,
  "viewport": {
    "bounds": [-8, 12, 13, -8],
    "home": [-8, 12, 13, -8],
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
      "selection": { "selectable": true, "ariaLabel": "Punto C (Ángulo recto)", "role": "primary" },
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
      "selection": { "selectable": true, "ariaLabel": "Punto A", "role": "primary" },
      "target": true,
      "targetId": "pA",
      "objectType": "point",
      "definition": { "type": "coordinates", "x": 0, "y": 4 },
      "mobility": { "type": "axis-y", "coordinate": 4 },
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
      "selection": { "selectable": true, "ariaLabel": "Punto B", "role": "primary" },
      "target": true,
      "targetId": "pB",
      "objectType": "point",
      "definition": { "type": "coordinates", "x": 5, "y": 0 },
      "mobility": { "type": "axis-x", "coordinate": 5 },
      "appearance": { "size": 6, "labelVisible": true, "preserveColorOnHighlight": true }
    },
    {
      "id": "polyABC",
      "label": "Triángulo ABC",
      "color": "granada",
      "layerId": "geometry",
      "order": 5,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Triángulo rectángulo principal ABC", "role": "primary" },
      "target": true,
      "targetId": "polyABC",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": ["pC", "pB", "pA"]
      },
      "appearance": { "fillOpacity": 0.1, "strokeWidth": 2.5, "preserveColorOnHighlight": true }
    },
    {
      "id": "rightAngle",
      "label": "Ángulo recto",
      "color": "carbon",
      "layerId": "geometry",
      "order": 10,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Ángulo recto en C", "role": "secondary" },
      "target": true,
      "targetId": "rightAngle",
      "objectType": "angle",
      "points": ["pB", "pC", "pA"],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": { "radius": 0.8, "preserveColorOnHighlight": true }
    },
    {
      "id": "pK",
      "label": "K",
      "color": "canela",
      "layerId": "geometry",
      "order": 33,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Punto K", "role": "secondary" },
      "target": true,
      "targetId": "pK",
      "objectType": "point",
      "definition": { "type": "coordinates", "x": -4, "y": 4 },
      "mobility": { "type": "fixed" },
      "appearance": { "size": 5, "labelVisible": true, "preserveColorOnHighlight": true }
    },
    {
      "id": "pH",
      "label": "H",
      "color": "canela",
      "layerId": "geometry",
      "order": 34,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": { "selectable": false, "ariaLabel": "Punto H", "role": "construction" },
      "target": false,
      "objectType": "point",
      "definition": { "type": "coordinates", "x": -4, "y": 0 },
      "mobility": { "type": "fixed" }
    },
    {
      "id": "sqB",
      "label": "Cuadrado b²",
      "color": "canela",
      "layerId": "geometry",
      "order": 6,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Cuadrado construido sobre el cateto b", "role": "primary" },
      "target": true,
      "targetId": "sqB",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": ["pC", "pA", "pK", "pH"]
      },
      "appearance": { "fillOpacity": 0.15, "strokeWidth": 2, "preserveColorOnHighlight": true }
    },
    {
      "id": "pF",
      "label": "F",
      "color": "terracota",
      "layerId": "geometry",
      "order": 35,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Punto F", "role": "secondary" },
      "target": true,
      "targetId": "pF",
      "objectType": "point",
      "definition": { "type": "coordinates", "x": 5, "y": -5 },
      "mobility": { "type": "fixed" },
      "appearance": { "size": 5, "labelVisible": true, "preserveColorOnHighlight": true }
    },
    {
      "id": "pG",
      "label": "G",
      "color": "terracota",
      "layerId": "geometry",
      "order": 36,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": { "selectable": false, "ariaLabel": "Punto G", "role": "construction" },
      "target": false,
      "objectType": "point",
      "definition": { "type": "coordinates", "x": 0, "y": -5 },
      "mobility": { "type": "fixed" }
    },
    {
      "id": "sqA",
      "label": "Cuadrado a²",
      "color": "terracota",
      "layerId": "geometry",
      "order": 7,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Cuadrado construido sobre el cateto a", "role": "primary" },
      "target": true,
      "targetId": "sqA",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": ["pC", "pB", "pF", "pG"]
      },
      "appearance": { "fillOpacity": 0.15, "strokeWidth": 2, "preserveColorOnHighlight": true }
    },
    {
      "id": "pD",
      "label": "D",
      "color": "mora",
      "layerId": "geometry",
      "order": 37,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Punto D", "role": "secondary" },
      "target": true,
      "targetId": "pD",
      "objectType": "point",
      "definition": { "type": "coordinates", "x": 4, "y": 9 },
      "mobility": { "type": "fixed" },
      "appearance": { "size": 5, "labelVisible": true, "preserveColorOnHighlight": true }
    },
    {
      "id": "pE",
      "label": "E",
      "color": "mora",
      "layerId": "geometry",
      "order": 38,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Punto E", "role": "secondary" },
      "target": true,
      "targetId": "pE",
      "objectType": "point",
      "definition": { "type": "coordinates", "x": 9, "y": 5 },
      "mobility": { "type": "fixed" },
      "appearance": { "size": 5, "labelVisible": true, "preserveColorOnHighlight": true }
    },
    {
      "id": "sqC",
      "label": "Cuadrado c²",
      "color": "mora",
      "layerId": "geometry",
      "order": 8,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Cuadrado construido sobre la hipotenusa c", "role": "primary" },
      "target": true,
      "targetId": "sqC",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": ["pA", "pB", "pE", "pD"]
      },
      "appearance": { "fillOpacity": 0.15, "strokeWidth": 2, "preserveColorOnHighlight": true }
    },
    {
      "id": "pL",
      "label": "L",
      "color": "carbon",
      "layerId": "geometry",
      "order": 39,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Punto L (Pie de la altura)", "role": "construction" },
      "target": true,
      "targetId": "pL",
      "objectType": "point",
      "definition": { "type": "coordinates", "x": 1.95, "y": 2.44 },
      "mobility": { "type": "fixed" },
      "appearance": { "size": 4, "labelVisible": true, "preserveColorOnHighlight": true }
    },
    {
      "id": "pM",
      "label": "M",
      "color": "carbon",
      "layerId": "geometry",
      "order": 40,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Punto M", "role": "construction" },
      "target": true,
      "targetId": "pM",
      "objectType": "point",
      "definition": { "type": "coordinates", "x": 5.85, "y": 7.32 },
      "mobility": { "type": "fixed" },
      "appearance": { "size": 4, "labelVisible": true, "preserveColorOnHighlight": true }
    },
    {
      "id": "altSegment",
      "label": "Segmento CM (Altura)",
      "color": "carbon",
      "layerId": "geometry",
      "order": 12,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Segmento de la altura prolongado", "role": "secondary" },
      "target": true,
      "targetId": "altSegment",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": ["pC", "pM"]
      },
      "appearance": { "dashed": true, "strokeWidth": 2, "preserveColorOnHighlight": true }
    },
    {
      "id": "rectADML",
      "label": "Rectángulo ADML",
      "color": "canela",
      "layerId": "geometry",
      "order": 13,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Rectángulo ADML (Equivalente a b²)", "role": "primary" },
      "target": true,
      "targetId": "rectADML",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": ["pA", "pD", "pM", "pL"]
      },
      "appearance": { "fillOpacity": 0.2, "strokeWidth": 2, "preserveColorOnHighlight": true }
    },
    {
      "id": "rectBEML",
      "label": "Rectángulo BEML",
      "color": "terracota",
      "layerId": "geometry",
      "order": 14,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Rectángulo BEML (Equivalente a a²)", "role": "primary" },
      "target": true,
      "targetId": "rectBEML",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": ["pB", "pE", "pM", "pL"]
      },
      "appearance": { "fillOpacity": 0.2, "strokeWidth": 2, "preserveColorOnHighlight": true }
    }
  ],
  "relations": [],
  "steps": [
    {
      "id": "triangulo",
      "label": "Triángulo rectángulo base",
      "description": "Partimos de un triángulo rectángulo ABC con ángulo recto en C.",
      "visibleTargets": ["polyABC", "pC", "pA", "pB"],
      "durationMs": 1000
    },
    {
      "id": "cuadrados",
      "label": "Construcción de los tres cuadrados",
      "description": "Se construyen cuadrados sobre los catetos (a² y b²) y sobre la hipotenusa (c²).",
      "visibleTargets": ["sqA", "sqB", "sqC"],
      "durationMs": 1000
    },
    {
      "id": "altura",
      "label": "Trazado de la altura",
      "description": "La recta perpendicular a la hipotenusa que pasa por C divide el cuadrado c² en dos rectángulos.",
      "visibleTargets": ["altSegment", "rectADML", "rectBEML"],
      "durationMs": 1000
    },
    {
      "id": "triangulos-izq",
      "label": "Congruencia izquierda (ACD ≅ AKB)",
      "description": "Los triángulos ACD y AKB son congruentes por el criterio LAL, teniendo igual área.",
      "visibleTargets": ["sqB", "rectADML"],
      "durationMs": 1000
    },
    {
      "id": "areas-izq",
      "label": "Igualdad de área: Cuadrado b² = Rectángulo ADML",
      "description": "El área del triángulo AKB es la mitad del cuadrado b², y el área de ACD es la mitad del rectángulo ADML.",
      "visibleTargets": ["sqB", "rectADML"],
      "durationMs": 1000
    },
    {
      "id": "triangulos-der",
      "label": "Congruencia derecha (BCE ≅ ABF)",
      "description": "De forma análoga, los triángulos BCE y ABF son congruentes por LAL.",
      "visibleTargets": ["sqA", "rectBEML"],
      "durationMs": 1000
    },
    {
      "id": "areas-der",
      "label": "Igualdad de área: Cuadrado a² = Rectángulo BEML",
      "description": "El cuadrado a² tiene la misma área que el rectángulo BEML.",
      "visibleTargets": ["sqA", "rectBEML"],
      "durationMs": 1000
    },
    {
      "id": "cuadrados-final",
      "label": "Conclusión: a² + b² = c²",
      "description": "Sumando ambas áreas, el cuadrado sobre la hipotenusa c² es la suma de los cuadrados sobre los catetos a² + b².",
      "visibleTargets": ["sqA", "sqB", "sqC", "rectADML", "rectBEML"],
      "durationMs": 1000
    }
  ],
  "note": "Interactúa con los pasos para recorrer la demostración del libro I (Proposición 47) de los Elementos de Euclides.",
  "translations": {
    "eu": {
      "title": "Pitagorasen teorema: Euklidesen frogapena",
      "note": "Interaktuatu urratsekin Euklidesen Elementuen I. liburuko (47. proposizioa) frogapena ikusteko.",
      "steps": {
        "triangulo": {
          "label": "Oinarrizko triangelu angeluzuzena",
          "description": "C-n kulunka zuzena duen ABC triangelu angeluzuzenetik abiatzen gara."
        },
        "cuadrados": {
          "label": "Hiru karratuen eraikuntza",
          "description": "Karratuak eraikitzen dira katetoen (a² eta b²) eta hipotenusaren (c²) gainean."
        },
        "altura": {
          "label": "Altueraren lerroa",
          "description": "C-tik igarotzen den hipotenusarekiko zutak c² karratua bi angeluzuzenetan banatzen du."
        },
        "cuadrados-final": {
          "label": "Ondorioa: a² + b² = c²",
          "description": "Bi azalerak batuz, hipotenusaren gaineko karratua katetoen gaineko karratuen batura da."
        }
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const DemoPitagorasEuclides = () => <DiagramRenderer spec={DemoPitagorasEuclidesSpec} />;
