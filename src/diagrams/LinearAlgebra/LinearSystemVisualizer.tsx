import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useMathStore } from '../../store/MathStoreContext';
import JXG from 'jsxgraph';

// ── Utilidades matemáticas ────────────────────────────────────────────────────

/**
 * Dado dos puntos P1=(x1,y1) y P2=(x2,y2), devuelve los coeficientes (a,b,c)
 * de la ecuación ax + by = c que pasa por ellos.
 * Normaliza para que a >= 0 (si a=0, b >= 0).
 */
function eqFromPoints(x1: number, y1: number, x2: number, y2: number) {
  const a = y2 - y1;
  const b = x1 - x2;
  const c = a * x1 + b * y1;
  // Normalizar signo para presentación canónica
  const sign = a < 0 || (Math.abs(a) < 1e-9 && b < 0) ? -1 : 1;
  return { a: a * sign, b: b * sign, c: c * sign };
}

/**
 * Redondea a N decimales evitando -0.
 */
function r(v: number, n = 1) {
  const res = Math.round(v * 10 ** n) / 10 ** n;
  return res === 0 ? 0 : res;
}

/** Formatea un coeficiente para mostrar la ecuación */
function fmtEq(a: number, b: number, c: number) {
  const fmtTerm = (coef: number, variable: string, first: boolean) => {
    const rounded = r(coef, 2);
    if (Math.abs(rounded) < 1e-4) return '';
    if (first) return `${rounded === 1 ? '' : rounded === -1 ? '-' : rounded}${variable}`;
    const sign = rounded > 0 ? ' + ' : ' − ';
    const abs = Math.abs(rounded);
    return `${sign}${abs === 1 ? '' : abs}${variable}`;
  };
  const termX = fmtTerm(a, 'x', true) || '0';
  const termY = fmtTerm(b, 'y', false);
  return `${termX}${termY} = ${r(c, 2)}`;
}

/**
 * Calcula el rango de la matriz 2×2 [[a1,b1],[a2,b2]]
 * y el rango de la matriz ampliada 2×3 [[a1,b1,c1],[a2,b2,c2]].
 */
function computeSystem(a2: number, b2: number, c2: number) {
  const a1 = 2, b1 = 1, c1 = 3; // Línea 1 fija: 2x + y = 3

  const det = a1 * b2 - a2 * b1; // det(A)
  const rankA = Math.abs(det) > 1e-6 ? 2
    : (Math.abs(a1) + Math.abs(b1) + Math.abs(a2) + Math.abs(b2) > 1e-6 ? 1 : 0);

  // Menores 2×2 de A* que no usan solo las primeras dos columnas:
  const m13 = a1 * c2 - a2 * c1; // columnas 1 y 3
  const m23 = b1 * c2 - b2 * c1; // columnas 2 y 3
  const rankAstar = rankA === 2 ? 2
    : (Math.abs(m13) > 1e-6 || Math.abs(m23) > 1e-6 ? 2 : rankA);

  type Type = 'SCD' | 'SCI' | 'SI';
  const type: Type = rankA !== rankAstar ? 'SI'
    : rankA === 2 ? 'SCD' : 'SCI';

  return { a2, b2, c2, det: r(det, 2), rankA, rankAstar, type };
}

// ── Configuración de presets por paso ────────────────────────────────────────

/** Puntos que anclan la línea 2 en cada paso predefinido */
const PRESETS = {
  step1: { pa: [0, 0] as [number, number], pb: [1, 1] as [number, number] },   // x − y = 0
  step2: { pa: [0, -1] as [number, number], pb: [1, -3] as [number, number] }, // 2x + y = −1
  step3: { pa: [0, 3] as [number, number], pb: [1, 1] as [number, number] },   // recta coincidente
} as const;

// ── Componente ────────────────────────────────────────────────────────────────

/**
 * LinearSystemVisualizer
 *
 * Visualizador interactivo de sistemas 2×2. Dibuja dos rectas en JSXGraph
 * y muestra en tiempo real las matrices A y A*, su determinante y su rango.
 * La línea 2 es arrastrable para explorar libremente.
 * Responde al estado global "highlight" para animar a presets predefinidos.
 */
export const LinearSystemVisualizer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const boardRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p2aRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p2bRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const line1Ref = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const line2Ref = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const intersectionRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const label2Ref = useRef<any>(null);

  const highlight = useMathStore(state => state.variables['highlight']);
  const step = (highlight as keyof typeof PRESETS) || 'step1';

  const [sys, setSys] = useState(() => computeSystem(1, -1, 0)); // step1 por defecto

  // ── Actualización en vivo desde posición de los puntos ───────────────────

  const refreshFromPoints = useCallback(() => {
    if (!p2aRef.current || !p2bRef.current) return;
    const x1 = p2aRef.current.X();
    const y1 = p2aRef.current.Y();
    const x2 = p2bRef.current.X();
    const y2 = p2bRef.current.Y();

    if (Math.abs(x2 - x1) < 1e-9 && Math.abs(y2 - y1) < 1e-9) return; // puntos coincidentes

    const { a, b, c } = eqFromPoints(x1, y1, x2, y2);
    const newSys = computeSystem(a, b, c);
    setSys(newSys);

    // Actualizar label junto a la recta
    if (label2Ref.current) {
      label2Ref.current.setText(fmtEq(a, b, c));
    }

    // Mostrar / ocultar intersección
    if (intersectionRef.current) {
      intersectionRef.current.setAttribute({ visible: newSys.type === 'SCD' });
    }
    boardRef.current?.update();
  }, []);

  // ── Inicialización del tablero JSXGraph ──────────────────────────────────

  useEffect(() => {
    if (!containerRef.current) return;
    const id = containerRef.current.id;

    boardRef.current = JXG.JSXGraph.initBoard(id, {
      boundingbox: [-5, 6, 5, -6],
      keepaspectratio: false,
      axis: true,
      showCopyright: false,
      showNavigation: false,
      grid: false,
    });

    const b = boardRef.current;

    // Textura de papel
    const svgNode = document.getElementById(id + '_svg');
    if (svgNode) {
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      defs.innerHTML = `<filter id="paper-lsv">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" result="n"/>
        <feColorMatrix values="1 0 0 0 0  0 0.95 0 0 0  0 0.85 0 0 0  0 0 0 0.18 0" in="n" result="c"/>
        <feBlend in="SourceGraphic" in2="c" mode="multiply"/>
      </filter>`;
      svgNode.prepend(defs);
      svgNode.style.filter = 'url(#paper-lsv)';
      svgNode.style.backgroundColor = '#F9F7F2';
    }

    // ── Línea 1 (fija): 2x + y = 3 ──────────────────────────────────────
    const p1a = b.create('point', [0, 3], { visible: false, fixed: true });
    const p1b = b.create('point', [1, 1], { visible: false, fixed: true });
    line1Ref.current = b.create('line', [p1a, p1b], {
      strokeColor: '#2b2b2b', strokeWidth: 2.5, fixed: true,
    });
    // Etiqueta de la ecuación pegada a la recta
    b.create('text', [-4.5, 4.2, '2x + y = 3'], {
      fontSize: 13, color: '#2b2b2b', fixed: true, fontStyle: 'italic',
    });

    // ── Línea 2 (arrastrable): x − y = 0 ────────────────────────────────
    p2aRef.current = b.create('point', PRESETS.step1.pa, {
      size: 5, fillColor: '#A42A04', strokeColor: '#A42A04',
      name: '', showInfobox: false,
    });
    p2bRef.current = b.create('point', PRESETS.step1.pb, {
      size: 5, fillColor: '#A42A04', strokeColor: '#A42A04',
      name: '', showInfobox: false,
    });
    line2Ref.current = b.create('line', [p2aRef.current, p2bRef.current], {
      strokeColor: '#A42A04', strokeWidth: 2.5,
    });
    label2Ref.current = b.create('text', [3.5, 4.2, 'x − y = 0'], {
      fontSize: 13, color: '#A42A04', fixed: false, fontStyle: 'italic',
    });

    // ── Punto de intersección ────────────────────────────────────────────
    intersectionRef.current = b.create('intersection', [line1Ref.current, line2Ref.current, 0], {
      name: 'S', withLabel: true,
      fillColor: '#D4AF37', strokeColor: '#333', size: 6,
      label: { offset: [8, 5], fontSize: 12, fontStyle: 'italic' },
    });

    // Escuchar arrastre para actualizar fórmulas en vivo
    p2aRef.current.on('drag', refreshFromPoints);
    p2bRef.current.on('drag', refreshFromPoints);

    return () => {
      if (boardRef.current) JXG.JSXGraph.freeBoard(boardRef.current);
    };
  }, [refreshFromPoints]);

  // ── Animación al cambiar de paso ─────────────────────────────────────────

  useEffect(() => {
    if (!p2aRef.current || !p2bRef.current) return;
    const preset = PRESETS[step] || PRESETS.step1;

    p2aRef.current.moveTo(preset.pa, 700);
    p2bRef.current.moveTo(preset.pb, 700);

    // Refrescar estado tras animación
    const timeout = setTimeout(() => {
      refreshFromPoints();
    }, 800);

    return () => clearTimeout(timeout);
  }, [step, refreshFromPoints]);

  // ── Descripción contextual ────────────────────────────────────────────────

  const info = {
    SCD: {
      label: 'Compatible Determinado',
      color: '#2a6a2a',
      bg: '#f0faf0',
      border: '#a3d9a3',
      desc: (
        <>
          <strong>Det(A) ≠ 0</strong> → rg(A) = 2 → las filas de A apuntan en <em>direcciones distintas</em>
          {' '}→ las rectas se <strong>cruzan en un punto único</strong>.<br />
          Como rg(A) = rg(A*) = n, el sistema es compatible determinado.
        </>
      ),
    },
    SI: {
      label: 'Incompatible',
      color: '#a42a04',
      bg: '#fff4f0',
      border: '#f4a08a',
      desc: (
        <>
          <strong>Det(A) = 0</strong> → rg(A) = 1 → ambas filas son proporcionales
          {' '}→ las rectas son <strong>paralelas</strong> (misma dirección).<br />
          Sin embargo, rg(A*) = 2 → los términos independientes rompen la proporción
          {' '}→ están a distinta altura → <strong>sin intersección</strong>.
        </>
      ),
    },
    SCI: {
      label: 'Compatible Indeterminado',
      color: '#1a4a9a',
      bg: '#f0f4ff',
      border: '#90aaf0',
      desc: (
        <>
          <strong>Det(A) = 0</strong> → rg(A) = 1 → misma dirección.<br />
          Además, rg(A*) = 1 = rg(A) → los términos independientes
          {' '}<em>también</em> son proporcionales → misma altura →
          {' '}rectas <strong>coincidentes</strong> → infinitas soluciones.
        </>
      ),
    },
  }[sys.type];

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="w-full flex flex-col gap-3">

      {/* Gráfico */}
      <div className="relative w-full">
        <div
          id="system-board"
          ref={containerRef}
          className="w-full rounded border border-carbon/20"
          style={{ aspectRatio: '4 / 3', maxHeight: '340px' }}
        />
        <div className="absolute bottom-2 right-2 text-[10px] text-carbon/40 italic pointer-events-none">
          Arrastra los puntos ●
        </div>
      </div>

      {/* Descripción dinámica */}
      <div
        className="rounded border px-4 py-3 font-serif text-xs leading-relaxed transition-all duration-500"
        style={{ backgroundColor: info.bg, borderColor: info.border, color: info.color }}
      >
        <div className="font-bold text-sm mb-1">Sistema {info.label}</div>
        <div>{info.desc}</div>
      </div>

      {/* Matrices A y A* */}
      <div className="grid grid-cols-2 gap-3">
        {/* Matriz A */}
        <div className="bg-carbon/5 border border-carbon/15 rounded p-3">
          <div className="text-[10px] font-bold text-carbon/50 uppercase tracking-widest text-center mb-2">
            Matriz A — coeficientes
          </div>
          <table className="font-mono text-sm mx-auto border-separate" style={{ borderSpacing: '0 2px' }}>
            <tbody>
              <tr>
                <td className="pr-1 text-[#2b2b2b] font-bold pl-2">2</td>
                <td className="text-[#2b2b2b] font-bold">1</td>
                <td className="pl-2 text-carbon/30 text-xs italic">← 2x+y=3</td>
              </tr>
              <tr>
                <td className="pr-1 text-terracota font-bold pl-2">{r(sys.a2, 2)}</td>
                <td className="text-terracota font-bold">{r(sys.b2, 2)}</td>
                <td className="pl-2 text-carbon/30 text-xs italic">← {fmtEq(sys.a2, sys.b2, sys.c2)}</td>
              </tr>
            </tbody>
          </table>
          <div className="text-[10px] text-carbon/60 border-t border-carbon/10 mt-2 pt-1 text-center">
            det = <strong>{sys.det}</strong> · rg(A) = <strong>{sys.rankA}</strong>
          </div>
        </div>

        {/* Matriz A* */}
        <div className="bg-carbon/5 border border-carbon/15 rounded p-3">
          <div className="text-[10px] font-bold text-carbon/50 uppercase tracking-widest text-center mb-2">
            Matriz A* — ampliada
          </div>
          <table className="font-mono text-sm mx-auto border-separate" style={{ borderSpacing: '0 2px' }}>
            <tbody>
              <tr>
                <td className="pr-1 text-[#2b2b2b] font-bold pl-2">2</td>
                <td className="text-[#2b2b2b] font-bold">1</td>
                <td className="px-1 text-carbon/30">|</td>
                <td className="text-[#2b2b2b]">3</td>
              </tr>
              <tr>
                <td className="pr-1 text-terracota font-bold pl-2">{r(sys.a2, 2)}</td>
                <td className="text-terracota font-bold">{r(sys.b2, 2)}</td>
                <td className="px-1 text-carbon/30">|</td>
                <td className="text-terracota">{r(sys.c2, 2)}</td>
              </tr>
            </tbody>
          </table>
          <div className="text-[10px] text-carbon/60 border-t border-carbon/10 mt-2 pt-1 text-center">
            rg(A*) = <strong
              style={{ color: sys.rankA !== sys.rankAstar ? '#a42a04' : '#2a6a2a' }}
            >{sys.rankAstar}</strong>
            {sys.rankA !== sys.rankAstar
              ? ' ≠ rg(A)  →  incompatible'
              : ' = rg(A)  →  compatible'}
          </div>
        </div>
      </div>

    </div>
  );
};
