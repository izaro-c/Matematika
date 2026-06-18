import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '../../store/MathStoreContext';
import { useLessonStore } from '../../store/LessonStore';

export const ExteriorAngle = () => {
    const boardRef = useRef<HTMLDivElement>(null);
    const elementsRef = useRef<Record<string, unknown>>({});

    const setVariable = useMathStore(state => state.setVariable);
    const mathHighlight = useMathStore(state => state.variables['highlight']);
    const lessonHighlight = useLessonStore(state => state.activeStep);
    const highlight = mathHighlight || lessonHighlight;

    useEffect(() => {
        if (!boardRef.current) return;

        const board = JXG.JSXGraph.initBoard(boardRef.current, {
            boundingbox: [-4, 5, 7, -3],
            axis: false,
            showCopyright: false,
            keepaspectratio: true,
        });

        const pA = board.create('point', [0, 3], {
            size: 4, fillColor: '#C86446', strokeColor: '#C86446',
            name: 'A', label: { offset: [-15, -20], fontSize: 20, cssClass: 'font-serif font-bold italic', strokeColor: '#333333' }
        });
        const pB = board.create('point', [-2, 0], {
            size: 4, fillColor: '#C86446', strokeColor: '#C86446',
            name: 'B', label: { offset: [-20, 10], fontSize: 20, cssClass: 'font-serif font-bold italic', strokeColor: '#333333' }
        });
        const pC = board.create('point', [3, 0], {
            size: 4, fillColor: '#C86446', strokeColor: '#C86446',
            name: 'C', label: { offset: [5, 10], fontSize: 20, cssClass: 'font-serif font-bold italic', strokeColor: '#333333' }
        });
        const pD = board.create('point', [5, 0], {
            size: 4, fillColor: '#5D7080', strokeColor: '#5D7080',
            name: 'D', label: { offset: [5, 10], fontSize: 20, cssClass: 'font-serif font-bold italic', strokeColor: '#5D7080' }
        });

        const sideAB = board.create('segment', [pA, pB], {
            strokeColor: '#C86446', strokeWidth: 3,
        });
        const sideAC = board.create('segment', [pA, pC], {
            strokeColor: '#A2C2A2', strokeWidth: 3,
        });
        const sideBC = board.create('segment', [pB, pC], {
            strokeColor: '#A2C2A2', strokeWidth: 3,
        });
        const extensionCD = board.create('segment', [pC, pD], {
            strokeColor: '#5D7080', strokeWidth: 2, strokeDasharray: 4,
        });

        const angleInterior = board.create('angle', [pB, pC, pA], {
            radius: 0.8, fillColor: '#A2C2A2', fillOpacity: 0.3,
        });

        const angleExterior = board.create('angle', [pA, pC, pD], {
            radius: 0.8, fillColor: '#C86446', fillOpacity: 0.3,
        });

        elementsRef.current = { pA, pB, pC, pD, sideAB, sideAC, sideBC, extensionCD, angleInterior, angleExterior, board };

        board.update();

        return () => {
            JXG.JSXGraph.freeBoard(board);
            elementsRef.current = {};
        };
    }, [setVariable]);

    useEffect(() => {
        const { pA, pD, sideAB, sideAC, sideBC, extensionCD, angleInterior, angleExterior, board } = elementsRef.current as Record<string, any>;
        if (!board) return;

        sideAB.setAttribute({ strokeWidth: 3 });
        sideAC.setAttribute({ strokeWidth: 3 });
        sideBC.setAttribute({ strokeWidth: 3 });
        extensionCD.setAttribute({ strokeWidth: 2 });
        angleInterior.setAttribute({ fillOpacity: 0.3 });
        angleExterior.setAttribute({ fillOpacity: 0.3 });
        pA.setAttribute({ size: 4 });
        pD.setAttribute({ size: 4, fillColor: '#5D7080', strokeColor: '#5D7080' });

        if (highlight === 'sideAB') sideAB.setAttribute({ strokeWidth: 6 });
        if (highlight === 'sideAC') sideAC.setAttribute({ strokeWidth: 6 });
        if (highlight === 'sideBC') sideBC.setAttribute({ strokeWidth: 6 });
        if (highlight === 'extension') extensionCD.setAttribute({ strokeWidth: 4 });
        if (highlight === 'interiorAngle') angleInterior.setAttribute({ fillOpacity: 0.7 });
        if (highlight === 'exteriorAngle') angleExterior.setAttribute({ fillOpacity: 0.7 });
        if (highlight === 'pD') pD.setAttribute({ size: 8, fillColor: '#C86446', strokeColor: '#C86446' });
        if (highlight === 'pA') pA.setAttribute({ size: 8 });

        board.update();
    }, [highlight]);

    return <div ref={boardRef} className="w-full h-full min-h-[500px]" />;
};
