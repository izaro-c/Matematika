export const contentLoaders = {
  mathLoaders: import.meta.glob('../../content/mathematicians/*.mdx'),

  thmLoaders: import.meta.glob('../../content/theorems/*.mdx'),

  lessonLoaders: import.meta.glob('../../content/lessons/*.mdx'),

  demoLoaders: import.meta.glob('../../content/demonstrations/*.mdx'),

  defLoaders: import.meta.glob('../../content/definitions/*.mdx'),

  exampleLoaders: import.meta.glob('../../content/examples/*.mdx'),

  exerciseLoaders: import.meta.glob('../../content/exercises/*.mdx'),

  usecaseLoaders: import.meta.glob('../../content/usecases/*.mdx'),

  planLoaders: import.meta.glob('../../content/plans/*.mdx'),

  axiomLoaders: import.meta.glob('../../content/axioms/*.mdx'),

  axiomaticSystemLoaders: import.meta.glob('../../content/axiomatic-systems/*.mdx'),

  modelLoaders: import.meta.glob('../../content/models/*.mdx'),
};
