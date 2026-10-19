import React, { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  Button,
  Field,
  IconButton,
  Modal,
  Panel,
  SegmentedControl,
  Tabs,
  Toast,
} from '../../../../../src/fixed-pages/editor/ui/primitives';

describe('Button', () => {
  it('es secundario por defecto y no envía formularios', () => {
    render(<Button>Cancelar</Button>);
    const button = screen.getByRole('button', { name: 'Cancelar' });
    expect(button.getAttribute('type')).toBe('button');
    expect(button.className).toBe('ed-button');
  });

  it('marca el primario (manícula) y el de peligro', () => {
    render(<><Button variant="primary">Guardar</Button><Button variant="danger" size="sm">Eliminar</Button></>);
    expect(screen.getByRole('button', { name: 'Guardar' }).className).toContain('ed-button--primary');
    const danger = screen.getByRole('button', { name: 'Eliminar' });
    expect(danger.className).toContain('ed-button--danger');
    expect(danger.className).toContain('ed-button--sm');
  });
});

describe('IconButton', () => {
  it('usa la etiqueta como nombre accesible y como título', () => {
    render(<IconButton label="Cerrar"><svg /></IconButton>);
    const button = screen.getByRole('button', { name: 'Cerrar' });
    expect(button.getAttribute('title')).toBe('Cerrar');
  });
});

describe('SegmentedControl', () => {
  const Harness = ({ onChange = vi.fn() }: { onChange?: (value: string) => void }) => {
    const [value, setValue] = useState('visual');
    return (
      <SegmentedControl
        aria-label="Vista"
        value={value}
        onChange={next => { setValue(next); onChange(next); }}
        options={[
          { value: 'visual', label: 'Visual' },
          { value: 'codigo', label: 'Código' },
          { value: 'previa', label: 'Previa', disabled: true },
        ]}
      />
    );
  };

  it('es un grupo de radio con una sola parada de tabulación', () => {
    render(<Harness />);
    expect(screen.getByRole('radiogroup', { name: 'Vista' })).toBeTruthy();
    const visual = screen.getByRole('radio', { name: 'Visual' });
    const code = screen.getByRole('radio', { name: 'Código' });
    expect(visual.getAttribute('aria-checked')).toBe('true');
    expect(visual.tabIndex).toBe(0);
    expect(code.tabIndex).toBe(-1);
  });

  it('cambia con clic y con flechas, saltando las opciones deshabilitadas', () => {
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    fireEvent.click(screen.getByRole('radio', { name: 'Código' }));
    expect(onChange).toHaveBeenLastCalledWith('codigo');
    fireEvent.keyDown(screen.getByRole('radio', { name: 'Código' }), { key: 'ArrowRight' });
    expect(onChange).toHaveBeenLastCalledWith('visual');
    expect(document.activeElement).toBe(screen.getByRole('radio', { name: 'Visual' }));
  });
});

describe('Tabs', () => {
  const Harness = ({ variant }: { variant?: 'tabs' | 'nav' }) => {
    const [active, setActive] = useState('a');
    return (
      <Tabs
        aria-label="Secciones"
        variant={variant}
        activeTab={active}
        onTabChange={setActive}
        panelId={id => `panel-${id}`}
        tabs={[{ id: 'a', label: 'Esencial' }, { id: 'b', label: 'Geometría' }]}
      />
    );
  };

  it('como lista de pestañas usa aria-selected y flechas', () => {
    render(<Harness />);
    const first = screen.getByRole('tab', { name: 'Esencial' });
    expect(first.getAttribute('aria-selected')).toBe('true');
    expect(first.getAttribute('aria-controls')).toBe('panel-a');
    fireEvent.keyDown(first, { key: 'End' });
    expect(screen.getByRole('tab', { name: 'Geometría' }).getAttribute('aria-selected')).toBe('true');
  });

  it('como navegación usa aria-current', () => {
    render(<Harness variant="nav" />);
    fireEvent.click(screen.getByRole('button', { name: 'Geometría' }));
    expect(screen.getByRole('button', { name: 'Geometría' }).getAttribute('aria-current')).toBe('page');
    expect(screen.getByRole('button', { name: 'Esencial' }).getAttribute('aria-current')).toBeNull();
  });
});

describe('Panel', () => {
  it('muestra la rúbrica como encabezado, con el aparte y las acciones', () => {
    render(<Panel title="Capas" meta="3" actions={<IconButton label="Añadir">+</IconButton>}><p>Interior</p></Panel>);
    expect(screen.getByRole('heading', { level: 3 }).textContent).toBe('Capas3');
    expect(screen.getByRole('button', { name: 'Añadir' })).toBeTruthy();
  });

  it('abierto por defecto cuando es plegable y respeta defaultOpen', () => {
    const { container } = render(
      <>
        <Panel title="Abierto" collapsible><p>A</p></Panel>
        <Panel title="Cerrado" collapsible defaultOpen={false}><p>B</p></Panel>
      </>,
    );
    const [open, closed] = Array.from(container.querySelectorAll('details'));
    expect(open.open).toBe(true);
    expect(closed.open).toBe(false);
  });

  it('en modo controlado avisa sin plegarse por su cuenta', () => {
    const onOpenChange = vi.fn();
    const { container } = render(<Panel title="Controlado" collapsible open onOpenChange={onOpenChange}><p>V</p></Panel>);
    fireEvent.click(container.querySelector('summary')!);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(container.querySelector('details')!.open).toBe(true);
  });
});

describe('Field', () => {
  it('enlaza etiqueta, ayuda y error con el control', () => {
    const { rerender } = render(<Field label="Nombre" help="Se ve en el índice"><input /></Field>);
    const input = screen.getByLabelText('Nombre');
    expect(input.className).toContain('ed-control');
    expect(document.getElementById(input.getAttribute('aria-describedby')!)?.textContent).toBe('Se ve en el índice');

    rerender(<Field label="Nombre" help="Se ve en el índice" error="Obligatorio"><input /></Field>);
    const invalid = screen.getByLabelText('Nombre');
    expect(invalid.getAttribute('aria-invalid')).toBe('true');
    expect(document.getElementById(invalid.getAttribute('aria-describedby')!)?.textContent).toBe('Obligatorio');
  });

  it('conserva el id y las clases propias del control', () => {
    render(<Field label="Tipo"><select id="tipo" className="font-mono"><option>a</option></select></Field>);
    const select = screen.getByLabelText('Tipo');
    expect(select.id).toBe('tipo');
    expect(select.className).toBe('ed-control font-mono');
  });
});

describe('Modal', () => {
  it('no se monta cerrado', () => {
    render(<Modal open={false} onClose={vi.fn()} title="Ajustes">x</Modal>);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('se titula, se cierra con ✕, Escape y el fondo', () => {
    const onClose = vi.fn();
    render(<Modal open onClose={onClose} title="Ajustes" footer={<Button>Hecho</Button>}>Cuerpo</Modal>);
    const dialog = screen.getByRole('dialog', { name: 'Ajustes' });
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar' }));
    fireEvent.keyDown(document, { key: 'Escape' });
    fireEvent.mouseDown(dialog.parentElement!);
    expect(onClose).toHaveBeenCalledTimes(3);
  });

  it('no se puede descartar mientras dismissible es false', () => {
    const onClose = vi.fn();
    render(<Modal open dismissible={false} onClose={onClose} title="Guardando">…</Modal>);
    expect(screen.queryByRole('button', { name: 'Cerrar' })).toBeNull();
    fireEvent.keyDown(document, { key: 'Escape' });
    fireEvent.mouseDown(screen.getByRole('dialog').parentElement!);
    expect(onClose).not.toHaveBeenCalled();
  });
});

describe('Toast', () => {
  it('anuncia los errores como alerta y el resto como estado', () => {
    render(<><Toast tone="error">Falló</Toast><Toast tone="success">Guardado</Toast></>);
    expect(screen.getByRole('alert').textContent).toBe('Falló');
    expect(screen.getByRole('status').className).toContain('ed-toast--success');
  });

  it('se descarta solo tras la duración indicada', () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(<Toast duration={3000} onDismiss={onDismiss}>Guardado</Toast>);
    act(() => { vi.advanceTimersByTime(2999); });
    expect(onDismiss).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(1); });
    expect(onDismiss).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});
