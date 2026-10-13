import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const EjemploPitagorasCalculoSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Cálculo de la hipotenusa (Terna 5, 12, 13)",
  "componentId": "ejemplo-pitagoras-calculo",
  "category": "Ejercicios",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "showLabels": true,
  "viewport": {
    "bounds": [
      -7,
      19,
      21,
      -14
    ],
    "home": [
      -7,
      19,
      21,
      -14
    ],
    "minZoom": 0.2,
    "maxZoom": 10,
    "padding": 0.16
  },
  "layers": [
    {
      "id": "geometry",
      "label": "Geometría",
      "order": 0,
      "visible": true,
      "locked": false
    },
    {
      "id": "annotations",
      "label": "Anotaciones",
      "order": 1,
      "visible": true,
      "locked": false
    }
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
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértice C (Ángulo recto)",
        "role": "primary"
      },
      "target": true,
      "targetId": "pC",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0,
        "y": 0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
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
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértice A",
        "role": "primary"
      },
      "target": true,
      "targetId": "pA",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0,
        "y": 5
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
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
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértice B",
        "role": "primary"
      },
      "target": true,
      "targetId": "pB",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 12,
        "y": 0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
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
      "selection": {
        "selectable": false,
        "ariaLabel": "Vértice auxiliar del cuadrado b²",
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -5,
        "y": 5
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
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
      "selection": {
        "selectable": false,
        "ariaLabel": "Vértice auxiliar del cuadrado b²",
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -5,
        "y": 0
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
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
      "selection": {
        "selectable": false,
        "ariaLabel": "Vértice auxiliar del cuadrado a²",
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0,
        "y": -12
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
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
      "selection": {
        "selectable": false,
        "ariaLabel": "Vértice auxiliar del cuadrado a²",
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 12,
        "y": -12
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
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
      "selection": {
        "selectable": false,
        "ariaLabel": "Vértice auxiliar del cuadrado c²",
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 17,
        "y": 12
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
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
      "selection": {
        "selectable": false,
        "ariaLabel": "Vértice auxiliar del cuadrado c²",
        "role": "construction"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 5,
        "y": 17
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {},
      "interaction": {}
    },
    {
      "id": "segCA",
      "label": "Cateto b = 5",
      "color": "canela",
      "layerId": "geometry",
      "order": 10,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Cateto b de longitud 5",
        "role": "primary"
      },
      "target": true,
      "targetId": "segCA",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pC",
          "pA"
        ]
      },
      "appearance": {
        "strokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segBC",
      "label": "Cateto a = 12",
      "color": "terracota",
      "layerId": "geometry",
      "order": 11,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Cateto a de longitud 12",
        "role": "primary"
      },
      "target": true,
      "targetId": "segBC",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pB",
          "pC"
        ]
      },
      "appearance": {
        "strokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segAB",
      "label": "Hipotenusa c = 13",
      "color": "mora",
      "layerId": "geometry",
      "order": 12,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Hipotenusa c de longitud 13",
        "role": "primary"
      },
      "target": true,
      "targetId": "segAB",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pA",
          "pB"
        ]
      },
      "appearance": {
        "strokeWidth": 3,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "polyABC",
      "label": "Triángulo (5, 12, 13)",
      "color": "carbon",
      "layerId": "geometry",
      "order": 5,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo rectángulo 5-12-13",
        "role": "primary"
      },
      "target": true,
      "targetId": "polyABC",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "pA",
          "pB",
          "pC"
        ]
      },
      "appearance": {
        "strokeWidth": 1,
        "fillOpacity": 0.08,
        "preserveColorOnHighlight": true
      }
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
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo recto en C",
        "role": "secondary"
      },
      "target": true,
      "targetId": "rightAng",
      "objectType": "angle",
      "points": [
        "pB",
        "pC",
        "pA"
      ],
      "sweep": "non-reflex",
      "marker": "arc",
      "appearance": {
        "radius": 0.6,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "sqCA",
      "label": "Cuadrado b² = 25",
      "color": "canela",
      "layerId": "geometry",
      "order": 6,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Cuadrado de área b² = 25",
        "role": "secondary"
      },
      "target": true,
      "targetId": "sqCA",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "pC",
          "pA",
          "pA_sq",
          "pC_sq"
        ]
      },
      "appearance": {
        "strokeWidth": 1.5,
        "fillOpacity": 0.15,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "sqBC",
      "label": "Cuadrado a² = 144",
      "color": "terracota",
      "layerId": "geometry",
      "order": 7,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Cuadrado de área a² = 144",
        "role": "secondary"
      },
      "target": true,
      "targetId": "sqBC",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "pB",
          "pC",
          "pC_sq2",
          "pB_sq2"
        ]
      },
      "appearance": {
        "strokeWidth": 1.5,
        "fillOpacity": 0.15,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "sqAB",
      "label": "Cuadrado c² = 169",
      "color": "mora",
      "layerId": "geometry",
      "order": 8,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Cuadrado de área c² = 169",
        "role": "secondary"
      },
      "target": true,
      "targetId": "sqAB",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "pA",
          "pB",
          "pB_sq3",
          "pA_sq3"
        ]
      },
      "appearance": {
        "strokeWidth": 1.5,
        "fillOpacity": 0.15,
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [],
  "steps": [
    {
      "id": "datos",
      "label": "Datos del problema (a = 12, b = 5)",
      "description": "Dado un triángulo rectángulo con catetos a = 12 y b = 5, se busca la hipotenusa c.",
      "visibleTargets": [
        "segCA",
        "segBC",
        "segAB"
      ],
      "durationMs": 1000
    },
    {
      "id": "calculo",
      "label": "Cálculo de áreas (a² + b² = c²)",
      "description": "Se calculan las áreas a² = 144 y b² = 25. Su suma a² + b² = 169 es el área c².",
      "visibleTargets": [
        "sqCA",
        "sqBC",
        "sqAB"
      ],
      "durationMs": 1000
    },
    {
      "id": "resolucion",
      "label": "Resolución: c = √169 = 13",
      "description": "Extrayendo la raíz cuadrada del área c² = 169 obtenemos que la hipotenusa mide c = 13.",
      "visibleTargets": [
        "segAB",
        "sqAB"
      ],
      "durationMs": 1000
    },
    {
      "id": "terna",
      "label": "Terna pitagórica (5, 12, 13)",
      "description": "Los tres números enteros (5, 12, 13) forman una terna pitagórica exacta.",
      "visibleTargets": [
        "polyABC",
        "sqCA",
        "sqBC",
        "sqAB"
      ],
      "durationMs": 1000
    }
  ],
  "note": "Destaca cada cuadrado o lado para examinar la terna pitagórica (5, 12, 13).",
  "translations": {
    "eu": {
      "title": "Hipotenusaren kalkulua (5, 12, 13 hirukotea)",
      "note": "Nabarmendu karratu edo alde bakoitza (5, 12, 13) hirukote pitagorikoa aztertzeko.",
      "steps": {
        "datos": {
          "label": "Ariketaren datuak (a = 12, b = 5)",
          "description": "a = 12 eta b = 5 katetoak dituen triangelu angeluzuzenaren c hipotenusa kalkulatu nahi da."
        },
        "calculo": {
          "label": "Azaleren kalkulua (a² + b² = c²)",
          "description": "a² = 144 eta b² = 25 azalerak kalkulatzen dira; haien batura, a² + b² = 169, c² azalera da."
        },
        "resolucion": {
          "label": "Ebazpena: c = √169 = 13",
          "description": "c² = 169 azaleraren erro karratua eginez hipotenusak c = 13 neurtzen duela lortzen da."
        },
        "terna": {
          "label": "Hirukote pitagoriarra (5, 12, 13)",
          "description": "(5, 12, 13) hiru zenbaki osoek hirukote pitagoriar zehatza osatzen dute."
        }
      },
      "ariaLabels": {
        "pC": "C erpina (angelu zuzena)",
        "pA": "A erpina",
        "pB": "B erpina",
        "pA_sq": "b² karratuaren erpin laguntzailea",
        "pC_sq": "b² karratuaren erpin laguntzailea",
        "pC_sq2": "a² karratuaren erpin laguntzailea",
        "pB_sq2": "a² karratuaren erpin laguntzailea",
        "pB_sq3": "c² karratuaren erpin laguntzailea",
        "pA_sq3": "c² karratuaren erpin laguntzailea",
        "segCA": "5 luzerako b katetoa",
        "segBC": "12 luzerako a katetoa",
        "segAB": "13 luzerako c hipotenusa",
        "polyABC": "5-12-13 triangelu zuzena",
        "rightAng": "Angelu zuzena C-n",
        "sqCA": "b² = 25 azalerako karratua",
        "sqBC": "a² = 144 azalerako karratua",
        "sqAB": "c² = 169 azalerako karratua"
      }
    },
    "en": {
      "title": "Computing the hypotenuse (triple 5, 12, 13)",
      "note": "Highlight each square or side to examine the Pythagorean triple (5, 12, 13).",
      "steps": {
        "datos": {
          "label": "Problem data (a = 12, b = 5)",
          "description": "Given a right triangle with legs a = 12 and b = 5, we look for the hypotenuse c."
        },
        "calculo": {
          "label": "Computing areas (a² + b² = c²)",
          "description": "The areas a² = 144 and b² = 25 are computed. Their sum a² + b² = 169 is the area c²."
        },
        "resolucion": {
          "label": "Solution: c = √169 = 13",
          "description": "Taking the square root of the area c² = 169 we get that the hypotenuse measures c = 13."
        },
        "terna": {
          "label": "Pythagorean triple (5, 12, 13)",
          "description": "The three integers (5, 12, 13) form an exact Pythagorean triple."
        }
      },
      "ariaLabels": {
        "pC": "Vertex C (right angle)",
        "pA": "Vertex A",
        "pB": "Vertex B",
        "pA_sq": "Auxiliary vertex of square b²",
        "pC_sq": "Auxiliary vertex of square b²",
        "pC_sq2": "Auxiliary vertex of square a²",
        "pB_sq2": "Auxiliary vertex of square a²",
        "pB_sq3": "Auxiliary vertex of square c²",
        "pA_sq3": "Auxiliary vertex of square c²",
        "segCA": "Leg b of length 5",
        "segBC": "Leg a of length 12",
        "segAB": "Hypotenuse c of length 13",
        "polyABC": "5-12-13 right triangle",
        "rightAng": "Right angle at C",
        "sqCA": "Square of area b² = 25",
        "sqBC": "Square of area a² = 144",
        "sqAB": "Square of area c² = 169"
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const EjemploPitagorasCalculo = () => <DiagramRenderer spec={EjemploPitagorasCalculoSpec} />;
