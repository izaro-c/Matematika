// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AxiomaticUniversePicker } from '@/features/graph/ui/components/AxiomaticUniversePicker';
import { AxiomaticAxiomPicker } from '@/features/graph/ui/components/AxiomaticAxiomPicker';
import { AxiomaticDisplayOptions } from '@/features/graph/ui/components/AxiomaticDisplayOptions';
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
    const onActivateAll = vi.fn();
    const onDeactivateAll = vi.fn();

    render(
      <AxiomaticAxiomPicker
        axioms={[
          { id: 'axioma-arquimedes', title: 'Arquímedes' },
          { id: 'axioma-incidencia-1', title: 'Incidencia I' },
          { id: 'axioma-congruencia-1', title: 'Congruencia I' },
        ]}
        disabledAxioms={new Set(['axioma-congruencia-1'])}
        onToggle={onToggle}
        onActivateAll={onActivateAll}
        onDeactivateAll={onDeactivateAll}
      />,
    );

    const groups = screen
      .getAllByRole('group', { hidden: true })
      .filter(group => group.tagName === 'FIELDSET');
    expect(groups.map((group) => group.textContent)).toEqual([
      expect.stringContaining('Incidencia'),
      expect.stringContaining('Congruencia'),
      expect.stringContaining('Continuidad'),
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

    fireEvent.click(screen.getByRole('button', { name: 'Activar todos' }));
    expect(onActivateAll).toHaveBeenCalledOnce();
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
});
