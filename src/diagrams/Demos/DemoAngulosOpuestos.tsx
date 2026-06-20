
import { useMathStore } from '../../store/MathStoreContext';

export const DemoAngulosOpuestos: React.FC = () => {
  const highlight = useMathStore(state => state.variables['highlight']);

  const getOpacity = (target: string, isAngle = false) => {
    if (!highlight) return isAngle ? 0.3 : 1;
    if (target === highlight) return 1;
    
    // Group highlights
    if (highlight === 'supp12' && (target === 'angle1' || target === 'angle2')) return 1;
    if (highlight === 'supp23' && (target === 'angle2' || target === 'angle3')) return 1;
    if (highlight === 'congruence13' && (target === 'angle1' || target === 'angle3')) return 1;
    
    return isAngle ? 0.1 : 0.3;
  };

  const getColor = (target: string, defaultColor: string) => {
    if (!highlight) return defaultColor;
    if (target === highlight) return 'var(--theme-terracota)';
    
    if (highlight === 'supp12' && (target === 'angle1' || target === 'angle2')) return 'var(--theme-salvia)';
    if (highlight === 'supp23' && (target === 'angle2' || target === 'angle3')) return 'var(--theme-crema)'; // Maybe use something else
    if (highlight === 'congruence13' && (target === 'angle1' || target === 'angle3')) return 'var(--theme-terracota)';

    return defaultColor;
  };

  // SVG arc helper
  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
        "M", start.x, start.y, 
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
        "L", x, y, "Z"
    ].join(" ");
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  // Center: 200, 150
  // Line l: Angle 60 deg (slope)
  // Line m: Angle -30 deg (slope)
  // Let's use angles from horizontal: Line l at 30 deg, Line m at 140 deg
  
  // Angle 1: Top (between l and m)
  // Angle 2: Right
  // Angle 3: Bottom
  // Angle 4: Left

  return (
    <svg viewBox="0 0 400 300" className="w-full h-auto max-h-[60vh] drop-shadow-md touch-none min-h-[400px]">
      
      {/* Angles */}
      <path d={describeArc(200, 150, 40, 50, 120)} fill={getColor('angle1', 'var(--theme-carbon)')} opacity={getOpacity('angle1', true)} className="transition-all duration-500" />
      <text x="200" y="125" textAnchor="middle" className="font-serif font-bold text-sm" fill="var(--theme-carbon)" opacity={getOpacity('angle1')}>1</text>

      <path d={describeArc(200, 150, 40, 120, 230)} fill={getColor('angle2', 'var(--theme-carbon)')} opacity={getOpacity('angle2', true)} className="transition-all duration-500" />
      <text x="245" y="155" textAnchor="middle" className="font-serif font-bold text-sm" fill="var(--theme-carbon)" opacity={getOpacity('angle2')}>2</text>

      <path d={describeArc(200, 150, 40, 230, 300)} fill={getColor('angle3', 'var(--theme-carbon)')} opacity={getOpacity('angle3', true)} className="transition-all duration-500" />
      <text x="200" y="185" textAnchor="middle" className="font-serif font-bold text-sm" fill="var(--theme-carbon)" opacity={getOpacity('angle3')}>3</text>

      <path d={describeArc(200, 150, 40, -60, 50)} fill={getColor('angle4', 'var(--theme-carbon)')} opacity={getOpacity('angle4', true)} className="transition-all duration-500" />
      <text x="155" y="155" textAnchor="middle" className="font-serif font-bold text-sm" fill="var(--theme-carbon)" opacity={getOpacity('angle4')}>4</text>

      {/* Lines */}
      {/* Line l (from bottom-left to top-right, angle ~ 50 deg from vertical => 40 deg from horizontal) */}
      <line x1="50" y1="270" x2="350" y2="30" stroke={getColor('lineL', 'var(--theme-carbon)')} strokeWidth="2" opacity={getOpacity('lineL')} className="transition-all duration-500" />
      <text x="355" y="25" className="italic font-serif text-sm" fill="var(--theme-carbon)" opacity={getOpacity('lineL')}>l</text>

      {/* Line m (from top-left to bottom-right, angle ~ 120 deg from vertical => -30 deg from horizontal) */}
      <line x1="80" y1="80" x2="320" y2="220" stroke={getColor('lineM', 'var(--theme-carbon)')} strokeWidth="2" opacity={getOpacity('lineM')} className="transition-all duration-500" />
      <text x="325" y="230" className="italic font-serif text-sm" fill="var(--theme-carbon)" opacity={getOpacity('lineM')}>m</text>
      
      {/* Intersection point */}
      <circle cx="200" cy="150" r="4" fill="var(--theme-carbon)" opacity="0.8" />
    </svg>
  );
};
