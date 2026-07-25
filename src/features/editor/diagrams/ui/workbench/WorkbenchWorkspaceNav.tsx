import React from 'react';
import type { VisualDiagramModel } from '../../model/types';
import type { DiagnosticSummary } from '../../diagnostics/types';
import { formatDiagnosticTabDetail } from '../../diagnostics';

export type WorkbenchWorkspaceTab = 'build' | 'steps' | 'targets' | 'check' | 'source';

interface WorkbenchWorkspaceNavProps {
  model: VisualDiagramModel;
  workspace: WorkbenchWorkspaceTab;
  mdxTargetsCount: number;
  diagnosticSummary: DiagnosticSummary;
  diagnosticsAcknowledged: boolean;
  onSelectWorkspace: (tab: WorkbenchWorkspaceTab) => void;
  onAcknowledgeDiagnostics: () => void;
}

function sectionTabClass(active: boolean, hasErrors = false): string {
  const errorBadge = hasErrors ? ' ring-2 ring-granada/40' : '';
  return `min-h-10 whitespace-nowrap rounded-lg px-3 py-1.5 text-left text-xs font-bold transition-all ${errorBadge} ${
    active ? 'bg-carbon text-lienzo shadow-xs' : 'text-carbon/65 hover:bg-carbon/5 hover:text-carbon'
  }`;
}

function sectionDetailClass(active: boolean): string {
  return `ml-1 font-mono text-[9px] ${active ? 'text-lienzo/70' : 'text-carbon/40'}`;
}

export const WorkbenchWorkspaceNav: React.FC<WorkbenchWorkspaceNavProps> = ({
  model,
  workspace,
  mdxTargetsCount,
  diagnosticSummary,
  diagnosticsAcknowledged,
  onSelectWorkspace,
  onAcknowledgeDiagnostics,
}) => {
  const objectCount = model.points.length + model.elements.length + model.sliders.length;
  const stepCount = model.steps.length;
  const hasErrors = diagnosticSummary.errorCount > 0 && !diagnosticsAcknowledged;

  const tabs: readonly [WorkbenchWorkspaceTab, string, string][] = [
    ['build', 'Diseñar', `${objectCount} objetos`],
    ['steps', 'Secuencia', `${stepCount} pasos`],
    ['targets', 'Enlaces MDX', `${mdxTargetsCount} targets`],
    ['check', 'Comprobar', formatDiagnosticTabDetail(diagnosticSummary)],
    ['source', 'Código TSX', 'Avanzado'],
  ];

  return (
    <>
      {/* Mobile Select Navigation */}
      <label className="flex min-h-12 shrink-0 items-center gap-3 border-b border-carbon/15 bg-lienzo px-3 ac-label ac-label--sm sm:hidden">
        Tarea
        <select
          aria-label="Tarea del editor de diagramas"
          className="min-h-9 min-w-0 flex-1 rounded-md border border-carbon/15 bg-lienzo px-2 text-xs font-bold normal-case tracking-normal text-carbon"
          value={workspace}
          onChange={(e) => onSelectWorkspace(e.target.value as WorkbenchWorkspaceTab)}
        >
          <option value="build">Diseñar</option>
          <option value="steps">Secuencia</option>
          <option value="targets">Enlaces MDX</option>
          <option value="check">Comprobar</option>
          <option value="source">Código TSX</option>
        </select>
      </label>

      {/* Desktop Tab Navigation */}
      <nav
        className="hidden shrink-0 items-center gap-1 overflow-x-auto border-b border-carbon/15 bg-lienzo px-2 py-1.5 sm:flex sm:px-3"
        role="tablist"
        aria-label="Tareas del editor de diagramas"
      >
        {tabs.map(([id, label, detail]) => {
          const isActive = workspace === id;
          const isCheckTabWithErrors = id === 'check' && hasErrors;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-label={label}
              aria-selected={isActive}
              onClick={() => {
                onSelectWorkspace(id);
                if (id === 'check') {
                  onAcknowledgeDiagnostics();
                }
              }}
              className={sectionTabClass(isActive, isCheckTabWithErrors)}
            >
              {label}{' '}
              <span
                className={`hidden sm:inline ${sectionDetailClass(isActive)} ${
                  id === 'check' && diagnosticSummary.errorCount > 0 ? 'text-granada font-bold' : ''
                }`}
              >
                {detail}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
