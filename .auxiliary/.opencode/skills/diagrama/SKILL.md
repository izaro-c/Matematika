# Skill: diagrama — Diagramas Matemáticos Interactivos para Matematika

> Motor de generación de visualizaciones matemáticas interactivas, bidireccionales
> y coherentes con el sistema de diseño Arts & Crafts.

## Índice

1. [Tecnologías de Renderizado](#1-tecnologías-de-renderizado)
2. [Arquitectura de Comunicación Bidireccional](#2-arquitectura-de-comunicación-bidireccional)
3. [Paleta Arts & Crafts (Completa)](#3-paleta-arts--crafts-completa)
4. [Anatomía de un Buen Diagrama](#4-anatomía-de-un-buen-diagrama)
5. [Convención de Nombres de Elementos Interactivos](#5-convención-de-nombres-de-elementos-interactivos)
6. [Patrón Canonical JSXGraph](#6-patrón-canonical-jsxgraph)
7. [Patrón SVG + React](#7-patrón-svg--react)
8. [Patrón Canvas 2D](#8-patrón-canvas-2d)
9. [Patrón HTML/CSS](#9-patrón-htmlcss)
10. [Diagramas de Modelo](#10-diagramas-de-modelo)
11. [Diagramas de Falacias / Contraejemplos](#11-diagramas-de-falacias--contraejemplos)
12. [Principios de Animación](#12-principios-de-animación)
13. [Conexión con MDX](#13-conexión-con-mdx)
14. [Diseño Responsivo](#14-diseño-responsivo)
15. [Diagramas de Demostración (Split Layout)](#15-diagramas-de-demostración-split-layout)
16. [Modo Oscuro](#16-modo-oscuro)
17. [Accesibilidad](#17-accesibilidad)
18. [Rendimiento](#18-rendimiento)
19. [Organización de Archivos](#19-organización-de-archivos)
20. [Checklist de Calidad](#20-checklist-de-calidad)

---

## 1. Tecnologías de Renderizado

El proyecto soporta cuatro enfoques de renderizado.

| Tecnología | Cuándo usar | Interactividad | Mejor para |
|---|---|---|---|
| **JSXGraph** | Construcciones geométricas complejas, matemática de coordenadas, ejes precisos, puntos arrastrables con snapping, gráficas de funciones, vistas 3D | Alta — puntos arrastrables, gliders, sliders, updates reactivos | Geometría, trigonometría, álgebra lineal, cálculo |
| **SVG + React** | Diagramas 2D personalizados, ilustraciones vectoriales, drag/hover simple, escalado responsivo, transiciones animadas | Media — pointer events, state-driven, declarativo | Geometría personalizada, rellenos de áreas, diagramas con estilo preciso |
| **Canvas 2D + rAF** | Animaciones en tiempo real, sistemas de partículas, movimiento continuo, renderizado frame a frame | Media — imperativo, requestAnimationFrame | Animaciones, datos en vivo, simulaciones físicas |
| **HTML/CSS** | Información estructurada (árboles, tarjetas, matrices), datos no espaciales, árboles de probabilidad, lógica paso a paso | Baja-media — click, hover, transiciones CSS | Lógica, probabilidad, estadística, métodos de demostración |

### Árbol de Decisión

```
¿El concepto es geométrico o espacial?
  ├── Sí → ¿Necesita matemática de coordenadas precisa?
  │   ├── Sí → JSXGraph
  │   └── No  → ¿Es una ilustración personalizada?
  │       ├── Sí → SVG
  │       └── No  → HTML/CSS
  └── No  → ¿Es una animación en tiempo real?
      ├── Sí → Canvas 2D
      └── No  → ¿Es estructurada/no espacial?
          ├── Sí → HTML/CSS
          └── No  → SVG
```

---

## 2. Arquitectura de Comunicación Bidireccional

Todo diagrama interactivo soporta DOS direcciones de comunicación:

```
Texto MDX (panel derecho)
  │
  ├── <InteractiveElement target="ladoA" color="terracota">a</InteractiveElement>
  │     onMouseEnter → MathStore.setVariable('highlight', 'ladoA')
  │     onMouseLeave → MathStore.setVariable('highlight', null)
  │     ▼
  └── El diagrama recibe highlight → ilumina el elemento 'ladoA'
  
Diagrama (panel izquierdo)
  │
  ├── Arrastrar un punto → board.on('update') → setVariable('distancia', valor)
  │     ▼
  └── El texto MDX u otros componentes leen el valor via useMathStore
```

### 2.1 Store — MathStore ÚNICO

**Hay un solo store para highlight:** `MathStore`. No se usa `LessonStore` para highlights.

| Store | Cuándo usar | Escribe | Leído por |
|---|---|---|---|
| **MathStore** | Estado por página (highlight, valores de sliders, mediciones, datos calculados) | `setVariable('highlight', valor)` en hover/scroll | Diagramas leen `useMathStore(s => s.variables['highlight'])` |

**`InteractiveElement`** (from `VisualBind.tsx`) escribe en `MathStore.highlight`. Los diagramas leen `MathStore.highlight`. **Un solo store, una sola dirección.**

### 2.2 Highlight como string o array

El valor de `highlight` puede ser:
- `string` — un solo elemento resaltado: `"ladoA"`
- `string[]` — múltiples elementos resaltados simultáneamente: `["cuadrado-a", "cuadrado-b", "cuadrado-c"]`
- `null` — ningún elemento resaltado

Los diagramas DEBEN manejar los tres casos:

```typescript
const highlight = useMathStore(state => state.variables['highlight']);
const isHighlight = (id: string) =>
    Array.isArray(highlight)
        ? (highlight as string[]).includes(id)
        : highlight === id;
```

---

## 3. Paleta Arts & Crafts (Completa)

Todo diagrama DEBE usar los tokens semánticos de color del proyecto. **NUNCA usar colores hex arbitrarios.** Esto es innegociable.

| Token | Hex | JSXGraph | SVG / CSS | Significado matemático |
|---|---|---|---|---|
| `carbon` | `#333333` | `#333333` | `var(--theme-carbon)` | Ejes, bordes, etiquetas, texto principal, grid |
| `salvia` | `#A2C2A2` | `#A2C2A2` | `var(--theme-salvia)` | Planos, coeficientes, geometría secundaria, líneas de construcción |
| `terracota` | `#C86446` | `#C86446` | `var(--theme-terracota)` | Puntos, vectores, incógnitas, elementos interactivos primarios |
| `pizarra` | `#5D7080` | `#5D7080` | `var(--theme-pizarra)` | Distancias, resultados, mediciones secundarias, valores calculados |
| `lienzo` | `#F8F6F1` | `#F8F6F1` | `var(--theme-lienzo)` | Fondo del diagrama, áreas de relleno |
| `ocre` | `#c49b4f` | `#c49b4f` | `var(--theme-ocre)` | Resaltados, valores especiales, elementos auxiliares |
| `pavo` | `#3b5e6b` | `#3b5e6b` | `var(--theme-pavo)` | Acento alternativo, elementos terciarios, construcciones alternativas |
| `granada` | `#8b3a3a` | `#8b3a3a` | `var(--theme-granada)` | Errores, contradicciones, elementos de contraejemplo |
| `musgo` | `#4a5d23` | `#4a5d23` | `var(--theme-musgo)` | Aplicaciones, resultados verificados/correctos |

**Convenciones de opacidad:**
- Relleno normal: `fillOpacity: 0.15–0.25`
- Relleno resaltado: `fillOpacity: 0.5–0.8`
- Trazo normal: `strokeWidth: 1.5–3`
- Trazo resaltado: `strokeWidth: 4–6`
- Punto normal: `size: 4`
- Punto resaltado: `size: 8–10`

---

## 4. Anatomía de un Buen Diagrama

Un diagrama en Matematika NO es solo una ilustración — es una **herramienta pedagógica** que debe ser clara, focalizada y elegante.

### 4.1 Jerarquía Visual

Cada diagrama debe tener exactamente **un elemento primario** por estado de vista. La mirada debe ir a lo que importa.

1. **Primario** (terracota, bold) — el elemento geométrico principal en discusión
2. **Secundario** (salvia, más fino) — líneas de construcción, elementos de soporte
3. **Terciario** (carbon, fino) — ejes, grid, etiquetas
4. **Fondo** (lienzo, opacidad baja) — áreas de relleno

### 4.2 Espacio en Blanco y Composición

- **Padding:** Dejar siempre `boundingbox` con 15–20% de margen alrededor del contenido
- **Densidad:** Si un diagrama tiene más de 8–10 elementos etiquetados, considerar dividirlo en múltiples pasos
- **Etiquetas:** Usar `font-serif` para etiquetas matemáticas, estilo cursiva. Posicionar etiquetas para evitar solapamiento con líneas
- **Balance:** Centrar la geometría relevante en el viewport. No forzar al usuario a hacer pan

### 4.3 Tipografía en Diagramas

- Usar **clases CSS** para estilo de texto en JSXGraph: `cssClass: 'font-serif font-bold italic'`
- Etiquetas de puntos: letras mayúsculas cursivas (p. ej. $A$, $B$, $C$)
- Etiquetas de medidas: pequeñas con unidades (p. ej. $a = 5\text{ cm}$)
- Tamaño de fuente: 16–20px para etiquetas de puntos, 14–16px para medidas

### 4.4 Semántica de Color

Cada color DEBE tener un significado consistente dentro de un mismo diagrama:

| Elemento | Color | Ejemplo |
|---|---|---|
| Dado / conocido | `carbon` | Puntos, segmentos dados por hipótesis |
| Incógnita / a encontrar | `terracota` | El lado o ángulo que se busca |
| Construcción | `salvia` | Líneas auxiliares, pasos intermedios |
| Resultado | `pizarra` | Valor calculado, relación demostrada |
| Error / contradicción | `granada` | Elementos inconsistentes, falacias |
| Verificado | `musgo` | Respuesta correcta, condición verificada |

Dentro de un diagrama, un color NO debe usarse para dos roles semánticos diferentes.

---

## 5. Convención de Nombres de Elementos Interactivos

El string `target` en `<InteractiveElement>` DEBE coincidir exactamente con el nombre usado en la lógica de highlight del diagrama.

| Tipo de elemento | Patrón de naming | Ejemplo |
|---|---|---|
| Puntos / vértices | `p<Letra>` | `pA`, `pB`, `pC` |
| Lados / segmentos | `seg<Letras>` | `segAB`, `segBC` |
| Líneas | `line<Nombre>` | `lineAB`, `lineTangente` |
| Ángulos | `angle<Etiqueta>` | `angleC`, `angleGamma`, `angleABC` |
| Arcos | `arc<Nombre>` | `arcAB`, `arcCirculo` |
| Polígonos / áreas | `poly<Nombre>` | `polyTriangulo`, `polyCuadrado` |
| Mediciones | `meas<Nombre>` | `measDistancia`, `measAngulo` |
| Vectores | `vec<Nombre>` | `vecAB`, `vecResultado` |
| Coordenadas | `coord<Nombre>` | `coordX`, `coordY` |
| Sliders / controles | `slider<Nombre>` | `sliderN`, `sliderZoom` |
| Específico de paso | `step<N><Elemento>` | `step1Line`, `step2Point` |

> **Nota:** Los diagramas existentes usan convenciones como `vertice-a`, `lado-ab`, `cuadrado-a`, `altura-c`. Estas son igualmente válidas mientras el `target` del `InteractiveElement` coincida exactamente. Lo importante es la consistencia dentro de cada diagrama.

---

## 6. Patrón Canonical JSXGraph

Este es el patrón **canónico** para diagramas JSXGraph. Usar `initBoard` directo con `useRef`/`useEffect`/`elementsRef`.

```typescript
import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '../../store/MathStoreContext';

export const MyDiagram = () => {
    const boardRef = useRef<HTMLDivElement>(null);
    const elementsRef = useRef<Record<string, unknown>>({});
    const setVariable = useMathStore(state => state.setVariable);
    const highlight = useMathStore(state => state.variables['highlight']);
    const isHighlight = (id: string) =>
        Array.isArray(highlight)
            ? (highlight as string[]).includes(id)
            : highlight === id;

    useEffect(() => {
        if (!boardRef.current) return;
        const board = JXG.JSXGraph.initBoard(boardRef.current, {
            boundingbox: [-5, 5, 5, -5],
            axis: true,
            showCopyright: false,
            showNavigation: false,
            keepaspectratio: true,
            pan: { enabled: false },
            zoom: { wheel: false },
        });

        // Crear elementos — guardar en elementsRef con el MISMO nombre usado en InteractiveElement
        const pA = board.create('point', [-2, -2], {
            name: 'A', size: 4, fillColor: '#C86446', strokeColor: '#C86446',
            label: { fontSize: 20, cssClass: 'font-serif font-bold italic' }
        });
        const pB = board.create('point', [3, -1], {
            name: 'B', size: 4, fillColor: '#C86446', strokeColor: '#C86446',
            label: { fontSize: 20, cssClass: 'font-serif font-bold italic' }
        });
        const pC = board.create('point', [0, 3], {
            name: 'C', size: 4, fillColor: '#C86446', strokeColor: '#C86446',
            label: { fontSize: 20, cssClass: 'font-serif font-bold italic' }
        });

        const poly = board.create('polygon', [pA, pB, pC], {
            fillColor: '#C86446', fillOpacity: 0.15,
            borders: { strokeColor: '#C86446', strokeWidth: 2 },
            vertices: { visible: false }
        });

        // Asignar IDs para highlight
        pA.setAttribute({ id: 'vertice-a' });
        pB.setAttribute({ id: 'vertice-b' });
        pC.setAttribute({ id: 'vertice-c' });
        poly.borders[0].setAttribute({ id: 'lado-ab' });
        poly.borders[1].setAttribute({ id: 'lado-bc' });
        poly.borders[2].setAttribute({ id: 'lado-ca' });
        poly.setAttribute({ id: 'triangulo' });

        elementsRef.current = { pA, pB, pC, poly, board };

        // Escribir valores al store cuando el usuario interactúa
        board.on('update', () => {
            setVariable('area', board.area ? board.area() : 0);
        });

        board.update();
        return () => {
            JXG.JSXGraph.freeBoard(board);
            elementsRef.current = {};
        };
    }, [setVariable]);

    // Reactividad: store → diagrama (highlight)
    useEffect(() => {
        const { pA, pB, pC, poly, board } = elementsRef.current as Record<string, any>;
        if (!board) return;

        // RESET — cada atributo modificado por highlight DEBE restaurarse
        const resetPoint = (p: any) => p.setAttribute({ size: 4, strokeOpacity: 1, fillOpacity: 1 });
        const resetBorder = (b: any) => b.setAttribute({ strokeWidth: 2, strokeOpacity: 1 });
        resetPoint(pA); resetPoint(pB); resetPoint(pC);
        poly.borders.forEach(resetBorder);
        poly.setAttribute({ fillOpacity: 0.15 });

        // APLICAR highlight
        const highlightPoint = (p: any, id: string) => {
            if (isHighlight(id) || isHighlight('triangulo')) {
                p.setAttribute({ size: 8, strokeOpacity: 1, fillOpacity: 1 });
            }
        };
        highlightPoint(pA, 'vertice-a');
        highlightPoint(pB, 'vertice-b');
        highlightPoint(pC, 'vertice-c');

        const highlightBorder = (b: any, id: string) => {
            if (isHighlight(id) || isHighlight('triangulo')) {
                b.setAttribute({ strokeWidth: 5, strokeOpacity: 1 });
            }
        };
        highlightBorder(poly.borders[0], 'lado-ab');
        highlightBorder(poly.borders[1], 'lado-bc');
        highlightBorder(poly.borders[2], 'lado-ca');

        if (isHighlight('triangulo')) {
            poly.setAttribute({ fillOpacity: 0.4 });
        }

        board.update();
    }, [highlight]);

    return (
        <div
            ref={boardRef}
            className="w-full h-full min-h-[500px]"
            role="img"
            aria-label="Diagrama interactivo: triángulo con vértices A, B, C. Arrastre los puntos para explorar."
            tabIndex={0}
        />
    );
};
```

### 6.1 Configuración del Board

```typescript
const board = JXG.JSXGraph.initBoard(boardRef.current, {
    boundingbox: [-5, 8, 8, -5],    // [left, top, right, bottom] — dejar 15-20% de margen
    axis: true,                      // Solo cuando se necesite
    showCopyright: false,            // NUNCA mostrar watermark
    showNavigation: false,           // Ocultar navegación de JSXGraph
    keepaspectratio: true,           // CRUCIAL para geometría
    grid: false,                     // Habilitar solo cuando sea necesario
    pan: { enabled: false },         // Deshabilitar pan
    zoom: { wheel: false },          // Deshabilitar zoom con rueda
});
```

### 6.2 Creación de Elementos Comunes

```typescript
// Punto fijo (invisible, para construcción)
board.create('point', [x, y], { fixed: true, withLabel: false, visible: false });

// Punto arrastrable con snapping
board.create('glider', [x, y, board.defaultAxes.x], {
    withLabel: false, color: '#333333', size: 4,
    snapToGrid: true, snapSizeX: 1
});

// Segmento con color semántico
board.create('segment', [p1, p2], {
    strokeColor: '#C86446', strokeWidth: 3,
    label: { fontSize: 20, cssClass: 'font-serif font-bold italic', strokeColor: '#C86446' }
});

// Polígono regular
board.create('regularpolygon', [p1, p2, 4], {
    fillColor: '#C86446', fillOpacity: 0.2,
    borders: { strokeColor: '#C86446' },
    vertices: { visible: false }
});

// Ángulo
board.create('angle', [p1, vertex, p3], {
    radius: 1, fillColor: '#A2C2A2', fillOpacity: 0.3
});

// Gráfica de función
board.create('functiongraph', [x => Math.sin(x), -Math.PI, Math.PI], {
    strokeColor: '#C86446', strokeWidth: 3
});

// Etiqueta de texto
board.create('text', [x, y, 'formula'], { fontSize: 18, cssClass: 'font-serif' });

// Slider
board.create('slider', [[x, y], [x2, y2], [initial, min, max]], {
    snapWidth: 0.1, name: 'value'
});
```

### 6.3 Limpieza (OBLIGATORIA)

```typescript
return () => {
    JXG.JSXGraph.freeBoard(board);
    elementsRef.current = {};
};
```

### 6.4 Wrapper JXGBoard (alternativa existente)

El proyecto incluye un wrapper `src/components/core/JXGBoard.tsx` que simplifica la inicialización. Algunos diagramas existentes lo usan:

```typescript
import JXGBoard from '../../components/core/JXGBoard';

export const MyDiagram = () => {
    const highlight = useMathStore(state => state.variables['highlight']);
    const isHighlight = (id: string) => Array.isArray(highlight)
        ? (highlight as string[]).includes(id) : highlight === id;

    const logic = (board: any) => {
        // Crear elementos y registrar board.on('update', ...) aquí
    };

    return <JXGBoard logic={logic} bounds={[-5, 5, 5, -5]} className="w-full aspect-square" />;
};
```

> **Preferencia:** El patrón canónico es `initBoard` directo (§6). El wrapper JXGBoard existe en diagramas legacy y puede usarse para casos simples, pero los nuevos diagramas DEBEN usar el patrón canónico para tener control total sobre highlight reactivos, cleanup y accesibilidad.

---

## 7. Patrón SVG + React

```typescript
import React, { useRef, useState } from 'react';
import { useMathStore } from '../../store/MathStoreContext';

export const MySvgDiagram: React.FC = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [dragging, setDragging] = useState<string | null>(null);
    const highlight = useMathStore(state => state.variables['highlight']);
    const isActive = (id: string) =>
        Array.isArray(highlight) ? (highlight as string[]).includes(id) : highlight === id;

    // Mapeo de coordenadas
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
        // Actualizar estado...
    };

    return (
        <div className="w-full h-full min-h-[400px]">
            <svg ref={svgRef}
                viewBox="0 0 400 400"
                className="w-full max-w-[400px] h-auto touch-none"
                onPointerMove={handlePointerMove}
                onPointerUp={() => setDragging(null)}
                role="img"
                aria-label="Diagrama interactivo SVG"
            >
                {/* Grid */}
                <line stroke="var(--theme-carbon)" strokeWidth="1" strokeDasharray="4" />
                {/* Geometría — SIEMPRE usar CSS variables */}
                <line
                    stroke="var(--theme-terracota)"
                    strokeWidth={isActive('miLinea') ? 6 : 3}
                    opacity={isActive('miLinea') ? 1 : 0.5}
                />
                <circle
                    fill="var(--theme-terracota)"
                    r={isActive('miCirculo') ? 10 : 6}
                />
                <text
                    fill="var(--theme-carbon)"
                    className="font-serif font-bold"
                />
            </svg>
        </div>
    );
};
```

**CRÍTICO:** SVG DEBE usar `var(--theme-<token>)` para TODOS los colores. Esto asegura soporte de modo oscuro. **NUNCA usar valores hex directamente en SVG.**

---

## 8. Patrón Canvas 2D

```typescript
import { useRef, useEffect } from 'react';
import { useMathStore } from '../../store/MathStoreContext';

export const MyCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const highlight = useMathStore(state => state.variables['highlight']);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let animId: number;

        // Leer colores desde CSS variables
        const getVar = (name: string) =>
            getComputedStyle(document.documentElement).getPropertyValue(name).trim();

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const terracota = getVar('--theme-terracota');
            const carbon = getVar('--theme-carbon');

            ctx.strokeStyle = terracota;
            ctx.lineWidth = 3;
            ctx.beginPath();
            // ... dibujar
            ctx.stroke();

            animId = requestAnimationFrame(render);
        };
        animId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(animId);
    }, [highlight]);

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full touch-none"
            width={600}
            height={400}
            role="img"
            aria-label="Animación interactiva"
        />
    );
};
```

---

## 9. Patrón HTML/CSS

Para datos estructurados (árboles, matrices, tarjetas, árboles de probabilidad):

```typescript
import React from 'react';
import { useMathStore } from '../../store/MathStoreContext';

export const ProbabilityTree: React.FC = () => {
    const highlight = useMathStore(state => state.variables['highlight']);
    const isActive = (id: string) => highlight === id;

    return (
        <div className="w-full p-8 font-serif">
            <div className={`transition-all ${isActive('rama-a') ? 'scale-105 text-terracota' : 'text-carbon'}`}>
                Rama A
            </div>
            {/* ... */}
        </div>
    );
};
```

---

## 10. Diagramas de Modelo

Los diagramas de modelo NO usan `InteractiveElement` ni highlight. Muestran una **estructura concreta completa** — todo el modelo a la vez, como visualización estática o explorable.

```typescript
import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';

export const ModeloTresPuntos = () => {
    const boardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!boardRef.current) return;
        const board = JXG.JSXGraph.initBoard(boardRef.current, {
            boundingbox: [-1, 4, 4, -1],
            axis: false,
            showCopyright: false,
            showNavigation: false,
            keepaspectratio: true,
        });

        // Tres puntos no colineales (el universo)
        const pA = board.create('point', [1, 1], {
            fixed: true, fillColor: '#C86446', strokeColor: '#C86446', size: 6,
            name: 'A', label: { fontSize: 20, cssClass: 'font-serif font-bold' }
        });
        const pB = board.create('point', [3, 2], {
            fixed: true, fillColor: '#C86446', strokeColor: '#C86446', size: 6,
            name: 'B', label: { fontSize: 20, cssClass: 'font-serif font-bold' }
        });
        const pC = board.create('point', [2, 3], {
            fixed: true, fillColor: '#C86446', strokeColor: '#C86446', size: 6,
            name: 'C', label: { fontSize: 20, cssClass: 'font-serif font-bold' }
        });

        // Las "rectas" (pares de puntos)
        board.create('segment', [pA, pB], { strokeColor: '#5D7080', strokeWidth: 2, dash: 2 });
        board.create('segment', [pB, pC], { strokeColor: '#5D7080', strokeWidth: 2, dash: 2 });
        board.create('segment', [pC, pA], { strokeColor: '#5D7080', strokeWidth: 2, dash: 2 });

        board.create('text', [0.5, 3.5, 'Modelo de 3 puntos'], {
            fontSize: 14, cssClass: 'font-serif italic', color: '#333333'
        });

        board.update();
        return () => { JXG.JSXGraph.freeBoard(board); };
    }, []);

    return (
        <div
            ref={boardRef}
            className="w-full h-full min-h-[400px]"
            role="img"
            aria-label="Modelo de 3 puntos: geometría de incidencia minimal"
        />
    );
};
```

**Diagramas de modelo:**
- NO usan `useMathStore` ni highlight
- NO tienen conexiones `InteractiveElement`
- Se exportan como `Diagram` (no `Simulation`) en el MDX
- Tienen `"hasDiagram": true` en metadata (no `hasSimulation`)

---

## 11. Diagramas de Falacias / Contraejemplos

Para diagramas que muestran un razonamiento **incorrecto** o una demostración falaz:

- Mostrar el paso incorrecto en `granada` (color de error)
- Mostrar la versión correcta junto a ella en `musgo` (color de verificado)
- Usar anotaciones explicando POR QUÉ es incorrecto

Ejemplo: La "Falacia del triángulo isósceles" muestra una demostración defectuosa de que todos los triángulos son isósceles, con el error resaltado en `granada` y la construcción correcta en `carbon`.

---

## 12. Principios de Animación

### 12.1 Cuándo Animar

- **Reveal:** Mostrar elementos apareciendo uno a uno para coincidir con los pasos de la demostración
- **Transición:** Mover suavemente entre estados (p. ej. arrastrar un punto actualiza mediciones en tiempo real)
- **Énfasis:** Pulsar o resaltar un elemento cuando el usuario pasa el cursor sobre texto relacionado

### 12.2 Cuándo NO Animar

- Rotación u oscilación continua sin propósito pedagógico
- Animaciones más rápidas que 200ms o más lentas que 800ms (incomodidad cognitiva)
- Animaciones que cambian el layout mientras el usuario interactúa
- Efectos gratuitos (partículas, glow, sombras) — violan la estética Arts & Crafts

### 12.3 Patrones de Animación

**Reveal (elementos aparecen al cambiar paso):**
```typescript
useEffect(() => {
    element.setAttribute({ visible: isHighlight('step2') });
    board.update();
}, [highlight]);
```

**Énfasis (pulso al hacer hover):**
```typescript
// Usar CSS transition o setAttribute con un breve setTimeout
```

### 12.4 Rendimiento

- Para JSXGraph: minimizar llamadas `board.update()`. Agrupar cambios en un solo `useEffect`
- Para SVG: usar CSS `transition` en lugar de bucles de animación JavaScript
- Para Canvas: mantener los bucles `requestAnimationFrame` ligeros — sin cómputo pesado por frame
- Evitar animar más de 3–4 elementos simultáneamente

---

## 13. Conexión con MDX

### Paso 1: Crear el componente del diagrama

Archivo: `src/diagrams/<Categoria>/<Nombre>.tsx`

### Paso 2: En el MDX, importar y exportar

**Para teoremas/axiomas/definiciones (SimulationLayout):**
```typescript
import { MyDiagram } from '../../diagrams/Categoria/MyDiagram';
export const Simulation = MyDiagram;

export const metadata = {
  ...
  "hasSimulation": true,
};
```

**Para modelos (renderizado inline):**
```typescript
import { ModelDiagram } from '../../diagrams/Models/ModelDiagram';
export const Diagram = ModelDiagram;

export const metadata = {
  ...
  "hasDiagram": true,
};
```

**Para demostraciones (dentro de Component):**
```typescript
import { MyDiagram } from '../../diagrams/Teoremas/MyDiagram';

export const Component = () => (
    <DemonstrationSection diagrams={{ "default": MyDiagram }}>
        <MedievalStep number={1} target="miElemento" title="...">
            <InteractiveElement target="miElemento" color="terracota">texto</InteractiveElement>
        </MedievalStep>
    </DemonstrationSection>
);
```

### Paso 3: En el cuerpo MDX, referenciar elementos del diagrama

```mdx
<InteractiveElement target="segAB" color="terracota">
  lado AB
</InteractiveElement>
```

**IMPORTANTÍSIMO:** `InteractiveElement` DEBE importarse desde `../../components/ui/VisualBind`. Es el ÚNICO `InteractiveElement` del proyecto. Escribe en `MathStore.highlight`.

---

## 14. Diseño Responsivo

- **JSXGraph:** Container `min-h-[500px]` + `w-full h-full`. Usar `keepaspectratio: true`.
- **SVG:** `viewBox` + `className="w-full max-w-[400px] h-auto"`. Escala proporcionalmente.
- **Canvas:** Atributos `width`/`height` explícitos + container CSS `w-full h-full`.
- **Siempre usar `touch-none`** en SVG/Canvas para evitar interferencia de scroll en móvil.
- Alturas mínimas: `min-h-[400px]` (SVG/Canvas), `min-h-[500px]` (JSXGraph).

---

## 15. Diagramas de Demostración (Split Layout)

Para demostraciones multi-paso con `layout: "split"`:

### 15.1 Regla Fundamental: Diagrama por Paso

**CADA PASO de una demostración DEBE tener su propio diagrama** que ilustre ese paso específico. Esta es la regla por defecto.

La **excepción** es cuando conviene unificar los diagramas: si varios pasos comparten la misma construcción geométrica y solo cambia qué elemento se resalta, un solo diagrama con highlight reactivo es más claro que múltiples diagramas casi idénticos.

| Patrón | Cuándo usar | Cómo |
|---|---|---|
| **Un diagrama por paso** | POR DEFECTO. Cada paso introduce elementos nuevos o cambia la construcción | `diagrams={{ "step1": Step1, "step2": Step2, ... }}` |
| **Un diagrama unificado** | Los pasos comparten construcción, solo cambia el highlight | `diagrams={{ "default": Shared }}` o `diagram={<Shared />}` |
| **Híbrido** | Algunos pasos comparten, otros introducen elementos | `diagrams={{ "default": Shared, "step3": Step3 }}` |

### 15.2 Transiciones Sticky

Cuando hay varios diagramas (patrón por paso o híbrido), el `DemonstrationSection` implementa **transiciones sticky**:

- El panel izquierdo (diagrama) es **`position: sticky`** — permanece fijo en pantalla mientras el texto scrollea
- Los diagramas cambian con una **transición de fundido suave** (opacity 700ms ease-in-out)
- El diagrama activo se determina por `MathStore.variables['highlight']`: si el `target` del `MedievalStep` visible coincide con una clave de `diagrams`, ese diagrama se muestra
- Si ningún `target` coincide, se muestra el primer diagrama del mapa

Esto asegura que el estudiante siempre vea el diagrama correcto para el paso que está leyendo, sin perder el contexto visual.

### 15.3 Referencias al Diagrama — Obligatorias

**TODO en el texto que se refiera a un elemento del diagrama DEBE tener un `<InteractiveElement>` correspondiente.** Sin excepciones.

Esto incluye:
- Puntos, segmentos, ángulos, polígonos mencionados en prosa
- Variables que corresponden a elementos visuales ($a$, $b$, $c$ si son lados visibles)
- **Referencias dentro de fórmulas**: envolver cada variable en `<InteractiveElement>`:
  ```mdx
  <InteractiveElement target="cateto-a" color="terracota">$a$</InteractiveElement>^2 +
  <InteractiveElement target="cateto-b" color="salvia">$b$</InteractiveElement>^2 =
  <InteractiveElement target="hipotenusa" color="pizarra">$c$</InteractiveElement>^2
  ```
- **Si dentro de una fórmula no se puede** (LaTeX complejo con fracciones, subíndices...), **explicar fuera de la fórmula** a qué se refiere cada símbolo:
  ```mdx
  <Formula>
    $$ \frac{AD}{DB} = \frac{AE}{EC} $$
  </Formula>
  donde <InteractiveElement target="seg-ad">$AD$</InteractiveElement> es el segmento entre $A$ y $D$,
  <InteractiveElement target="seg-db">$DB$</InteractiveElement> entre $D$ y $B$, etc.
  ```

Cada `<MedievalStep>` DEBE contener al menos un `<InteractiveElement>`. Si un paso no tiene nada que resaltar en el diagrama, no necesita diagrama (y probablemente pertenece a la sección de análisis, no a un paso de demostración).

### 15.4 Approach A — Un Diagrama por Paso (POR DEFECTO)

Cada paso tiene su propio componente de diagrama:

```mdx
<DemonstrationSection diagrams={{
    "step1": Step1Diagram,
    "step2": Step2Diagram,
    "step3": Step3Diagram
}}>
  <MedievalStep number={1} target="step1" title="Construcción">
    Partimos de <InteractiveElement target="punto-a" color="terracota">$A$</InteractiveElement>...
  </MedievalStep>
  <MedievalStep number={2} target="step2" title="Razonamiento">
    Por la propiedad de <ConceptLink targetId="axioma-congruencia-1">transporte</ConceptLink>,
    el <InteractiveElement target="segmento-cd" color="salvia">segmento $CD$</InteractiveElement>...
  </MedievalStep>
  <MedievalStep number={3} target="step3" title="Conclusión">
    ... $\blacksquare$
  </MedievalStep>
</DemonstrationSection>
```

Cada `StepNDiagram` es un componente independiente que muestra la construcción geométrica tal como está en ese paso del razonamiento.

### 15.5 Approach B — Un Solo Diagrama Unificado (EXCEPCIÓN)

Cuando los pasos comparten la misma construcción y solo cambia el highlight, un solo diagrama con lógica reactiva:

```typescript
useEffect(() => {
    // RESET — TODOS los atributos modificados
    lineAB.setAttribute({ strokeWidth: 2, strokeColor: '#5D7080', strokeOpacity: 1 });
    angleC.setAttribute({ fillColor: '#A2C2A2', fillOpacity: 0.2 });

    // APLICAR highlight
    if (isHighlight('segAB')) lineAB.setAttribute({ strokeWidth: 6, strokeColor: '#C86446' });
    if (isHighlight('angleC')) angleC.setAttribute({ fillColor: '#C86446', fillOpacity: 0.5 });

    board.update();
}, [highlight]);
```

**CRÍTICO:** Todo atributo modificado por cualquier condición de highlight DEBE restaurarse explícitamente a su valor por defecto en el bloque de reset. Omitir un reset causa highlights "pegados".

### 15.6 `DemonstrationSection` — cómo funciona

- Lee `MathStore.variables['highlight']` para decidir qué diagrama mostrar
- Si se pasa `diagrams` (mapa), busca el diagrama cuya clave coincide con `highlight`; si no coincide, muestra el primero
- Si se pasa `diagram` (single), lo muestra siempre
- Layout: panel izquierdo sticky (diagrama), panel derecho scrolleable (texto con MedievalSteps)
- Transiciones entre diagramas: opacity 700ms ease-in-out (fundido suave)

---

## 16. Modo Oscuro

Los diagramas DEBEN funcionar en modo claro y oscuro.

### JSXGraph (leer CSS variables en runtime)

```typescript
function getCSSVar(name: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// Observar cambios de tema para re-leer colores
useEffect(() => {
    const observer = new MutationObserver(() => {
        if (board) {
            const lienzo = getCSSVar('--theme-lienzo');
            board.renderer.container.style.backgroundColor = lienzo;
            board.update();
        }
    });
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
    });
    return () => observer.disconnect();
}, []);
```

### SVG (usar CSS variables — modo oscuro automático)

SVG usando `var(--theme-*)` se adapta automáticamente al modo oscuro porque las CSS variables cambian cuando se aplica `.dark` al `<html>`.

**NUNCA usar valores hex en SVG.** Siempre usar `var(--theme-<token>)`.

---

## 17. Accesibilidad

### Color y Contraste

- Todos los elementos interactivos DEBEN tener **contraste suficiente** contra el fondo:
  - Texto: ratio de contraste mínimo 4.5:1 contra el fondo
  - Elementos interactivos (puntos, líneas): mínimo 3:1 contra el fondo
- **NO depender solo del color** para transmitir información. Usar forma, tamaño, posición y etiquetas además de color.

### Navegación por Teclado

- Los diagramas DEBERÍAN ser focusables: `<div ref={...} tabIndex={0} role="img" aria-label="...">`
- Para controles interactivos (sliders, puntos arrastrables), asegurar equivalentes de teclado (p. ej. flechas para sliders)
- Los sliders de JSXGraph soportan input de teclado nativamente; asegurar que sean alcanzables vía Tab

### Etiquetas ARIA

```typescript
<div
    ref={boardRef}
    className="w-full h-full min-h-[500px]"
    role="img"
    aria-label="Diagrama interactivo: construcción del triángulo equilátero. Los puntos A, B y C son vértices. Arrastre los puntos para explorar."
    tabIndex={0}
/>
```

---

## 18. Rendimiento

- **JSXGraph:** Minimizar elementos. Eliminar ejes/grid innecesarios. Usar `freeBoard` en cleanup.
- **SVG:** Usar CSS para transiciones (`transition: all 0.3s`) en lugar de bucles de animación JavaScript.
- **Canvas:** Mantener animaciones `requestAnimationFrame` por debajo de 16ms por frame. Usar `will-change: transform` en el container del canvas.
- **General:** Evitar re-renders innecesarios. Memoizar componentes de diagrama con `React.memo` si reciben props estables.
- **Efectos de highlight:** Agrupar todas las llamadas `setAttribute` y llamar `board.update()` una sola vez, no por elemento.

---

## 19. Organización de Archivos

```
src/diagrams/
  <Categoria>/
    <Nombre>.tsx           (componente del diagrama — PascalCase)
```

**Categorías existentes con contenido:**

| Categoría | Contenido | Estado |
|---|---|---|
| `Definiciones/` | Diagramas de definiciones (triángulo, ángulo, circunferencia, etc.) | Activa |
| `Axiomas/` | Visualizaciones de axiomas (incidencia, paralelas, Pasch, SAS) | Activa |
| `Teoremas/` | Diagramas de demostraciones de teoremas (Pitágoras, Tales, etc.) | Activa |
| `Demos/` | Diagramas de demostraciones adicionales | Activa |
| `Theorems/` | Visualizaciones de teoremas (a consolidar con Teoremas/) | Activa |
| `Models/` | Diagramas de modelos (3 puntos, Fano, Poincaré, cartesiano) | Activa |

**Categorías reservadas (vacías, para contenido futuro):**

`Algebra/`, `Analisis/`, `Calculo/`, `CasosUso/`, `Estadistica/`, `Euclides/`, `Ejercicios/`, `Geometria/`, `LinearAlgebra/`, `MetodosDemostracion/`, `Pitagoras/`, `Probabilidad/`

> Al crear un nuevo diagrama, usar la categoría existente más adecuada. Si ninguna encaja, crear una nueva siguiendo el naming PascalCase.

---

## 20. Checklist de Calidad

### Técnico

- [ ] El diagrama usa la tecnología de renderizado correcta (JSXGraph/SVG/Canvas/HTML)
- [ ] TODOS los colores usan la paleta Arts & Crafts (tokens de §3) — sin hex arbitrarios
- [ ] SVG usa `var(--theme-<token>)` CSS variables (nunca hex)
- [ ] JSXGraph tiene `showCopyright: false`, `showNavigation: false` y `keepaspectratio: true`
- [ ] JSXGraph tiene cleanup adecuado (`freeBoard` en return de useEffect)
- [ ] El diagrama tiene clase `touch-none` (SVG/Canvas)
- [ ] Altura mínima adecuada (`min-h-[400px]` SVG, `min-h-[500px]` JSXGraph)

### Interactividad

- [ ] El diagrama lee de `MathStore.variables['highlight']`
- [ ] Maneja highlight como string, string[] y null (usar `isHighlight` helper)
- [ ] Los nombres de elementos/target coinciden exactamente entre diagrama y MDX `<InteractiveElement>`
- [ ] El `useEffect` de highlight restaura CADA atributo modificado en el bloque de reset
- [ ] Cada paso del cuerpo de la demostración tiene al menos un `<InteractiveElement>`
- [ ] Los elementos interactivos tienen feedback visual en hover/highlight
- [ ] El diagrama produce un estado visual distinto para cada valor de target

### Diseño Visual

- [ ] Un elemento primario por estado de vista (jerarquía visual §4.1)
- [ ] Espacio en blanco: 15–20% de margen alrededor del contenido
- [ ] Sin animaciones gratuitas o efectos
- [ ] Las etiquetas usan `font-serif` y están posicionadas para evitar solapamiento
- [ ] Los colores tienen significado semántico consistente dentro del diagrama

### Modo Oscuro

- [ ] SVG usa CSS variables (soporte automático de modo oscuro)
- [ ] JSXGraph tiene MutationObserver para cambios de tema (§16)
- [ ] Todos los colores son legibles en modo claro y oscuro

### Accesibilidad

- [ ] Contraste suficiente (4.5:1 texto, 3:1 elementos interactivos)
- [ ] La información no se transmite solo por color
- [ ] El container del diagrama tiene `role="img"` y `aria-label`
- [ ] Los controles interactivos tienen alternativas de teclado

### Organización

- [ ] El archivo está en el directorio de categoría correcto (§19)
- [ ] El nombre del componente sigue la convención PascalCase
- [ ] Para teoremas/axiomas: exportado como `Simulation` con `"hasSimulation": true`
- [ ] Para modelos: exportado como `Diagram` con `"hasDiagram": true`
- [ ] No hay `\sen` en ningún sitio — LaTeX usa `\sin`, texto plano usa `sin`

---

## Ejemplos de referencia

Diagramas canónicos bien hechos están en `examples/`:
- `examples/JSXGraphCanon.tsx` — Patrón JSXGraph completo con highlight, store y cleanup
- `examples/SVGCanon.tsx` — Patrón SVG con CSS variables y dark mode
