import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '../../store/MathStoreContext';

export const RearrangementStep1 = () => {
    const boardRef = useRef<HTMLDivElement>(null);
    const highlight = useMathStore(state => state.variables['highlight']);
    const elementsRef = useRef<any>({});

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

        // 4 Triangles
        const t1_1 = board.create('point', [0, 0], { visible: false });
        const t1_2 = board.create('point', [4, 0], { visible: false });
        const t1_3 = board.create('point', [0, 3], { visible: false });
        const tri1 = board.create('polygon', [t1_1, t1_2, t1_3], { fillColor: '#C86446', fillOpacity: 0.8, borders: { strokeColor: '#ffffff', strokeWidth: 1 } });

        const t2_1 = board.create('point', [7, 0], { visible: false });
        const t2_2 = board.create('point', [7, 4], { visible: false });
        const t2_3 = board.create('point', [4, 0], { visible: false });
        const tri2 = board.create('polygon', [t2_1, t2_2, t2_3], { fillColor: '#C86446', fillOpacity: 0.8, borders: { strokeColor: '#ffffff', strokeWidth: 1 } });

        const t3_1 = board.create('point', [7, 7], { visible: false });
        const t3_2 = board.create('point', [3, 7], { visible: false });
        const t3_3 = board.create('point', [7, 4], { visible: false });
        const tri3 = board.create('polygon', [t3_1, t3_2, t3_3], { fillColor: '#C86446', fillOpacity: 0.8, borders: { strokeColor: '#ffffff', strokeWidth: 1 } });

        const t4_1 = board.create('point', [0, 7], { visible: false });
        const t4_2 = board.create('point', [0, 3], { visible: false });
        const t4_3 = board.create('point', [3, 7], { visible: false });
        const tri4 = board.create('polygon', [t4_1, t4_2, t4_3], { fillColor: '#C86446', fillOpacity: 0.8, borders: { strokeColor: '#ffffff', strokeWidth: 1 } });

        // Center Square (c²)
        const c_1 = board.create('point', [4, 0], { visible: false });
        const c_2 = board.create('point', [7, 4], { visible: false });
        const c_3 = board.create('point', [3, 7], { visible: false });
        const c_4 = board.create('point', [0, 3], { visible: false });
        const centerSquare = board.create('polygon', [c_1, c_2, c_3, c_4], {
            fillColor: '#A2C2A2', fillOpacity: 0.5, borders: { strokeColor: '#A2C2A2', strokeWidth: 3 }
        });

        // Lados (Segmentos para highlight)
        const sideA1 = board.create('segment', [t1_1, t1_3], { strokeColor: 'transparent', strokeWidth: 5, name: 'a', withLabel: true, label: { offset: [-15, 15], cssClass: 'font-serif font-bold italic text-xl', strokeColor: '#C86446' } });
        const sideB1 = board.create('segment', [t1_1, t1_2], { strokeColor: 'transparent', strokeWidth: 5, name: 'b', withLabel: true, label: { offset: [15, -15], cssClass: 'font-serif font-bold italic text-xl', strokeColor: '#C86446' } });
        const sideC1 = board.create('segment', [t1_2, t1_3], { strokeColor: 'transparent', strokeWidth: 5, name: 'c', withLabel: true, label: { offset: [15, 15], cssClass: 'font-serif font-bold italic text-xl', strokeColor: '#A2C2A2' } });

        // Label
        const labelC = board.create('text', [3.5, 3.5, 'c²'], { fontSize: 32, cssClass: 'font-serif italic font-bold', anchorX: 'middle', anchorY: 'middle', strokeColor: '#333333' });

        elementsRef.current = { tri1, tri2, tri3, tri4, centerSquare, sideA1, sideB1, sideC1, labelC, board };

        return () => JXG.JSXGraph.freeBoard(board);
    }, []);

    useEffect(() => {
        const { tri1, tri2, tri3, tri4, centerSquare, sideA1, sideB1, sideC1, labelC, board } = elementsRef.current;
        if (!board) return;

        // Reset
        tri1.setAttribute({ fillOpacity: 0.2 });
        tri2.setAttribute({ fillOpacity: 0.2 });
        tri3.setAttribute({ fillOpacity: 0.2 });
        tri4.setAttribute({ fillOpacity: 0.2 });
        centerSquare.setAttribute({ fillOpacity: 0.1 });
        sideA1.setAttribute({ strokeColor: 'transparent' });
        sideB1.setAttribute({ strokeColor: 'transparent' });
        sideC1.setAttribute({ strokeColor: 'transparent' });
        labelC.setAttribute({ strokeColor: '#333333', fillOpacity: 1 });

        if (highlight === 'triangles') {
            tri1.setAttribute({ fillOpacity: 0.9 });
            tri2.setAttribute({ fillOpacity: 0.9 });
            tri3.setAttribute({ fillOpacity: 0.9 });
            tri4.setAttribute({ fillOpacity: 0.9 });
        }
        if (highlight === 'ladoA') sideA1.setAttribute({ strokeColor: '#C86446' });
        if (highlight === 'ladoB') sideB1.setAttribute({ strokeColor: '#C86446' });
        if (highlight === 'ladoC') sideC1.setAttribute({ strokeColor: '#A2C2A2' });
        if (highlight === 'areaC') {
            centerSquare.setAttribute({ fillOpacity: 0.8 });
            labelC.setAttribute({ strokeColor: '#1B4D3E' });
        }

        board.update();
    }, [highlight]);

    return <div ref={boardRef} className="w-full h-full min-h-[600px] flex items-center justify-center" />;
};
