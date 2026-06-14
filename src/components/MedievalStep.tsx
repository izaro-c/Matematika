import React from 'react';

interface MedievalStepProps {
  number: number;
  title: string;
}

export const MedievalStep: React.FC<MedievalStepProps> = ({ number, title }) => {
  return (
    <div className="flex items-center gap-6 mt-16 mb-8">
      {/* Caja más grande para que se aprecie la ilustración (w-28 h-28) */}
      <div 
        className="relative w-28 h-28 min-w-[7rem] flex items-center justify-center border border-carbon overflow-hidden rounded-sm bg-[#FDFBF7]"
      >
        {/* Capa de imagen de fondo nativa Terracota/Lienzo con zoom (180%) para que los detalles finos sean legibles */}
        <div 
          className="absolute inset-0 opacity-80 mix-blend-multiply"
          style={{
            backgroundImage: 'url(/arts-and-crafts-bg-2.png)',
            backgroundSize: '200%',
            backgroundPosition: 'center',
          }}
        />
        
        {/* Adorno interior muy sutil */}
        <div className="absolute inset-1 border border-carbon/20 pointer-events-none" />
        
        {/* Número grande */}
        <span 
          className="font-serif italic font-bold text-6xl text-terracota z-10" 
          style={{ 
            fontFamily: 'Georgia, "Playfair Display", serif',
            textShadow: '1.5px 1.5px 0px #FDFBF7, -1.5px -1.5px 0px #FDFBF7, 1.5px -1.5px 0px #FDFBF7, -1.5px 1.5px 0px #FDFBF7'
          }}
        >
          {number}
        </span>
      </div>
      <h3 className="text-4xl font-serif text-carbon m-0 border-b-2 border-carbon/20 pb-2 flex-1 italic">
        {title}
      </h3>
    </div>
  );
};
