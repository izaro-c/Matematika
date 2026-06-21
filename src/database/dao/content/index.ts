import { ContentStore } from '@/database/dao/content/ContentStore';

export const db = new ContentStore();
export * from './types';
export { ContentStore };
