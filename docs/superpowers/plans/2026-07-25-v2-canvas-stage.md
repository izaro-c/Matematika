# V2 Canvas Stage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace editor_v2’s v1 `DiagramCanvas` wrapper with a from-scratch `V2CanvasStage` that sizes the board correctly and provides V2 chrome + editor/publication frames.

**Architecture:** New UI-only modules under `src/features/editor_v2/ui/canvas/`. `V2BoardHost` mounts shared `DiagramRenderer` inside a `ResizeObserver`-measured box. Publication modes size the diagram to `publishedDiagramArea(SCREEN_PRESETS[…])` (content box, not device chassis). Header mode becomes `editor | desktop | tablet | mobile`.

**Tech Stack:** React + TypeScript, Vitest + Testing Library, Tailwind Arts & Crafts tokens, `@/shared/diagrams/public` (`DiagramRenderer`, `withMovedPoint`, `withViewportBounds`), existing `publishedDiagramLayout` data helpers.

## Global Constraints

- No imports of `DiagramCanvas`, `DiagramResponsivePreview`, `DiagramViewportFrame`, or v1 workbench chrome UI.
- Data helpers from `editor/diagrams/model` (incl. `publishedDiagramLayout`, tool refs, point/element mutators) are allowed.
- `DiagramRenderer` `viewportControls={false}` and `stepControls={false}`; V2 chrome owns those actions.
- Publication content size = published diagram area for the device preset, not full device dimensions.
- Mode `editor` = no device frames; `desktop|tablet|mobile` = publication frames; all modes editable.
- Arts & Crafts tokens only (`lienzo`, `carbon`, `salvia`, `granada`, `pavo`, …).
- Spec: `docs/superpowers/specs/2026-07-25-v2-canvas-stage-design.md`.

---

## File map

| File | Responsibility |
|------|----------------|
| `src/features/editor_v2/ui/canvas/canvasFrameMode.ts` | `V2CanvasFrameMode`, `isPublicationMode`, `publicationContentSize` |
| `src/features/editor_v2/ui/canvas/V2BoardHost.tsx` | Measured host + `DiagramRenderer` + model edit callbacks |
| `src/features/editor_v2/ui/canvas/V2WorkshopSurface.tsx` | Workshop background |
| `src/features/editor_v2/ui/canvas/V2PublicationFrame.tsx` | Device bezel + MDX mock around fixed content box |
| `src/features/editor_v2/ui/canvas/V2CanvasChrome.tsx` | Floating docks (tool / steps / view) |
| `src/features/editor_v2/ui/canvas/V2CanvasStage.tsx` | Orchestrates surface, frame, chrome, board |
| `src/features/editor_v2/ui/V2CanvasArea.tsx` | Delete after stage wired (or thin re-export during transition — prefer delete) |
| `src/features/editor_v2/ui/EditorV2Main.tsx` | Use `V2CanvasStage`; state `V2CanvasFrameMode` default `'editor'` |
| `src/features/editor_v2/ui/V2Header.tsx` | Four mode buttons: Editor / Escritorio / Tablet / Móvil |
| `tests/features/editor_v2/canvas/*.test.tsx` | Unit/UI tests per task |

---

### Task 1: Frame mode + publication content size

**Files:**
- Create: `src/features/editor_v2/ui/canvas/canvasFrameMode.ts`
- Create: `tests/features/editor_v2/canvas/canvasFrameMode.test.ts`

**Interfaces:**
- Produces:
  - `type V2CanvasFrameMode = 'editor' | 'desktop' | 'tablet' | 'mobile'`
  - `isPublicationMode(mode: V2CanvasFrameMode): mode is Exclude<V2CanvasFrameMode, 'editor'>`
  - `publicationContentSize(mode: Exclude<V2CanvasFrameMode, 'editor'>, pageType?: string): { width: number; height: number }`
- Consumes: `SCREEN_PRESETS`, `publishedDiagramArea`, `publishedLayoutForPageType` from `../../editor/diagrams/model/publishedDiagramLayout` (path relative from `editor_v2`: `@/features/editor/diagrams/model/publishedDiagramLayout`)

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest';
import {
  isPublicationMode,
  publicationContentSize,
  type V2CanvasFrameMode,
} from '@/features/editor_v2/ui/canvas/canvasFrameMode';
import { SCREEN_PRESETS, publishedDiagramArea, publishedLayoutForPageType } from '@/features/editor/diagrams/model/publishedDiagramLayout';

describe('canvasFrameMode', () => {
  it('isPublicationMode is false only for editor', () => {
    expect(isPublicationMode('editor')).toBe(false);
    for (const mode of ['desktop', 'tablet', 'mobile'] as const) {
      expect(isPublicationMode(mode)).toBe(true);
    }
  });

  it('publicationContentSize matches publishedDiagramArea for the device preset', () => {
    for (const mode of ['desktop', 'tablet', 'mobile'] as const) {
      const expected = publishedDiagramArea(
        { width: SCREEN_PRESETS[mode].width, height: SCREEN_PRESETS[mode].height },
        publishedLayoutForPageType(undefined),
      );
      const actual = publicationContentSize(mode);
      expect(actual.width).toBe(expected.width);
      expect(actual.height).toBe(expected.height);
      expect(actual.width).toBeLessThan(SCREEN_PRESETS[mode].width);
    }
  });

  it('mobile content is narrower than desktop content', () => {
    expect(publicationContentSize('mobile').width).toBeLessThan(publicationContentSize('desktop').width);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/features/editor_v2/canvas/canvasFrameMode.test.ts`  
Expected: FAIL (module not found)

- [ ] **Step 3: Implement `canvasFrameMode.ts`**

```ts
import {
  SCREEN_PRESETS,
  publishedDiagramArea,
  publishedLayoutForPageType,
} from '@/features/editor/diagrams/model/publishedDiagramLayout';

export type V2CanvasFrameMode = 'editor' | 'desktop' | 'tablet' | 'mobile';

export function isPublicationMode(
  mode: V2CanvasFrameMode,
): mode is Exclude<V2CanvasFrameMode, 'editor'> {
  return mode !== 'editor';
}

export function publicationContentSize(
  mode: Exclude<V2CanvasFrameMode, 'editor'>,
  pageType?: string,
): { width: number; height: number } {
  const screen = SCREEN_PRESETS[mode];
  const area = publishedDiagramArea(
    { width: screen.width, height: screen.height },
    publishedLayoutForPageType(pageType),
  );
  return { width: area.width, height: area.height };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/features/editor_v2/canvas/canvasFrameMode.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/editor_v2/ui/canvas/canvasFrameMode.ts tests/features/editor_v2/canvas/canvasFrameMode.test.ts
git commit -m "$(cat <<'EOF'
feat(editor_v2): canvas frame mode and publication content sizes

EOF
)"
```

---

### Task 2: `V2BoardHost` (measured `DiagramRenderer`)

**Files:**
- Create: `src/features/editor_v2/ui/canvas/V2BoardHost.tsx`
- Create: `tests/features/editor_v2/canvas/V2BoardHost.test.tsx`

**Interfaces:**
- Consumes: `VisualDiagramModel`, `CanvasTool`, model helpers (`nextPointId`, `point`, `nextLayerItemOrder`, `updateElement`, `updateSlider`, `toolReferenceCandidatesForSlot`), `withMovedPoint`, `withViewportBounds`, `DiagramRenderer`, `MathProvider`
- Produces: `V2BoardHost` props:

```ts
export interface V2BoardHostProps {
  model: VisualDiagramModel;
  selectedIds: readonly string[];
  activeTool: CanvasTool;
  pendingRefs: string[];
  previewHighlightId?: string;
  errorHighlightedIds?: readonly string[];
  activeStepId?: string;
  onSelect: (ids: string[], additive?: boolean) => void;
  onModelEdit: (next: VisualDiagramModel, command?: { label?: string; mergeKey?: string }) => void;
  onChooseReferenceForTool: (refId: string) => boolean;
  onCompleteTool: () => void;
  className?: string;
}
```

- [ ] **Step 1: Write failing tests** (mock `DiagramRenderer` like `DiagramCanvas.test.tsx`)

```tsx
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { createTemplateModel } from '@/features/editor/diagrams/model';
import { V2BoardHost } from '@/features/editor_v2/ui/canvas/V2BoardHost';

const rendererState = vi.hoisted(() => ({ props: null as Record<string, unknown> | null }));

vi.mock('@/shared/diagrams/public', async importOriginal => {
  const actual = await importOriginal<typeof import('@/shared/diagrams/public')>();
  return {
    ...actual,
    DiagramRenderer: (props: Record<string, unknown>) => {
      rendererState.props = props;
      return (
        <div data-testid="mock-diagram-renderer">
          <button
            type="button"
            data-testid="trigger-create-point"
            onClick={() => (props.onCanvasPointCreate as ((x: number, y: number) => void) | undefined)?.(1.37, 2.63)}
          >
            Crear punto
          </button>
        </div>
      );
    },
  };
});

// Polyfill ResizeObserver that reports a non-zero size immediately
beforeEach(() => {
  rendererState.props = null;
  class RO {
    cb: ResizeObserverCallback;
    constructor(cb: ResizeObserverCallback) { this.cb = cb; }
    observe(target: Element) {
      this.cb([{
        target,
        contentRect: { width: 640, height: 400, top: 0, left: 0, bottom: 400, right: 640, x: 0, y: 0, toJSON: () => ({}) },
        borderBoxSize: [],
        contentBoxSize: [],
        devicePixelContentBoxSize: [],
      }] as ResizeObserverEntry[], this);
    }
    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal('ResizeObserver', RO);
});

describe('V2BoardHost', () => {
  it('does not mount DiagramRenderer until host has size, then mounts with viewportControls false', () => {
    // First verify with zero-size observer that renderer is absent — optional second test.
    const model = createTemplateModel('blank', 'T', 'sandbox');
    render(
      <V2BoardHost
        model={model}
        selectedIds={[]}
        activeTool="select"
        pendingRefs={[]}
        onSelect={() => {}}
        onModelEdit={() => {}}
        onChooseReferenceForTool={() => false}
        onCompleteTool={() => {}}
      />,
    );
    expect(screen.getByTestId('mock-diagram-renderer')).toBeTruthy();
    expect(rendererState.props?.viewportControls).toBe(false);
    expect(rendererState.props?.stepControls).toBe(false);
    expect(rendererState.props?.mode).toBe('editor');
    expect(rendererState.props?.spec).toBe(model);
  });

  it('creates a snapped point when tool is point', () => {
    const model = createTemplateModel('blank', 'T', 'sandbox');
    const onModelEdit = vi.fn();
    const onSelect = vi.fn();
    const onCompleteTool = vi.fn();
    render(
      <V2BoardHost
        model={model}
        selectedIds={[]}
        activeTool="point"
        pendingRefs={[]}
        onSelect={onSelect}
        onModelEdit={onModelEdit}
        onChooseReferenceForTool={() => false}
        onCompleteTool={onCompleteTool}
      />,
    );
    fireEvent.click(screen.getByTestId('trigger-create-point'));
    expect(onModelEdit).toHaveBeenCalled();
    const next = onModelEdit.mock.calls[0][0];
    expect(next.points.some((p: { x: number; y: number }) => p.x === 1.5 && p.y === 2.5)).toBe(true);
    expect(onCompleteTool).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run** `npx vitest run tests/features/editor_v2/canvas/V2BoardHost.test.tsx` → FAIL

- [ ] **Step 3: Implement `V2BoardHost.tsx`**

Key behavior:
- Outer `div.relative.h-full.w-full` with `ref` + `ResizeObserver`; track `{w,h}` state; if `w < 8 || h < 8` render skeleton `data-testid="v2-board-skeleton"` and **do not** mount `DiagramRenderer`.
- When sized: wrap `MathProvider` + `DiagramRenderer` with:
  - `spec={model}`, `mode="editor"`, `viewportControls={false}`, `stepControls={false}`
  - `selectedIds` = unique of `selectedIds + pendingRefs`
  - `highlightedIds` / `errorHighlightedIds` / `activeStepId` from props
  - `className` fills host (`h-full w-full`)
  - Selection: if tool needs refs and id is candidate → `onChooseReferenceForTool`; else `onSelect([id], additive)`
  - Point move / slider / annotation move / viewport persist: same semantics as current `DiagramCanvas` callbacks, rewritten in this file (do not import `DiagramCanvas`)
  - `onCanvasPointCreate` only when `activeTool === 'point'`; snap to 0.5; `nextPointId` + `point` + step visibility updates; then `onSelect([id])` + `onCompleteTool()`

- [ ] **Step 4: Run tests → PASS**

- [ ] **Step 5: Commit** `feat(editor_v2): V2BoardHost with measured DiagramRenderer`

---

### Task 3: Workshop surface + publication frame

**Files:**
- Create: `src/features/editor_v2/ui/canvas/V2WorkshopSurface.tsx`
- Create: `src/features/editor_v2/ui/canvas/V2PublicationFrame.tsx`
- Create: `tests/features/editor_v2/canvas/V2PublicationFrame.test.tsx`

**Interfaces:**
- Produces:

```ts
// V2WorkshopSurface
export const V2WorkshopSurface: React.FC<{ children: React.ReactNode; className?: string }>;

// V2PublicationFrame
export interface V2PublicationFrameProps {
  mode: 'desktop' | 'tablet' | 'mobile';
  title?: string;
  pageType?: string;
  children: React.ReactNode; // board host goes here
}
```

- [ ] **Step 1: Failing tests**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { V2PublicationFrame } from '@/features/editor_v2/ui/canvas/V2PublicationFrame';
import { publicationContentSize } from '@/features/editor_v2/ui/canvas/canvasFrameMode';

describe('V2PublicationFrame', () => {
  it('sizes the diagram slot to publication content, not device chassis', () => {
    const content = publicationContentSize('mobile');
    render(
      <V2PublicationFrame mode="mobile" title="Demo">
        <div data-testid="board-slot" />
      </V2PublicationFrame>,
    );
    const slot = screen.getByTestId('v2-publication-diagram-slot');
    expect(slot.style.width).toBe(`${content.width}px`);
    expect(slot.style.height).toBe(`${content.height}px`);
    expect(screen.getByText(/móvil/i)).toBeTruthy();
  });

  it('labels desktop publication mode', () => {
    render(
      <V2PublicationFrame mode="desktop" title="Demo">
        <div />
      </V2PublicationFrame>,
    );
    expect(screen.getByText(/escritorio|desktop/i)).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run → FAIL**

- [ ] **Step 3: Implement**

`V2WorkshopSurface`: full-size flex center; background `bg-carbon/[0.03]` + subtle repeating linear-gradient grid (low opacity carbon lines). `data-testid="v2-workshop-surface"`.

`V2PublicationFrame`:
- Compute `publicationContentSize(mode, pageType)`.
- Outer bezel differs by mode (rounded device chrome; desktop = window/page chrome). Bezel must **not** change diagram slot size.
- Inside content column: mock MDX header (title + 2–3 placeholder lines), then `data-testid="v2-publication-diagram-slot"` with inline `width`/`height` = content size, `overflow-hidden`, children fill `h-full w-full`.
- If stage is smaller than frame, parent (`V2CanvasStage`) will scale the whole frame later; frame itself uses fixed px content.
- Mode badge in mock top bar.

- [ ] **Step 4: Run → PASS**

- [ ] **Step 5: Commit** `feat(editor_v2): workshop surface and publication frames`

---

### Task 4: `V2CanvasChrome`

**Files:**
- Create: `src/features/editor_v2/ui/canvas/V2CanvasChrome.tsx`
- Create: `tests/features/editor_v2/canvas/V2CanvasChrome.test.tsx`

**Interfaces:**

```ts
export interface V2CanvasChromeProps {
  model: VisualDiagramModel;
  activeTool: CanvasTool;
  pendingRefs: string[];
  stepCount: number;
  activeStepIndex: number | null;
  stepPreviewActive?: boolean;
  showAllObjects?: boolean;
  onCancelTool: () => void;
  onChooseReferenceForTool: (refId: string) => boolean;
  onCompleteTool: () => void;
  onStepPrev?: () => void;
  onStepNext?: () => void;
  onClearStepPreview?: () => void;
  onToggleGrid: () => void;
  onToggleAxis: () => void;
  onResetViewport: () => void;
  onToggleShowAllObjects?: () => void;
}
```

- [ ] **Step 1: Failing tests** — tool dock visible when `activeTool !== 'select'`; steps dock when `stepCount > 0`; view dock always has Rejilla/Ejes/Centrar; click Centrar calls `onResetViewport`.

- [ ] **Step 2: Run → FAIL**

- [ ] **Step 3: Implement docks** (top-left tool, top-right steps, bottom-left view) matching design §3; reuse `V2ToolDrawing` / `IconClose` / chevrons from `../V2Icons`; tool slot labels via `refsNeededForTool`, `toolReferenceLabel`, `toolReferencePurpose`, `toolReferenceCandidatesForSlot`, `toolReferencesAreReady`, `KIND_LABELS`. Style: `bg-lienzo/95 backdrop-blur-md rounded-xl border border-carbon/15 shadow-md`. Absolute positioned; `z-30`; pointer-events only on docks.

- [ ] **Step 4: Run → PASS**

- [ ] **Step 5: Commit** `feat(editor_v2): V2CanvasChrome floating docks`

---

### Task 5: `V2CanvasStage` + header mode `editor`

**Files:**
- Create: `src/features/editor_v2/ui/canvas/V2CanvasStage.tsx`
- Modify: `src/features/editor_v2/ui/V2Header.tsx` (responsiveFrame → `V2CanvasFrameMode`, add Editor button)
- Modify: `src/features/editor_v2/ui/EditorV2Main.tsx` (state default `'editor'`; render `V2CanvasStage`; remove `V2CanvasArea`)
- Delete: `src/features/editor_v2/ui/V2CanvasArea.tsx` after imports updated
- Create: `tests/features/editor_v2/canvas/V2CanvasStage.test.tsx`
- Modify: `tests/features/editor_v2/editorV2.test.tsx` (assert Editor mode control exists)

**Interfaces:**

```ts
export interface V2CanvasStageProps {
  model: VisualDiagramModel | null;
  selectedIds: readonly string[];
  activeTool: CanvasTool;
  pendingRefs: string[];
  frameMode: V2CanvasFrameMode;
  previewHighlightId?: string;
  stepPreviewActive?: boolean;
  activeStepIndex?: number | null;
  stepCount?: number;
  errorHighlightedIds?: readonly string[];
  showAllObjects?: boolean;
  pageType?: string;
  onToggleShowAllObjects?: () => void;
  onClearStepPreview?: () => void;
  onStepPrev?: () => void;
  onStepNext?: () => void;
  onSelect: (ids: string[], additive?: boolean) => void;
  onModelEdit: (next: VisualDiagramModel, command?: { label?: string; mergeKey?: string }) => void;
  onChooseReferenceForTool: (refId: string) => boolean;
  onCompleteTool: () => void;
  onCancelTool: () => void;
  onResetViewport: () => void;
  onToggleGrid: () => void;
  onToggleAxis: () => void;
}
```

- [ ] **Step 1: Failing stage tests**
  - `frameMode="editor"` → no `v2-publication-diagram-slot`; has `v2-workshop-surface` + board host.
  - `frameMode="tablet"` → has publication slot with tablet content size.
  - `model=null` → “Cargando lienzo…” (or equivalent empty state).
  - Mock `DiagramRenderer` + `ResizeObserver` as in Task 2.

- [ ] **Step 2: Run → FAIL**

- [ ] **Step 3: Implement stage**
  - `ReferencePickProvider` wrap (from `editor/diagrams/ui/relations` — data/context for picks; allowed).
  - Always: `V2WorkshopSurface` → relative full size.
  - `editor`: centered work sheet (`max-w`/`h` with ~24–32px margin, `bg-lienzo` border shadow) containing `V2BoardHost` filling sheet.
  - publication: centered frame; if `frame.getBoundingClientRect()` wider/taller than stage, apply `transform: scale(s)` with `transformOrigin: 'center center'` on the frame wrapper (`s = min(1, availW/frameW, availH/frameH)`). Implement scale via a small `useFitScale(ref)` hook in the same file or `useFitScale.ts`.
  - Overlay `V2CanvasChrome` on top of stage (sibling absolute inset-0 pointer-events-none; docks re-enable pointer-events).
  - Compute `activeStepId` from `activeStepIndex` / `showAllObjects` as current `V2CanvasArea` does.

- [ ] **Step 4: Update `V2Header`**
  - Prop type `frameMode: V2CanvasFrameMode` (rename from `responsiveFrame`).
  - Buttons: Editor | Escritorio | Tablet | Móvil calling `onSelectFrameMode`.
  - Keep Centrar in header as today.

- [ ] **Step 5: Update `EditorV2Main`**
  - `useState<V2CanvasFrameMode>('editor')`
  - Replace `<V2CanvasArea … responsiveFrame=…>` with `<V2CanvasStage … frameMode=…>`
  - Delete `V2CanvasArea.tsx`; fix any leftover imports.

- [ ] **Step 6: Run**  
  `npx vitest run tests/features/editor_v2/canvas/V2CanvasStage.test.tsx tests/features/editor_v2/editorV2.test.tsx`  
  Expected: PASS

- [ ] **Step 7: Commit** `feat(editor_v2): V2CanvasStage with editor and publication modes`

---

### Task 6: Regression + cleanup verification

**Files:**
- Modify if needed: any remaining `responsiveFrame` references in editor_v2
- Test: `tests/features/editor_v2/EditorV2Remediation.test.tsx`, `EditorV2CriticalBugs.test.tsx`, `EditorV2PersistenceMode.test.tsx`, `EditorV2Properties.test.tsx`

- [ ] **Step 1: Grep guard**

Run: `rg "DiagramCanvas|DiagramResponsivePreview|V2CanvasArea|responsiveFrame" src/features/editor_v2`  
Expected: no matches (except possibly comments none)

- [ ] **Step 2: Run full editor_v2 suite**

Run: `npx vitest run tests/features/editor_v2`  
Expected: PASS

- [ ] **Step 3: Manual checklist** (document in commit body if done in session)
  - Editor mode: board fills work sheet; resize window → board stays visible.
  - Desktop/Tablet/Móvil: diagram slot px = content size; editable click/drag.
  - Chrome docks work; Centrar restores home.

- [ ] **Step 4: Commit** `test(editor_v2): canvas stage regression cleanup`

---

## Self-review (plan vs spec)

| Spec requirement | Task |
|------------------|------|
| Shell V2 + DiagramRenderer, no DiagramCanvas | 2, 5 |
| Workshop surface | 3, 5 |
| Publication frames for desktop/tablet/mobile | 1, 3, 5 |
| Content size ≠ device chassis | 1, 3 |
| Editor mode without device frames | 5 |
| Editable in all modes | 2, 5 |
| Chrome docks tool/steps/view | 4 |
| Header mode selector includes Editor | 5 |
| ResizeObserver / no zero-size mount | 2 |
| Fit-scale publication when stage smaller | 5 |
| Empty/skeleton error states | 2, 5 |
| Tests for host, modes, chrome, interaction | 1–6 |

No TBD placeholders. Types consistent: `V2CanvasFrameMode`, `publicationContentSize`, `V2BoardHostProps`, `V2CanvasStageProps`.
