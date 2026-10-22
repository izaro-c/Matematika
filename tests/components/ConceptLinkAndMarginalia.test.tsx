import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ConceptLink } from '@/fixed-pages/glossary/ui/ConceptLink';
import { MarginaliaPanel } from '@/components/content/MarginaliaPanel';
import { useGlossaryStore } from '@/lib/stores/GlossaryStore';

describe('ConceptLink & MarginaliaPanel Integration', () => {
  beforeEach(() => {
    useGlossaryStore.setState({
      activeTerms: null,
      activeFormulaTerms: null,
    });
  });

  it('renders valid concept as interactive button (not direct page link) and opens Marginalia on click', () => {
    render(<ConceptLink targetId="punto">Punto</ConceptLink>);

    // Should NOT be an anchor with href to /definicion/punto
    const element = screen.getByRole('button', { name: /Punto/i });
    expect(element).toBeDefined();
    expect(element.tagName.toLowerCase()).toBe('span');
    expect(element.getAttribute('href')).toBeNull();

    // Click should open term in store
    fireEvent.click(element);
    expect(useGlossaryStore.getState().activeTerms).toEqual(['punto']);
  });

  it('supports keyboard activation (Enter and Space) on valid ConceptLink', () => {
    render(<ConceptLink targetId="recta">Recta</ConceptLink>);

    const element = screen.getByRole('button', { name: /Recta/i });
    fireEvent.keyDown(element, { key: 'Enter' });
    expect(useGlossaryStore.getState().activeTerms).toEqual(['recta']);

    useGlossaryStore.getState().closeTerm();
    expect(useGlossaryStore.getState().activeTerms).toBeNull();

    fireEvent.keyDown(element, { key: ' ' });
    expect(useGlossaryStore.getState().activeTerms).toEqual(['recta']);
  });

  it('renders pending/invalid concept as link to construction page', () => {
    render(<ConceptLink targetId="concepto-inexistente-123">Inexistente</ConceptLink>);

    const link = screen.getByRole('link', { name: /Inexistente/i });
    expect(link).toBeDefined();
    expect(link.getAttribute('href')).toContain('/construccion/concepto-inexistente-123');
  });

  it('shows article content and a «Véase» link to the article in MarginaliaPanel for DB entities', () => {
    useGlossaryStore.getState().openTerm('punto');

    render(<MarginaliaPanel />);

    // Shows title in panel
    expect(screen.getByRole('heading', { name: /Punto/i, level: 2 })).toBeDefined();

    // «Véase Punto.» links to the article
    const fullArticleLink = screen.getByRole('link', { name: /Punto/i });
    expect(fullArticleLink).toBeDefined();
    expect(fullArticleLink.getAttribute('href')).toContain('/definicion/punto');

    // Clicking full article link closes the panel
    fireEvent.click(fullArticleLink);
    expect(useGlossaryStore.getState().activeTerms).toBeNull();
  });

  it('correctly displays formula symbols when opening formulas after opening a ConceptLink', () => {
    // 1. Open concept link first
    useGlossaryStore.getState().openTerm('punto');
    const { rerender } = render(<MarginaliaPanel />);

    expect(screen.getByRole('heading', { name: /Punto/i, level: 2 })).toBeDefined();

    // 2. Close concept link
    useGlossaryStore.getState().closeTerm();
    rerender(<MarginaliaPanel />);

    // 3. Open formula symbols
    useGlossaryStore.getState().openFormulaTerms(['implies', 'forall']);
    rerender(<MarginaliaPanel />);

    // Must display formula terms, NOT the previous concept link "Punto"
    expect(screen.queryByRole('heading', { name: /Punto/i, level: 2 })).toBeNull();
    expect(screen.getByRole('heading', { name: /Implicación/i, level: 2 })).toBeDefined();
    expect(screen.getByRole('heading', { name: /Cuantificador Universal/i, level: 2 })).toBeDefined();
    expect(screen.queryByRole('link')).toBeNull();
  });
});
