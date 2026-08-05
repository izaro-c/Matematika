import type { ThemeColorName } from './primitives';

/** Pigmentos usables en diagramas (todo menos el fondo lienzo). */
export type DiagramPaletteColorId = Exclude<ThemeColorName, 'lienzo'>;

/**
 * Paleta del inspector de diagramas — nombres UI + clases Tailwind.
 * Fuente canónica; el feature editor reexporta como PALETTE_TOKENS.
 */
export const DIAGRAM_PALETTE_TOKENS: {
  id: DiagramPaletteColorId;
  name: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
}[] = [
  { id: 'carbon', name: 'Negro', bgClass: 'bg-carbon', textClass: 'text-carbon', borderClass: 'border-carbon' },
  { id: 'pizarra', name: 'Morado', bgClass: 'bg-pizarra', textClass: 'text-pizarra', borderClass: 'border-pizarra' },
  { id: 'pavo', name: 'Azul', bgClass: 'bg-pavo', textClass: 'text-pavo', borderClass: 'border-pavo' },
  { id: 'musgo', name: 'Verde', bgClass: 'bg-musgo', textClass: 'text-musgo', borderClass: 'border-musgo' },
  { id: 'ocre', name: 'Amarillo', bgClass: 'bg-ocre', textClass: 'text-ocre', borderClass: 'border-ocre' },
  { id: 'salvia', name: 'Naranja', bgClass: 'bg-salvia', textClass: 'text-salvia', borderClass: 'border-salvia' },
  { id: 'terracota', name: 'Rojo', bgClass: 'bg-terracota', textClass: 'text-terracota', borderClass: 'border-terracota' },
  { id: 'granada', name: 'Rosa', bgClass: 'bg-granada', textClass: 'text-granada', borderClass: 'border-granada' },
];
