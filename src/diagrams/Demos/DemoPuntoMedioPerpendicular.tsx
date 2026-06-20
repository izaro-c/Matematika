
import { useMathStore } from '../../store/MathStoreContext';

export const DemoPuntoMedioPerpendicular: React.FC = () => {
  const highlight = useMathStore(state => state.variables['highlight']);

  const getOpacity = (target: string) => {
    if (!highlight) {
      // By default, hide the construction lines slightly
      if (target === 'circleA' || target === 'circleB' || target === 'lineCD') return 0.15;
      return 1;
    }
    
    // Group highlights
    if (highlight === 'circles' && (target === 'circleA' || target === 'circleB')) return 0.5;
    if (highlight === 'trianglesACD_BCD' && (target === 'triangleACD' || target === 'triangleBCD')) return 1;
    if (highlight === 'trianglesACM_BCM' && (target === 'triangleACM' || target === 'triangleBCM')) return 1;

    return highlight === target ? 1 : 0.1;
  };

  const getColor = (target: string, defaultColor: string) => {
    if (!highlight) return defaultColor;
    if (highlight === target) return 'var(--theme-terracota)';
    
    if (highlight === 'circles' && (target === 'circleA' || target === 'circleB')) return 'var(--theme-salvia)';
    if (highlight === 'intersections' && (target === 'pointC' || target === 'pointD')) return 'var(--theme-terracota)';

    return defaultColor;
  };

  // Center canvas: 200, 150
  // A: 130, 150
  // B: 270, 150
  // Radius: 140 (distance AB)
  // Intersection C (top): (200, 28.7)
  // Intersection D (bottom): (200, 271.3)
  // M: (200, 150)

  return (
    <svg viewBox="0 0 400 300" className="w-full h-auto max-h-[60vh] drop-shadow-md touch-none min-h-[400px]">
      
      {/* Triangles for proof step 1: ACD and BCD */}
      <g opacity={getOpacity('triangleACD')} className="transition-opacity duration-300">
        <polygon points="130,150 200,28.7 200,271.3" fill="var(--theme-salvia)" fillOpacity="0.1" stroke="var(--theme-salvia)" strokeWidth="1" strokeDasharray="3 3"/>
      </g>
      <g opacity={getOpacity('triangleBCD')} className="transition-opacity duration-300">
        <polygon points="270,150 200,28.7 200,271.3" fill="var(--theme-terracota)" fillOpacity="0.1" stroke="var(--theme-terracota)" strokeWidth="1" strokeDasharray="3 3"/>
      </g>

      {/* Triangles for proof step 2: ACM and BCM */}
      <g opacity={getOpacity('triangleACM')} className="transition-opacity duration-300">
        <polygon points="130,150 200,28.7 200,150" fill="var(--theme-salvia)" fillOpacity="0.2" stroke="var(--theme-salvia)" strokeWidth="2" />
      </g>
      <g opacity={getOpacity('triangleBCM')} className="transition-opacity duration-300">
        <polygon points="270,150 200,28.7 200,150" fill="var(--theme-terracota)" fillOpacity="0.2" stroke="var(--theme-terracota)" strokeWidth="2" />
      </g>

      {/* Circle A */}
      <circle cx="130" cy="150" r="140" fill="none" stroke={getColor('circleA', 'var(--theme-carbon)')} strokeWidth="1" opacity={getOpacity('circleA')} className="transition-all duration-500" />
      
      {/* Circle B */}
      <circle cx="270" cy="150" r="140" fill="none" stroke={getColor('circleB', 'var(--theme-carbon)')} strokeWidth="1" opacity={getOpacity('circleB')} className="transition-all duration-500" />

      {/* Segment AB */}
      <line x1="130" y1="150" x2="270" y2="150" stroke={getColor('segmentAB', 'var(--theme-carbon)')} strokeWidth={highlight === 'segmentAB' ? 4 : 2} opacity={getOpacity('segmentAB')} className="transition-all duration-300"/>

      {/* Line CD (Perpendicular bisector) */}
      <line x1="200" y1="15" x2="200" y2="285" stroke={getColor('lineCD', 'var(--theme-carbon)')} strokeWidth={highlight === 'lineCD' ? 3 : 1} opacity={getOpacity('lineCD')} className="transition-all duration-300"/>

      {/* Right angle mark at M */}
      <g opacity={highlight === 'rightAngle' || highlight === 'trianglesACM_BCM' ? 1 : 0} className="transition-opacity duration-300">
        <polyline points="200,140 210,140 210,150" fill="none" stroke="var(--theme-carbon)" strokeWidth="1" />
      </g>

      {/* Intersections C and D */}
      <circle cx="200" cy="28.7" r="4" fill={getColor('pointC', 'var(--theme-carbon)')} opacity={getOpacity('intersections')} className="transition-all duration-300"/>
      <text x="210" y="25" className="font-serif text-sm" fill={getColor('pointC', 'var(--theme-carbon)')} opacity={getOpacity('intersections')}>C</text>
      
      <circle cx="200" cy="271.3" r="4" fill={getColor('pointD', 'var(--theme-carbon)')} opacity={getOpacity('intersections')} className="transition-all duration-300"/>
      <text x="210" y="280" className="font-serif text-sm" fill={getColor('pointD', 'var(--theme-carbon)')} opacity={getOpacity('intersections')}>D</text>

      {/* Points A and B */}
      <circle cx="130" cy="150" r="4" fill="var(--theme-carbon)"/>
      <text x="110" y="155" className="font-serif text-sm">A</text>
      <circle cx="270" cy="150" r="4" fill="var(--theme-carbon)"/>
      <text x="280" y="155" className="font-serif text-sm">B</text>

      {/* Point M */}
      <circle cx="200" cy="150" r={highlight === 'pointM' ? 6 : 4} fill={getColor('pointM', 'var(--theme-carbon)')} opacity={getOpacity('pointM')} className="transition-all duration-300"/>
      <text x="185" y="170" className="font-serif font-bold text-sm" fill={getColor('pointM', 'var(--theme-carbon)')} opacity={getOpacity('pointM')}>M</text>

    </svg>
  );
};
