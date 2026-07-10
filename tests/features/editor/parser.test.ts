import { describe, it, expect } from 'vitest';
import { parseBodyToBlocks, parseInlineNodes, stringifyBlocksToBody } from '@/features/editor/core/parser';

describe('Editor MDX Parser', () => {
  it('should parse paragraphs and serialize back correctly', () => {
    const rawBody = `<Capitular letra="E" />ste es un párrafo de texto normal.\n\nEste es un segundo párrafo.`;
    const blocks = parseBodyToBlocks(rawBody);

    expect(blocks).toHaveLength(2);
    expect(blocks[0].type).toBe('paragraph');
    expect(blocks[0].content).toBe('Este es un párrafo de texto normal.');
    expect(blocks[1].type).toBe('paragraph');
    expect(blocks[1].content).toBe('Este es un segundo párrafo.');

    const rebuiltBody = stringifyBlocksToBody(blocks);
    expect(rebuiltBody).toBe(rawBody);
  });

  it('should parse formula boxes', () => {
    const rawBody = `<Formula>\n  $$ x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} $$\n</Formula>`;
    const blocks = parseBodyToBlocks(rawBody);

    expect(blocks).toHaveLength(1);
    expect(blocks[0].type).toBe('formula');
    expect(blocks[0].content).toBe('$$ x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} $$');

    const rebuiltBody = stringifyBlocksToBody(blocks);
    expect(rebuiltBody).toBe(rawBody);
  });

  it('should parse and serialize markdown lists as visual list blocks', () => {
    const rawBody = `- Primer elemento con $x$\n- Segundo elemento con **énfasis**`;
    const blocks = parseBodyToBlocks(rawBody);

    expect(blocks).toHaveLength(1);
    expect(blocks[0].type).toBe('list');
    expect(blocks[0].content).toBe('Primer elemento con $x$\nSegundo elemento con **énfasis**');
    expect(blocks[0].metadata?.ordered).toBe(false);
    expect(stringifyBlocksToBody(blocks)).toBe(rawBody);
  });

  it('should parse and serialize markdown tables as visual table blocks', () => {
    const rawBody = `| Magnitud | Valor |\n|---|---|\n| a | $1$ |`;
    const blocks = parseBodyToBlocks(rawBody);

    expect(blocks).toHaveLength(1);
    expect(blocks[0].type).toBe('table');
    expect(blocks[0].content).toBe(rawBody);
    expect(stringifyBlocksToBody(blocks)).toBe(rawBody);
  });

  it('should parse inline semantic links, emphasis and inline latex as nodes', () => {
    const nodes = parseInlineNodes('Un **cateto** mide $a$ y <ConceptLink targetId="altura" highlightTarget="segAltura">altura</ConceptLink>.');

    expect(nodes).toEqual(expect.arrayContaining([
      { type: 'bold', value: 'cateto' },
      { type: 'inlineLatex', value: 'a' },
      expect.objectContaining({
        type: 'conceptLink',
        value: 'altura',
        attrs: expect.objectContaining({ targetId: 'altura', highlightTarget: 'segAltura' }),
      }),
    ]));
  });

  it('should parse common inline markdown variants and unquoted JSX attributes', () => {
    const nodes = parseInlineNodes('__base__ y _altura_ conectan <ConceptLink targetId=altura highlightTarget=segAltura highlightColor=salvia>altura</ConceptLink>.');

    expect(nodes).toEqual(expect.arrayContaining([
      { type: 'bold', value: 'base' },
      { type: 'italic', value: 'altura' },
      expect.objectContaining({
        type: 'conceptLink',
        value: 'altura',
        attrs: expect.objectContaining({
          targetId: 'altura',
          highlightTarget: 'segAltura',
          highlightColor: 'salvia',
        }),
      }),
    ]));
  });

  it('should parse and serialize interactive exercise steps as editable blocks', () => {
    const rawBody = `<PasoEjercicio\n  id="p1"\n  numero={1}\n  titulo="Planteamiento"\n  questionIds={["p1_q1"]}\n>\n  Identifica la ecuación.\n\n  <Pregunta id="p1_q1" correct="a" texto="Pregunta" options={["a", "b"]} />\n\n  <Resolucion>\n    Se justifica la respuesta.\n  </Resolucion>\n</PasoEjercicio>`;
    const blocks = parseBodyToBlocks(rawBody);

    expect(blocks).toHaveLength(1);
    expect(blocks[0].type).toBe('exercise');
    expect(blocks[0].metadata).toMatchObject({
      component: 'PasoEjercicio',
      id: 'p1',
      numero: 1,
      titulo: 'Planteamiento',
      questionIds: ['p1_q1'],
    });
    expect(blocks[0].content).toContain('<Pregunta');
    expect(stringifyBlocksToBody(blocks)).toContain('<PasoEjercicio');
    expect(stringifyBlocksToBody(blocks)).toContain('<Resolucion>');
  });

  it('should preserve spaces inside serialized exercise attributes', () => {
    const blocks = parseBodyToBlocks(`<PasoEjercicio id="p1" numero={1} titulo="Cálculo final" questionIds={["q1"]}>\n  Texto.\n</PasoEjercicio>`);
    const serialized = stringifyBlocksToBody(blocks);

    expect(serialized).toContain('titulo="Cálculo final"');
    expect(serialized).not.toContain('titulo="Cálculo\n  final"');
  });

  it('should parse demonstrations and proof steps', () => {
    const rawBody = `<Demostracion>\n  <ProofStep number={1} title="Paso 1" justificacion="Porque sí" />\n  <ProofStep number={2} title="Paso 2" justificacion="Definición" />\n</Demostracion>`;
    const blocks = parseBodyToBlocks(rawBody);

    expect(blocks).toHaveLength(1);
    expect(blocks[0].type).toBe('demonstration');
    expect(blocks[0].metadata?.steps).toHaveLength(2);
    expect(blocks[0].metadata?.steps[0]).toEqual({
      number: 1,
      title: 'Paso 1',
      justificacion: 'Porque sí',
      target: '',
      body: '',
      justificationType: undefined,
      dependencyId: ''
    });

    const rebuiltBody = stringifyBlocksToBody(blocks);
    expect(rebuiltBody).toBe(rawBody);
  });

  it('should preserve ProofStep bodies and semantic proof attributes', () => {
    const rawBody = `<Demostracion>\n  <ProofStep number={1} target="segAB" title="Paso con diagrama" justificacion="Definición de segmento" justificationType="definicion" dependencyId="segmento">\n    El elemento <InteractiveElement target="segAB" color="salvia">AB</InteractiveElement> queda determinado por sus extremos.\n  </ProofStep>\n</Demostracion>`;
    const blocks = parseBodyToBlocks(rawBody);

    expect(blocks[0].type).toBe('demonstration');
    expect(blocks[0].metadata?.steps[0]).toMatchObject({
      number: 1,
      target: 'segAB',
      title: 'Paso con diagrama',
      justificacion: 'Definición de segmento',
      justificationType: 'definicion',
      dependencyId: 'segmento',
    });
    expect(blocks[0].metadata?.steps[0].body).toContain('<InteractiveElement');
    expect(stringifyBlocksToBody(blocks)).toBe(rawBody);
  });

  it('should parse diagrams, citations and definition boxes', () => {
    const rawBody = `<TrianguloDeformable color="salvia" size={300} />\n\n<Cita author="Pitagoras">\n  El todo es la suma.\n</Cita>\n\n<Definicion title="Suma">\n  Operacion aritmetica.\n</Definicion>`;
    const blocks = parseBodyToBlocks(rawBody);

    expect(blocks).toHaveLength(3);
    
    expect(blocks[0].type).toBe('diagram');
    expect(blocks[0].content).toBe('TrianguloDeformable');
    expect(blocks[0].metadata?.color).toBe('salvia');
    expect(blocks[0].metadata?.size).toBe(300);

    expect(blocks[1].type).toBe('citation');
    expect(blocks[1].metadata?.author).toBe('Pitagoras');
    expect(blocks[1].content).toBe('El todo es la suma.');

    expect(blocks[2].type).toBe('definition_box');
    expect(blocks[2].metadata?.title).toBe('Suma');
    expect(blocks[2].content).toBe('Operacion aritmetica.');

    const rebuiltBody = stringifyBlocksToBody(blocks);
    expect(rebuiltBody).toBe(rawBody);
  });

  it('should parse and serialize complex InteractiveGeometryCanvas attributes', () => {
    const rawBody = `<InteractiveGeometryCanvas points='[{"id":"p-1","x":100,"y":150,"label":"A"}]' segments='[{"id":"s-1","p1":"p-1","p2":"p-2","color":"salvia"}]' polygons='[]' />`;
    const blocks = parseBodyToBlocks(rawBody);

    expect(blocks).toHaveLength(1);
    expect(blocks[0].type).toBe('diagram');
    expect(blocks[0].content).toBe('InteractiveGeometryCanvas');
    expect(blocks[0].metadata?.points).toHaveLength(1);
    expect(blocks[0].metadata?.points[0]).toEqual({ id: 'p-1', x: 100, y: 150, label: 'A' });
    expect(blocks[0].metadata?.segments[0].color).toBe('salvia');

    const rebuiltBody = stringifyBlocksToBody(blocks);
    expect(rebuiltBody).toBe(rawBody);
  });

  it('should handle mixed structures preserving order', () => {
    const rawBody = `<Capitular letra="T" />exto de intro.\n\n<Formula>\n  $$ 1 + 1 = 2 $$\n</Formula>\n\nTexto entre formula y demo.\n\n<Demostracion>\n  <ProofStep number={1} title="Axioma" justificacion="Lógica" />\n</Demostracion>\n\nTexto final.`;
    const blocks = parseBodyToBlocks(rawBody);

    expect(blocks).toHaveLength(5);
    expect(blocks[0].type).toBe('paragraph');
    expect(blocks[1].type).toBe('formula');
    expect(blocks[2].type).toBe('paragraph');
    expect(blocks[3].type).toBe('demonstration');
    expect(blocks[4].type).toBe('paragraph');

    const rebuiltBody = stringifyBlocksToBody(blocks);
    expect(rebuiltBody).toBe(rawBody);
  });
});
