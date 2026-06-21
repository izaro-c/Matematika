import React from 'react';

interface SuspenseFallbackProps {
  type?: 'block' | 'text' | 'skeleton';
  height?: string;
  message?: string;
}

export const SuspenseFallback: React.FC<SuspenseFallbackProps> = ({
  type = 'block',
  height,
  message,
}) => {
  if (message) {
    return (
      <div className="py-20 text-center text-carbon/50 italic animate-pulse">
        {message}
      </div>
    );
  }

  if (type === 'text') {
    return (
      <div className="animate-pulse text-pizarra italic py-8">
        Cargando contenido...
      </div>
    );
  }

  return (
    <div
      className="animate-pulse bg-carbon/5 rounded"
      style={{ height: height || (type === 'block' ? '16rem' : '10rem') }}
    />
  );
};
