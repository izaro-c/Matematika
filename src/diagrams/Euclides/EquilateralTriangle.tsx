import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '../../store/MathStoreContext';
import { useLessonStore } from '../../store/LessonStore';

export const EquilateralTriangle = () => {
    const boardRef = useRef<HTMLDivElement>(null);
    const elementsRef = useRef<Record<string, unknown>>({});

    const setVariable = useMathStore(state => state.setVariable);
    const mathHighlight = useMathStore(state => state.variables['highlight']);
    const lessonHighlight = useLessonStore(state => state.activeStep);
    const highlight = mathHighlight || lessonHighlight;

    useEffect(() => {
        if (!boardRef.current) return;

        const board = JXG.JSXGraph.initBoard(boardRef.current, {
            boundingbox: [-6, 6, 6, -6],
            axis: false,
            showCopyright: false,
            keepaspectratio: true,
            grid: false,
        });

        const pA = board.create('point', [-2, 0], {
            size: 4, fillColor: '#C86446', strokeColor: '#C86446',
            name: 'A', cssClass: 'font-serif font-bold italic',
            label: { offset: [-15, -20], fontSize: 20, cssClass: 'font-serif font-bold italic', strokeColor: '#333333' }
        });
        const pB = board.create('point', [2, 0], {
            size: 4, fillColor: '#C86446', strokeColor: '#C86446',
            name: 'B', cssClass: 'font-serif font-bold italic',
            label: { offset: [5, -20], fontSize: 20, cssClass: 'font-serif font-bold italic', strokeColor: '#333333' }
        });

        const circleA = board.create('circle', [pA, pB], {
            strokeColor: '#5D7080', strokeWidth: 2,
            strokeDasharray: 4,
            fillColor: '#5D7080', fillOpacity: 0.05,
        });

        const circleB = board.create('circle', [pB, pA], {
            strokeColor: '#5D7080', strokeWidth: 2,
            strokeDasharray: 4,
            fillColor: '#5D7080', fillOpacity: 0.05,
        });

        const intersections = board.create('intersection', [circleA, circleB, 0], {
            size: 4, fillColor: '#C86446', strokeColor: '#C86446',
            name: 'C', cssClass: 'font-serif font-bold italic',
            label: { offset: [5, -20], fontSize: 20, cssClass: 'font-serif font-bold italic', strokeColor: '#333333' }
        });
        const pC = intersections;

        const sideAB = board.create('segment', [pA, pB], {
            strokeColor: '#C86446', strokeWidth: 3,
        });
        const sideAC = board.create('segment', [pA, pC], {
            strokeColor: '#A2C2A2', strokeWidth: 3,
        });
        const sideBC = board.create('segment', [pB, pC], {
            strokeColor: '#A2C2A2', strokeWidth: 3,
        });

        const triangle = board.create('polygon', [pA, pB, pC], {
            fillColor: '#A2C2A2', fillOpacity: 0.15,
            borders: { visible: false },
            vertices: { visible: false },
        });

        const labelAB = board.create('text', [0, -0.5, '\\overline{AB} = r'], {
            fontSize: 16, cssClass: 'font-serif italic', strokeColor: '#333333'
        });

        elementsRef.current = { pA, pB, pC, circleA, circleB, sideAB, sideAC, sideBC, triangle, board, labelAB };

        setVariable('sideLength', 4);

        board.update();

        return () => {
            JXG.JSXGraph.freeBoard(board);
            elementsRef.current = {};
        };
    }, [setVariable]);

    useEffect(() => {
        const { sideAB, sideAC, sideBC, circleA, circleB, triangle, board, pA, pB, pC } = elementsRef.current as Record<string, any>;
        if (!board) return;

        sideAB.setAttribute({ strokeWidth: 3, strokeColor: '#C86446' });
        sideAC.setAttribute({ strokeWidth: 3, strokeColor: '#A2C2A2' });
        sideBC.setAttribute({ strokeWidth: 3, strokeColor: '#A2C2A2' });
        circleA.setAttribute({ strokeWidth: 2, strokeOpacity: 0.5 });
        circleB.setAttribute({ strokeWidth: 2, strokeOpacity: 0.5 });
        triangle.setAttribute({ fillOpacity: 0.15 });
        pA.setAttribute({ size: 4 });
        pB.setAttribute({ size: 4 });
        pC.setAttribute({ size: 4 });

        if (highlight === 'sideAB') sideAB.setAttribute({ strokeWidth: 6, strokeColor: '#C86446' });
        if (highlight === 'sideAC') sideAC.setAttribute({ strokeWidth: 6, strokeColor: '#A2C2A2' });
        if (highlight === 'sideBC') sideBC.setAttribute({ strokeWidth: 6, strokeColor: '#A2C2A2' });
        if (highlight === 'circleA') circleA.setAttribute({ strokeWidth: 4, strokeOpacity: 1 });
        if (highlight === 'circleB') circleB.setAttribute({ strokeWidth: 4, strokeOpacity: 1 });
        if (highlight === 'triangle') triangle.setAttribute({ fillOpacity: 0.4 });
        if (highlight === 'pA') pA.setAttribute({ size: 10 });
        if (highlight === 'pB') pB.setAttribute({ size: 10 });
        if (highlight === 'pC') pC.setAttribute({ size: 10 });

        board.update();
    }, [highlight]);

    return <div ref={boardRef} className="w-full h-full min-h-[500px]" />;
};
