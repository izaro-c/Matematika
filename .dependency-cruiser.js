/** @type {import('dependency-cruiser').IConfiguration} */
export default {
  forbidden: [
    /* -- BCED Architecture rules (ArchUnit equivalent) -- */

    /* E: Entity — domain logic, must not depend on any other layer */
    {
      name: 'bced-entity-no-external-deps',
      comment: 'Entity layer must not depend on boundary, controller, or database',
      severity: 'error',
      from: { path: '^src/entity/' },
      to: { path: '^src/(boundary|controller|database)/' }
    },

    /* D: Database — must not depend on boundary or controller */
    {
      name: 'bced-database-no-boundary',
      comment: 'Database layer must not depend on boundary (UI)',
      severity: 'error',
      from: { path: '^src/database/' },
      to: { path: '^src/boundary/' }
    },
    {
      name: 'bced-database-no-controller',
      comment: 'Database layer must not depend on controller',
      severity: 'error',
      from: { path: '^src/database/' },
      to: { path: '^src/controller/' }
    },

    /* C: Controller — must not depend on boundary */
    {
      name: 'bced-controller-no-boundary',
      comment: 'Controller layer must not depend on boundary (UI)',
      severity: 'error',
      from: { path: '^src/controller/' },
      to: { path: '^src/boundary/' }
    },

    /* B: Boundary — must not depend directly on entity or database (should go through controller) */
    {
      name: 'bced-boundary-no-entity',
      comment: 'Boundary (UI) must not depend directly on entity; use controller',
      severity: 'error',
      from: { path: '^src/boundary/' },
      to: { path: '^src/entity/' }
    },
    {
      name: 'bced-boundary-no-database',
      comment: 'Boundary (UI) should not depend directly on database; use controller',
      severity: 'warn',
      from: { path: '^src/boundary/' },
      to: { path: '^src/database/' }
    },

    /* -- General quality rules -- */

    /* Los tests NO deben importarse desde código de producción */
    {
      name: 'not-to-test',
      comment: 'Production code should not depend on test code',
      severity: 'error',
      from: { path: '^src/' },
      to: { path: '^tests/' }
    },

    /* No dependencias circulares */
    {
      name: 'no-circular',
      severity: 'warn',
      from: {},
      to: { circular: true }
    },

    /* No módulos huérfanos */
    {
      name: 'no-orphans',
      comment: 'Detect modules with no incoming or outgoing dependencies (dead code)',
      severity: 'warn',
      from: { orphan: true },
      to: {}
    },

    /* No dependencias no resueltas */
    {
      name: 'not-to-unresolvable',
      comment: 'Detect imports that cannot be resolved to files on disk',
      severity: 'error',
      from: {},
      to: { couldNotResolve: true }
    },

    /* No importar devDependencies desde código de producción */
    {
      name: 'not-to-dev-dep',
      comment: 'Production code should not depend on devDependencies',
      severity: 'error',
      from: { path: '^src/' },
      to: { dependencyTypes: ['npm-dev'] }
    },
  ],

  options: {
    doNotFollow: {
      path: ['node_modules', 'dist']
    },

    /* Usar webpack-like resolution para los alias de tsconfig (@/ -> src/) */
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default']
    },

    /* Resolver imports de TypeScript */
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: 'tsconfig.app.json'
    },

    /* Reporteros */
    reporterOptions: {
      text: {
        highlightFocused: true
      }
    },

    /* Extensiones a considerar */
    moduleSystems: ['es6', 'cjs'],
    exoticRequireStrings: ['want', 'tryRequire']
  }
}
