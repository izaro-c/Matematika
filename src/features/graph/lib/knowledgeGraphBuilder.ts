import { db } from '@/entities/content';
import { mscHierarchy, mscNames, tagToMSC } from '@/entities/content/msc2020';

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

export function buildKnowledgeGraphData(): { nodes: GraphNode[]; links: GraphLink[] } {
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

  // Resolver el MSC code de un item a partir de sus tags
  const resolveItemBranch = (tags?: string[]): string | null => {
    if (!tags || tags.length === 0) return null;
    for (const tag of tags) {
      const mscCode = tagToMSC[tag] || tagToMSC[tag.toLowerCase()] || tagToMSC[tag.replace(/-/g, ' ')];
      if (mscCode) {
        for (const root of ROOT_BRANCHES) {
          const allDescendants = (code: string): string[] => {
            const children = mscHierarchy[code] || [];
            let desc = [...children];
            for (const c of children) desc = desc.concat(allDescendants(c));
            return desc;
          };
          if (mscCode === root) return `rama-${root}`;
          if (allDescendants(root).includes(mscCode)) return `subrama-${mscCode}`;
        }
      }
    }
    return null;
  };

  // Helper to add links from any array field
  const addLinks = (source: string, targetIds: string[] | undefined) => {
    if (targetIds) targetIds.forEach(tid => links.push({ source, target: tid }));
  };

  // Axiomas
  db.axioms.forEach((ax, slug) => {
    nodes.push({ id: slug, name: ax.title, group: 'axioma', val: 10 });
    const branchNode = resolveItemBranch(ax.tags);
    if (branchNode) links.push({ source: slug, target: branchNode });
    addLinks(slug, ax.links);
    addLinks(slug, ax.seeAlso);
  });

  // Definiciones
  db.definitions.forEach((def, slug) => {
    nodes.push({ id: slug, name: def.title, group: 'definition', val: 8 });
    const branchNode = resolveItemBranch(def.tags);
    if (branchNode) links.push({ source: slug, target: branchNode });
    addLinks(slug, def.links);
    addLinks(slug, def.seeAlso);
  });

  // Teoremas
  db.theorems.forEach((thm, slug) => {
    nodes.push({ id: slug, name: thm.title, group: thm.type || 'theorem', val: 10 });
    const branchNode = resolveItemBranch(thm.tags);
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
  db.axiomaticSystems.forEach((sys, slug) => {
    nodes.push({ id: slug, name: sys.title, group: 'modelo', val: 10 });
    const branchNode = 'geometria';
    if (branchNode) links.push({ source: slug, target: branchNode });
    addLinks(slug, sys.axiomas);
    addLinks(slug, sys.models);
  });

  // Modelos
  db.models.forEach((model, slug) => {
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
  db.getAllDemos().forEach(demo => {
    if (!demo.parentTheorem) return;
    if (demo.dependencias) demo.dependencias.forEach(dep => links.push({ source: dep, target: demo.parentTheorem! }));
    if (demo.lemmas) demo.lemmas.forEach(lem => links.push({ source: lem, target: demo.parentTheorem! }));
    if (demo.links) demo.links.forEach((l: string) => links.push({ source: l, target: demo.parentTheorem! }));
    if (demo.seeAlso) demo.seeAlso.forEach(s => links.push({ source: s, target: demo.parentTheorem! }));
  });

  // Matemáticos
  db.mathematicians.forEach((math, slug) => {
    nodes.push({ id: slug, name: math.name, group: 'mathematician', val: 6 });
  });

  // Enlaces desde sistemas que mencionan matemáticos
  db.axiomaticSystems.forEach(sys => {
    if (sys.authors) {
      sys.authors.forEach((mId: string) => {
        links.push({ source: mId, target: sys.id });
      });
    }
  });
  db.axioms.forEach(ax => {
    if (ax.authors) {
      ax.authors.forEach(aId => {
        links.push({ source: aId, target: ax.id });
      });
    }
  });
  db.theorems.forEach(thm => {
    if (thm.authors) {
      thm.authors.forEach(aId => {
        links.push({ source: aId, target: thm.id });
      });
    }
  });
  db.definitions.forEach(def => {
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
