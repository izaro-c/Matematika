# `content/glossary/`

Glossary **data** (`dictionary.ts`: terms + `texSymbolMap`).

UI / stores stay in `src/lib` and `src/components` and re-export from here:

```ts
import { dictionary } from '@content/glossary/dictionary';
// or via @/lib helpers / GlossaryStore
```
