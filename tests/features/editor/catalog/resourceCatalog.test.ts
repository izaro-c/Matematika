import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  buildEditorResourceCatalog,
  listEditableCatalogResources,
} from '../../../../scripts/editor/buildEditorResourceCatalog';
import { createTemplateModel } from '../../../../src/features/editor/diagrams/model/commands';
import { generateDiagramSource } from '../../../../src/features/editor/diagrams/source/generator';

const roots: string[] = [];

function fixtureRoot(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'matematika-editor-catalog-'));
  roots.push(root);
  return root;
}

function write(root: string, relativePath: string, source: string): void {
  const target = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, source, 'utf8');
}

afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

describe('catálogo seguro del editor', () => {
  it('clasifica las cuatro capacidades y excluye infraestructura de la lista editable', () => {
    const srcRoot = fixtureRoot();
    write(srcRoot, 'database/content/definitions/punto.mdx', '## Punto\n\nTexto editable.\n');

    const exactModel = createTemplateModel('circunferencia', 'Exacto', 'definicion');
    const exact = generateDiagramSource(exactModel, 'Exacto');
    expect(exact.ok).toBe(true);
    if (!exact.ok) return;
    write(srcRoot, 'widgets/diagrams/Definiciones/Exacto.tsx', exact.source);
    write(srcRoot, 'widgets/diagrams/Teoremas/CurvaManual.tsx', `
      const expression = (x: number) => Math.sin(x);
      const steps = [{ id: 'paso-1', expression }];
      export const CurvaManual = () => (
        <section data-overlay="manual">
          <svg><path d="M0 0 C1 2 2 1 3 3" /></svg>
          <output>{steps[0].expression(1)}</output>
        </section>
      );
    `);
    write(srcRoot, 'widgets/diagrams/Teoremas/Invalido.tsx', 'export const Invalido = () => <svg>');
    write(srcRoot, 'widgets/diagrams/index.ts', 'export {};');
    write(srcRoot, 'shared/diagrams/core/MathBoard.tsx', 'export const MathBoard = () => null;');
    write(srcRoot, 'shared/diagrams/core/MathFactory.ts', 'export const createPoint = () => null;');
    write(srcRoot, 'shared/diagrams/core/MathUtils.ts', 'export const utility = true;');
    write(srcRoot, 'shared/diagrams/InteractiveGeometryCanvas.tsx', 'export const InteractiveGeometryCanvas = () => null;');
    write(srcRoot, 'shared/templates/diagrams/base.template.tsx', 'export const Template = () => null;');

    const catalog = buildEditorResourceCatalog({ srcRoot });
    const byName = new Map(catalog.map(item => [item.name, item]));
    expect(byName.get('punto.mdx')).toMatchObject({ kind: 'mdx-document', capability: 'visual-exact' });
    expect(byName.get('Exacto.tsx')).toMatchObject({ kind: 'diagram', capability: 'visual-exact' });
    expect(byName.get('CurvaManual.tsx')).toMatchObject({ kind: 'diagram', capability: 'code-preview' });
    expect(byName.get('Invalido.tsx')).toMatchObject({ kind: 'diagram', capability: 'invalid' });
    for (const name of ['index.ts', 'MathBoard.tsx', 'MathFactory.ts', 'MathUtils.ts', 'InteractiveGeometryCanvas.tsx', 'base.template.tsx']) {
      expect(byName.get(name)).toMatchObject({ kind: 'internal', capability: 'internal' });
    }

    const editable = listEditableCatalogResources(srcRoot);
    expect(editable.map(item => item.name)).toEqual([
      'punto.mdx',
      'Exacto.tsx',
      'CurvaManual.tsx',
      'Invalido.tsx',
    ]);
    expect(editable.every(item => item.path.startsWith('database/content/') || item.path.startsWith('widgets/diagrams/'))).toBe(true);
  });

  it('expone en el repositorio real solo documentos MDX y diagramas finales', () => {
    const srcRoot = path.join(process.cwd(), 'src');
    const editable = listEditableCatalogResources(srcRoot);
    const documents = editable.filter(item => item.kind === 'mdx-document');
    const diagrams = editable.filter(item => item.kind === 'diagram');

    expect(documents).toHaveLength(120);
    expect(documents.every(item => item.path.startsWith('database/content/') && item.path.endsWith('.mdx'))).toBe(true);
    expect(diagrams).toHaveLength(84);
    expect(diagrams.every(item => item.path.startsWith('widgets/diagrams/') && item.path.endsWith('.tsx'))).toBe(true);
    expect(diagrams.filter(item => item.capability === 'visual-exact').map(item => item.path).sort()).toEqual([
      'widgets/diagrams/Axiomas/AxiomaArquimedes.tsx',
      'widgets/diagrams/Axiomas/AxiomaDedekind.tsx',
      'widgets/diagrams/Axiomas/Congruence1.tsx',
      'widgets/diagrams/Axiomas/Congruence2.tsx',
      'widgets/diagrams/Axiomas/Congruence3.tsx',
      'widgets/diagrams/Axiomas/Congruence4.tsx',
      'widgets/diagrams/Axiomas/EuclidParallel.tsx',
      'widgets/diagrams/Axiomas/HyperbolicParallel.tsx',
      'widgets/diagrams/Axiomas/Incidence1.tsx',
      'widgets/diagrams/Axiomas/Incidence2.tsx',
      'widgets/diagrams/Axiomas/Incidence3.tsx',
      'widgets/diagrams/Axiomas/Incidence4.tsx',
      'widgets/diagrams/Axiomas/Order1.tsx',
      'widgets/diagrams/Axiomas/Order2.tsx',
      'widgets/diagrams/Axiomas/Order3.tsx',
      'widgets/diagrams/Axiomas/Pasch.tsx',
      'widgets/diagrams/Axiomas/SAS.tsx',
      'widgets/diagrams/CasosUso/GpsTrilateracion.tsx',
      'widgets/diagrams/Definiciones/Altura.tsx',
      'widgets/diagrams/Definiciones/Angulo.tsx',
      'widgets/diagrams/Definiciones/Bisectriz.tsx',
      'widgets/diagrams/Definiciones/Circunferencia.tsx',
      'widgets/diagrams/Definiciones/Cuadrilatero.tsx',
      'widgets/diagrams/Definiciones/Mediana.tsx',
      'widgets/diagrams/Definiciones/Mediatriz.tsx',
      'widgets/diagrams/Definiciones/Paralelas.tsx',
      'widgets/diagrams/Definiciones/Paralelogramo.tsx',
      'widgets/diagrams/Definiciones/Perpendicular.tsx',
      'widgets/diagrams/Definiciones/Punto.tsx',
      'widgets/diagrams/Definiciones/Recta.tsx',
      'widgets/diagrams/Definiciones/Segmento.tsx',
      'widgets/diagrams/Definiciones/Semirrecta.tsx',
      'widgets/diagrams/Definiciones/Triangulo.tsx',
      'widgets/diagrams/Demos/DemoAnguloExterno.tsx',
      'widgets/diagrams/Demos/DemoAngulosOpuestos.tsx',
      'widgets/diagrams/Demos/DemoAreaAditividad.tsx',
      'widgets/diagrams/Demos/DemoAreaRectangulo_Conmensurable.tsx',
      'widgets/diagrams/Demos/DemoAreaRectangulo_Inconmensurable.tsx',
      'widgets/diagrams/Demos/DemoCongruenciaALA.tsx',
      'widgets/diagrams/Demos/DemoCongruenciaLLL.tsx',
      'widgets/diagrams/Demos/DemoSumaAngulos.tsx',
      'widgets/diagrams/Models/ModeloCartesiano.tsx',
      'widgets/diagrams/Models/ModeloFano.tsx',
      'widgets/diagrams/Models/ModeloPoincare.tsx',
      'widgets/diagrams/Models/ModeloTresPuntos.tsx',
      'widgets/diagrams/Teoremas/AngulosOpuestos.tsx',
      'widgets/diagrams/Teoremas/CongruenciaALA.tsx',
      'widgets/diagrams/Teoremas/CongruenciaLLL.tsx',
      'widgets/diagrams/Teoremas/DesigualdadTriangular.tsx',
      'widgets/diagrams/Teoremas/DosRectasUnPunto.tsx',
      'widgets/diagrams/Teoremas/LemaPuntoMedio.tsx',
      'widgets/diagrams/Teoremas/Pitagoras.tsx',
      'widgets/diagrams/Teoremas/PuntoMedioPerpendicular.tsx',
      'widgets/diagrams/Teoremas/SumaAngulos.tsx',
      'widgets/diagrams/Teoremas/Tales.tsx',
      'widgets/diagrams/Teoremas/TrianguloIsosceles.tsx',
    ]);
    expect(diagrams.filter(item => item.capability === 'code-preview')).toHaveLength(28);
    expect(editable.some(item => ['MathBoard.tsx', 'MathFactory.ts', 'MathUtils.ts', 'InteractiveGeometryCanvas.tsx'].includes(item.name))).toBe(false);
  });
});
