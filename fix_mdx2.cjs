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
            let changed = false;

            if (content.includes('\n  };\n')) {
                content = content.replace(/\n\s+};\n/, '\n};\n');
                changed = true;
            }

            // check if there is an empty line before };
            if (content.includes('\n\n};')) {
                content = content.replace(/\n\n\};/g, '\n};');
                changed = true;
            }
            
            // just to be robust, replace any spaces before };
            content = content.replace(/\n[\s]+};\n/, '\n};\n');

            if (changed) {
                fs.writeFileSync(fullPath, content);
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

processDir('src/database/content');
