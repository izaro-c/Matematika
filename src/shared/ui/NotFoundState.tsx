import React from 'react';
import { Link } from 'wouter';
import { UI } from '@/shared/design';

interface NotFoundStateProps {
  title: string;
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
  return (
    <div className={`${UI.page} bg-arts-and-crafts flex flex-col items-center justify-center px-6`}>
      <p className={`${UI.labelSm} ac-label--faint mb-3`}>Error 404</p>
      <h1 className={`text-2xl md:text-3xl mb-4 ${UI.textBalance} text-center`}>{title}</h1>
      {(message || missingId) && (
        <p className={`text-pizarra mb-8 text-center max-w-md ${UI.textPretty} leading-relaxed`}>
          {message}
          {missingId && (
            <>
              {' '}<code className={UI.codeInline}>{missingId}</code>{' '}
              no existe en la base de datos.
            </>
          )}
        </p>
      )}
      {showHomeLink && (
        <Link href="/" className={`${UI.link} font-medium`}>
          ← Volver al inicio
        </Link>
      )}
    </div>
  );
};
