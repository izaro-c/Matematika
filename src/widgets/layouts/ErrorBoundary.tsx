import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Componente de límite de error (Error Boundary).
 * Captura excepciones no manejadas en los componentes hijos y muestra
 * una interfaz de fallback en lugar de romper toda la aplicación.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-viewport bg-lienzo flex items-center justify-center p-8 font-serif text-carbon">
          <div className="max-w-xl border-l-4 border-granada pl-6 py-4 bg-lienzo/50 shadow-sm">
            <h2 className="text-xl font-bold mb-2 text-granada">Error de renderizado</h2>
            <p className="text-carbon/70 mb-4">
              Ha ocurrido un problema al intentar mostrar esta página. Puede que el archivo contenga errores de sintaxis o referencias a componentes que no existen.
            </p>
            <pre className="text-xs bg-carbon/5 p-4 overflow-auto text-carbon/60 rounded">
              {this.state.error?.toString()}
            </pre>
            <div className="mt-4 flex gap-3">
              <button 
                className="ac-btn ac-btn-primary ac-interactive px-4 py-2 text-sm"
                onClick={() => window.location.reload()}
              >
                Reintentar
              </button>
              <a 
                href="/"
                className="ac-btn ac-btn-ghost ac-interactive px-4 py-2 text-sm"
              >
                Volver al inicio
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
