import { Link } from 'wouter';
import { Logo } from "@/components/ui/Logo";
import { UI } from '@/design';
import { useI18n } from '@/i18n';

const footerLinkClass = `${UI.btn} ${UI.btnGhost} px-5 py-2.5 text-xs`;

/**
 * Pie de página exclusivo para la página de inicio.
 */
export const HomeFooter = () => {
  const { t, getLocalizedPath } = useI18n();

  return (
    <footer className="border-t border-carbon/10 mt-8">
      <div className="max-w-5xl mx-auto px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex gap-3">
          <Link href={getLocalizedPath('/diccionario')} className={`${footerLinkClass} min-h-11 border-dictionary/20 text-dictionary hover:bg-dictionary hover:text-lienzo`}>
            {t('navigation', 'dictionary')}
          </Link>
          <Link href={getLocalizedPath('/historia')} className={`${footerLinkClass} min-h-11 border-musgo/30 text-musgo hover:bg-musgo hover:text-lienzo hover:text-on-accent`}>
            {t('navigation', 'history')}
          </Link>
        </div>

        <div className={`flex items-center gap-3 text-ink-muted text-xs font-sans ${UI.tabularNums}`}>
          <div className="w-6 h-px bg-carbon/20" aria-hidden="true" />
          <Logo decorative className="w-5 h-5 opacity-70" />
          <span>Matematika · 2026</span>
          <div className="w-6 h-px bg-carbon/20" aria-hidden="true" />
        </div>
      </div>
    </footer>
  );
};
