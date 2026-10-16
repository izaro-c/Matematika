import { CONTENT_TYPE_COLORS } from '@/design/contentTypeColors';
import { useI18n } from '@/i18n';

const NODE_TYPES = ['teorema', 'axioma', 'concepto', 'definicion', 'corolario', 'modelo', 'lema'] as const;

interface AxiomaticDisplayOptionsProps {
  visibleTypes: Set<string>;
  onToggleType: (type: string) => void;
  typeLabel: Record<string, string>;
  typeColors: Record<string, string>;
}

const HINT_CLASS = 'mt-1 font-serif text-[13px] italic leading-snug text-ink-muted';
const LEGEND_TEXT_CLASS = 'font-serif text-[13px] leading-snug text-ink-muted';

export function AxiomaticDisplayOptions({
  visibleTypes,
  onToggleType,
  typeLabel,
  typeColors,
}: AxiomaticDisplayOptionsProps) {
  const { t } = useI18n();

  return (
    <div>
      <section aria-labelledby="visible-layers-title">
        <h2 id="visible-layers-title" className="text-lg leading-tight text-ink">
          {t('graph', 'visibleLayers')}
        </h2>
        <p className={HINT_CLASS}>{t('graph', 'layersViewHint')}</p>

        {/* Leyenda de atlas pulsable: muestra llena = capa visible; solo contorno = oculta. */}
        <div className="mt-3 grid grid-cols-2 gap-x-4">
          {NODE_TYPES.map(type => {
            const isVisible = visibleTypes.has(type);
            const color = typeColors[type] ?? CONTENT_TYPE_COLORS.matematico.cssVar;

            return (
              <button
                key={type}
                type="button"
                aria-pressed={isVisible}
                onClick={() => onToggleType(type)}
                className={`flex min-h-9 items-center gap-2.5 py-1 text-left font-serif text-[14px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracota ${
                  isVisible ? 'text-ink' : 'italic text-ink-subtle hover:text-ink-muted'
                }`}
              >
                <span
                  aria-hidden="true"
                  className="size-3 shrink-0 border"
                  style={{ borderColor: color, backgroundColor: isVisible ? color : 'transparent' }}
                />
                <span className="truncate">{typeLabel[type] || type}</span>
              </button>
            );
          })}
        </div>
      </section>

      <hr className="my-6 border-carbon/15" />

      <section aria-labelledby="graph-reading-title">
        <h2 id="graph-reading-title" className="text-lg leading-tight text-ink">
          {t('graph', 'howToRead')}
        </h2>

        <div className="my-4 flex items-center gap-3" aria-label={t('graph', 'aNecessaryForBAria')}>
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-pavo bg-pavo/10 font-serif text-xs text-ink">A</span>
          <svg aria-hidden="true" viewBox="0 0 88 16" className="h-4 min-w-0 flex-1 text-carbon/55">
            <path d="M1 8H82" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M76 3L83 8L76 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-terracota bg-terracota/10 font-serif text-xs text-ink">B</span>
          <span className="font-serif text-[13px] italic leading-tight text-ink-muted" dangerouslySetInnerHTML={{ __html: t('graph', 'aNecessaryForBText') }} />
        </div>

        <div className={`grid grid-cols-[2.25rem_1fr] items-center gap-x-2.5 gap-y-2 ${LEGEND_TEXT_CLASS}`}>
          <span aria-hidden="true" className="block h-[2px] w-8 bg-carbon/55" />
          <span>{t('graph', 'originAxiom')}</span>
          <span aria-hidden="true" className="block h-[2px] w-8 bg-[repeating-linear-gradient(90deg,var(--theme-carbon)_0,var(--theme-carbon)_4px,transparent_4px,transparent_8px)] opacity-55" />
          <span>{t('graph', 'originLemma')}</span>
          <span aria-hidden="true" className="block h-[2px] w-8 bg-[repeating-linear-gradient(90deg,var(--theme-carbon)_0,var(--theme-carbon)_2px,transparent_2px,transparent_5px)] opacity-55" />
          <span>{t('graph', 'originDefinition')}</span>
          <span aria-hidden="true" className="block h-[2.5px] w-8 bg-pavo" />
          <span>{t('graph', 'originPrimitive')}</span>
        </div>
      </section>

      <section aria-labelledby="graph-states-title" className="mt-6">
        <h3 id="graph-states-title" className="ac-rubric text-[15px]">
          {t('graph', 'graphStates')}
        </h3>
        <div className={`mt-2 space-y-2.5 ${LEGEND_TEXT_CLASS}`}>
          <div className="flex items-start gap-3">
            <span aria-hidden="true" className="mt-0.5 size-4 shrink-0 rounded-full bg-canela" />
            <p><strong className="font-semibold text-ink">{t('graph', 'fullColorState')}</strong> {t('graph', 'fullColorDesc')}</p>
          </div>
          <div className="flex items-start gap-3">
            <span aria-hidden="true" className="mt-0.5 size-4 shrink-0 rounded-full bg-canela opacity-25" />
            <p><strong className="font-semibold text-ink">{t('graph', 'fadedState')}</strong> {t('graph', 'fadedDesc')}</p>
          </div>
          <div className="flex items-start gap-3">
            <span aria-hidden="true" className="mt-0.5 size-4 shrink-0 rounded-full border-[3px] border-carbon bg-lienzo" />
            <p><strong className="font-semibold text-ink">{t('graph', 'markedBorderState')}</strong> {t('graph', 'markedBorderDesc')}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
