/**
 * Nombres canónicos de clases del design system Arts & Crafts.
 * Usar en componentes React cuando la composición no basta con CSS puro.
 */

export const UI = {
  eyebrow: 'ac-eyebrow',
  eyebrowSm: 'ac-eyebrow ac-eyebrow--sm',
  eyebrowXs: 'ac-eyebrow ac-eyebrow--xs',
  eyebrowMuted: 'ac-eyebrow ac-eyebrow--muted',
  eyebrowAccent: 'ac-eyebrow ac-eyebrow--accent',

  label: 'ac-label',
  labelSm: 'ac-label ac-label--sm',
  labelXs: 'ac-label ac-label--xs',
  label2xs: 'ac-label ac-label--2xs',
  labelMd: 'ac-label ac-label--md',
  labelMuted: 'ac-label ac-label--sm ac-label--muted',
  labelSoft: 'ac-label ac-label--sm ac-label--soft',
  labelStrong: 'ac-label ac-label--sm ac-label--strong',
  labelSalvia: 'ac-label ac-label--sm ac-label--salvia',
  labelPavo: 'ac-label ac-label--sm ac-label--pavo',
  labelOcre: 'ac-label ac-label--sm ac-label--ocre',
  labelPizarra: 'ac-label ac-label--sm ac-label--pizarra',
  labelTerracota: 'ac-label ac-label--sm ac-label--terracota',

  fieldsetLegend: 'ac-fieldset-legend',
  meta: 'ac-meta',
  codeInline: 'ac-code-inline',

  page: 'ac-page',
  pageTextured: 'ac-page ac-page--textured',
  surfaceMuted: 'ac-surface-muted',

  interactive: 'ac-interactive',
  btn: 'ac-btn ac-interactive',
  btnPrimary: 'ac-btn ac-btn-primary ac-interactive',
  btnGhost: 'ac-btn ac-btn-ghost ac-interactive',
  btnAccent: 'ac-btn ac-btn-accent ac-interactive',
  link: 'ac-link ac-interactive',
  linkBack: 'ac-link-back ac-interactive',
  breadcrumbs: 'ac-breadcrumbs',
  breadcrumbsLink: 'ac-breadcrumbs__link ac-interactive',
  breadcrumbsSep: 'ac-breadcrumbs__sep',
  breadcrumbsCurrent: 'ac-breadcrumbs__current',
  breadcrumbsEllipsis: 'ac-breadcrumbs__ellipsis',

  ctaCard: 'ac-cta-card ac-interactive',
  ctaCardHero: 'ac-cta-card ac-cta-card--hero ac-interactive',
  ctaEyebrow: 'ac-cta-card__eyebrow',
  ctaTitle: 'ac-cta-card__title',
  ctaAction: 'ac-cta-card__action',

  editorShell: 'ac-editor-shell',
  editorPanel: 'ac-editor-panel',
  editorBadgeTerracota: 'ac-editor-badge ac-editor-badge--terracota',
  editorBadgeLayer: 'ac-editor-badge ac-editor-badge--layer',
  stickyShadowEnd: 'ac-sticky-shadow-end',
  insetShadow: 'ac-inset-shadow',
  insetShadowSm: 'ac-inset-shadow-sm',
  elevationFloat: 'ac-elevation-float',

  tabularNums: 'tabular-nums',
  textBalance: 'text-balance',
  textPretty: 'text-pretty',
  minViewport: 'min-h-viewport',
} as const;

export type UIClassName = (typeof UI)[keyof typeof UI];
