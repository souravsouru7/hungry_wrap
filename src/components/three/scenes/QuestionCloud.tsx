"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { BRAND, seeded, type SceneProps } from "../util";
import { useFitCamera } from "../useFitCamera";

// The "?" hook, traced as a curve and swept into a chunky tube.
const HOOK = new THREE.CatmullRomCurve3(
  [
    [-0.42, 0.62],
    [-0.36, 0.92],
    [-0.1, 1.08],
    [0.22, 1.06],
    [0.42, 0.86],
    [0.4, 0.6],
    [0.18, 0.42],
    [0.02, 0.28],
    [0, 0.05],
  ].map(([x, y]) => new THREE.Vector3(x, y, 0)),
);

const COLORS = [BRAND.orange, BRAND.ink, BRAND.orangeSoft];

type MarkProps = {
  base: THREE.Vector3;
  scale: number;
  color: string;
  dir: number;
  phase: number;
  flipped: { current: number[] };
  index: number;
  progress: () => number;
};

function Mark({ base, scale, color, dir, phase, flipped, index, progress }: MarkProps) {
  const group = useRef<THREE.Group>(null);
  const question = useRef<THREE.Group>(null);
  const bang = useRef<THREE.Group>(null);
  const flip = useRef(0);

  const tube = useMemo(() => new THREE.TubeGeometry(HOOK, 64, 0.13, 16), []);
  const end = HOOK.getPoint(1);
  const startPoint = HOOK.getPoint(0);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const s = progress();
    const t = state.clock.elapsedTime;
    const target = flipped.current[index] ?? 0;
    flip.current += (target - flip.current) * (1 - Math.exp(-delta * 6));

    const scatter = 1 + s * 0.9;
    g.position.set(
      base.x * scatter + state.pointer.x * 0.4 * (1 + base.z * 0.2),
      base.y * scatter + Math.sin(t * 0.8 + phase) * 0.2 + state.pointer.y * 0.25,
      base.z,
    );
    g.rotation.set(
      Math.sin(t * 0.5 + phase) * 0.15,
      dir * (s * Math.PI * 2 + Math.sin(t * 0.4 + phase) * 0.4) + flip.current * Math.PI,
      Math.sin(t * 0.3 + phase) * 0.1,
    );
    // Swap the glyph at the half-turn, edge-on, so the flip reads as one motion.
    const showBang = flip.current > 0.5;
    if (question.current) question.current.visible = !showBang;
    if (bang.current) bang.current.visible = showBang;
  });

  return (
    <group ref={group} scale={scale}>
      <group ref={question} position-y={-0.4}>
        <mesh geometry={tube}>
          <meshPhysicalMaterial color={color} roughness={0.25} clearcoat={1} />
        </mesh>
        <mesh position={startPoint}>
          <sphereGeometry args={[0.13, 16, 12]} />
          <meshPhysicalMaterial color={color} roughness={0.25} clearcoat={1} />
        </mesh>
        <mesh position={end}>
          <sphereGeometry args={[0.13, 16, 12]} />
          <meshPhysicalMaterial color={color} roughness={0.25} clearcoat={1} />
        </mesh>
        <mesh position-y={-0.3}>
          <sphereGeometry args={[0.16, 20, 16]} />
          <meshPhysicalMaterial color={color} roughness={0.25} clearcoat={1} />
        </mesh>
      </group>
      {/* The answer-found "!" — green, on the back face of the flip */}
      <group ref={bang} position-y={-0.4} visible={false}>
        <mesh position-y={0.58}>
          <capsuleGeometry args={[0.15, 0.72, 8, 16]} />
          <meshPhysicalMaterial color={BRAND.green} roughness={0.25} clearcoat={1} />
        </mesh>
        <mesh position-y={-0.3}>
          <sphereGeometry args={[0.16, 20, 16]} />
          <meshPhysicalMaterial color={BRAND.green} roughness={0.25} clearcoat={1} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * /faq. A cloud of glossy question marks drifts behind the questions, spinning
 * and scattering with scroll. Opening an answer flips one "?" into a green "!".
 */
export default function QuestionCloud({ progress, lite }: SceneProps) {
  const p = useRef(0);
  useFitCamera(5.2);
  const flipped = useRef<number[]>([]);
  const count = lite ? 5 : 10;

  const marks = useMemo(() => {
    const rand = seeded(57);
    return Array.from({ length: count }, (_, i) => {
      const side = i % 2 === 0 ? -1 : 1;
      return {
        base: new THREE.Vector3(side * (3.2 + rand() * 3), (rand() - 0.5) * 6, -3 + rand() * 3.5),
        scale: 0.7 + rand() * 0.7,
        color: COLORS[i % COLORS.length],
        dir: rand() > 0.5 ? 1 : -1,
        phase: rand() * 10,
      };
    });
  }, [count]);

  // <details> toggle events don't bubble, but they do pass through the capture phase.
  useEffect(() => {
    const onToggle = (event: Event) => {
      const el = event.target as HTMLDetailsElement | null;
      const raw = el?.dataset?.faqIndex;
      if (raw === undefined) return;
      const next = [...flipped.current];
      next[Number(raw) % count] = el!.open ? 1 : 0;
      flipped.current = next;
    };
    document.addEventListener("toggle", onToggle, true);
    return () => document.removeEventListener("toggle", onToggle, true);
  }, [count]);

  useFrame((_, delta) => {
    p.current += (progress.current - p.current) * (1 - Math.exp(-delta * 3));
  });

  const getP = () => p.current;

  return (
    <>
      {marks.map((m, i) => (
        <Mark key={i} index={i} flipped={flipped} progress={getP} {...m} />
      ))}
    </>
  );
}
