import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { publicAsset } from '@/lib/routes';
import ForceGraph2D from 'react-force-graph-2d';
import type {
  ForceGraphMethods,
  ForceGraphProps,
  GraphData,
  LinkObject,
  NodeObject,
} from 'react-force-graph-2d';
import { useGlossaryStore } from '@/lib/stores/GlossaryStore';
import { useProgressStore } from '@/lib/stores/UserProgressStore';
import { buildKnowledgeGraphData, GraphNode, GraphLink } from '@/fixed-pages/graph/lib/knowledgeGraphBuilder';
import { GraphLegend } from '@/fixed-pages/graph/ui/components/GraphLegend';
import { GraphSearch } from '@/fixed-pages/graph/ui/components/GraphSearch';
import { GraphExplorerLink } from '@/fixed-pages/graph/ui/components/GraphExplorerLink';
import { getKnowledgeGraphContentType, getKnowledgeGraphLegendTypes } from '@/fixed-pages/graph/lib/graphUtils';
import {
  INK_TIMING,
  easeOut,
  easeStamp,
  introDelays,
  prefersReducedMotion,
  progress,
  shouldPlayIntro,
  traceHandCircle,
  traceSegment,
  tweenValue,
  type Tween,
} from '@/fixed-pages/graph/lib/graphInk';
import { CONTENT_TYPE_CONFIG, getContentTypeLabel } from '@/lib/theme/constants';
import { useThemeColors } from '@/lib/theme/useThemeColors';
import { useI18n } from '@/i18n';

type KnowledgeGraphNode = NodeObject<GraphNode>;
type KnowledgeGraphLink = LinkObject<GraphNode, GraphLink>;
type KnowledgeGraphProps = ForceGraphProps<GraphNode, GraphLink>;
type KnowledgeGraphRef = ForceGraphMethods<KnowledgeGraphNode, KnowledgeGraphLink>;
type ResolvedGraphLink = KnowledgeGraphLink & {
  source: KnowledgeGraphNode;
  target: KnowledgeGraphNode;
};

// PROTOTIPO desechable: ?g=f (índice en cartela y microinteracciones de tinta).
type GraphProto = 'f' | null;
const readProto = (): GraphProto => (new URLSearchParams(window.location.search).get('g') === 'f' ? 'f' : null);

type LabelRect = { x0: number; y0: number; x1: number; y1: number };
const overlaps = (a: LabelRect, b: LabelRect) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;

const labelRank = (node: GraphNode) => {
  if (node.group === 'central') return 0;
  if (node.id.startsWith('rama-')) return 1;
  if (node.id.startsWith('subrama-')) return 2;
  return 3;
};

const endpointId = (end: string | GraphNode | undefined) => (typeof end === 'object' ? end.id : end);

/** Conjunto resaltado: el vecindario de un nodo (con su origen, para trazar desde él) o un tipo de la leyenda. */
interface InkFocus {
  nodes: Set<string> | null;
  links: Set<KnowledgeGraphLink> | null;
  origin: string | null;
  start: number;
}

/**
 * Página Explorador (Knowledge Graph).
 * Renderiza una red tridimensional (2D proyectada) de todos los conceptos matemáticos.
 * Permite explorar conexiones entre teoremas, métodos, biografías y demostraciones.
 */
export const GraphPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const { lang, t } = useI18n();
  const { openTerm } = useGlossaryStore();
  const theme = useThemeColors();
  const graphRef = useRef<KnowledgeGraphRef | undefined>(undefined);
  const [proto] = useState<GraphProto>(readProto);
  const [legendOpen, setLegendOpen] = useState(() => new URLSearchParams(window.location.search).has('legend'));
  const fitPending = useRef(false);
  const graphBackgroundStyle = {
    '--graph-light-background': `url("${publicAsset('/images/backgrounds/bg-arts-crafts-1.webp')}")`,
    '--graph-dark-background': `url("${publicAsset('/images/backgrounds/bg-arts-crafts-dark.webp')}")`,
  } as React.CSSProperties;

  // Extraer datos del ContentStore usando jerarquía MSC2020 definida
  const graphData: GraphData<GraphNode, GraphLink> = useMemo(() => buildKnowledgeGraphData(lang), [lang]);
  const labelOrder = useMemo(
    () => [...graphData.nodes].sort((a, b) => labelRank(a) - labelRank(b) || b.val - a.val),
    [graphData],
  );
  const nodeById = useMemo(() => new Map(graphData.nodes.map(n => [n.id, n as KnowledgeGraphNode])), [graphData]);

  const [hoverNode, setHoverNode] = useState<KnowledgeGraphNode | null>(null);
  const [highlightNodes, setHighlightNodes] = useState(new Set<KnowledgeGraphNode>());
  const [highlightLinks, setHighlightLinks] = useState(new Set<KnowledgeGraphLink>());
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GraphNode[]>([]);

  // Estado de tinta (prototipo). Lo que cambia en cada fotograma vive en refs.
  const [reducedMotion] = useState(prefersReducedMotion);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverType, setHoverType] = useState<string | null>(null);
  const [pinnedType, setPinnedType] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);
  const focusRef = useRef<InkFocus>({ nodes: null, links: null, origin: null, start: 0 });
  const veilRef = useRef<Tween>({ from: 0, to: 0, start: 0, duration: 0 });
  const markRef = useRef<{ id: string; start: number } | null>(null);
  const [playIntro] = useState(() => (proto ? shouldPlayIntro() : false));
  const introPending = useRef(playIntro);
  const introRef = useRef<{ start: number; delays: Map<string, number> } | null>(null);
  const animTimer = useRef<number | undefined>(undefined);
  const duration = useCallback((ms: number) => (reducedMotion ? 0 : ms), [reducedMotion]);

  // Mientras dura una animación el lienzo se redibuja en cada fotograma; después vuelve a pausarse.
  // Cada animación solo alarga el plazo: una corta no recorta a otra en curso.
  const animUntil = useRef(0);
  const kick = useCallback((ms: number) => {
    const end = performance.now() + ms + 80;
    if (end <= animUntil.current) return;
    animUntil.current = end;
    setAnimating(true);
    window.clearTimeout(animTimer.current);
    animTimer.current = window.setTimeout(() => setAnimating(false), end - performance.now());
  }, []);
  useEffect(() => () => window.clearTimeout(animTimer.current), []);

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

  const handleSearchResultClick = (node: GraphNode, clickedAt: number) => {
    setSearchQuery('');
    setSearchResults([]);
    if (proto) {
      // La cámara se desliza hasta el nodo y, al llegar, se le traza un círculo de pluma.
      const fg = graphRef.current;
      const glide = duration(600);
      if (fg && node.x !== undefined && node.y !== undefined) {
        fg.centerAt(node.x, node.y, glide);
        fg.zoom(Math.max(fg.zoom(), 2.5), glide);
      }
      setSelectedId(node.id);
      markRef.current = { id: node.id, start: clickedAt + glide };
      kick(glide + duration(INK_TIMING.mark));
      return;
    }
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

  const navigateToNode = useCallback((node: GraphNode) => {
    if (node.group === 'branch' || node.group === 'central') {
      if (node.group === 'branch') {
        // Soporte tanto para ramas principales como sub-ramas
        const isSubBranch = node.id.startsWith('subrama-');
        const slug = node.id.replace(isSubBranch ? 'subrama-' : 'rama-', '');
        setLocation(`/rama/${slug}`);
      }
    } else if (node.group === 'modelo') {
      setLocation(`/modelo/${node.id}`);
    } else if (node.group === 'metodo') {
      setLocation(`/metodo/${node.id}`);
    } else if (node.group === 'caso-de-uso') {
      setLocation(`/caso-de-uso/${node.id}`);
    } else if (node.group === 'sistema-axiomatico') {
      setLocation(`/sistema/${node.id}`);
    } else {
      openTerm(node.id);
    }
  }, [setLocation, openTerm]);

  const handleNodeClick: NonNullable<KnowledgeGraphProps['onNodeClick']> = useCallback((node) => {
    // En táctil no hay hover: el primer toque muestra el vecindario y el segundo abre la página.
    if (proto && window.matchMedia('(hover: none)').matches && selectedId !== node.id) {
      markRef.current = null;
      setSelectedId(node.id);
      return;
    }
    navigateToNode(node);
  }, [proto, selectedId, navigateToNode]);

  const handleBackgroundClick = useCallback(() => {
    markRef.current = null;
    setSelectedId(null);
    setPinnedType(null);
  }, []);

  // Qué se resalta: un tipo de la leyenda manda sobre el vecindario de un nodo.
  const focusNodeId = hoverNode?.id ?? selectedId;
  const focusType = hoverType ?? pinnedType;
  useEffect(() => {
    if (!proto) return;
    const now = performance.now();
    const current = tweenValue(veilRef.current, now);

    if (!focusType && !focusNodeId) {
      // Se conserva el conjunto anterior para que el velo se retire sobre él.
      veilRef.current = { from: current, to: 0, start: now, duration: duration(INK_TIMING.veilOut) };
      kick(duration(INK_TIMING.veilOut));
      return;
    }

    if (focusType) {
      const nodes = new Set(graphData.nodes.filter(n => getKnowledgeGraphContentType(n.group) === focusType).map(n => n.id));
      focusRef.current = { nodes, links: null, origin: null, start: now };
    } else if (focusNodeId) {
      const nodes = new Set<string>([focusNodeId]);
      const links = new Set<KnowledgeGraphLink>();
      graphData.links.forEach((link) => {
        const s = endpointId(link.source);
        const tg = endpointId(link.target);
        if (s === focusNodeId && tg) { links.add(link); nodes.add(tg); }
        if (tg === focusNodeId && s) { links.add(link); nodes.add(s); }
      });
      focusRef.current = { nodes, links, origin: focusNodeId, start: now };
    }
    veilRef.current = { from: current, to: 1, start: now, duration: duration(INK_TIMING.veilIn) };
    kick(duration(Math.max(INK_TIMING.veilIn, INK_TIMING.trace)));
  }, [proto, focusNodeId, focusType, graphData, duration, kick]);

  const getNodeColor = useCallback((node: GraphNode) => {
    if (node.group === 'central') return theme.getHex('matematico');
    if (node.group === 'branch') return theme.getHex('teorema');
    return theme.getHex(getKnowledgeGraphContentType(node.group) ?? node.group);
  }, [theme]);

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
    ctx.shadowColor = `${theme.lienzo}E6`;
    ctx.shadowBlur = 4 / globalScale;
    ctx.lineWidth = 3 / globalScale;
    ctx.strokeStyle = `${theme.lienzo}E6`;
    ctx.strokeText(label, nodeX, textY);

    ctx.shadowBlur = 0;
    let textColor: string;
    if (node.group === 'central') {
      textColor = isHighlighted ? theme.getHex('teorema') : theme.getHex('teorema') + '80';
    } else {
      textColor = isHighlighted ? theme.carbon : theme.carbon + '80';
    }

    ctx.fillStyle = textColor;
    ctx.fillText(label, nodeX, textY);
  }, [theme]);

  // Progreso de entrada de un nodo: -1 mientras el mapa es boceto, 0→1 al estamparse.
  const introProgress = (id: string, now: number) => {
    if (introPending.current) return -1;
    const intro = introRef.current;
    if (!intro) return 1;
    return progress(now, intro.start + (intro.delays.get(id) ?? 0), INK_TIMING.stamp);
  };

  const drawInkNode = (node: KnowledgeGraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const now = performance.now();
    const veil = tweenValue(veilRef.current, now);
    const focus = focusRef.current;
    const inFocus = !focus.nodes || focus.nodes.has(node.id);
    const isStructure = node.group === 'branch' || node.group === 'central';
    const radius = node.val / 2;
    const stamp = introProgress(node.id, now);

    ctx.globalAlpha = inFocus ? 1 : 1 - 0.8 * veil;

    if (stamp <= 0) {
      // Boceto a lápiz mientras el grafo se asienta.
      ctx.beginPath();
      ctx.arc(node.x!, node.y!, radius, 0, 2 * Math.PI, false);
      ctx.strokeStyle = `${theme.carbon}33`;
      ctx.lineWidth = 0.6 / globalScale;
      ctx.stroke();
      ctx.globalAlpha = 1;
      return;
    }

    const r = radius * Math.max(0, easeStamp(stamp));
    if (useProgressStore.getState().isRead(node.id) && !isStructure) {
      ctx.beginPath();
      ctx.arc(node.x!, node.y!, r + (2.5 / globalScale), 0, 2 * Math.PI, false);
      ctx.strokeStyle = theme.carbon;
      ctx.lineWidth = 0.8 / globalScale;
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(node.x!, node.y!, r, 0, 2 * Math.PI, false);
    ctx.fillStyle = isStructure ? theme.lienzo : getNodeColor(node);
    ctx.fill();
    ctx.strokeStyle = isStructure ? theme.carbon : `${theme.carbon}99`;
    ctx.lineWidth = (isStructure ? 1.4 : 0.7) / globalScale;
    ctx.stroke();
    if (node.group === 'central') {
      ctx.beginPath();
      ctx.arc(node.x!, node.y!, Math.max(0, r - 4), 0, 2 * Math.PI, false);
      ctx.lineWidth = 0.7 / globalScale;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  };

  const drawNode: NonNullable<KnowledgeGraphProps['nodeCanvasObject']> = (node, ctx, globalScale) => {
    if (node.x === undefined || node.y === undefined || !Number.isFinite(node.x) || !Number.isFinite(node.y)) return;
    if (proto) {
      drawInkNode(node, ctx, globalScale);
      return;
    }

    const isHighlighted = hoverNode ? highlightNodes.has(node) : true;
    const isCompleted = useProgressStore.getState().isRead(node.id);

    // Configuración base
    const radius = node.val / 2;
    const color = getNodeColor(node);

    // Si está completado, dibujar un anillo concéntrico de estilo astrolabio clásico sin alterar el color del nodo
    if (isCompleted && node.group !== 'central' && node.group !== 'branch') {
      const ringColor = isHighlighted ? theme.carbon : theme.carbon + '80';
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius + (3 / globalScale), 0, 2 * Math.PI, false);
      ctx.strokeStyle = ringColor;
      ctx.lineWidth = 1.2 / globalScale;
      ctx.stroke();
    }

    // Dibujar Círculo
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = isHighlighted ? color : color + '40'; // Añadir transparencia si no está resaltado
    ctx.fill();

    // Borde de tinta clásico
    ctx.strokeStyle = theme.carbon;
    ctx.lineWidth = (isHighlighted ? 1.5 : 0.6) / globalScale;
    ctx.stroke();

    drawNodeLabel(ctx, node, globalScale, isHighlighted, hoverNode, highlightNodes, radius);
  };

  // Aristas de tinta: boceto mientras se asienta, trazo de origen a destino en la entrada
  // y, al señalar un nodo, sus aristas se dibujan desde él hacia fuera.
  const drawInkLink = (link: KnowledgeGraphLink, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const source = link.source as KnowledgeGraphNode;
    const target = link.target as KnowledgeGraphNode;
    if (!Number.isFinite(source?.x) || !Number.isFinite(target?.x)) return;
    const now = performance.now();
    const veil = tweenValue(veilRef.current, now);
    const focus = focusRef.current;
    const a = { x: source.x!, y: source.y! };
    const b = { x: target.x!, y: target.y! };

    if (introPending.current) {
      ctx.strokeStyle = `${theme.carbon}0D`;
      ctx.lineWidth = 0.5 / globalScale;
      traceSegment(ctx, a, b, 1);
      return;
    }

    let drawn = 1;
    let start = a;
    let end = b;
    const intro = introRef.current;
    if (intro) {
      const sourceDelay = intro.delays.get(source.id) ?? 0;
      const targetDelay = intro.delays.get(target.id) ?? 0;
      // La tinta sale del extremo que se estampa antes, así el mapa crece hacia fuera.
      if (targetDelay < sourceDelay) { start = b; end = a; }
      drawn = easeOut(progress(now, intro.start + Math.min(sourceDelay, targetDelay) + 80, INK_TIMING.introLink));
      if (drawn < 1) {
        ctx.strokeStyle = `${theme.carbon}0D`;
        ctx.lineWidth = 0.5 / globalScale;
        traceSegment(ctx, a, b, 1);
      }
    }

    const bothInFocus = !focus.nodes || (focus.nodes.has(source.id) && focus.nodes.has(target.id));
    const baseAlpha = bothInFocus && !focus.links ? 0x1c : Math.round(0x1c * (1 - 0.65 * veil));
    ctx.strokeStyle = theme.carbon + baseAlpha.toString(16).padStart(2, '0');
    ctx.lineWidth = 0.6 / globalScale;
    traceSegment(ctx, start, end, drawn);

    if (focus.links?.has(link) && veilRef.current.to === 1) {
      const from = focus.origin === target.id ? b : a;
      const to = from === a ? b : a;
      ctx.globalAlpha = veil;
      ctx.strokeStyle = theme.carbon;
      ctx.lineWidth = 1.2 / globalScale;
      ctx.lineCap = 'round';
      traceSegment(ctx, from, to, easeOut(progress(now, focus.start, duration(INK_TIMING.trace))));
      ctx.globalAlpha = 1;
    }
  };

  // Rótulos en una sola pasada, por prioridad: el que choca con uno ya escrito se omite.
  const drawLabels = (ctx: CanvasRenderingContext2D, globalScale: number) => {
    const now = performance.now();
    const placed: LabelRect[] = [];
    const focus = focusRef.current;
    const focusing = focus.nodes !== null && veilRef.current.to === 1;
    const ordered = focusing
      ? [...labelOrder.filter(n => focus.nodes!.has(n.id)), ...labelOrder.filter(n => !focus.nodes!.has(n.id))]
      : labelOrder;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';

    for (const node of ordered) {
      if (node.x === undefined || node.y === undefined || !Number.isFinite(node.x) || !Number.isFinite(node.y)) continue;
      const rank = labelRank(node);
      const inFocus = focusing && focus.nodes!.has(node.id);
      if (focusing && !inFocus) continue;
      // En el vecindario de un nodo se rotulan todos los nodos; con un tipo de la leyenda, según la escala.
      const forceLabel = inFocus && focus.origin !== null;
      if (!forceLabel && !(rank === 0 || rank === 1 || (rank === 2 && globalScale >= 0.5) || globalScale >= 0.8)) continue;
      const stamp = introProgress(node.id, now);
      if (stamp <= 0) continue;

      const px = [18, 15, 13, 12][rank];
      const fontSize = px / globalScale;
      ctx.font = `${rank < 2 ? 600 : 400} ${fontSize}px "EB Garamond", Georgia, serif`;
      ctx.fontVariantCaps = rank < 3 ? 'small-caps' : 'normal';
      const width = ctx.measureText(node.name).width;
      const radius = node.val / 2;
      const textY = node.y + radius + fontSize * 0.7 + 3 / globalScale;
      const pad = 2 / globalScale;
      const rect = { x0: node.x - width / 2 - pad, x1: node.x + width / 2 + pad, y0: textY - fontSize * 0.6, y1: textY + fontSize * 0.6 };
      if (placed.some(r => overlaps(r, rect))) continue;
      placed.push(rect);

      ctx.globalAlpha = stamp;
      ctx.lineWidth = 3.5 / globalScale;
      ctx.strokeStyle = theme.lienzo;
      ctx.strokeText(node.name, node.x, textY);
      ctx.fillStyle = rank < 3 ? theme.carbon : `${theme.carbon}D9`;
      ctx.fillText(node.name, node.x, textY);
    }
    ctx.globalAlpha = 1;
    ctx.fontVariantCaps = 'normal';

    // Círculo de pluma alrededor del resultado de búsqueda.
    const mark = markRef.current;
    const marked = mark ? nodeById.get(mark.id) : undefined;
    if (mark && marked && Number.isFinite(marked.x)) {
      const p = progress(now, mark.start, duration(INK_TIMING.mark));
      if (p > 0) {
        ctx.strokeStyle = theme.getHex('teorema');
        ctx.lineWidth = 1.6 / globalScale;
        ctx.lineCap = 'round';
        traceHandCircle(ctx, marked.x!, marked.y!, marked.val / 2 + 9 / globalScale, p);
      }
    }
  };

  // Ajustar cámara y física del grafo
  useEffect(() => {
    if (graphRef.current) {
      setTimeout(() => {
        const fg = graphRef.current;
        if (!fg) return;

        // Ajustes de repulsión gravitatoria por tipo de nodo
        (fg.d3Force('charge') as { strength: (fn: (d: GraphNode) => number) => unknown } | undefined)?.strength((node: GraphNode) => {
          if (node.group === 'central') return -1200;
          if (node.group === 'branch') return node.id?.startsWith('rama-') ? -700 : -400;
          if (node.group === 'sistema-axiomatico') return -300;
          return proto ? -420 : -220;
        });

        // Distancias de enlaces jerárquicos armónicos
        (fg.d3Force('link') as { distance: (fn: (l: ResolvedGraphLink) => number) => unknown } | undefined)?.distance((link: ResolvedGraphLink) => {
          const isCentral = link.source.group === 'central' || link.target.group === 'central';
          if (isCentral) return proto ? 120 : 180;

          const isBranch = link.source.group === 'branch' || link.target.group === 'branch';
          if (isBranch) {
            const isSubToMainBranch = (link.source.id?.startsWith('subrama-') && link.target.id?.startsWith('rama-')) ||
                                      (link.target.id?.startsWith('subrama-') && link.source.id?.startsWith('rama-'));
            return isSubToMainBranch ? (proto ? 80 : 110) : 70;
          }

          return proto ? 90 : 55;
        });

        fg.d3ReheatSimulation();
        fitPending.current = true;
        if (!proto) fg.zoomToFit(400, 60);
      }, 300);
    }
  }, [proto]);

  // Encuadre cuando la simulación se asienta (antes se encuadraba a los 300 ms, con el grafo aún sin abrir).
  const handleEngineStop = useCallback(() => {
    if (!proto || !graphRef.current) return;
    if (!fitPending.current && !introPending.current) return;
    fitPending.current = false;
    const narrow = window.innerWidth < 768;
    // Se encuadra el núcleo del contenido (percentiles 5–95): los nodos sueltos no encogen el mapa.
    const content = graphData.nodes.filter(n => n.group !== 'branch' && n.group !== 'central' && Number.isFinite(n.x) && Number.isFinite(n.y));
    const quantile = (values: number[], q: number) => values.sort((a, b) => a - b)[Math.floor(q * (values.length - 1))];
    const xs = content.map(n => n.x!);
    const ys = content.map(n => n.y!);
    const [x0, x1, y0, y1] = [quantile([...xs], 0.05), quantile([...xs], 0.95), quantile([...ys], 0.05), quantile([...ys], 0.95)];
    const playIntro = introPending.current;
    // Con entrada dibujada el encuadre es inmediato: el boceto apenas se ve y la tinta llega después.
    graphRef.current.zoomToFit(playIntro ? 0 : 600, narrow ? 16 : 48, (n) => n.x! >= x0 && n.x! <= x1 && n.y! >= y0 && n.y! <= y1 && n.group !== 'branch' && n.group !== 'central');

    if (playIntro) {
      introPending.current = false;
      introRef.current = {
        start: performance.now() + 40,
        delays: introDelays(graphData.nodes, labelRank, { x: (x0 + x1) / 2, y: (y0 + y1) / 2 }),
      };
      kick(40 + 160 + 80 + INK_TIMING.introSpread + INK_TIMING.stamp + INK_TIMING.introLink);
    }
  }, [proto, graphData, kick]);

  // Red de seguridad: si la simulación no avisa de que se ha asentado, se entinta igualmente.
  useEffect(() => {
    if (!playIntro) return;
    const timer = window.setTimeout(() => {
      if (introPending.current) handleEngineStop();
    }, 4000);
    return () => window.clearTimeout(timer);
  }, [playIntro, handleEngineStop]);

  // El lienzo toma el tamaño de su contenedor.
  const canvasBoxRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const box = canvasBoxRef.current;
    if (!box) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setDimensions({ width: Math.round(width), height: Math.round(height) });
    });
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  const legendTypes = getKnowledgeGraphLegendTypes(graphData.nodes.map(node => node.group));
  const typeCounts = new Map<string, number>();
  graphData.nodes.forEach((node) => {
    const type = getKnowledgeGraphContentType(node.group);
    if (type) typeCounts.set(type, (typeCounts.get(type) ?? 0) + 1);
  });
  const canHover = () => window.matchMedia('(hover: hover)').matches;
  const keyItems = legendTypes.map((type, index) => {
    const config = CONTENT_TYPE_CONFIG[type];
    if (!config) return null;
    return (
      <li
        key={type}
        className={`graph-proto-key__item ${focusType === type ? 'is-focus' : ''}`}
        style={{ '--i': index } as React.CSSProperties}
      >
        <button
          type="button"
          className="graph-proto-key__btn"
          aria-pressed={pinnedType === type}
          onMouseEnter={() => canHover() && setHoverType(type)}
          onMouseLeave={() => setHoverType(null)}
          onFocus={() => canHover() && setHoverType(type)}
          onBlur={() => setHoverType(null)}
          onClick={() => setPinnedType(p => (p === type ? null : type))}
        >
          <span className="graph-proto-key__swatch" style={{ backgroundColor: config.graphColor }} aria-hidden="true" />
          <span>{getContentTypeLabel(type, 'plural', lang)}</span>
          <span className="graph-proto-key__dots" aria-hidden="true" />
          <span className="graph-proto-key__count">{typeCounts.get(type) ?? 0}</span>
        </button>
      </li>
    );
  });
  const protoSearch = (
    <label className="graph-proto-search">
      <span className="sr-only">{t('graph', 'searchMapAria')}</span>
      <span className="graph-proto-search__glyph" aria-hidden="true">⌕</span>
      <input
        type="search"
        value={searchQuery}
        onChange={(e) => handleSearchChange(e.target.value)}
        placeholder={t('graph', 'searchConceptPlaceholder')}
        className="graph-search-input"
      />
      {searchResults.length > 0 && (
        <ul className="graph-proto-search__results">
          {searchResults.map(node => (
            <li key={node.id}>
              <button type="button" onClick={(e) => handleSearchResultClick(node, e.timeStamp)}>{node.name}</button>
            </li>
          ))}
        </ul>
      )}
    </label>
  );

  return (
    <div
      className={`graph-theme-background ${proto ? 'graph-proto' : ''} w-full h-screen bg-lienzo overflow-hidden font-serif relative`}
      style={graphBackgroundStyle}
    >

      {!proto && (
        <>
          <GraphSearch
            searchQuery={searchQuery}
            setSearchQuery={handleSearchChange}
            searchResults={searchResults}
            onSearchSelect={(node) => handleSearchResultClick(node, 0)}
          />
          <GraphLegend nodeGroups={graphData.nodes.map(node => node.group)} />
        </>
      )}

      {proto && (
        <aside className={`graph-proto-cartouche ${legendOpen ? 'is-open' : ''}`}>
          <h1 className="graph-proto-cartouche__title">{t('navigation', 'graph')}</h1>
          {protoSearch}
          <button
            type="button"
            className="graph-proto-cartouche__toggle ac-rubric"
            aria-expanded={legendOpen}
            aria-controls="graph-legend-fold"
            onClick={() => setLegendOpen(o => !o)}
          >
            <span className="ac-ink-underline">{t('graph', 'legendHeading')}</span>
            <span className="graph-proto-cartouche__chevron" aria-hidden="true">▸</span>
          </button>
          <div id="graph-legend-fold" className="graph-proto-cartouche__fold">
            <div className="graph-proto-cartouche__fold-inner">
              <ul className={`graph-proto-key graph-proto-key--index ${focusType ? 'has-focus' : ''}`}>{keyItems}</ul>
              <div className="graph-proto-cartouche__link mt-2 flex" style={{ '--i': legendTypes.length } as React.CSSProperties}>
                <GraphExplorerLink href="/axiomas" direction="forward">
                  {t('graph', 'axiomaticDependencies')}
                </GraphExplorerLink>
              </div>
            </div>
          </div>
        </aside>
      )}

      <div ref={canvasBoxRef} className="absolute inset-0 cursor-move">
        <ForceGraph2D<GraphNode, GraphLink>
          ref={graphRef}
          width={dimensions.width}
          height={dimensions.height}
          graphData={graphData}
          nodeLabel={() => ''}
          nodeCanvasObject={drawNode}
          nodeCanvasObjectMode={() => 'replace'}
          linkCanvasObject={proto ? drawInkLink : undefined}
          linkCanvasObjectMode={proto ? () => 'replace' : undefined}
          onRenderFramePost={proto ? drawLabels : undefined}
          autoPauseRedraw={!animating}
          onEngineStop={handleEngineStop}
          onNodeHover={handleNodeHover}
          onBackgroundClick={proto ? handleBackgroundClick : undefined}
          linkColor={(link: KnowledgeGraphLink) => highlightLinks.has(link) ? theme.getHex('teorema') : theme.carbon + '18'}
          linkWidth={(link: KnowledgeGraphLink) => highlightLinks.has(link) ? 2 : 1}
          linkDirectionalParticles={(link: KnowledgeGraphLink) => proto ? 0 : highlightLinks.has(link) ? 4 : 1}
          linkDirectionalParticleWidth={(link: KnowledgeGraphLink) => highlightLinks.has(link) ? 5 : 1.5}
          linkDirectionalParticleSpeed={0.005}
          d3VelocityDecay={0.3}
          warmupTicks={40}
          cooldownTicks={proto ? 90 : 150}
          d3AlphaDecay={proto ? 0.035 : undefined}
          onNodeClick={handleNodeClick}
          backgroundColor="transparent"
        />
      </div>
    </div>
  );
};
