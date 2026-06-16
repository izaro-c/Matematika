import React, { useState, useEffect, useRef } from 'react';
import { useLessonStore } from '../../store/LessonStore';

/**
 * DerivadaSecanteTangente
 *
 * Componente de visualización matemática. Renderiza un diagrama interactivo 
 * o estático para apoyar el contenido de las lecciones.
 */
export const DerivadaSecanteTangente: React.FC = () => {
  const { activeStep } = useLessonStore();
  
  // h varía de 0.01 a 2.
  const [h, setH] = useState(2);
  const svgRef = useRef<SVGSVGElement>(null);

  // La función f(x) = -0.5 * (x - 2)^2 + 3
  const f = (x: number) => -0.5 * Math.pow(x - 2, 2) + 3;
  
  // Punto fijo P en x=1
  const x0 = 1;
  const y0 = f(x0);
  
  // Punto móvil Q en x=1+h
  const x1 = x0 + h;
  const y1 = f(x1);

  // Escala para el SVG
  const scaleX = 50;
  const scaleY = 50;
  const origin = { x: 50, y: 350 }; // SVG bottom-leftish

  const toPx = (x: number, y: number) => ({
    cx: origin.x + x * scaleX,
    cy: origin.y - y * scaleY
  });

  const P = toPx(x0, y0);
  const Q = toPx(x1, y1);

  // Generar la curva
  let pathD = `M ${origin.x} ${origin.y - f(0)*scaleY}`;
  for(let x=0.1; x<=5; x+=0.1) {
    pathD += ` L ${origin.x + x*scaleX} ${origin.y - f(x)*scaleY}`;
  }

  // Recta Secante/Tangente
  // Pendiente m = (y1 - y0) / (x1 - x0)
  const m = (y1 - y0) / (x1 - x0);
  
  // Extender la línea: y - y0 = m(x - x0)
  // Para x = -1
  const lineXStart = -1;
  const lineYStart = m * (lineXStart - x0) + y0;
  // Para x = 5
  const lineXEnd = 5;
  const lineYEnd = m * (lineXEnd - x0) + y0;

  const LineStart = toPx(lineXStart, lineYStart);
  const LineEnd = toPx(lineXEnd, lineYEnd);

  // Handle Dragging
  const [isDragging, setIsDragging] = useState(false);
  
  const handlePointerDown = () => setIsDragging(true);
  const handlePointerUp = () => setIsDragging(false);
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const ex = e.clientX - rect.left;
    
    // Invertir px to x
    const newX = (ex - origin.x) / scaleX;
    let newH = newX - x0;
    
    // Limitar h entre 0.01 y 3
    newH = Math.max(0.001, Math.min(3, newH));
    setH(newH);
  };

  const isSecante = activeStep === 'secante';
  const isTangente = activeStep === 'tangente';

  // Si está en el paso tangente, forzamos animación suave hacia h=0.001
  useEffect(() => {
    if (isTangente) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setH(0.001);
    } else if (isSecante) {
      setH(2);
    }
  }, [isTangente, isSecante]);

  const hDisplay = h < 0.01 ? "0.00" : h.toFixed(2);
  const mDisplay = m.toFixed(2);

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
        {/* Ejes */}
        <line x1={origin.x} y1="0" x2={origin.x} y2="400" stroke="var(--theme-carbon)" strokeWidth="1" strokeDasharray="4"/>
        <line x1="0" y1={origin.y} x2="400" y2={origin.y} stroke="var(--theme-carbon)" strokeWidth="1" strokeDasharray="4"/>

        {/* Curva */}
        <path d={pathD} fill="none" stroke="var(--theme-carbon)" strokeWidth="3" />

        {/* Secante / Tangente */}
        <line 
          x1={LineStart.cx} y1={LineStart.cy} 
          x2={LineEnd.cx} y2={LineEnd.cy} 
          stroke={h < 0.1 ? "var(--theme-terracota)" : "var(--theme-salvia)"} 
          strokeWidth="3" 
          className="transition-colors duration-500"
        />

        {/* Incremento h (Triángulo rectángulo) */}
        {h >= 0.1 && (
          <>
            <line x1={P.cx} y1={P.cy} x2={Q.cx} y2={P.cy} stroke="var(--theme-pizarra)" strokeWidth="2" strokeDasharray="4" />
            <line x1={Q.cx} y1={P.cy} x2={Q.cx} y2={Q.cy} stroke="var(--theme-pizarra)" strokeWidth="2" strokeDasharray="4" />
            <text x={(P.cx + Q.cx)/2} y={P.cy + 15} fill="var(--theme-pizarra)" fontSize="12" textAnchor="middle" className="font-mono">h</text>
            <text x={Q.cx + 5} y={(P.cy + Q.cy)/2} fill="var(--theme-pizarra)" fontSize="12" className="font-mono">f(x+h) - f(x)</text>
          </>
        )}

        {/* Puntos */}
        <circle cx={P.cx} cy={P.cy} r="5" fill="var(--theme-terracota)" />
        <circle cx={Q.cx} cy={Q.cy} r="6" fill={h < 0.1 ? "var(--theme-terracota)" : "var(--theme-salvia)"} className="cursor-ew-resize transition-all" />

        <text x={P.cx - 15} y={P.cy - 10} fill="var(--theme-carbon)" className="font-serif font-bold">P</text>
        {h >= 0.1 && <text x={Q.cx + 10} y={Q.cy - 10} fill="var(--theme-salvia)" className="font-serif font-bold transition-opacity">Q</text>}
      </svg>

      <div className="mt-6 flex flex-col items-center bg-white/80 p-4 rounded shadow-sm border border-carbon/10 min-w-[250px]">
        <p className="text-sm font-bold text-carbon/60 mb-2 uppercase tracking-wider">Tasa de Variación</p>
        
        <div className="font-mono text-lg text-carbon bg-carbon/5 p-3 rounded text-center w-full">
          <p>Distancia <strong className="text-salvia">h = {hDisplay}</strong></p>
          <p className="mt-2 text-pizarra text-sm border-t border-carbon/10 pt-2">Pendiente m = <strong className={h < 0.1 ? "text-terracota" : "text-salvia"}>{mDisplay}</strong></p>
        </div>
        
        <p className="text-xs text-carbon/50 mt-4 italic text-center">Arrastra el punto verde Q hacia P (h=0) para hallar la derivada.</p>
      </div>
    </div>
  );
};
