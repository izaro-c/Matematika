import { useEffect } from 'react';
import { getCSSVar } from '@/diagrams/jsxgraph/MathUtils';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Html, Line } from '@react-three/drei';
import { useMathStore } from '@/lib/page-context/MathStoreContext';
import { useDiagramTargetRegistry, matchesScopedDiagramTarget } from '@/lib/page-context/DiagramTargetRegistryContext';

const SCOPE_ID = 'incidence6';

function SceneContent() {
  const { camera } = useThree();
  const highlight = useMathStore((state: any) => state.variables?.['highlight']);
  const setVariable = useMathStore((state: any) => state.setVariable);

  useEffect(() => {
    camera.position.set(4, 3, 5);
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

  const isPlaneHighlighted = isMatch('plano', ['plano-pi', 'planeMesh']);
  const isPAHighlighted = isMatch('pA');
  const isPBHighlighted = isMatch('pB');
  const isLineHighlighted = isMatch('recta', ['recta-l', 'line']);

  const planeColor = isPlaneHighlighted ? ocre : canela;
  const pAColor = isPAHighlighted ? ocre : terracota;
  const pBColor = isPBHighlighted ? ocre : terracota;
  const lineColor = isLineHighlighted ? ocre : carbon;

  const points = [new THREE.Vector3(-3, 0, -1.5), new THREE.Vector3(3, 0, 1.5)];

  return (
    <>
      <OrbitControls enablePan={true} enableZoom={true} autoRotate={true} autoRotateSpeed={1.0} />
      <gridHelper args={[8, 8, carbon, carbon]} material-opacity={0.08} material-transparent />

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerOver={(e) => { e.stopPropagation(); setVariable('highlight', `${SCOPE_ID}:plano`); }}
        onPointerOut={() => setVariable('highlight', null)}
      >
        <planeGeometry args={[5, 5]} />
        <meshBasicMaterial color={planeColor} transparent opacity={isPlaneHighlighted ? 0.4 : 0.2} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      <Line points={points} color={lineColor} lineWidth={isLineHighlighted ? 5 : 3} />

      <mesh
        position={[-1, 0, -0.5]}
        onPointerOver={(e) => { e.stopPropagation(); setVariable('highlight', `${SCOPE_ID}:pA`); }}
        onPointerOut={() => setVariable('highlight', null)}
      >
        <sphereGeometry args={[isPAHighlighted ? 0.22 : 0.15, 32, 32]} />
        <meshBasicMaterial color={pAColor} />
        <Html position={[0.2, 0.2, 0]} className={`font-serif italic text-xl ${isPAHighlighted ? 'text-ocre font-bold drop-shadow-md' : 'text-carbon'}`}>A</Html>
      </mesh>

      <mesh
        position={[1, 0, 0.5]}
        onPointerOver={(e) => { e.stopPropagation(); setVariable('highlight', `${SCOPE_ID}:pB`); }}
        onPointerOut={() => setVariable('highlight', null)}
      >
        <sphereGeometry args={[isPBHighlighted ? 0.22 : 0.15, 32, 32]} />
        <meshBasicMaterial color={pBColor} />
        <Html position={[0.2, 0.2, 0]} className={`font-serif italic text-xl ${isPBHighlighted ? 'text-ocre font-bold drop-shadow-md' : 'text-carbon'}`}>B</Html>
      </mesh>

      <Html position={[2, 0.2, 1]} className={`font-serif italic text-2xl ${isLineHighlighted ? 'text-ocre font-bold drop-shadow-md' : 'text-carbon'}`}>l</Html>
      <Html position={[-2, 0.1, 2]} className={`font-serif italic text-2xl ${isPlaneHighlighted ? 'text-ocre font-bold drop-shadow-md' : 'text-carbon/60'}`}>π</Html>
    </>
  );
}

export const Incidence6 = () => {
  const targetRegistry = useDiagramTargetRegistry();
  useEffect(() => {
    return targetRegistry.register(SCOPE_ID, [
      { targetId: 'pA', objectId: 'pA', label: 'Punto A', kind: 'object' },
      { targetId: 'pB', objectId: 'pB', label: 'Punto B', kind: 'object' },
      { targetId: 'recta', objectId: 'recta', label: 'Recta l', kind: 'object' },
      { targetId: 'recta-l', objectId: 'recta', label: 'Recta l', kind: 'object' },
      { targetId: 'plano', objectId: 'plano', label: 'Plano π', kind: 'object' },
      { targetId: 'plano-pi', objectId: 'plano', label: 'Plano π', kind: 'object' },
    ]);
  }, [targetRegistry]);

  return (
    <div className="w-full h-full min-h-[350px] relative bg-lienzo/40 border border-mora/10 rounded-sm overflow-hidden">
      <Canvas gl={{ antialias: true }}><SceneContent /></Canvas>
    </div>
  );
};
