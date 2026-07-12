import { editorApiClient } from '../../persistence/editorApiClient';
import { hashSource } from '../../persistence/revision';
import type { VisualDiagramModel } from '../model/types';
import { parseDiagramSourceLocally, parseDiagramSourceOnServer } from '../source/parser';

export class DiagramRepository {
  async readDiagram(filePath: string, signal?: AbortSignal): Promise<{ source: string; model: VisualDiagramModel | null; version: string }> {
    const response = await editorApiClient.readContent({ path: filePath }, signal);
    const localModel = parseDiagramSourceLocally(response.source);
    
    if (localModel) {
      return {
        source: response.source,
        model: localModel,
        version: response.version,
      };
    }

    // Fallback to server AST parsing
    const serverResult = await parseDiagramSourceOnServer(response.source, signal);
    return {
      source: response.source,
      model: serverResult.status === 'supported' || serverResult.status === 'partially-supported' ? serverResult.model || null : null,
      version: response.version,
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
