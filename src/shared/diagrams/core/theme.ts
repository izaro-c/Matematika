// ─── Paleta de tema para diagramas ──────────────────────────────────────────
// Tipo compartido entre MathBoard (que resuelve los valores desde las
// variables CSS `--theme-*`) y el resto del núcleo de diagramas (MathUtils,
// MathFactory, runtime), que solo consumen la forma del tema. Vive en su
// propio módulo para que ninguno de esos consumidores dependa de MathBoard.tsx
// y así evitar un ciclo de importación entre MathBoard y MathUtils.
export interface ThemeColors {
  carbon: string;
  terracota: string;
  salvia: string;
  lienzo: string;
  pizarra: string;
  ocre: string;
  pavo: string;
  granada: string;
  musgo: string;
}
