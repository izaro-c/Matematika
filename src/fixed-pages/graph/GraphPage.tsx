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
import { GraphCartouche, type GraphLegendEntry } from '@/fixed-pages/graph/ui/components/GraphCartouche';
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

type LabelRect = { x0: number; y0: number; x1: number; y1: number };
const overlaps = (a: LabelRect, b: LabelRect) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;

const labelRank = (node: GraphNode) => {
  if (node.group === 'central') return 0;
  if (node.id.startsWith('rama-')) return 1;
  if (node.id.startsWith('subrama-')) return 2;
  return 3;
};

const EMPTY_GRAPH: GraphData<GraphNode, GraphLink> = { nodes: [], links: [] };

const endpointId = (end: string | GraphNode | undefined) => (typeof end === 'object' ? end.id : end);

/** Conjunto resaltado: el vecindario de un nodo (con su origen, para trazar desde él) o un tipo de la leyenda. */
interface InkFocus {
  nodes: Set<string> | null;
  links: Set<KnowledgeGraphLink> | null;
  origin: string | null;
  start: number;
}

/**
 * Página del grafo visual (/grafo): todos los conceptos y sus conexiones, en tinta sobre el damasco.
 *
 * El reparto se calcula entero antes del primer fotograma y la entrada se dibuja del centro hacia
 * fuera. Al señalar un nodo se trazan sus aristas; la leyenda de la cartela resalta tipos y la
 * búsqueda rodea el resultado con un círculo de pluma. Tiempos y trazos: `lib/graphInk.ts`.
 */
export const GraphPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const { lang } = useI18n();
  const { openTerm } = useGlossaryStore();
  const theme = useThemeColors();
  const graphRef = useRef<KnowledgeGraphRef | undefined>(undefined);
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
  const legend: GraphLegendEntry[] = useMemo(() => {
    const counts = new Map<string, number>();
    graphData.nodes.forEach((node) => {
      const type = getKnowledgeGraphContentType(node.group);
      if (type) counts.set(type, (counts.get(type) ?? 0) + 1);
    });
    return getKnowledgeGraphLegendTypes(graphData.nodes.map(node => node.group))
      .map(type => ({ type, count: counts.get(type) ?? 0 }));
  }, [graphData]);

  const [hoverNode, setHoverNode] = useState<KnowledgeGraphNode | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverType, setHoverType] = useState<string | null>(null);
  const [pinnedType, setPinnedType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GraphNode[]>([]);

  // Estado de tinta. Lo que cambia en cada fotograma vive en refs, no en estado de React.
  const [reducedMotion] = useState(prefersReducedMotion);
  const [animating, setAnimating] = useState(false);
  const focusRef = useRef<InkFocus>({ nodes: null, links: null, origin: null, start: 0 });
  const veilRef = useRef<Tween>({ from: 0, to: 0, start: 0, duration: 0 });
  const markRef = useRef<{ id: string; start: number } | null>(null);
  const [playIntro] = useState(shouldPlayIntro);
  const introPending = useRef(playIntro);
  const introRef = useRef<{ start: number; delays: Map<string, number> } | null>(null);
  const fitPending = useRef(false);
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

  // La cámara se desliza hasta el nodo y, al llegar, se le traza un círculo de pluma.
  const handleSearchSelect = (node: GraphNode, clickedAt: number) => {
    setSearchQuery('');
    setSearchResults([]);
    const fg = graphRef.current;
    const glide = duration(600);
    if (fg && node.x !== undefined && node.y !== undefined) {
      fg.centerAt(node.x, node.y, glide);
      fg.zoom(Math.max(fg.zoom(), 2.5), glide);
    }
    setSelectedId(node.id);
    markRef.current = { id: node.id, start: clickedAt + glide };
    kick(glide + duration(INK_TIMING.mark));
  };

  const handleNodeHover: NonNullable<KnowledgeGraphProps['onNodeHover']> = useCallback((node) => {
    setHoverNode(node || null);
  }, []);

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
    if (window.matchMedia('(hover: none)').matches && selectedId !== node.id) {
      markRef.current = null;
      setSelectedId(node.id);
      return;
    }
    navigateToNode(node);
  }, [selectedId, navigateToNode]);

  const handleBackgroundClick = useCallback(() => {
    markRef.current = null;
    setSelectedId(null);
    setPinnedType(null);
  }, []);

  // Qué se resalta: un tipo de la leyenda manda sobre el vecindario de un nodo.
  const focusNodeId = hoverNode?.id ?? selectedId;
  const focusType = hoverType ?? pinnedType;
  useEffect(() => {
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
  }, [focusNodeId, focusType, graphData, duration, kick]);

  const getNodeColor = useCallback((node: GraphNode) => {
    if (node.group === 'central') return theme.getHex('matematico');
    if (node.group === 'branch') return theme.getHex('teorema');
    return theme.getHex(getKnowledgeGraphContentType(node.group) ?? node.group);
  }, [theme]);

  // Progreso de entrada de un nodo: -1 antes de la entrada, 0→1 al estamparse.
  const introProgress = (id: string, now: number) => {
    if (introPending.current) return -1;
    const intro = introRef.current;
    if (!intro) return 1;
    return progress(now, intro.start + (intro.delays.get(id) ?? 0), INK_TIMING.stamp);
  };

  // Nodos de tinta plana: el color pleno con filete fino; ramas y centro, anillos de tinta sobre papel.
  const drawNode: NonNullable<KnowledgeGraphProps['nodeCanvasObject']> = (node, ctx, globalScale) => {
    if (node.x === undefined || node.y === undefined || !Number.isFinite(node.x) || !Number.isFinite(node.y)) return;
    const now = performance.now();
    const stamp = introProgress(node.id, now);
    if (stamp <= 0) return;

    const veil = tweenValue(veilRef.current, now);
    const focus = focusRef.current;
    const inFocus = !focus.nodes || focus.nodes.has(node.id);
    const isStructure = node.group === 'branch' || node.group === 'central';
    const r = (node.val / 2) * Math.max(0, easeStamp(stamp));

    ctx.globalAlpha = inFocus ? 1 : 1 - 0.8 * veil;
    // Leído: anillo concéntrico de estilo astrolabio sin alterar el color del nodo.
    if (useProgressStore.getState().isRead(node.id) && !isStructure) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, r + (2.5 / globalScale), 0, 2 * Math.PI, false);
      ctx.strokeStyle = theme.carbon;
      ctx.lineWidth = 0.8 / globalScale;
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(node.x, node.y, r, 0, 2 * Math.PI, false);
    ctx.fillStyle = isStructure ? theme.lienzo : getNodeColor(node);
    ctx.fill();
    ctx.strokeStyle = isStructure ? theme.carbon : `${theme.carbon}99`;
    ctx.lineWidth = (isStructure ? 1.4 : 0.7) / globalScale;
    ctx.stroke();
    if (node.group === 'central') {
      ctx.beginPath();
      ctx.arc(node.x, node.y, Math.max(0, r - 4), 0, 2 * Math.PI, false);
      ctx.lineWidth = 0.7 / globalScale;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  };

  // Aristas de tinta: en la entrada se trazan desde el extremo que se estampa antes y, al
  // señalar un nodo, sus aristas se dibujan desde él hacia fuera.
  const drawLink = (link: KnowledgeGraphLink, ctx: CanvasRenderingContext2D, globalScale: number) => {
    if (introPending.current) return;
    const source = link.source as KnowledgeGraphNode;
    const target = link.target as KnowledgeGraphNode;
    if (!Number.isFinite(source?.x) || !Number.isFinite(target?.x)) return;
    const now = performance.now();
    const veil = tweenValue(veilRef.current, now);
    const focus = focusRef.current;
    const a = { x: source.x!, y: source.y! };
    const b = { x: target.x!, y: target.y! };

    let drawn = 1;
    let start = a;
    let end = b;
    const intro = introRef.current;
    if (intro) {
      const sourceDelay = intro.delays.get(source.id) ?? 0;
      const targetDelay = intro.delays.get(target.id) ?? 0;
      if (targetDelay < sourceDelay) { start = b; end = a; }
      drawn = easeOut(progress(now, intro.start + Math.min(sourceDelay, targetDelay) + 80, INK_TIMING.introLink));
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

  // Fuerzas: repulsión por tipo de nodo y distancias jerárquicas de los enlaces.
  const configureForces = useCallback((fg: KnowledgeGraphRef) => {
    (fg.d3Force('charge') as { strength: (fn: (d: GraphNode) => number) => unknown } | undefined)?.strength((node: GraphNode) => {
      if (node.group === 'central') return -1200;
      if (node.group === 'branch') return node.id?.startsWith('rama-') ? -700 : -400;
      if (node.group === 'sistema-axiomatico') return -300;
      return -420;
    });

    (fg.d3Force('link') as { distance: (fn: (l: ResolvedGraphLink) => number) => unknown } | undefined)?.distance((link: ResolvedGraphLink) => {
      const isCentral = link.source.group === 'central' || link.target.group === 'central';
      if (isCentral) return 120;

      const isBranch = link.source.group === 'branch' || link.target.group === 'branch';
      if (isBranch) {
        const isSubToMainBranch = (link.source.id?.startsWith('subrama-') && link.target.id?.startsWith('rama-')) ||
                                  (link.target.id?.startsWith('subrama-') && link.source.id?.startsWith('rama-'));
        return isSubToMainBranch ? 80 : 70;
      }

      return 90;
    });
  }, []);

  // El lienzo arranca vacío; con las fuerzas puestas recibe los datos y el reparto se calcula
  // entero antes del primer fotograma (warmupTicks), sin nodos que se muevan.
  const [forcesReady, setForcesReady] = useState(false);
  useEffect(() => {
    if (!graphRef.current) return;
    configureForces(graphRef.current);
    fitPending.current = true;
    setForcesReady(true);
  }, [configureForces]);

  // Encuadre sobre el reparto ya asentado y, si toca, comienzo de la entrada dibujada.
  const handleEngineStop = useCallback(() => {
    if (!graphRef.current || !fitPending.current) return;
    const content = graphData.nodes.filter(n => n.group !== 'branch' && n.group !== 'central' && Number.isFinite(n.x) && Number.isFinite(n.y));
    if (content.length === 0) return;
    fitPending.current = false;
    const narrow = window.innerWidth < 768;
    // Se encuadra el núcleo del contenido (percentiles 5–95): los nodos sueltos no encogen el mapa.
    const quantile = (values: number[], q: number) => values.sort((a, b) => a - b)[Math.floor(q * (values.length - 1))];
    const xs = content.map(n => n.x!);
    const ys = content.map(n => n.y!);
    const [x0, x1, y0, y1] = [quantile([...xs], 0.05), quantile([...xs], 0.95), quantile([...ys], 0.05), quantile([...ys], 0.95)];
    graphRef.current.zoomToFit(0, narrow ? 16 : 48, (n) => n.x! >= x0 && n.x! <= x1 && n.y! >= y0 && n.y! <= y1 && n.group !== 'branch' && n.group !== 'central');

    if (introPending.current) {
      introPending.current = false;
      introRef.current = {
        start: performance.now() + 120,
        delays: introDelays(graphData.nodes, labelRank, { x: (x0 + x1) / 2, y: (y0 + y1) / 2 }),
      };
      kick(120 + INK_TIMING.introLead + INK_TIMING.introSpread + INK_TIMING.stamp + INK_TIMING.introLink + 80);
    }
  }, [graphData, kick]);

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

  return (
    <div
      className="graph-theme-background graph-page w-full h-screen bg-lienzo overflow-hidden font-serif relative"
      style={graphBackgroundStyle}
    >
      <GraphCartouche
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        searchResults={searchResults}
        onSearchSelect={handleSearchSelect}
        legend={legend}
        focusType={focusType}
        pinnedType={pinnedType}
        onHoverType={setHoverType}
        onTogglePin={(type) => setPinnedType(current => (current === type ? null : type))}
      />

      <div ref={canvasBoxRef} className="absolute inset-0 cursor-move">
        <ForceGraph2D<GraphNode, GraphLink>
          ref={graphRef}
          width={dimensions.width}
          height={dimensions.height}
          graphData={forcesReady ? graphData : EMPTY_GRAPH}
          nodeLabel={() => ''}
          nodeCanvasObject={drawNode}
          nodeCanvasObjectMode={() => 'replace'}
          linkCanvasObject={drawLink}
          linkCanvasObjectMode={() => 'replace'}
          onRenderFramePost={drawLabels}
          autoPauseRedraw={!animating}
          onEngineStop={handleEngineStop}
          onNodeHover={handleNodeHover}
          onNodeClick={handleNodeClick}
          onBackgroundClick={handleBackgroundClick}
          d3VelocityDecay={0.3}
          warmupTicks={300}
          cooldownTicks={0}
          backgroundColor="transparent"
        />
      </div>
    </div>
  );
};
