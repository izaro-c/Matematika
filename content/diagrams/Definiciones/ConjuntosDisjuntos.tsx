import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const ConjuntosDisjuntosSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Conjuntos disjuntos: dos a dos e intersección global",
  "componentId": "conjuntos-disjuntos",
  "category": "Definiciones",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "showLabels": true,
  "viewport": {
    "bounds": [-3.9, 2.25, 3.9, -2.45],
    "home": [-3.9, 2.25, 3.9, -2.45],
    "minZoom": 0.6,
    "maxZoom": 3,
    "padding": 0.06
  },
  "layers": [
    { "id": "sets", "label": "Conjuntos", "order": 0, "visible": true, "locked": false },
    { "id": "elements", "label": "Elementos", "order": 1, "visible": true, "locked": false },
    { "id": "annotations", "label": "Estado", "order": 2, "visible": true, "locked": false }
  ],
  "groups": [
    {
      "id": "familia", "label": "Familia {A₁, A₂, A₃}", "memberIds": ["conjuntoA1", "conjuntoA2", "conjuntoA3"],
      "visible": true, "locked": false, "selection": { "selectable": true, "role": "secondary" }, "target": true, "targetId": "familia"
    },
    {
      "id": "interseccionesDosADos", "label": "Intersecciones dos a dos", "memberIds": ["interseccionA1A2", "interseccionA1A3", "interseccionA2A3"],
      "visible": true, "locked": false, "selection": { "selectable": true, "role": "secondary" }, "target": true, "targetId": "interseccionesDosADos"
    }
  ],
  "objects": [
    {
      "id": "centro1", "label": "centro1", "color": "carbon", "layerId": "sets", "order": 1,
      "visible": false, "locked": false, "groupIds": [],
      "selection": { "selectable": false, "role": "construction" }, "target": false,
      "objectType": "point", "definition": { "type": "coordinates", "x": -0.75, "y": 0.25 },
      "mobility": { "type": "fixed" },
      "appearance": { "size": 0, "labelVisible": false, "preserveColorOnHighlight": true }
    },
    {
      "id": "radio1", "label": "radio1", "color": "carbon", "layerId": "sets", "order": 2,
      "visible": false, "locked": false, "groupIds": [],
      "selection": { "selectable": false, "role": "construction" }, "target": false,
      "objectType": "point", "definition": { "type": "coordinates", "x": 0.55, "y": 0.25 },
      "mobility": { "type": "fixed" },
      "appearance": { "size": 0, "labelVisible": false, "preserveColorOnHighlight": true }
    },
    {
      "id": "conjuntoA1", "label": "$A_1$", "color": "terracota", "layerId": "sets", "order": 3,
      "visible": true, "locked": false, "groupIds": [],
      "selection": { "selectable": true, "role": "secondary", "ariaLabel": "Conjunto A₁" }, "target": true,
      "objectType": "path", "geometry": { "type": "circle", "center": "centro1", "point": "radio1" },
      "appearance": { "strokeWidth": 1.8, "strokeOpacity": 0.85, "fillOpacity": 0.04, "labelVisible": false, "preserveColorOnHighlight": true, "highlightFillOpacity": 0.16 }
    },
    {
      "id": "nombreA1", "label": "$A_1$", "color": "terracota", "layerId": "sets", "order": 4,
      "visible": true, "locked": false, "groupIds": [],
      "selection": { "selectable": false, "role": "construction" }, "target": false,
      "objectType": "point", "definition": { "type": "coordinates", "x": -2.05, "y": 1.15 },
      "mobility": { "type": "fixed" },
      "appearance": { "size": 0, "labelVisible": true, "labelSize": 16, "preserveColorOnHighlight": true, "labelPosition": "ulft" }
    },
    {
      "id": "centro2", "label": "centro2", "color": "carbon", "layerId": "sets", "order": 5,
      "visible": false, "locked": false, "groupIds": [],
      "selection": { "selectable": false, "role": "construction" }, "target": false,
      "objectType": "point", "definition": { "type": "coordinates", "x": 0.75, "y": 0.25 },
      "mobility": { "type": "fixed" },
      "appearance": { "size": 0, "labelVisible": false, "preserveColorOnHighlight": true }
    },
    {
      "id": "radio2", "label": "radio2", "color": "carbon", "layerId": "sets", "order": 6,
      "visible": false, "locked": false, "groupIds": [],
      "selection": { "selectable": false, "role": "construction" }, "target": false,
      "objectType": "point", "definition": { "type": "coordinates", "x": 2.05, "y": 0.25 },
      "mobility": { "type": "fixed" },
      "appearance": { "size": 0, "labelVisible": false, "preserveColorOnHighlight": true }
    },
    {
      "id": "conjuntoA2", "label": "$A_2$", "color": "pavo", "layerId": "sets", "order": 7,
      "visible": true, "locked": false, "groupIds": [],
      "selection": { "selectable": true, "role": "secondary", "ariaLabel": "Conjunto A₂" }, "target": true,
      "objectType": "path", "geometry": { "type": "circle", "center": "centro2", "point": "radio2" },
      "appearance": { "strokeWidth": 1.8, "strokeOpacity": 0.85, "fillOpacity": 0.04, "labelVisible": false, "preserveColorOnHighlight": true, "highlightFillOpacity": 0.16 }
    },
    {
      "id": "nombreA2", "label": "$A_2$", "color": "pavo", "layerId": "sets", "order": 8,
      "visible": true, "locked": false, "groupIds": [],
      "selection": { "selectable": false, "role": "construction" }, "target": false,
      "objectType": "point", "definition": { "type": "coordinates", "x": 2.05, "y": 1.15 },
      "mobility": { "type": "fixed" },
      "appearance": { "size": 0, "labelVisible": true, "labelSize": 16, "preserveColorOnHighlight": true, "labelPosition": "urt" }
    },
    {
      "id": "centro3", "label": "centro3", "color": "carbon", "layerId": "sets", "order": 9,
      "visible": false, "locked": false, "groupIds": [],
      "selection": { "selectable": false, "role": "construction" }, "target": false,
      "objectType": "point", "definition": { "type": "coordinates", "x": 0, "y": -1.049 },
      "mobility": { "type": "fixed" },
      "appearance": { "size": 0, "labelVisible": false, "preserveColorOnHighlight": true }
    },
    {
      "id": "radio3", "label": "radio3", "color": "carbon", "layerId": "sets", "order": 10,
      "visible": false, "locked": false, "groupIds": [],
      "selection": { "selectable": false, "role": "construction" }, "target": false,
      "objectType": "point", "definition": { "type": "coordinates", "x": 1.3, "y": -1.049 },
      "mobility": { "type": "fixed" },
      "appearance": { "size": 0, "labelVisible": false, "preserveColorOnHighlight": true }
    },
    {
      "id": "conjuntoA3", "label": "$A_3$", "color": "ocre", "layerId": "sets", "order": 11,
      "visible": true, "locked": false, "groupIds": [],
      "selection": { "selectable": true, "role": "secondary", "ariaLabel": "Conjunto A₃" }, "target": true,
      "objectType": "path", "geometry": { "type": "circle", "center": "centro3", "point": "radio3" },
      "appearance": { "strokeWidth": 1.8, "strokeOpacity": 0.85, "fillOpacity": 0.04, "labelVisible": false, "preserveColorOnHighlight": true, "highlightFillOpacity": 0.16 }
    },
    {
      "id": "nombreA3", "label": "$A_3$", "color": "ocre", "layerId": "sets", "order": 12,
      "visible": true, "locked": false, "groupIds": [],
      "selection": { "selectable": false, "role": "construction" }, "target": false,
      "objectType": "point", "definition": { "type": "coordinates", "x": 1.2, "y": -1.95 },
      "mobility": { "type": "fixed" },
      "appearance": { "size": 0, "labelVisible": true, "labelSize": 16, "preserveColorOnHighlight": true, "labelPosition": "lrt" }
    },
    {
      "id": "x1", "label": "$1$", "color": "carbon", "layerId": "elements", "order": 100,
      "visible": true, "locked": false, "groupIds": [],
      "selection": { "selectable": true, "role": "primary", "ariaLabel": "Elemento 1: arrástralo dentro o fuera de A₁, A₂ y A₃" },
      "target": false,
      "objectType": "point", "definition": { "type": "coordinates", "x": -0.8227, "y": -0.458 },
      "mobility": { "type": "free" },
      "appearance": { "size": 6, "labelVisible": true, "labelSize": 15, "highlightSize": 8, "preserveColorOnHighlight": true, "labelPosition": "rt" },
      "interaction": { "snapToGrid": false }
    },
    {
      "id": "x2", "label": "$2$", "color": "carbon", "layerId": "elements", "order": 101,
      "visible": true, "locked": false, "groupIds": [],
      "selection": { "selectable": true, "role": "primary", "ariaLabel": "Elemento 2: arrástralo dentro o fuera de A₁, A₂ y A₃" },
      "target": false,
      "objectType": "point", "definition": { "type": "coordinates", "x": -0.19, "y": 0.657 },
      "mobility": { "type": "free" },
      "appearance": { "size": 6, "labelVisible": true, "labelSize": 15, "highlightSize": 8, "preserveColorOnHighlight": true, "labelPosition": "rt" },
      "interaction": { "snapToGrid": false }
    },
    {
      "id": "x3", "label": "$3$", "color": "carbon", "layerId": "elements", "order": 102,
      "visible": true, "locked": false, "groupIds": [],
      "selection": { "selectable": true, "role": "primary", "ariaLabel": "Elemento 3: arrástralo dentro o fuera de A₁, A₂ y A₃" },
      "target": false,
      "objectType": "point", "definition": { "type": "coordinates", "x": 1.0127, "y": -0.768 },
      "mobility": { "type": "free" },
      "appearance": { "size": 6, "labelVisible": true, "labelSize": 15, "highlightSize": 8, "preserveColorOnHighlight": true, "labelPosition": "rt" },
      "interaction": { "snapToGrid": false }
    },
    { "id": "region1", "label": "region1", "color": "carbon", "layerId": "annotations", "order": 200, "visible": false, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "point", "definition": { "type": "expression", "x": "lt(hypot(x1.x + 0.75, x1.y - 0.25), 1.3) + 2 * lt(hypot(x1.x - 0.75, x1.y - 0.25), 1.3) + 4 * lt(hypot(x1.x, x1.y + 1.049), 1.3)", "y": "0", "fallback": [0, 0] }, "mobility": { "type": "fixed" }, "appearance": { "size": 0, "labelVisible": false, "preserveColorOnHighlight": true } },
    { "id": "region2", "label": "region2", "color": "carbon", "layerId": "annotations", "order": 201, "visible": false, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "point", "definition": { "type": "expression", "x": "lt(hypot(x2.x + 0.75, x2.y - 0.25), 1.3) + 2 * lt(hypot(x2.x - 0.75, x2.y - 0.25), 1.3) + 4 * lt(hypot(x2.x, x2.y + 1.049), 1.3)", "y": "0", "fallback": [0, 0] }, "mobility": { "type": "fixed" }, "appearance": { "size": 0, "labelVisible": false, "preserveColorOnHighlight": true } },
    { "id": "region3", "label": "region3", "color": "carbon", "layerId": "annotations", "order": 202, "visible": false, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "point", "definition": { "type": "expression", "x": "lt(hypot(x3.x + 0.75, x3.y - 0.25), 1.3) + 2 * lt(hypot(x3.x - 0.75, x3.y - 0.25), 1.3) + 4 * lt(hypot(x3.x, x3.y + 1.049), 1.3)", "y": "0", "fallback": [0, 0] }, "mobility": { "type": "fixed" }, "appearance": { "size": 0, "labelVisible": false, "preserveColorOnHighlight": true } },
    { "id": "corte12", "label": "corte12", "color": "carbon", "layerId": "annotations", "order": 203, "visible": false, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "point", "definition": { "type": "expression", "x": "or(approx(region1.x, 3, 0.1), approx(region1.x, 7, 0.1), approx(region2.x, 3, 0.1), approx(region2.x, 7, 0.1), approx(region3.x, 3, 0.1), approx(region3.x, 7, 0.1))", "y": "0", "fallback": [0, 0] }, "mobility": { "type": "fixed" }, "appearance": { "size": 0, "labelVisible": false, "preserveColorOnHighlight": true } },
    { "id": "corte13", "label": "corte13", "color": "carbon", "layerId": "annotations", "order": 204, "visible": false, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "point", "definition": { "type": "expression", "x": "or(approx(region1.x, 5, 0.1), approx(region1.x, 7, 0.1), approx(region2.x, 5, 0.1), approx(region2.x, 7, 0.1), approx(region3.x, 5, 0.1), approx(region3.x, 7, 0.1))", "y": "0", "fallback": [0, 0] }, "mobility": { "type": "fixed" }, "appearance": { "size": 0, "labelVisible": false, "preserveColorOnHighlight": true } },
    { "id": "corte23", "label": "corte23", "color": "carbon", "layerId": "annotations", "order": 205, "visible": false, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "point", "definition": { "type": "expression", "x": "or(approx(region1.x, 6, 0.1), approx(region1.x, 7, 0.1), approx(region2.x, 6, 0.1), approx(region2.x, 7, 0.1), approx(region3.x, 6, 0.1), approx(region3.x, 7, 0.1))", "y": "0", "fallback": [0, 0] }, "mobility": { "type": "fixed" }, "appearance": { "size": 0, "labelVisible": false, "preserveColorOnHighlight": true } },
    { "id": "corteTotal", "label": "corteTotal", "color": "carbon", "layerId": "annotations", "order": 206, "visible": false, "locked": false, "groupIds": [], "selection": { "selectable": false, "role": "construction" }, "target": false, "objectType": "point", "definition": { "type": "expression", "x": "or(approx(region1.x, 7, 0.1), approx(region2.x, 7, 0.1), approx(region3.x, 7, 0.1))", "y": "0", "fallback": [0, 0] }, "mobility": { "type": "fixed" }, "appearance": { "size": 0, "labelVisible": false, "preserveColorOnHighlight": true } },
    {
      "id": "interseccionA1A2", "label": "A₁ ∩ A₂", "color": "mora", "layerId": "sets", "order": 13,
      "visible": true, "visibleWhen": "gt(corte12.x, 0.5)", "locked": false, "groupIds": [],
      "selection": { "selectable": true, "role": "secondary", "ariaLabel": "Intersección A₁ ∩ A₂" }, "target": true,
      "objectType": "area", "geometry": { "type": "intersection", "areas": ["conjuntoA1", "conjuntoA2"] },
      "appearance": { "strokeWidth": 0, "fillOpacity": 0.3, "highlightFillOpacity": 0.45, "highlightVisible": true, "preserveColorOnHighlight": true }
    },
    {
      "id": "interseccionA1A3", "label": "A₁ ∩ A₃", "color": "mora", "layerId": "sets", "order": 14,
      "visible": true, "visibleWhen": "gt(corte13.x, 0.5)", "locked": false, "groupIds": [],
      "selection": { "selectable": true, "role": "secondary", "ariaLabel": "Intersección A₁ ∩ A₃" }, "target": true,
      "objectType": "area", "geometry": { "type": "intersection", "areas": ["conjuntoA1", "conjuntoA3"] },
      "appearance": { "strokeWidth": 0, "fillOpacity": 0.3, "highlightFillOpacity": 0.45, "highlightVisible": true, "preserveColorOnHighlight": true }
    },
    {
      "id": "interseccionA2A3", "label": "A₂ ∩ A₃", "color": "mora", "layerId": "sets", "order": 15,
      "visible": true, "visibleWhen": "gt(corte23.x, 0.5)", "locked": false, "groupIds": [],
      "selection": { "selectable": true, "role": "secondary", "ariaLabel": "Intersección A₂ ∩ A₃" }, "target": true,
      "objectType": "area", "geometry": { "type": "intersection", "areas": ["conjuntoA2", "conjuntoA3"] },
      "appearance": { "strokeWidth": 0, "fillOpacity": 0.3, "highlightFillOpacity": 0.45, "highlightVisible": true, "preserveColorOnHighlight": true }
    },
    {
      "id": "estadoDisjuntos", "label": "Estado: disjuntos dos a dos", "color": "carbon", "layerId": "annotations", "order": 700,
      "visible": true, "visibleWhen": "not(or(gt(corte12.x, 0.5), gt(corte13.x, 0.5), gt(corte23.x, 0.5)))", "locked": false, "groupIds": [],
      "selection": { "selectable": true, "role": "annotation", "ariaLabel": "Estado: disjuntos dos a dos" },
      "target": false, "objectType": "annotation", "variant": "panel",
      "content": { "text": "", "blocks": [{ "id": "estado", "text": "Disjuntos dos a dos; $\\bigcap A_i = \\emptyset$.", "color": "musgo" }] },
      "anchor": { "type": "viewport", "position": [0.5, 0] },
      "appearance": { "preserveColorOnHighlight": true }
    },
    {
      "id": "estadoAlgunPar", "label": "Estado: algún par se corta, intersección global vacía", "color": "carbon", "layerId": "annotations", "order": 701,
      "visible": true, "visibleWhen": "and(or(gt(corte12.x, 0.5), gt(corte13.x, 0.5), gt(corte23.x, 0.5)), not(and(gt(corte12.x, 0.5), gt(corte13.x, 0.5), gt(corte23.x, 0.5))))", "locked": false, "groupIds": [],
      "selection": { "selectable": true, "role": "annotation", "ariaLabel": "Estado: algún par se corta, intersección global vacía" },
      "target": false, "objectType": "annotation", "variant": "panel",
      "content": { "text": "", "blocks": [{ "id": "estado", "text": "No son disjuntos dos a dos; $\\bigcap A_i = \\emptyset$.", "color": "granada" }] },
      "anchor": { "type": "viewport", "position": [0.5, 0] },
      "appearance": { "preserveColorOnHighlight": true }
    },
    {
      "id": "estadoDosADos", "label": "Estado: se cortan dos a dos, intersección global vacía", "color": "carbon", "layerId": "annotations", "order": 702,
      "visible": true, "visibleWhen": "and(and(gt(corte12.x, 0.5), gt(corte13.x, 0.5), gt(corte23.x, 0.5)), not(gt(corteTotal.x, 0.5)))", "locked": false, "groupIds": [],
      "selection": { "selectable": true, "role": "annotation", "ariaLabel": "Estado: se cortan dos a dos, intersección global vacía" },
      "target": false, "objectType": "annotation", "variant": "panel",
      "content": { "text": "", "blocks": [{ "id": "estado", "text": "Se cortan dos a dos, pero $\\bigcap A_i = \\emptyset$.", "color": "granada" }] },
      "anchor": { "type": "viewport", "position": [0.5, 0] },
      "appearance": { "preserveColorOnHighlight": true }
    },
    {
      "id": "estadoGlobal", "label": "Estado: intersección global no vacía", "color": "carbon", "layerId": "annotations", "order": 703,
      "visible": true, "visibleWhen": "gt(corteTotal.x, 0.5)", "locked": false, "groupIds": [],
      "selection": { "selectable": true, "role": "annotation", "ariaLabel": "Estado: intersección global no vacía" },
      "target": false, "objectType": "annotation", "variant": "panel",
      "content": { "text": "", "blocks": [{ "id": "estado", "text": "$\\bigcap A_i \\neq \\emptyset$: se cortan dos a dos.", "color": "granada" }] },
      "anchor": { "type": "viewport", "position": [0.5, 0] },
      "appearance": { "preserveColorOnHighlight": true }
    }
  ],
  "relations": [],
  "steps": [],
  "note": "Arrastra 1, 2 y 3: se sombrea cada intersección de dos conjuntos que no es vacía.",
  "translations": {
    "eu": {
      "title": "Multzo disjuntuak: binaka eta ebakidura globala",
      "note": "Arrastatu 1, 2 eta 3: hutsa ez den bi multzoren ebakidura bakoitza itzaltzen da.",
      "blocks": {
        "estadoDisjuntos": { "estado": { "text": "Binaka disjuntuak; $\\bigcap A_i = \\emptyset$." } },
        "estadoAlgunPar": { "estado": { "text": "Ez dira binaka disjuntuak; $\\bigcap A_i = \\emptyset$." } },
        "estadoDosADos": { "estado": { "text": "Binaka ebakitzen dira, baina $\\bigcap A_i = \\emptyset$." } },
        "estadoGlobal": { "estado": { "text": "$\\bigcap A_i \\neq \\emptyset$: binaka ebakitzen dira." } }
      },
      "ariaLabels": {
        "conjuntoA1": "A₁ multzoa",
        "conjuntoA2": "A₂ multzoa",
        "conjuntoA3": "A₃ multzoa",
        "interseccionA1A2": "A₁ ∩ A₂ ebakidura",
        "interseccionA1A3": "A₁ ∩ A₃ ebakidura",
        "interseccionA2A3": "A₂ ∩ A₃ ebakidura",
        "x1": "1 elementua: arrastatu A₁, A₂ eta A₃ multzoen barrura edo kanpora",
        "x2": "2 elementua: arrastatu A₁, A₂ eta A₃ multzoen barrura edo kanpora",
        "x3": "3 elementua: arrastatu A₁, A₂ eta A₃ multzoen barrura edo kanpora",
        "estadoDisjuntos": "Egoera: binaka disjuntuak",
        "estadoAlgunPar": "Egoera: bikoteren bat ebakitzen da, ebakidura globala hutsa da",
        "estadoDosADos": "Egoera: binaka ebakitzen dira, ebakidura globala hutsa da",
        "estadoGlobal": "Egoera: ebakidura globala ez da hutsa"
      }
    },
    "en": {
      "title": "Disjoint sets: pairwise and global intersection",
      "note": "Drag 1, 2 and 3: every non-empty intersection of two sets is shaded.",
      "blocks": {
        "estadoDisjuntos": { "estado": { "text": "Pairwise disjoint; $\\bigcap A_i = \\emptyset$." } },
        "estadoAlgunPar": { "estado": { "text": "Not pairwise disjoint; $\\bigcap A_i = \\emptyset$." } },
        "estadoDosADos": { "estado": { "text": "They meet pairwise, yet $\\bigcap A_i = \\emptyset$." } },
        "estadoGlobal": { "estado": { "text": "$\\bigcap A_i \\neq \\emptyset$: they meet pairwise." } }
      },
      "ariaLabels": {
        "conjuntoA1": "Set A₁",
        "conjuntoA2": "Set A₂",
        "conjuntoA3": "Set A₃",
        "interseccionA1A2": "Intersection A₁ ∩ A₂",
        "interseccionA1A3": "Intersection A₁ ∩ A₃",
        "interseccionA2A3": "Intersection A₂ ∩ A₃",
        "x1": "Element 1: drag it into or out of A₁, A₂ and A₃",
        "x2": "Element 2: drag it into or out of A₁, A₂ and A₃",
        "x3": "Element 3: drag it into or out of A₁, A₂ and A₃",
        "estadoDisjuntos": "State: pairwise disjoint",
        "estadoAlgunPar": "State: some pair meets, empty global intersection",
        "estadoDosADos": "State: they meet pairwise, empty global intersection",
        "estadoGlobal": "State: non-empty global intersection"
      }
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const ConjuntosDisjuntos = () => <DiagramRenderer spec={ConjuntosDisjuntosSpec} />;
