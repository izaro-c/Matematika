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

/** Convierte texto mixto con expresiones $...$ o $$...$$ en HTML seguro de KaTeX. */
export function renderKatexTextToHtml(text: string): string {
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const unescapeMath = (math: string) => math
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

  html = html.replace(/\$\$([\s\S]+?)\$\$/g, (match, math) => {
    try {
      return katex.renderToString(unescapeMath(math), { displayMode: true, throwOnError: false });
    } catch {
      return match;
    }
  });

  html = html.replace(/\$([^$]+?)\$/g, (match, math) => {
    try {
      return katex.renderToString(unescapeMath(math), { displayMode: false, throwOnError: false });
    } catch {
      return match;
    }
  });

  return html
    .replace(/\n/g, '<br/>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

/**
 * Componente que renderiza expresiones matemáticas de LaTeX a HTML usando KaTeX.
 * Convierte strings como `$x^2$` en HTML estilizado matemáticamente.
 * También soporta resaltado básico en negrita con `**texto**`.
 */
export const KatexText: React.FC<KatexTextProps> = ({ text, className = '' }) => {
  return (
    <span 
      className={className} 
      dangerouslySetInnerHTML={{ __html: renderKatexTextToHtml(text) }}
    />
  );
};
