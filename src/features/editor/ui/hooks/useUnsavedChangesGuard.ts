import { useEffect, useState } from 'react';

export interface UseUnsavedChangesGuardOptions {
  hasLocalChanges: boolean;
  openFile: (path: string, options?: { discardLocalChanges?: boolean }) => void;
  setLocation: (url: string) => void;
}

export function useUnsavedChangesGuard({
  hasLocalChanges,
  openFile,
  setLocation,
}: UseUnsavedChangesGuardOptions) {
  const [pendingFileNavigation, setPendingFileNavigation] = useState<string | null>(null);

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasLocalChanges) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [hasLocalChanges]);

  // Interceptar clicks globales para proteger la navegación interna (wouter)
  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      if (!hasLocalChanges) return;
      const target = event.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href) {
          // Si es una ruta interna o relativa:
          if (href.startsWith('/') || href.startsWith('#') || href.includes(window.location.host)) {
            event.preventDefault();
            event.stopPropagation();
            setPendingFileNavigation(href);
          }
        }
      }
    };
    window.addEventListener('click', handleGlobalClick, true);
    return () => window.removeEventListener('click', handleGlobalClick, true);
  }, [hasLocalChanges]);

  const continuePendingNavigation = () => {
    const target = pendingFileNavigation;
    setPendingFileNavigation(null);
    if (target) {
      if (target.startsWith('/') && !target.includes('database/content/')) {
        setLocation(target);
      } else {
        openFile(target, { discardLocalChanges: true });
      }
    }
  };

  const cancelPendingNavigation = () => {
    setPendingFileNavigation(null);
  };

  return {
    pendingFileNavigation,
    setPendingFileNavigation,
    continuePendingNavigation,
    cancelPendingNavigation,
  };
}
