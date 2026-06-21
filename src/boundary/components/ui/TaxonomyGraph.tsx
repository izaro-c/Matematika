import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { navigate } from 'wouter/use-browser-location';
import ForceGraph2D from 'react-force-graph-2d';
import { useProgressStore } from '@/controller/store/UserProgressStore';

/**
 * Propiedades del Grafo Taxonómico
 */
interface TaxonomyGraphProps {
  taxonomy: {
    id: string;
    slug: string;
    subBranches: { name: string; slug: string }[];
    directItems: { type: string; item: { id: string; slug?: string; title?: string; requires?: string[] }; subBranchSlug?: string }[];
  };
}

/**
 * Componente interactivo que renderiza un grafo de fuerza 2D.
 * Visualiza la taxonomía matemática de una rama específica (teoremas, lecciones, definiciones).
 * Muestra dependencias (requerimientos) entre conceptos de manera dinámica.
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

export const TaxonomyGraph: React.FC<TaxonomyGraphProps> = ({ taxonomy }) => {
  const { isRead } = useProgressStore();
  const [hoverNode, setHoverNode] = useState<GraphNode | null>(null);
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());

  const graphData = useMemo(() => {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];

    // Root (The branch itself) - Ahora se ve como una RAMA (Terracota), no como el nodo central de Matemáticas
    const branchName = (taxonomy as any).name || taxonomy.id || taxonomy.slug;
    const branchCode = (taxonomy as any).id;
    const showCode = branchCode && /^\d{2}[A-Z]?$/.test(branchCode) && branchCode !== branchName;
    nodes.push({ id: taxonomy.slug, name: showCode ? `${branchCode} ${branchName}` : branchName, group: 'branch', val: 20 });

    // SubBranches
    taxonomy.subBranches.forEach(sub => {
      const branchId = `branch-${sub.slug}`;
      const subName = /^\d{2}[A-Z]?$/.test(sub.slug) ? `${sub.slug} ${sub.name.toUpperCase()}` : sub.name;
      nodes.push({ id: branchId, name: subName, group: 'branch', val: 12, url: `${sub.slug}` });
      links.push({ source: branchId, target: taxonomy.slug });
    });

    // Items
    taxonomy.directItems.forEach((itemObj) => {
      const item = itemObj.item;
      const type = itemObj.type;

      let url = '/';
      if (type === 'lesson') url = `/Matematika/${item.slug}`;
      else if (type === 'theorem') url = `/Matematika/teorema/${item.id}`;
      else if (type === 'definition') url = `/Matematika/definicion/${item.id}`;
      else if (type === 'example') url = `/Matematika/ejemplo/${item.id}`;
      else if (type === 'exercise') url = `/Matematika/ejercicio/${item.id}`;
      else if (type === 'usecase') url = `/Matematika/caso/${item.id}`;
      else if (type === 'model') url = `/Matematika/modelo/${item.id}`;
      else if (type === 'axiom') url = `/Matematika/axioma/${item.id}`;

      nodes.push({
        id: item.id, // ID exacto para isRead
        name: item.title || item.id,
        group: type, // 'theorem', 'definition', 'lesson'
        val: 7,
        url
      });

      // Lógica de extracto: si el item tiene dependencias (requires) hacia otros items
      // que también pertenecen a esta rama, creamos una conexión directa entre ellos.
      let hasLocalDependency = false;

      if (item.requires && Array.isArray(item.requires)) {
        item.requires.forEach((reqId: string) => {
          // Comprobar si la dependencia existe en este grafo local
          const isLocal = taxonomy.directItems.some(di => di.item.id === reqId);
          if (isLocal) {
            links.push({ source: item.id, target: reqId });
            hasLocalDependency = true;
          }
        });
      }

      // Si no tiene dependencias dentro de esta misma rama (o no tiene dependencias en absoluto),
      // lo anclamos a la sub-rama a la que pertenece, o a la raíz de la rama si no tiene sub-rama.
      if (!hasLocalDependency) {
        if (itemObj.subBranchSlug) {
          links.push({ source: item.id, target: `branch-${itemObj.subBranchSlug}` });
        } else {
          links.push({ source: item.id, target: taxonomy.slug });
        }
      }
    });

    return { nodes, links };
  }, [taxonomy]);

  const updateHighlight = useCallback(() => {
    setHighlightNodes(new Set(highlightNodes));
    setHighlightLinks(new Set(highlightLinks));
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
    if (node.url) {
      navigate(node.url);
    }
  }, []);

  const getNodeColor = (node: GraphNode) => {
    switch (node.group) {
      case 'central': return '#333333'; // Carbon
      case 'branch': return '#C86446'; // Terracota
      case 'theorem': return '#A2C2A2'; // Salvia
      case 'lemma': return '#A2C2A2';
      case 'corollary': return '#A2C2A2';
      case 'definition': return '#5D7080'; // Pizarra
      case 'usecase': return '#C86446'; // Terracota
      case 'example': return '#5D7080'; // Pizarra
      case 'exercise': return '#A2C2A2'; // Salvia
      case 'lesson': return '#A2C2A2';
      case 'model': return '#8b3a3a'; //granate
      default: return '#cccccc';
    }
  };

  const drawNode = useCallback((node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
    if (node.x === undefined || node.y === undefined || !Number.isFinite(node.x) || !Number.isFinite(node.y)) return;

    const isHighlighted = hoverNode ? highlightNodes.has(node) : true;
    const isCompleted = isRead(node.id);

    const radius = node.val / 2;
    let color = getNodeColor(node);

    if (isCompleted && node.group !== 'central' && node.group !== 'branch') {
      color = '#7C9082'; // Salvia
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius + (3 / globalScale), 0, 2 * Math.PI, false);
      ctx.strokeStyle = '#7C9082';
      ctx.lineWidth = 1 / globalScale;
      ctx.stroke();
    }

    // Dibujar Círculo principal
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = isHighlighted ? color : color + '40';
    ctx.fill();

    // Borde de tinta clásico
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = (isHighlighted ? 1.5 : 0.5) / globalScale;
    ctx.stroke();

    const isRoot = node.id === taxonomy.slug;
    const isSubBranch = node.id?.startsWith('branch-');

    const isActivelyHovered = hoverNode ? highlightNodes.has(node) : false;

    const shouldDrawText =
      isActivelyHovered ||
      isRoot ||
      (isSubBranch && globalScale >= 1.5) ||
      (globalScale >= 2.5);

    // Dibujar Texto legíble tipo imprenta
    if (shouldDrawText) {
      const label = node.name;
      const fontSize = isRoot ? 12 / globalScale : (isSubBranch ? 10 / globalScale : 9 / globalScale);
      ctx.font = `${node.group === 'central' ? 'bold' : 'normal'} ${fontSize}px "Georgia", serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Sombra para legibilidad sobre los enlaces (ajustada por la escala)
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
  }, [hoverNode, highlightNodes, isRead, taxonomy.slug]);

  // Ajuste automático de tamaño del Canvas
  const [dimensions, setDimensions] = useState({ width: 0, height: 400 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight || 400
      });
    }
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight || 400
        });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-[400px] border-y border-carbon/20 overflow-hidden relative shadow-inner cursor-move" style={{ backgroundImage: 'url(/images/bg-arts-crafts-1.png)', backgroundSize: '600px', backgroundRepeat: 'repeat' }}>
      <div className="absolute z-10 top-4 left-4 text-[10px] font-sans uppercase tracking-widest text-carbon/60 select-none pointer-events-none bg-lienzo/90 px-3 py-1.5 border border-carbon/10 shadow-sm backdrop-blur-sm rounded-none">
        Grafo de dependencias: {(taxonomy as any).name || taxonomy.id}
      </div>
      <ForceGraph2D
        width={dimensions.width}
        height={dimensions.height}
        graphData={graphData}
        nodeLabel={() => ''}
        nodeCanvasObject={drawNode}
        onNodeHover={handleNodeHover}
        onNodeClick={handleNodeClick}
        linkColor={(link: object) => highlightLinks.has(link) ? '#C86446' : 'rgba(51, 51, 51, 0.15)'}
        linkWidth={(link: object) => highlightLinks.has(link) ? 2 : 1}
        enableNodeDrag={true}
        enableZoomInteraction={true}
        enablePanInteraction={true}
      />
    </div>
  );
};
