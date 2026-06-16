const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.mdx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      // Buscar [Texto](/ruta/slug) y reemplazar por <ConceptLink targetId="slug">Texto</ConceptLink>
      const regex = /\[([^\]]+)\]\((?:\/[^\/]+)+\/([^\)]+)\)/g;
      const newContent = content.replace(regex, '<ConceptLink targetId="$2">$1</ConceptLink>');
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`Replaced links in ${fullPath}`);
      }
    }
  }
}

processDir(path.join(__dirname, '../src/content'));
console.log('Done.');
