import { useEffect, useState } from 'react';
import { logger } from '../lib/logger';

interface UseContentOptions {
  notFoundTitle: string;
  type: string;
  id: string;
}

export function useContent<T>(
  fetcher: () => T | undefined,
  options: UseContentOptions
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const result = fetcher();
    if (result) {
      setData(result);
      setIsLoading(false);
    } else {
      logger.warn({ type: options.type, id: options.id, action: 'not-found' });
      setData(null);
      setIsLoading(false);
    }
  }, [options.id]);

  return { data, isLoading, notFound: !isLoading && !data, notFoundTitle: options.notFoundTitle };
}
