const fs = require('fs');
const path = require('path');
const glob = require('glob'); // Note: we can just use fs and path recursively

function walkSync(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else if (dirFile.endsWith('.mdx')) {
      filelist.push(dirFile);
    }
  });
  return filelist;
}

const files = walkSync('src/content');
let issues = {};

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  let fileIssues = [];
  
  // 1. Check if metadata keys are quoted
  const metadataMatch = content.match(/export const metadata = \{([^}]*)\}/);
  if (metadataMatch) {
    const metaBlock = metadataMatch[1];
    const unquotedKeys = [...metaBlock.matchAll(/^\s*([a-zA-Z0-9_]+):/gm)];
    if (unquotedKeys.length > 0) {
      fileIssues.push('Unquoted metadata keys: ' + unquotedKeys.map(m => m[1]).join(', '));
    }
    const singleQuotedKeys = [...metaBlock.matchAll(/^\s*'([a-zA-Z0-9_]+)':/gm)];
    if (singleQuotedKeys.length > 0) {
      fileIssues.push('Single-quoted metadata keys: ' + singleQuotedKeys.map(m => m[1]).join(', '));
    }
  } else {
    fileIssues.push('No metadata block found');
  }

  // 2. Check for Capitular
  if (!content.includes('<Capitular')) {
    fileIssues.push('Missing <Capitular>');
  }

  // 3. Check for Separador vs ---
  if (content.match(/^---\s*$/m)) {
    fileIssues.push('Uses --- instead of <Separador />');
  }

  // 4. Check for \sen
  if (content.includes('\\sen')) {
    fileIssues.push('Uses \\sen instead of \\sin');
  }

  // 5. Check for standard Markdown links
  if (content.match(/\[([^\]]+)\]\((?!#)[^\)]+\)/)) {
    fileIssues.push('Uses standard markdown link [text](url)');
  }

  if (fileIssues.length > 0) {
    issues[file] = fileIssues;
  }
});

console.log(JSON.stringify(issues, null, 2));
console.log(`\nFound issues in ${Object.keys(issues).length} out of ${files.length} files.`);
