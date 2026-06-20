
import { useMathStore } from '../../store/MathStoreContext';

export const DemoPuntoMedio: React.FC = () => {
  const highlight = useMathStore(state => state.variables['highlight']);

  const getOpacity = (target: string) => {
    if (!highlight) return 1;
    if (highlight === 'segmentAB') return 1;
    return highlight === target ? 1 : 0.3;
  };

  const getColor = (target: string, defaultColor: string) => {
    if (!highlight) return defaultColor;
    if (highlight === target) return 'var(--theme-terracota)';
    if (highlight === 'congruence' && (target === 'segmentAM' || target === 'segmentMB')) return 'var(--theme-terracota)';
    return defaultColor;
  };

  const getStrokeWidth = (target: string, defaultWidth: number) => {
    if (!highlight) return defaultWidth;
    if (highlight === target) return defaultWidth + 2;
    if (highlight === 'congruence' && (target === 'segmentAM' || target === 'segmentMB')) return defaultWidth + 2;
    return defaultWidth;
  };

  // A(50, 150), B(350, 150), M(200, 150)

  return (
    <svg viewBox="0 0 400 300" className="w-full h-auto max-h-[60vh] drop-shadow-md touch-none min-h-[400px]">
      
      {/* Whole segment AB underlying (for segmentAB highlight) */}
      <line x1="50" y1="150" x2="350" y2="150" stroke={getColor('segmentAB', 'transparent')} strokeWidth={getStrokeWidth('segmentAB', 4)} opacity={getOpacity('segmentAB')} className="transition-all duration-300"/>

      {/* Segment AM */}
      <line x1="50" y1="150" x2="200" y2="150" stroke={getColor('segmentAM', 'var(--theme-carbon)')} strokeWidth={getStrokeWidth('segmentAM', 2)} opacity={getOpacity('segmentAM')} className="transition-all duration-300"/>
      
      {/* Segment MB */}
      <line x1="200" y1="150" x2="350" y2="150" stroke={getColor('segmentMB', 'var(--theme-carbon)')} strokeWidth={getStrokeWidth('segmentMB', 2)} opacity={getOpacity('segmentMB')} className="transition-all duration-300"/>

      {/* Congruence marks */}
      <g opacity={highlight === 'congruence' ? 1 : 0} className="transition-opacity duration-300">
        {/* Mark on AM */}
        <line x1="125" y1="145" x2="125" y2="155" stroke="var(--theme-terracota)" strokeWidth="2" />
        {/* Mark on MB */}
        <line x1="275" y1="145" x2="275" y2="155" stroke="var(--theme-terracota)" strokeWidth="2" />
      </g>

      {/* Point A */}
      <circle cx="50" cy="150" r="4" fill="var(--theme-carbon)"/>
      <text x="40" y="140" className="font-serif text-sm">A</text>
      
      {/* Point B */}
      <circle cx="350" cy="150" r="4" fill="var(--theme-carbon)"/>
      <text x="345" y="140" className="font-serif text-sm">B</text>

      {/* Point M */}
      <circle cx="200" cy="150" r={highlight === 'pointM' ? 6 : 4} fill={getColor('pointM', 'var(--theme-carbon)')} opacity={getOpacity('pointM')} className="transition-all duration-300"/>
      <text x="193" y="140" className="font-serif font-bold text-sm" fill={getColor('pointM', 'var(--theme-carbon)')} opacity={getOpacity('pointM')}>M</text>

    </svg>
  );
};
