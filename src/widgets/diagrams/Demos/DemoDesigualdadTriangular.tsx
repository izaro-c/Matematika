import { useMathStore } from '@/shared/lib/MathStoreContext';

export const DemoDesigualdadTriangular: React.FC = () => {
  const highlight = useMathStore(state => state.variables['highlight']);
  const step = useMathStore(state => state.variables['step']);

  const isActive = (id: string) => {
    const isH = Array.isArray(highlight) ? (highlight as unknown as string[]).includes(id) : highlight === id;
    const isS = Array.isArray(step) ? (step as unknown as string[]).includes(id) : step === id;
    return isH || isS;
  };

  const s2 = isActive('step2');
  const s3 = isActive('step3');
  const s4 = isActive('step4');
  const s5 = isActive('step5');

  const getOpacity = (target: string) => {
    const anyH = highlight !== undefined && highlight !== null;
    if (anyH) {
      if (isActive(target)) return 1;
      return 0.2;
    }
    return 1;
  };

  const getColor = (target: string, defaultColor: string) => {
    if (isActive(target)) return 'var(--theme-terracota)';
    return defaultColor;
  };

  const getStrokeWidth = (target: string, defaultWidth: number) => {
    if (isActive(target)) return defaultWidth + 2;
    return defaultWidth;
  };

  // Coordenadas
  const A = { x: 80, y: 250 };
  const B = { x: 220, y: 250 };
  const C = { x: 180, y: 150 };
  // CD debe ser igual a BC
  // BC = sqrt((220-180)^2 + (250-150)^2) = sqrt(1600 + 10000) = sqrt(11600) ~ 107.7
  // Vector AC = (100, -100). Unidad = (0.707, -0.707)
  // D = C + 107.7 * (0.707, -0.707) = (180 + 76.15, 150 - 76.15) = (256.15, 73.85)
  const D = { x: 256.15, y: 73.85 };

  // Visibilidades
  const showExt = s2 || s3 || s4 || s5 || isActive('punto-d') || isActive('lado-cd');
  const showBD = s3 || s4 || s5 || isActive('lado-bd') || isActive('triangulo-isosceles');

  // Angulos
  // CBD (en B, de CB a DB)
  // Vector BC = (40, 100)
  // Vector BD = (36.15, -176.15)
  // CDB (en D, de CD a BD)
  // ABD (en B, de AB a DB)

  const opIso = isActive('triangulo-isosceles') ? 0.3 : (s3 ? 0.1 : 0);
  const opABD = isActive('angulo-abd') ? 0.5 : (s4 || s5 ? 0.2 : 0);
  const opCBD = isActive('angulo-cbd') ? 0.8 : (s3 || s4 ? 0.4 : 0);
  const opCDB = isActive('angulo-cdb') ? 0.8 : (s3 || s4 || s5 ? 0.4 : 0);

  return (
    <svg viewBox="0 0 350 300" className="w-full h-auto max-h-[60vh] drop-shadow-md touch-none min-h-[400px]">

      {/* Triángulo isósceles relleno */}
      <polygon points={`${C.x},${C.y} ${B.x},${B.y} ${D.x},${D.y}`} fill="var(--theme-salvia)" opacity={opIso} className="transition-opacity duration-500" />

      {/* Ángulo ABD (completo) */}
      {/* Vector BA = (-140, 0) -> Angle 180 */}
      {/* Vector BD = (36.15, -176.15) -> Angle aprox -78 o 282 */}
      {/* SVG y axis is down, so BA is (-140, 0) -> 180 deg */}
      {/* BD is (36.15, -176.15) -> up and right. angle = atan2(-176, 36) = -78 deg */}
      {/* Arc from BD to BA */}
      <path d={`M 240.2 153.2 A 40 40 0 0 0 180 250`} fill="var(--theme-carbon)" fillOpacity={opABD} stroke="var(--theme-carbon)" strokeOpacity={opABD > 0 ? 1 : 0} strokeWidth="2" className="transition-all duration-500" />

      {/* Ángulo CBD */}
      {/* Vector BC = (-40, -100). Angle = atan2(-100, -40) = -111 deg */}
      {/* Arc from BD to BC */}
      <path d={`M 235.1 176.4 A 30 30 0 0 0 168.8 221.8`} fill="var(--theme-terracota)" fillOpacity={opCBD} stroke="var(--theme-terracota)" strokeOpacity={opCBD > 0 ? 1 : 0} strokeWidth="2" className="transition-all duration-500" />

      {/* Ángulo CDB */}
      {/* Vector DC = (-76.15, 76.15). Angle = atan2(76, -76) = 135 deg */}
      {/* Vector DB = (-36.15, 176.15). Angle = atan2(176, -36) = 101 deg */}
      {/* Arc from DC to DB */}
      <path d={`M 235 95 A 30 30 0 0 0 249.9 104.2`} fill="var(--theme-salvia)" fillOpacity={opCDB} stroke="var(--theme-salvia)" strokeOpacity={opCDB > 0 ? 1 : 0} strokeWidth="2" className="transition-all duration-500" />

      {/* Base Triangle ABC */}
      <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={getColor('lado-ab', 'var(--theme-carbon)')} strokeWidth={getStrokeWidth('lado-ab', 3)} className="transition-all duration-300" opacity={getOpacity('lado-ab')}/>
      <line x1={B.x} y1={B.y} x2={C.x} y2={C.y} stroke={getColor('lado-bc', 'var(--theme-carbon)')} strokeWidth={getStrokeWidth('lado-bc', 3)} className="transition-all duration-300" opacity={getOpacity('lado-bc')}/>
      <line x1={A.x} y1={A.y} x2={C.x} y2={C.y} stroke={getColor('lado-ac', 'var(--theme-carbon)')} strokeWidth={getStrokeWidth('lado-ac', 3)} className="transition-all duration-300" opacity={getOpacity('lado-ac')}/>

      {/* Labels para ABC */}
      <text x={150} y={270} className="font-serif italic text-sm" opacity={getOpacity('lado-ab')}>c</text>
      <text x={210} y={195} className="font-serif italic text-sm" opacity={getOpacity('lado-bc')}>a</text>
      <text x={120} y={195} className="font-serif italic text-sm" opacity={getOpacity('lado-ac')}>b</text>

      <circle cx={A.x} cy={A.y} r="4" fill="var(--theme-carbon)"/>
      <text x={A.x - 20} y={A.y + 5} className="font-serif text-sm">A</text>

      <circle cx={B.x} cy={B.y} r="4" fill="var(--theme-carbon)"/>
      <text x={B.x + 10} y={B.y + 5} className="font-serif text-sm">B</text>

      <circle cx={C.x} cy={C.y} r="4" fill="var(--theme-carbon)"/>
      <text x={C.x - 20} y={C.y} className="font-serif text-sm">C</text>

      {/* Extensión CD */}
      <g opacity={showExt ? 1 : 0} className="transition-opacity duration-500">
        <line x1={C.x} y1={C.y} x2={D.x} y2={D.y} stroke={getColor('lado-cd', 'var(--theme-pizarra)')} strokeWidth={getStrokeWidth('lado-cd', 3)} strokeDasharray="5,5" className="transition-all duration-300" opacity={getOpacity('lado-cd')}/>
        <text x={225} y={110} className="font-serif italic text-sm" opacity={getOpacity('lado-cd')}>a</text>
        <circle cx={D.x} cy={D.y} r="4" fill="var(--theme-carbon)"/>
        <text x={D.x + 10} y={D.y - 5} className="font-serif text-sm">D</text>
      </g>

      {/* Línea BD */}
      <g opacity={showBD ? 1 : 0} className="transition-opacity duration-500">
        <line x1={B.x} y1={B.y} x2={D.x} y2={D.y} stroke={getColor('lado-bd', 'var(--theme-salvia)')} strokeWidth={getStrokeWidth('lado-bd', 2)} strokeDasharray="3,3" className="transition-all duration-300" opacity={getOpacity('lado-bd')}/>
      </g>

    </svg>
  );
};
