import { useEffect } from 'react';
import { getCSSVar } from '@/shared/diagrams/core/MathUtils';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Html, Line } from '@react-three/drei';
import { useMathStore } from '@/app/providers/MathStoreContext';


function SceneContent() {
  const { camera } = useThree();
  const highlight = useMathStore((state: any) => state.variables?.['highlight']);

  useEffect(() => {
    camera.position.set(4, 3, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  const salvia = getCSSVar('--theme-salvia') || '#A2C2A2';
  const terracota = getCSSVar('--theme-terracota') || '#C86446';
  const carbon = getCSSVar('--theme-carbon') || '#333333';
  const ocre = getCSSVar('--theme-ocre') || '#c49b4f';

  const planeColor = highlight === 'plano-pi' ? ocre : salvia;
  const pAColor = highlight === 'pA' ? ocre : terracota;
  const pBColor = highlight === 'pB' ? ocre : terracota;
  const pCColor = highlight === 'pC' ? ocre : terracota;
  const pDColor = highlight === 'pD' ? ocre : carbon;
  const edgeColor = highlight === 'pD' ? ocre : carbon;

  const posA = new THREE.Vector3(-1.5, 0, -1);
  const posB = new THREE.Vector3(1.5, 0, 1);
  const posC = new THREE.Vector3(1, 0, -1.5);
  const posD = new THREE.Vector3(0, 2.5, 0);

  return (
    <>
      <OrbitControls enablePan={true} enableZoom={true} autoRotate={true} autoRotateSpeed={1.0} />
      <gridHelper args={[8, 8, carbon, carbon]} material-opacity={0.05} material-transparent />

      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5, 5]} />
        <meshBasicMaterial color={planeColor} transparent opacity={highlight === 'plano-pi' ? 0.4 : 0.2} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      {/* Tetrahedron edges connecting D to A, B, C */}
      <Line points={[posD, posA]} color={edgeColor} lineWidth={2} transparent opacity={highlight === 'pD' ? 0.8 : 0.3} />
      <Line points={[posD, posB]} color={edgeColor} lineWidth={2} transparent opacity={highlight === 'pD' ? 0.8 : 0.3} />
      <Line points={[posD, posC]} color={edgeColor} lineWidth={2} transparent opacity={highlight === 'pD' ? 0.8 : 0.3} />

      {/* Base edges (dotted/transparent) */}
      <Line points={[posA, posB]} color={carbon} lineWidth={1.5} transparent opacity={0.2} />
      <Line points={[posB, posC]} color={carbon} lineWidth={1.5} transparent opacity={0.2} />
      <Line points={[posC, posA]} color={carbon} lineWidth={1.5} transparent opacity={0.2} />

      <mesh position={posA}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshBasicMaterial color={pAColor} />
        <Html position={[0.2, 0.2, 0]} className={`font-serif italic text-xl ${highlight === 'pA' ? 'text-ocre font-bold' : 'text-carbon'}`}>A</Html>
      </mesh>

      <mesh position={posB}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshBasicMaterial color={pBColor} />
        <Html position={[0.2, 0.2, 0]} className={`font-serif italic text-xl ${highlight === 'pB' ? 'text-ocre font-bold' : 'text-carbon'}`}>B</Html>
      </mesh>

      <mesh position={posC}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshBasicMaterial color={pCColor} />
        <Html position={[0.2, 0.2, 0]} className={`font-serif italic text-xl ${highlight === 'pC' ? 'text-ocre font-bold' : 'text-carbon'}`}>C</Html>
      </mesh>

      <mesh position={posD}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshBasicMaterial color={pDColor} />
        <Html position={[0.2, 0.2, 0]} className={`font-serif italic text-2xl font-bold ${highlight === 'pD' ? 'text-ocre' : 'text-carbon'}`}>D</Html>
      </mesh>

      <Html position={[-2, 0.1, 2]} className={`font-serif italic text-3xl ${highlight === 'plano-pi' ? 'text-ocre font-bold' : 'text-carbon/60'}`}>π</Html>
    </>
  );
}

export const Incidence8 = () => (
  <div className="w-full h-full min-h-[350px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
    <Canvas gl={{ antialias: true }}><SceneContent /></Canvas>
  </div>
);
