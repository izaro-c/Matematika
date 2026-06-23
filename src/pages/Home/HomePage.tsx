import { HeroSection } from '@/pages/Home/components/HeroSection';
import { BranchLibrary } from '@/pages/Home/components/BranchLibrary';
import { HomeFooter } from '@/pages/Home/components/HomeFooter';

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
