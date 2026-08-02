/** @type {import('dependency-cruiser').IConfiguration} */
export default {
  forbidden: [
    /* -- src + content architecture -- */

    {
      name: 'src-design-no-upper',
      comment: 'design must not import pages, data, diagrams, or other product domains',
      severity: 'error',
      from: { path: '^src/design/' },
      to: {
        path: '^src/(fixed-pages|content-pages|data|diagrams|app)/',
      },
    },
    {
      name: 'src-design-no-diagrams',
      comment: 'design must not import diagrams engine',
      severity: 'error',
      from: { path: '^src/design/' },
      to: { path: '^src/diagrams/' },
    },
    {
      name: 'src-lib-no-pages',
      comment: 'lib must not import fixed-pages, content-pages, or app',
      severity: 'error',
      from: { path: '^src/lib/' },
      to: { path: '^src/(fixed-pages|content-pages|app)/' },
    },
    {
      name: 'src-components-no-pages',
      comment: 'components must not import page domains (MDXBlocks may compose exercise blocks)',
      severity: 'error',
      from: {
        path: '^src/components/',
        pathNot: '^src/components/mdx/MDXBlocks\\.tsx$',
      },
      to: { path: '^src/(fixed-pages|content-pages|app)/' },
    },
    {
      name: 'src-mdxblocks-content-pages',
      comment: 'MDXBlocks may compose exercise MDX blocks from content-pages only',
      severity: 'error',
      from: { path: '^src/components/mdx/MDXBlocks\\.tsx$' },
      to: {
        path: '^src/content-pages/',
        pathNot: '^src/content-pages/exercise/',
      },
    },
    {
      name: 'src-data-no-pages',
      comment: 'data must not import pages or app',
      severity: 'error',
      from: { path: '^src/data/' },
      to: { path: '^src/(fixed-pages|content-pages|app)/' },
    },
    {
      name: 'src-fixed-content-pages-isolation',
      comment: 'fixed-pages and content-pages must not import each other',
      severity: 'error',
      from: { path: '^src/fixed-pages/' },
      to: { path: '^src/content-pages/' },
    },
    {
      name: 'src-content-pages-no-fixed',
      comment: 'content-pages must not import fixed-pages',
      severity: 'error',
      from: { path: '^src/content-pages/' },
      to: { path: '^src/fixed-pages/' },
    },
    {
      name: 'content-diagrams-no-editor',
      comment: 'content/diagrams must not import editor; use @/diagrams',
      severity: 'error',
      from: { path: '^content/diagrams/' },
      to: { path: '^src/fixed-pages/editor/' },
    },
    {
      name: 'content-diagrams-no-app-pages',
      comment: 'content/diagrams must not import app or page domains',
      severity: 'error',
      from: { path: '^content/diagrams/' },
      to: { path: '^src/(fixed-pages|content-pages|app)/' },
    },
    {
      name: 'content-no-app-pages',
      comment: 'authored content/ may use diagrams/lib/components/design/data; not app or page domains',
      severity: 'error',
      from: { path: '^content/' },
      to: { path: '^src/(app|fixed-pages|content-pages)/' },
    },
    {
      name: 'diagrams-model-geometry-no-render',
      comment: 'diagrams model/geometry must not import jsxgraph or render',
      severity: 'error',
      from: { path: '^src/diagrams/(model|geometry)/' },
      to: { path: '^src/diagrams/(jsxgraph|render)/' },
    },
    {
      name: 'editor-diagrams-model-no-ui',
      comment: 'editor diagram model must not import workbench UI',
      severity: 'error',
      from: { path: '^src/fixed-pages/editor/diagrams/model/' },
      to: { path: '^src/fixed-pages/editor/diagrams/ui/' },
    },

    /* -- General quality rules -- */

    {
      name: 'not-to-test',
      comment: 'Production code should not depend on test code',
      severity: 'error',
      from: { path: '^src/' },
      to: { path: '^tests/' },
    },
    {
      name: 'no-circular',
      severity: 'error',
      from: {},
      to: { circular: true },
    },
    {
      name: 'no-orphans',
      comment: 'Detect modules with no incoming or outgoing dependencies (dead code)',
      severity: 'warn',
      from: { orphan: true },
      to: {},
    },
    {
      name: 'not-to-unresolvable',
      comment: 'Detect imports that cannot be resolved to files on disk',
      severity: 'error',
      from: {},
      to: { couldNotResolve: true },
    },
    {
      name: 'not-to-dev-dep',
      comment: 'Production code should not depend on devDependencies',
      severity: 'error',
      from: { path: '^src/' },
      to: { dependencyTypes: ['npm-dev'] },
    },
  ],

  options: {
    doNotFollow: {
      path: ['node_modules', 'dist'],
    },
    exclude: {
      path: [],
    },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: 'tsconfig.app.json',
    },
    reporterOptions: {
      text: {
        highlightFocused: true,
      },
    },
    moduleSystems: ['es6', 'cjs'],
    exoticRequireStrings: ['want', 'tryRequire'],
  },
};
