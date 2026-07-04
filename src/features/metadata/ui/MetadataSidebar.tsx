import { Link } from 'wouter';
import { useMetadataStore } from '@/features/metadata/MetadataStore';
import { PageDependencyGraph } from './PageDependencyGraph';
import { getContentPageAccent } from '@/shared/design/pageAccents';

export function MetadataSidebar() {
  const metadata = useMetadataStore((state) => state.metadata);

  if (!metadata) return null;

  const normalizedType = metadata.type
    ? metadata.type.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    : 'teorema';
  const accent = getContentPageAccent(normalizedType);

  return (
    <div className="metadata-sidebar" style={{ '--page-accent': accent } as React.CSSProperties}>
      {metadata.type && (
        <header className="metadata-sidebar__header">
          <p className="metadata-sidebar__eyebrow">{metadata.type}</p>
          {metadata.title && <h2 className="metadata-sidebar__title font-serif italic text-lg">{metadata.title}</h2>}
        </header>
      )}

      <div className="metadata-sidebar__sections">
        <MetadataSection title="Red de Conexiones">
          <PageDependencyGraph
            currentId={metadata.id || ''}
            currentTitle={metadata.title || ''}
            currentType={metadata.type || ''}
            lemmas={metadata.lemmas}
            corollaries={metadata.corollaries}
            demos={metadata.demos}
          />
        </MetadataSection>

        {metadata.tableOfContents && metadata.tableOfContents.length > 0 && (
          <MetadataSection title="Índice">
            <ul className="metadata-sidebar__links metadata-sidebar__links--index">
              {metadata.tableOfContents.map((item) => (
                <li key={item.id} style={{ paddingLeft: `${0.85 + Math.max(0, item.level - 1) * 0.5}rem` }}>
                  <a href={`#${item.id}`} className="transition-colors">{item.title}</a>
                </li>
              ))}
            </ul>
          </MetadataSection>
        )}

        {metadata.lemmas && metadata.lemmas.length > 0 && (
          <MetadataSection title="Prerrequisitos" ornament="◂">
            <MetadataLinks items={metadata.lemmas} path="/teorema" type="lema" />
          </MetadataSection>
        )}

        {metadata.demos && metadata.demos.length > 0 && (
          <MetadataSection title="Demostraciones" ornament="❖">
            <MetadataLinks items={metadata.demos} path="/demo" type="demo" />
          </MetadataSection>
        )}

        {metadata.corollaries && metadata.corollaries.length > 0 && (
          <MetadataSection title="Consecuencias" ornament="▸">
            <MetadataLinks items={metadata.corollaries} path="/teorema" type="corolario" />
          </MetadataSection>
        )}

        {metadata.domain && (
          <MetadataSection title="Dominio">
            <p className="capitalize font-serif italic text-sm">{metadata.domain}</p>
          </MetadataSection>
        )}

        {metadata.difficulty && (
          <MetadataSection title="Nivel">
            <p className="capitalize font-serif italic text-sm">{metadata.difficulty}</p>
          </MetadataSection>
        )}

        {(metadata.author || metadata.date) && (
          <MetadataSection title="Atribución">
            {metadata.author && <p className="font-serif italic text-sm">{metadata.author}</p>}
            {metadata.date && <p className="text-xs text-carbon/60">{metadata.date}</p>}
          </MetadataSection>
        )}
      </div>
    </div>
  );
}

function MetadataSection({
  title,
  ornament,
  children,
}: {
  title: string;
  ornament?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="metadata-sidebar__section">
      <h3>
        {ornament && <span aria-hidden>{ornament}</span>}
        {title}
      </h3>
      {children}
    </section>
  );
}

function MetadataLinks({
  items,
  path,
  type,
}: {
  items: { id: string; title: string }[];
  path: string;
  type: 'lema' | 'demo' | 'corolario';
}) {
  return (
    <ul className={`metadata-sidebar__links metadata-sidebar__links--${type}`}>
      {items.map((item) => (
        <li key={item.id}>
          <Link href={`${path}/${item.id}`}>{item.title}</Link>
        </li>
      ))}
    </ul>
  );
}
