import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '../../store/MathStoreContext';
import { useLessonStore } from '../../store/LessonStore';

export const IsoscelesFallacy = () => {
    const boardRef = useRef<HTMLDivElement>(null);
    const elementsRef = useRef<Record<string, unknown>>({});

    const setVariable = useMathStore(state => state.setVariable);
    const mathHighlight = useMathStore(state => state.variables['highlight']);
    const lessonHighlight = useLessonStore(state => state.activeStep);
    const highlight = mathHighlight || lessonHighlight;

    useEffect(() => {
        if (!boardRef.current) return;

        const board = JXG.JSXGraph.initBoard(boardRef.current, {
            boundingbox: [-5, 6, 8, -4],
            axis: false,
            showCopyright: false,
            keepaspectratio: true,
        });

        const pA = board.create('point', [1, 4], {
            size: 4, fillColor: '#C86446', strokeColor: '#C86446',
            name: 'A',
            label: { offset: [-15, -20], fontSize: 20, cssClass: 'font-serif font-bold italic', strokeColor: '#333333' }
        });
        const pB = board.create('point', [-3, 0], {
            size: 4, fillColor: '#C86446', strokeColor: '#C86446',
            name: 'B',
            label: { offset: [-20, 10], fontSize: 20, cssClass: 'font-serif font-bold italic', strokeColor: '#333333' }
        });
        const pC = board.create('point', [5, 0], {
            size: 4, fillColor: '#C86446', strokeColor: '#C86446',
            name: 'C',
            label: { offset: [5, 10], fontSize: 20, cssClass: 'font-serif font-bold italic', strokeColor: '#333333' }
        });

        const sideAB = board.create('segment', [pA, pB], {
            strokeColor: '#C86446', strokeWidth: 3,
        });
        const sideBC = board.create('segment', [pB, pC], {
            strokeColor: '#A2C2A2', strokeWidth: 3,
        });
        const sideCA = board.create('segment', [pC, pA], {
            strokeColor: '#A2C2A2', strokeWidth: 3,
        });

        const midBC = board.create('midpoint', [pB, pC], {
            size: 3, fillColor: '#5D7080', strokeColor: '#5D7080',
            name: 'M',
            label: { offset: [-20, 10], fontSize: 18, cssClass: 'font-serif font-bold italic', strokeColor: '#5D7080' }
        });

        const perpResult = board.create('perpendicular', [sideBC, midBC], {
            strokeColor: '#5D7080', strokeWidth: 2, dash: 2,
        }) as any;
        const perpLine = perpResult[0] as JXG.Line;

        const angleBisA = board.create('line', [
            pA,
            board.create('glider', [2, -1, board.defaultAxes.x], { visible: false })
        ], {
            strokeColor: '#C86446', strokeWidth: 2, dash: 2,
        });

        const pO = board.create('intersection', [angleBisA, perpLine, 0], {
            size: 5, fillColor: '#C86446', strokeColor: '#C86446',
            name: 'O',
            label: { offset: [-10, -15], fontSize: 20, cssClass: 'font-serif font-bold italic', strokeColor: '#C86446' }
        });

        const footABResult = board.create('perpendicular', [sideAB, pO], {
            visible: false
        }) as any;
        const footACResult = board.create('perpendicular', [sideCA, pO], {
            visible: false
        }) as any;
        const footABLine = footABResult[0] as JXG.Line;
        const footACLine = footACResult[0] as JXG.Line;
        const pD_point = board.create('intersection', [footABLine, sideAB, 0], {
            size: 4, fillColor: '#5D7080', strokeColor: '#5D7080',
            name: 'D',
            label: { offset: [-15, 10], fontSize: 18, cssClass: 'font-serif font-bold italic', strokeColor: '#5D7080' }
        });
        const pE_point = board.create('intersection', [footACLine, sideCA, 0], {
            size: 4, fillColor: '#5D7080', strokeColor: '#5D7080',
            name: 'E',
            label: { offset: [5, 10], fontSize: 18, cssClass: 'font-serif font-bold italic', strokeColor: '#5D7080' }
        });

        elementsRef.current = {
            pA, pB, pC, sideAB, sideBC, sideCA, midBC,
            perpLine, angleBisA, pO, pD_point, pE_point, board
        };

        board.update();

        return () => {
            JXG.JSXGraph.freeBoard(board);
            elementsRef.current = {};
        };
    }, [setVariable]);

    useEffect(() => {
        const { pA, pB, pC, sideAB, sideBC, sideCA, midBC, perpLine, angleBisA, pO, pD_point, pE_point, board } = elementsRef.current as Record<string, any>;
        if (!board) return;

        sideAB.setAttribute({ strokeWidth: 3 });
        sideBC.setAttribute({ strokeWidth: 3 });
        sideCA.setAttribute({ strokeWidth: 3 });
        perpLine.setAttribute({ strokeWidth: 2 });
        angleBisA.setAttribute({ strokeWidth: 2, strokeColor: '#C86446' });
        pO.setAttribute({ size: 5 });
        pD_point.setAttribute({ size: 4 });
        pE_point.setAttribute({ size: 4 });
        pA.setAttribute({ size: 4 });
        pB.setAttribute({ size: 4 });
        pC.setAttribute({ size: 4 });
        midBC.setAttribute({ size: 3 });

        if (highlight === 'pA') pA.setAttribute({ size: 10 });
        if (highlight === 'pB') pB.setAttribute({ size: 10 });
        if (highlight === 'pC') pC.setAttribute({ size: 10 });
        if (highlight === 'midBC') midBC.setAttribute({ size: 8 });
        if (highlight === 'perpLine') perpLine.setAttribute({ strokeWidth: 4 });
        if (highlight === 'bisectorA') angleBisA.setAttribute({ strokeWidth: 4, strokeColor: '#A2C2A2' });
        if (highlight === 'intersectionO') pO.setAttribute({ size: 10, fillColor: '#C86446' });
        if (highlight === 'sideAB') { sideAB.setAttribute({ strokeWidth: 6 }); pD_point.setAttribute({ size: 7 }); }
        if (highlight === 'sideBC') sideBC.setAttribute({ strokeWidth: 6 });
        if (highlight === 'sideAC') { sideCA.setAttribute({ strokeWidth: 6 }); pE_point.setAttribute({ size: 7 }); }

        board.update();
    }, [highlight]);

    return <div ref={boardRef} className="w-full h-full min-h-[500px]" />;
};
