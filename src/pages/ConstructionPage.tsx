import { useParams, Link } from 'wouter';
import { FadeIn } from '@/shared/ui/FadeIn';

export const ConstructionPage: React.FC = () => {
  const { id } = useParams();
  const conceptId = id || '';
  const displayId = conceptId.replace(/-/g, ' ');

  return (
    <div className="min-h-viewport bg-arts-and-crafts flex items-center justify-center text-carbon font-serif">
      <FadeIn>
        <div className="text-center max-w-2xl mx-auto px-6 py-24">
          <div className="text-6xl mb-8 text-terracota/30">✦</div>

          <h1
            className="text-4xl md:text-5xl font-bold mb-6 text-carbon"
          >
            En Construcción
          </h1>

          <div className="w-16 h-px bg-terracota/60 mx-auto mb-8" />

          <p className="text-lg text-carbon/70 italic leading-relaxed mb-8">
            La página para <strong className="text-carbon not-italic">{displayId}</strong>
            {' '}está siendo desarrollada como parte del jardín digital de Matematika.
            El contenido aparecerá aquí cuando esté listo, con el rigor y la interactividad que caracterizan al proyecto.
          </p>

          <div className="flex items-center gap-3 opacity-40 my-10">
            <div className="flex-1 h-px bg-carbon" />
            <span className="text-terracota text-sm">❦</span>
            <div className="flex-1 h-px bg-carbon" />
          </div>

          <p className="ac-eyebrow text-sm text-carbon/50 mb-10">
            Mientras tanto, puedes seguir explorando la enciclopedia
          </p>

          <Link href="/">
            <a className="inline-block px-8 py-3 border border-carbon/20 hover:border-terracota hover:text-terracota transition-all ac-eyebrow font-bold">
              ← Volver a la Biblioteca
            </a>
          </Link>
        </div>
      </FadeIn>
    </div>
  );
};
