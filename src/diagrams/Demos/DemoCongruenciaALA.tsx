
import { useMathStore } from '../../store/MathStoreContext';

export const DemoCongruenciaALA: React.FC = () => {
  const highlight = useMathStore(state => state.variables['highlight']);

  const getOpacity = (target: string) => {
    if (!highlight) return 1;
    if (highlight === 'triangles') return 1;
    return highlight === target || target === 'base' ? 1 : 0.3;
  };

  const getColor = (target: string, defaultColor: string) => {
    if (!highlight) return defaultColor;
    if (highlight === target) return 'var(--theme-terracota)';
    return defaultColor;
  };

  // Triangle 1: A(80, 200), B(180, 200), C(130, 80)
  // Triangle 2: A'(240, 200), B'(340, 200), C'(290, 80)

  return (
    <svg viewBox="0 0 400 300" className="w-full h-auto max-h-[60vh] drop-shadow-md touch-none min-h-[400px]">
      
      {/* --- TRIANGLE 1 --- */}
      <g opacity={getOpacity('triangle1')}>
        <polygon points="80,200 180,200 130,80" fill="var(--theme-carbon)" fillOpacity="0.05" stroke={getColor('triangle1', 'var(--theme-carbon)')} strokeWidth="1" />
        
        {/* Side AB */}
        <line x1="80" y1="200" x2="180" y2="200" stroke={getColor('sideAB', 'var(--theme-carbon)')} strokeWidth={highlight === 'sideAB' ? 4 : 2} className="transition-all duration-300"/>
        
        {/* Angle A */}
        <path d="M 100 200 A 20 20 0 0 0 90 175" fill="none" stroke={getColor('angleA', 'var(--theme-carbon)')} strokeWidth={highlight === 'angleA' ? 3 : 1} className="transition-all duration-300"/>
        
        {/* Angle B */}
        <path d="M 170 175 A 20 20 0 0 0 160 200" fill="none" stroke={getColor('angleB', 'var(--theme-carbon)')} strokeWidth={highlight === 'angleB' ? 3 : 1} className="transition-all duration-300"/>

        {/* Ray AC (shown if highlighted) */}
        <line x1="80" y1="200" x2="150" y2="32" stroke="var(--theme-salvia)" strokeWidth="2" strokeDasharray="4 4" opacity={highlight === 'rayAC' ? 1 : 0} className="transition-opacity duration-300"/>
        
        {/* Points */}
        <circle cx="80" cy="200" r="4" fill="var(--theme-carbon)"/>
        <text x="65" y="215" className="font-serif text-sm">A</text>
        
        <circle cx="180" cy="200" r="4" fill="var(--theme-carbon)"/>
        <text x="185" y="215" className="font-serif text-sm">B</text>

        <circle cx="130" cy="80" r={highlight === 'pointC' ? 6 : 4} fill={getColor('pointC', 'var(--theme-carbon)')} className="transition-all duration-300"/>
        <text x="125" y="70" className="font-serif text-sm" fill={getColor('pointC', 'var(--theme-carbon)')}>C</text>
      </g>

      {/* --- TRIANGLE 2 --- */}
      <g opacity={getOpacity('triangle2')} className="transition-opacity duration-500">
        <polygon points="240,200 340,200 290,80" fill="var(--theme-carbon)" fillOpacity="0.05" stroke={getColor('triangle2', 'var(--theme-carbon)')} strokeWidth="1" />
        
        {/* Side A'B' */}
        <line x1="240" y1="200" x2="340" y2="200" stroke={getColor('sideAB', 'var(--theme-carbon)')} strokeWidth={highlight === 'sideAB' ? 4 : 2} className="transition-all duration-300"/>
        
        {/* Angle A' */}
        <path d="M 260 200 A 20 20 0 0 0 250 175" fill="none" stroke={getColor('angleA', 'var(--theme-carbon)')} strokeWidth={highlight === 'angleA' ? 3 : 1} className="transition-all duration-300"/>
        
        {/* Angle B' */}
        <path d="M 330 175 A 20 20 0 0 0 320 200" fill="none" stroke={getColor('angleB', 'var(--theme-carbon)')} strokeWidth={highlight === 'angleB' ? 3 : 1} className="transition-all duration-300"/>

        {/* Points */}
        <circle cx="240" cy="200" r="4" fill="var(--theme-carbon)"/>
        <text x="225" y="215" className="font-serif text-sm">A'</text>
        
        <circle cx="340" cy="200" r="4" fill="var(--theme-carbon)"/>
        <text x="345" y="215" className="font-serif text-sm">B'</text>

        <circle cx="290" cy="80" r={highlight === 'pointC' ? 6 : 4} fill={getColor('pointC', 'var(--theme-carbon)')} className="transition-all duration-300"/>
        <text x="285" y="70" className="font-serif text-sm" fill={getColor('pointC', 'var(--theme-carbon)')}>C'</text>
      </g>
      
      {/* Overlay to show superimposition when rayAC or pointC is highlighted (optional visual touch) */}
      <g opacity={highlight === 'superimpose' ? 0.3 : 0} transform="translate(-160, 0)" className="transition-all duration-1000">
        <polygon points="240,200 340,200 290,80" fill="var(--theme-terracota)" stroke="none" />
      </g>

    </svg>
  );
};
