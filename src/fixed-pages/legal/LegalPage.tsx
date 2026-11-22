import { Fragment, useEffect, type ReactNode } from 'react';
import { useI18n } from '@/i18n';
import type { LegalI18n } from '@/i18n/types';

export const CONTACT_EMAIL = 'matematikaentziklopedia@gmail.com';
export const REPO_URL = 'https://github.com/izaro-c/Matematika';

/** Destino de cada marcador de `legal.linkLabels`; algunos dependen del idioma. */
const linkHref = (key: keyof LegalI18n['linkLabels'], lang: string): string => {
  switch (key) {
    case 'mit': return `${REPO_URL}/blob/main/LICENSE`;
    case 'ccbysa': return 'https://creativecommons.org/licenses/by-sa/4.0/' + (lang === 'en' ? '' : 'deed.' + lang);
    case 'repo': return REPO_URL;
    case 'githubPrivacy': return 'https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement';
    case 'googlePrivacy': return `https://policies.google.com/privacy?hl=${lang}`;
    case 'aepd': return 'https://www.aepd.es';
  }
};

/** Pinta un párrafo sustituyendo `{email}` y `{clave}` por enlaces. */
const renderParagraph = (text: string, labels: LegalI18n['linkLabels'], lang: string): ReactNode =>
  text.split(/(\{\w+\})/).map((part, i) => {
    const key = part.match(/^\{(\w+)\}$/)?.[1];
    if (key === 'email') return <a key={i} href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;
    if (key && key in labels) {
      const k = key as keyof LegalI18n['linkLabels'];
      return <a key={i} href={linkHref(k, lang)} rel="noopener noreferrer" target="_blank">{labels[k]}</a>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });

const SECTION_ORDER = ['notice', 'licenses', 'privacy', 'cookies'] as const;

/** Aviso legal, licencias, privacidad y cookies en una sola hoja. */
export const LegalPage = () => {
  const { lang, currentLanguage } = useI18n();
  const legal = currentLanguage.dictionary.legal;

  // El pie enlaza a «#licenses»: en la SPA el navegador no salta solo al ancla.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView();
  }, []);

  return (
    <main className="ac-page bg-arts-and-crafts ac-legal">
      <article className="ac-legal__sheet">
        <h1 className="ac-legal__title">{legal.title}</h1>
        {SECTION_ORDER.map(id => {
          const section = legal.sections[id];
          return (
            <section key={id} id={id} aria-labelledby={`${id}-heading`}>
              <h2 id={`${id}-heading`} className="ac-legal__heading">{section.heading}</h2>
              {section.paragraphs.map((p, i) => <p key={i}>{renderParagraph(p, legal.linkLabels, lang)}</p>)}
            </section>
          );
        })}
        <p className="ac-legal__updated">{legal.updated}</p>
      </article>
    </main>
  );
};
