import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const DemoTrianguloIsoscelesSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Teorema del triángulo isósceles",
  "componentId": "demo-triangulo-isosceles",
  "category": "Demos",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "showLabels": true,
  "viewport": {
    "bounds": [-5, 6, 5, -3],
    "home": [-5, 6, 5, -3],
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
      "id": "pB",
      "label": "B",
      "color": "carbon",
      "layerId": "geometry",
      "order": 30,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Vértice B", "role": "primary" },
      "target": true,
      "targetId": "pB",
      "objectType": "point",
      "definition": { "type": "coordinates", "x": -3, "y": -2 },
      "mobility": { "type": "fixed" },
      "appearance": { "size": 6, "labelVisible": true, "preserveColorOnHighlight": true }
    },
    {
      "id": "pC",
      "label": "C",
      "color": "carbon",
      "layerId": "geometry",
      "order": 31,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Vértice C", "role": "primary" },
      "target": true,
      "targetId": "pC",
      "objectType": "point",
      "definition": { "type": "coordinates", "x": 3, "y": -2 },
      "mobility": { "type": "fixed" },
      "appearance": { "size": 6, "labelVisible": true, "preserveColorOnHighlight": true }
    },
    {
      "id": "pA",
      "label": "A",
      "color": "terracota",
      "layerId": "geometry",
      "order": 32,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Vértice A", "role": "primary" },
      "target": true,
      "targetId": "pA",
      "objectType": "point",
      "definition": { "type": "coordinates", "x": 0, "y": 4 },
      "mobility": { "type": "axis-x", "coordinate": 0 },
      "appearance": { "size": 6, "labelVisible": true, "preserveColorOnHighlight": true }
    },
    {
      "id": "pD",
      "label": "D",
      "color": "mora",
      "layerId": "geometry",
      "order": 33,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Punto medio D de la base BC", "role": "primary" },
      "target": true,
      "targetId": "pD",
      "objectType": "point",
      "definition": {
        "type": "midpoint",
        "points": ["pB", "pC"]
      },
      "mobility": { "type": "fixed" },
      "appearance": { "size": 5, "labelVisible": true, "preserveColorOnHighlight": true }
    },
    {
      "id": "ladoAB",
      "label": "Lado AB",
      "color": "carbon",
      "layerId": "geometry",
      "order": 10,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Lado AB", "role": "primary" },
      "target": true,
      "targetId": "ladoAB",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": ["pA", "pB"]
      },
      "appearance": { "strokeWidth": 2.5, "preserveColorOnHighlight": true }
    },
    {
      "id": "ladoAC",
      "label": "Lado AC",
      "color": "carbon",
      "layerId": "geometry",
      "order": 11,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Lado AC", "role": "primary" },
      "target": true,
      "targetId": "ladoAC",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": ["pA", "pC"]
      },
      "appearance": { "strokeWidth": 2.5, "preserveColorOnHighlight": true }
    },
    {
      "id": "ladoBC",
      "label": "Lado BC (Base)",
      "color": "carbon",
      "layerId": "geometry",
      "order": 12,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Base BC", "role": "primary" },
      "target": true,
      "targetId": "ladoBC",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": ["pB", "pC"]
      },
      "appearance": { "strokeWidth": 2.5, "preserveColorOnHighlight": true }
    },
    {
      "id": "bisectriz",
      "label": "Bisectriz / Mediana AD",
      "color": "mora",
      "layerId": "geometry",
      "order": 15,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Segmento AD (Bisectriz y Mediana)", "role": "secondary" },
      "target": true,
      "targetId": "bisectriz",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": ["pA", "pD"]
      },
      "appearance": { "dashed": true, "strokeWidth": 2, "preserveColorOnHighlight": true }
    },
    {
      "id": "polyABC",
      "label": "Triángulo ABC",
      "color": "canela",
      "layerId": "geometry",
      "order": 5,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Triángulo isósceles ABC", "role": "primary" },
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
      "id": "polyABD",
      "label": "Triángulo ABD",
      "color": "terracota",
      "layerId": "geometry",
      "order": 6,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Subtriángulo izquierdo ABD", "role": "secondary" },
      "target": true,
      "targetId": "polyABD",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": ["pA", "pB", "pD"]
      },
      "appearance": { "fillOpacity": 0.25, "strokeWidth": 1, "preserveColorOnHighlight": true }
    },
    {
      "id": "polyACD",
      "label": "Triángulo ACD",
      "color": "canela",
      "layerId": "geometry",
      "order": 7,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Subtriángulo derecho ACD", "role": "secondary" },
      "target": true,
      "targetId": "polyACD",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": ["pA", "pC", "pD"]
      },
      "appearance": { "fillOpacity": 0.25, "strokeWidth": 1, "preserveColorOnHighlight": true }
    },
    {
      "id": "anguloB",
      "label": "Ángulo β en B",
      "color": "mora",
      "layerId": "geometry",
      "order": 20,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Ángulo en el vértice B", "role": "secondary" },
      "target": true,
      "targetId": "anguloB",
      "objectType": "angle",
      "points": ["pC", "pB", "pA"],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": { "radius": 1, "preserveColorOnHighlight": true }
    },
    {
      "id": "anguloC",
      "label": "Ángulo γ en C",
      "color": "mora",
      "layerId": "geometry",
      "order": 21,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Ángulo en el vértice C", "role": "secondary" },
      "target": true,
      "targetId": "anguloC",
      "objectType": "angle",
      "points": ["pA", "pC", "pB"],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": { "radius": 1, "preserveColorOnHighlight": true }
    }
  ],
  "relations": [],
  "steps": [
    {
      "id": "step-triangulo",
      "label": "Triángulo isósceles con AB = AC",
      "description": "En un triángulo isósceles ABC, los lados AB y AC son congruentes.",
      "visibleTargets": ["polyABC", "ladoAB", "ladoAC"],
      "durationMs": 1000
    },
    {
      "id": "step-bisectriz",
      "label": "Construcción de la bisectriz AD",
      "description": "Se traza la bisectriz del ángulo en A, que corta a la base en el punto D.",
      "visibleTargets": ["bisectriz", "pD"],
      "durationMs": 1000
    },
    {
      "id": "step-congruencia",
      "label": "Congruencia de triángulos (ABD ≅ ACD)",
      "description": "Por el criterio LAL (AB=AC, ∠BAD=∠CAD, AD=AD), los triángulos ABD y ACD son congruentes.",
      "visibleTargets": ["polyABD", "polyACD"],
      "durationMs": 1000
    },
    {
      "id": "step-angulos-base",
      "label": "Igualdad de los ángulos de la base",
      "description": "Como consecuencia de la congruencia, los ángulos de la base β y γ son congruentes.",
      "visibleTargets": ["anguloB", "anguloC"],
      "durationMs": 1000
    }
  ],
  "note": "Arrastra el vértice A a lo largo del eje de simetría para cambiar la altura del triángulo.",
  "translations": {
    "eu": {
      "title": "Triangelu isoszelearen teorema",
      "note": "Arrastatu A erpina simetria-ardatzean zehar triangeluaren altuera aldatzeko.",
      "steps": {
        "step-triangulo": {
          "label": "AB = AC dituen triangelu isoszelea",
          "description": "ABC triangelu isoszele batean, AB eta AC aldeak kongruenteak dira."
        },
        "step-bisectriz": {
          "label": "AD erdibitzailearen eraikuntza",
          "description": "A-ko angeluaren erdibitzailea marrazten da, oinarria D puntuan ebakiz."
        },
        "step-angulos-base": {
          "label": "Oinarriko angeluen berdintasuna",
          "description": "Kongruentziaren ondorioz, oinarriko β eta γ angeluak kongruenteak dira."
        }
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const DemoTrianguloIsosceles = () => (
  <DiagramRenderer spec={DemoTrianguloIsoscelesSpec} />
);
