import { useGraphStore } from '@/features/graph/GraphStore';
import { useGraphSandboxStore } from '@/features/graph/GraphSandboxStore';
import { db } from '@/entities/content';

interface AxiomaticSidebarProps {
  isMobile: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  visibleTypes: Set<string>;
  toggleType: (type: string) => void;
  typeLabel: Record<string, string>;
  typeColors: Record<string, string>;
}

export function AxiomaticSidebar({
  isMobile,
  sidebarOpen,
  setSidebarOpen,
  visibleTypes,
  toggleType,
  typeLabel,
  typeColors,
}: AxiomaticSidebarProps) {
  const {
    systems, inactiveSystems, toggleSystem,
    models, inactiveModels, toggleModel,
  } = useGraphStore();
  
  const {
    sandboxEnabled, activeAxioms, validNodes,
    toggleAxiom: toggleSandboxAxiom,
    loadModel, clearSandbox, toggleSandbox,
  } = useGraphSandboxStore();

  const sandboxModels = db.getAllModels();
  const sandboxAxioms = db.getAllAxioms();

  if (isMobile && !sidebarOpen) return null;

  return (
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
              const color = typeColors[type] || '#888';
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
  );
}
