import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const CongruenciaTriangulosSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Congruencia de triángulos",
  "componentId": "congruencia-triangulos",
  "category": "Definiciones",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "viewport": {
    "bounds": [
      -6,
      4.5,
      6,
      -4.5
    ],
    "home": [
      -6,
      4.5,
      6,
      -4.5
    ],
    "minZoom": 0.45,
    "maxZoom": 5,
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
  "groups": [
    {
      "id": "sidesAB",
      "label": "Lados homólogos AB y A'B'",
      "memberIds": [
        "segAB",
        "segAABB"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Lados homólogos AB y A'B'",
        "role": "primary"
      },
      "target": true,
      "targetId": "sidesAB",
      "color": "terracota"
    },
    {
      "id": "sidesBC",
      "label": "Lados homólogos BC y B'C'",
      "memberIds": [
        "segBC",
        "segBBCC"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Lados homólogos BC y B'C'",
        "role": "primary"
      },
      "target": true,
      "targetId": "sidesBC",
      "color": "pavo"
    },
    {
      "id": "sidesCA",
      "label": "Lados homólogos CA y C'A'",
      "memberIds": [
        "segCA",
        "segCCAA"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Lados homólogos CA y C'A'",
        "role": "primary"
      },
      "target": true,
      "targetId": "sidesCA",
      "color": "canela"
    },
    {
      "id": "anglesA",
      "label": "Ángulos homólogos en A y A'",
      "memberIds": [
        "angA",
        "angAA"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulos homólogos en A y A'",
        "role": "primary"
      },
      "target": true,
      "targetId": "anglesA",
      "color": "terracota"
    },
    {
      "id": "anglesB",
      "label": "Ángulos homólogos en B y B'",
      "memberIds": [
        "angB",
        "angBB"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulos homólogos en B y B'",
        "role": "primary"
      },
      "target": true,
      "targetId": "anglesB",
      "color": "pavo"
    },
    {
      "id": "anglesC",
      "label": "Ángulos homólogos en C y C'",
      "memberIds": [
        "angC",
        "angCC"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulos homólogos en C y C'",
        "role": "primary"
      },
      "target": true,
      "targetId": "anglesC",
      "color": "canela"
    },
    {
      "id": "gCongruenciaTotal",
      "label": "Congruencia completa △ABC ≅ △A'B'C'",
      "memberIds": [
        "polyABC",
        "polyAABBCC"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Congruencia completa entre △ABC y △A'B'C'",
        "role": "primary"
      },
      "target": true,
      "targetId": "congruencia-total",
      "color": "musgo"
    }
  ],
  "objects": [
    {
      "id": "pA",
      "label": "A",
      "color": "carbon",
      "layerId": "geometry",
      "order": 40,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el vértice A",
        "role": "primary"
      },
      "target": true,
      "targetId": "pA",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -4.8,
        "y": -1.8
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {
        "snapToGrid": false
      }
    },
    {
      "id": "pB",
      "label": "B",
      "color": "carbon",
      "layerId": "geometry",
      "order": 41,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el vértice B",
        "role": "primary"
      },
      "target": true,
      "targetId": "pB",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -1.6,
        "y": -1.8
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {
        "snapToGrid": false
      }
    },
    {
      "id": "pC",
      "label": "C",
      "color": "carbon",
      "layerId": "geometry",
      "order": 42,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el vértice C",
        "role": "primary"
      },
      "target": true,
      "targetId": "pC",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3.2,
        "y": 1.8
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {
        "snapToGrid": false
      }
    },
    {
      "id": "pAA",
      "label": "A'",
      "color": "carbon",
      "layerId": "geometry",
      "order": 43,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el triángulo A'B'C' desde el vértice A'",
        "role": "primary"
      },
      "target": true,
      "targetId": "pAA",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 1.2,
        "y": -1.8
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {
        "snapToGrid": false
      }
    },
    {
      "id": "pBB",
      "label": "B'",
      "color": "carbon",
      "layerId": "geometry",
      "order": 44,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértice dependiente B'",
        "role": "secondary"
      },
      "target": true,
      "targetId": "pBB",
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "pAA.x + pB.x - pA.x",
        "y": "pAA.y + pB.y - pA.y",
        "fallback": [
          4.4,
          -1.8
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pCC",
      "label": "C'",
      "color": "carbon",
      "layerId": "geometry",
      "order": 45,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Vértice dependiente C'",
        "role": "secondary"
      },
      "target": true,
      "targetId": "pCC",
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "pAA.x + pC.x - pA.x",
        "y": "pAA.y + pC.y - pA.y",
        "fallback": [
          2.8,
          1.8
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "polyABC",
      "label": "△ABC",
      "color": "musgo",
      "layerId": "geometry",
      "order": 10,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gCongruenciaTotal"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo ABC",
        "role": "primary"
      },
      "target": true,
      "targetId": "triangleABC",
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
        "fillOpacity": 0.12,
        "strokeWidth": 0,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "polyAABBCC",
      "label": "△A'B'C'",
      "color": "mora",
      "layerId": "geometry",
      "order": 11,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gCongruenciaTotal"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Triángulo homólogo A'B'C'",
        "role": "primary"
      },
      "target": true,
      "targetId": "triangleAABBCC",
      "objectType": "path",
      "geometry": {
        "type": "polygon",
        "points": [
          "pAA",
          "pBB",
          "pCC"
        ]
      },
      "appearance": {
        "fillOpacity": 0.12,
        "strokeWidth": 0,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segAB",
      "label": "AB",
      "color": "terracota",
      "layerId": "geometry",
      "order": 20,
      "visible": true,
      "locked": false,
      "groupIds": [
        "sidesAB"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado AB",
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
        "strokeWidth": 2.8,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segAABB",
      "label": "A'B'",
      "color": "terracota",
      "layerId": "geometry",
      "order": 21,
      "visible": true,
      "locked": false,
      "groupIds": [
        "sidesAB"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado A'B'",
        "role": "primary"
      },
      "target": true,
      "targetId": "segAABB",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pAA",
          "pBB"
        ]
      },
      "appearance": {
        "strokeWidth": 2.8,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segBC",
      "label": "BC",
      "color": "pavo",
      "layerId": "geometry",
      "order": 22,
      "visible": true,
      "locked": false,
      "groupIds": [
        "sidesBC"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado BC",
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
        "strokeWidth": 2.8,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segBBCC",
      "label": "B'C'",
      "color": "pavo",
      "layerId": "geometry",
      "order": 23,
      "visible": true,
      "locked": false,
      "groupIds": [
        "sidesBC"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado B'C'",
        "role": "primary"
      },
      "target": true,
      "targetId": "segBBCC",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pBB",
          "pCC"
        ]
      },
      "appearance": {
        "strokeWidth": 2.8,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segCA",
      "label": "CA",
      "color": "canela",
      "layerId": "geometry",
      "order": 24,
      "visible": true,
      "locked": false,
      "groupIds": [
        "sidesCA"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado CA",
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
        "strokeWidth": 2.8,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segCCAA",
      "label": "C'A'",
      "color": "canela",
      "layerId": "geometry",
      "order": 25,
      "visible": true,
      "locked": false,
      "groupIds": [
        "sidesCA"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Lado C'A'",
        "role": "primary"
      },
      "target": true,
      "targetId": "segCCAA",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pCC",
          "pAA"
        ]
      },
      "appearance": {
        "strokeWidth": 2.8,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "angA",
      "label": "α",
      "color": "terracota",
      "layerId": "geometry",
      "order": 30,
      "visible": true,
      "locked": false,
      "groupIds": [
        "anglesA"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo en A",
        "role": "secondary"
      },
      "target": true,
      "targetId": "angA",
      "objectType": "angle",
      "points": [
        "pB",
        "pA",
        "pC"
      ],
      "sweep": "non-reflex",
      "marker": "arc"
    },
    {
      "id": "angAA",
      "label": "α'",
      "color": "terracota",
      "layerId": "geometry",
      "order": 31,
      "visible": true,
      "locked": false,
      "groupIds": [
        "anglesA"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo homólogo en A'",
        "role": "secondary"
      },
      "target": true,
      "targetId": "angAA",
      "objectType": "angle",
      "points": [
        "pBB",
        "pAA",
        "pCC"
      ],
      "sweep": "non-reflex",
      "marker": "arc"
    },
    {
      "id": "angB",
      "label": "β",
      "color": "pavo",
      "layerId": "geometry",
      "order": 32,
      "visible": true,
      "locked": false,
      "groupIds": [
        "anglesB"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo en B",
        "role": "secondary"
      },
      "target": true,
      "targetId": "angB",
      "objectType": "angle",
      "points": [
        "pC",
        "pB",
        "pA"
      ],
      "sweep": "non-reflex",
      "marker": "arc"
    },
    {
      "id": "angBB",
      "label": "β'",
      "color": "pavo",
      "layerId": "geometry",
      "order": 33,
      "visible": true,
      "locked": false,
      "groupIds": [
        "anglesB"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo homólogo en B'",
        "role": "secondary"
      },
      "target": true,
      "targetId": "angBB",
      "objectType": "angle",
      "points": [
        "pCC",
        "pBB",
        "pAA"
      ],
      "sweep": "non-reflex",
      "marker": "arc"
    },
    {
      "id": "angC",
      "label": "γ",
      "color": "canela",
      "layerId": "geometry",
      "order": 34,
      "visible": true,
      "locked": false,
      "groupIds": [
        "anglesC"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo en C",
        "role": "secondary"
      },
      "target": true,
      "targetId": "angC",
      "objectType": "angle",
      "points": [
        "pA",
        "pC",
        "pB"
      ],
      "sweep": "non-reflex",
      "marker": "arc"
    },
    {
      "id": "angCC",
      "label": "γ'",
      "color": "canela",
      "layerId": "geometry",
      "order": 35,
      "visible": true,
      "locked": false,
      "groupIds": [
        "anglesC"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Ángulo homólogo en C'",
        "role": "secondary"
      },
      "target": true,
      "targetId": "angCC",
      "objectType": "angle",
      "points": [
        "pAA",
        "pCC",
        "pBB"
      ],
      "sweep": "non-reflex",
      "marker": "arc"
    }
  ],
  "relations": [],
  "steps": [],
  "note": "Arrastra los vértices A, B o C para modificar la forma de ambos triángulos, o arrastra A' para desplazar el segundo triángulo manteniendo la congruencia exacta.",
  "translations": {
    "eu": {
      "title": "Triangeluen kongruentzia",
      "note": "Arrastatu A, B edo C erpinak bi triangeluen forma aldatzeko, edo arrastatu A' bigarren triangelua mugitzeko kongruentzia zehatza mantenduz.",
      "ariaLabels": {
        "pA": "Mugitu A erpina",
        "pB": "Mugitu B erpina",
        "pC": "Mugitu C erpina",
        "pAA": "Mugitu A'B'C' triangelua A' erpinetik",
        "pBB": "B' erpin mendekoa",
        "pCC": "C' erpin mendekoa",
        "polyABC": "ABC triangelua",
        "polyAABBCC": "A'B'C' triangelu homologoa",
        "segAB": "AB aldea",
        "segAABB": "A'B' aldea",
        "segBC": "BC aldea",
        "segBBCC": "B'C' aldea",
        "segCA": "CA aldea",
        "segCCAA": "C'A' aldea",
        "angA": "Angelu A erpinean",
        "angAA": "Angelu homologoa A' erpinean",
        "angB": "Angelu B erpinean",
        "angBB": "Angelu homologoa B' erpinean",
        "angC": "Angelu C erpinean",
        "angCC": "Angelu homologoa C' erpinean",
        "sidesAB": "AB eta A'B' alde homologoak",
        "sidesBC": "BC eta B'C' alde homologoak",
        "sidesCA": "CA eta C'A' alde homologoak",
        "anglesA": "Angelu homologoak A eta A' erpinetan",
        "anglesB": "Angelu homologoak B eta B' erpinetan",
        "anglesC": "Angelu homologoak C eta C' erpinetan",
        "gCongruenciaTotal": "Kongruentzia osoa △ABC eta △A'B'C' artean"
      }
    },
    "en": {
      "title": "Triangle Congruence",
      "note": "Drag vertices A, B, or C to modify the shape of both triangles, or drag A' to translate the second triangle while preserving exact congruence.",
      "ariaLabels": {
        "pA": "Move vertex A",
        "pB": "Move vertex B",
        "pC": "Move vertex C",
        "pAA": "Move triangle A'B'C' from vertex A'",
        "pBB": "Dependent vertex B'",
        "pCC": "Dependent vertex C'",
        "polyABC": "Triangle ABC",
        "polyAABBCC": "Homologous triangle A'B'C'",
        "segAB": "Side AB",
        "segAABB": "Side A'B'",
        "segBC": "Side BC",
        "segBBCC": "Side B'C'",
        "segCA": "Side CA",
        "segCCAA": "Side C'A'",
        "angA": "Angle at vertex A",
        "angAA": "Homologous angle at vertex A'",
        "angB": "Angle at vertex B",
        "angBB": "Homologous angle at vertex B'",
        "angC": "Angle at vertex C",
        "angCC": "Homologous angle at vertex C'",
        "sidesAB": "Homologous sides AB and A'B'",
        "sidesBC": "Homologous sides BC and B'C'",
        "sidesCA": "Homologous sides CA and C'A'",
        "anglesA": "Homologous angles at A and A'",
        "anglesB": "Homologous angles at B and B'",
        "anglesC": "Homologous angles at C and C'",
        "gCongruenciaTotal": "Full congruence between △ABC and △A'B'C'"
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const CongruenciaTriangulos = () => <DiagramRenderer spec={CongruenciaTriangulosSpec} />;
