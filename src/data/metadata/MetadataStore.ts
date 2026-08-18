import { create } from 'zustand';
import { Difficulty } from '../content';

export interface PageMetadata {
  id?: string;
  title?: string;
  type?: string;
  domain?: string;
  author?: string[];
  difficulty?: Difficulty;
  tags?: string[];
  tableOfContents?: { id: string; title: string; level: number }[];
  date?: string;
  description?: string;
  lemmas?: { id: string; title: string }[];
  corollaries?: { id: string; title: string }[];
  demos?: { id: string; title: string }[];
  leanVerified?: boolean;
  verificationStatus?: string;
  foundation?: string;
}

interface MetadataState {
  metadata: PageMetadata | null;
  setMetadata: (metadata: PageMetadata | null) => void;
}

export const useMetadataStore = create<MetadataState>((set) => ({
  metadata: null,
  setMetadata: (metadata) => set({ metadata }),
}));
