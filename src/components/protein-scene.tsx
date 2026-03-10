import { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

interface Residue {
    resNum: number;
    position: THREE.Vector3;
    ss: 'H' | 'E' | 'C';
}

function parsePDB(text: string): Residue[] {
    const lines = text.split('\n');

    // Secondary structure from HELIX/SHEET records
    const ssMap = new Map<number, 'H' | 'E'>();
    for (const line of lines) {
        if (line.startsWith('HELIX')) {
            const start = parseInt(line.substring(21, 25).trim());
            const end = parseInt(line.substring(33, 37).trim());
            for (let i = start; i <= end; i++) ssMap.set(i, 'H');
        } else if (line.startsWith('SHEET')) {
            const start = parseInt(line.substring(22, 26).trim());
            const end = parseInt(line.substring(33, 37).trim());
            for (let i = start; i <= end; i++) ssMap.set(i, 'E');
        }
    }

    // Extract Cα atoms (one per residue)
    const residues: Residue[] = [];
    for (const line of lines) {
        if (line.startsWith('ATOM') && line.substring(12, 16).trim() === 'CA') {
            const resNum = parseInt(line.substring(22, 26).trim());
            const x = parseFloat(line.substring(30, 38).trim());
            const y = parseFloat(line.substring(38, 46).trim());
            const z = parseFloat(line.substring(46, 54).trim());
            residues.push({
                resNum,
                position: new THREE.Vector3(x, y, z),
                ss: ssMap.get(resNum) || 'C',
            });
        }
    }

    // Center on origin
    const center = new THREE.Vector3();
    for (const r of residues) center.add(r.position);
    center.divideScalar(residues.length);
    for (const r of residues) r.position.sub(center);

    return residues;
}

// Propagate a consistent coordinate frame along the curve without flipping
function computeParallelTransport(
    points: THREE.Vector3[],
    tangents: THREE.Vector3[],
): Array<{ normal: THREE.Vector3; binormal: THREE.Vector3 }> {
    const frames: Array<{ normal: THREE.Vector3; binormal: THREE.Vector3 }> = [];

    const t0 = tangents[0].clone().normalize();
    let seed = new THREE.Vector3(0, 1, 0);
    if (Math.abs(t0.dot(seed)) > 0.9) seed.set(1, 0, 0);
    const n0 = new THREE.Vector3().crossVectors(t0, seed).normalize();
    const b0 = new THREE.Vector3().crossVectors(t0, n0).normalize();
    frames.push({ normal: n0, binormal: b0 });

    for (let i = 1; i < points.length; i++) {
        const tPrev = tangents[i - 1].clone().normalize();
        const tCurr = tangents[i].clone().normalize();
        const nPrev = frames[i - 1].normal.clone();

        const axis = new THREE.Vector3().crossVectors(tPrev, tCurr);
        const dot = Math.min(1, Math.max(-1, tPrev.dot(tCurr)));
        const angle = Math.acos(dot);

        if (axis.lengthSq() > 1e-10 && angle > 1e-6) {
            axis.normalize();
            nPrev.applyAxisAngle(axis, angle);
        }

        nPrev.normalize();
        const bCurr = new THREE.Vector3().crossVectors(tCurr, nPrev).normalize();
        frames.push({ normal: nPrev, binormal: bCurr });
    }

    return frames;
}

const CROSS_SEGMENTS = 8;
const SAMPLES_PER_RESIDUE = 6;

function createRibbonGeometry(residues: Residue[]): THREE.BufferGeometry {
    const curve = new THREE.CatmullRomCurve3(residues.map(r => r.position));
    const totalSamples = residues.length * SAMPLES_PER_RESIDUE;

    // Sample curve
    const points: THREE.Vector3[] = [];
    const tangents: THREE.Vector3[] = [];
    for (let i = 0; i <= totalSamples; i++) {
        const t = i / totalSamples;
        points.push(curve.getPoint(t));
        tangents.push(curve.getTangent(t));
    }

    const frames = computeParallelTransport(points, tangents);

    // Compute cross-section dimensions per sample, then smooth transitions
    const rawDims: Array<[number, number]> = [];
    for (let i = 0; i <= totalSamples; i++) {
        const t = i / totalSamples;
        const resIdx = Math.min(Math.floor(t * residues.length), residues.length - 1);
        const ss = residues[resIdx].ss;
        if (ss === 'H') rawDims.push([1.2, 0.3]);
        else if (ss === 'E') rawDims.push([1.4, 0.1]);
        else rawDims.push([0.3, 0.3]);
    }

    // Bidirectional exponential smoothing to avoid jagged width transitions
    const dims = rawDims.map(d => [...d] as [number, number]);
    const alpha = 0.25;
    for (let i = 1; i < dims.length; i++) {
        dims[i][0] = dims[i - 1][0] * (1 - alpha) + rawDims[i][0] * alpha;
        dims[i][1] = dims[i - 1][1] * (1 - alpha) + rawDims[i][1] * alpha;
    }
    for (let i = dims.length - 2; i >= 0; i--) {
        dims[i][0] = dims[i + 1][0] * (1 - alpha) + dims[i][0] * alpha;
        dims[i][1] = dims[i + 1][1] * (1 - alpha) + dims[i][1] * alpha;
    }

    // Build elliptical cross-section rings
    const positions: number[] = [];
    const colors: number[] = [];

    for (let i = 0; i <= totalSamples; i++) {
        const t = i / totalSamples;
        const [hw, ht] = dims[i];
        const p = points[i];
        const n = frames[i].normal;
        const b = frames[i].binormal;

        // Rainbow: blue (0.66) to red (0.0)
        const hue = 0.66 * (1 - t);
        const color = new THREE.Color().setHSL(hue, 0.85, 0.55);

        for (let j = 0; j < CROSS_SEGMENTS; j++) {
            const angle = (j / CROSS_SEGMENTS) * Math.PI * 2;
            const nx = Math.cos(angle) * hw;
            const ny = Math.sin(angle) * ht;

            positions.push(
                p.x + n.x * nx + b.x * ny,
                p.y + n.y * nx + b.y * ny,
                p.z + n.z * nx + b.z * ny,
            );
            colors.push(color.r, color.g, color.b);
        }
    }

    // Connect consecutive rings into quads (2 triangles each)
    const indices: number[] = [];
    for (let i = 0; i < totalSamples; i++) {
        for (let j = 0; j < CROSS_SEGMENTS; j++) {
            const a = i * CROSS_SEGMENTS + j;
            const b = i * CROSS_SEGMENTS + (j + 1) % CROSS_SEGMENTS;
            const c = (i + 1) * CROSS_SEGMENTS + (j + 1) % CROSS_SEGMENTS;
            const d = (i + 1) * CROSS_SEGMENTS + j;
            indices.push(a, b, c);
            indices.push(a, c, d);
        }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    return geometry;
}

interface ProteinStructureProps {
    playing?: boolean;
}

export function ProteinStructure({ playing = true }: ProteinStructureProps) {
    const groupRef = useRef<THREE.Group>(null!);

    const text = useLoader(THREE.FileLoader, `${BASE}/assets/models/1aki.pdb`) as string;

    const { geometry, autoScale } = useMemo(() => {
        const residues = parsePDB(text);
        const geo = createRibbonGeometry(residues);
        geo.computeBoundingSphere();
        const radius = geo.boundingSphere?.radius || 10;
        return { geometry: geo, autoScale: 5 / radius };
    }, [text]);

    useFrame((_, delta) => {
        if (groupRef.current && playing) {
            groupRef.current.rotation.y += delta * 0.2;
        }
    });

    return (
        <group ref={groupRef} scale={autoScale} rotation={[0.3, 0, 0.1]}>
            <mesh geometry={geometry}>
                <meshStandardMaterial
                    vertexColors
                    side={THREE.DoubleSide}
                    roughness={0.35}
                    metalness={0.15}
                />
            </mesh>
        </group>
    );
}
