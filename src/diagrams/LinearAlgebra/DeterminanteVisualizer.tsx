import React, { useEffect, useRef, useState } from 'react';
import JXG from 'jsxgraph';

/**
 * DeterminanteVisualizer
 *
 * Ilustra la interpretación geométrica del determinante:
 * el valor absoluto del determinante de la matriz [v1 | v2] es igual
 * al área del paralelogramo subtendido por los vectores columna v1 y v2.
 *
 * Los dos vectores son completamente arrastrables. En tiempo real:
 * - Se actualiza la matriz correspondiente
 * - Se calcula el determinante
 * - Se muestra el paralelogramo con su área coloreada
 * - Se distingue el signo (orientación del giro horario / antihorario)
 */
export const DeterminanteVisualizer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<any>(null);
  const [det, setDet] = useState(1);
  const [v1, setV1] = useState([1, 0]);
  const [v2, setV2] = useState([0, 1]);

  useEffect(() => {
    if (!containerRef.current) return;
    const id = containerRef.current.id;

    boardRef.current = JXG.JSXGraph.initBoard(id, {
      boundingbox: [-4, 4, 4, -4],
      axis: true,
      keepaspectratio: true,
      showCopyright: false,
      showNavigation: false,
      grid: true,
    });

    const b = boardRef.current;

    // Textura de papel
    const svgNode = document.getElementById(id + '_svg');
    if (svgNode) {
      svgNode.style.backgroundColor = '#F9F7F2';
    }

    const O = b.create('point', [0, 0], { visible: false, fixed: true });

    // Vector 1 (columna 1 de la matriz)
    const A = b.create('point', [1, 0], {
      name: 'v₁', withLabel: true,
      fillColor: '#2b2b2b', strokeColor: '#2b2b2b', size: 5,
      label: { offset: [8, 6], fontSize: 13, fontStyle: 'italic' },
    });

    // Vector 2 (columna 2 de la matriz)
    const B2 = b.create('point', [0, 1], {
      name: 'v₂', withLabel: true,
      fillColor: '#A42A04', strokeColor: '#A42A04', size: 5,
      label: { offset: [8, 6], fontSize: 13, fontStyle: 'italic' },
    });

    // Cuarto vértice del paralelogramo: A + B2
    const D = b.create('point', [
      () => A.X() + B2.X(),
      () => A.Y() + B2.Y(),
    ], { visible: false });

    // Polígono relleno
    b.create('polygon', [O, A, D, B2], {
      fillColor: '#A42A04',
      fillOpacity: 0.15,
      strokeColor: 'transparent',
      hasInnerPoints: false,
      borders: {
        strokeColor: '#A42A04',
        strokeWidth: 1,
        strokeOpacity: 0.3,
        dash: 2,
      },
    });

    // Flechas principales
    b.create('arrow', [O, A], { strokeColor: '#2b2b2b', strokeWidth: 2.5 });
    b.create('arrow', [O, B2], { strokeColor: '#A42A04', strokeWidth: 2.5 });
    // Flechas de completado (punteadas)
    b.create('segment', [A, D], { strokeColor: '#2b2b2b', strokeWidth: 1.5, dash: 2, strokeOpacity: 0.5 });
    b.create('segment', [B2, D], { strokeColor: '#A42A04', strokeWidth: 1.5, dash: 2, strokeOpacity: 0.5 });

    // Etiqueta del área en el centro del paralelogramo
    b.create('text', [
      () => (A.X() + B2.X()) / 2,
      () => (A.Y() + B2.Y()) / 2,
      () => {
        const d = A.X() * B2.Y() - B2.X() * A.Y();
        if (Math.abs(d) < 0.05) return 'det = 0';
        return `|det| = ${Math.abs(Math.round(d * 100) / 100)}`;
      },
    ], {
      fontSize: 13,
      color: '#A42A04',
      fontStyle: 'italic',
      fixed: false,
      cssStyle: 'font-family: Georgia, serif; font-weight: bold;',
    });

    const update = () => {
      const ax = A.X(), ay = A.Y();
      const bx = B2.X(), by = B2.Y();
      const d = Math.round((ax * by - bx * ay) * 100) / 100;
      setDet(d);
      setV1([Math.round(ax * 10) / 10, Math.round(ay * 10) / 10]);
      setV2([Math.round(bx * 10) / 10, Math.round(by * 10) / 10]);
    };

    A.on('drag', update);
    B2.on('drag', update);

    return () => { if (boardRef.current) JXG.JSXGraph.freeBoard(boardRef.current); };
  }, []);

  const absdet = Math.abs(det);
  const singular = Math.abs(det) < 0.05;
  const positive = det > 0;

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Gráfico */}
      <div className="relative">
        <div
          id="det-board"
          ref={containerRef}
          className="w-full rounded border border-carbon/20"
          style={{ aspectRatio: '1 / 1', maxHeight: '340px' }}
        />
        <div className="absolute bottom-2 right-2 text-[10px] text-carbon/40 italic pointer-events-none">
          Arrastra v₁ y v₂
        </div>
      </div>

      {/* Panel numérico */}
      <div className="grid grid-cols-3 gap-2">
        {/* Matriz */}
        <div className="bg-carbon/5 border border-carbon/15 rounded p-3 flex flex-col items-center gap-1">
          <div className="text-[10px] font-bold text-carbon/50 uppercase tracking-widest">Matriz A</div>
          <div className="font-mono text-sm text-center leading-5">
            <div className="border-l-2 border-r-2 border-carbon/50 px-2 py-1">
              <div><span className="text-[#2b2b2b] font-bold">{v1[0]}</span>&nbsp;&nbsp;<span className="text-terracota font-bold">{v2[0]}</span></div>
              <div><span className="text-[#2b2b2b] font-bold">{v1[1]}</span>&nbsp;&nbsp;<span className="text-terracota font-bold">{v2[1]}</span></div>
            </div>
          </div>
          <div className="text-[9px] text-carbon/40 text-center">col1 = v₁ · col2 = v₂</div>
        </div>

        {/* Det */}
        <div className="bg-carbon/5 border border-carbon/15 rounded p-3 flex flex-col items-center justify-center gap-1">
          <div className="text-[10px] font-bold text-carbon/50 uppercase tracking-widest">det(A)</div>
          <div className={`text-2xl font-serif font-bold transition-colors ${singular ? 'text-terracota' : 'text-carbon'}`}>
            {det}
          </div>
          {singular
            ? <div className="text-[10px] text-terracota text-center">singular</div>
            : <div className="text-[10px] text-carbon/40 text-center">{positive ? 'antihorario' : 'horario'}</div>
          }
        </div>

        {/* Área */}
        <div className="bg-carbon/5 border border-carbon/15 rounded p-3 flex flex-col items-center justify-center gap-1">
          <div className="text-[10px] font-bold text-carbon/50 uppercase tracking-widest">Área</div>
          <div className={`text-2xl font-serif font-bold ${singular ? 'text-terracota' : 'text-[#2a6a2a]'}`}>
            {absdet}
          </div>
          <div className="text-[10px] text-carbon/40">unidades²</div>
        </div>
      </div>

      {/* Explicación dinámica */}
      <div className={`rounded border px-4 py-3 text-xs font-serif leading-relaxed transition-all duration-300 ${
        singular
          ? 'bg-terracota/5 border-terracota/30 text-terracota'
          : 'bg-carbon/5 border-carbon/15 text-carbon/70'
      }`}>
        {singular
          ? <><strong>Det = 0 → Colapso.</strong> Los vectores son paralelos (linealmente dependientes). El paralelogramo colapsa a una línea: área = 0. La matriz no es invertible.</>
          : positive
          ? <><strong>Det = {det} &gt; 0 → Giro antihorario.</strong> Los vectores forman una base orientada positivamente. El paralelo&shy;gramo tiene un área de {absdet} unidades².</>
          : <><strong>Det = {det} &lt; 0 → Giro horario.</strong> La orientación está invertida respecto al estándar. El área sigue siendo {absdet} unidades², pero el signo marca la inversión.</>
        }
      </div>
    </div>
  );
};
