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

// ── nodeTypes estable: definido fuera del componente ────────────────────────
const nodeTypes = { mathNode: MathNode };

// ── BFS local (rápido, en hilo principal) ───────────────────────────────────
function bfsDistances(
  sourceId: string,
  adjacency: Record<string, string[]>,
): Record<string, number> {
  const dist: Record<string, number> = { [sourceId]: 0 };
  const queue = [sourceId];
  while (queue.length > 0) {
    const cur = queue.shift()!;
    for (const neighbor of adjacency[cur] || []) {
      if (dist[neighbor] === undefined) {
        dist[neighbor] = dist[cur] + 1;
        queue.push(neighbor);
      }
    }
  }
  return dist;
}

/** Calcula la escala visual a partir de la distancia topológica y el tipo de nodo. */
function scaleForDistance(dist: number | undefined, nodeType: string): number {
  const d = dist ?? Infinity;
  // Los axiomas siempre son legibles (mínimo 0.75)
  if (nodeType === 'axioma') return Math.max(0.75, 1 - d * 0.06);
  if (d === 0) return 1.08; // nodo enfocado
  if (d === 1) return 0.88;
  if (d === 2) return 0.72;
  if (d === 3) return 0.55;
  return 0.38;
}

// ── Componente interno (necesita useReactFlow → dentro del Provider) ─────────
function FlowContent() {
  const { 
    baseNodes, edges: baseEdges, isLoading, 
    toggleAxiom, initWorker, getAdjacency,
    models, inactiveModels, toggleModel
  } = useGraphStore();

  const [rfNodes, setRfNodes, onNodesChange] = useNodesState<Node>([]);
  const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { fitView } = useReactFlow();

  // ── Buscador y Panel ────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

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

  // ── Inicializar worker UNA sola vez ─────────────────────────────────────
  useEffect(() => {
    initWorker();
  }, []);

  // ── Sincronizar con el store cuando llegan nuevos datos del worker ───────
  useEffect(() => {
    if (baseNodes.length === 0) return;
    const nodes = baseNodes.map((n) => ({
      ...n,
      data: { ...n.data, scale: 1, isHighlighted: false },
    }));
    setRfNodes(nodes);
    setRfEdges((baseEdges as unknown) as Edge[]);
    // fitView después del render
    requestAnimationFrame(() => {
      setTimeout(() => fitView({ padding: 0.12, duration: 500 }), 30);
    });
  }, [baseNodes, baseEdges]);

  // ── Hover: BFS local, actualizar scale SIN cambiar positions ────────────
  const onNodeMouseEnter: NodeMouseHandler = useCallback(
    (_, node) => {
      const adjacency = getAdjacency();
      const distances = bfsDistances(node.id, adjacency);
      setRfNodes((nodes) =>
        nodes.map((n) => {
          const d = (n.data as unknown) as MathNodeData;
          return {
            ...n,
            data: {
              ...d,
              scale: scaleForDistance(distances[n.id], d.nodeType),
              isHighlighted: n.id === node.id,
            },
          };
        }),
      );
    },
    [getAdjacency],
  );

  const onNodeMouseLeave: NodeMouseHandler = useCallback(() => {
    setRfNodes((nodes) =>
      nodes.map((n) => ({
        ...n,
        data: { ...((n.data as unknown) as MathNodeData), scale: 1, isHighlighted: false },
      })),
    );
  }, []);

  const activeModels = models.filter(m => !inactiveModels.includes(m.id));
  // ── Click: seleccionar nodo y opcionalmente hacer toggle de axioma ───────
  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      setSelectedNodeId(node.id);
      // Solo permitir toggle manual cuando no hay modelos activos
      if (activeModels.length === 0 && ((node.data as unknown) as MathNodeData).nodeType === 'axioma') {
        toggleAxiom(node.id);
      }
    },
    [toggleAxiom, activeModels]
  );

  // ── Búsqueda: centrar en el nodo seleccionado ────────────────────────────
  const handleSearchSelect = useCallback(
    (id: string) => {
      setSearchQuery('');
      setSearchOpen(false);

      const node = rfNodes.find((n) => n.id === id);
      if (node) {
        fitView({ nodes: [node as Node], padding: 0.6, duration: 700 });
      }
      // Resaltar 3 segundos
      setRfNodes((nodes) =>
        nodes.map((n) => ({
          ...n,
          data: { ...((n.data as unknown) as MathNodeData), isHighlighted: n.id === id, scale: n.id === id ? 1.05 : 1 },
        })),
      );
      setTimeout(() => {
        setRfNodes((nodes) =>
          nodes.map((n) => ({
            ...n,
            data: { ...((n.data as unknown) as MathNodeData), isHighlighted: false, scale: 1 },
          })),
        );
      }, 3000);
    },
    [rfNodes, fitView],
  );

  // ── Nodo Seleccionado (Detalles) ────────────────────────────────────────
  const selectedNodeData = useMemo(() => {
    if (!selectedNodeId) return null;
    const node = rfNodes.find(n => n.id === selectedNodeId);
    if (!node) return null;
    return (node.data as unknown) as MathNodeData;
  }, [selectedNodeId, rfNodes]);

  // ── Loading state ────────────────────────────────────────────────────────
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
                    className={`flex items-center gap-2 text-left text-xs font-serif px-1.5 py-1 rounded transition-all duration-200 ${
                      isOn ? 'text-carbon opacity-100' : 'text-carbon/35 opacity-60'
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
        <div className="absolute top-4 right-4 z-30 bg-white/95 border border-carbon/20 shadow p-4 w-[280px]">
          <div className="flex justify-between items-start mb-2">
            <span
              className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded font-sans font-bold"
              style={{
                background:
                  selectedNodeData.nodeType === 'axioma' ? '#1c1917' :
                  selectedNodeData.nodeType === 'lema'   ? '#4a6070' :
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
          {/* Link to the page for this node */}
          <a
            href={`/${selectedNodeData.nodeType === 'axioma' ? 'axioma' : selectedNodeData.nodeType === 'definicion' ? 'definicion' : 'teorema'}/${selectedNodeData.id}`}
            className="inline-flex items-center gap-1.5 mt-1 mb-3 text-sm font-sans text-[#4a6070] hover:text-carbon transition-colors"
          >
            <span>Ver página →</span>
          </a>
          {selectedNodeData.nodeType === 'axioma' && (
            <p className="text-xs font-sans italic text-terracota">
              * Haz clic en el nodo en el grafo para activarlo/desactivarlo.
            </p>
          )}
        </div>
      )}

      {/* ── React Flow ───────────────────────────────────────────────────────── */}
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
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
        nodesDraggable={true}
        elementsSelectable={true}
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

// ── Componente público: envuelve con el Provider para poder usar useReactFlow ─
export function AxiomaticTree() {
  return (
    <ReactFlowProvider>
      <FlowContent />
    </ReactFlowProvider>
  );
}
