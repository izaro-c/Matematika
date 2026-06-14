import React from 'react';

interface DemonstrationSectionProps {
  diagram: React.ReactNode;
  children: React.ReactNode;
}

export const DemonstrationSection: React.FC<DemonstrationSectionProps> = ({ diagram, children }) => {
  return (
    <div className="flex w-full relative min-h-[100vh]">
      {/* Columna Izquierda: Diagrama (Sticky) */}
      <div className="w-[50%] relative border-r border-carbon/10 bg-lienzo">
        <div className="sticky top-0 h-screen p-8 flex items-center justify-center">
          {diagram}
        </div>
      </div>
      
      {/* Columna Derecha: Texto (Scrolly) */}
      <div className="w-[50%] p-16 md:p-24 bg-lienzo flex flex-col justify-center">
        <div className="teoria-mdx max-w-prose mx-auto w-full">
          {children}
        </div>
      </div>
    </div>
  );
};
