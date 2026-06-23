import { useMemo } from 'react';
import { logger } from '@/shared/lib/logger';

interface UseContentOptions {
  notFoundTitle: string;
  type: string;
  id: string;
}

export function useContent<T>(
  fetcher: () => T | undefined,
  options: UseContentOptions
) {
  const result = useMemo(() => {
    const r = fetcher();
    if (!r) {
      logger.warn({ type: options.type, id: options.id, action: 'not-found' });
    }
    return r ?? null;
  }, [options.id, options.type, fetcher]);

  return {
    data: result,
    isLoading: false,
    notFound: !result,
    notFoundTitle: options.notFoundTitle
  };
}
