import { describe, it, expect, beforeEach } from 'vitest';
import { useGlossaryStore, dictionary } from '@/controller/store/GlossaryStore';

describe('useGlossaryStore', () => {
  beforeEach(() => {
    useGlossaryStore.setState({
      activeTerm: null,
      activeFormulaTerms: null,
      displayMode: 'sidebar',
    });
  });

  it('starts with no active term', () => {
    expect(useGlossaryStore.getState().activeTerm).toBeNull();
  });

  it('opens a term', () => {
    useGlossaryStore.getState().openTerm('axioma');
    expect(useGlossaryStore.getState().activeTerm).toBe('axioma');
  });

  it('opens formula terms', () => {
    useGlossaryStore.getState().openFormulaTerms(['implies', 'forall']);
    expect(useGlossaryStore.getState().activeFormulaTerms).toEqual(['implies', 'forall']);
  });

  it('closes term', () => {
    useGlossaryStore.getState().openTerm('axioma');
    useGlossaryStore.getState().closeTerm();
    expect(useGlossaryStore.getState().activeTerm).toBeNull();
    expect(useGlossaryStore.getState().activeFormulaTerms).toBeNull();
  });

  it('toggles display mode', () => {
    expect(useGlossaryStore.getState().displayMode).toBe('sidebar');
    useGlossaryStore.getState().toggleDisplayMode();
    expect(useGlossaryStore.getState().displayMode).toBe('modal');
    useGlossaryStore.getState().toggleDisplayMode();
    expect(useGlossaryStore.getState().displayMode).toBe('sidebar');
  });
});

describe('dictionary', () => {
  it('has expected entries', () => {
    expect(dictionary.axioma).toBeDefined();
    expect(dictionary.axioma.category).toBe('Conceptos Fundamentales');
    expect(dictionary.implies).toBeDefined();
    expect(dictionary.implies.category).toBe('Lógica');
  });
});
