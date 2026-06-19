import { useRef, useEffect, useState } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '../../store/MathStoreContext';
import { useLessonStore } from '../../store/LessonStore';

// --- EXTENSIONES DE TIPADO ESTRICTO ---
// Solucionamos la ambigüedad de @types/jsxgraph definiendo las firmas exactas 
// de los elementos geométricos que vamos a manipular analíticamente.

interface JXGPoint extends JXG.GeometryElement {
    X(): number;
    Y(): number;
    coords: {
        usrCoords: number[];
    };
}

interface JXGSlider extends JXG.GeometryElement {
    Value(): number;
}

export const TriangleVisualizer = () => {
    const boardRef = useRef<HTMLDivElement>(null);
    const elementsRef = useRef<Record<string, any>>({});

    // Almacenamos el modo en una Ref para que las funciones internas de JSXGraph
    // puedan leer el valor actualizado sin tener que reinicializar el lienzo.
    const [mode, setMode] = useState<'single' | 'congruent' | 'similar'>('single');
    const modeRef = useRef(mode);

    const setVariable = useMathStore(state => state.setVariable);
    const mathHighlight = useMathStore(state => state.variables['highlight']);
    const lessonHighlight = useLessonStore(state => state.activeStep);
    const highlight = mathHighlight || lessonHighlight;

    // Actualizamos la Ref silenciosa cada vez que cambia el estado de React
    useEffect(() => {
        modeRef.current = mode;
    }, [mode]);

    // 1. INICIALIZACIÓN DEL LIENZO (Se ejecuta UNA sola vez)
    useEffect(() => {
        if (!boardRef.current) return;

        const board = JXG.JSXGraph.initBoard(boardRef.current, {
            boundingbox: [-8, 8, 8, -8],
            axis: false,
            showCopyright: false,
            keepaspectratio: true,
            grid: false,
        });

        // --- TRIÁNGULO MAESTRO (A, B, C) ---
        // Aplicamos el Type Casting seguro hacia nuestra interfaz JXGPoint
        const A = board.create('point', [-4, 2], {
            name: 'A', size: 6, fillColor: '#C86446', strokeColor: '#C86446',
            label: { offset: [-15, 10], fontSize: 14, fontColor: '#333' }
        }) as JXGPoint;

        const B = board.create('point', [0, -2], {
            name: 'B', size: 6, fillColor: '#C86446', strokeColor: '#C86446',
            label: { offset: [10, -15], fontSize: 14, fontColor: '#333' }
        }) as JXGPoint;

        const C = board.create('point', [-2, 4], {
            name: 'C', size: 6, fillColor: '#C86446', strokeColor: '#C86446',
            label: { offset: [-20, 10], fontSize: 14, fontColor: '#333' }
        }) as JXGPoint;

        const poly1 = board.create('polygon', [A, B, C], {
            fillColor: '#C86446', fillOpacity: 0.1,
            borders: { strokeColor: '#333333', strokeWidth: 2.5 }
        });

        const angleA = board.create('angle', [B, A, C], { radius: 0.8, fillColor: '#C86446', fillOpacity: 0.2, strokeWidth: 1.5 });
        const angleB = board.create('angle', [C, B, A], { radius: 0.8, fillColor: '#C86446', fillOpacity: 0.2, strokeWidth: 1.5 });
        const angleC = board.create('angle', [A, C, B], { radius: 0.8, fillColor: '#C86446', fillOpacity: 0.2, strokeWidth: 1.5 });


        // --- ELEMENTOS DINÁMICOS DE TRANSFORMACIÓN ---

        // Deslizador para controlar la semejanza (factor k)
        const scaleSlider = board.create('slider', [[-7, -6], [-3, -6], [0.5, 1.5, 2.5]], {
            name: 'Factor k',
            visible: false, // Controlado por React
            strokeColor: '#333', fillColor: '#A2C2A2'
        }) as JXGSlider;

        // A' sirve como ancla de traslación para el segundo triángulo
        const A2 = board.create('point', [3, 2], {
            name: "A'", size: 5, fillColor: '#A2C2A2', strokeColor: '#A2C2A2',
            visible: false,
            label: { offset: [-15, 10], fontSize: 14, fontColor: '#333' }
        }) as JXGPoint;

        // Función matemática para determinar el factor de escala según el modo activo
        const getScale = () => {
            if (modeRef.current === 'congruent') return 1; // Rigidez
            if (modeRef.current === 'similar') return scaleSlider.Value(); // Homotecia
            return 1;
        };

        // B' y C' se calculan mediante vectores: P' = A' + k * (P - A)
        // Ahora TypeScript sabe que A2, B y A tienen los métodos X() e Y()
        const B2 = board.create('point', [
            () => A2.X() + getScale() * (B.X() - A.X()),
            () => A2.Y() + getScale() * (B.Y() - A.Y())
        ], {
            name: "B'", size: 5, fillColor: '#A2C2A2', strokeColor: '#A2C2A2',
            visible: false, fixed: true, // El usuario arrastra A2, no B2
            label: { offset: [10, -15], fontSize: 14, fontColor: '#333' }
        }) as JXGPoint;

        const C2 = board.create('point', [
            () => A2.X() + getScale() * (C.X() - A.X()),
            () => A2.Y() + getScale() * (C.Y() - A.Y())
        ], {
            name: "C'", size: 5, fillColor: '#A2C2A2', strokeColor: '#A2C2A2',
            visible: false, fixed: true,
            label: { offset: [-20, 10], fontSize: 14, fontColor: '#333' }
        }) as JXGPoint;

        const poly2 = board.create('polygon', [A2, B2, C2], {
            fillColor: '#A2C2A2', fillOpacity: 0.1, visible: false,
            borders: { strokeColor: '#333333', strokeWidth: 2.5, dash: () => modeRef.current === 'similar' ? 2 : 0 }
        });

        const angleA2 = board.create('angle', [B2, A2, C2], { radius: () => 0.8 * getScale(), fillColor: '#A2C2A2', fillOpacity: 0.2, strokeWidth: 1.5, visible: false });
        const angleB2 = board.create('angle', [C2, B2, A2], { radius: () => 0.8 * getScale(), fillColor: '#A2C2A2', fillOpacity: 0.2, strokeWidth: 1.5, visible: false });
        const angleC2 = board.create('angle', [A2, C2, B2], { radius: () => 0.8 * getScale(), fillColor: '#A2C2A2', fillOpacity: 0.2, strokeWidth: 1.5, visible: false });

        // Texto descriptivo dinámico
        const relText = board.create('text', [0, -7, () => {
            if (modeRef.current === 'congruent') return "△ABC ≅ △A'B'C'  (Congruentes - LAL)";
            if (modeRef.current === 'similar') return `△ABC ~ △A'B'C'  (Semejantes, k=${scaleSlider.Value().toFixed(2)})`;
            return "";
        }], { fontSize: 14, color: '#333333', visible: false });

        elementsRef.current = {
            board, A, B, C, poly1, angleA, angleB, angleC,
            A2, B2, C2, poly2, angleA2, angleB2, angleC2,
            scaleSlider, relText
        };

        // Exportar mediciones iniciales (ahora coords no lanza error)
        board.on('update', () => {
            const distAB = JXG.Math.Geometry.distance(A.coords.usrCoords, B.coords.usrCoords);
            const distBC = JXG.Math.Geometry.distance(B.coords.usrCoords, C.coords.usrCoords);
            const distCA = JXG.Math.Geometry.distance(C.coords.usrCoords, A.coords.usrCoords);
            setVariable('side_AB', distAB.toFixed(2));
            setVariable('side_BC', distBC.toFixed(2));
            setVariable('side_CA', distCA.toFixed(2));
        });

        return () => {
            JXG.JSXGraph.freeBoard(board);
            elementsRef.current = {};
        };
    }, [setVariable]);

    // 2. CONTROL DE VISIBILIDAD DE PESTAÑAS
    // React decide qué se muestra sin destruir el lienzo geométrico
    useEffect(() => {
        const elements = elementsRef.current;
        if (!elements.board) return;

        const showSecondary = mode === 'congruent' || mode === 'similar';

        elements.A2.setAttribute({ visible: showSecondary });
        elements.B2.setAttribute({ visible: showSecondary });
        elements.C2.setAttribute({ visible: showSecondary });
        elements.poly2.setAttribute({ visible: showSecondary });
        elements.angleA2.setAttribute({ visible: showSecondary });
        elements.angleB2.setAttribute({ visible: showSecondary });
        elements.angleC2.setAttribute({ visible: showSecondary });
        elements.relText.setAttribute({ visible: showSecondary });

        elements.scaleSlider.setAttribute({ visible: mode === 'similar' });

        elements.board.update();
    }, [mode]);

    // 3. SISTEMA DE RESALTADO (Highlighting de Store)
    useEffect(() => {
        const elements = elementsRef.current;
        if (!elements.board) return;

        ['A', 'B', 'C'].forEach(pt => {
            if (elements[pt]) {
                const isActive = highlight === pt;
                elements[pt].setAttribute({
                    size: isActive ? 10 : 6,
                    fillColor: isActive ? '#f5c542' : '#C86446',
                    strokeColor: isActive ? '#f5c542' : '#C86446'
                });
            }
        });

        elements.board.update();
    }, [highlight]);

    return (
        <div className="w-full h-full bg-lienzo rounded-[4px] border border-pizarra/20 flex flex-col shadow-sm">
            <div className="p-3 border-b border-pizarra/10 bg-carbon/5 flex items-center justify-between">
                <div className="flex gap-2">
                    <button
                        onClick={() => setMode('single')}
                        className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-all ${mode === 'single'
                            ? 'bg-terracota text-lienzo shadow-md'
                            : 'bg-lienzo text-carbon/70 hover:bg-carbon/10'
                            }`}
                    >
                        Triángulo Base
                    </button>
                    <button
                        onClick={() => setMode('congruent')}
                        className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-all ${mode === 'congruent'
                            ? 'bg-terracota text-lienzo shadow-md'
                            : 'bg-lienzo text-carbon/70 hover:bg-carbon/10'
                            }`}
                    >
                        Congruencia
                    </button>
                    <button
                        onClick={() => setMode('similar')}
                        className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-all ${mode === 'similar'
                            ? 'bg-terracota text-lienzo shadow-md'
                            : 'bg-lienzo text-carbon/70 hover:bg-carbon/10'
                            }`}
                    >
                        Semejanza
                    </button>
                </div>
            </div>

            <div
                ref={boardRef}
                className="flex-1 w-full"
                style={{
                    backgroundColor: '#Fdfcf7',
                    minHeight: '450px',
                }}
            />

            <div className="p-4 bg-carbon/5 text-sm font-serif text-carbon border-t border-pizarra/10">
                <p>
                    {mode === 'single' && <span><strong>Modo Base:</strong> Arrastra los vértices <span className="text-terracota font-bold">A</span>, <span className="text-terracota font-bold">B</span> y <span className="text-terracota font-bold">C</span> para modificar las propiedades inherentes del triángulo.</span>}
                    {mode === 'congruent' && <span><strong>Congruencia Activa:</strong> Modifica el triángulo original; el triángulo secundario (verde) mantendrá la métrica exacta. Puedes arrastrar el vértice <span className="text-salvia font-bold font-sans">A'</span> para trasladarlo.</span>}
                    {mode === 'similar' && <span><strong>Semejanza Activa:</strong> Usa el <em>deslizador inferior izquierdo</em> para alterar la constante de proporcionalidad ($k$). Los ángulos se conservan invariantes.</span>}
                </p>
            </div>
        </div>
    );
};

export default TriangleVisualizer;