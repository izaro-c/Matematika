import React, { useState, useEffect, useRef } from 'react';

// Puntos de un pentágono irregular
const ORIGINAL_POLY = [
  { x: 80, y: 40 },
  { x: 150, y: 20 },
  { x: 200, y: 80 },
  { x: 170, y: 150 },
  { x: 50, y: 130 },
];

function calcArea(pts: { x: number; y: number }[]): number {
  let area = 0;
  const n = pts.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += pts[i].x * pts[j].y;
    area -= pts[j].x * pts[i].y;
  }
  return Math.abs(area) / 2;
}

function rotate(pts: { x: number; y: number }[], angle: number, cx: number, cy: number) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return pts.map(({ x, y }) => ({
    x: cx + (x - cx) * cos - (y - cy) * sin,
    y: cy + (x - cx) * sin + (y - cy) * cos,
  }));
}

function translate(pts: { x: number; y: number }[], dx: number, dy: number) {
  return pts.map(({ x, y }) => ({ x: x + dx, y: y + dy }));
}

function toPolyStr(pts: { x: number; y: number }[]) {
  return pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
}

export const InvarianzaAreaVisualizer: React.FC = () => {
  const originalArea = calcArea(ORIGINAL_POLY).toFixed(1);
  const [mode, setMode] = useState<'traslacion' | 'rotacion'>('traslacion');
  const [progress, setProgress] = useState(0); // 0..1
  const rafRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const duration = 2400;
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = (ts - startRef.current) % (duration * 2);
      const t = elapsed < duration ? elapsed / duration : 2 - elapsed / duration;
      setProgress(t);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [mode]);

  // Centroid
  const cx = ORIGINAL_POLY.reduce((s, p) => s + p.x, 0) / ORIGINAL_POLY.length;
  const cy = ORIGINAL_POLY.reduce((s, p) => s + p.y, 0) / ORIGINAL_POLY.length;

  const transformed =
    mode === 'traslacion'
      ? translate(ORIGINAL_POLY, progress * 140, progress * 40)
      : rotate(ORIGINAL_POLY, progress * Math.PI, cx, cy);

  const transformedArea = calcArea(transformed).toFixed(1);

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm border border-carbon/10 mb-8 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-lg text-carbon font-bold">Invarianza del Área bajo Isometrías</h3>
        <div className="flex gap-2">
          <button
            onClick={() => { setMode('traslacion'); startRef.current = null; }}
            className={`px-3 py-1 text-xs font-bold rounded uppercase tracking-wider transition-all ${
              mode === 'traslacion' ? 'bg-salvia text-lienzo' : 'bg-carbon/10 text-carbon/60 hover:bg-carbon/20'
            }`}
          >
            Traslación
          </button>
          <button
            onClick={() => { setMode('rotacion'); startRef.current = null; }}
            className={`px-3 py-1 text-xs font-bold rounded uppercase tracking-wider transition-all ${
              mode === 'rotacion' ? 'bg-terracota text-lienzo' : 'bg-carbon/10 text-carbon/60 hover:bg-carbon/20'
            }`}
          >
            Rotación
          </button>
        </div>
      </div>

      <svg viewBox="0 0 360 200" className="w-full rounded border border-carbon/10 bg-lienzo/50">
        {/* Grid */}
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={200} stroke="#e5e0d8" strokeWidth="0.5" />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 40} x2={360} y2={i * 40} stroke="#e5e0d8" strokeWidth="0.5" />
        ))}

        {/* Original polygon (ghost) */}
        <polygon
          points={toPolyStr(ORIGINAL_POLY)}
          fill="var(--color-salvia)"
          fillOpacity={0.10}
          stroke="var(--color-salvia)"
          strokeWidth="1.5"
          strokeDasharray="5,3"
        />
        <text
          x={cx} y={cy + 5}
          textAnchor="middle"
          fontSize="10"
          fill="var(--color-salvia)"
          fontFamily="serif"
          fontStyle="italic"
        >
          original
        </text>

        {/* Transformed polygon */}
        <polygon
          points={toPolyStr(transformed)}
          fill="var(--color-terracota)"
          fillOpacity={0.20}
          stroke="var(--color-terracota)"
          strokeWidth="2"
        />

        {/* Rotation center dot */}
        {mode === 'rotacion' && (
          <circle cx={cx} cy={cy} r="4" fill="var(--color-pizarra)" opacity={0.7} />
        )}
      </svg>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-2 gap-4 font-mono text-sm text-center">
        <div className="bg-salvia/10 rounded p-3 border border-salvia/20">
          <div className="text-xs text-carbon/50 uppercase tracking-wider mb-1">Área original</div>
          <div className="text-xl font-bold text-salvia">{originalArea} u²</div>
        </div>
        <div className="bg-terracota/10 rounded p-3 border border-terracota/20">
          <div className="text-xs text-carbon/50 uppercase tracking-wider mb-1">Área transformada</div>
          <div className="text-xl font-bold text-terracota">{transformedArea} u²</div>
        </div>
      </div>
      <p className="text-center text-xs text-carbon/40 mt-3 font-serif italic">
        Cualquier traslación o rotación preserva el área exactamente.
      </p>
    </div>
  );
};
