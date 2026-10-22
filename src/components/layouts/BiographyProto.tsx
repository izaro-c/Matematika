// PROTOTIPO DESECHABLE (?proto=time): opciones visuales de la biografía.
import { Link } from 'wouter';
import { useI18n } from '@/i18n';
import { db } from '@/data/content';
import type { Mathematician } from '@/data/content/types';

export const getBioProto = () =>
  typeof window === 'undefined' ? null : new URLSearchParams(window.location.search).get('proto');

interface Row { m: Mathematician; from: number; to: number }

/** C · En su tiempo: vecinos en la enciclopedia, con el eje partido entre épocas lejanas. */
export const ProtoTime: React.FC<{ id: string }> = ({ id }) => {
  const { lang, getLocalizedPath } = useI18n();
  const all = db.getAllMathematicians(lang).filter((m) => m.birthYear !== undefined);
  const idx = all.findIndex((m) => m.id === id);
  if (idx < 0) return null;
  const rows: Row[] = all
    .slice(Math.max(0, idx - 3), idx + 4)
    .map((m) => ({ m, from: m.birthYear!, to: m.deathYear ?? m.birthYear! + 60 }));

  // Tramos: se parte el eje donde hay más de 250 años sin nadie
  const segs: { from: number; to: number }[] = [];
  for (const r of [...rows].sort((a, b) => a.from - b.from)) {
    const last = segs[segs.length - 1];
    if (last && r.from - last.to < 250) last.to = Math.max(last.to, r.to);
    else segs.push({ from: r.from, to: r.to });
  }
  const pad = 15;
  const GAP = 6; // % del ancho para cada corte
  const spans = segs.map((s) => s.to - s.from + 2 * pad);
  const total = spans.reduce((a, b) => a + b, 0);
  const usable = 100 - GAP * (segs.length - 1);
  const starts: number[] = [];
  let acc = 0;
  segs.forEach((_, i) => { starts.push(acc); acc += (spans[i] / total) * usable + GAP; });
  const x = (year: number) => {
    const i = segs.findIndex((s) => year >= s.from - pad && year <= s.to + pad);
    const s = segs[i];
    return starts[i] + ((year - s.from + pad) / spans[i]) * ((spans[i] / total) * usable);
  };
  const fmt = (y: number) => (y < 0 ? `${-y} a. C.` : `${y}`);

  return (
    <figure className="proto-time">
      <div className="proto-time__rows">
        {rows.map(({ m, from, to }) => (
          <div key={m.id} className="proto-time__row" data-self={m.id === id || undefined}>
            {m.id === id
              ? <span className="proto-time__name">{m.name}</span>
              : <Link href={getLocalizedPath(`/bio/${m.id}`)} className="proto-time__name">{m.name}</Link>}
            <span className="proto-time__track">
              <span className="proto-time__bar" style={{ left: `${x(from)}%`, width: `${Math.max(x(to) - x(from), 1.5)}%` }} />
            </span>
          </div>
        ))}
        <span className="proto-time__breaks" aria-hidden="true">
          {segs.slice(1).map((_, i) => (
            <span key={i} className="proto-time__break" style={{ left: `${starts[i + 1] - GAP / 2}%` }} />
          ))}
        </span>
      </div>
      <div className="proto-time__axis">
        <span className="proto-time__axis-track">
          {segs.map((s, i) => (
            <span key={i}>
              <span style={{ left: `${x(s.from)}%` }}>{fmt(s.from)}</span>
              {s.to - s.from > 120 && <span style={{ left: `${x(s.to)}%` }}>{fmt(s.to)}</span>}
            </span>
          ))}
        </span>
      </div>
      <figcaption><span className="ac-rubric">En su tiempo</span></figcaption>
    </figure>
  );
};
