/** @type {import('dependency-cruiser').IConfiguration} */
export default {
  forbidden: [
    /* -- FSD (Feature-Sliced Design) Architecture rules -- */

    /*
     * shared/ — no debe importar de capas superiores.
     * Las tres exclusiones de origen son deuda conocida y acotada. Las reglas
     * siguientes limitan su alcance para que la excepción no pueda crecer.
     */
    {
      name: 'fsd-shared-no-upper-layers',
      comment: 'shared/ must not import from app, pages, widgets, features, entities',
      severity: 'warn',
      from: {
        path: '^src/shared/',
        pathNot: [
          '^src/shared/ui/MDXBlocks\\.tsx$',
          '^src/shared/ui/ModelBadge\\.tsx$',
          '^src/shared/ui/MaterialPracticoSection\\.tsx$',
        ],
      },
      to: { path: '^src/(app|pages|widgets|features|entities)/' },
    },
    /* Excepción acotada: MDXBlocks compone bloques de features y widgets. */
    {
      name: 'fsd-mdxblocks-composition-scope',
      comment: 'MDXBlocks may compose features and widgets, but must not expand to app, pages, or entities',
      severity: 'warn',
      from: { path: '^src/shared/ui/MDXBlocks\\.tsx$' },
      to: { path: '^src/(app|pages|entities)/' },
    },
    /* Excepciones acotadas: cada shim solo puede re-exportar su destino legado. */
    {
      name: 'fsd-model-badge-shim-scope',
      comment: 'ModelBadge shim may only re-export features/graph/ui/ModelBadge',
      severity: 'warn',
      from: { path: '^src/shared/ui/ModelBadge\\.tsx$' },
      to: {
        path: '^src/(app|pages|widgets|features|entities)/',
        pathNot: '^src/features/graph/ui/ModelBadge\\.tsx$',
      },
    },
    {
      name: 'fsd-material-practico-shim-scope',
      comment: 'MaterialPracticoSection shim may only re-export widgets/content/MaterialPracticoSection',
      severity: 'warn',
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
      comment: 'features/ must not import from pages or app (warn: shared contexts live in app/)',
      severity: 'warn',
      from: { path: '^src/features/' },
      to: { path: '^src/(pages|app)/' },
    },

    /* widgets/ — no debe importar de features/ según el contrato actual */
    {
      name: 'fsd-widgets-no-features',
      comment: 'widgets/ must not import from features/ (should use composition)',
      severity: 'warn',
      from: { path: '^src/widgets/' },
      to: { path: '^src/features/' },
    },

    /* pages/ — puede importar dentro de su propia slice, no desde otras pages */
    {
      name: 'fsd-pages-no-cross-imports',
      comment: 'pages/ must not import from another page slice',
      severity: 'warn',
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
      severity: 'warn',
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
      severity: 'warn',
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
