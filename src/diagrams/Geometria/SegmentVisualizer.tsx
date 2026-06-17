import React, { useState, useRef } from 'react';
// import { useLessonStore } from '../../store/LessonStore';

/**
 * SegmentoVisualizer
 * Representación interactiva de un segmento AB.
 * Basado en la arquitectura del visualizador de derivadas verificado.
 */
export const SegmentoVisualizer: React.FC = () => {
    // const { activeStep } = useLessonStore();

    // Estado local de los puntos extremos en coordenadas lógicas
    const [pointA, setPointA] = useState({ x: 1, y: 1 });
    const [pointB, setPointB] = useState({ x: 5, y: 3 });
    const [dragging, setDragging] = useState<'A' | 'B' | null>(null);

    const svgRef = useRef<SVGSVGElement>(null);
    const scale = 50;
    const origin = { x: 50, y: 350 };

    // Mapeo lógico a píxeles
    const toPx = (x: number, y: number) => ({
        cx: origin.x + x * scale,
        cy: origin.y - y * scale
    });

    const pA = toPx(pointA.x, pointA.y);
    const pB = toPx(pointB.x, pointB.y);

    // Manejadores de puntero
    const handlePointerDown = (point: 'A' | 'B') => () => setDragging(point);
    const handlePointerUp = () => setDragging(null);

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!dragging || !svgRef.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        const newX = (e.clientX - rect.left - origin.x) / scale;
        const newY = (origin.y - (e.clientY - rect.top)) / scale;

        if (dragging === 'A') setPointA({ x: newX, y: newY });
        else setPointB({ x: newX, y: newY });
    };

    return (
        <div className="w-full h-full min-h-[400px] bg-[var(--theme-lienzo)] flex flex-col items-center justify-center p-4 rounded-2xl border border-[var(--theme-carbon)]/10 shadow-sm">
            <svg
                ref={svgRef}
                viewBox="0 0 400 400"
                className="w-full max-w-[400px] h-auto touch-none"
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
            >
                {/* Ejes de referencia */}
                <line x1={origin.x} y1="0" x2={origin.x} y2="400" stroke="var(--theme-carbon)" strokeWidth="1" strokeDasharray="4" />
                <line x1="0" y1={origin.y} x2="400" y2={origin.y} stroke="var(--theme-carbon)" strokeWidth="1" strokeDasharray="4" />

                {/* El Segmento */}
                <line
                    x1={pA.cx} y1={pA.cy}
                    x2={pB.cx} y2={pB.cy}
                    stroke="var(--theme-carbon)"
                    strokeWidth="3"
                />

                {/* Puntos interactivos */}
                <circle
                    cx={pA.cx} cy={pA.cy} r="8"
                    fill="var(--theme-terracota)"
                    className="cursor-grab active:cursor-grabbing"
                    onPointerDown={handlePointerDown('A')}
                />
                <circle
                    cx={pB.cx} cy={pB.cy} r="8"
                    fill="var(--theme-terracota)"
                    className="cursor-grab active:cursor-grabbing"
                    onPointerDown={handlePointerDown('B')}
                />

                {/* Etiquetas */}
                <text x={pA.cx - 10} y={pA.cy - 15} fill="var(--theme-carbon)" className="font-serif font-bold">A</text>
                <text x={pB.cx - 10} y={pB.cy - 15} fill="var(--theme-carbon)" className="font-serif font-bold">B</text>
            </svg>

            <div className="mt-6 p-4 bg-white/50 rounded border border-[var(--theme-carbon)]/10 text-center">
                <p className="text-sm text-[var(--theme-carbon)]/70">
                    Arrastra los puntos <strong>A</strong> y <strong>B</strong> para definir el segmento.
                </p>
            </div>
        </div>
    );
};