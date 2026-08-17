import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { Logo } from "@/components/ui/Logo";
import { UI } from '@/design';
import { getGlossaryDictionary } from '@/lib/stores/GlossaryStore';
import { db } from '@/data/content';
import type { GlossaryCategory, GlossaryEntry } from '@/lib/stores/GlossaryStore';
import katex from 'katex';
import { useI18n } from '@/i18n';

/**
 * Página Diccionario (Glossary).
 * Muestra todos los términos matemáticos registrados en `GlossaryStore`,
 * organizados por categorías, con barra de búsqueda y enlaces rápidos a conceptos y demostraciones.
 */
export const DictionaryPage = () => {
  const [search, setSearch] = useState('');
  const { lang, getLocalizedPath, t } = useI18n();

  // Organizar y filtrar el diccionario localizado
  const groupedEntries = useMemo(() => {
    const term = search.toLowerCase();
    const groups: Record<string, [string, GlossaryEntry & { id?: string }][]> = {};
    const dict = getGlossaryDictionary(lang);

    Object.entries(dict).forEach(([key, entry]) => {
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

    db.getAllDefinitions(lang).forEach((def) => {
      const match = 
        def.title.toLowerCase().includes(term) || 
        def.description.toLowerCase().includes(term);

      if (match) {
        const defaultCat = t('content', 'fundamentalConcepts');
        const cat = def.tags?.[0] || defaultCat;
        const catName = cat.charAt(0).toUpperCase() + cat.slice(1);
        if (!groups[catName]) {
          groups[catName] = [];
        }
        
        // Evitar duplicados si ya está en el diccionario estático
        const exists = groups[catName]!.some(([, e]) => e.title.toLowerCase() === def.title.toLowerCase());
        if (!exists) {
          groups[catName]!.push([def.id, {
            title: def.title,
            definition: def.description,
            category: catName as GlossaryCategory,
            id: def.id
          }]);
        }
      }
    });

    return groups;
  }, [search, lang]);

  const renderMath = (tex: string) => {
    try {
      return { __html: katex.renderToString(tex, { throwOnError: false }) };
    } catch {
      return { __html: tex };
    }
  };

  return (
    <div className="min-h-viewport font-serif text-carbon bg-arts-and-crafts flex flex-col items-center py-24 relative">
      <div className="max-w-4xl mx-auto w-full px-8 relative z-10">
        
        {/* Cabecera del Diccionario */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Logo decorative className="w-16 h-16 opacity-80" />
          </div>
          <h1 className="text-5xl md:text-7xl text-terracota tracking-tight mb-6 font-bold mb-4">
            {t('glossary', 'title')}
          </h1>
          <p className="text-xl text-carbon/60 italic max-w-2xl mx-auto mb-12">
            {t('glossary', 'subtitle')}
          </p>

          {/* Barra de búsqueda integrada */}
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder={t('search', 'placeholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent border-b-2 border-carbon/20 py-2 px-4 text-center text-lg focus:outline-none focus:border-terracota transition-colors text-carbon placeholder:text-carbon/30 italic"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-carbon/40 hover:text-carbon"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Listado agrupado */}
        {Object.entries(groupedEntries).map(([category, items]) => {
          if (items.length === 0) return null;
          return (
            <div key={category} className="mb-24">
              <div className="flex items-center gap-6 mb-12">
                <h2 className="text-3xl text-terracota font-bold ${UI.textBalance}">
                  {category}
                </h2>
                <div className="flex-1 h-[1px] bg-carbon/10" />
                <span className={`${UI.tabularNums} text-xs font-mono text-carbon/40`}>
                  {items.length === 1
                    ? t('glossary', 'termCount', { count: 1 })
                    : t('glossary', 'termsCount', { count: items.length })}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {items.map(([key, data]) => (
                  <div 
                    key={key} 
                    id={key}
                    className="group"
                  >
                      <h3 className="text-2xl text-carbon mb-2 font-bold">
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
                      <Link href={getLocalizedPath(`/definicion/${data.id}`)}>
                        <span className="inline-block mt-4 ac-eyebrow text-terracota hover:text-carbon transition-colors border-b border-terracota/30 pb-1 cursor-pointer">
                          {t('glossary', 'readFullArticle')}
                        </span>
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
            {t('glossary', 'noResults', { search })}
          </div>
        )}

        <div className="mt-32 text-center pb-24">
          <Link href={getLocalizedPath('/')}>
            <span className="ac-btn ac-interactive px-12 py-4 border-2 border-carbon text-carbon font-semibold hover:bg-carbon hover:text-lienzo cursor-pointer inline-block">
              {t('topbar', 'backToLibrary')}
            </span>
          </Link>
        </div>

      </div>
    </div>
  );
};
