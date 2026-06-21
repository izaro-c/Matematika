import { HeroSection } from '@/boundary/pages/Home/components/HeroSection';
import { BranchLibrary } from '@/boundary/pages/Home/components/BranchLibrary';
import { HomeFooter } from '@/boundary/pages/Home/components/HomeFooter';

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
