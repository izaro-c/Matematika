import type JXG from 'jsxgraph';
import type { ControlObject, DiagramControlAction, DiagramControlEasing, DiagramControlEffect } from '@/diagrams/model';
import type { ThemeColors } from '@/diagrams/jsxgraph/theme';
import { safeBoardUpdate } from '@/diagrams/jsxgraph/MathUtils';

/**
 * Control botón: elemento HTML de JSXGraph que expone la misma interfaz numérica
 * que un deslizador (`Value`, `setValue`, `setMax`) para que las expresiones,
 * los pasos y las lecturas lo traten como cualquier otro control.
 */
export interface DiagramButtonElement {
  Value: () => number;
  setValue: (value: number) => void;
  setMax: (max: number) => void;
  /** Anima el valor hasta `target` con la duración y curva del propio botón. */
  animateTo: (target: number) => void;
  /** Detiene cualquier animación y vuelve al valor inicial autorado. */
  resetValue: () => void;
  /** Anima desde `from` (por defecto el mínimo) hasta el destino propio del botón. */
  play: (from?: number) => void;
  press: () => void;
  rendNode?: HTMLElement;
  rendNodeButton?: HTMLButtonElement;
  setAttribute?: (attributes: Record<string, unknown>) => void;
  __matematikaButton: true;
  [key: string]: unknown;
}

const EASINGS: Record<DiagramControlEasing, (t: number) => number> = {
  linear: t => t,
  'ease-in': t => t * t,
  'ease-out': t => 1 - (1 - t) * (1 - t),
  'ease-in-out': t => (t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t)),
};

export function isDiagramButton(element: unknown): element is DiagramButtonElement {
  return Boolean(element && (element as { __matematikaButton?: boolean }).__matematikaButton);
}

/** Valor objetivo de una pulsación según el comportamiento del botón. */
export function nextButtonTarget(action: DiagramControlAction, min: number, current: number, animatingTo: number | undefined): { from: number; to: number } {
  if (action.behavior === 'restart') return { from: min, to: action.to };
  const heading = animatingTo ?? current;
  const active = Math.abs(heading - action.to) < Math.abs(heading - min);
  return { from: current, to: active ? min : action.to };
}

export function createDiagramButton(
  board: JXG.Board,
  item: ControlObject,
  options: {
    labelHtml: string;
    theme: ThemeColors;
    disabled: boolean;
    layer: number;
    /** Aplica un efecto de `action.effects` sobre otro control. */
    runEffect: (effect: DiagramControlEffect) => void;
  },
): DiagramButtonElement {
  const action: DiagramControlAction = item.action ?? { to: item.range.max, durationMs: 1000, easing: 'ease-in-out', behavior: 'toggle' };
  let value = item.value;
  let max = item.range.max;
  let frame: number | undefined;
  let animatingTo: number | undefined;

  const clamp = (next: number) => Math.min(max, Math.max(item.range.min, next));
  const stop = () => {
    if (frame !== undefined) cancelAnimationFrame(frame);
    frame = undefined;
    animatingTo = undefined;
  };

  // eslint-disable-next-line prefer-const -- se asigna tras crear el elemento JSXGraph
  let element: DiagramButtonElement;
  const syncPressed = () => {
    const heading = animatingTo ?? value;
    const pressed = Math.abs(heading - action.to) < Math.abs(heading - item.range.min);
    element.rendNodeButton?.setAttribute('aria-pressed', String(pressed));
    element.rendNodeButton?.setAttribute('data-pressed', String(pressed));
    styleButton(element.rendNodeButton, options.theme, item);
  };

  const runEffects = (on: DiagramControlEffect['on']) => {
    action.effects?.filter(effect => effect.on === on).forEach(options.runEffect);
  };

  const animateBetween = (from: number, to: number, onComplete?: () => void) => {
    stop();
    value = clamp(from);
    const target = clamp(to);
    const returning = Math.abs(target - item.range.min) < Math.abs(target - action.to);
    const fullDuration = returning ? action.returnDurationMs ?? action.durationMs : action.durationMs;
    const duration = Math.max(0, fullDuration * Math.abs(target - value) / Math.max(1e-9, Math.abs(action.to - item.range.min)));
    if (duration === 0 || typeof requestAnimationFrame !== 'function') {
      value = target;
      syncPressed();
      safeBoardUpdate(board);
      onComplete?.();
      return;
    }
    const start = value;
    const startedAt = performance.now();
    const ease = EASINGS[action.easing] ?? EASINGS.linear;
    animatingTo = target;
    syncPressed();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      value = start + (target - start) * ease(progress);
      safeBoardUpdate(board);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        frame = undefined;
        animatingTo = undefined;
        syncPressed();
        // En el mismo fotograma: los efectos ven el estado final y el navegador pinta una sola vez.
        onComplete?.();
      }
    };
    frame = requestAnimationFrame(tick);
  };

  const press = () => {
    if (options.disabled) return;
    const { from, to } = nextButtonTarget(action, item.range.min, value, animatingTo);
    const releasing = to === item.range.min && action.behavior === 'toggle';
    runEffects(releasing ? 'release' : 'press');
    animateBetween(from, to, releasing ? undefined : () => runEffects('complete'));
  };

  element = board.create('button', [item.position[0], item.position[1], options.labelHtml, press], {
    fixed: true,
    layer: options.layer,
    cssClass: 'font-diagram diagram-control-button',
    highlightCssClass: 'font-diagram diagram-control-button',
    disabled: options.disabled,
  } as never) as unknown as DiagramButtonElement;

  element.__matematikaButton = true;
  element.Value = () => value;
  element.setValue = (next: number) => {
    stop();
    value = clamp(next);
    syncPressed();
  };
  element.setMax = (next: number) => {
    max = next;
    value = clamp(value);
  };
  element.animateTo = (target: number) => {
    if (action.behavior !== 'restart') {
      animateBetween(value, target);
      return;
    }
    // Un botón de reinicio modela un tiempo: nunca se rebobina, se reinicia y vuelve a correr.
    if (Math.abs(target - value) < 1e-9 && animatingTo === undefined) return;
    if (target <= item.range.min) element.setValue(target);
    else animateBetween(item.range.min, target);
  };
  element.resetValue = () => {
    stop();
    value = clamp(item.value);
    syncPressed();
  };
  element.play = (from?: number) => animateBetween(from ?? item.range.min, action.to);
  element.press = press;
  const originalRemove = (element as { remove?: () => void }).remove;
  (element as { remove?: () => void }).remove = function removeButton(this: unknown) {
    stop();
    originalRemove?.call(this);
  };
  syncPressed();
  return element;
}

function styleButton(node: HTMLButtonElement | undefined, theme: ThemeColors, item: ControlObject): void {
  if (!node) return;
  // Forma, glifo, hover y foco: `.diagram-control-button` en mdx-prose.css. Aquí solo el acento del control.
  node.style.setProperty('--diagram-button-accent', theme[item.color]);
  node.style.cursor = node.disabled ? 'default' : 'pointer';
}
