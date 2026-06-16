import React, { useState, useMemo } from 'react';

const W = 290;
const H = 290;
const CX = W / 2;
const CY = H / 2;
const SCALE = 38; // píxeles por unidad
const GRID_RANGE = 3;

/** Convierte coordenadas de mundo a SVG */
function wp(x: number, y: number): [number, number] {
  return [CX + SCALE * x, CY - SCALE * y];
}

/** Aplica la transformación lineal [[a,b],[c,d]] al punto (x,y) */
function applyM(a: number, b: number, c: number, d: number, x: number, y: number): [number, number] {
  return [a * x + b * y, c * x + d * y];
}

/** Redondeado a 1 decimal */
function r1(v: number) { return Math.round(v * 10) / 10; }

interface SliderProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
}
const Slider: React.FC<SliderProps> = ({ label, value, onChange }) => (
  <label className="flex flex-col items-center gap-1 select-none">
    <span className="font-mono text-xs text-carbon/70">
      {label} = <span className="font-bold text-carbon">{value}</span>
    </span>
    <input
      type="range" min="-2" max="2" step="0.5" value={value}
      onChange={e => onChange(parseFloat(e.target.value))}
      className="w-20 cursor-pointer accent-terracota"
    />
  </label>
);

// Arrow helper
const Arrow = ({ x1, y1, x2, y2, color, id }: { x1: number; y1: number; x2: number; y2: number; color: string; id: string }) => {
  const [sx1, sy1] = wp(x1, y1);
  const [sx2, sy2] = wp(x2, y2);
  const dx = sx2 - sx1, dy = sy2 - sy1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 2) return null;
  // Acortar para la flecha
  const ux = dx / len, uy = dy / len;
  const arrowSize = 8;
  const ax2 = sx2 - ux * arrowSize * 0.6;
  const ay2 = sy2 - uy * arrowSize * 0.6;
  return (
    <line
      x1={sx1} y1={sy1} x2={ax2} y2={ay2}
      stroke={color} strokeWidth={2.5}
      markerEnd={`url(#arr-${id})`}
    />
  );
};

/**
 * MatrizTransformVisualizer
 *
 * Visualiza cómo una matriz 2×2 deforma el plano.
 * El usuario ajusta las 4 entradas (a, b, c, d) con sliders.
 * Se muestra en tiempo real:
 * - La cuadrícula original (gris claro)
 * - La cuadrícula transformada (terracota)
 * - Los vectores columna i′ y j′ (a dónde van los ejes)
 * - El paralelogramo que forman (= det(A) unidades de área)
 */
export const MatrizTransformVisualizer: React.FC = () => {
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);
  const [c, setC] = useState(0);
  const [d, setD] = useState(1);

  const det = r1(a * d - b * c);
  const singular = Math.abs(a * d - b * c) < 0.05;

  // Líneas de la cuadrícula original
  const origLines = useMemo<[number, number, number, number][]>(() => {
    const lines: [number, number, number, number][] = [];
    for (let i = -GRID_RANGE; i <= GRID_RANGE; i++) {
      lines.push([i, -GRID_RANGE, i, GRID_RANGE]); // verticales
      lines.push([-GRID_RANGE, i, GRID_RANGE, i]); // horizontales
    }
    return lines;
  }, []);

  // Líneas transformadas
  const transLines = useMemo(() =>
    origLines.map(([x1, y1, x2, y2]) => {
      const [tx1, ty1] = applyM(a, b, c, d, x1, y1);
      const [tx2, ty2] = applyM(a, b, c, d, x2, y2);
      return [tx1, ty1, tx2, ty2] as [number, number, number, number];
    }),
  [a, b, c, d, origLines]);

  // Vectores imagen de i=(1,0) y j=(0,1)
  const [ipx, ipy] = applyM(a, b, c, d, 1, 0);
  const [jpx, jpy] = applyM(a, b, c, d, 0, 1);


  // Polígono del paralelogramo
  const paraPoints = (() => {
    const [p0x, p0y] = wp(0, 0);
    const [p1x, p1y] = wp(ipx, ipy);
    const [p2x, p2y] = wp(ipx + jpx, ipy + jpy);
    const [p3x, p3y] = wp(jpx, jpy);
    return `${p0x},${p0y} ${p1x},${p1y} ${p2x},${p2y} ${p3x},${p3y}`;
  })();

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Sliders */}
      <div className="bg-carbon/5 border border-carbon/15 rounded p-4">
        <div className="text-[10px] font-bold text-carbon/50 uppercase tracking-widest text-center mb-3">
          Edita la Transformación
        </div>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <div className="flex flex-col gap-3">
            <Slider label="a" value={a} onChange={setA} />
            <Slider label="c" value={c} onChange={setC} />
          </div>

          {/* Matriz visual */}
          <div className="flex flex-col items-center gap-1">
            <div
              className="font-mono text-base leading-6 px-3 py-2"
              style={{ borderLeft: '2px solid #555', borderRight: '2px solid #555' }}
            >
              <div>
                <span className="text-[#2b2b2b] font-bold">{a}</span>
                &ensp;
                <span className="text-terracota font-bold">{b}</span>
              </div>
              <div>
                <span className="text-[#2b2b2b] font-bold">{c}</span>
                &ensp;
                <span className="text-terracota font-bold">{d}</span>
              </div>
            </div>
            <div className="text-[10px] text-carbon/50">
              det = <strong className={singular ? 'text-terracota' : ''}>{det}</strong>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Slider label="b" value={b} onChange={setB} />
            <Slider label="d" value={d} onChange={setD} />
          </div>
        </div>
      </div>

      {/* SVG */}
      <svg
        width={W} height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="mx-auto rounded border border-carbon/20 bg-[#F9F7F2]"
      >
        <defs>
          <clipPath id="svgClip">
            <rect x="0" y="0" width={W} height={H} />
          </clipPath>
          {/* Marcadores de flecha */}
          <marker id="arr-dark" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
            <path d="M0,0 L0,7 L7,3.5 z" fill="#2b2b2b" />
          </marker>
          <marker id="arr-red" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
            <path d="M0,0 L0,7 L7,3.5 z" fill="#A42A04" />
          </marker>
        </defs>

        {/* Cuadrícula original */}
        <g clipPath="url(#svgClip)">
          {origLines.map(([x1, y1, x2, y2], i) => {
            const [sx1, sy1] = wp(x1, y1);
            const [sx2, sy2] = wp(x2, y2);
            return <line key={`o${i}`} x1={sx1} y1={sy1} x2={sx2} y2={sy2} stroke="#ccc" strokeWidth={0.7} />;
          })}

          {/* Cuadrícula transformada */}
          {transLines.map(([x1, y1, x2, y2], i) => {
            const [sx1, sy1] = wp(x1, y1);
            const [sx2, sy2] = wp(x2, y2);
            return <line key={`t${i}`} x1={sx1} y1={sy1} x2={sx2} y2={sy2} stroke="#A42A04" strokeWidth={0.8} strokeOpacity={0.4} />;
          })}

          {/* Paralelogramo de los vectores columna */}
          <polygon
            points={paraPoints}
            fill="#A42A04" fillOpacity={0.12}
            stroke="#A42A04" strokeWidth={1.2} strokeOpacity={0.6}
          />
        </g>

        {/* Ejes */}
        <g clipPath="url(#svgClip)">
          <Arrow x1={-GRID_RANGE + 0.1} y1={0} x2={GRID_RANGE - 0.1} y2={0} color="#999" id="dark" />
          <Arrow x1={0} y1={-GRID_RANGE + 0.1} x2={0} y2={GRID_RANGE - 0.1} color="#999" id="dark" />
        </g>

        {/* Vectores imagen */}
        <g clipPath="url(#svgClip)">
          <Arrow x1={0} y1={0} x2={ipx} y2={ipy} color="#2b2b2b" id="dark" />
          <Arrow x1={0} y1={0} x2={jpx} y2={jpy} color="#A42A04" id="red" />
        </g>

        {/* Etiquetas */}
        {(() => {
          const [x, y] = wp(ipx, ipy);
          return <text x={x + 6} y={y - 4} fontSize="12" fill="#2b2b2b" fontStyle="italic" fontFamily="Georgia, serif">i′</text>;
        })()}
        {(() => {
          const [x, y] = wp(jpx, jpy);
          return <text x={x + 6} y={y - 4} fontSize="12" fill="#A42A04" fontStyle="italic" fontFamily="Georgia, serif">j′</text>;
        })()}

        {/* Origen */}
        {(() => {
          const [ox, oy] = wp(0, 0);
          return <circle cx={ox} cy={oy} r={3} fill="#2b2b2b" />;
        })()}
      </svg>

      {/* Leyenda y explicación */}
      <div className={`rounded border px-4 py-3 text-xs font-serif leading-relaxed transition-all duration-300 ${
        singular
          ? 'bg-terracota/5 border-terracota/30 text-terracota'
          : 'bg-carbon/5 border-carbon/15 text-carbon/70'
      }`}>
        {singular
          ? <><strong>Det = 0 → Colapso dimensional.</strong> Las filas/columnas son proporcionales. La transformación aplana el plano a una línea, perdiendo información irreversiblemente. La matriz no es invertible.</>
          : det > 0
          ? <><strong>Det = {det} &gt; 0 → Expansión orientada.</strong> La transformación estira el plano por un factor de {Math.abs(det)}. Preserva la orientación (giro antihorario). Los vectores <em>i′</em> y <em>j′</em> forman un paralelogramo de área {Math.abs(det)}.</>
          : <><strong>Det = {det} &lt; 0 → Reflexión.</strong> La transformación invierte la orientación (espejo). El área se escala por {Math.abs(det)}, pero el giro cambia de antihorario a horario.</>
        }
      </div>

      <div className="text-[10px] font-serif text-carbon/40 text-center">
        <span className="inline-flex items-center gap-1 mr-3">
          <span className="inline-block w-4 border-t border-gray-300" /> cuadrícula original
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block w-4 border-t border-terracota" /> cuadrícula transformada
        </span>
      </div>
    </div>
  );
};
