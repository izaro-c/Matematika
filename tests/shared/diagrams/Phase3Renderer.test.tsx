import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import primitivesFixture from '../../fixtures/diagrams/phase3-euclidean-primitives.json';
import curvesFixture from '../../fixtures/diagrams/phase3-curves.json';
import poincareFixture from '../../fixtures/diagrams/phase3-poincare.json';
import marksFixture from '../../fixtures/diagrams/phase3-marks-angles.json';
import measurementsFixture from '../../fixtures/diagrams/phase3-measurements.json';
import areasFixture from '../../fixtures/diagrams/phase3-area-grids.json';
import annotationsFixture from '../../fixtures/diagrams/phase3-annotations-layers.json';
import { migrateDiagramSpec } from '../../../src/shared/diagrams/public';

const rendererState = vi.hoisted(() => ({ createdKinds: [] as string[] }));

vi.mock('../../../src/shared/diagrams/core/MathBoard', () => ({
  MathBoard: ({ children, onInit, onUpdate }: { children?: React.ReactNode; onInit?: (board: unknown, elements: Record<string, unknown>, theme: Record<string, string>) => void; onUpdate?: (board: unknown, elements: Record<string, unknown>, theme: Record<string, string>, isStep: () => boolean, isHL: () => boolean) => void }) => {
    const elements: Record<string, any> = {};
    const number = (value: unknown, fallback = 0) => typeof value === 'function' ? fallback : typeof value === 'number' ? value : fallback;
    const board = {
      create: (kind: string, args: any[] = []) => {
        rendererState.createdKinds.push(kind);
        const geometry: any = {
          X: () => number(args[0]),
          Y: () => number(args[1]),
          Value: () => 1,
          Dist: (other: any) => Math.hypot(geometry.X() - other.X(), geometry.Y() - other.Y()),
          setAttribute: vi.fn(),
          on: vi.fn(),
          rendNode: document.createElement('span'),
        };
        return geometry;
      },
      on: vi.fn(),
      getAllObjectsUnderMouse: vi.fn(() => []),
      getUsrCoordsOfMouse: vi.fn(() => [0, 0]),
    };
    const theme = { carbon: 'carbon', terracota: 'terracota', salvia: 'salvia', pizarra: 'pizarra', ocre: 'ocre', pavo: 'pavo', granada: 'granada', musgo: 'musgo', lienzo: 'lienzo' };
    onInit?.(board, elements, theme);
    onUpdate?.(board, elements, theme, () => false, () => false);
    return <div data-testid="phase3-board">{children}</div>;
  },
}));

import { DiagramRenderer } from '../../../src/shared/diagrams/runtime/DiagramRenderer';

afterEach(() => {
  cleanup();
  rendererState.createdKinds.length = 0;
});

describe('Phase 3 shared renderer', () => {
  it.each([
    ['primitives', primitivesFixture, ['segment', 'line', 'polygon', 'circle', 'arc']],
    ['curves', curvesFixture, ['functiongraph', 'curve']],
    ['Poincaré', poincareFixture, ['circle', 'curve']],
    ['marks', marksFixture, ['angle', 'polygon', 'segment']],
    ['measurements', measurementsFixture, ['segment', 'text']],
    ['area grids', areasFixture, ['polygon', 'segment']],
    ['annotations', annotationsFixture, ['text']],
  ] as const)('renders %s through MathFactory-backed JSXGraph elements', (_family, fixture, expectedKinds) => {
    render(<DiagramRenderer spec={migrateDiagramSpec(fixture).spec} viewportControls={false} />);
    expectedKinds.forEach(kind => expect(rendererState.createdKinds).toContain(kind));
  });
});
