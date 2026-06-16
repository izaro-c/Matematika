import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '../../store/MathStoreContext';

/**
 * InteractiveSimulator
 *
 * Componente de visualización matemática. Renderiza un diagrama interactivo 
 * o estático para apoyar el contenido de las lecciones.
 */
export const InteractiveSimulator = () => {
    const boardRef = useRef<HTMLDivElement>(null);
    const elementsRef = useRef<Record<string, unknown>>({});
    
    // Obtenemos funciones y variables del store
    const setVariable = useMathStore(state => state.setVariable);
    const highlight = useMathStore(state => state.variables['highlight']);

    useEffect(() => {
        if (!boardRef.current) return;

        // 1. Inicializamos la pizarra matemática
        const board = JXG.JSXGraph.initBoard(boardRef.current, {
            boundingbox: [-5, 8, 8, -5], // Ampliado para que quepan los cuadrados
            axis: true,                  
            showCopyright: false,
            keepaspectratio: true        // ¡CRUCIAL para que los cuadrados no se deformen!
        });

        // 2. Creamos los Puntos (C es el ángulo recto en el origen)
        // Ocultamos los nombres de los vértices y los hacemos un poco más sutiles
        const pC = board.create('point', [0, 0], { fixed: true, withLabel: false, visible: false });
        
        // Habilitamos el "imán suave" (Soft Snapping) para números enteros
        const pB = board.create('glider', [4, 0, board.defaultAxes.x], { 
            withLabel: false, color: '#333333', size: 4, 
            snapToGrid: true, snapSizeX: 1, attractToGrid: true, attractorDistance: 0.2 
        });
        const pA = board.create('glider', [0, 3, board.defaultAxes.y], { 
            withLabel: false, color: '#333333', size: 4, 
            snapToGrid: true, snapSizeY: 1, attractToGrid: true, attractorDistance: 0.2 
        });

        // Estilo común para las etiquetas de texto
        const labelStyle = { fontSize: 24, cssClass: 'font-serif font-bold italic' };

        // 3. Lados (Segmentos). Aplicamos la tipografía y colores de nuestros Design Tokens
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

        // 4. LOS TRES CUADRADOS DE LOS LADOS
        // vertices: { visible: false } elimina por completo los puntitos y letras extra de los cuadrados
        const sqA = board.create('regularpolygon', [pB, pC, 4], {
            fillColor: '#C86446', fillOpacity: 0.2, borders: { strokeColor: '#C86446' },
            vertices: { visible: false }
        });
        const sqB = board.create('regularpolygon', [pC, pA, 4], {
            fillColor: '#C86446', fillOpacity: 0.2, borders: { strokeColor: '#C86446' },
            vertices: { visible: false }
        });
        const sqC = board.create('regularpolygon', [pA, pB, 4], {
            fillColor: '#A2C2A2', fillOpacity: 0.2, borders: { strokeColor: '#A2C2A2' },
            vertices: { visible: false }
        });

        // Guardamos las referencias físicas para el otro useEffect
        elementsRef.current = { sqA, sqB, sqC, sideA, sideB, sideC, board };

        // 5. REACTIVIDAD (Gráfico -> Zustand)
        board.on('update', () => {
            const catetoA = Math.abs((pB as unknown as { X: () => number }).X()); // Lado a
            const catetoB = Math.abs((pA as unknown as { Y: () => number }).Y()); // Lado b
            const hipotenusa = Math.sqrt(catetoA*catetoA + catetoB*catetoB);
            
            setVariable('catetoA', catetoA);
            setVariable('catetoB', catetoB);
            setVariable('hipotenusa', hipotenusa);
        });

        board.update();

        return () => {
            JXG.JSXGraph.freeBoard(board);
            elementsRef.current = {};
        };
    }, [setVariable]);

    // 6. REACTIVIDAD INVERSA (Zustand -> Gráfico)
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { sqA, sqB, sqC, sideA, sideB, sideC, board } = elementsRef.current as Record<string, any>;
        if (!board) return;

        // Reset
        sqA.setAttribute({ fillOpacity: 0.2 });
        sqB.setAttribute({ fillOpacity: 0.2 });
        sqC.setAttribute({ fillOpacity: 0.2 });
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

    return <div ref={boardRef} className="w-full h-full min-h-[500px]" />;
};
