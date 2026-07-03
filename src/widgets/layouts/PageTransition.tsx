
import { useLocation } from 'wouter';

/**
 * Envoltorio para animar transiciones de página usando el hook `useLocation`.
 * Cada vez que la ruta cambia, el `key` se actualiza y la animación `fade-in`
 * se dispara de nuevo.
 */
export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location] = useLocation();

  return (
    <div key={location} className="page-transition w-full h-full">
      {children}
    </div>
  );
};
