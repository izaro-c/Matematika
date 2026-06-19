import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { Logo } from "../components/ui/Logo";
import { dictionary } from '../store/GlossaryStore';
import { db } from '../store/content';
import type { GlossaryCategory, GlossaryEntry } from '../store/GlossaryStore';
import katex from 'katex';

/**
 * Página Diccionario (Glossary).
 * Muestra todos los términos matemáticos registrados en `GlossaryStore`,
 * organizados por categorías, con barra de búsqueda y enlaces rápidos a conceptos y demostraciones.
 */
export const DictionaryPage = () => {
  const [search, setSearch] = useState('');

  // Organizar y filtrar el diccionario
  const groupedEntries = useMemo(() => {
    const term = search.toLowerCase();
    const groups: Record<string, [string, GlossaryEntry & { id?: string }][]> = {};

    Object.entries(dictionary).forEach(([key, entry]) => {
      // Filtrar por término
      const match = 
        entry.title.toLowerCase().includes(term) || 
        entry.definition.toLowerCase().includes(term) ||
        (entry.equation && entry.equation.toLowerCase().includes(term));

      if (match) {
        if (!groups[entry.category]) {
          groups[entry.category] = [];
        }
        groups[entry.category]!.push([key, entry]);
      }
    });

    db.getAllDefinitions().forEach((def) => {
      const match = 
        def.title.toLowerCase().includes(term) || 
        def.description.toLowerCase().includes(term);

      if (match) {
        const cat = def.tags?.[0] || 'Conceptos Fundamentales';
        const catName = cat.charAt(0).toUpperCase() + cat.slice(1);
        
        if (!groups[catName]) {
          groups[catName] = [];
        }
        groups[catName]!.push([def.id, {
          title: def.title,
          definition: def.description,
          category: catName as GlossaryCategory,
          id: def.id
        } as GlossaryEntry & { id?: string }]);
      }
    });

    db.getAllModels().forEach((model) => {
      const match =
        model.title.toLowerCase().includes(term) ||
        (model.description?.toLowerCase().includes(term) ?? false);

      if (match) {
        const cat = 'Modelos';
        if (!groups[cat]) {
          groups[cat] = [];
        }
        groups[cat]!.push([model.id, {
          title: model.title,
          definition: model.description || '',
          category: cat as GlossaryCategory,
          id: model.id
        } as GlossaryEntry & { id?: string }]);
      }
    });

    // Ordenar alfabéticamente dentro de cada grupo
    Object.keys(groups).forEach(cat => {
      groups[cat]!.sort((a, b) => a[1].title.localeCompare(b[1].title));
    });

    return groups;
  }, [search]);

  const renderMath = (mathString: string) => {
    try {
      return { __html: katex.renderToString(mathString, { displayMode: true, throwOnError: false }) };
    } catch {
      return { __html: mathString };
    }
  };

  const categoriesOrder: GlossaryCategory[] = [
    'Conceptos Fundamentales',
    'Lógica',
    'Teoría de Conjuntos',
    'Álgebra',
    'Geometría',
    'Modelos',
    'Análisis'
  ];

  return (
    <div className="min-h-screen font-serif text-carbon bg-lienzo bg-arts-and-crafts flex flex-col items-center py-24 relative">
      <div className="absolute inset-4 border-2 border-carbon/10 pointer-events-none" />
      <div className="absolute inset-6 border border-carbon/5 pointer-events-none" />

      <div className="max-w-4xl w-full px-8 relative z-10">
        
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Logo className="w-16 h-16 opacity-50" />
          </div>
          <h1 className="text-5xl md:text-7xl text-terracota tracking-tight mb-6" style={{ fontVariant: 'small-caps' }}>
            Índice Enciclopédico
          </h1>
          <p className="text-xl text-carbon/60 italic max-w-2xl mx-auto mb-12">
            Glosario universal de conceptos, axiomas y simbología matemática.
          </p>

          {/* Buscador minimalista */}
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Buscar un símbolo o concepto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent border-b-2 border-carbon/20 py-2 px-4 text-center text-lg focus:outline-none focus:border-terracota transition-colors text-carbon placeholder:text-carbon/30 italic"
            />
          </div>
        </div>

        {Array.from(new Set([...categoriesOrder, ...Object.keys(groupedEntries)] as GlossaryCategory[])).map(category => {
          const entries = groupedEntries[category];
          if (!entries || entries.length === 0) return null;

          return (
            <div key={category} className="mb-24">
              <div className="flex items-center gap-6 mb-12">
                <h2 className="text-3xl text-terracota font-bold tracking-widest uppercase" style={{ fontVariant: 'small-caps' }}>
                  {category}
                </h2>
                <div className="flex-1 h-[1px] bg-carbon/10" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                {entries.map(([key, data]) => (
                  <div key={key} className="group relative">
                    <h3 className="text-2xl text-carbon mb-2 font-bold" style={{ fontVariant: 'small-caps' }}>
                      {data.title}
                    </h3>
                    <div className="w-8 h-[1px] bg-terracota/30 mb-4 transition-all duration-500 group-hover:w-full group-hover:bg-terracota/50" />
                    <p className="text-carbon/80 leading-relaxed italic mb-4">
                      {data.definition}
                    </p>
                    
                    {data.equation && (
                      <div 
                        className="bg-carbon/5 p-4 rounded-sm border border-carbon/10 text-center text-xl overflow-x-auto"
                        dangerouslySetInnerHTML={renderMath(data.equation)}
                      />
                    )}

                    {data.id && (
                      <Link href={`/definicion/${data.id}`}>
                        <a className="inline-block mt-4 text-xs font-sans tracking-widest uppercase text-terracota hover:text-carbon transition-colors border-b border-terracota/30 pb-1">
                          Leer Artículo Completo →
                        </a>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {Object.keys(groupedEntries).length === 0 && (
          <div className="text-center text-carbon/50 italic py-12">
            No se han encontrado registros para "{search}".
          </div>
        )}

        <div className="mt-32 text-center pb-24">
          <Link href="/">
            <a className="inline-block px-12 py-4 border-2 border-carbon text-carbon font-bold tracking-widest uppercase hover:bg-carbon hover:text-lienzo transition-all duration-300">
              Volver a la Biblioteca
            </a>
          </Link>
        </div>

      </div>
    </div>
  );
};
