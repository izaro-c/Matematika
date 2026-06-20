import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '../../../store/MathStoreContext';

export const JSXGraphCanon = () => {
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
            axis: false,
            showCopyright: false,
            showNavigation: false,
            keepaspectratio: true,
            pan: { enabled: false },
            zoom: { wheel: false },
        });

        const TERRACOTA = '#C86446';
        const SALVIA = '#A2C2A2';
        const CARBON = '#333333';
        const PIZARRA = '#5D7080';

        const pA = board.create('point', [-2, -2], {
            name: 'A', size: 4, fillColor: TERRACOTA, strokeColor: TERRACOTA,
            label: { fontSize: 20, cssClass: 'font-serif font-bold italic', strokeColor: TERRACOTA }
        });
        const pB = board.create('point', [3, -1], {
            name: 'B', size: 4, fillColor: TERRACOTA, strokeColor: TERRACOTA,
            label: { fontSize: 20, cssClass: 'font-serif font-bold italic', strokeColor: TERRACOTA }
        });
        const pC = board.create('point', [0, 3], {
            name: 'C', size: 4, fillColor: TERRACOTA, strokeColor: TERRACOTA,
            label: { fontSize: 20, cssClass: 'font-serif font-bold italic', strokeColor: TERRACOTA }
        });

        const poly = board.create('polygon', [pA, pB, pC], {
            fillColor: TERRACOTA, fillOpacity: 0.15,
            borders: { strokeColor: TERRACOTA, strokeWidth: 2 },
            vertices: { visible: false }
        });

        pA.setAttribute({ id: 'vertice-a' });
        pB.setAttribute({ id: 'vertice-b' });
        pC.setAttribute({ id: 'vertice-c' });
        poly.borders[0].setAttribute({ id: 'lado-ab' });
        poly.borders[1].setAttribute({ id: 'lado-bc' });
        poly.borders[2].setAttribute({ id: 'lado-ca' });
        poly.setAttribute({ id: 'triangulo' });

        const altura = board.create('segment', [pC, () => {
            const ax = pA.X(), ay = pA.Y(), bx = pB.X(), by = pB.Y();
            const dx = bx - ax, dy = by - ay;
            const t = ((pC.X() - ax) * dx + (pC.Y() - ay) * dy) / (dx * dx + dy * dy);
            return [ax + t * dx, ay + t * dy];
        }], {
            strokeColor: SALVIA, strokeWidth: 2, dash: 2, visible: false
        });
        altura.setAttribute({ id: 'altura-c' });

        elementsRef.current = { pA, pB, pC, poly, altura, board };

        board.on('update', () => {
            const ax = pA.X(), ay = pA.Y(), bx = pB.X(), by = pB.Y();
            const area = 0.5 * Math.abs((bx - ax) * (pC.Y() - ay) - (by - ay) * (pC.X() - ax));
            setVariable('area', area);
        });

        board.update();
        return () => {
            JXG.JSXGraph.freeBoard(board);
            elementsRef.current = {};
        };
    }, [setVariable]);

    useEffect(() => {
        const { pA, pB, pC, poly, altura, board } = elementsRef.current as Record<string, any>;
        if (!board) return;

        // RESET — restaurar TODO
        const resetPoint = (p: any) => p.setAttribute({ size: 4, strokeOpacity: 1, fillOpacity: 1 });
        resetPoint(pA); resetPoint(pB); resetPoint(pC);
        poly.borders.forEach((b: any) => b.setAttribute({ strokeWidth: 2, strokeOpacity: 1 }));
        poly.setAttribute({ fillOpacity: 0.15 });
        altura.setAttribute({ visible: false });

        // APLICAR highlight
        const hlPoint = (p: any, id: string) => {
            if (isHighlight(id) || isHighlight('triangulo')) {
                p.setAttribute({ size: 8, strokeOpacity: 1, fillOpacity: 1 });
            }
        };
        hlPoint(pA, 'vertice-a');
        hlPoint(pB, 'vertice-b');
        hlPoint(pC, 'vertice-c');

        const hlBorder = (b: any, id: string) => {
            if (isHighlight(id) || isHighlight('triangulo')) {
                b.setAttribute({ strokeWidth: 5, strokeOpacity: 1 });
            }
        };
        hlBorder(poly.borders[0], 'lado-ab');
        hlBorder(poly.borders[1], 'lado-bc');
        hlBorder(poly.borders[2], 'lado-ca');

        if (isHighlight('triangulo')) {
            poly.setAttribute({ fillOpacity: 0.4 });
        }
        if (isHighlight('altura-c')) {
            altura.setAttribute({ visible: true, strokeWidth: 4 });
        }

        board.update();
    }, [highlight]);

    return (
        <div
            ref={boardRef}
            className="w-full h-full min-h-[500px]"
            role="img"
            aria-label="Diagrama canónico: triángulo con vértices A, B, C y altura desde C. Arrastre los puntos para explorar."
            tabIndex={0}
        />
    );
};
