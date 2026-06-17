import React, { useState } from 'react';

/**
 * IncidenciaVisualizer
 * Representación interactiva de la relación de incidencia (I).
 * Axioma: Dos puntos distintos determinan una única recta.
 */
export const IncidenciaVisualizer: React.FC = () => {
  const [pointA] = useState({ x: 1, y: 1 });
  const [pointB] = useState({ x: 5, y: 3 });

  const scale = 50;
  const origin = { x: 50, y: 350 };

  const toPx = (x: number, y: number) => ({
    cx: origin.x + x * scale,
    cy: origin.y - y * scale
  });

  const pA = toPx(pointA.x, pointA.y);
  const pB = toPx(pointB.x, pointB.y);

  // Ecuación de la recta que pasa por A y B
  // Para visualización, extendemos la línea más allá de los puntos
  const dx = pB.cx - pA.cx;
  const dy = pB.cy - pA.cy;
  const length = Math.sqrt(dx * dx + dy * dy);

  // Normalizar para extender la línea
  const ux = dx / length;
  const uy = dy / length;

  const start = { cx: pA.cx - ux * 100, cy: pA.cy - uy * 100 };
  const end = { cx: pB.cx + ux * 100, cy: pB.cy + uy * 100 };

  return (
    <div className="w-full h-full min-h-[400px] bg-[var(--theme-lienzo)] flex flex-col items-center justify-center p-4 rounded-2xl border border-[var(--theme-carbon)]/10 shadow-sm">
      <svg viewBox="0 0 400 400" className="w-full max-w-[400px] h-auto">
        {/* Recta r (La entidad geométrica que contiene a los puntos) */}
        <line
          x1={start.cx} y1={start.cy}
          x2={end.cx} y2={end.cy}
          stroke="var(--theme-math-plane)"
          strokeWidth="2"
        />

        {/* Punto A */}
        <circle cx={pA.cx} cy={pA.cy} r="6" fill="var(--theme-terracota)" />

        {/* Punto B */}
        <circle cx={pB.cx} cy={pB.cy} r="6" fill="var(--theme-terracota)" />

        {/* Etiquetas */}
        <text x={pA.cx - 15} y={pA.cy - 10} fill="var(--theme-carbon)" className="font-serif font-bold">A</text>
        <text x={pB.cx + 10} y={pB.cy - 10} fill="var(--theme-carbon)" className="font-serif font-bold">B</text>
        <text x={end.cx - 20} y={end.cy - 10} fill="var(--theme-math-plane)" className="font-serif italic font-bold">r</text>
      </svg>

      <div className="mt-6 p-4 bg-white/50 rounded border border-[var(--theme-carbon)]/10 text-center max-w-[300px]">
        <p className="text-sm text-[var(--theme-carbon)]/80 font-serif">
          <strong>Axioma I.1:</strong> Para dos puntos cualesquiera $A$ y $B$, existe siempre una recta $r$ que incide en ambos.
        </p>
      </div>
    </div>
  );
};