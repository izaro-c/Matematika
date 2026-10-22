import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Router } from 'wouter';
import { memoryLocation } from 'wouter/memory-location';
import { BiographyLayout } from '@/components/layouts/BiographyLayout';
import { I18nProvider } from '@/i18n/I18nContext';
import type { Mathematician } from '@/data/content/types';

const Body = () => <p>Texto de la biografía.</p>;

function renderBio(metadata: Partial<Mathematician>, lang: 'es' | 'eu' | 'en' = 'es') {
  const { hook } = memoryLocation({ path: `/${lang}/bio/${metadata.id}` });
  return render(
    <I18nProvider initialLang={lang}>
      <Router hook={hook}>
        <BiographyLayout
          Component={Body}
          metadata={{ slug: metadata.id!, description: '', Component: Body, ...metadata } as Mathematician}
        />
      </Router>
    </I18nProvider>,
  );
}

describe('BiographyLayout (frontispicio)', () => {
  it('pone el nombre completo, el lugar y las fechas con una sola era', () => {
    const { container } = renderBio({ id: 'euclides', name: 'Euclides', title: 'Euclides de Alejandría', country: 'Alejandría', birthYear: -325, deathYear: -265 });

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Euclides de Alejandría');
    expect(container.querySelector('.ac-bio__dates')?.textContent).toBe('325–265 a. C.');
    expect(container.querySelector('.ac-bio__portrait')?.hasAttribute('data-empty')).toBe(true);
  });

  it('las fechas siguen el orden de cada idioma', () => {
    const { container } = renderBio({ id: 'euclides', name: 'Euklides', birthYear: -325, deathYear: -265 }, 'eu');
    expect(container.querySelector('.ac-bio__dates')?.textContent).toBe('K.a. 325–265');
  });

  it('sin era antes de Cristo, solo los años', () => {
    const { container } = renderBio({ id: 'hilbert', name: 'David Hilbert', birthYear: 1862, deathYear: 1943 });
    expect(container.querySelector('.ac-bio__dates')?.textContent).toBe('1862–1943');
  });

  it('con retrato, la imagen lleva el nombre', () => {
    renderBio({ id: 'pitagoras', name: 'Pitágoras', image: '/images/mathematicians/Pythagoras.jpg' });
    expect(screen.getByRole('img', { name: 'Retrato de Pitágoras' })).toBeTruthy();
  });

  it('su obra va al pie agrupada por tipo', () => {
    renderBio({ id: 'euclides', name: 'Euclides' });

    const headings = screen.getAllByRole('heading', { level: 2 }).map(h => h.textContent);
    expect(headings).toContain('Teoremas');
    expect(headings).toContain('Demostraciones');
  });
});
