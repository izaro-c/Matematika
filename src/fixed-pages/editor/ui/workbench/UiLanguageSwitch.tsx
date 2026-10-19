import React from 'react';
import { SUPPORTED_LANGUAGES } from '@/i18n/config';
import { useI18n } from '@/i18n';
import { Chip } from '../primitives';
import { languageChipStyles, type LanguageChipSize } from './languageChipStyles';

export interface UiLanguageSwitchProps {
  /** Si no se indica, cambia `:lang` conservando la ruta y los parámetros (el documento sigue abierto). */
  onSelect?: (langCode: string) => void;
  size?: LanguageChipSize;
  className?: string;
  'aria-label'?: string;
}

/** Idioma de la interfaz (`:lang` de la URL). No cambia el idioma del documento abierto. */
export const UiLanguageSwitch: React.FC<UiLanguageSwitchProps> = ({
  onSelect,
  size = 'default',
  className = '',
  'aria-label': ariaLabel,
}) => {
  const { t, lang, setLang } = useI18n();
  const styles = languageChipStyles(size);
  const select = onSelect ?? ((code: string) => setLang(code, { keepSearch: true }));

  return (
    <div role="group" aria-label={ariaLabel ?? t('editor.language.interface')} className={`${styles.container} ${className}`}>
      {SUPPORTED_LANGUAGES.map(language =>
        language.code === lang ? (
          <Chip key={language.code} state="active" title={t('editor.language.active', { name: language.name })}>
            {language.code.toUpperCase()}
          </Chip>
        ) : (
          <Chip
            key={language.code}
            onClick={() => select(language.code)}
            title={t('editor.language.switchUi', { name: language.name })}
          >
            {language.code.toUpperCase()}
          </Chip>
        ),
      )}
    </div>
  );
};
