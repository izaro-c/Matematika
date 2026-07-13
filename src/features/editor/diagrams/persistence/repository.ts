import { editorApiClient } from '../../persistence/editorApiClient';
import { hashSource } from '../../persistence/revision';
import type { VisualDiagramModel } from '../model/types';
import { classifyEmbeddedDiagramSource, parseDiagramSourceOnServer } from '../source/parser';
import type { DiagramDiagnostic } from '../source/generator';
import type { DiagramParseStatus } from '../state/types';

export interface ReadDiagramResult {
  source: string;
  model: VisualDiagramModel | null;
  version: string;
  parseStatus: DiagramParseStatus;
  diagnostics: DiagramDiagnostic[];
}

export class DiagramRepository {
  async readDiagram(filePath: string, signal?: AbortSignal): Promise<ReadDiagramResult> {
    const response = await editorApiClient.readContent({ path: filePath }, signal);
    const localClassification = classifyEmbeddedDiagramSource(response.source);
    
    if (localClassification?.status === 'visual-exact') {
      return {
        source: response.source,
        model: localClassification.model,
        version: response.version,
        parseStatus: 'visual-exact',
        diagnostics: [],
      };
    }

    // Fallback to server AST parsing
    const serverResult = await parseDiagramSourceOnServer(response.source, signal);
    if (serverResult.status === 'visual-exact') {
      return {
        source: response.source,
        model: serverResult.model,
        version: response.version,
        parseStatus: 'visual-exact',
        diagnostics: serverResult.diagnostics,
      };
    }

    if (serverResult.status === 'code-preview') {
      return {
        source: response.source,
        version: response.version,
        model: null,
        parseStatus: 'code-preview',
        diagnostics: serverResult.diagnostics,
      };
    }

    return {
      source: response.source,
      version: response.version,
      model: null,
      parseStatus: 'invalid',
      diagnostics: serverResult.diagnostics,
    };
  }

  async saveDiagram(
    filePath: string,
    source: string,
    expectedVersion: string,
    signal?: AbortSignal
  ): Promise<{ version: string; backupId: string }> {
    const sourceHash = await hashSource(source);
    const response = await editorApiClient.applyContent({
      path: filePath,
      source,
      sourceHash,
      expectedVersion,
      localRevision: 0,
    }, signal);

    return {
      version: response.version,
      backupId: response.backupId,
    };
  }

  async updateMdxImports(
    mdxPath: string,
    componentName: string,
    diagramPath: string,
    mode: 'simulation' | 'diagram' | 'inline',
    signal?: AbortSignal
  ): Promise<{ success: boolean; modified: boolean }> {
    // Call the newly created update-imports-exports route
    const response = await fetch('/api/content/update-imports-exports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: mdxPath,
        componentName,
        importPath: diagramPath.replace(/^src\//, '@/').replace(/\.tsx$/, ''),
        mode
      }),
      signal
    });
    if (!response.ok) {
      throw new Error(`Failed to update imports/exports in MDX: ${await response.text()}`);
    }
    return await response.json() as { success: boolean; modified: boolean };
  }
}

export const diagramRepository = new DiagramRepository();
