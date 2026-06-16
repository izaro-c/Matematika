import React, { useState, useRef } from 'react';
import { useLessonStore } from '../../store/LessonStore';

/**
 * TalesSimulation
 *
 * Componente de visualización matemática. Renderiza un diagrama interactivo 
 * o estático para apoyar el contenido de las lecciones.
 */
export const TalesSimulation: React.FC = () => {
  const { activeStep } = useLessonStore();
  
  // Posición del corte DE (porcentaje de la altura, entre 0.2 y 0.8)
  const [cutRatio, setCutRatio] = useState(0.5);
  const svgRef = useRef<SVGSVGElement>(null);

  // Coordenadas del triángulo principal ABC
  const A = { x: 200, y: 50 };
  const B = { x: 50, y: 350 };
  const C = { x: 350, y: 350 };

  // Puntos D y E (el corte paralelo a BC)
  const D = {
    x: A.x + (B.x - A.x) * cutRatio,
    y: A.y + (B.y - A.y) * cutRatio
  };
  const E = {
    x: A.x + (C.x - A.x) * cutRatio,
    y: A.y + (C.y - A.y) * cutRatio
  };

  // Longitudes (escaladas para ser "visualmente" entendibles)
  const dist = (p1: { x: number; y: number }, p2: { x: number; y: number }) => Math.sqrt((p2.x - p1.x)**2 + (p2.y - p1.y)**2) / 10;
  
  const lenAD = dist(A, D).toFixed(1);
  const lenDB = dist(D, B).toFixed(1);
  const lenAE = dist(A, E).toFixed(1);
  const lenEC = dist(E, C).toFixed(1);

  // Proporciones
  const prop1 = (parseFloat(lenAD) / parseFloat(lenDB)).toFixed(2);
  const prop2 = (parseFloat(lenAE) / parseFloat(lenEC)).toFixed(2);

  // Mover el corte si hacemos drag
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = () => setIsDragging(true);
  const handlePointerUp = () => setIsDragging(false);
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    
    // Convertir y a cutRatio
    // A.y = 50, B.y = 350 => Rango de Y es 50 a 350 (300 px)
    let newRatio = (y - A.y) / (B.y - A.y);
    newRatio = Math.max(0.1, Math.min(0.9, newRatio));
    setCutRatio(newRatio);
  };

  // Efectos según activeStep
  const isProporcion = activeStep === 'proporcion';

  return (
    <div className="w-full h-full min-h-[400px] bg-lienzo flex flex-col items-center justify-center p-4">
      <svg 
        ref={svgRef}
        viewBox="0 0 400 400" 
        className="w-full max-w-[400px] h-auto touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Triángulo principal */}
        <polygon 
          points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} 
          fill="rgba(200, 100, 70, 0.05)" 
          stroke="var(--theme-carbon)" 
          strokeWidth="2"
        />

        {/* Línea de corte DE */}
        <line 
          x1={D.x - 20} y1={D.y} 
          x2={E.x + 20} y2={E.y} 
          stroke="var(--theme-salvia)" 
          strokeWidth={isProporcion ? "4" : "2"}
          strokeDasharray="4"
          className="cursor-ns-resize transition-all"
        />
        <circle cx={D.x} cy={D.y} r="5" fill="var(--theme-salvia)" className="cursor-ns-resize" />
        <circle cx={E.x} cy={E.y} r="5" fill="var(--theme-salvia)" className="cursor-ns-resize" />

        {/* Highlight AD and AE if in proporcion step */}
        {isProporcion && (
          <>
            <line x1={A.x} y1={A.y} x2={D.x} y2={D.y} stroke="var(--theme-terracota)" strokeWidth="4" />
            <line x1={A.x} y1={A.y} x2={E.x} y2={E.y} stroke="var(--theme-terracota)" strokeWidth="4" />
          </>
        )}

        {/* Vértices Textos */}
        <text x={A.x} y={A.y - 10} textAnchor="middle" fill="var(--theme-carbon)" className="font-serif font-bold">A</text>
        <text x={B.x - 15} y={B.y + 10} fill="var(--theme-carbon)" className="font-serif font-bold">B</text>
        <text x={C.x + 10} y={C.y + 10} fill="var(--theme-carbon)" className="font-serif font-bold">C</text>
        <text x={D.x - 15} y={D.y - 5} fill="var(--theme-salvia)" className="font-serif font-bold">D</text>
        <text x={E.x + 10} y={E.y - 5} fill="var(--theme-salvia)" className="font-serif font-bold">E</text>

        {/* Medidas (Mostradas según el paso o si interactúas) */}
        <text x={(A.x + D.x) / 2 - 25} y={(A.y + D.y) / 2} fill="var(--theme-terracota)" fontSize="12" className="font-mono">{lenAD}</text>
        <text x={(D.x + B.x) / 2 - 25} y={(D.y + B.y) / 2} fill="var(--theme-pizarra)" fontSize="12" className="font-mono">{lenDB}</text>
        <text x={(A.x + E.x) / 2 + 10} y={(A.y + E.y) / 2} fill="var(--theme-terracota)" fontSize="12" className="font-mono">{lenAE}</text>
        <text x={(E.x + C.x) / 2 + 10} y={(E.y + C.y) / 2} fill="var(--theme-pizarra)" fontSize="12" className="font-mono">{lenEC}</text>

      </svg>

      <div className="mt-6 flex flex-col items-center bg-white/80 p-4 rounded shadow-sm border border-carbon/10 min-w-[250px]">
        <p className="text-sm font-bold text-carbon/60 mb-2 uppercase tracking-wider">Teorema de Tales</p>
        <div className="flex justify-between w-full font-mono text-lg text-carbon">
          <div className="flex flex-col items-center">
            <span className="text-terracota">AD = {lenAD}</span>
            <hr className="w-full border-carbon my-1" />
            <span className="text-pizarra">DB = {lenDB}</span>
          </div>
          <div className="flex items-center mx-4">= <strong className="ml-2 bg-salvia/20 px-2 rounded text-salvia">{prop1}</strong></div>
        </div>
        
        <div className="flex justify-between w-full font-mono text-lg text-carbon mt-4">
          <div className="flex flex-col items-center">
            <span className="text-terracota">AE = {lenAE}</span>
            <hr className="w-full border-carbon my-1" />
            <span className="text-pizarra">EC = {lenEC}</span>
          </div>
          <div className="flex items-center mx-4">= <strong className="ml-2 bg-salvia/20 px-2 rounded text-salvia">{prop2}</strong></div>
        </div>
        
        <p className="text-xs text-carbon/50 mt-4 italic text-center">Arrastra la línea verde para comprobar que la proporción se mantiene constante.</p>
      </div>
    </div>
  );
};
