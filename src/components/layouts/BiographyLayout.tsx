import { Suspense } from 'react';
import { Link } from 'wouter';
import { resolvePublicOrExternalAsset } from '@/lib/routes';
import { formatLifeDates } from '@/lib/lifeDates';
import { VocabSection, VocabEntry } from '@/components/ui/Vocabulary';
import { ContentBody } from '@/components/ui/ContentBody';
import { getContentTypeLabel } from '@/lib/theme/constants';
import { useProgressStore } from '@/lib/stores/UserProgressStore';
import { useI18n } from '@/i18n';
import { db } from '@/data/content';
import { CanvasControlContext } from '@/diagrams/render/CanvasControlContext';
import type { Mathematician, Theorem } from '@/data/content/types';

// Lámina de muestra: sin cabecera ni barra; el tablero no responde (la lámina es un enlace).
const PLATE_CONTROL = { onComplete: () => {}, isCompleted: false, hideHeader: true };

/** Láminas: los diagramas de sus teoremas como figuras con pie, cada una enlazada a su teorema. */
const BioPlates: React.FC<{ theorems: Theorem[] }> = ({ theorems }) => {
  const { t, getLocalizedPath } = useI18n();
  const figures = theorems.filter((th) => th.Simulation);
  if (figures.length === 0) return null;
  return (
    <section className="ac-bio-plates">
      <div className="ac-vocab__head">
        <h2 className="ac-vocab__heading">{t('biography', 'plates')}</h2>
        <span className="ac-vocab__rule" aria-hidden="true" />
        <span className="ac-vocab__count ac-rubric">{figures.length}</span>
      </div>
      <div className="ac-bio-plates__grid">
        {figures.map((th, i) => {
          const Figure = th.Simulation!;
          return (
            <Link key={th.id} href={getLocalizedPath(`/teorema/${th.id}`)} className="ac-bio-plate">
              <div className="ac-bio-plate__board" aria-hidden="true">
                <CanvasControlContext.Provider value={PLATE_CONTROL}>
                  <Suspense fallback={null}><Figure /></Suspense>
                </CanvasControlContext.Provider>
              </div>
              <span className="ac-bio-plate__caption">
                <span className="ac-rubric">{t('diagram', 'figureNumber', { n: i + 1 })}</span> · <i>{th.title}</i>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

interface BiographyLayoutProps {
  Component: React.ComponentType<Record<string, unknown>>;
  metadata: Mathematician;
}

/**
 * Biografía de un matemático: frontispicio a la izquierda (retrato en óvalo
 * con filete del color de la página, nombre, lugar y fechas) y texto a la
 * derecha; al pie, las láminas de sus teoremas y su obra en la enciclopedia
 * con la voz de vocabulario.
 * En móvil el frontispicio va arriba, más pequeño.
 */
export const BiographyLayout: React.FC<BiographyLayoutProps> = ({ Component, metadata }) => {
  const { lang, t, getLocalizedPath } = useI18n();
  const isRead = useProgressStore((s) => s.isRead);

  const { id, name, title, country, image, birthYear, deathYear } = metadata;
  const displayName = title || name;

  const dates = formatLifeDates(t, birthYear, deathYear);

  const byAuthor = <T extends { authors?: string[] }>(items: T[]) => items.filter((item) => item.authors?.includes(id));
  const theorems = db.getTheoremsByAuthor(id, lang);
  const demos = byAuthor(db.getAllDemos(lang));
  const systems = byAuthor(db.getAllAxiomaticSystems(lang));

  return (
    <article className="ac-bio">
      <header className="ac-bio__plate">
        <figure className="ac-bio__portrait" data-empty={!image || undefined}>
          {image ? (
            <img src={resolvePublicOrExternalAsset(image)} alt={t('biography', 'portraitAlt', { name })} />
          ) : (
            <span aria-hidden="true">{name.charAt(0)}</span>
          )}
        </figure>
        <h1 className="ac-bio__name">{displayName}</h1>
        <span className="ac-bio__rule" aria-hidden="true" />
        {country && <p className="ac-bio__place">{country}</p>}
        {dates && <p className="ac-bio__dates ac-rubric">{dates}</p>}
        <Link href={getLocalizedPath('/historia')} className="ac-bio__back ac-rubric">
          ← {t('timeline', 'title')}
        </Link>
      </header>

      <div className="ac-bio__text font-serif">
        <ContentBody>
          <Component />
        </ContentBody>

        {(theorems.length > 0 || demos.length > 0 || systems.length > 0) && (
          <div className="ac-bio__works">
            <BioPlates theorems={theorems} />
            {theorems.length > 0 && (
              <VocabSection heading={getContentTypeLabel('teorema', 'plural', lang)} accentType="teorema" count={theorems.length}>
                {theorems.map((th) => (
                  <VocabEntry key={th.id} href={getLocalizedPath(`/teorema/${th.id}`)} title={th.title} description={th.description} read={isRead(th.id)} />
                ))}
              </VocabSection>
            )}
            {demos.length > 0 && (
              <VocabSection heading={getContentTypeLabel('demostracion', 'plural', lang)} accentType="demostracion" count={demos.length}>
                {demos.map((demo) => (
                  <VocabEntry key={demo.id} href={getLocalizedPath(`/demo/${demo.id}`)} title={demo.title} description={demo.description} read={isRead(demo.id)} />
                ))}
              </VocabSection>
            )}
            {systems.length > 0 && (
              <VocabSection heading={getContentTypeLabel('sistema-axiomatico', 'plural', lang)} accentType="sistema-axiomatico" count={systems.length}>
                {systems.map((sys) => (
                  <VocabEntry key={sys.id} href={getLocalizedPath(`/sistema/${sys.id}`)} title={sys.title} description={sys.description} read={isRead(sys.id)} />
                ))}
              </VocabSection>
            )}
          </div>
        )}
      </div>
    </article>
  );
};
