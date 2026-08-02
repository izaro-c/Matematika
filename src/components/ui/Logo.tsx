/**
 * Propiedades del logotipo
 */
interface LogoProps {
  className?: string;
  /** Si es decorativo junto a texto "Matematika", ocultar de AT */
  decorative?: boolean;
}

/**
 * Logotipo: geometría estructural + inicial 'M' (UnifrakturMaguntia vía theme.css).
 */
export const Logo: React.FC<LogoProps> = ({
  className = "w-24 h-24",
  decorative = false,
}) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`${className} drop-shadow-md`}
      role={decorative ? 'presentation' : 'img'}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : 'Matematika'}
    >
      <rect x="0" y="0" width="100" height="100" fill="var(--color-lienzo)" stroke="var(--color-carbon)" strokeWidth="3" />
      <g stroke="var(--color-carbon)" strokeWidth="0.5" opacity="0.3" aria-hidden="true">
        <line x1="10" y1="10" x2="90" y2="10" />
        <line x1="10" y1="90" x2="90" y2="90" />
        <line x1="10" y1="10" x2="10" y2="90" />
        <line x1="90" y1="10" x2="90" y2="90" />
        <line x1="10" y1="10" x2="90" y2="90" />
        <line x1="90" y1="10" x2="10" y2="90" />
        <circle cx="50" cy="50" r="40" fill="none" />
      </g>
      <circle cx="50" cy="50" r="32" fill="var(--color-salvia)" opacity="0.15" aria-hidden="true" />
      <text
        x="50"
        y="78"
        fontFamily="var(--font-brand-initial), cursive"
        fontSize="76"
        fill="var(--color-terracota)"
        textAnchor="middle"
        aria-hidden="true"
      >
        M
      </text>
    </svg>
  );
};
