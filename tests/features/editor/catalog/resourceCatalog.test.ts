import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  buildEditorResourceCatalog,
  listEditableCatalogResources,
} from '../../../../scripts/editor/buildEditorResourceCatalog';
import { createTemplateModel } from '../../../../src/fixed-pages/editor/diagrams/model';
import { generateDiagramSource } from '../../../../src/fixed-pages/editor/diagrams/source/generator';

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
    write(srcRoot, 'content/mdx/definitions/punto.mdx', '## Punto\n\nTexto editable.\n');

    const exactModel = createTemplateModel('circunferencia', 'Exacto', 'definicion');
    const exact = generateDiagramSource(exactModel, 'Exacto');
    expect(exact.ok).toBe(true);
    if (!exact.ok) return;
    write(srcRoot, 'content/diagrams/Definiciones/Exacto.tsx', exact.source);
    write(srcRoot, 'content/diagrams/Teoremas/CurvaManual.tsx', `
      const expression = (x: number) => Math.sin(x);
      const steps = [{ id: 'paso-1', expression }];
      export const CurvaManual = () => (
        <section data-overlay="manual">
          <svg><path d="M0 0 C1 2 2 1 3 3" /></svg>
          <output>{steps[0].expression(1)}</output>
        </section>
      );
    `);
    write(srcRoot, 'content/diagrams/Teoremas/Invalido.tsx', 'export const Invalido = () => <svg>');
    write(srcRoot, 'content/diagrams/index.ts', 'export {};');
    write(srcRoot, 'src/diagrams/jsxgraph/MathBoard.tsx', 'export const MathBoard = () => null;');
    write(srcRoot, 'src/diagrams/jsxgraph/MathFactory.ts', 'export const createPoint = () => null;');
    write(srcRoot, 'src/diagrams/jsxgraph/MathUtils.ts', 'export const utility = true;');
    write(srcRoot, 'src/diagrams/InteractiveGeometryCanvas.tsx', 'export const InteractiveGeometryCanvas = () => null;');
    write(srcRoot, 'src/content-pages/shared/templates/diagrams/base.template.tsx', 'export const Template = () => null;');

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
      'Exacto.tsx',
      'CurvaManual.tsx',
      'Invalido.tsx',
      'punto.mdx',
    ]);
    expect(editable.every(item => item.path.startsWith('content/mdx/') || item.path.startsWith('content/diagrams/'))).toBe(true);
  });

  it('expone en el repositorio real solo documentos MDX y diagramas finales', () => {
    const srcRoot = process.cwd();
    const editable = listEditableCatalogResources(srcRoot);
    const documents = editable.filter(item => item.kind === 'mdx-document');
    const diagrams = editable.filter(item => item.kind === 'diagram');
    expect(documents.length).toBeGreaterThanOrEqual(123);
    expect(documents.every(item => item.path.startsWith('content/mdx/') && item.path.endsWith('.mdx'))).toBe(true);
    expect(diagrams.length).toBeGreaterThanOrEqual(84);
    expect(diagrams.every(item => item.path.startsWith('content/diagrams/') && item.path.endsWith('.tsx'))).toBe(true);
    expect(diagrams.filter(item => item.capability === 'visual-exact').map(item => item.path).sort()).toEqual([
      'content/diagrams/Axiomas/AxiomaArquimedes.tsx',
      'content/diagrams/Axiomas/AxiomaDedekind.tsx',
      'content/diagrams/Axiomas/Congruence1.tsx',
      'content/diagrams/Axiomas/Congruence2.tsx',
      'content/diagrams/Axiomas/Congruence3.tsx',
      'content/diagrams/Axiomas/Congruence4.tsx',
      'content/diagrams/Axiomas/EuclidParallel.tsx',
      'content/diagrams/Axiomas/HyperbolicParallel.tsx',
      'content/diagrams/Axiomas/Incidence1.tsx',
      'content/diagrams/Axiomas/Incidence2.tsx',
      'content/diagrams/Axiomas/Incidence3.tsx',
      'content/diagrams/Axiomas/Incidence4.tsx',
      'content/diagrams/Axiomas/Order1.tsx',
      'content/diagrams/Axiomas/Order2.tsx',
      'content/diagrams/Axiomas/Order3.tsx',
      'content/diagrams/Axiomas/Pasch.tsx',
      'content/diagrams/Axiomas/SAS.tsx',
      'content/diagrams/CasosUso/GpsTrilateracion.tsx',
      'content/diagrams/Definiciones/Altura.tsx',
      'content/diagrams/Definiciones/Angulo.tsx',
      'content/diagrams/Definiciones/Bisectriz.tsx',
      'content/diagrams/Definiciones/Circunferencia.tsx',
      'content/diagrams/Definiciones/Cuadrilatero.tsx',
      'content/diagrams/Definiciones/EstarEntre.tsx',
      'content/diagrams/Definiciones/Mediana.tsx',
      'content/diagrams/Definiciones/Mediatriz.tsx',
      'content/diagrams/Definiciones/Paralelas.tsx',
      'content/diagrams/Definiciones/Paralelogramo.tsx',
      'content/diagrams/Definiciones/Perpendicular.tsx',
      'content/diagrams/Definiciones/Segmento.tsx',
      'content/diagrams/Definiciones/Semirrecta.tsx',
      'content/diagrams/Definiciones/Triangulo.tsx',
      'content/diagrams/Demos/DemoAnguloExterno.tsx',
      'content/diagrams/Demos/DemoAngulosOpuestos.tsx',
      'content/diagrams/Demos/DemoAreaAditividad.tsx',
      'content/diagrams/Demos/DemoAreaRectangulo_Conmensurable.tsx',
      'content/diagrams/Demos/DemoAreaRectangulo_Inconmensurable.tsx',
      'content/diagrams/Demos/DemoCongruenciaALA.tsx',
      'content/diagrams/Demos/DemoCongruenciaLLL.tsx',
      'content/diagrams/Demos/DemoExistenciaBisectriz.tsx',
      'content/diagrams/Demos/DemoSumaAngulos.tsx',
      'content/diagrams/Ejercicios/EjercicioClasificacionTriangulos.tsx',
      'content/diagrams/Models/ModeloCartesiano.tsx',
      'content/diagrams/Models/ModeloFano.tsx',
      'content/diagrams/Models/ModeloPoincare.tsx',
      'content/diagrams/Models/ModeloTresPuntos.tsx',
      'content/diagrams/Teoremas/AngulosOpuestos.tsx',
      'content/diagrams/Teoremas/CongruenciaALA.tsx',
      'content/diagrams/Teoremas/CongruenciaLLL.tsx',
      'content/diagrams/Teoremas/DesigualdadTriangular.tsx',
      'content/diagrams/Teoremas/DosRectasUnPunto.tsx',
      'content/diagrams/Teoremas/LemaPuntoMedio.tsx',
      'content/diagrams/Teoremas/Pitagoras.tsx',
      'content/diagrams/Teoremas/PuntoMedioPerpendicular.tsx',
      'content/diagrams/Teoremas/SumaAngulos.tsx',
      'content/diagrams/Teoremas/Tales.tsx',
      'content/diagrams/Teoremas/TrianguloIsosceles.tsx',
    ]);
    expect(diagrams.filter(item => item.capability === 'code-preview')).toHaveLength(27);
    expect(editable.some(item => ['MathBoard.tsx', 'MathFactory.ts', 'MathUtils.ts', 'InteractiveGeometryCanvas.tsx'].includes(item.name))).toBe(false);
  });
});
