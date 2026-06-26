import { useEffect, useCallback, useRef, useState, useMemo } from 'react';
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
import { db } from '@/entities/content';

const NODE_TYPE_COLORS: Record<string, string> = {
  axioma: '#1c1917',
  concepto: '#5D7080',
  definicion: '#3b5e6b',
  lema: '#C86446',
  teorema: '#4a5d23',
  corolario: '#c49b4f',
  modelo: '#8b3a3a',
};
const DEPENDENCY_DOT_COLORS: Record<string, string> = {
  axioma: '#1c1917',
  lema: '#4a6070',
  definicion: '#8b7355',
};
const NODE_URL_PREFIX: Record<string, string> = {
  axioma: 'axioma',
  definicion: 'definicion',
  concepto: 'definicion',
  modelo: 'modelo',
};

function getNodeTypeColor(type: string) {
  return NODE_TYPE_COLORS[type] ?? NODE_TYPE_COLORS.modelo;
}
function getDependencyDotColor(type: string) {
  return DEPENDENCY_DOT_COLORS[type] ?? '#6b9e6b';
}
function getNodeUrlPrefix(type: string) {
  return NODE_URL_PREFIX[type] ?? 'teorema';
}

function GroupBraceNode({ data }: { data: { width: number; label: string } }) {
  const w = data.width;
  return (
    <div style={{ width: w, position: 'relative', textAlign: 'center' }} className="pointer-events-none">
      <div className="text-lg font-serif italic text-carbon/70 mb-1 tracking-wide">{data.label}</div>
      <svg width={w} height={30} viewBox={`0 0 ${w} 30`} preserveAspectRatio="none" className="overflow-visible">
        <path d={`M0,0 Q${w / 2},30 ${w},0`} fill="none" stroke="currentColor" strokeWidth="1.5" className="text-carbon/40" />
      </svg>
    </div>
  );
}



const AXIOM_GROUPS = [
  { test: (id: string) => id.startsWith('axioma-incidencia'), color: '#b85c38', label: 'Incidencia' },
  { test: (id: string) => id.startsWith('axioma-orden'), color: '#4a6070', label: 'Orden' },
  { test: (id: string) => id.startsWith('axioma-congruencia'), color: '#6b9e6b', label: 'Congruencia' },
  { test: (id: string) => ['axioma-paralelas-euclides', 'axioma-paralelas-hiperbolico'].includes(id), color: '#c9a87c', label: 'Paralelas' },
];

function getAxiomGroup(id: string): { color: string; label: string } | null {
  for (const g of AXIOM_GROUPS) {
    if (g.test(id)) return { color: g.color, label: g.label };
  }
  return null;
}

function computeDependencyChain(nodeId: string, dependsOn: Record<string, string[]>): Set<string> {
  const chain = new Set<string>();
  const stack = [nodeId];
  while (stack.length > 0) {
    const current = stack.pop()!;
    if (chain.has(current)) continue;
    chain.add(current);
    for (const pred of (dependsOn[current] || [])) stack.push(pred);
  }
  return chain;
}

// ── Componente principal ──────────────────────────────────────────────────────
function FlowContent() {
  const {
    baseNodes, edges: baseEdges, isLoading,
    activeStates, dependsOn,
    toggleAxiom, initWorker,
    models, inactiveModels, toggleModel,
    systems, inactiveSystems, toggleSystem,
  } = useGraphStore();
  const {
    sandboxEnabled, activeAxioms, validNodes,
    toggleAxiom: toggleSandboxAxiom,
    loadModel, clearSandbox, toggleSandbox,
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
  const [searchOpen, setSearchOpen] = useState(false);
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

  const searchRef = useRef<HTMLInputElement>(null);

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
    setSearchOpen(false);
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
      // Axiomas: toggle + mostrar panel sin esconder el grafo
      if (sandboxEnabled) toggleSandboxAxiom(node.id);
      else toggleAxiom(node.id);
      setSelectedNodeId(prev => prev === node.id ? null : node.id);
    } else {
      setSelectedNodeId(prev => prev === node.id ? null : node.id);
    }
  }, [toggleAxiom, sandboxEnabled, toggleSandboxAxiom]);

  // ── External models/axioms ──────────────────────────────────────────────────
  const sandboxModels = db.getAllModels();
  const sandboxAxioms = db.getAllAxioms();

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (isLoading && rfNodes.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-lienzo"
        style={{ backgroundImage: 'url(/Matematika/images/bg-arts-crafts-1.png)', backgroundSize: '600px', backgroundRepeat: 'repeat' }}>
        <p className="font-serif italic text-carbon/50 text-xl animate-pulse">Calculando estructura axiomática…</p>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="w-full h-full flex bg-lienzo"
      style={{ backgroundImage: 'url(/Matematika/images/bg-arts-crafts-1.png)', backgroundSize: '600px', backgroundRepeat: 'repeat' }}>

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      {(isMobile ? sidebarOpen : true) && (
        <aside className={
          isMobile
            ? 'fixed inset-0 z-50 bg-lienzo overflow-y-auto'
            : 'w-[260px] shrink-0 border-r border-carbon/15 bg-lienzo overflow-y-auto'
        }>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} className="absolute top-3 right-3 text-carbon/40 text-lg z-10">✕</button>
          )}

          {/* ── Título ─────────────────────────────────────────────────── */}
          <div className="px-4 pt-5 pb-3">
            <h2 className="font-serif text-base text-carbon tracking-tight leading-tight" style={{ fontVariant: 'small-caps' }}>
              Grafo de<br />Dependencias
            </h2>
            <p className="text-[10px] font-sans text-carbon/40 mt-1.5 leading-relaxed">
              Las flechas apuntan desde la dependencia hacia el dependiente
            </p>
          </div>
          <div className="flex justify-center items-center opacity-20 select-none px-4">
            <div className="w-12 border-t border-carbon" />
            <span className="mx-3 text-carbon text-[10px]">✦</span>
            <div className="w-12 border-t border-carbon" />
          </div>

          <div className="px-3 flex flex-col gap-4">

          {/* ── Sandbox ─────────────────────────────────────────────────── */}
          <div className="border border-carbon/15 p-3 bg-white/40">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif text-sm text-carbon" style={{ fontVariant: 'small-caps' }}>
                <span className="text-terracota mr-1.5">☙</span>Sandbox Lógico
              </h3>
              <button onClick={toggleSandbox}
                className={`w-9 h-5 rounded-full relative transition-all duration-300 ${sandboxEnabled ? 'bg-terracota' : 'bg-carbon/20'}`}>
                <div className={`w-3.5 h-3.5 bg-lienzo rounded-full absolute top-0.5 transition-all duration-300 shadow-sm ${sandboxEnabled ? 'left-[18px]' : 'left-0.5'}`} />
              </button>
            </div>

            {sandboxEnabled && (
              <>
                <div className="flex justify-center items-center mb-3 opacity-15 select-none">
                  <div className="w-6 border-t border-carbon" />
                  <span className="mx-2 text-carbon text-[7px]">✦</span>
                  <div className="w-6 border-t border-carbon" />
                </div>
                <h4 className="font-sans text-[9px] uppercase tracking-[0.15em] text-carbon/50 mb-1.5">Universos</h4>
                <div className="flex flex-col gap-1 mb-3">
                  {sandboxModels.map(model => (
                    <button key={model.id} onClick={() => loadModel(model.id, model.axioms_verified || [])}
                      className="text-left px-3 py-1.5 border border-carbon/10 hover:border-terracota/50 hover:bg-terracota/[0.04] text-xs font-serif text-carbon/80 hover:text-carbon transition-all flex justify-between items-center group">
                      <span style={{ fontVariant: 'small-caps' }}>{model.title}</span>
                      <span className="text-[9px] text-carbon/20 group-hover:text-terracota/50 font-sans">Cargar</span>
                    </button>
                  ))}
                  <button onClick={clearSandbox}
                    className="text-left px-3 py-1.5 border border-dashed border-carbon/10 text-xs font-sans uppercase tracking-widest text-carbon/30 hover:text-carbon/50 mt-1 flex justify-between transition-colors">
                    <span>Vacío absoluto</span><span>⊘</span>
                  </button>
                </div>

                <h4 className="font-sans text-[9px] uppercase tracking-[0.15em] text-carbon/50 mb-1.5">Ajustar Axiomas</h4>
                <div className="flex flex-col gap-0.5 max-h-52 overflow-y-auto">
                  {sandboxAxioms.map(axiom => {
                    const isActive = !!activeAxioms[axiom.id];
                    return (
                      <label key={axiom.id}
                        className={`flex items-start gap-2.5 px-2 py-1.5 cursor-pointer text-xs transition-all ${isActive ? 'bg-terracota/[0.06] border-l-2 border-terracota' : 'hover:bg-carbon/[0.02] border-l-2 border-transparent'}`}>
                        <input type="checkbox" checked={isActive} onChange={() => toggleSandboxAxiom(axiom.id)}
                          className="accent-terracota w-3 h-3 mt-0.5 shrink-0 cursor-pointer" />
                        <span className={`font-serif leading-tight ${isActive ? 'text-terracota font-bold' : 'text-carbon/70'}`} style={{ fontVariant: 'small-caps' }}>
                          {axiom.title}
                        </span>
                      </label>
                    );
                  })}
                </div>
                <div className="mt-2 pt-2 border-t border-carbon/10 text-[9px] font-sans text-carbon/40 flex justify-between tracking-wider">
                  <span>Activos: {Object.values(activeAxioms).filter(Boolean).length}</span>
                  <span>Válidos: {validNodes.size}</span>
                </div>
              </>
            )}
          </div>

          {/* ── Separador ────────────────────────────────────────────────── */}
          <div className="flex justify-center items-center opacity-20 select-none">
            <div className="w-8 border-t border-carbon" /><span className="mx-2 text-carbon text-[8px]">✦</span><div className="w-8 border-t border-carbon" />
          </div>

          {/* ── Sistemas ─────────────────────────────────────────────────── */}
          <div>
            <h3 className="font-sans text-[9px] uppercase tracking-[0.15em] text-carbon/50 mb-2">Sistemas Axiomáticos</h3>
            <div className="flex flex-col gap-0.5">
              {systems.map((s) => {
                const isOn = !inactiveSystems.includes(s.id);
                return (
                  <button key={s.id} onClick={() => toggleSystem(s.id)}
                    className={`flex items-center gap-2.5 text-left text-xs font-serif px-2 py-1 rounded transition-all ${isOn ? 'text-carbon bg-carbon/[0.03]' : 'text-carbon/35 hover:text-carbon/60'}`}>
                    <span className="w-2.5 h-2.5 rounded-sm shrink-0 border transition-colors"
                      style={{ background: isOn ? '#C86446' : 'transparent', borderColor: '#C86446' }} />
                    <span>{s.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Modelos ──────────────────────────────────────────────────── */}
          <div>
            <h3 className="font-sans text-[9px] uppercase tracking-[0.15em] text-carbon/50 mb-2">Modelos</h3>
            <div className="flex flex-col gap-0.5">
              {models.map((m) => {
                const isOn = !inactiveModels.includes(m.id);
                return (
                  <button key={m.id} onClick={() => toggleModel(m.id)}
                    className={`flex items-center gap-2.5 text-left text-xs font-serif px-2 py-1 rounded transition-all ${isOn ? 'text-carbon bg-carbon/[0.03]' : 'text-carbon/35 hover:text-carbon/60'}`}>
                    <span className="w-2.5 h-2.5 rounded-sm shrink-0 border transition-colors"
                      style={{ background: isOn ? '#4a6070' : 'transparent', borderColor: '#4a6070' }} />
                    <span>{m.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Separador ────────────────────────────────────────────────── */}
          <div className="flex justify-center items-center opacity-20 select-none">
            <div className="w-8 border-t border-carbon" /><span className="mx-2 text-carbon text-[8px]">✦</span><div className="w-8 border-t border-carbon" />
          </div>

          {/* ── Tipos de Nodo ────────────────────────────────────────────── */}
          <div>
            <h3 className="font-sans text-[9px] uppercase tracking-[0.15em] text-carbon/50 mb-2">Tipos de Nodo</h3>
            <div className="flex flex-col gap-0.5">
              {(['concepto', 'axioma', 'definicion', 'lema', 'teorema', 'corolario', 'modelo'] as const).map((type) => {
                const isOn = visibleTypes.has(type);
                const color = typeColors[type] || NODE_TYPE_COLORS[type] || '#888';
                return (
                  <button key={type} onClick={() => toggleType(type)}
                    className={`flex items-center gap-2.5 text-left text-xs font-sans px-2 py-1 rounded transition-all ${isOn ? 'text-carbon' : 'text-carbon/35 hover:text-carbon/60'}`}>
                    <span className="w-3 h-3 rounded-sm shrink-0 border border-carbon/20 transition-colors"
                      style={{ background: isOn ? color : 'transparent' }} />
                    <span className="capitalize">{typeLabel[type] || type}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Aristas ──────────────────────────────────────────────────── */}
          <div className="pb-4">
            <h3 className="font-sans text-[9px] uppercase tracking-[0.15em] text-carbon/50 mb-2">Aristas</h3>
            <div className="text-[10px] font-sans text-carbon/45 space-y-1.5">
              <div className="flex items-center gap-2"><span className="w-7 h-[2px] bg-carbon/50 shrink-0" /><span>Sólida — directa</span></div>
              <div className="flex items-center gap-2"><span className="w-7 h-[2px] shrink-0" style={{ background: 'repeating-linear-gradient(90deg, rgba(51,51,51,0.5) 0, rgba(51,51,51,0.5) 4px, transparent 4px, transparent 8px)' }} /><span>Discontinua — lema</span></div>
              <div className="flex items-center gap-2"><span className="w-7 h-[2px] shrink-0" style={{ background: 'repeating-linear-gradient(90deg, rgba(51,51,51,0.5) 0, rgba(51,51,51,0.5) 2px, transparent 2px, transparent 5px)' }} /><span>Punteada — definición</span></div>
              <div className="flex items-center gap-2"><span className="w-7 h-[2.5px] shrink-0" style={{ background: '#818cf8' }} /><span className="text-carbon/55">Índigo — concepto→axioma</span></div>
            </div>
          </div>

          </div>{/* end px-3 wrapper */}

          {isMobile && (
            <button onClick={() => setSidebarOpen(false)}
              className="m-3 py-2 border border-carbon/20 text-xs font-sans uppercase tracking-widest text-carbon/50 hover:text-carbon transition-colors">
              Cerrar panel
            </button>
          )}
        </aside>
      )}

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
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30" style={{ width: 300 }}>
          <div className="relative">
            <div className="flex items-center bg-lienzo border border-carbon/30 shadow-sm">
              <span className="pl-3 text-carbon/40 text-base select-none">⌕</span>
              <input ref={searchRef} type="text" value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
                placeholder="Buscar nodo…"
                className="flex-1 bg-transparent px-3 py-2 text-sm text-carbon font-serif placeholder:italic placeholder:text-carbon/35 outline-none" />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(''); setSearchOpen(false); }}
                  className="pr-3 text-carbon/40 hover:text-carbon text-sm">✕</button>
              )}
            </div>
            {searchOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-lienzo border border-carbon/30 border-t-0 shadow-lg max-h-56 overflow-y-auto z-50">
                {searchResults.map((r) => (
                  <button key={r.id} onMouseDown={() => handleSearchSelect(r.id)}
                    className="w-full text-left px-4 py-2.5 hover:bg-carbon/5 border-b border-carbon/8 last:border-0 flex items-center gap-3">
                    <span className="text-[8px] uppercase tracking-widest shrink-0 px-1.5 py-0.5 rounded font-sans font-bold"
                      style={{ background: getNodeTypeColor(r.nodeType), color: '#fff' }}>{r.nodeType}</span>
                    <span className="font-serif text-sm text-carbon capitalize">{r.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Detail panel — right side */}
        {selectedNodeData && (
          <div className={
            isMobile
              ? 'fixed bottom-0 left-0 right-0 z-50 bg-lienzo border-t border-carbon/20 shadow-xl p-4 max-h-[70vh] overflow-y-auto rounded-t-xl'
              : 'absolute top-3 right-3 z-30 bg-lienzo/95 border border-carbon/20 shadow p-4 w-[280px] max-h-[calc(100vh-2rem)] overflow-y-auto'
          }>
            <div className="flex justify-between items-start mb-2">
              <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded font-sans font-bold"
                style={{ background: getNodeTypeColor(selectedNodeData.nodeType), color: '#fff' }}>
                {selectedNodeData.nodeType}
              </span>
              <button onClick={() => setSelectedNodeId(null)} className="text-carbon/40 hover:text-carbon text-sm">✕</button>
            </div>
            <h2 className="font-serif text-base text-carbon font-bold leading-tight mb-2 capitalize">{selectedNodeData.label}</h2>
            <p className="font-sans text-xs text-carbon/70 leading-relaxed mb-3">{selectedNodeData.description || 'Sin descripción.'}</p>

            {(() => {
              const nodeSystems = systems.filter(s => s.axioms.includes(selectedNodeId!));
              if (nodeSystems.length === 0) return null;
              return (
                <div className="mb-2">
                  <h4 className="font-sans text-[9px] uppercase tracking-widest text-carbon/50 mb-1">Sistemas</h4>
                  <div className="flex flex-wrap gap-1">
                    {nodeSystems.map(s => <span key={s.id} className="text-[10px] font-serif px-2 py-0.5 rounded bg-terracota/10 text-terracota">{s.title}</span>)}
                  </div>
                </div>
              );
            })()}

            {dependencyList.length > 0 && (
              <div className="mb-2">
                <h4 className="font-sans text-[9px] uppercase tracking-widest text-carbon/50 mb-1">Depende de</h4>
                <ul className="space-y-0.5">
                  {dependencyList.map((dep) => (
                    <li key={dep.id} className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: getDependencyDotColor(dep.nodeType) }} />
                      <span className="text-xs font-serif text-carbon/70 cursor-pointer hover:text-carbon"
                        onClick={() => {
                          setSelectedNodeId(dep.id);
                          const node = rfNodes.find(n => n.id === dep.id);
                          if (node) fitView({ nodes: [node as Node], padding: 0.5, duration: 400 });
                        }}>{dep.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <a href={`/Matematika/${getNodeUrlPrefix(selectedNodeData.nodeType)}/${selectedNodeId}`}
              className="inline-flex items-center gap-1.5 mt-2 text-xs font-sans text-pizarra hover:text-carbon transition-colors">
              <span>Ver página →</span>
            </a>
          </div>
        )}

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
