export const contentLoaders = {
  mathLoaders: import.meta.glob('../../content/mathematicians/*.mdx'),
  mathMetas: import.meta.glob('../../content/mathematicians/*.mdx', { import: 'metadata', eager: true }),

  thmLoaders: import.meta.glob('../../content/theorems/*.mdx'),
  thmMetas: import.meta.glob('../../content/theorems/*.mdx', { import: 'metadata', eager: true }),

  lessonLoaders: import.meta.glob('../../content/lessons/*.mdx'),
  lessonMetas: import.meta.glob('../../content/lessons/*.mdx', { import: 'metadata', eager: true }),

  demoLoaders: import.meta.glob('../../content/demonstrations/*.mdx'),
  demoMetas: import.meta.glob('../../content/demonstrations/*.mdx', { import: 'metadata', eager: true }),

  defLoaders: import.meta.glob('../../content/definitions/*.mdx'),
  defMetas: import.meta.glob('../../content/definitions/*.mdx', { import: 'metadata', eager: true }),

  exampleLoaders: import.meta.glob('../../content/examples/*.mdx'),
  exampleMetas: import.meta.glob('../../content/examples/*.mdx', { import: 'metadata', eager: true }),

  exerciseLoaders: import.meta.glob('../../content/exercises/*.mdx'),
  exerciseMetas: import.meta.glob('../../content/exercises/*.mdx', { import: 'metadata', eager: true }),

  usecaseLoaders: import.meta.glob('../../content/usecases/*.mdx'),
  usecaseMetas: import.meta.glob('../../content/usecases/*.mdx', { import: 'metadata', eager: true }),

  planLoaders: import.meta.glob('../../content/plans/*.mdx'),
  planMetas: import.meta.glob('../../content/plans/*.mdx', { import: 'metadata', eager: true }),
};
