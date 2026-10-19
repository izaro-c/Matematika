import React from 'react';
import { SUPPORTED_LANGUAGES } from '@/i18n/config';
import { useI18n } from '@/i18n';
import type { DocumentVersion } from '@/fixed-pages/editor/session/conceptVersions';
import { Chip } from '../primitives';
import { languageChipStyles, type LanguageChipSize } from './languageChipStyles';

export interface DocumentVersionsProps {
  /** Idioma de la versión abierta (no el de la interfaz). Vacío → ninguna activa. */
  activeLang: string;
  /** Estado de cada idioma; los que no aparecen se tratan como «falta». */
  versions: readonly DocumentVersion[];
  onSelect?: (langCode: string) => void;
  /** Sin él, los idiomas que faltan no se muestran. */
  onCreate?: (langCode: string) => void;
  /** Un diagrama traduce sus etiquetas en el mismo archivo; un documento crea otro archivo. */
  kind?: 'document' | 'diagram';
  size?: LanguageChipSize;
  className?: string;
  'aria-label'?: string;
}

/** Versiones de idioma del contenido: saltar a otra, crear una traducción y ver si falta o está desfasada. */
export const DocumentVersions: React.FC<DocumentVersionsProps> = ({
  activeLang,
  versions,
  onSelect,
  onCreate,
  kind = 'document',
  size = 'default',
  className = '',
  'aria-label': ariaLabel,
}) => {
  const { t } = useI18n();
  const styles = languageChipStyles(size);
  const statusOf = (code: string) => versions.find(version => version.lang === code)?.status ?? 'missing';

  return (
    <div role="group" aria-label={ariaLabel ?? t('editor.language.versions')} className={`${styles.container} ${className}`}>
      {SUPPORTED_LANGUAGES.map(language => {
        const status = statusOf(language.code);
        const code = language.code.toUpperCase();
        const outdatedMark = status === 'outdated' ? <span aria-hidden="true" className={styles.outdatedMark} /> : null;

        if (language.code === activeLang) {
          const title = status === 'outdated'
            ? t('editor.language.activeOutdated', { name: language.name })
            : t('editor.language.active', { name: language.name });
          return (
            <Chip key={language.code} state="active" title={title} aria-label={title}>
              {code}
              {outdatedMark}
            </Chip>
          );
        }

        if (status === 'missing') {
          if (!onCreate) return null;
          const title = kind === 'diagram'
            ? t('editor.language.translateLabels', { name: language.name })
            : t('editor.language.createTranslation', { name: language.name, code });
          return (
            <Chip key={language.code} state="missing" onClick={() => onCreate(language.code)} title={title} aria-label={title}>
              +{code}
            </Chip>
          );
        }

        const title = status === 'outdated'
          ? t('editor.language.switchToOutdated', { name: language.name })
          : t('editor.language.switchTo', { name: language.name });
        return (
          <Chip key={language.code} onClick={() => onSelect?.(language.code)} title={title} aria-label={title}>
            {code}
            {outdatedMark}
          </Chip>
        );
      })}
    </div>
  );
};
