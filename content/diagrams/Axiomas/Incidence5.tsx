import { useRef, useEffect } from 'react';
import { getCSSVar } from '@/diagrams/jsxgraph/MathUtils';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Html } from '@react-three/drei';
import { useMathStore } from '@/lib/page-context/MathStoreContext';
import { useDiagramTargetRegistry, matchesScopedDiagramTarget } from '@/lib/page-context/DiagramTargetRegistryContext';
import { useDiagramLang } from '@/diagrams/public';

const SCOPE_ID = 'incidence5';

function SceneContent() {
  const { camera } = useThree();
  const highlight = useMathStore((state: any) => state.variables?.['highlight']);
  const setVariable = useMathStore((state: any) => state.setVariable);
  const controlsRef = useRef<any>(null);

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
  const isPCHighlighted = isMatch('pC');

  const planeColor = isPlaneHighlighted ? ocre : canela;
  const pAColor = isPAHighlighted ? ocre : terracota;
  const pBColor = isPBHighlighted ? ocre : terracota;
  const pCColor = isPCHighlighted ? ocre : terracota;

  return (
    <>
      <OrbitControls ref={controlsRef} enablePan={true} enableZoom={true} autoRotate={true} autoRotateSpeed={1.0} />
      <gridHelper args={[8, 8, carbon, carbon]} material-opacity={0.08} material-transparent />

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerOver={(e) => { e.stopPropagation(); setVariable('highlight', `${SCOPE_ID}:plano`); }}
        onPointerOut={() => setVariable('highlight', null)}
      >
        <planeGeometry args={[5, 5]} />
        <meshBasicMaterial color={planeColor} transparent opacity={isPlaneHighlighted ? 0.4 : 0.2} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      <mesh
        position={[-1, 0, -1]}
        onPointerOver={(e) => { e.stopPropagation(); setVariable('highlight', `${SCOPE_ID}:pA`); }}
        onPointerOut={() => setVariable('highlight', null)}
      >
        <sphereGeometry args={[isPAHighlighted ? 0.22 : 0.15, 32, 32]} />
        <meshBasicMaterial color={pAColor} />
        <Html position={[0.2, 0.2, 0]} className={`font-serif italic text-xl ${isPAHighlighted ? 'text-ocre font-bold drop-shadow-md' : 'text-carbon'}`}>A</Html>
      </mesh>

      <mesh
        position={[1, 0, 0]}
        onPointerOver={(e) => { e.stopPropagation(); setVariable('highlight', `${SCOPE_ID}:pB`); }}
        onPointerOut={() => setVariable('highlight', null)}
      >
        <sphereGeometry args={[isPBHighlighted ? 0.22 : 0.15, 32, 32]} />
        <meshBasicMaterial color={pBColor} />
        <Html position={[0.2, 0.2, 0]} className={`font-serif italic text-xl ${isPBHighlighted ? 'text-ocre font-bold drop-shadow-md' : 'text-carbon'}`}>B</Html>
      </mesh>

      <mesh
        position={[0, 0, 1.5]}
        onPointerOver={(e) => { e.stopPropagation(); setVariable('highlight', `${SCOPE_ID}:pC`); }}
        onPointerOut={() => setVariable('highlight', null)}
      >
        <sphereGeometry args={[isPCHighlighted ? 0.22 : 0.15, 32, 32]} />
        <meshBasicMaterial color={pCColor} />
        <Html position={[0.2, 0.2, 0]} className={`font-serif italic text-xl ${isPCHighlighted ? 'text-ocre font-bold drop-shadow-md' : 'text-carbon'}`}>C</Html>
      </mesh>

      <Html position={[-2, 0.1, 2]} className={`font-serif italic text-2xl ${isPlaneHighlighted ? 'text-ocre font-bold drop-shadow-md' : 'text-carbon/60'}`}>π</Html>
    </>
  );
}

const LABELS: Record<string, Record<string, string>> = {
  eu: {
    'Punto A': 'A puntua',
    'Punto B': 'B puntua',
    'Punto C': 'C puntua',
    'Plano π': 'π planoa',
  },
  en: {
    'Punto A': 'Point A',
    'Punto B': 'Point B',
    'Punto C': 'Point C',
    'Plano π': 'Plane π',
  },
};

const tr = (lang: string, text: string) => LABELS[lang]?.[text] ?? text;

export const Incidence5 = () => {
  const targetRegistry = useDiagramTargetRegistry();
  const lang = useDiagramLang();
  useEffect(() => {
    return targetRegistry.register(SCOPE_ID, [
      { targetId: 'pA', objectId: 'pA', label: tr(lang, 'Punto A'), kind: 'object' },
      { targetId: 'pB', objectId: 'pB', label: tr(lang, 'Punto B'), kind: 'object' },
      { targetId: 'pC', objectId: 'pC', label: tr(lang, 'Punto C'), kind: 'object' },
      { targetId: 'plano', objectId: 'plano', label: tr(lang, 'Plano π'), kind: 'object' },
      { targetId: 'plano-pi', objectId: 'plano', label: tr(lang, 'Plano π'), kind: 'object' },
    ]);
  }, [targetRegistry, lang]);

  return (
    <div className="w-full h-full min-h-[350px] relative bg-lienzo/40 border border-mora/10 rounded-sm overflow-hidden">
      <Canvas gl={{ antialias: true }}>
        <SceneContent />
      </Canvas>
    </div>
  );
};
