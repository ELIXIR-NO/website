import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ORANGE = '#f47d20';
const NAVY = '#023452';

// Strand backbone colors — vivid
const STRAND_1_COLOR = '#5bb5f5'; // bright sky blue backbone
const STRAND_2_COLOR = '#ff8c42'; // vivid orange backbone

// Nucleotide base pair colors
const BASE_COLORS = [
    '#ef4444', // Adenine  — red
    '#22c55e', // Thymine  — green
    '#3b82f6', // Guanine  — blue
    '#22c55e', // Cytosine — green
];

const NUM_POINTS = 100;
const RADIUS = 1.8;
const HEIGHT = 12;
const TURNS = 3;
const RUNG_INTERVAL = 6;

function computeHelixData() {
    const strand1: THREE.Vector3[] = [];
    const strand2: THREE.Vector3[] = [];
    const rungs: { mid: THREE.Vector3; quat: THREE.Quaternion; len: number }[] = [];
    const accentIndices: number[] = [];

    const yAxis = new THREE.Vector3(0, 1, 0);

    for (let i = 0; i <= NUM_POINTS; i++) {
        const t = i / NUM_POINTS;
        const angle = t * Math.PI * 2 * TURNS;
        const y = (t - 0.5) * HEIGHT;

        const x1 = Math.cos(angle) * RADIUS;
        const z1 = Math.sin(angle) * RADIUS;
        const x2 = Math.cos(angle + Math.PI) * RADIUS;
        const z2 = Math.sin(angle + Math.PI) * RADIUS;

        strand1.push(new THREE.Vector3(x1, y, z1));
        strand2.push(new THREE.Vector3(x2, y, z2));

        if (i % RUNG_INTERVAL === 0 && i > 0 && i < NUM_POINTS) {
            accentIndices.push(i);
            const a = new THREE.Vector3(x1, y, z1);
            const b = new THREE.Vector3(x2, y, z2);
            const dir = new THREE.Vector3().subVectors(b, a);
            const len = dir.length();
            dir.normalize();
            const quat = new THREE.Quaternion().setFromUnitVectors(yAxis, dir);
            const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
            rungs.push({ mid, quat, len });
        }
    }

    return { strand1, strand2, rungs, accentIndices };
}

function DNAHelix() {
    const groupRef = useRef<THREE.Group>(null!);
    const strandRef1 = useRef<THREE.InstancedMesh>(null!);
    const strandRef2 = useRef<THREE.InstancedMesh>(null!);
    const accent1Ref = useRef<THREE.InstancedMesh>(null!);
    const accent2Ref = useRef<THREE.InstancedMesh>(null!);
    const rungsRef = useRef<THREE.InstancedMesh>(null!);

    const data = useMemo(() => computeHelixData(), []);
    const strandCount = data.strand1.length;
    const rungCount = data.rungs.length;
    const accentCount = data.accentIndices.length;

    const initialized = useRef(false);
    useFrame((_, delta) => {
        if (!initialized.current) {
            const dummy = new THREE.Object3D();

            for (let i = 0; i < strandCount; i++) {
                dummy.position.copy(data.strand1[i]);
                dummy.scale.setScalar(1);
                dummy.updateMatrix();
                strandRef1.current.setMatrixAt(i, dummy.matrix);

                dummy.position.copy(data.strand2[i]);
                dummy.updateMatrix();
                strandRef2.current.setMatrixAt(i, dummy.matrix);
            }
            strandRef1.current.instanceMatrix.needsUpdate = true;
            strandRef2.current.instanceMatrix.needsUpdate = true;

            for (let i = 0; i < accentCount; i++) {
                const idx = data.accentIndices[i];
                dummy.position.copy(data.strand1[idx]);
                dummy.scale.setScalar(1);
                dummy.updateMatrix();
                accent1Ref.current.setMatrixAt(i, dummy.matrix);

                dummy.position.copy(data.strand2[idx]);
                dummy.updateMatrix();
                accent2Ref.current.setMatrixAt(i, dummy.matrix);
            }
            accent1Ref.current.instanceMatrix.needsUpdate = true;
            accent2Ref.current.instanceMatrix.needsUpdate = true;

            for (let i = 0; i < rungCount; i++) {
                const r = data.rungs[i];
                dummy.position.copy(r.mid);
                dummy.quaternion.copy(r.quat);
                dummy.scale.set(1, r.len, 1);
                dummy.updateMatrix();
                rungsRef.current.setMatrixAt(i, dummy.matrix);
            }
            rungsRef.current.instanceMatrix.needsUpdate = true;

            // Per-instance colors for rungs
            const rungColorArr = new Float32Array(rungCount * 3);
            const baseColors = BASE_COLORS.map(c => new THREE.Color(c));
            for (let i = 0; i < rungCount; i++) {
                const c = baseColors[i % baseColors.length];
                rungColorArr[i * 3] = c.r;
                rungColorArr[i * 3 + 1] = c.g;
                rungColorArr[i * 3 + 2] = c.b;
            }
            rungsRef.current.instanceColor = new THREE.InstancedBufferAttribute(rungColorArr, 3);

            initialized.current = true;
        }

        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.3;
        }
    });

    return (
        <group ref={groupRef} rotation={[0.3, 0, 0.15]}>
            {/* Strand 1 — blue backbone */}
            <instancedMesh ref={strandRef1} args={[undefined, undefined, strandCount]}>
                <sphereGeometry args={[0.1, 8, 8]} />
                <meshStandardMaterial color={STRAND_1_COLOR} emissive={STRAND_1_COLOR} emissiveIntensity={0.25} roughness={0.2} metalness={0.4} />
            </instancedMesh>

            {/* Strand 2 — orange backbone */}
            <instancedMesh ref={strandRef2} args={[undefined, undefined, strandCount]}>
                <sphereGeometry args={[0.1, 8, 8]} />
                <meshStandardMaterial color={STRAND_2_COLOR} emissive={STRAND_2_COLOR} emissiveIntensity={0.25} roughness={0.2} metalness={0.4} />
            </instancedMesh>

            {/* Accent nodes strand 1 */}
            <instancedMesh ref={accent1Ref} args={[undefined, undefined, accentCount]}>
                <sphereGeometry args={[0.18, 10, 10]} />
                <meshStandardMaterial
                    color={STRAND_1_COLOR}
                    emissive={STRAND_1_COLOR}
                    emissiveIntensity={0.4}
                    roughness={0.15}
                    metalness={0.5}
                />
            </instancedMesh>

            {/* Accent nodes strand 2 */}
            <instancedMesh ref={accent2Ref} args={[undefined, undefined, accentCount]}>
                <sphereGeometry args={[0.18, 10, 10]} />
                <meshStandardMaterial
                    color={STRAND_2_COLOR}
                    emissive={STRAND_2_COLOR}
                    emissiveIntensity={0.4}
                    roughness={0.15}
                    metalness={0.5}
                />
            </instancedMesh>

            {/* Rungs — per-instance nucleotide colors */}
            <instancedMesh ref={rungsRef} args={[undefined, undefined, rungCount]}>
                <cylinderGeometry args={[0.04, 0.04, 1, 6]} />
                <meshStandardMaterial
                    roughness={0.2}
                    metalness={0.2}
                    transparent
                    opacity={0.85}
                />
            </instancedMesh>
        </group>
    );
}

function Particles({ count = 40 }) {
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
        if (!ref.current) return;
        const t = clock.getElapsedTime();
        particles.forEach((p, i) => {
            dummy.position.set(
                p.x + Math.sin(t * p.speed + p.phase) * 0.5,
                p.y + Math.cos(t * p.speed * 0.8 + p.phase) * 0.3,
                p.z
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

export default function DNAScene() {
    return (
        <div
            className="w-full h-full"
            role="img"
            aria-label="3D visualization of a DNA double helix representing bioinformatics research"
        >
            <Canvas
                camera={{ position: [0, 0, 11], fov: 50 }}
                dpr={[1, 1.5]}
                gl={{ antialias: true, alpha: true }}
                style={{ background: 'transparent' }}
            >
                <ambientLight intensity={1} />
                <directionalLight position={[5, 5, 5]} intensity={1.2} />
                <directionalLight position={[-3, -2, 3]} intensity={0.6} color="#88b4e0" />
                <pointLight position={[2, 3, 5]} intensity={0.6} color={ORANGE} />
                <pointLight position={[-2, -3, 4]} intensity={0.3} color="#a855f7" />
                <DNAHelix />
                <Particles />
            </Canvas>
        </div>
    );
}
