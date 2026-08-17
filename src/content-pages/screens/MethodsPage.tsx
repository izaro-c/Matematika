import { Link } from 'wouter';
import { db } from '@/data/content';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { useI18n } from '@/i18n';

/** Índice navegable de los métodos de demostración publicados. */
export const MethodsPage = () => {
  const { lang, getLocalizedPath, t } = useI18n();

  const methods = db
    .getAllMethods(lang)
    .filter(method => method.subtype === 'demostracion')
    .sort((a, b) => (a.title ?? a.id).localeCompare(b.title ?? b.id, lang));

  return (
    <main className="ac-page bg-arts-and-crafts">
      <div className="mx-auto w-full max-w-5xl px-6 pb-24 pt-20 sm:px-10 sm:pt-24 lg:px-12 lg:pb-32">
        <Breadcrumbs crumbs={[{ name: t('methods', 'title') }]} className="mb-12" />

        <header className="max-w-3xl border-b border-carbon/15 pb-10 sm:pb-12">
          <p className="ac-eyebrow ac-eyebrow--granada mb-4">
            {t('methods', 'eyebrow')}
          </p>
          <h1 className="text-4xl font-semibold leading-none tracking-tight sm:text-5xl lg:text-6xl">
            {t('methods', 'title')}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-carbon/70 sm:text-xl">
            {t('methods', 'description')}
          </p>
        </header>

        <section aria-labelledby="methods-index-title" className="mt-12 sm:mt-16">
          <div className="mb-6 flex items-baseline justify-between gap-6">
            <h2
              id="methods-index-title"
              className="ac-eyebrow text-carbon/55"
            >
              {t('methods', 'index')}
            </h2>
            <p className="font-sans text-xs text-carbon/45">
              {t('methods', 'methodsCount', { count: methods.length })}
            </p>
          </div>

          <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {methods.map(method => (
              <li key={method.id} className="flex">
                <Link
                  href={getLocalizedPath(`/metodo/${method.slug}`)}
                  className="group elegant-panel flex w-full flex-col p-6 shadow-sm transition-[border-color,box-shadow,transform] duration-300 hover:shadow-elegant focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-granada motion-safe:hover:-translate-y-0.5 motion-reduce:transition-none sm:p-7"
                  style={{ ['--hover-accent' as string]: 'var(--theme-granada)' }}
                >
                  <span
                    className="mb-8 h-px w-10 bg-granada/45 transition-[width,background-color] duration-300 group-hover:w-16 group-hover:bg-granada/80"
                    aria-hidden="true"
                  />

                  <h3 className="text-2xl font-semibold leading-tight text-carbon transition-colors group-hover:text-granada">
                    {method.title ?? method.id}
                  </h3>
                  {method.description && (
                    <p className="mt-3 flex-grow text-base leading-relaxed text-carbon/65">
                      {method.description}
                    </p>
                  )}

                  <span className="ac-eyebrow ac-eyebrow--granada mt-8 inline-flex items-center gap-2 self-start">
                    {t('content', 'explore')}
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
};
