import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '../../store/MathStoreContext';

export const RearrangementConclusion = () => {
    const boardRef = useRef<HTMLDivElement>(null);
    const highlight = useMathStore(state => state.variables['highlight'] as string | null);
    const elementsRef = useRef<Record<string, any[]>>({});
    const boardInstance = useRef<any>(null);

    useEffect(() => {
        if (!boardRef.current) return;

        const board = JXG.JSXGraph.initBoard(boardRef.current, {
            boundingbox: [-1, 8, 16, -1],
            axis: false,                  
            showNavigation: false,
            showCopyright: false,
            keepaspectratio: true        
        });
        boardInstance.current = board;

        // ==========================================
        // LADO IZQUIERDO: CONFIGURACIÓN 1
        // ==========================================
        const p0 = board.create('point', [0, 0], { visible: false });
        const p1 = board.create('point', [7, 0], { visible: false });
        const p2 = board.create('point', [7, 7], { visible: false });
        const p3 = board.create('point', [0, 7], { visible: false });
        board.create('polygon', [p0, p1, p2, p3], { fillColor: '#F5F5DC', fillOpacity: 0.3, borders: { strokeColor: '#333333', strokeWidth: 2 } });

        const t1_1 = board.create('point', [0, 0], { visible: false });
        const t1_2 = board.create('point', [4, 0], { visible: false });
        const t1_3 = board.create('point', [0, 3], { visible: false });
        const poly1 = board.create('polygon', [t1_1, t1_2, t1_3], { fillColor: '#C86446', fillOpacity: 0.4, borders: { strokeColor: '#ffffff', strokeWidth: 1 } });

        const t2_1 = board.create('point', [7, 0], { visible: false });
        const t2_2 = board.create('point', [7, 4], { visible: false });
        const t2_3 = board.create('point', [4, 0], { visible: false });
        const poly2 = board.create('polygon', [t2_1, t2_2, t2_3], { fillColor: '#C86446', fillOpacity: 0.4, borders: { strokeColor: '#ffffff', strokeWidth: 1 } });

        const t3_1 = board.create('point', [7, 7], { visible: false });
        const t3_2 = board.create('point', [3, 7], { visible: false });
        const t3_3 = board.create('point', [7, 4], { visible: false });
        const poly3 = board.create('polygon', [t3_1, t3_2, t3_3], { fillColor: '#C86446', fillOpacity: 0.4, borders: { strokeColor: '#ffffff', strokeWidth: 1 } });

        const t4_1 = board.create('point', [0, 7], { visible: false });
        const t4_2 = board.create('point', [0, 3], { visible: false });
        const t4_3 = board.create('point', [3, 7], { visible: false });
        const poly4 = board.create('polygon', [t4_1, t4_2, t4_3], { fillColor: '#C86446', fillOpacity: 0.4, borders: { strokeColor: '#ffffff', strokeWidth: 1 } });

        const c_1 = board.create('point', [4, 0], { visible: false });
        const c_2 = board.create('point', [7, 4], { visible: false });
        const c_3 = board.create('point', [3, 7], { visible: false });
        const c_4 = board.create('point', [0, 3], { visible: false });
        const polyC = board.create('polygon', [c_1, c_2, c_3, c_4], { fillColor: '#A2C2A2', fillOpacity: 0.8, borders: { strokeColor: '#1B4D3E', strokeWidth: 3 } });
        board.create('text', [3.5, 3.5, 'c²'], { fontSize: 32, cssClass: 'font-serif italic font-bold', anchorX: 'middle', anchorY: 'middle', strokeColor: '#1B4D3E' });


        // ==========================================
        // LADO DERECHO: CONFIGURACIÓN 2 (Offset X = +8)
        // ==========================================
        const offset = 8;
        const o0 = board.create('point', [0+offset, 0], { visible: false });
        const o1 = board.create('point', [7+offset, 0], { visible: false });
        const o2 = board.create('point', [7+offset, 7], { visible: false });
        const o3 = board.create('point', [0+offset, 7], { visible: false });
        board.create('polygon', [o0, o1, o2, o3], { fillColor: '#F5F5DC', fillOpacity: 0.3, borders: { strokeColor: '#333333', strokeWidth: 2 } });

        const r1_1 = board.create('point', [0+offset, 0], { visible: false });
        const r1_2 = board.create('point', [4+offset, 0], { visible: false });
        const r1_3 = board.create('point', [4+offset, 3], { visible: false });
        const r1_4 = board.create('point', [0+offset, 3], { visible: false });
        const rpoly1 = board.create('polygon', [r1_1, r1_2, r1_3, r1_4], { fillColor: '#C86446', fillOpacity: 0.4 });
        board.create('segment', [r1_1, r1_3], { strokeColor: '#ffffff', strokeWidth: 2 });

        const r2_1 = board.create('point', [4+offset, 3], { visible: false });
        const r2_2 = board.create('point', [7+offset, 3], { visible: false });
        const r2_3 = board.create('point', [7+offset, 7], { visible: false });
        const r2_4 = board.create('point', [4+offset, 7], { visible: false });
        const rpoly2 = board.create('polygon', [r2_1, r2_2, r2_3, r2_4], { fillColor: '#C86446', fillOpacity: 0.4 });
        board.create('segment', [r2_1, r2_3], { strokeColor: '#ffffff', strokeWidth: 2 });

        const a_1 = board.create('point', [4+offset, 0], { visible: false });
        const a_2 = board.create('point', [7+offset, 0], { visible: false });
        const a_3 = board.create('point', [7+offset, 3], { visible: false });
        const a_4 = board.create('point', [4+offset, 3], { visible: false });
        const polyA = board.create('polygon', [a_1, a_2, a_3, a_4], { fillColor: '#A2C2A2', fillOpacity: 0.8, borders: { strokeColor: '#1B4D3E', strokeWidth: 3 } });
        board.create('text', [5.5+offset, 1.5, 'a²'], { fontSize: 32, cssClass: 'font-serif italic font-bold', anchorX: 'middle', anchorY: 'middle', strokeColor: '#1B4D3E' });

        const b_1 = board.create('point', [0+offset, 3], { visible: false });
        const b_2 = board.create('point', [4+offset, 3], { visible: false });
        const b_3 = board.create('point', [4+offset, 7], { visible: false });
        const b_4 = board.create('point', [0+offset, 7], { visible: false });
        const polyB = board.create('polygon', [b_1, b_2, b_3, b_4], { fillColor: '#A2C2A2', fillOpacity: 0.8, borders: { strokeColor: '#1B4D3E', strokeWidth: 3 } });
        board.create('text', [2+offset, 5, 'b²'], { fontSize: 32, cssClass: 'font-serif italic font-bold', anchorX: 'middle', anchorY: 'middle', strokeColor: '#1B4D3E' });

        // Signo igual en el centro
        board.create('text', [7.5, 3.5, '='], { fontSize: 48, cssClass: 'font-serif font-bold', anchorX: 'middle', anchorY: 'middle', strokeColor: '#333333' });

        elementsRef.current = {
            triangles: [poly1, poly2, poly3, poly4, rpoly1, rpoly2],
            areaC: [polyC],
            areaA: [polyA],
            areaB: [polyB]
        };

        return () => JXG.JSXGraph.freeBoard(board);
    }, []);

    useEffect(() => {
        if (!boardInstance.current) return;
        
        const resetOpacities = () => {
            const allElements = Object.values(elementsRef.current).flat();
            allElements.forEach(el => {
                if (el.originalOpacity === undefined) {
                    el.originalOpacity = el.visProp.fillopacity ?? 0.4;
                    el.originalStrokeWidth = el.visProp.strokewidth ?? 1;
                }
                el.setAttribute({ 
                    fillOpacity: el.originalOpacity, 
                    strokeWidth: el.originalStrokeWidth 
                });
            });
        };

        resetOpacities();

        if (highlight && elementsRef.current[highlight]) {
            // Dim others
            Object.keys(elementsRef.current).forEach(key => {
                if (key !== highlight) {
                    elementsRef.current[key].forEach(el => {
                        el.setAttribute({ fillOpacity: 0.1 });
                    });
                } else {
                    // Highlight selected
                    elementsRef.current[key].forEach(el => {
                        el.setAttribute({ fillOpacity: 0.9, strokeWidth: 4 });
                    });
                }
            });
        }
        
        boardInstance.current.update();
    }, [highlight]);

    return <div ref={boardRef} className="w-full h-full min-h-[600px] flex items-center justify-center" />;
};
