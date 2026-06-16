const fs = require('fs');

// App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace('import { MDXBlocks } from \'./components/ui/MDXBlocks\';', 'import { MDXComponents } from \'./components/ui/MDXBlocks\';');
appContent = appContent.replace('components={MDXBlocks}', 'components={MDXComponents}');
fs.writeFileSync('src/App.tsx', appContent);

// MarginaliaPanel.tsx
let margContent = fs.readFileSync('src/components/content/MarginaliaPanel.tsx', 'utf8');
margContent = margContent.replace('dictionary[activeTerm] as TermData', 'dictionary[activeTerm] as any as TermData');
margContent = margContent.replace('const e = entity as Record<string, unknown>;', 'const e = entity as any;');
fs.writeFileSync('src/components/content/MarginaliaPanel.tsx', margContent);

// SimSection.tsx
let simContent = fs.readFileSync('src/components/content/SimSection.tsx', 'utf8');
simContent = simContent.replace('if (container) observer.unobserve(container);', 'if (containerRef.current) observer.unobserve(containerRef.current);');
fs.writeFileSync('src/components/content/SimSection.tsx', simContent);

// ConceptLink.tsx
let conceptContent = fs.readFileSync('src/components/ui/ConceptLink.tsx', 'utf8');
conceptContent = conceptContent.replace(/\(entity as Record<string, unknown>\)/g, '(entity as any)');
fs.writeFileSync('src/components/ui/ConceptLink.tsx', conceptContent);

// TaxonomyGraph.tsx
let taxoContent = fs.readFileSync('src/components/ui/TaxonomyGraph.tsx', 'utf8');
taxoContent = taxoContent.replace('link.source.id === node.id', '(link.source as any).id === node.id');
taxoContent = taxoContent.replace('link.target.id === node.id', '(link.target as any).id === node.id');
fs.writeFileSync('src/components/ui/TaxonomyGraph.tsx', taxoContent);

// TheoremPage.tsx
let thmContent = fs.readFileSync('src/pages/TheoremPage.tsx', 'utf8');
if (!thmContent.includes('import type { Demo, Theorem }')) {
  thmContent = "import type { Demo, Theorem } from '../store/content/types';\n" + thmContent;
  fs.writeFileSync('src/pages/TheoremPage.tsx', thmContent);
}

console.log('Fixed remaining 11 errors');
