import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { publicAsset } from '@/shared/lib/routeHelper';
import ForceGraph2D from 'react-force-graph-2d';
import type {
  ForceGraphMethods,
  ForceGraphProps,
  GraphData,
  LinkObject,
  NodeObject,
} from 'react-force-graph-2d';
import { GRAPH_NODE_COLORS } from '@/shared/lib/constants';
import { useGlossaryStore } from '@/features/glossary/GlossaryStore';
import { useProgressStore } from '@/features/progress/UserProgressStore';
import { buildKnowledgeGraphData, GraphNode, GraphLink } from '@/features/graph/lib/knowledgeGraphBuilder';
import { GraphLegend } from '@/features/graph/ui/components/GraphLegend';
import { GraphSearch } from '@/features/graph/ui/components/GraphSearch';

type KnowledgeGraphNode = NodeObject<GraphNode>;
type KnowledgeGraphLink = LinkObject<GraphNode, GraphLink>;
type KnowledgeGraphProps = ForceGraphProps<GraphNode, GraphLink>;
type KnowledgeGraphRef = ForceGraphMethods<KnowledgeGraphNode, KnowledgeGraphLink>;
type ResolvedGraphLink = KnowledgeGraphLink & {
  source: KnowledgeGraphNode;
  target: KnowledgeGraphNode;
};
type ChargeForce = {
  strength: (strength: number) => unknown;
};
type LinkForce = {
  distance: (distance: (link: ResolvedGraphLink) => number) => unknown;
};

/**
 * Página Explorador (Knowledge Graph).
 * Renderiza una red tridimensional (2D proyectada) de todos los conceptos matemáticos.
 * Permite explorar conexiones entre teoremas, lecciones, biógrafias y demostraciones.
 */
export const GraphPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const { openTerm } = useGlossaryStore();
  const graphRef = useRef<KnowledgeGraphRef | undefined>(undefined);

  // Extraer datos del ContentStore usando jerarquía MSC2020 definida
  const graphData: GraphData<GraphNode, GraphLink> = useMemo(() => buildKnowledgeGraphData(), []);

  const [hoverNode, setHoverNode] = useState<KnowledgeGraphNode | null>(null);
  const [highlightNodes, setHighlightNodes] = useState(new Set<KnowledgeGraphNode>());
  const [highlightLinks, setHighlightLinks] = useState(new Set<KnowledgeGraphLink>());
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GraphNode[]>([]);

  const handleSearchChange = (query: string) => {
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
    handleNodeHover(node, hoverNode);
  };

  const handleNodeHover: NonNullable<KnowledgeGraphProps['onNodeHover']> = useCallback((node) => {
    const newHighlightNodes = new Set<KnowledgeGraphNode>();
    const newHighlightLinks = new Set<KnowledgeGraphLink>();
    
    if (node) {
      newHighlightNodes.add(node);
      graphData.links.forEach((link) => {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        
        if (sourceId === node.id) {
          newHighlightLinks.add(link);
          const tgt = typeof link.target === 'object' ? link.target : graphData.nodes.find(n => n.id === link.target);
          if (tgt) newHighlightNodes.add(tgt);
        }
        if (targetId === node.id) {
          newHighlightLinks.add(link);
          const src = typeof link.source === 'object' ? link.source : graphData.nodes.find(n => n.id === link.source);
          if (src) newHighlightNodes.add(src);
        }
      });
    }
    
    setHoverNode(node || null);
    setHighlightNodes(newHighlightNodes);
    setHighlightLinks(newHighlightLinks);
  }, [graphData]);

   
  const handleNodeClick: NonNullable<KnowledgeGraphProps['onNodeClick']> = useCallback((node) => {
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

  const drawNodeLabel = useCallback((
    ctx: CanvasRenderingContext2D,
    node: KnowledgeGraphNode,
    globalScale: number,
    isHighlighted: boolean,
    hoverNode: KnowledgeGraphNode | null,
    highlightNodes: Set<KnowledgeGraphNode>,
    radius: number,
  ) => {
    const isMainBranch = node.id?.startsWith('rama-');
    const isSubBranch = node.id?.startsWith('subrama-');
    const isActivelyHovered = hoverNode ? highlightNodes.has(node) : false;

    if (!isActivelyHovered && node.group !== 'central' &&
        !(isMainBranch && globalScale >= 0.4) &&
        !(isSubBranch && globalScale >= 0.8) &&
        globalScale < 1.2) return;

    const label = node.name;
    const nodeX = node.x!;
    const nodeY = node.y!;

    let baseSize: number;
    if (node.group === 'central') {
      baseSize = 18;
    } else if (isMainBranch || isSubBranch) {
      baseSize = 14;
    } else {
      baseSize = 10;
    }
    const fontSize = baseSize / globalScale;
    ctx.font = `${node.group === 'central' ? 'bold' : 'normal'} ${fontSize}px "Georgia", serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const textY = nodeY + radius + (fontSize / 2) + (4 / globalScale);

    // Shadow for readability
    ctx.shadowColor = 'rgba(248, 246, 241, 0.9)';
    ctx.shadowBlur = 4 / globalScale;
    ctx.lineWidth = 3 / globalScale;
    ctx.strokeStyle = 'rgba(248, 246, 241, 0.9)';
    ctx.strokeText(label, nodeX, textY);

    ctx.shadowBlur = 0;
    let textColor: string;
    if (node.group === 'central') {
      textColor = isHighlighted ? '#C86446' : '#C8644680';
    } else {
      textColor = isHighlighted ? '#333333' : '#33333380';
    }
    ctx.fillStyle = textColor;
    ctx.fillText(label, nodeX, textY);
  }, []);

  const drawNode: NonNullable<KnowledgeGraphProps['nodeCanvasObject']> = useCallback((node, ctx, globalScale) => {
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

    drawNodeLabel(ctx, node, globalScale, isHighlighted, hoverNode, highlightNodes, radius);
  }, [hoverNode, highlightNodes, drawNodeLabel]);

  // Ajustar cámara inicial
  useEffect(() => {
    if (graphRef.current) {
      setTimeout(() => {
        graphRef.current?.zoomToFit(400, 50);

        // Ajustes de física (expandir la red de forma controlada)
        (graphRef.current?.d3Force('charge') as ChargeForce | undefined)?.strength(-120); // Repulsión más suave para mantener los nodos juntos
        (graphRef.current?.d3Force('link') as LinkForce | undefined)?.distance((link) => {
          if (link.source.group === 'central' || link.target.group === 'central') return 100;
          if (link.source.group === 'branch' || link.target.group === 'branch') return 60;
          return 30;
        });
      }, 500);
    }
  }, []);

  // Window resize handler
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full h-screen bg-lienzo overflow-hidden font-serif relative" style={{ backgroundImage: `url(${publicAsset('/images/bg-arts-crafts-1.png')})`, backgroundSize: '600px', backgroundRepeat: 'repeat' }}>

      <GraphSearch
        searchQuery={searchQuery}
        setSearchQuery={handleSearchChange}
        searchResults={searchResults}
        onSearchSelect={handleSearchResultClick}
        graphNodes={graphData.nodes}
      />

      <GraphLegend />

      <div className="absolute inset-0 cursor-move">
        <ForceGraph2D<GraphNode, GraphLink>
          ref={graphRef}
          width={dimensions.width}
          height={dimensions.height}
          graphData={graphData}
          nodeLabel={() => ''} // El label nativo lo desactivamos
          nodeCanvasObject={drawNode}
          nodeCanvasObjectMode={() => 'replace'}
          onNodeHover={handleNodeHover}
          linkColor={(link: KnowledgeGraphLink) => highlightLinks.has(link) ? '#C86446' : '#00000015'}
          linkWidth={(link: KnowledgeGraphLink) => highlightLinks.has(link) ? 2 : 1}
          linkDirectionalParticles={(link: KnowledgeGraphLink) => highlightLinks.has(link) ? 4 : 1}
          linkDirectionalParticleWidth={(link: KnowledgeGraphLink) => highlightLinks.has(link) ? 6 : 2}
          linkDirectionalParticleSpeed={0.005}
          onNodeClick={handleNodeClick}
          backgroundColor="rgba(0,0,0,0)" // Transparente para ver el fondo
        />
      </div>
    </div>
  );
};
