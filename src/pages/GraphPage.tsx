import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import ForceGraph2D from 'react-force-graph-2d';
import { db } from '../store/content';
import { useGlossaryStore } from '../store/GlossaryStore';
import { useProgressStore } from '../store/UserProgressStore';

// Acceso directo a ContentStore.slugify
const slugify = (text: string) => text.toString().toLowerCase()
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/\s+/g, '-')
  .replace(/[^\w-]+/g, '')
  .replace(/--+/g, '-')
  .replace(/^-+/, '')
  .replace(/-+$/, '');

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
  
  // Extraer datos del ContentStore
  const graphData = useMemo(() => {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const branchNames = new Map<string, string>(); // slug -> Nombre Original
    const subBranchNames = new Map<string, {name: string, parentSlug: string}>(); // slug -> {name, parentSlug}
    
    // Recolectar ramas principales y subramas
    const extractBranches = (item: { tags?: string[] }) => {
      if (item.tags?.[0]) branchNames.set(slugify(item.tags[0]), item.tags[0]);
      if (item.tags?.[0] && item.tags?.[1]) {
        subBranchNames.set(slugify(item.tags[1]), { name: item.tags[1], parentSlug: slugify(item.tags[0]) });
      }
    };

    db.theorems.forEach(extractBranches);
    db.definitions.forEach(extractBranches);
    db.lessons.forEach(extractBranches);

    // Añadir Nodo Central
    nodes.push({ id: 'matematicas', name: 'MATEMÁTICAS', group: 'central', val: 60 });

    // Añadir Nodos: Ramas (como "raíces")
    branchNames.forEach((name, slug) => {
      const branchId = `rama-${slug}`;
      nodes.push({ id: branchId, name: name.toUpperCase(), group: 'branch', val: 35 });
      links.push({ source: branchId, target: 'matematicas' });
    });

    // Añadir Nodos: Sub-Ramas
    subBranchNames.forEach((data, slug) => {
      const subBranchId = `subrama-${slug}`;
      nodes.push({ id: subBranchId, name: data.name.toUpperCase(), group: 'branch', val: 25 });
      links.push({ source: subBranchId, target: `rama-${data.parentSlug}` });
    });

    // Teoremas
    db.theorems.forEach((thm, slug) => {
      nodes.push({ id: slug, name: thm.title, group: thm.type || 'theorem', val: 15 });
      
      // Enlace a la rama principal
      if (!thm.requires || thm.requires.length === 0) {
        if (thm.tags?.[1]) {
          links.push({ source: slug, target: `subrama-${slugify(thm.tags[1])}` });
        } else if (thm.tags?.[0]) {
          links.push({ source: slug, target: `rama-${slugify(thm.tags[0])}` });
        }
      }

      // Enlaces lógicos (requires, parentTheorem)
      if (thm.requires) {
        thm.requires.forEach(req => {
          links.push({ source: slug, target: req });
        });
      }
      if (thm.parentTheorem) {
        links.push({ source: slug, target: thm.parentTheorem });
      }
    });

    // Definiciones
    db.definitions.forEach((def, slug) => {
      nodes.push({ id: slug, name: def.title, group: 'definition', val: 10 });
      if (def.tags?.[1]) {
        links.push({ source: slug, target: `subrama-${slugify(def.tags[1])}` });
      } else if (def.tags?.[0]) {
        links.push({ source: slug, target: `rama-${slugify(def.tags[0])}` });
      }
    });

    // Casos de Uso
    db.usecases.forEach((uc, slug) => {
      nodes.push({ id: slug, name: uc.title, group: 'usecase', val: 8 });
      if (uc.concept) {
        links.push({ source: slug, target: uc.concept });
      }
    });

    // Ejemplos
    db.examples.forEach((ex, slug) => {
      nodes.push({ id: slug, name: ex.title, group: 'example', val: 6 });
      if (ex.relatedTheorem) {
        links.push({ source: slug, target: ex.relatedTheorem });
      }
    });

    // Ejercicios
    db.exercises.forEach((ez, slug) => {
      nodes.push({ id: slug, name: ez.title, group: 'exercise', val: 6 });
      if (ez.relatedTheorem) {
        links.push({ source: slug, target: ez.relatedTheorem });
      }
    });

    // Enlaces Orgánicos (Semánticos) extraídos de los ConceptLinks
    const allEntities = [
      ...Array.from(db.theorems.values()),
      ...Array.from(db.definitions.values()),
      ...Array.from(db.usecases.values()),
      ...Array.from(db.examples.values()),
      ...Array.from(db.exercises.values()),
      ...Array.from(db.lessons.values()),
      ...Array.from(db.mathematicians.values())
    ];

    allEntities.forEach((entity: { slug?: string; id?: string; links?: string[] }) => {
      if (entity.links && Array.isArray(entity.links)) {
        entity.links.forEach((linkTarget: string) => {
          links.push({ source: (entity.slug || entity.id) as string, target: linkTarget });
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
    } else {
      openTerm(node.id);
    }
  }, [setLocation, openTerm]);

  const getNodeColor = (node: GraphNode) => {
    switch (node.group) {
      case 'central': return '#333333'; // Carbon
      case 'branch': return '#C86446'; // Terracota
      case 'theorem': return '#A2C2A2'; // Salvia
      case 'lemma': return '#A2C2A2'; 
      case 'corollary': return '#A2C2A2';
      case 'definition': return '#5D7080'; // Pizarra
      case 'usecase': return '#C86446'; // Terracota (Diferente forma/val)
      case 'example': return '#5D7080'; // Pizarra
      case 'exercise': return '#A2C2A2'; // Salvia
      default: return '#cccccc';
    }
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
      ctx.strokeText(label, node.x, node.y + radius + (fontSize/2) + (4/globalScale));
      
      ctx.shadowBlur = 0;
      ctx.fillStyle = isHighlighted ? '#333333' : '#33333380';
      if (node.group === 'central') ctx.fillStyle = isHighlighted ? '#C86446' : '#C8644680';
      ctx.fillText(label, node.x, node.y + radius + (fontSize/2) + (4/globalScale));
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
    <div className="w-full h-screen bg-[#F8F6F1] overflow-hidden font-serif relative" style={{ backgroundImage: 'url(/images/bg_arts_crafts.png)', backgroundSize: '600px', backgroundRepeat: 'repeat' }}>
      
      {/* Buscador */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50">
        <div className="relative">
          <input 
            type="text" 
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Buscar concepto..." 
            className="w-64 bg-[#F8F6F1] border-2 border-carbon/80 px-4 py-2 text-carbon outline-none focus:border-terracota placeholder:text-carbon/40 italic shadow-lg"
          />
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 mt-1 w-full bg-[#F8F6F1] border-2 border-carbon/80 shadow-xl max-h-60 overflow-y-auto">
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

      {/* Leyenda Clásica */}
      <div className="absolute bottom-8 right-8 z-50 bg-[#F8F6F1] border-2 border-carbon/80 p-5 shadow-2xl">
        <div className="border border-carbon/20 p-4 relative">
          <h4 className="font-bold text-sm uppercase tracking-widest mb-4 text-carbon/80 text-center mt-2" style={{ fontVariant: 'small-caps' }}>Leyenda</h4>
          <div className="flex flex-col gap-3 text-sm italic text-carbon/80">
            <div className="flex items-center gap-3"><div className="w-4 h-4 border border-carbon bg-[#333333]"></div> Matemáticas</div>
            <div className="flex items-center gap-3"><div className="w-4 h-4 border border-carbon bg-[#C86446]"></div> Ramas Clásicas</div>
            <div className="flex items-center gap-3"><div className="w-4 h-4 border border-carbon bg-[#A2C2A2]"></div> Teoremas / Ejercicios</div>
            <div className="flex items-center gap-3"><div className="w-4 h-4 border border-carbon bg-[#5D7080]"></div> Definiciones / Ejemplos</div>
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
