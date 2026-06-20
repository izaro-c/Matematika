
import { useMathStore } from '../../store/MathStoreContext';

export const DemoCongruenciaLLL: React.FC = () => {
  const highlight = useMathStore(state => state.variables['highlight']);

  const getOpacity = (target: string) => {
    if (!highlight) return 1;
    if (highlight === 'triangles' || highlight === 'superimpose' || highlight === 'lineCC') return 1;
    return highlight === target ? 1 : 0.3;
  };

  const getColor = (target: string, defaultColor: string) => {
    if (!highlight) return defaultColor;
    if (highlight === target) return 'var(--theme-terracota)';
    return defaultColor;
  };

  // Base Triangle: A(100, 150), B(300, 150)
  // C (top): (180, 50)
  // C' (bottom, superimposed mirror): (180, 250)
  
  return (
    <svg viewBox="0 0 400 300" className="w-full h-auto max-h-[60vh] drop-shadow-md touch-none min-h-[400px]">
      
      {/* Base AB */}
      <line x1="100" y1="150" x2="300" y2="150" stroke={getColor('sideAB', 'var(--theme-carbon)')} strokeWidth={highlight === 'sideAB' ? 4 : 2} className="transition-all duration-300"/>
      <circle cx="100" cy="150" r="4" fill="var(--theme-carbon)"/>
      <text x="80" y="155" className="font-serif text-sm">A</text>
      <circle cx="300" cy="150" r="4" fill="var(--theme-carbon)"/>
      <text x="310" y="155" className="font-serif text-sm">B</text>

      {/* Top Triangle ABC */}
      <g opacity={getOpacity('triangleABC')} className="transition-opacity duration-500">
        <line x1="100" y1="150" x2="180" y2="50" stroke={getColor('sideAC', 'var(--theme-carbon)')} strokeWidth={highlight === 'sideAC' ? 4 : 2} className="transition-all duration-300"/>
        <line x1="300" y1="150" x2="180" y2="50" stroke={getColor('sideBC', 'var(--theme-carbon)')} strokeWidth={highlight === 'sideBC' ? 4 : 2} className="transition-all duration-300"/>
        <circle cx="180" cy="50" r="4" fill="var(--theme-carbon)"/>
        <text x="175" y="40" className="font-serif text-sm">C</text>
        
        {/* Angle A and B highlights */}
        <path d="M 120 150 A 20 20 0 0 0 115 130" fill="none" stroke={getColor('angleA', 'transparent')} strokeWidth="2" className="transition-all duration-300"/>
        <path d="M 280 150 A 20 20 0 0 1 285 130" fill="none" stroke={getColor('angleB', 'transparent')} strokeWidth="2" className="transition-all duration-300"/>
      </g>

      {/* Bottom Triangle ABC' (superimposed/mirrored) */}
      <g opacity={getOpacity('triangleABCprime')} className="transition-opacity duration-500">
        <line x1="100" y1="150" x2="180" y2="250" stroke={getColor('sideAC', 'var(--theme-carbon)')} strokeDasharray="5,5" strokeWidth={highlight === 'sideAC' ? 4 : 2} className="transition-all duration-300"/>
        <line x1="300" y1="150" x2="180" y2="250" stroke={getColor('sideBC', 'var(--theme-carbon)')} strokeDasharray="5,5" strokeWidth={highlight === 'sideBC' ? 4 : 2} className="transition-all duration-300"/>
        <circle cx="180" cy="250" r="4" fill="var(--theme-carbon)"/>
        <text x="175" y="270" className="font-serif text-sm">C'</text>
        
        {/* Angle A and B highlights */}
        <path d="M 120 150 A 20 20 0 0 1 115 170" fill="none" stroke={getColor('angleA', 'transparent')} strokeWidth="2" className="transition-all duration-300"/>
        <path d="M 280 150 A 20 20 0 0 0 285 170" fill="none" stroke={getColor('angleB', 'transparent')} strokeWidth="2" className="transition-all duration-300"/>
      </g>

      {/* Line C-C' for the proof of LLL */}
      <line x1="180" y1="50" x2="180" y2="250" stroke="var(--theme-salvia)" strokeWidth="2" strokeDasharray="2,2" opacity={highlight === 'lineCC' ? 1 : 0} className="transition-opacity duration-300"/>

    </svg>
  );
};
