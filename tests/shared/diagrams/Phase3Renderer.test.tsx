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

const rendererState = vi.hoisted(() => ({
  createdKinds: [] as string[],
  createdOptions: [] as Array<{ kind: string; args: any[]; options: Record<string, unknown> }>,
  nodes: [] as HTMLElement[],
  labelNodes: [] as HTMLElement[],
  geometries: [] as any[],
  boardHandlers: {} as Record<string, Array<(event?: unknown) => void>>,
}));

vi.mock('../../../src/shared/diagrams/core/MathBoard', () => ({
  MathBoard: ({ children, onInit, onUpdate, scopeId = '' }: { children?: React.ReactNode; onInit?: (board: unknown, elements: Record<string, unknown>, theme: Record<string, string>) => void; onUpdate?: (board: unknown, elements: Record<string, unknown>, theme: Record<string, string>, isStep: () => boolean, isHL: (target: string) => boolean) => void; scopeId?: string }) => {
    const elementsRef = React.useRef<Record<string, any>>({});
    const highlight = useMathStore(state => state.variables?.[scopeId ? `highlight:${scopeId}` : 'highlight'] ?? state.variables?.highlight);
    const number = (value: unknown, fallback = 0) => typeof value === 'function' ? fallback : typeof value === 'number' ? value : fallback;
    const boardRef = React.useRef({
        create: (kind: string, args: any[] = [], options: Record<string, unknown> = {}) => {
          rendererState.createdKinds.push(kind);
          rendererState.createdOptions.push({ kind, args, options });
          const node = document.createElement('span');
          rendererState.nodes.push(node);
          const labelNode = document.createElement('span');
          const labelHandlers: Record<string, Array<(event?: unknown) => void>> = {};
          let x = number(args[0]);
          let y = number(args[1]);
          if (kind === 'intersection') {
            const first = args[0];
            const second = args[1];
            const a = first?.point1;
            const b = first?.point2;
            const c = second?.point1;
            const d = second?.point2;
            if (a && b && c && d) {
              const abX = b.X() - a.X();
              const abY = b.Y() - a.Y();
              const cdX = d.X() - c.X();
              const cdY = d.Y() - c.Y();
              const denominator = abX * cdY - abY * cdX;
              const parameter = ((c.X() - a.X()) * cdY - (c.Y() - a.Y()) * cdX) / denominator;
              x = a.X() + parameter * abX;
              y = a.Y() + parameter * abY;
            }
          }
          let value = 1;
          const handlers: Record<string, Array<(event?: unknown) => void>> = {};
          const geometry: any = {
            X: () => x,
            Y: () => y,
            Value: () => value,
            moveTo: vi.fn(([nextX, nextY]: [number, number]) => { x = nextX; y = nextY; }),
            setValue: vi.fn((next: number) => { value = next; }),
            Dist: (other: any) => Math.hypot(geometry.X() - other.X(), geometry.Y() - other.Y()),
            setAttribute: vi.fn(),
            highlight: vi.fn(),
            noHighlight: vi.fn(),
            on: vi.fn((eventName: string, handler: (event?: unknown) => void) => {
              handlers[eventName] = [...(handlers[eventName] ?? []), handler];
            }),
            handlers,
            rendNode: node,
          };
          if (args[0]?.X && args[1]?.X && kind !== 'intersection') {
            geometry.point1 = args[0];
            geometry.point2 = args[1];
          }
          if (options.name) {
            geometry.label = {
              setAttribute: vi.fn(),
              setText: vi.fn(),
              highlight: vi.fn(),
              noHighlight: vi.fn(),
              on: vi.fn((eventName: string, handler: (event?: unknown) => void) => {
                labelHandlers[eventName] = [...(labelHandlers[eventName] ?? []), handler];
              }),
              handlers: labelHandlers,
              rendNode: labelNode,
            };
            rendererState.labelNodes.push(labelNode);
          }
          rendererState.geometries.push(geometry);
          return geometry;
        },
        on: vi.fn((eventName: string, handler: (event?: unknown) => void) => {
          rendererState.boardHandlers[eventName] = [...(rendererState.boardHandlers[eventName] ?? []), handler];
        }),
        update: vi.fn(),
        getAllObjectsUnderMouse: vi.fn(() => []),
        getUsrCoordsOfMouse: vi.fn(() => [0, 0]),
        getBoundingBox: vi.fn(() => [-4, 4, 4, -4]),
      });
    const themeRef = React.useRef({ carbon: 'carbon', terracota: 'terracota', salvia: 'salvia', pizarra: 'pizarra', ocre: 'ocre', pavo: 'pavo', granada: 'granada', musgo: 'musgo', lienzo: 'lienzo' });
    const onInitRef = React.useRef(onInit);
    onInitRef.current = onInit;
    React.useEffect(() => {
      onInitRef.current?.(boardRef.current, elementsRef.current, themeRef.current);
    }, []);
    React.useEffect(() => {
      const isHL = (target: string) => highlight === target || highlight === `${scopeId}:${target}`;
      onUpdate?.(boardRef.current, elementsRef.current, themeRef.current, () => false, isHL);
    }, [highlight, onUpdate, scopeId]);
    return <div data-testid="phase3-board">{children}</div>;
  },
}));

import { DiagramRenderer } from '../../../src/shared/diagrams/runtime/DiagramRenderer';
import { Incidence2Spec } from '../../../src/widgets/diagrams/Axiomas/Incidence2';
import { Congruence1Spec } from '../../../src/widgets/diagrams/Axiomas/Congruence1';
import { PaschSpec } from '../../../src/widgets/diagrams/Axiomas/Pasch';
import { AxiomaArquimedesSpec } from '../../../src/widgets/diagrams/Axiomas/AxiomaArquimedes';
import { addLabelToElement } from '../../../src/features/editor/diagrams/model/commands';

afterEach(() => {
  cleanup();
  rendererState.createdKinds.length = 0;
  rendererState.createdOptions.length = 0;
  rendererState.nodes.length = 0;
  rendererState.labelNodes.length = 0;
  rendererState.geometries.length = 0;
  Object.keys(rendererState.boardHandlers).forEach(key => delete rendererState.boardHandlers[key]);
});

function HighlightProbe() {
  const highlight = useMathStore(state => state.variables.highlight);
  return <output aria-label="highlight desde diagrama">{String(highlight ?? '')}</output>;
}

function ExternalHighlightControl({ value }: { value: string }) {
  const setVariable = useMathStore(state => state.setVariable);
  return <button type="button" onClick={() => setVariable('highlight', value)}>Resaltar desde MDX</button>;
}

describe('Phase 3 shared renderer', () => {
  it('keeps constructed sides selectable but immovable so constraints cannot be bypassed', () => {
    const spec = migrateDiagramSpec(primitivesFixture).spec;
    const onSelectionChange = vi.fn();
    render(
      <MathProvider>
        <DiagramRenderer spec={spec} mode="editor" viewportControls={false} onSelectionChange={onSelectionChange} />
      </MathProvider>,
    );

    const segmentIndex = rendererState.nodes.findIndex(node => node.dataset.diagramObjectId === 'segAB');
    const segment = rendererState.geometries[segmentIndex];
    expect(rendererState.createdOptions[segmentIndex]?.options.fixed).toBe(true);
    expect(segment.setAttribute).toHaveBeenCalledWith(expect.objectContaining({ fixed: true }));

    segment.handlers.down[0]();
    expect(onSelectionChange).toHaveBeenCalledWith('segAB');

    const movablePoint = spec.points.find(point => !point.fixed && point.selection.selectable)!;
    const pointIndex = rendererState.nodes.findIndex(node => node.dataset.diagramObjectId === movablePoint.id);
    expect(rendererState.createdOptions[pointIndex]?.options.fixed).toBe(false);
    expect(rendererState.geometries[pointIndex].setAttribute).toHaveBeenCalledWith(expect.objectContaining({ fixed: false }));
  });

  it('keeps local hover disabled while allowing explicit MDX emphasis', () => {
    const base = migrateDiagramSpec(primitivesFixture).spec;
    const target = base.points.find(point => !point.fixed && point.target)!;
    const spec = {
      ...base,
      points: base.points.map(point => point.id === target.id
        ? { ...point, selection: { ...point.selection, selectable: true, highlightable: false } }
        : point),
    };
    const onSelectionChange = vi.fn();
    render(
      <MathProvider>
        <DiagramRenderer spec={spec} mode="editor" viewportControls={false} onSelectionChange={onSelectionChange} />
        <HighlightProbe />
        <ExternalHighlightControl value={`${spec.componentId}:${target.targetId ?? target.id}`} />
      </MathProvider>,
    );

    const pointIndex = rendererState.nodes.findIndex(node => node.dataset.diagramObjectId === target.id);
    const point = rendererState.geometries[pointIndex];
    const creation = rendererState.createdOptions[pointIndex];
    expect(creation.options).toMatchObject({
      highlight: false,
      highlightFillColor: target.color,
      highlightStrokeColor: target.color,
      label: expect.objectContaining({ highlight: false, highlightColor: target.color, highlightStrokeColor: target.color }),
    });
    expect(point.setAttribute).toHaveBeenCalledWith(expect.objectContaining({
      size: target.style?.pointSize ?? 4,
      fillColor: target.color,
      strokeColor: target.color,
      fillOpacity: 1,
    }));
    expect(point.handlers.over).toBeUndefined();

    point.handlers.down[0]();
    expect(onSelectionChange).toHaveBeenCalledWith(target.id);
    fireEvent.mouseEnter(rendererState.nodes[pointIndex]);
    expect(screen.getByLabelText('highlight desde diagrama').textContent).toBe('');

    fireEvent.click(screen.getByRole('button', { name: 'Resaltar desde MDX' }));
    expect(point.setAttribute).toHaveBeenLastCalledWith(expect.objectContaining({
      size: target.style?.highlightPointSize ?? 7,
      fillColor: 'ocre',
      strokeColor: 'ocre',
      fillOpacity: 1,
    }));
  });

  it('renders exact intersections and keeps them on finite authored supports', () => {
    const base = migrateDiagramSpec(primitivesFixture).spec;
    const line = {
      ...base.elements.find(item => item.id === 'lineBC')!,
      id: 'lineOC',
      label: 'Recta OC',
      refs: ['pO', 'pC'],
      target: false,
    };
    const intersection = {
      ...base.elements.find(item => item.id === 'segAB')!,
      id: 'intQ',
      label: 'Q',
      kind: 'intersection' as const,
      refs: ['lineOC', 'segAB'],
      order: 80,
      locked: true,
      target: false,
      properties: { restrictToSupports: true },
      style: { pointSize: 5, highlightPointSize: 8 },
    };
    const spec = { ...base, elements: [...base.elements, line, intersection] };

    render(<MathProvider><DiagramRenderer spec={spec} viewportControls={false} /></MathProvider>);

    const rendered = rendererState.createdOptions.find(item => item.kind === 'intersection');
    expect(rendered?.options).toMatchObject({ name: 'Q', fixed: true, size: 5 });
    const geometryIndex = rendererState.createdOptions.findIndex(item => item.kind === 'intersection');
    expect(rendererState.geometries[geometryIndex].setAttribute).toHaveBeenCalledWith(expect.objectContaining({ visible: true, size: 5 }));
  });

  it('hides a restricted intersection when the carrier meets only the extension of a segment', () => {
    const base = migrateDiagramSpec(primitivesFixture).spec;
    const line = { ...base.elements.find(item => item.id === 'lineBC')!, id: 'lineOC', label: 'Recta OC', refs: ['pO', 'pC'], target: false };
    const intersection = {
      ...base.elements.find(item => item.id === 'segAB')!,
      id: 'intQ', label: 'Q', kind: 'intersection' as const, refs: ['lineOC', 'segAB'], order: 80,
      locked: true, target: false, properties: { restrictToSupports: true },
    };
    const spec = {
      ...base,
      points: base.points.map(point => point.id === 'pC' ? { ...point, y: 1 } : point),
      elements: [...base.elements, line, intersection],
    };

    render(<MathProvider><DiagramRenderer spec={spec} viewportControls={false} /></MathProvider>);

    const geometryIndex = rendererState.createdOptions.findIndex(item => item.kind === 'intersection');
    expect(rendererState.geometries[geometryIndex].setAttribute).toHaveBeenCalledWith(expect.objectContaining({ visible: false }));
  });

  it('shows exactly one exit point Q on the two candidate sides of Pasch', () => {
    render(<MathProvider><DiagramRenderer spec={PaschSpec} viewportControls={false} /></MathProvider>);

    const intersectionIndexes = rendererState.createdOptions
      .map((item, index) => item.kind === 'intersection' ? index : -1)
      .filter(index => index >= 0);
    expect(intersectionIndexes).toHaveLength(2);
    const visibilities = intersectionIndexes.map(index => {
      const calls = rendererState.geometries[index].setAttribute.mock.calls;
      return calls.at(-1)?.[0]?.visible;
    });
    expect(visibilities.filter(Boolean)).toHaveLength(1);
  });

  it('renders incidence points as movable gliders on their supporting line', () => {
    render(<MathProvider><DiagramRenderer spec={Incidence2Spec} viewportControls={false} /></MathProvider>);

    const gliders = rendererState.createdOptions.filter(item => item.kind === 'glider');
    expect(gliders).toHaveLength(2);
    expect(gliders.every(item => item.options.fixed === false)).toBe(true);
    expect(rendererState.nodes.filter(node => node.getAttribute('aria-roledescription') === 'punto móvil del diagrama')).toHaveLength(2);
  });

  it('propagates equal segment lengths live while a source endpoint is dragged', () => {
    render(<MathProvider><DiagramRenderer spec={Congruence1Spec} viewportControls={false} /></MathProvider>);
    const pointDCreation = rendererState.createdOptions.find((item, index) => (
      item.kind === 'glider' && rendererState.nodes[index]?.dataset.diagramObjectId === 'pD'
    ));
    expect(pointDCreation).toBeDefined();
    const geometryFor = (id: string) => {
      const index = rendererState.nodes.findIndex(node => node.dataset.diagramObjectId === id);
      return rendererState.geometries[index];
    };
    const pointA = geometryFor('pA');
    const pointB = geometryFor('pB');
    const pointC = geometryFor('pC');
    const pointD = geometryFor('pD');

    pointA.moveTo([-8, 2], 0);
    pointA.handlers.drag[0]();

    expect(pointC.Dist(pointD)).toBeCloseTo(pointA.Dist(pointB));

    pointD.moveTo([2, 4], 0);
    pointD.handlers.drag[0]();
    const pointDir = geometryFor('pDir');
    const rayX = pointDir.X() - pointC.X();
    const rayY = pointDir.Y() - pointC.Y();
    const cdX = pointD.X() - pointC.X();
    const cdY = pointD.Y() - pointC.Y();
    expect(rayX * cdY - rayY * cdX).toBeCloseTo(0);
    expect(pointC.Dist(pointD)).toBeCloseTo(pointA.Dist(pointB));
  });

  it('blocks direct interaction without making a point immovable for relations', () => {
    const spec = {
      ...Congruence1Spec,
      points: Congruence1Spec.points.map(point => point.id === 'pD'
        ? { ...point, selection: { ...point.selection, selectable: false, highlightable: true } }
        : point),
    };
    const onSelectionChange = vi.fn();
    const onPointMove = vi.fn();
    render(
      <MathProvider>
        <DiagramRenderer
          spec={spec}
          mode="editor"
          viewportControls={false}
          onSelectionChange={onSelectionChange}
          onPointMove={onPointMove}
        />
        <HighlightProbe />
      </MathProvider>,
    );
    const geometryFor = (id: string) => {
      const index = rendererState.nodes.findIndex(node => node.dataset.diagramObjectId === id);
      return {
        creation: rendererState.createdOptions[index],
        geometry: rendererState.geometries[index],
        node: rendererState.nodes[index],
      };
    };
    const pointA = geometryFor('pA');
    const pointB = geometryFor('pB');
    const pointC = geometryFor('pC');
    const pointD = geometryFor('pD');

    expect(pointD.creation.options.fixed).toBe(true);
    expect(pointD.geometry.handlers.down).toBeUndefined();
    expect(pointD.geometry.handlers.drag).toBeUndefined();
    expect(pointD.geometry.handlers.up).toBeUndefined();
    expect(pointD.node.getAttribute('tabindex')).toBe('0');
    expect(pointD.node.getAttribute('aria-keyshortcuts')).toBeNull();
    fireEvent.focus(pointD.node);
    expect(screen.getByLabelText('highlight desde diagrama').textContent).toBe(`${spec.componentId}:pD`);
    fireEvent.keyDown(pointD.node, { key: 'Enter' });
    expect(onSelectionChange).not.toHaveBeenCalled();
    expect(onPointMove).not.toHaveBeenCalled();

    pointA.geometry.moveTo([-8, 2], 0);
    pointA.geometry.handlers.drag[0]();

    expect(pointD.geometry.moveTo).toHaveBeenCalled();
    expect(pointC.geometry.Dist(pointD.geometry)).toBeCloseTo(pointA.geometry.Dist(pointB.geometry));
    expect(spec.points.find(point => point.id === 'pD')).toMatchObject({
      fixed: false,
      selection: { selectable: false, highlightable: true },
    });
  });

  it('uses the dedicated mathematical typography for diagram labels and headings', () => {
    const spec = migrateDiagramSpec(primitivesFixture).spec;
    render(<MathProvider><DiagramRenderer spec={spec} viewportControls={false} /></MathProvider>);

    const labelledPoint = rendererState.createdOptions.find(item => item.kind === 'point' && item.options.name);
    expect(labelledPoint?.options).toMatchObject({
      highlightSize: 6,
      highlightFillColor: 'ocre',
      highlightStrokeColor: 'ocre',
      label: {
        fontSize: 19,
        cssClass: expect.stringContaining('matematika-point-label'),
        highlightCssClass: expect.stringContaining('matematika-point-label--highlight'),
        cssDefaultStyle: 'font-family: var(--font-diagram-family);',
        highlightCssDefaultStyle: 'font-family: var(--font-diagram-family);',
        highlightStrokeColor: 'ocre',
      },
    });
    expect(screen.getByText(spec.title).className).toContain('font-diagram');
  });

  it('uses the current point-creation callback after the editor tool changes', () => {
    const spec = migrateDiagramSpec(primitivesFixture).spec;
    const onCanvasPointCreate = vi.fn();
    const view = render(<MathProvider><DiagramRenderer spec={spec} mode="editor" viewportControls={false} /></MathProvider>);

    expect(rendererState.boardHandlers.down).toHaveLength(1);
    view.rerender(<MathProvider><DiagramRenderer spec={spec} mode="editor" viewportControls={false} onCanvasPointCreate={onCanvasPointCreate} /></MathProvider>);
    rendererState.boardHandlers.down[0]({});

    expect(onCanvasPointCreate).toHaveBeenCalledWith(0, 0);
  });

  it('uses the current selection callback while a multi-reference tool is active', () => {
    const spec = migrateDiagramSpec(primitivesFixture).spec;
    const initialSelection = vi.fn();
    const toolSelection = vi.fn();
    const view = render(<MathProvider><DiagramRenderer spec={spec} mode="editor" viewportControls={false} onSelectionChange={initialSelection} /></MathProvider>);
    const pointIndex = rendererState.nodes.findIndex(node => node.getAttribute('aria-roledescription') === 'punto móvil del diagrama');
    const pointId = rendererState.nodes[pointIndex]?.dataset.diagramObjectId;

    view.rerender(<MathProvider><DiagramRenderer spec={spec} mode="editor" viewportControls={false} onSelectionChange={toolSelection} /></MathProvider>);
    rendererState.geometries[pointIndex].handlers.down[0]();

    expect(initialSelection).not.toHaveBeenCalled();
    expect(toolSelection).toHaveBeenCalledWith(pointId);
  });

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

  it('keeps local hover additive while MDX references dim the rest by default', () => {
    const spec = migrateDiagramSpec(primitivesFixture).spec;
    const target = spec.points.find(point => point.target)!;
    const other = spec.points.find(point => point.id !== target.id)!;
    render(
      <MathProvider>
        <DiagramRenderer spec={spec} viewportControls={false} />
        <ExternalHighlightControl value={`${spec.componentId}:${target.targetId ?? target.id}`} />
      </MathProvider>,
    );
    const targetIndex = rendererState.nodes.findIndex(node => node.dataset.diagramObjectId === target.id);
    const otherIndex = rendererState.nodes.findIndex(node => node.dataset.diagramObjectId === other.id);
    const otherPoint = rendererState.geometries[otherIndex];

    fireEvent.mouseEnter(rendererState.nodes[targetIndex]);
    expect(otherPoint.setAttribute.mock.calls.at(-1)?.[0]).toMatchObject({ fillOpacity: 1 });
    fireEvent.mouseLeave(rendererState.nodes[targetIndex]);

    fireEvent.click(screen.getByRole('button', { name: 'Resaltar desde MDX' }));
    expect(otherPoint.setAttribute.mock.calls.at(-1)?.[0]).toMatchObject({ fillOpacity: 0.28 });
  });

  it('supports additive highlighting for an MDX target when authored in the editor', () => {
    const base = migrateDiagramSpec(primitivesFixture).spec;
    const target = base.points.find(point => point.target)!;
    const other = base.points.find(point => point.id !== target.id)!;
    const spec = {
      ...base,
      points: base.points.map(point => point.id === target.id
        ? { ...point, selection: { ...point.selection, dimOthersOnHighlight: false } }
        : point),
    };
    render(
      <MathProvider>
        <DiagramRenderer spec={spec} viewportControls={false} />
        <ExternalHighlightControl value={`${spec.componentId}:${target.targetId ?? target.id}`} />
      </MathProvider>,
    );
    const otherIndex = rendererState.nodes.findIndex(node => node.dataset.diagramObjectId === other.id);
    const otherPoint = rendererState.geometries[otherIndex];

    fireEvent.click(screen.getByRole('button', { name: 'Resaltar desde MDX' }));
    expect(otherPoint.setAttribute.mock.calls.at(-1)?.[0]).toMatchObject({ fillOpacity: 1 });
  });

  it('keeps a native label interactive and visually synchronized with its point', () => {
    const base = migrateDiagramSpec(primitivesFixture).spec;
    const target = base.points.find(point => point.target) ?? base.points[0];
    const spec = {
      ...base,
      points: base.points.map(point => point.id === target.id
        ? { ...point, style: { ...point.style, labelSize: 23, preserveColorOnHighlight: true } }
        : point),
    };
    const preservedColor = target.color;
    render(
      <MathProvider>
        <DiagramRenderer spec={spec} highlightedIds={[target.id]} viewportControls={false} />
        <HighlightProbe />
      </MathProvider>,
    );

    const pointIndex = rendererState.nodes.findIndex(node => node.dataset.diagramObjectId === target.id);
    const point = rendererState.geometries[pointIndex];
    const pointCreation = rendererState.createdOptions.find(item => item.options.name === target.label);
    expect(pointCreation?.options).toMatchObject({
      highlightFillColor: preservedColor,
      highlightStrokeColor: preservedColor,
      label: { fontSize: 23, highlightColor: preservedColor, highlightStrokeColor: preservedColor },
    });
    expect(point.label.setAttribute).toHaveBeenCalledWith(expect.objectContaining({
      visible: true,
      color: preservedColor,
      highlightColor: preservedColor,
      opacity: 1,
    }));
    expect(point.label.setText).toHaveBeenCalledWith(target.label);
    expect(point.label.rendNode.dataset.diagramLabelFor).toBe(target.id);

    point.handlers.over[0]();
    expect(point.setAttribute).toHaveBeenCalledWith({ size: 6 });
    expect(point.highlight).toHaveBeenCalled();
    expect(point.label.highlight).toHaveBeenCalled();
    expect(point.label.rendNode.classList).toContain('matematika-point-label--highlight');
    expect(point.label.rendNode.style.transform).toBe('scale(1.12)');
    point.handlers.out[0]();
    expect(point.setAttribute).toHaveBeenCalledWith({ size: 4 });
    expect(point.noHighlight).toHaveBeenCalled();
    expect(point.label.noHighlight).toHaveBeenCalled();
    expect(point.label.rendNode.classList).not.toContain('matematika-point-label--highlight');
    expect(point.label.rendNode.style.transform).toBe('');

    point.label.handlers.over[0]();
    expect(point.highlight).toHaveBeenCalledTimes(2);
    expect(point.label.highlight).toHaveBeenCalledTimes(2);
    point.label.handlers.out[0]();
    expect(point.noHighlight).toHaveBeenCalledTimes(2);
    expect(point.label.noHighlight).toHaveBeenCalledTimes(2);

    fireEvent.mouseEnter(point.label.rendNode);
    expect(screen.getByLabelText('highlight desde diagrama').textContent).toBe(`${spec.componentId}:${target.targetId ?? target.id}`);
    fireEvent.mouseLeave(point.label.rendNode);
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

  it('reveals a hidden object while its highlight is previewed in the editor', () => {
    const base = migrateDiagramSpec(primitivesFixture).spec;
    const target = base.points[0];
    const spec = { ...base, points: base.points.map(point => point.id === target.id ? { ...point, visible: false } : point) };
    render(<MathProvider><DiagramRenderer spec={spec} mode="editor" highlightedIds={[target.id]} viewportControls={false} /></MathProvider>);
    const nodeIndex = rendererState.nodes.findIndex(node => node.getAttribute('aria-label') === (target.selection.ariaLabel ?? target.label));
    expect(nodeIndex).toBeGreaterThanOrEqual(0);
    expect(rendererState.geometries[nodeIndex].setAttribute).toHaveBeenCalledWith(expect.objectContaining({ visible: true }));
    expect(rendererState.geometries[nodeIndex].label.setAttribute).toHaveBeenCalledWith(expect.objectContaining({ visible: true }));
  });

  it.each([
    ['primitives', primitivesFixture, ['segment', 'line', 'polygon', 'circle', 'arc']],
    ['curves', curvesFixture, ['functiongraph', 'curve']],
    ['Poincaré', poincareFixture, ['circle', 'curve']],
    ['marks', marksFixture, ['angle', 'nonreflexangle', 'polygon', 'segment', 'ticks']],
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

  it('renders angles without an authored radius using the canonical default', () => {
    render(<MathProvider><DiagramRenderer spec={migrateDiagramSpec(marksFixture).spec} viewportControls={false} /></MathProvider>);

    const renderedAngle = rendererState.createdOptions.find(({ kind }) => kind === 'angle');
    const renderedNonReflexAngle = rendererState.createdOptions.find(({ kind }) => kind === 'nonreflexangle');
    expect(renderedAngle?.options.radius).toBe(0.55);
    expect(renderedNonReflexAngle?.options.radius).toBe(0.55);
  });

  it('renders measure ticks as repeated ruler graduations while keeping congruence marks separate', () => {
    render(<MathProvider><DiagramRenderer spec={migrateDiagramSpec(marksFixture).spec} viewportControls={false} /></MathProvider>);

    const renderedTicks = rendererState.createdOptions.find(({ kind }) => kind === 'ticks');
    expect(renderedTicks?.args).toHaveLength(1);
    expect(renderedTicks?.options).toMatchObject({
      insertTicks: false,
      ticksDistance: 2,
      minorTicks: 4,
      drawLabels: false,
      majorHeight: 12,
    });
    expect(renderedTicks?.options.minorHeight).toBeCloseTo(4.8);
    const centralCongruenceSegments = rendererState.createdOptions.filter(({ kind, options }) => (
      kind === 'segment' && options.strokeColor === 'terracota'
    ));
    expect(centralCongruenceSegments.length).toBeGreaterThanOrEqual(2);
    const hiddenCongruencePoints = rendererState.createdOptions.filter(({ kind, options }) => (
      kind === 'point' && options.visible === false
    ));
    const hiddenCoordinates = hiddenCongruencePoints.map(point => [point.args[0](), point.args[1]()] as const);
    expect(hiddenCoordinates.some((first, index) => hiddenCoordinates.slice(index + 1).some(second => (
      Math.hypot(second[0] - first[0], second[1] - first[1]) >= 0.395
      && Math.hypot(second[0] - first[0], second[1] - first[1]) <= 0.405
    )))).toBe(true);
  });

  it('renders the Archimedean slider and copy graduations from live expressions with keyboard access', () => {
    render(<MathProvider><DiagramRenderer spec={AxiomaArquimedesSpec} viewportControls={false} /></MathProvider>);

    const sliderCreation = rendererState.createdOptions.find(({ kind }) => kind === 'slider');
    expect(sliderCreation?.args[2]).toEqual([1, 4, 7]);
    const sliderNode = rendererState.nodes.find(node => node.dataset.diagramObjectId === 'n');
    expect(sliderNode?.getAttribute('role')).toBe('slider');
    expect(sliderNode?.getAttribute('aria-valuemax')).toBe('7');
    fireEvent.keyDown(sliderNode as HTMLElement, { key: 'End' });
    const sliderIndex = rendererState.nodes.findIndex(node => node === sliderNode);
    expect(rendererState.geometries[sliderIndex].setValue).toHaveBeenCalledWith(7);

    const ticks = rendererState.createdOptions.find(({ kind, options }) => kind === 'ticks' && options.ticksDistance === 1);
    expect(ticks?.options.ticksDistance).toBe(1);
  });

  it('applies the dashed style to polygon borders', () => {
    const base = migrateDiagramSpec(primitivesFixture).spec;
    const polygon = base.elements.find(item => item.kind === 'polygon');
    const spec = {
      ...base,
      elements: base.elements.map(item => item.id === polygon?.id ? { ...item, dashed: true } : item),
    };

    render(<MathProvider><DiagramRenderer spec={spec} viewportControls={false} /></MathProvider>);

    const renderedPolygon = rendererState.createdOptions.find(({ kind }) => kind === 'polygon');
    expect(renderedPolygon?.options).toMatchObject({ borders: { dash: 2 } });
  });

  it('keeps information panels in their editorial hover style at rest and on hover', () => {
    render(
      <MathProvider>
        <DiagramRenderer spec={migrateDiagramSpec(annotationsFixture).spec} viewportControls={false} />
      </MathProvider>,
    );
    const panel = rendererState.createdOptions.find(({ kind, options }) => kind === 'text' && String(options.cssClass).includes('matematika-info-panel'));
    expect(panel?.options).toMatchObject({
      cssClass: 'JXGtext matematika-info-panel',
      highlightCssClass: 'JXGtext matematika-info-panel',
      highlightStrokeOpacity: 1,
    });
  });

  it('anchors an information panel to normalized viewport coordinates without a geometric reference', () => {
    const spec = migrateDiagramSpec(annotationsFixture).spec;
    const viewportPanelSpec = {
      ...spec,
      elements: spec.elements.map(item => item.id === 'panelA'
        ? { ...item, refs: [], properties: { ...item.properties, anchorMode: 'viewport' as const, viewportPosition: [0.25, 0.2] as [number, number] } }
        : item),
    };
    render(<MathProvider><DiagramRenderer spec={viewportPanelSpec} viewportControls={false} /></MathProvider>);
    const panel = rendererState.createdOptions.find(({ kind, options }) => kind === 'text' && String(options.cssClass).includes('matematika-info-panel'));
    expect(panel).toBeDefined();
    expect((panel?.args[0] as () => number)()).toBe(-2);
    expect((panel?.args[1] as () => number)()).toBeCloseTo(2.4);
    expect(panel?.options).toMatchObject({ anchorX: 'left', anchorY: 'top' });
  });

  it('turns viewport panel anchors inward near the lower-right edge', () => {
    const spec = migrateDiagramSpec(annotationsFixture).spec;
    const viewportPanelSpec = {
      ...spec,
      elements: spec.elements.map(item => item.id === 'panelA'
        ? { ...item, refs: [], properties: { ...item.properties, anchorMode: 'viewport' as const, viewportPosition: [0.9, 0.85] as [number, number] } }
        : item),
    };
    render(<MathProvider><DiagramRenderer spec={viewportPanelSpec} viewportControls={false} /></MathProvider>);
    const panel = rendererState.createdOptions.find(({ kind, options }) => kind === 'text' && String(options.cssClass).includes('matematika-info-panel'));
    expect(panel?.options).toMatchObject({ anchorX: 'right', anchorY: 'bottom' });
  });

  it('anchors an authored label close to the referenced element at the chosen parameter', () => {
    const base = migrateDiagramSpec(primitivesFixture).spec;
    const source = base.elements.find(item => item.kind === 'segment')!;
    const labelled = addLabelToElement(base, source.id);
    const labelModel = {
      ...labelled.model,
      elements: labelled.model.elements.map(item => item.id === labelled.labelId
        ? { ...item, style: { ...item.style, labelSize: 17 }, properties: { ...item.properties, anchorParameter: 0.25 } }
        : item),
    };
    render(<MathProvider><DiagramRenderer spec={labelModel} viewportControls={false} /></MathProvider>);

    const renderedLabel = rendererState.createdOptions.find(({ kind, options }) => kind === 'text' && options.cssClass === 'font-diagram text-sm');
    expect(renderedLabel?.options.fontSize).toBe(17);
    const start = base.points.find(point => point.id === source.refs[0])!;
    const end = base.points.find(point => point.id === source.refs[1])!;
    expect((renderedLabel?.args[0] as () => number)()).toBeCloseTo(start.x + (end.x - start.x) * 0.25 + 0.04);
    expect((renderedLabel?.args[1] as () => number)()).toBeCloseTo(start.y + (end.y - start.y) * 0.25 + 0.04);
  });

  it('hides authored and native labels together when labels are disabled', () => {
    const base = migrateDiagramSpec(primitivesFixture).spec;
    const source = base.elements.find(item => item.kind === 'segment')!;
    const labelled = addLabelToElement(base, source.id);
    render(<MathProvider><DiagramRenderer spec={{ ...labelled.model, showLabels: false }} viewportControls={false} /></MathProvider>);

    const textIndex = rendererState.createdOptions.findIndex(({ kind, options }) => kind === 'text' && options.cssClass === 'font-diagram text-sm');
    expect(rendererState.geometries[textIndex].setAttribute).toHaveBeenCalledWith(expect.objectContaining({ visible: false }));
    expect(rendererState.geometries.some(geometry => geometry.label?.setAttribute.mock.calls.some((call: unknown[]) => (
      typeof call[0] === 'object' && call[0] !== null && (call[0] as { visible?: boolean }).visible === false
    )))).toBe(true);
  });

  it('hides one point label without hiding the point or the other labels', () => {
    const base = migrateDiagramSpec(primitivesFixture).spec;
    const target = base.points.find(point => point.visible)!;
    const spec = {
      ...base,
      points: base.points.map(point => point.id === target.id ? { ...point, showLabel: false } : point),
    };
    render(<MathProvider><DiagramRenderer spec={spec} viewportControls={false} /></MathProvider>);

    const pointIndex = rendererState.nodes.findIndex(node => node.dataset.diagramObjectId === target.id);
    const point = rendererState.geometries[pointIndex];
    expect(point.setAttribute).toHaveBeenCalledWith(expect.objectContaining({ visible: true }));
    expect(point.label.setAttribute).toHaveBeenCalledWith(expect.objectContaining({ visible: false }));
    expect(rendererState.geometries.some(geometry => geometry !== point && geometry.label?.setAttribute.mock.calls.some((call: unknown[]) => (
      typeof call[0] === 'object' && call[0] !== null && (call[0] as { visible?: boolean }).visible === true
    )))).toBe(true);
  });
});
