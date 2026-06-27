
import { Link } from 'wouter';

export function GraphLegend() {
  return (
    <div className="absolute bottom-8 right-8 z-50 bg-lienzo border-2 border-carbon/80 p-5 shadow-2xl">
      <div className="border border-carbon/20 p-4 relative">
        <h4 className="font-bold text-sm uppercase tracking-widest mb-4 text-carbon/80 text-center mt-2" style={{ fontVariant: 'small-caps' }}>Leyenda</h4>
        <div className="flex flex-col gap-3 text-sm italic text-carbon/80">
          <div className="flex items-center gap-3"><div className="w-4 h-4 border border-carbon bg-carbon"></div> Matemáticas</div>
          <div className="flex items-center gap-3"><div className="w-4 h-4 border border-carbon bg-terracota"></div> Ramas</div>
          <div className="flex items-center gap-3"><div className="w-4 h-4 border border-carbon bg-ocre"></div> Axiomas</div>
          <div className="flex items-center gap-3"><div className="w-4 h-4 border border-carbon bg-salvia"></div> Teoremas / Lemas</div>
          <div className="flex items-center gap-3"><div className="w-4 h-4 border border-carbon bg-pizarra"></div> Definiciones</div>
          <div className="flex items-center gap-3"><div className="w-4 h-4 border border-carbon bg-pavo"></div> Sistemas / Modelos</div>
          <div className="flex items-center gap-3"><div className="w-4 h-4 border border-carbon bg-ocre"></div> Matemáticos</div>
        </div>
        <div className="mt-4 pt-3 border-t border-carbon/20">
          <Link href="/axiomas">
            <a className="flex items-center justify-center gap-2 text-xs font-sans uppercase tracking-widest text-terracota hover:text-carbon transition-colors font-bold">
              Grafo de axiomas &rarr;
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
