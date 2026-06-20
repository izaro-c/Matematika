import { useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Html, Line } from '@react-three/drei';
import { useMathStore } from '../../store/MathStoreContext';

function getCSSVar(name: string): string {
  if (typeof document !== 'undefined') return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return '#000';
}

function SceneContent() {
  const { camera } = useThree();
  const highlight = useMathStore(state => state.variables?.['highlight']);
  const controlsRef = useRef<any>(null);
  
  useEffect(() => {
    camera.position.set(4, 4, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  const salvia = getCSSVar('--theme-salvia') || '#A2C2A2';
  const terracota = getCSSVar('--theme-terracota') || '#C86446';
  const carbon = getCSSVar('--theme-carbon') || '#333333';
  const ocre = getCSSVar('--theme-ocre') || '#c49b4f';

  const piColor = highlight === 'plano-pi' ? terracota : salvia;
  const sigmaColor = highlight === 'plano-sigma' ? terracota : ocre;
  const lineColor = highlight === 'recta-l' ? terracota : carbon;

  // Intersecting line points (along X axis)
  const linePoints = [new THREE.Vector3(-3, 0, 0), new THREE.Vector3(3, 0, 0)];

  return (
    <>
      <OrbitControls ref={controlsRef} enablePan={true} enableZoom={true} autoRotate={true} autoRotateSpeed={1.0} />
      
      {/* Plane Pi (horizontal) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5, 5]} />
        <meshBasicMaterial color={piColor} transparent opacity={highlight === 'plano-pi' ? 0.4 : 0.25} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      
      {/* Plane Sigma (tilted) */}
      <mesh rotation={[-Math.PI / 4, 0, 0]}>
        <planeGeometry args={[5, 5]} />
        <meshBasicMaterial color={sigmaColor} transparent opacity={highlight === 'plano-sigma' ? 0.4 : 0.25} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      <Line points={linePoints} color={lineColor} lineWidth={3} />

      <Html position={[-2, 0.2, 2]} className={`font-serif italic text-3xl ${highlight === 'plano-pi' ? 'text-terracota font-bold' : 'text-salvia/80'}`}>π</Html>
      <Html position={[-2, 1.5, -1.5]} className={`font-serif italic text-3xl ${highlight === 'plano-sigma' ? 'text-terracota font-bold' : 'text-ocre/80'}`}>σ</Html>
      <Html position={[2.5, 0.3, 0]} className={`font-serif italic text-2xl ${highlight === 'recta-l' ? 'text-terracota font-bold' : 'text-carbon'}`}>l</Html>
    </>
  );
}

export const Incidence7: React.FC = () => (
  <div className="w-full h-full min-h-[350px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
    <Canvas gl={{ antialias: true }}><SceneContent /></Canvas>
  </div>
);
