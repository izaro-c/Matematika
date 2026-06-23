import React, { useState } from 'react';
import { useGraphSandboxStore } from '@/features/graph/GraphSandboxStore';
import { db } from '@/entities/content';

/**
 * Panel lateral interactivo para el Sandbox Lógico.
 * Permite cargar modelos predefinidos o encender/apagar axiomas individualmente.
 */
export const AxiomSandboxPanel: React.FC = () => {
  const { sandboxEnabled, activeAxioms, toggleAxiom, loadModel, clearSandbox, validNodes, toggleSandbox } = useGraphSandboxStore();
  const [isOpen, setIsOpen] = useState(true);

  const models = db.getAllModels();
  const axioms = db.getAllAxioms();

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="absolute bottom-6 left-16 z-50 bg-lienzo border-2 border-carbon/80 p-3 shadow-lg hover:bg-carbon/5 transition-colors flex items-center gap-2"
        style={{ boxShadow: '4px 4px 0px rgba(0,0,0,0.1)' }}
      >
        <span className="text-terracota font-serif leading-none mt-1">☙</span>
        <span className="font-sans font-bold text-xs uppercase tracking-widest text-carbon">Sandbox Lógico</span>
      </button>
    );
  }

  return (
    <div 
      className="absolute bottom-6 left-16 z-50 w-80 bg-lienzo border-2 border-carbon/80 shadow-2xl flex flex-col max-h-[calc(100vh-4rem)]"
      style={{ boxShadow: '8px 8px 0px rgba(0,0,0,0.1)' }}
    >
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-carbon/80 p-4 bg-carbon/5">
        <div className="flex items-center gap-2">
          <span className="text-terracota font-serif leading-none mt-1">☙</span>
          <h2 className="font-sans font-bold text-sm uppercase tracking-widest text-carbon">Sandbox Lógico</h2>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-carbon/60 hover:text-terracota transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
        
        {/* Toggle Global */}
        <div className="mb-6 flex items-center justify-between bg-carbon/5 p-3 border border-carbon/10">
          <span className="font-serif italic text-carbon/90 text-sm">Activar Sandbox Lógico</span>
          <button 
            onClick={toggleSandbox}
            className={`w-10 h-5 rounded-full relative transition-colors ${sandboxEnabled ? 'bg-terracota' : 'bg-carbon/20'}`}
          >
            <div className={`w-3 h-3 bg-lienzo rounded-full absolute top-1 transition-all ${sandboxEnabled ? 'left-6' : 'left-1'}`} />
          </button>
        </div>

        {/* Modelos Predefinidos */}
        <div className="mb-8">
          <h3 className="font-serif italic text-carbon/80 mb-3 text-sm">1. Seleccionar un Universo</h3>
          <div className="flex flex-col gap-2">
            {models.map(model => (
              <button
                key={model.id}
                onClick={() => loadModel(model.id, model.axioms_verified || [])}
                className="text-left px-3 py-2 border border-carbon/20 hover:border-terracota hover:bg-carbon/5 transition-colors group flex justify-between items-center"
              >
                <span className="font-bold font-serif text-carbon" style={{ fontVariant: 'small-caps' }}>
                  {model.title}
                </span>
                <span className="text-xs text-carbon/40 font-sans group-hover:text-terracota">Cargar</span>
              </button>
            ))}
            <button
              onClick={clearSandbox}
              className="text-left px-3 py-2 border border-carbon/20 hover:border-carbon/50 hover:bg-carbon/5 transition-colors flex justify-between items-center text-carbon/60 mt-2"
            >
              <span className="font-sans text-xs uppercase tracking-widest">Vacío absoluto</span>
              <span className="text-xs">⊘</span>
            </button>
          </div>
        </div>

        {/* Axiomas Individuales */}
        <div>
          <h3 className="font-serif italic text-carbon/80 mb-3 text-sm">2. Ajustar Axiomas</h3>
          <div className="flex flex-col gap-1.5">
            {axioms.map(axiom => {
              const isActive = !!activeAxioms[axiom.id];
              return (
                <label 
                  key={axiom.id}
                  className={`flex items-start gap-3 p-2 border cursor-pointer transition-all ${
                    isActive ? 'border-terracota/50 bg-terracota/5' : 'border-transparent hover:bg-carbon/5'
                  }`}
                >
                  <div className="pt-0.5">
                    <input 
                      type="checkbox"
                      checked={isActive}
                      onChange={() => toggleAxiom(axiom.id)}
                      className="accent-terracota w-3.5 h-3.5 cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className={`font-bold text-sm font-serif ${isActive ? 'text-terracota' : 'text-carbon'}`} style={{ fontVariant: 'small-caps' }}>
                      {axiom.title}
                    </div>
                    {axiom.description && (
                      <div className="text-[10px] font-sans leading-tight mt-1 text-carbon/60">
                        {axiom.description}
                      </div>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        </div>

      </div>

      {/* Footer Stats */}
      <div className="border-t border-carbon/20 p-3 bg-lienzo flex justify-between items-center text-[10px] font-sans tracking-widest uppercase text-carbon/60">
        <span>Axiomas: {Object.values(activeAxioms).filter(Boolean).length}</span>
        <span>Conceptos Válidos: {validNodes.size}</span>
      </div>
    </div>
  );
};
