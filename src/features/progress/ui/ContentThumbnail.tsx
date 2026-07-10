import React from 'react';

interface ContentThumbnailProps {
  id: string;
}

/**
 * Componente que renderiza una miniatura visual minimalista y elegante (SVG)
 * según el ID de contenido de Matematika, utilizando la paleta Arts & Crafts.
 */
export const ContentThumbnail: React.FC<ContentThumbnailProps> = ({ id }) => {
  const strokeColor = 'var(--theme-carbon)';
  const accentColor = 'var(--page-accent)';
  const gridColor = 'rgba(74, 59, 50, 0.08)';

  switch (id) {
    case 'punto':
      return (
        <svg width="72" height="72" viewBox="0 0 72 72" className="shrink-0 opacity-80">
          <circle cx="36" cy="36" r="30" fill="none" stroke={gridColor} strokeWidth="1" strokeDasharray="3,3" />
          <circle cx="36" cy="36" r="6" fill={accentColor} stroke={strokeColor} strokeWidth="1.5" />
          <text x="36" y="52" fontSize="9" fontFamily="Georgia" fontStyle="italic" textAnchor="middle" fill={strokeColor}>P</text>
        </svg>
      );

    case 'estar-entre':
      return (
        <svg width="72" height="72" viewBox="0 0 72 72" className="shrink-0 opacity-80">
          <line x1="12" y1="36" x2="60" y2="36" stroke={strokeColor} strokeWidth="1.5" />
          <circle cx="20" cy="36" r="3" fill="var(--theme-lienzo)" stroke={strokeColor} strokeWidth="1.5" />
          <circle cx="36" cy="36" r="4.5" fill={accentColor} stroke={strokeColor} strokeWidth="1.5" />
          <circle cx="52" cy="36" r="3" fill="var(--theme-lienzo)" stroke={strokeColor} strokeWidth="1.5" />
          <text x="20" y="48" fontSize="8" fontFamily="Georgia" textAnchor="middle" fill={strokeColor}>A</text>
          <text x="36" y="49" fontSize="9" fontFamily="Georgia" fontWeight="bold" textAnchor="middle" fill={accentColor}>B</text>
          <text x="52" y="48" fontSize="8" fontFamily="Georgia" textAnchor="middle" fill={strokeColor}>C</text>
        </svg>
      );

    case 'triangulo':
      return (
        <svg width="72" height="72" viewBox="0 0 72 72" className="shrink-0 opacity-80">
          <polygon points="36,16 16,52 56,52" fill={`${accentColor}15`} stroke={strokeColor} strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="36" cy="16" r="2.5" fill="var(--theme-lienzo)" stroke={strokeColor} strokeWidth="1.5" />
          <circle cx="16" cy="52" r="2.5" fill="var(--theme-lienzo)" stroke={strokeColor} strokeWidth="1.5" />
          <circle cx="56" cy="52" r="2.5" fill="var(--theme-lienzo)" stroke={strokeColor} strokeWidth="1.5" />
        </svg>
      );

    case 'axioma-congruencia-5':
      return (
        <svg width="72" height="72" viewBox="0 0 72 72" className="shrink-0 opacity-80">
          {/* Primer triángulo */}
          <polygon points="12,48 24,20 34,48" fill="none" stroke={strokeColor} strokeWidth="1.2" />
          {/* Segundo triángulo */}
          <polygon points="40,48 52,20 62,48" fill="none" stroke={accentColor} strokeWidth="1.5" />
          {/* Marcas de congruencia */}
          {/* Lado izquierdo */}
          <line x1="16.5" y1="33" x2="19.5" y2="35" stroke={strokeColor} strokeWidth="1" />
          <line x1="44.5" y1="33" x2="47.5" y2="35" stroke={accentColor} strokeWidth="1" />
          {/* Ángulo */}
          <path d="M 12,42 A 8,8 0 0 1 18,48" fill="none" stroke={strokeColor} strokeWidth="1.2" />
          <path d="M 40,42 A 8,8 0 0 1 46,48" fill="none" stroke={accentColor} strokeWidth="1.5" />
        </svg>
      );

    case 'teorema-triangulo-isosceles':
      return (
        <svg width="72" height="72" viewBox="0 0 72 72" className="shrink-0 opacity-80">
          <polygon points="36,16 16,52 56,52" fill="none" stroke={strokeColor} strokeWidth="1.5" />
          {/* Lados iguales */}
          <line x1="23" y1="33" x2="27" y2="35" stroke={accentColor} strokeWidth="1.5" />
          <line x1="49" y1="33" x2="45" y2="35" stroke={accentColor} strokeWidth="1.5" />
          {/* Ángulos base iguales */}
          <path d="M 16,46 A 8,8 0 0 1 23.5,52" fill="none" stroke={accentColor} strokeWidth="1.5" />
          <path d="M 56,46 A 8,8 0 0 0 48.5,52" fill="none" stroke={accentColor} strokeWidth="1.5" />
        </svg>
      );

    case 'axioma-paralelas-euclides':
      return (
        <svg width="72" height="72" viewBox="0 0 72 72" className="shrink-0 opacity-80">
          <line x1="10" y1="44" x2="62" y2="44" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="10" y1="24" x2="62" y2="24" stroke={accentColor} strokeWidth="1.5" />
          <circle cx="36" cy="24" r="3" fill={accentColor} stroke={strokeColor} strokeWidth="1.2" />
          <text x="36" y="16" fontSize="8" fontFamily="Georgia" fontStyle="italic" textAnchor="middle" fill={accentColor}>P</text>
        </svg>
      );

    case 'teorema-suma-angulos-triangulo':
      return (
        <svg width="72" height="72" viewBox="0 0 72 72" className="shrink-0 opacity-80">
          <polygon points="36,20 16,52 56,52" fill="none" stroke={strokeColor} strokeWidth="1.5" />
          {/* Ángulo A */}
          <path d="M 16,44 A 8,8 0 0 1 23,52" fill="none" stroke="var(--theme-terracota)" strokeWidth="1.5" />
          {/* Ángulo B */}
          <path d="M 56,44 A 8,8 0 0 0 49,52" fill="none" stroke="var(--theme-ocre)" strokeWidth="1.5" />
          {/* Ángulo C */}
          <path d="M 32,27 A 8,8 0 0 0 39,27" fill="none" stroke="var(--theme-salvia)" strokeWidth="1.5" />
        </svg>
      );

    case 'teorema-tales':
      return (
        <svg width="72" height="72" viewBox="0 0 72 72" className="shrink-0 opacity-80">
          <line x1="16" y1="56" x2="56" y2="16" stroke={strokeColor} strokeWidth="1" />
          <line x1="16" y1="16" x2="56" y2="56" stroke={strokeColor} strokeWidth="1" />
          {/* Paralelas */}
          <line x1="28" y1="24" x2="28" y2="48" stroke={accentColor} strokeWidth="1.5" />
          <line x1="44" y1="8" x2="44" y2="64" stroke="var(--theme-ocre)" strokeWidth="1.5" />
        </svg>
      );

    case 'teorema-pitagoras':
      return (
        <svg width="72" height="72" viewBox="0 0 72 72" className="shrink-0 opacity-80">
          <polygon points="26,44 48,44 26,22" fill={`${accentColor}10`} stroke={strokeColor} strokeWidth="1.5" />
          {/* Ángulo recto */}
          <rect x="26" y="40" width="4" height="4" fill="none" stroke={accentColor} strokeWidth="1" />
          {/* Cuadrado hipotenusa */}
          <polygon points="48,44 26,22 4,44 26,66" fill="none" stroke={strokeColor} strokeWidth="0.8" strokeDasharray="2,2" />
        </svg>
      );

    case 'ejercicio-pitagoras-cateto':
      return (
        <svg width="72" height="72" viewBox="0 0 72 72" className="shrink-0 opacity-80">
          <polygon points="20,48 52,48 20,24" fill="none" stroke={strokeColor} strokeWidth="1.5" />
          <rect x="20" y="44" width="4" height="4" fill="none" stroke={strokeColor} strokeWidth="1" />
          {/* Etiquetas del ejercicio */}
          <text x="36" y="56" fontSize="8" fontFamily="Georgia" textAnchor="middle" fill={strokeColor}>a = 3</text>
          <text x="14" y="38" fontSize="8" fontFamily="Georgia" textAnchor="end" fill={accentColor}>b = ?</text>
          <text x="40" y="32" fontSize="8" fontFamily="Georgia" textAnchor="start" fill={strokeColor}>c = 5</text>
        </svg>
      );

    case 'caso-gps-trilateracion':
      return (
        <svg width="72" height="72" viewBox="0 0 72 72" className="shrink-0 opacity-80">
          <circle cx="28" cy="28" r="16" fill="none" stroke={strokeColor} strokeWidth="0.8" strokeDasharray="2,2" />
          <circle cx="44" cy="28" r="20" fill="none" stroke={strokeColor} strokeWidth="0.8" strokeDasharray="2,2" />
          <circle cx="36" cy="48" r="18" fill="none" stroke={strokeColor} strokeWidth="0.8" strokeDasharray="2,2" />
          <circle cx="36" cy="28" r="16" fill="none" stroke={accentColor} strokeWidth="0.5" />
          {/* Intersección */}
          <circle cx="36" cy="36" r="3.5" fill={accentColor} stroke={strokeColor} strokeWidth="1" />
        </svg>
      );

    default:
      // Miniatura por defecto para cualquier otro ID de Matematika
      return (
        <svg width="72" height="72" viewBox="0 0 72 72" className="shrink-0 opacity-40">
          <rect x="18" y="18" width="36" height="36" rx="4" fill="none" stroke={strokeColor} strokeWidth="1.2" strokeDasharray="3,3" />
          <text x="36" y="39" fontSize="12" fontFamily="sans-serif" textAnchor="middle" fill={strokeColor}>?</text>
        </svg>
      );
  }
};
