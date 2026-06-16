const fs = require('fs');
const path = require('path');

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.mdx')) {
      processFile(filePath);
    }
  }
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find all <ConceptLink targetId="slug">
  const regex = /<ConceptLink targetId="([^"]+)">/g;
  const links = new Set();
  let match;
  while ((match = regex.exec(content)) !== null) {
    links.add(match[1]);
  }
  
  if (links.size > 0) {
    const linksArray = Array.from(links);
    const linksString = `links: ${JSON.stringify(linksArray)},`;
    
    // Find the export const metadata = { ... } block
    const metaMatch = content.match(/export const metadata = {([\s\S]*?)};/);
    if (metaMatch) {
      let metaContent = metaMatch[1];
      if (metaContent.includes('links:')) {
        // Replace existing links array
        metaContent = metaContent.replace(/links:\s*\[.*?\],/s, linksString);
      } else {
        // Insert after description or title
        if (metaContent.includes('description:')) {
          metaContent = metaContent.replace(/(description:\s*".*?",)/, `$1\n  ${linksString}`);
        } else {
          metaContent = metaContent.replace(/(title:\s*".*?",)/, `$1\n  ${linksString}`);
        }
      }
      content = content.replace(/export const metadata = {[\s\S]*?};/, `export const metadata = {${metaContent}};`);
      fs.writeFileSync(filePath, content);
      console.log(`Updated links in ${path.basename(filePath)}`);
    }
  }
}

processDirectory(path.join(__dirname, '../src/content'));
console.log('Done extracting concept links.');
