/**
 * El editor solo existe en desarrollo, o en un build con `VITE_ENABLE_EDITOR=true`.
 * `AppRouter.tsx` repite esta condición en línea junto al `import()` del editor: Rolldown
 * solo descarta el chunk (y Monaco) si ve la condición en el mismo módulo. Mantenerlas iguales.
 */
export const EDITOR_ENABLED: boolean =
  import.meta.env.DEV || import.meta.env.VITE_ENABLE_EDITOR === 'true';
