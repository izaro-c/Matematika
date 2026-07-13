/* eslint-disable sonarjs/super-linear-regex */
import fs from 'node:fs';
import path from 'node:path';

const filePath = path.join(process.cwd(), 'src/widgets/diagrams/Teoremas/DosRectasUnPunto.tsx');
const content = fs.readFileSync(filePath, 'utf-8');

const useEffectHighlightMatch = content.match(/useEffect\(\(\)\s*=>\s*\{((?:(?!useEffect)[\s\S])*?)\}\s*,\s*\[highlight(?:,\s*isHighlight)?\]\)/);
if (useEffectHighlightMatch) {
  const updateBody = useEffectHighlightMatch[1];
  console.log('--- updateBody found ---');
  console.log(updateBody);

  const destructuringMatch = updateBody.match(/const\s*\{\s*([\s\S]*?)\s*\}\s*=\s*(?:elementsRef\.current|els)[\s\S]*?;/);
  console.log('destructuringMatch matches:', destructuringMatch ? 'YES' : 'NO');

  const simpleElsAssignmentMatch = updateBody.match(/const\s+els\s*=\s*elementsRef\.current[\s\S]*?;/);
  console.log('simpleElsAssignmentMatch matches:', simpleElsAssignmentMatch ? 'YES' : 'NO');
  if (simpleElsAssignmentMatch) {
    console.log('match[0]:', JSON.stringify(simpleElsAssignmentMatch[0]));
  }
} else {
  console.log('useEffectHighlightMatch matches: NO');
}
