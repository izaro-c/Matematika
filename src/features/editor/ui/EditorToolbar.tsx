import React from 'react';

interface EditorToolbarProps {
  onWrapText: (prefix: string, suffix: string) => void;
  onInsertLatex: (type: string) => void;
  onOpenLinkModal: () => void;
  onOpenRefModal: () => void;
  onOpenBlocks: () => void;
  onOpenGallery: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onWrapText, onInsertLatex, onOpenLinkModal, onOpenRefModal, onOpenBlocks, onOpenGallery
}) => {
  return (
    <div className="bg-carbon/5 border-b border-carbon/10 p-2 flex flex-wrap gap-2 items-center shrink-0">
      <div className="flex gap-1 border-r border-carbon/10 pr-2 mr-1">
        <button onClick={() => onWrapText('**', '**')} className="text-xs bg-carbon/5 hover:bg-carbon/20 px-2 py-1 rounded font-bold" title="Negrita (Cmd+B)">B</button>
        <button onClick={() => onWrapText('*', '*')} className="text-xs bg-carbon/5 hover:bg-carbon/20 px-2 py-1 rounded italic" title="Cursiva (Cmd+I)">I</button>
        <button onClick={() => onWrapText('### ', '')} className="text-xs bg-carbon/5 hover:bg-carbon/20 px-2 py-1 rounded font-bold" title="Título (H3)">H3</button>
      </div>
      <div className="flex gap-1 border-r border-carbon/10 pr-2 mr-1 items-center">
        <button onClick={() => onWrapText('$', '$')} className="text-xs font-serif bg-salvia/10 text-salvia hover:bg-salvia/20 px-2 py-1 rounded" title="Fórmula Inline">$x$</button>
        <button onClick={() => onWrapText('\n$$\n', '\n$$\n')} className="text-xs font-serif bg-salvia/10 text-salvia hover:bg-salvia/20 px-2 py-1 rounded" title="Fórmula en Bloque">$$...$$</button>
        <select 
          className="text-xs bg-carbon/5 border-none p-1 rounded font-serif text-salvia cursor-pointer hover:bg-carbon/10 ml-1"
          onChange={(e) => {
            onInsertLatex(e.target.value);
            e.target.value = '';
          }}
        >
          <option value="">+ LaTeX</option>
          <option value="frac">Fracción (a/b)</option>
          <option value="sqrt">Raíz (√)</option>
          <option value="int">Integral (∫)</option>
          <option value="sum">Sumatorio (Σ)</option>
          <option value="lim">Límite (lim)</option>
          <option disabled>──────</option>
          <option value="alpha">α (Alpha)</option>
          <option value="beta">β (Beta)</option>
          <option value="gamma">γ (Gamma)</option>
          <option value="theta">θ (Theta)</option>
          <option value="pi">π (Pi)</option>
        </select>
      </div>
      <button 
        onClick={onOpenBlocks}
        className="text-xs bg-carbon/5 font-bold hover:bg-carbon/10 px-2 py-1 rounded"
      >
        + Bloque
      </button>
      
      <button 
        onClick={onOpenGallery}
        className="text-xs bg-salvia/20 text-salvia font-bold hover:bg-salvia/30 px-2 py-1 rounded flex items-center gap-1 ml-auto"
      >
        🧩 Galería
      </button>
      
      <button 
        onClick={onOpenRefModal}
        className="text-xs bg-terracota/10 text-terracota hover:bg-terracota/20 px-2 py-1 rounded flex items-center gap-1"
      >
        <span className="w-2 h-2 rounded-full bg-terracota inline-block"></span> Ref
      </button>
      <button 
        onClick={onOpenLinkModal}
        className="text-xs bg-carbon/10 hover:bg-carbon/20 px-2 py-1 rounded"
      >
        + Enlace
      </button>
    </div>
  );
};
