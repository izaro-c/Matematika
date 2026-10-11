import { useRef, useEffect } from 'react';
import { getCSSVar } from '@/diagrams/jsxgraph/MathUtils';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Html, Line } from '@react-three/drei';
import { useMathStore } from '@/lib/page-context/MathStoreContext';
import { useDiagramTargetRegistry, matchesScopedDiagramTarget } from '@/lib/page-context/DiagramTargetRegistryContext';

const SCOPE_ID = 'incidence7';

function SceneContent() {
  const { camera } = useThree();
  const highlight = useMathStore((state: any) => state.variables?.['highlight']);
  const setVariable = useMathStore((state: any) => state.setVariable);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    camera.position.set(4, 4, 5);
    camera.lookAt(0, 0, 0);
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

  const isPiHighlighted = isMatch('plano-pi', ['plano']);
  const isSigmaHighlighted = isMatch('plano-sigma');
  const isLineHighlighted = isMatch('recta-l', ['recta', 'line']);
  const isPAHighlighted = isMatch('pA');
  const isPBHighlighted = isMatch('pB');

  const piColor = isPiHighlighted ? terracota : canela;
  const sigmaColor = isSigmaHighlighted ? terracota : ocre;
  const lineColor = isLineHighlighted ? terracota : carbon;
  const pAColor = isPAHighlighted ? ocre : terracota;
  const pBColor = isPBHighlighted ? ocre : terracota;

  // Intersecting line points (along X axis)
  const linePoints = [new THREE.Vector3(-3, 0, 0), new THREE.Vector3(3, 0, 0)];

  return (
    <>
      <OrbitControls ref={controlsRef} enablePan={true} enableZoom={true} autoRotate={true} autoRotateSpeed={1.0} />

      {/* Plane Pi (horizontal) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerOver={(e) => { e.stopPropagation(); setVariable('highlight', `${SCOPE_ID}:plano-pi`); }}
        onPointerOut={() => setVariable('highlight', null)}
      >
        <planeGeometry args={[5, 5]} />
        <meshBasicMaterial color={piColor} transparent opacity={isPiHighlighted ? 0.45 : 0.25} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      {/* Plane Sigma (tilted) */}
      <mesh
        rotation={[-Math.PI / 4, 0, 0]}
        onPointerOver={(e) => { e.stopPropagation(); setVariable('highlight', `${SCOPE_ID}:plano-sigma`); }}
        onPointerOut={() => setVariable('highlight', null)}
      >
        <planeGeometry args={[5, 5]} />
        <meshBasicMaterial color={sigmaColor} transparent opacity={isSigmaHighlighted ? 0.45 : 0.25} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      <Line points={linePoints} color={lineColor} lineWidth={isLineHighlighted ? 5 : 3} />

      {/* Common point A */}
      <mesh
        position={[-1.2, 0, 0]}
        onPointerOver={(e) => { e.stopPropagation(); setVariable('highlight', `${SCOPE_ID}:pA`); }}
        onPointerOut={() => setVariable('highlight', null)}
      >
        <sphereGeometry args={[isPAHighlighted ? 0.22 : 0.15, 32, 32]} />
        <meshBasicMaterial color={pAColor} />
        <Html position={[0.2, 0.25, 0]} className={`font-serif italic text-xl ${isPAHighlighted ? 'text-ocre font-bold drop-shadow-md' : 'text-carbon'}`}>A</Html>
      </mesh>

      {/* Common point B */}
      <mesh
        position={[1.2, 0, 0]}
        onPointerOver={(e) => { e.stopPropagation(); setVariable('highlight', `${SCOPE_ID}:pB`); }}
        onPointerOut={() => setVariable('highlight', null)}
      >
        <sphereGeometry args={[isPBHighlighted ? 0.22 : 0.15, 32, 32]} />
        <meshBasicMaterial color={pBColor} />
        <Html position={[0.2, 0.25, 0]} className={`font-serif italic text-xl ${isPBHighlighted ? 'text-ocre font-bold drop-shadow-md' : 'text-carbon'}`}>B</Html>
      </mesh>

      <Html position={[-2, 0.2, 2]} className={`font-serif italic text-3xl ${isPiHighlighted ? 'text-terracota font-bold drop-shadow-md' : 'text-canela/80'}`}>π</Html>
      <Html position={[-2, 1.5, -1.5]} className={`font-serif italic text-3xl ${isSigmaHighlighted ? 'text-terracota font-bold drop-shadow-md' : 'text-ocre/80'}`}>σ</Html>
      <Html position={[2.5, 0.3, 0]} className={`font-serif italic text-2xl ${isLineHighlighted ? 'text-terracota font-bold drop-shadow-md' : 'text-carbon'}`}>l</Html>
    </>
  );
}

export const Incidence7: React.FC = () => {
  const targetRegistry = useDiagramTargetRegistry();
  useEffect(() => {
    return targetRegistry.register(SCOPE_ID, [
      { targetId: 'pA', objectId: 'pA', label: 'Punto común A', kind: 'object' },
      { targetId: 'pB', objectId: 'pB', label: 'Punto común B', kind: 'object' },
      { targetId: 'plano-pi', objectId: 'plano-pi', label: 'Plano π', kind: 'object' },
      { targetId: 'plano', objectId: 'plano-pi', label: 'Plano π', kind: 'object' },
      { targetId: 'plano-sigma', objectId: 'plano-sigma', label: 'Plano σ', kind: 'object' },
      { targetId: 'recta-l', objectId: 'recta-l', label: 'Recta de intersección l', kind: 'object' },
      { targetId: 'recta', objectId: 'recta-l', label: 'Recta de intersección l', kind: 'object' },
    ]);
  }, [targetRegistry]);

  return (
    <div className="w-full h-full min-h-[350px] relative bg-lienzo/40 border border-mora/10 rounded-sm overflow-hidden">
      <Canvas gl={{ antialias: true }}><SceneContent /></Canvas>
    </div>
  );
};
