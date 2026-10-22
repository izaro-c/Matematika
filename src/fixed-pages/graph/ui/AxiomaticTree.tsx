import { useEffect, useCallback, useState, useMemo, useRef, type CSSProperties } from 'react';
import { publicAsset } from '@/lib/routes';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import type { Node, Edge, NodeMouseHandler } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useGraphStore } from '@/fixed-pages/graph/GraphStore';
import { MathNode } from '@/fixed-pages/graph/ui/CustomNode';
import type { MathNodeData } from '@/fixed-pages/graph/ui/CustomNode';
import { TYPE_STYLES, CONTENT_TYPE_CONFIG, getContentTypeLabel } from '@/lib/theme/constants';
import { useThemeColors } from '@/lib/theme/useThemeColors';
import { useI18n } from '@/i18n';
import { db } from '@/data/content';

import { GroupBraceNode } from './components/GroupBraceNode';
import { AxiomaticSidebar } from './components/AxiomaticSidebar';
import { AxiomaticDetailPanel } from './components/AxiomaticDetailPanel';
import { AxiomaticSearch } from './components/AxiomaticSearch';
import {
  getAxiomGroup,
  computeDependencyChain,
  stepSelection,
  activationSchedule,
  type ActivationSchedule,
  type GraphDirection,
} from '../lib/graphUtils';
import { edgeKey } from '../lib/dagLayout';
import { prefersReducedMotion } from '../lib/graphInk';
import { InkEdge, type InkEdgeData } from './InkEdge';
import { AXIOMATIC_NODE_SIZE } from '../constants';
import graphStructureData from '@/data/graph/graph_structure.json';
import type { GraphStructure } from '@/data/graph/graphTypes';

const graphStructure = graphStructureData as unknown as GraphStructure;

/** Numeración de los grupos de axiomas en los *Grundlagen*. */
const FAMILY_NUMERAL: Record<string, string> = {
  incidencia: 'I',
  orden: 'II',
  congruencia: 'III',
  paralelas: 'IV',
  continuidad: 'V',
};

const ARROW_DIRECTION: Record<string, GraphDirection> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
};

/** Tiempo que la cartela y las marcas de la última propagación quedan a la vista tras acabar (ms). */
const WAVE_LINGER_MS = 1600;

/**
 * Propagación tras un cambio de axiomas (o la carga inicial): durante `arming` se pintan los
 * estados anteriores un fotograma; en `running` cada nodo y cada línea cambian a su hora.
 */
interface ActivationWave {
  key: number;
  phase: 'arming' | 'running';
  previous: Record<string, boolean>;
  schedule: ActivationSchedule;
  intro: boolean;
  lost: number;
  restored: number;
}

// ── Componente principal ──────────────────────────────────────────────────────
function FlowContent() {
  const { lang, t } = useI18n();
  const theme = useThemeColors();
  const graphBackgroundStyle = {
    '--graph-light-background': `url("${publicAsset('/images/backgrounds/bg-arts-crafts-1.webp')}")`,
    '--graph-dark-background': `url("${publicAsset('/images/backgrounds/bg-arts-crafts-dark.webp')}")`,
  } as CSSProperties;
  const {
    baseNodes, edges: baseEdges, isLoading,
    activeStates, dependsOn,
    toggleAxiom, initWorker,
    systems, axiomGroups,
  } = useGraphStore();

  const [rfNodes, setRfNodes, onNodesChange] = useNodesState<Node>([]);
  const [, , onEdgesChange] = useEdgesState<Edge>([]);
  const { fitView, setCenter, getZoom } = useReactFlow();

  const nodeTypes = useMemo(() => ({ mathNode: MathNode, groupBrace: GroupBraceNode }), []);
  const edgeTypes = useMemo(() => ({ ink: InkEdge }), []);

  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedProofId, setSelectedProofId] = useState<string | null>(null);
  const [wave, setWave] = useState<ActivationWave | null>(null);
  const previousActiveRef = useRef<Record<string, boolean> | null>(null);

  // Cada nodo nuevo empieza con todas sus demostraciones a la vista.
  useEffect(() => { setSelectedProofId(null); }, [selectedNodeId]);
  const [visibleTypes, setVisibleTypes] = useState<Set<string>>(
    new Set(['axioma', 'concepto', 'lema', 'teorema', 'corolario', 'definicion', 'modelo'])
  );

  const toggleType = useCallback((type: string) => {
    setVisibleTypes(prev => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  }, []);

  // Type labels from config & i18n
  const typeLabel: Record<string, string> = useMemo(() => {
    const labels: Record<string, string> = {};
    for (const key of Object.keys(CONTENT_TYPE_CONFIG)) {
      labels[key] = getContentTypeLabel(key, 'plural', lang);
    }
    return labels;
  }, [lang]);

  // Dynamic type colors from TYPE_STYLES
  const typeColors: Record<string, string> = useMemo(() => {
    const colors: Record<string, string> = {};
    for (const [key, style] of Object.entries(TYPE_STYLES)) {
      colors[key] = style.bg;
    }
    return colors;
  }, []);

  // ── Init worker ──────────────────────────────────────────────────────────────
  useEffect(() => {
    initWorker();
  }, [initWorker]);

  // ── Sync baseNodes → rfNodes ────────────────────────────────────────────────
  useEffect(() => {
    if (baseNodes.length === 0) return;
    const nodes: Node[] = baseNodes.map((n) => {
      const translation = db.getNodeTranslation(n.id, lang);
      const originalData = n.data as unknown as MathNodeData;
      return {
        ...n,
        data: {
          ...originalData,
          label: translation?.title || originalData.label,
          description: translation?.description || originalData.description,
          scale: 1,
          isHighlighted: false,
        },
      } as Node;
    });

    // Cartelas: una llave por familia de axiomas y otra sobre los primitivos.
    const dict = (family: string) => t('axiomFamilies', family);
    for (const group of axiomGroups) {
      const numeral = FAMILY_NUMERAL[group.family];
      nodes.push({
        id: `axiom-group-${group.family}`,
        type: 'groupBrace',
        position: { x: group.left, y: group.top - 80 },
        data: { label: numeral ? `${numeral} · ${dict(group.family)}` : dict(group.family), width: group.right - group.left },
        draggable: false, selectable: false, zIndex: -1, style: {},
      } as unknown as Node);
    }
    const primitives = nodes.filter(n => (n.data as unknown as MathNodeData).nodeType === 'concepto');
    if (primitives.length > 0) {
      const minX = Math.min(...primitives.map(n => n.position.x));
      const maxX = Math.max(...primitives.map(n => n.position.x)) + (primitives[0].width ?? AXIOMATIC_NODE_SIZE);
      nodes.push({
        id: 'primitives-brace',
        type: 'groupBrace',
        position: { x: minX, y: Math.min(...primitives.map(n => n.position.y)) - 80 },
        data: { label: t('graph', 'primitivesRow'), width: maxX - minX },
        draggable: false, selectable: false, zIndex: -1, style: {},
      } as unknown as Node);
    }

    setRfNodes(nodes);
    requestAnimationFrame(() => {
      setTimeout(() => fitView({ padding: 0.12, duration: 500 }), 30);
    });
  }, [baseNodes, baseEdges, axiomGroups, fitView, setRfNodes, lang, t]);

  // ── Selected chain ──────────────────────────────────────────────────────────
  const selectedProofs = useMemo(() => {
    if (!selectedNodeId) return [];
    return (graphStructure.nodes[selectedNodeId]?.proofs ?? []).map((proof) => ({
      id: proof.id,
      label: db.getNodeTranslation(proof.id, lang)?.title || proof.id,
      dependencies: proof.dependencies,
    }));
  }, [selectedNodeId, lang]);

  /** Dependencias con la demostración elegida en lugar de la unión de todas. */
  const effectiveDependsOn = useMemo(() => {
    const proof = selectedProofs.find((p) => p.id === selectedProofId);
    if (!proof || !selectedNodeId) return dependsOn;
    return { ...dependsOn, [selectedNodeId]: proof.dependencies.filter((id) => id in dependsOn) };
  }, [dependsOn, selectedProofs, selectedProofId, selectedNodeId]);

  const selectedChain = useMemo(() => {
    if (!selectedNodeId) return new Set<string>();
    const node = rfNodes.find(n => n.id === selectedNodeId);
    const nodeType = node ? ((node.data as unknown) as MathNodeData).nodeType : null;
    if (nodeType === 'axioma') return new Set<string>(); // axiomas no esconden el grafo
    return computeDependencyChain(selectedNodeId, effectiveDependsOn);
  }, [selectedNodeId, effectiveDependsOn, rfNodes]);

  /** Aristas de la cadena elegida que se dibujan (las de la demostración elegida, si hay una). */
  const isChainEdge = useCallback((e: Edge) => (
    selectedChain.has(e.source) && selectedChain.has(e.target)
      && (e.target !== selectedNodeId || (effectiveDependsOn[selectedNodeId!] ?? []).includes(e.source))
  ), [selectedChain, selectedNodeId, effectiveDependsOn]);

  // Al elegir un nodo, la ola sale de él y sube por su cadena: cada línea se traza desde el
  // consecuente hacia su dependencia, y cada antecedente se ilumina con la primera que le llega.
  const selectionSchedule = useMemo(() => {
    if (!selectedNodeId || selectedChain.size === 0) return null;
    const order = graphStructure.topologicalOrder.filter((id) => selectedChain.has(id)).reverse();
    const next = Object.fromEntries(order.map((id) => [id, true]));
    const chainEdges = (baseEdges as Edge[]).filter((e) => {
      const data = (e.data ?? {}) as InkEdgeData;
      const touchesSelected = e.source === selectedNodeId || e.target === selectedNodeId;
      return isChainEdge(e) && ((!data.implied && !data.back) || touchesSelected);
    });
    const upward = chainEdges.map((e) => ({ source: e.target, target: e.source }));
    return activationSchedule(order, {}, next, upward, 300, 2200, 'first');
  }, [selectedNodeId, selectedChain, baseEdges, isChainEdge]);

  const selectionKey = selectionSchedule ? `${selectedNodeId}:${selectedProofId ?? ''}` : null;
  const [runningSelection, setRunningSelection] = useState<string | null>(null);
  useEffect(() => {
    if (!selectionKey) return;
    const timer = window.setTimeout(() => setRunningSelection(selectionKey), 40);
    return () => window.clearTimeout(timer);
  }, [selectionKey]);
  /** Primer fotograma de una selección: la cadena se pinta apagada para poder encenderse. */
  const selectionArming = selectionKey !== null && runningSelection !== selectionKey;

  // ── Propagación: las líneas salen de un nodo cuando cambia y el siguiente cambia cuando le llegan ──
  useEffect(() => {
    if (baseNodes.length === 0 || Object.keys(activeStates).length === 0) return;
    const previous = previousActiveRef.current;
    previousActiveRef.current = activeStates;
    const intro = previous === null;
    // En la carga, cada nodo parte apagado y se enciende desde los primitivos.
    const before = previous ?? Object.fromEntries(Object.keys(activeStates).map((id) => [id, false]));
    const order = graphStructure.topologicalOrder.filter((id) => id in activeStates);
    const drawnEdges = baseEdges.filter((e) => {
      const data = (e.data ?? {}) as InkEdgeData;
      return !data.implied && !data.back;
    });
    const schedule = activationSchedule(order, before, activeStates, drawnEdges);
    if (schedule.nodeAt.size === 0) return;
    const changed = [...schedule.nodeAt.keys()].filter((id) => !id.startsWith('axioma-'));
    setWave({
      key: Date.now(),
      phase: 'arming',
      previous: before,
      schedule,
      intro,
      lost: changed.filter((id) => !activeStates[id]).length,
      restored: changed.filter((id) => activeStates[id]).length,
    });
  }, [activeStates, baseNodes, baseEdges]);

  useEffect(() => {
    if (!wave) return;
    if (wave.phase === 'arming') {
      const timer = window.setTimeout(() => {
        setWave((current) => (current?.key === wave.key ? { ...current, phase: 'running' } : current));
      }, 40);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => setWave(null), wave.schedule.total + WAVE_LINGER_MS);
    return () => window.clearTimeout(timer);
  }, [wave]);

  /** Estado que se pinta: el anterior mientras la propagación se arma, el actual después. */
  const displayedActive = useCallback((id: string) => (
    wave?.phase === 'arming' ? (wave.previous[id] ?? false) : (activeStates[id] ?? true)
  ), [wave, activeStates]);

  // ── Search ──────────────────────────────────────────────────────────────────
  const searchResults = useMemo(() => {
    if (searchQuery.trim().length < 2) return [];
    const q = searchQuery.toLowerCase();
    return rfNodes
      .filter((n) => {
        const d = n.data as unknown as MathNodeData;
        return d.label.toLowerCase().includes(q) || n.id.toLowerCase().includes(q);
      })
      .slice(0, 8)
      .map((n) => ({ id: n.id, label: ((n.data as unknown) as MathNodeData).label, nodeType: ((n.data as unknown) as MathNodeData).nodeType }));
  }, [searchQuery, rfNodes]);

  const handleSearchSelect = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
    const node = rfNodes.find(n => n.id === nodeId);
    if (node) fitView({ nodes: [node as Node], padding: 0.5, duration: 400 });
  }, [rfNodes, fitView]);

  // ── Display nodes ───────────────────────────────────────────────────────────
  const displayNodes = useMemo(() => {
    const selectedNodeType = selectedNodeId
      ? ((rfNodes.find(n => n.id === selectedNodeId)?.data as unknown) as MathNodeData)?.nodeType
      : null;
    const isAxiomSelected = selectedNodeType === 'axioma';

    return rfNodes.map((n) => {
      const d = n.data as unknown as MathNodeData;
      const isSelected = n.id === selectedNodeId;
      const inChain = selectedChain.has(n.id);
      const isHovered = n.id === hoveredNodeId;
      // Axiomas no esconden el grafo; otros nodos atenúan lo que no está en la cadena
      const isDimmed = !isAxiomSelected && selectedNodeId && !isSelected && !inChain;
      const selectionAt = selectionArming ? undefined : selectionSchedule?.nodeAt.get(n.id);
      const group = d.nodeType === 'axioma' ? getAxiomGroup(n.id) : null;
      const active = displayedActive(n.id);
      const changeAt = wave?.phase === 'running' ? wave.schedule.nodeAt.get(n.id) : undefined;

      // En la carga no se marcan los nodos uno a uno: basta con verlos encenderse.
      const waveKind = changeAt !== undefined && !wave?.intro && d.nodeType !== 'axioma'
        ? (active ? 'restored' : 'lost')
        : undefined;
      let scale = 1;
      if (isHovered) scale = 1.08;
      else if (isDimmed) scale = 0.82;
      return {
        ...n,
        data: {
          ...d,
          isActive: active,
          isHighlighted: isSelected || isHovered,
          scale,
          axiomGroupColor: group?.color || undefined,
          axiomGroupLabel: group?.label || undefined,
          isDimmed,
          inChain,
          activationDelay: changeAt,
          lightDelay: selectionAt,
          lightKey: selectionKey ?? undefined,
          waveKind,
          waveDelay: changeAt,
          waveKey: wave?.key,
        },
      };
    });
  }, [rfNodes, selectedNodeId, selectedChain, hoveredNodeId, displayedActive, wave, selectionSchedule, selectionArming, selectionKey]);

  const visibleNodes = useMemo(() => {
    // Las cartelas (groupBrace) no tienen tipo de contenido: se muestran siempre.
    return displayNodes.filter(n => n.type !== 'mathNode' || visibleTypes.has(((n.data as unknown) as MathNodeData).nodeType));
  }, [displayNodes, visibleTypes]);

  const visibleNodeIds = useMemo(() => new Set(visibleNodes.map(n => n.id)), [visibleNodes]);

  const selectedNodeData = useMemo(() => {
    if (!selectedNodeId) return null;
    const node = rfNodes.find(n => n.id === selectedNodeId);
    return node ? ((node.data as unknown) as MathNodeData) : null;
  }, [selectedNodeId, rfNodes]);

  const dependencyList = useMemo(() => {
    if (!selectedNodeId) return [];
    return (effectiveDependsOn[selectedNodeId] || []).map(depId => {
      const depNode = rfNodes.find(n => n.id === depId);
      return {
        id: depId,
        label: depNode ? ((depNode.data as unknown) as MathNodeData).label : depId,
        nodeType: depNode ? ((depNode.data as unknown) as MathNodeData).nodeType : 'unknown',
      };
    });
  }, [selectedNodeId, effectiveDependsOn, rfNodes]);

  // ── Visible edges ───────────────────────────────────────────────────────────
  const nodeTypeById = useMemo(() => {
    const types = new Map<string, string>();
    for (const node of rfNodes) types.set(node.id, ((node.data as unknown) as MathNodeData).nodeType);
    return types;
  }, [rfNodes]);

  const visibleEdges = useMemo(() => {
    const focusId = selectedNodeId ?? hoveredNodeId;
    return baseEdges
      .map((e) => {
        const data = (e.data ?? {}) as InkEdgeData;
        const sourceType = nodeTypeById.get(e.source);
        const targetType = nodeTypeById.get(e.target);
        const isFromPrimitive = sourceType === 'concepto';
        // Aristas en segundo plano: redundantes, las que suben a un axioma y las de un primitivo
        // a algo que no es axioma. Solo se dibujan junto al nodo enfocado.
        const quiet = Boolean(data.implied || data.back || (isFromPrimitive && targetType !== 'axioma'));
        const touchesFocus = focusId !== null && (e.source === focusId || e.target === focusId);
        const inChain = isChainEdge(e as Edge);

        let opacity: number;
        if (selectedNodeId && selectedChain.size > 0) {
          if (quiet) opacity = touchesFocus && inChain ? 0.9 : 0;
          else opacity = inChain ? 1 : 0.07;
          if (inChain && selectionArming) opacity = 0;
        } else if (focusId) {
          if (touchesFocus) opacity = 1;
          else opacity = quiet ? 0 : 0.35;
        } else {
          opacity = quiet ? 0 : 1;
        }

        const isLive = displayedActive(e.source) && displayedActive(e.target);
        let edgeColor = isFromPrimitive ? theme.getHex('modelo') : theme.carbon;
        if (data.back) edgeColor = theme.getHex('axioma');
        const finalStroke = `${edgeColor}${isLive ? 'AA' : '22'}`;
        const flow = wave?.phase === 'running' ? wave.schedule.edgeAt.get(edgeKey(e.source, e.target)) : undefined;
        // La línea base cambia cuando la tinta llega (encendido) o cuando la rotura sale (apagado).
        const strokeDelay = flow ? flow.start + (flow.kind === 'on' ? wave!.schedule.travel : 0) : 0;
        let finalStrokeWidth = 1;
        if (isLive) finalStrokeWidth = isFromPrimitive ? 2.5 : 1.5;
        if (touchesFocus && opacity > 0) finalStrokeWidth += 0.75;
        const baseStyle = e.style || {};
        const selectionFlow = inChain && !selectionArming
          ? selectionSchedule?.edgeAt.get(edgeKey(e.target, e.source))
          : undefined;
        const drawDelay = selectionFlow?.start;
        return {
          ...e,
          hidden: opacity === 0,
          data: {
            ...data,
            drawDelay,
            drawDuration: selectionSchedule?.travel,
            drawReverse: drawDelay !== undefined,
            drawKey: selectionKey ?? undefined,
            flow: flow && opacity > 0
              ? { ...flow, duration: wave!.schedule.travel, stroke: `${edgeColor}AA`, key: wave!.key }
              : undefined,
          },
          style: {
            ...baseStyle,
            ...(data.back ? { strokeDasharray: '5,5' } : {}),
            // El trazado con pluma usa stroke-dasharray: un punteado en línea lo anularía.
            ...(drawDelay !== undefined ? { strokeDasharray: undefined } : {}),
            opacity,
            stroke: finalStroke,
            strokeWidth: finalStrokeWidth,
            transition: `opacity 0.25s ease, stroke-width 0.2s ease, stroke 0s linear ${strokeDelay}ms`,
          },
          markerEnd: e.markerEnd ? { ...(e.markerEnd as Record<string, string>), color: finalStroke } : undefined,
        } as Edge;
      })
      .filter(e => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target));
  }, [baseEdges, selectedNodeId, hoveredNodeId, selectedChain, isChainEdge, selectionSchedule, selectionArming, selectionKey, visibleNodeIds, displayedActive, wave, nodeTypeById, theme]);

  // ── Node interactions ───────────────────────────────────────────────────────
  const onNodeMouseEnter: NodeMouseHandler = useCallback((_, node) => setHoveredNodeId(node.id), []);
  const onNodeMouseLeave: NodeMouseHandler = useCallback(() => setHoveredNodeId(null), []);
  const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
    const d = (node.data as unknown) as MathNodeData;
    if (d.nodeType === 'axioma') {
      toggleAxiom(node.id);
      setSelectedNodeId(prev => prev === node.id ? null : node.id);
    } else {
      setSelectedNodeId(prev => prev === node.id ? null : node.id);
    }
  }, [toggleAxiom]);

  const handleDependencyClick = useCallback((depId: string) => {
    setSelectedNodeId(depId);
    const node = rfNodes.find(n => n.id === depId);
    if (node) fitView({ nodes: [node as Node], padding: 0.5, duration: 400 });
  }, [rfNodes, fitView]);

  // ── Teclado: flechas para recorrer el grafo, Escape para soltar ─────────────
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!selectedNodeId) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
      if (event.key === 'Escape') {
        setSelectedNodeId(null);
        return;
      }
      const direction = ARROW_DIRECTION[event.key];
      if (!direction) return;
      const positions: Record<string, { x: number; y: number }> = {};
      for (const node of visibleNodes) {
        if (node.type === 'mathNode') positions[node.id] = node.position;
      }
      const next = stepSelection(selectedNodeId, direction, positions, effectiveDependsOn);
      if (!next) return;
      event.preventDefault();
      setSelectedNodeId(next);
      const node = visibleNodes.find((n) => n.id === next);
      if (node) {
        const size = node.width ?? AXIOMATIC_NODE_SIZE;
        setCenter(node.position.x + size / 2, node.position.y + size / 2, {
          zoom: Math.max(getZoom(), 0.6),
          duration: prefersReducedMotion() ? 0 : 350,
        });
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedNodeId, visibleNodes, effectiveDependsOn, setCenter, getZoom]);

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (isLoading && rfNodes.length === 0) {
    return (
      <div className="graph-theme-background w-full h-full flex items-center justify-center bg-lienzo"
        style={graphBackgroundStyle}>
        <p className="font-serif italic text-carbon/50 text-xl animate-pulse">Calculando estructura axiomática…</p>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="graph-theme-background w-full h-full flex bg-lienzo"
      style={graphBackgroundStyle}>

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <AxiomaticSidebar
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        visibleTypes={visibleTypes}
        toggleType={toggleType}
        typeLabel={typeLabel}
        typeColors={typeColors}
      />

      {/* ── Graph area ──────────────────────────────────────────────────────── */}
      <div className="h-full flex-1 min-w-0 relative">
        {/* Mobile sidebar toggle */}
        {isMobile && !sidebarOpen && (
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="absolute left-4 top-36 z-30 flex size-11 items-center justify-center border border-carbon/20 bg-lienzo text-base text-carbon/65 shadow transition-colors hover:border-carbon/35 hover:text-carbon focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracota"
            aria-label="Abrir controles del grafo"
            aria-expanded="false"
          >
            <span aria-hidden="true">☰</span>
          </button>
        )}

        {/* Search bar — top center */}
        <AxiomaticSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResults={searchResults}
          onSelect={handleSearchSelect}
        />

        {/* Detail panel — right side */}
        <AxiomaticDetailPanel
          isMobile={isMobile}
          selectedNodeId={selectedNodeId!}
          selectedNodeData={selectedNodeData}
          setSelectedNodeId={setSelectedNodeId}
          systems={systems}
          dependencyList={dependencyList}
          onDependencyClick={handleDependencyClick}
          proofs={selectedProofs}
          selectedProofId={selectedProofId}
          onProofSelect={setSelectedProofId}
        />

        {/* Qué cae: recuento de la última ola */}
        <div className="axiomatic-wave-notice" role="status" aria-live="polite">
          {wave && !wave.intro && wave.phase === 'running' && (
            <span key={wave.key} className="axiomatic-wave-notice__text">
              {wave.lost > 0 && <span>{t('graph', 'fallLost')}: {wave.lost}</span>}
              {wave.lost > 0 && wave.restored > 0 && <span aria-hidden="true"> · </span>}
              {wave.restored > 0 && <span>{t('graph', 'fallRestored')}: {wave.restored}</span>}
            </span>
          )}
        </div>

        {/* React Flow */}
        <ReactFlow
          className="axiomatic-graph"
          nodes={visibleNodes}
          edges={visibleEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeMouseEnter={onNodeMouseEnter}
          onNodeMouseLeave={onNodeMouseLeave}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          minZoom={0.05}
          maxZoom={2.5}
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
          elementsSelectable={false}
          nodesConnectable={false}
        >
          <Background color={`${theme.carbon}12`} gap={24} size={1} />
          <Controls position="bottom-left" />
        </ReactFlow>
      </div>
    </div>
  );
}

// ── Exported wrapper ──────────────────────────────────────────────────────────
export function AxiomaticTree() {
  return (
    <ReactFlowProvider>
      <FlowContent />
    </ReactFlowProvider>
  );
}
