/** @type {import('dependency-cruiser').IConfiguration} */
export default {
  forbidden: [
    /* -- FSD (Feature-Sliced Design) Architecture rules -- */

    /* shared/ — no debe importar de capas superiores (warn: algunos componentes son domain-aware) */
    {
      name: 'fsd-shared-no-upper-layers',
      comment: 'shared/ must not import from pages, widgets, features, entities',
      severity: 'warn',
      from: { path: '^src/shared/', pathNot: '^src/shared/ui/(MDXBlocks|ModelBadge|MaterialPracticoSection)' },
      to: { path: '^src/(pages|widgets|features|entities)/' },
    },
    /* Excepción: MDXBlocks es el composition root de MDX, necesita importar todo */
    {
      name: 'fsd-exception-mdxblocks',
      comment: 'MDXBlocks is the MDX composition root — cross-layer imports are by design',
      severity: 'warn',
      from: { path: '^src/shared/ui/MDXBlocks' },
      to: { path: '^src/' },
    },
    /* Excepción: shims que re-exportan desde features/widgets/entities */
    {
      name: 'fsd-exception-shims',
      comment: 'Cross-layer shim re-exports are intentional',
      severity: 'warn',
      from: { path: '^src/shared/ui/(ModelBadge|MaterialPracticoSection)' },
      to: { path: '^src/' },
    },

    /* entities/ — dominio puro, no debe importar UI ni estado */
    {
      name: 'fsd-entities-no-ui',
      comment: 'entities/ must not import from pages, widgets, features, app',
      severity: 'error',
      from: { path: '^src/entities/' },
      to: { path: '^src/(pages|widgets|features|app)/' },
    },

    /* features/ — no debe importar de pages/ o widgets/, solo entities y shared */
    {
      name: 'fsd-features-no-upper-layers',
      comment: 'features/ must not import from pages or app (warn: shared contexts live in app/)',
      severity: 'warn',
      from: { path: '^src/features/' },
      to: { path: '^src/(pages|app)/' },
    },

    /* widgets/ — no debe importar de pages/ o features/ */
    {
      name: 'fsd-widgets-no-features',
      comment: 'widgets/ must not import from features/ (should use composition)',
      severity: 'warn',
      from: { path: '^src/widgets/' },
      to: { path: '^src/features/' },
    },

    /* pages/ — no debe importar de otras pages/ */
    {
      name: 'fsd-pages-no-cross-imports',
      comment: 'pages/ should not import from other pages/',
      severity: 'warn',
      from: { path: '^src/pages/' },
      to: { path: '^src/pages/' },
    },

    /* Cross-feature imports should be avoided */
    {
      name: 'fsd-features-cross-imports',
      comment: 'features/ should minimize cross-feature imports',
      severity: 'warn',
      from: { path: '^src/features/' },
      to: { path: '^src/features/' },
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
