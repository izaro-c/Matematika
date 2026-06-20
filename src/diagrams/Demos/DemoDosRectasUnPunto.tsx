
import { useMathStore } from '../../store/MathStoreContext';

export const DemoDosRectasUnPunto: React.FC = () => {
  const highlight = useMathStore(state => state.variables['highlight']);

  const getOpacity = (target: string) => {
    if (!highlight) return 1;
    return highlight === target ? 1 : 0.3;
  };

  const getColor = (target: string, defaultColor: string) => {
    if (!highlight) return defaultColor;
    return highlight === target ? 'var(--theme-terracota)' : defaultColor;
  };

  const getStrokeWidth = (target: string, defaultWidth: number) => {
    if (!highlight) return defaultWidth;
    return highlight === target ? defaultWidth + 1 : defaultWidth;
  };

  return (
    <svg viewBox="0 0 400 300" className="w-full h-auto max-h-[60vh] drop-shadow-md touch-none min-h-[400px]">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Recta L (recta) */}
      <line
        x1="50" y1="200" x2="350" y2="100"
        stroke={getColor('rectaL', 'var(--theme-carbon)')}
        strokeWidth={getStrokeWidth('rectaL', 2)}
        opacity={getOpacity('rectas') * getOpacity('rectaL') * getOpacity('contradiction')}
        className="transition-all duration-500"
      />
      <text x="355" y="95" className="italic font-serif" fill="var(--theme-carbon)" opacity={getOpacity('rectas') * getOpacity('rectaL')}>l</text>

      {/* Recta M (mostrada curva absurda en caso de contradiccion) */}
      <path
        d={highlight === 'contradiction' ? "M 80 100 Q 200 250 320 80" : "M 80 80 L 320 250"}
        stroke={getColor('rectaM', 'var(--theme-carbon)')}
        strokeWidth={getStrokeWidth('rectaM', 2)}
        fill="transparent"
        strokeDasharray={highlight === 'contradiction' ? "4 4" : "none"}
        opacity={getOpacity('rectas') * getOpacity('rectaM') * getOpacity('contradiction')}
        className="transition-all duration-500"
      />
      <text x="325" y={highlight === 'contradiction' ? 75 : 260} className="italic font-serif transition-all duration-500" fill="var(--theme-carbon)" opacity={getOpacity('rectas') * getOpacity('rectaM')}>m</text>

      {/* Punto P (interseccion real) */}
      <circle
        cx="200" cy="150" r="5"
        fill={getColor('puntoP', 'var(--theme-carbon)')}
        opacity={getOpacity('puntos') * getOpacity('puntoP')}
        className="transition-all duration-500"
      />
      <text x="185" y="145" className="font-serif font-bold text-lg" fill={getColor('puntoP', 'var(--theme-carbon)')} opacity={getOpacity('puntos') * getOpacity('puntoP')}>P</text>

      {/* Punto Q (interseccion absurda hipotetica) */}
      <g opacity={highlight === 'contradiction' || highlight === 'puntoQ' ? 1 : 0} className="transition-opacity duration-500">
        <circle
          cx="285" cy="121" r="5"
          fill={getColor('puntoQ', 'var(--theme-terracota)')}
          className="transition-all duration-500"
        />
        <text x="295" y="115" className="font-serif font-bold text-lg" fill={getColor('puntoQ', 'var(--theme-terracota)')}>Q</text>
      </g>
    </svg>
  );
};
