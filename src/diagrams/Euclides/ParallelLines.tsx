import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '../../store/MathStoreContext';
import { useLessonStore } from '../../store/LessonStore';

export const ParallelLines = () => {
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
            axis: false,
            showCopyright: false,
            keepaspectratio: true,
        });

        const p1 = board.create('point', [-4, 2], { visible: false });
        const p2 = board.create('point', [4, 2], { visible: false });
        const p3 = board.create('point', [-4, -1], { visible: false });
        const p4 = board.create('point', [4, -1], { visible: false });
        const p5 = board.create('point', [-2, 3], { visible: false });
        const p6 = board.create('point', [2, -3], { visible: false });

        const lineR = board.create('line', [p1, p2], {
            strokeColor: '#C86446', strokeWidth: 3,
        });
        const lineS = board.create('line', [p3, p4], {
            strokeColor: '#A2C2A2', strokeWidth: 3,
        });
        const transversal = board.create('line', [p5, p6], {
            strokeColor: '#5D7080', strokeWidth: 2,
        });

        const inter1 = board.create('intersection', [lineR, transversal, 0], {
            visible: false,
        });
        const inter2 = board.create('intersection', [lineS, transversal, 0], {
            visible: false,
        });

        const altAngle1 = board.create('angle', [
            [-2, 3], inter1, inter2
        ], {
            radius: 0.8, fillColor: '#C86446', fillOpacity: 0.3,
            label: { fontSize: 16, cssClass: 'font-serif italic', strokeColor: '#C86446' }
        });

        const altAngle2 = board.create('angle', [
            [2, -3], inter2, inter1
        ], {
            radius: 0.8, fillColor: '#C86446', fillOpacity: 0.3,
            label: { fontSize: 16, cssClass: 'font-serif italic', strokeColor: '#C86446' }
        });

        const labelR = board.create('text', [-4.6, 2.3, 'r'], {
            fontSize: 20, cssClass: 'font-serif font-bold italic', strokeColor: '#C86446'
        });
        const labelS = board.create('text', [-4.6, -0.7, 's'], {
            fontSize: 20, cssClass: 'font-serif font-bold italic', strokeColor: '#A2C2A2'
        });
        const labelT = board.create('text', [2.5, 2.8, 't'], {
            fontSize: 18, cssClass: 'font-serif italic', strokeColor: '#5D7080'
        });

        elementsRef.current = { lineR, lineS, transversal, board, altAngle1, altAngle2, labelR, labelS, labelT };

        board.update();

        return () => {
            JXG.JSXGraph.freeBoard(board);
            elementsRef.current = {};
        };
    }, [setVariable]);

    useEffect(() => {
        const { lineR, lineS, transversal, altAngle1, altAngle2, board } = elementsRef.current as Record<string, any>;
        if (!board) return;

        lineR.setAttribute({ strokeWidth: 3 });
        lineS.setAttribute({ strokeWidth: 3 });
        transversal.setAttribute({ strokeWidth: 2 });
        altAngle1.setAttribute({ fillOpacity: 0.3 });
        altAngle2.setAttribute({ fillOpacity: 0.3 });

        if (highlight === 'lineR') lineR.setAttribute({ strokeWidth: 6 });
        if (highlight === 'lineS') lineS.setAttribute({ strokeWidth: 6 });
        if (highlight === 'transversal') transversal.setAttribute({ strokeWidth: 4 });
        if (highlight === 'altAngle1') altAngle1.setAttribute({ fillOpacity: 0.7 });
        if (highlight === 'altAngle2') altAngle2.setAttribute({ fillOpacity: 0.7 });

        board.update();
    }, [highlight]);

    return <div ref={boardRef} className="w-full h-full min-h-[500px]" />;
};
