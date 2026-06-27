import { useEffect, useCallback, useState, useMemo } from 'react';
import { publicAsset } from '@/shared/lib/routeHelper';
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

import { useGraphStore } from '@/features/graph/GraphStore';
import { useGraphSandboxStore } from '@/features/graph/GraphSandboxStore';
import { MathNode } from '@/features/graph/ui/CustomNode';
import type { MathNodeData } from '@/features/graph/ui/CustomNode';
import { TYPE_STYLES, CONTENT_TYPE_CONFIG } from '@/shared/lib/constants';


import { GroupBraceNode } from './components/GroupBraceNode';
import { AxiomaticSidebar } from './components/AxiomaticSidebar';
import { AxiomaticDetailPanel } from './components/AxiomaticDetailPanel';
import { AxiomaticSearch } from './components/AxiomaticSearch';
import { getAxiomGroup, computeDependencyChain } from '../lib/graphUtils';

// ── Componente principal ──────────────────────────────────────────────────────
function FlowContent() {
  const {
    baseNodes, edges: baseEdges, isLoading,
    activeStates, dependsOn,
    toggleAxiom, initWorker,
    systems,
  } = useGraphStore();
  const {
    sandboxEnabled, validNodes,
    toggleAxiom: toggleSandboxAxiom,
  } = useGraphSandboxStore();

  const [rfNodes, setRfNodes, onNodesChange] = useNodesState<Node>([]);
  const [, , onEdgesChange] = useEdgesState<Edge>([]);
  const { fitView } = useReactFlow();
  
  const nodeTypes = useMemo(() => ({ mathNode: MathNode, groupBrace: GroupBraceNode }), []);

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

  // Type labels from config
  const typeLabel: Record<string, string> = useMemo(() => {
    const labels: Record<string, string> = {};
    for (const [key, cfg] of Object.entries(CONTENT_TYPE_CONFIG)) {
      labels[key] = cfg.labelPlural;
    }
    return labels;
  }, []);

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
    const nodes: Node[] = baseNodes.map((n) => ({
      ...n,
      data: { ...n.data, scale: 1, isHighlighted: false },
    } as Node));

    const hilbertAxioms = nodes.filter(n => {
      const d = n.data as unknown as MathNodeData;
      return d.nodeType === 'axioma' && (
        n.id.startsWith('axioma-incidencia') ||
        n.id.startsWith('axioma-orden') ||
        n.id.startsWith('axioma-congruencia') ||
        n.id.startsWith('axioma-arquimedes') ||
        n.id.startsWith('axioma-completitud') ||
        n.id.startsWith('axioma-paralelas')
      );
    });

    if (hilbertAxioms.length > 0) {
      const minX = Math.min(...hilbertAxioms.map(n => n.position.x));
      const maxX = Math.max(...hilbertAxioms.map(n => n.position.x)) + 150;
      nodes.push({
        id: 'hilbert-brace',
        type: 'groupBrace',
        position: { x: minX, y: -60 },
        data: { label: 'Axiomática de Hilbert', width: maxX - minX },
        draggable: false, selectable: false, zIndex: -1, style: {},
      } as unknown as Node);
    }

    setRfNodes(nodes);
    requestAnimationFrame(() => {
      setTimeout(() => fitView({ padding: 0.12, duration: 500 }), 30);
    });
  }, [baseNodes, baseEdges, fitView, setRfNodes]);

  // ── Selected chain ──────────────────────────────────────────────────────────
  const selectedChain = useMemo(() => {
    if (!selectedNodeId) return new Set<string>();
    const node = rfNodes.find(n => n.id === selectedNodeId);
    const nodeType = node ? ((node.data as unknown) as MathNodeData).nodeType : null;
    if (nodeType === 'axioma') return new Set<string>(); // axiomas no esconden el grafo
    return computeDependencyChain(selectedNodeId, dependsOn);
  }, [selectedNodeId, dependsOn, rfNodes]);

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
      const group = d.nodeType === 'axioma' ? getAxiomGroup(n.id) : null;
      const active = sandboxEnabled ? validNodes.has(n.id) : (activeStates[n.id] ?? true);
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
        },
      };
    });
  }, [rfNodes, selectedNodeId, selectedChain, hoveredNodeId, sandboxEnabled, validNodes, activeStates]);

  const visibleNodes = useMemo(() => {
    return displayNodes.filter(n => visibleTypes.has(((n.data as unknown) as MathNodeData).nodeType));
  }, [displayNodes, visibleTypes]);

  const visibleNodeIds = useMemo(() => new Set(visibleNodes.map(n => n.id)), [visibleNodes]);

  const selectedNodeData = useMemo(() => {
    if (!selectedNodeId) return null;
    const node = rfNodes.find(n => n.id === selectedNodeId);
    return node ? ((node.data as unknown) as MathNodeData) : null;
  }, [selectedNodeId, rfNodes]);

  const dependencyList = useMemo(() => {
    if (!selectedNodeId) return [];
    return (dependsOn[selectedNodeId] || []).map(depId => {
      const depNode = rfNodes.find(n => n.id === depId);
      return {
        id: depId,
        label: depNode ? ((depNode.data as unknown) as MathNodeData).label : depId,
        nodeType: depNode ? ((depNode.data as unknown) as MathNodeData).nodeType : 'unknown',
      };
    });
  }, [selectedNodeId, dependsOn, rfNodes]);

  // ── Visible edges ───────────────────────────────────────────────────────────
  const relatedEdgesSet = useMemo(() => {
    const s = new Set<string>();
    if (!selectedNodeId) return s;
    for (const edge of (baseEdges as Array<{ source: string; target: string; id: string }>)) {
      if (selectedChain.has(edge.source) && selectedChain.has(edge.target)) s.add(edge.id);
      if (edge.source === selectedNodeId || edge.target === selectedNodeId) s.add(edge.id);
    }
    return s;
  }, [selectedNodeId, selectedChain, baseEdges]);

  const visibleEdges = useMemo(() => {
    return baseEdges
      .map((e) => {
        const isRelated = selectedNodeId ? relatedEdgesSet.has(e.id) : true;
        const baseStyle = e.style || {};
        let finalStroke = baseStyle.stroke;
        let finalStrokeWidth = baseStyle.strokeWidth;
        let finalMarkerColor = (e.markerEnd as Record<string, string>)?.color;
        if (sandboxEnabled) {
          const srcActive = validNodes.has(e.source);
          const tgtActive = validNodes.has(e.target);
          const isLive = srcActive && tgtActive;
          finalStroke = isLive ? '#333333AA' : '#33333322';
          finalStrokeWidth = isLive ? 1.5 : 1;
          finalMarkerColor = isLive ? '#333333AA' : '#33333322';
        }
        return {
          ...e,
          style: { ...baseStyle, opacity: isRelated ? 1 : 0.12, stroke: finalStroke, strokeWidth: finalStrokeWidth },
          markerEnd: e.markerEnd ? { ...(e.markerEnd as Record<string, string>), color: finalMarkerColor } : undefined,
        } as Edge;
      })
      .filter(e => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target));
  }, [baseEdges, selectedNodeId, relatedEdgesSet, visibleNodeIds, sandboxEnabled, validNodes]);

  // ── Node interactions ───────────────────────────────────────────────────────
  const onNodeMouseEnter: NodeMouseHandler = useCallback((_, node) => setHoveredNodeId(node.id), []);
  const onNodeMouseLeave: NodeMouseHandler = useCallback(() => setHoveredNodeId(null), []);
  const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
    const d = (node.data as unknown) as MathNodeData;
    if (d.nodeType === 'axioma') {
      if (sandboxEnabled) toggleSandboxAxiom(node.id);
      else toggleAxiom(node.id);
      setSelectedNodeId(prev => prev === node.id ? null : node.id);
    } else {
      setSelectedNodeId(prev => prev === node.id ? null : node.id);
    }
  }, [toggleAxiom, sandboxEnabled, toggleSandboxAxiom]);

  const handleDependencyClick = useCallback((depId: string) => {
    setSelectedNodeId(depId);
    const node = rfNodes.find(n => n.id === depId);
    if (node) fitView({ nodes: [node as Node], padding: 0.5, duration: 400 });
  }, [rfNodes, fitView]);

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (isLoading && rfNodes.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-lienzo"
        style={{ backgroundImage: `url(${publicAsset('/images/bg-arts-crafts-1.png')})`, backgroundSize: '600px', backgroundRepeat: 'repeat' }}>
        <p className="font-serif italic text-carbon/50 text-xl animate-pulse">Calculando estructura axiomática…</p>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="w-full h-full flex bg-lienzo"
      style={{ backgroundImage: `url(${publicAsset('/images/bg-arts-crafts-1.png')})`, backgroundSize: '600px', backgroundRepeat: 'repeat' }}>

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
      <div className="flex-1 min-w-0 relative">
        {/* Mobile sidebar toggle */}
        {isMobile && !sidebarOpen && (
          <button onClick={() => setSidebarOpen(true)}
            className="absolute top-3 left-3 z-30 w-9 h-9 bg-lienzo border border-carbon/20 shadow flex items-center justify-center text-sm text-carbon/60 hover:text-carbon">
            ☰
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
        />

        {/* React Flow */}
        <ReactFlow
          nodes={visibleNodes}
          edges={visibleEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeMouseEnter={onNodeMouseEnter}
          onNodeMouseLeave={onNodeMouseLeave}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.05}
          maxZoom={2.5}
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
          elementsSelectable={false}
          nodesConnectable={false}
        >
          <Background color="rgba(51,51,51,0.07)" gap={24} size={1} />
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
