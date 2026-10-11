import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const SemiplanoSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Semiplano",
  "componentId": "semiplano",
  "category": "Definiciones",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "showLabels": true,
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
    "minZoom": 0.2,
    "maxZoom": 8,
    "padding": 0.16
  },
  "layers": [
    {
      "id": "background",
      "label": "Regiones",
      "order": 0,
      "visible": true,
      "locked": false
    },
    {
      "id": "geometry",
      "label": "Geometría",
      "order": 1,
      "visible": true,
      "locked": false
    },
    {
      "id": "annotations",
      "label": "Anotaciones",
      "order": 2,
      "visible": true,
      "locked": false
    }
  ],
  "groups": [],
  "objects": [
    {
      "id": "pP1",
      "label": "P₁",
      "color": "carbon",
      "layerId": "geometry",
      "order": 10,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto frontera P₁",
        "role": "secondary"
      },
      "target": true,
      "targetId": "pP1",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -4,
        "y": -1
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 6,
        "labelVisible": false,
        "highlightSize": 9,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pP2",
      "label": "P₂",
      "color": "carbon",
      "layerId": "geometry",
      "order": 15,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto frontera P₂",
        "role": "secondary"
      },
      "target": true,
      "targetId": "pP2",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 4,
        "y": 1
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 6,
        "labelVisible": false,
        "highlightSize": 9,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "lineL",
      "label": "ℓ",
      "color": "carbon",
      "layerId": "geometry",
      "order": 5,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta borde ℓ",
        "role": "primary"
      },
      "target": true,
      "targetId": "recta-l",
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "through-points",
          "points": [
            "pP1",
            "pP2"
          ]
        }
      },
      "appearance": {
        "strokeWidth": 2.6,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pA",
      "label": "A",
      "color": "terracota",
      "layerId": "geometry",
      "order": 20,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto A en el semiplano H₁",
        "role": "primary"
      },
      "target": true,
      "targetId": "pA",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -1.5,
        "y": 2.5
      },
      "mobility": {
        "type": "constrained",
        "relationIds": [
          "relSameH1A"
        ]
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pB",
      "label": "B",
      "color": "terracota",
      "layerId": "geometry",
      "order": 25,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto B en el semiplano H₁",
        "role": "primary"
      },
      "target": true,
      "targetId": "pB",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.5,
        "y": 2.8
      },
      "mobility": {
        "type": "constrained",
        "relationIds": [
          "relSameH1B"
        ]
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "pC",
      "label": "C",
      "color": "pavo",
      "layerId": "geometry",
      "order": 30,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto C en el semiplano H₂",
        "role": "primary"
      },
      "target": true,
      "targetId": "pC",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0.5,
        "y": -3
      },
      "mobility": {
        "type": "constrained",
        "relationIds": [
          "relSameH2C"
        ]
      },
      "appearance": {
        "size": 7,
        "labelVisible": true,
        "highlightSize": 10,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    },
    {
      "id": "areaH1",
      "label": "H₁",
      "color": "terracota",
      "layerId": "background",
      "order": 0,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Semiplano H₁",
        "role": "primary"
      },
      "target": true,
      "targetId": "semiplano-1",
      "objectType": "area",
      "geometry": {
        "type": "half-plane",
        "boundary": [
          "pP1",
          "pP2"
        ],
        "side": "pA"
      },
      "appearance": {
        "fillOpacity": 0.15,
        "strokeWidth": 0,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "areaH2",
      "label": "H₂",
      "color": "pavo",
      "layerId": "background",
      "order": 1,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Semiplano H₂",
        "role": "primary"
      },
      "target": true,
      "targetId": "semiplano-2",
      "objectType": "area",
      "geometry": {
        "type": "half-plane",
        "boundary": [
          "pP1",
          "pP2"
        ],
        "side": "pC"
      },
      "appearance": {
        "fillOpacity": 0.15,
        "strokeWidth": 0,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "segAB",
      "label": "AB",
      "color": "terracota",
      "layerId": "geometry",
      "order": 35,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento AB contenido en H₁",
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
      "id": "lineAC",
      "label": "Recta AC",
      "color": "granada",
      "layerId": "geometry",
      "order": 38,
      "visible": false,
      "locked": true,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "role": "construction"
      },
      "target": false,
      "objectType": "path",
      "geometry": {
        "type": "line",
        "construction": {
          "type": "through-points",
          "points": [
            "pA",
            "pC"
          ]
        }
      },
      "appearance": {
        "strokeWidth": 1
      }
    },
    {
      "id": "segAC",
      "label": "AC",
      "color": "granada",
      "layerId": "geometry",
      "order": 40,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Segmento AC que corta a la recta ℓ",
        "role": "primary"
      },
      "target": true,
      "targetId": "segAC",
      "objectType": "path",
      "geometry": {
        "type": "segment",
        "points": [
          "pA",
          "pC"
        ]
      },
      "appearance": {
        "dashed": true,
        "strokeWidth": 2.2,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "pX",
      "label": "X",
      "color": "granada",
      "layerId": "geometry",
      "order": 50,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto de corte X entre AC y ℓ",
        "role": "primary"
      },
      "target": true,
      "targetId": "pX",
      "objectType": "point",
      "definition": {
        "type": "intersection",
        "supports": [
          "lineL",
          "lineAC"
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 6,
        "labelVisible": true,
        "highlightSize": 9,
        "preserveColorOnHighlight": true
      },
      "interaction": {}
    }
  ],
  "relations": [
    {
      "id": "relSameH1A",
      "label": "A permanece en el semiplano H₁",
      "enabled": true,
      "type": "same-half-plane",
      "points": [
        "pA",
        "pP1"
      ],
      "boundary": "pP2",
      "side": 1
    },
    {
      "id": "relSameH1B",
      "label": "B permanece en el semiplano H₁",
      "enabled": true,
      "type": "same-half-plane",
      "points": [
        "pB",
        "pP1"
      ],
      "boundary": "pP2",
      "side": 1
    },
    {
      "id": "relSameH2C",
      "label": "C permanece en el semiplano H₂",
      "enabled": true,
      "type": "same-half-plane",
      "points": [
        "pC",
        "pP1"
      ],
      "boundary": "pP2",
      "side": -1
    }
  ],
  "steps": [],
  "note": "Arrastra A y B dentro de H₁: su segmento AB nunca cruza la frontera ℓ (convexidad). El punto C está en el semiplano opuesto H₂, por lo que el segmento AC siempre corta a ℓ en el punto X (separación del plano).",
  "translations": {
    "eu": {
      "title": "Planoerdia",
      "note": "Mugitu A eta B H₁ barruan: haien AB zuzenkiak ez du inoiz ℓ ertz-zuzena ebakitzen (ganbiltasuna). C puntua kontrako H₂ planoerdian dago; beraz, AC zuzenkiak beti ebakitzen du ℓ X puntuan (planoaren banaketa)."
    },
    "en": {
      "title": "Half-Plane",
      "note": "Drag A and B within H₁: their segment AB never crosses the boundary line ℓ (convexity). Point C lies in the opposite half-plane H₂, so segment AC always intersects ℓ at point X (plane separation)."
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const Semiplano = () => <DiagramRenderer spec={SemiplanoSpec} />;
