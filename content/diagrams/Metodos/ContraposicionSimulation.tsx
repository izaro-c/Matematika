import { useState } from 'react';
import { useDiagramLang } from '@/diagrams/public';

type View = 'direct' | 'contra';

const TEXT = {
  es: {
    universe: 'Universo (U)',
    consequence: '(Consecuencia)',
    hypothesis: '(Hipótesis)',
    impossible: 'Como P ⊆ Q, ¡imposible que x ∈ P! ⇒ x ∉ P (¬P)',
    outsideQ: 'Zona ¬Q (exterior a Q)',
    qMinusP: 'Q \\ P (está en Q pero no en P)',
    directTitle: 'Modo Directo: P ⇒ Q',
    contraTitle: 'Modo Contrarrecíproco: ¬Q ⇒ ¬P',
    directText: 'Geométricamente, P está completamente contenido dentro de Q (P ⊆ Q). Todo elemento que pertenezca a P necesariamente cae dentro de Q.',
    contraText: 'Si un elemento está fuera del conjunto mayor Q (¬Q), no puede de ninguna manera estar dentro del subconjunto interior P (¬P). Por eso ambas afirmaciones son matemáticamente equivalentes.',
    toContra: 'Ver por qué ¬Q ⇒ ¬P es equivalente',
    toDirect: 'Volver a demostración directa P ⇒ Q',
  },
  eu: {
    universe: 'Unibertsoa (U)',
    consequence: '(Ondorioa)',
    hypothesis: '(Hipotesia)',
    impossible: 'P ⊆ Q denez, ezinezkoa da x ∈ P izatea! ⇒ x ∉ P (¬P)',
    outsideQ: '¬Q eremua (Q-tik kanpo)',
    qMinusP: 'Q \\ P (Q-n dago baina ez P-n)',
    directTitle: 'Modu zuzena: P ⇒ Q',
    contraTitle: 'Kontrako elkarrekiko modua: ¬Q ⇒ ¬P',
    directText: 'Geometrikoki, P osorik dago Q-ren barruan (P ⊆ Q). P-ko elementu oro nahitaez Q-ren barruan dago.',
    contraText: 'Elementu bat Q multzo handiagotik kanpo badago (¬Q), ezin da inola ere P azpimultzo barnekoan egon (¬P). Horregatik dira bi baieztapenak matematikoki baliokideak.',
    toContra: 'Ikusi zergatik den baliokidea ¬Q ⇒ ¬P',
    toDirect: 'Itzuli froga zuzenera P ⇒ Q',
  },
  en: {
    universe: 'Universe (U)',
    consequence: '(Consequence)',
    hypothesis: '(Hypothesis)',
    impossible: 'Since P ⊆ Q, x ∈ P is impossible! ⇒ x ∉ P (¬P)',
    outsideQ: 'Region ¬Q (outside Q)',
    qMinusP: 'Q \\ P (in Q but not in P)',
    directTitle: 'Direct mode: P ⇒ Q',
    contraTitle: 'Contrapositive mode: ¬Q ⇒ ¬P',
    directText: 'Geometrically, P is entirely contained in Q (P ⊆ Q). Every element of P necessarily lies inside Q.',
    contraText: 'If an element lies outside the larger set Q (¬Q), it cannot possibly lie inside the inner subset P (¬P). That is why both statements are mathematically equivalent.',
    toContra: 'See why ¬Q ⇒ ¬P is equivalent',
    toDirect: 'Back to the direct proof P ⇒ Q',
  },
};

export const ContraposicionSimulation = () => {
  const [view, setView] = useState<View>('direct');
  const lang = useDiagramLang();
  const t = TEXT[lang as keyof typeof TEXT] ?? TEXT.es;
  const d = view === 'direct';

  return (
    <div className="w-full h-full flex flex-col items-center justify-center select-none font-serif p-2">
      {/* Visual Euler Diagram */}
      <div className="relative rounded-md overflow-hidden shadow-inner bg-lienzo/50" style={{ width: 440, height: 280 }}>
        {/* Universo U */}
        <div
          className="absolute inset-2 rounded border border-dashed border-carbon/30 pointer-events-none"
        >
          <span className="absolute top-2 left-3 text-xs tracking-wider font-sans font-semibold text-carbon/50">
            {t.universe}
          </span>
        </div>

        {/* Zona Exterior: ¬Q (fuera de Q) */}
        <div
          className="absolute inset-2 rounded transition-colors duration-700 pointer-events-none"
          style={{
            backgroundColor: d ? 'transparent' : 'color-mix(in srgb, var(--theme-granada, #c2410c) 8%, transparent)',
          }}
        />

        {/* Conjunto Q — contenedor exterior */}
        <div
          className="absolute rounded-lg border-2 transition-all duration-700 flex flex-col justify-between p-3"
          style={{
            left: 70,
            top: 35,
            width: 320,
            height: 220,
            borderColor: d ? 'var(--theme-canela)' : 'var(--theme-carbon)',
            backgroundColor: d
              ? 'color-mix(in srgb, var(--theme-canela) 14%, transparent)'
              : 'color-mix(in srgb, var(--theme-canela) 4%, transparent)',
          }}
        >
          <div className="flex justify-between items-center">
            <span
              className="text-lg font-bold transition-all duration-500"
              style={{
                color: 'var(--theme-canela)',
                opacity: d ? 1 : 0.6,
              }}
            >
              Q {d && <span className="text-xs font-sans font-normal opacity-80">{t.consequence}</span>}
            </span>
          </div>

          {/* Conjunto P — subconjunto interior: P ⊆ Q */}
          <div
            className="rounded-md border-2 transition-all duration-700 p-3 self-start"
            style={{
              width: 150,
              height: 120,
              borderColor: 'var(--theme-terracota)',
              backgroundColor: d
                ? 'color-mix(in srgb, var(--theme-terracota) 22%, transparent)'
                : 'color-mix(in srgb, var(--theme-terracota) 7%, transparent)',
            }}
          >
            <span
              className="text-lg font-bold transition-all duration-500 block"
              style={{
                color: 'var(--theme-terracota)',
                opacity: d ? 1 : 0.6,
              }}
            >
              P {d && <span className="text-xs font-sans font-normal opacity-80">{t.hypothesis}</span>}
            </span>
            {d && (
              <span className="text-xs text-terracota/80 mt-1 block">
                P ⊆ Q
              </span>
            )}
          </div>
        </div>

        {/* Punto / Elemento x en modo Directo (x ∈ P ⇒ x ∈ Q) */}
        {d && (
          <div
            className="absolute transition-all duration-700 flex items-center gap-1.5"
            style={{ left: 130, top: 120 }}
          >
            <div className="w-3.5 h-3.5 rounded-full bg-terracota shadow-sm animate-pulse" />
            <span className="text-xs font-bold text-terracota">x ∈ P ⇒ x ∈ Q</span>
          </div>
        )}

        {/* Modo Contrarrecíproco: Elemento fuera de Q (¬Q) */}
        {!d && (
          <div
            className="absolute transition-all duration-700 flex items-center gap-1.5"
            style={{ left: 20, top: 180 }}
          >
            <div className="w-3.5 h-3.5 rounded-full bg-granada shadow-sm animate-pulse" />
            <div className="text-xs font-bold text-granada">
              <div>x ∉ Q (¬Q)</div>
              <div className="text-[11px] font-normal text-carbon/75 font-sans">{t.impossible}</div>
            </div>
          </div>
        )}

        {/* Etiquetas de regiones en contrarrecíproco */}
        {!d && (
          <>
            <div className="absolute top-4 right-6 text-xs font-bold text-granada bg-granada/10 px-2 py-0.5 rounded border border-granada/30">
              {t.outsideQ}
            </div>
            <div className="absolute top-10 left-24 text-xs font-semibold text-carbon/60">
              {t.qMinusP}
            </div>
          </>
        )}
      </div>

      {/* Explicación didáctica clara */}
      <div className="mt-3 text-center max-w-md">
        <p className={`text-base font-bold transition-all duration-300 ${d ? 'text-terracota' : 'text-granada'}`}>
          {d ? t.directTitle : t.contraTitle}
        </p>
        <p className="text-xs text-carbon/80 mt-1 leading-relaxed">
          {d
            ? t.directText
            : t.contraText}
        </p>
      </div>

      {/* Botón de alternancia */}
      <button
        type="button"
        onClick={() => setView(v => (v === 'direct' ? 'contra' : 'direct'))}
        className={`mt-3 px-5 py-2 text-xs uppercase tracking-wider rounded font-sans font-medium transition-all duration-300 shadow-sm
          ${d ? 'bg-canela text-lienzo hover:bg-canela/90' : 'bg-granada text-lienzo hover:bg-granada/90'}`}
      >
        {d ? t.toContra : t.toDirect}
      </button>
    </div>
  );
};

