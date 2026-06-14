import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';

export const JSXGraphWrapper = () => {
    // 1. Creamos la "correa" para el DOM
    const boardRef = useRef<HTMLDivElement>(null);

    // 2. Ejecutamos el efecto secundario después de montar el componente
    useEffect(() => {
        if (!boardRef.current) return;

        // Le pasamos el Nodo DOM real a JSXGraph en vez de usar un ID de texto ("box")
        const board = JXG.JSXGraph.initBoard(boardRef.current, {
            boundingbox: [-5, 5, 5, -5], // Eje X de -5 a 5, Eje Y de -5 a 5
            axis: true,                  // Dibuja los ejes cartesianos
            showCopyright: false         // Quitamos la marca de agua
        });

        // 3. LA FUNCIÓN DE LIMPIEZA (Vital para no dejar Memory Leaks)
        // Cuando el usuario cambie de lección, React desmontará el componente.
        // Al hacerlo, ejecutará esta función para limpiar la memoria gráfica.
        return () => {
            JXG.JSXGraph.freeBoard(board);
        };
    }, []); // El Array vacío [] significa: "Ejecuta esto solo 1 vez al nacer el componente"

    // 4. React solo renderiza un div pasivo y le engancha la correa (ref)
    return <div ref={boardRef} className="w-full h-[500px]" />;
};
