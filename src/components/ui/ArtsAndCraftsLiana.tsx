import React, { useMemo } from 'react';

interface EraColorStop {
  offset: string;
  color: string;
}

interface ArtsAndCraftsLianaProps {
  lianaHeadY: number;
  totalHeight: number;
  eraStops?: EraColorStop[];
}

// ── 1. Constantes y Utilidades Matemáticas ────────────────────────────────────

const PHI = (1 + Math.sqrt(5)) / 2; // Proporción áurea (~1.61803)

interface Point {
  x: number;
  y: number;
}

interface BezierSegment {
  p0: Point;
  cp1: Point;
  cp2: Point;
  p3: Point;
  length: number;
}

/**
 * Evalúa punto en una curva Bézier cúbica.
 */
const evalBezier = (t: number, p0: number, p1: number, p2: number, p3: number): number =>
  Math.pow(1 - t, 3) * p0 +
  3 * Math.pow(1 - t, 2) * t * p1 +
  3 * (1 - t) * Math.pow(t, 2) * p2 +
  Math.pow(t, 3) * p3;

/**
 * Aproximación numérica de longitud de arco de un segmento Bézier.
 */
const getSegmentLength = (seg: Omit<BezierSegment, 'length'>, steps = 16): number => {
  let len = 0;
  let px = seg.p0.x;
  let py = seg.p0.y;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const x = evalBezier(t, seg.p0.x, seg.cp1.x, seg.cp2.x, seg.p3.x);
    const y = evalBezier(t, seg.p0.y, seg.cp1.y, seg.cp2.y, seg.p3.y);
    const dx = x - px;
    const dy = y - py;
    len += Math.sqrt(dx * dx + dy * dy);
    px = x;
    py = y;
  }
  return len;
};

/**
 * Convierte una serie de puntos muestreados a segmentos Bézier cúbicos Catmull-Rom
 * garantizando continuidad C¹ (suavidad absoluta en todas las uniones sin codos).
 */
const pointsToBeziers = (points: Point[], tension = 1.0): BezierSegment[] => {
  const segments: BezierSegment[] = [];
  const n = points.length;
  if (n < 2) return segments;

  for (let i = 0; i < n - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(n - 1, i + 2)];

    const cp1: Point = {
      x: p1.x + (p2.x - p0.x) / (6 * tension),
      y: p1.y + (p2.y - p0.y) / (6 * tension),
    };

    const cp2: Point = {
      x: p2.x - (p3.x - p1.x) / (6 * tension),
      y: p2.y - (p3.y - p1.y) / (6 * tension),
    };

    const segBase = { p0: p1, cp1, cp2, p3: p2 };
    const length = getSegmentLength(segBase);
    segments.push({ ...segBase, length });
  }

  return segments;
};

/**
 * Convierte lista de segmentos Bézier a string 'd' de SVG.
 */
const beziersToPathD = (segments: BezierSegment[]): string => {
  if (segments.length === 0) return '';
  let d = `M ${segments[0].p0.x.toFixed(2)},${segments[0].p0.y.toFixed(2)} `;
  for (const seg of segments) {
    d += `C ${seg.cp1.x.toFixed(2)},${seg.cp1.y.toFixed(2)} ${seg.cp2.x.toFixed(2)},${seg.cp2.y.toFixed(2)} ${seg.p3.x.toFixed(2)},${seg.p3.y.toFixed(2)} `;
  }
  return d;
};

// ── 2. Elementos Botánicos Vectoriales Arts & Crafts ──────────────────────────

/**
 * Hoja de sauce / acanto Arts & Crafts con peciolo y nervaduras grabadas.
 */
const ArtsAndCraftsLeaf: React.FC<{ variant?: 'large' | 'small' }> = ({ variant = 'large' }) => {
  const scale = variant === 'large' ? 1 : 0.72;
  return (
    <g transform={`scale(${scale})`}>
      {/* Peciolo (tallito que une la hoja a la liana) */}
      <path d="M 0,0 Q 8,-3 14,-1" className="stroke-salvia/70 fill-none" strokeWidth="0.9" strokeLinecap="round" />
      {/* Limbo foliar exterior */}
      <path
        d="M 14,-1 C 22,-12 42,-14 54,-2 C 40,6 26,8 14,-1 Z"
        className="fill-salvia/20 stroke-salvia/60"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      {/* Nervadura central */}
      <path d="M 14,-1 Q 32,-3 48,-2" className="stroke-salvia/40 fill-none" strokeWidth="0.5" />
      {/* Nervaduras secundarias */}
      <path d="M 24,-2 Q 28,-7 34,-8" className="stroke-salvia/30 fill-none" strokeWidth="0.4" />
      <path d="M 32,-2 Q 38,-6 44,-6" className="stroke-salvia/30 fill-none" strokeWidth="0.4" />
      <path d="M 28,-1 Q 32,3 36,4" className="stroke-salvia/30 fill-none" strokeWidth="0.4" />
    </g>
  );
};

/**
 * Zarcillo en espiral logarítmica que se enrosca con elegancia natural.
 */
const BotanicalSpiralTendril: React.FC = () => (
  <g>
    <path
      d="M 0,0 C 10,-8 18,-4 16,6 C 14,16 4,14 6,6 C 7.5,1.5 13,1 12,4 C 11.5,5.5 9.5,5 9.8,4.2"
      className="stroke-salvia/70 fill-none"
      strokeWidth="0.75"
      strokeLinecap="round"
    />
  </g>
);

/**
 * Capullo de flor silvestre con sépalos salvia y pétalos terracota en crecimiento.
 */
const BotanicalBud: React.FC = () => (
  <g>
    <path d="M 0,0 Q 6,-4 11,-2" className="stroke-salvia/70 fill-none" strokeWidth="0.9" strokeLinecap="round" />
    <path d="M 11,-2 L 15,-7 L 18,-2 Z" className="fill-salvia/40 stroke-salvia/70" strokeWidth="0.6" />
    <g transform="translate(15, -4) rotate(12)">
      <path
        d="M 0,0 C 6,-10 16,-12 16,-1 C 11,2 5,3 0,0 Z"
        className="fill-terracota/35 stroke-terracota/70"
        strokeWidth="0.6"
      />
      <path
        d="M 0,0 C 7,-7 17,2 14,-2 C 10,4 4,3 0,0 Z"
        className="fill-ocre/30 stroke-ocre/60"
        strokeWidth="0.5"
      />
    </g>
  </g>
);



// ── 3. Tipos y Modelo de Nodos Botánicos ──────────────────────────────────────

interface BotanicalNode {
  id: string;
  globalY: number;
  transform: string;
  type: 'leaf-large' | 'leaf-small' | 'tendril' | 'bud';
}

// ── 4. Componente Principal ArtsAndCraftsLiana ────────────────────────────────

export const ArtsAndCraftsLiana: React.FC<ArtsAndCraftsLianaProps> = ({
  lianaHeadY,
  totalHeight,
  eraStops,
}) => {
  const X_CENTER = 150;
  const SAMPLE_STEP = 28; // Muestreo denso para curvas de alta frecuencia

  // ── Generación de topología matemática ─────────────────────────────────────
  const {
    pathPrimaryD,
    pathSecondaryD,
    totalPrimaryLength,
    totalSecondaryLength,
    botanicalNodes,
  } = useMemo(() => {
    const numSamples = Math.max(4, Math.ceil(totalHeight / SAMPLE_STEP) + 1);

    // Ondas botánicas alargadas, fluidas y majestuosas (cruces cada ~330px)
    const samplePri = (y: number): Point => {
      const w1 = Math.sin(y * 0.0095) * 46; // Curvas alargadas
      const w2 = Math.cos(y * 0.0035 / PHI + 0.5) * 18; // Modulación áurea amplia
      const w3 = Math.sin(y * 0.02 + 1.2) * 5; // Textura botánica sutil
      return { x: X_CENTER + w1 + w2 + w3, y };
    };

    const sampleSec = (y: number): Point => {
      // Fase π para cruce alargado y elegante
      const w1 = Math.sin(y * 0.0095 + Math.PI) * 42;
      const w2 = Math.cos(y * 0.0035 * PHI + 2.1) * 16;
      const w3 = Math.sin(y * 0.02 + Math.PI) * 4;
      return { x: X_CENTER + w1 + w2 + w3, y };
    };

    const rawPointsPri: Point[] = [];
    const rawPointsSec: Point[] = [];

    for (let i = 0; i < numSamples; i++) {
      const y = Math.min(totalHeight, i * SAMPLE_STEP);
      rawPointsPri.push(samplePri(y));
      rawPointsSec.push(sampleSec(y));
    }

    // Convertir a curvas Bézier cúbicas continuas C¹
    const segmentsPri = pointsToBeziers(rawPointsPri, 1.05);
    const segmentsSec = pointsToBeziers(rawPointsSec, 1.05);

    const lenPri = segmentsPri.reduce((acc, s) => acc + s.length, 0);
    const lenSec = segmentsSec.reduce((acc, s) => acc + s.length, 0);

    const pathPriD = beziersToPathD(segmentsPri);
    const pathSecD = beziersToPathD(segmentsSec);

    // ── Distribución Orgánica de Follaje ───────────────────────────────────
    const nodes: BotanicalNode[] = [];
    const NODE_INTERVAL = 130; // Espaciado entre brotes
    const numNodes = Math.floor(totalHeight / NODE_INTERVAL);

    for (let i = 1; i <= numNodes; i++) {
      const y = i * NODE_INTERVAL + (Math.sin(i * 1.8) * 20);
      if (y >= totalHeight - 40) continue;

      const pPri = samplePri(y);
      const dyPri = (samplePri(y + 2).x - samplePri(y - 2).x) / 4;
      const anglePri = (Math.atan2(1, dyPri) * 180) / Math.PI;

      const isLeft = pPri.x < X_CENTER;
      const leafAngle = anglePri + (isLeft ? -75 : 75) + (Math.sin(i * 2.1) * 12);

      const typeChoice = i % 4;
      let nodeType: BotanicalNode['type'] = 'leaf-large';
      if (typeChoice === 1) nodeType = 'tendril';
      else if (typeChoice === 2) nodeType = 'bud';
      else if (typeChoice === 3) nodeType = 'leaf-small';

      nodes.push({
        id: `node-pri-${i}`,
        globalY: y,
        transform: `translate(${pPri.x.toFixed(2)}, ${y.toFixed(2)}) rotate(${leafAngle.toFixed(1)})`,
        type: nodeType,
      });

      // Brotes en tallo secundario
      if (i % 2 === 0) {
        const pSec = sampleSec(y + 40);
        const dySec = (sampleSec(y + 42).x - sampleSec(y + 38).x) / 4;
        const angleSec = (Math.atan2(1, dySec) * 180) / Math.PI;
        const secIsLeft = pSec.x < X_CENTER;
        const secAngle = angleSec + (secIsLeft ? -70 : 70);

        nodes.push({
          id: `node-sec-${i}`,
          globalY: y + 40,
          transform: `translate(${pSec.x.toFixed(2)}, ${(y + 40).toFixed(2)}) rotate(${secAngle.toFixed(1)})`,
          type: i % 4 === 0 ? 'leaf-small' : 'tendril',
        });
      }
    }

    return {
      pathPrimaryD: pathPriD,
      pathSecondaryD: pathSecD,
      totalPrimaryLength: lenPri,
      totalSecondaryLength: lenSec,
      botanicalNodes: nodes,
    };
  }, [totalHeight]);

  // ── Cinemática Dinámica de Crecimiento (Adelantamiento Alterno) ─────────────
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

  // Variación armónica de velocidad: un tallo adelanta al otro alternadamente a lo largo del recorrido
  const deltaLead = Math.sin(lianaHeadY * 0.0045) * 45;
  const curYPri = lianaHeadY <= 0 ? 0 : Math.max(0, Math.min(totalHeight, lianaHeadY + deltaLead));
  const curYSec = lianaHeadY <= 0 ? 0 : Math.max(0, Math.min(totalHeight, lianaHeadY - deltaLead));

  const progressPri = Math.min(1, Math.max(0, curYPri / totalHeight));
  const progressSec = Math.min(1, Math.max(0, curYSec / totalHeight));


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
          {/* Gradiente cromático por épocas: respeta las posiciones exactas de cada época */}
          <linearGradient id="liana-era-gradient-primary" x1="0%" y1="0%" x2="0%" y2="100%">
            {eraStops && eraStops.length > 0 ? (
              eraStops.map((stop, idx) => (
                <stop key={idx} offset={stop.offset} stopColor={stop.color} />
              ))
            ) : (
              <>
                <stop offset="0%" stopColor="var(--theme-ocre)" />
                <stop offset="25%" stopColor="var(--theme-salvia)" />
                <stop offset="50%" stopColor="var(--theme-pizarra)" />
                <stop offset="72%" stopColor="var(--theme-terracota)" />
                <stop offset="88%" stopColor="var(--theme-granada)" />
                <stop offset="100%" stopColor="var(--theme-carbon)" />
              </>
            )}
          </linearGradient>

          <linearGradient id="liana-era-gradient-secondary" x1="0%" y1="0%" x2="0%" y2="100%">
            {eraStops && eraStops.length > 0 ? (
              eraStops.map((stop, idx) => (
                <stop key={idx} offset={stop.offset} stopColor={stop.color} stopOpacity="0.8" />
              ))
            ) : (
              <>
                <stop offset="0%" stopColor="var(--theme-ocre)" stopOpacity="0.8" />
                <stop offset="25%" stopColor="var(--theme-salvia)" stopOpacity="0.8" />
                <stop offset="50%" stopColor="var(--theme-pizarra)" stopOpacity="0.8" />
                <stop offset="72%" stopColor="var(--theme-terracota)" stopOpacity="0.8" />
                <stop offset="88%" stopColor="var(--theme-granada)" stopOpacity="0.8" />
                <stop offset="100%" stopColor="var(--theme-carbon)" stopOpacity="0.8" />
              </>
            )}
          </linearGradient>
        </defs>

        {/* ── 1. Tallo Secundario Trenzado ───────────────────────────────── */}
        <path
          d={pathSecondaryD}
          stroke="url(#liana-era-gradient-secondary)"
          className="fill-none"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray={totalSecondaryLength}
          strokeDashoffset={totalSecondaryLength * (1 - progressSec)}
        />

        {/* ── 2. Tallo Primario Principal ────────────────────────────────── */}
        <path
          d={pathPrimaryD}
          stroke="url(#liana-era-gradient-primary)"
          className="fill-none"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeDasharray={totalPrimaryLength}
          strokeDashoffset={totalPrimaryLength * (1 - progressPri)}
        />

        {/* ── 3. Follaje Dinámico (Hojas, Brotes y Zarcillos) ─────────────── */}
        {botanicalNodes.map((node) => {
          const GROWTH_WINDOW = 95;
          let rawProgress = (lianaHeadY - node.globalY) / GROWTH_WINDOW;
          rawProgress = Math.max(0, Math.min(1, rawProgress));
          const scale = easeOutCubic(rawProgress);

          if (scale === 0) return null;

          return (
            <g
              key={node.id}
              transform={`${node.transform} scale(${scale.toFixed(3)})`}
            >
              {node.type === 'leaf-large' && <ArtsAndCraftsLeaf variant="large" />}
              {node.type === 'leaf-small' && <ArtsAndCraftsLeaf variant="small" />}
              {node.type === 'tendril' && <BotanicalSpiralTendril />}
              {node.type === 'bud' && <BotanicalBud />}
            </g>
          );
        })}

      </svg>
    </div>
  );
};