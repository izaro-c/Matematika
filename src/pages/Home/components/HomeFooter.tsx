import { Link } from 'wouter';
import { Logo } from "@/shared/ui/Logo";
import { UI } from '@/shared/design';

const footerLinkClass = `${UI.btn} ${UI.btnGhost} px-5 py-2.5 text-xs`;

/**
 * Pie de página exclusivo para la página de inicio.
 */
export const HomeFooter = () => {
  return (
    <footer className="border-t border-carbon/10 mt-8">
      <div className="max-w-5xl mx-auto px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex gap-3">
          <Link href="/diccionario">
            <a className={`${footerLinkClass} border-carbon/20 text-carbon/60 hover:border-carbon hover:text-carbon`}>
              Diccionario
            </a>
          </Link>
          <Link href="/historia">
            <a className={`${footerLinkClass} border-salvia/30 text-salvia hover:bg-salvia hover:text-lienzo`}>
              Índice biográfico
            </a>
          </Link>
        </div>

        <div className={`flex items-center gap-3 text-carbon/30 text-xs font-sans ${UI.tabularNums}`}>
          <div className="w-6 h-px bg-carbon/20" aria-hidden="true" />
          <Logo className="w-5 h-5 opacity-40" />
          <span>Matematika · 2026</span>
          <div className="w-6 h-px bg-carbon/20" aria-hidden="true" />
        </div>
      </div>
    </footer>
  );
};
