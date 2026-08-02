import React from 'react';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'header' | 'main' | 'nav';
}

/**
 * Entrada suave. La opacidad inicial vive en keyframes (`animation-fill-mode: both`),
 * no en inline style — así prefers-reduced-motion / fallos de animación no dejan el
 * contenido invisible (opacity: 0 permanente).
 */
export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 400,
  className = '',
  as: Tag = 'div',
}) => {
  return (
    <Tag
      className={`animate-fade-in ${className}`}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
      }}
    >
      {children}
    </Tag>
  );
};
