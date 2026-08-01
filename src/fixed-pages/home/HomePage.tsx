import { HeroSection } from './components/HeroSection';
import { BranchLibrary } from './components/BranchLibrary';
import { HomeFooter } from './components/HomeFooter';
import { UI } from '@/design';

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
