import { useEffect } from 'react';
import { getCSSVar } from '@/shared/diagrams/core/MathUtils';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Html, Line } from '@react-three/drei';
import { useMathStore } from '@/shared/lib/MathStoreContext';


function SceneContent() {
  const { camera } = useThree();
  const highlight = useMathStore((state: any) => state.variables?.['highlight']);

  useEffect(() => {
    camera.position.set(4, 3, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  const salvia = getCSSVar('--theme-salvia');
  const terracota = getCSSVar('--theme-terracota');
  const carbon = getCSSVar('--theme-carbon');
  const ocre = getCSSVar('--theme-ocre');

  const planeColor = highlight === 'plano' ? ocre : salvia;
  const pAColor = highlight === 'pA' ? ocre : terracota;
  const pBColor = highlight === 'pB' ? ocre : terracota;
  const lineColor = highlight === 'recta' ? ocre : carbon;

  const points = [new THREE.Vector3(-3, 0, -1.5), new THREE.Vector3(3, 0, 1.5)];

  return (
    <>
      <OrbitControls enablePan={true} enableZoom={true} autoRotate={true} autoRotateSpeed={1.0} />
      <gridHelper args={[8, 8, carbon, carbon]} material-opacity={0.08} material-transparent />

      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5, 5]} />
        <meshBasicMaterial color={planeColor} transparent opacity={highlight === 'plano' ? 0.4 : 0.2} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      <Line points={points} color={lineColor} lineWidth={3} />

      <mesh position={[-1, 0, -0.5]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshBasicMaterial color={pAColor} />
        <Html position={[0.2, 0.2, 0]} className={`font-serif italic text-xl ${highlight === 'pA' ? 'text-ocre font-bold' : 'text-carbon'}`}>A</Html>
      </mesh>

      <mesh position={[1, 0, 0.5]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshBasicMaterial color={pBColor} />
        <Html position={[0.2, 0.2, 0]} className={`font-serif italic text-xl ${highlight === 'pB' ? 'text-ocre font-bold' : 'text-carbon'}`}>B</Html>
      </mesh>

      <Html position={[2, 0.2, 1]} className={`font-serif italic text-2xl ${highlight === 'recta' ? 'text-ocre font-bold' : 'text-carbon'}`}>l</Html>
      <Html position={[-2, 0.1, 2]} className={`font-serif italic text-2xl ${highlight === 'plano' ? 'text-ocre font-bold' : 'text-carbon/60'}`}>π</Html>
    </>
  );
}

export const Incidence6 = () => (
  <div className="w-full h-full min-h-[350px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
    <Canvas gl={{ antialias: true }}><SceneContent /></Canvas>
  </div>
);
