/* eslint-disable no-useless-assignment, sonarjs/cognitive-complexity, sonarjs/super-linear-regex */
import fs from 'node:fs';
import path from 'node:path';
import { parseDiagramSourceAST } from './parseDiagramSourceAST';

const ROOT = process.cwd();
const DIAGRAMS_DIR = path.join(ROOT, 'src/widgets/diagrams');

function walk(dir: string, callback: (filePath: string) => void) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, callback);
    } else if (entry.isFile() && entry.name.endsWith('.tsx')) {
      callback(fullPath);
    }
  }
}

function normalizeColors(code: string): string {
  let res = code;
  res = res.replace(/getCSSVar\(['"]--theme-terracota['"]\)/g, 'theme.terracota');
  res = res.replace(/getCSSVar\(['"]--theme-carbon['"]\)/g, 'theme.carbon');
  res = res.replace(/getCSSVar\(['"]--theme-salvia['"]\)/g, 'theme.salvia');
  res = res.replace(/getCSSVar\(['"]--theme-ocre['"]\)/g, 'theme.ocre');
  res = res.replace(/getCSSVar\(['"]--theme-pizarra['"]\)/g, 'theme.pizarra');
  res = res.replace(/getCSSVar\(['"]--theme-lienzo['"]\)/g, 'theme.lienzo');
  res = res.replace(/getCSSVar\(['"]--theme-pavo['"]\)/g, 'theme.pavo');
  res = res.replace(/getCSSVar\(['"]--theme-granada['"]\)/g, 'theme.granada');
  res = res.replace(/getCSSVar\(['"]--theme-musgo['"]\)/g, 'theme.musgo');
  return res;
}

function replaceCreates(code: string): string {
  let res = code;
  res = res.replace(/board\.create\(\s*['"]point['"]\s*,\s*(\[.*?\]|[^,]+)\s*,\s*(\{[\s\S]*?\})\s*\)/g, 'createPoint(board, $1, $2, theme)');
  res = res.replace(/board\.create\(\s*['"]glider['"]\s*,\s*(\[.*?\]|[^,]+)\s*,\s*(\{[\s\S]*?\})\s*\)/g, 'createGlider(board, $1, $2, theme)');
  res = res.replace(/board\.create\(\s*['"]line['"]\s*,\s*(\[.*?\]|[^,]+)\s*,\s*(\{[\s\S]*?\})\s*\)/g, 'createLine(board, $1, $2, theme)');
  res = res.replace(/board\.create\(\s*['"]segment['"]\s*,\s*(\[.*?\]|[^,]+)\s*,\s*(\{[\s\S]*?\})\s*\)/g, 'createSegment(board, $1, $2, theme)');
  res = res.replace(/board\.create\(\s*['"]circle['"]\s*,\s*(\[.*?\]|[^,]+)\s*,\s*(\{[\s\S]*?\})\s*\)/g, 'createCircle(board, $1, $2, theme)');
  res = res.replace(/board\.create\(\s*['"]polygon['"]\s*,\s*(\[.*?\]|[^,]+)\s*,\s*(\{[\s\S]*?\})\s*\)/g, 'createPolygon(board, $1, $2, theme)');
  res = res.replace(/board\.create\(\s*['"]angle['"]\s*,\s*(\[.*?\]|[^,]+)\s*,\s*(\{[\s\S]*?\})\s*\)/g, 'createAngle(board, $1, $2, theme)');
  res = res.replace(/board\.create\(\s*['"]text['"]\s*,\s*(\[.*?\]|[^,]+)\s*,\s*(\{[\s\S]*?\})\s*\)/g, 'createText(board, $1, $2, theme)');
  return res;
}

let count = 0;

walk(DIAGRAMS_DIR, (filePath) => {
  if (filePath.endsWith('index.tsx') || filePath.endsWith('index.ts')) return;

  const content = fs.readFileSync(filePath, 'utf-8');
  const filename = path.basename(filePath);
  const relPath = path.relative(ROOT, filePath);
  
  // Exclusions: 3D, logical flow, placeholders, non-Euclidean models, or highly custom React-stateful diagrams
  if (content.includes('@react-three/fiber') || 
      content.includes('SceneContent') || 
      content.includes('const STEPS =') || 
      content.includes('DemoDesigualdadTriangular') || 
      content.includes('Diagrama en construcción') ||
      filePath.includes('Simulation') ||
      filePath.includes('/Models/') ||
      filePath.includes('AxiomaArquimedes') || 
      filePath.includes('DesigualdadTriangular') || 
      filePath.includes('DemoPitagorasEuclides') ||
      filePath.includes('DemoPitagorasAreas') ||
      filePath.includes('Congruence1') ||
      filePath.includes('Congruence2') ||
      filePath.includes('Congruence3') ||
      filePath.includes('Congruence4')
  ) {
    let updated = content;
    updated = updated.replace(/from\s*['"]@\/features\/graph\/ui\/MathBoard['"]/g, "from '@/shared/diagrams/core/MathBoard'");
    updated = updated.replace(/from\s*['"]@\/features\/graph\/ui\/MathUtils['"]/g, "from '@/shared/diagrams/core/MathUtils'");
    updated = updated.replace(/from\s*['"]@\/features\/graph\/ui\/MathFactory['"]/g, "from '@/shared/diagrams/core/MathFactory'");
    
    // Explicit casts for selectors to avoid noImplicitAny warnings
    updated = updated.replace(/state\s*=>\s*state\.variables\?\.\['highlight'\]/g, '(state: any) => state.variables?.[\'highlight\']');
    updated = updated.replace(/state\s*=>\s*state\.activeStep/g, '(state: any) => state.activeStep');

    if (updated !== content) {
      fs.writeFileSync(filePath, updated, 'utf-8');
      console.log(`  [REDIRECTED IMPORTS ONLY] ${filename}`);
      count++;
    }
    return;
  }

  // If the file already uses MathBoard but is unsupported (e.g. exercise files pointing to features)
  if (content.includes('MathBoard') && (content.includes('onInit') || content.includes('onUpdate'))) {
    console.log(`Fixing MathBoard imports & signatures in: ${relPath}...`);
    let updated = content;
    
    // Redirect imports safely without removing unique functions
    updated = updated.replace(/from\s*['"]@\/features\/graph\/ui\/MathBoard['"]/g, "from '@/shared/diagrams/core/MathBoard'");
    updated = updated.replace(/from\s*['"]@\/features\/graph\/ui\/MathUtils['"]/g, "from '@/shared/diagrams/core/MathUtils'");
    updated = updated.replace(/from\s*['"]@\/features\/graph\/ui\/MathFactory['"]/g, "from '@/shared/diagrams/core/MathFactory'");

    // Add explicit any to implicit signatures
    updated = updated.replace(/onInit\s*=\s*\(\s*board\s*,\s*els\s*,\s*theme\s*\)\s*=>/g, 'onInit={(board: any, els: any, theme: any) =>');
    updated = updated.replace(/onUpdate\s*=\s*\(\s*_board\s*,\s*els\s*,\s*theme\s*,\s*_isStep\s*,\s*_isHL\s*\)\s*=>/g, 'onUpdate={(_board: any, els: any, theme: any, _isStep: any, _isHL: any) =>');
    updated = updated.replace(/onUpdate\s*=\s*\(\s*board\s*,\s*els\s*,\s*theme\s*,\s*isStep\s*,\s*isHL\s*\)\s*=>/g, 'onUpdate={(board: any, els: any, theme: any, isStep: any, isHL: any) =>');

    fs.writeFileSync(filePath, updated, 'utf-8');
    count++;
    console.log(`  [FIXED SIGNATURES] ${filename}`);
    return;
  }

  const result = parseDiagramSourceAST(content);
  if (result.status === 'supported') {
    return; // Already compatible
  }

  console.log(`Migrating: ${relPath}...`);

  let updated = content;

  // Clean elementsRef refs and highlight hooks
  updated = updated.replace(/const\s+boardRef\s*=\s*useRef[\s\S]*?;/g, '');
  updated = updated.replace(/const\s+jxgBoard\s*=\s*useRef[\s\S]*?;/g, '');
  updated = updated.replace(/const\s+elementsRef\s*=\s*useRef[\s\S]*?;/g, '');
  updated = updated.replace(/const\s+mathHighlight\s*=\s*useMathStore[\s\S]*?;/g, '');
  updated = updated.replace(/const\s+lessonHighlight\s*=\s*useLessonStore[\s\S]*?;/g, '');
  updated = updated.replace(/const\s+highlight\s*=\s*mathHighlight[\s\S]*?;/g, '');
  updated = updated.replace(/const\s+isHighlight\s*=\s*[\s\S]*?highlight\s*===\s*id;?/g, '');

  // Extract boundingbox
  const bboxMatch = updated.match(/boundingbox:\s*(\[.*?\])/);
  const bbox = bboxMatch ? bboxMatch[1] : '[-5, 5, 5, -5]';

  // Extract axis and grid
  const axis = updated.includes('axis: true');
  const grid = updated.includes('grid: true');

  // Reconstruct onInit
  const useEffectMountMatch = updated.match(/useEffect\(\(\)\s*=>\s*\{((?:(?!useEffect)[\s\S])*?)\}\s*,\s*\[\]\)/);
  let elsKeys: string[] = [];
  if (useEffectMountMatch) {
    let mountBody = useEffectMountMatch[1];
    
    // Extract elements keys from elementsRef.current
    const elsRefMatch = mountBody.match(/elementsRef\.current\s*=\s*\{([\s\S]*?)\}/);
    let elsAssignments = '';
    if (elsRefMatch) {
      const keysStr = elsRefMatch[1];
      elsKeys = keysStr.split(',').map(s => s.trim()).filter(s => s && s !== 'board' && s !== 'copies');
      elsAssignments = elsKeys.map(k => {
        if (k.includes(':')) {
          const parts = k.split(':').map(p => p.trim());
          return `els.${parts[0]} = ${parts[1]};`;
        }
        return `els.${k} = ${k};`;
      }).join('\n        ');
    }

    // Clean boilerplates
    mountBody = mountBody.replace(/if\s*\(!boardRef\.current\)\s*return;?/g, '');
    mountBody = mountBody.replace(/if\s*\(!boardRef\.current\.id\)[\s\S]*?const\s+board\s*=\s*JXG\.JSXGraph\.initBoard\([\s\S]*?\);/g, '');
    mountBody = mountBody.replace(/const\s+board\s*=\s*JXG\.JSXGraph\.initBoard\([\s\S]*?\);/g, '');
    mountBody = mountBody.replace(/jxgBoard\.current\s*=\s*board;?/g, '');
    mountBody = mountBody.replace(/elementsRef\.current\s*=\s*\{[\s\S]*?\};?/g, '');
    mountBody = mountBody.replace(/board\.update\(\);/g, '');
    mountBody = mountBody.replace(/\(board\.renderer\s+as\s+any\)\.container\.style\.backgroundColor[\s\S]*?;/g, '');
    mountBody = mountBody.replace(/const\s+observer\s*=\s*new\s+MutationObserver[\s\S]*?observer\.observe[\s\S]*?;/g, '');
    mountBody = mountBody.replace(/return\s*\(\)\s*=>\s*\{[\s\S]*?\};?/g, '');

    mountBody = normalizeColors(mountBody);
    mountBody = replaceCreates(mountBody);

    const onInitFunc = `const onInit = (board: any, els: any, theme: any) => {
      void board; void els; void theme;
      ${mountBody.trim()}

      // Registrar elementos para interactividad y auditoría
      ${elsAssignments}
    };`;

    updated = updated.replace(useEffectMountMatch[0], onInitFunc);
  }

  // Reconstruct onUpdate (highlight effect)
  const useEffectHighlightMatch = updated.match(/useEffect\(\(\)\s*=>\s*\{((?:(?!useEffect)[\s\S])*?)\}\s*,\s*\[highlight(?:,\s*isHighlight)?\]\)/);
  if (useEffectHighlightMatch) {
    let updateBody = useEffectHighlightMatch[1];
    
    const destructuringMatch = updateBody.match(/const\s*\{\s*([\s\S]*?)\s*\}\s*=\s*(?:elementsRef\.current|els)[\s\S]*?;/);
    const simpleElsAssignmentMatch = updateBody.match(/const\s+els\s*=\s*elementsRef\.current[\s\S]*?;/);
    let elsKeysStr = '';
    if (destructuringMatch) {
      const rawKeys = destructuringMatch[1].split(',').map(s => s.trim());
      const cleanKeys = rawKeys.map(k => {
        if (k.includes(':')) {
          return k.split(':')[0].trim();
        }
        return k;
      }).filter(s => s && s !== 'board');
      elsKeysStr = cleanKeys.join(', ');
      
      updateBody = updateBody.replace(destructuringMatch[0], '');
    }
    
    if (simpleElsAssignmentMatch) {
      updateBody = updateBody.replace(simpleElsAssignmentMatch[0], '');
    }

    updateBody = updateBody.replace(/if\s*\(!board\)\s*return;?/g, '');
    updateBody = updateBody.replace(/board\.update\(\);/g, '');
    updateBody = normalizeColors(updateBody);
    updateBody = updateBody.replace(/highlight\s*===\s*(['"].*?['"])/g, 'isHL($1)');

    const onUpdateFunc = `const onUpdate = (board: any, els: any, theme: any, isStep: any, isHL: any) => {
      const isHighlight = isHL;
      void board; void els; void theme; void isStep; void isHL; void isHighlight;
      ${elsKeysStr ? `const { ${elsKeysStr} } = els;` : ''}
      ${updateBody.trim()}
    };`;

    updated = updated.replace(useEffectHighlightMatch[0], onUpdateFunc);
  }

  // Reconstruct return statement
  const returnMatch = updated.match(/return\s*\(\s*<div\s+className=["'](?:w-full|flex)[\s\S]*?>([\s\S]*?)<\/div>\s*\);/);
  if (returnMatch) {
    const returnInner = returnMatch[1];
    const overlayHtml = returnInner
      .replace(/<div\s+ref=\{boardRef\}[\s\S]*?\/>/g, '')
      .replace(/<div\s+ref=\{boardRef\}[\s\S]*?<\/div>/g, '')
      .replace(/<div\s+className=["']jxgbox[\s\S]*?<\/div>/g, '')
      .trim();

    const mathBoardJSX = `<MathBoard
      boundingbox={${bbox}}
      axis={${axis}}
      grid={${grid}}
      onInit={onInit}
      ${useEffectHighlightMatch ? 'onUpdate={onUpdate}' : ''}
    >
      ${overlayHtml}
    </MathBoard>`;

    updated = updated.replace(returnMatch[0], `return (\n    ${mathBoardJSX}\n  );`);
  }

  // Clean old imports and highlight stores
  updated = updated.replace(/import\s*React\s*,\s*\{\s*useEffect\s*,\s*useRef\s*\}\s*from\s*['"]react['"];?/g, '');
  updated = updated.replace(/import\s*React\s*,\s*\{\s*useEffect\s*,\s*useRef\s*,\s*useState\s*\}\s*from\s*['"]react['"];?/g, '');
  updated = updated.replace(/import\s*\{\s*useRef\s*,\s*useEffect\s*\}\s*from\s*['"]react['"];?/g, '');
  updated = updated.replace(/import\s*\{\s*useRef\s*,\s*useEffect\s*,\s*useState\s*\}\s*from\s*['"]react['"];?/g, '');
  updated = updated.replace(/import\s*React\s*from\s*['"]react['"];?/g, '');
  updated = updated.replace(/import\s*JXG\s*from\s*['"]jsxgraph['"];?/g, '');
  updated = updated.replace(/import\s*\{\s*getCSSVar\s*\}\s*from\s*['"].*?MathUtils['"];?/g, '');
  updated = updated.replace(/import\s*\{\s*useMathStore\s*\}\s*from\s*['"].*?MathStoreContext['"];?/g, '');
  updated = updated.replace(/import\s*\{\s*useLessonStore\s*\}\s*from\s*['"].*?LessonStore['"];?/g, '');

  updated = updated.replace(/const\s+highlight\s*=\s*useMathStore[\s\S]*?;/g, '');

  // Determine what react imports are still needed
  const reactImports: string[] = [];
  if (updated.includes('useRef')) reactImports.push('useRef');
  if (updated.includes('useEffect')) reactImports.push('useEffect');
  if (updated.includes('useState')) reactImports.push('useState');

  let reactImportStr = '';
  if (reactImports.length > 0) {
    reactImportStr = `import { ${reactImports.join(', ')} } from 'react';\n`;
  }

  // Store imports
  let storeImportStr = '';
  if (updated.includes('useMathStore')) {
    storeImportStr += `import { useMathStore } from '@/app/providers/MathStoreContext';\n`;
  }
  if (updated.includes('useLessonStore')) {
    storeImportStr += `import { useLessonStore } from '@/features/lessons/LessonStore';\n`;
  }
  if (updated.includes('getCSSVar')) {
    storeImportStr += `import { getCSSVar } from '@/shared/diagrams/core/MathUtils';\n`;
  }

  // MathBoard and MathFactory imports
  const usedHelpers = ['createPoint'];
  if (updated.includes('createLine')) usedHelpers.push('createLine');
  if (updated.includes('createSegment')) usedHelpers.push('createSegment');
  if (updated.includes('createGlider')) usedHelpers.push('createGlider');
  if (updated.includes('createCircle')) usedHelpers.push('createCircle');
  if (updated.includes('createPolygon')) usedHelpers.push('createPolygon');
  if (updated.includes('createAngle')) usedHelpers.push('createAngle');
  if (updated.includes('createText')) usedHelpers.push('createText');
  if (updated.includes('createRightAngleMarker') || updated.includes('createRightAngle')) {
    usedHelpers.push('createRightAngle');
  }
  if (updated.includes('createTicks')) usedHelpers.push('createTicks');

  let utilsImportStr = '';
  if (updated.includes('StyleManager')) {
    utilsImportStr = `import { StyleManager } from '@/shared/diagrams/core/MathUtils';\n`;
  }

  const newImports = `${reactImportStr}${storeImportStr}${utilsImportStr}import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import { 
  ${usedHelpers.join(', ')} 
} from '@/shared/diagrams/core/MathFactory';`;

  updated = newImports + '\n' + updated;

  // Clean trailing semicolons in onUpdate/onInit
  updated = updated.replace(/els\.\s*\n\s*\};\s*;/g, '};');
  updated = updated.replace(/els\.\s*\n\s*\}$;;/g, '};');
  
  // Clean up orphaned multiline cast remnants
  updated = updated.replace(/^\s*<string,\s*any>;/gm, '');

  fs.writeFileSync(filePath, updated, 'utf-8');
  count++;
  console.log(`  [MIGRATED COMPATIBLE] ${filename}`);
});

console.log(`\nInplace migration completed. Converted/Fixed ${count} diagrams.`);
