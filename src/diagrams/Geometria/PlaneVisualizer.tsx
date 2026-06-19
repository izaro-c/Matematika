/**
 * REQUISITOS DE DEPENDENCIA:
 * Para garantizar la resolución de módulos y un tipado estricto sin parches,
 * utilizamos la librería estándar de la comunidad (mantenida por pmndrs).
 * * $ npm install three
 * $ npm install -D @types/three
 * $ npm install three-stdlib
 */

import { useRef, useEffect } from 'react';
import * as THREE from 'three';

// Importaciones limpias, estables y tipadas nativamente gracias a three-stdlib
import { OrbitControls, DragControls } from 'three-stdlib';

import { useLessonStore } from '../../store/LessonStore';

export const PlaneVisualizer = () => {
    const mountRef = useRef<HTMLDivElement>(null);

    // Almacenamos referencias para la reactividad y limpieza de memoria
    const pointsRef = useRef<Record<string, THREE.Mesh>>({});
    const labelsRef = useRef<Record<string, THREE.Sprite>>({});
    const segmentsRef = useRef<THREE.Mesh[]>([]);

    const lessonHighlight = useLessonStore(state => state.activeStep);

    // 1. INICIALIZACIÓN DEL ENTORNO 3D E INTERACTIVIDAD
    useEffect(() => {
        if (!mountRef.current) return;

        // Inicializamos con dimensiones de seguridad por si el DOM aún no se ha pintado
        const initialWidth = mountRef.current.clientWidth || 500;
        const initialHeight = mountRef.current.clientHeight || 400;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#F6F4EB');

        const camera = new THREE.PerspectiveCamera(45, initialWidth / initialHeight, 0.1, 100);
        camera.up.set(0, 0, 1); // Z como eje vertical
        camera.position.set(6, -8, 5);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(initialWidth, initialHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mountRef.current.appendChild(renderer.domElement);

        // Controles Orbitales (Cámara)
        const orbitControls = new OrbitControls(camera, renderer.domElement);
        orbitControls.enableDamping = true;
        orbitControls.dampingFactor = 0.05;

        // Iluminación
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(5, 5, 10);
        scene.add(directionalLight);

        // --- Utilidades de Renderizado ---
        const createTextSprite = (message: string, colorStr: string, scale = 1.2) => {
            const canvas = document.createElement('canvas');
            canvas.width = 128;
            canvas.height = 64;
            const context = canvas.getContext('2d');
            if (context) {
                context.font = 'bold 36px serif';
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.fillStyle = colorStr;
                context.fillText(message, 64, 32);
            }
            const texture = new THREE.CanvasTexture(canvas);
            texture.minFilter = THREE.LinearFilter;
            const spriteMaterial = new THREE.SpriteMaterial({ map: texture, depthTest: false });
            const sprite = new THREE.Sprite(spriteMaterial);
            sprite.scale.set(scale, scale / 2, 1);
            return sprite;
        };

        const segmentMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
        const createDynamicTube = (p1: THREE.Vector3, p2: THREE.Vector3, radius = 0.03) => {
            const path = new THREE.LineCurve3(p1, p2);
            const geometry = new THREE.TubeGeometry(path, 8, radius, 8, false);
            return new THREE.Mesh(geometry, segmentMaterial);
        };

        // --- Construcción de la Escena Geométrica Estática ---
        const gridHelper = new THREE.GridHelper(10, 10, 0x2C3333, 0x2C3333);
        gridHelper.material.opacity = 0.15;
        gridHelper.material.transparent = true;
        gridHelper.rotation.x = Math.PI / 2;
        scene.add(gridHelper);

        const origin = new THREE.Vector3(0, 0, 0);
        const length = 4;

        scene.add(createDynamicTube(origin, new THREE.Vector3(length, 0, 0), 0.02));
        const lblX = createTextSprite('X', '#2C3333');
        lblX.position.set(length + 0.5, 0, 0);
        scene.add(lblX);

        scene.add(createDynamicTube(origin, new THREE.Vector3(0, length, 0), 0.02));
        const lblY = createTextSprite('Y', '#2C3333');
        lblY.position.set(0, length + 0.5, 0);
        scene.add(lblY);

        const matZ = new THREE.MeshBasicMaterial({ color: 0x5E7182 });
        const geoZ = new THREE.TubeGeometry(new THREE.LineCurve3(origin, new THREE.Vector3(0, 0, length)), 8, 0.02, 8, false);
        scene.add(new THREE.Mesh(geoZ, matZ));

        const lblZ = createTextSprite('Z', '#5E7182');
        lblZ.position.set(0, 0, length + 0.5);
        scene.add(lblZ);

        const planeGeometry = new THREE.PlaneGeometry(6, 6);
        const planeMaterial = new THREE.MeshStandardMaterial({
            color: 0xA2C2A2, transparent: true, opacity: 0.4, side: THREE.DoubleSide, depthWrite: false
        });
        scene.add(new THREE.Mesh(planeGeometry, planeMaterial));

        // --- Puntos Dinámicos e Interactivos ---
        const draggableMeshes: THREE.Mesh[] = [];

        const addInteractivePoint = (pos: THREE.Vector3, name: string, colorHex: number) => {
            const geo = new THREE.SphereGeometry(0.15, 32, 32);
            const mat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.8 });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.copy(pos);
            mesh.userData = { name };
            scene.add(mesh);
            draggableMeshes.push(mesh);
            pointsRef.current[name] = mesh;

            const lbl = createTextSprite(name, '#2C3333', 0.8);
            lbl.position.copy(pos).add(new THREE.Vector3(0.3, 0.3, 0.1));
            scene.add(lbl);
            labelsRef.current[name] = lbl;
        };

        addInteractivePoint(new THREE.Vector3(-2, -2, 0), 'A', 0xC85C40);
        addInteractivePoint(new THREE.Vector3(2, -1, 0), 'B', 0xC85C40);
        addInteractivePoint(new THREE.Vector3(1, 2, 0), 'C', 0xA2C2A2);

        // --- Función para actualizar los segmentos en tiempo real ---
        const updateSegments = () => {
            segmentsRef.current.forEach(mesh => {
                scene.remove(mesh);
                mesh.geometry.dispose();
            });
            segmentsRef.current = [];

            const pA = pointsRef.current['A'].position;
            const pB = pointsRef.current['B'].position;
            const pC = pointsRef.current['C'].position;

            const segAB = createDynamicTube(pA, pB);
            const segBC = createDynamicTube(pB, pC);

            scene.add(segAB);
            scene.add(segBC);
            segmentsRef.current.push(segAB, segBC);
        };

        updateSegments();

        // --- SISTEMA DE DRAG & DROP ---
        const dragControls = new DragControls(draggableMeshes, camera, renderer.domElement);

        dragControls.addEventListener('hoveron', () => {
            renderer.domElement.style.cursor = 'pointer';
        });

        dragControls.addEventListener('hoveroff', () => {
            renderer.domElement.style.cursor = 'move';
        });

        dragControls.addEventListener('dragstart', () => {
            orbitControls.enabled = false;
        });

        // Gracias a three-stdlib, event tiene tipado correcto nativamente
        dragControls.addEventListener('drag', (event) => {
            if (event.object && event.object.position) {
                // Invariante matemático: Fijar en el plano Z=0
                event.object.position.z = 0;

                const pointName = event.object.userData.name;
                const label = labelsRef.current[pointName];

                if (label) {
                    label.position.copy(event.object.position).add(new THREE.Vector3(0.3, 0.3, 0.1));
                }

                updateSegments();
            }
        });

        dragControls.addEventListener('dragend', () => {
            orbitControls.enabled = true;
        });

        // --- Loop de Animación ---
        let animationFrameId: number;
        const renderLoop = () => {
            orbitControls.update();
            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(renderLoop);
        };
        renderLoop();

        // --- OBSERVADOR DE REDIMENSIONAMIENTO (Arquitectura Robusta) ---
        // Evita el bug del lienzo 0x0 cuando React + Flexbox repintan el DOM.
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const w = entry.contentRect.width;
                const h = entry.contentRect.height;
                if (w > 0 && h > 0) {
                    camera.aspect = w / h;
                    camera.updateProjectionMatrix();
                    renderer.setSize(w, h);
                }
            }
        });
        resizeObserver.observe(mountRef.current);

        // --- Limpieza CRÍTICA de Memoria ---
        return () => {
            if (mountRef.current) {
                resizeObserver.unobserve(mountRef.current);
            }
            resizeObserver.disconnect();
            cancelAnimationFrame(animationFrameId);

            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }

            orbitControls.dispose();
            dragControls.dispose();

            scene.traverse((object: THREE.Object3D) => {
                const mesh = object as THREE.Mesh;
                const line = object as THREE.Line;
                const sprite = object as THREE.Sprite;

                if (mesh.isMesh || line.isLine || sprite.isSprite) {
                    if (mesh.geometry) mesh.geometry.dispose();
                    if (mesh.material) {
                        if (Array.isArray(mesh.material)) {
                            mesh.material.forEach((m: THREE.Material) => m.dispose());
                        } else {
                            mesh.material.dispose();
                        }
                    }
                }
            });

            pointsRef.current = {};
            labelsRef.current = {};
            segmentsRef.current = [];
        };
    }, []);

    // 2. SISTEMA DE RESALTADO REACTIVO (Binding con el Store)
    useEffect(() => {
        const points = pointsRef.current;
        if (Object.keys(points).length === 0) return;

        Object.entries(points).forEach(([name, mesh]) => {
            const mat = mesh.material as THREE.MeshStandardMaterial;
            mat.color.setHex(name === 'C' ? 0xA2C2A2 : 0xC85C40);
            mesh.scale.set(1, 1, 1);
        });

        if (lessonHighlight && points[lessonHighlight]) {
            const activeMesh = points[lessonHighlight];
            const activeMat = activeMesh.material as THREE.MeshStandardMaterial;
            activeMat.color.setHex(0xD9B44A);
            activeMesh.scale.set(1.5, 1.5, 1.5);
        }
    }, [lessonHighlight]);

    return (
        <div className="w-full h-full bg-lienzo rounded-[4px] border border-pizarra/20 flex flex-col shadow-sm overflow-hidden">
            <div className="p-3 border-b border-pizarra/10 bg-carbon/5 flex items-center justify-between shrink-0">
                <span className="text-xs font-bold uppercase tracking-wider text-carbon/70 font-sans">
                    Renderizado 3D Interactivo
                </span>
                <span className="text-[10px] font-mono text-pizarra/60">WebGL / Three.js</span>
            </div>

            <div
                ref={mountRef}
                className="flex-1 w-full relative cursor-move min-h-[300px]"
            />

            <div className="p-4 bg-carbon/5 text-sm font-serif text-carbon border-t border-pizarra/10 shrink-0">
                <p>
                    <strong>Geometría Espacial:</strong> El plano $\Pi$ (verde salvia) está definido en $Z=0$ y contiene los puntos $A$, $B$ y $C$.
                    El eje <span className="text-pizarra font-bold font-sans">Z</span> representa el vector normal perpendicular al plano.
                    <br /><br />
                    <span className="italic text-xs text-terracota font-sans font-bold">
                        → Arrastra libremente los puntos A, B y C. Observa cómo, gracias a la condición de coplanaridad, es imposible sacarlos del plano verde.
                    </span>
                </p>
            </div>
        </div>
    );
};

export default PlaneVisualizer;