import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const DemoTrianguloIsoscelesSpec = createDiagramSpec({
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Demostración de Pappus: Teorema del triángulo isósceles",
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
      "appearance": { "fillOpacity": 0.12, "strokeWidth": 1, "preserveColorOnHighlight": true }
    },
    {
      "id": "congruenceMarkAB",
      "label": "Marca AB",
      "color": "terracota",
      "layerId": "geometry",
      "order": 25,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Marca de congruencia en AB", "role": "secondary" },
      "target": true,
      "targetId": "congruenceMarkAB",
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": ["pA", "pB"]
      },
      "count": 2,
      "height": 0.5,
      "appearance": { "preserveColorOnHighlight": true }
    },
    {
      "id": "congruenceMarkAC",
      "label": "Marca AC",
      "color": "terracota",
      "layerId": "geometry",
      "order": 26,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Marca de congruencia en AC", "role": "secondary" },
      "target": true,
      "targetId": "congruenceMarkAC",
      "objectType": "mark",
      "variant": "congruence",
      "anchor": {
        "type": "between-points",
        "points": ["pA", "pC"]
      },
      "count": 2,
      "height": 0.5,
      "appearance": { "preserveColorOnHighlight": true }
    },
    {
      "id": "anguloA",
      "label": "Ángulo α en A",
      "color": "ocre",
      "layerId": "geometry",
      "order": 22,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "ariaLabel": "Ángulo en el vértice A", "role": "secondary" },
      "target": true,
      "targetId": "anguloA",
      "objectType": "angle",
      "points": ["pB", "pA", "pC"],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": { "radius": 0.9, "preserveColorOnHighlight": true }
    },
    {
      "id": "anguloB",
      "label": "Ángulo en B",
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
      "label": "Ángulo en C",
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
      "label": "Triángulo isósceles con AB ≅ AC",
      "description": "Sea △ABC un triángulo donde los lados AB y AC son congruentes por hipótesis.",
      "visibleTargets": [
        "pA",
        "pB",
        "pC",
        "ladoAB",
        "ladoAC",
        "ladoBC",
        "polyABC",
        "congruenceMarkAB",
        "congruenceMarkAC"
      ],
      "durationMs": 1000,
      "objectStates": {
        "ladoAB": { "emphasis": "primary" },
        "ladoAC": { "emphasis": "primary" },
        "congruenceMarkAB": { "emphasis": "primary" },
        "congruenceMarkAC": { "emphasis": "primary" },
        "polyABC": { "emphasis": "secondary" },
        "pA": { "emphasis": "secondary" },
        "pB": { "emphasis": "secondary" },
        "pC": { "emphasis": "secondary" },
        "ladoBC": { "emphasis": "none" }
      }
    },
    {
      "id": "step-angulo-vertice",
      "label": "Reflexividad del ángulo en el vértice (Axioma III.4)",
      "description": "El ángulo interior en el vértice A es idéntico a sí mismo y satisface ∠BAC ≅ ∠CAB por reflexividad de la congruencia angular.",
      "visibleTargets": [
        "pA",
        "pB",
        "pC",
        "ladoAB",
        "ladoAC",
        "ladoBC",
        "polyABC",
        "congruenceMarkAB",
        "congruenceMarkAC",
        "anguloA"
      ],
      "durationMs": 1000,
      "objectStates": {
        "anguloA": { "emphasis": "primary" },
        "pA": { "emphasis": "primary" },
        "ladoAB": { "emphasis": "secondary" },
        "ladoAC": { "emphasis": "secondary" },
        "congruenceMarkAB": { "emphasis": "secondary" },
        "congruenceMarkAC": { "emphasis": "secondary" },
        "polyABC": { "emphasis": "none" },
        "ladoBC": { "emphasis": "none" },
        "pB": { "emphasis": "none" },
        "pC": { "emphasis": "none" }
      }
    },
    {
      "id": "step-correspondencia",
      "label": "Correspondencia de Pappus y verificación de III.5",
      "description": "Al comparar △ABC con su permutación △ACB (A↔A, B↔C, C↔B), se cumple AB ≅ AC, ∠BAC ≅ ∠CAB y AC ≅ AB (por simetría).",
      "visibleTargets": [
        "pA",
        "pB",
        "pC",
        "ladoAB",
        "ladoAC",
        "ladoBC",
        "polyABC",
        "congruenceMarkAB",
        "congruenceMarkAC",
        "anguloA"
      ],
      "durationMs": 1000,
      "objectStates": {
        "ladoAB": { "emphasis": "primary" },
        "ladoAC": { "emphasis": "primary" },
        "congruenceMarkAB": { "emphasis": "primary" },
        "congruenceMarkAC": { "emphasis": "primary" },
        "anguloA": { "emphasis": "primary" },
        "pA": { "emphasis": "primary" },
        "pB": { "emphasis": "secondary" },
        "pC": { "emphasis": "secondary" },
        "polyABC": { "emphasis": "secondary" },
        "ladoBC": { "emphasis": "none" }
      }
    },
    {
      "id": "step-angulos-base",
      "label": "Congruencia de los ángulos de la base (Axioma III.5)",
      "description": "Por aplicación directa del Axioma III.5 de Hilbert, los ángulos homólogos opuestos son congruentes: ∠ABC ≅ ∠ACB.",
      "visibleTargets": [
        "pA",
        "pB",
        "pC",
        "ladoAB",
        "ladoAC",
        "ladoBC",
        "polyABC",
        "congruenceMarkAB",
        "congruenceMarkAC",
        "anguloA",
        "anguloB",
        "anguloC"
      ],
      "durationMs": 1000,
      "objectStates": {
        "anguloB": { "emphasis": "primary" },
        "anguloC": { "emphasis": "primary" },
        "pB": { "emphasis": "primary" },
        "pC": { "emphasis": "primary" },
        "ladoBC": { "emphasis": "secondary" },
        "ladoAB": { "emphasis": "secondary" },
        "ladoAC": { "emphasis": "secondary" },
        "congruenceMarkAB": { "emphasis": "none" },
        "congruenceMarkAC": { "emphasis": "none" },
        "anguloA": { "emphasis": "none" },
        "polyABC": { "emphasis": "none" },
        "pA": { "emphasis": "none" }
      }
    }
  ],
  "note": "Arrastra el vértice A a lo largo del eje de simetría para cambiar la altura del triángulo.",
  "translations": {
    "eu": {
      "title": "Triangelu isoszelearen teorema (Papusen frogapena)",
      "note": "Arrastatu A erpina simetria-ardatzean zehar triangeluaren altuera aldatzeko.",
      "steps": {
        "step-triangulo": {
          "label": "AB ≅ AC alde kongruenteak dituen triangelu isoszelea",
          "description": "Izan bedi △ABC triangelua, non AB eta AC aldeak kongruenteak diren hasierako hipotesiz."
        },
        "step-angulo-vertice": {
          "label": "Erpineko angeluaren erreflexibotasuna (III.4 Axioma)",
          "description": "A erpineko barne-angelua bere buruaren berdina da eta ∠BAC ≅ ∠CAB betetzen du erreflexibotasunez."
        },
        "step-correspondencia": {
          "label": "Papusen korrespondentzia eta III.5-aren egiaztapena",
          "description": "△ABC eta bere △ACB permutazioa alderatuz (A↔A, B↔C, C↔B), AB ≅ AC, ∠BAC ≅ ∠CAB eta AC ≅ AB betetzen dira."
        },
        "step-angulos-base": {
          "label": "Oinarriko angeluen kongruentzia (III.5 Axioma)",
          "description": "Hilbert-en III.5 Axioma zuzenean aplikatuz, B eta C erpinetako angelu homologoak kongruenteak dira: ∠ABC ≅ ∠ACB."
        }
      }
    },
    "en": {
      "title": "Isosceles Triangle Theorem (Pappus's Proof)",
      "note": "Drag vertex A along the symmetry axis to adjust the triangle height.",
      "steps": {
        "step-triangulo": {
          "label": "Isosceles triangle with congruent sides AB ≅ AC",
          "description": "Let △ABC be a triangle where sides AB and AC are congruent by hypothesis."
        },
        "step-angulo-vertice": {
          "label": "Reflexivity of the vertex angle (Axiom III.4)",
          "description": "The interior angle at vertex A is identical to itself and satisfies ∠BAC ≅ ∠CAB by reflexivity."
        },
        "step-correspondencia": {
          "label": "Pappus correspondence and verification of III.5",
          "description": "Comparing △ABC with its permutation △ACB (A↔A, B↔C, C↔B), we have AB ≅ AC, ∠BAC ≅ ∠CAB, and AC ≅ AB."
        },
        "step-angulos-base": {
          "label": "Congruence of base angles (Axiom III.5)",
          "description": "By direct application of Hilbert's Axiom III.5, the corresponding homologous angles are congruent: ∠ABC ≅ ∠ACB."
        }
      }
    }
  }
});
/* @matematika-diagram-spec:end */

export const DemoTrianguloIsosceles = () => (
  <DiagramRenderer spec={DemoTrianguloIsoscelesSpec} />
);
