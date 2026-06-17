---
name: diagrama
description: >
  Use ONLY when the user asks to create, edit, or generate interactive diagrams,
  visualizations, simulations, or any graphical mathematical content for the
  Euclides Digital project. This covers all files under src/diagrams/ and their
  integration with MDX content via InteractiveElement/VisualBind/MathStore.
  Do NOT use for general UI components, styling, or non-mathematical graphics.
---

# diagrama — Interactive Mathematical Diagrams for Euclides Digital

You are a diagram engineer for Euclides Digital. You create interactive mathematical visualizations that are explanatory, visually coherent with the Arts & Crafts design system, and bidirectionally linked to the MDX content via `InteractiveElement` / `VisualBind` / `MathStore`.

## 1. Diagram Technologies — When to Use What

The project supports three rendering approaches. Choose based on the requirements:

| Technology | When to Use | Interactivity | File Location |
|---|---|---|---|
| **JSXGraph** (`jsxgraph`) | Complex geometric constructions, coordinate-based math, precise axis/scales, draggable points with snapping, function plots, 3D views | High — draggable points, gliders, sliders, reactive updates | `src/diagrams/<Category>/<Name>.tsx` |
| **SVG + React** | Custom 2D diagrams, vector illustrations, simple interactions (drag, hover), responsive scaling, animated transitions | Medium — pointer events, state-driven, declarative | `src/diagrams/<Category>/<Name>.tsx` |
| **Canvas 2D + rAF** | Real-time animations, particle systems, continuous motion, frame-by-frame rendering | Medium — imperative, requestAnimationFrame | `src/diagrams/<Category>/<Name>.tsx` |
| **HTML/CSS** | Structured info (trees, cards, matrices), non-spatial data, probability trees, step-by-step logic | Low-medium — click, hover, CSS transitions | `src/diagrams/<Category>/<Name>.tsx` |

**Decision guide:**
- Geometry, trigonometry, linear algebra (vectors/matrices) → **JSXGraph** or **SVG**
- Calculus (limits, derivatives, integrals) → **JSXGraph** (functions) or **SVG** (area fills)
- Statistics, probability trees → **HTML/CSS** or **SVG**
- Logic, proof methods → **HTML/CSS**
- 3D visualization → **JSXGraph 3D** (`view3d`, `curve3d`) or custom SVG with projection math

## 2. Two-Way Communication Architecture

Every interactive diagram must support TWO directions of communication:

```
MDX Text (right panel)
  │
  ├── <InteractiveElement target="ladoA" color="terracota">a</InteractiveElement>
  │     onMouseEnter → MathStore.setVariable('highlight', 'ladoA')
  │     onMouseLeave → MathStore.setVariable('highlight', null)
  │     ▼
  └── Diagram receives 'highlight' → illuminates element 'ladoA'
  
Diagram (left panel)
  │
  ├── Dragging a point → board.on('update') → setVariable('catetoA', value)
  │     ▼
  └── MDX text or other components can read the value via useMathStore
```

### 2.1 Store Selection

| Store | Import | When to Use | How Text Connects |
|---|---|---|---|
| **MathStore** | `import { useMathStore } from '../../store/MathStoreContext'` | Per-page isolated state. Use when the diagram has specific named elements to highlight or variables to share. | `<InteractiveElement target="name" color="token">` (from MDXBlocks) calls `setVariable('highlight', target)` |
| **LessonStore** | `import { useLessonStore } from '../../store/LessonStore'` | Global lesson state. Use when the diagram responds to step changes or when multiple diagrams share state. | `<VisualBind element="name" color="token">` (from VisualBind.tsx) calls `setActiveStep(element)` |

**IMPORTANT:** `InteractiveElement` and `VisualBind` are both registered in `MDXComponents` (MDXBlocks.tsx). `InteractiveElement` uses MathStore; `VisualBind` uses LessonStore. Pick one communication channel and be consistent.

### 2.2 MathStore Pattern (for JSXGraph / SVG diagrams)

```typescript
import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '../../store/MathStoreContext';

export const MyDiagram = () => {
    const boardRef = useRef<HTMLDivElement>(null);
    const elementsRef = useRef<Record<string, unknown>>({});
    const setVariable = useMathStore(state => state.setVariable);
    const highlight = useMathStore(state => state.variables['highlight']);

    // 1. INIT — Create board once
    useEffect(() => {
        if (!boardRef.current) return;
        const board = JXG.JSXGraph.initBoard(boardRef.current, {
            boundingbox: [-5, 5, 5, -5],
            axis: true,
            showCopyright: false,
            keepaspectratio: true,
        });

        // Create geometric elements
        // IMPORTANT: store element references by the SAME name used in InteractiveElement
        const myPoint = board.create('point', [1, 2], { /* ... */ });
        elementsRef.current = { myPoint, board };

        // REACTIVITY: diagram → store
        board.on('update', () => {
            setVariable('distance', computeDistance());
        });

        board.update();
        return () => { JXG.JSXGraph.freeBoard(board); elementsRef.current = {}; };
    }, [setVariable]);

    // 2. REACTIVITY: store → diagram (read highlight)
    useEffect(() => {
        const { myPoint, board } = elementsRef.current as Record<string, any>;
        if (!board) return;

        // Reset all
        myPoint.setAttribute({ size: 4, fillColor: '#C86446' });

        // Apply highlight
        if (highlight === 'myPoint') myPoint.setAttribute({ size: 10, fillColor: '#f5c542' });

        board.update();
    }, [highlight]);

    return <div ref={boardRef} className="w-full h-full min-h-[500px]" />;
};
```

### 2.3 LessonStore Pattern (for step-based SVG/CSS diagrams)

```typescript
import React, { useState } from 'react';
import { useLessonStore } from '../../store/LessonStore';

export const MySvgDiagram: React.FC = () => {
    const activeStep = useLessonStore(state => state.activeStep);
    const [value, setValue] = useState(0);

    const isStepActive = (step: string) => activeStep === step;

    return (
        <svg viewBox="0 0 400 400" className="w-full h-full">
            <circle
                cx="200" cy="200" r="50"
                fill={isStepActive('myCircle') ? 'var(--color-terracota)' : 'var(--color-carbon)'}
                opacity={isStepActive('myCircle') ? 1 : 0.3}
            />
        </svg>
    );
};
```

## 3. Color Palette — Arts & Crafts

Every diagram MUST use the project's semantic color tokens. NEVER use arbitrary hex colors.

| Token | Hex | JSXGraph (`strokeColor`/`fillColor`) | SVG (`fill`/`stroke`) | Mathematical Meaning |
|---|---|---|---|---|
| `carbon` | `#333333` | `#333333` | `var(--color-carbon)` | Axes, borders, labels, main text |
| `salvia` | `#A2C2A2` | `#A2C2A2` | `var(--color-salvia)` | Planes, coefficients, secondary geometry |
| `terracota` | `#C86446` | `#C86446` | `var(--color-terracota)` | Points, vectors, unknowns, primary interactive elements |
| `pizarra` | `#5D7080` | `#5D7080` | `var(--color-pizarra)` | Distances, results, secondary measurements |
| `lienzo` | `#F8F6F1` | `#F8F6F1` | `var(--color-lienzo)` | Diagram background |

**For fills with opacity:** use `fillOpacity: 0.2` (normal) / `0.8` (highlighted) in JSXGraph, or the corresponding `opacity` in SVG.

**For points and interactive handles:** `size: 4` normal, `size: 8–10` highlighted.

## 4. Interactive Element Naming Convention (CRITICAL)

The `target` / `element` string in `<InteractiveElement>` / `<VisualBind>` MUST match exactly the name used in the diagram's `elementsRef` or state logic. Establish a consistent naming convention:

| Element Type | Naming Pattern | Example |
|---|---|---|
| Points / vertices | `p<Letter>` | `pA`, `pB`, `pC` |
| Sides / segments | `side<Letter>` or `<letter><letter>` | `sideAB`, `ab` |
| Angles | `angle<Letter>` | `angleC`, `angleGamma` |
| Areas / polygons | `area<Name>` | `areaSquare`, `areaTriangle` |
| Coordinates | `coord<Name>` | `coordX`, `coordY` |
| Lines | `line<Name>` | `lineTangent`, `lineSecant` |
| Vectors | `vec<Name>` | `vecAB`, `vecResult` |
| Interactive controls | `slider<Name>` | `sliderN`, `sliderZoom` |

The diagram component and the MDX text MUST use identical strings for the connection to work.

## 5. File Organization

```
src/diagrams/
  <Category>/         (e.g., Geometria, Pitagoras, LinearAlgebra, Calculo, Axiomas)
    <Name>.tsx         (the diagram component — PascalCase)
```

**Category conventions:**
| Category | Content |
|---|---|
| `Axiomas/` | Axiom visualizations (incidence, order, continuity) |
| `Geometria/` | Geometric concepts (segments, angles, circles, Thales, cross product) |
| `Pitagoras/` | Pythagoras-specific diagrams (interactive, proof steps, applications) |
| `Calculo/` | Calculus (derivatives, integrals, limits) |
| `Analisis/` | Analysis (epsilon-delta, convergence) |
| `Algebra/` | Algebra (Cramer's rule, systems) |
| `LinearAlgebra/` | Linear algebra (determinants, matrices, transformations) |
| `Estadistica/` | Statistics (normal distribution, hypothesis tests) |
| `Probabilidad/` | Probability (Bayes trees, conditional probability) |
| `MetodosDemostracion/` | Proof method visualizations |
| `CasosUso/` | Real-world application simulations |
| `Ejercicios/` | Interactive exercise diagrams |

## 6. JSXGraph Best Practices

### Board Configuration
```typescript
const board = JXG.JSXGraph.initBoard(boardRef.current, {
    boundingbox: [-5, 8, 8, -5],  // [xMin, yMax, xMax, yMin] — note inverted Y
    axis: true,                    // Show cartesian axes
    showCopyright: false,          // NEVER show JSXGraph watermark
    keepaspectratio: true,         // Preserve aspect ratio (CRUCIAL for geometry)
    grid: false,                   // Grid off by default, enable only when needed
});
```

### Element Creation
```typescript
// Fixed points (non-interactive)
board.create('point', [x, y], { fixed: true, withLabel: false, visible: false });

// Draggable points with grid snapping (for student interaction)
board.create('glider', [x, y, board.defaultAxes.x], {
    withLabel: false, color: '#333333', size: 4,
    snapToGrid: true, snapSizeX: 1, attractToGrid: true, attractorDistance: 0.2
});

// Segments with semantic colors
board.create('segment', [p1, p2], {
    strokeColor: '#C86446', strokeWidth: 3,
    label: { fontSize: 24, cssClass: 'font-serif font-bold italic', strokeColor: '#C86446' }
});

// Regular polygons (for area visualizations)
board.create('regularpolygon', [p1, p2, 4], {
    fillColor: '#C86446', fillOpacity: 0.2,
    borders: { strokeColor: '#C86446' },
    vertices: { visible: false }     // Hide vertex dots
});

// Function plots
board.create('functiongraph', [x => Math.sin(x), -Math.PI, Math.PI], {
    strokeColor: '#C86446', strokeWidth: 3
});

// Angles
board.create('angle', [p1, vertex, p3], {
    radius: 1, fillColor: '#A2C2A2', fillOpacity: 0.3
});

// Text labels
board.create('text', [x, y, 'formula'], { fontSize: 18, cssClass: 'font-serif' });

// Sliders
board.create('slider', [[x, y], [x2, y2], [initial, min, max]], {
    snapWidth: 0.1, name: 'value'
});
```

### Cleanup
```typescript
return () => {
    JXG.JSXGraph.freeBoard(board);
    elementsRef.current = {};
};
```

## 7. SVG Best Practices

```typescript
import { useRef, useState } from 'react';

export const MySVG = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [dragging, setDragging] = useState<string | null>(null);

    // Coordinate mapping: logical → pixel
    const scale = 50;                         // pixels per unit
    const origin = { x: 50, y: 350 };          // SVG pixel origin
    const toPx = (x: number, y: number) => ({
        cx: origin.x + x * scale,
        cy: origin.y - y * scale              // SVG Y is inverted
    });

    // Pointer event handlers
    const handlePointerMove = (e: React.PointerEvent) => {
        if (!dragging || !svgRef.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        const mathX = (e.clientX - rect.left - origin.x) / scale;
        const mathY = (origin.y - (e.clientY - rect.top)) / scale;
    };

    return (
        <div className="w-full h-full min-h-[400px]">
            <svg ref={svgRef}
                viewBox="0 0 400 400"
                className="w-full max-w-[400px] h-auto touch-none"
                onPointerMove={handlePointerMove}
                onPointerUp={() => setDragging(null)}
            >
                {/* Grid lines */}
                <line ... stroke="var(--color-carbon)" strokeWidth="1" strokeDasharray="4" />
                {/* Geometry */}
                <line ... stroke="var(--color-terracota)" strokeWidth="3" />
                <circle ... fill="var(--color-terracota)" />
                <text ... fill="var(--color-carbon)" className="font-serif font-bold" />
            </svg>
        </div>
    );
};
```

**IMPORTANT:** Always use CSS variables (`var(--color-<token>)`) for SVG colors, NEVER hex directly. This ensures dark mode support.

## 8. Canvas 2D + requestAnimationFrame Best Practices

```typescript
import { useRef, useEffect } from 'react';

export const MyCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let animId: number;

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Draw using ctx.fillStyle = 'var(--color-terracota)' etc.
            animId = requestAnimationFrame(render);
        };
        animId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(animId);
    }, []);

    return <canvas ref={canvasRef} className="w-full h-full" width={600} height={400} />;
};
```

## 9. Connecting to MDX

### Step 1: Create the diagram component in `src/diagrams/<Category>/<Name>.tsx`

### Step 2: In the MDX content file, import and export it:
```typescript
import { MyDiagram } from '../../diagrams/Category/MyDiagram';
export const Simulation = MyDiagram;

export const metadata = {
  ...
  hasSimulation: true,
};
```

### Step 3: In the MDX body, reference interactive elements:
```mdx
<InteractiveElement target="myPoint" color="terracota">texto</InteractiveElement>
```

## 10. Responsive Design for Diagrams

- **JSXGraph:** The board container `min-h-[500px]` + `w-full h-full` auto-scales with the parent. The `keepaspectratio: true` option prevents distortion.
- **SVG:** Use a `viewBox` with `className="w-full max-w-[400px] h-auto"`. The SVG will scale proportionally.
- **Canvas:** Set explicit `width`/`height` attributes (logical pixels) + `w-full h-full` CSS for the container.
- **Always use `touch-none`** on SVG/Canvas to prevent scroll interference when touching/dragging on mobile.
- Add a `min-h-[400px]` (SVG/Canvas) or `min-h-[500px]` (JSXGraph) to ensure the diagram has adequate vertical space.

## 11. Demonstration-Specific Diagrams

For multi-step proofs in demonstration MDX files (see `src/content/demonstrations/`):

### Approach A — Dedicated Components Per Step
Each step has its own diagram (e.g., `RearrangementStep1`, `RearrangementStep2`):
- Wrap each step in `<DemonstrationSection diagram={<StepComponent />}>`
- Steps use `<MedievalStep>` for sequential progression

### Approach B — Single Component with Step Modes (Recommended)
A single diagram component handles all steps via the `highlight` variable:
- The diagram renders ALL geometry upfront but toggles visibility/emphasis via `switch (highlight)`
- Each MedievalStep sets `target="stepN"` which triggers `MathStore.highlight = "stepN"` via IntersectionObserver
- The diagram's `useEffect` on `highlight` adjusts `setAttribute({ visible }), strokeWidth, fillOpacity` per step

```
MDX: <MedievalStep number={1} title="..." target="step1" />
       ↓ IntersectionObserver
MathStore: highlight = "step1"
       ↓ useEffect
Diagram: switch(highlight) { case 'step1': showOnlyDiameter(); ... }
```

### CRITICAL Rules for Split-Layout Demos

1. **Every MedievalStep MUST have a `target` prop** — without it, the diagram cannot react to the current step
2. **Every step must produce a different visual state** — the diagram should not look identical across steps
3. **Each step's body MUST contain `<InteractiveElement>` references** — these create hover-based cross-references between text and diagram
4. **Element/target names MUST match exactly** between the diagram logic and the MDX `<InteractiveElement target="...">` prop
5. **`\sen` is forbidden** in all diagram code — use `sin` as plain text (e.g. `a/sin(α)`), never `sen`

## 12. Quality Checklist (Run Before Completing)

- [ ] The diagram uses the correct rendering technology for the mathematical concept
- [ ] All colors use the Arts & Crafts semantic palette (no arbitrary hex colors)
- [ ] SVG uses CSS variables (`var(--color-<token>)`) for dark mode compatibility
- [ ] The diagram connects to MathStore (for InteractiveElement) or LessonStore (for VisualBind)
- [ ] Element/target names match exactly between diagram `elementsRef` and MDX `<InteractiveElement target="...">`
- [ ] The diagram is exported as `Simulation` in the MDX file (if it's the primary visualization)
- [ ] `hasSimulation: true` is set in metadata
- [ ] JSXGraph diagrams have `showCopyright: false` and `keepaspectratio: true`
- [ ] JSXGraph diagrams have proper cleanup (`freeBoard` in useEffect return)
- [ ] The diagram has `touch-none` class for mobile compatibility
- [ ] The diagram has adequate minimum height (`min-h-[400px]` SVG, `min-h-[500px]` JSXGraph)
- [ ] Interactive elements have visual feedback on hover/highlight (opacity change, size change, color change)
- [ ] All `<MedievalStep>` in split-layout demos have a `target` prop matching a diagram mode
- [ ] Each step body has at least one `<InteractiveElement>` pointing to the diagram
- [ ] No `\sen` anywhere — LaTeX uses `\sin`, plain text uses `sin`
- [ ] The diagram's highlight handler produces a distinct visual state for each step value
