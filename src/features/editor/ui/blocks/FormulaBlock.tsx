import React, { useState } from 'react';
import { KatexText } from '@/shared/ui/KatexText';

interface FormulaBlockProps {
  id?: string;
  content: string;
  onChange: (newContent: string) => void;
}

export const FormulaBlock: React.FC<FormulaBlockProps> = ({ id, content, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-1">
      <label className="block text-[9px] font-bold text-carbon/40 uppercase tracking-widest">Fórmula Matemática</label>
      
      {isEditing ? (
        <div className="flex flex-col gap-1.5 bg-carbon/5 p-2.5 rounded border border-carbon/15 animate-in fade-in duration-100">
          <input
            id={id}
            type="text"
            className="w-full bg-lienzo p-2 text-xs border border-carbon/15 text-carbon rounded focus:outline-none focus:border-ocre font-mono"
            value={content}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setIsEditing(false);
              }
            }}
            placeholder="ej: $$ x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} $$"
            autoFocus
          />
          <span className="text-[10px] text-carbon/40 italic">Usa $$ para centrar o $ para integrar en línea. Presiona Enter para confirmar.</span>
        </div>
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className="p-4 bg-ocre/5 border border-ocre/20 rounded-md cursor-pointer hover:bg-ocre/10 transition-colors flex justify-center items-center select-none"
          title="Haz clic para editar la fórmula LaTeX"
        >
          {content.trim() ? (
            <KatexText text={content} className="text-sm text-carbon" />
          ) : (
            <span className="text-xs italic text-ocre/50">Escribe aquí tu fórmula LaTeX...</span>
          )}
        </div>
      )}
    </div>
  );
};
