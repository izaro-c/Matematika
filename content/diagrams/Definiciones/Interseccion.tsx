import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const InterseccionSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Intersección de dos conjuntos",
  "componentId": "interseccion",
  "category": "Definiciones",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "viewport": {
    "bounds": [
      -4.4,
      2.75,
      4.4,
      -2.6
    ],
    "home": [
      -4.4,
      2.75,
      4.4,
      -2.6
    ],
    "minZoom": 0.6,
    "maxZoom": 4,
    "padding": 0.06
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
      "id": "cA",
      "label": "Centro de A",
      "color": "terracota",
      "layerId": "geometry",
      "order": 10,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el conjunto A",
        "role": "primary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -1.0,
        "y": 0.0
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 4,
        "labelVisible": false,
        "highlightSize": 7,
        "preserveColorOnHighlight": true
      },
      "interaction": {
        "snapToGrid": false
      }
    },
    {
      "id": "cB",
      "label": "Centro de B",
      "color": "pavo",
      "layerId": "geometry",
      "order": 11,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el conjunto B",
        "role": "primary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 1.3,
        "y": 0.0
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 4,
        "labelVisible": false,
        "highlightSize": 7,
        "preserveColorOnHighlight": true
      },
      "interaction": {
        "snapToGrid": false
      }
    },
    {
      "id": "rA",
      "label": "Borde de A",
      "color": "carbon",
      "layerId": "annotations",
      "order": 12,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "ariaLabel": "Borde de A",
        "role": "secondary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "cA.x + 2.0",
        "y": "cA.y",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 2,
        "labelVisible": false
      }
    },
    {
      "id": "rB",
      "label": "Borde de B",
      "color": "carbon",
      "layerId": "annotations",
      "order": 13,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "ariaLabel": "Borde de B",
        "role": "secondary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "cB.x + 1.45",
        "y": "cB.y",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 2,
        "labelVisible": false
      }
    },
    {
      "id": "discoA",
      "label": "A",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Conjunto A",
        "role": "primary"
      },
      "target": true,
      "targetId": "conjuntoA",
      "objectType": "path",
      "geometry": {
        "type": "circle",
        "center": "cA",
        "point": "rA"
      },
      "appearance": {
        "strokeWidth": 2.25,
        "fillOpacity": 0.1,
        "highlightStrokeWidth": 3.5,
        "highlightFillOpacity": 0.22,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "discoB",
      "label": "B",
      "color": "pavo",
      "layerId": "geometry",
      "order": 2,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Conjunto B",
        "role": "primary"
      },
      "target": true,
      "targetId": "conjuntoB",
      "objectType": "path",
      "geometry": {
        "type": "circle",
        "center": "cB",
        "point": "rB"
      },
      "appearance": {
        "strokeWidth": 2.25,
        "fillOpacity": 0.1,
        "highlightStrokeWidth": 3.5,
        "highlightFillOpacity": 0.22,
        "labelVisible": true,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "areaAB",
      "label": "A ∩ B",
      "color": "mora",
      "layerId": "geometry",
      "order": 3,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Intersección de A y B",
        "role": "primary"
      },
      "target": true,
      "targetId": "interseccionAB",
      "objectType": "area",
      "geometry": {
        "type": "intersection",
        "areas": [
          "discoA",
          "discoB"
        ]
      },
      "appearance": {
        "strokeWidth": 0,
        "fillOpacity": 0.3,
        "highlightFillOpacity": 0.45,
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "enAmbos",
      "label": "Elementos de A ∩ B",
      "color": "carbon",
      "layerId": "annotations",
      "order": 14,
      "visible": false,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "ariaLabel": "Elementos de A ∩ B",
        "role": "secondary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "1 * and(lt(hypot(e1.x - cA.x, e1.y - cA.y), 2.0), lt(hypot(e1.x - cB.x, e1.y - cB.y), 1.45)) + 2 * and(lt(hypot(e2.x - cA.x, e2.y - cA.y), 2.0), lt(hypot(e2.x - cB.x, e2.y - cB.y), 1.45)) + 4 * and(lt(hypot(e3.x - cA.x, e3.y - cA.y), 2.0), lt(hypot(e3.x - cB.x, e3.y - cB.y), 1.45)) + 8 * and(lt(hypot(e4.x - cA.x, e4.y - cA.y), 2.0), lt(hypot(e4.x - cB.x, e4.y - cB.y), 1.45))",
        "y": "0",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 2,
        "labelVisible": false
      }
    },
    {
      "id": "halo-e1",
      "label": "Halo de 1",
      "color": "mora",
      "layerId": "geometry",
      "order": 30,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "ariaLabel": "Halo de 1",
        "role": "secondary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "e1.x",
        "y": "e1.y",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 12,
        "labelVisible": false,
        "opacity": 0.45
      },
      "visibleWhen": "and(lt(hypot(e1.x - cA.x, e1.y - cA.y), 2.0), lt(hypot(e1.x - cB.x, e1.y - cB.y), 1.45))"
    },
    {
      "id": "e1",
      "label": "1",
      "color": "carbon",
      "layerId": "geometry",
      "order": 40,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el elemento 1",
        "role": "primary"
      },
      "target": true,
      "targetId": "e1",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -2.35,
        "y": 0.55
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 5,
        "labelVisible": true,
        "highlightSize": 8,
        "preserveColorOnHighlight": true
      },
      "interaction": {
        "snapToGrid": false
      }
    },
    {
      "id": "halo-e2",
      "label": "Halo de 2",
      "color": "mora",
      "layerId": "geometry",
      "order": 31,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "ariaLabel": "Halo de 2",
        "role": "secondary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "e2.x",
        "y": "e2.y",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 12,
        "labelVisible": false,
        "opacity": 0.45
      },
      "visibleWhen": "and(lt(hypot(e2.x - cA.x, e2.y - cA.y), 2.0), lt(hypot(e2.x - cB.x, e2.y - cB.y), 1.45))"
    },
    {
      "id": "e2",
      "label": "2",
      "color": "carbon",
      "layerId": "geometry",
      "order": 41,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el elemento 2",
        "role": "primary"
      },
      "target": true,
      "targetId": "e2",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 0.05,
        "y": 0.35
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 5,
        "labelVisible": true,
        "highlightSize": 8,
        "preserveColorOnHighlight": true
      },
      "interaction": {
        "snapToGrid": false
      }
    },
    {
      "id": "halo-e3",
      "label": "Halo de 3",
      "color": "mora",
      "layerId": "geometry",
      "order": 32,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "ariaLabel": "Halo de 3",
        "role": "secondary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "e3.x",
        "y": "e3.y",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 12,
        "labelVisible": false,
        "opacity": 0.45
      },
      "visibleWhen": "and(lt(hypot(e3.x - cA.x, e3.y - cA.y), 2.0), lt(hypot(e3.x - cB.x, e3.y - cB.y), 1.45))"
    },
    {
      "id": "e3",
      "label": "3",
      "color": "carbon",
      "layerId": "geometry",
      "order": 42,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el elemento 3",
        "role": "primary"
      },
      "target": true,
      "targetId": "e3",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": 2.15,
        "y": -0.55
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 5,
        "labelVisible": true,
        "highlightSize": 8,
        "preserveColorOnHighlight": true
      },
      "interaction": {
        "snapToGrid": false
      }
    },
    {
      "id": "halo-e4",
      "label": "Halo de 4",
      "color": "mora",
      "layerId": "geometry",
      "order": 33,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": false,
        "ariaLabel": "Halo de 4",
        "role": "secondary"
      },
      "target": false,
      "objectType": "point",
      "definition": {
        "type": "expression",
        "x": "e4.x",
        "y": "e4.y",
        "fallback": [
          0,
          0
        ]
      },
      "mobility": {
        "type": "fixed"
      },
      "appearance": {
        "size": 12,
        "labelVisible": false,
        "opacity": 0.45
      },
      "visibleWhen": "and(lt(hypot(e4.x - cA.x, e4.y - cA.y), 2.0), lt(hypot(e4.x - cB.x, e4.y - cB.y), 1.45))"
    },
    {
      "id": "e4",
      "label": "4",
      "color": "carbon",
      "layerId": "geometry",
      "order": 43,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el elemento 4",
        "role": "primary"
      },
      "target": true,
      "targetId": "e4",
      "objectType": "point",
      "definition": {
        "type": "coordinates",
        "x": -3.4,
        "y": -1.85
      },
      "mobility": {
        "type": "free"
      },
      "appearance": {
        "size": 5,
        "labelVisible": true,
        "highlightSize": 8,
        "preserveColorOnHighlight": true
      },
      "interaction": {
        "snapToGrid": false
      }
    },
    {
      "id": "estado0",
      "label": "Estado: A ∩ B = ∅",
      "color": "carbon",
      "layerId": "annotations",
      "order": 700,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "visibleWhen": "approx(enAmbos.x, 0, 0.1)",
      "selection": {
        "selectable": true,
        "role": "annotation",
        "ariaLabel": "Estado de la intersección"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "",
        "blocks": [
          {
            "id": "estado",
            "text": "$A \\cap B = \\emptyset$",
            "color": "mora"
          }
        ]
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.5,
          0
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "estado1",
      "label": "Estado: A ∩ B = {1}",
      "color": "carbon",
      "layerId": "annotations",
      "order": 701,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "visibleWhen": "approx(enAmbos.x, 1, 0.1)",
      "selection": {
        "selectable": true,
        "role": "annotation",
        "ariaLabel": "Estado de la intersección"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "",
        "blocks": [
          {
            "id": "estado",
            "text": "$A \\cap B = \\{1\\}$",
            "color": "mora"
          }
        ]
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.5,
          0
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "estado2",
      "label": "Estado: A ∩ B = {2}",
      "color": "carbon",
      "layerId": "annotations",
      "order": 702,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "visibleWhen": "approx(enAmbos.x, 2, 0.1)",
      "selection": {
        "selectable": true,
        "role": "annotation",
        "ariaLabel": "Estado de la intersección"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "",
        "blocks": [
          {
            "id": "estado",
            "text": "$A \\cap B = \\{2\\}$",
            "color": "mora"
          }
        ]
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.5,
          0
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "estado3",
      "label": "Estado: A ∩ B = {1, 2}",
      "color": "carbon",
      "layerId": "annotations",
      "order": 703,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "visibleWhen": "approx(enAmbos.x, 3, 0.1)",
      "selection": {
        "selectable": true,
        "role": "annotation",
        "ariaLabel": "Estado de la intersección"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "",
        "blocks": [
          {
            "id": "estado",
            "text": "$A \\cap B = \\{1, 2\\}$",
            "color": "mora"
          }
        ]
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.5,
          0
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "estado4",
      "label": "Estado: A ∩ B = {3}",
      "color": "carbon",
      "layerId": "annotations",
      "order": 704,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "visibleWhen": "approx(enAmbos.x, 4, 0.1)",
      "selection": {
        "selectable": true,
        "role": "annotation",
        "ariaLabel": "Estado de la intersección"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "",
        "blocks": [
          {
            "id": "estado",
            "text": "$A \\cap B = \\{3\\}$",
            "color": "mora"
          }
        ]
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.5,
          0
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "estado5",
      "label": "Estado: A ∩ B = {1, 3}",
      "color": "carbon",
      "layerId": "annotations",
      "order": 705,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "visibleWhen": "approx(enAmbos.x, 5, 0.1)",
      "selection": {
        "selectable": true,
        "role": "annotation",
        "ariaLabel": "Estado de la intersección"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "",
        "blocks": [
          {
            "id": "estado",
            "text": "$A \\cap B = \\{1, 3\\}$",
            "color": "mora"
          }
        ]
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.5,
          0
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "estado6",
      "label": "Estado: A ∩ B = {2, 3}",
      "color": "carbon",
      "layerId": "annotations",
      "order": 706,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "visibleWhen": "approx(enAmbos.x, 6, 0.1)",
      "selection": {
        "selectable": true,
        "role": "annotation",
        "ariaLabel": "Estado de la intersección"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "",
        "blocks": [
          {
            "id": "estado",
            "text": "$A \\cap B = \\{2, 3\\}$",
            "color": "mora"
          }
        ]
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.5,
          0
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "estado7",
      "label": "Estado: A ∩ B = {1, 2, 3}",
      "color": "carbon",
      "layerId": "annotations",
      "order": 707,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "visibleWhen": "approx(enAmbos.x, 7, 0.1)",
      "selection": {
        "selectable": true,
        "role": "annotation",
        "ariaLabel": "Estado de la intersección"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "",
        "blocks": [
          {
            "id": "estado",
            "text": "$A \\cap B = \\{1, 2, 3\\}$",
            "color": "mora"
          }
        ]
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.5,
          0
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "estado8",
      "label": "Estado: A ∩ B = {4}",
      "color": "carbon",
      "layerId": "annotations",
      "order": 708,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "visibleWhen": "approx(enAmbos.x, 8, 0.1)",
      "selection": {
        "selectable": true,
        "role": "annotation",
        "ariaLabel": "Estado de la intersección"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "",
        "blocks": [
          {
            "id": "estado",
            "text": "$A \\cap B = \\{4\\}$",
            "color": "mora"
          }
        ]
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.5,
          0
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "estado9",
      "label": "Estado: A ∩ B = {1, 4}",
      "color": "carbon",
      "layerId": "annotations",
      "order": 709,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "visibleWhen": "approx(enAmbos.x, 9, 0.1)",
      "selection": {
        "selectable": true,
        "role": "annotation",
        "ariaLabel": "Estado de la intersección"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "",
        "blocks": [
          {
            "id": "estado",
            "text": "$A \\cap B = \\{1, 4\\}$",
            "color": "mora"
          }
        ]
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.5,
          0
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "estado10",
      "label": "Estado: A ∩ B = {2, 4}",
      "color": "carbon",
      "layerId": "annotations",
      "order": 710,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "visibleWhen": "approx(enAmbos.x, 10, 0.1)",
      "selection": {
        "selectable": true,
        "role": "annotation",
        "ariaLabel": "Estado de la intersección"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "",
        "blocks": [
          {
            "id": "estado",
            "text": "$A \\cap B = \\{2, 4\\}$",
            "color": "mora"
          }
        ]
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.5,
          0
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "estado11",
      "label": "Estado: A ∩ B = {1, 2, 4}",
      "color": "carbon",
      "layerId": "annotations",
      "order": 711,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "visibleWhen": "approx(enAmbos.x, 11, 0.1)",
      "selection": {
        "selectable": true,
        "role": "annotation",
        "ariaLabel": "Estado de la intersección"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "",
        "blocks": [
          {
            "id": "estado",
            "text": "$A \\cap B = \\{1, 2, 4\\}$",
            "color": "mora"
          }
        ]
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.5,
          0
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "estado12",
      "label": "Estado: A ∩ B = {3, 4}",
      "color": "carbon",
      "layerId": "annotations",
      "order": 712,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "visibleWhen": "approx(enAmbos.x, 12, 0.1)",
      "selection": {
        "selectable": true,
        "role": "annotation",
        "ariaLabel": "Estado de la intersección"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "",
        "blocks": [
          {
            "id": "estado",
            "text": "$A \\cap B = \\{3, 4\\}$",
            "color": "mora"
          }
        ]
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.5,
          0
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "estado13",
      "label": "Estado: A ∩ B = {1, 3, 4}",
      "color": "carbon",
      "layerId": "annotations",
      "order": 713,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "visibleWhen": "approx(enAmbos.x, 13, 0.1)",
      "selection": {
        "selectable": true,
        "role": "annotation",
        "ariaLabel": "Estado de la intersección"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "",
        "blocks": [
          {
            "id": "estado",
            "text": "$A \\cap B = \\{1, 3, 4\\}$",
            "color": "mora"
          }
        ]
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.5,
          0
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "estado14",
      "label": "Estado: A ∩ B = {2, 3, 4}",
      "color": "carbon",
      "layerId": "annotations",
      "order": 714,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "visibleWhen": "approx(enAmbos.x, 14, 0.1)",
      "selection": {
        "selectable": true,
        "role": "annotation",
        "ariaLabel": "Estado de la intersección"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "",
        "blocks": [
          {
            "id": "estado",
            "text": "$A \\cap B = \\{2, 3, 4\\}$",
            "color": "mora"
          }
        ]
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.5,
          0
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    },
    {
      "id": "estado15",
      "label": "Estado: A ∩ B = {1, 2, 3, 4}",
      "color": "carbon",
      "layerId": "annotations",
      "order": 715,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "visibleWhen": "approx(enAmbos.x, 15, 0.1)",
      "selection": {
        "selectable": true,
        "role": "annotation",
        "ariaLabel": "Estado de la intersección"
      },
      "target": false,
      "objectType": "annotation",
      "variant": "panel",
      "content": {
        "text": "",
        "blocks": [
          {
            "id": "estado",
            "text": "$A \\cap B = \\{1, 2, 3, 4\\}$",
            "color": "mora"
          }
        ]
      },
      "anchor": {
        "type": "viewport",
        "position": [
          0.5,
          0
        ]
      },
      "appearance": {
        "preserveColorOnHighlight": true
      }
    }
  ],
  "relations": [],
  "steps": [],
  "note": "Arrastra los elementos 1, 2, 3 y 4 o los centros de A y B: se marcan los que están a la vez en A y en B.",
  "translations": {
    "eu": {
      "title": "Bi multzoren ebakidura",
      "note": "Arrastatu 1, 2, 3 eta 4 elementuak edo A eta B multzoen zentroak: A-n eta B-n aldi berean daudenak markatzen dira.",
      "labels": {
        "cA": "A-ren zentroa",
        "cB": "B-ren zentroa",
        "rA": "A-ren ertza",
        "rB": "B-ren ertza",
        "enAmbos": "A ∩ B multzoko elementuak",
        "halo-e1": "1 elementuaren argiztapena",
        "halo-e2": "2 elementuaren argiztapena",
        "halo-e3": "3 elementuaren argiztapena",
        "halo-e4": "4 elementuaren argiztapena"
      },
      "ariaLabels": {
        "cA": "Mugitu A multzoa",
        "cB": "Mugitu B multzoa",
        "rA": "A-ren ertza",
        "rB": "B-ren ertza",
        "discoA": "A multzoa",
        "discoB": "B multzoa",
        "areaAB": "A eta B multzoen ebakidura",
        "enAmbos": "A ∩ B multzoko elementuak",
        "halo-e1": "1 elementuaren argiztapena",
        "e1": "Mugitu 1 elementua",
        "halo-e2": "2 elementuaren argiztapena",
        "e2": "Mugitu 2 elementua",
        "halo-e3": "3 elementuaren argiztapena",
        "e3": "Mugitu 3 elementua",
        "halo-e4": "4 elementuaren argiztapena",
        "e4": "Mugitu 4 elementua",
        "estado0": "Ebakiduraren egoera",
        "estado1": "Ebakiduraren egoera",
        "estado2": "Ebakiduraren egoera",
        "estado3": "Ebakiduraren egoera",
        "estado4": "Ebakiduraren egoera",
        "estado5": "Ebakiduraren egoera",
        "estado6": "Ebakiduraren egoera",
        "estado7": "Ebakiduraren egoera",
        "estado8": "Ebakiduraren egoera",
        "estado9": "Ebakiduraren egoera",
        "estado10": "Ebakiduraren egoera",
        "estado11": "Ebakiduraren egoera",
        "estado12": "Ebakiduraren egoera",
        "estado13": "Ebakiduraren egoera",
        "estado14": "Ebakiduraren egoera",
        "estado15": "Ebakiduraren egoera"
      }
    },
    "en": {
      "title": "Intersection of two sets",
      "note": "Drag the elements 1, 2, 3 and 4 or the centres of A and B: those lying in both A and B are marked.",
      "labels": {
        "cA": "Centre of A",
        "cB": "Centre of B",
        "rA": "Boundary of A",
        "rB": "Boundary of B",
        "enAmbos": "Elements of A ∩ B",
        "halo-e1": "Halo of 1",
        "halo-e2": "Halo of 2",
        "halo-e3": "Halo of 3",
        "halo-e4": "Halo of 4"
      },
      "ariaLabels": {
        "cA": "Move set A",
        "cB": "Move set B",
        "rA": "Boundary of A",
        "rB": "Boundary of B",
        "discoA": "Set A",
        "discoB": "Set B",
        "areaAB": "Intersection of A and B",
        "enAmbos": "Elements of A ∩ B",
        "halo-e1": "Halo of 1",
        "e1": "Move element 1",
        "halo-e2": "Halo of 2",
        "e2": "Move element 2",
        "halo-e3": "Halo of 3",
        "e3": "Move element 3",
        "halo-e4": "Halo of 4",
        "e4": "Move element 4",
        "estado0": "State of the intersection",
        "estado1": "State of the intersection",
        "estado2": "State of the intersection",
        "estado3": "State of the intersection",
        "estado4": "State of the intersection",
        "estado5": "State of the intersection",
        "estado6": "State of the intersection",
        "estado7": "State of the intersection",
        "estado8": "State of the intersection",
        "estado9": "State of the intersection",
        "estado10": "State of the intersection",
        "estado11": "State of the intersection",
        "estado12": "State of the intersection",
        "estado13": "State of the intersection",
        "estado14": "State of the intersection",
        "estado15": "State of the intersection"
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const Interseccion = () => <DiagramRenderer spec={InterseccionSpec} />;
