import React, { useMemo } from 'react';

interface ArtsAndCraftsLianaProps {
  scrollProgress: number;
  totalHeight: number;
}

// --- 1. Constantes Matemáticas Fundamentales ---

const PHI = (1 + Math.sqrt(5)) / 2; // ~1.61803

// --- 2. Funciones de Evaluación de Curvas de Bézier Cúbicas ---

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
 * Aproximación numérica de la integral de longitud de arco mediante 
 * discretización de segmentos de recta (n=20 ofrece un error < 0.1% en estas curvas).
 */
const approximateBezierLength = (
  p0x: number, p1x: number, p2x: number, p3x: number,
  p0y: number, p1y: number, p2y: number, p3y: number,
  steps: number = 20
): number => {
  let length = 0;
  let prevX = p0x;
  let prevY = p0y;

  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const x = getCubicBezierPoint(t, p0x, p1x, p2x, p3x);
    const y = getCubicBezierPoint(t, p0y, p1y, p2y, p3y);
    const dx = x - prevX;
    const dy = y - prevY;
    length += Math.sqrt(dx * dx + dy * dy);
    prevX = x;
    prevY = y;
  }
  return length;
};

// --- 3. Tipos y Modelos de Datos Topológicos ---

interface NodeMetadata {
  id: string;
  globalY: number;      // Coordenada Y absoluta en el documento
  baseTransform: string; // Traslación y rotación derivadas de la tangente
  componentType: 'leaf' | 'tendril' | 'bud';
}

function placeNode(
  nodes: NodeMetadata[],
  id: string, type: 'leaf' | 'tendril' | 'bud',
  t: number, p0x: number, p1x: number, p2x: number, p3x: number,
  p0y: number, p1y: number, p2y: number, p3y: number,
  angleOffset: number
): void {
  const x = getCubicBezierPoint(t, p0x, p1x, p2x, p3x);
  const y = getCubicBezierPoint(t, p0y, p1y, p2y, p3y);
  const dx = getCubicBezierDerivative(t, p0x, p1x, p2x, p3x);
  const dy = getCubicBezierDerivative(t, p0y, p1y, p2y, p3y);
  const tangentAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
  nodes.push({
    id,
    globalY: y,
    baseTransform: `translate(${x}, ${y}) rotate(${tangentAngle + angleOffset})`,
    componentType: type
  });
}

// --- 4. Subcomponentes Vectoriales Base (Sin transformación propia) ---

const SlenderWillowLeaf = () => (
  <g>
    <path d="M0,0 Q10,-2 15,0" className="stroke-salvia/40 fill-none" strokeWidth="0.5" />
    <path
      d="M14,0 C20,-8 35,-10 45,-2 C35,4 25,6 14,0 Z"
      className="fill-salvia/10 stroke-salvia/30"
      strokeWidth="0.5"
    />
    <path d="M14,0 Q28,-3 40,-2" className="stroke-salvia/20 fill-none" strokeWidth="0.25" />
  </g>
);

const DelicateTendril = () => (
  <g>
    <path
      d="M0,0 C10,-10 25,-5 20,8 C15,20 0,15 5,5 C8,-2 15,0 13,4"
      className="stroke-salvia/40 fill-none"
      strokeWidth="0.5"
      strokeLinecap="round"
    />
  </g>
);

const ElegantBud = () => (
  <g>
    <path d="M0,0 Q8,2 12,-4" className="stroke-salvia/50 fill-none" strokeWidth="0.75" />
    <path d="M10,-3 L14,-8 L16,-3 Z" className="fill-salvia/20 stroke-salvia/50" strokeWidth="0.5" />
    <g transform="translate(14, -6) rotate(10)">
      <path d="M0,0 C5,-12 15,-15 15,0 C10,-2 5,2 0,0 Z" className="fill-terracota/20 stroke-terracota/40" strokeWidth="0.5" />
      <path d="M0,0 C8,-8 18,5 15,0 C10,5 5,5 0,0 Z" className="fill-terracota/30 stroke-terracota/50" strokeWidth="0.5" />
    </g>
  </g>
);

// --- 5. Motor de Renderizado Principal ---

export const ArtsAndCraftsLiana: React.FC<ArtsAndCraftsLianaProps> = ({
  scrollProgress,
  totalHeight,
}) => {
  const SEGMENT_H = 400;
  const X_CENTER = 150;
  // Aplicamos la proporción áurea a la amplitud para una dispersión más orgánica
  const BASE_AMPLITUDE = 80;
  const SECONDARY_AMPLITUDE = BASE_AMPLITUDE / PHI;

  // Calculamos la topología y geometría matemática una única vez
  const { pathPrimary, pathSecondary, totalPrimaryLength, totalSecondaryLength, nodesMap } = useMemo(() => {
    const segments = Math.max(1, Math.ceil(totalHeight / SEGMENT_H));

    let mainPath = `M${X_CENTER},0 `;
    let secondaryPath = `M${X_CENTER},0 `;
    let accPrimaryLength = 0;
    let accSecondaryLength = 0;

    const nodes: NodeMetadata[] = [];

    for (let i = 0; i < segments; i++) {
      const yStart = i * SEGMENT_H;
      const yEnd = (i + 1) * SEGMENT_H;
      const isLeft = i % 2 === 0;

      const cp1y = yStart + SEGMENT_H * 0.33;
      const cp2y = yStart + SEGMENT_H * 0.66;

      const p1x_pri = X_CENTER + (isLeft ? BASE_AMPLITUDE : -BASE_AMPLITUDE);
      const p2x_pri = X_CENTER - (isLeft ? BASE_AMPLITUDE : -BASE_AMPLITUDE);

      const p1x_sec = X_CENTER - (isLeft ? SECONDARY_AMPLITUDE : -SECONDARY_AMPLITUDE);
      const p2x_sec = X_CENTER + (isLeft ? SECONDARY_AMPLITUDE : -SECONDARY_AMPLITUDE);

      mainPath += `C ${p1x_pri} ${cp1y}, ${p2x_pri} ${cp2y}, ${X_CENTER} ${yEnd} `;
      secondaryPath += `C ${p1x_sec} ${cp1y}, ${p2x_sec} ${cp2y}, ${X_CENTER} ${yEnd} `;

      // Suma integral discreta
      accPrimaryLength += approximateBezierLength(X_CENTER, p1x_pri, p2x_pri, X_CENTER, yStart, cp1y, cp2y, yEnd);
      accSecondaryLength += approximateBezierLength(X_CENTER, p1x_sec, p2x_sec, X_CENTER, yStart, cp1y, cp2y, yEnd);

      // Inyección de Nodos Paramétricos
      placeNode(nodes, `p-leaf-${i}`, 'leaf', 0.25, X_CENTER, p1x_pri, p2x_pri, X_CENTER, yStart, cp1y, cp2y, yEnd, isLeft ? -45 : 45);
      placeNode(nodes, `p-bud-${i}`, 'bud', 0.75, X_CENTER, p1x_pri, p2x_pri, X_CENTER, yStart, cp1y, cp2y, yEnd, isLeft ? 50 : -50);
      placeNode(nodes, `s-tendril-${i}`, 'tendril', 0.5, X_CENTER, p1x_sec, p2x_sec, X_CENTER, yStart, cp1y, cp2y, yEnd, isLeft ? 120 : -120);
      placeNode(nodes, `s-leaf-${i}`, 'leaf', 0.85, X_CENTER, p1x_sec, p2x_sec, X_CENTER, yStart, cp1y, cp2y, yEnd, isLeft ? -60 : 60);
    }

    return {
      pathPrimary: mainPath,
      pathSecondary: secondaryPath,
      totalPrimaryLength: accPrimaryLength,
      totalSecondaryLength: accSecondaryLength,
      nodesMap: nodes
    };
  }, [totalHeight]);

  // --- 6. Cálculos de Cinemática Dinámica en Render ---

  // Easing cúbico inverso (ease-out) para que el brote frene suavemente al alcanzar escala 1
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

  // Offset previsor: La animación comienza un poco antes de que el scroll alcance exactamente el punto
  const SIGHT_OFFSET = typeof window !== 'undefined' ? window.innerHeight * 0.6 : 500;
  const currentYOffset = scrollProgress * totalHeight + SIGHT_OFFSET;

  // Offset del DashArray: 1.0 (invisible) a 0.0 (totalmente dibujado)
  // Permite que el tallo crezca fluidamente
  const strokeProgress = Math.min(1, Math.max(0, currentYOffset / totalHeight));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10 flex justify-center">
      <svg
        width="100%"
        style={{ maxWidth: '300px' }}
        height={totalHeight}
        viewBox={`0 0 300 ${totalHeight}`}
        preserveAspectRatio="xMidYMin slice"
      >
        {/* Guías estructurales pasivas (espectrales) */}
        <path d={pathPrimary} className="stroke-salvia/5 fill-none" strokeWidth="0.5" />
        <path d={pathSecondary} className="stroke-salvia/5 fill-none" strokeWidth="0.5" />

        {/* Tallos Dinámicos impulsados por cálculo de longitud de arco */}
        <path
          d={pathPrimary}
          className="stroke-salvia/50 fill-none"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray={totalPrimaryLength}
          strokeDashoffset={totalPrimaryLength * (1 - strokeProgress)}
        />
        <path
          d={pathSecondary}
          className="stroke-salvia/30 fill-none"
          strokeWidth="0.75"
          strokeDasharray={`${totalSecondaryLength} ${totalSecondaryLength}`}
          strokeDashoffset={totalSecondaryLength * (1 - strokeProgress)}
          strokeLinecap="round"
        />

        {/* Instanciación y escalado de la botánica dinámica */}
        {nodesMap.map((node) => {
          // Ventana de crecimiento: cuántos píxeles de scroll toma ir de escala 0 a 1
          const GROWTH_WINDOW = 200;

          let rawProgress = (currentYOffset - node.globalY) / GROWTH_WINDOW;
          rawProgress = Math.max(0, Math.min(1, rawProgress));

          const finalScale = easeOutCubic(rawProgress);

          // Optimización en árbol de React: Si no ha empezado a crecer, no renderizamos el nodo
          if (finalScale === 0) return null;

          return (
            <g
              key={node.id}
              // Combinamos la topología precalculada con la cinemática en tiempo real
              transform={`${node.baseTransform} scale(${finalScale})`}
            >
              {node.componentType === 'leaf' && <SlenderWillowLeaf />}
              {node.componentType === 'tendril' && <DelicateTendril />}
              {node.componentType === 'bud' && <ElegantBud />}
            </g>
          );
        })}
      </svg>
    </div>
  );
};