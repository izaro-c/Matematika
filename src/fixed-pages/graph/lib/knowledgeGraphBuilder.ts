import { db } from '@/data/content';
import { mscNames, getItemBranchCodes, mscParent, getMscName } from '@/data/content/msc2020';
import type { BaseContent } from '@/data/content/types';

export interface GraphNode {
  id: string;
  name: string;
  group: string;
  val: number;
  url?: string;
  x?: number;
  y?: number;
}

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
}

const TOP_LEVEL_ROOTS = new Set([
  'metadatos-y-divulgacion',
  'fundamentos-y-logica',
  'algebra-y-teoria-de-numeros',
  'analisis-matematico',
  'geometria-y-topologia',
  'matematica-discreta-y-computacional',
  'probabilidad-estadistica-y-aplicaciones',
]);

export function buildKnowledgeGraphData(lang: string = 'es'): { nodes: GraphNode[]; links: GraphLink[] } {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  const idAliasMap = new Map<string, string>();

  // Helper para registrar alias de IDs y slugs
  const registerAlias = (id: string, slug?: string) => {
    idAliasMap.set(id, id);
    if (slug && slug !== id) {
      idAliasMap.set(slug, id);
    }
  };

  // 1. Recolectar todos los contenidos a renderizar
  const axioms = db.getAllAxioms(lang);
  const definitions = db.getAllDefinitions(lang);
  const theorems = db.getAllTheorems(lang);
  const axiomaticSystems = db.getAllAxiomaticSystems(lang);
  const models = db.getAllModels(lang);
  const methods = db.getAllMethods(lang);
  const useCases = db.getAllUseCases(lang);
  const mathematicians = db.getAllMathematicians(lang);

  // Registrar aliases de todos los contenidos
  axioms.forEach(a => registerAlias(a.id, a.slug));
  definitions.forEach(d => registerAlias(d.id, d.slug));
  theorems.forEach(t => registerAlias(t.id, t.slug));
  axiomaticSystems.forEach(s => registerAlias(s.id, s.slug));
  models.forEach(m => registerAlias(m.id, m.slug));
  methods.forEach(m => registerAlias(m.id, m.slug));
  useCases.forEach(u => registerAlias(u.id, u.slug));
  mathematicians.forEach(m => registerAlias(m.id, m.slug));

  // 2. Identificar ramas y subramas MSC2020 activas (que contienen contenido)
  const allContentItems: BaseContent[] = [
    ...axioms,
    ...definitions,
    ...theorems,
    ...axiomaticSystems,
    ...models,
    ...methods,
    ...useCases,
  ];

  const usedBranchCodes = new Set<string>();

  allContentItems.forEach(item => {
    const codes = getItemBranchCodes(item as BaseContent & Record<string, unknown>);
    for (const code of codes) {
      if (!code) continue;
      // Añadir el código y toda su cadena de ancestros
      let current: string | undefined = code;
      const visited = new Set<string>();
      while (current && !visited.has(current)) {
        visited.add(current);
        usedBranchCodes.add(current);
        if (TOP_LEVEL_ROOTS.has(current)) break;
        current = mscParent[current];
      }
    }
  });

  // Asegurar que las 7 ramas raíz siempre estén presentes para estructura del cosmos
  TOP_LEVEL_ROOTS.forEach(root => usedBranchCodes.add(root));

  // 3. Nodo Central: MATEMÁTICAS
  nodes.push({ id: 'matematicas', name: 'MATEMÁTICAS', group: 'central', val: 40 });
  registerAlias('matematicas');

  // 4. Crear Nodos de Ramas y Sub-ramas con sus conexiones jerárquicas
  usedBranchCodes.forEach(code => {
    const isRoot = TOP_LEVEL_ROOTS.has(code);
    const nodeId = isRoot ? `rama-${code}` : `subrama-${code}`;
    const branchTitle = (getMscName(code, lang) || mscNames[code] || code).toUpperCase();

    nodes.push({
      id: nodeId,
      name: branchTitle,
      group: 'branch',
      val: isRoot ? 24 : 14,
      url: `/rama/${code}`,
    });
    registerAlias(nodeId);

    if (isRoot) {
      links.push({ source: nodeId, target: 'matematicas' });
    } else {
      const parentCode = mscParent[code];
      if (parentCode && usedBranchCodes.has(parentCode)) {
        const parentNodeId = TOP_LEVEL_ROOTS.has(parentCode) ? `rama-${parentCode}` : `subrama-${parentCode}`;
        links.push({ source: nodeId, target: parentNodeId });
      } else {
        links.push({ source: nodeId, target: 'matematicas' });
      }
    }
  });

  // Helper para resolver el nodo rama de un item
  const resolveItemBranch = (item: BaseContent): string | null => {
    const itemCodes = getItemBranchCodes(item as BaseContent & Record<string, unknown>);
    for (const code of itemCodes) {
      if (!code) continue;
      if (TOP_LEVEL_ROOTS.has(code) && usedBranchCodes.has(code)) {
        return `rama-${code}`;
      }
      if (usedBranchCodes.has(code)) {
        return `subrama-${code}`;
      }
      // Buscar ancestro más cercano que esté en usedBranchCodes
      let current: string | undefined = mscParent[code];
      while (current) {
        if (usedBranchCodes.has(current)) {
          return TOP_LEVEL_ROOTS.has(current) ? `rama-${current}` : `subrama-${current}`;
        }
        current = mscParent[current];
      }
    }
    return null;
  };

  // Helper para añadir enlaces a arrays de referencias
  const addLinks = (source: string, targetIds: string[] | undefined) => {
    if (Array.isArray(targetIds)) {
      for (const tid of targetIds) {
        if (tid && typeof tid === 'string') {
          links.push({ source, target: tid });
        }
      }
    }
  };

  // 5. Poblar nodos de contenido y sus aristas

  // Axiomas
  axioms.forEach(ax => {
    nodes.push({ id: ax.id, name: ax.title, group: 'axioma', val: 10, url: `/axioma/${ax.slug || ax.id}` });
    const branchNode = resolveItemBranch(ax);
    if (branchNode) links.push({ source: ax.id, target: branchNode });
    addLinks(ax.id, ax.links);
    addLinks(ax.id, ax.seeAlso);
    addLinks(ax.id, ax.conceptLinks);
    if (ax.authors) ax.authors.forEach(aId => links.push({ source: aId, target: ax.id }));
  });

  // Definiciones
  definitions.forEach(def => {
    nodes.push({ id: def.id, name: def.title, group: 'definition', val: 8, url: `/definicion/${def.slug || def.id}` });
    const branchNode = resolveItemBranch(def);
    if (branchNode) links.push({ source: def.id, target: branchNode });
    addLinks(def.id, def.links);
    addLinks(def.id, def.seeAlso);
    addLinks(def.id, def.conceptLinks);
    if (def.authors) def.authors.forEach(aId => links.push({ source: aId, target: def.id }));
  });

  // Teoremas
  theorems.forEach(thm => {
    nodes.push({ id: thm.id, name: thm.title, group: thm.type || 'theorem', val: 10, url: `/teorema/${thm.slug || thm.id}` });
    const branchNode = resolveItemBranch(thm);
    if (branchNode) links.push({ source: thm.id, target: branchNode });
    addLinks(thm.id, thm.requires);
    addLinks(thm.id, thm.links);
    addLinks(thm.id, thm.lemmas);
    addLinks(thm.id, thm.demos);
    addLinks(thm.id, thm.corollaries);
    addLinks(thm.id, thm.seeAlso);
    addLinks(thm.id, thm.conceptLinks);
    if (thm.parentTheorem) links.push({ source: thm.id, target: thm.parentTheorem });
    if (thm.authors) thm.authors.forEach(aId => links.push({ source: aId, target: thm.id }));
  });

  // Sistemas axiomáticos
  axiomaticSystems.forEach(sys => {
    nodes.push({ id: sys.id, name: sys.title, group: 'sistema-axiomatico', val: 12, url: `/sistema/${sys.slug || sys.id}` });
    const branchNode = resolveItemBranch(sys);
    if (branchNode) links.push({ source: sys.id, target: branchNode });
    addLinks(sys.id, sys.axiomas);
    addLinks(sys.id, sys.models);
    addLinks(sys.id, sys.links);
    addLinks(sys.id, sys.seeAlso);
    addLinks(sys.id, sys.conceptLinks);
    if (sys.authors) sys.authors.forEach(aId => links.push({ source: aId, target: sys.id }));
  });

  // Modelos
  models.forEach(model => {
    nodes.push({ id: model.id, name: model.title, group: 'modelo', val: 9, url: `/modelo/${model.slug || model.id}` });
    const branchNode = resolveItemBranch(model);
    if (branchNode) links.push({ source: model.id, target: branchNode });
    if (model.satisfies) {
      if (Array.isArray(model.satisfies)) {
        model.satisfies.forEach(sysId => links.push({ source: model.id, target: sysId }));
      } else {
        links.push({ source: model.id, target: model.satisfies });
      }
    }
    addLinks(model.id, model.links);
    addLinks(model.id, model.axioms_verified);
    addLinks(model.id, model.seeAlso);
    addLinks(model.id, model.conceptLinks);
  });

  // Métodos
  methods.forEach(method => {
    nodes.push({ id: method.id, name: method.title, group: 'metodo', val: 9, url: `/metodo/${method.slug || method.id}` });
    const branchNode = resolveItemBranch(method);
    if (branchNode) links.push({ source: method.id, target: branchNode });
    addLinks(method.id, method.requires);
    addLinks(method.id, method.links);
    addLinks(method.id, method.seeAlso);
    addLinks(method.id, method.conceptLinks);
    if (method.authors) method.authors.forEach(aId => links.push({ source: aId, target: method.id }));
  });

  // Casos de uso
  useCases.forEach(uc => {
    nodes.push({ id: uc.id, name: uc.title, group: 'caso-de-uso', val: 7, url: `/caso-de-uso/${uc.slug || uc.id}` });
    const branchNode = resolveItemBranch(uc);
    if (branchNode) links.push({ source: uc.id, target: branchNode });
    if (uc.concept) links.push({ source: uc.id, target: uc.concept });
    addLinks(uc.id, uc.links);
    addLinks(uc.id, uc.seeAlso);
    addLinks(uc.id, uc.conceptLinks);
  });

  // Conexiones desde demostraciones hacia su parentTheorem y métodos de demostración
  db.getAllDemos(lang).forEach(demo => {
    if (!demo.parentTheorem) return;
    if (demo.dependencias) demo.dependencias.forEach(dep => links.push({ source: dep, target: demo.parentTheorem! }));
    if (demo.lemmas) demo.lemmas.forEach(lem => links.push({ source: lem, target: demo.parentTheorem! }));
    if (demo.links) demo.links.forEach((l: string) => links.push({ source: l, target: demo.parentTheorem! }));
    if (demo.seeAlso) demo.seeAlso.forEach(s => links.push({ source: s, target: demo.parentTheorem! }));
    if (demo.conceptLinks) demo.conceptLinks.forEach(cl => links.push({ source: cl, target: demo.parentTheorem! }));
    if (demo.proofMethod) links.push({ source: demo.proofMethod, target: demo.parentTheorem! });
  });

  // Matemáticos (Biografías)
  mathematicians.forEach(math => {
    nodes.push({ id: math.id, name: math.name, group: 'mathematician', val: 6, url: `/historia` });
  });

  // 6. Normalización y filtrado de enlaces válidos
  const nodeIds = new Set(nodes.map(n => n.id));
  const seenLinks = new Set<string>();
  const validLinks: GraphLink[] = [];

  for (const link of links) {
    const rawSource = typeof link.source === 'object' ? link.source.id : link.source;
    const rawTarget = typeof link.target === 'object' ? link.target.id : link.target;

    const resolvedSource = idAliasMap.get(rawSource) || rawSource;
    const resolvedTarget = idAliasMap.get(rawTarget) || rawTarget;

    if (resolvedSource === resolvedTarget) continue;
    if (!nodeIds.has(resolvedSource) || !nodeIds.has(resolvedTarget)) continue;

    const linkKey = `${resolvedSource}->${resolvedTarget}`;
    if (seenLinks.has(linkKey)) continue;
    seenLinks.add(linkKey);

    validLinks.push({ source: resolvedSource, target: resolvedTarget });
  }

  return { nodes, links: validLinks };
}
