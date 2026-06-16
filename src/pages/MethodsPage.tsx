import { useLocation } from 'wouter';
import { db } from '../store/content';

/**
 * Página índice para los "Métodos de Demostración".
 * Filtra las lecciones especiales (cuyos IDs empiezan por "metodo-") y las muestra
 * en un diseño de cuadrícula (grid) para fácil acceso a las herramientas lógicas.
 */
export const MethodsPage = () => {
  const [, setLocation] = useLocation();
  const allLessons = db.getAllLessons();
  
  // Filtrar solo los métodos de demostración (ID empieza por metodo-)
  const methods = allLessons.filter(l => l.id.startsWith('metodo-'));

  return (
    <div className="min-h-screen bg-lienzo bg-arts-and-crafts text-carbon p-12 lg:p-24 flex justify-center">
      <div className="max-w-4xl w-full">
        
        <header className="mb-16 text-center">
          <h1 className="text-5xl lg:text-7xl font-serif text-carbon tracking-tight mb-6">
            El Arsenal Lógico
          </h1>
          <p className="text-xl text-pizarra font-serif italic max-w-2xl mx-auto">
            "Las matemáticas no son más que el arte de decir lo mismo con diferentes palabras." <br/>
            <span className="text-sm opacity-70 mt-2 block">— Henri Poincaré</span>
          </p>
          <div className="w-24 h-px bg-terracota mx-auto mt-12 opacity-50"></div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {methods.map(method => (
            <div 
              key={method.id} 
              onClick={() => setLocation(`/${method.slug}`)}
              className="group bg-white p-8 border border-carbon/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer rounded-sm flex flex-col"
            >
              <h2 className="text-2xl font-serif text-salvia group-hover:text-terracota transition-colors mb-4">
                {method.id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </h2>
              {/* Intentamos obtener la descripción si está expuesta, o simplemente mostramos un enlace visual */}
              <div className="mt-auto pt-8 flex justify-end">
                <span className="text-xs font-bold tracking-widest uppercase text-carbon/40 group-hover:text-carbon transition-colors">
                  Estudiar Método &rarr;
                </span>
              </div>
            </div>
          ))}
        </section>

      </div>
    </div>
  );
};
