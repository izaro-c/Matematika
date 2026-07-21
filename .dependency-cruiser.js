/** @type {import('dependency-cruiser').IConfiguration} */
export default {
  forbidden: [
    /* -- FSD (Feature-Sliced Design) Architecture rules -- */

    /*
     * shared/ — no debe importar de capas superiores.
     * La exclusión MaterialPracticoSection es deuda de shim de re-exportación acotada.
     */
    {
      name: 'fsd-shared-no-upper-layers',
      comment: 'shared/ must not import from app, pages, widgets, features, entities',
      severity: 'error',
      from: {
        path: '^src/shared/',
        pathNot: [
          '^src/shared/ui/MaterialPracticoSection\\.tsx$',
        ],
      },
      to: { path: '^src/(app|pages|widgets|features|entities)/' },
    },
    /* Excepción acotada: MDXBlocks compone bloques de features y widgets. */
    {
      name: 'fsd-mdxblocks-composition-scope',
      comment: 'MDXBlocks may compose features and widgets, but must not expand to app, pages, or entities',
      severity: 'error',
      from: { path: '^src/widgets/mdx/MDXBlocks\\.tsx$' },
      to: { path: '^src/(app|pages|entities)/' },
    },
    /* Excepción acotada: cada shim solo puede re-exportar su destino legado. */
    {
      name: 'fsd-material-practico-shim-scope',
      comment: 'MaterialPracticoSection shim may only re-export widgets/content/MaterialPracticoSection',
      severity: 'error',
      from: { path: '^src/shared/ui/MaterialPracticoSection\\.tsx$' },
      to: {
        path: '^src/(app|pages|widgets|features|entities)/',
        pathNot: '^src/widgets/content/MaterialPracticoSection\\.tsx$',
      },
    },

    /* entities/ — dominio puro, no debe importar UI ni estado */
    {
      name: 'fsd-entities-no-ui',
      comment: 'entities/ must not import from pages, widgets, features, app',
      severity: 'error',
      from: { path: '^src/entities/' },
      to: { path: '^src/(pages|widgets|features|app)/' },
    },

    /* features/ — no debe importar de app/ o pages/ */
    {
      name: 'fsd-features-no-upper-layers',
      comment: 'features/ must not import from pages or app',
      severity: 'error',
      from: { path: '^src/features/' },
      to: { path: '^src/(pages|app)/' },
    },

    /* widgets/ — no debe importar de features/ salvo el registro de composición MDXBlocks */
    {
      name: 'fsd-widgets-no-features',
      comment: 'widgets/ must not import from features/ (should use composition)',
      severity: 'error',
      from: {
        path: '^src/widgets/',
        pathNot: '^src/widgets/mdx/MDXBlocks\\.tsx$',
      },
      to: { path: '^src/features/' },
    },

    /* pages/ — puede importar dentro de su propia slice, no desde otras pages */
    {
      name: 'fsd-pages-no-cross-imports',
      comment: 'pages/ must not import from another page slice',
      severity: 'error',
      from: { path: '^src/pages/([^/]+)(?:/|\\.[^/]+$)' },
      to: {
        path: '^src/pages/',
        pathNot: '^src/pages/$1(?:/|\\.[^/]+$)',
      },
    },

    /* features/ — puede importar dentro de su slice, no desde otra feature */
    {
      name: 'fsd-features-cross-imports',
      comment: 'features/ must not import from another feature slice',
      severity: 'error',
      from: { path: '^src/features/([^/]+)/' },
      to: {
        path: '^src/features/',
        pathNot: '^src/features/$1(?:/|$)',
      },
    },

    /* -- General quality rules -- */

    /* Los tests NO deben importarse desde código de producción */
    {
      name: 'not-to-test',
      comment: 'Production code should not depend on test code',
      severity: 'error',
      from: { path: '^src/' },
      to: { path: '^tests/' },
    },

    /* No dependencias circulares */
    {
      name: 'no-circular',
      severity: 'error',
      from: {},
      to: { circular: true },
    },

    /* No módulos huérfanos */
    {
      name: 'no-orphans',
      comment: 'Detect modules with no incoming or outgoing dependencies (dead code)',
      severity: 'warn',
      from: { orphan: true },
      to: {},
    },

    /* No dependencias no resueltas */
    {
      name: 'not-to-unresolvable',
      comment: 'Detect imports that cannot be resolved to files on disk',
      severity: 'error',
      from: {},
      to: { couldNotResolve: true },
    },

    /* No importar devDependencies desde código de producción */
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
      path: [
        '^src/boundary/',
        '^src/controller/',
        '^src/entity/',
      ],
    },

    /* Usar webpack-like resolution para los alias de tsconfig (@/ -> src/) */
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
    },

    /* Resolver imports de TypeScript */
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: 'tsconfig.app.json',
    },

    /* Reporteros */
    reporterOptions: {
      text: {
        highlightFocused: true,
      },
    },

    /* Extensiones a considerar */
    moduleSystems: ['es6', 'cjs'],
    exoticRequireStrings: ['want', 'tryRequire'],
  },
};
