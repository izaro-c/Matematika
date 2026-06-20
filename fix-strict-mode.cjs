const fs = require('fs');
const path = require('path');

const diagramDirs = [
  'src/diagrams/Axiomas',
  'src/diagrams/Definiciones',
  'src/diagrams/Theorems',
  'src/diagrams/Models'
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let original = content;

  // If already has jxgBoard, skip
  if (content.includes('jxgBoard.current = board;')) {
    console.log('Skipping ' + filePath + ' (already has jxgBoard)');
    return;
  }

  // 1. Add jxgBoard ref
  content = content.replace(/const boardRef = useRef<HTMLDivElement>\(null\);/, 
    'const boardRef = useRef<HTMLDivElement>(null);\n  const jxgBoard = useRef<any>(null);');

  // 2. Change initBoard(boardRef.current) -> initBoard(boardRef.current.id)
  content = content.replace(/JXG\.JSXGraph\.initBoard\(boardRef\.current\s*,/g, 'JXG.JSXGraph.initBoard(boardRef.current.id,');

  // 3. Inject jxgBoard.current = board after the initBoard call block
  // We look for `});` immediately following `keepaspectratio` or `zoom` or `grid` or `pan` inside the initBoard config
  // More robustly: we can just find `const board = JXG.JSXGraph.initBoard(` and match its closing `});`
  // Since formatting varies, let's inject right after `elementsRef.current = { ... board };` instead? No, elementsRef might not always be there.
  // Let's inject after `grid: false,\n    });` or similar.
  const initBoardMatch = content.match(/const board = JXG\.JSXGraph\.initBoard\([\s\S]*?\n\s*\}\);/);
  if (initBoardMatch) {
    content = content.replace(initBoardMatch[0], initBoardMatch[0] + '\n    jxgBoard.current = board;');
  } else {
    console.warn('Could not find initBoard block in ' + filePath);
  }

  // 4. Update freeBoard
  content = content.replace(/JXG\.JSXGraph\.freeBoard\(board\);/, 
    'JXG.JSXGraph.freeBoard(board);\n      jxgBoard.current = null;');

  // 5. Remove any boardRef.current = null inside the cleanup
  content = content.replace(/boardRef\.current = null;/g, '');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log('Fixed ' + filePath);
  }
}

diagramDirs.forEach(dir => {
  const fullDir = path.join(__dirname, dir);
  if (fs.existsSync(fullDir)) {
    const files = fs.readdirSync(fullDir);
    files.forEach(file => {
      if (file.endsWith('.tsx')) {
        const filePath = path.join(fullDir, file);
        const code = fs.readFileSync(filePath, 'utf-8');
        if (code.includes('JSXGraph.initBoard')) {
          processFile(filePath);
        }
      }
    });
  }
});
