import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

/* @matematika-diagram-spec:start */
export const DosRectasUnPuntoSpec = createDiagramSpec(
{
  "version": 2,
  "renderer": "matematika-diagram-renderer-v2",
  "title": "Dos rectas distintas comparten a lo sumo un punto",
  "componentId": "dos-rectas-un-punto",
  "category": "Teoremas",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "viewport": {
    "bounds": [
      -5,
      5,
      5,
      -5
    ],
    "home": [
      -5,
      5,
      5,
      -5
    ],
    "minZoom": 0.55,
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
      "label": "Lecturas y controles",
      "order": 1,
      "visible": true,
      "locked": false
    }
  ],
  "groups": [
    {
      "id": "gLines",
      "label": "Dos rectas",
      "memberIds": [
        "line1",
        "line2"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Dos rectas",
        "role": "primary"
      },
      "target": true,
      "targetId": "rectas",
      "color": "terracota"
    },
    {
      "id": "gPoint",
      "label": "Punto de intersección",
      "memberIds": [
        "P"
      ],
      "visible": true,
      "locked": false,
      "selection": {
        "selectable": true,
        "ariaLabel": "Punto de intersección",
        "role": "primary"
      },
      "target": true,
      "targetId": "punto",
      "color": "terracota"
    }
  ],
  "points": [
    {
      "id": "A",
      "label": "A",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1420,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto A",
        "role": "primary"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -3,
      "y": -1.8,
      "showLabel": true,
      "fixed": false,
      "constraint": "free",
      "snapToGrid": true,
      "snapSize": 0.25
    },
    {
      "id": "B",
      "label": "B",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1430,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto B",
        "role": "primary"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 2.8,
      "y": 1.6,
      "showLabel": true,
      "fixed": false,
      "constraint": "free",
      "snapToGrid": true,
      "snapSize": 0.25
    },
    {
      "id": "C",
      "label": "C",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 1440,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto C",
        "role": "primary"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": -2.8,
      "y": 2,
      "showLabel": true,
      "fixed": false,
      "constraint": "free",
      "snapToGrid": true,
      "snapSize": 0.25
    },
    {
      "id": "D",
      "label": "D",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 1450,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Mover el punto D",
        "role": "primary"
      },
      "target": false,
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "x": 3,
      "y": -2.2,
      "showLabel": true,
      "fixed": false,
      "constraint": "free",
      "snapToGrid": true,
      "snapSize": 0.25
    }
  ],
  "elements": [
    {
      "id": "line1",
      "label": "Recta l",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1460,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gLines"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta l",
        "role": "secondary"
      },
      "target": true,
      "targetId": "line1",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "line",
      "refs": [
        "A",
        "B"
      ]
    },
    {
      "id": "line2",
      "label": "Recta m",
      "color": "pizarra",
      "layerId": "geometry",
      "order": 1470,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gLines"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "Recta m",
        "role": "secondary"
      },
      "target": true,
      "targetId": "line2",
      "style": {
        "strokeWidth": 2.4,
        "highlightStrokeWidth": 3,
        "preserveColorOnHighlight": true
      },
      "kind": "line",
      "refs": [
        "C",
        "D"
      ]
    },
    {
      "id": "P",
      "label": "P",
      "color": "terracota",
      "layerId": "geometry",
      "order": 1480,
      "visible": true,
      "locked": false,
      "groupIds": [
        "gPoint"
      ],
      "selection": {
        "selectable": true,
        "ariaLabel": "P",
        "role": "secondary"
      },
      "target": true,
      "targetId": "P_interseccion",
      "style": {
        "pointSize": 7,
        "highlightPointSize": 10,
        "preserveColorOnHighlight": true
      },
      "kind": "intersection",
      "refs": [
        "line1",
        "line2"
      ]
    },
    {
      "id": "incidenceInfo",
      "label": "Unicidad",
      "color": "terracota",
      "layerId": "annotations",
      "order": 1490,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": {
        "selectable": true,
        "ariaLabel": "Unicidad",
        "role": "annotation"
      },
      "target": false,
      "style": {
        "preserveColorOnHighlight": true
      },
      "kind": "infoPanel",
      "refs": [],
      "text": "Si l y m fueran distintas y compartieran dos puntos, I-1 obligaría a l = m.",
      "properties": {
        "title": "Unicidad",
        "anchorMode": "viewport",
        "viewportPosition": [
          0.98,
          0.03
        ]
      }
    }
  ],
  "sliders": [],
  "steps": [],
  "dependencies": [],
  "note": "Mueve los puntos que determinan l y m. Cuando no son paralelas, el renderer construye una única intersección P.",
  "extensions": {}
}
);
/* @matematika-diagram-spec:end */

export const DosRectasUnPunto = () => <DiagramRenderer spec={DosRectasUnPuntoSpec} />;
