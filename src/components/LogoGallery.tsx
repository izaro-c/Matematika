

export const LogoGallery: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-8">
      {/* Carga de 10 fuentes medievales/extravagantes únicas */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Astloch:wght@700&family=Grenze+Gotisch:wght@700&family=Cinzel+Decorative:wght@900&family=Germania+One&family=MedievalSharp&family=Eagle+Lake&family=Berkshire+Swash&family=Pirata+One&family=Almendra:wght@700&display=swap');
        `}
      </style>
      
      <h2 className="text-3xl text-carbon font-serif mb-8 text-center" style={{ fontVariant: 'small-caps' }}>
        Fase 9: Exploración del Códice (10 Variaciones)
      </h2>
      <p className="text-pizarra text-center mb-16 max-w-3xl mx-auto">
        Has anclado el concepto maestro: un bloque geométrico preciso coronado por una gran inicial iluminada. He generado 10 variaciones exactas de esa idea. Se mantienen los colores del proyecto, pero permutando los fondos, la geometría estructural y usando 10 tipografías extravagantes/medievales diferentes.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        
        {/* 1. El Clásico */}
        <div className="flex flex-col items-center bg-lienzo p-6 rounded-lg shadow-sm border border-carbon/10">
          <svg viewBox="0 0 100 100" className="w-24 h-24 md:w-32 md:h-32 drop-shadow-md mb-4">
            <rect x="0" y="0" width="100" height="100" fill="var(--color-lienzo)" stroke="var(--color-carbon)" strokeWidth="3" />
            <g stroke="var(--color-carbon)" strokeWidth="0.5" opacity="0.3">
              <line x1="10" y1="10" x2="90" y2="10" /><line x1="10" y1="90" x2="90" y2="90" /><line x1="10" y1="10" x2="10" y2="90" /><line x1="90" y1="10" x2="90" y2="90" />
              <line x1="10" y1="10" x2="90" y2="90" /><line x1="90" y1="10" x2="10" y2="90" />
              <circle cx="50" cy="50" r="40" fill="none" />
            </g>
            <circle cx="50" cy="50" r="32" fill="var(--color-salvia)" opacity="0.15" />
            <text x="50" y="78" fontFamily="'UnifrakturMaguntia', cursive" fontSize="76" fill="var(--color-terracota)" textAnchor="middle">M</text>
          </svg>
          <h3 className="font-bold text-carbon text-sm text-center">1. El Clásico</h3>
          <p className="text-xs text-pizarra text-center mt-1">Fuente: Unifraktur</p>
        </div>

        {/* 2. Astrolabio Nocturno */}
        <div className="flex flex-col items-center bg-lienzo p-6 rounded-lg shadow-sm border border-carbon/10">
          <svg viewBox="0 0 100 100" className="w-24 h-24 md:w-32 md:h-32 drop-shadow-md mb-4">
            <rect x="0" y="0" width="100" height="100" fill="var(--color-carbon)" stroke="var(--color-carbon)" strokeWidth="3" rx="2" />
            <g stroke="var(--color-ocre)" strokeWidth="0.5" opacity="0.5">
              {[0, 30, 60, 90, 120, 150].map(deg => (
                <line key={deg} x1="50" y1="5" x2="50" y2="95" transform={`rotate(${deg} 50 50)`} />
              ))}
              <circle cx="50" cy="50" r="45" fill="none" />
              <circle cx="50" cy="50" r="30" fill="none" />
            </g>
            <text x="50" y="76" fontFamily="'Astloch', cursive" fontSize="84" fill="var(--color-lienzo)" textAnchor="middle">M</text>
          </svg>
          <h3 className="font-bold text-carbon text-sm text-center">2. Nocturno</h3>
          <p className="text-xs text-pizarra text-center mt-1">Fuente: Astloch</p>
        </div>

        {/* 3. Lacre Real */}
        <div className="flex flex-col items-center bg-lienzo p-6 rounded-lg shadow-sm border border-carbon/10">
          <svg viewBox="0 0 100 100" className="w-24 h-24 md:w-32 md:h-32 drop-shadow-md mb-4">
            <rect x="0" y="0" width="100" height="100" fill="var(--color-terracota)" stroke="var(--color-carbon)" strokeWidth="3" />
            <g stroke="var(--color-carbon)" strokeWidth="0.5" opacity="0.4" fill="none">
              <circle cx="50" cy="50" r="45" /><circle cx="50" cy="50" r="35" /><circle cx="50" cy="50" r="25" />
            </g>
            <circle cx="50" cy="50" r="35" fill="var(--color-ocre)" opacity="0.9" />
            <text x="50" y="78" fontFamily="'Grenze Gotisch', cursive" fontSize="76" fill="var(--color-carbon)" textAnchor="middle">M</text>
          </svg>
          <h3 className="font-bold text-carbon text-sm text-center">3. Lacre Real</h3>
          <p className="text-xs text-pizarra text-center mt-1">Fuente: Grenze Gotisch</p>
        </div>

        {/* 4. El Papiro Verde */}
        <div className="flex flex-col items-center bg-lienzo p-6 rounded-lg shadow-sm border border-carbon/10">
          <svg viewBox="0 0 100 100" className="w-24 h-24 md:w-32 md:h-32 drop-shadow-md mb-4">
            <rect x="0" y="0" width="100" height="100" fill="var(--color-salvia)" stroke="var(--color-carbon)" strokeWidth="3" />
            <g stroke="var(--color-lienzo)" strokeWidth="0.5" opacity="0.6">
              <line x1="25" y1="0" x2="25" y2="100" /><line x1="50" y1="0" x2="50" y2="100" /><line x1="75" y1="0" x2="75" y2="100" />
              <line x1="0" y1="25" x2="100" y2="25" /><line x1="0" y1="50" x2="100" y2="50" /><line x1="0" y1="75" x2="100" y2="75" />
            </g>
            <rect x="25" y="25" width="50" height="50" fill="var(--color-lienzo)" opacity="0.9" />
            <text x="50" y="74" fontFamily="'Cinzel Decorative', serif" fontSize="72" fontWeight="900" fill="var(--color-terracota)" textAnchor="middle">M</text>
          </svg>
          <h3 className="font-bold text-carbon text-sm text-center">4. El Papiro</h3>
          <p className="text-xs text-pizarra text-center mt-1">Fuente: Cinzel Decor</p>
        </div>

        {/* 5. Códice de Oro */}
        <div className="flex flex-col items-center bg-lienzo p-6 rounded-lg shadow-sm border border-carbon/10">
          <svg viewBox="0 0 100 100" className="w-24 h-24 md:w-32 md:h-32 drop-shadow-md mb-4">
            <rect x="0" y="0" width="100" height="100" fill="var(--color-ocre)" stroke="var(--color-carbon)" strokeWidth="3" />
            <g stroke="var(--color-carbon)" strokeWidth="1" opacity="0.4">
              <line x1="61.8" y1="0" x2="61.8" y2="100" />
              <line x1="61.8" y1="61.8" x2="100" y2="61.8" />
              <line x1="61.8" y1="61.8" x2="100" y2="100" strokeDasharray="2 2" />
            </g>
            <text x="31" y="76" fontFamily="'Germania One', cursive" fontSize="70" fill="var(--color-carbon)" textAnchor="middle">M</text>
          </svg>
          <h3 className="font-bold text-carbon text-sm text-center">5. Códice de Oro</h3>
          <p className="text-xs text-pizarra text-center mt-1">Fuente: Germania</p>
        </div>

        {/* 6. Pizarra Isométrica */}
        <div className="flex flex-col items-center bg-lienzo p-6 rounded-lg shadow-sm border border-carbon/10">
          <svg viewBox="0 0 100 100" className="w-24 h-24 md:w-32 md:h-32 drop-shadow-md mb-4">
            <rect x="0" y="0" width="100" height="100" fill="var(--color-carbon)" />
            <g stroke="var(--color-salvia)" strokeWidth="0.5" opacity="0.5">
              <polygon points="50,5 89,27.5 89,72.5 50,95 11,72.5 11,27.5" fill="none" />
              <line x1="11" y1="27.5" x2="89" y2="72.5" />
              <line x1="11" y1="72.5" x2="89" y2="27.5" />
              <line x1="50" y1="5" x2="50" y2="95" />
            </g>
            <circle cx="50" cy="50" r="25" fill="var(--color-terracota)" opacity="0.9" />
            <text x="50" y="74" fontFamily="'MedievalSharp', cursive" fontSize="70" fill="var(--color-lienzo)" textAnchor="middle">M</text>
          </svg>
          <h3 className="font-bold text-carbon text-sm text-center">6. Pizarra Íso</h3>
          <p className="text-xs text-pizarra text-center mt-1">Fuente: MedievalSharp</p>
        </div>

        {/* 7. Cáliz de la Vesica */}
        <div className="flex flex-col items-center bg-lienzo p-6 rounded-lg shadow-sm border border-carbon/10">
          <svg viewBox="0 0 100 100" className="w-24 h-24 md:w-32 md:h-32 drop-shadow-md mb-4">
            <rect x="0" y="0" width="100" height="100" fill="var(--color-lienzo)" stroke="var(--color-carbon)" strokeWidth="3" />
            <g stroke="var(--color-terracota)" strokeWidth="1" opacity="0.4" fill="none">
              <circle cx="35" cy="50" r="30" />
              <circle cx="65" cy="50" r="30" />
              <circle cx="50" cy="50" r="45" />
            </g>
            <text x="50" y="72" fontFamily="'Eagle Lake', cursive" fontSize="70" fill="var(--color-carbon)" textAnchor="middle">M</text>
          </svg>
          <h3 className="font-bold text-carbon text-sm text-center">7. El Cáliz</h3>
          <p className="text-xs text-pizarra text-center mt-1">Fuente: Eagle Lake</p>
        </div>

        {/* 8. Manuscrito Swash */}
        <div className="flex flex-col items-center bg-lienzo p-6 rounded-lg shadow-sm border border-carbon/10">
          <svg viewBox="0 0 100 100" className="w-24 h-24 md:w-32 md:h-32 drop-shadow-md mb-4">
            <rect x="0" y="0" width="100" height="100" fill="var(--color-lienzo)" stroke="var(--color-carbon)" strokeWidth="3" />
            <g stroke="var(--color-salvia)" strokeWidth="1" opacity="0.3">
              {[10, 20, 30, 40, 50, 60, 70, 80, 90].map(y => (
                <line key={y} x1="0" y1={y} x2="100" y2={y} />
              ))}
            </g>
            <circle cx="50" cy="50" r="35" fill="var(--color-ocre)" opacity="0.25" />
            <text x="50" y="76" fontFamily="'Berkshire Swash', cursive" fontSize="75" fill="var(--color-terracota)" textAnchor="middle">M</text>
          </svg>
          <h3 className="font-bold text-carbon text-sm text-center">8. Manuscrito</h3>
          <p className="text-xs text-pizarra text-center mt-1">Fuente: Berkshire Swash</p>
        </div>

        {/* 9. Tinta y Rombo */}
        <div className="flex flex-col items-center bg-lienzo p-6 rounded-lg shadow-sm border border-carbon/10">
          <svg viewBox="0 0 100 100" className="w-24 h-24 md:w-32 md:h-32 drop-shadow-md mb-4">
            <rect x="0" y="0" width="100" height="100" fill="var(--color-carbon)" stroke="var(--color-carbon)" strokeWidth="3" rx="2" />
            <g stroke="var(--color-terracota)" strokeWidth="0.5" opacity="0.6">
              <line x1="0" y1="50" x2="50" y2="0" /><line x1="50" y1="0" x2="100" y2="50" />
              <line x1="100" y1="50" x2="50" y2="100" /><line x1="50" y1="100" x2="0" y2="50" />
              <line x1="25" y1="25" x2="75" y2="75" /><line x1="25" y1="75" x2="75" y2="25" />
            </g>
            <circle cx="50" cy="50" r="28" fill="var(--color-carbon)" />
            <text x="50" y="74" fontFamily="'Pirata One', cursive" fontSize="76" fill="var(--color-ocre)" textAnchor="middle">M</text>
          </svg>
          <h3 className="font-bold text-carbon text-sm text-center">9. Tinta Pirata</h3>
          <p className="text-xs text-pizarra text-center mt-1">Fuente: Pirata One</p>
        </div>

        {/* 10. La Rosa de los Vientos */}
        <div className="flex flex-col items-center bg-lienzo p-6 rounded-lg shadow-sm border border-carbon/10">
          <svg viewBox="0 0 100 100" className="w-24 h-24 md:w-32 md:h-32 drop-shadow-md mb-4">
            <rect x="0" y="0" width="100" height="100" fill="var(--color-lienzo)" stroke="var(--color-carbon)" strokeWidth="3" />
            <g stroke="var(--color-ocre)" strokeWidth="0.5">
              <polygon points="50,5 60,40 95,50 60,60 50,95 40,60 5,50 40,40" fill="none" />
              <polygon points="50,20 57,43 80,50 57,57 50,80 43,57 20,50 43,43" fill="var(--color-ocre)" opacity="0.1" />
            </g>
            <circle cx="50" cy="50" r="22" fill="none" stroke="var(--color-salvia)" strokeWidth="2" />
            <text x="50" y="72" fontFamily="'Almendra', serif" fontSize="70" fill="var(--color-carbon)" textAnchor="middle">M</text>
          </svg>
          <h3 className="font-bold text-carbon text-sm text-center">10. La Rosa</h3>
          <p className="text-xs text-pizarra text-center mt-1">Fuente: Almendra</p>
        </div>

      </div>
    </div>
  );
};
