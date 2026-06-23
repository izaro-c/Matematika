import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '@/app/providers/MathStoreContext';

export const DemoPitagorasAreas = () => {
    const boardRef = useRef<HTMLDivElement>(null);
    const elementsRef = useRef<Record<string, unknown>>({});
    
    const highlight = useMathStore(state => state.variables['highlight']);
    const isHighlight = (id: string) =>
        Array.isArray(highlight)
            ? (highlight as string[]).includes(id)
            : highlight === id;

    useEffect(() => {
        if (!boardRef.current) return;
        
        const board = JXG.JSXGraph.initBoard(boardRef.current, {
            boundingbox: [-1, 9, 8, -1.5],
            axis: false,
            showCopyright: false,
            showNavigation: false,
            keepaspectratio: true,
            pan: { enabled: false },
            zoom: { wheel: false },
        });

        const a = 3;
        const b = 4;
        const L = a + b; // 7

        // Cuadrado exterior
        const pE1 = board.create('point', [0, 0], { visible: false });
        const pE2 = board.create('point', [L, 0], { visible: false });
        const pE3 = board.create('point', [L, L], { visible: false });
        const pE4 = board.create('point', [0, L], { visible: false });

        const outerSquare = board.create('polygon', [pE1, pE2, pE3, pE4], {
            fillOpacity: 0,
            borders: { strokeColor: '#333333', strokeWidth: 2 }
        });

        // Slider para la animación
        const slider = board.create('slider', [[1, -1], [6, -1], [0, 0, 1]], {
            name: 't',
            snapWidth: 0.01,
            strokeColor: '#C86446',
            fillColor: '#C86446',
            label: { strokeColor: '#333333', fontSize: 16 }
        });
        
        // Función auxiliar para crear polígonos dependientes de t
        const createMovingTriangle = (_id: string, color: string, p1Fn: () => number[], p2Fn: () => number[], p3Fn: () => number[]) => {
            const p1 = board.create('point', [() => p1Fn()[0], () => p1Fn()[1]], { visible: false });
            const p2 = board.create('point', [() => p2Fn()[0], () => p2Fn()[1]], { visible: false });
            const p3 = board.create('point', [() => p3Fn()[0], () => p3Fn()[1]], { visible: false });
            
            const poly = board.create('polygon', [p1, p2, p3], {
                fillColor: color,
                fillOpacity: 0.3,
                borders: { strokeColor: color, strokeWidth: 2 }
            });
            return { p1, p2, p3, poly };
        };

        // Triángulos
        // T1: (0,0), (a,0), (0,b)
        const t1 = createMovingTriangle('triangulo-1', 'var(--theme-salvia)',
            () => [0, 0],
            () => [a, 0],
            () => [0, b]
        );

        // T2: (a+b, 0) -> (a+b, b*t); (a+b, a) -> (a+b, a+b*t); (a, 0) -> (a, b*t)
        const t2 = createMovingTriangle('triangulo-2', 'var(--theme-salvia)',
            () => [L, b * slider.Value()],
            () => [L, a + b * slider.Value()],
            () => [a, b * slider.Value()]
        );

        // T3: (a+b, a+b) -> (a+b-b*t, a+b-a*t); (b, a+b) -> (b-b*t, a+b-a*t); (a+b, a) -> (a+b-b*t, a-a*t)
        const t3 = createMovingTriangle('triangulo-3', 'var(--theme-salvia)',
            () => [L - b * slider.Value(), L - a * slider.Value()],
            () => [b - b * slider.Value(), L - a * slider.Value()],
            () => [L - b * slider.Value(), a - a * slider.Value()]
        );

        // T4: (0, a+b) -> (a*t, a+b); (0, b) -> (a*t, b); (b, a+b) -> (b+a*t, a+b)
        const t4 = createMovingTriangle('triangulo-4', 'var(--theme-salvia)',
            () => [a * slider.Value(), L],
            () => [a * slider.Value(), b],
            () => [b + a * slider.Value(), L]
        );

        // Áreas vacías
        // Area c^2 (centro)
        // Definida por los vértices libres cuando t=0:
        // (a,0), (a+b,a), (b,a+b), (0,b)
        const emptyC = board.create('polygon', [
            [a, 0], [L, a], [b, L], [0, b]
        ], {
            fillColor: 'var(--theme-pizarra)',
            fillOpacity: () => 0.5 * (1 - slider.Value()),
            borders: { strokeWidth: 0 },
            vertices: { visible: false }
        });
        // Area a^2 (top left)
        const emptyA = board.create('polygon', [
            [0, b], [a, b], [a, L], [0, L]
        ], {
            fillColor: 'var(--theme-terracota)',
            fillOpacity: () => 0.5 * slider.Value(),
            borders: { strokeWidth: 0 },
            vertices: { visible: false }
        });

        // Area b^2 (bottom right)
        const emptyB = board.create('polygon', [
            [a, 0], [L, 0], [L, b], [a, b]
        ], {
            fillColor: 'var(--theme-terracota)',
            fillOpacity: () => 0.5 * slider.Value(),
            borders: { strokeWidth: 0 },
            vertices: { visible: false }
        });

        elementsRef.current = { 
            board, slider,
            t1: t1.poly, t2: t2.poly, t3: t3.poly, t4: t4.poly,
            outerSquare, emptyC, emptyA, emptyB
        };

        return () => {
            JXG.JSXGraph.freeBoard(board);
            elementsRef.current = {};
        };
    }, []);

    // Highlight reactivo
    useEffect(() => {
        const els = elementsRef.current as any;
        if (!els.board) return;

        const { t1, t2, t3, t4, outerSquare, emptyC, emptyA, emptyB } = els;

        // Reset
        [t1, t2, t3, t4].forEach(t => {
            t.setAttribute({ fillOpacity: 0.3 });
            t.borders.forEach((b: any) => b.setAttribute({ strokeWidth: 2 }));
        });
        outerSquare.borders.forEach((b: any) => b.setAttribute({ strokeWidth: 2 }));

        emptyC.setAttribute({ fillOpacity: () => 0.5 * (1 - els.slider.Value()) });
        emptyA.setAttribute({ fillOpacity: () => 0.5 * els.slider.Value() });
        emptyB.setAttribute({ fillOpacity: () => 0.5 * els.slider.Value() });

        // Apply highlights
        if (isHighlight('triangulos')) {
            [t1, t2, t3, t4].forEach(t => {
                t.setAttribute({ fillOpacity: 0.6 });
                t.borders.forEach((b: any) => b.setAttribute({ strokeWidth: 4 }));
            });
        }
        
        if (isHighlight('cuadrado-exterior')) {
            outerSquare.borders.forEach((b: any) => b.setAttribute({ strokeWidth: 5 }));
        }

        if (isHighlight('area-c')) {
            emptyC.setAttribute({ fillOpacity: () => 0.8 * (1 - els.slider.Value()) });
        }

        if (isHighlight('area-a')) {
            emptyA.setAttribute({ fillOpacity: () => 0.8 * els.slider.Value() });
        }

        if (isHighlight('area-b')) {
            emptyB.setAttribute({ fillOpacity: () => 0.8 * els.slider.Value() });
        }

        if (isHighlight('segmento-a')) {
            t1.borders[0].setAttribute({ strokeColor: 'var(--theme-terracota)', strokeWidth: 5 });
            t2.borders[0].setAttribute({ strokeColor: 'var(--theme-terracota)', strokeWidth: 5 });
            t3.borders[0].setAttribute({ strokeColor: 'var(--theme-terracota)', strokeWidth: 5 });
            t4.borders[0].setAttribute({ strokeColor: 'var(--theme-terracota)', strokeWidth: 5 });
        }
        
        if (isHighlight('segmento-b')) {
            t1.borders[2].setAttribute({ strokeColor: 'var(--theme-salvia)', strokeWidth: 5 });
            t2.borders[2].setAttribute({ strokeColor: 'var(--theme-salvia)', strokeWidth: 5 });
            t3.borders[2].setAttribute({ strokeColor: 'var(--theme-salvia)', strokeWidth: 5 });
            t4.borders[2].setAttribute({ strokeColor: 'var(--theme-salvia)', strokeWidth: 5 });
        }

        if (isHighlight('segmento-c')) {
            t1.borders[1].setAttribute({ strokeColor: 'var(--theme-pizarra)', strokeWidth: 5 });
            t2.borders[1].setAttribute({ strokeColor: 'var(--theme-pizarra)', strokeWidth: 5 });
            t3.borders[1].setAttribute({ strokeColor: 'var(--theme-pizarra)', strokeWidth: 5 });
            t4.borders[1].setAttribute({ strokeColor: 'var(--theme-pizarra)', strokeWidth: 5 });
        }

        els.board.update();
    }, [highlight]);

    return (
        <div
            ref={boardRef}
            className="w-full h-full min-h-[500px]"
            role="img"
            aria-label="Demostración de Pitágoras por Equivalencia de Áreas"
            tabIndex={0}
        />
    );
};
