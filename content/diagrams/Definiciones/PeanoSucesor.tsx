import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const PeanoSucesorSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Axiomas de Peano: las flechas del sucesor",
  "componentId": "peano-sucesor",
  "category": "Definiciones",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "showLabels": true,
  "viewport": {
    "bounds": [-5, 2.3, 5, -2.75],
    "home": [-5, 2.3, 5, -2.75],
    "minZoom": 0.6,
    "maxZoom": 3,
    "padding": 0.06
  },
  "layers": [
    { "id": "sets", "label": "Conjuntos", "order": 0, "visible": true, "locked": false },
    { "id": "arrows", "label": "Flechas", "order": 1, "visible": true, "locked": false },
    { "id": "elements", "label": "Elementos", "order": 2, "visible": true, "locked": false },
    { "id": "handles", "label": "Puntas arrastrables", "order": 3, "visible": true, "locked": false },
    { "id": "annotations", "label": "Estado y controles", "order": 4, "visible": true, "locked": false }
  ],
  "groups": [
    {
      "id": "grupoFlechas",
      "label": "Flechas del sucesor",
      "memberIds": ["f01", "f12", "f23", "f34a", "f34", "f4p", "fab", "fba"],
      "visible": true,
      "locked": false,
      "selection": { "selectable": true, "ariaLabel": "Resaltar las flechas de la función sucesor", "role": "secondary" },
      "target": true,
      "targetId": "flechas",
      "color": "terracota"
    }
  ],
  "objects": [
    { "id": "esquina1", "label": "esquina1", "color": "carbon", "layerId": "sets", "order": 1, "visible": false, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "point", "definition": { "type": "coordinates", "x": -4.65, "y": 1.75 }, "mobility": { "type": "fixed" }, "appearance": { "size": 0, "labelVisible": false } },
    { "id": "esquina2", "label": "esquina2", "color": "carbon", "layerId": "sets", "order": 1, "visible": false, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "point", "definition": { "type": "coordinates", "x": 4.9, "y": 1.75 }, "mobility": { "type": "fixed" }, "appearance": { "size": 0, "labelVisible": false } },
    { "id": "esquina3", "label": "esquina3", "color": "carbon", "layerId": "sets", "order": 1, "visible": false, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "point", "definition": { "type": "coordinates", "x": 4.9, "y": -1.85 }, "mobility": { "type": "fixed" }, "appearance": { "size": 0, "labelVisible": false } },
    { "id": "esquina4", "label": "esquina4", "color": "carbon", "layerId": "sets", "order": 1, "visible": false, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "point", "definition": { "type": "coordinates", "x": -4.65, "y": -1.85 }, "mobility": { "type": "fixed" }, "appearance": { "size": 0, "labelVisible": false } },
    {
      "id": "conjuntoN", "label": "$\\mathbb{N}$", "color": "carbon", "layerId": "sets", "order": 2, "visible": true, "locked": false, "groupIds": [],
      "selection": { "selectable": true, "role": "secondary", "ariaLabel": "Conjunto N" },
      "target": true, "objectType": "path",
      "geometry": { "type": "polygon", "points": ["esquina1", "esquina2", "esquina3", "esquina4"] },
      "appearance": { "strokeWidth": 1.6, "strokeOpacity": 0.75, "fillOpacity": 0.04, "highlightFillOpacity": 0.12, "labelVisible": false, "preserveColorOnHighlight": true }
    },
    { "id": "nombreN", "label": "$\\mathbb{N}$", "color": "carbon", "layerId": "sets", "order": 3, "visible": true, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "point", "definition": { "type": "coordinates", "x": -4.5, "y": 1.6 }, "mobility": { "type": "fixed" }, "appearance": { "size": 0, "labelVisible": true, "labelSize": 16, "preserveColorOnHighlight": true, "labelPosition": "rt" } },
    { "id": "k1", "label": "k1", "color": "carbon", "layerId": "sets", "order": 4, "visible": false, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "point", "definition": { "type": "coordinates", "x": -4.5, "y": -0.9 }, "mobility": { "type": "fixed" }, "appearance": { "size": 0, "labelVisible": false } },
    { "id": "k2", "label": "k2", "color": "carbon", "layerId": "sets", "order": 4, "visible": false, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "point", "definition": { "type": "coordinates", "x": -4.5, "y": 0.7 }, "mobility": { "type": "fixed" }, "appearance": { "size": 0, "labelVisible": false } },
    { "id": "k3", "label": "k3", "color": "carbon", "layerId": "sets", "order": 4, "visible": false, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "point", "definition": { "type": "coordinates", "x": -2.0, "y": 0.75 }, "mobility": { "type": "fixed" }, "appearance": { "size": 0, "labelVisible": false } },
    { "id": "k4", "label": "k4", "color": "carbon", "layerId": "sets", "order": 4, "visible": false, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "point", "definition": { "type": "coordinates", "x": 0.6, "y": 0.75 }, "mobility": { "type": "fixed" }, "appearance": { "size": 0, "labelVisible": false } },
    { "id": "k5", "label": "k5", "color": "carbon", "layerId": "sets", "order": 4, "visible": false, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "point", "definition": { "type": "expression", "x": "3.5 - 2.6 * lt(h3.x, 1)", "y": "0.7", "fallback": [3.5, 0.7] }, "mobility": { "type": "fixed" }, "appearance": { "size": 0, "labelVisible": false } },
    { "id": "k6", "label": "k6", "color": "carbon", "layerId": "sets", "order": 4, "visible": false, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "point", "definition": { "type": "expression", "x": "3.6 - 2.6 * lt(h3.x, 1)", "y": "-0.9", "fallback": [3.6, -0.9] }, "mobility": { "type": "fixed" }, "appearance": { "size": 0, "labelVisible": false } },
    { "id": "k7", "label": "k7", "color": "carbon", "layerId": "sets", "order": 4, "visible": false, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "point", "definition": { "type": "coordinates", "x": 1.0, "y": -0.95 }, "mobility": { "type": "fixed" }, "appearance": { "size": 0, "labelVisible": false } },
    { "id": "k8", "label": "k8", "color": "carbon", "layerId": "sets", "order": 4, "visible": false, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "point", "definition": { "type": "coordinates", "x": -2.0, "y": -0.95 }, "mobility": { "type": "fixed" }, "appearance": { "size": 0, "labelVisible": false } },
    {
      "id": "regionK", "label": "$K$", "color": "pavo", "layerId": "sets", "order": 5, "visible": true, "visibleWhen": "gte(isla, 0.5)", "locked": false, "groupIds": [],
      "selection": { "selectable": true, "role": "secondary", "ariaLabel": "Conjunto K de los elementos que se alcanzan desde 0" },
      "target": true, "objectType": "path",
      "geometry": { "type": "polygon", "points": ["k1", "k2", "k3", "k4", "k5", "k6", "k7", "k8"] },
      "appearance": { "strokeWidth": 1.2, "strokeOpacity": 0.6, "fillOpacity": 0.1, "dashed": true, "labelVisible": false, "preserveColorOnHighlight": true }
    },
    { "id": "nombreK", "label": "$K$", "color": "pavo", "layerId": "sets", "order": 6, "visible": true, "visibleWhen": "gte(isla, 0.5)", "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "point", "definition": { "type": "coordinates", "x": -1.2, "y": 0.75 }, "mobility": { "type": "fixed" }, "appearance": { "size": 0, "labelVisible": true, "labelSize": 16, "preserveColorOnHighlight": true, "labelPosition": "top" } },
    { "id": "e0", "label": "$0$", "color": "mora", "layerId": "elements", "order": 100, "visible": true, "locked": false, "groupIds": [], "selection": { "selectable": true, "role": "primary", "ariaLabel": "Elemento distinguido 0" }, "target": true, "objectType": "point", "definition": { "type": "coordinates", "x": -4, "y": 0 }, "mobility": { "type": "fixed" }, "appearance": { "size": 5, "labelVisible": true, "labelSize": 16, "preserveColorOnHighlight": true, "labelPosition": "lft" } },
    { "id": "e1", "label": "$1$", "color": "carbon", "layerId": "elements", "order": 101, "visible": true, "locked": false, "groupIds": [], "selection": { "selectable": true, "role": "secondary", "ariaLabel": "Elemento 1" }, "target": false, "objectType": "point", "definition": { "type": "coordinates", "x": -2.6, "y": 0 }, "mobility": { "type": "fixed" }, "appearance": { "size": 5, "labelVisible": true, "labelSize": 16, "preserveColorOnHighlight": true, "labelPosition": "bot" } },
    { "id": "e2", "label": "$2$", "color": "carbon", "layerId": "elements", "order": 102, "visible": true, "locked": false, "groupIds": [], "selection": { "selectable": true, "role": "secondary", "ariaLabel": "Elemento 2" }, "target": false, "objectType": "point", "definition": { "type": "coordinates", "x": -1.2, "y": 0 }, "mobility": { "type": "fixed" }, "appearance": { "size": 5, "labelVisible": true, "labelSize": 16, "preserveColorOnHighlight": true, "labelPosition": "bot" } },
    { "id": "e3", "label": "$3$", "color": "carbon", "layerId": "elements", "order": 103, "visible": true, "locked": false, "groupIds": [], "selection": { "selectable": true, "role": "secondary", "ariaLabel": "Elemento 3" }, "target": false, "objectType": "point", "definition": { "type": "coordinates", "x": 0.2, "y": 0 }, "mobility": { "type": "fixed" }, "appearance": { "size": 5, "labelVisible": true, "labelSize": 16, "preserveColorOnHighlight": true, "labelPosition": "bot" } },
    { "id": "e4", "label": "$4$", "color": "carbon", "layerId": "elements", "order": 104, "visible": true, "visibleWhen": "gt(h3.x, 1)", "locked": false, "groupIds": [], "selection": { "selectable": true, "role": "secondary", "ariaLabel": "Elemento 4" }, "target": false, "objectType": "point", "definition": { "type": "coordinates", "x": 1.6, "y": 0 }, "mobility": { "type": "fixed" }, "appearance": { "size": 5, "labelVisible": true, "labelSize": 16, "preserveColorOnHighlight": true, "labelPosition": "bot" } },
    { "id": "puntos", "label": "$\\cdots$", "color": "carbon", "layerId": "elements", "order": 105, "visible": true, "visibleWhen": "gt(h3.x, 1)", "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "point", "definition": { "type": "coordinates", "x": 2.75, "y": 0 }, "mobility": { "type": "fixed" }, "appearance": { "size": 0, "labelVisible": true, "labelSize": 16, "preserveColorOnHighlight": true, "labelPosition": "rt" } },
    { "id": "ea", "label": "$a$", "color": "carbon", "layerId": "elements", "order": 110, "visible": true, "visibleWhen": "gte(isla, 0.5)", "locked": false, "groupIds": [], "selection": { "selectable": true, "role": "secondary", "ariaLabel": "Elemento a, fuera de la cadena que empieza en 0" }, "target": false, "objectType": "point", "definition": { "type": "coordinates", "x": 3.1, "y": 1.1 }, "mobility": { "type": "fixed" }, "appearance": { "size": 5, "labelVisible": true, "labelSize": 16, "preserveColorOnHighlight": true, "labelPosition": "lft" } },
    { "id": "eb", "label": "$b$", "color": "carbon", "layerId": "elements", "order": 111, "visible": true, "visibleWhen": "gte(isla, 0.5)", "locked": false, "groupIds": [], "selection": { "selectable": true, "role": "secondary", "ariaLabel": "Elemento b, fuera de la cadena que empieza en 0" }, "target": false, "objectType": "point", "definition": { "type": "coordinates", "x": 4.3, "y": 1.1 }, "mobility": { "type": "fixed" }, "appearance": { "size": 5, "labelVisible": true, "labelSize": 16, "preserveColorOnHighlight": true, "labelPosition": "rt" } },
    { "id": "f01Ini", "label": "f01Ini", "color": "carbon", "layerId": "arrows", "order": 200, "visible": false, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "point", "definition": { "type": "coordinates", "x": -3.8, "y": 0 }, "mobility": { "type": "fixed" }, "appearance": { "size": 0, "labelVisible": false } },
    { "id": "f01Fin", "label": "f01Fin", "color": "carbon", "layerId": "arrows", "order": 200, "visible": false, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "point", "definition": { "type": "coordinates", "x": -2.8, "y": 0 }, "mobility": { "type": "fixed" }, "appearance": { "size": 0, "labelVisible": false } },
    { "id": "f01", "label": "$S(0) = 1$", "color": "terracota", "layerId": "arrows", "order": 300, "visible": true, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "path", "geometry": { "type": "segment", "points": ["f01Ini", "f01Fin"] }, "appearance": { "strokeWidth": 2.2, "arrow": "end", "labelVisible": false, "preserveColorOnHighlight": true } },
    { "id": "f12Ini", "label": "f12Ini", "color": "carbon", "layerId": "arrows", "order": 200, "visible": false, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "point", "definition": { "type": "coordinates", "x": -2.4, "y": 0 }, "mobility": { "type": "fixed" }, "appearance": { "size": 0, "labelVisible": false } },
    { "id": "f12Fin", "label": "f12Fin", "color": "carbon", "layerId": "arrows", "order": 200, "visible": false, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "point", "definition": { "type": "coordinates", "x": -1.4, "y": 0 }, "mobility": { "type": "fixed" }, "appearance": { "size": 0, "labelVisible": false } },
    { "id": "f12", "label": "$S(1) = 2$", "color": "terracota", "layerId": "arrows", "order": 300, "visible": true, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "path", "geometry": { "type": "segment", "points": ["f12Ini", "f12Fin"] }, "appearance": { "strokeWidth": 2.2, "arrow": "end", "labelVisible": false, "preserveColorOnHighlight": true } },
    { "id": "f23Ini", "label": "f23Ini", "color": "carbon", "layerId": "arrows", "order": 200, "visible": false, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "point", "definition": { "type": "coordinates", "x": -1.0, "y": 0 }, "mobility": { "type": "fixed" }, "appearance": { "size": 0, "labelVisible": false } },
    { "id": "f23Fin", "label": "f23Fin", "color": "carbon", "layerId": "arrows", "order": 200, "visible": false, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "point", "definition": { "type": "coordinates", "x": 0.0, "y": 0 }, "mobility": { "type": "fixed" }, "appearance": { "size": 0, "labelVisible": false } },
    { "id": "f23", "label": "$S(2) = 3$", "color": "terracota", "layerId": "arrows", "order": 300, "visible": true, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "path", "geometry": { "type": "segment", "points": ["f23Ini", "f23Fin"] }, "appearance": { "strokeWidth": 2.2, "arrow": "end", "labelVisible": false, "preserveColorOnHighlight": true } },
    { "id": "f4pIni", "label": "f4pIni", "color": "carbon", "layerId": "arrows", "order": 200, "visible": false, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "point", "definition": { "type": "coordinates", "x": 1.8, "y": 0 }, "mobility": { "type": "fixed" }, "appearance": { "size": 0, "labelVisible": false } },
    { "id": "f4pFin", "label": "f4pFin", "color": "carbon", "layerId": "arrows", "order": 200, "visible": false, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "point", "definition": { "type": "coordinates", "x": 2.5, "y": 0 }, "mobility": { "type": "fixed" }, "appearance": { "size": 0, "labelVisible": false } },
    { "id": "f4p", "label": "$S(4)$", "color": "terracota", "layerId": "arrows", "order": 300, "visible": true, "visibleWhen": "gt(h3.x, 1)", "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "path", "geometry": { "type": "segment", "points": ["f4pIni", "f4pFin"] }, "appearance": { "strokeWidth": 2.2, "arrow": "end", "labelVisible": false, "preserveColorOnHighlight": true } },
    { "id": "fabIni", "label": "fabIni", "color": "carbon", "layerId": "arrows", "order": 200, "visible": false, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "point", "definition": { "type": "coordinates", "x": 3.3, "y": 1.2 }, "mobility": { "type": "fixed" }, "appearance": { "size": 0, "labelVisible": false } },
    { "id": "fabFin", "label": "fabFin", "color": "carbon", "layerId": "arrows", "order": 200, "visible": false, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "point", "definition": { "type": "coordinates", "x": 4.06, "y": 1.2 }, "mobility": { "type": "fixed" }, "appearance": { "size": 0, "labelVisible": false } },
    { "id": "fab", "label": "$S(a) = b$", "color": "terracota", "layerId": "arrows", "order": 300, "visible": true, "visibleWhen": "gte(isla, 0.5)", "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "path", "geometry": { "type": "segment", "points": ["fabIni", "fabFin"] }, "appearance": { "strokeWidth": 2.2, "arrow": "end", "labelVisible": false, "preserveColorOnHighlight": true } },
    { "id": "fbaIni", "label": "fbaIni", "color": "carbon", "layerId": "arrows", "order": 200, "visible": false, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "point", "definition": { "type": "coordinates", "x": 4.1, "y": 1.0 }, "mobility": { "type": "fixed" }, "appearance": { "size": 0, "labelVisible": false } },
    { "id": "fbaFin", "label": "fbaFin", "color": "carbon", "layerId": "arrows", "order": 200, "visible": false, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "point", "definition": { "type": "coordinates", "x": 3.34, "y": 1.0 }, "mobility": { "type": "fixed" }, "appearance": { "size": 0, "labelVisible": false } },
    { "id": "fba", "label": "$S(b) = a$", "color": "terracota", "layerId": "arrows", "order": 300, "visible": true, "visibleWhen": "gte(isla, 0.5)", "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "path", "geometry": { "type": "segment", "points": ["fbaIni", "fbaFin"] }, "appearance": { "strokeWidth": 2.2, "arrow": "end", "labelVisible": false, "preserveColorOnHighlight": true } },
    { "id": "l4", "label": "l4", "color": "carbon", "layerId": "arrows", "order": 200, "visible": false, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "point", "definition": { "type": "coordinates", "x": 1.4, "y": 0 }, "mobility": { "type": "fixed" }, "appearance": { "size": 0, "labelVisible": false } },
    { "id": "l0", "label": "l0", "color": "carbon", "layerId": "arrows", "order": 200, "visible": false, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "point", "definition": { "type": "coordinates", "x": -3.76, "y": 0 }, "mobility": { "type": "fixed" }, "appearance": { "size": 0, "labelVisible": false } },
    { "id": "l1", "label": "l1", "color": "carbon", "layerId": "arrows", "order": 200, "visible": false, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "point", "definition": { "type": "coordinates", "x": -2.42, "y": -0.16 }, "mobility": { "type": "fixed" }, "appearance": { "size": 0, "labelVisible": false } },
    {
      "id": "h3", "label": "h3", "color": "terracota", "layerId": "handles", "order": 400, "visible": true, "locked": false, "groupIds": [],
      "selection": { "selectable": true, "role": "primary", "ariaLabel": "Punta de la flecha que sale de 3: elige S(3) entre 4, 0 y 1" },
      "target": false, "objectType": "point",
      "definition": { "type": "coordinates", "x": 1.4, "y": 0 },
      "mobility": { "type": "on-points", "points": ["l4", "l0", "l1"] },
      "appearance": { "size": 10, "opacity": 0, "labelVisible": false, "highlightSize": 5, "preserveColorOnHighlight": true }
    },
    {
      "id": "codo", "label": "codo", "color": "carbon", "layerId": "arrows", "order": 201, "visible": false, "locked": false, "groupIds": [],
      "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "point",
      "definition": { "type": "expression", "x": "(e3.x + h3.x) / 2", "y": "(e3.y + h3.y) / 2 - 1.2 * lt(h3.x, 1)", "fallback": [0.8, 0] },
      "mobility": { "type": "fixed" }, "appearance": { "size": 0, "labelVisible": false }
    },
    {
      "id": "f34Ini", "label": "f34Ini", "color": "carbon", "layerId": "arrows", "order": 202, "visible": false, "locked": false, "groupIds": [],
      "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "point",
      "definition": { "type": "expression", "x": "e3.x + 0.2 * (codo.x - e3.x) / max(hypot((codo.x - e3.x), (codo.y - e3.y)), 0.001)", "y": "e3.y + 0.2 * (codo.y - e3.y) / max(hypot((codo.x - e3.x), (codo.y - e3.y)), 0.001)", "fallback": [0.4, 0] },
      "mobility": { "type": "fixed" }, "appearance": { "size": 0, "labelVisible": false }
    },
    { "id": "f34a", "label": "$S(3)$", "color": "terracota", "layerId": "arrows", "order": 300, "visible": true, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "path", "geometry": { "type": "segment", "points": ["f34Ini", "codo"] }, "appearance": { "strokeWidth": 2.2, "labelVisible": false, "preserveColorOnHighlight": true } },
    { "id": "f34", "label": "$S(3)$", "color": "terracota", "layerId": "arrows", "order": 301, "visible": true, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "path", "geometry": { "type": "segment", "points": ["codo", "h3"] }, "appearance": { "strokeWidth": 2.2, "arrow": "end", "labelVisible": false, "preserveColorOnHighlight": true } },
    { "id": "aviso0Radio", "label": "aviso0Radio", "color": "carbon", "layerId": "elements", "order": 600, "visible": false, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "point", "definition": { "type": "coordinates", "x": -3.73, "y": 0 }, "mobility": { "type": "fixed" }, "appearance": { "size": 0, "labelVisible": false } },
    { "id": "aviso0", "label": "Aviso en 0", "color": "granada", "layerId": "elements", "order": 601, "visible": true, "visibleWhen": "lt(h3.x, -3)", "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "path", "geometry": { "type": "circle", "center": "e0", "point": "aviso0Radio" }, "appearance": { "strokeWidth": 2, "strokeOpacity": 0.75, "fillOpacity": 0, "labelVisible": false, "preserveColorOnHighlight": true } },
    { "id": "aviso1Radio", "label": "aviso1Radio", "color": "carbon", "layerId": "elements", "order": 602, "visible": false, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "point", "definition": { "type": "coordinates", "x": -2.33, "y": 0 }, "mobility": { "type": "fixed" }, "appearance": { "size": 0, "labelVisible": false } },
    { "id": "aviso1", "label": "Aviso en 1", "color": "granada", "layerId": "elements", "order": 603, "visible": true, "visibleWhen": "and(lt(h3.x, 1), gt(h3.x, -3))", "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "path", "geometry": { "type": "circle", "center": "e1", "point": "aviso1Radio" }, "appearance": { "strokeWidth": 2, "strokeOpacity": 0.75, "fillOpacity": 0, "labelVisible": false, "preserveColorOnHighlight": true } },
    { "id": "avisoARadio", "label": "avisoARadio", "color": "carbon", "layerId": "elements", "order": 604, "visible": false, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "point", "definition": { "type": "coordinates", "x": 3.37, "y": 1.1 }, "mobility": { "type": "fixed" }, "appearance": { "size": 0, "labelVisible": false } },
    { "id": "avisoA", "label": "Aviso en a", "color": "granada", "layerId": "elements", "order": 605, "visible": true, "visibleWhen": "gte(isla, 0.5)", "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "path", "geometry": { "type": "circle", "center": "ea", "point": "avisoARadio" }, "appearance": { "strokeWidth": 2, "strokeOpacity": 0.75, "fillOpacity": 0, "dashed": true, "labelVisible": false, "preserveColorOnHighlight": true } },
    { "id": "avisoBRadio", "label": "avisoBRadio", "color": "carbon", "layerId": "elements", "order": 606, "visible": false, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "point", "definition": { "type": "coordinates", "x": 4.57, "y": 1.1 }, "mobility": { "type": "fixed" }, "appearance": { "size": 0, "labelVisible": false } },
    { "id": "avisoB", "label": "Aviso en b", "color": "granada", "layerId": "elements", "order": 607, "visible": true, "visibleWhen": "gte(isla, 0.5)", "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "path", "geometry": { "type": "circle", "center": "eb", "point": "avisoBRadio" }, "appearance": { "strokeWidth": 2, "strokeOpacity": 0.75, "fillOpacity": 0, "dashed": true, "labelVisible": false, "preserveColorOnHighlight": true } },
    {
      "id": "isla", "label": "Añadir $a$ y $b$ fuera de la cadena", "color": "mora", "layerId": "annotations", "order": 500, "visible": true, "locked": false, "groupIds": [],
      "selection": { "selectable": true, "role": "primary", "ariaLabel": "Añadir a y b fuera de la cadena" },
      "target": false, "objectType": "control", "variant": "button", "position": [-4.85, -2.2],
      "range": { "min": 0, "max": 1, "step": 0.01 }, "value": 0,
      "action": { "to": 1, "durationMs": 450, "easing": "ease-in-out", "behavior": "toggle" }
    },
    { "id": "estadoPeano", "label": "Estado: se cumplen los axiomas", "color": "carbon", "layerId": "annotations", "order": 700, "visible": true, "visibleWhen": "and(gt(h3.x, 1), lt(isla, 0.5))", "locked": false, "groupIds": [], "selection": { "selectable": true, "role": "annotation", "ariaLabel": "Estado: se cumplen los axiomas" }, "target": false, "objectType": "annotation", "variant": "panel", "content": { "text": "", "blocks": [{ "id": "estado", "text": "Se cumplen los tres axiomas.", "color": "musgo" }] }, "anchor": { "type": "viewport", "position": [0.5, 0] }, "appearance": { "preserveColorOnHighlight": true } },
    { "id": "estadoAx1", "label": "Estado: falla el axioma 1", "color": "carbon", "layerId": "annotations", "order": 701, "visible": true, "visibleWhen": "and(lt(h3.x, -3), lt(isla, 0.5))", "locked": false, "groupIds": [], "selection": { "selectable": true, "role": "annotation", "ariaLabel": "Estado: falla el axioma 1" }, "target": false, "objectType": "annotation", "variant": "panel", "content": { "text": "", "blocks": [{ "id": "estado", "text": "Falla el axioma 1: $S(3) = 0$.", "color": "granada" }] }, "anchor": { "type": "viewport", "position": [0.5, 0] }, "appearance": { "preserveColorOnHighlight": true } },
    { "id": "estadoAx2", "label": "Estado: falla el axioma 2", "color": "carbon", "layerId": "annotations", "order": 702, "visible": true, "visibleWhen": "and(lt(h3.x, 1), gt(h3.x, -3), lt(isla, 0.5))", "locked": false, "groupIds": [], "selection": { "selectable": true, "role": "annotation", "ariaLabel": "Estado: falla el axioma 2" }, "target": false, "objectType": "annotation", "variant": "panel", "content": { "text": "", "blocks": [{ "id": "estado", "text": "Falla el axioma 2: $S(0) = S(3)$.", "color": "granada" }] }, "anchor": { "type": "viewport", "position": [0.5, 0] }, "appearance": { "preserveColorOnHighlight": true } },
    { "id": "estadoAx3", "label": "Estado: falla el axioma 3", "color": "carbon", "layerId": "annotations", "order": 703, "visible": true, "visibleWhen": "and(gt(h3.x, 1), gte(isla, 0.5))", "locked": false, "groupIds": [], "selection": { "selectable": true, "role": "annotation", "ariaLabel": "Estado: falla el axioma 3" }, "target": false, "objectType": "annotation", "variant": "panel", "content": { "text": "", "blocks": [{ "id": "estado", "text": "Falla el axioma 3: $K \\neq \\mathbb{N}$.", "color": "granada" }] }, "anchor": { "type": "viewport", "position": [0.5, 0] }, "appearance": { "preserveColorOnHighlight": true } },
    { "id": "estadoAx13", "label": "Estado: fallan los axiomas 1 y 3", "color": "carbon", "layerId": "annotations", "order": 704, "visible": true, "visibleWhen": "and(lt(h3.x, -3), gte(isla, 0.5))", "locked": false, "groupIds": [], "selection": { "selectable": true, "role": "annotation", "ariaLabel": "Estado: fallan los axiomas 1 y 3" }, "target": false, "objectType": "annotation", "variant": "panel", "content": { "text": "", "blocks": [{ "id": "estado", "text": "Fallan los axiomas 1 y 3.", "color": "granada" }] }, "anchor": { "type": "viewport", "position": [0.5, 0] }, "appearance": { "preserveColorOnHighlight": true } },
    { "id": "estadoAx23", "label": "Estado: fallan los axiomas 2 y 3", "color": "carbon", "layerId": "annotations", "order": 705, "visible": true, "visibleWhen": "and(lt(h3.x, 1), gt(h3.x, -3), gte(isla, 0.5))", "locked": false, "groupIds": [], "selection": { "selectable": true, "role": "annotation", "ariaLabel": "Estado: fallan los axiomas 2 y 3" }, "target": false, "objectType": "annotation", "variant": "panel", "content": { "text": "", "blocks": [{ "id": "estado", "text": "Fallan los axiomas 2 y 3.", "color": "granada" }] }, "anchor": { "type": "viewport", "position": [0.5, 0] }, "appearance": { "preserveColorOnHighlight": true } }
  ],
  "relations": [],
  "steps": [],
  "note": "Arrastra la punta de la flecha que sale de 3, o pulsa el botón.",
  "translations": {
    "eu": {
      "title": "Peanoren axiomak: ondorengoaren geziak",
      "note": "Arrastatu 3-tik irteten den geziaren punta, edo sakatu botoia.",
      "labels": {
        "conjuntoN": "$\\mathbb{N}$",
        "regionK": "$K$",
        "isla": "Gehitu $a$ eta $b$ katetik kanpo"
      },
      "blocks": {
        "estadoPeano": { "estado": { "text": "Hiru axiomak betetzen dira." } },
        "estadoAx1": { "estado": { "text": "1. axioma ez da betetzen: $S(3) = 0$." } },
        "estadoAx2": { "estado": { "text": "2. axioma ez da betetzen: $S(0) = S(3)$." } },
        "estadoAx3": { "estado": { "text": "3. axioma ez da betetzen: $K \\neq \\mathbb{N}$." } },
        "estadoAx13": { "estado": { "text": "1. eta 3. axiomak ez dira betetzen." } },
        "estadoAx23": { "estado": { "text": "2. eta 3. axiomak ez dira betetzen." } }
      },
      "ariaLabels": {
        "conjuntoN": "N multzoa",
        "regionK": "0-tik abiatuta S behin eta berriz aplikatuz lortzen diren elementuen K multzoa",
        "e0": "0 elementu berezia",
        "e1": "1 elementua",
        "e2": "2 elementua",
        "e3": "3 elementua",
        "e4": "4 elementua",
        "ea": "a elementua, 0-tik hasten den katetik kanpo",
        "eb": "b elementua, 0-tik hasten den katetik kanpo",
        "h3": "3-tik irteten den geziaren punta: aukeratu S(3) 4, 0 eta 1 artean",
        "isla": "Gehitu a eta b katetik kanpo",
        "grupoFlechas": "Nabarmendu ondorengo-funtzioaren geziak",
        "estadoPeano": "Egoera: axiomak betetzen dira",
        "estadoAx1": "Egoera: 1. axioma ez da betetzen",
        "estadoAx2": "Egoera: 2. axioma ez da betetzen",
        "estadoAx3": "Egoera: 3. axioma ez da betetzen",
        "estadoAx13": "Egoera: 1. eta 3. axiomak ez dira betetzen",
        "estadoAx23": "Egoera: 2. eta 3. axiomak ez dira betetzen"
      }
    },
    "en": {
      "title": "Peano axioms: successor arrows",
      "note": "Drag the tip of the arrow leaving 3, or press the button.",
      "labels": {
        "conjuntoN": "$\\mathbb{N}$",
        "regionK": "$K$",
        "isla": "Add $a$ and $b$ off the chain"
      },
      "blocks": {
        "estadoPeano": { "estado": { "text": "All three axioms hold." } },
        "estadoAx1": { "estado": { "text": "Axiom 1 fails: $S(3) = 0$." } },
        "estadoAx2": { "estado": { "text": "Axiom 2 fails: $S(0) = S(3)$." } },
        "estadoAx3": { "estado": { "text": "Axiom 3 fails: $K \\neq \\mathbb{N}$." } },
        "estadoAx13": { "estado": { "text": "Axioms 1 and 3 fail." } },
        "estadoAx23": { "estado": { "text": "Axioms 2 and 3 fail." } }
      },
      "ariaLabels": {
        "conjuntoN": "Set N",
        "regionK": "Set K of the elements reached from 0",
        "e0": "Distinguished element 0",
        "e1": "Element 1",
        "e2": "Element 2",
        "e3": "Element 3",
        "e4": "Element 4",
        "ea": "Element a, off the chain starting at 0",
        "eb": "Element b, off the chain starting at 0",
        "h3": "Tip of the arrow leaving 3: choose S(3) among 4, 0 and 1",
        "isla": "Add a and b off the chain",
        "grupoFlechas": "Highlight the arrows of the successor function",
        "estadoPeano": "Status: the axioms hold",
        "estadoAx1": "Status: axiom 1 fails",
        "estadoAx2": "Status: axiom 2 fails",
        "estadoAx3": "Status: axiom 3 fails",
        "estadoAx13": "Status: axioms 1 and 3 fail",
        "estadoAx23": "Status: axioms 2 and 3 fail"
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const PeanoSucesor = () => <DiagramRenderer spec={PeanoSucesorSpec} />;
