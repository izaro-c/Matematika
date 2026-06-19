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

## 1. Diagram Technologies — Decision Framework

The project supports four rendering approaches.

| Technology | When to Use | Interactivity | Best For |
|---|---|---|---|
| **JSXGraph** | Complex geometric constructions, coordinate math, precise axes, draggable points with snapping, function plots, 3D views | High — draggable points, gliders, sliders, reactive updates | Geometry, trig, linear algebra, calculus |
| **SVG + React** | Custom 2D diagrams, vector illustrations, simple drag/hover, responsive scaling, animated transitions | Medium — pointer events, state-driven, declarative | Custom geometry, area fills, diagrams needing precise styling |
| **Canvas 2D + rAF** | Real-time animations, particle systems, continuous motion, frame-by-frame rendering | Medium — imperative, requestAnimationFrame | Animations, live data, physics simulations |
| **HTML/CSS** | Structured info (trees, cards, matrices), non-spatial data, probability trees, step-by-step logic | Low-medium — click, hover, CSS transitions | Logic, probability, statistics, proof methods |

### Decision Tree

```
Is the concept geometric or spatial?
  ├── Yes → Does it need precise coordinate math?
  │   ├── Yes → JSXGraph
  │   └── No  → Is it a custom illustration?
  │       ├── Yes → SVG
  │       └── No  → HTML/CSS
  └── No  → Is it a real-time animation?
      ├── Yes → Canvas 2D
      └── No  → Is it structured/non-spatial?
          ├── Yes → HTML/CSS
          └── No  → SVG
```

## 2. Two-Way Communication Architecture

Every interactive diagram must support TWO directions of communication:

```
MDX Text (right panel)
  │
  ├── <InteractiveElement target="ladoA" color="terracota">a</InteractiveElement>
  │     onMouseEnter → LessonStore.setActiveStep('ladoA')
  │     onMouseLeave → LessonStore.setActiveStep(null)
  │     ▼
  └── Diagram receives highlight → illuminates element 'ladoA'
  
Diagram (left panel)
  │
  ├── Dragging a point → board.on('update') → setVariable('catetoA', value)
  │     ▼
  └── MDX text or other components read the value via useMathStore
```

### 2.1 Store Selection

| Store | When to Use | Writes From | Read By |
|---|---|---|---|
| **LessonStore** | When diagram responds to text hovers (Primary). `InteractiveElement` from VisualBind writes here. | `setActiveStep(element)` on hover | Diagram reads `useLessonStore(s => s.activeStep)` |
| **MathStore** | Per-page state (slider values, measurements, computed data). Diagram writes values here. | `setVariable('distance', val)` on diagram update | Text/UI reads `useMathStore(s => s.variables.distance)` |

**CRITICAL:** There are TWO `InteractiveElement` components:

| File | Import Path | Writes To | Used By |
|---|---|---|---|
| `VisualBind.tsx` | `../../components/ui/VisualBind` | `LessonStore.activeStep` | All content MDX files |
| `MDXBlocks.tsx` | `../../components/ui/MDXBlocks` | `MathStore.variables['highlight']` | (Avoid — use VisualBind) |

**All content MDX files MUST import `InteractiveElement` from `VisualBind.tsx`.** Therefore, Euclides diagrams MUST read from `LessonStore`.

### 2.2 Store Bridge Pattern (REQUIRED)

Diagrams must listen to BOTH stores for compatibility:

```typescript
import { useMathStore } from '../../store/MathStoreContext';
import { useLessonStore } from '../../store/LessonStore';

const mathHighlight = useMathStore(state => state.variables['highlight']);
const lessonHighlight = useLessonStore(state => state.activeStep);
const highlight = mathHighlight || lessonHighlight;
```

### 2.3 Full JSXGraph Pattern

```typescript
import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '../../store/MathStoreContext';
import { useLessonStore } from '../../store/LessonStore';

export const MyDiagram = () => {
    const boardRef = useRef<HTMLDivElement>(null);
    const elementsRef = useRef<Record<string, unknown>>({});
    const setVariable = useMathStore(state => state.setVariable);
    const mathHighlight = useMathStore(state => state.variables['highlight']);
    const lessonHighlight = useLessonStore(state => state.activeStep);
    const highlight = mathHighlight || lessonHighlight;

    useEffect(() => {
        if (!boardRef.current) return;
        const board = JXG.JSXGraph.initBoard(boardRef.current, {
            boundingbox: [-5, 5, 5, -5],
            axis: true,
            showCopyright: false,
            keepaspectratio: true,
        });

        // IMPORTANT: store elements by the SAME name used in InteractiveElement
        const myPoint = board.create('point', [1, 2], { /* ... */ });
        elementsRef.current = { myPoint, board };

        board.on('update', () => {
            setVariable('distance', computeDistance());
        });

        board.update();
        return () => { JXG.JSXGraph.freeBoard(board); elementsRef.current = {}; };
    }, [setVariable]);

    // Reactivity: store → diagram
    useEffect(() => {
        const { myPoint, board } = elementsRef.current as Record<string, any>;
        if (!board) return;

        // RESET every attribute that any highlight condition changes
        myPoint.setAttribute({ size: 4, fillColor: '#C86446', strokeColor: '#C86446' });

        // APPLY highlight
        if (highlight === 'myPoint') {
            myPoint.setAttribute({ size: 10, fillColor: '#f5c542' });
        }

        board.update();
    }, [highlight]);

    return <div ref={boardRef} className="w-full h-full min-h-[500px]" />;
};
```

### 2.4 SVG + LessonStore Pattern

```typescript
import React from 'react';
import { useLessonStore } from '../../store/LessonStore';

export const MySvgDiagram: React.FC = () => {
    const activeStep = useLessonStore(state => state.activeStep);
    const isActive = (step: string) => activeStep === step;

    return (
        <svg viewBox="0 0 400 400" className="w-full h-full touch-none">
            <circle cx="200" cy="200" r="50"
                fill={isActive('myCircle') ? 'var(--theme-terracota)' : 'var(--theme-carbon)'}
                opacity={isActive('myCircle') ? 1 : 0.3}
            />
        </svg>
    );
};
```

## 3. Color Palette — Arts & Crafts (Complete)

Every diagram MUST use the project's semantic color tokens. **NEVER use arbitrary hex colors.**

| Token | Hex | JSXGraph | SVG / CSS | Mathematical Meaning |
|---|---|---|---|---|
| `carbon` | `#333333` | `#333333` | `var(--theme-carbon)` | Axes, borders, labels, main text, grid |
| `salvia` | `#A2C2A2` | `#A2C2A2` | `var(--theme-salvia)` | Planes, coefficients, secondary geometry, construction lines |
| `terracota` | `#C86446` | `#C86446` | `var(--theme-terracota)` | Points, vectors, unknowns, primary interactive elements |
| `pizarra` | `#5D7080` | `#5D7080` | `var(--theme-pizarra)` | Distances, results, secondary measurements, computed values |
| `lienzo` | `#F8F6F1` | `#F8F6F1` | `var(--theme-lienzo)` | Diagram background, fill areas |
| `ocre` | `#c49b4f` | `#c49b4f` | `var(--theme-ocre)` | Highlighting, special values, auxiliary elements |
| `pavo` | `#3b5e6b` | `#3b5e6b` | `var(--theme-pavo)` | Alternative accent, tertiary elements, alternative constructions |
| `granada` | `#8b3a3a` | `#8b3a3a` | `var(--theme-granada)` | Errors, contradictions, counterexample elements |
| `musgo` | `#4a5d23` | `#4a5d23` | `var(--theme-musgo)` | Applications, verified/correct results |

**Opacity conventions:**
- Normal fill: `fillOpacity: 0.15–0.25`
- Highlighted fill: `fillOpacity: 0.5–0.8`
- Normal stroke: `strokeWidth: 1.5–3`
- Highlighted stroke: `strokeWidth: 4–6`
- Normal point size: `4`
- Highlighted point size: `8–10`

## 4. Anatomy of a Good Diagram

A diagram in Euclides Digital is NOT just an illustration — it is a **pedagogical tool** that must be clear, focused, and elegant.

### 4.1 Visual Hierarchy

Every diagram should have exactly **one primary element** per view state. The eye should be drawn to what matters.

1. **Primary** (terracota, bold) — the main geometric element being discussed
2. **Secondary** (salvia, thinner) — construction lines, supporting elements
3. **Tertiary** (carbon, thin) — axes, grid, labels
4. **Background** (lienzo, low opacity) — fill areas

### 4.2 Whitespace and Composition

- **Padding:** Always leave `boundingbox` with 15–20% margin around the content
- **Clutter:** If a diagram has more than 8–10 labeled elements, consider splitting into multiple steps
- **Labels:** Use `font-serif` for mathematical labels, italic style. Position labels to avoid overlapping lines
- **Balance:** Center the relevant geometry in the viewport. Don't force the user to pan

### 4.3 Typography in Diagrams

- Use **CSS classes** for text styling in JSXGraph: `cssClass: 'font-serif font-bold italic'`
- Labels for points: capital italic letters (e.g., $A$, $B$, $C$)
- Labels for measurements: small with units (e.g., $a = 5\text{ cm}$)
- Font size: 16–20px for point labels, 14–16px for measurements

### 4.4 Color Semantics

Each color MUST have a consistent meaning within a single diagram:

| Element | Color | Example |
|---|---|---|
| Given / known | `carbon` | Points, segments given by hypothesis |
| Unknown / to find | `terracota` | The side or angle being solved for |
| Construction | `salvia` | Auxiliary lines, intermediate steps |
| Result | `pizarra` | Computed value, proven relationship |
| Error / contradiction | `granada` | Inconsistent elements, fallacies |
| Verified | `musgo` | Correct answer, verified condition |

Within one diagram, a color MUST NOT be used for two different semantic roles.

## 5. Interactive Element Naming Convention (CRITICAL)

The `target` string in `<InteractiveElement>` MUST match exactly the name used in the diagram's `elementsRef` or highlight logic.

| Element Type | Naming Pattern | Example |
|---|---|---|
| Points / vertices | `p<Letter>` | `pA`, `pB`, `pC` |
| Sides / segments | `seg<Letters>` | `segAB`, `segBC` |
| Lines | `line<Name>` | `lineAB`, `lineTangent` |
| Angles | `angle<Label>` | `angleC`, `angleGamma`, `angleABC` |
| Arcs | `arc<Name>` | `arcAB`, `arcCircle` |
| Polygons / areas | `poly<Name>` | `polyTriangle`, `polySquare` |
| Measurements | `meas<Name>` | `measDistance`, `measAngle` |
| Vectors | `vec<Name>` | `vecAB`, `vecResult` |
| Coordinates | `coord<Name>` | `coordX`, `coordY` |
| Sliders / controls | `slider<Name>` | `sliderN`, `sliderZoom` |
| Step-specific | `step<N><Element>` | `step1Line`, `step2Point` |

## 6. Technology-Specific Best Practices

### 6.1 JSXGraph

**Board configuration:**
```typescript
const board = JXG.JSXGraph.initBoard(boardRef.current, {
    boundingbox: [-5, 8, 8, -5],
    axis: true,
    showCopyright: false,       // NEVER show watermark
    keepaspectratio: true,      // CRUCIAL for geometry
    grid: false,                // Enable only when needed
});
```

**Element creation:**
```typescript
// Fixed point (invisible, for construction)
board.create('point', [x, y], { fixed: true, withLabel: false, visible: false });

// Draggable point with snapping
board.create('glider', [x, y, board.defaultAxes.x], {
    withLabel: false, color: '#333333', size: 4,
    snapToGrid: true, snapSizeX: 1
});

// Segment with semantic color
board.create('segment', [p1, p2], {
    strokeColor: '#C86446', strokeWidth: 3,
    label: { fontSize: 20, cssClass: 'font-serif font-bold italic', strokeColor: '#C86446' }
});

// Regular polygon
board.create('regularpolygon', [p1, p2, 4], {
    fillColor: '#C86446', fillOpacity: 0.2,
    borders: { strokeColor: '#C86446' },
    vertices: { visible: false }
});

// Angle
board.create('angle', [p1, vertex, p3], {
    radius: 1, fillColor: '#A2C2A2', fillOpacity: 0.3
});

// Function plot
board.create('functiongraph', [x => Math.sin(x), -Math.PI, Math.PI], {
    strokeColor: '#C86446', strokeWidth: 3
});

// Text label
board.create('text', [x, y, 'formula'], { fontSize: 18, cssClass: 'font-serif' });

// Slider
board.create('slider', [[x, y], [x2, y2], [initial, min, max]], {
    snapWidth: 0.1, name: 'value'
});
```

**Cleanup (MANDATORY):**
```typescript
return () => {
    JXG.JSXGraph.freeBoard(board);
    elementsRef.current = {};
};
```

### 6.2 SVG + React

```typescript
import { useRef, useState } from 'react';

export const MySVG = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [dragging, setDragging] = useState<string | null>(null);

    // Coordinate mapping
    const scale = 50;
    const origin = { x: 50, y: 350 };
    const toPx = (x: number, y: number) => ({
        cx: origin.x + x * scale,
        cy: origin.y - y * scale
    });

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
                {/* Grid */}
                <line stroke="var(--theme-carbon)" strokeWidth="1" strokeDasharray="4" />
                {/* Geometry — ALWAYS use CSS variables */}
                <line stroke="var(--theme-terracota)" strokeWidth="3" />
                <circle fill="var(--theme-terracota)" />
                <text fill="var(--theme-carbon)" className="font-serif font-bold" />
            </svg>
        </div>
    );
};
```

**CRITICAL:** SVG MUST use `var(--theme-<token>)` for ALL colors. This ensures dark mode support. **Never use hex values directly in SVG.**

### 6.3 Canvas 2D

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
            // Read colors from CSS variables:
            // getComputedStyle(document.documentElement).getPropertyValue('--theme-terracota')
            animId = requestAnimationFrame(render);
        };
        animId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(animId);
    }, []);

    return <canvas ref={canvasRef} className="w-full h-full touch-none" width={600} height={400} />;
};
```

### 6.4 Model Diagrams (Pattern for Models)

Model diagrams do NOT use `InteractiveElement` or `LessonStore`. They display a **complete concrete structure** — the entire model at once, often as a static or explorable visualization.

```typescript
import { useRef, useEffect } from 'react';

export const ThreePointModel = () => {
    const boardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!boardRef.current) return;
        const board = JXG.JSXGraph.initBoard(boardRef.current, {
            boundingbox: [-1, 4, 4, -1],
            axis: false,
            showCopyright: false,
            keepaspectratio: true,
        });

        // Three non-collinear points (the universe)
        const pA = board.create('point', [1, 1], {
            fixed: true, color: '#C86446', size: 6,
            label: { fontSize: 20, cssClass: 'font-serif font-bold', color: '#C86446' }
        });
        const pB = board.create('point', [3, 2], {
            fixed: true, color: '#C86446', size: 6,
            label: { fontSize: 20, cssClass: 'font-serif font-bold', color: '#C86446' }
        });
        const pC = board.create('point', [2, 3], {
            fixed: true, color: '#C86446', size: 6,
            label: { fontSize: 20, cssClass: 'font-serif font-bold', color: '#C86446' }
        });

        // The "lines" (pairs of points) — in this model, lines are just pairs
        board.create('segment', [pA, pB], {
            strokeColor: '#5D7080', strokeWidth: 2, dash: 2
        });
        board.create('segment', [pB, pC], {
            strokeColor: '#5D7080', strokeWidth: 2, dash: 2
        });
        board.create('segment', [pC, pA], {
            strokeColor: '#5D7080', strokeWidth: 2, dash: 2
        });

        // Label showing what this model satisfies
        board.create('text', [0.5, 3.5, 'Modelo de 3 puntos — Geometría de Incidencia'], {
            fontSize: 14, cssClass: 'font-serif italic', color: '#333333'
        });

        board.update();
        return () => { JXG.JSXGraph.freeBoard(board); };
    }, []);

    return <div ref={boardRef} className="w-full h-full min-h-[400px]" />;
};
```

Model diagrams:
- Do NOT use `useMathStore` or `useLessonStore`
- Do NOT have `InteractiveElement` connections
- Are exported as `Diagram` (not `Simulation`) in the MDX file
- Have `"hasDiagram": true` in metadata (not `hasSimulation`)

### 6.5 Fallacy / Counterexample Diagrams

For diagrams that show an **incorrect** reasoning or fallacious proof:

```typescript
// Show the incorrect step in granada (error color)
// Show the correct version alongside in musgo (verified color)
// Use annotations explaining WHY it is wrong
```

Example: The "Isosceles Triangle Fallacy" diagram shows a flawed proof that all triangles are isosceles, with the error highlighted in `granada` and the correct construction in `carbon`.

## 7. Animation Principles

### 7.1 When to Animate

- **Reveal:** Show elements appearing one by one to match proof steps
- **Transition:** Smoothly move between states (e.g., dragging a point updates measurements in real-time)
- **Emphasis:** Pulse or highlight an element when the user hovers over related text

### 7.2 When NOT to Animate

- Continuous rotation or oscillation that serves no pedagogical purpose
- Animations faster than 200ms or slower than 800ms (cognitive discomfort)
- Animations that change the diagram layout while the user is interacting
- Gratuitous effects (particles, glow, shadows) — these violate the Arts & Crafts aesthetic

### 7.3 Animation Patterns

**Reveal (elements appear on step change):**
```typescript
useEffect(() => {
    // On highlight change, reveal elements with opacity transition
    element.setAttribute({ visible: highlight === 'step2' });
    board.update();
}, [highlight]);
```

**Smooth value transitions (when dragging updates a value):**
```typescript
// JSXGraph handles this natively — elements update on every board.update()
```

**Emphasis (pulse on hover):**
```typescript
// Use a CSS transition or setAttribute with a brief setTimeout
```

### 7.4 Performance

- For JSXGraph: limit `board.update()` calls. Batch changes in a single `useEffect`
- For SVG: use CSS `transition` instead of JavaScript animation where possible
- For Canvas: keep `requestAnimationFrame` loops lean — no heavy computation per frame
- Avoid animating more than 3–4 elements simultaneously

## 8. Connecting to MDX

### Step 1: Create the diagram component

File: `src/diagrams/<Category>/<Name>.tsx`

### Step 2: In the MDX file, import and export

For theorems/axioms (uses SimulationLayout):
```typescript
import { MyDiagram } from '../../diagrams/Category/MyDiagram';
export const Simulation = MyDiagram;

export const metadata = {
  ...
  "hasSimulation": true,
};
```

For models (inline rendering):
```typescript
import { ModelDiagram } from '../../diagrams/Models/ModelDiagram';
export const Diagram = ModelDiagram;

export const metadata = {
  ...
  "hasDiagram": true,
};
```

### Step 3: In the MDX body, reference diagram elements

```mdx
<InteractiveElement target="segAB" color="terracota">
  lado AB
</InteractiveElement>
```

## 9. Responsive Design

- **JSXGraph:** Container `min-h-[500px]` + `w-full h-full`. Use `keepaspectratio: true`.
- **SVG:** `viewBox` + `className="w-full max-w-[400px] h-auto"`. Scales proportionally.
- **Canvas:** Explicit `width`/`height` attributes + `w-full h-full` CSS container.
- **Always use `touch-none`** on SVG/Canvas to prevent scroll interference on mobile.
- Minimum heights: `min-h-[400px]` (SVG/Canvas), `min-h-[500px]` (JSXGraph).

## 10. Demonstration Diagrams (Split Layout)

For multi-step proofs with `layout: "split"`:

### Approach A — Dedicated Components Per Step

Each step has its own diagram component:

```mdx
<DemonstrationSection diagram={<Step1Diagram />}>
  <MedievalStep number={1} title="Construcción" />
  <InteractiveElement target="step1Line" color="terracota">texto</InteractiveElement>
</DemonstrationSection>

<DemonstrationSection diagram={<Step2Diagram />}>
  <MedievalStep number={2} title="Razonamiento" />
  <InteractiveElement target="step2Angle" color="salvia">texto</InteractiveElement>
</DemonstrationSection>
```

### Approach B — Single Component (Recommended)

One diagram handles all steps via the highlight variable:

```typescript
useEffect(() => {
    // Reset ALL
    lineAB.setAttribute({ strokeWidth: 2, strokeColor: '#5D7080', visible: true });
    angleC.setAttribute({ fillColor: '#A2C2A2', fillOpacity: 0.2 });

    // Apply highlight
    if (highlight === 'segAB') lineAB.setAttribute({ strokeWidth: 6, strokeColor: '#C86446' });
    if (highlight === 'angleC') angleC.setAttribute({ fillColor: '#C86446', fillOpacity: 0.5 });

    board.update();
}, [highlight]);
```

**CRITICAL:** Every attribute modified by any highlight condition MUST be explicitly reset to its default value in the reset block. Missing a reset causes "sticky" highlights.

## 11. Dark Mode

Diagrams MUST work in both light and dark modes.

### JSXGraph (read CSS variables at runtime)

```typescript
function getCSSVar(name: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// In board creation:
const carbon = getCSSVar('--theme-carbon');
const lienzo = getCSSVar('--theme-lienzo');

board = JXG.JSXGraph.initBoard(boardRef.current, {
    // ...
    // Cannot CSS-vary the board background directly, so set it:
});
board.renderer.container.style.backgroundColor = lienzo;
```

For JSXGraph, colors are set at init time. The diagram component should watch for theme changes:

```typescript
useEffect(() => {
    const observer = new MutationObserver(() => {
        if (board) {
            const lienzo = getCSSVar('--theme-lienzo');
            board.renderer.container.style.backgroundColor = lienzo;
            board.update();
        }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
}, []);
```

### SVG (use CSS variables — automatic dark mode)

SVG using `var(--theme-*)` adapts automatically to dark mode because the CSS variables change when `.dark` is applied to `<html>`.

**NEVER use hex values in SVG.** Always use `var(--theme-<token>)`.

## 12. Accessibility

### Color and Contrast

- All interactive elements MUST have **sufficient contrast** against the background:
  - Text: minimum contrast ratio 4.5:1 against background
  - Interactive elements (points, lines): minimum 3:1 against background
- **Do NOT rely solely on color** to convey information. Use shape, size, position, and labels in addition to color.

### Keyboard Navigation

- Diagrams SHOULD be focusable: `<div ref={...} tabIndex={0} role="img" aria-label="...">`
- For interactive controls (sliders, draggable points), ensure keyboard equivalents exist (e.g., arrow keys for sliders)
- JSXGraph sliders support keyboard input natively; ensure they are reachable via Tab

### ARIA Labels

```typescript
<div
    ref={boardRef}
    className="w-full h-full min-h-[500px]"
    role="img"
    aria-label="Diagrama interactivo: construcción del triángulo equilátero. Los puntos A, B y C son vértices. Arrastre los puntos para explorar."
    tabIndex={0}
/>
```

## 13. Performance Guidelines

- **JSXGraph:** Minimize elements. Remove unnecessary axes/grid when not needed. Use `freeBoard` in cleanup.
- **SVG:** Use CSS for transitions (`transition: all 0.3s`) instead of JavaScript animation loops.
- **Canvas:** Keep `requestAnimationFrame` animations under 16ms per frame. Use `will-change: transform` on the canvas container.
- **General:** Avoid unnecessary re-renders. Memoize diagram components with `React.memo` if they receive stable props.
- **Highlight effects:** Batch all `setAttribute` calls and call `board.update()` once, not per element.

## 14. File Organization

```
src/diagrams/
  <Category>/
    <Name>.tsx           (diagram component — PascalCase)
```

**Category conventions:**

| Category | Content |
|---|---|
| `Axiomas/` | Axiom visualizations (incidence, order, continuity) |
| `Geometria/` | Geometric concepts (segments, angles, circles, Thales) |
| `Pitagoras/` | Pythagoras-specific diagrams (proof steps, applications) |
| `Calculo/` | Calculus (derivatives, integrals, limits) |
| `Analisis/` | Analysis (epsilon-delta, convergence) |
| `Algebra/` | Algebra (Cramer's rule, systems) |
| `AlgebraLineal/` | Linear algebra (determinants, matrices, transformations) |
| `Estadistica/` | Statistics (normal distribution, hypothesis tests) |
| `Probabilidad/` | Probability (Bayes trees, conditional probability) |
| `MetodosDemostracion/` | Proof method visualizations |
| `Modelos/` | Model diagrams (3-point, Fano, Poincaré) |
| `CasosUso/` | Real-world application simulations |
| `Ejercicios/` | Interactive exercise diagrams |

## 15. Quality Checklist

### Technical

- [ ] The diagram uses the correct rendering technology (JSXGraph/SVG/Canvas/HTML)
- [ ] All colors use the Arts & Crafts palette (tokens from §3)
- [ ] SVG uses `var(--theme-<token>)` CSS variables (never hex)
- [ ] JSXGraph has `showCopyright: false` and `keepaspectratio: true`
- [ ] JSXGraph has proper cleanup (`freeBoard` in useEffect return)
- [ ] The diagram has `touch-none` class (SVG/Canvas)
- [ ] Adequate minimum height (`min-h-[400px]` SVG, `min-h-[500px]` JSXGraph)

### Interactivity

- [ ] The diagram reads from LessonStore (via store bridge in §2.2)
- [ ] Element/target names match exactly between diagram and MDX `<InteractiveElement>`
- [ ] The highlight `useEffect` reset block restores EVERY modified attribute
- [ ] Each proof step body has at least one `<InteractiveElement>` referencing the diagram
- [ ] Interactive elements have visual feedback on hover/highlight
- [ ] The diagram produces a distinct visual state for each target value

### Visual Design

- [ ] One primary element per view state (visual hierarchy §4.1)
- [ ] Whitespace: 15–20% margin around content
- [ ] No gratuitous animations or effects
- [ ] Labels use `font-serif` and are positioned to avoid overlapping lines
- [ ] Colors have consistent semantic meaning within the diagram

### Dark Mode

- [ ] SVG uses CSS variables (automatic dark mode support)
- [ ] JSXGraph has MutationObserver for theme changes (§11)
- [ ] All colors are readable in both light and dark mode

### Accessibility

- [ ] Sufficient contrast (4.5:1 text, 3:1 interactive elements)
- [ ] Information is not conveyed by color alone
- [ ] The diagram container has `role="img"` and `aria-label`
- [ ] Interactive controls have keyboard alternatives

### Organization

- [ ] File is in the correct category directory (§14)
- [ ] Component name matches the convention
- [ ] For theorems/axioms: exported as `Simulation` with `"hasSimulation": true`
- [ ] For models: exported as `Diagram` with `"hasDiagram": true`
- [ ] No `\sen` anywhere — LaTeX uses `\sin`, plain text uses `sin`
