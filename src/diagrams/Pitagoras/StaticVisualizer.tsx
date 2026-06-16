import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '../../store/MathStoreContext';

/**
 * StaticVisualizer
 *
 * Componente de visualización matemática. Renderiza un diagrama interactivo 
 * o estático para apoyar el contenido de las lecciones.
 */
export const StaticVisualizer = () => {
    const boardRef = useRef<HTMLDivElement>(null);
    const elementsRef = useRef<Record<string, unknown>>({});
    
    const highlight = useMathStore(state => state.variables['highlight']);

    useEffect(() => {
        if (!boardRef.current) return;

        // 1. Inicializamos un tablero estático (sin navegación)
        const board = JXG.JSXGraph.initBoard(boardRef.current, {
            boundingbox: [-5, 8, 8, -5],
            axis: false,                  
            showNavigation: false,
            showCopyright: false,
            keepaspectratio: true        
        });

        // 2. Puntos fijos
        const pC = board.create('point', [0, 0], { fixed: true, visible: false });
        const pB = board.create('point', [4, 0], { fixed: true, visible: false });
        const pA = board.create('point', [0, 3], { fixed: true, visible: false });

        const labelStyle = { fontSize: 24, cssClass: 'font-serif font-bold italic' };

        // 3. Segmentos estáticos
        const sideA = board.create('segment', [pC, pB], { 
            name: 'a', withLabel: true, strokeColor: '#C86446', strokeWidth: 3,
            label: { ...labelStyle, strokeColor: '#C86446', offset: [0, -20] }
        });
        const sideB = board.create('segment', [pC, pA], { 
            name: 'b', withLabel: true, strokeColor: '#C86446', strokeWidth: 3,
            label: { ...labelStyle, strokeColor: '#C86446', offset: [-20, 0] }
        });
        const sideC = board.create('segment', [pA, pB], { 
            name: 'c', withLabel: true, strokeColor: '#A2C2A2', strokeWidth: 3,
            label: { ...labelStyle, strokeColor: '#A2C2A2', offset: [15, 15] }
        });

        // 4. Cuadrados estáticos
        const sqA = board.create('regularpolygon', [pB, pC, 4], {
            fillColor: '#C86446', fillOpacity: 0.2, borders: { strokeColor: '#C86446' }, vertices: { visible: false }
        });
        const sqB = board.create('regularpolygon', [pC, pA, 4], {
            fillColor: '#C86446', fillOpacity: 0.2, borders: { strokeColor: '#C86446' }, vertices: { visible: false }
        });
        const sqC = board.create('regularpolygon', [pA, pB, 4], {
            fillColor: '#A2C2A2', fillOpacity: 0.2, borders: { strokeColor: '#A2C2A2' }, vertices: { visible: false }
        });

        elementsRef.current = { sideA, sideB, sideC, sqA, sqB, sqC, board };

        return () => {
            JXG.JSXGraph.freeBoard(board);
            elementsRef.current = {};
        };
    }, []);

    // 5. REACTIVIDAD INVERSA (Zustand -> Gráfico)
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { sideA, sideB, sideC, sqA, sqB, sqC, board } = elementsRef.current as Record<string, any>;
        if (!board) return;

        // Reset
        sqA.setAttribute({ fillOpacity: 0.1 });
        sqB.setAttribute({ fillOpacity: 0.1 });
        sqC.setAttribute({ fillOpacity: 0.1 });
        sideA.setAttribute({ strokeWidth: 3 });
        sideB.setAttribute({ strokeWidth: 3 });
        sideC.setAttribute({ strokeWidth: 3 });

        // Iluminar LADOS
        if (highlight === 'ladoA') sideA.setAttribute({ strokeWidth: 8 });
        if (highlight === 'ladoB') sideB.setAttribute({ strokeWidth: 8 });
        if (highlight === 'ladoC') sideC.setAttribute({ strokeWidth: 8 });

        // Iluminar ÁREAS
        if (highlight === 'areaA') sqA.setAttribute({ fillOpacity: 0.8 });
        if (highlight === 'areaB') sqB.setAttribute({ fillOpacity: 0.8 });
        if (highlight === 'areaC') sqC.setAttribute({ fillOpacity: 0.8 });

        board.update();
    }, [highlight]);

    return (
        <div className="w-full h-full min-h-[500px] relative overflow-hidden bg-lienzo">
            {/* Filtro SVG de ruido/textura de papel */}
            <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
                <defs>
                    <filter id="paper-texture" x="0" y="0" width="100%" height="100%">
                        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                        <feColorMatrix type="matrix" values="1 0 0 0 0  0 0.95 0 0 0  0 0.85 0 0 0  0 0 0 0.15 0" in="noise" result="coloredNoise" />
                        <feBlend in="SourceGraphic" in2="coloredNoise" mode="multiply" />
                    </filter>
                </defs>
            </svg>
            <div ref={boardRef} className="w-full h-full absolute inset-0" style={{ filter: 'url(#paper-texture)' }} />
        </div>
    );
};
