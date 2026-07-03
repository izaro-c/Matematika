import { Link } from 'wouter';
import { useMetadataStore } from '@/features/metadata/MetadataStore';

export function MetadataSidebar() {
  const metadata = useMetadataStore((state) => state.metadata);

  if (!metadata) return null;

  return (
    <div className="metadata-sidebar">
      {metadata.type && (
        <header className="metadata-sidebar__header">
          <p className="metadata-sidebar__eyebrow">{metadata.type}</p>
          {metadata.title && <h2 className="metadata-sidebar__title">{metadata.title}</h2>}
          {metadata.description && <p className="metadata-sidebar__description">{metadata.description}</p>}
        </header>
      )}

      <div className="metadata-sidebar__sections">
        {metadata.domain && (
          <MetadataSection title="Dominio">
            <p className="capitalize">{metadata.domain}</p>
          </MetadataSection>
        )}

        {(metadata.author || metadata.date) && (
          <MetadataSection title="Atribución">
            {metadata.author && <p>{metadata.author}</p>}
            {metadata.date && <p className="text-xs text-carbon/60">{metadata.date}</p>}
          </MetadataSection>
        )}

        {metadata.difficulty && (
          <MetadataSection title="Nivel">
            <p className="capitalize">{metadata.difficulty}</p>
          </MetadataSection>
        )}

        {metadata.tags && metadata.tags.length > 0 && (
          <MetadataSection title="Etiquetas">
            <ul className="metadata-sidebar__tags">
              {metadata.tags.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
          </MetadataSection>
        )}

        {metadata.lemmas && metadata.lemmas.length > 0 && (
          <MetadataSection title="Prerrequisitos" ornament="◂">
            <MetadataLinks items={metadata.lemmas} path="/teorema" />
          </MetadataSection>
        )}

        {metadata.demos && metadata.demos.length > 0 && (
          <MetadataSection title="Demostraciones" ornament="❖">
            <MetadataLinks items={metadata.demos} path="/demo" />
          </MetadataSection>
        )}

        {metadata.corollaries && metadata.corollaries.length > 0 && (
          <MetadataSection title="Consecuencias" ornament="▸">
            <MetadataLinks items={metadata.corollaries} path="/teorema" />
          </MetadataSection>
        )}

        {metadata.tableOfContents && metadata.tableOfContents.length > 0 && (
          <MetadataSection title="Índice">
            <ul className="metadata-sidebar__links">
              {metadata.tableOfContents.map((item) => (
                <li key={item.id} style={{ paddingLeft: `${Math.max(0, item.level - 1) * 0.5}rem` }}>
                  <a href={`#${item.id}`}>{item.title}</a>
                </li>
              ))}
            </ul>
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
}: {
  items: { id: string; title: string }[];
  path: string;
}) {
  return (
    <ul className="metadata-sidebar__links">
      {items.map((item) => (
        <li key={item.id}>
          <Link href={`${path}/${item.id}`}>{item.title}</Link>
        </li>
      ))}
    </ul>
  );
}
