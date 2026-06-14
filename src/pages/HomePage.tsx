import React from 'react';
import { Link } from 'wouter';
import { Logo } from '../components/Logo';

export const HomePage = () => {
  return (
    <div className="min-h-screen relative font-serif overflow-y-auto text-carbon">

      <div className="relative z-10 max-w-5xl mx-auto px-8 py-24 flex flex-col items-center">
        {/* Cabecera Principal - Estilo Portada de Libro Antiguo */}
        <div className="text-center mb-24 w-full flex flex-col items-center">

          <div className="flex items-center justify-center mb-8">
            <Logo className="w-24 h-24 md:w-36 md:h-36 mr-2 md:mr-4" />
            <h1 className="text-7xl md:text-[6.5rem] text-carbon tracking-tight leading-none pt-4" style={{ fontVariant: 'small-caps' }}>
              atematika
            </h1>
          </div>

          <p className="text-2xl md:text-3xl text-terracota italic font-medium max-w-3xl leading-relaxed">
            La Enciclopedia Definitiva.
            <br />
            <span className="text-xl text-carbon/70 mt-2 block">De los cimientos de la lógica a la excelencia matemática.</span>
          </p>

          <div className="w-full flex justify-center mt-12">
            <div className="w-full max-w-md h-[2px] bg-carbon border-t-4 border-double border-carbon" />
          </div>
        </div>        {/* Rejilla de Tomos - Diseño de Pliegos Clásicos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">

          {/* Tomo I: Geometría */}
          <div className="bg-lienzo border-2 border-carbon relative group transition-all duration-300 flex flex-col h-full shadow-sm hover:shadow-md">
            {/* Borde interior doble (estilo marco de página clásico) */}
            <div className="absolute inset-1 border border-carbon/20 pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-1 bg-terracota" />

            <div className="p-10 flex flex-col h-full relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-sm text-terracota uppercase tracking-widest mb-2 font-bold font-sans">Tomo I</h2>
                  <h3 className="text-4xl text-carbon" style={{ fontVariant: 'small-caps' }}>Geometría</h3>
                </div>
                <div className="text-6xl text-terracota/20 font-serif opacity-50 select-none">I</div>
              </div>
              <p className="text-carbon/80 italic mb-8 leading-relaxed flex-grow text-lg border-l-2 border-terracota/30 pl-4">
                Las verdades inmutables de las formas. Desde los axiomas de Euclides hasta el teorema que sostiene el espacio.
              </p>

              <div className="flex flex-col gap-0 mt-auto border-t border-carbon/20 pt-4">
                <Link href="/pitagoras">
                  <a className="flex items-center justify-between py-3 hover:text-terracota transition-colors group/link">
                    <span className="font-bold text-carbon group-hover/link:text-terracota text-lg">§ El Teorema de Pitágoras</span>
                    <span className="text-xs uppercase tracking-wider text-carbon/50 font-sans">Lección Interactiva</span>
                  </a>
                </Link>
                <Link href="/demo/pitagoras">
                  <a className="flex items-center justify-between py-3 hover:text-terracota transition-colors group/link">
                    <span className="font-bold text-carbon group-hover/link:text-terracota text-lg">§ Demostración Visual</span>
                    <span className="text-xs uppercase tracking-wider text-carbon/50 font-sans">Despliegue Visual</span>
                  </a>
                </Link>
              </div>
            </div>
          </div>

          {/* Tomo II: Lógica */}
          <div className="bg-lienzo border-2 border-carbon relative group transition-all duration-300 flex flex-col h-full shadow-sm hover:shadow-md">
            <div className="absolute inset-1 border border-carbon/20 pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-1 bg-salvia" />

            <div className="p-10 flex flex-col h-full relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-sm text-salvia uppercase tracking-widest mb-2 font-bold font-sans">Tomo II</h2>
                  <h3 className="text-4xl text-carbon" style={{ fontVariant: 'small-caps' }}>Lógica</h3>
                </div>
                <div className="text-6xl text-salvia/20 font-serif opacity-50 select-none">II</div>
              </div>
              <p className="text-carbon/80 italic mb-8 leading-relaxed flex-grow text-lg border-l-2 border-salvia/30 pl-4">
                El andamiaje de la mente humana. Estudia los mecanismos precisos de deducción matemática.
              </p>

              <div className="flex flex-col gap-0 mt-auto border-t border-carbon/20 pt-4">
                <Link href="/metodosdemostracion">
                  <a className="flex items-center justify-between py-3 hover:text-salvia transition-colors group/link">
                    <span className="font-bold text-carbon group-hover/link:text-salvia text-lg">§ Métodos de Demostración</span>
                    <span className="text-xs uppercase tracking-wider text-carbon/50 font-sans">Índice General</span>
                  </a>
                </Link>
              </div>
            </div>
          </div>

          {/* Tomo III: Análisis */}
          <div className="bg-lienzo border border-carbon/40 relative opacity-70 grayscale flex flex-col h-full shadow-none transition-all duration-500">
            <div className="absolute inset-1 border border-carbon/10 pointer-events-none" />

            <div className="p-10 flex flex-col h-full relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-sm text-carbon uppercase tracking-widest mb-2 font-bold font-sans">Tomo III</h2>
                  <h3 className="text-4xl text-carbon" style={{ fontVariant: 'small-caps' }}>Análisis</h3>
                </div>
                <div className="text-6xl text-carbon/10 font-serif select-none">III</div>
              </div>
              <p className="text-carbon/60 italic mb-8 leading-relaxed flex-grow text-lg border-l-2 border-carbon/20 pl-4">
                El estudio del cambio continuo y lo infinito. Límites, Derivadas e Integrales.
              </p>
              <div className="mt-auto border-t border-carbon/20 pt-4 text-center">
                <span className="text-sm uppercase tracking-widest text-carbon/40 font-sans font-bold">En Preparación</span>
              </div>
            </div>
          </div>

          {/* Tomo IV: Álgebra */}
          <div className="bg-lienzo border border-carbon/40 relative opacity-70 grayscale flex flex-col h-full shadow-none transition-all duration-500">
            <div className="absolute inset-1 border border-carbon/10 pointer-events-none" />

            <div className="p-10 flex flex-col h-full relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-sm text-carbon uppercase tracking-widest mb-2 font-bold font-sans">Tomo IV</h2>
                  <h3 className="text-4xl text-carbon" style={{ fontVariant: 'small-caps' }}>Álgebra</h3>
                </div>
                <div className="text-6xl text-carbon/10 font-serif select-none">IV</div>
              </div>
              <p className="text-carbon/60 italic mb-8 leading-relaxed flex-grow text-lg border-l-2 border-carbon/20 pl-4">
                Sistemas de ecuaciones, matrices y determinantes. Estructuras algebraicas.
              </p>
              <div className="mt-auto border-t border-carbon/20 pt-4 text-center">
                <span className="text-sm uppercase tracking-widest text-carbon/40 font-sans font-bold">En Preparación</span>
              </div>
            </div>
          </div>

          {/* Tomo V: Probabilidad */}
          <div className="bg-lienzo border border-carbon/40 relative opacity-70 grayscale flex flex-col h-full shadow-none transition-all duration-500 md:col-span-2 md:w-1/2 md:mx-auto">
            <div className="absolute inset-1 border border-carbon/10 pointer-events-none" />

            <div className="p-10 flex flex-col h-full relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-sm text-carbon uppercase tracking-widest mb-2 font-bold font-sans">Tomo V</h2>
                  <h3 className="text-4xl text-carbon" style={{ fontVariant: 'small-caps' }}>Probabilidad</h3>
                </div>
                <div className="text-6xl text-carbon/10 font-serif select-none">V</div>
              </div>
              <p className="text-carbon/60 italic mb-8 leading-relaxed flex-grow text-lg border-l-2 border-carbon/20 pl-4">
                Teorema de Bayes, distribuciones Normales y Binomiales, y el análisis matemático del azar.
              </p>
              <div className="mt-auto border-t border-carbon/20 pt-4 text-center">
                <span className="text-sm uppercase tracking-widest text-carbon/40 font-sans font-bold">En Preparación</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-32 text-center text-carbon/40 font-sans tracking-wide text-xs uppercase flex flex-col items-center justify-center gap-6">
          <div className="flex gap-4">
            <Link href="/diccionario">
              <a className="inline-block px-6 py-2 border border-carbon/20 hover:border-carbon hover:text-carbon transition-colors rounded-sm shadow-sm hover:shadow-md bg-lienzo">
                Diccionario Matemático
              </a>
            </Link>
            <Link href="/historia">
              <a className="inline-block px-6 py-2 border border-terracota/30 text-terracota hover:bg-terracota hover:text-lienzo transition-colors rounded-sm shadow-sm hover:shadow-md bg-terracota/5">
                Línea Temporal Histórica
              </a>
            </Link>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="w-8 h-[1px] bg-carbon/20" />
            <span>Matematika &copy; 2026</span>
            <div className="w-8 h-[1px] bg-carbon/20" />
          </div>
        </div>
      </div>
    </div>
  );
};
