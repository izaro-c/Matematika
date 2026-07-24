import { useLayoutEffect, type RefObject } from 'react';
import type { InspectorNavigationIntent } from '../../diagnostics/inspectorNavigation';

const MAX_SCROLL_ATTEMPTS = 24;

function scrollToElement(target: Element): void {
  if (!('scrollIntoView' in target) || typeof target.scrollIntoView !== 'function') return;
  target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function focusFirstControl(container: Element): void {
  const focusable = container.querySelector<HTMLElement>(
    'input:not([type="hidden"]), select, textarea, button:not([disabled]), [tabindex]:not([tabindex="-1"])',
  );
  focusable?.focus({ preventScroll: true });
}

export function useInspectorFieldScroll(
  containerRef: RefObject<HTMLElement | null>,
  navigation: InspectorNavigationIntent | null | undefined,
  activeSection: string,
  selectedId: string,
): void {
  useLayoutEffect(() => {
    if (!navigation?.fieldKey || !containerRef.current) return;
    if (navigation.objectId && selectedId !== navigation.objectId) return;
    if (activeSection !== navigation.section) return;

    let attempts = 0;
    let frameId = 0;

    const tryScroll = () => {
      const root = containerRef.current;
      if (!root) return;

      const fieldTarget = root.querySelector(`[data-inspector-field="${navigation.fieldKey}"]`);
      if (fieldTarget) {
        scrollToElement(fieldTarget);
        focusFirstControl(fieldTarget);
        return;
      }

      if (attempts >= MAX_SCROLL_ATTEMPTS - 6) {
        const sectionTarget = root.querySelector(`[data-inspector-section="${navigation.section}"]`);
        if (sectionTarget) {
          scrollToElement(sectionTarget);
          return;
        }
      }

      if (attempts++ < MAX_SCROLL_ATTEMPTS) {
        frameId = requestAnimationFrame(tryScroll);
      }
    };

    frameId = requestAnimationFrame(tryScroll);
    return () => cancelAnimationFrame(frameId);
  }, [
    containerRef,
    navigation?.revision,
    navigation?.fieldKey,
    navigation?.objectId,
    navigation?.section,
    activeSection,
    selectedId,
  ]);
}
