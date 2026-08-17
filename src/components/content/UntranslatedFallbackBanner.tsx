import React from 'react';
import { useI18n, getLanguage } from '@/i18n';

interface UntranslatedFallbackBannerProps {
  availableLangs: string[];
  className?: string;
}

export const UntranslatedFallbackBanner: React.FC<UntranslatedFallbackBannerProps> = ({ availableLangs, className = '' }) => {
  const { currentLanguage, setLang, t } = useI18n();

  if (availableLangs.includes(currentLanguage.code)) {
    return null;
  }

  return (
    <div className={`w-full mb-6 p-4 rounded-lg bg-ocre/10 dark:bg-ocre/15 border border-ocre/30 text-carbon dark:text-papiro text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-200 ${className}`.trim()}>
      <div className="flex items-center gap-2.5">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ocre shrink-0">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span>
          <strong className="font-semibold">{t('fallback', 'notAvailableInLang')}</strong>{' '}
          <span className="opacity-90">{t('fallback', 'availableIn')}</span>
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {availableLangs.map((langCode) => {
          const langInfo = getLanguage(langCode);
          return (
            <button
              key={langCode}
              type="button"
              onClick={() => setLang(langCode)}
              className="px-3 py-1 text-xs rounded font-medium bg-terracota/10 dark:bg-terracota/20 text-terracota dark:text-ocre border border-terracota/30 hover:bg-terracota hover:text-white dark:hover:bg-ocre dark:hover:text-carbon transition-colors duration-150"
            >
              {langInfo.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
