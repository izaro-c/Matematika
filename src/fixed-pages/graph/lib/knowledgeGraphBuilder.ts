import { db } from '@/data/content';
import { mscHierarchy, mscNames, getItemBranchCodes, getAllDescendantCodes } from '@/data/content/msc2020';
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

export function buildKnowledgeGraphData(lang: string = 'es'): { nodes: GraphNode[]; links: GraphLink[] } {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];

  // Las 7 ramas raíz de la jerarquía MSC2020
  const ROOT_BRANCHES = Object.keys(mscHierarchy).filter(
    key => !/^\d/.test(key) && key.includes('-')
  );

  // Nodo Central
  nodes.push({ id: 'matematicas', name: 'MATEMÁTICAS', group: 'central', val: 50 });

  // Ramas raíz
  ROOT_BRANCHES.forEach(branchSlug => {
    nodes.push({ id: `rama-${branchSlug}`, name: (mscNames[branchSlug] || branchSlug).toUpperCase(), group: 'branch', val: 25, url: `/rama/${branchSlug}` });
    links.push({ source: `rama-${branchSlug}`, target: 'matematicas' });

    // Sub-ramas (hijas)
    const children = mscHierarchy[branchSlug] || [];
    children.forEach(childCode => {
      const childName = mscNames[childCode] || childCode;
      nodes.push({ id: `subrama-${childCode}`, name: childName.toUpperCase(), group: 'branch', val: 15, url: `/rama/${childCode}` });
      links.push({ source: `subrama-${childCode}`, target: `rama-${branchSlug}` });
    });
  });

  // Resolver el nodo rama de un item a partir de sus propiedades de rama o tags
  const resolveItemBranch = (item: BaseContent): string | null => {
    const itemCodes = getItemBranchCodes(item as BaseContent & Record<string, unknown>);
    for (const mscCode of itemCodes) {
      for (const root of ROOT_BRANCHES) {
        if (mscCode === root) return `rama-${root}`;
        if (getAllDescendantCodes(root).includes(mscCode)) return `subrama-${mscCode}`;
      }
    }
    return null;
  };

  // Helper to add links from any array field
  const addLinks = (source: string, targetIds: string[] | undefined) => {
    if (targetIds) targetIds.forEach(tid => links.push({ source, target: tid }));
  };

  // Axiomas
  db.getAllAxioms(lang).forEach((ax) => {
    const slug = ax.slug || ax.id;
    nodes.push({ id: slug, name: ax.title, group: 'axioma', val: 10 });
    const branchNode = resolveItemBranch(ax);
    if (branchNode) links.push({ source: slug, target: branchNode });
    addLinks(slug, ax.links);
    addLinks(slug, ax.seeAlso);
  });

  // Definiciones
  db.getAllDefinitions(lang).forEach((def) => {
    const slug = def.slug || def.id;
    nodes.push({ id: slug, name: def.title, group: 'definition', val: 8 });
    const branchNode = resolveItemBranch(def);
    if (branchNode) links.push({ source: slug, target: branchNode });
    addLinks(slug, def.links);
    addLinks(slug, def.seeAlso);
  });

  // Teoremas
  db.getAllTheorems(lang).forEach((thm) => {
    const slug = thm.slug || thm.id;
    nodes.push({ id: slug, name: thm.title, group: thm.type || 'theorem', val: 10 });
    const branchNode = resolveItemBranch(thm);
    if (branchNode) links.push({ source: slug, target: branchNode });
    addLinks(slug, thm.requires);
    addLinks(slug, thm.links);
    addLinks(slug, thm.lemmas);
    addLinks(slug, thm.demos);
    addLinks(slug, thm.corollaries);
    addLinks(slug, thm.seeAlso);
    if (thm.parentTheorem) links.push({ source: slug, target: thm.parentTheorem });
  });

  // Sistemas axiomáticos
  db.getAllAxiomaticSystems(lang).forEach((sys) => {
    const slug = sys.slug || sys.id;
    nodes.push({ id: slug, name: sys.title, group: 'modelo', val: 10 });
    const branchNode = resolveItemBranch(sys);
    if (branchNode) links.push({ source: slug, target: branchNode });
    addLinks(slug, sys.axiomas);
    addLinks(slug, sys.models);
  });

  // Modelos
  db.getAllModels(lang).forEach((model) => {
    const slug = model.slug || model.id;
    nodes.push({ id: slug, name: model.title, group: 'modelo', val: 7 });
    if (model.satisfies) {
      if (Array.isArray(model.satisfies)) {
        for (const sysId of model.satisfies) {
          links.push({ source: slug, target: sysId });
        }
      } else {
        links.push({ source: slug, target: model.satisfies });
      }
    }
    addLinks(slug, model.links);
    addLinks(slug, model.axioms_verified);
    addLinks(slug, model.seeAlso);
  });

  // Conexiones desde demostraciones hacia su parentTheorem (sin nodos demo)
  db.getAllDemos(lang).forEach(demo => {
    if (!demo.parentTheorem) return;
    if (demo.dependencias) demo.dependencias.forEach(dep => links.push({ source: dep, target: demo.parentTheorem! }));
    if (demo.lemmas) demo.lemmas.forEach(lem => links.push({ source: lem, target: demo.parentTheorem! }));
    if (demo.links) demo.links.forEach((l: string) => links.push({ source: l, target: demo.parentTheorem! }));
    if (demo.seeAlso) demo.seeAlso.forEach(s => links.push({ source: s, target: demo.parentTheorem! }));
  });

  // Matemáticos
  db.getAllMathematicians(lang).forEach((math) => {
    const slug = math.slug || math.id;
    nodes.push({ id: slug, name: math.name, group: 'mathematician', val: 6 });
  });

  // Enlaces desde sistemas que mencionan matemáticos
  db.getAllAxiomaticSystems(lang).forEach(sys => {
    if (sys.authors) {
      sys.authors.forEach((mId: string) => {
        links.push({ source: mId, target: sys.id });
      });
    }
  });
  db.getAllAxioms(lang).forEach(ax => {
    if (ax.authors) {
      ax.authors.forEach(aId => {
        links.push({ source: aId, target: ax.id });
      });
    }
  });
  db.getAllTheorems(lang).forEach(thm => {
    if (thm.authors) {
      thm.authors.forEach(aId => {
        links.push({ source: aId, target: thm.id });
      });
    }
  });
  db.getAllDefinitions(lang).forEach(def => {
    if (def.authors) {
      def.authors.forEach(aId => {
        links.push({ source: aId, target: def.id });
      });
    }
  });

  // Filtrar enlaces rotos (react-force-graph explota si un target no existe en nodes)
  const nodeIds = new Set(nodes.map(n => n.id));
  const validLinks = links.filter(l => nodeIds.has(l.source as string) && nodeIds.has(l.target as string));

  return { nodes, links: validLinks };
}
