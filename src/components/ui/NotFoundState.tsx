import React from 'react';
import { Link } from 'wouter';

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
    <div className="min-h-screen bg-lienzo flex flex-col items-center justify-center font-serif text-carbon">
      <h1 className="text-2xl md:text-3xl mb-4">{title}</h1>
      {(message || missingId) && (
        <p className="text-pizarra mb-6 text-center max-w-md">
          {message}
          {missingId && (
            <>
              {' '}<code className="bg-carbon/5 px-2 py-0.5 rounded">{missingId}</code>{' '}
              no existe en la base de datos.
            </>
          )}
        </p>
      )}
      {showHomeLink && (
        <Link href="/" className="text-terracota hover:underline font-serif">
          ← Volver al inicio
        </Link>
      )}
    </div>
  );
};
