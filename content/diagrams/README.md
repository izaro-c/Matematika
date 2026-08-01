# `content/diagrams/` — published demos

Interactive diagram components bound to MDX pages in `content/mdx/`.

## Layout

```
Axiomas/  Definiciones/  Teoremas/  Demos/
Models/   Metodos/       Ejercicios/ CasosUso/
```

## Imports

Demos import the engine and UI helpers only through `@2`:

| Need | Import |
|---|---|
| Spec + renderer | `@/diagrams/public` |
| MathBoard / MathFactory | `@/diagrams/core/*` |
| Theme / targets | `@/diagrams/core/MathUtils` or this barrel |
| Math store / steps | `@/lib/helpers/*`, `@/components/ui/*` |

**Do not** import `@/fixed-pages/editor`, `@/diagrams`, or app pages.

## Consumer import path

```ts
import { Pitagoras } from '@content/diagrams/Teoremas/Pitagoras';
```

Alias: `@content` → `content/` (Vite, Vitest, `tsconfig.app.json`).

Legacy `@content/diagrams/*` are thin re-export shims during the strangler; prefer `@content/diagrams`.

## Engine vs demos

| Concern | Location |
|---|---|
| Spec, renderer, MathBoard | `src/diagrams` (`@/diagrams`) |
| Published demos (this tree) | `content/diagrams` |
| Editor / workbench | `src/fixed-pages/editor` (does not live here) |
