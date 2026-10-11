import { useRef, useEffect } from 'react';
import { getCSSVar } from '@/diagrams/jsxgraph/MathUtils';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Html } from '@react-three/drei';
import { useMathStore } from '@/lib/page-context/MathStoreContext';
import { useStepBinding } from '@/components/ui/StepBinding';
import { useDiagramTargetRegistry, matchesScopedDiagramTarget } from '@/lib/page-context/DiagramTargetRegistryContext';

const SCOPE_ID = 'plano';

function SceneContent() {
  const { camera } = useThree();

  const mathHighlight = useMathStore((state: any) => state.variables?.['highlight']);
  const setVariable = useMathStore((state: any) => state.setVariable);
  const { activeStep } = useStepBinding();
  const highlight = mathHighlight || activeStep;

  const controlsRef = useRef<any>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    camera.position.set(5, 4, 6);
    camera.lookAt(0, 0, 0);
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, [camera]);

  const canela = getCSSVar('--theme-canela');
  const terracota = getCSSVar('--theme-terracota');
  const carbon = getCSSVar('--theme-carbon');
  const ocre = getCSSVar('--theme-ocre');

  const isMatch = (targetId: string, aliases: string[] = []) => {
    const candidates = [targetId, ...aliases];
    return candidates.some(id =>
      matchesScopedDiagramTarget(highlight, id, SCOPE_ID) ||
      highlight === id ||
      (typeof highlight === 'string' && (highlight === `${SCOPE_ID}:${id}` || highlight.endsWith(`:${id}`)))
    );
  };

  const isPlaneHighlighted = isMatch('plano', ['planeMesh', 'plano-pi']);
  const isPAHighlighted = isMatch('pA');
  const isPBHighlighted = isMatch('pB');
  const isPCHighlighted = isMatch('pC');

  const planeColor = isPlaneHighlighted ? ocre : canela;
  const planeOpacity = isPlaneHighlighted ? 0.45 : 0.3;
  const pointColorA = isPAHighlighted ? ocre : terracota;
  const pointColorB = isPBHighlighted ? ocre : terracota;
  const pointColorC = isPCHighlighted ? ocre : terracota;
  const pointSize = (t: string) => (isMatch(t) ? 0.25 : 0.15);

  return (
    <>
      <OrbitControls ref={controlsRef} enablePan={true} enableZoom={true} autoRotate={true} autoRotateSpeed={1.0} />
      <gridHelper args={[8, 8, carbon, carbon]} material-opacity={0.08} material-transparent />

      <mesh
        ref={meshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerOver={(e) => { e.stopPropagation(); setVariable('highlight', `${SCOPE_ID}:plano`); }}
        onPointerOut={() => setVariable('highlight', null)}
      >
        <planeGeometry args={[5, 5]} />
        <meshBasicMaterial
          color={planeColor}
          transparent
          opacity={planeOpacity}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <mesh
        position={[0, 0, 0]}
        onPointerOver={(e) => { e.stopPropagation(); setVariable('highlight', `${SCOPE_ID}:pA`); }}
        onPointerOut={() => setVariable('highlight', null)}
      >
        <sphereGeometry args={[pointSize('pA'), 32, 32]} />
        <meshBasicMaterial color={pointColorA} />
        <Html position={[0.3, 0.3, 0]} center className={`font-serif italic font-bold text-xl select-none pointer-events-none transition-colors duration-300 ${isPAHighlighted ? 'text-ocre drop-shadow-md' : 'text-carbon'}`}>
          A
        </Html>
      </mesh>

      <mesh
        position={[2, 0, 0]}
        onPointerOver={(e) => { e.stopPropagation(); setVariable('highlight', `${SCOPE_ID}:pB`); }}
        onPointerOut={() => setVariable('highlight', null)}
      >
        <sphereGeometry args={[pointSize('pB'), 32, 32]} />
        <meshBasicMaterial color={pointColorB} />
        <Html position={[0.3, 0.3, 0]} center className={`font-serif italic font-bold text-xl select-none pointer-events-none transition-colors duration-300 ${isPBHighlighted ? 'text-ocre drop-shadow-md' : 'text-carbon'}`}>
          B
        </Html>
      </mesh>

      <mesh
        position={[0.5, 0, 1.8]}
        onPointerOver={(e) => { e.stopPropagation(); setVariable('highlight', `${SCOPE_ID}:pC`); }}
        onPointerOut={() => setVariable('highlight', null)}
      >
        <sphereGeometry args={[pointSize('pC'), 32, 32]} />
        <meshBasicMaterial color={pointColorC} />
        <Html position={[0.3, 0.3, 0]} center className={`font-serif italic font-bold text-xl select-none pointer-events-none transition-colors duration-300 ${isPCHighlighted ? 'text-ocre drop-shadow-md' : 'text-carbon'}`}>
          C
        </Html>
      </mesh>

      <Html position={[-2, 0.1, 2]} center className={`font-serif italic text-2xl select-none pointer-events-none transition-colors duration-300 ${isPlaneHighlighted ? 'text-ocre font-bold drop-shadow-md' : 'text-carbon/60'}`}>
        π
      </Html>
    </>
  );
}

export const Plano = () => {
  const targetRegistry = useDiagramTargetRegistry();
  useEffect(() => {
    return targetRegistry.register(SCOPE_ID, [
      { targetId: 'plano', objectId: 'planeMesh', label: 'Plano π', kind: 'object' },
      { targetId: 'planeMesh', objectId: 'planeMesh', label: 'Plano π', kind: 'object' },
      { targetId: 'plano-pi', objectId: 'planeMesh', label: 'Plano π', kind: 'object' },
      { targetId: 'pA', objectId: 'pA', label: 'Punto A', kind: 'object' },
      { targetId: 'pB', objectId: 'pB', label: 'Punto B', kind: 'object' },
      { targetId: 'pC', objectId: 'pC', label: 'Punto C', kind: 'object' },
    ]);
  }, [targetRegistry]);

  return (
    <div className="w-full h-full min-h-[400px] relative bg-lienzo/40 border border-mora/10 rounded-sm overflow-hidden">
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-mora/50 pointer-events-none">
        Rota la escena en 3D con el ratón
      </div>
      <Canvas gl={{ antialias: true }} style={{ width: '100%', height: '100%' }}>
        <SceneContent />
      </Canvas>
    </div>
  );
};
