import type { DiagramColorToken } from '@/shared/diagrams/spec';

export const PALETTE_TOKENS: {
  id: DiagramColorToken;
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
