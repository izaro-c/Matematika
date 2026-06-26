const fs = require('fs');
const path = require('path');

const leanGraph = JSON.parse(fs.readFileSync('src/entities/graph/lean_graph.json', 'utf8'));
const validLeanIds = new Set(leanGraph.nodes.map(n => n.leanId));

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.mdx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            const metadataMatch = content.match(/export const metadata = (\{[\s\S]*?\n\});/);
            if (!metadataMatch) continue;
            
            let metadataStr = metadataMatch[1];
            let changed = false;

            const leanIdMatch = metadataStr.match(/"leanId":\s*"(.*?)"/);
            if (leanIdMatch && leanIdMatch[1]) {
                const leanId = leanIdMatch[1];
                if (!validLeanIds.has(leanId)) {
                    // remove leanId line completely
                    metadataStr = metadataStr.replace(/"leanId":\s*".*?",?\n/, '');
                    changed = true;
                }
            }
            
            // Also remove if it was set to null
            if (metadataStr.includes('"leanId": null')) {
                metadataStr = metadataStr.replace(/"leanId":\s*null,?\n/, '');
                changed = true;
            }

            if (changed) {
                metadataStr = metadataStr.replace(/"stepTacticMap":\s*\{[\s\S]*?\},?\n/, '');
                metadataStr = metadataStr.replace(/"leanCommitSha":\s*".*?",?\n/, '');
                metadataStr = metadataStr.replace(/"leanVerified":\s*(true|false),?\n/, '');

                // Cleanup trailing commas before }
                metadataStr = metadataStr.replace(/,\s*\n\}/, '\n}');
                // Cleanup multiple newlines
                metadataStr = metadataStr.replace(/\n\s*\n/g, '\n');

                content = content.replace(/export const metadata = \{[\s\S]*?\n\};/, `export const metadata = ${metadataStr};`);
                fs.writeFileSync(fullPath, content);
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

processDir('src/database/content');
