"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { BRAND, seeded, smooth, span, windowed, type SceneProps } from "../util";

const CAMERA_START = 8;
const CAMERA_END = -20;

type Item = { field: THREE.Vector3; heart: THREE.Vector3; spin: THREE.Vector3; scale: number };

/** Classic parametric heart, scaled to sit a few units in front of the final camera. */
function heartPoint(t: number) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  return new THREE.Vector3(x * 0.11, y * 0.11 + 0.3, CAMERA_END - 6);
}

const dummy = new THREE.Object3D();
const tmp = new THREE.Vector3();

function Field({
  items,
  geometry,
  color,
  progress,
}: {
  items: Item[];
  geometry: THREE.BufferGeometry;
  color: string;
  progress: () => number;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);

  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    const s = progress();
    const t = state.clock.elapsedTime;
    // Ingredients part around the "philosophy" copy, then gather into a heart.
    const part = 1 + windowed(s, 0.28, 0.4, 0.56, 0.68) * 0.7;
    const gather = smooth(span(s, 0.72, 0.96));
    items.forEach((it, i) => {
      tmp.set(it.field.x * part, it.field.y * part, it.field.z);
      tmp.y += Math.sin(t * 0.6 + i) * 0.15;
      dummy.position.lerpVectors(tmp, it.heart, gather);
      dummy.rotation.set(it.spin.x * t, it.spin.y * t, it.spin.z * t);
      dummy.scale.setScalar(it.scale * (1 - gather * 0.45));
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[geometry, undefined, items.length]} frustumCulled={false}>
      <meshStandardMaterial color={color} roughness={0.35} />
    </instancedMesh>
  );
}

/**
 * /about. The camera flies forward through a field of fresh ingredients as the
 * story is read; they part around the food philosophy and gather into a heart
 * for "More Than Just Food".
 */
export default function IngredientJourney({ progress, lite }: SceneProps) {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const p = useRef(0);
  const per = lite ? 8 : 24;

  const kinds = useMemo(() => {
    const total = per * 4;
    const rand = seeded(41);
    const build = (offset: number) =>
      Array.from({ length: per }, (_, i): Item => {
        const angle = rand() * Math.PI * 2;
        const r = 1.9 + rand() * 4.5;
        return {
          field: new THREE.Vector3(Math.cos(angle) * r * 1.4, Math.sin(angle) * r * 0.85, 4 - rand() * 30),
          heart: heartPoint(((offset + i) / total) * Math.PI * 2),
          spin: new THREE.Vector3((rand() - 0.5) * 0.8, (rand() - 0.5) * 0.8, (rand() - 0.5) * 0.5),
          scale: 0.75 + rand() * 0.6,
        };
      });
    return { tomato: build(0), leaf: build(per), onion: build(per * 2), pepper: build(per * 3) };
  }, [per]);

  const geos = useMemo(
    () => ({
      tomato: new THREE.SphereGeometry(0.34, 24, 18).scale(1, 0.85, 1),
      leaf: new THREE.IcosahedronGeometry(0.42, 1).scale(1, 0.12, 0.6),
      onion: new THREE.TorusGeometry(0.28, 0.07, 12, 32),
      pepper: new THREE.CapsuleGeometry(0.11, 0.38, 6, 12),
    }),
    [],
  );

  const getP = () => p.current;

  useFrame((state, delta) => {
    p.current += (progress.current - p.current) * (1 - Math.exp(-delta * 3));
    const s = p.current;
    // A narrow container sees less width, so the flight path pulls back to keep
    // the field (and the heart it forms) inside the frame.
    const aspect = size.width / Math.max(size.height, 1);
    const pull = Math.max(0, 3.2 * (1 - Math.min(aspect, 1)));
    camera.position.set(
      state.pointer.x * 0.6,
      state.pointer.y * 0.35,
      CAMERA_START + (CAMERA_END - CAMERA_START) * smooth(s) + pull,
    );
    camera.lookAt(0, 0, camera.position.z - 6);
  });

  return (
    <>
      <fog attach="fog" args={["#fff9f2", 5, 20]} />
      <Field items={kinds.tomato} geometry={geos.tomato} color={BRAND.red} progress={getP} />
      <Field items={kinds.leaf} geometry={geos.leaf} color={BRAND.green} progress={getP} />
      <Field items={kinds.onion} geometry={geos.onion} color="#c98bb7" progress={getP} />
      <Field items={kinds.pepper} geometry={geos.pepper} color={BRAND.yellow} progress={getP} />
    </>
  );
}
