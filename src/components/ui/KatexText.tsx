import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface KatexTextProps {
  text: string;
  className?: string;
}

export const KatexText: React.FC<KatexTextProps> = ({ text, className = '' }) => {
  // Regex to match $$ ... $$ and $ ... $
  const renderMath = (str: string) => {
    // Escapar html básico
    let html = str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Reemplazar $$ math $$
    html = html.replace(/\$\$([\s\S]+?)\$\$/g, (match, math) => {
      try {
        return katex.renderToString(math, { displayMode: true, throwOnError: false });
      } catch (e) {
        return match;
      }
    });

    // Reemplazar $ math $
    html = html.replace(/\$([^$]+?)\$/g, (match, math) => {
      try {
        return katex.renderToString(math, { displayMode: false, throwOnError: false });
      } catch (e) {
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
