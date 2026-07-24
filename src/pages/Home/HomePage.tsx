import { HeroSection } from '@/pages/Home/components/HeroSection';
import { BranchLibrary } from '@/pages/Home/components/BranchLibrary';
import { HomeFooter } from '@/pages/Home/components/HomeFooter';
import { UI } from '@/shared/design';

/**
 * Página Principal (Home) de Matematika.
 */
export const HomePage = () => {
  return (
    <div className={`${UI.page} bg-arts-and-crafts overflow-y-auto`}>
      <HeroSection />
      <BranchLibrary />
      <HomeFooter />
    </div>
  );
};
