// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AxiomaticUniversePicker } from '@/features/graph/ui/components/AxiomaticUniversePicker';
import { AxiomaticAxiomPicker } from '@/features/graph/ui/components/AxiomaticAxiomPicker';
import { AxiomaticDisplayOptions } from '@/features/graph/ui/components/AxiomaticDisplayOptions';
import { AxiomaticSidebar } from '@/features/graph/ui/components/AxiomaticSidebar';
import { getAxiomGroup } from '@/features/graph/lib/graphUtils';

afterEach(cleanup);

describe('axiomatic sidebar controls', () => {
  it('presents systems and models in project-styled selection menus', () => {
    const onToggleSystem = vi.fn();
    const onToggleModel = vi.fn();

    render(
      <AxiomaticUniversePicker
        systems={[{ id: 'sistema-a', title: 'Sistema A', axioms: ['a', 'b'] }]}
        inactiveSystems={[]}
        onToggleSystem={onToggleSystem}
        models={[{ id: 'modelo-a', title: 'Modelo A', axioms: ['a'] }]}
        inactiveModels={['modelo-a']}
        onToggleModel={onToggleModel}
      />,
    );

    const activeSystem = screen.getByRole('button', { name: /Sistema A/ });
    const modelMenu = screen.getByRole('button', { name: /Elegir un modelo/ });
    expect(activeSystem.getAttribute('aria-haspopup')).toBe('listbox');
    expect(activeSystem.getAttribute('aria-expanded')).toBe('false');
    expect(modelMenu.getAttribute('aria-expanded')).toBe('false');

    fireEvent.click(modelMenu);
    expect(modelMenu.getAttribute('aria-expanded')).toBe('true');
    fireEvent.click(screen.getByRole('option', { name: /Modelo A/ }));
    expect(onToggleModel).toHaveBeenCalledWith('modelo-a');
  });

  it('groups axioms by family and exposes bulk and individual actions', () => {
    const onToggle = vi.fn();
    const onRestoreBaseline = vi.fn();
    const onDeactivateAll = vi.fn();

    render(
      <AxiomaticAxiomPicker
        axioms={[
          { id: 'axioma-arquimedes', title: 'Arquímedes' },
          { id: 'axioma-incidencia-1', title: 'Incidencia I' },
          { id: 'axioma-congruencia-1', title: 'Congruencia I' },
          { id: 'axioma-paralelas-euclides', title: 'Paralelas de Euclides', alternativeGroup: 'postulado-paralelas' },
          { id: 'axioma-paralelas-hiperbolico', title: 'Paralelas de Lobachevski', alternativeGroup: 'postulado-paralelas' },
          { id: 'axioma-eleccion', title: 'Axioma de elección', axiomFamily: 'Teoría de conjuntos' },
        ]}
        disabledAxioms={new Set([
          'axioma-congruencia-1',
          'axioma-paralelas-euclides',
          'axioma-paralelas-hiperbolico',
          'axioma-eleccion',
        ])}
        baselineAxiomIds={[
          'axioma-arquimedes',
          'axioma-incidencia-1',
          'axioma-congruencia-1',
        ]}
        onToggle={onToggle}
        onRestoreBaseline={onRestoreBaseline}
        onDeactivateAll={onDeactivateAll}
      />,
    );

    const groups = screen
      .getAllByRole('group', { hidden: true })
      .filter(group => group.tagName === 'FIELDSET');
    expect(groups.map((group) => group.textContent)).toEqual([
      expect.stringContaining('Incidencia'),
      expect.stringContaining('Congruencia'),
      expect.stringContaining('Paralelas'),
      expect.stringContaining('Continuidad'),
      expect.stringContaining('Teoría de conjuntos'),
    ]);

    const congruenceGroup = groups.find((group) => group.textContent?.includes('Congruencia'));
    expect(congruenceGroup).toBeDefined();
    const checkbox = within(congruenceGroup!).getByRole('checkbox', { name: 'Congruencia I', hidden: true });
    expect((checkbox as HTMLInputElement).checked).toBe(false);
    expect((checkbox as HTMLInputElement).style.accentColor).toBe(
      getAxiomGroup('axioma-congruencia-1')?.color,
    );
    fireEvent.click(checkbox);
    expect(onToggle).toHaveBeenCalledWith('axioma-congruencia-1');

    const parallelGroup = groups.find((group) => group.textContent?.includes('Paralelas'));
    expect(parallelGroup).toBeDefined();
    const neutralParallelChoice = within(parallelGroup!).getByRole('radio', {
      name: 'Ninguno — sin decidir',
      hidden: true,
    });
    expect((neutralParallelChoice as HTMLInputElement).checked).toBe(true);
    fireEvent.click(within(parallelGroup!).getByRole('radio', { name: 'Paralelas de Euclides', hidden: true }));
    expect(onToggle).toHaveBeenCalledWith('axioma-paralelas-euclides');

    fireEvent.click(screen.getByRole('button', { name: 'Restaurar base neutral' }));
    expect(onRestoreBaseline).toHaveBeenCalledOnce();
  });

  it('keeps distinct alternative groups exclusive inside the same axiom family', () => {
    const onToggle = vi.fn();
    render(
      <AxiomaticAxiomPicker
        axioms={[
          { id: 'logica-clasica', title: 'Lógica clásica', axiomFamily: 'Lógica', alternativeGroup: 'regla-logica' },
          { id: 'logica-intuicionista', title: 'Lógica intuicionista', axiomFamily: 'Lógica', alternativeGroup: 'regla-logica' },
          { id: 'eleccion', title: 'Elección', axiomFamily: 'Lógica', alternativeGroup: 'principio-eleccion' },
          { id: 'eleccion-dependiente', title: 'Elección dependiente', axiomFamily: 'Lógica', alternativeGroup: 'principio-eleccion' },
        ]}
        disabledAxioms={new Set(['logica-intuicionista', 'eleccion', 'eleccion-dependiente'])}
        baselineAxiomIds={[]}
        onToggle={onToggle}
        onRestoreBaseline={vi.fn()}
        onDeactivateAll={vi.fn()}
      />,
    );

    expect((screen.getByRole('radio', { name: 'Lógica clásica', hidden: true }) as HTMLInputElement).checked).toBe(true);
    expect(screen.getAllByRole('radio', { name: 'Ninguno — sin decidir', hidden: true })).toHaveLength(2);
    fireEvent.click(screen.getByRole('radio', { name: 'Elección', hidden: true }));
    expect(onToggle).toHaveBeenCalledWith('eleccion');
  });

  it('uses pressed buttons for node visibility filters', () => {
    const onToggleType = vi.fn();

    render(
      <AxiomaticDisplayOptions
        visibleTypes={new Set(['axioma'])}
        onToggleType={onToggleType}
        typeLabel={{ axioma: 'Axiomas', teorema: 'Teoremas' }}
        typeColors={{ axioma: 'var(--theme-ocre)', teorema: 'var(--theme-terracota)' }}
      />,
    );

    const axioms = screen.getByRole('button', { name: 'Axiomas' });
    const theorems = screen.getByRole('button', { name: 'Teoremas' });
    expect(axioms.getAttribute('aria-pressed')).toBe('true');
    expect(theorems.getAttribute('aria-pressed')).toBe('false');

    fireEvent.click(theorems);
    expect(onToggleType).toHaveBeenCalledWith('teorema');
  });

  it('moves between the logical and display views with the keyboard', () => {
    render(
      <AxiomaticSidebar
        isMobile={false}
        sidebarOpen
        setSidebarOpen={vi.fn()}
        visibleTypes={new Set(['axioma'])}
        toggleType={vi.fn()}
        typeLabel={{ axioma: 'Axiomas' }}
        typeColors={{ axioma: 'var(--theme-ocre)' }}
      />,
    );

    const logicTab = screen.getByRole('tab', { name: 'Base lógica' });
    const displayTab = screen.getByRole('tab', { name: 'Vista y lectura' });
    expect(logicTab.getAttribute('aria-selected')).toBe('true');

    logicTab.focus();
    fireEvent.keyDown(logicTab, { key: 'ArrowRight' });

    expect(displayTab.getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement).toBe(displayTab);
    expect(screen.getByRole('heading', { name: 'Capas visibles' })).toBeDefined();
  });
});
