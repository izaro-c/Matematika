const fs = require('fs');

// Fix TheoremPage.tsx
let thmContent = fs.readFileSync('src/pages/TheoremPage.tsx', 'utf8');
if (!thmContent.includes('import type { Demo, Theorem }')) {
  thmContent = thmContent.replace("import { ContentStore } from '../store/content/ContentStore';", "import { ContentStore } from '../store/content/ContentStore';\nimport type { Demo, Theorem } from '../store/content/types';");
  fs.writeFileSync('src/pages/TheoremPage.tsx', thmContent);
}

// Fix EditorPage.tsx
let editorContent = fs.readFileSync('src/pages/Editor/EditorPage.tsx', 'utf8');
editorContent = editorContent.replace(/const editor = editorRef\.current;/g, "const editor = editorRef.current as any;");
fs.writeFileSync('src/pages/Editor/EditorPage.tsx', editorContent);

console.log('Fixed TheoremPage and EditorPage');
