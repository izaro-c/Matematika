import fs from 'fs';
import path from 'path';

const srcDir = path.resolve('./src');

// Map of ComponentName -> New Path relative to src
const componentPaths = {
  BiographyLayout: 'components/layout/BiographyLayout',
  InteractiveLessonLayout: 'components/layout/InteractiveLessonLayout',
  SimulationLayout: 'components/layout/SimulationLayout',
  PageTransition: 'components/layout/PageTransition',
  ErrorBoundary: 'components/layout/ErrorBoundary',
  SearchOmnibar: 'components/navigation/SearchOmnibar',
  ThemeToggle: 'components/navigation/ThemeToggle',
  Concept: 'components/content/Concept',
  ConceptLink: 'components/ui/ConceptLink',
  DemonstrationSection: 'components/content/DemonstrationSection',
  MedievalStep: 'components/content/MedievalStep',
  MarginaliaPanel: 'components/content/MarginaliaPanel',
  SimSection: 'components/content/SimSection',
  SymbolDictionaryManager: 'components/content/SymbolDictionaryManager',
  Term: 'components/content/Term',
  Logo: 'components/ui/Logo',
  LogoGallery: 'components/ui/LogoGallery',
  JSXGraphWrapper: 'components/ui/JSXGraphWrapper',
  // EditorPage moved
  EditorPage: 'features/editor'
};

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else if (dirPath.endsWith('.tsx') || dirPath.endsWith('.ts') || dirPath.endsWith('.mdx')) {
      callback(dirPath);
    }
  });
}

function fixImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  const fileDir = path.dirname(filePath);

  for (const [comp, newRelPath] of Object.entries(componentPaths)) {
    // We look for imports like: import { Comp } from "..." or import Comp from "..."
    // Specifically looking for the file path part being replaced.
    // Instead of parsing AST, we can find import statements and check if they import `comp`.
    // Then we replace the path part with the correct relative path.

    const regex = new RegExp(`import\\s+({?\\s*${comp}\\s*}?)\\s+from\\s+['"]([^'"]+)['"]`, 'g');
    content = content.replace(regex, (match, importNames, oldPath) => {
      // oldPath might be "../../components/Logo" or "../pages/EditorPage"
      // If the old path contains the component name (or for EditorPage, 'EditorPage'), we should update it.
      
      // Compute new relative path
      const absNewPath = path.join(srcDir, newRelPath);
      let relPath = path.relative(fileDir, absNewPath);
      if (!relPath.startsWith('.')) {
        relPath = './' + relPath;
      }
      
      // If we are replacing an import, make sure to handle extensions properly
      // We'll just leave it without extension as is standard
      relPath = relPath.replace(/\\/g, '/');

      changed = true;
      return `import ${importNames} from "${relPath}"`;
    });
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated imports in ${filePath}`);
  }
}

walkDir(srcDir, fixImports);
console.log('Done fixing imports.');
