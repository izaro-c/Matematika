import { useEffect, useMemo, useState } from 'react';
import type { DiagramTargetRegistry } from '../../core/editorTypes';
import { DiagramRepository } from '../persistence/repository';
import { buildTargets } from '../model/selectors';

export interface DiagramLinkTargetSource {
  componentName: string;
  path?: string;
  targets?: DiagramTargetRegistry;
}

const repository = new DiagramRepository();

export function usePageDiagramTargets(links: DiagramLinkTargetSource[]): { targets: DiagramTargetRegistry; loading: boolean; error: string | null } {
  const stableKey = links.map(link => `${link.componentName}:${link.path ?? ''}`).join('|');
  const request = useMemo(() => ({
    key: stableKey,
    savedTargets: links.flatMap(link => link.targets ?? []),
    readable: links.filter(link => link.path && !link.targets?.length),
  }), [links, stableKey]);
  const [state, setState] = useState<{ key: string; targets: DiagramTargetRegistry; loading: boolean; error: string | null }>({
    key: '', targets: [], loading: false, error: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    if (request.readable.length === 0) return () => controller.abort();
    Promise.all(request.readable.map(async link => {
      const result = await repository.readDiagram(link.path as string, controller.signal);
      return result.model ? buildTargets(result.model) : [];
    })).then(targets => {
      if (!controller.signal.aborted) setState({ key: request.key, targets: [...request.savedTargets, ...targets.flat()], loading: false, error: null });
    }).catch(error => {
      if (!controller.signal.aborted) setState({
        key: request.key, targets: request.savedTargets, loading: false,
        error: error instanceof Error ? error.message : String(error),
      });
    });
    return () => controller.abort();
  }, [request]);

  return useMemo(() => {
    if (request.readable.length === 0) return { targets: request.savedTargets, loading: false, error: null };
    return state.key === request.key ? state : { targets: request.savedTargets, loading: true, error: null };
  }, [request, state]);
}
