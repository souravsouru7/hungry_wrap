"use client";

import { RoundedBox } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { BRAND, seeded, smooth, type SceneProps } from "../util";

// Teardrop pin, revolved: a tapering cone into a ball.
function pinProfile() {
  const pts: THREE.Vector2[] = [new THREE.Vector2(0.001, 0)];
  for (let i = 1; i <= 12; i++) {
    const t = i / 12;
    pts.push(new THREE.Vector2(0.41 * Math.pow(t, 0.85), t * 0.863));
  }
  for (let a = -35; a <= 90; a += 7) {
    const r = (a * Math.PI) / 180;
    pts.push(new THREE.Vector2(Math.max(0.5 * Math.cos(r), 0.001), 1.15 + 0.5 * Math.sin(r)));
  }
  return pts;
}

const PALETTE = ["#f7e4cc", "#f1c9a0", "#ffffff", "#ead2b4", "#ffd9b0"];
const ROAD_Z = 1.6;
const ROAD_X = -1.6;

const dummy = new THREE.Object3D();
const DROP_FROM = 6;
const PIN_REST = 1.05;

/** Fall, then three decaying bounces, then a gentle hover. */
function pinHeight(t: number) {
  if (t < 0) return DROP_FROM;
  if (t < 0.45) return DROP_FROM - (DROP_FROM - PIN_REST) * (t / 0.45) ** 2;
  const b = t - 0.45;
  return PIN_REST + Math.abs(Math.sin(b * 7)) * 1.1 * Math.exp(-b * 3.2) + Math.sin(t * 2) * 0.04;
}

/**
 * /contact. A little map of Kalpetta streets with the cafe at the centre. The
 * pin drops and bounces onto it as the section arrives, rings pulse out, and
 * scrolling tilts the map from top-down into a three-quarter view.
 */
export default function CafePin({ progress, lite }: SceneProps) {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const p = useRef(0);
  const dropAt = useRef<number | null>(null);
  const pin = useRef<THREE.Group>(null);
  const rings = useRef<(THREE.Mesh | null)[]>([]);
  const blocks = useRef<THREE.InstancedMesh>(null);
  const trees = useRef<THREE.InstancedMesh>(null);

  const pinGeo = useMemo(() => new THREE.LatheGeometry(pinProfile(), 48), []);

  const city = useMemo(() => {
    const rand = seeded(73);
    const buildings: { x: number; z: number; w: number; d: number; h: number; color: string }[] = [];
    const want = lite ? 10 : 28;
    let guard = 0;
    while (buildings.length < want && guard++ < 500) {
      const x = (rand() - 0.5) * 5.6;
      const z = (rand() - 0.5) * 5.6;
      if (Math.abs(z - ROAD_Z) < 0.6 || Math.abs(x - ROAD_X) < 0.6 || Math.hypot(x, z) < 1.2) continue;
      if (buildings.some((b) => Math.abs(b.x - x) < 0.6 && Math.abs(b.z - z) < 0.6)) continue;
      buildings.push({ x, z, w: 0.35 + rand() * 0.25, d: 0.35 + rand() * 0.25, h: 0.25 + rand() * 0.9, color: PALETTE[Math.floor(rand() * PALETTE.length)] });
    }
    const greens: { x: number; z: number; s: number }[] = [];
    while (greens.length < (lite ? 5 : 12) && guard++ < 900) {
      const x = (rand() - 0.5) * 5.8;
      const z = (rand() - 0.5) * 5.8;
      if (Math.abs(z - ROAD_Z) < 0.5 || Math.abs(x - ROAD_X) < 0.5 || Math.hypot(x, z) < 1.1) continue;
      if (buildings.some((b) => Math.abs(b.x - x) < 0.45 && Math.abs(b.z - z) < 0.45)) continue;
      greens.push({ x, z, s: 0.14 + rand() * 0.12 });
    }
    return { buildings, greens };
  }, [lite]);

  useLayoutEffect(() => {
    const color = new THREE.Color();
    city.buildings.forEach((b, i) => {
      dummy.position.set(b.x, 0.15 + b.h / 2, b.z);
      dummy.scale.set(b.w, b.h, b.d);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      blocks.current?.setMatrixAt(i, dummy.matrix);
      blocks.current?.setColorAt(i, color.set(b.color));
    });
    if (blocks.current) {
      blocks.current.instanceMatrix.needsUpdate = true;
      if (blocks.current.instanceColor) blocks.current.instanceColor.needsUpdate = true;
    }
    city.greens.forEach((g, i) => {
      dummy.position.set(g.x, 0.15 + g.s, g.z);
      dummy.scale.setScalar(g.s);
      dummy.updateMatrix();
      trees.current?.setMatrixAt(i, dummy.matrix);
    });
    if (trees.current) trees.current.instanceMatrix.needsUpdate = true;
  }, [city]);

  useFrame((state, delta) => {
    p.current += (progress.current - p.current) * (1 - Math.exp(-delta * 3));
    const s = smooth(p.current);
    const t = state.clock.elapsedTime;

    // Top-down plan view → three-quarter view as the visitor scrolls. The map
    // is wide, so a narrow or short container pulls the camera further back.
    const aspect = size.width / Math.max(size.height, 1);
    const pull = Math.max(1, 1.35 / Math.min(aspect, 1.35));
    camera.position.set(
      (4.6 * s + state.pointer.x * 0.5) * pull,
      (9 - 4.6 * s + state.pointer.y * 0.3) * pull,
      (0.01 + 6.2 * s) * pull,
    );
    camera.lookAt(0, 0.3, 0);

    if (dropAt.current === null && progress.current > 0.02) dropAt.current = t;
    if (pin.current) {
      const since = dropAt.current === null ? -1 : t - dropAt.current;
      pin.current.position.y = pinHeight(since);
      pin.current.rotation.y = t * 0.8;
    }
    rings.current.forEach((ring, i) => {
      if (!ring) return;
      const life = (t * 0.55 + i * 0.5) % 1;
      ring.scale.setScalar(0.6 + life * 2.6);
      (ring.material as THREE.MeshBasicMaterial).opacity = (1 - life) * 0.55 * (dropAt.current === null ? 0 : 1);
    });
  });

  const blockGeo = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const treeGeo = useMemo(() => new THREE.SphereGeometry(1, 16, 12), []);

  return (
    <group>
      <RoundedBox args={[6.6, 0.3, 6.6]} radius={0.12} smoothness={4} position-y={0}>
        <meshStandardMaterial color={BRAND.creamDeep} roughness={0.9} />
      </RoundedBox>
      <mesh position={[0, 0.16, ROAD_Z]}>
        <boxGeometry args={[6.6, 0.02, 0.55]} />
        <meshStandardMaterial color="#e2cbb0" roughness={1} />
      </mesh>
      <mesh position={[ROAD_X, 0.16, 0]}>
        <boxGeometry args={[0.55, 0.02, 6.6]} />
        <meshStandardMaterial color="#e2cbb0" roughness={1} />
      </mesh>
      <instancedMesh ref={blocks} args={[blockGeo, undefined, city.buildings.length]}>
        <meshStandardMaterial roughness={0.7} />
      </instancedMesh>
      <instancedMesh ref={trees} args={[treeGeo, undefined, city.greens.length]}>
        <meshStandardMaterial color={BRAND.green} roughness={0.6} />
      </instancedMesh>

      {/* The cafe */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1, 0.7, 1]} />
        <meshPhysicalMaterial color={BRAND.orangeSoft} roughness={0.4} clearcoat={0.4} />
      </mesh>
      <mesh position={[0, 1.07, 0]} rotation-y={Math.PI / 4}>
        <coneGeometry args={[0.85, 0.45, 4]} />
        <meshStandardMaterial color={BRAND.ink} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.62, 0.51]}>
        <boxGeometry args={[0.9, 0.12, 0.06]} />
        <meshStandardMaterial color={BRAND.orange} />
      </mesh>

      {[0, 1].map((i) => (
        <mesh key={i} ref={(m) => { rings.current[i] = m; }} position-y={0.17} rotation-x={-Math.PI / 2}>
          <ringGeometry args={[0.55, 0.62, 64]} />
          <meshBasicMaterial color={BRAND.orange} transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}

      <group ref={pin} position={[0, DROP_FROM, 0]} scale={0.95}>
        <group position-y={0.9}>
          <mesh geometry={pinGeo}>
            <meshPhysicalMaterial color={BRAND.orange} roughness={0.18} clearcoat={1} clearcoatRoughness={0.1} />
          </mesh>
          <mesh position-y={1.15} rotation-x={Math.PI / 2}>
            <cylinderGeometry args={[0.2, 0.2, 1.04, 32]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
