import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '../../store/MathStoreContext';
import { useLessonStore } from '../../store/LessonStore';

export const PointAndLineVisualizer = () => {
    const boardRef = useRef<HTMLDivElement>(null);
    const elementsRef = useRef<Record<string, any>>({});
    const setVariable = useMathStore(state => state.setVariable);
    const mathHighlight = useMathStore(state => state.variables['highlight']);
    const lessonHighlight = useLessonStore(state => state.activeStep);
    const highlight = mathHighlight || lessonHighlight;

    // Initialize JSXGraph board and elements
    useEffect(() => {
        if (!boardRef.current) return;

        const board = JXG.JSXGraph.initBoard(boardRef.current, {
            boundingbox: [-6, 6, 6, -6],
            axis: true,
            showCopyright: false,
            keepaspectratio: true,
            grid: false,
            defaultAxes: {
                x: {
                    label: { offset: [0, -20], fontSize: 12, color: '#333333' },
                    color: '#333333',
                    strokeWidth: 1.5,
                },
                y: {
                    label: { offset: [-20, 0], fontSize: 12, color: '#333333' },
                    color: '#333333',
                    strokeWidth: 1.5,
                },
            },
        });

        // Create two points
        const pointA = board.create('point', [-2, 2], {
            name: 'A',
            size: 6,
            fillColor: '#C86446', // terracota
            strokeColor: '#C86446',
            face: 'o',
            label: { offset: [-10, -15], fontSize: 12, color: '#333333' },
            fixed: false,
            snapToGrid: false,
        });

        const pointB = board.create('point', [3, -1], {
            name: 'B',
            size: 6,
            fillColor: '#C86446', // terracota
            strokeColor: '#C86446',
            face: 'o',
            label: { offset: [10, -15], fontSize: 12, color: '#333333' },
            fixed: false,
            snapToGrid: false,
        });

        // Create the unique line through both points
        const line = board.create('line', [pointA, pointB], {
            strokeColor: '#333333', // carbon
            strokeWidth: 2,
            straightFirst: true,
            straightLast: true,
            dash: 0,
        });

        // Add a third draggable point to demonstrate that it determines the line
        const pointC = board.create('point', [1, 3], {
            name: 'C',
            size: 5,
            fillColor: '#A2C2A2', // salvia (mutable point)
            strokeColor: '#A2C2A2',
            face: 'o',
            label: { offset: [10, 10], fontSize: 11, color: '#5D7080' },
            fixed: false,
            snapToGrid: false,
        });

        elementsRef.current = { board, pointA, pointB, pointC, line };

        // Send line update event to store
        board.on('update', () => {
            const dist = JXG.Math.Geometry.distance(pointA.coords.usrCoords, pointB.coords.usrCoords);
            setVariable('distance_AB', dist.toFixed(2));
        });

        board.update();

        return () => {
            JXG.JSXGraph.freeBoard(board);
            elementsRef.current = {};
        };
    }, [setVariable]);

    // Highlight effect
    useEffect(() => {
        const { pointA, pointB, pointC, line, board } = elementsRef.current;
        if (!board) return;

        // Reset all elements to default
        pointA.setAttribute({ size: 6, fillColor: '#C86446', strokeColor: '#C86446' });
        pointB.setAttribute({ size: 6, fillColor: '#C86446', strokeColor: '#C86446' });
        pointC.setAttribute({ size: 5, fillColor: '#A2C2A2', strokeColor: '#A2C2A2' });
        line.setAttribute({ strokeWidth: 2, strokeColor: '#333333' });

        // Apply highlight
        if (highlight === 'pointA' || highlight === 'A') {
            pointA.setAttribute({ size: 10, fillColor: '#f5c542', strokeColor: '#f5c542' });
        }
        if (highlight === 'pointB' || highlight === 'B') {
            pointB.setAttribute({ size: 10, fillColor: '#f5c542', strokeColor: '#f5c542' });
        }
        if (highlight === 'line' || highlight === 'recta') {
            line.setAttribute({ strokeWidth: 4, strokeColor: '#f5c542' });
        }
        if (highlight === 'pointC') {
            pointC.setAttribute({ size: 8, fillColor: '#f5c542', strokeColor: '#f5c542' });
        }

        board.update();
    }, [highlight]);

    return (
        <div className="w-full h-full min-h-[450px] bg-lienzo rounded-lg border border-pizarra/20">
            <div
                ref={boardRef}
                style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#F8F6F1',
                }}
            />
            <div className="p-3 bg-lienzo/50 text-xs text-pizarra">
                <p className="font-semibold">Interactivo:</p>
                <p>Arrastra los puntos A y B para ver cómo la recta se redetermina automáticamente.</p>
                <p>Solo UNA recta pasa por dos puntos distintos (Axioma).</p>
            </div>
        </div>
    );
};

export default PointAndLineVisualizer;