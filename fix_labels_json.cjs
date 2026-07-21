const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/widgets/diagrams/**/*.tsx');
let modifiedFiles = 0;

files.forEach(file => {
  if (file.includes('DosRectasUnPunto.tsx')) return;
  let content = fs.readFileSync(file, 'utf8');
  
  // Find everything between { and the last } before ); or just use a regex to find the JSON object.
  // Actually, we can just replace `"showLabel": true,` with spaces if we know it's a line/segment!
  // But a JSON parser is safer.
  
  // A simple hack to find all items:
  // In the JSON, elements are usually in "elements": { "id": { "kind": "line", "showLabel": true ... } }
  // We can just match the JSON string block!
  let startIdx = content.indexOf('{\n  "version": 2,');
  if (startIdx === -1) {
    startIdx = content.indexOf('{\n  "version": 1,');
  }
  if (startIdx === -1) return;
  
  let endIdx = content.lastIndexOf('}');
  if (endIdx === -1) return;
  
  let jsonStr = content.substring(startIdx, endIdx + 1);
  try {
    let spec = JSON.parse(jsonStr);
    let dirty = false;
    
    function traverse(obj) {
      if (!obj || typeof obj !== 'object') return;
      if (Array.isArray(obj)) {
        obj.forEach(traverse);
      } else {
        if (obj.kind && ['line', 'segment', 'ray', 'polygon', 'arc', 'circle'].includes(obj.kind)) {
          if (obj.showLabel === true) {
            delete obj.showLabel;
            dirty = true;
          }
        }
        for (let key in obj) {
          traverse(obj[key]);
        }
      }
    }
    
    traverse(spec);
    
    if (dirty) {
      let newJsonStr = JSON.stringify(spec, null, 2);
      let newContent = content.substring(0, startIdx) + newJsonStr + content.substring(endIdx + 1);
      fs.writeFileSync(file, newContent, 'utf8');
      console.log('Fixed', file);
      modifiedFiles++;
    }
  } catch (e) {
    console.error('Failed to parse JSON in', file, e.message);
  }
});

console.log('Total files modified:', modifiedFiles);
