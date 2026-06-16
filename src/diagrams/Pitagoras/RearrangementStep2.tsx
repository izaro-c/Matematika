import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '../../store/MathStoreContext';

/**
 * RearrangementStep2
 *
 * Componente de visualización matemática. Renderiza un diagrama interactivo 
 * o estático para apoyar el contenido de las lecciones.
 */
export const RearrangementStep2 = () => {
    const boardRef = useRef<HTMLDivElement>(null);
    const highlight = useMathStore(state => state.variables['highlight']);
    const elementsRef = useRef<Record<string, unknown>>({});

    useEffect(() => {
        if (!boardRef.current) return;

        const board = JXG.JSXGraph.initBoard(boardRef.current, {
            boundingbox: [-1, 8, 8, -1],
            axis: false,                  
            showNavigation: false,
            showCopyright: false,
            keepaspectratio: true        
        });

        // Polygon points for the large square (7x7)
        const p0 = board.create('point', [0, 0], { visible: false });
        const p1 = board.create('point', [7, 0], { visible: false });
        const p2 = board.create('point', [7, 7], { visible: false });
        const p3 = board.create('point', [0, 7], { visible: false });

        board.create('polygon', [p0, p1, p2, p3], {
            fillColor: '#F5F5DC', fillOpacity: 0.3, borders: { strokeColor: '#333333', strokeWidth: 2 }
        });

        // Rectangle 1 (Bottom Left, 4x3)
        const r1_1 = board.create('point', [0, 0], { visible: false });
        const r1_2 = board.create('point', [4, 0], { visible: false });
        const r1_3 = board.create('point', [4, 3], { visible: false });
        const r1_4 = board.create('point', [0, 3], { visible: false });
        const rect1 = board.create('polygon', [r1_1, r1_2, r1_3, r1_4], { fillColor: '#C86446', fillOpacity: 0.8 });
        board.create('segment', [r1_1, r1_3], { strokeColor: '#ffffff', strokeWidth: 2 }); // Split line

        // Rectangle 2 (Top Right, 3x4)
        const r2_1 = board.create('point', [4, 3], { visible: false });
        const r2_2 = board.create('point', [7, 3], { visible: false });
        const r2_3 = board.create('point', [7, 7], { visible: false });
        const r2_4 = board.create('point', [4, 7], { visible: false });
        const rect2 = board.create('polygon', [r2_1, r2_2, r2_3, r2_4], { fillColor: '#C86446', fillOpacity: 0.8 });
        board.create('segment', [r2_1, r2_3], { strokeColor: '#ffffff', strokeWidth: 2 }); // Split line

        // Square a² (Bottom Right, 3x3)
        const a_1 = board.create('point', [4, 0], { visible: false });
        const a_2 = board.create('point', [7, 0], { visible: false });
        const a_3 = board.create('point', [7, 3], { visible: false });
        const a_4 = board.create('point', [4, 3], { visible: false });
        const sqA = board.create('polygon', [a_1, a_2, a_3, a_4], {
            fillColor: '#A2C2A2', fillOpacity: 0.5, borders: { strokeColor: '#A2C2A2', strokeWidth: 3 }
        });
        const labelA = board.create('text', [5.5, 1.5, 'a²'], { fontSize: 32, cssClass: 'font-serif italic font-bold', anchorX: 'middle', anchorY: 'middle', strokeColor: '#333333' });

        // Square b² (Top Left, 4x4)
        const b_1 = board.create('point', [0, 3], { visible: false });
        const b_2 = board.create('point', [4, 3], { visible: false });
        const b_3 = board.create('point', [4, 7], { visible: false });
        const b_4 = board.create('point', [0, 7], { visible: false });
        const sqB = board.create('polygon', [b_1, b_2, b_3, b_4], {
            fillColor: '#A2C2A2', fillOpacity: 0.5, borders: { strokeColor: '#A2C2A2', strokeWidth: 3 }
        });
        const labelB = board.create('text', [2, 5, 'b²'], { fontSize: 32, cssClass: 'font-serif italic font-bold', anchorX: 'middle', anchorY: 'middle', strokeColor: '#333333' });

        elementsRef.current = { rect1, rect2, sqA, sqB, labelA, labelB, board };

        return () => JXG.JSXGraph.freeBoard(board);
    }, []);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { rect1, rect2, sqA, sqB, labelA, labelB, board } = elementsRef.current as Record<string, any>;
        if (!board) return;

        // Reset
        rect1.setAttribute({ fillOpacity: 0.2 });
        rect2.setAttribute({ fillOpacity: 0.2 });
        sqA.setAttribute({ fillOpacity: 0.1 });
        sqB.setAttribute({ fillOpacity: 0.1 });
        labelA.setAttribute({ strokeColor: '#333333' });
        labelB.setAttribute({ strokeColor: '#333333' });

        if (highlight === 'triangles') {
            rect1.setAttribute({ fillOpacity: 0.9 });
            rect2.setAttribute({ fillOpacity: 0.9 });
        }
        if (highlight === 'areaA') {
            sqA.setAttribute({ fillOpacity: 0.8 });
            labelA.setAttribute({ strokeColor: '#1B4D3E' });
        }
        if (highlight === 'areaB') {
            sqB.setAttribute({ fillOpacity: 0.8 });
            labelB.setAttribute({ strokeColor: '#1B4D3E' });
        }

        board.update();
    }, [highlight]);

    return <div ref={boardRef} className="w-full h-full min-h-[600px] flex items-center justify-center" />;
};
