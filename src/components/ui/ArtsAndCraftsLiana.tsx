import React, { useMemo } from 'react';

interface ArtsAndCraftsLianaProps {
  scrollProgress: number;
  totalHeight: number;
}

/**
 * Evaluadores matemáticos para curvas de Bézier Cúbicas.
 */
const getCubicBezierPoint = (t: number, p0: number, p1: number, p2: number, p3: number): number =>
  Math.pow(1 - t, 3) * p0 +
  3 * Math.pow(1 - t, 2) * t * p1 +
  3 * (1 - t) * Math.pow(t, 2) * p2 +
  Math.pow(t, 3) * p3;

const getCubicBezierDerivative = (t: number, p0: number, p1: number, p2: number, p3: number): number =>
  3 * Math.pow(1 - t, 2) * (p1 - p0) +
  6 * (1 - t) * t * (p2 - p1) +
  3 * Math.pow(t, 2) * (p3 - p2);

/**
 * Calcula la matriz de transformación para alinear perfectamente 
 * un nodo botánico con la tangente de la curva cúbica.
 */
const getBranchTransform = (
  t: number,
  p0x: number, p1x: number, p2x: number, p3x: number,
  p0y: number, p1y: number, p2y: number, p3y: number,
  angleOffset: number,
  scale: number
): string => {
  const x = getCubicBezierPoint(t, p0x, p1x, p2x, p3x);
  const y = getCubicBezierPoint(t, p0y, p1y, p2y, p3y);
  const dx = getCubicBezierDerivative(t, p0x, p1x, p2x, p3x);
  const dy = getCubicBezierDerivative(t, p0y, p1y, p2y, p3y);

  const tangentAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
  const finalAngle = tangentAngle + angleOffset;

  return `translate(${x}, ${y}) rotate(${finalAngle}) scale(${scale})`;
};

// --- Nodos Botánicos Sutiles ---

const SlenderWillowLeaf = ({ transform }: { transform: string }) => (
  <g transform={transform}>
    {/* Tallo ultrafino */}
    <path d="M0,0 Q10,-2 15,0" className="stroke-salvia/40 fill-none" strokeWidth="0.5" />
    {/* Hoja estilizada, esbelta y elegante */}
    <path
      d="M14,0 C20,-8 35,-10 45,-2 C35,4 25,6 14,0 Z"
      className="fill-salvia/10 stroke-salvia/30"
      strokeWidth="0.5"
    />
    <path d="M14,0 Q28,-3 40,-2" className="stroke-salvia/20 fill-none" strokeWidth="0.25" />
  </g>
);

const DelicateTendril = ({ transform }: { transform: string }) => (
  <g transform={transform}>
    {/* Espiral capilar, aporta complejidad sin peso visual */}
    <path
      d="M0,0 C10,-10 25,-5 20,8 C15,20 0,15 5,5 C8,-2 15,0 13,4"
      className="stroke-salvia/30 fill-none"
      strokeWidth="0.5"
      strokeLinecap="round"
    />
  </g>
);

const ElegantBud = ({ transform }: { transform: string }) => (
  <g transform={transform}>
    {/* Pedicelo curvo */}
    <path d="M0,0 Q8,2 12,-4" className="stroke-salvia/40 fill-none" strokeWidth="0.75" />
    {/* Receptáculo botánico (cáliz cerrado) */}
    <path d="M10,-3 L14,-8 L16,-3 Z" className="fill-salvia/20 stroke-salvia/40" strokeWidth="0.5" />
    {/* Capullo cerrado (pétalos sutiles) */}
    <g transform="translate(14, -6) rotate(10)">
      <path d="M0,0 C5,-12 15,-15 15,0 C10,-2 5,2 0,0 Z" className="fill-terracota/10 stroke-terracota/30" strokeWidth="0.5" />
      <path d="M0,0 C8,-8 18,5 15,0 C10,5 5,5 0,0 Z" className="fill-terracota/20 stroke-terracota/40" strokeWidth="0.5" />
    </g>
  </g>
);

export const ArtsAndCraftsLiana: React.FC<ArtsAndCraftsLianaProps> = ({
  scrollProgress,
  totalHeight,
}) => {
  // Alargamos el segmento para que las curvas sean más perezosas y elegantes
  const SEGMENT_H = 400;
  const X_CENTER = 150;
  const AMPLITUDE = 80;

  const { pathPrimary, pathSecondary, elements } = useMemo(() => {
    const segments = Math.max(1, Math.ceil(totalHeight / SEGMENT_H));

    let mainPath = `M${X_CENTER},0 `;
    let secondaryPath = `M${X_CENTER},0 `;
    const nodes: React.ReactNode[] = [];

    for (let i = 0; i < segments; i++) {
      const yStart = i * SEGMENT_H;
      const yEnd = (i + 1) * SEGMENT_H;

      // Controladores para la curva Cúbica en forma de "S"
      const cp1y = yStart + SEGMENT_H * 0.33;
      const cp2y = yStart + SEGMENT_H * 0.66;

      // Desfase lateral alterno para crear el entrelazado continuo
      const isLeft = i % 2 === 0;
      const primaryAmp = isLeft ? AMPLITUDE : -AMPLITUDE;

      // Tallo principal
      const p0x = X_CENTER, p3x = X_CENTER;
      const p1x_pri = X_CENTER + primaryAmp;
      const p2x_pri = X_CENTER - primaryAmp;

      // Tallo secundario (espejado geométricamente)
      const p1x_sec = X_CENTER - primaryAmp;
      const p2x_sec = X_CENTER + primaryAmp;

      mainPath += `C ${p1x_pri} ${cp1y}, ${p2x_pri} ${cp2y}, ${p3x} ${yEnd} `;
      secondaryPath += `C ${p1x_sec} ${cp1y}, ${p2x_sec} ${cp2y}, ${p3x} ${yEnd} `;

      // --- Instanciación de filigrana botánica ---

      // Rama primaria (Brotes y hojas largas)
      nodes.push(
        <SlenderWillowLeaf
          key={`p-leaf-${i}`}
          transform={getBranchTransform(0.25, p0x, p1x_pri, p2x_pri, p3x, yStart, cp1y, cp2y, yEnd, isLeft ? -45 : 45, isLeft ? -1 : 1)}
        />
      );

      nodes.push(
        <ElegantBud
          key={`p-bud-${i}`}
          transform={getBranchTransform(0.75, p0x, p1x_pri, p2x_pri, p3x, yStart, cp1y, cp2y, yEnd, isLeft ? 50 : -50, isLeft ? 1 : -1)}
        />
      );

      // Rama secundaria (Zarcillos entrelazados y hojas de balance)
      nodes.push(
        <DelicateTendril
          key={`s-tendril-${i}`}
          transform={getBranchTransform(0.5, p0x, p1x_sec, p2x_sec, p3x, yStart, cp1y, cp2y, yEnd, isLeft ? 120 : -120, 1)}
        />
      );

      nodes.push(
        <SlenderWillowLeaf
          key={`s-leaf-${i}`}
          transform={getBranchTransform(0.85, p0x, p1x_sec, p2x_sec, p3x, yStart, cp1y, cp2y, yEnd, isLeft ? -60 : 60, isLeft ? 1 : -1)}
        />
      );
    }

    return { pathPrimary: mainPath, pathSecondary: secondaryPath, elements: nodes };
  }, [totalHeight]);

  const offset = typeof window !== 'undefined' ? window.innerHeight / 2 : 400;
  const clipHeight = Math.max(0, scrollProgress * totalHeight + offset);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10 flex justify-center">
      <svg
        width="100%"
        style={{ maxWidth: '300px' }}
        height={totalHeight}
        viewBox={`0 0 300 ${totalHeight}`}
        preserveAspectRatio="xMidYMin slice"
      >
        <defs>
          <clipPath id="elegant-scroll-clip">
            <rect x="0" y="0" width="300" height={clipHeight} />
          </clipPath>
        </defs>

        {/* Marca de agua espectral estructural (Línea guía imperceptible) */}
        <path d={pathPrimary} className="stroke-salvia/5 fill-none" strokeWidth="0.5" strokeLinecap="round" />
        <path d={pathSecondary} className="stroke-salvia/5 fill-none" strokeWidth="0.5" strokeLinecap="round" />

        {/* Crecimiento revelado dinámicamente */}
        <g clipPath="url(#elegant-scroll-clip)">

          {/* Tallo Principal: Fino y elegante */}
          <path d={pathPrimary} className="stroke-salvia/40 fill-none" strokeWidth="1.5" strokeLinecap="round" />

          {/* Tallo Secundario: Aún más fino, entrelazándose con el principal */}
          <path d={pathSecondary} className="stroke-salvia/20 fill-none" strokeWidth="0.75" strokeDasharray="4 2" strokeLinecap="round" />

          {/* Nodos ornamentales */}
          {elements}
        </g>
      </svg>
    </div>
  );
};