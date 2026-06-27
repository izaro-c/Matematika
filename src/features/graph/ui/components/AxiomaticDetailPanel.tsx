
import { appPath } from '@/shared/lib/routeHelper';
import { getNodeTypeColor, getDependencyDotColor, getNodeUrlPrefix } from '@/features/graph/lib/graphUtils';

interface AxiomaticDetailPanelProps {
  isMobile: boolean;
  selectedNodeId: string;
  selectedNodeData: { label?: string; description?: string; nodeType: string } | null;
  setSelectedNodeId: (id: string | null) => void;
  systems: { id: string; title: string; axioms: string[] }[];
  dependencyList: { id: string; label: string; nodeType: string }[];
  onDependencyClick: (depId: string) => void;
}

export function AxiomaticDetailPanel({
  isMobile,
  selectedNodeId,
  selectedNodeData,
  setSelectedNodeId,
  systems,
  dependencyList,
  onDependencyClick,
}: AxiomaticDetailPanelProps) {
  if (!selectedNodeData) return null;

  const nodeSystems = systems.filter(s => s.axioms.includes(selectedNodeId));

  return (
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

      {nodeSystems.length > 0 && (
        <div className="mb-2">
          <h4 className="font-sans text-[9px] uppercase tracking-widest text-carbon/50 mb-1">Sistemas</h4>
          <div className="flex flex-wrap gap-1">
            {nodeSystems.map(s => <span key={s.id} className="text-[10px] font-serif px-2 py-0.5 rounded bg-terracota/10 text-terracota">{s.title}</span>)}
          </div>
        </div>
      )}

      {dependencyList.length > 0 && (
        <div className="mb-2">
          <h4 className="font-sans text-[9px] uppercase tracking-widest text-carbon/50 mb-1">Depende de</h4>
          <ul className="space-y-0.5">
            {dependencyList.map((dep) => (
              <li key={dep.id} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: getDependencyDotColor(dep.nodeType) }} />
                <span className="text-xs font-serif text-carbon/70 cursor-pointer hover:text-carbon"
                  onClick={() => onDependencyClick(dep.id)}>
                  {dep.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <a href={appPath(`/${getNodeUrlPrefix(selectedNodeData.nodeType)}/${selectedNodeId}`)}
        className="inline-flex items-center gap-1.5 mt-2 text-xs font-sans text-pizarra hover:text-carbon transition-colors">
        <span>Ver página →</span>
      </a>
    </div>
  );
}
