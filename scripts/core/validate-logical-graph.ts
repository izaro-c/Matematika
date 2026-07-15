import fs from 'fs';
import path from 'path';

// Parse MDX function, extracts metadata
function parseMetadata(content: string, filePath: string) {
  const metadataRegex = /export\s+const\s+metadata\s*=\s*(\{[\s\S]*?\n\});?/;
  const match = content.match(metadataRegex);
  if (match) {
    try {
      // eslint-disable-next-line sonarjs/code-eval -- internal script, trusted MDX content
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

const contentDir = path.resolve(process.cwd(), 'src/database/content');
const mdxFiles = getMdxFiles(contentDir);

const allNodes = new Set<string>();
const metadataMap = new Map<string, Record<string, unknown>>();
const contentDepsMap = new Map<string, string[]>();

const leanGraphPath = path.resolve(process.cwd(), 'src/entities/graph/lean_graph.json');
const leanDepsMap: Record<string, string[]> = {};
if (fs.existsSync(leanGraphPath)) {
  try {
    const leanData = JSON.parse(fs.readFileSync(leanGraphPath, 'utf-8'));
    for (const node of leanData.nodes) {
      if (node.leanId && Array.isArray(node.declaredDeps)) {
        leanDepsMap[node.leanId] = node.declaredDeps;
      }
    }
  } catch (e) {
    console.error("[WARNING] No se pudo leer lean_graph.json", e);
  }
}

// Pass 1: Extract all metadata and auto-infer dependencies from text
function processMdxFile(file: string) {
  const content = fs.readFileSync(file, 'utf-8');
  const metadata = parseMetadata(content, file);

  if (metadata) {
    const slug = path.basename(file, '.mdx');
    const id = (metadata.id as string) || slug;
    metadata._filePath = file;
    metadataMap.set(id, metadata as Record<string, unknown>);
    allNodes.add(id);

    // Graph edges come strictly from explicit metadata arrays and Lean declared dependencies
    const contentDeps: string[] = [];
    if (metadata.leanId && leanDepsMap[metadata.leanId as string]) {
      contentDeps.push(...leanDepsMap[metadata.leanId as string]);
    }
    
    if (Array.isArray(metadata.links)) contentDeps.push(...metadata.links);
    if (Array.isArray(metadata.requires)) contentDeps.push(...metadata.requires);
    if (Array.isArray(metadata.dependencias)) contentDeps.push(...metadata.dependencias);
    if (Array.isArray(metadata.axiomas)) contentDeps.push(...metadata.axiomas);
    if (Array.isArray(metadata.lemmas)) contentDeps.push(...metadata.lemmas);
    if (Array.isArray(metadata.demos)) contentDeps.push(...metadata.demos);
    if (metadata.parentTheorem && typeof metadata.parentTheorem === 'string') contentDeps.push(metadata.parentTheorem);
    if (Array.isArray(metadata.corollaries)) contentDeps.push(...metadata.corollaries);
    if (Array.isArray(metadata.axioms_verified)) contentDeps.push(...metadata.axioms_verified);
    // NOTE: 'satisfies' (modelos → sistemas) no crea dependencia lógica:
    // es una asociación semántica, no un prerrequisito deductivo.
    // NOTE: seeAlso and ConceptLink targets with isDependency={false} are NOT included

    // Remove duplicates
    contentDepsMap.set(id, Array.from(new Set(contentDeps)));
  }
}

mdxFiles.forEach(processMdxFile);

// Un sistema formal no puede contener dos axiomas declarados como alternativas
// del mismo grupo. Esta condición lógica no se manifiesta como un ciclo del DAG.
let alternativeGroupErrors = 0;
for (const [systemId, systemMeta] of metadataMap) {
  if (systemMeta.type !== 'sistema-axiomatico' || !Array.isArray(systemMeta.axiomas)) continue;

  const alternativesByGroup = new Map<string, string[]>();
  for (const axiomId of systemMeta.axiomas) {
    if (typeof axiomId !== 'string') continue;
    const group = metadataMap.get(axiomId)?.alternativeGroup;
    if (typeof group !== 'string') continue;
    const alternatives = alternativesByGroup.get(group) ?? [];
    alternatives.push(axiomId);
    alternativesByGroup.set(group, alternatives);
  }

  for (const [group, alternatives] of alternativesByGroup) {
    if (alternatives.length < 2) continue;
    alternativeGroupErrors += 1;
    console.error(
      `[ERROR] ${systemId} contiene alternativas incompatibles del grupo ${group}: ${alternatives.join(', ')}`,
    );
  }
}

if (alternativeGroupErrors > 0) {
  console.error(`\nValidación detenida: ${alternativeGroupErrors} conflicto(s) axiomático(s).`);
  process.exit(1);
}

// Las definiciones participan en el grafo lógico.
// Las definiciones primitivas (subtype: 'primitivo') no propagan dependencias:
// son conceptos no definidos (punto, recta, plano) cuyos axiomas las gobiernan
// pero no las definen. Las definiciones derivadas sí propagan sus dependencias
// normales (links + ConceptLinks con isDependency=true).


// Pass 2: Build AND/OR logic graph
interface GraphNode {
  id: string;
  type: string;
  alternativeGroup?: string;
  subtype?: string;
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
    alternativeGroup: typeof meta.alternativeGroup === 'string' ? meta.alternativeGroup : undefined,
    subtype: meta.subtype || undefined,
    title: meta.title || id,
    description: meta.description || '',
    proofs: [],
    directDependencies: []
  };
}

const HIERARCHY_LEVEL: Record<string, number> = {
  'axioma': 0,
  'lema': 2,
  'definicion': 3,
  'teorema': 3,
  'corolario': 4,
  'demostracion': 5,
  'sistema-axiomatico': 6,
  'modelo': 7,
  'matematico': 10,
  'metodo': 10,
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
        // Las definiciones primitivas son accesibles desde cualquier nivel (Grado 0 absoluto)
        const isDepPrimitive = depMeta.type === 'definicion' && depMeta.subtype === 'primitivo';
        const depLevel = isDepPrimitive ? -1 : (HIERARCHY_LEVEL[depMeta.type] ?? 100);
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
    // Las definiciones primitivas no propagan dependencias (cortafuegos topológico)
    const isPrimitive = meta.type === 'definicion' && meta.subtype === 'primitivo';
    if (isPrimitive) {
      graphNodes[id].directDependencies = [];
    } else {
      const filteredDeps = deps.filter(depId => {
        if (!allNodes.has(depId)) return false;
        const depMeta = metadataMap.get(depId);
        if (!depMeta) {
          console.warn(`[INFO] Enlace filtrado: El nodo '${id}' referencia a '${depId}', pero este último no se indexó en el grafo.`);
          return false;
        }
        // Las definiciones primitivas son accesibles desde cualquier nivel (Grado 0 absoluto)
        const isDepPrimitive = depMeta.type === 'definicion' && depMeta.subtype === 'primitivo';
        const depLevel = isDepPrimitive ? -1 : (HIERARCHY_LEVEL[depMeta.type] ?? 100);
        return depLevel <= nodeLevel;
      });
      graphNodes[id].directDependencies = filteredDeps;
    }
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

function breakCycle(node: string, dep: string) {
  console.warn(`[INFO] Ciclo roto forzosamente: "${node}" -> "${dep}". Se ignorará esta arista.`);
  const gNode = graphNodes[node];
  if (!gNode) return;
  
  if (gNode.directDependencies.includes(dep)) {
    gNode.directDependencies = gNode.directDependencies.filter(d => d !== dep);
  } else if (gNode.proofs) {
    for (const proof of gNode.proofs) {
      if (proof.dependencies.includes(dep)) {
        proof.dependencies = proof.dependencies.filter(d => d !== dep);
      }
    }
  }
}

function dfs(node: string) {
  const c = color.get(node);
  if (c === 'black') return;
  if (c === 'gray') {
    console.error(`\n[ERROR FATAL] Ciclo lógico detectado en el nodo: ${node}`);
    process.exit(1);
  }

  color.set(node, 'gray');

  const deps = adjacencyList[node] || [];

  for (const dep of deps) {
    if (!allNodes.has(dep)) continue;
    if (color.get(dep) === 'gray') {
      breakCycle(node, dep);
      continue;
    }
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

const storeDir = path.resolve(process.cwd(), 'src/entities/graph');
if (!fs.existsSync(storeDir)) {
  fs.mkdirSync(storeDir, { recursive: true });
}
const structurePath = path.join(storeDir, 'graph_structure.json');
fs.writeFileSync(structurePath, JSON.stringify(graphStructure, null, 2));
console.log(`✅ Estructura estática exportada correctamente a src/entities/graph/graph_structure.json`);
