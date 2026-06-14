import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useGlossaryStore, texSymbolMap } from '../store/GlossaryStore';

export const SymbolDictionaryManager = () => {
  const openTerm = useGlossaryStore((state) => state.openTerm);
  const openFormulaTerms = useGlossaryStore((state) => state.openFormulaTerms);
  const [location] = useLocation();

  useEffect(() => {
    const makeFormulasInteractive = () => {
      // Función central de extracción por código fuente LaTeX
      const extractTerms = (root: Element): string[] => {
        const annotation = root.querySelector('annotation[encoding="application/x-tex"]');
        if (!annotation) return [];
        
        let tex = annotation.textContent || '';
        const terms = new Set<string>();

        // Ordenamos las macros por longitud descendente para que \subseteq se evalúe antes que \subset
        const macros = Object.keys(texSymbolMap).sort((a, b) => b.length - a.length);

        for (const macro of macros) {
          if (tex.includes(macro)) {
            terms.add(texSymbolMap[macro]);
            // Reemplazamos todas las ocurrencias para que no haya solapamientos
            tex = tex.split(macro).join('');
          }
        }

        return Array.from(terms);
      };

      // 1. FÓRMULAS EN BLOQUE (.katex-display)
      const katexDisplays = document.querySelectorAll('.katex-display');
      
      katexDisplays.forEach((displayRoot) => {
        if (displayRoot.classList.contains('formula-interactive-processed')) return;
        displayRoot.classList.add('formula-interactive-processed', 'relative', 'group');

        const button = document.createElement('div');
        // Botón minúsculo, sin texto, transparente por defecto, sin fondo intrusivo
        button.className = 'absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer text-carbon/40 hover:text-carbon hover:scale-110 p-1 z-20';
        button.title = 'Analizar símbolos de esta fórmula';
        button.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        `;
        
        button.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const terms = extractTerms(displayRoot);
          if (terms.length > 0) {
            openFormulaTerms(terms);
          }
        };

        const btnContainer = document.createElement('div');
        btnContainer.appendChild(button);
        displayRoot.appendChild(btnContainer);
      });

      // 2. FÓRMULAS EN LÍNEA (.katex no display)
      const katexInlines = document.querySelectorAll('.katex:not(.katex-display)');
      
      katexInlines.forEach((inlineRoot) => {
        if (inlineRoot.classList.contains('formula-interactive-processed')) return;
        inlineRoot.classList.add('formula-interactive-processed', 'cursor-pointer', 'hover:bg-carbon/5', 'transition-colors', 'rounded-sm', 'px-[2px]');
        inlineRoot.setAttribute('title', 'Haz clic para analizar esta expresión');

        (inlineRoot as HTMLElement).onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const terms = extractTerms(inlineRoot);
          if (terms.length > 0) {
            if (terms.length === 1) {
              openTerm(terms[0]);
            } else {
              openFormulaTerms(terms);
            }
          }
        };
      });
    };

    const timeoutId = setTimeout(makeFormulasInteractive, 300);
    return () => clearTimeout(timeoutId);
  }, [location, openTerm, openFormulaTerms]);

  return null;
};
