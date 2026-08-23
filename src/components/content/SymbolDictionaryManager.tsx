import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useGlossaryStore, texSymbolMap } from '@/lib/stores/GlossaryStore';
import { useI18n } from '@/i18n';

const sortedMacros = Object.keys(texSymbolMap).sort((a, b) => b.length - a.length);

/**
 * Gestor invisible (sin UI) que escanea el DOM renderizado en busca de fórmulas LaTeX
 * procesadas por KaTeX. Añade interactividad a las fórmulas (hover, clics, botones)
 * para abrir el MarginaliaPanel y explicar los símbolos matemáticos presentes
 * cruzando los datos con el texSymbolMap del GlossaryStore.
 */
export const SymbolDictionaryManager = () => {
  const openTerm = useGlossaryStore((state) => state.openTerm);
  const openFormulaTerms = useGlossaryStore((state) => state.openFormulaTerms);
  const [location] = useLocation();
  const { t } = useI18n();

  useEffect(() => {
    let animationFrameId: number | null = null;

    const makeFormulasInteractive = () => {
      const targetContainer = document.getElementById('contenido-principal') || document.body;

      // Función central de extracción por código fuente LaTeX
      const extractTerms = (root: Element): string[] => {
        const annotation = root.querySelector('annotation[encoding="application/x-tex"]');
        if (!annotation) return [];

        let tex = annotation.textContent || '';
        const terms = new Set<string>();

        for (const macro of sortedMacros) {
          if (tex.includes(macro)) {
            terms.add(texSymbolMap[macro]);
            tex = tex.split(macro).join('');
          }
        }

        return Array.from(terms);
      };

      // 1. FÓRMULAS EN BLOQUE (.katex-display)
      const katexDisplays = targetContainer.querySelectorAll('.katex-display');

      katexDisplays.forEach((displayRoot) => {
        if (displayRoot.classList.contains('formula-interactive-processed')) return;
        displayRoot.classList.add('formula-interactive-processed', 'relative', 'group');

        const button = document.createElement('div');
        button.className = 'page-accent-text-hover absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer text-carbon/40 hover:scale-110 p-1 z-20';
        button.title = t('marginalia', 'analyzeFormulaSymbols');
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
      const katexInlines = targetContainer.querySelectorAll('.katex:not(.katex-display)');

      katexInlines.forEach((inlineRoot) => {
        if (inlineRoot.classList.contains('formula-interactive-processed')) return;
        inlineRoot.classList.add('formula-interactive-processed', 'cursor-pointer', 'hover:bg-carbon/5', 'transition-colors', 'rounded-sm', 'px-[2px]');
        inlineRoot.setAttribute('title', t('marginalia', 'clickToAnalyzeExpression'));

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

    const scheduleScan = () => {
      if (animationFrameId !== null) return;
      animationFrameId = window.requestAnimationFrame(() => {
        animationFrameId = null;
        makeFormulasInteractive();
      });
    };

    // Run once immediately
    scheduleScan();

    // Set up MutationObserver scoped to main content container to avoid observing root body noise
    const target = document.getElementById('contenido-principal') || document.body;
    const observer = new MutationObserver(() => {
      scheduleScan();
    });

    observer.observe(target, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [location, openTerm, openFormulaTerms, t]);

  return null;
};

