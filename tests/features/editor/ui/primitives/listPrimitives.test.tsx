import { describe, expect, it, vi } from 'vitest';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Callout, Card, Chip, Menu, MenuItem, RowButton, Swatch } from '../../../../../src/fixed-pages/editor/ui/primitives';

describe('Menu', () => {
  it('moves focus between items with the arrow keys, Home and End', () => {
    render(
      <Menu>
        <MenuItem>Uno</MenuItem>
        <MenuItem disabled>Dos</MenuItem>
        <MenuItem>Tres</MenuItem>
      </Menu>,
    );
    const [uno, tres] = [screen.getByText('Uno'), screen.getByText('Tres')];
    uno.focus();
    fireEvent.keyDown(uno, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(tres);
    fireEvent.keyDown(tres, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(uno);
    fireEvent.keyDown(uno, { key: 'End' });
    expect(document.activeElement).toBe(tres);
  });

  it('marks a danger item', () => {
    render(<Menu><MenuItem tone="danger">Borrar</MenuItem></Menu>);
    expect(screen.getByRole('menuitem', { name: 'Borrar' }).className).toContain('ed-menu__item--danger');
  });
});

describe('RowButton, Chip and Swatch', () => {
  it('RowButton keeps aria-current and fires onClick', () => {
    const onClick = vi.fn();
    render(<RowButton aria-current="page" onClick={onClick}>Axioma</RowButton>);
    const row = screen.getByRole('button', { name: 'Axioma' });
    expect(row.getAttribute('aria-current')).toBe('page');
    fireEvent.click(row);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('Chip renders the active one as text and the others as buttons', () => {
    render(<><Chip state="active">ES</Chip><Chip>EU</Chip><Chip state="missing">+EN</Chip></>);
    expect(screen.getByText('ES').tagName).toBe('SPAN');
    expect(screen.getByRole('button', { name: 'EU' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '+EN' }).className).toContain('ed-chip--missing');
  });

  it('Swatch exposes its name and selection', () => {
    render(<Swatch label="canela" selected />);
    const swatch = screen.getByRole('button', { name: 'canela' });
    expect(swatch.getAttribute('aria-pressed')).toBe('true');
  });
});

describe('Card and Callout', () => {
  it('Card can be dashed', () => {
    const { container } = render(<Card dashed>Vacío</Card>);
    expect(container.firstElementChild?.className).toContain('ed-card--dashed');
  });

  it('an error Callout announces itself, the others do not', () => {
    render(<><Callout tone="error">Falla</Callout><Callout tone="warning">Ojo</Callout></>);
    expect(screen.getByRole('alert').textContent).toBe('Falla');
    expect(screen.getByText('Ojo').getAttribute('role')).toBeNull();
  });
});
