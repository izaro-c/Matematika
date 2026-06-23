export const contentLoaders = {
  mathLoaders: import.meta.glob('../../database/content/mathematicians/*.mdx'),

  thmLoaders: import.meta.glob('../../database/content/theorems/*.mdx'),

  lessonLoaders: import.meta.glob('../../database/content/lessons/*.mdx'),

  demoLoaders: import.meta.glob('../../database/content/demonstrations/*.mdx'),

  defLoaders: import.meta.glob('../../database/content/definitions/*.mdx'),

  exampleLoaders: import.meta.glob('../../database/content/examples/*.mdx'),

  exerciseLoaders: import.meta.glob('../../database/content/exercises/*.mdx'),

  usecaseLoaders: import.meta.glob('../../database/content/usecases/*.mdx'),

  planLoaders: import.meta.glob('../../database/content/plans/*.mdx'),

  axiomLoaders: import.meta.glob('../../database/content/axioms/*.mdx'),

  axiomaticSystemLoaders: import.meta.glob('../../database/content/axiomatic-systems/*.mdx'),

  modelLoaders: import.meta.glob('../../database/content/models/*.mdx'),
};
