import React, { useState } from 'react';
import { KatexText } from '../../components/ui/KatexText';

export const CrossProductVisualizer: React.FC = () => {
  const [ux, setUx] = useState(3);
  const [uy, setUy] = useState(1);
  
  const [vx, setVx] = useState(1);
  const [vy, setVy] = useState(3);

  // u x v = (0, 0, ux*vy - uy*vx)
  const wz = ux * vy - uy * vx;

  // Escala para proyeccion isometrica
  const scale = 25;
  const cx = 250;
  const cy = 250;

  const isoX = (x: number, y: number, _z?: number) => {
    return cx + (x - y) * Math.cos(Math.PI / 6) * scale;
  };
  
  const isoY = (x: number, y: number, z: number) => {
    return cy - (z * scale) + (x + y) * Math.sin(Math.PI / 6) * scale;
  };

  // Coordenadas origen
  const oX = isoX(0, 0, 0);
  const oY = isoY(0, 0, 0);

  // Ejes
  const axes = (
    <g stroke="var(--theme-carbon)" strokeOpacity="0.2" strokeWidth="1">
      <line x1={oX} y1={oY} x2={isoX(6, 0, 0)} y2={isoY(6, 0, 0)} />
      <line x1={oX} y1={oY} x2={isoX(0, 6, 0)} y2={isoY(0, 6, 0)} />
      <line x1={oX} y1={oY} x2={isoX(0, 0, 10)} y2={isoY(0, 0, 10)} />
      <line x1={oX} y1={oY} x2={isoX(0, 0, -10)} y2={isoY(0, 0, -10)} />
      <text x={isoX(6.5, 0, 0)} y={isoY(6.5, 0, 0)} fill="var(--theme-carbon)" fontSize="12">X</text>
      <text x={isoX(0, 6.5, 0)} y={isoY(0, 6.5, 0)} fill="var(--theme-carbon)" fontSize="12">Y</text>
      <text x={isoX(0, 0, 10.5)} y={isoY(0, 0, 10.5)} fill="var(--theme-carbon)" fontSize="12">Z</text>
    </g>
  );

  // Vectores
  const pUX = isoX(ux, uy, 0);
  const pUY = isoY(ux, uy, 0);

  const pVX = isoX(vx, vy, 0);
  const pVY = isoY(vx, vy, 0);

  const pWX = isoX(0, 0, wz);
  const pWY = isoY(0, 0, wz);

  // Paralelogramo (Area base)
  const px = ux + vx;
  const py = uy + vy;
  const pSumX = isoX(px, py, 0);
  const pSumY = isoY(px, py, 0);

  return (
    <div className="w-full h-full min-h-[550px] bg-lienzo flex flex-col items-center justify-center p-6">
      <svg 
        viewBox="0 0 500 500" 
        className="w-full max-w-[400px] bg-white border border-carbon/10 rounded shadow-sm overflow-hidden"
      >
        <defs>
          <marker id="arrowU" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--theme-terracota)" />
          </marker>
          <marker id="arrowV" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--theme-salvia)" />
          </marker>
          <marker id="arrowW" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--theme-pizarra)" />
          </marker>
        </defs>

        {axes}

        {/* Base Paralelogramo */}
        <polygon 
          points={`${oX},${oY} ${pUX},${pUY} ${pSumX},${pSumY} ${pVX},${pVY}`} 
          fill="var(--theme-carbon)" 
          fillOpacity="0.1" 
          stroke="var(--theme-carbon)" 
          strokeOpacity="0.3" 
          strokeDasharray="4"
        />

        {/* Vectores U y V */}
        <line x1={oX} y1={oY} x2={pUX} y2={pUY} stroke="var(--theme-terracota)" strokeWidth="3" markerEnd="url(#arrowU)" />
        <line x1={oX} y1={oY} x2={pVX} y2={pVY} stroke="var(--theme-salvia)" strokeWidth="3" markerEnd="url(#arrowV)" />

        <text x={pUX + 10} y={pUY} fill="var(--theme-terracota)" className="font-bold italic">u</text>
        <text x={pVX + 10} y={pVY} fill="var(--theme-salvia)" className="font-bold italic">v</text>

        {/* Vector Producto (W) */}
        <line x1={oX} y1={oY} x2={pWX} y2={pWY} stroke="var(--theme-pizarra)" strokeWidth="4" markerEnd="url(#arrowW)" />
        <text x={pWX + 10} y={pWY - 10} fill="var(--theme-pizarra)" className="font-bold italic">u × v</text>
      </svg>

      <div className="mt-6 flex flex-col w-full max-w-[400px] gap-4">
        <div className="flex gap-4">
          <div className="flex flex-col flex-1 gap-2 p-3 bg-terracota/10 rounded">
            <div className="text-center font-bold text-terracota mb-1 border-b border-terracota/20 pb-1">Vector u</div>
            <label className="flex items-center gap-2">
              <span className="text-xs font-bold text-carbon/60 w-4">X:</span>
              <input type="range" min="-5" max="5" step="1" value={ux} onChange={(e)=>setUx(parseFloat(e.target.value))} className="accent-terracota w-full" />
              <span className="text-sm w-4">{ux}</span>
            </label>
            <label className="flex items-center gap-2">
              <span className="text-xs font-bold text-carbon/60 w-4">Y:</span>
              <input type="range" min="-5" max="5" step="1" value={uy} onChange={(e)=>setUy(parseFloat(e.target.value))} className="accent-terracota w-full" />
              <span className="text-sm w-4">{uy}</span>
            </label>
          </div>

          <div className="flex flex-col flex-1 gap-2 p-3 bg-salvia/10 rounded">
            <div className="text-center font-bold text-salvia mb-1 border-b border-salvia/20 pb-1">Vector v</div>
            <label className="flex items-center gap-2">
              <span className="text-xs font-bold text-carbon/60 w-4">X:</span>
              <input type="range" min="-5" max="5" step="1" value={vx} onChange={(e)=>setVx(parseFloat(e.target.value))} className="accent-salvia w-full" />
              <span className="text-sm w-4">{vx}</span>
            </label>
            <label className="flex items-center gap-2">
              <span className="text-xs font-bold text-carbon/60 w-4">Y:</span>
              <input type="range" min="-5" max="5" step="1" value={vy} onChange={(e)=>setVy(parseFloat(e.target.value))} className="accent-salvia w-full" />
              <span className="text-sm w-4">{vy}</span>
            </label>
          </div>
        </div>

        <div className="p-3 bg-pizarra/10 rounded border border-pizarra/20 text-center flex flex-col gap-2">
          <KatexText text={`$$ \\vec{u} \\times \\vec{v} = \\begin{vmatrix} \\hat{i} & \\hat{j} & \\hat{k} \\\\ ${ux} & ${uy} & 0 \\\\ ${vx} & ${vy} & 0 \\end{vmatrix} = (0, 0, ${wz}) $$`} />
          <p className="text-sm font-sans text-carbon/70 mt-1">El área del paralelogramo (base gris) es de <strong>{Math.abs(wz)}</strong> unidades cuadradas.</p>
        </div>
      </div>
    </div>
  );
};
