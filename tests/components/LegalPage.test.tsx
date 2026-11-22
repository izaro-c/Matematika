import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Router } from 'wouter';
import { memoryLocation } from 'wouter/memory-location';
import { LegalPage, CONTACT_EMAIL } from '@/fixed-pages/legal/LegalPage';
import { HomeFooter } from '@/fixed-pages/home/components/HomeFooter';
import { I18nProvider } from '@/i18n/I18nContext';
import { SUPPORTED_LANGUAGES } from '@/i18n';

function renderAt(path: string, lang: string, node: React.ReactNode) {
  const { hook } = memoryLocation({ path });
  return render(
    <I18nProvider initialLang={lang}>
      <Router hook={hook}>{node}</Router>
    </I18nProvider>,
  );
}

describe('LegalPage', () => {
  it.each(SUPPORTED_LANGUAGES.map(l => [l.code, l.routeSegments.legal] as const))(
    '%s: pinta las cuatro secciones sin marcadores sueltos',
    (lang, segment) => {
      const { container } = renderAt(`/${lang}/${segment}`, lang, <LegalPage />);
      const legal = SUPPORTED_LANGUAGES.find(l => l.code === lang)!.dictionary.legal;

      expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(legal.title);
      expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(4);
      expect(container.textContent).not.toMatch(/\{\w+\}/);
      expect(screen.getByRole('link', { name: CONTACT_EMAIL }).getAttribute('href')).toBe(`mailto:${CONTACT_EMAIL}`);
      expect(container.querySelector('#licenses')).toBeTruthy();
    },
  );
});

describe('HomeFooter', () => {
  it.each([['es', '/es/aviso-legal'], ['eu', '/eu/lege-oharra'], ['en', '/en/legal-notice']])(
    '%s: enlaza al aviso legal, al contacto y a la licencia',
    (lang, legalPath) => {
      renderAt(`/${lang}`, lang, <HomeFooter />);
      const footer = SUPPORTED_LANGUAGES.find(l => l.code === lang)!.dictionary.legal.footer;

      expect(screen.getByRole('link', { name: footer.legal }).getAttribute('href')).toBe(legalPath);
      expect(screen.getByRole('link', { name: footer.contact }).getAttribute('href')).toBe(`mailto:${CONTACT_EMAIL}`);
      expect(screen.getByRole('link', { name: footer.license }).getAttribute('href')).toBe(`${legalPath}#licenses`);
    },
  );
});
