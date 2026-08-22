import React from 'react';
import { Link } from 'wouter';
import { UI } from '@/design';
import { useI18n } from '@/i18n';

interface NotFoundStateProps {
  title?: string;
  message?: string;
  missingId?: string;
  showHomeLink?: boolean;
}

export const NotFoundState: React.FC<NotFoundStateProps> = ({
  title,
  message,
  missingId,
  showHomeLink = true,
}) => {
  const { t, getLocalizedPath } = useI18n();
  const defaultTitle = title || t('notFound', 'title');
  const defaultMessage = message || t('notFound', 'description');

  return (
    <div className={`${UI.page} bg-arts-and-crafts flex flex-col items-center justify-center px-6`}>
      <p className={`${UI.labelSm} ac-label--faint mb-3`}>Error 404</p>
      <h1 className={`text-2xl md:text-3xl mb-4 ${UI.textBalance} text-center`}>{defaultTitle}</h1>
      {(defaultMessage || missingId) && (
        <p className={`text-mora mb-8 text-center max-w-md ${UI.textPretty} leading-relaxed`}>
          {defaultMessage}
          {missingId && (
            <>
              {' '}<code className={UI.codeInline}>{missingId}</code>{' '}
              {t('common', 'notInDatabase')}
            </>
          )}
        </p>
      )}
      {showHomeLink && (
        <Link href={getLocalizedPath('/')} className={`${UI.link} font-medium`}>
          ← {t('notFound', 'backHome')}
        </Link>
      )}
    </div>
  );
};
