const fs = require('fs');
const file = 'src/store/content/ContentStore.ts';
let content = fs.readFileSync(file, 'utf8');

// 1. Add BaseContent to imports
content = content.replace(/StudyPlan\s*\n\}\s*from\s*'(\.\/types)';/, "StudyPlan,\n  BaseContent\n} from '$1';");

// 2. Fix the spread order
const types = ['Mathematician', 'Theorem', 'Lesson', 'Demo', 'Definition', 'Example', 'Exercise', 'UseCase'];
for (const t of types) {
    const regex = new RegExp(`id,\\s*slug,\\s*\\.\\.\\.\\(meta\\s*as\\s*unknown\\s*as\\s*${t}\\)`, 'g');
    content = content.replace(regex, `...(meta as unknown as ${t}), id, slug`);
}

// 3. Fix lazy loader for StudyPlan
content = content.replace(/Component:\s*lazy\(planLoaders\[path\]\s*as\s*\(\)\s*=>\s*Promise<Record<string, unknown>>\)/, "Component: this.createLazyComponent(planLoaders[path] as () => Promise<Record<string, unknown>>)");

fs.writeFileSync(file, content);
console.log('Fixed ContentStore.ts');
