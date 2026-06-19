import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';
import { useMathStore } from '../../store/MathStoreContext';
import { useLessonStore } from '../../store/LessonStore';

function makeTextSprite(text: string, color = '#C86446') {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  ctx.font = 'Bold 36px Charter, Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.fillText(text, 64, 34);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  const mat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(0.5, 0.25, 1);
  return sprite;
}

function SceneContent() {
  const { camera, gl } = useThree();

  const mathHighlight = useMathStore(state => state.variables?.['highlight']);
  const lessonHighlight = useLessonStore(state => state.activeStep);
  const highlight = mathHighlight || lessonHighlight;

  const controlsRef = useRef<OrbitControls | null>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    camera.position.set(5, 4, 6);
    camera.lookAt(0, 0, 0);
    const controls = new OrbitControls(camera, gl.domElement);
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.target.set(0, 0, 0);
    controls.update();
    controlsRef.current = controls;
    return () => controls.dispose();
  }, [camera, gl.domElement]);

  const planeColor = highlight === 'planeMesh' ? '#f5c542' : '#5D7080';
  const planeOpacity = highlight === 'planeMesh' ? 0.45 : 0.2;
  const pointColorA = highlight === 'pA' ? '#f5c542' : '#C86446';
  const pointColorB = highlight === 'pB' ? '#f5c542' : '#C86446';
  const pointColorC = highlight === 'pC' ? '#f5c542' : '#C86446';
  const pointSize = (t: string) => (highlight === t ? 0.25 : 0.15);

  const labelA = useMemo(() => makeTextSprite('A', pointColorA), [pointColorA]);
  const labelB = useMemo(() => makeTextSprite('B', pointColorB), [pointColorB]);
  const labelC = useMemo(() => makeTextSprite('C', pointColorC), [pointColorC]);

  useEffect(() => {
    labelA.position.set(0.3, 0, 0);
    labelB.position.set(2.3, 0, 0);
    labelC.position.set(0.8, 0, 1.8);
  }, [labelA, labelB, labelC]);

  return (
    <>
      <gridHelper args={[8, 8, '#5D7080', '#3b5e6b']} />
      <axesHelper args={[3]} />
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5, 5]} />
        <meshStandardMaterial
          color={planeColor}
          transparent
          opacity={planeOpacity}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={pointColorA} />
      </mesh>
      <primitive object={labelA} />
      <mesh position={[2, 0, 0]}>
        <sphereGeometry args={[pointSize('pB'), 16, 16]} />
        <meshStandardMaterial color={pointColorB} />
      </mesh>
      <primitive object={labelB} />
      <mesh position={[0.5, 0, 1.8]}>
        <sphereGeometry args={[pointSize('pC'), 16, 16]} />
        <meshStandardMaterial color={pointColorC} />
      </mesh>
      <primitive object={labelC} />
    </>
  );
}

export const Plano = () => {
  return (
    <div className="w-full h-full min-h-[400px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Rota la escena con el ratón
      </div>
      <Canvas gl={{ antialias: true }} style={{ width: '100%', height: '100%' }}>
        <ambientLight intensity={1} />
        <directionalLight position={[5, 8, 6]} intensity={0.8} />
        <directionalLight position={[-3, 2, -4]} intensity={0.4} />
        <SceneContent />
      </Canvas>
    </div>
  );
};
