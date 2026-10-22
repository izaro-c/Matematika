import fs from 'fs';
import path from 'path';
import { listMdxFiles, readMdxMetadata } from './mdxSource';

function parseMetadata(content: string, filePath: string): Record<string, any> | null {
  const result = readMdxMetadata(content);
  if (result.status === 'invalid') {
    console.error(`\n[ERROR CRÍTICO] Fallo de sintaxis en los metadatos de: ${filePath}`);
    console.error(result.error);
  }
  return result.status === 'ok' ? result.metadata : null;
}

console.log("Iniciando validación del DAG lógico y reconstrucción del árbol...");

const contentDir = path.resolve(process.cwd(), 'content/mdx');
const mdxFiles = listMdxFiles(contentDir);

const CANONICAL_LANG = 'es';
const allNodes = new Set<string>();
/** Campos de metadatos que usa la validación del grafo; el resto se conserva sin tipar. */
interface NodeMeta extends Record<string, unknown> {
  type?: string;
  subtype?: string;
  title?: string;
  description?: string;
  parentTheorem?: string;
}

const metadataMap = new Map<string, NodeMeta>();
const contentDepsMap = new Map<string, string[]>();
/** Sistemas por idioma: `metadataMap` conserva solo la última traducción de cada ID. */
const systemsByLang = new Map<string, NodeMeta>();

function extractConceptLinkDependencies(content: string): string[] {
  const deps: string[] = [];
  const regex = /<ConceptLink\b([^>]*)>/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(content)) !== null) {
    const attrsStr = match[1];
    // Include ONLY if explicitly marked as a dependency (isDependency={true} or isDependency="true")
    const isExplicitlyTrue = /\bisDependency=\{(?:true|"true")\}|\bisDependency="true"/.test(attrsStr);
    if (!isExplicitlyTrue) continue;

    const singleMatch = attrsStr.match(/\btargetId=(?:["']([^"']+)["']|\{["']([^"']+)["']\})/);
    if (singleMatch) {
      const id = singleMatch[1] || singleMatch[2];
      if (id) deps.push(id);
      continue;
    }

    const arrayMatch = attrsStr.match(/\btargetId=\{\[(.*?)\]\}/);
    if (arrayMatch) {
      const idMatches = arrayMatch[1].matchAll(/["']([^"']+)["']/g);
      for (const m of idMatches) {
        if (m[1]) deps.push(m[1]);
      }
    }
  }
  return deps;
}

// Pass 1: Extract all metadata and auto-infer dependencies from text
function processMdxFile(file: string) {
  const content = fs.readFileSync(file, 'utf-8');
  const metadata = parseMetadata(content, file);

  if (metadata) {
    const slug = path.basename(file, '.mdx');
    const id = (metadata.id as string) || slug;
    // El castellano es el idioma canónico: las traducciones solo rellenan IDs que aún no lo tengan.
    if (metadataMap.has(id) && metadata.lang !== CANONICAL_LANG) {
      if (metadata.type === 'sistema-axiomatico') systemsByLang.set(`${metadata.lang}:${id}`, metadata as NodeMeta);
      return;
    }
    metadata._filePath = file;
    metadataMap.set(id, metadata as NodeMeta);
    if (metadata.type === 'sistema-axiomatico') systemsByLang.set(`${metadata.lang}:${id}`, metadata as NodeMeta);
    allNodes.add(id);

    // Graph edges come from explicit metadata arrays and ConceptLink with isDependency={true}.
    // `demos`, `corollaries` y `parentTheorem` apuntan en sentido inverso y no son antecedentes.
    const contentDeps: string[] = [];
    if (Array.isArray(metadata.links)) contentDeps.push(...metadata.links);
    if (Array.isArray(metadata.requires)) contentDeps.push(...metadata.requires);
    if (Array.isArray(metadata.dependencias)) contentDeps.push(...metadata.dependencias);
    if (Array.isArray(metadata.axiomas)) contentDeps.push(...metadata.axiomas);
    if (Array.isArray(metadata.lemmas)) contentDeps.push(...metadata.lemmas);
    if (Array.isArray(metadata.axioms_verified)) contentDeps.push(...metadata.axioms_verified);
    if (Array.isArray(metadata.extends)) contentDeps.push(...metadata.extends);
    if (metadata.builtIn && typeof metadata.builtIn === 'string') contentDeps.push(metadata.builtIn);
    contentDeps.push(...extractConceptLinkDependencies(content));

    // Remove duplicates
    contentDepsMap.set(id, Array.from(new Set(contentDeps)));
  }
}

mdxFiles.forEach(processMdxFile);

// Un sistema formal no puede contener dos axiomas declarados como alternativas
// del mismo grupo. Esta condición lógica no se manifiesta como un ciclo del DAG.
let axiomaticErrors = 0;
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
    axiomaticErrors += 1;
    console.error(
      `[ERROR] ${systemId} contiene alternativas incompatibles del grupo ${group}: ${alternatives.join(', ')}`,
    );
  }
}

// Un sistema que amplía otro contiene todos sus axiomas: `extends` es inclusión de teorías.
for (const [key, systemMeta] of systemsByLang) {
  if (!Array.isArray(systemMeta.extends)) continue;
  const [lang, systemId] = key.split(':');
  const own = new Set(Array.isArray(systemMeta.axiomas) ? systemMeta.axiomas : []);
  for (const baseId of systemMeta.extends) {
    const baseMeta = systemsByLang.get(`${lang}:${baseId}`);
    if (!baseMeta || !Array.isArray(baseMeta.axiomas)) continue;
    const missing = baseMeta.axiomas.filter((axiomId: unknown) => typeof axiomId === 'string' && !own.has(axiomId));
    if (missing.length === 0) continue;
    axiomaticErrors += 1;
    console.error(`[ERROR] ${lang}/${systemId} amplía ${baseId} pero no incluye sus axiomas: ${missing.join(', ')}`);
  }
}

if (axiomaticErrors > 0) {
  console.error(`\nValidación detenida: ${axiomaticErrors} conflicto(s) axiomático(s).`);
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
  axiomFamily?: string;
  subtype?: string;
  title: string;
  description: string;
  proofs: { id: string; dependencies: string[]; methods: string[] }[];
  directDependencies: string[];
}

const graphNodes: Record<string, GraphNode> = {};

for (const id of allNodes) {
  const meta = metadataMap.get(id)!; // en este punto allNodes solo contiene IDs con metadatos
  graphNodes[id] = {
    id,
    type: meta.type || 'unknown',
    alternativeGroup: typeof meta.alternativeGroup === 'string' ? meta.alternativeGroup : undefined,
    axiomFamily: typeof meta.axiomFamily === 'string' ? meta.axiomFamily : undefined,
    subtype: meta.subtype || undefined,
    title: meta.title || id,
    description: meta.description || '',
    proofs: [],
    directDependencies: []
  };
}

// Tipos que pueden actuar como antecedente deductivo de cualquier nodo.
const DEDUCTIVE_TYPES = new Set(['axioma', 'definicion', 'teorema', 'lema', 'corolario']);
// Los sistemas amplían sistemas (`extends`) y los modelos se construyen en sistemas (`builtIn`).
const SYSTEM_LEVEL_SOURCES = new Set(['sistema-axiomatico', 'modelo']);

let linkedProofs = 0;
let droppedEdges = 0;
let selfDependencies = 0;

/** Arista válida del DAG: el destino existe y es un antecedente deductivo (o un sistema, desde el nivel de sistemas). */
function isValidDependency(sourceId: string, sourceType: string | undefined, depId: string): boolean {
  if (depId === sourceId) {
    console.error(`[ERROR] '${sourceId}' se declara dependencia de sí mismo.`);
    selfDependencies++;
    return false;
  }
  const depMeta = metadataMap.get(depId);
  if (!depMeta) return false; // página futura: la avisa validate-cross-references
  if (DEDUCTIVE_TYPES.has(depMeta.type ?? '')) return true;
  if (depMeta.type === 'sistema-axiomatico' && SYSTEM_LEVEL_SOURCES.has(sourceType ?? '')) return true;
  console.warn(`[WARN] Arista descartada: '${sourceId}' (${sourceType}) -> '${depId}' (${depMeta.type}) no es un antecedente deductivo.`);
  droppedEdges++;
  return false;
}

// Map proofs to their parent theorems
for (const id of allNodes) {
  const meta = metadataMap.get(id)!;
  const deps = contentDepsMap.get(id) || [];

  if (meta.type === 'demostracion') {
    const parentTheoremId = meta.parentTheorem;
    if (parentTheoremId && graphNodes[parentTheoremId]) {
      // El teorema demostrado no es antecedente de su demostración; los métodos se registran aparte.
      const methods = deps.filter(depId => metadataMap.get(depId)?.type === 'metodo');
      const filteredDeps = deps.filter(depId =>
        depId !== parentTheoremId
        && metadataMap.get(depId)?.type !== 'metodo'
        && isValidDependency(id, meta.type, depId));
      graphNodes[parentTheoremId].proofs.push({
        id: id,
        dependencies: filteredDeps,
        methods,
      });
      linkedProofs++;
    } else {
      console.warn(`[WARNING] La demostración '${id}' no tiene un 'parentTheorem' válido o no se encontró su teorema asociado.`);
    }
  } else {
    // Las definiciones primitivas no propagan dependencias (cortafuegos topológico)
    const isPrimitive = meta.type === 'definicion' && meta.subtype === 'primitivo';
    graphNodes[id].directDependencies = isPrimitive
      ? []
      : deps.filter(depId => isValidDependency(id, meta.type, depId));
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

const stack: string[] = [];

function dfs(node: string) {
  if (color.get(node) === 'black') return;

  color.set(node, 'gray');
  stack.push(node);

  for (const dep of adjacencyList[node] || []) {
    if (!allNodes.has(dep)) continue;
    if (color.get(dep) === 'gray') {
      const cycle = [...stack.slice(stack.indexOf(dep)), dep].reverse();
      console.error(`\n[ERROR FATAL] Ciclo lógico: ${cycle.join(' -> ')}`);
      process.exit(1);
    }
    dfs(dep);
  }

  stack.pop();
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
if (droppedEdges > 0) console.warn(`${droppedEdges} arista(s) descartada(s); revisa los avisos anteriores.`);
if (selfDependencies > 0) {
  console.error(`\nValidación detenida: ${selfDependencies} nodo(s) dependen de sí mismos.`);
  process.exit(1);
}

// Pass 4: Export Graph Structure
const graphStructure = {
  topologicalOrder,
  nodes: graphNodes
};

const storeDir = path.resolve(process.cwd(), 'src/data/graph');
if (!fs.existsSync(storeDir)) {
  fs.mkdirSync(storeDir, { recursive: true });
}
const structurePath = path.join(storeDir, 'graph_structure.json');
fs.writeFileSync(structurePath, JSON.stringify(graphStructure, null, 2));
console.log(`✅ Estructura estática exportada correctamente a src/data/graph/graph_structure.json`);
