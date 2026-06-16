const fs = require('fs');

// Fix BranchPage.tsx
let content = fs.readFileSync('src/pages/BranchPage.tsx', 'utf8');
content = content.replace(/\{entry\.item\.description \|\|/g, "{(entry.item as any).description ||");
content = content.replace(/\{entry\.item\.title \|\|/g, "{(entry.item as any).title ||");
fs.writeFileSync('src/pages/BranchPage.tsx', content);

console.log('Fixed BranchPage');
