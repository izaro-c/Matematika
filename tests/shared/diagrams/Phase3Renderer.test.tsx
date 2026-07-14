import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import primitivesFixture from '../../fixtures/diagrams/phase3-euclidean-primitives.json';
import curvesFixture from '../../fixtures/diagrams/phase3-curves.json';
import poincareFixture from '../../fixtures/diagrams/phase3-poincare.json';
import marksFixture from '../../fixtures/diagrams/phase3-marks-angles.json';
import measurementsFixture from '../../fixtures/diagrams/phase3-measurements.json';
import areasFixture from '../../fixtures/diagrams/phase3-area-grids.json';
import annotationsFixture from '../../fixtures/diagrams/phase3-annotations-layers.json';
import { migrateDiagramSpec } from '../../../src/shared/diagrams/public';
import { MathProvider, useMathStore } from '../../../src/shared/lib/MathStoreContext';

const rendererState = vi.hoisted(() => ({ createdKinds: [] as string[], nodes: [] as HTMLElement[] }));

vi.mock('../../../src/shared/diagrams/core/MathBoard', () => ({
  MathBoard: ({ children, onInit, onUpdate }: { children?: React.ReactNode; onInit?: (board: unknown, elements: Record<string, unknown>, theme: Record<string, string>) => void; onUpdate?: (board: unknown, elements: Record<string, unknown>, theme: Record<string, string>, isStep: () => boolean, isHL: () => boolean) => void }) => {
    const elementsRef = React.useRef<Record<string, any>>({});
    const number = (value: unknown, fallback = 0) => typeof value === 'function' ? fallback : typeof value === 'number' ? value : fallback;
    const boardRef = React.useRef({
        create: (kind: string, args: any[] = []) => {
          rendererState.createdKinds.push(kind);
          const node = document.createElement('span');
          rendererState.nodes.push(node);
          let x = number(args[0]);
          let y = number(args[1]);
          let value = 1;
          const geometry: any = {
            X: () => x,
            Y: () => y,
            Value: () => value,
            moveTo: vi.fn(([nextX, nextY]: [number, number]) => { x = nextX; y = nextY; }),
            setValue: vi.fn((next: number) => { value = next; }),
            Dist: (other: any) => Math.hypot(geometry.X() - other.X(), geometry.Y() - other.Y()),
            setAttribute: vi.fn(),
            on: vi.fn(),
            rendNode: node,
          };
          return geometry;
        },
        on: vi.fn(),
        update: vi.fn(),
        getAllObjectsUnderMouse: vi.fn(() => []),
        getUsrCoordsOfMouse: vi.fn(() => [0, 0]),
      });
    const themeRef = React.useRef({ carbon: 'carbon', terracota: 'terracota', salvia: 'salvia', pizarra: 'pizarra', ocre: 'ocre', pavo: 'pavo', granada: 'granada', musgo: 'musgo', lienzo: 'lienzo' });
    React.useEffect(() => {
      onInit?.(boardRef.current, elementsRef.current, themeRef.current);
      onUpdate?.(boardRef.current, elementsRef.current, themeRef.current, () => false, () => false);
    }, [onInit, onUpdate]);
    return <div data-testid="phase3-board">{children}</div>;
  },
}));

import { DiagramRenderer } from '../../../src/shared/diagrams/runtime/DiagramRenderer';

afterEach(() => {
  cleanup();
  rendererState.createdKinds.length = 0;
  rendererState.nodes.length = 0;
});

function HighlightProbe() {
  const highlight = useMathStore(state => state.variables.highlight);
  return <output aria-label="highlight desde diagrama">{String(highlight ?? '')}</output>;
}

describe('Phase 3 shared renderer', () => {
  it('highlights the corresponding MDX target when a published diagram object is hovered or focused', () => {
    const spec = migrateDiagramSpec(primitivesFixture).spec;
    render(<MathProvider><DiagramRenderer spec={spec} viewportControls={false} /><HighlightProbe /></MathProvider>);
    const targetNode = rendererState.nodes.find(node => node.dataset.diagramTarget);
    expect(targetNode).toBeDefined();
    fireEvent.mouseEnter(targetNode as HTMLElement);
    expect(screen.getByLabelText('highlight desde diagrama').textContent).toBe(`${spec.componentId}:${targetNode?.dataset.diagramTarget}`);
    fireEvent.mouseLeave(targetNode as HTMLElement);
    expect(screen.getByLabelText('highlight desde diagrama').textContent).toBe('');
  });

  it('exposes movable points to the keyboard and reports their constrained coordinates', () => {
    const spec = migrateDiagramSpec(primitivesFixture).spec;
    const onPointMove = vi.fn();
    render(<MathProvider><DiagramRenderer spec={spec} viewportControls={false} onPointMove={onPointMove} /></MathProvider>);
    const pointNode = rendererState.nodes.find(node => node.getAttribute('aria-roledescription') === 'punto móvil del diagrama');

    expect(pointNode).toBeDefined();
    expect(pointNode?.getAttribute('tabindex')).toBe('0');
    fireEvent.keyDown(pointNode as HTMLElement, { key: 'ArrowRight' });
    expect(onPointMove).toHaveBeenCalledTimes(1);
    expect(pointNode?.getAttribute('aria-label')).toMatch(/x -?\d+\.\d{2}, y -?\d+\.\d{2}/);
  });

  it.each([
    ['primitives', primitivesFixture, ['segment', 'line', 'polygon', 'circle', 'arc']],
    ['curves', curvesFixture, ['functiongraph', 'curve']],
    ['Poincaré', poincareFixture, ['circle', 'curve']],
    ['marks', marksFixture, ['angle', 'polygon', 'segment']],
    ['measurements', measurementsFixture, ['segment', 'text']],
    ['area grids', areasFixture, ['polygon', 'segment']],
    ['annotations', annotationsFixture, ['text']],
  ] as const)('renders %s through MathFactory-backed JSXGraph elements', (_family, fixture, expectedKinds) => {
    render(
      <MathProvider>
        <DiagramRenderer spec={migrateDiagramSpec(fixture).spec} viewportControls={false} />
      </MathProvider>,
    );
    expectedKinds.forEach(kind => expect(rendererState.createdKinds).toContain(kind));
  });
});
