const fs = require('fs');
const file = 'src/components/ui/MDXBlocks.tsx';
let content = fs.readFileSync(file, 'utf8');

// Also catch variations without spaces
content = content.replace(/export const (\w+):\s*React\.FC<\{\s*([^}]+)\s*\}>\s*=\s*\(([^)]+)\)\s*=>/g, (match, name, propsContent, args) => {
  return `interface ${name}Props {\n  ${propsContent.trim()};\n}\nexport const ${name}: React.FC<${name}Props> = (${args}) =>`;
});

fs.writeFileSync(file, content);
console.log('Fixed types in MDXBlocks.tsx');
