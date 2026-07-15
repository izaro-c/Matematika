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
  MathBoard: ({ children, onInit, onUpdate }: { children?: React.ReactNode; onInit?: (board: unknown, elements: Record<string, unknown>, theme: Record<string, string>) => void; onUpdate?: (board: unknown, elements: Record<string, unknown>, theme: Record<string, string>, isStep: () => boolean, isHL: () => boolean) => void }) => {
    const elementsRef = React.useRef<Record<string, any>>({});
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
      onUpdate?.(boardRef.current, elementsRef.current, themeRef.current, () => false, () => false);
    }, [onUpdate]);
    return <div data-testid="phase3-board">{children}</div>;
  },
}));

import { DiagramRenderer } from '../../../src/shared/diagrams/runtime/DiagramRenderer';
import { Incidence2Spec } from '../../../src/widgets/diagrams/Axiomas/Incidence2';

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

describe('Phase 3 shared renderer', () => {
  it('renders incidence points as movable gliders on their supporting line', () => {
    render(<MathProvider><DiagramRenderer spec={Incidence2Spec} viewportControls={false} /></MathProvider>);

    const gliders = rendererState.createdOptions.filter(item => item.kind === 'glider');
    expect(gliders).toHaveLength(2);
    expect(gliders.every(item => item.options.fixed === false)).toBe(true);
    expect(rendererState.nodes.filter(node => node.getAttribute('aria-roledescription') === 'punto móvil del diagrama')).toHaveLength(2);
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

  it('keeps a native label interactive and visually synchronized with its point', () => {
    const base = migrateDiagramSpec(primitivesFixture).spec;
    const target = base.points.find(point => point.target) ?? base.points[0];
    const spec = {
      ...base,
      points: base.points.map(point => point.id === target.id
        ? { ...point, style: { ...point.style, preserveColorOnHighlight: true } }
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
      label: { highlightColor: preservedColor, highlightStrokeColor: preservedColor },
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

  it('renders angles without an authored radius using the canonical default', () => {
    render(<MathProvider><DiagramRenderer spec={migrateDiagramSpec(marksFixture).spec} viewportControls={false} /></MathProvider>);

    const renderedAngle = rendererState.createdOptions.find(({ kind }) => kind === 'angle');
    expect(renderedAngle?.options.radius).toBe(0.55);
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
});
