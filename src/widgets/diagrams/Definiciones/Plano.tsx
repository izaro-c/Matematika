import { useRef, useEffect } from 'react';
import { getCSSVar } from '@/shared/diagrams/core/MathUtils';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Html } from '@react-three/drei';
import { useMathStore } from '@/app/providers/MathStoreContext';
import { useLessonStore } from '@/features/lessons/LessonStore';

function SceneContent() {
  const { camera } = useThree();

  const mathHighlight = useMathStore((state: any) => state.variables?.['highlight']);
  const lessonHighlight = useLessonStore((state: any) => state.activeStep);
  const highlight = mathHighlight || lessonHighlight;

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

  const salvia = getCSSVar('--theme-salvia') || '#A2C2A2';
  const terracota = getCSSVar('--theme-terracota') || '#C86446';
  const carbon = getCSSVar('--theme-carbon') || '#333333';
  const ocre = getCSSVar('--theme-ocre') || '#c49b4f';

  const planeColor = highlight === 'planeMesh' ? ocre : salvia;
  const planeOpacity = highlight === 'planeMesh' ? 0.4 : 0.3;
  const pointColorA = highlight === 'pA' ? ocre : terracota;
  const pointColorB = highlight === 'pB' ? ocre : terracota;
  const pointColorC = highlight === 'pC' ? ocre : terracota;
  const pointSize = (t: string) => (highlight === t ? 0.25 : 0.15);

  return (
    <>
      <OrbitControls ref={controlsRef} enablePan={true} enableZoom={true} autoRotate={true} autoRotateSpeed={1.0} />
      <gridHelper args={[8, 8, carbon, carbon]} material-opacity={0.08} material-transparent />

      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5, 5]} />
        <meshBasicMaterial
          color={planeColor}
          transparent
          opacity={planeOpacity}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[pointSize('pA'), 32, 32]} />
        <meshBasicMaterial color={pointColorA} />
        <Html position={[0.3, 0.3, 0]} center className={`font-serif italic font-bold text-xl select-none pointer-events-none transition-colors duration-300 ${highlight === 'pA' ? 'text-ocre drop-shadow-md' : 'text-carbon'}`}>
          A
        </Html>
      </mesh>

      <mesh position={[2, 0, 0]}>
        <sphereGeometry args={[pointSize('pB'), 32, 32]} />
        <meshBasicMaterial color={pointColorB} />
        <Html position={[0.3, 0.3, 0]} center className={`font-serif italic font-bold text-xl select-none pointer-events-none transition-colors duration-300 ${highlight === 'pB' ? 'text-ocre drop-shadow-md' : 'text-carbon'}`}>
          B
        </Html>
      </mesh>

      <mesh position={[0.5, 0, 1.8]}>
        <sphereGeometry args={[pointSize('pC'), 32, 32]} />
        <meshBasicMaterial color={pointColorC} />
        <Html position={[0.3, 0.3, 0]} center className={`font-serif italic font-bold text-xl select-none pointer-events-none transition-colors duration-300 ${highlight === 'pC' ? 'text-ocre drop-shadow-md' : 'text-carbon'}`}>
          C
        </Html>
      </mesh>

      <Html position={[-2, 0.1, 2]} center className={`font-serif italic text-2xl select-none pointer-events-none transition-colors duration-300 ${highlight === 'planeMesh' ? 'text-ocre font-bold drop-shadow-md' : 'text-carbon/60'}`}>
        π
      </Html>
    </>
  );
}

export const Plano = () => {
  return (
    <div className="w-full h-full min-h-[400px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50 pointer-events-none">
        Rota la escena en 3D con el ratón
      </div>
      <Canvas gl={{ antialias: true }} style={{ width: '100%', height: '100%' }}>
        <SceneContent />
      </Canvas>
    </div>
  );
};
