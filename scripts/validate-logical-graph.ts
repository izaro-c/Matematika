import fs from 'fs';
import path from 'path';

// Parse MDX function, extracts metadata
function parseMetadata(content: string, filePath: string) {
  const metadataRegex = /export\s+const\s+metadata\s*=\s*(\{[\s\S]*?\n\});?/;
  const match = content.match(metadataRegex);
  if (match) {
    try {
      const fn = new Function(`return ${match[1]}`);
      return fn();
    } catch (e) {
      console.error(`\n[ERROR CRÍTICO] Fallo de sintaxis en los metadatos de: ${filePath}`);
      console.error(e);
      return null;
    }
  }
  return null;
}

function extractDependenciesFromConceptLinks(content: string): string[] {
  // Extracción de dependencias ignorando las que tengan isDependency={false}
  const regex = /<ConceptLink\s+(?![^>]*isDependency=\{false\})[^>]*targetId=["']([^"']+)["']/g;
  const deps = new Set<string>();
  let match;
  while ((match = regex.exec(content)) !== null) {
    deps.add(match[1]);
  }
  return Array.from(deps);
}

function extractConceptLinksFromContent(content: string): string[] {
  const regex = /<ConceptLink[^>]*targetId=["']([^"']+)["']/g;
  const deps = new Set<string>();
  let match;
  while ((match = regex.exec(content)) !== null) {
    deps.add(match[1]);
  }
  return Array.from(deps);
}

function getMdxFiles(dir: string, fileList: string[] = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getMdxFiles(fullPath, fileList);
    } else if (fullPath.endsWith('.mdx')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

console.log("Iniciando validación del DAG lógico y reconstrucción del árbol...");

const contentDir = path.resolve(process.cwd(), 'src/content');
const mdxFiles = getMdxFiles(contentDir);

const allNodes = new Set<string>();
const metadataMap = new Map<string, any>();
const contentDepsMap = new Map<string, string[]>();
const conceptLinksMap = new Map<string, string[]>();

// Pass 1: Extract all metadata and auto-infer dependencies from text
mdxFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const metadata = parseMetadata(content, file);

  if (metadata) {
    const slug = path.basename(file, '.mdx');
    const id = metadata.id || slug;
    metadata._filePath = file;
    metadataMap.set(id, metadata);
    allNodes.add(id);

    const conceptLinks = extractConceptLinksFromContent(content);
    const automaticDeps = extractDependenciesFromConceptLinks(content);

    // Graph edges come from metadata and automatically from ConceptLinks
    const contentDeps: string[] = [...automaticDeps];
    if (Array.isArray(metadata.links)) contentDeps.push(...metadata.links);
    if (Array.isArray(metadata.requires)) contentDeps.push(...metadata.requires);
    if (Array.isArray(metadata.dependencias)) contentDeps.push(...metadata.dependencias);
    if (Array.isArray(metadata.axiomas)) contentDeps.push(...metadata.axiomas);
    if (Array.isArray(metadata.lemmas)) contentDeps.push(...metadata.lemmas);
    if (Array.isArray(metadata.demos)) contentDeps.push(...metadata.demos);
    if (metadata.parentTheorem && typeof metadata.parentTheorem === 'string') contentDeps.push(metadata.parentTheorem);
    if (Array.isArray(metadata.corollaries)) contentDeps.push(...metadata.corollaries);
    if (Array.isArray(metadata.axioms_verified)) contentDeps.push(...metadata.axioms_verified);
    if (metadata.satisfies && typeof metadata.satisfies === 'string') contentDeps.push(metadata.satisfies);
    // NOTE: seeAlso and ConceptLink targets with isDependency={false} are NOT included

    // Remove duplicates
    contentDepsMap.set(id, Array.from(new Set(contentDeps)));
    conceptLinksMap.set(id, conceptLinks);
  }
});

// Eliminar definiciones del grafo lógico, ya que son puramente léxicas y distorsionan la topología
for (const id of Array.from(allNodes)) {
  if (metadataMap.get(id)?.type === 'definicion') {
    allNodes.delete(id);
  }
}

// Pass 2: Build AND/OR logic graph
interface GraphNode {
  id: string;
  type: string;
  title: string;
  description: string;
  proofs: { id: string; dependencies: string[] }[];
  directDependencies: string[];
}

const graphNodes: Record<string, GraphNode> = {};

for (const id of allNodes) {
  const meta = metadataMap.get(id);
  graphNodes[id] = {
    id,
    type: meta.type || 'unknown',
    title: meta.title || id,
    description: meta.description || '',
    proofs: [],
    directDependencies: []
  };
}

const HIERARCHY_LEVEL: Record<string, number> = {
  'axioma': 0,
  'definicion': 1,
  'lema': 2,
  'teorema': 3,
  'corolario': 4,
  'demostracion': 5,
  'sistema-axiomatico': 6,
  'modelo': 7,
  'matematico': 10,
  'leccion': 10,
  'ejercicio': 10,
  'ejemplo': 10,
  'caso_de_uso': 10,
  'plan_de_estudio': 10
};

let linkedProofs = 0;

// Map proofs to their parent theorems
for (const id of allNodes) {
  const meta = metadataMap.get(id);
  const deps = contentDepsMap.get(id) || [];
  const nodeLevel = HIERARCHY_LEVEL[meta.type] ?? 100;

  if (meta.type === 'demostracion') {
    const parentTheoremId = meta.parentTheorem;
    if (parentTheoremId && graphNodes[parentTheoremId]) {
      // Exclude parentTheorem from dependencies — it's the theorem being proved, not a dependency
      const filteredDeps = deps.filter(depId => {
        if (depId === parentTheoremId) return false;
        const depMeta = metadataMap.get(depId);
        if (!depMeta) return false;
        const depLevel = HIERARCHY_LEVEL[depMeta.type] ?? 100;
        return depLevel <= nodeLevel;
      });
      graphNodes[parentTheoremId].proofs.push({
        id: id,
        dependencies: filteredDeps
      });
      linkedProofs++;
    } else {
      console.warn(`[WARNING] La demostración '${id}' no tiene un 'parentTheorem' válido o no se encontró su teorema asociado.`);
    }
  } else {
    const filteredDeps = deps.filter(depId => {
      if (!allNodes.has(depId)) return false; // Filtrar definiciones y nodos eliminados
      const depMeta = metadataMap.get(depId);
      if (!depMeta) {
        console.warn(`[INFO] Enlace filtrado: El nodo '${id}' referencia a '${depId}', pero este último no se indexó en el grafo.`);
        return false;
      }
      const depLevel = HIERARCHY_LEVEL[depMeta.type] ?? 100;
      return depLevel <= nodeLevel;
    });
    graphNodes[id].directDependencies = filteredDeps;
  }
}

// Adjacency list for Cycle Detection
const adjacencyList: Record<string, string[]> = {};
for (const id of allNodes) {
  adjacencyList[id] = [];
  const node = graphNodes[id];

  adjacencyList[id].push(...node.directDependencies);

  for (const proof of node.proofs) {
    adjacencyList[id].push(proof.id);
    adjacencyList[proof.id] = proof.dependencies;
    allNodes.add(proof.id);
  }
}

// Pass 3: Cycle Detection and Topological Sort
const color = new Map<string, 'white' | 'gray' | 'black'>();
for (const node of allNodes) {
  color.set(node, 'white');
}
const topologicalOrder: string[] = [];

function dfs(node: string) {
  if (color.get(node) === 'black') return;
  if (color.get(node) === 'gray') {
    console.error(`\n[ERROR FATAL] Ciclo lógico detectado en el nodo: ${node}`);
    process.exit(1);
  }

  color.set(node, 'gray');

  const safeDeps = [];
  const deps = adjacencyList[node] || [];

  for (const dep of deps) {
    if (!allNodes.has(dep)) continue;

    if (color.get(dep) === 'gray') {
      console.warn(`[INFO] Ciclo roto forzosamente: "${node}" -> "${dep}". Se ignorará esta arista.`);
      if (graphNodes[node]?.directDependencies.includes(dep)) {
        graphNodes[node].directDependencies = graphNodes[node].directDependencies.filter(d => d !== dep);
      } else {
        for (const proof of graphNodes[node]?.proofs || []) {
          if (proof.dependencies.includes(dep)) {
            proof.dependencies = proof.dependencies.filter(d => d !== dep);
          }
        }
      }
      continue;
    }
    safeDeps.push(dep);
  }

  for (const dep of safeDeps) {
    dfs(dep);
  }

  color.set(node, 'black');
  topologicalOrder.push(node);
}

for (const node of allNodes) {
  if (color.get(node) === 'white') {
    dfs(node);
  }
}

console.log(`\nValidación completada: ${allNodes.size} nodos procesados.`);
console.log(`Ensambladas ${linkedProofs} demostraciones a sus teoremas correspondientes.`);

// Pass 4: Export Graph Structure
const graphStructure = {
  topologicalOrder,
  nodes: graphNodes
};

const storeDir = path.resolve(process.cwd(), 'src/store');
if (!fs.existsSync(storeDir)) {
  fs.mkdirSync(storeDir);
}
const structurePath = path.join(storeDir, 'graph_structure.json');
fs.writeFileSync(structurePath, JSON.stringify(graphStructure, null, 2));
console.log(`✅ Estructura estática exportada correctamente a src/store/graph_structure.json`);