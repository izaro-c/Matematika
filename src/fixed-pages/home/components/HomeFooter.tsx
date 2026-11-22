import { Link } from 'wouter';
import { Logo } from "@/components/ui/Logo";
import { UI } from '@/design';
import { useI18n } from '@/i18n';
import { CONTACT_EMAIL } from '@/fixed-pages/legal/LegalPage';

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
      <nav aria-label={t('legal', 'title')} className="max-w-5xl mx-auto px-8 pb-8 -mt-4 flex flex-wrap justify-center gap-x-1 text-sm font-serif italic text-ink-muted">
        <Link href={getLocalizedPath('/aviso-legal')} className="inline-block py-2.5 px-1 underline-offset-2 hover:underline">{t('legal', 'footer', 'legal')}</Link>
        <span aria-hidden="true" className="py-2.5">·</span>
        <a href={`mailto:${CONTACT_EMAIL}`} className="inline-block py-2.5 px-1 underline-offset-2 hover:underline">{t('legal', 'footer', 'contact')}</a>
        <span aria-hidden="true" className="py-2.5">·</span>
        <Link href={`${getLocalizedPath('/aviso-legal')}#licenses`} className="inline-block py-2.5 px-1 underline-offset-2 hover:underline">{t('legal', 'footer', 'license')}</Link>
      </nav>
    </footer>
  );
};
