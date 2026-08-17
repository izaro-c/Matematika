import { describe, it, expect } from 'vitest';
import {
  resolveBranchCode,
  getItemBranchCodes,
  buildBranchTaxonomy,
  getItemsByBranch,
  getMscName,
  mscHierarchy,
} from '@/data/content/msc2020';
import { db } from '@/data/content';
import { getMetadataFields, BRANCH_OPTIONS } from '@/fixed-pages/editor/metadata/metadataFields';

describe('MSC2020 Branch Taxonomy & Multilingual Resolution', () => {
  describe('resolveBranchCode', () => {
    it('resolves direct numeric MSC codes', () => {
      expect(resolveBranchCode('51')).toBe('51');
      expect(resolveBranchCode('51M')).toBe('51M');
      expect(resolveBranchCode('51m')).toBe('51M');
      expect(resolveBranchCode('03')).toBe('03');
      expect(resolveBranchCode('15A')).toBe('15A');
    });

    it('resolves Spanish and Basque branch names and slugs', () => {
      expect(resolveBranchCode('geometria-y-topologia')).toBe('geometria-y-topologia');
      expect(resolveBranchCode('geometria')).toBe('51');
      expect(resolveBranchCode('geometría')).toBe('51');
      expect(resolveBranchCode('triangeluak')).toBe('51M');
      expect(resolveBranchCode('azalerak')).toBe('51M');
      expect(resolveBranchCode('logika')).toBe('03');
      expect(resolveBranchCode('aljebra')).toBe('15');
    });
  });

  describe('getItemBranchCodes', () => {
    it('prioritizes direct branch property over tags', () => {
      const item = {
        id: 'test-1',
        slug: 'test-1',
        branch: '51M',
        tags: ['algebra', '15'],
      };
      const codes = getItemBranchCodes(item);
      expect(codes).toContain('51M');
      expect(codes).toContain('15');
    });

    it('handles multiple branches array', () => {
      const item = {
        id: 'test-2',
        slug: 'test-2',
        branches: ['51A', '51M'],
      };
      const codes = getItemBranchCodes(item);
      expect(codes).toEqual(['51A', '51M']);
    });

    it('falls back to tags if branch is not provided', () => {
      const item = {
        id: 'test-3',
        slug: 'test-3',
        tags: ['geometria', 'triangulos'],
      };
      const codes = getItemBranchCodes(item);
      expect(codes).toContain('51');
      expect(codes).toContain('51M');
    });
  });

  describe('buildBranchTaxonomy & getItemsByBranch with Euskera and Spanish content', () => {
    it('classifies direct branch 51M items under 51M', () => {
      const taxonomyEu = db.getBranchTaxonomy('51M', 'eu');
      expect(taxonomyEu.id).toBe('51M');
      expect(taxonomyEu.name).toBe(getMscName('51M', 'eu'));

      const directItemIds = taxonomyEu.directItems.map(d => d.item.id);
      expect(directItemIds).toContain('teorema-pitagoras');
      expect(directItemIds).toContain('triangulo');
    });

    it('classifies 51M items as sub-branch under parent branch 51', () => {
      const taxonomyEu = db.getBranchTaxonomy('51', 'eu');
      expect(taxonomyEu.id).toBe('51');
      expect(taxonomyEu.subBranches.some(s => s.slug === '51M')).toBe(true);

      const itemsUnder51 = taxonomyEu.directItems;
      const pitagorasEntry = itemsUnder51.find(d => d.item.id === 'teorema-pitagoras');
      expect(pitagorasEntry).toBeDefined();
      expect(pitagorasEntry?.subBranchSlug).toBe('51M');
    });

    it('returns items by branch in Euskera via getItemsByBranch', () => {
      const items51M = db.getItemsByBranch('51M', 'eu');
      const ids = items51M.map(entry => entry.item.id);
      expect(ids).toContain('teorema-pitagoras');
      expect(ids).toContain('triangulo');
      expect(ids).toContain('ejercicio-pitagoras-cateto');
    });

    it('returns items by branch in Spanish via getItemsByBranch', () => {
      const items51M = db.getItemsByBranch('51M', 'es');
      const ids = items51M.map(entry => entry.item.id);
      expect(ids).toContain('teorema-pitagoras');
      expect(ids).toContain('triangulo');
      expect(ids).toContain('ejercicio-pitagoras-cateto');
    });
  });

  describe('Editor Metadata Fields for Branch Assignment', () => {
    it('includes branch in common metadata fields for all types', () => {
      const types = ['teorema', 'definicion', 'metodo', 'axioma', 'ejercicio', 'modelo', 'matematico'];
      for (const type of types) {
        const fields = getMetadataFields(type);
        const branchField = fields.find(f => f.key === 'branch');
        expect(branchField).toBeDefined();
        expect(branchField?.type).toBe('select');
        expect(branchField?.options).toBeDefined();
        expect(branchField?.options?.length).toBeGreaterThan(10);
      }
    });

    it('BRANCH_OPTIONS contains core MSC2020 codes', () => {
      const codes = BRANCH_OPTIONS.map(o => o.value);
      expect(codes).toContain('51');
      expect(codes).toContain('51M');
      expect(codes).toContain('51A');
      expect(codes).toContain('03');
      expect(codes).toContain('15');
      expect(codes).toContain('26');
      expect(codes).toContain('geometria-y-topologia');
    });
  });
});
