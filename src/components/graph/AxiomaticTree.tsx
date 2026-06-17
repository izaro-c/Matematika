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

import { useGraphStore } from '../../store/graphStore';
import { MathNode } from './CustomNode';
import type { MathNodeData } from './CustomNode';

const nodeTypes = { mathNode: MathNode };

function computeDependencyChain(
  nodeId: string,
  dependsOn: Record<string, string[]>,
): Set<string> {
  const chain = new Set<string>();
  const queue = [nodeId];
  while (queue.length > 0) {
    const cur = queue.shift()!;
    for (const dep of dependsOn[cur] || []) {
      if (!chain.has(dep)) {
        chain.add(dep);
        queue.push(dep);
      }
    }
  }
  return chain;
}

function FlowContent() {
  const {
    baseNodes, edges: baseEdges, isLoading,
    toggleAxiom, initWorker,
    dependsOn,
    models, inactiveModels, toggleModel
  } = useGraphStore();

  const [rfNodes, setRfNodes, onNodesChange] = useNodesState<Node>([]);
  const [, , onEdgesChange] = useEdgesState<Edge>([]);
  const { fitView } = useReactFlow();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const searchResults = useMemo(() => {
    if (searchQuery.trim().length < 2) return [];
    const q = searchQuery.toLowerCase();
    return rfNodes
      .filter((n) => {
        const d = (n.data as unknown) as MathNodeData;
        return d.label.toLowerCase().includes(q) || n.id.toLowerCase().includes(q);
      })
      .slice(0, 8)
      .map((n) => ({ id: n.id, label: ((n.data as unknown) as MathNodeData).label, nodeType: ((n.data as unknown) as MathNodeData).nodeType }));
  }, [searchQuery, rfNodes]);

  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    initWorker();
  }, []);

  useEffect(() => {
    if (baseNodes.length === 0) return;
    const nodes = baseNodes.map((n) => ({
      ...n,
      data: { ...n.data, scale: 1, isHighlighted: false },
    }));
    setRfNodes(nodes);
    requestAnimationFrame(() => {
      setTimeout(() => fitView({ padding: 0.12, duration: 500 }), 30);
    });
  }, [baseNodes, baseEdges]);

  const selectedChain = useMemo(() => {
    if (!selectedNodeId) return new Set<string>();
    return computeDependencyChain(selectedNodeId, dependsOn);
  }, [selectedNodeId, dependsOn]);

  const activeModels = models.filter(m => !inactiveModels.includes(m.id));

  const onNodeMouseEnter: NodeMouseHandler = useCallback(
    (_, node) => {
      setHoveredNodeId(node.id);
    },
    [],
  );

  const onNodeMouseLeave: NodeMouseHandler = useCallback(() => {
    setHoveredNodeId(null);
  }, []);

  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      setSelectedNodeId(prev => prev === node.id ? null : node.id);
      if (activeModels.length === 0 && ((node.data as unknown) as MathNodeData).nodeType === 'axioma') {
        toggleAxiom(node.id);
      }
    },
    [toggleAxiom, activeModels]
  );

  const handleSearchSelect = useCallback(
    (id: string) => {
      setSearchQuery('');
      setSearchOpen(false);
      setSelectedNodeId(id);
      const node = rfNodes.find((n) => n.id === id);
      if (node) {
        fitView({ nodes: [node as Node], padding: 0.6, duration: 700 });
      }
    },
    [rfNodes, fitView],
  );

  const selectedNodeData = useMemo(() => {
    if (!selectedNodeId) return null;
    const node = rfNodes.find(n => n.id === selectedNodeId);
    if (!node) return null;
    return (node.data as unknown) as MathNodeData;
  }, [selectedNodeId, rfNodes]);

  const dependencyList = useMemo(() => {
    if (!selectedNodeId) return [];
    const chain = computeDependencyChain(selectedNodeId, dependsOn);
    const ordered = [...chain].reverse();
    return ordered.map(id => {
      const found = rfNodes.find(n => n.id === id);
      return found ? { id, label: ((found.data as unknown) as MathNodeData).label, nodeType: ((found.data as unknown) as MathNodeData).nodeType } : { id, label: id, nodeType: '' };
    });
  }, [selectedNodeId, dependsOn, rfNodes]);

  if (isLoading && rfNodes.length === 0) {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        style={{ background: '#f8f6f1', backgroundImage: 'url(/images/bg_arts_crafts.png)', backgroundSize: '600px', backgroundRepeat: 'repeat' }}
      >
        <p className="font-serif italic text-carbon/50 text-xl animate-pulse">
          Calculando Ontología Matemática...
        </p>
      </div>
    );
  }

  const relatedEdgesSet = new Set<string>();
  if (selectedNodeId) {
    for (const edge of (baseEdges as Array<{ source: string; target: string; id: string }>)) {
      if (selectedChain.has(edge.source) && selectedChain.has(edge.target)) {
        relatedEdgesSet.add(edge.id);
      }
      if (edge.source === selectedNodeId || edge.target === selectedNodeId) {
        relatedEdgesSet.add(edge.id);
      }
    }
  }

  return (
    <div className="w-full h-full relative" style={{ background: '#f8f6f1', backgroundImage: 'url(/images/bg_arts_crafts.png)', backgroundSize: '600px', backgroundRepeat: 'repeat' }}>

      {/* ── Buscador centrado ─────────────────────────────────────────────── */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30" style={{ width: 340 }}>
        <div className="relative">
          <div className="flex items-center bg-white border-2 border-carbon/50 shadow-md">
            <span className="pl-3 text-carbon/40 text-lg select-none">⌕</span>
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
              placeholder="Buscar axioma, lema, teorema..."
              className="flex-1 bg-transparent px-3 py-2 text-sm text-carbon font-serif placeholder:italic placeholder:text-carbon/35 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setSearchOpen(false); }}
                className="pr-3 text-carbon/40 hover:text-carbon text-sm"
              >
                ✕
              </button>
            )}
          </div>

          {searchOpen && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border-2 border-carbon/50 border-t-0 shadow-xl max-h-64 overflow-y-auto z-50">
              {searchResults.map((r) => (
                <button
                  key={r.id}
                  onMouseDown={() => handleSearchSelect(r.id)}
                  className="w-full text-left px-4 py-2.5 hover:bg-carbon/5 border-b border-carbon/8 last:border-0 flex items-center gap-3"
                >
                  <span
                    className="text-[8px] uppercase tracking-widest shrink-0 px-1.5 py-0.5 rounded font-sans font-bold"
                    style={{
                      background:
                        r.nodeType === 'axioma' ? '#1c1917' :
                          r.nodeType === 'lema' ? '#4a6070' :
                            r.nodeType === 'corolario' ? '#b85c38' : '#6b9e6b',
                      color: '#fff',
                    }}
                  >
                    {r.nodeType}
                  </span>
                  <span className="font-serif text-sm text-carbon capitalize">{r.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Panel de Modelos ─────────────────────────────────────── */}
      <div
        className="absolute top-4 left-4 z-30 flex flex-col gap-4"
        style={{ maxWidth: 210, maxHeight: 'calc(100vh - 2rem)' }}
      >
        {models && models.length > 0 && (
          <div className="bg-white/95 border border-carbon/20 shadow p-3 shrink-0">
            <h3 className="font-sans text-[9px] uppercase tracking-widest text-carbon/50 mb-2">
              Modelos Matemáticos
            </h3>
            <div className="flex flex-col gap-1.5">
              {models.map((m) => {
                const isOn = !inactiveModels.includes(m.id);
                return (
                  <button
                    key={m.id}
                    onClick={() => toggleModel(m.id)}
                    className={`flex items-center gap-2 text-left text-xs font-serif px-1.5 py-1 rounded transition-all duration-200 ${isOn ? 'text-carbon opacity-100' : 'text-carbon/35 opacity-60'
                      }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-sm shrink-0 border transition-colors"
                      style={{
                        background: isOn ? '#4a6070' : 'transparent',
                        borderColor: '#4a6070',
                      }}
                    />
                    <span className="capitalize leading-tight">{m.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Panel de Detalles (Lateral Derecho) ──────────────────────────────── */}
      {selectedNodeData && (
        <div className="absolute top-4 right-4 z-30 bg-white/95 border border-carbon/20 shadow p-4 w-[300px] max-h-[calc(100vh-2rem)] overflow-y-auto">
          <div className="flex justify-between items-start mb-2">
            <span
              className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded font-sans font-bold"
              style={{
                background:
                  selectedNodeData.nodeType === 'axioma' ? '#1c1917' :
                    selectedNodeData.nodeType === 'lema' ? '#4a6070' :
                      selectedNodeData.nodeType === 'corolario' ? '#b85c38' :
                        selectedNodeData.nodeType === 'definicion' ? '#8b7355' : '#6b9e6b',
                color: '#fff',
              }}
            >
              {selectedNodeData.nodeType}
            </span>
            <button
              onClick={() => setSelectedNodeId(null)}
              className="text-carbon/40 hover:text-carbon text-sm"
            >
              ✕
            </button>
          </div>
          <h2 className="font-serif text-lg text-carbon font-bold leading-tight mb-2 capitalize">
            {selectedNodeData.label}
          </h2>
          <p className="font-sans text-sm text-carbon/70 leading-relaxed mb-4">
            {selectedNodeData.description || 'Sin descripción disponible.'}
          </p>

          {/* ── Dependencias transitivas ──────────────────────────────── */}
          {dependencyList.length > 0 && (
            <div className="mb-3">
              <h4 className="font-sans text-[9px] uppercase tracking-widest text-carbon/50 mb-1.5">
                Depende de
              </h4>
              <ul className="space-y-0.5">
                {dependencyList.map((dep) => (
                  <li key={dep.id} className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-sm shrink-0"
                      style={{
                        background:
                          dep.nodeType === 'axioma' ? '#1c1917' :
                            dep.nodeType === 'lema' ? '#4a6070' :
                              dep.nodeType === 'definicion' ? '#8b7355' : '#6b9e6b',
                      }}
                    />
                    <span
                      className="text-xs font-serif text-carbon/70 cursor-pointer hover:text-carbon capitalize"
                      onClick={() => {
                        setSelectedNodeId(dep.id);
                        const node = rfNodes.find(n => n.id === dep.id);
                        if (node) fitView({ nodes: [node as Node], padding: 0.5, duration: 400 });
                      }}
                    >
                      {dep.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <a
            href={`/Matematika/${selectedNodeData.nodeType === 'axioma' ? 'axioma' : selectedNodeData.nodeType === 'definicion' ? 'definicion' : 'teorema'}/${selectedNodeId}`}
            className="inline-flex items-center gap-1.5 mt-1 text-sm font-sans text-[#4a6070] hover:text-carbon transition-colors"
          >
            <span>Ver página →</span>
          </a>
          {selectedNodeData.nodeType === 'axioma' && (
            <p className="text-xs font-sans italic text-terracota mt-2">
              * Haz clic en el nodo en el grafo para activarlo/desactivarlo.
            </p>
          )}
        </div>
      )}

      {/* ── React Flow ───────────────────────────────────────────────────────── */}
      <ReactFlow
        nodes={rfNodes.map((n) => {
          const isSelected = n.id === selectedNodeId;
          const inChain = selectedChain.has(n.id);
          const isHovered = n.id === hoveredNodeId;
          const isDimmed = selectedNodeId && !isSelected && !inChain;
          return {
            ...n,
            data: {
              ...(n.data as unknown as MathNodeData),
              isHighlighted: isSelected || inChain || isHovered,
              scale: isSelected || inChain ? 1.2 : 1,
              isDimmed,
            },
            style: {
              ...n.style,
              opacity: isDimmed ? 0.5 : 1,
            },
          };
        })}
        edges={baseEdges.map((e) => {
          const isRelated = selectedNodeId ? relatedEdgesSet.has(e.id) : true;
          const baseStyle = e.style || {};
          return {
            ...e,
            style: { ...baseStyle, opacity: isRelated ? 1 : 0.12 },
          } as Edge;
        })}
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
        <Controls position="bottom-right" />
      </ReactFlow>

      {/* ── Leyenda ───────────────────────────────────────────────────────── */}
      <div className="absolute bottom-14 right-4 z-30 bg-white/95 border border-carbon/20 shadow p-3">
        <h3 className="font-sans text-[9px] uppercase tracking-widest text-carbon/50 mb-2">Leyenda</h3>
        {([
          { type: 'axioma', bg: '#1c1917', label: 'Axioma (fundamento)' },
          { type: 'lema', bg: '#4a6070', label: 'Lema (auxiliar)' },
          { type: 'teorema', bg: '#6b9e6b', label: 'Teorema' },
          { type: 'corolario', bg: '#b85c38', label: 'Corolario' },
        ] as const).map(({ type, bg, label }) => (
          <div key={type} className="flex items-center gap-2 text-xs font-serif text-carbon mb-1 last:mb-0">
            <div
              className="w-3 h-3 rounded-sm shrink-0"
              style={{ backgroundColor: bg, border: '1px solid rgba(0,0,0,0.2)' }}
            />
            {label}
          </div>
        ))}
        <p className="mt-2 text-[8px] font-sans text-carbon/35 border-t border-carbon/10 pt-1.5">
          ↑ Las flechas apuntan desde<br />la dependencia hacia el dependiente
        </p>
      </div>
    </div>
  );
}

export function AxiomaticTree() {
  return (
    <ReactFlowProvider>
      <FlowContent />
    </ReactFlowProvider>
  );
}
