import React, { useState } from 'react';
import { useLessonStore } from '../../store/LessonStore';
import { KatexText } from '../../components/ui/KatexText';

/**
 * IntegralAreaVisualizer
 *
 * Componente de visualización matemática. Renderiza un diagrama interactivo 
 * o estático para apoyar el contenido de las lecciones.
 */
export const IntegralAreaVisualizer: React.FC = () => {
  const { activeStep } = useLessonStore();
  
  // f(x) = sin(x) + 2
  // F(x) = -cos(x) + 2x
  const f = (x: number) => Math.sin(x) + 2;
  const F = (x: number) => -Math.cos(x) + 2*x;

  const [a, setA] = useState(1);
  const [b, setB] = useState(4);

  const isBarrow = activeStep === 'barrow';

  // Scale settings
  const width = 400;
  const height = 300;
  const xMin = 0;
  const xMax = 6;
  const yMin = 0;
  const yMax = 4;

  const toX = (x: number) => (x - xMin) / (xMax - xMin) * width;
  const toY = (y: number) => height - (y - yMin) / (yMax - yMin) * height;

  // Path for the curve
  let curvePath = `M ${toX(xMin)} ${toY(f(xMin))}`;
  for(let x=xMin; x<=xMax; x+=0.1) {
    curvePath += ` L ${toX(x)} ${toY(f(x))}`;
  }

  // Path for the filled area
  let areaPath = `M ${toX(a)} ${toY(0)}`;
  for(let x=a; x<=b; x+=0.1) {
    areaPath += ` L ${toX(x)} ${toY(f(x))}`;
  }
  areaPath += ` L ${toX(b)} ${toY(f(b))} L ${toX(b)} ${toY(0)} Z`;

  const area = F(b) - F(a);

  return (
    <div className="w-full h-full min-h-[500px] bg-lienzo flex flex-col items-center justify-center p-6">
      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        className="w-full max-w-[400px] bg-white border border-carbon/10 rounded shadow-sm"
      >
        {/* Grid */}
        <line x1={0} y1={toY(0)} x2={width} y2={toY(0)} stroke="var(--theme-carbon)" strokeWidth="1" />
        
        {/* Area */}
        <path d={areaPath} fill="var(--theme-salvia)" opacity="0.3" />
        
        {/* Bounds Lines */}
        <line x1={toX(a)} y1={toY(0)} x2={toX(a)} y2={toY(f(a))} stroke="var(--theme-salvia)" strokeWidth="2" strokeDasharray="4"/>
        <line x1={toX(b)} y1={toY(0)} x2={toX(b)} y2={toY(f(b))} stroke="var(--theme-salvia)" strokeWidth="2" strokeDasharray="4"/>

        {/* Curve */}
        <path d={curvePath} fill="none" stroke="var(--theme-carbon)" strokeWidth="3" />

        {/* Labels */}
        <text x={toX(a)} y={toY(0) + 15} textAnchor="middle" fill="var(--theme-salvia)" className="font-serif font-bold">a</text>
        <text x={toX(b)} y={toY(0) + 15} textAnchor="middle" fill="var(--theme-salvia)" className="font-serif font-bold">b</text>
        <text x={toX((a+b)/2)} y={toY(1)} textAnchor="middle" fill="var(--theme-salvia)" className="font-bold">Área</text>
      </svg>

      <div className="mt-6 flex flex-col w-full max-w-[400px] gap-4">
        <div className="flex gap-4">
          <label className="flex flex-col flex-1">
            <span className="text-xs font-bold text-carbon/60 uppercase">Límite a</span>
            <input type="range" min="0" max={b-0.5} step="0.1" value={a} onChange={(e)=>setA(parseFloat(e.target.value))} className="accent-salvia" />
          </label>
          <label className="flex flex-col flex-1">
            <span className="text-xs font-bold text-carbon/60 uppercase">Límite b</span>
            <input type="range" min={a+0.5} max="6" step="0.1" value={b} onChange={(e)=>setB(parseFloat(e.target.value))} className="accent-salvia" />
          </label>
        </div>

        <div className={`p-4 bg-white/80 rounded border border-carbon/10 transition-opacity duration-500 ${isBarrow ? 'opacity-100' : 'opacity-30'}`}>
          <KatexText text={`$$ \\int_{${a.toFixed(1)}}^{${b.toFixed(1)}} (\\sin x + 2) \\, dx = F(${b.toFixed(1)}) - F(${a.toFixed(1)}) = ${area.toFixed(2)} $$`} />
        </div>
      </div>
    </div>
  );
};
