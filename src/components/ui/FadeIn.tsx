import React from 'react';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'header' | 'main' | 'nav';
}

/**
 * Contenedor de layout. Sin animación de entrada: el contenido aparece
 * ya en su sitio cuando cae la pantalla de carga.
 */
export const FadeIn: React.FC<FadeInProps> = ({
  children,
  className = '',
  as: Tag = 'div',
}) => {
  return <Tag className={className || undefined}>{children}</Tag>;
};
