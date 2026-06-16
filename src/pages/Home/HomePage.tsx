import { HeroSection } from './components/HeroSection';
import { BranchLibrary } from './components/BranchLibrary';
import { HomeFooter } from './components/HomeFooter';

/**
 * Página Principal (Home) de Matematika.
 * Ensambla la sección Hero y la Biblioteca de Ramas.
 */
export const HomePage = () => {
  return (
    <div className="min-h-screen bg-arts-and-crafts text-carbon font-serif overflow-y-auto">
      <HeroSection />
      <BranchLibrary />
      <HomeFooter />
    </div>
  );
};
