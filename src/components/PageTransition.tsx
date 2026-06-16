
import { useLocation } from 'wouter';

export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location] = useLocation();

  return (
    <div key={location} className="animate-fade-in w-full h-full">
      {children}
    </div>
  );
};
