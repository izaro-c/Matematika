import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * Propiedades para KatexText
 */
interface KatexTextProps {
  /** Texto en crudo que contiene expresiones matemáticas entre $ o $$ */
  text: string;
  className?: string;
}

/**
 * Componente que renderiza expresiones matemáticas de LaTeX a HTML usando KaTeX.
 * Convierte strings como `$x^2$` en HTML estilizado matemáticamente.
 * También soporta resaltado básico en negrita con `**texto**`.
 */
export const KatexText: React.FC<KatexTextProps> = ({ text, className = '' }) => {
  // Regex to match $$ ... $$ and $ ... $
  const renderMath = (str: string) => {
    // Escapar html básico
    let html = str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const unescapeMath = (m: string) => m.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

    // Reemplazar $$ math $$
    html = html.replace(/\$\$([\s\S]+?)\$\$/g, (match, math) => {
      try {
        return katex.renderToString(unescapeMath(math), { displayMode: true, throwOnError: false });
      } catch {
        return match;
      }
    });

    // Reemplazar $ math $
    html = html.replace(/\$([^$]+?)\$/g, (match, math) => {
      try {
        return katex.renderToString(unescapeMath(math), { displayMode: false, throwOnError: false });
      } catch {
        return match;
      }
    });

    // Reemplazar saltos de línea con <br/>
    html = html.replace(/\n/g, '<br/>');

    // Negrita
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    return html;
  };

  return (
    <span 
      className={className} 
      dangerouslySetInnerHTML={{ __html: renderMath(text) }} 
    />
  );
};
