import React from 'react';

interface NotebookLayoutProps {
  /** Texto explicativo y definición formal. */
  children: React.ReactNode;
  /** Simulación interactiva del concepto matemático. */
  diagram?: React.ReactNode;
  /** Ejercicios, ejemplos y aplicaciones. */
  secondary?: React.ReactNode;
  /** Etiqueta descriptiva para accesibilidad. */
  diagramLabel?: string;
  className?: string;
}

/**
 * NotebookLayout ("El Cuaderno de Campo")
 * 
 * Layout especializado para Definiciones y Conceptos Base.
 * En móvil, presenta un flujo lineal vertical.
 * En escritorio, ofrece una vista simétrica 50/50 donde la teoría y la simulación
 * interactiva comparten el protagonismo visual en paralelo.
 */
export const NotebookLayout: React.FC<NotebookLayoutProps> = ({
  children,
  diagram,
  secondary,
  diagramLabel = 'Simulación interactiva',
  className = '',
}) => {
  const hasDiagram = diagram !== undefined && diagram !== null;

  return (
    <div className={`notebook-layout ${className}`}>
      <div className={`notebook-content ${!hasDiagram ? 'is-single-column' : ''}`}>
        {/* Columna Teoría (Motivación + Definición) */}
        <main className="notebook-primary">
          {children}
        </main>

        {/* Columna Práctica/Simulación (Geometría/Interactividad) */}
        {hasDiagram && (
          <aside className="notebook-diagram" aria-label={diagramLabel}>
            <div className="notebook-diagram-sticky">
              {diagram}
            </div>
          </aside>
        )}
      </div>

      {/* Contenido secundario (Ejercicios, Ejemplos, Casos de uso) */}
      {secondary !== undefined && secondary !== null && (
        <section className="triptych-secondary mt-16" aria-label="Material práctico relacionado">
          <div className="triptych-secondary-inner">
            {secondary}
          </div>
        </section>
      )}
    </div>
  );
};
