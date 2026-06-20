import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import ForceGraph2D from 'react-force-graph-2d';
import { db } from '../store/content';
import { GRAPH_NODE_COLORS } from '../config/constants';
import { useGlossaryStore } from '../store/GlossaryStore';
import { useProgressStore } from '../store/UserProgressStore';
import { mscHierarchy, mscNames, tagToMSC } from '../store/content/msc2020';

/**
 * Página Explorador (Knowledge Graph).
 * Renderiza una red tridimensional (2D proyectada) de todos los conceptos matemáticos.
 * Permite explorar conexiones entre teoremas, lecciones, biógrafias y demostraciones.
 */
interface GraphNode {
  id: string;
  name: string;
  group: string;
  val: number;
  url?: string;
  x?: number;
  y?: number;
}

interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
}

export const GraphPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const { openTerm } = useGlossaryStore();
  const graphRef = useRef<React.ElementRef<typeof ForceGraph2D> | null>(null);

  // Extraer datos del ContentStore usando jerarquía MSC2020 definida
  const graphData = useMemo(() => {
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
          // Encontrar la sub-rama o rama raíz que contiene este código
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

    // Axiomas
    db.axioms.forEach((ax, slug) => {
      nodes.push({ id: slug, name: ax.title, group: 'axioma', val: 10 });
      const branchNode = resolveItemBranch(ax.tags);
      if (branchNode) links.push({ source: slug, target: branchNode });
    });

    // Definiciones
    db.definitions.forEach((def, slug) => {
      nodes.push({ id: slug, name: def.title, group: 'definition', val: 8 });
      const branchNode = resolveItemBranch(def.tags);
      if (branchNode) links.push({ source: slug, target: branchNode });
    });

    // Teoremas
    db.theorems.forEach((thm, slug) => {
      nodes.push({ id: slug, name: thm.title, group: thm.type || 'theorem', val: 10 });
      const branchNode = resolveItemBranch(thm.tags);
      if (branchNode) links.push({ source: slug, target: branchNode });
      // Enlaces lógicos (requires)
      if (thm.requires) {
        thm.requires.forEach((req: string) => {
          links.push({ source: slug, target: req });
        });
      }
    });

    // Sistemas axiomáticos
    db.axiomaticSystems.forEach((sys, slug) => {
      nodes.push({ id: slug, name: sys.title, group: 'modelo', val: 10 });
      // Determine primary branch using standard logic or default to 'geometria'
      const branchNode = 'geometria';
      if (branchNode) links.push({ source: slug, target: branchNode });
      // Enlace a cada axioma del sistema
      if (sys.axiomas) {
        sys.axiomas.forEach((axId: string) => {
          links.push({ source: slug, target: axId });
        });
      }
    });

    // Modelos
    db.models.forEach((model, slug) => {
      nodes.push({ id: slug, name: model.title, group: 'modelo', val: 7 });
      if (model.satisfies) {
        links.push({ source: slug, target: model.satisfies });
      }
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

    // Filtrar enlaces rotos (react-force-graph explota si un target no existe en nodes)
    const nodeIds = new Set(nodes.map(n => n.id));
    const validLinks = links.filter(l => nodeIds.has(l.source as string) && nodeIds.has(l.target as string));

    return { nodes, links: validLinks };
  }, []);

  const [hoverNode, setHoverNode] = useState<GraphNode | null>(null);
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GraphNode[]>([]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 1) {
      const results = graphData.nodes
        .filter(n => n.name && n.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 6);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchResultClick = (node: GraphNode) => {
    setSearchQuery('');
    setSearchResults([]);
    if (graphRef.current && node.x !== undefined && node.y !== undefined) {
      graphRef.current.centerAt(node.x, node.y, 1000);
      graphRef.current.zoom(3, 1000);
    }
    handleNodeHover(node);
  };

  const updateHighlight = useCallback(() => {
    setHighlightNodes(highlightNodes);
    setHighlightLinks(highlightLinks);
  }, [highlightNodes, highlightLinks]);

  const handleNodeHover = useCallback((node: GraphNode | null) => {
    highlightNodes.clear();
    highlightLinks.clear();
    if (node) {
      highlightNodes.add(node);
      graphData.links.forEach((link: GraphLink) => {
        if (link.source === node || (link.source as any).id === node.id) {
          highlightLinks.add(link);
          highlightNodes.add(typeof link.target === 'object' ? link.target : graphData.nodes.find(n => n.id === link.target));
        }
        if (link.target === node || (link.target as any).id === node.id) {
          highlightLinks.add(link);
          highlightNodes.add(typeof link.source === 'object' ? link.source : graphData.nodes.find(n => n.id === link.source));
        }
      });
    }
    setHoverNode(node || null);
    updateHighlight();
  }, [graphData, updateHighlight, highlightNodes, highlightLinks]);

  const handleNodeClick = useCallback((node: GraphNode) => {
    if (node.group === 'branch' || node.group === 'central') {
      if (node.group === 'branch') {
        // Soporte tanto para ramas principales como sub-ramas
        const isSubBranch = node.id.startsWith('subrama-');
        const slug = node.id.replace(isSubBranch ? 'subrama-' : 'rama-', '');
        setLocation(`/rama/${slug}`);
      }
    } else if (node.group === 'modelo') {
      setLocation(`/modelo/${node.id}`);
    } else {
      openTerm(node.id);
    }
  }, [setLocation, openTerm]);

  const getNodeColor = (node: GraphNode) => {
    const groupMap: Record<string, string> = {
      'teorema': 'theorem',
      'lema': 'lemma',
      'corolario': 'corollary',
      'definicion': 'definition',
      'ejemplo': 'example',
      'ejercicio': 'exercise',
      'demostracion': 'demostracion',
      'caso-de-uso': 'usecase',
      'matematico': 'mathematician',
      'leccion': 'lesson',
      'modelo': 'modelo',
      'plan-de-estudio': 'plan-de-estudio',
      'axioma': 'axioma',
    };
    const key = groupMap[node.group] || node.group;
    return GRAPH_NODE_COLORS[key] || '#cccccc';
  };

  const drawNode = useCallback((node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
    if (node.x === undefined || node.y === undefined || !Number.isFinite(node.x) || !Number.isFinite(node.y)) return;

    const isHighlighted = hoverNode ? highlightNodes.has(node) : true;
    const isCompleted = useProgressStore.getState().isRead(node.id);

    // Configuración base
    const radius = node.val / 2;
    let color = getNodeColor(node);

    // Si está completado, dibujar un anillo concéntrico de estilo astrolabio/diagrama clásico
    if (isCompleted && node.group !== 'central' && node.group !== 'branch') {
      color = '#7C9082'; // Salvia
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius + (3 / globalScale), 0, 2 * Math.PI, false);
      ctx.strokeStyle = '#7C9082';
      ctx.lineWidth = 1 / globalScale;
      ctx.stroke();
    }

    // Dibujar Círculo
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = isHighlighted ? color : color + '40'; // Añadir transparencia si no está resaltado
    ctx.fill();

    // Borde de tinta clásico
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = (isHighlighted ? 1.5 : 0.5) / globalScale;
    ctx.stroke();

    const isMainBranch = node.id?.startsWith('rama-');
    const isSubBranch = node.id?.startsWith('subrama-');

    const isActivelyHovered = hoverNode ? highlightNodes.has(node) : false;

    const shouldDrawText =
      isActivelyHovered ||
      node.group === 'central' ||
      (isMainBranch && globalScale >= 0.4) ||
      (isSubBranch && globalScale >= 0.8) ||
      (globalScale >= 1.2);

    // Dibujar Texto legíble tipo imprenta
    if (shouldDrawText) {
      const label = node.name;
      const fontSize = node.group === 'central' ? 18 / globalScale : ((isMainBranch || isSubBranch) ? 14 / globalScale : 10 / globalScale);
      // Tipografía clásica con serifa
      ctx.font = `${node.group === 'central' ? 'bold' : 'normal'} ${fontSize}px "Georgia", serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Sombra para legibilidad sobre los enlaces (ajustada por la escala global para que no reviente al hacer zoom)
      ctx.shadowColor = 'rgba(248, 246, 241, 0.9)';
      ctx.shadowBlur = 4 / globalScale;
      ctx.lineWidth = 3 / globalScale;
      ctx.strokeStyle = 'rgba(248, 246, 241, 0.9)';
      ctx.strokeText(label, node.x, node.y + radius + (fontSize / 2) + (4 / globalScale));

      ctx.shadowBlur = 0;
      ctx.fillStyle = isHighlighted ? '#333333' : '#33333380';
      if (node.group === 'central') ctx.fillStyle = isHighlighted ? '#C86446' : '#C8644680';
      ctx.fillText(label, node.x, node.y + radius + (fontSize / 2) + (4 / globalScale));
    }
  }, [hoverNode, highlightNodes]);

  // Ajustar cámara inicial
  useEffect(() => {
    if (graphRef.current) {
      setTimeout(() => {
        graphRef.current?.zoomToFit(400, 50);

        // Ajustes de física (expandir la red de forma controlada)
        graphRef.current?.d3Force('charge')?.strength(-120); // Repulsión más suave para mantener los nodos juntos
        graphRef.current?.d3Force('link')?.distance((link: { source: { group: string }, target: { group: string } }) => {
          if (link.source.group === 'central' || link.target.group === 'central') return 100;
          if (link.source.group === 'branch' || link.target.group === 'branch') return 60;
          return 30;
        });
      }, 500);
    }
  }, []);

  // Window resize resize
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full h-screen bg-lienzo overflow-hidden font-serif relative" style={{ backgroundImage: 'url(/Matematika/images/bg_arts_crafts.png)', backgroundSize: '600px', backgroundRepeat: 'repeat' }}>

      {/* Buscador */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Buscar concepto..."
            className="w-64 bg-lienzo border-2 border-carbon/80 px-4 py-2 text-carbon outline-none focus:border-terracota placeholder:text-carbon/40 italic shadow-lg"
          />
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 mt-1 w-full bg-lienzo border-2 border-carbon/80 shadow-xl max-h-60 overflow-y-auto">
              {searchResults.map((node) => (
                <div
                  key={node.id}
                  className="px-4 py-2 hover:bg-carbon/5 cursor-pointer text-carbon text-sm border-b border-carbon/10 last:border-0"
                  onClick={() => handleSearchResultClick(node)}
                >
                  <div className="font-bold">{node.name}</div>
                  <div className="text-xs text-carbon/60 italic capitalize">{node.group}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Leyenda */}
      <div className="absolute bottom-8 right-8 z-50 bg-lienzo border-2 border-carbon/80 p-5 shadow-2xl">
        <div className="border border-carbon/20 p-4 relative">
          <h4 className="font-bold text-sm uppercase tracking-widest mb-4 text-carbon/80 text-center mt-2" style={{ fontVariant: 'small-caps' }}>Leyenda</h4>
          <div className="flex flex-col gap-3 text-sm italic text-carbon/80">
            <div className="flex items-center gap-3"><div className="w-4 h-4 border border-carbon bg-[#333333]"></div> Matemáticas</div>
            <div className="flex items-center gap-3"><div className="w-4 h-4 border border-carbon bg-[#C86446]"></div> Ramas</div>
            <div className="flex items-center gap-3"><div className="w-4 h-4 border border-carbon bg-[#f5c542]"></div> Axiomas</div>
            <div className="flex items-center gap-3"><div className="w-4 h-4 border border-carbon bg-[#A2C2A2]"></div> Teoremas / Lemas</div>
            <div className="flex items-center gap-3"><div className="w-4 h-4 border border-carbon bg-[#5D7080]"></div> Definiciones</div>
            <div className="flex items-center gap-3"><div className="w-4 h-4 border border-carbon bg-[#9FAABF]"></div> Sistemas / Modelos</div>
            <div className="flex items-center gap-3"><div className="w-4 h-4 border border-carbon bg-[#c49b4f]"></div> Matemáticos</div>
          </div>
          <div className="mt-4 pt-3 border-t border-carbon/20">
            <Link href="/axiomas">
              <a className="flex items-center justify-center gap-2 text-xs font-sans uppercase tracking-widest text-terracota hover:text-carbon transition-colors font-bold">
                Grafo de axiomas &rarr;
              </a>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 cursor-move">
        <ForceGraph2D
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ref={graphRef as any}
          width={dimensions.width}
          height={dimensions.height}
          graphData={graphData}
          nodeLabel={() => ''} // El label nativo lo desactivamos
          nodeCanvasObject={drawNode}
          nodeCanvasObjectMode={() => 'replace'}
          onNodeHover={handleNodeHover}
          linkColor={(link) => highlightLinks.has(link) ? '#C86446' : '#00000015'}
          linkWidth={(link) => highlightLinks.has(link) ? 2 : 1}
          linkDirectionalParticles={(link) => highlightLinks.has(link) ? 4 : 1}
          linkDirectionalParticleWidth={(link) => highlightLinks.has(link) ? 6 : 2}
          linkDirectionalParticleSpeed={0.005}
          onNodeClick={handleNodeClick}
          backgroundColor="rgba(0,0,0,0)" // Transparente para ver el fondo
        />
      </div>
    </div>
  );
};
