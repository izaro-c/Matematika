import { Link } from 'wouter';
import { Logo } from "@/boundary/components/ui/Logo";

/**
 * Pie de página exclusivo para la página de inicio.
 * Proporciona enlaces rápidos a secciones complementarias como el Diccionario y el Índice Biográfico.
 */
export const HomeFooter = () => {
  return (
    <footer className="border-t border-carbon/10 mt-8">
      <div className="max-w-5xl mx-auto px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex gap-3">
          <Link href="/diccionario">
            <a className="px-5 py-2.5 text-xs uppercase tracking-widest font-sans border border-carbon/20 text-carbon/60 hover:border-carbon hover:text-carbon transition-colors">
              Diccionario
            </a>
          </Link>
          <Link href="/historia">
            <a className="px-5 py-2.5 text-xs uppercase tracking-widest font-sans border border-salvia/30 text-salvia hover:bg-salvia hover:text-lienzo transition-colors">
              Índice Biográfico
            </a>
          </Link>
        </div>

        <div className="flex items-center gap-3 text-carbon/30 text-xs font-sans">
          <div className="w-6 h-px bg-carbon/20" />
          <Logo className="w-5 h-5 opacity-40" />
          <span>Matematika · 2026</span>
          <div className="w-6 h-px bg-carbon/20" />
        </div>
      </div>
    </footer>
  );
};
