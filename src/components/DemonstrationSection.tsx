

interface DemonstrationSectionProps {
  diagram: React.ReactNode;
  children: React.ReactNode;
}

export const DemonstrationSection: React.FC<DemonstrationSectionProps> = ({ diagram, children }) => {
  return (
    <div className="w-full flex flex-col md:flex-row min-h-[85vh]">
      {/* Columna Izquierda: Diagrama (Sticky) */}
      <div className="w-full md:w-[50%] relative bg-lienzo">
        <div className="sticky top-[10vh] h-[80vh] p-8 flex items-center justify-center">
          {diagram}
        </div>
      </div>
      
      {/* Columna Derecha: Texto (Scrolly) */}
      <div className="w-full md:w-[50%] p-8 md:p-16 flex flex-col justify-center">
        <div className="prose prose-pizarra prose-lg max-w-prose mx-auto w-full">
          {children}
        </div>
      </div>
    </div>
  );
};
