import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReferencePickSession } from './referencePickTypes';
import { ReferencePickContext } from './useReferencePick';

export const ReferencePickProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<ReferencePickSession | null>(null);
  const [rejectMessage, setRejectMessage] = useState<string | null>(null);

  const clearPick = useCallback(() => {
    setSession(null);
    setRejectMessage(null);
  }, []);

  const beginPick = useCallback((next: ReferencePickSession) => {
    setRejectMessage(null);
    setSession(next);
  }, []);

  const handleCanvasId = useCallback((id: string) => {
    if (!session) return false;
    if (session.allowedIds.includes(id)) {
      session.onPick(id);
      setSession(null);
      setRejectMessage(null);
      return true;
    }
    session.onReject?.(id);
    setRejectMessage('Ese objeto no es válido para esta relación.');
    return true;
  }, [session]);

  useEffect(() => {
    if (!session) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        clearPick();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [session, clearPick]);

  const value = useMemo(() => ({
    session,
    rejectMessage,
    beginPick,
    clearPick,
    handleCanvasId,
  }), [session, rejectMessage, beginPick, clearPick, handleCanvasId]);

  return (
    <ReferencePickContext.Provider value={value}>
      {children}
    </ReferencePickContext.Provider>
  );
};

export default ReferencePickProvider;
