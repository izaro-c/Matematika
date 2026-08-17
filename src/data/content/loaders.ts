/**
 * Vite `import.meta.glob` loaders for authored MDX under `content/mdx/`.
 * Supports both root categories (e.g. `content/mdx/theorems/*.mdx`)
 * and language-subfolders (e.g. `content/mdx/eu/theorems/*.mdx`, `content/mdx/es/theorems/*.mdx`).
 * Paths are relative to this file (`src/data/content/loaders.ts`).
 */
export const contentLoaders = {
  mathLoaders: import.meta.glob('../../../content/mdx/**/mathematicians/*.mdx'),
  thmLoaders: import.meta.glob('../../../content/mdx/**/theorems/*.mdx'),
  methodLoaders: import.meta.glob('../../../content/mdx/**/methods/*.mdx'),
  demoLoaders: import.meta.glob('../../../content/mdx/**/demonstrations/*.mdx'),
  defLoaders: import.meta.glob('../../../content/mdx/**/definitions/*.mdx'),
  exampleLoaders: import.meta.glob('../../../content/mdx/**/examples/*.mdx'),
  exerciseLoaders: import.meta.glob('../../../content/mdx/**/exercises/*.mdx'),
  usecaseLoaders: import.meta.glob('../../../content/mdx/**/usecases/*.mdx'),
  planLoaders: import.meta.glob('../../../content/mdx/**/plans/*.mdx'),
  axiomLoaders: import.meta.glob('../../../content/mdx/**/axioms/*.mdx'),
  axiomaticSystemLoaders: import.meta.glob('../../../content/mdx/**/axiomatic-systems/*.mdx'),
  modelLoaders: import.meta.glob('../../../content/mdx/**/models/*.mdx'),
};
