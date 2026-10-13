import { useEffect } from 'react';
import { getCSSVar } from '@/diagrams/jsxgraph/MathUtils';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Html, Line } from '@react-three/drei';
import { useMathStore } from '@/lib/page-context/MathStoreContext';
import { useDiagramTargetRegistry, matchesScopedDiagramTarget } from '@/lib/page-context/DiagramTargetRegistryContext';
import { useDiagramLang } from '@/diagrams/public';

const SCOPE_ID = 'incidence8';

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

  const isPlaneHighlighted = isMatch('plano-pi', ['plano', 'planeMesh']);
  const isPAHighlighted = isMatch('pA');
  const isPBHighlighted = isMatch('pB');
  const isPCHighlighted = isMatch('pC');
  const isPDHighlighted = isMatch('pD');

  const planeColor = isPlaneHighlighted ? ocre : canela;
  const pAColor = isPAHighlighted ? ocre : terracota;
  const pBColor = isPBHighlighted ? ocre : terracota;
  const pCColor = isPCHighlighted ? ocre : terracota;
  const pDColor = isPDHighlighted ? ocre : carbon;
  const edgeColor = isPDHighlighted ? ocre : carbon;

  const posA = new THREE.Vector3(-1.5, 0, -1);
  const posB = new THREE.Vector3(1.5, 0, 1);
  const posC = new THREE.Vector3(1, 0, -1.5);
  const posD = new THREE.Vector3(0, 2.5, 0);

  return (
    <>
      <OrbitControls enablePan={true} enableZoom={true} autoRotate={true} autoRotateSpeed={1.0} />
      <gridHelper args={[8, 8, carbon, carbon]} material-opacity={0.05} material-transparent />

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerOver={(e) => { e.stopPropagation(); setVariable('highlight', `${SCOPE_ID}:plano-pi`); }}
        onPointerOut={() => setVariable('highlight', null)}
      >
        <planeGeometry args={[5, 5]} />
        <meshBasicMaterial color={planeColor} transparent opacity={isPlaneHighlighted ? 0.4 : 0.2} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      {/* Tetrahedron edges connecting D to A, B, C */}
      <Line points={[posD, posA]} color={edgeColor} lineWidth={2} transparent opacity={isPDHighlighted ? 0.8 : 0.3} />
      <Line points={[posD, posB]} color={edgeColor} lineWidth={2} transparent opacity={isPDHighlighted ? 0.8 : 0.3} />
      <Line points={[posD, posC]} color={edgeColor} lineWidth={2} transparent opacity={isPDHighlighted ? 0.8 : 0.3} />

      {/* Base edges (dotted/transparent) */}
      <Line points={[posA, posB]} color={carbon} lineWidth={1.5} transparent opacity={0.2} />
      <Line points={[posB, posC]} color={carbon} lineWidth={1.5} transparent opacity={0.2} />
      <Line points={[posC, posA]} color={carbon} lineWidth={1.5} transparent opacity={0.2} />

      <mesh
        position={posA}
        onPointerOver={(e) => { e.stopPropagation(); setVariable('highlight', `${SCOPE_ID}:pA`); }}
        onPointerOut={() => setVariable('highlight', null)}
      >
        <sphereGeometry args={[isPAHighlighted ? 0.18 : 0.12, 32, 32]} />
        <meshBasicMaterial color={pAColor} />
        <Html position={[0.2, 0.2, 0]} className={`font-serif italic text-xl ${isPAHighlighted ? 'text-ocre font-bold drop-shadow-md' : 'text-carbon'}`}>A</Html>
      </mesh>

      <mesh
        position={posB}
        onPointerOver={(e) => { e.stopPropagation(); setVariable('highlight', `${SCOPE_ID}:pB`); }}
        onPointerOut={() => setVariable('highlight', null)}
      >
        <sphereGeometry args={[isPBHighlighted ? 0.18 : 0.12, 32, 32]} />
        <meshBasicMaterial color={pBColor} />
        <Html position={[0.2, 0.2, 0]} className={`font-serif italic text-xl ${isPBHighlighted ? 'text-ocre font-bold drop-shadow-md' : 'text-carbon'}`}>B</Html>
      </mesh>

      <mesh
        position={posC}
        onPointerOver={(e) => { e.stopPropagation(); setVariable('highlight', `${SCOPE_ID}:pC`); }}
        onPointerOut={() => setVariable('highlight', null)}
      >
        <sphereGeometry args={[isPCHighlighted ? 0.18 : 0.12, 32, 32]} />
        <meshBasicMaterial color={pCColor} />
        <Html position={[0.2, 0.2, 0]} className={`font-serif italic text-xl ${isPCHighlighted ? 'text-ocre font-bold drop-shadow-md' : 'text-carbon'}`}>C</Html>
      </mesh>

      <mesh
        position={posD}
        onPointerOver={(e) => { e.stopPropagation(); setVariable('highlight', `${SCOPE_ID}:pD`); }}
        onPointerOut={() => setVariable('highlight', null)}
      >
        <sphereGeometry args={[isPDHighlighted ? 0.18 : 0.12, 32, 32]} />
        <meshBasicMaterial color={pDColor} />
        <Html position={[0.2, 0.2, 0]} className={`font-serif italic text-2xl font-bold ${isPDHighlighted ? 'text-ocre drop-shadow-md' : 'text-carbon'}`}>D</Html>
      </mesh>

      <Html position={[-2, 0.1, 2]} className={`font-serif italic text-3xl ${isPlaneHighlighted ? 'text-ocre font-bold drop-shadow-md' : 'text-carbon/60'}`}>π</Html>
    </>
  );
}

const LABELS: Record<string, Record<string, string>> = {
  eu: {
    'Punto A': 'A puntua',
    'Punto B': 'B puntua',
    'Punto C': 'C puntua',
    'Punto D exterior al plano': 'Planotik kanpoko D puntua',
    'Plano π': 'π planoa',
  },
  en: {
    'Punto A': 'Point A',
    'Punto B': 'Point B',
    'Punto C': 'Point C',
    'Punto D exterior al plano': 'Point D outside the plane',
    'Plano π': 'Plane π',
  },
};

const tr = (lang: string, text: string) => LABELS[lang]?.[text] ?? text;

export const Incidence8 = () => {
  const targetRegistry = useDiagramTargetRegistry();
  const lang = useDiagramLang();
  useEffect(() => {
    return targetRegistry.register(SCOPE_ID, [
      { targetId: 'pA', objectId: 'pA', label: tr(lang, 'Punto A'), kind: 'object' },
      { targetId: 'pB', objectId: 'pB', label: tr(lang, 'Punto B'), kind: 'object' },
      { targetId: 'pC', objectId: 'pC', label: tr(lang, 'Punto C'), kind: 'object' },
      { targetId: 'pD', objectId: 'pD', label: tr(lang, 'Punto D exterior al plano'), kind: 'object' },
      { targetId: 'plano-pi', objectId: 'plano-pi', label: tr(lang, 'Plano π'), kind: 'object' },
      { targetId: 'plano', objectId: 'plano-pi', label: tr(lang, 'Plano π'), kind: 'object' },
    ]);
  }, [targetRegistry, lang]);

  return (
    <div className="w-full h-full min-h-[350px] relative bg-lienzo/40 border border-mora/10 rounded-sm overflow-hidden">
      <Canvas gl={{ antialias: true }}><SceneContent /></Canvas>
    </div>
  );
};
