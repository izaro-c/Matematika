import React from 'react';

interface BlocksGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertBlock: (type: string) => void;
}

export const BlocksGallery: React.FC<BlocksGalleryProps> = ({ isOpen, onClose, onInsertBlock }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-carbon/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-carbon/10 flex justify-between items-center bg-white/90 sticky top-0 rounded-t-lg">
          <div>
            <h3 className="text-2xl font-serif font-bold">Galería de Bloques Semánticos</h3>
            <p className="text-sm text-carbon/60">Haz clic en un bloque para insertarlo en tu documento.</p>
          </div>
          <button onClick={onClose} className="text-carbon/50 hover:text-carbon text-2xl font-bold">✕</button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 bg-carbon/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <button onClick={() => { onInsertBlock('caja-formula'); onClose(); }} className="text-left group">
              <div className="mb-2 text-sm font-mono text-terracota group-hover:underline">&lt;Formula&gt;</div>
              <div className="pointer-events-none my-4 py-4 px-4 w-full flex flex-col items-center justify-center gap-2 text-lg font-serif border border-carbon/20 bg-carbon/[0.02]">
                <span className="text-sm italic text-carbon/60">Texto explicativo</span>
                {"$$ x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} $$"}
              </div>
            </button>

            <button onClick={() => { onInsertBlock('caja-definicion'); onClose(); }} className="text-left group">
              <div className="mb-2 text-sm font-mono text-carbon group-hover:underline">&lt;Definicion&gt;</div>
              <div className="pointer-events-none my-4 py-4 border-t-4 border-b border-carbon/90 font-serif">
                <div className="font-bold text-carbon tracking-widest uppercase text-xs mb-2">Definición</div>
                <div className="italic text-carbon/90 text-sm">Un concepto formal expuesto con claridad y rigor.</div>
              </div>
            </button>

            <button onClick={() => { onInsertBlock('caja-demostracion'); onClose(); }} className="text-left group">
              <div className="mb-2 text-sm font-mono text-carbon/50 group-hover:underline">&lt;Demostracion&gt;</div>
              <div className="pointer-events-none my-4 pl-6 font-serif text-sm text-carbon/90">
                <span className="italic font-bold mr-2">Demostración.</span>
                Pasos lógicos expuestos con rigor...
                <div className="text-right mt-2 text-carbon font-bold">$\blacksquare$</div>
              </div>
            </button>

            <button onClick={() => { onInsertBlock('caja-nota'); onClose(); }} className="text-left group">
              <div className="mb-2 text-sm font-mono text-carbon group-hover:underline">&lt;Nota&gt;</div>
              <div className="pointer-events-none my-4 pl-4 border-l-[1px] border-carbon/30 font-serif text-xs text-carbon/70">
                <span className="font-bold uppercase tracking-wider mr-2">Nota.</span>
                Aclaración histórica o corolario menor.
              </div>
            </button>

            <button onClick={() => { onInsertBlock('caja-corolario'); onClose(); }} className="text-left group">
              <div className="mb-2 text-sm font-mono text-carbon group-hover:underline">&lt;Corolario&gt;</div>
              <div className="pointer-events-none my-4 py-4 border-t-2 border-b border-carbon/70 font-serif">
                <div className="font-bold text-carbon/80 tracking-widest uppercase text-xs mb-2">Corolario</div>
                <div className="text-carbon/90 text-sm">Consecuencia directa del teorema anterior.</div>
              </div>
            </button>

            <button onClick={() => { onInsertBlock('cita'); onClose(); }} className="text-left group">
              <div className="mb-2 text-sm font-mono text-carbon/50 group-hover:underline">&lt;Cita&gt;</div>
              <blockquote className="pointer-events-none my-4 mx-8 font-serif italic text-sm text-carbon/80 text-center leading-relaxed">
                Todo es número.<br/>
                <div className="text-xs font-bold mt-2 not-italic font-sans text-carbon/60 uppercase tracking-widest">— Pitágoras</div>
              </blockquote>
            </button>

            <button onClick={() => { onInsertBlock('medieval-step'); onClose(); }} className="text-left group">
              <div className="mb-2 text-sm font-mono text-terracota group-hover:underline">&lt;ProofStep&gt;</div>
              <div className="pointer-events-none flex items-center gap-4 my-4 scale-75 origin-left">
                <div className="relative w-20 h-20 flex items-center justify-center border border-carbon rounded-sm bg-[#FDFBF7] overflow-hidden">
                  <span className="font-serif italic font-bold text-4xl text-terracota z-10">1</span>
                </div>
                <h3 className="text-2xl font-serif text-carbon m-0 border-b-2 border-carbon/20 pb-1 italic">Título del Paso</h3>
              </div>
            </button>

            <button onClick={() => { onInsertBlock('separador'); onClose(); }} className="text-left group flex flex-col justify-center">
              <div className="mb-2 text-sm font-mono text-carbon/50 group-hover:underline">&lt;Separador /&gt;</div>
              <div className="pointer-events-none flex justify-center items-center my-4 opacity-40">
                <div className="w-12 border-t border-carbon"></div>
                <div className="mx-2 text-carbon text-[10px]">♦</div>
                <div className="w-12 border-t border-carbon"></div>
              </div>
            </button>

            <button onClick={() => { onInsertBlock('capitular'); onClose(); }} className="text-left group">
              <div className="mb-2 text-sm font-mono text-terracota group-hover:underline">&lt;Capitular&gt;</div>
              <div className="pointer-events-none font-serif text-sm">
                <span className="float-left text-3xl text-terracota font-bold pr-1 leading-none mt-1">E</span>n un lugar...
              </div>
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};
