import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ORANGE = '#f47d20';

// Sugar-phosphate backbone — neutral gray (standard structural biology convention)
const STRAND_1_COLOR = '#8b95a3';
const STRAND_2_COLOR = '#6b7280';

// Base pair hydrogen bond colors (CPK-inspired, most common convention)
// A-T pairs form 2 hydrogen bonds, G-C pairs form 3
const AT_COLOR = '#e05577'; // Adenine–Thymine — red/magenta
const GC_COLOR = '#3ba4c8'; // Guanine–Cytosine — cyan/blue

const NUM_POINTS = 100;
const RADIUS = 1.8;
const HEIGHT = 12;
const TURNS = 3;
const RUNG_INTERVAL = 6;
const BOND_SPACING = 0.14; // vertical gap between parallel hydrogen bonds

interface Bond {
    pos: THREE.Vector3;
    quat: THREE.Quaternion;
    len: number;
    isGC: boolean;
}

function computeHelixData() {
    const strand1: THREE.Vector3[] = [];
    const strand2: THREE.Vector3[] = [];
    const nucleosides1: THREE.Vector3[] = [];
    const nucleosides2: THREE.Vector3[] = [];
    const bonds: Bond[] = [];

    const yAxis = new THREE.Vector3(0, 1, 0);
    let rungIndex = 0;

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
            const a = new THREE.Vector3(x1, y, z1);
            const b = new THREE.Vector3(x2, y, z2);
            const dir = new THREE.Vector3().subVectors(b, a);
            const len = dir.length();
            dir.normalize();
            const quat = new THREE.Quaternion().setFromUnitVectors(yAxis, dir);
            const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);

            nucleosides1.push(a.clone());
            nucleosides2.push(b.clone());

            // Alternate A-T (2 bonds) and G-C (3 bonds) pairs
            const isGC = rungIndex % 2 === 0;
            const bondCount = isGC ? 3 : 2;

            // Each bond is a thin cylinder offset along Y (perpendicular to the
            // rung direction, which lies in the XZ plane at each helix step)
            for (let j = 0; j < bondCount; j++) {
                const offset = (j - (bondCount - 1) / 2) * BOND_SPACING;
                bonds.push({
                    pos: mid.clone().add(new THREE.Vector3(0, offset, 0)),
                    quat: quat.clone(),
                    len,
                    isGC,
                });
            }

            rungIndex++;
        }
    }

    return { strand1, strand2, nucleosides1, nucleosides2, bonds };
}

function DNAHelix() {
    const groupRef = useRef<THREE.Group>(null!);
    const nucleoside1Ref = useRef<THREE.InstancedMesh>(null!);
    const nucleoside2Ref = useRef<THREE.InstancedMesh>(null!);
    const bondsRef = useRef<THREE.InstancedMesh>(null!);

    const data = useMemo(() => computeHelixData(), []);
    const bondCount = data.bonds.length;
    const nucleosideCount = data.nucleosides1.length;

    // Smooth tube curves for sugar-phosphate backbone
    const curve1 = useMemo(() => new THREE.CatmullRomCurve3(data.strand1), [data.strand1]);
    const curve2 = useMemo(() => new THREE.CatmullRomCurve3(data.strand2), [data.strand2]);

    const initialized = useRef(false);
    useFrame((_, delta) => {
        if (!initialized.current) {
            const dummy = new THREE.Object3D();

            // Nucleoside nodes at each base pair position
            for (let i = 0; i < nucleosideCount; i++) {
                dummy.position.copy(data.nucleosides1[i]);
                dummy.scale.setScalar(1);
                dummy.updateMatrix();
                nucleoside1Ref.current.setMatrixAt(i, dummy.matrix);

                dummy.position.copy(data.nucleosides2[i]);
                dummy.updateMatrix();
                nucleoside2Ref.current.setMatrixAt(i, dummy.matrix);
            }
            nucleoside1Ref.current.instanceMatrix.needsUpdate = true;
            nucleoside2Ref.current.instanceMatrix.needsUpdate = true;

            // Hydrogen bonds with per-instance color (A-T green, G-C blue)
            const colorArr = new Float32Array(bondCount * 3);
            const atColor = new THREE.Color(AT_COLOR);
            const gcColor = new THREE.Color(GC_COLOR);

            for (let i = 0; i < bondCount; i++) {
                const bond = data.bonds[i];
                dummy.position.copy(bond.pos);
                dummy.quaternion.copy(bond.quat);
                dummy.scale.set(1, bond.len, 1);
                dummy.updateMatrix();
                bondsRef.current.setMatrixAt(i, dummy.matrix);

                const c = bond.isGC ? gcColor : atColor;
                colorArr[i * 3] = c.r;
                colorArr[i * 3 + 1] = c.g;
                colorArr[i * 3 + 2] = c.b;
            }
            bondsRef.current.instanceMatrix.needsUpdate = true;
            bondsRef.current.instanceColor = new THREE.InstancedBufferAttribute(colorArr, 3);

            initialized.current = true;
        }

        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.3;
        }
    });

    return (
        <group ref={groupRef} rotation={[0.3, 0, 0.15]}>
            {/* Sugar-phosphate backbone strand 1 — continuous tube */}
            <mesh>
                <tubeGeometry args={[curve1, 100, 0.07, 8, false]} />
                <meshStandardMaterial
                    color={STRAND_1_COLOR}
                    emissive={STRAND_1_COLOR}
                    emissiveIntensity={0.25}
                    roughness={0.2}
                    metalness={0.4}
                />
            </mesh>

            {/* Sugar-phosphate backbone strand 2 — continuous tube */}
            <mesh>
                <tubeGeometry args={[curve2, 100, 0.07, 8, false]} />
                <meshStandardMaterial
                    color={STRAND_2_COLOR}
                    emissive={STRAND_2_COLOR}
                    emissiveIntensity={0.25}
                    roughness={0.2}
                    metalness={0.4}
                />
            </mesh>

            {/* Nucleoside nodes on strand 1 (where bases attach) */}
            <instancedMesh ref={nucleoside1Ref} args={[undefined, undefined, nucleosideCount]}>
                <sphereGeometry args={[0.16, 10, 10]} />
                <meshStandardMaterial
                    color={STRAND_1_COLOR}
                    emissive={STRAND_1_COLOR}
                    emissiveIntensity={0.4}
                    roughness={0.15}
                    metalness={0.5}
                />
            </instancedMesh>

            {/* Nucleoside nodes on strand 2 */}
            <instancedMesh ref={nucleoside2Ref} args={[undefined, undefined, nucleosideCount]}>
                <sphereGeometry args={[0.16, 10, 10]} />
                <meshStandardMaterial
                    color={STRAND_2_COLOR}
                    emissive={STRAND_2_COLOR}
                    emissiveIntensity={0.4}
                    roughness={0.15}
                    metalness={0.5}
                />
            </instancedMesh>

            {/* Hydrogen bonds — 2 per A-T pair (green), 3 per G-C pair (blue) */}
            <instancedMesh ref={bondsRef} args={[undefined, undefined, bondCount]}>
                <cylinderGeometry args={[0.03, 0.03, 1, 6]} />
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
