import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import {
  ExerciseProvider,
  Pregunta,
  Hueco,
  Emparejar,
  MatrizInteractiva,
  CanvasInteractivo,
  ExerciseStep,
  ExerciseCard,
} from '@/content-pages/exercise';
import { MathProvider } from '@/lib/page-context/MathStoreContext';

describe('Exercise Modular Components Suite', () => {
  it('renders and validates a Hueco numeric question with tolerances', () => {
    const TestHueco = () => (
      <Hueco id="h1" pregunta="¿Cuánto es 5 + 7?" correct="12" pista="Suma los dos valores" />
    );

    render(
      <MathProvider>
        <ExerciseProvider exerciseId="test-hueco">
          <TestHueco />
        </ExerciseProvider>
      </MathProvider>
    );

    expect(screen.getByText('¿Cuánto es 5 + 7?')).toBeDefined();
    const input = screen.getByPlaceholderText('Respuesta...') as HTMLInputElement;
    const checkBtn = screen.getByText('Comprobar');

    // Introduce incorrect answer
    fireEvent.change(input, { target: { value: '10' } });
    fireEvent.click(checkBtn);

    // Introduce correct answer
    fireEvent.change(input, { target: { value: '12' } });
    fireEvent.click(checkBtn);

    // After answering correctly, it should display 12 as text
    expect(screen.getByText('12')).toBeDefined();
  });

  it('renders Pregunta with integrated ErrorComun and Resolucion tabs', () => {
    const TestPregunta = () => (
      <Pregunta
        id="q_demo"
        texto="¿Es 2 un número primo?"
        correct="si"
        opciones={[
          { value: 'si', texto: 'Sí' },
          { value: 'no', texto: 'No', feedback: '2 sólo tiene como divisores a 1 y 2.' },
        ]}
      >
        <Pregunta.ErrorComun titulo="Confundir número par con no primo">
          El 2 es el único número primo que además es par.
        </Pregunta.ErrorComun>
        <Pregunta.Resolucion>
          2 es primo porque sus únicos divisores positivos son 1 y 2.
        </Pregunta.Resolucion>
      </Pregunta>
    );

    render(
      <MathProvider>
        <ExerciseProvider exerciseId="test-pregunta">
          <TestPregunta />
        </ExerciseProvider>
      </MathProvider>
    );

    expect(screen.getByText('¿Es 2 un número primo?')).toBeDefined();
    const optSi = screen.getByText('Sí');
    fireEvent.click(optSi);

    // Resolution button should appear
    expect(screen.getByText(/Resolución explicada/i)).toBeDefined();
  });

  it('renders MatrizInteractiva and validates all cells', () => {
    const TestMatriz = () => (
      <MatrizInteractiva
        id="m1"
        pregunta="Introduce la matriz identidad de orden 2:"
        correct={[
          ['1', '0'],
          ['0', '1'],
        ]}
      />
    );

    render(
      <MathProvider>
        <ExerciseProvider exerciseId="test-matriz">
          <TestMatriz />
        </ExerciseProvider>
      </MathProvider>
    );

    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    expect(inputs).toHaveLength(4);

    fireEvent.change(inputs[0], { target: { value: '1' } });
    fireEvent.change(inputs[1], { target: { value: '0' } });
    fireEvent.change(inputs[2], { target: { value: '0' } });
    fireEvent.change(inputs[3], { target: { value: '1' } });

    const checkBtn = screen.getByText('Comprobar Matriz');
    fireEvent.click(checkBtn);

    // After success, button disappears and inputs become read-only / completed
    expect(screen.queryByText('Comprobar Matriz')).toBeNull();
  });

  it('supports retry flow in Pregunta and clears error message on try again', () => {
    const TestPreguntaRetry = () => (
      <Pregunta
        id="q_retry"
        texto="¿Es 7 primo?"
        correct="si"
        opciones={[
          { value: 'si', texto: 'Sí' },
          { value: 'no', texto: 'No', feedback: '7 sí es primo.' },
        ]}
      />
    );

    render(
      <MathProvider>
        <ExerciseProvider exerciseId="test-pregunta-retry">
          <TestPreguntaRetry />
        </ExerciseProvider>
      </MathProvider>
    );

    const optNo = screen.getByText('No');
    fireEvent.click(optNo);

    // Error feedback should be shown
    expect(screen.getByText('7 sí es primo.')).toBeDefined();
    const tryAgainBtn = screen.getByText(/Intentar de nuevo/i);
    expect(tryAgainBtn).toBeDefined();

    // Click try again
    fireEvent.click(tryAgainBtn);

    // Error message should disappear
    expect(screen.queryByText('7 sí es primo.')).toBeNull();

    // Select correct option
    const optSi = screen.getByText('Sí');
    fireEvent.click(optSi);
    expect(screen.queryByText(/Intentar de nuevo/i)).toBeNull();
  });

  it('preserves user input in Hueco on wrong answer so user can edit', () => {
    const TestHuecoPreserve = () => (
      <Hueco id="h_preserve" pregunta="Escribe pi aproximado:" correct="3.14" />
    );

    render(
      <MathProvider>
        <ExerciseProvider exerciseId="test-hueco-preserve">
          <TestHuecoPreserve />
        </ExerciseProvider>
      </MathProvider>
    );

    const input = screen.getByPlaceholderText('Respuesta...') as HTMLInputElement;
    const checkBtn = screen.getByText('Comprobar');

    fireEvent.change(input, { target: { value: '3.15' } });
    fireEvent.click(checkBtn);

    // Input must NOT be cleared on wrong answer
    expect(input.value).toBe('3.15');
  });

  it('renders CanvasInteractivo safely when subcomponents are attached', () => {
    const DummyDiagram = ({ onComplete }: { onComplete?: () => void }) => (
      <button onClick={onComplete}>Completar Diagrama</button>
    );

    const TestCanvas = () => (
      <CanvasInteractivo id="canvas_1" title="Lienzo de prueba">
        <DummyDiagram />
        <CanvasInteractivo.ErrorComun titulo="Error al trazar">
          Traza con cuidado
        </CanvasInteractivo.ErrorComun>
      </CanvasInteractivo>
    );

    render(
      <MathProvider>
        <ExerciseProvider exerciseId="test-canvas">
          <TestCanvas />
        </ExerciseProvider>
      </MathProvider>
    );

    expect(screen.getByText('Lienzo de prueba')).toBeDefined();
    expect(screen.getByText('Completar Diagrama')).toBeDefined();
  });

  it('renders locked step indicator when dependencies are incomplete in ExerciseStep', () => {
    const TestSteps = () => (
      <div>
        <ExerciseStep id="s1" numero={1} titulo="Paso 1" questionIds={['q1']}>
          <Pregunta id="q1" texto="Pregunta 1" correct="a" opciones={[{ value: 'a', texto: 'A' }]} />
        </ExerciseStep>
        <ExerciseStep id="s2" numero={2} titulo="Paso 2" questionIds={['q2']} dependeDeQuestions={['q1']}>
          <Pregunta id="q2" texto="Pregunta 2" correct="b" opciones={[{ value: 'b', texto: 'B' }]} />
        </ExerciseStep>
      </div>
    );

    render(
      <MathProvider>
        <ExerciseProvider exerciseId="test-steps">
          <TestSteps />
        </ExerciseProvider>
      </MathProvider>
    );

    // Step 2 should not render questions when locked
    expect(screen.queryByText('Pregunta 2')).toBeNull();
  });

  it('renders Emparejar, supports manual disconnection and validate on check button', () => {
    const pairs = [
      { left: 'Cateto A', right: 'Longitud 3' },
      { left: 'Cateto B', right: 'Longitud 4' },
    ];

    const TestEmparejar = () => (
      <Emparejar id="emp1" pregunta="Empareja los catetos" pairs={pairs} />
    );

    render(
      <MathProvider>
        <ExerciseProvider exerciseId="test-emparejar">
          <TestEmparejar />
        </ExerciseProvider>
      </MathProvider>
    );

    expect(screen.getByText('Empareja los catetos')).toBeDefined();

    // 1. Connect Cateto A with Longitud 4
    const catetoA = screen.getByText('Cateto A');
    const long4 = screen.getByText('Longitud 4');

    fireEvent.click(catetoA);
    fireEvent.click(long4);

    // 2. Disconnect by clicking Cateto A again
    fireEvent.click(catetoA);

    // 3. Connect wrong pairs and click check button
    fireEvent.click(catetoA);
    fireEvent.click(long4);

    const catetoB = screen.getByText('Cateto B');
    const long3 = screen.getByText('Longitud 3');
    fireEvent.click(catetoB);
    fireEvent.click(long3);

    const checkBtn = screen.getByText('Comprobar');
    fireEvent.click(checkBtn);

    // Error feedback should be displayed
    expect(screen.getByText(/Intentar de nuevo/i)).toBeDefined();

    // 4. Click try again
    vi.useFakeTimers();
    const tryAgainBtn = screen.getByText(/Intentar de nuevo/i);
    fireEvent.click(tryAgainBtn);
    act(() => {
      vi.advanceTimersByTime(600);
    });
    vi.useRealTimers();

    // 5. Connect correctly and check
    const catetoA2 = screen.getByText('Cateto A');
    const long32 = screen.getByText('Longitud 3');
    fireEvent.click(catetoA2);
    fireEvent.click(long32);

    const catetoB2 = screen.getByText('Cateto B');
    const long42 = screen.getByText('Longitud 4');
    fireEvent.click(catetoB2);
    fireEvent.click(long42);

    const checkBtn2 = screen.getByText('Comprobar');
    fireEvent.click(checkBtn2);

    // Should be completed
    expect(screen.getByText(/Completado/i)).toBeDefined();
  });

  it('renders ExerciseCard with smooth tab container and supports tab switching', () => {
    const TestCard = () => {
      const [activeTab, setActiveTab] = React.useState<'pregunta' | 'error' | 'resolucion'>('pregunta');
      return (
        <ExerciseCard
          id="test-card"
          activeTab={activeTab}
          onTabChange={setActiveTab}
          errorComunData={{
            titulo: 'Error común test',
            children: <div>Contenido del error común</div>,
          }}
          resolucionData={{
            children: <div>Contenido de la resolución</div>,
          }}
          isCorrect={true}
        >
          <div>Contenido de la pregunta</div>
        </ExerciseCard>
      );
    };

    render(
      <MathProvider>
        <TestCard />
      </MathProvider>
    );

    const tabpanel = screen.getByRole('tabpanel');
    expect(tabpanel.className).toContain('transition-[height]');
    expect(tabpanel.className).toContain('duration-300');
    expect(tabpanel.className).toContain('overflow-hidden');

    expect(screen.getByText('Contenido de la pregunta')).toBeDefined();

    // Click error tab
    const errorTabBtn = screen.getByRole('tab', { name: /Error/i });
    fireEvent.click(errorTabBtn);

    expect(screen.getByText('Contenido del error común')).toBeDefined();

    // Click back to question
    const backBtn = screen.getByText(/Volver a la pregunta/i);
    fireEvent.click(backBtn);

    expect(screen.getByText('Contenido de la pregunta')).toBeDefined();
  });
});
