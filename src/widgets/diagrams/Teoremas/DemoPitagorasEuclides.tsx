import { useRef, useEffect, useCallback } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '@/app/providers/MathStoreContext';

export const DemoPitagorasEuclides = () => {
    const boardRef = useRef<HTMLDivElement>(null);
    const elementsRef = useRef<Record<string, unknown>>({});
    const step = useMathStore(state => state.variables['step']);
    const highlight = useMathStore(state => state.variables['highlight']);

    const isStep = useCallback((id: string) => {
        return Array.isArray(step) ? (step as string[]).includes(id) : step === id;
    }, [step]);

    const isHighlight = useCallback((id: string) => {
        return Array.isArray(highlight) ? (highlight as string[]).includes(id) : highlight === id;
    }, [highlight]);

    useEffect(() => {
        if (!boardRef.current) return;
        const board = JXG.JSXGraph.initBoard(boardRef.current, {
            boundingbox: [-8, 12, 13, -8],
            axis: false,
            showCopyright: false,
            showNavigation: false,
            keepaspectratio: true,
            pan: { enabled: false },
            zoom: { wheel: false },
        });

        // Colores semánticos
        const getCSSVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#333333';
        const C_TERRACOTA = getCSSVar('--theme-terracota') || '#C86446'; // a
        const C_SALVIA = getCSSVar('--theme-salvia') || '#A2C2A2';       // b
        const C_PIZARRA = getCSSVar('--theme-pizarra') || '#5D7080';     // c
        const C_CARBON = getCSSVar('--theme-carbon') || '#333333';

        const axisX = board.create('line', [[0, 0], [1, 0]], { visible: false });
        const axisY = board.create('line', [[0, 0], [0, 1]], { visible: false });

        const C = board.create('point', [0, 0], { name: 'C', fixed: true, size: 4, fillColor: C_CARBON, strokeColor: C_CARBON, label: { fontSize: 18, cssClass: 'font-serif font-bold italic' } });
        const A = board.create('glider', [0, 4, axisY], { name: 'A', size: 5, fillColor: C_CARBON, strokeColor: C_CARBON, label: { fontSize: 18, cssClass: 'font-serif font-bold italic' } });
        const B = board.create('glider', [5, 0, axisX], { name: 'B', size: 5, fillColor: C_CARBON, strokeColor: C_CARBON, label: { fontSize: 18, cssClass: 'font-serif font-bold italic' } });

        // Evitar que pasen el origen
        (A as any).on('drag', () => { if ((A as any).Y() < 1) (A as any).moveTo([0, 1], 0); });
        (B as any).on('drag', () => { if ((B as any).X() < 1) (B as any).moveTo([1, 0], 0); });

        // Triángulo
        const polyABC = board.create('polygon', [C, B, A], {
            fillOpacity: 0.1, borders: { strokeWidth: 3 }, vertices: { visible: false }
        });
        (polyABC as any).borders[0].setAttribute({ strokeColor: C_TERRACOTA, name: 'a', withLabel: true, label: { strokeColor: C_TERRACOTA, fontSize: 18, cssClass: 'font-serif italic', offset: [10, -15] } }); // CB = a
        (polyABC as any).borders[1].setAttribute({ strokeColor: C_PIZARRA, name: 'c', withLabel: true, label: { strokeColor: C_PIZARRA, fontSize: 18, cssClass: 'font-serif italic', offset: [15, 15] } });   // BA = c
        (polyABC as any).borders[2].setAttribute({ strokeColor: C_SALVIA, name: 'b', withLabel: true, label: { strokeColor: C_SALVIA, fontSize: 18, cssClass: 'font-serif italic', offset: [-20, 10] } });    // AC = b

        // Ángulo recto
        board.create('angle', [B, C, A], { type: 'square', size: 30, fillColor: C_CARBON, strokeColor: C_CARBON, visible: true });

        // Cuadrado sobre b (AC) -> ACKH
        const K = board.create('point', [() => -(A as any).Y(), () => (A as any).Y()], { name: 'K', visible: false, size: 3, fillColor: C_CARBON, strokeColor: C_CARBON, label: { fontSize: 16, cssClass: 'font-serif font-bold italic' } });
        const H = board.create('point', [() => -(A as any).Y(), 0], { name: 'H', visible: false });
        const sqB = board.create('polygon', [C, A, K, H], {
            fillColor: C_SALVIA, fillOpacity: 0.2, borders: { strokeColor: C_SALVIA, strokeWidth: 2 }, vertices: { visible: false }
        });

        // Cuadrado sobre a (CB) -> CBFG
        const F = board.create('point', [() => (B as any).X(), () => -(B as any).X()], { name: 'F', visible: false, size: 3, fillColor: C_CARBON, strokeColor: C_CARBON, label: { fontSize: 16, cssClass: 'font-serif font-bold italic' } });
        const G = board.create('point', [0, () => -(B as any).X()], { name: 'G', visible: false });
        const sqA = board.create('polygon', [C, B, F, G], {
            fillColor: C_TERRACOTA, fillOpacity: 0.2, borders: { strokeColor: C_TERRACOTA, strokeWidth: 2 }, vertices: { visible: false }
        });

        // Cuadrado sobre c (AB) -> ABED
        const E = board.create('point', [() => (B as any).X() + (A as any).Y(), () => (B as any).X()], { name: 'E', visible: false, size: 3, fillColor: C_CARBON, strokeColor: C_CARBON, label: { fontSize: 16, cssClass: 'font-serif font-bold italic' } });
        const D = board.create('point', [() => (A as any).Y(), () => (A as any).Y() + (B as any).X()], { name: 'D', visible: false, size: 3, fillColor: C_CARBON, strokeColor: C_CARBON, label: { fontSize: 16, cssClass: 'font-serif font-bold italic' } });
        const sqC = board.create('polygon', [A, B, E, D], {
            fillColor: C_PIZARRA, fillOpacity: 0.2, borders: { strokeColor: C_PIZARRA, strokeWidth: 2 }, vertices: { visible: false }
        });

        // Altura y subdivisiones
        const lineAB = board.create('line', [A, B], { visible: false });
        const altC = board.create('perpendicular', [lineAB, C], { visible: false });
        const lineDE = board.create('line', [D, E], { visible: false });
        const L = board.create('intersection', [altC, lineAB, 0], { name: 'L', visible: false });
        const M = board.create('intersection', [altC, lineDE, 0], { name: 'M', visible: false });

        const altSegment = board.create('segment', [C, M], { strokeColor: C_CARBON, strokeWidth: 2, dash: 2 });

        // Rectángulos en el cuadrado c
        const rectADML = board.create('polygon', [A, D, M, L], {
            fillColor: C_SALVIA, fillOpacity: 0, borders: { strokeColor: C_SALVIA, strokeWidth: 2, visible: false }, vertices: { visible: false }
        });
        const rectBEML = board.create('polygon', [B, E, M, L], {
            fillColor: C_TERRACOTA, fillOpacity: 0, borders: { strokeColor: C_TERRACOTA, strokeWidth: 2, visible: false }, vertices: { visible: false }
        });

        // Líneas auxiliares
        const lineCD = board.create('segment', [C, D], { strokeColor: C_CARBON, strokeWidth: 2, dash: 1, visible: false });
        const lineKB = board.create('segment', [K, B], { strokeColor: C_CARBON, strokeWidth: 2, dash: 1, visible: false });
        const lineCE = board.create('segment', [C, E], { strokeColor: C_CARBON, strokeWidth: 2, dash: 1, visible: false });
        const lineAF = board.create('segment', [A, F], { strokeColor: C_CARBON, strokeWidth: 2, dash: 1, visible: false });

        // Triángulos de congruencia
        const triACD = board.create('polygon', [A, C, D], {
            fillColor: C_SALVIA, fillOpacity: 0, borders: { strokeWidth: 0 }, vertices: { visible: false }
        });
        const triAKB = board.create('polygon', [A, K, B], {
            fillColor: C_SALVIA, fillOpacity: 0, borders: { strokeWidth: 0 }, vertices: { visible: false }
        });
        const triBCE = board.create('polygon', [B, C, E], {
            fillColor: C_TERRACOTA, fillOpacity: 0, borders: { strokeWidth: 0 }, vertices: { visible: false }
        });
        const triABF = board.create('polygon', [A, B, F], {
            fillColor: C_TERRACOTA, fillOpacity: 0, borders: { strokeWidth: 0 }, vertices: { visible: false }
        });

        elementsRef.current = {
            board,
            polyABC, sqA, sqB, sqC,
            D, K, E, F,
            altSegment, rectADML, rectBEML,
            lineCD, lineKB, lineCE, lineAF,
            triACD, triAKB, triBCE, triABF
        };

        board.update();
        return () => {
            JXG.JSXGraph.freeBoard(board);
            elementsRef.current = {};
        };
    }, []);

    useEffect(() => {
        const els = elementsRef.current as Record<string, any>;
        if (!els.board) return;

        // --- RESET ---
        els.polyABC.setAttribute({ fillOpacity: 0.1 });
        els.polyABC.borders.forEach((b: any) => b.setAttribute({ strokeWidth: 3 }));

        els.sqA.setAttribute({ fillOpacity: 0, borders: { strokeWidth: 1, strokeOpacity: 0.2 } });
        els.sqB.setAttribute({ fillOpacity: 0, borders: { strokeWidth: 1, strokeOpacity: 0.2 } });
        els.sqC.setAttribute({ fillOpacity: 0, borders: { strokeWidth: 1, strokeOpacity: 0.2 } });

        els.altSegment.setAttribute({ visible: false, strokeWidth: 2 });

        els.rectADML.setAttribute({ fillOpacity: 0 });
        els.rectADML.borders.forEach((b: any) => b.setAttribute({ visible: false, strokeWidth: 2 }));

        els.rectBEML.setAttribute({ fillOpacity: 0 });
        els.rectBEML.borders.forEach((b: any) => b.setAttribute({ visible: false, strokeWidth: 2 }));

        els.lineCD.setAttribute({ visible: false, strokeWidth: 2 });
        els.lineKB.setAttribute({ visible: false, strokeWidth: 2 });
        els.lineCE.setAttribute({ visible: false, strokeWidth: 2 });
        els.lineAF.setAttribute({ visible: false, strokeWidth: 2 });

        els.triACD.setAttribute({ fillOpacity: 0 });
        els.triAKB.setAttribute({ fillOpacity: 0 });
        els.triBCE.setAttribute({ fillOpacity: 0 });
        els.triABF.setAttribute({ fillOpacity: 0 });

        els.D.setAttribute({ visible: false });
        els.K.setAttribute({ visible: false });
        els.E.setAttribute({ visible: false });
        els.F.setAttribute({ visible: false });

        // --- 1. APLICAR VISIBILIDAD (STEP) ---

        if (isStep('triangulo')) {
            els.polyABC.setAttribute({ fillOpacity: 0.2 });
        }

        const showSquares = isStep('cuadrados') || isStep('altura') || isStep('triangulos-izq') || isStep('areas-izq') || isStep('triangulos-der') || isStep('areas-der') || isStep('cuadrados-final');
        if (showSquares) {
            els.sqA.setAttribute({ fillOpacity: 0.1, borders: { strokeWidth: 2, strokeOpacity: 1 } });
            els.sqB.setAttribute({ fillOpacity: 0.1, borders: { strokeWidth: 2, strokeOpacity: 1 } });
            els.sqC.setAttribute({ fillOpacity: 0.1, borders: { strokeWidth: 2, strokeOpacity: 1 } });
        }
        if (isStep('cuadrados')) {
            els.sqA.setAttribute({ fillOpacity: 0.2 });
            els.sqB.setAttribute({ fillOpacity: 0.2 });
            els.sqC.setAttribute({ fillOpacity: 0.2 });
        }

        if (isStep('altura') || isStep('triangulos-izq') || isStep('areas-izq') || isStep('triangulos-der') || isStep('areas-der') || isStep('cuadrados-final')) {
            els.altSegment.setAttribute({ visible: true });
        }

        if (isStep('altura')) {
            els.rectADML.borders.forEach((b: any) => b.setAttribute({ visible: true }));
            els.rectBEML.borders.forEach((b: any) => b.setAttribute({ visible: true }));
            els.sqC.setAttribute({ fillOpacity: 0 });
        }

        if (isStep('triangulos-izq')) {
            els.lineCD.setAttribute({ visible: true });
            els.lineKB.setAttribute({ visible: true });
            els.triACD.setAttribute({ fillOpacity: 0.3 });
            els.triAKB.setAttribute({ fillOpacity: 0.3 });
            els.sqB.setAttribute({ fillOpacity: 0.2 });
            els.sqC.setAttribute({ fillOpacity: 0.2 });
            els.D.setAttribute({ visible: true });
            els.K.setAttribute({ visible: true });
        }

        if (isStep('areas-izq')) {
            els.sqB.setAttribute({ fillOpacity: 0.4 });
            els.rectADML.setAttribute({ fillOpacity: 0.4 });
            els.rectADML.borders.forEach((b: any) => b.setAttribute({ visible: true, strokeWidth: 2 }));
        }

        if (isStep('triangulos-der')) {
            els.sqB.setAttribute({ fillOpacity: 0.1 });
            els.rectADML.setAttribute({ fillOpacity: 0.1 });
            els.rectADML.borders.forEach((b: any) => b.setAttribute({ visible: true, strokeWidth: 1 }));

            els.lineCE.setAttribute({ visible: true });
            els.lineAF.setAttribute({ visible: true });
            els.triBCE.setAttribute({ fillOpacity: 0.3 });
            els.triABF.setAttribute({ fillOpacity: 0.3 });
            els.sqA.setAttribute({ fillOpacity: 0.2 });
            els.sqC.setAttribute({ fillOpacity: 0.2 });
            els.E.setAttribute({ visible: true });
            els.F.setAttribute({ visible: true });
        }

        if (isStep('areas-der')) {
            els.sqB.setAttribute({ fillOpacity: 0.1 });
            els.rectADML.setAttribute({ fillOpacity: 0.1 });
            els.rectADML.borders.forEach((b: any) => b.setAttribute({ visible: true, strokeWidth: 1 }));

            els.sqA.setAttribute({ fillOpacity: 0.4 });
            els.rectBEML.setAttribute({ fillOpacity: 0.4 });
            els.rectBEML.borders.forEach((b: any) => b.setAttribute({ visible: true, strokeWidth: 2 }));
        }

        if (isStep('cuadrados-final')) {
            els.sqA.setAttribute({ fillOpacity: 0.5 });
            els.sqB.setAttribute({ fillOpacity: 0.5 });
            els.rectADML.setAttribute({ fillOpacity: 0.5 });
            els.rectBEML.setAttribute({ fillOpacity: 0.5 });
            els.rectADML.borders.forEach((b: any) => b.setAttribute({ visible: true, strokeWidth: 3 }));
            els.rectBEML.borders.forEach((b: any) => b.setAttribute({ visible: true, strokeWidth: 3 }));
            els.sqC.setAttribute({ fillOpacity: 0 });
        }

        // --- 2. APLICAR ÉNFASIS (HIGHLIGHT HOVER) ---

        if (isHighlight('triangulo-base')) {
            els.polyABC.setAttribute({ fillOpacity: 0.5 });
            els.polyABC.borders.forEach((b: any) => b.setAttribute({ strokeWidth: 6 }));
        }
        if (isHighlight('cateto-a')) {
            els.polyABC.borders[0].setAttribute({ strokeWidth: 6 });
        }
        if (isHighlight('cateto-b')) {
            els.polyABC.borders[2].setAttribute({ strokeWidth: 6 });
        }
        if (isHighlight('hipotenusa-c')) {
            els.polyABC.borders[1].setAttribute({ strokeWidth: 6 });
        }

        if (isHighlight('cuadrado-a')) {
            els.sqA.setAttribute({ fillOpacity: 0.5, borders: { strokeWidth: 4 } });
        }
        if (isHighlight('cuadrado-b')) {
            els.sqB.setAttribute({ fillOpacity: 0.5, borders: { strokeWidth: 4 } });
        }
        if (isHighlight('cuadrado-c')) {
            els.sqC.setAttribute({ fillOpacity: 0.5, borders: { strokeWidth: 4 } });
        }

        if (isHighlight('recta-altura')) {
            els.altSegment.setAttribute({ strokeWidth: 5 });
        }
        if (isHighlight('rectangulos-hipotenusa')) {
            els.rectADML.borders.forEach((b: any) => b.setAttribute({ strokeWidth: 4 }));
            els.rectBEML.borders.forEach((b: any) => b.setAttribute({ strokeWidth: 4 }));
        }

        if (isHighlight('triangulo-acd')) {
            els.triACD.setAttribute({ fillOpacity: 0.7 });
            els.lineCD.setAttribute({ strokeWidth: 4 });
            els.D.setAttribute({ visible: true, strokeWidth: 3 });
        }
        if (isHighlight('triangulo-akb')) {
            els.triAKB.setAttribute({ fillOpacity: 0.7 });
            els.lineKB.setAttribute({ strokeWidth: 4 });
            els.K.setAttribute({ visible: true, strokeWidth: 3 });
        }

        if (isHighlight('rectangulo-izq')) {
            els.rectADML.setAttribute({ fillOpacity: 0.7 });
            els.rectADML.borders.forEach((b: any) => b.setAttribute({ strokeWidth: 5 }));
        }

        if (isHighlight('triangulo-bce')) {
            els.triBCE.setAttribute({ fillOpacity: 0.7 });
            els.lineCE.setAttribute({ strokeWidth: 4 });
            els.E.setAttribute({ visible: true, strokeWidth: 3 });
        }
        if (isHighlight('triangulo-abf')) {
            els.triABF.setAttribute({ fillOpacity: 0.7 });
            els.lineAF.setAttribute({ strokeWidth: 4 });
            els.F.setAttribute({ visible: true, strokeWidth: 3 });
        }

        if (isHighlight('rectangulo-der')) {
            els.rectBEML.setAttribute({ fillOpacity: 0.7 });
            els.rectBEML.borders.forEach((b: any) => b.setAttribute({ strokeWidth: 5 }));
        }

        els.board.update();
    }, [step, highlight, isStep, isHighlight]);

    return (
        <div
            ref={boardRef}
            className="w-full h-full min-h-[650px]"
            role="img"
            aria-label="Demostración interactiva del Teorema de Pitágoras. Molino de Euclides."
            tabIndex={0}
        />
    );
};
