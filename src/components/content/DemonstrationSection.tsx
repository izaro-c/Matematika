

/**
 * Propiedades para el componente DemonstrationSection.
 * @property {React.ReactNode} diagram - El componente visual (JSXGraph/ThreeJS) que se mostrará fijado en la columna izquierda.
 * @property {React.ReactNode} children - El texto o contenido markdown (pasos de la demostración) que escrolea en la derecha.
 */
interface DemonstrationSectionProps {
  diagram: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Componente layout para demostraciones interactivas.
 * 
 * Implementa un diseño de pantalla dividida ("Split Screen").
 * La columna izquierda mantiene un diagrama interactivo fijado (sticky),
 * mientras que la columna derecha permite hacer scroll por el texto de la demostración.
 * 
 * @param {DemonstrationSectionProps} props - Propiedades del componente.
 * @returns {JSX.Element} Layout renderizado.
 */

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
