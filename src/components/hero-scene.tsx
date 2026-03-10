import React, { Component, Suspense, useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ReactNode } from 'react';
import { ProteinStructure } from './protein-scene';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
const ORANGE = '#f47d20';

class SceneErrorBoundary extends Component<
    { fallback: ReactNode; children: ReactNode },
    { hasError: boolean }
> {
    state = { hasError: false };
    static getDerivedStateFromError() { return { hasError: true }; }
    componentDidCatch(error: Error) { console.warn('3D scene failed:', error.message); }
    render() {
        if (this.state.hasError) return this.props.fallback;
        return this.props.children;
    }
}

function SceneFallback() {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <img
                src={`${BASE}/assets/logos/elixir-no-dark.svg`}
                alt="ELIXIR Norway"
                className="h-32 w-auto opacity-20 dark:invert-85"
            />
        </div>
    );
}

function Particles({ count = 40, playing = true }) {
    const ref = useRef<THREE.InstancedMesh>(null!);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    const particles = useMemo(() =>
        Array.from({ length: count }, () => ({
            x: (Math.random() - 0.5) * 16,
            y: (Math.random() - 0.5) * 12,
            z: (Math.random() - 0.5) * 6 - 3,
            speed: 0.05 + Math.random() * 0.15,
            phase: Math.random() * Math.PI * 2,
            size: 0.02 + Math.random() * 0.04,
        })),
    [count]);

    useFrame(({ clock }) => {
        if (!ref.current || !playing) return;
        const t = clock.getElapsedTime();
        particles.forEach((p, i) => {
            dummy.position.set(
                p.x + Math.sin(t * p.speed + p.phase) * 0.5,
                p.y + Math.cos(t * p.speed * 0.8 + p.phase) * 0.3,
                p.z,
            );
            dummy.scale.setScalar(p.size);
            dummy.updateMatrix();
            ref.current.setMatrixAt(i, dummy.matrix);
        });
        ref.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={ref} args={[undefined, undefined, count]}>
            <sphereGeometry args={[1, 6, 6]} />
            <meshBasicMaterial color={ORANGE} transparent opacity={0.25} />
        </instancedMesh>
    );
}

export default function HeroScene() {
    const [playing, setPlaying] = useState(() => {
        if (typeof window === 'undefined') return true;
        return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    });

    return (
        <div className="w-full h-full relative" aria-hidden="true">
            <SceneErrorBoundary fallback={<SceneFallback />}>
                <div
                    className="w-full h-full"
                    role="img"
                    aria-label="Rotating 3D protein structure visualization"
                >
                    <Canvas
                        camera={{ position: [0, 0, 14], fov: 50 }}
                        dpr={[1, 1.5]}
                        gl={{ antialias: true, alpha: true }}
                        style={{ background: 'transparent' }}
                    >
                        <ambientLight intensity={1} />
                        <directionalLight position={[5, 5, 5]} intensity={1.2} />
                        <directionalLight position={[-3, -2, 3]} intensity={0.6} color="#88b4e0" />
                        <pointLight position={[2, 3, 5]} intensity={0.6} color={ORANGE} />
                        <pointLight position={[-2, -3, 4]} intensity={0.3} color="#a855f7" />
                        <Suspense fallback={null}>
                            <ProteinStructure playing={playing} />
                        </Suspense>
                        <Particles playing={playing} />
                    </Canvas>
                </div>
            </SceneErrorBoundary>

            {/* Pulled out of aria-hidden region so screen readers can reach it */}
            <div aria-hidden="false">
                <button
                    onClick={() => setPlaying(p => !p)}
                    className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm pl-2.5 pr-3 py-1.5 text-brand-grey dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2"
                    aria-label={playing ? 'Pause 3D animation' : 'Play 3D animation'}
                    aria-pressed={playing}
                    type="button"
                >
                    {playing ? (
                        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        </svg>
                    ) : (
                        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M8 5v14l11-7L8 5z" />
                        </svg>
                    )}
                    <span className="text-xs font-medium">{playing ? 'Pause' : 'Play'}</span>
                </button>
            </div>
        </div>
    );
}
